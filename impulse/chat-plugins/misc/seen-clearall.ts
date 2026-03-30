/*
* Pokemon Showdown - Impulse Server
* Seen & Clearall Plugin.
* Refactored by @PrinceSky-Git
*/
import { FS } from '../../../lib';
import { Table } from '../../utils';
import { toID } from '../../../sim/dex';

const DATA_FILE = 'impulse/db/seen.json';

interface SeenData {
	[userid: string]: number;
}

interface RecentUser {
	userid: string;
	date: number;
}

interface ClearResult {
	cleared: string[];
	failed: string[];
}

interface HelpEntry {
	cmd: string;
	desc: string;
}

let seenData: SeenData = Object.create(null) as SeenData;

let dataReady = false;

const saveData = (): void => {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(seenData), { throttle: 5000 });
};

const loadData = async (): Promise<void> => {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) {
			const parsed: unknown = JSON.parse(raw);
			// validate shape before assigning.
			if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
				const validated: SeenData = Object.create(null) as SeenData;
				for (const [key, value] of Object.entries(parsed)) {
					if (typeof value === 'number' && Number.isFinite(value)) {
						validated[key] = value;
					}
				}
				seenData = validated;
			}
		}
	} catch (e) {
		console.error('Failed to load seen data:', e);
		seenData = Object.create(null) as SeenData;
	} finally {
		dataReady = true;
	}
};

void loadData();

const assertDataReady = (): void => {
	if (!dataReady) throw new Chat.ErrorMessage('Seen data is still loading — please try again in a moment.');
};

const trackSeen = (userid: string): void => {
	seenData[userid] = Date.now();
	saveData();
};

const getLastSeen = (userid: string): number | null => {
	return seenData[userid] ?? null;
};

const getRecentUsers = (limit = 50): RecentUser[] => {
	const safeLimit = Math.max(1, Math.min(limit, 1000));
	return Object.entries(seenData)
		.map(([userid, date]): RecentUser => ({ userid, date }))
		.sort((a, b) => b.date - a.date)
		.slice(0, safeLimit);
};

const cleanupOldSeen = (daysOld = 365): number => {
	const safeDays = Math.max(30, daysOld);
	const cutoff = Date.now() - safeDays * 24 * 60 * 60 * 1000;
	let deletedCount = 0;

	for (const userid in seenData) {
		if (seenData[userid] < cutoff) {
			delete seenData[userid];
			deletedCount++;
		}
	}

	if (deletedCount > 0) saveData();
	return deletedCount;
};

const rejoinUsersToRoom = (room: Room, userIds: ID[]): void => {
	for (const userId of userIds) {
		const u = Users.get(userId);
		if (!u) continue;
		for (const conn of u.connections) {
			u.joinRoom(room, conn);
		}
	}
};

const leaveUsersFromRoom = (room: Room, userIds: ID[]): void => {
	for (const userId of userIds) {
		const u = Users.get(userId);
		if (!u) continue;
		for (const conn of u.connections) {
			u.leaveRoom(room, conn);
		}
	}
};

const clearRooms = (rooms: Room[], _user: User): ClearResult => {
	const cleared: string[] = [];
	const failed: string[] = [];

	for (const room of rooms) {
		if (!room) continue;
		if (room.game?.gameid === 'tournament') {
			failed.push(room.id);
			continue;
		}

		if (Array.isArray(room.log?.log)) {
			room.log.log.length = 0;
		}

		const userIds = Object.keys(room.users) as ID[];
		leaveUsersFromRoom(room, userIds);
		cleared.push(room.id);

		// re-join users after a short delay to allow the client to process the clear.
		setTimeout(() => {
			rejoinUsersToRoom(room, userIds);
		}, 1000);
	}

	return { cleared, failed };
};

const formatSeenStatus = (
	targetName: string,
	status: 'online' | 'never' | 'ago',
	duration?: string,
): string => {
	const userNameColor = Impulse.nameColor(targetName, true, true);

	switch (status) {
	case 'online':
		return `${userNameColor} is <b><font color='limegreen'>Online</font></b>.`;
	case 'never':
		return `${userNameColor} has <b><font color='red'>never been online</font></b>.`;
	case 'ago':
		return `${userNameColor} was last seen <b>${duration ?? 'unknown'}</b> ago.`;
	}
};

const generateHelpHTML = (title: string, helpList: HelpEntry[]): string => {
	const items = helpList
		.map(({ cmd, desc }, i) =>
			`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
		)
		.join('');

	return (
		`<center><strong>${title}:</strong></center>` +
		`<hr><ul style="list-style-type:none;padding-left:0;">${items}</ul>`
	);
};

export { trackSeen };

export const handlers: Chat.Handlers = {
	onDisconnect(user: User): void {
		if (user.named && user.connections.length === 0) {
			trackSeen(user.id);
		}
	},
};

export const commands: Chat.ChatCommands = {
	seen: {
		async ''(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			if (!target?.trim()) return this.parse('/seen help');

			assertDataReady();

			// sanitise: strip anything that isn't a valid PS username character.
			const cleanTarget = target.trim().slice(0, 18);
			const targetUser = Users.get(cleanTarget);

			if (targetUser?.connected) {
				return this.sendReplyBox(formatSeenStatus(targetUser.name, 'online'));
			}

			const lastSeen = getLastSeen(toID(cleanTarget));
			if (!lastSeen) {
				return this.sendReplyBox(formatSeenStatus(cleanTarget, 'never'));
			}

			const duration = Chat.toDurationString(Date.now() - lastSeen, { precision: true });
			this.sendReplyBox(formatSeenStatus(cleanTarget, 'ago', duration));
		},

		recent(target, room, user): void {
			this.checkCan('roomowner');
			if (!this.runBroadcast()) return;

			assertDataReady();

			const parsed = parseInt(target, 10);
			const limit = Math.min(Number.isNaN(parsed) ? 25 : parsed, 100);

			const recent = getRecentUsers(limit);
			if (!recent.length) return this.sendReply('No seen data.');

			const rows = recent.map((doc, i): string[] => [
				`${i + 1}`,
				Impulse.nameColor(doc.userid, true),
				Chat.toDurationString(Date.now() - doc.date),
			]);

			const tableHTML = Table(
				`Recently Seen (${recent.length})`,
				['#', 'User', 'Last Seen'],
				rows,
			);

			this.sendReply(`|raw|${tableHTML}`);
		},

		cleanup(target, room, user): void {
			this.checkCan('roomowner');
			if (!this.runBroadcast()) return;

			assertDataReady();

			const parsed = parseInt(target, 10);
			const days = Number.isNaN(parsed) ? 365 : parsed;

			if (days < 30) throw new Chat.ErrorMessage('Minimum: 30 days.');

			const deleted = cleanupOldSeen(days);
			this.sendReply(`Deleted ${deleted} records older than ${days} days.`);
		},

		help(): void {
			if (!this.runBroadcast()) return;

			const helpList: HelpEntry[] = [
				{ cmd: '/seen [user]', desc: 'Shows the last connection time for a user.' },
				{ cmd: '/seen recent [limit]', desc: 'Shows recently seen users (staff only). Default limit: 25, max: 100.' },
				{ cmd: '/seen cleanup [days]', desc: 'Deletes records older than X days (staff only, min: 30).' },
			];
			this.sendReplyBox(generateHelpHTML('Seen Commands', helpList));
		},
	},

	seenhelp(): void { this.parse('/seen help'); },

	clearall: {
		''(target, room, user): void {
			if (room?.battle) return this.sendReply('Cannot clearall in battle rooms.');
			if (!room) throw new Chat.ErrorMessage('Requires a room.');

			this.checkCan('roommod', null, room);

			const { failed } = clearRooms([room], user);
			if (failed.length) {
				throw new Chat.ErrorMessage(
					`Cannot clear room "${room.id}" because a tournament is running.`
				);
			}
		},

		global(target, room, user): void {
			this.checkCan('roomowner');

			const rooms = Rooms.global.chatRooms.filter((r): r is Room => !!r && !r.battle);
			const { failed } = clearRooms(rooms, user);

			if (failed.length) {
				throw new Chat.ErrorMessage(
					`Cannot clear the following rooms because a tournament is running: ${failed.join(', ')}`
				);
			}
		},

		help(): void {
			if (!this.runBroadcast()) return;

			const helpList: HelpEntry[] = [
				{ cmd: '/clearall', desc: 'Clear the current room chat. Requires: #.' },
				{ cmd: '/clearall global', desc: 'Clear all public rooms. Requires: &. <b>Alias: /globalclearall</b>' },
			];
			this.sendReplyBox(generateHelpHTML('Clearall Commands', helpList));
		},
	},

	globalclearall(): void { this.parse('/clearall global'); },
	clearallhelp(): void { this.parse('/clearall help'); },
	recentseen(): void { this.parse('/seen recent'); },
	cleanupseen(): void { this.parse('/seen cleanup'); },
};
