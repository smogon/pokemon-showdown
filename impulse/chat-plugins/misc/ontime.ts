/*
* Pokemon Showdown
* Ontime chat-plugin.
* Refactored By @ClarkJ338
*/
import { FS } from '../../../lib';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const DATA_FILE = 'impulse/db/ontime.json';
const ONTIME_LEADERBOARD_SIZE = 100;

interface OntimeData {
	ontime: { [userid: string]: number };
	blocks: { [userid: string]: boolean };
}

let data: OntimeData = {
	ontime: {},
	blocks: {},
};

const saveData = (): void => {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(data), { throttle: 5000 });
};

const loadData = async (): Promise<void> => {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) {
			const json = JSON.parse(raw);
			data = {
				ontime: json.ontime || {},
				blocks: json.blocks || {},
			};
		}
	} catch (e) {
		console.error('Failed to load ontime data:', e);
		data = { ontime: {}, blocks: {} };
	}
};

void loadData();

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

const isBlockedOntime = (userid: string): boolean => {
	return !!data.blocks[userid];
};

const getCurrentSessionTime = (user: User | undefined): number => {
	return user?.connected && user.lastConnected ? Date.now() - user.lastConnected : 0;
};

const getTotalOntime = (userid: string): number => {
	return data.ontime[userid] || 0;
};

const updateOntime = (userid: string, sessionTime: number): void => {
	if (!data.ontime[userid]) data.ontime[userid] = 0;
	data.ontime[userid] += sessionTime;
	saveData();
};

const blockUser = (userid: string): void => {
	data.blocks[userid] = true;
	saveData();
};

const unblockUser = (userid: string): void => {
	delete data.blocks[userid];
	saveData();
};

function formatOntimeDisplay(userid: string, totalTime: number, currentSession: number, isConnected: boolean): string {
	const displayTotal = displayTime(convertTime(totalTime + currentSession));
	const sessionPart = isConnected ? ` Current session: <strong>${displayTime(convertTime(currentSession))}</strong>.` : '';
	return `${nameColor(userid, true)}'s total ontime is <strong>${displayTotal}</strong>.${sessionPart}`;
}

export const handlers: Chat.Handlers = {
	onDisconnect(user: User): void {
		const isLastConnection = user.connections.length === 0;
		if (user.named && isLastConnection && !user.isPublicBot) {
			if (isBlockedOntime(user.id)) return;
			
			const sessionTime = Date.now() - user.lastConnected;
			
			if (sessionTime > 0) {
				updateOntime(user.id, sessionTime);
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

			const totalOntime = getTotalOntime(targetId);

			if (!totalOntime && !targetUser?.connected) {
				return this.sendReplyBox(`${nameColor(targetId, true)} has never been online.`);
			}

			const currentOntime = getCurrentSessionTime(targetUser);
			const buf = formatOntimeDisplay(targetId, totalOntime, currentOntime, !!targetUser?.connected);
			this.sendReplyBox(buf);
		},

		ladder(target, room, user): void {
			if (!this.runBroadcast()) return;

			const ontimeEntries = Object.entries(data.ontime);
			const ontimeMap = new Map(ontimeEntries);

			for (const u of Users.users.values()) {
				if (u.connected && u.named && !ontimeMap.has(u.id) && !u.isPublicBot && !isBlockedOntime(u.id)) {
					ontimeMap.set(u.id, 0);
				}
			}

			const ladderData = [...ontimeMap.entries()]
				.filter(([userid]) => !isBlockedOntime(userid))
				.map(([userid, ontime]) => {
					const u = Users.get(userid);
					const currentOntime = getCurrentSessionTime(u);
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
				{ cmd: "/ontime blocklist", desc: "List blocked users. Requires: &." },
			];
			const html = `<center><strong>Ontime Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},

		block(target, room, user): void {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) throw new Chat.ErrorMessage("Please specify a user to block.");
			
			if (isBlockedOntime(targetId)) {
				throw new Chat.ErrorMessage(`${nameColor(targetId, true)} is already blocked from gaining ontime.`);
			}
			
			blockUser(targetId);
			this.sendReplyBox(`${nameColor(targetId, true)} has been blocked from gaining ontime and will not appear on the ladder.`);
		},

		unblock(target, room, user): void {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) throw new Chat.ErrorMessage("Please specify a user to unblock.");
			
			if (!isBlockedOntime(targetId)) {
				throw new Chat.ErrorMessage(`${nameColor(targetId, true)} is not blocked from gaining ontime.`);
			}
			
			unblockUser(targetId);
			this.sendReplyBox(`${nameColor(targetId, true)} has been unblocked and can now gain ontime and appear on the ladder.`);
		},

		blocklist(target, room, user): void {
			this.checkCan('roomowner');
			const blockedUsers = Object.keys(data.blocks);
			if (!blockedUsers.length) return this.sendReplyBox("No users are currently blocked from gaining ontime.");
			
			const rows = blockedUsers.map(userid => [nameColor(userid, true)]);
			const tableHTML = generateThemedTable('Blocked Ontime Users', ['User'], rows);
			this.sendReply(`|html|${tableHTML}`);
		},
	},

	ontimehelp(): void { this.parse('/ontime help'); },
};
