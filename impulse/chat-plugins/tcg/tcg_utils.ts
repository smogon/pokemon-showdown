/**
 * Pokemon Showdown
 * TCG Utility Functions
 *
 * This file contains all logic for:
 * 1. In-memory caching (cards, sets, pack generation pools)
 * 2. Cache management (init, clear, stats)
 * 3. Pack generation (router, cache-based, and DB-fallback)
 */
import { ImpulseDB, ImpulseCollection } from '../../impulse-db';
import { TcgCard } from './interface';

const CACHE_SAMPLE_SIZE = 10;
const DB_SAMPLE_SIZE = 10;
export const HIT_CHANCE = 0.75;

export type RarityPool = 'common' | 'uncommon' | 'reverseRare' | 'rarest' | 'fallback';

interface RarityPools {
	common: TcgCard[];
	uncommon: TcgCard[];
	reverseRare: TcgCard[];
	rarest: TcgCard[];
	fallback: TcgCard[];
}

const cardsCache = new Map<string, TcgCard>();
const setsCache = new Map<string, TcgCard>();
const packCache = new Map<string, RarityPools>();
let globalFallbackCache: TcgCard[] = [];

const CUSTOM_COMMON_RARITIES = ['Common'];
const CUSTOM_UNCOMMON_RARITIES = ['Uncommon'];
const CUSTOM_REVERSE_RARE_RARITIES = [
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
const FALLBACK_RARITIES = ['Common'];

function getCardPool(card: TcgCard): RarityPool | null {
	if (CUSTOM_RAREST_RARITIES.includes(card.rarity)) return 'rarest';
	if (CUSTOM_REVERSE_RARE_RARITIES.includes(card.rarity)) return 'reverseRare';
	if (CUSTOM_UNCOMMON_RARITIES.includes(card.rarity)) return 'uncommon';
	if (CUSTOM_COMMON_RARITIES.includes(card.rarity)) return 'common';
	if (FALLBACK_RARITIES.includes(card.rarity)) return 'fallback';
	return null;
}

export async function initializeCache(): Promise<{ cardCount: number; setCount: number; }> {
	console.log('Starting TCG cache initialization...');
	clearCache();

	const collection = ImpulseDB<TcgCard>('tcg_cards');
	const allCards = await collection.find({});

	if (allCards.length === 0) {
		console.error('TCG cache initialization failed: No cards found in database.');
		return { cardCount: 0, setCount: 0 };
	}

	for (const card of allCards) {
		cardsCache.set(card.cardId, card);

		if (!setsCache.has(card.setId)) {
			setsCache.set(card.setId, card);
		}

		if (!packCache.has(card.setId)) {
			packCache.set(card.setId, {
				common: [],
				uncommon: [],
				reverseRare: [],
				rarest: [],
				fallback: [],
			});
		}

		const setPools = packCache.get(card.setId)!;
		const poolName = getCardPool(card);
		
		if (poolName) {
			if (poolName === 'common') {
				setPools.common.push(card);
				setPools.fallback.push(card);
				globalFallbackCache.push(card);
			} else if (poolName === 'fallback') {
				setPools.fallback.push(card);
			} else {
				setPools[poolName].push(card);
			}
		}
	}

	console.log(`TCG cache initialization complete: ${cardsCache.size} cards, ${setsCache.size} sets.`);
	return { cardCount: cardsCache.size, setCount: setsCache.size };
}

export function clearCache(): { cardsCleared: number; setsCleared: number; } {
	const stats = {
		cardsCleared: cardsCache.size,
		setsCleared: setsCache.size,
	};
	cardsCache.clear();
	setsCache.clear();
	packCache.clear();
	globalFallbackCache = [];
	console.log('TCG caches cleared.');
	return stats;
}

export function getCacheStats(): {
	cardsCached: number;
	setsCached: number;
	packCacheSets: number;
	globalFallbackCards: number;
	isInitialized: boolean;
} {
	return {
		cardsCached: cardsCache.size,
		setsCached: setsCache.size,
		packCacheSets: packCache.size,
		globalFallbackCards: globalFallbackCache.length,
		isInitialized: cardsCache.size > 0,
	};
}

export function getCard(cardId: string): TcgCard | undefined {
	return cardsCache.get(cardId);
}

export function getSet(setId: string): TcgCard | undefined {
	return setsCache.get(setId);
}

function getPool(setId: string, pool: RarityPool): TcgCard[] {
	const setPools = packCache.get(setId);
	return setPools?.[pool] || [];
}

function getCardsFromPool(
	setId: string,
	pool: RarityPool,
	size: number,
	excludeIds: string[]
): TcgCard[] {
	const sourcePool = getPool(setId, pool);
	const validCards = sourcePool.filter(c => !excludeIds.includes(c.cardId));
	
	const shuffled = [...validCards].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, size);
}

function getWeightedCardFromPool(
	setId: string,
	pool: RarityPool,
	excludeIds: string[]
): TcgCard | null {
	const sourcePool = getPool(setId, pool);
	const validCards = sourcePool.filter(c => !excludeIds.includes(c.cardId));

	if (validCards.length === 0) return null;

	const shuffled = [...validCards].sort(() => 0.5 - Math.random());
	const sampled = shuffled.slice(0, CACHE_SAMPLE_SIZE);

	sampled.sort((a, b) => a.rarityPoints - b.rarityPoints);

	return sampled[0];
}

function getGlobalFallback(size: number, excludeIds: string[]): TcgCard[] {
	const validCards = globalFallbackCache.filter(c => !excludeIds.includes(c.cardId));
	const shuffled = [...validCards].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, size);
}

/**
 * Main pack generation function. Routes to cache or DB based on initialization status.
 */
export async function generatePack(setId: string): Promise<TcgCard[]> {
	if (getCacheStats().isInitialized) {
		return generatePackFromCache(setId);
	} else {
		return generatePackFromDB(setId);
	}
}

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
