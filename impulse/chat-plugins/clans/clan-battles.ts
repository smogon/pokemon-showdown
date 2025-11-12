// Clans Battle Hook - @author PrinceSky-Git
import { Clans, UserClans, ClanBattleLogs, ClanWars } from './database';
import type { ClanBattleLogEntry } from './interface';
import { calculateElo, generateWarCard } from './utils';
const LOBBY_ROOM_ID = 'clanwarlogs' as RoomID;

async function handleClanBattleEnd(battle: RoomBattle, winner: ID, players: ID[]) {
	if (players.length !== 2 || battle.tour) return;
	const [p1, p2] = players;
	const loser = (winner === p1) ? p2 : p1;
	if (!winner || !loser) return;
	const [wci, lci] = await Promise.all([
		UserClans.findOne({ _id: winner }),
		UserClans.findOne({ _id: loser }),
	]);
	const wClan = wci?.memberOf;
	const lClan = lci?.memberOf;
	if (!wClan || !lClan || wClan === lClan) return;

	const war = await ClanWars.findOne({
		clans: { $all: [wClan, lClan] },
		status: 'active',
	});
	if (!war || !war.bestOf || war.paused) return;
	const uhtmlId = `clan-war-card-${war._id}`;
	const needed = Math.ceil(war.bestOf / 2);
	const wScore = (war.scores[wClan] || 0) + 1;
	const lScore = war.scores[lClan] || 0;
	const wName = Users.get(winner)?.name || winner;
	const lName = Users.get(loser)?.name || loser;

	if (wScore === needed) {
		const [wc, lc] = await Promise.all([
			Clans.findOne({ _id: wClan }),
			Clans.findOne({ _id: lClan }),
		]);
		if (!wc || !lc) {
			Monitor.crashlog(new Error("War battle ended but a clan was missing."), "Clan War Battle End");
			return;
		}
		const wElo = wc.stats.elo || 1000;
		const lElo = lc.stats.elo || 1000;
		const [newWElo, newLElo, elo] = calculateElo(wElo, lElo);
		const logEntry: Omit<ClanBattleLogEntry, '_id'> = {
			timestamp: Date.now(),
			winningClan: wClan,
			losingClan: lClan,
			winner,
			loser,
			format: battle.format,
			battleID: battle.roomid,
			warId: war._id,
			eloChangeWinner: elo,
			eloChangeLoser: -elo,
			isWarWinningBattle: true,
		};

		try {
			await Promise.all([
				Clans.updateOne(
					{ _id: wClan },
					{
						$set: { 'stats.elo': newWElo },
						$inc: { 'stats.clanBattleWins': 1 },
					}
				),
				Clans.updateOne(
					{ _id: lClan },
					{
						$set: { 'stats.elo': newLElo },
						$inc: { 'stats.clanBattleLosses': 1 },
					}
				),
				ClanWars.updateOne(
					{ _id: war._id },
					{
						$set: { status: 'completed', endDate: Date.now() },
						$inc: { [`scores.${wClan}`]: 1 },
					}
				),
				ClanBattleLogs.insertOne(logEntry),
			]);

			const [clan1, clan2] = await Promise.all([
				Clans.findOne({ _id: war.clans[0] }),
				Clans.findOne({ _id: war.clans[1] }),
			]);
			if (!clan1 || !clan2) return;
			const score = `(Final: ${wScore} - ${lScore})`;
			const endMsg = `${wc.name} emerges victorious over ${lc.name}! ${score}`;
			war.status = 'completed';
			war.scores[wClan] = wScore;
			war.scores[lClan] = lScore;
			const eHtml = generateWarCard(war, clan1, clan2, 'ended', { endMessage: endMsg });
			const wRoom = Rooms.get(wc.chatRoom);
			const lRoom = Rooms.get(lc.chatRoom);
			const lobby = Rooms.get(LOBBY_ROOM_ID);
			if (wRoom) wRoom.add(`|uhtmlchange|${uhtmlId}|${eHtml}`).update();
			if (lRoom) lRoom.add(`|uhtmlchange|${uhtmlId}|${eHtml}`).update();
			if (lobby) lobby.add(`|uhtmlchange|${uhtmlId}|${eHtml}`).update();
		} catch (e) {
			Monitor.crashlog(e as Error, "Clan War Battle End (War End)", {
				battleID: battle.roomid,
				warId: war._id,
			});
		}
	} else {
		const logEntry: Omit<ClanBattleLogEntry, '_id'> = {
			timestamp: Date.now(),
			winningClan: wClan,
			losingClan: lClan,
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
					{ $inc: { [`scores.${wClan}`]: 1 } }
				),
				ClanBattleLogs.insertOne(logEntry),
			]);

			const [wc, lc, uWar] = await Promise.all([
				Clans.findOne({ _id: wClan }),
				Clans.findOne({ _id: lClan }),
				ClanWars.findOne({ _id: war._id }),
			]);
			if (!wc || !lc || !uWar) return;
			const last = { winnerName: wName, loserName: lName, winningClanName: wc.name };
			const [clan1, clan2] = await Promise.all([
				Clans.findOne({ _id: uWar.clans[0] }),
				Clans.findOne({ _id: uWar.clans[1] }),
			]);
			if (!clan1 || !clan2) return;
			const cHtml = generateWarCard(uWar, clan1, clan2, 'challenger', { lastBattle: last });
			const tHtml = generateWarCard(uWar, clan1, clan2, 'target', { lastBattle: last });
			const pHtml = generateWarCard(uWar, clan1, clan2, 'public', { lastBattle: last });
			const cRoom = Rooms.get(clan1.chatRoom);
			const tRoom = Rooms.get(clan2.chatRoom);
			const lobby = Rooms.get(LOBBY_ROOM_ID);
			if (cRoom) cRoom.add(`|uhtmlchange|${uhtmlId}|${cHtml}`).update();
			if (tRoom) tRoom.add(`|uhtmlchange|${uhtmlId}|${tHtml}`).update();
			if (lobby) lobby.add(`|uhtmlchange|${uhtmlId}|${pHtml}`).update();
		} catch (e) {
			Monitor.crashlog(e as Error, "Clan War Battle End (Continue)", {
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
