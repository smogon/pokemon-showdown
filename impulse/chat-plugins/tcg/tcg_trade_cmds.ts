/*
* Pokemon Showdown
* TCG Trade Commands
* @author PrinceSky-Git
*/
import type { TcgUser } from './interface';
import { getCard, MAX_CARD_QUANTITY, CREDITS_PER_DUPLICATE } from './tcg_utils';
import { tcgCardsCollection, userCollectionsCollection, userProfilesCollection } from './tcg_collections';

interface TradeOffer {
	cards: Map<string, number>;
	credits: number;
}

interface ActiveTrade {
	initiator: string;
	recipient: string;
	initiatorOffer: TradeOffer;
	recipientOffer: TradeOffer;
	initiatorReady: boolean;
	recipientReady: boolean;
	createdAt: number;
}

const activeTrades = new Map<string, ActiveTrade>();
const TRADE_TIMEOUT = 10 * 60 * 1000;

function getTradeKey(user1: string, user2: string): string {
	return [user1, user2].sort().join(':');
}

function getUserTrade(userId: string): { trade: ActiveTrade, key: string } | null {
	for (const [key, trade] of activeTrades.entries()) {
		if (trade.initiator === userId || trade.recipient === userId) {
			return { trade, key };
		}
	}
	return null;
}

function cleanupExpiredTrades() {
	const now = Date.now();
	for (const [key, trade] of activeTrades.entries()) {
		if (now - trade.createdAt > TRADE_TIMEOUT) {
			activeTrades.delete(key);
		}
	}
}

setInterval(cleanupExpiredTrades, 60 * 1000);

export const tradeCommands: ChatCommands = {
	async trade(target, room, user) {
		const targetUserId = toID(target);
		if (!targetUserId) return this.errorReply("Usage: /tcg trade [user]");
		if (targetUserId === user.id) return this.errorReply("You cannot trade with yourself.");

		const targetUser = Users.get(targetUserId);
		if (!targetUser) return this.errorReply(`User "${target}" is not online.`);

		try {
			const profiles = userProfilesCollection;
			const [userProfile, targetProfile] = await Promise.all([
				profiles.findOne({ userId: user.id }),
				profiles.findOne({ userId: targetUserId }),
			]);

			if (userProfile?.tradesEnabled === false) {
				return this.errorReply("You have disabled trades. Use /tcg tradesenable to enable them.");
			}

			if (targetProfile?.tradesEnabled === false) {
				return this.errorReply(`${targetUser.name} has disabled trades.`);
			}
		} catch {
			return this.errorReply('An error occurred while checking trade settings.');
		}

		const existingTrade = getUserTrade(user.id);
		if (existingTrade) {
			return this.errorReply("You already have an active trade. Use /tcg tradecancel to cancel it first.");
		}

		const recipientTrade = getUserTrade(targetUserId);
		if (recipientTrade) {
			return this.errorReply(`${targetUser.name} is already in an active trade.`);
		}

		const tradeKey = getTradeKey(user.id, targetUserId);
		const newTrade: ActiveTrade = {
			initiator: user.id,
			recipient: targetUserId,
			initiatorOffer: { cards: new Map(), credits: 0 },
			recipientOffer: { cards: new Map(), credits: 0 },
			initiatorReady: false,
			recipientReady: false,
			createdAt: Date.now(),
		};

		activeTrades.set(tradeKey, newTrade);

		this.sendReply(`Trade initiated with ${targetUser.name}. Use /tcg tradeadd to add items.`);
		targetUser.popup(`|html|${user.name} wants to trade with you! Use <code>/tcg tradeadd [cardId], [quantity]</code> or <code>/tcg tradeaddcredits [amount]</code> to add items, then <code>/tcg tradeaccept</code> to accept.`);
	},

	async tradedisable(target, room, user) {
		try {
			const profiles = userProfilesCollection;
			const now = new Date().toISOString();

			await profiles.updateOne(
				{ userId: user.id },
				{ $set: { tradesEnabled: false, lastUpdatedAt: now } },
				{ upsert: true }
			);

			this.sendReply("You have disabled trades. Use /tcg tradesenable to re-enable them.");
		} catch {
			return this.errorReply("An error occurred while disabling trades.");
		}
	},

	async tradeenable(target, room, user) {
		try {
			const profiles = userProfilesCollection;
			const now = new Date().toISOString();

			await profiles.updateOne(
				{ userId: user.id },
				{ $set: { tradesEnabled: true, lastUpdatedAt: now } },
				{ upsert: true }
			);

			this.sendReply("You have enabled trades. Other users can now trade with you.");
		} catch {
			return this.errorReply("An error occurred while enabling trades.");
		}
	},

	async tradeadd(target, room, user) {
		const existingTrade = getUserTrade(user.id);
		if (!existingTrade) return this.errorReply("You do not have an active trade. Use /tcg trade [user] to start one.");

		const { trade } = existingTrade;
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 1) return this.errorReply("Usage: /tcg tradeadd [cardId], [quantity]");

		const cardId = parts[0];
		const quantity = parts[1] ? parseInt(parts[1]) : 1;

		if (!cardId) return this.errorReply("Please specify a card ID.");
		if (isNaN(quantity) || quantity <= 0) return this.errorReply("Invalid quantity. Must be a positive number.");

		try {
			const userCard = await userCollectionsCollection.findOne({ userId: user.id, cardId });
			if (!userCard || userCard.quantity === 0) {
				return this.errorReply(`You do not own any "${cardId}" cards.`);
			}

			const isInitiator = trade.initiator === user.id;
			const myOffer = isInitiator ? trade.initiatorOffer : trade.recipientOffer;
			const currentOffered = myOffer.cards.get(cardId) || 0;
			const totalOffered = currentOffered + quantity;

			if (totalOffered > userCard.quantity) {
				return this.errorReply(`You only have ${userCard.quantity}x "${userCard.name}". You cannot offer ${totalOffered}.`);
			}

			myOffer.cards.set(cardId, totalOffered);
			trade.initiatorReady = false;
			trade.recipientReady = false;

			this.sendReply(`Added ${quantity}x "${userCard.name}" to your trade offer. Total: ${totalOffered}x`);

			const otherUserId = isInitiator ? trade.recipient : trade.initiator;
			const otherUser = Users.get(otherUserId);
			if (otherUser) {
				otherUser.popup(`|html|${user.name} added ${quantity}x "${userCard.name}" to their trade offer.`);
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async traderemove(target, room, user) {
		const existingTrade = getUserTrade(user.id);
		if (!existingTrade) return this.errorReply("You do not have an active trade.");

		const { trade } = existingTrade;
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 1) return this.errorReply("Usage: /tcg traderemove [cardId], [quantity]");

		const cardId = parts[0];
		const quantity = parts[1] ? parseInt(parts[1]) : 1;

		if (!cardId) return this.errorReply("Please specify a card ID.");
		if (isNaN(quantity) || quantity <= 0) return this.errorReply("Invalid quantity. Must be a positive number.");

		try {
			const isInitiator = trade.initiator === user.id;
			const myOffer = isInitiator ? trade.initiatorOffer : trade.recipientOffer;
			const currentOffered = myOffer.cards.get(cardId) || 0;

			if (currentOffered === 0) {
				return this.errorReply(`You have not offered any "${cardId}" cards in this trade.`);
			}

			const newQuantity = currentOffered - quantity;
			if (newQuantity <= 0) {
				myOffer.cards.delete(cardId);
				this.sendReply(`Removed all "${cardId}" cards from your trade offer.`);
			} else {
				myOffer.cards.set(cardId, newQuantity);
				this.sendReply(`Removed ${quantity}x "${cardId}" from your trade offer. Remaining: ${newQuantity}x`);
			}

			trade.initiatorReady = false;
			trade.recipientReady = false;

			const card = getCard(cardId) || await tcgCardsCollection.findOne({ cardId });
			const cardName = card?.name || cardId;

			const otherUserId = isInitiator ? trade.recipient : trade.initiator;
			const otherUser = Users.get(otherUserId);
			if (otherUser) {
				otherUser.popup(`|html|${user.name} removed ${quantity}x "${cardName}" from their trade offer.`);
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async tradeaddcredits(target, room, user) {
		const existingTrade = getUserTrade(user.id);
		if (!existingTrade) return this.errorReply("You do not have an active trade. Use /tcg trade [user] to start one.");

		const { trade } = existingTrade;
		const amount = parseInt(target.trim());

		if (isNaN(amount) || amount <= 0) return this.errorReply("Invalid amount. Must be a positive number.");

		try {
			const profile = await userProfilesCollection.findOne({ userId: user.id });
			const userCredits = profile?.credits || 0;

			if (amount > userCredits) {
				return this.errorReply(`You only have ${userCredits} credits. You cannot offer ${amount}.`);
			}

			const isInitiator = trade.initiator === user.id;
			const myOffer = isInitiator ? trade.initiatorOffer : trade.recipientOffer;
			myOffer.credits = amount;
			trade.initiatorReady = false;
			trade.recipientReady = false;

			this.sendReply(`Added ${amount.toLocaleString()} credits to your trade offer.`);

			const otherUserId = isInitiator ? trade.recipient : trade.initiator;
			const otherUser = Users.get(otherUserId);
			if (otherUser) {
				otherUser.popup(`|html|${user.name} added ${amount.toLocaleString()} credits to their trade offer.`);
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async tradeview(target, room, user) {
		const existingTrade = getUserTrade(user.id);
		if (!existingTrade) return this.errorReply("You do not have an active trade.");

		const { trade } = existingTrade;
		const isInitiator = trade.initiator === user.id;
		const myOffer = isInitiator ? trade.initiatorOffer : trade.recipientOffer;
		const theirOffer = isInitiator ? trade.recipientOffer : trade.initiatorOffer;
		const otherUserId = isInitiator ? trade.recipient : trade.initiator;
		const otherUser = Users.get(otherUserId);
		const otherUserName = otherUser?.name || otherUserId;

		let html = `<div class="infobox" style="padding: 15px;">`;
		html += `<strong style="font-size: 1.3em;">Trade with ${otherUserName}</strong><br><hr>`;

		html += `<div style="margin: 10px 0;"><strong style="font-size: 1.1em;">Your Offer:</strong><br>`;
		if (myOffer.cards.size === 0 && myOffer.credits === 0) {
			html += `<em>Nothing offered yet</em>`;
		} else {
			if (myOffer.cards.size > 0) {
				html += `<strong>Cards:</strong><br>`;
				for (const [cardId, qty] of myOffer.cards.entries()) {
					const card = getCard(cardId) || await tcgCardsCollection.findOne({ cardId });
					const cardName = card?.name || cardId;
					html += `- ${qty}x ${cardName} [${cardId}]<br>`;
				}
			}
			if (myOffer.credits > 0) {
				html += `<strong>Credits:</strong> ${myOffer.credits.toLocaleString()}<br>`;
			}
		}
		html += `</div><hr>`;

		html += `<div style="margin: 10px 0;"><strong style="font-size: 1.1em;">${otherUserName}'s Offer:</strong><br>`;
		if (theirOffer.cards.size === 0 && theirOffer.credits === 0) {
			html += `<em>Nothing offered yet</em>`;
		} else {
			if (theirOffer.cards.size > 0) {
				html += `<strong>Cards:</strong><br>`;
				for (const [cardId, qty] of theirOffer.cards.entries()) {
					const card = getCard(cardId) || await tcgCardsCollection.findOne({ cardId });
					const cardName = card?.name || cardId;
					html += `- ${qty}x ${cardName} [${cardId}]<br>`;
				}
			}
			if (theirOffer.credits > 0) {
				html += `<strong>Credits:</strong> ${theirOffer.credits.toLocaleString()}<br>`;
			}
		}
		html += `</div><hr>`;

		html += `<div style="margin: 10px 0;">`;
		html += `<strong>Status:</strong><br>`;
		html += `${user.name}: ${trade.initiatorReady && isInitiator || trade.recipientReady && !isInitiator ? '<span style="color: green;">Ready ✓</span>' : '<span style="color: orange;">Not Ready</span>'}<br>`;
		html += `${otherUserName}: ${trade.initiatorReady && !isInitiator || trade.recipientReady && isInitiator ? '<span style="color: green;">Ready ✓</span>' : '<span style="color: orange;">Not Ready</span>'}`;
		html += `</div>`;

		html += `</div>`;
		this.sendReply(`|html|${html}`);
	},

	async tradeaccept(target, room, user) {
		const existingTrade = getUserTrade(user.id);
		if (!existingTrade) return this.errorReply("You do not have an active trade.");

		const { trade } = existingTrade;
		const isInitiator = trade.initiator === user.id;

		if (isInitiator) {
			trade.initiatorReady = true;
		} else {
			trade.recipientReady = true;
		}

		const otherUserId = isInitiator ? trade.recipient : trade.initiator;
		const otherUser = Users.get(otherUserId);

		if (trade.initiatorReady && trade.recipientReady) {
			try {
				const now = new Date().toISOString();
				const collection = userCollectionsCollection;
				const profiles = userProfilesCollection;

				for (const [cardId, qty] of trade.initiatorOffer.cards.entries()) {
					const card = await collection.findOne({ userId: trade.initiator, cardId });
					if (!card || card.quantity < qty) {
						activeTrades.delete(key);
						this.sendReply(`Trade cancelled: ${trade.initiator} no longer has enough ${cardId}.`);
						if (otherUser) otherUser.popup(`|html|Trade cancelled: ${user.name} no longer has enough of the offered cards.`);
						return;
					}
				}

				for (const [cardId, qty] of trade.recipientOffer.cards.entries()) {
					const card = await collection.findOne({ userId: trade.recipient, cardId });
					if (!card || card.quantity < qty) {
						activeTrades.delete(key);
						this.sendReply(`Trade cancelled: ${trade.recipient} no longer has enough ${cardId}.`);
						if (otherUser) otherUser.popup(`|html|Trade cancelled: They no longer have enough of the offered cards.`);
						return;
					}
				}

				const initiatorProfile = await profiles.findOne({ userId: trade.initiator });
				const recipientProfile = await profiles.findOne({ userId: trade.recipient });

				if ((initiatorProfile?.credits || 0) < trade.initiatorOffer.credits) {
					activeTrades.delete(key);
					this.sendReply(`Trade cancelled: Insufficient credits.`);
					if (otherUser) otherUser.popup(`|html|Trade cancelled: ${user.name} has insufficient credits.`);
					return;
				}

				if ((recipientProfile?.credits || 0) < trade.recipientOffer.credits) {
					activeTrades.delete(key);
					this.sendReply(`Trade cancelled: Insufficient credits.`);
					if (otherUser) otherUser.popup(`|html|Trade cancelled: They have insufficient credits.`);
					return;
				}

				for (const [cardId, qty] of trade.initiatorOffer.cards.entries()) {
					const card = await collection.findOne({ userId: trade.initiator, cardId });
					if (!card) continue;

					const newQty = card.quantity - qty;
					if (newQty === 0) {
						await collection.deleteOne({ userId: trade.initiator, cardId });
					} else {
						await collection.updateOne({ userId: trade.initiator, cardId }, { $inc: { quantity: -qty } });
					}

					await profiles.updateOne(
						{ userId: trade.initiator },
						{
							$inc: {
								totalQuantity: -qty,
								collectionPoints: -(card.totalPoints * qty),
								totalUniqueCards: newQty === 0 ? -1 : 0,
							},
							$set: { lastUpdatedAt: now },
						}
					);

					const recipientCard = await collection.findOne({ userId: trade.recipient, cardId });
					const currentRecipientQty = recipientCard?.quantity || 0;
					const newRecipientQty = currentRecipientQty + qty;
					const finalRecipientQty = Math.min(newRecipientQty, MAX_CARD_QUANTITY);
					const excess = newRecipientQty - finalRecipientQty;
					const creditsToAward = excess * CREDITS_PER_DUPLICATE;
					const actualQtyAdded = finalRecipientQty - currentRecipientQty;

					if (actualQtyAdded > 0) {
						if (recipientCard) {
							await collection.updateOne(
								{ userId: trade.recipient, cardId },
								{ $set: { quantity: finalRecipientQty, lastAcquiredAt: now } }
							);
						} else {
							const newDoc: TcgUser = { ...card, userId: trade.recipient, quantity: finalRecipientQty, firstAcquiredAt: now, lastAcquiredAt: now };
							delete (newDoc as any)._id;
							await collection.insertOne(newDoc);
						}

						await profiles.updateOne(
							{ userId: trade.recipient },
							{
								$inc: {
									totalQuantity: actualQtyAdded,
									collectionPoints: card.totalPoints * actualQtyAdded,
									totalUniqueCards: currentRecipientQty === 0 ? 1 : 0,
									credits: creditsToAward,
								},
								$set: { lastUpdatedAt: now },
							},
							{ upsert: true }
						);
					}
				}

				for (const [cardId, qty] of trade.recipientOffer.cards.entries()) {
					const card = await collection.findOne({ userId: trade.recipient, cardId });
					if (!card) continue;

					const newQty = card.quantity - qty;
					if (newQty === 0) {
						await collection.deleteOne({ userId: trade.recipient, cardId });
					} else {
						await collection.updateOne({ userId: trade.recipient, cardId }, { $inc: { quantity: -qty } });
					}

					await profiles.updateOne(
						{ userId: trade.recipient },
						{
							$inc: {
								totalQuantity: -qty,
								collectionPoints: -(card.totalPoints * qty),
								totalUniqueCards: newQty === 0 ? -1 : 0,
							},
							$set: { lastUpdatedAt: now },
						}
					);

					const initiatorCard = await collection.findOne({ userId: trade.initiator, cardId });
					const currentInitiatorQty = initiatorCard?.quantity || 0;
					const newInitiatorQty = currentInitiatorQty + qty;
					const finalInitiatorQty = Math.min(newInitiatorQty, MAX_CARD_QUANTITY);
					const excess = newInitiatorQty - finalInitiatorQty;
					const creditsToAward = excess * CREDITS_PER_DUPLICATE;
					const actualQtyAdded = finalInitiatorQty - currentInitiatorQty;

					if (actualQtyAdded > 0) {
						if (initiatorCard) {
							await collection.updateOne(
								{ userId: trade.initiator, cardId },
								{ $set: { quantity: finalInitiatorQty, lastAcquiredAt: now } }
							);
						} else {
							const newDoc: TcgUser = { ...card, userId: trade.initiator, quantity: finalInitiatorQty, firstAcquiredAt: now, lastAcquiredAt: now };
							delete (newDoc as any)._id;
							await collection.insertOne(newDoc);
						}

						await profiles.updateOne(
							{ userId: trade.initiator },
							{
								$inc: {
									totalQuantity: actualQtyAdded,
									collectionPoints: card.totalPoints * actualQtyAdded,
									totalUniqueCards: currentInitiatorQty === 0 ? 1 : 0,
									credits: creditsToAward,
								},
								$set: { lastUpdatedAt: now },
							},
							{ upsert: true }
						);
					}
				}

				if (trade.initiatorOffer.credits > 0) {
					await profiles.updateOne({ userId: trade.initiator }, { $inc: { credits: -trade.initiatorOffer.credits } });
					await profiles.updateOne({ userId: trade.recipient }, { $inc: { credits: trade.initiatorOffer.credits } }, { upsert: true });
				}

				if (trade.recipientOffer.credits > 0) {
					await profiles.updateOne({ userId: trade.recipient }, { $inc: { credits: -trade.recipientOffer.credits } });
					await profiles.updateOne({ userId: trade.initiator }, { $inc: { credits: trade.recipientOffer.credits } }, { upsert: true });
				}

				await profiles.updateOne(
					{ userId: trade.initiator },
					{ $inc: { totalTrades: 1 } },
					{ upsert: true }
				);
				await profiles.updateOne(
					{ userId: trade.recipient },
					{ $inc: { totalTrades: 1 } },
					{ upsert: true }
				);

				activeTrades.delete(key);

				this.sendReply(`Trade completed successfully!`);
				if (otherUser) {
					otherUser.popup(`|html|Trade with ${user.name} completed successfully!`);
				}
			} catch {
				activeTrades.delete(key);
				this.errorReply(`An error occurred during the trade: ${error.message}`);
				if (otherUser) {
					otherUser.popup(`|html|Trade failed due to an error.`);
				}
			}
		} else {
			this.sendReply(`You are ready to trade. Waiting for ${otherUser?.name || otherUserId} to accept.`);
			if (otherUser) {
				otherUser.popup(`|html|${user.name} is ready to trade! Use <code>/tcg tradeview</code> to review and <code>/tcg tradeaccept</code> to accept.`);
			}
		}
	},

	tradecancel(target, room, user) {
		const existingTrade = getUserTrade(user.id);
		if (!existingTrade) return this.errorReply("You do not have an active trade.");

		const { trade } = existingTrade;
		const isInitiator = trade.initiator === user.id;
		const otherUserId = isInitiator ? trade.recipient : trade.initiator;
		const otherUser = Users.get(otherUserId);

		activeTrades.delete(key);

		this.sendReply("Trade cancelled.");
		if (otherUser) {
			otherUser.popup(`|html|${user.name} cancelled the trade.`);
		}
	},

	tradehelp(target, room, user) {
		if (!this.runBroadcast()) return;
		const helpList = [
			{ cmd: "/tcg trade [user]", desc: "Initiate a trade with another user." },
			{ cmd: "/tcg tradeadd [cardId], [quantity]", desc: "Add cards to your current trade offer." },
			{ cmd: "/tcg traderemove [cardId], [quantity]", desc: "Remove cards from your current trade offer." },
			{ cmd: "/tcg tradeaddcredits [amount]", desc: "Add credits to your current trade offer." },
			{ cmd: "/tcg tradeview", desc: "View the current trade details and status." },
			{ cmd: "/tcg tradeaccept", desc: "Accept the current trade. Both users must accept to complete the trade." },
			{ cmd: "/tcg tradecancel", desc: "Cancel the current active trade." },
			{ cmd: "/tcg tradedisable", desc: "Disable incoming trade requests from other users." },
			{ cmd: "/tcg tradeenable", desc: "Enable incoming trade requests from other users." },
		];
		const html = `<center><strong>TCG Trading Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			helpList.map(({ cmd, desc }, i) =>
				`<li><b>${cmd}</b><br>${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(`<div style="max-height: 400px; overflow-y: auto;">${html}</div>`);
	},
};
