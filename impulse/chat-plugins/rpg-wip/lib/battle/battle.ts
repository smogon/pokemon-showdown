/*
* Pokemon Showdown
* RPG Battle Class
*/

import { Dex, toID } from '../../../../sim/dex';
import type { PlayerData, BattleState, RPGPokemon, ActivePokemonSlot, Move } from '../interface';
import { getPlayerData } from '../lib/player';
import { getActiveSlots, getMove } from '../utils';
import { generateBattleHTML, generateMoveLearnHTML, generatePivotSwitchHTML, generateFaintSwitchHTML } from '../html';
import { RPGMoves } from '../battle-moves';
import { processEndOfTurn } from './effects';
import { checkBattleEndCondition, executeAction } from './actions';

export const activeBattles = new Map<string, Battle>();

export class Battle {
	state: BattleState;
	constructor(state: BattleState) {
		this.state = state;
	}

	processTurn(context: CommandContext, room: ChatRoom, user: User, initialMessages: string[] = []) {
		const messageLog: string[] = [...initialMessages];
		this.state.turn++;

		this.state.playerQuickGuard = false;
		this.state.opponentQuickGuard = false;
		this.state.playerWideGuard = false;
		this.state.opponentWideGuard = false;
		this.state.playerCraftyShield = false;
		this.state.opponentCraftyShield = false;

		getActiveSlots([...this.state.playerSlots, ...this.state.opponentSlots]).forEach(s => {
			s.isHelped = false;
			s.isRedirecting = false;
			s.lastDamageTaken = undefined;
		});

		getActiveSlots(this.state.opponentSlots).forEach((slot, i) => {
			const slotIndex = 2 + i;
			if (!this.state.pendingActions[slotIndex]) {
				this.state.pendingActions[slotIndex] = this.generateAiAction(slot, slotIndex);
			}
		});

		const actionQueue = this.buildActionQueue(messageLog);

		for (const action of actionQueue) {
			executeAction(action, this.state, room, user, messageLog);

			const battleEndedMidTurn = checkBattleEndCondition(context, this.state, room, user, messageLog);
			if (battleEndedMidTurn) {
				messageLog.push(`<hr><div style="text-align: center;"><strong>Turn ${this.state.turn}</strong></div><hr>`);
				this.state.battleLog.push(...messageLog);
				return;
			}
		}

		if (this.state.forceEnd) {
			messageLog.push(`<hr><div style="text-align: center;"><strong>Turn ${this.state.turn}</strong></div><hr>`);
			this.state.battleLog.push(...messageLog);
			return;
		}

		messageLog.push("--- End of Turn ---");
		processEndOfTurn(this.state, messageLog);

		const battleEnded = checkBattleEndCondition(context, this.state, room, user, messageLog);

		messageLog.push(`<hr><div style="text-align: center;"><strong>Turn ${this.state.turn}</strong></div><hr>`);
		this.state.battleLog.push(...messageLog);
		this.state.pendingActions = {};

		if (!battleEnded) {
			getActiveSlots([...this.state.playerSlots, ...this.state.opponentSlots]).forEach(slot => {
				if (slot.pokemon.hp > 0) {
					slot.activeTurns++;
				}
			});
			context.popupReply(`|wide||html|${generateBattleHTML(this.state)}`);
		}
	}

	private buildActionQueue(messageLog: string[]): NonNullable<BattleState['pendingActions'][number]>[] {
		const actionQueue: NonNullable<BattleState['pendingActions'][number]>[] = [];
		const allActiveSlots = getActiveSlots([...this.state.playerSlots, ...this.state.opponentSlots]);

		allActiveSlots.forEach(s => { s.analyticBoost = false; });

		for (const slotIndex in this.state.pendingActions) {
			const action = this.state.pendingActions[slotIndex];
			if (action && allActiveSlots.some(s => s.pokemon.id === action.pokemonId)) {
				actionQueue.push(action);
			}
		}

		actionQueue.sort((a, b) => {
			const slotA = allActiveSlots.find(s => s.pokemon.id === a.pokemonId);
			const slotB = allActiveSlots.find(s => s.pokemon.id === b.pokemonId);

			if (!slotA) return 1;
			if (!slotB) return -1;

			const isSwitchA = a.actionType === 'switch';
			const isSwitchB = b.actionType === 'switch';
			const moveA = getMove(a.moveId || 'struggle');
			const moveB = getMove(b.moveId || 'struggle');

			const priorityA = isSwitchA ? 6 : (moveA.priority);
			const priorityB = isSwitchB ? 6 : (moveB.priority);

			// priorityA += RPGAbilities.applyPriorityModifier(moveA, slotA.pokemon);
			// priorityB += RPGAbilities.applyPriorityModifier(moveB, slotB.pokemon);

			if (priorityA !== priorityB) {
				return priorityB - priorityA;
			}

			// let speedA = slotA.pokemon.spe * getStatMultiplier(slotA.statStages.spe);
			// const abilityA = toID(slotA.pokemon.ability || '');
			// if (slotA.status === 'par' && abilityA !== 'quickfeet') {
			// 	speedA = Math.floor(speedA / 2);
			// }
			// speedA = RPGAbilities.applySpeedModifier(slotA.pokemon, this.state, speedA);

			// let speedB = slotB.pokemon.spe * getStatMultiplier(slotB.statStages.spe);
			// const abilityB = toID(slotB.pokemon.ability || '');
			// if (slotB.status === 'par' && abilityB !== 'quickfeet') {
			// 	speedB = Math.floor(speedB / 2);
			// }
			// speedB = RPGAbilities.applySpeedModifier(slotB.pokemon, this.state, speedB);

			// const quickClawA = !isSwitchA && this.state.magicRoomTurns === 0 && slotA.pokemon.item === 'quickclaw' && Math.random() < 0.2;
			// const quickClawB = !isSwitchB && this.state.magicRoomTurns === 0 && slotB.pokemon.item === 'quickclaw' && Math.random() < 0.2;

			// if (quickClawA && !quickClawB) {
			// 	messageLog.push(`${slotA.pokemon.species}'s Quick Claw let it move first!`);
			// 	return -1;
			// }
			// if (quickClawB && !quickClawA) {
			// 	messageLog.push(`${slotB.pokemon.species}'s Quick Claw let it move first!`);
			// 	return 1;
			// }

			// if (this.state.trickRoomTurns > 0) {
			// 	return speedA - speedB;
			// }
			// return speedB - speedA;
			return 0;
		});

		allActiveSlots.forEach(s => { s.analyticBoost = false; });
		let lastMoveAction: NonNullable<BattleState['pendingActions'][number]> | null = null;
		for (let i = actionQueue.length - 1; i >= 0; i--) {
			if (actionQueue[i].actionType === 'move') {
				lastMoveAction = actionQueue[i];
				break;
			}
		}

		if (lastMoveAction) {
			const lastMoverSlot = allActiveSlots.find(s => s.pokemon.id === lastMoveAction.pokemonId);
			// if (lastMoverSlot && toID(lastMoverSlot.pokemon.ability || '') === 'analytic') {
			// 	lastMoverSlot.analyticBoost = true;
			// }
		}

		return actionQueue;
	}

	private generateAiAction(aiSlot: ActivePokemonSlot, aiSlotIndex: number): BattleState['pendingActions'][number] {
		let chosenMoveId = 'struggle';

		if (aiSlot.lockedMoveCounter && aiSlot.lockedMoveCounter > 0 && aiSlot.lockedMove) {
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
		} else if (aiSlot.lockedMove && this.state.magicRoomTurns === 0) {
			const choiceItems = ['choiceband', 'choicescarf', 'choicespecs'];
			if (choiceItems.includes(aiSlot.pokemon.item || '')) {
				const lockedMoveObj = aiSlot.pokemon.moves.find(m => m.id === aiSlot.lockedMove);
				if (lockedMoveObj && lockedMoveObj.pp > 0) {
					chosenMoveId = aiSlot.lockedMove;
				}
			}
		}

		if (chosenMoveId === 'struggle' && !aiSlot.lockedMoveCounter && !aiSlot.uproarTurns && !aiSlot.encoreMove) {
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

		const playerSlots = getActiveSlots(this.state.playerSlots);
		let targetSlotIndex = 0;
		if (playerSlots.length > 0) {
			const targetSlot = playerSlots[Math.floor(Math.random() * playerSlots.length)];
			targetSlotIndex = this.state.playerSlots.indexOf(targetSlot);
		}

		return {
			actionType: 'move',
			moveId: chosenMoveId,
			targetSlot: targetSlotIndex,
			pokemonId: aiSlot.pokemon.id,
		};
	}
}
