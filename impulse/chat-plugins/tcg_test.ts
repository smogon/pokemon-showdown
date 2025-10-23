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

// Helper function to get background color based on rarity
function getRarityColor(rarity: string): string {
	// Using rgba for semi-transparency - adjust colors/opacity as needed
	switch (rarity?.toLowerCase()) {
		// Standard rarities
		case 'common':
			return 'rgba(150, 150, 150, 0.1)'; // Light grey
		case 'uncommon':
			return 'rgba(100, 180, 100, 0.15)'; // Light green
		case 'rare':
			return 'rgba(90, 150, 200, 0.15)'; // Light blue

		// Holo/Reverse Holo
		case 'rare holo':
		case 'rare holo ex':
		case 'rare holo gx':
		case 'rare holo v':
		case 'rare holo vmax':
		case 'rare holo vstar':
		case 'rare holo lv.x':
		case 'reverse holo':
			return 'rgba(210, 180, 90, 0.2)'; // Light gold/yellow shimmer

		// Ultra/Secret Rares
		case 'rare ultra':
		case 'ultra rare':
		case 'rare secret':
		case 'secret rare':
		case 'hyper rare':
		case 'rare rainbow':
		case 'shiny ultra rare':
			return 'rgba(180, 110, 220, 0.2)'; // Light purple/magenta shimmer

		// Special Rarities
		case 'promo':
		case 'black star promo':
			return 'rgba(220, 100, 100, 0.15)'; // Light red/promo color
		case 'amazing rare':
			return 'rgba(255, 105, 180, 0.2)'; // Hot pink / amazing rare color
		case 'illustration rare':
		case 'special illustration rare':
			return 'rgba(135, 206, 235, 0.2)'; // Sky blue / art rare color
		case 'radiant rare':
			return 'rgba(255, 215, 0, 0.25)'; // Gold / radiant color
			
		// Add more cases as needed for specific rarities...
		
		default:
			return 'rgba(200, 200, 200, 0.05)'; // Default subtle grey
	}
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
				const rarityColor = getRarityColor(card.rarity); // Get the background color

				// Main container
				let html = `<div class="infobox" style="display: flex; align-items: center; padding: 15px;">`;

				// Image Section - Border #ccc
				html += `<div style="flex-shrink: 0; padding-right: 20px; border-right: 1px solid #ccc;">`;
				html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
				html += `</div>`;

				// Text Info Section - Added background-color and padding
				html += `<div style="flex: 1; line-height: 1.6; margin-left: 20px; background-color: ${rarityColor}; padding: 10px; border-radius: 5px;">`;
				// Name/ID Line
				html += `<strong style="font-size: 20px;">${card.name}</strong> `;
				html += `<span style="color: #777; font-size: 0.9em; margin-left: 5px;">(${card.cardId})</span><br />`;
				// Details section
				html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
				html += `<strong style="font-size: 0.9em;">Set:</strong> ${card.set} <span style="color: #777; font-size: 0.9em;">(${card.setId})</span><br />`;
				html += `<strong style="font-size: 0.9em;">Rarity:</strong> ${card.rarity}<br />`;
				html += `<strong style="font-size: 0.9em;">Supertype:</strong> ${card.supertype}<br />`;
				if (card.supertype === 'Pokémon' || card.supertype === 'Trainer') {
					html += `<strong style="font-size: 0.9em;">Subtypes:</strong> ${subtypes}<br />`;
				}
				// Points section
				html += `<div style="margin-top: 10px;">`;
				html += `<strong style="color: #007bff; font-size: 1.1em; font-weight: bold;">Points:</strong> ${card.totalPoints}`;
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
