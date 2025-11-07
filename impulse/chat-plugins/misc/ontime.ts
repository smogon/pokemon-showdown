/*
* Pokemon Showdown
* Ontime Commands
* Records Online Time For Users
*/

import { FS } from '../../../lib/fs';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const ONTIME_FILE = FS('impulse/db/ontime.json');
const ONTIME_BLOCK_FILE = FS('impulse/db/ontime-block.json');
const ONTIME_LEADERBOARD_SIZE = 100;

type OntimeData = Record<string, number>;
type OntimeBlockData = Record<string, true>;

let ontime: OntimeData = {};
let blockedUsers: OntimeBlockData = {};

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
	return !!blockedUsers[userid];
}

function getBlockedOntimeUsers(): string[] {
	return Object.keys(blockedUsers);
}

async function loadOntimeData(): Promise<void> {
	try {
		await FS('impulse/db').mkdirp();

		const ontimeJSON = await ONTIME_FILE.readIfExists();
		ontime = ontimeJSON ? JSON.parse(ontimeJSON) : {};

		const blockedJSON = await ONTIME_BLOCK_FILE.readIfExists();
		blockedUsers = blockedJSON ? JSON.parse(blockedJSON) : {};
	} catch (err) {
		Monitor.error(`Failed to load ontime data: ${err}`);
	}
}

void loadOntimeData();

export const handlers: Chat.Handlers = {
	onDisconnect(user: User): void {
		const isLastConnection = user.connections.length === 0;
		if (user.named && isLastConnection && !user.isPublicBot) {
			if (isBlockedOntime(user.id)) return;
			const sessionTime = user.lastDisconnected - user.lastConnected;
			if (sessionTime > 0) {
				ontime[user.id] = (ontime[user.id] || 0) + sessionTime;
				ONTIME_FILE.writeUpdate(() => JSON.stringify(ontime, null, 2), { throttle: 10000 });
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

			const totalOntime = ontime[targetId] || 0;

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

			const ontimeMap = new Map(Object.entries(ontime).map(([k, v]) => [k, Number(v)]));

			for (const u of Users.users.values()) {
				if (u.connected && u.named && !ontimeMap.has(u.id) && !u.isPublicBot && !blockedSet.has(u.id)) {
					ontimeMap.set(u.id, 0);
				}
			}

			const ladderData = [...ontimeMap.entries()]
				.filter(([userid]) => !blockedSet.has(userid))
				.map(([userid, ontimeValue]) => {
					const u = Users.get(userid);
					const currentOntime = u?.connected && u.lastConnected ? Date.now() - u.lastConnected : 0;
					return { name: userid, time: ontimeValue + currentOntime };
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

		async block(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return this.errorReply("Please specify a user to block.");
			if (isBlockedOntime(targetId)) {
				return this.errorReply(`${nameColor(targetId, true)} is already blocked from gaining ontime.`);
			}
			
			blockedUsers[targetId] = true;
			await ONTIME_BLOCK_FILE.safeWrite(JSON.stringify(blockedUsers, null, 2));

			this.sendReplyBox(`${nameColor(targetId, true)} has been blocked from gaining ontime and will not appear on the ladder.`);
		},

		async unblock(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return this.errorReply("Please specify a user to unblock.");
			if (!isBlockedOntime(targetId)) {
				return this.errorReply(`${nameColor(targetId, true)} is not blocked from gaining ontime.`);
			}

			delete blockedUsers[targetId];
			await ONTIME_BLOCK_FILE.safeWrite(JSON.stringify(blockedUsers, null, 2));

			this.sendReplyBox(`${nameColor(targetId, true)} has been unblocked and can now gain ontime and appear on the ladder.`);
		},

		blocked(target, room, user): void {
			this.checkCan('roomowner');
			const blocked = getBlockedOntimeUsers();
			if (!blocked.length) return this.sendReplyBox("No users are currently blocked from gaining ontime.");
			
			const rows = blocked.map(userid => [nameColor(userid, true)]);
			const tableHTML = generateThemedTable('Blocked Ontime Users', ['User'], rows);
			this.sendReply(`|html|${tableHTML}`);
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
	},

	ontimehelp(): void { this.parse('/ontime help'); },
};
