/*
 * =======================================================================
 *
 *    ___ __  __ ___ _   _ _    ___ ___
 *   |_ _|  \/  | _ \ | | | |  / __| __|
 *    | || |\/| |  _/ |_| | |__\__ \ _|
 *   |___|_|  |_|_|  \___/|____|___/___|
 *
 *   Server: Impulse
 *   Plugin: PokéRogue
 *   Made by: @TurboRx
 *
 * =======================================================================
 */

import { SHOP_ITEMS, ROTATIONAL_ITEM_POOL, TMItem, genItem, rollShop } from './pokerogue-items';
import { type PokemonEntry, type PokeRogueState, type StatusCondition } from './pokerogue-types';
import { getState, setState, deleteState } from './pokerogue-state';
import {
	pickStarterOptions, pickNewPokemonOptions,
	expForLevel, floorCoinReward,
	applyExpAndLevelUp, getLevelUpEvo,
	getLevelUpMoves, getMovesLearnedBetween,
	botLevel, calcKillExp, getExpType,
	genAIPokemon, packTeam, packAIPokemon,
} from './pokerogue-pokemon';
import { renderGamePage, refreshGamePage } from './pokerogue-render';
import {
	activeMatches,
	startBattle, destroyBotUser,
} from './pokerogue-battle';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** BP awarded for winning a battle. */
const BP_PER_WIN = 5;
/** Extra BP awarded at end of each streak (every 7 battles). */
const BP_PER_STREAK = 5;
/** Starting BP for a new run. */
const STARTING_BP = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function repairEmptyPendingChoice(state: PokeRogueState, userId: string): void {
	if (!state.pendingChoice || state.pendingChoice.length) return;
	if (state.pendingChoiceType === 'add' && state.team?.length) {
		state.pendingChoice = pickNewPokemonOptions(state.team, state.floor - 1);
	} else {
		state.pendingChoice = pickStarterOptions();
	}
	setState(userId, state);
}

/**
 * Returns true if the player is "at a streak boundary" — i.e., they have
 * just won the 7th battle in a streak (battle % 7 === 0 after incrementing).
 */
function isStreakBoundary(floor: number): boolean {
	return floor % 7 === 0;
}

/**
 * Fully heals PP for a Pokémon entry (all moves to max PP).
 */
function fullHealPP(mon: PokemonEntry): void {
	mon.ppLeft = mon.moves.map(m => {
		const dexMove = Dex.moves.get(m);
		return Math.floor((dexMove.pp ?? 5) * (8 / 5));
	});
}

/**
 * Process level-ups and queue move-learning prompts.
 */
function processLevelUp(
	mon: PokemonEntry,
	oldLevel: number,
	oldSpecies: string,
	evolved: boolean,
	teamIdx: number,
	state: PokeRogueState,
): string[] {
	const detailMsgs: string[] = [];

	if (evolved) {
		detailMsgs.push(`<b>${oldSpecies}</b> evolved into <b>${mon.species}</b> and reached Lv. ${mon.level}!`);
	} else if (mon.level > oldLevel) {
		detailMsgs.push(`<b>${mon.species}</b> reached Lv. ${mon.level}!`);
	}

	if (!mon.moves) mon.moves = getLevelUpMoves(mon.species, oldLevel);

	const newMoves = getMovesLearnedBetween(oldSpecies, oldLevel, mon.level);
	if (evolved) {
		const evoMoves = getMovesLearnedBetween(mon.species, oldLevel, mon.level, true);
		for (const m of evoMoves) if (!newMoves.includes(m)) newMoves.push(m);
	}

	state.pendingMoves = state.pendingMoves ?? [];

	for (const move of newMoves) {
		if (mon.moves.includes(move)) continue;
		if (state.pendingMoves.some(p => p.pokemonIndex === teamIdx && p.move === move)) continue;

		if (mon.moves.length < 4) {
			mon.moves.push(move);
			detailMsgs.push(`<b>${mon.species}</b> learned <b>${Dex.moves.get(move).name}</b>!`);
		} else {
			state.pendingMoves.push({ pokemonIndex: teamIdx, move, speciesName: mon.species });
		}
	}

	return detailMsgs;
}

// ---------------------------------------------------------------------------
// Kill → EXP tracking
// ---------------------------------------------------------------------------

const SELF_KO_MOVES = new Set([
	'explosion', 'selfdestruct', 'mistyexplosion', 'memento',
	'healingwish', 'lunardance', 'finalgambit',
]);

const RESIDUAL_FROM_TAGS: Record<string, true> = {
	'Leech Seed': true, 'Salt Cure': true, 'Infestation': true, 'Whirlpool': true,
	'Bind': true, 'Wrap': true, 'Clamp': true, 'Fire Spin': true, 'Sand Tomb': true,
	'Magma Storm': true, 'Snap Trap': true, 'Thunder Cage': true, 'Octolock': true,
	'Curse': true, 'Nightmare': true, 'Bad Dreams': true, 'Perish Song': true,
	'Future Sight': true, 'Doom Desire': true,
};

function parseKillExp(
	logLines: string[],
	state: PokeRogueState,
	floor: number,
	isBossFloor: boolean,
): Map<number, number> {
	const luckyCharmActive = false;

	const p1SlotToTeamIdx: Record<string, number> = {};
	const p1TeamFainted = new Set<number>();
	const p2SlotSpecies: Record<string, string> = {};
	const p2SlotLevel: Record<string, number> = {};
	const lastDirectAttacker: Record<string, string> = {};
	const statusInflicter: Record<string, string> = {};
	const residualInflicter: Record<string, string> = {};
	const hazardSetter: Record<string, string> = {};
	let lastAnyP1Slot: string | undefined;
	let lastMoveUser = '';
	let lastMoveTarget = '';
	let lastMoveName = '';
	const weatherSetByP1: Record<string, boolean> = {};
	const expMap = new Map<number, number>();

	for (const line of logLines) {
		const p1Switch = /^\|(?:switch|drag)\|p1([a-z]): [^|]+\|([^|,]+)[^|]*\|(\d+)/.exec(line);
		if (p1Switch) {
			const slot = 'p1' + p1Switch[1];
			const sid = toID(p1Switch[2].trim());
			const otherActiveIndices = new Set(
				Object.entries(p1SlotToTeamIdx).filter(([s]) => s !== slot).map(([, idx]) => idx)
			);
			let matched = -1;
			for (let i = 0; i < state.team.length; i++) {
				if (toID(state.team[i].species) === sid && !otherActiveIndices.has(i)) { matched = i; break; }
			}
			if (matched !== -1) p1SlotToTeamIdx[slot] = matched;
			lastAnyP1Slot = slot;
			continue;
		}

		const p1FaintLine = /^\|faint\|p1([a-z]):/.exec(line);
		if (p1FaintLine) {
			const slot = 'p1' + p1FaintLine[1];
			const teamIdx = p1SlotToTeamIdx[slot];
			if (teamIdx !== undefined) p1TeamFainted.add(teamIdx);
			continue;
		}

		const p2Switch = /^\|(?:switch|drag)\|p2([a-z]): [^|]+\|([^|,]+)(?:, L(\d+))?[^|]*\|/.exec(line);
		if (p2Switch) {
			const slot = 'p2' + p2Switch[1];
			p2SlotSpecies[slot] = toID(p2Switch[2].trim());
			p2SlotLevel[slot] = p2Switch[3] ? parseInt(p2Switch[3]) : botLevel(floor);
			delete lastDirectAttacker[slot];
			delete statusInflicter[slot];
			for (const key of Object.keys(residualInflicter)) {
				if (key.startsWith(`${slot}:`)) delete residualInflicter[key];
			}
			continue;
		}

		const moveMatch = /^\|move\|([p][12][a-z]): [^|]+\|([^|]+)\|([p][12][a-z]):/.exec(line);
		if (moveMatch) {
			const user = moveMatch[1]; const move = toID(moveMatch[2]); const target = moveMatch[3];
			lastMoveName = move; lastMoveUser = user; lastMoveTarget = target;
			if (user.startsWith('p1')) {
				lastAnyP1Slot = user;
				if (target.startsWith('p2')) {
					lastDirectAttacker[target] = user;
					const HAZARD_MOVES: Record<string, string> = { stealthrock: 'stealthrock', spikes: 'spikes', toxicspikes: 'toxicspikes', stickyweb: 'stickyweb', stoneaxe: 'stealthrock', ceaselessedge: 'spikes' };
					if (HAZARD_MOVES[move]) hazardSetter[HAZARD_MOVES[move]] = user;
					if (move === 'futuresight' || move === 'doomdesire') residualInflicter[`${target}:${move}`] = user;
				}
				const WEATHER_MOVES: Record<string, string> = { raindance: 'rain', sunnyday: 'sun', sandstorm: 'sand', snowscape: 'snow', hail: 'hail', chillyreception: 'snow' };
				if (WEATHER_MOVES[move]) weatherSetByP1[WEATHER_MOVES[move]] = true;
			} else {
				const WEATHER_MOVES: Record<string, string> = { raindance: 'rain', sunnyday: 'sun', sandstorm: 'sand', snowscape: 'snow', hail: 'hail', chillyreception: 'snow' };
				if (WEATHER_MOVES[move]) weatherSetByP1[WEATHER_MOVES[move]] = false;
			}
			continue;
		}

		const statusApply = /^\|-status\|p2([a-z]): [^|]+\|(brn|psn|tox)/.exec(line);
		if (statusApply) {
			const p2Slot = 'p2' + statusApply[1];
			if (lastMoveUser.startsWith('p1') && lastMoveTarget === p2Slot) {
				statusInflicter[p2Slot] = lastMoveUser;
			} else if (lastMoveUser.startsWith('p1')) {
				statusInflicter[p2Slot] = lastDirectAttacker[p2Slot] ?? lastMoveUser;
			}
			continue;
		}

		const residualStart = /^\|-start\|p2([a-z]): [^|]+\|(?:move: )?([^|[]+)/.exec(line);
		if (residualStart) {
			const p2Slot = 'p2' + residualStart[1];
			const effectKey = residualStart[2].trim().replace(/^move: /, '');
			if (RESIDUAL_FROM_TAGS[effectKey] && lastMoveUser.startsWith('p1')) {
				residualInflicter[`${p2Slot}:${toID(effectKey)}`] = lastMoveUser;
			}
			continue;
		}

		const faintLine = /^\|faint\|p2([a-z]):/.exec(line);
		if (!faintLine) continue;

		const p2Slot = 'p2' + faintLine[1];
		const enemySpecies = p2SlotSpecies[p2Slot] ?? '';
		const enemyLevel = p2SlotLevel[p2Slot] ?? botLevel(floor);

		let creditedP1Slot: string | undefined;
		const lastMoveWasSelfKO = SELF_KO_MOVES.has(lastMoveName) && lastMoveUser.startsWith('p2');
		const lastMoveWasP1Direct = lastMoveUser.startsWith('p1') && lastMoveTarget === p2Slot;

		if (lastMoveWasP1Direct && !lastMoveWasSelfKO) {
			creditedP1Slot = lastMoveUser;
		} else if (lastMoveWasSelfKO) {
			creditedP1Slot = lastDirectAttacker[p2Slot] ?? lastAnyP1Slot;
		} else if (statusInflicter[p2Slot]) {
			creditedP1Slot = statusInflicter[p2Slot];
		} else {
			const residualKey = Object.keys(residualInflicter).find(k => k.startsWith(`${p2Slot}:`));
			if (residualKey) {
				creditedP1Slot = residualInflicter[residualKey];
			} else {
				const faintIdx = logLines.indexOf(line);
				let fromTag = '';
				for (let j = faintIdx - 1; j >= Math.max(0, faintIdx - 8); j--) {
					const dmgLine = logLines[j];
					if (!dmgLine.startsWith(`|-damage|p2${faintLine[1]}`)) continue;
					const fromMatch = /\[from\] (?:\[of\] [^|]+\|)?(.+)$/.exec(dmgLine);
					if (fromMatch) { fromTag = fromMatch[1].trim(); break; }
				}
				if (fromTag) {
					const hazardMatch = /^(?:Stealth Rock|Spikes|Toxic Spikes|Sticky Web)$/.exec(fromTag);
					if (hazardMatch) {
						creditedP1Slot = hazardSetter[toID(hazardMatch[0])] ?? lastDirectAttacker[p2Slot] ?? lastAnyP1Slot;
					} else if (/^(?:Sandstorm|Hail|Snow)$/.test(fromTag)) {
						const wKey = fromTag.toLowerCase();
						creditedP1Slot = weatherSetByP1[wKey] ? (lastDirectAttacker[p2Slot] ?? lastAnyP1Slot) : undefined;
					} else if (/^(?:recoil|Life Orb|Black Sludge|crash)$/i.test(fromTag)) {
						creditedP1Slot = lastDirectAttacker[p2Slot] ?? lastAnyP1Slot;
					} else if (RESIDUAL_FROM_TAGS[fromTag]) {
						creditedP1Slot = lastDirectAttacker[p2Slot] ?? lastAnyP1Slot;
					}
				}
				if (!creditedP1Slot) creditedP1Slot = lastDirectAttacker[p2Slot] ?? lastAnyP1Slot;
			}
		}

		if (!creditedP1Slot) continue;
		const teamIdx = p1SlotToTeamIdx[creditedP1Slot];
		if (teamIdx === undefined) continue;
		if (p1TeamFainted.has(teamIdx)) continue;

		const exp = calcKillExp(enemySpecies, enemyLevel, luckyCharmActive, isBossFloor);
		expMap.set(teamIdx, (expMap.get(teamIdx) ?? 0) + exp);
	}

	return expMap;
}

// ---------------------------------------------------------------------------
// HP + PP + Status sync after battle
// ---------------------------------------------------------------------------

function syncBattleOutcome(
	logLines: string[],
	state: PokeRogueState,
): { consumedItems: string[] } {
	// slot → team index. Re-mapped every time a Pokémon switches in so that
	// a slot can be reused by a different Pokémon across the battle.
	const slotToTeamIdx: Record<string, number> = {};
	// Track which team indices have been assigned to a slot so far (prevents
	// two slots from being mapped to the same mon simultaneously).
	const activelyAssigned = new Set<number>();

	// Final HP / status per team index, written as we see log lines.
	const teamHp: Record<number, number> = {};
	const teamStatus: Record<number, StatusCondition | ''> = {};
	// Team indices that were recorded as fainted during the battle.
	const faintedIndices = new Set<number>();

	// Helper: resolve a slot to its current team index.
	const idxOf = (slot: string): number | undefined => slotToTeamIdx[slot];

	for (const line of logLines) {
		// Switch / drag — (re-)assign a slot to a team member.
		const switchMatch = /^\|(?:switch|drag)\|p1([a-z]): [^|]+\|([^|,]+)[^|]*\|(\d+)(?:\/\d+)?/.exec(line);
		if (switchMatch) {
			const slot = 'p1' + switchMatch[1];
			const sid = toID(switchMatch[2].trim());
			const hp = parseInt(switchMatch[3]);

			// Release the previous occupant of this slot from activelyAssigned
			// so it can be matched again if it switches back in later.
			const prev = slotToTeamIdx[slot];
			if (prev !== undefined) activelyAssigned.delete(prev);

			// Find the team member with matching species that isn't already
			// mapped to another active slot.
			let matched = -1;
			for (let i = 0; i < state.team.length; i++) {
				if (!activelyAssigned.has(i) && toID(state.team[i].species) === sid) {
					matched = i;
					break;
				}
			}

			if (matched !== -1) {
				slotToTeamIdx[slot] = matched;
				activelyAssigned.add(matched);
				teamHp[matched] = hp;

				const statusInSwitch = /\|\d+\/\d+ (brn|psn|tox|par|slp|frz)/.exec(line);
				teamStatus[matched] = statusInSwitch ? statusInSwitch[1] as StatusCondition : (teamStatus[matched] ?? '');
			}
			continue;
		}

		// |-damage| and |-heal| — update HP (and optional inline status token).
		const hpMatch = /^\|(?:-damage|-heal)\|p1([a-z]): [^|]+\|(\d+)(?:\/\d+)?( (brn|psn|tox|par|slp|frz))?/.exec(line);
		if (hpMatch) {
			const idx = idxOf('p1' + hpMatch[1]);
			if (idx !== undefined) {
				teamHp[idx] = parseInt(hpMatch[2]);
				if (hpMatch[4]) teamStatus[idx] = hpMatch[4].trim() as StatusCondition;
			}
			continue;
		}

		// |-status| — explicit status infliction.
		const statusApply = /^\|-status\|p1([a-z]): [^|]+\|(brn|psn|tox|par|slp|frz)/.exec(line);
		if (statusApply) {
			const idx = idxOf('p1' + statusApply[1]);
			if (idx !== undefined) teamStatus[idx] = statusApply[2] as StatusCondition;
			continue;
		}

		// |-curestatus| — status cleared mid-battle.
		const statusCure = /^\|-curestatus\|p1([a-z]): /.exec(line);
		if (statusCure) {
			const idx = idxOf('p1' + statusCure[1]);
			if (idx !== undefined) teamStatus[idx] = '';
			continue;
		}

		// |faint| — record HP 0, clear status, mark as fainted.
		const faintP1 = /^\|faint\|p1([a-z]):/.exec(line);
		if (faintP1) {
			const slot = 'p1' + faintP1[1];
			const idx = idxOf(slot);
			if (idx !== undefined) {
				teamHp[idx] = 0;
				teamStatus[idx] = '';
				faintedIndices.add(idx);
				// Release slot so it can be reused.
				activelyAssigned.delete(idx);
				delete slotToTeamIdx[slot];
			}
			continue;
		}
	}

	// Commit HP — fainted Pokémon are always written as 0 regardless of any
	// later HP entry that might have slipped through (belt-and-suspenders).
	for (const [idxStr, hp] of Object.entries(teamHp)) {
		const idx = Number(idxStr);
		state.team[idx].currentHp = faintedIndices.has(idx) ? 0 : hp;
	}
	// Ensure every fainted mon is 0 even if it never appeared in teamHp.
	for (const idx of faintedIndices) {
		state.team[idx].currentHp = 0;
	}

	// Commit status.
	for (const [idxStr, status] of Object.entries(teamStatus)) {
		const idx = Number(idxStr);
		if (status) {
			state.team[idx].status = status;
		} else {
			delete state.team[idx].status;
		}
	}

	// Consumed items (PS |-enditem| lines).
	// Re-walk the log with a fresh slot→index map that follows switches in order,
	// since slotToTeamIdx above was mutated (slots released on faint).
	const consumedItems: string[] = [];
	const itemSlotMap: Record<string, number> = {};
	const itemAssigned = new Set<number>();
	for (const line of logLines) {
		const sw = /^\|(?:switch|drag)\|p1([a-z]): [^|]+\|([^|,]+)/.exec(line);
		if (sw) {
			const slot = 'p1' + sw[1];
			const sid = toID(sw[2].trim());
			const prev = itemSlotMap[slot];
			if (prev !== undefined) itemAssigned.delete(prev);
			for (let i = 0; i < state.team.length; i++) {
				if (!itemAssigned.has(i) && toID(state.team[i].species) === sid) {
					itemSlotMap[slot] = i;
					itemAssigned.add(i);
					break;
				}
			}
			continue;
		}
		const endItemMatch = /^\|-enditem\|p1([a-z]): [^|]+\|([^|]+)/.exec(line);
		if (!endItemMatch) continue;
		if (line.includes('[from] move: Knock Off') || line.includes('[from] move: Thief') || line.includes('[from] move: Incinerate')) continue;
		const slot = 'p1' + endItemMatch[1];
		const itemId = toID(endItemMatch[2].trim());
		const teamIdx = itemSlotMap[slot];
		if (teamIdx !== undefined && state.team[teamIdx].heldItem === itemId) {
			delete state.team[teamIdx].heldItem;
			const dexItem = Dex.items.get(itemId);
			consumedItems.push(dexItem.name || itemId);
		}
	}

	return { consumedItems };
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

export const commands: Chat.ChatCommands = {
	pokerogue: {

		// ── Start / new game ──────────────────────────────────────────────
		start(target, room, user) {
			if (!user.named) return this.errorReply("Login required.");
			let state = getState(user.id);
			if (state?.battleRoomId) {
				const bRoom = Rooms.get(state.battleRoomId as RoomID);
				if (!bRoom?.battle || bRoom.battle.ended) delete state.battleRoomId;
			}
			if (!state || (!state.team?.length && !state.pendingChoice?.length && !state.battleRoomId && !state.gameOver)) {
				const highestFloor = state?.highestFloor || 0;
				const displayName = state?.displayName || user.name;
				const recordTeam = state?.recordTeam || [];
				state = {
					floor: 1,
					team: [],
					battlePoints: STARTING_BP,
					timesRerolled: 0,
					rotationalShop: [],
					keyItems: [],
					pendingChoice: pickStarterOptions(),
					pendingChoiceType: 'starter',
					streaksWon: 0,
					highestFloor,
					displayName,
					recordTeam,
				} as PokeRogueState;
				setState(user.id, state);
			}
			repairEmptyPendingChoice(state, user.id);
			return this.parse('/join view-pokerogue');
		},

		newgame(target, room, user) {
			const existing = getState(user.id);
			const hasProgress = existing && (existing.team?.length > 0 || (existing.floor ?? 1) > 1);
			if (hasProgress && !existing.gameOver && target !== 'confirm') {
				return this.sendReplyBox(`<b>Warning: Run in progress!</b><br><button name="send" value="/pokerogue newgame confirm" class="button">Yes, start fresh</button>`);
			}
			const highestFloor = existing?.highestFloor || 0;
			const displayName = existing?.displayName || user.name;
			const recordTeam = existing?.recordTeam || [];
			const newState: PokeRogueState = {
				floor: 1,
				team: [],
				battlePoints: STARTING_BP,
				timesRerolled: 0,
				rotationalShop: [],
				keyItems: [],
				pendingChoice: pickStarterOptions(),
				pendingChoiceType: 'starter',
				streaksWon: 0,
				highestFloor,
				displayName,
				recordTeam,
			};
			setState(user.id, newState);
			return this.parse('/pokerogue start');
		},

		// ── View navigation ────────────────────────────────────────────────
		view(target, room, user) {
			const state = getState(user.id);
			if (!state) return;
			const v = target.trim() as any;
			if (['main', 'shop', 'top', 'bag', 'resetconfirm'].includes(v)) {
				(state as any).view = v;
				setState(user.id, state);
				refreshGamePage(user);
			}
		},

		// ── Battle ─────────────────────────────────────────────────────────
		battle(target, room, user) {
			const state = getState(user.id);
			if (!state || state.gameOver) return this.errorReply("The run is over. Start a new run first.");
			if (state.pendingChoice?.length || state.pendingMoves?.length || state.pendingSwap ||
				state.moveToLearn || state.pendingItemName || state.itemOptions?.length) {
				return this.errorReply("Resolve all pending choices before starting a battle.");
			}

			// Move fainted Pokémon to the back so the battle engine never
			// auto-sends one out as the lead. Preserve relative order within
			// each group so the player's intended lineup is respected.
			const living = state.team.filter(m => (m.currentHp ?? 100) > 0);
			const fainted = state.team.filter(m => (m.currentHp ?? 100) <= 0);
			state.team = [...living, ...fainted];

			if (startBattle(user, state)) {
				(state as any).view = 'main';
				setState(user.id, state);
				refreshGamePage(user);
			}
		},

		// ── Pokémon choice (starter / pack) ────────────────────────────────
		choose(target, room, user) {
			const state = getState(user.id);
			const n = parseInt(target) - 1;
			if (!state?.pendingChoice || isNaN(n) || n < 0 || n >= state.pendingChoice.length) return;
			const choice = state.pendingChoice[n];

			let addedLevel = 5;
			if (state.pendingChoiceType !== 'starter') {
				addedLevel = Math.max(5, botLevel(state.floor) - 2);
			}

			let finalSpecies = choice;
			while (true) {
				const evo = getLevelUpEvo(finalSpecies);
				if (!evo || addedLevel < evo.evoLevel) break;
				finalSpecies = evo.evoTo;
			}

			const initialMoves = getLevelUpMoves(finalSpecies, addedLevel);
			const newMon: PokemonEntry = {
				species: finalSpecies,
				level: addedLevel,
				exp: expForLevel(addedLevel, getExpType(finalSpecies)),
				moves: initialMoves,
				ppLeft: initialMoves.map(m => Math.floor((Dex.moves.get(m).pp ?? 5) * (8 / 5))),
			};

			if (state.pendingChoiceType === 'starter') {
				state.team = [newMon];
			} else if (state.team.length < 6) {
				state.team.push(newMon);
			} else {
				state.pendingSwap = newMon;
			}

			delete state.pendingChoice;
			delete state.pendingChoiceType;
			setState(user.id, state);
			refreshGamePage(user);
		},

		// ── Move learning ──────────────────────────────────────────────────
		learnmove(target, room, user) {
			const state = getState(user.id);
			if (!state?.pendingMoves?.length) return;
			const pending = state.pendingMoves[0];
			const mon = state.team[pending.pokemonIndex];
			if (!mon.moves) mon.moves = getLevelUpMoves(mon.species, mon.level);
			const t = target.trim();
			if (t === 'skip') {
				state.notification = `Your Pokémon gave up on learning <b>${Dex.moves.get(pending.move).name}</b>.`;
			} else {
				const slot = parseInt(t) - 1;
				if (isNaN(slot) || slot < 0 || slot >= mon.moves.length) return this.errorReply("Invalid move slot.");
				const oldMoveName = Dex.moves.get(mon.moves[slot]).name;
				mon.moves[slot] = pending.move;
				if (mon.ppLeft) mon.ppLeft[slot] = Math.floor((Dex.moves.get(pending.move).pp ?? 5) * (8 / 5));
				state.notification = `Forgot ${oldMoveName} and learned <b>${Dex.moves.get(pending.move).name}</b>!`;
			}
			state.pendingMoves.shift();
			setState(user.id, state);
			refreshGamePage(user);
		},

		// ── Team swap ──────────────────────────────────────────────────────
		swapmon(target, room, user) {
			const state = getState(user.id);
			if (!state?.pendingSwap) return;
			const t = target.trim();
			const newMon = state.pendingSwap;
			if (t === 'skip') {
				state.notification = `You let the new Pokémon go.`;
			} else {
				const slot = parseInt(t) - 1;
				if (isNaN(slot) || slot < 0 || slot >= state.team.length) return this.errorReply("Invalid team slot.");
				const oldMonName = Dex.species.get(toID(state.team[slot].species)).name;
				state.team[slot] = newMon;
				if (state.pendingMoves) state.pendingMoves = state.pendingMoves.filter(p => p.pokemonIndex !== slot);
				state.notification = `You replaced ${oldMonName} with <b>${Dex.species.get(toID(newMon.species)).name}</b>!`;
			}
			delete state.pendingSwap;
			setState(user.id, state);
			refreshGamePage(user);
		},

		// ── Shop reroll ────────────────────────────────────────────────────
		reroll(target, room, user) {
			const state = getState(user.id);
			if (!state) return;
			if (state.battleRoomId) return this.errorReply("Can't reroll during a battle.");
			const price = 2 + (state.timesRerolled ?? 0);
			if (price > (state.battlePoints ?? 0)) return this.errorReply(`Not enough BP! Need ${price} BP.`);
			state.battlePoints -= price;
			state.timesRerolled = (state.timesRerolled ?? 0) + 1;

			const pseudoTeam = state.team.map(m => ({ species: Dex.species.get(toID(m.species)).name } as PokemonSet));
			state.rotationalShop = rollShop(pseudoTeam, state.streaksWon ?? 0);
			setState(user.id, state);
			refreshGamePage(user);
		},

		// ── Buy ────────────────────────────────────────────────────────────
		buy(target, room, user) {
			const state = getState(user.id);
			if (!state || state.gameOver) return this.errorReply("No active run.");
			if (state.battleRoomId) return this.errorReply("Can't shop during a battle.");
			if (state.pendingChoice?.length || state.pendingMoves?.length || state.pendingSwap ||
				state.moveToLearn || state.pendingItemName || state.itemOptions?.length) {
				return this.errorReply("Resolve pending choices first.");
			}

			const key = toID(target);
			const item = SHOP_ITEMS[key] || ROTATIONAL_ITEM_POOL[key];
			if (!item) return this.errorReply("Unknown item.");

			const bp = state.battlePoints ?? 0;
			if (item.cost > bp) return this.errorReply(`Not enough BP! Need ${item.cost} BP.`);

			if (item.minStreak > (state.streaksWon ?? 0)) return this.errorReply("Your streak isn't high enough for this item.");

			const isRotational = !!ROTATIONAL_ITEM_POOL[key];
			const isPermanent = !!SHOP_ITEMS[key];
			if (isRotational && !isPermanent && !state.rotationalShop?.includes(key)) {
				return this.errorReply("That item isn't currently in the shop.");
			}

			if (item.type === 'key') {
				if ((state.keyItems ?? []).includes(item.name)) return this.errorReply("You already own this key item.");
				state.battlePoints -= item.cost;
				state.keyItems = state.keyItems ?? [];
				state.keyItems.push(item.name);
				if (isRotational) state.rotationalShop = state.rotationalShop.filter(k => k !== key);
				state.notification = `Bought key item: <b>${item.name}</b>!`;
				setState(user.id, state);
				refreshGamePage(user);
				return;
			}

			if (item.type === 'pokemonPack') {
				state.battlePoints -= item.cost;
				if (isRotational) state.rotationalShop = state.rotationalShop.filter(k => k !== key);
				state.pendingChoice = pickNewPokemonOptions(state.team, state.floor);
				state.pendingChoiceType = 'add';
				setState(user.id, state);
				refreshGamePage(user);
				return;
			}

			if (item.type === 'itemPack') {
				const pseudoTeam = state.team.map(m => ({ species: Dex.species.get(toID(m.species)).name } as PokemonSet));
				const options = genItem(3, pseudoTeam);
				state.battlePoints -= item.cost;
				if (isRotational) state.rotationalShop = state.rotationalShop.filter(k => k !== key);
				state.itemOptions = options;
				state.purchasedItem = key;
				setState(user.id, state);
				refreshGamePage(user);
				return;
			}

			if (item.type === 'item' || item.type === 'evolveItem') {
				state.pendingItemName = item.name;
				state.purchasedItem = key;
				state.isRotationalItem = isRotational;
				setState(user.id, state);
				refreshGamePage(user);
				return;
			}

			if (item.type === 'TM') {
				const move = (item as TMItem).move;
				state.moveToLearn = move;
				state.purchasedItem = key;
				state.isRotationalItem = isRotational;
				setState(user.id, state);
				refreshGamePage(user);
				return;
			}

			if (['healHP', 'healPP', 'revive', 'cureStatus'].includes(item.type)) {
				state.purchasedItem = key;
				setState(user.id, state);
				refreshGamePage(user);
				return;
			}

			setState(user.id, state);
			refreshGamePage(user);
		},

		// ── TM: teach move to a Pokémon ────────────────────────────────────
		teachtm(target, room, user) {
			const state = getState(user.id);
			if (!state?.moveToLearn || !state.purchasedItem) return this.errorReply("No TM pending.");
			const t = target.trim();
			const itemKey = state.purchasedItem;
			const item = ROTATIONAL_ITEM_POOL[itemKey] ?? SHOP_ITEMS[itemKey];

			if (t === 'skip') {
				delete state.moveToLearn;
				delete state.purchasedItem;
				delete state.isRotationalItem;
				delete state.pokemonForTM;
				setState(user.id, state);
				refreshGamePage(user);
				return;
			}

			const slot = parseInt(t) - 1;
			if (isNaN(slot) || slot < 0 || slot >= state.team.length) return this.errorReply("Invalid team slot.");
			const mon = state.team[slot];

			const canLearn = Dex.species.getFullLearnset(toID(mon.species))
				.some(l => Object.keys(l.learnset ?? {}).includes(toID(state.moveToLearn!)));
			if (!canLearn) return this.errorReply("That Pokémon can't learn this TM move.");
			if (mon.moves.includes(state.moveToLearn)) return this.errorReply("That Pokémon already knows this move.");

			state.battlePoints -= item.cost;
			if (state.isRotationalItem) state.rotationalShop = state.rotationalShop.filter(k => k !== itemKey);

			state.pokemonForTM = slot;

			if (mon.moves.length < 4) {
				mon.moves.push(state.moveToLearn);
				if (!mon.ppLeft) mon.ppLeft = mon.moves.map(m => Math.floor((Dex.moves.get(m).pp ?? 5) * (8 / 5)));
				else mon.ppLeft.push(Math.floor((Dex.moves.get(state.moveToLearn).pp ?? 5) * (8 / 5)));
				state.notification = `<b>${Dex.species.get(toID(mon.species)).name}</b> learned <b>${Dex.moves.get(state.moveToLearn).name}</b>!`;
				delete state.moveToLearn;
				delete state.purchasedItem;
				delete state.isRotationalItem;
				delete state.pokemonForTM;
			} else {
				state.pendingMoves = state.pendingMoves ?? [];
				state.pendingMoves.unshift({ pokemonIndex: slot, move: state.moveToLearn, speciesName: mon.species });
				delete state.moveToLearn;
				delete state.purchasedItem;
				delete state.isRotationalItem;
				delete state.pokemonForTM;
			}

			setState(user.id, state);
			refreshGamePage(user);
		},

		// ── Item pack: pick one item ───────────────────────────────────────
		pickitem(target, room, user) {
			const state = getState(user.id);
			if (!state?.itemOptions?.length) return;
			const t = target.trim();
			if (t === 'skip') {
				delete state.itemOptions;
				delete state.purchasedItem;
				setState(user.id, state);
				refreshGamePage(user);
				return;
			}
			const dexItem = Dex.items.get(t);
			if (!dexItem.exists) return this.errorReply("Unknown item.");

			state.pendingItemName = dexItem.name;
			delete state.itemOptions;
			setState(user.id, state);
			refreshGamePage(user);
		},

		// ── Give item to a Pokémon ─────────────────────────────────────────
		giveitem(target, room, user) {
			const state = getState(user.id);
			if (!state?.pendingItemName) return this.errorReply("No item pending.");
			const t = target.trim();

			if (t === 'skip') {
				delete state.pendingItemName;
				delete state.purchasedItem;
				delete state.isRotationalItem;
				setState(user.id, state);
				refreshGamePage(user);
				return;
			}

			const slot = parseInt(t) - 1;
			if (isNaN(slot) || slot < 0 || slot >= state.team.length) return this.errorReply("Invalid team slot.");

			if (state.purchasedItem) {
				const item = ROTATIONAL_ITEM_POOL[state.purchasedItem] ?? SHOP_ITEMS[state.purchasedItem];
				if (item) {
					state.battlePoints -= item.cost;
					if (state.isRotationalItem) state.rotationalShop = state.rotationalShop.filter(k => k !== state.purchasedItem);
				}
			}

			const mon = state.team[slot];
			const dexNewItem = Dex.items.get(state.pendingItemName);
			const dexSpecies = Dex.species.get(toID(mon.species));

			if (dexNewItem.forcedForme && dexSpecies.otherFormes?.includes(dexNewItem.forcedForme)) {
				mon.species = toID(dexNewItem.forcedForme);
			} else if (mon.heldItem) {
				const dexOldItem = Dex.items.get(mon.heldItem);
				if (dexOldItem.forcedForme && dexSpecies.otherFormes?.includes(dexOldItem.forcedForme)) {
					mon.species = toID(dexSpecies.changesFrom ?? dexSpecies.baseSpecies);
				}
			}

			mon.heldItem = toID(state.pendingItemName);
			state.notification = `Gave <b>${Utils.escapeHTML(dexNewItem.name)}</b> to <b>${dexSpecies.name}</b>!`;

			delete state.pendingItemName;
			delete state.purchasedItem;
			delete state.isRotationalItem;
			setState(user.id, state);
			refreshGamePage(user);
		},

		// ── Use consumable shop items (healHP / healPP / revive / cureStatus)
		useshopitem(target, room, user) {
			const state = getState(user.id);
			if (!state?.purchasedItem) return this.errorReply("No item selected.");
			const itemKey = state.purchasedItem;
			const item = SHOP_ITEMS[itemKey] ?? ROTATIONAL_ITEM_POOL[itemKey];
			if (!item) return this.errorReply("Unknown item.");

			const slot = parseInt(target.trim()) - 1;
			if (isNaN(slot) || slot < 0 || slot >= state.team.length) return this.errorReply("Invalid team slot.");
			const mon = state.team[slot];
			const hp = mon.currentHp ?? 100;

			if (item.type === 'healHP') {
				if (hp >= 100) return this.errorReply("That Pokémon is already at full HP.");
				state.battlePoints -= item.cost;
				let healAmt = 20;
				switch (item.name) {
				case 'Potion':       healAmt = 20; break;
				case 'Super Potion': healAmt = 50; break;
				case 'Hyper Potion': healAmt = 120; break;
				case 'Max Potion':   healAmt = 100; break;
				}
				mon.currentHp = item.name === 'Max Potion' ? 100 : Math.min(100, hp + healAmt);
				state.notification = `<b>${Dex.species.get(toID(mon.species)).name}</b> restored HP! (${hp}% → ${mon.currentHp}%)`;

			} else if (item.type === 'healPP') {
				const allFull = (mon.ppLeft ?? []).every((v, i) => {
					const max = Math.floor((Dex.moves.get(mon.moves[i]).pp ?? 5) * (8 / 5));
					return v >= max;
				});
				if (allFull) return this.errorReply("That Pokémon's PP is already full.");
				state.battlePoints -= item.cost;
				fullHealPP(mon);
				state.notification = `<b>${Dex.species.get(toID(mon.species)).name}</b>'s PP was fully restored!`;

			} else if (item.type === 'cureStatus') {
				if (hp <= 0) return this.errorReply("Can't cure a fainted Pokémon.");
				if (!mon.status) return this.errorReply("That Pokémon has no status condition.");
				state.battlePoints -= item.cost;
				const oldStatus = mon.status;
				delete mon.status;
				state.notification = `<b>${Dex.species.get(toID(mon.species)).name}</b>'s ${oldStatus.toUpperCase()} was cured!`;

			} else if (item.type === 'revive') {
				if (hp > 0) return this.errorReply("That Pokémon hasn't fainted.");
				state.battlePoints -= item.cost;
				mon.currentHp = mon.species === 'shedinja' ? 100 : 50;
				// Reviving clears any lingering status
				delete mon.status;
				state.notification = `<b>${Dex.species.get(toID(mon.species)).name}</b> was revived!`;
			}

			delete state.purchasedItem;
			setState(user.id, state);
			refreshGamePage(user);
		},

		// ── Unequip held item ──────────────────────────────────────────────
		unequip(target, room, user) {
			const state = getState(user.id);
			if (!state) return;
			if (state.battleRoomId) return this.errorReply("Can't manage items during a battle.");
			const slot = parseInt(target.trim()) - 1;
			if (isNaN(slot) || slot < 0 || slot >= state.team.length) return this.errorReply("Invalid team slot.");
			const mon = state.team[slot];
			if (!mon.heldItem) return this.errorReply("That Pokémon isn't holding an item.");
			const dexItem = Dex.items.get(mon.heldItem);
			state.notification = `Took <b>${Utils.escapeHTML(dexItem.name || mon.heldItem)}</b> from ${Dex.species.get(toID(mon.species)).name}. (Item removed — no bag storage.)`;
			delete mon.heldItem;
			setState(user.id, state);
			refreshGamePage(user);
		},

		// ── Dismiss notification ───────────────────────────────────────────
		dismissnotif(target, room, user) {
			const s = getState(user.id);
			if (s?.notification) { delete s.notification; setState(user.id, s); }
			refreshGamePage(user);
		},

		// ── Status info ────────────────────────────────────────────────────
		status(target, room, user) {
			if (!this.runBroadcast()) return;
			const tId = toID(target) || user.id;
			const s = getState(tId);
			if (!s) return this.errorReply(`No run found for ${tId}.`);
			const buf = `<b>PokéRogue Status: ${tId}</b><br>Floor ${s.floor} | BP: ${s.battlePoints ?? 0}<br>${s.team.map(m => `Lv.${m.level} ${m.species}`).join(', ')}`;
			this.sendReplyBox(buf);
		},

		// ── Quit / reset run ───────────────────────────────────────────────
		quit(target, room, user) {
			const s = getState(user.id);
			if (s?.battleRoomId) {
				const match = activeMatches.get(s.battleRoomId as RoomID);
				if (match) {
					const bot = Users.get(match.botUserId);
					if (bot) destroyBotUser(bot);
					activeMatches.delete(s.battleRoomId as RoomID);
				}
				Rooms.get(s.battleRoomId)?.battle?.forfeit(user);
			}
			if (s) {
				s.gameOver = true;
				s.lastRunFloor = s.floor;
				s.lastRunStreaks = s.streaksWon || 0;
				s.team = [];
				delete s.pendingMoves;
				delete s.pendingSwap;
				delete s.pendingChoice;
				delete s.moveToLearn;
				delete s.pendingItemName;
				delete s.itemOptions;
				delete s.purchasedItem;
				setState(user.id, s);
			}
			refreshGamePage(user);
		},

		// ── Staff commands ─────────────────────────────────────────────────
		givebp(target, room, user) {
			this.checkCan('lock');
			let [name, amt] = target.split(',').map(s => s?.trim());
			if (!amt && !isNaN(parseInt(name))) { amt = name; name = user.id; }
			const tId = toID(name) || user.id;
			const s = getState(tId);
			if (s) {
				s.battlePoints = (s.battlePoints ?? 0) + parseInt(amt || '5');
				setState(tId, s);
				this.sendReply(`Gave ${amt || '5'} BP to ${tId}.`);
			}
		},

		removebp(target, room, user) {
			this.checkCan('lock');
			let [name, amt] = target.split(',').map(s => s?.trim());
			if (!amt && !isNaN(parseInt(name))) { amt = name; name = user.id; }
			const tId = toID(name) || user.id;
			const s = getState(tId);
			if (s) {
				s.battlePoints = Math.max(0, (s.battlePoints ?? 0) - parseInt(amt || '5'));
				setState(tId, s);
				this.sendReply(`Removed ${amt || '5'} BP from ${tId}.`);
			}
		},

		addmon(target, room, user) {
			this.checkCan('lock');
			const [name, mon, lvl] = target.split(',').map(s => s.trim());
			const tId = toID(name) || user.id;
			const s = getState(tId);
			if (!s) return this.errorReply(`No active run for ${tId}.`);
			if (s.team.length >= 6) return this.errorReply(`${tId}'s team is full.`);
			const species = Dex.species.get(toID(mon));
			if (!species.exists) return this.errorReply("Invalid Pokémon.");
			const level = parseInt(lvl) || 1;
			let finalSpecies = species.id;
			while (true) {
				const evo = getLevelUpEvo(finalSpecies);
				if (!evo || level < evo.evoLevel) break;
				finalSpecies = evo.evoTo;
			}
			const moves = getLevelUpMoves(finalSpecies, level);
			s.team.push({
				species: finalSpecies,
				level,
				exp: expForLevel(level, getExpType(finalSpecies)),
				moves,
				ppLeft: moves.map(m => Math.floor((Dex.moves.get(m).pp ?? 5) * (8 / 5))),
			});
			setState(tId, s);
			this.sendReply(`Added ${finalSpecies} to ${tId}'s team.`);
		},

		setfloor(target, room, user) {
			this.checkCan('lock');
			let [name, fl] = target.split(',').map(s => s?.trim());
			if (!fl && !isNaN(parseInt(name))) { fl = name; name = user.id; }
			const tId = toID(name) || user.id;
			const s = getState(tId);
			if (s) {
				s.floor = parseInt(fl || '1');
				setState(tId, s);
				this.sendReply(`Set floor for ${tId} to ${s.floor}.`);
			}
		},

		healteam(target, room, user) {
			this.checkCan('lock');
			const tId = toID(target) || user.id;
			const s = getState(tId);
			if (s) {
				for (const m of s.team) {
					m.currentHp = 100;
					delete m.status;
					fullHealPP(m);
				}
				setState(tId, s);
				this.sendReply(`Healed team for ${tId}.`);
			}
		},

		removemon(target, room, user) {
			this.checkCan('lock');
			const tId = toID(target) || user.id;
			if (getState(tId)) { deleteState(tId); this.sendReply(`Wiped data for ${tId}.`); }
		},

		help(target, room, user) {
			if (!this.runBroadcast()) return;
			const isStaff = user.can('lock');
			let html = `<b>PokéRogue - Player Commands:</b><br>` +
				`<code>/pokerogue start</code> - Open the game page.<br>` +
				`<code>/pokerogue battle</code> - Start floor battle.<br>` +
				`<code>/pokerogue view shop</code> - Item shop.<br>` +
				`<code>/pokerogue status</code> - View run info.<br>` +
				`<code>/pokerogue view top</code> - Leaderboard.<br>` +
				`<code>/pokerogue quit</code> - Abandon run.<br>`;
			if (isStaff) {
				html += `<br><b>Staff Commands:</b> givebp, removebp, setfloor, healteam, addmon, removemon.`;
			}
			this.sendReplyBox(html);
		},

		'': 'help',
	},
};

export const pages: Chat.PageTable = {
	pokerogue(args, user) {
		if (!user.named) return this.errorReply('Login required.');
		const state = getState(user.id);
		if (!state) return `<div class="pr-popup"><div class="pr-popup-header"><h2>PokéRogue</h2></div><div style="text-align:center;padding:16px"><button name="send" value="/pokerogue start" class="button">Start New Run</button></div></div>`;
		const v = (state as any).view || 'main';
		this.title = `PokéRogue - ${v.toUpperCase()}`;
		return renderGamePage(state);
	},
};

// ---------------------------------------------------------------------------
// Battle end handler
// ---------------------------------------------------------------------------

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner, players) {
		const match = activeMatches.get(battle.roomid);
		if (!match) return;
		activeMatches.delete(battle.roomid);
		const botUser = Users.get(match.botUserId);
		if (botUser) destroyBotUser(botUser);
		const state = getState(match.userId);
		if (!state) return;

		const isBossFloor = match.floor % 10 === 0;
		const room = Rooms.get(battle.roomid);
		const logLines: string[] = room?.log?.log ?? [];

		const { consumedItems } = syncBattleOutcome(logLines, state);
		if (consumedItems.length) {
			state.notification = (state.notification ?? '') +
				`<br><b style="color:#ffb84d">Consumed items:</b> ${consumedItems.join(', ')}`;
		}

		delete state.battleRoomId;

		if (toID(winner) === match.userId) {
			// ── Win ──────────────────────────────────────────────────────
			const expMap = parseKillExp(logLines, state, match.floor, isBossFloor);
			const totalExpEarned = [...expMap.values()].reduce((sum, v) => sum + v, 0);
			const detailMsgs: string[] = [];

			if (totalExpEarned > 0) {
				for (let i = 0; i < state.team.length; i++) {
					const mon = state.team[i];
					if ((mon.currentHp ?? 100) === 0) continue;
					const oldSpecies = mon.species;
					const { evolved, oldLevel } = applyExpAndLevelUp(mon, totalExpEarned);
					detailMsgs.push(...processLevelUp(mon, oldLevel, oldSpecies, evolved, i, state));
				}
			}

			let bpGained = BP_PER_WIN;
			const prevFloor = state.floor;
			state.floor++;
			state.streaksWon = (state.streaksWon ?? 0) + 1;

			if (isStreakBoundary(prevFloor)) {
				bpGained += BP_PER_STREAK;
				for (const mon of state.team) {
					mon.currentHp = 100;
					delete mon.status;
					fullHealPP(mon);
				}
				state.notification = (state.notification ?? '') + `<br><b style="color:#4caf50">Streak complete! Full heal!</b>`;
			}

			state.battlePoints = (state.battlePoints ?? 0) + bpGained;

			if (state.floor > (state.highestFloor ?? 0)) {
				state.highestFloor = state.floor;
				state.recordTeam = JSON.parse(JSON.stringify(state.team));
			}
			state.displayName = Users.get(match.userId)?.name || match.userId;

			state.notification = (state.notification ?? '') +
				`<br><b>Floor ${prevFloor} Cleared!</b> +${bpGained} BP.<br>` +
				detailMsgs.join('<br>');

			state.timesRerolled = 0;
			const pseudoTeam = state.team.map(m => ({ species: Dex.species.get(toID(m.species)).name } as PokemonSet));
			state.rotationalShop = rollShop(pseudoTeam, state.streaksWon ?? 0);

			if ((state.floor - 1) % 5 === 0) {
				state.pendingChoice = pickNewPokemonOptions(state.team, prevFloor);
				state.pendingChoiceType = 'add';
				state.notification += `<br><b style="color:#c4a8ff">Milestone! Choose a new Pokémon to add!</b>`;
			}

		} else {
			// ── Loss ─────────────────────────────────────────────────────
			delete state.pendingMoves;
			delete state.pendingSwap;
			delete state.moveToLearn;
			delete state.pendingItemName;
			delete state.itemOptions;
			delete state.purchasedItem;

			if ((state.keyItems ?? []).includes('Revive')) {
				state.keyItems = state.keyItems!.filter(k => k !== 'Revive');
				state.notification = (state.notification ?? '') +
					'<br><b>Revive used!</b> Retrying Floor ' + String(match.floor);
			} else {
				state.gameOver = true;
				state.lastRunFloor = match.floor;
				state.lastRunStreaks = state.streaksWon || 0;
				state.team = [];
			}
		}

		setState(match.userId, state);
		const hUser = Users.get(match.userId);
		if (hUser) refreshGamePage(hUser);
	},
};

export const start = (): void => {
	const { Dex } = require('../../../sim/dex');
	const { Format } = require('../../../sim/dex-formats');
	const FORMAT_ID = 'roguelikebattle' as ID;
	if (Dex.formats.rulesetCache.has(FORMAT_ID)) return;
	Dex.formats.load();
	const format = new Format({
		name: 'PokéRogue Battle', mod: 'gen9', effectType: 'Format', section: 'Roguelike',
		ruleset: ['Max Team Size = 6', 'Max Move Count = 4', 'Max Level = 999', 'Default Level = 5', 'HP Percentage Mod', 'Cancel Mod'],
		rated: false,
	});
	Dex.formats.rulesetCache.set(FORMAT_ID, format);
};
