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

// globally Rooms.MinorActivity
export class MinorActivity {
	roomid: RoomID;
	room: Room;
	activityid: ID;
	name: string;
	timeout: NodeJS.Timer | null;
	timeoutMins: number;
	supportHTML: boolean;
	constructor(room: Room) {
		this.roomid = room.roomid;
		this.room = room;
		this.activityid = 'minoractivity' as ID;
		this.name = 'Minor Activity';
		this.timeout = null;
		this.timeoutMins = 0;
		this.supportHTML = false;
	}
	display?(): void {}
	end?(): void {}
	onConnect?(user: User, connection: Connection | null) {}
	onRename?(user: User, oldid: ID, joining: boolean) {}
}
