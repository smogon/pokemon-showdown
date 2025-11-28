/*
* Pokemon Showdown - Impulse Server
* Seen & Clearall chat-plugin.
*/
import { FS } from '../../../lib';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const DATA_FILE = 'impulse/db/seen.json';

interface SeenData {
	[userid: string]: number;
}

let seenData: SeenData = {};

const saveData = (): void => {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(seenData), { throttle: 5000 });
};

const loadData = async (): Promise<void> => {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) {
			seenData = JSON.parse(raw);
		}
	} catch (e) {
		console.error('Failed to load seen data:', e);
		seenData = {};
	}
};

void loadData();

const trackSeen = (userid: string): void => {
	seenData[userid] = Date.now();
	saveData();
};

const getLastSeen = (userid: string): number | null => {
	return seenData[userid] || null;
};

const getRecentUsers = (limit = 50): { userid: string, date: number }[] => {
	return Object.entries(seenData)
		.map(([userid, date]) => ({ userid, date }))
		.sort((a, b) => b.date - a.date)
		.slice(0, limit);
};

const cleanupOldSeen = (daysOld = 365): number => {
	const cutoff = Date.now() - daysOld * 24 * 60 * 60 * 1000;
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
	userIds.forEach(userId => {
		const u = Users.get(userId);
		u?.connections?.forEach(conn => u.joinRoom(room, conn));
	});
};

const leaveUsersFromRoom = (room: Room, userIds: ID[]): void => {
	userIds.forEach(userId => {
		const u = Users.get(userId);
		u?.connections?.forEach(conn => u.leaveRoom(room, conn));
	});
};

const clearRooms = (rooms: Room[], user: User): { cleared: string[], failed: string[] } => {
	const cleared: string[] = [];
	const failed: string[] = [];
	for (const room of rooms) {
		if (!room) continue;
		if (room.game && room.game.gameid === 'tournament') {
			failed.push(room.id);
			continue;
		}
		if (room.log.log) room.log.log.length = 0;

		const userIds = Object.keys(room.users) as ID[];
		leaveUsersFromRoom(room, userIds);

		cleared.push(room.id);
		setTimeout(() => {
			rejoinUsersToRoom(room, userIds);
		}, 1000);
	}
	return { cleared, failed };
};

const formatSeenStatus = (targetName: string, status: 'online' | 'never' | 'ago', duration?: string): string => {
	const userNameColor = nameColor(targetName, true, true);
	if (status === 'online') {
		return `${userNameColor} is <b><font color='limegreen'>Online</font></b>.`;
	}
	if (status === 'never') {
		return `${userNameColor} has <b><font color='red'>never been online</font></b>.`;
	}
	return `${userNameColor} was last seen <b>${duration}</b> ago.`;
};

const generateHelpHTML = (title: string, helpList: { cmd: string, desc: string }[]): string => {
	return `<center><strong>${title}:</strong></center>` +
		`<hr><ul style="list-style-type:none;padding-left:0;">` +
		helpList.map(({ cmd, desc }, i) =>
			`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
		).join('') +
		`</ul>`;
};

export { trackSeen };

export const handlers: Chat.Handlers = {
	onDisconnect(user: User): void {
		if (user.named && user.connections.length === 0) trackSeen(user.id);
	},
};

export const commands: Chat.ChatCommands = {
	seen: {
		async ''(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			if (!target) return this.parse('/seen help');

			const targetUser = Users.get(target);
			if (targetUser?.connected) {
				return this.sendReplyBox(formatSeenStatus(targetUser.name, 'online'));
			}

			const lastSeen = getLastSeen(toID(target));
			if (!lastSeen) {
				return this.sendReplyBox(formatSeenStatus(target, 'never'));
			}

			const duration = Chat.toDurationString(
				Date.now() - lastSeen,
				{ precision: true }
			);
			this.sendReplyBox(formatSeenStatus(target, 'ago', duration));
		},

		recent(target, room, user): void {
			this.checkCan('roomowner');
			if (!this.runBroadcast()) return;

			const limit = Math.min(parseInt(target) || 25, 100);

			const recent = getRecentUsers(limit);
			if (!recent.length) return this.sendReply('No seen data.');

			const rows = recent.map((doc, i) => [
				`${i + 1}`,
				nameColor(doc.userid, true),
				Chat.toDurationString(Date.now() - doc.date),
			]);

			const tableHTML = generateThemedTable(
				`Recently Seen (${recent.length})`,
				['#', 'User', 'Last Seen'],
				rows,
			);

			this.sendReply(`|raw|${tableHTML}`);
		},

		cleanup(target, room, user): void {
			this.checkCan('roomowner');
			if (!this.runBroadcast()) return;

			const days = parseInt(target) || 365;
			if (days < 30) throw new Chat.ErrorMessage('Minimum: 30 days.');

			const deleted = cleanupOldSeen(days);
			this.sendReply(`Deleted ${deleted} records older than ${days} days.`);
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{
					cmd: "/seen [user]",
					desc: "Shows the last connection time for a user.",
				},
				{
					cmd: "/seen recent [limit]",
					desc: "Shows recently seen users (staff only). Default limit: 25, max: 100.",
				},
				{
					cmd: "/seen cleanup [days]",
					desc: "Deletes records older than X days (staff only, min: 30).",
				},
			];
			this.sendReplyBox(generateHelpHTML('Seen Commands', helpList));
		},
	},

	seenhelp(): void { this.parse('/seen help'); },

	clearall: {
		''(target, room, user): void {
			if (room?.battle) return this.sendReply("Cannot clearall in battle rooms.");
			if (!room) throw new Chat.ErrorMessage("Requires a room.");

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
					`Cannot clear the following rooms because a tournament is running: ` +
					`${failed.join(', ')}`
				);
			}
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{
					cmd: "/clearall",
					desc: "Clear the current room chat. Requires: #.",
				},
				{
					cmd: "/clearall global",
					desc: "Clear all public rooms. Requires: &. <b>Alias: /globalclearall</b>",
				},
			];
			this.sendReplyBox(generateHelpHTML('Clearall Commands', helpList));
		},
	},

	globalclearall(): void { this.parse('/clearall global'); },
	clearallhelp(): void { this.parse('/clearall help'); },
	recentseen(): void { this.parse('/seen recent'); },
	cleanupseen(): void { this.parse('/seen cleanup'); },
};
