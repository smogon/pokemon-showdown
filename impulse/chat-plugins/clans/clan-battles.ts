/*
* Pokemon Showdown
* Clans Battle Hook
*/
import { Clans, UserClans, ClanBattleLogs, ClanWars } from './database';
import type { ClanBattleLogEntry, Clan, ClanWar } from './interface';
import { Utils } from '../../../lib';
import { K_FACTOR, getExpectedScore, calculateElo, generateWarCard } from './utils';

/**
 * Handles the end of a battle between two users, checking if it is a clan war battle,
 * updating war scores, ELO ratings (if the war ends), and announcing the results.
 * @param battle The battle room object.
 * @param winner The ID of the winning user.
 * @param players The IDs of all players in the battle (expected to be two).
 */
async function handleClanBattleEnd(battle: RoomBattle, winner: ID, players: ID[]) {
	if (players.length !== 2 || battle.tour) return;
	const [p1, p2] = players;
	const loser = (winner === p1) ? p2 : p1;
	if (!winner || !loser) return;

	const [winnerClanInfo, loserClanInfo] = await Promise.all([
		UserClans.findOne({ _id: winner }),
		UserClans.findOne({ _id: loser }),
	]);
	const winnerClanId = winnerClanInfo?.memberOf;
	const loserClanId = loserClanInfo?.memberOf;
	if (!winnerClanId || !loserClanId || winnerClanId === loserClanId) {
		return;
	}

	const war = await ClanWars.findOne({
		clans: { $all: [winnerClanId, loserClanId] },
		status: 'active',
	});
	if (!war || !war.bestOf || war.paused) {
		return;
	}

	const uhtmlId = `clan-war-card-${war._id}`;
	const winsNeeded = Math.ceil(war.bestOf / 2);
	const newWinnerScore = (war.scores[winnerClanId] || 0) + 1;
	const newLoserScore = war.scores[loserClanId] || 0;

	// Get names for the battle log message
	const winnerName = Users.get(winner)?.name || winner;
	const loserName = Users.get(loser)?.name || loser;

	if (newWinnerScore === winsNeeded) {
		// WAR ENDS
		const [winnerClan, loserClan] = await Promise.all([
			Clans.findOne({ _id: winnerClanId }),
			Clans.findOne({ _id: loserClanId }),
		]);
		if (!winnerClan || !loserClan) {
			Monitor.crashlog(new Error("War battle ended but a clan was missing."), "Clan War Battle End Handler");
			return;
		}

		const winnerOldElo = winnerClan.stats.elo || 1000;
		const loserOldElo = loserClan.stats.elo || 1000;
		const [newWinnerElo, newLoserElo, eloChange] = calculateElo(winnerOldElo, loserOldElo);

		const battleLogEntry: Omit<ClanBattleLogEntry, '_id'> = {
			timestamp: Date.now(),
			winningClan: winnerClanId,
			losingClan: loserClanId,
			winner,
			loser,
			format: battle.format,
			battleID: battle.roomid,
			warId: war._id,
			eloChangeWinner: eloChange,
			eloChangeLoser: -eloChange,
			isWarWinningBattle: true,
		};

		try {
			await Promise.all([
				Clans.updateOne(
					{ _id: winnerClanId },
					{
						$set: { 'stats.elo': newWinnerElo },
						$inc: { 'stats.clanBattleWins': 1 },
					}
				),
				Clans.updateOne(
					{ _id: loserClanId },
					{
						$set: { 'stats.elo': newLoserElo },
						$inc: { 'stats.clanBattleLosses': 1 },
					}
				),
				ClanWars.updateOne(
					{ _id: war._id },
					{
						$set: { status: 'completed', endDate: Date.now() },
						$inc: { [`scores.${winnerClanId}`]: 1 },
					}
				),
				ClanBattleLogs.insertOne(battleLogEntry),
			]);

			// Update UHTML card
			// We need clan1 (challenger) and clan2 (target)
			const [clan1, clan2] = await Promise.all([
				Clans.findOne({ _id: war.clans[0] }),
				Clans.findOne({ _id: war.clans[1] }),
			]);
			if (!clan1 || !clan2) return; // Should not happen

			const warScore = `(Final Score: ${newWinnerScore} - ${newLoserScore})`;
			const endMessage = `${winnerClan.name} emerges victorious over ${loserClan.name}! ${warScore}`;
			
			// Manually update local war object for card generation
			war.status = 'completed';
			war.scores[winnerClanId] = newWinnerScore;
			war.scores[loserClanId] = newLoserScore; // Ensure loser score is also set for the card

			const endedHtml = generateWarCard(war, clan1, clan2, 'ended', { endMessage });

			const winnerRoom = Rooms.get(winnerClan.chatRoom);
			const loserRoom = Rooms.get(loserClan.chatRoom);
			if (winnerRoom) {
				winnerRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
			}
			if (loserRoom) {
				loserRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
			}
		} catch (e) {
			Monitor.crashlog(e as Error, "Clan War ELO Battle End Handler (War End)", {
				battleID: battle.roomid,
				warId: war._id,
			});
		}
	} else {
		// WAR CONTINUES
		const battleLogEntry: Omit<ClanBattleLogEntry, '_id'> = {
			timestamp: Date.now(),
			winningClan: winnerClanId,
			losingClan: loserClanId,
			winner,
			loser,
			format: battle.format,
			battleID: battle.roomid,
			warId: war._id,
			eloChangeWinner: 0,
			eloChangeLoser: 0,
			isWarWinningBattle: false,
		};

		try {
			await Promise.all([
				ClanWars.updateOne(
					{ _id: war._id },
					{ $inc: { [`scores.${winnerClanId}`]: 1 } }
				),
				ClanBattleLogs.insertOne(battleLogEntry),
			]);

			// Get winner/loser clan objects
			const [winnerClan, loserClan, updatedWar] = await Promise.all([
				Clans.findOne({ _id: winnerClanId }),
				Clans.findOne({ _id: loserClanId }),
				ClanWars.findOne({ _id: war._id }), // Re-fetch the war to get the new score
			]);
			if (!winnerClan || !loserClan || !updatedWar) return;

			// *** NEW: Create Last Battle Info ***
			const lastBattle = { winnerName, loserName, winningClanName: winnerClan.name };

			// Update UHTML card
			const [clan1, clan2] = await Promise.all([
				Clans.findOne({ _id: updatedWar.clans[0] }), // Challenger
				Clans.findOne({ _id: updatedWar.clans[1] }), // Target
			]);
			if (!clan1 || !clan2) return; // Should not happen

			const challengerHtml = generateWarCard(updatedWar, clan1, clan2, 'challenger', { lastBattle });
			const targetHtml = generateWarCard(updatedWar, clan1, clan2, 'target', { lastBattle });
			
			// Determine which room gets which HTML
			const challengerRoom = Rooms.get(clan1.chatRoom);
			const targetRoom = Rooms.get(clan2.chatRoom);

			if (challengerRoom) {
				challengerRoom.add(`|uhtmlchange|${uhtmlId}|${challengerHtml}`).update();
			}
			if (targetRoom) {
				targetRoom.add(`|uhtmlchange|${uhtmlId}|${targetHtml}`).update();
			}
		} catch (e) {
			Monitor.crashlog(e as Error, "Clan War ELO Battle End Handler (War Continue)", {
				battleID: battle.roomid,
				warId: war._id,
			});
		}
	}
}

/**
 * Chat handler registration for the plugin.
 */
export const handlers: Chat.Handlers = {
	onBattleEnd: handleClanBattleEnd,
};
