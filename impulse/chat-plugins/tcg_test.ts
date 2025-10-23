/**
 * Pokemon TCG Chat Plugin for Pokemon Showdown
 * Displays Pokemon TCG card information
 */

import { ImpulseDB } from '../impulse-db';

interface TCGCard {
	cardId: string;
	name: string;
	setId: string;
	set: string;
	rarity: string;
	supertype: string;
	subtypes: string[];
	totalPoints: number;
	imageUrl?: string;
}

export const commands: ChatCommands = {
	tcg: 'pokemontcg',
	pokemontcg: {
		async card(target, room, user) {
			if (!target) return this.parse('/help tcg card');

			const cardId = target.trim();

			try {
				const collection = ImpulseDB<TCGCard>('tcg_cards');
				const card = await collection.findOne({ cardId });

				if (!card) {
					return this.errorReply(`Card with ID "${cardId}" not found.`);
				}

				// Calculate 60% of original dimensions
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
				html += `<div style="flex: 1; line-height: 1.6; margin-left: 20px;">`;
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
				html += `<div style="margin-top: 12px;">`;
				html += `<strong style="font-size: 1.1em; font-weight: bold;">Points:</strong> ${card.totalPoints}`;
				html += `</div>`;
				html += `</div>`; // End Details section
				html += `</div>`; // End Text Info Section

				html += `</div>`; // End Infobox

				this.sendReplyBox(html);
			} catch (error) {
				Monitor.crashlog(error, 'TCG card command');
				return this.errorReply('An error occurred while fetching card data.');
			}
		},

		'': 'help',
		help() {
			this.sendReplyBox(
				`<strong>TCG Commands:</strong><br />` +
				`<code>/tcg card [cardId]</code> - Display Pokemon TCG card information`
			);
		},
	},
};
