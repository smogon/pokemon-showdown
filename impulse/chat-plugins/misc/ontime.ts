/*
 * Pokemon Showdown - Impulse Server
 * Ontime Plugin.
 * @author PrinceSky-Git
 */
import { FS } from '../../../lib';
import { Table } from '../../utils';
import { toID } from '../../../sim/dex';

const DATA_FILE = 'impulse/db/ontime.json' as const;
const ONTIME_LEADERBOARD_SIZE = 100 as const;
const MAX_USERID_LENGTH = 18 as const;

interface OntimeData {
	readonly ontime: Record<string, number>;
	readonly blocks: Record<string, boolean>;
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
			const json = JSON.parse(raw) as Partial<OntimeData>;
			data = {
				ontime: json.ontime ?? {},
				blocks: json.blocks ?? {},
			};
		}
	} catch (e) {
		console.error('Failed to load ontime data:', e);
		data = { ontime: {}, blocks: {} };
	}
};

void loadData().catch(e => console.error('Ontime loadData uncaught:', e));

const convertTime = (ms: number): { h: number; m: number; s: number } => {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const s = totalSeconds % 60;
	const m = Math.floor(totalSeconds / 60) % 60;
	const h = Math.floor(totalSeconds / 3600);
	return { h, m, s };
};

const displayTime = (t: { h: number; m: number; s: number }): string => {
	const parts: string[] = [];
	if (t.h > 0) parts.push(`${t.h.toLocaleString()} ${t.h === 1 ? 'hour' : 'hours'}`);
	if (t.m > 0) parts.push(`${t.m.toLocaleString()} ${t.m === 1 ? 'minute' : 'minutes'}`);
	if (t.s > 0) parts.push(`${t.s.toLocaleString()} ${t.s === 1 ? 'second' : 'seconds'}`);
	return parts.length ? parts.join(', ') : '0 seconds';
};

const isBlockedOntime = (userid: string): boolean => !!data.blocks[userid];

export const getCurrentSessionTime = (user: User | undefined): number => {
	if (!user?.connected || !user.lastConnected) return 0;
	return Math.max(0, Date.now() - user.lastConnected);
};

export const getTotalOntime = (userid: string): number => data.ontime[userid] ?? 0;

const updateOntime = (userid: string, sessionTime: number): void => {
	if (sessionTime <= 0) return;
	(data.ontime as Record<string, number>)[userid] = (data.ontime[userid] ?? 0) + sessionTime;
	saveData();
};

const blockUser = (userid: string): void => {
	(data.blocks as Record<string, boolean>)[userid] = true;
	saveData();
};

const unblockUser = (userid: string): void => {
	delete (data.blocks as Record<string, boolean>)[userid];
	saveData();
};

const formatOntimeDisplay = (
	userid: string,
	totalTime: number,
	currentSession: number,
): string => {
	const displayTotal = displayTime(convertTime(totalTime + currentSession));
	const sessionPart = currentSession > 0
		? ` Current session: <strong>${displayTime(convertTime(currentSession))}</strong>.`
		: '';
	return `${Impulse.nameColor(userid, true)}'s total ontime is <strong>${displayTotal}</strong>.${sessionPart}`;
};

export const handlers: Chat.Handlers = {
	onDisconnect(user: User): void {
		if (!user.named || user.connections.length > 0 || user.isPublicBot) return;
		if (isBlockedOntime(user.id)) return;

		const sessionTime = getCurrentSessionTime(user);
		if (sessionTime > 0) {
			updateOntime(user.id, sessionTime);
		}
	},
};

export const commands: Chat.ChatCommands = {
	ontime: {
		'': 'check',

		check(target, room, user): void {
			if (!this.runBroadcast()) return;

			const targetId = toID(target) || user.id;

			if (targetId.length > MAX_USERID_LENGTH) {
				throw new Chat.ErrorMessage("Invalid username.");
			}

			const targetUser = Users.get(targetId);

			if (targetUser?.isPublicBot) {
				return this.sendReplyBox(`${Impulse.nameColor(targetId, true)} is a bot and does not track ontime.`);
			}

			if (isBlockedOntime(targetId)) {
				return this.sendReplyBox(`${Impulse.nameColor(targetId, true)} is blocked from gaining ontime.`);
			}

			const totalOntime = getTotalOntime(targetId);
			const currentOntime = getCurrentSessionTime(targetUser);

			if (!totalOntime && !currentOntime) {
				return this.sendReplyBox(`${Impulse.nameColor(targetId, true)} has never been online.`);
			}

			this.sendReplyBox(formatOntimeDisplay(targetId, totalOntime, currentOntime));
		},

		ladder(target, room, user): void {
			if (!this.runBroadcast()) return;

			const ontimeSnapshot: Record<string, number> = { ...data.ontime };

			// include currently connected users who may not yet have a saved record
			for (const u of Users.users.values()) {
				if (u.connected && u.named && !u.isPublicBot && !isBlockedOntime(u.id)) {
					ontimeSnapshot[u.id] ??= 0;
				}
			}

			const ladderData = Object.entries(ontimeSnapshot)
				.filter(([userid]) => !isBlockedOntime(userid))
				.map(([userid, savedTime]) => {
					const currentSession = getCurrentSessionTime(Users.get(userid));
					return { name: userid, time: savedTime + currentSession };
				})
				.sort((a, b) => b.time - a.time)
				.slice(0, ONTIME_LEADERBOARD_SIZE);

			if (!ladderData.length) return this.sendReplyBox("Leaderboard is currently empty.");

			const rows = ladderData.map((entry, i) => [
				(i + 1).toString(),
				Impulse.nameColor(entry.name, true),
				displayTime(convertTime(entry.time)),
			]);

			const tableHTML = Table('Ontime Leaderboard', ['Rank', 'User', 'Time'], rows);
			this.sendReply(`|raw|${tableHTML}`);
		},

		block(target, room, user): void {
			this.checkCan('roomowner');

			const targetId = toID(target);
			if (!targetId) throw new Chat.ErrorMessage("Please specify a user to block.");
			if (targetId.length > MAX_USERID_LENGTH) throw new Chat.ErrorMessage("Invalid username.");

			if (isBlockedOntime(targetId)) {
				throw new Chat.ErrorMessage(`${Impulse.nameColor(targetId, true)} is already blocked from gaining ontime.`);
			}

			blockUser(targetId);
			this.sendReplyBox(`${Impulse.nameColor(targetId, true)} has been blocked from gaining ontime and will not appear on the ladder.`);
		},

		unblock(target, room, user): void {
			this.checkCan('roomowner');

			const targetId = toID(target);
			if (!targetId) throw new Chat.ErrorMessage("Please specify a user to unblock.");
			if (targetId.length > MAX_USERID_LENGTH) throw new Chat.ErrorMessage("Invalid username.");

			if (!isBlockedOntime(targetId)) {
				throw new Chat.ErrorMessage(`${Impulse.nameColor(targetId, true)} is not blocked from gaining ontime.`);
			}

			unblockUser(targetId);
			this.sendReplyBox(`${Impulse.nameColor(targetId, true)} has been unblocked and can now gain ontime and appear on the ladder.`);
		},

		blocklist(target, room, user): void {
			this.checkCan('roomowner');

			const blockedUsers = Object.keys(data.blocks);
			if (!blockedUsers.length) return this.sendReplyBox("No users are currently blocked from gaining ontime.");

			const rows = blockedUsers.map(userid => [Impulse.nameColor(userid, true)]);
			const tableHTML = Table('Blocked Ontime Users', ['User'], rows);
			this.sendReply(`|raw|${tableHTML}`);
		},

		help(): void {
			if (!this.runBroadcast()) return;

			const helpList = [
				{ cmd: '/ontime [user]', desc: 'Check a user\'s total online time.' },
				{ cmd: '/ontime ladder', desc: 'View the top 100 users by ontime.' },
				{ cmd: '/ontime block [user]', desc: 'Block a user from gaining ontime. Requires: &amp;.' },
				{ cmd: '/ontime unblock [user]', desc: 'Unblock a user from gaining ontime. Requires: &amp;.' },
				{ cmd: '/ontime blocklist', desc: 'List all blocked users. Requires: &amp;.' },
			] as const;

			const items = helpList
				.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> — ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				)
				.join('');

			const html = `<center><strong>Ontime Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">${items}</ul>`;
			this.sendReplyBox(html);
		},
	},

	ontimehelp(): void {
		this.parse('/ontime help');
	},
};
