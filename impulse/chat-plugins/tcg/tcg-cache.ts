/**
 * In-memory cache for TCG data to reduce database load.
 * This cache should be populated on startup or via a command.
 */

import { ImpulseDB } from '../../impulse-db';
import { TcgCard } from './interface';
import {
	CUSTOM_COMMON_RARITIES,
	CUSTOM_UNCOMMON_RARITIES,
	CUSTOM_REVERSE_RARE_RARITIES,
	CUSTOM_RAREST_RARITIES,
	FALLBACK_RARITIES,
} from './utils'; // Assuming utils.ts will export these

const SAMPLE_SIZE = 20; // Number of cards to sample for weighted selection

export type RarityPool = 'common' | 'uncommon' | 'reverseRare' | 'rarest' | 'fallback';

interface RarityPools {
	common: TcgCard[];
	uncommon: TcgCard[];
	reverseRare: TcgCard[];
	rarest: TcgCard[];
	fallback: TcgCard[];
}

// 1. Cache for /tcg card (cardId -> TcgCard)
const cardsCache = new Map<string, TcgCard>();

// 2. Cache for /tcg set (setId -> TcgCard)
//    We only need one sample card to get set info
const setsCache = new Map<string, TcgCard>();

// 3. Cache for /tcg openpack (setId -> RarityPools)
const packCache = new Map<string, RarityPools>();
let globalFallbackCache: TcgCard[] = [];

/**
 * Helper to get the rarity pool for a card
 */
function getCardPool(card: TcgCard): RarityPool | null {
	if (CUSTOM_RAREST_RARITIES.includes(card.rarity)) return 'rarest';
	if (CUSTOM_REVERSE_RARE_RARITIES.includes(card.rarity)) return 'reverseRare';
	if (CUSTOM_UNCOMMON_RARITIES.includes(card.rarity)) return 'uncommon';
	if (CUSTOM_COMMON_RARITIES.includes(card.rarity)) return 'common';
	if (FALLBACK_RARITIES.includes(card.rarity)) return 'fallback';
	return null;
}

/**
 * Clears and repopulates all in-memory caches from the database.
 */
export async function initializeCache(): Promise<{ cardCount: number; setCount: number; }> {
	console.log('Starting TCG cache initialization...');
	// Clear existing caches
	clearCache(); // Use the new clear function

	const collection = ImpulseDB<TcgCard>('tcg_cards');
	const allCards = await collection.find({});

	if (allCards.length === 0) {
		console.error('TCG cache initialization failed: No cards found in database.');
		return { cardCount: 0, setCount: 0 };
	}

	// Iterate and populate caches
	for (const card of allCards) {
		// 1. Populate cardsCache
		cardsCache.set(card.cardId, card);

		// 2. Populate setsCache (one card per set)
		if (!setsCache.has(card.setId)) {
			setsCache.set(card.setId, card);
		}

		// 3. Populate packCache
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
				// Add Commons to both 'common' and 'fallback' pools for the set
				setPools.common.push(card);
				setPools.fallback.push(card);
				// Also add to global fallback
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

/**
 * Clears all in-memory caches.
 */
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

/**
 * Retrieves statistics about the current cache state.
 */
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


// === Cache Accessors ===

/**
 * Gets a card by its ID from the cache.
 */
export function getCard(cardId: string): TcgCard | undefined {
	return cardsCache.get(cardId);
}

/**
 * Gets a sample card for a set ID from the cache.
 */
export function getSet(setId: string): TcgCard | undefined {
	return setsCache.get(setId);
}

/**
 * Gets a pool of cards for a specific set.
 */
function getPool(setId: string, pool: RarityPool): TcgCard[] {
	const setPools = packCache.get(setId);
	return setPools?.[pool] || [];
}

/**
 * Replicates the `getRandomCards` logic, but on the cache.
 */
export function getCardsFromPool(
	setId: string,
	pool: RarityPool,
	size: number,
	excludeIds: string[]
): TcgCard[] {
	const sourcePool = getPool(setId, pool);
	const validCards = sourcePool.filter(c => !excludeIds.includes(c.cardId));
	
	// Shuffle and pick
	const shuffled = [...validCards].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, size);
}

/**
 * Replicates the `getWeightedRandomCard` logic, but on the cache.
 */
export function getWeightedCardFromPool(
	setId: string,
	pool: RarityPool,
	excludeIds: string[]
): TcgCard | null {
	const sourcePool = getPool(setId, pool);
	const validCards = sourcePool.filter(c => !excludeIds.includes(c.cardId));

	if (validCards.length === 0) return null;

	// Sample N cards from the valid pool
	const shuffled = [...validCards].sort(() => 0.5 - Math.random());
	const sampled = shuffled.slice(0, SAMPLE_SIZE);

	// Sort the sample by rarityPoints (lowest first)
	sampled.sort((a, b) => a.rarityPoints - b.rarityPoints);

	return sampled[0];
}

/**
 * Gets cards from the global fallback cache (all commons).
 */
export function getGlobalFallback(size: number, excludeIds: string[]): TcgCard[] {
	const validCards = globalFallbackCache.filter(c => !excludeIds.includes(c.cardId));
	const shuffled = [...validCards].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, size);
}
