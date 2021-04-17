import {Utils} from '../../lib';

export type RoomSection = 'none' | 'nonpublic' | 'officialrooms' | 'officialtiers' | 'communityprojects' |
'gaming' | 'languages' | 'entertainment' | 'lifehobbies' | 'onsitegames';

export const categories: RoomSection[] = [
	'none', 'nonpublic', 'officialrooms', 'officialtiers', 'communityprojects', 'gaming', 'languages', 'entertainment', 'lifehobbies', 'onsitegames',
];

export const sectionNames: {[k in RoomSection]: string} = {
	none: 'none',
	nonpublic: 'Non-Public',
	officialrooms: 'Official Rooms',
	officialtiers: 'Official Tiers',
	communityprojects: 'Community Projects',
	gaming: 'Gaming',
	languages: 'Languages',
	entertainment: 'Entertainment',
	lifehobbies: 'Life & Hobbies',
	onsitegames: 'On-Site Games',
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
};
