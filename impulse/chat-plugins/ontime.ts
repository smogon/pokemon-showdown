/*
* Pokemon Showdown
* Ontime
* Refactored By @PrinceSky-Git
*/

import {ImpulseDB} from '../../impulse/impulse-db';

interface OntimeDocument {
	_id: string;
	ontime: number;
}

const OntimeDB = ImpulseDB<OntimeDocument>('ontime');
const ONTIME_LEADERBOARD_SIZE = 100;

const originalOnDisconnect = Users.User.prototype.onDisconnect;
Users.User.prototype.onDisconnect = function (this: User, connection: Connection) {
	const isLastConnection = this.connections.length === 1;
	originalOnDisconnect.call(this, connection);

	if (this.named && isLastConnection && !this.isPublicBot) {
		const sessionTime = this.lastDisconnected - this.lastConnected;
		if (sessionTime > 0) {
			void OntimeDB.updateOne(
				{_id: this.id},
				{$inc: {ontime: sessionTime}},
				{upsert: true}
			);
		}
	}
};

const originalMerge = Users.User.prototype.merge;
Users.User.prototype.merge = function (this: User, oldUser: User) {
	const oldUserLastConnected = oldUser.lastConnected;
	originalMerge.call(this, oldUser);

	if (oldUserLastConnected < this.lastConnected) {
		this.lastConnected = oldUserLastConnected;
	}
};

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

export const commands: Chat.ChatCommands = {
	ontime: {
		'': 'check',
		async check(target, room, user) {
			if (!this.runBroadcast()) return;

			const targetId = toID(target) || user.id;
			const targetUser = Users.get(targetId);
			
			if (targetUser?.isPublicBot) {
				return this.sendReplyBox(`${Impulse.nameColor(targetId, true)} is a bot and does not have its ontime tracked.`);
			}

			const ontimeDoc = await OntimeDB.findOne({_id: targetId});
			const totalOntime = ontimeDoc?.ontime || 0;

			if (!totalOntime && !targetUser?.connected) {
				return this.sendReplyBox(`${Impulse.nameColor(targetId, true)} has never been online on this server.`);
			}

			let currentOntime = 0;
			if (targetUser?.connected && targetUser.lastConnected) {
				currentOntime = Date.now() - targetUser.lastConnected;
			}

			let buf = ``;
			buf += `${Impulse.nameColor(targetId, true)}'s total ontime is <strong>${displayTime(convertTime(totalOntime + currentOntime))}</strong>. `;
			buf += targetUser?.connected ? `Current session ontime: <strong>${displayTime(convertTime(currentOntime))}</strong>.` : `Currently not online.`;
			this.sendReplyBox(buf);
		},

		async ladder(target, room, user) {
			if (!this.runBroadcast()) return;

			const ontimeData = await OntimeDB.find({}, {sort: {ontime: -1}, limit: 100});
			const ontimeMap = new Map(ontimeData.map(d => [d._id, d.ontime]));

			for (const u of Users.users.values()) {
				if (u.connected && u.named && !ontimeMap.has(u.id) && !u.isPublicBot) {
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

			const tableData = ladderData.slice(0, ONTIME_LEADERBOARD_SIZE).map((entry, index) => {
				return [
					`${index + 1}`,
					Impulse.nameColor(entry.name, true),
					displayTime(convertTime(entry.time)),
				];
			});

			const table = Impulse.generateThemedTable(
				`Ontime Leaderboard`,
				['Rank', 'User', 'Total Ontime'],
				tableData
			);
			
			return this.sendReply(`|raw|${table}`);
		},
	},

	ontimehelp() {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`<div><b><center>Ontime Commands</center></b><br>` +
			`<ul>` +
			`<li><code>/ontime [target]</code> - Checks a user's online time on the server. If no target is provided, it defaults to the user who used the command.</li>` +
			`<li><code>/ontime ladder</code> - Displays the ontime leaderboard showing top 100 users by total time spent online.</li>` +
			`</ul>` +
			`</div>`
		);
	},
};
