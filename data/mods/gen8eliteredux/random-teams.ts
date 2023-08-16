import {Dex, toID} from '../../../sim/dex';
import {Utils} from '../../../lib';
import {PRNG, PRNGSeed} from '../../../sim/prng';
import {RuleTable} from '../../../sim/dex-formats';
import {Tags} from './../../tags';

export interface TeamData {
	typeCount: {[k: string]: number};
	typeComboCount: {[k: string]: number};
	baseFormes: {[k: string]: number};
	megaCount?: number;
	zCount?: number;
	has: {[k: string]: number};
	forceResult: boolean;
	weaknesses: {[k: string]: number};
	resistances: {[k: string]: number};
	weather?: string;
	eeveeLimCount?: number;
	// gigantamax?: boolean;
}
export interface BattleFactorySpecies {
	flags: {limEevee?: 1};
	sets: BattleFactorySet[];
}
export interface OldRandomBattleSpecies {
	level?: number;
	moves?: ID[];
	doublesLevel?: number;
	doublesMoves?: ID[];
	noDynamaxMoves?: ID[];
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
export class MoveCounter extends Utils.Multiset<string> {
	damagingMoves: Set<Move>;
	setupType: string;

	constructor() {
		super();
		this.damagingMoves = new Set();
		this.setupType = '';
	}

	get(key: string): number {
		return super.get(key) || 0;
	}
}

type MoveEnforcementChecker = (
	movePool: string[], moves: Set<string>, abilities: Set<string>, types: Set<string>,
	counter: MoveCounter, species: Species, teamDetails: RandomTeamsTypes.TeamDetails
) => boolean;

// Moves that restore HP:
const RecoveryMove = [
	'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'strengthsap', 'synthesis',
];
// Moves that drop stats:
const ContraryMoves = [
	'closecombat', 'leafstorm', 'overheat', 'superpower', 'vcreate', 'strength'
];
// Moves that boost Attack:
const PhysicalSetup = [
	'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'honeclaws', 'howl', 'meditate', 'poweruppunch', 'screech', 'swordsdance',
];
// Moves which boost Special Attack:
const SpecialSetup = [
	'calmmind', 'chargebeam', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow',
];
// Moves that boost Attack AND Special Attack:
const MixedSetup = [
	'clangoroussoul', 'growth', 'happyhour', 'holdhands', 'noretreat', 'shellsmash', 'workup',
];
// Some moves that only boost Speed:
const SpeedSetup = [
	'agility', 'autotomize', 'flamecharge', 'rockpolish',
];
// Moves that shouldn't be the only STAB moves:
const NoStab = [
	'accelerock', 'aquajet', 'beakblast', 'bounce', 'breakingswipe', 'chatter', 'clearsmog', 'dragontail', 'eruption', 'explosion',
	'fakeout', 'firstimpression', 'flamecharge', 'flipturn', 'iceshard', 'icywind', 'incinerate', 'machpunch',
	'meteorbeam', 'pluck', 'pursuit', 'quickattack', 'reversal', 'selfdestruct', 'skydrop', 'snarl', 'suckerpunch', 'uturn', 'watershuriken',
	'vacuumwave', 'voltswitch', 'waterspout',
];
// Hazard-setting moves
const Hazards = [
	'spikes', 'stealthrock', 'stickyweb', 'toxicspikes',
];

function sereneGraceBenefits(move: Move) {
	return move.secondary?.chance && move.secondary.chance >= 20 && move.secondary.chance < 100;
}

export class RandomGen8ERTeams {
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

	randomData: {[species: string]: OldRandomBattleSpecies} = require('./random-data.json');

	/**
	 * Checkers for move enforcement based on a Pokémon's types or other factors
	 *
	 * returns true to reject one of its other moves to try to roll the forced move, false otherwise.
	 */
	moveEnforcementCheckers: {[k: string]: MoveEnforcementChecker};

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		format = Dex.formats.get(format);
		this.dex = Dex.forFormat(format);
		this.gen = this.dex.gen;
		this.noStab = NoStab;

		const ruleTable = Dex.formats.getRuleTable(format);
		this.maxTeamSize = ruleTable.maxTeamSize;
		this.adjustLevel = ruleTable.adjustLevel;
		this.maxMoveCount = ruleTable.maxMoveCount;
		const forceMonotype = ruleTable.valueRules.get('forcemonotype');
		this.forceMonotype = forceMonotype && this.dex.types.get(forceMonotype).exists ?
			this.dex.types.get(forceMonotype).name : undefined;

		this.factoryTier = '';
		this.format = format;
		this.prng = prng && !Array.isArray(prng) ? prng : new PRNG(prng);

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
			Bug: (movePool) => ['megahorn', 'guillotine'].some(m => movePool.includes(m)),
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
				return abilities.has('Snow Warning') && movePool.includes('blizzard');
			},
			Normal: (movePool, moves, abilities, types, counter) => (
				(abilities.has('Guts') && movePool.includes('facade')) || (abilities.has('Pixilate') && !counter.get('Normal'))
			),
			Poison: (movePool, moves, abilities, types, counter) => {
				if (counter.get('Poison')) return false;
				return types.has('Ground') || types.has('Psychic') || types.has('Grass') || !!counter.setupType || movePool.includes('gunkshot');
			},
			Psychic: (movePool, moves, abilities, types, counter) => {
				if (counter.get('Psychic')) return false;
				if (types.has('Ghost') || types.has('Steel')) return false;
				return abilities.has('Psychic Surge') || !!counter.setupType || movePool.includes('psychicfangs');
			},
			Rock: (movePool, moves, abilities, types, counter, species) => !counter.get('Rock') && species.baseStats.atk >= 80,
			Steel: (movePool, moves, abilities, types, counter, species) => {
				if (species.baseStats.atk < 95) return false;
				if (['meteormash', 'excalibur'].some(m => movePool.includes(m))) return true;
				return !counter.get('Steel');
			},
			Water: (movePool, moves, abilities, types, counter, species) => {
				if (!counter.get('Water') && !moves.has('hypervoice')) return true;
				if (['hypervoice', 'liquidation', 'surgingstrikes', 'aquafang', 'wavecrash'].some(m => movePool.includes(m))) return true;
				return abilities.has('Huge Power') && movePool.includes('aquajet');
			},
		};
	}
	setSeed(prng?: PRNG | PRNGSeed) {
		this.prng = prng && !Array.isArray(prng) ? prng : new PRNG(prng);
	}

	getTeam(options?: PlayerOptions | null): PokemonSet[] {
		const generatorName = (
			typeof this.format.team === 'string' && this.format.team.startsWith('random')
		 ) ? this.format.team + 'Team' : '';
		// @ts-ignore
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
		return this.prng.next(m, n);
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

	unrejectableMovesInSingles(move: Move) {
		// These moves cannot be rejected in favor of a forced move in singles
		return (move.category !== 'Status' || !move.flags.heal) && ![
			'facade', 'leechseed', 'lightscreen', 'reflect', 'sleeptalk', 'spore', 'substitute', 'switcheroo',
			'teleport', 'toxic', 'trick',
		].includes(move.id);
	}

	unrejectableMovesInDoubles(move: Move) {
		// These moves cannot be rejected in favor of a forced move in doubles
		return move.id !== 'bodypress';
	}

	randomCCTeam(): RandomTeamsTypes.RandomSet[] {
		const dex = this.dex;
		const team = [];

		const natures = this.dex.natures.all();
		const items = this.dex.items.all();

		const randomN = this.randomNPokemon(this.maxTeamSize, this.forceMonotype, undefined, undefined, true);

		for (let forme of randomN) {
			let species = dex.species.get(forme);
			if (species.isNonstandard) species = dex.species.get(species.baseSpecies);

			let item = '';
			if (this.gen >= 2) {
				do {
					item = this.sample(items).name;
				} while (this.dex.items.get(item).gen > this.gen || this.dex.items.get(item).isNonstandard);
			}
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


			const abilities = Object.values(species.abilities).filter(a => this.dex.abilities.get(a).gen <= this.gen);
			//Ensure that innates are not picked as ability
			const ability: string = this.gen <= 2 ? 'No Ability' : this.sample(abilities.filter(key => !key.includes('I')));
			// Four random unique moves from the movepool
			let pool = ['struggle'];
			if (forme === 'Smeargle') {
				pool = this.dex.moves
					.all()
					.filter(move => !(move.isNonstandard || move.isZ || move.isMax || move.realMove))
					.map(m => m.id);
			} else {
				const formes = ['gastrodoneast', 'pumpkaboosuper', 'zygarde10'];
				let learnset = this.dex.species.getLearnset(species.id);
				if (formes.includes(species.id) || !learnset) {
					learnset = this.dex.species.getLearnset(this.dex.species.get(species.baseSpecies).id);
				}
				if (learnset) {
					pool = Object.keys(learnset).filter(
						moveid => learnset![moveid].find(learned => learned.startsWith(String(this.gen)))
					);
				}
				if (species.changesFrom) {
					learnset = this.dex.species.getLearnset(toID(species.changesFrom));
					const basePool = Object.keys(learnset!).filter(
						moveid => learnset![moveid].find(learned => learned.startsWith(String(this.gen)))
					);
					pool = [...new Set(pool.concat(basePool))];
				}
			}

			const moves = this.multipleSamplesNoReplace(pool, this.maxMoveCount);

			// Random EVs
			const evs: StatsTable = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
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
				set.teraType = this.sample(this.dex.types.all()).name;
			}
			team.push(set);
		}
		return team;
	}

	randomNPokemon(n: number, requiredType?: string, minSourceGen?: number, ruleTable?: RuleTable, requireMoves = false) {
		// Picks `n` random pokemon--no repeats, even among formes
		// Also need to either normalize for formes or select formes at random
		// Unreleased are okay but no CAP
		const last = [0, 151, 251, 386, 493, 649, 721, 807, 898, 1010][this.gen];

		if (n <= 0 || n > last) throw new Error(`n must be a number between 1 and ${last} (got ${n})`);
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
					const hasMovesInCurrentGen = Object.values(this.dex.species.getLearnset(species.id) || {})
						.some(sources => sources.some(source => source.startsWith('9')));
					if (!hasMovesInCurrentGen) continue;
				}
				if (requiredType && !species.types.includes(requiredType)) continue;
				if (minSourceGen && species.gen < minSourceGen) continue;
				const num = species.num;
				if (num <= 0 || pool.includes(num)) continue;
				if (num > last) break;
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
							const tagid = ruleid.slice(12);
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

		const hasDexNumber: {[k: string]: number} = {};
		for (let i = 0; i < n; i++) {
			const num = this.sampleNoReplace(pool);
			hasDexNumber[num] = i;
		}

		const formes: string[][] = [];
		for (const species of speciesPool) {
			if (!(species.num in hasDexNumber)) continue;
			if (isNotCustom && (species.gen > this.gen ||
				(species.isNonstandard && species.isNonstandard !== 'Unobtainable'))) continue;
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
				(move.gen <= this.gen && !move.isNonstandard && !move.name.startsWith('Hidden Power ')));
		} else {
			const hasAllMovesBan = ruleTable.check('pokemontag:allmoves');
			for (const move of this.dex.moves.all()) {
				// Legality of specific HP types can't be altered in built formats anyway
				if (move.name.startsWith('Hidden Power ')) continue;
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
			if (doItemsExist) {
				itemData = this.sampleNoReplace(itemPool);
				item = itemData?.name;
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
			const evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
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
				set.teraType = this.sample(this.dex.types.all()).name;
			}
			team.push(set);
		}

		return team;
	}

	queryMoves(
		moves: Set<string> | null,
		types: string[],
		abilities: Set<string> = new Set(),
		movePool: string[] = []
	): MoveCounter {
		// This is primarily a helper function for random setbuilder functions.
		const counter = new MoveCounter();

		if (!moves?.size) return counter;

		const categories = {Physical: 0, Special: 0, Status: 0};

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

			//Moves that have an extremly low base power (including rapid spin):
			if (move.basePower && move.basePower <= 25) {
				counter.add('perfectionist');
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
					(moveType === 'Normal' && (['Aerilate', 'Galvanize', 'Pixilate', 'Refrigerate', 'Burnate', 'Crystallize', 'Fighting Spirit', 'Groundate', 'Hydrate', 'Poisonate', 'Buginize', 'Solar Flare'].some(abil => abilities.has(abil)))) ||
					(move.priority === 0 && (abilities.has('Libero') || abilities.has('Protean')) && !this.noStab.includes(moveid)) ||
					(moveType === 'Steel' && abilities.has('Steelworker')) || 
					(abilities.has('Mystic Power'))
				) {
					counter.add('stab');
				}

				if (move.flags['bite']) counter.add('strongjaw');
				if (move.flags['punch']) counter.add('ironfist');
				if (move.flags['sound']) counter.add('sound');
				if (move.flags['slicing']) counter.add('slicing');
				if (move.flags['kick']) counter.add('kick');
				if (move.flags['bone']) counter.add('bone');
				if (move.flags['wind']) counter.add ('wind');
				if (move.priority !== 0 || (moveid === 'grassyglide' && abilities.has('Grassy Surge'))) {
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
			if (RecoveryMove.includes(moveid)) counter.add('recovery');
			if (ContraryMoves.includes(moveid)) counter.add('contrary');
			if (PhysicalSetup.includes(moveid)) {
				counter.add('physicalsetup');
				counter.setupType = 'Physical';
			} else if (SpecialSetup.includes(moveid)) {
				counter.add('specialsetup');
				counter.setupType = 'Special';
			}

			if (MixedSetup.includes(moveid)) counter.add('mixedsetup');
			if (SpeedSetup.includes(moveid)) counter.add('speedsetup');
			if (Hazards.includes(moveid)) counter.add('hazards');
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
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		isNoDynamax: boolean,
	): {cull: boolean, isSetup?: boolean} {
		if (isDoubles && species.baseStats.def >= 140 && movePool.includes('bodypress')) {
			// In Doubles, Pokémon with Defense stats >= 140 should always have body press
			return {cull: true};
		}
		if (
			(species.id === 'doublade' && movePool.includes('swordsdance')) ||
			(species.id === 'entei' && movePool.includes('extremespeed')) ||
			(species.id === 'genesectdouse' && movePool.includes('technoblast')) ||
			(species.id === 'golisopod' && movePool.includes('leechlife') && movePool.includes('firstimpression'))
		) {
			// Entei should always have Extreme Speed, and Genesect-Douse should always have Techno Blast
			// Golisopod should always have one of its bug moves (Leech Life or First Impression)
			return {cull: true};
		}

		const hasRestTalk = moves.has('rest') && moves.has('sleeptalk');

		// Reject moves that need support
		switch (move.id) {
		case 'acrobatics': case 'junglehealing':
			// Special case to prevent lead Acrobatics Rillaboom
			return {cull: (species.id.startsWith('rillaboom') && isLead) || (!isDoubles && !counter.setupType)};
		case 'dualwingbeat': case 'fly':
			return {cull: !types.has(move.type) && !counter.setupType && !!counter.get('Status')};
		case 'healbell':
			return {cull: movePool.includes('protect') || movePool.includes('wish')};
		case 'fireblast':
			// Special case for Togekiss, which always wants Aura Sphere
			return {cull: abilities.has('Serene Grace') && (!moves.has('trick') || counter.get('Status') > 1)};
		case 'firepunch':
			// Special case for Darmanitan-Zen-Galar, which doesn't always want Fire Punch
			return {cull: movePool.includes('bellydrum') || (moves.has('earthquake') && movePool.includes('substitute'))};
		case 'flamecharge':
			return {cull: movePool.includes('swordsdance')};
		case 'hypervoice':
			// Special case for Heliolisk, which always wants Thunderbolt
			return {cull: types.has('Electric') && movePool.includes('thunderbolt')};
		case 'payback': case 'psychocut':
			// Special case for Type: Null and Malamar, which don't want these + RestTalk
			return {cull: !counter.get('Status') || hasRestTalk};
		case 'rest':
			const bulkySetup = !moves.has('sleeptalk') && ['bulkup', 'calmmind', 'coil', 'curse'].some(m => movePool.includes(m));
			// Registeel would otherwise get Curse sets without Rest, which are very bad generally
			return {cull: species.id !== 'registeel' && (movePool.includes('sleeptalk') || bulkySetup)};
		case 'sleeptalk':
			if (!moves.has('rest')) return {cull: true};
			if (movePool.length > 1 && !abilities.has('Contrary')) {
				const rest = movePool.indexOf('rest');
				if (rest >= 0) this.fastPop(movePool, rest);
			}
			break;
		case 'storedpower':
			return {cull: !counter.setupType};
		case 'switcheroo': case 'trick':
			return {cull: counter.get('Physical') + counter.get('Special') < 3 || moves.has('rapidspin')};
		case 'trickroom':
			const webs = !!teamDetails.stickyWeb;
			return {cull:
				isLead || webs || !!counter.get('speedsetup') ||
				counter.damagingMoves.size < 2 || movePool.includes('nastyplot'),
			};
		case 'zenheadbutt':
			// Special case for Victini, which should prefer Bolt Strike to Zen Headbutt
			return {cull: movePool.includes('boltstrike') || (species.id === 'eiscue' && moves.has('substitute'))};

		// Set up once and only if we have the moves for it
		case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
			if (counter.setupType !== 'Physical') return {cull: true}; // if we're not setting up physically this is pointless
			if (counter.get('Physical') + counter.get('physicalpool') < 2 && !hasRestTalk) return {cull: true};

			// First Impression + setup is undesirable in Doubles
			if (isDoubles && moves.has('firstimpression')) return {cull: true};
			if (move.id === 'swordsdance' && moves.has('dragondance')) return {cull: true}; // Dragon Dance is judged as better

			return {cull: false, isSetup: true};
		case 'calmmind': case 'nastyplot':
			if (species.id === 'togekiss') return {cull: false};
			if (counter.setupType !== 'Special') return {cull: true};
			if (
				(counter.get('Special') + counter.get('specialpool')) < 2 &&
				!hasRestTalk &&
				!(moves.has('wish') && moves.has('protect'))
			) return {cull: true};
			if (moves.has('healpulse') || move.id === 'calmmind' && moves.has('trickroom')) return {cull: true};
			return {cull: false, isSetup: true};
		case 'quiverdance':
			return {cull: false, isSetup: true};
		case 'clangoroussoul': case 'shellsmash': case 'workup':
			if (counter.setupType !== 'Mixed') return {cull: true};
			if (counter.damagingMoves.size + counter.get('physicalpool') + counter.get('specialpool') < 2) return {cull: true};
			return {cull: false, isSetup: true};
		case 'agility': case 'autotomize': case 'rockpolish': case 'shiftgear':
			if (counter.damagingMoves.size < 2 || moves.has('rest')) return {cull: true};
			if (movePool.includes('calmmind') || movePool.includes('nastyplot')) return {cull: true};
			return {cull: false, isSetup: !counter.setupType};

		// Bad after setup
		case 'coaching': case 'counter': case 'reversal':
			// Counter: special case for Alakazam, which doesn't want Counter + Nasty Plot
			return {cull: !!counter.setupType};
		case 'bulletpunch': case 'extremespeed': case 'rockblast':
			return {cull: (
				!!counter.get('speedsetup') ||
				(!isDoubles && moves.has('dragondance')) ||
				counter.damagingMoves.size < 2
			)};
		case 'closecombat': case 'flashcannon': case 'pollenpuff':
			const substituteCullCondition = (
				(moves.has('substitute') && !types.has('Fighting')) ||
				(moves.has('toxic') && movePool.includes('substitute'))
			);
			const preferHJKOverCCCullCondition = (
				move.id === 'closecombat' &&
				!counter.setupType &&
				(moves.has('highjumpkick') || movePool.includes('highjumpkick'))
			);
			return {cull: substituteCullCondition || preferHJKOverCCCullCondition};
		case 'defog':
			return {cull: !!counter.setupType || moves.has('healbell') || moves.has('toxicspikes') || !!teamDetails.defog};
		case 'fakeout':
			return {cull: !!counter.setupType || ['protect', 'rapidspin', 'substitute', 'uturn'].some(m => moves.has(m))};
		case 'firstimpression': case 'glare': case 'icywind': case 'tailwind': case 'waterspout':
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || moves.has('rest')};
		case 'healingwish': case 'memento':
			return {cull: !!counter.setupType || !!counter.get('recovery') || moves.has('substitute') || moves.has('uturn')};
		case 'highjumpkick':
			// Special case for Hitmonlee to prevent non-Unburden Curse
			return {cull: moves.has('curse')};
		case 'partingshot':
			return {cull: !!counter.get('speedsetup') || moves.has('bulkup') || moves.has('uturn')};
		case 'protect':
			if (!isDoubles && ((counter.setupType && !moves.has('wish')) || moves.has('rest'))) return {cull: true};
			if (
				!isDoubles &&
				counter.get('Status') < 2 &&
				['Hunger Switch', 'Speed Boost', 'Moody'].every(m => !abilities.has(m))
			) return {cull: true};
			if (movePool.includes('leechseed') || (movePool.includes('toxic') && !moves.has('wish'))) return {cull: true};
			if (isDoubles && (
				['bellydrum', 'fakeout', 'shellsmash', 'spore'].some(m => movePool.includes(m)) ||
				moves.has('tailwind') || moves.has('waterspout') || counter.get('recovery')
			)) return {cull: true};
			return {cull: false};
		case 'rapidspin':
			const setup = ['curse', 'nastyplot', 'shellsmash'].some(m => moves.has(m));
			return {cull: !!teamDetails.rapidSpin || setup || (!!counter.setupType && counter.get('Fighting') >= 2)};
		case 'shadowsneak':
			const sneakIncompatible = ['substitute', 'trickroom', 'dualwingbeat', 'toxic'].some(m => moves.has(m));
			return {cull: hasRestTalk || sneakIncompatible || counter.setupType === 'Special'};
		case 'spikes':
			return {cull: !!counter.setupType || (!!teamDetails.spikes && teamDetails.spikes > 1)};
		case 'stealthrock':
			return {cull:
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				!!teamDetails.stealthRock ||
				['rest', 'substitute', 'trickroom', 'teleport'].some(m => moves.has(m)) ||
				(species.id === 'palossand' && movePool.includes('shoreup')),
			};
		case 'stickyweb':
			return {cull: counter.setupType === 'Special' || !!teamDetails.stickyWeb};
		case 'taunt':
			return {cull: moves.has('encore') || moves.has('nastyplot') || moves.has('swordsdance')};
		case 'thunderwave': case 'voltswitch':
			const cullInDoubles = isDoubles && (moves.has('electroweb') || moves.has('nuzzle'));
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				moves.has('shiftgear') ||
				moves.has('raindance') ||
				cullInDoubles
			)};
		case 'toxic':
			return {cull: !!counter.setupType || ['sludgewave', 'thunderwave', 'willowisp'].some(m => moves.has(m))};
		case 'toxicspikes':
			return {cull: !!counter.setupType || !!teamDetails.toxicSpikes};
		case 'uturn':
			const bugSwordsDanceCase = types.has('Bug') && counter.get('recovery') && moves.has('swordsdance');
			return {cull: (
				!!counter.get('speedsetup') ||
				(counter.setupType && !bugSwordsDanceCase) ||
				(isDoubles && moves.has('leechlife')) ||
				moves.has('shiftgear')
			)};

		/**
		 * Ineffective to have both moves together
		 *
		 * These are sorted in order of:
		 * Normal>Fire>Water>Electric>Grass>Ice>Fighting>Poison>Ground>Flying>Psychic>Bug>Rock>Ghost>Dragon>Dark>Fairy
		 * and then subsorted alphabetically.
		 * This type order is arbitrary and referenced from https://pokemondb.net/type.
		 */
		case 'explosion':
			// Rock Blast: Special case for Gigalith to prevent Stone Edge-less Choice Band sets
			const otherMoves = ['curse', 'stompingtantrum', 'rockblast', 'painsplit', 'wish'].some(m => moves.has(m));
			return {cull: !!counter.get('speedsetup') || !!counter.get('recovery') || otherMoves};
		case 'facade':
			// Special case for Snorlax
			return {cull: movePool.includes('doubleedge')};
		case 'quickattack':
			// Diggersby wants U-turn on Choiced sets
			const diggersbyCull = counter.get('Physical') > 3 && movePool.includes('uturn');
			return {cull: !!counter.get('speedsetup') || (types.has('Rock') && !!counter.get('Status')) || diggersbyCull};
		case 'blazekick':
			return {cull: species.id === 'genesect' && counter.get('Special') >= 1};
		case 'blueflare':
			return {cull: moves.has('vcreate')};
		case 'firefang': case 'flamethrower':
			// Fire Fang: Special case for Garchomp, which doesn't want Fire Fang w/o Swords Dance
			const otherFireMoves = ['heatwave', 'overheat'].some(m => moves.has(m));
			return {cull: (moves.has('fireblast') && counter.setupType !== 'Physical') || otherFireMoves};
		case 'flareblitz':
			// Special case for Solgaleo to prevent Flame Charge + Flare Blitz
			return {cull: species.id === 'solgaleo' && moves.has('flamecharge')};
		case 'overheat':
			return {cull: moves.has('flareblitz') || (isDoubles && moves.has('calmmind'))};
		case 'aquatail': case 'flipturn':
			return {cull: moves.has('aquajet') || !!counter.get('Status')};
		case 'hydropump':
			return {cull: moves.has('scald') && (
				(counter.get('Special') < 4 && !moves.has('uturn')) ||
				(species.types.length > 1 && counter.get('stab') < 3)
			)};
		case 'muddywater':
			return {cull: moves.has('liquidation')};
		case 'scald':
			// Special case for Clawitzer
			return {cull: moves.has('waterpulse')};
		case 'thunderbolt':
			// Special case for Goodra, which only wants one move to hit Water-types
			return {cull: moves.has('powerwhip')};
		case 'energyball':
			// Special case to prevent Shiinotic with four Grass moves and no Moonblast
			return {cull: species.id === 'shiinotic' && !moves.has('moonblast')};
		case 'gigadrain':
			// Celebi always wants Leaf Storm on its more pivoting-focused non-Nasty Plot sets
			const celebiPreferLeafStorm = species.id === 'celebi' && !counter.setupType && moves.has('uturn');
			return {cull: celebiPreferLeafStorm || (types.has('Poison') && !counter.get('Poison'))};
		case 'leafblade':
			// Special case for Virizion to prevent Leaf Blade on Assault Vest sets
			return {cull: (moves.has('leafstorm') || movePool.includes('leafstorm')) && counter.setupType !== 'Physical'};
		case 'leafstorm':
			const leafBladePossible = movePool.includes('leafblade') || moves.has('leafblade');
			return {cull:
				// Virizion should always prefer Leaf Blade to Leaf Storm on Physical sets
				(counter.setupType === 'Physical' && (species.id === 'virizion' || leafBladePossible)) ||
				(moves.has('gigadrain') && !!counter.get('Status')) ||
				(isDoubles && moves.has('energyball')),
			};
		case 'powerwhip':
			// Special case for Centiskorch, which doesn't want Assault Vest
			return {cull: moves.has('leechlife')};
		case 'woodhammer':
			return {cull: moves.has('hornleech') && counter.get('Physical') < 4};
		case 'freezedry':
			const betterIceMove = (
				(moves.has('blizzard') && !!counter.setupType) ||
				(moves.has('icebeam') && counter.get('Special') < 4)
			);
			const preferThunderWave = movePool.includes('thunderwave') && types.has('Electric');
			return {cull: betterIceMove || preferThunderWave || movePool.includes('bodyslam')};
		case 'bodypress':
			// Turtonator never wants Earthquake + Body Press, and wants EQ+Smash or Press+No Smash
			const turtonatorPressCull = species.id === 'turtonator' && moves.has('earthquake') && movePool.includes('shellsmash');
			const pressIncompatible = ['shellsmash', 'mirrorcoat', 'whirlwind'].some(m => moves.has(m));
			return {cull: turtonatorPressCull || pressIncompatible || counter.setupType === 'Special'};
		case 'circlethrow':
			// Part of a special case for Throh to pick one specific Fighting move depending on its set
			return {cull: moves.has('stormthrow') && !moves.has('rest')};
		case 'drainpunch':
			return {cull: moves.has('closecombat') || (!types.has('Fighting') && movePool.includes('swordsdance'))};
		case 'dynamicpunch': case 'thunderouskick':
			// Dynamic Punch: Special case for Machamp to better split Guts and No Guard sets
			return {cull: moves.has('closecombat') || moves.has('facade')};
		case 'focusblast':
			// Special cases for Blastoise and Regice; Blastoise wants Shell Smash, and Regice wants Thunderbolt
			return {cull: movePool.includes('shellsmash') || hasRestTalk};
		case 'hammerarm':
			// Special case for Kangaskhan, which always wants Sucker Punch
			return {cull: moves.has('fakeout')};
		case 'stormthrow':
			// Part of a special case for Throh to pick one specific Fighting move depending on its set
			return {cull: hasRestTalk};
		case 'superpower':
			return {
				cull: moves.has('hydropump') ||
					(counter.get('Physical') >= 4 && movePool.includes('uturn')) ||
					(moves.has('substitute') && !abilities.has('Contrary')),
				isSetup: abilities.has('Contrary'),
			};
		case 'poisonjab':
			return {cull: !types.has('Poison') && counter.get('Status') >= 2};
		case 'earthquake':
			const doublesCull = moves.has('earthpower') || moves.has('highhorsepower');
			// Turtonator wants Body Press when it doesn't have Shell Smash
			const turtQuakeCull = species.id === 'turtonator' && movePool.includes('bodypress') && movePool.includes('shellsmash');
			const subToxicPossible = moves.has('substitute') && movePool.includes('toxic');
			return {cull: turtQuakeCull || (isDoubles && doublesCull) || subToxicPossible || moves.has('bonemerang')};
		case 'scorchingsands':
			// Special cases for Ninetales and Palossand; prevents status redundancy
			return {cull: (
				moves.has('willowisp') ||
				moves.has('earthpower') ||
				(moves.has('toxic') && movePool.includes('earthpower'))
			)};
		case 'airslash':
			return {cull:
				(species.id === 'naganadel' && moves.has('nastyplot')) ||
				hasRestTalk ||
				(abilities.has('Simple') && !!counter.get('recovery')) ||
				counter.setupType === 'Physical',
			};
		case 'bravebird':
			// Special case for Mew, which only wants Brave Bird with Swords Dance
			return {cull: moves.has('dragondance')};
		case 'hurricane':
			return {cull: counter.setupType === 'Physical'};
		case 'futuresight':
			return {cull: moves.has('psyshock') || moves.has('trick') || movePool.includes('teleport')};
		case 'photongeyser':
			// Special case for Necrozma-DM, which always wants Dragon Dance
			return {cull: moves.has('morningsun')};
		case 'psychic':
			const alcremieCase = species.id === 'alcremiegmax' && counter.get('Status') < 2;
			return {cull: alcremieCase || (moves.has('psyshock') && (!!counter.setupType || isDoubles))};
		case 'psychicfangs':
			// Special case for Morpeko, which doesn't want 4 attacks Leftovers
			return {cull: moves.has('rapidspin')};
		case 'psyshock':
			// Special case for Sylveon which only wants Psyshock if it gets a Choice item
			const sylveonCase = abilities.has('Pixilate') && counter.get('Special') < 4;
			return {cull: moves.has('psychic') || (!counter.setupType && sylveonCase) || (isDoubles && moves.has('psychic'))};
		case 'bugbuzz':
			return {cull: moves.has('uturn') && !counter.setupType};
		case 'leechlife':
			return {cull:
				(isDoubles && moves.has('lunge')) ||
				(moves.has('uturn') && !counter.setupType) ||
				movePool.includes('spikes'),
			};
		case 'stoneedge':
			const gutsCullCondition = abilities.has('Guts') && (!moves.has('dynamicpunch') || moves.has('spikes'));
			const rockSlidePlusStatusPossible = counter.get('Status') && movePool.includes('rockslide');
			const otherRockMove = moves.has('rockblast') || moves.has('rockslide');
			const lucarioCull = species.id === 'lucario' && !!counter.setupType;
			return {cull: gutsCullCondition || (!isDoubles && rockSlidePlusStatusPossible) || otherRockMove || lucarioCull};
		case 'poltergeist':
			// Special case for Dhelmise in Doubles, which doesn't want both
			return {cull: moves.has('knockoff')};
		case 'shadowball':
			return {cull:
				(isDoubles && moves.has('phantomforce')) ||
				// Special case for Sylveon, which never wants Shadow Ball as its only coverage move
				(abilities.has('Pixilate') && (!!counter.setupType || counter.get('Status') > 1)) ||
				(!types.has('Ghost') && movePool.includes('focusblast')),
			};
		case 'shadowclaw':
			return {cull: types.has('Steel') && moves.has('shadowsneak') && counter.get('Physical') < 4};
		case 'dragonpulse': case 'spacialrend':
			return {cull: moves.has('dracometeor') && counter.get('Special') < 4};
		case 'darkpulse':
			const pulseIncompatible = ['foulplay', 'knockoff'].some(m => moves.has(m)) || (
				species.id === 'shiftry' && (moves.has('defog') || moves.has('suckerpunch'))
			);
			// Special clause to prevent bugged Shiftry sets with Sucker Punch + Nasty Plot
			const shiftryCase = movePool.includes('nastyplot') && !moves.has('defog');
			return {cull: pulseIncompatible && !shiftryCase && counter.setupType !== 'Special'};
		case 'suckerpunch':
			return {cull:
				// Shiftry in No Dynamax would otherwise get Choice Scarf Sucker Punch sometimes.
				(isNoDynamax && species.id === 'shiftry' && moves.has('defog')) ||
				moves.has('rest') ||
				counter.damagingMoves.size < 2 ||
				(counter.setupType === 'Special') ||
				(counter.get('Dark') > 1 && !types.has('Dark')),
			};
		case 'dazzlinggleam':
			return {cull: ['fleurcannon', 'moonblast', 'petaldance'].some(m => moves.has(m))};

		// Status:
		case 'bodyslam': case 'clearsmog':
			const toxicCullCondition = moves.has('toxic') && !types.has('Normal');
			return {cull: moves.has('sludgebomb') || moves.has('trick') || movePool.includes('recover') || toxicCullCondition};
		case 'haze':
			// Special case for Corsola-Galar, which always wants Will-O-Wisp
			return {cull: !teamDetails.stealthRock && (moves.has('stealthrock') || movePool.includes('stealthrock'))};
		case 'hypnosis':
			// Special case for Xurkitree to properly split Blunder Policy and Choice item sets
			return {cull: moves.has('voltswitch')};
		case 'willowisp': case 'yawn':
			// Swords Dance is a special case for Rapidash
			return {cull: moves.has('thunderwave') || moves.has('toxic') || moves.has('swordsdance')};
		case 'painsplit': case 'recover': case 'synthesis':
			return {cull: moves.has('rest') || moves.has('wish') || (move.id === 'synthesis' && moves.has('gigadrain'))};
		case 'roost':
			return {cull:
				moves.has('throatchop') ||
				// Hawlucha doesn't want Roost + 3 attacks
				(moves.has('stoneedge') && species.id === 'hawlucha') ||
				// Special cases for Salamence, Dynaless Dragonite, and Scizor to help prevent sets with poor coverage or no setup.
				(moves.has('dualwingbeat') && (moves.has('outrage') || species.id === 'scizor')),
			};
		case 'reflect': case 'lightscreen':
			return {cull: !!teamDetails.screens};
		case 'slackoff':
			// Special case to prevent Scaldless Slowking
			return {cull: species.id === 'slowking' && !moves.has('scald')};
		case 'substitute':
			const moveBasedCull = ['bulkup', 'nastyplot', 'painsplit', 'roost', 'swordsdance'].some(m => movePool.includes(m));
			// Smaller formes of Gourgeist in Doubles don't want Poltergeist as their only attack
			const doublesGourgeist = isDoubles && movePool.includes('powerwhip');
			// Calyrex wants Substitute + Leech Seed not Calm Mind + Leech Seed
			const calmMindCullCondition = !counter.get('recovery') && movePool.includes('calmmind') && species.id !== 'calyrex';
			// Eiscue wants to always have Liquidation and Belly Drum
			const eiscue = species.id === 'eiscue' && moves.has('zenheadbutt');
			return {cull: moves.has('rest') || moveBasedCull || doublesGourgeist || calmMindCullCondition || eiscue};
		case 'helpinghand':
			// Special case for Shuckle in Doubles, which doesn't want sets with no method to harm foes
			return {cull: moves.has('acupressure')};
		case 'wideguard':
			return {cull: moves.has('protect')};
		case 'grassknot':
			// Special case for Raichu and Heliolisk
			return {cull: moves.has('surf')};
		case 'icepunch':
			// Special case for Marshadow
			return {cull: moves.has('rocktomb')};
		case 'leechseed':
			// Special case for Calyrex to prevent Leech Seed + Calm Mind
			return {cull: !!counter.setupType};
		}
		return {cull: false};
	}

	shouldCullAbility(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isDoubles: boolean,
		isNoDynamax: boolean
	): boolean {
		if ([
			'Flare Boost', 'Hydration', 'Ice Body', 'Immunity', 'Innards Out', 'Insomnia', 'Misty Surge',
			'Perish Body', 'Quick Feet', 'Rain Dish', 'Snow Cloak', 'Steadfast', 'Steam Engine',
		].includes(ability)) return true;

		switch (ability) {
		// Abilities which are primarily useful for certain moves
		case 'Contrary': case 'Serene Grace': case 'Skill Link': case 'Strong Jaw':
			return !counter.get(toID(ability));
		case 'Analytic':
			return (moves.has('rapidspin') || species.nfe || isDoubles);
		case 'Blaze':
			return (isDoubles && abilities.has('Solar Power')) || (!isDoubles && !isNoDynamax && species.id === 'charizard');
		// case 'Bulletproof': case 'Overcoat':
		// 	return !!counter.setupType;
		case 'Chlorophyll':
			return (species.baseStats.spe > 100 || !counter.get('Fire') && !moves.has('sunnyday') && !teamDetails.sun);
		case 'Cloud Nine':
			return (!isNoDynamax || species.id !== 'golduck');
		case 'Competitive':
			return (counter.get('Special') < 2 || (moves.has('rest') && moves.has('sleeptalk')));
		case 'Compound Eyes': case 'No Guard':
			return !counter.get('inaccurate');
		case 'Cursed Body':
			return abilities.has('Infiltrator');
		case 'Defiant':
			return !counter.get('Physical');
		case 'Download':
			return (counter.damagingMoves.size < 3 || moves.has('trick'));
		case 'Early Bird':
			return (types.has('Grass') && isDoubles);
		case 'Flash Fire':
			return (this.dex.getEffectiveness('Fire', species) < -1 || abilities.has('Drought'));
		case 'Gluttony':
			return !moves.has('bellydrum');
		case 'Guts':
			return (!moves.has('facade') && !moves.has('sleeptalk') && !species.nfe);
		case 'Harvest':
			return (abilities.has('Frisk') && !isDoubles);
		case 'Hustle': case 'Inner Focus':
			return (counter.get('Physical') < 2 || abilities.has('Iron Fist'));
		case 'Infiltrator':
			return (moves.has('rest') && moves.has('sleeptalk')) || (isDoubles && abilities.has('Clear Body'));
		case 'Intimidate':
			if (species.id === 'salamence' && moves.has('dragondance')) return true;
			return ['bodyslam', 'bounce', 'tripleaxel'].some(m => moves.has(m));
		case 'Iron Fist':
			return (counter.get('ironfist') < 2 || moves.has('dynamicpunch'));
		case 'Justified':
			return (isDoubles && abilities.has('Inner Focus'));
		case 'Lightning Rod':
			return (species.types.includes('Ground') || (!isNoDynamax && counter.setupType === 'Physical'));
		case 'Limber':
			return species.types.includes('Electric') || moves.has('facade');
		case 'Liquid Voice':
			return !moves.has('hypervoice');
		case 'Magic Guard':
			// For Sigilyph
			return (abilities.has('Tinted Lens') && !counter.get('Status') && !isDoubles);
		case 'Mold Breaker':
			return (
				abilities.has('Adaptability') || abilities.has('Scrappy') || (abilities.has('Unburden') && !!counter.setupType) ||
				(abilities.has('Sheer Force') && !!counter.get('sheerforce'))
			);
		case 'Moxie':
			return (counter.get('Physical') < 2 || moves.has('stealthrock') || moves.has('defog'));
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Own Tempo':
			return !moves.has('petaldance');
		case 'Power Construct':
			return (species.forme === '10%' && !isDoubles);
		case 'Prankster':
			return !counter.get('Status');
		case 'Pressure':
			return (!!counter.setupType || counter.get('Status') < 2 || isDoubles);
		case 'Refrigerate':
			return !counter.get('Normal');
		case 'Regenerator':
			// For Reuniclus
			return abilities.has('Magic Guard');
		case 'Reckless':
			return !counter.get('recoil') || moves.has('curse');
		case 'Rock Head':
			return !counter.get('recoil');
		case 'Sand Force': case 'Sand Veil':
			return !teamDetails.sand;
		case 'Sand Rush':
			return (!teamDetails.sand && (isNoDynamax || !counter.setupType || !counter.get('Rock') || moves.has('rapidspin')));
		case 'Sap Sipper':
			// For Drampa, which wants Berserk with Roost
			return moves.has('roost');
		case 'Scrappy':
			return (moves.has('earthquake') && species.id === 'miltank');
		case 'Screen Cleaner':
			return !!teamDetails.screens;
		case 'Shed Skin':
			// For Scrafty
			return moves.has('dragondance');
		case 'Sheer Force':
			return (!counter.get('sheerforce') || abilities.has('Guts') || (species.id === 'druddigon' && !isDoubles));
		case 'Shell Armor':
			return (species.id === 'omastar' && (moves.has('spikes') || moves.has('stealthrock')));
		case 'Slush Rush':
			return (!teamDetails.hail && !abilities.has('Swift Swim'));
		case 'Sniper':
			// Inteleon wants Torrent unless it is Gmax
			return (species.name === 'Inteleon' || (counter.get('Water') > 1 && !moves.has('focusenergy')));
		case 'Solar Power':
			return (isNoDynamax && !teamDetails.sun);
		case 'Speed Boost':
			return (isNoDynamax && species.id === 'ninjask');
		case 'Steely Spirit':
			return (moves.has('fakeout') && !isDoubles);
		case 'Sturdy':
			return (moves.has('bulkup') || !!counter.get('recoil') || (!isNoDynamax && abilities.has('Solid Rock')));
		case 'Swarm':
			return (!counter.get('Bug') || !!counter.get('recovery'));
		case 'Sweet Veil':
			return types.has('Grass');
		case 'Swift Swim':
			if (isNoDynamax) {
				const neverWantsSwim = !moves.has('raindance') && [
					'Intimidate', 'Rock Head', 'Water Absorb',
				].some(m => abilities.has(m));
				const noSwimIfNoRain = !moves.has('raindance') && [
					'Cloud Nine', 'Lightning Rod', 'Intimidate', 'Rock Head', 'Sturdy', 'Water Absorb', 'Weak Armor',
				].some(m => abilities.has(m));
				return teamDetails.rain ? neverWantsSwim : noSwimIfNoRain;
			}
			return (!moves.has('raindance') && (
				['Intimidate', 'Rock Head', 'Slush Rush', 'Water Absorb'].some(abil => abilities.has(abil)) ||
				(abilities.has('Lightning Rod') && !counter.setupType)
			));
		case 'Synchronize':
			return counter.get('Status') < 3;
		case 'Technician':
			return (
				!counter.get('technician') ||
				moves.has('tailslap') ||
				abilities.has('Punk Rock') ||
				// For Doubles Alolan Persian
				movePool.includes('snarl')
			);
		case 'Tinted Lens':
			return (
				// For Sigilyph
				moves.has('defog') ||
				// For Butterfree
				(moves.has('hurricane') && abilities.has('Compound Eyes')) ||
				(counter.get('Status') > 2 && !counter.setupType)
			);
		case 'Torrent':
			// For Inteleon-Gmax and Primarina
			return (moves.has('focusenergy') || moves.has('hypervoice'));
		case 'Tough Claws':
			// For Perrserker
			return (types.has('Steel') && !moves.has('fakeout'));
		case 'Unaware':
			// For Swoobat and Clefable
			return (!!counter.setupType || moves.has('fireblast'));
		case 'Unburden':
			return (abilities.has('Prankster') || !counter.setupType && !isDoubles);
		case 'Volt Absorb':
			return (this.dex.getEffectiveness('Electric', species) < -1);
		case 'Water Absorb':
			return (
				moves.has('raindance') ||
				['Drizzle', 'Strong Jaw', 'Unaware', 'Volt Absorb'].some(abil => abilities.has(abil))
			);
		case 'Weak Armor':
			// The Speed less than 50 case is intended for Cursola, but could apply to any slow Pokémon.
			return (
				(!isNoDynamax && species.baseStats.spe > 50) ||
				species.id === 'skarmory' ||
				moves.has('shellsmash') || moves.has('rapidspin')
			);
		}

		return false;
	}


}
