/*
* Pokemon Showdown
* Seen & Clearall Commands
*/

import { ImpulseDB } from '../../impulse-db';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

interface SeenDocument {
	_id: string;
	lastSeen: Date;
}

const SeenDB = ImpulseDB<SeenDocument>('seen');

const trackSeen = (userid: string): void => {
	void SeenDB.upsert({ _id: userid }, { $set: { lastSeen: new Date() } }).catch(err => {});
};

const getLastSeen = async (userid: string): Promise<Date | null> => {
	const doc = await SeenDB.findOne({ _id: userid }, { projection: { lastSeen: 1 } });
	return doc?.lastSeen || null;
};

const getRecentUsers = async (limit = 50): Promise<SeenDocument[]> => {
	return SeenDB.find(
		{},
		{ sort: { lastSeen: -1 }, limit, projection: { _id: 1, lastSeen: 1 } }
	);
};

const cleanupOldSeen = async (daysOld = 365): Promise<number> => {
	const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
	const result = await SeenDB.deleteMany({ lastSeen: { $lt: cutoff } });
	return result.deletedCount || 0;
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

const getErrorMessage = (err: unknown): string => {
	return err instanceof Error ? err.message : String(err);
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

			try {
				const lastSeen = await getLastSeen(toID(target));
				if (!lastSeen) {
					return this.sendReplyBox(formatSeenStatus(target, 'never'));
				}

				const duration = Chat.toDurationString(
					Date.now() - lastSeen.getTime(),
					{ precision: true }
				);
				this.sendReplyBox(formatSeenStatus(target, 'ago', duration));
			} catch (err: unknown) {
				const message = getErrorMessage(err);
				this.errorReply('Error retrieving seen data: ' + message);
			}
		},

		async recent(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!this.runBroadcast()) return;

			const limit = Math.min(parseInt(target) || 25, 100);

			try {
				const recent = await getRecentUsers(limit);
				if (!recent.length) return this.sendReply('No seen data.');

				const rows = recent.map((doc, i) => [
					`${i + 1}`,
					nameColor(doc._id, true),
					Chat.toDurationString(Date.now() - doc.lastSeen.getTime()),
				]);

				const tableHTML = generateThemedTable(
					`Recently Seen (${recent.length})`,
					['#', 'User', 'Last Seen'],
					rows,
				);

				this.sendReply(`|raw|${tableHTML}`);
			} catch (err: unknown) {
				const message = getErrorMessage(err);
				this.errorReply('Error: ' + message);
			}
		},

		async cleanup(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!this.runBroadcast()) return;

			const days = parseInt(target) || 365;
			if (days < 30) return this.errorReply('Minimum: 30 days.');

			try {
				const deleted = await cleanupOldSeen(days);
				this.sendReply(`Deleted ${deleted} records older than ${days} days.`);
			} catch (err: unknown) {
				const message = getErrorMessage(err);
				this.errorReply('Error: ' + message);
			}
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
			if (!room) return this.errorReply("Requires a room.");

			this.checkCan('roommod', null, room);

			const { failed } = clearRooms([room], user);
			if (failed.length) {
				return this.errorReply(
					`Cannot clear room "${room.id}" because a tournament is running.`
				);
			}
		},

		global(target, room, user): void {
			this.checkCan('roomowner');
			const rooms = Rooms.global.chatRooms.filter((r): r is Room => !!r && !r.battle);
			const { failed } = clearRooms(rooms, user);
			if (failed.length) {
				this.errorReply(
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
