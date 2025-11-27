import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import {
	generateRandomTeam,
	getMove,
	type CheckEvolutionContext,
	getActiveSlots,
	getActiveParty,
	activateUnburden,
	applyStatChange,
	handleHPDropEffects,
	createActivePokemonSlot,
	checkTrappingAbility,
	getSlotFromIndex,
	getMoveTargets,
	getAccuracyEvasionMultiplier,
	handleMirrorHerb,
	handleLeppaBerry,
} from './utils';
import type { RPGPokemon, ActivePokemonSlot, PlayerData, BattleState, Move } from './interface';
import { ITEMS_DATABASE } from './items';
import { LOCATIONS } from './game-locations';
import {
	startBattleTowerFloor,
	getLocationWeatherData,
	getWeatherStartMessage,
	generateBattleTowerFloorCompleteHTML,
	generateBattleTowerLossHTML,
} from './battle-tower';
import { getPlayerData, activeBattles } from './core';
import { teraToggleState, activeScriptedEvents, getStatMultiplier, getCustomEffectiveness, getPokemonTypes, applyHazardEffectsOnSwitchIn } from './battle-state';
import {
	generateMoveLearnHTML,
} from './html';
import { BattleUI } from './battle-ui';
import { RPGMoves } from './battle-moves';
import { getBadgeForGymLeader, TOTAL_BADGES, TRAINER_DATABASE } from './game-npcs';
import { GameConfig } from './game-config';

import {
	gainExperience,
	handleDamagingMove,
	handleStatusMove,
	saveBattleStatus,
	getMoveType,
	checkAccuracy,
	checkSubstituteBypass,
} from './battle-core';

import { processEndOfTurn } from './battle-eot';

export function processTurn(context: CommandContext, battle: BattleState, room: ChatRoom, user: User, initialMessages: string[] = []) {
	const messageLog: string[] = [...initialMessages];
	battle.turn++;

	battle.playerSide.quickGuard = false;
	battle.opponentSide.quickGuard = false;
	battle.playerSide.wideGuard = false;
	battle.opponentSide.wideGuard = false;
	battle.playerSide.craftyShield = false;
	battle.opponentSide.craftyShield = false;

	getActiveSlots([...battle.playerSide.slots, ...battle.opponentSide.slots]).forEach(s => {
		s.isHelped = false;
		s.isRedirecting = false;
		s.lastDamageTaken = undefined;
	});

	getActiveSlots(battle.opponentSide.slots).forEach((slot, i) => {
		const slotIndex = 2 + i;
		if (!battle.pendingActions[slotIndex]) {
			battle.pendingActions[slotIndex] = generateAiAction(slot, slotIndex, battle);
		}
	});

	const actionQueue = buildActionQueue(battle);

	while (actionQueue.length > 0) {
		actionQueue.sort((a, b) => compareActions(a, b, battle, messageLog));

		const action = actionQueue.shift();
		if (!action) break;

		executeAction(action, battle, room, user, messageLog);

		const battleEndedMidTurn = checkBattleEndCondition(context, battle, room, user, messageLog);
		if (battleEndedMidTurn) {
			messageLog.push(`<hr><div style="text-align: center;"><strong>Turn ${battle.turn}</strong></div><hr>`);
			battle.battleLog.push(...messageLog);
			return;
		}

		if (battle.forceEnd) {
			messageLog.push(`<hr><div style="text-align: center;"><strong>Turn ${battle.turn}</strong></div><hr>`);
			battle.battleLog.push(...messageLog);
			return;
		}
	}

	messageLog.push("--- End of Turn ---");
	processEndOfTurn(battle, messageLog);

	const battleEnded = checkBattleEndCondition(context, battle, room, user, messageLog);

	messageLog.push(`<hr><div style="text-align: center;"><strong>Turn ${battle.turn}</strong></div><hr>`);

	battle.battleLog.push(...messageLog);

	battle.pendingActions = {};

	if (!battleEnded) {
		getActiveSlots([...battle.playerSide.slots, ...battle.opponentSide.slots]).forEach(slot => {
			if (slot.pokemon.hp > 0) {
				slot.activeTurns++;
			}
		});

		let hasActivePlayerSlot: boolean;
		let hasActiveOpponentSlot: boolean;

		if (battle.battleType.includes('double')) {
			hasActivePlayerSlot = battle.playerSide.slots.some(s => s !== null && s.pokemon.hp > 0);
			hasActiveOpponentSlot = battle.opponentSide.slots.some(s => s !== null && s.pokemon.hp > 0);
		} else {
			hasActivePlayerSlot = battle.playerSide.slots[0] !== null && battle.playerSide.slots[0]?.pokemon.hp > 0;
			hasActiveOpponentSlot = battle.opponentSide.slots[0] !== null && battle.opponentSide.slots[0]?.pokemon.hp > 0;
		}

		if (hasActivePlayerSlot && hasActiveOpponentSlot) {
			context.sendReply(`|uhtmlchange|rpg-${user.id}|${BattleUI.generateBattleHTML(battle, [], undefined, teraToggleState.get(user.id))}`);
		}
	}
}

/**
 * Builds the initial action queue from pending actions.
 * Note: Sorting now happens dynamically in processTurn.
 */
export function buildActionQueue(battle: BattleState): NonNullable<BattleState['pendingActions'][number]>[] {
	const actionQueue: NonNullable<BattleState['pendingActions'][number]>[] = [];
	const allActiveSlots = getActiveSlots([...battle.playerSide.slots, ...battle.opponentSide.slots]);

	allActiveSlots.forEach(s => { s.analyticBoost = false; });

	for (const slotIndex in battle.pendingActions) {
		const action = battle.pendingActions[slotIndex];
		if (action && allActiveSlots.some(s => s.pokemon.id === action.pokemonId)) {
			actionQueue.push(action);
		}
	}

	actionQueue.sort((a, b) => compareActions(a, b, battle, []));

	if (actionQueue.length > 0) {
		let lastMoveAction: NonNullable<BattleState['pendingActions'][number]> | null = null;
		for (let i = actionQueue.length - 1; i >= 0; i--) {
			if (actionQueue[i].actionType === 'move') {
				lastMoveAction = actionQueue[i];
				break;
			}
		}

		if (lastMoveAction) {
			const lastMoverSlot = allActiveSlots.find(s => s.pokemon.id === lastMoveAction.pokemonId);
			if (lastMoverSlot && toID(lastMoverSlot.pokemon.ability || '') === 'analytic') {
				lastMoverSlot.analyticBoost = true;
			}
		}
	}

	return actionQueue;
}

/**
 * Comparator function for sorting actions based on Speed, Priority, and Items.
 * Returns: negative if A comes before B, positive if B comes before A.
 */
function compareActions(
	a: NonNullable<BattleState['pendingActions'][number]>,
	b: NonNullable<BattleState['pendingActions'][number]>,
	battle: BattleState,
	messageLog: string[]
): number {
	const allActiveSlots = [...battle.playerSide.slots, ...battle.opponentSide.slots];
	const slotA = allActiveSlots.find(s => s && s.pokemon.id === a.pokemonId)!;
	const slotB = allActiveSlots.find(s => s && s.pokemon.id === b.pokemonId)!;

	if (!slotA) return 1;
	if (!slotB) return -1;

	const isSwitchA = a.actionType === 'switch';
	const isSwitchB = b.actionType === 'switch';
	const moveA = getMove(a.moveId || 'struggle');
	const moveB = getMove(b.moveId || 'struggle');

	let priorityA = isSwitchA ? 6 : (moveA.priority || 0);
	let priorityB = isSwitchB ? 6 : (moveB.priority || 0);

	if (!isSwitchA) priorityA += RPGAbilities.applyPriorityModifier(moveA, slotA.pokemon);
	if (!isSwitchB) priorityB += RPGAbilities.applyPriorityModifier(moveB, slotB.pokemon);

	if (priorityA !== priorityB) {
		return priorityB - priorityA;
	}

	let speedA = slotA.pokemon.spe * getStatMultiplier(slotA.statStages.spe);
	const abilityA = toID(slotA.pokemon.ability || '');
	if (battle.magicRoomTurns === 0) {
		if (slotA.pokemon.item === 'choicescarf') speedA = Math.floor(speedA * 1.5);
		if (slotA.pokemon.item === 'ironball') speedA = Math.floor(speedA * 0.5);
		if (slotA.pokemon.item === 'quickpowder' && slotA.pokemon.species === 'Ditto') speedA = Math.floor(speedA * 2);
	}
	speedA = RPGAbilities.applyAbilitySpeedModifier(slotA.pokemon, battle, speedA);

	const isPlayerA = battle.playerSide.slots.includes(slotA);
	if (isPlayerA && battle.playerSide.tailwindTurns > 0) speedA *= 2;
	if (!isPlayerA && battle.opponentSide.tailwindTurns > 0) speedA *= 2;

	if (slotA.status === 'par' && abilityA !== 'quickfeet') speedA = Math.floor(speedA / 2);
	if (slotA.pokemon.item === 'machobrace' || slotA.pokemon.item?.includes('power')) speedA = Math.floor(speedA / 2);

	let speedB = slotB.pokemon.spe * getStatMultiplier(slotB.statStages.spe);
	const abilityB = toID(slotB.pokemon.ability || '');
	if (battle.magicRoomTurns === 0) {
		if (slotB.pokemon.item === 'choicescarf') speedB = Math.floor(speedB * 1.5);
		if (slotB.pokemon.item === 'ironball') speedB = Math.floor(speedB * 0.5);
		if (slotB.pokemon.item === 'quickpowder' && slotB.pokemon.species === 'Ditto') speedB = Math.floor(speedB * 2);
	}
	speedB = RPGAbilities.applyAbilitySpeedModifier(slotB.pokemon, battle, speedB);

	const isPlayerB = battle.playerSide.slots.includes(slotB);
	if (isPlayerB && battle.playerSide.tailwindTurns > 0) speedB *= 2;
	if (!isPlayerB && battle.opponentSide.tailwindTurns > 0) speedB *= 2;

	if (slotB.status === 'par' && abilityB !== 'quickfeet') speedB = Math.floor(speedB / 2);
	if (slotB.pokemon.item === 'machobrace' || slotB.pokemon.item?.includes('power')) speedB = Math.floor(speedB / 2);


	const quickClawA = !isSwitchA && battle.magicRoomTurns === 0 && slotA.pokemon.item === 'quickclaw' && Math.random() < 0.2;
	const quickClawB = !isSwitchB && battle.magicRoomTurns === 0 && slotB.pokemon.item === 'quickclaw' && Math.random() < 0.2;

	const isSlowA = abilityA === 'stall' || (battle.magicRoomTurns === 0 && (slotA.pokemon.item === 'laggingtail' || slotA.pokemon.item === 'fullincense'));
	const isSlowB = abilityB === 'stall' || (battle.magicRoomTurns === 0 && (slotB.pokemon.item === 'laggingtail' || slotB.pokemon.item === 'fullincense'));

	if (quickClawA && !quickClawB) {
		return -1;
	}
	if (quickClawB && !quickClawA) {
		return 1;
	}

	if (isSlowA && !isSlowB) return 1;
	if (isSlowB && !isSlowA) return -1;

	if (battle.trickRoomTurns > 0) {
		return speedA - speedB;
	}

	if (speedA === speedB) {
		return Math.random() > 0.5 ? 1 : -1;
	}

	return speedB - speedA;
}

export function generateAiAction(aiSlot: ActivePokemonSlot, aiSlotIndex: number, battle: BattleState): BattleState['pendingActions'][number] {
	let chosenMoveId = 'struggle';

	if (aiSlot.chargingMove) {
		const chargingMoveObj = aiSlot.pokemon.moves.find(m => m.id === aiSlot.chargingMove);
		if (chargingMoveObj && chargingMoveObj.pp > 0) {
			chosenMoveId = aiSlot.chargingMove;
		}
	} else if (aiSlot.lockedMoveCounter && aiSlot.lockedMoveCounter > 0 && aiSlot.lockedMove) {
		const lockedMoveObj = aiSlot.pokemon.moves.find(m => m.id === aiSlot.lockedMove);
		if (lockedMoveObj && lockedMoveObj.pp > 0) {
			chosenMoveId = aiSlot.lockedMove;
		}
	} else if (aiSlot.uproarTurns && aiSlot.uproarTurns > 0 && aiSlot.lockedMove) {
		const lockedMoveObj = aiSlot.pokemon.moves.find(m => m.id === aiSlot.lockedMove);
		if (lockedMoveObj && lockedMoveObj.pp > 0) {
			chosenMoveId = aiSlot.lockedMove;
		}
	} else if (aiSlot.encoreMove?.moveId) {
		const encoredMoveObj = aiSlot.pokemon.moves.find(m => m.id === aiSlot.encoreMove!.moveId);
		if (encoredMoveObj && encoredMoveObj.pp > 0) {
			chosenMoveId = aiSlot.encoreMove.moveId;
		}
	} else if (aiSlot.lockedMove && battle.magicRoomTurns === 0) {
		const choiceItems = ['choiceband', 'choicescarf', 'choicespecs'];
		if (choiceItems.includes(aiSlot.pokemon.item || '')) {
			const lockedMoveObj = aiSlot.pokemon.moves.find(m => m.id === aiSlot.lockedMove);
			if (lockedMoveObj && lockedMoveObj.pp > 0) {
				chosenMoveId = aiSlot.lockedMove;
			}
		}
	}

	if (chosenMoveId === 'struggle' && !aiSlot.chargingMove && !aiSlot.lockedMoveCounter && !aiSlot.uproarTurns && !aiSlot.encoreMove) {
		let usableMoves = aiSlot.pokemon.moves.filter(m => {
			const moveData = getMove(m.id);
			if (aiSlot.disabledMove && aiSlot.disabledMove.moveId === m.id) return false;
			if (aiSlot.tormentActive && aiSlot.lastMoveUsed === m.id) return false;
			if (aiSlot.tauntTurns > 0 && moveData.category === 'Status') return false;
			return m.pp > 0 && moveData.category !== 'Status';
		});

		if (usableMoves.length === 0) {
			usableMoves = aiSlot.pokemon.moves.filter(m => {
				if (aiSlot.disabledMove && aiSlot.disabledMove.moveId === m.id) return false;
				if (aiSlot.tormentActive && aiSlot.lastMoveUsed === m.id) return false;
				const moveData = getMove(m.id);
				if (aiSlot.tauntTurns > 0 && moveData.category === 'Status') return false;
				return m.pp > 0;
			});
		}

		if (usableMoves.length > 0) {
			chosenMoveId = usableMoves[Math.floor(Math.random() * usableMoves.length)].id;
		}
	}

	const playerSlots = getActiveSlots(battle.playerSide.slots);
	let targetSlotIndex = 0;
	if (playerSlots.length > 0) {
		const targetSlot = playerSlots[Math.floor(Math.random() * playerSlots.length)];
		targetSlotIndex = battle.playerSide.slots.indexOf(targetSlot);
	}

	return {
		actionType: 'move',
		moveId: chosenMoveId,
		targetSlot: targetSlotIndex,
		pokemonId: aiSlot.pokemon.id,
	};
}

export function validateMoveAction(
	attackerSlot: ActivePokemonSlot,
	moveId: string,
	battle: BattleState
): string | null {
	const pokemon = attackerSlot.pokemon;
	const moveData = getMove(moveId);

	if (moveId === 'struggle') return null;

	if (attackerSlot.tauntTurns > 0 && moveData.category === 'Status') return `${pokemon.species} is taunted! It can't use ${moveData.name}!`;
	if (battle.magicRoomTurns === 0 && pokemon.item === 'assaultvest' && moveData.category === 'Status') return `Your Assault Vest prevents you from using ${moveData.name}!`;

	const moveObject = pokemon.moves.find(m => m.id === moveData.id);
	if (moveObject && moveObject.pp === 0) return `There is no PP left for ${moveData.name}!`;

	if (attackerSlot.chargingMove) {
		if (attackerSlot.chargingMove !== moveData.id) {
			return `${pokemon.species} must continue using ${getMove(attackerSlot.chargingMove).name}!`;
		}
		if (attackerSlot.disabledMove && attackerSlot.disabledMove.moveId === moveData.id) return `${moveData.name} is disabled!`;
		return null;
	}

	if (attackerSlot.disabledMove && attackerSlot.disabledMove.moveId === moveData.id) return `${moveData.name} is disabled!`;

	if (attackerSlot.encoreMove && attackerSlot.encoreMove.moveId !== moveData.id) {
		const encoredMoveObj = pokemon.moves.find(m => m.id === attackerSlot.encoreMove!.moveId);
		if (encoredMoveObj && encoredMoveObj.pp > 0) return `${pokemon.species} must use ${attackerSlot.encoreMove.moveId}!`;
	}

	if (attackerSlot.tormentActive && attackerSlot.lastMoveUsed === moveData.id) return `${pokemon.species} can't use the same move twice due to Torment!`;

	if (attackerSlot.lockedMoveCounter > 0) {
		if (attackerSlot.lockedMove !== moveData.id) {
			return `${pokemon.species} must continue using ${getMove(attackerSlot.lockedMove!).name}!`;
		}
	}

	if (attackerSlot.uproarTurns > 0) {
		if (attackerSlot.lockedMove !== moveData.id) return `${pokemon.species} must continue its uproar!`;
	}

	if (attackerSlot.healBlockTurns > 0 && moveData.flags.heal) return `${pokemon.species} is prevented from healing by Heal Block!`;

	const hasChoiceItemLock = attackerSlot.lockedMove && attackerSlot.lockedMove !== moveData.id && battle.magicRoomTurns === 0 && attackerSlot.lockedMoveCounter === 0 && attackerSlot.uproarTurns === 0;
	if (hasChoiceItemLock) {
		const lockedMoveObject = pokemon.moves.find(m => m.id === attackerSlot.lockedMove);
		if (lockedMoveObject && lockedMoveObject.pp > 0) return `${pokemon.species} is locked into ${lockedMoveObject.id}!`;
	}

	return null;
}

export function handlePreTurnChecks(attackerSlot: ActivePokemonSlot, battle: BattleState, messageLog: string[], move?: Move): boolean {
	const attacker = attackerSlot.pokemon;

	if (toID(attacker.ability || '') === 'truant') {
		if (attackerSlot.isLoafing) {
			messageLog.push(`${attacker.species} is loafing around!`);
			attackerSlot.isLoafing = false;
			return false;
		}
	}

	if (attackerSlot.mustRecharge) {
		messageLog.push(`${attacker.species} must recharge!`);
		attackerSlot.mustRecharge = false;
		return false;
	}

	if (attackerSlot.willFlinch) {
		messageLog.push(`${attacker.species} flinched and couldn't move!`);
		attackerSlot.willFlinch = false;
		if (toID(attacker.ability || '') === 'steadfast' && attackerSlot.statStages.spe < 6) {
			attackerSlot.statStages.spe++;
			messageLog.push(`${attacker.species}'s Steadfast raised its Speed!`);
		}
		return false;
	}

	if (attackerSlot.status === 'frz') {
		if (Math.random() < 0.20) {
			attackerSlot.status = null;
			messageLog.push(`${attacker.species} thawed out!`);
		} else {
			messageLog.push(`${attacker.species} is frozen solid!`);
			return false;
		}
	}

	if (attackerSlot.status === 'slp') {
		if (move?.sleepUsable) return true;
		const decrementAmount = toID(attacker.ability || '') === 'earlybird' ? 2 : 1;
		attackerSlot.sleepCounter -= decrementAmount;
		if (attackerSlot.sleepCounter > 0) {
			messageLog.push(`${attacker.species} is fast asleep.`);
			return false;
		} else {
			attackerSlot.status = null;
			messageLog.push(`${attacker.species} woke up!`);
		}
	}

	if (attackerSlot.isConfused) {
		messageLog.push(`${attacker.species} is confused!`);
		attackerSlot.confusionCounter--;
		if (attackerSlot.confusionCounter <= 0) {
			attackerSlot.isConfused = false;
			messageLog.push(`${attacker.species} snapped out of its confusion!`);
		} else if (Math.random() < 1 / 3) {
			if (toID(attacker.ability || '') === 'tangledfeet') {
				messageLog.push(`${attacker.species}'s Tangled Feet prevents it from hurting itself!`);
				return false;
			}
			messageLog.push(`It hurt itself in its confusion!`);
			const selfDamage = Math.floor((((2 * attacker.level / 5 + 2) * 40 * (attacker.atk / attacker.def)) / 50) + 2);
			attacker.hp = Math.max(0, attacker.hp - selfDamage);
			messageLog.push(`${attacker.species} took ${selfDamage} damage!`);
			return false;
		}
	}

	if (attackerSlot.isAttracted) {
		if (Math.random() < 0.5) {
			messageLog.push(`${attacker.species} is immobilized by love!`);
			return false;
		}
	}

	if (attackerSlot.status === 'par') {
		if (toID(attacker.ability || '') !== 'quickfeet' && Math.random() < 0.25) {
			messageLog.push(`${attacker.species} is fully paralyzed!`);
			return false;
		}
	}

	if (move && attackerSlot.disabledMove && attackerSlot.disabledMove.moveId === move.id) {
		messageLog.push(`${attacker.species}'s ${move.name} is disabled!`);
		return false;
	}

	return true;
}

export function executeAction(
	action: NonNullable<BattleState['pendingActions'][number]>,
	battle: BattleState,
	room: ChatRoom,
	user: User,
	messageLog: string[]
) {
	const player = getPlayerData(battle.playerId);
	const allSlots = [...battle.playerSide.slots, ...battle.opponentSide.slots];
	const attackerSlotIndex = allSlots.findIndex(s => s?.pokemon.id === action.pokemonId);
	const attackerSlot = allSlots[attackerSlotIndex];

	if (!attackerSlot || attackerSlot.pokemon.hp <= 0) return;

	attackerSlot.isRedirecting = false;

	if (action.actionType === 'switch') {
		handleSwitchAction(attackerSlot, attackerSlotIndex, action as any, battle, player, messageLog);
		return;
	}

	if (action.actionType === 'move' && action.moveId && action.targetSlot !== undefined) {
		const isPlayerPokemon = attackerSlotIndex < battle.playerSide.slots.length;
		if (action.terastallize && isPlayerPokemon) {
			if (battle.playerSide.terastallizeUsed) {
				messageLog.push(`<span style="color: #FF1493;">${attackerSlot.pokemon.species} couldn't Terastallize because another Pokemon already did!</span>`);
			} else if (attackerSlot.terastallized) {
				messageLog.push(`<span style="color: #FF1493;">${attackerSlot.pokemon.species} has already Terastallized!</span>`);
			} else {
				attackerSlot.terastallized = attackerSlot.pokemon.teraType;
				battle.playerSide.terastallizeUsed = true;
				messageLog.push(`<span style="color: #FF1493; font-weight: bold;">✨ ${attackerSlot.pokemon.species} Terastallized into ${attackerSlot.pokemon.teraType} type! ✨</span>`);
				if (toID(attackerSlot.pokemon.ability || '') === 'slowstart' && attackerSlot.slowStartTurns && attackerSlot.slowStartTurns > 0) {
					attackerSlot.slowStartTurns = 0;
					messageLog.push(`${attackerSlot.pokemon.species} got its act together due to Terastallization!`);
				}
			}
		}

		const move = getMove(action.moveId);
		let moveObject = attackerSlot.pokemon.moves.find(m => m.id === move.id);

		if (move.id === 'struggle' || !moveObject || moveObject.pp === 0) {
			moveObject = { id: 'struggle', pp: 1 };
			if (move.id !== 'struggle') messageLog.push(`${attackerSlot.pokemon.species} has no PP left for ${move.name}!`);
		}

		if (!handlePreTurnChecks(attackerSlot, battle, messageLog, move)) return;

		const finalTargetIndex = resolveMoveTarget(attackerSlotIndex, action.targetSlot, move, battle, messageLog);
		const resolvedTargets = getMoveTargets(attackerSlotIndex, finalTargetIndex, move, battle);

		let ppDeduction = 1;
		if (resolvedTargets.some(target => toID(target.pokemon.ability || '') === 'pressure')) ppDeduction = 2;

		if (RPGMoves.handleChargingMove(attackerSlot, move, moveObject, battle, messageLog, ppDeduction)) return;

		if (moveObject.id !== 'struggle' && moveObject.pp > 0 && !move.flags.charge) {
			moveObject.pp = Math.max(0, moveObject.pp - ppDeduction);
			handleLeppaBerry(attackerSlot, battle, messageLog);
		}

		if (resolvedTargets.length === 0) {
			const selfTargetingMove = move.target === 'self' || move.target === 'allySide' || move.target === 'all';
			if (selfTargetingMove) {
				messageLog.push(`<span style="color: #555;"><strong>${attackerSlot.pokemon.species}</strong> used <strong>${move.name}</strong>!</span>`);
				messageLog.push(`But there was no target!`);
			}
			return;
		}

		messageLog.push(`<span style="color: #555;"><strong>${attackerSlot.pokemon.species}</strong> used <strong>${move.name}</strong>!</span>`);

		const remainingTargets: ActivePokemonSlot[] = [];
		for (const defenderSlot of resolvedTargets) {
			const abilityContext = {
				attacker: attackerSlot.pokemon,
				defender: defenderSlot.pokemon,
				attackerSlot,
				defenderSlot,
				move,
				battle,
				messageLog,
			};
			const preventionCheck = RPGAbilities.preventMove(abilityContext);
			if (preventionCheck?.prevented) {
				messageLog.push(preventionCheck.message || `${defenderSlot.pokemon.species}'s ability prevented the move!`);
			} else {
				remainingTargets.push(defenderSlot);
			}
		}
		if (resolvedTargets.length > 0 && remainingTargets.length === 0) return;

		executeMove(attackerSlot, remainingTargets, move, moveObject, battle, messageLog);

		if (attackerSlot.pokemon.hp > 0 && move.id !== 'struggle' && !attackerSlot.lockedMove) {
			const item = attackerSlot.pokemon.item;
			if (battle.magicRoomTurns === 0 && (item === 'choiceband' || item === 'choicescarf' || item === 'choicespecs')) {
				attackerSlot.lockedMove = move.id;
			}
		}

		if (move.selfSwitch && attackerSlot.pokemon.hp > 0) {
			if (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'shedshell') {
				if (attackerSlot.isIngrained) {
					messageLog.push(`${attackerSlot.pokemon.species} is rooted in place and can't switch out!`);
					return;
				}
			} else {
				const trappingPokemon = checkTrappingAbility(attackerSlot, battle);
				if (trappingPokemon) {
					messageLog.push(`${attackerSlot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`);
					return;
				}
				if (attackerSlot.isTrapped || attackerSlot.partiallyTrapped) {
					messageLog.push(`${attackerSlot.pokemon.species} is trapped and can't switch out!`);
					return;
				}
				if (attackerSlot.isIngrained) {
					messageLog.push(`${attackerSlot.pokemon.species} is rooted in place and can't switch out!`);
					return;
				}
			}

			const primaryTargetSlot = getSlotFromIndex(battle, action.targetSlot);
			if (primaryTargetSlot) {
				const defenderTypes = getPokemonTypes(primaryTargetSlot.pokemon, primaryTargetSlot);
				const moveType = getMoveType(move, attackerSlot.pokemon, attackerSlot, battle, { attacker: attackerSlot.pokemon, defender: primaryTargetSlot.pokemon, attackerSlot, defenderSlot: primaryTargetSlot, move, battle, messageLog });
				const effectiveness = getCustomEffectiveness(moveType, defenderTypes, primaryTargetSlot.pokemon, battle, attackerSlot.pokemon);
				if (effectiveness === 0) return;
			}

			const isPlayer = attackerSlotIndex <= 1;
			const partyToUse = isPlayer ? getActiveParty(battle, player) : battle.opponentParty;
			const slots = isPlayer ? battle.playerSide.slots : battle.opponentSide.slots;

			const hasReplacement = partyToUse.some(p => p.hp > 0 && !slots.some(s => s?.pokemon.id === p.id));

			if (hasReplacement) {
				if (isPlayer) {
					battle.pendingPivot = { slotIndex: attackerSlotIndex, slot: attackerSlot, isBatonPass: move.selfSwitch === 'copyvolatile' };
					battle.playerSide.slots[attackerSlotIndex as 0 | 1] = null;
				} else {
					const opponentSlotIndex = attackerSlotIndex - 2;
					battle.aiPendingPivot = { slotIndex: opponentSlotIndex, slot: attackerSlot, isBatonPass: move.selfSwitch === 'copyvolatile' };
					battle.opponentSide.slots[opponentSlotIndex as 0 | 1] = null;
				}
				messageLog.push(`${attackerSlot.pokemon.species} is waiting to switch out!`);
			} else {
				messageLog.push(`But there was no one to switch to!`);
			}
		}
	}
}

export function executeMove(
	attackerSlot: ActivePokemonSlot,
	targetSlots: ActivePokemonSlot[],
	move: Move,
	moveObject: { id: string, pp: number },
	battle: BattleState,
	messageLog: string[],
	isReflected = false
): void {
	attackerSlot.lastMoveUsed = move.id;
	if (!['protect', 'detect'].includes(move.id)) attackerSlot.protectSuccessCounter = 0;

	const isSpread = ['allAdjacentFoes', 'allAdjacent', 'scripted'].includes(move.target);
	const validTargetCount = targetSlots.filter(s => s.pokemon.hp > 0).length;
	const spreadMultiplier = (isSpread && validTargetCount > 1) ? 0.75 : 1.0;
	let moveHitAnyTarget = false;

	const isFieldEffectMove = move.category === 'Status' && (
		move.weather || move.terrain || move.pseudoWeather ||
		['trickroom', 'magicroom', 'wonderroom', 'gravity', 'mudsport', 'watersport', 'haze', 'perishsong', 'courtchange'].includes(move.id)
	);

	if (isFieldEffectMove) {
		handleStatusMove(attackerSlot, null, move, battle, messageLog);
		return;
	}

	for (const defenderSlot of targetSlots) {
		if (attackerSlot.pokemon.hp <= 0) break;
		if (defenderSlot.pokemon.hp <= 0) continue;

		if (!isReflected && move.flags.reflectable && !move.flags.futuremove) {
			const defenderAbility = RPGAbilities.getActiveAbility(defenderSlot.pokemon, attackerSlot.pokemon);
			const attackerAbility = toID(attackerSlot.pokemon.ability || '');
			const hasMoldBreaker = ['moldbreaker', 'teravolt', 'turboblaze'].includes(attackerAbility);

			if (defenderAbility === 'magicbounce' && !hasMoldBreaker) {
				messageLog.push(`${defenderSlot.pokemon.species} bounced the ${move.name} back with Magic Bounce!`);
				executeMove(defenderSlot, [attackerSlot], move, { id: move.id, pp: 0 }, battle, messageLog, true);
				continue;
			}
		}

		const truePriority = move.priority + RPGAbilities.applyPriorityModifier(move, attackerSlot.pokemon);

		if (battle.terrain?.type === 'psychic' && truePriority > 0) {
			const isDefenderGrounded = RPGAbilities.isGrounded(defenderSlot.pokemon, battle);
			const isAttackerPlayer = battle.playerSide.slots.includes(attackerSlot);
			const isDefenderPlayerCheck = battle.playerSide.slots.includes(defenderSlot);
			if (isDefenderGrounded && isAttackerPlayer !== isDefenderPlayerCheck) {
				messageLog.push(`${defenderSlot.pokemon.species} is protected by the Psychic Terrain!`);
				continue;
			}
		}

		const isPlayerDefender = battle.playerSide.slots.includes(defenderSlot);
		if (isSpread) {
			if ((isPlayerDefender && battle.playerSide.wideGuard) || (!isPlayerDefender && battle.opponentSide.wideGuard)) {
				messageLog.push(`${defenderSlot.pokemon.species} was protected by Wide Guard!`);
				continue;
			}
		}

		if (move.id !== 'struggle') {
			const attackerAbility = toID(attackerSlot.pokemon.ability || '');
			const bypassesProtect = attackerAbility === 'unseenfist' && move.flags.contact;
			if (defenderSlot.isProtected && move.flags.protect && !move.breaksProtect && !bypassesProtect) {
				messageLog.push(`<span style="color: #6c757d;">${defenderSlot.pokemon.species} protected itself!</span>`);
				continue;
			}
		}

		const moveHit = checkAccuracy(attackerSlot, defenderSlot, move, battle, messageLog);
		if (!moveHit) continue;

		moveHitAnyTarget = true;

		if (move.id === 'struggle') handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog, 1.0);
		else if (move.category === 'Status') handleStatusMove(attackerSlot, defenderSlot, move, battle, messageLog);
		else handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog, spreadMultiplier);
	}

	if (attackerSlot.pokemon.hp > 0) {
		if (move.self?.volatileStatus === 'lockedmove' && attackerSlot.lockedMoveCounter === 0) {
			attackerSlot.lockedMoveCounter = Math.floor(Math.random() * 2) + 2;
			attackerSlot.lockedMove = move.id;
		}
		if (move.self?.volatileStatus === 'mustrecharge' && moveHitAnyTarget) attackerSlot.mustRecharge = true;
		if (move.self?.volatileStatus === 'uproar' && attackerSlot.uproarTurns === 0) {
			attackerSlot.uproarTurns = 3;
			attackerSlot.lockedMove = move.id;
			[...battle.playerSide.slots, ...battle.opponentSide.slots].forEach(s => {
				if (s && s.status === 'slp') {
					s.status = null;
					s.sleepCounter = 0;
					messageLog.push(`${s.pokemon.species} woke up due to the uproar!`);
				}
			});
		}

		RPGAbilities.checkFormChangeAbilities(attackerSlot, battle, messageLog);
		if (toID(attackerSlot.pokemon.ability || '') === 'gulpmissile' && (move.id === 'surf' || move.id === 'dive') && moveHitAnyTarget) {
			const hpPercent = attackerSlot.pokemon.hp / attackerSlot.pokemon.maxHp;
			if (hpPercent > 0.5 && !attackerSlot.pokemon.species.includes('Gulping')) {
				attackerSlot.pokemon.species = 'Cramorant-Gulping';
				(attackerSlot as any).gulpMissileForm = 'gulping';
				messageLog.push(`${attackerSlot.pokemon.nickname || 'Cramorant'} caught an Arrokuda!`);
			} else if (hpPercent <= 0.5 && !attackerSlot.pokemon.species.includes('Gorging')) {
				attackerSlot.pokemon.species = 'Cramorant-Gorging';
				(attackerSlot as any).gulpMissileForm = 'gorging';
				messageLog.push(`${attackerSlot.pokemon.nickname || 'Cramorant'} caught a Pikachu!`);
			}
		}

		if (move.id === 'spitup' && moveHitAnyTarget) {
			if (attackerSlot.stockpileCount > 0) {
				attackerSlot.statStages.def = Math.max(-6, attackerSlot.statStages.def - attackerSlot.stockpileCount);
				attackerSlot.statStages.spd = Math.max(-6, attackerSlot.statStages.spd - attackerSlot.stockpileCount);
				attackerSlot.stockpileCount = 0;
				messageLog.push(`The stockpiled energy was released!`);
			}
		}
	}

	targetSlots.forEach(s => { if (s && s.pokemon.hp > 0) RPGAbilities.checkFormChangeAbilities(s, battle, messageLog); });
	if (attackerSlot.pokemon.hp > 0 && toID(attackerSlot.pokemon.ability || '') === 'truant') attackerSlot.isLoafing = true;
}

export function handleSwitchAction(
	attackerSlot: ActivePokemonSlot,
	attackerSlotIndex: number,
	action: Extract<NonNullable<BattleState['pendingActions'][number]>, { actionType: 'switch' }>,
	battle: BattleState,
	player: PlayerData,
	messageLog: string[]
) {
	if (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'shedshell') {
		if (attackerSlot.isIngrained) {
			messageLog.push(`${attackerSlot.pokemon.species} is rooted in place by Ingrain and can't switch out!`);
			return;
		}
	} else {
		const trappingPokemon = checkTrappingAbility(attackerSlot, battle);
		if (trappingPokemon) {
			messageLog.push(`${attackerSlot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`);
			return;
		}
		if (attackerSlot.isIngrained) {
			messageLog.push(`${attackerSlot.pokemon.species} is rooted in place by Ingrain and can't switch out!`);
			return;
		}
		if (attackerSlot.isTrapped || attackerSlot.partiallyTrapped) {
			messageLog.push(`${attackerSlot.pokemon.species} is trapped and can't switch out!`);
			return;
		}
		if (battle.fairyLockTurns > 0) {
			messageLog.push(`${attackerSlot.pokemon.species} can't switch out due to Fairy Lock!`);
			return;
		}
	}

	const outgoingPokemon = attackerSlot.pokemon;

	if (!battle.persistentPokemonState) battle.persistentPokemonState = {};

	battle.persistentPokemonState[outgoingPokemon.id] = {
		terastallized: attackerSlot.terastallized,
		sleepCounter: attackerSlot.sleepCounter,
		toxicCounter: attackerSlot.toxicCounter,
	};

	const outgoingAbility = toID(outgoingPokemon.ability || '');
	if (outgoingAbility === 'regenerator' && outgoingPokemon.hp > 0 && outgoingPokemon.hp < outgoingPokemon.maxHp) {
		const healAmount = Math.floor(outgoingPokemon.maxHp / 3);
		outgoingPokemon.hp = Math.min(outgoingPokemon.maxHp, outgoingPokemon.hp + healAmount);
		messageLog.push(`${outgoingPokemon.species}'s Regenerator restored its HP!`);
	} else if (outgoingAbility === 'naturalcure' && attackerSlot.status) {
		attackerSlot.status = null;
		outgoingPokemon.status = null;
		messageLog.push(`${outgoingPokemon.species}'s Natural Cure healed its status!`);
	}
	if (outgoingAbility === 'zerotohero' && outgoingPokemon.species.includes('Palafin')) (outgoingPokemon as any).hasSwitchedOut = true;

	const allSlots = [...battle.playerSide.slots, ...battle.opponentSide.slots];
	for (const slot of allSlots) {
		if (slot?.isAttracted) {
			slot.isAttracted = false;
		}
	}

	saveBattleStatus(battle);
	const isPlayerSwitch = attackerSlotIndex <= 1;
	const pokemonToSwitchInId = action.switchToPokemonId!;

	if (isPlayerSwitch) {
		const playerParty = getActiveParty(battle, player);
		const incomingPokemon = playerParty.find(p => p.id === pokemonToSwitchInId);
		if (!incomingPokemon) {
			messageLog.push(`${outgoingPokemon.species} tried to switch out, but there was no one to switch to!`);
			return;
		}

		const savedState = battle.persistentPokemonState[incomingPokemon.id];
		const newSlot = createActivePokemonSlot(incomingPokemon, savedState);

		if ((incomingPokemon as any).hasSwitchedOut) (newSlot as any).hasSwitchedOut = true;
		battle.playerSide.slots[attackerSlotIndex as 0 | 1] = newSlot;
		messageLog.push(`<b>${player.name} withdrew ${outgoingPokemon.species} and sent out ${incomingPokemon.species}!</b>`);

		const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, true, messageLog);
		if (faintedOnEntry) messageLog.push(`<b>${newSlot.pokemon.species} fainted upon entry!</b>`);
		else {
			handleMirrorHerb(newSlot, battle, messageLog);
			RPGAbilities.checkFormChangeAbilities(newSlot, battle, messageLog);
		}
	} else {
		const replacement = battle.opponentParty.find(p => p.id === pokemonToSwitchInId);
		if (replacement) {
			messageLog.push(`<b>${battle.opponentName} withdrew ${outgoingPokemon.species} and sent out ${replacement.species}!</b>`);

			const savedState = battle.persistentPokemonState[replacement.id];
			const newSlot = createActivePokemonSlot(replacement, savedState);

			if ((replacement as any).hasSwitchedOut) (newSlot as any).hasSwitchedOut = true;
			battle.opponentSide.slots[attackerSlotIndex as 0 | 1] = newSlot;
			const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
			if (faintedOnEntry) messageLog.push(`<b>${newSlot.pokemon.species} fainted upon entry!</b>`);
			else {
				handleMirrorHerb(newSlot, battle, messageLog);
				RPGAbilities.checkFormChangeAbilities(newSlot, battle, messageLog);
			}
		} else {
			messageLog.push(`${outgoingPokemon.species} tried to switch out, but no one was left!`);
		}
	}
}

export function resolveMoveTarget(
	attackerSlotIndex: number,
	chosenTargetSlotIndex: number,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): number {
	const isPlayerAttacker = attackerSlotIndex <= 1;
	const opponentSlots = getActiveSlots(isPlayerAttacker ? battle.opponentSide.slots : battle.playerSide.slots);
	let finalTargetIndex = chosenTargetSlotIndex;

	const attackerSlot = attackerSlotIndex <= 1 ? battle.playerSide.slots[attackerSlotIndex] : battle.opponentSide.slots[attackerSlotIndex - 2];
	const attackerAbility = toID(attackerSlot?.pokemon.ability || '');
	const ignoresRedirection = attackerAbility === 'propellertail' || attackerAbility === 'stalwart';

	let abilityRedirector: ActivePokemonSlot | undefined = undefined;
	if (move.target === 'normal' && !ignoresRedirection) {
		const moveType = move.type;
		if (moveType === 'Water') abilityRedirector = opponentSlots.find(s => toID(s.pokemon.ability || '') === 'stormdrain');
		else if (moveType === 'Electric') abilityRedirector = opponentSlots.find(s => toID(s.pokemon.ability || '') === 'lightningrod');

		if (abilityRedirector) {
			finalTargetIndex = [...battle.playerSide.slots, ...battle.opponentSide.slots].indexOf(abilityRedirector);
			messageLog.push(`${abilityRedirector.pokemon.species}'s ${abilityRedirector.pokemon.ability} drew in the attack!`);
		}
	}

	if (!abilityRedirector && !ignoresRedirection) {
		const redirector = opponentSlots.find(s => s.isRedirecting);
		if (redirector && move.target === 'normal') {
			finalTargetIndex = [...battle.playerSide.slots, ...battle.opponentSide.slots].indexOf(redirector);
			messageLog.push(`${redirector.pokemon.species} took the attack!`);
		}
	}

	return finalTargetIndex;
}

export function handlePlayerFaint(battle: BattleState, messageLog: string[]): boolean {
	const playerSlotsToCheck = (battle.battleType.includes('double')) ? [0, 1] : [0];
	let switchNeeded = false;

	for (const i of playerSlotsToCheck) {
		const slot = battle.playerSide.slots[i];
		if (slot && slot.pokemon.hp <= 0) {
			messageLog.push(`<b>Your ${slot.pokemon.species} fainted!</b>`);

			const faintedAbility = toID(slot.pokemon.ability || '');
			const lastMove = slot.lastMoveThatHitMe;

			if (slot.destinyBondActive && slot.lastDamageTaken) {
				const opponentSlots = getActiveSlots(battle.opponentSide.slots);
				const attackerSlot = opponentSlots.find(p => p.pokemon.id === slot.lastDamageTaken?.from);
				if (attackerSlot && attackerSlot.pokemon.hp > 0) {
					attackerSlot.pokemon.hp = 0;
					messageLog.push(`${slot.pokemon.species} took its attacker down with it!`);
				}
			}

			if (slot.grudgeActive && slot.lastMoveThatHitMe) {
				const opponentSlots = getActiveSlots(battle.opponentSide.slots);
				const attackerSlot = opponentSlots.find(p => p.pokemon.id === slot.lastDamageTaken?.from);
				if (attackerSlot && attackerSlot.pokemon.hp > 0) {
					const usedMove = attackerSlot.pokemon.moves.find(m => m.id === slot.lastMoveThatHitMe!.id);
					if (usedMove) {
						usedMove.pp = 0;
						messageLog.push(`${attackerSlot.pokemon.species}'s ${slot.lastMoveThatHitMe.name} lost all its PP due to Grudge!`);
					}
				}
			}

			if (faintedAbility === 'aftermath' && lastMove?.flags.contact) {
				const opponentSlots = getActiveSlots(battle.opponentSide.slots);
				const attackerSlot = opponentSlots.find(p => p.pokemon.id === slot.lastDamageTaken?.from);
				if (attackerSlot && attackerSlot.pokemon.hp > 0 && RPGAbilities.takesIndirectDamage(attackerSlot.pokemon)) {
					const damage = Math.floor(attackerSlot.pokemon.maxHp / 4);
					attackerSlot.pokemon.hp = Math.max(0, attackerSlot.pokemon.hp - damage);
					messageLog.push(`${attackerSlot.pokemon.species} was hurt by ${slot.pokemon.species}'s Aftermath!`);
				}
			}

			const allActiveSlots = [...getActiveSlots(battle.playerSide.slots), ...getActiveSlots(battle.opponentSide.slots)];
			for (const activeSlot of allActiveSlots) {
				if (activeSlot.pokemon.hp > 0 && toID(activeSlot.pokemon.ability || '') === 'soulheart' && activeSlot.statStages.spa < 6) {
					activeSlot.statStages.spa++;
					messageLog.push(`${activeSlot.pokemon.species}'s Soul-Heart raised its Sp. Atk!`);
				}
			}

			battle.playerSide.slots[i as 0 | 1] = null;
			switchNeeded = true;
		}
	}
	return switchNeeded;
}

export function handleOpponentFaint(
	battle: BattleState,
	player: PlayerData,
	playerParticipants: ActivePokemonSlot[],
	room: ChatRoom,
	user: User,
	messageLog: string[]
): boolean {
	const opponentSlotsToCheck = (battle.battleType.includes('double')) ? [0, 1] : [0];
	let faintedThisCheck = false;

	for (const i of opponentSlotsToCheck) {
		const slot = battle.opponentSide.slots[i];
		if (slot && slot.pokemon.hp <= 0) {
			faintedThisCheck = true;
			messageLog.push(`<b>The opposing ${slot.pokemon.species} fainted!</b>`);

			const faintedAbility = toID(slot.pokemon.ability || '');
			const lastMove = slot.lastMoveThatHitMe;

			if (slot.destinyBondActive && slot.lastDamageTaken) {
				const attackerSlot = playerParticipants.find(p => p.pokemon.id === slot.lastDamageTaken?.from);
				if (attackerSlot && attackerSlot.pokemon.hp > 0) {
					attackerSlot.pokemon.hp = 0;
					messageLog.push(`${slot.pokemon.species} took its attacker down with it!`);
				}
			}

			if (slot.grudgeActive && slot.lastMoveThatHitMe) {
				const attackerSlot = playerParticipants.find(p => p.pokemon.id === slot.lastDamageTaken?.from);
				if (attackerSlot && attackerSlot.pokemon.hp > 0) {
					const usedMove = attackerSlot.pokemon.moves.find(m => m.id === slot.lastMoveThatHitMe!.id);
					if (usedMove) {
						usedMove.pp = 0;
						messageLog.push(`${attackerSlot.pokemon.species}'s ${slot.lastMoveThatHitMe.name} lost all its PP due to Grudge!`);
					}
				}
			}

			if (faintedAbility === 'aftermath' && lastMove?.flags.contact) {
				const attackerSlot = playerParticipants.find(p => p.pokemon.id === slot.lastDamageTaken?.from);
				if (attackerSlot && attackerSlot.pokemon.hp > 0 && RPGAbilities.takesIndirectDamage(attackerSlot.pokemon)) {
					const damage = Math.floor(attackerSlot.pokemon.maxHp / 4);
					attackerSlot.pokemon.hp = Math.max(0, attackerSlot.pokemon.hp - damage);
					messageLog.push(`${attackerSlot.pokemon.species} was hurt by ${slot.pokemon.species}'s Aftermath!`);
				}
			}

			for (const participantSlot of playerParticipants) {
				if (participantSlot.pokemon.hp <= 0) continue;
				RPGAbilities.applyOnKOAbilities(participantSlot, battle, messageLog);
			}

			const allActiveSlots = [...getActiveSlots(battle.playerSide.slots), ...getActiveSlots(battle.opponentSide.slots)];
			for (const activeSlot of allActiveSlots) {
				if (activeSlot.pokemon.hp > 0 && toID(activeSlot.pokemon.ability || '') === 'soulheart' && activeSlot.statStages.spa < 6) {
					activeSlot.statStages.spa++;
					messageLog.push(`${activeSlot.pokemon.species}'s Soul-Heart raised its Sp. Atk!`);
				}
			}

			if (battle.battleType !== 'battletower' && playerParticipants.length > 0) {
				const expResult = gainExperience(player, playerParticipants, slot.pokemon, room, user);
				messageLog.push(...expResult.messages);
			}

			let foundReplacement = false;
			while (!foundReplacement) {
				const nextOpponent = battle.opponentParty.find(p => p.hp > 0 && !battle.opponentSide.slots.some(s => s?.pokemon.id === p.id));
				if (nextOpponent) {
					messageLog.push(`<b>${battle.opponentName} is about to send in ${nextOpponent.species}!</b>`);
					const newSlot = createActivePokemonSlot(nextOpponent);
					battle.opponentSide.slots[i as 0 | 1] = newSlot;
					const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
					if (faintedOnEntry) messageLog.push(`<b>${newSlot.pokemon.species} fainted upon entry!</b>`);
					else {
						handleMirrorHerb(newSlot, battle, messageLog);
						foundReplacement = true;
					}
				} else {
					battle.opponentSide.slots[i as 0 | 1] = null;
					foundReplacement = true;
				}
			}
		}
	}
	return faintedThisCheck;
}

export function handleAiPivot(battle: BattleState, messageLog: string[]) {
	if (!battle.aiPendingPivot) return;
	const slotIndex = battle.aiPendingPivot.slotIndex;
	const pivotSlot = battle.aiPendingPivot.slot;
	const isBatonPass = battle.aiPendingPivot.isBatonPass;

	messageLog.push(`<b>${battle.opponentName} withdrew ${pivotSlot.pokemon.species}!</b>`);

	let foundReplacement = false;
	while (!foundReplacement) {
		const nextOpponent = battle.opponentParty.find(p => p.hp > 0 && p.id !== pivotSlot.pokemon.id && !battle.opponentSide.slots.some(s => s?.pokemon.id === p.id));
		if (nextOpponent) {
			messageLog.push(`<b>${battle.opponentName} sent out ${nextOpponent.species}!</b>`);
			const newSlot = createActivePokemonSlot(nextOpponent);
			if (isBatonPass) {
				newSlot.statStages = { ...pivotSlot.statStages };
				newSlot.isConfused = pivotSlot.isConfused;
				newSlot.confusionCounter = pivotSlot.confusionCounter;
				newSlot.isSeeded = pivotSlot.isSeeded;
				messageLog.push(`${newSlot.pokemon.species} received the Baton Pass!`);
			}
			battle.opponentSide.slots[slotIndex as 0 | 1] = newSlot;
			const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
			if (faintedOnEntry) messageLog.push(`<b>${newSlot.pokemon.species} fainted upon entry!</b>`);
			else {
				handleMirrorHerb(newSlot, battle, messageLog);
				foundReplacement = true;
			}
		} else {
			battle.opponentSide.slots[slotIndex as 0 | 1] = pivotSlot;
			messageLog.push(`${pivotSlot.pokemon.species} had no one to switch to!`);
			foundReplacement = true;
		}
	}
	battle.aiPendingPivot = undefined;
}

export function checkBattleEndCondition(
	context: CommandContext,
	battle: BattleState,
	room: ChatRoom,
	user: User,
	messageLog: string[]
): boolean {
	const player = getPlayerData(user.id);
	handleAiPivot(battle, messageLog);
	const playerParticipants = getActiveSlots(battle.playerSide.slots);
	handleOpponentFaint(battle, player, playerParticipants, room, user, messageLog);
	const playerSwitchNeeded = handlePlayerFaint(battle, messageLog);

	const battleEnded = checkForWinLoss(context, battle, player, user, messageLog, room);
	if (battleEnded) return true;

	if (battle.pendingPivot) {
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${BattleUI.generatePivotSwitchHTML(battle, messageLog.join('<br>'), battle.pendingPivot.slotIndex)}`);
		return true;
	}

	const playerHasLivingPokemon = getActiveParty(battle, player).some(p => p.hp > 0 && !battle.playerSide.slots.some(s => s?.pokemon.id === p.id));
	if (playerSwitchNeeded && playerHasLivingPokemon) {
		for (let i = 0; i < battle.playerSide.slots.length; i++) {
			if (battle.playerSide.slots[i] === null || battle.playerSide.slots[i]?.pokemon.hp === 0) delete battle.pendingActions[i];
		}
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${BattleUI.generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
		return true;
	}

	return false;
}

export function checkForWinLoss(
	context: CommandContext,
	battle: BattleState,
	player: PlayerData,
	user: User,
	messageLog: string[],
	room: ChatRoom
): boolean {
	const playerHasLivingPokemon = getActiveParty(battle, player).some(p => p.hp > 0 && !battle.playerSide.slots.some(s => s?.pokemon.id === p.id));
	const playerHasActivePokemon = getActiveSlots(battle.playerSide.slots).length > 0;

	if (!playerHasActivePokemon && !playerHasLivingPokemon) {
		if (battle.battleType === 'battletower') {
			saveBattleStatus(battle);
			battle.battleEnded = true;
			battle.battleResult = 'defeat';
			const currentFloor = battle.floor || 1;
			const lossHTML = generateBattleTowerLossHTML(currentFloor);
			context.sendReply(`|uhtmlchange|rpg-${user.id}|${lossHTML}`);
			player.battleTowerFloor = 1;
			activeBattles.delete(user.id);
			return true;
		}

		saveBattleStatus(battle);
		battle.battleEnded = true;
		battle.battleResult = 'defeat';

		let moneyLost = 100;
		if (battle.battleType.includes('trainer')) moneyLost = Math.floor(battle.opponentMoney / 10) || 200;
		moneyLost = Math.min(player.money, moneyLost);
		player.money -= moneyLost;

		for (const pokemon of player.party) {
			pokemon.hp = pokemon.maxHp;
			pokemon.status = null;
			pokemon.moves.forEach(m => { m.pp = getMove(m.id).pp || 5; });
		}

		const respawnLocation = player.lastPokemonCenter || GameConfig.startLocationId;
		const locationData = LOCATIONS[respawnLocation];
		player.location = locationData?.name || 'Unknown';

		messageLog.push(`<hr><center><b>Defeat!</b></center>`);
		messageLog.push(`<center><b>You lost ₽${moneyLost}!</b></center>`);

		context.sendReply(`|uhtmlchange|rpg-${user.id}|${BattleUI.generateBattleHTML(battle, messageLog, undefined, teraToggleState.get(user.id))}`);
		activeBattles.delete(user.id);
		teraToggleState.delete(user.id);
		activeScriptedEvents.delete(user.id);
		return true;
	}

	const opponentHasLivingPokemon = battle.opponentParty.some(p => p.hp > 0 && !battle.opponentSide.slots.some(s => s?.pokemon.id === p.id));
	const opponentHasActivePokemon = getActiveSlots(battle.opponentSide.slots).length > 0;

	if (!opponentHasActivePokemon && !opponentHasLivingPokemon) {
		if (battle.battleType === 'battletower') {
			battle.battleEnded = true;
			battle.battleResult = 'victory';
			const currentFloor = battle.floor || 1;
			player.battleTowerFloor = currentFloor + 1;
			if (currentFloor > player.battleTowerHighestFloor) {
				player.battleTowerHighestFloor = currentFloor;
			}
			context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleTowerFloorCompleteHTML(currentFloor)}`);
			return true;
		}

		saveBattleStatus(battle);
		battle.battleEnded = true;
		battle.battleResult = 'victory';

		const eventId = activeScriptedEvents.get(user.id);
		let moneyGained = 0;

		if (battle.battleType.includes('trainer')) {
			moneyGained = battle.opponentMoney;
			player.money += moneyGained;

			if (battle.trainerId) {
				player.defeatedTrainers.add(battle.trainerId);

				const trainer = TRAINER_DATABASE[battle.trainerId];
				if (trainer) {
					if (trainer.setFlag) {
						const flags = Array.isArray(trainer.setFlag) ? trainer.setFlag : [trainer.setFlag];
						flags.forEach(f => player.storyFlags.add(f));
					}
					if (trainer.removeFlag) {
						const flags = Array.isArray(trainer.removeFlag) ? trainer.removeFlag : [trainer.removeFlag];
						flags.forEach(f => player.storyFlags.delete(f));
					}
				}

				const badgeName = getBadgeForGymLeader(battle.trainerId);
				if (badgeName && !player.obtainedBadges.includes(badgeName)) {
					player.obtainedBadges.push(badgeName);
					player.badges = player.obtainedBadges.length;
					messageLog.push(`<hr><center><strong>You obtained the ${badgeName}!</strong></center>`);

					if (player.obtainedBadges.length === TOTAL_BADGES) {
						player.storyFlags.add('all_badges');
						messageLog.push(`<hr><center><strong>You now have all ${TOTAL_BADGES} gym badges!</strong></center>`);
					}
				}

				if (battle.trainerId === GameConfig.specialIds.champion) {
					player.storyFlags.add('champion');
					player.storyFlags.add('game_complete');
					messageLog.push(`<hr><center><strong>🏆 Congratulations! You are the new Champion! 🏆</strong></center>`);
				}
			}

			messageLog.push(`<hr><center><b>Victory!</b></center>`);
			messageLog.push(`<center><strong>You defeated ${battle.opponentName}!</strong></center>`);
			messageLog.push(`<center><b>You received ₽${moneyGained} for winning!</b></center>`);

			if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player, messageLog)}`);
			} else {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${BattleUI.generateBattleHTML(battle, messageLog, undefined, teraToggleState.get(user.id), eventId)}`);
			}
		} else {
			moneyGained = Math.floor(battle.opponentParty.reduce((sum, p) => sum + p.level, 0) * 5);
			player.money += moneyGained;

			messageLog.push(`<hr><center><b>Victory!</b></center>`);
			messageLog.push(`<center><b>You gained ₽${moneyGained}!</b></center>`);

			if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player, messageLog)}`);
			} else {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${BattleUI.generateBattleHTML(battle, messageLog, undefined, teraToggleState.get(user.id), eventId)}`);
			}
		}
		activeBattles.delete(user.id);
		return true;
	}

	return false;
}
