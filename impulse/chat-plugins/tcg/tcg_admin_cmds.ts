/*
* Pokemon Showdown
* TCG Admin Commands
* @author PrinceSky-Git
*/
import type { TcgUser, TcgUserProfile } from './interface';
import { getSet, initializeCache, getCacheStats,
	clearCache, clearShopCache, MAX_CARD_QUANTITY,
	CREDITS_PER_DUPLICATE } from './tcg_utils';
import { tcgCardsCollection, userCollectionsCollection,
	userProfilesCollection, userPacksCollection,
	cooldownsCollection } from './tcg_collections';

export const adminCommands: ChatCommands = {
	async awardcredits(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg awardcredits [user], [amount]");

		const targetUserId = toID(parts[0]);
		const amount = parseInt(parts[1]);

		if (!targetUserId) return this.errorReply("Please specify a user.");
		if (isNaN(amount) || amount <= 0) return this.errorReply("Invalid amount. Amount must be a positive number.");

		try {
			const now = new Date().toISOString();
			const profile = await userProfilesCollection.findOne({ userId: targetUserId });

			if (profile) {
				await userProfilesCollection.updateOne(
					{ userId: targetUserId },
					{ $inc: { credits: amount }, $set: { lastUpdatedAt: now } }
				);
			} else {
				await userProfilesCollection.insertOne({
					userId: targetUserId, userName: targetUserId, credits: amount,
					collectionPoints: 0, totalQuantity: 0, totalUniqueCards: 0, lastUpdatedAt: now,
				});
			}

			this.sendReply(`Successfully awarded ${amount.toLocaleString()} credits to ${targetUserId}.`);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|You have been awarded ${amount.toLocaleString()} TCG credits by ${user.name}.`);
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async awardpack(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg awardpack [user], [setId], [quantity]");

		const targetUserId = toID(parts[0]);
		const setId = parts[1].toLowerCase(); // <-- FIX: Normalize setId to lowercase
		const quantity = parts[2] ? parseInt(parts[2]) : 1;

		if (!targetUserId) return this.errorReply("Please specify a user.");
		if (!setId) return this.errorReply("Please specify a set ID.");
		if (isNaN(quantity) || quantity <= 0) return this.errorReply("Invalid quantity. Must be a positive number.");

		try {
			let setInfo = getSet(setId);
			if (!setInfo) setInfo = await tcgCardsCollection.findOne({ setId });
			if (!setInfo) return this.errorReply(`Set with ID "${setId}" not found.`);

			const setName = setInfo.set;
			const setLogo = setInfo.setImages?.logo || '';
			const now = new Date().toISOString();

			await userPacksCollection.updateOne(
				{ userId: targetUserId, setId },
				{
					$inc: { quantity },
					$set: { setName, setLogo, lastAcquiredAt: now },
					$setOnInsert: { userId: targetUserId, setId },
				},
				{ upsert: true }
			);

			this.sendReply(`Successfully awarded ${quantity}x "${setName}" pack(s) to ${targetUserId}.`);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|You have been awarded ${quantity} "${setName}" pack(s) by ${user.name}.`);
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async awardcard(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg awardcard [user], [cardId], [quantity]");

		const targetUserId = toID(parts[0]);
		const cardId = parts[1];
		const quantityToAward = parts[2] ? parseInt(parts[2]) : 1;

		if (!targetUserId) return this.errorReply("Please specify a user.");
		if (!cardId) return this.errorReply("Please specify a card ID.");
		if (isNaN(quantityToAward) || quantityToAward <= 0) return this.errorReply("Invalid quantity. Must be a positive number.");

		try {
			const card = await tcgCardsCollection.findOne({ cardId });
			if (!card) return this.errorReply(`Card with ID "${cardId}" not found in the database.`);

			const collection = userCollectionsCollection;
			const profiles = userProfilesCollection;
			const now = new Date().toISOString();

			const recipientCard = await collection.findOne({ userId: targetUserId, cardId });
			const currentRecipientQty = recipientCard?.quantity || 0;
			const newRecipientQty = currentRecipientQty + quantityToAward;
			const finalRecipientQty = Math.min(newRecipientQty, MAX_CARD_QUANTITY);
			const excess = newRecipientQty - finalRecipientQty;
			const creditsToAward = excess * CREDITS_PER_DUPLICATE;
			const actualQtyAdded = finalRecipientQty - currentRecipientQty;
			const pointsToAdd = card.totalPoints * actualQtyAdded;
			const uniqueCardsChangeRecipient = (currentRecipientQty === 0 && actualQtyAdded > 0) ? 1 : 0;

			if (actualQtyAdded > 0) {
				if (recipientCard) {
					await collection.updateOne(
						{ userId: targetUserId, cardId },
						{ $set: { quantity: finalRecipientQty, lastAcquiredAt: now } }
					);
				} else {
					const newDocData: TcgUser = {
						userId: targetUserId, cardId: card.cardId, quantity: finalRecipientQty,
						firstAcquiredAt: now, lastAcquiredAt: now, name: card.name,
						setId: card.setId, rarity: card.rarity, totalPoints: card.totalPoints,
						supertype: card.supertype, types: card.types || [], subtypes: card.subtypes || [],
						imageUrl: card.imageUrl || undefined, hp: card.hp || undefined,
						setSeries: card.setSeries || undefined, regulationMark: card.regulationMark || undefined,
					};
					if (!newDocData.imageUrl) delete newDocData.imageUrl;
					if (!newDocData.hp) delete newDocData.hp;
					if (!newDocData.setSeries) delete newDocData.setSeries;
					if (!newDocData.regulationMark) delete newDocData.regulationMark;
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
								totalUniqueCards: uniqueCardsChangeRecipient, credits: creditsToAward,
							},
							$set: { lastUpdatedAt: now },
						}
					);
				} else {
					await profiles.insertOne({
						userId: targetUserId, userName: targetUserId, credits: creditsToAward,
						totalQuantity: actualQtyAdded, collectionPoints: pointsToAdd,
						totalUniqueCards: uniqueCardsChangeRecipient, lastUpdatedAt: now,
					});
				}
			}

			let reply = `Successfully awarded ${quantityToAward}x "${card.name}" to ${targetUserId}.`;
			if (creditsToAward > 0) {
				reply += ` They received ${actualQtyAdded} card(s) and ${creditsToAward} credits (from duplicates).`;
			}
			this.sendReply(reply);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|You have been awarded ${quantityToAward} "${card.name}" card(s) by ${user.name}.`);
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async takecard(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg takecard [user], [cardId], [quantity]");

		const targetUserId = toID(parts[0]);
		const cardId = parts[1];
		const quantityToTake = parts[2] ? parseInt(parts[2]) : 1;

		if (!targetUserId) return this.errorReply("Please specify a user.");
		if (!cardId) return this.errorReply("Please specify a card ID.");
		if (isNaN(quantityToTake) || quantityToTake <= 0) return this.errorReply("Invalid quantity. Must be a positive number.");

		try {
			const collection = userCollectionsCollection;
			const profiles = userProfilesCollection;

			const userCard = await collection.findOne({ userId: targetUserId, cardId });
			if (!userCard || userCard.quantity === 0) return this.errorReply(`${targetUserId} does not own any "${cardId}" cards.`);
			if (userCard.quantity < quantityToTake) {
				return this.errorReply(`${targetUserId} only has ${userCard.quantity}x "${userCard.name}". Cannot take ${quantityToTake}.`);
			}

			const newQuantity = userCard.quantity - quantityToTake;
			const pointsToDeduct = userCard.totalPoints * quantityToTake;
			const uniqueCardsChange = newQuantity === 0 ? -1 : 0;
			const now = new Date().toISOString();

			if (newQuantity === 0) {
				await collection.deleteOne({ userId: targetUserId, cardId });
			} else {
				await collection.updateOne({ userId: targetUserId, cardId }, { $inc: { quantity: -quantityToTake } });
			}

			await profiles.updateOne(
				{ userId: targetUserId },
				{
					$inc: {
						totalQuantity: -quantityToTake,
						collectionPoints: -pointsToDeduct,
						totalUniqueCards: uniqueCardsChange,
					},
					$set: { lastUpdatedAt: now },
				}
			);

			this.sendReply(`Successfully took ${quantityToTake}x "${userCard.name}" from ${targetUserId}.`);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|${quantityToTake} "${userCard.name}" card(s) have been removed from your collection by ${user.name}.`);
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async takecredits(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg takecredits [user], [amount]");

		const targetUserId = toID(parts[0]);
		const amount = parseInt(parts[1]);

		if (!targetUserId) return this.errorReply("Please specify a user.");
		if (isNaN(amount) || amount <= 0) return this.errorReply("Invalid amount. Amount must be a positive number.");

		try {
			const now = new Date().toISOString();
			const profile = await userProfilesCollection.findOne({ userId: targetUserId });

			if (!profile) return this.errorReply(`${targetUserId} does not have a TCG profile.`);
			if (profile.credits < amount) {
				return this.errorReply(`${targetUserId} only has ${profile.credits} credits. Cannot take ${amount}.`);
			}

			await userProfilesCollection.updateOne(
				{ userId: targetUserId },
				{ $inc: { credits: -amount }, $set: { lastUpdatedAt: now } }
			);

			this.sendReply(`Successfully took ${amount.toLocaleString()} credits from ${targetUserId}.`);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|${amount.toLocaleString()} TCG credits have been removed from your account by ${user.name}.`);
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async takepack(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg takepack [user], [setId], [quantity]");

		const targetUserId = toID(parts[0]);
		const setId = parts[1].toLowerCase(); // <-- FIX: Normalize setId to lowercase
		const quantity = parts[2] ? parseInt(parts[2]) : 1;

		if (!targetUserId) return this.errorReply("Please specify a user.");
		if (!setId) return this.errorReply("Please specify a set ID.");
		if (isNaN(quantity) || quantity <= 0) return this.errorReply("Invalid quantity. Must be a positive number.");

		try {
			const userPack = await userPacksCollection.findOne({ userId: targetUserId, setId });
			if (!userPack || userPack.quantity === 0) {
				return this.errorReply(`${targetUserId} does not have any "${setId}" packs.`);
			}
			if (userPack.quantity < quantity) {
				return this.errorReply(`${targetUserId} only has ${userPack.quantity}x "${userPack.setName}" pack(s). Cannot take ${quantity}.`);
			}

			const newQuantity = userPack.quantity - quantity;
			if (newQuantity === 0) {
				await userPacksCollection.deleteOne({ userId: targetUserId, setId });
			} else {
				await userPacksCollection.updateOne(
					{ userId: targetUserId, setId },
					{ $inc: { quantity: -quantity } }
				);
			}

			this.sendReply(`Successfully took ${quantity}x "${userPack.setName}" pack(s) from ${targetUserId}.`);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|${quantity} "${userPack.setName}" pack(s) have been removed from your inventory by ${user.name}.`);
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async wipecollection(target, room, user) {
		this.checkCan('roomowner');
		const targetUserId = toID(target);
		if (!targetUserId) return this.errorReply("Usage: /tcg wipecollection [user]");

		try {
			await userCollectionsCollection.deleteMany({ userId: targetUserId });
			await userProfilesCollection.deleteOne({ userId: targetUserId });
			await userPacksCollection.deleteMany({ userId: targetUserId });
			await cooldownsCollection.deleteOne({ userId: targetUserId });

			this.sendReply(`Successfully wiped all TCG data for ${targetUserId}.`);
			const targetUser = Users.get(targetUserId);
			if (targetUser) {
				targetUser.popup(`|html|Your TCG collection and profile have been reset by ${user.name}.`);
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async refreshshop(target, room, user) {
		this.checkCan('roomowner');
		clearShopCache();
		this.sendReply('TCG shop cache cleared. It will refresh on the next /tcg shop command.');
		await this.parse('/tcg shop');
	},

	async resetdaily(target, room, user) {
		this.checkCan('roomowner');
		const targetId = toID(target);
		if (!targetId) return this.errorReply("Usage: /tcg resetdaily [user | all]");

		try {
			if (targetId === 'all') {
				await cooldownsCollection.deleteMany({});
				this.sendReply(`Successfully reset daily pack cooldown for ALL users.`);
			} else {
				const result = await cooldownsCollection.deleteOne({ userId: targetId });
				if (result.deletedCount === 0) return this.errorReply(`User ${targetId} had no cooldown to reset.`);
				this.sendReply(`Successfully reset daily pack cooldown for ${targetId}.`);
				const targetUser = Users.get(targetId);
				if (targetUser) {
					targetUser.popup(`|html|Your TCG daily pack cooldown has been reset by ${user.name}.`);
				}
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	recalculateallstats(target, room, user) {
		this.checkCan('roomowner');
		this.sendReply(
			`Starting stats recalculation for ALL users... ` +
			`This will take a long time and run in the background. ` +
			`You will be notified when it's complete.`
		);

		void (async () => {
			let processedCount = 0;
			const errorCount = 0;
			const startTime = Date.now();

			try {
				const cardCollection = tcgCardsCollection;
				const userCollection = userCollectionsCollection;
				const profileCollection = userProfilesCollection;

				// Get both setTotal and actual count for each set
				const setTotalsPipeline = [
					{ $group: { _id: "$setId", setTotal: { $first: "$setTotal" }, actualCount: { $sum: 1 } } },
					{ $project: { _id: 0, setId: "$_id", setTotal: { $ifNull: ["$setTotal", 0] }, actualCount: 1 } },
				];
				const allSets = await cardCollection.aggregate<{ setId: string, setTotal: number, actualCount: number }>(setTotalsPipeline);
				if (allSets.length === 0) {
					this.sendReply(`RECALCULATION FAILED: Could not fetch set totals.`);
					return;
				}
				const allSetsMap = new Map<string, number>();
				for (const set of allSets) {
					// Use actualCount for sets without setTotal (like Promo sets)
					const totalInSet = set.setTotal > 0 ? set.setTotal : set.actualCount;
					if (totalInSet > 0) allSetsMap.set(set.setId, totalInSet);
				}

				const allUserProfiles = await profileCollection.find({}, { projection: { userId: 1, userName: 1, credits: 1, favoriteCards: 1 } });
				const profileMap = new Map<string, Partial<TcgUserProfile>>();
				for (const profile of allUserProfiles) profileMap.set(profile.userId, profile);

				const allStatsPipeline: any[] = [
					{
						$group: {
							_id: { userId: "$userId", setId: "$setId" },
							uniqueCountInSet: { $sum: 1 },
							quantityInSet: { $sum: "$quantity" },
							pointsInSet: { $sum: { $multiply: ["$totalPoints", "$quantity"] } },
						},
					},
					{
						$group: {
							_id: "$_id.userId",
							totalUniqueCards: { $sum: "$uniqueCountInSet" },
							totalQuantity: { $sum: "$quantityInSet" },
							collectionPoints: { $sum: "$pointsInSet" },
							setProgress: {
								$push: { setId: "$_id.setId", uniqueCount: "$uniqueCountInSet" },
							},
						},
					},
				];
				const allUserStats = await userCollection.aggregate<any>(allStatsPipeline);

				const bulkOps: any[] = [];
				const now = new Date().toISOString();

				for (const userStats of allUserStats) {
					const targetUserId = userStats._id;
					const profile = profileMap.get(targetUserId) || {};

					let setsCompleted = 0;
					if (userStats.setProgress) {
						for (const set of userStats.setProgress) {
							const totalNeeded = allSetsMap.get(set.setId);
							if (totalNeeded && set.uniqueCount >= totalNeeded) setsCompleted++;
						}
					}

					bulkOps.push({
						updateOne: {
							filter: { userId: targetUserId },
							update: {
								$set: {
									userName: profile.userName || targetUserId,
									credits: profile.credits || 0,
									favoriteCards: profile.favoriteCards || [],
									totalUniqueCards: userStats.totalUniqueCards,
									totalQuantity: userStats.totalQuantity,
									collectionPoints: userStats.collectionPoints,
									totalSetsCompleted: setsCompleted,
									lastUpdatedAt: now,
								},
							},
							upsert: true,
						},
					});
					profileMap.delete(targetUserId);
				}

				for (const [targetUserId, profile] of profileMap.entries()) {
					bulkOps.push({
						updateOne: {
							filter: { userId: targetUserId },
							update: {
								$set: {
									userName: profile.userName || targetUserId,
									credits: profile.credits || 0,
									favoriteCards: profile.favoriteCards || [],
									totalUniqueCards: 0, totalQuantity: 0, collectionPoints: 0,
									totalSetsCompleted: 0, lastUpdatedAt: now,
								},
							},
							upsert: true,
						},
					});
				}

				if (bulkOps.length > 0) await profileCollection.bulkWrite(bulkOps, { ordered: false });
				processedCount = bulkOps.length;
				const duration = ((Date.now() - startTime) / 1000).toFixed(2);
				this.sendReply(
					`RECALCULATION COMPLETE: Processed ${processedCount} users with ${errorCount} errors in ${duration} seconds.`
				);
			} catch (err: any) {
				this.sendReply(`RECALCULATION FAILED: A critical error occurred: ${err.message}`);
			}
		})();
	},

	async loadcache(target, room, user) {
		// this.checkCan('roomowner');
		this.sendReply('Initializing TCG cache... This may take a moment.');
		try {
			const { cardCount, setCount } = await initializeCache();
			this.sendReply(`TCG cache initialization complete. Loaded ${cardCount} cards and ${setCount} sets.`);
		} catch {
			this.errorReply('An error occurred while initializing the TCG cache.');
		}
	},

	cachestats(target, room, user) {
		if (!this.runBroadcast()) return;
		// this.checkCan('roomowner');
		const stats = getCacheStats();
		let html = `<div class="infobox" style="padding: 15px;">`;
		html += `<strong style="font-size: 1.2em;">TCG Cache Statistics</strong><br />`;
		html += `<hr style="margin: 5px 0; border: none; border-top: 1px solid #ccc;">`;
		html += `<strong>Cache Status:</strong> ${stats.isInitialized ? '<span style="color: green;">Initialized</span>' : '<span style="color: red;">Empty</span>'}<br />`;
		html += `<strong>Cards Cached:</strong> ${stats.cardsCached}<br />`;
		html += `<strong>Sets Cached (for /tcg set):</strong> ${stats.setsCached}<br />`;
		html += `<strong>Sets in Pack Cache:</strong> ${stats.packCacheSets}<br />`;
		html += `<strong>Global Fallback Cards:</strong> ${stats.globalFallbackCards}<br />`;
		html += `</div>`;
		this.sendReply(`|html|${html}`);
	},

	clearcache(target, room, user) {
		this.checkCan('roomowner');
		const { cardsCleared, setsCleared } = clearCache();
		this.sendReply(`TCG caches cleared. Removed ${cardsCleared} cards and ${setsCleared} sets.`);
	},

	async createindexes(target, room, user) {
		this.checkCan('bypassall');
		this.sendReply("Attempting to create/recreate recommended indexes for TCG collections...");

		try {
			const userCollection = userCollectionsCollection;
			const profileCollection = userProfilesCollection;
			let createdCount = 0, failedCount = 0;
			const startTime = Date.now();

			const userIndexes = [
				{ spec: { userId: 1, cardId: 1 }, options: { name: 'userId_cardId_unique', unique: true } },
				{ spec: { userId: 1, setId: 1 }, options: { name: 'userId_setId' } },
				{ spec: { userId: 1, totalPoints: -1 }, options: { name: 'userId_totalPoints_desc' } },
			];

			const profileIndexes = [
				{ spec: { userId: 1 }, options: { name: 'userId_unique', unique: true } },
				{ spec: { collectionPoints: -1 }, options: { name: 'collectionPoints_desc' } },
				{ spec: { totalQuantity: -1 }, options: { name: 'totalQuantity_desc' } },
				{ spec: { totalUniqueCards: -1 }, options: { name: 'totalUniqueCards_desc' } },
				{ spec: { credits: -1 }, options: { name: 'credits_desc' } },
				{ spec: { totalSetsCompleted: -1 }, options: { name: 'totalSetsCompleted_desc' } },
			];

			this.sendReply(`Creating indexes for 'user_collections'...`);
			for (const index of userIndexes) {
				try {
					await userCollection.createIndex(index.spec, index.options);
					this.sendReply(`Created index: ${index.options.name}`);
					createdCount++;
				} catch (e) {
					this.errorReply(` Failed to create index ${index.options.name}: ${e.message}`);
					failedCount++;
				}
			}

			this.sendReply(`Creating indexes for 'user_profiles'...`);
			for (const index of profileIndexes) {
				try {
					await profileCollection.createIndex(index.spec, index.options);
					this.sendReply(`Created index: ${index.options.name}`);
					createdCount++;
				} catch (e) {
					this.errorReply(` Failed to create index ${index.options.name}: ${e.message}`);
					failedCount++;
				}
			}

			const duration = ((Date.now() - startTime) / 1000).toFixed(2);
			this.sendReply(`Index creation finished in ${duration}s. Created: ${createdCount}, Failed: ${failedCount}.`);
		} catch {
			return this.errorReply(`An unexpected error occurred during index creation: ${error.message}`);
		}
	},

	adminhelp(target, room, user) {
		if (!this.runBroadcast()) return;
		const helpList = [
			{ cmd: "/tcg awardcredits [user], [amount]", desc: "Grant credits to a user. Requires: &." },
			{ cmd: "/tcg awardpack [user], [setId], [quantity]", desc: "Grant pack(s) to a user. Requires: &." },
			{ cmd: "/tcg awardcard [user], [cardId], [quantity]", desc: "Grant card(s) to a user. Requires: &." },
			{ cmd: "/tcg takecard [user], [cardId], [quantity]", desc: "Remove card(s) from a user. Requires: &." },
			{ cmd: "/tcg takecredits [user], [amount]", desc: "Remove credits from a user. Requires: &." },
			{ cmd: "/tcg takepack [user], [setId], [quantity]", desc: "Remove pack(s) from a user. Requires: &." },
			{ cmd: "/tcg wipecollection [user]", desc: "Reset a user's entire TCG collection and profile. Requires: &." },
			{ cmd: "/tcg refreshshop", desc: "Force the daily TCG shop to load new packs. Requires: &." },
			{ cmd: "/tcg resetdaily [user | all]", desc: "Reset the daily pack cooldown for a user or all users. Requires: &." },
			{ cmd: "/tcg loadcache", desc: "Reloads the TCG card and set data into memory. Requires: &." },
			{ cmd: "/tcg cachestats", desc: "Shows statistics about the in-memory cache. Requires: &." },
			{ cmd: "/tcg clearcache", desc: "Clears all TCG data from the in-memory cache. Requires: &." },
			{ cmd: "/tcg recalculateallstats", desc: "Recalculates stats for ALL users. Requires: &." },
			{ cmd: "/tcg createindexes", desc: "Creates all important mongodb indexes for fast querying. Requires: &." },
		];
		const html = `<center><strong>TCG Admin Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			helpList.map(({ cmd, desc }, i) =>
				`<li><b>${cmd}</b><br>${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(`<div style="max-height: 400px; overflow-y: auto;">${html}</div>`);
	},
};
