/*
 * =======================================================================
 *
 * ___ __  __ ___ _   _ _    ___ ___
 * |_ _|  \/  | _ \ | | | |  / __| __|
 * | || |\/| |  _/ |_| | |__\__ \ _|
 * |___|_|  |_|_|  \___/|____|___/___|
 *
 * Server: Impulse
 * Plugin: PokéRogue Battle
 * Made by: @TurboRx
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

const TEAM_SIZE_BY_TIER = [2, 3, 3, 4, 4, 5, 6] as const;

function botTeamSize(floor: number): number {
	const tier = Math.min(6, Math.floor((floor - 1) / 10));
	return TEAM_SIZE_BY_TIER[tier];
}

class NoopStream extends ObjectReadWriteStream<string> {
	override _write(_data: string): void {}
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

interface ActiveRougeMatch {
	userId: ID;
	botUserId: ID;
	floor: number;
}

export const activeMatches = new Map<RoomID, ActiveRougeMatch>();

function buildBotTeam(state: PokeRogueState): string {
	const floor = state.floor;
	const isBoss = floor % 10 === 0;
	const streak = state.streaksWon ?? 0;
	const size = isBoss ? 6 : botTeamSize(floor);

	let aiTeam: AIPokemonSet[] = genAIPokemon(size, streak);

	if (isBoss) {
		const bossBonus = Math.floor(Math.random() * 3) + 1;
		aiTeam = aiTeam.map(mon => ({
			...mon,
			level: Math.min(100, mon.level + bossBonus),
		}));
	}

	return packAITeam(aiTeam);
}

export function startBattle(user: User, state: PokeRogueState): boolean {
	const livingTeam = state.team.filter(m => (m.currentHp ?? 100) > 0);

	if (!livingTeam.length) {
		user.popup('All your Pokémon have fainted! Use a Revive from the shop before battling.');
		return false;
	}

	const playerTeam = packTeam(livingTeam);
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
