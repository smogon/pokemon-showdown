export declare type StatName = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';
export declare type StatsTable<T> = {
	[stat in StatName]: T;
};
export interface PokemonSet {
	name: string;
	species: string;
	item: string;
	ability: string;
	moves: string[];
	nature: string;
	gender: string;
	evs: StatsTable<number>;
	ivs: StatsTable<number>;
	level: number;
	shiny?: boolean;
	happiness?: number;
	pokeball?: string;
	hpType?: string;
}
export declare type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Array<infer I> ? Array<DeepPartial<I>> : DeepPartial<T[P]>;
};
export interface GenerationData {
	[formatid: string]: FormatData;
}
export interface FormatData {
	[source: string]: {
		[speciesid: string]: {
			[name: string]: DeepPartial<PokemonSet>;
		};
	};
}
export declare type Generation = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export declare function forGen(gen: Generation): Promise<GenerationData> | undefined;
export declare function forFormat(format: string): Promise<FormatData> | undefined;
export {};
