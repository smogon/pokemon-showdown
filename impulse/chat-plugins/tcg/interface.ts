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

/**
 * Represents a user's TCG collection.
 * This will be stored in the 'user_collections' collection.
 * Each document represents ONE card owned by ONE user.
 */
export interface TcgUser {
  /** A unique, normalized user identifier (e.g., 'princeskygit') */
  userId: string;
  /** The unique card identifier (e.g., 'sv3pt5-1') */
  cardId: string;
  /** How many copies of this card the user owns */
  quantity: number;
  /** The ISO date string of when this card was first acquired */
  firstAcquiredAt: string;
  /** The ISO date string of when the quantity was last updated */
  lastAcquiredAt: string;

  // --- Denormalized fields for performance ---
  /** (From TcgCard) The card's name. For filtering. */
  name: string;
  /** (From TcgCard) The set this card belongs to (e.g., 'sv3pt5'). For filtering. */
  setId: string;
  /** (From TcgCard) The card's rarity (e.g., 'Secret Rare'). For filtering. */
  rarity: string;
  /** (From TcgCard) The card's calculated point value. For leaderboards. */
  totalPoints: number;
  /** (From TcgCard) e.g., 'Pokémon', 'Trainer'. For filtering. */
  supertype: string;
  /** (From TcgCard) e.g., ['Fire']. For filtering. */
  types: string[];
  /** (From TcgCard) e.g., ['Stage 1', 'V']. For filtering. */
  subtypes: string[];
  /** (From TcgCard) e.g., 120. For filtering. */
  hp?: number;
  /** (From TcgCard) e.g., 'Scarlet & Violet'. For filtering. */
  setSeries?: string;
  /** (From TcgCard) e.g., 'G'. For filtering. */
  regulationMark?: string;
}

/**
 * Tracks the last time a user claimed their daily reward.
 * This will be stored in a new collection, e.g., 'tcg_cooldowns'.
 */
export interface TcgDailyCooldown {
  /** A unique, normalized user identifier (e.g., 'princeskygit') */
  userId: string;
  /** The ISO date string of when the user last claimed their daily reward */
  lastClaimedAt: string;
}

/**
 * Stores aggregated, pre-calculated stats for each user.
 * This is used for fast leaderboards.
 * Stored in 'user_profiles' collection.
 */
export interface TcgUserProfile {
  /** A unique, normalized user identifier (e.g., 'princeskygit') */
  userId: string;
  /** The user's display name */
  userName: string;
  /** In-game currency */
  credits: number;
  /** The total number of *unique* cards owned. */
  totalUniqueCards: number;
  /** The total quantity of all cards owned. */
  totalQuantity: number;
  /** The sum of (totalPoints * quantity) for all cards. */
  collectionPoints: number;
  /** The ISO date string of when this profile was last updated */
  lastUpdatedAt: string;
}
