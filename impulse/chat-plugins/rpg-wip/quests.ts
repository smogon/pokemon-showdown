/*
* Pokemon Showdown
* RPG Quest System
*
* This file contains quest management logic and quest database.
*/

import type { Quest, QuestProgress, QuestObjective, PlayerData, QuestStatus } from './interface';
import { addItemToInventory, removeItemFromInventory } from './items';

// --- QUEST DATABASE ---

export const QUEST_DATABASE: Record<string, Quest> = {
	// ===== MAIN STORY QUESTS - FIRE RED =====
	
	// Quest 1: Get your starter
	'main_starter': {
		id: 'main_starter',
		name: 'A New Beginning',
		type: 'main',
		description: 'Choose your first Pokémon partner from Professor Oak!',
		objectives: [
			{
				id: 'choose_starter',
				type: 'have_pokemon_in_party',
				description: 'Choose a starter Pokémon (Bulbasaur, Charmander, or Squirtle)',
				targetCount: 1,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			items: [{ id: 'pokeball', quantity: 5 }, { id: 'potion', quantity: 3 }],
			money: 500,
		},
		location: 'Pallet Town',
		givenBy: 'professor_oak',
		dialogue: {
			start: 'Welcome to the world of Pokémon! Before you go on your journey, choose your first partner from these three Pokémon!',
			complete: 'Excellent choice! Now, your very own Pokémon adventure is about to unfold! Take these supplies for your journey!',
		},
	},
	
	// Quest 2: Deliver the Parcel
	'main_oak_parcel': {
		id: 'main_oak_parcel',
		name: 'Oak\'s Parcel',
		type: 'main',
		description: 'Pick up Professor Oak\'s parcel from the Viridian City Poké Mart',
		objectives: [
			{
				id: 'reach_viridian',
				type: 'reach_location',
				description: 'Travel to Viridian City',
				target: 'viridian_city',
				targetCount: 1,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			items: [{ id: 'potion', quantity: 5 }],
			money: 300,
		},
		prerequisiteQuests: ['main_starter'],
		location: 'Pallet Town',
		dialogue: {
			start: 'Could you run an errand for me? Go to the Poké Mart in Viridian City and pick up a parcel!',
			complete: 'Thank you! This parcel contains special Poké Balls I ordered!',
		},
	},
	
	// Quest 3: Through Viridian Forest
	'main_viridian_forest': {
		id: 'main_viridian_forest',
		name: 'Through the Forest',
		type: 'main',
		description: 'Navigate through Viridian Forest to reach Pewter City',
		objectives: [
			{
				id: 'reach_pewter',
				type: 'reach_location',
				description: 'Make it through Viridian Forest to Pewter City',
				target: 'pewter_city',
				targetCount: 1,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			items: [{ id: 'antidote', quantity: 3 }, { id: 'pokeball', quantity: 5 }],
			money: 500,
		},
		prerequisiteQuests: ['main_oak_parcel'],
		location: 'Viridian City',
		dialogue: {
			start: 'The path to Pewter City goes through Viridian Forest. Watch out for Bug Catchers and wild Bug Pokémon!',
			complete: 'You made it through Viridian Forest! Pewter City\'s Gym awaits you!',
		},
	},
	
	// Quest 4: Boulder Badge
	'main_boulder_badge': {
		id: 'main_boulder_badge',
		name: 'The Boulder Badge',
		type: 'main',
		description: 'Defeat Brock at the Pewter City Gym to earn your first badge!',
		objectives: [
			{
				id: 'defeat_brock',
				type: 'defeat_trainer',
				description: 'Defeat Gym Leader Brock',
				target: 'gym_brock',
				targetCount: 1,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			badges: 1,
			money: 1386,
			items: [{ id: 'superpotion', quantity: 3 }],
		},
		prerequisiteQuests: ['main_viridian_forest'],
		location: 'Pewter City',
		dialogue: {
			start: 'Are you ready to challenge the Gym? Brock uses Rock-type Pokémon. Water and Grass types are super effective!',
			complete: 'Congratulations! You earned the Boulder Badge! Now you can move on to Mt. Moon!',
		},
	},
	
	// Quest 5: Mt. Moon Expedition
	'main_mt_moon': {
		id: 'main_mt_moon',
		name: 'Mt. Moon Expedition',
		type: 'main',
		description: 'Navigate through the dark caves of Mt. Moon',
		objectives: [
			{
				id: 'traverse_mt_moon',
				type: 'reach_location',
				description: 'Find your way through Mt. Moon',
				target: 'route_4',
				targetCount: 1,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			items: [{ id: 'moonstone', quantity: 1 }, { id: 'superpotion', quantity: 5 }],
			money: 1000,
		},
		prerequisiteQuests: ['main_boulder_badge'],
		prerequisiteBadges: 1,
		location: 'Pewter City',
		dialogue: {
			start: 'Mt. Moon is ahead on Route 3. It\'s a dark cave, so watch your step! Team Rocket has been spotted there...',
			complete: 'You made it through Mt. Moon! The path to Cerulean City is open!',
		},
	},
	
	// ===== SIDE QUESTS =====
	
	// Side Quest: Catch 5 Pokemon
	'side_catch_five': {
		id: 'side_catch_five',
		name: 'Building Your Team',
		type: 'side',
		description: 'Catch 5 different Pokémon to build a strong team',
		objectives: [
			{
				id: 'catch_five_pokemon',
				type: 'catch_pokemon',
				description: 'Catch 5 different Pokémon',
				targetCount: 5,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			money: 1000,
			items: [{ id: 'pokeball', quantity: 10 }, { id: 'greatball', quantity: 3 }],
		},
		location: 'Pallet Town',
		dialogue: {
			start: 'A great trainer needs a diverse team! Try catching 5 different Pokémon!',
			complete: 'Excellent! You\'re becoming a skilled Pokémon Trainer!',
		},
	},
	
	// Side Quest: Bug Catcher Challenge
	'side_bug_catching': {
		id: 'side_bug_catching',
		name: 'Bug Catching Contest',
		type: 'side',
		description: 'Catch a Bug-type Pokémon in Viridian Forest',
		objectives: [
			{
				id: 'catch_bug_pokemon',
				type: 'catch_pokemon',
				description: 'Catch any Bug-type Pokémon',
				targetCount: 1,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			money: 300,
			items: [{ id: 'antidote', quantity: 5 }],
		},
		location: 'Viridian Forest',
		givenBy: 'bug_catcher_rick',
		dialogue: {
			start: 'Hey! Want to have a Bug catching contest? Catch any Bug Pokémon and I\'ll give you a prize!',
			complete: 'Nice catch! Bug Pokémon are the best!',
		},
	},
	
	// Side Quest: Defeat trainers on Route 3
	'side_route3_trainers': {
		id: 'side_route3_trainers',
		name: 'Route 3 Gauntlet',
		type: 'side',
		description: 'Defeat 5 trainers on Route 3',
		objectives: [
			{
				id: 'defeat_route3_trainers',
				type: 'defeat_trainer',
				description: 'Defeat 5 trainers',
				targetCount: 5,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			money: 2000,
			items: [{ id: 'superpotion', quantity: 5 }],
		},
		location: 'Route 3',
		dialogue: {
			start: 'Route 3 is full of trainers! Beat 5 of them to prove your strength!',
			complete: 'Wow! You\'re really strong! Keep it up!',
		},
	},
	
	// Side Quest: Explore Mt. Moon
	'side_mt_moon_exploration': {
		id: 'side_mt_moon_exploration',
		name: 'Cave Explorer',
		type: 'side',
		description: 'Defeat 3 trainers inside Mt. Moon',
		objectives: [
			{
				id: 'defeat_mt_moon_trainers',
				type: 'defeat_trainer',
				description: 'Defeat 3 trainers in Mt. Moon',
				targetCount: 3,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			money: 1500,
			items: [{ id: 'revive', quantity: 2 }, { id: 'escaperope', quantity: 3 }],
		},
		location: 'Mt. Moon',
		dialogue: {
			start: 'Mt. Moon is full of trainers and Team Rocket grunts! Can you beat 3 of them?',
			complete: 'You\'re brave to explore such a dark cave!',
		},
	},
	
	// Side Quest: Fossil Collection
	'side_fossil_choice': {
		id: 'side_fossil_choice',
		name: 'The Fossil Mystery',
		type: 'side',
		description: 'Find a rare fossil in Mt. Moon',
		objectives: [
			{
				id: 'obtain_fossil',
				type: 'collect_item',
				description: 'Obtain a Helix or Dome Fossil',
				target: 'helixfossil',
				targetCount: 1,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			money: 2000,
		},
		location: 'Mt. Moon',
		dialogue: {
			start: 'Deep in Mt. Moon, ancient fossils can be found! Find one and bring it back!',
			complete: 'Amazing! That fossil is millions of years old!',
		},
	},
	
	'side_catch_tutorial': {
		id: 'side_catch_tutorial',
		name: 'Gotta Catch \'Em All',
		type: 'side',
		description: 'Catch your first wild Pokémon',
		objectives: [
			{
				id: 'catch_any_pokemon',
				type: 'catch_pokemon',
				description: 'Catch any wild Pokémon',
				targetCount: 1,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			money: 500,
			items: [{ id: 'pokeball', quantity: 5 }],
		},
		location: 'Starter Town',
		givenBy: 'youngster_joey',
		dialogue: {
			start: 'Hey! Have you caught a Pokémon yet? It\'s easy! Just weaken it and throw a Poké Ball!',
			complete: 'Nice catch! Keep catching more Pokémon to build a strong team!',
		},
	},
	'side_potion_delivery': {
		id: 'side_potion_delivery',
		name: 'Potion Delivery',
		type: 'side',
		description: 'Deliver 3 potions to the Pokémon Center',
		objectives: [
			{
				id: 'deliver_potions',
				type: 'collect_item',
				description: 'Bring 3 Potions to Nurse Joy',
				target: 'potion',
				targetCount: 3,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			money: 300,
			items: [{ id: 'superpotion', quantity: 2 }],
		},
		location: 'Starter Town',
		givenBy: 'nurse_joy',
		dialogue: {
			start: 'Oh dear! We\'re running low on Potions at the center. Could you bring me 3 Potions?',
			progress: 'Do you have those 3 Potions yet?',
			complete: 'Thank you so much! Here\'s a reward for your help!',
		},
	},
	'side_wild_training': {
		id: 'side_wild_training',
		name: 'Wild Training',
		type: 'side',
		description: 'Defeat wild Pokémon to gain experience',
		objectives: [
			{
				id: 'defeat_wild',
				type: 'defeat_wild_pokemon',
				description: 'Defeat 5 wild Pokémon',
				targetCount: 5,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			money: 750,
			items: [{ id: 'potion', quantity: 5 }],
		},
		location: 'Starter Town',
		givenBy: 'youngster_joey',
		dialogue: {
			start: 'Want to get stronger? Battle some wild Pokémon!',
			complete: 'Nice! You\'re getting the hang of it!',
		},
	},
};

// --- QUEST MANAGEMENT FUNCTIONS ---

export function initializeQuests(player: PlayerData): void {
	if (!player.quests) {
		player.quests = {
			active: new Map<string, QuestProgress>(),
			completed: new Set<string>(),
		};
	}
}

export function canStartQuest(player: PlayerData, questId: string): { canStart: boolean, reason?: string } {
	const quest = QUEST_DATABASE[questId];
	if (!quest) {
		return { canStart: false, reason: 'Quest not found' };
	}

	initializeQuests(player);

	// Check if already completed
	if (player.quests!.completed.has(questId)) {
		return { canStart: false, reason: 'Quest already completed' };
	}

	// Check if already active
	if (player.quests!.active.has(questId)) {
		return { canStart: false, reason: 'Quest already active' };
	}

	// Check prerequisite quests
	if (quest.prerequisiteQuests) {
		for (const prereqId of quest.prerequisiteQuests) {
			if (!player.quests!.completed.has(prereqId)) {
				const prereqQuest = QUEST_DATABASE[prereqId];
				return { 
					canStart: false, 
					reason: `You must complete "${prereqQuest?.name || prereqId}" first` 
				};
			}
		}
	}

	// Check prerequisite badges
	if (quest.prerequisiteBadges !== undefined && player.badges < quest.prerequisiteBadges) {
		return { 
			canStart: false, 
			reason: `You need at least ${quest.prerequisiteBadges} badge(s)` 
		};
	}

	return { canStart: true };
}

export function startQuest(player: PlayerData, questId: string): { success: boolean, message: string } {
	const quest = QUEST_DATABASE[questId];
	if (!quest) {
		return { success: false, message: 'Quest not found' };
	}

	const checkResult = canStartQuest(player, questId);
	if (!checkResult.canStart) {
		return { success: false, message: checkResult.reason || 'Cannot start quest' };
	}

	initializeQuests(player);

	// Create quest progress
	const progress: QuestProgress = {
		questId,
		status: 'in_progress',
		objectives: quest.objectives.map(obj => ({ ...obj, currentCount: 0, completed: false })),
		startedAt: Date.now(),
	};

	player.quests!.active.set(questId, progress);

	return { 
		success: true, 
		message: quest.dialogue?.start || `Quest "${quest.name}" started!` 
	};
}

export function updateQuestObjective(
	player: PlayerData, 
	objectiveType: QuestObjective['type'], 
	target?: string,
	amount: number = 1
): string[] {
	initializeQuests(player);
	
	const updates: string[] = [];

	for (const [questId, progress] of player.quests!.active) {
		if (progress.status !== 'in_progress') continue;

		let questUpdated = false;

		for (const objective of progress.objectives) {
			if (objective.completed) continue;
			if (objective.type !== objectiveType) continue;
			
			// Check if target matches (if target is specified)
			if (target && objective.target && objective.target !== target) continue;

			// Update progress
			objective.currentCount = (objective.currentCount || 0) + amount;

			// Check if objective is completed
			if (objective.targetCount && objective.currentCount >= objective.targetCount) {
				objective.completed = true;
				updates.push(`Quest objective completed: ${objective.description}`);
				questUpdated = true;
			}
		}

		// Check if all objectives are completed
		if (questUpdated && progress.objectives.every(obj => obj.completed)) {
			const quest = QUEST_DATABASE[questId];
			if (quest) {
				completeQuest(player, questId);
				updates.push(`Quest completed: ${quest.name}!`);
			}
		}
	}

	return updates;
}

export function completeQuest(player: PlayerData, questId: string): { success: boolean, message: string, rewards?: string[] } {
	const quest = QUEST_DATABASE[questId];
	if (!quest) {
		return { success: false, message: 'Quest not found' };
	}

	initializeQuests(player);

	const progress = player.quests!.active.get(questId);
	if (!progress) {
		return { success: false, message: 'Quest is not active' };
	}

	// Check if all objectives are completed
	const allCompleted = progress.objectives.every(obj => obj.completed);
	if (!allCompleted) {
		return { success: false, message: 'Not all objectives are completed' };
	}

	// Award rewards
	const rewardMessages: string[] = [];
	
	if (quest.rewards.money) {
		player.money += quest.rewards.money;
		rewardMessages.push(`Received ₽${quest.rewards.money}`);
	}

	if (quest.rewards.experience) {
		player.experience += quest.rewards.experience;
		rewardMessages.push(`Gained ${quest.rewards.experience} EXP`);
	}

	if (quest.rewards.badges) {
		player.badges += quest.rewards.badges;
		rewardMessages.push(`Earned ${quest.rewards.badges} badge(s)!`);
	}

	if (quest.rewards.items) {
		for (const item of quest.rewards.items) {
			addItemToInventory(player, item.id, item.quantity);
			rewardMessages.push(`Received ${item.quantity}x ${item.id}`);
		}
	}

	// Mark quest as completed
	progress.status = 'completed';
	progress.completedAt = Date.now();
	player.quests!.active.delete(questId);
	player.quests!.completed.add(questId);

	return { 
		success: true, 
		message: quest.dialogue?.complete || `Quest "${quest.name}" completed!`,
		rewards: rewardMessages,
	};
}

export function getActiveQuests(player: PlayerData): QuestProgress[] {
	initializeQuests(player);
	return Array.from(player.quests!.active.values());
}

export function getCompletedQuests(player: PlayerData): string[] {
	initializeQuests(player);
	return Array.from(player.quests!.completed);
}

export function getQuestProgress(player: PlayerData, questId: string): QuestProgress | undefined {
	initializeQuests(player);
	return player.quests!.active.get(questId);
}

export function isQuestCompleted(player: PlayerData, questId: string): boolean {
	initializeQuests(player);
	return player.quests!.completed.has(questId);
}

export function isQuestActive(player: PlayerData, questId: string): boolean {
	initializeQuests(player);
	return player.quests!.active.has(questId);
}

// Check inventory-based quest objectives (for collect_item type)
export function checkInventoryObjectives(player: PlayerData): string[] {
	initializeQuests(player);
	
	const updates: string[] = [];

	for (const [questId, progress] of player.quests!.active) {
		if (progress.status !== 'in_progress') continue;

		let questUpdated = false;

		for (const objective of progress.objectives) {
			if (objective.completed) continue;
			if (objective.type !== 'collect_item') continue;
			if (!objective.target) continue;

			// Check if player has the required items
			const item = player.inventory.get(objective.target);
			const currentAmount = item?.quantity || 0;
			
			// Update the current count
			if (objective.currentCount !== currentAmount) {
				objective.currentCount = currentAmount;
			}

			// Check if objective is completed
			if (objective.targetCount && objective.currentCount >= objective.targetCount) {
				if (!objective.completed) {
					objective.completed = true;
					updates.push(`Quest objective completed: ${objective.description}`);
					questUpdated = true;
				}
			}
		}

		// Check if all objectives are completed
		if (questUpdated && progress.objectives.every(obj => obj.completed)) {
			const quest = QUEST_DATABASE[questId];
			if (quest) {
				completeQuest(player, questId);
				updates.push(`Quest completed: ${quest.name}!`);
			}
		}
	}

	return updates;
}

// Check if player has required Pokemon in party (for have_pokemon_in_party type)
export function checkPartyObjectives(player: PlayerData): string[] {
	initializeQuests(player);
	
	const updates: string[] = [];

	for (const [questId, progress] of player.quests!.active) {
		if (progress.status !== 'in_progress') continue;

		let questUpdated = false;

		for (const objective of progress.objectives) {
			if (objective.completed) continue;
			if (objective.type !== 'have_pokemon_in_party') continue;

			// Check party size
			const currentCount = player.party.length;
			objective.currentCount = currentCount;

			// Check if objective is completed
			if (objective.targetCount && objective.currentCount >= objective.targetCount) {
				if (!objective.completed) {
					objective.completed = true;
					updates.push(`Quest objective completed: ${objective.description}`);
					questUpdated = true;
				}
			}
		}

		// Check if all objectives are completed
		if (questUpdated && progress.objectives.every(obj => obj.completed)) {
			const quest = QUEST_DATABASE[questId];
			if (quest) {
				completeQuest(player, questId);
				updates.push(`Quest completed: ${quest.name}!`);
			}
		}
	}

	return updates;
}
