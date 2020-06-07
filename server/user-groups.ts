import {FS} from '../lib/fs';
type GroupInfo = import('./config-loader').GroupInfo;

export const PLAYER_SYMBOL: GroupSymbol = '\u2606';
export const HOST_SYMBOL: GroupSymbol = '\u2605';

/**
 * Auth table - a Map for which users are in which groups.
 *
 * Notice that auth.get will return the default group symbol if the
 * user isn't in a group.
 */
export abstract class Auth extends Map<ID, GroupSymbol | ''> {
	/** will return the default group symbol if the user isn't in a group */
	get(id: ID) {
		return super.get(id) || Auth.defaultSymbol();
	}
	isStaff(userid: ID) {
		return this.has(userid) && this.get(userid) !== '+';
	}
	atLeast(user: User, group: GroupSymbol) {
		if (!Config.groups[group]) return false;
		if (user.locked || user.semilocked) return false;
		if (!this.has(user.id)) return false;
		return Auth.getGroup(this.get(user.id)).rank >= Auth.getGroup(group).rank;
	}

	static defaultSymbol() {
		return Config.groupsranking[0];
	}
	static getGroup(symbol: GroupSymbol): GroupInfo;
	static getGroup<T>(symbol: GroupSymbol, fallback: T): GroupInfo | T;
	static getGroup(symbol: GroupSymbol, fallback?: AnyObject) {
		if (Config.groups[symbol]) return Config.groups[symbol];

		if (fallback !== undefined) return fallback;

		// unidentified groups are treated as voice
		return Object.assign({}, Config.groups['+'] || {}, {
			symbol,
			id: 'voice',
			name: symbol,
		});
	}
}

export class RoomAuth extends Auth {
	room: BasicRoom;
	constructor(room: BasicRoom) {
		super();
		this.room = room;
	}
	get(id: ID): GroupSymbol {
		const parentAuth: Auth | null = this.room.parent ? this.room.parent.auth :
			this.room.settings.isPrivate !== true ? null : Users.globalAuth;
		const parentGroup = parentAuth ? parentAuth.get(id) : Auth.defaultSymbol();

		if (this.has(id)) {
			// authority is whichever is higher between roomauth and global auth
			const roomGroup = this.getDirect(id);
			let group = Config.greatergroupscache[`${roomGroup}${parentGroup}`];
			if (!group) {
				// unrecognized groups always trump higher global rank
				const roomRank = Auth.getGroup(roomGroup, {rank: Infinity}).rank;
				const globalRank = Auth.getGroup(parentGroup).rank;
				if (roomGroup === Users.PLAYER_SYMBOL || roomGroup === Users.HOST_SYMBOL || roomGroup === '#') {
					// Player, Host, and Room Owner always trump higher global rank
					group = roomGroup;
				} else {
					group = (roomRank > globalRank ? roomGroup : parentGroup);
				}
				Config.greatergroupscache[`${roomGroup}${parentGroup}`] = group;
			}
			return group;
		}

		return parentGroup;
	}
	/** gets the room group without inheriting */
	getDirect(id: ID): GroupSymbol {
		return super.get(id);
	}
	save() {
		// construct auth object
		const auth = Object.create(null);
		for (const [userid, groupSymbol] of this) {
			auth[userid] = groupSymbol;
		}
		(this.room.settings as any).auth = auth;
		this.room.saveSettings();
	}
	load() {
		for (const userid in this.room.settings.auth) {
			super.set(userid as ID, this.room.settings.auth[userid]);
		}
	}
	set(id: ID, group: GroupSymbol) {
		const user = Users.get(id);
		if (user) {
			this.room.onUpdateIdentity(user);
		}
		super.set(id, group);
		this.room.settings.auth[id] = group;
		this.room.saveSettings();
		return this;
	}
	delete(id: ID) {
		if (!this.has(id)) return false;
		super.delete(id);
		delete this.room.settings.auth[id];
		this.room.saveSettings();
		return true;
	}
}

export class GlobalAuth extends Auth {
	usernames = new Map<ID, string>();
	constructor() {
		super();
		this.load();
	}
	save() {
		FS('config/usergroups.csv').writeUpdate(() => {
			let buffer = '';
			for (const [userid, groupSymbol] of this) {
				buffer += `${this.usernames.get(userid) || userid},${groupSymbol}\n`;
			}
			return buffer;
		});
	}
	load() {
		const data = FS('config/usergroups.csv').readIfExistsSync();
		for (const row of data.split("\n")) {
			if (!row) continue;
			const [name, symbol] = row.split(",");
			const id = toID(name);
			this.usernames.set(id, name);
			super.set(id, symbol.charAt(0) as GroupSymbol);
		}
	}
	set(id: ID, group: GroupSymbol, username?: string) {
		if (!username) username = id;
		const user = Users.get(id);
		if (user) {
			user.group = group;
			user.updateIdentity();
			username = user.name;
		}
		this.usernames.set(id, username);
		super.set(id, group);
		void this.save();
		return this;
	}
	delete(id: ID) {
		if (!super.has(id)) return false;
		super.delete(id);
		const user = Users.get(id);
		if (user) {
			user.group = ' ';
		}
		this.usernames.delete(id);
		this.save();
		return true;
	}
}
