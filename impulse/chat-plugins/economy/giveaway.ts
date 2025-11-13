/*
* Pokemon Showdown
* Giveaway Commands
*/

import { Economy, CURRENCY } from '../../economy';
import { nameColor } from '../../colors';
import { ImpulseDB } from '../../impulse-db';

interface GiveawayParticipant {
	userid: string;
	username: string;
	joinedAt: Date;
}

interface Giveaway {
	_id?: unknown;
	roomid: string;
	hostId: string;
	hostName: string;
	prize: number;
	participants: GiveawayParticipant[];
	startedAt: Date;
	active: boolean;
	winnerId?: string;
	winnerName?: string;
	endedAt?: Date;
	duration?: number; // Duration in minutes
	timer?: NodeJS.Timeout; // Timer for auto-end
}

interface GiveawayConfig {
	_id?: unknown;
	roomid: string;
	defaultDuration: number; // Default duration in minutes
}

const GiveawayDB = ImpulseDB<Giveaway>('giveaways');
const GiveawayConfigDB = ImpulseDB<GiveawayConfig>('giveaway_config');

// Store active giveaways by room
const activeGiveaways = new Map<string, Giveaway>();

// Helper function to generate giveaway display HTML
function generateGiveawayHTML(giveaway: Giveaway): string {
	const durationText = giveaway.duration ?
		`${giveaway.duration} minute${giveaway.duration !== 1 ? 's' : ''}` :
		'Manual (no auto-end)';

	return `<div class="infobox" style="border: 2px solid #4CAF50; padding: 15px; margin: 10px 0;">` +
		`<center>` +
		`<h2 style="margin: 10px 0;">GIVEAWAY ACTIVE!</h2>` +
		`<p style="font-size: 16px; margin: 10px 0;">` +
		`<strong>Host:</strong> ${nameColor(giveaway.hostName, true, true)}<br />` +
		`<strong>Prize:</strong> ${Economy.formatMoney(giveaway.prize)} ${CURRENCY.name}<br />` +
		`<strong>Duration:</strong> ${durationText}` +
		`</p>` +
		`<p style="font-size: 14px; margin: 15px 0;">` +
		`Click the button below to join!` +
		`</p>` +
		`<button class="button" name="send" value="/giveaway join" ` +
		`style="font-size: 16px; padding: 10px 20px; border-radius: 5px;">` +
		`Join Giveaway` +
		`</button>` +
		`<p style="font-size: 12px; margin-top: 15px;">` +
		`Participants: <strong>${giveaway.participants.length}</strong>` +
		`</p>` +
		`</center>` +
		`</div>`;
}

// Helper function to get room's default duration
async function getRoomDefaultDuration(roomid: string): Promise<number> {
	const config = await GiveawayConfigDB.findOne({ roomid });
	return config?.defaultDuration || 5; // Default 5 minutes if not configured
}

// Helper function to end a giveaway
async function endGiveaway(roomid: string, room: Room): Promise<void> {
	const giveaway = activeGiveaways.get(roomid);
	if (!giveaway) return;

	if (giveaway.participants.length === 0) {
		activeGiveaways.delete(roomid);
		room.add(`|html|<div class="infobox" style="border: 2px solid #f44336; padding: 15px;"><center><strong>Giveaway ended with no participants!</strong></center></div>`).update();
		return;
	}

	// Pick a random winner
	const randomIndex = Math.floor(Math.random() * giveaway.participants.length);
	const winner = giveaway.participants[randomIndex];

	// Award the prize
	await Economy.updateBalance(winner.userid, giveaway.prize);

	// Update giveaway data
	giveaway.active = false;
	giveaway.winnerId = winner.userid;
	giveaway.winnerName = winner.username;
	giveaway.endedAt = new Date();

	// Clear timer if exists
	if (giveaway.timer) {
		clearTimeout(giveaway.timer);
	}

	// Save to database
	await GiveawayDB.insertOne(giveaway);

	// Remove from active giveaways
	activeGiveaways.delete(roomid);

	// Announce the winner
	const html = `<div class="infobox" style="border: 2px solid #FFD700; padding: 15px; margin: 10px 0;">` +
		`<center>` +
		`<h2 style="margin: 10px 0;">GIVEAWAY WINNER!</h2>` +
		`<p style="font-size: 18px; margin: 15px 0;">` +
		`<strong>Winner:</strong> ${nameColor(winner.username, true, true)}` +
		`</p>` +
		`<p style="font-size: 16px; margin: 10px 0;">` +
		`<strong>Prize Won:</strong> ${Economy.formatMoney(giveaway.prize)} ${CURRENCY.name}` +
		`</p>` +
		`<p style="font-size: 14px; margin-top: 15px;">` +
		`Total Participants: ${giveaway.participants.length}` +
		`</p>` +
		`</center>` +
		`</div>`;

	room.add(`|html|${html}`).update();

	// Notify the winner
	const winnerUser = Users.get(winner.userid);
	if (winnerUser) {
		winnerUser.popup(`|html|<div class="infobox" style="border: 2px solid #FFD700; padding: 20px;"><center><h2>Congratulations!</h2><p>You won the giveaway!</p><p style="font-size: 18px;"><strong>${Economy.formatMoney(giveaway.prize)} ${CURRENCY.name}</strong></p></center></div>`);
	}
}

export const commands: Chat.ChatCommands = {
	giveaway: {
		''(target, room, user) {
			return this.parse('/help giveaway');
		},

		async start(target, room, user) {
			this.checkCan('roomowner');

			if (!room || room.roomid === 'global') {
				return this.errorReply("Giveaways can only be started in chat rooms.");
			}

			const roomid = room.roomid;

			// Check if there's already an active giveaway in this room
			if (activeGiveaways.has(roomid)) {
				return this.errorReply("There is already an active giveaway in this room. End it first with /giveaway end.");
			}

			const [prizeStr, durationStr] = target.split(',').map(s => s.trim());
			const prize = parseInt(prizeStr);
			const defaultDuration = await getRoomDefaultDuration(roomid);

			// Check if manual mode is requested (duration = 0 or "manual")
			let duration: number | undefined;
			let isManual = false;

			if (durationStr && (durationStr.toLowerCase() === 'manual' || durationStr === '0')) {
				isManual = true;
				duration = undefined;
			} else {
				duration = durationStr ? parseInt(durationStr) : defaultDuration;
			}

			if (!prizeStr || isNaN(prize) || prize <= 0) {
				return this.errorReply("Specify a valid prize amount. Usage: /giveaway start [amount], [duration in minutes or 'manual']");
			}

			if (!isManual && (isNaN(duration!) || duration! < 1 || duration! > 60)) {
				return this.errorReply("Duration must be between 1 and 60 minutes, or 'manual' for manual-only ending.");
			}

			// Create the giveaway
			const giveaway: Giveaway = {
				roomid,
				hostId: user.id,
				hostName: user.name,
				prize,
				participants: [],
				startedAt: new Date(),
				active: true,
				duration,
			};

			// Set up auto-end timer only if not manual
			if (!isManual && duration) {
				giveaway.timer = setTimeout(() => {
					void endGiveaway(roomid, room);
				}, duration * 60 * 1000); // Convert minutes to milliseconds
			}

			activeGiveaways.set(roomid, giveaway);

			// Display the giveaway announcement with Join button using uhtml
			const uhtmlid = `giveaway-${roomid}`;
			const html = generateGiveawayHTML(giveaway);

			room.add(`|uhtml|${uhtmlid}|${html}`).update();
			this.modlog('GIVEAWAY', null, `started a giveaway for ${Economy.formatMoney(prize)} (${isManual ? 'manual' : `${duration} min`})`);
		},

		join(target, room, user) {
			if (!room || room.roomid === 'global') {
				return this.errorReply("You must be in a chat room to join a giveaway.");
			}

			const roomid = room.roomid;
			const giveaway = activeGiveaways.get(roomid);

			if (!giveaway) {
				return this.errorReply("There is no active giveaway in this room.");
			}

			// Check if user is already in the giveaway
			const alreadyJoined = giveaway.participants.some(p => p.userid === user.id);
			if (alreadyJoined) {
				return this.errorReply("You have already joined this giveaway!");
			}

			// Add the user to participants
			giveaway.participants.push({
				userid: user.id,
				username: user.name,
				joinedAt: new Date(),
			});

			// Update the giveaway display using uhtmlchange
			const uhtmlid = `giveaway-${roomid}`;
			const html = generateGiveawayHTML(giveaway);
			room.add(`|uhtmlchange|${uhtmlid}|${html}`).update();

			// Notify the user privately
			this.sendReply("You have successfully joined the giveaway!");
		},

		async end(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			if (!room || room.roomid === 'global') {
				return this.errorReply("Giveaways can only be ended in chat rooms.");
			}

			const roomid = room.roomid;
			const giveaway = activeGiveaways.get(roomid);

			if (!giveaway) {
				return this.errorReply("There is no active giveaway in this room.");
			}

			// Use the helper function to end the giveaway
			await endGiveaway(roomid, room);

			this.modlog('GIVEAWAY', null, 'manually ended the giveaway');
		},

		draw: 'end',

		cancel(target, room, user) {
			this.checkCan('roomowner');

			if (!room || room.roomid === 'global') {
				return this.errorReply("There is no giveaway to cancel in this context.");
			}

			const roomid = room.roomid;
			const giveaway = activeGiveaways.get(roomid);

			if (!giveaway) {
				return this.errorReply("There is no active giveaway in this room.");
			}

			// Clear timer if exists
			if (giveaway.timer) {
				clearTimeout(giveaway.timer);
			}

			// Remove the giveaway
			activeGiveaways.delete(roomid);

			const cancelHtml = `<div class="infobox" style="border: 2px solid #f44336; padding: 15px;">` +
				`<center><strong>The giveaway has been cancelled by ${nameColor(user.name, true, true)}.</strong></center>` +
				`</div>`;
			room.add(`|html|${cancelHtml}`).update();
			this.modlog('GIVEAWAY', null, 'cancelled the giveaway');
		},

		participants(target, room, user) {
			if (!room || room.roomid === 'global') {
				return this.errorReply("You must be in a chat room to view giveaway participants.");
			}

			const roomid = room.roomid;
			const giveaway = activeGiveaways.get(roomid);

			if (!giveaway) {
				return this.errorReply("There is no active giveaway in this room.");
			}

			if (giveaway.participants.length === 0) {
				return this.sendReplyBox("No participants yet.");
			}

			const participantList = giveaway.participants
				.map((p, i) => `${i + 1}. ${nameColor(p.username, true, false)}`)
				.join('<br />');

			this.sendReplyBox(`<strong>Giveaway Participants (${giveaway.participants.length}):</strong><br /><br />${participantList}`);
		},

		async history(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			const limit = 10;
			const giveaways = await GiveawayDB.find(
				{ active: false },
				{ sort: { endedAt: -1 }, limit }
			);

			if (giveaways.length === 0) {
				return this.sendReplyBox("No giveaway history found.");
			}

			const historyList = giveaways.map((g, i) => {
				const date = g.endedAt ? new Date(g.endedAt).toLocaleString() : 'N/A';
				return `${i + 1}. <strong>${nameColor(g.hostName, true, false)}</strong> gave away ${Economy.formatMoney(g.prize)} to ${nameColor(g.winnerName || 'Unknown', true, false)} - ${date}`;
			}).join('<br />');

			this.sendReplyBox(`<strong>Recent Giveaway History (Last ${limit}):</strong><br /><br />${historyList}`);
		},

		async setduration(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			if (!room || room.roomid === 'global') {
				return this.errorReply("You must be in a chat room to configure giveaway settings.");
			}

			const duration = parseInt(target.trim());

			if (!target || isNaN(duration) || duration < 1 || duration > 60) {
				return this.errorReply("Specify a valid duration between 1 and 60 minutes. Usage: /giveaway setduration [minutes]");
			}

			const roomid = room.roomid;

			// Update or insert the configuration
			await GiveawayConfigDB.upsert(
				{ roomid },
				{ $set: { roomid, defaultDuration: duration } }
			);

			this.sendReplyBox(`Default giveaway duration for this room has been set to ${duration} minute${duration !== 1 ? 's' : ''}.`);
			this.modlog('GIVEAWAY CONFIG', null, `set default duration to ${duration} minutes`);
		},

		async getduration(target, room, user): Promise<void> {
			if (!room || room.roomid === 'global') {
				return this.errorReply("You must be in a chat room to view giveaway settings.");
			}

			const roomid = room.roomid;
			const defaultDuration = await getRoomDefaultDuration(roomid);

			this.sendReplyBox(`Default giveaway duration for this room is ${defaultDuration} minute${defaultDuration !== 1 ? 's' : ''}.`);
		},
	},

	giveawayhelp: {
		''() {
			if (!this.runBroadcast()) return;
			const cmds = [
				[
					"/giveaway start [amount], [duration]",
					"Start a giveaway with the specified prize amount and optional duration in minutes " +
					"(or 'manual' for no auto-end). Requires: #.",
				],
				["/giveaway join", "Join an active giveaway."],
				["/giveaway end", "Manually end the giveaway and pick a random winner. Requires: #."],
				["/giveaway draw", "Immediately draw a winner (alias for end). Requires: #."],
				["/giveaway cancel", "Cancel the active giveaway without picking a winner. Requires: #."],
				["/giveaway participants", "View all participants in the current giveaway."],
				["/giveaway history", "View recent giveaway history (broadcastable)."],
				[
					"/giveaway setduration [minutes]",
					"Set the default auto-end duration for giveaways in this room (1-60 minutes). Requires: #.",
				],
				["/giveaway getduration", "View the current default auto-end duration for this room."],
			];
			this.sendReplyBox(
				`<center><strong>Giveaway Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				cmds.map(([c, d], i) => `<li><b>${c}</b> - ${d}</li>${i < cmds.length - 1 ? '<hr>' : ''}`).join('') +
				`</ul>`
			);
		},
	},
};
