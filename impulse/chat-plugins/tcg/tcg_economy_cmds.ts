// Pokemon Showdown - TCG Economy & Shop Commands
// @author PrinceSky-Git
import type { TcgCard, TcgUser } from './interface';
import { dailyShopCache, currentShopDate, setShopCache, MAX_CARD_QUANTITY } from './tcg_utils';
import { generateThemedTable } from '../../utils';
import { tcgCardsCollection, userCollectionsCollection,
	userProfilesCollection, userPacksCollection } from './tcg_collections';

const PACK_COST = 0;
const PACKS_IN_SHOP = 20;
export const economyCommands: ChatCommands = {
	async shop(target, room, user) {
		if (!this.runBroadcast()) return;
		try {
			const today = new Date().toISOString().split('T')[0];
			if (currentShopDate !== today || dailyShopCache.length === 0) {
				const cards = tcgCardsCollection;
				const shopSets = await cards.aggregate([
					{
						$group: {
							_id: "$setId",
							setName: { $first: "$set" },
							setLogo: { $first: "$setImages.logo" },
							setSeries: { $first: "$setSeries" },
							setReleaseDate: { $first: "$setReleaseDate" },
						},
					},
					{ $sample: { size: PACKS_IN_SHOP } },
					{ $sort: { setReleaseDate: -1 } },
				]);
				const cache = shopSets.map(set => ({
					setId: set._id,
					set: set.setName,
					setImages: { logo: set.setLogo, symbol: '' },
					setSeries: set.setSeries,
				} as TcgCard));
				setShopCache(cache, today);
			}
			const profiles = userProfilesCollection;
			const profile = await profiles.findOne({ userId: user.id });
			const credits = profile?.credits || 0;
			let html = `<div style="padding: 10px;">`;
			const title = `TCG Packs Shop<br><span style="font-size: 0.9em;">Your Credits: <strong>${credits.toLocaleString()}</strong></span>`;
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
					`<button name="send" value="/tcg buy ${set.setId}" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Buy</button>`,
				]);
			}
			html += generateThemedTable(title, headerRow, dataRows);
			this.sendReply(`|html|${html}`);
		} catch {
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
			const profiles = userProfilesCollection;
			const result = await profiles.updateOne(
				{ userId: user.id, credits: { $gte: PACK_COST } },
				{ $inc: { credits: -PACK_COST } }
			);
			if (result.matchedCount === 0) {
				const profile = await profiles.findOne({ userId: user.id });
				const credits = profile?.credits || 0;
				return this.errorReply(`You do not have enough credits to buy this pack. You need ${PACK_COST} credits, but you only have ${credits}.`);
			}
			const packs = userPacksCollection;
			const now = new Date().toISOString();
			await packs.updateOne(
				{ userId: user.id, setId },
				{
					$inc: { quantity: 1 },
					$set: { setName: setInShop.set, setLogo: setInShop.setImages?.logo || '', lastAcquiredAt: now },
					$setOnInsert: { userId: user.id, setId },
				},
				{ upsert: true }
			);
			this.sendReply(`You successfully purchased one "${setInShop.set}" pack for ${PACK_COST} credits!`);
			this.sendReply(`Use /tcg packs to see your new pack and /tcg opensavedpack ${setInShop.setId} to open it.`);
		} catch {
			const profiles = userProfilesCollection;
			await profiles.updateOne({ userId: user.id }, { $inc: { credits: PACK_COST } });
			return this.errorReply(`An unknown error occurred during your purchase. Your credits have been refunded. Error: ${error.message}`);
		}
	},
	async sell(target, room, user) {
		const parts = target.split(',').map(p => p.trim());
		const cardId = parts[0];
		const qty = parts[1] ? parseInt(parts[1]) : 1;
		if (!cardId) return this.errorReply("Please specify a card ID to sell. Usage: /tcg sell [cardId], [quantity]");
		if (isNaN(qty) || qty <= 0) return this.errorReply("Invalid quantity. Quantity must be a positive number.");
		if (qty > MAX_CARD_QUANTITY) return this.errorReply(`You can sell a maximum of ${MAX_CARD_QUANTITY} cards at a time.`);
		const collection = userCollectionsCollection;
		const profiles = userProfilesCollection;
		try {
			const card = await collection.findOne({ userId: user.id, cardId });
			if (!card || card.quantity === 0) return this.errorReply(`You do not own any "${cardId}" cards.`);
			if (card.quantity < qty) {
				return this.errorReply(`You only have ${card.quantity}x "${card.name}". You cannot sell ${qty}.`);
			}
			const newQty = card.quantity - qty;
			const credits = qty * CREDITS_PER_DUPLICATE;
			const pts = card.totalPoints * qty;
			const uniqueChange = newQty === 0 ? -1 : 0;
			const now = new Date().toISOString();
			if (newQty === 0) {
				await collection.deleteOne({ userId: user.id, cardId });
			} else {
				await collection.updateOne({ userId: user.id, cardId }, { $inc: { quantity: -qty } });
			}
			await profiles.updateOne(
				{ userId: user.id },
				{
					$inc: {
						credits: credits, totalQuantity: -qty,
						collectionPoints: -pts, totalUniqueCards: uniqueChange,
					},
					$set: { userName: user.name, lastUpdatedAt: now },
				},
				{ upsert: true }
			);
			this.sendReply(`You successfully sold ${qty}x "${card.name}" for ${credits} credits.`);
		} catch {
			return this.errorReply('An error occurred while selling your card.');
		}
	},
	async sellduplicates(target, room, user) {
		const targetId = target.trim();
		const collection = userCollectionsCollection;
		const profiles = userProfilesCollection;
		const filter = { userId: user.id, quantity: { $gt: 1 } };
		let desc = "all duplicates";
		if (targetId && targetId !== 'all') {
			filter.setId = targetId.toLowerCase();
			desc = `duplicates from set "${targetId}"`;
		}
		try {
			const cards = await collection.find(filter);
			if (cards.length === 0) return this.errorReply(`You have no ${desc} to sell.`);
			let totalCards = 0, totalCredits = 0, totalPts = 0;
			const ops = [];
			const now = new Date().toISOString();
			for (const card of cards) {
				const qty = card.quantity - 1;
				if (qty <= 0) continue;
				totalCards += qty;
				totalCredits += (qty * CREDITS_PER_DUPLICATE);
				totalPts += (card.totalPoints * qty);
				ops.push({
					updateOne: {
						filter: { userId: user.id, cardId: card.cardId },
						update: { $set: { quantity: 1 } },
					},
				});
			}
			if (ops.length === 0) return this.errorReply(`No duplicates found matching your criteria.`);
			await collection.bulkWrite(ops, { ordered: false });
			await profiles.updateOne(
				{ userId: user.id },
				{
					$inc: { credits: totalCredits, totalQuantity: -totalCards, collectionPoints: -totalPts },
					$set: { userName: user.name, lastUpdatedAt: now },
				},
				{ upsert: true }
			);
			this.sendReply(`You successfully sold ${totalCards} ${desc} for ${totalCredits} credits.`);
		} catch {
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
		const qty = parts[2] ? parseInt(parts[2]) : 1;
		if (!targetUserId) return this.errorReply("Please specify a user to gift to.");
		if (targetUserId === user.id) return this.errorReply("You cannot gift cards to yourself.");
		if (!cardId) return this.errorReply("Please specify a card ID to gift.");
		if (isNaN(qty) || qty <= 0) return this.errorReply("Invalid quantity. Quantity must be a positive number.");
		const collection = userCollectionsCollection;
		const profiles = userProfilesCollection;
		try {
			const card = await collection.findOne({ userId: user.id, cardId });
			if (!card || card.quantity < qty) {
				const owned = card ? card.quantity : 0;
				return this.errorReply(`You do not have ${qty}x "${cardId}". You only have ${owned}.`);
			}
			const newQty = card.quantity - qty;
			const pts = card.totalPoints * qty;
			const senderUnique = newQty === 0 ? -1 : 0;
			if (newQty === 0) {
				await collection.deleteOne({ userId: user.id, cardId });
			} else {
				await collection.updateOne({ userId: user.id, cardId }, { $inc: { quantity: -qty } });
			}
			await profiles.updateOne(
				{ userId: user.id },
				{ $inc: { totalQuantity: -qty, collectionPoints: -pts, totalUniqueCards: senderUnique } }
			);
			const now = new Date().toISOString();
			const recCard = await collection.findOne({ userId: targetUserId, cardId });
			const currQty = recCard?.quantity || 0;
			const newQty2 = currQty + qty;
			const finalQty = Math.min(newQty2, MAX_CARD_QUANTITY);
			const excess = newQty2 - finalQty;
			const credits = excess * CREDITS_PER_DUPLICATE;
			const qtyAdded = finalQty - currQty;
			const ptsAdd = card.totalPoints * qtyAdded;
			const recUnique = (currQty === 0 && qtyAdded > 0) ? 1 : 0;
			if (qtyAdded > 0) {
				if (recCard) {
					await collection.updateOne(
						{ userId: targetUserId, cardId },
						{ $set: { quantity: finalQty, lastAcquiredAt: now } }
					);
				} else {
					const newDoc: TcgUser = { ...card, userId: targetUserId, quantity: finalQty, firstAcquiredAt: now, lastAcquiredAt: now };
					delete (newDoc as any)._id;
					await collection.insertOne(newDoc);
				}
			}
			if (qtyAdded > 0 || credits > 0) {
				const recProfile = await profiles.findOne({ userId: targetUserId });
				if (recProfile) {
					await profiles.updateOne(
						{ userId: targetUserId },
						{
							$inc: {
								totalQuantity: qtyAdded, collectionPoints: ptsAdd,
								totalUniqueCards: recUnique, credits: credits,
							},
							$set: { userName: recProfile.userName, lastUpdatedAt: now },
						}
					);
				} else {
					await profiles.insertOne({
						userId: targetUserId, userName: targetUserId, credits: credits,
						totalUniqueCards: recUnique, totalQuantity: qtyAdded,
						collectionPoints: ptsAdd, lastUpdatedAt: now,
					});
				}
			}
			let reply = `You successfully gifted ${qty}x "${card.name}" to ${targetUserId}.`;
			if (credits > 0) {
				reply += ` They received ${qtyAdded} card(s) and ${credits} credits (from duplicates).`;
			}
			this.sendReply(reply);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|${user.name} has given you ${qty} "${card.name}" card(s).`);
			}
		} catch {
			return this.errorReply('An error occurred while gifting your card.');
		}
	},
	async giftpack(target, room, user) {
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) {
			return this.errorReply("Please specify a user and set ID. Usage: /tcg giftpack [user], [setId], [quantity]");
		}
		const targetUserId = toID(parts[0]);
		const setId = parts[1].toLowerCase();
		const qty = parts[2] ? parseInt(parts[2]) : 1;
		if (!targetUserId) return this.errorReply("Please specify a user to gift to.");
		if (targetUserId === user.id) return this.errorReply("You cannot gift packs to yourself.");
		if (!setId) return this.errorReply("Please specify a pack set ID to gift.");
		if (isNaN(qty) || qty <= 0) return this.errorReply("Invalid quantity. Quantity must be a positive number.");
		const collection = userPacksCollection;
		try {
			const pack = await collection.findOne({ userId: user.id, setId });
			if (!pack || pack.quantity < qty) {
				const owned = pack ? pack.quantity : 0;
				return this.errorReply(`You do not have ${qty}x "${setId}" pack(s). You only have ${owned}.`);
			}
			const result = await collection.updateOne(
				{ userId: user.id, setId, quantity: { $gte: qty } },
				{ $inc: { quantity: -qty } }
			);
			if (result.modifiedCount === 0) {
				return this.errorReply(`You do not have ${qty}x "${setId}" pack(s). You only have ${pack.quantity}.`);
			}
			const now = new Date().toISOString();
			await collection.updateOne(
				{ userId: targetUserId, setId },
				{
					$inc: { quantity: qty },
					$set: { setName: pack.setName, setLogo: pack.setLogo, lastAcquiredAt: now },
					$setOnInsert: { userId: targetUserId, setId },
				},
				{ upsert: true }
			);
			this.sendReply(`You successfully gifted ${qty}x "${pack.setName}" pack(s) to ${targetUserId}.`);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|${user.name} has given you ${qty} "${pack.setName}" pack(s).`);
			}
		} catch {
			return this.errorReply('An error occurred while gifting your pack(s).');
		}
	},
	async giftcredits(target, room, user) {
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) {
			return this.errorReply("Please specify a user and an amount. Usage: /tcg giftcredits [user], [amount]");
		}
		const targetUserId = toID(parts[0]);
		const amt = parseInt(parts[1]);
		if (!targetUserId) return this.errorReply("Please specify a user to gift to.");
		if (targetUserId === user.id) return this.errorReply("You cannot gift credits to yourself.");
		if (isNaN(amt) || amt <= 0) return this.errorReply("Invalid amount. Amount must be a positive number.");
		const profiles = userProfilesCollection;
		let senderOk = false;
		try {
			const now = new Date().toISOString();
			const sResult = await profiles.updateOne(
				{ userId: user.id, credits: { $gte: amt } },
				{ $inc: { credits: -amt } }
			);
			if (sResult.modifiedCount === 0) {
				const sProfile = await profiles.findOne({ userId: user.id });
				const sCreds = sProfile?.credits || 0;
				throw new Error(`You do not have enough credits. You have ${sCreds.toLocaleString()}, but tried to send ${amt.toLocaleString()}.`);
			}
			senderOk = true;
			const recProfile = await profiles.findOne({ userId: targetUserId });
			if (recProfile) {
				await profiles.updateOne(
					{ userId: targetUserId },
					{ $inc: { credits: amt }, $set: { lastUpdatedAt: now } }
				);
			} else {
				await profiles.insertOne({
					userId: targetUserId, userName: targetUserId, credits: amt,
					collectionPoints: 0, totalQuantity: 0, totalUniqueCards: 0, lastUpdatedAt: now,
				});
			}
			this.sendReply(`You successfully gifted ${amt.toLocaleString()} credits to ${targetUserId}.`);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|${user.name} has given you ${amt.toLocaleString()} credit(s).`);
			}
		} catch {
			if (error.message.startsWith('You do not have enough credits')) {
				return this.errorReply(error.message);
			}
			if (senderOk) {
				await profiles.updateOne({ userId: user.id }, { $inc: { credits: amt } });
				return this.errorReply(`An error occurred while sending credits to the recipient. Your ${amt.toLocaleString()} credits have been refunded.`);
			}
			return this.errorReply('An unknown error occurred during the credit transfer.');
		}
	},
	economyhelp(target, room, user) {
		if (!this.runBroadcast()) return;
		const helpList = [
			{ cmd: "/tcg shop", desc: "View daily pack shop." },
			{ cmd: "/tcg buy [setId]", desc: "Buy a pack from shop." },
			{ cmd: "/tcg sell [cardId], [quantity]", desc: "Sell a card for credits." },
			{ cmd: "/tcg sellduplicates [all | setId]", desc: "Sell all duplicate cards for credits." },
			{ cmd: "/tcg giftcard [user], [cardId], [quantity]", desc: "Gift a card to another user." },
			{ cmd: "/tcg giftpack [user], [setId], [quantity]", desc: "Gift packs to another user." },
			{ cmd: "/tcg giftcredits [user], [amount]", desc: "Gift credits to another user." },
		];
		const html = `<center><strong>TCG Economy Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			helpList.map(({ cmd, desc }, i) =>
				`<li><b>${cmd}</b><br>${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(`<div style="max-height: 400px; overflow-y: auto;">${html}</div>`);
	},
};
