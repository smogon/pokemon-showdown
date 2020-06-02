import {FS} from '../lib/fs';

const Groups = new Map<string | ID, Auth>();

export abstract class Auth extends Map<ID, GroupSymbol> {
	save: () => void;
	constructor() {
		super();
		this.save = () => null;
	}
	setGroup(user: User, group: GroupSymbol) {
		if (!user) throw new Error(`No user passed to setGroup, use forceGroup instead.`);
		super.set(user.id, group);
		return this.save;
	}
	forceGroup(userid: ID, group: GroupSymbol) {
		const user = Users.get(userid);
		if (user) return this.setGroup(user, group);
		super.set(userid, group);
		return this.save;
	}
	get(id: ID) {
		return super.get(id);
	}
}

export class RoomAuth extends Auth {
	room: Room | BasicChatRoom | BasicRoom;
	constructor(room: Room | BasicChatRoom | BasicRoom) {
		super();
		this.room = room;
		Groups.set(this.room.roomid, this);
		this.save = () => this.store();
		this.load();
	}
	store() {
		// construct auth object
		const auth = Object.create(null);
		for (const [k, v] of super.entries()) {
			auth[k] = v;
		}
		this.room.settings.auth = auth;
		return this.room.saveSettings();
	}
	load() {
		for (const key in this.room.settings.auth) {
			super.set(key as ID, this.room.settings.auth[key]);
		}
	}
	setGroup(user: User, group: GroupSymbol) {
		if (!user) throw new Error(`No user passed to setGroup, use forceGroup instead.`);
		super.set(user.id, group);
		user.updateIdentity(this.room.roomid);
		return this.save;
	}
}

export class GlobalAuth extends Auth {
	constructor() {
		super();
		// only one global auth object
		if (Groups.has('global')) {
			throw new Error(`Creating a duplicate GlobalAuth object.`);
		}
		Groups.set('global', this);
		this.save = () => this.store();
		void this.load();
	}
	store() {
		let buffer = '';
		for (const [k, v] of super.entries()) {
			buffer += `${k.replace(/,/g, '')},${v}\n`;
		}
		return FS('config/usergroups.csv').write(buffer);
	}
	load() {
		return FS('config/usergroups.csv').readIfExists().then(data => {
			for (const row of data.split("\n")) {
				if (!row) continue;
				const cells = row.split(",");
				super.set(toID(cells[0]), (cells[1].charAt(0)) as GroupSymbol);
			}
		});
	}
	setGroup(user: User, group: GroupSymbol) {
		if (!user) throw new Error(`No user passed to setGroup, use forceGroup instead.`);
		super.set(user.id, group);
		if (global) user.group = group;
		return this.save;
	}
}
