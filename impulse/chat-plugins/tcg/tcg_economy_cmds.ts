/*
* Pokemon Showdown
* TCG Economy and Shop Commands
*/
import { ImpulseDB } from '../../impulse-db';
import { TcgCard, TcgUser, TcgUserProfile, TcgUserPack } from './interface';
import { getSet, dailyShopCache, currentShopDate, setShopCache, MAX_CARD_QUANTITY } from './tcg_utils';
import { generateThemedTable } from '../../utils';
import { tcgCardsCollection, userCollectionsCollection, userProfilesCollection, userPacksCollection } from './tcg_collections';

const PACK_COST = 0;
const PACKS_IN_SHOP = 20;

export const economyCommands: ChatCommands = {
	async shop(target, room, user) {
		if (!this.runBroadcast()) return;

		try {
			const today = new Date().toISOString().split('T')[0];
			if (currentShopDate !== today || dailyShopCache.length === 0) {
				const cardCollection = tcgCardsCollection;
				const newShopSets = await cardCollection.aggregate([
					{
						$group: {
							_id: "$setId",
							setName: { $first: "$set" },
							setLogo: { $first: "$setImages.logo" },
							setSeries: { $first: "$setSeries" },
							setReleaseDate: { $first: "$setReleaseDate" }
						}
					},
					{ $sample: { size: PACKS_IN_SHOP } },
					{ $sort: { setReleaseDate: -1 } }
				]);

				const mappedCache = newShopSets.map(set => ({
					setId: set._id,
					set: set.setName,
					setImages: { logo: set.setLogo, symbol: '' },
					setSeries: set.setSeries,
				} as Partial<TcgCard> as TcgCard));
				setShopCache(mappedCache, today);
			}

			const profileCollection = userProfilesCollection;
			const profile = await profileCollection.findOne({ userId: user.id });
			const userCredits = profile?.credits || 0;

			let html = `<div class="style="padding: 10px;">`;
			const title = `TCG Packs Shop<br><span style="font-size: 0.9em;">Your Credits: <strong>${userCredits.toLocaleString()}</strong></span>`;
			const headerRow = ['Pack', 'Series', 'Price', 'Buy'];
			const dataRows: string[][] = [];

			if (dailyShopCache.length === 0) {
				return this.errorReply("The shop is empty or still loading. Please try again in a moment.");
			}

			for (const set of dailyShopCache) {
				const logoHtml = set.setImages?.logo ? `<img src="${set.setImages.logo}" height="20" style="max-width: 60px; vertical-align: middle; margin-right: 5px;" alt="${set.set}">` : '';
				dataRows.push([
					`${logoHtml} [ ${set.setId} ]`,
					set.setSeries || 'N/A',
					`${PACK_COST} Credits`,
					`<button name="send" value="/tcg buy ${set.setId}" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Buy</button>`
				]);
			}

			html += generateThemedTable(title, headerRow, dataRows);
			this.sendReply(`|html|${html}`);
		} catch (error) {
			return this.errorReply('An error occurred while fetching the shop. Please try again later.');
		}
	},

	async buy(target, room, user) {
		const setId = toID(target);
		if (!setId) return this.errorReply("Please specify a set ID to buy. Use /tcg shop to see available packs.");

		const setInShop = dailyShopCache.find(s => s.setId === setId);
		if (!setInShop) {
			const today = new Date().toISOString().split('T')[0];
			if (currentShopDate !== today || dailyShopCache.length === 0) {
				this.parse('/tcg shop');
				return this.errorReply("The shop is currently resetting. We've refreshed it for you, please try buying again.");
			}
			return this.errorReply(`The pack "${setId}" is not currently in the daily shop. Use /tcg shop to see today's packs.`);
		}

		try {
			const profileCollection = userProfilesCollection;
			const updateResult = await profileCollection.updateOne(
				{ userId: user.id, credits: { $gte: PACK_COST } },
				{ $inc: { credits: -PACK_COST } }
			);

			if (updateResult.matchedCount === 0) {
				const profile = await profileCollection.findOne({ userId: user.id });
				const userCredits = profile?.credits || 0;
				return this.errorReply(`You do not have enough credits to buy this pack. You need ${PACK_COST} credits, but you only have ${userCredits}.`);
			}

			const packCollection = userPacksCollection;
			const now = new Date().toISOString();
			await packCollection.updateOne(
				{ userId: user.id, setId: setId },
				{ 
					$inc: { quantity: 1 },
					$set: { setName: setInShop.set, setLogo: setInShop.setImages?.logo || '', lastAcquiredAt: now },
					$setOnInsert: { userId: user.id, setId: setId }
				},
				{ upsert: true }
			);

			this.sendReply(`You successfully purchased one "${setInShop.set}" pack for ${PACK_COST} credits!`);
			this.sendReply(`Use /tcg packs to see your new pack and /tcg opensavedpack ${setInShop.setId} to open it.`);
		} catch (error) {
			const profileCollection = userProfilesCollection;
			await profileCollection.updateOne({ userId: user.id }, { $inc: { credits: PACK_COST } });
			return this.errorReply(`An unknown error occurred during your purchase. Your credits have been refunded. Error: ${error.message}`);
		}
	},

	async sell(target, room, user) {
		const parts = target.split(',').map(p => p.trim());
		let cardId = parts[0];
		let quantityToSell = parts[1] ? parseInt(parts[1]) : 1;

		if (!cardId) return this.errorReply("Please specify a card ID to sell. Usage: /tcg sell [cardId], [quantity]");
		if (isNaN(quantityToSell) || quantityToSell <= 0) return this.errorReply("Invalid quantity. Quantity must be a positive number.");
		if (quantityToSell > MAX_CARD_QUANTITY) return this.errorReply(`You can sell a maximum of ${MAX_CARD_QUANTITY} cards at a time.`);

		const collection = userCollectionsCollection;
		const profiles = userProfilesCollection;

		try {
			const userCard = await collection.findOne({ userId: user.id, cardId: cardId });
			if (!userCard || userCard.quantity === 0) return this.errorReply(`You do not own any "${cardId}" cards.`);
			if (userCard.quantity < quantityToSell) {
				return this.errorReply(`You only have ${userCard.quantity}x "${userCard.name}". You cannot sell ${quantityToSell}.`);
			}

			const newQuantity = userCard.quantity - quantityToSell;
			const creditsToAward = quantityToSell * CREDITS_PER_DUPLICATE;
			const pointsToDeduct = userCard.totalPoints * quantityToSell;
			const uniqueCardsChange = newQuantity === 0 ? -1 : 0;
			const now = new Date().toISOString();

			if (newQuantity === 0) {
				await collection.deleteOne({ userId: user.id, cardId: cardId });
			} else {
				await collection.updateOne({ userId: user.id, cardId: cardId }, { $inc: { quantity: -quantityToSell } });
			}

			await profiles.updateOne(
				{ userId: user.id },
				{
					$inc: {
						credits: creditsToAward, totalQuantity: -quantityToSell,
						collectionPoints: -pointsToDeduct, totalUniqueCards: uniqueCardsChange
					},
					$set: { userName: user.name, lastUpdatedAt: now }
				},
				{ upsert: true }
			);

			this.sendReply(`You successfully sold ${quantityToSell}x "${userCard.name}" for ${creditsToAward} credits.`);
		} catch (error) {
			return this.errorReply('An error occurred while selling your card.');
		}
	},

	async sellduplicates(target, room, user) {
		const targetId = target;
		const collection = userCollectionsCollection;
		const profiles = userProfilesCollection;
		const filter: any = { userId: user.id, quantity: { $gt: 1 } };
		let description = "all duplicates";

		if (targetId && targetId !== 'all') {
			filter.setId = targetId;
			description = `duplicates from set "${targetId}"`;
		}

		try {
			const cardsToSell = await collection.find(filter);
			if (cardsToSell.length === 0) return this.errorReply(`You have no ${description} to sell.`);

			let totalCardsSold = 0, totalCreditsEarned = 0, totalPointsDeducted = 0;
			const operations = [];
			const now = new Date().toISOString();

			for (const card of cardsToSell) {
				const quantityToSell = card.quantity - 1;
				if (quantityToSell <= 0) continue;
				totalCardsSold += quantityToSell;
				totalCreditsEarned += (quantityToSell * CREDITS_PER_DUPLICATE);
				totalPointsDeducted += (card.totalPoints * quantityToSell);
				operations.push({
					updateOne: {
						filter: { userId: user.id, cardId: card.cardId },
						update: { $set: { quantity: 1 } }
					}
				});
			}

			if (operations.length === 0) return this.errorReply(`No duplicates found matching your criteria.`);

			await collection.bulkWrite(operations, { ordered: false });
			await profiles.updateOne(
				{ userId: user.id },
				{
					$inc: { credits: totalCreditsEarned, totalQuantity: -totalCardsSold, collectionPoints: -totalPointsDeducted },
					$set: { userName: user.name, lastUpdatedAt: now }
				},
				{ upsert: true }
			);

			this.sendReply(`You successfully sold ${totalCardsSold} ${description} for ${totalCreditsEarned} credits.`);
		} catch (error) {
			return this.errorReply('An error occurred while selling your duplicates.');
		}
	},

	async giftcard(target, room, user) {
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) {
			return this.errorReply("Please specify a user, card ID, and optional quantity. Usage: /tcg giftcard [user], [cardId], [quantity]");
		}

		const targetUserId = toID(parts[0]);
		const cardId = parts[1];
		let quantityToGift = parts[2] ? parseInt(parts[2]) : 1;

		if (!targetUserId) return this.errorReply("Please specify a user to gift to.");
		if (targetUserId === user.id) return this.errorReply("You cannot gift cards to yourself.");
		if (!cardId) return this.errorReply("Please specify a card ID to gift.");
		if (isNaN(quantityToGift) || quantityToGift <= 0) return this.errorReply("Invalid quantity. Quantity must be a positive number.");

		const collection = userCollectionsCollection;
		const profiles = userProfilesCollection;

		try {
			const senderCard = await collection.findOne({ userId: user.id, cardId: cardId });
			if (!senderCard || senderCard.quantity < quantityToGift) {
				const owned = senderCard ? senderCard.quantity : 0;
				return this.errorReply(`You do not have ${quantityToGift}x "${cardId}". You only have ${owned}.`);
			}

			const newSenderQty = senderCard.quantity - quantityToGift;
			const pointsToDeduct = senderCard.totalPoints * quantityToGift;
			const uniqueCardsChangeSender = newSenderQty === 0 ? -1 : 0;

			if (newSenderQty === 0) {
				await collection.deleteOne({ userId: user.id, cardId: cardId });
			} else {
				await collection.updateOne({ userId: user.id, cardId: cardId }, { $inc: { quantity: -quantityToGift } });
			}

			await profiles.updateOne(
				{ userId: user.id },
				{ $inc: { totalQuantity: -quantityToGift, collectionPoints: -pointsToDeduct, totalUniqueCards: uniqueCardsChangeSender } }
			);

			const now = new Date().toISOString();
			const recipientCard = await collection.findOne({ userId: targetUserId, cardId: cardId });
			const currentRecipientQty = recipientCard?.quantity || 0;
			const newRecipientQty = currentRecipientQty + quantityToGift;
			const finalRecipientQty = Math.min(newRecipientQty, MAX_CARD_QUANTITY);
			const excess = newRecipientQty - finalRecipientQty;
			const creditsToAward = excess * CREDITS_PER_DUPLICATE;
			const actualQtyAdded = finalRecipientQty - currentRecipientQty;
			const pointsToAdd = senderCard.totalPoints * actualQtyAdded;
			const uniqueCardsChangeRecipient = (currentRecipientQty === 0 && actualQtyAdded > 0) ? 1 : 0;

			if (actualQtyAdded > 0) {
				if (recipientCard) {
					await collection.updateOne(
						{ userId: targetUserId, cardId: cardId },
						{ $set: { quantity: finalRecipientQty, lastAcquiredAt: now } }
					);
				} else {
					const newDocData: TcgUser = { ...senderCard, userId: targetUserId, quantity: finalRecipientQty, firstAcquiredAt: now, lastAcquiredAt: now };
					delete (newDocData as any)._id;
					await collection.insertOne(newDocData);
				}
			}

			if (actualQtyAdded > 0 || creditsToAward > 0) {
				const recipientProfile = await profiles.findOne({ userId: targetUserId });
				if (recipientProfile) {
					await profiles.updateOne(
						{ userId: targetUserId },
						{
							$inc: {
								totalQuantity: actualQtyAdded, collectionPoints: pointsToAdd,
								totalUniqueCards: uniqueCardsChangeRecipient, credits: creditsToAward
							},
							$set: { userName: recipientProfile.userName, lastUpdatedAt: now }
						}
					);
				} else {
					await profiles.insertOne({
						userId: targetUserId, userName: targetUserId, credits: creditsToAward,
						totalUniqueCards: uniqueCardsChangeRecipient, totalQuantity: actualQtyAdded,
						collectionPoints: pointsToAdd, lastUpdatedAt: now
					});
				}
			}

			let reply = `You successfully gifted ${quantityToGift}x "${senderCard.name}" to ${targetUserId}.`;
			if (creditsToAward > 0) {
				reply += ` They received ${actualQtyAdded} card(s) and ${creditsToAward} credits (from duplicates).`;
			}
			this.sendReply(reply);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|${user.name} has given you ${quantityToGift} "${senderCard.name}" card(s).`);
			}
		} catch (error) {
			return this.errorReply('An error occurred while gifting your card.');
		}
	},

	async giftpack(target, room, user) {
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) {
			return this.errorReply("Please specify a user and set ID. Usage: /tcg giftpack [user], [setId], [quantity]");
		}

		const targetUserId = toID(parts[0]);
		const setId = parts[1];
		let quantityToGift = parts[2] ? parseInt(parts[2]) : 1;

		if (!targetUserId) return this.errorReply("Please specify a user to gift to.");
		if (targetUserId === user.id) return this.errorReply("You cannot gift packs to yourself.");
		if (!setId) return this.errorReply("Please specify a pack set ID to gift.");
		if (isNaN(quantityToGift) || quantityToGift <= 0) return this.errorReply("Invalid quantity. Quantity must be a positive number.");

		const collection = userPacksCollection;

		try {
			const senderPack = await collection.findOne({ userId: user.id, setId: setId });
			if (!senderPack || senderPack.quantity < quantityToGift) {
				const owned = senderPack ? senderPack.quantity : 0;
				return this.errorReply(`You do not have ${quantityToGift}x "${setId}" pack(s). You only have ${owned}.`);
			}

			const updateSenderResult = await collection.updateOne(
				{ userId: user.id, setId: setId, quantity: { $gte: quantityToGift } },
				{ $inc: { quantity: -quantityToGift } }
			);

			if (updateSenderResult.modifiedCount === 0) {
				return this.errorReply(`You do not have ${quantityToGift}x "${setId}" pack(s). You only have ${senderPack.quantity}.`);
			}

			const now = new Date().toISOString();
			await collection.updateOne(
				{ userId: targetUserId, setId: setId },
				{
					$inc: { quantity: quantityToGift },
					$set: { setName: senderPack.setName, setLogo: senderPack.setLogo, lastAcquiredAt: now },
					$setOnInsert: { userId: targetUserId, setId: setId }
				},
				{ upsert: true }
			);
			this.sendReply(`You successfully gifted ${quantityToGift}x "${senderPack.setName}" pack(s) to ${targetUserId}.`);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|${user.name} has given you ${quantityToGift} "${senderPack.setName}" pack(s).`);
			}
		} catch (error) {
			return this.errorReply('An error occurred while gifting your pack(s).');
		}
	},

	async giftcredits(target, room, user) {
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) {
			return this.errorReply("Please specify a user and an amount. Usage: /tcg giftcredits [user], [amount]");
		}

		const targetUserId = toID(parts[0]);
		const amountToGift = parseInt(parts[1]);

		if (!targetUserId) return this.errorReply("Please specify a user to gift to.");
		if (targetUserId === user.id) return this.errorReply("You cannot gift credits to yourself.");
		if (isNaN(amountToGift) || amountToGift <= 0) return this.errorReply("Invalid amount. Amount must be a positive number.");

		const profiles = userProfilesCollection;
		let senderUpdateSucceeded = false;

		try {
			const now = new Date().toISOString();
			const senderUpdateResult = await profiles.updateOne(
				{ userId: user.id, credits: { $gte: amountToGift } },
				{ $inc: { credits: -amountToGift } }
			);

			if (senderUpdateResult.modifiedCount === 0) {
				const senderProfile = await profiles.findOne({ userId: user.id });
				const senderCredits = senderProfile?.credits || 0;
				throw new Error(`You do not have enough credits. You have ${senderCredits.toLocaleString()}, but tried to send ${amountToGift.toLocaleString()}.`);
			}

			senderUpdateSucceeded = true;
			const recipientProfile = await profiles.findOne({ userId: targetUserId });

			if (recipientProfile) {
				await profiles.updateOne(
					{ userId: targetUserId },
					{ $inc: { credits: amountToGift }, $set: { lastUpdatedAt: now } }
				);
			} else {
				await profiles.insertOne({
					userId: targetUserId, userName: targetUserId, credits: amountToGift,
					collectionPoints: 0, totalQuantity: 0, totalUniqueCards: 0, lastUpdatedAt: now
				});
			}

			this.sendReply(`You successfully gifted ${amountToGift.toLocaleString()} credits to ${targetUserId}.`);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|${user.name} has given you ${amountToGift.toLocaleString()} credit(s).`);
			}
		} catch (error) {
			if (error.message.startsWith('You do not have enough credits')) {
				return this.errorReply(error.message);
			}

			if (senderUpdateSucceeded) {
				await profiles.updateOne({ userId: user.id }, { $inc: { credits: amountToGift } });
				return this.errorReply(`An error occurred while sending credits to the recipient. Your ${amountToGift.toLocaleString()} credits have been refunded.`);
			}

			return this.errorReply('An unknown error occurred during the credit transfer.');
		}
	},

	economyhelp(target, room, user) {
		if (!this.runBroadcast()) return;
		const helpList = [
			{cmd: "/tcg shop", desc: "View the daily rotating pack shop with available packs."},
			{cmd: "/tcg buy [setId]", desc: "Buy a pack from the shop using credits."},
			{cmd: "/tcg sell [cardId], [quantity]", desc: "Sell a card from your collection for credits."},
			{cmd: "/tcg sellduplicates [all | setId]", desc: "Sell all duplicate cards (quantity > 1) for credits."},
			{cmd: "/tcg giftcard [user], [cardId], [quantity]", desc: "Gift a card from your collection to another user."},
			{cmd: "/tcg giftpack [user], [setId], [quantity]", desc: "Gift one or more saved packs to another user."},
			{cmd: "/tcg giftcredits [user], [amount]", desc: "Gift credits to another user."},
		];
		const html = `<center><strong>TCG Economy Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			helpList.map(({cmd, desc}, i) =>
				`<li><b>${cmd}</b><br>${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(`<div style="max-height: 400px; overflow-y: auto;">${html}</div>`);
	},
};
