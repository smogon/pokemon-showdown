import {Utils} from '../../lib';

export const sections = [
	'none', 'nonpublic', 'officialrooms', 'officialtiers', 'communityprojects', 'gaming', 'languages', 'entertainment', 'lifehobbies', 'onsitegames',
] as const;

export type RoomSection = typeof sections[number];

export const sectionNames: {[k in RoomSection]: string} = {
	none: 'none',
	nonpublic: 'Non-public',
	officialrooms: 'Official rooms',
	officialtiers: 'Official tiers',
	communityprojects: 'Community projects',
	gaming: 'Gaming',
	languages: 'Languages',
	entertainment: 'Entertainment',
	lifehobbies: 'Life & hobbies',
	onsitegames: 'On-site games',
};

export const commands: ChatCommands = {
	setroomsection: 'roomsection',
	roomsection(target, room, user) {
		room = this.requireRoom();
		if (!target) {
			if (!this.runBroadcast()) return;
			this.sendReplyBox(Utils.html`This room is ${sectionNames[room.settings.section] !== 'none' ? `in the ${sectionNames[room.settings.section]} section` : `not in a section`}.`);
			return;
		}
		this.checkCan('gdeclare');
		const section = room.adjustSection(target);
		this.sendReply(`The room section is now: ${sectionNames[section]}`);

		this.privateModAction(`(${user.name} changed the room section to: "${sectionNames[section]}".)`);
		this.modlog('ROOMSECTION', null, `to "${sectionNames[section]}"`);
	},
	roomsectionhelp: [
		`/roomsection [section] - Sets the room this is used in to the specified [section]. Requires: &`,
		`Valid sections: ${sections.join(', ')}`,
	],

	desectionleader: 'sectionleader',
	sectionleader(target, room, user, connection, cmd) {
		this.checkCan('gdeclare');
		room = this.requireRoom();
		if (!target || target.split(',').length < 2) return this.parse(`/help sectionleader`);

		const [targetStr, sectionid] = this.splitOne(target);
		this.splitTarget(targetStr);
		const section = room.sanitizeSection(sectionid);
		const targetUser = this.targetUser;
		const userid = toID(this.targetUsername);
		const name = targetUser ? targetUser.name : this.targetUsername;
		const demoting = cmd === 'desectionleader';
		const leadsSection = Users.globalAuth.sectionLeaders.getSection(targetUser || userid);
		if (Users.globalAuth.sectionLeaders.has(targetUser || userid) && !demoting && section === leadsSection) {
			throw new Chat.ErrorMessage(`${name} is already a Section Leader of ${sectionNames[section]}.`);
		} else if (!Users.globalAuth.sectionLeaders.has(targetUser || userid) && demoting) {
			throw new Chat.ErrorMessage(`${name} is not a Section Leader.`);
		}
		const staff = Rooms.get('staff');
		if (!demoting) {
			Users.globalAuth.sectionLeaders.add(userid, section, name);
			this.addGlobalModAction(`${name} was appointed Section Leader of ${sectionNames[section]} by ${user.name}.`);
			this.globalModlog(`SECTION LEADER`, userid);
			if (staff && !staff.auth.has(userid)) this.parse(`/msgroom staff,/roomvoice ${userid}`);
			if (targetUser) {
				targetUser.popup(`You were appointed Section Leader by ${user.name}.`);
				if (!targetUser.inRooms.has('staff')) this.parse(`/msgroom staff,/invite ${name}`);
				if (staff && !targetUser.inRooms.has(staff.roomid)) {
					this.parse(`/msgroom staff,/invite ${name}`);
				}
			}
		} else {
			Users.globalAuth.sectionLeaders.delete(userid);
			this.parse();
			this.privateGlobalModAction(`${name} was demoted from Section Leader by ${user.name}.`);
			this.globalModlog(`DESECTION LEADER`, userid);
			if (staff && staff.auth.getDirect(userid) === '+') this.parse(`/msgroom staff,/roomdeauth ${userid}`);
			if (targetUser) targetUser.popup(`You were demoted from Section Leader by ${user.name}.`);
		}

		if (targetUser) {
			targetUser.updateIdentity();
			Rooms.global.checkAutojoin(targetUser);
			if (targetUser.trusted && !Users.isTrusted(targetUser.id)) {
				targetUser.trusted = '';
			}
		}
	},
	sectionleaderhelp: [
		`/sectionleader [target user], [sectionid] - Appoints [target user] Section Leader.`,
		`/desectionleader [target user] - Demotes [target user] from Section Leader.`,
		`Valid sections: ${sections.join(', ')}`,
		`If you wish to change someone's section to another one, just /desectionleader then /sectionleader.`,
		`Requires: &`,
	],
};
