/*
* Pokemon Showdown
* RPG NPC Actions Handler
*
* This file implements logic for all NPC action types.
*
* All handlers are exported and can be imported individually or as a namespace:
*   import * as NPCActions from './npc-actions';
*   import { handleHeal, handleChooseStarter } from './npc-actions';
*
* Available NPC Action Handlers (40+ handlers):
*  - handleFossilRevival: Revive fossils into Pokemon
*  - handleDailyReward: Daily login rewards system
*  - handleBattleRequest: NPC battle challenges with cooldowns
*  - completeBattleRequest: Mark battle as completed
*  - handleQuestChain: Multi-stage quest system
*  - advanceQuestStage: Progress quest to next stage
*  - handleItemCraft: Combine items to create new ones
*  - handleBerryPlant: Plant berries that grow over time
*  - checkBerryHarvest: Check and harvest berries
*  - handlePokemonGrooming: Groom Pokemon for friendship
*  - handleFortuneTeller: Fortune telling for temporary boosts
*  - checkActiveFortune: Check if fortune is active
*  - handlePokemonBreeder: Breed Pokemon to produce eggs
*  - handleMoveRelearner: Relearn moves from learnset
*  - handleAbilityCapsule: Change Pokemon ability
*  - handleEVTrainer: Train specific EVs
*  - handleIVChecker: Check Pokemon IVs
*  - handleMysteryGift: Distribute special mystery gifts
*  - handleLottery: Lottery system with prizes
*  - handleMasseuse: Massages for friendship
*  - handleHairCutter: Haircuts for friendship
*  - handleFishing: Give or use fishing rods
*  - handleBikeShop: Purchase bikes
*  - handleCoinExchange: Exchange money for coins
*  - handleTutorCombo: Teach multiple moves
*  - handleApricornCrafter: Craft Pokeballs from Apricorns
*  - handlePokeathlon: Pokeathlon events
*  - handleBerryBlender: Blend berries together
*  - handlePokeblockMixer: Mix berries into Pokeblocks
*  - handlePoffinCooking: Cook berries into Poffins
*  - handleRivalBattle: Trigger rival battles
*  - handleGymRematch: Rematch gym leaders
*  - handleShardTrader: Trade shards for moves/items
*  - handleWingCollector: Collect wings for stat boosts
*  - handleScaleCollector: Collect scales for rewards
*  - handleOPower: Distribute O-Powers
*  - handleHeal: Heal all Pokemon to full health
*  - handleChooseStarter: Handle starter Pokemon selection
*  - handleCollectionQuest: Quest to collect specific items
*  - handleReputation: Manage faction/town reputation
*  - addReputationPoints: Add reputation points
*  - handleDeliveryQuest: Deliver items to other NPCs
*  - handleTimeBasedAction: Actions available at certain times
*  - handleConditionalDialogue: Dynamic dialogue based on progress
*  - handleEscortQuest: Escort NPCs to locations
*  - handleAchievement: Track and reward achievements
*  - handleBattleGauntlet: Consecutive battle challenges
*  - advanceBattleGauntlet: Progress to next gauntlet battle
*  - handleBattleArena: Repeatable arena battles with rankings
*  - recordArenaWin: Record arena victory
*  - handleTrainingBattle: Practice battles for story
*  - recordTrainingAttempt: Track training attempts
*  - handleBattleChallenge: Special condition battles
*  - handleSurvivalBattle: Win streak battle system
*  - recordSurvivalResult: Record survival win/loss
*  - handleRematchTracker: Manage trainer rematches
*  - recordRematch: Record rematch completion
*
* Usage in npcs.ts:
*   Define NPCs with action types that match these handlers.
*   The handler will be automatically called by commands.ts when
*   the player interacts with the NPC.
*/

import type { PlayerData, RPGPokemon, NPCAction } from './interface';
import { ITEMS_DATABASE } from './items';
import { createPokemon } from './lib/pokemon';
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
 * Fishing Action
 * Give or use fishing rods
 */
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

/**
 * Bike Shop Action
 * Purchase bikes
 */
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

/**
 * Coin Exchange Action
 * Exchange money for coins or buy prizes
 */
export function handleCoinExchange(
	player: PlayerData,
	action: NPCAction,
	mode: 'buy' | 'redeem',
	itemIdOrAmount?: string | number
): { success: boolean, message: string, coins?: number, item?: string } {
	if (mode === 'buy' && typeof itemIdOrAmount === 'number') {
		const coinsToBuy = itemIdOrAmount;
		const rate = action.coinRate || 50; // Default: 50 coins per money unit
		const cost = Math.ceil(coinsToBuy / rate);

		if (player.money < cost) {
			return { success: false, message: `You need ₽${cost} to buy ${coinsToBuy} coins.` };
		}

		player.money -= cost;
		return { success: true, message: `You bought ${coinsToBuy} coins!`, coins: coinsToBuy };
	} else if (mode === 'redeem' && typeof itemIdOrAmount === 'string') {
		const prize = action.prizeList?.find(p => p.itemId === itemIdOrAmount);
		if (!prize) {
			return { success: false, message: 'That item is not available.' };
		}

		// Assume coins are tracked in player inventory or flags (implementation detail)
		return {
			success: true,
			message: `You redeemed ${prize.itemId} for ${prize.coinCost} coins!`,
			item: prize.itemId,
		};
	}

	return { success: false, message: 'Invalid coin exchange operation.' };
}

/**
 * Tutor Combo Action
 * Teach multiple moves
 */
export function handleTutorCombo(
	player: PlayerData,
	action: NPCAction,
	pokemon: RPGPokemon,
	moveId: string
): { success: boolean, message: string } {
	if (!action.comboMoves?.includes(moveId)) {
		return { success: false, message: 'This move is not available from this tutor.' };
	}

	const cost = action.comboMoveCost || 0;
	if (cost > 0 && player.money < cost) {
		return { success: false, message: `Teaching this move costs ₽${cost}.` };
	}

	if (cost > 0) player.money -= cost;

	return {
		success: true,
		message: `${pokemon.nickname} learned ${moveId}!`,
	};
}

/**
 * Apricorn Crafter Action
 * Craft Pokeballs from Apricorns
 */
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

/**
 * Pokeathlon Action
 * Participate in Pokeathlon events
 */
export function handlePokeathlon(
	player: PlayerData,
	action: NPCAction,
	eventName: string,
	score: number
): { success: boolean, message: string, reward?: { itemId: string, quantity: number } } {
	if (!action.pokeathlonEvents?.includes(eventName)) {
		return { success: false, message: 'That event is not available.' };
	}

	const reward = action.pokeathlonRewards?.find(r => r.score <= score);

	return {
		success: true,
		message: `You scored ${score} points in ${eventName}!`,
		reward,
	};
}

/**
 * Berry Blender Action
 * Blend berries together
 */
export function handleBerryBlender(
	player: PlayerData,
	action: NPCAction,
	berries: string[]
): { success: boolean, message: string, result?: string } {
	const recipe = action.berryBlenderRecipes?.find(r =>
		r.berries.length === berries.length && r.berries.every(b => berries.includes(b))
	);

	if (!recipe) {
		return { success: false, message: 'Those berries cannot be blended together.' };
	}

	return {
		success: true,
		message: `Created ${recipe.result}!`,
		result: recipe.result,
	};
}

/**
 * Pokeblock Mixer Action
 * Mix berries into Pokeblocks
 */
export function handlePokeblockMixer(
	player: PlayerData,
	action: NPCAction,
	berries: string[]
): { success: boolean, message: string, result?: string, stats?: string[] } {
	const recipe = action.pokeblockRecipes?.find(r =>
		r.berries.length === berries.length && r.berries.every(b => berries.includes(b))
	);

	if (!recipe) {
		return { success: false, message: 'Those berries cannot be mixed into Pokeblocks.' };
	}

	return {
		success: true,
		message: `Created ${recipe.result} Pokeblock!`,
		result: recipe.result,
		stats: recipe.stats,
	};
}

/**
 * Poffin Cooking Action
 * Cook berries into Poffins
 */
export function handlePoffinCooking(
	player: PlayerData,
	action: NPCAction,
	berries: string[]
): { success: boolean, message: string, result?: string, quality?: number } {
	const recipe = action.poffinRecipes?.find(r =>
		r.berries.length === berries.length && r.berries.every(b => berries.includes(b))
	);

	if (!recipe) {
		return { success: false, message: 'Those berries cannot be cooked into Poffins.' };
	}

	return {
		success: true,
		message: `Created ${recipe.result} Poffin!`,
		result: recipe.result,
		quality: recipe.quality,
	};
}

/**
 * Rival Battle Action
 * Trigger rival battles
 */
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

/**
 * Gym Rematch Action
 * Rematch gym leaders
 */
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

/**
 * Shard Trader Action
 * Trade shards for moves or items
 */
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

/**
 * Wing Collector Action
 * Collect wings for stat boosts
 */
export function handleWingCollector(
	player: PlayerData,
	action: NPCAction,
	wingType: string
): { success: boolean, message: string, reward?: { itemId: string, quantity: number } } {
	if (!action.wingTypes?.includes(wingType)) {
		return { success: false, message: 'That wing type is not collected here.' };
	}

	return {
		success: true,
		message: `Collected ${wingType} Wing!`,
		reward: action.wingReward,
	};
}

/**
 * Scale Collector Action
 * Collect scales (like Heart Scales) for rewards
 */
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

/**
 * O-Power Action
 * Distribute O-Powers
 */
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

/**
 * Heal Action
 * Heal all Pokemon in player's party to full health (like Pokemon Centers)
 */
export function handleHeal(
	player: PlayerData
): { success: boolean, message: string } {
	// Heal all Pokemon in party
	for (const pokemon of player.party) {
		pokemon.hp = pokemon.maxHp;
		pokemon.status = null;
		// Restore PP for all moves
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

/**
 * Choose Starter Action
 * Handle starter Pokemon selection (simplified single-step like Pokemon games)
 */
export function handleChooseStarter(
	player: PlayerData,
	action: NPCAction,
	selectedPokemon: string
): { success: boolean, message: string, pokemon?: RPGPokemon } {
	// Check if player already has a starter
	if (player.party.length > 0) {
		return {
			success: false,
			message: 'You already have a starter Pokémon!',
		};
	}

	const starterLevel = action.starterLevel || 5;

	// Create the starter Pokemon
	const starter = createPokemon(selectedPokemon, starterLevel);
	player.party.push(starter);

	const species = Dex.species.get(selectedPokemon);

	return {
		success: true,
		message: `Excellent choice! ${species.name} will be a great partner for you.`,
		pokemon: starter,
	};
}

/**
 * Collection Quest Action
 * Quest to collect specific items for rewards
 */
export function handleCollectionQuest(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, progress?: number, total?: number, reward?: any } {
	if (!action.requiredItems || action.requiredItems.length === 0) {
		return { success: false, message: 'No collection quest configured.' };
	}

	// Check if quest is already completed
	const questFlag = `collection_${npcId}_completed`;
	if (action.onceOnly && player.storyFlags.has(questFlag)) {
		return { success: false, message: 'You have already completed this collection quest!' };
	}

	// Check if player has all required items
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

	// Remove items from inventory
	for (const reqItem of action.requiredItems) {
		const item = player.inventory.get(reqItem.itemId)!;
		item.quantity -= reqItem.quantity;
		if (item.quantity === 0) {
			player.inventory.delete(reqItem.itemId);
		}
	}

	// Mark as completed
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

/**
 * Reputation Action
 * Manage reputation with factions/towns
 */
export function handleReputation(
	player: PlayerData,
	action: NPCAction,
	npcId: string
): { success: boolean, message: string, reputationLevel?: string, currentPoints?: number } {
	if (!action.factionId) {
		return { success: false, message: 'No faction configured.' };
	}

	const repFlag = `reputation_${action.factionId}_points`;
	const repStr = Array.from(player.storyFlags).find(f => f.startsWith(repFlag));

	let currentPoints = 0;
	if (repStr) {
		currentPoints = parseInt(repStr.split('_').pop() || '0');
	}

	// Determine reputation level
	let level = 'Neutral';
	if (currentPoints >= 1000) level = 'Exalted';
	else if (currentPoints >= 750) level = 'Revered';
	else if (currentPoints >= 500) level = 'Honored';
	else if (currentPoints >= 250) level = 'Friendly';

	return {
		success: true,
		message: `Your reputation with ${action.factionId}: ${level}`,
		reputationLevel: level,
		currentPoints,
	};
}

/**
 * Add reputation points
 */
export function addReputationPoints(
	player: PlayerData,
	factionId: string,
	points: number
): void {
	const repFlag = `reputation_${factionId}_points`;
	const repStr = Array.from(player.storyFlags).find(f => f.startsWith(repFlag));

	let currentPoints = 0;
	if (repStr) {
		currentPoints = parseInt(repStr.split('_').pop() || '0');
		player.storyFlags.delete(repStr);
	}

	currentPoints += points;
	player.storyFlags.add(`${repFlag}_${currentPoints}`);
}

/**
 * Delivery Quest Action
 * Deliver items to another NPC
 */
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
		// Picking up the item to deliver
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
		// Completing the delivery
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

/**
 * Time-based Action
 * Actions available only at certain times
 */
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

/**
 * Conditional Dialogue Action
 * NPCs with different dialogues based on player progress
 */
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

	// Check conditions in order and return first matching dialogue
	for (const condition of action.dialogueConditions) {
		// Check badge count
		if (condition.minBadges && player.obtainedBadges.length < condition.minBadges) {
			continue;
		}
		if (condition.maxBadges && player.obtainedBadges.length > condition.maxBadges) {
			continue;
		}

		// Check required flags
		if (condition.requiredFlag && !player.storyFlags.has(condition.requiredFlag)) {
			continue;
		}

		// Check prevented flags
		if (condition.preventIfFlag && player.storyFlags.has(condition.preventIfFlag)) {
			continue;
		}

		// Condition matched!
		return {
			success: true,
			message: condition.dialogue,
			dialogue: condition.dialogue,
		};
	}

	// No conditions matched, use default
	return {
		success: true,
		message: action.defaultDialogue || 'Hello!',
		dialogue: action.defaultDialogue || 'Hello!',
	};
}

/**
 * Escort Quest Action
 * Escort NPC to a location
 */
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
		// Start escort
		player.storyFlags.add(escortFlag);
		return {
			success: true,
			message: `Please escort me to ${action.escortDestination}!`,
			escorting: true,
			destination: action.escortDestination,
			arrived: false,
		};
	} else {
		// Check if at destination
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

/**
 * Achievement Tracker Action
 * Track and reward achievements
 */
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

	// Check achievement requirements
	if (achievement.requiredFlag && !player.storyFlags.has(achievement.requiredFlag)) {
		return {
			success: false,
			message: 'Achievement requirements not met.',
			unlocked: false,
		};
	}

	// Unlock achievement
	player.storyFlags.add(achievementFlag);

	return {
		success: true,
		message: `Achievement unlocked: ${achievement.name}!`,
		unlocked: true,
		reward: achievement.reward,
	};
}

/**
 * Battle Gauntlet Action
 * Challenge player to consecutive battles
 */
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

/**
 * Advance gauntlet to next battle
 */
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

/**
 * Battle Arena Action
 * Repeatable arena battles with rankings
 */
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

	// Determine rank based on wins
	let rank = 'Novice';
	if (wins >= 50) rank = 'Champion';
	else if (wins >= 30) rank = 'Master';
	else if (wins >= 20) rank = 'Expert';
	else if (wins >= 10) rank = 'Veteran';
	else if (wins >= 5) rank = 'Skilled';

	// Select opponent based on wins
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

/**
 * Record arena win
 */
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

/**
 * Training Battle Action
 * Practice battles for story progression
 */
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

	const maxAttempts = action.maxAttempts || 999; // Default unlimited
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

/**
 * Record training attempt
 */
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

/**
 * Battle Challenge Action
 * Special condition battles (no items, level cap, etc.)
 */
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

/**
 * Survival Battle Action
 * Win streak battle system
 */
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

	// Select opponent based on streak
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

/**
 * Record survival win/loss
 */
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

/**
 * Rematch Tracker Action
 * Track and manage trainer rematches
 */
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

	// Scale difficulty based on rematches
	const rematchLevel = (action.baseLevel || 50) + (timesDefeated * (action.levelIncrease || 5));

	return {
		success: true,
		message: `Rematch #${timesDefeated + 1} available`,
		canRematch: true,
		timesDefeated,
		rematchLevel,
	};
}

/**
 * Record rematch completion
 */
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
