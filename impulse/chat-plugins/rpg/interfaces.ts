// =================================================================
// ## 1. Foundational Types
// Basic, reusable building blocks for other interfaces.
// =================================================================

/** A standard representation of a Pokémon's six core stats. */
type BaseStats = {
	hp: number;
	atk: number;
	def: number;
	spa: number;
	spd: number;
	spe: number;
};

/** Represents Individual Values (IVs) for a Pokémon (0-31). */
type IVs = BaseStats;

/** Represents Effort Values (EVs) for a Pokémon (0-252 per stat, 510 total). */
type EVs = BaseStats;

/** Represents temporary stat stage changes in battle (-6 to +6). */
type StatStages = BaseStats & {
	accuracy: number;
	evasion: number;
};

/** Represents a single move a Pokémon knows. */
interface PokemonMove {
	/** The unique ID of the move (e.g., 'thunderbolt'). */
	id: string;
	/** The current Power Points. */
	pp: number;
}

// =================================================================
// ## 2. Core Pokémon Interface
// Defines a single, unique instance of a Pokémon.
// =================================================================

/**
 * Represents a single instance of a Pokémon, with all the data
 * needed for both out-of-battle management and in-battle calculations.
 */
interface RPGPokemon {
	/** A unique instance ID for this specific Pokémon. */
	instanceId: string;
	/** The species ID (e.g., 'pikachu'). */
	speciesId: string;
	/** The player-given nickname. Defaults to the species name. */
	nickname: string;
	/** The current level. */
	level: number;
	/** The current HP. */
	hp: number;
	/** Gender of the Pokémon ('M', 'F', or 'N' for none). */
	gender: 'M' | 'F' | 'N';
	/** The Pokémon's current status condition (e.g., 'psn', 'brn'). Null if healthy. */
	status: 'psn' | 'brn' | 'par' | 'slp' | 'frz' | null;

	/** The Pokémon's stats after all calculations (level, IVs, EVs, nature). */
	stats: BaseStats;
	/** The Pokémon's Individual Values (0-31). */
	ivs: IVs;
	/** The Pokémon's Effort Values (0-252 per stat, 510 total). */
	evs: EVs;

	/** The four moves this Pokémon knows. */
	moves: PokemonMove[];
	/** The Pokémon's ability ID (e.g., 'static'). */
	ability: string;
	/** The ID of the held item. Null if no item is held. */
	item: string | null;
	/** The Pokémon's nature ID (e.g., 'Timid'). */
	nature: string;
	/** Indicates if the Pokémon is shiny. */
	shiny: boolean;
	
	/** The total experience points earned. */
	experience: number;
	/** The Pokémon's friendship value (0-255). */
	friendship: number;

	/** The Pokémon's Tera Type (e.g., 'Electric'). */
	teraType: string;
	/** Flag indicating if this Pokémon has the Gigantamax factor. */
	canGigantamax: boolean;

	/** Information about where and when the Pokémon was met. */
	metData: {
		metLevel: number;
		metLocation: string;
		metDate: string; // ISO 8601 format
		ball: string; // The ID of the Poké Ball it was caught in
	};

	/** Status of the Pokérus virus. */
	pokerus: {
		infected: boolean;
		cured: boolean;
	};

	/** A list of ribbons this Pokémon has earned. */
	ribbons: string[];
}

// =================================================================
// ## 3. Player, Inventory, and Progression Interfaces
// Defines the player's save file and progress.
// =================================================================

/** Represents a single item in the inventory. */
interface InventoryItem {
	id: string;
	quantity: number;
}

/** Organizes the inventory into different pockets, like in the games. */
interface InventoryPockets {
	medicine: Map<string, InventoryItem>;
	pokeballs: Map<string, InventoryItem>;
	battleItems: Map<string, InventoryItem>;
	heldItems: Map<string, InventoryItem>;
	keyItems: Map<string, InventoryItem>;
	misc: Map<string, InventoryItem>;
}

/** Tracks Pokédex completion status for each species. */
interface Pokedex {
	/** Key is the species ID (e.g., 'bulbasaur'). */
	[speciesId: string]: {
		seen: boolean;
		caught: boolean;
	};
}

/** Represents a single Gym Badge and its associated effects. */
interface Badge {
	/** The unique ID for the badge (e.g., 'boulder-badge'). */
	id: string;
	/** The display name of the badge (e.g., 'Boulder Badge'). */
	name: string;
	/** The Gym Leader who awards the badge. */
	gymLeader: string;
	/** The location where the badge is earned. */
	location: string;
	
	/** The gameplay effects this badge unlocks. */
	effects: {
		/** The maximum level at which traded Pokémon will obey the player. */
		obedienceLevel: number;
		/** The ID of the HM or field move this badge allows the player to use. */
		fieldMoveUnlock?: string; // e.g., 'cut', 'surf'
		/** Optional stat boost granted by the badge (as seen in some generations). */
		statBoost?: {
			stat: 'atk' | 'def' | 'spa' | 'spd' | 'spe';
			multiplier: number;
		};
	};
}

/** Represents a single story objective or quest (main or side). */
interface Quest {
    /** The unique ID for the quest (e.g., 'mq01_oaks_parcel'). */
    id: string;
    /** The title displayed to the player (e.g., "Professor Oak's Parcel"). */
    title: string;
    /** The description of the objective shown in the quest log. */
    description: string;
    
    /** The story flags required to be true before this quest can be started. */
    prerequisites: string[];
    /** The story flags that will be set to true upon completion of this quest. */
    completionFlags: string[];

    /** Optional rewards for completing the quest. */
    rewards?: {
        money?: number;
        items?: { id: string; quantity: number }[];
    };
}

/** Represents the entire save file for a player. */
interface PlayerData {
	/** The player's user ID. */
	id: string;
	/** The player's in-game name. */
	name: string;
	/** The player's Trainer ID number. */
	trainerId: number;
	/** The player's Secret ID number (used for shiny calculation). */
	secretId: number;

	/** The player's current party of up to 6 Pokémon. */
	party: RPGPokemon[];
	/** The player's Pokémon storage (PC). */
	pc: RPGPokemon[];
	/** The player's entire inventory, organized by pocket. */
	inventory: InventoryPockets;
	/** The player's Pokédex data. */
	pokedex: Pokedex;
	
	/** The player's current money. */
	money: number;
	/** The player's current location in the game world. */
	location: {
		mapId: string;
		x: number;
		y: number;
	};
	
	/** A record of story flags to track game progression. */
	storyFlags: Record<string, boolean>;
	/** A list of earned gym badge IDs. */
	gymBadges: string[];
    /** A log of the player's quests and their status. */
    questLog: Record<string, 'active' | 'completed'>;
	/** Total time played, in seconds. */
	timePlayedInSeconds: number;
}

// =================================================================
// ## 4. Battle Interfaces
// Designed to handle single, double, or multi-battles.
// =================================================================

/** Represents one side of a battle (a player, an opponent, or allies). */
interface BattleSide {
	/** The ID of the trainer controlling this side. Can be a player ID or an NPC ID. */
	trainerId: string;
	/** The full party of Pokémon for this side. */
	party: RPGPokemon[];
	/**
	 * The Pokémon currently active on the field.
	 * An array to support multi-battles. e.g., in Doubles, this will have 2 Pokémon.
	 */
	active: (RPGPokemon | null)[];
	
	/** Entry hazards on this side of the field (e.g., 'spikes', 'stealthrock'). */
	hazards: string[];
	/** Active screens on this side (e.g., 'reflect', 'lightscreen'). */
	screens: {
		[screenId: string]: {
			currentTurns: number;
			totalTurns: number;
		}
	};
}

/** Represents the complete state of an ongoing battle. */
interface BattleState {
	/** A unique ID for this battle instance. */
	battleId: string;
	/** The type of battle being fought. */
	battleType: 'wild' | 'trainer' | 'raid' | 'wild-double' | 'trainer-double';
	
	/** An array containing all sides participating in the battle. Usually 2. */
	sides: [BattleSide, BattleSide];
	
	/** The current turn number. */
	turn: number;
	
	/** Global field effects. */
	field: {
		weather?: { type: string; turns: number; };
		terrain?: { type: string; turns: number; };
		pseudoWeather?: { [effectId: string]: { turns: number; } }; // For Trick Room, etc.
	};
}
