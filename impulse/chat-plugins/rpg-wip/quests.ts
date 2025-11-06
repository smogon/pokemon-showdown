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
	// Main Story Quests
	'main_starter': {
		id: 'main_starter',
		name: 'A New Beginning',
		type: 'main',
		description: 'Choose your first Pokémon partner and begin your adventure!',
		objectives: [
			{
				id: 'choose_starter',
				type: 'have_pokemon_in_party',
				description: 'Choose a starter Pokémon',
				targetCount: 1,
				currentCount: 0,
				completed: false,
			},
		],
		rewards: {
			items: [{ id: 'pokeball', quantity: 5 }, { id: 'potion', quantity: 3 }],
		},
		location: 'Starter Town',
		givenBy: 'professor',
		dialogue: {
			start: 'Welcome to the world of Pokémon! Choose your first partner!',
			complete: 'Excellent choice! Your adventure begins now. Here are some supplies to get you started!',
		},
	},
	'main_first_badge': {
		id: 'main_first_badge',
		name: 'The First Badge',
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
			money: 1500,
			items: [{ id: 'superpotion', quantity: 3 }],
		},
		prerequisiteQuests: ['main_starter'],
		location: 'Starter Town',
		dialogue: {
			start: 'If you want to become a Pokémon Master, you need to collect Gym Badges. Head to Pewter City and challenge Brock!',
			complete: 'Congratulations on earning your first badge! You\'re on your way to becoming a Pokémon Master!',
		},
	},
	
	// Side Quests
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
