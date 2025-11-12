// TCG Collections Commands - @author PrinceSky-Git
import type { TcgCard, TcgUser } from './interface';
import { getSet, getCacheStats, calculateSetsCompleted } from './tcg_utils';
import { tcgCardsCollection, userCollectionsCollection,
	userProfilesCollection, userPacksCollection } from './tcg_collections';
const SEARCH_PAGE_LIMIT = 80;
const MAX_FAVORITE_CARDS = 10;
function parseCollectionQuery(target: string, defUserId: string): {
	filter: any, queryDescription: string, page: number, commandString: string, targetUserId: string,
} {
	const parts = target.split(',');
	let page = 1, query = target.trim(), cmdStrPag = query;
	if (parts.length > 1) {
		const lastPart = parts[parts.length - 1].trim();
		const potPage = parseInt(lastPart);
		if (!isNaN(potPage)) {
			page = Math.max(1, potPage);
			query = parts.slice(0, -1).join(',').trim();
			cmdStrPag = query;
		}
	}
	let tUserId = defUserId;
	const filter: any = { $and: [] };
	const descs: string[] = [];
	const fRegex = /(\w+)\s*:\s*([<=>]{1,2})?("[^"]+"|[\w-]+)\s*,?\s*/g;
	const fMatches: string[] = [];
	let match;
	fRegex.lastIndex = 0;
	while ((match = fRegex.exec(query)) !== null) {
		fMatches.push(match[0]);
		const key = match[1].toLowerCase();
		const operator = match[2];
		const value = match[3].replace(/"/g, '');
		if (key === 'user') {
			tUserId = value.toLowerCase().replace(/[^a-z0-9]/g, '');
			continue;
		}
		const valueNum = parseInt(value);
		const escVal = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const valRegex = new RegExp(escVal, 'i');
		switch (key) {
		case 'rarity':
			filter.$and.push({ rarity: valRegex });
			descs.push(`Rarity: ${value}`);
			break;
		case 'supertype':
		case 'st':
			filter.$and.push({ supertype: valRegex });
			descs.push(`Supertype: ${value}`);
			break;
		case 'subtype':
			filter.$and.push({ subtypes: valRegex });
			descs.push(`Subtype: ${value}`);
			break;
		case 'type':
			filter.$and.push({ types: valRegex });
			descs.push(`Type: ${value}`);
			break;
		case 'hp':
			if (!isNaN(valueNum)) {
				let hpFilter: any = {};
				if (operator === '>') hpFilter = { $gt: valueNum };
				else if (operator === '>=') hpFilter = { $gte: valueNum };
				else if (operator === '<') hpFilter = { $lt: valueNum };
				else if (operator === '<=') hpFilter = { $lte: valueNum };
				else hpFilter = valueNum;
				filter.$and.push({ hp: hpFilter });
				descs.push(`HP: ${operator || ''}${value}`);
			}
			break;
		case 'series':
			filter.$and.push({ setSeries: valRegex });
			descs.push(`Series: ${value}`);
			break;
		case 'reg':
			filter.$and.push({ regulationMark: valRegex });
			descs.push(`Reg Mark: ${value}`);
			break;
		case 'set':
			const exactRegex = new RegExp("^" + escVal + "$", 'i');
			filter.$and.push({ setId: exactRegex });
			descs.push(`Set ID: ${value}`);
			break;
		case 'artist':
		case 'legal':
			descs.push(`(Filter ${key}:${value} ignored)`);
			break;
		}
	}
	filter.$and.push({ userId: tUserId });
	let nameQuery = query;
	for (const mf of fMatches) nameQuery = nameQuery.replace(mf, '');
	const nameClean = nameQuery.trim();
	if (nameClean) {
		const nameRegex = new RegExp(nameClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
		filter.$and.push({ name: nameRegex });
		descs.unshift(`Name: '${nameClean}'`);
	}
	const filterDesc = descs.length > 0 ? descs.join(', ') : 'All Cards';
	let qDesc = `Owner: ${tUserId}`;
	if (descs.length > 0) qDesc += `, ${filterDesc}`;
	else qDesc += ', All Cards';
	let finalCmd = cmdStrPag.replace(/user:\s*("[^"]+"|[\w-]+)\s*,?\s*/gi, '').trim();
	finalCmd = finalCmd.replace(/,\s*$/, '').trim();
	return { filter, queryDescription: qDesc, page, commandString: finalCmd, targetUserId: tUserId };
}
export const collectionCommands: ChatCommands = {
	async collection(target, room, user) {
		if (!this.runBroadcast()) return;
		try {
			const { filter, queryDescription: qDesc, page, commandString: cmdStr, targetUserId: tUserId } = parseCollectionQuery(target, user.id);
			const coll = userCollectionsCollection;
			const statsPipe: any[] = [
				{ $match: filter },
				{ $group: { _id: null, totalUniqueCards: { $sum: 1 }, totalQuantity: { $sum: "$quantity" }, totalPoints: { $sum: { $multiply: ["$totalPoints", "$quantity"] } } } },
			];
			const statsRes = await coll.aggregate(statsPipe);
			const stats = statsRes[0] || { totalUniqueCards: 0, totalQuantity: 0, totalPoints: 0 };
			const totMatches = stats.totalUniqueCards;
			if (totMatches === 0) {
				return this.errorReply(`No cards found in ${tUserId}'s collection matching: ${qDesc.replace(`Owner: ${tUserId}, `, '')}.`);
			}
			const totPages = Math.ceil(totMatches / SEARCH_PAGE_LIMIT);
			const curPage = Math.min(page, totPages);
			const skip = (curPage - 1) * SEARCH_PAGE_LIMIT;
			const pipe: any[] = [
				{ $match: filter },
				{ $sort: { totalPoints: -1, cardId: 1 } },
				{ $skip: skip },
				{ $limit: SEARCH_PAGE_LIMIT },
			];
			const results = await coll.aggregate<TcgUser>(pipe);
			let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
			const dispName = tUserId === user.id ? user.name : tUserId;
			html += `<strong style="font-size: 20px;">${dispName}'s Card Collection</strong><br />`;
			html += `<div style="font-size: 0.9em; margin-bottom: 5px;">Total Cards: ${stats.totalQuantity.toLocaleString()} | Total Points: ${stats.totalPoints.toLocaleString()}</div>`;
			const filtersOnly = qDesc.replace(`Owner: ${tUserId}, `, '').replace(`Owner: ${tUserId}`, '');
			if (filtersOnly && filtersOnly !== 'All Cards') {
				html += `<div style="font-size: 0.8em; color: #555; margin-bottom: 10px;">Filters: ${filtersOnly}</div>`;
			}
			html += `<div style="font-size: 0.9em; margin-bottom: 10px;">Showing ${results.length} of ${totMatches.toLocaleString()} unique cards.</div>`;
			if (results.length === 0) html += `No results found for this page.`;
			for (let i = 0; i < results.length; i++) {
				const c = results[i];
				if (i % 4 === 0) {
					if (i > 0) html += `</div><hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
					html += `<div style="display: inline-block; text-align: center;">`;
				}
				const w = 74, h = 103;
				const url = c.imageUrl || `https://via.placeholder.com/${w}x${h}?text=No+Image`;
				const name = c.name || c.cardId;
				const alt = `${name} (${c.cardId})`;
				html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top; position: relative;">`;
				html += `<div style="position: absolute; top: -5px; right: -5px; background: #0055cc; color: white; border-radius: 10px; padding: 2px 6px; font-size: 0.8em; font-weight: bold; z-index: 1;">x${c.quantity}</div>`;
				html += `<button name="send" value="/tcg card ${c.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
				html += `<img src="${url}" width="${w}" height="${h}" alt="${alt}" title="${alt}" style="border-radius: 8px; display: block;" />`;
				html += `</button>`;
				html += `<div style="font-size: 0.85em; margin-top: 3px;">${name}</div>`;
				html += `<div style="font-size: 0.75em;">[ ${c.cardId} ]<br>${c.rarity}</div>`;
				html += `</div>`;
			}
			if (results.length > 0) html += `</div>`;
			if (totPages > 1) {
				html += `<hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
				html += `<div style="display: flex; justify-content: center; align-items: center; margin-top: 10px; gap: 20px;">`;
				if (curPage > 1) {
					html += `<button name="send" value="/tcg collection ${cmdStr}, ${curPage - 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">&lt; Previous</button>`;
				}
				html += `<div style="font-size: 0.9em; color: #555;">Page ${curPage} of ${totPages}</div>`;
				if (curPage < totPages) {
					html += `<button name="send" value="/tcg collection ${cmdStr}, ${curPage + 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Next &gt;</button>`;
				}
				html += `</div>`;
			}
			html += `</div>`;
			this.sendReply(`|html|${html}`);
		} catch {
			return this.errorReply('An error occurred while fetching your collection.');
		}
	},

	async setprogress(target, room, user) {
		if (!this.runBroadcast()) return;
		const setId = target.trim().toLowerCase();
		if (!setId) return this.errorReply('Usage: /tcg setprogress [setid]');
		const tUserId = user.id;
		try {
			let setInfo: TcgCard | null = null;
			const cacheInit = getCacheStats().isInitialized;
			const cardColl = tcgCardsCollection;
			if (cacheInit) {
				setInfo = getSet(setId);
			} else {
				setInfo = await cardColl.findOne({ setId });
			}
			if (!setInfo) {
				return this.errorReply(`Set with ID "${setId}" not found.`);
			}
			const setName = setInfo.set;
			const setLogo = setInfo.setImages?.logo || '';
			const canonSetId = setInfo.setId;
			let totInSet = setInfo.setTotal || 0;
			if (totInSet === 0) {
				totInSet = await cardColl.countDocuments({ setId: canonSetId });
				if (totInSet === 0) {
					return this.errorReply(`Set with ID "${setId}" has no cards in the database.`);
				}
			}
			const userColl = userCollectionsCollection;
			const userUniqCnt = await userColl.countDocuments({ userId: tUserId, setId: canonSetId });
			const pct = (totInSet > 0) ? (userUniqCnt / totInSet) * 100 : 0;
			const barW = 200;
			const progW = Math.max(0, (barW * pct) / 100);
			const dispName = user.name;
			let html = `<div class="infobox" style="padding: 15px;">`;
			html += `<div style="display: flex; align-items: center; margin-bottom: 10px;">`;
			if (setLogo) html += `<img src="${setLogo}" height="30" alt="${setName} Logo" title="${setName} Logo" style="margin-right: 10px;" />`;
			html += `<strong style="font-size: 1.5em;">${setName} Set Progress</strong>`;
			html += `</div>`;
			html += `<div style="font-size: 0.9em; color: #555; margin-bottom: 15px;">For: <strong>${dispName}</strong></div>`;
			html += `<strong>Collection:</strong> ${userUniqCnt} / ${totInSet} unique cards<br />`;
			html += `<strong>Completion:</strong> ${pct.toFixed(1)}%<br />`;
			html += `<div style="background: #eee; border: 1px solid #ccc; border-radius: 4px; width: ${barW}px; height: 20px; margin-top: 8px;">`;
			html += `<div style="background: #4CAF50; width: ${progW}px; height: 100%; border-radius: 4px;"></div>`;
			html += `</div></div>`;
			this.sendReply(`|html|${html}`);
		} catch {
			return this.errorReply('An error occurred while fetching your set progress.');
		}
	},

	async missing(target, room, user) {
		if (!this.runBroadcast()) return;
		const parts = target.split(',').map(p => p.trim());
		const setId = parts[0].toLowerCase();
		let tUserId = user.id;
		let tUserName = user.name;
		let page = 1;
		if (!setId) return this.errorReply('Usage: /tcg missing [setid]');
		let cmdStr = setId;
		if (parts.length === 3) {
			tUserId = toID(parts[1]) || user.id;
			tUserName = parts[1] || user.name;
			page = parseInt(parts[2]);
			if (isNaN(page)) page = 1;
			cmdStr = `${setId}, ${tUserName}`;
		} else if (parts.length === 2) {
			const part2 = parts[1];
			const potPage = parseInt(part2);
			if (!isNaN(potPage)) {
				page = Math.max(1, potPage);
				cmdStr = setId;
			} else {
				tUserId = toID(part2) || user.id;
				tUserName = part2 || user.name;
				cmdStr = `${setId}, ${tUserName}`;
			}
		}
		try {
			const cardColl = tcgCardsCollection;
			let setInfo: TcgCard | null | undefined = getSet(setId);
			if (!setInfo) setInfo = await cardColl.findOne({ setId });
			if (!setInfo) return this.errorReply(`Set with ID "${setId}" not found.`);
			const setName = setInfo.set;
			const canonSetId = setInfo.setId;
			const allSetCnt = await cardColl.countDocuments({ setId: canonSetId });
			if (allSetCnt === 0) return this.errorReply(`No cards found for set "${setId}".`);
			const cntPipe: any[] = [
				{ $match: { setId: canonSetId } },
				{ $lookup: {
					from: 'tcg_collections',
					let: { card_id: "$cardId" },
					pipeline: [
						{ $match: { $expr: { $and: [{ $eq: ["$cardId", "$$card_id"] }, { $eq: ["$userId", tUserId] }] } } },
						{ $project: { _id: 1 } },
					],
					as: 'userCollectionEntry',
				} },
				{ $match: { userCollectionEntry: { $eq: [] } } },
				{ $count: 'total' },
			];
			const cntRes = await cardColl.aggregate(cntPipe);
			const totMatches = cntRes[0]?.total || 0;
			if (totMatches === 0) return this.sendReply(`Congratulations! ${tUserName} has completed the set "${setName}"!`);
			const limit = SEARCH_PAGE_LIMIT;
			const totPages = Math.ceil(totMatches / limit);
			const curPage = Math.min(page, totPages);
			const skip = (curPage - 1) * limit;
			const dataPipe: any[] = [
				{ $match: { setId: canonSetId } },
				{ $lookup: {
					from: 'tcg_collections',
					let: { card_id: "$cardId" },
					pipeline: [
						{ $match: { $expr: { $and: [{ $eq: ["$cardId", "$$card_id"] }, { $eq: ["$userId", tUserId] }] } } },
						{ $project: { _id: 1 } },
					],
					as: 'userCollectionEntry',
				} },
				{ $match: { userCollectionEntry: { $eq: [] } } },
				{ $sort: { cardId: 1 } },
				{ $skip: skip },
				{ $limit: limit },
				{ $project: { name: 1, cardId: 1, rarity: 1, imageUrl: 1 } },
			];
			const pagRes = await cardColl.aggregate(dataPipe);
			let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
			html += `<strong style="font-size: 20px;">Missing Cards from ${setName}</strong><br />`;
			html += `<div style="font-size: 0.9em; margin-bottom: 5px;">For: ${tUserName}</div>`;
			html += `<div style="font-size: 0.9em; margin-bottom: 10px;">Missing ${totMatches} of ${allSetCnt} cards.</div>`;
			if (pagRes.length === 0) html += `No results found for this page.`;
			for (let i = 0; i < pagRes.length; i++) {
				const c = pagRes[i];
				if (i % 4 === 0) {
					if (i > 0) html += `</div><hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
					html += `<div style="display: inline-block; text-align: center;">`;
				}
				const w = 74, h = 103;
				const url = c.imageUrl || `https://via.placeholder.com/${w}x${h}?text=No+Image`;
				const alt = `${c.name} (${c.cardId})`;
				html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top;">`;
				html += `<button name="send" value="/tcg card ${c.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
				html += `<img src="${url}" width="${w}" height="${h}" alt="${alt}" title="${alt}" style="border-radius: 8px; display: block;" />`;
				html += `</button>`;
				html += `<div style="font-size: 0.85em; margin-top: 3px;">${c.name}</div>`;
				html += `<div style="font-size: 0.75em;">[ ${c.cardId} ]<br>${c.rarity}</div>`;
				html += `</div>`;
			}
			if (pagRes.length > 0) html += `</div>`;
			if (totPages > 1) {
				html += `<hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
				html += `<div style="display: flex; justify-content: center; align-items: center; margin-top: 10px; gap: 20px;">`;
				if (curPage > 1) {
					html += `<button name="send" value="/tcg missing ${cmdStr}, ${curPage - 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">&lt; Previous</button>`;
				}
				html += `<div style="font-size: 0.9em; color: #555;">Page ${curPage} of ${totPages}</div>`;
				if (curPage < totPages) {
					html += `<button name="send" value="/tcg missing ${cmdStr}, ${curPage + 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Next &gt;</button>`;
				}
				html += `</div>`;
			}
			html += `</div>`;
			this.sendReply(`|html|${html}`);
		} catch {
			return this.errorReply('An error occurred while fetching missing cards.');
		}
	},

	async packs(target, room, user) {
		if (!this.runBroadcast()) return;
		try {
			const coll = userPacksCollection;
			const userPacks = await coll.find({ userId: user.id, quantity: { $gt: 0 } }, { sort: { setName: 1 } });
			if (userPacks.length === 0) {
				return this.errorReply("You do not have any saved packs. You can buy them from the /tcg shop.");
			}
			let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
			html += `<strong style="font-size: 20px;">${user.name}'s Saved Packs</strong><br />`;
			html += `<div style="font-size: 0.9em; margin-bottom: 15px;">Click a pack to open one.</div>`;
			for (let i = 0; i < userPacks.length; i++) {
				const p = userPacks[i];
				if (i % 3 === 0) {
					if (i > 0) html += `</div><hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
					html += `<div style="display: inline-block; text-align: center;">`;
				}
				const logoUrl = p.setLogo || `https://via.placeholder.com/80x30?text=${p.setId}`;
				html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top; width: 120px;">`;
				html += `<button name="send" value="/tcg opensavedpack ${p.setId}" style="background: none; border: 1px solid #ccc; border-radius: 8px; padding: 10px; width: 100%; text-align: center; cursor: pointer; min-height: 90px;">`;
				html += `<img src="${logoUrl}" height="30" alt="${p.setName} Logo" title="${p.setName} Logo" style="max-width: 100px; display: block; margin: 0 auto 5px auto;" />`;
				html += `<strong style="font-size: 0.9em; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.setName}</strong>`;
				html += `<span style="font-size: 0.8em;">[ ${p.setId} ]<br>Quantity: ${p.quantity}</span>`;
				html += `</button>`;
				if (p.quantity > 1) {
					html += `<button name="send" value="/tcg openallpacks ${p.setId}" style="background: none; border: 1px solid #aaa; border-radius: 4px; padding: 2px 5px; width: 100%; text-align: center; cursor: pointer; font-size: 0.75em; margin-top: 3px;">`;
					html += `Open All ${p.quantity}`;
					html += `</button>`;
				}
				html += `</div>`;
			}
			if (userPacks.length > 0) html += `</div>`;
			html += `</div>`;
			this.sendReply(`|html|${html}`);
		} catch {
			return this.errorReply('An error occurred while fetching your packs.');
		}
	},

	async profile(target, room, user) {
		if (!this.runBroadcast()) return;
		const tUserId = toID(target) || user.id;
		const profs = userProfilesCollection;
		const prof = await profs.findOne({ userId: tUserId });
		if (!prof) {
			const errMsg = tUserId === user.id ? "You do not have a TCG profile yet. Claim your /tcg daily to start!" : `User "${tUserId}" does not have a TCG profile.`;
			return this.errorReply(errMsg);
		}
		const favCardIds = prof.favoriteCards || [];
		let ordFavCards: Partial<TcgCard>[] = [];
		if (favCardIds.length > 0) {
			const cardColl = tcgCardsCollection;
			const favCardsData = await cardColl.find(
				{ cardId: { $in: favCardIds } },
				{ projection: { cardId: 1, imageUrl: 1, name: 1, rarity: 1 } }
			);
			const cardMap = new Map<string, Partial<TcgCard>>();
			for (const card of favCardsData) cardMap.set(card.cardId, card);
			ordFavCards = favCardIds.map(id => cardMap.get(id)).filter((card): card is Partial<TcgCard> => !!card);
		}
		const { setsCached } = getCacheStats();
		const totSets = Math.max(1, setsCached);
		const setsComp = prof.totalSetsCompleted || 0;
		const setCompPct = (setsComp / totSets) * 100;
		const totTrades = prof.totalTrades || 0;
		const w = 160, h = 222;
		let html = `<div class="infobox" style="display: flex; align-items: stretch; padding: 15px; min-height: ${h + 30}px;">`;
		html += `<div style="flex: 0 0 ${w + 20}px; padding-right: 20px; border-right: 1px solid #ccc; overflow-y: hidden; text-align: center;">`;
		html += `<div style="overflow-x: scroll; overflow-y: hidden; white-space: nowrap; max-width: ${w + 20}px;">`;
		if (ordFavCards.length > 0) {
			for (const c of ordFavCards) {
				const url = c.imageUrl || `https://via.placeholder.com/${w}x${h}?text=No+Image`;
				const alt = `${c.name} (${c.cardId})`;
				html += `<div style="display: inline-block; margin-right: 10px; width: ${w}px; vertical-align: top;">`;
				html += `<button name="send" value="/tcg card ${c.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
				html += `<img src="${url}" width="${w}" height="${h}" alt="${alt}" title="${alt}" style="border-radius: 8px; display: block;" />`;
				html += `</button>`;
				html += `<div style="font-size: 0.85em; margin-top: 3px; white-space: pre-wrap;">${c.name}</div>`;
				html += `<div style="font-size: 0.75em; white-space: pre-wrap;">[ ${c.cardId} ]<br>${c.rarity}</div>`;
				html += `</div>`;
			}
		} else {
			html += `<div style="color: #888; text-align: center; padding-top: 50px; font-size: 0.9em; white-space: pre-wrap; width: ${w}px;">`;
			html += `No favorite cards set.<br /><br />Use<br />/tcg favorite [cardId]`;
			html += `</div>`;
		}
		html += `</div></div>`;
		html += `<div style="flex: 1; line-height: 1.7; margin-left: 20px; max-height: ${h + 30}px; overflow-y: auto;">`;
		html += `<strong style="font-size: 22px;">${prof.userName}</strong><br />`;
		html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
		html += `<strong>Collection Points:</strong> ${prof.collectionPoints.toLocaleString()}<br />`;
		html += `<strong>Total Cards:</strong> ${prof.totalQuantity.toLocaleString()}<br />`;
		html += `<strong>Unique Cards:</strong> ${prof.totalUniqueCards.toLocaleString()}<br />`;
		html += `<strong>Credits:</strong> ${prof.credits.toLocaleString()}<br />`;
		html += `<strong>Sets Completed:</strong> ${setsComp} / ${totSets} (${setCompPct.toFixed(1)}%)<br />`;
		html += `<strong>Trades:</strong> ${totTrades.toLocaleString()}<br />`;
		html += `<strong>Last Active:</strong> ${new Date(prof.lastUpdatedAt).toLocaleDateString()}<br />`;
		html += `</div></div></div>`;
		this.sendReply(`|html|${html}`);
	},

	async favorite(target, room, user) {
		const cardId = target.trim();
		if (!cardId) return this.errorReply('Usage: /tcg favorite [cardid]');
		const profs = userProfilesCollection;
		const colls = userCollectionsCollection;
		try {
			const userCard = await colls.findOne({ userId: user.id, cardId });
			if (!userCard) return this.errorReply(`You do not own this card. You can only favorite cards from your collection.`);
			const prof = await profs.findOne({ userId: user.id });
			const curFavs = prof?.favoriteCards || [];
			if (curFavs.includes(cardId)) return this.errorReply(`"${userCard.name}" is already in your favorites.`);
			if (curFavs.length >= MAX_FAVORITE_CARDS) {
				return this.errorReply(`You already have ${MAX_FAVORITE_CARDS} favorite cards. Use /tcg unfavorite [cardId] to remove one first.`);
			}
			const res = await profs.updateOne({ userId: user.id }, { $addToSet: { favoriteCards: cardId } });
			if (res.modifiedCount > 0) {
				this.sendReply(`Added "${userCard.name}" to your profile favorites.`);
			} else {
				this.errorReply(`"${userCard.name}" is already in your favorites.`);
			}
		} catch {
			return this.errorReply('An error occurred while adding your favorite card.');
		}
	},

	async unfavorite(target, room, user) {
		const tgtId = target.trim().toLowerCase();
		if (!tgtId) return this.errorReply('Usage: /tcg unfavorite [cardid|all]');
		const profs = userProfilesCollection;
		try {
			let res;
			if (tgtId === 'all') {
				res = await profs.updateOne({ userId: user.id }, { $set: { favoriteCards: [] } });
				if (res.modifiedCount > 0) {
					this.sendReply(`Removed all cards from your profile favorites.`);
				} else {
					const prof = await profs.findOne({ userId: user.id });
					if (prof && (!prof.favoriteCards || prof.favoriteCards.length === 0)) {
						this.errorReply(`Your favorites list is already empty.`);
					} else {
						this.errorReply(`Could not find your profile or your favorites list was already empty.`);
					}
				}
			} else {
				const cardId = target.trim();
				res = await profs.updateOne({ userId: user.id }, { $pull: { favoriteCards: cardId } });
				if (res.modifiedCount > 0) {
					this.sendReply(`Removed card "${cardId}" from your profile favorites.`);
				} else {
					this.errorReply(`Card "${cardId}" was not in your favorites list.`);
				}
			}
		} catch {
			const action = tgtId === 'all' ? 'removing all your favorite cards' : 'removing your favorite card';
			return this.errorReply(`An error occurred while ${action}.`);
		}
	},

	async recalculatestats(target, room, user) {
		let tUserId = toID(target);
		if (tUserId) {
			this.checkCan('bypassall');
		} else {
			tUserId = user.id;
		}
		this.sendReply(`Starting stats recalculation for ${tUserId}... This may take a while.`);
		try {
			const cardColl = tcgCardsCollection;
			const userColl = userCollectionsCollection;
			const profColl = userProfilesCollection;
			const setsComp = await calculateSetsCompleted(tUserId);
			const setTotPipe = [
				{ $group: { _id: "$setId" } },
				{ $count: "totalSets" },
			];
			const setCntRes = await cardColl.aggregate(setTotPipe);
			const totSets = setCntRes[0]?.totalSets || 0;
			const allStatsPipe = [
				{ $match: { userId: tUserId } },
				{
					$group: {
						_id: null,
						totalUniqueCards: { $sum: 1 },
						totalQuantity: { $sum: "$quantity" },
						collectionPoints: { $sum: { $multiply: ["$totalPoints", "$quantity"] } },
					},
				},
			];
			const statsRes = await userColl.aggregate(allStatsPipe);
			const stats = statsRes[0] || { totalUniqueCards: 0, totalQuantity: 0, collectionPoints: 0 };
			const prof = await profColl.findOne({ userId: tUserId });
			const curCreds = prof?.credits || 0;
			const userName = prof?.userName || tUserId;
			const curFavs = prof?.favoriteCards || [];
			await profColl.updateOne(
				{ userId: tUserId },
				{
					$set: {
						userName,
						credits: curCreds,
						totalUniqueCards: stats.totalUniqueCards,
						totalQuantity: stats.totalQuantity,
						collectionPoints: stats.collectionPoints,
						totalSetsCompleted: setsComp,
						favoriteCards: curFavs,
						lastUpdatedAt: new Date().toISOString(),
					},
				},
				{ upsert: true }
			);
			this.sendReply(`Recalculation complete for ${tUserId}:`);
			this.sendReply(`- Sets Completed: ${setsComp} / ${totSets}`);
			this.sendReply(`- Total Points: ${stats.collectionPoints.toLocaleString()}`);
			this.sendReply(`- Unique Cards: ${stats.totalUniqueCards.toLocaleString()}`);
		} catch {
			return this.errorReply(`An error occurred during recalculation: ${error.message}`);
		}
	},
};
