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

// Helper function to get background color based on rarity (rgba values)
// Increased opacity for more vibrant colors
function getRarityColor(rarity: string): string {
	const lowerRarity = rarity?.toLowerCase() || 'common';

	// Tier 1: Common / Basic Variants
	if (lowerRarity.includes('common') || lowerRarity.includes('1st edition') || lowerRarity.includes('shadowless') || lowerRarity.includes('double rare')) {
		return 'rgba(150, 150, 150, 0.25)'; // Grey
	}
	// Tier 2: Uncommon / Reverse
	if (lowerRarity.includes('uncommon') || lowerRarity.includes('reverse holo')) {
		return 'rgba(100, 180, 100, 0.3)'; // Green
	}
	// Tier 3: Basic Rares
	if (lowerRarity === 'rare') {
		return 'rgba(90, 150, 200, 0.3)'; // Blue
	}
	// Tier 4: Standard Holos & Promos
	if (lowerRarity.includes('rare holo') || lowerRarity.includes('promo') || lowerRarity.includes('classic collection')) {
		if (!lowerRarity.includes('star') && !lowerRarity.includes(' ex') && !lowerRarity.includes(' gx') && !lowerRarity.includes(' v') && !lowerRarity.includes(' lv.x')) {
			return 'rgba(210, 180, 90, 0.35)'; // Gold/yellow
		}
	}
	// Tier 5: Special Mechanics (Prime, LEGEND, BREAK, Prism, ACE SPEC) & SP
	if (lowerRarity.includes('rare prime') || lowerRarity.includes('legend') || lowerRarity.includes('rare break') || lowerRarity.includes('prism star') || lowerRarity.includes('ace spec') || lowerRarity.includes('rare ace') || lowerRarity.includes('rare sp')) {
		return 'rgba(170, 170, 190, 0.35)'; // Metallic grey/silver
	}
	// Tier 6: Rule Box Holos (EX, GX, V, VMAX, VSTAR, ex, LV.X)
	if (lowerRarity.includes('rare holo ex') || lowerRarity.includes('rare holo gx') || lowerRarity.includes('rare holo v') || lowerRarity.includes('rare holo vmax') || lowerRarity.includes('rare holo vstar') || lowerRarity.includes('rare ex') || lowerRarity.includes('rare holo lv.x')) {
		return 'rgba(100, 200, 200, 0.35)'; // Teal/Aqua
	}
	// Tier 7: Shining, Radiant, Amazing, Character Rares
	if (lowerRarity.includes('shining') || lowerRarity.includes('radiant rare') || lowerRarity.includes('amazing rare') || lowerRarity.includes('trainer gallery') || lowerRarity.includes('character rare')) {
		return 'rgba(255, 105, 180, 0.35)'; // Pink/Magenta
	}
	// Tier 8: Full Arts / Ultra Rares / Basic Shiny
	if (lowerRarity.includes('full art') || lowerRarity.includes('rare ultra') || lowerRarity.includes('ultra rare') || lowerRarity.includes('rare shiny') || lowerRarity.includes('shiny rare')) {
		return 'rgba(135, 206, 235, 0.35)'; // Sky blue
	}
	// Tier 9: Higher Shinies & Character Super Rares
	if (lowerRarity.includes('rare shiny gx') || lowerRarity.includes('shiny ultra rare') || lowerRarity.includes('character super rare')) {
		return 'rgba(255, 165, 0, 0.4)'; // Orange
	}
	// Tier 10: Secret Rares (Generic, Holo Star, Gold Star, Star)
	if (lowerRarity.includes('rare secret') || lowerRarity.includes('secret rare') || lowerRarity.includes('rare holo star') || lowerRarity.includes('gold star') || lowerRarity === 'star') {
	    if (!lowerRarity.includes('rainbow') && !lowerRarity.includes('gold')) {
 			return 'rgba(255, 215, 0, 0.4)'; // Gold
 		}
	}
	// Tier 11: Illustration Rares
	if (lowerRarity.includes('illustration rare')) {
		return 'rgba(180, 110, 220, 0.35)'; // Purple
	}
	// Tier 12: Hyper Rares & Rainbow Rares
	if (lowerRarity.includes('hyper rare') || lowerRarity.includes('rare rainbow')) {
		return 'rgba(180, 110, 220, 0.4)'; // Brighter Purple
	}
	// Tier 13: Gold Rares
	if (lowerRarity.includes('gold full art') || lowerRarity.includes('rare gold')) {
		return 'rgba(255, 215, 0, 0.45)'; // Brighter Gold
	}

	// Fallback
	return 'rgba(200, 200, 200, 0.15)'; // Default subtle grey
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
				const rarityColor = getRarityColor(card.rarity);

				// Apply background color to main div
				let html = `<div class="infobox" style="display: flex; align-items: center; padding: 15px; background-color: ${rarityColor}; border-radius: 8px;">`;

				// Image Section - Border #ccc
				html += `<div style="flex-shrink: 0; padding-right: 20px; border-right: 1px solid #ccc;">`;
				html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
				html += `</div>`;

				// Text Info Section - margin-left: 20px;
				html += `<div style="flex: 1; line-height: 1.6; margin-left: 20px;">`;
				// Name/ID Line - Removed color style from span
				html += `<strong style="font-size: 20px;">${card.name}</strong> `;
				html += `<span style="font-size: 0.9em; margin-left: 5px;">(${card.cardId})</span><br />`;
				// Details section
				html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
				// Removed color style from span
				html += `<strong style="font-size: 0.9em;">Set:</strong> ${card.set} <span style="font-size: 0.9em;">(${card.setId})</span><br />`;
				html += `<strong style="font-size: 0.9em;">Rarity:</strong> ${card.rarity}<br />`;
				html += `<strong style="font-size: 0.9em;">Supertype:</strong> ${card.supertype}<br />`;
				if (card.supertype === 'Pokémon' || card.supertype === 'Trainer') {
					html += `<strong style="font-size: 0.9em;">Subtypes:</strong> ${subtypes}<br />`;
				}
				// Points section - Removed color style from strong
				html += `<div style="margin-top: 10px;">`;
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
