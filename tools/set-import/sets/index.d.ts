export declare type StatName = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';
export type StatsTable<T = number> = {[stat in StatName]: T};
export interface PokemonSet<T = string> {
	name: string;
	species: T;
	item: T;
	ability: T;
	moves: T[];
	nature: T;
	teraType: string;
	gender: string;
	evs: StatsTable;
	ivs: StatsTable;
	level: number;
	shiny?: boolean;
	happiness?: number;
	pokeball?: T;
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
export type GenerationNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Generation = {num: GenerationNum};
export declare function forGen(gen: Generation | GenerationNum): Promise<GenerationData> | undefined;
export declare function forFormat(format: string): Promise<FormatData> | undefined;
export {};
