/**
 * Pokemon TCG Chat Plugin for Pokemon Showdown
 * Displays Pokemon TCG card information using CSS classes
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

// Helper function to get the CSS class name based on rarity
function getRarityClass(rarity: string): string {
	const lowerRarity = rarity?.toLowerCase() || 'common';

	if (lowerRarity.includes('common') || lowerRarity.includes('1st edition') || lowerRarity.includes('shadowless') || lowerRarity.includes('double rare')) {
		return 'tcg-rarity-common';
	}
	if (lowerRarity.includes('uncommon') || lowerRarity.includes('reverse holo')) {
		return 'tcg-rarity-uncommon';
	}
	if (lowerRarity === 'rare') {
		return 'tcg-rarity-rare';
	}
	if (lowerRarity.includes('rare holo') || lowerRarity.includes('promo') || lowerRarity.includes('classic collection')) {
		if (!lowerRarity.includes('star') && !lowerRarity.includes(' ex') && !lowerRarity.includes(' gx') && !lowerRarity.includes(' v') && !lowerRarity.includes(' lv.x')) {
			return 'tcg-rarity-holo-promo';
		}
	}
	if (lowerRarity.includes('rare prime') || lowerRarity.includes('legend') || lowerRarity.includes('rare break') || lowerRarity.includes('prism star') || lowerRarity.includes('ace spec') || lowerRarity.includes('rare ace') || lowerRarity.includes('rare sp')) {
		return 'tcg-rarity-special-mech';
	}
	if (lowerRarity.includes('rare holo ex') || lowerRarity.includes('rare holo gx') || lowerRarity.includes('rare holo v') || lowerRarity.includes('rare holo vmax') || lowerRarity.includes('rare holo vstar') || lowerRarity.includes('rare ex') || lowerRarity.includes('rare holo lv.x')) {
		return 'tcg-rarity-rulebox';
	}
	if (lowerRarity.includes('shining') || lowerRarity.includes('radiant rare') || lowerRarity.includes('amazing rare') || lowerRarity.includes('trainer gallery') || lowerRarity.includes('character rare')) {
		return 'tcg-rarity-special-shiny';
	}
	if (lowerRarity.includes('full art') || lowerRarity.includes('rare ultra') || lowerRarity.includes('ultra rare') || lowerRarity.includes('rare shiny') || lowerRarity.includes('shiny rare')) {
		return 'tcg-rarity-fullart-shiny';
	}
	if (lowerRarity.includes('rare shiny gx') || lowerRarity.includes('shiny ultra rare') || lowerRarity.includes('character super rare')) {
		return 'tcg-rarity-high-shiny';
	}
	if (lowerRarity.includes('rare secret') || lowerRarity.includes('secret rare') || lowerRarity.includes('rare holo star') || lowerRarity.includes('gold star') || lowerRarity === 'star') {
	    if (!lowerRarity.includes('rainbow') && !lowerRarity.includes('gold')) {
 			return 'tcg-rarity-secret';
 		}
	}
	if (lowerRarity.includes('illustration rare')) {
		return 'tcg-rarity-illustration';
	}
	if (lowerRarity.includes('hyper rare') || lowerRarity.includes('rare rainbow')) {
		return 'tcg-rarity-rainbow';
	}
	if (lowerRarity.includes('gold full art') || lowerRarity.includes('rare gold')) {
		return 'tcg-rarity-gold';
	}

	return 'tcg-rarity-default'; // Fallback class
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

				const originalWidth = 246;
				const originalHeight = 342;
				const scaleFactor = 0.60;
				const imageWidth = Math.round(originalWidth * scaleFactor);
				const imageHeight = Math.round(originalHeight * scaleFactor);

				const imageUrl = card.imageUrl || `https://via.placeholder.com/${imageWidth}x${imageHeight}?text=No+Image`;
				const subtypes = card.subtypes?.length > 0 ? card.subtypes.join(' | ') : 'N/A';
				const imageAlt = `${card.name} (${card.cardId})`;
				const rarityClass = getRarityClass(card.rarity); // Get the CSS class

				// Apply base class and rarity class to the main div
				let html = `<div class="infobox tcg-card-container ${rarityClass}">`;

				// Image Section
				html += `<div class="tcg-card-image-container">`;
				html += `<img class="tcg-card-image" src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" />`;
				html += `</div>`;

				// Text Info Section
				html += `<div class="tcg-card-info">`;
				// Name/ID Line
				html += `<span class="tcg-card-name">${card.name}</span>`;
				html += `<span class="tcg-card-id">(${card.cardId})</span><br />`;
				// Details section
				html += `<div class="tcg-card-details">`;
				html += `<span class="tcg-card-label">Set:</span> ${card.set} <span class="tcg-card-set-id">(${card.setId})</span><br />`;
				html += `<span class="tcg-card-label">Rarity:</span> ${card.rarity}<br />`;
				html += `<span class="tcg-card-label">Supertype:</span> ${card.supertype}<br />`;
				if (card.supertype === 'Pokémon' || card.supertype === 'Trainer') {
					html += `<span class="tcg-card-label">Subtypes:</span> ${subtypes}<br />`;
				}
				// Points section
				html += `<div class="tcg-card-points">`;
				html += `<span class="tcg-card-points-label">Points:</span> <span class="tcg-card-points-value">${card.totalPoints}</span>`;
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
