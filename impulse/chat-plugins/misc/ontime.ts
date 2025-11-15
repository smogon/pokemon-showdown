/*
* Pokemon Showdown
* Ontime Commands
*/
import { ImpulseDB } from '../../impulse-db';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

interface OntimeDocument {
	_id: string;
	ontime: number;
}

interface OntimeBlockDocument {
	_id: string;
}

const OntimeDB = ImpulseDB<OntimeDocument>('ontime');
const OntimeBlockDB = ImpulseDB<OntimeBlockDocument>('ontimeblocks');
const ONTIME_LEADERBOARD_SIZE = 100;

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

async function isBlockedOntime(userid: string): Promise<boolean> {
	return !!(await OntimeBlockDB.findOne({ _id: userid }));
}

async function getBlockedOntimeUsers(): Promise<string[]> {
	const docs = await OntimeBlockDB.find({});
	return docs.map(d => d._id);
}

function getCurrentSessionTime(user: User | undefined): number {
	return user?.connected && user.lastConnected ? Date.now() - user.lastConnected : 0;
}

async function getTotalOntime(userid: string): Promise<number> {
	const ontimeDoc = await OntimeDB.findOne({ _id: userid });
	return ontimeDoc?.ontime || 0;
}

function formatOntimeDisplay(userid: string, totalTime: number, currentSession: number, isConnected: boolean): string {
	const displayTotal = displayTime(convertTime(totalTime + currentSession));
	const sessionPart = isConnected ? ` Current session: <strong>${displayTime(convertTime(currentSession))}</strong>.` : '';
	return `${nameColor(userid, true)}'s total ontime is <strong>${displayTotal}</strong>.${sessionPart}`;
}

export const handlers: Chat.Handlers = {
	onDisconnect(user: User): void {
		const isLastConnection = user.connections.length === 0;
		if (user.named && isLastConnection && !user.isPublicBot) {
			void (async () => {
				if (await isBlockedOntime(user.id)) return;
				const sessionTime = user.lastDisconnected - user.lastConnected;
				if (sessionTime > 0) {
					void OntimeDB.updateOne({ _id: user.id }, { $inc: { ontime: sessionTime } }, { upsert: true });
				}
			})();
		}
	},
};

export const commands: Chat.ChatCommands = {
	ontime: {
		'': 'check',
		async check(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			const targetId = toID(target) || user.id;
			const targetUser = Users.get(targetId);

			if (targetUser?.isPublicBot) {
				return this.sendReplyBox(`${nameColor(targetId, true)} is a bot and does not track ontime.`);
			}

			if (await isBlockedOntime(targetId)) {
				return this.sendReplyBox(`${nameColor(targetId, true)} is blocked from gaining ontime.`);
			}

			const totalOntime = await getTotalOntime(targetId);

			if (!totalOntime && !targetUser?.connected) {
				return this.sendReplyBox(`${nameColor(targetId, true)} has never been online.`);
			}

			const currentOntime = getCurrentSessionTime(targetUser);
			const buf = formatOntimeDisplay(targetId, totalOntime, currentOntime, !!targetUser?.connected);
			this.sendReplyBox(buf);
		},

		async ladder(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			const blockedUsers = await getBlockedOntimeUsers();
			const blockedSet = new Set(blockedUsers);

			const ontimeData = await OntimeDB.find({}, { sort: { ontime: -1 }, limit: ONTIME_LEADERBOARD_SIZE * 2 });
			const ontimeMap = new Map(ontimeData.map(d => [d._id, d.ontime]));

			for (const u of Users.users.values()) {
				if (u.connected && u.named && !ontimeMap.has(u.id) && !u.isPublicBot && !blockedSet.has(u.id)) {
					ontimeMap.set(u.id, 0);
				}
			}

			const ladderData = [...ontimeMap.entries()]
				.filter(([userid]) => !blockedSet.has(userid))
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

		async block(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return this.errorReply("Please specify a user to block.");
			if (await isBlockedOntime(targetId)) {
				return this.errorReply(`${nameColor(targetId, true)} is already blocked from gaining ontime.`);
			}
			await OntimeBlockDB.updateOne({ _id: targetId }, { $set: { _id: targetId } }, { upsert: true });
			this.sendReplyBox(`${nameColor(targetId, true)} has been blocked from gaining ontime and will not appear on the ladder.`);
		},

		async unblock(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const targetId = toID(target);
			if (!targetId) return this.errorReply("Please specify a user to unblock.");
			if (!(await isBlockedOntime(targetId))) {
				return this.errorReply(`${nameColor(targetId, true)} is not blocked from gaining ontime.`);
			}
			await OntimeBlockDB.deleteOne({ _id: targetId });
			this.sendReplyBox(`${nameColor(targetId, true)} has been unblocked and can now gain ontime and appear on the ladder.`);
		},

		async blocklist(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			const blockedUsers = await getBlockedOntimeUsers();
			if (!blockedUsers.length) return this.sendReplyBox("No users are currently blocked from gaining ontime.");
			const rows = blockedUsers.map(userid => [nameColor(userid, true)]);
			const tableHTML = generateThemedTable('Blocked Ontime Users', ['User'], rows);
			this.sendReply(`|html|${tableHTML}`);
		},
	},

	ontimehelp(): void { this.parse('/ontime help'); },
};
