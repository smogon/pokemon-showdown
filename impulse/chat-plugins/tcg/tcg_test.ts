/**
 * Pokemon TCG Chat Plugin for Pokemon Showdown
 * Displays Pokemon TCG card information
 */

import { ImpulseDB } from '../../impulse-db';
import { TcgCard } from './interface';
import { generatePack } from './utils';

const SEARCH_PAGE_LIMIT = 50; // Renamed from MAX_SEARCH_LIMIT

export const commands: ChatCommands = {
	tcg: 'pokemontcg',
	pokemontcg: {
		async card(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) return this.parse('/help tcg card');

			const cardId = target.trim();

			try {
				const collection = ImpulseDB<TcgCard>('tcg_cards');
				const card = await collection.findOne({ cardId });

				if (!card) {
					return this.errorReply(`Card with ID "${cardId}" not found.`);
				}

				// Calculate 65% of original dimensions
				const originalWidth = 246;
				const originalHeight = 342;
				const scaleFactor = 0.65;
				const imageWidth = Math.round(originalWidth * scaleFactor);  // Approx 148
				const imageHeight = Math.round(originalHeight * scaleFactor); // Approx 205

				const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
				const subtypes = card.subtypes?.length > 0 ? card.subtypes.join(' | ') : 'N/A';
				const imageAlt = `${card.name} (${card.cardId})`;

				// Using align-items center
				let html = `<div class="infobox" style="display: flex; align-items: center; padding: 15px;">`;
				
				// Image Section - Changed border color to #ccc
				html += `<div style="flex-shrink: 0; padding-right: 20px; border-right: 1px solid #ccc;">`;
				html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
				html += `</div>`;

				// Text Info Section - margin-left: 20px;
				html += `<div style="flex: 1; line-height: 1.6; margin-left: 20px; max-height: ${imageHeight}px; overflow-y: auto;">`;
				// Name/ID Line
				html += `<strong style="font-size: 22px;">${card.name}</strong> `;
				html += `<span style="font-size: 0.9em; margin-left: 5px;">(${card.cardId})</span><br />`;
				// Details section
				html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
				html += `<strong style="font-size: 1.1em;">Set:</strong> ${card.set} <span style="font-size: 0.9em;">(${card.setId})</span><br />`;
				html += `<strong style="font-size: 1.1em;">Rarity:</strong> ${card.rarity}<br />`;
				html += `<strong style="font-size: 1.1em;">Supertype:</strong> ${card.supertype}<br />`;
				if (card.supertype === 'Pokémon' || card.supertype === 'Trainer') {
					html += `<strong style="font-size: 1.1em;">Subtypes:</strong> ${subtypes}<br />`;
				}
				// Points section
				html += `<strong style="font-size: 1.1em; font-weight: bold;">Points:</strong> ${card.totalPoints}<br />`;
				// Flavor Text & Artist
				html += `<strong style="font-size: 1.1em; font-weight: bold;">Artist:</strong> ${card.artist}<br />`;
				html += `<strong style="font-size: 1.1em; font-weight: bold;">Dex:</strong> ${card.cardText || ''}`;
				html += `</div>`; // End Details section
				html += `</div>`; // End Text Info Section
				html += `</div>`; // End Infobox

				this.sendReply(`|html|${html}`);
			} catch (error) {
				Monitor.crashlog(error, 'TCG card command');
				return this.errorReply('An error occurred while fetching card data.');
			}
		},

		async openpack(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) return this.parse('/help tcg openpack');

			const setId = target.trim();

			try {
				const pack = await generatePack(setId);

				let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
				html += `<strong style="font-size: 20px;">${user.name} opened - ${setId} pack.</strong><br /><br />`;

				// Row 1: First 4 cards
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

				// Row 2: Next 4 cards
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

				// Row 3: Last 2 cards (rarest)
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

			try {
				const collection = ImpulseDB<TcgCard>('tcg_cards');
				// We only need one card to get the set's info
				const card = await collection.findOne({ setId });

				if (!card) {
					return this.errorReply(`Set with ID "${setId}" not found.`);
				}

				// Extract set information (data is duplicated on every card)
				const setName = card.set;
				const series = card.setSeries || 'N/A';
				const releaseDate = card.setReleaseDate || 'N/A';
				const printedTotal = card.setPrintedTotal || 'N/A';
				const total = card.setTotal || 'N/A';
				const logoUrl = card.setImages?.logo || '';
				const symbolUrl = card.setImages?.symbol || '';
				
				const logoHeight = 40; // Example height

				let html = `<div class="infobox" style="display: flex; align-items: center; padding: 15px;">`;
				
				// Logo Section
				if (logoUrl) {
					html += `<div style="flex-shrink: 0; padding-right: 20px; border-right: 1px solid #ccc; text-align: center;">`;
					html += `<img src="${logoUrl}" height="${logoHeight}" alt="${setName} Logo" title="${setName} Logo" style="display: block; max-width: 120px;" />`;
					if (symbolUrl) {
						html += `<img src="${symbolUrl}" height="20" width="20" alt="${setName} Symbol" title="${setName} Symbol" style="margin-top: 10px;" />`;
					}
					html += `</div>`;
				}

				// Text Info Section
				html += `<div style="flex: 1; line-height: 1.6; margin-left: 20px;">`;
				// Name/ID Line
				html += `<strong style="font-size: 22px;">${setName}</strong> `;
				html += `<span style="font-size: 0.9em; margin-left: 5px;">(${card.setId})</span><br />`;
				// Details section
				html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
				html += `<strong style="font-size: 1.1em;">Series:</strong> ${series}<br />`;
				html += `<strong style="font-size: 1.1em;">Released:</strong> ${releaseDate}<br />`;
				html += `<strong style="font-size: 1.1em;">Total Cards:</strong> ${total} (Printed: ${printedTotal})<br />`;
				html += `</div>`; // End Details section
				html += `</div>`; // End Text Info Section
				html += `</div>`; // End Infobox

				this.sendReply(`|html|${html}`);
			} catch (error) {
				Monitor.crashlog(error, 'TCG set command');
				return this.errorReply('An error occurred while fetching set data.');
			}
		},

		async search(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) return this.parse('/help tcg search');

			// --- Pagination and Query Parsing ---
			const parts = target.split(',');
			let page = 1;
			let query = target.trim();

			if (parts.length > 1) {
				const lastPart = parts[parts.length - 1].trim();
				const potentialPage = parseInt(lastPart);
				if (!isNaN(potentialPage)) {
					page = Math.max(1, potentialPage);
					query = parts.slice(0, -1).join(',').trim(); // Re-join the rest as the query
				}
			}
			// --- End Parsing ---

			try {
				const collection = ImpulseDB<TcgCard>('tcg_cards');
				// Use regex for case-insensitive partial matching
				const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				const searchRegex = new RegExp(escapedQuery, 'i');
				const filter = { name: searchRegex };

				// First, get the total count
				const totalMatches = await collection.countDocuments(filter);

				if (totalMatches === 0) {
					return this.errorReply(`No cards found matching "${query}".`);
				}

				const totalPages = Math.ceil(totalMatches / SEARCH_PAGE_LIMIT);
				// Ensure page is within valid range
				if (page > totalPages) page = totalPages;
				
				const skip = (page - 1) * SEARCH_PAGE_LIMIT;

				// Now, get the documents for the current page
				const results = await collection.find(
					filter,
					{
						limit: SEARCH_PAGE_LIMIT,
						skip: skip,
						projection: { name: 1, cardId: 1, rarity: 1, imageUrl: 1 },
						sort: { rarityPoints: -1, name: 1 }, // Sort by rarity (descending) then name
					}
				);

				// Build HTML using the 'openpack' UI style
				let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
				html += `<strong style="font-size: 20px;">Search results for "${query}"</strong><br />`;
				html += `<div style="font-size: 0.9em; margin-bottom: 10px;">Showing ${results.length} of ${totalMatches} matching cards.</div>`;

				// Container for all cards
				html += `<div style="display: inline-block; text-align: center;">`;

				if (results.length === 0) {
					html += `No results found for this page.`;
				}

				for (const card of results) {
					const imageWidth = 74;
					const imageHeight = 103;
					const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
					const imageAlt = `${card.name} (${card.cardId})`;

					html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top; margin-bottom: 5px;">`;
					html += `<button name="send" value="/tcg card ${card.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
					html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
					html += `</button>`;
					html += `<div style="font-size: 0.75em; margin-top: 3px;">${card.name}</div>`;
					html += `<div style="font-size: 0.65em; color: #666;">${card.rarity}</div>`;
					html += `</div>`;
				}
				
				html += `</div>`; // End card container

				// --- Pagination Footer ---
				if (totalPages > 1) {
					html += `<hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
					html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">`;

					// Previous Button
					if (page > 1) {
						html += `<button name="send" value="/tcg search ${query}, ${page - 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">&lt; Previous</button>`;
					} else {
						html += `<div></div>`; // Placeholder
					}

					// Page Info
					html += `<div style="font-size: 0.9em; color: #555;">Page ${page} of ${totalPages}</div>`;

					// Next Button
					if (page < totalPages) {
						html += `<button name="send" value="/tcg search ${query}, ${page + 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Next &gt;</button>`;
					} else {
						html += `<div></div>`; // Placeholder
					}

					html += `</div>`;
				}
				// --- End Pagination Footer ---

				html += `</div>`; // End infobox

				this.sendReply(`|html|${html}`);
			} catch (error) {
				Monitor.crashlog(error, 'TCG search command');
				return this.errorReply('An error occurred while searching for cards.');
			}
		},

		'': 'help',
		help() {
			this.sendReplyBox(
				`<strong>TCG Commands:</strong><br />` +
				`<code>/tcg card [cardId]</code> - Display Pokemon TCG card information<br />` +
				`<code>/tcg openpack [setId]</code> - Open a 10-card booster pack from the specified set<br />` +
				`<code>/tcg set [setId]</code> - Display information about a specific TCG set<br />` +
				`<code>/tcg search [name], [page]</code> - Search for a card by name (e.g., /tcg search Charizard, 2)`
			);
		},
	},
};
