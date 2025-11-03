// Pokemon RPG Plugin for Pokemon Showdown
import { MANUAL_CATCH_RATES } from './MANUAL_CATCH_RATES';
import { MANUAL_BASE_EXP } from './MANUAL_BASE_EXP';
import { MANUAL_EV_YIELDS } from './MANUAL_EV_YIELDS';
import { MANUAL_EVOLUTIONS } from './MANUAL_EVOLUTIONS';
import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';
import { CUSTOM_MOVES, isCustomMove, getCustomMove, type CustomMove } from './CUSTOM_MOVES';
import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import type { RPGPokemon, InventoryItem, ActivePokemonSlot, PlayerData, Status, BattleState, Stats, TrainerSpec, Move } from './interface';

const activeBattles = new Map<string, BattleState>();

// ================ Player State Management ================
class RPGPlayerState {
	// In-memory storage for player data
	private static playerData = new Map<string, PlayerData>();
	private static instances = new Map<string, RPGPlayerState>();
	private static readonly CLEANUP_INTERVAL = 300000; // 5 minutes

	private player: PlayerData;

	private constructor(userId: string, playerData?: PlayerData) {
		this.player = playerData || this.createNewPlayer(userId);
	}

	static getInstance(userId: string): RPGPlayerState {
		if (!this.instances.has(userId)) {
			// Try to get from in-memory map first
			const playerData = RPGPlayerState.playerData.get(userId);
			this.instances.set(userId, new RPGPlayerState(userId, playerData));
		}
		const instance = this.instances.get(userId)!;
		instance.player.lastAction = Date.now(); // Update activity timer
		return instance;
	}

	/**
	 * Cleans up inactive player instances from memory (not the data itself).
	 */
	static cleanup(): void {
		const now = Date.now();
		for (const [userId, instance] of this.instances.entries()) {
			if (now - instance.player.lastAction > this.CLEANUP_INTERVAL) {
				this.instances.delete(userId);
			}
		}
	}

	private createNewPlayer(userId: string): PlayerData {
		const newPlayer: PlayerData = {
			id: userId,
			name: userId,
			level: 1,
			experience: 0,
			badges: 0,
			party: [],
			location: 'Starter Town',
			money: 5000000,
			inventory: new Map(),
			pc: new Map(),
			currentView: 'start', // Start at the 'start' screen
			lastAction: Date.now(),
		};
		// Add starting items
		// Note: We must use the newPlayer object directly since updatePlayer isn't available yet
		const pokeball = ITEMS_DATABASE['pokeball'];
		if (pokeball) newPlayer.inventory.set('pokeball', { ...pokeball, quantity: 5 });
		const potion = ITEMS_DATABASE['potion'];
		if (potion) newPlayer.inventory.set('potion', { ...potion, quantity: 3 });

		// Save to the static in-memory map
		RPGPlayerState.playerData.set(userId, newPlayer);
		return newPlayer;
	}

	getPlayer(): PlayerData {
		// Return the direct reference to be modified
		return this.player;
	}

	updatePlayer(updates: Partial<PlayerData>): void {
		// Apply updates directly to the in-memory object
		Object.assign(this.player, updates);
		this.player.lastAction = Date.now();
		// No need to mark dirty, as it's just in-memory
	}
}

// Start cleanup interval
setInterval(() => RPGPlayerState.cleanup(), 60000); // Every minute

// Custom RPG items that don't exist in Dex - these are hardcoded
// All other items (pokeballs, berries, held items) are retrieved from Dex.items
const CUSTOM_ITEMS_DATABASE: Record<string, Omit<InventoryItem, 'quantity'>> = {
	// Medicine (RPG-specific healing items not in competitive Pokemon)
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
	// Misc (RPG-specific custom item)
	'eggmovetutor': { id: 'eggmovetutor', name: 'Egg Move Tutor', category: 'misc', description: 'A special item that teaches a compatible Pokémon one of its Egg Moves.' },
};

/**
 * Get item data from Dex with fallback to custom items
 * This function retrieves items from Dex.items where possible, and falls back to CUSTOM_ITEMS_DATABASE for RPG-specific items
 */
function getItemData(itemId: string): Omit<InventoryItem, 'quantity'> | null {
	// First check if it's a custom RPG item
	if (CUSTOM_ITEMS_DATABASE[itemId]) {
		return CUSTOM_ITEMS_DATABASE[itemId];
	}

	// Try to get from Dex
	const dexItem = Dex.items.get(itemId);
	if (dexItem.exists) {
		// Determine category based on Dex properties
		let category: InventoryItem['category'] = 'held'; // default
		if (dexItem.isPokeball) {
			category = 'pokeball';
		} else if (dexItem.isBerry) {
			category = 'berry';
		}

		// Use shortDesc if available, otherwise use desc or a generic message
		const description = dexItem.shortDesc || dexItem.desc || 'An item.';

		return {
			id: itemId,
			name: dexItem.name,
			category,
			description,
		};
	}

	// Item doesn't exist in Dex or custom database
	return null;
}

// Legacy ITEMS_DATABASE for backwards compatibility - now dynamically retrieves from Dex
const ITEMS_DATABASE = new Proxy({} as Record<string, Omit<InventoryItem, 'quantity'>>, {
	get(target, prop: string) {
		return getItemData(prop);
	},
});

// Starter Pokemon data organized by type
const STARTER_POKEMON = {
	fire: ['charmander', 'cyndaquil', 'torchic', 'chimchar', 'tepig'],
	water: ['squirtle', 'totodile', 'mudkip', 'piplup', 'oshawott'],
	grass: ['bulbasaur', 'chikorita', 'treeko', 'turtwig', 'snivy'],
};

const ENCOUNTER_ZONES: Record<string, { name: string, pokemon: string[], levelRange: [number, number], battleType?: 'single' | 'double' }> = {
	'startertown_grass': {
		name: 'Tall Grass',
		pokemon: ['pidgey', 'rattata', 'caterpie', 'weedle'],
		levelRange: [5, 7],
		battleType: 'single',
	},
	'startertown_pond': {
		name: 'Pond',
		pokemon: ['magikarp', 'feebas'],
		levelRange: [9, 20],
		battleType: 'single',
	},
	'startertown_doubles_grass': {
		name: 'Shaking Grass',
		pokemon: ['pidgey', 'rattata', 'nidoranf', 'nidoranm'],
		levelRange: [6, 8],
		battleType: 'double',
	},
	// 'route2_grass': {
	// 	name: 'Route 2 Tall Grass',
	// 	pokemon: ['zubat', 'geodude', 'sentret'],
	// 	levelRange: [5, 8],
	// },
};

const BERRY_FLAVORS: Record<string, { flavor: string, stat: keyof Stats }> = {
	'figyberry': { flavor: 'Spicy', stat: 'atk' },
	'wikiberry': { flavor: 'Dry', stat: 'spa' },
	'magoberry': { flavor: 'Sweet', stat: 'spe' },
	'aguavberry': { flavor: 'Bitter', stat: 'spd' },
	'iapapaberry': { flavor: 'Sour', stat: 'def' },
};

const NATURE_FLAVOR_PREFERENCES: Record<keyof Stats, string> = {
	atk: 'Spicy', def: 'Sour', spa: 'Dry', spd: 'Bitter', spe: 'Sweet', maxHp: '',
};

const ITEM_PRICES: Record<string, number> = {
	'pokeball': 200, 'greatball': 600, 'ultraball': 800, 'potion': 300, 'superpotion': 700, 'hyperpotion': 1200, 'maxpotion': 2500, 'fullrestore': 3000, 'eggmovetutor': 3000,
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
	'heatrock': 4000,
	'damprock': 4000,
	'smoothrock': 4000,
	'icyrock': 4000,
	'masterball': 100000,
	'freshwater': 250,
	'sodapop': 350,
	'lemonade': 450,
	'moomoomilk': 600,
	'tea': 750,
	'energyroot': 1200,
	'energypowder': 500,
	'healpowder': 450,
	'expertbelt': 4000,
	'weaknesspolicy': 5000,
	'lumberry': 2000,
	'mentalherb': 3000,
	'redcard': 3000,
	'quickclaw': 4000,
	'mirrorherb': 6000,
	'clearamulet': 5000,
	'covertcloak': 4500,
	'kingsrock': 3500,
	'scopelens': 4000,
	'razorclaw': 4000,
	'lightclay': 4000,
};

const SHOP_INVENTORY: string[] = [
	// Poke Balls
	'pokeball', 'greatball', 'ultraball', 'masterball', 'levelball', 'fastball', 'timerball', 'nestball', 'netball',
	'quickball', 'dreamball', 'premierball', 'luxuryball', 'healball', 'masterball',

	// Potions & Healing Items
	'potion', 'superpotion', 'hyperpotion', 'maxpotion', 'berryjuice', 'fullrestore',
	'freshwater', 'sodapop', 'lemonade', 'moomoomilk', 'tea', 'energyroot', 'energypowder', 'healpowder',

	// Berries
	'oranberry', 'sitrusberry', 'goldberry', 'aguavberry', 'figyberry', 'iapapaberry', 'magoberry', 'wikiberry',
	'enigmaberry', 'jabocaberry', 'rowapberry', 'liechiberry', 'ganlonberry', 'salacberry', 'petayaberry',
	'apicotberry', 'starfberry', 'keberry', 'marangaberry', 'babiriberry', 'chartiberry', 'chilanberry',
	'chopleberry', 'cobaberry', 'colburberry', 'habanberry', 'kasibberry', 'kebiaberry', 'occaberry',
	'passhoberry', 'payapaberry', 'rindoberry', 'roseliberry', 'shucaberry', 'tangaberry', 'wacanberry', 'yacheberry',
	'lumberry',

	// Held Items
	'leftovers', 'blacksludge', 'shellbell', 'lifeorb', 'rockyhelmet', 'stickybarb',
	'choiceband', 'choicescarf', 'choicespecs', 'flameorb', 'toxicorb',
	'heavydutyboots', 'focussash', 'assaultvest', 'eviolite', 'airballoon',
	'heatrock', 'damprock', 'smoothrock', 'icyrock',
	'expertbelt', 'weaknesspolicy', 'mentalherb', 'redcard',
	'quickclaw', 'mirrorherb', 'clearamulet', 'covertcloak', 'kingsrock', 'scopelens', 'razorclaw',
	'lightclay',

	// Misc Items
	'eggmovetutor',
];

const TYPE_RESIST_BERRIES: Record<string, string> = {
	'babiriberry': 'Steel', 'chartiberry': 'Rock', 'chilanberry': 'Normal', 'chopleberry': 'Fighting',
	'cobaberry': 'Flying', 'colburberry': 'Dark', 'habanberry': 'Dragon', 'kasibberry': 'Ghost',
	'kebiaberry': 'Poison', 'occaberry': 'Fire', 'passhoberry': 'Water', 'payapaberry': 'Psychic',
	'rindoberry': 'Grass', 'roseliberry': 'Fairy', 'shucaberry': 'Ground', 'tangaberry': 'Bug',
	'wacanberry': 'Electric', 'yacheberry': 'Ice',
};

// Type Chart
const TYPE_CHART: { [type: string]: { superEffective: string[], notVeryEffective: string[], noEffect: string[] } } = {
	Normal: { superEffective: [], notVeryEffective: ['Rock', 'Steel'], noEffect: ['Ghost'] },
	Fire: { superEffective: ['Grass', 'Ice', 'Bug', 'Steel'], notVeryEffective: ['Fire', 'Water', 'Rock', 'Dragon'], noEffect: [] },
	Water: { superEffective: ['Fire', 'Ground', 'Rock'], notVeryEffective: ['Water', 'Grass', 'Dragon'], noEffect: [] },
	Grass: { superEffective: ['Water', 'Ground', 'Rock'], notVeryEffective: ['Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel'], noEffect: [] },
	Electric: { superEffective: ['Water', 'Flying'], notVeryEffective: ['Grass', 'Electric', 'Dragon'], noEffect: ['Ground'] },
	Ice: { superEffective: ['Grass', 'Ground', 'Flying', 'Dragon'], notVeryEffective: ['Fire', 'Water', 'Ice', 'Steel'], noEffect: [] },
	Fighting: { superEffective: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'], notVeryEffective: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy'], noEffect: ['Ghost'] },
	Poison: { superEffective: ['Grass', 'Fairy'], notVeryEffective: ['Poison', 'Ground', 'Rock', 'Ghost'], noEffect: ['Steel'] },
	Ground: { superEffective: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'], notVeryEffective: ['Grass', 'Bug'], noEffect: ['Flying'] },
	Flying: { superEffective: ['Grass', 'Fighting', 'Bug'], notVeryEffective: ['Electric', 'Rock', 'Steel'], noEffect: [] },
	Psychic: { superEffective: ['Fighting', 'Poison'], notVeryEffective: ['Psychic', 'Steel'], noEffect: ['Dark'] },
	Bug: { superEffective: ['Grass', 'Psychic', 'Dark'], notVeryEffective: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy'], noEffect: [] },
	Rock: { superEffective: ['Fire', 'Ice', 'Flying', 'Bug'], notVeryEffective: ['Fighting', 'Ground', 'Steel'], noEffect: [] },
	Ghost: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Dark'], noEffect: ['Normal'] },
	Dragon: { superEffective: ['Dragon'], notVeryEffective: ['Steel'], noEffect: ['Fairy'] },
	Dark: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Fighting', 'Dark', 'Fairy'], noEffect: [] },
	Steel: { superEffective: ['Ice', 'Rock', 'Fairy'], notVeryEffective: ['Fire', 'Water', 'Electric', 'Steel'], noEffect: [] },
	Fairy: { superEffective: ['Fighting', 'Dragon', 'Dark'], notVeryEffective: ['Fire', 'Poison', 'Steel'], noEffect: [] },
};

const NATURES: Record<string, { plus: keyof Stats, minus: keyof Stats } | null> = {
	'Adamant': { plus: 'atk', minus: 'spa' }, 'Bashful': null, 'Brave': { plus: 'atk', minus: 'spe' }, 'Bold': { plus: 'def', minus: 'atk' }, 'Calm': { plus: 'spd', minus: 'atk' }, 'Careful': { plus: 'spd', minus: 'spa' }, 'Docile': null, 'Gentle': { plus: 'spd', minus: 'def' }, 'Hardy': null, 'Hasty': { plus: 'spe', minus: 'def' }, 'Impish': { plus: 'def', minus: 'spa' }, 'Jolly': { plus: 'spe', minus: 'spa' }, 'Lax': { plus: 'def', minus: 'spd' }, 'Lonely': { plus: 'atk', minus: 'def' }, 'Mild': { plus: 'spa', minus: 'def' }, 'Modest': { plus: 'spa', minus: 'atk' }, 'Naive': { plus: 'spe', minus: 'spd' }, 'Naughty': { plus: 'atk', minus: 'spd' }, 'Quiet': { plus: 'spa', minus: 'spe' }, 'Quirky': null, 'Rash': { plus: 'spa', minus: 'spd' }, 'Relaxed': { plus: 'def', minus: 'spe' }, 'Sassy': { plus: 'spd', minus: 'spe' }, 'Serious': null, 'Timid': { plus: 'spe', minus: 'atk' },
};
const NATURE_LIST = Object.keys(NATURES);

// Database for all trainers
const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	'rival_1': {
		name: 'Rival',
		money: 500,
		party: [
			{ species: 'eevee', level: 5, item: 'oranberry' },
		],
		dialogue: {
			start: "Wait up! Let's see whose Pokémon is stronger!",
			win: "What? I... I lost?!",
			lose: "Heh! I'm stronger than you!",
		},
	},
	'gym_brock': {
		name: 'Gym Leader Brock',
		money: 1000,
		party: [
			{ species: 'geodude', level: 12, moves: ['tackle', 'rockthrow'] },
			{ species: 'onix', level: 14, moves: ['tackle', 'rockthrow', 'bind', 'harden'], item: 'sitrusberry' },
		],
		dialogue: {
			start: "I'm Brock! I'm the Gym Leader of Pewter City! My rock-hard will is evident in my Pokémon!",
			win: "I... I lost? As proof of your victory, here is the Boulder Badge!",
			lose: "My Pokémon are as solid as rock!",
		},
	},
	// Add more trainers, evil team members, etc. here
};

/****************
* Core Functions
****************/

function getCustomEffectiveness(moveType: string, defenderTypes: string[], defender: RPGPokemon, battle: BattleState): number {
	let effectiveness = 1;
	const chartEntry = TYPE_CHART[moveType];
	if (!chartEntry) return 1;
	for (const defenderType of defenderTypes) {
		if (chartEntry.superEffective.includes(defenderType)) {
			effectiveness *= 2;
		} else if (chartEntry.notVeryEffective.includes(defenderType)) {
			effectiveness *= 0.5;
		} else if (chartEntry.noEffect.includes(defenderType)) {
			effectiveness *= 0;
		}
	}
	return effectiveness;
}

function calculateTotalExpForLevel(growthRate: string, level: number): number {
	const n = level;
	switch (growthRate) {
	case 'Slow':
		return Math.floor((5 * n ** 3) / 4);
	case 'Medium Fast':
		return Math.floor(n ** 3);
	case 'Fast':
		return Math.floor((4 * n ** 3) / 5);
	case 'Medium Slow':
		return Math.floor(((6 / 5) * n ** 3) - (15 * n ** 2) + (100 * n) - 140);
	case 'Erratic':
		if (n <= 50) return Math.floor((n ** 3 * (100 - n)) / 50);
		if (n <= 68) return Math.floor((n ** 3 * (150 - n)) / 100);
		if (n <= 98) return Math.floor((n ** 3 * Math.floor((1911 - 10 * n) / 3)) / 500);
		return Math.floor((n ** 3 * (160 - n)) / 100);
	case 'Fluctuating':
		if (n <= 15) return Math.floor(n ** 3 * ((Math.floor((n + 1) / 3) + 24) / 50));
		if (n <= 36) return Math.floor(n ** 3 * ((n + 14) / 50));
		return Math.floor(n ** 3 * ((Math.floor(n / 2) + 32) / 50));
	default:
		return Math.floor(n ** 3);
	}
}

function generateUniqueId(): string {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Gets the player data from the in-memory state manager.
 * This is now a lightweight wrapper for RPGPlayerState.getInstance.
 * @param userid
 * @returns {PlayerData}
 */
function getPlayerData(userid: string): PlayerData {
	return RPGPlayerState.getInstance(userid).getPlayer();
}

function addItemToInventory(player: PlayerData, itemId: string, quantity: number): boolean {
	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData) return false;
	if (player.inventory.has(itemId)) {
		player.inventory.get(itemId)!.quantity += quantity;
	} else {
		player.inventory.set(itemId, { ...itemData, quantity });
	}
	return true;
}

function removeItemFromInventory(player: PlayerData, itemId: string, quantity: number): boolean {
	if (!player.inventory.has(itemId)) return false;
	const item = player.inventory.get(itemId)!;
	if (item.quantity < quantity) return false;
	item.quantity -= quantity;
	if (item.quantity === 0) {
		player.inventory.delete(itemId);
	}
	return true;
}

function calculateStats(species: any, level: number, nature: string, ivs: Record<keyof Stats, number>, evs: Record<keyof Stats, number>): Stats {
	const stats: Stats = { maxHp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	stats.maxHp = Math.floor(((2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4)) * level) / 100) + level + 10;
	stats.atk = Math.floor(((2 * species.baseStats.atk + ivs.atk + Math.floor(evs.atk / 4)) * level) / 100) + 5;
	stats.def = Math.floor(((2 * species.baseStats.def + ivs.def + Math.floor(evs.def / 4)) * level) / 100) + 5;
	stats.spa = Math.floor(((2 * species.baseStats.spa + ivs.spa + Math.floor(evs.spa / 4)) * level) / 100) + 5;
	stats.spd = Math.floor(((2 * species.baseStats.spd + ivs.spd + Math.floor(evs.spd / 4)) * level) / 100) + 5;
	stats.spe = Math.floor(((2 * species.baseStats.spe + ivs.spe + Math.floor(evs.spe / 4)) * level) / 100) + 5;
	const natureEffect = NATURES[nature];
	if (natureEffect) {
		stats[natureEffect.plus] = Math.floor(stats[natureEffect.plus] * 1.1);
		stats[natureEffect.minus] = Math.floor(stats[natureEffect.minus] * 0.9);
	}
	return stats;
}

/**
 * Gets the initial moves for a newly created Pokemon based on its level.
 */
function getInitialMoves(speciesId: string, level: number): { id: string, pp: number }[] {
	let availableMoves: string[] = ['tackle', 'growl']; // Default fallback
	const species = Dex.species.get(speciesId);

	// --- 1. Try Manual Learnset First ---
	const manualLearnset = MANUAL_LEARNSETS[toID(speciesId)];
	if (manualLearnset?.levelup) {
		const learnedMoves: string[] = [];
		for (const learnableMove of manualLearnset.levelup) {
			if (learnableMove.level <= level) {
				learnedMoves.push(toID(learnableMove.move));
			}
		}
		if (learnedMoves.length > 0) {
			availableMoves = [...new Set(learnedMoves)].slice(-4);
		}
	} else {
		// --- 2. Fallback to Dex Learnset ---
		try {
			const learnset = species.learnset;
			if (learnset) {
				const learnedMoves: { move: string, level: number }[] = [];
				for (const moveId in learnset) {
					// @ts-ignore - PS learnset format can be complex
					for (const learnMethod of learnset[moveId]) {
						// Check for Gen 8 Level-up moves
						if (learnMethod.startsWith('8L')) {
							const learnLevel = parseInt(learnMethod.substring(2));
							if (learnLevel > 0 && learnLevel <= level) {
								learnedMoves.push({ move: moveId, level: learnLevel });
							}
						}
					}
				}

				if (learnedMoves.length > 0) {
					learnedMoves.sort((a, b) => a.level - b.level);
					availableMoves = [...new Set(learnedMoves.map(m => m.move))].slice(-4);
				}
			}
		} catch (e) {
			console.error(`Error processing learnset for ${speciesId}:`, e);
			// Fallback to default moves if learnset processing fails
		}
	}

	// --- 3. Format moves with PP ---
	const movesWithPP = availableMoves.map(moveId => {
		const moveData = getMove(moveId);
		return { id: moveId, pp: moveData.pp || 5 };
	});

	return movesWithPP;
}

function createPokemon(speciesId: string, level = 5): RPGPokemon {
	const species = Dex.species.get(speciesId);
	if (!species.exists) throw new Error('Pokemon ' + speciesId + ' not found');

	// --- 1. Determine Gender ---
	let gender: 'M' | 'F' | 'N' = 'N';
	if (species.genderRatio) {
		gender = Math.random() < species.genderRatio.M ? 'M' : 'F';
	} else if (species.gender === 'M' || species.gender === 'F' || species.gender === 'N') {
		gender = species.gender;
	}

	// --- 2. Generate Stats & Nature ---
	const randomNature = NATURE_LIST[Math.floor(Math.random() * NATURE_LIST.length)];
	const ivs = { hp: Math.floor(Math.random() * 32), atk: Math.floor(Math.random() * 32), def: Math.floor(Math.random() * 32), spa: Math.floor(Math.random() * 32), spd: Math.floor(Math.random() * 32), spe: Math.floor(Math.random() * 32) };
	const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	const stats = calculateStats(species, level, randomNature, ivs, evs);

	// --- 3. Get Initial Moves (Refactored) ---
	const movesWithPP = getInitialMoves(speciesId, level);

	// --- 4. Get Ability ---
	const abilities = Object.values(species.abilities);
	const randomAbility = abilities.length ? abilities[Math.floor(Math.random() * abilities.length)] : 'No Ability';

	// --- 5. Get Random Held Item (Optional) ---
	let heldItem: string | undefined = undefined;
	const possibleItems = ['oranberry', 'sitrusberry', 'leftovers', 'rockyhelmet', 'chopleberry', 'yacheberry', 'keberry', 'marangaberry', 'stickybarb', 'toxicorb'];
	if (Math.random() < 0.1) {
		heldItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
	}

	// --- 6. Assemble Pokemon ---
	const growthRate = species.growthRate;
	return {
		species: species.name,
		nickname: species.name,
		level,
		hp: stats.maxHp,
		growthRate,
		experience: calculateTotalExpForLevel(growthRate, level),
		expToNextLevel: calculateTotalExpForLevel(growthRate, level + 1),
		moves: movesWithPP,
		ability: randomAbility,
		nature: randomNature,
		item: heldItem,
		id: generateUniqueId(),
		ivs,
		evs,
		status: null,
		weightkg: species.weightkg,
		heightm: species.heightm,
		friendship: species.baseFriendship || 70,
		gender,
		shiny: Math.random() < 1 / 4096,
		caughtIn: 'pokeball',
		form: species.forme,
		...stats,
	};
}

function storePokemonInPC(player: PlayerData, pokemon: RPGPokemon): void {
	player.pc.set(pokemon.id, pokemon);
	// No updatePlayer call needed here as we are modifying the object reference directly
}

function withdrawPokemonFromPC(player: PlayerData, pokemonId: string): RPGPokemon | null {
	const pokemon = player.pc.get(pokemonId);
	if (pokemon) {
		player.pc.delete(pokemonId);
		// No updatePlayer call needed
		return pokemon;
	}
	return null;
}

function getBallBonus(ballId: string, battle: BattleState, targetSlot: ActivePokemonSlot): number {
	// const { opponentActivePokemon, activePokemon, turn, opponentStatus } = battle; // <-- OLD

	// --- NEW ---
	const opponentActivePokemon = targetSlot.pokemon;
	const opponentStatus = targetSlot.status;
	// Get the player's *first* active Pokemon for level/stat comparisons
	// This is a simplification for doubles, but necessary.
	const playerSlot = getActiveSlots(battle.playerSlots)[0];
	if (!playerSlot) return 1; // No player pokemon?
	const activePokemon = playerSlot.pokemon;
	const turn = battle.turn;
	// --- END NEW ---

	const opponentSpecies = Dex.species.get(opponentActivePokemon.species);

	switch (ballId) {
	case 'greatball': return 1.5;
	case 'ultraball': return 2;
	case 'masterball': return 255;
	case 'fastball':
		return opponentSpecies.baseStats.spe >= 100 ? 4 : 1;
	case 'levelball':
		if (activePokemon.level >= opponentActivePokemon.level * 4) return 8;
		if (activePokemon.level >= opponentActivePokemon.level * 2) return 4;
		if (activePokemon.level > opponentActivePokemon.level) return 2;
		return 1;
	case 'nestball':
		return opponentActivePokemon.level <= 30 ? Math.max(1, (41 - opponentActivePokemon.level) / 10) : 1;
	case 'netball':
		return opponentSpecies.types.includes('Bug') || opponentSpecies.types.includes('Water') ? 3.5 : 1;
	case 'quickball':
		return turn === 0 ? 5 : 1;
	case 'timerball':
		return Math.min(4, 1 + turn * (1229 / 4096));
	case 'dreamball':
		return opponentStatus === 'slp' ? 4 : 1;
	default:
		return 1; // pokeball, premierball, luxuryball, healball, etc.
	}
}

function performCatchAttempt(battle: BattleState, ballId: string, targetSlot: ActivePokemonSlot): { success: boolean, shakes: number } {
	// const { opponentActivePokemon, opponentStatus } = battle; // <-- OLD

	// --- NEW ---
	const opponentActivePokemon = targetSlot.pokemon;
	const opponentStatus = targetSlot.status;
	// --- END NEW ---

	const speciesId = toID(opponentActivePokemon.species);
	// --- FIX: Updated fallback catch rate from 45 to 150 ---
	const catchRate = MANUAL_CATCH_RATES[speciesId] || 150;

	const ballBonus = getBallBonus(ballId, battle, targetSlot); // <-- Pass targetSlot
	if (ballBonus === 255) return { success: true, shakes: 4 }; // Master Ball

	let statusBonus = 1;
	if (opponentStatus === 'slp' || opponentStatus === 'frz') {
		statusBonus = 2.5;
	} else if (opponentStatus === 'par' || opponentStatus === 'psn' || opponentStatus === 'brn') {
		statusBonus = 1.5;
	}

	const { maxHp, hp } = opponentActivePokemon;
	const modifiedCatchRate = catchRate;

	const a = Math.floor(
		(((3 * maxHp - 2 * hp) * modifiedCatchRate * ballBonus) / (3 * maxHp)) * statusBonus
	);

	if (a >= 255) return { success: true, shakes: 4 }; // Automatic catch

	const b = Math.floor(65536 / (255 / a) ** 0.1875);

	let shakes = 0;
	for (let i = 0; i < 4; i++) {
		const rand = Math.floor(Math.random() * 65536);
		if (rand >= b) {
			return { success: false, shakes };
		}
		shakes++;
	}

	return { success: true, shakes: 4 };
}

function getStatMultiplier(stage: number): number {
	if (stage >= 0) {
		return (2 + stage) / 2;
	} else {
		return 2 / (2 - Math.abs(stage));
	}
}

function getCriticalHitChance(attackerSlot: ActivePokemonSlot, defenderSlot: ActivePokemonSlot, move: Move, battle: BattleState): number {
	// --- ADDED: Battle Armor / Shell Armor Check ---
	const defenderAbility = toID(defenderSlot.pokemon.ability || '');
	if (defenderAbility === 'battlearmor' || defenderAbility === 'shellarmor') {
		return 0; // Cannot be critically hit
	}
	// --- END ADDED ---

	let critStage = 0;
	const attacker = attackerSlot.pokemon;

	// Focus Energy boosts crit stage
	if (attackerSlot.focusEnergy) {
		critStage += 2;
	}

	// Base critical hit stages for certain moves
	if (['slash', 'razorleaf', 'crabhammer', 'karatechop', 'attackorder', 'blazekick', 'crosschop', 'crosspoison', 'nightslash', 'poisontail', 'psychocut', 'shadowclaw', 'spacialrend', 'stoneedge'].includes(move.id)) {
		critStage += 1;
	}

	// Scope Lens and Razor Claw boost
	if (battle.magicRoomTurns === 0 && (attacker.item === 'scopelens' || attacker.item === 'razorclaw')) {
		critStage += 1;
	}

	// Super Luck ability boosts crit stage
	const attackerAbility = toID(attacker.ability || '');
	if (attackerAbility === 'superluck') {
		critStage += 1;
	}

	// Critical hit chances by stage
	const critChances = [1 / 24, 1 / 8, 1 / 2, 1 / 1]; // stages 0, 1, 2, 3+
	return critChances[Math.min(critStage, 3)];
}

/**
 * Get a move from either Dex or Custom Moves
 * This wrapper function checks custom moves first, then falls back to Dex
 */
function getMove(moveId: string): any {
	// Check if it's a custom move
	if (isCustomMove(moveId)) {
		const customMove = getCustomMove(moveId);
		// Add exists property for compatibility
		return { ...customMove, exists: true };
	}

	// Otherwise get from Dex
	return Dex.moves.get(moveId);
}

function levelUp(pokemon: RPGPokemon): string[] {
	const levelUpMessages: string[] = [];
	pokemon.level++;
	levelUpMessages.push(`**${pokemon.species} grew to Level ${pokemon.level}!**`);
	const oldStats = { ...pokemon };
	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;
	pokemon.hp = pokemon.maxHp;
	levelUpMessages.push(`Max HP: ${oldStats.maxHp} -> ${pokemon.maxHp}`);
	levelUpMessages.push(`Attack: ${oldStats.atk} -> ${pokemon.atk}`);
	levelUpMessages.push(`Defense: ${oldStats.def} -> ${pokemon.def}`);
	pokemon.expToNextLevel = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level + 1);
	return levelUpMessages;
}

function handleLearningMoves(player: PlayerData, pokemon: RPGPokemon): { messages: string[] } {
	const messages: string[] = [];
	const speciesId = toID(pokemon.species);
	const manualLearnset = MANUAL_LEARNSETS[speciesId];
	if (!manualLearnset?.levelup) return { messages };

	const movesLearnedAtThisLevel = manualLearnset.levelup
		.filter(learnable => learnable.level === pokemon.level)
		.map(learnable => toID(learnable.move))
		.filter(moveId => {
			const moveData = getMove(moveId);
			// --- FIX: Check if move exists AND Pokemon doesn't already know it ---
			return moveData.exists && !pokemon.moves.some(m => m.id === moveId);
		});

	if (movesLearnedAtThisLevel.length === 0) return { messages };

	const openMoveSlots = 4 - pokemon.moves.length;
	const movesToQueue: string[] = [];

	if (openMoveSlots > 0) {
		const movesToAutoLearn = movesLearnedAtThisLevel.slice(0, openMoveSlots);
		for (const moveId of movesToAutoLearn) {
			const moveData = getMove(moveId);
			pokemon.moves.push({ id: moveId, pp: moveData.pp || 5 });
			messages.push(`**${pokemon.species} learned ${moveData.name}!**`);
		}
	}

	if (movesLearnedAtThisLevel.length > openMoveSlots) {
		const remainingMoves = movesLearnedAtThisLevel.slice(openMoveSlots);
		movesToQueue.push(...remainingMoves);
	}

	if (movesToQueue.length > 0) {
		player.pendingMoveLearnQueue = { pokemonId: pokemon.id, moveIds: movesToQueue };
	}

	return { messages };
}

function gainEffortValues(pokemon: RPGPokemon, defeatedPokemon: RPGPokemon) {
	const defeatedSpeciesId = toID(defeatedPokemon.species);
	// --- FIX: Added fallback EV yield of { atk: 1 } ---
	const evYield = MANUAL_EV_YIELDS[defeatedSpeciesId] || { atk: 1 };

	let totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	for (const stat in evYield) {
		if (totalEVs >= 510) break;
		const statKey = stat as keyof Stats;
		const evGained = evYield[statKey]!;
		const currentEV = pokemon.evs[statKey];
		if (currentEV >= 252) continue;
		const canAdd = Math.min(evGained, 252 - currentEV, 510 - totalEVs);
		pokemon.evs[statKey] += canAdd;
		totalEVs += canAdd;
	}
	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	const hpDiff = newStats.maxHp - pokemon.maxHp;
	pokemon.hp = Math.max(1, pokemon.hp + hpDiff);
	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;
}

function gainExperience(
	player: PlayerData,
	participantSlots: ActivePokemonSlot[],
	defeatedPokemon: RPGPokemon,
	messageLog: string[] // This function now appends to the battle's messageLog
): { messages: string[], leveledUp: boolean } {
	const defeatedSpeciesId = toID(defeatedPokemon.species);
	// --- FIX: Added fallback base experience of 150 ---
	const baseExp = MANUAL_BASE_EXP[defeatedSpeciesId] || 150;
	// if (!baseExp) return { messages: ['No experience was gained.'], leveledUp: false }; // <-- This check is no longer needed

	const expGained = Math.floor((baseExp * defeatedPokemon.level) / 7);
	if (expGained <= 0) return { messages: [`No Experience Points were gained.`], leveledUp: false };

	let leveledUp = false;
	// const messages: string[] = []; // Removed, using messageLog

	const participantNames: string[] = [];

	// 1. Distribute EVs and EXP
	for (const slot of participantSlots) {
		if (!slot?.pokemon) continue; // <-- Safety check
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0 || pokemon.level >= 100) continue; // Fainted or max level

		participantNames.push(pokemon.species);
		gainEffortValues(pokemon, defeatedPokemon);
		pokemon.experience += expGained;
	}

	if (participantNames.length === 0) return { messages: [], leveledUp: false };

	messageLog.push(`**${participantNames.join(' and ')}** gained ${expGained} Experience Points!`);

	// 2. Handle Level-Ups for all participants
	for (const slot of participantSlots) {
		if (!slot?.pokemon) continue; // <-- Safety check
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0 || pokemon.level >= 100) continue;

		while (pokemon.experience >= pokemon.expToNextLevel && pokemon.level < 100) {
			messageLog.push(...levelUp(pokemon));
			leveledUp = true;
			const evolveMessage = checkEvolution(player, pokemon, messageLog);
			if (evolveMessage) {
				messageLog.push(evolveMessage);
				// Stop leveling this Pokemon if it evolved, as its stats/exp curve changed
				break;
			}
			const { messages: newMoveMessages } = handleLearningMoves(player, pokemon);
			messageLog.push(...newMoveMessages);
		}
	}

	return { messages: messageLog, leveledUp };
}

function checkEvolution(player: PlayerData, pokemon: RPGPokemon, messageLog: string[]): string | null {
	const speciesId = toID(pokemon.species);
	const evoData = MANUAL_EVOLUTIONS[speciesId];
	if (!evoData || pokemon.level < evoData.evoLevel) return null;
	const evoSpecies = Dex.species.get(evoData.evoTo);
	if (!evoSpecies.exists) return null;
	const oldSpeciesName = pokemon.species;
	pokemon.species = evoSpecies.name;
	const newStats = calculateStats(evoSpecies, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;
	pokemon.hp = pokemon.maxHp;
	const { messages: evoMoveMessages } = handleLearningMoves(player, pokemon);
	let evoMessage = `**What?! ${oldSpeciesName} is evolving!**<br>...Congratulations! Your ${oldSpeciesName} evolved into **${evoSpecies.name}**!`;
	if (evoMoveMessages.length > 0) evoMessage += `<br>${evoMoveMessages.join('<br>')}`;
	const pokemonIndex = player.party.findIndex(p => p.id === pokemon.id);
	if (pokemonIndex !== -1) player.party[pokemonIndex] = pokemon;
	messageLog.push(`What?! ${player.name}'s ${oldSpeciesName} is evolving!`);
	return evoMessage;
}

function saveBattleStatus(battle: BattleState) {
	const player = getPlayerData(battle.playerId);

	// Save player's active Pokemon statuses back to the party
	for (const slot of battle.playerSlots) {
		if (slot) {
			const pokemonInParty = player.party.find(p => p.id === slot.pokemon.id);
			if (pokemonInParty) {
				// Copy volatile status back to the persistent Pokemon object
				// HP, PP, and Item should already be updated (as slot.pokemon is a reference)
				if (slot.status === 'slp' || slot.status === 'frz') {
					pokemonInParty.status = null; // These statuses don't persist outside battle
				} else {
					pokemonInParty.status = slot.status;
				}
			}
		}
	}

	// Save opponent's active Pokemon statuses back to the battle's party array
	if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
		for (const slot of battle.opponentSlots) {
			if (slot) {
				const opponentPokemonInParty = battle.opponentParty.find(p => p.id === slot.pokemon.id);
				if (opponentPokemonInParty) {
					opponentPokemonInParty.status = slot.status;
				}
			}
		}
	}
}

/**********************
* Battle Logic Helpers
**********************/
/********************************
 * REFACTORED DAMAGE CALCULATION
 ********************************/

/**
 * Calculates the final Base Power of a move, applying contextual modifiers.
 */
function getDamageBasePower(
	move: Move,
	attacker: RPGPokemon,
	defender: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState
): number {
	let basePower = move.basePower;
	const attackerSpecies = Dex.species.get(attacker.species);
	const defenderSpecies = Dex.species.get(defender.species);

	// --- Helping Hand ---
	if (attackerSlot.isHelped) {
		basePower = Math.floor(basePower * 1.5);
	}

	// --- Semi-invulnerable targets ---
	const defenderChargingMoveId = defenderSlot.chargingMove;
	if (defenderChargingMoveId) {
		if (defenderChargingMoveId === 'dig' && ['earthquake', 'magnitude'].includes(move.id)) {
			basePower *= 2;
		}
		if (defenderChargingMoveId === 'dive' && ['surf', 'whirlpool'].includes(move.id)) {
			basePower *= 2;
		}
		if ((defenderChargingMoveId === 'fly' || defenderChargingMoveId === 'bounce') && ['twister', 'gust', 'skyuppercut'].includes(move.id)) {
			basePower *= 2;
		}
	}

	// --- Variable Power moves ---
	switch (move.id) {
	case 'reversal':
	case 'flail':
		const hpRatio = attacker.hp / attacker.maxHp;
		if (hpRatio < 0.0417) basePower = 200;
		else if (hpRatio < 0.1042) basePower = 150;
		else if (hpRatio < 0.2083) basePower = 100;
		else if (hpRatio < 0.3542) basePower = 80;
		else if (hpRatio < 0.6875) basePower = 40;
		else basePower = 20;
		break;
	case 'eruption':
	case 'waterspout':
		basePower = Math.max(1, Math.floor(150 * (attacker.hp / attacker.maxHp)));
		break;
	case 'grassknot':
	case 'lowkick':
		const defenderWeight = defenderSpecies.weightkg;
		if (defenderWeight < 10) basePower = 20;
		else if (defenderWeight < 25) basePower = 40;
		else if (defenderWeight < 50) basePower = 60;
		else if (defenderWeight < 100) basePower = 80;
		else if (defenderWeight < 200) basePower = 100;
		else basePower = 120;
		break;
	case 'heavyslam':
	case 'heatcrash':
		const attackerWeight = attackerSpecies.weightkg;
		const defenderWeightSlam = defenderSpecies.weightkg;
		const weightRatio = attackerWeight / defenderWeightSlam;
		if (weightRatio >= 5) basePower = 120;
		else if (weightRatio >= 4) basePower = 100;
		else if (weightRatio >= 3) basePower = 80;
		else if (weightRatio >= 2) basePower = 60;
		else basePower = 40;
		break;
	case 'gyroball':
		const attackerSpe = attacker.spe * getStatMultiplier(attackerSlot.statStages.spe);
		const defenderSpe = defender.spe * getStatMultiplier(defenderSlot.statStages.spe);
		if (defenderSpe > 0) {
			basePower = Math.min(150, Math.floor(25 * (defenderSpe / attackerSpe)) + 1);
		} else {
			basePower = 1;
		}
		break;
	case 'storedpower':
	case 'powertrip':
		let totalBoosts = 0;
		for (const stat in attackerSlot.statStages) {
			if (attackerSlot.statStages[stat as keyof typeof attackerSlot.statStages] > 0) {
				totalBoosts += attackerSlot.statStages[stat as keyof typeof attackerSlot.statStages];
			}
		}
		basePower = 20 + (20 * totalBoosts);
		break;
	case 'acrobatics':
		if (!attacker.item || battle.magicRoomTurns > 0) {
			basePower *= 2;
		}
		break;
	case 'present':
		const presentRand = Math.random();
		if (presentRand < 0.4) basePower = 40;
		else if (presentRand < 0.7) basePower = 80;
		else if (presentRand < 0.8) basePower = 120;
		else basePower = -1; // Flag for healing
		break;
	case 'magnitude':
		const magnitudeRoll = Math.random();
		if (magnitudeRoll < 0.05) basePower = 10;
		else if (magnitudeRoll < 0.15) basePower = 30;
		else if (magnitudeRoll < 0.35) basePower = 50;
		else if (magnitudeRoll < 0.65) basePower = 70;
		else if (magnitudeRoll < 0.85) basePower = 90;
		else if (magnitudeRoll < 0.95) basePower = 110;
		else basePower = 150;
		break;
	}

	// --- Context-Dependent Power Modifications ---
	if (move.id === 'facade' && attackerSlot.status && ['psn', 'brn', 'par'].includes(attackerSlot.status)) {
		basePower *= 2;
	}
	if (move.id === 'brine' && defender.hp <= defender.maxHp / 2) {
		basePower *= 2;
	}
	if (move.id === 'venoshock' && defenderSlot.status === 'psn') {
		basePower *= 2;
	}
	if (move.id === 'weatherball' && RPGAbilities.isWeatherActive(battle)) {
		basePower *= 2;
	}
	if (move.id === 'terrainpulse' && battle.terrain && RPGAbilities.isGrounded(attacker, battle)) {
		basePower *= 2;
	}
	if (attackerSlot.isCharged && move.type === 'Electric') {
		basePower *= 2;
	}
	if (['solarbeam', 'solarblade'].includes(move.id) && RPGAbilities.isWeatherActive(battle)) {
		if (['rain', 'sand', 'hail'].includes(battle.weather!.type)) {
			basePower = Math.floor(basePower * 0.5);
		}
	}
	if (move.id === 'knockoff' && defender.item) {
		basePower = Math.floor(basePower * 1.5);
	}

	return basePower;
}

/**
 * Calculates the raw attacking stat (Atk or SpA) before stat stages are applied.
 * Applies abilities (Guts, Huge Power) and items (Choice Band).
 */
function getDamageOffense(
	move: Move,
	attacker: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	battle: BattleState
): number {
	const isSpecial = move.category === 'Special';
	const statName = isSpecial ? 'spa' : 'atk';
	let attackStatRaw = attacker[statName];

	// --- Ability Stat Modifiers ---
	attackStatRaw = RPGAbilities.applyAbilityStatModifier(attacker, statName, attackStatRaw, attackerSlot, battle);

	// --- Item Stat Modifiers ---
	if (battle.magicRoomTurns === 0) {
		if (attacker.item === 'choiceband' && !isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
		if (attacker.item === 'choicespecs' && isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
	}

	// --- Weather Stat Modifiers ---
	if (isSpecial && RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'sun') {
		if (toID(attacker.ability || '') === 'solarpower') {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
	}

	return attackStatRaw;
}

/**
 * Calculates the raw defensive stat (Def or SpD) before stat stages are applied.
 * Applies abilities (Marvel Scale), items (Eviolite, AVest), and Wonder Room.
 */
function getDamageDefense(
	move: Move,
	defender: RPGPokemon,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState
): number {
	const isSpecial = move.category === 'Special';
	let statName = isSpecial ? 'spd' : 'def';

	// --- Wonder Room Swap ---
	if (battle.wonderRoomTurns > 0) {
		statName = isSpecial ? 'def' : 'spd';
	}

	let defenseStatRaw = defender[statName];

	// --- Ability Stat Modifiers ---
	defenseStatRaw = RPGAbilities.applyAbilityStatModifier(defender, statName, defenseStatRaw, defenderSlot, battle);

	// --- Item Stat Modifiers ---
	if (battle.magicRoomTurns === 0) {
		if (defender.item === 'assaultvest' && isSpecial && battle.wonderRoomTurns === 0) {
			defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
		}

		if (defender.item === 'eviolite') {
			const species = Dex.species.get(defender.species);
			if (species.evos && species.evos.length > 0) {
				// Eviolite boosts Def and SpD, regardless of Wonder Room
				const defWithAbility = RPGAbilities.applyAbilityStatModifier(defender, 'def', defender.def, defenderSlot, battle);
				const spdWithAbility = RPGAbilities.applyAbilityStatModifier(defender, 'spd', defender.spd, defenderSlot, battle);
				
				if (statName === 'def') { // Using Def stat (either normally or via Wonder Room)
					defenseStatRaw = Math.floor(defWithAbility * 1.5);
				} else { // Using SpD stat
					defenseStatRaw = Math.floor(spdWithAbility * 1.5);
				}
			}
		}
	}

	return defenseStatRaw;
}

/**
 * Calculates the move type, accounting for abilities and field effects.
 */
function getMoveType(
	move: Move,
	attacker: RPGPokemon,
	battle: BattleState,
	abilityContext: AbilityContext
): string {
	let moveType = move.type;

	// --- Field-based type changes ---
	if (move.id === 'weatherball' && RPGAbilities.isWeatherActive(battle)) {
		switch (battle.weather!.type) {
		case 'sun': moveType = 'Fire'; break;
		case 'rain': moveType = 'Water'; break;
		case 'sand': moveType = 'Rock'; break;
		case 'hail': moveType = 'Ice'; break;
		}
	}
	if (move.id === 'terrainpulse' && battle.terrain && RPGAbilities.isGrounded(attacker, battle)) {
		switch (battle.terrain.type) {
		case 'electric': moveType = 'Electric'; break;
		case 'grassy': moveType = 'Grass'; break;
		case 'psychic': moveType = 'Psychic'; break;
		case 'misty': moveType = 'Fairy'; break;
		}
	}

	// --- Ability-based type changes ---
	moveType = RPGAbilities.applyTypeModifier(abilityContext, moveType);
	return moveType;
}

/**
 * Applies final damage modifiers (weather, terrain, screens, items, abilities).
 */
function applyFinalDamageModifiers(
	baseDamage: number,
	move: Move,
	moveType: string,
	attacker: RPGPokemon,
	defender: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState,
	effectiveness: number,
	isCritical: boolean,
	abilityContext: AbilityContext
): number {
	let damage = baseDamage;

	// --- Screen Damage Reduction ---
	const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);
	if (!isCritical) { // Critical hits bypass screens
		const defenderVeilTurns = isDefenderPlayer ? battle.playerAuroraVeilTurns : battle.opponentAuroraVeilTurns;
		if (defenderVeilTurns > 0) {
			damage = Math.floor(damage * 0.5);
		} else {
			if (move.category === 'Physical') {
				const defenderReflectTurns = isDefenderPlayer ? battle.playerReflectTurns : battle.opponentReflectTurns;
				if (defenderReflectTurns > 0) damage = Math.floor(damage * 0.5);
			} else if (move.category === 'Special') {
				const defenderLightScreenTurns = isDefenderPlayer ? battle.playerLightScreenTurns : battle.opponentLightScreenTurns;
				if (defenderLightScreenTurns > 0) damage = Math.floor(damage * 0.5);
			}
		}
	}

	// --- Weather Damage Modification ---
	if (RPGAbilities.isWeatherActive(battle)) {
		if (battle.weather!.type === 'sun') {
			if (moveType === 'Fire') damage = Math.floor(damage * 1.5);
			if (moveType === 'Water') damage = Math.floor(damage * 0.5);
		} else if (battle.weather!.type === 'rain') {
			if (moveType === 'Water') damage = Math.floor(damage * 1.5);
			if (moveType === 'Fire') damage = Math.floor(damage * 0.5);
		}
	}

	// --- Terrain Damage Modification ---
	if (battle.terrain) {
		const attackerIsGrounded = RPGAbilities.isGrounded(attacker, battle);
		const defenderIsGrounded = RPGAbilities.isGrounded(defender, battle);

		if (battle.terrain.type === 'electric' && moveType === 'Electric' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		} else if (battle.terrain.type === 'grassy' && moveType === 'Grass' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		} else if (battle.terrain.type === 'psychic' && moveType === 'Psychic' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		}

		if (battle.terrain.type === 'misty' && moveType === 'Dragon' && defenderIsGrounded) {
			damage = Math.floor(damage * 0.5);
		} else if (battle.terrain.type === 'grassy' && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id) && defenderIsGrounded) {
			damage = Math.floor(damage * 0.5);
		}
	}

	// --- Mud/Water Sport Damage Reduction ---
	if (battle.mudSportTurns > 0 && moveType === 'Electric') {
		damage = Math.floor(damage * 0.33);
	}
	if (battle.waterSportTurns > 0 && moveType === 'Fire') {
		damage = Math.floor(damage * 0.33);
	}

	// --- Ability Damage Modifiers (Solid Rock, Tinted Lens, etc.) ---
	damage = RPGAbilities.applyDamageModifier(abilityContext, damage);

	// --- Item Damage Modifiers (Life Orb, Expert Belt) ---
	if (battle.magicRoomTurns === 0) {
		if (attacker.item === 'lifeorb') {
			damage = Math.floor(damage * 1.3);
		}
		if (attacker.item === 'expertbelt' && effectiveness > 1) {
			damage = Math.floor(damage * 1.2);
		}
	}

	return damage;
}


/**
 * REFACTORED MAIN DAMAGE FUNCTION
 */
function calculateDamage(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	moveId: string,
	battle: BattleState,
	spreadMultiplier: number
): { damage: number, message: string, effectiveness: number, berryConsumed?: string, isCritical: boolean } {
	const move = getMove(moveId);
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;
	const defenderSpecies = Dex.species.get(defender.species);

	// --- 0. Setup Ability Context ---
	const abilityContext: any = {
		attacker,
		defender,
		attackerSlot,
		defenderSlot,
		move: { ...move }, // <-- THIS IS THE FIX. Creates a mutable copy of the move.
		battle,
		messageLog: [], // Temporary log
	};

	// --- 1. Immunity Checks (Type & Ability) ---
	if (move.flags.powder && defenderSpecies.types.includes('Grass')) {
		return { damage: 0, message: ` <i style="color: #6c757d;">Grass-types are immune to powder moves!</i>`, effectiveness: 0, isCritical: false };
	}
	const immunityCheck = RPGAbilities.checkImmunity(abilityContext);
	if (immunityCheck && immunityCheck.immune) {
		return { damage: 0, message: ` <i style="color: #6c757d;">${immunityCheck.message}</i>`, effectiveness: 0, isCritical: false };
	}

	// --- 2. Fixed Damage Moves ---
	if (!move.basePower) {
		if (moveId === 'dragonrage') return { damage: 40, message: '', effectiveness: 1, isCritical: false };
		if (moveId === 'sonicboom') return { damage: 20, message: '', effectiveness: 1, isCritical: false };
		if (moveId === 'seismictoss' || moveId === 'nightshade') {
			return { damage: attacker.level, message: '', effectiveness: 1, isCritical: false };
		}
		if (moveId === 'psywave') {
			return { damage: Math.floor(Math.random() * attacker.level * 1.5) + 1, message: '', effectiveness: 1, isCritical: false };
		}
		if (moveId === 'superfang') {
			return { damage: Math.floor(defender.hp / 2), message: '', effectiveness: 1, isCritical: false };
		}
		return { damage: 0, message: ` <i style="color: #6c757d;">But it had no effect!</i>`, effectiveness: 1, isCritical: false };
	}

	// --- 3. Get Base Power ---
	let basePower = getDamageBasePower(move, attacker, defender, attackerSlot, defenderSlot, battle);
	if (basePower === -1) { // Special flag for Present (Heal)
		const healAmount = Math.floor(defender.maxHp * 0.25);
		defender.hp = Math.min(defender.maxHp, defender.hp + healAmount);
		return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species} was healed!</i>`, effectiveness: 0, isCritical: false };
	}

	// --- 4. Get Move Type (after Weatherball, Pixilate, etc.) ---
	const moveType = getMoveType(move, attacker, battle, abilityContext);
	abilityContext.move.type = moveType; // Update context (on the copy) if type changed

	// --- 5. Apply Ability Power Modifiers (Technician, Sheer Force, etc.) ---
	basePower = RPGAbilities.applyPowerModifier(abilityContext, basePower);

	// --- 6. Get Offensive & Defensive Stats ---
	const attackStatRaw = getDamageOffense(move, attacker, attackerSlot, battle);
	const defenseStatRaw = getDamageDefense(move, defender, defenderSlot, battle);

	// --- 7. Apply Stat Stages ---
	let attackStage = move.category === 'Special' ? attackerSlot.statStages.spa : attackerSlot.statStages.atk;
	let defenseStage = battle.wonderRoomTurns > 0 ?
		(move.category === 'Special' ? defenderSlot.statStages.def : defenderSlot.statStages.spd) :
		(move.category === 'Special' ? defenderSlot.statStages.spd : defenderSlot.statStages.def);

	// --- UNAWARE IMPLEMENTATION ---
	const defenderAbility = toID(defender.ability || '');
	const attackerAbility = toID(attacker.ability || '');

	if (defenderAbility === 'unaware') {
		attackStage = 0; // Defender ignores attacker's stat changes
	}
	if (attackerAbility === 'unaware') {
		defenseStage = 0; // Attacker ignores defender's stat changes
	}
	// --- END UNAWARE IMPLEMENTATION ---

	const attackStat = Math.floor(attackStatRaw * getStatMultiplier(attackStage));
	let defenseStat = Math.floor(defenseStatRaw * getStatMultiplier(defenseStage));

	// --- 8. Apply Final Stat Mods (Burn, Self-Destruct) ---
	let finalAttackStat = attackStat;
	if (attackerSlot.status === 'brn' && move.category === 'Physical' && move.id !== 'facade' && attackerAbility !== 'guts') {
		finalAttackStat = Math.floor(finalAttackStat / 2);
	}
	if (['explosion', 'selfdestruct'].includes(move.id)) {
		defenseStat = Math.floor(defenseStat * 0.5);
	}

	// --- 9. Get Core Damage Modifiers (Crit, STAB, Random, Effectiveness) ---
	const isCritical = Math.random() < getCriticalHitChance(attackerSlot, defenderSlot, move, battle);
	const criticalMultiplier = isCritical ? (attackerAbility === 'sniper' ? 2.25 : 1.5) : 1;
	const stabMultiplier = RPGAbilities.getSTABMultiplier(attacker, moveType);
	const randomMultiplier = Math.floor(Math.random() * 16 + 85) / 100;
	const effectiveness = getCustomEffectiveness(moveType, defenderSpecies.types, defender, battle);
	
	abilityContext.effectiveness = effectiveness; // Update context for final mods

	// --- 10. Check Effectiveness-modifying Berries ---
	let berryConsumed: string | undefined = undefined;
	let effectivenessMultiplier = effectiveness;
	if (battle.magicRoomTurns === 0 && defender.item && TYPE_RESIST_BERRIES[defender.item]) {
		const resistedType = TYPE_RESIST_BERRIES[defender.item];
		if (moveType === resistedType && effectiveness > 1) {
			effectivenessMultiplier = effectiveness / 2;
			berryConsumed = defender.item;
		}
	}

	// --- 11. Calculate Base Damage (The Formula) ---
	let baseDamage = Math.floor((((2 * attacker.level / 5 + 2) * basePower * (finalAttackStat / defenseStat)) / 50) + 2);

	// --- 12. Apply Final Modifiers (Weather, Terrain, Screens, Abilities, Items) ---
	let damage = applyFinalDamageModifiers(
		baseDamage, move, moveType, attacker, defender,
		attackerSlot, defenderSlot, battle, effectiveness, isCritical, abilityContext
	);

	// --- 13. Apply STAB, Effectiveness, Crit, Random, Spread ---
	damage = Math.floor(damage * stabMultiplier * effectivenessMultiplier * criticalMultiplier * randomMultiplier);
	damage = Math.floor(damage * spreadMultiplier); // Apply spread reduction last
	damage = Math.max(1, damage);

	// --- 14. Construct Message ---
	let message = "";
	if (isCritical) message += ` <i style="color: #28a745;">A critical hit!</i>`;
	if (effectiveness > 1) message += ` <i style="color: #28a745;">It's super effective!</i>`;
	if (effectiveness < 1 && effectiveness > 0) message += ` <i style="color: #d9534f;">It's not very effective...</i>`;
	if (effectiveness === 0) message = ` <i style="color: #6c757d;">It had no effect on ${defender.species}!</i>`;

	return { damage, message, effectiveness, berryConsumed, isCritical };
}

/********************************
 * REFACTORED DAMAGING MOVE HANDLER
 ********************************/

/**
 * Handles moves that are not standard damage calculations (OHKO, Counter, Fling).
 * @returns {boolean} `true` if the move was fully handled, `false` if calculation should continue.
 */
function handleDamagingMovePreamble(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;

	// --- Check for semi-invulnerable state ---
	const defenderChargingMoveId = defenderSlot.chargingMove;
	if (defenderChargingMoveId) {
		let isImmune = true;
		const semiInvulnerableStates = ['fly', 'dig', 'dive', 'bounce', 'shadowforce', 'phantomforce'];

		if (semiInvulnerableStates.includes(defenderChargingMoveId)) {
			if (defenderChargingMoveId === 'dig' && ['earthquake', 'magnitude'].includes(move.id)) isImmune = false;
			if (defenderChargingMoveId === 'dive' && ['surf', 'whirlpool'].includes(move.id)) isImmune = false;
			if ((defenderChargingMoveId === 'fly' || defenderChargingMoveId === 'bounce') && ['thunder', 'hurricane', 'twister', 'gust', 'skyuppercut', 'smackdown'].includes(move.id)) isImmune = false;
		}
		if (isImmune) {
			messageLog.push(`But it failed! ${defender.species} avoided the attack!`);
			return true; // Move fails, but turn is used
		}
	}

	// --- Handle Counter and Mirror Coat ---
	if (move.id === 'counter' || move.id === 'mirrorcoat') {
		const targetCategory = move.id === 'counter' ? 'Physical' : 'Special';
		if (attackerSlot.lastDamageTaken?.category !== targetCategory) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const counterDamage = attackerSlot.lastDamageTaken.amount * 2;
		defender.hp = Math.max(0, defender.hp - counterDamage);
		messageLog.push(`${defender.species} took ${counterDamage} damage from the counter!`);
		return true;
	}

	// --- Handle Fling ---
	if (move.id === 'fling') {
		if (battle.magicRoomTurns > 0 || !attacker.item) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const flingPowers: Record<string, number> = {
			'leftovers': 10, 'oranberry': 10, 'berryjuice': 10, 'sitrusberry': 10, 'lumberry': 10, 'focussash': 10,
			'choiceband': 10, 'choicescarf': 10, 'choicespecs': 10, 'lifeorb': 30, 'rockyhelmet': 60, 'assaultvest': 80, 'ironball': 130,
		};
		const damage = flingPowers[attacker.item] || 30;
		defender.hp = Math.max(0, defender.hp - damage);
		messageLog.push(`${attacker.species} flung its ${ITEMS_DATABASE[attacker.item]?.name || attacker.item} and dealt ${damage} damage!`);
		attacker.item = undefined;
		activateUnburden(attackerSlot, messageLog);
		return true;
	}

	// --- Handle Natural Gift ---
	if (move.id === 'naturalgift') {
		if (!attacker.item?.includes('berry')) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const damage = 80; // Simplified
		defender.hp = Math.max(0, defender.hp - damage);
		messageLog.push(`${attacker.species} used its ${ITEMS_DATABASE[attacker.item]?.name || attacker.item} and dealt ${damage} damage!`);
		attacker.item = undefined;
		activateUnburden(attackerSlot, messageLog);
		return true;
	}

	// --- Handle One-Hit KO moves ---
	if (move.ohko) {
		const defenderAbility = toID(defender.ability || '');
		if (defenderAbility === 'sturdy') {
			messageLog.push(`But it failed! (${defender.species}'s Sturdy)`);
			return true;
		}
		if (defender.level > attacker.level) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const defenderSpecies = Dex.species.get(defender.species);
		if (move.ohko === 'Normal' && defenderSpecies.types.includes('Ghost')) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
			return true;
		}
		if (move.ohko === 'Ice' && defenderSpecies.types.includes('Ice')) {
			messageLog.push(`But it failed!`);
			return true;
		}

		const accuracy = 30 + attacker.level - defender.level;
		if (Math.random() * 100 < accuracy) {
			defender.hp = 0;
			messageLog.push(`<i style="color: #dc3545;">It's a one-hit KO!</i>`);
		} else {
			messageLog.push(`${attacker.species}'s attack missed!`);
		}
		return true;
	}

	return false; // Standard damage calculation should proceed
}

/**
 * Applies the calculated damage to the defender, checking for Substitute, Focus Sash, and Sturdy.
 * @returns {number} The actual damage dealt after reductions.
 */
function applyDamageAndEnduranceEffects(
	defenderSlot: ActivePokemonSlot,
	damageDealt: number,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): number {
	const defender = defenderSlot.pokemon;
	const defenderAbility = toID(defender.ability || '');

	// --- 1. Check Disguise (Triggers before Substitute) ---
	if (defenderSlot.isDisguised && damageDealt > 0 && move.category !== 'Status') {
		defenderSlot.isDisguised = false;
		// Form change logic (simplified)
		if (defender.species === 'Mimikyu') {
			defender.species = 'Mimikyu-Busted';
		}
		messageLog.push(`<strong>${defender.species}'s Disguise was broken!</strong>`);
		// Disguise also deals 1/8 max HP damage to Mimikyu
		const disguiseDamage = Math.max(1, Math.floor(defender.maxHp / 8));
		defender.hp = Math.max(0, defender.hp - disguiseDamage);
		messageLog.push(`${defender.species} was hurt by the broken disguise!`);
		defenderSlot.lastMoveThatHitMe = move; // <-- AFTERMATH: Tag move
		return 0; // The attack's damage is negated
	}

	// --- 2. Handle Substitute ---
	if (defenderSlot.substitute && damageDealt > 0 && !move.flags.bypasssub) {
		const subHP = defenderSlot.substitute.hp;
		if (damageDealt >= subHP) {
			defenderSlot.substitute = undefined;
			messageLog.push(`The substitute took the hit and broke!`);
			// Damage does not carry over
		} else {
			defenderSlot.substitute.hp -= damageDealt;
			messageLog.push(`The substitute took the hit!`);
		}
		defenderSlot.lastMoveThatHitMe = move; // <-- AFTERMATH: Tag move
		return 0; // 0 damage dealt to the Pokemon itself
	}

	// --- 3. Handle Focus Sash & Sturdy ---
	const isFullHP = defender.hp === defender.maxHp;

	if (damageDealt >= defender.hp) {
		if (battle.magicRoomTurns === 0 && defender.item === 'focussash' && isFullHP) {
			damageDealt = defender.hp - 1;
			messageLog.push(`${defender.species} held on using its Focus Sash!`);
			defender.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		} else if (defenderAbility === 'sturdy' && isFullHP && move.ohko !== true) { // OHKO already checked
			damageDealt = defender.hp - 1;
			messageLog.push(`${defender.species} held on using its Sturdy!`);
		}
	}

	defender.hp = Math.max(0, defender.hp - damageDealt);
	
	// --- AFTERMATH: Tag the pokemon with the move that hit it ---
	if (damageDealt > 0) {
		defenderSlot.lastMoveThatHitMe = move;
	}
	// --- END AFTERMATH ---

	return damageDealt;
}

/**
 * Handles effects that trigger upon being hit (Rocky Helmet, Weakness Policy, contact abilities).
 */
function applyPostDamageContactEffects(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	damageDealt: number,
	effectiveness: number,
	abilityContext: AbilityContext,
	isCritical: boolean // <-- ADD THIS PARAMETER
) {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;
	
	if (defender.hp <= 0 || damageDealt <= 0) return;

	// --- ANGER POINT IMPLEMENTATION ---
	if (isCritical && toID(defender.ability || '') === 'angerpoint') {
		applyStatChange(defenderSlot, 'atk', 6, battle, messageLog, defenderSlot);
	}
	// --- END ANGER POINT IMPLEMENTATION ---

	// --- Stat-boosting Berries (Kee, Maranga) ---
	if (battle.magicRoomTurns === 0) {
		if (move.category === 'Physical' && defender.item === 'keberry') {
			// --- CONTRARY FIX ---
			if (applyStatChange(defenderSlot, 'def', 1, battle, messageLog, defenderSlot)) {
				messageLog[messageLog.length - 1] += ` (from Kee Berry)!`;
				defender.item = undefined;
				activateUnburden(defenderSlot, messageLog);
			}
			// --- END FIX ---
		} else if (move.category === 'Special' && defender.item === 'marangaberry') {
			// --- CONTRARY FIX ---
			if (applyStatChange(defenderSlot, 'spd', 1, battle, messageLog, defenderSlot)) {
				messageLog[messageLog.length - 1] += ` (from Maranga Berry)!`;
				defender.item = undefined;
				activateUnburden(defenderSlot, messageLog);
			}
			// --- END FIX ---
		}
	}

	// --- Contact Effects (Items and Abilities) ---
	if (move.flags.contact && attacker.hp > 0) {
		if (battle.magicRoomTurns === 0) {
			if (defender.item === 'rockyhelmet' && RPGAbilities.takesIndirectDamage(attacker)) {
				attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 6));
				messageLog.push(`${attacker.species} was hurt by the Rocky Helmet!`);
			}
			if (defender.item === 'jabocaberry' && RPGAbilities.takesIndirectDamage(attacker)) {
				attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
				messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Jaboca Berry!`);
				defender.item = undefined;
				activateUnburden(defenderSlot, messageLog);
			}
		}
		// Ability-based contact effects
		if (attacker.hp > 0) {
			RPGAbilities.applyContactAbilityEffects(abilityContext);
		}
	}

	// --- Non-Contact Item Effects (Rowap Berry) ---
	if (move.category === 'Special' && attacker.hp > 0 && battle.magicRoomTurns === 0 && defender.item === 'rowapberry') {
		if (RPGAbilities.takesIndirectDamage(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
			messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Rowap Berry!`);
			defender.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		}
	}

	// --- CURSED BODY IMPLEMENTATION ---
	// Cursed Body triggers on any move, not just contact
	const defenderAbility = toID(defender.ability || '');
	if (defenderAbility === 'cursedbody' && attacker.hp > 0 && !attackerSlot.disabledMove && Math.random() < 0.3) {
		attackerSlot.disabledMove = { moveId: move.id, turns: 4 }; // 4 turns (disable lasts 3 more turns)
		messageLog.push(`${attacker.species}'s ${move.name} was disabled by ${defender.species}'s Cursed Body!`);
	}
	// --- END CURSED BODY IMPLEMENTATION ---

	// --- Weakness Policy ---
	if (battle.magicRoomTurns === 0 && defender.item === 'weaknesspolicy' && effectiveness > 1) {
		let activated = false;
		// --- CONTRARY FIX ---
		if (applyStatChange(defenderSlot, 'atk', 2, battle, messageLog, defenderSlot)) {
			activated = true;
		}
		if (applyStatChange(defenderSlot, 'spa', 2, battle, messageLog, defenderSlot)) {
			activated = true;
		}
		// --- END FIX ---

		if (activated) {
			messageLog.push(`${defender.species}'s Weakness Policy was activated!`);
			defender.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		}
	}

	// --- Red Card ---
	if (attacker.hp > 0 && battle.magicRoomTurns === 0 && defender.item === 'redcard') {
		const isPlayerDefending = battle.playerSlots.includes(defenderSlot);
		const attackerSlotIndex = (isPlayerDefending ? battle.opponentSlots : battle.playerSlots).indexOf(attackerSlot);

		if (attackerSlotIndex !== -1) {
			messageLog.push(`${defender.species}'s Red Card forced ${attacker.species} to switch out!`);
			defender.item = undefined;
			activateUnburden(defenderSlot, messageLog);

			if (isPlayerDefending) {
				battle.opponentSlots[attackerSlotIndex as 0 | 1] = null;
			} else {
				battle.playerSlots[attackerSlotIndex as 0 | 1] = null;
			}
		}
	}
}

/**
 * Handles attacker-side effects after a successful hit (Recoil, Life Orb, Self-Boosts, Self-Destruct).
 */
function applyRecoilAndSelfEffects(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	damageDealt: number,
	moveWasSuccessful: boolean
) {
	if (attackerSlot.pokemon.hp <= 0) return;
	const attacker = attackerSlot.pokemon;
	
	let tookRecoil = false;

	// --- Recoil & Self-Damage ---
	if (['mindblown', 'steelbeam'].includes(move.id)) {
		attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 2));
		messageLog.push(`${attacker.species} was damaged by the move's recoil!`);
		tookRecoil = true;
	} else if (battle.magicRoomTurns === 0 && attacker.item === 'lifeorb') {
		const attackerAbility = toID(attacker.ability || '');
		const sheerForceActive = attackerAbility === 'sheerforce' && (move.secondary || move.secondaries);
		if (!sheerForceActive && RPGAbilities.takesIndirectDamage(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 10));
			messageLog.push(`${attacker.species} was hurt by its Life Orb!`);
			tookRecoil = true;
		}
	} else if (move.id === 'struggle') {
		attacker.hp = Math.max(0, attacker.hp - Math.max(1, Math.floor(attacker.maxHp / 4)));
		messageLog.push(`${attacker.species} was damaged by recoil!`);
		tookRecoil = true;
	} else if (move.recoil) {
		if (!RPGAbilities.preventsRecoil(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.max(1, Math.floor(damageDealt * (move.recoil[0] / move.recoil[1]))));
			messageLog.push(`${attacker.species} was damaged by recoil!`);
			tookRecoil = true;
		}
	}

	if (tookRecoil) {
		handleHPDropEffects(attackerSlot, battle, messageLog);
	}

	// --- Self-Boosts (e.g., Power-Up Punch, Close Combat) ---
	if (attacker.hp > 0 && move.self?.boosts) {
		const boosts = move.self.boosts;
		for (const stat in boosts) {
			let boostValue = boosts[stat as keyof typeof boosts]!; // --- MODIFIED ---

			// --- ADDED: Contrary Check ---
			if (toID(attacker.ability || '') === 'contrary') {
				boostValue *= -1;
			}
			// --- END ADDED ---

			const currentStage = attackerSlot.statStages[stat as keyof typeof attackerSlot.statStages];
			if (currentStage !== undefined) {
				const newStage = Math.max(-6, Math.min(6, currentStage + boostValue));
				attackerSlot.statStages[stat as keyof typeof attackerSlot.statStages] = newStage as any;
				if (boostValue > 0) {
					messageLog.push(`${attacker.species}'s ${stat.toUpperCase()} ${boostValue > 1 ? 'sharply ' : ''}rose!`);
				} else if (boostValue < 0) {
					messageLog.push(`${attacker.species}'s ${stat.toUpperCase()} ${boostValue < -1 ? 'sharply ' : ''}fell!`);
				}
			}
		}
	}

	// --- Self-Destruct ---
	if (moveWasSuccessful && ['selfdestruct', 'explosion', 'mistyexplosion', 'finalgambit'].includes(move.id)) {
		attacker.hp = 0;
		messageLog.push(`**${attacker.species} fainted from using ${move.name}!**`);
	}
}

/**
 * Handles secondary effects of a move (Status, Stat Drops, Flinch).
 */
function applySecondaryEffects(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	abilityContext: AbilityContext
) {
	if (defenderSlot.pokemon.hp <= 0) return;
	if (!move.secondary || !RPGAbilities.shouldApplySecondaryEffects(attackerSlot.pokemon, move)) return;

	let chance = move.secondary.chance || 100;
	chance = RPGAbilities.applySereneGrace(abilityContext, chance);

	if (Math.random() * 100 < chance) {
		// --- Secondary Status ---
		if (move.secondary.status && !defenderSlot.status) {
			const defender = defenderSlot.pokemon;
			const defenderSpecies = Dex.species.get(defender.species);
			let canInflict = true;

			if ((move.secondary.status === 'par' && defenderSpecies.types.includes('Electric')) ||
				(move.secondary.status === 'brn' && defenderSpecies.types.includes('Fire')) ||
				(move.secondary.status === 'psn' && (defenderSpecies.types.includes('Poison') || defenderSpecies.types.includes('Steel')))) {
				canInflict = false;
			}
			if (canInflict && RPGAbilities.preventsStatus(defender, move.secondary.status)) {
				canInflict = false;
				messageLog.push(`${defender.species}'s ${defender.ability} prevents ${move.secondary.status}!`);
			}
			if (canInflict && battle.terrain?.type === 'misty' && RPGAbilities.isGrounded(defender, battle)) {
				canInflict = false;
				messageLog.push('The Misty Terrain prevents status conditions!');
			}
			
			if (canInflict) {
				const newStatus = move.secondary.status as Status;
				defenderSlot.status = newStatus;
				if (newStatus === 'slp') {
					defenderSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
				}
				messageLog.push(`${defender.species} was ${newStatus === 'par' ? 'paralyzed' : newStatus === 'brn' ? 'burned' : newStatus === 'psn' ? 'poisoned' : newStatus}!`);

				// Synchronize Check
				const defenderAbility = toID(defender.ability || '');
				if (defenderAbility === 'synchronize') {
					applySynchronize(newStatus, defenderSlot, attackerSlot, battle, messageLog);
				}
			}
		}

		// --- Secondary Stat Drops ---
		if (move.secondary.boosts) {
			let hadEffect = false;
			let triggeredDefiant = false;

			for (const stat in move.secondary.boosts) {
				let boostValue = move.secondary.boosts[stat as keyof typeof move.secondary.boosts]!; // --- MODIFIED ---

				// --- ADDED: Contrary Check ---
				if (toID(defenderSlot.pokemon.ability || '') === 'contrary') {
					boostValue *= -1;
				}
				// --- END ADDED ---
				
				const currentStage = defenderSlot.statStages[stat as keyof typeof defenderSlot.statStages];

				if (boostValue < 0) { // --- Stat Drop ---
					// --- ADDED: Check item/ability prevention ---
					if (battle.magicRoomTurns === 0 && defenderSlot.pokemon.item === 'clearamulet') {
						messageLog.push(`${defenderSlot.pokemon.species}'s Clear Amulet prevents its stats from being lowered!`);
						continue;
					}
					const targetAbility = toID(defenderSlot.pokemon.ability || '');
					const blockAbilities = ['clearbody', 'whitesmoke', 'fullmetalbody'];
					if (blockAbilities.includes(targetAbility)) {
						messageLog.push(`${defenderSlot.pokemon.species}'s ${defenderSlot.pokemon.ability} prevents its stats from being lowered!`);
						continue;
					}
					if (stat === 'atk' && ['hypercutter', 'flowerveil'].includes(targetAbility)) {
						messageLog.push(`${defenderSlot.pokemon.species}'s ${defenderSlot.pokemon.ability} prevents its Attack from being lowered!`);
						continue;
					}
					// --- END ADDED ---

					if (currentStage > -6) {
						const newStage = Math.max(-6, Math.min(6, currentStage + boostValue));
						defenderSlot.statStages[stat as keyof typeof defenderSlot.statStages] = newStage as any;
						messageLog.push(`${defenderSlot.pokemon.species}'s ${stat.toUpperCase()} ${boostValue < -1 ? 'sharply ' : ''}fell!`);
						hadEffect = true;
						triggeredDefiant = true;
					}
				} else if (boostValue > 0) { // --- Stat Rise (e.g., Charge Beam) ---
					if (currentStage < 6) {
						const newStage = Math.max(-6, Math.min(6, currentStage + boostValue));
						defenderSlot.statStages[stat as keyof typeof defenderSlot.statStages] = newStage as any;
						messageLog.push(`${defenderSlot.pokemon.species}'s ${stat.toUpperCase()} ${boostValue > 1 ? 'sharply ' : ''}rose!`);
						hadEffect = true;
					}
				}
			}

			// --- ADDED: Defiant/Competitive Activation ---
			if (triggeredDefiant) {
				checkStatDropAbilities(defenderSlot, attackerSlot, battle, messageLog);
			}
			// --- END ADDED ---
		}

		// --- Secondary Flinch ---
		if (move.secondary.volatileStatus === 'flinch') {
			defenderSlot.willFlinch = true;
		}
	}
}

/**
 * REFACTORED MAIN DAMAGING MOVE HANDLER
 */
function handleDamagingMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	spreadMultiplier: number
) {
	// --- 1. Preamble Checks (OHKO, Fling, Counter, Invulnerability) ---
	if (handleDamagingMovePreamble(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return; // Move was fully handled (e.g., it was OHKO or Fling) or it failed
	}

	// --- 2. Multi-Hit & Parental Bond Logic ---
	const attacker = attackerSlot.pokemon;
	let moveWasSuccessful = false;
	const hitCount = RPGAbilities.getMultiHitCount(attacker, move);
	const hasParentalBond = RPGAbilities.hasParentalBond(attacker);
	const totalHits = hasParentalBond && hitCount === 1 ? 2 : hitCount;

	if (totalHits > 1) {
		const hitMessage = hasParentalBond ?
			` <i style="color: #6c757d;">(Parental Bond hit twice!)</i>` :
			` <i style="color: #6c757d;">(It hit ${totalHits} times!)</i>`;
		if (messageLog.length > 0) {
			messageLog[messageLog.length - 1] += hitMessage;
		} else {
			messageLog.push(hitMessage);
		}
	}

	// --- 3. Damage Loop ---
	for (let i = 0; i < totalHits; i++) {
		// --- 3a. Calculate Damage ---
		let parentalBondSpreadMultiplier = spreadMultiplier;
		if (hasParentalBond && i === 1) {
			parentalBondSpreadMultiplier *= 0.25; // Second hit is 25% damage
		}
		
		const attackResult = calculateDamage(attackerSlot, defenderSlot, move.id, battle, parentalBondSpreadMultiplier);
		if (attackResult.effectiveness > 0) {
			moveWasSuccessful = true;
		}

		// --- 3b. Handle Effectiveness Berry ---
		if (attackResult.berryConsumed) {
			const itemName = ITEMS_DATABASE[attackResult.berryConsumed]?.name;
			if (TYPE_RESIST_BERRIES[attackResult.berryConsumed]) {
				messageLog.push(`${defenderSlot.pokemon.species}'s ${itemName} weakened the attack!`);
			}
			defenderSlot.pokemon.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		}

		// --- 3c. Apply Damage (incl. Substitute, Sturdy, Sash) ---
		const damageDealt = applyDamageAndEnduranceEffects(defenderSlot, attackResult.damage, move, battle, messageLog);

		// Track damage for Counter/Mirror Coat
		if (damageDealt > 0 && move.category !== 'Status') {
			defenderSlot.lastDamageTaken = {
				amount: damageDealt,
				category: move.category,
				from: attacker.id,
			};
		}
		
		// Add damage message
		if (totalHits > 1) {
			messageLog.push(`Dealt ${damageDealt} damage!` + attackResult.message);
		} else if (messageLog.length > 0) {
			messageLog[messageLog.length - 1] += attackResult.message;
		} else {
			messageLog.push(attackResult.message);
		}
		
		// --- 3d. Pop Air Balloon ---
		if (battle.magicRoomTurns === 0 && defenderSlot.pokemon.hp > 0 && defenderSlot.pokemon.item === 'airballoon' &&
			damageDealt > 0 && move.category !== 'Status') {
			messageLog.push(`${defenderSlot.pokemon.species}'s Air Balloon popped!`);
			defenderSlot.pokemon.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		}

		if (attackResult.effectiveness > 0 && damageDealt > 0) {
			// --- 3e. Attacker Drain Effects (Drain, Shell Bell) ---
			if (move.drain && attacker.hp < attacker.maxHp) {
				if (attackerSlot.healBlockTurns > 0) {
					messageLog.push(`${attacker.species} can't restore HP due to Heal Block!`);
				} else {
					const drainAmount = Math.max(1, Math.floor(damageDealt * (move.drain[0] / move.drain[1])));
					attacker.hp = Math.min(attacker.maxHp, attacker.hp + drainAmount);
					messageLog.push(`${defenderSlot.pokemon.species} had its energy drained!`);
				}
			}
			if (battle.magicRoomTurns === 0 && attacker.item === 'shellbell' && attacker.hp < attacker.maxHp) {
				if (attackerSlot.healBlockTurns <= 0) {
					const healAmount = Math.max(1, Math.floor(damageDealt / 8));
					attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
					messageLog.push(`${attacker.species} restored some HP using its Shell Bell!`);
				}
			}

			// --- 3f. Defender Contact Effects (Rocky Helmet, Abilities, WP, Red Card) ---
			const abilityContext = { attacker, defender: defenderSlot.pokemon, attackerSlot, defenderSlot, move, battle, messageLog };
			// --- ANGER POINT FIX: Pass isCritical to this function ---
			applyPostDamageContactEffects(attackerSlot, defenderSlot, move, battle, messageLog, damageDealt, attackResult.effectiveness, abilityContext, attackResult.isCritical);
			
			// --- 3g. HP-Drop Berry Effects (Sitrus, Enigma) ---
			handleHPDropEffects(defenderSlot, battle, messageLog);
			
			// --- 3h. Attacker Recoil & Self-Effects (Recoil, Life Orb, Self-Boosts, Self-Destruct) ---
			applyRecoilAndSelfEffects(attackerSlot, move, battle, messageLog, damageDealt, moveWasSuccessful);
			
			// --- 3i. Secondary Effects (Status, Stat Drops, Flinch) ---
			applySecondaryEffects(attackerSlot, defenderSlot, move, battle, messageLog, abilityContext);
		}
		
		if (defenderSlot.pokemon.hp <= 0) break; // Stop multi-hit if defender fainted
	}
}

/********************************
 * REFACTORED STATUS MOVE HANDLER
 ********************************/

// --- STATUS MOVE HELPERS ---

/**
 * Checks for abilities that trigger on stat drops (Defiant, Competitive)
 */
function checkStatDropAbilities(
	targetSlot: ActivePokemonSlot,
	sourceSlot: ActivePokemonSlot | null, // The Pokemon causing the stat drop
	battle: BattleState,
	messageLog: string[]
) {
	// Don't trigger if the source is the same as the target (self-inflicted)
	if (sourceSlot && sourceSlot.pokemon.id === targetSlot.pokemon.id) {
		return;
	}

	const ability = toID(targetSlot.pokemon.ability || '');

	if (ability === 'defiant') {
		if (targetSlot.statStages.atk < 6) {
			targetSlot.statStages.atk = Math.min(6, targetSlot.statStages.atk + 2);
			messageLog.push(`${targetSlot.pokemon.species}'s Defiant sharply raised its Attack!`);
		}
	} else if (ability === 'competitive') {
		if (targetSlot.statStages.spa < 6) {
			targetSlot.statStages.spa = Math.min(6, targetSlot.statStages.spa + 2);
			messageLog.push(`${targetSlot.pokemon.species}'s Competitive sharply raised its Sp. Atk!`);
		}
	}
}

/**
 * Handles generic stat-boosting/lowering moves (move.boosts)
 * @returns {boolean} `true` if the move was handled, `false` otherwise.
 */
function handleGenericBoostMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null, // Can be null
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	if (!move.boosts) return false;

	let targetSlot: ActivePokemonSlot | null;
	let targetName: string;
	const isSelf = move.target === 'self';

	if (isSelf) {
		targetSlot = attackerSlot;
		targetName = attackerSlot.pokemon.species;
	} else {
		if (!defenderSlot) {
			messageLog.push(`But it failed! (No target)`);
			return true;
		}
		targetSlot = defenderSlot;
		targetName = defenderSlot.pokemon.species;
	}

	const targetStages = targetSlot.statStages;
	let hadEffect = false;
	let triggeredDefiant = false;

	for (const stat in move.boosts) {
		let boostValue = move.boosts[stat as keyof typeof move.boosts]!;
		
		// --- ADDED: Contrary Check ---
		if (toID(targetSlot.pokemon.ability || '') === 'contrary') {
			boostValue *= -1;
		}
		// --- END ADDED ---

		const stage = targetStages[stat as keyof typeof targetStages];

		if (boostValue > 0) { // --- Stat increase ---
			if (stage < 6) {
				targetStages[stat as keyof typeof targetStages] = Math.max(-6, Math.min(6, stage + boostValue));
				messageLog.push(`${targetName}'s ${stat.toUpperCase()} ${boostValue > 1 ? 'sharply ' : ''}rose!`);
				hadEffect = true;
			}
		} else if (boostValue < 0) { // --- Stat decrease ---
			// Check if the target is the attacker (self-drop)
			if (!isSelf) {
				// --- ADDED: Check item/ability prevention ---
				if (battle.magicRoomTurns === 0 && targetSlot.pokemon.item === 'clearamulet') {
					messageLog.push(`${targetName}'s Clear Amulet prevents its stats from being lowered!`);
					continue; // Skip this stat, but don't fail the whole move
				}
				const targetAbility = toID(targetSlot.pokemon.ability || '');
				const blockAbilities = ['clearbody', 'whitesmoke', 'fullmetalbody'];
				if (blockAbilities.includes(targetAbility)) {
					messageLog.push(`${targetName}'s ${targetSlot.pokemon.ability} prevents its stats from being lowered!`);
					continue;
				}
				if (stat === 'atk' && ['hypercutter', 'flowerveil'].includes(targetAbility)) {
					messageLog.push(`${targetName}'s ${targetSlot.pokemon.ability} prevents its Attack from being lowered!`);
					continue;
				}
				// --- END ADDED ---
			}

			if (stage > -6) {
				targetStages[stat as keyof typeof targetStages] = Math.max(-6, Math.min(6, stage + boostValue));
				messageLog.push(`${targetName}'s ${stat.toUpperCase()} ${boostValue < -1 ? 'sharply ' : ''}fell!`);
				hadEffect = true;
				
				// --- ADDED: Defiant/Competitive Trigger ---
				if (!isSelf) triggeredDefiant = true;
				// --- END ADDED ---
			}
		}
	}
	
	if (!hadEffect) messageLog.push('But it failed!');

	// --- ADDED: Defiant/Competitive Activation ---
	if (triggeredDefiant) {
		checkStatDropAbilities(targetSlot, attackerSlot, battle, messageLog);
	}
	// --- END ADDED ---
	
	return true; // Move was handled
}

/**
 * Handles generic status-inflicting moves (move.status)
 * @returns {boolean} `true` if the move was handled, `false` otherwise.
 */
function handleGenericStatusInflictMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	if (!move.status || !defenderSlot) return false;
	
	const defender = defenderSlot.pokemon;
	const defenderSpecies = Dex.species.get(defender.species);
	let canBeAfflicted = !defenderSlot.status;
	const defenderIsGrounded = RPGAbilities.isGrounded(defender, battle);

	if (battle.terrain?.type === 'misty' && defenderIsGrounded) {
		canBeAfflicted = false;
		messageLog.push('The Misty Terrain prevents status conditions!');
	}
	if (battle.terrain?.type === 'electric' && move.status === 'slp' && defenderIsGrounded) {
		canBeAfflicted = false;
		messageLog.push('The Electric Terrain prevents sleep!');
	}
	if (canBeAfflicted && RPGAbilities.preventsStatus(defender, move.status)) {
		canBeAfflicted = false;
		messageLog.push(`${defender.species}'s ${defender.ability} prevents ${move.status}!`);
	}
	if (canBeAfflicted) {
		if ((move.status === 'brn' && defenderSpecies.types.includes('Fire')) ||
			(move.status === 'par' && defenderSpecies.types.includes('Electric')) ||
			(move.status === 'psn' && (defenderSpecies.types.includes('Poison') || defenderSpecies.types.includes('Steel'))) ||
			(move.status === 'frz' && defenderSpecies.types.includes('Ice'))) {
			canBeAfflicted = false;
		}
	}

	if (canBeAfflicted) {
		const newStatus = move.status as Status;
		defenderSlot.status = newStatus;
		if (newStatus === 'slp') {
			defenderSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
		}
		messageLog.push(`${defender.species} was afflicted with ${newStatus}!`);

		// Synchronize Check
		const defenderAbility = toID(defender.ability || '');
		if (defenderAbility === 'synchronize') {
			applySynchronize(newStatus, defenderSlot, attackerSlot, battle, messageLog);
		}
	} else {
		messageLog.push(`But it failed!`);
	}
	
	return true; // Move was handled
}

/**
 * Handles generic volatile status moves (move.volatileStatus)
 * @returns {boolean} `true` if the move was handled, `false` otherwise.
 */
function handleGenericVolatileMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	if (!move.volatileStatus) return false;

	const targetSlot = move.target === 'self' ? attackerSlot : defenderSlot;
	if (!targetSlot) {
		messageLog.push(`But it failed!`);
		return true;
	}
	const target = targetSlot.pokemon;
	let hadEffect = false;

	switch (move.volatileStatus) {
	case 'confusion':
		if (!targetSlot.isConfused) {
			targetSlot.isConfused = true;
			targetSlot.confusionCounter = Math.floor(Math.random() * 3) + 2;
			messageLog.push(`${target.species} became confused!`);
			hadEffect = true;
		}
		break;
	case 'taunt':
		if (targetSlot.tauntTurns <= 0) {
			targetSlot.tauntTurns = 3;
			messageLog.push(`${target.species} fell for the taunt!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'trap':
		if (!targetSlot.isTrapped) {
			targetSlot.isTrapped = { turns: 5 };
			messageLog.push(`${target.species} can no longer escape!`);
			hadEffect = true;
		}
		break;
	case 'yawn':
		if (!targetSlot.status && !targetSlot.yawnCounter) {
			const isTerrainImmune = battle.terrain?.type === 'electric' && RPGAbilities.isGrounded(target, battle);
			const sleepPreventingAbilities = ['insomnia', 'vitalspirit', 'comatose', 'sweetveil'];
			const isAbilityImmune = sleepPreventingAbilities.includes(toID(target.ability || ''));
			if (!isTerrainImmune && !isAbilityImmune) {
				targetSlot.yawnCounter = 2;
				messageLog.push(`${target.species} grew drowsy!`);
				hadEffect = true;
			}
		}
		break;
	case 'disable':
		if (targetSlot.lastMoveUsed && !targetSlot.disabledMove) {
			targetSlot.disabledMove = { moveId: targetSlot.lastMoveUsed, turns: 4 };
			messageLog.push(`${target.species}'s ${targetSlot.lastMoveUsed} was disabled!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'encore':
		if (targetSlot.lastMoveUsed && !targetSlot.encoreMove) {
			targetSlot.encoreMove = { moveId: targetSlot.lastMoveUsed, turns: 3 };
			messageLog.push(`${target.species} received an encore!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'ingrain':
		if (!targetSlot.isIngrained) {
			targetSlot.isIngrained = true;
			messageLog.push(`${target.species} planted its roots!`);
			hadEffect = true;
		}
		break;
	case 'aquaring':
		if (!targetSlot.hasAquaRing) {
			targetSlot.hasAquaRing = true;
			messageLog.push(`${target.species} surrounded itself with a veil of water!`);
			hadEffect = true;
		}
		break;
	case 'focusenergy':
		if (!targetSlot.focusEnergy) {
			targetSlot.focusEnergy = true;
			messageLog.push(`${target.species} is getting pumped!`);
			hadEffect = true;
		}
		break;
	case 'magnetrise':
		if (targetSlot.magnetRiseTurns === 0) {
			targetSlot.magnetRiseTurns = 5;
			messageLog.push(`${target.species} levitated with electromagnetism!`);
			hadEffect = true;
		}
		break;
	case 'telekinesis':
		if (targetSlot.telekinesisCounter === 0) {
			targetSlot.telekinesisCounter = 3;
			messageLog.push(`${target.species} was hurled into the air!`);
			hadEffect = true;
		}
		break;
	case 'smackdown':
		if (!targetSlot.isSmackedDown) {
			targetSlot.isSmackedDown = true;
			messageLog.push(`${target.species} fell straight down!`);
			hadEffect = true;
		}
		break;
	case 'torment':
		if (!targetSlot.tormentActive) {
			targetSlot.tormentActive = true;
			messageLog.push(`${target.species} was subjected to torment!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'embargo':
		if (targetSlot.embargoTurns === 0) {
			targetSlot.embargoTurns = 5;
			messageLog.push(`${target.species} can't use items anymore!`);
			hadEffect = true;
		}
		break;
	case 'healblock':
		if (targetSlot.healBlockTurns === 0) {
			targetSlot.healBlockTurns = 5;
			messageLog.push(`${target.species} was prevented from healing!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	}

	if (!hadEffect) messageLog.push('But it failed!');
	return true; // Move was handled
}

/**
 * Handles generic healing moves (move.flags.heal)
 * @returns {boolean} `true` if the move was handled, `false` otherwise.
 */
function handleGenericHealMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	messageLog: string[]
): boolean {
	if (!move.flags.heal) return false;
	
	const attacker = attackerSlot.pokemon;
	if (attacker.hp >= attacker.maxHp) {
		messageLog.push(`But it failed! (${attacker.species}'s HP is already full!)`);
	} else {
		const healAmount = Math.floor(attacker.maxHp * (move.heal?.[0] || 1) / (move.heal?.[1] || 2));
		const oldHp = attacker.hp;
		attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
		messageLog.push(`${attacker.species} restored ${attacker.hp - oldHp} HP!`);
	}
	return true; // Move was handled
}

/**
 * Handles generic field-wide moves (weather, terrain, rooms)
 * @returns {boolean} `true` if the move was handled, `false` otherwise.
 */
function handleGenericFieldMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	let hadEffect = false;
	const attacker = attackerSlot.pokemon;

	// --- Weather ---
	if (move.weather) {
		const weatherType = move.weather as 'sun' | 'rain' | 'sand' | 'hail';
		if (battle.weather?.type === weatherType) {
			messageLog.push(`But it failed!`);
		} else {
			const weatherItems: Record<string, string> = { 'damprock': 'rain', 'heatrock': 'sun', 'smoothrock': 'sand', 'icyrock': 'hail' };
			const turns = (battle.magicRoomTurns === 0 && attacker.item && weatherItems[attacker.item] === weatherType) ? 8 : 5;
			battle.weather = { type: weatherType, turns };
			const weatherStartMessages = { 'sun': 'The sunlight turned harsh!', 'rain': 'It started to rain!', 'sand': 'A sandstorm kicked up!', 'hail': 'It started to hail!' };
			messageLog.push(weatherStartMessages[weatherType]);
			hadEffect = true;
		}
		return true; // Move was handled
	}

	// --- Terrains & Rooms ---
	const pseudoWeather = move.pseudoWeather || move.id;
	switch (pseudoWeather) {
	case 'trickroom':
		if (battle.trickRoomTurns > 0) {
			battle.trickRoomTurns = 0;
			messageLog.push('The twisted dimensions returned to normal.');
		} else {
			battle.trickRoomTurns = 5;
			messageLog.push(`${attacker.species} twisted the dimensions!`);
		}
		return true;
	case 'magicroom':
		if (battle.magicRoomTurns > 0) {
			battle.magicRoomTurns = 0;
			messageLog.push('The bizarre dimensions disappeared.');
		} else {
			battle.magicRoomTurns = 5;
			messageLog.push('It created a bizarre area where held items lose their effects!');
		}
		return true;
	case 'wonderroom':
		if (battle.wonderRoomTurns > 0) {
			battle.wonderRoomTurns = 0;
			messageLog.push('The bizarre dimensions disappeared.');
		} else {
			battle.wonderRoomTurns = 5;
			messageLog.push('It created a bizarre area where Defense and Sp. Def stats are swapped!');
		}
		return true;
	case 'electricterrain':
	case 'grassyterrain':
	case 'mistyterrain':
	case 'psychicterrain':
		const terrainType = pseudoWeather.replace('terrain', '') as 'electric' | 'grassy' | 'misty' | 'psychic';
		if (battle.terrain) {
			messageLog.push('But it failed! (A terrain is already active)');
		} else {
			battle.terrain = { type: terrainType, turns: 5 };
			messageLog.push(`${attacker.species} turned the battlefield into ${terrainType} terrain!`);
		}
		return true;
	case 'gravity':
		if (battle.gravityTurns > 0) messageLog.push('But it failed!');
		else {
			battle.gravityTurns = 5;
			messageLog.push('Gravity intensified!');
		}
		return true;
	case 'mudsport':
		if (battle.mudSportTurns > 0) messageLog.push('But it failed!');
		else {
			battle.mudSportTurns = 5;
			messageLog.push('Electricity\'s power was weakened!');
		}
		return true;
	case 'watersport':
		if (battle.waterSportTurns > 0) messageLog.push('But it failed!');
		else {
			battle.waterSportTurns = 5;
			messageLog.push('Fire\'s power was weakened!');
		}
		return true;
	}
	
	return false; // No field move was found
}

/**
 * Handles generic side-condition moves (Hazards, Screens)
 * @returns {boolean} `true` if the move was handled, `false` otherwise.
 */
function handleGenericSideMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const isPlayerAttacker = battle.playerSlots.some(s => s?.pokemon.id === attackerSlot.pokemon.id);
	let hadEffect = false;

	// --- Screens ---
	if (['reflect', 'lightscreen', 'auroraveil'].includes(move.id)) {
		const duration = (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'lightclay') ? 8 : 5;
		if (isPlayerAttacker) {
			if (move.id === 'reflect' && battle.playerReflectTurns === 0) {
				battle.playerReflectTurns = duration;
				messageLog.push(`Reflect raised your team's Defense!`);
				hadEffect = true;
			} else if (move.id === 'lightscreen' && battle.playerLightScreenTurns === 0) {
				battle.playerLightScreenTurns = duration;
				messageLog.push(`Light Screen raised your team's Special Defense!`);
				hadEffect = true;
			} else if (move.id === 'auroraveil' && RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'hail' && battle.playerAuroraVeilTurns === 0) {
				battle.playerAuroraVeilTurns = duration;
				messageLog.push(`Aurora Veil raised your team's defenses!`);
				hadEffect = true;
			}
		} else { // Opponent is attacker
			if (move.id === 'reflect' && battle.opponentReflectTurns === 0) {
				battle.opponentReflectTurns = duration;
				messageLog.push(`Reflect raised the opposing team's Defense!`);
				hadEffect = true;
			} else if (move.id === 'lightscreen' && battle.opponentLightScreenTurns === 0) {
				battle.opponentLightScreenTurns = duration;
				messageLog.push(`Light Screen raised the opposing team's Special Defense!`);
				hadEffect = true;
			} else if (move.id === 'auroraveil' && RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'hail' && battle.opponentAuroraVeilTurns === 0) {
				battle.opponentAuroraVeilTurns = duration;
				messageLog.push(`Aurora Veil raised the opposing team's defenses!`);
				hadEffect = true;
			}
		}
		if (!hadEffect) messageLog.push('But it failed!');
		return true; // Move was handled
	}

	// --- Hazards ---
	if (move.sideCondition) {
		const targetHazards = isPlayerAttacker ? battle.opponentHazards : battle.playerHazards;
		const hazardId = toID(move.sideCondition);
		
		switch (hazardId) {
		case 'spikes':
			if (targetHazards.filter(h => h === 'spikes').length < 3) {
				targetHazards.push('spikes');
				messageLog.push(`Spikes were scattered all around the opposing team's feet!`);
				hadEffect = true;
			}
			break;
		case 'toxicspikes':
			if (targetHazards.filter(h => h === 'toxicspikes').length < 2) {
				targetHazards.push('toxicspikes');
				messageLog.push(`Toxic Spikes were scattered all around the opposing team's feet!`);
				hadEffect = true;
			}
			break;
		case 'stickyweb':
			if (!targetHazards.includes('stickyweb')) {
				targetHazards.push('stickyweb');
				messageLog.push(`A sticky web has been laid out on the ground around the opposing team!`);
				hadEffect = true;
			}
			break;
		case 'stealthrock':
			if (!targetHazards.includes('stealthrock')) {
				targetHazards.push('stealthrock');
				messageLog.push(`Pointed stones float in the air around the opposing team!`);
				hadEffect = true;
			}
			break;
		}
		if (!hadEffect) messageLog.push('But it failed!');
		return true; // Move was handled
	}
	
	// --- Team Guards (Quick Guard, etc.) ---
	if (['quickguard', 'wideguard', 'craftyshield'].includes(move.id)) {
		if (isPlayerAttacker) {
			if (move.id === 'quickguard') battle.playerQuickGuard = true;
			if (move.id === 'wideguard') battle.playerWideGuard = true;
			if (move.id === 'craftyshield') battle.playerCraftyShield = true;
		} else {
			if (move.id === 'quickguard') battle.opponentQuickGuard = true;
			if (move.id === 'wideguard') battle.opponentWideGuard = true;
			if (move.id === 'craftyshield') battle.opponentCraftyShield = true;
		}
		messageLog.push(`${attackerSlot.pokemon.species} is protecting its side!`);
		return true;
	}

	return false; // No side move was found
}

/**
 * Handles moves with unique, hardcoded logic (Curse, Transform, Defog, etc.)
 * @returns {boolean} `true` if the move was handled, `false` otherwise.
 */
function handleSpecificStatusMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot?.pokemon;
	const isPlayerAttacker = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);

	switch (move.id) {
	case 'roar':
	case 'whirlwind':
		if (!defender) {
			messageLog.push(`But it failed!`);
			return true;
		}
		if (battle.battleType === 'wild' || battle.battleType === 'wild_double') {
			messageLog.push(`The wild ${defender.species} was blown away!`);
			const oppSlotIndex = battle.opponentSlots.indexOf(defenderSlot);
			if (oppSlotIndex !== -1) {
				battle.opponentSlots[oppSlotIndex as 0 | 1] = null;
			}
		} else {
			messageLog.push(`But it failed!`); // Can't force switch a trainer
		}
		return true;

	case 'defog':
		if (battle.playerHazards.length > 0 || battle.opponentHazards.length > 0) {
			battle.playerHazards = [];
			battle.opponentHazards = [];
			messageLog.push('The entry hazards were removed from the field!');
		}
		if (isPlayerAttacker) {
			if (battle.opponentReflectTurns > 0) { battle.opponentReflectTurns = 0; messageLog.push(`The opposing team's Reflect wore off!`); }
			if (battle.opponentLightScreenTurns > 0) { battle.opponentLightScreenTurns = 0; messageLog.push(`The opposing team's Light Screen wore off!`); }
			if (battle.opponentAuroraVeilTurns > 0) { battle.opponentAuroraVeilTurns = 0; messageLog.push(`The opposing team's Aurora Veil wore off!`); }
		} else {
			if (battle.playerReflectTurns > 0) { battle.playerReflectTurns = 0; messageLog.push(`Your team's Reflect wore off!`); }
			if (battle.playerLightScreenTurns > 0) { battle.playerLightScreenTurns = 0; messageLog.push(`Your team's Light Screen wore off!`); }
			if (battle.playerAuroraVeilTurns > 0) { battle.playerAuroraVeilTurns = 0; messageLog.push(`Your team's Aurora Veil wore off!`); }
		}
		if (defenderSlot && defenderSlot.statStages.evasion > -6) {
			defenderSlot.statStages.evasion--;
			messageLog.push(`${defender!.species}'s evasion fell!`);
		}
		return true;

	case 'leechseed':
		if (!defender) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const defenderSpecies = Dex.species.get(defender.species);
		if (defenderSpecies.types.includes('Grass')) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
		} else if (defenderSlot.isSeeded) {
			messageLog.push(`${defender.species} is already seeded!`);
		} else {
			defenderSlot.isSeeded = true;
			messageLog.push(`${defender.species} was seeded!`);
		}
		return true;

	case 'curse':
		const attackerSpecies = Dex.species.get(attacker.species);
		if (attackerSpecies.types.includes('Ghost')) {
			if (!defenderSlot || defenderSlot.isCursed) {
				messageLog.push(`But it failed!`);
			} else {
				attacker.hp = Math.max(1, Math.floor(attacker.hp / 2));
				messageLog.push(`${attacker.species} cut its own HP to lay a curse!`);
				defenderSlot.isCursed = true;
				messageLog.push(`${defenderSlot.pokemon.species} was cursed!`);
			}
		} else {
			// Non-ghost Curse (acts as a generic boost move)
			handleGenericBoostMove(attackerSlot, defenderSlot, move, battle, messageLog);
		}
		return true;

	case 'psychup':
		if (!defenderSlot) {
			messageLog.push(`But it failed!`);
			return true;
		}
		attackerSlot.statStages = { ...defenderSlot.statStages };
		messageLog.push(`${attacker.species} copied ${defender.species}'s stat changes!`);
		return true;

	case 'trick':
	case 'switcheroo':
		if (!defenderSlot || battle.magicRoomTurns > 0) {
			messageLog.push('But it failed!');
			return true;
		}
		if (RPGAbilities.checkItemRemovalPrevention(defender) || RPGAbilities.checkItemRemovalPrevention(attacker)) {
			messageLog.push('But it failed!');
			return true;
		}
		if (!attacker.item && !defender.item) {
			messageLog.push('But it failed!');
			return true;
		}
		const attackerItem = attacker.item;
		const defenderItem = defender.item;
		attacker.item = defenderItem;
		defender.item = attackerItem;
		messageLog.push(`${attacker.species} swapped items with ${defender.species}!`);
		if (attacker.item) messageLog.push(`${attacker.species} obtained a ${ITEMS_DATABASE[attacker.item]?.name || attacker.item}!`);
		if (defender.item) messageLog.push(`${defender.species} obtained a ${ITEMS_DATABASE[defender.item]?.name || defender.item}!`);
		
		// --- ADDED: Unburden Check ---
		if (attackerItem !== attacker.item) activateUnburden(attackerSlot, messageLog);
		if (defenderItem !== defender.item) activateUnburden(defenderSlot, messageLog);
		// --- END ADDED ---
		return true;

	case 'nightmare':
		if (!defenderSlot || defenderSlot.status !== 'slp' || defenderSlot.hasNightmare) {
			messageLog.push(`But it failed!`);
		} else {
			defenderSlot.hasNightmare = true;
			messageLog.push(`${defender.species} began having a nightmare!`);
		}
		return true;

	case 'bestow':
		if (!defenderSlot || battle.magicRoomTurns > 0 || !attacker.item || defender.item) {
			messageLog.push('But it failed!');
			return true;
		}
		if (RPGAbilities.checkItemRemovalPrevention(defender)) {
			messageLog.push('But it failed!');
			return true;
		}
		const givenItem = attacker.item;
		defender.item = givenItem;
		attacker.item = undefined;
		activateUnburden(attackerSlot, messageLog);
		messageLog.push(`${attacker.species} gave ${ITEMS_DATABASE[givenItem]?.name || givenItem} to ${defender.species}!`);
		return true;

	case 'transform':
		if (!defender) {
			messageLog.push(`But it failed!`);
			return true;
		}
		attacker.atk = defender.atk;
		attacker.def = defender.def;
		attacker.spa = defender.spa;
		attacker.spd = defender.spd;
		attacker.spe = defender.spe;
		attacker.moves = defender.moves.map(m => ({ id: m.id, pp: 5 }));
		const originalSpecies = attacker.species;
		attacker.species = defender.species;
		if (defender.ability) attacker.ability = defender.ability;
		attackerSlot.statStages = { ...defenderSlot.statStages };
		messageLog.push(`${originalSpecies} transformed into ${defender.species}!`);
		return true;

	case 'helpinghand':
		if (!defenderSlot) {
			messageLog.push('But it failed!');
			return true;
		}
		defenderSlot.isHelped = true;
		messageLog.push(`${attacker.species} is ready to help ${defender.species}!`);
		return true;

	case 'substitute':
		if (attackerSlot.substitute) {
			messageLog.push(`${attacker.species} already has a substitute!`);
		} else {
			const subHP = Math.floor(attacker.maxHp / 4);
			if (attacker.hp <= subHP) {
				messageLog.push(`But it does not have enough HP left to make a substitute!`);
			} else {
				attacker.hp -= subHP;
				attackerSlot.substitute = { hp: subHP };
				messageLog.push(`${attacker.species} made a substitute!`);
			}
		}
		return true;

	case 'charge':
		attackerSlot.isCharged = true;
		messageLog.push(`${attacker.species} began charging power!`);
		// Note: Charge also boosts SpD, so we let it fall through to handleGenericBoostMove
		return false; // Let boost handler take over

	case 'stockpile':
		if (attackerSlot.stockpileCount < 3) {
			attackerSlot.stockpileCount++;
			messageLog.push(`${attacker.species} stockpiled ${attackerSlot.stockpileCount}!`);
			
			// --- ADDED: Contrary Check ---
			let boostValue = 1;
			if (toID(attacker.ability || '') === 'contrary') {
				boostValue = -1;
			}
			
			if (boostValue > 0) {
				if (attackerSlot.statStages.def < 6) {
					attackerSlot.statStages.def++;
					messageLog.push(`${attacker.species}'s Defense rose!`);
				}
				if (attackerSlot.statStages.spd < 6) {
					attackerSlot.statStages.spd++;
					messageLog.push(`${attacker.species}'s Sp. Def rose!`);
				}
			} else {
				if (attackerSlot.statStages.def > -6) {
					attackerSlot.statStages.def--;
					messageLog.push(`${attacker.species}'s Defense fell!`);
				}
				if (attackerSlot.statStages.spd > -6) {
					attackerSlot.statStages.spd--;
					messageLog.push(`${attacker.species}'s Sp. Def fell!`);
				}
			}
			// --- END ADDED ---
			return true; // Don't fall through, we handled the boosts here
		} else {
			messageLog.push(`${attacker.species} can't stockpile any more!`);
			return true;
		}
		
	case 'bellydrum':
		// --- ADDED: Contrary Check ---
		const contraryActive = toID(attacker.ability || '') === 'contrary';
		if (contraryActive) {
			if (attacker.hp <= attacker.maxHp / 2) {
				messageLog.push(`But it failed! (Not enough HP)`);
			} else if (attackerSlot.statStages.atk <= -6) {
				messageLog.push(`But it failed! (Attack is already minimized)`);
			} else {
				attacker.hp = Math.floor(attacker.hp - attacker.maxHp / 2);
				attackerSlot.statStages.atk = -6;
				messageLog.push(`${attacker.species} cut its own HP and minimized its Attack!`);
			}
		} else { // --- Original Logic ---
			if (attacker.hp <= attacker.maxHp / 2) {
				messageLog.push(`But it failed! (Not enough HP)`);
			} else if (attackerSlot.statStages.atk >= 6) {
				messageLog.push(`But it failed! (Attack is already maxed out)`);
			} else {
				attacker.hp = Math.floor(attacker.hp - attacker.maxHp / 2);
				attackerSlot.statStages.atk = 6;
				messageLog.push(`${attacker.species} cut its own HP and maximized its Attack!`);
			}
		}
		// --- END ADDED ---
		return true;

	case 'futuresight':
	case 'doomdesire':
		const futureMoveArray = isPlayerAttacker ? battle.opponentFutureMoves : battle.playerFutureMoves;
		const targetSlotLocalIndex = (isPlayerAttacker ? battle.opponentSlots : battle.playerSlots).indexOf(defenderSlot);
		if (targetSlotLocalIndex === -1) {
			messageLog.push('But it failed!');
			return true;
		}
		const existingFutureMove = futureMoveArray.find(fm => fm.slotIndex === targetSlotLocalIndex);
		if (existingFutureMove) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const attackerSlotIndex = (isPlayerAttacker ? battle.playerSlots : battle.opponentSlots).indexOf(attackerSlot);
		futureMoveArray.push({
			slotIndex: targetSlotLocalIndex,
			moveId: move.id as 'futuresight' | 'doomdesire',
			turnsLeft: 2,
			attackerSlotIndex,
			attackerStats: {
				atk: attacker.atk * getStatMultiplier(attackerSlot.statStages.atk),
				spa: attacker.spa * getStatMultiplier(attackerSlot.statStages.spa),
			},
		});
		messageLog.push(`${attacker.species} foresaw an attack!`);
		return true;

	case 'protect':
	case 'detect':
		const successCounter = attackerSlot.protectSuccessCounter;
		const successChance = 1 / 3 ** successCounter;
		if (Math.random() < successChance) {
			attackerSlot.isProtected = true;
			attackerSlot.protectSuccessCounter++;
			messageLog.push(`${attacker.species} protected itself!`);
		} else {
			messageLog.push(`But it failed!`);
		}
		return true;
		
	case 'followme':
	case 'ragepowder':
		attackerSlot.isRedirecting = true;
		messageLog.push(`${attacker.species} became the center of attention!`);
		return true;
		
	case 'haze':
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			slot.statStages = { ...INITIAL_STAT_STAGES };
		});
		messageLog.push('All stat changes were eliminated!');
		return true;
	}

	return false; // Move was not a known specific move
}

/**
 * REFACTORED MAIN STATUS MOVE HANDLER
 */
function handleStatusMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null, // Can be null for 'self' or 'allySide' moves
	move: Move,
	battle: BattleState,
	messageLog: string[]
) {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot?.pokemon;
	const defenderSpecies = defender ? Dex.species.get(defender.species) : null;

	// --- 1. Prankster vs Dark-type Check ---
	const attackerAbility = toID(attacker.ability || '');
	if (attackerAbility === 'prankster' && defenderSpecies?.types.includes('Dark')) {
		messageLog.push(`${defender!.species} is immune to Prankster-boosted moves!`);
		return;
	}

	// --- 2. Type/Effectiveness Check (if it targets an opponent) ---
	if (defender && defenderSpecies && move.target !== 'self' && !move.flags.heal) {
		const effectiveness = getCustomEffectiveness(move.type, defenderSpecies.types, defender, battle);
		if (effectiveness === 0) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
			return;
		}
	}

	// --- 3. Handle move by category ---
	
	// Handle moves with hardcoded logic first
	if (handleSpecificStatusMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}
	
	// Handle generic stat changes (e.g., Swords Dance, Growl)
	if (handleGenericBoostMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	// Handle generic status infliction (e.g., Thunder Wave, Spore)
	if (handleGenericStatusInflictMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	// Handle generic volatile status (e.g., Confuse Ray, Taunt)
	if (handleGenericVolatileMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}
	
	// Handle generic field effects (e.g., Rain Dance, Trick Room)
	if (handleGenericFieldMove(attackerSlot, move, battle, messageLog)) {
		return;
	}
	
	// Handle generic side effects (e.g., Stealth Rock, Reflect)
	if (handleGenericSideMove(attackerSlot, move, battle, messageLog)) {
		return;
	}
	
	// Handle generic healing (e.g., Recover, Roost)
	if (handleGenericHealMove(attackerSlot, move, messageLog)) {
		return;
	}

	// Handle self-switching moves (Baton Pass, Teleport)
	if (move.selfSwitch) {
		// This will be handled by executeAction
		return;
	}

	// If no other handler caught it, the move fails
	messageLog.push(`But it failed!`);
}

/********************************
 * REFACTORED END OF TURN
 ********************************/

/**
 * Applies end-of-turn status damage (Burn, Poison) and healing (Poison Heal).
 */
function applyEOTStatusDamage(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const pokemon = slot.pokemon;
	const status = slot.status;

	if (status === 'brn') {
		const damage = Math.max(1, Math.floor(pokemon.maxHp / 16));
		pokemon.hp = Math.max(0, pokemon.hp - damage);
		messageLog.push(`<span style="color: #F08030;"><strong>${pokemon.species}</strong> was hurt by its burn!</span>`);
	} else if (status === 'psn') {
		const ability = toID(pokemon.ability || '');
		if (ability === 'poisonheal' && pokemon.hp < pokemon.maxHp) {
			const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> was healed by its Poison Heal!</span>`);
		} else {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`<span style="color: #A040A0;"><strong>${pokemon.species}</strong> was hurt by its poison!</span>`);
		}
	}
}

/**
 * Applies end-of-turn item effects (Orbs, Berries, Leftovers, Black Sludge, Sticky Barb).
 * @returns {boolean} Returns `true` if a Lum Berry was consumed, indicating other status effects should be skipped.
 */
function applyEOTItemEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): boolean {
	if (slot.pokemon.hp <= 0 || battle.magicRoomTurns > 0) return false;
	
	const pokemon = slot.pokemon;
	const speciesData = Dex.species.get(pokemon.species);

	// --- Orbs (run first) ---
	if (!slot.status) {
		if (pokemon.item === 'flameorb' && !speciesData.types.includes('Fire')) {
			slot.status = 'brn';
			messageLog.push(`<span style="color: #F08030;"><strong>${pokemon.species}</strong> was burned by its Flame Orb!</span>`);
		} else if (pokemon.item === 'toxicorb' && !speciesData.types.includes('Poison') && !speciesData.types.includes('Steel')) {
			slot.status = 'psn'; // User intentionally skipped 'tox'
			messageLog.push(`<span style="color: #A040A0;"><strong>${pokemon.species}</strong> was badly poisoned by its Toxic Orb!</span>`);
		}
	}

	// --- Lum Berry (runs before status damage) ---
	if (slot.status && pokemon.item === 'lumberry') {
		slot.status = null;
		messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> ate its <strong>Lum Berry</strong> and cured its status condition!</span>`);
		pokemon.item = undefined;
		activateUnburden(slot, messageLog);
		return true; // Status was cured, skip status damage
	}

	// --- Healing/Damaging Items (run after status) ---
	if (pokemon.item === 'leftovers' && pokemon.hp < pokemon.maxHp) {
		pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + Math.max(1, Math.floor(pokemon.maxHp / 16)));
		messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> restored a little HP using its <strong>Leftovers</strong>!</span>`);
	} else if (pokemon.item === 'blacksludge') {
		if (speciesData.types.includes('Poison')) {
			if (pokemon.hp < pokemon.maxHp) {
				pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + Math.max(1, Math.floor(pokemon.maxHp / 16)));
				messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> restored a little HP using its <strong>Black Sludge</strong>!</span>`);
			}
		} else if (RPGAbilities.takesIndirectDamage(pokemon)) {
			pokemon.hp = Math.max(0, pokemon.hp - Math.max(1, Math.floor(pokemon.maxHp / 8)));
			messageLog.push(`<span style="color: #d9534f;"><strong>${pokemon.species}</strong> was hurt by its <strong>Black Sludge</strong>!</span>`);
		}
	} else if (pokemon.item === 'stickybarb') {
		if (RPGAbilities.takesIndirectDamage(pokemon)) {
			pokemon.hp = Math.max(0, pokemon.hp - Math.floor(pokemon.maxHp / 8));
			messageLog.push(`<span style="color: #d9534f;"><strong>${pokemon.species}</strong> was hurt by its <strong>Sticky Barb</strong>!</span>`);
		}
	}
	
	return false;
}

/**
 * Applies end-of-turn damage from volatile statuses (Cursed, Nightmare, Trapped).
 */
function applyEOTVolatileStatusDamage(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const pokemon = slot.pokemon;

	if (slot.isCursed) {
		if (RPGAbilities.takesIndirectDamage(pokemon)) {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 4));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`${pokemon.species} is afflicted by the curse!`);
		}
	}
	if (pokemon.hp <= 0) return;

	if (slot.hasNightmare) {
		if (slot.status === 'slp') {
			if (RPGAbilities.takesIndirectDamage(pokemon)) {
				const damage = Math.max(1, Math.floor(pokemon.maxHp / 4));
				pokemon.hp = Math.max(0, pokemon.hp - damage);
				messageLog.push(`${pokemon.species} is locked in a nightmare!`);
			}
		} else {
			slot.hasNightmare = false;
		}
	}
	if (pokemon.hp <= 0) return;

	if (slot.isTrapped) {
		if (RPGAbilities.takesIndirectDamage(pokemon)) {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`${pokemon.species} is hurt by the trap!`);
		}
	}
}

/**
 * Applies end-of-turn healing from volatile statuses (Leech Seed, Aqua Ring, Ingrain).
 */
function applyEOTHealingEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const pokemon = slot.pokemon;
	
	// --- Leech Seed (drains and heals opponent) ---
	if (slot.isSeeded) {
		if (RPGAbilities.takesIndirectDamage(pokemon)) {
			const drainAmount = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.max(0, pokemon.hp - drainAmount);
			messageLog.push(`${pokemon.species}'s health was sapped by Leech Seed!`);

			// Find an opponent to heal
			const isPlayer = battle.playerSlots.includes(slot);
			const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots);
			const opponentToHeal = opponentSlots[0]; // Heals the first available opponent

			if (opponentToHeal && opponentToHeal.pokemon.hp > 0 && (opponentToHeal.healBlockTurns || 0) <= 0) { // Check heal block on target
				const oldHp = opponentToHeal.pokemon.hp;
				opponentToHeal.pokemon.hp = Math.min(opponentToHeal.pokemon.maxHp, opponentToHeal.pokemon.hp + drainAmount);
				messageLog.push(`${opponentToHeal.pokemon.species} restored ${opponentToHeal.pokemon.hp - oldHp} HP!`);
			}
		}
	}
	if (pokemon.hp <= 0) return;
	
	// --- Self-healing effects (blocked by Heal Block) ---
	if ((slot.healBlockTurns || 0) > 0) return;

	if (slot.hasAquaRing && pokemon.hp < pokemon.maxHp) {
		const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
		pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
		messageLog.push(`${pokemon.species} was healed by Aqua Ring!`);
	}

	if (slot.isIngrained && pokemon.hp < pokemon.maxHp) {
		const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
		pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
		messageLog.push(`${pokemon.species} absorbed nutrients with its roots!`);
	}
}

/**
 * Decrements all end-of-turn counters (Yawn, Taunt, Disable, Encore, etc.).
 * Also handles Speed Boost.
 */
function decrementEOTVolatileCounters(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const pokemon = slot.pokemon;

	// --- Yawn ---
	if (slot.yawnCounter !== undefined && slot.yawnCounter > 0) {
		slot.yawnCounter--;
		if (slot.yawnCounter === 0) {
			if (!slot.status) {
				const isTerrainImmune = battle.terrain?.type === 'electric' && RPGAbilities.isGrounded(pokemon, battle);
				const isAbilityImmune = ['Insomnia', 'Vital Spirit', 'Comatose', 'Sweet Veil'].includes(pokemon.ability || '');

				if (!isTerrainImmune && !isAbilityImmune) {
					slot.status = 'slp';
					slot.sleepCounter = Math.floor(Math.random() * 3) + 2;
					messageLog.push(`<strong>${pokemon.species}</strong> fell asleep!`);
				} else {
					messageLog.push(`${pokemon.species} stayed awake!`);
				}
			}
			slot.yawnCounter = undefined;
		}
	}
	
	// --- Other Volatiles ---
	if (slot.isTrapped) {
		slot.isTrapped.turns--;
		if (slot.isTrapped.turns <= 0) {
			slot.isTrapped = null;
			messageLog.push(`${pokemon.species} was freed from the trap.`);
		}
	}
	if (slot.tauntTurns > 0) {
		slot.tauntTurns--;
		if (slot.tauntTurns <= 0) {
			messageLog.push(`${pokemon.species}'s taunt wore off.`);
		}
	}
	if (slot.disabledMove) {
		slot.disabledMove.turns--;
		if (slot.disabledMove.turns <= 0) {
			messageLog.push(`${pokemon.species}'s ${slot.disabledMove.moveId} is no longer disabled!`);
			slot.disabledMove = undefined;
		}
	}
	if (slot.encoreMove) {
		slot.encoreMove.turns--;
		if (slot.encoreMove.turns <= 0) {
			messageLog.push(`${pokemon.species}'s encore ended!`);
			slot.encoreMove = undefined;
		}
	}
	if (slot.magnetRiseTurns > 0) {
		slot.magnetRiseTurns--;
		if (slot.magnetRiseTurns === 0) {
			messageLog.push(`${pokemon.species}'s electromagnetism wore off!`);
		}
	}
	if (slot.telekinesisCounter > 0) {
		slot.telekinesisCounter--;
		if (slot.telekinesisCounter === 0) {
			messageLog.push(`${pokemon.species} was freed from telekinesis!`);
		}
	}
	if (slot.embargoTurns > 0) {
		slot.embargoTurns--;
		if (slot.embargoTurns === 0) {
			messageLog.push(`${pokemon.species} can use items again!`);
		}
	}
	if (slot.healBlockTurns > 0) {
		slot.healBlockTurns--;
		if (slot.healBlockTurns === 0) {
			messageLog.push(`${pokemon.species}'s Heal Block wore off!`);
		}
	}

	// --- Slow Start ---
	if (slot.slowStartTurns !== undefined && slot.slowStartTurns > 0) {
		slot.slowStartTurns--;
		if (slot.slowStartTurns === 0) {
			messageLog.push(`${pokemon.species} got its act together!`);
		}
	}
	
	// --- Speed Boost ---
	const ability = toID(pokemon.ability || '');
	if (ability === 'speedboost' && slot.statStages.spe < 6) {
		slot.statStages.spe++;
		messageLog.push(`${pokemon.species}'s Speed Boost raised its Speed!`);
	}
}

/**
 * [REFACTORED]
 * Processes end-of-turn effects like status damage, item healing/damage, and volatile statuses.
 */
function handleEndOfTurnEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;

	// 1. Handle EOT Item Activations (Orbs) and Cures (Lum Berry)
	const lumCuredStatus = applyEOTItemEffects(slot, battle, messageLog);
	if (slot.pokemon.hp <= 0) return;

	// 2. Handle Status Damage (Burn, Poison, Poison Heal)
	if (!lumCuredStatus) {
		applyEOTStatusDamage(slot, battle, messageLog);
	}
	if (slot.pokemon.hp <= 0) return;

	// 3. Handle Volatile Status Damage (Curse, Nightmare, Trap)
	applyEOTVolatileStatusDamage(slot, battle, messageLog);
	if (slot.pokemon.hp <= 0) return;
	
	// 4. Handle Volatile Healing (Leech Seed, Aqua Ring, Ingrain)
	applyEOTHealingEffects(slot, battle, messageLog);
	if (slot.pokemon.hp <= 0) return;

	// 5. Decrement all counters (Yawn, Taunt, Disable, Slow Start, Speed Boost, etc.)
	decrementEOTVolatileCounters(slot, battle, messageLog);

	// 6. Clear one-turn effects
	slot.isCharged = false; // Charge only lasts until next Electric move
}

/********************************
 * REFACTORED FAINT & SWITCHING
 ********************************/

/**
 * Handles all logic for a fainted opponent, including EXP, replacements, and hazards.
 * @returns {boolean} Returns true if the opponent's side is now empty.
 */
function handleOpponentFaint(
	battle: BattleState,
	player: PlayerData,
	playerParticipants: ActivePokemonSlot[],
	messageLog: string[]
): boolean {
	const opponentSlotsToCheck = (battle.battleType === 'wild_double' || battle.battleType === 'trainer_double') ? [0, 1] : [0];
	let faintedThisCheck = false;

	for (const i of opponentSlotsToCheck) {
		const slot = battle.opponentSlots[i];
		if (slot && slot.pokemon.hp <= 0) {
			faintedThisCheck = true;
			messageLog.push(`**The opposing ${slot.pokemon.species} fainted!**`);

			// --- AFTERMATH CHECK ---
			const faintedAbility = toID(slot.pokemon.ability || '');
			const lastMove = slot.lastMoveThatHitMe;
			if (faintedAbility === 'aftermath' && lastMove?.flags.contact) {
				// Find the attacker (who must be a player participant)
				const attackerSlot = playerParticipants.find(p => p.pokemon.id === slot.lastDamageTaken?.from);
				if (attackerSlot && attackerSlot.pokemon.hp > 0 && RPGAbilities.takesIndirectDamage(attackerSlot.pokemon)) {
					const damage = Math.floor(attackerSlot.pokemon.maxHp / 4);
					attackerSlot.pokemon.hp = Math.max(0, attackerSlot.pokemon.hp - damage);
					messageLog.push(`${attackerSlot.pokemon.species} was hurt by ${slot.pokemon.species}'s Aftermath!`);
				}
			}
			// --- END AFTERMATH CHECK ---

			// --- ADDED: Moxie / Beast Boost Check ---
			// This iterates over all player Pokemon that participated
			for (const participantSlot of playerParticipants) {
				if (participantSlot.pokemon.hp <= 0) continue;
				
				const ability = toID(participantSlot.pokemon.ability || '');
				
				if (ability === 'moxie' || ability === 'chillingneigh') {
					// --- CONTRARY FIX ---
					applyStatChange(participantSlot, 'atk', 1, battle, messageLog, participantSlot);
					// --- END FIX ---
				} else if (ability === 'beastboost') {
					// Find highest stat
					const stats = participantSlot.pokemon;
					let highestStat: keyof Stats | 'accuracy' | 'evasion' = 'atk';
					let maxStatVal = stats.atk;
					if (stats.def > maxStatVal) { maxStatVal = stats.def; highestStat = 'def'; }
					if (stats.spa > maxStatVal) { maxStatVal = stats.spa; highestStat = 'spa'; }
					if (stats.spd > maxStatVal) { maxStatVal = stats.spd; highestStat = 'spd'; }
					if (stats.spe > maxStatVal) { maxStatVal = stats.spe; highestStat = 'spe'; }

					// --- CONTRARY FIX ---
					applyStatChange(participantSlot, highestStat, 1, battle, messageLog, participantSlot);
					// --- END FIX ---
				}
			}
			// --- END ADDED ---

			// --- Grant EXP ---
			if (playerParticipants.length > 0) {
				gainExperience(player, playerParticipants, slot.pokemon, messageLog);
			}

			// --- Find Replacement ---
			const nextOpponent = battle.opponentParty.find(p =>
				p.hp > 0 &&
				!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
			);

			if (nextOpponent) {
				messageLog.push(`**${battle.opponentName} is about to send in ${nextOpponent.species}!**`);
				const newSlot = createActivePokemonSlot(nextOpponent);
				battle.opponentSlots[i as 0 | 1] = newSlot;

				const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
				if (faintedOnEntry) {
					messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
				} else {
					handleMirrorHerb(newSlot, battle, messageLog);
				}
			} else {
				// No replacement found
				battle.opponentSlots[i as 0 | 1] = null;
			}
		}
	}
	return faintedThisCheck;
}

/**
 * Handles all logic for a fainted player Pokemon.
 * @returns {boolean} Returns true if a player Pokemon fainted or a slot is empty.
 */
function handlePlayerFaint(battle: BattleState, messageLog: string[]): boolean {
	const playerSlotsToCheck = (battle.battleType === 'wild_double' || battle.battleType === 'trainer_double') ? [0, 1] : [0];
	let switchNeeded = false;

	for (const i of playerSlotsToCheck) {
		const slot = battle.playerSlots[i];
		if (slot === null || slot.pokemon.hp <= 0) {
			if (slot && slot.pokemon.hp <= 0) {
				messageLog.push(`**Your ${slot.pokemon.species} fainted!**`);

				// --- AFTERMATH CHECK ---
				const faintedAbility = toID(slot.pokemon.ability || '');
				const lastMove = slot.lastMoveThatHitMe;
				if (faintedAbility === 'aftermath' && lastMove?.flags.contact) {
					// Find the attacker (who must be an opponent)
					const opponentSlots = getActiveSlots(battle.opponentSlots);
					const attackerSlot = opponentSlots.find(p => p.pokemon.id === slot.lastDamageTaken?.from);
					if (attackerSlot && attackerSlot.pokemon.hp > 0 && RPGAbilities.takesIndirectDamage(attackerSlot.pokemon)) {
						const damage = Math.floor(attackerSlot.pokemon.maxHp / 4);
						attackerSlot.pokemon.hp = Math.max(0, attackerSlot.pokemon.hp - damage);
						messageLog.push(`${attackerSlot.pokemon.species} was hurt by ${slot.pokemon.species}'s Aftermath!`);
					}
				}
				// --- END AFTERMATH CHECK ---
			}
			battle.playerSlots[i as 0 | 1] = null;
			switchNeeded = true;
		}
	}
	return switchNeeded;
}

/**
 * Handles AI pivot moves like U-turn or Volt Switch.
 */
function handleAiPivot(battle: BattleState, messageLog: string[]) {
	if (!battle.aiPendingPivot) return;

	const nextOpponent = battle.opponentParty.find(p =>
		p.hp > 0 &&
		!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
	);
	const slotIndex = battle.aiPendingPivot.slotIndex;
	const pivotSlot = battle.aiPendingPivot.slot;

	if (nextOpponent) {
		messageLog.push(`**${battle.opponentName} withdrew ${pivotSlot.pokemon.species}!**`);
		messageLog.push(`**${battle.opponentName} sent out ${nextOpponent.species}!**`);

		const newSlot = createActivePokemonSlot(nextOpponent);

		// Handle Baton Pass
		if (battle.aiPendingPivot.isBatonPass) {
			newSlot.statStages = { ...pivotSlot.statStages };
			newSlot.isConfused = pivotSlot.isConfused;
			newSlot.confusionCounter = pivotSlot.confusionCounter;
			newSlot.isSeeded = pivotSlot.isSeeded;
			messageLog.push(`${newSlot.pokemon.species} received the Baton Pass!`);
		}

		battle.opponentSlots[slotIndex as 0 | 1] = newSlot;

		const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
		if (faintedOnEntry) {
			messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
		} else {
			handleMirrorHerb(newSlot, battle, messageLog);
		}
	} else {
		// No replacement, pivot fails
		battle.opponentSlots[slotIndex as 0 | 1] = pivotSlot;
		messageLog.push(`${pivotSlot.pokemon.species} had no one to switch to!`);
	}
	battle.aiPendingPivot = undefined; // Clear flag
}

/**
 * Checks for win/loss conditions.
 * @returns {boolean} Returns true if the battle ended.
 */
function checkForWinLoss(
	battle: BattleState,
	player: PlayerData,
	messageLog: string[]
): boolean {
	const playerHasLivingPokemon = player.party.some(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);
	const playerHasActivePokemon = getActiveSlots(battle.playerSlots).length > 0;

	// --- 1. Check for Player Loss ---
	if (!playerHasActivePokemon && !playerHasLivingPokemon) {
		saveBattleStatus(battle);

		let moneyLost = 100;
		if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
			moneyLost = Math.floor(battle.opponentMoney / 10) || 200;
		}
		moneyLost = Math.min(player.money, moneyLost);
		player.money -= moneyLost;
		battle.opponentMoney = moneyLost; // Store money lost for the UI

		battle.battleResult = 'loss';
		battle.forceEnd = true;
		return true; // Battle ended
	}

	// --- 2. Check for Player Win ---
	const opponentHasLivingPokemon = battle.opponentParty.some(p =>
		p.hp > 0 &&
		!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
	);
	const opponentHasActivePokemon = getActiveSlots(battle.opponentSlots).length > 0;

	if (!opponentHasActivePokemon && !opponentHasLivingPokemon) {
		saveBattleStatus(battle);

		let moneyGained = 0;
		if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
			moneyGained = battle.opponentMoney;
		} else {
			moneyGained = Math.floor(battle.opponentParty.reduce((sum, p) => sum + p.level, 0) * 5);
		}
		player.money += moneyGained;
		battle.opponentMoney = moneyGained; // Store money gained for the UI

		// --- Check for move learning ---
		if (player.pendingMoveLearnQueue?.moveIds.length) {
			battle.currentView = 'learn_move';
		} else {
			battle.battleResult = 'win';
		}
		battle.forceEnd = true;
		return true; // Battle ended
	}
	
	return false; // Battle continues
}

/**
 * [REFACTORED]
 * Checks the HP of all active Pokémon and handles the outcome of a faint.
 * This can result in a win, a loss, or a prompt to switch Pokémon.
 * @returns {boolean} Returns `true` if the battle ended or was interrupted (awaiting a switch), `false` if it continues.
 */
function checkBattleEndCondition(
	battle: BattleState,
	messageLog: string[]
): boolean {
	const player = getPlayerData(battle.playerId);
	
	// --- 1. Handle Faints ---
	const playerParticipants = getActiveSlots(battle.playerSlots);
	handleOpponentFaint(battle, player, playerParticipants, messageLog);
	const playerSwitchNeeded = handlePlayerFaint(battle, messageLog);

	// --- 2. Check for Win/Loss ---
	const battleEnded = checkForWinLoss(battle, player, messageLog);
	if (battleEnded) return true;

	// --- 3. Handle Pivot Moves ---
	// A. Check for Player Pivot Switch (U-turn, etc.)
	if (battle.pendingPivot) {
		battle.currentView = 'switch_pivot';
		battle.viewContext = { slotIndex: battle.pendingPivot.slotIndex };
		battle.forceEnd = true;
		return true; // Battle interrupted
	}
	// B. Check for AI Pivot Switch
	handleAiPivot(battle, messageLog);

	// --- 4. Handle Faint/Forced Switch-In ---
	const playerHasLivingPokemon = player.party.some(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);

	if (playerSwitchNeeded && playerHasLivingPokemon) {
		battle.currentView = 'switch_faint';
		battle.forceEnd = true;
		return true; // Battle interrupted
	}

	return false; // Battle continues
}


/**
 * Checks for statuses that might prevent a Pokémon from moving (sleep, freeze, paralysis, confusion).
 * @returns {boolean} `true` if the Pokémon can move, `false` otherwise.
 */

function handlePreTurnChecks(attackerSlot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): boolean {
	const attacker = attackerSlot.pokemon;

	// START: Add this new block for Flinch
	if (attackerSlot.willFlinch) {
		messageLog.push(`${attacker.species} flinched and couldn't move!`);
		attackerSlot.willFlinch = false; // Reset the flag
		return false; // Prevent the move
	}
	// END: New Flinch block

	// Check for Freeze
	if (attackerSlot.status === 'frz') {
		if (Math.random() < 0.20) {
			attackerSlot.status = null;
			messageLog.push(`${attacker.species} thawed out!`);
		} else {
			messageLog.push(`${attacker.species} is frozen solid!`);
			return false;
		}
	}

	// Check for Sleep
	if (attackerSlot.status === 'slp') {
		attackerSlot.sleepCounter--;
		if (attackerSlot.sleepCounter > 0) {
			messageLog.push(`${attacker.species} is fast asleep.`);
			return false;
		} else {
			attackerSlot.status = null;
			messageLog.push(`${attacker.species} woke up!`);
		}
	}

	// Check for Confusion
	if (attackerSlot.isConfused) {
		messageLog.push(`${attacker.species} is confused!`);
		attackerSlot.confusionCounter--;

		if (attackerSlot.confusionCounter <= 0) {
			attackerSlot.isConfused = false;
			messageLog.push(`${attacker.species} snapped out of its confusion!`);
		} else if (Math.random() < 1 / 3) {
			// --- START: Tangled Feet Check ---
			const attackerAbility = toID(attacker.ability || '');
			if (attackerAbility === 'tangledfeet') {
				messageLog.push(`${attacker.species}'s Tangled Feet prevents it from hurting itself!`);
				return false; // Prevents self-damage, but still uses the turn
			}
			// --- END: Tangled Feet Check ---
			
			messageLog.push(`It hurt itself in its confusion!`);
			const selfDamage = Math.floor((((2 * attacker.level / 5 + 2) * 40 * (attacker.atk / attacker.def)) / 50) + 2);
			attacker.hp = Math.max(0, attacker.hp - selfDamage);
			messageLog.push(`${attacker.species} took ${selfDamage} damage!`);
			return false; // Turn ends after self-damage
		}
	}

	// Check for Paralysis
	if (attackerSlot.status === 'par') {
		const attackerAbility = toID(attacker.ability || '');

		// Check for full paralysis, *unless* the user has Quick Feet
		if (attackerAbility !== 'quickfeet' && Math.random() < 0.25) {
			messageLog.push(`${attacker.species} is fully paralyzed!`);
			return false;
		}
	}

	return true; // Can move
}

/**
 * Applies all entry hazard effects to a Pokémon switching in.
 * Handles damage, status, and stat changes from Spikes, Toxic Spikes, Stealth Rock, and Sticky Web.
 * Also handles hazard removal effects (e.g., Poison-type absorbing Toxic Spikes).
 * @returns {boolean} Returns true if the Pokémon fainted from hazard damage.
 */
function applyHazardEffectsOnSwitchIn(slot: ActivePokemonSlot, battle: BattleState, isPlayerSwitchIn: boolean, messageLog: string[]): boolean {
	const pokemon = slot.pokemon;
	const ability = toID(pokemon.ability || '');

	// Helper function for switch-in abilities that run regardless of hazards
	const runSwitchInAbilities = () => {
		// --- 1. Weather, Terrain, Intimidate, etc. ---
		RPGAbilities.applySwitchInAbilities(slot, battle, isPlayerSwitchIn, messageLog);

		const opponentSlots = isPlayerSwitchIn ? getActiveSlots(battle.opponentSlots) : getActiveSlots(battle.playerSlots);

		// --- 2. Frisk ---
		if (ability === 'frisk') {
			for (const opponentSlot of opponentSlots) {
				if (opponentSlot && opponentSlot.pokemon.hp > 0 && opponentSlot.pokemon.item) {
					const itemName = ITEMS_DATABASE[opponentSlot.pokemon.item]?.name || opponentSlot.pokemon.item;
					messageLog.push(`${pokemon.species} frisked ${opponentSlot.pokemon.species} and found its ${itemName}!`);
				}
			}
		}

		// --- 3. Download ---
		if (ability === 'download' && opponentSlots.length > 0) {
			let totalDef = 0;
			let totalSpd = 0;
			for (const oppSlot of opponentSlots) {
				totalDef += oppSlot.pokemon.def * getStatMultiplier(oppSlot.statStages.def);
				totalSpd += oppSlot.pokemon.spd * getStatMultiplier(oppSlot.statStages.spd);
			}
			if (totalDef < totalSpd) {
				applyStatChange(slot, 'atk', 1, battle, messageLog, slot);
			} else {
				applyStatChange(slot, 'spa', 1, battle, messageLog, slot);
			}
		}
		
		// --- 4. Trace ---
		if (ability === 'trace') {
			const untraceableAbilities = ['trace', 'stancechange', 'schooling', 'disguise', 'neutralizinggas', 'download', 'forecast', 'flowergift', 'imposter', 'multitype'];
			const validTargets = opponentSlots.filter(oppSlot => 
				oppSlot.pokemon.ability && !untraceableAbilities.includes(toID(oppSlot.pokemon.ability))
			);
			
			if (validTargets.length > 0) {
				const targetSlot = validTargets[Math.floor(Math.random() * validTargets.length)];
				const tracedAbility = targetSlot.pokemon.ability || 'No Ability';
				pokemon.ability = tracedAbility;
				messageLog.push(`${pokemon.species} traced ${targetSlot.pokemon.species}'s ${tracedAbility}!`);
			}
		}
	};

	// Heavy-Duty Boots provides total immunity to all entry hazards.
	if (battle.magicRoomTurns === 0 && pokemon.item === 'heavydutyboots') {
		runSwitchInAbilities(); // Run switch-in abilities even if immune to hazards
		return false;
	}

	const hazards = isPlayerSwitchIn ? battle.playerHazards : battle.opponentHazards;
	if (hazards.length === 0) {
		runSwitchInAbilities(); // No hazards, just run switch-in abilities
		return false;
	}

	const species = Dex.species.get(pokemon.species);
	const isGrounded = RPGAbilities.isGrounded(pokemon, battle);
	const hasAirBalloon = battle.magicRoomTurns === 0 && pokemon.item === 'airballoon';

	let totalDamage = 0;
	let airBalloonPopped = false;

	// --- Effects that don't do direct damage (run first) ---
	if (isGrounded) {
		// Sticky Web lowers Speed
		if (hazards.includes('stickyweb')) {
			// --- CONTRARY FIX: Use applyStatChange ---
			applyStatChange(slot, 'spe', -1, battle, messageLog, null); // Source is null (field hazard)
			// --- END FIX ---
		}

		// Toxic Spikes poisons or badly poisons
		const toxicSpikeLayers = hazards.filter(h => h === 'toxicspikes').length;
		if (toxicSpikeLayers > 0) {
			if (species.types.includes('Poison')) {
				if (isPlayerSwitchIn) {
					battle.playerHazards = battle.playerHazards.filter(h => h !== 'toxicspikes');
				} else {
					battle.opponentHazards = battle.opponentHazards.filter(h => h !== 'toxicspikes');
				}
				messageLog.push(`The Toxic Spikes were absorbed by ${pokemon.species}!`);
			} else {
				const isImmune = species.types.includes('Steel');
				const targetStatus = slot.status; 

				if (!isImmune && !targetStatus) {
					const newStatus: Status = 'psn'; 
					slot.status = newStatus; 
					messageLog.push(`${pokemon.species} was poisoned by the Toxic Spikes!`);
				}
			}
		}
	}

	// --- Damage-dealing hazards ---
	if (isGrounded) {
		const spikeLayers = hazards.filter(h => h === 'spikes').length;
		if (spikeLayers > 0) {
			const damageFraction = [0, 1 / 8, 1 / 6, 1 / 4][spikeLayers];
			totalDamage += Math.floor(pokemon.maxHp * damageFraction);
		}
	}

	if (hazards.includes('stealthrock')) {
		if (hasAirBalloon) {
			messageLog.push(`${pokemon.species}'s Air Balloon popped from the pointed stones!`);
			pokemon.item = undefined;
			airBalloonPopped = true;
		}
		const effectiveness = getCustomEffectiveness('Rock', species.types, pokemon, battle);
		totalDamage += Math.floor(pokemon.maxHp * (1 / 8) * effectiveness);
	}

	// Apply final damage and add appropriate messages
	if (totalDamage > 0) {
		if (hazards.includes('stealthrock')) {
			messageLog.push(`Pointed stones dug into ${pokemon.species}!`);
		} else if (hazards.includes('spikes')) {
			messageLog.push(`${pokemon.species} was hurt by the spikes!`);
		}
		pokemon.hp = Math.max(0, pokemon.hp - totalDamage);
		if (pokemon.hp <= 0) {
			return true; // Pokémon fainted
		}
	}

	// Run switch-in abilities (weather/terrain setting)
	runSwitchInAbilities();

	return false; // Pokémon survived
}

/**
 * Applies a stat stage change to a slot, respecting Contrary and other abilities/items.
 * @returns {boolean} `true` if the stat change had any effect.
 */
function applyStatChange(
	slot: ActivePokemonSlot,
	stat: keyof ActivePokemonSlot['statStages'],
	value: number,
	battle: BattleState,
	messageLog: string[],
	source: ActivePokemonSlot | null = null // Source of the change (null if from self)
): boolean {
	const pokemon = slot.pokemon;
	const ability = toID(pokemon.ability || '');
	let actualValue = value;

	// 1. Check Contrary
	if (ability === 'contrary') {
		actualValue *= -1;
	}

	// --- SIMPLE IMPLEMENTATION ---
	if (ability === 'simple') {
		actualValue *= 2;
	}
	// --- END SIMPLE IMPLEMENTATION ---

	const currentStage = slot.statStages[stat];
	const isSelf = !source || source.pokemon.id === pokemon.id;

	if (actualValue > 0) { // Stat Rise
		if (currentStage >= 6) {
			messageLog.push(`${pokemon.species}'s ${stat.toUpperCase()} won't go any higher!`);
			return false;
		}
		const newStage = Math.min(6, currentStage + actualValue);
		slot.statStages[stat] = newStage as any;
		const msg = `${pokemon.species}'s ${stat.toUpperCase()} ${actualValue > 1 ? 'sharply ' : ''}rose!`;
		messageLog.push(msg);
		return true;

	} else if (actualValue < 0) { // Stat Drop
		// 2. Check for drop-prevention (only if not self-inflicted)
		if (!isSelf) {
			if (battle.magicRoomTurns === 0 && pokemon.item === 'clearamulet') {
				messageLog.push(`${pokemon.species}'s Clear Amulet prevents its stats from being lowered!`);
				return false;
			}
			const blockAbilities = ['clearbody', 'whitesmoke', 'fullmetalbody'];
			if (blockAbilities.includes(ability)) {
				messageLog.push(`${pokemon.species}'s ${ability} prevents its stats from being lowered!`);
				return false;
			}
			if (stat === 'atk' && ['hypercutter', 'flowerveil'].includes(ability)) {
				messageLog.push(`${pokemon.species}'s ${ability} prevents its Attack from being lowered!`);
				return false;
			}
		}

		if (currentStage <= -6) {
			messageLog.push(`${pokemon.species}'s ${stat.toUpperCase()} won't go any lower!`);
			return false;
		}
		const newStage = Math.max(-6, currentStage + actualValue);
		slot.statStages[stat] = newStage as any;
		const msg = `${pokemon.species}'s ${stat.toUpperCase()} ${actualValue < -1 ? 'sharply ' : ''}fell!`;
		messageLog.push(msg);

		// 3. Trigger Defiant/Competitive
		checkStatDropAbilities(slot, source, battle, messageLog);
		return true;
	}

	return false; // value was 0
}

function handleMirrorHerb(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): void {
	if (battle.magicRoomTurns > 0 || slot.pokemon.item !== 'mirrorherb') return;

	const isPlayer = battle.playerSlots.includes(slot);
	const myStages = slot.statStages;
	const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots);

	if (opponentSlots.length === 0) return; // No opponents to copy from

	let copiedAny = false;
	const stats = ['atk', 'def', 'spa', 'spd', 'spe'] as const;

	for (const stat of stats) {
		// Find the maximum positive stat boost for this stat among all opponents
		const maxOpponentBoost = Math.max(0, ...opponentSlots.map(s => s.statStages[stat]));

		if (maxOpponentBoost > 0) {
			// Copy those boosts
			myStages[stat] = Math.min(6, myStages[stat] + maxOpponentBoost);
			copiedAny = true;
		}
	}

	if (copiedAny) {
		messageLog.push(`${slot.pokemon.species}'s Mirror Herb copied the opponent's stat boosts!`);
		slot.pokemon.item = undefined; // Consumed after use
		activateUnburden(slot, messageLog); // <-- FIX: Was 'attackerSlot'
	}
}

/**
 * Handles the Synchronize ability, applying a status back to the attacker.
 */
function applySynchronize(
	status: Status,
	defenderSlot: ActivePokemonSlot,
	attackerSlot: ActivePokemonSlot,
	battle: BattleState,
	messageLog: string[]
): void {
	const attacker = attackerSlot.pokemon;
	if (!attacker || attacker.hp <= 0) return; // Don't apply if attacker fainted

	const attackerSpecies = Dex.species.get(attacker.species);
	let canBeAfflicted = !attackerSlot.status; // Can't afflict if already statused

	if (!canBeAfflicted) return;

	// Check for type immunities
	if ((status === 'brn' && attackerSpecies.types.includes('Fire')) ||
		(status === 'par' && attackerSpecies.types.includes('Electric')) ||
		(status === 'psn' && (attackerSpecies.types.includes('Poison') || attackerSpecies.types.includes('Steel'))) ||
		(status === 'frz' && attackerSpecies.types.includes('Ice'))) {
		canBeAfflicted = false;
	}

	// Check for ability immunities
	if (canBeAfflicted && RPGAbilities.preventsStatus(attacker, status)) {
		canBeAfflicted = false;
	}

	// Check for terrain immunities
	const attackerIsGrounded = RPGAbilities.isGrounded(attacker, battle);
	if (canBeAfflicted && battle.terrain?.type === 'misty' && attackerIsGrounded) {
		canBeAfflicted = false; // Misty Terrain prevents status
	}
	if (canBeAfflicted && battle.terrain?.type === 'electric' && status === 'slp' && attackerIsGrounded) {
		canBeAfflicted = false; // Electric Terrain prevents sleep
	}

	if (canBeAfflicted) {
		attackerSlot.status = status;
		if (status === 'slp') {
			attackerSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
		}
		messageLog.push(`${defenderSlot.pokemon.species}'s Synchronize afflicted ${attacker.species} with ${status}!`);
	}
}

/**
 * Mental Herb: Cures move-binding effects (Taunt, Encore, Disable, Torment, Heal Block)
 * Called after a move-binding effect is applied to check if Mental Herb should cure it
 */
function checkMentalHerb(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): boolean {
	if (battle.magicRoomTurns > 0 || slot.pokemon.item !== 'mentalherb') return false;

	// Check if the Pokemon has any move-binding effects
	const hasBindingEffect =
		slot.tauntTurns > 0 ||
		slot.encoreMove !== undefined ||
		slot.disabledMove !== undefined ||
		slot.tormentActive ||
		(slot.healBlockTurns || 0) > 0;

	if (hasBindingEffect) {
		// Cure all move-binding effects
		slot.tauntTurns = 0;
		slot.encoreMove = undefined;
		slot.disabledMove = undefined;
		slot.tormentActive = false;
		slot.healBlockTurns = 0;

		messageLog.push(`${slot.pokemon.species}'s Mental Herb snapped it out of its confusion!`);
		slot.pokemon.item = undefined; // Mental Herb is consumed
		activateUnburden(slot, messageLog); // <-- FIX: Was 'attackerSlot'
		return true;
	}

	return false;
}

function handleHPDropEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	// **NEW:** Magic Room disables all held items.
	if (battle.magicRoomTurns > 0) return;

	const pokemon = slot.pokemon;

	// No effect if fainted, no item, or if an item was already consumed this turn (prevents multiple berries activating)
	if (pokemon.hp <= 0 || !pokemon.item) return;

	let itemConsumed = false;
	let consumedItemName = '';
	const isPlayer = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);

	// **FIXED HP THRESHOLDS:** Check both 50% and 25% thresholds in one pass
	const halfHP = pokemon.maxHp / 2;
	const quarterHP = pokemon.maxHp / 4;

	// Priority 1: 50% HP healing items (FIXED: Sitrus Berry now activates at 1/2 HP)
	if (pokemon.hp <= halfHP && !itemConsumed) {
		let healAmount = 0;
		if (pokemon.item === 'berryjuice') {
			healAmount = 20;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} drank its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'oranberry') {
			healAmount = 10;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'goldberry') {
			healAmount = 30;
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'sitrusberry') {
			// FIXED: Sitrus Berry now activates at 1/2 HP and heals 1/4 max HP
			healAmount = Math.floor(pokemon.maxHp / 4);
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		}

		if (healAmount > 0) {
			const oldHp = pokemon.hp;
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
		}
	}

	// Priority 2: 25% HP items (only if no item consumed yet)
	if (!itemConsumed && pokemon.hp <= quarterHP) {
		const pinchBerryHP = ['figyberry', 'wikiberry', 'magoberry', 'aguavberry', 'iapapaberry'];
		const pinchBerryStat: Record<string, keyof Omit<Stats, 'maxHp'>> = {
			'liechiberry': 'atk', 'ganlonberry': 'def', 'salacberry': 'spe',
			'petayaberry': 'spa', 'apicotberry': 'spd',
		};

		if (pinchBerryHP.includes(pokemon.item)) {
			const oldHp = pokemon.hp;
			// FIXED: Now heals 1/2 max HP instead of 1/3
			const healAmount = Math.floor(pokemon.maxHp / 2);
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${pokemon.hp - oldHp} HP!`);

			// Check for confusion based on nature
			const berryData = BERRY_FLAVORS[pokemon.item];
			const natureData = NATURES[pokemon.nature];
			if (natureData && berryData) {
				// Pokemon becomes confused if the berry's flavor matches what the nature dislikes
				const dislikedFlavor = natureData.minus ? NATURE_FLAVOR_PREFERENCES[natureData.minus] : null;
				if (dislikedFlavor && berryData.flavor === dislikedFlavor) {
					if (!slot.isConfused) {
						slot.isConfused = true;
						slot.confusionCounter = Math.floor(Math.random() * 3) + 2; // 2-4 turns
						messageLog.push(`${pokemon.species} became confused due to the berry's flavor!`);
					}
				}
			}
			itemConsumed = true;
		} else if (pokemon.item in pinchBerryStat) {
			const statToBoost = pinchBerryStat[pokemon.item] as keyof ActivePokemonSlot['statStages'];
			
			// --- CONTRARY FIX ---
			if (applyStatChange(slot, statToBoost, 1, battle, messageLog, slot)) {
				consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
				// Message is handled by applyStatChange, but we add context
				messageLog[messageLog.length - 1] += ` (from ${consumedItemName})!`;
				itemConsumed = true;
			}
			// --- END FIX ---

		} else if (pokemon.item === 'starfberry') {
			const targetStages = slot.statStages;
			const stats = ['atk', 'def', 'spa', 'spd', 'spe'] as const;
			const availableStats = stats.filter(stat => targetStages[stat] < 6);

			if (availableStats.length > 0) {
				const randomStat = availableStats[Math.floor(Math.random() * availableStats.length)];
				
				// --- CONTRARY FIX ---
				if (applyStatChange(slot, randomStat, 2, battle, messageLog, slot)) {
					consumedItemName = ITEMS_DATABASE[pokemon.item]?.name || pokemon.item;
					// Message is handled by applyStatChange, but we add context
					messageLog[messageLog.length - 1] += ` (from ${consumedItemName})!`;
					itemConsumed = true;
				}
				// --- END FIX ---
			}
		}
	}

	// If an item was used, remove it from the Pokemon
	if (itemConsumed) {
		pokemon.item = undefined;
		activateUnburden(slot, messageLog);
	}
}



/**
 * Processes end-of-turn effects for weather, such as damage and duration.
 */
function handleEndOfTurnWeather(battle: BattleState, messageLog: string[]) {
	// --- START FIX: Cloud Nine / Air Lock ---
	if (!RPGAbilities.isWeatherActive(battle)) {
		// Weather still counts down, but no messages or effects
		if (battle.weather) battle.weather.turns--;
		if (battle.weather && battle.weather.turns <= 0) battle.weather = undefined;
		return;
	}
	// --- END FIX ---

	// This line is now safe because isWeatherActive checks for !battle.weather
	battle.weather!.turns--;

	const weatherMessages = {
		'sun': 'The sunlight is harsh.',
		'rain': 'Rain continues to fall.',
		'sand': 'The sandstorm rages.',
		'hail': 'The hail crashes down.',
	};
	messageLog.push(weatherMessages[battle.weather!.type]);

	// Apply weather damage and healing effects
	const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	for (const slot of allSlots) {
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0) continue;
		const species = Dex.species.get(pokemon.species);
		const ability = toID(pokemon.ability || '');

		// Weather healing abilities
		if (battle.weather!.type === 'rain' && ability === 'raindish' && pokemon.hp < pokemon.maxHp) {
			const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			messageLog.push(`${pokemon.species}'s Rain Dish restored its HP!`);
		} else if (battle.weather!.type === 'hail' && ability === 'icebody' && pokemon.hp < pokemon.maxHp) {
			const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			messageLog.push(`${pokemon.species}'s Ice Body restored its HP!`);
		} else if (battle.weather!.type === 'rain' && ability === 'dryskin' && pokemon.hp < pokemon.maxHp) {
			const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
			messageLog.push(`${pokemon.species}'s Dry Skin restored its HP!`);
		} else if (battle.weather!.type === 'rain' && ability === 'hydration' && slot.status) { // <-- ADDED THIS BLOCK
			slot.status = null;
			messageLog.push(`${pokemon.species}'s Hydration cured its status condition!`);
		}

		// Weather damage
		let takeDamage = false;
		let damageAmount = Math.floor(pokemon.maxHp / 16);

		// Sandstorm damage
		if (battle.weather!.type === 'sand' && !species.types.includes('Rock') && !species.types.includes('Ground') && !species.types.includes('Steel')) {
			takeDamage = true;
		}
		// Hail damage (but not if Ice Body healed)
		else if (battle.weather!.type === 'hail' && !species.types.includes('Ice') && ability !== 'icebody') {
			takeDamage = true;
		}
		// Sun damage for Dry Skin and Solar Power
		else if (battle.weather!.type === 'sun') {
			if (ability === 'dryskin') {
				takeDamage = true;
				damageAmount = Math.floor(pokemon.maxHp / 8);
			} else if (ability === 'solarpower') {
				takeDamage = true;
				damageAmount = Math.floor(pokemon.maxHp / 8);
			}
		}

		// Apply weather damage (blocked by Magic Guard)
		if (takeDamage && RPGAbilities.takesIndirectDamage(pokemon)) {
			pokemon.hp = Math.max(0, pokemon.hp - Math.max(1, damageAmount));
			if (ability === 'dryskin' && battle.weather!.type === 'sun') {
				messageLog.push(`${pokemon.species} was hurt by its Dry Skin!`);
			} else if (ability === 'solarpower') {
				messageLog.push(`${pokemon.species} was hurt by Solar Power!`);
			} else {
				messageLog.push(`${pokemon.species} is buffeted by the weather!`);
			}
		}
	}

	// Check if weather has ended
	if (battle.weather!.turns <= 0) {
		const weatherEndMessages = {
			'sun': 'The sunlight faded.',
			'rain': 'The rain stopped.',
			'sand': 'The sandstorm subsided.',
			'hail': 'The hail stopped.',
		};
		messageLog.push(weatherEndMessages[battle.weather!.type]);
		battle.weather = undefined;
	}
}

/**
 * Checks if a Pokemon's held item is usable (not suppressed by Magic Room or Embargo)
 * @param slot The Pokemon slot to check
 * @param battle The battle state
 * @returns true if items can be used, false if suppressed
 */
function canUseItem(slot: ActivePokemonSlot, battle: BattleState): boolean {
	// Magic Room suppresses all items
	if (battle.magicRoomTurns > 0) return false;
	// Embargo suppresses this Pokemon's item specifically
	if (slot.embargoTurns > 0) return false;
	return true;
}

/**
 * Processes end-of-turn effects for all field conditions (Rooms, Terrains).
 */
function handleEndOfTurnFieldEffects(battle: BattleState, messageLog: string[]) {
	// Handle Terrain
	if (battle.terrain) {
		if (battle.terrain.type === 'grassy') {
			const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);
			for (const slot of allSlots) {
				const pokemon = slot.pokemon;
				if (pokemon.hp > 0 && pokemon.hp < pokemon.maxHp && RPGAbilities.isGrounded(pokemon, battle)) {
					const healAmount = Math.max(1, Math.floor(pokemon.maxHp / 16));
					pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
					messageLog.push(`${pokemon.species} restored a little HP due to the Grassy Terrain!`);
				}
			}
		}

		battle.terrain.turns--;
		if (battle.terrain.turns <= 0) {
			messageLog.push(`The ${battle.terrain.type} terrain returned to normal.`);
			battle.terrain = undefined;
		}
	}

	// Handle Screens
	if (battle.playerReflectTurns > 0) {
		battle.playerReflectTurns--;
		if (battle.playerReflectTurns === 0) messageLog.push(`Your team's Reflect wore off!`);
	}
	if (battle.opponentReflectTurns > 0) {
		battle.opponentReflectTurns--;
		if (battle.opponentReflectTurns === 0) messageLog.push(`The opposing team's Reflect wore off!`);
	}
	if (battle.playerLightScreenTurns > 0) {
		battle.playerLightScreenTurns--;
		if (battle.playerLightScreenTurns === 0) messageLog.push(`Your team's Light Screen wore off!`);
	}
	if (battle.opponentLightScreenTurns > 0) {
		battle.opponentLightScreenTurns--;
		if (battle.opponentLightScreenTurns === 0) messageLog.push(`The opposing team's Light Screen wore off!`);
	}
	if (battle.playerAuroraVeilTurns > 0) {
		battle.playerAuroraVeilTurns--;
		if (battle.playerAuroraVeilTurns === 0) messageLog.push(`Your team's Aurora Veil wore off!`);
	}
	if (battle.opponentAuroraVeilTurns > 0) {
		battle.opponentAuroraVeilTurns--;
		if (battle.opponentAuroraVeilTurns === 0) messageLog.push(`The opposing team's Aurora Veil wore off!`);
	}

	// Handle Trick Room
	if (battle.trickRoomTurns > 0) {
		battle.trickRoomTurns--;
		if (battle.trickRoomTurns <= 0) {
			messageLog.push('The twisted dimensions returned to normal.');
		}
	}

	// Handle Magic Room
	if (battle.magicRoomTurns > 0) {
		battle.magicRoomTurns--;
		if (battle.magicRoomTurns <= 0) {
			messageLog.push('The bizarre dimensions disappeared. Held items are effective again.');
		}
	}

	// Handle Wonder Room
	if (battle.wonderRoomTurns > 0) {
		battle.wonderRoomTurns--;
		if (battle.wonderRoomTurns <= 0) {
			messageLog.push('The bizarre dimensions disappeared. Defense and Sp. Def stats returned to normal.');
		}
	}

	// Handle Gravity
	if (battle.gravityTurns > 0) {
		battle.gravityTurns--;
		if (battle.gravityTurns <= 0) {
			messageLog.push('The gravity returned to normal.');
		}
	}

	// Handle Mud Sport
	if (battle.mudSportTurns > 0) {
		battle.mudSportTurns--;
		if (battle.mudSportTurns <= 0) {
			messageLog.push('The effects of Mud Sport wore off.');
		}
	}

	// Handle Water Sport
	if (battle.waterSportTurns > 0) {
		battle.waterSportTurns--;
		if (battle.waterSportTurns <= 0) {
			messageLog.push('The effects of Water Sport wore off.');
		}
	}
}

/***********************
* MAIN UNIFICATION
************************/
/**
 * Executes a single move for a single Pokémon during a battle turn.
 * This unified function handles all turn logic, including pre-turn checks,
 * accuracy, move execution, and post-turn effects.
 */
function executeMove(
	attackerSlot: ActivePokemonSlot,
	targetSlots: ActivePokemonSlot[],
	move: Move,
	moveObject: { id: string, pp: number },
	battle: BattleState,
	messageLog: string[]
): void {
	// Track last move used (for Disable, Torment, etc.)
	attackerSlot.lastMoveUsed = move.id;

	// Reset protect counter if a different move is used
	if (!['protect', 'detect'].includes(move.id)) {
		attackerSlot.protectSuccessCounter = 0;
	}

	// --- Calculate Spread Multiplier ---
	const isSpread = ['allAdjacentFoes', 'allAdjacent', 'scripted'].includes(move.target);
	const validTargetCount = targetSlots.filter(s => s.pokemon.hp > 0).length;
	const spreadMultiplier = (isSpread && validTargetCount > 1) ? 0.75 : 1.0;

	for (const defenderSlot of targetSlots) {
		if (attackerSlot.pokemon.hp <= 0) break; // Attacker fainted mid-move (e.g. from ally recoil)
		if (defenderSlot.pokemon.hp <= 0) continue; // Target fainted mid-move (e.g. from first hit of spread)

		// --- NEW: WIDE GUARD CHECK ---
		const isPlayerDefender = battle.playerSlots.includes(defenderSlot);

		if (isSpread) {
			if (isPlayerDefender && battle.playerWideGuard) {
				messageLog.push(`${defenderSlot.pokemon.species} was protected by Wide Guard!`);
				continue; // Fails against this target
			}
			if (!isPlayerDefender && battle.opponentWideGuard) {
				messageLog.push(`${defenderSlot.pokemon.species} was protected by Wide Guard!`);
				continue; // Fails against this target
			}
		}
		// --- END WIDE GUARD CHECK ---

		// 2. Check for Protection (Struggle bypasses this)
		if (move.id !== 'struggle') {
			if (defenderSlot.isProtected && move.flags.protect && !move.breaksProtect) {
				messageLog.push(`<span style="color: #6c757d;">${defenderSlot.pokemon.species} protected itself!</span>`);
				continue; // Move fails against this target
			}
		}

		// 6. Accuracy Check
		let moveHit = true;
		if (['aerialace'].includes(move.id)) {
			// Bypasses accuracy
		} else if (move.accuracy !== true) {
			// --- START FIX: Accuracy/Evasion Abilities ---
			const accuracyMultiplier = getAccuracyEvasionMultiplier(attackerSlot.statStages.accuracy);
			const evasionMultiplier = getAccuracyEvasionMultiplier(defenderSlot.statStages.evasion);
			let moveAccuracy = move.accuracy;

			// Apply ability modifiers like Compound Eyes or Hustle
			moveAccuracy = RPGAbilities.applyAccuracyModifier(moveAccuracy, attackerSlot.pokemon);
			
			// Apply ability-based evasion modifiers
			const abilityEvasionMultiplier = RPGAbilities.getEvasionMultiplier(defenderSlot, battle);
			const finalEvasionMultiplier = evasionMultiplier * abilityEvasionMultiplier;
			// --- END FIX ---
			
			// ... (Weather accuracy logic) ...
			// --- START FIX: Cloud Nine ---
			if (RPGAbilities.isWeatherActive(battle)) {
			// --- END FIX ---
				if (battle.weather!.type === 'rain') {
					if (['thunder', 'hurricane'].includes(move.id)) moveAccuracy = 100;
				} else if (battle.weather!.type === 'sun') {
					if (['thunder', 'hurricane'].includes(move.id)) moveAccuracy = 50;
				}
				if (battle.weather!.type === 'hail' && move.id === 'blizzard') {
					moveAccuracy = 100;
				}
			}

			// Gravity increases accuracy by 5/3 (approx 1.67x)
			if (battle.gravityTurns > 0) {
				moveAccuracy = Math.floor(moveAccuracy * (5 / 3));
			}

			// --- START FIX: Use finalEvasionMultiplier ---
			const finalAccuracy = moveAccuracy * (accuracyMultiplier / finalEvasionMultiplier);
			// --- END FIX ---
			if ((Math.random() * 100) > finalAccuracy) {
				messageLog.push(`<span style="color: #dc3545;">${attackerSlot.pokemon.species}'s ${move.name} missed ${defenderSlot.pokemon.species}!</span>`);
				moveHit = false;

				if (['highjumpkick', 'jumpkick'].includes(move.id)) {
					const crashDamage = Math.floor(attackerSlot.pokemon.maxHp / 2);
					attackerSlot.pokemon.hp = Math.max(0, attackerSlot.pokemon.hp - crashDamage);
					messageLog.push(`<span style="color: #dc3545;">${attackerSlot.pokemon.species} kept going and crashed!</span>`);
				}
			}
		}

		if (!moveHit) {
			continue; // Move missed this target
		}

		// 7. Execute the Move
		if (move.id === 'struggle') {
			handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog, 1.0); // Struggle doesn't spread
		} else if (move.category === 'Status') {
			handleStatusMove(attackerSlot, defenderSlot, move, battle, messageLog);
		} else {
			handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog, spreadMultiplier);
		}
	}

	// Check for form changes after move execution
	if (attackerSlot && attackerSlot.pokemon.hp > 0) {
		RPGAbilities.checkFormChangeAbilities(attackerSlot, battle, messageLog);
	}
	for (const defenderSlot of targetSlots) {
		if (defenderSlot && defenderSlot.pokemon.hp > 0) {
			RPGAbilities.checkFormChangeAbilities(defenderSlot, battle, messageLog);
		}
	}
}

/**
 * Processes all end-of-turn effects, such as status damage,
 * weather, and field conditions, for both Pokémon.
 */
function processEndOfTurn(battle: BattleState, messageLog: string[]) {
	// Get all active slots before effects start
	const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	// --- Process Future Sight / Doom Desire attacks ---
	// Process player's future moves (hitting opponents)
	battle.playerFutureMoves = battle.playerFutureMoves.filter(fm => {
		fm.turnsLeft--;
		if (fm.turnsLeft === 0) {
			// Execute the future move
			const targetSlot = battle.opponentSlots[fm.slotIndex];
			if (targetSlot && targetSlot.pokemon.hp > 0) {
				const moveName = fm.moveId === 'futuresight' ? 'Future Sight' : 'Doom Desire';
				messageLog.push(`<strong>${moveName}</strong> took effect!`);

				// Calculate damage using stored stats
				const move = getMove(fm.moveId);
				const basePower = move.basePower || 120;
				const moveType = move.type;

				// Get defender's current stats
				const defender = targetSlot.pokemon;
				const defenderSpecies = Dex.species.get(defender.species);
				const defenderDef = defender.spd * getStatMultiplier(targetSlot.statStages.spd);

				// Calculate damage
				const effectiveness = getCustomEffectiveness(moveType, defenderSpecies.types, defender, battle);
				const baseDamage = Math.floor((2 * 50 / 5 + 2) * basePower * (fm.attackerStats.spa / defenderDef) / 50) + 2;
				const damage = Math.floor(baseDamage * effectiveness);

				// Apply damage
				targetSlot.pokemon.hp = Math.max(0, targetSlot.pokemon.hp - damage);
				messageLog.push(`${defender.species} took ${damage} damage!`);

				if (effectiveness > 1) messageLog.push(`It's super effective!`);
				else if (effectiveness < 1 && effectiveness > 0) messageLog.push(`It's not very effective...`);
			}
			return false; // Remove this future move from the array
		}
		return true; // Keep this future move
	});

	// Process opponent's future moves (hitting player)
	battle.opponentFutureMoves = battle.opponentFutureMoves.filter(fm => {
		fm.turnsLeft--;
		if (fm.turnsLeft === 0) {
			// Execute the future move
			const targetSlot = battle.playerSlots[fm.slotIndex];
			if (targetSlot && targetSlot.pokemon.hp > 0) {
				const moveName = fm.moveId === 'futuresight' ? 'Future Sight' : 'Doom Desire';
				messageLog.push(`<strong>${moveName}</strong> took effect!`);

				// Calculate damage using stored stats
				const move = getMove(fm.moveId);
				const basePower = move.basePower || 120;
				const moveType = move.type;

				// Get defender's current stats
				const defender = targetSlot.pokemon;
				const defenderSpecies = Dex.species.get(defender.species);
				const defenderDef = defender.spd * getStatMultiplier(targetSlot.statStages.spd);

				// Calculate damage
				const effectiveness = getCustomEffectiveness(moveType, defenderSpecies.types, defender, battle);
				const baseDamage = Math.floor((2 * 50 / 5 + 2) * basePower * (fm.attackerStats.spa / defenderDef) / 50) + 2;
				const damage = Math.floor(baseDamage * effectiveness);

				// Apply damage
				targetSlot.pokemon.hp = Math.max(0, targetSlot.pokemon.hp - damage);
				messageLog.push(`${defender.species} took ${damage} damage!`);

				if (effectiveness > 1) messageLog.push(`It's super effective!`);
				else if (effectiveness < 1 && effectiveness > 0) messageLog.push(`It's not very effective...`);
			}
			return false; // Remove this future move from the array
		}
		return true; // Keep this future move
	});

	// Reset flinch status for all active slots
	for (const slot of allSlots) {
		slot.willFlinch = false;
	}

	// Handle effects that apply to each Pokémon individually (status, items)
	for (const slot of allSlots) {
		if (slot.pokemon.hp > 0) {
			handleEndOfTurnEffects(slot, battle, messageLog);
		}
	}

	// Handle effects that apply to the whole field (weather, terrain, rooms)
	handleEndOfTurnWeather(battle, messageLog);
	handleEndOfTurnFieldEffects(battle, messageLog);
}

/****************
* Core Functions
****************/
/**
 * Applies a healing item to a Pokémon and handles all logic.
 * @returns An object with the result of the action.
 */

function useHealingItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	if (pokemon.hp <= 0) {
		return { success: false, message: `${pokemon.species} has fainted!` };
	}

	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData || (itemData.category !== 'medicine' && itemId !== 'berryjuice')) {
		return { success: false, message: `This item cannot be used to heal.` };
	}

	// Handle status-only healing items first
	if (itemId === 'healpowder') {
		if (!pokemon.status) {
			return { success: false, message: `${pokemon.species} is not affected by any status condition.` };
		}
		pokemon.status = null;
		removeItemFromInventory(player, itemId, 1);
		return { success: true, message: `You used <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! Its status condition was healed.` };
	}

	// Handle HP restoration items
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

/**
 * Calculates accuracy/evasion multiplier from stat stage.
 * @param stage The stat stage, from -6 to +6.
 * @returns The multiplier.
 */
function getAccuracyEvasionMultiplier(stage: number): number {
	if (stage > 0) {
		return (3 + stage) / 3;
	} else if (stage < 0) {
		return 3 / (3 - stage);
	}
	return 1;
}

/********************
Core Functiins Ends
*************""*"""" */

// --- NEW GLOBAL CONSTANT AND HELPER FUNCTION ---

const INITIAL_STAT_STAGES = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 };

/**
 * Creates a new ActivePokemonSlot object with default volatile statuses.
 * @param pokemon The base RPGPokemon object.
 * @returns A new ActivePokemonSlot object.
 */

function createActivePokemonSlot(pokemon: RPGPokemon): ActivePokemonSlot {
	const ability = toID(pokemon.ability || ''); // <-- THIS LINE WAS MISSING
	return {
		pokemon,
		statStages: { ...INITIAL_STAT_STAGES },
		status: pokemon.status, // Carry over out-of-battle status
		sleepCounter: 0,
		isConfused: false,
		confusionCounter: 0,
		isProtected: false,
		protectSuccessCounter: 0,
		willFlinch: false,
		isTrapped: null,
		tauntTurns: 0,
		isSeeded: false,
		hasNightmare: false,
		isCursed: false,
		chargingMove: undefined,
		activeTurns: 1,
		lockedMove: undefined,
		lastDamageTaken: undefined,
		yawnCounter: undefined,
		// Initialize new volatile fields
		substitute: undefined,
		disabledMove: undefined,
		encoreMove: undefined,
		isIngrained: false,
		hasAquaRing: false,
		focusEnergy: false,
		magnetRiseTurns: 0,
		telekinesisCounter: 0,
		isSmackedDown: false,
		lastMoveUsed: undefined,
		tormentActive: false,
		embargoTurns: 0,
		healBlockTurns: 0,
		isCharged: false,
		stockpileCount: 0,
		flashFireBoost: false,
		unburdenActive: false,
		analyticBoost: false,
		slowStartTurns: undefined,
		volatileTypes: undefined,
		isDisguised: ability === 'disguise' && pokemon.species.includes('Mimikyu'),
		lastMoveThatHitMe: undefined,
	};
}

/**
 * Checks if a Pokémon is trapped by an opponent's ability (Arena Trap, Shadow Tag).
 * @returns {ActivePokemonSlot | null} The trapping Pokémon, or null if not trapped.
 */
function checkTrappingAbility(
	slotToSwitch: ActivePokemonSlot,
	battle: BattleState
): ActivePokemonSlot | null {
	const isPlayer = battle.playerSlots.includes(slotToSwitch);
	const opponentSlots = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots);
	const userAbility = toID(slotToSwitch.pokemon.ability || '');

	// Shadow Tag users are immune to Shadow Tag
	if (userAbility === 'shadowtag') return null;

	for (const oppSlot of opponentSlots) {
		const oppAbility = toID(oppSlot.pokemon.ability || '');

		if (oppAbility === 'shadowtag') {
			return oppSlot; // Trapped
		}
		
		if (oppAbility === 'arenatrap') {
			// Arena Trap doesn't affect airborne Pokemon
			if (RPGAbilities.isGrounded(slotToSwitch.pokemon, battle)) {
				return oppSlot; // Trapped
			}
		}
	}

	return null; // Not trapped
}

/**
 * Activates Unburden ability when an item is consumed
 */
function activateUnburden(slot: ActivePokemonSlot, messageLog: string[]): void {
	const ability = toID(slot.pokemon.ability || '');
	if (ability === 'unburden' && !slot.unburdenActive) {
		slot.unburdenActive = true;
		messageLog.push(`${slot.pokemon.species}'s Unburden activated!`);
	}
}

/**
 * Helper to get a live Pokemon slot from its index.
 * Returns the slot if it exists and the Pokemon is not fainted.
 */
function getSlotFromIndex(battle: BattleState, slotIndex: number): ActivePokemonSlot | null {
	let slot: ActivePokemonSlot | null = null;
	if (slotIndex === 0) slot = battle.playerSlots[0];
	else if (slotIndex === 1) slot = battle.playerSlots[1];
	else if (slotIndex === 2) slot = battle.opponentSlots[0];
	else if (slotIndex === 3) slot = battle.opponentSlots[1];

	if (slot && slot.pokemon.hp > 0) {
		return slot;
	}
	return null;
}

/**
 * Resolves all targets for a move based on the move's target property.
 * @param attackerSlotIndex The slot index (0-3) of the user.
 * @param targetSlotIndex The slot index (0-3) the user *chose*.
 * @param move The move being used.
 * @param battle The current battle state.
 * @returns An array of ActivePokemonSlot objects that are the final targets.
 */
function getMoveTargets(attackerSlotIndex: number, targetSlotIndex: number, move: Move, battle: BattleState): ActivePokemonSlot[] {
	const targets: ActivePokemonSlot[] = [];
	const attackerSlot = getSlotFromIndex(battle, attackerSlotIndex);
	if (!attackerSlot) return []; // Attacker is fainted or doesn't exist

	const isPlayerAttacker = attackerSlotIndex <= 1;

	// Get all potential targets that are alive
	const pSlot0 = getSlotFromIndex(battle, 0);
	const pSlot1 = getSlotFromIndex(battle, 1);
	const oSlot0 = getSlotFromIndex(battle, 2);
	const oSlot1 = getSlotFromIndex(battle, 3);

	const allFoes = isPlayerAttacker ? [oSlot0, oSlot1] : [pSlot0, pSlot1];
	const allAllies = isPlayerAttacker ? [pSlot0, pSlot1] : [oSlot0, oSlot1];
	const allOthers = [pSlot0, pSlot1, oSlot0, oSlot1];

	// Helper function to add a target if it's valid
	const addTarget = (slot: ActivePokemonSlot | null) => {
		if (slot && slot.pokemon.hp > 0) {
			targets.push(slot);
		}
	};

	switch (move.target) {
	// --- Single-target moves ---
	case 'normal': // Hits one adjacent foe
	case 'any': // Hits any one pokemon
	case 'ally': // Hits one ally
		// TODO: Add redirect logic (Follow Me, Rage Powder) here
		const chosenTarget = getSlotFromIndex(battle, targetSlotIndex);
		addTarget(chosenTarget);
		break;

	// --- User ---
	case 'self':
		addTarget(attackerSlot);
		break;

	// --- Spread moves ---
	case 'allAdjacentFoes': // Hits both foes
		allFoes.forEach(addTarget);
		break;

	case 'allAdjacent': // Hits everyone but user
	case 'scripted': // e.g., Surf, Earthquake - hits everyone but user
		allOthers.forEach(slot => {
			if (slot && slot.pokemon.id !== attackerSlot.pokemon.id) {
				addTarget(slot);
			}
		});
		break;

	case 'randomNormal': // Hits one random adjacent foe
		const validFoes = allFoes.filter(s => s && s.pokemon.hp > 0) as ActivePokemonSlot[];
		if (validFoes.length > 0) {
			const randomFoe = validFoes[Math.floor(Math.random() * validFoes.length)];
			addTarget(randomFoe);
		}
		break;

	// --- Side-wide moves ---
	case 'foeSide': // e.g., Stealth Rock, Spikes
		// For damage/effect logic, we only need one target.
		// The execution function will know to apply this to the *side*.
		const primaryFoe = getSlotFromIndex(battle, isPlayerAttacker ? 2 : 0);
		if (primaryFoe) addTarget(primaryFoe);
		else addTarget(getSlotFromIndex(battle, isPlayerAttacker ? 3 : 1));
		break;

	case 'allySide': // e.g., Reflect, Light Screen
		const primaryAlly = getSlotFromIndex(battle, isPlayerAttacker ? 0 : 2);
		if (primaryAlly) addTarget(primaryAlly);
		else addTarget(getSlotFromIndex(battle, isPlayerAttacker ? 1 : 3));
		break;

	case 'all': // e.g., Perish Song
		allOthers.forEach(addTarget);
		break;

	default:
		// Default to the chosen target if type is unhandled
		const defaultTarget = getSlotFromIndex(battle, targetSlotIndex);
		addTarget(defaultTarget);
		break;
	}

	// Return a unique list of targets
	return [...new Set(targets)];
}

/********************************
 * REFACTORED TURN PROCESSING
 ********************************/

/**
 * Builds and sorts the action queue for the turn based on priority and speed.
 */
function buildActionQueue(battle: BattleState, messageLog: string[]): NonNullable<BattleState['pendingActions'][number]>[] {
	const actionQueue: NonNullable<BattleState['pendingActions'][number]>[] = [];
	const allActiveSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	for (const slotIndex in battle.pendingActions) {
		const action = battle.pendingActions[slotIndex];
		if (action && allActiveSlots.some(s => s.pokemon.id === action.pokemonId)) {
			actionQueue.push(action);
		}
	}

	actionQueue.sort((a, b) => {
		const slotA = allActiveSlots.find(s => s.pokemon.id === a.pokemonId);
		const slotB = allActiveSlots.find(s => s.pokemon.id === b.pokemonId);

		if (!slotA) return 1;
		if (!slotB) return -1;

		const isSwitchA = a.actionType === 'switch';
		const isSwitchB = b.actionType === 'switch';
		const moveA = getMove(a.moveId || 'struggle');
		const moveB = getMove(b.moveId || 'struggle');
		
		let priorityA = isSwitchA ? 6 : (moveA.priority);
		let priorityB = isSwitchB ? 6 : (moveB.priority);

		if (!isSwitchA) priorityA += RPGAbilities.applyPriorityModifier(moveA, slotA.pokemon);
		if (!isSwitchB) priorityB += RPGAbilities.applyPriorityModifier(moveB, slotB.pokemon);

		if (priorityA !== priorityB) {
			return priorityB - priorityA;
		}

		let speedA = slotA.pokemon.spe * getStatMultiplier(slotA.statStages.spe);
		// --- QUICK FEET FIX ---
		const abilityA = toID(slotA.pokemon.ability || '');
		if (slotA.status === 'par' && abilityA !== 'quickfeet') {
			speedA = Math.floor(speedA / 2);
		}
		// --- END FIX ---
		speedA = RPGAbilities.applySpeedModifier(slotA.pokemon, battle, speedA);

		let speedB = slotB.pokemon.spe * getStatMultiplier(slotB.statStages.spe);
		// --- QUICK FEET FIX ---
		const abilityB = toID(slotB.pokemon.ability || '');
		if (slotB.status === 'par' && abilityB !== 'quickfeet') {
			speedB = Math.floor(speedB / 2);
		}
		// --- END FIX ---
		speedB = RPGAbilities.applySpeedModifier(slotB.pokemon, battle, speedB);

		const quickClawA = !isSwitchA && battle.magicRoomTurns === 0 && slotA.pokemon.item === 'quickclaw' && Math.random() < 0.2;
		const quickClawB = !isSwitchB && battle.magicRoomTurns === 0 && slotB.pokemon.item === 'quickclaw' && Math.random() < 0.2;

		if (quickClawA && !quickClawB) {
			messageLog.push(`${slotA.pokemon.species}'s Quick Claw let it move first!`);
			return -1;
		}
		if (quickClawB && !quickClawA) {
			messageLog.push(`${slotB.pokemon.species}'s Quick Claw let it move first!`);
			return 1;
		}

		if (battle.trickRoomTurns > 0) {
			return speedA - speedB;
		}
		return speedB - speedA;
	});

	// --- Analytic Check ---
	allActiveSlots.forEach(s => s.analyticBoost = false);
	let lastMoveAction: NonNullable<BattleState['pendingActions'][number]> | null = null;
	for (let i = actionQueue.length - 1; i >= 0; i--) {
		if (actionQueue[i].actionType === 'move') {
			lastMoveAction = actionQueue[i];
			break;
		}
	}
	
	if (lastMoveAction) {
		const lastMoverSlot = allActiveSlots.find(s => s.pokemon.id === lastMoveAction.pokemonId);
		if (lastMoverSlot && toID(lastMoverSlot.pokemon.ability || '') === 'analytic') {
			lastMoverSlot.analyticBoost = true;
		}
	}

	return actionQueue;
}

/**
 * [REFACTORED]
 * Processes all queued actions for the turn.
 */
function processTurn(battle: BattleState) {
	battle.messageLog.push(`--- Turn ${battle.turn + 1} ---`);
	battle.turn++;

	// --- Reset side-wide guards ---
	battle.playerQuickGuard = false;
	battle.opponentQuickGuard = false;
	battle.playerWideGuard = false;
	battle.opponentWideGuard = false;
	battle.playerCraftyShield = false;
	battle.opponentCraftyShield = false;

	// --- Reset per-pokemon flags ---
	getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(s => {
		s.isHelped = false;
		s.isRedirecting = false;
		s.lastDamageTaken = undefined;
	});

	// 1. Generate AI Actions
	getActiveSlots(battle.opponentSlots).forEach((slot, i) => {
		const slotIndex = 2 + i; // Opponent slots are 2 and 3
		if (!battle.pendingActions[slotIndex]) {
			battle.pendingActions[slotIndex] = generateAiAction(slot, slotIndex, battle);
		}
	});

	// 2. Build and Sort Action Order
	const actionQueue = buildActionQueue(battle, battle.messageLog);

	// 3. Execute Actions in order
	for (const action of actionQueue) {
		executeAction(action, battle, getPlayerData(battle.playerId));

		// --- Faint Check (Mid-turn) ---
		const battleEndedMidTurn = checkBattleEndCondition(battle, battle.messageLog);
		if (battleEndedMidTurn) {
			return; // Battle ended or is waiting for a switch
		}
	}

	// 4. End-of-Turn Effects
	if (battle.forceEnd) {
		return;
	}

	battle.messageLog.push("--- End of Turn ---");
	processEndOfTurn(battle, battle.messageLog);

	// 5. Check for Battle End (after EOT effects)
	const battleEnded = checkBattleEndCondition(battle, battle.messageLog);

	// 6. Reset and Render
	battle.pendingActions = {}; // Reset for next turn

	if (!battleEnded) {
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			if (slot.pokemon.hp > 0) {
				slot.activeTurns++;
			}
		});
		battle.currentView = 'battle';
	}
}

/********************************
 * REFACTORED ACTION PROCESSING
 ********************************/

/**
 * Handles all logic for a player or AI switching a Pokemon.
 */
function handleSwitchAction(
	attackerSlot: ActivePokemonSlot,
	attackerSlotIndex: number,
	action: Extract<NonNullable<BattleState['pendingActions'][number]>, { actionType: 'switch' }>,
	battle: BattleState,
	player: PlayerData,
	messageLog: string[]
) {
	const isPlayerSwitch = attackerSlotIndex <= 1;
	const pokemonToSwitchInId = action.switchToPokemonId!;

	// --- ARENA TRAP / SHADOW TAG CHECK (EXECUTION TIME) ---
	const trappingPokemon = checkTrappingAbility(attackerSlot, battle);
	if (trappingPokemon) {
		messageLog.push(`${attackerSlot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`);
		return;
	}
	// --- END TRAP CHECK ---

	// --- Check Switch Prevention (Trapping/Ingrain) ---
	if (attackerSlot.isIngrained) {
		messageLog.push(`${attackerSlot.pokemon.species} is rooted in place by Ingrain and can't switch out!`);
		return;
	}
	if (attackerSlot.isTrapped) {
		messageLog.push(`${attackerSlot.pokemon.species} is trapped and can't switch out!`);
		return;
	}
	// (Note: Trapping abilities are checked in the command)

	const outgoingPokemon = attackerSlot.pokemon;

	// --- Apply Switch-Out Abilities ---
	const outgoingAbility = toID(outgoingPokemon.ability || '');
	if (outgoingAbility === 'regenerator' && outgoingPokemon.hp > 0 && outgoingPokemon.hp < outgoingPokemon.maxHp) {
		const healAmount = Math.floor(outgoingPokemon.maxHp / 3);
		outgoingPokemon.hp = Math.min(outgoingPokemon.maxHp, outgoingPokemon.hp + healAmount);
		messageLog.push(`${outgoingPokemon.species}'s Regenerator restored its HP!`);
	} else if (outgoingAbility === 'naturalcure' && attackerSlot.status) {
		attackerSlot.status = null;
		outgoingPokemon.status = null;
		messageLog.push(`${outgoingPokemon.species}'s Natural Cure healed its status!`);
	}

	// --- Save Status ---
	saveBattleStatus(battle); // Saves HP/status of the switching-out mon

	if (isPlayerSwitch) {
		// --- Player Switch ---
		const partyIndex = player.party.findIndex(p => p.id === pokemonToSwitchInId);
		if (partyIndex === -1) {
			messageLog.push(`${outgoingPokemon.species} tried to switch out, but there was no one to switch to!`);
			return; // This should not happen if command validation is correct
		}
		
		player.party.push(outgoingPokemon); // Add outgoing mon back to party
		const [incomingPokemon] = player.party.splice(partyIndex, 1); // Remove incoming mon
		const newSlot = createActivePokemonSlot(incomingPokemon);
		battle.playerSlots[attackerSlotIndex as 0 | 1] = newSlot;
		messageLog.push(`**${player.name} withdrew ${outgoingPokemon.species} and sent out ${incomingPokemon.species}!**`);

		const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, true, messageLog);
		if (faintedOnEntry) {
			messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
		} else {
			handleMirrorHerb(newSlot, battle, messageLog);
			RPGAbilities.checkFormChangeAbilities(newSlot, battle, messageLog);
		}
	} else {
		// --- AI Switch ---
		// AI action generation already picked a valid 'switchToPokemonId'
		const replacement = battle.opponentParty.find(p => p.id === pokemonToSwitchInId);

		if (replacement) {
			const newSlot = createActivePokemonSlot(replacement);
			battle.opponentSlots[attackerSlotIndex as 0 | 1] = newSlot; // AI slots are 0/1 in this context
			messageLog.push(`**${battle.opponentName} withdrew ${outgoingPokemon.species} and sent out ${replacement.species}!**`);

			const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, false, messageLog);
			if (faintedOnEntry) {
				messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
			} else {
				handleMirrorHerb(newSlot, battle, messageLog);
				RPGAbilities.checkFormChangeAbilities(newSlot, battle, messageLog);
			}
		} else {
			messageLog.push(`${outgoingPokemon.species} tried to switch out, but no one was left!`);
		}
	}
}

/**
 * Resolves the final targets for a move, accounting for redirection abilities and volatile statuses.
 * @returns The final target slot index.
 */
function resolveMoveTarget(
	attackerSlotIndex: number,
	chosenTargetSlotIndex: number,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): number {
	const isPlayerAttacker = attackerSlotIndex <= 1;
	const opponentSlots = getActiveSlots(isPlayerAttacker ? battle.opponentSlots : battle.playerSlots);
	let finalTargetIndex = chosenTargetSlotIndex;

	// --- 1. Ability Redirection (Storm Drain, Lightning Rod) ---
	let abilityRedirector: ActivePokemonSlot | undefined = undefined;
	if (move.target === 'normal') { // Only single-target moves are redirected
		const moveType = move.type; // Use the base move type
		
		if (moveType === 'Water') {
			abilityRedirector = opponentSlots.find(s => toID(s.pokemon.ability || '') === 'stormdrain');
		} else if (moveType === 'Electric') {
			abilityRedirector = opponentSlots.find(s => toID(s.pokemon.ability || '') === 'lightningrod');
		}

		if (abilityRedirector) {
			const redirectorIndex = [...battle.playerSlots, ...battle.opponentSlots].indexOf(abilityRedirector);
			finalTargetIndex = redirectorIndex;
			messageLog.push(`${abilityRedirector.pokemon.species}'s ${abilityRedirector.pokemon.ability} drew in the attack!`);
		}
	}

	// --- 2. Volatile Redirection (Follow Me, Rage Powder) ---
	if (!abilityRedirector) { // Don't redirect if an ability already did
		const redirector = opponentSlots.find(s => s.isRedirecting);
		if (redirector && move.target === 'normal') { // Check move is single-target
			const redirectorIndex = [...battle.playerSlots, ...battle.opponentSlots].indexOf(redirector);
			finalTargetIndex = redirectorIndex;
			messageLog.push(`${redirector.pokemon.species} took the attack!`);
		}
	}
	
	return finalTargetIndex;
}

/**
 * Checks for and handles two-turn charging moves.
 * @returns {boolean} `true` if the turn should end (move is charging), `false` if it should execute.
 */
function handleChargingMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	moveObject: { id: string; pp: number },
	battle: BattleState,
	messageLog: string[],
	ppDeduction: number
): boolean {
	if (move.flags.charge && !attackerSlot.chargingMove) {
		// --- First turn: Start charging ---
		attackerSlot.chargingMove = move.id;
		let chargeMessage = `${attackerSlot.pokemon.species} is charging up!`;

		if (move.id === 'fly') chargeMessage = `${attackerSlot.pokemon.species} flew up high!`;
		else if (move.id === 'dig') chargeMessage = `${attackerSlot.pokemon.species} burrowed underground!`;
		else if (move.id === 'dive') chargeMessage = `${attackerSlot.pokemon.species} hid underwater!`;
		else if (move.id === 'bounce') chargeMessage = `${attackerSlot.pokemon.species} sprang up!`;
		else if (move.id === 'shadowforce' || move.id === 'phantomforce') chargeMessage = `${attackerSlot.pokemon.species} vanished instantly!`;
		else if (move.id === 'solarbeam' || move.id === 'solarblade') {
			if (RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'sun') {
				attackerSlot.chargingMove = undefined; // Skip charging
				chargeMessage = '';
			} else {
				chargeMessage = `${attackerSlot.pokemon.species} absorbed light!`;
			}
		}
		// ... (add other custom charge messages here) ...
		else if (move.id === 'skyattack') chargeMessage = `${attackerSlot.pokemon.species} became cloaked in a harsh light!`;
		else if (move.id === 'geomancy') chargeMessage = `${attackerSlot.pokemon.species} is absorbing power!`;

		if (chargeMessage) messageLog.push(chargeMessage);

		// If still charging (not skipped by sun, etc.)
		if (attackerSlot.chargingMove) {
			if (moveObject.id !== 'struggle' && moveObject.pp > 0) {
				moveObject.pp = Math.max(0, moveObject.pp - ppDeduction);
			}
			return true; // End turn
		}
	} else if (attackerSlot.chargingMove === move.id) {
		// --- Second turn: Execute the move ---
		attackerSlot.chargingMove = undefined;
	}
	
	return false; // Execute move
}

/**
 * [REFACTORED]
 * Executes a single action (move or switch) for one Pokémon.
 */
function executeAction(
	action: NonNullable<BattleState['pendingActions'][number]>,
	battle: BattleState,
	room: ChatRoom,
	user: User,
	messageLog: string[]
) {
	const player = getPlayerData(battle.playerId);
	const allSlots = [...battle.playerSlots, ...battle.opponentSlots];
	const attackerSlotIndex = allSlots.findIndex(s => s?.pokemon.id === action.pokemonId);
	const attackerSlot = allSlots[attackerSlotIndex];

	if (!attackerSlot || attackerSlot.pokemon.hp <= 0) {
		return; // Fainted before turn
	}

	attackerSlot.isRedirecting = false; // Reset redirection flag

	// --- Handle Switch Action ---
	if (action.actionType === 'switch') {
		handleSwitchAction(attackerSlot, attackerSlotIndex, action as any, battle, player, messageLog);
		return;
	}

	// --- Handle Move Action ---
	if (action.actionType === 'move' && action.moveId && action.targetSlot !== undefined) {
		const move = getMove(action.moveId);
		let moveObject = attackerSlot.pokemon.moves.find(m => m.id === move.id);

		if (move.id === 'struggle') moveObject = { id: 'struggle', pp: 1 };
		else if (!moveObject) moveObject = { id: 'struggle', pp: 1 };
		else if (moveObject.pp === 0) {
			moveObject = { id: 'struggle', pp: 1 };
			messageLog.push(`${attackerSlot.pokemon.species} has no PP left for ${move.name}!`);
		}

		// 1. Pre-Turn Status Checks (Sleep, Freeze, Paralysis, Confusion, Flinch)
		if (!handlePreTurnChecks(attackerSlot, battle, messageLog)) {
			return; // Attacker couldn't move
		}

		// 2. Resolve Targets (accounts for redirection)
		const finalTargetIndex = resolveMoveTarget(attackerSlotIndex, action.targetSlot, move, battle, messageLog);
		const resolvedTargets = getMoveTargets(attackerSlotIndex, finalTargetIndex, move, battle);

		// 3. Calculate PP Deduction (for Pressure)
		let ppDeduction = 1;
		if (resolvedTargets.some(target => toID(target.pokemon.ability || '') === 'pressure')) {
			ppDeduction = 2;
		}

		// 4. Handle Two-Turn/Charging Moves
		if (handleChargingMove(attackerSlot, move, moveObject, battle, messageLog, ppDeduction)) {
			return; // Move is charging, turn ends
		}
		
		// 5. Deduct PP (if not already deducted)
		if (moveObject.id !== 'struggle' && moveObject.pp > 0 && !move.flags.charge) {
			moveObject.pp = Math.max(0, moveObject.pp - ppDeduction);
		}

		// 6. Announce Move
		messageLog.push(`<span style="color: #555;"><strong>${attackerSlot.pokemon.species}</strong> used <strong>${move.name}</strong>!</span>`);
		if (resolvedTargets.length === 0) {
			messageLog.push(`But there was no target!`);
			return;
		}

		// 7. Check for Move-Preventing Abilities (Dazzling, etc.)
		const remainingTargets: ActivePokemonSlot[] = [];
		for (const defenderSlot of resolvedTargets) {
			const abilityContext = { attacker: attackerSlot.pokemon, defender: defenderSlot.pokemon, attackerSlot, defenderSlot, move, battle, messageLog };
			const preventionCheck = RPGAbilities.preventMove(abilityContext);
			if (preventionCheck && preventionCheck.prevented) {
				messageLog.push(preventionCheck.message || `${defenderSlot.pokemon.species}'s ability prevented the move!`);
			} else {
				remainingTargets.push(defenderSlot);
			}
		}
		if (resolvedTargets.length > 0 && remainingTargets.length === 0) {
			return; // All targets blocked the move
		}

		// 8. Execute Move
		executeMove(attackerSlot, remainingTargets, move, moveObject, battle, messageLog);

		// 9. Handle Choice Item Lock
		if (attackerSlot.pokemon.hp > 0 && move.id !== 'struggle' && !attackerSlot.lockedMove) {
			const item = attackerSlot.pokemon.item;
			if (battle.magicRoomTurns === 0 && (item === 'choiceband' || item === 'choicescarf' || item === 'choicespecs')) {
				attackerSlot.lockedMove = move.id;
			}
		}

		// 10. Handle Self-Switch (U-turn, Volt Switch)
		if (move.selfSwitch && attackerSlot.pokemon.hp > 0) {
			const isPlayer = attackerSlotIndex <= 1;
			if (isPlayer) {
				const hasReplacement = player.party.some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));
				if (hasReplacement) {
					battle.pendingPivot = { slotIndex: attackerSlotIndex, slot: attackerSlot, isBatonPass: move.selfSwitch === 'copyvolatile' };
					battle.playerSlots[attackerSlotIndex as 0 | 1] = null;
					messageLog.push(`${attackerSlot.pokemon.species} is waiting to switch out!`);
				} else {
					messageLog.push(`But there was no one to switch to!`);
				}
			} else {
				// AI U-turn
				const hasReplacement = battle.opponentParty.some(p => p.hp > 0 && !battle.opponentSlots.some(s => s?.pokemon.id === p.id));
				if (hasReplacement) {
					battle.aiPendingPivot = { slotIndex: attackerSlotIndex, slot: attackerSlot, isBatonPass: move.selfSwitch === 'copyvolatile' };
					battle.opponentSlots[attackerSlotIndex as 0 | 1] = null;
					messageLog.push(`${attackerSlot.pokemon.species} is waiting to switch out!`);
				} else {
					messageLog.push(`But there was no one to switch to!`);
				}
			}
		}
	}
}

/**
 * Gets all active (non-fainted, non-null) slots for a given side.
 * @param slots The [Slot | null, Slot | null] array.
 * @returns An array of ActivePokemonSlot.
 */
function getActiveSlots(slots: [ActivePokemonSlot | null, ActivePokemonSlot | null]): ActivePokemonSlot[] {
	return slots.filter(slot => slot && slot.pokemon.hp > 0) as ActivePokemonSlot[];
}

/**
 * [AI] Generates a simple action for an AI-controlled slot.
 * Picks a random damaging move and a random player-side target.
 */
function generateAiAction(aiSlot: ActivePokemonSlot, aiSlotIndex: number, battle: BattleState): BattleState['pendingActions'][number] {
	// Find valid moves (with PP)
	const usableMoves = aiSlot.pokemon.moves.filter(m => {
		const moveData = getMove(m.id);
		return m.pp > 0 && moveData.category !== 'Status'; // Simple AI: only use damaging moves
	});

	let chosenMoveId = 'struggle';
	if (usableMoves.length > 0) {
		chosenMoveId = usableMoves[Math.floor(Math.random() * usableMoves.length)].id;
	}

	// Find valid targets (player side)
	const playerSlots = getActiveSlots(battle.playerSlots);
	let targetSlotIndex = 0; // Default to slot 0 if no one is active
	if (playerSlots.length > 0) {
		const targetSlot = playerSlots[Math.floor(Math.random() * playerSlots.length)];
		targetSlotIndex = battle.playerSlots.indexOf(targetSlot);
	}

	return {
		actionType: 'move',
		moveId: chosenMoveId,
		targetSlot: targetSlotIndex,
		pokemonId: aiSlot.pokemon.id,
	};
}

/**********************
* HTML UI
**********************/
/**
 * [REFACTORED HELPER]
 * Generates the HTML for a single Pokémon's info box within a battle.
 * Used by both single and double battle UIs.
 */
function generateSharedBattlePokemonInfo(
	slot: ActivePokemonSlot,
	isPlayerSide: boolean,
	isDoubleBattle: boolean
): string {
	const pokemon = slot.pokemon;
	const species = Dex.species.get(pokemon.species);
	const hpPercentage = Math.max(0, Math.floor((pokemon.hp / pokemon.maxHp) * 100));
	const hpBarColor = hpPercentage > 50 ? 'green' : hpPercentage > 25 ? 'orange' : 'red';

	// --- EXP Bar (Player side only) ---
	let expBarHTML = '';
	if (isPlayerSide) {
		const expForLastLevel = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);
		const expForNextLevel = pokemon.expToNextLevel;
		const expProgress = pokemon.experience - expForLastLevel;
		const expNeededForLevel = expForNextLevel - expForLastLevel;
		const expPercentage = Math.max(0, Math.floor((expProgress / expNeededForLevel) * 100));
		expBarHTML = `<div style="background: #f0f0f0; border-radius: 10px; padding: 2px; margin: 5px 0;"><div style="background: #6c9be8; width: ${expPercentage}%; height: 8px; border-radius: 8px;"></div></div>`;
	}

	// --- Status Tags ---
	const displayStatus = slot.status || pokemon.status;
	const statusColors: Record<Status, string> = { 'brn': '#F08030', 'par': '#F8D030', 'psn': '#A040A0', 'slp': '#9898E8', 'frz': '#98D8D8' };
	const statusTag = displayStatus ? `<span style="background-color: ${statusColors[displayStatus]}; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; text-transform: uppercase; vertical-align: middle; margin-left: 5px;">${displayStatus}</span>` : '';
	
	// --- Volatile Status Tags ---
	const volatileTags = [
		slot.isConfused ? `<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Confused</span>` : '',
		slot.isCursed ? `<span style="background-color: #705898; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Cursed</span>` : '',
		slot.isSeeded ? `<span style="background-color: #78C850; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Seeded</span>` : '',
		slot.hasNightmare ? `<span style="background-color: #503870; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Nightmare</span>` : '',
		slot.isTrapped ? `<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Trapped</span>` : '',
		slot.tauntTurns > 0 ? `<span style="background-color: #C03028; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Taunted</span>` : '',
		slot.substitute ? `<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Substitute${isDoubleBattle ? '' : ` (${slot.substitute.hp} HP)`}</span>` : '',
		slot.yawnCounter ? `<span style="background-color: #9898E8; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Drowsy (${slot.yawnCounter})</span>` : '',
		slot.disabledMove ? `<span style="background-color: #A040A0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Disabled: ${slot.disabledMove.moveId}</span>` : '',
		slot.encoreMove ? `<span style="background-color: #F85888; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Encored: ${slot.encoreMove.moveId}</span>` : '',
		slot.tormentActive ? `<span style="background-color: #705848; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Tormented</span>` : '',
		slot.focusEnergy ? `<span style="background-color: #F08030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Focused</span>` : '',
		slot.isIngrained ? `<span style="background-color: #78C850; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Ingrained</span>` : '',
		slot.hasAquaRing ? `<span style="background-color: #6890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Aqua Ring</span>` : '',
		slot.magnetRiseTurns > 0 ? `<span style="background-color: #F8D030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Levitating (${slot.magnetRiseTurns})</span>` : '',
		slot.telekinesisCounter > 0 ? `<span style="background-color: #A040A0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Telekinesis (${slot.telekinesisCounter})</span>` : '',
		slot.isSmackedDown ? `<span style="background-color: #B8A038; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Grounded</span>` : '',
		slot.embargoTurns > 0 ? `<span style="background-color: #705848; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Embargo (${slot.embargoTurns})</span>` : '',
		slot.healBlockTurns > 0 ? `<span style="background-color: #C03028; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Heal Block (${slot.healBlockTurns})</span>` : '',
		slot.isCharged ? `<span style="background-color: #F8D030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Charged</span>` : '',
		slot.stockpileCount > 0 ? `<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Stockpile ×${slot.stockpileCount}</span>` : '',
		slot.lockedMove ? `<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Locked${isDoubleBattle ? '' : `: ${slot.lockedMove}`}</span>` : '',
		slot.isProtected ? `<span style="background-color: #4A90E2; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Protected</span>` : '',
		slot.isRedirecting ? `<span style="background-color: #D0021B; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Center of Attention</span>` : '',
		slot.isHelped ? `<span style="background-color: #417505; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Helped</span>` : '',
	].filter(Boolean).join('');

	// --- Ability Status Tags ---
	const abilityTags = [
		slot.flashFireBoost ? `<span style="background-color: #F08030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Fire Boost</span>` : '',
		slot.analyticBoost ? `<span style="background-color: #6c757d; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Analytic</span>` : '',
		slot.slowStartTurns !== undefined && slot.slowStartTurns > 0 ? `<span style="background-color: #F08030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Slow Start (${slot.slowStartTurns})</span>` : '',
		slot.unburdenActive ? `<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Unburden</span>` : '',
	].filter(Boolean).join('');

	// --- Charging Move Tag ---
	let chargingTag = '';
	if (slot.chargingMove) {
		const moveName = getMove(slot.chargingMove).name || 'Attack';
		let chargeText = `Preparing ${moveName}!`;
		if (slot.chargingMove === 'fly') chargeText = 'Flew up high!';
		if (slot.chargingMove === 'dig') chargeText = 'Dug underground!';
		if (slot.chargingMove === 'dive') chargeText = 'Hid underwater!';
		chargingTag = `<span style="background-color: #6890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">${chargeText}</span>`;
	}

	// --- Stat Stage Tags ---
	let statStageTags = '';
	if (slot.statStages) {
		for (const stat in slot.statStages) {
			const stage = slot.statStages[stat as keyof typeof slot.statStages];
			if (stage > 0) {
				statStageTags += ` <span style="color: green; font-size: 11px;">🔼${stat.toUpperCase()}</span>`;
			} else if (stage < 0) {
				statStageTags += ` <span style="color: red; font-size: 11px;">🔽${stat.toUpperCase()}</span>`;
			}
		}
	}
	
	const shinySymbol = pokemon.shiny ? '<span style="color: #d4af37;">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span style="color: #007bff;">♂</span>' : pokemon.gender === 'F' ? '<span style="color: #f06292;">♀</span>' : '';

	// --- Assemble HTML based on battle type ---
	if (isDoubleBattle) {
		return `<div style="border: 1px solid #666; padding: 8px; margin: 5px 0; border-radius: 5px;"><psicon pokemon="${pokemon.species}" style="vertical-align: middle;"></psicon><br><strong>${pokemon.nickname || pokemon.species}</strong> ${genderSymbol} ${shinySymbol}<br>Lvl ${pokemon.level}<br>` +
		`<div style="background: #e0e0e0; border-radius: 8px; margin: 6px 0; width: 100%; height: 10px; overflow: hidden;"><div style="background: ${hpBarColor}; width: ${hpPercentage}%; height: 10px; border-radius: 8px;"></div></div>` +
		`${expBarHTML}` +
		`HP: ${pokemon.hp} / ${pokemon.maxHp}<br>` +
		`${statusTag}${volatileTags}${abilityTags}${chargingTag}${statStageTags}</div>`;
	} else {
		// Single Battle HTML
		return `<div style="border: 1px solid #666; padding: 8px; margin: 5px 0; border-radius: 5px;"><psicon pokemon="${pokemon.species}" style="vertical-align: middle;"></psicon><br><strong>${pokemon.nickname || pokemon.species}</strong> ${genderSymbol} ${shinySymbol} (Level ${pokemon.level})${statusTag}${volatileTags}${abilityTags}${chargingTag}${statStageTags}<br><small>Type: ${species.types.join('/')}</small><br><div style="background: #f0f0f0; border-radius: 10px; padding: 2px; margin: 5px 0; position: relative;"><div style="background: ${hpBarColor}; width: ${hpPercentage}%; height: 10px; border-radius: 8px;"></div><div style="position: absolute; top: 2px; left: 0; right: 0; text-align: center; font-size: 10px; line-height: 10px; color: #000;">HP: ${pokemon.hp}/${pokemon.maxHp}</div></div>${isPlayerSide ? expBarHTML : ''}</div>`;
	}
}

function generatePokemonInfoHTML(
	slot: ActivePokemonSlot,
	isPlayerSide: boolean,
	showActions = false
): string {
	const pokemon = slot.pokemon;
	const statStages = slot.statStages;

	const species = Dex.species.get(pokemon.species);
	const hpPercentage = Math.max(0, Math.floor((pokemon.hp / pokemon.maxHp) * 100));
	const hpBarColor = hpPercentage > 50 ? 'green' : hpPercentage > 25 ? 'orange' : 'red';

	let expBarHTML = '';
	if (isPlayerSide) {
		const expForLastLevel = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);
		const expForNextLevel = pokemon.expToNextLevel;
		const expProgress = pokemon.experience - expForLastLevel;
		const expNeededForLevel = expForNextLevel - expForLastLevel;
		const expPercentage = Math.max(0, Math.floor((expProgress / expNeededForLevel) * 100));
		expBarHTML = `<div style="border-radius: 10px; padding: 2px; margin: 5px 0;"><div style="background: #6c9be8; width: ${expPercentage}%; height: 8px; border-radius: 8px;"></div></div>`;
	}

	const displayStatus = slot.status || pokemon.status;
	const statusColors: Record<Status, string> = { 'brn': '#F08030', 'par': '#F8D030', 'psn': '#A040A0', 'slp': '#9898E8', 'frz': '#98D8D8' };
	const statusTag = displayStatus ? `<span style="background-color: ${statusColors[displayStatus]}; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; text-transform: uppercase; vertical-align: middle; margin-left: 5px;">${displayStatus}</span>` : '';
	const confusedTag = slot.isConfused ? `<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Confused</span>` : '';
	const cursedTag = slot.isCursed ? `<span style="background-color: #705898; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Cursed</span>` : '';
	const seededTag = slot.isSeeded ? `<span style="background-color: #78C850; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Seeded</span>` : '';
	const nightmareTag = slot.hasNightmare ? `<span style="background-color: #503870; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Nightmare</span>` : '';
	const trappedTag = slot.isTrapped ? `<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Trapped</span>` : '';
	const tauntTag = slot.tauntTurns > 0 ? `<span style="background-color: #C03028; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Taunted</span>` : '';
	let chargingTag = '';
	if (slot.chargingMove) {
		const moveName = getMove(slot.chargingMove).name || 'Attack';
		let chargeText = `Preparing ${moveName}!`;
		if (slot.chargingMove === 'fly') chargeText = 'Flew up high!';
		if (slot.chargingMove === 'dig') chargeText = 'Dug underground!';
		if (slot.chargingMove === 'dive') chargeText = 'Hid underwater!';
		chargingTag = `<span style="background-color: #6890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">${chargeText}</span>`;
	}

	const substituteTag = slot.substitute ? `<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Substitute (${slot.substitute.hp} HP)</span>` : '';
	const yawnTag = slot.yawnCounter ? `<span style="background-color: #9898E8; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Drowsy (${slot.yawnCounter})</span>` : '';
	const disableTag = slot.disabledMove ? `<span style="background-color: #A040A0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Disabled: ${slot.disabledMove.moveId}</span>` : '';
	const encoreTag = slot.encoreMove ? `<span style="background-color: #F85888; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Encored: ${slot.encoreMove.moveId}</span>` : '';
	const tormentTag = slot.tormentActive ? `<span style="background-color: #705848; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Tormented</span>` : '';
	const focusEnergyTag = slot.focusEnergy ? `<span style="background-color: #F08030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Focused</span>` : '';
	const ingrainTag = slot.isIngrained ? `<span style="background-color: #78C850; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Ingrained</span>` : '';
	const aquaRingTag = slot.hasAquaRing ? `<span style="background-color: #6890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Aqua Ring</span>` : '';
	const magnetRiseTag = slot.magnetRiseTurns > 0 ? `<span style="background-color: #F8D030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Levitating (${slot.magnetRiseTurns})</span>` : '';
	const telekinesisTag = slot.telekinesisCounter > 0 ? `<span style="background-color: #A040A0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Telekinesis (${slot.telekinesisCounter})</span>` : '';
	const smackdownTag = slot.isSmackedDown ? `<span style="background-color: #B8A038; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Grounded</span>` : '';
	const embargoTag = slot.embargoTurns > 0 ? `<span style="background-color: #705848; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Embargo (${slot.embargoTurns})</span>` : '';
	const healBlockTag = slot.healBlockTurns > 0 ? `<span style="background-color: #C03028; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Heal Block (${slot.healBlockTurns})</span>` : '';
	const chargeTag = slot.isCharged ? `<span style="background-color: #F8D030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Charged</span>` : '';
	const stockpileTag = slot.stockpileCount > 0 ? `<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Stockpile ×${slot.stockpileCount}</span>` : '';
	const lockedMoveTag = slot.lockedMove ? `<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Locked</span>` : '';

	const shinySymbol = pokemon.shiny ? '<span style="color: #d4af37;">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span style="color: #007bff;">♂</span>' : pokemon.gender === 'F' ? '<span style="color: #f06292;">♀</span>' : '';

	let statStageTags = '';
	if (statStages) {
		for (const stat in statStages) {
			const stage = statStages[stat as keyof typeof statStages];
			if (stage > 0) {
				statStageTags += ` <span style="color: green; font-size: 11px;">🔼${stat.toUpperCase()}</span>`;
			} else if (stage < 0) {
				statStageTags += ` <span style="color: red; font-size: 11px;">🔽${stat.toUpperCase()}</span>`;
			}
		}
	}

	let html = `<div style="border: 1px solid #666; padding: 8px; margin: 5px 0; border-radius: 5px; background: #f0f0f0;"><strong>${pokemon.nickname || pokemon.species}</strong> ${genderSymbol} ${shinySymbol} (Level ${pokemon.level})${statusTag}${confusedTag}${cursedTag}${seededTag}${nightmareTag}${trappedTag}${tauntTag}${chargingTag}${yawnTag}${substituteTag}${disableTag}${encoreTag}${tormentTag}${focusEnergyTag}${ingrainTag}${aquaRingTag}${magnetRiseTag}${telekinesisTag}${smackdownTag}${embargoTag}${healBlockTag}${chargeTag}${stockpileTag}${lockedMoveTag}${statStageTags}<br><small>Type: ${species.types.join('/')}</small><br><div style="background: #f0f0f0; border-radius: 10px; padding: 2px; margin: 5px 0;"><div style="background: ${hpBarColor}; width: ${hpPercentage}%; height: 10px; border-radius: 8px;"></div></div>HP: ${pokemon.hp}/${pokemon.maxHp}<br>`;

	// --- Conditional info for player Pokemon only ---
	if (isPlayerSide) {
		html += `${expBarHTML}`;
		html += `EXP: ${pokemon.experience}/${pokemon.expToNextLevel}<br>`;
		html += `Nature: ${pokemon.nature}<br>`;
		html += `Ability: ${pokemon.ability || 'Unknown'}<br>`;
		if (pokemon.item) {
			html += `Held Item: ${ITEMS_DATABASE[pokemon.item]?.name || pokemon.item}<br>`;
		}
	}

	if (showActions) {
		const itemButton = pokemon.item ?
			`<button name="send" value="/rpg takeitem ${pokemon.id}" class="button" style="font-size: 12px;">Take Item</button>` :
			`<button name="send" value="/rpg giveitem ${pokemon.id}" class="button" style="font-size: 12px;">Give Item</button>`;
		html += `<br><div style="margin-top: 8px;"><button name="send" value="/rpg summary ${pokemon.id}" class="button" style="font-size: 12px;">Summary</button> ${itemButton} <button name="send" value="/rpg depositpc ${pokemon.id}" class="button" style="font-size: 12px;">Deposit</button></div>`;
	}

	html += '</div>';
	return html;
}

function generateSingleBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string }
): string {
	const playerSlot = battle.playerSlots[0];
	const opponentSlot = battle.opponentSlots[0];

	if (!playerSlot || !opponentSlot) {
		return `<div class="infobox"><h2>Battle Error!</h2><p>Active Pokémon slots are missing.</p><p><button name="send" value="/rpg menu" class="button">Flee</button></p></div>`;
	}

	const playerPokemon = playerSlot.pokemon;

	// Helper function to generate field effects HTML with side-by-side layout
	const generateFieldEffectsDisplay = () => {
		const fieldEffectHTML = generateFieldEffectHTML(battle);
		const tempDiv = fieldEffectHTML.replace(/<div style="background: #f8f9fa;[^>]*>|<\/div>/g, '').replace(/<div style="[^"]*">/g, '').replace(/<\/div>/g, '');
		
		const lines = tempDiv.split('<br>').filter(line => line.trim());
		let yourSide = '';
		let field = '';
		let opponentSide = '';
		let currentSection = '';

		for (const line of lines) {
			if (line.includes('Your Side:')) {
				currentSection = 'your';
			} else if (line.includes('Field:')) {
				currentSection = 'field';
			} else if (line.includes("Opponent's Side:")) {
				currentSection = 'opponent';
			} else {
				if (currentSection === 'your') {
					yourSide += line + '<br>';
				} else if (currentSection === 'field') {
					field += line + '<br>';
				} else if (currentSection === 'opponent') {
					opponentSide += line + '<br>';
				}
			}
		}

		return `<table style="width: 100%; border-collapse: collapse;">` +
			`<tr>` +
			`<td style="width: 33%; padding: 5px; vertical-align: top; text-align: left;"><strong>Your Side:</strong><br>${yourSide || 'Clear'}</td>` +
			`<td style="width: 34%; padding: 5px; vertical-align: top; text-align: center;"><strong>Field:</strong><br>${field || 'Clear'}</td>` +
			`<td style="width: 33%; padding: 5px; vertical-align: top; text-align: right;"><strong>Opponent's Side:</strong><br>${opponentSide || 'Clear'}</td>` +
			`</tr>` +
			`</table>`;
	};

	let actionHTML = '';
	let moveButtonsHTML = '';

	const allMovesOutOfPP = playerPokemon.moves.every(m => m.pp === 0);

	if (allMovesOutOfPP) {
		const buttonStyle = `width: 100%; padding: 12px; border-radius: 8px; box-sizing: border-box; text-align: left; max-height: 50px;`;
		const buttonContent = `<div style="text-align: center; font-weight: bold; font-size: 1.1em; margin-bottom: 8px;">Struggle</div>` +
			`<div style="font-size: 0.9em; opacity: 0.9; overflow: hidden;">` +
				`<span>Normal</span>` +
			   `<span style="float: right;">-- / --</span>` +
			`</div> `;

		moveButtonsHTML = `<table style="width: 100%; border-collapse: separate; border-spacing: 8px; margin: 15px 0;">`;
		moveButtonsHTML += `<tr>`;
		moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;"><button name="send" value="/rpg battleaction move 0 struggle 2" class="button" style="${buttonStyle}">${buttonContent}</button></td>`;
		moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;"></td>`;
		moveButtonsHTML += `</tr>`;
		moveButtonsHTML += `<tr>`;
		moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;"></td>`;
		moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;"></td>`;
		moveButtonsHTML += `</tr>`;
		moveButtonsHTML += `</table>`;
	} else {
		const moveButtons = playerPokemon.moves.map(move => {
			const moveData = getMove(move.id);

			// Use the validation function to check if a move is disabled
			const validationError = validateMoveAction(playerSlot, move.id, battle);
			const isDisabled = !!validationError || move.pp === 0;

			const buttonStyle = `width: 100%; padding: 12px; border-radius: 8px; box-sizing: border-box; text-align: left; max-height: 50px;`;
			const buttonContent = `<div style="text-align: center; font-weight: bold; font-size: 1.1em; margin-bottom: 8px;">${moveData.name}</div>` +
				`<div style="font-size: 0.9em; opacity: 0.9; overflow: hidden;">` +
					`<span>${moveData.type}</span>` +
				   `<span style="float: right;">${move.pp} / ${moveData.pp}</span>` +
				`</div> `;

			return `<button name="send" value="/rpg battleaction move 0 ${move.id} 2" class="button" ${isDisabled ? 'disabled' : ''} style="${buttonStyle}">` +
					   ` ${buttonContent}</button>`;
		});

		moveButtonsHTML = `<table style="width: 100%; border-collapse: separate; border-spacing: 8px; margin: 15px 0;">`;
		moveButtonsHTML += `<tr>`;
		moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${moveButtons[0] || ''}</td>`;
		moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${moveButtons[1] || ''}</td>`;
		moveButtonsHTML += `</tr>`;
		moveButtonsHTML += `<tr>`;
		moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${moveButtons[2] || ''}</td>`;
		moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${moveButtons[3] || ''}</td>`;
		moveButtonsHTML += `</tr>`;
		moveButtonsHTML += `</table>`;
	}

	const catchButton = (battle.battleType === 'wild') ?
		`<button name="send" value="/rpg battleaction catchmenu" class="button">⚽ Catch</button>` :
		`<button class="button" disabled>⚽ Catch</button>`;

	const runButton = (battle.battleType === 'wild' && !playerSlot.isTrapped) ?
		`<button name="send" value="/rpg battleaction run" class="button">🏃 Run</button>` :
		`<button class="button" disabled>🏃 Run</button>`;

	actionHTML = `<p style="margin-top: 5px; font-weight: bold;">What will ${playerPokemon.species} do?</p>` +
		moveButtonsHTML +
		`<p style="margin-top: 5px;"><button name="send" value="/rpg battleaction switchmenu" class="button">🔄 Switch</button> ${catchButton} ${runButton}</p>`;

	return `<div class="infobox"><h2>${battle.opponentName} vs ${playerPokemon.species}</h2>` +
		`<table style="width: 100%; margin-bottom: 5px;">` +
		`<tr>` +
		`<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">` +
		`<h3 style="margin: 5px 0;">Your Pokémon</h3>` +
		`${generateSharedBattlePokemonInfo(playerSlot, true, false)}` + // <-- Use shared helper
		`</td>` +
		`<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">` +
		`<h3 style="margin: 5px 0;">${battle.opponentName}</h3>` +
		`${generateSharedBattlePokemonInfo(opponentSlot, false, false)}` + // <-- Use shared helper
		`</td>` +
		`</tr>` +
		`</table>` +
		`<hr style="margin: 3px 0;" />` +
		`<div style="padding: 8px; margin: 5px 0; border: 1px solid #666; min-height: 40px; border-radius: 5px; font-size: 12px;">` +
		`<strong>Field Effects:</strong><br>${generateFieldEffectsDisplay()}` +
		`</div>` +
		`<hr style="margin: 3px 0;" />` +
		`<div style="padding: 8px; margin: 5px 0; border: 1px solid #666; min-height: 50px; max-height: 100px; overflow-y: auto; border-radius: 5px;">${messageLog.join('<br>')}</div>` +
		actionHTML +
		`</div>`;
}

function generateDoubleBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string }
): string {
	const [pSlot0, pSlot1] = battle.playerSlots;
	const [oSlot0, oSlot1] = battle.opponentSlots;

	// Helper to generate HTML for a single slot, handling styling
	const generateSlotHTML = (slot: ActivePokemonSlot | null, slotIndex: number, side: 'player' | 'opponent') => {
		if (!slot) {
			return `<div style="border: 1px dashed #ccc; padding: 10px; margin: 5px; border-radius: 5px; min-height: 120px; text-align: center; color: #888;">(Empty)</div>`;
		}
		if (slot.pokemon.hp <= 0) {
			return `<div style="opacity: 0.5; padding: 10px; margin: 5px; border-radius: 5px;">${generateSharedBattlePokemonInfo(slot, side === 'player', true)}</div>`;
		}

		let borderStyle = "1px solid #ccc";
		if (targetSelection && targetSelection.attackerSlotIndex !== slotIndex) {
			borderStyle = "3px dashed #007bff";
		}
		if (battle.pendingActions[slotIndex]) {
			borderStyle = "3px solid #28a745";
		}

		return `<div style="border: ${borderStyle}; padding: 10px; margin: 5px; border-radius: 5px;">${generateSharedBattlePokemonInfo(slot, side === 'player', true)}</div>`;
	};

	// Helper function to generate field effects HTML with side-by-side layout
	const generateFieldEffectsDisplay = () => {
		const fieldEffectHTML = generateFieldEffectHTML(battle);
		const tempDiv = fieldEffectHTML.replace(/<div style="background: #f8f9fa;[^>]*>|<\/div>/g, '').replace(/<div style="[^"]*">/g, '').replace(/<\/div>/g, '');
		
		const lines = tempDiv.split('<br>').filter(line => line.trim());
		let yourSide = '';
		let field = '';
		let opponentSide = '';
		let currentSection = '';

		for (const line of lines) {
			if (line.includes('Your Side:')) {
				currentSection = 'your';
			} else if (line.includes('Field:')) {
				currentSection = 'field';
			} else if (line.includes("Opponent's Side:")) {
				currentSection = 'opponent';
			} else {
				if (currentSection === 'your') {
					yourSide += line + '<br>';
				} else if (currentSection === 'field') {
					field += line + '<br>';
				} else if (currentSection === 'opponent') {
					opponentSide += line + '<br>';
				}
			}
		}

		return `<table style="width: 100%; border-collapse: collapse;">` +
			`<tr>` +
			`<td style="width: 33%; padding: 5px; vertical-align: top; text-align: left;"><strong>Your Side:</strong><br>${yourSide || 'Clear'}</td>` +
			`<td style="width: 34%; padding: 5px; vertical-align: top; text-align: center;"><strong>Field:</strong><br>${field || 'Clear'}</td>` +
			`<td style="width: 33%; padding: 5px; vertical-align: top; text-align: right;"><strong>Opponent's Side:</strong><br>${opponentSide || 'Clear'}</td>` +
			`</tr>` +
			`</table>`;
	};

	let html = `<div class="infobox"><h2>Battle! (${battle.battleType})</h2>`;

	// --- Pokemon Display (4 Pokemon in 2x2 grid) ---
	html += `<table style="width: 100%; margin-bottom: 5px;">`;
	// Opponent Side (Top Row)
	html += `<tr>`;
	html += `<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">`;
	html += `<h3 style="margin: 5px 0;">Opponent 1</h3>`;
	html += generateSlotHTML(oSlot0, 2, 'opponent');
	html += `</td>`;
	html += `<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">`;
	html += `<h3 style="margin: 5px 0;">Opponent 2</h3>`;
	html += generateSlotHTML(oSlot1, 3, 'opponent');
	html += `</td>`;
	html += `</tr>`;
	// Player Side (Bottom Row)
	html += `<tr>`;
	html += `<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">`;
	html += `<h3 style="margin: 5px 0;">Your Pokémon 1</h3>`;
	html += generateSlotHTML(pSlot0, 0, 'player');
	html += `</td>`;
	html += `<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">`;
	html += `<h3 style="margin: 5px 0;">Your Pokémon 2</h3>`;
	html += generateSlotHTML(pSlot1, 1, 'player');
	html += `</td>`;
	html += `</tr>`;
	html += `</table>`;

	html += `<hr style="margin: 5px 0;" />`;

	// --- Field Effects (Side by Side) ---
	html += `<div style="padding: 8px; margin: 10px 0; border: 1px solid #666; min-height: 40px; border-radius: 5px; font-size: 12px;">` +
		`<strong>Field Effects:</strong><br>${generateFieldEffectsDisplay()}` +
		`</div>` +
		`<hr style="margin: 5px 0;" />`;

	// --- Message Log ---
	html += `<div style="padding: 8px; margin: 10px 0; border: 1px solid #666; min-height: 50px; max-height: 100px; overflow-y: auto; border-radius: 5px;">${messageLog.join('<br>')}</div>`;

	// --- Action Area ---
	if (targetSelection) {
		// --- STATE 2: Target Selection ---
		const move = getMove(targetSelection.moveId);
		html += `<p style="margin-top: 5px; font-weight: bold;">Select a target for <strong>${move.name}</strong>:</p>`;

		const targets = [
			{ slot: pSlot0, name: "Ally 1", index: 0 },
			{ slot: pSlot1, name: "Ally 2", index: 1 },
			{ slot: oSlot0, name: "Opponent 1", index: 2 },
			{ slot: oSlot1, name: "Opponent 2", index: 3 },
		];

		const buttonStyle = `width: 100%; padding: 12px; border-radius: 8px; box-sizing: border-box; text-align: center; max-height: 50px; margin: 0;`;
		const targetButtons = targets
			.filter(target => target.slot && target.slot.pokemon.hp > 0 && target.index !== targetSelection.attackerSlotIndex)
			.map(target => {
				return `<button name="send" value="/rpg battleaction move ${targetSelection.attackerSlotIndex} ${targetSelection.moveId} ${target.index}" class="button" style="${buttonStyle}">${target.name}</button>`;
			});

		let targetButtonsHTML = `<table style="width: 100%; border-collapse: separate; border-spacing: 8px; margin: 15px 0;">`;
		targetButtonsHTML += `<tr>`;
		targetButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${targetButtons[0] || ''}</td>`;
		targetButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${targetButtons[1] || ''}</td>`;
		targetButtonsHTML += `</tr>`;
		targetButtonsHTML += `<tr>`;
		targetButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${targetButtons[2] || ''}</td>`;
		targetButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${targetButtons[3] || ''}</td>`;
		targetButtonsHTML += `</tr>`;
		targetButtonsHTML += `</table>`;

		html += targetButtonsHTML;
		html += `<p style="margin-top: 15px;"><button name="send" value="/rpg battleaction back" class="button" style="${buttonStyle}">Cancel</button></p>`;
	} else {
		// --- STATE 1: Action Selection ---
		let activeSlot: ActivePokemonSlot | null = null;
		let activeSlotIndex = -1;

		if (pSlot0 && pSlot0.pokemon.hp > 0 && !battle.pendingActions[0]) {
			activeSlot = pSlot0;
			activeSlotIndex = 0;
		} else if (pSlot1 && pSlot1.pokemon.hp > 0 && !battle.pendingActions[1]) {
			activeSlot = pSlot1;
			activeSlotIndex = 1;
		}

		if (activeSlot) {
			const pokemon = activeSlot.pokemon;
			html += `<p style="margin-top: 5px; font-weight: bold;">What will <strong>${pokemon.species}</strong> do?</p>`;
			
			const allMovesOutOfPP = pokemon.moves.every(m => m.pp === 0);
			let moveButtonsHTML = '';

			if (allMovesOutOfPP) {
				const buttonStyle = `width: 100%; padding: 12px; border-radius: 8px; box-sizing: border-box; text-align: left; max-height: 50px; margin: 0;`;
				const buttonContent = `<div style="text-align: center; font-weight: bold; font-size: 1.1em; margin-bottom: 8px;">Struggle</div>` +
					`<div style="font-size: 0.9em; opacity: 0.9; overflow: hidden;">` +
					`<span>Normal</span>` +
					`<span style="float: right;">-- / --</span>` +
					`</div>`;

				const struggleButton = `<button name="send" value="/rpg battleaction selecttarget ${activeSlotIndex} struggle" class="button" style="${buttonStyle}">${buttonContent}</button>`;
				moveButtonsHTML = `<table style="width: 100%; border-collapse: separate; border-spacing: 8px; margin: 15px 0;"><tr><td style="width: 40%; padding: 0; vertical-align: top;">${struggleButton}</td><td style="width: 40%; padding: 0; vertical-align: top;"></td></tr><tr><td style="width: 40%; padding: 0; vertical-align: top;"></td><td style="width: 40%; padding: 0; vertical-align: top;"></td></tr></table>`;
			} else {
				const buttonStyle = `width: 100%; padding: 12px; border-radius: 8px; box-sizing: border-box; text-align: left; max-height: 50px; margin: 0;`;
				const moveButtons = pokemon.moves.map(move => {
					const moveData = getMove(move.id);
					
					// Use the validation function to check if a move is disabled
					const validationError = validateMoveAction(activeSlot as ActivePokemonSlot, move.id, battle);
					const isDisabled = !!validationError || move.pp === 0;

					const buttonContent = `<div style="text-align: center; font-weight: bold; font-size: 1.1em; margin-bottom: 8px;">${moveData.name}</div>` +
						`<div style="font-size: 0.9em; opacity: 0.9; overflow: hidden;">` +
						`<span>${moveData.type}</span>` +
						`<span style="float: right;">${move.pp} / ${moveData.pp}</span>` +
						`</div>`;

					return `<button name="send" value="/rpg battleaction selecttarget ${activeSlotIndex} ${move.id}" class="button" ${isDisabled ? 'disabled' : ''} style="${buttonStyle}">${buttonContent}</button>`;
				});

				moveButtonsHTML = `<table style="width: 100%; border-collapse: separate; border-spacing: 8px; margin: 15px 0;">`;
				moveButtonsHTML += `<tr>`;
				moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${moveButtons[0] || ''}</td>`;
				moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${moveButtons[1] || ''}</td>`;
				moveButtonsHTML += `</tr>`;
				moveButtonsHTML += `<tr>`;
				moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${moveButtons[2] || ''}</td>`;
				moveButtonsHTML += `<td style="width: 40%; padding: 0; vertical-align: top;">${moveButtons[3] || ''}</td>`;
				moveButtonsHTML += `</tr>`;
				moveButtonsHTML += `</table>`;
			}
			html += moveButtonsHTML;
		} else {
			html += `<p style="margin-top: 10px; text-align: center; color: #666;">Waiting for opponent...</p>`;
		}

		// --- Switch/Catch/Run Buttons ---
		const buttonStyle = `width: auto; min-width:120px; padding: 12px; border-radius: 8px; box-sizing: border-box; text-align: center; margin: 0 8px 0 0;`;

		const catchButton = (battle.battleType === 'wild_double') ?
			`<button name="send" value="/rpg battleaction catchmenu" class="button" style="${buttonStyle}">⚽ Catch</button>` :
			`<button class="button" disabled style="${buttonStyle}">⚽ Catch</button>`;

		const runButton = (battle.battleType === 'wild_double') ?
			`<button name="send" value="/rpg battleaction run" class="button" style="${buttonStyle}">🏃 Run</button>` :
			`<button class="button" disabled style="${buttonStyle}">🏃 Run</button>`;
		
		html += `<p style="margin-top: 15px;">` +
			`<button name="send" value="/rpg battleaction switchmenu" class="button" style="${buttonStyle}">🔄 Switch</button>` +
			`${catchButton} ${runButton}</p>`;
	}

	html += `</div>`;
	return html;
}
		
function generateWelcomeHTML(): string {
	return `<div class="infobox"><h2>Welcome to World of Impulse</h2><p>You must choose your starter pokemon before starting your adventure.</p><h3>Choose Type:</h3><p><button name="send" value="/rpg choosetype fire" class="button">🔥 Fire</button><button name="send" value="/rpg choosetype water" class="button">💧 Water</button><button name="send" value="/rpg choosetype grass" class="button">🌱 Grass</button></p></div>`;
}

function generateStarterSelectionHTML(type: string): string {
	const starters = STARTER_POKEMON[type as keyof typeof STARTER_POKEMON];
	if (!starters) return '';
	const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);
	let html = `<div class="infobox"><h2>${typeTitle} Type Starters</h2><p>Choose your starter pokemon:</p><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">`;
	for (const starterId of starters) {
		const species = Dex.species.get(starterId);
		if (species.exists) {
			html += `<div style="text-align: center; padding: 10px; border: 1px solid #ccc; border-radius: 5px;"><strong>${species.name}</strong><br><small>Type: ${species.types.join('/')}</small><br><button name="send" value="/rpg choosestarter ${starterId}" class="button" style="margin-top: 5px;">Choose</button></div>`;
		}
	}
	html += `</div><p style="margin-top: 15px;"><button name="send" value="/rpg start" class="button">← Back to Type Selection</button></p></div>`;
	return html;
}

/**
 * [NEW ROUTER]
 * Detects battle type and calls the correct UI generator.
 */
function generateBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string }
): string {
	if (battle.battleType === 'wild' || battle.battleType === 'trainer') {
		// Use single battle UI
		return generateSingleBattleHTML(battle, messageLog, targetSelection);
	} else {
		// Use double battle UI
		return generateDoubleBattleHTML(battle, messageLog, targetSelection);
	}
}

function generatePokemonSummaryHTML(pokemon: RPGPokemon): string {
	const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	const movesSummary = pokemon.moves.map(move => {
		const moveData = getMove(move.id);
		return '<div style="text-align: center; padding: 5px; border-radius: 5px;">' +
			moveData.name +
			'<br><small>PP: ' + move.pp + '/' + moveData.pp + '</small>' +
			'</div>';
	}).join('');

	const shinySymbol = pokemon.shiny ? '<span style="color: #d4af37;">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span style="color: #007bff;">♂</span>' : pokemon.gender === 'F' ? '<span style="color: #f06292;">♀</span>' : '';

	return '<div class="infobox">' +
		'<h2>' + pokemon.nickname + '\'s Summary ' + shinySymbol + '</h2>' +
		'<div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
		'<div style="flex-basis: 48%;">' +
		'<p><strong>Species:</strong> ' + pokemon.species + ' ' + genderSymbol + '</p>' +
		'<p><strong>Level:</strong> ' + pokemon.level + '</p>' +
		'<p><strong>Nature:</strong> ' + pokemon.nature + '</p>' +
		'<p><strong>Ability:</strong> ' + (pokemon.ability || 'Unknown') + '</p>' +
		'<p><strong>Held Item:</strong> ' + (pokemon.item ? (ITEMS_DATABASE[pokemon.item]?.name || pokemon.item) : 'None') + '</p>' +
		'</div>' +
		'<div style="flex-basis: 48%;">' +
		'<h4>Stats</h4>' +
		'<table style="width: 100%; border-collapse: collapse;">' +
		'<tr><td style="padding: 2px;">HP</td><td style="padding: 2px; text-align: right;">' + pokemon.maxHp + '</td></tr>' +
		'<tr><td style="padding: 2px;">Attack</td><td style="padding: 2px; text-align: right;">' + pokemon.atk + '</td></tr>' +
		'<tr><td style="padding: 2px;">Defense</td><td style="padding: 2px; text-align: right;">' + pokemon.def + '</td></tr>' +
		'<tr><td style="padding: 2px;">Sp. Atk</td><td style="padding: 2px; text-align: right;">' + pokemon.spa + '</td></tr>' +
		'<tr><td style="padding: 2px;">Sp. Def</td><td style="padding: 2px; text-align: right;">' + pokemon.spd + '</td></tr>' +
		'<tr><td style="padding: 2px;">Speed</td><td style="padding: 2px; text-align: right;">' + pokemon.spe + '</td></tr>' +
		'</table>' +
		'</div>' +
		'</div>' +
		'<hr />' +
		'<div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
		'<div style="flex-basis: 48%;">' +
		'<h4>Trainer Memo</h4>' +
		'<p><strong>ID:</strong> ' + pokemon.id + '</p>' +
		'<p><strong>Caught In:</strong> ' + (ITEMS_DATABASE[pokemon.caughtIn]?.name || 'a Ball') + '</p>' +
		'<p><strong>Height:</strong> ' + pokemon.heightm + ' m</p>' +
		'<p><strong>Weight:</strong> ' + pokemon.weightkg + ' kg</p>' +
		'<p><strong>Friendship:</strong> ' + pokemon.friendship + '/255</p>' +
		'</div>' +
		'<div style="flex-basis: 48%;">' +
		'<h4>IVs</h4>' +
		'<table style="width: 100%; border-collapse: collapse;">' +
		'<tr><td style="padding: 2px;">HP</td><td style="padding: 2px; text-align: right;">' + pokemon.ivs.hp + '</td></tr>' +
		'<tr><td style="padding: 2px;">Attack</td><td style="padding: 2px; text-align: right;">' + pokemon.ivs.atk + '</td></tr>' +
		'<tr><td style="padding: 2px;">Defense</td><td style="padding: 2px; text-align: right;">' + pokemon.ivs.def + '</td></tr>' +
		'<tr><td style="padding: 2px;">Sp. Atk</td><td style="padding: 2px; text-align: right;">' + pokemon.ivs.spa + '</td></tr>' +
		'<tr><td style="padding: 2px;">Sp. Def</td><td style="padding: 2px; text-align: right;">' + pokemon.ivs.spd + '</td></tr>' +
		'<tr><td style="padding: 2px;">Speed</td><td style="padding: 2px; text-align: right;">' + pokemon.ivs.spe + '</td></tr>' +
		'</table>' +
		'</div>' +
		'</div>' +
		'<hr />' +
		'<div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
		'<div style="flex-basis: 48%;">' +
		'<h4>EVs</h4>' +
		'<table style="width: 100%; border-collapse: collapse;">' +
		'<tr><td style="padding: 2px;">HP</td><td style="padding: 2px; text-align: right;">' + pokemon.evs.hp + '</td></tr>' +
		'<tr><td style="padding: 2px;">Attack</td><td style="padding: 2px; text-align: right;">' + pokemon.evs.atk + '</td></tr>' +
		'<tr><td style="padding: 2px;">Defense</td><td style="padding: 2px; text-align: right;">' + pokemon.evs.def + '</td></tr>' +
		'<tr><td style="padding: 2px;">Sp. Atk</td><td style="padding: 2px; text-align: right;">' + pokemon.evs.spa + '</td></tr>' +
			'<tr><td style="padding: 2px;">Sp. Def</td><td style="padding: 2px; text-align: right;">' + pokemon.evs.spd + '</td></tr>' +
				'<tr><td style="padding: 2px;">Speed</td><td style="padding: 2px; text-align: right;">' + pokemon.evs.spe + '</td></tr>' +
				'</table>' +
				'<small>Total: ' + totalEVs + ' / 510</small>' +
				'</div>' +
				'<div style="flex-basis: 48%;">' +
			'<h4>Moves</h4>' +
			'<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">' +
				movesSummary +
				'</div>' +
					'</div>' +
					'</div>' +
					'<p style="margin-top: 15px;"><button name="send" value="/rpg party" class="button">← Back to Party</button></p>' +
					'</div>';
}

function generateEggMoveSelectionHTML(pokemon: RPGPokemon, eggMoves: string[]): string {
	let html = `<div class="infobox"><h2>Teach an Egg Move</h2><p>Choose a move for <strong>${pokemon.species}</strong> to learn:</p>`;
	for (const moveId of eggMoves) {
		const move = getMove(moveId);
		html += `<button name="send" value="/rpg learneggmove ${pokemon.id} ${moveId}" class="button" style="margin: 3px;">${move.name}</button> `;
	}
	html += `<hr /><p><button name="send" value="/rpg items" class="button">Cancel</button></p></div>`;
	return html;
}

function generateInventoryHTML(player: PlayerData, category?: string): string {
	let html = `<div class="infobox">`;
	html += `<h2>Inventory</h2>`;
	html += `<p><strong>Money:</strong> ₽${player.money}</p>`;

	// Category Buttons
	html += `<div style="margin: 10px 0;"><button name="send" value="/rpg items" class="button">All</button> <button name="send" value="/rpg items pokeball" class="button">Poké Balls</button> <button name="send" value="/rpg items medicine" class="button">Medicines</button> <button name="send" value="/rpg items held" class="button">Held Items</button> <button name="send" value="/rpg items berry" class="button">Berries</button> <button name="send" value="/rpg items tm" class="button">TMs</button> <button name="send" value="/rpg items key" class="button">Key Items</button> <button name="send" value="/rpg items misc" class="button">Misc.</button></div>`;

	html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">`;

	let itemsFound = false;
	for (const [itemId, item] of player.inventory) {
		if (!category || item.category === category) {
			itemsFound = true;
			html += `<div style="border: 1px solid #ccc; padding: 8px; border-radius: 5px;">`;
			html += `<strong>${item.name}</strong> x${item.quantity}<br>`;
			html += `<small>${item.description}</small><br>`;
			html += `<button name="send" value="/rpg useitem ${itemId}" class="button" style="font-size: 12px; margin-top: 5px;">Use</button>`;
			html += `</div>`;
		}
	}

	if (!itemsFound) {
		html += `<p>You have no items in this category.</p>`;
	}

	html += `</div>`;
	html += `<p style="margin-top: 15px;"><button name="send" value="/rpg menu" class="button">Back to Menu</button></p>`;
	html += `</div>`;
	return html;
}

function generateShopHTML(player: PlayerData, category?: string): string {
	let html = `<div class="infobox">`;
	html += `<h2>Poké Mart</h2>`;
	html += `<p>Welcome! What would you like to buy?</p>`;
	html += `<p><strong>Your Money:</strong> ₽${player.money}</p>`;

	// Category Buttons
	html += `<div style="margin: 10px 0;">`;
	html += `<button name="send" value="/rpg shop" class="button">All</button> `;
	html += `<button name="send" value="/rpg shop pokeball" class="button">Poké Balls</button> `;
	html += `<button name="send" value="/rpg shop medicine" class="button">Medicines</button> `;
	html += `<button name="send" value="/rpg shop held" class="button">Held Items</button> `;
	html += `<button name="send" value="/rpg shop berry" class="button">Berries</button> `;
	html += `<button name="send" value="/rpg shop misc" class="button">Misc.</button>`;
	html += `</div>`;

	html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-height: 300px; overflow-y: auto;">`;

	let itemsFound = false;
	for (const itemId of SHOP_INVENTORY) {
		const item = ITEMS_DATABASE[itemId];
		const price = ITEM_PRICES[itemId];
		if (!item || !price) continue;

		if (!category || item.category === category) {
			itemsFound = true;
			html += `<div style="border: 1px solid #ccc; padding: 8px; border-radius: 5px;">`;
			html += `<strong>${item.name}</strong> - ₽${price}<br>`;
			html += `<small>${item.description}</small><br>`;
			html += `<button name="send" value="/rpg buy ${itemId} 1" class="button" style="font-size: 12px; margin-top: 5px;">Buy 1</button>`;
			html += `<button name="send" value="/rpg buy ${itemId} 5" class="button" style="font-size: 12px; margin-top: 5px;">Buy 5</button>`;
			html += `</div>`;
		}
	}

	if (!itemsFound) {
		html += `<p>No items found in this category.</p>`;
	}

	html += `</div>`;
	html += `<p style="margin-top: 15px;"><button name="send" value="/rpg explore" class="button">Back to Explore</button></p>`;
	html += `</div>`;
	return html;
}

function generatePCHTML(player: PlayerData): string {
	let html = `<div class="infobox"><h2>Pokemon PC System</h2><p>Welcome to Bill's PC!</p><p><strong>Pokemon in PC:</strong> ${player.pc.size}</p>`;
	if (player.pc.size === 0) {
		html += `<p>No Pokemon stored in PC.</p>`;
	} else {
		html += `<div style="max-height: 400px; overflow-y: auto;">`;
		for (const [pokemonId, pokemon] of player.pc) {
			html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;"><div><strong>${pokemon.species}</strong> (Level ${pokemon.level})<br><small>HP: ${pokemon.hp}/${pokemon.maxHp}</small></div><button name="send" value="/rpg withdrawpc ${pokemonId}" class="button">Withdraw</button></div>`;
		}
		html += `</div>`;
	}
	html += `<p style="margin-top: 15px;"><button name="send" value="/rpg party" class="button">View Party</button> <button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
	return html;
}

function generateCatchMenuHTML(player: PlayerData, battle: BattleState): string {
	let html = `<div class="infobox"><h2>Select a Poke Ball</h2>`;
	const pokeBalls = [];
	for (const [itemId, item] of player.inventory) {
		if (item.category === 'pokeball' && item.quantity > 0) {
			pokeBalls.push(item);
		}
	}

	const isDoubleBattle = battle.battleType === 'wild_double' || battle.battleType === 'trainer_double';

	if (pokeBalls.length === 0) {
		html += `<p>You have no Poke Balls!</p>`;
	} else {
		html += `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">`;
		for (const ball of pokeBalls) {
			// --- FIX: Change command based on battle type ---
			let command = '';
			if (isDoubleBattle) {
				// Doubles: Go to target selection
				command = `/rpg battleaction selectcatchtarget ${ball.id}`;
			} else {
				// Singles: Hardcode target to slot 2 (the only opponent)
				command = `/rpg battleaction catch ${ball.id} 2`;
			}

			html += `<div style="text-align: center; padding: 8px; border: 1px solid #ccc; border-radius: 5px;"><strong>${ball.name}</strong><br><small>x${ball.quantity}</small><br><button name="send" value="${command}" class="button" style="font-size: 12px; margin-top: 5px;">Use</button></div>`;
		}
		html += `</div>`;
	}
	html += `<hr /><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

function generateCatchTargetHTML(battle: BattleState, ballId: string): string {
	let html = `<div class="infobox"><h2>Select a Target</h2>`;
	html += `<p>Choose which wild Pokémon to throw the ${ITEMS_DATABASE[ballId]?.name || 'Poke Ball'} at:</p>`;

	// Show all active opponent Pokemon as targets
	let hasTargets = false;
	for (let i = 0; i < battle.opponentSlots.length; i++) {
		const slot = battle.opponentSlots[i];
		if (!slot || slot.pokemon.hp <= 0) continue;

		hasTargets = true;
		const slotIndex = i + 2; // Opponent slots are indices 2 and 3
		const hpPercent = Math.floor((slot.pokemon.hp / slot.pokemon.maxHp) * 100);
		const statusText = slot.status ? ` (${slot.status.toUpperCase()})` : '';

		html += `<div style="border: 1px solid #ccc; padding: 10px; margin: 5px 0; border-radius: 5px;">` +
			`<strong>${slot.pokemon.species}</strong> (Lvl ${slot.pokemon.level})${statusText}<br>` +
			`HP: ${slot.pokemon.hp}/${slot.pokemon.maxHp} (${hpPercent}%)<br>` +
			`<button name="send" value="/rpg battleaction catch ${ballId} ${slotIndex}" class="button">Throw ${ITEMS_DATABASE[ballId]?.name || 'Ball'}</button>` +
			`</div>`;
	}

	if (!hasTargets) {
		html += `<p>No targets available!</p>`;
	}

	html += `<hr /><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

function generateSwitchMenuHTML(battle: BattleState, target?: string): string {
	let html = `<div class="infobox"><h2>Choose a Pokémon to switch</h2>`;
	const player = getPlayerData(battle.playerId);
	const [pSlot0, pSlot1] = battle.playerSlots;

	const slotToSwitchOut = parseInt(target || '');

	if (isNaN(slotToSwitchOut)) {
		// --- Step 1: Choose which Pokemon to switch out ---
		html += `<p>Select a Pokémon to switch out. This will use its turn.</p>`;
		if (pSlot0 && pSlot0.pokemon.hp > 0) {
			html += `<button name="send" value="/rpg battleaction switchmenu 0" class="button"><strong>${pSlot0.pokemon.species}</strong> (Slot 1)</button> `;
		}
		if (pSlot1 && pSlot1.pokemon.hp > 0) {
			html += `<button name="send" value="/rpg battleaction switchmenu 1" class="button"><strong>${pSlot1.pokemon.species}</strong> (Slot 2)</button> `;
		}
	} else {
		// --- Step 2: Choose which Pokemon to switch in ---
		const outgoingPokemon = battle.playerSlots[slotToSwitchOut]?.pokemon;
		if (!outgoingPokemon) {
			return `<h2>Error: Invalid slot.</h2><p><button name="send" value="/rpg battleaction back" class="button">Back</button></p>`;
		}

		html += `<p>Select a Pokémon to replace <strong>${outgoingPokemon.species}</strong>:</p>`;

		const availableParty = player.party.filter(p =>
			p.hp > 0 &&
			!battle.playerSlots.some(s => s?.pokemon.id === p.id)
		);

		if (availableParty.length === 0) {
			html += `<p>You have no other Pokémon to switch to!</p>`;
		} else {
			for (const pokemon of availableParty) {
				html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px 0; border-radius: 5px; overflow: hidden;">` +
					`<strong>${pokemon.species}</strong> (Lvl ${pokemon.level}) | HP: ${pokemon.hp}/${pokemon.maxHp}` +
					`<button name="send" value="/rpg battleaction playerswitch ${slotToSwitchOut} ${pokemon.id}" class="button" style="float: right;">Switch In</button>` +
					`</div>`;
			}
		}
	}

	html += `<hr /><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

function generateVictoryHTML(defeatedOpponentNames: string, expMessages: string[], moneyGained: number, zoneId: string): string {
	return `<div class="infobox"><h2>Victory!</h2><p>You defeated the wild <strong>${defeatedOpponentNames}</strong>!</p><div style="padding: 10px; border-radius: 5px;">${expMessages.join('<br>')}</div><p>You gained ₽${moneyGained}!</p>` +
		`<p>` +
	`<button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another</button>` +
	`<button name="send" value="/rpg explore" class="button">Continue Exploring</button>` +
	`<button name="send" value="/rpg menu" class="button">Back to Menu</button>` +
	`</p>` +
	`</div>`;
}

// --- NEW FUNCTION ---
function generateTrainerVictoryHTML(opponentName: string, expMessages: string[], moneyGained: number): string {
	return `<div class="infobox"><h2>Victory!</h2><p>You defeated <strong>${opponentName}</strong>!</p><div style="background: #f0f0f0; padding: 10px; border-radius: 5px;">${expMessages.join('<br>')}</div><p>You received ₽${moneyGained} for winning!</p><p><button name="send" value="/rpg explore" class="button">Continue Exploring</button><button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
}

// --- MODIFIED FUNCTION ---
function generateDefeatHTML(moneyLost: number, opponentName?: string): string {
	const opponentMessage = opponentName ? `You lost to ${opponentName}!` : "You have no more Pokemon that can fight!";
	return `<div class="infobox"><h2>Defeat!</h2><p>${opponentMessage}</p><p>You blacked out and rushed to the nearest Pokemon Center...</p><p>You lost ₽${moneyLost}!</p><p><button name="send" value="/rpg menu" class="button">Continue</button></p></div>`;
}

function generateFaintSwitchHTML(battle: BattleState, message: string): string {
	let html = `<div class="infobox"><h2>A Pokémon fainted!</h2><p>${message}</p>`;
	const player = getPlayerData(battle.playerId);

	// --- FIX: Correctly find the empty slot based on battle type ---
	const isDoubleBattle = battle.battleType === 'wild_double' || battle.battleType === 'trainer_double';
	
	let slotToFill = -1;
	if (battle.playerSlots[0] === null) {
		slotToFill = 0;
	} else if (isDoubleBattle && battle.playerSlots[1] === null) {
		slotToFill = 1;
	}
	// --- END FIX ---

	if (slotToFill === -1) {
		// This should not happen if we got here, but it's a safe fallback.
		html += `<p>Error: No empty slot found.</p><button name="send" value="/rpg battleaction back" class="button">Back</button>`;
	} else {
		html += `<p>Choose a Pokémon to send to <strong>Slot ${slotToFill + 1}</strong>:</p>`;

		// Find available party members
		const availableParty = player.party.filter(p =>
			p.hp > 0 &&
			!battle.playerSlots.some(s => s?.pokemon.id === p.id)
		);

		if (availableParty.length === 0) {
			html += `<p>You have no other Pokémon that can fight!</p>`;
		} else {
			for (const pokemon of availableParty) {
				html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px; border-radius: 5px;"><strong>${pokemon.species}</strong> (Lvl ${pokemon.level}) | HP: ${pokemon.hp}/${pokemon.maxHp}<button name="send" value="/rpg battleaction forceswitch ${slotToFill} ${pokemon.id}" class="button" style="float: right;">Switch In</button></div>`;
			}
		}
	}
	html += `</div>`;
	return html;
}

function generateMoveLearnHTML(player: PlayerData): string {
	const queue = player.pendingMoveLearnQueue;
	if (!queue || queue.moveIds.length === 0) return `<h2>Error: No pending moves found.</h2>`;
	const pokemon = player.party.find(p => p.id === queue.pokemonId);
	const newMove = getMove(queue.moveIds[0]);
	if (!pokemon || !newMove.exists) {
		delete player.pendingMoveLearnQueue;
		return `<h2>Error: Invalid Pokemon or move data.</h2><p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p>`;
	}
	let html = `<div class="infobox"><h2>Move Learning Result</h2><p><strong>${pokemon.species}</strong> wants to learn the move <strong>${newMove.name}</strong>!</p><p>However, ${pokemon.species} already knows four moves. Which move should be forgotten?</p>`;
	for (const move of pokemon.moves) {
		html += `<button name="send" value="/rpg learnmove ${move.id}" class="button">${getMove(move.id).name}</button>`;
	}
	html += `<hr /><p>...or, give up on learning the move <strong>${newMove.name}</strong>?</p><button name="send" value="/rpg learnmove skip" class="button" style="background-color: #d9534f; color: #fff;">Give Up</button></div>`;
	return html;
}

function generateGiveItemPokemonSelectionHTML(player: PlayerData, itemId: string): string {
	const item = ITEMS_DATABASE[itemId];
	if (!item) return `<h2>Item not found.</h2>`;

	let html = `<div class="infobox"><h2>Give ${item.name}</h2><p>Select a Pokémon to give this item to:</p>`;
	for (const pokemon of player.party) {
		html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;">` +
			`<span>${pokemon.species} (Holding: ${pokemon.item ? (ITEMS_DATABASE[pokemon.item]?.name || pokemon.item) : 'None'})</span>` +
			`<button name="send" value="/rpg giveitem ${pokemon.id} ${itemId}" class="button" style="float: right;">Give</button>` +
			`</div>`;
	}
	html += `<hr /><p><button name="send" value="/rpg items" class="button">Back to Bag</button></p></div>`;
	return html;
}

function generatePivotSwitchHTML(battle: BattleState, message: string, pivotSlotIndex: number): string {
	let html = `<div class="infobox"><h2>A Pokémon is switching out!</h2><p>${message}</p>`;
	const player = getPlayerData(battle.playerId);
	const pivotingPokemon = battle.pendingPivot?.slot.pokemon; // Get pokemon from the pivot request

	html += `<p>Choose a Pokémon to replace <strong>${pivotingPokemon?.species || 'your Pokémon'}</strong> in <strong>Slot ${pivotSlotIndex + 1}</strong>:</p>`;

	const availableParty = player.party.filter(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);

	if (availableParty.length === 0) {
		html += `<p>You have no other Pokémon to switch to!</p>`;
		// This is a problem. The battle needs to continue.
		// We'll add a button to just continue the battle.
		html += `<p><button name="send" value="/rpg battleaction forceswitch ${pivotSlotIndex} cancel" class="button">Continue</button></p>`;
	} else {
		for (const pokemon of availableParty) {
			html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px; border-radius: 5px;"><strong>${pokemon.species}</strong> (Lvl ${pokemon.level}) | HP: ${pokemon.hp}/${pokemon.maxHp}<button name="send" value="/rpg battleaction forceswitch ${pivotSlotIndex} ${pokemon.id}" class="button" style="float: right;">Switch In</button></div>`;
		}
	}
	html += `</div>`;
	return html;
}

function generateFieldEffectHTML(battle: BattleState): string {
	let html = '<div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 8px; margin-bottom: 10px; font-size: 12px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px;">';
	const fieldEffects: string[] = [];
	const playerSide: string[] = [];
	const opponentSide: string[] = [];

	// --- Global Field Effects ---
	if (battle.weather) {
		const weatherIcons = { sun: '☀️', rain: '🌧️', sand: '🏜️', hail: '🌨️' };
		fieldEffects.push(`${weatherIcons[battle.weather.type]} <strong>${battle.weather.type.toUpperCase()}</strong> (${battle.weather.turns} turns)`);
	}
	if (battle.terrain) {
		const terrainIcons = { electric: '⚡', grassy: '🌱', misty: '🌫️', psychic: '👁️' };
		fieldEffects.push(`${terrainIcons[battle.terrain.type]} <strong>${battle.terrain.type.toUpperCase()} Terrain</strong> (${battle.terrain.turns} turns)`);
	}
	if (battle.trickRoomTurns > 0) fieldEffects.push(`🕒 <strong>Trick Room</strong> (${battle.trickRoomTurns} turns)`);
	if (battle.magicRoomTurns > 0) fieldEffects.push(`✨ <strong>Magic Room</strong> (${battle.magicRoomTurns} turns)`);
	if (battle.wonderRoomTurns > 0) fieldEffects.push(`❓ <strong>Wonder Room</strong> (${battle.wonderRoomTurns} turns)`);
	if (battle.gravityTurns > 0) fieldEffects.push(`🌍 <strong>Gravity</strong> (${battle.gravityTurns} turns)`);
	if (battle.mudSportTurns > 0) fieldEffects.push(`💩 <strong>Mud Sport</strong> (${battle.mudSportTurns} turns)`);
	if (battle.waterSportTurns > 0) fieldEffects.push(`💧 <strong>Water Sport</strong> (${battle.waterSportTurns} turns)`);

	// --- Player Side Effects ---
	if (battle.playerReflectTurns > 0) playerSide.push(`🛡️ Reflect (${battle.playerReflectTurns})`);
	if (battle.playerLightScreenTurns > 0) playerSide.push(`💡 Light Screen (${battle.playerLightScreenTurns})`);
	if (battle.playerAuroraVeilTurns > 0) playerSide.push(`🌈 Aurora Veil (${battle.playerAuroraVeilTurns})`);
	// --- START FIX ---
	if (battle.playerQuickGuard) playerSide.push(`💨 Quick Guard`);
	if (battle.playerWideGuard) playerSide.push(`🛡️ Wide Guard`);
	if (battle.playerCraftyShield) playerSide.push(`✨ Crafty Shield`);
	// --- END FIX ---
	if (battle.playerHazards.includes('stealthrock')) playerSide.push(`💎 Stealth Rock`);
	const spikes = battle.playerHazards.filter(h => h === 'spikes').length;
	if (spikes > 0) playerSide.push(`📌 Spikes (x${spikes})`);
	const toxicSpikes = battle.playerHazards.filter(h => h === 'toxicspikes').length;
	if (toxicSpikes > 0) playerSide.push(`☠️ Toxic Spikes (x${toxicSpikes})`);
	if (battle.playerHazards.includes('stickyweb')) playerSide.push(`🕸️ Sticky Web`);

	// --- Opponent Side Effects ---
	if (battle.opponentReflectTurns > 0) opponentSide.push(`🛡️ Reflect (${battle.opponentReflectTurns})`);
	if (battle.opponentLightScreenTurns > 0) opponentSide.push(`💡 Light Screen (${battle.opponentLightScreenTurns})`);
	if (battle.opponentAuroraVeilTurns > 0) opponentSide.push(`🌈 Aurora Veil (${battle.opponentAuroraVeilTurns})`);
	// --- START FIX ---
	if (battle.opponentQuickGuard) opponentSide.push(`💨 Quick Guard`);
	if (battle.opponentWideGuard) opponentSide.push(`🛡️ Wide Guard`);
	if (battle.opponentCraftyShield) opponentSide.push(`✨ Crafty Shield`);
	// --- END FIX ---
	if (battle.opponentHazards.includes('stealthrock')) opponentSide.push(`💎 Stealth Rock`);
	const oppSpikes = battle.opponentHazards.filter(h => h === 'spikes').length;
	if (oppSpikes > 0) oppSpikes.push(`📌 Spikes (x${oppSpikes})`);
	const oppToxicSpikes = battle.opponentHazards.filter(h => h === 'toxicspikes').length;
	if (oppToxicSpikes > 0) opponentSide.push(`☠️ Toxic Spikes (x${oppToxicSpikes})`);
	if (battle.opponentHazards.includes('stickyweb')) opponentSide.push(`🕸️ Sticky Web`);

	// --- Assemble HTML ---
	html += `<div><strong>Your Side:</strong><br>${playerSide.length > 0 ? playerSide.join('<br>') : '<em>Clear</em>'}</div>`;
	html += `<div><strong>Field:</strong><br>${fieldEffects.length > 0 ? fieldEffects.join('<br>') : '<em>Clear</em>'}</div>`;
	html += `<div><strong>Opponent's Side:</strong><br>${opponentSide.length > 0 ? opponentSide.join('<br>') : '<em>Clear</em>'}</div>`;

	html += '</div>';
	return html;
}

/************
* COMMANDS
************/

/**
 * Validates if a Pokemon can use a specific move, checking for various conditions.
 * @returns A string error message if validation fails, or null if it's valid.
 */
function validateMoveAction(
	attackerSlot: ActivePokemonSlot,
	moveId: string,
	battle: BattleState
): string | null {
	const pokemon = attackerSlot.pokemon;
	const moveData = getMove(moveId);

	// Check Taunt
	if (attackerSlot.tauntTurns > 0 && moveData.category === 'Status') {
		return `${pokemon.species} is taunted! It can't use ${moveData.name}!`;
	}

	// Check Assault Vest
	if (battle.magicRoomTurns === 0 && pokemon.item === 'assaultvest' && moveData.category === 'Status') {
		return `Your Assault Vest prevents you from using ${moveData.name}!`;
	}

	// Check PP
	const moveObject = pokemon.moves.find(m => m.id === moveData.id);
	if (moveObject && moveObject.pp === 0) {
		return `There is no PP left for ${moveData.name}!`;
	}

	// Check Disable
	if (attackerSlot.disabledMove && attackerSlot.disabledMove.moveId === moveData.id) {
		return `${moveData.name} is disabled!`;
	}

	// Check Encore
	if (attackerSlot.encoreMove && attackerSlot.encoreMove.moveId !== moveData.id) {
		return `${pokemon.species} must use ${attackerSlot.encoreMove.moveId}!`;
	}

	// Check Torment
	if (attackerSlot.tormentActive && attackerSlot.lastMoveUsed === moveData.id) {
		return `${pokemon.species} can't use the same move twice due to Torment!`;
	}

	// Check Choice Item Lock
	if (attackerSlot.lockedMove && attackerSlot.lockedMove !== moveData.id && battle.magicRoomTurns === 0) {
		const lockedMoveObject = pokemon.moves.find(m => m.id === attackerSlot.lockedMove);
		// Check if the locked move still has PP
		if (lockedMoveObject && lockedMoveObject.pp > 0) {
			return `${pokemon.species} is locked into ${lockedMoveObject.id}!`;
		}
	}

	// All checks passed
	return null;
}

export const commands: ChatCommands = {
	rpg: {
		start(target, room, user) {
			const player = getPlayerData(user.id);
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			if (player.party.length > 0) {
				return this.parse('/rpg menu');
			}
			this.sendReply(`|uhtml|rpg-${user.id}|${generateWelcomeHTML()}`);
		},

		choosetype(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const type = target.trim().toLowerCase();
			if (!['fire', 'water', 'grass'].includes(type)) {
				return this.errorReply("Invalid type.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateStarterSelectionHTML(type)}`);
		},

		choosestarter(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const starterId = toID(target);
			const player = getPlayerData(user.id);
			if (player.party.length > 0) {
				return this.errorReply("You already have a starter Pokemon!");
			}
			if (!Object.values(STARTER_POKEMON).flat().includes(starterId)) {
				return this.errorReply("Invalid starter Pokemon.");
			}
			try {
				const starterPokemon = createPokemon(starterId, 5);
				player.party.push(starterPokemon);
				player.name = user.name;
				const species = Dex.species.get(starterId);

				// --- FIX ---
				// Create a temporary slot object to pass to the updated function.
				// This provides the default volatile statuses that generatePokemonInfoHTML expects.
				const tempSlot = createActivePokemonSlot(starterPokemon);

				const confirmHTML = `<div class="infobox"><h2>Congratulations!</h2><p>You have chosen <strong>${species.name}</strong> as your starter!</p>${generatePokemonInfoHTML(tempSlot, true)}<p>Your adventure begins now...</p><p><button name="send" value="/rpg menu" class="button">Continue</button></p></div>`;
				// --- END FIX ---

				this.sendReply(`|uhtmlchange|rpg-${user.id}|${confirmHTML}`);
				if (room?.roomid !== 'lobby') {
					room.add(`|c|~RPG Bot|${user.name} has chosen ${species.name} as their starter pokemon!`).update();
				}
			} catch (error) {
				this.errorReply(`Error creating starter Pokemon: ${error}`);
			}
		},

		menu(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are in a battle!");
			}
			const player = getPlayerData(user.id);
			if (player.party.length === 0) {
				return this.parse('/rpg start');
			}
			const menuHTML = `<div class="infobox"><h2>RPG Menu - ${player.name}</h2><p><strong>Location:</strong> ${player.location} | <strong>Money:</strong> ₽${player.money}</p><p>What would you like to do?</p><p><button name="send" value="/rpg profile" class="button">👤 Profile</button><button name="send" value="/rpg party" class="button">⚡ Party</button><button name="send" value="/rpg battle" class="button">⚔️ Battle</button><button name="send" value="/rpg explore" class="button">🗺️ Explore</button></p><p><button name="send" value="/rpg pokedex" class="button">📖 Pokédex</button><button name="send" value="/rpg items" class="button">🎒 Items</button><button name="send" value="/rpg pc" class="button">💻 Pokemon PC</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${menuHTML}`);
		},

		learnmove(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this during a battle.");
			}
			const player = getPlayerData(user.id);
			const queue = player.pendingMoveLearnQueue;
			if (!queue || queue.moveIds.length === 0) {
				return this.errorReply("Your Pokemon is not trying to learn a new move.");
			}
			const pokemon = player.party.find(p => p.id === queue.pokemonId);
			if (!pokemon) {
				delete player.pendingMoveLearnQueue;
				return this.errorReply("Error: Pokemon not found.");
			}
			const newMoveId = queue.moveIds[0];
			const newMoveData = getMove(newMoveId);

			const newMoveName = newMoveData.name;
			const moveToReplace = toID(target);
			let message = "";
			if (moveToReplace === 'skip') {
				message = `<strong>${pokemon.species}</strong> did not learn <strong>${newMoveName}</strong>.`;
			} else {
				const moveIndex = pokemon.moves.findIndex(m => m.id === moveToReplace);
				if (moveIndex === -1) {
					return this.errorReply("That move is not known by your Pokemon.");
				}
				const oldMoveName = getMove(pokemon.moves[moveIndex].id).name;
				pokemon.moves[moveIndex] = { id: newMoveId, pp: newMoveData.pp || 5 };
				message = `1, 2, and... Poof! <strong>${pokemon.species}</strong> forgot <strong>${oldMoveName}</strong> and learned <strong>${newMoveName}</strong>!`;
			}
			queue.moveIds.shift();
			if (queue.moveIds.length > 0) {
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			} else {
				delete player.pendingMoveLearnQueue;
				// --- FIX ---
				const tempSlot = createActivePokemonSlot(pokemon);
				const resultHTML = `<div class="infobox"><h2>Move Learning Result</h2><p>${message}</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg menu" class="button">Continue</button></p></div>`;
				// --- END FIX ---
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
			}
		},

		learneggmove(target, room, user) {
			const player = getPlayerData(user.id);

			// --- FIX: Correctly parse multi-word moves ---
			const parts = target.split(' ');
			if (parts.length < 2) {
				return this.errorReply("Invalid command parameters.");
			}
			const pokemonId = parts[0];
			const rawMoveId = parts.slice(1).join(' '); // This correctly becomes "magical leaf"
			// --- END FIX ---

			if (!pokemonId || !rawMoveId) {
				return this.errorReply("Invalid command parameters.");
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party.");
			}
			const speciesId = toID(pokemon.species);
			const eggMoves = MANUAL_LEARNSETS[speciesId]?.egg || [];

			// This check will now correctly use "magical leaf"
			if (!eggMoves.includes(rawMoveId)) {
				return this.errorReply("This is not a valid Egg Move for this Pokemon.");
			}
			if (!removeItemFromInventory(player, 'eggmovetutor', 1)) {
				// This is a safety check in case the player somehow lost the item after initiating the command
				return this.errorReply("Could not use the Egg Move Tutor. Item not found in inventory.");
			}

			const newMoveId = toID(rawMoveId); // Converts "magical leaf" to "magicalleaf"

			if (pokemon.moves.length < 4) {
				const newMoveData = getMove(newMoveId);
				pokemon.moves.push({ id: newMoveId, pp: newMoveData.pp || 5 });
				// --- FIX ---
				const tempSlot = createActivePokemonSlot(pokemon);
				const resultHTML = `<div class="infobox"><h2>Move Learned!</h2><p><strong>${pokemon.species}</strong> learned <strong>${newMoveData.name}</strong>!</p>${generatePokemonInfoHTML(tempSlot)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
				// --- END FIX ---
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
			} else {
				player.pendingMoveLearnQueue = { pokemonId: pokemon.id, moveIds: [newMoveId] };
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			}
		},

		summary(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot view a summary during battle.");
			}
			const player = getPlayerData(user.id);
			const targetId = target.trim();
			if (!targetId) {
				let html = `<div class="infobox"><h2>Select a Pokémon</h2><p>Choose a Pokémon to view its summary:</p>`;
				if (player.party.length === 0) {
					html += '<p>You have no Pokémon.</p>';
				} else {
					player.party.forEach(p => {
						html += `<button name="send" value="/rpg summary ${p.id}" class="button" style="margin: 3px;">${p.species}</button> `;
					});
				}
				html += `<hr /><p><button name="send" value="/rpg party" class="button">← Back to Party</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}
			const pokemon = player.party.find(p => p.id === targetId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePokemonSummaryHTML(pokemon)}`);
		},

		profile(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are in a battle!");
			}
			const player = getPlayerData(user.id);
			const profileHTML = `<div class="infobox"><h2>Player Profile</h2><p><strong>Trainer:</strong> ${player.name}</p><p><strong>Level:</strong> ${player.level}</p><p><strong>Badges:</strong> ${player.badges}</p><p><strong>Pokemon in Party:</strong> ${player.party.length}</p><p><strong>Money:</strong> ₽${player.money}</p><p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${profileHTML}`);
		},

		party(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot view your party during a battle.");
			}
			const player = getPlayerData(user.id);
			let partyHTML = `<div class="infobox"><h2>Your Party</h2>`;
			if (player.party.length === 0) {
				partyHTML += `<p>No Pokemon in party.</p>`;
			} else {
				for (let i = 0; i < 6; i++) {
					if (player.party[i]) {
						// --- FIX ---
						// We must wrap the RPGPokemon in an ActivePokemonSlot
						const tempSlot = createActivePokemonSlot(player.party[i]);
						partyHTML += `<div><strong>Slot ${i + 1}:</strong><br>${generatePokemonInfoHTML(tempSlot, true, true)}</div>`;
						// --- END FIX ---
					} else {
						partyHTML += `<p><strong>Slot ${i + 1}:</strong> Empty</p>`;
					}
				}
			}
			partyHTML += `<p style="margin-top: 15px;"><button name="send" value="/rpg pc" class="button">Pokemon PC</button> <button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${partyHTML}`);
		},

		items(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access your bag in battle.");
			}
			const player = getPlayerData(user.id);
			const category = toID(target);
			const validCategories = ['pokeball', 'medicine', 'berry', 'tm', 'key', 'held', 'misc'];
			const filterCategory = validCategories.includes(category) ? category : undefined;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateInventoryHTML(player, filterCategory)}`);
		},

		useitem(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot use items from the menu during a battle.");
			}
			const [itemId, pokemonId] = target.split(' ').map(arg => toID(arg));
			const player = getPlayerData(user.id);

			if (!itemId) return this.errorReply("Please specify an item to use.");
			if (!player.inventory.has(itemId)) return this.errorReply("You don't have that item.");

			const item = player.inventory.get(itemId)!;

			if (item.category === 'medicine') {
				if (!pokemonId) {
					let html = `<div class="infobox"><h2>Use ${item.name}</h2><p>Select a Pokemon to use this item on:</p>`;
					for (const pokemon of player.party) {
						// Only show Pokemon that can be healed
						if (pokemon.hp > 0 && pokemon.hp < pokemon.maxHp) {
							html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;"><div><strong>${pokemon.species}</strong> (Lvl ${pokemon.level})<br><small>HP: ${pokemon.hp}/${pokemon.maxHp}</small></div><button name="send" value="/rpg useitem ${itemId} ${pokemon.id}" class="button">Use</button></div>`;
						}
					}
					html += `<p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
				}
				const targetPokemon = player.party.find(p => p.id === pokemonId);
				if (!targetPokemon) return this.errorReply("Pokemon not found in party.");

				const result = useHealingItem(player, targetPokemon, itemId);

				if (!result.success) {
					// .errorReply escapes HTML, so we use sendReply with a styled error message
					const errorHTML = `<div class="infobox"><p style="color: red; font-weight: bold;">${result.message}</p><p><button name="send" value="/rpg useitem ${itemId}" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${errorHTML}`);
				}

				// --- FIX ---
				const tempSlot = createActivePokemonSlot(targetPokemon);
				const resultHTML = `<div class="infobox"><h2>Item Used!</h2><p>${result.message}</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
				// --- END FIX ---
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
			} else if (item.category === 'held' || item.category === 'berry') {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateGiveItemPokemonSelectionHTML(player, itemId)}`);
			} else if (itemId === 'eggmovetutor') {
				if (!pokemonId) {
					let html = `<div class="infobox"><h2>Use Egg Move Tutor</h2><p>Select a Pokémon to teach an Egg Move:</p>`;
					for (const pokemon of player.party) {
						html += `<button name="send" value="/rpg useitem eggmovetutor ${pokemon.id}" class="button" style="margin: 3px;">${pokemon.species}</button>`;
					}
					html += `<hr /><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
				}
				const targetPokemon = player.party.find(p => p.id === pokemonId);
				if (!targetPokemon) return this.errorReply("Pokemon not found in your party.");
				const speciesId = toID(targetPokemon.species);
				const allEggMoves = MANUAL_LEARNSETS[speciesId]?.egg || [];
				const learnableEggMoves = allEggMoves.filter(moveId => !targetPokemon.moves.some(m => m.id === toID(moveId)));

				if (learnableEggMoves.length === 0) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>No Moves Available</h2><p><strong>${targetPokemon.species}</strong> either has no Egg Moves or already knows all of them.</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`);
				}
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateEggMoveSelectionHTML(targetPokemon, learnableEggMoves)}`);
			} else {
				return this.errorReply("This item cannot be used right now.");
			}
		},

		pc(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access the PC during a battle.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePCHTML(getPlayerData(user.id))}`);
		},

		depositpc(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access the PC during a battle.");
			}
			const pokemonId = target.trim();
			const player = getPlayerData(user.id);
			if (player.party.length <= 1) {
				return this.errorReply("You must keep at least one Pokemon in your party!");
			}
			const pokemonIndex = player.party.findIndex(p => p.id === pokemonId);
			if (pokemonIndex === -1) {
				return this.errorReply("Pokemon not found in party.");
			}
			const [pokemon] = player.party.splice(pokemonIndex, 1);
			storePokemonInPC(player, pokemon);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Pokemon Deposited</h2><p><strong>${pokemon.species}</strong> has been deposited into the PC!</p><p><button name="send" value="/rpg pc" class="button">View PC</button><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`);
		},

		withdrawpc(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access the PC during a battle.");
			}
			const pokemonId = target.trim();
			const player = getPlayerData(user.id);
			if (player.party.length >= 6) {
				return this.errorReply("Your party is full!");
			}
			const pokemon = withdrawPokemonFromPC(player, pokemonId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in PC.");
			}
			player.party.push(pokemon);
			// --- FIX ---
			const tempSlot = createActivePokemonSlot(pokemon);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Pokemon Withdrawn</h2><p><strong>${pokemon.species}</strong> has been withdrawn from the PC!</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg pc" class="button">View PC</button><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`);
			// --- END FIX ---
		},

		shop(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot shop during a battle.");
			}
			const player = getPlayerData(user.id);
			const category = toID(target);
			// This line has been corrected to include 'medicine' instead of 'potion'
			const validCategories = ['pokeball', 'medicine', 'held', 'berry', 'misc'];
			const filterCategory = validCategories.includes(category) ? category : undefined;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateShopHTML(player, filterCategory)}`);
		},

		buy(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot shop during a battle.");
			}
			const [itemId, quantityStr] = target.split(' ');
			const quantity = parseInt(quantityStr) || 1;
			const player = getPlayerData(user.id);
			if (!itemId || !ITEMS_DATABASE[itemId]) {
				return this.errorReply("Invalid item specified.");
			}
			const itemPrice = ITEM_PRICES[itemId];
			if (!itemPrice) {
				return this.errorReply("This item is not for sale.");
			}
			const totalCost = itemPrice * quantity;
			if (player.money < totalCost) {
				return this.errorReply(`You don't have enough money! You need ₽${totalCost}.`);
			}
			player.money -= totalCost;
			addItemToInventory(player, itemId, quantity);
			const item = ITEMS_DATABASE[itemId];
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Purchase Complete!</h2><p>You bought <strong>${quantity}x ${item.name}</strong> for ₽${totalCost}!</p><p><strong>Money remaining:</strong> ₽${player.money}</p><p><button name="send" value="/rpg shop" class="button">Continue Shopping</button><button name="send" value="/rpg items" class="button">View Inventory</button></p></div>`);
		},

		pokedex(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot use the Pokedex during a battle.");
			}
		},

		explore(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot explore during a battle.");
			}

			const player = getPlayerData(user.id);
			// This logic finds all zones that match the player's current location
			const availableZones = Object.keys(ENCOUNTER_ZONES).filter(zoneId => zoneId.startsWith(toID(player.location)));

			let exploreButtons = '';
			if (availableZones.length > 0) {
				for (const zoneId of availableZones) {
					const zone = ENCOUNTER_ZONES[zoneId];
					const icon = zone.battleType === 'double' ? '👥' : '🛤️';
					exploreButtons += `<button name="send" value="/rpg wildpokemon ${zoneId}" class="button">${icon} ${zone.name}</button>`;
				}
			} else {
				exploreButtons = `<p>There's nowhere to explore here right now.</p>`;
			}

			// --- EXAMPLE of how to add a trainer ---
			// You would add logic here to check if the trainer should appear
			// For example: if (!player.badges.includes('boulder')) {
			exploreButtons += `<button name="send" value="/rpg challenge gym_brock" class="button">🔥 Challenge Brock</button>`;
			// }

			const exploreHTML = `<div class="infobox">` +
				`<h2>Explore ${player.location}</h2>` +
				`<p>Choose where to go:</p>` +
				`<p>${exploreButtons}</p>` +
				`<hr />` +
				`<p>` +
				`<button name="send" value="/rpg shop" class="button">🏪 Poké Mart</button>` +
				`<button name="send" value="/rpg heal" class="button">🏥 Pokémon Center</button>` +
				`</p>` +
				`<p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p>` +
				`</div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${exploreHTML}`);
		},

		wildpokemon(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}

			const player = getPlayerData(user.id);
			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) {
				return this.errorReply("All your Pokémon have fainted!");
			}

			const zoneId = target.trim();
			const zone = ENCOUNTER_ZONES[zoneId];
			if (!zone) {
				return this.errorReply("This is not a valid area to explore. Use /rpg explore to see available areas.");
			}

			const battleType = zone.battleType || 'single';
			const battleMessages: string[] = [];
			const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			let finalBattleType: BattleState['battleType'] = 'wild';

			try {
				// --- Player Pokemon ---
				playerSlots[0] = createActivePokemonSlot(activeParty[0]);

				// --- Wild Pokemon ---
				const wildSpecies1 = zone.pokemon[Math.floor(Math.random() * zone.pokemon.length)];
				const [minLevel, maxLevel] = zone.levelRange;
				const wildLevel1 = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
				const wildPokemon1 = createPokemon(wildSpecies1, wildLevel1);
				opponentSlots[0] = createActivePokemonSlot(wildPokemon1);

				if (battleType === 'double') {
					finalBattleType = 'wild_double';
					// Add second player Pokemon if available
					if (activeParty[1]) {
						playerSlots[1] = createActivePokemonSlot(activeParty[1]);
					}

					// Add second wild Pokemon
					const wildSpecies2 = zone.pokemon[Math.floor(Math.random() * zone.pokemon.length)];
					const wildLevel2 = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
					const wildPokemon2 = createPokemon(wildSpecies2, wildLevel2);
					opponentSlots[1] = createActivePokemonSlot(wildPokemon2);
					battleMessages.push(`A wild ${wildPokemon1.species} and ${wildPokemon2.species} appeared!`);
				} else {
					finalBattleType = 'wild';
					battleMessages.push(`A wild ${wildPokemon1.species} appeared!`);
				}

				const opponentParty = [opponentSlots[0].pokemon];
				if (opponentSlots[1]) opponentParty.push(opponentSlots[1].pokemon);

				activeBattles.set(user.id, {
					// --- Battle Type Fields ---
					battleType: finalBattleType,
					opponentName: `Wild Pokémon`,
					opponentParty,
					opponentMoney: 0,

					// --- New Slot-Based Fields ---
					playerSlots,
					opponentSlots,
					pendingActions: {},

					// --- Core BattleState Fields ---
					playerId: user.id,
					turn: 0,
					zoneId,
					playerHazards: [],
					opponentHazards: [],
					weather: undefined,
					trickRoomTurns: 0,
					magicRoomTurns: 0,
					wonderRoomTurns: 0,
					terrain: undefined,
					playerShouldSwitch: undefined,
					pendingPivot: undefined,
					aiPendingPivot: undefined,
					forceEnd: false,

					// --- Side-Wide Fields ---
					playerQuickGuard: false,
					opponentQuickGuard: false,
					playerWideGuard: false,
					opponentWideGuard: false,
					playerCraftyShield: false,
					opponentCraftyShield: false,
					playerReflectTurns: 0,
					opponentReflectTurns: 0,
					playerLightScreenTurns: 0,
					opponentLightScreenTurns: 0,
					playerAuroraVeilTurns: 0,
					opponentAuroraVeilTurns: 0,
					gravityTurns: 0,
					mudSportTurns: 0,
					waterSportTurns: 0,

					// --- Delayed Move Fields ---
					playerFutureMoves: [],
					opponentFutureMoves: [],

					messageLog: battleMessages,
					currentView: 'battle',
					battleResult: 'pending',
				});

				// The command will handle the redirect
			} catch (error) {
				this.errorReply(`Error generating wild Pokémon: ${error}`);
			}
		},

		// --- NEW COMMAND ---
		challenge(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}
			const player = getPlayerData(user.id);
			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) {
				return this.errorReply("You must heal your Pokémon before challenging a trainer!");
			}

			const trainerId = toID(target);
			const trainerSpec = TRAINER_DATABASE[trainerId];
			if (!trainerSpec) {
				return this.errorReply("That trainer could not be found.");
			}

			// Create fresh instances of the trainer's Pokémon
			const trainerParty: RPGPokemon[] = [];
			for (const spec of trainerSpec.party) {
				const pokemon = createPokemon(spec.species, spec.level);
				if (spec.moves) {
					pokemon.moves = spec.moves.map(moveId => {
						const moveData = getMove(moveId);
						return { id: moveId, pp: moveData.pp || 5 };
					});
				}
				if (spec.item) {
					pokemon.item = spec.item;
				}
				trainerParty.push(pokemon);
			}

			if (trainerParty.length === 0) {
				return this.errorReply("This trainer has no Pokémon!");
			}

			const battleType = trainerSpec.battleType || 'single';
			const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			let finalBattleType: BattleState['battleType'] = 'trainer';

			// --- Player Pokemon ---
			playerSlots[0] = createActivePokemonSlot(activeParty[0]);

			// --- Opponent Pokemon ---
			opponentSlots[0] = createActivePokemonSlot(trainerParty[0]);

			if (battleType === 'double') {
				finalBattleType = 'trainer_double';
				// Add second player Pokemon if available
				if (activeParty[1]) {
					playerSlots[1] = createActivePokemonSlot(activeParty[1]);
				}
				// Add second opponent Pokemon if available
				if (trainerParty[1]) {
					opponentSlots[1] = createActivePokemonSlot(trainerParty[1]);
				}
			} else {
				finalBattleType = 'trainer';
			}

			activeBattles.set(user.id, {
				// --- Battle Type Fields ---
				battleType: finalBattleType,
				opponentName: trainerSpec.name,
				opponentParty: trainerParty, // The full party
				opponentMoney: trainerSpec.money,

				// --- New Slot-Based Fields ---
				playerSlots,
				opponentSlots,
				pendingActions: {},

				// --- Core BattleState Fields ---
				playerId: user.id,
				turn: 0,
				zoneId: 'trainer_battle', // Or any identifier
				playerHazards: [],
				opponentHazards: [],
				weather: undefined,
				trickRoomTurns: 0,
				magicRoomTurns: 0,
				wonderRoomTurns: 0,
				terrain: undefined,
				playerShouldSwitch: undefined,
				pendingPivot: undefined,
				aiPendingPivot: undefined,
				forceEnd: false,

				// --- Side-Wide Fields ---
				playerQuickGuard: false,
				opponentQuickGuard: false,
				playerWideGuard: false,
				opponentWideGuard: false,
				playerCraftyShield: false,
				opponentCraftyShield: false,
				playerReflectTurns: 0,
				opponentReflectTurns: 0,
				playerLightScreenTurns: 0,
				opponentLightScreenTurns: 0,
				playerAuroraVeilTurns: 0,
				opponentAuroraVeilTurns: 0,
				gravityTurns: 0,
				mudSportTurns: 0,
				waterSportTurns: 0,

				// --- Delayed Move Fields ---
				playerFutureMoves: [],
				opponentFutureMoves: [],

				messageLog: [trainerSpec.dialogue?.start || `You are challenged by ${trainerSpec.name}!`],
				currentView: 'battle',
				battleResult: 'pending',
			});
		},

		battle(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}
			// Get all available zone IDs from the configuration object
			const availableZoneIds = Object.keys(ENCOUNTER_ZONES);

			if (availableZoneIds.length === 0) {
				return this.errorReply("There are no wild Pokémon zones configured yet.");
			}

			// Select a random zone ID from the list of available zones
			const randomZoneId = availableZoneIds[Math.floor(Math.random() * availableZoneIds.length)];

			// Use this.parse() to execute the wildpokemon command with the random zone
			// This avoids duplicating code and keeps everything streamlined.
			return this.parse(`/rpg wildpokemon ${randomZoneId}`);
		},

		battleaction: {
			move(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const [attackerSlotStr, moveIdStr, targetSlotStr] = target.split(' ');
				const attackerSlotIndex = parseInt(attackerSlotStr);
				const targetSlotIndex = parseInt(targetSlotStr);
				const moveId = toID(moveIdStr);

				if (isNaN(attackerSlotIndex) || !moveId || isNaN(targetSlotIndex)) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Error: Invalid move command received."])}`);
				}

				if (attackerSlotIndex !== 0 && attackerSlotIndex !== 1) {
					return this.errorReply("Invalid attacker slot. Must be 0 or 1.");
				}
				const attackerSlot = battle.playerSlots[attackerSlotIndex];
				if (!attackerSlot || attackerSlot.pokemon.hp <= 0) {
					return this.errorReply("This Pokémon is not in battle or has fainted.");
				}

				if (battle.pendingActions[attackerSlotIndex]) {
					return this.errorReply(`${attackerSlot.pokemon.species} is already waiting to move.`);
				}

				const moveData = getMove(moveId);
				if (!moveData.exists) return this.errorReply(`Move '${moveId}' not found.`);
				
				if (moveId !== 'struggle' && !attackerSlot.pokemon.moves.some(m => m.id === moveData.id)) {
					return this.errorReply(`${attackerSlot.pokemon.species} does not know ${moveData.name}.`);
				}

				// --- REFACTORED VALIDATION ---
				const validationError = validateMoveAction(attackerSlot, moveId, battle);
				if (validationError) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [validationError])}`);
				}
				// --- END REFACTORED VALIDATION ---

				// --- Queue the action ---
				battle.pendingActions[attackerSlotIndex] = {
					actionType: 'move',
					moveId: moveData.id,
					targetSlot: targetSlotIndex,
					pokemonId: attackerSlot.pokemon.id,
				};

				const messageLog = [`${attackerSlot.pokemon.species} is ready to use ${moveData.name}!`];

				// --- Check if all player actions are submitted ---
				const activePlayerSlots = battle.playerSlots.filter(s => s && s.pokemon.hp > 0).length;
				const submittedPlayerActions = Object.keys(battle.pendingActions).filter(k => parseInt(k) <= 1).length;

				if (submittedPlayerActions === activePlayerSlots) {
					// All players have moved, process the turn
					processTurn(this, battle, room, user);
				} else {
					// Waiting for other player's move
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
				}
			},
			// --- NEW FUNCTION ---
			selecttarget(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const [attackerSlotStr, moveId] = target.split(' ');
				const attackerSlotIndex = parseInt(attackerSlotStr);

				if (isNaN(attackerSlotIndex) || !moveId) {
					return this.errorReply("Invalid command.");
				}

				// Re-render the UI in "target selection" mode
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`Select a target for ${getMove(moveId).name}.`], { attackerSlotIndex, moveId })}`);
			},
			// --- END NEW FUNCTION ---

			forceswitch(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const [slotStr, pokemonId] = target.split(' ');
				const slotToFill = parseInt(slotStr);

				if (isNaN(slotToFill) || !pokemonId) {
					return this.errorReply("Invalid switch command.");
				}

				if (pokemonId === 'cancel') {
					// This happens if a player U-turns with no Pokemon to switch to.
					// We must clear the pivot flag.
					if (battle.pendingPivot?.slotIndex === slotToFill) {
						// Put the Pokemon back
						battle.playerSlots[slotToFill as 0 | 1] = battle.pendingPivot.slot;
						battle.pendingPivot = undefined;
					}
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["The battle continues..."])}`);
				}

				const player = getPlayerData(battle.playerId);

				// Find the Pokemon in the party
				const partyIndex = player.party.findIndex(p => p.id === pokemonId && p.hp > 0);
				if (partyIndex === -1) {
					return this.errorReply("Invalid Pokemon or it has fainted.");
				}

				// Check if this Pokemon is already in battle
				if (battle.playerSlots.some(s => s?.pokemon.id === pokemonId)) {
					return this.errorReply("This Pokemon is already in battle.");
				}

				// Check if the slot is actually empty (it should be, if faint or pivot)
				if (battle.playerSlots[slotToFill] !== null && !battle.pendingPivot) {
					return this.errorReply("This slot is not empty.");
				}

				// --- Execute the Switch ---
				const [nextPokemon] = player.party.splice(partyIndex, 1);
				const newSlot = createActivePokemonSlot(nextPokemon);

				const playerColor = '#007bff';
				const infoColor = '#dc3545';
				const messageLog = [`<span style="color: ${playerColor};">Go, ${nextPokemon.species}!</span>`];

				// **NEW:** Check if this is a pivot switch
				if (battle.pendingPivot?.slotIndex === slotToFill) {
					// It's a pivot, add the pivoting pokemon back to the party
					player.party.push(battle.pendingPivot.slot.pokemon);

					// Handle Baton Pass
					if (battle.pendingPivot.isBatonPass) {
						newSlot.statStages = { ...battle.pendingPivot.slot.statStages };
						newSlot.isConfused = battle.pendingPivot.slot.isConfused;
						newSlot.confusionCounter = battle.pendingPivot.slot.confusionCounter;
						newSlot.isSeeded = battle.pendingPivot.slot.isSeeded;
						// (Copy any other volatiles you want to pass)
						messageLog.push(`${newSlot.pokemon.species} received the Baton Pass!`);
					}
					battle.pendingPivot = undefined; // Clear the pivot flag
				}
				// (If not a pivot, it was a faint switch. The fainted mon is already in the party at 0 HP)

				battle.playerSlots[slotToFill as 0 | 1] = newSlot;

				// --- Apply Hazards ---
				const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, true, messageLog);
				if (faintedOnEntry) {
					messageLog.push(`<span style="color: ${infoColor};"><strong>${newSlot.pokemon.species} fainted upon entry!</strong></span>`);
				} else {
					handleMirrorHerb(newSlot, battle, messageLog);
				}

				// --- Check if more switches are needed ---
				const needsAnotherSwitch = battle.playerSlots.some(s => s === null) &&
					player.party.some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));

				if (needsAnotherSwitch) {
					// Another slot is empty, show the switch screen again
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
				} else {
					// All slots are filled, continue the battle
					// Check if this switch *ended* the turn
					const activePlayerSlots = getActiveSlots(battle.playerSlots).length;
					const submittedPlayerActions = Object.keys(battle.pendingActions).filter(k => parseInt(k) <= 1).length;

					if (submittedPlayerActions === activePlayerSlots) {
						// All actions for this turn are complete, process it
						processTurn(this, battle, room, user);
					} else {
						// Turn is not over, just update the UI
						this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
					}
				}
			},

			playerswitch(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const [slotStr, pokemonIdIn] = target.split(' ');
				const slotToSwitchOut = parseInt(slotStr);

				if (isNaN(slotToSwitchOut) || !pokemonIdIn) {
					return this.errorReply("Invalid switch command. Usage: /rpg battleaction playerswitch [slot] [pokemonId]");
				}

				const outgoingSlot = battle.playerSlots[slotToSwitchOut];
				if (!outgoingSlot || outgoingSlot.pokemon.hp <= 0) {
					return this.errorReply("The Pokémon in that slot has fainted or is not there.");
				}

				// --- ARENA TRAP / SHADOW TAG CHECK ---
				const trappingPokemon = checkTrappingAbility(outgoingSlot, battle);
				if (trappingPokemon) {
					const trapMessage = `${outgoingSlot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`;
					this.errorReply(trapMessage);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [trapMessage])}`);
				}
				// --- END TRAP CHECK ---

				if (outgoingSlot.isTrapped) {
					this.errorReply(`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`])}`);
				}

				if (outgoingSlot.isIngrained) {
					this.errorReply(`${outgoingSlot.pokemon.species} is rooted in place by Ingrain and cannot switch out!`);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is rooted in place and cannot switch out!`])}`);
				}

				const player = getPlayerData(battle.playerId);

				// Check if incoming Pokemon is valid
				const incomingPokemon = player.party.find(p => p.id === pokemonIdIn && p.hp > 0);
				if (!incomingPokemon) {
					return this.errorReply("Invalid Pokemon or it has fainted.");
				}
				if (battle.playerSlots.some(s => s?.pokemon.id === pokemonIdIn)) {
					return this.errorReply("This Pokemon is already in battle.");
				}
				
				outgoingSlot.lockedMove = undefined;

				// --- Queue the Switch Action ---
				battle.pendingActions[slotToSwitchOut] = {
					actionType: 'switch',
					switchToPokemonId: pokemonIdIn,
					pokemonId: outgoingSlot.pokemon.id,
				};

				const messageLog = [`${outgoingSlot.pokemon.species} is ready to switch out!`];

				// --- Check if all player actions are submitted ---
				const activePlayerSlots = getActiveSlots(battle.playerSlots).length;
				const submittedPlayerActions = Object.keys(battle.pendingActions).filter(k => parseInt(k) <= 1).length;

				if (submittedPlayerActions === activePlayerSlots) {
					// All players have moved, process the turn
					processTurn(this, battle, room, user);
				} else {
					// Waiting for other player's move
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
				}
			},

			switchmenu(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateSwitchMenuHTML(battle, target)}`);
			},
			catchmenu(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");
				const player = getPlayerData(battle.playerId);
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchMenuHTML(player, battle)}`);
			},

			// --- NEW ---
			selectcatchtarget(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");
				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);
				}
				const ballId = toID(target);
				if (!ballId) return this.errorReply("No ball selected.");

				// If only one target, just catch it.
				const activeOpponents = getActiveSlots(battle.opponentSlots);
				if (activeOpponents.length === 1) {
					const slotIndex = battle.opponentSlots.indexOf(activeOpponents[0]);
					return this.parse(`/rpg battleaction catch ${ballId} ${slotIndex}`);
				}

				// Show target selection screen
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchTargetHTML(battle, ballId)}`);
			},

			catch(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				// --- NEW: Read target ---
				const [ballId, slotIndexStr] = target.split(' ');
				const targetSlotIndex = parseInt(slotIndexStr);

				if (!ballId || isNaN(targetSlotIndex)) {
					return this.errorReply("Invalid catch command. Usage: /rpg battleaction catch [ballId] [slotIndex]");
				}

				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					this.errorReply("You can't catch a Trainer's Pokémon!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);
				}

				// --- NEW: Get target slot ---
				const targetSlot = getSlotFromIndex(battle, targetSlotIndex);
				if (!targetSlot || (targetSlotIndex !== 2 && targetSlotIndex !== 3)) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["That is not a valid target!"])}`);
				}

				const player = getPlayerData(battle.playerId);
				const ballItem = player.inventory.get(ballId);

				if (ballItem?.category !== 'pokeball' || ballItem.quantity < 1) {
					return this.errorReply(`You don't have any ${ITEMS_DATABASE[ballId]?.name || 'of that item'}!`);
				}

				if (player.party.length >= 6 && player.pc.size >= 100) {
					return this.errorReply("Your party and PC are full!");
				}

				removeItemFromInventory(player, ballId, 1);

				const playerColor = '#007bff';
				const infoColor = '#dc3545';
				const neutralColor = '#6c757d';

				const messageLog: string[] = [];
				messageLog.push(`<span style="color: ${playerColor};">${player.name} used a ${ballItem.name}!</span>`);

				// --- NEW: Pass the target slot to performCatchAttempt ---
				const catchResult = performCatchAttempt(battle, ballId, targetSlot);
				const shakeMessages = [
					"Oh no! The Pokemon broke free!", "Aww! It appeared to be caught!",
					"Aargh! Almost had it!", "Gah! It was so close, too!",
				];

				for (let i = 1; i <= catchResult.shakes; i++) {
					if (i < 4) {
						messageLog.push(`<i style="color: ${neutralColor};">...The ball shook...</i>`);
					}
				}

				if (catchResult.success) {
					const zoneId = battle.zoneId;
					saveBattleStatus(battle);
					activeBattles.delete(user.id);

					const caughtPokemon = targetSlot.pokemon;
					caughtPokemon.caughtIn = ballId; // Set the ball it was caught in!

					if (ballId === 'healball') {
						caughtPokemon.hp = caughtPokemon.maxHp;
						caughtPokemon.status = null;
					}

					const location = player.party.length < 6 ? "your party" : "PC";
					if (player.party.length < 6) { player.party.push(caughtPokemon); } else { storePokemonInPC(player, caughtPokemon); }

					let successMessage = `<h2>Gotcha!</h2><p><strong>${caughtPokemon.species}</strong> was caught!</p>`;
					if (ballId === 'healball') successMessage += `<p>${caughtPokemon.species} was fully healed!</p>`;

					// --- FIX: Use createActivePokemonSlot ---
					const tempSlot = createActivePokemonSlot(caughtPokemon);
					const successHTML = `<div class="infobox">` + `${successMessage}` +
						`${generatePokemonInfoHTML(tempSlot, true)}` +
						`<p>${caughtPokemon.species} has been sent to ${location}.</p>` +
						`<p><button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another</button>` +
						`<button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${successHTML}`);
				} else {
					// --- FAILED CATCH PATH (FIXED) ---
					messageLog.push(`<span style="color: ${infoColor};"><strong>${shakeMessages[catchResult.shakes]}</strong></span>`);

					// This is the fix. We queue the 'catch' action for the first available player slot.
					// We do NOT queue 'wait' for the other slot.
					// We do NOT call processTurn().
					// This will queue the action and re-render the UI,
					// allowing the player to select an action for their other Pokémon.

					// Flawed logic from original: just picks the first active slot.
					const playerSlot = getActiveSlots(battle.playerSlots)[0];
					let playerSlotIndex = -1;

					if (playerSlot) {
						playerSlotIndex = battle.playerSlots.indexOf(playerSlot);
					}

					// If no slot is found, or one is already pending, this is an error
					if (playerSlotIndex === -1) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Error: Could not find a Pokémon to use the item."])}`);
					}

					// Check if action is already registered (e.g., if player double-clicks)
					if (battle.pendingActions[playerSlotIndex]) {
						return this.errorReply(`${playerSlot.pokemon.species} is already waiting to move.`);
					}
					
					// Queue the 'catch' action. We assume 'catch' is a silent custom move.
					// If it's not, it will default to 'Struggle'.
					// Given your log, it seems to be a silent custom move.
					battle.pendingActions[playerSlotIndex] = {
						actionType: 'move',
						moveId: 'catch', // This ID is from the original code.
						targetSlot: targetSlotIndex,
						pokemonId: playerSlot.pokemon.id,
					};

					messageLog.push(`${playerSlot.pokemon.species} is ready to throw the ball!`);

					// Re-render the UI so the player can select an action for the *other* Pokémon.
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
				}
			},

			run(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					this.errorReply("You can't run from a Trainer battle!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't run from a Trainer battle!"])}`);
				}

				// --- ARENA TRAP / SHADOW TAG CHECK ---
				const playerSlots = getActiveSlots(battle.playerSlots);
				for (const slot of playerSlots) {
					const trappingPokemon = checkTrappingAbility(slot, battle);
					if (trappingPokemon) {
						const trapMessage = `${slot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`;
						this.errorReply(trapMessage);
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [trapMessage])}`);
					}
				}
				// --- END TRAP CHECK ---

				const trappedPokemon = playerSlots.find(slot => slot.isTrapped);

				if (trappedPokemon) {
					this.errorReply(`${trappedPokemon.pokemon.species} is trapped and cannot escape!`);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`You can't escape!`])}`);
				}
				// END: Trapping check

				const zoneId = battle.zoneId;
				saveBattleStatus(battle);
				activeBattles.delete(user.id);

				const runHTML = `<div class="infobox">` +
					`<h2>Got away safely!</h2>` +
					`<p>You ran away from the wild Pokemon.</p>` +
					`<p>` +
					`<button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another</button>` +
					`<button name="send" value="/rpg explore" class="button">Continue Exploring</button>` +
					`</p>` +
					`</div>`;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${runHTML}`);
			},
			
			back(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (battle) {
					// --- FIX: Call the router function with no targetSelection ---
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You returned to the battle."])}`);
				}
			},

			help() {
				this.sendReply("Battle commands: /rpg battleaction [move|switch|catchmenu|run]");
			},
		},

		heal(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot heal your Pokemon during a battle.");
			}
			const player = getPlayerData(user.id);

			for (const pokemon of player.party) {
				pokemon.hp = pokemon.maxHp;
				pokemon.status = null;
				for (const move of pokemon.moves) {
					const moveData = getMove(move.id);
					move.pp = moveData.pp || 5;
				}
			}

			// Reset any active choice locks since PP was restored
			// Note: This won't work, activeBattles is empty.
			// The lock is on the 'ActivePokemonSlot' which is destroyed.
			// This is fine.

			const healHTML = `<div class="infobox"><h2>Pokemon Healed!</h2><p>Welcome to the Pokémon Center. We've restored your Pokémon to full health.</p><p>We hope to see you again!</p><p><button name="send" value="/rpg party" class="button">View Party</button><button name="send" value="/rpg explore" class="button">Explore</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${healHTML}`);
		},

		giveitem(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot manage items during a battle.");
			const player = getPlayerData(user.id);
			const [pokemonId, itemId] = target.split(' ').map(toID);

			if (!pokemonId) {
				let html = `<div class="infobox"><h2>Give Item</h2><p>Select a Pokémon to give an item to:</p>`;
				for (const pokemon of player.party) {
					html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg giveitem ${pokemon.id}" class="button">${pokemon.species}</button> (Currently holding: ${pokemon.item ? (ITEMS_DATABASE[pokemon.item]?.name || pokemon.item) : 'None'})</div>`;
				}
				html += `<hr /><p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokémon not found in your party.");

			if (!itemId) {
				let html = `<div class="infobox"><h2>Give ${pokemon.species} an Item</h2><p>Select an item from your bag:</p>`;
				let holdableItemsFound = false;
				for (const [id, item] of player.inventory) {
					if (item.category === 'held' || item.category === 'berry') {
						html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg giveitem ${pokemon.id} ${id}" class="button">${item.name}</button> x${item.quantity}</div>`;
						holdableItemsFound = true;
					}
				}
				if (!holdableItemsFound) {
					html += `<p>You have no holdable items in your bag.</p>`;
				}
				html += `<hr /><p><button name="send" value="/rpg giveitem" class="button">Back to Pokémon</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			const item = player.inventory.get(itemId);
			if (!item || (item.category !== 'held' && item.category !== 'berry')) {
				return this.errorReply("You do not have this item or it cannot be held.");
			}

			if (pokemon.item) {
				// --- ADDED: Sticky Hold Check ---
				if (RPGAbilities.checkItemRemovalPrevention(pokemon)) {
					return this.errorReply(`${pokemon.species}'s ${pokemon.ability} prevents its item from being swapped!`);
				}
				// --- END ADDED ---
				addItemToInventory(player, pokemon.item, 1);
			}

			pokemon.item = itemId;
			removeItemFromInventory(player, itemId, 1);

			// --- FIX ---
			const tempSlot = createActivePokemonSlot(pokemon);
			const resultHTML = `<div class="infobox"><h2>Item Given</h2><p><strong>${pokemon.species}</strong> is now holding the <strong>${item.name}</strong>!</p>${generatePokemonInfoHTML(tempSlot, true, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
			// --- END FIX ---
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
		},
		
		takeitem(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot manage items during a battle.");
			const player = getPlayerData(user.id);
			const pokemonId = toID(target);

			if (!pokemonId) {
				let html = `<div class="infobox"><h2>Take Item</h2><p>Select a Pokémon to take its item:</p>`;
				for (const pokemon of player.party) {
					if (pokemon.item) {
						html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg takeitem ${pokemon.id}" class="button">${pokemon.species}</button> (Holding: ${ITEMS_DATABASE[pokemon.item]?.name || pokemon.item})</div>`;
					}
				}
				html += `<hr /><p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokémon not found in your party.");
			if (!pokemon.item) return this.errorReply(`${pokemon.species} is not holding an item.`);

			// --- ADDED: Sticky Hold Check ---
			if (RPGAbilities.checkItemRemovalPrevention(pokemon)) {
				return this.errorReply(`${pokemon.species}'s ${pokemon.ability} prevents its item from being taken!`);
			}
			// --- END ADDED ---

			const item = ITEMS_DATABASE[pokemon.item];
			addItemToInventory(player, pokemon.item, 1);
			pokemon.item = undefined;

			// --- FIX ---
			const tempSlot = createActivePokemonSlot(pokemon);
			const resultHTML = `<div class="infobox"><h2>Item Taken</h2><p>You took the <strong>${item.name}</strong> from <strong>${pokemon.species}</strong>.</p>${generatePokemonInfoHTML(tempSlot, true, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
			// --- END FIX ---
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
		},

		nickname(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot change nicknames during a battle.");
			}
			const player = getPlayerData(user.id);

			const parts = target.split(',');
			const pokemonId = parts[0]?.trim();
			const newNickname = parts.slice(1).join(',').trim();

			if (!pokemonId || !newNickname) {
				return this.errorReply("Invalid format. Usage: /rpg nickname [pokemonId], [new nickname]");
			}

			const pokemon = player.party.find(p => p.id === pokemonId);

			if (!pokemon) {
				return this.errorReply(`Pokemon with ID "${pokemonId}" not found in your party.`);
			}

			if (newNickname.length > 12) {
				return this.errorReply("Nicknames cannot be longer than 12 characters.");
			}

			const oldNickname = pokemon.nickname;
			pokemon.nickname = newNickname;

			// --- FIX ---
			const tempSlot = createActivePokemonSlot(pokemon);
			const resultHTML = `<div class="infobox"><h2>Nickname Changed!</h2><p>Changed <strong>${oldNickname}</strong>'s name to <strong>${pokemon.nickname}</strong>!</p>${generatePokemonInfoHTML(tempSlot, true, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
			// --- END FIX ---
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
		},

		help() {
			return this.parse('/help rpg');
		},
		'': 'help',
	},
};

/**
 * Renders the correct Battle UI based on the BattleState's view.
 */
function renderBattlePage(battle: BattleState, user: User): string {
	const player = getPlayerData(user.id);

	// 1. Check for battle end results first
	switch (battle.battleResult) {
	case 'win':
		// We need to clear the battle *after* generating the HTML
		activeBattles.delete(user.id);
		if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
			return generateTrainerVictoryHTML(battle.opponentName, battle.messageLog, battle.opponentMoney);
		} else {
			const defeatedNames = battle.opponentParty.map(p => p.species).join(' and ');
			return generateVictoryHTML(defeatedNames, battle.messageLog, battle.opponentMoney, battle.zoneId);
		}
	case 'loss':
		activeBattles.delete(user.id);
		return generateDefeatHTML(battle.opponentMoney, battle.opponentName);
	case 'run':
		activeBattles.delete(user.id);
		return `<div class="infobox">` +
					`<h2>Got away safely!</h2>` +
					`<p>You ran away from the wild Pokemon.</p>` +
					`<p>` +
					`<button name="send" value="/pokerpg explore" class="button">Continue Exploring</button>` +
					`</p>` +
					`</div>`;
	case 'catch':
		activeBattles.delete(user.id);
		const caughtPokemon = player.party[player.party.length - 1] || player.pc.get(Array.from(player.pc.keys()).pop()!);
		const location = player.party.length <= 6 ? "your party" : "PC";
		let successMessage = `<h2>Gotcha!</h2><p><strong>${caughtPokemon.species}</strong> was caught!</p>`;
		if (caughtPokemon.caughtIn === 'healball') successMessage += `<p>${caughtPokemon.species} was fully healed!</p>`;
		const tempSlot = createActivePokemonSlot(caughtPokemon);
		return `<div class="infobox">` + `${successMessage}` +
					`${generatePokemonInfoHTML(tempSlot, true)}` +
					`<p>${caughtPokemon.species} has been sent to ${location}.</p>` +
					`<p><button name="send" value="/pokerpg explore" class="button">Continue Exploring</button>` +
					`<button name="send" value="/pokerpg menu" class="button">Back to Menu</button></p></div>`;
	}

	// 2. If battle is pending, render the correct view
	let html = '';
	switch (battle.currentView) {
	case 'battle':
		html = generateBattleHTML(battle, battle.messageLog, undefined);
		break;
	case 'target_selection':
		html = generateBattleHTML(battle, battle.messageLog, battle.viewContext);
		break;
	case 'switch_faint':
		html = generateFaintSwitchHTML(battle, battle.messageLog.join('<br>'));
		break;
	case 'switch_pivot':
		html = generatePivotSwitchHTML(battle, battle.messageLog.join('<br>'), battle.viewContext.slotIndex);
		break;
	case 'catch_menu':
		html = generateCatchMenuHTML(player, battle);
		break;
	case 'catch_target':
		html = generateCatchTargetHTML(battle, battle.viewContext.ballId);
		break;
	case 'learn_move':
		html = generateMoveLearnHTML(player);
		break;
	default:
		html = generateBattleHTML(battle, battle.messageLog, undefined);
	}

	// 3. Clear the log after rendering
	battle.messageLog = [];
	return html;
}

/**
 * Renders the correct Menu UI based on the PlayerData's view.
 */
function renderMenuPage(player: PlayerData, user: User): string {
	// Note: We don't clear viewContext here, it's cleared by the commands that set it.
	switch (player.currentView) {
	case 'start':
		return generateWelcomeHTML();
	case 'starter_selection':
		return generateStarterSelectionHTML(player.viewContext.type);
	case 'party':
		let partyHTML = `<div class="infobox"><h2>Your Party</h2>`;
		if (player.party.length === 0) {
			partyHTML += `<p>No Pokemon in party.</p>`;
		} else {
			for (let i = 0; i < 6; i++) {
				if (player.party[i]) {
					const tempSlot = createActivePokemonSlot(player.party[i]);
					partyHTML += `<div><strong>Slot ${i + 1}:</strong><br>${generatePokemonInfoHTML(tempSlot, true, true)}</div>`;
				} else {
					partyHTML += `<p><strong>Slot ${i + 1}:</strong> Empty</p>`;
				}
			}
		}
		partyHTML += `<p style="margin-top: 15px;"><button name="send" value="/pokerpg pc" class="button">Pokemon PC</button> <button name="send" value="/pokerpg menu" class="button">Back to Menu</button></p></div>`;
		return partyHTML;
	case 'pc':
		return generatePCHTML(player);
	case 'shop':
		return generateShopHTML(player, player.viewContext?.category);
	case 'items':
		return generateInventoryHTML(player, player.viewContext?.category);
	case 'summary':
		const pokemon = player.party.find(p => p.id === player.viewContext?.pokemonId);
		if (pokemon) {
			return generatePokemonSummaryHTML(pokemon);
		}
		// Fallback if context is bad
		RPGPlayerState.getInstance(user.id).updatePlayer({ currentView: 'party', viewContext: undefined });
		return renderMenuPage(player, user); // Re-render as party
	case 'explore':
		const availableZones = Object.keys(ENCOUNTER_ZONES).filter(zoneId => zoneId.startsWith(toID(player.location)));
		let exploreButtons = '';
		if (availableZones.length > 0) {
			for (const zoneId of availableZones) {
				const zone = ENCOUNTER_ZONES[zoneId];
				const icon = zone.battleType === 'double' ? '👥' : '🛤️';
				exploreButtons += `<button name="send" value="/pokerpg wildpokemon ${zoneId}" class="button">${icon} ${zone.name}</button>`;
			}
		} else {
			exploreButtons = `<p>There's nowhere to explore here right now.</p>`;
		}
		exploreButtons += `<button name="send" value="/pokerpg challenge gym_brock" class="button">🔥 Challenge Brock</button>`;
		return `<div class="infobox">` +
				`<h2>Explore ${player.location}</h2>` +
				`<p>Choose where to go:</p>` +
				`<p>${exploreButtons}</p>` +
				`<hr />` +
				`<p>` +
				`<button name="send" value="/pokerpg shop" class="button">🏪 Poké Mart</button>` +
				`<button name="send" value="/pokerpg heal" class="button">🏥 Pokémon Center</button>` +
				`</p>` +
				`<p><button name="send" value="/pokerpg menu" class="button">Back to Menu</button></p>` +
				`</div>`;
	case 'profile':
		return `<div class="infobox"><h2>Player Profile</h2><p><strong>Trainer:</strong> ${player.name}</p><p><strong>Level:</strong> ${player.level}</p><p><strong>Badges:</strong> ${player.badges}</p><p><strong>Pokemon in Party:</strong> ${player.party.length}</p><p><strong>Money:</strong> ₽${player.money}</p><p><button name="send" value="/pokerpg menu" class="button">Back to Menu</button></p></div>`;
	case 'menu':
		default:
			return `<div class="infobox"><h2>RPG Menu - ${player.name}</h2><p><strong>Location:</strong> ${player.location} | <strong>Money:</strong> ₽${player.money}</p><p>What would you like to do?</p><p><button name="send" value="/pokerpg profile" class="button">👤 Profile</button><button name="send" value="/pokerpg party" class="button">⚡ Party</button><button name="send" value="/pokerpg wildpokemon startertown_grass" class="button">⚔️ Battle</button><button name="send" value="/pokerpg explore" class="button">🗺️ Explore</button></p><p><button name="send" value="/pokerpg pokedex" class="button">📖 Pokédex</button><button name="send" value="/pokerpg items" class="button">🎒 Items</button><button name="send" value="/pokerpg pc" class="button">💻 Pokemon PC</button></p></div>`;
	}
}

export const pages: Chat.PageTable = {
	pokerpg(args, user) {
		const battle = activeBattles.get(user.id);
		if (battle) {
			// 1. Render Battle UI
			return renderBattlePage(battle, user);
		}

		// 2. Render Menu UI
		const playerState = RPGPlayerState.getInstance(user.id);
		const player = playerState.getPlayer();
		return renderMenuPage(player, user);
	},
};
