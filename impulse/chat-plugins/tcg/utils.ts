import { ImpulseDB, ImpulseCollection } from '../../impulse-db';
import { TcgCard } from './interface';
import {
	getCardsFromPool,
	getWeightedCardFromPool,
	getGlobalFallback,
	getCacheStats, // Import cache status checker
} from './tcg-cache';

// Constants for both DB and Cache logic
const HIT_CHANCE = 0.3;
const DB_SAMPLE_SIZE = 20; // For DB-based weighted random

// ==================== CUSTOM RARITY DEFINITIONS ====================
// (Exported for cache)
export const CUSTOM_COMMON_RARITIES = ['Common'];
export const CUSTOM_UNCOMMON_RARITIES = ['Uncommon'];
export const CUSTOM_REVERSE_RARE_RARITIES = [
  'Reverse Holo', 'Rare', 'Double Rare', 'Rare Holo', 'Classic Collection',
  'Rare Holo 1st Edition', 'Rare SP', 'Rare Holo EX', 'Rare Holo GX', 'Rare Holo V',
];
export const CUSTOM_RAREST_RARITIES = [
  'Rare Prime', 'LEGEND', 'Rare BREAK', 'Prism Star', 'Rare Holo VMAX',
  'Rare Holo VSTAR', 'Rare ex', 'Radiant Rare', 'Shining', 'Amazing Rare',
  'ACE SPEC Rare', 'Rare ACE', 'Full Art', 'Rare Ultra', 'Ultra Rare',
  'Rare Shiny', 'Shiny Rare', 'Rare Shiny GX', 'Shiny Ultra Rare',
  'Trainer Gallery', 'Character Rare', 'Illustration Rare', 'Rare Holo LV.X',
  'Rare Holo Star', 'Star', 'Character Super Rare', 'Rare Secret', 'Secret Rare',
  'Special Illustration Rare', 'Rare Rainbow', 'Rare Gold', 'Hyper Rare',
  'Gold Full Art', 'Gold Star',
];
export const FALLBACK_RARITIES = ['Common'];


// ==================== ROUTER FUNCTION ====================

/**
 * Main function called by commands.
 * Checks if cache is initialized and routes to the appropriate function.
 */
export async function generatePack(setId: string): Promise<TcgCard[]> {
	if (getCacheStats().isInitialized) {
		// Use fast cache-based generation
		return generatePackFromCache(setId);
	} else {
		// Use slower DB-based generation
		return generatePackFromDB(setId);
	}
}

// ==================== CACHE-BASED LOGIC ====================

/**
 * Generates a pack from the in-memory cache (fast).
 */
async function generatePackFromCache(setId: string): Promise<TcgCard[]> {
  const pack: TcgCard[] = [];
  let excludeIds: string[] = [];

  try {
    const commonCards = getCardsFromPool(setId, 'common', 5, excludeIds);
    const uncommonCards = getCardsFromPool(setId, 'uncommon', 3, excludeIds);
    const reverseRareSlotCards = getCardsFromPool(setId, 'reverseRare', 1, excludeIds);
    
    pack.push(...commonCards, ...uncommonCards, ...reverseRareSlotCards);
    excludeIds = pack.map(c => c.cardId);

    let tenthCard: TcgCard | null = null;
    if (Math.random() < HIT_CHANCE) {
      tenthCard = getWeightedCardFromPool(setId, 'rarest', excludeIds);
    }
    if (!tenthCard) {
      const regularRareFallback = getCardsFromPool(setId, 'reverseRare', 1, excludeIds);
      if (regularRareFallback.length > 0) {
        tenthCard = regularRareFallback[0];
      }
    }
    if (!tenthCard) {
        const ultimateFallback = getCardsFromPool(setId, 'fallback', 1, excludeIds);
        if (ultimateFallback.length > 0) {
            tenthCard = ultimateFallback[0];
        }
    }
    if (tenthCard) pack.push(tenthCard);

    let missingCount = 10 - pack.length;
    if (missingCount > 0) {
      excludeIds = pack.map(c => c.cardId);
      const fillCards = getCardsFromPool(setId, 'fallback', missingCount, excludeIds);
      pack.push(...fillCards);
    }
    
    missingCount = 10 - pack.length;
    if (missingCount > 0) {
      excludeIds = pack.map(c => c.cardId);
      const ultimateFillCards = getGlobalFallback(missingCount, excludeIds);
      pack.push(...ultimateFillCards);
    }

    if (pack.length < 10) {
        throw new Error(`Total card database has fewer than 10 unique cards available.`);
    }
    return pack;

  } catch (error) {
    console.error(`Error generating pack from CACHE for set ${setId}:`, error);
    throw new Error(`Failed to generate pack for set ${setId}. Set may not have enough cards to build a pack.`);
  }
}

// ==================== DATABASE-BASED LOGIC ====================
// These functions are restored from the original utils.ts

/**
 * [DB FALLBACK] Fetches *uniformly* random cards from DB.
 */
async function getRandomCardsDB(
  collection: ImpulseCollection<TcgCard>,
  setId: string | null,
  rarities: string[],
  size: number,
  excludeIds: string[] = []
): Promise<TcgCard[]> {
  
  const match: any = {
    rarity: { $in: rarities },
    cardId: { $nin: excludeIds }
  };
  if (setId) {
    match.setId = setId;
  }

  const matchStage = { $match: match };
  const sampleStage = { $sample: { size: size } };
  const pipeline = [matchStage, sampleStage];
  return collection.aggregate<TcgCard>(pipeline);
}

/**
 * [DB FALLBACK] Fetches one *weighted* random card from DB.
 */
async function getWeightedRandomCardDB(
  collection: ImpulseCollection<TcgCard>,
  setId: string,
  rarities: string[],
  excludeIds: string[] = []
): Promise<TcgCard | null> {
  const matchStage = {
    $match: {
      setId: setId,
      rarity: { $in: rarities },
      cardId: { $nin: excludeIds }
    }
  };
  const sampleStage = { $sample: { size: DB_SAMPLE_SIZE } };
  const pipeline = [matchStage, sampleStage];
  
  const sampledCards = await collection.aggregate<TcgCard>(pipeline);
  if (sampledCards.length === 0) return null;
  sampledCards.sort((a, b) => a.rarityPoints - b.rarityPoints);
  return sampledCards[0];
}

/**
 * Generates a pack from the Database (slow).
 */
async function generatePackFromDB(setId: string): Promise<TcgCard[]> {
  const collection = ImpulseDB<TcgCard>('tcg_cards');
  const pack: TcgCard[] = [];
  let excludeIds: string[] = [];

  try {
    const [
      commonCards,
      uncommonCards,
      reverseRareSlotCards,
    ] = await Promise.all([
      getRandomCardsDB(collection, setId, CUSTOM_COMMON_RARITIES, 5, excludeIds),
      getRandomCardsDB(collection, setId, CUSTOM_UNCOMMON_RARITIES, 3, excludeIds),
      getRandomCardsDB(collection, setId, CUSTOM_REVERSE_RARE_RARITIES, 1, excludeIds),
    ]);

    pack.push(...commonCards, ...uncommonCards, ...reverseRareSlotCards);
    excludeIds = pack.map(c => c.cardId);

    let tenthCard: TcgCard | null = null;
    if (Math.random() < HIT_CHANCE) {
      tenthCard = await getWeightedRandomCardDB(collection, setId, CUSTOM_RAREST_RARITIES, excludeIds);
    }
    if (!tenthCard) {
      const regularRareFallback = await getRandomCardsDB(collection, setId, CUSTOM_REVERSE_RARE_RARITIES, 1, excludeIds);
      if (regularRareFallback.length > 0) {
        tenthCard = regularRareFallback[0];
      }
    }
    if (!tenthCard) {
        const ultimateFallback = await getRandomCardsDB(collection, setId, FALLBACK_RARITIES, 1, excludeIds);
        if (ultimateFallback.length > 0) {
            tenthCard = ultimateFallback[0];
        }
    }
    if (tenthCard) pack.push(tenthCard);

    let missingCount = 10 - pack.length;
    if (missingCount > 0) {
      excludeIds = pack.map(c => c.cardId);
      const fillCards = await getRandomCardsDB(collection, setId, FALLBACK_RARITIES, missingCount, excludeIds);
      pack.push(...fillCards);
    }
    
    missingCount = 10 - pack.length;
    if (missingCount > 0) {
      excludeIds = pack.map(c => c.cardId);
      const ultimateFillCards = await getRandomCardsDB(collection, null, FALLBACK_RARITIES, missingCount, excludeIds);
      pack.push(...ultimateFillCards);
    }

    if (pack.length < 10) {
        throw new Error(`Total card database has fewer than 10 unique cards available.`);
    }
    return pack;

  } catch (error) {
    console.error(`Error generating pack from DB for set ${setId}:`, error);
    throw new Error(`Failed to generate pack for set ${setId}. Set may not have enough cards to build a pack.`);
  }
}
