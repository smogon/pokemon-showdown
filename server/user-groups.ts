import { FS } from '../lib/fs';
import type { RoomSection } from './chat-commands/room-settings';
import { toID } from '../sim/dex-data';

export type GroupSymbol = '~' | '#' | '★' | '*' | '@' | '%' | '☆' | '§' | '+' | '^' | ' ' | '‽' | '!';
export type EffectiveGroupSymbol = GroupSymbol | 'whitelist';
export type AuthLevel = EffectiveGroupSymbol | 'unlocked' | 'trusted' | 'autoconfirmed';

export const PLAYER_SYMBOL: GroupSymbol = '\u2606';
export const HOST_SYMBOL: GroupSymbol = '\u2605';

export const ROOM_PERMISSIONS = [
	'addhtml', 'announce', 'ban', 'bypassafktimer', 'declare', 'editprivacy', 'editroom', 'exportinputlog', 'game', 'gamemanagement', 'gamemoderation', 'joinbattle', 'kick', 'minigame', 'modchat', 'modlog', 'mute', 'nooverride', 'receiveauthmessages', 'roombot', 'roomdriver', 'roommod', 'roomowner', 'roomvoice', 'roomprizewinner', 'show', 'showmedia', 'timer', 'tournaments', 'warn',
] as const;

export const GLOBAL_PERMISSIONS = [
	// administrative
	'bypassall', 'console', 'disableladder', 'lockdown', 'potd',
	// other
	'addhtml', 'alts', 'altsself', 'autotimer', 'globalban', 'bypassblocks', 'bypassafktimer', 'forcepromote', 'forcerename', 'forcewin', 'gdeclare', 'hiderank', 'ignorelimits', 'importinputlog', 'ip', 'ipself', 'lock', 'makeroom', 'modlog', 'rangeban', 'promote',
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
	override get(user: ID | User) {
		if (typeof user !== 'string') return user.tempGroup;
		return super.get(user) || Auth.defaultSymbol();
	}
	isStaff(userid: ID) {
		if (this.has(userid)) {
			const rank = this.get(userid);
			// At one point bots used to be ranked above drivers, so this checks
			// driver rank to make sure this function works on servers that
			// did not reorder the ranks.
			return Auth.atLeast(rank, '*') || Auth.atLeast(rank, '%');
		} else {
			return false;
		}
	}
	atLeast(user: User, group: AuthLevel) {
		if (user.hasSysopAccess()) return true;
		if (group === 'trusted' || group === 'autoconfirmed') {
			if (user.trusted && group === 'trusted') return true;
			if (user.autoconfirmed && !user.locked && group === 'autoconfirmed') return true;
			group = Config.groupsranking[1];
		}
		if (user.locked || user.semilocked) return false;
		if (group === 'unlocked') return true;
		if (group === 'whitelist' && this.has(user.id)) {
			return true;
		}
		if (!Config.groups[group]) return false;
		if (this.get(user.id) === ' ' && group !== ' ') return false;
		return Auth.atLeast(this.get(user.id), group);
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
		return {
			...(Config.groups['+'] || {}),
			symbol,
			id: 'voice',
			name: symbol,
		};
	}
	getEffectiveSymbol(user: User): EffectiveGroupSymbol {
		const group = this.get(user);
		if (this.has(user.id) && group === Auth.defaultSymbol()) {
			return 'whitelist';
		}
		return group;
	}
	static hasPermission(
		user: User,
		permission: string,
		target: User | EffectiveGroupSymbol | ID | null,
		room?: BasicRoom | null,
		cmd?: string,
		cmdToken?: string,
	): boolean {
		if (user.hasSysopAccess()) return true;

		const auth: Auth = room ? room.auth : Users.globalAuth;

		const symbol = auth.getEffectiveSymbol(user);

		let targetSymbol: EffectiveGroupSymbol | null;
		if (!target) {
			targetSymbol = null;
		} else if (typeof target === 'string' && !toID(target)) { // empty ID -> target is a group symbol
			targetSymbol = target as EffectiveGroupSymbol;
		} else {
			targetSymbol = auth.get(target as User | ID);
		}
		if (!targetSymbol || ['whitelist', 'trusted', 'autoconfirmed'].includes(targetSymbol)) {
			targetSymbol = Auth.defaultSymbol();
		}

		let group = Auth.getGroup(symbol);
		if (group['root']) return true;
		// Global drivers who are SLs should get room mod powers too
		if (
			room?.settings.section &&
			room.settings.section === Users.globalAuth.sectionLeaders.get(user.id) &&
			// But dont override ranks above moderator such as room owner
			(Auth.getGroup('@').rank > group.rank)
		) {
			group = Auth.getGroup('@');
		}

		let jurisdiction = group[permission as GlobalPermission | RoomPermission];
		if (jurisdiction === true && permission !== 'jurisdiction') {
			jurisdiction = group['jurisdiction'] || true;
		}
		const roomPermissions = room ? room.settings.permissions : null;
		if (roomPermissions) {
			let foundSpecificPermission = false;
			if (cmd) {
				if (!cmdToken) cmdToken = `/`;
				const namespace = cmd.slice(0, cmd.indexOf(' '));
				if (roomPermissions[`${cmdToken}${cmd}`]) {
					// this checks sub commands and command objects, but it checks to see if a sub-command
					// overrides (should a perm for the command object exist) first
					if (!auth.atLeast(user, roomPermissions[`${cmdToken}${cmd}`])) return false;
					jurisdiction = 'u';
					foundSpecificPermission = true;
				} else if (roomPermissions[`${cmdToken}${namespace}`]) {
					// if it's for one command object
					if (!auth.atLeast(user, roomPermissions[`${cmdToken}${namespace}`])) return false;
					jurisdiction = 'u';
					foundSpecificPermission = true;
				}
				if (foundSpecificPermission && targetSymbol === Users.Auth.defaultSymbol()) {
					// if /permissions has granted unranked users permission to use the command,
					// grant jurisdiction over unranked (since unranked users don't have jurisdiction over unranked)
					// see https://github.com/smogon/pokemon-showdown/pull/9534#issuecomment-1565719315
					(jurisdiction as string) += Users.Auth.defaultSymbol();
				}
			}
			if (!foundSpecificPermission && roomPermissions[permission]) {
				if (!auth.atLeast(user, roomPermissions[permission])) return false;
				jurisdiction = 'u';
			}
		}
		return Auth.hasJurisdiction(symbol, jurisdiction, targetSymbol as GroupSymbol);
	}
	static atLeast(symbol: EffectiveGroupSymbol, symbol2: EffectiveGroupSymbol) {
		return Auth.getGroup(symbol).rank >= Auth.getGroup(symbol2).rank;
	}
	static supportedRoomPermissions(room: Room | null = null) {
		const commands = [];
		for (const handler of Chat.allCommands()) {
			if (!handler.hasRoomPermissions && !handler.broadcastable) continue;

			// if it's only broadcast permissions, not use permissions, use the broadcast symbol
			const cmdPrefix = handler.hasRoomPermissions ? "/" : "!";
			commands.push(`${cmdPrefix}${handler.fullCmd}`);
			if (handler.aliases.length) {
				for (const alias of handler.aliases) {
					// kind of a hack but this is the only good way i could think of to
					// overwrite the alias without making assumptions about the string
					commands.push(`${cmdPrefix}${handler.fullCmd.replace(handler.cmd, alias)}`);
				}
			}
		}
		return [
			...ROOM_PERMISSIONS,
			...commands,
		];
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
	static isAuthLevel(level: string): level is AuthLevel {
		if (Config.groupsranking.includes(level as EffectiveGroupSymbol)) return true;
		return ['‽', '!', 'unlocked', 'trusted', 'autoconfirmed', 'whitelist'].includes(level);
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
	override get(userOrID: ID | User): GroupSymbol {
		const id = typeof userOrID === 'string' ? userOrID : userOrID.id;

		const parentAuth: Auth | null = this.room.parent ? this.room.parent.auth :
			this.room.settings.isPrivate !== true ? Users.globalAuth : null;
		const parentGroup = parentAuth ? parentAuth.get(userOrID) : Auth.defaultSymbol();

		if (this.has(id)) {
			// authority is whichever is higher between roomauth and global auth
			const roomGroup = this.getDirect(id);
			let group = Config.greatergroupscache[`${roomGroup}${parentGroup}`];
			if (!group) {
				// unrecognized groups always trump higher global rank
				const roomRank = Auth.getGroup(roomGroup, { rank: Infinity }).rank;
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
	override getEffectiveSymbol(user: User) {
		const symbol = super.getEffectiveSymbol(user);
		if (!this.room.persist && symbol === user.tempGroup) {
			const replaceGroup = Auth.getGroup(symbol).globalGroupInPersonalRoom;
			if (replaceGroup) return replaceGroup;
		}
		// this is a bit of a hardcode, yeah, but admins need to have admin commands in prooms w/o the symbol
		// and we want that to include sysops.
		// Plus, using user.can is cleaner than Users.globalAuth.get(user) === admin and it accounts for more things.
		// (and no this won't recurse or anything since user.can() with no room doesn't call this)
		if (this.room.settings.isPrivate === true && user.can('makeroom')) {
			// not hardcoding ~ here since globalAuth.get should return ~ in basically all cases
			// except sysops, and there's an override for them anyways so it doesn't matter
			return Users.globalAuth.get(user);
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
	override set(id: ID, symbol: GroupSymbol) {
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
	override delete(id: ID) {
		if (!this.has(id)) return false;
		super.delete(id);
		delete this.room.settings.auth[id];
		this.room.saveSettings();
		return true;
	}
}

export class GlobalAuth extends Auth {
	usernames = new Map<ID, string>();
	sectionLeaders = new Map<ID, RoomSection>();
	constructor() {
		super();
		this.load();
	}
	save() {
		FS('config/usergroups.csv').writeUpdate(() => {
			let buffer = '';
			for (const [userid, groupSymbol] of this) {
				buffer += `${this.usernames.get(userid) || userid},${groupSymbol},${this.sectionLeaders.get(userid) || ''}\n`;
			}
			return buffer;
		});
	}
	load() {
		const data = FS('config/usergroups.csv').readIfExistsSync();
		for (const row of data.split("\n")) {
			if (!row) continue;
			const [name, symbol, sectionid] = row.split(",");
			const id = toID(name);
			if (!id) {
				Monitor.warn('Dropping malformed usergroups line (missing ID):');
				Monitor.warn(row);
				continue;
			}
			this.usernames.set(id, name);
			if (sectionid) this.sectionLeaders.set(id, sectionid as RoomSection);

			// handle glitched entries where a user has two entries in usergroups.csv due to bugs
			const newSymbol = symbol.charAt(0) as GroupSymbol;
			// Yes, we HAVE to ensure that it exists in the super. super.get here returns either the group symbol,
			// or the default symbol if it cannot find a symbol in the map.
			// the default symbol is truthy, and the symbol for trusted user is ` `
			// meaning that the preexisting && atLeast would return true, which would skip the row and nuke all trusted users
			// on a fresh load (aka, a restart).
			const preexistingSymbol = super.has(id) ? super.get(id) : null;
			// take a user's highest rank in usergroups.csv
			if (preexistingSymbol && Auth.atLeast(preexistingSymbol, newSymbol)) continue;
			super.set(id, newSymbol);
		}
	}
	override set(id: ID, group: GroupSymbol, username?: string) {
		if (!username) username = id;
		const user = Users.get(id, true);
		if (user) {
			user.tempGroup = group;
			user.updateIdentity();
			username = user.name;
			Rooms.global.checkAutojoin(user);
		}
		this.usernames.set(id, username);
		super.set(id, group);
		void this.save();
		return this;
	}
	override delete(id: ID) {
		if (!super.has(id)) return false;
		super.delete(id);
		const user = Users.get(id);
		if (user) {
			user.tempGroup = ' ';
		}
		this.usernames.delete(id);
		this.save();
		return true;
	}
	setSection(id: ID, sectionid: RoomSection, username?: string) {
		if (!username) username = id;
		const user = Users.get(id);
		if (user) {
			user.updateIdentity();
			username = user.name;
			Rooms.global.checkAutojoin(user);
		}
		if (!super.has(id)) this.set(id, ' ', username);
		this.sectionLeaders.set(id, sectionid);
		void this.save();
		return this;
	}
	deleteSection(id: ID) {
		if (!this.sectionLeaders.has(id)) return false;
		this.sectionLeaders.delete(id);
		if (super.get(id) === ' ') {
			return this.delete(id);
		}
		const user = Users.get(id);
		if (user) {
			user.updateIdentity();
			Rooms.global.checkAutojoin(user);
		}
		this.save();
		return true;
	}
}
