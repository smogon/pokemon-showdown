/*
* Pokemon Showdown
* RPG Items
*/
import { Dex } from '../../../sim/dex';
import type { InventoryItem, PlayerData, RPGPokemon, Stats } from './interface';
import { calculateStats, levelUp, checkEvolution, handleLearningMoves, calculateTotalExpForLevel, getMove, type CheckEvolutionContext } from './utils';

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
	
	// EV Vitamins
	'hpup': { id: 'hpup', name: 'HP Up', category: 'medicine', description: 'A nutritious drink. It raises the base HP EVs of a single Pokémon.' },
	'protein': { id: 'protein', name: 'Protein', category: 'medicine', description: 'A nutritious drink. It raises the base Attack EVs of a single Pokémon.' },
	'iron': { id: 'iron', name: 'Iron', category: 'medicine', description: 'A nutritious drink. It raises the base Defense EVs of a single Pokémon.' },
	'calcium': { id: 'calcium', name: 'Calcium', category: 'medicine', description: 'A nutritious drink. It raises the base Sp. Atk EVs of a single Pokémon.' },
	'zinc': { id: 'zinc', name: 'Zinc', category: 'medicine', description: 'A nutritious drink. It raises the base Sp. Def EVs of a single Pokémon.' },
	'carbos': { id: 'carbos', name: 'Carbos', category: 'medicine', description: 'A nutritious drink. It raises the base Speed EVs of a single Pokémon.' },

	'eggmovetutor': { id: 'eggmovetutor', name: 'Egg Move Tutor', category: 'misc', description: 'A special item that teaches a compatible Pokémon one of its Egg Moves.' },
	'rarecandy': { id: 'rarecandy', name: 'Rare Candy', category: 'misc', description: 'A candy that is packed with energy. When consumed, it will instantly raise the level of a single Pokémon by one.' },
	'expcandyxs': { id: 'expcandyxs', name: 'Exp. Candy XS', category: 'misc', description: 'A candy that is packed with energy. Gives 100 Exp. Points to a Pokémon.' },
	'expcandys': { id: 'expcandys', name: 'Exp. Candy S', category: 'misc', description: 'A candy that is packed with energy. Gives 800 Exp. Points to a Pokémon.' },
	'expcandym': { id: 'expcandym', name: 'Exp. Candy M', category: 'misc', description: 'A candy that is packed with energy. Gives 3,000 Exp. Points to a Pokémon.' },
	'expcandyl': { id: 'expcandyl', name: 'Exp. Candy L', category: 'misc', description: 'A candy that is packed with energy. Gives 10,000 Exp. Points to a Pokémon.' },
	'expcandyxl': { id: 'expcandyxl', name: 'Exp. Candy XL', category: 'misc', description: 'A candy that is packed with energy. Gives 30,000 Exp. Points to a Pokémon.' },
	'terashard': { id: 'terashard', name: 'Tera Shard', category: 'misc', description: 'A mysterious shard. When used on a Pokémon, it changes its Tera Type to a new, random type.' },
	
	// Evolution Stones
	'firestone': { id: 'firestone', name: 'Fire Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It is orange.' },
	'waterstone': { id: 'waterstone', name: 'Water Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It is blue.' },
	'thunderstone': { id: 'thunderstone', name: 'Thunder Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It has a lightning bolt pattern.' },
	'leafstone': { id: 'leafstone', name: 'Leaf Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It has a leaf pattern.' },
	'moonstone': { id: 'moonstone', name: 'Moon Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It is as black as the night sky.' },
	'sunstone': { id: 'sunstone', name: 'Sun Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It glows like the sun.' },
	'shinystone': { id: 'shinystone', name: 'Shiny Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It shines with a dazzling light.' },
	'duskstone': { id: 'duskstone', name: 'Dusk Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It holds a darkness within.' },
	'dawnstone': { id: 'dawnstone', name: 'Dawn Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It sparkles like a glimmer of hope.' },
	'icestone': { id: 'icestone', name: 'Ice Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It is cold to the touch.' },

	// Evolution Items (Held items that trigger evolution)
	'dragonscale': { id: 'dragonscale', name: 'Dragon Scale', category: 'misc', description: 'A thick, hard scale. When held by Seadra, it triggers evolution into Kingdra.' },
	'kingsrock': { id: 'kingsrock', name: 'King\'s Rock', category: 'misc', description: 'A peculiar rock that makes certain species of Pokémon evolve. Can make foes flinch when held.' },
	'metalcoat': { id: 'metalcoat', name: 'Metal Coat', category: 'misc', description: 'A special metallic coating. When held by Onix or Scyther, it triggers evolution.' },
	'upgrade': { id: 'upgrade', name: 'Up-Grade', category: 'misc', description: 'A transparent device. When held by Porygon, it triggers evolution into Porygon2.' },
	'dubiousdisc': { id: 'dubiousdisc', name: 'Dubious Disc', category: 'misc', description: 'A transparent device. When held by Porygon2, it triggers evolution into Porygon-Z.' },
	'protector': { id: 'protector', name: 'Protector', category: 'misc', description: 'A protective item. When held by Rhydon, it triggers evolution into Rhyperior.' },
	'electirizer': { id: 'electirizer', name: 'Electirizer', category: 'misc', description: 'An electric box. When held by Electabuzz, it triggers evolution into Electivire.' },
	'magmarizer': { id: 'magmarizer', name: 'Magmarizer', category: 'misc', description: 'A magma box. When held by Magmar, it triggers evolution into Magmortar.' },
	'reapercloth': { id: 'reapercloth', name: 'Reaper Cloth', category: 'misc', description: 'A cloth imbued with horrifyingly strong spiritual energy. When held by Dusclops, it triggers evolution into Dusknoir.' },
	'razorclaw': { id: 'razorclaw', name: 'Razor Claw', category: 'misc', description: 'A sharply hooked claw. When held by Sneasel, it triggers evolution into Weavile.' },
	'ovalstone': { id: 'ovalstone', name: 'Oval Stone', category: 'misc', description: 'A peculiar stone that makes Happiny evolve. It is shaped like an egg.' },
	'sachet': { id: 'sachet', name: 'Sachet', category: 'misc', description: 'A sachet filled with perfumes. When held by Spritzee, it triggers evolution into Aromatisse.' },
	'whippeddream': { id: 'whippeddream', name: 'Whipped Dream', category: 'misc', description: 'A soft and sweet treat. When held by Swirlix, it triggers evolution into Slurpuff.' },
	'blackaugurite': { id: 'blackaugurite', name: 'Black Augurite', category: 'misc', description: 'A glassy black stone. When held by Scyther, it triggers evolution into Kleavor.' },
	'metalalloy': { id: 'metalalloy', name: 'Metal Alloy', category: 'misc', description: 'A peculiar metal that makes Duraludon evolve into Archaludon.' },

	// Special Evolution Items
	'magnet': { id: 'magnet', name: 'Magnet', category: 'misc', description: 'A powerful magnet. When held by certain Pokémon, it triggers evolution. Also boosts Electric-type moves.' },
	'chipseal': { id: 'chipseal', name: 'Chipped Pot', category: 'misc', description: 'A cracked teapot. When used on Sinistea, it triggers evolution into Polteageist.' },
	'masterpiece': { id: 'masterpiece', name: 'Unremarkable Teacup', category: 'misc', description: 'An unremarkable teacup. When used on certain Ghost-type Pokémon, it triggers evolution.' },

	// Apple Items (for Applin evolutions)
	'tartapple': { id: 'tartapple', name: 'Tart Apple', category: 'misc', description: 'A very sour apple. When held by Applin, it triggers evolution into Flapple.' },
	'sweetapple': { id: 'sweetapple', name: 'Sweet Apple', category: 'misc', description: 'A very sweet apple. When held by Applin, it triggers evolution into Appletun.' },
	'syruppyapple': { id: 'syruppyapple', name: 'Syrupy Apple', category: 'misc', description: 'A peculiar apple. When held by Applin, it triggers evolution into Dipplin.' },
	'dragonchesto': { id: 'dragonchesto', name: 'Dragon Chesto', category: 'misc', description: 'A rare dragon fruit. When held by Dipplin, it triggers evolution into Hydrapple.' },

	// Trade Evolution Items (Special cases for trade evolutions converted to item-based)
	'tradehelmet': { id: 'tradehelmet', name: 'Shelmet Shell', category: 'misc', description: 'A discarded Shelmet shell. When held by Karrablast, it triggers evolution into Escavalier.' },
	'tradekarrablast': { id: 'tradekarrablast', name: 'Karrablast Shell', category: 'misc', description: 'A discarded Karrablast shell. When held by Shelmet, it triggers evolution into Accelgor.' },

	// Legendary/Mythical Evolution Items
	'towerscrolls': { id: 'towerscrolls', name: 'Tower Scroll', category: 'misc', description: 'An ancient scroll from the Tower of Darkness. When held by Kubfu, it triggers evolution into Urshifu (Single Strike).' },
	'waterscroll': { id: 'waterscroll', name: 'Water Scroll', category: 'misc', description: 'An ancient scroll from the Tower of Waters. When held by Kubfu, it triggers evolution into Urshifu (Rapid Strike).' },

	// Valuable Items
	'nugget': { id: 'nugget', name: 'Nugget', category: 'misc', description: 'A nugget of pure gold. It can be sold at a high price to shops.' },
	'bignugget': { id: 'bignugget', name: 'Big Nugget', category: 'misc', description: 'A very large nugget of pure gold. It can be sold at a very high price to shops.' },
	'pearl': { id: 'pearl', name: 'Pearl', category: 'misc', description: 'A small, pretty pearl. It can be sold cheaply to shops.' },
	'bigpearl': { id: 'bigpearl', name: 'Big Pearl', category: 'misc', description: 'A large, lustrous pearl. It can be sold at a high price to shops.' },
	'starpiece': { id: 'starpiece', name: 'Star Piece', category: 'misc', description: 'A shard of a red gem. It can be sold at a high price to shops.' },
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

	// Status Healers
	'antidote': 100, 'paralyzeheal': 200, 'awakening': 250, 'burnheal': 250, 'iceheal': 250, 'fullheal': 600,
	// PP Restore
	'ether': 1200, 'maxether': 2000, 'elixir': 3000, 'maxelixir': 4500,
	// Evo Stones
	'firestone': 3000, 'waterstone': 3000, 'thunderstone': 3000, 'leafstone': 3000,
	'moonstone': 5000, 'sunstone': 3000, 'shinystone': 5000, 'duskstone': 5000, 'dawnstone': 5000, 'icestone': 3000,
	// Evolution Items
	'dragonscale': 4000, 'metalcoat': 4000, 'upgrade': 4000, 'dubiousdisc': 4000,
	'protector': 4000, 'electirizer': 4000, 'magmarizer': 4000, 'reapercloth': 4000,
	'ovalstone': 3000, 'sachet': 4000, 'whippeddream': 4000, 'blackaugurite': 5000,
	'metalalloy': 5000, 'magnet': 3000, 'chipseal': 3500, 'masterpiece': 5000,
	// Apple Items
	'tartapple': 3500, 'sweetapple': 3500, 'syruppyapple': 4000, 'dragonchesto': 5000,
	// Trade Evolution Items
	'tradehelmet': 4500, 'tradekarrablast': 4500,
	// Legendary Items
	'towerscrolls': 10000, 'waterscroll': 10000,
	// Vitamins
	'hpup': 9800, 'protein': 9800, 'iron': 9800, 'calcium': 9800, 'zinc': 9800, 'carbos': 9800,
	// Valuable Items (Sell Price)
	'nugget': 5000, 'bignugget': 10000, 'pearl': 700, 'bigpearl': 3750, 'starpiece': 6000,
};

export const SHOP_INVENTORY: string[] = [
	'pokeball', 'greatball', 'ultraball', 'masterball', 'levelball', 'fastball', 'timerball', 'nestball', 'netball',
	'quickball', 'dreamball', 'premierball', 'luxuryball', 'healball', 'masterball',

	'potion', 'superpotion', 'hyperpotion', 'maxpotion', 'berryjuice', 'fullrestore',
	'freshwater', 'sodapop', 'lemonade', 'moomoomilk', 'tea', 'energyroot', 'energypowder', 'healpowder',
	'revive', 'maxrevive', 'revivalherb', 'sacredash',
	// Status Healers
	'antidote', 'paralyzeheal', 'awakening', 'burnheal', 'iceheal', 'fullheal',
	// PP Restore
	'ether', 'maxether', 'elixir', 'maxelixir',
	// Vitamins
	'hpup', 'protein', 'iron', 'calcium', 'zinc', 'carbos',

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
	// Evo Stones
	'firestone', 'waterstone', 'thunderstone', 'leafstone', 'moonstone', 'sunstone', 'shinystone', 'duskstone', 'dawnstone', 'icestone',
	// Evolution Items
	'dragonscale', 'metalcoat', 'upgrade', 'dubiousdisc', 'protector', 'electirizer', 'magmarizer', 'reapercloth',
	'ovalstone', 'sachet', 'whippeddream', 'blackaugurite', 'metalalloy', 'magnet', 'chipseal', 'masterpiece',
	// Apple Items
	'tartapple', 'sweetapple', 'syruppyapple', 'dragonchesto',
	// Trade Evolution Items
	'tradehelmet', 'tradekarrablast',
	// Legendary Items
	'towerscrolls', 'waterscroll',
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

function getExpCandyAmount(itemId: string): number {
	switch (itemId) {
	case 'expcandyxs': return 100;
	case 'expcandys': return 800;
	case 'expcandym': return 3000;
	case 'expcandyl': return 10000;
	case 'expcandyxl': return 30000;
	default: return 0;
	}
}

export function useHealingItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	if (pokemon.hp <= 0) {
		return { success: false, message: `${pokemon.species} has fainted!` };
	}

	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData || (itemData.category !== 'medicine' && itemId !== 'berryjuice')) {
		return { success: false, message: `This item cannot be used to heal.` };
	}

	if (itemId === 'healpowder') {
		if (!pokemon.status) {
			return { success: false, message: `${pokemon.species} is not affected by any status condition.` };
		}
		pokemon.status = null;
		removeItemFromInventory(player, itemId, 1);
		return { success: true, message: `You used <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! Its status condition was healed.` };
	}

	if (pokemon.hp >= pokemon.maxHp) {
		return { success: false, message: `${pokemon.species} is already at full health!` };
	}

	let healAmount = 0;
	switch (itemId) {
	case 'potion':
		healAmount = 20;
		break;
	case 'superpotion':
		healAmount = 60;
		break;
	case 'hyperpotion':
		healAmount = 120;
		break;
	case 'maxpotion':
	case 'fullrestore':
		healAmount = pokemon.maxHp;
		break;
	case 'berryjuice':
		healAmount = 20;
		break;
	case 'freshwater':
		healAmount = 50;
		break;
	case 'sodapop':
		healAmount = 60;
		break;
	case 'lemonade':
		healAmount = 80;
		break;
	case 'moomoomilk':
		healAmount = 100;
		break;
	case 'tea':
		healAmount = 120;
		break;
	case 'energyroot':
		healAmount = 200;
		break;
	case 'energypowder':
		healAmount = 50;
		break;
	default:
		return { success: false, message: `The healing effect for ${itemData.name} is not defined.` };
	}

	const previousHp = pokemon.hp;
	pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
	const hpRestored = pokemon.hp - previousHp;

	let message = `You used a <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! It recovered ${hpRestored} HP!`;

	if (itemId === 'fullrestore' && pokemon.status) {
		pokemon.status = null;
		message += `<br>${pokemon.species}'s status condition was healed.`;
	}

	removeItemFromInventory(player, itemId, 1);
	return { success: true, message };
}

export function useRevivalItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	// Revival items can only be used on fainted Pokemon
	if (pokemon.hp > 0) {
		return { success: false, message: `${pokemon.species} has not fainted!` };
	}

	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData || itemData.category !== 'medicine') {
		return { success: false, message: `This item cannot be used to revive.` };
	}

	let hpRestored = 0;
	let friendshipChange = 0;
	let message = '';

	switch (itemId) {
	case 'revive':
		// Revive restores 50% of max HP (minimum 1 HP)
		hpRestored = Math.max(1, Math.floor(pokemon.maxHp / 2));
		message = `You used a <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! It was revived with ${hpRestored} HP!`;
		break;
	case 'maxrevive':
		// Max Revive restores full HP
		hpRestored = pokemon.maxHp;
		message = `You used a <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! It was revived with full HP!`;
		break;
	case 'revivalherb':
		// Revival Herb restores full HP but lowers friendship by 10-15 points (using 10)
		hpRestored = pokemon.maxHp;
		friendshipChange = -10;
		message = `You used a <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! It was revived with full HP!`;
		break;
	default:
		return { success: false, message: `The revival effect for ${itemData.name} is not defined.` };
	}

	// Restore HP
	pokemon.hp = hpRestored;

	// Clear status condition (revival removes status)
	pokemon.status = null;

	// Apply friendship change if applicable
	if (friendshipChange !== 0) {
		pokemon.friendship = Math.max(0, Math.min(255, pokemon.friendship + friendshipChange));
		message += `<br>${pokemon.species}'s friendship decreased...`;
	}

	// Restore all move PP to their maximum
	for (const move of pokemon.moves) {
		const moveData = getMove(move.id);
		move.pp = moveData.pp || 5;
	}

	removeItemFromInventory(player, itemId, 1);
	return { success: true, message };
}

export function useSacredAsh(player: PlayerData): { success: boolean, message: string } {
	const itemData = ITEMS_DATABASE['sacredash'];
	if (!itemData) {
		return { success: false, message: `Sacred Ash not found.` };
	}

	// Check if there are any fainted Pokemon
	const faintedPokemon = player.party.filter(p => p.hp <= 0);
	if (faintedPokemon.length === 0) {
		return { success: false, message: `No Pokémon need to be revived!` };
	}

	// Revive all fainted Pokemon
	let revivedCount = 0;
	const revivedNames: string[] = [];
	for (const pokemon of player.party) {
		if (pokemon.hp <= 0) {
			pokemon.hp = pokemon.maxHp;
			pokemon.status = null;
			// Restore all move PP
			for (const move of pokemon.moves) {
				const moveData = getMove(move.id);
				move.pp = moveData.pp || 5;
			}
			revivedCount++;
			revivedNames.push(pokemon.species);
		}
	}

	removeItemFromInventory(player, 'sacredash', 1);
	const message = `You used <strong>${itemData.name}</strong>! All fainted Pokémon were revived with full HP!<br>` +
		`<strong>Revived:</strong> ${revivedNames.join(', ')}`;
	return { success: true, message };
}

export function useRareCandyItem(player: PlayerData, pokemon: RPGPokemon, room: CheckEvolutionContext['room'], user: CheckEvolutionContext['user']): { success: boolean, message: string } {
	// Validate pokemon exists and has valid data
	if (!pokemon?.species) {
		return { success: false, message: `Invalid Pokémon data!` };
	}

	// Cannot use on fainted Pokémon
	if (pokemon.hp <= 0) {
		return { success: false, message: `${pokemon.species} has fainted!` };
	}

	// Cannot use on level 100 Pokémon
	if (pokemon.level >= 100) {
		return { success: false, message: `${pokemon.species} is already at level 100!` };
	}

	// Validate level is within acceptable range
	if (pokemon.level < 1 || pokemon.level > 99) {
		return { success: false, message: `${pokemon.species} has an invalid level!` };
	}

	// Ensure HP doesn't exceed max HP (data integrity check)
	if (pokemon.hp > pokemon.maxHp) {
		pokemon.hp = pokemon.maxHp;
	}

	// Level up the Pokémon (wrapped in try-catch for safety)
	const messages: string[] = [];
	try {
		messages.push(...levelUp(pokemon));

		// Set experience to the minimum required for the new level (Rare Candy behavior)
		pokemon.experience = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);

		// Check for evolution
		const evolveMessage = checkEvolution(player, pokemon, { room, user });
		if (evolveMessage) {
			messages.push(evolveMessage);
		} else {
			// Only check for move learning if no evolution occurred
			// (checkEvolution already handles move learning after evolution)
			const { messages: newMoveMessages } = handleLearningMoves(player, pokemon);
			messages.push(...newMoveMessages);
		}

		// Increase friendship (Rare Candy gives +5/+3 friendship in official games)
		// Cap at 255 (max friendship), ensure non-negative
		if (pokemon.friendship < 0) {
			pokemon.friendship = 0;
		}
		if (pokemon.friendship < 255) {
			pokemon.friendship = Math.min(255, pokemon.friendship + 3);
		}
	} catch (error) {
		// If anything fails, don't consume the item
		return { success: false, message: `An error occurred while using Rare Candy. Please try again.` };
	}

	// Only remove item AFTER successful level up (prevents item loss on error)
	removeItemFromInventory(player, 'rarecandy', 1);

	const resultMessage = `You used a <strong>Rare Candy</strong> on <strong>${pokemon.species}</strong>!<br>${messages.join('<br>')}`;
	return { success: true, message: resultMessage };
}

export function useExpCandyItem(player: PlayerData, pokemon: RPGPokemon, itemId: string, room: CheckEvolutionContext['room'], user: CheckEvolutionContext['user']): { success: boolean, message: string } {
	// Validate pokemon exists and has valid data
	if (!pokemon?.species) {
		return { success: false, message: `Invalid Pokémon data!` };
	}

	// Cannot use on fainted Pokémon
	if (pokemon.hp <= 0) {
		return { success: false, message: `${pokemon.species} has fainted!` };
	}

	// Cannot use on level 100 Pokémon (pointless, can't gain more levels)
	if (pokemon.level >= 100) {
		return { success: false, message: `${pokemon.species} is already at level 100!` };
	}

	// Validate level is within acceptable range
	if (pokemon.level < 1 || pokemon.level > 99) {
		return { success: false, message: `${pokemon.species} has an invalid level!` };
	}

	// Get EXP amount based on candy type
	const expAmount = getExpCandyAmount(itemId);
	if (expAmount === 0) {
		return { success: false, message: `Invalid Exp. Candy type!` };
	}

	// Ensure HP doesn't exceed max HP (data integrity check)
	if (pokemon.hp > pokemon.maxHp) {
		pokemon.hp = pokemon.maxHp;
	}

	// Ensure experience is non-negative (data integrity check)
	if (pokemon.experience < 0) {
		pokemon.experience = 0;
	}

	// Add experience and handle level ups
	const messages: string[] = [];
	try {
		// Add experience
		pokemon.experience += expAmount;
		messages.push(`**${pokemon.species} gained ${expAmount} Experience Points!**`);

		let leveledUp = false;
		let evolved = false;

		// Level up loop (similar to gainExperience function)
		while (pokemon.experience >= pokemon.expToNextLevel && pokemon.level < 100) {
			messages.push(...levelUp(pokemon));
			leveledUp = true;

			// Check for evolution
			const evolveMessage = checkEvolution(player, pokemon, { room, user });
			if (evolveMessage) {
				messages.push(evolveMessage);
				evolved = true;
				break; // Stop after evolution to prevent multiple evolutions
			}

			// Check for move learning (only if no evolution)
			const { messages: newMoveMessages } = handleLearningMoves(player, pokemon);
			messages.push(...newMoveMessages);
		}

		// If no level up, show current progress
		if (!leveledUp) {
			const expNeeded = pokemon.expToNextLevel - pokemon.experience;
			messages.push(`<i>${expNeeded} EXP points needed for Level ${pokemon.level + 1}.</i>`);
		}

		// Increase friendship slightly (EXP Candies give +1 friendship in official games)
		// Cap at 255 (max friendship), ensure non-negative
		if (pokemon.friendship < 0) {
			pokemon.friendship = 0;
		}
		if (pokemon.friendship < 255) {
			pokemon.friendship = Math.min(255, pokemon.friendship + 1);
		}
	} catch (error) {
		// If anything fails, don't consume the item
		return { success: false, message: `An error occurred while using Exp. Candy. Please try again.` };
	}

	// Only remove item AFTER successful experience gain (prevents item loss on error)
	removeItemFromInventory(player, itemId, 1);

	const itemData = ITEMS_DATABASE[itemId];
	const resultMessage = `You used an <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>!<br>${messages.join('<br>')}`;
	return { success: true, message: resultMessage };
}

export function useVitaminItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData) return { success: false, message: "Invalid item." };

	if (pokemon.hp <= 0) {
		return { success: false, message: `${pokemon.species} has fainted!` };
	}

	const statMap: Record<string, keyof Stats> = {
		'hpup': 'hp',
		'protein': 'atk',
		'iron': 'def',
		'calcium': 'spa',
		'zinc': 'spd',
		'carbos': 'spe',
	};

	const statToBoost = statMap[itemId] as keyof Omit<Stats, 'maxHp'>; // 'hp' will be handled manually
	if (!statToBoost && itemId !== 'hpup') {
		return { success: false, message: "This item is not a vitamin." };
	}

	const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	if (totalEVs >= 510) {
		return { success: false, message: `${pokemon.species} has already reached its maximum EV limit (510)!` };
	}

	const evStat = (itemId === 'hpup') ? 'hp' : statToBoost;
	const currentEV = pokemon.evs[evStat];

	// In modern games, vitamins can be used up to 252 EVs.
	// Let's assume they give 10 EVs, but only up to 252.
	if (currentEV >= 252) {
		return { success: false, message: `${pokemon.species}'s ${evStat.toUpperCase()} EVs are already maxed out (252)!` };
	}

	const evGain = 10;
	// Can't go over 252 in one stat, and can't go over 510 total
	const evToAdd = Math.min(evGain, 252 - currentEV, 510 - totalEVs);

	if (evToAdd <= 0) {
		// This should be caught by the earlier checks, but good to have
		return { success: false, message: `${pokemon.species}'s EVs could not be raised.` };
	}

	pokemon.evs[evStat] += evToAdd;

	// Recalculate stats immediately
	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	
	const hpDiff = newStats.maxHp - pokemon.maxHp;
	// If HP stat was boosted, add the difference to current HP
	if (hpDiff > 0 && pokemon.hp > 0) {
		pokemon.hp += hpDiff;
	}
	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;
	
	removeItemFromInventory(player, itemId, 1);
	return { success: true, message: `You used an <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! Its ${evStat.toUpperCase()} EVs rose!` };
}

export const RPGItems = {
	getItemData,
	addItemToInventory,
	removeItemFromInventory,
	useVitaminItem,
	useHealingItem,
	useRevivalItem,
	useSacredAsh,
	useRareCandyItem,
	useExpCandyItem,
	CUSTOM_ITEMS_DATABASE,
	ITEMS_DATABASE,
	ITEM_PRICES,
	SHOP_INVENTORY,
};

export default RPGItems;
