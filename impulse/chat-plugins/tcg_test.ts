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
				
				const imageUrl = card.imageUrl || 'https://via.placeholder.com/200x200?text=No+Image';
				const subtypes = card.subtypes.join(' | ');
				
				let html = `<div class="infobox" style="display: flex; align-items: flex-start; gap: 15px;">`;
				html += `<img src="${imageUrl}" width="200" height="200" style="border-radius: 8px; flex-shrink: 0;" />`;
				html += `<div style="flex: 1;">`;
				html += `<strong style="font-size: 18px;">${card.name}</strong> <span style="color: #666;">(${card.cardId})</span><br />`;
				html += `<strong>Set:</strong> ${card.set} <span style="color: #666;">(${card.setId})</span><br />`;
				html += `<strong>Rarity:</strong> ${card.rarity}<br />`;
				html += `<strong>Supertype:</strong> ${card.supertype}<br />`;
				html += `<strong>Subtypes:</strong> ${subtypes}<br />`;
				html += `<strong>Points:</strong> ${card.totalPoints}`;
				html += `</div></div>`;
				
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
