/**
 * Minor activities
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Minor activities are representations of non-game activities that rooms
 * regularly use, such as polls and announcements. Rooms are limited to
 * one minor activity at a time.
 *
 * Minor activities keep track of users in the form of userids and IPs.
 * If a player votes for a poll under one IP, they cannot vote for the same
 * poll again.
 *
 * The user-tracking system is not implemented at the base level: Announcements
 * do not have a reason to keep track of users' IPs/IDs because they're just used
 * to broadcast a message to a room.
 *
 * @license MIT
 */

export interface MinorActivityData {
	readonly activityid: 'announcement' | 'poll';
	activityNumber?: number;
	source?: string;
	timeoutMins?: number;
	timerEnd?: number;
	question: string;
	supportHTML: boolean;
	multiPoll: boolean;
	pendingVotes?: {[userid: string]: number[]};
	voters?: {[k: string]: number[]};
	voterIps?: {[k: string]: number[]};
	totalVotes?: number;
	isQuiz?: boolean;
	answers: string[] | {name: string, votes: number, correct?: boolean}[];
}

// globally Rooms.MinorActivity
export abstract class MinorActivity {
	abstract activityid: ID;
	abstract name: string;

	timeout: NodeJS.Timer | null;
	timeoutMins: number;
	timerEnd: number;
	roomid: RoomID;
	room: Room;
	supportHTML: boolean;
	constructor(room: Room) {
		this.timeout = null;
		this.timeoutMins = 0;
		this.timerEnd = 0;
		this.roomid = room.roomid;
		this.room = room;
		this.supportHTML = false;
	}

	setTimer(options: {timeoutMins?: number, timerEnd?: number}) {
		if (this.timeout) clearTimeout(this.timeout);

		this.timeoutMins = options.timeoutMins || 0;
		if (!this.timeoutMins) {
			this.timerEnd = 0;
			this.timeout = null;
			return;
		}

		const now = Date.now();
		this.timerEnd = options.timerEnd || now + this.timeoutMins * 60000;
		this.timeout = setTimeout(() => {
			const room = this.room;
			if (!room) return; // someone forgot to `.destroy()`

			this.end(room);
		}, this.timerEnd - now);
		this.save();
	}

	end(room: Room, MinorActivityClass?: new (...args: any[]) => any) {
		room.minorActivity?.destroy();
		if (room.minorActivityQueue?.length) {
			const pollData = room.minorActivityQueue.shift()!;
			if (!room.minorActivityQueue.length) room.clearMinorActivityQueue();
			if (!room.settings.minorActivityQueue?.length) {
				delete room.settings.minorActivityQueue;
				room.saveSettings();
			}

			if (pollData.activityid !== 'poll') throw new Error(`Unexpected Minor Activity (${pollData.activityid}) in queue`);

			room.add(`|c|~|/log ${room.tr`The queued poll was started.`}`).update();
			room.modlog({
				action: 'POLL',
				note: '(queued)',
			});

			if (!MinorActivityClass) {
				if (pollData.activityid === 'poll') {
					const {Poll} = require('./chat-plugins/poll');
					room.setMinorActivity(new Poll(room, pollData));
				}
			} else {
				room.setMinorActivity(new MinorActivityClass(room, pollData));
			}
		}
	}

	endTimer() {
		if (!this.timeout) return false;
		clearTimeout(this.timeout);
		this.timeoutMins = 0;
		this.timerEnd = 0;
		return true;
	}

	abstract destroy(): void;
	abstract display(): void;
	onConnect?(user: User, connection: Connection | null): void;
	onRename?(user: User, oldid: ID, joining: boolean): void;
	abstract toJSON(): AnyObject;
	abstract save(): void;
}
