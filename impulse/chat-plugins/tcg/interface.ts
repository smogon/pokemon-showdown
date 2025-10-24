/*
* Pokemon Showdown
* TCG Interface
*/
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
  cardId: string;
  name: string;
  setId: string;
  set: string;
  rarity: string;
  rarityPoints: number;
  supertype: string;
  subtypes: string[];
  subtypePoints: number;
  setPoints: number;
  totalPoints: number;
  types: string[];
  hp?: number;
  level?: string;
  stage?: string;
  imageUrl?: string;
  evolvesFrom?: string;
  evolvesTo?: string[];
  abilities?: TcgAbility[];
  attacks?: TcgAttack[];
  weaknesses?: TcgResistanceWeakness[];
  resistances?: TcgResistanceWeakness[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  cardText?: string;
  ruleText?: string;
  artist?: string;
  nationalPokedexNumbers?: number[];
  ancientTrait?: TcgAncientTrait;
  number?: string;
  setSeries?: string;
  setReleaseDate?: string;
  setPrintedTotal?: number;
  setTotal?: number;
  setPtcgoCode?: string;
  setImages?: TcgSetImages;
  legalities?: TcgLegalities;
  regulationMark?: string;
  importedAt: string;
  dataVersion: string;
}

export interface TcgUser {
  userId: string;
  cardId: string;
  quantity: number;
  firstAcquiredAt: string;
  lastAcquiredAt: string;
  name: string;
  setId: string;
  rarity: string;
  totalPoints: number;
  supertype: string;
  types: string[];
  subtypes: string[];
  hp?: number;
  setSeries?: string;
  regulationMark?: string;
}

export interface TcgDailyCooldown {
  userId: string;
  lastClaimedAt: string;
}

export interface TcgUserProfile {
  userId: string;
  userName: string;
  credits: number;
  totalUniqueCards: number;
  totalQuantity: number;
  collectionPoints: number;
  totalSetsCompleted?: number;
  favoriteCards?: string[];
  lastUpdatedAt: string;
}
