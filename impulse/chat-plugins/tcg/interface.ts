export interface TcgAbility {
  name: string;
  text: string;
  type: string;
}

export interface TcgAttack {
  name: string;
  cost: string[];
  convertedEnergyCost: number;
  damage: string;
  text: string;
}

export interface TcgResistanceWeakness {
  type: string;
  value: string;
}

export interface TcgSetImages {
  symbol: string;
  logo: string;
}

export interface TcgAncientTrait {
  name: string;
  text: string;
}

export interface TcgLegalities {
  standard?: string;
  expanded?: string;
  unlimited?: string;
  [key: string]: string | undefined;
}

export interface TcgCard {
  // ===== Core Identification =====
  cardId: string;
  name: string;
  setId: string;
  set: string;
  rarity: string;
  /** Calculated points based on rarity */
  rarityPoints: number;
  supertype: string;
  subtypes: string[];
  /** Calculated points based on subtypes */
  subtypePoints: number;
  /** Calculated points based on set size */
  setPoints: number;
  /** Total calculated points (rarity + subtype + set) */
  totalPoints: number;

  // ===== Type Information =====
  types: string[];

  // ===== Basic Stats =====
  hp?: number;
  level?: string;
  /** Determined stage ('basic', 'stage1', 'stage2', etc.) */
  stage?: string;

  // ===== Images =====
  imageUrl?: string;

  // ===== Evolution Chain =====
  evolvesFrom?: string;
  evolvesTo?: string[];

  // ===== Gameplay Data =====
  abilities?: TcgAbility[];
  attacks?: TcgAttack[];
  weaknesses?: TcgResistanceWeakness[];
  resistances?: TcgResistanceWeakness[];
  retreatCost?: string[];
  convertedRetreatCost?: number;

  // ===== Additional Metadata =====
  /** Flavor text from the card */
  cardText?: string;
  /** Joined rules text */
  ruleText?: string;
  artist?: string;
  nationalPokedexNumbers?: number[];
  ancientTrait?: TcgAncientTrait;

  // ===== Set Information (from sets lookup) =====
  number?: string;
  setSeries?: string;
  setReleaseDate?: string;
  setPrintedTotal?: number;
  setTotal?: number;
  setPtcgoCode?: string;
  setImages?: TcgSetImages;

  // ===== Legalities =====
  legalities?: TcgLegalities;
  regulationMark?: string;

  // ===== Import Tracking =====
  importedAt: string;
  dataVersion: string;
}
