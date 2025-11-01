import { Clans, UserClans, ClanBattleLogs, ClanWars } from './database';
import type { ClanBattleLogEntry, Clan, ClanWar } from './interface';
import { Utils } from '../../../lib';
import { K_FACTOR, getExpectedScore, calculateElo, generateWarCard } from './utils';

const LOBBY_ROOM_ID = 'lobby' as RoomID;

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

			const [clan1, clan2] = await Promise.all([
				Clans.findOne({ _id: war.clans[0] }),
				Clans.findOne({ _id: war.clans[1] }),
			]);
			if (!clan1 || !clan2) return;

			const warScore = `(Final Score: ${newWinnerScore} - ${newLoserScore})`;
			const endMessage = `${winnerClan.name} emerges victorious over ${loserClan.name}! ${warScore}`;

			war.status = 'completed';
			war.scores[winnerClanId] = newWinnerScore;
			war.scores[loserClanId] = newLoserScore;

			const endedHtml = generateWarCard(war, clan1, clan2, 'ended', { endMessage });

			const winnerRoom = Rooms.get(winnerClan.chatRoom);
			const loserRoom = Rooms.get(loserClan.chatRoom);
			const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);
			if (winnerRoom) {
				winnerRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
			}
			if (loserRoom) {
				loserRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update(10000);
			}
			if (lobbyRoom) {
				lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${endedHtml}`).update();
			}
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

			const [winnerClan, loserClan, updatedWar] = await Promise.all([
				Clans.findOne({ _id: winnerClanId }),
				Clans.findOne({ _id: loserClanId }),
				ClanWars.findOne({ _id: war._id }),
			]);
			if (!winnerClan || !loserClan || !updatedWar) return;

			const lastBattle = { winnerName, loserName, winningClanName: winnerClan.name };

			const [clan1, clan2] = await Promise.all([
				Clans.findOne({ _id: updatedWar.clans[0] }),
				Clans.findOne({ _id: updatedWar.clans[1] }),
			]);
			if (!clan1 || !clan2) return;

			const challengerHtml = generateWarCard(updatedWar, clan1, clan2, 'challenger', { lastBattle });
			const targetHtml = generateWarCard(updatedWar, clan1, clan2, 'target', { lastBattle });
			const publicHtml = generateWarCard(updatedWar, clan1, clan2, 'public', { lastBattle });

			const challengerRoom = Rooms.get(clan1.chatRoom);
			const targetRoom = Rooms.get(clan2.chatRoom);
			const lobbyRoom = Rooms.get(LOBBY_ROOM_ID);

			if (challengerRoom) {
				challengerRoom.add(`|uhtmlchange|${uhtmlId}|${challengerHtml}`).update();
			}
			if (targetRoom) {
				targetRoom.add(`|uhtmlchange|${uhtmlId}|${targetHtml}`).update();
			}
			if (lobbyRoom) {
				lobbyRoom.add(`|uhtmlchange|${uhtmlId}|${publicHtml}`).update();
			}
		} catch (e) {
			Monitor.crashlog(e as Error, "Clan War ELO Battle End Handler (War Continue)", {
				battleID: battle.roomid,
				warId: war._id,
			});
		}
	}
}

export const handlers: Chat.Handlers = {
	onBattleEnd: (battle, winner, players) => {
		void handleClanBattleEnd(battle, winner, players);
	},
};
