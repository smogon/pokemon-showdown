/*
* Pokemon Showdown - Clans War Commands
* @author PrinceSky-Git
*/
import { Clans, UserClans, ClanWars, type ClanWarDoc, ClanBattleLogs } from './database';
import type { ClanWar } from './interface';
import { generateThemedTable } from '../../utils';
import { calculateElo, to, logClanActivity, hasClanPermission, generateWarCard } from './utils';

const LOBBY = 'clanwarlogs' as RoomID;

export const warCommands: Chat.ChatCommands = {
	async challenge(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");
		const uci = await UserClans.findOne({ _id: user.id });
		const cid = uci?.memberOf;
		if (!cid) return this.errorReply("You are not in a clan.");
		const mc = await Clans.findOne({ _id: cid });
		if (!mc) return this.errorReply("Your clan was not found.");
		if (!hasClanPermission(mc, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to challenge other clans.");
		}
		const [tcid, bos] = target.split(',').map(s => s.trim());
		const bo = parseInt(bos);
		if (!tcid) return this.errorReply("Specify a clan ID to challenge.");
		if (!bo) return this.errorReply("You must specify a 'Best of' number. Usage: /clan war challenge [clanid], [number]");
		if (bo < 1 || bo % 2 === 0) return this.errorReply("'Best of' must be an odd number (3, 5, 7, etc.).");
		if (bo > 101) return this.errorReply("'Best of' cannot be higher than 101.");
		const tc = await Clans.findOne({ _id: toID(tcid) });
		if (!tc) return this.errorReply(`Clan '${tcid}' not found.`);
		if (toID(tcid) === cid) return this.errorReply("You cannot challenge your own clan.");
		const lc = mc.stats.lastWarChallenge || 0;
		const cd = 24 * 60 * 60 * 1000;
		const ts = Date.now() - lc;
		if (ts < cd) {
			const hr = Math.ceil((cd - ts) / (60 * 60 * 1000));
			return this.errorReply(`Your clan must wait ${hr} more hour(s) before challenging another clan. (24 hour cooldown)`);
		}
		const [mew, tew] = await Promise.all([
			ClanWars.findOne({ clans: cid, status: { $in: ['pending', 'active'] } }),
			ClanWars.findOne({ clans: toID(tcid), status: { $in: ['pending', 'active'] } }),
		]);
		if (mew) {
			const oid = mew.clans[0] === cid ? mew.clans[1] : mew.clans[0];
			const o = await Clans.findOne({ _id: oid });
			return this.errorReply(`Your clan is already in a ${mew.status} war with ${o?.name || oid}.`);
		}
		if (tew) {
			const oid = tew.clans[0] === toID(tcid) ? tew.clans[1] : tew.clans[0];
			const o = await Clans.findOne({ _id: oid });
			return this.errorReply(`${tc.name} is already in a ${tew.status} war with ${o?.name || oid}.`);
		}
		await Clans.updateOne({ _id: cid }, { $set: { 'stats.lastWarChallenge': Date.now() } });
		const nw: Omit<ClanWar, '_id'> = {
			clans: [cid, toID(tcid)],
			scores: { [cid]: 0, [toID(tcid)]: 0 },
			status: 'pending',
			startDate: Date.now(),
			bestOf: bo,
		};
		const ir = await ClanWars.insertOne(nw as ClanWarDoc);
		const wid = ir.insertedId;
		if (!wid) return this.errorReply("There was an error creating the war document. Aborting.");
		const w = await ClanWars.findOne({ _id: wid });
		if (!w) return this.errorReply("Failed to fetch the newly created war. Aborting.");
		this.sendReply(`You have challenged ${tc.name} to a Best of ${bo} War!`);
		const uid = `clan-war-card-${w._id}`;
		const ch = generateWarCard(w, mc, tc, 'challenger');
		const th = generateWarCard(w, mc, tc, 'target');
		const ph = generateWarCard(w, mc, tc, 'public');
		const tr = Rooms.get(tc.chatRoom);
		const mr = Rooms.get(mc.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (tr) tr.add(`|uhtml|${uid}|${th}`).update();
		else this.errorReply(`Your challenge was sent, but I could not find the target clan's chat room ('${tc.chatRoom}') to post the challenge card. It may be inactive.`);
		if (mr) mr.add(`|uhtml|${uid}|${ch}`).update();
		else this.errorReply(`Your challenge was sent, but I could not find your clan's chat room ('${mc.chatRoom}') to post the challenge card. It may be inactive.`);
		if (lr) lr.add(`|uhtml|${uid}|${ph}`).update();
	},

	async accept(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");
		const uci = await UserClans.findOne({ _id: user.id });
		const cid = uci?.memberOf;
		if (!cid) return this.errorReply("You are not in a clan.");
		const mc = await Clans.findOne({ _id: cid });
		if (!mc) return this.errorReply("Your clan was not found.");
		if (!hasClanPermission(mc, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to accept war challenges.");
		}
		const tcid = toID(target);
		if (!tcid) return this.errorReply("Specify a clan ID to accept a challenge from.");
		const w = await ClanWars.findOne({ clans: [tcid, cid], status: 'pending' });
		if (!w) return this.errorReply(`You do not have a pending war challenge from '${tcid}'.`);
		const [maw, taw] = await Promise.all([
			ClanWars.findOne({ clans: cid, status: 'active' }),
			ClanWars.findOne({ clans: tcid, status: 'active' }),
		]);
		if (maw) {
			const oid = maw.clans[0] === cid ? maw.clans[1] : maw.clans[0];
			const o = await Clans.findOne({ _id: oid });
			return this.errorReply(`Your clan is already in an active war with ${o?.name || oid}. Complete or end that war first.`);
		}
		if (taw) {
			const oid = taw.clans[0] === tcid ? taw.clans[1] : taw.clans[0];
			const o = await Clans.findOne({ _id: oid });
			const tc = await Clans.findOne({ _id: tcid });
			return this.errorReply(`${tc?.name || tcid} is already in an active war with ${o?.name || oid}.`);
		}
		await ClanWars.updateOne({ _id: w._id }, { $set: { status: 'active', startDate: Date.now() } });
		const uw = await ClanWars.findOne({ _id: w._id });
		if (!uw) return this.errorReply("Failed to fetch updated war data.");
		const [cc, tc] = await Promise.all([
			Clans.findOne({ _id: uw.clans[0] }),
			Clans.findOne({ _id: uw.clans[1] }),
		]);
		if (!cc || !tc) return this.errorReply("One of the war clans no longer exists.");
		const uid = `clan-war-card-${uw._id}`;
		const ch = generateWarCard(uw, cc, tc, 'challenger');
		const th = generateWarCard(uw, cc, tc, 'target');
		const ph = generateWarCard(uw, cc, tc, 'public');
		const cr = Rooms.get(cc.chatRoom);
		const tr = Rooms.get(tc.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (cr) cr.add(`|uhtmlchange|${uid}|${ch}`).update();
		if (tr) tr.add(`|uhtmlchange|${uid}|${th}`).update();
		if (lr) lr.add(`|uhtmlchange|${uid}|${ph}`).update();
	},

	async deny(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");
		const uci = await UserClans.findOne({ _id: user.id });
		const cid = uci?.memberOf;
		if (!cid) return this.errorReply("You are not in a clan.");
		const mc = await Clans.findOne({ _id: cid });
		if (!mc) return this.errorReply("Your clan was not found.");
		if (!hasClanPermission(mc, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to deny war challenges.");
		}
		const ccid = toID(target);
		if (!ccid) return this.errorReply("Specify a clan ID to deny.");
		const w = await ClanWars.findOne({ clans: { $all: [ccid, cid] }, status: 'pending' });
		if (!w) return this.errorReply(`No pending challenge found between your clan and '${ccid}'.`);
		const cc = await Clans.findOne({ _id: ccid });
		if (!cc) return this.errorReply("Challenging clan not found.");
		const uid = `clan-war-card-${w._id}`;
		try {
			await ClanWars.deleteOne({ _id: w._id });
			await Clans.updateOne({ _id: ccid }, { $set: { 'stats.lastWarChallenge': 0 } });
		} catch (e) {
			return this.errorReply("An error occurred while declining the challenge.");
		}
		this.sendReply(`You have declined the war challenge from ${cc.name}.`);
		const em = `${mc.name} has refused the war challenge from ${cc.name}.`;
		const eh = generateWarCard(w, cc, mc, 'ended', { endMessage: em });
		const cr = Rooms.get(cc.chatRoom);
		const mr = Rooms.get(mc.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (cr) cr.add(`|uhtmlchange|${uid}|${eh}`).update();
		if (mr) mr.add(`|uhtmlchange|${uid}|${eh}`).update();
		if (lr) lr.add(`|uhtmlchange|${uid}|${eh}`).update();
	},

	async cancel(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");
		const uci = await UserClans.findOne({ _id: user.id });
		const cid = uci?.memberOf;
		if (!cid) return this.errorReply("You are not in a clan.");
		const mc = await Clans.findOne({ _id: cid });
		if (!mc) return this.errorReply("Your clan was not found.");
		if (!hasClanPermission(mc, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to manage wars.");
		}
		const tcid = toID(target);
		if (!tcid) return this.errorReply("Specify the clan ID. Usage: /clan war cancel [clanid]");
		const w = await ClanWars.findOne({ clans: [cid, tcid], status: 'pending' });
		if (!w) return this.errorReply(`No pending war challenge found with '${tcid}'.`);
		if (w.clans[0] !== cid) return this.errorReply("Only the challenging clan can cancel a pending war.");
		const tc = await Clans.findOne({ _id: tcid });
		if (!tc) return this.errorReply(`Clan '${tcid}' not found.`);
		const uid = `clan-war-card-${w._id}`;
		try {
			await ClanWars.deleteOne({ _id: w._id });
			await Clans.updateOne({ _id: cid }, { $set: { 'stats.lastWarChallenge': 0 } });
		} catch (e) {
			return this.errorReply("An error occurred while cancelling the challenge.");
		}
		this.sendReply(`You have withdrawn your war challenge to ${tc.name}.`);
		const em = `${mc.name} has withdrawn their war challenge to ${tc.name}.`;
		const eh = generateWarCard(w, mc, tc, 'ended', { endMessage: em });
		const tr = Rooms.get(tc.chatRoom);
		const mr = Rooms.get(mc.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (tr) tr.add(`|uhtmlchange|${uid}|${eh}`).update();
		if (mr) mr.add(`|uhtmlchange|${uid}|${eh}`).update();
		if (lr) lr.add(`|uhtmlchange|${uid}|${eh}`).update();
	},

	async rematch(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");
		const uci = await UserClans.findOne({ _id: user.id });
		const cid = uci?.memberOf;
		if (!cid) return this.errorReply("You are not in a clan.");
		const mc = await Clans.findOne({ _id: cid });
		if (!mc) return this.errorReply("Your clan was not found.");
		if (!hasClanPermission(mc, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to challenge other clans.");
		}
		const [tcid, bos] = target.split(',').map(s => s.trim());
		const bo = parseInt(bos);
		if (!tcid) return this.errorReply("Specify a clan ID. Usage: /clan war rematch [clanid], [bestof]");
		if (!bo) return this.errorReply("You must specify a 'Best of' number.");
		if (bo < 1 || bo % 2 === 0) return this.errorReply("'Best of' must be an odd number (3, 5, 7, etc.).");
		if (bo > 101) return this.errorReply("'Best of' cannot be higher than 101.");
		const tc = await Clans.findOne({ _id: toID(tcid) });
		if (!tc) return this.errorReply(`Clan '${tcid}' not found.`);
		if (toID(tcid) === cid) return this.errorReply("You cannot challenge your own clan.");
		const pw = await ClanWars.findOne({ clans: { $all: [cid, toID(tcid)] }, status: 'completed' });
		if (!pw) return this.errorReply(`You have no war history with ${tc.name}. Use /clan war challenge instead.`);
		const [mew, tew] = await Promise.all([
			ClanWars.findOne({ clans: cid, status: { $in: ['pending', 'active'] } }),
			ClanWars.findOne({ clans: toID(tcid), status: { $in: ['pending', 'active'] } }),
		]);
		if (mew) {
			const oid = mew.clans[0] === cid ? mew.clans[1] : mew.clans[0];
			const o = await Clans.findOne({ _id: oid });
			return this.errorReply(`Your clan is already in a ${mew.status} war with ${o?.name || oid}.`);
		}
		if (tew) {
			const oid = tew.clans[0] === toID(tcid) ? tew.clans[1] : tew.clans[0];
			const o = await Clans.findOne({ _id: oid });
			return this.errorReply(`${tc.name} is already in a ${tew.status} war with ${o?.name || oid}.`);
		}
		await Clans.updateOne({ _id: cid }, { $set: { 'stats.lastWarChallenge': Date.now() } });
		const nw: Omit<ClanWar, '_id'> = {
			clans: [cid, toID(tcid)],
			scores: { [cid]: 0, [toID(tcid)]: 0 },
			status: 'pending',
			startDate: Date.now(),
			bestOf: bo,
		};
		const ir = await ClanWars.insertOne(nw as ClanWarDoc);
		const wid = ir.insertedId;
		if (!wid) return this.errorReply("There was an error creating the war document. Aborting.");
		const w = await ClanWars.findOne({ _id: wid });
		if (!w) return this.errorReply("Failed to fetch the newly created war. Aborting.");
		this.sendReply(`You have challenged ${tc.name} to a rematch (Best of ${bo})!`);
		const uid = `clan-war-card-${w._id}`;
		const ch = generateWarCard(w, mc, tc, 'challenger');
		const th = generateWarCard(w, mc, tc, 'target');
		const ph = generateWarCard(w, mc, tc, 'public');
		const tr = Rooms.get(tc.chatRoom);
		const mr = Rooms.get(mc.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (tr) tr.add(`|uhtml|${uid}|${th}`).update();
		if (mr) mr.add(`|uhtml|${uid}|${ch}`).update();
		if (lr) lr.add(`|uhtml|${uid}|${ph}`).update();
	},

	async forfeit(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");
		const uci = await UserClans.findOne({ _id: user.id });
		const lcid = uci?.memberOf;
		if (!lcid) return this.errorReply("You are not in a clan.");
		const lc = await Clans.findOne({ _id: lcid });
		if (!lc) return this.errorReply("Your clan was not found.");
		if (!hasClanPermission(lc, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to forfeit wars.");
		}
		const wcid = toID(target);
		if (!wcid) return this.errorReply("Specify the opponent clan ID. Usage: /clan war forfeit [clanid]");
		const w = await ClanWars.findOne({ clans: { $all: [wcid, lcid] }, status: 'active' });
		if (!w) return this.errorReply(`No active war found with '${wcid}'.`);
		const wc = await Clans.findOne({ _id: wcid });
		if (!wc) return this.errorReply(`Opponent clan '${wcid}' not found.`);
		const woe = wc.stats.elo || 1000;
		const loe = lc.stats.elo || 1000;
		const [nwe, nle, ec] = calculateElo(woe, loe);
		try {
			await Promise.all([
				Clans.updateOne({ _id: wcid }, { $set: { 'stats.elo': nwe }, $inc: { 'stats.clanBattleWins': 1 } }),
				Clans.updateOne({ _id: lcid }, { $set: { 'stats.elo': nle }, $inc: { 'stats.clanBattleLosses': 1 } }),
				ClanWars.updateOne({ _id: w._id }, { $set: { status: 'completed', endDate: Date.now() } }),
				logClanActivity(lcid, user.id, 'ADMIN_RESETSTATS', {
					target: wcid,
					note: `Forfeited war. ELO changed from ${Math.floor(loe)} to ${Math.floor(nle)}.`,
				}),
				logClanActivity(wcid, user.id, 'ADMIN_RESETSTATS', {
					target: lcid,
					note: `${lc.name} forfeited war. ELO changed from ${Math.floor(woe)} to ${Math.floor(nwe)}.`,
				}),
			]);
		} catch (e) {
			this.errorReply("An error occurred while forfeiting the war. Please try again.");
			Monitor.crashlog(e as Error, "Clan War Forfeit", { warId: w._id, winnerClanId: wcid, loserClanId: lcid });
			return;
		}
		const [c1, c2] = await Promise.all([
			Clans.findOne({ _id: w.clans[0] }),
			Clans.findOne({ _id: w.clans[1] }),
		]);
		if (!c1 || !c2) return this.errorReply("Could not find clan data for UHTML update.");
		w.status = 'completed';
		const em = `${lc.name} has forfeited the war to ${wc.name}. ELO Change: ${ec}`;
		const eh = generateWarCard(w, c1, c2, 'ended', { endMessage: em });
		const uid = `clan-war-card-${w._id}`;
		const wr = Rooms.get(wc.chatRoom);
		const lr = Rooms.get(lc.chatRoom);
		const lbr = Rooms.get(LOBBY);
		if (wr) wr.add(`|uhtmlchange|${uid}|${eh}`).update();
		if (lr) lr.add(`|uhtmlchange|${uid}|${eh}`).update();
		if (lbr) lbr.add(`|uhtmlchange|${uid}|${eh}`).update();
		this.sendReply(`You have forfeited the war against ${wc.name}. Your clan lost ${ec} ELO.`);
	},

	async tie(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");
		const uci = await UserClans.findOne({ _id: user.id });
		const cid = uci?.memberOf;
		if (!cid) return this.errorReply("You are not in a clan.");
		const mc = await Clans.findOne({ _id: cid });
		if (!mc) return this.errorReply("Your clan was not found.");
		if (!hasClanPermission(mc, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to manage wars.");
		}
		const ocid = toID(target);
		if (!ocid) return this.errorReply("Specify the opponent clan ID. Usage: /clan war tie [clanid]");
		const w = await ClanWars.findOne({ clans: { $all: [cid, ocid] }, status: 'active' });
		if (!w) return this.errorReply(`No active war found with '${ocid}'.`);
		const oc = await Clans.findOne({ _id: ocid });
		if (!oc) return this.errorReply(`Opponent clan '${ocid}' not found.`);
		const tc = w.tieConfirmations || [];
		const ac = tc.includes(cid);
		if (ac) return this.errorReply(`Your clan has already confirmed the tie with ${oc.name}.`);
		await ClanWars.updateOne({ _id: w._id }, { $addToSet: { tieConfirmations: cid } });
		const uw = await ClanWars.findOne({ _id: w._id });
		if (!uw) return this.errorReply("Failed to fetch war data after update.");
		const cf = uw.tieConfirmations || [];
		const [c1, c2] = w.clans[0] === mc._id ? [mc, oc] : [oc, mc];
		const uid = `clan-war-card-${uw._id}`;
		if (cf.length === 2) {
			await ClanWars.updateOne({ _id: w._id }, { $set: { status: 'completed', endDate: Date.now() }, $unset: { tieConfirmations: 1 } });
			const s1 = w.scores[c1._id] || 0;
			const s2 = w.scores[c2._id] || 0;
			const em = `The war between ${c1.name} and ${c2.name} has ended in a draw! Final Score: ${s1} - ${s2}`;
			const eh = generateWarCard(uw, c1, c2, 'ended', { endMessage: em });
			const r1 = Rooms.get(c1.chatRoom);
			const r2 = Rooms.get(c2.chatRoom);
			const lr = Rooms.get(LOBBY);
			if (r1) r1.add(`|uhtmlchange|${uid}|${eh}`).update();
			if (r2) r2.add(`|uhtmlchange|${uid}|${eh}`).update();
			if (lr) lr.add(`|uhtmlchange|${uid}|${eh}`).update();
			this.sendReply(`The war with ${oc.name} has been concluded as a tie.`);
		} else {
			this.sendReply(`You have proposed ending the war as a tie. Waiting for ${oc.name}'s decision...`);
			const ch = generateWarCard(uw, c1, c2, 'challenger');
			const th = generateWarCard(uw, c1, c2, 'target');
			const ph = generateWarCard(uw, c1, c2, 'public');
			const r1 = Rooms.get(c1.chatRoom);
			const r2 = Rooms.get(c2.chatRoom);
			const lr = Rooms.get(LOBBY);
			if (r1) r1.add(`|uhtmlchange|${uid}|${ch}`).update();
			if (r2) r2.add(`|uhtmlchange|${uid}|${th}`).update();
			if (lr) lr.add(`|uhtmlchange|${uid}|${ph}`).update();
		}
	},

	async extend(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");
		const uci = await UserClans.findOne({ _id: user.id });
		const cid = uci?.memberOf;
		if (!cid) return this.errorReply("You are not in a clan.");
		const mc = await Clans.findOne({ _id: cid });
		if (!mc) return this.errorReply("Your clan was not found.");
		if (!hasClanPermission(mc, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to manage wars.");
		}
		const [ocid, nbos] = target.split(',').map(s => s.trim());
		const nbo = parseInt(nbos);
		if (!ocid) return this.errorReply("Specify the opponent clan ID. Usage: /clan war extend [clanid], [newbestof]");
		if (!nbo) return this.errorReply("You must specify a new 'Best of' number.");
		if (nbo < 1 || nbo % 2 === 0) return this.errorReply("'Best of' must be an odd number (3, 5, 7, etc.).");
		if (nbo > 101) return this.errorReply("'Best of' cannot be higher than 101.");
		const w = await ClanWars.findOne({ clans: { $all: [cid, toID(ocid)] }, status: 'active' });
		if (!w) return this.errorReply(`No active war found with '${ocid}'.`);
		if (nbo <= w.bestOf) return this.errorReply(`New best of (${nbo}) must be greater than current best of (${w.bestOf}).`);
		const oc = await Clans.findOne({ _id: toID(ocid) });
		if (!oc) return this.errorReply(`Opponent clan '${ocid}' not found.`);
		const ec = w.extendConfirmations || [];
		const ac = ec.some((c: any) => c.clanId === cid && c.newBestOf === nbo);
		if (ac) return this.errorReply(`Your clan has already confirmed extending to Best of ${nbo}.`);
		await ClanWars.updateOne({ _id: w._id }, { $push: { extendConfirmations: { clanId: cid, newBestOf: nbo } } });
		const uw = await ClanWars.findOne({ _id: w._id });
		const cf = uw?.extendConfirmations || [];
		const mcf = cf.filter((c: any) => c.newBestOf === nbo);
		if (mcf.length === 2) {
			await ClanWars.updateOne({ _id: w._id }, { $set: { bestOf: nbo }, $unset: { extendConfirmations: 1 } });
			const wn = Math.ceil(nbo / 2);
			const msg = `|html|<div class="broadcast-blue"><center><strong>WAR EXTENDED!</strong><br />Both clans have agreed to extend the war!<br /><strong>New Format:</strong> Best of ${nbo} (First to ${wn} wins)<br />The battle for supremacy continues!</center></div>`;
			const r1 = Rooms.get(mc.chatRoom);
			const r2 = Rooms.get(oc.chatRoom);
			if (r1) r1.add(msg).update();
			if (r2) r2.add(msg).update();
			this.sendReply(`The war has been extended to Best of ${nbo}.`);
		} else {
			this.sendReply(`You have proposed extending the war to Best of ${nbo}. Waiting for ${oc.name} to decide...`);
			const or = Rooms.get(oc.chatRoom);
			if (or) {
				const nwn = Math.ceil(nbo / 2);
				or.add(`|html|<div class="broadcast-blue"><center><strong>EXTENSION PROPOSAL</strong><br /><strong>${mc.name}</strong> wants to extend the war!<br /><strong>New Format:</strong> Best of ${nbo} (First to ${nwn} wins)<br /><br />Use <strong>/clan war extend ${cid}, ${nbo}</strong> to accept this proposal.</center></div>`).update();
			}
		}
	},

	async pause(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");
		const uci = await UserClans.findOne({ _id: user.id });
		const cid = uci?.memberOf;
		if (!cid) return this.errorReply("You are not in a clan.");
		const mc = await Clans.findOne({ _id: cid });
		if (!mc) return this.errorReply("Your clan was not found.");
		if (!hasClanPermission(mc, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to manage wars.");
		}
		const ocid = toID(target);
		if (!ocid) return this.errorReply("Specify the opponent clan ID. Usage: /clan war pause [clanid]");
		const w = await ClanWars.findOne({ clans: { $all: [cid, ocid] }, status: 'active' });
		if (!w) return this.errorReply(`No active war found with '${ocid}'.`);
		if (w.paused) return this.errorReply("This war is already paused.");
		const oc = await Clans.findOne({ _id: ocid });
		if (!oc) return this.errorReply(`Opponent clan '${ocid}' not found.`);
		const pc = w.pauseConfirmations || [];
		const ac = pc.includes(cid);
		if (ac) return this.errorReply(`Your clan has already confirmed pausing the war.`);
		await ClanWars.updateOne({ _id: w._id }, { $addToSet: { pauseConfirmations: cid } });
		const uw = await ClanWars.findOne({ _id: w._id });
		if (!uw) return this.errorReply("Failed to fetch war data after update.");
		const cf = uw.pauseConfirmations || [];
		const [c1, c2] = w.clans[0] === mc._id ? [mc, oc] : [oc, mc];
		const uid = `clan-war-card-${uw._id}`;
		if (cf.length === 2) {
			await ClanWars.updateOne({ _id: w._id }, { $set: { paused: true }, $unset: { pauseConfirmations: 1 } });
			const fw = await ClanWars.findOne({ _id: w._id });
			if (!fw) return this.errorReply("Failed to fetch final war data.");
			const fch = generateWarCard(fw, c1, c2, 'challenger');
			const fth = generateWarCard(fw, c1, c2, 'target');
			const fph = generateWarCard(fw, c1, c2, 'public');
			const r1 = Rooms.get(c1.chatRoom);
			const r2 = Rooms.get(c2.chatRoom);
			const lr = Rooms.get(LOBBY);
			if (r1) r1.add(`|uhtmlchange|${uid}|${fch}`).update();
			if (r2) r2.add(`|uhtmlchange|${uid}|${fth}`).update();
			if (lr) lr.add(`|uhtmlchange|${uid}|${fph}`).update();
			this.sendReply(`The war has been paused.`);
		} else {
			this.sendReply(`You have proposed pausing the war. Waiting for ${oc.name} to agree...`);
			const ch = generateWarCard(uw, c1, c2, 'challenger');
			const th = generateWarCard(uw, c1, c2, 'target');
			const ph = generateWarCard(uw, c1, c2, 'public');
			const r1 = Rooms.get(c1.chatRoom);
			const r2 = Rooms.get(c2.chatRoom);
			const lr = Rooms.get(LOBBY);
			if (r1) r1.add(`|uhtmlchange|${uid}|${ch}`).update();
			if (r2) r2.add(`|uhtmlchange|${uid}|${th}`).update();
			if (lr) lr.add(`|uhtmlchange|${uid}|${ph}`).update();
		}
	},

	async resume(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply("You must be logged in.");
		const uci = await UserClans.findOne({ _id: user.id });
		const cid = uci?.memberOf;
		if (!cid) return this.errorReply("You are not in a clan.");
		const mc = await Clans.findOne({ _id: cid });
		if (!mc) return this.errorReply("Your clan was not found.");
		if (!hasClanPermission(mc, user.id, 'canWar')) {
			return this.errorReply("You do not have permission in your clan to manage wars.");
		}
		const ocid = toID(target);
		if (!ocid) return this.errorReply("Specify the opponent clan ID. Usage: /clan war resume [clanid]");
		const w = await ClanWars.findOne({ clans: { $all: [cid, ocid] }, status: 'active' });
		if (!w) return this.errorReply(`No active war found with '${ocid}'.`);
		if (!w.paused) return this.errorReply("This war is not paused.");
		const oc = await Clans.findOne({ _id: ocid });
		if (!oc) return this.errorReply(`Opponent clan '${ocid}' not found.`);
		const rc = w.resumeConfirmations || [];
		const ac = rc.includes(cid);
		if (ac) return this.errorReply(`Your clan has already confirmed resuming the war.`);
		await ClanWars.updateOne({ _id: w._id }, { $addToSet: { resumeConfirmations: cid } });
		const uw = await ClanWars.findOne({ _id: w._id });
		if (!uw) return this.errorReply("Failed to fetch war data after update.");
		const cf = uw.resumeConfirmations || [];
		const [c1, c2] = w.clans[0] === mc._id ? [mc, oc] : [oc, mc];
		const uid = `clan-war-card-${uw._id}`;
		if (cf.length === 2) {
			await ClanWars.updateOne({ _id: w._id }, { $set: { paused: false }, $unset: { resumeConfirmations: 1 } });
			const fw = await ClanWars.findOne({ _id: w._id });
			if (!fw) return this.errorReply("Failed to fetch final war data.");
			const fch = generateWarCard(fw, c1, c2, 'challenger');
			const fth = generateWarCard(fw, c1, c2, 'target');
			const fph = generateWarCard(fw, c1, c2, 'public');
			const r1 = Rooms.get(c1.chatRoom);
			const r2 = Rooms.get(c2.chatRoom);
			const lr = Rooms.get(LOBBY);
			if (r1) r1.add(`|uhtmlchange|${uid}|${fch}`).update();
			if (r2) r2.add(`|uhtmlchange|${uid}|${fth}`).update();
			if (lr) lr.add(`|uhtmlchange|${uid}|${fph}`).update();
			this.sendReply(`The war has been resumed.`);
		} else {
			this.sendReply(`You have confirmed resuming the war. Waiting for ${oc.name} to agree...`);
			const ch = generateWarCard(uw, c1, c2, 'challenger');
			const th = generateWarCard(uw, c1, c2, 'target');
			const ph = generateWarCard(uw, c1, c2, 'public');
			const r1 = Rooms.get(c1.chatRoom);
			const r2 = Rooms.get(c2.chatRoom);
			const lr = Rooms.get(LOBBY);
			if (r1) r1.add(`|uhtmlchange|${uid}|${ch}`).update();
			if (r2) r2.add(`|uhtmlchange|${uid}|${th}`).update();
			if (lr) lr.add(`|uhtmlchange|${uid}|${ph}`).update();
		}
	},

	async status(target, room, user) {
		this.runBroadcast();
		this.checkChat();
		let cid: ID;
		if (target) {
			cid = toID(target);
		} else {
			const uci = await UserClans.findOne({ _id: user.id });
			if (!uci?.memberOf) return this.errorReply("You are not in a clan. Specify a clan ID (e.g., /clan war status [clanid]).");
			cid = uci.memberOf;
		}
		const c = await Clans.findOne({ _id: cid });
		if (!c) return this.errorReply(`Clan '${cid}' not found.`);
		const ws = await ClanWars.find({ clans: cid, status: { $in: ['pending', 'active'] } }, { limit: 50, sort: { startDate: -1 } });
		if (!ws.length) return this.sendReplyBox(`${c.name} has no pending or active wars.`);
		const hr = ['Opponent', 'Status', 'Battle Score (Us - Them)', 'Type', 'Started'];
		const dr: string[][] = [];
		const t = `${c.name} War Status`;
		for (const w of ws) {
			const oid = w.clans[0] === cid ? w.clans[1] : w.clans[0];
			const oc = await Clans.findOne({ _id: oid });
			const ms = w.scores[cid] || 0;
			const os = w.scores[oid] || 0;
			dr.push([
				oc?.name || oid,
				w.status === 'active' ? `<strong style="color:green;">Active</strong>` : `<em style="color:gray;">Pending</em>`,
				`<strong>${ms} - ${os}</strong>`,
				`Best of ${w.bestOf}`,
				to(new Date(w.startDate), { date: true }),
			]);
		}
		const o = generateThemedTable(t, hr, dr);
		this.sendReply(`|html|${o}`);
	},

	'': 'status',

	async ladder(target, room, user) {
		this.runBroadcast();
		this.checkChat();
		const [ps, sb] = target.split(',').map(s => s.trim());
		const p = parseInt(ps) || 1;
		const lim = 20;
		const sk = (p - 1) * lim;
		let sf: string;
		let hn: string;
		const so: 1 | -1 = -1;
		const st = toID(sb);
		switch (st) {
		case 'wins':
			sf = 'stats.clanBattleWins';
			hn = 'Wins';
			break;
		case 'losses':
			sf = 'stats.clanBattleLosses';
			hn = 'Losses';
			break;
		case 'winrate':
			sf = 'stats.clanBattleWins';
			hn = 'Win Rate';
			break;
		case 'elo':
		default:
			sf = 'stats.elo';
			hn = 'ELO';
			break;
		}
		const cs = await Clans.find({}, { skip: 0, limit: 1000, sort: { [sf]: so } });
		let wc = cs.filter(c => (c.stats.clanBattleWins || 0) > 0 || (c.stats.clanBattleLosses || 0) > 0);
		if (st === 'winrate') {
			wc = wc.sort((a, b) => {
				const aw = a.stats.clanBattleWins || 0;
				const al = a.stats.clanBattleLosses || 0;
				const at = aw + al;
				const awr = at > 0 ? (aw / at) * 100 : 0;
				const bw = b.stats.clanBattleWins || 0;
				const bl = b.stats.clanBattleLosses || 0;
				const bt = bw + bl;
				const bwr = bt > 0 ? (bw / bt) * 100 : 0;
				return bwr - awr;
			});
		}
		const tot = wc.length;
		const tp = Math.ceil(tot / lim);
		const pc = wc.slice(sk, sk + lim);
		if (pc.length === 0) return this.errorReply("No clans have participated in wars yet.");
		const dr: string[][] = [];
		const hr = ['Rank', 'Clan', 'ELO Rating', 'Battle Wins', 'Battle Losses', 'Win %'];
		const ttl = `Clan War Ladder (Page ${p}/${tp}) - Sorted by ${hn}`;
		pc.forEach((c, i) => {
			const w = c.stats.clanBattleWins || 0;
			const l = c.stats.clanBattleLosses || 0;
			const tb = w + l;
			const wr = tb > 0 ? ((w / tb) * 100).toFixed(1) : '0.0';
			const e = Math.floor(c.stats.elo || 1000);
			dr.push([
				`<strong>#${(sk + i + 1)}</strong>`,
				c.name,
				`<strong style="font-size: 1.1em;">${e}</strong>`,
				w.toString(),
				l.toString(),
				`<strong>${wr}%</strong>`,
			]);
		});
		let o = generateThemedTable(ttl, hr, dr);
		const cmd = `/clan war ladder`;
		if (p > 1 || p < tp) {
			o += '<center>';
			if (p > 1) o += `<button class="button" name="send" value="${cmd} ${p - 1}, ${st || 'elo'}">Previous</button> `;
			if (p < tp) o += `<button class="button" name="send" value="${cmd} ${p + 1}, ${st || 'elo'}">Next</button>`;
			o += '</center>';
		}
		o += `<br /><center><small>Sort by: ` +
			`<button class="button" name="send" value="${cmd} 1, elo">ELO Rating</button> ` +
			`<button class="button" name="send" value="${cmd} 1, wins">Battle Wins</button> ` +
			`<button class="button" name="send" value="${cmd} 1, losses">Battle Losses</button> ` +
			`<button class="button" name="send" value="${cmd} 1, winrate">Win Rate</button>` +
			`</small></center>`;
		this.sendReply(`|html|${o}`);
	},

	async stats(target, room, user) {
		this.runBroadcast();
		this.checkChat();
		let cid: ID;
		if (target) {
			cid = toID(target);
		} else {
			const uci = await UserClans.findOne({ _id: user.id });
			if (!uci?.memberOf) return this.errorReply("You are not in a clan. Specify a clan ID (e.g., /clan war stats [clanid]).");
			cid = uci.memberOf;
		}
		const c = await Clans.findOne({ _id: cid });
		if (!c) return this.errorReply(`Clan '${cid}' not found.`);
		const [cw, apw, bl] = await Promise.all([
			ClanWars.find({ clans: cid, status: 'completed' }, {}),
			ClanWars.find({ clans: cid, status: { $in: ['pending', 'active'] } }, {}),
			ClanBattleLogs.find({ $or: [{ winningClan: cid }, { losingClan: cid }] }, {}),
		]);
		const w = c.stats.clanBattleWins || 0;
		const l = c.stats.clanBattleLosses || 0;
		const tb = w + l;
		const wr = tb > 0 ? ((w / tb) * 100).toFixed(1) : '0.0';
		const e = Math.floor(c.stats.elo || 1000);
		let ww = 0;
		let wl = 0;
		let wt = 0;
		let twb = 0;
		for (const war of cw) {
			const ms = war.scores[cid] || 0;
			const oid = war.clans[0] === cid ? war.clans[1] : war.clans[0];
			const os = war.scores[oid] || 0;
			twb += ms + os;
			if (ms > os) ww++;
			else if (ms < os) wl++;
			else wt++;
		}
		const tw = ww + wl + wt;
		const wwr = tw > 0 ? ((ww / tw) * 100).toFixed(1) : '0.0';
		let cs = 0;
		let lws = 0;
		const sl = bl.sort((a, b) => b.timestamp - a.timestamp);
		for (const log of sl) {
			if (log.winningClan === cid) {
				cs++;
				if (cs > lws) lws = cs;
			} else {
				cs = 0;
			}
		}
		let h = `<div class="infobox" style="max-width:650px;"><center><strong style="font-size: 1.3em;">Clan War Statistics</strong></center><hr>`;
		h += `<strong>Individual Battle Performance:</strong><br>`;
		h += `Clan ELO Rating: <strong style="font-size: 1.15em; color: gold;">${e}</strong><br>`;
		h += `Total 1v1 Battles Fought: <strong>${tb}</strong> (${w}W - ${l}L)<br>`;
		h += `Battle Win Rate: <strong style="color: green;">${wr}%</strong><br>`;
		h += `Best Win Streak: <strong>${lws}</strong> consecutive victories<br><hr>`;
		h += `<strong>War Record:</strong><br>`;
		h += `Total Wars: <strong>${tw}</strong> (${ww}W - ${wl}L - ${wt}D)<br>`;
		h += `War Win Rate: <strong style="color: green;">${wwr}%</strong><br>`;
		h += `Active/Pending Wars: <strong>${apw.length}</strong><br>`;
		h += `Total Battles Across All Wars: <strong>${twb}</strong><br>`;
		h += `</div>`;
		this.sendReply(`|html|${h}`);
	},

	async history(target, room, user) {
		this.runBroadcast();
		this.checkChat();
		let cid: ID;
		if (target) {
			cid = toID(target);
		} else {
			const uci = await UserClans.findOne({ _id: user.id });
			if (!uci?.memberOf) return this.errorReply("You are not in a clan. Specify a clan ID (e.g., /clan war history [clanid]).");
			cid = uci.memberOf;
		}
		const c = await Clans.findOne({ _id: cid });
		if (!c) return this.errorReply(`Clan '${cid}' not found.`);
		const ws = await ClanWars.find({ clans: cid, status: 'completed' }, { limit: 50, sort: { endDate: -1 } });
		if (!ws.length) return this.sendReplyBox(`${c.name} has no completed war history.`);
		const hr = ['Opponent', 'Result', 'Battle Score', 'Format', 'Date'];
		const dr: string[][] = [];
		const t = `${c.name} War History (Last ${ws.length} Wars)`;
		for (const w of ws) {
			const oid = w.clans[0] === cid ? w.clans[1] : w.clans[0];
			const oc = await Clans.findOne({ _id: oid });
			const ms = w.scores[cid] || 0;
			const os = w.scores[oid] || 0;
			let r: string;
			let rc: string;
			if (ms > os) {
				r = 'WIN';
				rc = 'green';
			} else if (ms < os) {
				r = 'LOSS';
				rc = 'red';
			} else {
				r = 'TIE';
				rc = 'gray';
			}
			dr.push([
				oc?.name || oid,
				`<strong style="color:${rc};">${r}</strong>`,
				`${ms} - ${os}`,
				`Best of ${w.bestOf}`,
				w.endDate ? to(new Date(w.endDate), { date: true }) : 'N/A',
			]);
		}
		const o = generateThemedTable(t, hr, dr);
		this.sendReply(`|html|${o}`);
	},

	async record(target, room, user) {
		this.runBroadcast();
		this.checkChat();
		const [c1id, c2id] = target.split(',').map(s => toID(s.trim()));
		if (!c1id || !c2id) return this.errorReply("Usage: /clan war record [clan1], [clan2]");
		const [c1, c2] = await Promise.all([
			Clans.findOne({ _id: c1id }),
			Clans.findOne({ _id: c2id }),
		]);
		if (!c1) return this.errorReply(`Clan '${c1id}' not found.`);
		if (!c2) return this.errorReply(`Clan '${c2id}' not found.`);
		const ws = await ClanWars.find({ clans: { $all: [c1id, c2id] }, status: 'completed' }, {});
		if (!ws.length) return this.sendReplyBox(`${c1.name} and ${c2.name} have no war history together.`);
		let c1w = 0;
		let c2w = 0;
		let t = 0;
		let c1bw = 0;
		let c2bw = 0;
		for (const w of ws) {
			const s1 = w.scores[c1id] || 0;
			const s2 = w.scores[c2id] || 0;
			c1bw += s1;
			c2bw += s2;
			if (s1 > s2) c1w++;
			else if (s2 > s1) c2w++;
			else t++;
		}
		let h = `<div class="infobox" style="max-width:550px;"><center><strong style="font-size: 1.2em;">Head-to-Head Rivalry</strong></center><hr>`;
		h += `<center><strong style="font-size: 1.15em;">${c1.name} vs ${c2.name}</strong></center><br>`;
		h += `<strong>Wars Won:</strong> ${c1.name} ${c1w}W - ${c2w}W ${c2.name}<br>`;
		h += `<strong>Battles Won:</strong> ${c1.name} ${c1bw} - ${c2bw} ${c2.name}<br>`;
		h += `<strong>Tied Wars:</strong> ${t}<br>`;
		h += `<strong>Total Wars Played:</strong> ${ws.length}<br>`;
		h += `</div>`;
		this.sendReply(`|html|${h}`);
	},

	async mvp(target, room, user) {
		this.runBroadcast();
		this.checkChat();
		let cid: ID;
		if (target) {
			cid = toID(target);
		} else {
			const uci = await UserClans.findOne({ _id: user.id });
			if (!uci?.memberOf) return this.errorReply("You are not in a clan. Specify a clan ID (e.g., /clan war mvp [clanid]).");
			cid = uci.memberOf;
		}
		const c = await Clans.findOne({ _id: cid });
		if (!c) return this.errorReply(`Clan '${cid}' not found.`);
		const bl = await ClanBattleLogs.find({ winningClan: cid }, {});
		if (!bl.length) return this.sendReplyBox(`${c.name} has no war battle wins yet.`);
		const mw: { [userid: string]: number } = {};
		for (const log of bl) {
			mw[log.winner] = (mw[log.winner] || 0) + 1;
		}
		const sm = Object.entries(mw).sort((a, b) => b[1] - a[1]);
		const t10 = sm.slice(0, 10);
		const hr = ['Rank', 'Top Trainer', 'War Victories'];
		const dr: string[][] = [];
		const ttl = `${c.name} War MVPs - Top Trainers`;
		t10.forEach(([uid, w], i) => {
			dr.push([
				`<strong>#${i + 1}</strong>`,
				uid,
				`<strong style="font-size: 1.1em; color: gold;">${w}</strong>`,
			]);
		});
		const o = generateThemedTable(ttl, hr, dr);
		this.sendReply(`|html|${o}`);
	},

	async forceend(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');
		const tcid = toID(target);
		if (!tcid) return this.errorReply("Specify a clan ID. Usage: /clan war forceend [clanid]");
		const tc = await Clans.findOne({ _id: tcid });
		if (!tc) return this.errorReply(`Clan '${tcid}' not found.`);
		const w = await ClanWars.findOne({ clans: tcid, status: 'active' });
		if (!w) return this.errorReply(`No active war found for clan '${tcid}'.`);
		await ClanWars.updateOne({ _id: w._id }, { $set: { status: 'completed', endDate: Date.now() } });
		const [c1, c2] = await Promise.all([
			Clans.findOne({ _id: w.clans[0] }),
			Clans.findOne({ _id: w.clans[1] }),
		]);
		if (!c1 || !c2) return this.errorReply("A clan was deleted.");
		const s1 = w.scores[c1._id] || 0;
		const s2 = w.scores[c2._id] || 0;
		const uid = `clan-war-card-${w._id}`;
		const em = `[ADMIN] ${user.name} has declared the war a tie. Final Score: ${s1} - ${s2}`;
		const eh = generateWarCard(w, c1, c2, 'ended', { endMessage: em });
		const r1 = Rooms.get(c1.chatRoom);
		const r2 = Rooms.get(c2.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (r1) r1.add(`|uhtmlchange|${uid}|${eh}`).update();
		if (r2) r2.add(`|uhtmlchange|${uid}|${eh}`).update();
		if (lr) lr.add(`|uhtmlchange|${uid}|${eh}`).update();
		this.sendReply(`Force tied the war between ${c1.name} and ${c2.name}.`);
	},

	async forfeitadmin(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');
		const [lcid, wcid] = target.split(',').map(s => toID(s.trim()));
		if (!lcid || !wcid) return this.errorReply("Usage: /clan war forfeitadmin [loserclanid], [winnerclanid]");
		const [lc, wc] = await Promise.all([
			Clans.findOne({ _id: lcid }),
			Clans.findOne({ _id: wcid }),
		]);
		if (!lc) return this.errorReply(`Clan '${lcid}' not found.`);
		if (!wc) return this.errorReply(`Clan '${wcid}' not found.`);
		const w = await ClanWars.findOne({ clans: { $all: [lcid, wcid] }, status: 'active' });
		if (!w) return this.errorReply(`No active war found between these clans.`);
		const woe = wc.stats.elo || 1000;
		const loe = lc.stats.elo || 1000;
		const [nwe, nle, ec] = calculateElo(woe, loe);
		try {
			await Promise.all([
				Clans.updateOne({ _id: wcid }, { $set: { 'stats.elo': nwe }, $inc: { 'stats.clanBattleWins': 1 } }),
				Clans.updateOne({ _id: lcid }, { $set: { 'stats.elo': nle }, $inc: { 'stats.clanBattleLosses': 1 } }),
				ClanWars.updateOne({ _id: w._id }, { $set: { status: 'completed', endDate: Date.now() } }),
				logClanActivity(lcid, user.id, 'ADMIN_RESETSTATS', {
					target: wcid,
					note: `[ADMIN] ${user.name} force forfeited war. ELO: ${Math.floor(loe)} → ${Math.floor(nle)}.`,
				}),
				logClanActivity(wcid, user.id, 'ADMIN_RESETSTATS', {
					target: lcid,
					note: `[ADMIN] ${user.name} awarded war victory. ELO: ${Math.floor(woe)} → ${Math.floor(nwe)}.`,
				}),
			]);
			const [c1, c2] = await Promise.all([
				Clans.findOne({ _id: w.clans[0] }),
				Clans.findOne({ _id: w.clans[1] }),
			]);
			if (!c1 || !c2) return this.errorReply("Could not find clan data for UHTML update.");
			w.status = 'completed';
			const em = `[ADMIN] ${user.name} has forced ${lc.name} to forfeit to ${wc.name}. ELO Change: ${ec}`;
			const eh = generateWarCard(w, c1, c2, 'ended', { endMessage: em });
			const uid = `clan-war-card-${w._id}`;
			const wr = Rooms.get(wc.chatRoom);
			const lr = Rooms.get(lc.chatRoom);
			const lbr = Rooms.get(LOBBY);
			if (wr) wr.add(`|uhtmlchange|${uid}|${eh}`).update();
			if (lr) lr.add(`|uhtmlchange|${uid}|${eh}`).update();
			if (lbr) lbr.add(`|uhtmlchange|${uid}|${eh}`).update();
			this.sendReply(`Force forfeited war: ${lc.name} loses to ${wc.name}.`);
		} catch (e) {
			this.errorReply("An error occurred while forfeiting the war.");
			Monitor.crashlog(e as Error, "Admin Forfeit War", { warId: w._id, winnerClanId: wcid, loserClanId: lcid });
		}
	},

	async resetcooldown(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');
		const cid = toID(target);
		if (!cid) return this.errorReply("Specify a clan ID. Usage: /clan war resetcooldown [clanid]");
		const c = await Clans.findOne({ _id: cid });
		if (!c) return this.errorReply(`Clan '${cid}' not found.`);
		await Clans.updateOne({ _id: cid }, { $unset: { 'stats.lastWarChallenge': 1 } });
		await logClanActivity(cid, user.id, 'ADMIN_RESETSTATS', { note: `[ADMIN] ${user.name} reset war challenge cooldown.` });
		this.sendReply(`Reset war challenge cooldown for clan '${c.name}'.`);
		const cr = Rooms.get(c.chatRoom);
		if (cr) cr.add(`|html|<div class="broadcast-red"><center><strong>COOLDOWN RESET</strong><br />By order of Admin ${user.name}, your clan may challenge again immediately!</center></div>`).update();
	},

	async setscore(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');
		const [c1id, s1s, c2id, s2s] = target.split(',').map(s => s.trim());
		const s1 = parseInt(s1s);
		const s2 = parseInt(s2s);
		if (!c1id || !c2id || isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
			return this.errorReply("Usage: /clan war setscore [clan1id], [score1], [clan2id], [score2]");
		}
		const c1ID = toID(c1id);
		const c2ID = toID(c2id);
		const w = await ClanWars.findOne({ clans: { $all: [c1ID, c2ID] }, status: 'active' });
		if (!w) return this.errorReply(`No active war found between '${c1ID}' and '${c2ID}'.`);
		const [c1, c2] = await Promise.all([
			Clans.findOne({ _id: c1ID }),
			Clans.findOne({ _id: c2ID }),
		]);
		if (!c1 || !c2) return this.errorReply("One or both clans not found.");
		await ClanWars.updateOne({ _id: w._id }, { $set: { scores: { [c1ID]: s1, [c2ID]: s2 } } });
		const uw = await ClanWars.findOne({ _id: w._id });
		if (!uw) return this.errorReply("Failed to fetch war data after update.");
		const uid = `clan-war-card-${uw._id}`;
		const lb = { winnerName: "Admin", loserName: `${user.name}`, winningClanName: `Score manually set to ${s1} - ${s2}` };
		const ch = generateWarCard(uw, c1, c2, 'challenger', { lastBattle: lb });
		const th = generateWarCard(uw, c1, c2, 'target', { lastBattle: lb });
		const ph = generateWarCard(uw, c1, c2, 'public', { lastBattle: lb });
		const r1 = Rooms.get(c1.chatRoom);
		const r2 = Rooms.get(c2.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (r1) r1.add(`|uhtmlchange|${uid}|${ch}`).update();
		if (r2) r2.add(`|uhtmlchange|${uid}|${th}`).update();
		if (lr) lr.add(`|uhtmlchange|${uid}|${ph}`).update();
		this.sendReply(`War score updated. ${c1.name}: ${s1}, ${c2.name}: ${s2}.`);
	},

	async setbestof(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');
		const [c1id, c2id, nbos] = target.split(',').map(s => s.trim());
		const nbo = parseInt(nbos);
		if (!c1id || !c2id || isNaN(nbo)) return this.errorReply("Usage: /clan war setbestof [clan1id], [clan2id], [newbestof]");
		if (nbo < 1 || nbo % 2 === 0) return this.errorReply("'Best of' must be an odd number (3, 5, 7, etc.).");
		if (nbo > 101) return this.errorReply("'Best of' cannot be higher than 101.");
		const c1ID = toID(c1id);
		const c2ID = toID(c2id);
		const w = await ClanWars.findOne({ clans: { $all: [c1ID, c2ID] }, status: 'active' });
		if (!w) return this.errorReply(`No active war found between '${c1ID}' and '${c2ID}'.`);
		const [c1, c2] = await Promise.all([
			Clans.findOne({ _id: c1ID }),
			Clans.findOne({ _id: c2ID }),
		]);
		if (!c1 || !c2) return this.errorReply("One or both clans not found.");
		await ClanWars.updateOne({ _id: w._id }, { $set: { bestOf: nbo } });
		const uw = await ClanWars.findOne({ _id: w._id });
		if (!uw) return this.errorReply("Failed to fetch war data after update.");
		const uid = `clan-war-card-${uw._id}`;
		const lb = { winnerName: "Admin", loserName: `${user.name}`, winningClanName: `Format changed to Best of ${nbo}` };
		const ch = generateWarCard(uw, c1, c2, 'challenger', { lastBattle: lb });
		const th = generateWarCard(uw, c1, c2, 'target', { lastBattle: lb });
		const ph = generateWarCard(uw, c1, c2, 'public', { lastBattle: lb });
		const r1 = Rooms.get(c1.chatRoom);
		const r2 = Rooms.get(c2.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (r1) r1.add(`|uhtmlchange|${uid}|${ch}`).update();
		if (r2) r2.add(`|uhtmlchange|${uid}|${th}`).update();
		if (lr) lr.add(`|uhtmlchange|${uid}|${ph}`).update();
		this.sendReply(`War 'Best of' updated to ${nbo} for the war between ${c1.name} and ${c2.name}.`);
	},

	async forcepause(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');
		const cid = toID(target);
		if (!cid) return this.errorReply("Usage: /clan war forcepause [clanid]");
		const w = await ClanWars.findOne({ clans: cid, status: 'active' });
		if (!w) return this.errorReply(`No active war found for clan '${cid}'.`);
		if (w.paused) return this.errorReply("This war is already paused.");
		await ClanWars.updateOne({ _id: w._id }, { $set: { paused: true }, $unset: { pauseConfirmations: 1, resumeConfirmations: 1 } });
		const [c1, c2] = await Promise.all([
			Clans.findOne({ _id: w.clans[0] }),
			Clans.findOne({ _id: w.clans[1] }),
		]);
		if (!c1 || !c2) return this.errorReply("A clan was deleted.");
		const uw = await ClanWars.findOne({ _id: w._id });
		if (!uw) return this.errorReply("Failed to fetch war data after update.");
		const uid = `clan-war-card-${uw._id}`;
		const ch = generateWarCard(uw, c1, c2, 'challenger');
		const th = generateWarCard(uw, c1, c2, 'target');
		const ph = generateWarCard(uw, c1, c2, 'public');
		const r1 = Rooms.get(c1.chatRoom);
		const r2 = Rooms.get(c2.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (r1) r1.add(`|uhtmlchange|${uid}|${ch}`).update();
		if (r2) r2.add(`|uhtmlchange|${uid}|${th}`).update();
		if (lr) lr.add(`|uhtmlchange|${uid}|${ph}`).update();
		this.sendReply(`War between ${c1.name} and ${c2.name} has been paused.`);
	},

	async forceresume(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');
		const cid = toID(target);
		if (!cid) return this.errorReply("Usage: /clan war forceresume [clanid]");
		const w = await ClanWars.findOne({ clans: cid, status: 'active' });
		if (!w) return this.errorReply(`No active war found for clan '${cid}'.`);
		if (!w.paused) return this.errorReply("This war is not paused.");
		await ClanWars.updateOne({ _id: w._id }, { $set: { paused: false }, $unset: { pauseConfirmations: 1, resumeConfirmations: 1 } });
		const [c1, c2] = await Promise.all([
			Clans.findOne({ _id: w.clans[0] }),
			Clans.findOne({ _id: w.clans[1] }),
		]);
		if (!c1 || !c2) return this.errorReply("A clan was deleted.");
		const uw = await ClanWars.findOne({ _id: w._id });
		if (!uw) return this.errorReply("Failed to fetch war data after update.");
		const uid = `clan-war-card-${uw._id}`;
		const ch = generateWarCard(uw, c1, c2, 'challenger');
		const th = generateWarCard(uw, c1, c2, 'target');
		const ph = generateWarCard(uw, c1, c2, 'public');
		const r1 = Rooms.get(c1.chatRoom);
		const r2 = Rooms.get(c2.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (r1) r1.add(`|uhtmlchange|${uid}|${ch}`).update();
		if (r2) r2.add(`|uhtmlchange|${uid}|${th}`).update();
		if (lr) lr.add(`|uhtmlchange|${uid}|${ph}`).update();
		this.sendReply(`War between ${c1.name} and ${c2.name} has been resumed.`);
	},

	async clearpending(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');
		const [c1id, c2id] = target.split(',').map(s => toID(s.trim()));
		if (!c1id || !c2id) return this.errorReply("Usage: /clan war clearpending [clan1id], [clan2id]");
		const w = await ClanWars.findOne({ clans: { $all: [c1id, c2id] }, status: 'pending' });
		if (!w) return this.errorReply(`No pending war found between '${c1id}' and '${c2id}'.`);
		await ClanWars.deleteOne({ _id: w._id });
		const uid = `clan-war-card-${w._id}`;
		const [c1, c2] = await Promise.all([
			Clans.findOne({ _id: w.clans[0] }),
			Clans.findOne({ _id: w.clans[1] }),
		]);
		if (c1) {
			const r1 = Rooms.get(c1.chatRoom);
			if (r1) r1.add(`|uhtmlchange|${uid}|<div class="infobox">This challenge has been cleared by an admin.</div>`).update();
		}
		if (c2) {
			const r2 = Rooms.get(c2.chatRoom);
			if (r2) r2.add(`|uhtmlchange|${uid}|<div class="infobox">This challenge has been cleared by an admin.</div>`).update();
		}
		const lr = Rooms.get(LOBBY);
		if (lr) lr.add(`|uhtmlchange|${uid}|<div class="infobox">This challenge has been cleared by an admin.</div>`).update();
		this.sendReply(`Deleted pending war challenge between '${c1id}' and '${c2id}'.`);
	},

	async forcecreate(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');
		const [c1id, c2id, bos] = target.split(',').map(s => s.trim());
		const bo = parseInt(bos);
		if (!c1id || !c2id || isNaN(bo)) return this.errorReply("Usage: /clan war forcecreate [clan1id], [clan2id], [bestof]");
		if (bo < 1 || bo % 2 === 0) return this.errorReply("'Best of' must be an odd number (3, 5, 7, etc.).");
		if (bo > 101) return this.errorReply("'Best of' cannot be higher than 101.");
		const c1ID = toID(c1id);
		const c2ID = toID(c2id);
		const [c1, c2] = await Promise.all([
			Clans.findOne({ _id: c1ID }),
			Clans.findOne({ _id: c2ID }),
		]);
		if (!c1) return this.errorReply(`Clan '${c1id}' not found.`);
		if (!c2) return this.errorReply(`Clan '${c2id}' not found.`);
		if (c1ID === c2ID) return this.errorReply("Clans must be different.");
		const [c1ew, c2ew] = await Promise.all([
			ClanWars.findOne({ clans: c1ID, status: { $in: ['pending', 'active'] } }),
			ClanWars.findOne({ clans: c2ID, status: { $in: ['pending', 'active'] } }),
		]);
		if (c1ew) return this.errorReply(`${c1.name} is already in a war.`);
		if (c2ew) return this.errorReply(`${c2.name} is already in a war.`);
		const nw: Omit<ClanWar, '_id'> = {
			clans: [c1ID, c2ID],
			scores: { [c1ID]: 0, [c2ID]: 0 },
			status: 'active',
			startDate: Date.now(),
			bestOf: bo,
		};
		const ir = await ClanWars.insertOne(nw as ClanWarDoc);
		const wid = ir.insertedId;
		if (!wid) return this.errorReply("There was an error creating the war document. Aborting.");
		const w = await ClanWars.findOne({ _id: wid });
		if (!w) return this.errorReply("Failed to fetch the newly created war. Aborting.");
		const uid = `clan-war-card-${w._id}`;
		const lb = { winnerName: "Admin", loserName: `${user.name}`, winningClanName: "War forcibly started" };
		const ch = generateWarCard(w, c1, c2, 'challenger', { lastBattle: lb });
		const th = generateWarCard(w, c1, c2, 'target', { lastBattle: lb });
		const ph = generateWarCard(w, c1, c2, 'public', { lastBattle: lb });
		const r1 = Rooms.get(c1.chatRoom);
		const r2 = Rooms.get(c2.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (r1) r1.add(`|uhtml|${uid}|${ch}`).update();
		if (r2) r2.add(`|uhtml|${uid}|${th}`).update();
		if (lr) lr.add(`|uhtml|${uid}|${ph}`).update();
		this.sendReply(`Force-started an active war between ${c1.name} and ${c2.name}.`);
	},

	help() {
		if (!this.runBroadcast()) return;
		const hl = [
			{ cmd: "/clan war status [clanid]", desc: "View your clan's active/pending war status. Defaults to your clan." },
			{ cmd: "/clan war challenge [clanid], [bestof]", desc: "Challenge another clan to a War." },
			{ cmd: "/clan war accept [clanid]", desc: "Accept a pending war challenge." },
			{ cmd: "/clan war deny [clanid]", desc: "Deny a pending war challenge." },
			{ cmd: "/clan war cancel [clanid]", desc: "Cancel a pending war challenge you have sent." },
			{ cmd: "/clan war forfeit [clanid]", desc: "Forfeit your active war against an opponent." },
			{ cmd: "/clan war tie [clanid]", desc: "Propose or confirm ending an active war as a tie." },
			{ cmd: "/clan war extend [clanid], [newbestof]", desc: "Propose or confirm extending an active war to more battles." },
			{ cmd: "/clan war pause [clanid]", desc: "Propose or confirm pausing an active war." },
			{ cmd: "/clan war resume [clanid]", desc: "Propose or confirm resuming a paused war." },
			{ cmd: "/clan war rematch [clanid], [bestof]", desc: "Challenge a clan to a rematch, bypassing the 24h cooldown." },
			{ cmd: "/clan war ladder [page], [sortby]", desc: "View the War ladder. Sort by elo, wins, losses, winrate." },
			{ cmd: "/clan war stats [clanid]", desc: "View a clan's detailed war statistics." },
			{ cmd: "/clan war history [clanid]", desc: "View a clan's completed war history." },
			{ cmd: "/clan war record [clan1], [clan2]", desc: "View the head-to-head rivalry between two clans." },
			{ cmd: "/clan war mvp [clanid]", desc: "View the top trainers (MVPs) for a clan." },
			{ cmd: "/clan war forceend [clanid]", desc: "Forcefully end an active war. Requires: &." },
			{ cmd: "/clan war forcetie [clanid]", desc: "Forcefully end an active war as a tie. Requires: &." },
			{ cmd: "/clan war forfeitadmin [loserclanid], [winnerclanid]", desc: "Force a clan to forfeit to another. Requires: &." },
			{ cmd: "/clan war resetcooldown [clanid]", desc: "Reset a clan's war challenge cooldown. Requires: &." },
			{ cmd: "/clan war setscore [clan1id], [score1], [clan2id], [score2]", desc: "Manually adjust battle score of an active war. Requires: &." },
			{ cmd: "/clan war setbestof [clan1id], [clan2id], [newbestof]", desc: "Change the 'Best of' format for an active war. Requires: &." },
			{ cmd: "/clan war forcepause [clanid]", desc: "Forcibly pause an active war. Requires: &." },
			{ cmd: "/clan war forceresume [clanid]", desc: "Forcibly resume a paused war. Requires: &." },
			{ cmd: "/clan war clearpending [clan1id], [clan2id]", desc: "Delete a pending war challenge. Requires: &." },
			{ cmd: "/clan war forcecreate [clan1id], [clan2id], [bestof]", desc: "Instantly create an active war. Requires: &." },
		];
		const h = `<center><strong>Clan War Commands</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			hl.map(({ cmd, desc }, i) =>
				`<li><b>${cmd}</b> - ${desc}</li>${i < hl.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(`<div style="max-height: 380px; overflow-y: auto;">${h}</div>`);
	},

	async forcetie(target, room, user) {
		this.checkChat();
		this.checkCan('roomowner');
		const tcid = toID(target);
		if (!tcid) return this.errorReply("Specify a clan ID. Usage: /clan war forcetie [clanid]");
		const tc = await Clans.findOne({ _id: tcid });
		if (!tc) return this.errorReply(`Clan '${tcid}' not found.`);
		const w = await ClanWars.findOne({ clans: tcid, status: 'active' });
		if (!w) return this.errorReply(`No active war found for clan '${tcid}'.`);
		await ClanWars.updateOne({ _id: w._id }, { $set: { status: 'completed', endDate: Date.now() } });
		const [c1, c2] = await Promise.all([
			Clans.findOne({ _id: w.clans[0] }),
			Clans.findOne({ _id: w.clans[1] }),
		]);
		if (!c1 || !c2) return this.errorReply("A clan was deleted.");
		const s1 = w.scores[c1._id] || 0;
		const s2 = w.scores[c2._id] || 0;
		const uid = `clan-war-card-${w._id}`;
		const em = `[ADMIN] ${user.name} has declared the war a tie. Final Score: ${s1} - ${s2}`;
		const eh = generateWarCard(w, c1, c2, 'ended', { endMessage: em });
		const r1 = Rooms.get(c1.chatRoom);
		const r2 = Rooms.get(c2.chatRoom);
		const lr = Rooms.get(LOBBY);
		if (r1) r1.add(`|uhtmlchange|${uid}|${eh}`).update();
		if (r2) r2.add(`|uhtmlchange|${uid}|${eh}`).update();
		if (lr) lr.add(`|uhtmlchange|${uid}|${eh}`).update();
		this.sendReply(`Force tied the war between ${c1.name} and ${c2.name}.`);
	},
};