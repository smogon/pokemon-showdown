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
 *   This will populate Dex.dexes, giving you a list of possible mods.
 *   Note that you don't need this for Dex.mod, Dex.mod will
 *   automatically populate this.
 * - Dex.includeFormats() ~30ms
 *   As above, but will also populate Dex.formats, giving an object
 *   containing formats.
 * - Dex.includeData() ~500ms
 *   As above, but will also preload all of Dex.data, giving access to
 *   the data access functions like Dex.getTemplate, Dex.getMove, etc.
 * - Dex.includeModData() ~1500ms
 *   As above, but will also preload Dex.dexes[...].data for all mods.
 *
 * Note that preloading is only necessary for iterating Dex.dexes. Getters
 * like Dex.getTemplate will automatically load this data as needed.
 *
 * @license MIT license
 */

// TODO: Fix all usages of for-in on arrays to use for-of instead.
// @ts-ignore
Object.defineProperty(Array.prototype, 'flatMap', {
	value(callback: any, thisArg: any) {
		const newArray = [];
		for (let i = 0; i < this.length; i++) {
			newArray.push(...callback.call(thisArg, this[i], i, this));
		}
		return newArray;
	},
	configurable: true,
	writable: true,
});

import * as fs from 'fs';
import * as path from 'path';

import * as Data from './dex-data';
import {PRNG, PRNGSeed} from './prng';

const DATA_DIR = path.resolve(__dirname, '../data');
const MODS_DIR = path.resolve(__dirname, '../data/mods');
const FORMATS = path.resolve(__dirname, '../config/formats');

const dexes: {[mod: string]: ModdedDex} = Object.create(null);

type DataType =
	'Abilities' | 'Formats' | 'FormatsData' | 'Items' | 'Learnsets' | 'Movedex' |
	'Natures' | 'Pokedex' | 'Scripts' | 'Statuses' | 'TypeChart';
const DATA_TYPES: (DataType | 'Aliases')[] = [
	'Abilities', 'Formats', 'FormatsData', 'Items', 'Learnsets', 'Movedex',
	'Natures', 'Pokedex', 'Scripts', 'Statuses', 'TypeChart',
];

const DATA_FILES = {
	Abilities: 'abilities',
	Aliases: 'aliases',
	Formats: 'rulesets',
	FormatsData: 'formats-data',
	Items: 'items',
	Learnsets: 'learnsets',
	Movedex: 'moves',
	Natures: 'natures',
	Pokedex: 'pokedex',
	Scripts: 'scripts',
	Statuses: 'statuses',
	TypeChart: 'typechart',
};

const nullEffect: PureEffect = new Data.PureEffect({name: '', exists: false});

interface Nature {
	name: string;
	plus?: keyof StatsTable;
	minus?: keyof StatsTable;
	[k: string]: any;
}

interface DexTableData {
	Abilities: DexTable<Ability>;
	Aliases: {[id: string]: string};
	Formats: DexTable<Format>;
	FormatsData: DexTable<ModdedTemplateFormatsData>;
	Items: DexTable<Item>;
	Learnsets: DexTable<{learnset: {[k: string]: MoveSource[]}}>;
	Movedex: DexTable<Move>;
	Natures: DexTable<Nature>;
	Pokedex: DexTable<Template>;
	Scripts: DexTable<AnyObject>;
	Statuses: DexTable<EffectData>;
	TypeChart: DexTable<TypeData>;
}

const BattleNatures: {[k: string]: Nature} = {
	adamant: {name: "Adamant", plus: 'atk', minus: 'spa'},
	bashful: {name: "Bashful"},
	bold: {name: "Bold", plus: 'def', minus: 'atk'},
	brave: {name: "Brave", plus: 'atk', minus: 'spe'},
	calm: {name: "Calm", plus: 'spd', minus: 'atk'},
	careful: {name: "Careful", plus: 'spd', minus: 'spa'},
	docile: {name: "Docile"},
	gentle: {name: "Gentle", plus: 'spd', minus: 'def'},
	hardy: {name: "Hardy"},
	hasty: {name: "Hasty", plus: 'spe', minus: 'def'},
	impish: {name: "Impish", plus: 'def', minus: 'spa'},
	jolly: {name: "Jolly", plus: 'spe', minus: 'spa'},
	lax: {name: "Lax", plus: 'def', minus: 'spd'},
	lonely: {name: "Lonely", plus: 'atk', minus: 'def'},
	mild: {name: "Mild", plus: 'spa', minus: 'def'},
	modest: {name: "Modest", plus: 'spa', minus: 'atk'},
	naive: {name: "Naive", plus: 'spe', minus: 'spd'},
	naughty: {name: "Naughty", plus: 'atk', minus: 'spd'},
	quiet: {name: "Quiet", plus: 'spa', minus: 'spe'},
	quirky: {name: "Quirky"},
	rash: {name: "Rash", plus: 'spa', minus: 'spd'},
	relaxed: {name: "Relaxed", plus: 'def', minus: 'spe'},
	sassy: {name: "Sassy", plus: 'spd', minus: 'spe'},
	serious: {name: "Serious"},
	timid: {name: "Timid", plus: 'spe', minus: 'atk'},
};

const toId = Data.Tools.getId;

class ModdedDex {
	readonly Data: typeof Data;
	readonly ModdedDex: typeof ModdedDex;

	readonly name: string;
	readonly isBase: boolean;
	readonly currentMod: string;

	readonly getId: (text: any) => string;
	readonly getString: (str: any) => string;

	readonly abilityCache: Map<string, Ability>;
	readonly effectCache: Map<string, Effect | Move>;
	readonly itemCache: Map<string, Item>;
	readonly moveCache: Map<string, Move>;
	readonly templateCache: Map<string, Template>;
	readonly typeCache: Map<string, TypeInfo>;

	gen: number;
	parentMod: string;
	modsLoaded: boolean;

	dataCache: DexTableData | null;
	formatsCache: DexTable<Format> | null;

	constructor(mod: string = 'base', isOriginal: boolean = false) {
		this.ModdedDex = ModdedDex;
		this.Data = Data;

		this.name = "[ModdedDex]";
		this.isBase = (mod === 'base');
		this.currentMod = mod;

		this.getId = Data.Tools.getId;
		this.getString = Data.Tools.getString;

		this.abilityCache = new Map();
		this.effectCache = new Map();
		this.itemCache = new Map();
		this.moveCache = new Map();
		this.templateCache = new Map();
		this.typeCache = new Map();

		this.gen = 0;
		this.parentMod = '';
		this.modsLoaded = false;

		this.dataCache = null;
		this.formatsCache = null;

		if (!isOriginal) {
			const original = dexes['base'].mod(mod).includeData();
			this.currentMod = original.currentMod;

			this.gen = original.gen;
			this.parentMod = original.parentMod;

			this.abilityCache = original.abilityCache;
			this.itemCache = original.itemCache;
			this.moveCache = original.moveCache;
			this.templateCache = original.templateCache;

			this.dataCache = original.dataCache;
			this.formatsCache = original.formatsCache;
		}
	}

	get dataDir(): string {
		return (this.isBase ? DATA_DIR : MODS_DIR + '/' + this.currentMod);
	}

	get data(): DexTableData {
		return this.loadData();
	}

	get formats(): DexTable<Format> {
		this.includeFormats();
		return this.formatsCache!;
	}

	get dexes(): {[mod: string]: ModdedDex} {
		this.includeMods();
		return dexes;
	}

	mod(mod: string): ModdedDex {
		if (!dexes['base'].modsLoaded) dexes['base'].includeMods();
		return dexes[mod || 'base'];
	}

	forFormat(format: Format | string): ModdedDex {
		if (!this.modsLoaded) this.includeMods();
		const mod = this.getFormat(format).mod;
		return dexes[mod || 'gen7'];
	}

	modData(dataType: DataType, id: string) {
		if (this.isBase) return this.data[dataType][id];
		if (this.data[dataType][id] !== dexes[this.parentMod].data[dataType][id]) return this.data[dataType][id];
		return (this.data[dataType][id] = this.deepClone(this.data[dataType][id]));
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
		const targetTyping: string[] | string = target.getTypes && target.getTypes() || target.types || target;
		if (Array.isArray(targetTyping)) {
			for (const type of targetTyping) {
				if (!this.getImmunity(sourceType, type)) return false;
			}
			return true;
		}
		const typeData = this.data.TypeChart[targetTyping];
		if (typeData && typeData.damageTaken[sourceType] === 3) return false;
		return true;
	}

	getEffectiveness(
		source: {type: string} | string,
		target: {getTypes: () => string[]} | {types: string[]} | string[] | string
	): number {
		const sourceType: string = typeof source !== 'string' ? source.type : source;
		// @ts-ignore
		const targetTyping: string[] | string = target.getTypes && target.getTypes() || target.types || target;
		let totalTypeMod = 0;
		if (Array.isArray(targetTyping)) {
			for (const type of targetTyping) {
				totalTypeMod += this.getEffectiveness(sourceType, type);
			}
			return totalTypeMod;
		}
		const typeData = this.data.TypeChart[targetTyping];
		if (!typeData) return 0;
		switch (typeData.damageTaken[sourceType]) {
		case 1: return 1; // super-effective
		case 2: return -1; // resist
		// in case of weird situations like Gravity, immunity is handled elsewhere
		default: return 0;
		}
	}

	/**
	 * Convert a pokemon name, ID, or template into its species name, preserving
	 * form name (which is the main way Dex.getSpecies(id) differs from
	 * Dex.getTemplate(id).species).
	 */
	getSpecies(species: string | Template): string {
		const id = toId(species || '');
		const template = this.getTemplate(id);
		if (template.otherForms && template.otherForms.indexOf(id) >= 0) {
			const form = id.slice(template.species.length);
			if (form) return template.species + '-' + form[0].toUpperCase() + form.slice(1);
		}
		return template.species;
	}

	getTemplate(name?: string | Template): Template {
		if (name && typeof name !== 'string') return name;

		name = (name || '').trim();
		let id = toId(name);
		if (id === 'nidoran' && name.slice(-1) === '♀') {
			id = 'nidoranf';
		} else if (id === 'nidoran' && name.slice(-1) === '♂') {
			id = 'nidoranm';
		}
		let template: any = this.templateCache.get(id);
		if (template) return template;
		if (this.data.Aliases.hasOwnProperty(id)) {
			if (this.data.FormatsData.hasOwnProperty(id)) {
				// special event ID, like Rockruff-Dusk
				const baseId = toId(this.data.Aliases[id]);
				template = new Data.Template({name}, this.data.Pokedex[baseId], this.data.FormatsData[id], this.data.Learnsets[id]);
				template.name = id;
				template.species = id;
				template.speciesid = id;
				template.abilities = {0: template.abilities['S']};
			} else {
				template = this.getTemplate(this.data.Aliases[id]);
			}
			if (template) {
				this.templateCache.set(id, template);
			}
			return template;
		}
		if (!this.data.Pokedex.hasOwnProperty(id)) {
			let aliasTo = '';
			if (id.startsWith('mega') && this.data.Pokedex[id.slice(4) + 'mega']) {
				aliasTo = id.slice(4) + 'mega';
			} else if (id.startsWith('m') && this.data.Pokedex[id.slice(1) + 'mega']) {
				aliasTo = id.slice(1) + 'mega';
			} else if (id.startsWith('primal') && this.data.Pokedex[id.slice(6) + 'primal']) {
				aliasTo = id.slice(6) + 'primal';
			} else if (id.startsWith('p') && this.data.Pokedex[id.slice(1) + 'primal']) {
				aliasTo = id.slice(1) + 'primal';
			}
			if (aliasTo) {
				template = this.getTemplate(aliasTo);
				if (template.exists) {
					this.templateCache.set(id, template);
					return template;
				}
			}
		}
		if (id && this.data.Pokedex.hasOwnProperty(id)) {
			template = new Data.Template({name}, this.data.Pokedex[id], this.data.FormatsData[id], this.data.Learnsets[id]);
			// Inherit any statuses from the base species (Arceus, Silvally).
			const baseSpeciesStatuses = this.data.Statuses[toId(template.baseSpecies)];
			if (baseSpeciesStatuses !== undefined) {
				let key: keyof EffectData;
				for (key in baseSpeciesStatuses) {
					if (!(key in template)) template[key] = baseSpeciesStatuses[key];
				}
			}
			if (!template.tier && !template.doublesTier && template.baseSpecies !== template.species) {
				if (template.baseSpecies === 'Mimikyu') {
					template.tier = this.data.FormatsData[toId(template.baseSpecies)].tier || 'Illegal';
					template.doublesTier = this.data.FormatsData[toId(template.baseSpecies)].doublesTier || 'Illegal';
				} else if (template.speciesid.endsWith('totem')) {
					template.tier = this.data.FormatsData[template.speciesid.slice(0, -5)].tier || 'Illegal';
					template.doublesTier = this.data.FormatsData[template.speciesid.slice(0, -5)].doublesTier || 'Illegal';
				} else {
					template.tier = this.data.FormatsData[toId(template.baseSpecies)].tier || 'Illegal';
					template.doublesTier = this.data.FormatsData[toId(template.baseSpecies)].doublesTier || 'Illegal';
				}
			}
			if (!template.tier) template.tier = 'Illegal';
			if (!template.doublesTier) template.doublesTier = template.tier;
		} else {
			template = new Data.Template({name, exists: false});
		}
		if (template.exists) this.templateCache.set(id, template);
		return template;
	}

	getLearnset(template: string | AnyObject): AnyObject | null {
		const id = toId(template);
		if (!this.data.Learnsets[id]) return null;
		return this.data.Learnsets[id].learnset;
	}

	getMove(name?: string | Move): Move {
		if (name && typeof name !== 'string') return name;

		name = (name || '').trim();
		let id = toId(name);
		let move = this.moveCache.get(id);
		if (move) return move;
		if (this.data.Aliases.hasOwnProperty(id)) {
			move = this.getMove(this.data.Aliases[id]);
			if (move.exists) {
				this.moveCache.set(id, move);
			}
			return move;
		}
		if (id.substr(0, 11) === 'hiddenpower') {
			id = /([a-z]*)([0-9]*)/.exec(id)![1];
		}
		if (id && this.data.Movedex.hasOwnProperty(id)) {
			move = new Data.Move({name}, this.data.Movedex[id]);
		} else {
			move = new Data.Move({name, exists: false});
		}
		if (move.exists) this.moveCache.set(id, move);
		return move;
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
		move = this.getMove(move);
		const moveCopy: ActiveMove = this.deepClone(move);
		moveCopy.hit = 0;
		return moveCopy;
	}

	/**
	 * While this function can technically return any kind of effect at
	 * all, that's not a feature TypeScript needs to know about.
	 */
	getEffect(name?: string | Effect | null): PureEffect {
		if (!name) return nullEffect;
		if (typeof name !== 'string') return name as PureEffect;

		const id = toId(name);
		let effect = this.effectCache.get(id);
		if (effect) return effect as PureEffect;

		if (name.startsWith('move:')) {
			effect = this.getMove(name.slice(5));
		} else if (name.startsWith('item:')) {
			effect = this.getItem(name.slice(5));
		} else if (name.startsWith('ability:')) {
			effect = this.getAbility(name.slice(8));
		}
		if (effect) {
			this.effectCache.set(id, effect);
			// @ts-ignore
			return effect;
		}

		let found;
		if (this.data.Formats.hasOwnProperty(id)) {
			effect = new Data.Format({name}, this.data.Formats[id]);
		} else if (this.data.Statuses.hasOwnProperty(id)) {
			effect = new Data.PureEffect({name}, this.data.Statuses[id]);
		} else if ((this.data.Movedex.hasOwnProperty(id) && (found = this.data.Movedex[id]).effect) ||
							 (this.data.Abilities.hasOwnProperty(id) && (found = this.data.Abilities[id]).effect) ||
							 (this.data.Items.hasOwnProperty(id) && (found = this.data.Items[id]).effect)) {
			effect = new Data.PureEffect({name: found.name || name}, found.effect!);
		} else if (id === 'recoil') {
			effect = new Data.PureEffect({name: 'Recoil', effectType: 'Recoil'});
		} else if (id === 'drain') {
			effect = new Data.PureEffect({name: 'Drain', effectType: 'Drain'});
		} else {
			effect = new Data.PureEffect({name, exists: false});
		}

		this.effectCache.set(id, effect);
		return effect as PureEffect;
	}

	/**
	 * Returns a sanitized format ID if valid, or throws if invalid.
	 */
	validateFormat(name: string) {
		const [formatName, customRulesString] = name.split('@@@', 2);
		const format = this.getFormat(formatName);
		if (!format.exists) throw new Error(`Unrecognized format "${formatName}"`);
		if (!customRulesString) return format.id;
		const ruleTable = this.getRuleTable(format);
		const customRules = customRulesString.split(',').map(rule => {
			const ruleSpec = this.validateRule(rule);
			if (typeof ruleSpec === 'string' && ruleTable.has(ruleSpec)) return null;
			return rule.replace(/[\r\n|]*/g, '').trim();
		}).filter(rule => rule);
		if (!customRules.length) throw new Error(`The format already has your custom rules`);
		const validatedFormatid = format.id + '@@@' + customRules.join(',');
		const moddedFormat = this.getFormat(validatedFormatid, true);
		this.getRuleTable(moddedFormat);
		return validatedFormatid;
	}

	getFormat(name?: string | Format, isTrusted = false): Format {
		if (name && typeof name !== 'string') return name;

		name = (name || '').trim();
		let id = toId(name);
		if (this.data.Aliases.hasOwnProperty(id)) {
			name = this.data.Aliases[id];
			id = toId(name);
		}
		if (this.data.Formats.hasOwnProperty('gen7' + id)) {
			id = 'gen7' + id;
		}
		let supplementaryAttributes: AnyObject | null = null;
		if (name.includes('@@@')) {
			if (!isTrusted) {
				try {
					name = this.validateFormat(name);
					isTrusted = true;
				} catch (e) {}
			}
			const [newName, customRulesString] = name.split('@@@', 2);
			name = newName;
			id = toId(name);
			if (isTrusted && customRulesString) {
				supplementaryAttributes = {
					customRules: customRulesString.split(','),
					searchShow: false,
				};
			}
		}
		let effect;
		if (this.data.Formats.hasOwnProperty(id)) {
			effect = new Data.Format({name}, this.data.Formats[id], supplementaryAttributes);
		} else {
			effect = new Data.Format({name, exists: false});
		}
		return effect;
	}

	getItem(name?: string | Item): Item {
		if (name && typeof name !== 'string') return name;

		name = (name || '').trim();
		const id = toId(name);
		let item = this.itemCache.get(id);
		if (item) return item;
		if (this.data.Aliases.hasOwnProperty(id)) {
			item = this.getItem(this.data.Aliases[id]);
			if (item.exists) {
				this.itemCache.set(id, item);
			}
			return item;
		}
		if (id && !this.data.Items[id] && this.data.Items[id + 'berry']) {
			item = this.getItem(id + 'berry');
			this.itemCache.set(id, item);
			return item;
		}
		if (id && this.data.Items.hasOwnProperty(id)) {
			item = new Data.Item({name}, this.data.Items[id]);
		} else {
			item = new Data.Item({name, exists: false});
		}

		if (item.exists) this.itemCache.set(id, item);
		return item;
	}

	getAbility(name: string | Ability = ''): Ability {
		if (name && typeof name !== 'string') return name;

		const id = toId(name);
		let ability = this.abilityCache.get(id);
		if (ability) return ability;
		if (this.data.Aliases.hasOwnProperty(id)) {
			ability = this.getAbility(this.data.Aliases[id]);
			if (ability.exists) {
				this.abilityCache.set(id, ability);
			}
			return ability;
		}
		if (id && this.data.Abilities.hasOwnProperty(id)) {
			ability = new Data.Ability({name}, this.data.Abilities[id]);
		} else {
			ability = new Data.Ability({name, exists: false});
		}

		if (ability.exists) this.abilityCache.set(id, ability);
		return ability;
	}

	getType(name: string | TypeInfo): TypeInfo {
		if (name && typeof name !== 'string') return name;

		let id = toId(name);
		id = id.charAt(0).toUpperCase() + id.substr(1);
		let type = this.typeCache.get(id);
		if (type) return type;
		if (id && this.data.TypeChart.hasOwnProperty(id)) {
			type = new Data.TypeInfo({id}, this.data.TypeChart[id]);
		} else {
			type = new Data.TypeInfo({name, exists: false, effectType: 'EffectType'});
		}

		if (type.exists) this.typeCache.set(id, type);
		return type;
	}

	getNature(name: string | Nature): Nature {
		if (name && typeof name !== 'string') return name;

		name = (name || '').trim();
		const id = toId(name);
		// tslint:disable-next-line:no-object-literal-type-assertion
		let nature: Nature = {} as Nature;
		if (id && id !== 'constructor' && this.data.Natures[id]) {
			nature = this.data.Natures[id];
			if (nature.cached) return nature;
			nature.cached = true;
			nature.exists = true;
		}
		if (!nature.id) nature.id = id;
		if (!nature.name) nature.name = name;
		nature.toString = this.effectToString;
		if (!nature.effectType) nature.effectType = 'Nature';
		if (!nature.gen) nature.gen = 3;

		return nature;
	}

	getAwakeningValues(set: PokemonSet, statName?: string) {
		if (typeof statName === 'string') statName = toId(statName);
		const avs: StatsTable = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
		let ev: keyof StatsTable;
		for (ev in set.evs) {
			avs[ev] = set.evs[ev];
		}
		if (typeof statName === 'string' && statName in avs) return avs[statName as keyof StatsTable];
		return avs;
	}

	/** Given a table of base stats and a pokemon set, return the actual stats. */
	spreadModify(baseStats: StatsTable, set: PokemonSet): StatsTable {
		const modStats: SparseStatsTable = {atk: 10, def: 10, spa: 10, spd: 10, spe: 10};
		const tr = this.trunc;
		let statName: keyof StatsTable;
		for (statName in modStats) {
			const stat = baseStats[statName];
			modStats[statName] = tr(tr(2 * stat + set.ivs[statName] + tr(set.evs[statName] / 4)) * set.level / 100 + 5);
		}
		if ('hp' in baseStats) {
			const stat = baseStats['hp'];
			modStats['hp'] = tr(tr(2 * stat + set.ivs['hp'] + tr(set.evs['hp'] / 4) + 100) * set.level / 100 + 10);
		}
		return this.natureModify(modStats as StatsTable, set);
	}

	natureModify(stats: StatsTable, set: PokemonSet): StatsTable {
		const nature = this.getNature(set.nature);
		let stat: keyof StatsTable;
		if (nature.plus) {
			stat = nature.plus;
			stats[stat] = Math.floor(stats[stat] * 1.1);
		}
		if (nature.minus) {
			stat = nature.minus;
			stats[stat] = Math.floor(stats[stat] * 0.9);
		}
		return stats;
	}

	getHiddenPower(ivs: AnyObject) {
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
					(5 * ((spcDV >> 3) + (2 * (speDV >> 3)) + (4 * (defDV >> 3)) + (8 * (atkDV >> 3))) + (spcDV % 4)) / 2 + 31),
			};
		} else {
			// Hidden Power check for Gen 3 onwards
			let hpTypeX = 0;
			let hpPowerX = 0;
			let i = 1;
			for (const s in stats) {
				hpTypeX += i * (ivs[s] % 2);
				hpPowerX += i * (tr(ivs[s] / 2) % 2);
				i *= 2;
			}
			return {
				type: hpTypes[tr(hpTypeX * 15 / 63)],
				// After Gen 6, Hidden Power is always 60 base power
				power: (this.gen && this.gen < 6) ? tr(hpPowerX * 40 / 63) + 30 : 60,
			};
		}
	}

	getRuleTable(format: Format, depth: number = 0): RuleTable {
		if (format.ruleTable) return format.ruleTable;
		const ruleTable = new Data.RuleTable();

		const ruleset = format.ruleset.slice();
		for (const ban of format.banlist) {
			ruleset.push('-' + ban);
		}
		for (const ban of format.unbanlist) {
			ruleset.push('+' + ban);
		}
		if (format.customRules) {
			for (const rule of format.customRules) {
				if (rule.startsWith('!')) {
					ruleset.unshift(rule);
				} else {
					ruleset.push(rule);
				}
			}
		}
		if (format.checkLearnset) {
			ruleTable.checkLearnset = [format.checkLearnset, format.name];
		}

		for (const rule of ruleset) {
			const ruleSpec = this.validateRule(rule, format);
			if (typeof ruleSpec !== 'string') {
				if (ruleSpec[0] === 'complexTeamBan') {
					const complexTeamBan: Data.ComplexTeamBan = ruleSpec.slice(1) as Data.ComplexTeamBan;
					ruleTable.addComplexTeamBan(complexTeamBan[0], complexTeamBan[1], complexTeamBan[2], complexTeamBan[3]);
				} else if (ruleSpec[0] === 'complexBan') {
					const complexBan: Data.ComplexBan = ruleSpec.slice(1) as Data.ComplexBan;
					ruleTable.addComplexBan(complexBan[0], complexBan[1], complexBan[2], complexBan[3]);
				} else {
					throw new Error(`Unrecognized rule spec ${ruleSpec}`);
				}
				continue;
			}
			if ("!+-".includes(ruleSpec.charAt(0))) {
				if (ruleSpec.charAt(0) === '+' && ruleTable.has('-' + ruleSpec.slice(1))) {
					ruleTable.delete('-' + ruleSpec.slice(1));
				}
				ruleTable.set(ruleSpec, '');
				continue;
			}
			const subformat = this.getFormat(ruleSpec);
			if (ruleTable.has('!' + subformat.id)) continue;
			ruleTable.set(subformat.id, '');
			if (!subformat.exists) continue;
			if (depth > 16) {
				throw new Error(`Excessive ruleTable recursion in ${format.name}: ${ruleSpec} of ${format.ruleset}`);
			}
			const subRuleTable = this.getRuleTable(subformat, depth + 1);
			for (const [k, v] of subRuleTable) {
				if (!ruleTable.has('!' + k)) ruleTable.set(k, v || subformat.name);
			}
			// tslint:disable-next-line:no-shadowed-variable
			for (const [rule, source, limit, bans] of subRuleTable.complexBans) {
				ruleTable.addComplexBan(rule, source || subformat.name, limit, bans);
			}
			// tslint:disable-next-line:no-shadowed-variable
			for (const [rule, source, limit, bans] of subRuleTable.complexTeamBans) {
				ruleTable.addComplexTeamBan(rule, source || subformat.name, limit, bans);
			}
			if (subRuleTable.checkLearnset) {
				if (ruleTable.checkLearnset) {
					throw new Error(
						`"${format.name}" has conflicting move validation rules from ` +
						`"${ruleTable.checkLearnset[1]}" and "${subRuleTable.checkLearnset[1]}"`);
				}
				ruleTable.checkLearnset = subRuleTable.checkLearnset;
			}
		}

		format.ruleTable = ruleTable;
		return ruleTable;
	}

	validateRule(rule: string, format: Format | null = null) {
		switch (rule.charAt(0)) {
		case '-':
		case '+':
			if (format && format.team) throw new Error(`We don't currently support bans in generated teams`);
			if (rule.slice(1).includes('>') || rule.slice(1).includes('+')) {
				let buf = rule.slice(1);
				const gtIndex = buf.lastIndexOf('>');
				let limit = rule.charAt(0) === '+' ? Infinity : 0;
				if (gtIndex >= 0 && /^[0-9]+$/.test(buf.slice(gtIndex + 1).trim())) {
					if (limit === 0) limit = parseInt(buf.slice(gtIndex + 1), 10);
					buf = buf.slice(0, gtIndex);
				}
				let checkTeam = buf.includes('++');
				const banNames = buf.split(checkTeam ? '++' : '+').map(v => v.trim());
				if (banNames.length === 1 && limit > 0) checkTeam = true;
				const innerRule = banNames.join(checkTeam ? ' ++ ' : ' + ');
				const bans = banNames.map(v => this.validateBanRule(v));

				if (checkTeam) {
					return ['complexTeamBan', innerRule, '', limit, bans];
				}
				if (bans.length > 1 || limit > 0) {
					return ['complexBan', innerRule, '', limit, bans];
				}
				throw new Error(`Confusing rule ${rule}`);
			}
			return rule.charAt(0) + this.validateBanRule(rule.slice(1));
		default:
			const id = toId(rule);
			if (!this.data.Formats.hasOwnProperty(id)) {
				throw new Error(`Unrecognized rule "${rule}"`);
			}
			if (rule.charAt(0) === '!') return `!${id}`;
			return id;
		}
	}

	validateBanRule(rule: string) {
		let id = toId(rule);
		if (id === 'unreleased') return 'unreleased';
		if (id === 'illegal') return 'illegal';
		const matches = [];
		let matchTypes = ['pokemon', 'move', 'ability', 'item', 'pokemontag'];
		for (const matchType of matchTypes) {
			if (rule.slice(0, 1 + matchType.length) === matchType + ':') {
				matchTypes = [matchType];
				id = id.slice(matchType.length);
				break;
			}
		}
		const ruleid = id;
		if (this.data.Aliases.hasOwnProperty(id)) id = toId(this.data.Aliases[id]);
		for (const matchType of matchTypes) {
			let table;
			switch (matchType) {
			case 'pokemon': table = this.data.Pokedex; break;
			case 'move': table = this.data.Movedex; break;
			case 'item': table = this.data.Items; break;
			case 'ability': table = this.data.Abilities; break;
			case 'pokemontag':
				// valid pokemontags
				const validTags = [
					// singles tiers
					'uber', 'ou', 'uubl', 'uu', 'rubl', 'ru', 'nubl', 'nu', 'publ', 'pu', 'zu', 'nfe', 'lcuber', 'lc', 'cap', 'caplc', 'capnfe',
					// doubles tiers
					'duber', 'dou', 'dbl', 'duu', 'dnu',
					// custom tags
					'mega',
				];
				if (validTags.includes(ruleid)) matches.push('pokemontag:' + ruleid);
				continue;
			default:
				throw new Error(`Unrecognized match type.`);
			}
			if (table.hasOwnProperty(id)) {
				if (matchType === 'pokemon') {
					const template: Template = table[id] as Template;
					if (template.otherFormes) {
						matches.push('basepokemon:' + id);
						continue;
					}
				}
				matches.push(matchType + ':' + id);
			} else if (matchType === 'pokemon' && id.slice(-4) === 'base') {
				id = id.slice(0, -4);
				if (table.hasOwnProperty(id)) {
					matches.push('pokemon:' + id);
				}
			}
		}
		if (matches.length > 1) {
			throw new Error(`More than one thing matches "${rule}"; please use something like "-item:metronome" to disambiguate`);
		}
		if (matches.length < 1) {
			throw new Error(`Nothing matches "${rule}"`);
		}
		return matches[0];
	}

	shuffle<T>(arr: T[]): T[] {
		// In-place shuffle by Fisher-Yates algorithm
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	levenshtein(s: string, t: string, l: number): number {
		// Original levenshtein distance function by James Westgate, turned out to be the fastest
		const d: number[][] = [];

		// Step 1
		const n = s.length;
		const m = t.length;

		if (n === 0) return m;
		if (m === 0) return n;
		if (l && Math.abs(m - n) > l) return Math.abs(m - n);

		// Create an array of arrays in javascript (a descending loop is quicker)
		for (let i = n; i >= 0; i--) d[i] = [];

		// Step 2
		for (let i = n; i >= 0; i--) d[i][0] = i;
		for (let j = m; j >= 0; j--) d[0][j] = j;

		// Step 3
		for (let i = 1; i <= n; i++) {
			const si = s.charAt(i - 1);

			// Step 4
			for (let j = 1; j <= m; j++) {
				// Check the jagged ld total so far
				if (i === j && d[i][j] > 4) return n;

				const tj = t.charAt(j - 1);
				const cost = (si === tj) ? 0 : 1; // Step 5

				// Calculate the minimum
				let mi = d[i - 1][j] + 1;
				const b = d[i][j - 1] + 1;
				const c = d[i - 1][j - 1] + cost;

				if (b < mi) mi = b;
				if (c < mi) mi = c;

				d[i][j] = mi; // Step 6
			}
		}

		// Step 7
		return d[n][m];
	}

	/** Forces num to be an integer (between min and max). */
	clampIntRange(num: any, min?: number, max?: number): number {
		if (typeof num !== 'number') num = 0;
		num = Math.floor(num);
		if (min !== undefined && num < min) num = min;
		if (max !== undefined && num > max) num = max;
		return num;
	}

	/**
	 * Truncate a number into an unsigned 32-bit integer, for
	 * compatibility with the cartridge games' math systems.
	 */
	trunc(num: number, bits: number = 0) {
		if (bits) return (num >>> 0) % (2 ** bits);
		return num >>> 0;
	}

	getTeamGenerator(format: Format | string, seed: PRNG | PRNGSeed | null = null) {
		const TeamGenerator = require(dexes['base'].forFormat(format).dataDir + '/random-teams');
		return new TeamGenerator(format, seed);
	}

	generateTeam(format: Format | string, options: PlayerOptions | null = null): PokemonSet[] {
		return this.getTeamGenerator(format, options && options.seed).getTeam(options);
	}

	dataSearch(target: string, searchIn?: DataType[] | null, isInexact?: boolean): AnyObject[] | false {
		if (!target) return false;

		searchIn = searchIn || ['Pokedex', 'Movedex', 'Abilities', 'Items', 'Natures'];

		const searchFunctions = {
			Pokedex: 'getTemplate', Movedex: 'getMove', Abilities: 'getAbility', Items: 'getItem', Natures: 'getNature',
		};
		const searchTypes: {[k in DataType]?: string} = {
			Pokedex: 'pokemon', Movedex: 'move', Abilities: 'ability', Items: 'item', Natures: 'nature',
		};
		let searchResults: AnyObject[] | false = [];
		for (const table of searchIn) {
			// @ts-ignore
			const res: AnyObject = this[searchFunctions[table]](target);
			if (res.exists && res.gen <= this.gen) {
				searchResults.push({
					isInexact,
					searchType: searchTypes[table],
					name: res.species ? res.species : res.name,
				});
			}
		}
		if (searchResults.length) return searchResults;
		if (isInexact) return false; // prevent infinite loop

		const cmpTarget = toId(target);
		let maxLd = 3;
		if (cmpTarget.length <= 1) {
			return false;
		} else if (cmpTarget.length <= 4) {
			maxLd = 1;
		} else if (cmpTarget.length <= 6) {
			maxLd = 2;
		}
		searchResults = false;
		for (const table of [...searchIn, 'Aliases'] as DataType[]) {
			const searchObj = this.data[table];
			if (!searchObj) continue;

			for (const j in searchObj) {
				const ld = this.levenshtein(cmpTarget, j, maxLd);
				if (ld <= maxLd) {
					const word = searchObj[j].name || searchObj[j].species || j;
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

	packTeam(team: PokemonSet[] | null): string {
		if (!team) return '';

		let buf = '';
		for (const set of team) {
			if (buf) buf += ']';

			// name
			buf += (set.name || set.species);

			// species
			let id = toId(set.species || set.name);
			buf += '|' + (toId(set.name || set.species) === id ? '' : id);

			// item
			buf += '|' + toId(set.item);

			// ability
			const template = dexes['base'].getTemplate(set.species || set.name);
			const abilities = template.abilities;
			id = toId(set.ability);
			if (abilities) {
				if (id === toId(abilities['0'])) {
					buf += '|';
				} else if (id === toId(abilities['1'])) {
					buf += '|1';
				} else if (id === toId(abilities['H'])) {
					buf += '|H';
				} else {
					buf += '|' + id;
				}
			} else {
				buf += '|' + id;
			}

			// moves
			buf += '|' + set.moves.map(toId).join(',');

			// nature
			buf += '|' + (set.nature || '');

			// evs
			let evs = '|';
			if (set.evs) {
				evs = '|' + (set.evs['hp'] || '') + ',' + (set.evs['atk'] || '') + ',' + (set.evs['def'] || '') + ',' + (set.evs['spa'] || '') + ',' + (set.evs['spd'] || '') + ',' + (set.evs['spe'] || '');
			}
			if (evs === '|,,,,,') {
				buf += '|';
			} else {
				buf += evs;
			}

			// gender
			if (set.gender && set.gender !== template.gender) {
				buf += '|' + set.gender;
			} else {
				buf += '|';
			}

			// ivs
			const getIv = (ivs: StatsTable, s: keyof StatsTable): string => {
				return ivs[s] === 31 || ivs[s] === undefined ? '' : ivs[s].toString();
			};
			let ivs = '|';
			if (set.ivs) {
				ivs = '|' + getIv(set.ivs, 'hp') + ',' + getIv(set.ivs, 'atk') + ',' + getIv(set.ivs, 'def') +
					',' + getIv(set.ivs, 'spa') + ',' + getIv(set.ivs, 'spd') + ',' + getIv(set.ivs, 'spe');
			}
			if (ivs === '|,,,,,') {
				buf += '|';
			} else {
				buf += ivs;
			}

			// shiny
			if (set.shiny) {
				buf += '|S';
			} else {
				buf += '|';
			}

			// level
			if (set.level && set.level !== 100) {
				buf += '|' + set.level;
			} else {
				buf += '|';
			}

			// happiness
			if (set.happiness !== undefined && set.happiness !== 255) {
				buf += '|' + set.happiness;
			} else {
				buf += '|';
			}

			if (set.pokeball || set.hpType) {
				buf += ',' + set.hpType;
				buf += ',' + toId(set.pokeball);
			}
		}

		return buf;
	}

	fastUnpackTeam(buf: string): PokemonSet[] | null {
		if (!buf) return null;
		if (typeof buf !== 'string') return buf;
		if (buf.charAt(0) === '[' && buf.charAt(buf.length - 1) === ']') {
			buf = this.packTeam(JSON.parse(buf));
		}

		const team = [];
		let i = 0;
		let j = 0;

		// limit to 24
		for (let count = 0; count < 24; count++) {
			// tslint:disable-next-line:no-object-literal-type-assertion
			const set: PokemonSet = {} as PokemonSet;
			team.push(set);

			// name
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.name = buf.substring(i, j);
			i = j + 1;

			// species
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.species = buf.substring(i, j) || set.name;
			i = j + 1;

			// item
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.item = buf.substring(i, j);
			i = j + 1;

			// ability
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			const ability = buf.substring(i, j);
			const template = dexes['base'].getTemplate(set.species);
			set.ability = ['', '0', '1', 'H', 'S'].includes(ability) ?
				template.abilities[ability as '0' || '0'] || (ability === '' ? '' : '!!!ERROR!!!') :
				ability;
			i = j + 1;

			// moves
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.moves = buf.substring(i, j).split(',', 24).filter(x => x);
			i = j + 1;

			// nature
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.nature = buf.substring(i, j);
			i = j + 1;

			// evs
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (j !== i) {
				const evs = buf.substring(i, j).split(',', 6);
				set.evs = {
					hp: Number(evs[0]) || 0,
					atk: Number(evs[1]) || 0,
					def: Number(evs[2]) || 0,
					spa: Number(evs[3]) || 0,
					spd: Number(evs[4]) || 0,
					spe: Number(evs[5]) || 0,
				};
			}
			i = j + 1;

			// gender
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.gender = buf.substring(i, j);
			i = j + 1;

			// ivs
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (j !== i) {
				const ivs = buf.substring(i, j).split(',', 6);
				set.ivs = {
					hp: ivs[0] === '' ? 31 : Number(ivs[0]) || 0,
					atk: ivs[1] === '' ? 31 : Number(ivs[1]) || 0,
					def: ivs[2] === '' ? 31 : Number(ivs[2]) || 0,
					spa: ivs[3] === '' ? 31 : Number(ivs[3]) || 0,
					spd: ivs[4] === '' ? 31 : Number(ivs[4]) || 0,
					spe: ivs[5] === '' ? 31 : Number(ivs[5]) || 0,
				};
			}
			i = j + 1;

			// shiny
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.shiny = true;
			i = j + 1;

			// level
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.level = parseInt(buf.substring(i, j), 10);
			i = j + 1;

			// happiness
			j = buf.indexOf(']', i);
			let misc;
			if (j < 0) {
				if (i < buf.length) misc = buf.substring(i).split(',', 3);
			} else {
				if (i !== j) misc = buf.substring(i, j).split(',', 3);
			}
			if (misc) {
				set.happiness = (misc[0] ? Number(misc[0]) : 255);
				set.hpType = misc[1];
				set.pokeball = misc[2];
			}
			if (j < 0) break;
			i = j + 1;
		}

		return team;
	}

	deepClone(obj: any): any {
		if (obj === null || typeof obj !== 'object') return obj;
		if (Array.isArray(obj)) return obj.map(prop => this.deepClone(prop));
		const clone = Object.create(Object.getPrototypeOf(obj));
		for (const key of Object.keys(obj)) {
			clone[key] = this.deepClone(obj[key]);
		}
		return clone;
	}

	loadDataFile(basePath: string, dataType: DataType | 'Aliases'): AnyObject {
		try {
			const filePath = basePath + DATA_FILES[dataType];
			const dataObject = require(filePath);
			const key = `Battle${dataType}`;
			if (!dataObject || typeof dataObject !== 'object') {
				return new TypeError(`${filePath}, if it exists, must export a non-null object`);
			}
			if (!dataObject[key] || typeof dataObject[key] !== 'object') {
				return new TypeError(`${filePath}, if it exists, must export an object whose '${key}' property is a non-null object`);
			}
			return dataObject[key];
		} catch (e) {
			if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
				throw e;
			}
		}
		return {};
	}

	includeMods(): ModdedDex {
		if (!this.isBase) throw new Error(`This must be called on the base Dex`);
		if (this.modsLoaded) return this;

		for (const mod of fs.readdirSync(MODS_DIR)) {
			dexes[mod] = new ModdedDex(mod, true);
		}
		this.modsLoaded = true;

		return this;
	}

	includeModData(): ModdedDex {
		for (const mod in this.dexes) {
			dexes[mod].includeData();
		}
		return this;
	}

	includeData(): ModdedDex {
		this.loadData();
		return this;
	}

	loadData(): DexTableData {
		if (this.dataCache) return this.dataCache;
		dexes['base'].includeMods();
		const dataCache: {[k in keyof DexTableData]?: any} = {};

		const basePath = this.dataDir + '/';

		const BattleScripts = this.loadDataFile(basePath, 'Scripts');
		this.parentMod = this.isBase ? '' : (BattleScripts.inherit || 'base');

		let parentDex;
		if (this.parentMod) {
			parentDex = dexes[this.parentMod];
			if (!parentDex || parentDex === this) {
				throw new Error(
					"Unable to load " + this.currentMod + ". `inherit` should specify a parent mod " +
					"from which to inherit data, or must be not specified.");
			}
		}

		for (const dataType of DATA_TYPES.concat('Aliases')) {
			if (dataType === 'Natures' && this.isBase) {
				dataCache[dataType] = BattleNatures;
				continue;
			}
			const BattleData = this.loadDataFile(basePath, dataType);
			if (!BattleData || typeof BattleData !== 'object') {
				throw new TypeError(
					"Exported property `Battle" + dataType + "`from `" + './data/' +
					DATA_FILES[dataType] + "` must be an object except `null`.");
			}
			if (BattleData !== dataCache[dataType]) dataCache[dataType] = Object.assign(BattleData, dataCache[dataType]);
			if (dataType === 'Formats' && !parentDex) Object.assign(BattleData, this.formats);
		}
		if (!parentDex) {
			// Formats are inherited by mods
			this.includeFormats();
		} else {
			for (const dataType of DATA_TYPES) {
				const parentTypedData = parentDex.data[dataType];
				const childTypedData = dataCache[dataType] || (dataCache[dataType] = {});
				for (const entryId in parentTypedData) {
					if (childTypedData[entryId] === null) {
						// null means don't inherit
						delete childTypedData[entryId];
					} else if (!(entryId in childTypedData)) {
						// If it doesn't exist it's inherited from the parent data
						if (dataType === 'Pokedex') {
							// Pokedex entries can be modified too many different ways
							// e.g. inheriting different formats-data/learnsets
							childTypedData[entryId] = this.deepClone(parentTypedData[entryId]);
						} else {
							childTypedData[entryId] = parentTypedData[entryId];
						}
					} else if (childTypedData[entryId] && childTypedData[entryId].inherit) {
						// {inherit: true} can be used to modify only parts of the parent data,
						// instead of overwriting entirely
						delete childTypedData[entryId].inherit;

						// Merge parent into children entry, preserving existing childs' properties.
						// @ts-ignore
						for (const key in parentTypedData[entryId]) {
							if (key in childTypedData[entryId]) continue;
							// @ts-ignore
							childTypedData[entryId][key] = parentTypedData[entryId][key];
						}
					}
				}
			}
			dataCache['Aliases'] = parentDex.data['Aliases'];
		}

		// Flag the generation. Required for team validator.
		this.gen = dataCache.Scripts.gen || 7;
		this.dataCache = dataCache as DexTableData;

		// Execute initialization script.
		if (BattleScripts.init) BattleScripts.init.call(this);

		return this.dataCache;
	}

	includeFormats(): ModdedDex {
		if (!this.isBase) throw new Error(`This should only be run on the base mod`);
		this.includeMods();
		if (this.formatsCache) return this;

		if (!this.formatsCache) this.formatsCache = {};

		// Load formats
		let Formats;
		try {
			Formats = require(FORMATS).Formats;
		} catch (e) {
			if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
				throw e;
			}
		}
		if (!Array.isArray(Formats)) {
			throw new TypeError(`Exported property 'Formats' from "./config/formats.js" must be an array`);
		}
		let section = '';
		let column = 1;
		for (const [i, format] of Formats.entries()) {
			const id = toId(format.name);
			if (format.section) section = format.section;
			if (format.column) column = format.column;
			if (!format.name && format.section) continue;
			if (!id) {
				throw new RangeError(`Format #${i + 1} must have a name with alphanumeric characters, not '${format.name}'`);
			}
			if (!format.section) format.section = section;
			if (!format.column) format.column = column;
			if (this.formatsCache[id]) throw new Error(`Format #${i + 1} has a duplicate ID: '${id}'`);
			format.effectType = 'Format';
			format.baseRuleset = format.ruleset ? format.ruleset.slice() : [];
			if (format.challengeShow === undefined) format.challengeShow = true;
			if (format.searchShow === undefined) format.searchShow = true;
			if (format.tournamentShow === undefined) format.tournamentShow = true;
			if (format.mod === undefined) format.mod = 'gen7';
			if (!dexes[format.mod]) throw new Error(`Format "${format.name}" requires nonexistent mod: '${format.mod}'`);
			this.formatsCache[id] = format;
		}

		return this;
	}

	installFormat(id: string, format: Format) {
		dexes['base'].includeFormats();
		dexes['base'].formatsCache![id] = format;
		if (this.dataCache) this.dataCache.Formats[id] = format;
		if (!this.isBase) {
			if (dexes['base'].dataCache) dexes['base'].dataCache.Formats[id] = format;
		}
	}
}

dexes['base'] = new ModdedDex(undefined, true);

// "gen7" is an alias for the current base data
dexes['gen7'] = dexes['base'];

export = dexes['gen7'];
