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

// Augment the existing User class to include our custom property
declare module '../../server/users' {
	interface User {
		lastLoginTime: number;
	}
}

// --- Integration Hooks ---

// 1. Hook into the User constructor to add lastLoginTime on creation
const originalUserInit = Users.User.prototype.init;
Users.User.prototype.init = function (...args: any[]) {
	originalUserInit.apply(this, args);
	this.lastLoginTime = Date.now();
};

// 2. Hook into the onDisconnect method to save ontime when a user leaves
const originalOnDisconnect = Users.User.prototype.onDisconnect;
Users.User.prototype.onDisconnect = function (connection: Connection) {
	if (this.named && this.lastLoginTime) {
		const sessionTime = Date.now() - this.lastLoginTime;
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

// 3. Hook into the merge method to preserve login time when a guest logs in
const originalMerge = Users.User.prototype.merge;
Users.User.prototype.merge = function (oldUser: User) {
	this.lastLoginTime = oldUser.lastLoginTime;
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
	return `${t.h.toLocaleString()} ${t.h === 1 ? "hour" : "hours"}, ${t.m.toLocaleString()} ${t.m === 1 ? "minute" : "minutes"}, and ${t.s.toLocaleString()} ${t.s === 1 ? "second" : "seconds"}`;
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
			if (targetUser?.connected && targetUser.lastLoginTime) {
				currentOntime = Date.now() - targetUser.lastLoginTime;
			}

			const output = `${Impulse.nameColor(targetId, true)}'s total ontime is <strong>${displayTime(convertTime(totalOntime + currentOntime))}</strong>. ${targetUser?.connected ? `Current ontime: <strong>${displayTime(convertTime(currentOntime))}</strong>.` : `Currently not online.`}`;
			this.sendReplyBox(output);
		},

		async ladder(target, room, user) {
			if (!this.runBroadcast()) return;

			const ontimeData = await OntimeDB.find({}, {sort: {ontime: -1}, limit: ONTIME_LEADERBOARD_SIZE});

			if (!ontimeData.length) return this.sendReplyBox("Ontime ladder is empty.");

			const ladder = ontimeData.map((entry, index) => {
				let currentOntime = 0;
				const targetUser = Users.get(entry._id);
				if (targetUser?.connected && targetUser.lastLoginTime) {
					currentOntime = Date.now() - targetUser.lastLoginTime;
				}
				const totalOntime = entry.ontime + currentOntime;
				return `<tr><td>${index + 1}</td><td>${Impulse.nameColor(entry._id, true)}</td><td>${displayTime(convertTime(totalOntime))}</td></tr>`;
			}).join('');

			return this.sendReply(`|raw|<div class="ladder"><table><tr><th>Rank</th><th>User</th><th>Ontime</th></tr>${ladder}</table></div>`);
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
