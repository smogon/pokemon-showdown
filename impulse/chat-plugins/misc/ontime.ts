/*
* Pokemon Showdown
* Ontime Commands
*/
import { FS } from '../../../lib/fs';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

interface OntimeDocument {
	_id: string;
	ontime: number;
}

interface OntimeData {
	users: { [userId: string]: OntimeDocument };
	blocked: { [userId: string]: boolean };
}

const ONTIME_FILE = 'impulse/db/ontime.json';
const ONTIME_LEADERBOARD_SIZE = 100;

let ontimeData: OntimeData = {
	users: {},
	blocked: {},
};

const loadOntime = async (): Promise<void> => {
	const data = await FS(ONTIME_FILE).readIfExists();
	if (data) {
		ontimeData = JSON.parse(data);
	}
};

const saveOntime = (): void => {
	// Use writeUpdate with throttling since there will be many concurrent writes
	FS(ONTIME_FILE).writeUpdate(
		() => JSON.stringify(ontimeData, null, 2),
		{ throttle: 10000 } // Save at most once every 10 seconds
	);
};

const convertTime = (time: number): { h: number, m: number, s: number } => {
	const s = Math.floor((time / 1000) % 60);
	const m = Math.floor((time / (1000 * 60)) % 60);
	const h = Math.floor(time / (1000 * 60 * 60));
	return { h, m, s };
};

const displayTime = (t: { h: number, m: number, s: number }): string => {
	const parts: string[] = [];
	if (t.h > 0) parts.push(`${t.h.toLocaleString()} ${t.h === 1 ? 'hour' : 'hours'}`);
	if (t.m > 0) parts.push(`${t.m.toLocaleString()} ${t.m === 1 ? 'minute' : 'minutes'}`);
	if (t.s > 0) parts.push(`${t.s.toLocaleString()} ${t.s === 1 ? 'second' : 'seconds'}`);
	return parts.length ? parts.join(', ') : '0 seconds';
};

function isBlockedOntime(userid: string): boolean {
	return !!ontimeData.blocked[userid];
}

function getBlockedOntimeUsers(): string[] {
	return Object.keys(ontimeData.blocked);
}

export const handlers: Chat.Handlers = {
	onDisconnect(user: User): void {
		const isLastConnection = user.connections.length === 0;
		if (user.named && isLastConnection && !user.isPublicBot) {
			if (isBlockedOntime(user.id)) return;
			
			const sessionTime = user.lastDisconnected - user.lastConnected;
			if (sessionTime > 0) {
				// Update in-memory data
				if (!ontimeData.users[user.id]) {
					ontimeData.users[user.id] = { _id: user.id, ontime: 0 };
				}
				ontimeData.users[user.id].ontime += sessionTime;
				
				// Queue write with throttling to handle many concurrent disconnects
				saveOntime();
			}
		}
	},
};

export const commands: Chat.ChatCommands = {
	ontime: {
		'': 'check',
		check(target, room, user): void {
			if (!this.runBroadcast()) return;

			const targetId = toID(target) || user.id;
			const targetUser = Users.get(targetId);

			if (targetUser?.isPublicBot) {
				return this.sendReplyBox(`${nameColor(targetId, true)} is a bot and does not track ontime.`);
			}

			if (isBlockedOntime(targetId)) {
				return this.sendReplyBox(`${nameColor(targetId, true)} is blocked from gaining ontime.`);
			}

			const ontimeDoc = ontimeData.users[targetId];
			const totalOntime = ontimeDoc?.ontime || 0;

			if (!totalOntime && !targetUser?.connected) {
				return this.sendReplyBox(`${nameColor(targetId, true)} has never been online.`);
			}

			const currentOntime = targetUser?.connected && targetUser.lastConnected ? Date.now() - targetUser.lastConnected : 0;

			const buf = `${nameColor(targetId, true)}'s total ontime is <strong>${displayTime(convertTime(totalOntime + currentOntime))}</strong>. ${targetUser?.connected ? `Current session: <strong>${displayTime(convertTime(currentOntime))}</strong>.` : ''}`;
			this.sendReplyBox(buf);
		},

		ladder(target, room, user): void {
			if (!this.runBroadcast()) return;

			const blockedSet = new Set(getBlockedOntimeUsers());
			const ontimeMap = new Map<string, number>();

			// Add stored ontime data
			for (const [userId, doc] of Object.entries(ontimeData.users)) {
				if (!blockedSet.has(userId)) {
					ontimeMap.set(userId, doc.ontime);
				}
			}

			// Add currently connected users
			for (const u of Users.users.values()) {
				if (u.connected && u.named && !u.isPublicBot && !blockedSet.has(u.id)) {
					if (!ontimeMap.has(u.id)) {
						ontimeMap.set(u.id, 0);
					}
				}
			}

			const ladderData = [...ontimeMap.entries()]
				.map(([userid, ontime]) => {
					const u = Users.get(userid);
					const currentOntime = u?.connected && u.lastConnected ? Date.now() - u.lastConnected : 0;
					return { name: userid, time: ontime + currentOntime };
				})
				.sort((a, b) => b.time - a.time)
				.slice(0, ONTIME_LEADERBOARD_SIZE);

			if (!ladderData.length) return this.sendReplyBox("Leaderboard empty.");

			const rows = ladderData.map((entry, i) => [
				(i + 1).toString(),
				nameColor(entry.name, true),
				displayTime(convertTime(entry.time)),
			]);

			const tableHTML = generateThemedTable('Ontime Leaderboard', ['Rank', 'User', 'Time'], rows);
			return this.sendReply(`|raw|${tableHTML}`);
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/ontime [user]", desc: "Check user's online time." },
				{ cmd: "/ontime ladder", desc: "Top 100 by ontime." },
				{ cmd: "/ontime block [user]", desc: "Block user from gaining ontime. Requires: &." },
				{ cmd: "/ontime unblock [user]", desc: "Unblock user from gaining ontime. Requires: &." },
				{ cmd: "/ontime blocked", desc: "List blocked users. Requires: &." },
			];
			const html = `<center><strong>Ontime Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},

		async block(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return this.errorReply("Please specify a user to block.");
			if (isBlockedOntime(targetId)) {
				return this.errorReply(`${nameColor(targetId, true)} is already blocked from gaining ontime.`);
			}
			
			ontimeData.blocked[targetId] = true;
			await FS(ONTIME_FILE).safeWrite(JSON.stringify(ontimeData, null, 2));
			
			this.sendReplyBox(`${nameColor(targetId, true)} has been blocked from gaining ontime and will not appear on the ladder.`);
		},

		async unblock(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return this.errorReply("Please specify a user to unblock.");
			if (!isBlockedOntime(targetId)) {
				return this.errorReply(`${nameColor(targetId, true)} is not blocked from gaining ontime.`);
			}
			
			delete ontimeData.blocked[targetId];
			await FS(ONTIME_FILE).safeWrite(JSON.stringify(ontimeData, null, 2));
			
			this.sendReplyBox(`${nameColor(targetId, true)} has been unblocked and can now gain ontime and appear on the ladder.`);
		},

		blocked(target, room, user): void {
			this.checkCan('roomowner');
			const blockedUsers = getBlockedOntimeUsers();
			if (!blockedUsers.length) return this.sendReplyBox("No users are currently blocked from gaining ontime.");
			const rows = blockedUsers.map(userid => [nameColor(userid, true)]);
			const tableHTML = generateThemedTable('Blocked Ontime Users', ['User'], rows);
			this.sendReply(`|html|${tableHTML}`);
		},
	},

	ontimehelp(): void { this.parse('/ontime help'); },
};

void loadOntime();
