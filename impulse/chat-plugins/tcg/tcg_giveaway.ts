/*
* Pokemon Showdown
* TCG Giveaway Commands
* @author TurboRx
*/
import { nameColor } from '../../colors';
import { ImpulseDB } from '../../impulse-db';
import { tcgCardsCollection, userCollectionsCollection } from './tcg_collections';
import { getCard } from './tcg_utils';
import type { TcgCard } from './interface';

interface TcgGiveawayParticipant {
	userid: string;
	username: string;
	joinedAt: Date;
}

interface TcgGiveaway {
	_id?: unknown;
	roomid: string;
	hostId: string;
	hostName: string;
	cardId: string;
	cardName: string;
	cardRarity: string;
	cardImageUrl?: string;
	participants: TcgGiveawayParticipant[];
	startedAt: Date;
	active: boolean;
	winnerId?: string;
	winnerName?: string;
	endedAt?: Date;
	duration?: number;
	timer?: NodeJS.Timeout;
}

interface TcgGiveawayConfig {
	_id?: unknown;
	roomid: string;
	defaultDuration: number;
}

const TCG_GIVEAWAY_DB_NAME = 'tcg_giveaways';
const TCG_CONFIG_DB_NAME = 'tcg_giveaway_config';
const DEFAULT_DURATION = 5;
const MIN_DURATION = 1;
const MAX_DURATION = 60;
const HISTORY_LIMIT = 10;

const TcgGiveawayDB = ImpulseDB<TcgGiveaway>(TCG_GIVEAWAY_DB_NAME);
const TcgGiveawayConfigDB = ImpulseDB<TcgGiveawayConfig>(TCG_CONFIG_DB_NAME);

const activeTcgGiveaways = new Map<string, TcgGiveaway>();

function generateTcgGiveawayHTML(giveaway: TcgGiveaway): string {
	const durationText = giveaway.duration ?
		`${giveaway.duration} minute${giveaway.duration !== 1 ? 's' : ''}` :
		'Manual (no auto-end)';

	const imageUrl = giveaway.cardImageUrl || 'https://via.placeholder.com/160x223?text=No+Image';
	const imageWidth = 160;
	const imageHeight = 223;

	return `<div class="infobox" style="border: 2px solid #4CAF50; padding: 15px; margin: 10px 0;">` +
		`<center>` +
		`<h2 style="color: #4CAF50; margin: 10px 0;">TCG CARD GIVEAWAY ACTIVE!</h2>` +
		`<img src="${imageUrl}" width="${imageWidth}" height="${imageHeight}" alt="${giveaway.cardName}" title="${giveaway.cardName}" style="border-radius: 8px; display: block; margin: 10px auto;" />` +
		`<p style="font-size: 16px; margin: 10px 0;">` +
		`<strong>Host:</strong> ${nameColor(giveaway.hostName, true, true)}<br />` +
		`<strong>Card:</strong> ${giveaway.cardName}<br />` +
		`<strong>Rarity:</strong> ${giveaway.cardRarity}<br />` +
		`<strong>Duration:</strong> ${durationText}` +
		`</p>` +
		`<p style="font-size: 14px; margin: 15px 0;">` +
		`Click the button below to join!` +
		`</p>` +
		`<button class="button" name="send" value="/tcg giveaway join" ` +
		`style="font-size: 16px; padding: 10px 20px; border-radius: 5px;">` +
		`Join Giveaway` +
		`</button>` +
		`<p style="font-size: 12px; margin-top: 15px;">` +
		`Participants: <strong>${giveaway.participants.length}</strong>` +
		`</p>` +
		`</center>` +
		`</div>`;
}

async function getRoomDefaultDuration(roomid: string): Promise<number> {
	const config = await TcgGiveawayConfigDB.findOne({ roomid });
	return config?.defaultDuration || DEFAULT_DURATION;
}

async function endTcgGiveaway(roomid: string, room: Room): Promise<void> {
	const giveaway = activeTcgGiveaways.get(roomid);
	if (!giveaway) return;

	if (giveaway.timer) {
		clearTimeout(giveaway.timer);
	}

	if (giveaway.participants.length === 0) {
		activeTcgGiveaways.delete(roomid);
		room.add(`|html|<div class="infobox" style="border: 2px solid #f44336; padding: 15px;"><center><strong>TCG Card Giveaway ended with no participants!</strong></center></div>`).update();
		return;
	}

	const randomIndex = Math.floor(Math.random() * giveaway.participants.length);
	const winner = giveaway.participants[randomIndex];

	// Add card to winner's collection
	try {
		await userCollectionsCollection.updateOne(
			{ userId: winner.userid, cardId: giveaway.cardId },
			{
				$inc: { quantity: 1 },
				$setOnInsert: {
					userId: winner.userid,
					cardId: giveaway.cardId,
					firstAcquiredAt: new Date().toISOString(),
				},
				$set: {
					lastAcquiredAt: new Date().toISOString(),
				},
			},
			{ upsert: true }
		);
	} catch (e) {
		console.error('Error adding card to winner collection:', e);
	}

	giveaway.active = false;
	giveaway.winnerId = winner.userid;
	giveaway.winnerName = winner.username;
	giveaway.endedAt = new Date();

	await TcgGiveawayDB.insertOne(giveaway);
	activeTcgGiveaways.delete(roomid);

	const imageUrl = giveaway.cardImageUrl || 'https://via.placeholder.com/160x223?text=No+Image';

	const html = `<div class="infobox" style="border: 2px solid #4CAF50; padding: 15px; margin: 10px 0;">` +
		`<center>` +
		`<h2 style="color: #4CAF50; margin: 10px 0;">TCG CARD GIVEAWAY WINNER!</h2>` +
		`<img src="${imageUrl}" width="160" height="223" alt="${giveaway.cardName}" title="${giveaway.cardName}" style="border-radius: 8px; display: block; margin: 10px auto;" />` +
		`<p style="font-size: 18px; margin: 15px 0;">` +
		`<strong>Winner:</strong> ${nameColor(winner.username, true, true)}` +
		`</p>` +
		`<p style="font-size: 16px; margin: 10px 0;">` +
		`<strong>Card Won:</strong> ${giveaway.cardName}` +
		`</p>` +
		`<p style="font-size: 14px; margin-top: 15px;">` +
		`Total Participants: ${giveaway.participants.length}` +
		`</p>` +
		`</center>` +
		`</div>`;

	room.add(`|html|${html}`).update();

	const winnerUser = Users.get(winner.userid);
	if (winnerUser) {
		winnerUser.popup(`|html|<div class="infobox" style="border: 2px solid #4CAF50; padding: 20px;"><center><h2 style="color: #4CAF50;">Congratulations!</h2><p>You won the TCG card giveaway!</p><p style="font-size: 18px;"><strong>${giveaway.cardName}</strong></p></center></div>`);
	}
}

export const tcgGiveawayCommands: Chat.ChatCommands = {
	giveaway: {
		''(target, room, user) {
			return this.parse('/help tcg giveaway');
		},

		async start(target, room, user) {
			this.checkCan('roomowner');

			if (!room || room.roomid === 'global') {
				return this.errorReply("TCG Card giveaways can only be started in chat rooms.");
			}
			const roomid = room.roomid;

			if (activeTcgGiveaways.has(roomid)) {
				return this.errorReply("There is already an active TCG card giveaway in this room. End it first with /tcg giveaway end.");
			}

			const [cardIdStr, durationStr] = target.split(',').map(s => s.trim());

			if (!cardIdStr) {
				return this.errorReply("Specify a card ID. Usage: /tcg giveaway start [cardId], [duration in minutes or 'manual']");
			}

			// Fetch the card details
			let card: TcgCard | null = null;
			try {
				card = getCard(cardIdStr) || null;
				if (!card) {
					card = await tcgCardsCollection.findOne({ cardId: cardIdStr });
				}
				if (!card) {
					return this.errorReply(`Card with ID "${cardIdStr}" not found.`);
				}
			} catch {
				return this.errorReply("An error occurred while fetching card information.");
			}

			const defaultDuration = await getRoomDefaultDuration(roomid);

			let duration: number | undefined;
			let isManual = false;

			if (durationStr && (durationStr.toLowerCase() === 'manual' || durationStr === '0')) {
				isManual = true;
				duration = undefined;
			} else {
				duration = durationStr ? parseInt(durationStr) : defaultDuration;
			}

			if (!isManual && (isNaN(duration!) || duration! < MIN_DURATION || duration! > MAX_DURATION)) {
				return this.errorReply(`Duration must be between ${MIN_DURATION} and ${MAX_DURATION} minutes, or 'manual' for manual-only ending.`);
			}

			const giveaway: TcgGiveaway = {
				roomid,
				hostId: user.id,
				hostName: user.name,
				cardId: card.cardId,
				cardName: card.name,
				cardRarity: card.rarity,
				cardImageUrl: card.imageUrl,
				participants: [],
				startedAt: new Date(),
				active: true,
				duration,
			};

			if (!isManual && duration) {
				giveaway.timer = setTimeout(() => {
					void endTcgGiveaway(roomid, room);
				}, duration * 60 * 1000);
			}

			activeTcgGiveaways.set(roomid, giveaway);

			const uhtmlid = `tcg-giveaway-${roomid}`;
			const html = generateTcgGiveawayHTML(giveaway);

			room.add(`|uhtml|${uhtmlid}|${html}`).update();
			this.modlog('TCG GIVEAWAY', null, `started a TCG card giveaway for ${card.name} (${isManual ? 'manual' : `${duration} min`})`);
		},

		join(target, room, user) {
			if (!room || room.roomid === 'global') {
				return this.errorReply("You must be in a chat room to join a TCG card giveaway.");
			}

			const roomid = room.roomid;
			const giveaway = activeTcgGiveaways.get(roomid);

			if (!giveaway) {
				return this.errorReply("There is no active TCG card giveaway in this room.");
			}

			const alreadyJoined = giveaway.participants.some(p => p.userid === user.id);
			if (alreadyJoined) {
				return this.errorReply("You have already joined this TCG card giveaway!");
			}

			giveaway.participants.push({
				userid: user.id,
				username: user.name,
				joinedAt: new Date(),
			});

			const uhtmlid = `tcg-giveaway-${roomid}`;
			const html = generateTcgGiveawayHTML(giveaway);
			room.add(`|uhtmlchange|${uhtmlid}|${html}`).update();

			this.sendReply("You have successfully joined the TCG card giveaway!");
		},

		async end(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			if (!room || room.roomid === 'global') {
				return this.errorReply("TCG Card giveaways can only be ended in chat rooms.");
			}

			const roomid = room.roomid;
			if (!activeTcgGiveaways.has(roomid)) {
				return this.errorReply("There is no active TCG card giveaway in this room.");
			}

			await endTcgGiveaway(roomid, room);

			this.modlog('TCG GIVEAWAY', null, 'manually ended the TCG card giveaway');
		},

		draw: 'end',

		cancel(target, room, user) {
			this.checkCan('roomowner');

			if (!room || room.roomid === 'global') {
				return this.errorReply("There is no TCG card giveaway to cancel in this context.");
			}

			const roomid = room.roomid;
			const giveaway = activeTcgGiveaways.get(roomid);

			if (!giveaway) {
				return this.errorReply("There is no active TCG card giveaway in this room.");
			}

			if (giveaway.timer) {
				clearTimeout(giveaway.timer);
			}

			activeTcgGiveaways.delete(roomid);

			const cancelHtml = `<div class="infobox" style="border: 2px solid #f44336; padding: 15px;">` +
				`<center><strong>The TCG card giveaway has been cancelled by ${nameColor(user.name, true, true)}.</strong></center>` +
				`</div>`;
			room.add(`|html|${cancelHtml}`).update();
			this.modlog('TCG GIVEAWAY', null, 'cancelled the TCG card giveaway');
		},

		participants(target, room, user) {
			if (!room || room.roomid === 'global') {
				return this.errorReply("You must be in a chat room to view TCG card giveaway participants.");
			}

			const roomid = room.roomid;
			const giveaway = activeTcgGiveaways.get(roomid);

			if (!giveaway) {
				return this.errorReply("There is no active TCG card giveaway in this room.");
			}

			if (giveaway.participants.length === 0) {
				return this.sendReplyBox("No participants yet.");
			}

			const participantList = giveaway.participants
				.map((p, i) => `${i + 1}. ${nameColor(p.username, true, false)}`)
				.join('<br />');

			this.sendReplyBox(`<strong>TCG Card Giveaway Participants (${giveaway.participants.length}):</strong><br /><br />${participantList}`);
		},

		async history(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			const giveaways = await TcgGiveawayDB.find(
				{ active: false },
				{ sort: { endedAt: -1 }, limit: HISTORY_LIMIT }
			);

			if (giveaways.length === 0) {
				return this.sendReplyBox("No TCG card giveaway history found.");
			}

			const historyList = giveaways.map((g, i) => {
				const date = g.endedAt ? new Date(g.endedAt).toLocaleString() : 'N/A';
				return `${i + 1}. <strong>${nameColor(g.hostName, true, false)}</strong> gave away ${g.cardName} to ${nameColor(g.winnerName || 'Unknown', true, false)} - ${date}`;
			}).join('<br />');

			this.sendReplyBox(`<strong>Recent TCG Card Giveaway History (Last ${HISTORY_LIMIT}):</strong><br /><br />${historyList}`);
		},

		async setduration(target, room, user): Promise<void> {
			this.checkCan('roomowner');

			if (!room || room.roomid === 'global') {
				return this.errorReply("You must be in a chat room to configure TCG card giveaway settings.");
			}

			const duration = parseInt(target.trim());

			if (!target || isNaN(duration) || duration < MIN_DURATION || duration > MAX_DURATION) {
				return this.errorReply(`Specify a valid duration between ${MIN_DURATION} and ${MAX_DURATION} minutes. Usage: /tcg giveaway setduration [minutes]`);
			}

			const roomid = room.roomid;

			await TcgGiveawayConfigDB.upsert(
				{ roomid },
				{ $set: { roomid, defaultDuration: duration } }
			);

			this.sendReplyBox(`Default TCG card giveaway duration for this room has been set to ${duration} minute${duration !== 1 ? 's' : ''}.`);
			this.modlog('TCG GIVEAWAY CONFIG', null, `set default duration to ${duration} minutes`);
		},

		async getduration(target, room, user): Promise<void> {
			if (!room || room.roomid === 'global') {
				return this.errorReply("You must be in a chat room to view TCG card giveaway settings.");
			}

			const roomid = room.roomid;
			const defaultDuration = await getRoomDefaultDuration(roomid);

			this.sendReplyBox(`Default TCG card giveaway duration for this room is ${defaultDuration} minute${defaultDuration !== 1 ? 's' : ''}.`);
		},
	},

	tcggiveawayhelp: {
		''() {
			if (!this.runBroadcast()) return;
			const cmds = [
				[
					"/tcg giveaway start [cardId], [duration]",
					"Start a TCG card giveaway with the specified card ID and optional duration in minutes " +
					"(or 'manual' for no auto-end). Requires: #.",
				],
				["/tcg giveaway join", "Join an active TCG card giveaway."],
				["/tcg giveaway end", "Manually end the TCG card giveaway and pick a random winner. Requires: #."],
				["/tcg giveaway draw", "Immediately draw a winner (alias for end). Requires: #."],
				["/tcg giveaway cancel", "Cancel the active TCG card giveaway without picking a winner. Requires: #."],
				["/tcg giveaway participants", "View all participants in the current TCG card giveaway."],
				["/tcg giveaway history", "View recent TCG card giveaway history (broadcastable)."],
				[
					`/tcg giveaway setduration [minutes]`,
					`Set the default auto-end duration for TCG card giveaways in this room (${MIN_DURATION}-${MAX_DURATION} minutes). Requires: #.`,
				],
				["/tcg giveaway getduration", "View the current default auto-end duration for this room."],
			];
			this.sendReplyBox(
				`<center><strong>TCG Card Giveaway Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				cmds.map(([c, d], i) => `<li><b>${c}</b> - ${d}</li>${i < cmds.length - 1 ? '<hr>' : ''}`).join('') +
				`</ul>`
			);
		},
	},
};
