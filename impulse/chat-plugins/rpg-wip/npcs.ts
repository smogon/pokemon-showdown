/*
* Pokemon Showdown
* RPG NPC System
*
* This file contains NPC management logic and NPC database.
*/

import type { NPC, NPCAction, PlayerData } from './interface';
import { addItemToInventory, removeItemFromInventory } from './items';
import { startQuest, isQuestCompleted, isQuestActive } from './quests';

// --- NPC DATABASE ---

export const NPC_DATABASE: Record<string, NPC> = {
	'professor': {
		id: 'professor',
		name: 'Professor Oak',
		location: 'Starter Town',
		dialogue: 'Welcome to the world of Pokémon! I study Pokémon as a profession.',
		actions: [
			{
				type: 'give_quest',
				questId: 'main_starter',
				dialogue: 'Would you like to begin your Pokémon journey?',
				requirements: {
					doesNotHaveQuest: 'main_starter',
				},
			},
			{
				type: 'give_quest',
				questId: 'main_first_badge',
				dialogue: 'Ready for your first Gym challenge?',
				requirements: {
					questCompleted: 'main_starter',
					doesNotHaveQuest: 'main_first_badge',
				},
			},
			{
				type: 'dialogue_only',
				dialogue: 'You\'re doing great! Keep training your Pokémon!',
			},
		],
	},
	'youngster_joey': {
		id: 'youngster_joey',
		name: 'Youngster Joey',
		location: 'Starter Town',
		dialogue: 'My Rattata is in the top percentage of Rattata!',
		actions: [
			{
				type: 'give_quest',
				questId: 'side_catch_tutorial',
				dialogue: 'Hey! Want to learn how to catch Pokémon?',
				requirements: {
					doesNotHaveQuest: 'side_catch_tutorial',
					questCompleted: 'main_starter',
				},
			},
			{
				type: 'dialogue_only',
				dialogue: 'Keep catching Pokémon! You never know what you\'ll find!',
			},
		],
	},
	'nurse_joy': {
		id: 'nurse_joy',
		name: 'Nurse Joy',
		location: 'Starter Town',
		dialogue: 'Welcome to the Pokémon Center! How can I help you?',
		actions: [
			{
				type: 'heal_party',
				dialogue: 'Let me heal your Pokémon! ... There, all better!',
			},
			{
				type: 'give_quest',
				questId: 'side_potion_delivery',
				dialogue: 'Oh dear! Could you help me with something?',
				requirements: {
					doesNotHaveQuest: 'side_potion_delivery',
					questCompleted: 'main_starter',
				},
			},
			{
				type: 'take_item',
				takeItem: { id: 'potion', quantity: 3 },
				dialogue: 'Do you have those 3 Potions for me?',
				requirements: {
					hasItem: { id: 'potion', quantity: 3 },
					hasQuest: 'side_potion_delivery',
				},
			},
		],
	},
	'potion_seller': {
		id: 'potion_seller',
		name: 'Potion Seller',
		location: 'Starter Town',
		dialogue: 'Hello traveler! I have potions for you!',
		actions: [
			{
				type: 'give_item',
				giveItem: { id: 'potion', quantity: 1 },
				dialogue: 'Here, have a free Potion! First one\'s on the house!',
				requirements: {},
			},
		],
		oneTimeOnly: true,
	},
	'mysterious_trader': {
		id: 'mysterious_trader',
		name: 'Mysterious Trader',
		location: 'Starter Town',
		dialogue: 'I trade rare items for the right price...',
		actions: [
			{
				type: 'give_item',
				giveItem: { id: 'rarecandy', quantity: 1 },
				dialogue: 'I\'ll give you a Rare Candy for 5 Poké Balls!',
				requirements: {
					hasItem: { id: 'pokeball', quantity: 5 },
				},
			},
			{
				type: 'take_item',
				takeItem: { id: 'pokeball', quantity: 5 },
				dialogue: 'Deal! Here\'s your Rare Candy!',
				requirements: {
					hasItem: { id: 'pokeball', quantity: 5 },
				},
			},
		],
	},
};

// --- NPC INTERACTION FUNCTIONS ---

export function getNPCsInLocation(location: string): NPC[] {
	return Object.values(NPC_DATABASE).filter(npc => npc.location === location);
}

export function getNPC(npcId: string): NPC | undefined {
	return NPC_DATABASE[npcId];
}

export function canPerformAction(player: PlayerData, action: NPCAction): { can: boolean, reason?: string } {
	if (!action.requirements) {
		return { can: true };
	}

	const reqs = action.requirements;

	// Check item requirement
	if (reqs.hasItem) {
		const item = player.inventory.get(reqs.hasItem.id);
		if (!item || item.quantity < reqs.hasItem.quantity) {
			return { 
				can: false, 
				reason: `You need ${reqs.hasItem.quantity}x ${reqs.hasItem.id}` 
			};
		}
	}

	// Check quest requirement
	if (reqs.hasQuest && !isQuestActive(player, reqs.hasQuest)) {
		return { can: false, reason: 'You don\'t have the required quest' };
	}

	// Check quest completed requirement
	if (reqs.questCompleted && !isQuestCompleted(player, reqs.questCompleted)) {
		return { can: false, reason: 'You haven\'t completed the required quest' };
	}

	// Check badge requirement
	if (reqs.minBadges !== undefined && player.badges < reqs.minBadges) {
		return { can: false, reason: `You need ${reqs.minBadges} badge(s)` };
	}

	// Check doesn't have quest requirement (to prevent duplicates)
	if (reqs.doesNotHaveQuest) {
		if (isQuestActive(player, reqs.doesNotHaveQuest) || isQuestCompleted(player, reqs.doesNotHaveQuest)) {
			return { can: false, reason: 'Quest not available' };
		}
	}

	return { can: true };
}

export function getAvailableActions(player: PlayerData, npc: NPC): NPCAction[] {
	// Check if NPC is one-time only and already interacted with
	if (npc.oneTimeOnly && npc.interactedWith) {
		return [];
	}

	const availableActions: NPCAction[] = [];

	for (const action of npc.actions) {
		const check = canPerformAction(player, action);
		if (check.can) {
			availableActions.push(action);
		}
	}

	return availableActions;
}

export function performNPCAction(
	player: PlayerData, 
	npc: NPC, 
	action: NPCAction
): { success: boolean, message: string, additionalInfo?: any } {
	// Check if action can be performed
	const check = canPerformAction(player, action);
	if (!check.can) {
		return { success: false, message: check.reason || 'Cannot perform this action' };
	}

	let resultMessage = action.dialogue || 'Action completed.';
	const additionalInfo: any = {};

	switch (action.type) {
		case 'give_item':
			if (action.giveItem) {
				addItemToInventory(player, action.giveItem.id, action.giveItem.quantity);
				resultMessage = action.dialogue || `Received ${action.giveItem.quantity}x ${action.giveItem.id}!`;
			}
			break;

		case 'take_item':
			if (action.takeItem) {
				const removed = removeItemFromInventory(player, action.takeItem.id, action.takeItem.quantity);
				if (!removed) {
					return { success: false, message: 'You don\'t have the required items' };
				}
				resultMessage = action.dialogue || `Gave ${action.takeItem.quantity}x ${action.takeItem.id}.`;
				
				// Check if this completes a quest objective
				// This would be handled by quest system
			}
			break;

		case 'start_battle':
			if (action.trainerId) {
				additionalInfo.startBattle = action.trainerId;
				resultMessage = action.dialogue || 'A battle is about to begin!';
			}
			break;

		case 'give_quest':
			if (action.questId) {
				const questResult = startQuest(player, action.questId);
				return questResult;
			}
			break;

		case 'heal_party':
			// Heal all Pokémon in party
			for (const pokemon of player.party) {
				pokemon.hp = pokemon.maxHp;
				pokemon.status = null;
			}
			resultMessage = action.dialogue || 'Your Pokémon have been healed!';
			break;

		case 'shop':
			additionalInfo.openShop = true;
			resultMessage = action.dialogue || 'Welcome to the shop!';
			break;

		case 'dialogue_only':
			resultMessage = action.dialogue || npc.dialogue;
			break;
	}

	// Mark NPC as interacted with if one-time only
	if (npc.oneTimeOnly) {
		npc.interactedWith = true;
	}

	return { success: true, message: resultMessage, additionalInfo };
}
