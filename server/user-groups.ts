import {FS} from '../lib/fs';

const Groups = new Map<string | ID, Auth>();

export abstract class Auth extends Map<ID, GroupSymbol> {
	save: () => void;
	constructor() {
		super();
		this.save = () => null;
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
		this.room.saveSettings();
	}
	load() {
		for (const key in this.room.settings.auth) {
			super.set(key as ID, this.room.settings.auth[key]);
		}
	}
	set(id: ID, group: GroupSymbol) {
		const user = Users.get(id);
		if (user) {
			this.room.onUpdateIdentity(user);
		}
		super.set(id, group);
		this.save();
		return this;
	}
	delete(id: ID) {
		if (!super.has(id)) return false;
		super.delete(id);
		delete this.room.settings.auth[id];
		this.save();
		return true;
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
	set(id: ID, group: GroupSymbol) {
		const user = Users.get(id);
		if (user) {
			user.group = group;
			user.updateIdentity();
		}
		super.set(id, group);
		this.save();
		return this;
	}
	delete(id: ID) {
		if (!super.has(id)) return false;
		super.delete(id);
		const user = Users.get(id);
		if (user) {
			user.group = ' ';
		}
		this.save();
		return true;
	}
}
