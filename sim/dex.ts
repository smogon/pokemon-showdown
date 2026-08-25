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

import * as fs from 'fs';
import * as path from 'path';

import * as Data from './dex-data';
import type { TextLanguage } from './dex-data';
import { Condition, DexConditions } from './dex-conditions';
import { DataMove, DexMoves } from './dex-moves';
import { Item, DexItems } from './dex-items';
import { Ability, DexAbilities } from './dex-abilities';
import { Species, DexSpecies } from './dex-species';
import { Format, DexFormats } from './dex-formats';
import { Utils } from '../lib/utils';
import { Tags } from '../data/tags';

const BASE_MOD = 'gen9' as ID;
const DATA_DIR = path.resolve(__dirname, '../data');
const MODS_DIR = path.resolve(DATA_DIR, './mods');

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
interface RawTextTableData {
	Abilities: DexTable<AbilityText>;
	Items: DexTable<ItemText>;
	Moves: DexTable<MoveText>;
	PokedexNames: DexTable<TranslationString>;
	TermNames: DexTable<TranslationString>;
	TypeNames: DexTable<TranslationString>;
	NatureNames: DexTable<TranslationString>;
	CategoryNames: DexTable<TranslationString>;
	GenderNames: DexTable<TranslationString>;
	EggGroupNames: DexTable<TranslationString>;
	TagNames: DexTable<TranslationString>;
	ColorNames: DexTable<TranslationString>;
	ShapeNames: DexTable<TranslationString>;
	Default: DexTable<DefaultText>;
}
interface TextTableData {
	Abilities: DexTable<ResolvedAbilityText>;
	Items: DexTable<ResolvedItemText>;
	Moves: DexTable<ResolvedMoveText>;
	PokedexNames: DexTable<string>;
	TermNames: DexTable<string>;
	TypeNames: DexTable<string>;
	NatureNames: DexTable<string>;
	CategoryNames: DexTable<string>;
	GenderNames: DexTable<string>;
	EggGroupNames: DexTable<string>;
	TagNames: DexTable<string>;
	ColorNames: DexTable<string>;
	ShapeNames: DexTable<string>;
	Default: DexTable<DefaultText>;
}

type OtherNameTable =
	'TermNames' | 'TypeNames' | 'NatureNames' | 'CategoryNames' | 'GenderNames' |
	'EggGroupNames' | 'TagNames' | 'ColorNames' | 'ShapeNames';
const OTHER_NAME_TABLES: OtherNameTable[] = [
	'TermNames', 'TypeNames', 'NatureNames', 'CategoryNames', 'GenderNames',
	'EggGroupNames', 'TagNames', 'ColorNames', 'ShapeNames',
];

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
	textCache: { [lang: string]: TextTableData | null | undefined };
	rawTextCache: { [lang: string]: RawTextTableData | null | undefined };

	deepClone = Utils.deepClone;
	deepFreeze = Utils.deepFreeze;
	Multiset = Utils.Multiset;

	readonly formats: DexFormats;
	readonly abilities: DexAbilities;
	readonly items: DexItems;
	readonly moves: DexMoves;
	readonly species: DexSpecies;
	readonly conditions: DexConditions;
	readonly text: Data.DexText;
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
		this.textCache = {};
		this.rawTextCache = {};

		this.formats = new DexFormats(this);
		this.abilities = new DexAbilities(this);
		this.items = new DexItems(this);
		this.moves = new DexMoves(this);
		this.species = new DexSpecies(this);
		this.conditions = new DexConditions(this);
		this.text = new Data.DexText(this);
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
		return dexes[mod || BASE_MOD].includeData();
	}

	/**
	 * Lets the `this` ModdedDex own the requested data entry, by deep-cloning it,
	 * and returns it.
	 *
	 * Includes a fast path in case a copy has already been performed.
	 * If the data entry was copied by `loadData` rather than `modData`
	 * (for instance, if pokedex.ts with inherit: true is used on the same Pokémon),
	 * the fast path will return an unsafe (not owned) shallow clone.
	 *
	 * Make sure the arguments passed to `modData` are safe according to the architecture
	 * of your mod, because the dex loader will not check them for you.
	 *
	 * Note that the `force` parameter disables the fast path, thus
	 * enabling piecewise modding through both techniques: data files and `scripts.ts`.
	 */
	modData(dataType: DataType, id: string, force?: boolean) {
		if (this.isBase) return this.data[dataType][id];
		if (!force && this.data[dataType][id] !== dexes[this.parentMod].data[dataType][id]) {
			return this.data[dataType][id];
		}
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

	isTagged(thing: Species | Move | Item | Ability, tagName: string) {
		const tag = Tags[toID(tagName)];
		if (!tag) return undefined;
		if (thing.effectType === 'Pokemon') {
			return !!(tag.speciesFilter || tag.genericFilter)?.(thing);
		}
		if (thing.effectType === 'Move') {
			return !!(tag.moveFilter || tag.genericFilter)?.(thing);
		}
		return !!tag.genericFilter?.(thing);
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
	}

	loadTextFile(
		name: string, exportName: string, optional = false
	): DexTable<MoveText | ItemText | AbilityText | TranslationString> {
		const filePath = `${DATA_DIR}/text/${name}`;
		if (optional) {
			try {
				require.resolve(filePath);
			} catch (e: any) {
				if (e.code === 'MODULE_NOT_FOUND' || e.code === 'ENOENT') return {};
				throw e;
			}
		}
		return require(filePath)[exportName];
	}

	includeMods(): this {
		if (!this.isBase) throw new Error(`This must be called on the base Dex`);
		if (this.modsLoaded) return this;

		for (const mod of fs.readdirSync(MODS_DIR)) {
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

	loadTextData(lang: TextLanguage = 'en'): TextTableData {
		if (!this.gen) this.loadData();
		lang ||= 'en';
		const cacheKey = `${this.gen}:${lang}`;
		const cached = dexes['base'].textCache[cacheKey];
		if (cached) return cached;

		const englishData = this.loadRawTextData();
		const localizedData = lang === 'en' ? englishData : this.loadRawTextData(lang);
		return (dexes['base'].textCache[cacheKey] = {
			PokedexNames: this.resolveNameTable(englishData.PokedexNames, localizedData.PokedexNames),
			...this.resolveOtherNameTables(englishData, localizedData),
			Moves: this.resolveTextTable(englishData.Moves, localizedData.Moves),
			Abilities: this.resolveTextTable(englishData.Abilities, localizedData.Abilities),
			Items: this.resolveTextTable(englishData.Items, localizedData.Items),
			Default: localizedData.Default,
		});
	}

	private loadRawTextData(lang: TextLanguage = 'en'): RawTextTableData {
		const cached = dexes['base'].rawTextCache[lang];
		if (cached) return cached;
		const langDir = lang === 'en' ? `` : `${lang}/`;
		const optional = lang !== 'en';
		const otherNameTables = Object.fromEntries(OTHER_NAME_TABLES.map(table => [
			table, this.loadTextFile(`${langDir}other-names`, table, optional),
		])) as Pick<RawTextTableData, OtherNameTable>;
		const data: RawTextTableData = {
			PokedexNames: this.loadTextFile(
				`${langDir}pokedex-names`, 'PokedexNames', optional
			) as Record<string, TranslationString>,
			...otherNameTables,
			Moves: this.loadTextFile(`${langDir}moves`, 'MovesText', optional) as DexTable<MoveText>,
			Abilities: this.loadTextFile(`${langDir}abilities`, 'AbilitiesText', optional) as DexTable<AbilityText>,
			Items: this.loadTextFile(`${langDir}items`, 'ItemsText', optional) as DexTable<ItemText>,
			Default: this.loadTextFile(`${langDir}default`, 'DefaultText', optional) as DexTable<DefaultText>,
		};
		if (lang !== 'en') this.validateTranslations(data, lang);
		return (dexes['base'].rawTextCache[lang] = data);
	}

	private resolveNameTable(
		englishTable: Record<string, TranslationString>, localizedTable: Record<string, TranslationString>
	): Record<string, string> {
		const table: Record<string, string> = {};
		for (const id in englishTable) {
			table[id] = localizedTable[id] ?? englishTable[id]!;
		}
		return table;
	}

	private resolveOtherNameTables(
		englishData: RawTextTableData, localizedData: RawTextTableData
	): Pick<TextTableData, OtherNameTable> {
		return Object.fromEntries(OTHER_NAME_TABLES.map(table => [
			table, this.resolveNameTable(englishData[table], localizedData[table]),
		])) as Pick<TextTableData, OtherNameTable>;
	}

	private validateTranslations(value: unknown, lang: string, keyPath = ''): void {
		if (value === '') {
			throw new Error(`${lang} translation ${keyPath} must use null to fall back to English`);
		}
		if (!value || typeof value !== 'object') return;
		for (const [key, child] of Object.entries(value)) {
			this.validateTranslations(child, lang, keyPath ? `${keyPath}.${key}` : key);
		}
	}

	private resolveTextTable<T extends AbilityText | ItemText | MoveText>(
		englishTable: DexTable<T>, localizedTable: DexTable<T>
	): DexTable<ResolvedText<T>> {
		const table: DexTable<ResolvedText<T>> = {};
		for (const id in englishTable) {
			const englishEntry = englishTable[id];
			const localizedEntry = localizedTable[id];
			const englishDesc = this.resolveTextField(englishEntry, englishEntry, 'desc');
			const englishShortDesc = this.resolveTextField(englishEntry, englishEntry, 'shortDesc');
			const localizedDesc = this.resolveTextField(localizedEntry, englishEntry, 'desc');
			const localizedShortDesc = this.resolveTextField(localizedEntry, englishEntry, 'shortDesc');
			table[id] = {
				...(localizedEntry || englishEntry),
				name: localizedEntry?.name ?? englishEntry.name,
				desc: localizedDesc || englishDesc || localizedShortDesc || englishShortDesc,
				shortDesc: localizedShortDesc || englishShortDesc || localizedDesc || englishDesc,
			} as ResolvedText<T>;
		}
		return table;
	}

	private resolveTextField<T extends AbilityText | ItemText | MoveText>(
		localizedEntry: T | undefined, englishEntry: T, field: 'desc' | 'shortDesc'
	): string {
		const genKeys = Object.keys(englishEntry)
			.filter(key => /^gen\d+$/.test(key) && Number(key.slice(3)) >= this.gen)
			.sort((a, b) => Number(a.slice(3)) - Number(b.slice(3)));
		for (const genKey of genKeys) {
			const englishGen = (englishEntry as AnyObject)[genKey] as BasicTextData | undefined;
			if (!englishGen?.[field]) continue;
			const localizedGen = (localizedEntry as AnyObject | undefined)?.[genKey] as BasicTextData | undefined;
			return localizedGen?.[field] || '';
		}
		return localizedEntry?.[field] || '';
	}

	getAlias(id: ID): ID | undefined {
		return this.loadAliases().get(id);
	}

	loadAliases(): NonNullable<ModdedDex['aliases']> {
		if (!this.isBase) return Dex.loadAliases();
		if (this.aliases) return this.aliases;
		const exported = require(path.resolve(DATA_DIR, 'aliases'));
		const aliases = new Map<ID, ID>();
		for (const [alias, target] of Object.entries(exported.Aliases)) {
			aliases.set(alias as ID, toID(target));
		}
		const compoundNames = new Map<ID, string>();
		for (const name of exported.CompoundWordNames) {
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

						// {inherit: true} can also be used to inherit parts of conditions
						if (childTypedData[entryId].condition?.inherit) {
							delete childTypedData[entryId].condition.inherit;
							childTypedData[entryId].condition = {
								...parentTypedData[entryId].condition,
								...childTypedData[entryId].condition,
							};
						}

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
