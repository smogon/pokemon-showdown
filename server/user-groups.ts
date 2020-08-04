import {FS} from '../lib/fs';

export type GroupSymbol = '~' | '&' | '#' | '★' | '*' | '@' | '%' | '☆' | '+' | ' ' | '‽' | '!';
export type EffectiveGroupSymbol = GroupSymbol | 'whitelist';

export const PLAYER_SYMBOL: GroupSymbol = '\u2606';
export const HOST_SYMBOL: GroupSymbol = '\u2605';

export const ROOM_PERMISSIONS = [
	'addhtml', 'announce', 'ban', 'bypassafktimer', 'declare', 'editprivacy', 'editroom', 'exportinputlog', 'game', 'gamemanagement', 'gamemoderation', 'joinbattle', 'kick', 'minigame', 'modchat', 'modlog', 'mute', 'nooverride', 'receiveauthmessages', 'roombot', 'roomdriver', 'roommod', 'roomowner', 'roomvoice', 'show', 'showmedia', 'timer', 'tournaments', 'warn',
] as const;

export const GLOBAL_PERMISSIONS = [
	// administrative
	'bypassall', 'console', 'disableladder', 'lockdown', 'potd', 'rawpacket',
	// other
	'addhtml', 'alts', 'altsself', 'autotimer', 'globalban', 'bypassblocks', 'bypassafktimer', 'forcepromote', 'forcerename', 'forcewin', 'gdeclare', 'ignorelimits', 'importinputlog', 'ip', 'ipself', 'lock', 'makeroom', 'modlog', 'rangeban', 'promote',
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
	 * @param isVisual: Whether or not to display the user's visual (display) group. Defaults to false
	 */
	get(user: ID | User, isVisual?: boolean) {
		if (typeof user !== 'string') return (isVisual ? (user as User).visualGroup : (user as User).group);
		return (isVisual ? Users.get(user)?.visualGroup : super.get(user)) || Auth.defaultSymbol();
	}
	isStaff(userid: ID) {
		return this.has(userid) && this.get(userid) !== '+';
	}
	atLeast(user: User, group: GroupSymbol, isPermissionCheck?: boolean) {
		if (!Config.groups[group]) return false;
		if (user.locked || user.semilocked) return false;
		if (this.get(user.id) === ' ' && group !== ' ') return false;
		if (Auth.atLeast(this.get(user.id, true), group)) {
			return true;
		} else if (Auth.atLeast(this.get(user.id, false), group)) {
			// Reset a user's visualGroup if they need their true group for a permissions check
			if (isPermissionCheck) user.resetVisualGroup();
			return true;
		}
	}

	static defaultSymbol() {
		return Config.groupsranking[0] as GroupSymbol;
	}
	static getGroup(symbol: EffectiveGroupSymbol): GroupInfo;
	static getGroup<T>(symbol: EffectiveGroupSymbol, fallback: T): GroupInfo | T;
	static getGroup(symbol: EffectiveGroupSymbol, fallback?: AnyObject) {
		if (Config.groups[symbol]) return Config.groups[symbol];

		if (fallback !== undefined) return fallback;

		// unidentified groups are treated as voice
		return Object.assign({}, Config.groups['+'] || {}, {
			symbol,
			id: 'voice',
			name: symbol,
		});
	}
	getEffectiveSymbol(user: User, isVisual?: boolean): EffectiveGroupSymbol {
		const group = this.get(user, isVisual);
		if (this.has(user.id) && group === Auth.defaultSymbol()) {
			return 'whitelist';
		}
		return group;
	}
	static hasPermission(
		user: User,
		permission: string,
		target: User | EffectiveGroupSymbol | null,
		room?: Room | BasicRoom | null,
		cmd?: string,
		useVisualGroup?: boolean
	): boolean {
		if (user.hasSysopAccess()) return true;

		const auth: Auth = room ? room.auth : Users.globalAuth;

		const symbol = auth.getEffectiveSymbol(user, useVisualGroup);
		let targetSymbol = (typeof target === 'string' || !target) ? target : auth.get(target);
		if (targetSymbol === 'whitelist') targetSymbol = Auth.defaultSymbol();

		const group = Auth.getGroup(symbol);
		if (group['root']) return true;

		let jurisdiction = group[permission as GlobalPermission | RoomPermission];
		if (jurisdiction === true && permission !== 'jurisdiction') {
			jurisdiction = group['jurisdiction'] || true;
		}
		const roomPermissions = room ? room.settings.permissions : null;
		if (roomPermissions) {
			if (cmd && roomPermissions[`/${cmd}`]) {
				if (!auth.atLeast(user, roomPermissions[`/${cmd}`])) return false;
				jurisdiction = 'su';
			} else if (roomPermissions[permission]) {
				if (!auth.atLeast(user, roomPermissions[permission])) return false;
				jurisdiction = 'su';
			}
		}

		return Auth.hasJurisdiction(symbol, jurisdiction, targetSymbol);
	}
	static atLeast(symbol: EffectiveGroupSymbol, symbol2: EffectiveGroupSymbol) {
		return Auth.getGroup(symbol).rank >= Auth.getGroup(symbol2).rank;
	}
	static supportedRoomPermissions(room: Room | null = null) {
		const permissions: string[] = ROOM_PERMISSIONS.slice();
		for (const cmd in Chat.commands) {
			const entry = Chat.commands[cmd];
			if (typeof entry === 'string' || Array.isArray(entry)) continue;
			if (typeof entry === 'function' && entry.hasRoomPermissions) {
				permissions.push(`/${cmd}`);
			}
			if (typeof entry === 'object') {
				for (const subCommand in entry) {
					const subEntry = (entry as Chat.AnnotatedChatCommands)[subCommand];
					if (typeof subEntry !== 'function') continue;
					if (subEntry.hasRoomPermissions) permissions.push(`/${cmd} ${subCommand}`);
				}
				continue;
			}
		}
		return permissions;
	}
	static hasJurisdiction(
		symbol: EffectiveGroupSymbol,
		jurisdiction?: string | boolean,
		targetSymbol?: GroupSymbol | null
	) {
		if (!targetSymbol) {
			return !!jurisdiction;
		}
		if (typeof jurisdiction !== 'string') {
			return !!jurisdiction;
		}
		if (jurisdiction.includes(targetSymbol)) {
			return true;
		}
		if (jurisdiction.includes('a')) {
			return true;
		}
		if (jurisdiction.includes('u') && Auth.getGroup(symbol).rank > Auth.getGroup(targetSymbol).rank) {
			return true;
		}
		return false;
	}
	static listJurisdiction(user: User, permission: GlobalPermission | RoomPermission) {
		const symbols = Object.keys(Config.groups) as GroupSymbol[];
		return symbols.filter(targetSymbol => Auth.hasPermission(user, permission, targetSymbol));
	}
	static isValidSymbol(symbol: string): symbol is GroupSymbol {
		if (symbol.length !== 1) return false;
		return !/[A-Za-z0-9|,]/.test(symbol);
	}
	static ROOM_PERMISSIONS = ROOM_PERMISSIONS;
	static GLOBAL_PERMISSIONS = GLOBAL_PERMISSIONS;
}

export class RoomAuth extends Auth {
	room: BasicRoom;
	constructor(room: BasicRoom) {
		super();
		this.room = room;
	}
	get(user: ID | User, isVisual?: boolean): GroupSymbol {
		const parentAuth: Auth | null = this.room.parent ? this.room.parent.auth :
			this.room.settings.isPrivate !== true ? Users.globalAuth : null;
		const parentGroup = parentAuth ? parentAuth.get(user, isVisual) : Auth.defaultSymbol();
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
	getEffectiveSymbol(user: User, isVisual?: boolean) {
		const symbol = super.getEffectiveSymbol(user, isVisual);
		if (!this.room.persist && symbol === user.group) {
			const replaceGroup = Auth.getGroup(symbol).globalGroupInPersonalRoom;
			if (replaceGroup) return replaceGroup;
		}
		return symbol;
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
		if (symbol === 'whitelist' as GroupSymbol) {
			symbol = Auth.defaultSymbol();
		}
		super.set(id, symbol);
		this.room.settings.auth[id] = symbol;
		this.room.saveSettings();

		const user = Users.get(id);
		if (user) this.room.onUpdateIdentity(user);
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
			const isHidingGroup = user.group !== user.visualGroup;
			user.group = group;
			if (!isHidingGroup) user.setVisualGroup(group);
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
			user.visualGroup = ' ';
		}
		this.usernames.delete(id);
		this.save();
		return true;
	}
}
