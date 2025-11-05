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

	// Specific Status Healers
	'antidote': { id: 'antidote', name: 'Antidote', category: 'medicine', description: 'A spray-type medicine. It heals a Pokémon from poisoning.' },
	'paralyzeheal': { id: 'paralyzeheal', name: 'Paralyze Heal', category: 'medicine', description: 'A spray-type medicine. It heals a Pokémon from paralysis.' },
	'awakening': { id: 'awakening', name: 'Awakening', category: 'medicine', description: 'A spray-type medicine. It awakens a sleeping Pokémon.' },
	'burnheal': { id: 'burnheal', name: 'Burn Heal', category: 'medicine', description: 'A spray-type medicine. It heals a Pokémon from a burn.' },
	'iceheal': { id: 'iceheal', name: 'Ice Heal', category: 'medicine', description: 'A spray-type medicine. It defrosts a frozen Pokémon.' },
	'fullheal': { id: 'fullheal', name: 'Full Heal', category: 'medicine', description: 'A spray-type medicine. It heals all status conditions of a single Pokémon.' },

	// PP Restoration Items
	'ether': { id: 'ether', name: 'Ether', category: 'medicine', description: 'Restores 10 PP for one of a Pokémon\'s moves.' },
	'maxether': { id: 'maxether', name: 'Max Ether', category: 'medicine', description: 'Fully restores PP for one of a Pokémon\'s moves.' },
	'elixir': { id: 'elixir', name: 'Elixir', category: 'medicine', description: 'Restores 10 PP for all of a Pokémon\'s moves.' },
	'maxelixir': { id: 'maxelixir', name: 'Max Elixir', category: 'medicine', description: 'Fully restores PP for all of a Pokémon\'s moves.' },
	
	'eggmovetutor': { id: 'eggmovetutor', name: 'Egg Move Tutor', category: 'misc', description: 'A special item that teaches a compatible Pokémon one of its Egg Moves.' },
	'rarecandy': { id: 'rarecandy', name: 'Rare Candy', category: 'misc', description: 'A candy that is packed with energy. When consumed, it will instantly raise the level of a single Pokémon by one.' },
	'expcandyxs': { id: 'expcandyxs', name: 'Exp. Candy XS', category: 'misc', description: 'A candy that is packed with energy. Gives 100 Exp. Points to a Pokémon.' },
	'expcandys': { id: 'expcandys', name: 'Exp. Candy S', category: 'misc', description: 'A candy that is packed with energy. Gives 800 Exp. Points to a Pokémon.' },
	'expcandym': { id: 'expcandym', name: 'Exp. Candy M', category: 'misc', description: 'A candy that is packed with energy. Gives 3,000 Exp. Points to a Pokémon.' },
	'expcandyl': { id: 'expcandyl', name: 'Exp. Candy L', category: 'misc', description: 'A candy that is packed with energy. Gives 10,000 Exp. Points to a Pokémon.' },
	'expcandyxl': { id: 'expcandyxl', name: 'Exp. Candy XL', category: 'misc', description: 'A candy that is packed with energy. Gives 30,000 Exp. Points to a Pokémon.' },
	'terashard': { id: 'terashard', name: 'Tera Shard', category: 'misc', description: 'A mysterious shard. When used on a Pokémon, it changes its Tera Type to a new, random type.' },
};

export const ITEM_PRICES: Record<string, number> = {
	'pokeball': 200, 'greatball': 600, 'ultraball': 800, 'potion': 300, 'superpotion': 700, 'hyperpotion': 1200, 'maxpotion': 2500, 'fullrestore': 3000, 'eggmovetutor': 3000, 'rarecandy': 4800,
	'expcandyxs': 20, 'expcandys': 100, 'expcandym': 500, 'expcandyl': 3000, 'expcandyxl': 10000,
	'levelball': 1000, 'fastball': 1000, 'timerball': 1000, 'nestball': 1000, 'netball': 1000, 'quickball': 1000, 'dreamball': 1000,
	'premierball': 200, 'luxuryball': 1000, 'healball': 300,
	'leftovers': 8000, 'blacksludge': 5000, 'shellbell': 6000, 'berryjuice': 500, 'lifeorb': 9000, 'rockyhelmet': 7000, 'stickybarb': 3000,
	'choiceband': 10000, 'choicescarf': 10000, 'choicespecs': 10000,
	'flameorb': 4000, 'toxicorb': 4000,
	'oranberry': 200, 'sitrusberry': 800, 'goldberry': 600, 'aguavberry': 800, 'figyberry': 800, 'iapapaberry': 800, 'magoberry': 800, 'wikiberry': 800,
	'enigmaberry': 1000, 'jabocaberry': 1000, 'rowapberry': 1000,
	'liechiberry': 1200, 'ganlonberry': 1200, 'salacberry': 1200, 'petayaberry': 1200, 'apicotberry': 1200, 'starfberry': 2000,
	'keberry': 1500, 'marangaberry': 1500,
	'babiriberry': 1500, 'chartiberry': 1500, 'chilanberry': 1500, 'chopleberry': 1500, 'cobaberry': 1500, 'colburberry': 1500,
	'habanberry': 1500, 'kasibberry': 1500, 'kebiaberry': 1500, 'occaberry': 1500, 'passhoberry': 1500, 'payapaberry': 1500,
	'rindoberry': 1500, 'roseliberry': 1500, 'shucaberry': 1500, 'tangaberry': 1500, 'wacanberry': 1500, 'yacheberry': 1500,
	'heavydutyboots': 7500,
	'focussash': 5000,
	'assaultvest': 9000,
	'eviolite': 8500,
	'airballoon': 4000,
	'heatrock': 4000, 'damprock': 4000, 'smoothrock': 4000, 'icyrock': 4000,
	'masterball': 100000,
	'freshwater': 250, 'sodapop': 350, 'lemonade': 450, 'moomoomilk': 600, 'tea': 750,
	'energyroot': 1200, 'energypowder': 500, 'healpowder': 450,
	'revive': 2000, 'maxrevive': 4000, 'revivalherb': 2800, 'sacredash': 20000,
	'expertbelt': 4000, 'weaknesspolicy': 5000,
	'lumberry': 2000, 'mentalherb': 3000, 'redcard': 3000, 'quickclaw': 4000,
	'mirrorherb': 6000, 'clearamulet': 5000, 'covertcloak': 4500,
	'kingsrock': 3500, 'scopelens': 4000, 'razorclaw': 4000,
	'lightclay': 4000, 'everstone': 2000,
	'terashard': 5000,
	'antidote': 100, 'paralyzeheal': 200, 'awakening': 250, 'burnheal': 250, 'iceheal': 250, 'fullheal': 600,
	'ether': 1200, 'maxether': 2000, 'elixir': 3000, 'maxelixir': 4500,
};

export const SHOP_INVENTORY: string[] = [
	'pokeball', 'greatball', 'ultraball', 'masterball', 'levelball', 'fastball', 'timerball', 'nestball', 'netball',
	'quickball', 'dreamball', 'premierball', 'luxuryball', 'healball', 'masterball',

	'potion', 'superpotion', 'hyperpotion', 'maxpotion', 'berryjuice', 'fullrestore',
	'freshwater', 'sodapop', 'lemonade', 'moomoomilk', 'tea', 'energyroot', 'energypowder', 'healpowder',
	'revive', 'maxrevive', 'revivalherb', 'sacredash',
	'antidote', 'paralyzeheal', 'awakening', 'burnheal', 'iceheal', 'fullheal',
	'ether', 'maxether', 'elixir', 'maxelixir',

	'oranberry', 'sitrusberry', 'goldberry', 'aguavberry', 'figyberry', 'iapapaberry', 'magoberry', 'wikiberry',
	'enigmaberry', 'jabocaberry', 'rowapberry', 'liechiberry', 'ganlonberry', 'salacberry', 'petayaberry',
	'apicotberry', 'starfberry', 'keberry', 'marangaberry', 'babiriberry', 'chartiberry', 'chilanberry',
	'chopleberry', 'cobaberry', 'colburberry', 'habanberry', 'kasibberry', 'kebiaberry', 'occaberry',
	'passhoberry', 'payapaberry', 'rindoberry', 'roseliberry', 'shucaberry', 'tangaberry', 'wacanberry', 'yacheberry',
	'lumberry',

	'leftovers', 'blacksludge', 'shellbell', 'lifeorb', 'rockyhelmet', 'stickybarb',
	'choiceband', 'choicescarf', 'choicespecs', 'flameorb', 'toxicorb',
	'heavydutyboots', 'focussash', 'assaultvest', 'eviolite', 'airballoon',
	'heatrock', 'damprock', 'smoothrock', 'icyrock',
	'expertbelt', 'weaknesspolicy', 'mentalherb', 'redcard',
	'quickclaw', 'mirrorherb', 'clearamulet', 'covertcloak', 'kingsrock', 'scopelens', 'razorclaw',
	'lightclay', 'everstone',

	'eggmovetutor',
	'rarecandy',
	'expcandyxs', 'expcandys', 'expcandym', 'expcandyl', 'expcandyxl',
	'terashard',
];

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
	ITEM_PRICES,
	SHOP_INVENTORY,
};

export default RPGItems;
