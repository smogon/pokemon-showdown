import {EventMethods} from './dex-conditions';
import {BasicEffect} from './dex-data';

interface FlingData {
	basePower: number;
	status?: string;
	volatileStatus?: string;
	effect?: CommonHandlers['ResultMove'];
}

interface ItemEventMethods {
	onEat?: ((this: Battle, pokemon: Pokemon) => void) | false;
	onPrimal?: (this: Battle, pokemon: Pokemon) => void;
	onStart?: (this: Battle, target: Pokemon) => void;
	onTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
}

export interface ItemData extends EffectData, ItemEventMethods, EventMethods {
	name: string;
	/** just controls location on the item spritesheet */
	num?: number;
	condition?: Partial<ConditionData>;
	gen: number;
	fling?: FlingData;
	forcedForme?: string;
	ignoreKlutz?: boolean;
	isBerry?: boolean;
	isChoice?: boolean;
	isGem?: boolean;
	isPokeball?: boolean;
	megaStone?: string;
	megaEvolves?: string;
	naturalGift?: {basePower: number, type: string};
	onDrive?: string;
	onMemory?: string;
	onPlate?: string;
	spritenum?: number;
	zMove?: string | true;
	zMoveFrom?: string;
	zMoveType?: string;
	itemUser?: string[];
	boosts?: SparseBoostsTable | false;
}

export type ModdedItemData = ItemData | Partial<Omit<ItemData, 'name'>> & {
	inherit: true,
	onCustap?: (this: Battle, pokemon: Pokemon) => void,
};

export interface Item extends Readonly<BasicEffect & ItemData> {
	readonly effectType: 'Item';
}

export class DataItem extends BasicEffect implements Readonly<BasicEffect & ItemData> {
	readonly effectType: 'Item';
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

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		super(data, ...moreData);
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
			if (this.num >= 689) {
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
