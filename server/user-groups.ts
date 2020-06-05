import {FS} from '../lib/fs';

export const PLAYER_SYMBOL: GroupSymbol = '\u2606';
export const HOST_SYMBOL: GroupSymbol = '\u2605';

export abstract class Auth extends Map<ID, GroupSymbol | ''> {
	defaultSymbol() {
		return Config.groupsranking[0];
	}
	/** Defaults to '' for convenience in output */
	get(id: ID): GroupSymbol | '';
	get(id: ID, defaultSymbol: true): GroupSymbol;
	get(id: ID, defaultSymbol?: boolean) {
		let group = super.get(id);
		if (!group) group = this.defaultSymbol();
		return group === ' ' && !defaultSymbol ? '' : group;
	}
	isStaff(userid: ID) {
		return this.has(userid) && this.get(userid) !== '+';
	}
	atLeast(user: User, group: GroupSymbol) {
		if (!Config.groups[group]) return false;
		if (user.locked || user.semilocked) return false;
		const userGroup = this.get(user.id, true);
		if (!userGroup) return false;
		return userGroup in Config.groups && Config.groups[userGroup].rank >= Config.groups[group].rank;
	}
}

export class RoomAuth extends Auth {
	room: BasicRoom;
	constructor(room: BasicRoom) {
		super();
		this.room = room;
	}
	get(id: ID): GroupSymbol | '';
	get(id: ID, defaultSymbol: true): GroupSymbol;
	get(id: ID, defaultSymbol?: boolean) {
		const parentAuth: Auth = this.room.parent ? this.room.parent.auth : Users.globalAuth;
		const parentGroup = parentAuth.get(id, true);
		let group = parentGroup;

		if (this.has(id)) {
			// authority is whichever is higher between roomauth and global auth
			const roomGroup = this.getDirect(id, true);
			group = Config.greatergroupscache[`${roomGroup}${parentGroup}`];
			if (!group) {
				// unrecognized groups always trump higher global rank
				const roomRank = (Config.groups[roomGroup] || {rank: Infinity}).rank;
				const globalRank = (Config.groups[parentGroup] || {rank: 0}).rank;
				if (roomGroup === Users.PLAYER_SYMBOL || roomGroup === Users.HOST_SYMBOL || roomGroup === '#') {
					// Player, Host, and Room Owner always trump higher global rank
					group = roomGroup;
				} else {
					group = (roomRank > globalRank ? roomGroup : parentGroup);
				}
				Config.greatergroupscache[`${roomGroup}${parentGroup}`] = group;
			}
		}

		return group === ' ' && !defaultSymbol ? '' : group;
	}
	getDirect(id: ID, defaultSymbol?: boolean): GroupSymbol | '';
	getDirect(id: ID, defaultSymbol: true): GroupSymbol;
	getDirect(id: ID, defaultSymbol?: boolean) {
		return super.get(id, defaultSymbol as true);
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
