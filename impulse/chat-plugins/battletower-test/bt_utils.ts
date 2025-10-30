/*
* Pokemon Showdown
* Battle Utility Functions
*/
import { Teams } from '../../../sim/teams';

/**
 * Metadata associated with a currently active Battle Tower battle.
 */
interface ActiveBattleMeta {
	/** The room ID of the battle. */
	roomid: string;
	/** The type of Battle Tower challenge (e.g., 'boss', 'ladder'). */
	battleType: string;
	/** The user ID of the bot opponent. */
	opponentId: string;
	/** Arbitrary data to pass to the win/lose handlers. */
	data?: any;
	/** Callback function executed on user win. */
	onWin?: (battle: any, winner: string, players: string[], meta: ActiveBattleMeta) => void;
	/** Callback function executed on user loss. */
	onLose?: (battle: any, winner: string, players: string[], meta: ActiveBattleMeta) => void;
}

const activeBattles: Map<string, ActiveBattleMeta> = new Map();

/**
 * Packs the team array into the format required by the battle simulator, if the function is available.
 * @param team The raw team array.
 * @returns The packed team string or the original array.
 */
function packTeam(team: any[]) {
	if (typeof Teams?.pack === 'function') return Teams.pack(team);
	return team;
}

/**
 * Creates a new battle room between a user and a bot, initializing the Battle Tower metadata.
 * @param options Battle configuration options.
 * @param options.user The user object for player 1.
 * @param options.botUserId The user ID of the bot for player 2.
 * @param options.userTeam The team array for the user.
 * @param options.botTeam The team array for the bot.
 * @param options.battleType The type of battle being started.
 * @param options.format The battle format (defaults to 'gen9customgame').
 * @param options.title The title of the battle room.
 * @param options.data Arbitrary data to store in the battle metadata.
 * @param options.onWin Callback function executed on user win.
 * @param options.onLose Callback function executed on user loss.
 * @returns The created battle room object, or null if player objects cannot be retrieved.
 */
export function createBattle(options: {
	user: any,
	botUserId: string,
	userTeam: any[],
	botTeam: any[],
	battleType: string,
	format?: string,
	title?: string,
	data?: any,
	onWin?: (battle: any, winner: string, players: string[], meta: ActiveBattleMeta) => void,
	onLose?: (battle: any, winner: string, players: string[], meta: ActiveBattleMeta) => void,
}) {
	const player1Packed = packTeam(options.userTeam);
	const player2Packed = packTeam(options.botTeam);

	const player1 = options.user;
	const player2 = Users.get(options.botUserId);
	if (!player1 || !player2) return null;

	const battleRoom = Rooms.createBattle({
		format: options.format || 'gen9customgame',
		players: [
			{ user: player1, team: player1Packed },
			{ user: player2, team: player2Packed }
		],
		title: options.title || `${player1.name} vs. ${player2.name}`,
	});
	player1.joinRoom?.(battleRoom);
	player2.joinRoom?.(battleRoom);

	activeBattles.set(battleRoom.roomid, {
		roomid: battleRoom.roomid,
		battleType: options.battleType,
		opponentId: options.botUserId,
		data: options.data,
		onWin: options.onWin,
		onLose: options.onLose,
	});

	return battleRoom;
}

/**
 * Chat handler registration for the plugin, specifically handling the end of a battle.
 * If the battle is tracked in `activeBattles`, the appropriate `onWin` or `onLose` callback is executed.
 */
export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner, players) {
		const entry = activeBattles.get(battle.roomid);
		if (!entry) return;
		activeBattles.delete(battle.roomid);
		const isUserWin = winner === players[0];
		if (isUserWin) {
			entry.onWin?.(battle, winner, players, entry);
		} else {
			entry.onLose?.(battle, winner, players, entry);
		}
	}
};
