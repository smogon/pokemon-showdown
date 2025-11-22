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
	'startingroom': {
		locationId: 'startingroom',
		tiers: [
			{
				requiredBadges: 0,
				items: [
					'pokeball',
					'potion',
					'antidote',
					'oranberry',
					'cheriberry',
					'chestoberry',
					'pechaberry',
					'rawstberry',
					'aspearberry',
				],
			},
			{
				requiredBadges: 1,
				items: [
					'greatball',
					'superpotion',
					'leppaberry',
					'persimberry',
				],
			},
			{
				requiredBadges: 2,
				items: [
					'ultraball',
					'hyperpotion',
					'quickball',
					'timerball',
					'nestball',
					'netball',
				],
			},
			{
				requiredBadges: 3,
				items: [
					'repeatball',
					'duskball',
					'diveball',
					'healball',
					'firestone',
					'waterstone',
					'thunderstone',
					'leafstone',
				],
			},
			{
				requiredBadges: 4,
				items: [
					'moonstone',
					'sunstone',
					'shinystone',
					'duskstone',
					'dawnstone',
					'icestone',
				],
			},
			{
				requiredBadges: 5,
				items: [
					'metalcoat',
					'dragonscale',
					'upgrade',
					'luxuryball',
					'premierball',
					'fastball',
					'levelball',
					'heavyball',
				],
			},
			{
				requiredBadges: 6,
				items: [
					'loveball',
					'lureball',
					'moonball',
					'friendball',
					'dreamball',
					'charcoal',
					'mysticwater',
					'miracleseed',
				],
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
