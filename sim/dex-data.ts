/**
 * Dex Data
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */
import { Utils } from '../lib/utils';

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
	if (typeof text !== 'string') {
		if (text) text = text.id || text.userid || text.roomid || text;
		if (typeof text === 'number') text = `${text}`;
		else if (typeof text !== 'string') return '';
	}
	return text.toLowerCase().replace(/[^a-z0-9]+/g, '') as ID;
}

/**
 * Like Object.assign but only assigns fields missing from self.
 * Facilitates consistent field ordering in constructors.
 * Modifies self in-place.
 */
export function assignMissingFields(self: AnyObject, data: AnyObject) {
	for (const k in data) {
		if (k in self) continue;
		self[k] = data[k];
	}
}

export abstract class BasicEffect implements EffectData {
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

	constructor(data: AnyObject) {
		this.name = Utils.getString(data.name).trim();
		this.id = data.realMove ? toID(data.realMove) : toID(this.name); // Hidden Power hack
		this.fullname = Utils.getString(data.fullname) || this.name;
		this.effectType = Utils.getString(data.effectType) as EffectType || 'Condition';
		this.exists = data.exists ?? !!this.id;
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
	}

	toString() {
		return this.name;
	}
}

export class Nature extends BasicEffect implements Readonly<BasicEffect & NatureData> {
	override readonly effectType: 'Nature';
	readonly plus?: StatIDExceptHP;
	readonly minus?: StatIDExceptHP;
	constructor(data: AnyObject) {
		super(data);
		this.fullname = `nature: ${this.name}`;
		this.effectType = 'Nature';
		this.gen = 3;
		this.plus = data.plus || undefined;
		this.minus = data.minus || undefined;
		assignMissingFields(this, data);
	}
}

const EMPTY_NATURE = Utils.deepFreeze(new Nature({ name: '', exists: false }));

export interface NatureData {
	name: string;
	plus?: StatIDExceptHP;
	minus?: StatIDExceptHP;
}

export type ModdedNatureData = NatureData | Partial<Omit<NatureData, 'name'>> & { inherit: true };

export interface NatureDataTable { [natureid: IDEntry]: NatureData }

export class DexNatures {
	readonly dex: ModdedDex;
	readonly natureCache = new Map<ID, Nature>();
	allCache: readonly Nature[] | null = null;

	constructor(dex: ModdedDex) {
		this.dex = dex;
	}

	get(name: string | Nature): Nature {
		if (name && typeof name !== 'string') return name;
		return this.getByID(toID(name));
	}
	getByID(id: ID): Nature {
		if (id === '') return EMPTY_NATURE;
		let nature = this.natureCache.get(id);
		if (nature) return nature;

		if (this.dex.data.Aliases.hasOwnProperty(id)) {
			nature = this.get(this.dex.data.Aliases[id]);
			if (nature.exists) {
				this.natureCache.set(id, nature);
			}
			return nature;
		}
		if (id && this.dex.data.Natures.hasOwnProperty(id)) {
			const natureData = this.dex.data.Natures[id];
			nature = new Nature(natureData);
			if (nature.gen > this.dex.gen) nature.isNonstandard = 'Future';
		} else {
			nature = new Nature({ name: id, exists: false });
		}

		if (nature.exists) this.natureCache.set(id, this.dex.deepFreeze(nature));
		return nature;
	}

	all(): readonly Nature[] {
		if (this.allCache) return this.allCache;
		const natures = [];
		for (const id in this.dex.data.Natures) {
			natures.push(this.getByID(id as ID));
		}
		this.allCache = Object.freeze(natures);
		return this.allCache;
	}
}

export interface TypeData {
	damageTaken: { [attackingTypeNameOrEffectid: string]: number };
	HPdvs?: SparseStatsTable;
	HPivs?: SparseStatsTable;
	isNonstandard?: Nonstandard | null;
}

export type ModdedTypeData = TypeData | Partial<Omit<TypeData, 'name'>> & { inherit: true };
export interface TypeDataTable { [typeid: IDEntry]: TypeData }
export interface ModdedTypeDataTable { [typeid: IDEntry]: ModdedTypeData }

type TypeInfoEffectType = 'Type' | 'EffectType';

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
	readonly damageTaken: { [attackingTypeNameOrEffectid: string]: number };
	/** The IVs to get this Type Hidden Power (in gen 3 and later) */
	readonly HPivs: SparseStatsTable;
	/** The DVs to get this Type Hidden Power (in gen 2). */
	readonly HPdvs: SparseStatsTable;

	constructor(data: AnyObject) {
		this.name = data.name;
		this.id = data.id;
		this.effectType = Utils.getString(data.effectType) as TypeInfoEffectType || 'Type';
		this.exists = data.exists ?? !!this.id;
		this.gen = data.gen || 0;
		this.isNonstandard = data.isNonstandard || null;
		this.damageTaken = data.damageTaken || {};
		this.HPivs = data.HPivs || {};
		this.HPdvs = data.HPdvs || {};
		assignMissingFields(this, data);
	}

	toString() {
		return this.name;
	}
}

const EMPTY_TYPE_INFO = Utils.deepFreeze(new TypeInfo({ name: '', id: '', exists: false, effectType: 'EffectType' }));

export class DexTypes {
	readonly dex: ModdedDex;
	readonly typeCache = new Map<ID, TypeInfo>();
	allCache: readonly TypeInfo[] | null = null;
	namesCache: readonly string[] | null = null;

	constructor(dex: ModdedDex) {
		this.dex = dex;
	}

	get(name: string | TypeInfo): TypeInfo {
		if (name && typeof name !== 'string') return name;
		return this.getByID(toID(name));
	}

	getByID(id: ID): TypeInfo {
		if (id === '') return EMPTY_TYPE_INFO;
		let type = this.typeCache.get(id);
		if (type) return type;

		const typeName = id.charAt(0).toUpperCase() + id.substr(1);
		if (typeName && this.dex.data.TypeChart.hasOwnProperty(id)) {
			type = new TypeInfo({ name: typeName, id, ...this.dex.data.TypeChart[id] });
		} else {
			type = new TypeInfo({ name: typeName, id, exists: false, effectType: 'EffectType' });
		}

		if (type.exists) this.typeCache.set(id, this.dex.deepFreeze(type));
		return type;
	}

	names(): readonly string[] {
		if (this.namesCache) return this.namesCache;

		this.namesCache = this.all().filter(type => !type.isNonstandard).map(type => type.name);

		return this.namesCache;
	}

	isName(name: string): boolean {
		const id = name.toLowerCase();
		const typeName = id.charAt(0).toUpperCase() + id.substr(1);
		return name === typeName && this.dex.data.TypeChart.hasOwnProperty(id);
	}

	all(): readonly TypeInfo[] {
		if (this.allCache) return this.allCache;
		const types = [];
		for (const id in this.dex.data.TypeChart) {
			types.push(this.getByID(id as ID));
		}
		this.allCache = Object.freeze(types);
		return this.allCache;
	}
}

const idsCache: readonly StatID[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const reverseCache: { readonly [k: IDEntry]: StatID } = {
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
	readonly shortNames: { readonly [k in StatID]: string };
	readonly mediumNames: { readonly [k in StatID]: string };
	readonly names: { readonly [k in StatID]: string };
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
