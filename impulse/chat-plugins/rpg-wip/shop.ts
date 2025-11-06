/*
* Pokemon Showdown
* RPG Shop System
*
* Manages dynamic shop inventory based on location, badges, and story progress.
*/

import type { PlayerData } from './interface';
import { getBadgeCount } from './badges';
import { toID } from '../../../sim/dex';

// Shop inventory organized by location and unlock requirements
export interface ShopInventory {
	items: string[];
	requiresBadges?: number;
	requiresQuest?: string;
}

// Fire Red accurate shop progression
export const LOCATION_SHOPS: Record<string, ShopInventory[]> = {
	// Pallet Town - No shop
	
	// Viridian City - Basic items
	'viridian_city': [
		{
			items: [
				// Poke Balls - Basic
				'pokeball',
				// Medicine - Basic
				'potion',
				'antidote',
				'paralyzeheal',
				'awakening',
				'burnheal',
				// Misc
				'repel',
			],
		},
	],
	
	// Pewter City - Basic + Some upgrades
	'pewter_city': [
		{
			items: [
				// Poke Balls
				'pokeball',
				// Medicine - Basic + Super Potion
				'potion',
				'superpotion',
				'antidote',
				'paralyzeheal',
				'awakening',
				'burnheal',
				'iceheal',
				// Misc
				'repel',
				'escaperope',
			],
		},
	],
	
	// Cerulean City - More variety (requires Boulder Badge)
	'cerulean_city': [
		{
			items: [
				// Poke Balls
				'pokeball',
				'greatball', // Unlocked after Boulder Badge
				// Medicine
				'potion',
				'superpotion',
				'antidote',
				'paralyzeheal',
				'awakening',
				'burnheal',
				'iceheal',
				'fullheal',
				'revive',
				// Misc
				'repel',
				'superrepel',
				'escaperope',
			],
			requiresBadges: 1,
		},
	],
	
	// Mt. Moon - Special cave shop (Team Rocket seller?)
	'mt_moon': [
		{
			items: [
				'potion',
				'superpotion',
				'antidote',
				'paralyzeheal',
				'awakening',
				'escaperope',
				'repel',
			],
		},
	],
};

// Default/fallback shop for locations without specific shops
export const DEFAULT_SHOP: string[] = [
	'pokeball',
	'potion',
	'antidote',
	'paralyzeheal',
	'awakening',
	'burnheal',
	'escaperope',
	'repel',
];

// Special shops that unlock with badges (department stores, etc.)
export const BADGE_UNLOCKED_ITEMS: Record<number, string[]> = {
	0: [], // No badges - basic items only
	1: ['greatball', 'superpotion', 'revive'], // Boulder Badge
	2: ['ultraball', 'hyperpotion', 'fullheal'], // Cascade Badge
	3: ['netball', 'nestball', 'maxpotion'], // Thunder Badge
	4: ['timerball', 'quickball', 'maxrevive'], // Rainbow Badge
	5: ['repeatball', 'duskball', 'fullrestore'], // Soul Badge
	6: ['luxuryball', 'healball', 'sacredash'], // Marsh Badge
	7: ['premierball', 'fastball'], // Volcano Badge
	8: ['masterball'], // Earth Badge - Master Ball available
};

// Get available shop items for current player location and progress
export function getAvailableShopItems(player: PlayerData): string[] {
	const playerLocation = toID(player.location);
	const badgeCount = getBadgeCount(player);
	const availableItems = new Set<string>();
	
	// Get location-specific items
	const locationShops = LOCATION_SHOPS[playerLocation];
	if (locationShops) {
		for (const shop of locationShops) {
			// Check if player meets requirements
			if (shop.requiresBadges && badgeCount < shop.requiresBadges) {
				continue;
			}
			// Add all items from this shop tier
			for (const item of shop.items) {
				availableItems.add(item);
			}
		}
	} else {
		// Use default shop if no specific shop defined
		for (const item of DEFAULT_SHOP) {
			availableItems.add(item);
		}
	}
	
	// Add badge-unlocked items
	for (let badges = 0; badges <= badgeCount; badges++) {
		const unlockedItems = BADGE_UNLOCKED_ITEMS[badges];
		if (unlockedItems) {
			for (const item of unlockedItems) {
				availableItems.add(item);
			}
		}
	}
	
	return Array.from(availableItems).sort();
}

// Check if player can access a specific shop location
export function canAccessShop(player: PlayerData, locationId: string): boolean {
	const locationShops = LOCATION_SHOPS[locationId];
	if (!locationShops) return true; // No restrictions
	
	const badgeCount = getBadgeCount(player);
	
	// Check if any shop tier is accessible
	for (const shop of locationShops) {
		if (!shop.requiresBadges || badgeCount >= shop.requiresBadges) {
			return true;
		}
	}
	
	return false;
}

// Get shop welcome message based on location
export function getShopWelcomeMessage(player: PlayerData): string {
	const playerLocation = toID(player.location);
	const badgeCount = getBadgeCount(player);
	
	// Special messages based on location
	const locationMessages: Record<string, string> = {
		'viridian_city': 'Welcome to Viridian City Poké Mart! We have everything a new trainer needs!',
		'pewter_city': 'Welcome to Pewter City Poké Mart! Looking for supplies?',
		'cerulean_city': 'Welcome to Cerulean City Poké Mart! We stock Great Balls for experienced trainers!',
		'mt_moon': 'Need supplies for the cave? I\'ve got what you need!',
	};
	
	const message = locationMessages[playerLocation];
	if (message) return message;
	
	// Default message with badge recognition
	if (badgeCount >= 4) {
		return 'Welcome, experienced trainer! Check out our premium selection!';
	} else if (badgeCount >= 2) {
		return 'Welcome back! We have some new items in stock!';
	} else if (badgeCount >= 1) {
		return 'Congratulations on your first badge! We now stock Great Balls!';
	} else {
		return 'Welcome to the Poké Mart! How may I help you?';
	}
}

// Get new items notification (items that just became available)
export function getNewItemsNotification(player: PlayerData): string[] {
	const badgeCount = getBadgeCount(player);
	const newItems: string[] = [];
	
	// Check if player just unlocked new items with their current badge count
	const justUnlocked = BADGE_UNLOCKED_ITEMS[badgeCount];
	if (justUnlocked && justUnlocked.length > 0) {
		for (const item of justUnlocked) {
			newItems.push(`🆕 ${item} is now available!`);
		}
	}
	
	return newItems;
}
