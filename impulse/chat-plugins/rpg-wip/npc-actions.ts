/*
* Pokemon Showdown
* RPG NPC Actions Handler
*
* This file implements logic for all NPC action types.
*/

import type { PlayerData, RPGPokemon, NPCAction } from './interface';
import { ITEMS_DATABASE } from './items';
import { createPokemon } from './core';
import { Dex } from '../../../sim/dex';

/**
 * Utility: Parse timestamp from flag string
 * Flags follow format: prefix_suffix_timestamp
 */
function parseTimestampFromFlag(flagStr: string): number {
	const parts = flagStr.split('_');
	const timestamp = parts[parts.length - 1];
	return parseInt(timestamp) || 0;
}

/**
 * Utility: Parse numeric value from flag string
 * Flags follow format: prefix_suffix_number
 */
function parseNumberFromFlag(flagStr: string): number {
	const parts = flagStr.split('_');
	const value = parts[parts.length - 1];
	return parseInt(value) || 0;
}

/**
 * Fossil Revival Action
 * Revives a fossil item into a Pokemon
 */
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

	// Map fossils to Pokemon
	const fossilMap: Record<string, { species: string, level: number }> = {
		'helixfossil': { species: 'omanyte', level: 20 },
		'domefossil': { species: 'kabuto', level: 20 },
		'oldamber': { species: 'aerodactyl', level: 20 },
		'rootfossil': { species: 'lileep', level: 20 },
		'clawfossil': { species: 'anorith', level: 20 },
		'skullfossil': { species: 'cranidos', level: 20 },
		'armorfossil': { species: 'shieldon', level: 20 },
		'coverfossil': { species: 'tirtouga', level: 20 },
		'plumefossil': { species: 'archen', level: 20 },
		'jawfossil': { species: 'tyrunt', level: 20 },
		'sailfossil': { species: 'amaura', level: 20 },
	};

	const fossilData = fossilMap[fossilItemId];
	if (!fossilData) {
		return { success: false, message: 'Unknown fossil type.' };
	}

	// Create the Pokemon
	const revivedPokemon = createPokemon(fossilData.species, fossilData.level);

	// Remove fossil and deduct money
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

/**
 * Daily Reward Action
 * Gives daily rewards to players
 */
export function handleDailyReward(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, rewards?: { itemId: string, quantity: number }[] } {
	if (!action.rewards || action.rewards.length === 0) {
		return { success: false, message: 'No rewards configured.' };
	}

	// Track last claim time using a special flag
	const lastClaimFlag = `dailyreward_${npcId}_lastclaim`;
	const lastClaimStr = Array.from(player.storyFlags).find(f => f.startsWith(lastClaimFlag));

	let lastClaimTime = 0;
	if (lastClaimStr) {
		lastClaimTime = parseTimestampFromFlag(lastClaimStr);
	}

	const now = Date.now();
	const hoursSinceLastClaim = (now - lastClaimTime) / (1000 * 60 * 60);

	if (hoursSinceLastClaim < 24) {
		const hoursRemaining = Math.ceil(24 - hoursSinceLastClaim);
		return {
			success: false,
			message: `You can claim your next reward in ${hoursRemaining} hour(s).`,
		};
	}

	// Calculate streak (days logged in)
	const streakFlag = `dailyreward_${npcId}_streak`;
	const streakStr = Array.from(player.storyFlags).find(f => f.startsWith(streakFlag));
	let streak = 1;
	if (streakStr) {
		streak = parseNumberFromFlag(streakStr) + 1;
		player.storyFlags.delete(streakStr);
	}

	// Give rewards based on streak
	const givenRewards: { itemId: string, quantity: number }[] = [];
	for (const reward of action.rewards) {
		if (!reward.days || streak >= reward.days) {
			givenRewards.push({ itemId: reward.itemId, quantity: reward.quantity });
		}
	}

	// Update flags
	if (lastClaimStr) player.storyFlags.delete(lastClaimStr);
	player.storyFlags.add(`${lastClaimFlag}_${now}`);
	player.storyFlags.add(`${streakFlag}_${streak}`);

	return {
		success: true,
		message: `Daily reward claimed! Streak: ${streak} day(s)`,
		rewards: givenRewards,
	};
}

/**
 * Battle Request Action
 * Challenge player to a battle with cooldown
 */
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

/**
 * Mark battle as completed (call after battle ends)
 */
export function completeBattleRequest(player: PlayerData, npcId: string): void {
	const cooldownFlag = `battlerequest_${npcId}_lastbattle`;
	const lastBattleStr = Array.from(player.storyFlags).find(f => f.startsWith(cooldownFlag));

	if (lastBattleStr) player.storyFlags.delete(lastBattleStr);
	player.storyFlags.add(`${cooldownFlag}_${Date.now()}`);
}

/**
 * Quest Chain Action
 * Multi-stage quest system
 */
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

	// Check if requirements are met
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

/**
 * Advance quest to next stage
 */
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

/**
 * Item Craft Action
 * Combine items to create new items
 */
export function handleItemCraft(
	player: PlayerData,
	action: NPCAction,
	recipeIndex: number
): { success: boolean, message: string, output?: { itemId: string, quantity: number } } {
	if (!action.recipes || recipeIndex >= action.recipes.length) {
		return { success: false, message: 'Invalid recipe.' };
	}

	const recipe = action.recipes[recipeIndex];

	// Check if player has all inputs
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

	// Remove inputs
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

/**
 * Berry Plant Action
 * Plant berries that grow over time
 */
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

	// Check if already planted
	const plantFlag = `berryplant_${npcId}_planted`;
	if (Array.from(player.storyFlags).some(f => f.startsWith(plantFlag))) {
		return { success: false, message: 'A berry is already growing here!' };
	}

	// Plant the berry
	berry.quantity -= 1;
	if (berry.quantity === 0) {
		player.inventory.delete(berryId);
	}

	const growthTime = action.growthTime || 48; // hours
	const readyTime = Date.now() + (growthTime * 60 * 60 * 1000);
	player.storyFlags.add(`${plantFlag}_${readyTime}`);

	return {
		success: true,
		message: `Planted ${berryId}! It will be ready in ${growthTime} hours.`,
	};
}

/**
 * Check and harvest berry if ready
 */
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

/**
 * Pokemon Grooming Action
 * Groom Pokemon to increase friendship
 */
export function handlePokemonGrooming(
	player: PlayerData,
	action: NPCAction,
	pokemon: RPGPokemon
): { success: boolean, message: string, friendshipGain?: number } {
	const cost = action.groomingCost || 500;
	if (player.money < cost) {
		return { success: false, message: `Grooming costs ₽${cost}.` };
	}

	if (pokemon.friendship >= 255) {
		return { success: false, message: 'This Pokemon already has maximum friendship!' };
	}

	player.money -= cost;
	const boost = action.friendshipBoost || 10;
	pokemon.friendship = Math.min(255, pokemon.friendship + boost);

	return {
		success: true,
		message: `${pokemon.nickname} enjoyed the grooming!`,
		friendshipGain: boost,
	};
}

/**
 * Fortune Teller Action
 * Tell fortunes that provide temporary boosts
 */
export function handleFortuneTeller(
	player: PlayerData,
	action: NPCAction,
	npcId: string,
	fortuneType: string
): { success: boolean, message: string, fortune?: string } {
	if (!action.fortuneTypes?.includes(fortuneType)) {
		return { success: false, message: 'This fortune is not available.' };
	}

	const cost = 1000; // Fixed cost for fortune
	if (player.money < cost) {
		return { success: false, message: `A fortune reading costs ₽${cost}.` };
	}

	// Check if fortune is already active
	const fortuneFlag = `fortune_${fortuneType}_active`;
	const existingFortune = Array.from(player.storyFlags).find(f => f.startsWith(fortuneFlag));
	if (existingFortune) {
		return { success: false, message: 'You already have an active fortune of this type!' };
	}

	player.money -= cost;

	const duration = action.fortuneDuration || 24; // hours
	const expiryTime = Date.now() + (duration * 60 * 60 * 1000);
	player.storyFlags.add(`${fortuneFlag}_${expiryTime}`);

	const fortunes: Record<string, string> = {
		'luck': 'Your luck will shine today! Shiny encounter rate increased!',
		'battle': 'Victory awaits you! Battle rewards increased!',
		'catch': 'The Pokemon will come to you! Catch rate increased!',
	};

	return {
		success: true,
		message: `Fortune told! Effect lasts ${duration} hours.`,
		fortune: fortunes[fortuneType] || 'Your future looks bright!',
	};
}

/**
 * Check if fortune is active
 */
export function checkActiveFortune(player: PlayerData, fortuneType: string): boolean {
	const fortuneFlag = `fortune_${fortuneType}_active`;
	const fortuneStr = Array.from(player.storyFlags).find(f => f.startsWith(fortuneFlag));

	if (!fortuneStr) return false;

	const expiryTime = parseInt(fortuneStr.split('_').pop() || '0');
	const now = Date.now();

	if (now >= expiryTime) {
		player.storyFlags.delete(fortuneStr);
		return false;
	}

	return true;
}

/**
 * Pokemon Breeder Action
 * Breed Pokemon to produce eggs (simplified)
 */
export function handlePokemonBreeder(
	player: PlayerData,
	action: NPCAction,
	pokemon1: RPGPokemon,
	pokemon2: RPGPokemon
): { success: boolean, message: string, eggSpecies?: string } {
	const cost = action.breedingCost || 10000;
	if (player.money < cost) {
		return { success: false, message: `Breeding costs ₽${cost}.` };
	}

	// Check genders
	if (pokemon1.gender === pokemon2.gender && pokemon1.gender !== 'N') {
		return { success: false, message: 'These Pokemon cannot breed together (same gender).' };
	}

	if (pokemon1.gender === 'N' && pokemon2.gender === 'N') {
		return { success: false, message: 'These Pokemon cannot breed together (both genderless).' };
	}

	// Check species compatibility (simplified - same evolution line)
	const species1 = Dex.species.get(pokemon1.species);
	const species2 = Dex.species.get(pokemon2.species);

	if (species1.baseSpecies !== species2.baseSpecies && pokemon1.species !== pokemon2.species) {
		return { success: false, message: 'These Pokemon are not compatible for breeding.' };
	}

	player.money -= cost;

	// Determine egg species (always the female's species, or the non-Ditto species)
	let eggSpecies = pokemon1.species;
	if (pokemon1.species === 'Ditto') eggSpecies = pokemon2.species;
	if (pokemon2.species === 'Ditto') eggSpecies = pokemon1.species;
	if (pokemon1.gender === 'F') eggSpecies = pokemon1.species;
	if (pokemon2.gender === 'F') eggSpecies = pokemon2.species;

	return {
		success: true,
		message: `Breeding started! Check back later for an egg.`,
		eggSpecies,
	};
}

/**
 * Move Relearner Action
 * Relearn moves
 */
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

	// Check if Pokemon already knows this move
	if (pokemon.moves.some(m => m.id === moveId)) {
		return { success: false, message: `${pokemon.nickname} already knows this move!` };
	}

	// Check if move is in learnset
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

/**
 * Ability Capsule Action
 * Change Pokemon's ability
 */
export function handleAbilityCapsule(
	player: PlayerData,
	action: NPCAction,
	pokemon: RPGPokemon
): { success: boolean, message: string, newAbility?: string } {
	const cost = action.capsuleCost || 20000;
	if (player.money < cost) {
		return { success: false, message: `Ability change costs ₽${cost}.` };
	}

	const species = Dex.species.get(pokemon.species);
	const abilities = Object.values(species.abilities).filter(a => a !== 'H'); // Exclude hidden ability

	if (abilities.length <= 1) {
		return { success: false, message: 'This Pokemon has only one regular ability!' };
	}

	// Find the other ability
	const currentAbility = pokemon.ability;
	const newAbility = abilities.find(a => a !== currentAbility) || abilities[0];

	player.money -= cost;
	pokemon.ability = newAbility;

	return {
		success: true,
		message: `${pokemon.nickname}'s ability changed to ${newAbility}!`,
		newAbility,
	};
}

/**
 * EV Trainer Action
 * Train specific EVs
 */
export function handleEVTrainer(
	player: PlayerData,
	action: NPCAction,
	pokemon: RPGPokemon,
	stat: string
): { success: boolean, message: string, evGain?: number } {
	if (!action.evStat || stat !== action.evStat) {
		return { success: false, message: 'This trainer specializes in different stats.' };
	}

	const evAmount = action.evAmount || 10;
	const costPerEV = action.evCost || 100;
	const totalCost = costPerEV * evAmount;

	if (player.money < totalCost) {
		return { success: false, message: `Training ${evAmount} EVs costs ₽${totalCost}.` };
	}

	// Validate stat is a valid EV key
	type EVKey = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';
	const validEVKeys: EVKey[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
	if (!validEVKeys.includes(stat as EVKey)) {
		return { success: false, message: 'Invalid stat specified.' };
	}

	// Check current EVs
	const evKey = stat as EVKey;
	const currentEVs = pokemon.evs[evKey] || 0;
	const totalEVs = Object.values(pokemon.evs).reduce((sum, ev) => sum + ev, 0);

	if (currentEVs >= 252) {
		return { success: false, message: 'This stat is already maxed out at 252 EVs!' };
	}

	if (totalEVs >= 510) {
		return { success: false, message: 'This Pokemon has reached the total EV limit of 510!' };
	}

	const canGain = Math.min(evAmount, 252 - currentEVs, 510 - totalEVs);
	if (canGain === 0) {
		return { success: false, message: 'Cannot gain any more EVs!' };
	}

	player.money -= costPerEV * canGain;
	pokemon.evs[evKey] = currentEVs + canGain;

	return {
		success: true,
		message: `${pokemon.nickname} gained ${canGain} ${stat.toUpperCase()} EVs!`,
		evGain: canGain,
	};
}

/**
 * IV Checker Action
 * Check Pokemon's IVs
 */
export function handleIVChecker(
	pokemon: RPGPokemon
): { success: boolean, message: string, ivs: typeof pokemon.ivs } {
	return {
		success: true,
		message: `${pokemon.nickname}'s Individual Values (IVs):`,
		ivs: pokemon.ivs,
	};
}

/**
 * Mystery Gift Action
 * Distribute special mystery gifts
 */
export function handleMysteryGift(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, gift?: any } {
	if (!action.mysteryGiftId) {
		return { success: false, message: 'No mystery gift configured.' };
	}

	const giftFlag = `mysterygift_${action.mysteryGiftId}_claimed`;
	if (player.storyFlags.has(giftFlag)) {
		return { success: false, message: 'You have already claimed this mystery gift!' };
	}

	player.storyFlags.add(giftFlag);

	return {
		success: true,
		message: 'Mystery gift claimed!',
		gift: action.giftContents,
	};
}

/**
 * Lottery Action
 * Run lottery system with prizes
 */
export function handleLottery(
	player: PlayerData,
	action: NPCAction
): { success: boolean, message: string, prize?: { itemId: string, quantity: number } } {
	const ticketCost = action.lotteryTicketCost || 1000;
	if (player.money < ticketCost) {
		return { success: false, message: `A lottery ticket costs ₽${ticketCost}.` };
	}

	if (!action.lotteryPrizes || action.lotteryPrizes.length === 0) {
		return { success: false, message: 'No prizes configured.' };
	}

	player.money -= ticketCost;

	// Determine prize based on chances
	const roll = Math.random();
	let cumulativeChance = 0;

	for (const prize of action.lotteryPrizes) {
		cumulativeChance += prize.chance;
		if (roll <= cumulativeChance) {
			return {
				success: true,
				message: 'You won a prize!',
				prize: { itemId: prize.itemId, quantity: 1 },
			};
		}
	}

	return {
		success: true,
		message: 'Better luck next time!',
	};
}

/**
 * Masseuse Action
 * Give Pokemon massages for friendship
 */
export function handleMasseuse(
	player: PlayerData,
	action: NPCAction,
	pokemon: RPGPokemon
): { success: boolean, message: string, friendshipGain?: number } {
	const cost = action.massageCost || 800;
	if (player.money < cost) {
		return { success: false, message: `A massage costs ₽${cost}.` };
	}

	if (pokemon.friendship >= 255) {
		return { success: false, message: 'This Pokemon already has maximum friendship!' };
	}

	player.money -= cost;
	const boost = action.massageFriendshipBoost || 15;
	pokemon.friendship = Math.min(255, pokemon.friendship + boost);

	return {
		success: true,
		message: `${pokemon.nickname} loved the massage!`,
		friendshipGain: boost,
	};
}

/**
 * Hair Cutter Action
 * Give Pokemon haircuts for friendship
 */
export function handleHairCutter(
	player: PlayerData,
	action: NPCAction,
	pokemon: RPGPokemon
): { success: boolean, message: string, friendshipGain?: number } {
	const cost = action.haircutCost || 600;
	if (player.money < cost) {
		return { success: false, message: `A haircut costs ₽${cost}.` };
	}

	if (pokemon.friendship >= 255) {
		return { success: false, message: 'This Pokemon already has maximum friendship!' };
	}

	player.money -= cost;
	const boost = action.haircutFriendshipBoost || 12;
	pokemon.friendship = Math.min(255, pokemon.friendship + boost);

	return {
		success: true,
		message: `${pokemon.nickname} looks great with a new haircut!`,
		friendshipGain: boost,
	};
}

/**
 * Photographer Action
 * Take photos of Pokemon for rewards
 */
export function handlePhotographer(
	player: PlayerData,
	action: NPCAction,
	pokemon: RPGPokemon,
	npcId: string
): { success: boolean, message: string, reward?: { itemId: string, quantity: number } } {
	const cost = action.photographyCost || 500;
	if (player.money < cost) {
		return { success: false, message: `A photo session costs ₽${cost}.` };
	}

	// Check if this Pokemon has already been photographed by this NPC
	const photoFlag = `photo_${npcId}_${pokemon.id}`;
	if (player.storyFlags.has(photoFlag)) {
		return { success: false, message: 'You have already photographed this Pokemon!' };
	}

	player.money -= cost;
	player.storyFlags.add(photoFlag);

	return {
		success: true,
		message: `Beautiful photo of ${pokemon.nickname}!`,
		reward: action.photoReward,
	};
}
