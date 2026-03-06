// pokerogue-core.ts — types, constants, data persistence, and game helpers.
// imported by pokerogue.ts and pokerogue-battle.ts. no chat plugin hooks.

import { FS } from '../../../lib';

const DATA_FILE = 'impulse/db/pokerogue.json';

// tags that identify legendary / mythical / special pokemon (excluded from normal starters)
export const LEGENDARY_TAGS = new Set<string>([
	'Sub-Legendary', 'Restricted Legendary', 'Mythical', 'Ultra Beast', 'Paradox',
]);

// default level thresholds for evolution types that don't have a natural level.
// in pokerogue all evolutions happen by gaining levels — no items or trading needed.
const EVO_TYPE_FALLBACK_LEVEL: Partial<Record<string, number>> = {
	trade: 36,
	useItem: 36,
	levelFriendship: 20,
	levelMove: 30,
	levelExtra: 20,
	levelHold: 30,
	// 'other' (e.g. shedinja) is skipped — too special to auto-handle
};

// shop item definitions

export interface ShopItem {
	id: string;
	name: string;
	description: string;
	cost: number;
	// if set, item is equipped as a held item for the next battle
	heldItem?: string;
	// if set, opening this item triggers a gacha pokemon roll
	// 'legendary' | 'pseudo' | 'midtier'
	gachaType?: 'legendary' | 'pseudo' | 'midtier';
	// probability (0-1) of getting the featured tier; fallback is given otherwise
	gachaChance?: number;
}

export const SHOP_ITEMS: Record<string, ShopItem> = {
	// special roguelite consumables
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
	// survival / bulk items
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
	// ---- Type-boosting held items ----
	silkscarf: {
		id: 'silkscarf',
		name: 'Silk Scarf',
		description: 'Boosts Normal-type moves by 20%.',
		cost: 50,
		heldItem: 'silkscarf',
	},
	blackbelt: {
		id: 'blackbelt',
		name: 'Black Belt',
		description: 'Boosts Fighting-type moves by 20%.',
		cost: 50,
		heldItem: 'blackbelt',
	},
	magnet: {
		id: 'magnet',
		name: 'Magnet',
		description: 'Boosts Electric-type moves by 20%.',
		cost: 50,
		heldItem: 'magnet',
	},
	mysticwater: {
		id: 'mysticwater',
		name: 'Mystic Water',
		description: 'Boosts Water-type moves by 20%.',
		cost: 50,
		heldItem: 'mysticwater',
	},
	miracleseed: {
		id: 'miracleseed',
		name: 'Miracle Seed',
		description: 'Boosts Grass-type moves by 20%.',
		cost: 50,
		heldItem: 'miracleseed',
	},
	charcoal: {
		id: 'charcoal',
		name: 'Charcoal',
		description: 'Boosts Fire-type moves by 20%.',
		cost: 50,
		heldItem: 'charcoal',
	},
	nevermeltice: {
		id: 'nevermeltice',
		name: 'NeverMeltIce',
		description: 'Boosts Ice-type moves by 20%.',
		cost: 50,
		heldItem: 'nevermeltice',
	},
	softsand: {
		id: 'softsand',
		name: 'Soft Sand',
		description: 'Boosts Ground-type moves by 20%.',
		cost: 50,
		heldItem: 'softsand',
	},
	sharpbeak: {
		id: 'sharpbeak',
		name: 'Sharp Beak',
		description: 'Boosts Flying-type moves by 20%.',
		cost: 50,
		heldItem: 'sharpbeak',
	},
	poisonbarb: {
		id: 'poisonbarb',
		name: 'Poison Barb',
		description: 'Boosts Poison-type moves by 20%.',
		cost: 50,
		heldItem: 'poisonbarb',
	},
	twistedspoon: {
		id: 'twistedspoon',
		name: 'Twisted Spoon',
		description: 'Boosts Psychic-type moves by 20%.',
		cost: 50,
		heldItem: 'twistedspoon',
	},
	silverpowder: {
		id: 'silverpowder',
		name: 'Silver Powder',
		description: 'Boosts Bug-type moves by 20%.',
		cost: 50,
		heldItem: 'silverpowder',
	},
	hardstone: {
		id: 'hardstone',
		name: 'Hard Stone',
		description: 'Boosts Rock-type moves by 20%.',
		cost: 50,
		heldItem: 'hardstone',
	},
	spelltag: { id: 'spelltag', name: 'Spell Tag', description: 'Boosts Ghost-type moves by 20%.', cost: 50, heldItem: 'spelltag' },
	dragonfang: { id: 'dragonfang', name: 'Dragon Fang', description: 'Boosts Dragon-type moves by 20%.', cost: 50, heldItem: 'dragonfang' },
	blackglasses: { id: 'blackglasses', name: 'Black Glasses', description: 'Boosts Dark-type moves by 20%.', cost: 50, heldItem: 'blackglasses' },
	metalcoat: { id: 'metalcoat', name: 'Metal Coat', description: 'Boosts Steel-type moves by 20%.', cost: 50, heldItem: 'metalcoat' },
	pixieplate: { id: 'pixieplate', name: 'Pixie Plate', description: 'Boosts Fairy-type moves by 20%.', cost: 50, heldItem: 'pixieplate' },
	// ---- Accuracy / evasion items ----
	scopelens: { id: 'scopelens', name: 'Scope Lens', description: 'Raises the holder\'s critical-hit ratio by one stage.', cost: 80, heldItem: 'scopelens' },
	widelens: { id: 'widelens', name: 'Wide Lens', description: 'Boosts all move accuracy by 10%.', cost: 60, heldItem: 'widelens' },
	brightpowder: { id: 'brightpowder', name: 'Bright Powder', description: 'Lowers the opponent\'s accuracy by 10%.', cost: 60, heldItem: 'brightpowder' },
	laxincense: { id: 'laxincense', name: 'Lax Incense', description: 'Lowers the opponent\'s accuracy by 10%.', cost: 40, heldItem: 'laxincense' },
	// ---- Priority / speed items ----
	quickclaw: { id: 'quickclaw', name: 'Quick Claw', description: '20% chance to move first regardless of Speed.', cost: 60, heldItem: 'quickclaw' },
	// ---- Powerful combat items ----
	weaknesspolicy: { id: 'weaknesspolicy', name: 'Weakness Policy', description: 'Sharply raises Atk and Sp. Atk when hit by a super-effective move.', cost: 150, heldItem: 'weaknesspolicy' },
	covertcloak: { id: 'covertcloak', name: 'Covert Cloak', description: 'Protects the holder from secondary effects of moves.', cost: 80, heldItem: 'covertcloak' },
	mirrorherb: { id: 'mirrorherb', name: 'Mirror Herb', description: 'Copies the opponent\'s stat boosts once, then is consumed.', cost: 100, heldItem: 'mirrorherb' },
	loadeddice: { id: 'loadeddice', name: 'Loaded Dice', description: 'Makes most 2–5-hit moves strike 4–5 times instead of 2–5.', cost: 120, heldItem: 'loadeddice' },
	metronome: { id: 'metronome', name: 'Metronome', description: 'Boosts a move used consecutively — ~20% per use up to 2× power.', cost: 80, heldItem: 'metronome' },
	// ---- Switch / eject items ----
	ejectbutton: { id: 'ejectbutton', name: 'Eject Button', description: 'Immediately switches the holder out when it is hit by a move.', cost: 70, heldItem: 'ejectbutton' },
	ejectpack: { id: 'ejectpack', name: 'Eject Pack', description: 'Switches out the holder when any of its stats are lowered.', cost: 80, heldItem: 'ejectpack' },
	redcard: { id: 'redcard', name: 'Red Card', description: 'Forces the attacker to switch out when the holder is hit by a move.', cost: 70, heldItem: 'redcard' },
	// ---- Drain / weather items ----
	bigroot: { id: 'bigroot', name: 'Big Root', description: 'Draining moves restore 30% more HP.', cost: 60, heldItem: 'bigroot' },
	damprock: { id: 'damprock', name: 'Damp Rock', description: 'Rain Dance lasts 8 turns instead of 5.', cost: 60, heldItem: 'damprock' },
	heatrock: { id: 'heatrock', name: 'Heat Rock', description: 'Sunny Day lasts 8 turns instead of 5.', cost: 60, heldItem: 'heatrock' },
	icyrock: { id: 'icyrock', name: 'Icy Rock', description: 'Hail lasts 8 turns instead of 5.', cost: 60, heldItem: 'icyrock' },
	smoothrock: { id: 'smoothrock', name: 'Smooth Rock', description: 'Sandstorm lasts 8 turns instead of 5.', cost: 60, heldItem: 'smoothrock' },
	terrainextender: { id: 'terrainextender', name: 'Terrain Extender', description: 'Extends the duration of terrain by 3 extra turns.', cost: 70, heldItem: 'terrainextender' },
	utilityumbrella: { id: 'utilityumbrella', name: 'Utility Umbrella', description: 'Negates all weather effects on the holder.', cost: 80, heldItem: 'utilityumbrella' },
	roomservice: { id: 'roomservice', name: 'Room Service', description: 'Lowers Speed when Trick Room is set up.', cost: 50, heldItem: 'roomservice' },
	// ---- Reactive stat items ----
	luminousmoss: { id: 'luminousmoss', name: 'Luminous Moss', description: 'Raises Sp. Def sharply when hit by a Water-type move.', cost: 50, heldItem: 'luminousmoss' },
	snowball: { id: 'snowball', name: 'Snowball', description: 'Raises Attack sharply when hit by an Ice-type move.', cost: 50, heldItem: 'snowball' },
	absorbbulb: { id: 'absorbbulb', name: 'Absorb Bulb', description: 'Raises Sp. Atk when hit by a Water-type move.', cost: 50, heldItem: 'absorbbulb' },
	cellbattery: { id: 'cellbattery', name: 'Cell Battery', description: 'Raises Attack when hit by an Electric-type move.', cost: 50, heldItem: 'cellbattery' },
	// ---- Pinch berries ----
	salacberry: { id: 'salacberry', name: 'Salac Berry', description: 'Raises Speed sharply when HP falls to 25%.', cost: 60, heldItem: 'salacberry' },
	petayaberry: { id: 'petayaberry', name: 'Petaya Berry', description: 'Raises Sp. Atk sharply when HP falls to 25%.', cost: 60, heldItem: 'petayaberry' },
	ganlonberry: { id: 'ganlonberry', name: 'Ganlon Berry', description: 'Raises Defense sharply when HP falls to 25%.', cost: 60, heldItem: 'ganlonberry' },
	liechiberry: { id: 'liechiberry', name: 'Liechi Berry', description: 'Raises Attack sharply when HP falls to 25%.', cost: 60, heldItem: 'liechiberry' },
	apicotberry: { id: 'apicotberry', name: 'Apicot Berry', description: 'Raises Sp. Def sharply when HP falls to 25%.', cost: 60, heldItem: 'apicotberry' },
	custapberry: { id: 'custapberry', name: 'Custap Berry', description: 'Moves first once when HP falls to 25%, then is consumed.', cost: 70, heldItem: 'custapberry' },
	lansatberry: { id: 'lansatberry', name: 'Lansat Berry', description: 'Raises critical-hit ratio sharply when HP falls to 25%.', cost: 60, heldItem: 'lansatberry' },
	// ---- Status-curing berries ----
	lumberry: { id: 'lumberry', name: 'Lum Berry', description: 'Cures any status condition once.', cost: 50, heldItem: 'lumberry' },
	chestoberry: { id: 'chestoberry', name: 'Chesto Berry', description: 'Cures sleep once.', cost: 30, heldItem: 'chestoberry' },
	rawstberry: { id: 'rawstberry', name: 'Rawst Berry', description: 'Cures burn once.', cost: 30, heldItem: 'rawstberry' },
	cheriberry: { id: 'cheriberry', name: 'Cheri Berry', description: 'Cures paralysis once.', cost: 30, heldItem: 'cheriberry' },
	pechaberry: { id: 'pechaberry', name: 'Pecha Berry', description: 'Cures poison once.', cost: 30, heldItem: 'pechaberry' },
	// ---- Gacha capsules ----
	mastercapsule: {
		id: 'mastercapsule',
		name: 'Master Ball Capsule',
		description: '15% chance to get a Legendary/Mythical/UB/Paradox Pokemon; otherwise a powerful mid-tier Pokemon. Team must have room. Can decline the offer.',
		cost: 1500,
		gachaType: 'legendary',
		gachaChance: 0.15,
	},
	ultracapsule: {
		id: 'ultracapsule',
		name: 'Ultra Ball Capsule',
		description: '20% chance to get a Pseudo-legendary Pokemon (BST ≥ 580); otherwise a common starter Pokemon. Team must have room. Can decline the offer.',
		cost: 800,
		gachaType: 'pseudo',
		gachaChance: 0.20,
	},
	greatcapsule: {
		id: 'greatcapsule',
		name: 'Great Ball Capsule',
		description: '50% chance to get a mid-tier Pokemon (BST 480–579); otherwise a common starter Pokemon. Team must have room. Can decline the offer.',
		cost: 400,
		gachaType: 'midtier',
		gachaChance: 0.50,
	},
};

// data types

export interface PokemonEntry {
	species: string;
	level: number;
	exp: number;
	// held item to equip in the next battle (cleared after battle ends).
	heldItem?: string;
}

export interface PokeRogueState {
	floor: number;
	team: PokemonEntry[];
	// if set, player is being prompted to choose a starter (or a new team addition).
	pendingChoice?: string[];
	// 'starter' | 'add' — what the pending choice is for.
	pendingChoiceType?: 'starter' | 'add';
	// roomid of an ongoing battle, if any.
	battleRoomId?: string;
	// coins earned from floor victories (used in the item shop).
	coins?: number;
	// inventory: item id → quantity.
	items?: Record<string, number>;
	// floors remaining where exp and coins are doubled (lucky charm effect).
	doubleExpFloors?: number;
	// if true, the next loss will retry the same floor instead of resetting the run.
	hasRevive?: boolean;
	// highest floor ever reached — tracked for the leaderboard.
	highestFloor?: number;
	// display name (updated each login) — used for the leaderboard.
	displayName?: string;
	// number of floors won in the current run.
	streaksWon?: number;
	// current shop rotation — item ids available this refresh.
	shopInventory?: string[];
	// last in-game notification to display on the page (replaces chat/popup messages).
	notification?: string;
	// set to true after a run ends in defeat; cleared when a new run starts.
	gameOver?: boolean;
	// floor the player was on when their last run ended.
	lastRunFloor?: number;
	// streaks won during the player's last run.
	lastRunStreaks?: number;
	// pending gacha offer waiting for accept/decline (from mastercapsule/ultracapsule/greatcapsule).
	pendingGachaOffer?: {
		species: string,
		// which capsule was opened
		sourceItemId: string,
		// whether the rolled pokemon is the featured tier (legendary/pseudo/midtier) or the fallback
		isFeatured: boolean,
	};
}

// persistence

type SavedData = Record<string, PokeRogueState>;
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

export function getState(userid: string): PokeRogueState | null {
	return savedData[userid] ?? null;
}

export function setState(userid: string, state: PokeRogueState): void {
	savedData[userid] = state;
	saveData();
}

export function deleteState(userid: string): void {
	delete savedData[userid];
	saveData();
}

// pokemon selection helpers

// cached list of non-legendary base-form official pokemon ids.
let regularPokemonCache: string[] | null = null;
// cached list of legendary/mythical base-form official pokemon ids.
let legendaryPokemonCache: string[] | null = null;
// cached list of pseudo-legendary final-form pokemon ids (non-legendary, BST >= 580, no further evos).
let pseudoLegendaryCache: string[] | null = null;
// cached list of mid-tier final-form pokemon ids (non-legendary, BST 480-579, no further evos).
let midTierCache: string[] | null = null;

// returns all regular (non-legendary) base-form official pokemon ids.
function getRegularPokemon(): string[] {
	// Only use the cache if it's non-empty — an empty cache means the Dex wasn't
	// loaded yet when it was first called, so we must retry the lookup.
	if (regularPokemonCache?.length) return regularPokemonCache;
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

// returns all legendary/mythical base-form official pokemon ids.
function getLegendaryPokemon(): string[] {
	// Only use the cache if it's non-empty — an empty cache means the Dex wasn't
	// loaded yet when it was first called, so we must retry the lookup.
	if (legendaryPokemonCache?.length) return legendaryPokemonCache;
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

// returns non-legendary final-form pokemon with BST >= 580 (pseudo-legendary tier).
// "final-form" means no further evolutions (evos is empty or undefined).
export function getPseudoLegendaryPokemon(): string[] {
	if (pseudoLegendaryCache?.length) return pseudoLegendaryCache;
	const all = Dex.species.all();
	pseudoLegendaryCache = all
		.filter(s => {
			if (!s.exists || s.num <= 0 || s.isNonstandard) return false;
			if (s.baseSpecies !== s.name) return false; // no formes
			if (s.tags.some(tag => LEGENDARY_TAGS.has(tag))) return false; // no legendaries
			if (s.evos && s.evos.length > 0) return false; // must be final form (no further evos)
			const bs = s.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
			return bst >= 580;
		})
		.map(s => toID(s.name));
	return pseudoLegendaryCache;
}

// returns non-legendary final-form pokemon with BST 480–579 (mid-tier).
export function getMidTierPokemon(): string[] {
	if (midTierCache?.length) return midTierCache;
	const all = Dex.species.all();
	midTierCache = all
		.filter(s => {
			if (!s.exists || s.num <= 0 || s.isNonstandard) return false;
			if (s.baseSpecies !== s.name) return false;
			if (s.tags.some(tag => LEGENDARY_TAGS.has(tag))) return false;
			if (s.evos && s.evos.length > 0) return false; // must be final form
			const bs = s.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
			return bst >= 480 && bst < 580;
		})
		.map(s => toID(s.name));
	return midTierCache;
}

// rolls a gacha pokemon for the given capsule type. returns { species, isFeatured }.
// team species (exclude) prevents duplicates.
export function rollGachaPokemon(
	gachaType: 'legendary' | 'pseudo' | 'midtier',
	gachaChance: number,
	exclude: string[] = []
): { species: string, isFeatured: boolean } {
	const isFeatured = Math.random() < gachaChance;
	if (isFeatured) {
		const pool = gachaType === 'legendary' ? getLegendaryPokemon() :
			gachaType === 'pseudo' ? getPseudoLegendaryPokemon() :
			getMidTierPokemon();
		const picks = pickRandom(pool, 1, exclude);
		if (picks.length) return { species: picks[0], isFeatured: true };
		// If pool is empty or all excluded, fall through to fallback
	}
	// fallback: legendary/midtier → mid-tier pool; pseudo/midtier → regular pool
	const fallbackPool = gachaType === 'legendary' ? getMidTierPokemon() : getRegularPokemon();
	const fallbackPicks = pickRandom(fallbackPool, 1, exclude);
	const species = fallbackPicks.length ? fallbackPicks[0] :
		(pickRandom(getRegularPokemon(), 1)[0] ?? 'bulbasaur');
	return { species, isFeatured: false };
}

// fisher-yates shuffle a copy of `pool` and return `n` items, excluding `exclude`.
function pickRandom(pool: string[], n: number, exclude: string[] = []): string[] {
	const filtered = pool.filter(id => !exclude.includes(id));
	const shuffled = filtered.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, n);
}

// pick `n` completely random regular (non-legendary) base-form pokemon, excluding any already in `exclude`.

export function pickRandomPokemon(n: number, exclude: string[] = []): string[] {
	return pickRandom(getRegularPokemon(), n, exclude);
}

// pick 3 completely random level-1 base-form pokemon for the starter selection screen. legendary/mythical pokemon are always excluded from the starter pool.

export function pickStarterOptions(): string[] {
	return pickRandomPokemon(3);
}

// returns 3 random pokemon for the "add to team" milestone offer. at floor 20+ there is a small chance that one legendary/mythical appears. at floor 40+ that chance doubles.

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

// exp / levelling / evolution helpers

// returns the level-based evolution for a species, if one exists. in pokérogue all evolutions are unlocked by levelling up.

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

// total exp needed to reach a given level from level 1.
export function expForLevel(level: number): number {
	return 15 * level * (level - 1);
}

// exp awarded for winning a floor.
export function floorExpReward(floor: number): number {
	return 50 + floor * 15;
}

// coins awarded for winning a floor.
export function floorCoinReward(floor: number): number {
	return 30 + floor * 10;
}

// level up a pokemon entry, applying exp. returns true if the pokemon evolved.

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

// learnset helpers — fetch up-to-4 gen-9 level-up moves for a species / level

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

// team packing helpers

export function packPokemon(mon: PokemonEntry): string {
	const speciesData = Dex.species.get(toID(mon.species));
	const name = speciesData.exists ? speciesData.name : mon.species;

	const abilities = speciesData.abilities ?? {};
	const ability = (abilities as unknown as Record<string, string>)['0'] || '';

	const moves = getLevelUpMoves(toID(mon.species), mon.level);
	const movesStr = moves.join(',');

	const item = mon.heldItem ?? '';

	// Packed team format: name|species|item|ability|moves|nature|evs|gender|ivs|shiny|level|
	// Empty species field makes PS use the name as species.
	// A trailing | after level is required: PS's Teams.unpack reads level by searching for the
	// next | and stops there; without it, a single-Pokemon team would return null from unpack.
	return `${name}||${item}|${ability}|${movesStr}|Hardy||M|||${mon.level}|`;
}

export function packTeam(mons: PokemonEntry[]): string {
	return mons.map(m => packPokemon(m)).join(']');
}

// returns a random selection of `n` shop item ids from the full shop_items list.
export function rollShopInventory(n = 8): string[] {
	const all = Object.keys(SHOP_ITEMS);
	const shuffled = all.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, n);
}
