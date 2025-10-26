/*
* Pokemon Showdown
* TCG Commands
*/
import { ImpulseDB } from '../../impulse-db';
import { TcgCard, TcgDailyCooldown, TcgUser,
		  TcgUserProfile, TcgUserPack 
		 } from './interface';
import {
	generatePack, getCard, getSet,
	getCacheStats, renderCardGridHtml, addCardsToCollection,
	dailyShopCache, currentShopDate, setShopCache,
	MAX_CARD_QUANTITY
} from './tcg_utils';
import { generateThemedTable } from '../../utils';
import {
	tcgCardsCollection, userCollectionsCollection,
    userProfilesCollection, userPacksCollection,
    cooldownsCollection
} from './tcg_collections';
import { adminCommands } from './tcg_admin_cmds';
import { economyCommands } from './tcg_economy_cmds';

const SEARCH_PAGE_LIMIT = 60;
const MAX_FAVORITE_CARDS = 10;

function parseSearchQuery(target: string): {
	filter: any,
	queryDescription: string,
	page: number,
	commandString: string
} {
	const parts = target.split(',');
	let page = 1;
	let query = target.trim();
	let commandString = query;

	if (parts.length > 1) {
		const lastPart = parts[parts.length - 1].trim();
		const potentialPage = parseInt(lastPart);
		if (!isNaN(potentialPage)) {
			page = Math.max(1, potentialPage);
			query = parts.slice(0, -1).join(',').trim();
			commandString = query;
		}
	}

	const filter: any = { $and: [] };
	const descriptions: string[] = [];
	
	const filterRegex = /(\w+)\s*:\s*([<=>]{1,2})?("[^"]+"|[\w-]+)/g;
	
	let nameQuery = query;
	let match;

	while ((match = filterRegex.exec(query)) !== null) {
		const key = match[1].toLowerCase();
		const operator = match[2];
		let value = match[3].replace(/"/g, '');

		nameQuery = nameQuery.replace(match[0], '');

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
			case 'artist':
				filter.$and.push({ artist: valueRegex });
				descriptions.push(`Artist: ${value}`);
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
			case 'legal':
				const legalKey = `legalities.${value.toLowerCase()}`;
				filter.$and.push({ [legalKey]: 'Legal' });
				descriptions.push(`Legal: ${value}`);
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
				const partialRegex = new RegExp(escapedValue, 'i');
				const exactRegex = new RegExp("^" + escapedValue + "$", 'i');

				filter.$and.push({ 
					$or: [
						{ set: partialRegex },
						{ setId: exactRegex }
					] 
				});
				descriptions.push(`Set: ${value}`);
				break;
		}
	}

	const nameQueryClean = nameQuery.trim();
	if (nameQueryClean) {
		const nameRegex = new RegExp(nameQueryClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
		filter.$and.push({ name: nameRegex });
		descriptions.unshift(`'${nameQueryClean}'`);
	}

	if (filter.$and.length === 0) {
		delete filter.$and;
	}
	
	const queryDescription = descriptions.length > 0 ? descriptions.join(', ') : 'All Cards';

	return { filter, queryDescription, page, commandString };
}

function parseCollectionQuery(target: string, defaultUserId: string): {
	filter: any,
	queryDescription: string,
	page: number,
	commandString: string,
	targetUserId: string,
} {
	const parts = target.split(',');
	let page = 1;
	let query = target.trim();
	let commandStringForPagination = query;

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
		let value = match[3].replace(/"/g, '');

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
	for (const matchedFilter of filterMatches) {
		nameQuery = nameQuery.replace(matchedFilter, '');
	}
	const nameQueryClean = nameQuery.trim();

	if (nameQueryClean) {
		const nameRegex = new RegExp(nameQueryClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
		filter.$and.push({ name: nameRegex });
		descriptions.unshift(`Name: '${nameQueryClean}'`);
	}
	

	const filterDesc = descriptions.length > 0 ? descriptions.join(', ') : 'All Cards';

    let queryDescription = `Owner: ${targetUserId}`;
    if (descriptions.length > 0) {
        queryDescription += `, ${filterDesc}`;
    } else {
         queryDescription += ', All Cards';
    }
	

    let finalCommandString = commandStringForPagination.replace(/user:\s*("[^"]+"|[\w-]+)\s*,?\s*/gi, '').trim();

    finalCommandString = finalCommandString.replace(/,\s*$/, '').trim();

	return { filter, queryDescription, page, commandString: finalCommandString, targetUserId };
}

export const commands: ChatCommands = {
	tcg: 'pokemontcg',
	pokemontcg: {
		async card(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) return this.parse('/tcg help');

			const cardId = target.trim();
			
			let card: TcgCard | null = null;
			const cacheInitialized = getCacheStats().isInitialized;

			if (cacheInitialized) {
				card = getCard(cardId) || null;
			}
			
			if (!card) {
				const collection = tcgCardsCollection;
				card = await collection.findOne({ cardId });
			}

			if (!card) {
				return this.errorReply(`Card with ID "${cardId}" not found. (Cache: ${cacheInitialized ? 'On' : 'Off'})`);
			}

			const originalWidth = 246;
			const originalHeight = 342;
			const scaleFactor = 0.65;
			const imageWidth = Math.round(originalWidth * scaleFactor);
			const imageHeight = Math.round(originalHeight * scaleFactor);

			const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
			const subtypes = card.subtypes?.length > 0 ? card.subtypes.join(' | ') : 'N/A';
			const imageAlt = `${card.name} (${card.cardId})`;

			let html = `<div class="infobox" style="display: flex; align-items: center; padding: 15px;">`;
			html += `<div style="flex-shrink: 0; padding-right: 20px; border-right: 1px solid #ccc;">`;
			html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
			html += `</div>`;
			html += `<div style="flex: 1; line-height: 1.6; margin-left: 20px; max-height: ${imageHeight}px; overflow-y: auto;">`;
			html += `<strong style="font-size: 22px;">${card.name}</strong> `;
			html += `<span style="font-size: 0.9em; margin-left: 5px;">(${card.cardId})</span><br />`;
			html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
			html += `<strong style="font-size: 1.1em;">Set:</strong> ${card.set} <span style="font-size: 0.9em;">(${card.setId})</span><br />`;
			html += `<strong style="font-size: 1.1em;">Rarity:</strong> ${card.rarity}<br />`;
			html += `<strong style="font-size: 1.1em;">Supertype:</strong> ${card.supertype}<br />`;
			if (card.supertype === 'PokÃ©mon' || card.supertype === 'Trainer') {
				html += `<strong style="font-size: 1.1em;">Subtypes:</strong> ${subtypes}<br />`;
			}
			html += `<strong style="font-size: 1.1em; font-weight: bold;">Points:</strong> ${card.totalPoints}<br />`;
			html += `<strong style="font-size: 1.1em; font-weight: bold;">Artist:</strong> ${card.artist}<br />`;
			html += `<strong style="font-size: 1.1em; font-weight: bold;">Dex:</strong> ${card.cardText || ''}`;
			html += `</div>`;
			html += `</div>`;
			html += `</div>`;

			this.sendReply(`|html|${html}`);
		},

		async openpack(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) return this.parse('/tcg help');

			const setId = target.trim();

			try {
				const pack = await generatePack(setId);
				const title = `${user.name} opened - ${setId} pack.<br>`;
				const html = renderCardGridHtml(pack, title);
				this.sendReply(`|html|${html}`);
			} catch (error) {
				
				return this.errorReply(`An error occurred while generating pack: ${error.message}`);
			}
		},

		async set(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) return this.parse('/tcg help');

			const setId = target.trim();

			let card: TcgCard | null = null;
			const cacheInitialized = getCacheStats().isInitialized;

			if (cacheInitialized) {
				card = getSet(setId) || null;
			}
			
			if (!card) {
				const collection = tcgCardsCollection;
				card = await collection.findOne({ setId });
			}

			if (!card) {
				return this.errorReply(`Set with ID "${setId}" not found. (Cache: ${cacheInitialized ? 'On' : 'Off'})`);
			}

			const setName = card.set;
			const series = card.setSeries || 'N/A';
			const releaseDate = card.setReleaseDate || 'N/A';
			const printedTotal = card.setPrintedTotal || 'N/A';
			const total = card.setTotal || 'N/A';
			const logoUrl = card.setImages?.logo || '';
			const symbolUrl = card.setImages?.symbol || '';
			const logoHeight = 40;

			let html = `<div class="infobox" style="display: flex; align-items: center; padding: 15px;">`;
			if (logoUrl) {
				html += `<div style="flex-shrink: 0; padding-right: 20px; border-right: 1px solid #ccc; text-align: center;">`;
				html += `<img src="${logoUrl}" height="${logoHeight}" alt="${setName} Logo" title="${setName} Logo" style="display: block; max-width: 120px;" />`;
				if (symbolUrl) {
					html += `<img src="${symbolUrl}" height="20" width="20" alt="${setName} Symbol" title="${setName} Symbol" style="margin-top: 10px;" />`;
				}
				html += `</div>`;
			}
			html += `<div style="flex: 1; line-height: 1.6; margin-left: 20px;">`;
			html += `<strong style="font-size: 22px;">${setName}</strong> `;
			html += `<span style="font-size: 0.9em; margin-left: 5px;">(${card.setId})</span><br />`;
			html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
			html += `<strong style="font-size: 1.1em;">Series:</strong> ${series}<br />`;
			html += `<strong style="font-size: 1.1em;">Released:</strong> ${releaseDate}<br />`;
			html += `<strong style="font-size: 1.1em;">Total Cards:</strong> ${total} (Printed: ${printedTotal})<br />`;
			html += `</div>`;
			html += `</div>`;
			html += `</div>`;

			this.sendReply(`|html|${html}`);
		},

		async search(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) return this.parse('/tcg help');

			try {
				const { filter, queryDescription, page, commandString } = parseSearchQuery(target);
				const collection = tcgCardsCollection;

				const totalMatches = await collection.countDocuments(filter);
				if (totalMatches === 0) {
					return this.errorReply(`No cards found matching: ${queryDescription}.`);
				}

				const totalPages = Math.ceil(totalMatches / SEARCH_PAGE_LIMIT);
				const currentPage = Math.min(page, totalPages);
				const skip = (currentPage - 1) * SEARCH_PAGE_LIMIT;

				const results = await collection.find(
					filter,
					{
						limit: SEARCH_PAGE_LIMIT,
						skip: skip,
						projection: { name: 1, cardId: 1, rarity: 1, imageUrl: 1 },
						sort: { rarityPoints: -1, name: 1 },
					}
				);

				let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
				html += `<strong style="font-size: 20px;">Search Results</strong><br />`;
				html += `<div style="font-size: 0.9em; margin-bottom: 5px;">For: ${queryDescription}</div>`;
				html += `<div style="font-size: 0.9em; margin-bottom: 10px;">Showing ${results.length} of ${totalMatches} matching cards.</div>`;

				if (results.length === 0) {
					html += `No results found for this page.`;
				}
				for (let i = 0; i < results.length; i++) {
					const card = results[i];
					if (i % 4 === 0) {
						if (i > 0) html += `</div><hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
						html += `<div style="display: inline-block; text-align: center;">`; 
					}
					const imageWidth = 74;
					const imageHeight = 103;
					const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
					const imageAlt = `${card.name} (${card.cardId})`;
					html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top;">`;
					html += `<button name="send" value="/tcg card ${card.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
					html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
					html += `</button>`;
					html += `<div style="font-size: 0.85em; margin-top: 3px;">${card.name}</div>`;
					html += `<div style="font-size: 0.75em;">[ ${card.cardId} ]<br>${card.rarity}</div>`;
					html += `</div>`;
				}
				if (results.length > 0) html += `</div>`;

				if (totalPages > 1) {
					html += `<hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
					html += `<div style="display: flex; justify-content: center; align-items: center; margin-top: 10px; gap: 20px;">`;
					if (currentPage > 1) {
						html += `<button name="send" value="/tcg search ${commandString}, ${currentPage - 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">&lt; Previous</button>`;
					}
					html += `<div style="font-size: 0.9em; color: #555;">Page ${currentPage} of ${totalPages}</div>`;
					if (currentPage < totalPages) {
						html += `<button name="send" value="/tcg search ${commandString}, ${currentPage + 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Next &gt;</button>`;
					}
					html += `</div>`;
				}
				html += `</div>`;
				this.sendReply(`|html|${html}`);
			} catch (error) {
				
				return this.errorReply('An error occurred while searching for cards.');
			}
		},

		async daily(target, room, user) {
			if (!this.runBroadcast()) return;
			
			const userId = user.id;
                        const cooldowns = cooldownsCollection;
			const now = Date.now();
			const COOLDOWN_MS = 24 * 60 * 60 * 1000;

			const cooldown = await cooldowns.findOne({ userId });
			if (cooldown) {
				const lastClaimed = new Date(cooldown.lastClaimedAt).getTime();
				const timeRemaining = (lastClaimed + COOLDOWN_MS) - now;
				
				if (timeRemaining > 0) {
					const hours = Math.floor(timeRemaining / 3600000);
					const minutes = Math.floor((timeRemaining % 3600000) / 60000);
					const seconds = Math.floor((timeRemaining % 60000) / 1000);
					return this.errorReply(`You must wait ${hours}h ${minutes}m ${seconds}s before claiming your next daily pack.`);
				}
			}

			let randomSetId = 'sv3pt5';
			
			try {
				const setCollection = tcgCardsCollection;
				const randomSetArr = await setCollection.aggregate<{ setId: string }>([
					{ $group: { _id: "$setId" } },
					{ $sample: { size: 1 } },
					{ $project: { _id: 0, setId: "$_id" } }
				]);
				if (randomSetArr.length > 0) {
					randomSetId = randomSetArr[0].setId;
				}

				const pack = await generatePack(randomSetId);
				
				const { creditsAwarded } = await addCardsToCollection(user, pack);

				await cooldowns.updateOne(
					{ userId: userId },
					{ $set: { lastClaimedAt: new Date(now).toISOString() } },
					{ upsert: true }
				);
				
				const title = `${user.name} opened their daily pack! (${randomSetId})`;
				const subtitle = creditsAwarded > 0 ? `+${creditsAwarded} Credits from duplicates!<br>` : undefined;
				const html = renderCardGridHtml(pack, title, subtitle);

				this.sendReply(`|html|${html}`);
				
			} catch (error) {
				
				return this.errorReply(`An error occurred while generating your daily pack: ${error.message}`);
			}
		},

		async collection(target, room, user) {
			if (!this.runBroadcast()) return;

			try {
				const { filter, queryDescription, page, commandString, targetUserId } = parseCollectionQuery(target, user.id);
				const collection = userCollectionsCollection;

				const statsPipeline: any[] = [
					{ $match: filter },
					{
						$group: {
							_id: null,
							totalUniqueCards: { $sum: 1 },
							totalQuantity: { $sum: "$quantity" },
							totalPoints: { $sum: { $multiply: ["$totalPoints", "$quantity"] } }
						}
					}
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

				if (results.length === 0) {
					html += `No results found for this page.`;
				}
				for (let i = 0; i < results.length; i++) {
					const userCard = results[i];
					
					if (i % 4 === 0) {
						if (i > 0) html += `</div><hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
						html += `<div style="display: inline-block; text-align: center;">`; 
					}
					
					const imageWidth = 74;
					const imageHeight = 103;
					const imageUrl = userCard.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
					const name = userCard.name || userCard.cardId;
					const imageAlt = `${name} (${userCard.cardId})`;
					
					html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top; position: relative;">`;
					html += `<div style="position: absolute; top: -5px; right: -5px; background: #0055cc; color: white; border-radius: 10px; padding: 2px 6px; font-size: 0.8em; font-weight: bold; z-index: 1;">`;
					html += `x${userCard.quantity}</div>`;
					
					html += `<button name="send" value="/tcg card ${userCard.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
					html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
					html += `</button>`;
					html += `<div style="font-size: 0.85em; margin-top: 3px;">${name}</div>`;
					html += `<div style="font-size: 0.75em;">[ ${userCard.cardId} ]<br>${userCard.rarity}</div>`;
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
			} catch (error) {
				
				return this.errorReply('An error occurred while fetching your collection.');
			}
		},

		async setprogress(target, room, user) {
			if (!this.runBroadcast()) return;
			
			const setId = target.trim();
			if (!setId) {
				return this.parse('/tcg help');
			}

			const targetUserId = user.id; 

			try {
				let setInfo: TcgCard | null = null;
				const cacheInitialized = getCacheStats().isInitialized;

				if (cacheInitialized) {
					setInfo = getSet(setId);
				}
				
				if (!setInfo) {
					const cardCollection = tcgCardsCollection;
					setInfo = await cardCollection.findOne({ setId: setId });
				}

				if (!setInfo || !setInfo.setTotal) {
					return this.errorReply(`Set with ID "${setId}" not found or has no card total listed.`);
				}
				
				const totalInSet = setInfo.setTotal;
				const setName = setInfo.set;
				const setLogo = setInfo.setImages?.logo || '';

				const userCollection = userCollectionsCollection;
				const userUniqueCount = await userCollection.countDocuments({
					userId: targetUserId,
					setId: setId,
				});

				const percentage = (totalInSet > 0) ? (userUniqueCount / totalInSet) * 100 : 0;
				const barWidth = 200;
				const progressWidth = Math.max(0, (barWidth * percentage) / 100);
				
				const displayName = user.name;

				let html = `<div class="infobox" style="padding: 15px;">`;
				html += `<div style="display: flex; align-items: center; margin-bottom: 10px;">`;
				if (setLogo) {
					html += `<img src="${setLogo}" height="30" alt="${setName} Logo" title="${setName} Logo" style="margin-right: 10px;" />`;
				}
				html += `<strong style="font-size: 1.5em;">${setName} Set Progress</strong>`;
				html += `</div>`;
				html += `<div style="font-size: 0.9em; color: #555; margin-bottom: 15px;">For: <strong>${displayName}</strong></div>`;
				
				html += `<strong>Collection:</strong> ${userUniqueCount} / ${totalInSet} unique cards<br />`;
				html += `<strong>Completion:</strong> ${percentage.toFixed(1)}%<br />`;

				html += `<div style="background: #eee; border: 1px solid #ccc; border-radius: 4px; width: ${barWidth}px; height: 20px; margin-top: 8px;">`;
				const progressStyle = `background: #4CAF50; width: ${progressWidth}px; height: 100%; border-radius: 4px;`;
				html += `<div style="${progressStyle}"></div>`;
				html += `</div>`;
				
				html += `</div>`;
				
				this.sendReply(`|html|${html}`);

			} catch (error) {
				
				return this.errorReply('An error occurred while fetching your set progress.');
			}
		},

      async missing(target, room, user) {
			if (!this.runBroadcast()) return;

			const parts = target.split(',').map(p => p.trim());
			let setId = parts[0];
			let targetUserId = user.id;
			let targetUserName = user.name;
			let page = 1;
			
			if (!setId) return this.parse('/help tcg missing');

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

				let setInfo: TcgCard | null | undefined = getSet(setId);
				if (!setInfo) {
					setInfo = await cardCollection.findOne({ setId: setId });
				}

				if (!setInfo) {
					return this.errorReply(`Set with ID "${setId}" not found.`);
				}
				const setName = setInfo.set;

				
				const allSetCardsCount = await cardCollection.countDocuments({ setId: setId });
				if (allSetCardsCount === 0) {
					return this.errorReply(`No cards found for set "${setId}".`);
				}

				
				const countPipeline: any[] = [
					{ $match: { setId: setId } },
					{
						$lookup: {
							from: 'user_collections',
							let: { card_id: "$cardId" },
							pipeline: [
								{ $match: { $expr: { $and: [ { $eq: ["$cardId", "$$card_id"] }, { $eq: ["$userId", targetUserId] } ] } } },
								{ $project: { _id: 1 } }
							],
							as: 'userCollectionEntry'
						}
					},
					{ $match: { userCollectionEntry: { $eq: [] } } },
					{ $count: 'total' }
				];
				const countResult = await cardCollection.aggregate(countPipeline);
				const totalMatches = countResult[0]?.total || 0;
				
				if (totalMatches === 0) {
					return this.sendReply(`Congratulations! ${targetUserName} has completed the set "${setName}"!`);
				}

				
				const limit = SEARCH_PAGE_LIMIT;
				const totalPages = Math.ceil(totalMatches / limit);
				const currentPage = Math.min(page, totalPages);
				const skip = (currentPage - 1) * limit;

				
				const dataPipeline: any[] = [
					{ $match: { setId: setId } },
					{
						$lookup: {
							from: 'user_collections',
							let: { card_id: "$cardId" },
							pipeline: [
								{ $match: { $expr: { $and: [ { $eq: ["$cardId", "$$card_id"] }, { $eq: ["$userId", targetUserId] } ] } } },
								{ $project: { _id: 1 } }
							],
							as: 'userCollectionEntry'
						}
					},
					{ $match: { userCollectionEntry: { $eq: [] } } },
					{ $sort: { cardId: 1 } },
					{ $skip: skip },
					{ $limit: limit },
					{ $project: { name: 1, cardId: 1, rarity: 1, imageUrl: 1 } }
				];
				const paginatedResults = await cardCollection.aggregate(dataPipeline);
				
				
				let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
				html += `<strong style="font-size: 20px;">Missing Cards from ${setName}</strong><br />`;
				html += `<div style="font-size: 0.9em; margin-bottom: 5px;">For: ${targetUserName}</div>`;
				html += `<div style="font-size: 0.9em; margin-bottom: 10px;">Missing ${totalMatches} of ${allSetCardsCount} cards.</div>`;

				if (paginatedResults.length === 0) {
					html += `No results found for this page.`;
				}
				for (let i = 0; i < paginatedResults.length; i++) {
					const card = paginatedResults[i];
					if (i % 4 === 0) {
						if (i > 0) html += `</div><hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
						html += `<div style="display: inline-block; text-align: center;">`; 
					}
					const imageWidth = 74;
					const imageHeight = 103;
					const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
					const imageAlt = `${card.name} (${card.cardId})`;
					html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top;">`;
					html += `<button name="send" value="/tcg card ${card.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
					html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
					html += `</button>`;
					html += `<div style="font-size: 0.85em; margin-top: 3px;">${card.name}</div>`;
					html += `<div style="font-size: 0.75em;">[ ${card.cardId} ]<br>${card.rarity}</div>`;
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

			} catch (error) {
				
				return this.errorReply('An error occurred while fetching missing cards.');
			}
		},

		async packs(target, room, user) {
			if (!this.runBroadcast()) return;
			
			const collection = userPacksCollection;
			const userPacks = await collection.find({ userId: user.id, quantity: { $gt: 0 } }, { sort: { setName: 1 } });

			if (userPacks.length === 0) {
				return this.errorReply("You do not have any saved packs. You can buy them from the /tcg shop.");
			}

			let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
			html += `<strong style="font-size: 20px;">${user.name}'s Saved Packs</strong><br />`;
			html += `<div style="font-size: 0.9em; margin-bottom: 15px;">Click a pack to open one.</div>`;
			
			for (let i = 0; i < userPacks.length; i++) {
				const pack = userPacks[i];
				
				if (i % 3 === 0) {
					if (i > 0) html += `</div><hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
					html += `<div style="display: inline-block; text-align: center;">`; 
				}

				const logoUrl = pack.setLogo || `https://via.placeholder.com/80x30?text=${pack.setId}`;
				
				html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top; width: 120px;">`;

				html += `<button name="send" value="/tcg opensavedpack ${pack.setId}" style="background: none; border: 1px solid #ccc; border-radius: 8px; padding: 10px; width: 100%; text-align: center; cursor: pointer; min-height: 90px;">`;
				html += `<img src="${logoUrl}" height="30" alt="${pack.setName} Logo" title="${pack.setName} Logo" style="max-width: 100px; display: block; margin: 0 auto 5px auto;" />`;
				html += `<strong style="font-size: 0.9em; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${pack.setName}</strong>`;
				html += `<span style="font-size: 0.8em;">[ ${pack.setId} ]<br>Quantity: ${pack.quantity}</span>`;
				html += `</button>`;
				

				if (pack.quantity > 1) {
					html += `<button name="send" value="/tcg openallpacks ${pack.setId}" style="background: none; border: 1px solid #aaa; border-radius: 4px; padding: 2px 5px; width: 100%; text-align: center; cursor: pointer; font-size: 0.75em; margin-top: 3px;">`;
					html += `Open All ${pack.quantity}`;
					html += `</button>`;
				}

				html += `</div>`;
			}
			
			if (userPacks.length > 0) html += `</div>`;

			html += `</div>`;
			this.sendReply(`|html|${html}`);
		},
		
		async opensavedpack(target, room, user) {
			if (!this.runBroadcast()) return;
			const setId = target.trim();
			if (!setId) {
				this.errorReply(`Specify a pack ID to open. Use /tcg packs to see your packs.`);
			}

			const packCollection = userPacksCollection;
			

			const updateResult = await packCollection.updateOne(
				{ userId: user.id, setId: setId, quantity: { $gt: 0 } },
				{ $inc: { quantity: -1 } }
			);

			if (updateResult.modifiedCount === 0) {
				return this.errorReply(`You do not have any saved "${setId}" packs to open. Use /tcg packs to see your inventory.`);
			}

			try {

				const pack = await generatePack(setId);
				

				const { creditsAwarded } = await addCardsToCollection(user, pack);

				let setName = setId;
				const setInfo = getSet(setId);
				if (setInfo) {
					setName = setInfo.set;
				}

				const title = `${user.name} opened a ${setName} pack!`;
				const subtitle = creditsAwarded > 0 ? `+${creditsAwarded} Credits from duplicates!<br>` : undefined;
				const html = renderCardGridHtml(pack, title, subtitle);

				this.sendReply(`|html|${html}`);
				
			} catch (error) {
				

				await packCollection.updateOne(
					{ userId: user.id, setId: setId },
					{ $inc: { quantity: 1 } }
				);
				return this.errorReply(`An error occurred while opening your pack: ${error.message}. Your pack has been refunded.`);
			}
		},

		async openallpacks(target, room, user) {
			if (!this.runBroadcast()) return;
			const rawSetId = target.trim(); 
			if (!rawSetId) {
				this.errorReply(`Specify a pack ID to open. Use /tcg packs to see your packs.`);
			}
            
			const packCollection = userPacksCollection;

            const queryFilter = { userId: user.id, setId: rawSetId, quantity: { $gt: 0 } };
			
			let findResult: TcgUserPack | null = null; 
			try {
				findResult = await packCollection.findOneAndUpdate(
					queryFilter,
					{ $set: { quantity: 0 } }
				);
			} catch (dbError) {
				
				return this.errorReply(`A database error occurred while trying to find your packs. Please try again later.`);
			}

			if (!findResult || typeof findResult.quantity !== 'number' || findResult.quantity === 0) {
				
				try {
					const zeroCheck = await packCollection.findOne({ userId: user.id, setId: rawSetId });
					
					if (zeroCheck && zeroCheck.quantity === 0) {
						 
						 return this.errorReply(`You just opened all "${rawSetId}" packs, or another request is in progress.`);
					} else if (zeroCheck && zeroCheck.quantity > 0) {
						 
					} else {
                         const similarPacks = await packCollection.find({ userId: user.id, setId: new RegExp(`^${rawSetId}$`, 'i') });
                         if (similarPacks.length > 0) {
                            
                         }
                    }
				} catch (checkError) {
					
				}

				return this.errorReply(`You do not have any saved "${rawSetId}" packs to open, or there was an issue accessing them.`); 
			}

            const packQuantity = findResult.quantity; 
            
            
            const setName = findResult.setName || rawSetId; 

			try {
                const allPacks: TcgCard[] = [];
                const quantityToOpen = Math.min(packQuantity, 100); 
                

                if (packQuantity > 100) {
                    this.sendReply(`Opening 100 packs of ${setName}. You have ${packQuantity - 100} remaining.`);
                    await packCollection.updateOne(
                        { userId: user.id, setId: rawSetId }, 
                        { $inc: { quantity: packQuantity - 100 } } 
                    );
                }

                for (let i = 0; i < quantityToOpen; i++) {
                    const pack = await generatePack(rawSetId); 
                    allPacks.push(...pack);
					 }
                
				const { creditsAwarded } = await addCardsToCollection(user, allPacks);
                

				let html = `<div class="infobox" style="padding: 15px; text-align: center;">`;
				html += `<strong style="font-size: 20px;">${user.name} opened ${quantityToOpen} ${setName} packs!</strong>`;
				html += `<br /><br />`;
                html += `You found a total of <strong>${allPacks.length}</strong> cards.`;
				
				if (creditsAwarded > 0) {
					html += `<br /><div style="font-size: 1.1em; color: green; margin-top: 5px;">+${creditsAwarded} Credits from duplicates!</div>`;
				}
                html += `<br /><br />`;

				html += `<button name="send" value="/tcg collection user:${user.id}, set:${rawSetId}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">View New Cards</button>`;

				html += `</div>`;

				this.sendReply(`|html|${html}`);
				
			} catch (error) {
				
				await packCollection.updateOne(
					{ userId: user.id, setId: rawSetId }, 
					{ $set: { quantity: packQuantity } }  
				);
				return this.errorReply(`An error occurred while opening your packs: ${error.message}. Your packs have been refunded.`);
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
				for (const card of favoriteCardsData) {
					cardDataMap.set(card.cardId, card);
				}
				orderedFavoriteCards = favoriteCardIds
					.map(id => cardDataMap.get(id))
					.filter((card): card is Partial<TcgCard> => !!card);
			}

			const { setsCached } = getCacheStats();
			const totalSetsInGame = Math.max(1, setsCached);
			const setsCompleted = profile.totalSetsCompleted || 0;
			const setCompletionPercent = (setsCompleted / totalSetsInGame) * 100;

			const imageWidth = 160;
			const imageHeight = 222;

			let html = `<div class="infobox" style="display: flex; align-items: stretch; padding: 15px; min-height: ${imageHeight + 30}px;">`;
			
			html += `<div style="flex: 0 0 ${imageWidth + 20}px; padding-right: 20px; border-right: 1px solid #ccc; overflow-y: hidden; text-align: center;">`;
			html += `<div style="overflow-x: scroll; overflow-y: hidden; white-space: nowrap; max-width: ${imageWidth + 20}px;">`;

			if (orderedFavoriteCards.length > 0) {
				for (const card of orderedFavoriteCards) {
					const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
					const imageAlt = `${card.name} (${card.cardId})`;
					html += `<div style="display: inline-block; margin-right: 10px; width: ${imageWidth}px; vertical-align: top;">`;
					html += `<button name="send" value="/tcg card ${card.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
					html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
					html += `</button>`;
					html += `<div style="font-size: 0.85em; margin-top: 3px; white-space: pre-wrap;">${card.name}</div>`;
					html += `<div style="font-size: 0.75em; white-space: pre-wrap;">[ ${card.cardId} ]<br>${card.rarity}</div>`;
					html += `</div>`;
				}
			} else {
				html += `<div style="color: #888; text-align: center; padding-top: 50px; font-size: 0.9em; white-space: pre-wrap; width: ${imageWidth}px;">`;
				html += `No favorite cards set.<br /><br />Use<br />/tcg favorite [cardId]`;
				html += `</div>`;
			}
			html += `</div></div>`;

			html += `<div style="flex: 1; line-height: 1.7; margin-left: 20px; max-height: ${imageHeight + 30}px; overflow-y: auto;">`;
			html += `<strong style="font-size: 22px;">${profile.userName}</strong><br />`;
			html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
			html += `<strong>Collection Points:</strong> ${profile.collectionPoints.toLocaleString()}<br />`;
			html += `<strong>Total Cards:</strong> ${profile.totalQuantity.toLocaleString()}<br />`;
			html += `<strong>Unique Cards:</strong> ${profile.totalUniqueCards.toLocaleString()}<br />`;
			html += `<strong>Credits:</strong> ${profile.credits.toLocaleString()}<br />`;
			html += `<strong>Sets Completed:</strong> ${setsCompleted} / ${totalSetsInGame} (${setCompletionPercent.toFixed(1)}%)<br />`;
			html += `<strong>Last Active:</strong> ${new Date(profile.lastUpdatedAt).toLocaleDateString()}<br />`;
			html += `</div>`;
			html += `</div>`;
			html += `</div>`;

			this.sendReply(`|html|${html}`);
		},

		async favorite(target, room, user) {
			const cardId = target.trim();
			if (!cardId) return this.parse('/tcg help');

			const profiles = userProfilesCollection;
			const collections = userCollectionsCollection;

			try {
				const userCard = await collections.findOne({ userId: user.id, cardId: cardId });
				if (!userCard) {
					return this.errorReply(`You do not own this card. You can only favorite cards from your collection.`);
				}

				const profile = await profiles.findOne({ userId: user.id });
				const currentFavorites = profile?.favoriteCards || [];

				if (currentFavorites.includes(cardId)) {
					return this.errorReply(`"${userCard.name}" is already in your favorites.`);
				}

				if (currentFavorites.length >= MAX_FAVORITE_CARDS) {
					return this.errorReply(`You already have ${MAX_FAVORITE_CARDS} favorite cards. Use /tcg unfavorite [cardId] to remove one first.`);
				}

				const result = await profiles.updateOne(
					{ userId: user.id },
					{ $addToSet: { favoriteCards: cardId } }
				);

				if (result.modifiedCount > 0) {
					this.sendReply(`Added "${userCard.name}" to your profile favorites.`);
				} else {
					this.errorReply(`"${userCard.name}" is already in your favorites.`);
				}

			} catch (error) {
				
				return this.errorReply('An error occurred while adding your favorite card.');
			}
		},

		async unfavorite(target, room, user) {
			const targetId = target.trim().toLowerCase();
			if (!targetId) return this.parse('/tcg help');

			const profiles = userProfilesCollection;

			try {
				let result;
				if (targetId === 'all') {

					result = await profiles.updateOne(
						{ userId: user.id },
						{ $set: { favoriteCards: [] } }
					);

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
					result = await profiles.updateOne(
						{ userId: user.id },
						{ $pull: { favoriteCards: cardId } }
					);

					if (result.modifiedCount > 0) {
						this.sendReply(`Removed card "${cardId}" from your profile favorites.`);
					} else {
						this.errorReply(`Card "${cardId}" was not in your favorites list.`);
					}
				}
			} catch (error) {
				
				const action = targetId === 'all' ? 'removing all your favorite cards' : 'removing your favorite card';
				return this.errorReply(`An error occurred while ${action}.`);
			}
		},

		async leaderboard(target, room, user) {
			if (!this.runBroadcast()) return;

			let targetStat = toID(target) || 'points';
			let sortKey: keyof TcgUserProfile = 'collectionPoints';
			let title = 'Collection Points';
			let valueField: keyof TcgUserProfile = 'collectionPoints';

			switch (targetStat) {
				case 'points':
					sortKey = 'collectionPoints';
					title = 'Collection Points';
					valueField = 'collectionPoints';
					break;
				case 'count':
				case 'quantity':
					sortKey = 'totalQuantity';
					title = 'Total Cards';
					valueField = 'totalQuantity';
					break;
				case 'unique':
					sortKey = 'totalUniqueCards';
					title = 'Unique Cards';
					valueField = 'totalUniqueCards';
					break;
				case 'credits':
					sortKey = 'credits';
					title = 'Total Credits';
					valueField = 'credits';
					break;
				case 'sets':
					sortKey = 'totalSetsCompleted';
					title = 'Sets Completed';
					valueField = 'totalSetsCompleted';
					break;
				default:
					return this.errorReply("Invalid leaderboard type. Try 'points', 'count', 'unique', 'credits', or 'sets'.");
			}

			try {
				const collection = userProfilesCollection;
				const results = await collection.find(
					{},
					{
						sort: { [sortKey]: -1 },
						limit: 10,
					}
				);

				if (results.length === 0) {
					return this.errorReply("No users found in the leaderboard yet.");
				}
				
				const headerRow = ['Rank', 'User', title];
				const dataRows = results.map((profile, i) => {
					const value = profile[valueField] as number || 0;
					return [
						`<strong>${i + 1}</strong>`,
						profile.userName,
						value.toLocaleString()
					];
				});

				let html = `<div class="style="padding: 10px;">`;
				html += generateThemedTable(`TCG Leaderboard - ${title}`, headerRow, dataRows);

				this.sendReply(`|html|${html}`);

			} catch (error) {
				
				return this.errorReply('An error occurred while fetching the leaderboard.');
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

				const setTotalsPipeline = [
					{
						$group: {
							_id: "$setId",
							setTotal: { $first: "$setTotal" }
						}
					},
					{
						$project: {
							_id: 0,
							setId: "$_id",
							setTotal: { $ifNull: ["$setTotal", 0] }
						}
					}
				];
				const allSets = await cardCollection.aggregate<{ setId: string, setTotal: number }>(setTotalsPipeline);
				
				if (allSets.length === 0) {
					return this.errorReply("Failed to fetch set totals. Aborting.");
				}

				const userProgressPipeline = [
					{ $match: { userId: targetUserId } },
					{
						$group: {
							_id: "$setId",
							uniqueCount: { $sum: 1 }
						}
					}
				];
				const userSetCounts = await userCollection.aggregate<{ _id: string, uniqueCount: number }>(userProgressPipeline);

				const userProgressMap = new Map<string, number>();
				for (const set of userSetCounts) {
					userProgressMap.set(set._id, set.uniqueCount);
				}

				let setsCompleted = 0;
				for (const set of allSets) {
					if (set.setTotal > 0) {
						const userCount = userProgressMap.get(set.setId) || 0;
						if (userCount >= set.setTotal) {
							setsCompleted++;
						}
					}
				}

				const allStatsPipeline = [
					{ $match: { userId: targetUserId } },
					{
						$group: {
							_id: null,
							totalUniqueCards: { $sum: 1 },
							totalQuantity: { $sum: "$quantity" },
							collectionPoints: { $sum: { $multiply: ["$totalPoints", "$quantity"] } }
						}
					}
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
							userName: userName,
							credits: currentCredits,
							totalUniqueCards: stats.totalUniqueCards,
							totalQuantity: stats.totalQuantity,
							collectionPoints: stats.collectionPoints,
							totalSetsCompleted: setsCompleted,
							favoriteCards: currentFavorites,
							lastUpdatedAt: new Date().toISOString()
						}
					},
					{ upsert: true }
				);
				
				this.sendReply(`✅ Recalculation complete for ${targetUserId}:`);
				this.sendReply(`- Sets Completed: ${setsCompleted} / ${allSets.length}`);
				this.sendReply(`- Total Points: ${stats.collectionPoints.toLocaleString()}`);
				this.sendReply(`- Unique Cards: ${stats.totalUniqueCards.toLocaleString()}`);

			} catch (error) {
				
				return this.errorReply(`An error occurred during recalculation: ${error.message}`);
			}
		},

		'': 'help',
		help() {
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				`<div style="max-height: 360px; overflow-y: auto;">` +
				`<strong>TCG Commands:</strong><br />` +
				`<code>/tcg card [cardId]</code> - Display Pokemon TCG card information<br />` +
				`<code>/tcg openpack [setId]</code> - Open a 10-card booster pack from the specified set<br />` +
				`<code>/tcg set [setId]</code> - Display information about a specific TCG set<br />` +
				`<code>/tcg search [query], [page]</code> - Search for cards. Use filters like Example: D<code>type:Fire</code>, <code>hp:&gt;100</code>, <code>rarity:Secret</code>, <code>artist:"Arita"</code>, <code>set:sv1</code>, <code>legal:standard</code>, <code>reg:G</code>.<br />` +
				`<strong>Example:</strong> Example: <code>/tcg search Charizard type:Fire hp:&gt;200, 1</code><br />` +
				`<strong>Collection Commands:</strong><br />` +
				`<code>/tcg profile [user]</code> - View a user's TCG profile and collection stats.<br />` +
				`<code>/tcg daily</code> - Claim your free daily booster pack (once per 24h).<br />` +
				`<code>/tcg collection [user:], [filters:], [page]</code> - View your (or another user's) card collection.<br />` +
				`<strong>Example:</strong> <code>/tcg collection user:princeskygit, rarity:Secret</code><br />` +
				`<code>/tcg setprogress [setId]</code> - Track your collection progress for a specific set.<br />` +
				`<code>/tcg missing [setId], [user?], [page?]</code> - Shows cards you are missing from a set.<br />` +
				`<code>/tcg packs</code> - View your unopened booster packs.<br />` +
				`<code>/tcg opensavedpack [setId]</code> - Open one pack from your inventory.<br />` +
				`<code>/tcg openallpacks [setId]</code> - Open all packs of a specific set from your inventory.<br />` +
				`<code>/tcg shop</code> - View the daily rotating pack shop.<br />` +
				`<code>/tcg buy [setId]</code> - Buy a pack from the shop.<br />` +
				`<code>/tcg sell [cardId], [quantity]</code> - Sell a card from your collection for credits.<br />` +
				`<strong>Example:</strong> <code>/tcg sell sv1-1, 3</code><br />` +
				`<code>/tcg sellduplicates [all | setId]</code> - Sell all duplicate cards (quantity > 1) for credits.<br />` +
				`<strong>Example:</strong> <code>/tcg sellduplicates sv1</code><br />` +
				`<code>/tcg giftcard [user], [cardId], [quantity]</code> - Gift a card from your collection to another user.<br />` +
				`<strong>Example:</strong> <code>/tcg giftcard princeskygit, sv1-1, 1</code><br />` +
				`<code>/tcg giftpack [user], [setId], [quantity]</code> - Gift one or more saved packs to another user.<br />` +
				`<strong>Example:</strong> <code>/tcg giftpack princeskygit, sv1, 2</code><br />` +
				`<code>/tcg giftcredits [user], [amount]</code> - Gift credits to another user.<br />` +
				`<strong>Example:</strong> <code>/tcg giftcredits princeskygit, 100</code><br />` +
				`<code>/tcg favorite [cardId]</code> - Add a card from your collection to your profile (max 10).<br />` +
				`<code>/tcg unfavorite [cardId]</code> - Remove a card from your profile favorites.<br />` +
				`<code>/tcg leaderboard [points | count | unique | credits | sets]</code> - View the top collectors.<br />` +
				`<code>/tcg recalculatestats [user]</code> - Recalculate your stats. Admins can specify a user.<br />` +
				`<strong>Admin Commands:</strong><br />` +
				`<code>/tcg awardcredits [user], [amount]</code> - (Admin) Grant credits to a user.<br />` +
				`<code>/tcg awardpack [user], [setId], [quantity]</code> - (Admin) Grant pack(s) to a user.<br />` +
				`<code>/tcg awardcard [user], [cardId], [quantity]</code> - (Admin) Grant card(s) to a user.<br />` +
				`<code>/tcg wipecollection [user]</code> - (Admin) Reset a user's entire TCG collection and profile.<br />` +
				`<code>/tcg refreshshop</code> - (Admin) Force the daily TCG shop to load new packs.<br />` +
				`<code>/tcg resetdaily [user | all]</code> - (Admin) Reset the daily pack cooldown for a user or all users.<br />` +
				`<code>/tcg loadcache</code> - (Admin) Reloads the TCG card and set data into memory.<br />` +
				`<code>/tcg cachestats</code> - (Admin) Shows statistics about the in-memory cache.<br />` +
				`<code>/tcg clearcache</code> - (Admin) Clears all TCG data from the in-memory cache.<br />` +
				`<code>/tcg recalculateallstats</code> - (Admin) Recalculates stats for ALL users. <br />` +
				`<code>/tcg createindexes</code> - (Admin) Creates all important mongodb indexes for fast querying.` +
				`</div>`
			);
		},

		...adminCommands,
		...economyCommands,
	},
};
