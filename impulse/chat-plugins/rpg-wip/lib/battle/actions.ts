/*
* Pokemon Showdown
* RPG Battle Actions
*/
import { Dex, toID } from '../../../../sim/dex';
import type { PlayerData, BattleState, RPGPokemon, ActivePokemonSlot, Move } from '../interface';
import { getPlayerData } from '../lib/player';
import { getActiveSlots, getMove } from '../utils';
import { RPGMoves } from '../battle-moves';
import { handleDamagingMove, handleStatusMove } from '../battle-core';

export function handleSwitchAction(
	attackerSlot: ActivePokemonSlot,
	attackerSlotIndex: number,
	action: Extract<NonNullable<BattleState['pendingActions'][number]>, { actionType: 'switch' }>,
	battle: BattleState,
	player: PlayerData,
	messageLog: string[]
) {
	const isPlayerSwitch = attackerSlotIndex <= 1;
	const pokemonToSwitchInId = action.switchToPokemonId!;

	if (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'shedshell') {
		if (attackerSlot.isIngrained) {
			messageLog.push(`${attackerSlot.pokemon.species} is rooted in place by Ingrain and can't switch out!`);
			return;
		}
	} else {
		// const trappingPokemon = checkTrappingAbility(attackerSlot, battle);
		// if (trappingPokemon) {
		// 	messageLog.push(`${attackerSlot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`);
		// 	return;
		// }

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

	if (outgoingAbility === 'zerotohero' && outgoingPokemon.species.includes('Palafin')) {
		(outgoingPokemon as any).hasSwitchedOut = true;
	}

	// saveBattleStatus(battle);

	if (isPlayerSwitch) {
		// ... (player switch logic)
	} else {
		// ... (opponent switch logic)
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
	const opponentSlots = getActiveSlots(isPlayerAttacker ? battle.opponentSlots : battle.playerSlots);
	let finalTargetIndex = chosenTargetSlotIndex;

	const attackerSlot = attackerSlotIndex <= 1 ? battle.playerSlots[attackerSlotIndex] : battle.opponentSlots[attackerSlotIndex - 2];
	const attackerAbility = toID(attackerSlot?.pokemon.ability || '');
	const ignoresRedirection = attackerAbility === 'propellertail' || attackerAbility === 'stalwart';

	let abilityRedirector: ActivePokemonSlot | undefined = undefined;
	if (move.target === 'normal' && !ignoresRedirection) {
		const moveType = move.type;

		if (moveType === 'Water') {
			abilityRedirector = opponentSlots.find(s => toID(s.pokemon.ability || '') === 'stormdrain');
		} else if (moveType === 'Electric') {
			abilityRedirector = opponentSlots.find(s => toID(s.pokemon.ability || '') === 'lightningrod');
		}

		if (abilityRedirector) {
			const redirectorIndex = [...battle.playerSlots, ...battle.opponentSlots].indexOf(abilityRedirector);
			finalTargetIndex = redirectorIndex;
			messageLog.push(`${abilityRedirector.pokemon.species}'s ${abilityRedirector.pokemon.ability} drew in the attack!`);
		}
	}

	if (!abilityRedirector && !ignoresRedirection) {
		const redirector = opponentSlots.find(s => s.isRedirecting);
		if (redirector && move.target === 'normal') {
			const redirectorIndex = [...battle.playerSlots, ...battle.opponentSlots].indexOf(redirector);
			finalTargetIndex = redirectorIndex;
			messageLog.push(`${redirector.pokemon.species} took the attack!`);
		}
	}

	return finalTargetIndex;
}

export function executeAction(
	action: NonNullable<BattleState['pendingActions'][number]>,
	battle: BattleState,
	room: ChatRoom,
	user: User,
	messageLog: string[]
) {
	const player = getPlayerData(battle.playerId);
	const allSlots = [...battle.playerSlots, ...battle.opponentSlots];
	const attackerSlotIndex = allSlots.findIndex(s => s?.pokemon.id === action.pokemonId);
	const attackerSlot = allSlots[attackerSlotIndex];

	if (!attackerSlot || attackerSlot.pokemon.hp <= 0) {
		return;
	}

	attackerSlot.isRedirecting = false;

	if (action.actionType === 'switch') {
		handleSwitchAction(attackerSlot, attackerSlotIndex, action as any, battle, player, messageLog);
		return;
	}

	if (action.actionType === 'move' && action.moveId && action.targetSlot !== undefined) {
		const isPlayerPokemon = attackerSlotIndex < battle.playerSlots.length;
		if (action.terastallize && isPlayerPokemon) {
			if (battle.playerTerastallizeUsed) {
				messageLog.push(`<span style="color: #FF1493;">${attackerSlot.pokemon.species} couldn't Terastallize because another Pokemon already did!</span>`);
			} else if (attackerSlot.terastallized) {
				messageLog.push(`<span style="color: #FF1493;">${attackerSlot.pokemon.species} has already Terastallized!</span>`);
			} else {
				attackerSlot.terastallized = attackerSlot.pokemon.teraType;
				battle.playerTerastallizeUsed = true;
				messageLog.push(`<span style="color: #FF1493; font-weight: bold;">✨ ${attackerSlot.pokemon.species} Terastallized into ${attackerSlot.pokemon.teraType} type! ✨</span>`);

				if (toID(attackerSlot.pokemon.ability || '') === 'slowstart' && attackerSlot.slowStartTurns && attackerSlot.slowStartTurns > 0) {
					attackerSlot.slowStartTurns = 0;
					messageLog.push(`${attackerSlot.pokemon.species} got its act together due to Terastallization!`);
				}
			}
		}

		const move = getMove(action.moveId);
		let moveObject = attackerSlot.pokemon.moves.find(m => m.id === move.id);

		if (move.id === 'struggle') moveObject = { id: 'struggle', pp: 1 };
		else if (!moveObject) moveObject = { id: 'struggle', pp: 1 };
		else if (moveObject.pp === 0) {
			moveObject = { id: 'struggle', pp: 1 };
			messageLog.push(`${attackerSlot.pokemon.species} has no PP left for ${move.name}!`);
		}

		if (!handlePreTurnChecks(attackerSlot, battle, messageLog, move)) {
			return;
		}

		const finalTargetIndex = resolveMoveTarget(attackerSlotIndex, action.targetSlot, move, battle, messageLog);
		const resolvedTargets = getMoveTargets(attackerSlotIndex, finalTargetIndex, move, battle);

		let ppDeduction = 1;
		if (resolvedTargets.some(target => toID(target.pokemon.ability || '') === 'pressure')) {
			ppDeduction = 2;
		}

		if (RPGMoves.handleChargingMove(attackerSlot, move, moveObject, battle, messageLog, ppDeduction)) {
			return;
		}

		if (moveObject.id !== 'struggle' && moveObject.pp > 0 && !move.flags.charge) {
			moveObject.pp = Math.max(0, moveObject.pp - ppDeduction);
		}

		messageLog.push(`<span style="color: #555;"><strong>${attackerSlot.pokemon.species}</strong> used <strong>${move.name}</strong>!</span>`);
		if (resolvedTargets.length === 0) {
			messageLog.push(`But there was no target!`);
			return;
		}

		const remainingTargets: ActivePokemonSlot[] = [];
		for (const defenderSlot of resolvedTargets) {
			const abilityContext = { attacker: attackerSlot.pokemon, defender: defenderSlot.pokemon, attackerSlot, defenderSlot, move, battle, messageLog };
			// const preventionCheck = RPGAbilities.preventMove(abilityContext);
			// if (preventionCheck?.prevented) {
			// 	messageLog.push(preventionCheck.message || `${defenderSlot.pokemon.species}'s ability prevented the move!`);
			// } else {
			// 	remainingTargets.push(defenderSlot);
			// }
		}
		if (resolvedTargets.length > 0 && remainingTargets.length === 0) {
			return;
		}

		// executeMove(attackerSlot, remainingTargets, move, moveObject, battle, messageLog);

		if (attackerSlot.pokemon.hp > 0 && move.id !== 'struggle' && !attackerSlot.lockedMove) {
			const item = attackerSlot.pokemon.item;
			if (battle.magicRoomTurns === 0 && (item === 'choiceband' || item === 'choicescarf' || item === 'choicespecs')) {
				attackerSlot.lockedMove = move.id;
			}
		}

		if (move.selfSwitch && attackerSlot.pokemon.hp > 0) {
			// ... (self-switch logic)
		}
	}
}

export function checkBattleEndCondition(
	context: CommandContext,
	battle: BattleState,
	room: ChatRoom,
	user: User,
	messageLog: string[]
): boolean {
	const player = getPlayerData(user.id);

	const playerParticipants = getActiveSlots(battle.playerSlots);
	// handleOpponentFaint(battle, player, playerParticipants, room, user, messageLog);
	// const playerSwitchNeeded = handlePlayerFaint(battle, messageLog);

	// const battleEnded = checkForWinLoss(context, battle, player, user, messageLog);
	// if (battleEnded) return true;

	if (battle.pendingPivot) {
		context.popupReply(`|wide||html|${generatePivotSwitchHTML(battle, messageLog.join('<br>'), battle.pendingPivot.slotIndex)}`);
		return true;
	}
	// handleAiPivot(battle, messageLog);

	const playerHasLivingPokemon = player.party.some(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);

	// if (playerSwitchNeeded && playerHasLivingPokemon) {
	// 	for (let i = 0; i < battle.playerSlots.length; i++) {
	// 		if (battle.playerSlots[i] === null || battle.playerSlots[i]?.pokemon.hp === 0) {
	// 			delete battle.pendingActions[i];
	// 		}
	// 	}
	// 	context.popupReply(`|wide||html|${generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
	// 	return true;
	// }

	return false;
}
