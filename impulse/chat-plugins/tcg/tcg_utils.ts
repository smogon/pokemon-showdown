/**
 * Pokemon Showdown
 * TCG Utility Functions
 */
import { ImpulseDB, ImpulseCollection } from '../../impulse-db';
import { TcgCard, TcgUser, TcgUserProfile } from './interface';
import { userCollectionsCollection, userProfilesCollection, tcgCardsCollection } from './tcg_collections';

export const CACHE_SAMPLE_SIZE = 10;
export const DB_SAMPLE_SIZE = 10;
export const HIT_CHANCE = 0.9;
export const MAX_CARD_QUANTITY = 10;
export const CREDITS_PER_DUPLICATE = 1;
export const MAX_PACK_SIZE = 8;

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

export let dailyShopCache: TcgCard[] = [];
export let currentShopDate: string = '';

export function setShopCache(cache: TcgCard[], date: string) {
	dailyShopCache = cache;
	currentShopDate = date;
}

export function clearShopCache() {
	dailyShopCache = [];
	currentShopDate = '';
}

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

		if (!setsCache.has(card.setId)) setsCache.set(card.setId, card);

		if (!packCache.has(card.setId)) {
			packCache.set(card.setId, {
				common: [], uncommon: [], reverseRare: [], rarest: [], fallback: []
			});
		}

		const setPools = packCache.get(card.setId)!;
		const poolName = getCardPool(card);
		if (poolName) setPools[poolName].push(card);

		if (CUSTOM_COMMON_RARITIES.includes(card.rarity) || FALLBACK_RARITIES.includes(card.rarity)) {
			if (!setPools.fallback.find(c => c.cardId === card.cardId)) setPools.fallback.push(card);
			if (!globalFallbackCache.find(c => c.cardId === card.cardId)) globalFallbackCache.push(card);
		}
	}

	console.log(`TCG cache initialization complete: ${cardsCache.size} cards, ${setsCache.size} sets.`);
	return { cardCount: cardsCache.size, setCount: setsCache.size };
}

export function clearCache(): { cardsCleared: number; setsCleared: number; } {
	const stats = { cardsCleared: cardsCache.size, setsCleared: setsCache.size };
	cardsCache.clear();
	setsCache.clear();
	packCache.clear();
	globalFallbackCache = [];
	clearShopCache();
	console.log('TCG caches cleared.');
	return stats;
}

export function getCacheStats() {
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

export async function addCardsToCollection(user: User, pack: TcgCard[]): Promise<{ creditsAwarded: number }> {
	if (!pack.length) return { creditsAwarded: 0 };

	const now = new Date().toISOString();
	const cardCounts = new Map<string, { card: TcgCard, count: number }>();
	
	for (const card of pack) {
		const existing = cardCounts.get(card.cardId);
		if (existing) {
			existing.count++;
		} else {
			cardCounts.set(card.cardId, { card, count: 1 });
		}
	}

	const cardIdsInPack = Array.from(cardCounts.keys());
	const userCards = await userCollectionsCollection.find({ userId: user.id, cardId: { $in: cardIdsInPack } });

	const currentQty = new Map<string, number>();
	for (const card of userCards) currentQty.set(card.cardId, card.quantity);

	const ops = [];
	let totalPts = 0, totalQty = 0, totalUnique = 0, credits = 0;

	for (const [cardId, { card, count }] of cardCounts.entries()) {
		const curr = currentQty.get(cardId) || 0;
		const newQty = curr + count;
		let finalQty = newQty;

		if (newQty > MAX_CARD_QUANTITY) {
			const excess = newQty - MAX_CARD_QUANTITY;
			credits += (excess * CREDITS_PER_DUPLICATE);
			finalQty = MAX_CARD_QUANTITY;
		}

		const added = finalQty - curr;
		if (added > 0) {
			totalQty += added;
			totalPts += (card.totalPoints * added);
		}
		if (curr === 0 && added > 0) totalUnique++;

		const doc: TcgUser = {
			userId: user.id, cardId: card.cardId, quantity: finalQty,
			firstAcquiredAt: now, lastAcquiredAt: now, name: card.name,
			setId: card.setId, rarity: card.rarity, totalPoints: card.totalPoints,
			supertype: card.supertype, types: card.types || [], subtypes: card.subtypes || [],
			imageUrl: card.imageUrl || undefined, hp: card.hp || undefined,
			setSeries: card.setSeries || undefined, regulationMark: card.regulationMark || undefined,
		};

		if (!doc.imageUrl) delete doc.imageUrl;
		if (!doc.hp) delete doc.hp;
		if (!doc.setSeries) delete doc.setSeries;
		if (!doc.regulationMark) delete doc.regulationMark;

		ops.push({
			updateOne: {
				filter: { userId: user.id, cardId },
				update: {
					$set: { quantity: finalQty, lastAcquiredAt: now },
					$setOnInsert: {
						userId: user.id, cardId: card.cardId, firstAcquiredAt: now,
						name: card.name, setId: card.setId, rarity: card.rarity,
						totalPoints: card.totalPoints, supertype: card.supertype,
						types: card.types || [], subtypes: card.subtypes || [],
						...(card.imageUrl && { imageUrl: card.imageUrl }),
						...(card.hp && { hp: card.hp }),
						...(card.setSeries && { setSeries: card.setSeries }),
						...(card.regulationMark && { regulationMark: card.regulationMark }),
					},
				},
				upsert: true
			}
		});
	}

	if (ops.length > 0) await userCollectionsCollection.bulkWrite(ops, { ordered: false });

	if (totalQty > 0 || totalUnique > 0 || credits > 0) {
		const profile = await userProfilesCollection.findOne({ userId: user.id });
		if (profile) {
			await userProfilesCollection.updateOne(
				{ userId: user.id },
				{
					$inc: { totalQuantity: totalQty, collectionPoints: totalPts, totalUniqueCards: totalUnique, credits },
					$set: { userName: user.name, lastUpdatedAt: now }
				}
			);
		} else {
			await userProfilesCollection.insertOne({
				userId: user.id, userName: user.name, credits,
				totalUniqueCards: totalUnique, totalQuantity: totalQty,
				collectionPoints: totalPts, lastUpdatedAt: now
			});
		}
	}

	return { creditsAwarded: credits };
}

function getPool(setId: string, pool: RarityPool): TcgCard[] {
	return packCache.get(setId)?.[pool] || [];
}

function getCardsFromPool(setId: string, pool: RarityPool, size: number, excludeIds: string[]): TcgCard[] {
	const valid = getPool(setId, pool).filter(c => !excludeIds.includes(c.cardId));
	return [...valid].sort(() => 0.5 - Math.random()).slice(0, size);
}

function getWeightedCardFromPool(setId: string, pool: RarityPool, excludeIds: string[]): TcgCard | null {
	const valid = getPool(setId, pool).filter(c => !excludeIds.includes(c.cardId));
	if (!valid.length) return null;
	const sampled = [...valid].sort(() => 0.5 - Math.random()).slice(0, CACHE_SAMPLE_SIZE);
	sampled.sort((a, b) => a.rarityPoints - b.rarityPoints);
	return sampled[0];
}

function getGlobalFallback(size: number, excludeIds: string[]): TcgCard[] {
	const valid = globalFallbackCache.filter(c => !excludeIds.includes(c.cardId));
	return [...valid].sort(() => 0.5 - Math.random()).slice(0, size);
}

export async function generatePack(setId: string): Promise<TcgCard[]> {
	return getCacheStats().isInitialized ? generatePackFromCache(setId) : generatePackFromDB(setId);
}

async function generatePackFromCache(setId: string): Promise<TcgCard[]> {
	const pack: TcgCard[] = [];
	let excludeIds: string[] = [];

	try {
		const commons = getCardsFromPool(setId, 'common', 3, excludeIds);
		const uncommons = getCardsFromPool(setId, 'uncommon', 3, excludeIds);
		pack.push(...commons, ...uncommons);
		excludeIds = pack.map(c => c.cardId);

		const rare = getCardsFromPool(setId, 'reverseRare', 1, excludeIds);
		if (rare.length > 0) {
			pack.push(rare[0]);
			excludeIds.push(rare[0].cardId);
		} else {
			const fb = getCardsFromPool(setId, 'fallback', 1, excludeIds);
			if (fb.length > 0) {
				pack.push(fb[0]);
				excludeIds.push(fb[0].cardId);
			}
		}

		let eighth: TcgCard | null = null;
		if (Math.random() < HIT_CHANCE) eighth = getWeightedCardFromPool(setId, 'rarest', excludeIds);
		if (!eighth) {
			const fb = getCardsFromPool(setId, 'reverseRare', 1, excludeIds);
			if (fb.length > 0) eighth = fb[0];
		}
		if (!eighth) {
			const fb = getCardsFromPool(setId, 'fallback', 1, excludeIds);
			if (fb.length > 0) eighth = fb[0];
		}
		if (eighth) pack.push(eighth);

		let missing = MAX_PACK_SIZE - pack.length;
		if (missing > 0) {
			excludeIds = pack.map(c => c.cardId);
			pack.push(...getGlobalFallback(missing, excludeIds));
		}

		if (pack.length > MAX_PACK_SIZE) pack.length = MAX_PACK_SIZE;
		if (pack.length < MAX_PACK_SIZE) {
			throw new Error(`Could not generate a full ${MAX_PACK_SIZE}-card pack. Database may lack sufficient unique cards across fallback pools.`);
		}
		return pack;
	} catch (error) {
		console.error(`Error generating pack from CACHE for set ${setId}:`, error);
		throw new Error(`Failed to generate pack for set ${setId}. Set may not have enough cards.`);
	}
}

async function getRandomCardsDB(
	collection: ImpulseCollection<TcgCard>,
	setId: string | null,
	rarities: string[],
	size: number,
	excludeIds: string[] = []
): Promise<TcgCard[]> {
	const match: any = { rarity: { $in: rarities }, cardId: { $nin: excludeIds } };
	if (setId) match.setId = setId;
	return collection.aggregate<TcgCard>([{ $match: match }, { $sample: { size } }]);
}

async function getWeightedRandomCardDB(
	collection: ImpulseCollection<TcgCard>,
	setId: string,
	rarities: string[],
	excludeIds: string[] = []
): Promise<TcgCard | null> {
	const sampled = await collection.aggregate<TcgCard>([
		{ $match: { setId, rarity: { $in: rarities }, cardId: { $nin: excludeIds } } },
		{ $sample: { size: DB_SAMPLE_SIZE } }
	]);
	if (!sampled.length) return null;
	sampled.sort((a, b) => a.rarityPoints - b.rarityPoints);
	return sampled[0];
}

async function generatePackFromDB(setId: string): Promise<TcgCard[]> {
	const pack: TcgCard[] = [];
	let excludeIds: string[] = [];

	try {
		const [commons, uncommons] = await Promise.all([
			getRandomCardsDB(tcgCardsCollection, setId, CUSTOM_COMMON_RARITIES, 3, excludeIds),
			getRandomCardsDB(tcgCardsCollection, setId, CUSTOM_UNCOMMON_RARITIES, 3, excludeIds),
		]);

		pack.push(...commons, ...uncommons);
		excludeIds = pack.map(c => c.cardId);

		const rare = await getRandomCardsDB(tcgCardsCollection, setId, CUSTOM_REVERSE_RARE_RARITIES, 1, excludeIds);
		if (rare.length > 0) {
			pack.push(rare[0]);
			excludeIds.push(rare[0].cardId);
		} else {
			const fb = await getRandomCardsDB(tcgCardsCollection, setId, FALLBACK_RARITIES, 1, excludeIds);
			if (fb.length > 0) {
				pack.push(fb[0]);
				excludeIds.push(fb[0].cardId);
			}
		}

		let eighth: TcgCard | null = null;
		if (Math.random() < HIT_CHANCE) {
			eighth = await getWeightedRandomCardDB(tcgCardsCollection, setId, CUSTOM_RAREST_RARITIES, excludeIds);
		}
		if (!eighth) {
			const fb = await getRandomCardsDB(tcgCardsCollection, setId, CUSTOM_REVERSE_RARE_RARITIES, 1, excludeIds);
			if (fb.length > 0) eighth = fb[0];
		}
		if (!eighth) {
			const fb = await getRandomCardsDB(tcgCardsCollection, setId, FALLBACK_RARITIES, 1, excludeIds);
			if (fb.length > 0) eighth = fb[0];
		}
		if (eighth) pack.push(eighth);

		let missing = MAX_PACK_SIZE - pack.length;
		if (missing > 0) {
			excludeIds = pack.map(c => c.cardId);
			pack.push(...await getRandomCardsDB(tcgCardsCollection, null, FALLBACK_RARITIES, missing, excludeIds));
		}

		if (pack.length > MAX_PACK_SIZE) pack.length = MAX_PACK_SIZE;
		if (pack.length < MAX_PACK_SIZE) {
			throw new Error(`Could not generate a full ${MAX_PACK_SIZE}-card pack. Database may lack sufficient unique cards across fallback pools.`);
		}
		return pack;
	} catch (error) {
		console.error(`Error generating pack from DB for set ${setId}:`, error);
		throw new Error(`Failed to generate pack for set ${setId}. Set may not have enough cards.`);
	}
}

export function renderCardGridHtml(cards: TcgCard[], title?: string, subtitle?: string, options?: { showOpenedPackHeader?: boolean }): string {
	let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
	if (title) html += `<strong style="font-size: 20px;">${title}</strong><br />`;
	if (subtitle) html += `<div style="font-size: 0.95em; margin-bottom: 7px;">${subtitle}</div>`;

	const cardsPerRow = 4;
	for (let i = 0; i < cards.length; i += cardsPerRow) {
		html += `<div style="display: inline-block; text-align: center; width: 100%;">`;
		for (let j = i; j < i + cardsPerRow && j < cards.length; j++) {
			const c = cards[j];
			const w = 74, h = 103;
			const url = c.imageUrl || `https://via.placeholder.com/${w}x${h}?text=No+Image`;
			const alt = `${c.name} (${c.cardId})`;
			html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top; width: 84px;">`;
			html += `<button name="send" value="/tcg card ${c.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
			html += `<img src="${url}" width="${w}" height="${h}" alt="${alt}" title="${alt}" style="border-radius: 8px; display: block;" />`;
			html += `</button>`;
			html += `<div style="font-size: 0.95em; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.name}</div>`;
			html += `<div style="font-size: 0.88em;">[ ${c.cardId} ]<br>${c.rarity}</div>`;
			html += `</div>`;
		}
		html += `</div>`;
		if (i + cardsPerRow < cards.length) {
			html += `<hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc; width: 90%; margin-left: auto; margin-right: auto;">`;
		}
	}
	html += `</div>`;
	return html;
}
