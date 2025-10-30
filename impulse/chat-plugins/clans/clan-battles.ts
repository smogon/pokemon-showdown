/*
 * Clan Battles Plugin
 *
 * This plugin hooks into battle endings to track clan-vs-clan battles
 * during an active war, updating ELO and war scores.
 */
import { Clans, UserClans, ClanBattleLogs, ClanWars } from '../clans/database';
import type { ClanBattleLogEntry, Clan } from '../clans/interface';
import { Utils } from '../../lib';

// --- ELO Calculation ---
const K_FACTOR = 32; // Standard ELO K-factor

/**
 * Calculates the expected score for player A against player B.
 * @param eloA Player A's ELO
 * @param eloB Player B's ELO
 * @returns The probability of player A winning (0 to 1)
 */
function getExpectedScore(eloA: number, eloB: number): number {
	return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

/**
 * Calculates the new ELO ratings for a winner and a loser.
 * @param winnerElo Winner's current ELO
 * @param loserElo Loser's current ELO
 * @returns [newWinnerElo, newLoserElo, eloChange]
 */
function calculateElo(winnerElo: number, loserElo: number): [number, number, number] {
	const expectedWinner = getExpectedScore(winnerElo, loserElo);

	// Calculate ELO change
	// We use Math.max(1, ...) to ensure a minimum of 1 ELO is always gained/lost
	const eloChange = Math.max(1, Math.round(K_FACTOR * (1 - expectedWinner)));

	const newWinnerElo = winnerElo + eloChange;
	const newLoserElo = loserElo - eloChange;

	return [newWinnerElo, newLoserElo, eloChange];
}
// --- End ELO Calculation ---


async function handleClanBattleEnd(battle: RoomBattle, winner: ID, players: ID[]) {
    // 1. Initial Validation
    if (players.length !== 2 || battle.tour) return;
    const [p1, p2] = players;
    const loser = (winner === p1) ? p2 : p1;
    if (!winner || !loser) return;

    // 2. Get Clan Info
    const [winnerClanInfo, loserClanInfo] = await Promise.all([
        UserClans.findOne({ _id: winner }),
        UserClans.findOne({ _id: loser }),
    ]);
    const winnerClanId = winnerClanInfo?.memberOf;
    const loserClanId = loserClanInfo?.memberOf;
    if (!winnerClanId || !loserClanId || winnerClanId === loserClanId) {
        return; // Not a battle between two different clans
    }

    // 3. Check for Active War
    const war = await ClanWars.findOne({
        clans: { $all: [winnerClanId, loserClanId] },
        status: 'active',
    });
    // Not an active war, OR war has no 'bestOf' (old data/error)
    if (!war || !war.bestOf) {
        return;
    }

    // 4. This is a valid War battle!
    const winsNeeded = Math.ceil(war.bestOf / 2); // e.g., Bo5 -> 3. Bo3 -> 2.
    const newWinnerScore = (war.scores[winnerClanId] || 0) + 1;
    const newLoserScore = war.scores[loserClanId] || 0;

    const winnerName = Users.get(winner)?.name || winner;
    const loserName = Users.get(loser)?.name || loser;

    // *** NEW LOGIC: Check if this battle ends the war ***
    if (newWinnerScore === winsNeeded) {
        // --- WAR IS OVER ---
        // Get full clan docs to read their ELO
        const [winnerClan, loserClan] = await Promise.all([
            Clans.findOne({ _id: winnerClanId }),
            Clans.findOne({ _id: loserClanId }),
        ]);
        if (!winnerClan || !loserClan) {
            Monitor.crashlog(new Error("War battle ended but a clan was missing."), "Clan War Battle End Handler");
            return;
        }

        // 1. Calculate ELO
        const winnerOldElo = winnerClan.stats.elo || 1000;
        const loserOldElo = loserClan.stats.elo || 1000;
        const [newWinnerElo, newLoserElo, eloChange] = calculateElo(winnerOldElo, loserOldElo);

        // 2. Create the log entry
        const battleLogEntry: Omit<ClanBattleLogEntry, '_id'> = {
            timestamp: Date.now(),
            winningClan: winnerClanId,
            losingClan: loserClanId,
            winner: winner,
            loser: loser,
            format: battle.format,
            battleID: battle.roomid,
            warId: war._id,
            eloChangeWinner: eloChange,
            eloChangeLoser: -eloChange,
            isWarWinningBattle: true,
        };

        // 3. Update Database
        try {
            await Promise.all([
                // Update winner's clan: SET new ELO, INC wins
                Clans.updateOne(
                    { _id: winnerClanId },
                    {
                        $set: { 'stats.elo': newWinnerElo },
                        $inc: { 'stats.clanBattleWins': 1 },
                    }
                ),
                // Update loser's clan: SET new ELO, INC losses
                Clans.updateOne(
                    { _id: loserClanId },
                    {
                        $set: { 'stats.elo': newLoserElo },
                        $inc: { 'stats.clanBattleLosses': 1 },
                    }
                ),
                // Update war doc: Set 'completed', end date, and final score
                ClanWars.updateOne(
                    { _id: war._id },
                    {
                        $set: { status: 'completed', endDate: Date.now() },
                        $inc: { [`scores.${winnerClanId}`]: 1 },
                    }
                ),
                // Log the battle
                ClanBattleLogs.insertOne(battleLogEntry),
            ]);

            // 4. Announce War Win
            const warScore = `(Final Score: ${newWinnerScore} - ${newLoserScore})`;
            const winMessage = `|html|<div class="broadcast-green"><strong>WAR WON! (+${eloChange} ELO)</strong> ${warScore}<br />` +
                               `${Utils.escapeHTML(winnerName)} defeated ${Utils.escapeHTML(loserName)} to win the war for ${winnerClan.name}! ` +
                               `New Clan ELO: ${Math.floor(newWinnerElo)}</div>`;
            const lossMessage = `|html|<div class="broadcast-red"><strong>WAR LOST. (-${eloChange} ELO)</strong> ${warScore}<br />` +
                                `${Utils.escapeHTML(loserName)} lost the final battle to ${Utils.escapeHTML(winnerName)}. ${loserClan.name} loses the war. ` +
                                `New Clan ELO: ${Math.floor(newLoserElo)}</div>`;

            const winnerRoom = Rooms.get(winnerClan.chatRoom);
            const loserRoom = Rooms.get(loserClan.chatRoom);
            if (winnerRoom) winnerRoom.add(winMessage).update();
            if (loserRoom) loserRoom.add(lossMessage).update();

        } catch (e) {
            Monitor.crashlog(e as Error, "Clan War ELO Battle End Handler (War End)", {
                battleID: battle.roomid,
                warId: war._id,
            });
        }

    } else {
        // --- WAR CONTINUES ---
        
        // 1. Create the log entry (no ELO change)
        const battleLogEntry: Omit<ClanBattleLogEntry, '_id'> = {
            timestamp: Date.now(),
            winningClan: winnerClanId,
            losingClan: loserClanId,
            winner: winner,
            loser: loser,
            format: battle.format,
            battleID: battle.roomid,
            warId: war._id,
            eloChangeWinner: 0,
            eloChangeLoser: 0,
            isWarWinningBattle: false,
        };

        // 2. Update Database
        try {
            await Promise.all([
                // Update war doc: Just increment score
                ClanWars.updateOne(
                    { _id: war._id },
                    { $inc: { [`scores.${winnerClanId}`]: 1 } }
                ),
                // Log the battle
                ClanBattleLogs.insertOne(battleLogEntry),
            ]);

            // 3. Announce Battle Win
            const [winnerClan, loserClan] = await Promise.all([
                Clans.findOne({ _id: winnerClanId }),
                Clans.findOne({ _id: loserClanId }),
            ]);
            if (!winnerClan || !loserClan) return; // Should not happen

            const warScore = `(War Score: ${newWinnerScore} - ${newLoserScore} of ${war.bestOf})`;
            const winMessage = `|html|<div class="infobox"><strong><span style="color:green;">War Battle Win!</span></strong> ${warScore}<br />` +
                               `${Utils.escapeHTML(winnerName)} defeated ${Utils.escapeHTML(loserName)} (clan ${loserClan.name})!</div>`;
            const lossMessage = `|html|<div class="infobox"><strong><span style="color:red;">War Battle Loss</span></strong> ${warScore}<br />` +
                                `${Utils.escapeHTML(loserName)} lost to ${Utils.escapeHTML(winnerName)} (clan ${winnerClan.name}).</div>`;

            const winnerRoom = Rooms.get(winnerClan.chatRoom);
            const loserRoom = Rooms.get(loserClan.chatRoom);
            if (winnerRoom) winnerRoom.add(winMessage).update();
            if (loserRoom) loserRoom.add(lossMessage).update();

        } catch (e) {
            Monitor.crashlog(e as Error, "Clan War ELO Battle End Handler (War Continue)", {
                battleID: battle.roomid,
                warId: war._id,
            });
        }
    }
}

// Register the handler
export const handlers: Handlers = {
    onBattleEnd: handleClanBattleEnd,
};
