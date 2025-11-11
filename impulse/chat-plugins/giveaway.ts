/*
* Pokemon Showdown
* Interactive Giveaway System
* Uses the economy system to distribute money prizes to users
*/

import { FS } from '../../lib/fs';
import { Economy, CURRENCY } from '../economy';
import { nameColor } from '../colors';

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
	giveaway: {
		start(target, room, user) {
			if (!room || room.roomid === 'global') {
				return this.errorReply('This command can only be used in chat rooms.');
			}

			if (EXCLUDED_ROOMS.includes(room.roomid)) {
				return this.errorReply(`The /giveaway command is not available in the ${room.roomid} room. Please use the room-specific giveaway commands instead.`);
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
				return this.parse('/help giveaway');
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
				`Use <code>/giveaway join</code> to enter!</div>`).update();

			this.modlog('GIVEAWAY', null, `started a giveaway with prize ${Economy.formatMoney(prize)} for ${maxWinners} winners`);
		},

		join(target, room, user) {
			if (!room || room.roomid === 'global') {
				return this.errorReply('This command can only be used in chat rooms.');
			}

			if (EXCLUDED_ROOMS.includes(room.roomid)) {
				return this.errorReply(`The /giveaway command is not available in the ${room.roomid} room.`);
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
				return this.errorReply(`The /giveaway command is not available in the ${room.roomid} room.`);
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
				return this.errorReply(`The /giveaway command is not available in the ${room.roomid} room.`);
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
				return this.errorReply(`The /giveaway command is not available in the ${room.roomid} room.`);
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
			return this.parse('/help giveaway');
		},

		help(target, room, user) {
			if (!this.runBroadcast()) return;

			this.sendReplyBox(
				`<strong>Giveaway Commands:</strong><br />` +
				`<code>/giveaway start [prize], [winners], [duration]</code> - Starts a giveaway with the specified prize amount, number of winners, and duration in seconds (10-600). Requires: % @ # &<br />` +
				`<code>/giveaway join</code> - Join the active giveaway in the current room.<br />` +
				`<code>/giveaway end</code> - Manually end the giveaway and pick winners. Requires: % @ # &<br />` +
				`<code>/giveaway cancel</code> - Cancel the active giveaway. Requires: % @ # &<br />` +
				`<code>/giveaway list</code> - View details of the active giveaway in the current room.<br />` +
				`<br />` +
				`<strong>Note:</strong> This giveaway system uses ${CURRENCY.name} from the economy system. Winners are selected randomly from participants.`
			);
		},
	},
};
