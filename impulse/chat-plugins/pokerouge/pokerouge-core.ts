/*
 * PokeRouge Core — types, constants, data persistence, and game helpers.
 * Imported by pokerouge.ts and pokerouge-battle.ts.
 * This file does NOT export Chat plugin hooks (commands/handlers/pages/start).
 */

import { FS } from '../../../lib';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DATA_FILE = 'impulse/db/pokerouge.json';

/**
 * Tags that identify Legendary / Mythical / Special Pokemon.
 * These are excluded from normal starters but can appear in milestone rewards
 * at higher floors.
 */
export const LEGENDARY_TAGS = new Set<string>([
	'Sub-Legendary', 'Restricted Legendary', 'Mythical', 'Ultra Beast', 'Paradox',
]);

/**
 * Default level thresholds for evolution types that don't have a natural level.
 * In PokeRouge, ALL evolutions happen by gaining levels — no items or trading needed.
 */
const EVO_TYPE_FALLBACK_LEVEL: Partial<Record<string, number>> = {
	trade: 36,
	useItem: 36,
	levelFriendship: 20,
	levelMove: 30,
	levelExtra: 20,
	levelHold: 30,
	// 'other' (e.g. Shedinja) is skipped — too special to auto-handle
};

// ---------------------------------------------------------------------------
// Shop item definitions
// ---------------------------------------------------------------------------

export interface ShopItem {
	id: string;
	name: string;
	description: string;
	cost: number;
	/** If set, this item is a held item equipped to one Pokemon for the next battle. */
	heldItem?: string;
}

/** All purchasable items in the PokeRouge shop. */
export const SHOP_ITEMS: Record<string, ShopItem> = {
	// ---- Special roguelite consumables ----
	rarecandy: {
		id: 'rarecandy',
		name: 'Rare Candy',
		description: 'Instantly grants +5 levels to one of your Pokemon.',
		cost: 100,
	},
	luckycharm: {
		id: 'luckycharm',
		name: 'Lucky Charm',
		description: 'Doubles EXP and coins earned for the next 3 floors.',
		cost: 150,
	},
	revive: {
		id: 'revive',
		name: 'Revive',
		description: 'Grants a second chance — if you lose your next battle you retry the same floor.',
		cost: 200,
	},
	// ---- Survival / bulk items ----
	focussash: {
		id: 'focussash',
		name: 'Focus Sash',
		description: 'Survive any one-hit KO at 1 HP.',
		cost: 120,
		heldItem: 'focussash',
	},
	leftovers: {
		id: 'leftovers',
		name: 'Leftovers',
		description: 'Gradually restores HP each turn.',
		cost: 100,
		heldItem: 'leftovers',
	},
	eviolite: {
		id: 'eviolite',
		name: 'Eviolite',
		description: 'Boosts Defense and Sp. Def by 50% for unevolved Pokemon.',
		cost: 100,
		heldItem: 'eviolite',
	},
	rockyhelmet: {
		id: 'rockyhelmet',
		name: 'Rocky Helmet',
		description: 'Damages the attacker 1/6 max HP when hit by a contact move.',
		cost: 80,
		heldItem: 'rockyhelmet',
	},
	heavydutyboots: {
		id: 'heavydutyboots',
		name: 'Heavy-Duty Boots',
		description: 'Prevents all entry hazard damage.',
		cost: 100,
		heldItem: 'heavydutyboots',
	},
	airballoon: {
		id: 'airballoon',
		name: 'Air Balloon',
		description: 'Makes the holder immune to Ground-type moves until hit.',
		cost: 60,
		heldItem: 'airballoon',
	},
	blacksludge: {
		id: 'blacksludge',
		name: 'Black Sludge',
		description: 'Restores HP for Poison-types; damages all other types.',
		cost: 80,
		heldItem: 'blacksludge',
	},
	// ---- Offensive choice items ----
	choiceband: {
		id: 'choiceband',
		name: 'Choice Band',
		description: 'Boosts Attack by 50%, but locks into one move.',
		cost: 80,
		heldItem: 'choiceband',
	},
	choicespecs: {
		id: 'choicespecs',
		name: 'Choice Specs',
		description: 'Boosts Sp. Atk by 50%, but locks into one move.',
		cost: 80,
		heldItem: 'choicespecs',
	},
	choicescarf: {
		id: 'choicescarf',
		name: 'Choice Scarf',
		description: 'Boosts Speed by 50%, but locks into one move.',
		cost: 80,
		heldItem: 'choicescarf',
	},
	lifeorb: {
		id: 'lifeorb',
		name: 'Life Orb',
		description: 'Boosts all moves by 30% at the cost of 10% HP per hit.',
		cost: 120,
		heldItem: 'lifeorb',
	},
	expertbelt: {
		id: 'expertbelt',
		name: 'Expert Belt',
		description: 'Boosts super-effective moves by 20% with no drawback.',
		cost: 80,
		heldItem: 'expertbelt',
	},
	wiseglasses: {
		id: 'wiseglasses',
		name: 'Wise Glasses',
		description: 'Boosts Sp. Atk by 10% without any downside.',
		cost: 60,
		heldItem: 'wiseglasses',
	},
	muscleband: {
		id: 'muscleband',
		name: 'Muscle Band',
		description: 'Boosts Attack by 10% without any downside.',
		cost: 60,
		heldItem: 'muscleband',
	},
	// ---- Defensive / utility items ----
	assaultvest: {
		id: 'assaultvest',
		name: 'Assault Vest',
		description: 'Boosts Sp. Def by 50%; prevents status moves.',
		cost: 100,
		heldItem: 'assaultvest',
	},
	clearamulet: {
		id: 'clearamulet',
		name: 'Clear Amulet',
		description: 'Prevents the holder\'s stats from being lowered by opponents.',
		cost: 80,
		heldItem: 'clearamulet',
	},
	boosterenergy: {
		id: 'boosterenergy',
		name: 'Booster Energy',
		description: 'Activates the highest stat of a Paradox Pokemon.',
		cost: 120,
		heldItem: 'boosterenergy',
	},
	protectivepads: {
		id: 'protectivepads',
		name: 'Protective Pads',
		description: 'Prevents the effects of contact moves from activating.',
		cost: 70,
		heldItem: 'protectivepads',
	},
	safetygoggles: {
		id: 'safetygoggles',
		name: 'Safety Goggles',
		description: 'Protects from weather damage and powder/spore moves.',
		cost: 70,
		heldItem: 'safetygoggles',
	},
	// ---- Berries ----
	sitrusberry: {
		id: 'sitrusberry',
		name: 'Sitrus Berry',
		description: 'Restores 25% HP when below 50% HP.',
		cost: 40,
		heldItem: 'sitrusberry',
	},
	aguavberry: {
		id: 'aguavberry',
		name: 'Aguav Berry',
		description: 'Restores 1/3 HP when below 25% HP (may cause confusion).',
		cost: 30,
		heldItem: 'aguavberry',
	},
	// ---- Status / misc ----
	flameorb: {
		id: 'flameorb',
		name: 'Flame Orb',
		description: 'Burns the holder at end of turn (great with Guts/Marvel Scale).',
		cost: 60,
		heldItem: 'flameorb',
	},
	toxicorb: {
		id: 'toxicorb',
		name: 'Toxic Orb',
		description: 'Badly poisons the holder at end of turn (great with Poison Heal).',
		cost: 60,
		heldItem: 'toxicorb',
	},
	whiteherb: {
		id: 'whiteherb',
		name: 'White Herb',
		description: 'Restores any lowered stats once, then is consumed.',
		cost: 50,
		heldItem: 'whiteherb',
	},
	powerherb: {
		id: 'powerherb',
		name: 'Power Herb',
		description: 'Allows a two-turn move to fire immediately once, then is consumed.',
		cost: 40,
		heldItem: 'powerherb',
	},
	throatspray: {
		id: 'throatspray',
		name: 'Throat Spray',
		description: 'Boosts Sp. Atk after using a sound-based move once.',
		cost: 60,
		heldItem: 'throatspray',
	},
	blunderpolicy: {
		id: 'blunderpolicy',
		name: 'Blunder Policy',
		description: 'Sharply boosts Speed when a move misses.',
		cost: 80,
		heldItem: 'blunderpolicy',
	},
	shedshell: {
		id: 'shedshell',
		name: 'Shed Shell',
		description: 'Allows the holder to switch out regardless of trapping moves.',
		cost: 50,
		heldItem: 'shedshell',
	},
};

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

export interface PokemonEntry {
	species: string;
	level: number;
	exp: number;
	/** Held item to equip in the next battle (cleared after battle ends). */
	heldItem?: string;
}

export interface PokeRougeState {
	floor: number;
	team: PokemonEntry[];
	/** If set, player is being prompted to choose a starter (or a new team addition). */
	pendingChoice?: string[];
	/** 'starter' | 'add' — what the pending choice is for. */
	pendingChoiceType?: 'starter' | 'add';
	/** roomid of an ongoing battle, if any. */
	battleRoomId?: string;
	/** Coins earned from floor victories (used in the item shop). */
	coins?: number;
	/** Inventory: item ID → quantity. */
	items?: Record<string, number>;
	/** Floors remaining where EXP and coins are doubled (Lucky Charm effect). */
	doubleExpFloors?: number;
	/** If true, the next loss will retry the same floor instead of resetting the run. */
	hasRevive?: boolean;
	/** Highest floor ever reached — tracked for the leaderboard. */
	highestFloor?: number;
	/** Display name (updated each login) — used for the leaderboard. */
	displayName?: string;
	/** Number of floors won in the current run. */
	streaksWon?: number;
	/** Current shop rotation — item IDs available this refresh. */
	shopInventory?: string[];
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

type SavedData = Record<string, PokeRougeState>;
export let savedData: SavedData = {};

function saveData(): void {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(savedData), { throttle: 3000 });
}

async function loadData(): Promise<void> {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) savedData = JSON.parse(raw);
	} catch {
		savedData = {};
	}
}

void loadData();

export function getState(userid: string): PokeRougeState | null {
	return savedData[userid] ?? null;
}

export function setState(userid: string, state: PokeRougeState): void {
	savedData[userid] = state;
	saveData();
}

export function deleteState(userid: string): void {
	delete savedData[userid];
	saveData();
}

// ---------------------------------------------------------------------------
// Pokemon selection helpers
// ---------------------------------------------------------------------------

/** Cached list of non-legendary base-form official Pokemon IDs. */
let regularPokemonCache: string[] | null = null;
/** Cached list of legendary/mythical base-form official Pokemon IDs. */
let legendaryPokemonCache: string[] | null = null;

/** Returns all regular (non-legendary) base-form official Pokemon IDs. */
function getRegularPokemon(): string[] {
	if (regularPokemonCache) return regularPokemonCache;
	const all = Dex.species.all();
	regularPokemonCache = all
		.filter(s =>
			s.exists &&
			s.num > 0 &&
			!s.isNonstandard &&
			!s.prevo &&
			s.baseSpecies === s.name &&
			!s.tags.some(tag => LEGENDARY_TAGS.has(tag))
		)
		.map(s => toID(s.name));
	return regularPokemonCache;
}

/** Returns all legendary/mythical base-form official Pokemon IDs. */
function getLegendaryPokemon(): string[] {
	if (legendaryPokemonCache) return legendaryPokemonCache;
	const all = Dex.species.all();
	legendaryPokemonCache = all
		.filter(s =>
			s.exists &&
			s.num > 0 &&
			!s.isNonstandard &&
			!s.prevo &&
			s.baseSpecies === s.name &&
			s.tags.some(tag => LEGENDARY_TAGS.has(tag))
		)
		.map(s => toID(s.name));
	return legendaryPokemonCache;
}

/** Fisher-Yates shuffle a copy of `pool` and return `n` items, excluding `exclude`. */
function pickRandom(pool: string[], n: number, exclude: string[] = []): string[] {
	const filtered = pool.filter(id => !exclude.includes(id));
	const shuffled = filtered.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, n);
}

/**
 * Pick `n` completely random regular (non-legendary) base-form Pokemon,
 * excluding any already in `exclude`.
 */
export function pickRandomPokemon(n: number, exclude: string[] = []): string[] {
	return pickRandom(getRegularPokemon(), n, exclude);
}

/**
 * Pick 3 completely random level-1 base-form Pokemon for the starter selection screen.
 * Legendary/Mythical Pokemon are always excluded from the starter pool.
 */
export function pickStarterOptions(): string[] {
	return pickRandomPokemon(3);
}

/**
 * Returns 3 random Pokemon for the "add to team" milestone offer.
 * At floor 20+ there is a small chance that one Legendary/Mythical appears.
 * At floor 40+ that chance doubles.
 */
export function pickNewPokemonOptions(currentTeam: PokemonEntry[], floor: number): string[] {
	const existing = currentTeam.map(m => m.species);
	const legendaryChance = floor >= 40 ? 0.25 : floor >= 20 ? 0.12 : 0;

	if (legendaryChance > 0 && Math.random() < legendaryChance) {
		const legendaries = pickRandom(getLegendaryPokemon(), 1, existing);
		if (legendaries.length) {
			const regular = pickRandomPokemon(2, [...existing, ...legendaries]);
			return pickRandom([...regular, ...legendaries], 3);
		}
	}
	return pickRandomPokemon(3, existing);
}

// ---------------------------------------------------------------------------
// EXP / levelling / evolution helpers
// ---------------------------------------------------------------------------

/**
 * Returns the level-based evolution for a species, if one exists.
 * In PokeRouge all evolutions are unlocked by levelling up.
 */
export function getLevelUpEvo(speciesId: string): { evoTo: string, evoLevel: number } | null {
	const species = Dex.species.get(toID(speciesId));
	if (!species.exists || !species.evos.length) return null;

	for (const evoName of species.evos) {
		const evo = Dex.species.get(toID(evoName));
		if (evo.evoType === 'other') continue;

		const fallback = evo.evoType ? (EVO_TYPE_FALLBACK_LEVEL[evo.evoType] ?? 36) : 36;
		const evoLevel = evo.evoLevel ?? fallback;
		if (evoLevel > 0) {
			return { evoTo: toID(evoName), evoLevel };
		}
	}
	return null;
}

/** Total EXP needed to reach a given level from level 1. */
export function expForLevel(level: number): number {
	return 15 * level * (level - 1);
}

/** EXP awarded for winning a floor. */
export function floorExpReward(floor: number): number {
	return 50 + floor * 15;
}

/** Coins awarded for winning a floor. */
export function floorCoinReward(floor: number): number {
	return 30 + floor * 10;
}

/** Bot Pokemon level for a given floor: starts at 5 and grows by ~1.5 per floor, capped at 100. */
function botLevel(floor: number): number {
	return Math.min(100, 5 + Math.floor((floor - 1) * 1.5));
}

/** Number of Pokemon on the bot's team for a given floor. */
function botTeamSize(floor: number): number {
	if (floor <= 5) return 1;
	if (floor <= 10) return 2;
	if (floor <= 20) return 3;
	if (floor <= 30) return 4;
	if (floor <= 40) return 5;
	return 6;
}

/**
 * Level up a Pokemon entry, applying EXP.
 * Returns true if the Pokemon evolved.
 */
export function applyExpAndLevelUp(mon: PokemonEntry, expGained: number): { evolved: boolean, oldLevel: number } {
	const oldLevel = mon.level;
	mon.exp += expGained;
	while (mon.level < 100 && mon.exp >= expForLevel(mon.level + 1)) {
		mon.level++;
	}
	let evolved = false;
	while (true) {
		const evo = getLevelUpEvo(mon.species);
		if (!evo || mon.level < evo.evoLevel) break;
		mon.species = evo.evoTo;
		evolved = true;
	}
	return { evolved, oldLevel };
}

// ---------------------------------------------------------------------------
// Learnset helpers — fetch up-to-4 gen-9 level-up moves for a species / level
// ---------------------------------------------------------------------------

export function getLevelUpMoves(speciesId: string, level: number): string[] {
	const learnsetData = Dex.species.getLearnsetData(toID(speciesId));
	const learnset = learnsetData?.learnset;
	if (!learnset) return ['tackle'];

	const available: { move: string, learnLevel: number }[] = [];

	for (const [moveid, sources] of Object.entries(learnset)) {
		for (const src of sources) {
			const match = /^9L(\d+)$/.exec(src);
			if (match) {
				const learnLvl = parseInt(match[1]);
				if (learnLvl <= level) {
					available.push({ move: moveid, learnLevel: learnLvl });
				}
				break;
			}
		}
	}

	if (!available.length) return ['tackle'];

	available.sort((a, b) => b.learnLevel - a.learnLevel);
	return available.slice(0, 4).map(m => m.move);
}

// ---------------------------------------------------------------------------
// Team packing helpers
// ---------------------------------------------------------------------------

export function packPokemon(mon: PokemonEntry): string {
	const speciesData = Dex.species.get(toID(mon.species));
	const name = speciesData.exists ? speciesData.name : mon.species;

	const abilities = speciesData.abilities ?? {};
	const ability = (abilities as unknown as Record<string, string>)['0'] || '';

	const moves = getLevelUpMoves(toID(mon.species), mon.level);
	const movesStr = moves.join(',');

	const item = mon.heldItem ?? '';

	return `${name}||${item}|${ability}|${movesStr}|Hardy||M||||${mon.level}`;
}

export function packTeam(mons: PokemonEntry[]): string {
	return mons.map(m => packPokemon(m)).join(']');
}

/** Returns a random selection of `n` shop item IDs from the full SHOP_ITEMS list. */
export function rollShopInventory(n = 8): string[] {
	const all = Object.keys(SHOP_ITEMS);
	const shuffled = all.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, n);
}
