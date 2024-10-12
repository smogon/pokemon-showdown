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
 * - Dex.scanMods()
 *   This will scan the mods folder and give you the Set of names of possible mods.
 * - Dex.includeMods()
 *   This will preload all mods and their data.
 * - Dex.includeFormats()
 *   Deprecated.
 * - Dex.includeData()
 *   Deprecated.
 * - Dex.includeModData()
 *   This will preload all mods and their data.
 *
 * Note that preloading is never necessary. All the data will be
 * automatically preloaded when needed, preloading will just spend time
 * now so you don't need to spend time later.
 *
 * @license MIT
 */

import * as fs from 'fs';
import * as path from 'path';

import * as Data from './dex-data';
import {Condition, DexConditions} from './dex-conditions';
import {DataMove, DexMoves} from './dex-moves';
import {Item, DexItems} from './dex-items';
import {Ability, DexAbilities} from './dex-abilities';
import {Species, DexSpecies} from './dex-species';
import {Format, DexFormats} from './dex-formats';
import {Utils} from '../lib';

const BASE_MOD = 'gen9' as ID;
const BASE_MOD_GEN = 9;
const DATA_DIR = path.resolve(__dirname, '../data');
const MODS_DIR = path.resolve(DATA_DIR, './mods');

const detectedMods: Set<string> = new Set();
let modsScanned = false;
const dexes: {[mod: string]: ModdedDex} = Object.create(null);
const textCache = {
	Pokedex: require(DATA_DIR + '/text/pokedex').PokedexText,
	Moves: require(DATA_DIR + '/text/moves').MovesText,
	Abilities: require(DATA_DIR + '/text/abilities').AbilitiesText,
	Items: require(DATA_DIR + '/text/items').ItemsText,
	Default: require(DATA_DIR + '/text/default').DefaultText,
};

type DataType =
	'Abilities' | 'Rulesets' | 'FormatsData' | 'Items' | 'Learnsets' | 'Moves' |
	'Natures' | 'Pokedex' | 'Scripts' | 'Conditions' | 'TypeChart' | 'PokemonGoData';
const DATA_TYPES: DataType[] = [
	'Abilities', 'Rulesets', 'FormatsData', 'Items', 'Learnsets', 'Moves',
	'Natures', 'Pokedex', 'Scripts', 'Conditions', 'TypeChart', 'PokemonGoData',
];

const DATA_FILES = {
	Abilities: 'abilities',
	Aliases: 'aliases',
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
export interface DexTable<T> {[id: string]: T}
export interface AliasesTable {[id: IDEntry]: string}

interface DexTableData {
	Abilities: DexTable<import('./dex-abilities').AbilityData>;
	Aliases: DexTable<string>;
	Rulesets: DexTable<import('./dex-formats').FormatData>;
	Items: DexTable<import('./dex-items').ItemData>;
	Learnsets: DexTable<import('./dex-species').LearnsetData>;
	Moves: DexTable<import('./dex-moves').MoveData>;
	Natures: DexTable<Data.NatureData>;
	Pokedex: DexTable<import('./dex-species').SpeciesData>;
	FormatsData: DexTable<import('./dex-species').SpeciesFormatsData>;
	PokemonGoData: DexTable<import('./dex-species').PokemonGoData>;
	Scripts: DexTable<AnyObject>;
	Conditions: DexTable<import('./dex-conditions').ConditionData>;
	TypeChart: DexTable<Data.TypeData>;
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

	readonly gen: number;
	readonly parentMod: string;
	modsLoaded = false; // TODO: deprecate

	dataCache: DexTableData;

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

	constructor(mod = 'base') {
		if (mod in dexes) {
			throw new Error(`Trying to construct a mod twice: ${mod}`);
		}
		this.isBase = (mod === 'base');
		this.currentMod = mod;
		this.dataDir = (this.isBase ? DATA_DIR : MODS_DIR + '/' + this.currentMod);

		const basePath = this.dataDir + '/';
		const Scripts = this.loadDataFile(basePath, 'Scripts');
		this.parentMod = this.isBase ? '' : (Scripts.inherit || 'base');

		let parentDex;
		if (this.parentMod) {
			parentDex = this.mod(this.parentMod);
			if (!parentDex || parentDex === this) {
				throw new Error(
					`Unable to load ${this.currentMod}. 'inherit' in scripts.ts should specify a parent mod from which to inherit data, or must be not specified.`
				);
			}
		}
		// Flag the generation. Required for team validator.
		const gen = Scripts.gen || parentDex?.gen;
		if (typeof gen !== 'number') throw new Error(`Mod ${this.currentMod} needs a generation number in scripts.js`);
		this.gen = gen;

		this.formats = new DexFormats(this);

		const dataCache: {[k in keyof DexTableData]?: any} = {};
		for (const dataType of DATA_TYPES) {
			dataCache[dataType] = this.loadDataFile(basePath, dataType);
		}
		if (!parentDex) {
			dataCache['Aliases'] = this.loadDataFile(basePath, 'Aliases');
			// Formats are inherited by mods and used by Rulesets
			this.formats.load();
			const r = dataCache['Rulesets'];
			for (const format of this.formats.all()) {
				r[format.id] = {...format, ruleTable: null};
			}
		}
		if (parentDex) {
			dataCache['Aliases'] = parentDex.data['Aliases'];
			for (const dataType of DATA_TYPES) {
				const parentTypedData: DexTable<any> = parentDex.data[dataType];
				const childTypedData: DexTable<any> = dataCache[dataType] || (dataCache[dataType] = {});
				// if child is empty and there's no Scripts.init, there's no need to copy - just re-use.
				let childIsEmpty = true;
				for (const k in childTypedData) { // eslint-disable-line @typescript-eslint/no-unused-vars
					childIsEmpty = false;
					break;
				}
				if (dataType !== 'Pokedex' && childIsEmpty && !Scripts.init) {
					dataCache[dataType] = parentTypedData;
					continue;
				}
				for (const entryId in parentTypedData) {
					if (childTypedData[entryId] === null) {
						// null means don't inherit
						delete childTypedData[entryId];
					} else if (!(entryId in childTypedData)) {
						childTypedData[entryId] = parentTypedData[entryId];
					} else if (childTypedData[entryId] && childTypedData[entryId].inherit) {
						// {inherit: true} can be used to modify only parts of the parent data,
						// instead of overwriting entirely
						delete childTypedData[entryId].inherit;

						// Merge parent into children entry, preserving existing childs' properties.
						for (const key in parentTypedData[entryId]) {
							if (key in childTypedData[entryId]) continue;
							childTypedData[entryId][key] = parentTypedData[entryId][key];
						}
					}
				}
			}
		}
		this.dataCache = dataCache as DexTableData;

		// Execute initialization script.
		if (Scripts.init) Scripts.init.call(this);

		this.abilities = new DexAbilities(this);
		this.items = new DexItems(this);
		this.moves = new DexMoves(this);
		this.species = new DexSpecies(this);
		this.conditions = new DexConditions(this);
		this.natures = new Data.DexNatures(this);
		this.types = new Data.DexTypes(this);
		this.stats = new Data.DexStats(this);
	}

	// TODO: un-getter-ify
	get data(): DexTableData {
		return this.dataCache;
	}

	// TODO: deprecate
	get dexes(): {[mod: string]: ModdedDex} {
		this.includeMods();
		return dexes;
	}

	mod(mod: string): ModdedDex {
		if (!(mod in dexes) && Dex.scanMods().has(mod)) {
			dexes[mod] = new ModdedDex(mod);
		}
		return dexes[mod];
	}

	forGen(gen: number) {
		if (!gen) return this;
		return this.mod(`gen${gen}`);
	}

	forFormat(format: Format | string): ModdedDex {
		const mod = this.formats.get(format).mod;
		return this.mod(mod || BASE_MOD);
	}

	modData(dataType: DataType, id: string) {
		if (this.isBase) return this.data[dataType][id];
		if (this.data[dataType][id] !== this.mod(this.parentMod).data[dataType][id]) return this.data[dataType][id];
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
		name = ('' + name).replace(/[|\s[\],\u202e]+/g, ' ').trim();
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
		source: {type: string} | string,
		target: {getTypes: () => string[]} | {types: string[]} | string[] | string
	): boolean {
		const sourceType: string = typeof source !== 'string' ? source.type : source;
		// @ts-ignore
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
		source: {type: string} | string,
		target: {getTypes: () => string[]} | {types: string[]} | string[] | string
	): number {
		const sourceType: string = typeof source !== 'string' ? source.type : source;
		// @ts-ignore
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
		const entry = textCache[table][id];
		if (!entry) return null;
		const descs = {
			desc: '',
			shortDesc: '',
		};
		for (let i = this.gen; i < BASE_MOD_GEN; i++) {
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
		const stats = {hp: 31, atk: 31, def: 31, spe: 31, spa: 31, spd: 31};
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
	trunc(num: number, bits = 0) {
		if (bits) return (num >>> 0) % (2 ** bits);
		return num >>> 0;
	}

	dataSearch(
		target: string, searchIn?: ('Pokedex' | 'Moves' | 'Abilities' | 'Items' | 'Natures')[] | null, isInexact?: boolean
	): AnyObject[] | null {
		if (!target) return null;

		searchIn = searchIn || ['Pokedex', 'Moves', 'Abilities', 'Items', 'Natures'];

		const searchObjects = {
			Pokedex: 'species', Moves: 'moves', Abilities: 'abilities', Items: 'items', Natures: 'natures',
		} as const;
		const searchTypes = {
			Pokedex: 'pokemon', Moves: 'move', Abilities: 'ability', Items: 'item', Natures: 'nature',
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
			// all of these support .all()
			const searchObj = this[searchObjects[table]];
			if (!searchObj) continue;

			for (const j of searchObj.all()) {
				const ld = Utils.levenshtein(cmpTarget, j.id, maxLd);
				if (ld <= maxLd) {
					const word = j.name;
					const results = this.dataSearch(word, searchIn, !!word);
					if (results) {
						searchResults = results;
						maxLd = ld;
					}
				}
			}
		}
		// but Aliases doesn't support .all()
		for (const j in this.data.Aliases) {
			const ld = Utils.levenshtein(cmpTarget, j, maxLd);
			if (ld <= maxLd) {
				const word = j;
				const results = this.dataSearch(word, searchIn, !!word);
				if (results) {
					searchResults = results;
					maxLd = ld;
				}
			}
		}

		return searchResults;
	}

	loadDataFile(basePath: string, dataType: DataType | 'Aliases'): AnyObject {
		try {
			const filePath = basePath + DATA_FILES[dataType];
			const dataObject = require(filePath);
			if (!dataObject || typeof dataObject !== 'object') {
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
		return {};
	}

	// TODO: deprecate
	loadTextFile(
		name: string, exportName: string
	): DexTable<MoveText | ItemText | AbilityText | PokedexText | DefaultText> {
		return require(`${DATA_DIR}/text/${name}`)[exportName];
	}

	// TODO: deprecate
	includeMods(): this {
		if (!this.isBase) throw new Error(`This must be called on the base Dex`);
		if (this.modsLoaded) return this;

		for (const mod of fs.readdirSync(MODS_DIR)) {
			this.mod(mod);
		}
		this.modsLoaded = true;

		return this;
	}

	scanMods(force = false): Set<string> {
		if (force || !modsScanned) {
			modsScanned = true;
			for (const mod in dexes) {
				detectedMods.add(mod);
			}
			for (const mod of fs.readdirSync(MODS_DIR)) {
				detectedMods.add(mod);
			}
		}
		return detectedMods;
	}

	includeModData(): this {
		for (const mod in this.scanMods()) {
			this.mod(mod);
		}
		return this;
	}

	// TODO: deprecate
	includeData(): this {
		console.log("dex.includeData() - This is no longer necessary to call!");
		return this;
	}

	// TODO: deprecate
	loadTextData() {
		return textCache;
	}

	// TODO: deprecate
	loadData(): DexTableData {
		console.log("dex.loadData() - This is no longer necessary to call!");
		return this.dataCache;
	}

	// TODO: deprecate
	includeFormats(): this {
		console.log("dex.includeFormats() - This is no longer necessary to call!");
		return this;
	}
}

detectedMods.add('base');
detectedMods.add(BASE_MOD);
dexes['base'] = new ModdedDex();

// "gen9" is an alias for the current base data
dexes[BASE_MOD] = dexes['base'];

export const Dex = dexes['base'];

// populate _toIDCache with data from base mod.
// It's representative enough for all other mods, so we don't need to dynamically grow the cache.
{
	const cache = Data._toIDCache;
	const sources: readonly (readonly BasicEffect[])[] = [
		Dex.species.all(), Dex.items.all(), Dex.moves.all(),
		Dex.types.all() as any as readonly BasicEffect[], Dex.abilities.all(), Dex.natures.all(),
	];
	for (const source of sources) {
		for (const effect of source) {
			const name = effect.name;
			if (!name) continue;
			// we can't just use effect.id because of cases like hidden power
			const id = toID(name);
			const old = cache.get(name);
			if (old === undefined) cache.set(name, id);
			else if (old !== id) throw new Error("internal error with ID logic");
		}
	}
	const aliases = Dex.data.Aliases;
	for (const k in aliases) {
		const name = aliases[k];
		const id = toID(name);
		const old = cache.get(name);
		if (old === undefined) cache.set(name, id);
		else if (old !== id) throw new Error("internal error with ID logic");
	}
	Object.freeze(cache);
}

export namespace Dex {
	export type Species = import('./dex-species').Species;
	export type Item = import('./dex-items').Item;
	export type Move = import('./dex-moves').Move;
	export type Ability = import('./dex-abilities').Ability;

	export type HitEffect = import('./dex-moves').HitEffect;
	export type SecondaryEffect = import('./dex-moves').SecondaryEffect;
	export type RuleTable = import('./dex-formats').RuleTable;
}

export default Dex;
