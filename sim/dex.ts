/**
 * Dex
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles getting data about pokemon, items, etc. Also contains some useful
 * helper functions for using dex data.
 *
 * By default, nothing is loaded until you call Dex.mod(mod) or
 * Dex.forFormat(format).
 *
 * You may choose to preload some things:
 * - Dex.includeMods() ~10ms
 *   This will preload `Dex.dexes`, giving you a list of possible mods.
 * - Dex.includeFormats() ~30ms
 *   As above, but will also preload `Dex.formats.all()`.
 * - Dex.includeData() ~500ms
 *   As above, but will also preload all of Dex.data for Gen 8, so
 *   functions like `Dex.species.get`, etc will be instantly usable.
 * - Dex.includeModData() ~1500ms
 *   As above, but will also preload `Dex.dexes[...].data` for all mods.
 *
 * Note that preloading is never necessary. All the data will be
 * automatically preloaded when needed, preloading will just spend time
 * now so you don't need to spend time later.
 *
 * @license MIT
 */

import * as Data from './dex-data';
import { Condition, DexConditions } from './dex-conditions';
import { DataMove, DexMoves } from './dex-moves';
import { Item, DexItems } from './dex-items';
import { Ability, DexAbilities } from './dex-abilities';
import { Species, DexSpecies } from './dex-species';
import { Format, DexFormats } from './dex-formats';
import { Utils } from '../lib/utils';
import { Aliases, CompoundWordNames } from '../data/aliases';

const BASE_MOD = 'gen9' as ID;

// @pokebedrock - use relative path instead of path import b/c of minecraft
const DATA_DIR = '../data';
const MODS_DIR = '../data/mods';

const dexes: { [mod: string]: ModdedDex } = Object.create(null);

type DataType =
	'Abilities' | 'Rulesets' | 'FormatsData' | 'Items' | 'Learnsets' | 'Moves' |
	'Natures' | 'Pokedex' | 'Scripts' | 'Conditions' | 'TypeChart' | 'PokemonGoData';
const DATA_TYPES: DataType[] = [
	'Abilities', 'Rulesets', 'FormatsData', 'Items', 'Learnsets', 'Moves',
	'Natures', 'Pokedex', 'Scripts', 'Conditions', 'TypeChart', 'PokemonGoData',
];

const DATA_FILES = {
	Abilities: 'abilities',
	Rulesets: 'rulesets',
	FormatsData: 'formats-data',
	Items: 'items',
	Learnsets: 'learnsets',
	Moves: 'moves',
	Natures: 'natures',
	Pokedex: 'pokedex',
	PokemonGoData: 'pokemongo',
	Scripts: 'scripts',
	Conditions: 'conditions',
	TypeChart: 'typechart',
};

/** Unfortunately we do for..in too much to want to deal with the casts */
export interface DexTable<T> { [id: string]: T }
export interface AliasesTable { [id: IDEntry]: string }

interface DexTableData {
	Abilities: DexTable<import('./dex-abilities').AbilityData>;
	Rulesets: DexTable<import('./dex-formats').FormatData>;
	Items: DexTable<import('./dex-items').ItemData>;
	Learnsets: DexTable<import('./dex-species').LearnsetData>;
	Moves: DexTable<import('./dex-moves').MoveData>;
	Natures: DexTable<import('./dex-data').NatureData>;
	Pokedex: DexTable<import('./dex-species').SpeciesData>;
	FormatsData: DexTable<import('./dex-species').SpeciesFormatsData>;
	PokemonGoData: DexTable<import('./dex-species').PokemonGoData>;
	Scripts: DexTable<AnyObject>;
	Conditions: DexTable<import('./dex-conditions').ConditionData>;
	TypeChart: DexTable<import('./dex-data').TypeData>;
}
interface TextTableData {
	Abilities: DexTable<AbilityText>;
	Items: DexTable<ItemText>;
	Moves: DexTable<MoveText>;
	Pokedex: DexTable<PokedexText>;
	Default: DexTable<DefaultText>;
}

export const toID = Data.toID;

export class ModdedDex {
	readonly Data = Data;
	readonly Condition = Condition;
	readonly Ability = Ability;
	readonly Item = Item;
	readonly Move = DataMove;
	readonly Species = Species;
	readonly Format = Format;
	readonly ModdedDex = ModdedDex;

	readonly name = "[ModdedDex]";
	readonly isBase: boolean;
	readonly currentMod: string;
	readonly dataDir: string;

	readonly toID = Data.toID;

	gen = 0;
	parentMod = '';
	modsLoaded = false;

	dataCache: DexTableData | null;
	textCache: TextTableData | null;

	deepClone = Utils.deepClone;
	deepFreeze = Utils.deepFreeze;
	Multiset = Utils.Multiset;

	readonly formats: DexFormats;
	readonly abilities: DexAbilities;
	readonly items: DexItems;
	readonly moves: DexMoves;
	readonly species: DexSpecies;
	readonly conditions: DexConditions;
	readonly natures: Data.DexNatures;
	readonly types: Data.DexTypes;
	readonly stats: Data.DexStats;
	readonly aliases: Map<ID, ID> | null = null;
	readonly fuzzyAliases: Map<ID, ID[]> | null = null;

	constructor(mod = 'base') {
		this.isBase = (mod === 'base');
		this.currentMod = mod;
		this.dataDir = (this.isBase ? DATA_DIR : MODS_DIR + '/' + this.currentMod);

		this.dataCache = null;
		this.textCache = null;

		this.formats = new DexFormats(this);
		this.abilities = new DexAbilities(this);
		this.items = new DexItems(this);
		this.moves = new DexMoves(this);
		this.species = new DexSpecies(this);
		this.conditions = new DexConditions(this);
		this.natures = new Data.DexNatures(this);
		this.types = new Data.DexTypes(this);
		this.stats = new Data.DexStats(this);
	}

	get data(): DexTableData {
		return this.loadData();
	}

	get dexes(): { [mod: string]: ModdedDex } {
		this.includeMods();
		return dexes;
	}

	mod(mod: string | undefined): ModdedDex {
		if (!dexes['base'].modsLoaded) dexes['base'].includeMods();
		return dexes[mod || 'base'].includeData();
	}

	forGen(gen: number) {
		if (!gen) return this;
		return this.mod(`gen${gen}`);
	}

	forFormat(format: Format | string): ModdedDex {
		if (!this.modsLoaded) this.includeMods();
		const mod = this.formats.get(format).mod;
		const moddedDex = dexes[mod || BASE_MOD];
		if (!moddedDex) throw new Error(`ModdedDex ${mod || BASE_MOD} not found`);
		return moddedDex.includeData();
	}

	modData(dataType: DataType, id: string) {
		if (this.isBase) return this.data[dataType][id];
		if (this.data[dataType][id] !== dexes[this.parentMod].data[dataType][id]) return this.data[dataType][id];
		return (this.data[dataType][id] = Utils.deepClone(this.data[dataType][id]));
	}

	effectToString() {
		return this.name;
	}

	/**
	 * Sanitizes a username or Pokemon nickname
	 *
	 * Returns the passed name, sanitized for safe use as a name in the PS
	 * protocol.
	 *
	 * Such a string must uphold these guarantees:
	 * - must not contain any ASCII whitespace character other than a space
	 * - must not start or end with a space character
	 * - must not contain any of: | , [ ]
	 * - must not be the empty string
	 * - must not contain Unicode RTL control characters
	 *
	 * If no such string can be found, returns the empty string. Calling
	 * functions are expected to check for that condition and deal with it
	 * accordingly.
	 *
	 * getName also enforces that there are not multiple consecutive space
	 * characters in the name, although this is not strictly necessary for
	 * safety.
	 */
	getName(name: any): string {
		if (typeof name !== 'string' && typeof name !== 'number') return '';
		name = `${name}`.replace(/[|\s[\],\u202e]+/g, ' ').trim();
		if (name.length > 18) name = name.substr(0, 18).trim();

		// remove zalgo
		name = name.replace(
			/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g,
			''
		);
		name = name.replace(/[\u239b-\u23b9]/g, '');

		return name;
	}

	/**
	 * Returns false if the target is immune; true otherwise.
	 * Also checks immunity to some statuses.
	 */
	getImmunity(
		source: { type: string } | string,
		target: { getTypes: () => string[] } | { types: string[] } | string[] | string
	): boolean {
		const sourceType: string = typeof source !== 'string' ? source.type : source;
		// @ts-expect-error really wish TS would support this
		const targetTyping: string[] | string = target.getTypes?.() || target.types || target;
		if (Array.isArray(targetTyping)) {
			for (const type of targetTyping) {
				if (!this.getImmunity(sourceType, type)) return false;
			}
			return true;
		}
		const typeData = this.types.get(targetTyping);
		if (typeData && typeData.damageTaken[sourceType] === 3) return false;
		return true;
	}

	getEffectiveness(
		source: { type: string } | string,
		target: { getTypes: () => string[] } | { types: string[] } | string[] | string
	): number {
		const sourceType: string = typeof source !== 'string' ? source.type : source;
		// @ts-expect-error really wish TS would support this
		const targetTyping: string[] | string = target.getTypes?.() || target.types || target;
		let totalTypeMod = 0;
		if (Array.isArray(targetTyping)) {
			for (const type of targetTyping) {
				totalTypeMod += this.getEffectiveness(sourceType, type);
			}
			return totalTypeMod;
		}
		const typeData = this.types.get(targetTyping);
		if (!typeData) return 0;
		switch (typeData.damageTaken[sourceType]) {
		case 1: return 1; // super-effective
		case 2: return -1; // resist
		// in case of weird situations like Gravity, immunity is handled elsewhere
		default: return 0;
		}
	}

	getDescs(table: keyof TextTableData, id: ID, dataEntry: AnyObject) {
		if (dataEntry.shortDesc) {
			return {
				desc: dataEntry.desc,
				shortDesc: dataEntry.shortDesc,
			};
		}
		const entry = this.loadTextData()[table][id];
		if (!entry) return null;
		const descs = {
			desc: '',
			shortDesc: '',
		};
		for (let i = this.gen; i < dexes['base'].gen; i++) {
			const curDesc = entry[`gen${i}` as keyof typeof entry]?.desc;
			const curShortDesc = entry[`gen${i}` as keyof typeof entry]?.shortDesc;
			if (!descs.desc && curDesc) {
				descs.desc = curDesc;
			}
			if (!descs.shortDesc && curShortDesc) {
				descs.shortDesc = curShortDesc;
			}
			if (descs.desc && descs.shortDesc) break;
		}
		if (!descs.shortDesc) descs.shortDesc = entry.shortDesc || '';
		if (!descs.desc) descs.desc = entry.desc || descs.shortDesc;
		return descs;
	}

	/**
	 * Ensure we're working on a copy of a move (and make a copy if we aren't)
	 *
	 * Remember: "ensure" - by default, it won't make a copy of a copy:
	 *     moveCopy === Dex.getActiveMove(moveCopy)
	 *
	 * If you really want to, use:
	 *     moveCopyCopy = Dex.getActiveMove(moveCopy.id)
	 */
	getActiveMove(move: Move | string): ActiveMove {
		if (move && typeof (move as ActiveMove).hit === 'number') return move as ActiveMove;
		move = this.moves.get(move);
		const moveCopy: ActiveMove = this.deepClone(move);
		moveCopy.hit = 0;
		return moveCopy;
	}

	getHiddenPower(ivs: StatsTable) {
		const hpTypes = [
			'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel',
			'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark',
		];
		const tr = this.trunc;
		const stats = { hp: 31, atk: 31, def: 31, spe: 31, spa: 31, spd: 31 };
		if (this.gen <= 2) {
			// Gen 2 specific Hidden Power check. IVs are still treated 0-31 so we get them 0-15
			const atkDV = tr(ivs.atk / 2);
			const defDV = tr(ivs.def / 2);
			const speDV = tr(ivs.spe / 2);
			const spcDV = tr(ivs.spa / 2);
			return {
				type: hpTypes[4 * (atkDV % 4) + (defDV % 4)],
				power: tr(
					(5 * ((spcDV >> 3) + (2 * (speDV >> 3)) + (4 * (defDV >> 3)) + (8 * (atkDV >> 3))) + (spcDV % 4)) / 2 + 31
				),
			};
		} else {
			// Hidden Power check for Gen 3 onwards
			let hpTypeX = 0;
			let hpPowerX = 0;
			let i = 1;
			for (const s in stats) {
				hpTypeX += i * (ivs[s as StatID] % 2);
				hpPowerX += i * (tr(ivs[s as StatID] / 2) % 2);
				i *= 2;
			}
			return {
				type: hpTypes[tr(hpTypeX * 15 / 63)],
				// After Gen 6, Hidden Power is always 60 base power
				power: (this.gen && this.gen < 6) ? tr(hpPowerX * 40 / 63) + 30 : 60,
			};
		}
	}

	/**
	 * Truncate a number into an unsigned 32-bit integer, for
	 * compatibility with the cartridge games' math systems.
	 */
	trunc(this: void, num: number, bits = 0) {
		if (bits) return (num >>> 0) % (2 ** bits);
		return num >>> 0;
	}

	dataSearch(
		target: string,
		searchIn?: ('Pokedex' | 'Moves' | 'Abilities' | 'Items' | 'Natures' | 'TypeChart')[] | null,
		isInexact?: boolean
	): AnyObject[] | null {
		if (!target) return null;

		searchIn = searchIn || ['Pokedex', 'Moves', 'Abilities', 'Items', 'Natures'];

		const searchObjects = {
			Pokedex: 'species', Moves: 'moves', Abilities: 'abilities', Items: 'items', Natures: 'natures', TypeChart: 'types',
		} as const;
		const searchTypes = {
			Pokedex: 'pokemon', Moves: 'move', Abilities: 'ability', Items: 'item', Natures: 'nature', TypeChart: 'type',
		} as const;
		let searchResults: AnyObject[] | null = [];
		for (const table of searchIn) {
			const res = this[searchObjects[table]].get(target);
			if (res.exists && res.gen <= this.gen) {
				searchResults.push({
					isInexact,
					searchType: searchTypes[table],
					name: res.name,
				});
			}
		}
		if (searchResults.length) return searchResults;
		if (isInexact) return null; // prevent infinite loop

		this.loadAliases();
		const fuzzyAliases = Dex.fuzzyAliases!.get(toID(target));
		if (fuzzyAliases) {
			for (const table of searchIn) {
				for (const alias of fuzzyAliases) {
					const res = this[searchObjects[table]].get(alias);
					if (res.exists && res.gen <= this.gen) {
						searchResults.push({
							isInexact: true,
							searchType: searchTypes[table],
							name: res.name,
						});
					}
				}
			}
		}
		if (searchResults.length) return searchResults;

		const cmpTarget = toID(target);
		let maxLd = 3;
		if (cmpTarget.length <= 1) {
			return null;
		} else if (cmpTarget.length <= 4) {
			maxLd = 1;
		} else if (cmpTarget.length <= 6) {
			maxLd = 2;
		}
		searchResults = null;
		for (const table of searchIn) {
			const searchObj = this.data[table] as DexTable<any>;
			if (!searchObj) continue;

			for (const j in searchObj) {
				const ld = Utils.levenshtein(cmpTarget, j, maxLd);
				if (ld <= maxLd) {
					const word = searchObj[j].name || j;
					const results = this.dataSearch(word, searchIn, word);
					if (results) {
						searchResults = results;
						maxLd = ld;
					}
				}
			}
		}

		return searchResults;
	}

	loadDataFile(basePath: string, dataType: DataType): AnyObject | void {
		const filePath = basePath + DATA_FILES[dataType];
		let dataObject: { [key: string]: any } | void;
		try {
			// @pokebedrock - switch to static require
			switch (filePath) {
			// base
			case '../data/abilities': dataObject = require('../data/abilities'); break;
			case '../data/aliases': dataObject = require('../data/aliases'); break;
			case '../data/conditions': dataObject = require('../data/conditions'); break;
			case '../data/formats-data': dataObject = require('../data/formats-data'); break;
			case '../data/items': dataObject = require('../data/items'); break;
			case '../data/moves': dataObject = require('../data/moves'); break;
			case '../data/natures': dataObject = require('../data/natures'); break;
			case '../data/pokedex': dataObject = require('../data/pokedex'); break;
			case '../data/rulesets': dataObject = require('../data/rulesets'); break;
			case '../data/scripts': dataObject = require('../data/scripts'); break;
			case '../data/typechart': dataObject = require('../data/typechart'); break;
			case '../data/learnsets': dataObject = require('../data/learnsets'); break;

			// mods
			case '../data/mods/balls/formats-data': dataObject = require('../data/mods/balls/formats-data'); break;
			case '../data/mods/balls/learnsets': dataObject = require('../data/mods/balls/learnsets'); break;
			case '../data/mods/balls/moves': dataObject = require('../data/mods/balls/moves'); break;
			case '../data/mods/balls/pokedex': dataObject = require('../data/mods/balls/pokedex'); break;
			case '../data/mods/balls/random-teams': dataObject = require('../data/mods/balls/random-teams'); break;
			case '../data/mods/balls/rulesets': dataObject = require('../data/mods/balls/rulesets'); break;
			case '../data/mods/balls/scripts': dataObject = require('../data/mods/balls/scripts'); break;
			case '../data/mods/ccapm2024/abilities': dataObject = require('../data/mods/ccapm2024/abilities'); break;
			case '../data/mods/ccapm2024/formats-data': dataObject = require('../data/mods/ccapm2024/formats-data'); break;
			case '../data/mods/ccapm2024/items': dataObject = require('../data/mods/ccapm2024/items'); break;
			case '../data/mods/ccapm2024/learnsets': dataObject = require('../data/mods/ccapm2024/learnsets'); break;
			case '../data/mods/ccapm2024/moves': dataObject = require('../data/mods/ccapm2024/moves'); break;
			case '../data/mods/ccapm2024/pokedex': dataObject = require('../data/mods/ccapm2024/pokedex'); break;
			case '../data/mods/ccapm2024/scripts': dataObject = require('../data/mods/ccapm2024/scripts'); break;
			case '../data/mods/fullpotential/abilities': dataObject = require('../data/mods/fullpotential/abilities'); break;
			case '../data/mods/fullpotential/scripts': dataObject = require('../data/mods/fullpotential/scripts'); break;
			case '../data/mods/gen1/conditions': dataObject = require('../data/mods/gen1/conditions'); break;
			case '../data/mods/gen1/formats-data': dataObject = require('../data/mods/gen1/formats-data'); break;
			case '../data/mods/gen1/moves': dataObject = require('../data/mods/gen1/moves'); break;
			case '../data/mods/gen1/pokedex': dataObject = require('../data/mods/gen1/pokedex'); break;
			case '../data/mods/gen1/scripts': dataObject = require('../data/mods/gen1/scripts'); break;
			case '../data/mods/gen1/typechart': dataObject = require('../data/mods/gen1/typechart'); break;
			case '../data/mods/gen1jpn/conditions': dataObject = require('../data/mods/gen1jpn/conditions'); break;
			case '../data/mods/gen1jpn/moves': dataObject = require('../data/mods/gen1jpn/moves'); break;
			case '../data/mods/gen1jpn/scripts': dataObject = require('../data/mods/gen1jpn/scripts'); break;
			case '../data/mods/gen1stadium/conditions': dataObject = require('../data/mods/gen1stadium/conditions'); break;
			case '../data/mods/gen1stadium/formats-data': dataObject = require('../data/mods/gen1stadium/formats-data'); break;
			case '../data/mods/gen1stadium/moves': dataObject = require('../data/mods/gen1stadium/moves'); break;
			case '../data/mods/gen1stadium/pokedex': dataObject = require('../data/mods/gen1stadium/pokedex'); break;
			case '../data/mods/gen1stadium/scripts': dataObject = require('../data/mods/gen1stadium/scripts'); break;
			case '../data/mods/gen2/conditions': dataObject = require('../data/mods/gen2/conditions'); break;
			case '../data/mods/gen2/formats-data': dataObject = require('../data/mods/gen2/formats-data'); break;
			case '../data/mods/gen2/items': dataObject = require('../data/mods/gen2/items'); break;
			case '../data/mods/gen2/learnsets': dataObject = require('../data/mods/gen2/learnsets'); break;
			case '../data/mods/gen2/moves': dataObject = require('../data/mods/gen2/moves'); break;
			case '../data/mods/gen2/pokedex': dataObject = require('../data/mods/gen2/pokedex'); break;
			case '../data/mods/gen2/scripts': dataObject = require('../data/mods/gen2/scripts'); break;
			case '../data/mods/gen2/typechart': dataObject = require('../data/mods/gen2/typechart'); break;
			case '../data/mods/gen2stadium2/conditions': dataObject = require('../data/mods/gen2stadium2/conditions'); break;
			case '../data/mods/gen2stadium2/items': dataObject = require('../data/mods/gen2stadium2/items'); break;
			case '../data/mods/gen2stadium2/moves': dataObject = require('../data/mods/gen2stadium2/moves'); break;
			case '../data/mods/gen2stadium2/pokedex': dataObject = require('../data/mods/gen2stadium2/pokedex'); break;
			case '../data/mods/gen2stadium2/scripts': dataObject = require('../data/mods/gen2stadium2/scripts'); break;
			case '../data/mods/gen3/abilities': dataObject = require('../data/mods/gen3/abilities'); break;
			case '../data/mods/gen3/conditions': dataObject = require('../data/mods/gen3/conditions'); break;
			case '../data/mods/gen3/formats-data': dataObject = require('../data/mods/gen3/formats-data'); break;
			case '../data/mods/gen3/items': dataObject = require('../data/mods/gen3/items'); break;
			case '../data/mods/gen3/learnsets': dataObject = require('../data/mods/gen3/learnsets'); break;
			case '../data/mods/gen3/moves': dataObject = require('../data/mods/gen3/moves'); break;
			case '../data/mods/gen3/pokedex': dataObject = require('../data/mods/gen3/pokedex'); break;
			case '../data/mods/gen3/scripts': dataObject = require('../data/mods/gen3/scripts'); break;
			case '../data/mods/gen3/typechart': dataObject = require('../data/mods/gen3/typechart'); break;
			case '../data/mods/gen3colosseum/moves': dataObject = require('../data/mods/gen3colosseum/moves'); break;
			case '../data/mods/gen3colosseum/scripts': dataObject = require('../data/mods/gen3colosseum/scripts'); break;
			case '../data/mods/gen3rs/formats-data': dataObject = require('../data/mods/gen3rs/formats-data'); break;
			case '../data/mods/gen3rs/items': dataObject = require('../data/mods/gen3rs/items'); break;
			case '../data/mods/gen3rs/learnsets': dataObject = require('../data/mods/gen3rs/learnsets'); break;
			case '../data/mods/gen3rs/pokedex': dataObject = require('../data/mods/gen3rs/pokedex'); break;
			case '../data/mods/gen4/abilities': dataObject = require('../data/mods/gen4/abilities'); break;
			case '../data/mods/gen4/conditions': dataObject = require('../data/mods/gen4/conditions'); break;
			case '../data/mods/gen4/formats-data': dataObject = require('../data/mods/gen4/formats-data'); break;
			case '../data/mods/gen4/items': dataObject = require('../data/mods/gen4/items'); break;
			case '../data/mods/gen4/learnsets': dataObject = require('../data/mods/gen4/learnsets'); break;
			case '../data/mods/gen4/moves': dataObject = require('../data/mods/gen4/moves'); break;
			case '../data/mods/gen4/pokedex': dataObject = require('../data/mods/gen4/pokedex'); break;
			case '../data/mods/gen4/scripts': dataObject = require('../data/mods/gen4/scripts'); break;
			case '../data/mods/gen4pt/formats-data': dataObject = require('../data/mods/gen4pt/formats-data'); break;
			case '../data/mods/gen4pt/learnsets': dataObject = require('../data/mods/gen4pt/learnsets'); break;
			case '../data/mods/gen4pt/scripts': dataObject = require('../data/mods/gen4pt/scripts'); break;
			case '../data/mods/gen5/abilities': dataObject = require('../data/mods/gen5/abilities'); break;
			case '../data/mods/gen5/conditions': dataObject = require('../data/mods/gen5/conditions'); break;
			case '../data/mods/gen5/formats-data': dataObject = require('../data/mods/gen5/formats-data'); break;
			case '../data/mods/gen5/items': dataObject = require('../data/mods/gen5/items'); break;
			case '../data/mods/gen5/learnsets': dataObject = require('../data/mods/gen5/learnsets'); break;
			case '../data/mods/gen5/moves': dataObject = require('../data/mods/gen5/moves'); break;
			case '../data/mods/gen5/pokedex': dataObject = require('../data/mods/gen5/pokedex'); break;
			case '../data/mods/gen5/scripts': dataObject = require('../data/mods/gen5/scripts'); break;
			case '../data/mods/gen5bw1/formats-data': dataObject = require('../data/mods/gen5bw1/formats-data'); break;
			case '../data/mods/gen5bw1/items': dataObject = require('../data/mods/gen5bw1/items'); break;
			case '../data/mods/gen5bw1/learnsets': dataObject = require('../data/mods/gen5bw1/learnsets'); break;
			case '../data/mods/gen5bw1/pokedex': dataObject = require('../data/mods/gen5bw1/pokedex'); break;
			case '../data/mods/gen6/abilities': dataObject = require('../data/mods/gen6/abilities'); break;
			case '../data/mods/gen6/conditions': dataObject = require('../data/mods/gen6/conditions'); break;
			case '../data/mods/gen6/formats-data': dataObject = require('../data/mods/gen6/formats-data'); break;
			case '../data/mods/gen6/items': dataObject = require('../data/mods/gen6/items'); break;
			case '../data/mods/gen6/learnsets': dataObject = require('../data/mods/gen6/learnsets'); break;
			case '../data/mods/gen6/moves': dataObject = require('../data/mods/gen6/moves'); break;
			case '../data/mods/gen6/pokedex': dataObject = require('../data/mods/gen6/pokedex'); break;
			case '../data/mods/gen6/scripts': dataObject = require('../data/mods/gen6/scripts'); break;
			case '../data/mods/gen6xy/formats-data': dataObject = require('../data/mods/gen6xy/formats-data'); break;
			case '../data/mods/gen6xy/items': dataObject = require('../data/mods/gen6xy/items'); break;
			case '../data/mods/gen6xy/learnsets': dataObject = require('../data/mods/gen6xy/learnsets'); break;
			case '../data/mods/gen6xy/pokedex': dataObject = require('../data/mods/gen6xy/pokedex'); break;
			case '../data/mods/gen7/abilities': dataObject = require('../data/mods/gen7/abilities'); break;
			case '../data/mods/gen7/formats-data': dataObject = require('../data/mods/gen7/formats-data'); break;
			case '../data/mods/gen7/items': dataObject = require('../data/mods/gen7/items'); break;
			case '../data/mods/gen7/learnsets': dataObject = require('../data/mods/gen7/learnsets'); break;
			case '../data/mods/gen7/moves': dataObject = require('../data/mods/gen7/moves'); break;
			case '../data/mods/gen7/pokedex': dataObject = require('../data/mods/gen7/pokedex'); break;
			case '../data/mods/gen7/scripts': dataObject = require('../data/mods/gen7/scripts'); break;
			case '../data/mods/gen7letsgo/formats-data': dataObject = require('../data/mods/gen7letsgo/formats-data'); break;
			case '../data/mods/gen7letsgo/learnsets': dataObject = require('../data/mods/gen7letsgo/learnsets'); break;
			case '../data/mods/gen7letsgo/moves': dataObject = require('../data/mods/gen7letsgo/moves'); break;
			case '../data/mods/gen7letsgo/pokedex': dataObject = require('../data/mods/gen7letsgo/pokedex'); break;
			case '../data/mods/gen7letsgo/scripts': dataObject = require('../data/mods/gen7letsgo/scripts'); break;
			case '../data/mods/gen7pokebilities/abilities': dataObject = require('../data/mods/gen7pokebilities/abilities'); break;
			case '../data/mods/gen7pokebilities/moves': dataObject = require('../data/mods/gen7pokebilities/moves'); break;
			case '../data/mods/gen7pokebilities/scripts': dataObject = require('../data/mods/gen7pokebilities/scripts'); break;
			case '../data/mods/gen7sm/formats-data': dataObject = require('../data/mods/gen7sm/formats-data'); break;
			case '../data/mods/gen7sm/items': dataObject = require('../data/mods/gen7sm/items'); break;
			case '../data/mods/gen7sm/learnsets': dataObject = require('../data/mods/gen7sm/learnsets'); break;
			case '../data/mods/gen7sm/pokedex': dataObject = require('../data/mods/gen7sm/pokedex'); break;
			case '../data/mods/gen8/abilities': dataObject = require('../data/mods/gen8/abilities'); break;
			case '../data/mods/gen8/formats-data': dataObject = require('../data/mods/gen8/formats-data'); break;
			case '../data/mods/gen8/items': dataObject = require('../data/mods/gen8/items'); break;
			case '../data/mods/gen8/learnsets': dataObject = require('../data/mods/gen8/learnsets'); break;
			case '../data/mods/gen8/moves': dataObject = require('../data/mods/gen8/moves'); break;
			case '../data/mods/gen8/pokedex': dataObject = require('../data/mods/gen8/pokedex'); break;
			case '../data/mods/gen8/scripts': dataObject = require('../data/mods/gen8/scripts'); break;
			case '../data/mods/gen8bdsp/abilities': dataObject = require('../data/mods/gen8bdsp/abilities'); break;
			case '../data/mods/gen8bdsp/formats-data': dataObject = require('../data/mods/gen8bdsp/formats-data'); break;
			case '../data/mods/gen8bdsp/items': dataObject = require('../data/mods/gen8bdsp/items'); break;
			case '../data/mods/gen8bdsp/learnsets': dataObject = require('../data/mods/gen8bdsp/learnsets'); break;
			case '../data/mods/gen8bdsp/moves': dataObject = require('../data/mods/gen8bdsp/moves'); break;
			case '../data/mods/gen8bdsp/pokedex': dataObject = require('../data/mods/gen8bdsp/pokedex'); break;
			case '../data/mods/gen8bdsp/scripts': dataObject = require('../data/mods/gen8bdsp/scripts'); break;
			case '../data/mods/gen8dlc1/abilities': dataObject = require('../data/mods/gen8dlc1/abilities'); break;
			case '../data/mods/gen8dlc1/formats-data': dataObject = require('../data/mods/gen8dlc1/formats-data'); break;
			case '../data/mods/gen8dlc1/items': dataObject = require('../data/mods/gen8dlc1/items'); break;
			case '../data/mods/gen8dlc1/learnsets': dataObject = require('../data/mods/gen8dlc1/learnsets'); break;
			case '../data/mods/gen8dlc1/moves': dataObject = require('../data/mods/gen8dlc1/moves'); break;
			case '../data/mods/gen8dlc1/pokedex': dataObject = require('../data/mods/gen8dlc1/pokedex'); break;
			case '../data/mods/gen8dlc1/scripts': dataObject = require('../data/mods/gen8dlc1/scripts'); break;
			case '../data/mods/gen8linked/conditions': dataObject = require('../data/mods/gen8linked/conditions'); break;
			case '../data/mods/gen8linked/items': dataObject = require('../data/mods/gen8linked/items'); break;
			case '../data/mods/gen8linked/moves': dataObject = require('../data/mods/gen8linked/moves'); break;
			case '../data/mods/gen8linked/scripts': dataObject = require('../data/mods/gen8linked/scripts'); break;
			case '../data/mods/gen9dlc1/abilities': dataObject = require('../data/mods/gen9dlc1/abilities'); break;
			case '../data/mods/gen9dlc1/formats-data': dataObject = require('../data/mods/gen9dlc1/formats-data'); break;
			case '../data/mods/gen9dlc1/items': dataObject = require('../data/mods/gen9dlc1/items'); break;
			case '../data/mods/gen9dlc1/learnsets': dataObject = require('../data/mods/gen9dlc1/learnsets'); break;
			case '../data/mods/gen9dlc1/moves': dataObject = require('../data/mods/gen9dlc1/moves'); break;
			case '../data/mods/gen9dlc1/pokedex': dataObject = require('../data/mods/gen9dlc1/pokedex'); break;
			case '../data/mods/gen9dlc1/scripts': dataObject = require('../data/mods/gen9dlc1/scripts'); break;
			case '../data/mods/gen9predlc/abilities': dataObject = require('../data/mods/gen9predlc/abilities'); break;
			case '../data/mods/gen9predlc/formats-data': dataObject = require('../data/mods/gen9predlc/formats-data'); break;
			case '../data/mods/gen9predlc/items': dataObject = require('../data/mods/gen9predlc/items'); break;
			case '../data/mods/gen9predlc/learnsets': dataObject = require('../data/mods/gen9predlc/learnsets'); break;
			case '../data/mods/gen9predlc/pokedex': dataObject = require('../data/mods/gen9predlc/pokedex'); break;
			case '../data/mods/gen9ssb/abilities': dataObject = require('../data/mods/gen9ssb/abilities'); break;
			case '../data/mods/gen9ssb/conditions': dataObject = require('../data/mods/gen9ssb/conditions'); break;
			case '../data/mods/gen9ssb/items': dataObject = require('../data/mods/gen9ssb/items'); break;
			case '../data/mods/gen9ssb/learnsets': dataObject = require('../data/mods/gen9ssb/learnsets'); break;
			case '../data/mods/gen9ssb/moves': dataObject = require('../data/mods/gen9ssb/moves'); break;
			case '../data/mods/gen9ssb/pokedex': dataObject = require('../data/mods/gen9ssb/pokedex'); break;
			case '../data/mods/gen9ssb/scripts': dataObject = require('../data/mods/gen9ssb/scripts'); break;
			case '../data/mods/mixandmega/items': dataObject = require('../data/mods/mixandmega/items'); break;
			case '../data/mods/mixandmega/scripts': dataObject = require('../data/mods/mixandmega/scripts'); break;
			case '../data/mods/monkeyspaw/abilities': dataObject = require('../data/mods/monkeyspaw/abilities'); break;
			case '../data/mods/monkeyspaw/conditions': dataObject = require('../data/mods/monkeyspaw/conditions'); break;
			case '../data/mods/monkeyspaw/scripts': dataObject = require('../data/mods/monkeyspaw/scripts'); break;
			case '../data/mods/partnersincrime/abilities': dataObject = require('../data/mods/partnersincrime/abilities'); break;
			case '../data/mods/partnersincrime/items': dataObject = require('../data/mods/partnersincrime/items'); break;
			case '../data/mods/partnersincrime/moves': dataObject = require('../data/mods/partnersincrime/moves'); break;
			case '../data/mods/partnersincrime/scripts': dataObject = require('../data/mods/partnersincrime/scripts'); break;
			case '../data/mods/passiveaggressive/abilities':
				dataObject = require('../data/mods/passiveaggressive/abilities');
				break;
			case '../data/mods/passiveaggressive/conditions':
				dataObject = require('../data/mods/passiveaggressive/conditions');
				break;
			case '../data/mods/passiveaggressive/items': dataObject = require('../data/mods/passiveaggressive/items'); break;
			case '../data/mods/passiveaggressive/scripts': dataObject = require('../data/mods/passiveaggressive/scripts'); break;
			case '../data/mods/pokebedrock/scripts': dataObject = require('../data/mods/pokebedrock/scripts'); break;
			case '../data/mods/pokebilities/abilities': dataObject = require('../data/mods/pokebilities/abilities'); break;
			case '../data/mods/pokebilities/moves': dataObject = require('../data/mods/pokebilities/moves'); break;
			case '../data/mods/pokebilities/scripts': dataObject = require('../data/mods/pokebilities/scripts'); break;
			case '../data/mods/pokemoves/abilities': dataObject = require('../data/mods/pokemoves/abilities'); break;
			case '../data/mods/pokemoves/moves': dataObject = require('../data/mods/pokemoves/moves'); break;
			case '../data/mods/pokemoves/scripts': dataObject = require('../data/mods/pokemoves/scripts'); break;
			case '../data/mods/randomroulette/scripts': dataObject = require('../data/mods/randomroulette/scripts'); break;
			case '../data/mods/sharedpower/abilities': dataObject = require('../data/mods/sharedpower/abilities'); break;
			case '../data/mods/sharedpower/moves': dataObject = require('../data/mods/sharedpower/moves'); break;
			case '../data/mods/sharedpower/scripts': dataObject = require('../data/mods/sharedpower/scripts'); break;
			case '../data/mods/sharingiscaring/conditions': dataObject = require('../data/mods/sharingiscaring/conditions'); break;
			case '../data/mods/sharingiscaring/items': dataObject = require('../data/mods/sharingiscaring/items'); break;
			case '../data/mods/sharingiscaring/moves': dataObject = require('../data/mods/sharingiscaring/moves'); break;
			case '../data/mods/sharingiscaring/scripts': dataObject = require('../data/mods/sharingiscaring/scripts'); break;
			case '../data/mods/thecardgame/abilities': dataObject = require('../data/mods/thecardgame/abilities'); break;
			case '../data/mods/thecardgame/conditions': dataObject = require('../data/mods/thecardgame/conditions'); break;
			case '../data/mods/thecardgame/items': dataObject = require('../data/mods/thecardgame/items'); break;
			case '../data/mods/thecardgame/moves': dataObject = require('../data/mods/thecardgame/moves'); break;
			case '../data/mods/thecardgame/pokedex': dataObject = require('../data/mods/thecardgame/pokedex'); break;
			case '../data/mods/thecardgame/scripts': dataObject = require('../data/mods/thecardgame/scripts'); break;
			case '../data/mods/trademarked/scripts': dataObject = require('../data/mods/trademarked/scripts'); break;
			case '../data/mods/vaporemons/abilities': dataObject = require('../data/mods/vaporemons/abilities'); break;
			case '../data/mods/vaporemons/conditions': dataObject = require('../data/mods/vaporemons/conditions'); break;
			case '../data/mods/vaporemons/formats-data': dataObject = require('../data/mods/vaporemons/formats-data'); break;
			case '../data/mods/vaporemons/items': dataObject = require('../data/mods/vaporemons/items'); break;
			case '../data/mods/vaporemons/learnsets': dataObject = require('../data/mods/vaporemons/learnsets'); break;
			case '../data/mods/vaporemons/moves': dataObject = require('../data/mods/vaporemons/moves'); break;
			case '../data/mods/vaporemons/pokedex': dataObject = require('../data/mods/vaporemons/pokedex'); break;
			case '../data/mods/vaporemons/scripts': dataObject = require('../data/mods/vaporemons/scripts'); break;
			case '../data/mods/vaporemons/typechart': dataObject = require('../data/mods/vaporemons/typechart'); break;
			default:
				return;
			}
			if (typeof dataObject !== 'object') {
				throw new TypeError(`${filePath}, if it exists, must export a non-null object`);
			}
			if (dataObject[dataType]?.constructor?.name !== 'Object') {
				throw new TypeError(`${filePath}, if it exists, must export an object whose '${dataType}' property is an Object`);
			}
			return dataObject[dataType];
		} catch (e: any) {
			if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
				throw e;
			}
		}
	}

	loadTextFile(
		name: string, exportName: string
	): DexTable<MoveText | ItemText | AbilityText | PokedexText | DefaultText> {
		let data;
		// @pokebedrock - switch to static require
		switch (name) {
		case 'abilities':
			data = require('../data/text/abilities');
			break;
		case 'default':
			data = require('../data/text/default');
			break;
		case 'items':
			data = require('../data/text/items');
			break;
		case 'moves':
			data = require('../data/text/moves');
			break;
		case 'pokedex':
			data = require('../data/text/pokedex');
			break;
		default:
			throw new Error(`Unknown text file ${name}`);
		}
		return data[exportName];
	}

	includeMods(): this {
		if (!this.isBase) throw new Error(`This must be called on the base Dex`);
		if (this.modsLoaded) return this;

		// @pokebedrock - Write each mod here, as we cannot use fs in minecraft
		// NOTE: This needs to be updated when new mods are added
		const mods = [
			'balls', 'ccapm2024', 'fullpotential', 'gen1', 'gen1jpn', 'gen1stadium', 'gen2', 'gen2stadium2', 'gen3',
			'gen3colosseum', 'gen3rs', 'gen4', 'gen4pt', 'gen5', 'gen5bw1', 'gen6', 'gen6xy', 'gen7', 'gen7letsgo',
			'gen7pokebilities', 'gen7sm', 'gen8', 'gen8bdsp', 'gen8dlc1', 'gen8linked', 'gen9dlc1', 'gen9predlc',
			'gen9ssb', 'mixandmega', 'monkeyspaw', 'partnersincrime', 'passiveaggressive', 'pokebedrock', 'pokebilities',
			'pokemoves', 'randomroulette', 'sharedpower', 'sharingiscaring', 'thecardgame', 'trademarked', 'vaporemons',
		];
		for (const mod of mods) {
			dexes[mod] = new ModdedDex(mod);
		}
		this.modsLoaded = true;

		return this;
	}

	includeModData(): this {
		for (const mod in this.dexes) {
			dexes[mod].includeData();
		}
		return this;
	}

	includeData(): this {
		this.loadData();
		return this;
	}

	loadTextData() {
		if (dexes['base'].textCache) return dexes['base'].textCache;
		dexes['base'].textCache = {
			Pokedex: this.loadTextFile('pokedex', 'PokedexText') as DexTable<PokedexText>,
			Moves: this.loadTextFile('moves', 'MovesText') as DexTable<MoveText>,
			Abilities: this.loadTextFile('abilities', 'AbilitiesText') as DexTable<AbilityText>,
			Items: this.loadTextFile('items', 'ItemsText') as DexTable<ItemText>,
			Default: this.loadTextFile('default', 'DefaultText') as DexTable<DefaultText>,
		};
		return dexes['base'].textCache;
	}

	getAlias(id: ID): ID | undefined {
		return this.loadAliases().get(id);
	}

	loadAliases(): NonNullable<ModdedDex['aliases']> {
		if (!this.isBase) return Dex.loadAliases();
		if (this.aliases) return this.aliases;
		const aliases = new Map<ID, ID>();
		// @pokebedrock - Straight import of aliases, no need to load from file
		for (const [alias, target] of Object.entries(Aliases)) {
			aliases.set(alias as ID, toID(target));
		}
		const compoundNames = new Map<ID, string>();
		// @pokebedrock - Straight import of compound word names, no need to load from file
		for (const name of CompoundWordNames) {
			compoundNames.set(toID(name), name);
		}

		const fuzzyAliases = new Map<ID, ID[]>();
		const addFuzzy = (alias: ID, target: ID) => {
			if (alias === target) return;
			if (alias.length < 2) return;
			const prev = fuzzyAliases.get(alias) || [];
			if (!prev.includes(target)) prev.push(target);
			fuzzyAliases.set(alias, prev);
		};
		const addFuzzyForme = (alias: ID, target: ID, forme: ID, formeLetter: ID) => {
			addFuzzy(`${alias}${forme}` as ID, target);
			if (!forme) return;
			addFuzzy(`${alias}${formeLetter}` as ID, target);
			addFuzzy(`${formeLetter}${alias}` as ID, target);
			if (forme === 'alola') addFuzzy(`alolan${alias}` as ID, target);
			else if (forme === 'galar') addFuzzy(`galarian${alias}` as ID, target);
			else if (forme === 'hisui') addFuzzy(`hisuian${alias}` as ID, target);
			else if (forme === 'paldea') addFuzzy(`paldean${alias}` as ID, target);
			else if (forme === 'megax') addFuzzy(`mega${alias}x` as ID, target);
			else if (forme === 'megay') addFuzzy(`mega${alias}y` as ID, target);
			else addFuzzy(`${forme}${alias}` as ID, target);

			if (forme === 'megax' || forme === 'megay') {
				addFuzzy(`mega${alias}` as ID, target);
				addFuzzy(`${alias}mega` as ID, target);
				addFuzzy(`m${alias}` as ID, target);
				addFuzzy(`${alias}m` as ID, target);
			}
		};
		for (const table of ['Items', 'Abilities', 'Moves', 'Pokedex'] as const) {
			const data = this.data[table];
			for (const [id, entry] of Object.entries(data) as [ID, DexTableData[typeof table][string]][]) {
				let name = compoundNames.get(id) || entry.name;
				let forme = '' as ID;
				let formeLetter = '' as ID;
				if (name.includes('(')) {
					addFuzzy(toID(name.split('(')[0]), id);
				}
				if (table === 'Pokedex') {
					// can't Dex.species.get; aliases isn't loaded
					const species = entry as DexTableData['Pokedex'][string];
					const baseid = toID(species.baseSpecies);
					if (baseid && baseid !== id) {
						name = compoundNames.get(baseid) || baseid;
					}
					forme = toID(species.forme || species.baseForme);
					if (forme === 'fan') {
						formeLetter = 's' as ID;
					} else if (forme === 'bloodmoon') {
						formeLetter = 'bm' as ID;
					} else {
						// not doing baseForme as a hack to make aliases point to base forme
						formeLetter = (species.forme || '').split(/ |-/).map(part => toID(part).charAt(0)).join('') as ID;
					}
					addFuzzy(forme, id);
				}

				addFuzzyForme(toID(name), id, forme, formeLetter);
				const fullSplit = name.split(/ |-/).map(toID);
				if (fullSplit.length < 2) continue;
				const fullAcronym = fullSplit.map(x => x.charAt(0)).join('');
				addFuzzyForme(fullAcronym as ID, id, forme, formeLetter);
				const fullAcronymWord = fullAcronym + fullSplit[fullSplit.length - 1].slice(1);
				addFuzzyForme(fullAcronymWord as ID, id, forme, formeLetter);
				for (const wordPart of fullSplit) addFuzzyForme(wordPart, id, forme, formeLetter);

				const spaceSplit = name.split(' ').map(toID);
				if (spaceSplit.length !== fullSplit.length) {
					const spaceAcronym = spaceSplit.map(x => x.charAt(0)).join('');
					addFuzzyForme(spaceAcronym as ID, id, forme, formeLetter);
					const spaceAcronymWord = spaceAcronym + spaceSplit[spaceSplit.length - 1].slice(1);
					addFuzzyForme(spaceAcronymWord as ID, id, forme, formeLetter);
					for (const word of fullSplit) addFuzzyForme(word, id, forme, formeLetter);
				}
			}
		}

		(this as any).aliases = aliases satisfies this['aliases'];
		(this as any).fuzzyAliases = fuzzyAliases satisfies this['fuzzyAliases'];
		return this.aliases!;
	}
	loadData(): DexTableData {
		if (this.dataCache) return this.dataCache;
		dexes['base'].includeMods();
		const dataCache: { [k in keyof DexTableData]?: any } = {};

		const basePath = this.dataDir + '/';

		const Scripts = this.loadDataFile(basePath, 'Scripts') || {};
		// We want to inherit most of Scripts but not this.
		const init = Scripts.init;
		this.parentMod = this.isBase ? '' : (Scripts.inherit || 'base');

		let parentDex;
		if (this.parentMod) {
			parentDex = dexes[this.parentMod];
			if (!parentDex || parentDex === this) {
				throw new Error(
					`Unable to load ${this.currentMod}. 'inherit' in scripts.ts should specify a parent mod from which to inherit data, or must be not specified.`
				);
			}
		}

		if (!parentDex) {
			// Formats are inherited by mods and used by Rulesets
			this.includeFormats();
		}
		for (const dataType of DATA_TYPES) {
			dataCache[dataType] = this.loadDataFile(basePath, dataType);
			if (dataType === 'Rulesets' && !parentDex) {
				for (const format of this.formats.all()) {
					dataCache.Rulesets[format.id] = { ...format, ruleTable: null };
				}
			}
		}
		if (parentDex) {
			for (const dataType of DATA_TYPES) {
				const parentTypedData: DexTable<any> = parentDex.data[dataType];
				if (!dataCache[dataType] && !init) {
					dataCache[dataType] = parentTypedData;
					continue;
				}
				const childTypedData: DexTable<any> = dataCache[dataType] || (dataCache[dataType] = {});
				for (const entryId in parentTypedData) {
					if (childTypedData[entryId] === null) {
						// null means don't inherit
						delete childTypedData[entryId];
					} else if (!(entryId in childTypedData)) {
						// If it doesn't exist it's inherited from the parent data
						childTypedData[entryId] = parentTypedData[entryId];
					} else if (childTypedData[entryId]?.inherit) {
						// {inherit: true} can be used to modify only parts of the parent data,
						// instead of overwriting entirely
						delete childTypedData[entryId].inherit;

						// Merge parent and child's entry, with child overwriting parent.
						childTypedData[entryId] = { ...parentTypedData[entryId], ...childTypedData[entryId] };
					}
				}
			}
		}

		// Flag the generation. Required for team validator.
		this.gen = dataCache.Scripts.gen;
		if (!this.gen) throw new Error(`Mod ${this.currentMod} needs a generation number in scripts.js`);
		this.dataCache = dataCache as DexTableData;

		// Execute initialization script.
		if (init) init.call(this);

		return this.dataCache;
	}

	includeFormats(): this {
		this.formats.load();
		return this;
	}
}

dexes['base'] = new ModdedDex();

// "gen9" is an alias for the current base data
dexes[BASE_MOD] = dexes['base'];

export const Dex = dexes['base'];
export declare namespace Dex {
	export type Species = import('./dex-species').Species;
	export type Item = import('./dex-items').Item;
	export type Move = import('./dex-moves').Move;
	export type Ability = import('./dex-abilities').Ability;

	export type HitEffect = import('./dex-moves').HitEffect;
	export type SecondaryEffect = import('./dex-moves').SecondaryEffect;
	export type RuleTable = import('./dex-formats').RuleTable;

	export type GenderName = 'M' | 'F' | 'N' | '';
	export type StatIDExceptHP = 'atk' | 'def' | 'spa' | 'spd' | 'spe';
	export type StatID = 'hp' | StatIDExceptHP;
	export type StatsExceptHPTable = { [stat in StatIDExceptHP]: number };
	export type StatsTable = { [stat in StatID]: number };
	export type SparseStatsTable = Partial<StatsTable>;
	export type BoostID = StatIDExceptHP | 'accuracy' | 'evasion';
	export type BoostsTable = { [boost in BoostID]: number };
	export type SparseBoostsTable = Partial<BoostsTable>;
}

export default Dex;
