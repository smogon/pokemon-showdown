import { ImpulseDB, ImpulseCollection } from '../../impulse-db';
import { TcgCard } from './interface';

const COLLECTION_NAME = 'tcg_cards';
const HIT_CHANCE = 0.3; // 30% chance for the 10th slot to be from the "Rarest" pool
const SAMPLE_SIZE = 20; // Number of cards to sample for weighted selection

// ==================== CUSTOM RARITY DEFINITIONS (Based on Rarity Points) ====================

// Pool 1: Commons (10 pts)
const CUSTOM_COMMON_RARITIES = ['Common'];

// Pool 2: Uncommons (20 pts)
const CUSTOM_UNCOMMON_RARITIES = ['Uncommon'];

// Pool 3: Regular Rares (25 pts to 99 pts)
const CUSTOM_REVERSE_RARE_RARITIES = [
  'Reverse Holo', 'Rare', 'Double Rare', 'Rare Holo', 'Classic Collection',
  'Rare Holo 1st Edition', 'Rare SP', 'Rare Holo EX', 'Rare Holo GX', 'Rare Holo V',
];

// Pool 4: Rarest (100+ pts)
const CUSTOM_RAREST_RARITIES = [
  'Rare Prime', 'LEGEND', 'Rare BREAK', 'Prism Star', 'Rare Holo VMAX',
  'Rare Holo VSTAR', 'Rare ex', 'Radiant Rare', 'Shining', 'Amazing Rare',
  'ACE SPEC Rare', 'Rare ACE', 'Full Art', 'Rare Ultra', 'Ultra Rare',
  'Rare Shiny', 'Shiny Rare', 'Rare Shiny GX', 'Shiny Ultra Rare',
  'Trainer Gallery', 'Character Rare', 'Illustration Rare', 'Rare Holo LV.X',
  'Rare Holo Star', 'Star', 'Character Super Rare', 'Rare Secret', 'Secret Rare',
  'Special Illustration Rare', 'Rare Rainbow', 'Rare Gold', 'Hyper Rare',
  'Gold Full Art', 'Gold Star',
];

/**
 * Ultimate fallback pool. If we still need cards,
 * we pull from this list (most common cards).
 */
const FALLBACK_RARITIES = ['Common'];

// ==================== HELPER FUNCTIONS ====================

/**
 * Fetches a specified number of *uniformly* random cards,
 * ensuring they are not in the excludeIds list.
 * Can optionally search all sets if setId is null.
 */
async function getRandomCards(
  collection: ImpulseCollection<TcgCard>,
  setId: string | null, // Allow null to search all sets
  rarities: string[],
  size: number,
  excludeIds: string[] = [] // List of cardIds to exclude
): Promise<TcgCard[]> {
  
  const match: any = {
    rarity: { $in: rarities },
    cardId: { $nin: excludeIds } // Exclude already-picked cards
  };

  // Add setId filter *only* if it's provided
  if (setId) {
    match.setId = setId;
  }

  const matchStage = { $match: match };
  const sampleStage = { $sample: { size: size } };
  const pipeline = [matchStage, sampleStage];
  return collection.aggregate<TcgCard>(pipeline);
}

/**
 * Fetches one *weighted* random card from a pool,
 * ensuring it is not in the excludeIds list.
 * It favors cards with *lower* rarityPoints within that pool.
 */
async function getWeightedRandomCard(
  collection: ImpulseCollection<TcgCard>,
  setId: string,
  rarities: string[],
  excludeIds: string[] = [] // List of cardIds to exclude
): Promise<TcgCard | null> {
  const matchStage = {
    $match: {
      setId: setId,
      rarity: { $in: rarities },
      cardId: { $nin: excludeIds } // Exclude already-picked cards
    }
  };
  const sampleStage = { $sample: { size: SAMPLE_SIZE } };
  const pipeline = [matchStage, sampleStage];
  
  const sampledCards = await collection.aggregate<TcgCard>(pipeline);

  if (sampledCards.length === 0) {
    return null;
  }

  // Sort the sample by rarityPoints (lowest first)
  sampledCards.sort((a, b) => a.rarityPoints - b.rarityPoints);

  // Return the card with the *lowest* points from the random sample
  return sampledCards[0];
}

// ==================== MAIN FUNCTION ====================

/**
 * Generates a 10-card booster pack with weighted rarity and fallbacks.
 *
 * It attempts to fill the pack with:
 * - 5 Common cards
 * - 3 Uncommon cards
 * - 1 "Regular Rare" card (25-99 pts)
 * - 1 "Hit" slot (weighted 100+ pts or another 25-99 pt card)
 *
 * If any slots fail to fill, it uses "Common" cards from the
 * *same set* as a fallback.
 * If the pack still isn't full (e.g., set has < 10 cards),
 * it uses "Common" cards from *any set* as a final fallback.
 *
 * @param setId The 'setId' of the set to generate a pack from (e.g., 'sv1')
 * @returns A promise that resolves to an array of 10 TcgCard objects
 */
export async function generatePack(setId: string): Promise<TcgCard[]> {
  const collection = ImpulseDB<TcgCard>(COLLECTION_NAME);
  const pack: TcgCard[] = [];
  let excludeIds: string[] = [];

  try {
    // --- 1. Get the 9 "base" cards (Commons, Uncommons, Regular Rare) ---
    const [
      commonCards,
      uncommonCards,
      reverseRareSlotCards,
    ] = await Promise.all([
      getRandomCards(collection, setId, CUSTOM_COMMON_RARITIES, 5, excludeIds),
      getRandomCards(collection, setId, CUSTOM_UNCOMMON_RARITIES, 3, excludeIds),
      getRandomCards(collection, setId, CUSTOM_REVERSE_RARE_RARITIES, 1, excludeIds),
    ]);

    // Add successfully fetched cards to the pack and update exclude list
    pack.push(...commonCards, ...uncommonCards, ...reverseRareSlotCards);
    excludeIds = pack.map(c => c.cardId);

    // --- 2. Handle the 10th "Hit" Slot ---
    let tenthCard: TcgCard | null = null;

    if (Math.random() < HIT_CHANCE) {
      // 30% chance: Try to get a weighted "Rarest" card (100+ pts)
      tenthCard = await getWeightedRandomCard(collection, setId, CUSTOM_RAREST_RARITIES, excludeIds);
    }

    // If we didn't get a "Rarest" card (either by chance or because none exist),
    // fill the 10th slot with a "Regular Rare" (25-99 pts).
    if (!tenthCard) {
      const regularRareFallback = await getRandomCards(collection, setId, CUSTOM_REVERSE_RARE_RARITIES, 1, excludeIds);
      if (regularRareFallback.length > 0) {
        tenthCard = regularRareFallback[0];
      }
    }
    
    // If we *still* don't have a 10th card (e.g., set has no Regular Rares),
    // try to get an *ultimate fallback* card (Common from same set).
    if (!tenthCard) {
        const ultimateFallback = await getRandomCards(collection, setId, FALLBACK_RARITIES, 1, excludeIds);
        if (ultimateFallback.length > 0) {
            tenthCard = ultimateFallback[0];
        }
    }

    // Add the 10th card to the pack if we found one
    if (tenthCard) {
      pack.push(tenthCard);
    }

    // --- 3. First Pack Fill (Same Set) ---
    // Check if the pack still has fewer than 10 cards
    let missingCount = 10 - pack.length;
    if (missingCount > 0) {
      excludeIds = pack.map(c => c.cardId);
      const fillCards = await getRandomCards(collection, setId, FALLBACK_RARITIES, missingCount, excludeIds);
      pack.push(...fillCards);
    }
    
    // --- 4. Final Fallback Fill (Any Set) ---
    // If the pack *still* has fewer than 10 cards (e.g., set has < 10 total cards)
    // fill the remaining slots with "Common" cards from *any set*.
    missingCount = 10 - pack.length;
    if (missingCount > 0) {
      excludeIds = pack.map(c => c.cardId);
      // Pass 'null' for setId to search all sets
      const ultimateFillCards = await getRandomCards(collection, null, FALLBACK_RARITIES, missingCount, excludeIds);
      pack.push(...ultimateFillCards);
    }

    // --- 5. Final Validation ---
    if (pack.length < 10) {
        throw new Error(`Total card database has fewer than 10 unique cards available.`);
    }

    // Return the 10-card pack
    return pack;

  } catch (error) {
    console.error(`Error generating pack for set ${setId}:`, error);
    throw new Error(`Failed to generate pack for set ${setId}. Set may not have enough cards to build a pack.`);
  }
}
