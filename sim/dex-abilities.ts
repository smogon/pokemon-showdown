import type {PokemonEventMethods, ConditionData} from './dex-conditions';
import {BasicEffect, toID} from './dex-data';

interface AbilityEventMethods {
	onCheckShow?: (this: Battle, pokemon: Pokemon) => void;
	onEnd?: (this: Battle, target: Pokemon & Side & Field) => void;
	onPreStart?: (this: Battle, pokemon: Pokemon) => void;
	onStart?: (this: Battle, target: Pokemon) => void;
}

/* Possible Ability flags */
interface AbilityFlags {
	breakable?: 1; // Can be suppressed by Mold Breaker and related effects
	cantsuppress?: 1; // Ability can't be suppressed by e.g. Gastro Acid or Neutralizing Gas
	failroleplay?: 1; // Role Play fails if target has this Ability
	failskillswap?: 1; // Skill Swap fails if either the user or target has this Ability
	noentrain?: 1; // Entrainment fails if user has this Ability
	noreceiver?: 1; // Receiver and Power of Alchemy will not activate if an ally faints with this Ability
	notrace?: 1; // Trace cannot copy this Ability
	notransform?: 1; // Disables the Ability if the user is Transformed
}

export interface AbilityData extends Partial<Ability>, AbilityEventMethods, PokemonEventMethods {
	name: string;
}

export type ModdedAbilityData = AbilityData | Partial<AbilityData> & {inherit: true};
export interface AbilityDataTable {[abilityid: IDEntry]: AbilityData}
export interface ModdedAbilityDataTable {[abilityid: IDEntry]: ModdedAbilityData}

const EMPTY_OBJECT = {};
export class Ability extends BasicEffect implements Readonly<BasicEffect> {
	declare readonly effectType: 'Ability';

	/** Rating from -1 Detrimental to +5 Essential; see `data/abilities.ts` for details. */
	readonly rating: number;
	readonly suppressWeather: boolean;
	readonly flags: AbilityFlags;
	declare readonly condition?: ConditionData;

	/**
	 * If 'true' is passed for the 'canCacheFields' parameter, objects may be re-used
	 * across instances of Ability. Basically, if you're going to immediately deepFreeze this,
	 * you can safely pass true.
	 */
	constructor(data: AnyObject, canCacheFields = false) {
		super(data, false);

		this.fullname = `ability: ${this.name}`;
		this.effectType = 'Ability';
		this.rating = data.rating || 0;
		this.suppressWeather = !!data.suppressWeather;
		this.flags = data.flags || (canCacheFields ? EMPTY_OBJECT : {});

		if (!this.gen) {
			if (this.num >= 268) {
				this.gen = 9;
			} else if (this.num >= 234) {
				this.gen = 8;
			} else if (this.num >= 192) {
				this.gen = 7;
			} else if (this.num >= 165) {
				this.gen = 6;
			} else if (this.num >= 124) {
				this.gen = 5;
			} else if (this.num >= 77) {
				this.gen = 4;
			} else if (this.num >= 1) {
				this.gen = 3;
			}
		}
		for (const k of Object.keys(data)) { // TODO: migrate to for..in + Object.hasOwn
			if (k in this) continue;
			(this as any)[k] = data[k];
		}
	}
}

export class DexAbilities {
	readonly dex: ModdedDex;
	readonly abilityCache = new Map<ID, Ability>();
	allCache: readonly Ability[];

	constructor(dex: ModdedDex) {
		this.dex = dex;
		const patches = this.dex.data.Abilities;
		const abilities = [];
		for (const _id in patches) {
			const id = _id as ID;
			const abilityData = patches[id] as any;
			const abilityTextData = this.dex.getDescs('Abilities', id, abilityData);
			const ability = new Ability({
				name: id,
				...abilityData,
				...abilityTextData,
			}, true);
			if (ability.gen > this.dex.gen) {
				(ability as any).isNonstandard = 'Future';
			}
			if (this.dex.currentMod === 'gen7letsgo' && ability.id !== 'noability') {
				(ability as any).isNonstandard = 'Past';
			}
			if ((this.dex.currentMod === 'gen7letsgo' || this.dex.gen <= 2) && ability.id === 'noability') {
				(ability as any).isNonstandard = null;
			}
			dex.deepFreeze(ability);
			abilities.push(ability);
			this.abilityCache.set(id, ability);
		}
		this.allCache = abilities;
	}

	get(name: string | Ability = ''): Ability {
		if (name && typeof name !== 'string') return name;

		const id = toID(name);
		return this.getByID(id);
	}

	getByID(id: ID): Ability {
		let ability = this.abilityCache.get(id);
		if (ability) return ability;

		if (this.dex.data.Aliases.hasOwnProperty(id)) {
			ability = this.get(this.dex.data.Aliases[id]);
			this.abilityCache.set(id, ability);
		} else {
			ability = new Ability({
				id, name: id, exists: false,
			});
		}
		return ability;
	}

	all(): readonly Ability[] {
		return this.allCache;
	}
}
