export interface As<T> {__brand: T}
export type ID = (string & As<'ID'>) | (string & { __isID: true }) | '';
export type GenerationNum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type GenderName = 'M' | 'F' | 'N';
export type StatID = 'hp' | StatIDExceptHP;
export type StatIDExceptHP = 'atk' | 'def' | 'spa' | 'spd' | 'spe';
export type StatsTable<T = number> = {[stat in StatID]: T};

export type AbilityName = string & As<'AbilityName'>;
export type ItemName = string & As<'ItemName'>;
export type MoveName = string & As<'MoveName'>;
export type SpeciesName = string & As<'SpeciesName'>;

export type StatusName = 'slp' | 'psn' | 'brn' | 'frz' | 'par' | 'tox';

export type GameType = 'Singles' | 'Doubles';
export type Terrain = 'Electric' | 'Grassy' | 'Psychic' | 'Misty';
export type Weather =
  | 'Sand' | 'Sun' | 'Rain' | 'Hail' | 'Snow' | 'Harsh Sunshine' | 'Heavy Rain' | 'Strong Winds';

export type NatureName =
  'Adamant' | 'Bashful' | 'Bold' | 'Brave' | 'Calm' |
  'Careful' | 'Docile' | 'Gentle' | 'Hardy' | 'Hasty' |
  'Impish' | 'Jolly' | 'Lax' | 'Lonely' | 'Mild' |
  'Modest' | 'Naive' | 'Naughty' | 'Quiet' | 'Quirky' |
  'Rash' | 'Relaxed' | 'Sassy' | 'Serious' | 'Timid';

export type TypeName =
  'Normal' | 'Fighting' | 'Flying' | 'Poison' | 'Ground' | 'Rock' | 'Bug' | 'Ghost' | 'Steel' |
  'Fire' | 'Water' | 'Grass' | 'Electric' | 'Psychic' | 'Ice' | 'Dragon' | 'Dark' | 'Fairy' |
  'Stellar' | '???';

export type MoveCategory = 'Physical' | 'Special' | 'Status';

export type MoveTarget =
  'adjacentAlly' | 'adjacentAllyOrSelf' | 'adjacentFoe' | 'all' |
  'allAdjacent' | 'allAdjacentFoes' | 'allies' | 'allySide' | 'allyTeam' |
  'any' | 'foeSide' | 'normal' | 'randomNormal' | 'scripted' | 'self';

export interface Generations {
  get(gen: GenerationNum): Generation;
}

export interface Generation {
  readonly num: GenerationNum;
  readonly abilities: Abilities;
  readonly items: Items;
  readonly moves: Moves;
  readonly species: Species;
  readonly types: Types;
  readonly natures: Natures;
}

export type DataKind = 'Ability' | 'Item' | 'Move' | 'Species' | 'Type' | 'Nature';

export interface Data<NameT> {
  readonly id: ID;
  readonly name: NameT;
  readonly kind: DataKind;
}

export interface Abilities {
  get(id: ID): Ability | undefined;
  [Symbol.iterator](): IterableIterator<Ability>;
}

export interface Ability extends Data<AbilityName> {
  readonly kind: 'Ability';
}

export interface Items {
  get(id: ID): Item | undefined;
  [Symbol.iterator](): IterableIterator<Item>;
}

export interface Item extends Data<ItemName> {
  readonly kind: 'Item';
  readonly megaStone?: Readonly<{[megaEvolves: SpeciesName]: SpeciesName}>;
  readonly isBerry?: boolean;
  readonly naturalGift?: Readonly<{basePower: number; type: TypeName}>;
}

export interface Moves {
  get(id: ID): Move | undefined;
  [Symbol.iterator](): IterableIterator<Move>;
}

export interface MoveFlags {
  contact?: 1 | 0;
  bite?: 1 | 0;
  sound?: 1 | 0;
  // TODO: heal?: 1 | 0;
  punch?: 1 | 0;
  bullet?: 1 | 0;
  pulse?: 1 | 0;
  slicing?: 1 | 0;
  wind?: 1| 0;
}

export interface SelfOrSecondaryEffect {
  boosts?: Partial<StatsTable>;
}

export interface Move extends Data<MoveName> {
  readonly kind: 'Move';
  readonly basePower: number;
  readonly type: TypeName;
  readonly category?: MoveCategory;
  readonly flags: MoveFlags;
  readonly secondaries?: any;
  readonly target?: MoveTarget;
  readonly recoil?: [number, number];
  readonly hasCrashDamage?: boolean;
  readonly mindBlownRecoil?: boolean;
  readonly struggleRecoil?: boolean;
  readonly willCrit?: boolean;
  readonly drain?: [number, number];
  readonly priority?: number;
  readonly self?: SelfOrSecondaryEffect | null;
  readonly ignoreDefensive?: boolean;
  readonly overrideOffensiveStat?: StatIDExceptHP;
  readonly overrideDefensiveStat?: StatIDExceptHP;
  readonly overrideOffensivePokemon?: 'target' | 'source';
  readonly overrideDefensivePokemon?: 'target' | 'source';
  readonly breaksProtect?: boolean;
  readonly isZ?: boolean | string;
  readonly zMove?: {
    basePower?: number;
  };
  readonly isMax?: boolean | 'gmax';
  readonly maxMove?: {
    basePower: number;
  };
  readonly multihit?: number | number[];
  readonly multiaccuracy?: boolean;
}

export interface Species {
  get(id: ID): Specie | undefined;
  [Symbol.iterator](): IterableIterator<Specie>;
}

export interface Specie extends Data<SpeciesName> {
  readonly kind: 'Species';
  readonly types: [TypeName] | [TypeName, TypeName];
  readonly baseStats: Readonly<StatsTable>;
  readonly weightkg: number;
  readonly gender?: GenderName;
  readonly nfe?: boolean;
  readonly abilities?: {0: AbilityName | ''};
  readonly canGigantamax?: MoveName;
  readonly otherFormes?: SpeciesName[];
  readonly baseSpecies?: SpeciesName;
}

export interface Types {
  get(id: ID): Type | undefined;
  [Symbol.iterator](): IterableIterator<Type>;
}

export type TypeEffectiveness = 0 | 0.5 | 1 | 2;

export interface Type extends Data<TypeName> {
  readonly kind: 'Type';
  readonly effectiveness: Readonly<{[type in TypeName]?: TypeEffectiveness}>;
}

export interface Natures {
  get(id: ID): Nature | undefined;
  [Symbol.iterator](): IterableIterator<Nature>;
}

export interface Nature extends Data<NatureName> {
  readonly kind: 'Nature';
  readonly plus?: StatID;
  readonly minus?: StatID;
}
