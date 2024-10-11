/**
 * Dex Data
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */
import {Utils} from '../lib';

/**
* Do not insert user input, only populate with trusted data.
* Populated by ./sim/dex.ts then frozen.
*/
export const _toIDCache: Map<string, ID> = new Map();
/**
* Converts anything to an ID. An ID must have only lowercase alphanumeric
* characters.
*
* If a string is passed, it will be converted to lowercase and
* non-alphanumeric characters will be stripped.
*
* If an object with an ID is passed, its ID will be returned.
* Otherwise, an empty string will be returned.
*
* Generally assigned to the global toID, because of how
* commonly it's used.
*/
export function toID(text: any): ID {
	if (typeof text === 'string') {
	        // 99% case, skip checks
	} else {
	        if (text) text = text.id || text.userid || text.roomid || text;
	        if (typeof text === 'number') text = '' + text;
	        else if (typeof text !== 'string') return '';
	}
	// very often text is already a valid ID.
	if (/^[a-z0-9]*$/.test(text)) return text;
	// Next, we often produce the same IDs many times.
	// Otherwise, fallback to the generic case
	return _toIDCache.get(text) || text.toLowerCase().replace(/[^a-z0-9]+/g, '') as ID;
}

/**
 * Like Object.assign but only fields missing from self.
 * Facilitates consistent field ordering in constructors.
 * Modifies self in-place.
 */
export function assignNewFields(self: AnyObject, data: AnyObject) {
	for (const k in data) {
		// to behave like Object.assign, skip inherited fields
		if (!data.hasOwnProperty(k)) continue;
		// FIXME: decide whether this should be 'in' or 'hasOwnProperty'
		if (k in self) continue;
		self[k] = data[k];
	}
}

export class BasicEffect implements EffectData {
	/**
	 * ID. This will be a lowercase version of the name with all the
	 * non-alphanumeric characters removed. So, for instance, "Mr. Mime"
	 * becomes "mrmime", and "Basculin-Blue-Striped" becomes
	 * "basculinbluestriped".
	 */
	id: ID;
	/**
	 * Name. Currently does not support Unicode letters, so "Flabébé"
	 * is "Flabebe" and "Nidoran♀" is "Nidoran-F".
	 */
	name: string;
	/**
	 * Full name. Prefixes the name with the effect type. For instance,
	 * Leftovers would be "item: Leftovers", confusion the status
	 * condition would be "confusion", etc.
	 */
	fullname: string;
	/** Effect type. */
	effectType: EffectType;
	/**
	 * Does it exist? For historical reasons, when you use an accessor
	 * for an effect that doesn't exist, you get a dummy effect that
	 * doesn't do anything, and this field set to false.
	 */
	exists: boolean;
	/**
	 * Dex number? For a Pokemon, this is the National Dex number. For
	 * other effects, this is often an internal ID (e.g. a move
	 * number). Not all effects have numbers, this will be 0 if it
	 * doesn't. Nonstandard effects (e.g. CAP effects) will have
	 * negative numbers.
	 */
	num: number;
	/**
	 * The generation of Pokemon game this was INTRODUCED (NOT
	 * necessarily the current gen being simulated.) Not all effects
	 * track generation; this will be 0 if not known.
	 */
	gen: number;
	/**
	 * A shortened form of the description of this effect.
	 * Not all effects have this.
	 */
	shortDesc: string;
	/** The full description for this effect. */
	desc: string;
	/**
	 * Is this item/move/ability/pokemon nonstandard? Specified for effects
	 * that have no use in standard formats: made-up pokemon (CAP),
	 * glitches (MissingNo etc), Pokestar pokemon, etc.
	 */
	isNonstandard: Nonstandard | null;
	/** The duration of the condition - only for pure conditions. */
	duration?: number;
	/** Whether or not the condition is ignored by Baton Pass - only for pure conditions. */
	noCopy: boolean;
	/** Whether or not the condition affects fainted Pokemon. */
	affectsFainted: boolean;
	/** Moves only: what status does it set? */
	status?: ID;
	/** Moves only: what weather does it set? */
	weather?: ID;
	/** ??? */
	sourceEffect: string;

	/**
	 * Pass 'false' for the second parameter if you only want the declared fields of BasicEffect
	 * to be initialized - the other properties of data will not be copied.
	 * This is to help w/ V8 hidden classes (want to init fields in consistent order)
	 */
	constructor(data: AnyObject, copyOtherFields = true) {
		this.name = Utils.getString(data.name).trim();
		// TODO: this logic needs to be in Moves constructor
		this.id = data.realMove ? toID(data.realMove) : toID(this.name); // Hidden Power hack
		this.fullname = Utils.getString(data.fullname) || this.name;
		this.effectType = Utils.getString(data.effectType) as EffectType || 'Condition';
		this.exists = !!((data.exists || !('exists' in data)) && this.id);
		this.num = data.num || 0;
		this.gen = data.gen || 0;
		this.shortDesc = data.shortDesc || '';
		this.desc = data.desc || '';
		this.isNonstandard = data.isNonstandard || null;
		this.duration = data.duration;
		this.noCopy = !!data.noCopy;
		this.affectsFainted = !!data.affectsFainted;
		this.status = data.status as ID || undefined;
		this.weather = data.weather as ID || undefined;
		this.sourceEffect = data.sourceEffect || '';

		if (copyOtherFields) {
			assignNewFields(this, data);
		}
	}

	toString() {
		return this.name;
	}
}

export class Nature extends BasicEffect implements Readonly<BasicEffect & NatureData> {
	readonly effectType: 'Nature';
	readonly plus?: StatIDExceptHP;
	readonly minus?: StatIDExceptHP;
	constructor(data: AnyObject) {
		super(data, false);

		this.fullname = `nature: ${this.name}`;
		this.effectType = 'Nature';
		this.gen = 3;
		this.plus = data.plus || undefined;
		this.minus = data.minus || undefined;

		assignNewFields(this, data);
	}
}
const EMPTY_NATURE = Utils.deepFreeze(new Nature({name: '', exists: false}));

export interface NatureData {
	name: string;
	plus?: StatIDExceptHP;
	minus?: StatIDExceptHP;
}

export type ModdedNatureData = NatureData | Partial<Omit<NatureData, 'name'>> & {inherit: true};

export interface NatureDataTable {[natureid: IDEntry]: NatureData}
export interface ModdedNatureDataTable {[natureid: IDEntry]: ModdedNatureData}


export class DexNatures {
	readonly dex: ModdedDex;
	readonly natureCache = new Map<ID, Nature>();
	allCache: readonly Nature[];

	constructor(dex: ModdedDex) {
		this.dex = dex;
		const Natures = dex.data.Natures;
		const parent = dex.parentMod ? dex.mod(dex.parentMod) : undefined;
		// 3 is hard-coded in Nature ctor, and this must match logic for nature.isNonstandard.
		const sameGenClass = parent && (parent.gen < 3) === (dex.gen < 3);
		if (parent && Natures === parent.data.Natures && sameGenClass) {
			this.natureCache = parent.natures.natureCache;
			this.allCache = parent.natures.all();
			return;
		}

		const allCache = [];
		for (const _id in Natures) {
			const id = _id as ID;
			const natureData = Natures[id];
			let nature;
			if (parent && sameGenClass && natureData === parent.data.Natures[id]) {
				nature = parent.natures.getByID(id);
			} else {
				nature = new Nature(natureData);
				if (nature.gen > dex.gen) nature.isNonstandard = 'Future';
				dex.deepFreeze(nature);
			}
			this.natureCache.set(id, nature);
			allCache.push(nature);
		}
		this.allCache = Object.freeze(allCache);
	}

	get(name: string | Nature): Nature {
		if (name && typeof name !== 'string') return name;
		return this.getByID(toID(name));
	}

	getByID(id: ID): Nature {
		if (id === '') return EMPTY_NATURE;
		let nature = this.natureCache.get(id);
		if (!nature && this.dex.data.Aliases.hasOwnProperty(id)) {
			nature = this.getByID(toID(this.dex.data.Aliases[id]));
			if (nature.exists) this.natureCache.set(id, nature);
		}
		return nature || new Nature({name: id, exists: false});
	}

	all(): readonly Nature[] {
		return this.allCache;
	}
}

export interface TypeData {
	damageTaken: {[attackingTypeNameOrEffectid: string]: number};
	HPdvs?: SparseStatsTable;
	HPivs?: SparseStatsTable;
	isNonstandard?: Nonstandard | null;
}

export type ModdedTypeData = TypeData | Partial<Omit<TypeData, 'name'>> & {inherit: true};
export interface TypeDataTable {[typeid: IDEntry]: TypeData}
export interface ModdedTypeDataTable {[typeid: IDEntry]: ModdedTypeData}

type TypeInfoEffectType = 'Type' | 'EffectType';

const EMPTY_OBJECT = {};
export class TypeInfo implements Readonly<TypeData> {
	/**
	 * ID. This will be a lowercase version of the name with all the
	 * non-alphanumeric characters removed. e.g. 'flying'
	 */
	readonly id: ID;
	/** Name. e.g. 'Flying' */
	readonly name: string;
	/** Effect type. */
	readonly effectType: TypeInfoEffectType;
	/**
	 * Does it exist? For historical reasons, when you use an accessor
	 * for an effect that doesn't exist, you get a dummy effect that
	 * doesn't do anything, and this field set to false.
	 */
	readonly exists: boolean;
	/**
	 * The generation of Pokemon game this was INTRODUCED (NOT
	 * necessarily the current gen being simulated.) Not all effects
	 * track generation; this will be 0 if not known.
	 */
	readonly gen: number;
	/**
	 * Set to 'Future' for types before they're released (like Fairy
	 * in Gen 5 or Dark in Gen 1).
	 */
	readonly isNonstandard: Nonstandard | null;
	/**
	 * Type chart, attackingTypeName:result, effectid:result
	 * result is: 0 = normal, 1 = weakness, 2 = resistance, 3 = immunity
	 */
	readonly damageTaken: {[attackingTypeNameOrEffectid: string]: number};
	/** The IVs to get this Type Hidden Power (in gen 3 and later) */
	readonly HPivs: SparseStatsTable;
	/** The DVs to get this Type Hidden Power (in gen 2). */
	readonly HPdvs: SparseStatsTable;

	/**
	 * If 'true' is passed for the 'canCacheFields' parameter, objects may be re-used
	 * across instances of TypeInfo. Basically, if you're going to immediately deepFreeze this,
	 * you can safely pass true.
	 */
	constructor(data: AnyObject, canCacheFields = false) {
		// initialize required fields in a consistent order bc of V8's hidden classes
		this.id = data.id;
		this.name = data.name;
		this.effectType = Utils.getString(data.effectType) as TypeInfoEffectType || 'Type';
		this.exists = !!((data.exists || !('exists' in data)) && data.id);
		this.gen = data.gen || 0;
		this.isNonstandard = data.isNonstandard || null;
		this.damageTaken = data.damageTaken || (canCacheFields ? EMPTY_OBJECT : {});
		this.HPivs = data.HPivs || (canCacheFields ? EMPTY_OBJECT : {});
		this.HPdvs = data.HPdvs || (canCacheFields ? EMPTY_OBJECT : {});
		assignNewFields(this, data);
	}

	toString() {
		return this.name;
	}
}
const EMPTY_TYPE_INFO = Utils.deepFreeze(new TypeInfo({name: '', id: '', exists: false, effectType: 'EffectType'}));

export class DexTypes {
	readonly dex: ModdedDex;
	readonly typeCache = new Map<ID, TypeInfo>();
	allCache: readonly TypeInfo[];
	namesCache: readonly string[];

	constructor(dex: ModdedDex) {
		this.dex = dex;
		const TypeChart = dex.data.TypeChart;
		const parent = dex.parentMod ? dex.mod(dex.parentMod) : undefined;
		if (parent && TypeChart === parent.data.TypeChart) {
			this.typeCache = parent.types.typeCache;
			this.allCache = parent.types.all();
			this.namesCache = parent.types.namesCache;
			return;
		}
		const allCache = [];
		const namesCache = [];
		for (const _id in TypeChart) {
			const id = _id as ID;
			const typeData = TypeChart[id];
			let typeInfo;
			if (parent && typeData === parent.data.TypeChart[id]) {
				typeInfo = parent.types.getByID(id);
			} else {
				const typeName = id.charAt(0).toUpperCase() + id.substr(1);
				typeInfo = new TypeInfo({name: typeName, id, ...typeData}, true);
				dex.deepFreeze(typeInfo);
			}
			this.typeCache.set(id, typeInfo);
			allCache.push(typeInfo);
			if (!typeInfo.isNonstandard) namesCache.push(typeInfo.name);
		}
		this.allCache = Object.freeze(allCache);
		this.namesCache = Object.freeze(namesCache);
	}

	get(name: string | TypeInfo): TypeInfo {
		if (name && typeof name !== 'string') return name;
		return this.getByID(toID(name));
	}

	getByID(id: ID): TypeInfo {
		if (id === '') return EMPTY_TYPE_INFO;
		return this.typeCache.get(id) ||
			new TypeInfo({
				name: id.charAt(0).toUpperCase() + id.substr(1),
				id,
				exists: false,
				effectType: 'EffectType',
			});
	}

	names(): readonly string[] {
		return this.namesCache;
	}

	isName(name: string): boolean {
		const id = name.toLowerCase();
		const typeName = id.charAt(0).toUpperCase() + id.substr(1);
		return name === typeName && this.dex.data.TypeChart.hasOwnProperty(id as ID);
	}

	all(): readonly TypeInfo[] {
		return this.allCache;
	}
}

const idsCache: readonly StatID[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const reverseCache: {readonly [k: IDEntry]: StatID} = {
	__proto: null as any,
	"hitpoints": 'hp',
	"attack": 'atk',
	"defense": 'def',
	"specialattack": 'spa', "spatk": 'spa', "spattack": 'spa', "specialatk": 'spa',
	"special": 'spa', "spc": 'spa',
	"specialdefense": 'spd', "spdef": 'spd', "spdefense": 'spd', "specialdef": 'spd',
	"speed": 'spe',
};
export class DexStats {
	readonly shortNames: {readonly [k in StatID]: string};
	readonly mediumNames: {readonly [k in StatID]: string};
	readonly names: {readonly [k in StatID]: string};
	constructor(dex: ModdedDex) {
		if (dex.gen !== 1) {
			this.shortNames = {
				__proto__: null, hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe",
			} as any;
			this.mediumNames = {
				__proto__: null, hp: "HP", atk: "Attack", def: "Defense", spa: "Sp. Atk", spd: "Sp. Def", spe: "Speed",
			} as any;
			this.names = {
				__proto__: null, hp: "HP", atk: "Attack", def: "Defense", spa: "Special Attack", spd: "Special Defense", spe: "Speed",
			} as any;
		} else {
			this.shortNames = {
				__proto__: null, hp: "HP", atk: "Atk", def: "Def", spa: "Spc", spd: "[SpD]", spe: "Spe",
			} as any;
			this.mediumNames = {
				__proto__: null, hp: "HP", atk: "Attack", def: "Defense", spa: "Special", spd: "[Sp. Def]", spe: "Speed",
			} as any;
			this.names = {
				__proto__: null, hp: "HP", atk: "Attack", def: "Defense", spa: "Special", spd: "[Special Defense]", spe: "Speed",
			} as any;
		}
	}
	getID(name: string) {
		if (name === 'Spd') return 'spe' as StatID;
		const id = toID(name);
		if (reverseCache[id]) return reverseCache[id];
		if (idsCache.includes(id as StatID)) return id as StatID;
		return null;
	}
	ids(): typeof idsCache {
		return idsCache;
	}
}
