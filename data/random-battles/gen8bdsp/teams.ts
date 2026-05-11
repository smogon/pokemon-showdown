// BDSP team generation logic still uses the old system based on move rejections

import { Dex, toID } from '../../../sim/dex';
import { Utils } from '../../../lib';
import { PRNG, type PRNGSeed } from '../../../sim/prng';
import { type RuleTable } from '../../../sim/dex-formats';

export interface TeamData {
	typeCount: { [k: string]: number };
	typeComboCount: { [k: string]: number };
	baseFormes: { [k: string]: number };
	megaCount?: number;
	zCount?: number;
	has: { [k: string]: number };
	forceResult: boolean;
	weaknesses: { [k: string]: number };
	resistances: { [k: string]: number };
	weather?: string;
	eeveeLimCount?: number;
	gigantamax?: boolean;
}
export interface OldRandomBattleSpecies {
	level?: number;
	moves?: ID[];
}
export class MoveCounter extends Utils.Multiset<string> {
	damagingMoves: Set<Move>;
	setupType: string;

	constructor() {
		super();
		this.damagingMoves = new Set();
		this.setupType = '';
	}
}

type MoveEnforcementChecker = (
	movePool: string[], moves: Set<string>, abilities: string[], types: Set<string>,
	counter: MoveCounter, species: Species, teamDetails: RandomTeamsTypes.TeamDetails
) => boolean;

// Moves that restore HP:
const RECOVERY_MOVES = [
	'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'strengthsap', 'synthesis',
];
// Moves that drop stats:
const CONTRARY_MOVES = [
	'closecombat', 'leafstorm', 'overheat', 'superpower', 'vcreate',
];
// Moves that boost Attack:
const PHYSICAL_SETUP = [
	'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'honeclaws', 'howl', 'meditate', 'poweruppunch', 'screech', 'swordsdance',
];
// Moves which boost Special Attack:
const SPECIAL_SETUP = [
	'calmmind', 'chargebeam', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow',
];
// Moves that boost Attack AND Special Attack:
const MIXED_SETUP = [
	'clangoroussoul', 'growth', 'happyhour', 'holdhands', 'noretreat', 'shellsmash', 'workup',
];
// Some moves that only boost Speed:
const SPEED_SETUP = [
	'agility', 'autotomize', 'flamecharge', 'rockpolish',
];
// Moves that shouldn't be the only STAB moves:
const NO_STAB = [
	'accelerock', 'aquajet', 'beakblast', 'bounce', 'breakingswipe', 'chatter', 'clearsmog', 'dragontail', 'eruption', 'explosion',
	'fakeout', 'firstimpression', 'flamecharge', 'flipturn', 'gigaimpact', 'iceshard', 'icywind', 'incinerate', 'machpunch',
	'meteorbeam', 'pluck', 'pursuit', 'quickattack', 'reversal', 'selfdestruct', 'skydrop', 'snarl', 'suckerpunch', 'uturn', 'watershuriken',
	'vacuumwave', 'voltswitch', 'waterspout',
];
// Hazard-setting moves
const HAZARDS = [
	'spikes', 'stealthrock', 'stickyweb', 'toxicspikes',
];

function sereneGraceBenefits(move: Move) {
	return move.secondary?.chance && move.secondary.chance >= 20 && move.secondary.chance < 100;
}

export class RandomBDSPTeams {
	readonly dex: ModdedDex;
	gen: number;
	factoryTier: string;
	format: Format;
	prng: PRNG;
	noStab: string[];
	priorityPokemon: string[];
	readonly maxTeamSize: number;
	readonly adjustLevel: number | null;
	readonly maxMoveCount: number;
	readonly forceMonotype: string | undefined;

	randomData: { [species: string]: OldRandomBattleSpecies } = require('./data.json');

	/**
	 * Checkers for move enforcement based on a Pokémon's types or other factors
	 *
	 * returns true to reject one of its other moves to try to roll the forced move, false otherwise.
	 */
	moveEnforcementCheckers: { [k: string]: MoveEnforcementChecker };

	/** Used by .getPools() */
	private poolsCacheKey: [string | undefined, number | undefined, RuleTable | undefined, boolean] | undefined;
	private cachedPool: number[] | undefined;
	private cachedSpeciesPool: Species[] | undefined;

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		format = Dex.formats.get(format);
		this.dex = Dex.forFormat(format);
		this.gen = this.dex.gen;
		this.noStab = NO_STAB;
		this.priorityPokemon = [];

		const ruleTable = Dex.formats.getRuleTable(format);
		this.maxTeamSize = ruleTable.maxTeamSize;
		this.adjustLevel = ruleTable.adjustLevel;
		this.maxMoveCount = ruleTable.maxMoveCount;
		const forceMonotype = ruleTable.valueRules.get('forcemonotype');
		this.forceMonotype = forceMonotype && this.dex.types.get(forceMonotype).exists ?
			this.dex.types.get(forceMonotype).name : undefined;

		this.factoryTier = '';
		this.format = format;
		this.prng = PRNG.get(prng);

		this.moveEnforcementCheckers = {
			screens: (movePool, moves, abilities, types, counter, species, teamDetails) => {
				if (teamDetails.screens) return false;
				return (
					(moves.has('lightscreen') && movePool.includes('reflect')) ||
					(moves.has('reflect') && movePool.includes('lightscreen'))
				);
			},
			recovery: (movePool, moves, abilities, types, counter, species, teamDetails) => (
				!!counter.get('Status') &&
				!counter.setupType &&
				['morningsun', 'recover', 'roost', 'slackoff', 'softboiled'].some(moveid => movePool.includes(moveid)) &&
				['healingwish', 'switcheroo', 'trick', 'trickroom'].every(moveid => !moves.has(moveid))
			),
			misc: (movePool, moves, abilities, types, counter, species, teamDetails) => {
				if (movePool.includes('milkdrink') || movePool.includes('quiverdance')) return true;
				return movePool.includes('stickyweb') && !counter.setupType && !teamDetails.stickyWeb;
			},
			lead: (movePool, moves, abilities, types, counter) => (
				movePool.includes('stealthrock') &&
				!!counter.get('Status') &&
				!counter.setupType &&
				!counter.get('speedsetup') &&
				!moves.has('substitute')
			),
			leechseed: (movePool, moves) => (
				!moves.has('calmmind') &&
				['protect', 'substitute', 'spikyshield'].some(m => movePool.includes(m))
			),
			Bug: movePool => movePool.includes('megahorn'),
			Dark: (movePool, moves, abilities, types, counter) => {
				if (!counter.get('Dark')) return true;
				return moves.has('suckerpunch') && (movePool.includes('knockoff') || movePool.includes('wickedblow'));
			},
			Dragon: (movePool, moves, abilities, types, counter) => (
				!counter.get('Dragon') &&
				!moves.has('dragonascent') &&
				!moves.has('substitute') &&
				!(moves.has('rest') && moves.has('sleeptalk'))
			),
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric') || movePool.includes('thunder'),
			Fairy: (movePool, moves, abilities, types, counter) => (
				!counter.get('Fairy') &&
				['dazzlinggleam', 'moonblast', 'fleurcannon', 'playrough', 'strangesteam'].some(moveid => movePool.includes(moveid))
			),
			Fighting: (movePool, moves, abilities, types, counter) => !counter.get('Fighting') || !counter.get('stab'),
			Fire: (movePool, moves, abilities, types, counter, species) => {
				// Entei should never reject Extreme Speed even if Flare Blitz could be rolled instead
				const enteiException = moves.has('extremespeed') && species.id === 'entei';
				return !moves.has('bellydrum') && (!counter.get('Fire') || (!enteiException && movePool.includes('flareblitz')));
			},
			Flying: (movePool, moves, abilities, types, counter) => (
				!counter.get('Flying') && !types.has('Dragon') && [
					'airslash', 'bravebird', 'dualwingbeat', 'oblivionwing',
				].some(moveid => movePool.includes(moveid))
			),
			Ghost: (movePool, moves, abilities, types, counter) => {
				if (moves.has('nightshade')) return false;
				if (!counter.get('Ghost') && !types.has('Dark')) return true;
				if (movePool.includes('poltergeist')) return true;
				return movePool.includes('spectralthief') && !counter.get('Dark');
			},
			Grass: (movePool, moves, abilities, types, counter, species) => {
				if (movePool.includes('leafstorm') || movePool.includes('grassyglide')) return true;
				return !counter.get('Grass') && species.baseStats.atk >= 100;
			},
			Ground: (movePool, moves, abilities, types, counter) => !counter.get('Ground'),
			Ice: (movePool, moves, abilities, types, counter) => {
				if (!counter.get('Ice')) return true;
				if (movePool.includes('iciclecrash')) return true;
				return abilities.includes('Snow Warning') && movePool.includes('blizzard');
			},
			Normal: (movePool, moves, abilities, types, counter) => (
				(abilities.includes('Guts') && movePool.includes('facade')) ||
				(abilities.includes('Pixilate') && !counter.get('Normal'))
			),
			Poison: (movePool, moves, abilities, types, counter) => {
				if (counter.get('Poison')) return false;
				return types.has('Ground') || types.has('Psychic') || types.has('Grass') || !!counter.setupType || movePool.includes('gunkshot');
			},
			Psychic: (movePool, moves, abilities, types, counter) => {
				if (counter.get('Psychic')) return false;
				if (types.has('Ghost') || types.has('Steel')) return false;
				return abilities.includes('Psychic Surge') || !!counter.setupType || movePool.includes('psychicfangs');
			},
			Rock: (movePool, moves, abilities, types, counter, species) => !counter.get('Rock') && species.baseStats.atk >= 80,
			Steel: (movePool, moves, abilities, types, counter, species) => {
				if (species.baseStats.atk < 95) return false;
				if (movePool.includes('meteormash')) return true;
				return !counter.get('Steel');
			},
			Water: (movePool, moves, abilities, types, counter, species) => {
				if (!counter.get('Water') && !moves.has('hypervoice')) return true;
				if (['hypervoice', 'liquidation', 'surgingstrikes'].some(m => movePool.includes(m))) return true;
				return abilities.includes('Huge Power') && movePool.includes('aquajet');
			},
		};
		this.poolsCacheKey = undefined;
		this.cachedPool = undefined;
		this.cachedSpeciesPool = undefined;
	}

	setSeed(prng?: PRNG | PRNGSeed) {
		this.prng = PRNG.get(prng);
	}

	getTeam(options?: PlayerOptions | null): PokemonSet[] {
		const generatorName = (
			typeof this.format.team === 'string' && this.format.team.startsWith('random')
		) ? this.format.team + 'Team' : '';
		// @ts-expect-error property access
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

	unrejectableMovesInSingles(move: Move) {
		// These moves cannot be rejected in favor of a forced move in singles
		return (move.category !== 'Status' || !move.flags.heal) && ![
			'facade', 'leechseed', 'lightscreen', 'reflect', 'sleeptalk', 'spore', 'substitute', 'switcheroo',
			'teleport', 'toxic', 'trick',
		].includes(move.id);
	}

	queryMoves(
		moves: Set<string> | null,
		types: string[],
		abilities: string[],
		movePool: string[] = []
	): MoveCounter {
		// This is primarily a helper function for random setbuilder functions.
		const counter = new MoveCounter();

		if (!moves?.size) return counter;

		const categories = { Physical: 0, Special: 0, Status: 0 };

		// Iterate through all moves we've chosen so far and keep track of what they do:
		for (const moveid of moves) {
			let move = this.dex.moves.get(moveid);
			if (move.id === 'naturepower') {
				if (this.gen === 5) move = this.dex.moves.get('earthquake');
			}

			let moveType = move.type;
			if (['judgment', 'multiattack', 'revelationdance'].includes(moveid)) moveType = types[0];
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
			// Moves which have a base power, but aren't super-weak like Rapid Spin:
			if (move.basePower > 30 || move.multihit || move.basePowerCallback || moveid === 'infestation') {
				counter.add(moveType);
				if (types.includes(moveType)) {
					// STAB:
					// Certain moves aren't acceptable as a Pokemon's only STAB attack
					if (!this.noStab.includes(moveid) && (!moveid.startsWith('hiddenpower') || types.length === 1)) {
						counter.add('stab');
						// Ties between Physical and Special setup should broken in favor of STABs
						categories[move.category] += 0.1;
					}
				} else if (
					// Less obvious forms of STAB
					(moveType === 'Normal' && (['Aerilate', 'Galvanize', 'Pixilate', 'Refrigerate'].some(a => abilities.includes(a)))) ||
					(move.priority === 0 && (['Libero', 'Protean'].some(a => abilities.includes(a))) && !this.noStab.includes(moveid)) ||
					(moveType === 'Steel' && abilities.includes('Steelworker'))
				) {
					counter.add('stab');
				}

				if (move.flags['bite']) counter.add('strongjaw');
				if (move.flags['punch']) counter.add('ironfist');
				if (move.flags['sound']) counter.add('sound');
				if (move.priority !== 0 || (moveid === 'grassyglide' && abilities.includes('Grassy Surge'))) {
					counter.add('priority');
				}
				counter.damagingMoves.add(move);
			}
			// Moves with secondary effects:
			if (move.secondary) {
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
			if (PHYSICAL_SETUP.includes(moveid)) {
				counter.add('physicalsetup');
				counter.setupType = 'Physical';
			} else if (SPECIAL_SETUP.includes(moveid)) {
				counter.add('specialsetup');
				counter.setupType = 'Special';
			}

			if (MIXED_SETUP.includes(moveid)) counter.add('mixedsetup');
			if (SPEED_SETUP.includes(moveid)) counter.add('speedsetup');
			if (HAZARDS.includes(moveid)) counter.add('hazards');
		}

		// Keep track of the available moves
		for (const moveid of movePool) {
			const move = this.dex.moves.get(moveid);
			if (move.damageCallback) continue;
			if (move.category === 'Physical') counter.add('physicalpool');
			if (move.category === 'Special') counter.add('specialpool');
		}

		// Choose a setup type:
		if (counter.get('mixedsetup')) {
			counter.setupType = 'Mixed';
		} else if (counter.get('physicalsetup') && counter.get('specialsetup')) {
			const pool = {
				Physical: categories['Physical'] + counter.get('physicalpool'),
				Special: categories['Special'] + counter.get('specialpool'),
			};
			if (pool.Physical === pool.Special) {
				if (categories['Physical'] > categories['Special']) counter.setupType = 'Physical';
				if (categories['Special'] > categories['Physical']) counter.setupType = 'Special';
			} else {
				counter.setupType = pool.Physical > pool.Special ? 'Physical' : 'Special';
			}
		} else if (counter.setupType === 'Physical') {
			if (
				(categories['Physical'] < 2 && (!counter.get('stab') || !counter.get('physicalpool'))) &&
				!(moves.has('rest') && moves.has('sleeptalk')) &&
				!moves.has('batonpass')
			) {
				counter.setupType = '';
			}
		} else if (counter.setupType === 'Special') {
			if (
				(categories['Special'] < 2 && (!counter.get('stab') || !counter.get('specialpool'))) &&
				!moves.has('quiverdance') &&
				!(moves.has('rest') && moves.has('sleeptalk')) &&
				!(moves.has('wish') && moves.has('protect')) &&
				!moves.has('batonpass')
			) {
				counter.setupType = '';
			}
		}

		counter.set('Physical', Math.floor(categories['Physical']));
		counter.set('Special', Math.floor(categories['Special']));
		counter.set('Status', categories['Status']);

		return counter;
	}

	shouldCullMove(
		move: Move,
		types: Set<string>,
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
	): { cull: boolean, isSetup?: boolean } {
		if (species.id === 'entei' && movePool.includes('extremespeed')) {
			return { cull: true };
		}
		// Spore is really, really good and should be forced onto all sets.
		// zzzzzz
		// Substitute is a hardcode for Breloom.
		if (movePool.includes('spore') && move.id !== 'substitute') {
			return { cull: true };
		}

		const hasRestTalk = moves.has('rest') && moves.has('sleeptalk');

		// Reject moves that need support
		switch (move.id) {
		case 'fly':
			return { cull: !types.has(move.type) && !counter.setupType && !!counter.get('Status') };
		case 'healbell':
			return { cull: movePool.includes('protect') || movePool.includes('wish') };
		case 'fireblast':
			// Special case for Togekiss, which always wants Aura Sphere
			return { cull: abilities.includes('Serene Grace') && (!moves.has('trick') || counter.get('Status') > 1) };
		case 'firepunch':
			// Special case for Darmanitan-Zen-Galar, which doesn't always want Fire Punch
			return { cull: moves.has('earthquake') && movePool.includes('substitute') };
		case 'flamecharge':
			return { cull: movePool.includes('swordsdance') };
		case 'focuspunch':
			return { cull: !moves.has('substitute') };
		case 'rest':
			const bulkySetup = !moves.has('sleeptalk') && ['bulkup', 'calmmind', 'coil', 'curse'].some(m => movePool.includes(m));
			// Registeel would otherwise get Curse sets without Rest, which are very bad generally
			return { cull: species.id !== 'registeel' && (movePool.includes('sleeptalk') || bulkySetup) };
		case 'sleeptalk':
			// Milotic always wants RestTalk
			if (species.id === 'milotic') return { cull: false };
			if (moves.has('stealthrock') || !moves.has('rest')) return { cull: true };
			if (movePool.length > 1 && !abilities.includes('Contrary')) {
				const rest = movePool.indexOf('rest');
				if (rest >= 0) this.fastPop(movePool, rest);
			}
			break;
		case 'storedpower':
			return { cull: !counter.setupType };
		case 'switcheroo': case 'trick':
			// We cull Switcheroo + Fake Out because Switcheroo is often used with a Choice item
			return { cull: counter.get('Physical') + counter.get('Special') < 3 || moves.has('rapidspin') || moves.has('fakeout') };
		case 'trickroom':
			const webs = !!teamDetails.stickyWeb;
			return { cull:
				isLead || webs || !!counter.get('speedsetup') ||
				counter.damagingMoves.size < 2 || movePool.includes('nastyplot'),
			};

		// Set up once and only if we have the moves for it
		case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
			if (counter.setupType !== 'Physical') return { cull: true }; // if we're not setting up physically this is pointless
			if (counter.get('Physical') + counter.get('physicalpool') < 2 && !hasRestTalk) return { cull: true };
			if (move.id === 'swordsdance' && moves.has('dragondance')) return { cull: true }; // Dragon Dance is judged as better

			return { cull: false, isSetup: true };
		case 'calmmind': case 'nastyplot':
			if (counter.setupType !== 'Special') return { cull: true };
			if (
				(counter.get('Special') + counter.get('specialpool')) < 2 &&
				!hasRestTalk &&
				!(moves.has('wish') && moves.has('protect'))
			) return { cull: true };
			if (moves.has('healpulse') || move.id === 'calmmind' && moves.has('trickroom')) return { cull: true };
			return { cull: false, isSetup: true };
		case 'quiverdance':
			return { cull: false, isSetup: true };
		case 'shellsmash': case 'workup':
			if (counter.setupType !== 'Mixed') return { cull: true };
			if (counter.damagingMoves.size + counter.get('physicalpool') + counter.get('specialpool') < 2) return { cull: true };
			return { cull: false, isSetup: true };
		case 'agility': case 'autotomize': case 'rockpolish':
			if (counter.damagingMoves.size < 2 || moves.has('rest')) return { cull: true };
			if (movePool.includes('calmmind') || movePool.includes('nastyplot')) return { cull: true };
			return { cull: false, isSetup: !counter.setupType };

		// Bad after setup
		case 'counter': case 'reversal':
			// Counter: special case for Alakazam, which doesn't want Counter + Nasty Plot
			return { cull: !!counter.setupType };
		case 'bulletpunch': case 'extremespeed': case 'rockblast':
			return { cull: (
				!!counter.get('speedsetup') ||
				moves.has('dragondance') ||
				counter.damagingMoves.size < 2
			) };
		case 'closecombat': case 'flashcannon':
			const substituteCullCondition = (
				(moves.has('substitute') && !types.has('Fighting')) ||
				(moves.has('toxic') && movePool.includes('substitute'))
			);
			const preferHJKOverCCCullCondition = (
				move.id === 'closecombat' &&
				!counter.setupType &&
				(moves.has('highjumpkick') || movePool.includes('highjumpkick'))
			);
			return { cull: substituteCullCondition || preferHJKOverCCCullCondition };
		case 'defog':
			return { cull: (
				!!counter.setupType ||
				['healbell', 'toxicspikes', 'stealthrock', 'spikes'].some(m => moves.has(m)) ||
				!!teamDetails.defog
			) };
		case 'fakeout':
			return { cull: !!counter.setupType || ['protect', 'rapidspin', 'substitute', 'uturn'].some(m => moves.has(m)) };
		case 'glare': case 'icywind': case 'tailwind': case 'waterspout':
			return { cull: !!counter.setupType || !!counter.get('speedsetup') || moves.has('rest') };
		case 'healingwish': case 'memento':
			return { cull: !!counter.setupType || !!counter.get('recovery') || moves.has('substitute') || moves.has('uturn') };
		case 'partingshot':
			return { cull: !!counter.get('speedsetup') || moves.has('bulkup') || moves.has('uturn') };
		case 'protect':
			if ((counter.setupType && !moves.has('wish')) || moves.has('rest')) return { cull: true };
			if (
				counter.get('Status') < 2 &&
				['Guts', 'Quick Feet', 'Speed Boost', 'Moody'].every(m => !abilities.includes(m))
			) return { cull: true };
			if (movePool.includes('leechseed') || (movePool.includes('toxic') && !moves.has('wish'))) return { cull: true };
			if (
				['bellydrum', 'fakeout', 'shellsmash', 'spore'].some(m => movePool.includes(m)) ||
				moves.has('tailwind') || moves.has('waterspout')
			) return { cull: true };
			return { cull: false };
		case 'rapidspin':
			const setup = ['curse', 'nastyplot', 'shellsmash'].some(m => moves.has(m));
			return { cull: !!teamDetails.rapidSpin || setup || (!!counter.setupType && counter.get('Fighting') >= 2) };
		case 'roar':
			// for Blastoise
			return { cull: moves.has('shellsmash') };
		case 'shadowsneak':
			const sneakIncompatible = ['substitute', 'trickroom', 'toxic'].some(m => moves.has(m));
			return { cull: hasRestTalk || sneakIncompatible || counter.setupType === 'Special' };
		case 'spikes':
			return { cull: !!counter.setupType || (!!teamDetails.spikes && teamDetails.spikes > 1) };
		case 'stealthrock':
			return { cull:
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				!!teamDetails.stealthRock ||
				['rest', 'substitute', 'trickroom', 'teleport'].some(m => moves.has(m)),
			};
		case 'stickyweb':
			return { cull: !!teamDetails.stickyWeb };
		case 'taunt':
			return { cull: moves.has('encore') || moves.has('nastyplot') || moves.has('swordsdance') };
		case 'thunderwave': case 'voltswitch':
			return { cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				moves.has('shiftgear') ||
				moves.has('raindance')
			) };
		case 'toxic':
			return { cull: !!counter.setupType || ['sludgewave', 'thunderwave', 'willowisp'].some(m => moves.has(m)) };
		case 'toxicspikes':
			return { cull: !!counter.setupType || !!teamDetails.toxicSpikes };
		case 'uturn':
			const bugSwordsDanceCase = types.has('Bug') && counter.get('recovery') && moves.has('swordsdance');
			return { cull: (
				!!counter.get('speedsetup') ||
				(counter.setupType && !bugSwordsDanceCase) ||
				(abilities.includes('Speed Boost') && moves.has('protect'))
			) };

		/**
		 * Ineffective to have both moves together
		 *
		 * These are sorted in order of:
		 * Normal>Fire>Water>Electric>Grass>Ice>Fighting>Poison>Ground>Flying>Psychic>Bug>Rock>Ghost>Dragon>Dark>Fairy
		 * and then subsorted alphabetically.
		 * This type order is arbitrary and referenced from https://pokemondb.net/type.
		 */
		case 'explosion':
			const otherMoves = ['curse', 'stompingtantrum', 'painsplit', 'wish'].some(m => moves.has(m));
			return { cull: !!counter.get('speedsetup') || !!counter.get('recovery') || otherMoves };
		case 'quickattack':
			return { cull: !!counter.get('speedsetup') || (types.has('Rock') && !!counter.get('Status')) };
		case 'flamethrower': case 'lavaplume':
			const otherFireMoves = ['heatwave', 'overheat'].some(m => moves.has(m));
			return { cull: (moves.has('fireblast') && counter.setupType !== 'Physical') || otherFireMoves };
		case 'overheat':
			return { cull: moves.has('flareblitz') };
		case 'aquatail':
			return { cull: moves.has('aquajet') || !!counter.get('Status') };
		case 'hydropump':
			return { cull: moves.has('scald') && (
				(counter.get('Special') < 4 && !moves.has('uturn')) ||
				(species.types.length > 1 && counter.get('stab') < 3)
			) };
		case 'gigadrain':
			return { cull: types.has('Poison') && !counter.get('Poison') };
		case 'leafstorm':
			const leafBladePossible = movePool.includes('leafblade') || moves.has('leafblade');
			return { cull:
				(counter.setupType === 'Physical' && leafBladePossible) ||
				(moves.has('gigadrain') && !!counter.get('Status')),
			};
		case 'freezedry':
			const betterIceMove = (
				(moves.has('blizzard') && !!counter.setupType) ||
				(moves.has('icebeam') && counter.get('Special') < 4)
			);
			const preferThunderWave = movePool.includes('thunderwave') && types.has('Electric');
			return { cull: betterIceMove || preferThunderWave || movePool.includes('bodyslam') };
		// Milotic always wants RestTalk
		case 'icebeam':
			return { cull: moves.has('dragontail') };
		case 'bodypress':
			const pressIncompatible = ['shellsmash', 'mirrorcoat', 'whirlwind'].some(m => moves.has(m));
			return { cull: pressIncompatible || counter.setupType === 'Special' };
		case 'drainpunch':
			return { cull: moves.has('closecombat') || (!types.has('Fighting') && movePool.includes('swordsdance')) };
		case 'facade':
			// Prefer Dynamic Punch when it can be a guaranteed-hit STAB move (mostly for Machamp)
			return { cull: moves.has('dynamicpunch') && species.types.includes('Fighting') && abilities.includes('No Guard') };
		case 'focusblast':
			// Special cases for Blastoise and Regice; Blastoise wants Shell Smash, and Regice wants Thunderbolt
			return { cull: movePool.includes('shellsmash') || hasRestTalk };
		case 'superpower':
			return {
				cull: moves.has('hydropump') ||
					(counter.get('Physical') >= 4 && movePool.includes('uturn')) ||
					(moves.has('substitute') && !abilities.includes('Contrary')),
				isSetup: abilities.includes('Contrary'),
			};
		case 'poisonjab':
			return { cull: !types.has('Poison') && counter.get('Status') >= 2 };
		case 'earthquake':
			const subToxicPossible = moves.has('substitute') && movePool.includes('toxic');
			return { cull: subToxicPossible || moves.has('bonemerang') };
		case 'airslash':
			return { cull: hasRestTalk || counter.setupType === 'Physical' };
		case 'hurricane':
			return { cull: counter.setupType === 'Physical' };
		case 'futuresight':
			return { cull: moves.has('psyshock') || moves.has('trick') || movePool.includes('teleport') };
		case 'psychic':
			return { cull: moves.has('psyshock') && (!!counter.setupType) };
		case 'psyshock':
			return { cull: moves.has('psychic') };
		case 'bugbuzz':
			return { cull: moves.has('uturn') && !counter.setupType && !abilities.includes('Tinted Lens') };
		case 'leechlife':
			return { cull:
				(moves.has('uturn') && !counter.setupType) ||
				movePool.includes('spikes'),
			};
		case 'stoneedge':
			const machampCullCondition = species.id === 'machamp' && !moves.has('dynamicpunch');
			const rockSlidePlusStatusPossible = counter.get('Status') && movePool.includes('rockslide');
			const otherRockMove = moves.has('rockblast') || moves.has('rockslide');
			const lucarioCull = species.id === 'lucario' && !!counter.setupType;
			return { cull: machampCullCondition || rockSlidePlusStatusPossible || otherRockMove || lucarioCull };
		case 'shadowball':
			return { cull: (!types.has('Ghost') && movePool.includes('focusblast')) };
		case 'shadowclaw':
			return { cull: types.has('Steel') && moves.has('shadowsneak') && counter.get('Physical') < 4 };
		case 'dragonpulse': case 'spacialrend':
			return { cull: moves.has('dracometeor') && counter.get('Special') < 4 };
		case 'darkpulse':
			const pulseIncompatible = ['foulplay', 'knockoff'].some(m => moves.has(m)) || (
				species.id === 'shiftry' && (moves.has('defog') || moves.has('suckerpunch'))
			);
			// Special clause to prevent bugged Shiftry sets with Sucker Punch + Nasty Plot
			const shiftryCase = movePool.includes('nastyplot') && !moves.has('defog');
			return { cull: pulseIncompatible && !shiftryCase && counter.setupType !== 'Special' };
		case 'suckerpunch':
			return { cull:
				moves.has('rest') ||
				counter.damagingMoves.size < 2 ||
				(counter.setupType === 'Special') ||
				(counter.get('Dark') > 1 && !types.has('Dark')),
			};
		case 'dazzlinggleam':
			return { cull: ['moonblast', 'petaldance'].some(m => moves.has(m)) };

		// Status:
		case 'bodyslam': case 'clearsmog':
			const toxicCullCondition = moves.has('toxic') && !types.has('Normal');
			return { cull: moves.has('sludgebomb') || moves.has('trick') || movePool.includes('recover') || toxicCullCondition };
		case 'willowisp': case 'yawn':
			// Swords Dance is a special case for Rapidash
			return { cull: moves.has('thunderwave') || moves.has('toxic') || moves.has('swordsdance') };
		case 'painsplit': case 'recover': case 'synthesis':
			return { cull: moves.has('rest') || moves.has('wish') || (move.id === 'synthesis' && moves.has('gigadrain')) };
		case 'roost':
			return { cull:
				moves.has('throatchop') ||
				// Special cases for Salamence, Dynaless Dragonite, and Scizor to help prevent sets with poor coverage or no setup.
				(moves.has('dualwingbeat') && (moves.has('outrage') || species.id === 'scizor')),
			};
		case 'reflect': case 'lightscreen':
			return { cull: !!teamDetails.screens };
		case 'slackoff':
			// Special case to prevent Scaldless Slowking
			return { cull: species.id === 'slowking' && !moves.has('scald') };
		case 'substitute':
			const moveBasedCull = (
				// Breloom is OK with Substitute + Swords Dance (for subpunch sets)
				species.id !== 'breloom' &&
				['bulkup', 'nastyplot', 'painsplit', 'roost', 'swordsdance'].some(m => movePool.includes(m))
			);
			const shayminCase = abilities.includes('Serene Grace') && movePool.includes('airslash') && !moves.has('airslash');
			return { cull: moves.has('rest') || moveBasedCull || shayminCase };
		case 'wideguard':
			return { cull: moves.has('protect') };
		case 'grassknot':
			// Special case for Raichu
			return { cull: moves.has('surf') };
		}

		return { cull: false };
	}

	shouldCullAbility(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
	): boolean {
		if ([
			'Flare Boost', 'Hydration', 'Ice Body', 'Immunity', 'Insomnia', 'Rain Dish',
			'Snow Cloak', 'Steadfast',
		].includes(ability)) return true;

		switch (ability) {
		// Abilities which are primarily useful for certain moves
		case 'Contrary': case 'Serene Grace': case 'Skill Link':
			return !counter.get(ability.toLowerCase().replace(/\s/g, ''));
		case 'Analytic':
			return (moves.has('rapidspin') || species.nfe);
		case 'Blaze':
			return species.id === 'charizard';
		case 'Chlorophyll':
			return (species.baseStats.spe > 100 || !counter.get('Fire') && !moves.has('sunnyday') && !teamDetails.sun);
		case 'Cloud Nine':
			return species.id !== 'golduck';
		case 'Competitive':
			return (counter.get('Special') < 2 || (moves.has('rest') && moves.has('sleeptalk')));
		case 'Compound Eyes': case 'No Guard':
			return !counter.get('inaccurate');
		case 'Cursed Body':
			return abilities.includes('Infiltrator');
		case 'Defiant':
			return !counter.get('Physical');
		case 'Download':
			return (counter.damagingMoves.size < 3 || moves.has('trick'));
		case 'Flash Fire':
			return (this.dex.getEffectiveness('Fire', species) < -1 || abilities.includes('Drought'));
		case 'Gluttony':
			return !moves.has('bellydrum');
		case 'Guts':
			return (!moves.has('facade') && !moves.has('sleeptalk') && !species.nfe ||
				abilities.includes('Quick Feet') && !!counter.setupType);
		case 'Harvest':
			return abilities.includes('Frisk');
		case 'Hustle': case 'Inner Focus':
			return (counter.get('Physical') < 2 || abilities.includes('Iron Fist'));
		case 'Infiltrator':
			return (moves.has('rest') && moves.has('sleeptalk'));
		case 'Intimidate':
			if (species.id === 'salamence' && moves.has('dragondance')) return true;
			return ['bodyslam', 'bounce', 'rockclimb', 'tripleaxel'].some(m => moves.has(m));
		case 'Iron Fist':
			return (counter.get('ironfist') < 2 || moves.has('dynamicpunch'));
		case 'Lightning Rod':
			return (species.types.includes('Ground') || counter.setupType === 'Physical');
		case 'Limber':
			return species.types.includes('Electric') || moves.has('facade');
		case 'Mold Breaker':
			return (
				abilities.includes('Adaptability') || abilities.includes('Scrappy') || (abilities.includes('Unburden') && !!counter.setupType) ||
				(abilities.includes('Sheer Force') && !!counter.get('sheerforce'))
			);
		case 'Moody':
			return !!counter.setupType && abilities.includes('Simple');
		case 'Moxie':
			return (counter.get('Physical') < 2 || moves.has('stealthrock') || moves.has('defog'));
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Own Tempo':
			return !moves.has('petaldance');
		case 'Prankster':
			return !counter.get('Status');
		case 'Pressure':
			return (!!counter.setupType || counter.get('Status') < 2);
		case 'Quick Feet':
			return !moves.has('facade');
		case 'Reckless':
			return !counter.get('recoil') || moves.has('curse');
		case 'Rock Head':
			return !counter.get('recoil');
		case 'Sand Force': case 'Sand Veil':
			return !teamDetails.sand;
		case 'Sand Rush':
			return (!teamDetails.sand && (!counter.setupType || !counter.get('Rock') || moves.has('rapidspin')));
		case 'Scrappy':
			return (moves.has('earthquake') && species.id === 'miltank');
		case 'Sheer Force':
			return (!counter.get('sheerforce') || abilities.includes('Guts'));
		case 'Shell Armor':
			return (species.id === 'omastar' && (moves.has('spikes') || moves.has('stealthrock')));
		case 'Sniper':
			return counter.get('Water') > 1 && !moves.has('focusenergy');
		case 'Solar Power':
			return (!teamDetails.sun || abilities.includes('Harvest'));
		case 'Speed Boost':
			return moves.has('uturn');
		case 'Sturdy':
			return (moves.has('bulkup') || !!counter.get('recoil') || abilities.includes('Solid Rock'));
		case 'Swarm':
			return (!counter.get('Bug') || !!counter.get('recovery'));
		case 'Swift Swim':
			const neverWantsSwim = !moves.has('raindance') && [
				'Intimidate', 'Rock Head', 'Water Absorb',
			].some(m => abilities.includes(m));
			const noSwimIfNoRain = !moves.has('raindance') && [
				'Cloud Nine', 'Lightning Rod', 'Intimidate', 'Rock Head', 'Sturdy', 'Water Absorb', 'Water Veil', 'Weak Armor',
			].some(m => abilities.includes(m));
			return teamDetails.rain ? neverWantsSwim : noSwimIfNoRain;
		case 'Synchronize':
			return counter.get('Status') < 3;
		case 'Technician':
			return (
				!counter.get('technician') ||
				moves.has('tailslap') ||
				abilities.includes('Punk Rock')
			);
		case 'Tinted Lens':
			return (
				// For Butterfree
				(moves.has('hurricane') && abilities.includes('Compound Eyes')) ||
				(counter.get('Status') > 2 && !counter.setupType) ||
				// For Yanmega
				moves.has('protect')
			);
		case 'Unaware':
			return species.id === 'bibarel';
		case 'Unburden':
			return (
				abilities.includes('Prankster') ||
				// intended for Hitmonlee
				abilities.includes('Reckless') ||
				!counter.setupType
			);
		case 'Volt Absorb':
			return (this.dex.getEffectiveness('Electric', species) < -1);
		case 'Water Absorb':
			return (
				moves.has('raindance') ||
				['Drizzle', 'Strong Jaw', 'Unaware', 'Volt Absorb'].some(abil => abilities.includes(abil))
			);
		case 'Weak Armor':
			return (
				species.id === 'skarmory' ||
				moves.has('shellsmash') || moves.has('rapidspin')
			);
		}

		return false;
	}

	getAbility(
		types: Set<string>,
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
	): string {
		const abilityData = Array.from(abilities).map(a => this.dex.abilities.get(a));
		Utils.sortBy(abilityData, abil => -abil.rating);

		if (abilityData.length <= 1) return abilityData[0].name;

		// Hard-code abilities here

		// Lopunny, and other Facade users, don't want Limber, even if other abilities are poorly rated,
		// since paralysis would arguably be good for them.
		if (species.id === 'lopunny' && moves.has('facade')) return 'Cute Charm';
		if (species.id === 'copperajahgmax') return 'Heavy Metal';
		if (abilities.includes('Guts') &&
			// for Ursaring in BDSP
			!abilities.includes('Quick Feet') && (
			species.id === 'gurdurr' || species.id === 'throh' ||
			moves.has('facade') || (moves.has('rest') && moves.has('sleeptalk'))
		)) return 'Guts';
		if (abilities.includes('Moxie') && (counter.get('Physical') > 3 || moves.has('bounce'))) return 'Moxie';

		let abilityAllowed: Ability[] = [];
		// Obtain a list of abilities that are allowed (not culled)
		for (const ability of abilityData) {
			if (ability.rating >= 1 && !this.shouldCullAbility(
				ability.name, types, moves, abilities, counter, movePool, teamDetails, species
			)) {
				abilityAllowed.push(ability);
			}
		}

		// If all abilities are rejected, re-allow all abilities
		if (!abilityAllowed.length) {
			for (const ability of abilityData) {
				if (ability.rating > 0) abilityAllowed.push(ability);
			}
			if (!abilityAllowed.length) abilityAllowed = abilityData;
		}

		if (abilityAllowed.length === 1) return abilityAllowed[0].name;
		// Sort abilities by rating with an element of randomness
		// All three abilities can be chosen
		if (abilityAllowed[2] && abilityAllowed[0].rating - 0.5 <= abilityAllowed[2].rating) {
			if (abilityAllowed[1].rating <= abilityAllowed[2].rating) {
				if (this.randomChance(1, 2)) [abilityAllowed[1], abilityAllowed[2]] = [abilityAllowed[2], abilityAllowed[1]];
			} else {
				if (this.randomChance(1, 3)) [abilityAllowed[1], abilityAllowed[2]] = [abilityAllowed[2], abilityAllowed[1]];
			}
			if (abilityAllowed[0].rating <= abilityAllowed[1].rating) {
				if (this.randomChance(2, 3)) [abilityAllowed[0], abilityAllowed[1]] = [abilityAllowed[1], abilityAllowed[0]];
			} else {
				if (this.randomChance(1, 2)) [abilityAllowed[0], abilityAllowed[1]] = [abilityAllowed[1], abilityAllowed[0]];
			}
		} else {
			// Third ability cannot be chosen
			if (abilityAllowed[0].rating <= abilityAllowed[1].rating) {
				if (this.randomChance(1, 2)) [abilityAllowed[0], abilityAllowed[1]] = [abilityAllowed[1], abilityAllowed[0]];
			} else if (abilityAllowed[0].rating - 0.5 <= abilityAllowed[1].rating) {
				if (this.randomChance(1, 3)) [abilityAllowed[0], abilityAllowed[1]] = [abilityAllowed[1], abilityAllowed[0]];
			}
		}

		// After sorting, choose the first ability
		return abilityAllowed[0].name;
	}

	getHighPriorityItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
	) {
		// not undefined — we want "no item" not "go find a different item"
		if (moves.has('acrobatics')) return '';
		if (moves.has('solarbeam') && !(moves.has('sunnyday') || ability === 'Drought' || teamDetails.sun)) return 'Power Herb';
		if (moves.has('shellsmash')) return 'White Herb';
		// Species-specific item assigning
		if (species.name === 'Farfetch\u2019d') return 'Leek';
		if (species.name === 'Latios' || species.name === 'Latias') return 'Soul Dew';
		if (species.name === 'Lopunny') return 'Toxic Orb';
		if (species.baseSpecies === 'Marowak') return 'Thick Club';
		if (species.baseSpecies === 'Pikachu') return 'Light Ball';
		if (species.name === 'Shedinja' || species.name === 'Smeargle') return 'Focus Sash';
		if (species.name === 'Shuckle' && moves.has('stickyweb')) return 'Mental Herb';
		if (ability !== 'Sniper' && (ability === 'Super Luck' || moves.has('focusenergy'))) return 'Scope Lens';
		if (species.name === 'Wobbuffet' && moves.has('destinybond')) return 'Custap Berry';
		if (species.name === 'Scyther' && counter.damagingMoves.size > 3) return 'Choice Band';
		if ((moves.has('bellydrum') || moves.has('tailglow')) && moves.has('substitute')) return 'Salac Berry';

		// Ability based logic and miscellaneous logic
		if (species.name === 'Wobbuffet' || ability === 'Ripen' || ability === 'Harvest') return 'Sitrus Berry';
		if (ability === 'Gluttony') return this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki']) + ' Berry';
		if (ability === 'Imposter') return 'Choice Scarf';
		if (ability === 'Guts' && counter.get('Physical') > 2) {
			return types.has('Fire') ? 'Toxic Orb' : 'Flame Orb';
		}
		if (ability === 'Quick Feet' && moves.has('facade')) return 'Toxic Orb';
		if (ability === 'Toxic Boost' || ability === 'Poison Heal') return 'Toxic Orb';
		if (ability === 'Magic Guard' && counter.damagingMoves.size > 1) {
			return moves.has('counter') ? 'Focus Sash' : 'Life Orb';
		}
		if (ability === 'Sheer Force' && counter.get('sheerforce')) return 'Life Orb';
		if (ability === 'Unburden') return (moves.has('closecombat') || moves.has('curse')) ? 'White Herb' : 'Sitrus Berry';

		if (!moves.has('fakeout') && (moves.has('trick') || moves.has('switcheroo'))) {
			if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && !counter.get('priority')) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (moves.has('auroraveil') || moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		const statusCuringAbility = (
			ability === 'Shed Skin' ||
			ability === 'Natural Cure' ||
			(ability === 'Hydration' && moves.has('raindance'))
		);
		const restWithoutSleepTalk = (moves.has('rest') && !moves.has('sleeptalk'));
		if (restWithoutSleepTalk && !statusCuringAbility) return 'Chesto Berry';
		if (moves.has('bellydrum')) return 'Sitrus Berry';
	}

	getMediumPriorityItem(
		ability: string,
		moves: Set<string>,
		counter: MoveCounter,
		species: Species,
		isLead: boolean,
	): string | undefined {
		// Choice items
		if (moves.size === 1) {
			switch (this.dex.moves.get([...moves][0]).category) {
			case 'Status':
				return 'Choice Scarf';
			case 'Physical':
				return 'Choice Band';
			case 'Special':
				return 'Choice Specs';
			}
		}

		const choiceOK = ['fakeout', 'flamecharge', 'rapidspin'].every(m => !moves.has(m));

		if (counter.get('Physical') >= 4 && ability !== 'Serene Grace' && choiceOK) {
			const scarfReqs = (
				(species.baseStats.atk >= 100 || ability === 'Huge Power') &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && !counter.get('priority') &&
				['bounce', 'aerialace'].every(m => !moves.has(m))
			);
			return (scarfReqs && this.randomChance(2, 3)) ? 'Choice Scarf' : 'Choice Band';
		}
		if (moves.has('sunnyday')) return 'Heat Rock';
		if (counter.get('Special') >= 4 || (counter.get('Special') >= 3 && moves.has('uturn'))) {
			const scarfReqs = (
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Tinted Lens' && !counter.get('Physical')
			);
			return (scarfReqs && this.randomChance(2, 3)) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (counter.get('Physical') >= 4 && choiceOK) return 'Choice Band';

		if (
			((counter.get('Physical') >= 3 && moves.has('defog')) || (counter.get('Special') >= 3 && moves.has('healingwish'))) &&
			!counter.get('priority') && !moves.has('uturn')
		) return 'Choice Scarf';

		// Other items
		if (
			moves.has('raindance') || moves.has('sunnyday') ||
			(ability === 'Speed Boost' && !counter.get('hazards'))
		) return 'Life Orb';
		if (
			['clearsmog', 'curse', 'haze', 'healbell', 'protect', 'sleeptalk'].some(m => moves.has(m)) &&
			ability === 'Moody'
		) return 'Leftovers';
	}

	getLowPriorityItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
	): string | undefined {
		const defensiveStatTotal = species.baseStats.hp + species.baseStats.def + species.baseStats.spd;

		if (
			isLead &&
			ability !== 'Sturdy' && !moves.has('substitute') &&
			!counter.get('drain') && !counter.get('recoil') && !counter.get('recovery') &&
			((defensiveStatTotal <= 250 && counter.get('hazards')) || defensiveStatTotal <= 210)
		) return 'Focus Sash';
		if (
			counter.damagingMoves.size >= 3 &&
			!counter.get('damage') &&
			ability !== 'Sturdy' &&
			(species.baseStats.spe >= 90 || !moves.has('voltswitch')) &&
			['foulplay', 'rapidspin', 'substitute', 'uturn'].every(m => !moves.has(m)) && (
				counter.get('speedsetup') ||
				// No Dynamax Buzzwole doesn't want Life Orb with Bulk Up + 3 attacks
				(counter.get('drain') && moves.has('roost')) ||
				moves.has('trickroom') || moves.has('psystrike') ||
				(species.baseStats.spe > 40 && defensiveStatTotal < 275)
			)
		) return 'Life Orb';
		if (
			counter.damagingMoves.size >= 4 &&
			!counter.get('Dragon') && !counter.get('Normal')
		) {
			return 'Expert Belt';
		}
		if (
			!moves.has('substitute') &&
			(moves.has('dragondance') || moves.has('swordsdance')) &&
			(moves.has('outrage') || (
				['Bug', 'Fire', 'Ground', 'Normal', 'Poison'].every(type => !types.has(type)) &&
				ability !== 'Storm Drain'
			))
		) return 'Lum Berry';
	}

	getLevel(
		species: Species,
	): number {
		const data = this.randomData[species.id];
		// level set by rules
		if (this.adjustLevel) return this.adjustLevel;
		// BDSP tier levelling
		if (this.dex.currentMod === 'gen8bdsp') {
			const tierScale: Partial<Record<Species['tier'], number>> = {
				Uber: 76, Unreleased: 76,
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
			const customScale: { [k: string]: number } = {
				delibird: 100, dugtrio: 76, glalie: 76, luvdisc: 100, spinda: 100, unown: 100,
			};

			return customScale[species.id] || tierScale[species.tier] || 80;
		}
		// Arbitrary levelling base on data files (typically winrate-influenced)
		if (data.level) return data.level;
		// Finally default to level 80
		return 80;
	}

	getForme(species: Species): string {
		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			return species.battleOnly;
		}
		if (species.cosmeticFormes) return this.sample([species.name].concat(species.cosmeticFormes));
		if (species.name.endsWith('-Gmax')) return species.name.slice(0, -5);

		// Consolidate mostly-cosmetic formes, at least for the purposes of Random Battles
		if (['Polteageist', 'Zarude'].includes(species.baseSpecies)) {
			return this.sample([species.name].concat(species.otherFormes!));
		}
		if (species.baseSpecies === 'Basculin') return 'Basculin' + this.sample(['', '-Blue-Striped']);
		if (species.baseSpecies === 'Magearna') return 'Magearna' + this.sample(['', '-Original']);
		if (species.baseSpecies === 'Keldeo' && this.gen <= 7) return 'Keldeo' + this.sample(['', '-Resolute']);
		if (species.baseSpecies === 'Pikachu' && this.dex.currentMod === 'gen8') {
			return 'Pikachu' + this.sample(
				['', '-Original', '-Hoenn', '-Sinnoh', '-Unova', '-Kalos', '-Alola', '-Partner', '-World']
			);
		}
		return species.name;
	}

	randomSet(
		species: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false
	): RandomTeamsTypes.RandomSet {
		const ruleTable = this.dex.formats.getRuleTable(this.format);

		species = this.dex.species.get(species);
		const forme = this.getForme(species);
		const gmax = species.name.endsWith('-Gmax');

		const data = this.randomData[species.id];

		const randMoves = data.moves;
		const movePool: string[] = [...(randMoves || this.dex.species.getMovePool(species.id))];
		const rejectedPool = [];
		let ability = '';
		let item = undefined;

		const evs = { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 };
		const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

		const types = new Set(species.types);
		const abilitiesSet = new Set(Object.values(species.abilities));
		if (species.unreleasedHidden) abilitiesSet.delete(species.abilities.H);
		const abilities = Array.from(abilitiesSet);

		const moves = new Set<string>();
		let counter: MoveCounter;
		// This is just for BDSP Unown;
		// it can be removed from this file if BDSP gets its own random-teams file in the future.
		let hasHiddenPower = false;

		do {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			const pool = (movePool.length ? movePool : rejectedPool);
			while (moves.size < this.maxMoveCount && pool.length) {
				const moveid = this.sampleNoReplace(pool);
				if (moveid.startsWith('hiddenpower')) {
					if (hasHiddenPower) continue;
					hasHiddenPower = true;
				}
				moves.add(moveid);
			}

			counter = this.queryMoves(moves, species.types, abilities, movePool);
			const runEnforcementChecker = (checkerName: string) => {
				if (!this.moveEnforcementCheckers[checkerName]) return false;
				return this.moveEnforcementCheckers[checkerName](
					movePool, moves, abilities, types, counter, species, teamDetails
				);
			};

			// Iterate through the moves again, this time to cull them:
			for (const moveid of moves) {
				const move = this.dex.moves.get(moveid);
				let { cull, isSetup } = this.shouldCullMove(
					move, types, moves, abilities, counter,
					movePool, teamDetails, species, isLead
				);

				if (move.id !== 'photongeyser' && (
					(move.category === 'Physical' && counter.setupType === 'Special') ||
					(move.category === 'Special' && counter.setupType === 'Physical')
				)) {
					// Reject STABs last in case the setup type changes later on
					const stabs = counter.get(species.types[0]) + (species.types[1] ? counter.get(species.types[1]) : 0);
					if (!types.has(move.type) || stabs > 1 || counter.get(move.category) < 2) cull = true;
				}

				// Pokemon should have moves that benefit their types, stats, or ability
				const isLowBP = move.basePower && move.basePower < 50;

				// Genesect-Douse should never reject Techno Blast
				const moveIsRejectable = (
					!(species.id === 'genesectdouse' && move.id === 'technoblast') &&
					!(species.id === 'togekiss' && move.id === 'nastyplot') &&
					!(species.id === 'shuckle' && ['stealthrock', 'stickyweb'].includes(move.id)) && (
						move.category === 'Status' ||
						(!types.has(move.type) && move.id !== 'judgment') ||
						(isLowBP && !move.multihit && !abilities.includes('Technician'))
					)
				);
				// Setup-supported moves should only be rejected under specific circumstances
				const notImportantSetup = (
					!counter.setupType ||
					counter.setupType === 'Mixed' ||
					(counter.get(counter.setupType) + counter.get('Status') > 3 && !counter.get('hazards')) ||
					(move.category !== counter.setupType && move.category !== 'Status')
				);

				if (moveIsRejectable && (
					!cull && !isSetup && !move.weather && !move.stallingMove && notImportantSetup && !move.damage &&
					this.unrejectableMovesInSingles(move)
				)) {
					// There may be more important moves that this Pokemon needs
					if (
						// Pokemon should have at least one STAB move
						(!counter.get('stab') && counter.get('physicalpool') + counter.get('specialpool') > 0 && move.id !== 'stickyweb') ||
						// Swords Dance Mew should have Brave Bird
						(moves.has('swordsdance') && species.id === 'mew' && runEnforcementChecker('Flying')) ||
						// Dhelmise should have Anchor Shot
						(abilities.includes('Steelworker') && runEnforcementChecker('Steel')) ||
						// Check for miscellaneous important moves
						(runEnforcementChecker('recovery') && move.id !== 'stickyweb') ||
						runEnforcementChecker('screens') ||
						runEnforcementChecker('misc') ||
						((isLead || species.id === 'shuckle') && runEnforcementChecker('lead')) ||
						(moves.has('leechseed') && runEnforcementChecker('leechseed'))
					) {
						cull = true;
					// Pokemon should have moves that benefit their typing
					// Don't cull Sticky Web in type-based enforcement, and make sure Azumarill always has Aqua Jet
					} else if (move.id !== 'stickyweb' && !(species.id === 'azumarill' && move.id === 'aquajet')) {
						for (const type of types) {
							if (runEnforcementChecker(type)) {
								cull = true;
							}
						}
					}
				}

				// Sleep Talk shouldn't be selected without Rest
				if (move.id === 'rest' && cull) {
					const sleeptalk = movePool.indexOf('sleeptalk');
					if (sleeptalk >= 0) {
						if (movePool.length < 2) {
							cull = false;
						} else {
							this.fastPop(movePool, sleeptalk);
						}
					}
				}

				// Remove rejected moves from the move list
				if (cull && movePool.length) {
					if (moveid.startsWith('hiddenpower')) hasHiddenPower = false;
					if (move.category !== 'Status' && !move.damage) rejectedPool.push(moveid);
					moves.delete(moveid);
					break;
				}
				if (cull && rejectedPool.length) {
					if (moveid.startsWith('hiddenpower')) hasHiddenPower = false;
					moves.delete(moveid);
					break;
				}
			}
		} while (moves.size < this.maxMoveCount && (movePool.length || rejectedPool.length));

		// for BD/SP only
		if (hasHiddenPower) {
			let hpType;
			for (const move of moves) {
				if (move.startsWith('hiddenpower')) hpType = move.substr(11);
			}
			if (!hpType) throw new Error(`hasHiddenPower is true, but no Hidden Power move was found.`);
			const HPivs = this.dex.types.get(hpType).HPivs;
			let iv: StatID;
			for (iv in HPivs) {
				ivs[iv] = HPivs[iv]!;
			}
		}

		ability = this.getAbility(types, moves, abilities, counter, movePool, teamDetails, species);

		if (species.requiredItems) {
			item = this.sample(species.requiredItems);
		// First, the extra high-priority items
		} else {
			item = this.getHighPriorityItem(ability, types, moves, counter, teamDetails, species, isLead);
			if (item === undefined) {
				item = this.getMediumPriorityItem(ability, moves, counter, species, isLead);
			}
			if (item === undefined) {
				item = this.getLowPriorityItem(
					ability, types, moves, abilities, counter, teamDetails, species, isLead
				);
			}

			// fallback
			if (item === undefined) item = 'Leftovers';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && types.has('Poison')) {
			item = 'Black Sludge';
		}

		const level: number = this.getLevel(species);

		// Prepare optimal HP
		const srImmunity = ability === 'Magic Guard' || item === 'Heavy-Duty Boots';
		const srWeakness = srImmunity ? 0 : this.dex.getEffectiveness('Rock', species);
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			const multipleOfFourNecessary = (moves.has('substitute') && !['Leftovers', 'Black Sludge'].includes(item) && (
				item === 'Sitrus Berry' ||
				item === 'Salac Berry' ||
				ability === 'Power Construct'
			));
			if (multipleOfFourNecessary) {
				// Two Substitutes should activate Sitrus Berry
				if (hp % 4 === 0) break;
			} else if (moves.has('bellydrum') && (item === 'Sitrus Berry' || ability === 'Gluttony')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else if (moves.has('substitute') && moves.has('reversal')) {
				// Reversal users should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || hp % (4 / srWeakness) > 0) break;
			}
			evs.hp -= 4;
		}

		if (moves.has('shellsidearm') && item === 'Choice Specs') evs.atk -= 8;

		// Minimize confusion damage
		const noAttackStatMoves = [...moves].every(m => {
			const move = this.dex.moves.get(m);
			if (move.damageCallback || move.damage) return true;
			return move.category !== 'Physical' || move.id === 'bodypress';
		});
		if (
			noAttackStatMoves && !moves.has('transform') && (!moves.has('shellsidearm') || !counter.get('Status')) &&
			!ruleTable.has('forceofthefallenmod')
		) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		// Ensure Nihilego's Beast Boost gives it Special Attack boosts instead of Special Defense
		if (forme === 'Nihilego') evs.spd -= 32;

		if (moves.has('gyroball') || moves.has('trickroom')) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);
		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.gender || (this.random(2) ? 'F' : 'M'),
			shiny: this.randomChance(1, 1024),
			gigantamax: gmax,
			level,
			moves: shuffledMoves,
			ability,
			evs,
			ivs,
			item,
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

	randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.getSeed();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const typePool = this.dex.types.names();
		const type = this.forceMonotype || this.sample(typePool);

		// PotD stuff
		const usePotD = global.Config && Config.potd && ruleTable.has('potd');
		const potd = usePotD ? this.dex.species.get(Config.potd) : null;

		const baseFormes: { [k: string]: number } = {};

		const typeCount: { [k: string]: number } = {};
		const typeComboCount: { [k: string]: number } = {};
		const typeWeaknesses: { [k: string]: number } = {};
		const typeDoubleWeaknesses: { [k: string]: number } = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};
		let numMaxLevelPokemon = 0;

		const pokemonList = [];
		for (const poke of Object.keys(this.randomData)) {
			if (this.randomData[poke]?.moves) {
				pokemonList.push(poke);
			}
		}
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
			let species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			const types = species.types;
			const typeCombo = types.slice().sort().join();
			const weakToFreezeDry = (
				this.dex.getEffectiveness('Ice', species) > 0 ||
				(this.dex.getEffectiveness('Ice', species) > -2 && types.includes('Water'))
			);
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			if (!isMonotype && !this.forceMonotype) {
				let skip = false;

				// Limit two of any type
				for (const typeName of types) {
					if (typeCount[typeName] >= 2 * limitFactor) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit three weak to any type, and one double weak to any type
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
						if (typeWeaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
					if (this.dex.getEffectiveness(typeName, species) > 1) {
						if (!typeDoubleWeaknesses[typeName]) typeDoubleWeaknesses[typeName] = 0;
						if (typeDoubleWeaknesses[typeName] >= limitFactor) {
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;

				// Count Dry Skin/Fluffy as Fire weaknesses
				if (
					this.dex.getEffectiveness('Fire', species) === 0 &&
					Object.values(species.abilities).filter(a => ['Dry Skin', 'Fluffy'].includes(a)).length
				) {
					if (!typeWeaknesses['Fire']) typeWeaknesses['Fire'] = 0;
					if (typeWeaknesses['Fire'] >= 3 * limitFactor) continue;
				}

				// Limit four weak to Freeze-Dry
				if (weakToFreezeDry) {
					if (!typeWeaknesses['Freeze-Dry']) typeWeaknesses['Freeze-Dry'] = 0;
					if (typeWeaknesses['Freeze-Dry'] >= 4 * limitFactor) continue;
				}

				// Limit one level 100 Pokemon
				if (!this.adjustLevel && (this.getLevel(species) === 100) && numMaxLevelPokemon >= limitFactor) {
					continue;
				}
			}

			// Limit three of any type combination in Monotype
			if (!this.forceMonotype && isMonotype && (typeComboCount[typeCombo] >= 3 * limitFactor)) continue;

			// The Pokemon of the Day
			if (potd?.exists && (pokemon.length === 1 || this.maxTeamSize === 1)) species = potd;

			const set = this.randomSet(species, teamDetails, pokemon.length === 0);

			// Okay, the set passes, add it to our team
			pokemon.push(set);
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
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails.rain = 1;
			if (set.ability === 'Drought' || set.moves.includes('sunnyday')) teamDetails.sun = 1;
			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.ability === 'Snow Warning') teamDetails.hail = 1;
			if (set.moves.includes('spikes')) teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			if (set.moves.includes('stealthrock')) teamDetails.stealthRock = 1;
			if (set.moves.includes('stickyweb')) teamDetails.stickyWeb = 1;
			if (set.moves.includes('toxicspikes')) teamDetails.toxicSpikes = 1;
			if (set.moves.includes('defog')) teamDetails.defog = 1;
			if (set.moves.includes('rapidspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('auroraveil') || (set.moves.includes('reflect') && set.moves.includes('lightscreen'))) {
				teamDetails.screens = 1;
			}
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) { // large teams sometimes cannot be built
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}
		return pokemon;
	}
}

export default RandomBDSPTeams;
