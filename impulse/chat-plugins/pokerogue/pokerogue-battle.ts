/*
 * =======================================================================
 *
 *    ___ __  __ ___ _   _ _    ___ ___
 *   |_ _|  \/  | _ \ | | | |  / __| __|
 *    | || |\/| |  _/ |_| | |__\__ \ _|
 *   |___|_|  |_|_|  \___/|____|___/___|
 *
 *   Server: Impulse
 *   Plugin: PokéRogue Battle
 *   Made by: @TurboRx
 *
 * =======================================================================
 */

import { ObjectReadWriteStream } from '../../../lib/streams';
import { StreamWorker } from '../../../lib/process-manager';
import { type PokemonEntry, type PokeRogueState } from './pokerogue-types';
import {
	genAIPokemon, packAITeam, packTeam,
	type AIPokemonSet, botLevel,
} from './pokerogue-pokemon';
import { setState } from './pokerogue-state';

// ---------------------------------------------------------------------------
// Team size scaling
// ---------------------------------------------------------------------------

/**
 * Maps floor to team size using the same 7-step table as poketest.ts:
 *   [2, 3, 3, 4, 4, 5, 6] indexed by difficulty tier (0–6).
 * Every 10 floors advances one tier, so:
 *   floors 1–9 → 2 mons, 10–19 → 3, 20–29 → 3, 30–39 → 4, etc.
 */
const TEAM_SIZE_BY_TIER = [2, 3, 3, 4, 4, 5, 6] as const;

function botTeamSize(floor: number): number {
	const tier = Math.min(6, Math.floor((floor - 1) / 10));
	return TEAM_SIZE_BY_TIER[tier];
}

// ---------------------------------------------------------------------------
// Bot infrastructure (unchanged from original)
// ---------------------------------------------------------------------------

class NoopStream extends ObjectReadWriteStream<string> {
	override _write(_data: string): void { /* discard */ }
}

const noopWorker = new StreamWorker(new NoopStream());
let botCounter = 0;

const botBattleHandlers = new Map<string, (roomid: string, requestLine: string) => void>();
const TRAINER_NAME = 'PokéRogue Challenger';

export function destroyBotUser(botUser: User): void {
	botBattleHandlers.delete(botUser.id);
	for (const c of botUser.connections.slice()) {
		c.onDisconnect();
	}
	if (Users.get(botUser.id) === botUser) {
		Users.delete(botUser);
	}
}

function createBotUser(playerId: string): User {
	const uid = ++botCounter;
	const connId = `pokerogue-bot-${uid}`;
	const botInternalName = `pokeroguebot${uid}`;

	let staleRoomId: RoomID | undefined;
	for (const [roomId, match] of activeMatches) {
		if (match.userId === toID(playerId)) {
			staleRoomId = roomId;
			break;
		}
	}
	if (staleRoomId !== undefined) {
		const room = Rooms.get(staleRoomId);
		const battleEnded = !room?.battle || room.battle.ended;
		if (battleEnded) {
			const staleMatch = activeMatches.get(staleRoomId);
			if (staleMatch) {
				const staleBot = Users.get(staleMatch.botUserId);
				if (staleBot) destroyBotUser(staleBot);
			}
			activeMatches.delete(staleRoomId);
		}
	}

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

	botUser.forceRename(botInternalName, true);
	(botUser as any).name = TRAINER_NAME;
	(botUser as any).named = false;

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
// AI move selection (unchanged from original — handles the in-battle choices)
// ---------------------------------------------------------------------------

function makeAIChoice(requestJson: string, _floor: number, defenderTypes: string[] = []): string {
	let request: any;
	try {
		request = JSON.parse(requestJson.startsWith('|request|') ? requestJson.slice(9) : requestJson);
	} catch {
		return 'move 1';
	}

	if (!request || request.wait) return 'pass';

	if (request.teamPreview) {
		const count = request.side?.pokemon?.length ?? 1;
		const order = Array.from({ length: count }, (_, i) => i + 1);
		return `team ${order.join('')}`;
	}

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
				const scored = usableMoves.map((m: any) => {
					const moveData = Dex.moves.get(m.id);
					const bp = moveData.basePower ?? 0;
					if (!bp) return { m, score: 0 };
					if (defenderTypes.length && !Dex.getImmunity(moveData.type, defenderTypes)) {
						return { m, score: 0 };
					}
					const typeMod = defenderTypes.length ?
						Dex.getEffectiveness(moveData.type, defenderTypes) :
						0;
					return { m, score: bp * (2 ** typeMod) };
				});
				scored.sort((a: any, b: any) => b.score - a.score);
				chosen = `move ${moves.indexOf(scored[0].m) + 1}`;
			} else {
				chosen = 'move 1';
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
// Active match registry
// ---------------------------------------------------------------------------

interface ActiveRougeMatch {
	userId: ID;
	botUserId: ID;
	floor: number;
}

export const activeMatches = new Map<RoomID, ActiveRougeMatch>();

// ---------------------------------------------------------------------------
// Bot team builder — now uses BST-weighted genAIPokemon()
// ---------------------------------------------------------------------------

/**
 * Builds the AI team for the given floor using a BST-weighted probability pool
 * that mirrors poketest.ts genPokemon() difficulty scaling.
 *
 * Key changes from the old tier-bucket approach:
 *
 * 1. TEAM SIZE: Uses the same 7-step table as poketest.ts ([2,3,3,4,4,5,6]
 *    indexed by tier, one tier per 10 floors), instead of the old
 *    floor-threshold ladder. Boss floors always use the full tier-size.
 *
 * 2. POKEMON SELECTION: genAIPokemon() uses a parabolic BST weight so the
 *    "ideal" BST rises smoothly with floor, not in hard tiers.
 *
 * 3. LEVELS: Each mon gets its own level drawn from [minLevel, maxLevel]
 *    (both scaled with floor), not a single botLevel() for everyone.
 *
 * 4. BOSS FLOOR BONUS: Boss floors (floor % 10 === 0) force a full-sized
 *    team and apply a +1 to +3 level bonus to every mon's level, capped at
 *    100. Player's max level is also factored in (dynamic scaling).
 *
 * 5. RICH SETS: Each mon now has random natures, random IVs (0–31 per stat),
 *    1/20 chance of a functional held item, random ability selection, and
 *    a random TeraType — all matching poketest.ts realism.
 */
function buildBotTeam(state: PokeRogueState): string {
	const floor = state.floor;
	const isBoss = floor % 10 === 0;

	// Team size — full 6 on boss floors, otherwise tier-scaled
	const size = isBoss ? 6 : botTeamSize(floor);

	// Generate the pool of AI mons using BST-weighted selection
	let aiTeam: AIPokemonSet[] = genAIPokemon(size, floor);

	// --- Dynamic level adjustment ---
	// Ensure no AI mon falls below the player's weakest active mon,
	// and apply boss bonus on boss floors (mirrors original dynamic scaling)
	const playerMaxLevel = state.team.length
		? Math.max(...state.team.map(m => m.level))
		: 1;

	const bossBonus = isBoss ? Math.floor(Math.random() * 3) + 1 : 0;

	aiTeam = aiTeam.map(mon => {
		// Push the mon's level up if the player outlevels it
		let newLevel = Math.max(mon.level, playerMaxLevel);
		// Boss floor: add +1 to +3 over the player
		newLevel = Math.min(100, newLevel + bossBonus);
		return { ...mon, level: newLevel };
	});

	return packAITeam(aiTeam);
}

// ---------------------------------------------------------------------------
// startBattle (unchanged interface — only buildBotTeam internals changed)
// ---------------------------------------------------------------------------

export function startBattle(user: User, state: PokeRogueState): boolean {
	const playerTeam = packTeam(state.team);
	const botTeam = buildBotTeam(state);
	const isBoss = state.floor % 10 === 0;

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
			title: `PokéRogue Battle - Floor ${state.floor}: ${user.name} vs ${isBoss ? 'BOSS ' : ''}${TRAINER_NAME}`,
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

	botBattleHandlers.set(botUser.id, (roomid, requestLine) => {
		const room = Rooms.get(roomid as RoomID);
		if (!room?.battle) return;
		const choice = makeAIChoice(requestLine, state.floor);
		void room.battle.stream.write(`>${botSlot} ${choice}`);
	});

	state.battleRoomId = battleRoom.roomid;
	setState(user.id, state);

	activeMatches.set(battleRoom.roomid, {
		userId: user.id,
		botUserId: botUser.id,
		floor: state.floor,
	});

	return true;
}
