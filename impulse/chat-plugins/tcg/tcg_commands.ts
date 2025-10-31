/*
* Pokemon Showdown
* TCG Commands
*/
import type { TcgCard, TcgUserProfile, TcgUserPack } from './interface';
import {
	generatePack,
	getCard,
	getSet,
	getCacheStats,
	renderCardGridHtml,
	addCardsToCollection,
} from './tcg_utils';
import { generateThemedTable } from '../../utils';
import { adminCommands } from './tcg_admin_cmds';
import { economyCommands } from './tcg_economy_cmds';
import { collectionCommands } from './tcg_collections_cmds';
import { tradeCommands } from './tcg_trade_cmds';
import {
	tcgCardsCollection,
	userProfilesCollection,
	userPacksCollection,
	cooldownsCollection,
} from './tcg_collections';

const SEARCH_PAGE_LIMIT = 40;

function parseSearchQuery(target: string): { filter: any, queryDescription: string, page: number, commandString: string } {
	const parts = target.split(',');
	let page = 1, query = target.trim(), commandString = query;

	if (parts.length > 1) {
		const lastPart = parts[parts.length - 1].trim();
		const potentialPage = parseInt(lastPart);
		if (!isNaN(potentialPage)) {
			page = Math.max(1, potentialPage);
			query = parts.slice(0, -1).join(',').trim();
			commandString = query;
		}
	}

	const filter: any = { $and: [] };
	const descriptions: string[] = [];
	const filterRegex = /(\w+)\s*:\s*([<=>]{1,2})?"([^"]+)"|([\w-]+)/g;
	let nameQuery = query, match;

	while ((match = filterRegex.exec(query)) !== null) {
		const key = match[1].toLowerCase();
		const operator = match[2];
		const value = match[3].replace(/"/g, '');
		nameQuery = nameQuery.replace(match[0], '');

		const valueNum = parseInt(value);
		const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const valueRegex = new RegExp(escapedValue, 'i');

		switch (key) {
		case 'rarity':
			filter.$and.push({ rarity: valueRegex });
			descriptions.push(`Rarity: ${value}`);
			break;
		case 'supertype':
		case 'st':
			filter.$and.push({ supertype: valueRegex });
			descriptions.push(`Supertype: ${value}`);
			break;
		case 'subtype':
			filter.$and.push({ subtypes: valueRegex });
			descriptions.push(`Subtype: ${value}`);
			break;
		case 'type':
			filter.$and.push({ types: valueRegex });
			descriptions.push(`Type: ${value}`);
			break;
		case 'artist':
			filter.$and.push({ artist: valueRegex });
			descriptions.push(`Artist: ${value}`);
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
				descriptions.push(`HP: ${operator || ''}${value}`);
			}
			break;
		case 'legal':
			const legalKey = `legalities.${value.toLowerCase()}`;
			filter.$and.push({ [legalKey]: 'Legal' });
			descriptions.push(`Legal: ${value}`);
			break;
		case 'series':
			filter.$and.push({ setSeries: valueRegex });
			descriptions.push(`Series: ${value}`);
			break;
		case 'reg':
			filter.$and.push({ regulationMark: valueRegex });
			descriptions.push(`Reg Mark: ${value}`);
			break;
		case 'set':
			const partialRegex = new RegExp(escapedValue, 'i');
			const exactRegex = new RegExp("^" + escapedValue + "$", 'i');
			filter.$and.push({ $or: [{ set: partialRegex }, { setId: exactRegex }] });
			descriptions.push(`Set: ${value}`);
			break;
		}
	}

	const nameQueryClean = nameQuery.trim();
	if (nameQueryClean) {
		const nameRegex = new RegExp(nameQueryClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
		filter.$and.push({ name: nameRegex });
		descriptions.unshift(`'${nameQueryClean}'`);
	}

	if (filter.$and.length === 0) delete filter.$and;
	const queryDescription = descriptions.length > 0 ? descriptions.join(', ') : 'All Cards';
	return { filter, queryDescription, page, commandString };
}

export const commands: ChatCommands = {
	tcg: 'pokemontcg',
	pokemontcg: {
		async card(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) return this.errorReply('Usage: /tcg card [cardid]');

			const cardId = target.trim();
			let card: TcgCard | null = null;
			const cacheInitialized = getCacheStats().isInitialized;

			try {
				if (cacheInitialized) card = getCard(cardId) || null;
				if (!card) {
					const collection = tcgCardsCollection;
					card = await collection.findOne({ cardId });
				}
				if (!card) return this.errorReply(`Card with ID "${cardId}" not found. (Cache: ${cacheInitialized ? 'On' : 'Off'})`);
			} catch {
				return this.errorReply('An error occurred while fetching card information.');
			}

			const originalWidth = 246, originalHeight = 342, scaleFactor = 0.65;
			const imageWidth = Math.round(originalWidth * scaleFactor);
			const imageHeight = Math.round(originalHeight * scaleFactor);
			const imageUrl = card.imageUrl || ``;
			const subtypes = card.subtypes?.length > 0 ? card.subtypes.join(' | ') : 'N/A';
			const imageAlt = `${card.name} (${card.cardId})`;

			let html = `<div class="infobox" style="display: flex; align-items: center; padding: 15px;">`;
			html += `<div style="flex-shrink: 0; padding-right: 20px; border-right: 1px solid #ccc;">`;
			html += `<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${imageAlt}" title="${imageAlt}" style="border-radius: 8px; display: block;" />`;
			html += `</div>`;
			html += `<div style="flex: 1; line-height: 1.6; margin-left: 20px; max-height: ${imageHeight}px; overflow-y: auto;">`;
			html += `<strong style="font-size: 22px;">${card.name}</strong> <span style="font-size: 0.9em; margin-left: 5px;">(${card.cardId})</span><br />`;
			html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
			html += `<strong style="font-size: 1.1em;">Set:</strong> ${card.set} <span style="font-size: 0.9em;">(${card.setId})</span><br />`;
			html += `<strong style="font-size: 1.1em;">Rarity:</strong> ${card.rarity}<br />`;
			html += `<strong style="font-size: 1.1em;">Supertype:</strong> ${card.supertype}<br />`;
			if (card.supertype === 'Pokémon') {
				html += `<strong style="font-size: 1.1em;">Subtypes:</strong> ${subtypes}<br />`;
			}
			html += `<strong style="font-size: 1.1em; font-weight: bold;">Points:</strong> ${card.totalPoints}<br />`;
			html += `<strong style="font-size: 1.1em; font-weight: bold;">Artist:</strong> ${card.artist}<br />`;
			html += `<strong style="font-size: 1.1em; font-weight: bold;">Dex:</strong> ${card.cardText || ''}`;
			html += `</div></div></div>`;
			this.sendReply(`|html|${html}`);
		},

		async set(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) return this.errorReply('Usage: /tcg set [setid]');

			const setId = target.trim();
			let card: TcgCard | null = null;
			const cacheInitialized = getCacheStats().isInitialized;

			try {
				if (cacheInitialized) card = getSet(setId) || null;
				if (!card) {
					const collection = tcgCardsCollection;
					card = await collection.findOne({ setId });
				}
				if (!card) return this.errorReply(`Set with ID "${setId}" not found. (Cache: ${cacheInitialized ? 'On' : 'Off'})`);
			} catch {
				return this.errorReply('An error occurred while fetching set information.');
			}

			const setName = card.set;
			const series = card.setSeries || 'N/A';
			const releaseDate = card.setReleaseDate || 'N/A';
			const printedTotal = card.setPrintedTotal || 'N/A';
			const total = card.setTotal || 'N/A';
			const logoUrl = card.setImages?.logo || '';
			const symbolUrl = card.setImages?.symbol || '';
			const logoHeight = 40;

			let html = `<div class="infobox" style="display: flex; align-items: center; padding: 15px;">`;
			if (logoUrl) {
				html += `<div style="flex-shrink: 0; padding-right: 20px; border-right: 1px solid #ccc; text-align: center;">`;
				html += `<img src="${logoUrl}" height="${logoHeight}" alt="${setName} Logo" title="${setName} Logo" style="display: block; max-width: 120px;" />`;
				if (symbolUrl) {
					html += `<img src="${symbolUrl}" height="20" width="20" alt="${setName} Symbol" title="${setName} Symbol" style="margin-top: 10px;" />`;
				}
				html += `</div>`;
			}
			html += `<div style="flex: 1; line-height: 1.6; margin-left: 20px;">`;
			html += `<strong style="font-size: 22px;">${setName}</strong> <span style="font-size: 0.9em; margin-left: 5px;">(${card.setId})</span><br />`;
			html += `<div style="margin-top: 12px; font-size: 0.95em;">`;
			html += `<strong style="font-size: 1.1em;">Series:</strong> ${series}<br />`;
			html += `<strong style="font-size: 1.1em;">Released:</strong> ${releaseDate}<br />`;
			html += `<strong style="font-size: 1.1em;">Total Cards:</strong> ${total} (Printed: ${printedTotal})<br />`;
			html += `</div></div></div>`;
			this.sendReply(`|html|${html}`);
		},

		async search(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!target) {
				return this.errorReply('Usage: /tcg search [card/pokemonname|set:setid|rarity:"Rarity Name"|artist:"Artist Name"]');
			}

			try {
				const { filter, queryDescription, page, commandString } = parseSearchQuery(target);
				const collection = tcgCardsCollection;
				const totalMatches = await collection.countDocuments(filter);
				if (totalMatches === 0) return this.errorReply(`No cards found matching: ${queryDescription}.`);

				const totalPages = Math.ceil(totalMatches / SEARCH_PAGE_LIMIT);
				const currentPage = Math.min(page, totalPages);
				const skip = (currentPage - 1) * SEARCH_PAGE_LIMIT;

				const results = await collection.find(filter, {
					limit: SEARCH_PAGE_LIMIT, skip,
					projection: { name: 1, cardId: 1, rarity: 1, imageUrl: 1 },
					sort: { rarityPoints: -1, name: 1 },
				});

				let html = `<div class="infobox" style="padding: 7px; text-align: center; max-height: 340px; overflow-y: auto;">`;
				html += `<strong style="font-size: 20px;">Search Results</strong><br />`;
				html += `<div style="font-size: 0.9em; margin-bottom: 5px;">For: ${queryDescription}</div>`;
				html += `<div style="font-size: 0.9em; margin-bottom: 10px;">Showing ${results.length} of ${totalMatches} matching cards.</div>`;

				if (results.length === 0) html += `No results found for this page.`;
				for (let i = 0; i < results.length; i++) {
					const c = results[i];
					if (i % 4 === 0) {
						if (i > 0) html += `</div><hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
						html += `<div style="display: inline-block; text-align: center;">`;
					}
					const w = 74, h = 103;
					const url = c.imageUrl || ``;
					const alt = `${c.name} (${c.cardId})`;
					html += `<div style="display: inline-block; margin: 0 5px; vertical-align: top;">`;
					html += `<button name="send" value="/tcg card ${c.cardId}" style="background: none; border: none; padding: 0; cursor: pointer;">`;
					html += `<img src="${url}" width="${w}" height="${h}" alt="${alt}" title="${alt}" style="border-radius: 8px; display: block;" />`;
					html += `</button>`;
					html += `<div style="font-size: 0.85em; margin-top: 3px;">${c.name}</div>`;
					html += `<div style="font-size: 0.75em;">[ ${c.cardId} ]<br>${c.rarity}</div>`;
					html += `</div>`;
				}
				if (results.length > 0) html += `</div>`;

				if (totalPages > 1) {
					html += `<hr style="margin: 7px 0; border: none; border-top: 1px solid #ccc;">`;
					html += `<div style="display: flex; justify-content: center; align-items: center; margin-top: 10px; gap: 20px;">`;
					if (currentPage > 1) {
						html += `<button name="send" value="/tcg search ${commandString}, ${currentPage - 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Previous</button>`;
					}
					html += `<div style="font-size: 0.9em; color: #555;">Page ${currentPage} of ${totalPages}</div>`;
					if (currentPage < totalPages) {
						html += `<button name="send" value="/tcg search ${commandString}, ${currentPage + 1}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Next</button>`;
					}
					html += `</div>`;
				}
				html += `</div>`;
				this.sendReply(`|html|${html}`);
			} catch {
				return this.errorReply('An error occurred while searching for cards.');
			}
		},

		async daily(target, room, user) {
			if (!this.runBroadcast()) return;
			const userId = user.id;
			const cooldowns = cooldownsCollection;
			const now = Date.now();
			const COOLDOWN_MS = 24 * 60 * 60 * 1000;

			try {
				const cooldown = await cooldowns.findOne({ userId });
				if (cooldown) {
					const lastClaimed = new Date(cooldown.lastClaimedAt).getTime();
					const timeRemaining = (lastClaimed + COOLDOWN_MS) - now;
					if (timeRemaining > 0) {
						const hours = Math.floor(timeRemaining / 3600000);
						const minutes = Math.floor((timeRemaining % 3600000) / 60000);
						const seconds = Math.floor((timeRemaining % 60000) / 1000);
						return this.errorReply(`You must wait ${hours}h ${minutes}m ${seconds}s before claiming your next daily pack.`);
					}
				}

				let randomSetId = 'sv1';
				const setCollection = tcgCardsCollection;
				const randomSetArr = await setCollection.aggregate<{ setId: string }>([{
					$group: { _id: "$setId" },
				}, {
					$sample: { size: 1 },
				}, {
					$project: { _id: 0, setId: "$_id" },
				}]);
				if (randomSetArr.length > 0) randomSetId = randomSetArr[0].setId;

				const pack = await generatePack(randomSetId);
				const { creditsAwarded } = await addCardsToCollection(user, pack);

				await cooldowns.updateOne(
					{ userId },
					{ $set: { lastClaimedAt: new Date(now).toISOString() } },
					{ upsert: true }
				);

				const title = `${user.name} opened their daily pack! (${randomSetId})`;
				const subtitle = creditsAwarded > 0 ? `+${creditsAwarded} Credits from duplicates!<br>` : undefined;
				const html = renderCardGridHtml(pack, title, subtitle);
				this.sendReply(`|html|${html}`);
			} catch {
				return this.errorReply(`An error occurred while generating your daily pack: ${error.message}`);
			}
		},

		async opensavedpack(target, room, user) {
			if (!this.runBroadcast()) return;
			const setId = target.trim();
			if (!setId) return this.errorReply(`Specify a pack ID to open. Use /tcg packs to see your packs.`);

			const packCollection = userPacksCollection;
			let updateResult;

			try {
				updateResult = await packCollection.updateOne(
					{ userId: user.id, setId, quantity: { $gt: 0 } },
					{ $inc: { quantity: -1 } }
				);

				if (updateResult.modifiedCount === 0) {
					return this.errorReply(`You do not have any saved "${setId}" packs to open.`);
				}
			} catch (dbError) {
				console.error(`DB error decrementing pack for ${user.id}, setId ${setId}:`, dbError);
				return this.errorReply(`A database error occurred while trying to use your pack. Please try again.`);
			}

			try {
				const pack = await generatePack(setId);
				const { creditsAwarded } = await addCardsToCollection(user, pack);

				let setName = setId;
				const setInfo = getSet(setId) ?? await tcgCardsCollection.findOne({ setId });
				if (setInfo) setName = setInfo.set;

				const title = `${user.name} opened a ${setName} pack!`;
				const subtitle = creditsAwarded > 0 ? `+${creditsAwarded} Credits from duplicates!<br>` : undefined;
				const html = renderCardGridHtml(pack, title, subtitle);
				this.sendReply(`|html|${html}`);
			} catch {
				try {
					await packCollection.updateOne({ userId: user.id, setId }, { $inc: { quantity: 1 } });
				} catch (refundError) {
					console.error(`Failed to refund pack for ${user.id}, setId ${setId}:`, refundError);
				}
				if (error instanceof Error && error.message.includes("conflict at 'quantity'")) {
					return this.errorReply(`An error occurred while opening your pack: ${error.message}. Your pack has been refunded.`);
				}
				return this.errorReply(`An error occurred while opening your pack: ${error.message}. Your pack has been refunded.`);
			}
		},

		async openallpacks(target, room, user) {
			if (!this.runBroadcast()) return;
			const rawSetId = target.trim();
			if (!rawSetId) return this.errorReply(`Specify a pack ID to open. Use /tcg packs to see your packs.`);
			const packCollection = userPacksCollection;
			const queryFilter = { userId: user.id, setId: rawSetId, quantity: { $gt: 0 } };
			let findResult: TcgUserPack | null = null;

			try {
				findResult = await packCollection.findOneAndUpdate(queryFilter, { $set: { quantity: 0 } });
			} catch (dbError) {
				return this.errorReply(`A database error occurred while trying to find your packs. Please try again later.`);
			}

			if (!findResult || typeof findResult.quantity !== 'number' || findResult.quantity === 0) {
				try {
					const zeroCheck = await packCollection.findOne({ userId: user.id, setId: rawSetId });
					if (zeroCheck && zeroCheck.quantity === 0) {
						return this.errorReply(`You just opened all "${rawSetId}" packs, or another request is in progress.`);
					}
				return this.errorReply(`You do not have any saved "${rawSetId}" packs to open, or there was an issue accessing them.`);
			}

			const packQuantity = findResult.quantity;
			const setName = findResult.setName || rawSetId;

			try {
				const allPacks: TcgCard[] = [];
				const quantityToOpen = Math.min(packQuantity, 100);

				if (packQuantity > 100) {
					this.sendReply(`Opening 100 packs of ${setName}. You have ${packQuantity - 100} remaining.`);
					await packCollection.updateOne({ userId: user.id, setId: rawSetId }, { $inc: { quantity: packQuantity - 100 } });
				}

				for (let i = 0; i < quantityToOpen; i++) {
					const pack = await generatePack(rawSetId);
					allPacks.push(...pack);
				}

				const { creditsAwarded } = await addCardsToCollection(user, allPacks);
				let html = `<div class="infobox" style="padding: 15px; text-align: center;">`;
				html += `<strong style="font-size: 20px;">${user.name} opened ${quantityToOpen} ${setName} packs!</strong><br /><br />`;
				html += `You found a total of <strong>${allPacks.length}</strong> cards.`;
				if (creditsAwarded > 0) {
					html += `<br /><div style="font-size: 1.1em; color: green; margin-top: 5px;">+${creditsAwarded} Credits from duplicates!</div>`;
				}
				html += `<br /><br />`;
				html += `<button name="send" value="/tcg collection user:${user.id}, set:${rawSetId}" style="background: #eee; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;">View New Cards</button>`;
				html += `</div>`;
				this.sendReply(`|html|${html}`);
			} catch {
				await packCollection.updateOne({ userId: user.id, setId: rawSetId }, { $set: { quantity: packQuantity } });
				return this.errorReply(`An error occurred while opening your packs: ${error.message}. Your packs have been refunded.`);
			}
		},

		async leaderboard(target, room, user) {
			if (!this.runBroadcast()) return;
			const targetStat = toID(target) || 'points';
			let sortKey: keyof TcgUserProfile = 'collectionPoints';
			let title = 'Collection Points';
			let valueField: keyof TcgUserProfile = 'collectionPoints';

			switch (targetStat) {
			case 'points':
				sortKey = 'collectionPoints'; title = 'Collection Points'; valueField = 'collectionPoints'; break;
			case 'count': case 'quantity':
				sortKey = 'totalQuantity'; title = 'Total Cards'; valueField = 'totalQuantity'; break;
			case 'unique':
				sortKey = 'totalUniqueCards'; title = 'Unique Cards'; valueField = 'totalUniqueCards'; break;
			case 'credits':
				sortKey = 'credits'; title = 'Total Credits'; valueField = 'credits'; break;
			case 'sets':
				sortKey = 'totalSetsCompleted'; title = 'Sets Completed'; valueField = 'totalSetsCompleted'; break;
			default:
				return this.errorReply("Invalid leaderboard type. Try 'points', 'count', 'unique', 'credits', or 'sets'.");
			}

			try {
				const collection = userProfilesCollection;
				const results = await collection.find({}, { sort: { [sortKey]: -1 }, limit: 10 });
				if (results.length === 0) return this.errorReply("No users found in the leaderboard yet.");

				const headerRow = ['Rank', 'User', title];
				const dataRows = results.map((profile, i) => {
					const value = profile[valueField]! || 0;
					return [`<strong>${i + 1}</strong>`, profile.userName, value.toLocaleString()];
				});

				let html = `<div style="padding: 10px;">`;
				html += generateThemedTable(`TCG Leaderboard - ${title}`, headerRow, dataRows);
				html += `</div>`;
				this.sendReply(`|html|${html}`);
			} catch {
				return this.errorReply('An error occurred while fetching the leaderboard.');
			}
		},

		'': 'help',
		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/tcg adminhelp", desc: "Shows all admin commands." },
				{ cmd: "/tcg economyhelp", desc: "Shows all economy and shop commands." },
				{ cmd: "/tcg tradehelp", desc: "Shows trading commands." },
				{ cmd: "/tcg card [cardId]", desc: "Display Pokemon TCG card information." },
				{ cmd: "/tcg set [setId]", desc: "Display information about a specific TCG set." },
				{ cmd: "/tcg search [query], [page]", desc: "Search for cards. Use filters like <code>type:Fire</code>, <code>hp:&gt;100</code>, <code>rarity:Secret</code>, <code>artist:\"Arita\"</code>, <code>set:sv1</code>, <code>legal:standard</code>, <code>reg:G</code>.<br><b>Example:</b> <code>/tcg search Charizard type:Fire hp:&gt;200, 1</code>" },
				{ cmd: "/tcg profile [user]", desc: "View a user's TCG profile and collection stats." },
				{ cmd: "/tcg daily", desc: "Claim your free daily booster pack (once per 24h)." },
				{ cmd: "/tcg collection [user:], [filters:], [page]", desc: "View your (or another user's) card collection.<br><b>Example:</b> <code>/tcg collection user:princeskygit, rarity:Secret</code>" },
				{ cmd: "/tcg setprogress [setId]", desc: "Track your collection progress for a specific set." },
				{ cmd: "/tcg missing [setId], [user?], [page?]", desc: "Shows cards you are missing from a set." },
				{ cmd: "/tcg packs", desc: "View your unopened booster packs." },
				{ cmd: "/tcg opensavedpack [setId]", desc: "Open one pack from your inventory." },
				{ cmd: "/tcg openallpacks [setId]", desc: "Open all packs of a specific set from your inventory." },
				{ cmd: "/tcg favorite [cardId]", desc: "Add a card from your collection to your profile (max 10)." },
				{ cmd: "/tcg unfavorite [cardId]", desc: "Remove a card from your profile favorites." },
				{ cmd: "/tcg leaderboard [points | count | unique | credits | sets]", desc: "View the top collectors." },
				{ cmd: "/tcg recalculatestats [user]", desc: "Recalculate your stats. Admins can specify a user." },
			];
			const html = `<center><strong>TCG Commands:</strong><br>Alias: /pokemontcg</center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b><br>${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(`<div style="max-height: 360px; overflow-y: auto;">${html}</div>`);
		},
		...adminCommands,
		...collectionCommands,
		...economyCommands,
		...tradeCommands,
	},
};
