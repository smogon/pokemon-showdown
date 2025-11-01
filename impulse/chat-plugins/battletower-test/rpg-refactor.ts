// Pokemon RPG Plugin for Pokemon Showdown
import { MANUAL_CATCH_RATES } from './MANUAL_CATCH_RATES';
import { MANUAL_BASE_EXP } from './MANUAL_BASE_EXP';
import { MANUAL_EV_YIELDS } from './MANUAL_EV_YIELDS';
import { MANUAL_EVOLUTIONS } from './MANUAL_EVOLUTIONS';
import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';

// Interface for RPG Pokemon data
interface RPGPokemon {
	species: string;
	level: number;
	hp: number;
	maxHp: number;
	atk: number;
	def: number;
	spa: number;
	spd: number;
	spe: number;
	ivs: Record<keyof Stats, number>;
	evs: Record<keyof Stats, number>;
	weightkg: number;
	heightm: number;
	friendship: number;
	growthRate: string;
	experience: number;
	expToNextLevel: number;
	moves: { id: string, pp: number }[];
	nature: string;
	status: Status | null;
	ability?: string;
	item?: string;
	id: string;
	nickname: string;
	gender: 'M' | 'F' | 'N';
	shiny: boolean;
	caughtIn: string;
	form?: string;
}

// Interface for inventory items
interface InventoryItem {
	id: string;
	name: string;
	category: 'pokeball' | 'medicine' | 'berry' | 'tm' | 'key' | 'misc' | 'held';
	description: string;
	quantity: number;
}

// NEW INTERFACE for Double Battles
// Holds a Pokemon and all its volatile, in-battle statuses
interface ActivePokemonSlot {
	pokemon: RPGPokemon;
	statStages: Record<keyof Omit<Stats, 'maxHp'> | 'accuracy' | 'evasion', number>;
	status: Status | null;
	sleepCounter: number;
	isConfused: boolean;
	confusionCounter: number;
	isProtected: boolean;
	protectSuccessCounter: number;
	willFlinch: boolean;
	isTrapped: { turns: number } | null;
	tauntTurns: number;
	isSeeded: boolean;
	hasNightmare: boolean;
	isCursed: boolean;
	chargingMove?: string;
	activeTurns: number;
	lockedMove?: string;
}

// Interface for player data
interface PlayerData {
	id: string;
	name: string;
	level: number;
	experience: number;
	badges: number;
	party: RPGPokemon[];
	location: string;
	money: number;
	inventory: Map<string, InventoryItem>;
	pc: Map<string, RPGPokemon>;
	pendingMoveLearnQueue?: {
		pokemonId: string,
		moveIds: string[],
	};
}

// Type alias for status conditions
type Status = 'psn' | 'brn' | 'par' | 'slp' | 'frz';

// Interface for battle state
interface BattleState {
	playerId: string;
	turn: number;
	zoneId: string; // Still useful for tracking location / return point
	playerHazards: string[];
	opponentHazards: string[];

	weather?: {
		type: 'sun' | 'rain' | 'sand' | 'hail',
		turns: number,
	};
	trickRoomTurns: number;
	magicRoomTurns: number;
	wonderRoomTurns: number;
	terrain?: {
		type: 'electric' | 'grassy' | 'misty' | 'psychic',
		turns: number,
	};

	// --- Fields for side-wide guards ---
	playerQuickGuard: boolean;
	opponentQuickGuard: boolean;
	playerWideGuard: boolean;
	opponentWideGuard: boolean;
	playerCraftyShield: boolean;
	opponentCraftyShield: boolean;
	playerReflectTurns: number;
	opponentReflectTurns: number;
	playerLightScreenTurns: number;
	opponentLightScreenTurns: number;
	playerAuroraVeilTurns: number;
	opponentAuroraVeilTurns: number;
	gravityTurns: number;
	mudSportTurns: number;
	waterSportTurns: number;

	forceEnd?: boolean;

	// --- NEW FIELDS FOR TRAINER BATTLES ---
	battleType: 'wild' | 'trainer' | 'wild_double' | 'trainer_double';
	opponentName: string; // e.g., "Wild Pikachu" or "Rival"
	opponentParty: RPGPokemon[];
	opponentMoney: number; // Money to win (0 for wild)
	playerShouldSwitch?: boolean | 'copyvolatile'; // For U-turn/Volt Switch (true) or Baton Pass ('copyvolatile')

	// --- NEW FIELDS FOR DOUBLE BATTLES ---
	playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null];
	opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null];

	// New field to store player/AI commands before the turn executes
	pendingActions: {
		[slotIndex: number]: { // 0, 1 for player; 2, 3 for opponent
			actionType: 'move' | 'switch';
			moveId?: string;
			targetSlot?: number; // 0-3
			switchToPokemonId?: string;
			pokemonId: string; // To track who is acting
		} | null
	};
}

// In-memory storage for player data (in production, use a database)
const playerData = new Map<string, PlayerData>();
const activeBattles = new Map<string, BattleState>();

// Item database
const ITEMS_DATABASE: Record<string, Omit<InventoryItem, 'quantity'>> = {
	// PokeBalls
	'pokeball': { id: 'pokeball', name: 'Poke Ball', category: 'pokeball', description: 'A device for catching wild Pokemon. It has a 1x catch rate.' },
	'greatball': { id: 'greatball', name: 'Great Ball', category: 'pokeball', description: 'A good, high-performance Poke Ball. It has a 1.5x catch rate.' },
	'ultraball': { id: 'ultraball', name: 'Ultra Ball', category: 'pokeball', description: 'An ultra-high performance Poke Ball. It has a 2x catch rate.' },
	'masterball': { id: 'masterball', name: 'Master Ball', category: 'pokeball', description: 'The best Poke Ball with the ultimate performance. It will catch any wild Pokemon without fail.' },
	'levelball': { id: 'levelball', name: 'Level Ball', category: 'pokeball', description: 'A Poke Ball that works well on Pokemon of a lower level than your own.' },
	'fastball': { id: 'fastball', name: 'Fast Ball', category: 'pokeball', description: 'A Poke Ball that works well on Pokemon that have a high Speed stat.' },
	'timerball': { id: 'timerball', name: 'Timer Ball', category: 'pokeball', description: 'A Poke Ball that becomes more effective the more turns that have passed in battle.' },
	'nestball': { id: 'nestball', name: 'Nest Ball', category: 'pokeball', description: 'A Poke Ball that works well on low-level Pokemon.' },
	'netball': { id: 'netball', name: 'Net Ball', category: 'pokeball', description: 'A Poke Ball that works well on Bug- or Water-type Pokemon.' },
	'quickball': { id: 'quickball', name: 'Quick Ball', category: 'pokeball', description: 'A Poke Ball that provides a high catch rate if used at the start of a wild encounter.' },
	'dreamball': { id: 'dreamball', name: 'Dream Ball', category: 'pokeball', description: 'A Poke Ball that works well on sleeping Pokemon.' },
	'premierball': { id: 'premierball', name: 'Premier Ball', category: 'pokeball', description: 'A somewhat rare Poke Ball that has been specially made to commemorate an event.' },
	'luxuryball': { id: 'luxuryball', name: 'Luxury Ball', category: 'pokeball', description: 'A comfortable Poke Ball that makes a caught wild Pokemon quickly grow friendly.' },
	'healball': { id: 'healball', name: 'Heal Ball', category: 'pokeball', description: 'A remedial Poke Ball that restores the HP of a Pokemon it catches and eliminates any status conditions.' },
	// Medicine
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
	// Music
	'eggmovetutor': { id: 'eggmovetutor', name: 'Egg Move Tutor', category: 'misc', description: 'A special item that teaches a compatible Pokémon one of its Egg Moves.' },
	// Berries & Held Items
	'oranberry': { id: 'oranberry', name: 'Oran Berry', category: 'berry', description: 'A Berry to be consumed by Pokemon. If a Pokemon holds one, it restores 10 HP.' },
	'sitrusberry': { id: 'sitrusberry', name: 'Sitrus Berry', category: 'berry', description: 'A Berry to be consumed by Pokemon. If a Pokemon holds one, it restores 1/4 of max HP.' },
	'aguavberry': { id: 'aguavberry', name: 'Aguav Berry', category: 'berry', description: 'If a Pokémon holds one, it restores 1/3 of its max HP when it drops to 1/4 or less. May cause confusion.' },
	'enigmaberry': { id: 'enigmaberry', name: 'Enigma Berry', category: 'berry', description: 'If a Pokémon holding this Berry is hit with a supereffective move, it will recover 1/4 of its max HP.' },
	'figyberry': { id: 'figyberry', name: 'Figy Berry', category: 'berry', description: 'If a Pokémon holds one, it restores 1/3 of its max HP when it drops to 1/4 or less. May cause confusion.' },
	'goldberry': { id: 'goldberry', name: 'Gold Berry', category: 'berry', description: 'A Berry to be consumed by Pokemon. If a Pokemon holds one, it restores 30 HP.' },
	'iapapaberry': { id: 'iapapaberry', name: 'Iapapa Berry', category: 'berry', description: 'If a Pokémon holds one, it restores 1/3 of its max HP when it drops to 1/4 or less. May cause confusion.' },
	'magoberry': { id: 'magoberry', name: 'Mago Berry', category: 'berry', description: 'If a Pokémon holds one, it restores 1/3 of its max HP when it drops to 1/4 or less. May cause confusion.' },
	'wikiberry': { id: 'wikiberry', name: 'Wiki Berry', category: 'berry', description: 'If a Pokémon holds one, it restores 1/3 of its max HP when it drops to 1/4 or less. May cause confusion.' },
	'berryjuice': { id: 'berryjuice', name: 'Berry Juice', category: 'held', description: 'A 100% natural juice. It restores 20 HP to a Pokémon when its HP drops to 1/2 or less.' },
	'leftovers': { id: 'leftovers', name: 'Leftovers', category: 'held', description: 'An item to be held by a Pokémon. The holder\'s HP is gradually restored during battle.' },
	'blacksludge': { id: 'blacksludge', name: 'Black Sludge', category: 'held', description: 'A held item that gradually restores the HP of Poison-type Pokémon. It damages any other type.' },
	'shellbell': { id: 'shellbell', name: 'Shell Bell', category: 'held', description: 'A held item that restores a little HP to the holder whenever it inflicts damage.' },
	'choiceband': { id: 'choiceband', name: 'Choice Band', category: 'held', description: 'Boosts Attack, but allows the use of only one move.' },
	'choicescarf': { id: 'choicescarf', name: 'Choice Scarf', category: 'held', description: 'Boosts Speed, but allows the use of only one move.' },
	'choicespecs': { id: 'choicespecs', name: 'Choice Specs', category: 'held', description: 'Boosts Special Attack, but allows the use of only one move.' },
	'lifeorb': { id: 'lifeorb', name: 'Life Orb', category: 'held', description: 'Boosts the power of moves, but the holder loses HP after attacking.' },
	'rockyhelmet': { id: 'rockyhelmet', name: 'Rocky Helmet', category: 'held', description: 'If the holder is hit by a contact move, the attacker is also damaged.' },
	'stickybarb': { id: 'stickybarb', name: 'Sticky Barb', category: 'held', description: 'Damages the holder each turn. Can be passed to others on contact.' },
	'jabocaberry': { id: 'jabocaberry', name: 'Jaboca Berry', category: 'berry', description: 'If the holder is hit by a physical move, the attacker is damaged. One-time use.' },
	'rowapberry': { id: 'rowapberry', name: 'Rowap Berry', category: 'berry', description: 'If the holder is hit by a special move, the attacker is damaged. One-time use.' },
	'flameorb': { id: 'flameorb', name: 'Flame Orb', category: 'held', description: 'A held item that will inflict a burn on the holder at the end of the turn.' },
	'toxicorb': { id: 'toxicorb', name: 'Toxic Orb', category: 'held', description: 'A held item that will badly poison the holder at the end of the turn.' },
	'liechiberry': { id: 'liechiberry', name: 'Liechi Berry', category: 'berry', description: 'A held item that raises Attack when HP is low.' },
	'ganlonberry': { id: 'ganlonberry', name: 'Ganlon Berry', category: 'berry', description: 'A held item that raises Defense when HP is low.' },
	'salacberry': { id: 'salacberry', name: 'Salac Berry', category: 'berry', description: 'A held item that raises Speed when HP is low.' },
	'petayaberry': { id: 'petayaberry', name: 'Petaya Berry', category: 'berry', description: 'A held item that raises Special Attack when HP is low.' },
	'apicotberry': { id: 'apicotberry', name: 'Apicot Berry', category: 'berry', description: 'A held item that raises Special Defense when HP is low.' },
	'starfberry': { id: 'starfberry', name: 'Starf Berry', category: 'berry', description: 'A held item that sharply raises a random stat when HP is low.' },
	'keberry': { id: 'keberry', name: 'Kee Berry', category: 'berry', description: 'If the holder is hit by a physical move, its Defense rises. One-time use.' },
	'marangaberry': { id: 'marangaberry', name: 'Maranga Berry', category: 'berry', description: 'If the holder is hit by a special move, its Special Defense rises. One-time use.' },
	'babiriberry': { id: 'babiriberry', name: 'Babiri Berry', category: 'berry', description: 'Weakens a supereffective Steel-type attack. One-time use.' },
	'chartiberry': { id: 'chartiberry', name: 'Charti Berry', category: 'berry', description: 'Weakens a supereffective Rock-type attack. One-time use.' },
	'chilanberry': { id: 'chilanberry', name: 'Chilan Berry', category: 'berry', description: 'Weakens a Normal-type attack. One-time use.' },
	'chopleberry': { id: 'chopleberry', name: 'Chople Berry', category: 'berry', description: 'Weakens a supereffective Fighting-type attack. One-time use.' },
	'cobaberry': { id: 'cobaberry', name: 'Coba Berry', category: 'berry', description: 'Weakens a supereffective Flying-type attack. One-time use.' },
	'colburberry': { id: 'colburberry', name: 'Colbur Berry', category: 'berry', description: 'Weakens a supereffective Dark-type attack. One-time use.' },
	'habanberry': { id: 'habanberry', name: 'Haban Berry', category: 'berry', description: 'Weakens a supereffective Dragon-type attack. One-time use.' },
	'kasibberry': { id: 'kasibberry', name: 'Kasib Berry', category: 'berry', description: 'Weakens a supereffective Ghost-type attack. One-time use.' },
	'kebiaberry': { id: 'kebiaberry', name: 'Kebia Berry', category: 'berry', description: 'Weakens a supereffective Poison-type attack. One-time use.' },
	'occaberry': { id: 'occaberry', name: 'Occa Berry', category: 'berry', description: 'Weakens a supereffective Fire-type attack. One-time use.' },
	'passhoberry': { id: 'passhoberry', name: 'Passho Berry', category: 'berry', description: 'Weakens a supereffective Water-type attack. One-time use.' },
	'payapaberry': { id: 'payapaberry', name: 'Payapa Berry', category: 'berry', description: 'Weakens a supereffective Psychic-type attack. One-time use.' },
	'rindoberry': { id: 'rindoberry', name: 'Rindo Berry', category: 'berry', description: 'Weakens a supereffective Grass-type attack. One-time use.' },
	'roseliberry': { id: 'roseliberry', name: 'Roseli Berry', category: 'berry', description: 'Weakens a supereffective Fairy-type attack. One-time use.' },
	'shucaberry': { id: 'shucaberry', name: 'Shuca Berry', category: 'berry', description: 'Weakens a supereffective Ground-type attack.One-time use.' },
	'tangaberry': { id: 'tangaberry', name: 'Tanga Berry', category: 'berry', description: 'Weakens a supereffective Bug-type attack. One-time use.' },
	'wacanberry': { id: 'wacanberry', name: 'Wacan Berry', category: 'berry', description: 'Weakens a supereffective Electric-type attack. One-time use.' },
	'yacheberry': { id: 'yacheberry', name: 'Yache Berry', category: 'berry', description: 'Weakens a supereffective Ice-type attack. One-time use.' },
	'heavydutyboots': { id: 'heavydutyboots', name: 'Heavy-Duty Boots', category: 'held', description: 'These boots prevent the holder from being affected by entry hazards.' },
	'focussash': { id: 'focussash', name: 'Focus Sash', category: 'held', description: 'If the holder has full HP, it survives a hit that would KO it with 1 HP. One-time use.' },
	'assaultvest': { id: 'assaultvest', name: 'Assault Vest', category: 'held', description: 'Boosts the holder\'s Sp. Def by 1.5x, but they can only select damaging moves.' },
	'eviolite': { id: 'eviolite', name: 'Eviolite', category: 'held', description: 'Boosts the Defense and Sp. Def of a Pokémon that can still evolve by 1.5x.' },
	'airballoon': { id: 'airballoon', name: 'Air Balloon', category: 'held', description: 'The holder is immune to Ground-type moves. Pops when hit.' },
	'heatrock': { id: 'heatrock', name: 'Heat Rock', category: 'held', description: 'A held item that extends the duration of Sunny Day used by the holder.' },
	'damprock': { id: 'damprock', name: 'Damp Rock', category: 'held', description: 'A held item that extends the duration of Rain Dance used by the holder.' },
	'smoothrock': { id: 'smoothrock', name: 'Smooth Rock', category: 'held', description: 'A held item that extends the duration of Sandstorm used by the holder.' },
	'icyrock': { id: 'icyrock', name: 'Icy Rock', category: 'held', description: 'A held item that extends the duration of Hail used by the holder.' },
	'expertbelt': { id: 'expertbelt', name: 'Expert Belt', category: 'held', description: 'An item to be held by a Pokémon. It boosts the power of super-effective moves.' },
	'weaknesspolicy': { id: 'weaknesspolicy', name: 'Weakness Policy', category: 'held', description: 'An item to be held by a Pokémon. Attack and Sp. Atk sharply increase if the holder is hit by a super-effective move.' },
	'lumberry': { id: 'lumberry', name: 'Lum Berry', category: 'berry', description: 'A held item that cures any status condition.' },
	'mentalherb': { id: 'mentalherb', name: 'Mental Herb', category: 'held', description: 'A held item that snaps the holder out of move-binding effects.' },
	'redcard': { id: 'redcard', name: 'Red Card', category: 'held', description: 'A held item that forces the attacker to switch out when the holder is hit by a move.' },
	'quickclaw': { id: 'quickclaw', name: 'Quick Claw', category: 'held', description: 'An item that occasionally allows the holder to move first.' },
	'mirrorherb': { id: 'mirrorherb', name: 'Mirror Herb', category: 'held', description: 'An item that copies stat boosts from the opposing Pokemon when the holder switches in.' },
	'clearamulet': { id: 'clearamulet', name: 'Clear Amulet', category: 'held', description: 'An item that prevents the holder\'s stats from being lowered by moves used by other Pokemon.' },
	'covertcloak': { id: 'covertcloak', name: 'Covert Cloak', category: 'held', description: 'An item that protects the holder from the additional effects of moves.' },
	'kingsrock': { id: 'kingsrock', name: 'King\'s Rock', category: 'held', description: 'An item that may cause the foe to flinch when the holder inflicts damage.' },
	'scopelens': { id: 'scopelens', name: 'Scope Lens', category: 'held', description: 'An item that increases the holder\'s critical hit ratio.' },
	'razorclaw': { id: 'razorclaw', name: 'Razor Claw', category: 'held', description: 'An item that increases the holder\'s critical hit ratio.' },
	'lightclay': { id: 'lightclay', name: 'Light Clay', category: 'held', description: 'An item to be held by a Pokémon. When the holder uses protective moves like Light Screen or Reflect, their effects will last longer than usual.' },
};

// Starter Pokemon data organized by type
const STARTER_POKEMON = {
	fire: ['charmander', 'cyndaquil', 'torchic', 'chimchar', 'tepig', 'fennekin', 'litten', 'scorbunny', 'fuecoco'],
	water: ['squirtle', 'totodile', 'mudkip', 'piplup', 'oshawott', 'froakie', 'popplio', 'sobble', 'quaxly'],
	grass: ['bulbasaur', 'chikorita', 'treecko', 'turtwig', 'snivy', 'chespin', 'rowlet', 'grookey', 'sprigatito'],
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
type Stats = Omit<RPGPokemon, 'species' | 'level' | 'experience' | 'moves' | 'id' | 'expToNextLevel' | 'hp' | 'ability' | 'item' | 'nature' | 'growthRate' | 'ivs' | 'evs' | 'status'>;

// Interface for defining a trainer in the database
interface TrainerSpec {
	name: string;
	party: {
		species: string;
		level: number;
		moves?: string[]; // Optional: if not provided, uses default learnset
		item?: string; // Optional: specify a held item
	}[];
	money: number; // Prize money for winning
	dialogue?: {
		start: string;
		win: string; // Dialogue if player wins
		lose: string; // Dialogue if opponent wins
	};
	battleType?: 'single' | 'double'; // <-- NEW FIELD
}

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

function getPlayerData(userid: string): PlayerData {
	if (!playerData.has(userid)) {
		const newPlayer: PlayerData = { id: userid, name: userid, level: 1, experience: 0, badges: 0, party: [], location: 'Starter Town', money: 5000000, inventory: new Map(), pc: new Map() };
		addItemToInventory(newPlayer, 'pokeball', 5);
		addItemToInventory(newPlayer, 'potion', 3);
		playerData.set(userid, newPlayer);
	}
	return playerData.get(userid)!;
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

function createPokemon(speciesId: string, level = 5): RPGPokemon {
	const species = Dex.species.get(speciesId);
	if (!species.exists) throw new Error('Pokemon ' + speciesId + ' not found');

	// Determine Gender
	let gender: 'M' | 'F' | 'N' = 'N';
	if (species.genderRatio) {
		gender = Math.random() < species.genderRatio.M ? 'M' : 'F';
	} else if (species.gender === 'M' || species.gender === 'F' || species.gender === 'N') {
		gender = species.gender;
	}

	const randomNature = NATURE_LIST[Math.floor(Math.random() * NATURE_LIST.length)];
	const ivs = { hp: Math.floor(Math.random() * 32), atk: Math.floor(Math.random() * 32), def: Math.floor(Math.random() * 32), spa: Math.floor(Math.random() * 32), spd: Math.floor(Math.random() * 32), spe: Math.floor(Math.random() * 32) };
	const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	const stats = calculateStats(species, level, randomNature, ivs, evs);
	let availableMoves: string[] = ['tackle', 'growl'];
	const manualLearnset = MANUAL_LEARNSETS[toID(speciesId)];

	if (manualLearnset?.levelup) {
		const learnedMoves: string[] = [];
		for (const learnableMove of manualLearnset.levelup) {
			if (learnableMove.level <= level) {
				learnedMoves.push(toID(learnableMove.move));
			}
		}
		if (learnedMoves.length > 0) availableMoves = [...new Set(learnedMoves)].slice(-4);
	} else {
		try {
			const learnset = species.learnset;
			if (learnset) {
				const learnedMoves: { move: string, level: number }[] = [];
				for (const moveId in learnset) {
					// @ts-ignore - PS learnset format can be complex
					for (const learnMethod of learnset[moveId]) {
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
		}
	}

	const movesWithPP = availableMoves.map(moveId => {
		const moveData = Dex.moves.get(moveId);
		return { id: moveId, pp: moveData.pp || 5 };
	});

	let heldItem: string | undefined = undefined;
	const possibleItems = ['oranberry', 'sitrusberry', 'leftovers', 'rockyhelmet', 'chopleberry', 'yacheberry', 'keberry', 'marangaberry', 'stickybarb', 'toxicorb'];
	if (Math.random() < 0.1) {
		heldItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
	}

	const abilities = Object.values(species.abilities);
	const randomAbility = abilities.length ? abilities[Math.floor(Math.random() * abilities.length)] : 'No Ability';
	const growthRate = species.growthRate;
	return {
		species: species.name,
		nickname: species.name, // Defaults to species name
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
		caughtIn: 'pokeball', // Default for starters/gifts, will be overwritten for wild catches
		form: species.forme,
		...stats,
	};
}

function storePokemonInPC(player: PlayerData, pokemon: RPGPokemon): void {
	player.pc.set(pokemon.id, pokemon);
}

function withdrawPokemonFromPC(player: PlayerData, pokemonId: string): RPGPokemon | null {
	const pokemon = player.pc.get(pokemonId);
	if (pokemon) {
		player.pc.delete(pokemonId);
		return pokemon;
	}
	return null;
}

function getBallBonus(ballId: string, battle: BattleState): number {
	const { opponentActivePokemon, activePokemon, turn, opponentStatus } = battle;
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

function performCatchAttempt(battle: BattleState, ballId: string): { success: boolean, shakes: number } {
	const { opponentActivePokemon, opponentStatus } = battle;
	const speciesId = toID(opponentActivePokemon.species);
	const catchRate = MANUAL_CATCH_RATES[speciesId] || 45;

	const ballBonus = getBallBonus(ballId, battle);
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

function getCriticalHitChance(attackerSlot: ActivePokemonSlot, move: Move, battle: BattleState): number {
	let critStage = 0;
	const attacker = attackerSlot.pokemon;

	// Base critical hit stages for certain moves
	if (['slash', 'razorleaf', 'crabhammer', 'karatechop', 'attackorder', 'blazekick', 'crosschop', 'crosspoison', 'nightslash', 'poisontail', 'psychocut', 'shadowclaw', 'spacialrend', 'stoneedge'].includes(move.id)) {
		critStage += 1;
	}

	// Scope Lens and Razor Claw boost
	if (battle.magicRoomTurns === 0 && (attacker.item === 'scopelens' || attacker.item === 'razorclaw')) {
		critStage += 1;
	}

	// Critical hit chances by stage
	const critChances = [1 / 24, 1 / 8, 1 / 2, 1 / 1]; // stages 0, 1, 2, 3+
	return critChances[Math.min(critStage, 3)];
}

function calculateDamage(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	moveId: string,
	battle: BattleState
): { damage: number, message: string, effectiveness: number, berryConsumed?: string } {
	const move = Dex.moves.get(moveId);
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;
	const attackerStages = attackerSlot.statStages;
	const defenderStages = defenderSlot.statStages;
	const attackerStatus = attackerSlot.status;

	let moveType = move.type; // Use a mutable variable for type-changing moves
	const attackerSpecies = Dex.species.get(attacker.species);
	const defenderSpecies = Dex.species.get(defender.species);

	// --- Ability/Type Immunities Check ---
	if (move.flags.sound && defender.ability === 'Soundproof') {
		return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species}'s Soundproof blocks the move!</i>`, effectiveness: 0 };
	}
	if (move.flags.powder) {
		if (defenderSpecies.types.includes('Grass')) {
			return { damage: 0, message: ` <i style="color: #6c757d;">Grass-types are immune to powder moves!</i>`, effectiveness: 0 };
		}
		if (defender.ability === 'Overcoat') {
			return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species}'s Overcoat blocks the move!</i>`, effectiveness: 0 };
		}
	}

	if (!move.basePower) {
		if (moveId === 'dragonrage') return { damage: 40, message: '', effectiveness: 1 };
		return { damage: 0, message: ` <i style="color: #6c757d;">But it had no effect!</i>`, effectiveness: 1 };
	}

	let basePower = move.basePower;

	// --- Power modification for hitting semi-invulnerable targets ---
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

	// Handle Variable Power moves
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
		const attackerSpe = attacker.spe * getStatMultiplier(attackerStages.spe);
		const defenderSpe = defender.spe * getStatMultiplier(defenderStages.spe);
		if (defenderSpe > 0) {
			basePower = Math.min(150, Math.floor(25 * (defenderSpe / attackerSpe)) + 1);
		} else {
			basePower = 1;
		}
		break;

	case 'storedpower':
	case 'powertrip':
		let totalBoosts = 0;
		for (const stat in attackerStages) {
			if (attackerStages[stat as keyof typeof attackerStages] > 0) {
				totalBoosts += attackerStages[stat as keyof typeof attackerStages];
			}
		}
		basePower = 20 + (20 * totalBoosts);
		break;
		
	case 'acrobatics':
		if (!attacker.item || battle.magicRoomTurns > 0) {
			basePower *= 2;
		}
		break;
	}

	// --- Context-Dependent Power Modifications ---
	if (move.id === 'facade' && attackerStatus && ['psn', 'brn', 'par'].includes(attackerStatus)) {
		basePower *= 2;
	}
	if (move.id === 'brine' && defender.hp <= defender.maxHp / 2) {
		basePower *= 2;
	}
	const defenderStatus = defenderSlot.status;
	if (move.id === 'venoshock' && defenderStatus === 'psn') {
		basePower *= 2;
	}
	if (move.id === 'weatherball' && battle.weather) {
		basePower *= 2;
	}
	if (move.id === 'terrainpulse' && battle.terrain && isGrounded(attacker, battle)) {
		basePower *= 2;
	}
	
	if (['solarbeam', 'solarblade'].includes(move.id) && battle.weather) {
		if (['rain', 'sand', 'hail'].includes(battle.weather.type)) {
			basePower = Math.floor(basePower * 0.5);
		}
	}

	// --- Type-Changing Moves ---
	if (move.id === 'weatherball' && battle.weather) {
		switch (battle.weather.type) {
		case 'sun': moveType = 'Fire'; break;
		case 'rain': moveType = 'Water'; break;
		case 'sand': moveType = 'Rock'; break;
		case 'hail': moveType = 'Ice'; break;
		}
	}
	if (move.id === 'terrainpulse' && battle.terrain && isGrounded(attacker, battle)) {
		switch (battle.terrain.type) {
		case 'electric': moveType = 'Electric'; break;
		case 'grassy': moveType = 'Grass'; break;
		case 'psychic': moveType = 'Psychic'; break;
		case 'misty': moveType = 'Fairy'; break;
		}
	}

	// --- Move-specific Power Boosts ---
	if (move.id === 'knockoff' && defender.item) {
		basePower = Math.floor(basePower * 1.5);
	}

	// --- Ability Power Boosts ---
	if (attacker.ability === 'Iron Fist' && move.flags.punch) {
		basePower = Math.floor(basePower * 1.2);
	}
	if (attacker.ability === 'Strong Jaw' && move.flags.bite) {
		basePower = Math.floor(basePower * 1.5);
	}
	if (attacker.ability === 'Mega Launcher' && move.flags.pulse) {
		basePower = Math.floor(basePower * 1.5);
	}

	let attackStatRaw = move.category === 'Special' ? attacker.spa : attacker.atk;
	let defenseStatRaw = move.category === 'Special' ? defender.spd : defender.def;

	if (battle.wonderRoomTurns > 0) {
		defenseStatRaw = move.category === 'Special' ? defender.def : defender.spd;
	}

	if (battle.magicRoomTurns === 0 && defender.item === 'assaultvest' && move.category === 'Special') {
		defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
	}

	if (battle.magicRoomTurns === 0 && defender.item === 'eviolite') {
		const defenderId = toID(defender.species);
		const species = Dex.species.get(defenderId);
		if (species.evos && species.evos.length > 0) {
			defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
			if (battle.wonderRoomTurns > 0 && move.category === 'Physical') {
				const originalSpDef = defender.spd;
				defenseStatRaw = Math.floor(originalSpDef * 1.5);
			}
		}
	}

	if (battle.magicRoomTurns === 0 && attacker.item === 'choiceband' && move.category === 'Physical') {
		attackStatRaw = Math.floor(attackStatRaw * 1.5);
	}
	if (battle.magicRoomTurns === 0 && attacker.item === 'choicespecs' && move.category === 'Special') {
		attackStatRaw = Math.floor(attackStatRaw * 1.5);
	}

	const attackStage = move.category === 'Special' ? attackerStages.spa : attackerStages.atk;
	const defenseStage = battle.wonderRoomTurns > 0 ?
		(move.category === 'Special' ? defenderStages.def : defenderStages.spd) :
		(move.category === 'Special' ? defenderStages.spd : defenderStages.def);

	const attackStat = Math.floor(attackStatRaw * getStatMultiplier(attackStage));
	const defenseStat = Math.floor(defenseStatRaw * getStatMultiplier(defenseStage));

	let finalAttackStat = attackStat;
	if (attackerStatus === 'brn' && move.category === 'Physical' && move.id !== 'facade') {
		finalAttackStat = Math.floor(finalAttackStat / 2);
	}

	// --- Self-Destruct Defense Halving ---
	let finalDefenseStat = defenseStat;
	if (['explosion', 'selfdestruct'].includes(move.id)) {
		finalDefenseStat = Math.floor(finalDefenseStat * 0.5);
	}

	const isCritical = Math.random() < getCriticalHitChance(attackerSlot, move, battle);
	const criticalMultiplier = isCritical ? 1.5 : 1;
	const isStab = attackerSpecies.types.includes(moveType);
	const stabMultiplier = isStab ? 1.5 : 1;
	const randomMultiplier = Math.floor(Math.random() * 16 + 85) / 100;
	let baseDamage = Math.floor((((2 * attacker.level / 5 + 2) * basePower * (finalAttackStat / finalDefenseStat)) / 50) + 2);
	const effectiveness = getCustomEffectiveness(moveType, defenderSpecies.types, defender, battle);
	let berryConsumed: string | undefined = undefined;
	let effectivenessMultiplier = effectiveness;

	if (battle.magicRoomTurns === 0 && defender.item && TYPE_RESIST_BERRIES[defender.item]) {
		const resistedType = TYPE_RESIST_BERRIES[defender.item];
		if (moveType === resistedType && effectiveness > 1) {
			effectivenessMultiplier = effectiveness / 2;
			berryConsumed = defender.item;
		}
	}

	// --- Screen Damage Reduction Check ---
	const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);
	if (!isCritical) { // Critical hits bypass screens
		const defenderVeilTurns = isDefenderPlayer ? battle.playerAuroraVeilTurns : battle.opponentAuroraVeilTurns;

		if (defenderVeilTurns > 0) {
			baseDamage = Math.floor(baseDamage * 0.5);
		} else {
			if (move.category === 'Physical') {
				const defenderReflectTurns = isDefenderPlayer ? battle.playerReflectTurns : battle.opponentReflectTurns;
				if (defenderReflectTurns > 0) {
					baseDamage = Math.floor(baseDamage * 0.5);
				}
			} else if (move.category === 'Special') {
				const defenderLightScreenTurns = isDefenderPlayer ? battle.playerLightScreenTurns : battle.opponentLightScreenTurns;
				if (defenderLightScreenTurns > 0) {
					baseDamage = Math.floor(baseDamage * 0.5);
				}
			}
		}
	}
	// --- SPREAD MOVE DAMAGE REDUCTION (TBD) ---
	// if (move.target === 'allAdjacentFoes' && numTargets > 1) {
	// 	baseDamage = Math.floor(baseDamage * 0.75);
	// }

	if (battle.weather) {
		if (battle.weather.type === 'sun') {
			if (moveType === 'Fire') baseDamage = Math.floor(baseDamage * 1.5);
			if (moveType === 'Water') baseDamage = Math.floor(baseDamage * 0.5);
		} else if (battle.weather.type === 'rain') {
			if (moveType === 'Water') baseDamage = Math.floor(baseDamage * 1.5);
			if (moveType === 'Fire') baseDamage = Math.floor(baseDamage * 0.5);
		}
	}

	if (battle.terrain) {
		const attackerIsGrounded = isGrounded(attacker, battle);
		const defenderIsGrounded = isGrounded(defender, battle);

		if (battle.terrain.type === 'electric' && moveType === 'Electric' && attackerIsGrounded) {
			baseDamage = Math.floor(baseDamage * 1.3);
		} else if (battle.terrain.type === 'grassy' && moveType === 'Grass' && attackerIsGrounded) {
			baseDamage = Math.floor(baseDamage * 1.3);
		} else if (battle.terrain.type === 'psychic' && moveType === 'Psychic' && attackerIsGrounded) {
			baseDamage = Math.floor(baseDamage * 1.3);
		}

		if (battle.terrain.type === 'misty' && moveType === 'Dragon' && defenderIsGrounded) {
			baseDamage = Math.floor(baseDamage * 0.5);
		} else if (battle.terrain.type === 'grassy' && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id) && defenderIsGrounded) {
			baseDamage = Math.floor(baseDamage * 0.5);
		}
	}

	// --- Mud/Water Sport Damage Reduction ---
	if (battle.mudSportTurns > 0 && moveType === 'Electric') {
		baseDamage = Math.floor(baseDamage * 0.33);
	}
	if (battle.waterSportTurns > 0 && moveType === 'Fire') {
		baseDamage = Math.floor(baseDamage * 0.33);
	}

	let damage = Math.floor(baseDamage * stabMultiplier * effectivenessMultiplier * criticalMultiplier * randomMultiplier);

	if (battle.magicRoomTurns === 0 && attacker.item === 'lifeorb') {
		damage = Math.floor(damage * 1.3);
	}

	if (battle.magicRoomTurns === 0 && attacker.item === 'expertbelt' && effectiveness > 1) {
		damage = Math.floor(damage * 1.2);
	}

	damage = Math.max(1, damage);

	let message = "";
	if (isCritical) message += ` <i style="color: #28a745;">A critical hit!</i>`;
	if (effectiveness > 1) message += ` <i style="color: #28a745;">It's super effective!</i>`;
	if (effectiveness < 1 && effectiveness > 0) message += ` <i style="color: #d9534f;">It's not very effective...</i>`;
	if (effectiveness === 0) message = ` <i style="color: #6c757d;">It had no effect on ${defender.species}!</i>`;

	return { damage, message, effectiveness, berryConsumed };
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
			const moveData = Dex.moves.get(moveId);
			return !pokemon.moves.some(m => m.id === moveId);
		});

	if (movesLearnedAtThisLevel.length === 0) return { messages };

	const openMoveSlots = 4 - pokemon.moves.length;
	const movesToQueue: string[] = [];

	if (openMoveSlots > 0) {
		const movesToAutoLearn = movesLearnedAtThisLevel.slice(0, openMoveSlots);
		for (const moveId of movesToAutoLearn) {
			const moveData = Dex.moves.get(moveId);
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
	const evYield = MANUAL_EV_YIELDS[defeatedSpeciesId];
	if (!evYield) return;
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
	room: ChatRoom,
	user: User
): { messages: string[], leveledUp: boolean } {
	const defeatedSpeciesId = toID(defeatedPokemon.species);
	const baseExp = MANUAL_BASE_EXP[defeatedSpeciesId];
	if (!baseExp) return { messages: ['No experience was gained.'], leveledUp: false };

	const expGained = Math.floor((baseExp * defeatedPokemon.level) / 7);
	if (expGained <= 0) return { messages: [`No Experience Points were gained.`], leveledUp: false };

	let leveledUp = false;
	const messages: string[] = [];
	
	const participantNames: string[] = [];

	// 1. Distribute EVs and EXP
	for (const slot of participantSlots) {
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0 || pokemon.level >= 100) continue; // Fainted or max level
		
		participantNames.push(pokemon.species);
		gainEffortValues(pokemon, defeatedPokemon);
		pokemon.experience += expGained;
	}
	
	if (participantNames.length === 0) return { messages: [], leveledUp: false };
	
	messages.push(`**${participantNames.join(' and ')}** gained ${expGained} Experience Points!`);

	// 2. Handle Level-Ups for all participants
	for (const slot of participantSlots) {
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0 || pokemon.level >= 100) continue;

		while (pokemon.experience >= pokemon.expToNextLevel && pokemon.level < 100) {
			messages.push(...levelUp(pokemon));
			leveledUp = true;
			const evolveMessage = checkEvolution(player, pokemon, room, user);
			if (evolveMessage) {
				messages.push(evolveMessage);
				// Stop leveling this Pokemon if it evolved, as its stats/exp curve changed
				break;
			}
			const { messages: newMoveMessages } = handleLearningMoves(player, pokemon);
			messages.push(...newMoveMessages);
		}
	}

	return { messages, leveledUp };
}

function checkEvolution(player: PlayerData, pokemon: RPGPokemon, room: ChatRoom, user: User): string | null {
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
	room.add(`|c|~RPG Bot|What?! ${user.name}'s ${oldSpeciesName} is evolving!`).update();
	return evoMessage;
}

function saveBattleStatus(battle: BattleState) {
	const player = getPlayerData(battle.playerId);
	const pokemonInParty = player.party.find(p => p.id === battle.activePokemon.id);

	if (pokemonInParty) {
		pokemonInParty.hp = battle.activePokemon.hp;
		pokemonInParty.item = battle.activePokemon.item;
		if (battle.playerStatus === 'slp' || battle.playerStatus === 'frz') {
			pokemonInParty.status = null;
		} else {
			pokemonInParty.status = battle.playerStatus;
		}
		for (const battleMove of battle.activePokemon.moves) {
			const partyMove = pokemonInParty.moves.find(m => m.id === battleMove.id);
			if (partyMove) {
				partyMove.pp = battleMove.pp;
			}
		}
	}
	
	// Opponent's status (if trainer) is also saved back to the battle's party array
	if (battle.battleType === 'trainer') {
		const opponentPokemonInParty = battle.opponentParty.find(p => p.id === battle.opponentActivePokemon.id);
		if (opponentPokemonInParty) {
			opponentPokemonInParty.hp = battle.opponentActivePokemon.hp;
			opponentPokemonInParty.item = battle.opponentActivePokemon.item;
			opponentPokemonInParty.status = battle.opponentStatus;
			for (const battleMove of battle.opponentActivePokemon.moves) {
				const partyMove = opponentPokemonInParty.moves.find(m => m.id === battleMove.id);
				if (partyMove) {
					partyMove.pp = battleMove.pp;
				}
			}
		}
	}
}

/**********************
* Battle Logic Helpers
**********************/
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
			messageLog.push(`It hurt itself in its confusion!`);
			const selfDamage = Math.floor((((2 * attacker.level / 5 + 2) * 40 * (attacker.atk / attacker.def)) / 50) + 2);
			attacker.hp = Math.max(0, attacker.hp - selfDamage);
			messageLog.push(`${attacker.species} took ${selfDamage} damage!`);
			return false; // Turn ends after self-damage
		}
	}

	// Check for Paralysis
	if (attackerSlot.status === 'par' && Math.random() < 0.25) {
		messageLog.push(`${attacker.species} is fully paralyzed!`);
		return false;
	}

	return true; // Can move
}

/**
 * Processes end-of-turn effects like status damage, item healing/damage, and volatile statuses.
 */

function handleEndOfTurnEffects(pokemon: RPGPokemon, battle: BattleState, messageLog: string[]) {
	if (pokemon.hp <= 0) return;

	const isPlayer = pokemon.id === battle.activePokemon.id;
	let status = isPlayer ? battle.playerStatus : battle.opponentStatus;
	const speciesData = Dex.species.get(pokemon.species);

	if (!status && battle.magicRoomTurns === 0) {
		if (pokemon.item === 'flameorb' && !speciesData.types.includes('Fire')) {
			if (isPlayer) battle.playerStatus = 'brn'; else battle.opponentStatus = 'brn';
			messageLog.push(`<span style="color: #F08030;"><strong>${pokemon.species}</strong> was burned by its Flame Orb!</span>`);
			status = 'brn';
		} else if (pokemon.item === 'toxicorb' && !speciesData.types.includes('Poison') && !speciesData.types.includes('Steel')) {
			if (isPlayer) battle.playerStatus = 'psn'; else battle.opponentStatus = 'psn';
			messageLog.push(`<span style="color: #A040A0;"><strong>${pokemon.species}</strong> was badly poisoned by its Toxic Orb!</span>`);
			status = 'psn';
		}
	}

	if (battle.magicRoomTurns === 0 && pokemon.item === 'lumberry' && status) {
		if (isPlayer) battle.playerStatus = null; else battle.opponentStatus = null;
		messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> ate its <strong>Lum Berry</strong> and cured its status condition!</span>`);
		pokemon.item = undefined;
		return;
	}

	if (status === 'brn') {
		const damage = Math.max(1, Math.floor(pokemon.maxHp / 16));
		pokemon.hp = Math.max(0, pokemon.hp - damage);
		messageLog.push(`<span style="color: #F08030;"><strong>${pokemon.species}</strong> was hurt by its burn!</span>`);
		if (pokemon.hp <= 0) return;
	} else if (status === 'psn') {
		const damage = Math.max(1, Math.floor(pokemon.maxHp / 8));
		pokemon.hp = Math.max(0, pokemon.hp - damage);
		messageLog.push(`<span style="color: #A040A0;"><strong>${pokemon.species}</strong> was hurt by its poison!</span>`);
		if (pokemon.hp <= 0) return;
	}

	if (battle.magicRoomTurns === 0) {
		if (pokemon.item === 'leftovers' && pokemon.hp < pokemon.maxHp) {
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + Math.max(1, Math.floor(pokemon.maxHp / 16)));
			messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> restored a little HP using its <strong>Leftovers</strong>!</span>`);
		} else if (pokemon.item === 'blacksludge') {
			if (speciesData.types.includes('Poison')) {
				if (pokemon.hp < pokemon.maxHp) {
					pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + Math.max(1, Math.floor(pokemon.maxHp / 16)));
					messageLog.push(`<span style="color: #28a745;"><strong>${pokemon.species}</strong> restored a little HP using its <strong>Black Sludge</strong>!</span>`);
				}
			} else {
				pokemon.hp = Math.max(0, pokemon.hp - Math.max(1, Math.floor(pokemon.maxHp / 8)));
				messageLog.push(`<span style="color: #d9534f;"><strong>${pokemon.species}</strong> was hurt by its <strong>Black Sludge</strong>!</span>`);
			}
		} else if (pokemon.item === 'stickybarb') {
			pokemon.hp = Math.max(0, pokemon.hp - Math.floor(pokemon.maxHp / 8));
			messageLog.push(`<span style="color: #d9534f;"><strong>${pokemon.species}</strong> was hurt by its <strong>Sticky Barb</strong>!</span>`);
		}
	}
	if (pokemon.hp <= 0) return;

	if (isPlayer) {
		if (battle.playerIsCursed) {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 4));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`${pokemon.species} is afflicted by the curse!`);
		}
	} else {
		if (battle.opponentIsCursed) {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 4));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`${pokemon.species} is afflicted by the curse!`);
		}
	}
	if (pokemon.hp <= 0) return;

	if (isPlayer) {
		if (battle.playerHasNightmare) {
			if (battle.playerStatus === 'slp') {
				const damage = Math.max(1, Math.floor(pokemon.maxHp / 4));
				pokemon.hp = Math.max(0, pokemon.hp - damage);
				messageLog.push(`${pokemon.species} is locked in a nightmare!`);
			} else {
				battle.playerHasNightmare = false;
			}
		}
	} else {
		if (battle.opponentHasNightmare) {
			if (battle.opponentStatus === 'slp') {
				const damage = Math.max(1, Math.floor(pokemon.maxHp / 4));
				pokemon.hp = Math.max(0, pokemon.hp - damage);
				messageLog.push(`${pokemon.species} is locked in a nightmare!`);
			} else {
				battle.opponentHasNightmare = false;
			}
		}
	}
	if (pokemon.hp <= 0) return;

	if (isPlayer) {
		if (battle.playerIsTrapped) {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`${pokemon.species} is hurt by the trap!`);
			battle.playerIsTrapped.turns--;
			if (battle.playerIsTrapped.turns <= 0) {
				battle.playerIsTrapped = null;
				messageLog.push(`${pokemon.species} was freed from the trap.`);
			}
		}
		if (battle.playerTauntTurns > 0) {
			battle.playerTauntTurns--;
			if (battle.playerTauntTurns <= 0) {
				messageLog.push(`${pokemon.species}'s taunt wore off.`);
			}
		}
	} else {
		if (battle.opponentIsTrapped) {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`${pokemon.species} is hurt by the trap!`);
			battle.opponentIsTrapped.turns--;
			if (battle.opponentIsTrapped.turns <= 0) {
				battle.opponentIsTrapped = null;
				messageLog.push(`${pokemon.species} was freed from the trap.`);
			}
		}
		if (battle.opponentTauntTurns > 0) {
			battle.opponentTauntTurns--;
			if (battle.opponentTauntTurns <= 0) {
				messageLog.push(`${pokemon.species}'s taunt wore off.`);
			}
		}
	}
	if (pokemon.hp <= 0) return;

	if (isPlayer) {
		if (battle.playerIsSeeded && pokemon.hp > 0) {
			const drainAmount = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.max(0, pokemon.hp - drainAmount);
			messageLog.push(`${pokemon.species}'s health was sapped by Leech Seed!`);

			const opponent = battle.opponentActivePokemon;
			if (opponent.hp > 0) {
				const oldHp = opponent.hp;
				opponent.hp = Math.min(opponent.maxHp, opponent.hp + drainAmount);
				messageLog.push(`${opponent.species} restored ${opponent.hp - oldHp} HP!`);
			}
		}
	} else {
		if (battle.opponentIsSeeded && pokemon.hp > 0) {
			const drainAmount = Math.max(1, Math.floor(pokemon.maxHp / 8));
			pokemon.hp = Math.max(0, pokemon.hp - drainAmount);
			messageLog.push(`${pokemon.species}'s health was sapped by Leech Seed!`);

			const opponent = battle.activePokemon;
			if (opponent.hp > 0) {
				const oldHp = opponent.hp;
				opponent.hp = Math.min(opponent.maxHp, opponent.hp + drainAmount);
				messageLog.push(`${opponent.species} restored ${opponent.hp - oldHp} HP!`);
			}
		}
	}
}

/**
 * Applies all entry hazard effects to a Pokémon switching in.
 * Handles damage, status, and stat changes from Spikes, Toxic Spikes, Stealth Rock, and Sticky Web.
 * Also handles hazard removal effects (e.g., Poison-type absorbing Toxic Spikes).
 * @returns {boolean} Returns true if the Pokémon fainted from hazard damage.
 */

function applyHazardEffectsOnSwitchIn(pokemon: RPGPokemon, battle: BattleState, isPlayerSwitchIn: boolean, messageLog: string[]): boolean {
	// Heavy-Duty Boots provides total immunity to all entry hazards.
	if (battle.magicRoomTurns === 0 && pokemon.item === 'heavydutyboots') {
		return false;
	}

	const hazards = isPlayerSwitchIn ? battle.playerHazards : battle.opponentHazards;
	if (hazards.length === 0) return false; // No hazards, no effect.

	const species = Dex.species.get(pokemon.species);
	const hasAirBalloon = battle.magicRoomTurns === 0 && pokemon.item === 'airballoon';
	const isGrounded = !(species.types.includes('Flying') || pokemon.ability === 'Levitate' || hasAirBalloon);

	let totalDamage = 0;
	let airBalloonPopped = false;

	// --- Effects that don't do direct damage (run first) ---
	if (isGrounded) {
		// Sticky Web lowers Speed
		if (hazards.includes('stickyweb')) {
			const targetStages = isPlayerSwitchIn ? battle.playerStatStages : battle.opponentStatStages;
			if (targetStages.spe > -6) {
				targetStages.spe--;
				messageLog.push(`${pokemon.species}'s Speed was lowered by the sticky web!`);
			}
		}

		// Toxic Spikes poisons or badly poisons
		const toxicSpikeLayers = hazards.filter(h => h === 'toxicspikes').length;
		if (toxicSpikeLayers > 0) {
			// Poison-type Pokémon absorb and remove Toxic Spikes from their side of the field.
			if (species.types.includes('Poison')) {
				if (isPlayerSwitchIn) {
					battle.playerHazards = battle.playerHazards.filter(h => h !== 'toxicspikes');
				} else {
					battle.opponentHazards = battle.opponentHazards.filter(h => h !== 'toxicspikes');
				}
				messageLog.push(`The Toxic Spikes were absorbed by ${pokemon.species}!`);
			} else {
				const isImmune = species.types.includes('Steel');
				const targetStatus = isPlayerSwitchIn ? battle.playerStatus : battle.opponentStatus;

				if (!isImmune && !targetStatus) {
					const newStatus: Status = 'psn';
					if (isPlayerSwitchIn) {
						battle.playerStatus = newStatus;
					} else {
						battle.opponentStatus = newStatus;
					}
					messageLog.push(`${pokemon.species} was poisoned by the Toxic Spikes!`);
				}
			}
		}
	}

	// --- Damage-dealing hazards ---
	// Spikes (max 3 layers) - only affect grounded Pokemon
	if (isGrounded) {
		const spikeLayers = hazards.filter(h => h === 'spikes').length;
		if (spikeLayers > 0) {
			const damageFraction = [0, 1 / 8, 1 / 6, 1 / 4][spikeLayers];
			totalDamage += Math.floor(pokemon.maxHp * damageFraction);
		}
	}

	// Stealth Rock - affects all Pokemon, but Air Balloon pops from it
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

	return false; // Pokémon survived
}

function handleMirrorHerb(pokemon: RPGPokemon, battle: BattleState, messageLog: string[]): void {
	if (battle.magicRoomTurns > 0 || pokemon.item !== 'mirrorherb') return;

	const isPlayer = pokemon.id === battle.activePokemon.id;
	const playerStages = battle.playerStatStages;
	const opponentStages = battle.opponentStatStages;
	const sourceStages = isPlayer ? opponentStages : playerStages;
	const myStages = isPlayer ? playerStages : opponentStages;

	let copiedAny = false;
	const stats = ['atk', 'def', 'spa', 'spd', 'spe'] as const;

	for (const stat of stats) {
		if (sourceStages[stat] > 0) {
			myStages[stat] = Math.min(6, myStages[stat] + sourceStages[stat]);
			copiedAny = true;
		}
	}

	if (copiedAny) {
		messageLog.push(`${pokemon.species}'s Mirror Herb copied the opponent's stat boosts!`);
		pokemon.item = undefined; // Consumed after use
	}
}

function handleStatusMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
) {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;
	const isPlayerAttacker = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);
	const defenderSpecies = Dex.species.get(defender.species);
	let hadEffect = false;

	// Handle forced switching moves first
	if (['roar', 'whirlwind'].includes(move.id)) {
		// --- MODIFIED ---
		if (battle.battleType === 'wild' || battle.battleType === 'wild_double') {
			messageLog.push(`The wild ${defender.species} was blown away!`);
			// TODO: This needs to remove the slot and end the battle if all wild-side slots are empty
			// For now, we'll just set the forceEnd flag
			battle.forceEnd = true;
		} else {
			messageLog.push(`But it failed!`); // Can't force switch a trainer
		}
		return;
	}

	// Handle Protect and Detect
	if (['protect', 'detect'].includes(move.id)) {
		const successCounter = attackerSlot.protectSuccessCounter;
		const successChance = 1 / 3 ** successCounter;

		if (Math.random() < successChance) {
			attackerSlot.isProtected = true;
			attackerSlot.protectSuccessCounter++;
			messageLog.push(`${attacker.species} protected itself!`);
		} else {
			messageLog.push(`But it failed!`);
		}
		return;
	}

	// Handle Guarding Moves
	if (['quickguard', 'wideguard', 'craftyshield'].includes(move.id)) {
		let guardSet = false;
		if (isPlayerAttacker) {
			if (move.id === 'quickguard') { battle.playerQuickGuard = true; guardSet = true; }
			if (move.id === 'wideguard') { battle.playerWideGuard = true; guardSet = true; }
			if (move.id === 'craftyshield') { battle.playerCraftyShield = true; guardSet = true; }
		} else {
			if (move.id === 'quickguard') { battle.opponentQuickGuard = true; guardSet = true; }
			if (move.id === 'wideguard') { battle.opponentWideGuard = true; guardSet = true; }
			if (move.id === 'craftyshield') { battle.opponentCraftyShield = true; guardSet = true; }
		}
		
		if (guardSet) {
			messageLog.push(`${attacker.species} is protecting its side!`);
		} else {
			messageLog.push(`But it failed!`);
		}
		return;
	}

	// Handle Screen Moves
	if (['reflect', 'lightscreen', 'auroraveil'].includes(move.id)) {
		const duration = (battle.magicRoomTurns === 0 && attacker.item === 'lightclay') ? 8 : 5;
		if (isPlayerAttacker) {
			if (move.id === 'reflect' && battle.playerReflectTurns === 0) {
				battle.playerReflectTurns = duration;
				messageLog.push(`Reflect raised your team's Defense!`);
				hadEffect = true;
			} else if (move.id === 'lightscreen' && battle.playerLightScreenTurns === 0) {
				battle.playerLightScreenTurns = duration;
				messageLog.push(`Light Screen raised your team's Special Defense!`);
				hadEffect = true;
			} else if (move.id === 'auroraveil' && battle.weather?.type === 'hail' && battle.playerAuroraVeilTurns === 0) {
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
			} else if (move.id === 'auroraveil' && battle.weather?.type === 'hail' && battle.opponentAuroraVeilTurns === 0) {
				battle.opponentAuroraVeilTurns = duration;
				messageLog.push(`Aurora Veil raised the opposing team's defenses!`);
				hadEffect = true;
			}
		}
		if (!hadEffect) messageLog.push('But it failed!');
		return;
	}

	// Handle Hazard/Screen Removal
	if (move.id === 'defog') {
		let clearedSomething = false;
		if (battle.playerHazards.length > 0 || battle.opponentHazards.length > 0) {
			battle.playerHazards = [];
			battle.opponentHazards = [];
			messageLog.push('The entry hazards were removed from the field!');
			clearedSomething = true;
		}

		// Defog clears screens from the *opposing* side
		if (isPlayerAttacker) {
			if (battle.opponentReflectTurns > 0) { battle.opponentReflectTurns = 0; messageLog.push(`The opposing team's Reflect wore off!`); clearedSomething = true; }
			if (battle.opponentLightScreenTurns > 0) { battle.opponentLightScreenTurns = 0; messageLog.push(`The opposing team's Light Screen wore off!`); clearedSomething = true; }
			if (battle.opponentAuroraVeilTurns > 0) { battle.opponentAuroraVeilTurns = 0; messageLog.push(`The opposing team's Aurora Veil wore off!`); clearedSomething = true; }
		} else {
			if (battle.playerReflectTurns > 0) { battle.playerReflectTurns = 0; messageLog.push(`Your team's Reflect wore off!`); clearedSomething = true; }
			if (battle.playerLightScreenTurns > 0) { battle.playerLightScreenTurns = 0; messageLog.push(`Your team's Light Screen wore off!`); clearedSomething = true; }
			if (battle.playerAuroraVeilTurns > 0) { battle.playerAuroraVeilTurns = 0; messageLog.push(`Your team's Aurora Veil wore off!`); clearedSomething = true; }
		}

		// Defog lowers the target's evasion
		if (defenderSlot.statStages.evasion > -6) {
			defenderSlot.statStages.evasion--;
			messageLog.push(`${defender.species}'s evasion fell!`);
		}
		hadEffect = true;
		return;
	}

	const effectiveness = getCustomEffectiveness(move.type, defenderSpecies.types, defender, battle);
	if (effectiveness === 0 && move.target !== 'self' && !move.flags.heal) {
		messageLog.push(`It doesn't affect ${defender.species}...`);
		return;
	}

	// Handle new field effects
	if (move.id === 'gravity') {
		if (battle.gravityTurns > 0) {
			messageLog.push('But it failed!');
		} else {
			battle.gravityTurns = 5;
			messageLog.push('Gravity intensified!');
			hadEffect = true;
		}
	} else if (move.id === 'mudsport') {
		if (battle.mudSportTurns > 0) {
			messageLog.push('But it failed!');
		} else {
			battle.mudSportTurns = 5;
			messageLog.push('Electricity\'s power was weakened!');
			hadEffect = true;
		}
	} else if (move.id === 'watersport') {
		if (battle.waterSportTurns > 0) {
			messageLog.push('But it failed!');
		} else {
			battle.waterSportTurns = 5;
			messageLog.push('Fire\'s power was weakened!');
			hadEffect = true;
		}
	}

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
		hadEffect = true;
		break;
	case 'magicroom':
		if (battle.magicRoomTurns > 0) {
			battle.magicRoomTurns = 0;
			messageLog.push('The bizarre dimensions disappeared.');
		} else {
			battle.magicRoomTurns = 5;
			messageLog.push('It created a bizarre area where held items lose their effects!');
		}
		hadEffect = true;
		break;
	case 'wonderroom':
		if (battle.wonderRoomTurns > 0) {
			battle.wonderRoomTurns = 0;
			messageLog.push('The bizarre dimensions disappeared.');
		} else {
			battle.wonderRoomTurns = 5;
			messageLog.push('It created a bizarre area where Defense and Sp. Def stats are swapped!');
		}
		hadEffect = true;
		break;
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
			hadEffect = true;
		}
		break;
	}
	if (hadEffect) return;

	if (move.id === 'leechseed') {
		if (defenderSpecies.types.includes('Grass')) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
			return;
		}
		if (defenderSlot.isSeeded) {
			messageLog.push(`${defender.species} is already seeded!`);
		} else {
			defenderSlot.isSeeded = true;
			messageLog.push(`${defender.species} was seeded!`);
			hadEffect = true;
		}
	} else if (move.id === 'curse') {
		const attackerSpecies = Dex.species.get(attacker.species);

		if (attackerSpecies.types.includes('Ghost')) {
			if (defenderSlot.isCursed) {
				messageLog.push(`But it failed!`);
			} else {
				attacker.hp = Math.max(1, Math.floor(attacker.hp / 2));
				messageLog.push(`${attacker.species} cut its own HP to lay a curse!`);
				defenderSlot.isCursed = true;
				messageLog.push(`${defender.species} was cursed!`);
				hadEffect = true;
			}
		} else {
			// Non-ghost Curse
			const boosts = move.boosts;
			if (boosts) {
				const selfStages = attackerSlot.statStages;
				for (const stat in boosts) {
					const stage = selfStages[stat as keyof typeof selfStages];
					const boostValue = boosts[stat as keyof typeof boosts]!;
					if ((stage < 6 && boostValue > 0) || (stage > -6 && boostValue < 0)) {
						selfStages[stat as keyof typeof selfStages] = Math.max(-6, Math.min(6, stage + boostValue));
						messageLog.push(`${attacker.species}'s ${stat.toUpperCase()} ${boostValue > 0 ? 'rose' : 'fell'}!`);
						hadEffect = true;
					}
				}
			}
		}
	} else if (move.id === 'haze') {
		// Haze affects all slots
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			slot.statStages = { ...INITIAL_STAT_STAGES };
		});
		messageLog.push('All stat changes were eliminated!');
		hadEffect = true;
	} else if (move.id === 'psychup') {
		const sourceStages = defenderSlot.statStages;
		attackerSlot.statStages = { ...sourceStages };
		messageLog.push(`${attacker.species} copied ${defender.species}'s stat changes!`);
		hadEffect = true;
	} else if (['trick', 'switcheroo'].includes(move.id)) {
		if (battle.magicRoomTurns > 0) {
			messageLog.push('But it failed!');
			return;
		}
		if (defender.ability === 'Sticky Hold' || attacker.ability === 'Sticky Hold') {
			messageLog.push('But it failed!');
			return;
		}
		if (!attacker.item && !defender.item) {
			messageLog.push('But it failed!');
			return;
		}

		const attackerItem = attacker.item;
		const defenderItem = defender.item;

		attacker.item = defenderItem;
		defender.item = attackerItem;

		hadEffect = true;
		messageLog.push(`${attacker.species} swapped items with ${defender.species}!`);

		if (attacker.item) messageLog.push(`${attacker.species} obtained a ${ITEMS_DATABASE[attacker.item].name}!`);
		if (defender.item) messageLog.push(`${defender.species} obtained a ${ITEMS_DATABASE[defender.item].name}!`);
	} else if (move.id === 'nightmare') {
		const defenderStatus = defenderSlot.status;
		const hasNightmare = defenderSlot.hasNightmare;

		if (defenderStatus !== 'slp') {
			messageLog.push(`But it failed!`);
		} else if (hasNightmare) {
			messageLog.push(`${defender.species} is already having a nightmare!`);
		} else {
			defenderSlot.hasNightmare = true;
			messageLog.push(`${defender.species} began having a nightmare!`);
			hadEffect = true;
		}
	} else if (move.weather) {
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
	} else if (move.flags.heal) {
		if (attacker.hp >= attacker.maxHp) {
			messageLog.push(`But it failed! (${attacker.species}'s HP is already full!)`);
		} else {
			const healAmount = Math.floor(attacker.maxHp * (move.heal?.[0] || 1) / (move.heal?.[1] || 2));
			const oldHp = attacker.hp;
			attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
			messageLog.push(`${attacker.species} restored ${attacker.hp - oldHp} HP!`);
			hadEffect = true;
		}
	} else if (move.id === 'bellydrum') {
		const attackerStages = attackerSlot.statStages;
		if (attacker.hp <= attacker.maxHp / 2) {
			messageLog.push(`But it failed! (Not enough HP)`);
		} else if (attackerStages.atk >= 6) {
			messageLog.push(`But it failed! (Attack is already maxed out)`);
		} else {
			attacker.hp = Math.floor(attacker.hp - attacker.maxHp / 2);
			attackerStages.atk = 6;
			messageLog.push(`${attacker.species} cut its own HP and maximized its Attack!`);
			hadEffect = true;
		}
	} else if (move.sideCondition) {
		const targetHazards = isPlayerAttacker ? battle.opponentHazards : battle.playerHazards;
		const hazardId = toID(move.sideCondition);
		let hazardSet = false;
		switch (hazardId) {
		case 'spikes':
			if (targetHazards.filter(h => h === 'spikes').length < 3) {
				targetHazards.push('spikes');
				messageLog.push(`Spikes were scattered all around the opposing team's feet!`);
				hazardSet = true;
			}
			break;
		case 'toxicspikes':
			if (targetHazards.filter(h => h === 'toxicspikes').length < 2) {
				targetHazards.push('toxicspikes');
				messageLog.push(`Toxic Spikes were scattered all around the opposing team's feet!`);
				hazardSet = true;
			}
			break;
		case 'stickyweb':
			if (!targetHazards.includes('stickyweb')) {
				targetHazards.push('stickyweb');
				messageLog.push(`A sticky web has been laid out on the ground around the opposing team!`);
				hazardSet = true;
			}
			break;
		case 'stealthrock':
			if (!targetHazards.includes('stealthrock')) {
				targetHazards.push('stealthrock');
				messageLog.push(`Pointed stones float in the air around the opposing team!`);
				hazardSet = true;
			}
			break;
		}
		if (hazardSet) {
			hadEffect = true;
		}
	} else if (move.boosts) {
		const targetSlot = move.target === 'self' ? attackerSlot : defenderSlot;
		const targetStages = targetSlot.statStages;

		if (move.target !== 'self') {
			if (battle.magicRoomTurns === 0 && targetSlot.pokemon.item === 'clearamulet') {
				const hasNegativeBoosts = Object.values(move.boosts).some(boost => (boost || 0) < 0);
				if (hasNegativeBoosts) {
					messageLog.push(`${targetSlot.pokemon.species}'s Clear Amulet prevents its stats from being lowered!`);
					return;
				}
			}
		}

		for (const stat in move.boosts) {
			const stage = targetStages[stat as keyof typeof targetStages];
			const boostValue = move.boosts[stat as keyof typeof move.boosts]!;
			if ((stage < 6 && boostValue > 0) || (stage > -6 && boostValue < 0)) {
				targetStages[stat as keyof typeof targetStages] = Math.max(-6, Math.min(6, stage + boostValue));
				messageLog.push(`${targetSlot.pokemon.species}'s ${stat.toUpperCase()} ${boostValue > 0 ? 'rose' : 'fell'}!`);
				hadEffect = true;
			}
		}
	} else if (move.status) {
		const defenderCurrentStatus = defenderSlot.status;
		let canBeAfflicted = !defenderCurrentStatus;
		const defenderIsGrounded = isGrounded(defender, battle);

		if (battle.terrain?.type === 'misty' && defenderIsGrounded) {
			canBeAfflicted = false;
			messageLog.push('The Misty Terrain prevents status conditions!');
		}
		if (battle.terrain?.type === 'electric' && move.status === 'slp' && defenderIsGrounded) {
			canBeAfflicted = false;
			messageLog.push('The Electric Terrain prevents sleep!');
		}

		if (canBeAfflicted) {
			if ((move.status === 'brn' && defenderSpecies.types.includes('Fire')) || (move.status === 'par' && defenderSpecies.types.includes('Electric')) || (move.status === 'psn' && (defenderSpecies.types.includes('Poison') || defenderSpecies.types.includes('Steel'))) || (move.status === 'frz' && defenderSpecies.types.includes('Ice'))) {
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
			hadEffect = true;
		}
	} else if (move.volatileStatus) {
		switch (move.volatileStatus) {
		case 'confusion':
			if (!defenderSlot.isConfused) {
				defenderSlot.isConfused = true;
				defenderSlot.confusionCounter = Math.floor(Math.random() * 3) + 2;
				messageLog.push(`${defender.species} became confused!`);
				hadEffect = true;
			}
			break;

		case 'taunt':
			if (defenderSlot.tauntTurns <= 0) {
				defenderSlot.tauntTurns = 3;
				messageLog.push(`${defender.species} fell for the taunt!`);
				hadEffect = true;
			}
			break;

		case 'trap':
			if (!defenderSlot.isTrapped) {
				defenderSlot.isTrapped = { turns: 5 };
				messageLog.push(`${defender.species} can no longer escape!`);
				hadEffect = true;
			}
			break;
		}
	}

	// --- NEW BLOCK ---
	// Handle self-switching status moves (Baton Pass, Teleport)
	if (move.selfSwitch) {
		// This will be handled in Step 6
		messageLog.push(`${attacker.species} is preparing to switch out! (Logic TBD)`);
		hadEffect = true;
		// This should register a switch action for the attacker
		// battle.playerShouldSwitch = move.selfSwitch; // Old logic
	}
	if (!hadEffect) {
		messageLog.push(`But it failed!`);
	}
}

function handleDamagingMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
) {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;
	
	// Check for semi-invulnerable state from two-turn moves
	const defenderChargingMoveId = defenderSlot.chargingMove;
	if (defenderChargingMoveId) {
		let isImmune = true; // Assume the defender is immune by default while charging
		const semiInvulnerableStates = ['fly', 'dig', 'dive', 'bounce', 'shadowforce', 'phantomforce'];

		if (semiInvulnerableStates.includes(defenderChargingMoveId)) {
			if (defenderChargingMoveId === 'dig' && ['earthquake', 'magnitude'].includes(move.id)) isImmune = false;
			if (defenderChargingMoveId === 'dive' && ['surf', 'whirlpool'].includes(move.id)) isImmune = false;
			if ((defenderChargingMoveId === 'fly' || defenderChargingMoveId === 'bounce') && ['thunder', 'hurricane', 'twister', 'gust', 'skyuppercut', 'smackdown'].includes(move.id)) isImmune = false;
		}

		if (isImmune) {
			messageLog.push(`But it failed! ${defender.species} avoided the attack!`);
			return; // The attack misses
		}
	}

	// Handle One-Hit KO moves
	if (move.ohko) {
		// Check level immunity
		if (defender.level > attacker.level) {
			messageLog.push(`But it failed!`);
			return;
		}

		// Check type immunity (e.g., Ghost immune to Normal OHKO)
		const defenderSpecies = Dex.species.get(defender.species);
		if (move.ohko === 'Normal' && defenderSpecies.types.includes('Ghost')) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
			return;
		}
		if (move.ohko === 'Ice' && defenderSpecies.types.includes('Ice')) {
			messageLog.push(`But it failed!`);
			return;
		}
		
		const accuracy = 30 + attacker.level - defender.level;
		if (Math.random() * 100 < accuracy) {
			defender.hp = 0;
			messageLog.push(`<i style="color: #dc3545;">It's a one-hit KO!</i>`);
		} else {
			messageLog.push(`${attacker.species}'s attack missed!`);
		}
		return;
	}

	let moveWasSuccessful = false; // Flag to check if the move hit for self-destruct
	let hitCount = 1;
	if (move.multihit) {
		if (typeof move.multihit === 'number') {
			hitCount = move.multihit;
		} else {
			const rand = Math.random() * 8;
			if (rand < 3) hitCount = 2;
			else if (rand < 6) hitCount = 3;
			else if (rand < 7) hitCount = 4;
			else hitCount = 5;
		}
	}

	const attackerStages = attackerSlot.statStages;
	const defenderStages = defenderSlot.statStages;

	if (hitCount > 1) {
		// Ensure messageLog is not empty before trying to access last element
		if (messageLog.length > 0) {
			messageLog[messageLog.length - 1] += ` <i style="color: #6c757d;">(It hit ${hitCount} times!)</i>`;
		} else {
			messageLog.push(`<i style="color: #6c757d;">(It hit ${hitCount} times!)</i>`);
		}
	}

	for (let i = 0; i < hitCount; i++) {
		const attackResult = calculateDamage(attackerSlot, defenderSlot, move.id, battle);

		if (attackResult.effectiveness > 0) {
			moveWasSuccessful = true;
		}

		if (attackResult.berryConsumed) {
			const itemName = ITEMS_DATABASE[attackResult.berryConsumed]?.name;
			if (attackResult.berryConsumed === 'enigmaberry') {
				// Special message handled by HP check
			} else if (TYPE_RESIST_BERRIES[attackResult.berryConsumed]) {
				messageLog.push(`${defender.species}'s ${itemName} weakened the attack!`);
			} else {
				messageLog.push(`${defender.species}'s ${itemName} activated!`);
			}
			defender.item = undefined;
		}

		let damageDealt = attackResult.damage;

		if (battle.magicRoomTurns === 0 && defender.item === 'airballoon' && move.type === 'Ground') {
			messageLog.push(`<i style="color: #6c757d;">The Air Balloon made the attack miss!</i>`);
			continue;
		}

		if (battle.magicRoomTurns === 0 && defender.item === 'focussash' && defender.hp === defender.maxHp && damageDealt >= defender.hp) {
			damageDealt = defender.hp - 1;
			messageLog.push(`${defender.species} held on using its Focus Sash!`);
			defender.item = undefined;
		}

		defender.hp = Math.max(0, defender.hp - damageDealt);
		if (hitCount > 1) {
			messageLog.push(`Dealt ${damageDealt} damage!` + attackResult.message);
		} else {
			if (messageLog.length > 0) {
				messageLog[messageLog.length - 1] += attackResult.message;
			} else {
				messageLog.push(attackResult.message); // Should not happen, but a safe fallback
			}
		}

		if (battle.magicRoomTurns === 0 && defender.hp > 0 && defender.item === 'enigmaberry' && attackResult.effectiveness > 1) {
			const healAmount = Math.floor(defender.maxHp / 2); // Gen 4+ Enigma Berry heals 1/4
			const oldHp = defender.hp;
			defender.hp = Math.min(defender.maxHp, defender.hp + healAmount);
			messageLog.push(`${defender.species} ate its Enigma Berry and restored ${defender.hp - oldHp} HP!`);
			defender.item = undefined;
		}

		if (battle.magicRoomTurns === 0 && defender.hp > 0 && defender.item === 'airballoon' && 
			damageDealt > 0 && move.category !== 'Status') {
			messageLog.push(`${defender.species}'s Air Balloon popped!`);
			defender.item = undefined;
		}

		if (attackResult.effectiveness > 0 && damageDealt > 0) {
			if (move.drain && attacker.hp < attacker.maxHp) {
				const drainAmount = Math.max(1, Math.floor(damageDealt * (move.drain[0] / move.drain[1])));
				attacker.hp = Math.min(attacker.maxHp, attacker.hp + drainAmount);
				messageLog.push(`${defender.species} had its energy drained!`);
			}

			if (battle.magicRoomTurns === 0 && attacker.item === 'shellbell' && attacker.hp < attacker.maxHp) {
				const healAmount = Math.max(1, Math.floor(attacker.maxHp / 8)); // Shell Bell is 1/8 damage dealt
				attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
				messageLog.push(`${attacker.species} restored some HP using its Shell Bell!`);
			}

			if (defender.hp > 0 && battle.magicRoomTurns === 0) {
				if (move.category === 'Physical' && defender.item === 'keberry' && defenderStages.def < 6) {
					defenderStages.def++;
					messageLog.push(`${defender.species} ate its Kee Berry to raise its Defense!`);
					defender.item = undefined;
				} else if (move.category === 'Special' && defender.item === 'marangaberry' && defenderStages.spd < 6) {
					defenderStages.spd++;
					messageLog.push(`${defender.species} ate its Maranga Berry to raise its Sp. Def!`);
					defender.item = undefined;
				}

				if (move.flags.contact) {
					if (defender.item === 'rockyhelmet') {
						attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 6));
						messageLog.push(`${attacker.species} was hurt by the Rocky Helmet!`);
					}
					if (defender.item === 'jabocaberry') {
						attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
						messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Jaboca Berry!`);
						defender.item = undefined;
					}
				}

				if (move.category === 'Special' && defender.item === 'rowapberry') {
					attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
					messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Rowap Berry!`);
					defender.item = undefined;
				}
			}

			if (defender.hp > 0 && battle.magicRoomTurns === 0 && defender.item === 'weaknesspolicy' && attackResult.effectiveness > 1) {
				let activated = false;
				if (defenderStages.atk < 6) {
					defenderStages.atk = Math.min(6, defenderStages.atk + 2);
					activated = true;
				}
				if (defenderStages.spa < 6) {
					defenderStages.spa = Math.min(6, defenderStages.spa + 2);
					activated = true;
				}
				if (activated) {
					messageLog.push(`${defender.species}'s Weakness Policy sharply boosted its Attack and Sp. Attack!`);
					defender.item = undefined;
				}
			}

			handleHPDropEffects(defenderSlot, battle, messageLog);
			handleHPDropEffects(attackerSlot, battle, messageLog);

			if (attacker.hp > 0) {
				let tookRecoil = false;
				
				if (['mindblown', 'steelbeam'].includes(move.id)) {
					const recoilDamage = Math.floor(attacker.maxHp / 2);
					attacker.hp = Math.max(0, attacker.hp - recoilDamage);
					messageLog.push(`${attacker.species} was damaged by the move's recoil!`);
					tookRecoil = true;
				}
				
				if (battle.magicRoomTurns === 0 && attacker.item === 'lifeorb') {
					attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 10));
					messageLog.push(`${attacker.species} was hurt by its Life Orb!`);
					tookRecoil = true;
				}
				if (move.id === 'struggle') {
					const recoilDamage = Math.max(1, Math.floor(attacker.maxHp / 4));
					attacker.hp = Math.max(0, attacker.hp - recoilDamage);
					messageLog.push(`${attacker.species} was damaged by recoil!`);
					tookRecoil = true;
				} else if (move.recoil) {
					const recoilDamage = Math.max(1, Math.floor(damageDealt * (move.recoil[0] / move.recoil[1])));
					attacker.hp = Math.max(0, attacker.hp - recoilDamage);
					messageLog.push(`${attacker.species} was damaged by recoil!`);
					tookRecoil = true;
				}
				if (tookRecoil) {
					handleHPDropEffects(attackerSlot, battle, messageLog);
				}
			}

			if (attacker.hp > 0 && move.self?.boosts) {
				const boosts = move.self.boosts;
				for (const stat in boosts) {
					const boostValue = boosts[stat as keyof typeof boosts]!;
					if (attackerStages[stat as keyof typeof attackerStages] > -6 && boostValue < 0) {
						attackerStages[stat as keyof typeof attackerStages] = Math.max(-6, attackerStages[stat as keyof typeof attackerStages] + boostValue);
						messageLog.push(`<span style="color: #d9534f;">${attacker.species}'s ${stat.toUpperCase()} fell!</span>`);
					}
				}
			}

			if (defender.hp > 0) {
				if (battle.magicRoomTurns === 0 && defender.item === 'covertcloak') {
					// Covert Cloak blocks secondary effects
				} else if (move.secondary) {
					let chance = move.secondary.chance || 100;
					if (attacker.ability === 'Serene Grace') {
						chance *= 2;
					}

					if (Math.random() * 100 < chance) {
						if (move.id === 'triattack' && move.secondary.status) {
							const statuses = ['brn', 'par', 'frz'] as Status[];
							const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
							const defenderCurrentStatus = defenderSlot.status;
							const defenderSpecies = Dex.species.get(defender.species);
							let canBeAfflicted = !defenderCurrentStatus;
							
							if ((randomStatus === 'brn' && defenderSpecies.types.includes('Fire')) || 
								(randomStatus === 'par' && defenderSpecies.types.includes('Electric')) || 
								(randomStatus === 'frz' && defenderSpecies.types.includes('Ice'))) {
								canBeAfflicted = false;
							}
							
							if (canBeAfflicted) {
								defenderSlot.status = randomStatus;
								messageLog.push(`${defender.species} was afflicted with ${randomStatus}!`);
							}
						} else if (move.secondary.status) {
							const defenderCurrentStatus = defenderSlot.status;
							const defenderSpecies = Dex.species.get(defender.species);
							let canBeAfflicted = !defenderCurrentStatus;
							const newStatus = move.secondary.status as Status;
							if ((newStatus === 'brn' && defenderSpecies.types.includes('Fire')) || (newStatus === 'par' && defenderSpecies.types.includes('Electric')) || (newStatus === 'psn' && (defenderSpecies.types.includes('Poison') || defenderSpecies.types.includes('Steel'))) || (newStatus === 'frz' && defenderSpecies.types.includes('Ice'))) {
								canBeAfflicted = false;
							}
							if (canBeAfflicted) {
								defenderSlot.status = newStatus;
								if (newStatus === 'slp') defenderSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
								messageLog.push(`${defender.species} was afflicted with ${newStatus}!`);
							}
						}

						if (move.secondary.volatileStatus) {
							switch (move.secondary.volatileStatus) {
							case 'flinch':
								defenderSlot.willFlinch = true;
								break;
							case 'confusion':
								if (!defenderSlot.isConfused) {
									defenderSlot.isConfused = true;
									defenderSlot.confusionCounter = Math.floor(Math.random() * 3) + 2;
									messageLog.push(`${defender.species} became confused!`);
								}
								break;
							}
						}

						if (move.secondary.boosts) {
							if (battle.magicRoomTurns === 0 && defender.item === 'clearamulet' && Object.values(move.secondary.boosts).some(v => v < 0)) {
								messageLog.push(`${defender.species}'s Clear Amulet prevents its stats from being lowered!`);
							} else {
								for (const stat in move.secondary.boosts) {
									const stage = defenderStages[stat as keyof typeof defenderStages];
									const boostValue = move.secondary.boosts[stat as keyof typeof move.secondary.boosts]!;
									if ((stage < 6 && boostValue > 0) || (stage > -6 && boostValue < 0)) {
										defenderStages[stat as keyof typeof defenderStages] = Math.max(-6, Math.min(6, stage + boostValue));
										messageLog.push(`${defender.species}'s ${stat.toUpperCase()} ${boostValue > 0 ? 'rose' : 'fell'}!`);
									}
								}
							}
						}
					}
				}
			}
		}

		if (defender.hp <= 0) break;
		if (attacker.hp <= 0) break;
	}

	// --- Post-damage Item Manipulation Effects ---
	if (defender.hp > 0 && battle.magicRoomTurns === 0) {
		if (move.id === 'knockoff' && defender.item && defender.ability !== 'Sticky Hold') {
			const removedItem = ITEMS_DATABASE[defender.item];
			messageLog.push(`${attacker.species} knocked off ${defender.species}'s ${removedItem.name}!`);
			defender.item = undefined;
		}
		if (['thief', 'covet'].includes(move.id) && defender.item && !attacker.item && defender.ability !== 'Sticky Hold') {
			const stolenItem = ITEMS_DATABASE[defender.item];
			attacker.item = defender.item;
			defender.item = undefined;
			messageLog.push(`${attacker.species} stole ${defender.species}'s ${stolenItem.name}!`);
		}
	}

	// --- Post-damage Hazard/Trap Removal & Stat Boosts ---
	if (attacker.hp > 0 && move.id === 'rapidspin') {
		let clearedSomething = false;
		const isPlayerAttacker = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);
		
		if (isPlayerAttacker) {
			if (battle.playerHazards.length > 0) { battle.playerHazards = []; clearedSomething = true; }
			if (attackerSlot.isSeeded) { attackerSlot.isSeeded = false; clearedSomething = true; }
			if (attackerSlot.isTrapped) { attackerSlot.isTrapped = null; clearedSomething = true; }
		} else { // Opponent is attacker
			if (battle.opponentHazards.length > 0) { battle.opponentHazards = []; clearedSomething = true; }
			if (attackerSlot.isSeeded) { attackerSlot.isSeeded = false; clearedSomething = true; }
			if (attackerSlot.isTrapped) { attackerSlot.isTrapped = null; clearedSomething = true; }
		}
		if (clearedSomething) messageLog.push(`${attacker.species} cleared away hazards and traps!`);

		if (attackerStages.spe < 6) {
			attackerStages.spe++;
			messageLog.push(`${attacker.species}'s Speed rose!`);
		}
	}
	
	// --- Trapping Move Application ---
	if (defender.hp > 0 && move.volatileStatus === 'partiallytrapped') {
		if (!defenderSlot.isTrapped) {
			const turns = Math.floor(Math.random() * 3) + 4; // 4, 5, or 6 turns
			defenderSlot.isTrapped = { turns: turns };
			messageLog.push(`${defender.species} was trapped!`);
		}
	}

	// Handle Feint breaking protection after all hits
	if (move.id === 'feint') {
		if (defenderSlot.isProtected) {
			defenderSlot.isProtected = false;
			messageLog.push(`${defender.species}'s protection was broken!`);
		}
	}

	// FIX #1: U-Turn / Volt Switch / Flip Turn - handle switch after damage
	if (attacker.hp > 0 && defender.hp > 0 && (move.selfSwitch === true || move.selfSwitch === 'copyvolatile')) {
		// Store whether attacker was player
		const switcherIsPlayer = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);
		
		// For wild battles, opponent can't switch
		if (!switcherIsPlayer && (battle.battleType === 'wild' || battle.battleType === 'wild_double')) {
			// Wild Pokemon doesn't switch
		} else if (switcherIsPlayer) {
			// Check if player has any other Pokemon to switch to
			const player = getPlayerData(battle.playerId);
			if (player.party.some(p => p.hp > 0 && p.id !== attacker.id)) {
				// This needs to be handled by the turn processor in Step 6
				battle.playerShouldSwitch = move.selfSwitch;
				messageLog.push(`${attacker.species} went back to ${battle.playerId}!`);
			} else {
				// No Pokemon to switch to, move fails to pivot
				messageLog.push(`But it failed! (No Pokémon to switch to!)`);
			}
		} else if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
			// Trainer opponent uses pivot move - auto switch to next available
			// This will be handled in Step 6
			messageLog.push(`${battle.opponentName} is preparing to switch ${attacker.species}! (Logic TBD)`);
		}
	}

	if (defender.hp > 0) {
		if (['dragontail', 'circlethrow'].includes(move.id)) {
			// --- MODIFIED ---
			if (battle.battleType === 'wild' || battle.battleType === 'wild_double') {
				messageLog.push(`The wild ${defender.species} was dragged away!`);
				battle.forceEnd = true;
			} else {
				messageLog.push(`But it failed!`); // Can't force switch a trainer
			}
		}
	}

	// --- Self-Destruct Fainting (after all hits) ---
	if (move.selfdestruct === 'always' && attacker.hp > 0) {
		messageLog.push(`${attacker.species} fainted!`);
		attacker.hp = 0;
	}
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
			consumedItemName = ITEMS_DATABASE[pokemon.item].name;
			messageLog.push(`${pokemon.species} drank its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'oranberry') {
			healAmount = 10;
			consumedItemName = ITEMS_DATABASE[pokemon.item].name;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'goldberry') {
			healAmount = 30;
			consumedItemName = ITEMS_DATABASE[pokemon.item].name;
			messageLog.push(`${pokemon.species} ate its ${consumedItemName} and restored ${healAmount} HP!`);
			itemConsumed = true;
		} else if (pokemon.item === 'sitrusberry') {
			// FIXED: Sitrus Berry now activates at 1/2 HP and heals 1/4 max HP
			healAmount = Math.floor(pokemon.maxHp / 4);
			consumedItemName = ITEMS_DATABASE[pokemon.item].name;
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
			consumedItemName = ITEMS_DATABASE[pokemon.item].name;
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
			const statToBoost = pinchBerryStat[pokemon.item];
			const targetStages = slot.statStages;
			if (targetStages[statToBoost] < 6) {
				// FIXED: All stat-boosting berries now boost by exactly 1 stage
				targetStages[statToBoost]++;
				consumedItemName = ITEMS_DATABASE[pokemon.item].name;
				messageLog.push(`${pokemon.species} ate its ${consumedItemName} to boost its ${statToBoost.toUpperCase()}!`);
				itemConsumed = true;
			}
		} else if (pokemon.item === 'starfberry') {
			const targetStages = slot.statStages;
			const stats = ['atk', 'def', 'spa', 'spd', 'spe'] as const;
			const availableStats = stats.filter(stat => targetStages[stat] < 6);

			if (availableStats.length > 0) {
				const randomStat = availableStats[Math.floor(Math.random() * availableStats.length)];
				targetStages[randomStat] += 2; // Starf Berry boosts by 2 stages (this was correct)
				targetStages[randomStat] = Math.min(6, targetStages[randomStat]); // Cap at +6
				consumedItemName = ITEMS_DATABASE[pokemon.item].name;
				messageLog.push(`${pokemon.species} ate its ${consumedItemName} to sharply boost its ${randomStat.toUpperCase()}!`);
				itemConsumed = true;
			}
		}
	}

	// If an item was used, remove it from the Pokemon
	if (itemConsumed) {
		pokemon.item = undefined;
	}
}

/**
 * Processes end-of-turn effects for weather, such as damage and duration.
 */
function handleEndOfTurnWeather(battle: BattleState, messageLog: string[]) {
	if (!battle.weather) return;

	// Decrement weather timer
	battle.weather.turns--;

	const weatherMessages = {
		'sun': 'The sunlight is harsh.',
		'rain': 'Rain continues to fall.',
		'sand': 'The sandstorm rages.',
		'hail': 'The hail crashes down.',
	};
	messageLog.push(weatherMessages[battle.weather.type]);

	// Apply weather damage if applicable
	const { activePokemon, opponentActivePokemon } = battle;
	const allPokemon = [activePokemon, opponentActivePokemon];

	for (const pokemon of allPokemon) {
		if (pokemon.hp <= 0) continue;
		const species = Dex.species.get(pokemon.species);
		let takeDamage = false;

		if (battle.weather.type === 'sand' && !species.types.includes('Rock') && !species.types.includes('Ground') && !species.types.includes('Steel')) {
			takeDamage = true;
		} else if (battle.weather.type === 'hail' && !species.types.includes('Ice')) {
			takeDamage = true;
		}

		if (takeDamage) {
			const damage = Math.max(1, Math.floor(pokemon.maxHp / 16));
			pokemon.hp = Math.max(0, pokemon.hp - damage);
			messageLog.push(`${pokemon.species} is buffeted by the weather!`);
		}
	}

	// Check if weather has ended
	if (battle.weather.turns <= 0) {
		const weatherEndMessages = {
			'sun': 'The sunlight faded.',
			'rain': 'The rain stopped.',
			'sand': 'The sandstorm subsided.',
			'hail': 'The hail stopped.',
		};
		messageLog.push(weatherEndMessages[battle.weather.type]);
		battle.weather = undefined;
	}
}

/**
 * Checks if a Pokémon is grounded and affected by terrain.
 */
function isGrounded(pokemon: RPGPokemon, battle: BattleState): boolean {
	// Gravity grounds all Pokémon, overriding other immunities.
	if (battle.gravityTurns > 0) {
		return true;
	}
	const species = Dex.species.get(pokemon.species);
	// Air Balloon effect is disabled in Magic Room, so we can't check for it here
	// The Magic Room check should be done in the calling function
	return !species.types.includes('Flying') && pokemon.ability !== 'Levitate';
}

/**
 * Processes end-of-turn effects for all field conditions (Rooms, Terrains).
 */
function handleEndOfTurnFieldEffects(battle: BattleState, messageLog: string[]) {
	// Handle Terrain
	if (battle.terrain) {
		if (battle.terrain.type === 'grassy') {
			const allPokemon = [battle.activePokemon, battle.opponentActivePokemon];
			for (const pokemon of allPokemon) {
				if (pokemon.hp > 0 && pokemon.hp < pokemon.maxHp && isGrounded(pokemon, battle)) {
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
 * @returns {boolean} Returns true if the move caused the defender to flinch.
 */
function executeMove(
	attackerSlot: ActivePokemonSlot,
	targetSlots: ActivePokemonSlot[],
	move: Move,
	moveObject: { id: string, pp: number },
	battle: BattleState,
	messageLog: string[]
): void { // Return type changed to void, flinch is handled in handleDamagingMove

	// Reset protect counter if a different move is used
	if (!['protect', 'detect'].includes(move.id)) {
		attackerSlot.protectSuccessCounter = 0;
	}

	// 3. Check for Terrain Immunity (e.g., Psychic Terrain blocking priority)
	// Note: This check should ideally happen *before* targeting
	
	// 4. Accuracy Check (Handled per-target)
	
	// 5. Check for Sucker Punch failure (Handled in processTurn/executeAction)
	
	for (const defenderSlot of targetSlots) {
		if (attackerSlot.pokemon.hp <= 0) break; // Attacker fainted mid-move (e.g. from ally recoil)
		if (defenderSlot.pokemon.hp <= 0) continue; // Target fainted mid-move (e.g. from first hit of spread)

		// 2. Check for Protection (Struggle bypasses this)
		if (move.id !== 'struggle') {
			if (defenderSlot.isProtected && move.flags.protect && !move.breaksProtect) {
				messageLog.push(`<span style="color: #6c757d;">${defenderSlot.pokemon.species} protected itself!</span>`);
				continue; // Move fails against this target
			}
			// TODO: Add Wide Guard check for spread moves
		}
		
		// 6. Accuracy Check
		let moveHit = true;
		if (['aerialace'].includes(move.id)) {
			// Bypasses accuracy
		} else if (move.accuracy !== true) {
			const accuracyMultiplier = getAccuracyEvasionMultiplier(attackerSlot.statStages.accuracy);
			const evasionMultiplier = getAccuracyEvasionMultiplier(defenderSlot.statStages.evasion);
			let moveAccuracy = move.accuracy;
			// ... (Weather accuracy logic) ...
			if (battle.weather) {
				if (battle.weather.type === 'rain') {
					if (['thunder', 'hurricane'].includes(move.id)) moveAccuracy = 100;
				} else if (battle.weather.type === 'sun') {
					if (['thunder', 'hurricane'].includes(move.id)) moveAccuracy = 50;
				}
				if (battle.weather.type === 'hail' && move.id === 'blizzard') {
					moveAccuracy = 100;
				}
			}
	
			// Gravity increases accuracy by 5/3 (approx 1.67x)
			if (battle.gravityTurns > 0) {
				moveAccuracy = Math.floor(moveAccuracy * (5 / 3));
			}
			
			const finalAccuracy = moveAccuracy * (accuracyMultiplier / evasionMultiplier);
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
			handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog);
		} else if (move.category === 'Status') {
			handleStatusMove(attackerSlot, defenderSlot, move, battle, messageLog);
		} else {
			handleDamagingMove(attackerSlot, defenderSlot, move, battle, messageLog);
		}
	}
}

/**
 * Checks the HP of all active Pokémon and handles the outcome of a faint.
 * This can result in a win, a loss, or a prompt to switch Pokémon.
 * @returns {boolean} Returns `true` if the battle ended or was interrupted (awaiting a switch), `false` if it continues.
 */
function checkBattleEndCondition(
	context: CommandContext,
	battle: BattleState,
	room: ChatRoom,
	user: User,
	messageLog: string[]
): boolean {
	const player = getPlayerData(user.id);

	// --- 1. Check for Fainted Opponents ---
	let opponentFainted = false;
	const playerParticipants = getActiveSlots(battle.playerSlots);

	for (let i = 0; i < battle.opponentSlots.length; i++) {
		const slot = battle.opponentSlots[i];
		if (slot && slot.pokemon.hp <= 0) {
			opponentFainted = true;
			messageLog.push(`**The opposing ${slot.pokemon.species} fainted!**`);
			
			// Grant EXP to all active player Pokemon
			if (playerParticipants.length > 0) {
				const expResult = gainExperience(player, playerParticipants, slot.pokemon, room, user);
				messageLog.push(...expResult.messages);
			}

			// Find a replacement from the trainer's party
			const nextOpponent = battle.opponentParty.find(p =>
				p.hp > 0 &&
				!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
			);

			if (nextOpponent) {
				messageLog.push(`**${battle.opponentName} is about to send in ${nextOpponent.species}!**`);
				const newSlot = createActivePokemonSlot(nextOpponent);
				battle.opponentSlots[i] = newSlot;

				// Apply hazards on switch-in
				const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot.pokemon, battle, false, messageLog);
				if (faintedOnEntry) {
					messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
					// This will be caught in the next loop of the turn or next check
				} else {
					handleMirrorHerb(newSlot.pokemon, battle, messageLog);
				}
			} else {
				// No replacement found, set slot to null
				battle.opponentSlots[i] = null;
			}
		}
	}

	// --- 2. Check for Fainted Player Pokemon ---
	let playerFaintSwitchNeeded = false;
	for (let i = 0; i < battle.playerSlots.length; i++) {
		const slot = battle.playerSlots[i];
		if (slot && slot.pokemon.hp <= 0) {
			messageLog.push(`**Your ${slot.pokemon.species} fainted!**`);
			battle.playerSlots[i] = null; // Set slot to null
			playerFaintSwitchNeeded = true;
		}
	}

	// --- 3. Check for Win/Loss/Interrupt Conditions ---

	// A. Check for Player Loss (No Pokemon left in party or field)
	const playerHasLivingPokemon = player.party.some(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);
	const playerHasActivePokemon = getActiveSlots(battle.playerSlots).length > 0;

	if (!playerHasActivePokemon && !playerHasLivingPokemon) {
		// PLAYER LOSES
		saveBattleStatus(battle);
		activeBattles.delete(user.id);
		
		let moneyLost = 100;
		if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
			moneyLost = Math.floor(battle.opponentMoney / 10) || 200;
		}
		moneyLost = Math.min(player.money, moneyLost);
		player.money -= moneyLost;
		
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateDefeatHTML(moneyLost, battle.opponentName)}`);
		return true; // Battle ended
	}
	
	// B. Check for Player Win (No Opponent Pokemon left in party or field)
	const opponentHasLivingPokemon = battle.opponentParty.some(p =>
		p.hp > 0 &&
		!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
	);
	const opponentHasActivePokemon = getActiveSlots(battle.opponentSlots).length > 0;

	if (!opponentHasActivePokemon && !opponentHasLivingPokemon) {
		// PLAYER WINS
		saveBattleStatus(battle);
		activeBattles.delete(user.id);
		
		let moneyGained = 0;
		if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
			moneyGained = battle.opponentMoney;
			player.money += moneyGained;
			if (player.pendingMoveLearnQueue?.moveIds.length) {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			} else {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateTrainerVictoryHTML(battle.opponentName, messageLog, moneyGained)}`);
			}
		} else {
			// Wild battle win
			moneyGained = Math.floor(battle.opponentParty.reduce((sum, p) => sum + p.level, 0) * 5); // Average level * 10
			player.money += moneyGained;
			if (player.pendingMoveLearnQueue?.moveIds.length) {
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			} else {
				const defeatedNames = battle.opponentParty.map(p => p.species).join(' and ');
				context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateVictoryHTML(defeatedNames, messageLog, moneyGained, battle.zoneId)}`);
			}
		}
		return true; // Battle ended
	}

	// C. Check for Player Switch-In Needed
	if (playerFaintSwitchNeeded && playerHasLivingPokemon) {
		// Battle is interrupted, player must switch.
		// We'll just show the first available slot to fill.
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
		return true; // Battle interrupted
	}
	
	// D. Check for U-turn/Volt Switch
	if (battle.playerShouldSwitch) {
		// This will be handled by executeAction in the future
		// For now, let's assume it's checked here.
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePivotSwitchHTML(battle, messageLog)}`);
		return true; // Battle interrupted
	}

	// If no one has fainted or all faints were handled, the battle continues.
	return false;
}


/**
 * Processes all end-of-turn effects, such as status damage,
 * weather, and field conditions, for both Pokémon.
 */
function processEndOfTurn(battle: BattleState, messageLog: string[]) {
	// START: Add this to clear flinch status
	battle.playerWillFlinch = false;
	battle.opponentWillFlinch = false;
	// END: Flinch clear
	// Handle effects that apply to each Pokémon individually (status, items)
	handleEndOfTurnEffects(battle.activePokemon, battle, messageLog);
	handleEndOfTurnEffects(battle.opponentActivePokemon, battle, messageLog);

	// Handle effects that apply to the whole field
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
	};
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

/**
 * [STEP 4 Implementation]
 * Processes all queued actions for the turn.
 */
function processTurn(context: CommandContext, battle: BattleState, room: ChatRoom, user: User) {
	const messageLog: string[] = [];
	battle.turn++;

	// 1. Generate AI Actions
	getActiveSlots(battle.opponentSlots).forEach((slot, i) => {
		const slotIndex = 2 + i; // Opponent slots are 2 and 3
		if (!battle.pendingActions[slotIndex]) {
			battle.pendingActions[slotIndex] = generateAiAction(slot, slotIndex, battle);
		}
	});

	// 2. Build and Sort Action Order
	const actionQueue: NonNullable<BattleState['pendingActions'][number]>[] = [];
	const allActiveSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	for (const slotIndex in battle.pendingActions) {
		const action = battle.pendingActions[slotIndex];
		if (action) {
			actionQueue.push(action);
		}
	}

	actionQueue.sort((a, b) => {
		const slotA = allActiveSlots.find(s => s.pokemon.id === a.pokemonId);
		const slotB = allActiveSlots.find(s => s.pokemon.id === b.pokemonId);

		// If a Pokemon fainted before action selection, it shouldn't be in the queue
		if (!slotA) return 1;
		if (!slotB) return -1;

		const moveA = Dex.moves.get(a.moveId || 'struggle');
		const moveB = Dex.moves.get(b.moveId || 'struggle');

		// Sort by Priority
		if (moveA.priority !== moveB.priority) {
			return moveB.priority - moveA.priority;
		}

		// Sort by Speed
		let speedA = slotA.pokemon.spe * getStatMultiplier(slotA.statStages.spe);
		if (slotA.status === 'par') speedA = Math.floor(speedA / 2);
		let speedB = slotB.pokemon.spe * getStatMultiplier(slotB.statStages.spe);
		if (slotB.status === 'par') speedB = Math.floor(speedB / 2);

		if (battle.trickRoomTurns > 0) {
			return speedA - speedB; // Slower goes first in Trick Room
		}
		return speedB - speedA; // Faster goes first normally
	});

	// 3. Execute Actions in order
	for (const action of actionQueue) {
		executeAction(action, battle, room, user, messageLog);
		// TODO: After each action, check for faints before the next action
	}

	// 4. End-of-Turn Effects
	// This will be refactored in Step 7
	// For now, we'll just log a placeholder
	messageLog.push("--- End of Turn ---");
	// processEndOfTurn(battle, messageLog);

	// 5. Check for Battle End
	// This will be refactored in Step 6
	const battleEnded = false;
	// const battleEnded = checkBattleEndCondition(context, battle, room, user, messageLog);

	// 6. Reset and Render
	battle.pendingActions = {}; // Reset for next turn

	if (!battleEnded) {
		// Increment active turn counters for all active Pokemon
		allActiveSlots.forEach(slot => {
			if (slot.pokemon.hp > 0) {
				slot.activeTurns++;
			}
		});
		context.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
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
		const moveData = Dex.moves.get(m.id);
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

/**
 * [STEP 4/6 Implementation]
 * Executes a single queued action (move or switch).
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

	// Check if the Pokemon fainted before its turn (e.g., from an ally's Earthquake)
	if (!attackerSlot || attackerSlot.pokemon.hp <= 0) {
		return;
	}

	// --- Handle Switch Action ---
	if (action.actionType === 'switch' && action.switchToPokemonId) {
		const isPlayerSwitch = attackerSlotIndex <= 1;
		const pokemonToSwitchInId = action.switchToPokemonId;
		
		if (isPlayerSwitch) {
			const outgoingPokemon = attackerSlot.pokemon;
			
			// Find new Pokemon in party
			const partyIndex = player.party.findIndex(p => p.id === pokemonToSwitchInId);
			if (partyIndex === -1) {
				messageLog.push(`${outgoingPokemon.species} tried to switch out, but there was no one to switch to!`);
				return;
			}
			
			// Save outgoing Pokemon's status to the party
			saveBattleStatus(battle); // This function needs to be updated in Step 7
			
			// Add outgoing Pokemon back to party
			player.party.push(outgoingPokemon);
			
			// Remove incoming Pokemon from party
			const [incomingPokemon] = player.party.splice(partyIndex, 1);
			
			// Create new slot
			const newSlot = createActivePokemonSlot(incomingPokemon);
			battle.playerSlots[attackerSlotIndex as 0 | 1] = newSlot;
			
			messageLog.push(`**${player.name} withdrew ${outgoingPokemon.species} and sent out ${incomingPokemon.species}!**`);

			// Apply hazards
			const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot.pokemon, battle, true, messageLog);
			if (faintedOnEntry) {
				messageLog.push(`**${newSlot.pokemon.species} fainted upon entry!**`);
				// Faint check will run at end of turn
			} else {
				handleMirrorHerb(newSlot.pokemon, battle, messageLog);
			}
		} else {
			// TODO: Implement AI switching logic
			messageLog.push(`${attackerSlot.pokemon.species} is switching out! (AI Logic TBD)`);
		}
		return;
	}

	// --- Handle Move Action ---
	if (action.actionType === 'move' && action.moveId && action.targetSlot !== undefined) {
		const move = Dex.moves.get(action.moveId);
		let moveObject = attackerSlot.pokemon.moves.find(m => m.id === move.id);

		// Handle Struggle
		if (move.id === 'struggle' || !moveObject) {
			moveObject = { id: 'struggle', pp: 1 };
		} else if (moveObject.pp === 0) {
			moveObject = { id: 'struggle', pp: 1 };
			messageLog.push(`${attackerSlot.pokemon.species} has no PP left for ${move.name}!`);
		}

		// 1. Pre-Turn Status Checks (Sleep, Freeze, Paralysis, Confusion, Flinch)
		if (!handlePreTurnChecks(attackerSlot, battle, messageLog)) {
			return; // Attacker couldn't move
		}

		// 2. PP Deduction
		if (moveObject.id !== 'struggle' && moveObject.pp > 0) {
			moveObject.pp--;
		}

		// 3. Resolve Targets
		// TODO: Implement move redirects (Follow Me, Rage Powder) here
		const targetSlots = getMoveTargets(attackerSlotIndex, action.targetSlot, move, battle);

		// 4. Announce and Execute the Move
		messageLog.push(`<span style="color: #555;"><strong>${attackerSlot.pokemon.species}</strong> used <strong>${move.name}</strong>!</span>`);

		if (targetSlots.length === 0) {
			messageLog.push(`But there was no target!`);
			return;
		}

		// 5. Execute move against all targets
		executeMove(attackerSlot, targetSlots, move, moveObject, battle, messageLog);
		
		// 6. Handle U-turn/Volt Switch (self-switch after move)
		if (move.selfSwitch && attackerSlot.pokemon.hp > 0) {
			const isPlayer = attackerSlotIndex <= 1;
			if (isPlayer) {
				const player = getPlayerData(battle.playerId);
				const hasReplacement = player.party.some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));
				if (hasReplacement) {
					battle.playerShouldSwitch = move.selfSwitch; // Set flag
					// This will be caught by checkBattleEndCondition after the turn
					// We also need to set the slot to null
					// This is complex: the switch needs to happen *now*.
					
					// For now, we will just set the flag.
					// A proper implementation would pause the turn, ask for a switch,
					// and then continue.
					messageLog.push(`${attackerSlot.pokemon.species} is ready to switch out!`);
				} else {
					messageLog.push(`But there was no one to switch to!`);
				}
			} else {
				// AI U-turn
				// This will be caught by checkBattleEndCondition
			}
		}
	}
}

/**********************
* HTML UI
**********************/

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

function generatePokemonInfoHTML(
	slot: ActivePokemonSlot,
	showActions = false
): string {
	const pokemon = slot.pokemon;
	const statStages = slot.statStages;

	const species = Dex.species.get(pokemon.species);
	const hpPercentage = Math.max(0, Math.floor((pokemon.hp / pokemon.maxHp) * 100));
	const hpBarColor = hpPercentage > 50 ? 'green' : hpPercentage > 25 ? 'orange' : 'red';
	const expForLastLevel = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);
	const expForNextLevel = pokemon.expToNextLevel;
	const expProgress = pokemon.experience - expForLastLevel;
	const expNeededForLevel = expForNextLevel - expForLastLevel;
	const expPercentage = Math.max(0, Math.floor((expProgress / expNeededForLevel) * 100));

	const displayStatus = slot.status || pokemon.status;
	const statusColors: Record<Status, string> = { 'brn': '#F08030', 'par': '#F8D030', 'psn': '#A040A0', 'slp': '#9898E8', 'frz': '#98D8D8' };
	const statusTag = displayStatus ? `<span style="background-color: ${statusColors[displayStatus]}; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; text-transform: uppercase; vertical-align: middle; margin-left: 5px;">${displayStatus}</span>` : '';
	const confusedTag = slot.isConfused ? `<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Confused</span>` : '';
	// --- NEW TAGS ---
	const cursedTag = slot.isCursed ? `<span style="background-color: #705898; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Cursed</span>` : '';
	const seededTag = slot.isSeeded ? `<span style="background-color: #78C850; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Seeded</span>` : '';
	const nightmareTag = slot.hasNightmare ? `<span style="background-color: #503870; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Nightmare</span>` : '';
	const trappedTag = slot.isTrapped ? `<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Trapped</span>` : '';
	const tauntTag = slot.tauntTurns > 0 ? `<span style="background-color: #C03028; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Taunted</span>` : '';
	let chargingTag = '';
	if (slot.chargingMove) {
		const moveName = Dex.moves.get(slot.chargingMove).name || 'Attack';
		let chargeText = `Preparing ${moveName}!`;
		if (slot.chargingMove === 'fly') chargeText = 'Flew up high!';
		if (slot.chargingMove === 'dig') chargeText = 'Dug underground!';
		if (slot.chargingMove === 'dive') chargeText = 'Hid underwater!';
		chargingTag = `<span style="background-color: #6890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">${chargeText}</span>`;
	}

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

	const movesDisplay = pokemon.moves.map(m => {
		const moveData = Dex.moves.get(m.id);
		return `${moveData.name} (${m.pp}/${moveData.pp})`;
	}).slice(0, 4).join(', ') || 'None';
	// --- UPDATE RENDER LINE ---
	let html = `<div style="border: 1px solid #ccc; padding: 10px; margin: 5px; border-radius: 5px;"><psicon pokemon="${pokemon.species}" style="vertical-align: middle;"></psicon> <strong>${pokemon.nickname || pokemon.species}</strong> ${genderSymbol} ${shinySymbol} (Level ${pokemon.level})${statusTag}${confusedTag}${cursedTag}${seededTag}${nightmareTag}${trappedTag}${tauntTag}${chargingTag}${statStageTags}<br><small>Type: ${species.types.join('/')}</small><br><div style="background: #f0f0f0; border-radius: 10px; padding: 2px; margin: 5px 0;"><div style="background: ${hpBarColor}; width: ${hpPercentage}%; height: 10px; border-radius: 8px;"></div></div>HP: ${pokemon.hp}/${pokemon.maxHp}<br><div style="background: #f0f0f0; border-radius: 10px; padding: 2px; margin: 5px 0;"><div style="background: #6c9be8; width: ${expPercentage}%; height: 8px; border-radius: 8px;"></div></div>EXP: ${pokemon.experience}/${pokemon.expToNextLevel}<br>Nature: ${pokemon.nature}<br>Ability: ${pokemon.ability || 'Unknown'}<br>Moves: ${movesDisplay}`;
	if (pokemon.item) {
		html += `<br>Held Item: ${ITEMS_DATABASE[pokemon.item]?.name || pokemon.item}`;
	}
	if (showActions) {
		const itemButton = pokemon.item ?
			`<button name="send" value="/rpg takeitem ${pokemon.id}" class="button" style="font-size: 12px;">Take Item</button>` :
			`<button name="send" value="/rpg giveitem ${pokemon.id}" class="button" style="font-size: 12px;">Give Item</button>`;
		html += `<br><div style="margin-top: 10px;"><button name="send" value="/rpg summary ${pokemon.id}" class="button" style="font-size: 12px;">Summary</button> ${itemButton} <button name="send" value="/rpg depositpc ${pokemon.id}" class="button" style="font-size: 12px;">Deposit</button></div>`;
	}
	html += '</div>';
	return html;
}

function generateBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string }
): string {
	const [pSlot0, pSlot1] = battle.playerSlots;
	const [oSlot0, oSlot1] = battle.opponentSlots;

	// Helper to generate HTML for a single slot
	const generateSlotHTML = (slot: ActivePokemonSlot | null, slotIndex: number, side: 'player' | 'opponent') => {
		if (!slot) {
			return `<div style="flex-basis: 48%; border: 1px dashed #ccc; padding: 10px; margin: 5px; border-radius: 5px; min-height: 150px; text-align: center; color: #888;">(Empty Slot)</div>`;
		}
		if (slot.pokemon.hp <= 0) {
			return `<div style="flex-basis: 48%; opacity: 0.5; background: #f0f0f0;">${generatePokemonInfoHTML(slot)}</div>`;
		}
		
		let borderStyle = "1px solid #ccc";
		// Check if this slot is a pending target
		if (targetSelection && targetSelection.attackerSlotIndex !== slotIndex) {
			borderStyle = "3px dashed #007bff"; // Highlight as targetable
		}
		// Check if this slot has already acted
		if (battle.pendingActions[slotIndex]) {
			borderStyle = "3px solid #28a745"; // Green border for "Ready"
		}

		return `<div style="flex-basis: 48%; border: ${borderStyle};">${generatePokemonInfoHTML(slot)}</div>`;
	};

	let html = `<div class="infobox"><h2>Battle! (${battle.battleType})</h2>`;
	html += generateFieldEffectHTML(battle);

	// --- Opponent Side ---
	html += `<div><h3>${battle.opponentName}</h3><div style="display: flex; justify-content: space-around;">`;
	html += generateSlotHTML(oSlot0, 2, 'opponent');
	html += generateSlotHTML(oSlot1, 3, 'opponent');
	html += `</div></div><hr />`;

	// --- Player Side ---
	html += `<div><h3>Your Team</h3><div style="display: flex; justify-content: space-around;">`;
	html += generateSlotHTML(pSlot0, 0, 'player');
	html += generateSlotHTML(pSlot1, 1, 'player');
	html += `</div></div><hr />`;

	// --- Message Log ---
	html += `<div style="padding: 5px; margin: 10px 0; border: 1px solid #666; background: #f0f0f0; min-height: 50px;">${messageLog.join('<br>')}</div>`;

	// --- Action Area ---
	if (targetSelection) {
		// --- STATE 2: Target Selection ---
		const move = Dex.moves.get(targetSelection.moveId);
		html += `<p>Select a target for <strong>${move.name}</strong>:</p>`;
		html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">`;

		// TODO: This needs to be smarter based on move.target (e.g., 'ally', 'allAdjacentFoes')
		// For now, we'll just show all valid targets.
		const targets = [
			{ slot: pSlot0, name: "Ally 1", index: 0 },
			{ slot: pSlot1, name: "Ally 2", index: 1 },
			{ slot: oSlot0, name: "Foe 1", index: 2 },
			{ slot: oSlot1, name: "Foe 2", index: 3 },
		];

		for (const target of targets) {
			if (target.slot && target.slot.pokemon.hp > 0 && target.index !== targetSelection.attackerSlotIndex) {
				html += `<button name="send" value="/rpg battleaction move ${targetSelection.attackerSlotIndex} ${targetSelection.moveId} ${target.index}" class="button">${target.name} (${target.slot.pokemon.species})</button>`;
			}
		}
		html += `</div>`;
		html += `<p style="margin-top: 10px;"><button name="send" value="/rpg battleaction back" class="button">Cancel</button></p>`;
	} else {
		// --- STATE 1: Action Selection ---
		let activeSlot: ActivePokemonSlot | null = null;
		let activeSlotIndex: number = -1;

		// Find the next player slot that needs to act
		if (pSlot0 && pSlot0.pokemon.hp > 0 && !battle.pendingActions[0]) {
			activeSlot = pSlot0;
			activeSlotIndex = 0;
		} else if (pSlot1 && pSlot1.pokemon.hp > 0 && !battle.pendingActions[1]) {
			activeSlot = pSlot1;
			activeSlotIndex = 1;
		}

		if (activeSlot) {
			const pokemon = activeSlot.pokemon;
			html += `<p>What will <strong>${pokemon.species}</strong> do?</p>`;
			html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">`;

			const moves = pokemon.moves;
			for (const move of moves) {
				const moveData = Dex.moves.get(move.id);
				
				const isAssaultVestBlocked = battle.magicRoomTurns === 0 &&
					pokemon.item === 'assaultvest' &&
					moveData.category === 'Status';
				
				const isTauntBlocked = activeSlot.tauntTurns > 0 &&
					moveData.category === 'Status';

				const isDisabled = move.pp === 0 || isAssaultVestBlocked || isTauntBlocked ||
					(activeSlot.lockedMove && activeSlot.lockedMove !== move.id);

				html += `<button name="send" value="/rpg battleaction selecttarget ${activeSlotIndex} ${move.id}" class="button" ${isDisabled ? 'disabled style="background-color:#888;"' : ''}>${moveData.name}<br><small>PP: ${move.pp} / ${moveData.pp}</small></button>`;
			}
			html += `</div>`;
		} else {
			// All player Pokemon have actions queued
			html += `<p>Waiting for opponent...</p>`;
		}

		// --- Main Action Buttons (Catch, Switch, Run) ---
		const catchButton = (battle.battleType === 'wild' || battle.battleType === 'wild_double') ?
			`<button name="send" value="/rpg battleaction catchmenu" class="button">⚽ Catch</button>` :
			`<button class="button" disabled style="background-color:#888;">⚽ Catch</button>`;

		const runButton = (battle.battleType === 'wild' || battle.battleType === 'wild_double') ? // TODO: Add trap check
			`<button name="send" value="/rpg battleaction run" class="button">🏃 Run</button>` :
			`<button class="button" disabled style="background-color:#888;">🏃 Run</button>`;

		html += `<p style="margin-top: 15px;"><button name="send" value="/rpg battleaction switchmenu" class="button">🔄 Switch</button>${catchButton}${runButton}</p>`;
	}

	html += `</div>`;
	return html;
}

function generatePokemonSummaryHTML(pokemon: RPGPokemon): string {
	const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	const movesSummary = pokemon.moves.map(move => {
		const moveData = Dex.moves.get(move.id);
		return '<div style="text-align: center; padding: 5px; background: #f0f0f0; border-radius: 5px;">' +
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
		const move = Dex.moves.get(moveId);
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
	if (pokeBalls.length === 0) {
		html += `<p>You have no Poke Balls!</p>`;
	} else {
		html += `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">`;
		for (const ball of pokeBalls) {
			html += `<div style="text-align: center; padding: 8px; border: 1px solid #ccc; border-radius: 5px;"><strong>${ball.name}</strong><br><small>x${ball.quantity}</small><br><button name="send" value="/rpg battleaction catch ${ball.id}" class="button" style="font-size: 12px; margin-top: 5px;">Use</button></div>`;
		}
		html += `</div>`;
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
	return `<div class="infobox"><h2>Victory!</h2><p>You defeated the wild <strong>${defeatedOpponentNames}</strong>!</p><div style="background: #f0f0f0; padding: 10px; border-radius: 5px;">${expMessages.join('<br>')}</div><p>You found ₽${moneyGained}!</p><p><button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another Pokemon</button><button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
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

	// Find the first empty slot
	const slotToFill = battle.playerSlots[0] === null ? 0 : (battle.playerSlots[1] === null ? 1 : -1);

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
	const newMove = Dex.moves.get(queue.moveIds[0]);
	if (!pokemon || !newMove.exists) {
		delete player.pendingMoveLearnQueue;
		return `<h2>Error: Invalid Pokemon or move data.</h2><p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p>`;
	}
	let html = `<div class="infobox"><h2>Move Learning</h2><p><strong>${pokemon.species}</strong> wants to learn the move <strong>${newMove.name}</strong>!</p><p>However, ${pokemon.species} already knows four moves. Should a move be forgotten to make space for ${newMove.name}?</p><hr /><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">`;
	for (const move of pokemon.moves) {
		html += `<button name="send" value="/rpg learnmove ${move.id}" class="button">${Dex.moves.get(move.id).name}</button>`;
	}
	html += `</div><hr /><p>...or, give up on learning the move <strong>${newMove.name}</strong>?</p><button name="send" value="/rpg learnmove skip" class="button" style="background-color: #d9534f; color: white;">Forget ${newMove.name}</button></div>`;
	return html;
}

function generateGiveItemPokemonSelectionHTML(player: PlayerData, itemId: string): string {
	const item = ITEMS_DATABASE[itemId];
	if (!item) return `<h2>Item not found.</h2>`;

	let html = `<div class="infobox"><h2>Give ${item.name}</h2><p>Select a Pokémon to give this item to:</p>`;
	for (const pokemon of player.party) {
		html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;">` +
			`<span>${pokemon.species} (Holding: ${pokemon.item ? ITEMS_DATABASE[pokemon.item].name : 'None'})</span>` +
			`<button name="send" value="/rpg giveitem ${pokemon.id} ${itemId}" class="button" style="float: right;">Give</button>` +
		`</div>`;
	}
	html += `<hr /><p><button name="send" value="/rpg items" class="button">Back to Bag</button></p></div>`;
	return html;
}

function generatePivotSwitchHTML(battle: BattleState, messageLog: string[], pivotSlotIndex: number): string {
	let html = `<div class="infobox"><h2>A Pokémon is switching out!</h2><p>${messageLog.join('<br>')}</p>`;
	const player = getPlayerData(battle.playerId);
	const pivotingPokemon = battle.playerSlots[pivotSlotIndex]?.pokemon;

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
	let fieldEffects: string[] = [];
	let playerSide: string[] = [];
	let opponentSide: string[] = [];

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

/**************
* HTML UI ENDS
*************"/

/************
* COMMANDS
************/

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
				const confirmHTML = `<div class="infobox"><h2>Congratulations!</h2><p>You have chosen <strong>${species.name}</strong> as your starter!</p>${generatePokemonInfoHTML(starterPokemon)}<p>Your adventure begins now...</p><p><button name="send" value="/rpg menu" class="button">Continue</button></p></div>`;
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
			const newMoveData = Dex.moves.get(newMoveId);

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
				const oldMoveName = Dex.moves.get(pokemon.moves[moveIndex].id).name;
				pokemon.moves[moveIndex] = { id: newMoveId, pp: newMoveData.pp || 5 };
				message = `1, 2, and... Poof! <strong>${pokemon.species}</strong> forgot <strong>${oldMoveName}</strong> and learned <strong>${newMoveName}</strong>!`;
			}
			queue.moveIds.shift();
			if (queue.moveIds.length > 0) {
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			} else {
				delete player.pendingMoveLearnQueue;
				const resultHTML = `<div class="infobox"><h2>Move Learning Result</h2><p>${message}</p>${generatePokemonInfoHTML(pokemon)}<p><button name="send" value="/rpg menu" class="button">Continue</button></p></div>`;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
			}
		},

		learneggmove(target, room, user) {
			const player = getPlayerData(user.id);
			const [pokemonId, rawMoveId] = target.split(' ');
			if (!pokemonId || !rawMoveId) {
				return this.errorReply("Invalid command parameters.");
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party.");
			}
			const speciesId = toID(pokemon.species);
			const eggMoves = MANUAL_LEARNSETS[speciesId]?.egg || [];
			if (!eggMoves.includes(rawMoveId)) {
				return this.errorReply("This is not a valid Egg Move for this Pokemon.");
			}
			if (!removeItemFromInventory(player, 'eggmovetutor', 1)) {
				// This is a safety check in case the player somehow lost the item after initiating the command
				return this.errorReply("Could not use the Egg Move Tutor. Item not found in inventory.");
			}

			const newMoveId = toID(rawMoveId);

			if (pokemon.moves.length < 4) {
				const newMoveData = Dex.moves.get(newMoveId);
				pokemon.moves.push({ id: newMoveId, pp: newMoveData.pp || 5 });
				const resultHTML = `<div class="infobox"><h2>Move Learned!</h2><p><strong>${pokemon.species}</strong> learned <strong>${newMoveData.name}</strong>!</p>${generatePokemonInfoHTML(pokemon)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
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
						partyHTML += `<div><strong>Slot ${i + 1}:</strong><br>${generatePokemonInfoHTML(player.party[i], true)}</div>`;
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

				const resultHTML = `<div class="infobox"><h2>Item Used!</h2><p>${result.message}</p>${generatePokemonInfoHTML(targetPokemon)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
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
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Pokemon Withdrawn</h2><p><strong>${pokemon.species}</strong> has been withdrawn from the PC!</p>${generatePokemonInfoHTML(pokemon)}<p><button name="send" value="/rpg pc" class="button">View PC</button><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`);
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
					exploreButtons += `<button name="send" value="/rpg wildpokemon ${zoneId}" class="button">🛤️ ${zone.name}</button>`;
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
					opponentParty: opponentParty,
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
					playerShouldSwitch: false,
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
				});

				this.sendReply(`|uhtml|rpg-${user.id}|${generateBattleHTML(activeBattles.get(user.id)!, battleMessages)}`);
			} catch (error) {
				this.errorReply(`Error generating wild Pokémon: ${error}`);
			}
		},

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
						const moveData = Dex.moves.get(moveId);
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
				playerShouldSwitch: false,
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
			});

			const startMessage = trainerSpec.dialogue?.start || `You are challenged by ${trainerSpec.name}!`;
			this.sendReply(`|uhtml|rpg-${user.id}|${generateBattleHTML(activeBattles.get(user.id)!, [startMessage])}`);
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

				// --- NEW COMMAND STRUCTURE ---
				// /rpg battleaction move [attackerSlot] [moveId] [targetSlot]
				// e.g., /rpg battleaction move 0 tackle 2
				const [attackerSlotStr, moveId, targetSlotStr] = target.split(' ');
				const attackerSlotIndex = parseInt(attackerSlotStr);
				const targetSlotIndex = parseInt(targetSlotStr);

				if (isNaN(attackerSlotIndex) || !moveId || isNaN(targetSlotIndex)) {
					// This is now a user-facing error, but we'll show it in the UI
					// to guide them, as this command will be sent by buttons.
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Error: Invalid move command received."])}`);
				}

				// Validate attacker slot
				if (attackerSlotIndex !== 0 && attackerSlotIndex !== 1) {
					return this.errorReply("Invalid attacker slot. Must be 0 or 1.");
				}
				const attackerSlot = battle.playerSlots[attackerSlotIndex];
				if (!attackerSlot || attackerSlot.pokemon.hp <= 0) {
					return this.errorReply("This Pokémon is not in battle or has fainted.");
				}

				// Check if action is already registered
				if (battle.pendingActions[attackerSlotIndex]) {
					return this.errorReply(`${attackerSlot.pokemon.species} is already waiting to move.`);
				}

				// Validate move
				const moveData = Dex.moves.get(toID(moveId));
				if (!moveData.exists) {
					return this.errorReply(`Move '${moveId}' not found.`);
				}
				const moveObject = attackerSlot.pokemon.moves.find(m => m.id === moveData.id);
				if (!moveObject && moveData.id !== 'struggle') {
					return this.errorReply(`${attackerSlot.pokemon.species} does not know ${moveData.name}.`);
				}

				// --- Pre-action validation (send feedback to UI) ---
				if (attackerSlot.tauntTurns > 0 && moveData.category === 'Status') {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${attackerSlot.pokemon.species} is taunted! It can't use ${moveData.name}!`])}`);
				}
				if (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'assaultvest' && moveData.category === 'Status') {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`Your Assault Vest prevents you from using ${moveData.name}!`])}`);
				}
				if (moveObject && moveObject.pp === 0) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`There is no PP left for ${moveData.name}!`])}`);
				}

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
					// This call will be implemented in Step 4
					processTurn(this, battle, room, user);
				} else {
					// Waiting for other player's move
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
				}
			},

			selecttarget(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const [attackerSlotStr, moveId] = target.split(' ');
				const attackerSlotIndex = parseInt(attackerSlotStr);

				if (isNaN(attackerSlotIndex) || !moveId) {
					return this.errorReply("Invalid command.");
				}

				// Re-render the UI in "target selection" mode
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`Select a target for ${Dex.moves.get(moveId).name}.`], { attackerSlotIndex, moveId })}`);
			},

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
					// We just send them back to the battle.
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
				
				// Check if the slot is actually empty
				if (battle.playerSlots[slotToFill] !== null) {
					return this.errorReply("This slot is not empty.");
				}
				
				// --- Execute the Switch ---
				const [nextPokemon] = player.party.splice(partyIndex, 1);
				const newSlot = createActivePokemonSlot(nextPokemon);
				battle.playerSlots[slotToFill] = newSlot;

				// Add the Pokemon that was in the slot (fainted or pivoted) back to the party
				// TODO: This logic is missing. The fainted/pivoting Pokemon needs to be moved from the slot to the party.
				// For now, we assume the slot was just set to 'null' and the Pokemon is "in limbo".
				// This needs to be fixed. Let's assume the fainted Pokemon is already "gone".
				// For U-turn, we need to handle this.
				
				const playerColor = '#007bff';
				const infoColor = '#dc3545';
				const messageLog = [`<span style="color: ${playerColor};">Go, ${nextPokemon.species}!</span>`];

				// --- Apply Hazards ---
				const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot.pokemon, battle, true, messageLog);
				if (faintedOnEntry) {
					messageLog.push(`<span style="color: ${infoColor};"><strong>${newSlot.pokemon.species} fainted upon entry!</strong></span>`);
				} else {
					handleMirrorHerb(newSlot.pokemon, battle, messageLog);
				}

				// --- Check if more switches are needed ---
				const needsAnotherSwitch = battle.playerSlots.some(s => s === null) &&
					player.party.some(p => p.hp > 0);
					
				if (needsAnotherSwitch) {
					// Another slot is empty, show the switch screen again
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
				} else {
					// All slots are filled, continue the battle
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
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
				
				// TODO: Add check for Arena Trap, etc.
				// if (outgoingSlot.isTrapped) { ... }

				const player = getPlayerData(battle.playerId);
				
				// Check if incoming Pokemon is valid
				const incomingPokemon = player.party.find(p => p.id === pokemonIdIn && p.hp > 0);
				if (!incomingPokemon) {
					return this.errorReply("Invalid Pokemon or it has fainted.");
				}
				if (battle.playerSlots.some(s => s?.pokemon.id === pokemonIdIn)) {
					return this.errorReply("This Pokemon is already in battle.");
				}

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

			catch(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");
				
				// --- NEW CHECK ---
				if (battle.battleType === 'trainer') {
					this.errorReply("You can't catch a Trainer's Pokémon!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);
				}
				
				battle.turn++;

				const player = getPlayerData(battle.playerId);
				const ballId = toID(target);
				const ballItem = player.inventory.get(ballId);

				if (!ballItem || ballItem.category !== 'pokeball' || ballItem.quantity < 1) {
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

				const catchResult = performCatchAttempt(battle, ballId);
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

					const caughtPokemon = battle.opponentActivePokemon;
					caughtPokemon.caughtIn = ballId; // Set the ball it was caught in!

					if (ballId === 'healball') {
						caughtPokemon.hp = caughtPokemon.maxHp;
						caughtPokemon.status = null;
					}

					const location = player.party.length < 6 ? "your party" : "PC";
					if (player.party.length < 6) { player.party.push(caughtPokemon); } else { storePokemonInPC(player, caughtPokemon); }

					let successMessage = `<h2>Gotcha!</h2><p><strong>${caughtPokemon.species}</strong> was caught!</p>`;
					if (ballId === 'healball') successMessage += `<p>${caughtPokemon.species} was fully healed!</p>`;

					const successHTML = `<div class="infobox">` + `${successMessage}` +
						`${generatePokemonInfoHTML(caughtPokemon)}` +
						`<p>${caughtPokemon.species} has been sent to ${location}.</p>` +
						`<p><button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another</button>` +
						`<button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${successHTML}`);
				} else {
					messageLog.push(`<span style="color: ${infoColor};"><strong>${shakeMessages[catchResult.shakes]}</strong></span>`);

					const opponentMoveObject = battle.opponentActivePokemon.moves[Math.floor(Math.random() * battle.opponentActivePokemon.moves.length)];
					const opponentMoveData = Dex.moves.get(opponentMoveObject.id);
					battle.opponentMoveId = opponentMoveData.id;

					executeMove(battle.opponentActivePokemon, battle.activePokemon, opponentMoveData, opponentMoveObject, battle, messageLog);

					if (battle.activePokemon.hp > 0) {
						processEndOfTurn(battle, messageLog);
					}

					const battleEnded = checkBattleEndCondition(this, battle, room, user, messageLog);
					if (!battleEnded) {
						this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
					}
				}
			},

			run(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				// --- NEW CHECK ---
				if (battle.battleType === 'trainer') {
					this.errorReply("You can't run from a Trainer battle!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't run from a Trainer battle!"])}`);
				}

				if (battle.playerIsTrapped) {
					this.errorReply(`${battle.activePokemon.species} is trapped and cannot escape!`);
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
					const moveData = Dex.moves.get(move.id);
					move.pp = moveData.pp || 5;
				}
			}

			// Reset any active choice locks since PP was restored
			const battle = activeBattles.get(user.id);
			if (battle) {
				battle.playerLockedMove = undefined;
			}

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
					html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg giveitem ${pokemon.id}" class="button">${pokemon.species}</button> (Currently holding: ${pokemon.item ? ITEMS_DATABASE[pokemon.item].name : 'None'})</div>`;
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
				addItemToInventory(player, pokemon.item, 1);
			}

			pokemon.item = itemId;
			removeItemFromInventory(player, itemId, 1);

			const resultHTML = `<div class="infobox"><h2>Item Given</h2><p><strong>${pokemon.species}</strong> is now holding the <strong>${item.name}</strong>!</p>${generatePokemonInfoHTML(pokemon, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
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
						html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg takeitem ${pokemon.id}" class="button">${pokemon.species}</button> (Holding: ${ITEMS_DATABASE[pokemon.item].name})</div>`;
					}
				}
				html += `<hr /><p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokémon not found in your party.");
			if (!pokemon.item) return this.errorReply(`${pokemon.species} is not holding an item.`);

			const item = ITEMS_DATABASE[pokemon.item];
			addItemToInventory(player, pokemon.item, 1);
			pokemon.item = undefined;

			const resultHTML = `<div class="infobox"><h2>Item Taken</h2><p>You took the <strong>${item.name}</strong> from <strong>${pokemon.species}</strong>.</p>${generatePokemonInfoHTML(pokemon, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
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

			const resultHTML = `<div class="infobox"><h2>Nickname Changed!</h2><p>Changed <strong>${oldNickname}</strong>'s name to <strong>${pokemon.nickname}</strong>!</p>${generatePokemonInfoHTML(pokemon, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
		},

		help() {
			return this.parse('/help rpg');
		},
		'': 'help',
	},
};

export const helpData = [
	"/rpg start - Start your Pokemon RPG adventure",
	"/rpg menu - Access the main RPG menu",
	"/rpg profile - View your trainer profile",
	"/rpg party - View your Pokemon party",
	"/rpg summary [pokemon id] - View a detailed summary of a Pokemon in your party",
	"/rpg battle - Access battle options",
	"/rpg wildpokemon - Find and battle a wild Pokemon",
	"/rpg challenge [trainer id] - Challenge a trainer to a battle",
	"/rpg items - View your inventory",
	"/rpg pc - Access Pokemon PC storage system",
	"/rpg heal - Restore your party's HP, PP, and status conditions.",
	"/rpg learnmove [move to replace | skip] - Make a decision on learning a new move",
	"/rpg giveitem [pokemon id] [item id] - Give a held item to a Pokémon.",
	"/rpg takeitem [pokemon id] - Take a held item from a Pokémon.",
];
