/*
* Pokemon Showdown
* Economy Commands
*/

import { FS } from '../../../lib/fs';
import { Economy, CURRENCY } from '../../economy';
import { nameColor } from '../../colors';
import { generateThemedTable } from '../../utils';

const CURRENCYNAME = CURRENCY.name;

/**
 * Represents a giveaway entry
 */
interface GiveawayEntry {
	giveawayId: string;
	roomid: string;
	hostId: string;
	hostName: string;
	prize: number;
	maxWinners: number;
	participants: Set<string>;
	startTime: number;
	duration: number; // in milliseconds
	ended: boolean;
	winners?: string[];
}

/**
 * Storage for active giveaways
 */
interface GiveawayData {
	giveaways: { [giveawayId: string]: Omit<GiveawayEntry, 'participants'> & { participants: string[] } };
}

const GIVEAWAY_FILE = 'impulse/db/giveaways.json';
const EXCLUDED_ROOMS = ['wifi']; // Rooms where this giveaway system is disabled

const activeGiveaways = new Map<string, GiveawayEntry>();
const giveawayTimers = new Map<string, NodeJS.Timeout>();

/**
 * Load giveaways from database
 */
const loadGiveaways = async (): Promise<void> => {
	try {
		const data = await FS(GIVEAWAY_FILE).readIfExists();
		if (data) {
			const parsed: GiveawayData = JSON.parse(data);
			activeGiveaways.clear();
			for (const [id, entry] of Object.entries(parsed.giveaways)) {
				activeGiveaways.set(id, {
					...entry,
					participants: new Set(entry.participants),
				});
				// Restart timers for non-ended giveaways
				if (!entry.ended) {
					const timeLeft = (entry.startTime + entry.duration) - Date.now();
					if (timeLeft > 0) {
						startGiveawayTimer(id, timeLeft);
					} else {
						// Giveaway should have ended, end it now
						void endGiveaway(id);
					}
				}
			}
		}
	} catch (e) {
		console.error('Error loading giveaways:', e);
	}
};

/**
 * Save giveaways to database
 */
const saveGiveaways = async (): Promise<void> => {
	try {
		const data: GiveawayData = {
			giveaways: {},
		};
		for (const [id, entry] of activeGiveaways.entries()) {
			data.giveaways[id] = {
				...entry,
				participants: Array.from(entry.participants),
			};
		}
		await FS(GIVEAWAY_FILE).safeWrite(JSON.stringify(data, null, 2));
	} catch (e) {
		console.error('Error saving giveaways:', e);
	}
};

/**
 * Generate a unique giveaway ID
 */
const generateGiveawayId = (): string => {
	return `ga_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Start a timer for a giveaway
 */
const startGiveawayTimer = (giveawayId: string, duration: number): void => {
	const timer = setTimeout(() => {
		void endGiveaway(giveawayId);
	}, duration);
	giveawayTimers.set(giveawayId, timer);
};

/**
 * End a giveaway and pick winners
 */
const endGiveaway = async (giveawayId: string): Promise<void> => {
	const giveaway = activeGiveaways.get(giveawayId);
	if (!giveaway || giveaway.ended) return;

	giveaway.ended = true;

	// Clear timer if exists
	const timer = giveawayTimers.get(giveawayId);
	if (timer) {
		clearTimeout(timer);
		giveawayTimers.delete(giveawayId);
	}

	const participants = Array.from(giveaway.participants);
	if (participants.length === 0) {
		// No participants, notify room and cancel
		const room = Rooms.get(giveaway.roomid);
		if (room) {
			room.add(`|html|<div class="broadcast-blue"><strong>Giveaway ended with no participants!</strong><br />The giveaway of ${Economy.formatMoney(giveaway.prize)} has been cancelled.</div>`).update();
		}
		activeGiveaways.delete(giveawayId);
		await saveGiveaways();
		return;
	}

	// Pick random winners
	const numWinners = Math.min(giveaway.maxWinners, participants.length);
	const winners: string[] = [];
	const participantsCopy = [...participants];

	for (let i = 0; i < numWinners; i++) {
		const randomIndex = Math.floor(Math.random() * participantsCopy.length);
		winners.push(participantsCopy[randomIndex]);
		participantsCopy.splice(randomIndex, 1);
	}

	giveaway.winners = winners;

	// Distribute prizes
	const prizePerWinner = Math.floor(giveaway.prize / numWinners);
	for (const winnerId of winners) {
		await Economy.updateBalance(winnerId, prizePerWinner);
	}

	// Announce winners
	const room = Rooms.get(giveaway.roomid);
	if (room) {
		const winnerNames = winners.map(id => {
			const user = Users.getExact(id);
			return nameColor(user?.name || id, true, false);
		}).join(', ');

		room.add(`|html|<div class="broadcast-green"><strong>🎉 Giveaway Winners! 🎉</strong><br />` +
			`Winners: ${winnerNames}<br />` +
			`Prize: ${Economy.formatMoney(prizePerWinner)} ${CURRENCY.name} each<br />` +
			`Total participants: ${participants.length}</div>`).update();

		// Notify winners
		for (const winnerId of winners) {
			const winner = Users.get(winnerId);
			if (winner?.connected) {
				winner.popup(`|html|<div class="broadcast-green"><center><strong>🎉 Congratulations! 🎉</strong><br />` +
					`You won the giveaway in room ${giveaway.roomid}!<br />` +
					`Prize: ${Economy.formatMoney(prizePerWinner)} ${CURRENCY.name}</center></div>`);
			}
		}
	}

	await saveGiveaways();
};

// Load giveaways on startup
void loadGiveaways();

export const commands: Chat.ChatCommands = {
	bal: 'balance',
	money: 'balance',
	atm: 'balance',
	async balance(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;

		const targetUserid = toID(target) || user.id;

		const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
		const targetNameColor = nameColor(targetDisplayName, true, false);

		const targetUser = await Economy.getUser(targetUserid);

		const moneyDisplay = Economy.formatMoney(targetUser.balance);
		this.sendReplyBox(`${targetNameColor} has ${moneyDisplay} ${CURRENCYNAME}.`);
	},

	eco: {
		async transfer(target, room, user): Promise<void> {
			if (!target) return this.parse('/help eco');

			const [targetStr, amountStr] = target.split(',').map(s => s.trim());
			const targetUserid = toID(targetStr);
			const amount = parseInt(amountStr);

			if (!targetUserid || !amountStr) {
				return this.parse('/help eco');
			}

			if (targetUserid === user.id) {
				return this.errorReply("You cannot transfer money to yourself.");
			}

			if (amount <= 0 || isNaN(amount)) {
				return this.errorReply(`Amount must be a positive number.`);
			}

			const fromUser = await Economy.getUser(user.id);
			if (fromUser.balance < amount) {
				return this.errorReply(`You do not have enough money to transfer ${Economy.formatMoney(amount)}. You have ${Economy.formatMoney(fromUser.balance)}.`);
			}

			const result = await Economy.transferMoney(user.id, targetUserid, amount);

			if (!result.success) {
				return this.errorReply(`Transfer failed: ${result.error}`);
			}

			this.sendReplyBox(`You successfully transferred ${Economy.formatMoney(amount)} ${CURRENCYNAME} to ${targetUserid}. Your new balance is ${Economy.formatMoney(result.fromBalance)} ${CURRENCYNAME}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const fromNameColor = nameColor(user.name, false, true);
				const toBalanceDisplay = Economy.formatMoney(result.toBalance);
				targetSocket.popup(`|html|You received a transfer of ${Economy.formatMoney(amount)} from ${fromNameColor}. Your new balance is ${toBalanceDisplay} ${CURRENCYNAME}.`);
			}
		},

		async give(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const [targetStr, amountStr] = target.split(',').map(s => s.trim());
			const targetUserid = toID(targetStr);
			const amount = parseInt(amountStr);

			if (!targetUserid || !amountStr) {
				return this.parse('/help eco');
			}

			if (amount <= 0 || isNaN(amount)) {
				return this.errorReply(`Amount must be a positive number.`);
			}

			const updatedUser = await Economy.updateBalance(targetUserid, amount);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = nameColor(targetDisplayName);
			this.sendReplyBox(`You have given ${Economy.formatMoney(amount)} ${CURRENCYNAME} to ${targetNameColor}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const giverNameColor = nameColor(user.name, false, true);
				const newBalanceDisplay = Economy.formatMoney(updatedUser.balance);
				targetSocket.popup(`|html|You have been given ${Economy.formatMoney(amount)} by ${giverNameColor} ${CURRENCYNAME}. Your new balance is ${newBalanceDisplay} ${CURRENCYNAME}.`);
			}
		},

		async take(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const [targetStr, amountStr] = target.split(',').map(s => s.trim());
			const targetUserid = toID(targetStr);
			const amount = parseInt(amountStr);

			if (!targetUserid || !amountStr) {
				return this.parse('/help eco');
			}

			if (amount <= 0 || isNaN(amount)) {
				return this.errorReply(`Amount must be a positive number.`);
			}

			const targetUser = await Economy.getUser(targetUserid);
			if (targetUser.balance < amount) {
				return this.errorReply(`${targetUserid} only has ${Economy.formatMoney(targetUser.balance)} and cannot have ${Economy.formatMoney(amount)} taken.`);
			}

			await Economy.updateBalance(targetUserid, -amount);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = nameColor(targetDisplayName);
			this.sendReplyBox(`You have taken ${Economy.formatMoney(amount)} ${CURRENCYNAME} from ${targetNameColor}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const takerNameColor = nameColor(user.name, false, true);
				targetSocket.popup(`|html|${takerNameColor} has taken ${Economy.formatMoney(amount)} ${CURRENCYNAME} from you.`);
			}
		},

		async history(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			let targetUserid = toID(target);
			const staffCheck = user.can('roomowner');

			if (targetUserid && !staffCheck) {
				return this.errorReply("You can only view your own transaction history. Use `/eco history`.");
			}

			targetUserid = targetUserid || user.id;

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = nameColor(targetDisplayName);

			const history = await Economy.getTransactionHistory(targetUserid);
			if (!history.length) {
				return this.sendReplyBox(`<h3><center>Transaction History for ${targetNameColor}</center></h3><hr />No transactions found for ${targetUserid}.`);
			}

			const headerRow = ["Type", "Amount", "Details", "Date"];
			const dataRows = history.map(t => {
				const date = new Date(t.timestamp).toLocaleString();
				let typeColor = '';
				let details = '';
				let amountDisplay = Economy.formatMoney(t.amount);

				const fromDisplayName = Users.getExact(t.from)?.name || t.from;
				const toDisplayName = Users.getExact(t.to)?.name || t.to;

				const fromColor = nameColor(fromDisplayName);
				const toColor = nameColor(toDisplayName);

				switch (t.type) {
				case 'transfer':
					typeColor = t.from === targetUserid ? 'red' : 'green';
					details = t.from === targetUserid ? `Sent to ${toColor}` : `Received from ${fromColor}`;
					amountDisplay = t.from === targetUserid ? `- ${amountDisplay}` : `+ ${amountDisplay}`;
					break;
				case 'give':
					typeColor = 'green';
					amountDisplay = `+ ${amountDisplay}`;
					break;
				case 'take':
					typeColor = 'red';
					amountDisplay = `- ${amountDisplay}`;
					break;
				case 'shop':
					typeColor = 'red';
					details = `Spent on shop item`;
					amountDisplay = `- ${amountDisplay}`;
					break;
				case 'reward':
					typeColor = 'green';
					details = `Reward`;
					amountDisplay = `+ ${amountDisplay}`;
					break;
				}

				const reason = t.reason ? ` (${t.reason})` : '';

				return [
					t.type.toUpperCase(),
					`<span style="color: ${typeColor};">${amountDisplay}</span>`,
					`${details}${reason}`,
					date,
				];
			});

			const tableHtml = generateThemedTable(
				`Transaction History for ${targetNameColor}`,
				headerRow,
				dataRows
			);

			this.sendReply(`|html|${tableHtml}`);
		},

		async stats(): Promise<void> {
			if (!this.runBroadcast()) return;

			const stats = await Economy.getStats();
			const { totalMoney, totalUsers } = stats;

			const headerRow = ["Total Users", "Total Money in Circulation"];
			const dataRows = [[
				totalUsers.toString(),
				Economy.formatMoney(totalMoney.totalBalance),
			]];

			const tableHtml = generateThemedTable(
				"Economy Statistics",
				headerRow,
				dataRows
			);

			this.sendReply(`|html|${tableHtml}`);
		},

		async ladder(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			const [pageStr, limitStr] = target.split(',').map(s => s.trim());

			let page = parseInt(pageStr);
			if (isNaN(page) || page < 1) page = 1;

			let limit = parseInt(limitStr);
			if (isNaN(limit) || limit < 1 || limit > 50) limit = 50;

			const { docs, totalPages } = await Economy.getLeaderboard(page, limit);

			const headerRow = ["Rank", "User", "" + CURRENCYNAME + ""];
			const dataRows = docs.map((u, i) => {
				const rank = (page - 1) * limit + i + 1;
				const userName = Users.getExact(u._id)?.name || u._id;
				const userNameColor = nameColor(userName);
				return [
					rank.toString(),
					userNameColor,
					Economy.formatMoney(u.balance),
				];
			});

			const tableHtml = generateThemedTable(
				`Economy Leaderboard - Page ${page} of ${totalPages}`,
				headerRow,
				dataRows
			);

			this.sendReply(`|html|${tableHtml}`);
		},

		async reset(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			const targetUserid = toID(target);
			if (!targetUserid) {
				return this.parse('/help eco');
			}

			const targetUser = await Economy.getUser(targetUserid);
			if (targetUser.balance === Economy.CONFIG.startingBalance) {
				return this.errorReply(`${targetUserid} already has the starting balance, so there is nothing to reset.`);
			}

			await Economy.resetUser(targetUserid);

			const targetDisplayName = Users.getExact(targetUserid)?.name || targetUserid;
			const targetNameColor = nameColor(targetDisplayName);
			this.sendReplyBox(`Economy data for ${targetNameColor} has been reset. They now have a starting balance of ${Economy.formatMoney(Economy.CONFIG.startingBalance)} ${CURRENCYNAME}.`);

			const targetSocket = Users.get(targetUserid);
			if (targetSocket) {
				const resetterNameColor = nameColor(user.name, false, true);
				const startingBalanceDisplay = Economy.formatMoney(Economy.CONFIG.startingBalance);
				targetSocket.popup(`|html|Your economy data has been reset by ${resetterNameColor}. Your new balance is ${startingBalanceDisplay} ${CURRENCYNAME}.`);
			}
		},

		giveaway: {
			start(target, room, user) {
				if (!room || room.roomid === 'global') {
					return this.errorReply('This command can only be used in chat rooms.');
				}

				if (EXCLUDED_ROOMS.includes(room.roomid)) {
					return this.errorReply(`The /eco giveaway command is not available in the ${room.roomid} room. Please use the room-specific giveaway commands instead.`);
				}

				this.checkCan('minigame', null, room);

				// Check if there's already an active giveaway in this room
				for (const [, giveaway] of activeGiveaways) {
					if (giveaway.roomid === room.roomid && !giveaway.ended) {
						return this.errorReply('There is already an active giveaway in this room. Please wait for it to end.');
					}
				}

				const [prizeStr, winnersStr, durationStr] = target.split(',').map(s => s.trim());

				if (!prizeStr || !winnersStr || !durationStr) {
					return this.parse('/help eco giveaway');
				}

				const prize = parseInt(prizeStr);
				const maxWinners = parseInt(winnersStr);
				const duration = parseInt(durationStr);

				if (isNaN(prize) || prize <= 0) {
					return this.errorReply('Prize amount must be a positive number.');
				}

				if (isNaN(maxWinners) || maxWinners <= 0) {
					return this.errorReply('Number of winners must be a positive number.');
				}

				if (isNaN(duration) || duration < 10 || duration > 600) {
					return this.errorReply('Duration must be between 10 and 600 seconds.');
				}

				const giveawayId = generateGiveawayId();
				const giveaway: GiveawayEntry = {
					giveawayId,
					roomid: room.roomid,
					hostId: user.id,
					hostName: user.name,
					prize,
					maxWinners,
					participants: new Set(),
					startTime: Date.now(),
					duration: duration * 1000,
					ended: false,
				};

				activeGiveaways.set(giveawayId, giveaway);
				void saveGiveaways();

				// Start timer
				startGiveawayTimer(giveawayId, duration * 1000);

				const hostNameColor = nameColor(user.name, true, false);
				room.add(`|html|<div class="broadcast-blue"><strong>💰 New Giveaway Started! 💰</strong><br />` +
					`Host: ${hostNameColor}<br />` +
					`Prize: ${Economy.formatMoney(prize)} ${CURRENCY.name}<br />` +
					`Winners: ${maxWinners}<br />` +
					`Duration: ${duration} seconds<br />` +
					`Use <code>/eco giveaway join</code> to enter!</div>`).update();

				this.modlog('GIVEAWAY', null, `started a giveaway with prize ${Economy.formatMoney(prize)} for ${maxWinners} winners`);
			},

			join(target, room, user) {
				if (!room || room.roomid === 'global') {
					return this.errorReply('This command can only be used in chat rooms.');
				}

				if (EXCLUDED_ROOMS.includes(room.roomid)) {
					return this.errorReply(`The /eco giveaway command is not available in the ${room.roomid} room.`);
				}

				// Find active giveaway in this room
				let giveaway: GiveawayEntry | undefined;
				for (const [, ga] of activeGiveaways) {
					if (ga.roomid === room.roomid && !ga.ended) {
						giveaway = ga;
						break;
					}
				}

				if (!giveaway) {
					return this.errorReply('There is no active giveaway in this room.');
				}

				if (giveaway.participants.has(user.id)) {
					return this.errorReply('You have already joined this giveaway.');
				}

				if (giveaway.hostId === user.id) {
					return this.errorReply('You cannot join your own giveaway.');
				}

				giveaway.participants.add(user.id);
				void saveGiveaways();

				const userNameColor = nameColor(user.name, true, false);
				room.add(`|html|${userNameColor} joined the giveaway! (${giveaway.participants.size} ${giveaway.participants.size === 1 ? 'participant' : 'participants'})`).update();
			},

			end(target, room, user) {
				if (!room || room.roomid === 'global') {
					return this.errorReply('This command can only be used in chat rooms.');
				}

				if (EXCLUDED_ROOMS.includes(room.roomid)) {
					return this.errorReply(`The /eco giveaway command is not available in the ${room.roomid} room.`);
				}

				this.checkCan('minigame', null, room);

				// Find active giveaway in this room
				let giveaway: GiveawayEntry | undefined;
				let giveawayId: string | undefined;
				for (const [id, ga] of activeGiveaways) {
					if (ga.roomid === room.roomid && !ga.ended) {
						giveaway = ga;
						giveawayId = id;
						break;
					}
				}

				if (!giveaway || !giveawayId) {
					return this.errorReply('There is no active giveaway in this room.');
				}

				void endGiveaway(giveawayId);
				this.modlog('GIVEAWAY', null, 'manually ended the giveaway');
			},

			cancel(target, room, user) {
				if (!room || room.roomid === 'global') {
					return this.errorReply('This command can only be used in chat rooms.');
				}

				if (EXCLUDED_ROOMS.includes(room.roomid)) {
					return this.errorReply(`The /eco giveaway command is not available in the ${room.roomid} room.`);
				}

				this.checkCan('minigame', null, room);

				// Find active giveaway in this room
				let giveaway: GiveawayEntry | undefined;
				let giveawayId: string | undefined;
				for (const [id, ga] of activeGiveaways) {
					if (ga.roomid === room.roomid && !ga.ended) {
						giveaway = ga;
						giveawayId = id;
						break;
					}
				}

				if (!giveaway || !giveawayId) {
					return this.errorReply('There is no active giveaway in this room.');
				}

				// Clear timer
				const timer = giveawayTimers.get(giveawayId);
				if (timer) {
					clearTimeout(timer);
					giveawayTimers.delete(giveawayId);
				}

				activeGiveaways.delete(giveawayId);
				void saveGiveaways();

				room.add(`|html|<div class="broadcast-red"><strong>Giveaway Cancelled</strong><br />The giveaway has been cancelled by ${nameColor(user.name, true, false)}.</div>`).update();
				this.modlog('GIVEAWAY', null, 'cancelled the giveaway');
			},

			list(target, room, user) {
				if (!room || room.roomid === 'global') {
					return this.errorReply('This command can only be used in chat rooms.');
				}

				if (EXCLUDED_ROOMS.includes(room.roomid)) {
					return this.errorReply(`The /eco giveaway command is not available in the ${room.roomid} room.`);
				}

				// Find active giveaway in this room
				let giveaway: GiveawayEntry | undefined;
				for (const [, ga] of activeGiveaways) {
					if (ga.roomid === room.roomid && !ga.ended) {
						giveaway = ga;
						break;
					}
				}

				if (!giveaway) {
					return this.sendReply('There is no active giveaway in this room.');
				}

				const timeLeft = Math.max(0, Math.ceil((giveaway.startTime + giveaway.duration - Date.now()) / 1000));
				const hostNameColor = nameColor(giveaway.hostName, true, false);

				this.sendReplyBox(
					`<strong>Active Giveaway</strong><br />` +
					`Host: ${hostNameColor}<br />` +
					`Prize: ${Economy.formatMoney(giveaway.prize)} ${CURRENCY.name}<br />` +
					`Winners: ${giveaway.maxWinners}<br />` +
					`Participants: ${giveaway.participants.size}<br />` +
					`Time Left: ${timeLeft} seconds`
				);
			},

			''(target, room, user) {
				return this.parse('/help eco giveaway');
			},

			help(target, room, user) {
				if (!this.runBroadcast()) return;

				this.sendReplyBox(
					`<strong>Giveaway Commands:</strong><br />` +
					`<code>/eco giveaway start [prize], [winners], [duration]</code> - Starts a giveaway with the specified prize amount, number of winners, and duration in seconds (10-600). Requires: % @ # &<br />` +
					`<code>/eco giveaway join</code> - Join the active giveaway in the current room.<br />` +
					`<code>/eco giveaway end</code> - Manually end the giveaway and pick winners. Requires: % @ # &<br />` +
					`<code>/eco giveaway cancel</code> - Cancel the active giveaway. Requires: % @ # &<br />` +
					`<code>/eco giveaway list</code> - View details of the active giveaway in the current room.<br />` +
					`<br />` +
					`<strong>Note:</strong> This giveaway system uses ${CURRENCY.name} from the economy system. Winners are selected randomly from participants.`
				);
			},
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{
					cmd: "/balance [user]",
					desc: `Shows a user's ${CURRENCYNAME} balance. Aliases: <b>/bal</b>, <b>/money</b>, <b>/atm</b>`,
				},
				{
					cmd: "/eco history [user]",
					desc: "Shows the last 50 transactions for a user. Staff & can view other users' history. (Default: yourself)",
				},
				{
					cmd: "/eco stats",
					desc: `Shows global economy statistics and total ${CURRENCYNAME} in circulation.`,
				},
				{
					cmd: "/eco ladder [page], [limit]",
					desc: "Shows the economy leaderboard. Max limit is 50.",
				},
				{
					cmd: "/eco transfer [user], [amount]",
					desc: `Transfers ${CURRENCYNAME} to another user.`,
				},
				{
					cmd: "/eco give [user], [amount], [reason]",
					desc: `Gives a user ${CURRENCYNAME}. Requires: &.`,
				},
				{
					cmd: "/eco take [user], [amount], [reason]",
					desc: `Takes ${CURRENCYNAME} from a user. Requires: &.`,
				},
				{
					cmd: "/eco reset [user]",
					desc: `Resets a user's economy data (${CURRENCYNAME} and transactions). Requires: &.`,
				},
				{
					cmd: "/eco giveaway",
					desc: `Interactive giveaway system. Use <b>/eco giveaway help</b> for more info.`,
				},
			];
			const html = `<center><strong>Economy Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},
	},
	economy: 'eco',
};
