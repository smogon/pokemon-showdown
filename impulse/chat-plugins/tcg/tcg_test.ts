/**
 * Pokemon TCG Chat Plugin for Pokemon Showdown
 * Displays Pokemon TCG card information
 */

import { ImpulseDB } from '../../impulse-db';
import { TcgCard } from './interface';
import { generatePack } from './utils';

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

				let html = `<div class="infobox" style="padding: 10px; text-align: center;">`;
				html += `<strong style="font-size: 20px;">Pack Opening - ${setId}</strong><br /><br />`;

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
				html += `<hr style="margin: 10px 0; border: none; border-top: 1px solid #ccc;">`;

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
				html += `<hr style="margin: 10px 0; border: none; border-top: 1px solid #ccc;">`;

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

		'': 'help',
		help() {
			this.sendReplyBox(
				`<strong>TCG Commands:</strong><br />` +
				`<code>/tcg card [cardId]</code> - Display Pokemon TCG card information<br />` +
				`<code>/tcg openpack [setId]</code> - Open a 10-card booster pack from the specified set`
			);
		},
	},
};
