// pokerogue-core.ts — types, constants, data persistence, and game helpers.
// imported by pokerogue.ts and pokerogue-battle.ts. no chat plugin hooks.

import { FS } from '../../../lib';

const DATA_FILE = 'impulse/db/pokerogue.json';

export const LEGENDARY_TAGS = new Set<string>([
	'Sub-Legendary', 'Restricted Legendary', 'Mythical', 'Ultra Beast', 'Paradox',
]);

const EVO_TYPE_FALLBACK_LEVEL: Partial<Record<string, number>> = {
	trade: 36,
	useItem: 36,
	levelFriendship: 20,
	levelMove: 30,
	levelExtra: 20,
	levelHold: 30,
};

export interface ShopItem {
	id: string;
	name: string;
	description: string;
	cost: number;
	heldItem?: string;
	icon?: string;
	gachaType?: 'master' | 'ultra' | 'great';
	gachaChance?: number;
	isConsumable?: boolean; 
}

export const SHOP_ITEMS: Record<string, ShopItem> = {
	rarecandy: { id: 'rarecandy', name: 'Rare Candy', description: 'Instantly grants +5 levels to one of your Pokemon. (Max Lv. 999)', cost: 100 },
	luckycharm: { id: 'luckycharm', name: 'Lucky Charm', description: 'Doubles EXP and coins earned for the next 3 floors.', cost: 150, icon: 'luckyegg' },
	revive: { id: 'revive', name: 'Revive', description: 'Grants a second chance — if you lose your next battle you retry the same floor.', cost: 200 },
	focussash: { id: 'focussash', name: 'Focus Sash', description: 'Survive any one-hit KO at 1 HP.', cost: 120, heldItem: 'focussash', isConsumable: true },
	leftovers: { id: 'leftovers', name: 'Leftovers', description: 'Gradually restores HP each turn.', cost: 100, heldItem: 'leftovers' },
	eviolite: { id: 'eviolite', name: 'Eviolite', description: 'Boosts Defense and Sp. Def by 50% for unevolved Pokemon.', cost: 100, heldItem: 'eviolite' },
	rockyhelmet: { id: 'rockyhelmet', name: 'Rocky Helmet', description: 'Damages the attacker 1/6 max HP when hit by a contact move.', cost: 80, heldItem: 'rockyhelmet' },
	heavydutyboots: { id: 'heavydutyboots', name: 'Heavy-Duty Boots', description: 'Prevents all entry hazard damage.', cost: 100, heldItem: 'heavydutyboots' },
	airballoon: { id: 'airballoon', name: 'Air Balloon', description: 'Makes the holder immune to Ground-type moves until hit.', cost: 60, heldItem: 'airballoon', isConsumable: true },
	blacksludge: { id: 'blacksludge', name: 'Black Sludge', description: 'Restores HP for Poison-types; damages all other types.', cost: 80, heldItem: 'blacksludge' },
	choiceband: { id: 'choiceband', name: 'Choice Band', description: 'Boosts Attack by 50%, but locks into one move.', cost: 80, heldItem: 'choiceband' },
	choicespecs: { id: 'choicespecs', name: 'Choice Specs', description: 'Boosts Sp. Atk by 50%, but locks into one move.', cost: 80, heldItem: 'choicespecs' },
	choicescarf: { id: 'choicescarf', name: 'Choice Scarf', description: 'Boosts Speed by 50%, but locks into one move.', cost: 80, heldItem: 'choicescarf' },
	lifeorb: { id: 'lifeorb', name: 'Life Orb', description: 'Boosts all moves by 30% at the cost of 10% HP per hit.', cost: 120, heldItem: 'lifeorb' },
	expertbelt: { id: 'expertbelt', name: 'Expert Belt', description: 'Boosts super-effective moves by 20% with no drawback.', cost: 80, heldItem: 'expertbelt' },
	wiseglasses: { id: 'wiseglasses', name: 'Wise Glasses', description: 'Boosts Sp. Atk by 10% without any downside.', cost: 60, heldItem: 'wiseglasses' },
	muscleband: { id: 'muscleband', name: 'Muscle Band', description: 'Boosts Attack by 10% without any downside.', cost: 60, heldItem: 'muscleband' },
	assaultvest: { id: 'assaultvest', name: 'Assault Vest', description: 'Boosts Sp. Def by 50%; prevents status moves.', cost: 100, heldItem: 'assaultvest' },
	clearamulet: { id: 'clearamulet', name: 'Clear Amulet', description: 'Prevents the holder\'s stats from being lowered by opponents.', cost: 80, heldItem: 'clearamulet' },
	boosterenergy: { id: 'boosterenergy', name: 'Booster Energy', description: 'Activates the highest stat of a Paradox Pokemon.', cost: 120, heldItem: 'boosterenergy', isConsumable: true },
	protectivepads: { id: 'protectivepads', name: 'Protective Pads', description: 'Prevents the effects of contact moves from activating.', cost: 70, heldItem: 'protectivepads' },
	safetygoggles: { id: 'safetygoggles', name: 'Safety Goggles', description: 'Protects from weather damage and powder/spore moves.', cost: 70, heldItem: 'safetygoggles' },
	sitrusberry: { id: 'sitrusberry', name: 'Sitrus Berry', description: 'Restores 25% HP when below 50% HP.', cost: 40, heldItem: 'sitrusberry', isConsumable: true },
	aguavberry: { id: 'aguavberry', name: 'Aguav Berry', description: 'Restores 1/3 HP when below 25% HP (may cause confusion).', cost: 30, heldItem: 'aguavberry', isConsumable: true },
	flameorb: { id: 'flameorb', name: 'Flame Orb', description: 'Burns the holder at end of turn (great with Guts/Marvel Scale).', cost: 60, heldItem: 'flameorb' },
	toxicorb: { id: 'toxicorb', name: 'Toxic Orb', description: 'Badly poisons the holder at end of turn (great with Poison Heal).', cost: 60, heldItem: 'toxicorb' },
	whiteherb: { id: 'whiteherb', name: 'White Herb', description: 'Restores any lowered stats once, then is consumed.', cost: 50, heldItem: 'whiteherb', isConsumable: true },
	powerherb: { id: 'powerherb', name: 'Power Herb', description: 'Allows a two-turn move to fire immediately once, then is consumed.', cost: 40, heldItem: 'powerherb', isConsumable: true },
	throatspray: { id: 'throatspray', name: 'Throat Spray', description: 'Boosts Sp. Atk after using a sound-based move once.', cost: 60, heldItem: 'throatspray', isConsumable: true },
	blunderpolicy: { id: 'blunderpolicy', name: 'Blunder Policy', description: 'Sharply boosts Speed when a move misses.', cost: 80, heldItem: 'blunderpolicy', isConsumable: true },
	shedshell: { id: 'shedshell', name: 'Shed Shell', description: 'Allows the holder to switch out regardless of trapping moves.', cost: 50, heldItem: 'shedshell' },
	silkscarf: { id: 'silkscarf', name: 'Silk Scarf', description: 'Boosts Normal-type moves by 20%.', cost: 50, heldItem: 'silkscarf' },
	blackbelt: { id: 'blackbelt', name: 'Black Belt', description: 'Boosts Fighting-type moves by 20%.', cost: 50, heldItem: 'blackbelt' },
	magnet: { id: 'magnet', name: 'Magnet', description: 'Boosts Electric-type moves by 20%.', cost: 50, heldItem: 'magnet' },
	mysticwater: { id: 'mysticwater', name: 'Mystic Water', description: 'Boosts Water-type moves by 20%.', cost: 50, heldItem: 'mysticwater' },
	miracleseed: { id: 'miracleseed', name: 'Miracle Seed', description: 'Boosts Grass-type moves by 20%.', cost: 50, heldItem: 'miracleseed' },
	charcoal: { id: 'charcoal', name: 'Charcoal', description: 'Boosts Fire-type moves by 20%.', cost: 50, heldItem: 'charcoal' },
	nevermeltice: { id: 'nevermeltice', name: 'NeverMeltIce', description: 'Boosts Ice-type moves by 20%.', cost: 50, heldItem: 'nevermeltice' },
	softsand: { id: 'softsand', name: 'Soft Sand', description: 'Boosts Ground-type moves by 20%.', cost: 50, heldItem: 'softsand' },
	sharpbeak: { id: 'sharpbeak', name: 'Sharp Beak', description: 'Boosts Flying-type moves by 20%.', cost: 50, heldItem: 'sharpbeak' },
	poisonbarb: { id: 'poisonbarb', name: 'Poison Barb', description: 'Boosts Poison-type moves by 20%.', cost: 50, heldItem: 'poisonbarb' },
	twistedspoon: { id: 'twistedspoon', name: 'Twisted Spoon', description: 'Boosts Psychic-type moves by 20%.', cost: 50, heldItem: 'twistedspoon' },
	silverpowder: { id: 'silverpowder', name: 'Silver Powder', description: 'Boosts Bug-type moves by 20%.', cost: 50, heldItem: 'silverpowder' },
	hardstone: { id: 'hardstone', name: 'Hard Stone', description: 'Boosts Rock-type moves by 20%.', cost: 50, heldItem: 'hardstone' },
	spelltag: { id: 'spelltag', name: 'Spell Tag', description: 'Boosts Ghost-type moves by 20%.', cost: 50, heldItem: 'spelltag' },
	dragonfang: { id: 'dragonfang', name: 'Dragon Fang', description: 'Boosts Dragon-type moves by 20%.', cost: 50, heldItem: 'dragonfang' },
	blackglasses: { id: 'blackglasses', name: 'Black Glasses', description: 'Boosts Dark-type moves by 20%.', cost: 50, heldItem: 'blackglasses' },
	metalcoat: { id: 'metalcoat', name: 'Metal Coat', description: 'Boosts Steel-type moves by 20%.', cost: 50, heldItem: 'metalcoat' },
	pixieplate: { id: 'pixieplate', name: 'Pixie Plate', description: 'Boosts Fairy-type moves by 20%.', cost: 50, heldItem: 'pixieplate' },
	scopelens: { id: 'scopelens', name: 'Scope Lens', description: 'Raises the holder\'s critical-hit ratio by one stage.', cost: 80, heldItem: 'scopelens' },
	widelens: { id: 'widelens', name: 'Wide Lens', description: 'Boosts all move accuracy by 10%.', cost: 60, heldItem: 'widelens' },
	brightpowder: { id: 'brightpowder', name: 'Bright Powder', description: 'Lowers the opponent\'s accuracy by 10%.', cost: 60, heldItem: 'brightpowder' },
	laxincense: { id: 'laxincense', name: 'Lax Incense', description: 'Lowers the opponent\'s accuracy by 10%.', cost: 40, heldItem: 'laxincense' },
	quickclaw: { id: 'quickclaw', name: 'Quick Claw', description: '20% chance to move first regardless of Speed.', cost: 60, heldItem: 'quickclaw' },
	weaknesspolicy: { id: 'weaknesspolicy', name: 'Weakness Policy', description: 'Sharply raises Atk and Sp. Atk when hit by a super-effective move.', cost: 150, heldItem: 'weaknesspolicy', isConsumable: true },
	covertcloak: { id: 'covertcloak', name: 'Covert Cloak', description: 'Protects the holder from secondary effects of moves.', cost: 80, heldItem: 'covertcloak' },
	mirrorherb: { id: 'mirrorherb', name: 'Mirror Herb', description: 'Copies the opponent\'s stat boosts once, then is consumed.', cost: 100, heldItem: 'mirrorherb', isConsumable: true },
	loadeddice: { id: 'loadeddice', name: 'Loaded Dice', description: 'Makes most 2–5-hit moves strike 4–5 times instead of 2–5.', cost: 120, heldItem: 'loadeddice' },
	metronome: { id: 'metronome', name: 'Metronome', description: 'Boosts a move used consecutively — ~20% per use up to 2× power.', cost: 80, heldItem: 'metronome' },
	ejectbutton: { id: 'ejectbutton', name: 'Eject Button', description: 'Immediately switches the holder out when it is hit by a move.', cost: 70, heldItem: 'ejectbutton', isConsumable: true },
	ejectpack: { id: 'ejectpack', name: 'Eject Pack', description: 'Switches out the holder when any of its stats are lowered.', cost: 80, heldItem: 'ejectpack', isConsumable: true },
	redcard: { id: 'redcard', name: 'Red Card', description: 'Forces the attacker to switch out when the holder is hit by a move.', cost: 70, heldItem: 'redcard', isConsumable: true },
	bigroot: { id: 'bigroot', name: 'Big Root', description: 'Draining moves restore 30% more HP.', cost: 60, heldItem: 'bigroot' },
	damprock: { id: 'damprock', name: 'Damp Rock', description: 'Rain Dance lasts 8 turns instead of 5.', cost: 60, heldItem: 'damprock' },
	heatrock: { id: 'heatrock', name: 'Heat Rock', description: 'Sunny Day lasts 8 turns instead of 5.', cost: 60, heldItem: 'heatrock' },
	icyrock: { id: 'icyrock', name: 'Icy Rock', description: 'Hail lasts 8 turns instead of 5.', cost: 60, heldItem: 'icyrock' },
	smoothrock: { id: 'smoothrock', name: 'Smooth Rock', description: 'Sandstorm lasts 8 turns instead of 5.', cost: 60, heldItem: 'smoothrock' },
	terrainextender: { id: 'terrainextender', name: 'Terrain Extender', description: 'Extends the duration of terrain by 3 extra turns.', cost: 70, heldItem: 'terrainextender' },
	utilityumbrella: { id: 'utilityumbrella', name: 'Utility Umbrella', description: 'Negates all weather effects on the holder.', cost: 80, heldItem: 'utilityumbrella' },
	roomservice: { id: 'roomservice', name: 'Room Service', description: 'Lowers Speed when Trick Room is set up.', cost: 50, heldItem: 'roomservice', isConsumable: true },
	luminousmoss: { id: 'luminousmoss', name: 'Luminous Moss', description: 'Raises Sp. Def sharply when hit by a Water-type move.', cost: 50, heldItem: 'luminousmoss', isConsumable: true },
	snowball: { id: 'snowball', name: 'Snowball', description: 'Raises Attack sharply when hit by an Ice-type move.', cost: 50, heldItem: 'snowball', isConsumable: true },
	absorbbulb: { id: 'absorbbulb', name: 'Absorb Bulb', description: 'Raises Sp. Atk when hit by a Water-type move.', cost: 50, heldItem: 'absorbbulb', isConsumable: true },
	cellbattery: { id: 'cellbattery', name: 'Cell Battery', description: 'Raises Attack when hit by an Electric-type move.', cost: 50, heldItem: 'cellbattery', isConsumable: true },
	salacberry: { id: 'salacberry', name: 'Salac Berry', description: 'Raises Speed sharply when HP falls to 25%.', cost: 60, heldItem: 'salacberry', isConsumable: true },
	petayaberry: { id: 'petayaberry', name: 'Petaya Berry', description: 'Raises Sp. Atk sharply when HP falls to 25%.', cost: 60, heldItem: 'petayaberry', isConsumable: true },
	ganlonberry: { id: 'ganlonberry', name: 'Ganlon Berry', description: 'Raises Defense sharply when HP falls to 25%.', cost: 60, heldItem: 'ganlonberry', isConsumable: true },
	liechiberry: { id: 'liechiberry', name: 'Liechi Berry', description: 'Raises Attack sharply when HP falls to 25%.', cost: 60, heldItem: 'liechiberry', isConsumable: true },
	apicotberry: { id: 'apicotberry', name: 'Apicot Berry', description: 'Raises Sp. Def sharply when HP falls to 25%.', cost: 60, heldItem: 'apicotberry', isConsumable: true },
	custapberry: { id: 'custapberry', name: 'Custap Berry', description: 'Moves first once when HP falls to 25%, then is consumed.', cost: 70, heldItem: 'custapberry', isConsumable: true },
	lansatberry: { id: 'lansatberry', name: 'Lansat Berry', description: 'Raises critical-hit ratio sharply when HP falls to 25%.', cost: 60, heldItem: 'lansatberry', isConsumable: true },
	lumberry: { id: 'lumberry', name: 'Lum Berry', description: 'Cures any status condition once.', cost: 50, heldItem: 'lumberry', isConsumable: true },
	chestoberry: { id: 'chestoberry', name: 'Chesto Berry', description: 'Cures sleep once.', cost: 30, heldItem: 'chestoberry', isConsumable: true },
	rawstberry: { id: 'rawstberry', name: 'Rawst Berry', description: 'Cures burn once.', cost: 30, heldItem: 'rawstberry', isConsumable: true },
	cheriberry: { id: 'cheriberry', name: 'Cheri Berry', description: 'Cures paralysis once.', cost: 30, heldItem: 'cheriberry', isConsumable: true },
	pechaberry: { id: 'pechaberry', name: 'Pecha Berry', description: 'Cures poison once.', cost: 30, heldItem: 'pechaberry', isConsumable: true },
	mastercapsule: { id: 'mastercapsule', name: 'Master Ball Capsule', description: '30% chance for a Tier 4 (Legendary/Mythical/UB/Paradox); 70% chance for Tier 3 (Elite).', cost: 1500, gachaType: 'master', icon: 'masterball' },
	ultracapsule: { id: 'ultracapsule', name: 'Ultra Ball Capsule', description: '75% chance for a Tier 3 (Elite) Pokemon; 25% chance for Tier 2 (Standard).', cost: 800, gachaType: 'ultra', icon: 'ultraball' },
	greatcapsule: { id: 'greatcapsule', name: 'Great Ball Capsule', description: '70% chance for a Tier 2 (Standard) Pokemon; 30% chance for Tier 3 (Elite).', cost: 400, gachaType: 'great', icon: 'greatball' },
};

export interface PokemonEntry {
	species: string;
	level: number;
	exp: number;
	heldItem?: string;
	moves: string[];
}

export interface PokeRogueState {
	floor: number;
	team: PokemonEntry[];
	pendingChoice?: string[];
	pendingChoiceType?: 'starter' | 'add';
	battleRoomId?: string;
	coins?: number;
	items?: Record<string, number>;
	doubleExpFloors?: number;
	hasRevive?: boolean;
	highestFloor?: number;
	displayName?: string;
	streaksWon?: number;
	shopInventory?: string[];
	notification?: string;
	gameOver?: boolean;
	lastRunFloor?: number;
	lastRunStreaks?: number;
	pendingGachaOffer?: { species: string, sourceItemId: string, isFeatured: boolean };
	pendingMoves?: { pokemonIndex: number; move: string; speciesName: string }[];
	pendingSwap?: PokemonEntry;
}

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

// --- TIERING SYSTEM ---

let t1Cache: string[] | null = null;
let t2Cache: string[] | null = null;
let t3Cache: string[] | null = null;
let t4Cache: string[] | null = null;

// FIX: Changed species to 'any' to prevent TypeScript from crashing without importing the Species type
function getBST(species: any): number {
	const bs = species.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	return bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
}

export function getTier1Pokemon(): string[] {
	if (t1Cache?.length) return t1Cache;
	const all = Dex.species.all();
	t1Cache = all.filter(s => {
		if (!s.exists || s.num <= 0 || s.isNonstandard || s.baseSpecies !== s.name) return false;
		if (s.tags.some(tag => LEGENDARY_TAGS.has(tag))) return false;
		return (s.tier === 'LC' && getBST(s) < 480) || (s.evos && s.evos.length > 0 && getBST(s) < 350);
	}).map(s => toID(s.name));
	return t1Cache;
}

export function getTier2Pokemon(): string[] {
	if (t2Cache?.length) return t2Cache;
	const all = Dex.species.all();
	t2Cache = all.filter(s => {
		if (!s.exists || s.num <= 0 || s.isNonstandard || s.baseSpecies !== s.name) return false;
		if (s.tags.some(tag => LEGENDARY_TAGS.has(tag))) return false;
		if (s.evos && s.evos.length > 0) return false;
		const bst = getBST(s);
		return bst >= 350 && bst <= 490;
	}).map(s => toID(s.name));
	return t2Cache;
}

export function getTier3Pokemon(): string[] {
	if (t3Cache?.length) return t3Cache;
	const all = Dex.species.all();
	t3Cache = all.filter(s => {
		if (!s.exists || s.num <= 0 || s.isNonstandard || s.baseSpecies !== s.name) return false;
		if (s.tags.some(tag => LEGENDARY_TAGS.has(tag))) return false;
		if (s.evos && s.evos.length > 0) return false;
		const bst = getBST(s);
		return (bst >= 491 && bst <= 579) || ['OU', 'UU', 'RU'].includes(s.tier);
	}).map(s => toID(s.name));
	return t3Cache;
}

export function getTier4Pokemon(): string[] {
	if (t4Cache?.length) return t4Cache;
	const all = Dex.species.all();
	t4Cache = all.filter(s => {
		if (!s.exists || s.num <= 0 || s.isNonstandard || s.baseSpecies !== s.name) return false;
		return s.tags.some(tag => LEGENDARY_TAGS.has(tag)) || getBST(s) >= 580;
	}).map(s => toID(s.name));
	return t4Cache;
}

export function pickRandom(pool: string[], n: number, exclude: string[] = []): string[] {
	const filtered = pool.filter(id => !exclude.includes(id));
	const shuffled = filtered.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, n);
}

export function rollGachaPokemon(gachaType: 'master' | 'ultra' | 'great', exclude: string[] = []): { species: string, isFeatured: boolean } {
	const rand = Math.random();
	let pool: string[];
	let isFeatured = false;

	if (gachaType === 'master') {
		if (rand <= 0.30) { pool = getTier4Pokemon(); isFeatured = true; } 
		else { pool = getTier3Pokemon(); }
	} else if (gachaType === 'ultra') {
		if (rand <= 0.75) { pool = getTier3Pokemon(); isFeatured = true; } 
		else { pool = getTier2Pokemon(); }
	} else { // great
		if (rand <= 0.70) { pool = getTier2Pokemon(); isFeatured = true; } 
		else { pool = getTier3Pokemon(); }
	}

	const picks = pickRandom(pool, 1, exclude);
	const species = picks.length ? picks[0] : (pickRandom(getTier1Pokemon(), 1)[0] ?? 'bulbasaur');
	return { species, isFeatured };
}

export function pickStarterOptions(): string[] {
	return pickRandom(getTier1Pokemon(), 3);
}

export function pickNewPokemonOptions(currentTeam: PokemonEntry[], floor: number): string[] {
	const existing = currentTeam.map(m => m.species);
	let poolA: string[];
	let poolB: string[];
	let chanceA: number;

	if (floor < 20) {
		poolA = getTier1Pokemon(); poolB = getTier2Pokemon(); chanceA = 0.7;
	} else if (floor < 35) {
		poolA = getTier2Pokemon(); poolB = getTier3Pokemon(); chanceA = 0.6;
	} else {
		poolA = getTier3Pokemon(); poolB = getTier4Pokemon(); chanceA = 0.7;
	}

	const options: string[] = [];
	for (let i = 0; i < 3; i++) {
		const activePool = Math.random() < chanceA ? poolA : poolB;
		const pick = pickRandom(activePool, 1, [...existing, ...options]);
		if (pick.length) options.push(pick[0]);
	}
	
	return options.length === 3 ? options : pickRandom([...getTier1Pokemon(), ...getTier2Pokemon()], 3, existing);
}

export function getLevelUpEvo(speciesId: string): { evoTo: string, evoLevel: number } | null {
	const species = Dex.species.get(toID(speciesId));
	if (!species.exists || !species.evos.length) return null;

	const validEvos: { evoTo: string, evoLevel: number }[] = [];

	for (const evoName of species.evos) {
		const evo = Dex.species.get(toID(evoName));
		if (evo.evoType === 'other') continue;

		const fallback = evo.evoType ? (EVO_TYPE_FALLBACK_LEVEL[evo.evoType] ?? 36) : 36;
		const evoLevel = evo.evoLevel ?? fallback;
		
		if (evoLevel > 0) {
			validEvos.push({ evoTo: toID(evoName), evoLevel });
		}
	}

	if (!validEvos.length) return null;
	return validEvos[Math.floor(Math.random() * validEvos.length)];
}

// --- LEVEL 999 MATH & EXP ---

export function botLevel(floor: number): number {
	let level = 1; 
	if (floor <= 20) {
		level += (floor - 1) * 2;
	} else if (floor <= 50) {
		level = 39 + ((floor - 20) * 4);
	} else {
		level = 159 + ((floor - 50) * 8);
	}
	return Math.min(999, level);
}

export function expForLevel(level: number): number {
	return 15 * level * (level - 1);
}

export function floorExpReward(floor: number): number {
	const currentTarget = botLevel(floor);
	const nextTarget = botLevel(floor + 1);
	
	if (currentTarget === 999) return 500000; 

	const expGap = expForLevel(nextTarget) - expForLevel(currentTarget);
	return Math.floor(expGap * 1.15); 
}

export function floorCoinReward(floor: number): number {
	return 30 + floor * 10;
}

export function applyExpAndLevelUp(mon: PokemonEntry, expGained: number): { evolved: boolean, oldLevel: number } {
	const oldLevel = mon.level;
	mon.exp += expGained;
	
	while (mon.level < 999 && mon.exp >= expForLevel(mon.level + 1)) {
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

export function getMovesLearnedBetween(speciesId: string, oldLevel: number, newLevel: number, isEvolution = false): string[] {
	const learnset = Dex.species.getLearnsetData(toID(speciesId))?.learnset;
	if (!learnset) return [];

	const learned: string[] = [];
	for (const [moveid, sources] of Object.entries(learnset)) {
		for (const src of sources) {
			const match = /^9L(\d+)$/.exec(src);
			if (match) {
				const learnLvl = parseInt(match[1]);
				if (learnLvl > oldLevel && learnLvl <= newLevel) {
					learned.push(moveid);
				} else if (isEvolution && learnLvl === 0) {
					learned.push(moveid);
				}
				break;
			}
		}
	}
	return Array.from(new Set(learned)); 
}

export function packPokemon(mon: PokemonEntry): string {
	const speciesData = Dex.species.get(toID(mon.species));
	const name = speciesData.exists ? speciesData.name : mon.species;

	const abilities = speciesData.abilities ?? {};
	const ability = (abilities as unknown as Record<string, string>)['0'] || '';

	if (!mon.moves) mon.moves = getLevelUpMoves(toID(mon.species), mon.level);
	const movesStr = mon.moves.join(',');

	const item = mon.heldItem ?? '';
	return `${name}||${item}|${ability}|${movesStr}|Hardy||M|||${mon.level}|`;
}

export function packTeam(mons: PokemonEntry[]): string {
	return mons.map(m => packPokemon(m)).join(']');
}

export function rollShopInventory(n = 8): string[] {
	const all = Object.keys(SHOP_ITEMS);
	const shuffled = all.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, n);
}
