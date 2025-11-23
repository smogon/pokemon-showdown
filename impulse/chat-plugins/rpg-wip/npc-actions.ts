import type { PlayerData, RPGPokemon, NPCAction } from './interface';
import { ITEMS_DATABASE } from './items';
import { createPokemon } from './core';
import { Dex } from '../../../sim/dex';
import { FOSSIL_REVIVAL_MAP } from './game-config';

function parseTimestampFromFlag(flagStr: string): number {
	const parts = flagStr.split('_');
	const timestamp = parts[parts.length - 1];
	return parseInt(timestamp) || 0;
}

function parseNumberFromFlag(flagStr: string): number {
	const parts = flagStr.split('_');
	const value = parts[parts.length - 1];
	return parseInt(value) || 0;
}

export function handleFossilRevival(
	player: PlayerData,
	action: NPCAction,
	fossilItemId: string
): { success: boolean, message: string, pokemon?: RPGPokemon } {
	if (!action.fossils?.includes(fossilItemId)) {
		return { success: false, message: 'This NPC cannot revive that fossil.' };
	}

	const fossilItem = player.inventory.get(fossilItemId);
	if (!fossilItem || fossilItem.quantity < 1) {
		return { success: false, message: 'You do not have that fossil.' };
	}

	const revivalCost = action.revivalCost || 1500;
	if (player.money < revivalCost) {
		return { success: false, message: `You need ₽${revivalCost} to revive this fossil.` };
	}

	const fossilData = FOSSIL_REVIVAL_MAP[fossilItemId];
	if (!fossilData) {
		return { success: false, message: 'Unknown fossil type.' };
	}

	const revivedPokemon = createPokemon(fossilData.species, fossilData.level);

	fossilItem.quantity -= 1;
	if (fossilItem.quantity === 0) {
		player.inventory.delete(fossilItemId);
	}
	player.money -= revivalCost;

	return {
		success: true,
		message: `Successfully revived ${revivedPokemon.species} from the fossil!`,
		pokemon: revivedPokemon,
	};
}

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

export function handleItemCraft(
	player: PlayerData,
	action: NPCAction,
	recipeIndex: number
): { success: boolean, message: string, output?: { itemId: string, quantity: number } } {
	if (!action.recipes || recipeIndex >= action.recipes.length) {
		return { success: false, message: 'Invalid recipe.' };
	}

	const recipe = action.recipes[recipeIndex];

	for (const input of recipe.inputs) {
		const item = player.inventory.get(input.itemId);
		if (!item || item.quantity < input.quantity) {
			const itemName = ITEMS_DATABASE[input.itemId]?.name || input.itemId;
			return {
				success: false,
				message: `You need ${input.quantity}x ${itemName} to craft this item.`,
			};
		}
	}

	for (const input of recipe.inputs) {
		const item = player.inventory.get(input.itemId)!;
		item.quantity -= input.quantity;
		if (item.quantity === 0) {
			player.inventory.delete(input.itemId);
		}
	}

	return {
		success: true,
		message: 'Successfully crafted item!',
		output: recipe.output,
	};
}

export function handleBerryPlant(
	player: PlayerData,
	action: NPCAction,
	npcId: string,
	berryId: string
): { success: boolean, message: string } {
	if (!action.berryId || berryId !== action.berryId) {
		return { success: false, message: 'This NPC cannot plant that berry.' };
	}

	const berry = player.inventory.get(berryId);
	if (!berry || berry.quantity < 1) {
		return { success: false, message: 'You do not have that berry.' };
	}

	const plantFlag = `berryplant_${npcId}_planted`;
	if (Array.from(player.storyFlags).some(f => f.startsWith(plantFlag))) {
		return { success: false, message: 'A berry is already growing here!' };
	}

	berry.quantity -= 1;
	if (berry.quantity === 0) {
		player.inventory.delete(berryId);
	}

	const growthTime = action.growthTime || 48;
	const readyTime = Date.now() + (growthTime * 60 * 60 * 1000);
	player.storyFlags.add(`${plantFlag}_${readyTime}`);

	return {
		success: true,
		message: `Planted ${berryId}! It will be ready in ${growthTime} hours.`,
	};
}

export function checkBerryHarvest(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { canHarvest: boolean, hoursRemaining?: number, yield?: number } {
	const plantFlag = `berryplant_${npcId}_planted`;
	const plantedStr = Array.from(player.storyFlags).find(f => f.startsWith(plantFlag));

	if (!plantedStr) {
		return { canHarvest: false };
	}

	const readyTime = parseInt(plantedStr.split('_').pop() || '0');
	const now = Date.now();

	if (now >= readyTime) {
		player.storyFlags.delete(plantedStr);
		return {
			canHarvest: true,
			yield: action.yieldQuantity || 5,
		};
	}

	const hoursRemaining = Math.ceil((readyTime - now) / (1000 * 60 * 60));
	return {
		canHarvest: false,
		hoursRemaining,
	};
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

export function handleFishing(
	player: PlayerData,
	action: NPCAction
): { success: boolean, message: string, rodType?: string } {
	const rodType = action.fishingRodType || 'old';
	const cost = action.fishingRodCost || 0;

	if (cost > 0 && player.money < cost) {
		return { success: false, message: `A ${rodType} Rod costs ₽${cost}.` };
	}

	if (cost > 0) player.money -= cost;

	return {
		success: true,
		message: `You received a ${rodType.charAt(0).toUpperCase() + rodType.slice(1)} Rod!`,
		rodType,
	};
}

export function handleBikeShop(
	player: PlayerData,
	action: NPCAction
): { success: boolean, message: string, bikeType?: string } {
	const bikeType = action.bikeType || 'regular';
	const cost = action.bikeCost || 0;

	if (cost > 0 && player.money < cost) {
		return { success: false, message: `A ${bikeType} Bike costs ₽${cost}.` };
	}

	if (cost > 0) player.money -= cost;

	return {
		success: true,
		message: `You received a ${bikeType.charAt(0).toUpperCase() + bikeType.slice(1)} Bike!`,
		bikeType,
	};
}

export function handleApricornCrafter(
	player: PlayerData,
	action: NPCAction,
	apricorn: string
): { success: boolean, message: string, ball?: string } {
	const recipe = action.apricornRecipes?.find(r => r.apricorn === apricorn);
	if (!recipe) {
		return { success: false, message: 'Cannot craft a ball from that Apricorn.' };
	}

	const cost = action.craftingCost || 0;
	if (cost > 0 && player.money < cost) {
		return { success: false, message: `Crafting costs ₽${cost}.` };
	}

	if (cost > 0) player.money -= cost;

	return {
		success: true,
		message: `Crafted a ${recipe.resultBall} from ${apricorn}!`,
		ball: recipe.resultBall,
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

export function handleGymRematch(
	player: PlayerData,
	action: NPCAction,
	gymLeaderId: string
): { success: boolean, message: string, rematchTeam?: any[] } {
	if (!action.rematchAvailable) {
		return { success: false, message: 'This gym leader is not available for a rematch.' };
	}

	return {
		success: true,
		message: `The gym leader accepts your rematch challenge!`,
		rematchTeam: action.rematchTeam,
	};
}

export function handleShardTrader(
	player: PlayerData,
	action: NPCAction,
	shardColor: string
): { success: boolean, message: string, moveId?: string, itemId?: string } {
	const trade = action.shardTrades?.find(t => t.shardColor === shardColor);
	if (!trade) {
		return { success: false, message: 'That shard cannot be traded here.' };
	}

	return {
		success: true,
		message: `Traded ${shardColor} Shard!`,
		moveId: trade.moveId,
		itemId: trade.itemId,
	};
}

export function handleScaleCollector(
	player: PlayerData,
	action: NPCAction
): { success: boolean, message: string, reward?: { itemId: string, quantity: number } } {
	return {
		success: true,
		message: `Collected ${action.scaleType || 'Heart'} Scale!`,
		reward: action.scaleReward,
	};
}

export function handleOPower(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, powerType?: string, duration?: number } {
	const powerFlag = `opower_${npcId}_${Date.now()}`;
	player.storyFlags.add(powerFlag);

	return {
		success: true,
		message: `You received ${action.opowerType || 'Attack'} O-Power!`,
		powerType: action.opowerType,
		duration: action.opowerDuration,
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

export function handleTimeBasedAction(
	player: PlayerData,
	action: NPCAction
): { success: boolean, message: string, isAvailable: boolean, nextAvailableIn?: number } {
	if (!action.availableHours || action.availableHours.length === 0) {
		return { success: true, message: 'Always available', isAvailable: true };
	}

	const currentHour = new Date().getHours();
	const isAvailable = action.availableHours.includes(currentHour);

	if (!isAvailable) {
		const nextHour = action.availableHours.find(h => h > currentHour) || action.availableHours[0];
		let hoursUntil = nextHour - currentHour;
		if (hoursUntil < 0) hoursUntil += 24;

		return {
			success: false,
			message: `This is not available right now. Come back in ${hoursUntil} hour(s).`,
			isAvailable: false,
			nextAvailableIn: hoursUntil,
		};
	}

	return {
		success: true,
		message: 'Available now!',
		isAvailable: true,
	};
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

export function handleAchievement(
	player: PlayerData,
	action: NPCAction,
	achievementId: string
): { success: boolean, message: string, unlocked: boolean, reward?: any } {
	if (!action.achievements?.[achievementId]) {
		return { success: false, message: 'Achievement not found.' };
	}

	const achievement = action.achievements[achievementId];
	const achievementFlag = `achievement_${achievementId}_unlocked`;

	if (player.storyFlags.has(achievementFlag)) {
		return {
			success: false,
			message: 'You have already unlocked this achievement!',
			unlocked: true,
		};
	}

	if (achievement.requiredFlag && !player.storyFlags.has(achievement.requiredFlag)) {
		return {
			success: false,
			message: 'Achievement requirements not met.',
			unlocked: false,
		};
	}

	player.storyFlags.add(achievementFlag);

	return {
		success: true,
		message: `Achievement unlocked: ${achievement.name}!`,
		unlocked: true,
		reward: achievement.reward,
	};
}

export function handleBattleGauntlet(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, currentBattle?: number, totalBattles?: number, trainerIds?: string[] } {
	if (!action.gauntletTrainers || action.gauntletTrainers.length === 0) {
		return { success: false, message: 'No battle gauntlet configured.' };
	}

	const gauntletFlag = `gauntlet_${npcId}_battle`;
	const battleStr = Array.from(player.storyFlags).find(f => f.startsWith(gauntletFlag));

	let currentBattle = 0;
	if (battleStr) {
		const parts = battleStr.split('_');
		currentBattle = parseInt(parts[parts.length - 1]) || 0;
	}

	if (currentBattle >= action.gauntletTrainers.length) {
		return {
			success: false,
			message: 'You have completed the battle gauntlet!',
			currentBattle,
			totalBattles: action.gauntletTrainers.length,
		};
	}

	return {
		success: true,
		message: `Battle ${currentBattle + 1} of ${action.gauntletTrainers.length}`,
		currentBattle,
		totalBattles: action.gauntletTrainers.length,
		trainerIds: action.gauntletTrainers,
	};
}

export function advanceBattleGauntlet(player: PlayerData, npcId: string): void {
	const gauntletFlag = `gauntlet_${npcId}_battle`;
	const battleStr = Array.from(player.storyFlags).find(f => f.startsWith(gauntletFlag));

	let currentBattle = 0;
	if (battleStr) {
		currentBattle = parseInt(battleStr.split('_').pop() || '0');
		player.storyFlags.delete(battleStr);
	}

	player.storyFlags.add(`${gauntletFlag}_${currentBattle + 1}`);
}

export function handleBattleArena(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, wins?: number, rank?: string, nextOpponent?: string } {
	if (!action.arenaOpponents || action.arenaOpponents.length === 0) {
		return { success: false, message: 'No arena opponents configured.' };
	}

	const winsFlag = `arena_${npcId}_wins`;
	const winsStr = Array.from(player.storyFlags).find(f => f.startsWith(winsFlag));

	let wins = 0;
	if (winsStr) {
		wins = parseInt(winsStr.split('_').pop() || '0');
	}

	let rank = 'Novice';
	if (wins >= 50) rank = 'Champion';
	else if (wins >= 30) rank = 'Master';
	else if (wins >= 20) rank = 'Expert';
	else if (wins >= 10) rank = 'Veteran';
	else if (wins >= 5) rank = 'Skilled';

	const opponentIndex = Math.min(Math.floor(wins / 5), action.arenaOpponents.length - 1);
	const nextOpponent = action.arenaOpponents[opponentIndex];

	return {
		success: true,
		message: `Arena Rank: ${rank} (${wins} wins)`,
		wins,
		rank,
		nextOpponent,
	};
}

export function recordArenaWin(player: PlayerData, npcId: string): void {
	const winsFlag = `arena_${npcId}_wins`;
	const winsStr = Array.from(player.storyFlags).find(f => f.startsWith(winsFlag));

	let wins = 0;
	if (winsStr) {
		wins = parseInt(winsStr.split('_').pop() || '0');
		player.storyFlags.delete(winsStr);
	}

	player.storyFlags.add(`${winsFlag}_${wins + 1}`);
}

export function handleTrainingBattle(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, trainerId?: string, canBattle: boolean, attempts?: number } {
	if (!action.trainerId) {
		return { success: false, message: 'No training battle configured.', canBattle: false };
	}

	const attemptsFlag = `training_${npcId}_attempts`;
	const attemptsStr = Array.from(player.storyFlags).find(f => f.startsWith(attemptsFlag));

	let attempts = 0;
	if (attemptsStr) {
		attempts = parseInt(attemptsStr.split('_').pop() || '0');
	}

	const maxAttempts = action.maxAttempts || 999;
	if (attempts >= maxAttempts) {
		return {
			success: false,
			message: 'You have reached the maximum training attempts.',
			canBattle: false,
			attempts,
		};
	}

	return {
		success: true,
		message: `Training battle available (Attempt ${attempts + 1})`,
		trainerId: action.trainerId,
		canBattle: true,
		attempts,
	};
}

export function recordTrainingAttempt(player: PlayerData, npcId: string): void {
	const attemptsFlag = `training_${npcId}_attempts`;
	const attemptsStr = Array.from(player.storyFlags).find(f => f.startsWith(attemptsFlag));

	let attempts = 0;
	if (attemptsStr) {
		attempts = parseInt(attemptsStr.split('_').pop() || '0');
		player.storyFlags.delete(attemptsStr);
	}

	player.storyFlags.add(`${attemptsFlag}_${attempts + 1}`);
}

export function handleBattleChallenge(
	player: PlayerData,
	action: NPCAction
): { success: boolean, message: string, rules?: string[], trainerId?: string } {
	if (!action.trainerId || !action.challengeRules) {
		return { success: false, message: 'No battle challenge configured.' };
	}

	const rulesText = action.challengeRules.map(rule => {
		const ruleDescriptions: Record<string, string> = {
			'no_items': 'No items allowed',
			'level_cap': `Level ${action.levelCap || 50} cap`,
			'type_restriction': `Only ${action.allowedTypes?.join('/')} types`,
			'monotype': 'All Pokemon must share a type',
			'single_pokemon': 'Single Pokemon only',
			'no_legends': 'No legendary Pokemon',
			'inverse': 'Type effectiveness reversed',
		};
		return ruleDescriptions[rule] || rule;
	});

	return {
		success: true,
		message: 'Special battle challenge!',
		rules: rulesText,
		trainerId: action.trainerId,
	};
}

export function handleSurvivalBattle(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, currentStreak?: number, bestStreak?: number, nextOpponent?: string } {
	if (!action.survivalOpponents || action.survivalOpponents.length === 0) {
		return { success: false, message: 'No survival battle configured.' };
	}

	const streakFlag = `survival_${npcId}_streak`;
	const bestFlag = `survival_${npcId}_best`;

	const streakStr = Array.from(player.storyFlags).find(f => f.startsWith(streakFlag));
	const bestStr = Array.from(player.storyFlags).find(f => f.startsWith(bestFlag));

	let currentStreak = 0;
	let bestStreak = 0;

	if (streakStr) {
		currentStreak = parseInt(streakStr.split('_').pop() || '0');
	}
	if (bestStr) {
		bestStreak = parseInt(bestStr.split('_').pop() || '0');
	}

	const opponentIndex = Math.min(currentStreak, action.survivalOpponents.length - 1);
	const nextOpponent = action.survivalOpponents[opponentIndex];

	return {
		success: true,
		message: `Current Streak: ${currentStreak} | Best: ${bestStreak}`,
		currentStreak,
		bestStreak,
		nextOpponent,
	};
}

export function recordSurvivalResult(player: PlayerData, npcId: string, won: boolean): void {
	const streakFlag = `survival_${npcId}_streak`;
	const bestFlag = `survival_${npcId}_best`;

	const streakStr = Array.from(player.storyFlags).find(f => f.startsWith(streakFlag));
	const bestStr = Array.from(player.storyFlags).find(f => f.startsWith(bestFlag));

	let currentStreak = 0;
	let bestStreak = 0;

	if (streakStr) {
		currentStreak = parseInt(streakStr.split('_').pop() || '0');
		player.storyFlags.delete(streakStr);
	}
	if (bestStr) {
		bestStreak = parseInt(bestStr.split('_').pop() || '0');
		player.storyFlags.delete(bestStr);
	}

	if (won) {
		currentStreak += 1;
		if (currentStreak > bestStreak) {
			bestStreak = currentStreak;
		}
	} else {
		currentStreak = 0;
	}

	player.storyFlags.add(`${streakFlag}_${currentStreak}`);
	player.storyFlags.add(`${bestFlag}_${bestStreak}`);
}

export function handleRematchTracker(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, canRematch: boolean, timesDefeated?: number, rematchLevel?: number } {
	if (!action.trainerId) {
		return { success: false, message: 'No rematch trainer configured.', canRematch: false };
	}

	const defeatedFlag = `rematch_${npcId}_defeated`;
	const defeatedStr = Array.from(player.storyFlags).find(f => f.startsWith(defeatedFlag));

	let timesDefeated = 0;
	if (defeatedStr) {
		timesDefeated = parseInt(defeatedStr.split('_').pop() || '0');
	}

	const maxRematches = action.maxRematches || 999;
	if (timesDefeated >= maxRematches) {
		return {
			success: false,
			message: 'No more rematches available.',
			canRematch: false,
			timesDefeated,
		};
	}

	const rematchLevel = (action.baseLevel || 50) + (timesDefeated * (action.levelIncrease || 5));

	return {
		success: true,
		message: `Rematch #${timesDefeated + 1} available`,
		canRematch: true,
		timesDefeated,
		rematchLevel,
	};
}

export function recordRematch(player: PlayerData, npcId: string): void {
	const defeatedFlag = `rematch_${npcId}_defeated`;
	const defeatedStr = Array.from(player.storyFlags).find(f => f.startsWith(defeatedFlag));

	let timesDefeated = 0;
	if (defeatedStr) {
		timesDefeated = parseInt(defeatedStr.split('_').pop() || '0');
		player.storyFlags.delete(defeatedStr);
	}

	player.storyFlags.add(`${defeatedFlag}_${timesDefeated + 1}`);
}
