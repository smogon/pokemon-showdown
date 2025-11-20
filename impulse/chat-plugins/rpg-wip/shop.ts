/*
* Pokemon Showdown
* RPG Shop System
*/

import { ITEMS_DATABASE } from './items';

export interface ShopTier {
	requiredBadges: number;
	items: string[];
}

export interface ShopInventory {
	locationId: string;
	tiers: ShopTier[];
}

export const SHOP_INVENTORIES: Record<string, ShopInventory> = {
	'startingroom': {
		locationId: 'startingroom',
		tiers: [
			{
				requiredBadges: 0,
				items: [
					'pokeball', 
					'potion', 
                    'antidote',
                    'oranberry' 
				],
			},
            {
                // This tier unlocks after beating Joey because of the Badge setup above
                requiredBadges: 1,
                items: [
                    'greatball',
                    'superpotion'
                ]
            }
		],
	},
};

export function getShopInventory(locationId: string, playerBadges: number): string[] {
	const shopData = SHOP_INVENTORIES[locationId];
	// Fallback for locations without shops
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
