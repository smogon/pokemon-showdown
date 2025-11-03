/*
* Pokemon Showdown
* TCG Collections Commands
* @author PrinceSky-Git
*/
import type { TcgCard, TcgUser } from './interface';
import { getSet, getCacheStats } from './tcg_utils';
import { tcgCardsCollection, userCollectionsCollection,
	userProfilesCollection, userPacksCollection } from './tcg_collections';
const SEARCH_PAGE_LIMIT = 80;
const MAX_FAVORITE_CARDS = 10;

function parseCollectionQuery(target: string, defaultUserId: string): {
	filter: any, queryDescription: string, page: number, commandString: string, targetUserId: string,
} {
	const parts = target.split(',');
	let page = 1, query = target.trim(), commandStringForPagination = query;

	if (parts.length > 1) {
		const lastPart = parts[parts.length - 1].trim();
		const potentialPage = parseInt(lastPart);
		if (!isNaN(potentialPage)) {
			page = Math.max(1, potentialPage);
			query = parts.slice(0, -1).join(',').trim();
			commandStringForPagination = query;
		}
	}

	let targetUserId = defaultUserId;
	const filter: any = { $and: [] };
	const descriptions: string[] = [];
	const filterRegex = /(\w+)\s*:\s*([<=>]{1,2})?("[^"]+"|[\w-]+)\s*,?\s*/g;
	const filterMatches: string[] = [];
	let match;
	filterRegex.lastIndex = 0;

	while ((match = filterRegex.exec(query)) !== null) {
		filterMatches.push(match[0]);
		const key = match[1].toLowerCase();
		const operator = match[2];
		const value = match[3].replace(/"/g, '');

		if (key === 'user') {
			targetUserId = value.toLowerCase().replace(/[^a-z0-9]/g, '');
			continue;
		}

		const valueNum = parseInt(value);
		const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const valueRegex = new RegExp(escapedValue, 'i');

		switch (key) {
		case 'rarity':
			filter.$and.push({ rarity: valueRegex });
			descriptions.push(`Rarity: ${value}`);
			break;
		case 'supertype':
		case 'st':
			filter.$and.push({ supertype: valueRegex });
			descriptions.push(`Supertype: ${value}`);
			break;
		case 'subtype':
			filter.$and.push({ subtypes: valueRegex });
			descriptions.push(`Subtype: ${value}`);
			break;
		case 'type':
			filter.$and.push({ types: valueRegex });
			descriptions.push(`Type: ${value}`);
			break;
		case 'hp':
			if (!isNaN(valueNum)) {
				let hpFilter: any = {};
				if (operator === '>') hpFilter = { $gt: valueNum };
				else if (operator === '>=') hpFilter = { $gte: valueNum };
				else if (operator === '<') hpFilter = { $lt: valueNum };
				else if (operator === '<=') hpFilter = { $lte: valueNum };
				else hpFilter = valueNum;
				filter.$and.push({ hp: hpFilter });
				descriptions.push(`HP: ${operator || ''}${value}`);
			}
			break;
		case 'series':
			filter.$and.push({ setSeries: valueRegex });
			descriptions.push(`Series: ${value}`);
			break;
		case 'reg':
			filter.$and.push({ regulationMark: valueRegex });
			descriptions.push(`Reg Mark: ${value}`);
			break;
		case 'set':
			const exactRegex = new RegExp("^" + escapedValue + "$", 'i');
			filter.$and.push({ setId: exactRegex });
			descriptions.push(`Set ID: ${value}`);
			break;
		case 'artist':
		case 'legal':
			descriptions.push(`(Filter ${key}:${value} ignored)`);
			break;
		}
	}

	filter.$and.push({ userId: targetUserId });

	let nameQuery = query;
	for (const matchedFilter of filterMatches) nameQuery = nameQuery.replace(matchedFilter, '');
	const nameQueryClean = nameQuery.trim();

	if (nameQueryClean) {
		const nameRegex = new RegExp(nameQueryClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
		filter.$and.push({ name: nameRegex });
		descriptions.unshift(`Name: '${nameQueryClean}'`);
	}

	const filterDesc = descriptions.length > 0 ? descriptions.join(', ') : 'All Cards';
	let queryDescription = `Owner: ${targetUserId}`;
	if (descriptions.length > 0) queryDescription += `, ${filterDesc}`;
	else queryDescription += ', All Cards';

	let finalCommandString = commandStringForPagination.replace(/user:\s*("[^"]+"|[\w-]+)\s*,?\s*/gi, '').trim();
	finalCommandString = finalCommandString.replace(/,\s*$/, '').trim();

	return { filter, queryDescription, page, commandString: finalCommandString, targetUserId };
}

export const collectionCommands: ChatCommands = {
	async collection(target, room, user) {
		if (!this.runBroadcast()) return;
		try {
			const { filter, queryDescription, page, commandString, targetUserId } = parseCollectionQuery(target, user.id);
			const collection = userCollectionsCollection;

			const statsPipeline: any[] = [
				{ $match: filter },
				{ $group: { _id: null, totalUniqueCards: { $sum: 1 }, totalQuantity: { $sum: "$quantity" }, totalPoints: { $sum: { $multiply: ["$totalPoints", "$quantity"] } } } },
			];
			const statsResult = await collection.aggregate(statsPipeline);
			const stats = statsResult[0] || { totalUniqueCards: 0, totalQuantity: 0, totalPoints: 0 };
			const totalMatches = stats.totalUniqueCards;

			if (totalMatches === 0) {
				return this.errorReply(`No cards found in ${targetUserId}'s collection matching: ${queryDescription.replace(`Owner: ${targetUserId}, `, '')}.`);
			}

			const totalPages = Math.ceil(totalMatches / SEARCH_PAGE_LIMIT);
			const currentPage = Math.min(page, totalPages);
			const skip = (currentPage - 1) * SEARCH_PAGE_LIMIT;

			const pipeline: any[] = [
				{ $match: filter },
				{ $sort: { totalPoints: -1, cardId: 1 } },
				{ $skip: skip },
				{ $limit: SEARCH_PAGE_LIMIT },
			];
			const results = await collection.aggregate<TcgUser>(pipeline);

			let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
			const displayName = targetUserId === user.id ? user.name : targetUserId;
			html += `<strong style="font-size: 20px;">${displayName}'s Card Collection</strong><br />`;
			html += `<div style="font-size: 0.9em; margin-bottom: 5px;">Total Cards: ${stats.totalQuantity.toLocaleString()} | Total Points: ${stats.totalPoints.toLocaleString()}</div>`;

			const filtersOnly = queryDescription.replace(`Owner: ${targetUserId}, `, '').replace(`Owner: ${targetUserId}`, '');
			if (filtersOnly && filtersOnly !== 'All Cards') {
				html += `<div style="font-size: 0.8em; color: #555; margin-bottom: 10px;">Filters: ${filtersOnly}</div>`;
			}
			html += `<div style="font-size: 0.9em; margin-bottom: 10px;">Showing ${results.length} of ${totalMatches.toLocaleString()} unique cards.</div>`;

			if (results.length === 0) html += `No results found for this page.`;
			for (let i = 0; i < results.length; i++) {
				const c = results[i];
				if (i % 4 === 0) {
					if (i > 0) html += `</div><hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
					html += `<div style="display: inline-block; text-align: center;">`;
				}
				const w = 74, h = 103;
				const url = c.imageUrl || `https://via.placeholder.com/${w}x${h}?text=No+Image`;
				const name = c.name || c.cardId;
				const alt = `${name} (${c.cardId})`;
				html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top; position: relative;">`;
				html += `<div style="position: absolute; top: -5px; right: -5px; background: #0055cc; color: white; border-radius: 10px; padding: 2px 6px; font-size: 0.8em; font-weight: bold; z-index: 1;">x${c.quantity}</div>`;
				html += `<button name="send" value="/tcg card ${c.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
				html += `<img src="${url}" width="${w}" height="${h}" alt="${alt}" title="${alt}" style="border-radius: 8px; display: block;" />`;
				html += `</button>`;
				html += `<div style="font-size: 0.85em; margin-top: 3px;">${name}</div>`;
				html += `<div style="font-size: 0.75em;">[ ${c.cardId} ]<br>${c.rarity}</div>`;
				html += `</div>`;
			}
			if (results.length > 0) html += `</div>`;

			if (totalPages > 1) {
				html += `<hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
				html += `<div style="display: flex; justify-content: center; align-items: center; margin-top: 10px; gap: 20px;">`;
				if (currentPage > 1) {
					html += `<button name="send" value="/tcg collection ${commandString}, ${currentPage - 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">&lt; Previous</button>`;
				}
				html += `<div style="font-size: 0.9em; color: #555;">Page ${currentPage} of ${totalPages}</div>`;
				if (currentPage < totalPages) {
					html += `<button name="send" value="/tcg collection ${commandString}, ${currentPage + 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Next &gt;</button>`;
				}
				html += `</div>`;
			}
			html += `</div>`;
			this.sendReply(`|html|${html}`);
		} catch {
			return this.errorReply('An error occurred while fetching your collection.');
		}
	},

	async setprogress(target, room, user) {
		if (!this.runBroadcast()) return;
		const setId = target.trim().toLowerCase(); // <-- FIX: Normalize setId to lowercase
		if (!setId) return this.errorReply('Usage: /tcg setprogress [setid]');
		const targetUserId = user.id;

		try {
			let setInfo: TcgCard | null = null;
			const cacheInitialized = getCacheStats().isInitialized;
			const cardCollection = tcgCardsCollection;

			if (cacheInitialized) {
				setInfo = getSet(setId);
			} else {
				setInfo = await cardCollection.findOne({ setId }); // Will match lowercase DB
			}
			if (!setInfo) {
				return this.errorReply(`Set with ID "${setId}" not found.`);
			}

			const setName = setInfo.set;
			const setLogo = setInfo.setImages?.logo || '';
			// Use the canonical setId from the database
			const canonicalSetId = setInfo.setId;

			// For sets without setTotal (like Promo sets), calculate the actual number of unique cards
			let totalInSet = setInfo.setTotal || 0;
			if (totalInSet === 0) {
				totalInSet = await cardCollection.countDocuments({ setId: canonicalSetId });
				if (totalInSet === 0) {
					return this.errorReply(`Set with ID "${setId}" has no cards in the database.`);
				}
			}

			const userCollection = userCollectionsCollection;
			const userUniqueCount = await userCollection.countDocuments({ userId: targetUserId, setId: canonicalSetId });
			const percentage = (totalInSet > 0) ? (userUniqueCount / totalInSet) * 100 : 0;
			const barWidth = 200;
			const progressWidth = Math.max(0, (barWidth * percentage) / 100);
			const displayName = user.name;

			let html = `<div class="infobox" style="padding: 15px;">`;
			html += `<div style="display: flex; align-items: center; margin-bottom: 10px;">`;
			if (setLogo) html += `<img src="${setLogo}" height="30" alt="${setName} Logo" title="${setName} Logo" style="margin-right: 10px;" />`;
			html += `<strong style="font-size: 1.5em;">${setName} Set Progress</strong>`;
			html += `</div>`;
			html += `<div style="font-size: 0.9em; color: #555; margin-bottom: 15px;">For: <strong>${displayName}</strong></div>`;
			html += `<strong>Collection:</strong> ${userUniqueCount} / ${totalInSet} unique cards<br />`;
			html += `<strong>Completion:</strong> ${percentage.toFixed(1)}%<br />`;
			html += `<div style="background: #eee; border: 1px solid #ccc; border-radius: 4px; width: ${barWidth}px; height: 20px; margin-top: 8px;">`;
			html += `<div style="background: #4CAF50; width: ${progressWidth}px; height: 100%; border-radius: 4px;"></div>`;
			html += `</div></div>`;
			this.sendReply(`|html|${html}`);
		} catch {
			return this.errorReply('An error occurred while fetching your set progress.');
		}
	},

	async missing(target, room, user) {
		if (!this.runBroadcast()) return;
		const parts = target.split(',').map(p => p.trim());
		const setId = parts[0].toLowerCase(); // <-- FIX: Normalize setId to lowercase
		let targetUserId = user.id;
		let targetUserName = user.name;
		let page = 1;
		if (!setId) return this.errorReply('Usage: /tcg missing [setid]');
		let commandString = setId;

		if (parts.length === 3) {
			targetUserId = toID(parts[1]) || user.id;
			targetUserName = parts[1] || user.name;
			page = parseInt(parts[2]);
			if (isNaN(page)) page = 1;
			commandString = `${setId}, ${targetUserName}`;
		} else if (parts.length === 2) {
			const part2 = parts[1];
			const potentialPage = parseInt(part2);
			if (!isNaN(potentialPage)) {
				page = Math.max(1, potentialPage);
				commandString = setId;
			} else {
				targetUserId = toID(part2) || user.id;
				targetUserName = part2 || user.name;
				commandString = `${setId}, ${targetUserName}`;
			}
		}

		try {
			const cardCollection = tcgCardsCollection;
			let setInfo: TcgCard | null | undefined = getSet(setId); // Try cache first
			if (!setInfo) setInfo = await cardCollection.findOne({ setId }); // Will match lowercase DB
			if (!setInfo) return this.errorReply(`Set with ID "${setId}" not found.`);
			const setName = setInfo.set;
			// Use the canonical setId from the database
			const canonicalSetId = setInfo.setId;

			const allSetCardsCount = await cardCollection.countDocuments({ setId: canonicalSetId });
			if (allSetCardsCount === 0) return this.errorReply(`No cards found for set "${setId}".`);

			const countPipeline: any[] = [
				{ $match: { setId: canonicalSetId } },
				{ $lookup: { from: 'user_collections', let: { card_id: "$cardId" }, pipeline: [
					{ $match: { $expr: { $and: [{ $eq: ["$cardId", "$$card_id"] }, { $eq: ["$userId", targetUserId] }] } } },
					{ $project: { _id: 1 } },
				], as: 'userCollectionEntry' } },
				{ $match: { userCollectionEntry: { $eq: [] } } },
				{ $count: 'total' },
			];
			const countResult = await cardCollection.aggregate(countPipeline);
			const totalMatches = countResult[0]?.total || 0;
			if (totalMatches === 0) return this.sendReply(`Congratulations! ${targetUserName} has completed the set "${setName}"!`);

			const limit = SEARCH_PAGE_LIMIT;
			const totalPages = Math.ceil(totalMatches / limit);
			const currentPage = Math.min(page, totalPages);
			const skip = (currentPage - 1) * limit;

			const dataPipeline: any[] = [
				{ $match: { setId: canonicalSetId } },
				{ $lookup: { from: 'user_collections', let: { card_id: "$cardId" }, pipeline: [
					{ $match: { $expr: { $and: [{ $eq: ["$cardId", "$$card_id"] }, { $eq: ["$userId", targetUserId] }] } } },
					{ $project: { _id: 1 } },
				], as: 'userCollectionEntry' } },
				{ $match: { userCollectionEntry: { $eq: [] } } },
				{ $sort: { cardId: 1 } },
				{ $skip: skip },
				{ $limit: limit },
				{ $project: { name: 1, cardId: 1, rarity: 1, imageUrl: 1 } },
			];
			const paginatedResults = await cardCollection.aggregate(dataPipeline);

			let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
			html += `<strong style="font-size: 20px;">Missing Cards from ${setName}</strong><br />`;
			html += `<div style="font-size: 0.9em; margin-bottom: 5px;">For: ${targetUserName}</div>`;
			html += `<div style="font-size: 0.9em; margin-bottom: 10px;">Missing ${totalMatches} of ${allSetCardsCount} cards.</div>`;

			if (paginatedResults.length === 0) html += `No results found for this page.`;
			for (let i = 0; i < paginatedResults.length; i++) {
				const c = paginatedResults[i];
				if (i % 4 === 0) {
					if (i > 0) html += `</div><hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
					html += `<div style="display: inline-block; text-align: center;">`;
				}
				const w = 74, h = 103;
				const url = c.imageUrl || `https://via.placeholder.com/${w}x${h}?text=No+Image`;
				const alt = `${c.name} (${c.cardId})`;
				html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top;">`;
				html += `<button name="send" value="/tcg card ${c.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
				html += `<img src="${url}" width="${w}" height="${h}" alt="${alt}" title="${alt}" style="border-radius: 8px; display: block;" />`;
				html += `</button>`;
				html += `<div style="font-size: 0.85em; margin-top: 3px;">${c.name}</div>`;
				html += `<div style="font-size: 0.75em;">[ ${c.cardId} ]<br>${c.rarity}</div>`;
				html += `</div>`;
			}
			if (paginatedResults.length > 0) html += `</div>`;

			if (totalPages > 1) {
				html += `<hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
				html += `<div style="display: flex; justify-content: center; align-items: center; margin-top: 10px; gap: 20px;">`;
				if (currentPage > 1) {
					html += `<button name="send" value="/tcg missing ${commandString}, ${currentPage - 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">&lt; Previous</button>`;
				}
				html += `<div style="font-size: 0.9em; color: #555;">Page ${currentPage} of ${totalPages}</div>`;
				if (currentPage < totalPages) {
					html += `<button name="send" value="/tcg missing ${commandString}, ${currentPage + 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Next &gt;</button>`;
				}
				html += `</div>`;
			}
			html += `</div>`;
			this.sendReply(`|html|${html}`);
		} catch {
			return this.errorReply('An error occurred while fetching missing cards.');
		}
	},

	async packs(target, room, user) {
		if (!this.runBroadcast()) return;
		try {
			const collection = userPacksCollection;
			const userPacks = await collection.find({ userId: user.id, quantity: { $gt: 0 } }, { sort: { setName: 1 } });
			if (userPacks.length === 0) {
				return this.errorReply("You do not have any saved packs. You can buy them from the /tcg shop.");
			}

			let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
			html += `<strong style="font-size: 20px;">${user.name}'s Saved Packs</strong><br />`;
			html += `<div style="font-size: 0.9em; margin-bottom: 15px;">Click a pack to open one.</div>`;

			for (let i = 0; i < userPacks.length; i++) {
				const p = userPacks[i];
				if (i % 3 === 0) {
					if (i > 0) html += `</div><hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
					html += `<div style="display: inline-block; text-align: center;">`;
				}
				const logoUrl = p.setLogo || `https://via.placeholder.com/80x30?text=${p.setId}`;
				html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top; width: 120px;">`;
				html += `<button name="send" value="/tcg opensavedpack ${p.setId}" style="background: none; border: 1px solid #ccc; border-radius: 8px; padding: 10px; width: 100%; text-align: center; cursor: pointer; min-height: 90px;">`;
				html += `<img src="${logoUrl}" height="30" alt="${p.setName} Logo" title="${p.setName} Logo" style="max-width: 100px; display: block; margin: 0 auto 5px auto;" />`;
				html += `<strong style="font-size: 0.9em; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.setName}</strong>`;
				html += `<span style="font-size: 0.8em;">[ ${p.setId} ]<br>Quantity: ${p.quantity}</span>`;
				html += `</button>`;
				if (p.quantity > 1) {
					html += `<button name="send" value="/tcg openallpacks ${p.setId}" style="background: none; border: 1px solid #aaa; border-radius: 4px; padding: 2px 5px; width: 100%; text-align: center; cursor: pointer; font-size: 0.75em; margin-top: 3px;">`;
					html += `Open All ${p.quantity}`;
					html += `</button>`;
				}
				html += `</div>`;
			}
			if (userPacks.length > 0) html += `</div>`;
			html += `</div>`;
			this.sendReply(`|html|${html}`);
		} catch {
			return this.errorReply('An error occurred while fetching your packs.');
		}
	},

	async profile(target, room, user) {
		if (!this.runBroadcast()) return;
		const targetUserId = toID(target) || user.id;
		const profiles = userProfilesCollection;
		const profile = await profiles.findOne({ userId: targetUserId });

		if (!profile) {
			const errorMsg = targetUserId === user.id ? "You do not have a TCG profile yet. Claim your /tcg daily to start!" : `User "${targetUserId}" does not have a TCG profile.`;
			return this.errorReply(errorMsg);
		}

		const favoriteCardIds = profile.favoriteCards || [];
		let orderedFavoriteCards: Partial<TcgCard>[] = [];

		if (favoriteCardIds.length > 0) {
			const cardCollection = tcgCardsCollection;
			const favoriteCardsData = await cardCollection.find(
				{ cardId: { $in: favoriteCardIds } },
				{ projection: { cardId: 1, imageUrl: 1, name: 1, rarity: 1 } }
			);
			const cardDataMap = new Map<string, Partial<TcgCard>>();
			for (const card of favoriteCardsData) cardDataMap.set(card.cardId, card);
			orderedFavoriteCards = favoriteCardIds.map(id => cardDataMap.get(id)).filter((card): card is Partial<TcgCard> => !!card);
		}

		const { setsCached } = getCacheStats();
		const totalSetsInGame = Math.max(1, setsCached);
		const setsCompleted = profile.totalSetsCompleted || 0;
		const setCompletionPercent = (setsCompleted / totalSetsInGame) * 100;
		const totalTrades = profile.totalTrades || 0;
		const w = 160, h = 222;

		let html = `<div class="infobox" style="display: flex; align-items: stretch; padding: 15px; min-height: ${h + 30}px;">`;
		html += `<div style="flex: 0 0 ${w + 20}px; padding-right: 20px; border-right: 1px solid #ccc; overflow-y: hidden; text-align: center;">`;
		html += `<div style="overflow-x: scroll; overflow-y: hidden; white-space: nowrap; max-width: ${w + 20}px;">`;

		if (orderedFavoriteCards.length > 0) {
			for (const c of orderedFavoriteCards) {
				const url = c.imageUrl || `https://via.placeholder.com/${w}x${h}?text=No+Image`;
				const alt = `${c.name} (${c.cardId})`;
				html += `<div style="display: inline-block; margin-right: 10px; width: ${w}px; vertical-align: top;">`;
				html += `<button name="send" value="/tcg card ${c.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
				html += `<img src="${url}" width="${w}" height="${h}" alt="${alt}" title="${alt}" style="border-radius: 8px; display: block;" />`;
				html += `</button>`;
				html += `<div style="font-size: 0.85em; margin-top: 3px; white-space: pre-wrap;">${c.name}</div>`;
				html += `<div style="font-size: 0.75em; white-space: pre-wrap;">[ ${c.cardId} ]<br>${c.rarity}</div>`;
				html += `</div>`;
			}
		} else {
			html += `<div style="color: #888; text-align: center; padding-top: 50px; font-size: 0.9em; white-space: pre-wrap; width: ${w}px;">`;
			html += `No favorite cards set.<br /><br />Use<br />/tcg favorite [cardId]`;
			html += `</div>`;
		}
		html += `</div></div>`;
		html += `<div style="flex: 1; line-height: 1.7; margin-left: 20px; max-height: ${h + 30}px; overflow-y: auto;">`;
		html += `<strong style="font-size: 22px;">${profile.userName}</strong><br />`;
		html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
		html += `<strong>Collection Points:</strong> ${profile.collectionPoints.toLocaleString()}<br />`;
		html += `<strong>Total Cards:</strong> ${profile.totalQuantity.toLocaleString()}<br />`;
		html += `<strong>Unique Cards:</strong> ${profile.totalUniqueCards.toLocaleString()}<br />`;
		html += `<strong>Credits:</strong> ${profile.credits.toLocaleString()}<br />`;
		html += `<strong>Sets Completed:</strong> ${setsCompleted} / ${totalSetsInGame} (${setCompletionPercent.toFixed(1)}%)<br />`;
		html += `<strong>Trades:</strong> ${totalTrades.toLocaleString()}<br />`;
		html += `<strong>Last Active:</strong> ${new Date(profile.lastUpdatedAt).toLocaleDateString()}<br />`;
		html += `</div></div></div>`;
		this.sendReply(`|html|${html}`);
	},

	async favorite(target, room, user) {
		const cardId = target.trim();
		if (!cardId) return this.errorReply('Usage: /tcg favorite [cardid]');
		const profiles = userProfilesCollection;
		const collections = userCollectionsCollection;

		try {
			const userCard = await collections.findOne({ userId: user.id, cardId });
			if (!userCard) return this.errorReply(`You do not own this card. You can only favorite cards from your collection.`);

			const profile = await profiles.findOne({ userId: user.id });
			const currentFavorites = profile?.favoriteCards || [];

			if (currentFavorites.includes(cardId)) return this.errorReply(`"${userCard.name}" is already in your favorites.`);
			if (currentFavorites.length >= MAX_FAVORITE_CARDS) {
				return this.errorReply(`You already have ${MAX_FAVORITE_CARDS} favorite cards. Use /tcg unfavorite [cardId] to remove one first.`);
			}

			const result = await profiles.updateOne({ userId: user.id }, { $addToSet: { favoriteCards: cardId } });
			if (result.modifiedCount > 0) {
				this.sendReply(`Added "${userCard.name}" to your profile favorites.`);
			} else {
				this.errorReply(`"${userCard.name}" is already in your favorites.`);
			}
		} catch {
			return this.errorReply('An error occurred while adding your favorite card.');
		}
	},

	async unfavorite(target, room, user) {
		const targetId = target.trim().toLowerCase();
		if (!targetId) return this.errorReply('Usage: /tcg unfavorite [cardid|all]');
		const profiles = userProfilesCollection;

		try {
			let result;
			if (targetId === 'all') {
				result = await profiles.updateOne({ userId: user.id }, { $set: { favoriteCards: [] } });
				if (result.modifiedCount > 0) {
					this.sendReply(`Removed all cards from your profile favorites.`);
				} else {
					const profile = await profiles.findOne({ userId: user.id });
					if (profile && (!profile.favoriteCards || profile.favoriteCards.length === 0)) {
						this.errorReply(`Your favorites list is already empty.`);
					} else {
						this.errorReply(`Could not find your profile or your favorites list was already empty.`);
					}
				}
			} else {
				const cardId = target.trim();
				result = await profiles.updateOne({ userId: user.id }, { $pull: { favoriteCards: cardId } });
				if (result.modifiedCount > 0) {
					this.sendReply(`Removed card "${cardId}" from your profile favorites.`);
				} else {
					this.errorReply(`Card "${cardId}" was not in your favorites list.`);
				}
			}
		} catch {
			const action = targetId === 'all' ? 'removing all your favorite cards' : 'removing your favorite card';
			return this.errorReply(`An error occurred while ${action}.`);
		}
	},

	async recalculatestats(target, room, user) {
		let targetUserId = toID(target);
		if (targetUserId) {
			this.checkCan('bypassall');
		} else {
			targetUserId = user.id;
		}

		this.sendReply(`Starting stats recalculation for ${targetUserId}... This may take a while.`);

		try {
			const cardCollection = tcgCardsCollection;
			const userCollection = userCollectionsCollection;
			const profileCollection = userProfilesCollection;

			// Get both setTotal and actual count for each set
			const setTotalsPipeline = [
				{ $group: { _id: "$setId", setTotal: { $first: "$setTotal" }, actualCount: { $sum: 1 } } },
				{ $project: { _id: 0, setId: "$_id", setTotal: { $ifNull: ["$setTotal", 0] }, actualCount: 1 } },
			];
			const allSets = await cardCollection.aggregate<{ setId: string, setTotal: number, actualCount: number }>(setTotalsPipeline);
			if (allSets.length === 0) return this.errorReply("Failed to fetch set totals. Aborting.");

			const userProgressPipeline = [
				{ $match: { userId: targetUserId } },
				{ $group: { _id: "$setId", uniqueCount: { $sum: 1 } } },
			];
			const userSetCounts = await userCollection.aggregate<{ _id: string, uniqueCount: number }>(userProgressPipeline);
			const userProgressMap = new Map<string, number>();
			for (const set of userSetCounts) userProgressMap.set(set._id, set.uniqueCount);

			let setsCompleted = 0;
			for (const set of allSets) {
				// Use actualCount for sets without setTotal (like Promo sets)
				const totalInSet = set.setTotal > 0 ? set.setTotal : set.actualCount;
				if (totalInSet > 0) {
					const userCount = userProgressMap.get(set.setId) || 0;
					if (userCount >= totalInSet) setsCompleted++;
				}
			}

			const allStatsPipeline = [
				{ $match: { userId: targetUserId } },
				{ $group: { _id: null, totalUniqueCards: { $sum: 1 }, totalQuantity: { $sum: "$quantity" }, collectionPoints: { $sum: { $multiply: ["$totalPoints", "$quantity"] } } } },
			];
			const statsResult = await userCollection.aggregate(allStatsPipeline);
			const stats = statsResult[0] || { totalUniqueCards: 0, totalQuantity: 0, collectionPoints: 0 };

			const profile = await profileCollection.findOne({ userId: targetUserId });
			const currentCredits = profile?.credits || 0;
			const userName = profile?.userName || targetUserId;
			const currentFavorites = profile?.favoriteCards || [];
			await profileCollection.updateOne(
				{ userId: targetUserId },
				{
					$set: {
						userName,
						credits: currentCredits,
						totalUniqueCards: stats.totalUniqueCards,
						totalQuantity: stats.totalQuantity,
						collectionPoints: stats.collectionPoints,
						totalSetsCompleted: setsCompleted,
						favoriteCards: currentFavorites,
						lastUpdatedAt: new Date().toISOString(),
					},
				},
				{ upsert: true }
			);

			this.sendReply(`Recalculation complete for ${targetUserId}:`);
			this.sendReply(`- Sets Completed: ${setsCompleted} / ${allSets.length}`);
			this.sendReply(`- Total Points: ${stats.collectionPoints.toLocaleString()}`);
			this.sendReply(`- Unique Cards: ${stats.totalUniqueCards.toLocaleString()}`);
		} catch {
			return this.errorReply(`An error occurred during recalculation: ${error.message}`);
		}
	},
};
