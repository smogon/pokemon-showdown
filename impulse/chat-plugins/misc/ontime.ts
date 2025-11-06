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

interface OntimeBlockDocument {
	_id: string;
}

const ONTIME_DATA_PATH = 'impulse/db/ontime.json';
const ONTIME_BLOCK_PATH = 'impulse/db/ontimeblocks.json';
const ONTIME_LEADERBOARD_SIZE = 100;
const ONTIME_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours, changeable as needed

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

let cachedOntime: OntimeDocument[] | null = null;
let cachedOntimeBlocks: OntimeBlockDocument[] | null = null;
let cachedOntimeTimestamp: number = 0;
let cachedOntimeBlocksTimestamp: number = 0;

async function getOntimeData(): Promise<OntimeDocument[]> {
	const now = Date.now();
	if (cachedOntime && (now - cachedOntimeTimestamp < ONTIME_CACHE_TTL_MS)) return cachedOntime;
	const data = await FS(ONTIME_DATA_PATH).readIfExists();
	if (!data) {
		cachedOntime = [];
		cachedOntimeTimestamp = now;
		return [];
	}
	try {
		const parsed = JSON.parse(data);
		if (Array.isArray(parsed)) {
			cachedOntime = parsed;
			cachedOntimeTimestamp = now;
			return parsed;
		}
		return [];
	} catch {
		return [];
	}
}

function setOntimeData(ontime: OntimeDocument[]): void {
	cachedOntime = ontime;
	cachedOntimeTimestamp = Date.now();
}

async function writeOntimeUpdate(): Promise<void> {
	await FS(ONTIME_DATA_PATH).writeUpdate(() => JSON.stringify(cachedOntime || [], null, 2));
}

async function getOntimeBlockData(): Promise<OntimeBlockDocument[]> {
	const now = Date.now();
	if (cachedOntimeBlocks && (now - cachedOntimeBlocksTimestamp < ONTIME_CACHE_TTL_MS)) return cachedOntimeBlocks;
	const data = await FS(ONTIME_BLOCK_PATH).readIfExists();
	if (!data) {
		cachedOntimeBlocks = [];
		cachedOntimeBlocksTimestamp = now;
		return [];
	}
	try {
		const parsed = JSON.parse(data);
		if (Array.isArray(parsed)) {
			cachedOntimeBlocks = parsed;
			cachedOntimeBlocksTimestamp = now;
			return parsed;
		}
		return [];
	} catch {
		return [];
	}
}

function setOntimeBlockData(blocks: OntimeBlockDocument[]): void {
	cachedOntimeBlocks = blocks;
	cachedOntimeBlocksTimestamp = Date.now();
}

async function writeOntimeBlockUpdate(): Promise<void> {
	await FS(ONTIME_BLOCK_PATH).writeUpdate(() => JSON.stringify(cachedOntimeBlocks || [], null, 2));
}

async function isBlockedOntime(userid: string): Promise<boolean> {
	const blocks = await getOntimeBlockData();
	return !!blocks.find(b => b._id === userid);
}

async function getBlockedOntimeUsers(): Promise<string[]> {
	const docs = await getOntimeBlockData();
	return docs.map(d => d._id);
}

function clearOntimeCache(): void {
	cachedOntime = null;
	cachedOntimeTimestamp = 0;
}

async function loadOntimeCache(): Promise<void> {
	const now = Date.now();
	const data = await FS(ONTIME_DATA_PATH).readIfExists();
	if (!data) {
		cachedOntime = [];
		cachedOntimeTimestamp = now;
		return;
	}
	try {
		const parsed = JSON.parse(data);
		if (Array.isArray(parsed)) {
			cachedOntime = parsed;
			cachedOntimeTimestamp = now;
		} else {
			cachedOntime = [];
			cachedOntimeTimestamp = now;
		}
	} catch {
		cachedOntime = [];
		cachedOntimeTimestamp = now;
	}
}

function getOntimeCacheStats(): { loaded: boolean, count: number, lastUpdate: number } {
	return {
		loaded: !!cachedOntime,
		count: Array.isArray(cachedOntime) ? cachedOntime.length : 0,
		lastUpdate: cachedOntimeTimestamp,
	};
}

export const handlers: Chat.Handlers = {
	onDisconnect(user: User): void {
		const isLastConnection = user.connections.length === 0;
		if (user.named && isLastConnection && !user.isPublicBot) {
			void (async () => {
				if (await isBlockedOntime(user.id)) return;
				const sessionTime = user.lastDisconnected - user.lastConnected;
				if (sessionTime > 0) {
					const arr = await getOntimeData();
					const idx = arr.findIndex(d => d._id === user.id);
					if (idx >= 0) {
						arr[idx].ontime += sessionTime;
					} else {
						arr.push({ _id: user.id, ontime: sessionTime });
					}
					setOntimeData(arr);
					await writeOntimeUpdate();
				}
			})();
		}
	},
};

export const commands: Chat.ChatCommands = {
	ontime: {
		'': 'check',
		async check(target, room, user) {
			if (!this.runBroadcast()) return;

			const targetId = toID(target) || user.id;
			const targetUser = Users.get(targetId);

			if (targetUser?.isPublicBot) {
				return this.sendReplyBox(`${nameColor(targetId, true)} is a bot and does not track ontime.`);
			}

			if (await isBlockedOntime(targetId)) {
				return this.sendReplyBox(`${nameColor(targetId, true)} is blocked from gaining ontime.`);
			}

			const arr = await getOntimeData();
			const doc = arr.find(d => d._id === targetId);
			const totalOntime = doc?.ontime || 0;

			if (!totalOntime && !targetUser?.connected) {
				return this.sendReplyBox(`${nameColor(targetId, true)} has never been online.`);
			}

			const currentOntime = targetUser?.connected && targetUser.lastConnected ? Date.now() - targetUser.lastConnected : 0;

			const buf = `${nameColor(targetId, true)}'s total ontime is <strong>${displayTime(convertTime(totalOntime + currentOntime))}</strong>. ${targetUser?.connected ? `Current session: <strong>${displayTime(convertTime(currentOntime))}</strong>.` : ''}`;
			this.sendReplyBox(buf);
		},

		async ladder(target, room, user) {
			if (!this.runBroadcast()) return;

			const blockedUsers = await getBlockedOntimeUsers();
			const blockedSet = new Set(blockedUsers);

			const arr = await getOntimeData();
			const ontimeMap = new Map(arr.map(d => [d._id, d.ontime]));

			for (const u of Users.users.values()) {
				if (u.connected && u.named && !ontimeMap.has(u.id) && !u.isPublicBot && !blockedSet.has(u.id)) {
					ontimeMap.set(u.id, 0);
				}
			}

			const ladderData = [...ontimeMap.entries()]
				.filter(([userid]) => !blockedSet.has(userid))
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
			this.sendReply(`|raw|${tableHTML}`);
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/ontime [user]", desc: "Check user's online time." },
				{ cmd: "/ontime ladder", desc: "Top 100 by ontime." },
				{ cmd: "/ontime block [user]", desc: "Block user from gaining ontime. Requires: &." },
				{ cmd: "/ontime unblock [user]", desc: "Unblock user from gaining ontime. Requires: &." },
				{ cmd: "/ontime blocked", desc: "List blocked users. Requires: &." },
				{ cmd: "/ontime clearcache", desc: "Clear the cached ontime data. Requires: &." },
				{ cmd: "/ontime loadcache", desc: "Reload ontime cache from disk. Requires: &." },
				{ cmd: "/ontime cachestats", desc: "Show cache stats for ontime data. Requires: &." },
			];
			const html = `<center><strong>Ontime Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},

		async block(target, room, user) {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return this.errorReply("Please specify a user to block.");
			if (await isBlockedOntime(targetId)) {
				return this.errorReply(`${nameColor(targetId, true)} is already blocked from gaining ontime.`);
			}
			const arr = await getOntimeBlockData();
			arr.push({ _id: targetId });
			setOntimeBlockData(arr);
			await writeOntimeBlockUpdate();
			this.sendReplyBox(`${nameColor(targetId, true)} has been blocked from gaining ontime and will not appear on the ladder.`);
		},

		async unblock(target, room, user) {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return this.errorReply("Please specify a user to unblock.");
			if (!(await isBlockedOntime(targetId))) {
				return this.errorReply(`${nameColor(targetId, true)} is not blocked from gaining ontime.`);
			}
			const arr = await getOntimeBlockData();
			const idx = arr.findIndex(d => d._id === targetId);
			if (idx >= 0) {
				arr.splice(idx, 1);
			}
			setOntimeBlockData(arr);
			await writeOntimeBlockUpdate();
			this.sendReplyBox(`${nameColor(targetId, true)} has been unblocked and can now gain ontime and appear on the ladder.`);
		},

		async blocked(target, room, user) {
			this.checkCan('roomowner');
			const blockedUsers = await getBlockedOntimeUsers();
			if (!blockedUsers.length) return this.sendReplyBox("No users are currently blocked from gaining ontime.");
			const rows = blockedUsers.map(userid => [nameColor(userid, true)]);
			const tableHTML = generateThemedTable('Blocked Ontime Users', ['User'], rows);
			this.sendReply(`|html|${tableHTML}`);
		},

		async clearcache(target, room, user) {
			this.checkCan('roomowner');
			clearOntimeCache();
			this.sendReplyBox("Ontime cache cleared.");
		},
		async loadcache(target, room, user) {
			this.checkCan('roomowner');
			await loadOntimeCache();
			this.sendReplyBox("Ontime cache loaded from disk.");
		},
		cachestats(target, room, user) {
			this.checkCan('roomowner');
			const stats = getOntimeCacheStats();
			const html = `<strong>Ontime Cache Stats:</strong><br>Loaded: <b>${stats.loaded}</b><br>Records: <b>${stats.count}</b><br>Last update: <b>${stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleString() : 'Never'}</b>`;
			this.sendReplyBox(html);
		},
	},

	ontimehelp(): void { this.parse('/ontime help'); },
};
