/**
 * Pokemon TCG Chat Plugin for Pokemon Showdown
 * Displays Pokemon TCG card information
 */

import { ImpulseDB } from '../../impulse-db';
import { TcgCard } from './interface';
import { generatePack } from './utils';
import { 
	getCard, 
	getSet, 
	initializeCache,
	getCacheStats,
	clearCache,
} from './tcg-cache'; // Import cache functions

const SEARCH_PAGE_LIMIT = 52; // Number of cards per page (13 rows * 4 cards)

/**
 * Helper function to parse the complex search query
 * (This function is unchanged)
 */
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

	// 1. Extract Page
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
	
	// Regex to find key:value or key:>value etc.
	// Allows quoted values: artist:"Some Name"
	const filterRegex = /(\w+)\s*:\s*([<=>]{1,2})?("[^"]+"|[\w-]+)/g;
	
	let nameQuery = query;
	let match;

	while ((match = filterRegex.exec(query)) !== null) {
		const key = match[1].toLowerCase();
		const operator = match[2]; // e.g., >, <=, or undefined
		let value = match[3].replace(/"/g, ''); // Remove quotes

		// Remove this match from the nameQuery string
		nameQuery = nameQuery.replace(match[0], '');

		const valueNum = parseInt(value);
		// Escape regex characters from user input
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
					else hpFilter = valueNum; // Exact match
					
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
				// Match partially on set name (e.g., "Sword & Shield")
				const partialRegex = new RegExp(escapedValue, 'i');
				// Match exactly on setId (e.g., "swsh1")
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

	// 3. Add remaining text as name query
	const nameQueryClean = nameQuery.trim();
	if (nameQueryClean) {
		const nameRegex = new RegExp(nameQueryClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
		filter.$and.push({ name: nameRegex });
		descriptions.unshift(`'${nameQueryClean}'`); // Add to the front
	}

	// 4. Finalize
	if (filter.$and.length === 0) {
		// No filters provided, search everything
		delete filter.$and;
	}
	
	const queryDescription = descriptions.length > 0 ? descriptions.join(', ') : 'All Cards';

	return { filter, queryDescription, page, commandString };
}

export const commands: ChatCommands = {
	tcg: 'pokemontcg',
	pokemontcg: {
		async card(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) return this.parse('/help tcg card');

			const cardId = target.trim();
			
			// --- MODIFICATION: Add fallback logic ---
			let card: TcgCard | null = null;
			const cacheInitialized = getCacheStats().isInitialized;

			if (cacheInitialized) {
				card = getCard(cardId) || null;
			}
			
			// Fallback to DB if cache is off OR card not found in cache
			// (A populated cache should be complete, but this adds robustness)
			if (!card) {
				const collection = ImpulseDB<TcgCard>('tcg_cards');
				card = await collection.findOne({ cardId });
			}
			// --- END MODIFICATION ---

			if (!card) {
				// Added cache status to error for debugging
				return this.errorReply(`Card with ID "${cardId}" not found. (Cache: ${cacheInitialized ? 'On' : 'Off'})`);
			}

			// Calculate 65% of original dimensions
			const originalWidth = 246;
			const originalHeight = 342;
			const scaleFactor = 0.65;
			const imageWidth = Math.round(originalWidth * scaleFactor);
			const imageHeight = Math.round(originalHeight * scaleFactor);

			const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
			const subtypes = card.subtypes?.length > 0 ? card.subtypes.join(' | ') : 'N/A';
			const imageAlt = `${card.name} (${card.cardId})`;

			// HTML building (unchanged)
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
			if (card.supertype === 'Pokémon' || card.supertype === 'Trainer') {
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
			if (!target) return this.parse('/help tcg openpack');

			const setId = target.trim();

			try {
				// --- MODIFICATION ---
				// This function now automatically handles cache/DB logic.
				const pack = await generatePack(setId);
				// --- END MODIFICATION ---

				let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
				html += `<strong style="font-size: 20px;">${user.name} opened - ${setId} pack.</strong><br /><br />`;

				// HTML building (unchanged)
				html += `<div style="display: inline-block; text-align: center;">`;
				for (let i = 0; i < 4; i++) {
					const card = pack[i];
					const imageWidth = 74;
					const imageHeight = 103;
					const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
					const imageAlt = `${card.name} (${card.cardId})`;
					html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top;">`;
					html += `<button name="send" value="/tcg card ${card.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
					html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
					html += `</button>`;
					html += `<div style="font-size: 0.75em; margin-top: 3px;">${card.name}</div>`;
					html += `<div style="font-size: 0.65em; color: #666;">${card.rarity}</div>`;
					html += `</div>`;
				}
				html += `</div>`;
				html += `<hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
				html += `<div style="display: inline-block; text-align: center;">`;
				for (let i = 4; i < 8; i++) {
					const card = pack[i];
					const imageWidth = 74;
					const imageHeight = 103;
					const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
					const imageAlt = `${card.name} (${card.cardId})`;
					html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top;">`;
					html += `<button name="send" value="/tcg card ${card.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
					html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
					html += `</button>`;
					html += `<div style="font-size: 0.75em; margin-top: 3px;">${card.name}</div>`;
					html += `<div style="font-size: 0.65em; color: #666;">${card.rarity}</div>`;
					html += `</div>`;
				}
				html += `</div>`;
				html += `<hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
				html += `<div style="display: inline-block; text-align: center;">`;
				for (let i = 8; i < 10; i++) {
					const card = pack[i];
					const imageWidth = 74;
					const imageHeight = 103;
					const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
					const imageAlt = `${card.name} (${card.cardId})`;
					html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top;">`;
					html += `<button name="send" value="/tcg card ${card.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
					html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
					html += `</button>`;
					html += `<div style="font-size: 0.75em; margin-top: 3px;">${card.name}</div>`;
					html += `<div style="font-size: 0.65em; color: #666;">${card.rarity}</div>`;
					html += `</div>`;
				}
				html += `</div>`;
				html += `</div></div>`;

				this.sendReply(`|html|${html}`);
			} catch (error) {
				Monitor.crashlog(error, 'TCG openpack command');
				return this.errorReply(`An error occurred while generating pack: ${error.message}`);
			}
		},

		async set(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) return this.parse('/help tcg set');

			const setId = target.trim();

			// --- MODIFICATION: Add fallback logic ---
			let card: TcgCard | null = null;
			const cacheInitialized = getCacheStats().isInitialized;

			if (cacheInitialized) {
				card = getSet(setId) || null;
			}
			
			// Fallback to DB if cache is off OR set not found in cache
			if (!card) {
				const collection = ImpulseDB<TcgCard>('tcg_cards');
				card = await collection.findOne({ setId });
			}
			// --- END MODIFICATION ---

			if (!card) {
				return this.errorReply(`Set with ID "${setId}" not found. (Cache: ${cacheInitialized ? 'On' : 'Off'})`);
			}

			// HTML building (unchanged)
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
			if (!target) return this.parse('/help tcg search');

			try {
				// --- This command *always* uses the DB ---
				// --- The cache is not designed for complex filters ---
				const { filter, queryDescription, page, commandString } = parseSearchQuery(target);
				const collection = ImpulseDB<TcgCard>('tcg_cards');

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

				// HTML Building (unchanged)
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
					html += `<div style="font-size: 0.75em; margin-top: 3px;">${card.name}</div>`;
					html += `<div style="font-size: 0.65em; color: #666;">${card.rarity}</div>`;
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
				Monitor.crashlog(error, 'TCG search command');
				return this.errorReply('An error occurred while searching for cards.');
			}
		},

		// Cache commands (unchanged)
		async loadcache(target, room, user) {
			this.checkCan('bypassall');
			this.sendReply('Initializing TCG cache... This may take a moment.');
			try {
				const { cardCount, setCount } = await initializeCache();
				this.sendReply(`TCG cache initialization complete. Loaded ${cardCount} cards and ${setCount} sets.`);
			} catch (error) {
				Monitor.crashlog(error, 'TCG cache initialization');
				this.errorReply('An error occurred while initializing the TCG cache.');
			}
		},
		cachestats(target, room, user) {
			this.checkCan('bypassall');
			const stats = getCacheStats();
			let html = `<div class="infobox" style="padding: 15px;">`;
			html += `<strong style="font-size: 1.2em;">TCG Cache Statistics</strong><br />`;
			html += `<hr style="margin: 5px 0; border: none; border-top: 1px solid #ccc;">`;
			html += `<strong>Cache Status:</strong> ${stats.isInitialized ? '<span style="color: green;">Initialized</span>' : '<span style="color: red;">Empty</span>'}<br />`;
			html += `<strong>Cards Cached:</strong> ${stats.cardsCached}<br />`;
			html += `<strong>Sets Cached (for /tcg set):</strong> ${stats.setsCached}<br />`;
			html += `<strong>Sets in Pack Cache:</strong> ${stats.packCacheSets}<br />`;
			html += `<strong>Global Fallback Cards:</strong> ${stats.globalFallbackCards}<br />`;
			html += `</div>`;
			this.sendReply(`|html|${html}`);
		},
		clearcache(target, room, user) {
			this.checkCan('bypassall');
			const { cardsCleared, setsCleared } = clearCache();
			this.sendReply(`TCG caches cleared. Removed ${cardsCleared} cards and ${setsCleared} sets.`);
		},

		'': 'help',
		help() {
			this.sendReplyBox(
				`<strong>TCG Commands:</strong><br />` +
				`<code>/tcg card [cardId]</code> - Display Pokemon TCG card information<br />` +
				`<code>/tcg openpack [setId]</code> - Open a 10-card booster pack from the specified set<br />` +
				`<code>/tcg set [setId]</code> - Display information about a specific TCG set<br />` +
				`<code>/tcg search [query], [page]</code> - Search for cards. Use filters like <code>type:Fire</code>, <code>hp:&gt;100</code>, <code>rarity:Secret</code>, <code>artist:"Arita"</code>, S<code>set:sv1</code>, <code>legal:standard</code>, <code>reg:G</code>.<br />` +
				`<strong>Example:</strong> <code>/tcg search Charizard type:Fire hp:&gt;200, 1</code><br />` +
				`<code>/tcg loadcache</code> - (Admin) Reloads the TCG card and set data into memory.<br />` +
				`<code>/tcg cachestats</code> - (Admin) Shows statistics about the in-memory cache.<br />` +
				`<code>/tcg clearcache</code> - (Admin) Clears all TCG data from the in-memory cache.`
			);
		},
	},
};
