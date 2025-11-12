// TCG Trade Commands by PrinceSky-Git
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

function getTradeKey(u1: string, u2: string): string {
	return [u1, u2].sort().join(':');
}
function getUserTrade(uid: string): { trade: ActiveTrade, key: string } | null {
	for (const [k, t] of activeTrades.entries()) {
		if (t.initiator === uid || t.recipient === uid) return { trade: t, key: k };
	}
	return null;
}
function cleanupExpiredTrades() {
	const now = Date.now();
	for (const [k, t] of activeTrades.entries()) {
		if (now - t.createdAt > TRADE_TIMEOUT) activeTrades.delete(k);
	}
}
setInterval(cleanupExpiredTrades, 60 * 1000);

export const tradeCommands: ChatCommands = {
	async trade(target, room, user) {
		const tid = toID(target);
		if (!tid) return this.errorReply("Usage: /tcg trade [user]");
		if (tid === user.id) return this.errorReply("Cannot trade with yourself.");
		const tgt = Users.get(tid);
		if (!tgt) return this.errorReply(`User "${target}" is not online.`);
		try {
			const [up, tp] = await Promise.all([
				userProfilesCollection.findOne({ userId: user.id }),
				userProfilesCollection.findOne({ userId: tid }),
			]);
			if (up?.tradesEnabled === false) return this.errorReply("You have disabled trades. Use /tcg tradeenable to enable.");
			if (tp?.tradesEnabled === false) return this.errorReply(`${tgt.name} has disabled trades.`);
		} catch {
			return this.errorReply('Error checking trade settings.');
		}
		if (getUserTrade(user.id)) return this.errorReply("You already have an active trade. Use /tcg tradecancel first.");
		if (getUserTrade(tid)) return this.errorReply(`${tgt.name} is already in an active trade.`);
		activeTrades.set(getTradeKey(user.id, tid), {
			initiator: user.id,
			recipient: tid,
			initiatorOffer: { cards: new Map(), credits: 0 },
			recipientOffer: { cards: new Map(), credits: 0 },
			initiatorReady: false,
			recipientReady: false,
			createdAt: Date.now(),
		});
		this.sendReply(`Trade initiated with ${tgt.name}. Use /tcg tradeadd to add items.`);
		tgt.popup(`|html|${user.name} wants to trade! Use <code>/tcg tradeadd [cardId], [quantity]</code> or <code>/tcg tradeaddcredits [amount]</code> to add items, then <code>/tcg tradeaccept</code> to accept.`);
	},

	async tradedisable(target, room, user) {
		try {
			await userProfilesCollection.updateOne(
				{ userId: user.id },
				{ $set: { tradesEnabled: false, lastUpdatedAt: new Date().toISOString() } },
				{ upsert: true }
			);
			this.sendReply("Trades disabled. Use /tcg tradeenable to re-enable.");
		} catch {
			return this.errorReply("Error disabling trades.");
		}
	},
	async tradeenable(target, room, user) {
		try {
			await userProfilesCollection.updateOne(
				{ userId: user.id },
				{ $set: { tradesEnabled: true, lastUpdatedAt: new Date().toISOString() } },
				{ upsert: true }
			);
			this.sendReply("Trades enabled. Users can now trade with you.");
		} catch {
			return this.errorReply("Error enabling trades.");
		}
	},

	async tradeadd(target, room, user) {
		const et = getUserTrade(user.id);
		if (!et) return this.errorReply("No active trade. Use /tcg trade [user] to start.");
		const { trade } = et;
		const parts = target.split(',').map(p => p.trim());
		if (!parts[0]) return this.errorReply("Usage: /tcg tradeadd [cardId], [quantity]");
		const cid = parts[0];
		const qty = parts[1] ? parseInt(parts[1]) : 1;
		if (isNaN(qty) || qty <= 0) return this.errorReply("Invalid quantity. Must be positive.");
		try {
			const uc = await userCollectionsCollection.findOne({ userId: user.id, cardId: cid });
			if (!uc || uc.quantity === 0) return this.errorReply(`You do not own any "${cid}" cards.`);
			const isInit = trade.initiator === user.id;
			const myOffer = isInit ? trade.initiatorOffer : trade.recipientOffer;
			const curr = myOffer.cards.get(cid) || 0;
			const tot = curr + qty;
			if (tot > uc.quantity) return this.errorReply(`You only have ${uc.quantity}x "${uc.name}". Cannot offer ${tot}.`);
			myOffer.cards.set(cid, tot);
			trade.initiatorReady = false;
			trade.recipientReady = false;
			this.sendReply(`Added ${qty}x "${uc.name}" to trade offer. Total: ${tot}x`);
			const oid = isInit ? trade.recipient : trade.initiator;
			const ou = Users.get(oid);
			if (ou) ou.popup(`|html|${user.name} added ${qty}x "${uc.name}" to their offer.`);
		} catch {
			return this.errorReply(`Error: ${error.message}`);
		}
	},

	async traderemove(target, room, user) {
		const et = getUserTrade(user.id);
		if (!et) return this.errorReply("No active trade.");
		const { trade } = et;
		const parts = target.split(',').map(p => p.trim());
		if (!parts[0]) return this.errorReply("Usage: /tcg traderemove [cardId], [quantity]");
		const cid = parts[0];
		const qty = parts[1] ? parseInt(parts[1]) : 1;
		if (isNaN(qty) || qty <= 0) return this.errorReply("Invalid quantity. Must be positive.");
		try {
			const isInit = trade.initiator === user.id;
			const myOffer = isInit ? trade.initiatorOffer : trade.recipientOffer;
			const curr = myOffer.cards.get(cid) || 0;
			if (curr === 0) return this.errorReply(`You have not offered any "${cid}" cards.`);
			const newQty = curr - qty;
			if (newQty <= 0) {
				myOffer.cards.delete(cid);
				this.sendReply(`Removed all "${cid}" cards from offer.`);
			} else {
				myOffer.cards.set(cid, newQty);
				this.sendReply(`Removed ${qty}x "${cid}" from offer. Remaining: ${newQty}x`);
			}
			trade.initiatorReady = false;
			trade.recipientReady = false;
			const c = getCard(cid) || await tcgCardsCollection.findOne({ cardId: cid });
			const cn = c?.name || cid;
			const oid = isInit ? trade.recipient : trade.initiator;
			const ou = Users.get(oid);
			if (ou) ou.popup(`|html|${user.name} removed ${qty}x "${cn}" from their offer.`);
		} catch {
			return this.errorReply(`Error: ${error.message}`);
		}
	},

	async tradeaddcredits(target, room, user) {
		const et = getUserTrade(user.id);
		if (!et) return this.errorReply("No active trade. Use /tcg trade [user] to start.");
		const { trade } = et;
		const amt = parseInt(target.trim());
		if (isNaN(amt) || amt <= 0) return this.errorReply("Invalid amount. Must be positive.");
		try {
			const prof = await userProfilesCollection.findOne({ userId: user.id });
			const creds = prof?.credits || 0;
			if (amt > creds) return this.errorReply(`You only have ${creds} credits. Cannot offer ${amt}.`);
			const isInit = trade.initiator === user.id;
			const myOffer = isInit ? trade.initiatorOffer : trade.recipientOffer;
			myOffer.credits = amt;
			trade.initiatorReady = false;
			trade.recipientReady = false;
			this.sendReply(`Added ${amt.toLocaleString()} credits to trade offer.`);
			const oid = isInit ? trade.recipient : trade.initiator;
			const ou = Users.get(oid);
			if (ou) ou.popup(`|html|${user.name} added ${amt.toLocaleString()} credits to their offer.`);
		} catch {
			return this.errorReply(`Error: ${error.message}`);
		}
	},

	async tradeview(target, room, user) {
		const et = getUserTrade(user.id);
		if (!et) return this.errorReply("No active trade.");
		const { trade } = et;
		const isInit = trade.initiator === user.id;
		const myOffer = isInit ? trade.initiatorOffer : trade.recipientOffer;
		const theirOffer = isInit ? trade.recipientOffer : trade.initiatorOffer;
		const oid = isInit ? trade.recipient : trade.initiator;
		const ou = Users.get(oid);
		const on = ou?.name || oid;
		let h = `<div class="infobox" style="padding:15px"><strong style="font-size:1.3em">Trade with ${on}</strong><br><hr>`;
		h += `<div style="margin:10px 0"><strong style="font-size:1.1em">Your Offer:</strong><br>`;
		if (myOffer.cards.size === 0 && myOffer.credits === 0) {
			h += `<em>Nothing offered yet</em>`;
		} else {
			if (myOffer.cards.size > 0) {
				h += `<strong>Cards:</strong><br>`;
				for (const [cid, qty] of myOffer.cards.entries()) {
					const c = getCard(cid) || await tcgCardsCollection.findOne({ cardId: cid });
					const cn = c?.name || cid;
					h += `- ${qty}x ${cn} [${cid}]<br>`;
				}
			}
			if (myOffer.credits > 0) h += `<strong>Credits:</strong> ${myOffer.credits.toLocaleString()}<br>`;
		}
		h += `</div><hr><div style="margin:10px 0"><strong style="font-size:1.1em">${on}'s Offer:</strong><br>`;
		if (theirOffer.cards.size === 0 && theirOffer.credits === 0) {
			h += `<em>Nothing offered yet</em>`;
		} else {
			if (theirOffer.cards.size > 0) {
				h += `<strong>Cards:</strong><br>`;
				for (const [cid, qty] of theirOffer.cards.entries()) {
					const c = getCard(cid) || await tcgCardsCollection.findOne({ cardId: cid });
					const cn = c?.name || cid;
					h += `- ${qty}x ${cn} [${cid}]<br>`;
				}
			}
			if (theirOffer.credits > 0) h += `<strong>Credits:</strong> ${theirOffer.credits.toLocaleString()}<br>`;
		}
		h += `</div><hr><div style="margin:10px 0"><strong>Status:</strong><br>`;
		h += `${user.name}: ${trade.initiatorReady && isInit || trade.recipientReady && !isInit ? '<span style="color:green">Ready ✓</span>' : '<span style="color:orange">Not Ready</span>'}<br>`;
		h += `${on}: ${trade.initiatorReady && !isInit || trade.recipientReady && isInit ? '<span style="color:green">Ready ✓</span>' : '<span style="color:orange">Not Ready</span>'}`;
		h += `</div></div>`;
		this.sendReply(`|html|${h}`);
	},

	async tradeaccept(target, room, user) {
		const et = getUserTrade(user.id);
		if (!et) return this.errorReply("No active trade.");
		const { trade, key } = et;
		const isInit = trade.initiator === user.id;
		if (isInit) trade.initiatorReady = true;
		else trade.recipientReady = true;
		const oid = isInit ? trade.recipient : trade.initiator;
		const ou = Users.get(oid);
		if (trade.initiatorReady && trade.recipientReady) {
			try {
				const now = new Date().toISOString();
				const coll = userCollectionsCollection;
				const profs = userProfilesCollection;
				for (const [cid, qty] of trade.initiatorOffer.cards.entries()) {
					const c = await coll.findOne({ userId: trade.initiator, cardId: cid });
					if (!c || c.quantity < qty) {
						activeTrades.delete(key);
						this.sendReply(`Trade cancelled: ${trade.initiator} no longer has enough ${cid}.`);
						if (ou) ou.popup(`|html|Trade cancelled: ${user.name} no longer has enough cards.`);
						return;
					}
				}
				for (const [cid, qty] of trade.recipientOffer.cards.entries()) {
					const c = await coll.findOne({ userId: trade.recipient, cardId: cid });
					if (!c || c.quantity < qty) {
						activeTrades.delete(key);
						this.sendReply(`Trade cancelled: ${trade.recipient} no longer has enough ${cid}.`);
						if (ou) ou.popup(`|html|Trade cancelled: They no longer have enough cards.`);
						return;
					}
				}
				const [iprof, rprof] = await Promise.all([
					profs.findOne({ userId: trade.initiator }),
					profs.findOne({ userId: trade.recipient }),
				]);
				if ((iprof?.credits || 0) < trade.initiatorOffer.credits) {
					activeTrades.delete(key);
					this.sendReply(`Trade cancelled: Insufficient credits.`);
					if (ou) ou.popup(`|html|Trade cancelled: ${user.name} has insufficient credits.`);
					return;
				}
				if ((rprof?.credits || 0) < trade.recipientOffer.credits) {
					activeTrades.delete(key);
					this.sendReply(`Trade cancelled: Insufficient credits.`);
					if (ou) ou.popup(`|html|Trade cancelled: They have insufficient credits.`);
					return;
				}

				for (const [cid, qty] of trade.initiatorOffer.cards.entries()) {
					const c = await coll.findOne({ userId: trade.initiator, cardId: cid });
					if (!c) continue;
					const newQ = c.quantity - qty;
					if (newQ === 0) await coll.deleteOne({ userId: trade.initiator, cardId: cid });
					else await coll.updateOne({ userId: trade.initiator, cardId: cid }, { $inc: { quantity: -qty } });
					await profs.updateOne(
						{ userId: trade.initiator },
						{ $inc: { totalQuantity: -qty, collectionPoints: -(c.totalPoints * qty), totalUniqueCards: newQ === 0 ? -1 : 0 }, $set: { lastUpdatedAt: now } }
					);
					const rc = await coll.findOne({ userId: trade.recipient, cardId: cid });
					const currQ = rc?.quantity || 0;
					const newRQ = currQ + qty;
					const finalQ = Math.min(newRQ, MAX_CARD_QUANTITY);
					const excess = newRQ - finalQ;
					const credAward = excess * CREDITS_PER_DUPLICATE;
					const actAdded = finalQ - currQ;
					if (actAdded > 0) {
						if (rc) {
							await coll.updateOne({ userId: trade.recipient, cardId: cid }, { $set: { quantity: finalQ, lastAcquiredAt: now } });
						} else {
							const newDoc: TcgUser = { ...c, userId: trade.recipient, quantity: finalQ, firstAcquiredAt: now, lastAcquiredAt: now };
							delete (newDoc as any)._id;
							await coll.insertOne(newDoc);
						}
						await profs.updateOne(
							{ userId: trade.recipient },
							{ $inc: { totalQuantity: actAdded, collectionPoints: c.totalPoints * actAdded, totalUniqueCards: currQ === 0 ? 1 : 0, credits: credAward }, $set: { lastUpdatedAt: now } },
							{ upsert: true }
						);
					}
				}

				for (const [cid, qty] of trade.recipientOffer.cards.entries()) {
					const c = await coll.findOne({ userId: trade.recipient, cardId: cid });
					if (!c) continue;
					const newQ = c.quantity - qty;
					if (newQ === 0) await coll.deleteOne({ userId: trade.recipient, cardId: cid });
					else await coll.updateOne({ userId: trade.recipient, cardId: cid }, { $inc: { quantity: -qty } });
					await profs.updateOne(
						{ userId: trade.recipient },
						{ $inc: { totalQuantity: -qty, collectionPoints: -(c.totalPoints * qty), totalUniqueCards: newQ === 0 ? -1 : 0 }, $set: { lastUpdatedAt: now } }
					);
					const ic = await coll.findOne({ userId: trade.initiator, cardId: cid });
					const currQ = ic?.quantity || 0;
					const newIQ = currQ + qty;
					const finalQ = Math.min(newIQ, MAX_CARD_QUANTITY);
					const excess = newIQ - finalQ;
					const credAward = excess * CREDITS_PER_DUPLICATE;
					const actAdded = finalQ - currQ;
					if (actAdded > 0) {
						if (ic) {
							await coll.updateOne({ userId: trade.initiator, cardId: cid }, { $set: { quantity: finalQ, lastAcquiredAt: now } });
						} else {
							const newDoc: TcgUser = { ...c, userId: trade.initiator, quantity: finalQ, firstAcquiredAt: now, lastAcquiredAt: now };
							delete (newDoc as any)._id;
							await coll.insertOne(newDoc);
						}
						await profs.updateOne(
							{ userId: trade.initiator },
							{ $inc: { totalQuantity: actAdded, collectionPoints: c.totalPoints * actAdded, totalUniqueCards: currQ === 0 ? 1 : 0, credits: credAward }, $set: { lastUpdatedAt: now } },
							{ upsert: true }
						);
					}
				}

				if (trade.initiatorOffer.credits > 0) {
					await profs.updateOne({ userId: trade.initiator }, { $inc: { credits: -trade.initiatorOffer.credits } });
					await profs.updateOne({ userId: trade.recipient }, { $inc: { credits: trade.initiatorOffer.credits } }, { upsert: true });
				}
				if (trade.recipientOffer.credits > 0) {
					await profs.updateOne({ userId: trade.recipient }, { $inc: { credits: -trade.recipientOffer.credits } });
					await profs.updateOne({ userId: trade.initiator }, { $inc: { credits: trade.recipientOffer.credits } }, { upsert: true });
				}
				await profs.updateOne({ userId: trade.initiator }, { $inc: { totalTrades: 1 } }, { upsert: true });
				await profs.updateOne({ userId: trade.recipient }, { $inc: { totalTrades: 1 } }, { upsert: true });
				activeTrades.delete(key);
				this.sendReply(`Trade completed successfully!`);
				if (ou) ou.popup(`|html|Trade with ${user.name} completed successfully!`);
			} catch {
				activeTrades.delete(key);
				this.errorReply(`Error during trade: ${error.message}`);
				if (ou) ou.popup(`|html|Trade failed due to an error.`);
			}
		} else {
			this.sendReply(`You are ready. Waiting for ${ou?.name || oid} to accept.`);
			if (ou) ou.popup(`|html|${user.name} is ready! Use <code>/tcg tradeview</code> to review and <code>/tcg tradeaccept</code> to accept.`);
		}
	},

	tradecancel(target, room, user) {
		const et = getUserTrade(user.id);
		if (!et) return this.errorReply("No active trade.");
		const { trade, key } = et;
		const isInit = trade.initiator === user.id;
		const oid = isInit ? trade.recipient : trade.initiator;
		const ou = Users.get(oid);
		activeTrades.delete(key);
		this.sendReply("Trade cancelled.");
		if (ou) ou.popup(`|html|${user.name} cancelled the trade.`);
	},
	tradehelp(target, room, user) {
		if (!this.runBroadcast()) return;
		const helpList = [
			{ cmd: "/tcg trade [user]", desc: "Initiate a trade with another user." },
			{ cmd: "/tcg tradeadd [cardId], [quantity]", desc: "Add cards to your trade offer." },
			{ cmd: "/tcg traderemove [cardId], [quantity]", desc: "Remove cards from your trade offer." },
			{ cmd: "/tcg tradeaddcredits [amount]", desc: "Add credits to your trade offer." },
			{ cmd: "/tcg tradeview", desc: "View trade details and status." },
			{ cmd: "/tcg tradeaccept", desc: "Accept trade. Both must accept to complete." },
			{ cmd: "/tcg tradecancel", desc: "Cancel the active trade." },
			{ cmd: "/tcg tradedisable", desc: "Disable incoming trade requests." },
			{ cmd: "/tcg tradeenable", desc: "Enable incoming trade requests." },
		];
		const html = `<center><strong>TCG Trading Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0">` +
			helpList.map(({ cmd, desc }, i) =>
				`<li><b>${cmd}</b><br>${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') + `</ul>`;
		this.sendReplyBox(`<div style="max-height:400px;overflow-y:auto">${html}</div>`);
	},
};
