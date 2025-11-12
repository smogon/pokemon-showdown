// TCG Admin Commands - @author PrinceSky-Git
import type { TcgUser, TcgUserProfile } from './interface';
import { getSet, initializeCache, getCacheStats, clearCache, clearShopCache, MAX_CARD_QUANTITY, CREDITS_PER_DUPLICATE } from './tcg_utils';
import { tcgCardsCollection, userCollectionsCollection, userProfilesCollection, userPacksCollection, cooldownsCollection } from './tcg_collections';

export const adminCommands: ChatCommands = {
	async awardcredits(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg awardcredits [user], [amount]");
		const uid = toID(parts[0]);
		const amt = parseInt(parts[1]);
		if (!uid) return this.errorReply("Specify a user.");
		if (isNaN(amt) || amt <= 0) return this.errorReply("Invalid amount. Must be positive.");
		try {
			const now = new Date().toISOString();
			const prof = await userProfilesCollection.findOne({ userId: uid });
			if (prof) {
				await userProfilesCollection.updateOne({ userId: uid }, { $inc: { credits: amt }, $set: { lastUpdatedAt: now } });
			} else {
				await userProfilesCollection.insertOne({
					userId: uid, userName: uid, credits: amt, collectionPoints: 0, totalQuantity: 0, totalUniqueCards: 0, lastUpdatedAt: now,
				});
			}
			this.sendReply(`Awarded ${amt.toLocaleString()} credits to ${uid}.`);
			const tu = Users.get(uid);
			if (tu) tu.popup(`|html|You have been awarded ${amt.toLocaleString()} TCG credits by ${user.name}.`);
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async awardpack(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg awardpack [user], [setId], [quantity]");
		const uid = toID(parts[0]);
		const sid = parts[1].toLowerCase();
		const qty = parts[2] ? parseInt(parts[2]) : 1;
		if (!uid) return this.errorReply("Specify a user.");
		if (!sid) return this.errorReply("Specify a set ID.");
		if (isNaN(qty) || qty <= 0) return this.errorReply("Invalid quantity. Must be positive.");
		try {
			let si = getSet(sid);
			if (!si) si = await tcgCardsCollection.findOne({ setId: sid });
			if (!si) return this.errorReply(`Set "${sid}" not found.`);
			const sn = si.set, sl = si.setImages?.logo || '', now = new Date().toISOString();
			await userPacksCollection.updateOne(
				{ userId: uid, setId: sid },
				{ $inc: { quantity: qty }, $set: { setName: sn, setLogo: sl, lastAcquiredAt: now }, $setOnInsert: { userId: uid, setId: sid } },
				{ upsert: true }
			);
			this.sendReply(`Awarded ${qty}x "${sn}" pack(s) to ${uid}.`);
			const tu = Users.get(uid);
			if (tu) tu.popup(`|html|You have been awarded ${qty} "${sn}" pack(s) by ${user.name}.`);
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async awardcard(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg awardcard [user], [cardId], [quantity]");
		const uid = toID(parts[0]);
		const cid = parts[1];
		const qty = parts[2] ? parseInt(parts[2]) : 1;
		if (!uid) return this.errorReply("Specify a user.");
		if (!cid) return this.errorReply("Specify a card ID.");
		if (isNaN(qty) || qty <= 0) return this.errorReply("Invalid quantity. Must be positive.");
		try {
			const card = await tcgCardsCollection.findOne({ cardId: cid });
			if (!card) return this.errorReply(`Card "${cid}" not found.`);
			const coll = userCollectionsCollection, profs = userProfilesCollection, now = new Date().toISOString();
			const rc = await coll.findOne({ userId: uid, cardId: cid });
			const curQty = rc?.quantity || 0;
			const newQty = curQty + qty;
			const finQty = Math.min(newQty, MAX_CARD_QUANTITY);
			const excess = newQty - finQty;
			const credAwd = excess * CREDITS_PER_DUPLICATE;
			const actQty = finQty - curQty;
			const pts = card.totalPoints * actQty;
			const uniqChg = (curQty === 0 && actQty > 0) ? 1 : 0;
			if (actQty > 0) {
				if (rc) {
					await coll.updateOne({ userId: uid, cardId: cid }, { $set: { quantity: finQty, lastAcquiredAt: now } });
				} else {
					const nd: TcgUser = {
						userId: uid, cardId: card.cardId, quantity: finQty, firstAcquiredAt: now, lastAcquiredAt: now,
						name: card.name, setId: card.setId, rarity: card.rarity, totalPoints: card.totalPoints,
						supertype: card.supertype, types: card.types || [], subtypes: card.subtypes || [],
						imageUrl: card.imageUrl || undefined, hp: card.hp || undefined,
						setSeries: card.setSeries || undefined, regulationMark: card.regulationMark || undefined,
					};
					if (!nd.imageUrl) delete nd.imageUrl;
					if (!nd.hp) delete nd.hp;
					if (!nd.setSeries) delete nd.setSeries;
					if (!nd.regulationMark) delete nd.regulationMark;
					await coll.insertOne(nd);
				}
			}
			let sc: number | undefined = undefined;
			if (actQty > 0) {
				const calcSc = (await import('./tcg_utils')).calculateSetsCompleted;
				sc = await calcSc(uid);
			}
			if (actQty > 0 || credAwd > 0) {
				const rp = await profs.findOne({ userId: uid });
				const upd: any = {
					$inc: { totalQuantity: actQty, collectionPoints: pts, totalUniqueCards: uniqChg, credits: credAwd },
					$set: { lastUpdatedAt: now },
				};
				if (sc !== undefined) upd.$set.totalSetsCompleted = sc;
				if (rp) {
					await profs.updateOne({ userId: uid }, upd);
				} else {
					const np: any = {
						userId: uid, userName: uid, credits: credAwd, totalQuantity: actQty, collectionPoints: pts,
						totalUniqueCards: uniqChg, lastUpdatedAt: now,
					};
					if (sc !== undefined) np.totalSetsCompleted = sc;
					await profs.insertOne(np);
				}
			}
			let rep = `Awarded ${qty}x "${card.name}" to ${uid}.`;
			if (credAwd > 0) rep += ` They received ${actQty} card(s) and ${credAwd} credits (duplicates).`;
			this.sendReply(rep);
			const tu = Users.get(uid);
			if (tu) tu.popup(`|html|You have been awarded ${qty} "${card.name}" card(s) by ${user.name}.`);
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async takecard(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg takecard [user], [cardId], [quantity]");
		const uid = toID(parts[0]);
		const cid = parts[1];
		const qty = parts[2] ? parseInt(parts[2]) : 1;
		if (!uid) return this.errorReply("Specify a user.");
		if (!cid) return this.errorReply("Specify a card ID.");
		if (isNaN(qty) || qty <= 0) return this.errorReply("Invalid quantity. Must be positive.");
		try {
			const coll = userCollectionsCollection, profs = userProfilesCollection;
			const uc = await coll.findOne({ userId: uid, cardId: cid });
			if (!uc || uc.quantity === 0) return this.errorReply(`${uid} does not own any "${cid}" cards.`);
			if (uc.quantity < qty) return this.errorReply(`${uid} only has ${uc.quantity}x "${uc.name}". Cannot take ${qty}.`);
			const newQty = uc.quantity - qty;
			const ptsDed = uc.totalPoints * qty;
			const uniqChg = newQty === 0 ? -1 : 0;
			const now = new Date().toISOString();
			if (newQty === 0) {
				await coll.deleteOne({ userId: uid, cardId: cid });
			} else {
				await coll.updateOne({ userId: uid, cardId: cid }, { $inc: { quantity: -qty } });
			}
			await profs.updateOne(
				{ userId: uid },
				{ $inc: { totalQuantity: -qty, collectionPoints: -ptsDed, totalUniqueCards: uniqChg }, $set: { lastUpdatedAt: now } }
			);
			this.sendReply(`Took ${qty}x "${uc.name}" from ${uid}.`);
			const tu = Users.get(uid);
			if (tu) tu.popup(`|html|${qty} "${uc.name}" card(s) removed from your collection by ${user.name}.`);
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async takecredits(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg takecredits [user], [amount]");
		const uid = toID(parts[0]);
		const amt = parseInt(parts[1]);
		if (!uid) return this.errorReply("Specify a user.");
		if (isNaN(amt) || amt <= 0) return this.errorReply("Invalid amount. Must be positive.");
		try {
			const now = new Date().toISOString();
			const prof = await userProfilesCollection.findOne({ userId: uid });
			if (!prof) return this.errorReply(`${uid} does not have a TCG profile.`);
			if (prof.credits < amt) return this.errorReply(`${uid} only has ${prof.credits} credits. Cannot take ${amt}.`);
			await userProfilesCollection.updateOne({ userId: uid }, { $inc: { credits: -amt }, $set: { lastUpdatedAt: now } });
			this.sendReply(`Took ${amt.toLocaleString()} credits from ${uid}.`);
			const tu = Users.get(uid);
			if (tu) tu.popup(`|html|${amt.toLocaleString()} TCG credits removed from your account by ${user.name}.`);
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async takepack(target, room, user) {
		this.checkCan('roomowner');
		const parts = target.split(',').map(p => p.trim());
		if (parts.length < 2) return this.errorReply("Usage: /tcg takepack [user], [setId], [quantity]");
		const uid = toID(parts[0]);
		const sid = parts[1].toLowerCase();
		const qty = parts[2] ? parseInt(parts[2]) : 1;
		if (!uid) return this.errorReply("Specify a user.");
		if (!sid) return this.errorReply("Specify a set ID.");
		if (isNaN(qty) || qty <= 0) return this.errorReply("Invalid quantity. Must be positive.");
		try {
			const up = await userPacksCollection.findOne({ userId: uid, setId: sid });
			if (!up || up.quantity === 0) return this.errorReply(`${uid} does not have any "${sid}" packs.`);
			if (up.quantity < qty) return this.errorReply(`${uid} only has ${up.quantity}x "${up.setName}" pack(s). Cannot take ${qty}.`);
			const newQty = up.quantity - qty;
			if (newQty === 0) {
				await userPacksCollection.deleteOne({ userId: uid, setId: sid });
			} else {
				await userPacksCollection.updateOne({ userId: uid, setId: sid }, { $inc: { quantity: -qty } });
			}
			this.sendReply(`Took ${qty}x "${up.setName}" pack(s) from ${uid}.`);
			const tu = Users.get(uid);
			if (tu) tu.popup(`|html|${qty} "${up.setName}" pack(s) removed from your inventory by ${user.name}.`);
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	async wipecollection(target, room, user) {
		this.checkCan('roomowner');
		const uid = toID(target);
		if (!uid) return this.errorReply("Usage: /tcg wipecollection [user]");
		try {
			await userCollectionsCollection.deleteMany({ userId: uid });
			await userProfilesCollection.deleteOne({ userId: uid });
			await userPacksCollection.deleteMany({ userId: uid });
			await cooldownsCollection.deleteOne({ userId: uid });
			this.sendReply(`Wiped all TCG data for ${uid}.`);
			const tu = Users.get(uid);
			if (tu) tu.popup(`|html|Your TCG collection and profile reset by ${user.name}.`);
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},
	async refreshshop(target, room, user) {
		this.checkCan('roomowner');
		clearShopCache();
		this.sendReply('TCG shop cache cleared. Will refresh on next /tcg shop.');
		await this.parse('/tcg shop');
	},
	async resetdaily(target, room, user) {
		this.checkCan('roomowner');
		const tid = toID(target);
		if (!tid) return this.errorReply("Usage: /tcg resetdaily [user | all]");
		try {
			if (tid === 'all') {
				await cooldownsCollection.deleteMany({});
				this.sendReply(`Reset daily pack cooldown for ALL users.`);
			} else {
				const res = await cooldownsCollection.deleteOne({ userId: tid });
				if (res.deletedCount === 0) return this.errorReply(`User ${tid} had no cooldown to reset.`);
				this.sendReply(`Reset daily pack cooldown for ${tid}.`);
				const tu = Users.get(tid);
				if (tu) tu.popup(`|html|Your TCG daily pack cooldown reset by ${user.name}.`);
			}
		} catch {
			return this.errorReply(`An error occurred: ${error.message}`);
		}
	},

	recalculateallstats(target, room, user) {
		this.checkCan('roomowner');
		this.sendReply(`Starting stats recalc for ALL users... Will run in background. You'll be notified when complete.`);
		void (async () => {
			let procCnt = 0;
			const errCnt = 0, st = Date.now();
			try {
				const cc = tcgCardsCollection, uc = userCollectionsCollection, pc = userProfilesCollection;
				const stp = [
					{ $group: { _id: "$setId", setTotal: { $first: "$setTotal" }, actualCount: { $sum: 1 } } },
					{ $project: { _id: 0, setId: "$_id", setTotal: { $ifNull: ["$setTotal", 0] }, actualCount: 1 } },
				];
				const as = await cc.aggregate<{ setId: string, setTotal: number, actualCount: number }>(stp);
				if (as.length === 0) {
					this.sendReply(`RECALC FAILED: Could not fetch set totals.`);
					return;
				}
				const asm = new Map<string, number>();
				for (const s of as) {
					const ti = s.setTotal > 0 ? s.setTotal : s.actualCount;
					if (ti > 0) asm.set(s.setId, ti);
				}
				const aup = await pc.find({}, { projection: { userId: 1, userName: 1, credits: 1, favoriteCards: 1 } });
				const pm = new Map<string, Partial<TcgUserProfile>>();
				for (const p of aup) pm.set(p.userId, p);
				const asp: any[] = [
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
							setProgress: { $push: { setId: "$_id.setId", uniqueCount: "$uniqueCountInSet" } },
						},
					},
				];
				const aus = await uc.aggregate<any>(asp);
				const bo: any[] = [], now = new Date().toISOString();
				for (const us of aus) {
					const uid = us._id, prof = pm.get(uid) || {};
					let sc = 0;
					if (us.setProgress) {
						for (const s of us.setProgress) {
							const tn = asm.get(s.setId);
							if (tn && s.uniqueCount >= tn) sc++;
						}
					}
					bo.push({
						updateOne: {
							filter: { userId: uid },
							update: {
								$set: {
									userName: prof.userName || uid, credits: prof.credits || 0,
									favoriteCards: prof.favoriteCards || [], totalUniqueCards: us.totalUniqueCards,
									totalQuantity: us.totalQuantity, collectionPoints: us.collectionPoints,
									totalSetsCompleted: sc, lastUpdatedAt: now,
								},
							},
							upsert: true,
						},
					});
					pm.delete(uid);
				}
				for (const [uid, prof] of pm.entries()) {
					bo.push({
						updateOne: {
							filter: { userId: uid },
							update: {
								$set: {
									userName: prof.userName || uid, credits: prof.credits || 0,
									favoriteCards: prof.favoriteCards || [], totalUniqueCards: 0, totalQuantity: 0,
									collectionPoints: 0, totalSetsCompleted: 0, lastUpdatedAt: now,
								},
							},
							upsert: true,
						},
					});
				}
				if (bo.length > 0) await pc.bulkWrite(bo, { ordered: false });
				procCnt = bo.length;
				const dur = ((Date.now() - st) / 1000).toFixed(2);
				this.sendReply(`RECALC COMPLETE: Processed ${procCnt} users with ${errCnt} errors in ${dur}s.`);
			} catch (err: any) {
				this.sendReply(`RECALC FAILED: ${err.message}`);
			}
		})();
	},

	async loadcache(target, room, user) {
		this.sendReply('Initializing TCG cache...');
		try {
			const { cardCount, setCount } = await initializeCache();
			this.sendReply(`Cache init complete. Loaded ${cardCount} cards and ${setCount} sets.`);
		} catch {
			this.errorReply('Error initializing TCG cache.');
		}
	},
	cachestats(target, room, user) {
		if (!this.runBroadcast()) return;
		const st = getCacheStats();
		let h = `<div class="infobox" style="padding:15px;"><strong style="font-size:1.2em;">TCG Cache Stats</strong><br/>`;
		h += `<hr style="margin:5px 0;border:none;border-top:1px solid #ccc;">`;
		h += `<strong>Status:</strong> ${st.isInitialized ? '<span style="color:green;">Initialized</span>' : '<span style="color:red;">Empty</span>'}<br/>`;
		h += `<strong>Cards:</strong> ${st.cardsCached}<br/><strong>Sets:</strong> ${st.setsCached}<br/>`;
		h += `<strong>Pack Cache Sets:</strong> ${st.packCacheSets}<br/><strong>Fallback Cards:</strong> ${st.globalFallbackCards}<br/></div>`;
		this.sendReply(`|html|${h}`);
	},
	clearcache(target, room, user) {
		this.checkCan('roomowner');
		const { cardsCleared, setsCleared } = clearCache();
		this.sendReply(`TCG caches cleared. Removed ${cardsCleared} cards and ${setsCleared} sets.`);
	},

	async createindexes(target, room, user) {
		this.checkCan('bypassall');
		this.sendReply("Creating/recreating indexes for TCG collections...");
		try {
			const uc = userCollectionsCollection, pc = userProfilesCollection;
			let cCnt = 0, fCnt = 0;
			const st = Date.now();
			const ui = [
				{ spec: { userId: 1, cardId: 1 }, options: { name: 'userId_cardId_unique', unique: true } },
				{ spec: { userId: 1, setId: 1 }, options: { name: 'userId_setId' } },
				{ spec: { userId: 1, totalPoints: -1 }, options: { name: 'userId_totalPoints_desc' } },
			];
			const pi = [
				{ spec: { userId: 1 }, options: { name: 'userId_unique', unique: true } },
				{ spec: { collectionPoints: -1 }, options: { name: 'collectionPoints_desc' } },
				{ spec: { totalQuantity: -1 }, options: { name: 'totalQuantity_desc' } },
				{ spec: { totalUniqueCards: -1 }, options: { name: 'totalUniqueCards_desc' } },
				{ spec: { credits: -1 }, options: { name: 'credits_desc' } },
				{ spec: { totalSetsCompleted: -1 }, options: { name: 'totalSetsCompleted_desc' } },
			];
			this.sendReply(`Creating indexes for 'user_collections'...`);
			for (const idx of ui) {
				try {
					await uc.createIndex(idx.spec, idx.options);
					this.sendReply(`Created: ${idx.options.name}`);
					cCnt++;
				} catch (e) {
					this.errorReply(`Failed: ${idx.options.name}: ${e.message}`);
					fCnt++;
				}
			}
			this.sendReply(`Creating indexes for 'user_profiles'...`);
			for (const idx of pi) {
				try {
					await pc.createIndex(idx.spec, idx.options);
					this.sendReply(`Created: ${idx.options.name}`);
					cCnt++;
				} catch (e) {
					this.errorReply(`Failed: ${idx.options.name}: ${e.message}`);
					fCnt++;
				}
			}
			const dur = ((Date.now() - st) / 1000).toFixed(2);
			this.sendReply(`Index creation finished in ${dur}s. Created: ${cCnt}, Failed: ${fCnt}.`);
		} catch {
			return this.errorReply(`Unexpected error during index creation: ${error.message}`);
		}
	},

	adminhelp(target, room, user) {
		if (!this.runBroadcast()) return;
		const hl = [
			{ cmd: "/tcg awardcredits [user], [amount]", desc: "Grant credits. Requires: &." },
			{ cmd: "/tcg awardpack [user], [setId], [quantity]", desc: "Grant pack(s). Requires: &." },
			{ cmd: "/tcg awardcard [user], [cardId], [quantity]", desc: "Grant card(s). Requires: &." },
			{ cmd: "/tcg takecard [user], [cardId], [quantity]", desc: "Remove card(s). Requires: &." },
			{ cmd: "/tcg takecredits [user], [amount]", desc: "Remove credits. Requires: &." },
			{ cmd: "/tcg takepack [user], [setId], [quantity]", desc: "Remove pack(s). Requires: &." },
			{ cmd: "/tcg wipecollection [user]", desc: "Reset user's TCG data. Requires: &." },
			{ cmd: "/tcg refreshshop", desc: "Force shop to reload. Requires: &." },
			{ cmd: "/tcg resetdaily [user | all]", desc: "Reset daily pack cooldown. Requires: &." },
			{ cmd: "/tcg loadcache", desc: "Reload TCG cache. Requires: &." },
			{ cmd: "/tcg cachestats", desc: "Show cache stats. Requires: &." },
			{ cmd: "/tcg clearcache", desc: "Clear TCG cache. Requires: &." },
			{ cmd: "/tcg recalculateallstats", desc: "Recalc stats for ALL users. Requires: &." },
			{ cmd: "/tcg createindexes", desc: "Create DB indexes. Requires: &." },
		];
		const h = `<center><strong>TCG Admin Commands</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			hl.map(({ cmd, desc }, i) => `<li><b>${cmd}</b><br>${desc}</li>${i < hl.length - 1 ? '<hr>' : ''}`).join('') + `</ul>`;
		this.sendReplyBox(`<div style="max-height:400px;overflow-y:auto;">${h}</div>`);
	},
};
