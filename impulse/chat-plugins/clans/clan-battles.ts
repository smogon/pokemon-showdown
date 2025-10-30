/*
* Pokemon Showdown
* Clans Battle Hook
*/
import { Clans, UserClans, ClanBattleLogs, ClanWars } from './database';
import type { ClanBattleLogEntry, Clan } from './interface';
import { Utils } from '../../../lib';
import { K_FACTOR, getExpectedScore, calculateElo } from './utils';

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

	const winsNeeded = Math.ceil(war.bestOf / 2);
	const newWinnerScore = (war.scores[winnerClanId] || 0) + 1;
	const newLoserScore = war.scores[loserClanId] || 0;

	const winnerName = Users.get(winner)?.name || winner;
	const loserName = Users.get(loser)?.name || loser;

	if (newWinnerScore === winsNeeded) {
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

			const warScore = `(Final Score: ${newWinnerScore} - ${newLoserScore})`;
			const winMessage = `|html|<div class="broadcast-green"><center><strong>POKEMON WAR VICTORY! (+${eloChange} ELO)</strong><br />${warScore}<br />Trainer ${Utils.escapeHTML(winnerName)} defeats ${Utils.escapeHTML(loserName)}!<br />${winnerClan.name} emerges victorious and claims glory over ${loserClan.name}!<br />New Clan Rating: ${Math.floor(newWinnerElo)} ELO</center></div>`;
			const lossMessage = `|html|<div class="broadcast-red"><center><strong>POKEMON WAR DEFEAT. (-${eloChange} ELO)</strong><br />${warScore}<br />Trainer ${Utils.escapeHTML(loserName)} falls to ${Utils.escapeHTML(winnerName)}!<br />${loserClan.name} is overcome by ${winnerClan.name}. The war is lost.<br />New Clan Rating: ${Math.floor(newLoserElo)} ELO</center></div>`;

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

			const [winnerClan, loserClan] = await Promise.all([
				Clans.findOne({ _id: winnerClanId }),
				Clans.findOne({ _id: loserClanId }),
			]);
			if (!winnerClan || !loserClan) return;

			const warScore = `(War Score: ${newWinnerScore} - ${newLoserScore} of ${war.bestOf})`;
			const winMessage = `|html|<div class="broadcast-green"><center><strong>War Battle Victory!</strong> ${warScore}<br />Trainer ${Utils.escapeHTML(winnerName)} claims victory against ${Utils.escapeHTML(loserName)} from ${loserClan.name}!<br />The battle advances the war effort for ${winnerClan.name}!</center></div>`;
			const lossMessage = `|html|<div class="broadcast-red"><center><strong>War Battle Defeat</strong> ${warScore}<br />Trainer ${Utils.escapeHTML(loserName)} falls to ${Utils.escapeHTML(winnerName)} from ${winnerClan.name}.<br />The war continues for ${loserClan.name}.</center></div>`;

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

/**
 * Chat handler registration for the plugin.
 */
export const handlers: Chat.Handlers = {
	onBattleEnd: handleClanBattleEnd,
};
