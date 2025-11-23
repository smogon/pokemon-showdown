import type { PlayerData, RPGPokemon, NPCAction } from './interface';
import { ITEMS_DATABASE } from './items';
import { createPokemon } from './core';
import { Dex } from '../../../sim/dex';

export function handleBattleRequest(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, canBattle: boolean } {
	if (!action.trainerId) {
		return { success: false, message: 'No trainer configured.', canBattle: false };
	}

	const cooldownFlag = `battlerequest_${npcId}_lastbattle`;
	const lastBattleStr = Array.from(player.storyFlags).find(f => f.startsWith(cooldownFlag));

	let lastBattleTime = 0;
	if (lastBattleStr) {
		lastBattleTime = parseInt(lastBattleStr.split('_').pop() || '0');
	}

	const now = Date.now();
	const cooldownHours = action.battleCooldown || 24;
	const hoursSinceLastBattle = (now - lastBattleTime) / (1000 * 60 * 60);

	if (hoursSinceLastBattle < cooldownHours) {
		const hoursRemaining = Math.ceil(cooldownHours - hoursSinceLastBattle);
		return {
			success: false,
			message: `You can battle this trainer again in ${hoursRemaining} hour(s).`,
			canBattle: false,
		};
	}

	return {
		success: true,
		message: 'Battle is available!',
		canBattle: true,
	};
}

export function completeBattleRequest(player: PlayerData, npcId: string): void {
	const cooldownFlag = `battlerequest_${npcId}_lastbattle`;
	const lastBattleStr = Array.from(player.storyFlags).find(f => f.startsWith(cooldownFlag));

	if (lastBattleStr) player.storyFlags.delete(lastBattleStr);
	player.storyFlags.add(`${cooldownFlag}_${Date.now()}`);
}

export function handleQuestChain(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, currentStage?: number, stageInfo?: any } {
	if (!action.questId || !action.questStages) {
		return { success: false, message: 'Quest not configured.' };
	}

	const questFlag = `quest_${action.questId}_stage`;
	const questStageStr = Array.from(player.storyFlags).find(f => f.startsWith(questFlag));

	let currentStage = 0;
	if (questStageStr) {
		currentStage = parseInt(questStageStr.split('_').pop() || '0');
	}

	if (currentStage >= action.questStages.length) {
		return {
			success: false,
			message: 'You have completed all stages of this quest!',
		};
	}

	const stageInfo = action.questStages[currentStage];

	if (stageInfo.requiredFlag && !player.storyFlags.has(stageInfo.requiredFlag)) {
		return {
			success: false,
			message: `Stage ${currentStage + 1}: ${stageInfo.description}. Requirements not met yet.`,
			currentStage,
			stageInfo,
		};
	}

	return {
		success: true,
		message: `Stage ${currentStage + 1}: ${stageInfo.description}`,
		currentStage,
		stageInfo,
	};
}

export function advanceQuestStage(player: PlayerData, questId: string): void {
	const questFlag = `quest_${questId}_stage`;
	const questStageStr = Array.from(player.storyFlags).find(f => f.startsWith(questFlag));

	let currentStage = 0;
	if (questStageStr) {
		currentStage = parseInt(questStageStr.split('_').pop() || '0');
		player.storyFlags.delete(questStageStr);
	}

	player.storyFlags.add(`${questFlag}_${currentStage + 1}`);
}

export function handleMoveRelearner(
	player: PlayerData,
	action: NPCAction,
	pokemon: RPGPokemon,
	moveId: string
): { success: boolean, message: string } {
	const cost = action.relearnerCost || 2000;
	if (player.money < cost) {
		return { success: false, message: `Move relearning costs ₽${cost} per move.` };
	}

	if (pokemon.moves.some(m => m.id === moveId)) {
		return { success: false, message: `${pokemon.nickname} already knows this move!` };
	}

	const species = Dex.species.get(pokemon.species);
	const learnset = species.learnset;

	let canLearn = false;
	if (learnset?.[moveId]) {
		canLearn = true;
	}

	if (!canLearn) {
		return { success: false, message: `${pokemon.nickname} cannot learn this move!` };
	}

	player.money -= cost;

	return {
		success: true,
		message: `${pokemon.nickname} can relearn ${moveId}!`,
	};
}

export function handleRivalBattle(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, rivalTeam?: any[], dialogue?: any } {
	return {
		success: true,
		message: `Your rival wants to battle!`,
		rivalTeam: action.rivalTeam,
		dialogue: action.rivalDialogue,
	};
}

export function handleHeal(
	player: PlayerData
): { success: boolean, message: string } {
	for (const pokemon of player.party) {
		pokemon.hp = pokemon.maxHp;
		pokemon.status = null;
		for (const move of pokemon.moves) {
			const moveData = Dex.moves.get(move.id);
			move.pp = moveData.pp || 5;
		}
	}

	return {
		success: true,
		message: "We've restored your Pokémon to full health. We hope to see you again!",
	};
}

export function handleChooseStarter(
	player: PlayerData,
	action: NPCAction,
	selectedPokemon: string
): { success: boolean, message: string, pokemon?: RPGPokemon } {
	if (player.party.length > 0) {
		return {
			success: false,
			message: 'You already have a starter Pokémon!',
		};
	}

	const starterLevel = action.starterLevel || 5;

	const starter = createPokemon(selectedPokemon, starterLevel);
	player.party.push(starter);

	const species = Dex.species.get(selectedPokemon);

	return {
		success: true,
		message: `Excellent choice! ${species.name} will be a great partner for you.`,
		pokemon: starter,
	};
}

export function handleCollectionQuest(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, progress?: number, total?: number, reward?: any } {
	if (!action.requiredItems || action.requiredItems.length === 0) {
		return { success: false, message: 'No collection quest configured.' };
	}

	const questFlag = `collection_${npcId}_completed`;
	if (action.onceOnly && player.storyFlags.has(questFlag)) {
		return { success: false, message: 'You have already completed this collection quest!' };
	}

	let hasAllItems = true;
	let collectedCount = 0;

	for (const reqItem of action.requiredItems) {
		const item = player.inventory.get(reqItem.itemId);
		const hasQuantity = item?.quantity || 0;

		if (hasQuantity >= reqItem.quantity) {
			collectedCount++;
		} else {
			hasAllItems = false;
		}
	}

	if (!hasAllItems) {
		return {
			success: false,
			message: `You haven't collected all the required items yet.`,
			progress: collectedCount,
			total: action.requiredItems.length,
		};
	}

	for (const reqItem of action.requiredItems) {
		const item = player.inventory.get(reqItem.itemId)!;
		item.quantity -= reqItem.quantity;
		if (item.quantity === 0) {
			player.inventory.delete(reqItem.itemId);
		}
	}

	if (action.onceOnly) {
		player.storyFlags.add(questFlag);
	}

	return {
		success: true,
		message: 'Collection quest completed! Thank you!',
		progress: collectedCount,
		total: action.requiredItems.length,
		reward: action.questReward,
	};
}

export function handleDeliveryQuest(
	player: PlayerData,
	action: NPCAction,
	npcId: string,
	isPickup: boolean
): { success: boolean, message: string, deliveryItem?: { itemId: string, quantity: number }, targetNpcId?: string } {
	if (!action.deliveryItem || !action.targetNpcId) {
		return { success: false, message: 'Delivery quest not configured.' };
	}

	const deliveryFlag = `delivery_${npcId}_${action.targetNpcId}_active`;
	const completedFlag = `delivery_${npcId}_${action.targetNpcId}_completed`;

	if (action.onceOnly && player.storyFlags.has(completedFlag)) {
		return { success: false, message: 'You have already completed this delivery!' };
	}

	if (isPickup) {
		if (player.storyFlags.has(deliveryFlag)) {
			return { success: false, message: 'You already have an active delivery!' };
		}

		player.storyFlags.add(deliveryFlag);
		return {
			success: true,
			message: `Please deliver this to ${action.targetNpcId}!`,
			deliveryItem: action.deliveryItem,
			targetNpcId: action.targetNpcId,
		};
	} else {
		if (!player.storyFlags.has(deliveryFlag)) {
			return { success: false, message: 'You don\'t have a delivery for me!' };
		}

		player.storyFlags.delete(deliveryFlag);
		if (action.onceOnly) {
			player.storyFlags.add(completedFlag);
		}

		return {
			success: true,
			message: 'Thank you for the delivery!',
		};
	}
}

export function handleConditionalDialogue(
	player: PlayerData,
	action: NPCAction
): { success: boolean, message: string, dialogue: string } {
	if (!action.dialogueConditions || action.dialogueConditions.length === 0) {
		return {
			success: true,
			message: action.defaultDialogue || 'Hello!',
			dialogue: action.defaultDialogue || 'Hello!',
		};
	}

	for (const condition of action.dialogueConditions) {
		if (condition.minBadges && player.obtainedBadges.length < condition.minBadges) {
			continue;
		}
		if (condition.maxBadges && player.obtainedBadges.length > condition.maxBadges) {
			continue;
		}

		if (condition.requiredFlag && !player.storyFlags.has(condition.requiredFlag)) {
			continue;
		}

		if (condition.preventIfFlag && player.storyFlags.has(condition.preventIfFlag)) {
			continue;
		}

		return {
			success: true,
			message: condition.dialogue,
			dialogue: condition.dialogue,
		};
	}

	return {
		success: true,
		message: action.defaultDialogue || 'Hello!',
		dialogue: action.defaultDialogue || 'Hello!',
	};
}

export function handleEscortQuest(
	player: PlayerData,
	action: NPCAction,
	npcId: string,
	currentLocation: string
): { success: boolean, message: string, escorting?: boolean, destination?: string, arrived?: boolean } {
	if (!action.escortDestination) {
		return { success: false, message: 'No escort destination configured.' };
	}

	const escortFlag = `escort_${npcId}_active`;
	const completedFlag = `escort_${npcId}_completed`;

	if (action.onceOnly && player.storyFlags.has(completedFlag)) {
		return { success: false, message: 'You have already completed this escort!' };
	}

	const isEscorting = player.storyFlags.has(escortFlag);

	if (!isEscorting) {
		player.storyFlags.add(escortFlag);
		return {
			success: true,
			message: `Please escort me to ${action.escortDestination}!`,
			escorting: true,
			destination: action.escortDestination,
			arrived: false,
		};
	} else {
		if (currentLocation === action.escortDestination) {
			player.storyFlags.delete(escortFlag);
			if (action.onceOnly) {
				player.storyFlags.add(completedFlag);
			}

			return {
				success: true,
				message: 'Thank you for escorting me safely!',
				escorting: false,
				arrived: true,
			};
		} else {
			return {
				success: false,
				message: `We need to get to ${action.escortDestination}. Keep going!`,
				escorting: true,
				destination: action.escortDestination,
				arrived: false,
			};
		}
	}
}
