/*
* Pokemon Showdown
* RPG Shop System
*
* This file contains shop inventory definitions for each location.
* Items are unlocked based on badges earned, similar to the Pokemon games.
*/

import { ITEMS_DATABASE } from './items';

export interface ShopTier {
	requiredBadges: number; // Number of badges required to unlock this tier
	items: string[]; // Item IDs available in this tier
}

export interface ShopInventory {
	locationId: string;
	tiers: ShopTier[];
}

// Define shop inventories for each town/city
export const SHOP_INVENTORIES: Record<string, ShopInventory> = {
	'startertown': {
		locationId: 'startertown',
		tiers: [
			{
				requiredBadges: 0,
				items: [
					// Basic Poke Balls
					'pokeball',
					'premierball',
					'expcandyl',
					'expcandyxl',
					'rarecandy',
					'terashard',
					'eggmovetutor',
					// Basic Healing Items
					'potion',
					'antidote',
					'paralyzeheal',
					'awakening',
					// Basic Berries
					'oranberry',
				],
			},
		],
	},
	'pewtercity': {
		locationId: 'pewtercity',
		tiers: [
			{
				requiredBadges: 0,
				items: [
					// Poke Balls
					'pokeball',
					'premierball',
					// Healing Items
					'potion',
					'superpotion',
					'antidote',
					'paralyzeheal',
					'awakening',
					'burnheal',
					'iceheal',
					// Berries
					'oranberry',
					'sitrusberry',
				],
			},
			{
				requiredBadges: 1, // After Boulder Badge
				items: [
					'greatball',
					'revive',
					'freshwater',
				],
			},
		],
	},
	'ceruleancity': {
		locationId: 'ceruleancity',
		tiers: [
			{
				requiredBadges: 1,
				items: [
					// Poke Balls
					'pokeball',
					'greatball',
					'premierball',
					'netball', // For Water-type city
					// Healing Items
					'potion',
					'superpotion',
					'hyperpotion',
					'antidote',
					'paralyzeheal',
					'awakening',
					'burnheal',
					'iceheal',
					'fullheal',
					// Revival
					'revive',
					// Berries
					'oranberry',
					'sitrusberry',
					'goldberry',
					// Drinks
					'freshwater',
					'sodapop',
				],
			},
			{
				requiredBadges: 2, // After Cascade Badge
				items: [
					'ultraball',
					'maxpotion',
					'lemonade',
					'ether',
				],
			},
		],
	},
	'vermilioncity': {
		locationId: 'vermilioncity',
		tiers: [
			{
				requiredBadges: 2,
				items: [
					// Poke Balls
					'pokeball',
					'greatball',
					'ultraball',
					'quickball', // For Electric-type city (speed theme)
					'premierball',
					// Healing Items
					'potion',
					'superpotion',
					'hyperpotion',
					'fullheal',
					// Revival
					'revive',
					'maxrevive',
					// Berries
					'oranberry',
					'sitrusberry',
					'goldberry',
					'wacanberry', // Electric resist berry
					// Drinks
					'freshwater',
					'sodapop',
					'lemonade',
					// PP Items
					'ether',
					'maxether',
				],
			},
			{
				requiredBadges: 3, // After Thunder Badge
				items: [
					'fullrestore',
					'maxelixir',
					'thunderstone',
				],
			},
		],
	},
	'celadoncity': {
		locationId: 'celadoncity',
		tiers: [
			{
				requiredBadges: 3,
				items: [
					// Poke Balls (Department Store has many options)
					'pokeball',
					'greatball',
					'ultraball',
					'nestball',
					'timerball',
					'fastball',
					'levelball',
					'luxuryball',
					'healball',
					'premierball',
					// Healing Items (Full selection)
					'potion',
					'superpotion',
					'hyperpotion',
					'maxpotion',
					'fullrestore',
					'fullheal',
					// Revival
					'revive',
					'maxrevive',
					// Berries (Many types)
					'oranberry',
					'sitrusberry',
					'goldberry',
					'aguavberry',
					'figyberry',
					'iapapaberry',
					'magoberry',
					'wikiberry',
					'lumberry',
					// Type-resist berries
					'chartiberry',
					'chilanberry',
					'chopleberry',
					'cobaberry',
					'colburberry',
					'habanberry',
					'kasibberry',
					'kebiaberry',
					'occaberry',
					'passhoberry',
					'payapaberry',
					'rindoberry',
					'roseliberry',
					'shucaberry',
					'tangaberry',
					'wacanberry',
					'yacheberry',
					// Drinks
					'freshwater',
					'sodapop',
					'lemonade',
					'moomoomilk',
					// PP Items
					'ether',
					'maxether',
					'elixir',
					'maxelixir',
					// Evolution Stones
					'firestone',
					'waterstone',
					'thunderstone',
					'leafstone',
					'moonstone',
					'sunstone',
				],
			},
			{
				requiredBadges: 4, // After Rainbow Badge
				items: [
					'ultraball',
					'quickball',
					'dreamball',
					'rarecandy',
					'expcandys',
					'expcandym',
					// Held Items
					'leftovers',
					'shellbell',
					'focussash',
					'eviolite',
					'expertbelt',
					'quickclaw',
					// More stones
					'shinystone',
					'duskstone',
					'dawnstone',
					'icestone',
				],
			},
		],
	},
	'fuchsiacity': {
		locationId: 'fuchsiacity',
		tiers: [
			{
				requiredBadges: 4,
				items: [
					// Poke Balls
					'pokeball',
					'greatball',
					'ultraball',
					'netball',
					'safariball',
					'premierball',
					// Healing Items
					'potion',
					'superpotion',
					'hyperpotion',
					'maxpotion',
					'fullrestore',
					'fullheal',
					// Revival
					'revive',
					'maxrevive',
					// Safari Zone themed items
					'oranberry',
					'sitrusberry',
					// Drinks
					'freshwater',
					'sodapop',
					'lemonade',
					'moomoomilk',
					// PP Items
					'ether',
					'maxether',
					'elixir',
				],
			},
			{
				requiredBadges: 5, // After Soul Badge
				items: [
					'lifeorb',
					'blacksludge',
					'airballoon',
				],
			},
		],
	},
	'saffronicity': {
		locationId: 'saffronicity',
		tiers: [
			{
				requiredBadges: 5,
				items: [
					// Poke Balls
					'pokeball',
					'greatball',
					'ultraball',
					'quickball',
					'timerball',
					'luxuryball',
					'premierball',
					// Healing Items
					'potion',
					'superpotion',
					'hyperpotion',
					'maxpotion',
					'fullrestore',
					'fullheal',
					// Revival
					'revive',
					'maxrevive',
					// Berries
					'oranberry',
					'sitrusberry',
					'lumberry',
					'kebiaberry', // Psychic resist
					// Drinks
					'freshwater',
					'sodapop',
					'lemonade',
					'moomoomilk',
					'tea',
					// PP Items
					'ether',
					'maxether',
					'elixir',
					'maxelixir',
				],
			},
			{
				requiredBadges: 6, // After Marsh Badge
				items: [
					'mentalherb',
					'clearamulet',
					'covertcloak',
					'terashard',
				],
			},
		],
	},
	'cinnabarisland': {
		locationId: 'cinnabarisland',
		tiers: [
			{
				requiredBadges: 6,
				items: [
					// Poke Balls
					'pokeball',
					'greatball',
					'ultraball',
					'repeatball',
					'premierball',
					// Healing Items
					'potion',
					'superpotion',
					'hyperpotion',
					'maxpotion',
					'fullrestore',
					'fullheal',
					// Revival
					'revive',
					'maxrevive',
					// Berries
					'oranberry',
					'sitrusberry',
					'occaberry', // Fire resist
					// Drinks
					'freshwater',
					'sodapop',
					'lemonade',
					'moomoomilk',
					'tea',
					// PP Items
					'ether',
					'maxether',
					'elixir',
					'maxelixir',
					// Evolution Items
					'firestone',
					'waterstone',
				],
			},
			{
				requiredBadges: 7, // After Volcano Badge
				items: [
					'flameorb',
					'heatrock',
					'rockyhelmet',
				],
			},
		],
	},
	'viridiancity': {
		locationId: 'viridiancity',
		tiers: [
			{
				requiredBadges: 7,
				items: [
					// Poke Balls (End-game variety)
					'pokeball',
					'greatball',
					'ultraball',
					'quickball',
					'timerball',
					'fastball',
					'levelball',
					'netball',
					'nestball',
					'luxuryball',
					'healball',
					'dreamball',
					'premierball',
					// Healing Items (All available)
					'potion',
					'superpotion',
					'hyperpotion',
					'maxpotion',
					'fullrestore',
					'fullheal',
					// Revival
					'revive',
					'maxrevive',
					'sacredash',
					// Berries
					'oranberry',
					'sitrusberry',
					'goldberry',
					'lumberry',
					// Drinks
					'freshwater',
					'sodapop',
					'lemonade',
					'moomoomilk',
					'tea',
					// PP Items
					'ether',
					'maxether',
					'elixir',
					'maxelixir',
					// Evolution Stones
					'firestone',
					'waterstone',
					'thunderstone',
					'leafstone',
					'moonstone',
					'sunstone',
					'shinystone',
					'duskstone',
					'dawnstone',
					'icestone',
				],
			},
			{
				requiredBadges: 8, // After Earth Badge - Post-game items
				items: [
					'masterball',
					'rarecandy',
					'expcandyl',
					'expcandyxl',
					// Competitive Items
					'choiceband',
					'choicescarf',
					'choicespecs',
					'lifeorb',
					'assaultvest',
					'heavydutyboots',
					'focussash',
					'weaknesspolicy',
					'mirrorherb',
					// Weather Rocks
					'heatrock',
					'damprock',
					'smoothrock',
					'icyrock',
					// Vitamins (End-game)
					'hpup',
					'protein',
					'iron',
					'calcium',
					'zinc',
					'carbos',
					// Special Evolution Items
					'dragonscale',
					'metalcoat',
					'upgrade',
					'dubiousdisc',
					'protector',
					'electirizer',
					'magmarizer',
					'reapercloth',
					'razorclaw',
					'ovalstone',
					'sachet',
					'whippeddream',
					'blackaugurite',
					'metalalloy',
				],
			},
		],
	},
	'pokemonleague': {
		locationId: 'pokemonleague',
		tiers: [
			{
				requiredBadges: 8,
				items: [
					// Elite Four Shop - Only high-end items
					'ultraball',
					'fullrestore',
					'maxrevive',
					'sacredash',
					'maxelixir',
					'rarecandy',
					'expcandyxl',
					// Competitive Items
					'choiceband',
					'choicescarf',
					'choicespecs',
					'lifeorb',
					'assaultvest',
					'heavydutyboots',
					'focussash',
					'weaknesspolicy',
					'mirrorherb',
					'clearamulet',
					'covertcloak',
					// Vitamins
					'hpup',
					'protein',
					'iron',
					'calcium',
					'zinc',
					'carbos',
					// Special Items
					'masterball',
					'terashard',
				],
			},
		],
	},
};

/**
 * Get available shop items for a specific location based on player's badges
 */
export function getShopInventory(locationId: string, playerBadges: number): string[] {
	const shopData = SHOP_INVENTORIES[locationId];
	if (!shopData) {
		// Fallback to basic items if location not found
		return ['pokeball', 'potion', 'antidote'];
	}

	const availableItems: string[] = [];

	// Collect items from all unlocked tiers
	for (const tier of shopData.tiers) {
		if (playerBadges >= tier.requiredBadges) {
			// Only add items that exist in ITEMS_DATABASE to prevent crashes
			for (const itemId of tier.items) {
				if (ITEMS_DATABASE[itemId] && !availableItems.includes(itemId)) {
					availableItems.push(itemId);
				}
			}
		}
	}

	return availableItems;
}

/**
 * Get the next tier of items that will unlock
 */
export function getNextShopTier(
	locationId: string, playerBadges: number
): { requiredBadges: number, itemCount: number } | null {
	const shopData = SHOP_INVENTORIES[locationId];
	if (!shopData) return null;

	// Find the next locked tier
	for (const tier of shopData.tiers) {
		if (tier.requiredBadges > playerBadges) {
			return {
				requiredBadges: tier.requiredBadges,
				itemCount: tier.items.filter(id => ITEMS_DATABASE[id]).length,
			};
		}
	}

	return null; // No more tiers to unlock
}
