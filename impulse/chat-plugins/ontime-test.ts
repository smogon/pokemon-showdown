/*
* Pokemon Showdown
* Ontime Commands
*
* This file contains commands that keep track of users' activity.
* It cleanly integrates with server/users.ts without manual modification.
*
* @license MIT
* @author PrinceSky-Git
*/

import {ImpulseDB} from '../../impulse/impulse-db';

// Define the structure of our ontime records in the database
interface OntimeDocument {
	_id: string;
	ontime: number;
}

const OntimeDB = ImpulseDB<OntimeDocument>('ontime');
const ONTIME_LEADERBOARD_SIZE = 100;


// --- Integration Hooks ---

// 1. Hook into the onDisconnect method to save ontime when a user leaves
const originalOnDisconnect = Users.User.prototype.onDisconnect;
Users.User.prototype.onDisconnect = function (connection: Connection) {
	// Only save ontime for named users who are fully disconnecting
	if (this.named && this.connections.length === 1) {
		const sessionTime = Date.now() - this.lastConnected;
		if (sessionTime > 0) {
			void OntimeDB.updateOne(
				{_id: this.id},
				{$inc: {ontime: sessionTime}},
				{upsert: true}
			);
		}
	}
	originalOnDisconnect.call(this, connection);
};

// 2. Hook into the merge method to preserve the original session start time when a guest logs in
const originalMerge = Users.User.prototype.merge;
Users.User.prototype.merge = function (oldUser: User) {
	// When merging, keep the earliest connection time to preserve the full session duration
	if (oldUser.lastConnected < this.lastConnected) {
		this.lastConnected = oldUser.lastConnected;
	}
	originalMerge.call(this, oldUser);
};


// --- Helper Functions ---

function convertTime(time: number): {h: number, m: number, s: number} {
	const seconds = Math.floor((time / 1000) % 60);
	const minutes = Math.floor((time / (1000 * 60)) % 60);
	const hours = Math.floor(time / (1000 * 60 * 60));
	return {h: hours, m: minutes, s: seconds};
}

function displayTime(t: {h: number, m: number, s: number}): string {
	const parts = [];
	if (t.h > 0) parts.push(`${t.h.toLocaleString()} ${t.h === 1 ? "hour" : "hours"}`);
	if (t.m > 0) parts.push(`${t.m.toLocaleString()} ${t.m === 1 ? "minute" : "minutes"}`);
	if (t.s > 0) parts.push(`${t.s.toLocaleString()} ${t.s === 1 ? "second" : "seconds"}`);
	return parts.join(', ') || '0 seconds';
}


// --- Chat Commands ---

export const commands: Chat.ChatCommands = {
	ontime: {
		'': 'check',
		async check(target, room, user) {
			if (!this.runBroadcast()) return;

			const targetId = toID(target) || user.id;
			const targetUser = Users.get(targetId);
			const ontimeDoc = await OntimeDB.findOne({_id: targetId});
			const totalOntime = ontimeDoc?.ontime || 0;

			if (!totalOntime && !targetUser?.connected) {
				return this.sendReplyBox(`${Impulse.nameColor(targetId, true)} has never been online on this server.`);
			}

			let currentOntime = 0;
			if (targetUser?.connected && targetUser.lastConnected) {
				currentOntime = Date.now() - targetUser.lastConnected;
			}

			const output = `${Impulse.nameColor(targetId, true)}'s total ontime is <strong>${displayTime(convertTime(totalOntime + currentOntime))}</strong>. ${targetUser?.connected ? `Current session ontime: <strong>${displayTime(convertTime(currentOntime))}</strong>.` : `Currently not online.`}`;
			this.sendReplyBox(output);
		},

		async ladder(target, room, user) {
			if (!this.runBroadcast()) return;

			// Fetch top users from DB
			const ontimeData = await OntimeDB.find({}, {sort: {ontime: -1}, limit: 100});
			const ontimeMap = new Map(ontimeData.map(d => [d._id, d.ontime]));

			// Add currently online users who might not be in the top DB results yet
			for (const u of Users.users.values()) {
				if (u.connected && u.named && !ontimeMap.has(u.id)) {
					ontimeMap.set(u.id, 0);
				}
			}

			const ladderData = [...ontimeMap.entries()].map(([userid, ontime]) => {
				let currentOntime = 0;
				const targetUser = Users.get(userid);
				if (targetUser?.connected && targetUser.lastConnected) {
					currentOntime = Date.now() - targetUser.lastConnected;
				}
				return {name: userid, time: ontime + currentOntime};
			});


			if (!ladderData.length) return this.sendReplyBox("Ontime ladder is empty.");

			ladderData.sort((a, b) => b.time - a.time);

			const ladder = ladderData.slice(0, ONTIME_LEADERBOARD_SIZE).map((entry, index) => {
				return `<tr><td style="text-align:center">${index + 1}</td><td>${Impulse.nameColor(entry.name, true)}</td><td>${displayTime(convertTime(entry.time))}</td></tr>`;
			}).join('');

			return this.sendReply(`|raw|<div class="ladder"><table><tr><th>Rank</th><th>User</th><th>Total Ontime</th></tr>${ladder}</table></div>`);
		},
	},

	ontimehelp() {
		this.runBroadcast();
		this.sendReplyBox(
			`"/ontime [target]" - Checks a user's online time on the server. If no target is provided, it defaults to the user who used the command.<br />` +
			`"/ontime ladder" - Displays the ontime leaderboard.`
		);
	},
};
