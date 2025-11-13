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
}

const GiveawayDB = ImpulseDB<Giveaway>('giveaways');

// Store active giveaways by room
const activeGiveaways = new Map<string, Giveaway>();

export const commands: Chat.ChatCommands = {
	giveaway: {
		''(target, room, user) {
			return this.parse('/help giveaway');
		},

		start(target, room, user) {
			this.checkCan('roomowner');

			if (!room || room.roomid === 'global') {
				return this.errorReply("Giveaways can only be started in chat rooms.");
			}

			const roomid = room.roomid;

			// Check if there's already an active giveaway in this room
			if (activeGiveaways.has(roomid)) {
				return this.errorReply("There is already an active giveaway in this room. End it first with /giveaway end.");
			}

			const prizeStr = target.trim();
			const prize = parseInt(prizeStr);

			if (!prizeStr || isNaN(prize) || prize <= 0) {
				return this.errorReply("Specify a valid prize amount. Usage: /giveaway start [amount]");
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
			};

			activeGiveaways.set(roomid, giveaway);

			// Display the giveaway announcement with Join button
			const html = `<div class="infobox" style="border: 2px solid #4CAF50; padding: 15px; margin: 10px 0;">` +
				`<center>` +
				`<h2 style="color: #4CAF50; margin: 10px 0;">🎉 GIVEAWAY STARTED! 🎉</h2>` +
				`<p style="font-size: 16px; margin: 10px 0;">` +
				`<strong>Host:</strong> ${nameColor(user.name, true, true)}<br />` +
				`<strong>Prize:</strong> ${Economy.formatMoney(prize)} ${CURRENCY.name}` +
				`</p>` +
				`<p style="font-size: 14px; margin: 15px 0;">` +
				`Click the button below to join!` +
				`</p>` +
				`<button class="button" name="send" value="/giveaway join" ` +
				`style="background-color: #4CAF50; color: white; font-size: 16px; padding: 10px 20px; border-radius: 5px;">` +
				`Join Giveaway` +
				`</button>` +
				`<p style="font-size: 12px; margin-top: 15px; color: #666;">` +
				`Participants: <strong>0</strong>` +
				`</p>` +
				`</center>` +
				`</div>`;

			room.add(`|html|${html}`).update();
			this.modlog('GIVEAWAY', null, `started a giveaway for ${Economy.formatMoney(prize)}`);
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

			// Add the user to participants (host can join too, no restrictions)
			giveaway.participants.push({
				userid: user.id,
				username: user.name,
				joinedAt: new Date(),
			});

			// Update the giveaway display
			const html = `<div class="infobox" style="border: 2px solid #4CAF50; padding: 15px; margin: 10px 0;">` +
				`<center>` +
				`<h2 style="color: #4CAF50; margin: 10px 0;">🎉 GIVEAWAY ACTIVE! 🎉</h2>` +
				`<p style="font-size: 16px; margin: 10px 0;">` +
				`<strong>Host:</strong> ${nameColor(giveaway.hostName, true, true)}<br />` +
				`<strong>Prize:</strong> ${Economy.formatMoney(giveaway.prize)} ${CURRENCY.name}` +
				`</p>` +
				`<p style="font-size: 14px; margin: 15px 0;">` +
				`Click the button below to join!` +
				`</p>` +
				`<button class="button" name="send" value="/giveaway join" ` +
				`style="background-color: #4CAF50; color: white; font-size: 16px; padding: 10px 20px; border-radius: 5px;">` +
				`Join Giveaway` +
				`</button>` +
				`<p style="font-size: 12px; margin-top: 15px; color: #666;">` +
				`Participants: <strong>${giveaway.participants.length}</strong>` +
				`</p>` +
				`</center>` +
				`</div>`;

			room.add(`|html|${html}`).update();

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

			// Save to database
			await GiveawayDB.insertOne(giveaway);

			// Remove from active giveaways
			activeGiveaways.delete(roomid);

			// Announce the winner
			const html = `<div class="infobox" style="border: 2px solid #FFD700; padding: 15px; margin: 10px 0;">
				<center>
					<h2 style="color: #FFD700; margin: 10px 0;">🏆 GIVEAWAY WINNER! 🏆</h2>
					<p style="font-size: 18px; margin: 15px 0;">
						<strong>Winner:</strong> ${nameColor(winner.username, true, true)}
					</p>
					<p style="font-size: 16px; margin: 10px 0;">
						<strong>Prize Won:</strong> ${Economy.formatMoney(giveaway.prize)} ${CURRENCY.name}
					</p>
					<p style="font-size: 14px; color: #666; margin-top: 15px;">
						Total Participants: ${giveaway.participants.length}
					</p>
				</center>
			</div>`;

			room.add(`|html|${html}`).update();

			// Notify the winner
			const winnerUser = Users.get(winner.userid);
			if (winnerUser) {
				winnerUser.popup(`|html|<div class="infobox" style="border: 2px solid #FFD700; padding: 20px;"><center><h2 style="color: #FFD700;">🎉 Congratulations! 🎉</h2><p>You won the giveaway!</p><p style="font-size: 18px;"><strong>${Economy.formatMoney(giveaway.prize)} ${CURRENCY.name}</strong></p></center></div>`);
			}

			this.modlog('GIVEAWAY', winner.userid, `won the giveaway of ${Economy.formatMoney(giveaway.prize)}`);
		},

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
	},

	giveawayhelp: {
		''() {
			this.sendReplyBox(
				`<strong>Giveaway Commands:</strong><br />` +
				`<code>/giveaway start [amount]</code> - Start a giveaway with the specified prize amount (Requires: & or higher)<br />` +
				`<code>/giveaway join</code> - Join an active giveaway<br />` +
				`<code>/giveaway end</code> - End the giveaway and pick a random winner (Requires: & or higher)<br />` +
				`<code>/giveaway cancel</code> - Cancel the active giveaway (Requires: & or higher)<br />` +
				`<code>/giveaway participants</code> - View all participants in the current giveaway<br />` +
				`<code>/giveaway history</code> - View recent giveaway history<br />`
			);
		},
	},
};
