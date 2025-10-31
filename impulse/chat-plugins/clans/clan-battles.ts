/*
* Pokemon Showdown
* Clans Battle Hook
*/
import { Clans, UserClans, ClanBattleLogs, ClanWars } from './database';
import type { ClanBattleLogEntry, Clan } from './interface';
import { Utils } from '../../../lib';
import { K_FACTOR, getExpectedScore, calculateElo } from './utils';

/**
 * Generates a unique UHTML ID for a given Clan War document.
 * This should match the helper in war-commands.ts.
 * @param warId The unique _id of the ClanWar document.
 * @returns A stable, unique string for UHTML announcements.
 */
function generateWarUhtmlId(warId: ID): string {
	return `clanwar-${warId}`;
}

/**
 * Generates the HTML content for an active war's current score.
 * @param challengerClan The challenging clan object.
 * @param targetClan The challenged clan object.
 * @param war The ClanWar object.
 * @param messageLine The highlighted message about the latest battle.
 * @param battleResultColor The color for the battle result line.
 */
function generateWarActiveMessage(
	challengerClan: Clan,
	targetClan: Clan,
	war: ClanWar,
	messageLine: string,
	battleResultColor: string
): string {
	const winsNeeded = Math.ceil(war.bestOf / 2);
	const c1Score = war.scores[challengerClan.id] || 0;
	const c2Score = war.scores[targetClan.id] || 0;

	return `<div class="broadcast-blue"><center><strong>POKEMON WAR ACTIVE</strong><br />` +
		`<strong style="font-size: 1.3em;">${challengerClan.name}</strong> vs <strong style="font-size: 1.3em;">${targetClan.name}</strong><br />` +
		`<strong>Best of ${war.bestOf}</strong> — First clan to win <strong>${winsNeeded}</strong> battles wins the war!<br />` +
		`<strong style="color: ${battleResultColor};">${messageLine}</strong><br />` +
		`<strong>Current Score:</strong> ${challengerClan.name} ${c1Score} - ${c2Score} ${targetClan.name}` +
		`</center></div>`;
}

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

	const [clan1, clan2] = war.clans[0] === winnerClanId ?
		[war.clans[0], war.clans[1]] :
		[war.clans[1], war.clans[0]];

	const [challengerClan, targetClan] = await Promise.all([
		Clans.findOne({ _id: clan1 }),
		Clans.findOne({ _id: clan2 }),
	]);

	if (!challengerClan || !targetClan) {
		Monitor.crashlog(new Error("War battle ended but a clan was missing."), "Clan War Battle End Handler");
		return;
	}

	const winsNeeded = Math.ceil(war.bestOf / 2);
	const newWinnerScore = (war.scores[winnerClanId] || 0) + 1;
	const newLoserScore = war.scores[loserClanId] || 0;

	const winnerName = Users.get(winner)?.name || winner;
	const loserName = Users.get(loser)?.name || loser;
	const uhtmlId = generateWarUhtmlId(war._id);

	if (newWinnerScore === winsNeeded) {
		// --- WAR END SCENARIO ---
		const winnerOldElo = challengerClan.id === winnerClanId ? challengerClan.stats.elo || 1000 : targetClan.stats.elo || 1000;
		const loserOldElo = challengerClan.id === loserClanId ? challengerClan.stats.elo || 1000 : targetClan.stats.elo || 1000;
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
			// Update winner stats
			await Clans.updateOne(
				{ _id: winnerClanId },
				{
					$set: { 'stats.elo': newWinnerElo },
					$inc: { 'stats.clanBattleWins': 1 },
				}
			);
			// Update loser stats
			await Clans.updateOne(
				{ _id: loserClanId },
				{
					$set: { 'stats.elo': newLoserElo },
					$inc: { 'stats.clanBattleLosses': 1 },
				}
			);
			// Update war status and final score
			await ClanWars.updateOne(
				{ _id: war._id },
				{
					$set: { status: 'completed', endDate: Date.now() },
					$inc: { [`scores.${winnerClanId}`]: 1 },
				}
			);
			await ClanBattleLogs.insertOne(battleLogEntry);

			const warScore = `(Final Score: ${newWinnerScore} - ${newLoserScore})`;

			// Message to display in both clan rooms (UHTML update)
			const finalMessage = `|uhtmlchange|${uhtmlId}|<div class="broadcast-green"><center><strong>POKEMON WAR VICTORY! (+${eloChange} ELO)</strong><br />${warScore}<br />Trainer ${Utils.escapeHTML(winnerName)} defeats ${Utils.escapeHTML(loserName)}!<br />${challengerClan.name} vs ${targetClan.name}: <strong>${winnerClanId === challengerClan.id ? challengerClan.name : targetClan.name}</strong> emerges victorious and claims glory!<br />New Clan Rating: ${Math.floor(newWinnerElo)} ELO</center></div>`;

			const winnerRoom = Rooms.get(challengerClan.chatRoom);
			const loserRoom = Rooms.get(targetClan.chatRoom);
			if (winnerRoom) winnerRoom.add(finalMessage, -2000).update();
			if (loserRoom) loserRoom.add(finalMessage, -2000).update();
		} catch (e) {
			Monitor.crashlog(e as Error, "Clan War ELO Battle End Handler (War End)", {
				battleID: battle.roomid,
				warId: war._id,
			});
		}
	} else {
		// --- WAR CONTINUE SCENARIO (BATTLE WIN) ---
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
			await ClanWars.updateOne(
				{ _id: war._id },
				{ $inc: { [`scores.${winnerClanId}`]: 1 } }
			);
			await ClanBattleLogs.insertOne(battleLogEntry);

			// Re-fetch war to get the current scores after update
			const currentWar = await ClanWars.findOne({ _id: war._id }) || war;
			
			const messageLine = `Trainer ${Utils.escapeHTML(winnerName)} claims victory against ${Utils.escapeHTML(loserName)}!`;

			const newMessage = generateWarActiveMessage(
				challengerClan, 
				targetClan, 
				{ ...currentWar, scores: { [winnerClanId]: newWinnerScore, [loserClanId]: newLoserScore } as any }, 
				messageLine, 
				'green'
			);

			const uhtmlUpdate = `|uhtmlchange|${uhtmlId}|${newMessage}`;
			
			const winnerRoom = Rooms.get(challengerClan.chatRoom);
			const loserRoom = Rooms.get(targetClan.chatRoom);
			
			if (winnerRoom) winnerRoom.add(uhtmlUpdate, -2000).update();
			if (loserRoom) loserRoom.add(uhtmlUpdate, -2000).update();

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
