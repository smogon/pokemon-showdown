import { Dex, toID } from '../../../sim/dex';
import { Utils } from '../../../lib';
import { PRNG, type PRNGSeed } from '../../../sim/prng';
import { type RuleTable } from '../../../sim/dex-formats';
import { Tags } from './../../tags';

export interface TeamData {
	typeCount: { [k: string]: number };
	typeComboCount: { [k: string]: number };
	baseFormes: { [k: string]: number };
	megaCount?: number;
	zCount?: number;
	wantsTeraCount?: number;
	has: { [k: string]: number };
	forceResult: boolean;
	weaknesses: { [k: string]: number };
	resistances: { [k: string]: number };
	weather?: string;
	eeveeLimCount?: number;
	gigantamax?: boolean;
}
export interface BattleFactorySpecies {
	flags: { limEevee?: 1 };
	sets: BattleFactorySet[];
}
interface BattleFactorySet {
	species: string;
	item: string;
	ability: string;
	nature: string;
	moves: string[];
	evs?: Partial<StatsTable>;
	ivs?: Partial<StatsTable>;
}
interface BSSFactorySet {
	species: string;
	weight: number;
	item: string[];
	ability: string;
	nature: string;
	moves: string[][];
	teraType: string[];
	gender?: string;
	wantsTera?: boolean;
	evs: number[];
	ivs?: number[];
}
export class MoveCounter extends Utils.Multiset<string> {
	damagingMoves: Set<Move>;

	constructor() {
		super();
		this.damagingMoves = new Set();
	}
}

type MoveEnforcementChecker = (
	movePool: string[], moves: Set<string>, abilities: string[], types: string[],
	counter: MoveCounter, species: Species, teamDetails: RandomTeamsTypes.TeamDetails,
	isLead: boolean, isDoubles: boolean, teraType: string, role: RandomTeamsTypes.Role,
) => boolean;

// Moves that restore HP:
const RECOVERY_MOVES = [
	'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'strengthsap', 'synthesis',
];
// Moves that drop stats:
const CONTRARY_MOVES = [
	'armorcannon', 'closecombat', 'leafstorm', 'makeitrain', 'overheat', 'spinout', 'superpower', 'vcreate',
];
// Moves that boost Attack:
const PHYSICAL_SETUP = [
	'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'honeclaws', 'howl', 'meditate', 'poweruppunch', 'swordsdance', 'tidyup', 'victorydance',
];
// Moves which boost Special Attack:
const SPECIAL_SETUP = [
	'calmmind', 'chargebeam', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow', 'takeheart', 'torchsong',
];
// Moves that boost Attack AND Special Attack:
// Dragon Dance is here to force Altaria to get it
const MIXED_SETUP = [
	'clangoroussoul', 'growth', 'happyhour', 'holdhands', 'noretreat', 'shellsmash', 'workup', 'dragondance', 'filletaway',
];
// Some moves that only boost Speed:
const SPEED_SETUP = [
	'agility', 'autotomize', 'flamecharge', 'rockpolish', 'trailblaze',
];
// Conglomerate for ease of access
const SETUP = [
	'acidarmor', 'agility', 'autotomize', 'bellydrum', 'bulkup', 'calmmind', 'clangoroussoul', 'coil', 'cosmicpower', 'curse', 'dragondance',
	'filletaway', 'flamecharge', 'growth', 'honeclaws', 'howl', 'irondefense', 'meditate', 'nastyplot', 'noretreat', 'poweruppunch', 'quiverdance',
	'rockpolish', 'shellsmash', 'shiftgear', 'swordsdance', 'tailglow', 'takeheart', 'tidyup', 'trailblaze', 'trick room', 'workup', 'victorydance',
];
const SPEED_CONTROL = [
	'electroweb', 'glare', 'icywind', 'lowsweep', 'quash', 'stringshot', 'tailwind', 'thunderwave', 'trickroom',
];
// Moves that shouldn't be the only STAB moves:
const NO_STAB = [
	'accelerock', 'aquajet', 'bounce', 'breakingswipe', 'bulletpunch', 'chatter', 'chloroblast', 'circlethrow', 'clearsmog', 'covet',
	'dragontail', 'doomdesire', 'electroweb', 'eruption', 'explosion', 'fakeout', 'feint', 'flamecharge', 'flipturn', 'futuresight',
	'grassyglide', 'iceshard', 'icywind', 'incinerate', 'infestation', 'machpunch', 'meteorbeam', 'mortalspin', 'nuzzle', 'pluck', 'pursuit',
	'quickattack', 'rapidspin', 'reversal', 'selfdestruct', 'shadowsneak', 'skydrop', 'snarl', 'strugglebug', 'suckerpunch', 'uturn',
	'vacuumwave', 'voltswitch', 'watershuriken', 'waterspout',
];
// Hazard-setting moves
const HAZARDS = [
	'spikes', 'stealthrock', 'stickyweb', 'toxicspikes',
];
// Protect and its variants
const PROTECT_MOVES = [
	'banefulbunker', 'burningbulwark', 'protect', 'silktrap', 'spikyshield',
];
// Moves that switch the user out
const PIVOT_MOVES = [
	'chillyreception', 'flipturn', 'partingshot', 'shedtail', 'teleport', 'uturn', 'voltswitch',
];

// Moves that should be paired together when possible
const MOVE_PAIRS = [
	['lightscreen', 'reflect'],
	['sleeptalk', 'rest'],
	['protect', 'wish'],
	['leechseed', 'protect'],
	['leechseed', 'substitute'],
	['leechseed', 'burningbulwark'],
];

/** Pokemon who always want priority STAB, and are fine with it as its only STAB move of that type */
const PRIORITY_POKEMON = [
	'breloom', 'brutebonnet', 'cacturne', 'honchkrow', 'mimikyu', 'ragingbolt', 'scizor',
];

/** Pokemon who should never be in the lead slot */
const NO_LEAD_POKEMON = [
	'Zacian', 'Zamazenta',
];
const DOUBLES_NO_LEAD_POKEMON = [
	'Basculegion', 'Houndstone', 'Iron Bundle', 'Roaring Moon', 'Zacian', 'Zamazenta',
];

const DEFENSIVE_TERA_BLAST_USERS = [
	'alcremie', 'bellossom', 'comfey', 'fezandipiti', 'florges',
];

function sereneGraceBenefits(move: Move) {
	return move.secondary?.chance && move.secondary.chance > 20 && move.secondary.chance < 100;
}

export class RandomTeams {
	dex: ModdedDex;
	gen: number;
	factoryTier: string;
	format: Format;
	prng: PRNG;
	noStab: string[];
	readonly maxTeamSize: number;
	readonly adjustLevel: number | null;
	readonly maxMoveCount: number;
	readonly forceMonotype: string | undefined;
	readonly forceTeraType: string | undefined;

	/**
	 * Checkers for move enforcement based on types or other factors
	 *
	 * returns true to try to force the move type, false otherwise.
	 */
	moveEnforcementCheckers: { [k: string]: MoveEnforcementChecker };

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		format = Dex.formats.get(format);
		this.dex = Dex.forFormat(format);
		this.gen = this.dex.gen;
		this.noStab = NO_STAB;

		const ruleTable = Dex.formats.getRuleTable(format);
		this.maxTeamSize = ruleTable.maxTeamSize;
		this.adjustLevel = ruleTable.adjustLevel;
		this.maxMoveCount = ruleTable.maxMoveCount;
		const forceMonotype = ruleTable.valueRules.get('forcemonotype');
		this.forceMonotype = forceMonotype && this.dex.types.get(forceMonotype).exists ?
			this.dex.types.get(forceMonotype).name : undefined;
		const forceTeraType = ruleTable.valueRules.get('forceteratype');
		this.forceTeraType = forceTeraType && this.dex.types.get(forceTeraType).exists ?
			this.dex.types.get(forceTeraType).name : undefined;

		this.factoryTier = '';
		this.format = format;
		this.prng = PRNG.get(prng);

		this.moveEnforcementCheckers = {
			Bug: (movePool, moves, abilities, types, counter) => (
				movePool.includes('megahorn') || movePool.includes('xscissor') ||
				(!counter.get('Bug') && (types.includes('Electric') || types.includes('Psychic')))
			),
			Dark: (
				movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles, teraType, role
			) => {
				if (
					counter.get('Dark') < 2 && PRIORITY_POKEMON.includes(species.id) && role === 'Wallbreaker'
				) return true;
				return !counter.get('Dark');
			},
			Dragon: (movePool, moves, abilities, types, counter) => !counter.get('Dragon'),
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric'),
			Fairy: (movePool, moves, abilities, types, counter) => !counter.get('Fairy'),
			Fighting: (movePool, moves, abilities, types, counter) => !counter.get('Fighting'),
			Fire: (movePool, moves, abilities, types, counter, species) => !counter.get('Fire'),
			Flying: (movePool, moves, abilities, types, counter) => !counter.get('Flying'),
			Ghost: (movePool, moves, abilities, types, counter) => !counter.get('Ghost'),
			Grass: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Grass') && (
					movePool.includes('leafstorm') || species.baseStats.atk >= 100 ||
					types.includes('Electric') || abilities.includes('Seed Sower')
				)
			),
			Ground: (movePool, moves, abilities, types, counter) => !counter.get('Ground'),
			Ice: (movePool, moves, abilities, types, counter) => (
				movePool.includes('freezedry') || movePool.includes('blizzard') || !counter.get('Ice')
			),
			Normal: (movePool, moves, types, counter) => (movePool.includes('boomburst') || movePool.includes('hypervoice')),
			Poison: (movePool, moves, abilities, types, counter) => {
				if (types.includes('Ground')) return false;
				return !counter.get('Poison');
			},
			Psychic: (movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles) => {
				if (counter.get('Psychic')) return false;
				if (movePool.includes('calmmind') || abilities.includes('Strong Jaw')) return true;
				if (isDoubles && movePool.includes('psychicfangs')) return true;
				return abilities.includes('Psychic Surge') || ['Bug', 'Electric', 'Fighting', 'Fire', 'Grass', 'Poison'].some(m => types.includes(m));
			},
			Rock: (movePool, moves, abilities, types, counter, species) => !counter.get('Rock') && species.baseStats.atk >= 80,
			Steel: (movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles) => (
				!counter.get('Steel') &&
				(isDoubles || species.baseStats.atk >= 90 || movePool.includes('gigatonhammer') || movePool.includes('makeitrain'))
			),
			Water: (movePool, moves, abilities, types, counter) => (!counter.get('Water') && !types.includes('Ground')),
		};
	}

	setSeed(prng?: PRNG | PRNGSeed) {
		this.prng = PRNG.get(prng);
	}

	getTeam(options?: PlayerOptions | null): PokemonSet[] {
		const generatorName = (
			typeof this.format.team === 'string' && this.format.team.startsWith('random')
		) ? this.format.team + 'Team' : '';
		return this[generatorName || 'randomTeam'](options);
	}

	randomChance(numerator: number, denominator: number) {
		return this.prng.randomChance(numerator, denominator);
	}

	sample<T>(items: readonly T[]): T {
		return this.prng.sample(items);
	}

	sampleIfArray<T>(item: T | T[]): T {
		if (Array.isArray(item)) {
			return this.sample(item);
		}
		return item;
	}

	random(m?: number, n?: number) {
		return this.prng.random(m, n);
	}

	/**
	 * Remove an element from an unsorted array significantly faster
	 * than .splice
	 */
	fastPop(list: any[], index: number) {
		// If an array doesn't need to be in order, replacing the
		// element at the given index with the removed element
		// is much, much faster than using list.splice(index, 1).
		const length = list.length;
		if (index < 0 || index >= list.length) {
			// sanity check
			throw new Error(`Index ${index} out of bounds for given array`);
		}

		const element = list[index];
		list[index] = list[length - 1];
		list.pop();
		return element;
	}

	/**
	 * Remove a random element from an unsorted array and return it.
	 * Uses the battle's RNG if in a battle.
	 */
	sampleNoReplace(list: any[]) {
		const length = list.length;
		if (length === 0) return null;
		const index = this.random(length);
		return this.fastPop(list, index);
	}

	/**
	 * Removes n random elements from an unsorted array and returns them.
	 * If n is less than the array's length, randomly removes and returns all the elements
	 * in the array (so the returned array could have length < n).
	 */
	multipleSamplesNoReplace<T>(list: T[], n: number): T[] {
		const samples = [];
		while (samples.length < n && list.length) {
			samples.push(this.sampleNoReplace(list));
		}

		return samples;
	}

	/**
	 * Check if user has directly tried to ban/unban/restrict things in a custom battle.
	 * Doesn't count bans nested inside other formats/rules.
	 */
	private hasDirectCustomBanlistChanges() {
		if (this.format.banlist.length || this.format.restricted.length || this.format.unbanlist.length) return true;
		if (!this.format.customRules) return false;
		for (const rule of this.format.customRules) {
			for (const banlistOperator of ['-', '+', '*']) {
				if (rule.startsWith(banlistOperator)) return true;
			}
		}
		return false;
	}

	/**
	 * Inform user when custom bans are unsupported in a team generator.
	 */
	protected enforceNoDirectCustomBanlistChanges() {
		if (this.hasDirectCustomBanlistChanges()) {
			throw new Error(`Custom bans are not currently supported in ${this.format.name}.`);
		}
	}

	/**
	 * Inform user when complex bans are unsupported in a team generator.
	 */
	protected enforceNoDirectComplexBans() {
		if (!this.format.customRules) return false;
		for (const rule of this.format.customRules) {
			if (rule.includes('+') && !rule.startsWith('+')) {
				throw new Error(`Complex bans are not currently supported in ${this.format.name}.`);
			}
		}
	}

	/**
	 * Validate set element pool size is sufficient to support size requirements after simple bans.
	 */
	private enforceCustomPoolSizeNoComplexBans(
		effectTypeName: string,
		basicEffectPool: BasicEffect[],
		requiredCount: number,
		requiredCountExplanation: string
	) {
		if (basicEffectPool.length >= requiredCount) return;
		throw new Error(`Legal ${effectTypeName} count is insufficient to support ${requiredCountExplanation} (${basicEffectPool.length} / ${requiredCount}).`);
	}

	queryMoves(
		moves: Set<string> | null,
		species: Species,
		teraType: string,
		abilities: string[],
	): MoveCounter {
		// This is primarily a helper function for random setbuilder functions.
		const counter = new MoveCounter();
		const types = species.types;
		if (!moves?.size) return counter;

		const categories = { Physical: 0, Special: 0, Status: 0 };

		// Iterate through all moves we've chosen so far and keep track of what they do:
		for (const moveid of moves) {
			const move = this.dex.moves.get(moveid);

			const moveType = this.getMoveType(move, species, abilities, teraType);
			if (move.damage || move.damageCallback) {
				// Moves that do a set amount of damage:
				counter.add('damage');
				counter.damagingMoves.add(move);
			} else {
				// Are Physical/Special/Status moves:
				categories[move.category]++;
			}
			// Moves that have a low base power:
			if (moveid === 'lowkick' || (move.basePower && move.basePower <= 60 && moveid !== 'rapidspin')) {
				counter.add('technician');
			}
			// Moves that hit up to 5 times:
			if (move.multihit && Array.isArray(move.multihit) && move.multihit[1] === 5) counter.add('skilllink');
			if (move.recoil || move.hasCrashDamage) counter.add('recoil');
			if (move.drain) counter.add('drain');
			// Moves which have a base power:
			if (move.basePower || move.basePowerCallback) {
				if (!this.noStab.includes(moveid) || PRIORITY_POKEMON.includes(species.id) && move.priority > 0) {
					counter.add(moveType);
					if (types.includes(moveType)) counter.add('stab');
					if (teraType === moveType) counter.add('stabtera');
					counter.damagingMoves.add(move);
				}
				if (move.flags['bite']) counter.add('strongjaw');
				if (move.flags['punch']) counter.add('ironfist');
				if (move.flags['sound']) counter.add('sound');
				if (move.priority > 0 || (moveid === 'grassyglide' && abilities.includes('Grassy Surge'))) {
					counter.add('priority');
				}
			}
			// Moves with secondary effects:
			if (move.secondary || move.hasSheerForce) {
				counter.add('sheerforce');
				if (sereneGraceBenefits(move)) {
					counter.add('serenegrace');
				}
			}
			// Moves with low accuracy:
			if (move.accuracy && move.accuracy !== true && move.accuracy < 90) counter.add('inaccurate');

			// Moves that change stats:
			if (RECOVERY_MOVES.includes(moveid)) counter.add('recovery');
			if (CONTRARY_MOVES.includes(moveid)) counter.add('contrary');
			if (PHYSICAL_SETUP.includes(moveid)) counter.add('physicalsetup');
			if (SPECIAL_SETUP.includes(moveid)) counter.add('specialsetup');
			if (MIXED_SETUP.includes(moveid)) counter.add('mixedsetup');
			if (SPEED_SETUP.includes(moveid)) counter.add('speedsetup');
			if (SETUP.includes(moveid)) counter.add('setup');
			if (HAZARDS.includes(moveid)) counter.add('hazards');
		}

		counter.set('Physical', Math.floor(categories['Physical']));
		counter.set('Special', Math.floor(categories['Special']));
		counter.set('Status', categories['Status']);
		return counter;
	}

	cullMovePool(
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): void {
		if (moves.size + movePool.length <= this.maxMoveCount) return;
		// If we have two unfilled moves and only one unpaired move, cull the unpaired move.
		if (moves.size === this.maxMoveCount - 2) {
			const unpairedMoves = [...movePool];
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[0]));
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[1]));
				}
			}
			if (unpairedMoves.length === 1) {
				this.fastPop(movePool, movePool.indexOf(unpairedMoves[0]));
			}
		}

		// These moves are paired, and shouldn't appear if there is not room for them both.
		if (moves.size === this.maxMoveCount - 1) {
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(movePool, movePool.indexOf(pair[0]));
					this.fastPop(movePool, movePool.indexOf(pair[1]));
				}
			}
		}

		// Develop additional move lists
		const statusMoves = this.dex.moves.all()
			.filter(move => move.category === 'Status')
			.map(move => move.id);

		// Team-based move culls
		if (teamDetails.screens && movePool.length >= this.maxMoveCount + 2) {
			if (movePool.includes('reflect')) this.fastPop(movePool, movePool.indexOf('reflect'));
			if (movePool.includes('lightscreen')) this.fastPop(movePool, movePool.indexOf('lightscreen'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.stickyWeb) {
			if (movePool.includes('stickyweb')) this.fastPop(movePool, movePool.indexOf('stickyweb'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.stealthRock) {
			if (movePool.includes('stealthrock')) this.fastPop(movePool, movePool.indexOf('stealthrock'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.defog || teamDetails.rapidSpin) {
			if (movePool.includes('defog')) this.fastPop(movePool, movePool.indexOf('defog'));
			if (movePool.includes('rapidspin')) this.fastPop(movePool, movePool.indexOf('rapidspin'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.toxicSpikes) {
			if (movePool.includes('toxicspikes')) this.fastPop(movePool, movePool.indexOf('toxicspikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.spikes && teamDetails.spikes >= 2) {
			if (movePool.includes('spikes')) this.fastPop(movePool, movePool.indexOf('spikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.statusCure) {
			if (movePool.includes('healbell')) this.fastPop(movePool, movePool.indexOf('healbell'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}

		if (isDoubles) {
			const doublesIncompatiblePairs = [
				// In order of decreasing generalizability
				[SPEED_CONTROL, SPEED_CONTROL],
				[HAZARDS, HAZARDS],
				[PROTECT_MOVES, PROTECT_MOVES],
				['rockslide', 'stoneedge'],
				[SETUP, ['fakeout', 'helpinghand']],
				[PROTECT_MOVES, 'wideguard'],
				[['fierydance', 'fireblast'], 'heatwave'],
				['dazzlinggleam', ['fleurcannon', 'moonblast']],
				['poisongas', ['toxicspikes', 'willowisp']],
				[RECOVERY_MOVES, 'healpulse'],
				['lifedew', 'healpulse'],
				['haze', 'icywind'],
				[['hydropump', 'muddywater'], ['muddywater', 'scald']],
				['disable', 'encore'],
				['freezedry', 'icebeam'],
				['energyball', 'leafstorm'],
				['wildcharge', 'thunderbolt'],
				['earthpower', 'sandsearstorm'],
				['coaching', ['helpinghand', 'howl']],
			];

			for (const pair of doublesIncompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

			if (role !== 'Offensive Protect') this.incompatibleMoves(moves, movePool, PROTECT_MOVES, ['flipturn', 'uturn']);
		}

		// General incompatibilities
		const incompatiblePairs = [
			// These moves don't mesh well with other aspects of the set
			[statusMoves, ['healingwish', 'switcheroo', 'trick']],
			[SETUP, PIVOT_MOVES],
			[SETUP, HAZARDS],
			[SETUP, ['defog', 'nuzzle', 'toxic', 'yawn', 'haze']],
			[PHYSICAL_SETUP, PHYSICAL_SETUP],
			[SPECIAL_SETUP, 'thunderwave'],
			['substitute', PIVOT_MOVES],
			[SPEED_SETUP, ['aquajet', 'rest', 'trickroom']],
			['curse', ['irondefense', 'rapidspin']],
			['dragondance', 'dracometeor'],

			// These attacks are redundant with each other
			// [['psychic', 'psychicnoise'], ['psyshock', 'psychicnoise']],
			['surf', 'hydropump'],
			['liquidation', 'wavecrash'],
			['aquajet', 'flipturn'],
			['gigadrain', 'leafstorm'],
			['powerwhip', 'hornleech'],
			[['airslash', 'bravebird', 'hurricane'], ['airslash', 'bravebird', 'hurricane']],
			['knockoff', 'foulplay'],
			['throatchop', ['crunch', 'lashout']],
			['doubleedge', ['bodyslam', 'headbutt']],
			['fireblast', ['fierydance', 'flamethrower']],
			['lavaplume', 'magmastorm'],
			['thunderpunch', 'wildcharge'],
			[['thunderbolt', 'discharge', 'thunder'], ['thunderbolt', 'discharge', 'thunder']],
			['gunkshot', ['direclaw', 'poisonjab', 'sludgebomb']],
			['aurasphere', 'focusblast'],
			['closecombat', 'drainpunch'],
			['bugbite', 'pounce'],
			[['dragonpulse', 'spacialrend'], 'dracometeor'],
			['heavyslam', 'flashcannon'],
			['alluringvoice', 'dazzlinggleam'],

			// These status moves are redundant with each other
			['taunt', 'disable'],
			[['thunderwave', 'toxic'], ['thunderwave', 'willowisp']],
			[['thunderwave', 'toxic', 'willowisp'], 'toxicspikes'],

		];

		for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

		if (!types.includes('Ice')) this.incompatibleMoves(moves, movePool, 'icebeam', 'icywind');

		if (!isDoubles) this.incompatibleMoves(moves, movePool, ['taunt', 'strengthsap'], 'encore');

		if (!types.includes('Dark') && teraType !== 'Dark') this.incompatibleMoves(moves, movePool, 'knockoff', 'suckerpunch');

		if (!abilities.includes('Prankster')) this.incompatibleMoves(moves, movePool, 'thunderwave', 'yawn');

		// This space reserved for assorted hardcodes that otherwise make little sense out of context
		if (species.id === 'lurantis') this.incompatibleMoves(moves, movePool, 'leafstorm', 'powerwhip');
		if (species.id === 'ironcrown') this.incompatibleMoves(moves, movePool, 'kingsshield', 'stealthrock');
		if (species.id === 'ironcrown') this.incompatibleMoves(moves, movePool, 'kingsshield', 'rest');
		if (species.id === 'ironcrown') this.incompatibleMoves(moves, movePool, 'rest', 'stealthrock');
		if (species.id === 'carbink') this.incompatibleMoves(moves, movePool, 'spikes', 'stealthrock');
		if (species.id === 'moltres') this.incompatibleMoves(moves, movePool, 'bravebird', 'woodhammer');
		if (species.id === 'moltres') this.incompatibleMoves(moves, movePool, 'flareblitz', 'wavecrash');
		if (species.id === 'kommoo') this.incompatibleMoves(moves, movePool, 'aurasphere', 'closecombat');
		if (species.id === 'archaludon') this.incompatibleMoves(moves, movePool, 'scald', 'hydropump');
		if (species.id === 'abomasnowmega') this.incompatibleMoves(moves, movePool, 'iceshard', 'snowscape');
		if (species.id === 'regieleki') this.incompatibleMoves(moves, movePool, 'blazingtorque', 'soak');
		if (species.id === 'tatsugiri') this.incompatibleMoves(moves, movePool, 'nastyplot', 'rapidspin');
		if (species.id === 'golurk') this.incompatibleMoves(moves, movePool, 'icepunch', 'dynamicpunch');
		if (species.id === 'veluza') this.incompatibleMoves(moves, movePool, 'waterfall', 'hydropump');
		if (species.id === 'ogerponhearthflame') this.incompatibleMoves(moves, movePool, 'crabhammer', 'stoneedge');
	}

	// Checks for and removes incompatible moves, starting with the first move in movesA.
	incompatibleMoves(
		moves: Set<string>,
		movePool: string[],
		movesA: string | string[],
		movesB: string | string[],
	): void {
		const moveArrayA = (Array.isArray(movesA)) ? movesA : [movesA];
		const moveArrayB = (Array.isArray(movesB)) ? movesB : [movesB];
		if (moves.size + movePool.length <= this.maxMoveCount) return;
		for (const moveid1 of moves) {
			if (moveArrayB.includes(moveid1)) {
				for (const moveid2 of moveArrayA) {
					if (moveid1 !== moveid2 && movePool.includes(moveid2)) {
						this.fastPop(movePool, movePool.indexOf(moveid2));
						if (moves.size + movePool.length <= this.maxMoveCount) return;
					}
				}
			}
			if (moveArrayA.includes(moveid1)) {
				for (const moveid2 of moveArrayB) {
					if (moveid1 !== moveid2 && movePool.includes(moveid2)) {
						this.fastPop(movePool, movePool.indexOf(moveid2));
						if (moves.size + movePool.length <= this.maxMoveCount) return;
					}
				}
			}
		}
	}

	// Adds a move to the moveset, returns the MoveCounter
	addMove(
		move: string,
		moves: Set<string>,
		types: string[],
		abilities: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		movePool: string[],
		teraType: string,
		role: RandomTeamsTypes.Role,
	): MoveCounter {
		moves.add(move);
		this.fastPop(movePool, movePool.indexOf(move));
		const counter = this.queryMoves(moves, species, teraType, abilities);
		this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead, isDoubles, teraType, role);
		return counter;
	}

	// Returns the type of a given move for STAB/coverage enforcement purposes
	getMoveType(move: Move, species: Species, abilities: string[], teraType: string): string {
		if (move.id === 'terablast') return teraType;
		if (['judgment', 'revelationdance'].includes(move.id)) return species.types[0];

		if (move.name === "Raging Bull" && species.name.startsWith("Tauros-Paldea")) {
			if (species.name.endsWith("Combat")) return "Fighting";
			if (species.name.endsWith("Blaze")) return "Fire";
			if (species.name.endsWith("Aqua")) return "Water";
		}

		if (move.name === "Ivy Cudgel" && species.name.startsWith("Ogerpon")) {
			if (species.name.endsWith("Wellspring")) return "Water";
			if (species.name.endsWith("Hearthflame")) return "Fire";
			if (species.name.endsWith("Cornerstone")) return "Rock";
		}

		const moveType = move.type;
		if (moveType === 'Normal') {
			if (abilities.includes('Aerilate')) return 'Flying';
			if (abilities.includes('Galvanize')) return 'Electric';
			if (abilities.includes('Pixilate')) return 'Fairy';
			if (abilities.includes('Refrigerate')) return 'Ice';
		}
		return moveType;
	}

	// Generate random moveset for a given species, role, tera type.
	randomMoveset(
		types: string[],
		abilities: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		movePool: string[],
		teraType: string,
		role: RandomTeamsTypes.Role,
	): Set<string> {
		const moves = new Set<string>();
		let counter = this.queryMoves(moves, species, teraType, abilities);
		this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead, isDoubles, teraType, role);

		// If there are only four moves, add all moves and return early
		if (movePool.length <= this.maxMoveCount) {
			for (const moveid of movePool) {
				moves.add(moveid);
			}
			return moves;
		}

		const runEnforcementChecker = (checkerName: string) => {
			if (!this.moveEnforcementCheckers[checkerName]) return false;
			return this.moveEnforcementCheckers[checkerName](
				movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles, teraType, role
			);
		};

		if (role === 'Tera Blast user') {
			counter = this.addMove('terablast', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}
		// Add required move (e.g. Relic Song for Meloetta-P)
		if (species.requiredMove) {
			const move = this.dex.moves.get(species.requiredMove).id;
			counter = this.addMove(move, moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Add other moves you really want to have, e.g. STAB, recovery, setup.

		// PMCM hardcodes (reserve these to when absolutely necessary, let the script do most of the work)
		// forces Splash on Chi-Yu's moveset, since it uses Z-Splash
		if (species.id === 'chiyu') {
			if (movePool.includes('splash')) {
				counter = this.addMove('splash', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}
		// 33% chance to force Dragon Dance on Mega Altaria, since it otherwise never gets it due to teambuilder shenanigans
		if (species.id === 'altariamega') {
			if (movePool.includes('dragondance')) {
				if (this.randomChance(1, 3)) {
					counter = this.addMove('dragondance', moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		}
		// enforces a sound move on Mesprit with Throat Spray
		if (species.id === 'mesprit') {
			if (movePool.includes('psychicnoise')) {
				if (this.randomChance(1, 2)) {
					counter = this.addMove('psychicnoise', moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				} else {
					counter = this.addMove('torchsong', moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		}
		// enforces both primary stabs on Infernape
		if (species.id === 'infernape') {
			if (movePool.includes('mindblown')) {
				counter = this.addMove('mindblown', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
				counter = this.addMove('alloutassault', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Facade if Guts is a possible ability
		if (movePool.includes('facade') && abilities.includes('Guts')) {
			counter = this.addMove('facade', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Enforce Night Shade, Revelation Dance, Revival Blessing, and Sticky Web
		for (const moveid of ['nightshade', 'revelationdance', 'revivalblessing', 'stickyweb']) {
			if (movePool.includes(moveid)) {
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Trick Room on Doubles Wallbreaker
		if (movePool.includes('trickroom') && role === 'Doubles Wallbreaker') {
			counter = this.addMove('trickroom', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Enforce hazard removal on Bulky Support if the team doesn't already have it
		if (role === 'Bulky Support' && !teamDetails.defog && !teamDetails.rapidSpin) {
			if (movePool.includes('rapidspin')) {
				counter = this.addMove('rapidspin', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
			if (movePool.includes('defog')) {
				counter = this.addMove('defog', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Knock Off on pure Normal- and Fighting-types in singles
		if (!isDoubles && types.length === 1 && (types.includes('Normal') || types.includes('Fighting'))) {
			if (movePool.includes('knockoff')) {
				counter = this.addMove('knockoff', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Flip Turn on pure Water-type Wallbreakers
		if (types.length === 1 && types.includes('Water') && role === 'Wallbreaker') {
			if (movePool.includes('flipturn')) {
				counter = this.addMove('flipturn', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Spore on Smeargle
		if (species.id === 'smeargle') {
			if (movePool.includes('spore')) {
				counter = this.addMove('spore', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce moves in doubles
		if (isDoubles) {
			const doublesEnforcedMoves = ['auroraveil', 'mortalspin', 'spore'];
			for (const moveid of doublesEnforcedMoves) {
				if (movePool.includes(moveid)) {
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
			// Enforce Fake Out on slow Pokemon
			if (movePool.includes('fakeout') && species.baseStats.spe <= 50) {
				counter = this.addMove('fakeout', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
			// Enforce Tailwind on Prankster and Gale Wings users
			if (movePool.includes('tailwind') && (abilities.includes('Prankster') || abilities.includes('Gale Wings'))) {
				counter = this.addMove('tailwind', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
			// Enforce Thunder Wave on Prankster users as well
			if (movePool.includes('thunderwave') && abilities.includes('Prankster')) {
				counter = this.addMove('thunderwave', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce STAB priority
		if (
			['Bulky Attacker', 'Bulky Setup', 'Wallbreaker', 'Doubles Wallbreaker'].includes(role) ||
			PRIORITY_POKEMON.includes(species.id)
		) {
			const priorityMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (
					types.includes(moveType) && (move.priority > 0 || (moveid === 'grassyglide' && abilities.includes('Grassy Surge'))) &&
					(move.basePower || move.basePowerCallback)
				) {
					priorityMoves.push(moveid);
				}
			}
			if (priorityMoves.length) {
				const moveid = this.sample(priorityMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce a single STAB for Moltres
		if (species.id === 'moltres') {
			const typeToEnforce = (this.randomChance(1, 2)) ? 'Fire' : 'Flying';

			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && typeToEnforce === moveType) {
					stabMoves.push(moveid);
				}
			}
			while (runEnforcementChecker(typeToEnforce)) {
				if (!stabMoves.length) break;
				const moveid = this.sampleNoReplace(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce STAB
		for (const type of types) {
			// Moltres already has STAB, so ignore this block
			if (species.id === 'moltres') break;
			// prevents Meowscarada from being enforced stab moves
			if (species.id === 'meowscarada') break;
			// Check if a STAB move of that type should be required
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && type === moveType) {
					stabMoves.push(moveid);
				}
			}
			while (runEnforcementChecker(type)) {
				if (!stabMoves.length) break;
				const moveid = this.sampleNoReplace(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Tera STAB
		if (!counter.get('stabtera') && !['Bulky Support', 'Doubles Support'].includes(role)) {
			const stabMoves = [];
			for (const moveid of movePool) {
				// prevents Meowscarada from being enforced stab moves (since it has Protean and doesn't care)
				if (species.id === 'meowscarada') break;
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && teraType === moveType) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// If no STAB move was added, add a STAB move
		if (!counter.get('stab')) {
			const stabMoves = [];
			for (const moveid of movePool) {
				// prevents Meowscarada from being enforced stab moves (since it has Protean and doesn't care)
				if (species.id === 'meowscarada') break;
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && types.includes(moveType)) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce recovery
		if (['Bulky Support', 'Bulky Attacker', 'Bulky Setup'].includes(role)) {
			const recoveryMoves = movePool.filter(moveid => RECOVERY_MOVES.includes(moveid));
			if (recoveryMoves.length) {
				const moveid = this.sample(recoveryMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce setup
		if (role.includes('Setup') || role === 'Tera Blast user') {
			// First, try to add a non-Speed setup move
			const nonSpeedSetupMoves = movePool.filter(moveid => SETUP.includes(moveid) && !SPEED_SETUP.includes(moveid));
			if (nonSpeedSetupMoves.length) {
				const moveid = this.sample(nonSpeedSetupMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			} else {
				// No non-Speed setup moves, so add any (Speed) setup move
				const setupMoves = movePool.filter(moveid => SETUP.includes(moveid));
				if (setupMoves.length) {
					const moveid = this.sample(setupMoves);
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		}

		// Enforce redirecting moves and Fake Out on Doubles Support
		if (role === 'Doubles Support') {
			for (const moveid of ['fakeout', 'followme', 'ragepowder']) {
				if (movePool.includes(moveid)) {
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		}

		// Enforce Protect
		if (role.includes('Protect')) {
			const protectMoves = movePool.filter(moveid => PROTECT_MOVES.includes(moveid));
			if (protectMoves.length) {
				const moveid = this.sample(protectMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce a move not on the noSTAB list
		if (!counter.damagingMoves.size) {
			// Choose an attacking move
			const attackingMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				if (!this.noStab.includes(moveid) && (move.category !== 'Status')) attackingMoves.push(moveid);
			}
			if (attackingMoves.length) {
				const moveid = this.sample(attackingMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce coverage move
		if (!['AV Pivot', 'Fast Support', 'Bulky Support', 'Bulky Protect', 'Doubles Support'].includes(role)) {
			if (counter.damagingMoves.size === 1) {
				// Find the type of the current attacking move
				const currentAttackType = counter.damagingMoves.values().next().value.type;
				// Choose an attacking move that is of different type to the current single attack
				const coverageMoves = [];
				for (const moveid of movePool) {
					const move = this.dex.moves.get(moveid);
					const moveType = this.getMoveType(move, species, abilities, teraType);
					if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback)) {
						if (currentAttackType !== moveType) coverageMoves.push(moveid);
					}
				}
				if (coverageMoves.length) {
					const moveid = this.sample(coverageMoves);
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		}

		// Add (moves.size < this.maxMoveCount) as a condition if moves is getting larger than 4 moves.
		// If you want moves to be favored but not required, add something like && this.randomChance(1, 2) to your condition.

		// Choose remaining moves randomly from movepool and add them to moves list:
		while (moves.size < this.maxMoveCount && movePool.length) {
			if (moves.size + movePool.length <= this.maxMoveCount) {
				for (const moveid of movePool) {
					moves.add(moveid);
				}
				break;
			}
			const moveid = this.sample(movePool);
			counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
			for (const pair of MOVE_PAIRS) {
				if (moveid === pair[0] && movePool.includes(pair[1])) {
					counter = this.addMove(pair[1], moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
				if (moveid === pair[1] && movePool.includes(pair[0])) {
					counter = this.addMove(pair[0], moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		}
		return moves;
	}

	shouldCullAbility(
		ability: string,
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): boolean {
		switch (ability) {
		// Abilities which are primarily useful for certain moves or with team support
		case 'Chlorophyll': case 'Solar Power':
			return !teamDetails.sun;
		case 'Defiant':
			return (species.id === 'thundurus' && !!counter.get('Status'));
		case 'Hydration': case 'Swift Swim':
			return !teamDetails.rain;
		case 'Iron Fist': case 'Skill Link':
			return !counter.get(toID(ability));
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Prankster':
			return !counter.get('Status');
		case 'Sand Force': case 'Sand Rush':
			return !teamDetails.sand;
		case 'Slush Rush':
			return !teamDetails.snow;
		case 'Swarm':
			return !counter.get('Bug');
		case 'Torrent':
			return (!counter.get('Water') && !moves.has('flipturn'));
		}

		return false;
	}

	getAbility(
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		if (abilities.length <= 1) return abilities[0];

		// Hard-code abilities here
		if (species.id === 'drifblim') return moves.has('defog') ? 'Aftermath' : 'Unburden';
		if (species.id === 'hitmonchan' && counter.get('ironfist')) return 'Iron Fist';
		if ((species.id === 'thundurus' || species.id === 'tornadus') && !counter.get('Physical')) return 'Prankster';
		if (species.id === 'swampert' && (counter.get('Water') || moves.has('flipturn'))) return 'Torrent';
		if (species.id === 'toucannon' && counter.get('skilllink')) return 'Skill Link';
		if (abilities.includes('Slush Rush') && moves.has('snowscape')) return 'Slush Rush';
		if (species.id === 'golduck' && teamDetails.rain) return 'Swift Swim';

		// ffa abilities that differ from doubles
		if (this.format.gameType === 'freeforall') {
			if (species.id === 'bellossom') return 'Chlorophyll';
			if (species.id === 'sinistcha') return 'Heatproof';
			if (species.id === 'oranguru') return 'Inner Focus';
			if (species.id === 'duraludon') return 'Light Metal';
			if (species.id === 'clefairy') return 'Magic Guard';
			if (species.id === 'blissey') return 'Natural Cure';
			if (species.id === 'barraskewda') return 'Swift Swim';
			if (abilities.includes('Pressure') && abilities.includes('Telepathy')) return 'Pressure';
		}

		const abilityAllowed: string[] = [];
		// Obtain a list of abilities that are allowed (not culled)
		for (const ability of abilities) {
			if (!this.shouldCullAbility(
				ability, types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role
			)) {
				abilityAllowed.push(ability);
			}
		}

		// Pick a random allowed ability
		if (abilityAllowed.length >= 1) return this.sample(abilityAllowed);

		// If all abilities are rejected, prioritize weather abilities over non-weather abilities
		if (!abilityAllowed.length) {
			const weatherAbilities = abilities.filter(
				a => ['Chlorophyll', 'Hydration', 'Sand Force', 'Sand Rush', 'Slush Rush', 'Solar Power', 'Swift Swim'].includes(a)
			);
			if (weatherAbilities.length) return this.sample(weatherAbilities);
		}

		// Pick a random ability
		return this.sample(abilities);
	}

	getPriorityItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	) {
		if (!isDoubles) {
			if (role === 'Fast Bulky Setup' && (ability === 'Quark Drive' || ability === 'Protosynthesis')) {
				return 'Booster Energy';
			}
			if (species.id === 'lokix') {
				return (role === 'Fast Attacker') ? 'Silver Powder' : 'Life Orb';
			}
		}
		if (species.requiredItems) {
			// Z-Crystals aren't available in Gen 9, so require Plates
			if (species.baseSpecies === 'Arceus') {
				return species.requiredItems[0];
			}
			return this.sample(species.requiredItems);
		}
		if (role === 'AV Pivot') return 'Assault Vest';
		if (species.id === 'pikachu') return 'Light Ball';
		if (species.id === 'regieleki') return 'Magnet';
		if (species.id === 'smeargle') return 'Focus Sash';

		// PMCM hardcodes
		if (species.id === 'volcarona') return 'Heavy-Duty Boots';
		if (species.id === 'golemalola') return 'Life Orb';
		if (species.id === 'ironcrown') return this.sample(['Chesto Berry', 'Leftovers']);
		if (species.id === 'lurantis') return this.sample(['Life Orb', 'Leftovers']);
		if (species.id === 'carbink') return 'Leftovers';
		if (species.id === 'moltres') return 'Life Orb';
		if (species.id === 'kommoo') return 'Throat Spray';
		if (species.id === 'volbeat') return 'Focus Sash';
		if (species.id === 'illumise') return 'Focus Sash';
		if (species.id === 'abomasnow') return 'Light Clay';
		if (species.id === 'dugtrio' && moves.has("swordsdance")) return 'Focus Sash';
		if (species.id === 'dugtrio') return 'Choice Band';
		if (species.id === 'altaria') return 'Heavy-Duty Boots';
		if (species.id === 'tyranitar') return 'Choice Scarf';
		if (species.id === 'mimikyu') return 'Red Card';
		if (species.id === 'mesprit' && moves.has("aquaring")) return 'Leftovers';
		if (species.id === 'mesprit') return 'Throat Spray';
		if (species.id === 'electrode' && moves.has("rapidspin")) return 'Heavy-Duty Boots';
		if (species.id === 'electrode') return this.sample(['Normal Gem', 'Heavy-Duty Boots']);
		if (species.id === 'taurospaldeacombat') return 'Expert Belt';
		if (species.id === 'chiyu') return 'Normalium Z';
		if (species.id === 'wochien') return 'Big Root';
		if (species.id === 'staraptor') return 'Choice Scarf';
		if (species.id === 'archaludon' && ability === 'Hydroelectric Dam') return 'Assault Vest';
		if (species.id === 'archaludon' && ability === 'Stamina') return 'Leftovers';
		if (species.id === 'malamar') return this.sample(['Mirror Herb', 'Leftovers']);
		if (species.id === 'empoleon') return 'Rocky Helmet';
		if (species.id === 'glastrier' && moves.has('swordsdance')) return 'Heavy-Duty Boots';
		if (species.id === 'glastrier') return 'Assault Vest';
		if (species.id === 'lycanrocmidnight') return 'Loaded Dice';
		if (species.id === 'lycanroc') return this.sample(['Leftovers', 'Heavy-Duty Boots']);
		if (species.id === 'lycanrocdusk') return 'Expert Belt';
		if (species.id === 'dodrio') return 'Life Orb';
		if (species.id === 'whiscash') return 'Rocky Helmet';
		if (species.id === 'hippowdon') return this.sample(['Leftovers', 'Rocky Helmet']);
		if (species.id === 'cramorant') return 'Heavy-Duty Boots';
		if (species.id === 'grafaiai') return this.sample(['Red Card', 'Mirror Herb']);
		if (species.id === 'tatsugiri') return 'Mystic Water';
		if (species.id === 'kyurem') return 'Heavy-Duty Boots';
		if (species.id === 'roaringmoon') return 'Heavy-Duty Boots';
		if (species.id === 'milotic') return 'Rocky Helmet';
		if (species.id === 'gogoat') return 'Leftovers';
		if (species.id === 'clodsire') return this.sample(['Leftovers', 'Rocky Helmet']);
		if (species.id === 'masquerain') return 'Heavy-Duty Boots';
		if (species.id === 'kyuremblack' && moves.has('roost')) return 'Heavy-Duty Boots';
		if (species.id === 'kyuremblack') return this.sample(['Choice Band', 'Heavy-Duty Boots']);
		if (species.id === 'ironthorns') return 'Rocky Helmet';
		if (species.id === 'dudunsparce') return 'Leftovers';
		if (species.id === 'chienpao') return 'Heavy Duty Boots';
		if (species.id === 'pelipper' && moves.has('roost')) return 'Heavy-Duty Boots';
		if (species.id === 'pelipper') return 'Choice Specs';
		if (species.id === 'kleavor') return 'Choice Scarf';
		if (species.id === 'araquanid') return 'Heavy-Duty Boots';
		if (species.id === 'avalugghisui') return 'Heavy-Duty Boots';
		if (species.id === 'swalot') return 'Leftovers';
		if (species.id === 'zapdosgalar') return this.sample(['Choice Scarf', 'Expert Belt']);
		if (species.id === 'phione') return 'Leftovers';
		if (species.id === 'sudowoodo' && moves.has('synthesis')) return this.sample(['Red Card', 'Leftovers']);
		if (species.id === 'sudowoodo' && moves.has('curse')) return this.sample(['Red Card', 'Leftovers']);
		if (species.id === 'sudowoodo') return 'Choice Band';
		if (species.id === 'dondozo') return 'Leftovers';
		if (species.id === 'golurk') return this.sample(['Life Orb', 'Punching Glove', 'Colbur Berry']);
		if (species.id === 'meowscarada') return 'Heavy-Duty Boots';
		if (species.id === 'infernape') return this.sample(['Life Orb', 'Sitrus Berry', 'Air Balloon']);
		if (species.id === 'urshifu') return this.sample(['Life Orb', 'Protective Pads']);
		if (species.id === 'urshifurapidstrike') return this.sample(['Life Orb', 'Protective Pads']);
		if (species.id === 'salamence') return this.sample(['Life Orb', 'Heavy-Duty Boots', 'Sky Plate']);
		if (species.id === 'stonjourner') return 'Life Orb';
		if (species.id === 'veluza') return 'Sitrus Berry';
		if (species.id === 'ogerponhearthflame') return 'Hearthflame Mask';
		if (species.id === 'dachsbun') return 'Rocky Helmet';
		if (species.id === 'mew') return 'Starf Berry';
		if (species.id === 'magneton') return this.sample(['Air Balloon', 'Chople Berry']);

		if (
			species.id === 'froslass' || moves.has('populationbomb') ||
			(ability === 'Hustle' && counter.get('setup') && !isDoubles && this.randomChance(1, 2))
		) return 'Wide Lens';
		if (moves.has('clangoroussoul') || (species.id === 'toxtricity' && moves.has('shiftgear'))) return 'Throat Spray';
		if (
			(species.baseSpecies === 'Magearna' && role === 'Tera Blast user') ||
			species.id === 'necrozmaduskmane' || (species.id === 'calyrexice' && isDoubles)
		) return 'Weakness Policy';
		if (['dragonenergy', 'lastrespects', 'waterspout'].some(m => moves.has(m))) return 'Choice Scarf';
		if (
			!isDoubles && (ability === 'Imposter' || (species.id === 'magnezone' && role === 'Fast Attacker'))
		) return 'Choice Scarf';
		if (species.id === 'rampardos' && (role === 'Fast Attacker' || isDoubles)) return 'Choice Scarf';
		if (species.id === 'palkia' && counter.get('Special') < 4) return 'Lustrous Orb';
		if (
			moves.has('courtchange') ||
			!isDoubles && (species.id === 'luvdisc' || (species.id === 'terapagos' && !moves.has('rest')))
		) return 'Heavy-Duty Boots';
		if (moves.has('bellydrum') && moves.has('substitute')) return 'Salac Berry';
		if (
			['Cheek Pouch', 'Cud Chew', 'Harvest', 'Ripen'].some(m => ability === m) ||
			moves.has('bellydrum') || moves.has('filletaway')
		) {
			return 'Sitrus Berry';
		}
		if (['healingwish', 'switcheroo', 'trick'].some(m => moves.has(m))) {
			if (
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				role !== 'Wallbreaker' && role !== 'Doubles Wallbreaker' && !counter.get('priority')
			) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (counter.get('Status') && (species.name === 'Latias' || species.name === 'Latios')) return 'Soul Dew';
		if (species.id === 'scyther' && !isDoubles) return (isLead && !moves.has('uturn')) ? 'Eviolite' : 'Heavy-Duty Boots';
		if (species.nfe) return 'Eviolite';
		if (ability === 'Poison Heal') return 'Toxic Orb';
		if ((ability === 'Guts' || moves.has('facade')) && !moves.has('sleeptalk')) {
			return (types.includes('Fire') || ability === 'Toxic Boost') ? 'Toxic Orb' : 'Flame Orb';
		}
		if (ability === 'Magic Guard' || (ability === 'Sheer Force' && counter.get('sheerforce'))) return 'Life Orb';
		if (ability === 'Anger Shell') return this.sample(['Rindo Berry', 'Passho Berry', 'Scope Lens', 'Sitrus Berry']);
		if (moves.has('dragondance') && isDoubles) return 'Clear Amulet';
		if (counter.get('skilllink') && ability !== 'Skill Link' && species.id !== 'breloom') return 'Loaded Dice';
		if (ability === 'Unburden') {
			return (moves.has('closecombat') || moves.has('leafstorm')) ? 'White Herb' : 'Sitrus Berry';
		}
		if (moves.has('shellsmash') && ability !== 'Weak Armor') return 'White Herb';
		if (moves.has('meteorbeam') || (moves.has('electroshot') && !teamDetails.rain)) return 'Power Herb';
		if (ability === 'Sniper') return 'Scope Lens';
		if (moves.has('acrobatics') && ability !== 'Protosynthesis') return '';
		if (moves.has('auroraveil') || moves.has('dustveil') ||
			(moves.has('lightscreen') && moves.has('reflect'))) return 'Light Clay';
		if (ability === 'Gluttony') return `${this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki'])} Berry`;
		if (
			moves.has('rest') && !moves.has('sleeptalk') &&
			ability !== 'Natural Cure' && ability !== 'Shed Skin'
		) {
			return 'Chesto Berry';
		}
		if (
			species.id !== 'yanmega' && ability !== 'Mountaineer' &&
			this.dex.getEffectiveness('Rock', species) >= 2 && (!types.includes('Flying') || !isDoubles)
		) return 'Heavy-Duty Boots';
	}

	/** Item generation specific to Random Doubles */
	getDoublesItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		const scarfReqs = (
			!counter.get('priority') && ability !== 'Speed Boost' && role !== 'Doubles Wallbreaker' &&
			species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
			this.randomChance(1, 2)
		);
		const offensiveRole = (
			['Doubles Fast Attacker', 'Doubles Wallbreaker', 'Doubles Setup Sweeper', 'Offensive Protect'].some(m => role === m)
		);

		if (species.id === 'ursalunabloodmoon' || (moves.has('doubleedge') && moves.has('fakeout'))) return 'Silk Scarf';
		if (
			moves.has('flipturn') && moves.has('protect') && (moves.has('aquajet') || (moves.has('jetpunch')))
		) return 'Mystic Water';
		if (counter.get('speedsetup') && role === 'Doubles Bulky Setup') return 'Weakness Policy';
		if (species.id === 'toxapex') return 'Binding Band';
		if (moves.has('blizzard') && ability !== 'Snow Warning' && !teamDetails.snow) return 'Blunder Policy';

		if (role === 'Choice Item user') {
			if (scarfReqs || (counter.get('Physical') < 4 && counter.get('Special') < 3 && !moves.has('memento'))) {
				return 'Choice Scarf';
			}
			return (counter.get('Physical') >= 3) ? 'Choice Band' : 'Choice Specs';
		}
		if (counter.get('Physical') >= 4 &&
			['fakeout', 'feint', 'firstimpression', 'rapidspin', 'suckerpunch'].every(m => !moves.has(m)) &&
			(moves.has('flipturn') || moves.has('uturn') || role === 'Doubles Wallbreaker')
		) {
			return (scarfReqs) ? 'Choice Scarf' : 'Choice Band';
		}
		if (
			((counter.get('Special') >= 4 && (moves.has('voltswitch') || role === 'Doubles Wallbreaker')) || (
				counter.get('Special') >= 3 && (moves.has('uturn') || moves.has('flipturn'))
			)) && !moves.has('electroweb')
		) {
			return (scarfReqs) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (
			(role === 'Bulky Protect' && counter.get('setup')) || moves.has('substitute') || moves.has('irondefense') ||
			species.id === 'eternatus' || species.id === 'regigigas'
		) return 'Leftovers';
		if (species.id === 'sylveon') return 'Pixie Plate';
		if (ability === 'Intimidate' && this.dex.getEffectiveness('Rock', species) >= 1) return 'Heavy-Duty Boots';
		if (
			(offensiveRole || (role === 'Tera Blast user' && (species.baseStats.spe >= 80 || moves.has('trickroom')))) &&
			(!moves.has('fakeout') || species.id === 'ambipom') && !moves.has('incinerate') &&
			(!moves.has('uturn') || types.includes('Bug') || ability === 'Libero') &&
			((!moves.has('icywind') && !moves.has('electroweb')) || species.id === 'ironbundle')
		) {
			return (
				(ability === 'Quark Drive' || ability === 'Protosynthesis') && !isLead && species.id !== 'ironvaliant' &&
				['dracometeor', 'firstimpression', 'uturn', 'voltswitch'].every(m => !moves.has(m))
			) ? 'Booster Energy' : 'Life Orb';
		}
		if (isLead && (species.id === 'glimmora' ||
			(['Doubles Fast Attacker', 'Doubles Wallbreaker', 'Offensive Protect'].includes(role) &&
				species.baseStats.hp + species.baseStats.def + species.baseStats.spd <= 230))
		) return 'Focus Sash';
		if (
			['Doubles Fast Attacker', 'Doubles Wallbreaker', 'Offensive Protect'].includes(role) &&
			moves.has('fakeout') || moves.has('incinerate')
		) {
			return (this.dex.getEffectiveness('Rock', species) >= 1) ? 'Heavy-Duty Boots' : 'Clear Amulet';
		}
		if (!counter.get('Status')) return 'Assault Vest';
		return 'Sitrus Berry';
	}

	getItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		if (types.includes('Normal') && moves.has('fakeout')) return 'Silk Scarf';
		if (
			species.id !== 'jirachi' && (counter.get('Physical') >= 4) &&
			['dragontail', 'fakeout', 'firstimpression', 'flamecharge', 'rapidspin'].every(m => !moves.has(m))
		) {
			const scarfReqs = (
				role !== 'Wallbreaker' &&
				(species.baseStats.atk >= 100 || ability === 'Huge Power' || ability === 'Pure Power') &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && !counter.get('priority') && !moves.has('aquastep')
			);
			return (scarfReqs && this.randomChance(1, 2)) ? 'Choice Scarf' : 'Choice Band';
		}
		if (
			(counter.get('Special') >= 4) ||
			(counter.get('Special') >= 3 && ['flipturn', 'uturn'].some(m => moves.has(m)))
		) {
			const scarfReqs = (
				role !== 'Wallbreaker' &&
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && ability !== 'Tinted Lens' && !moves.has('uturn') && !counter.get('priority')
			);
			return (scarfReqs && this.randomChance(1, 2)) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (counter.get('speedsetup') && role === 'Bulky Setup') return 'Weakness Policy';
		if (
			!counter.get('Status') &&
			!['Fast Attacker', 'Wallbreaker', 'Tera Blast user'].includes(role) &&
			species.id !== 'furumo') {
			return 'Assault Vest';
		}
		if (species.id === 'golem') return (counter.get('speedsetup')) ? 'Weakness Policy' : 'Custap Berry';
		if (moves.has('substitute')) return 'Leftovers';
		if (moves.has('stickyweb') && species.id !== 'araquanid' && isLead) return 'Focus Sash';
		if (this.dex.getEffectiveness('Rock', species) >= 1) return 'Heavy-Duty Boots';
		if (
			(moves.has('chillyreception') || (
				role === 'Fast Support' &&
				[...PIVOT_MOVES, 'defog', 'mortalspin', 'rapidspin'].some(m => moves.has(m)) &&
				!types.includes('Flying') && ability !== 'Levitate'
			))
		) return 'Heavy-Duty Boots';

		// Low Priority
		if (
			ability === 'Rough Skin' || (
				ability === 'Regenerator' && (role === 'Bulky Support' || role === 'Bulky Attacker') &&
				(species.baseStats.hp + species.baseStats.def) >= 180 && this.randomChance(1, 2)
			) || (
				ability !== 'Regenerator' && !counter.get('setup') && counter.get('recovery') &&
				this.dex.getEffectiveness('Fighting', species) < 1 &&
				(species.baseStats.hp + species.baseStats.def) > 200 && this.randomChance(1, 2)
			)
		) return 'Rocky Helmet';
		if (moves.has('outrage') && counter.get('setup')) return 'Lum Berry';
		if (moves.has('protect') && ability !== 'Speed Boost') return 'Leftovers';
		if (
			role === 'Fast Support' && isLead && !counter.get('recovery') && !counter.get('recoil') &&
			(counter.get('hazards') || counter.get('setup')) &&
			(species.baseStats.hp + species.baseStats.def + species.baseStats.spd) < 258
		) return 'Focus Sash';
		if (
			!counter.get('setup') && ability !== 'Levitate' && this.dex.getEffectiveness('Ground', species) >= 2
		) return 'Air Balloon';
		if (['Bulky Attacker', 'Bulky Support', 'Bulky Setup'].some(m => role === (m))) return 'Leftovers';
		if (species.id === 'pawmot' && moves.has('nuzzle')) return 'Leppa Berry';
		if (role === 'Fast Support' || role === 'Fast Bulky Setup') {
			return (counter.get('Physical') + counter.get('Special') >= 3 && !moves.has('nuzzle')) ? 'Life Orb' : 'Leftovers';
		}
		if (role === 'Tera Blast user' && DEFENSIVE_TERA_BLAST_USERS.includes(species.id)) return 'Leftovers';
		if (
			['flamecharge', 'rapidspin', 'trailblaze'].every(m => !moves.has(m)) &&
			['Fast Attacker', 'Setup Sweeper', 'Tera Blast user', 'Wallbreaker'].some(m => role === (m))
		) return 'Life Orb';
		return 'Leftovers';
	}

	getLevel(
		species: Species,
		isDoubles: boolean,
	): number {
		if (this.adjustLevel) return this.adjustLevel;
		// doubles levelling
		if (isDoubles && this.randomDoublesSets[species.id]["level"]) return this.randomDoublesSets[species.id]["level"]!;
		if (!isDoubles && this.randomSets[species.id]["level"]) return this.randomSets[species.id]["level"]!;
		// Default to tier-based levelling
		const tier = species.tier;
		const tierScale: Partial<Record<Species['tier'], number>> = {
			Uber: 76,
			OU: 80,
			UUBL: 81,
			UU: 82,
			RUBL: 83,
			RU: 84,
			NUBL: 85,
			NU: 86,
			PUBL: 87,
			PU: 88, "(PU)": 88, NFE: 88,
		};
		return tierScale[tier] || 80;
	}

	getForme(species: Species): string {
		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			return species.battleOnly;
		}
		if (species.cosmeticFormes) return this.sample([species.name].concat(species.cosmeticFormes));

		// Consolidate mostly-cosmetic formes, at least for the purposes of Random Battles
		if (['Dudunsparce', 'Magearna', 'Maushold', 'Polteageist', 'Sinistcha', 'Zarude'].includes(species.baseSpecies)) {
			return this.sample([species.name].concat(species.otherFormes!));
		}
		if (species.baseSpecies === 'Basculin') return 'Basculin' + this.sample(['', '-Blue-Striped']);
		if (species.baseSpecies === 'Pikachu') {
			return 'Pikachu' + this.sample(
				['', '-Original', '-Hoenn', '-Sinnoh', '-Unova', '-Kalos', '-Alola', '-Partner', '-World']
			);
		}
		return species.name;
	}

	randomSet(
		s: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false,
		isDoubles = false
	): RandomTeamsTypes.RandomSet {
		const species = this.dex.species.get(s);
		const forme = this.getForme(species);
		const sets = this[`random${isDoubles ? 'Doubles' : ''}Sets`][species.id]["sets"];
		const possibleSets: RandomTeamsTypes.RandomSetData[] = [];

		const ruleTable = this.dex.formats.getRuleTable(this.format);

		for (const set of sets) {
			// Prevent Fast Bulky Setup on lead Paradox Pokemon, since it generates Booster Energy.
			const abilities = set.abilities!;
			if (
				isLead && (abilities.includes('Protosynthesis') || abilities.includes('Quark Drive')) &&
				set.role === 'Fast Bulky Setup'
			) continue;
			// Prevent Tera Blast user if the team already has one, or if Terastallizion is prevented.
			if ((teamDetails.teraBlast || ruleTable.has('terastalclause')) && set.role === 'Tera Blast user') {
				continue;
			}
			possibleSets.push(set);
		}
		const set = this.sampleIfArray(possibleSets);
		const role = set.role;
		const movePool: string[] = [];
		for (const movename of set.movepool) {
			movePool.push(this.dex.moves.get(movename).id);
		}
		const teraTypes = set.teraTypes!;
		let teraType = this.sampleIfArray(teraTypes);

		let ability = '';
		let item = undefined;

		const evs = { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 };
		const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

		const types = species.types;
		const abilities = set.abilities!;

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType, role);
		const counter = this.queryMoves(moves, species, teraType, abilities);

		// Get ability
		ability = this.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role);

		// Get items
		// First, the priority items
		item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles, teraType, role);
		if (item === undefined) {
			if (isDoubles) {
				item = this.getDoublesItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
			} else {
				item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
			}
		}

		// Get level
		const level = this.getLevel(species, isDoubles);

		// Prepare optimal HP
		const srImmunity = ability === 'Magic Guard' || ability === 'Frost Cloak' || item === 'Heavy-Duty Boots';
		let srWeakness = srImmunity ? 0 : this.dex.getEffectiveness('Rock', species);
		// Crash damage move users want an odd HP to survive two misses
		if (['axekick', 'highjumpkick', 'jumpkick'].some(m => moves.has(m))) srWeakness = 2;
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if ((moves.has('substitute') && ['Sitrus Berry', 'Salac Berry'].includes(item))) {
				// Two Substitutes should activate Sitrus Berry
				if (hp % 4 === 0) break;
			} else if ((moves.has('bellydrum') || moves.has('filletaway')) && (item === 'Sitrus Berry' || ability === 'Gluttony')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else if (moves.has('substitute') && moves.has('endeavor')) {
				// Luvdisc should be able to Substitute down to very low HP
				if (hp % 4 > 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || ability === 'Regenerator' || ['Leftovers', 'Life Orb'].includes(item)) break;
				if (item !== 'Sitrus Berry' && hp % (4 / srWeakness) > 0) break;
				// Minimise number of Stealth Rock switch-ins to activate Sitrus Berry
				if (item === 'Sitrus Berry' && hp % (4 / srWeakness) === 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		const noAttackStatMoves = [...moves].every(m => {
			const move = this.dex.moves.get(m);
			if (move.damageCallback || move.damage) return true;
			if (move.id === 'shellsidearm') return false;
			// Magearna and doubles Dragonite, though these can work well as a general rule
			if (move.id === 'terablast' && (
				species.id === 'porygon2' || moves.has('shiftgear') || species.baseStats.atk > species.baseStats.spa)
			) return false;
			return move.category !== 'Physical' || move.id === 'bodypress' || move.id === 'foulplay';
		});
		// prevents Illumise (who can turn into Volbeat with Physical moves) from having 0 Atk EVs
		if (noAttackStatMoves && !moves.has('transform') && this.format.mod
			 !== 'partnersincrime' && species.id !== 'illumise') {
			evs.atk = 0;
			ivs.atk = 0;
		}

		if (moves.has('gyroball') || moves.has('trickroom') || moves.has('archaicglare')) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		// Enforce Tera Type after all set generation is done to prevent infinite generation
		if (this.forceTeraType) teraType = this.forceTeraType;

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);
		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.baseSpecies === 'Greninja' ? 'M' : species.gender,
			shiny: this.randomChance(1, 1024),
			level,
			moves: shuffledMoves,
			ability,
			evs,
			ivs,
			item,
			teraType,
			role,
		};
	}

	getPokemonPool(
		type: string,
		pokemonToExclude: RandomTeamsTypes.RandomSet[] = [],
		isMonotype = false,
		pokemonList: string[]
	): [{ [k: string]: string[] }, string[]] {
		const exclude = pokemonToExclude.map(p => toID(p.species));
		const pokemonPool: { [k: string]: string[] } = {};
		const baseSpeciesPool = [];
		for (const pokemon of pokemonList) {
			let species = this.dex.species.get(pokemon);
			if (exclude.includes(species.id)) continue;
			if (isMonotype) {
				if (!species.types.includes(type)) continue;
				if (typeof species.battleOnly === 'string') {
					species = this.dex.species.get(species.battleOnly);
					if (!species.types.includes(type)) continue;
				}
			}

			if (species.baseSpecies in pokemonPool) {
				pokemonPool[species.baseSpecies].push(pokemon);
			} else {
				pokemonPool[species.baseSpecies] = [pokemon];
			}
		}
		// Include base species 1x if 1-3 formes, 2x if 4-6 formes, 3x if 7+ formes
		for (const baseSpecies of Object.keys(pokemonPool)) {
			// Squawkabilly has 4 formes, but only 2 functionally different formes, so only include it 1x
			const weight = (baseSpecies === 'Squawkabilly') ? 1 : Math.min(Math.ceil(pokemonPool[baseSpecies].length / 3), 3);
			for (let i = 0; i < weight; i++) baseSpeciesPool.push(baseSpecies);
		}
		return [pokemonPool, baseSpeciesPool];
	}

	randomSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./random-sets.json');
	// randomDoublesSets: {[species: string]: RandomTeamsTypes.RandomSpeciesData} = require('./random-doubles-sets.json');

	randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.getSeed();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const isDoubles = this.format.gameType !== 'singles';
		const typePool = this.dex.types.names().filter(name => name !== "Stellar");
		const type = this.forceMonotype || this.sample(typePool);

		// PotD stuff
		// const usePotD = global.Config && Config.potd && ruleTable.has('potd');
		// const potd = usePotD ? this.dex.species.get(Config.potd) : null;

		const baseFormes: { [k: string]: number } = {};
		let hasMega = false;

		const typeCount: { [k: string]: number } = {};
		const typeComboCount: { [k: string]: number } = {};
		const typeWeaknesses: { [k: string]: number } = {};
		const typeDoubleWeaknesses: { [k: string]: number } = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};
		let numMaxLevelPokemon = 0;

		const pokemonList = isDoubles ? Object.keys(this.randomDoublesSets) : Object.keys(this.randomSets);
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);

		let leadsRemaining = this.format.gameType === 'doubles' ? 2 : 1;
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);

			const currentSpeciesPool: Species[] = [];
			// Check if the base species has a mega forme available
			// let canMega = false;
			for (const poke of pokemonPool[baseSpecies]) {
				// const species = this.dex.species.get(poke);
				// if (!hasMega && species.isMega) canMega = true;
			}
			for (const poke of pokemonPool[baseSpecies]) {
				const species = this.dex.species.get(poke);
				// Prevent multiple megas
				if (hasMega && species.isMega) continue;
				// Prevent base forme, if a mega is available
				// Added Abomasnow exception
				// if (canMega && !species.isMega && species.id !== 'abomasnow') continue;
				currentSpeciesPool.push(species);
			}
			// change const to let when enforcing certain mons for testing
			const species = this.sample(currentSpeciesPool);

			// let species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));

			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Limit one Mega per team
			if (hasMega && species.isMega) continue;

			// Treat Ogerpon formes and Terapagos like the Tera Blast user role; reject if team has one already
			if ((species.baseSpecies === 'Ogerpon' || species.baseSpecies === 'Terapagos') && teamDetails.teraBlast) continue;

			// Illusion shouldn't be on the last slot
			if (species.baseSpecies === 'Zoroark' && pokemon.length >= (this.maxTeamSize - 1)) continue;

			const types = species.types;
			const typeCombo = types.slice().sort().join();
			const weakToFreezeDry = (
				this.dex.getEffectiveness('Ice', species) > 0 ||
				(this.dex.getEffectiveness('Ice', species) > -2 && types.includes('Water'))
			);
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			// TEMPORARILY ADJUSTING BALANCE OF THIS BLOCK -- TOO FEW POKEMON TO GENERATE TEAMS
			// update: reverting these changes, but leaving just in case
			if (!isMonotype && !this.forceMonotype) {
				let skip = false;

				// Limit two of any type
				// ADJUSTING TO 6 -- ADJUST BACK AFTER MORE POKEMON HAVE BEEN ADDED
				for (const typeName of types) {
					if (typeCount[typeName] >= 2 /* 6 */ * limitFactor) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit three weak to any type, and one double weak to any type
				// ADJUSTING TO 6 -- ADJUST BACK AFTER MORE POKEMON HAVE BEEN ADDED
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
						if (typeWeaknesses[typeName] >= 3 /* 6 */ * limitFactor) {
							skip = true;
							break;
						}
					}
					if (this.dex.getEffectiveness(typeName, species) > 1) {
						if (!typeDoubleWeaknesses[typeName]) typeDoubleWeaknesses[typeName] = 0;
						if (typeDoubleWeaknesses[typeName] >= 1 /* 6 */ * Number(limitFactor)) {
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;

				// Count Dry Skin/Fluffy as Fire weaknesses
				// ADJUSTING TO 6 -- ADJUST BACK AFTER MORE POKEMON HAVE BEEN ADDED
				if (
					this.dex.getEffectiveness('Fire', species) === 0 &&
					Object.values(species.abilities).filter(a => ['Dry Skin', 'Fluffy'].includes(a)).length
				) {
					if (!typeWeaknesses['Fire']) typeWeaknesses['Fire'] = 0;
					if (typeWeaknesses['Fire'] >= 3 /* 6 */ * limitFactor) continue;
				}

				// Limit four weak to Freeze-Dry
				// ADJUSTING TO 6 -- ADJUST BACK AFTER MORE POKEMON HAVE BEEN ADDED
				if (weakToFreezeDry) {
					if (!typeWeaknesses['Freeze-Dry']) typeWeaknesses['Freeze-Dry'] = 0;
					if (typeWeaknesses['Freeze-Dry'] >= 4 /* 6 */ * limitFactor) continue;
				}

				// Limit one level 100 Pokemon
				if (!this.adjustLevel && (this.getLevel(species, isDoubles) === 100) && numMaxLevelPokemon >= limitFactor) {
					continue;
				}
			}

			// Limit three of any type combination in Monotype
			if (!this.forceMonotype && isMonotype && (typeComboCount[typeCombo] >= 3 * limitFactor)) continue;

			// The Pokemon of the Day
			// if (potd?.exists && (pokemon.length === 1 || this.maxTeamSize === 1)) species = potd;

			// Code to enforce a mon on teams for testing
			// if (pokemon.length === 1 || this.maxTeamSize === 1) species = 'Salamence-Mega';

			let set: RandomTeamsTypes.RandomSet;

			if (leadsRemaining) {
				if (
					isDoubles && DOUBLES_NO_LEAD_POKEMON.includes(species.baseSpecies) ||
					!isDoubles && NO_LEAD_POKEMON.includes(species.baseSpecies)
				) {
					if (pokemon.length + leadsRemaining === this.maxTeamSize) continue;
					set = this.randomSet(species, teamDetails, false, isDoubles);
					pokemon.push(set);
				} else {
					set = this.randomSet(species, teamDetails, true, isDoubles);
					pokemon.unshift(set);
					leadsRemaining--;
				}
			} else {
				set = this.randomSet(species, teamDetails, false, isDoubles);
				pokemon.push(set);
			}

			const item = this.dex.items.get(set.item);

			// Don't bother tracking details for the last Pokemon
			if (pokemon.length === this.maxTeamSize) break;

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment type counters
			for (const typeName of types) {
				if (typeName in typeCount) {
					typeCount[typeName]++;
				} else {
					typeCount[typeName] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Increment weakness counter
			for (const typeName of this.dex.types.names()) {
				// it's weak to the type
				if (this.dex.getEffectiveness(typeName, species) > 0) {
					typeWeaknesses[typeName]++;
				}
				if (this.dex.getEffectiveness(typeName, species) > 1) {
					typeDoubleWeaknesses[typeName]++;
				}
			}
			// Count Dry Skin/Fluffy as Fire weaknesses
			if (['Dry Skin', 'Fluffy'].includes(set.ability) && this.dex.getEffectiveness('Fire', species) === 0) {
				typeWeaknesses['Fire']++;
			}
			if (weakToFreezeDry) typeWeaknesses['Freeze-Dry']++;

			// Increment level 100 counter
			if (set.level === 100) numMaxLevelPokemon++;

			// Track what the team has
			if (item.megaStone) hasMega = true;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails.rain = 1;
			if (set.ability === 'Drought' || set.ability === 'Orichalcum Pulse' || set.moves.includes('sunnyday')) {
				teamDetails.sun = 1;
			}
			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('snowscape') || set.moves.includes('chillyreception')) {
				teamDetails.snow = 1;
			}
			if (set.moves.includes('healbell')) teamDetails.statusCure = 1;
			if (set.moves.includes('spikes') || set.moves.includes('ceaselessedge')) {
				teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			}
			if (set.moves.includes('toxicspikes') || set.ability === 'Toxic Debris') teamDetails.toxicSpikes = 1;
			if (set.moves.includes('stealthrock') || set.moves.includes('stoneaxe')) teamDetails.stealthRock = 1;
			if (set.moves.includes('stickyweb')) teamDetails.stickyWeb = 1;
			if (set.moves.includes('defog')) teamDetails.defog = 1;
			if (set.moves.includes('rapidspin') || set.moves.includes('mortalspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('auroraveil') || (set.moves.includes('reflect') && set.moves.includes('lightscreen'))) {
				teamDetails.screens = 1;
			}
			if (set.role === 'Tera Blast user' || species.baseSpecies === "Ogerpon" || species.baseSpecies === "Terapagos") {
				teamDetails.teraBlast = 1;
			}
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) { // large teams sometimes cannot be built
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	}

	randomCCTeam(): RandomTeamsTypes.RandomSet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const dex = this.dex;
		const team = [];

		const natures = this.dex.natures.all();
		const items = this.dex.items.all();

		const randomN = this.randomNPokemon(this.maxTeamSize, this.forceMonotype, undefined, undefined, true);

		for (let forme of randomN) {
			let species = dex.species.get(forme);
			if (species.isNonstandard) species = dex.species.get(species.baseSpecies);

			// Random legal item
			let item = '';
			let isIllegalItem;
			let isBadItem;
			if (this.gen >= 2) {
				do {
					item = this.sample(items).name;
					isIllegalItem = this.dex.items.get(item).gen > this.gen || this.dex.items.get(item).isNonstandard;
					isBadItem = item.startsWith("TR") || this.dex.items.get(item).isPokeball;
				} while (isIllegalItem || (isBadItem && this.randomChance(19, 20)));
			}

			// Make sure forme is legal
			if (species.battleOnly) {
				if (typeof species.battleOnly === 'string') {
					species = dex.species.get(species.battleOnly);
				} else {
					species = dex.species.get(this.sample(species.battleOnly));
				}
				forme = species.name;
			} else if (species.requiredItems && !species.requiredItems.some(req => toID(req) === item)) {
				if (!species.changesFrom) throw new Error(`${species.name} needs a changesFrom value`);
				species = dex.species.get(species.changesFrom);
				forme = species.name;
			}

			// Make sure that a base forme does not hold any forme-modifier items.
			let itemData = this.dex.items.get(item);
			if (itemData.forcedForme && forme === this.dex.species.get(itemData.forcedForme).baseSpecies) {
				do {
					itemData = this.sample(items);
					item = itemData.name;
				} while (
					itemData.gen > this.gen ||
					itemData.isNonstandard ||
					(itemData.forcedForme && forme === this.dex.species.get(itemData.forcedForme).baseSpecies)
				);
			}

			// Random legal ability
			const abilities = Object.values(species.abilities).filter(a => this.dex.abilities.get(a).gen <= this.gen);
			const ability: string = this.gen <= 2 ? 'No Ability' : this.sample(abilities);

			// Four random unique moves from the movepool
			let pool = ['struggle'];
			if (forme === 'Smeargle') {
				pool = this.dex.moves.all()
					.filter(move => !(move.isNonstandard || move.isZ || move.isMax || move.realMove))
					.map(m => m.id);
			} else {
				pool = [...this.dex.species.getMovePool(species.id)];
			}

			const moves = this.multipleSamplesNoReplace(pool, this.maxMoveCount);

			// Random EVs
			const evs: StatsTable = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			const s: StatID[] = ["hp", "atk", "def", "spa", "spd", "spe"];
			let evpool = 510;
			do {
				const x = this.sample(s);
				const y = this.random(Math.min(256 - evs[x], evpool + 1));
				evs[x] += y;
				evpool -= y;
			} while (evpool > 0);

			// Random IVs
			const ivs = {
				hp: this.random(32),
				atk: this.random(32),
				def: this.random(32),
				spa: this.random(32),
				spd: this.random(32),
				spe: this.random(32),
			};

			// Random nature
			const nature = this.sample(natures).name;

			// Level balance--calculate directly from stats rather than using some silly lookup table
			const mbstmin = 1307; // Sunkern has the lowest modified base stat total, and that total is 807

			let stats = species.baseStats;
			// If Wishiwashi, use the school-forme's much higher stats
			if (species.baseSpecies === 'Wishiwashi') stats = Dex.species.get('wishiwashischool').baseStats;
			// If Terapagos, use Terastal-forme's stats
			if (species.baseSpecies === 'Terapagos') stats = Dex.species.get('terapagosterastal').baseStats;

			// Modified base stat total assumes 31 IVs, 85 EVs in every stat
			let mbst = (stats["hp"] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats["atk"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["def"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spa"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spd"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spe"] * 2 + 31 + 21 + 100) + 5;

			let level;
			if (this.adjustLevel) {
				level = this.adjustLevel;
			} else {
				level = Math.floor(100 * mbstmin / mbst); // Initial level guess will underestimate

				while (level < 100) {
					mbst = Math.floor((stats["hp"] * 2 + 31 + 21 + 100) * level / 100 + 10);
					// Since damage is roughly proportional to level
					mbst += Math.floor(((stats["atk"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats["def"] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor(((stats["spa"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats["spd"] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor((stats["spe"] * 2 + 31 + 21 + 100) * level / 100 + 5);

					if (mbst >= mbstmin) break;
					level++;
				}
			}

			// Random happiness
			const happiness = this.random(256);

			// Random shininess
			const shiny = this.randomChance(1, 1024);

			const set: RandomTeamsTypes.RandomSet = {
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender,
				item,
				ability,
				moves,
				evs,
				ivs,
				nature,
				level,
				happiness,
				shiny,
			};
			if (this.gen === 9) {
				// Tera type
				if (this.forceTeraType) {
					set.teraType = this.forceTeraType;
				} else {
					set.teraType = this.sample(this.dex.types.all()).name;
				}
			}
			team.push(set);
		}

		return team;
	}

	randomNPokemon(n: number, requiredType?: string, minSourceGen?: number, ruleTable?: RuleTable, requireMoves = false) {
		// Picks `n` random pokemon--no repeats, even among formes
		// Also need to either normalize for formes or select formes at random
		// Unreleased are okay but no CAP
		if (requiredType && !this.dex.types.get(requiredType).exists) {
			throw new Error(`"${requiredType}" is not a valid type.`);
		}

		const isNotCustom = !ruleTable;

		const pool: number[] = [];
		let speciesPool: Species[] = [];
		if (isNotCustom) {
			speciesPool = [...this.dex.species.all()];
			for (const species of speciesPool) {
				if (species.isNonstandard && species.isNonstandard !== 'Unobtainable') continue;
				if (requireMoves) {
					const hasMovesInCurrentGen = this.dex.species.getMovePool(species.id).size;
					if (!hasMovesInCurrentGen) continue;
				}
				if (requiredType && !species.types.includes(requiredType)) continue;
				if (minSourceGen && species.gen < minSourceGen) continue;
				const num = species.num;
				if (num <= 0 || pool.includes(num)) continue;
				pool.push(num);
			}
		} else {
			const EXISTENCE_TAG = ['past', 'future', 'lgpe', 'unobtainable', 'cap', 'custom', 'nonexistent'];
			const nonexistentBanReason = ruleTable.check('nonexistent');
			// Assume tierSpecies does not differ from species here (mega formes can be used without their stone, etc)
			for (const species of this.dex.species.all()) {
				if (requiredType && !species.types.includes(requiredType)) continue;

				let banReason = ruleTable.check('pokemon:' + species.id);
				if (banReason) continue;
				if (banReason !== '') {
					if (species.isMega && ruleTable.check('pokemontag:mega')) continue;

					banReason = ruleTable.check('basepokemon:' + toID(species.baseSpecies));
					if (banReason) continue;
					if (banReason !== '' || this.dex.species.get(species.baseSpecies).isNonstandard !== species.isNonstandard) {
						const nonexistentCheck = Tags.nonexistent.genericFilter!(species) && nonexistentBanReason;
						let tagWhitelisted = false;
						let tagBlacklisted = false;
						for (const ruleid of ruleTable.tagRules) {
							if (ruleid.startsWith('*')) continue;
							const tagid = ruleid.slice(12) as ID;
							const tag = Tags[tagid];
							if ((tag.speciesFilter || tag.genericFilter)!(species)) {
								const existenceTag = EXISTENCE_TAG.includes(tagid);
								if (ruleid.startsWith('+')) {
									if (!existenceTag && nonexistentCheck) continue;
									tagWhitelisted = true;
									break;
								}
								tagBlacklisted = true;
								break;
							}
						}
						if (tagBlacklisted) continue;
						if (!tagWhitelisted) {
							if (ruleTable.check('pokemontag:allpokemon')) continue;
						}
					}
				}
				speciesPool.push(species);
				const num = species.num;
				if (pool.includes(num)) continue;
				pool.push(num);
			}
		}

		const hasDexNumber: { [k: string]: number } = {};
		for (let i = 0; i < n; i++) {
			const num = this.sampleNoReplace(pool);
			hasDexNumber[num] = i;
		}

		const formes: string[][] = [];
		for (const species of speciesPool) {
			if (!(species.num in hasDexNumber)) continue;
			if (isNotCustom && (species.gen > this.gen ||
				(species.isNonstandard && species.isNonstandard !== 'Unobtainable'))) continue;
			if (requiredType && !species.types.includes(requiredType)) continue;
			if (!formes[hasDexNumber[species.num]]) formes[hasDexNumber[species.num]] = [];
			formes[hasDexNumber[species.num]].push(species.name);
		}

		if (formes.length < n) {
			throw new Error(`Legal Pokemon forme count insufficient to support Max Team Size: (${formes.length} / ${n}).`);
		}

		const nPokemon = [];
		for (let i = 0; i < n; i++) {
			if (!formes[i].length) {
				throw new Error(`Invalid pokemon gen ${this.gen}: ${JSON.stringify(formes)} numbers ${JSON.stringify(hasDexNumber)}`);
			}
			nPokemon.push(this.sample(formes[i]));
		}
		return nPokemon;
	}

	randomHCTeam(): PokemonSet[] {
		const hasCustomBans = this.hasDirectCustomBanlistChanges();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const hasNonexistentBan = hasCustomBans && ruleTable.check('nonexistent');
		const hasNonexistentWhitelist = hasCustomBans && (hasNonexistentBan === '');

		if (hasCustomBans) {
			this.enforceNoDirectComplexBans();
		}

		// Item Pool
		const doItemsExist = this.gen > 1;
		let itemPool: Item[] = [];
		if (doItemsExist) {
			if (!hasCustomBans) {
				itemPool = [...this.dex.items.all()].filter(item => (item.gen <= this.gen && !item.isNonstandard));
			} else {
				const hasAllItemsBan = ruleTable.check('pokemontag:allitems');
				for (const item of this.dex.items.all()) {
					let banReason = ruleTable.check('item:' + item.id);
					if (banReason) continue;
					if (banReason !== '' && item.id) {
						if (hasAllItemsBan) continue;
						if (item.isNonstandard) {
							banReason = ruleTable.check('pokemontag:' + toID(item.isNonstandard));
							if (banReason) continue;
							if (banReason !== '' && item.isNonstandard !== 'Unobtainable') {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					itemPool.push(item);
				}
				if (ruleTable.check('item:noitem')) {
					this.enforceCustomPoolSizeNoComplexBans('item', itemPool, this.maxTeamSize, 'Max Team Size');
				}
			}
		}

		// Ability Pool
		const doAbilitiesExist = (this.gen > 2) && (this.dex.currentMod !== 'gen7letsgo');
		let abilityPool: Ability[] = [];
		if (doAbilitiesExist) {
			if (!hasCustomBans) {
				abilityPool = [...this.dex.abilities.all()].filter(ability => (ability.gen <= this.gen && !ability.isNonstandard));
			} else {
				const hasAllAbilitiesBan = ruleTable.check('pokemontag:allabilities');
				for (const ability of this.dex.abilities.all()) {
					let banReason = ruleTable.check('ability:' + ability.id);
					if (banReason) continue;
					if (banReason !== '') {
						if (hasAllAbilitiesBan) continue;
						if (ability.isNonstandard) {
							banReason = ruleTable.check('pokemontag:' + toID(ability.isNonstandard));
							if (banReason) continue;
							if (banReason !== '') {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					abilityPool.push(ability);
				}
				if (ruleTable.check('ability:noability')) {
					this.enforceCustomPoolSizeNoComplexBans('ability', abilityPool, this.maxTeamSize, 'Max Team Size');
				}
			}
		}

		// Move Pool
		const setMoveCount = ruleTable.maxMoveCount;
		let movePool: Move[] = [];
		if (!hasCustomBans) {
			movePool = [...this.dex.moves.all()].filter(move =>
				(move.gen <= this.gen && !move.isNonstandard));
		} else {
			const hasAllMovesBan = ruleTable.check('pokemontag:allmoves');
			for (const move of this.dex.moves.all()) {
				let banReason = ruleTable.check('move:' + move.id);
				if (banReason) continue;
				if (banReason !== '') {
					if (hasAllMovesBan) continue;
					if (move.isNonstandard) {
						banReason = ruleTable.check('pokemontag:' + toID(move.isNonstandard));
						if (banReason) continue;
						if (banReason !== '' && move.isNonstandard !== 'Unobtainable') {
							if (hasNonexistentBan) continue;
							if (!hasNonexistentWhitelist) continue;
						}
					}
				}
				movePool.push(move);
			}
			this.enforceCustomPoolSizeNoComplexBans('move', movePool, this.maxTeamSize * setMoveCount, 'Max Team Size * Max Move Count');
		}

		// Nature Pool
		const doNaturesExist = this.gen > 2;
		let naturePool: Nature[] = [];
		if (doNaturesExist) {
			if (!hasCustomBans) {
				naturePool = [...this.dex.natures.all()];
			} else {
				const hasAllNaturesBan = ruleTable.check('pokemontag:allnatures');
				for (const nature of this.dex.natures.all()) {
					let banReason = ruleTable.check('nature:' + nature.id);
					if (banReason) continue;
					if (banReason !== '' && nature.id) {
						if (hasAllNaturesBan) continue;
						if (nature.isNonstandard) {
							banReason = ruleTable.check('pokemontag:' + toID(nature.isNonstandard));
							if (banReason) continue;
							if (banReason !== '' && nature.isNonstandard !== 'Unobtainable') {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					naturePool.push(nature);
				}
				// There is no 'nature:nonature' rule so do not constrain pool size
			}
		}

		const randomN = this.randomNPokemon(this.maxTeamSize, this.forceMonotype, undefined,
			hasCustomBans ? ruleTable : undefined);

		const team = [];
		for (const forme of randomN) {
			// Choose forme
			const species = this.dex.species.get(forme);

			// Random unique item
			let item = '';
			let itemData;
			let isBadItem;
			if (doItemsExist) {
				// We discard TRs and Balls with 95% probability because of their otherwise overwhelming presence
				do {
					itemData = this.sampleNoReplace(itemPool);
					item = itemData?.name;
					isBadItem = item.startsWith("TR") || itemData.isPokeball;
				} while (isBadItem && this.randomChance(19, 20) && itemPool.length > this.maxTeamSize);
			}

			// Random unique ability
			let ability = 'No Ability';
			let abilityData;
			if (doAbilitiesExist) {
				abilityData = this.sampleNoReplace(abilityPool);
				ability = abilityData?.name;
			}

			// Random unique moves
			const m = [];
			do {
				const move = this.sampleNoReplace(movePool);
				m.push(move.id);
			} while (m.length < setMoveCount);

			// Random EVs
			const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			if (this.gen === 6) {
				let evpool = 510;
				do {
					const x = this.sample(Dex.stats.ids());
					const y = this.random(Math.min(256 - evs[x], evpool + 1));
					evs[x] += y;
					evpool -= y;
				} while (evpool > 0);
			} else {
				for (const x of Dex.stats.ids()) {
					evs[x] = this.random(256);
				}
			}

			// Random IVs
			const ivs: StatsTable = {
				hp: this.random(32),
				atk: this.random(32),
				def: this.random(32),
				spa: this.random(32),
				spd: this.random(32),
				spe: this.random(32),
			};

			// Random nature
			let nature = '';
			if (doNaturesExist && (naturePool.length > 0)) {
				nature = this.sample(naturePool).name;
			}

			// Level balance
			const mbstmin = 1307;
			const stats = species.baseStats;
			let mbst = (stats['hp'] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats['atk'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['def'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spa'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spd'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spe'] * 2 + 31 + 21 + 100) + 5;

			let level;
			if (this.adjustLevel) {
				level = this.adjustLevel;
			} else {
				level = Math.floor(100 * mbstmin / mbst);
				while (level < 100) {
					mbst = Math.floor((stats['hp'] * 2 + 31 + 21 + 100) * level / 100 + 10);
					mbst += Math.floor(((stats['atk'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats['def'] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor(((stats['spa'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats['spd'] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor((stats['spe'] * 2 + 31 + 21 + 100) * level / 100 + 5);
					if (mbst >= mbstmin) break;
					level++;
				}
			}

			// Random happiness
			const happiness = this.random(256);

			// Random shininess
			const shiny = this.randomChance(1, 1024);

			const set: PokemonSet = {
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender,
				item,
				ability,
				moves: m,
				evs,
				ivs,
				nature,
				level,
				happiness,
				shiny,
			};
			if (this.gen === 9) {
				// Random Tera type
				if (this.forceTeraType) {
					set.teraType = this.forceTeraType;
				} else {
					set.teraType = this.sample(this.dex.types.all()).name;
				}
			}
			team.push(set);
		}

		return team;
	}

	// randomBSSFactorySets: AnyObject = require("./bss-factory-sets.json");

	randomBSSFactorySet(
		species: Species, teamData: RandomTeamsTypes.FactoryTeamDetails
	): RandomTeamsTypes.RandomFactorySet | null {
		const id = toID(species.name);
		const setList = this.randomBSSFactorySets[id].sets;

		const movesMax: { [k: string]: number } = {
			batonpass: 1,
			stealthrock: 1,
			toxicspikes: 1,
			trickroom: 1,
			auroraveil: 1,
		};
		const weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];
		const terrainAbilities: { [k: string]: string } = {
			electricsurge: "electric",
			psychicsurge: "psychic",
			grassysurge: "grassy",
			seedsower: "grassy",
			mistysurge: "misty",
		};
		const terrainItemsRequire: { [k: string]: string } = {
			electricseed: "electric",
			psychicseed: "psychic",
			grassyseed: "grassy",
			mistyseed: "misty",
		};

		const maxWantsTera = 2;

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		const effectivePool: {
			set: BSSFactorySet, moveVariants?: number[], itemVariants?: number, abilityVariants?: number,
		}[] = [];

		for (const curSet of setList) {
			let reject = false;

			// limit to 2 dedicated tera users per team
			if (curSet.wantsTera && teamData.wantsTeraCount && teamData.wantsTeraCount >= maxWantsTera) {
				continue;
			}

			// reject 2+ weather setters
			if (teamData.weather && weatherAbilities.includes(curSet.ability)) {
				continue;
			}

			if (terrainAbilities[curSet.ability]) {
				if (!teamData.terrain) teamData.terrain = [];
				teamData.terrain.push(terrainAbilities[curSet.ability]);
			}

			for (const item of curSet.item) {
				if (terrainItemsRequire[item] && !teamData.terrain?.includes(terrainItemsRequire[item])) {
					reject = true; // reject any sets with a seed item possible and no terrain setter to activate it
					break;
				}
			}

			const curSetMoveVariants = [];
			for (const move of curSet.moves) {
				const variantIndex = this.random(move.length);
				const moveId = toID(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				curSetMoveVariants.push(variantIndex);
			}
			if (reject) continue;
			const set = { set: curSet, moveVariants: curSetMoveVariants };
			effectivePool.push(set);
		}

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const curSet of setList) {
				effectivePool.push({ set: curSet });
			}
		}

		// Sets have individual weight, choose one with weighted random selection

		let setData = this.sample(effectivePool); // Init with unweighted random set as fallback

		const total = effectivePool.reduce((a, b) => a + b.set.weight, 0);
		const setRand = this.random(total);

		let cur = 0;
		for (const set of effectivePool) {
			cur += set.set.weight;
			if (cur > setRand) {
				setData = set; // Bingo!
				break;
			}
		}

		const moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}

		return {
			name: setData.set.species || species.baseSpecies,
			species: setData.set.species,
			teraType: (this.sampleIfArray(setData.set.teraType)),
			gender:	setData.set.gender || species.gender || (this.randomChance(1, 2) ? "M" : "F"),
			item: this.sampleIfArray(setData.set.item) || "",
			ability: this.sampleIfArray(setData.set.ability),
			shiny: this.randomChance(1, 1024),
			level: 50,
			happiness: 255,
			evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs },
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs },
			nature: setData.set.nature || "Serious",
			moves,
			wantsTera: setData.set.wantsTera,
		};
	}

	randomBSSFactoryTeam(side: PlayerOptions, depth = 0): RandomTeamsTypes.RandomFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const forceResult = depth >= 4;

		const pokemon = [];

		const pokemonPool = Object.keys(this.randomBSSFactorySets);

		const teamData: TeamData = {
			typeCount: {},
			typeComboCount: {},
			baseFormes: {},
			has: {},
			wantsTeraCount: 0,
			forceResult,
			weaknesses: {},
			resistances: {},
		};
		const weatherAbilitiesSet: { [k: string]: string } = {
			drizzle: "raindance",
			drought: "sunnyday",
			snowwarning: "hail",
			sandstream: "sandstorm",
		};
		const resistanceAbilities: { [k: string]: string[] } = {
			waterabsorb: ["Water"],
			flashfire: ["Fire"],
			lightningrod: ["Electric"],
			voltabsorb: ["Electric"],
			thickfat: ["Ice", "Fire"],
			levitate: ["Ground"],
		};
		const limitFactor = Math.ceil(this.maxTeamSize / 6);
		/**
		 * Weighted random shuffle
		 * Uses the fact that for two uniform variables x1 and x2, x1^(1/w1) is larger than x2^(1/w2)
		 * with probability equal to w1/(w1+w2), which is what we want. See e.g. here https://arxiv.org/pdf/1012.0256.pdf,
		 * original paper is behind a paywall.
		 */
		const shuffledSpecies = [];
		for (const speciesName of pokemonPool) {
			const sortObject = {
				speciesName,
				score: this.prng.next() ** (1 / this.randomBSSFactorySets[speciesName].weight),
			};
			shuffledSpecies.push(sortObject);
		}
		shuffledSpecies.sort((a, b) => a.score - b.score);

		while (shuffledSpecies.length && pokemon.length < this.maxTeamSize) {
			// repeated popping from weighted shuffle is equivalent to repeated weighted sampling without replacement
			const species = this.dex.species.get(shuffledSpecies.pop()!.speciesName);
			if (!species.exists) continue;

			if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[species.baseSpecies]) continue;

			// Limit 2 of any type (most of the time)
			const types = species.types;
			let skip = false;
			if (!this.forceMonotype) {
				for (const type of types) {
					if (teamData.typeCount[type] >= 2 * limitFactor && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
			}
			if (skip) continue;

			const set = this.randomBSSFactorySet(species, teamData);
			if (!set) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === "Drought" || set.ability === "Drizzle") {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (!this.forceMonotype && teamData.typeComboCount[typeCombo] >= limitFactor) continue;

			const itemData = this.dex.items.get(set.item);
			if (teamData.has[itemData.id]) continue; // Item Clause

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			if (typeCombo in teamData.typeComboCount) {
				teamData.typeComboCount[typeCombo]++;
			} else {
				teamData.typeComboCount[typeCombo] = 1;
			}

			teamData.baseFormes[species.baseSpecies] = 1;

			teamData.has[itemData.id] = 1;

			if (set.wantsTera) {
				if (!teamData.wantsTeraCount) teamData.wantsTeraCount = 0;
				teamData.wantsTeraCount++;
			}

			const abilityState = this.dex.abilities.get(set.ability);
			if (abilityState.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityState.id];
			}

			for (const move of set.moves) {
				const moveId = toID(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
			}

			for (const typeName of this.dex.types.names()) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityState.id]?.includes(typeName) ||	!this.dex.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				const typeMod = this.dex.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (!teamData.forceResult && pokemon.length < this.maxTeamSize) return this.randomBSSFactoryTeam(side, ++depth);

		// Quality control we cannot afford for monotype
		if (!teamData.forceResult && !this.forceMonotype) {
			for (const type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= 3 * limitFactor) return this.randomBSSFactoryTeam(side, ++depth);
			}
		}

		return pokemon;
	}
}

export default RandomTeams;
