/*
* Pokemon Showdown
* RPG Items
*/
import { Dex } from '../../../sim/dex';
import type { InventoryItem, PlayerData } from './interface';

export const CUSTOM_ITEMS_DATABASE: Record<string, Omit<InventoryItem, 'quantity'>> = {
	'potion': { id: 'potion', name: 'Potion', category: 'medicine', description: 'A spray-type medicine. It restores 20 HP to a Pokemon.' },
	'superpotion': { id: 'superpotion', name: 'Super Potion', category: 'medicine', description: 'A spray-type medicine. It restores 60 HP to a Pokemon.' },
	'hyperpotion': { id: 'hyperpotion', name: 'Hyper Potion', category: 'medicine', description: 'A spray-type medicine. It restores 120 HP to a Pokemon.' },
	'maxpotion': { id: 'maxpotion', name: 'Max Potion', category: 'medicine', description: 'A spray-type medicine. It fully restores the HP of a Pokemon.' },
	'fullrestore': { id: 'fullrestore', name: 'Full Restore', category: 'medicine', description: 'A medicine that fully restores HP and heals any status problems.' },
	'freshwater': { id: 'freshwater', name: 'Fresh Water', category: 'medicine', description: 'Water with high mineral content. It restores 50 HP to a Pokémon.' },
	'sodapop': { id: 'sodapop', name: 'Soda Pop', category: 'medicine', description: 'A fizzy soda drink. It restores 60 HP to a Pokémon.' },
	'lemonade': { id: 'lemonade', name: 'Lemonade', category: 'medicine', description: 'A very sweet drink. It restores 80 HP to a Pokémon.' },
	'moomoomilk': { id: 'moomoomilk', name: 'Moomoo Milk', category: 'medicine', description: 'Milk with a very high nutrition content. It restores 100 HP to a Pokémon.' },
	'tea': { id: 'tea', name: 'Tea', category: 'medicine', description: 'A fragrant tea with a refreshing taste. It restores 120 HP to a Pokémon.' },
	'energyroot': { id: 'energyroot', name: 'Energy Root', category: 'medicine', description: 'A bitter medicinal root. It restores 200 HP to a Pokémon.' },
	'energypowder': { id: 'energypowder', name: 'EnergyPowder', category: 'medicine', description: 'A bitter medicinal powder. It restores 50 HP to a Pokémon.' },
	'healpowder': { id: 'healpowder', name: 'Heal Powder', category: 'medicine', description: 'A bitter powder that heals all status conditions.' },
	'revive': { id: 'revive', name: 'Revive', category: 'medicine', description: 'Revives a fainted Pokémon, restoring half its HP.' },
	'maxrevive': { id: 'maxrevive', name: 'Max Revive', category: 'medicine', description: 'Revives a fainted Pokémon, fully restoring its HP.' },
	'revivalherb': { id: 'revivalherb', name: 'Revival Herb', category: 'medicine', description: 'Revives a Pokémon to max HP, but lowers Friendship.' },
	'sacredash': { id: 'sacredash', name: 'Sacred Ash', category: 'medicine', description: 'Revives all fainted Pokémon and fully restores their HP.' },
	'eggmovetutor': { id: 'eggmovetutor', name: 'Egg Move Tutor', category: 'misc', description: 'A special item that teaches a compatible Pokémon one of its Egg Moves.' },
	'rarecandy': { id: 'rarecandy', name: 'Rare Candy', category: 'misc', description: 'A candy that is packed with energy. When consumed, it will instantly raise the level of a single Pokémon by one.' },
	'expcandyxs': { id: 'expcandyxs', name: 'Exp. Candy XS', category: 'misc', description: 'A candy that is packed with energy. Gives 100 Exp. Points to a Pokémon.' },
	'expcandys': { id: 'expcandys', name: 'Exp. Candy S', category: 'misc', description: 'A candy that is packed with energy. Gives 800 Exp. Points to a Pokémon.' },
	'expcandym': { id: 'expcandym', name: 'Exp. Candy M', category: 'misc', description: 'A candy that is packed with energy. Gives 3,000 Exp. Points to a Pokémon.' },
	'expcandyl': { id: 'expcandyl', name: 'Exp. Candy L', category: 'misc', description: 'A candy that is packed with energy. Gives 10,000 Exp. Points to a Pokémon.' },
	'expcandyxl': { id: 'expcandyxl', name: 'Exp. Candy XL', category: 'misc', description: 'A candy that is packed with energy. Gives 30,000 Exp. Points to a Pokémon.' },
};

export function getItemData(itemId: string): Omit<InventoryItem, 'quantity'> | null {
	if (CUSTOM_ITEMS_DATABASE[itemId]) {
		return CUSTOM_ITEMS_DATABASE[itemId];
	}

	const dexItem = Dex.items.get(itemId);
	if (dexItem.exists) {
		let category: InventoryItem['category'] = 'held';
		if (dexItem.isPokeball) {
			category = 'pokeball';
		} else if (dexItem.isBerry) {
			category = 'berry';
		}

		const description = dexItem.shortDesc || dexItem.desc || 'An item.';

		return {
			id: itemId,
			name: dexItem.name,
			category,
			description,
		};
	}

	return null;
}

export const ITEMS_DATABASE = new Proxy({} as Record<string, Omit<InventoryItem, 'quantity'>>, {
	get(target, prop: string) {
		return getItemData(prop);
	},
});

export function addItemToInventory(player: PlayerData, itemId: string, quantity: number): boolean {
	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData) return false;
	if (player.inventory.has(itemId)) {
		player.inventory.get(itemId)!.quantity += quantity;
	} else {
		player.inventory.set(itemId, { ...itemData, quantity });
	}
	return true;
}

export function removeItemFromInventory(player: PlayerData, itemId: string, quantity: number): boolean {
	if (!player.inventory.has(itemId)) return false;
	const item = player.inventory.get(itemId)!;
	if (item.quantity < quantity) return false;
	item.quantity -= quantity;
	if (item.quantity === 0) {
		player.inventory.delete(itemId);
	}
	return true;
}

export const RPGItems = {
	getItemData,
	addItemToInventory,
	removeItemFromInventory,
	CUSTOM_ITEMS_DATABASE,
	ITEMS_DATABASE,
};

export default RPGItems;
