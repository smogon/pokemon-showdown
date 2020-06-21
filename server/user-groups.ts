import {FS} from '../lib/fs';

export const PLAYER_SYMBOL: GroupSymbol = '\u2606';
export const HOST_SYMBOL: GroupSymbol = '\u2605';

export const ROOM_PERMISSIONS = [
	'addhtml', 'announce', 'ban', 'broadcast', 'bypassafktimer', 'declare', 'editprivacy', 'editroom', 'exportinputlog', 'game', 'gamemanagement', 'gamemoderation', 'joinbattle', 'kick', 'minigame', 'modchat', 'modchatall', 'modlog', 'mute', 'nooverride', 'receiveauthmessages', 'roombot', 'roomdriver', 'roommod', 'roomowner', 'roomvoice', 'showmedia', 'timer', 'tournaments', 'warn',
] as const;

export const GLOBAL_PERMISSIONS = [
	// administrative
	'bypassall', 'console', 'disableladder', 'lockdown', 'potd', 'rawpacket',
	// other
	'addhtml', 'alts', 'autotimer', 'ban', 'bypassblocks', 'bypassafktimer', 'forcepromote', 'forcerename', 'forcewin', 'gdeclare', 'ignorelimits', 'importinputlog', 'ip', 'lock', 'makeroom', 'modlog', 'rangeban', 'promote',
] as const;

export type RoomPermission = typeof ROOM_PERMISSIONS[number];
export type GlobalPermission = typeof GLOBAL_PERMISSIONS[number];

export type GroupInfo = {
	symbol: GroupSymbol,
	id: ID,
	name: string,
	rank: number,
	inherit?: GroupSymbol,
	jurisdiction?: string,

	globalonly?: boolean,
	roomonly?: boolean,
	battleonly?: boolean,
	root?: boolean,
	globalGroupInPersonalRoom?: GroupSymbol,
} & {
	[P in RoomPermission | GlobalPermission]?: string | boolean;
};

/**
 * Auth table - a Map for which users are in which groups.
 *
 * Notice that auth.get will return the default group symbol if the
 * user isn't in a group.
 */
export abstract class Auth extends Map<ID, GroupSymbol | ''> {
	/**
	 * Will return the default group symbol if the user isn't in a group.
	 *
	 * Passing a User will read `user.group`, which is relevant for unregistered
	 * users with temporary global auth.
	 */
	get(user: ID | User) {
		if (typeof user !== 'string') return (user as User).group;
		return super.get(user) || Auth.defaultSymbol();
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
	static hasPermission(
		symbol: GroupSymbol,
		permission: GlobalPermission | RoomPermission | 'jurisdiction',
		targetSymbol?: GroupSymbol,
		targetingSelf?: boolean
	): boolean {
		const group = Auth.getGroup(symbol);
		if (group['root']) {
			return true;
		}

		if (group[permission]) {
			const jurisdiction = group[permission];
			if (!targetSymbol) {
				return !!jurisdiction;
			}
			if (jurisdiction === true && permission !== 'jurisdiction') {
				return Auth.hasPermission(symbol, 'jurisdiction', targetSymbol);
			}
			if (typeof jurisdiction !== 'string') {
				return !!jurisdiction;
			}
			if (jurisdiction.includes(targetSymbol)) {
				return true;
			}
			if (jurisdiction.includes('s') && targetingSelf) {
				return true;
			}
			if (jurisdiction.includes('u') &&
				Config.groupsranking.indexOf(symbol) > Config.groupsranking.indexOf(targetSymbol)) {
				return true;
			}
		}
		return false;
	}
	static listJurisdiction(symbol: GroupSymbol, permission: GlobalPermission | RoomPermission) {
		const symbols = Object.keys(Config.groups) as GroupSymbol[];
		return symbols.filter(targetSymbol => Auth.hasPermission(symbol, permission, targetSymbol));
	}
	static isValidSymbol(symbol: string): symbol is GroupSymbol {
		if (symbol.length !== 1) return false;
		return !/[A-Za-z0-9|,]/.test(symbol);
	}
}

export class RoomAuth extends Auth {
	room: BasicRoom;
	constructor(room: BasicRoom) {
		super();
		this.room = room;
	}
	get(user: ID | User): GroupSymbol {
		const parentAuth: Auth | null = this.room.parent ? this.room.parent.auth :
			this.room.settings.isPrivate !== true ? Users.globalAuth : null;
		const parentGroup = parentAuth ? parentAuth.get(user) : Auth.defaultSymbol();
		const id = typeof user === 'string' ? user : (user as User).id;

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
	set(id: ID, symbol: GroupSymbol) {
		const user = Users.get(id);
		if (user) {
			this.room.onUpdateIdentity(user);
		}
		if (symbol === 'whitelist' as GroupSymbol) {
			symbol = Auth.defaultSymbol();
		}
		super.set(id, symbol);
		this.room.settings.auth[id] = symbol;
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
