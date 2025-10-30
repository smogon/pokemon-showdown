/*
 * Clan Battles Plugin
 *
 * This plugin hooks into battle events to track clan-vs-clan battles
 * during an active war, updating ELO and war scores, and announcing starts/ends.
 */
import { Clans, UserClans, ClanBattleLogs, ClanWars } from './database';
import type { ClanBattleLogEntry, Clan } from './interface';
import { Utils } from '../../../lib';
import { K_FACTOR, getExpectedScore, calculateElo } from './utils';

async function handleClanBattleStart(room: GameRoom) {
    // 1. Initial Validation
    const battle = room.battle;
    if (!battle || battle.players.length !== 2) return;

    const [p1, p2] = battle.players;
    if (!p1?.userid || !p2?.userid) return; // Ensure both players are users

    // 2. Get Clan Info
    const [p1ClanInfo, p2ClanInfo] = await Promise.all([
        UserClans.findOne({ _id: p1.userid }),
        UserClans.findOne({ _id: p2.userid }),
    ]);
    const p1ClanId = p1ClanInfo?.memberOf;
    const p2ClanId = p2ClanInfo?.memberOf;

    if (!p1ClanId || !p2ClanId || p1ClanId === p2ClanId) {
        return; // Not a battle between two different clans
    }

    // 3. Check for Active War
    const war = await ClanWars.findOne({
        clans: { $all: [p1ClanId, p2ClanId] },
        status: 'active',
    });

    // Not an active war, or war is paused
    if (!war || war.paused) {
        return;
    }

    // 4. Announce Battle Start
    try {
        const [clan1, clan2] = await Promise.all([
            Clans.findOne({ _id: p1ClanId }),
            Clans.findOne({ _id: p2ClanId }),
        ]);
        if (!clan1 || !clan2) return; // Clan deleted?

        const p1Name = p1.name || p1.userid;
        const p2Name = p2.name || p2.userid;

        const message = `|html|<div class="broadcast-green"><center><strong>Clan War Battle Started!</strong><br />` +
                       `${Utils.escapeHTML(p1Name)} (${clan1.name}) vs ${Utils.escapeHTML(p2Name)} (${clan2.name}) in ${battle.format}.</center></div>`;

        const room1 = Rooms.get(clan1.chatRoom);
        const room2 = Rooms.get(clan2.chatRoom);
        if (room1) room1.add(message).update();
        if (room2) room2.add(message).update();

    } catch (e) {
        Monitor.crashlog(e as Error, "Clan War Battle Start Handler", {
            battleID: room.roomid,
            warId: war._id,
            players: [p1.userid, p2.userid],
        });
    }
}


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
    // Not an active war, OR war has no 'bestOf' (old data/error), OR war is paused
    if (!war || !war.bestOf || war.paused) {
        return;
    }

    // 4. This is a valid War battle!
    const winsNeeded = Math.ceil(war.bestOf / 2); // e.g., Bo5 -> 3. Bo3 -> 2.
    const newWinnerScore = (war.scores[winnerClanId] || 0) + 1;
    const newLoserScore = war.scores[loserClanId] || 0;

    const winnerName = Users.get(winner)?.name || winner;
    const loserName = Users.get(loser)?.name || loser;

    // *** Check if this battle ends the war ***
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
            const winMessage = `|html|<div class="broadcast-green"><center><strong>WAR WON! (+${eloChange} ELO)</strong> ${warScore}<br />` +
                               `${Utils.escapeHTML(winnerName)} defeated ${Utils.escapeHTML(loserName)} to win the war for ${winnerClan.name}! ` +
                               `New Clan ELO: ${Math.floor(newWinnerElo)}</center></div>`;
            const lossMessage = `|html|<div class="broadcast-red"><center><strong>WAR LOST. (-${eloChange} ELO)</strong> ${warScore}<br />` +
                                `${Utils.escapeHTML(loserName)} lost the final battle to ${Utils.escapeHTML(winnerName)}. ${loserClan.name} loses the war. ` +
                                `New Clan ELO: ${Math.floor(newLoserElo)}</center></div>`;

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
            const winMessage = `|html|<div class="broadcast-green"><center><strong><span style="color:green;">War Battle Win!</span></strong> ${warScore}<br />` +
                               `${Utils.escapeHTML(winnerName)} defeated ${Utils.escapeHTML(loserName)} (clan ${loserClan.name})!</center></div>`;
            const lossMessage = `|html|<div class="broadcast-red"><center><strong><span style="color:red;">War Battle Loss</span></strong> ${warScore}<br />` +
                                `${Utils.escapeHTML(loserName)} lost to ${Utils.escapeHTML(winnerName)} (clan ${winnerClan.name}).</center></div>`;

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

// Register the handlers
export const handlers: Chat.Handlers = {
    // Note: The `user` parameter in onBattleStart refers to the user who triggered the event,
    // which isn't necessarily one of the players in the battle (e.g., if started by command).
    // We only need the room object to get the battle details.
    onBattleStart: (user: User, room: GameRoom) => void handleClanBattleStart(room),
    onBattleEnd: handleClanBattleEnd,
};
