import {EventMethods} from './dex-conditions';
import {BasicEffect} from './dex-data';

interface AbilityEventMethods {
	onCheckShow?: (this: Battle, pokemon: Pokemon) => void;
	onEnd?: (this: Battle, target: Pokemon & Side & Field) => void;
	onPreStart?: (this: Battle, pokemon: Pokemon) => void;
	onStart?: (this: Battle, target: Pokemon) => void;
}

export interface AbilityData extends EffectData, AbilityEventMethods, EventMethods {
	name: string;
	/** internal index number */
	num?: number;
	condition?: Partial<ConditionData>;
	rating?: number;
	isPermanent?: boolean;
	isUnbreakable?: boolean;
	suppressWeather?: boolean;
}

export type ModdedAbilityData = AbilityData | Partial<AbilityData> & {inherit: true};

export interface Ability extends Readonly<BasicEffect & AbilityData> {
	readonly effectType: 'Ability';
	rating: number;
}

export class DataAbility extends BasicEffect implements Readonly<BasicEffect & AbilityData> {
	readonly effectType: 'Ability';
	/** Represents how useful or detrimental this ability is. */
	readonly rating: number;
	/** Whether or not this ability suppresses weather. */
	readonly suppressWeather: boolean;

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		super(data, ...moreData);
		data = this;

		this.fullname = `ability: ${this.name}`;
		this.effectType = 'Ability';
		this.suppressWeather = !!data.suppressWeather;
		this.rating = data.rating || 0;

		if (!this.gen) {
			if (this.num >= 234) {
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
	}
}
