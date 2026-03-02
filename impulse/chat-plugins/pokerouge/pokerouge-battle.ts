/*
 * PokeRouge Battle — bot user creation, AI move logic, and battle start.
 * Imported by pokerouge.ts.
 * This file does NOT export Chat plugin hooks (commands/handlers/pages/start).
 */

import { ObjectReadWriteStream } from '../../../lib/streams';
import { StreamWorker } from '../../../lib/process-manager';
import {
	PokemonEntry, PokeRougeState,
	botLevel, botTeamSize, getLevelUpEvo,
	packPokemon, packTeam, pickRandomPokemon,
	setState,
} from './pokerouge-core';

// ---------------------------------------------------------------------------
// Bot user creation
// ---------------------------------------------------------------------------

/** A noop stream — discards everything written to it. */
class NoopStream extends ObjectReadWriteStream<string> {
	override _write(_data: string): void { /* discard */ }
}

const noopWorker = new StreamWorker(new NoopStream());
let botCounter = 0;

/** Maps active bot user IDs to the battle callback for AI responses. */
const botBattleHandlers = new Map<string, (roomid: string, requestLine: string) => void>();

/**
 * Display name prefix for all PokeRouge AI trainer bots.
 * Each bot's full name is `${TRAINER_NAME} <playerId>` so concurrent battles
 * for different players each get their own uniquely named bot without collision.
 */
const TRAINER_NAME = 'PokeRouge Trainer';

/**
 * Destroys a bot user, removing it from the Users table.
 * Must be defined before createBotUser so it can be called to clean up stale bots.
 */
export function destroyBotUser(botUser: User): void {
	botBattleHandlers.delete(botUser.id);
	for (const c of botUser.connections.slice()) {
		c.onDisconnect();
	}
	if (Users.get(botUser.id) === botUser) {
		Users.delete(botUser);
	}
}

/**
 * Creates the PokeRouge AI trainer bot for a specific player.
 * Any stale bot for the same player is destroyed first.
 * The bot name is player-specific (`PokeRouge Trainer <playerId>`) so that
 * two concurrent battles never share a bot and destroying one can never
 * corrupt another player's match.
 * The bot is marked as unnamed after forceRename so that:
 *   - It does NOT appear in the battle room's user list.
 *   - It does NOT get tracked by the /seen plugin when it disconnects.
 */
export function createBotUser(playerId: string): User {
	const uid = ++botCounter;
	const connId = `pokerouge-bot-${uid}`;
	const botDisplayName = `${TRAINER_NAME} ${playerId}`;

	// Destroy any stale bot for this player before creating a new one
	const existingBot = Users.get(toID(botDisplayName));
	if (existingBot) {
		destroyBotUser(existingBot);
	}

	// Create a minimal noop connection
	const conn = new Users.Connection(
		connId,
		noopWorker,
		String(uid),
		null,
		'127.0.0.1',
		null
	);

	const botUser = new Users.User(conn);
	conn.user = botUser;

	botUser.forceRename(botDisplayName, true);

	// Mark as unnamed so the bot is:
	//   1. NOT shown in the battle room user list (onJoin only broadcasts named users)
	//   2. NOT tracked by the /seen plugin on disconnect (handler checks user.named)
	(botUser as any).named = false;

	// Override sendTo so that battle |request| messages trigger AI moves.
	// Handler lookup is deferred inside the setTimeout to avoid a race condition
	// where sendTo fires before botBattleHandlers.set() is called in startBattle.
	(botUser as any).sendTo = function (roomid: RoomID | BasicRoom | null, data: string) {
		if (typeof data === 'string') {
			const lines = data.split('\n');
			for (const line of lines) {
				if (line.startsWith('|request|')) {
					const roomidStr = typeof roomid === 'string' ? roomid :
						(roomid as any)?.roomid ?? '';
					setTimeout(() => {
						const handler = botBattleHandlers.get(botUser.id);
						if (handler) handler(roomidStr, line);
					}, 150);
					break;
				}
			}
		}
	};

	return botUser;
}

// ---------------------------------------------------------------------------
// AI move logic
// ---------------------------------------------------------------------------

/**
 * Parse a |request| JSON and return a valid choice string.
 * Always prefers higher base-power moves for the best AI from the start.
 */
export function makeAIChoice(requestJson: string, _floor: number): string {
	let request: any;
	try {
		request = JSON.parse(requestJson.startsWith('|request|') ? requestJson.slice(9) : requestJson);
	} catch {
		return 'move 1';
	}

	if (!request || request.wait) return 'pass';

	// Team preview
	if (request.teamPreview) {
		const count = request.side?.pokemon?.length ?? 1;
		const order = Array.from({ length: count }, (_, i) => i + 1);
		return `team ${order.join('')}`;
	}

	// Force switch
	if (request.forceSwitch) {
		const choices: string[] = [];
		const pokemon = request.side?.pokemon ?? [];
		const chosen: number[] = [];

		for (const forceSwitchEntry of (request.forceSwitch as boolean[])) {
			if (!forceSwitchEntry) {
				choices.push('pass');
				continue;
			}
			const available = pokemon
				.map((p: any, idx: number) => ({ p, idx: idx + 1 }))
				.filter(({ p, idx }: { p: any, idx: number }) =>
					idx > (request.forceSwitch as boolean[]).length &&
					!p.condition?.endsWith(' fnt') &&
					!chosen.includes(idx)
				);
			if (available.length) {
				const pick = available[Math.floor(Math.random() * available.length)];
				chosen.push(pick.idx);
				choices.push(`switch ${pick.idx}`);
			} else {
				choices.push('pass');
			}
		}
		return choices.join(', ');
	}

	// Move request
	if (request.active) {
		const choicesList: string[] = [];

		for (let i = 0; i < (request.active as any[]).length; i++) {
			const active = (request.active as any[])[i];
			const pokemon = request.side?.pokemon?.[i];

			if (!pokemon || pokemon.condition?.endsWith(' fnt') || pokemon.commanding) {
				choicesList.push('pass');
				continue;
			}

			const moves: any[] = active?.moves ?? [];
			const usableMoves = moves.filter((m: any) => !m.disabled && (m.pp ?? 1) > 0);

			let chosen = '';
			if (usableMoves.length > 0) {
				usableMoves.sort((a: any, b: any) => {
					const bpA = Dex.moves.get(a.id)?.basePower ?? 0;
					const bpB = Dex.moves.get(b.id)?.basePower ?? 0;
					return bpB - bpA;
				});
				chosen = `move ${moves.indexOf(usableMoves[0]) + 1}`;
			} else {
				chosen = 'move 1'; // struggle
			}

			if (active.canMegaEvo && Math.random() < 0.5) chosen += ' mega';
			else if (active.canTerastallize && Math.random() < 0.4) chosen += ' terastallize';

			choicesList.push(chosen);
		}

		return choicesList.join(', ') || 'move 1';
	}

	return 'move 1';
}

// ---------------------------------------------------------------------------
// Active battle tracking
// ---------------------------------------------------------------------------

export interface ActiveRougeMatch {
	userId: ID;
	botUserId: ID;
	floor: number;
}

export const activeMatches = new Map<RoomID, ActiveRougeMatch>();

// ---------------------------------------------------------------------------
// Core battle creation
// ---------------------------------------------------------------------------

/**
 * Builds an AI bot team as a packed string for the given floor.
 */
function buildBotTeam(floor: number): string {
	const level = botLevel(floor);
	const size = botTeamSize(floor);

	const picks = pickRandomPokemon(size);

	return picks.map(starter => {
		let species = starter;
		let evo = getLevelUpEvo(species);
		while (evo && level >= evo.evoLevel) {
			species = evo.evoTo;
			evo = getLevelUpEvo(species);
		}
		return packPokemon({ species, level, exp: 0 } as PokemonEntry);
	}).join(']');
}

/**
 * Starts a PokeRouge battle on the current floor for `user`.
 * Creates the bot, registers AI handlers and tracks the room.
 * Returns true on success; on failure, the user has already received a popup.
 */
export function startBattle(user: User, state: PokeRougeState): boolean {
	const playerTeam = packTeam(state.team);
	const botTeam = buildBotTeam(state.floor);

	const botUser = createBotUser(user.id);
	const botSlot = 'p2' as const;

	let battleRoom: AnyObject | null = null;
	try {
		battleRoom = Rooms.createBattle({
			format: 'roguelikebattle',
			players: [
				{ user, team: playerTeam },
				{ user: botUser, team: botTeam },
			],
			rated: false,
			title: `Roguelike Battle — Floor ${state.floor}: ${user.name} vs ${botUser.name}`,
		});
	} catch (e) {
		destroyBotUser(botUser);
		user.popup('Failed to start the PokéRogue battle. Please try again.');
		Monitor.crashlog(e as Error, 'PokéRogue battle creation');
		return false;
	}

	if (!battleRoom) {
		destroyBotUser(botUser);
		return false;
	}

	// Register the AI callback AFTER confirming the battle exists
	botBattleHandlers.set(botUser.id, (roomid, requestLine) => {
		const room = Rooms.get(roomid as RoomID);
		if (!room?.battle) return;
		const choice = makeAIChoice(requestLine, state.floor);
		void room.battle.stream.write(`>${botSlot} ${choice}`);
	});

	// Clear held items now that battle creation succeeded
	for (const mon of state.team) delete mon.heldItem;

	state.battleRoomId = battleRoom.roomid;
	setState(user.id, state);

	activeMatches.set(battleRoom.roomid, {
		userId: user.id,
		botUserId: botUser.id,
		floor: state.floor,
	});

	return true;
}
