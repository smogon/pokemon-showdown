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

export interface ShopTier {
	requiredBadges: number;
	items: string[];
}

export interface ShopInventory {
	locationId: string;
	tiers: ShopTier[];
}

export const SHOP_INVENTORIES: Record<string, ShopInventory> = {
	'newbarktown': {
		locationId: 'newbarktown',
		tiers: [
			{
				requiredBadges: 0,
				items: [
					'pokeball',
					'expcandyxl',
					'potion',
					'antidote',
					'paralyzeheal',
					'oranberry',
				],
			},
		],
	},
};

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
