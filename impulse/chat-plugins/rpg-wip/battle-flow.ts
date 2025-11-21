import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import {
	getMove,
	getActiveSlots,
	getActiveParty,
	activateUnburden,
	applyStatChange,
	createActivePokemonSlot,
	checkTrappingAbility,
	getSlotFromIndex,
	getMoveTargets,
	getAccuracyEvasionMultiplier,
	handleMirrorHerb,
} from './utils';
import type { RPGPokemon, ActivePokemonSlot, PlayerData, BattleState, Move } from './interface';
import { ITEMS_DATABASE } from './items';
import { LOCATIONS } from './game-locations';
import {
	generateBattleTowerFloorCompleteHTML,
	generateBattleTowerLossHTML,
} from './battle-tower';
import { getPlayerData, activeBattles } from './core';
import { teraToggleState, activeScriptedEvents } from './commands';
import {
	generateBattleHTML,
	generateMoveLearnHTML,
	generatePivotSwitchHTML,
	generateFaintSwitchHTML,
} from './html';
import { RPGMoves } from './battle-moves';
import { getBadgeForGymLeader, TOTAL_BADGES } from './game-npcs';
import { GameConfig } from './game-config';

import {
	gainExperience,
	getCustomEffectiveness,
	getStatMultiplier,
	handleDamagingMove,
	handleStatusMove,
	saveBattleStatus,
	getPokemonTypes,
	getMoveType,
} from './battle-core';

import { processEndOfTurn } from './battle-eot';

// #region Turn Orchestration

export function processTurn(context: CommandContext, battle: BattleState, room: ChatRoom, user: User, initialMessages: string[] = []) {
	const messageLog: string[] = [...initialMessages];
	battle.turn++;

	// Reset Turn Flags
	['player', 'opponent'].forEach(side => {
		['QuickGuard', 'WideGuard', 'CraftyShield'].forEach(guard => (battle as any)[`${side}${guard}`] = false);
	});

	getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(s => {
		s.isHelped = false; s.isRedirecting = false; s.lastDamageTaken = undefined;
	});

	// AI Generation
	getActiveSlots(battle.opponentSlots).forEach((slot, i) => {
		const idx = 2 + i;
		if (!battle.pendingActions[idx]) battle.pendingActions[idx] = generateAiAction(slot, idx, battle);
	});

	// Execution
	const actionQueue = buildActionQueue(battle, messageLog);
	for (const action of actionQueue) {
		executeAction(action, battle, room, user, messageLog);
		if (checkBattleEndCondition(context, battle, room, user, messageLog)) {
			logTurnEnd(battle, messageLog); return;
		}
	}

	if (battle.forceEnd) { logTurnEnd(battle, messageLog); return; }

	// End of Turn
	messageLog.push("--- End of Turn ---");
	processEndOfTurn(battle, messageLog);

	if (checkBattleEndCondition(context, battle, room, user, messageLog)) {
		logTurnEnd(battle, messageLog); return;
	}

	logTurnEnd(battle, messageLog);
	battle.pendingActions = {};

	// Prepare Next Turn
	updateActiveTurns(battle);
	if (hasActivePokemonBothSides(battle)) {
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [], undefined, teraToggleState.get(user.id))}`);
	}
}

function logTurnEnd(battle: BattleState, log: string[]) {
	log.push(`<hr><div style="text-align: center;"><strong>Turn ${battle.turn}</strong></div><hr>`);
	battle.battleLog.push(...log);
}

function updateActiveTurns(battle: BattleState) {
	getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(s => { if (s.pokemon.hp > 0) s.activeTurns++; });
}

function hasActivePokemonBothSides(battle: BattleState): boolean {
	const hasP = battle.playerSlots.some(s => s !== null && s.pokemon.hp > 0);
	const hasO = battle.opponentSlots.some(s => s !== null && s.pokemon.hp > 0);
	return hasP && hasO;
}

// #endregion

// #region Action Queue & Priority

export function buildActionQueue(battle: BattleState, messageLog: string[]): NonNullable<BattleState['pendingActions'][number]>[] {
	const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);
	allSlots.forEach(s => s.analyticBoost = false);

	const queue = Object.values(battle.pendingActions).filter(a =>
		a && allSlots.some(s => s.pokemon.id === a.pokemonId)
	) as NonNullable<BattleState['pendingActions'][number]>[];

	queue.sort((a, b) => {
		const slotA = allSlots.find(s => s.pokemon.id === a.pokemonId)!;
		const slotB = allSlots.find(s => s.pokemon.id === b.pokemonId)!;

		const pA = calculateActionPriority(a, slotA);
		const pB = calculateActionPriority(b, slotB);
		if (pA !== pB) return pB - pA;

		const sA = calculateActionSpeed(slotA, battle);
		const sB = calculateActionSpeed(slotB, battle);

		const qA = handleQuickClaw(slotA, a, battle, messageLog);
		const qB = handleQuickClaw(slotB, b, battle, messageLog);
		if (qA !== qB) return qA ? -1 : 1;

		return battle.trickRoomTurns > 0 ? sA - sB : sB - sA;
	});

	// Analytic Check
	const lastMove = [...queue].reverse().find(a => a.actionType === 'move');
	if (lastMove) {
		const s = allSlots.find(slot => slot.pokemon.id === lastMove.pokemonId);
		if (s && toID(s.pokemon.ability || '') === 'analytic') s.analyticBoost = true;
	}

	return queue;
}

function calculateActionPriority(action: BattleState['pendingActions'][number], slot: ActivePokemonSlot): number {
	if (!action || action.actionType === 'switch') return 6;
	const move = getMove(action.moveId || 'struggle');
	return move.priority + RPGAbilities.applyPriorityModifier(move, slot.pokemon);
}

function calculateActionSpeed(slot: ActivePokemonSlot, battle: BattleState): number {
	let speed = slot.pokemon.spe * getStatMultiplier(slot.statStages.spe);
	if (battle.magicRoomTurns === 0) {
		if (slot.pokemon.item === 'choicescarf') speed = Math.floor(speed * 1.5);
		if (slot.pokemon.item === 'ironball') speed = Math.floor(speed * 0.5);
	}
	speed = RPGAbilities.applyAbilitySpeedModifier(slot.pokemon, battle, speed);
	if (slot.status === 'par' && toID(slot.pokemon.ability || '') !== 'quickfeet') speed = Math.floor(speed / 2);
	return speed;
}

function handleQuickClaw(slot: ActivePokemonSlot, action: BattleState['pendingActions'][number], battle: BattleState, log: string[]): boolean {
	if (!action || action.actionType === 'switch') return false;
	if (battle.magicRoomTurns === 0 && slot.pokemon.item === 'quickclaw' && Math.random() < 0.2) {
		log.push(`${slot.pokemon.species}'s Quick Claw let it move first!`);
		return true;
	}
	return false;
}

// #endregion

// #region AI Logic

export function generateAiAction(aiSlot: ActivePokemonSlot, aiSlotIndex: number, battle: BattleState): BattleState['pendingActions'][number] {
	let chosenMoveId = determineForcedMove(aiSlot, battle) || 'struggle';

	if (chosenMoveId === 'struggle') {
		const validMoves = aiSlot.pokemon.moves.filter(m => isValidAiMove(m, aiSlot, true));
		const fallbackMoves = aiSlot.pokemon.moves.filter(m => isValidAiMove(m, aiSlot, false));
		const pool = validMoves.length > 0 ? validMoves : fallbackMoves;

		if (pool.length > 0) chosenMoveId = pool[Math.floor(Math.random() * pool.length)].id;
	}

	// Simple Target Selection (Random Player Slot)
	const playerSlots = getActiveSlots(battle.playerSlots);
	const targetIdx = playerSlots.length > 0 ? battle.playerSlots.indexOf(playerSlots[Math.floor(Math.random() * playerSlots.length)]) : 0;

	return { actionType: 'move', moveId: chosenMoveId, targetSlot: targetIdx, pokemonId: aiSlot.pokemon.id };
}

function determineForcedMove(slot: ActivePokemonSlot, battle: BattleState): string | null {
	if (slot.chargingMove) {
		const m = slot.pokemon.moves.find(mv => mv.id === slot.chargingMove);
		return (m && m.pp > 0) ? slot.chargingMove : null;
	}
	const locked = slot.lockedMove;
	if (locked) {
		const m = slot.pokemon.moves.find(mv => mv.id === locked);
		const isChoice = battle.magicRoomTurns === 0 && ['choiceband', 'choicescarf', 'choicespecs'].includes(slot.pokemon.item || '');
		if (slot.lockedMoveCounter > 0 || slot.uproarTurns > 0 || isChoice) {
			return (m && m.pp > 0) ? locked : null;
		}
	}
	if (slot.encoreMove) {
		const m = slot.pokemon.moves.find(mv => mv.id === slot.encoreMove!.moveId);
		return (m && m.pp > 0) ? slot.encoreMove.moveId : null;
	}
	return null;
}

function isValidAiMove(m: { id: string, pp: number }, slot: ActivePokemonSlot, checkStatus: boolean): boolean {
	if (m.pp <= 0) return false;
	const data = getMove(m.id);
	if (slot.disabledMove?.moveId === m.id) return false;
	if (slot.tormentActive && slot.lastMoveUsed === m.id) return false;
	if (slot.tauntTurns > 0 && data.category === 'Status') return false;
	if (checkStatus && data.category === 'Status') return false; // Preference logic
	return true;
}

// #endregion

// #region Validation & Pre-Turn

export function validateMoveAction(slot: ActivePokemonSlot, moveId: string, battle: BattleState): string | null {
	if (moveId === 'struggle') return null;
	const p = slot.pokemon;
	const move = getMove(moveId);
	const moveObj = p.moves.find(m => m.id === move.id);

	if (slot.tauntTurns > 0 && move.category === 'Status') return `${p.species} is taunted! It can't use ${move.name}!`;
	if (battle.magicRoomTurns === 0 && p.item === 'assaultvest' && move.category === 'Status') return `Your Assault Vest prevents you from using ${move.name}!`;
	if (moveObj && moveObj.pp === 0) return `There is no PP left for ${move.name}!`;

	if (slot.chargingMove && slot.chargingMove !== move.id) return `${p.species} must continue using ${getMove(slot.chargingMove).name}!`;
	if (slot.disabledMove?.moveId === move.id) return `${move.name} is disabled!`;
	
	if (slot.encoreMove && slot.encoreMove.moveId !== move.id) {
		const m = p.moves.find(mv => mv.id === slot.encoreMove!.moveId);
		if (m && m.pp > 0) return `${p.species} must use ${slot.encoreMove.moveId}!`;
	}

	if (slot.tormentActive && slot.lastMoveUsed === move.id) return `${p.species} can't use the same move twice due to Torment!`;
	if (slot.lockedMoveCounter > 0 && slot.lockedMove !== move.id) return `${p.species} must continue using ${getMove(slot.lockedMove!).name}!`;
	if (slot.uproarTurns > 0 && slot.lockedMove !== move.id) return `${p.species} must continue its uproar!`;
	if (slot.healBlockTurns > 0 && move.flags.heal) return `${p.species} is prevented from healing by Heal Block!`;

	if (slot.lockedMove && slot.lockedMove !== move.id && battle.magicRoomTurns === 0 && slot.lockedMoveCounter === 0 && slot.uproarTurns === 0) {
		const m = p.moves.find(mv => mv.id === slot.lockedMove);
		if (m && m.pp > 0) return `${p.species} is locked into ${m.id}!`;
	}

	return null;
}

export function handlePreTurnChecks(slot: ActivePokemonSlot, battle: BattleState, log: string[], move?: Move): boolean {
	const p = slot.pokemon;
	const abil = toID(p.ability || '');

	if (abil === 'truant' && slot.isLoafing) { log.push(`${p.species} is loafing around!`); slot.isLoafing = false; return false; }
	if (slot.mustRecharge) { log.push(`${p.species} must recharge!`); slot.mustRecharge = false; return false; }

	if (slot.willFlinch) {
		log.push(`${p.species} flinched and couldn't move!`); slot.willFlinch = false;
		if (abil === 'steadfast' && slot.statStages.spe < 6) { slot.statStages.spe++; log.push(`${p.species}'s Steadfast raised its Speed!`); }
		return false;
	}

	if (slot.status === 'frz') {
		if (Math.random() < 0.20) { slot.status = null; log.push(`${p.species} thawed out!`); }
		else { log.push(`${p.species} is frozen solid!`); return false; }
	}

	if (slot.status === 'slp') {
		if (move?.sleepUsable) return true;
		slot.sleepCounter -= (abil === 'earlybird' ? 2 : 1);
		if (slot.sleepCounter > 0) { log.push(`${p.species} is fast asleep.`); return false; }
		else { slot.status = null; log.push(`${p.species} woke up!`); }
	}

	if (slot.isConfused) {
		log.push(`${p.species} is confused!`);
		if (--slot.confusionCounter <= 0) { slot.isConfused = false; log.push(`${p.species} snapped out of its confusion!`); }
		else if (Math.random() < 1 / 3) {
			if (abil === 'tangledfeet') { log.push(`${p.species}'s Tangled Feet prevents it from hurting itself!`); return false; }
			log.push(`It hurt itself in its confusion!`);
			const dmg = Math.floor((((2 * p.level / 5 + 2) * 40 * (p.atk / p.def)) / 50) + 2);
			p.hp = Math.max(0, p.hp - dmg); log.push(`${p.species} took ${dmg} damage!`);
			return false;
		}
	}

	if (slot.status === 'par' && abil !== 'quickfeet' && Math.random() < 0.25) {
		log.push(`${p.species} is fully paralyzed!`); return false;
	}

	if (move && slot.disabledMove?.moveId === move.id) {
		log.push(`${p.species}'s ${move.name} is disabled!`); return false;
	}

	return true;
}

// #endregion

// #region Action Execution

export function executeAction(action: NonNullable<BattleState['pendingActions'][number]>, battle: BattleState, room: ChatRoom, user: User, log: string[]) {
	const allSlots = [...battle.playerSlots, ...battle.opponentSlots];
	const idx = allSlots.findIndex(s => s?.pokemon.id === action.pokemonId);
	const slot = allSlots[idx];
	if (!slot || slot.pokemon.hp <= 0) return;

	slot.isRedirecting = false;

	if (action.actionType === 'switch') {
		handleSwitchAction(slot, idx, action as any, battle, getPlayerData(battle.playerId), log);
		return;
	}

	if (action.actionType === 'move' && action.moveId && action.targetSlot !== undefined) {
		handleTerastallization(action, slot, idx < battle.playerSlots.length, battle, log);

		const moveData = getMove(action.moveId);
		let moveObj = slot.pokemon.moves.find(m => m.id === moveData.id);

		if (moveData.id === 'struggle' || !moveObj || moveObj.pp === 0) {
			moveObj = { id: 'struggle', pp: 1 };
			if (moveData.id !== 'struggle') log.push(`${slot.pokemon.species} has no PP left for ${moveData.name}!`);
		}

		if (!handlePreTurnChecks(slot, battle, log, moveData)) return;

		const targetIdx = resolveMoveTarget(idx, action.targetSlot, moveData, battle, log);
		const targets = getMoveTargets(idx, targetIdx, moveData, battle);

		let ppCost = targets.some(t => toID(t.pokemon.ability || '') === 'pressure') ? 2 : 1;
		if (RPGMoves.handleChargingMove(slot, moveData, moveObj, battle, log, ppCost)) return;

		if (moveObj.id !== 'struggle' && moveObj.pp > 0 && !moveData.flags.charge) moveObj.pp = Math.max(0, moveObj.pp - ppCost);

		if (targets.length === 0) {
			if (['self', 'allySide', 'all'].includes(moveData.target)) {
				log.push(`<span style="color: #555;"><strong>${slot.pokemon.species}</strong> used <strong>${moveData.name}</strong>!</span>`);
				log.push(`But there was no target!`);
			}
			return;
		}

		log.push(`<span style="color: #555;"><strong>${slot.pokemon.species}</strong> used <strong>${moveData.name}</strong>!</span>`);

		const validTargets = targets.filter(dSlot => {
			const prevented = RPGAbilities.preventMove({ attacker: slot.pokemon, defender: dSlot.pokemon, attackerSlot: slot, defenderSlot: dSlot, move: moveData, battle, messageLog: log });
			if (prevented?.prevented) log.push(prevented.message || `${dSlot.pokemon.species}'s ability prevented the move!`);
			return !prevented?.prevented;
		});

		if (targets.length > 0 && validTargets.length === 0) return;

		executeMove(slot, validTargets, moveData, moveObj, battle, log);
		handlePostMoveLocks(slot, moveData, battle);
		handleSelfSwitch(slot, moveData, idx, action.targetSlot, battle, getPlayerData(battle.playerId), log);
	}
}

function handleTerastallization(action: any, slot: ActivePokemonSlot, isPlayer: boolean, battle: BattleState, log: string[]) {
	if (action.terastallize && isPlayer) {
		if (battle.playerTerastallizeUsed) log.push(`<span style="color: #FF1493;">${slot.pokemon.species} couldn't Terastallize because another Pokemon already did!</span>`);
		else if (slot.terastallized) log.push(`<span style="color: #FF1493;">${slot.pokemon.species} has already Terastallized!</span>`);
		else {
			slot.terastallized = slot.pokemon.teraType;
			battle.playerTerastallizeUsed = true;
			log.push(`<span style="color: #FF1493; font-weight: bold;">✨ ${slot.pokemon.species} Terastallized into ${slot.pokemon.teraType} type! ✨</span>`);
			if (toID(slot.pokemon.ability || '') === 'slowstart' && (slot.slowStartTurns || 0) > 0) {
				slot.slowStartTurns = 0; log.push(`${slot.pokemon.species} got its act together due to Terastallization!`);
			}
		}
	}
}

function handlePostMoveLocks(slot: ActivePokemonSlot, move: Move, battle: BattleState) {
	if (slot.pokemon.hp > 0 && move.id !== 'struggle' && !slot.lockedMove) {
		if (battle.magicRoomTurns === 0 && ['choiceband', 'choicescarf', 'choicespecs'].includes(slot.pokemon.item || '')) {
			slot.lockedMove = move.id;
		}
	}
}

export function executeMove(attackerSlot: ActivePokemonSlot, targetSlots: ActivePokemonSlot[], move: Move, moveObject: { id: string, pp: number }, battle: BattleState, messageLog: string[]) {
	attackerSlot.lastMoveUsed = move.id;
	if (!['protect', 'detect'].includes(move.id)) attackerSlot.protectSuccessCounter = 0;

	const isSpread = ['allAdjacentFoes', 'allAdjacent', 'scripted'].includes(move.target);
	const spreadMult = (isSpread && targetSlots.filter(s => s.pokemon.hp > 0).length > 1) ? 0.75 : 1.0;
	let hitAny = false;

	if (move.category === 'Status' && (move.weather || move.terrain || move.pseudoWeather || ['trickroom', 'magicroom', 'wonderroom', 'gravity', 'mudsport', 'watersport', 'haze', 'perishsong', 'courtchange'].includes(move.id))) {
		handleStatusMove(attackerSlot, null, move, battle, messageLog);
		return;
	}

	for (const defenderSlot of targetSlots) {
		if (attackerSlot.pokemon.hp <= 0) break;
		if (defenderSlot.pokemon.hp <= 0) continue;

		// Psychic Terrain Protection
		const priority = move.priority + RPGAbilities.applyPriorityModifier(move, attackerSlot.pokemon);
		if (battle.terrain?.type === 'psychic' && priority > 0 && RPGAbilities.isGrounded(defenderSlot.pokemon, battle)) {
			const isAttackerPlayer = battle.playerSlots.includes(attackerSlot);
			const isDefenderPlayer = battle.playerSlots.includes(defenderSlot);
			if (isAttackerPlayer !== isDefenderPlayer) {
				messageLog.push(`${defenderSlot.pokemon.species} is protected by the Psychic Terrain!`); continue;
			}
		}

		// Wide Guard
		if (isSpread && ((battle.playerSlots.includes(defenderSlot) && battle.playerWideGuard) || (battle.opponentSlots.includes(defenderSlot) && battle.opponentWideGuard))) {
			messageLog.push(`${defenderSlot.pokemon.species} was protected by Wide Guard!`); continue;
		}

		// Protect
		const bypass = toID(attackerSlot.pokemon.ability || '') === 'unseenfist' && move.flags.contact;
		if (move.id !== 'struggle' && defenderSlot.isProtected && move.flags.protect && !move.breaksProtect && !bypass) {
			messageLog.push(`<span style="color: #6c757d;">${defenderSlot.pokemon.species} protected itself!</span>`); continue;
		}

		// Accuracy
		if (!checkAccuracy(attackerSlot, defenderSlot, move, battle, messageLog)) continue;

		hitAny = true;
		if (move.id === 'struggle') handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog, 1.0);
		else if (move.category === 'Status') handleStatusMove(attackerSlot, defenderSlot, move, battle, messageLog);
		else handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog, spreadMult);
	}

	if (attackerSlot.pokemon.hp > 0) {
		handleSelfEffects(attackerSlot, move, hitAny, messageLog);
		handleFormChanges(attackerSlot, move, hitAny, messageLog, battle);
	}

	targetSlots.forEach(s => { if (s.pokemon.hp > 0) RPGAbilities.checkFormChangeAbilities(s, battle, messageLog); });
	if (attackerSlot.pokemon.hp > 0 && toID(attackerSlot.pokemon.ability || '') === 'truant') attackerSlot.isLoafing = true;
}

function checkAccuracy(aSlot: ActivePokemonSlot, dSlot: ActivePokemonSlot, move: Move, battle: BattleState, log: string[]): boolean {
	const a = aSlot.pokemon; const d = dSlot.pokemon;
	if (['aerialace', 'struggle'].includes(move.id) || toID(a.ability || '') === 'noguard' || toID(d.ability || '') === 'noguard') return true;
	if (move.accuracy === true) return true;

	const accStage = getAccuracyEvasionMultiplier(aSlot.statStages.accuracy);
	const ignoreEvasion = toID(a.ability || '') === 'mindseye';
	const evaStage = ignoreEvasion ? 1 : getAccuracyEvasionMultiplier(dSlot.statStages.evasion);
	let acc = RPGAbilities.applyAccuracyModifier(move.accuracy, a, move);

	const abilEva = RPGAbilities.getEvasionMultiplier(dSlot, battle);
	
	if (RPGAbilities.isWeatherActive(battle)) {
		if (battle.weather!.type.includes('rain') && ['thunder', 'hurricane'].includes(move.id)) acc = 100;
		if (battle.weather!.type.includes('sun') && ['thunder', 'hurricane'].includes(move.id)) acc = 50;
		if (battle.weather!.type === 'hail' && move.id === 'blizzard') acc = 100;
	}
	if (battle.gravityTurns > 0) acc = Math.floor(acc * (5 / 3));

	const final = acc * (accStage / (evaStage * abilEva));
	if (Math.random() * 100 > final) {
		log.push(`<span style="color: #dc3545;">${a.species}'s ${move.name} missed ${d.species}!</span>`);
		if (['highjumpkick', 'jumpkick'].includes(move.id)) {
			const dmg = Math.floor(a.maxHp / 2); a.hp = Math.max(0, a.hp - dmg);
			log.push(`<span style="color: #dc3545;">${a.species} kept going and crashed!</span>`);
		}
		return false;
	}
	return true;
}

function handleSelfEffects(slot: ActivePokemonSlot, move: Move, hitAny: boolean, log: string[]) {
	if (move.self?.volatileStatus === 'lockedmove' && slot.lockedMoveCounter === 0) {
		slot.lockedMoveCounter = Math.floor(Math.random() * 2) + 2; slot.lockedMove = move.id;
	}
	if (move.self?.volatileStatus === 'mustrecharge' && hitAny) slot.mustRecharge = true;
	if (move.self?.volatileStatus === 'uproar' && slot.uproarTurns === 0) {
		slot.uproarTurns = 3; slot.lockedMove = move.id;
		// Wake up logic usually here
	}
}

function handleFormChanges(slot: ActivePokemonSlot, move: Move, hitAny: boolean, log: string[], battle: BattleState) {
	RPGAbilities.checkFormChangeAbilities(slot, battle, log);
	if (toID(slot.pokemon.ability || '') === 'gulpmissile' && ['surf', 'dive'].includes(move.id) && hitAny) {
		const hpRatio = slot.pokemon.hp / slot.pokemon.maxHp;
		const form = hpRatio > 0.5 ? 'gulping' : 'gorging';
		const suffix = hpRatio > 0.5 ? 'Gulping' : 'Gorging';
		const prey = hpRatio > 0.5 ? 'Arrokuda' : 'Pikachu';
		if (!slot.pokemon.species.includes(suffix)) {
			slot.pokemon.species = `Cramorant-${suffix}`;
			(slot as any).gulpMissileForm = form;
			log.push(`${slot.pokemon.nickname || 'Cramorant'} caught a ${prey}!`);
		}
	}
}

// #endregion

// #region Switching & Hazards

export function handleSwitchAction(
	slot: ActivePokemonSlot,
	idx: number,
	action: Extract<NonNullable<BattleState['pendingActions'][number]>, { actionType: 'switch' }>,
	battle: BattleState,
	player: PlayerData,
	log: string[]
) {
	if (canSwitch(slot, battle, log)) {
		const outP = slot.pokemon;
		handleSwitchOutAbilities(slot, log);
		saveBattleStatus(battle);

		const isPlayer = idx <= 1;
		const nextId = action.switchToPokemonId!;
		
		if (isPlayer) {
			const nextP = getActiveParty(battle, player).find(p => p.id === nextId);
			if (performSwitch(battle.playerSlots, idx as 0 | 1, nextP, outP, battle, true, log)) {
				log.push(`<b>${player.name} withdrew ${outP.species} and sent out ${nextP!.species}!</b>`);
			}
		} else {
			const nextP = battle.opponentParty.find(p => p.id === nextId);
			if (performSwitch(battle.opponentSlots, idx as 0 | 1, nextP, outP, battle, false, log)) {
				log.push(`<b>${battle.opponentName} withdrew ${outP.species} and sent out ${nextP!.species}!</b>`);
			}
		}
	}
}

function canSwitch(slot: ActivePokemonSlot, battle: BattleState, log: string[]): boolean {
	const p = slot.pokemon;
	if (battle.magicRoomTurns === 0 && p.item === 'shedshell') {
		if (slot.isIngrained) { log.push(`${p.species} is rooted in place by Ingrain!`); return false; }
		return true;
	}
	const trap = checkTrappingAbility(slot, battle);
	if (trap) { log.push(`${p.species} can't escape due to ${trap.pokemon.species}'s ${trap.pokemon.ability}!`); return false; }
	if (slot.isIngrained) { log.push(`${p.species} is rooted in place!`); return false; }
	if (slot.isTrapped || slot.partiallyTrapped) { log.push(`${p.species} is trapped!`); return false; }
	if (battle.fairyLockTurns > 0) { log.push(`${p.species} can't switch due to Fairy Lock!`); return false; }
	return true;
}

function handleSwitchOutAbilities(slot: ActivePokemonSlot, log: string[]) {
	const p = slot.pokemon;
	const abil = toID(p.ability || '');
	if (abil === 'regenerator' && p.hp > 0 && p.hp < p.maxHp) {
		p.hp = Math.min(p.maxHp, p.hp + Math.floor(p.maxHp / 3)); log.push(`${p.species}'s Regenerator restored its HP!`);
	} else if (abil === 'naturalcure' && slot.status) {
		slot.status = null; p.status = null; log.push(`${p.species}'s Natural Cure healed its status!`);
	}
	if (abil === 'zerotohero' && p.species.includes('Palafin')) (p as any).hasSwitchedOut = true;
}

function performSwitch(
	slots: (ActivePokemonSlot | null)[],
	idx: 0 | 1,
	nextP: RPGPokemon | undefined,
	outP: RPGPokemon,
	battle: BattleState,
	isPlayer: boolean,
	log: string[]
): boolean {
	if (!nextP) { log.push(`${outP.species} tried to switch out, but no one was left!`); return false; }
	const newSlot = createActivePokemonSlot(nextP);
	if ((nextP as any).hasSwitchedOut) (newSlot as any).hasSwitchedOut = true;
	slots[idx] = newSlot;
	
	const fainted = applyHazardEffectsOnSwitchIn(newSlot, battle, isPlayer, log);
	if (fainted) log.push(`<b>${newSlot.pokemon.species} fainted upon entry!</b>`);
	else {
		handleMirrorHerb(newSlot, battle, log);
		RPGAbilities.checkFormChangeAbilities(newSlot, battle, log);
	}
	return true;
}

function handleSelfSwitch(slot: ActivePokemonSlot, move: Move, slotIdx: number, targetSlotIdx: number, battle: BattleState, player: PlayerData, log: string[]) {
	if (!move.selfSwitch || slot.pokemon.hp <= 0 || !canSwitch(slot, battle, log)) return;

	// Check if move hit (effectiveness check on target)
	const targetSlot = getSlotFromIndex(battle, targetSlotIdx);
	if (targetSlot) {
		const type = getMoveType(move, slot.pokemon, slot, battle, { attacker: slot.pokemon, defender: targetSlot.pokemon, attackerSlot: slot, defenderSlot: targetSlot, move, battle, messageLog: log });
		if (getCustomEffectiveness(type, getPokemonTypes(targetSlot.pokemon, targetSlot), targetSlot.pokemon, battle, slot.pokemon) === 0) return;
	}

	const isPlayer = slotIdx <= 1;
	const party = isPlayer ? getActiveParty(battle, player) : battle.opponentParty;
	const slots = isPlayer ? battle.playerSlots : battle.opponentSlots;

	if (party.some(p => p.hp > 0 && !slots.some(s => s?.pokemon.id === p.id))) {
		const pivotData = { slotIndex: isPlayer ? slotIdx : slotIdx - 2, slot, isBatonPass: move.selfSwitch === 'copyvolatile' };
		if (isPlayer) { battle.pendingPivot = pivotData; battle.playerSlots[slotIdx as 0 | 1] = null; }
		else { battle.aiPendingPivot = pivotData; battle.opponentSlots[slotIdx - 2 as 0 | 1] = null; }
		log.push(`${slot.pokemon.species} is waiting to switch out!`);
	} else {
		log.push(`But there was no one to switch to!`);
	}
}

export function applyHazardEffectsOnSwitchIn(slot: ActivePokemonSlot, battle: BattleState, isPlayer: boolean, log: string[]): boolean {
	const p = slot.pokemon;
	if (battle.magicRoomTurns === 0 && p.item === 'heavydutyboots') { applySwitchInAbilities(slot, battle, isPlayer, log); return false; }

	const hazards = isPlayer ? battle.playerHazards : battle.opponentHazards;
	if (hazards.length === 0) { applySwitchInAbilities(slot, battle, isPlayer, log); return false; }

	let dmg = 0;
	const grounded = RPGAbilities.isGrounded(p, battle);

	if (grounded) {
		if (hazards.includes('stickyweb')) applyStatChange(slot, 'spe', -1, battle, log, null);
		const tspikes = hazards.filter(h => h === 'toxicspikes').length;
		if (tspikes > 0) {
			if (Dex.species.get(p.species).types.includes('Poison')) {
				log.push(`The Toxic Spikes were absorbed by ${p.species}!`);
				if (isPlayer) battle.playerHazards = battle.playerHazards.filter(h => h !== 'toxicspikes');
				else battle.opponentHazards = battle.opponentHazards.filter(h => h !== 'toxicspikes');
			} else if (!Dex.species.get(p.species).types.includes('Steel') && !slot.status) {
				slot.status = tspikes >= 2 ? 'tox' : 'psn';
				if (slot.status === 'tox') slot.toxicCounter = 1;
				log.push(`${p.species} was ${slot.status === 'tox' ? 'badly ' : ''}poisoned by Toxic Spikes!`);
			}
		}
		const spikes = hazards.filter(h => h === 'spikes').length;
		if (spikes > 0) dmg += Math.floor(p.maxHp * [0, 1/8, 1/6, 1/4][spikes]);
	}

	if (hazards.includes('stealthrock')) {
		if (battle.magicRoomTurns === 0 && p.item === 'airballoon') { log.push(`${p.species}'s Air Balloon popped!`); p.item = undefined; }
		const eff = getCustomEffectiveness('Rock', Dex.species.get(p.species).types, p, battle);
		dmg += Math.floor(p.maxHp * 0.125 * eff);
	}

	if (dmg > 0) {
		if (RPGAbilities.takesIndirectDamage(p)) {
			if (hazards.includes('stealthrock')) log.push(`Pointed stones dug into ${p.species}!`);
			else if (hazards.includes('spikes') && grounded) log.push(`${p.species} was hurt by spikes!`);
			p.hp = Math.max(0, p.hp - dmg);
		} else log.push(`${p.species}'s Magic Guard prevents hazard damage!`);
	}

	applySwitchInAbilities(slot, battle, isPlayer, log);
	return p.hp <= 0;
}

function applySwitchInAbilities(slot: ActivePokemonSlot, battle: BattleState, isPlayer: boolean, log: string[]) {
	RPGAbilities.applySwitchInAbilities(slot, battle, isPlayer, log);
	const oppSlots = isPlayer ? getActiveSlots(battle.opponentSlots) : getActiveSlots(battle.playerSlots);
	const p = slot.pokemon;
	const abil = toID(p.ability || '');

	if (abil === 'frisk') {
		oppSlots.forEach(s => { if (s.pokemon.item) log.push(`${p.species} frisked ${s.pokemon.species} and found ${ITEMS_DATABASE[s.pokemon.item]?.name || s.pokemon.item}!`); });
	}
	if (abil === 'download' && oppSlots.length > 0) {
		let def = 0, spd = 0;
		oppSlots.forEach(s => { def += s.pokemon.def * getStatMultiplier(s.statStages.def); spd += s.pokemon.spd * getStatMultiplier(s.statStages.spd); });
		applyStatChange(slot, def < spd ? 'atk' : 'spa', 1, battle, log, slot);
	}
}

export function resolveMoveTarget(attackerIdx: number, targetIdx: number, move: Move, battle: BattleState, log: string[]): number {
	const isPlayer = attackerIdx <= 1;
	const oppSlots = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots);
	const attacker = isPlayer ? battle.playerSlots[attackerIdx]! : battle.opponentSlots[attackerIdx - 2]!;
	const abil = toID(attacker.pokemon.ability || '');
	const ignore = ['propellertail', 'stalwart'].includes(abil);

	if (move.target === 'normal' && !ignore) {
		const redirect = move.type === 'Water' ? oppSlots.find(s => toID(s.pokemon.ability || '') === 'stormdrain') 
			: move.type === 'Electric' ? oppSlots.find(s => toID(s.pokemon.ability || '') === 'lightningrod') : undefined;
		
		if (redirect) {
			log.push(`${redirect.pokemon.species}'s ${redirect.pokemon.ability} drew in the attack!`);
			return [...battle.playerSlots, ...battle.opponentSlots].indexOf(redirect);
		}
		const followMe = oppSlots.find(s => s.isRedirecting);
		if (followMe) {
			log.push(`${followMe.pokemon.species} took the attack!`);
			return [...battle.playerSlots, ...battle.opponentSlots].indexOf(followMe);
		}
	}
	return targetIdx;
}

// #endregion

// #region Win Conditions & Faints

export function checkBattleEndCondition(context: CommandContext, battle: BattleState, room: ChatRoom, user: User, log: string[]): boolean {
	const player = getPlayerData(user.id);
	handleAiPivot(battle, log);
	
	const pActive = getActiveSlots(battle.playerSlots);
	handleOpponentFaint(battle, player, pActive, room, user, log);
	const playerSwitchNeeded = handlePlayerFaint(battle, log);

	if (checkForWinLoss(context, battle, player, user, log, room)) return true;

	if (battle.pendingPivot) {
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePivotSwitchHTML(battle, log.join('<br>'), battle.pendingPivot.slotIndex)}`);
		return true;
	}

	const hasLiving = getActiveParty(battle, player).some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));
	if (playerSwitchNeeded && hasLiving) {
		// Cleanup actions for empty slots
		battle.playerSlots.forEach((s, i) => { if (!s || s.pokemon.hp === 0) delete battle.pendingActions[i]; });
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateFaintSwitchHTML(battle, log.join('<br>'))}`);
		return true;
	}
	return false;
}

export function handlePlayerFaint(battle: BattleState, log: string[]): boolean {
	let switchNeeded = false;
	const indices = battle.battleType.includes('double') ? [0, 1] : [0];
	
	for (const i of indices) {
		const slot = battle.playerSlots[i];
		if (slot && slot.pokemon.hp <= 0) {
			log.push(`<b>Your ${slot.pokemon.species} fainted!</b>`);
			handleFaintAbilities(slot, battle, true, log);
			battle.playerSlots[i as 0 | 1] = null;
			switchNeeded = true;
		}
	}
	return switchNeeded;
}

export function handleOpponentFaint(battle: BattleState, player: PlayerData, pParticipants: ActivePokemonSlot[], room: ChatRoom, user: User, log: string[]): boolean {
	const indices = battle.battleType.includes('double') ? [0, 1] : [0];
	let fainted = false;

	for (const i of indices) {
		const slot = battle.opponentSlots[i];
		if (slot && slot.pokemon.hp <= 0) {
			fainted = true;
			log.push(`<b>The opposing ${slot.pokemon.species} fainted!</b>`);
			handleFaintAbilities(slot, battle, false, log);
			
			pParticipants.forEach(p => { if (p.pokemon.hp > 0) RPGAbilities.applyOnKOAbilities(p, battle, log); });
			if (battle.battleType !== 'battletower' && pParticipants.length > 0) {
				log.push(...gainExperience(player, pParticipants, slot.pokemon, room, user).messages);
			}

			// Auto-switch opponent
			const next = battle.opponentParty.find(p => p.hp > 0 && !battle.opponentSlots.some(s => s?.pokemon.id === p.id));
			if (next) {
				log.push(`<b>${battle.opponentName} is about to send in ${next.species}!</b>`);
				battle.opponentSlots[i as 0 | 1] = createActivePokemonSlot(next);
				const faintedOnEntry = applyHazardEffectsOnSwitchIn(battle.opponentSlots[i as 0 | 1]!, battle, false, log);
				if (faintedOnEntry) log.push(`<b>${next.species} fainted upon entry!</b>`);
				else {
					handleMirrorHerb(battle.opponentSlots[i as 0 | 1]!, battle, log);
					RPGAbilities.checkFormChangeAbilities(battle.opponentSlots[i as 0 | 1]!, battle, log);
				}
			} else {
				battle.opponentSlots[i as 0 | 1] = null;
			}
		}
	}
	return fainted;
}

function handleFaintAbilities(faintedSlot: ActivePokemonSlot, battle: BattleState, isPlayerFaint: boolean, log: string[]) {
	// Aftermath
	if (toID(faintedSlot.pokemon.ability || '') === 'aftermath' && faintedSlot.lastMoveThatHitMe?.flags.contact) {
		const killerId = faintedSlot.lastDamageTaken?.from;
		const killerSlot = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).find(s => s.pokemon.id === killerId);
		if (killerSlot && killerSlot.pokemon.hp > 0 && RPGAbilities.takesIndirectDamage(killerSlot.pokemon)) {
			killerSlot.pokemon.hp = Math.max(0, killerSlot.pokemon.hp - Math.floor(killerSlot.pokemon.maxHp / 4));
			log.push(`${killerSlot.pokemon.species} was hurt by Aftermath!`);
		}
	}
	// Soul-Heart
	getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(s => {
		if (s.pokemon.hp > 0 && toID(s.pokemon.ability || '') === 'soulheart' && s.statStages.spa < 6) {
			s.statStages.spa++; log.push(`${s.pokemon.species}'s Soul-Heart raised its Sp. Atk!`);
		}
	});
}

export function handleAiPivot(battle: BattleState, log: string[]) {
	if (!battle.aiPendingPivot) return;
	const { slotIndex, slot, isBatonPass } = battle.aiPendingPivot;
	log.push(`<b>${battle.opponentName} withdrew ${slot.pokemon.species}!</b>`);
	
	const next = battle.opponentParty.find(p => p.hp > 0 && p.id !== slot.pokemon.id && !battle.opponentSlots.some(s => s?.pokemon.id === p.id));
	if (next) {
		log.push(`<b>${battle.opponentName} sent out ${next.species}!</b>`);
		const newSlot = createActivePokemonSlot(next);
		if (isBatonPass) {
			newSlot.statStages = { ...slot.statStages }; newSlot.isConfused = slot.isConfused; newSlot.isSeeded = slot.isSeeded;
			log.push(`${next.species} received the Baton Pass!`);
		}
		battle.opponentSlots[slotIndex as 0 | 1] = newSlot;
		if (applyHazardEffectsOnSwitchIn(newSlot, battle, false, log)) log.push(`<b>${next.species} fainted upon entry!</b>`);
		else handleMirrorHerb(newSlot, battle, log);
	} else {
		battle.opponentSlots[slotIndex as 0 | 1] = slot;
		log.push(`${slot.pokemon.species} had no one to switch to!`);
	}
	battle.aiPendingPivot = undefined;
}

export function checkForWinLoss(context: CommandContext, battle: BattleState, player: PlayerData, user: User, log: string[], room: ChatRoom): boolean {
	const pAlive = getActiveParty(battle, player).some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));
	const pActive = getActiveSlots(battle.playerSlots).length > 0;
	
	// Player Lost
	if (!pActive && !pAlive) {
		saveBattleStatus(battle);
		battle.battleEnded = true; battle.battleResult = 'defeat';
		
		if (battle.battleType === 'battletower') {
			player.battleTowerFloor = 1;
			context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleTowerLossHTML(battle.floor || 1)}`);
		} else {
			const lost = Math.min(player.money, battle.battleType.includes('trainer') ? (Math.floor(battle.opponentMoney / 10) || 200) : 100);
			player.money -= lost;
			player.party.forEach(p => { p.hp = p.maxHp; p.status = null; p.moves.forEach(m => m.pp = getMove(m.id).pp || 5); });
			player.location = LOCATIONS[player.lastPokemonCenter || GameConfig.startLocationId]?.name || 'Unknown';
			
			log.push(`<hr><center><b>Defeat!</b></center><center><b>You lost ₽${lost}!</b></center>`);
			context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, log, undefined, teraToggleState.get(user.id))}`);
		}
		
		activeBattles.delete(user.id); teraToggleState.delete(user.id); activeScriptedEvents.delete(user.id);
		return true;
	}

	const oAlive = battle.opponentParty.some(p => p.hp > 0 && !battle.opponentSlots.some(s => s?.pokemon.id === p.id));
	const oActive = getActiveSlots(battle.opponentSlots).length > 0;

	// Player Won
	if (!oActive && !oAlive) {
		saveBattleStatus(battle);
		battle.battleEnded = true; battle.battleResult = 'victory';

		if (battle.battleType === 'battletower') {
			const fl = battle.floor || 1;
			player.battleTowerFloor = fl + 1;
			if (fl > player.battleTowerHighestFloor) player.battleTowerHighestFloor = fl;
			context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleTowerFloorCompleteHTML(fl)}`);
		} else {
			let money = 0;
			if (battle.battleType.includes('trainer')) {
				money = battle.opponentMoney;
				if (battle.trainerId) {
					player.defeatedTrainers.add(battle.trainerId);
					const badge = getBadgeForGymLeader(battle.trainerId);
					if (badge && !player.obtainedBadges.includes(badge)) {
						player.obtainedBadges.push(badge); player.badges = player.obtainedBadges.length;
						log.push(`<hr><center><strong>You obtained the ${badge}!</strong></center>`);
						if (player.obtainedBadges.length === TOTAL_BADGES) { player.storyFlags.add('all_badges'); log.push(`<hr><center><strong>You now have all ${TOTAL_BADGES} badges!</strong></center>`); }
					}
					if (battle.trainerId === GameConfig.specialIds.champion) {
						player.storyFlags.add('champion'); player.storyFlags.add('game_complete');
						log.push(`<hr><center><strong>🏆 Congratulations! You are the new Champion! 🏆</strong></center>`);
					}
				}
				log.push(`<hr><center><b>Victory!</b></center><center><strong>You defeated ${battle.opponentName}!</strong></center>`);
			} else {
				money = Math.floor(battle.opponentParty.reduce((s, p) => s + p.level, 0) * 5);
				log.push(`<hr><center><b>Victory!</b></center>`);
			}
			
			player.money += money;
			log.push(`<center><b>You received ₽${money}!</b></center>`);

			if (player.pendingMoveLearnQueue?.length) context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player, log)}`);
			else context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, log, undefined, teraToggleState.get(user.id), activeScriptedEvents.get(user.id))}`);
		}
		activeBattles.delete(user.id);
		return true;
	}

	return false;
}
