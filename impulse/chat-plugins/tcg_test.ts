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

				// Larger image size, maintaining aspect ratio (approx 2.5:3.5)
				const imageWidth = 246; // Official image width
				const imageHeight = 342; // Official image height
				const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
				const subtypes = card.subtypes?.length > 0 ? card.subtypes.join(' | ') : 'N/A';
				const imageAlt = `${card.name} (${card.cardId})`;

				// Increased gap from 20px to 30px
				let html = `<div class="infobox" style="display: flex; align-items: flex-start; gap: 30px; padding: 10px;">`; 

				// Image Section
				html += `<div style="flex-shrink: 0;">`;
				html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
				html += `</div>`;

				// Text Info Section
				html += `<div style="flex: 1; line-height: 1.5;">`; 
				html += `<strong style="font-size: 20px; display: block; margin-bottom: 8px;">${card.name}</strong>`; 
				html += `<span style="color: #555; font-size: 0.9em;">(${card.cardId})</span><br />`; 
				html += `<div style="margin-top: 10px;">`; 
				html += `<strong>Set:</strong> ${card.set} <span style="color: #555; font-size: 0.9em;">(${card.setId})</span><br />`;
				html += `<strong>Rarity:</strong> ${card.rarity}<br />`;
				html += `<strong>Supertype:</strong> ${card.supertype}<br />`;
				if (card.supertype === 'Pokémon' || card.supertype === 'Trainer') { 
					html += `<strong>Subtypes:</strong> ${subtypes}<br />`;
				}
				html += `<strong style="color: #007bff;">Points:</strong> ${card.totalPoints}`; 
				html += `</div>`;
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
