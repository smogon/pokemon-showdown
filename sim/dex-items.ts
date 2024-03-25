import {PokemonEventMethods} from './dex-conditions';
import {BasicEffect, toID} from './dex-data';

interface FlingData {
	basePower: number;
	status?: string;
	volatileStatus?: string;
	effect?: CommonHandlers['ResultMove'];
}

export interface ItemData extends Partial<Item>, PokemonEventMethods {
	name: string;
}

export type ModdedItemData = ItemData | Partial<Omit<ItemData, 'name'>> & {
	inherit: true,
	onCustap?: (this: Battle, pokemon: Pokemon) => void,
};

export class Item extends BasicEffect implements Readonly<BasicEffect> {
	declare readonly effectType: 'Item';

	/** just controls location on the item spritesheet */
	declare readonly num: number;

	/**
	 * A Move-like object depicting what happens when Fling is used on
	 * this item.
	 */
	readonly fling?: FlingData;
	/**
	 * If this is a Drive: The type it turns Techno Blast into.
	 * undefined, if not a Drive.
	 */
	readonly onDrive?: string;
	/**
	 * If this is a Memory: The type it turns Multi-Attack into.
	 * undefined, if not a Memory.
	 */
	readonly onMemory?: string;
	/**
	 * If this is a mega stone: The name (e.g. Charizard-Mega-X) of the
	 * forme this allows transformation into.
	 * undefined, if not a mega stone.
	 */
	readonly megaStone?: string;
	/**
	 * If this is a mega stone: The name (e.g. Charizard) of the
	 * forme this allows transformation from.
	 * undefined, if not a mega stone.
	 */
	readonly megaEvolves?: string;
	/**
	 * If this is a Z crystal: true if the Z Crystal is generic
	 * (e.g. Firium Z). If species-specific, the name
	 * (e.g. Inferno Overdrive) of the Z Move this crystal allows
	 * the use of.
	 * undefined, if not a Z crystal.
	 */
	readonly zMove?: true | string;
	/**
	 * If this is a generic Z crystal: The type (e.g. Fire) of the
	 * Z Move this crystal allows the use of (e.g. Fire)
	 * undefined, if not a generic Z crystal
	 */
	readonly zMoveType?: string;
	/**
	 * If this is a species-specific Z crystal: The name
	 * (e.g. Play Rough) of the move this crystal requires its
	 * holder to know to use its Z move.
	 * undefined, if not a species-specific Z crystal
	 */
	readonly zMoveFrom?: string;
	/**
	 * If this is a species-specific Z crystal: An array of the
	 * species of Pokemon that can use this crystal's Z move.
	 * Note that these are the full names, e.g. 'Mimikyu-Busted'
	 * undefined, if not a species-specific Z crystal
	 */
	readonly itemUser?: string[];
	/** Is this item a Berry? */
	readonly isBerry: boolean;
	/** Whether or not this item ignores the Klutz ability. */
	readonly ignoreKlutz: boolean;
	/** The type the holder will change into if it is an Arceus. */
	readonly onPlate?: string;
	/** Is this item a Gem? */
	readonly isGem: boolean;
	/** Is this item a Pokeball? */
	readonly isPokeball: boolean;

	declare readonly condition?: ConditionData;
	declare readonly forcedForme?: string;
	declare readonly isChoice?: boolean;
	declare readonly naturalGift?: {basePower: number, type: string};
	declare readonly spritenum?: number;
	declare readonly boosts?: SparseBoostsTable | false;

	declare readonly onEat?: ((this: Battle, pokemon: Pokemon) => void) | false;
	declare readonly onPrimal?: (this: Battle, pokemon: Pokemon) => void;
	declare readonly onStart?: (this: Battle, target: Pokemon) => void;
	declare readonly onEnd?: (this: Battle, target: Pokemon) => void;

	constructor(data: AnyObject) {
		super(data);
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		data = this;

		this.fullname = `item: ${this.name}`;
		this.effectType = 'Item';
		this.fling = data.fling || undefined;
		this.onDrive = data.onDrive || undefined;
		this.onMemory = data.onMemory || undefined;
		this.megaStone = data.megaStone || undefined;
		this.megaEvolves = data.megaEvolves || undefined;
		this.zMove = data.zMove || undefined;
		this.zMoveType = data.zMoveType || undefined;
		this.zMoveFrom = data.zMoveFrom || undefined;
		this.itemUser = data.itemUser || undefined;
		this.isBerry = !!data.isBerry;
		this.ignoreKlutz = !!data.ignoreKlutz;
		this.onPlate = data.onPlate || undefined;
		this.isGem = !!data.isGem;
		this.isPokeball = !!data.isPokeball;

		if (!this.gen) {
			if (this.num >= 1124) {
				this.gen = 9;
			} else if (this.num >= 927) {
				this.gen = 8;
			} else if (this.num >= 689) {
				this.gen = 7;
			} else if (this.num >= 577) {
				this.gen = 6;
			} else if (this.num >= 537) {
				this.gen = 5;
			} else if (this.num >= 377) {
				this.gen = 4;
			} else {
				this.gen = 3;
			}
			// Due to difference in gen 2 item numbering, gen 2 items must be
			// specified manually
		}

		if (this.isBerry) this.fling = {basePower: 10};
		if (this.id.endsWith('plate')) this.fling = {basePower: 90};
		if (this.onDrive) this.fling = {basePower: 70};
		if (this.megaStone) this.fling = {basePower: 80};
		if (this.onMemory) this.fling = {basePower: 50};
	}
}

export class DexItems {
	readonly dex: ModdedDex;
	readonly itemCache = new Map<ID, Item>();
	allCache: readonly Item[] | null = null;

	constructor(dex: ModdedDex) {
		this.dex = dex;
	}

	get(name?: string | Item): Item {
		if (name && typeof name !== 'string') return name;

		name = (name || '').trim();
		const id = toID(name);
		return this.getByID(id);
	}

	getByID(id: ID): Item {
		let item = this.itemCache.get(id);
		if (item) return item;
		if (this.dex.data.Aliases.hasOwnProperty(id)) {
			item = this.get(this.dex.data.Aliases[id]);
			if (item.exists) {
				this.itemCache.set(id, item);
			}
			return item;
		}
		if (id && !this.dex.data.Items[id] && this.dex.data.Items[id + 'berry']) {
			item = this.getByID(id + 'berry' as ID);
			this.itemCache.set(id, item);
			return item;
		}
		if (id && this.dex.data.Items.hasOwnProperty(id)) {
			const itemData = this.dex.data.Items[id] as any;
			const itemTextData = this.dex.getDescs('Items', id, itemData);
			item = new Item({
				name: id,
				...itemData,
				...itemTextData,
			});
			if (item.gen > this.dex.gen) {
				(item as any).isNonstandard = 'Future';
			}
		} else {
			item = new Item({name: id, exists: false});
		}

		if (item.exists) this.itemCache.set(id, this.dex.deepFreeze(item));
		return item;
	}

	all(): readonly Item[] {
		if (this.allCache) return this.allCache;
		const items = [];
		for (const id in this.dex.data.Items) {
			items.push(this.getByID(id as ID));
		}
		this.allCache = Object.freeze(items);
		return this.allCache;
	}
}
