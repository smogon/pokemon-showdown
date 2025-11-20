import { ITEMS_DATABASE } from './items';

/**
 * Game Shops Configuration
 *
 * This file contains all shop-related story data including:
 * - Shop inventories by location
 * - Item availability based on badge progress
 *
 * Edit this file to create new stories and adventures.
 */

// ============================================================================
// SHOP CONFIGURATION
// ============================================================================

export interface ShopTier {
	requiredBadges: number;
	items: string[];
}

export interface ShopInventory {
	locationId: string;
	tiers: ShopTier[];
}

export const SHOP_INVENTORIES: Record<string, ShopInventory> = {
	'pallettown': {
		locationId: 'pallettown',
		tiers: [
			{
				requiredBadges: 0,
				items: ['pokeball', 'potion', 'antidote', 'oranberry'],
			},
			{
				requiredBadges: 2,
				items: ['greatball', 'superpotion', 'awaken ing'],
			},
			{
				requiredBadges: 5,
				items: ['ultraball', 'hyperpotion', 'fullheal', 'revive'],
			},
		],
	},
	'pewtercity': {
		locationId: 'pewtercity',
		tiers: [
			{
				requiredBadges: 0,
				items: ['pokeball', 'potion', 'antidote', 'paralyzeheal'],
			},
			{
				requiredBadges: 1,
				items: ['greatball', 'superpotion'],
			},
		],
	},
	'ceruleancity': {
		locationId: 'ceruleancity',
		tiers: [
			{
				requiredBadges: 1,
				items: ['pokeball', 'greatball', 'potion', 'superpotion', 'repel'],
			},
			{
				requiredBadges: 3,
				items: ['ultraball', 'hyperpotion', 'fullheal'],
			},
		],
	},
	'vermilioncity': {
		locationId: 'vermilioncity',
		tiers: [
			{
				requiredBadges: 2,
				items: ['greatball', 'superpotion', 'paralyzeheal', 'repel'],
			},
			{
				requiredBadges: 4,
				items: ['ultraball', 'hyperpotion', 'fullheal', 'revive'],
			},
		],
	},
	'celadoncity': {
		locationId: 'celadoncity',
		tiers: [
			{
				requiredBadges: 3,
				items: ['pokeball', 'greatball', 'ultraball', 'superpotion', 'hyperpotion', 'fullheal', 'revive', 'repel', 'superrepel'],
			},
			{
				requiredBadges: 6,
				items: ['maxpotion', 'fullrestore', 'maxrepel', 'maxrevive'],
			},
		],
	},
	'fuchsiacity': {
		locationId: 'fuchsiacity',
		tiers: [
			{
				requiredBadges: 4,
				items: ['greatball', 'ultraball', 'hyperpotion', 'fullheal', 'revive', 'superrepel'],
			},
			{
				requiredBadges: 7,
				items: ['maxpotion', 'fullrestore', 'maxrevive'],
			},
		],
	},
	'cinnabarisland': {
		locationId: 'cinnabarisland',
		tiers: [
			{
				requiredBadges: 6,
				items: ['ultraball', 'hyperpotion', 'maxpotion', 'fullheal', 'revive', 'maxrevive'],
			},
		],
	},
	'newbarktown': {
		locationId: 'newbarktown',
		tiers: [
			{
				requiredBadges: 8,
				items: ['pokeball', 'greatball', 'ultraball', 'hyperpotion', 'maxpotion', 'fullheal', 'revive'],
			},
			{
				requiredBadges: 12,
				items: ['fullrestore', 'maxrevive', 'maxrepel'],
			},
		],
	},
	'goldenrodcity': {
		locationId: 'goldenrodcity',
		tiers: [
			{
				requiredBadges: 10,
				items: ['pokeball', 'greatball', 'ultraball', 'superpotion', 'hyperpotion', 'maxpotion', 'fullheal', 'revive', 'superrepel'],
			},
			{
				requiredBadges: 14,
				items: ['fullrestore', 'maxrevive', 'maxrepel', 'ppup'],
			},
		],
	},
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getShopInventory(locationId: string, playerBadges: number): string[] {
	const shopData = SHOP_INVENTORIES[locationId];

	if (!shopData) return ['pokeball', 'potion'];

	const availableItems: string[] = [];

	for (const tier of shopData.tiers) {
		if (playerBadges >= tier.requiredBadges) {
			for (const itemId of tier.items) {
				if (ITEMS_DATABASE[itemId] && !availableItems.includes(itemId)) {
					availableItems.push(itemId);
				}
			}
		}
	}

	return availableItems;
}

export function getNextShopTier(
	locationId: string, playerBadges: number
): { requiredBadges: number, itemCount: number } | null {
	const shopData = SHOP_INVENTORIES[locationId];
	if (!shopData) return null;

	for (const tier of shopData.tiers) {
		if (tier.requiredBadges > playerBadges) {
			return {
				requiredBadges: tier.requiredBadges,
				itemCount: tier.items.filter(id => ITEMS_DATABASE[id]).length,
			};
		}
	}

	return null;
}
