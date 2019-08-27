/*
* Announcements chat plugin
* By Spandamn
*/

'use strict';

/** @typedef {Announcement} AnnouncementType */

class Announcement {
	/**
	 * @param {ChatRoom | GameRoom} room
	 * @param {{source: string, supportHTML: boolean}} announcement
	 */
	constructor(room, announcement) {
		this.announcementNumber = ++room.gameNumber;
		this.room = room;
		this.announcement = announcement.source;
		this.supportHTML = announcement.supportHTML;
		/** @type {NodeJS.Timer?} */
		this.timeout = null;
		this.timeoutMins = 0;
	}

	getAnnouncementMarkup() {
		if (this.supportHTML) return this.announcement;
		return Chat.escapeHTML(this.announcement);
	}

	generateAnnouncement(ended = false, option = 0) {
		let output = `<div class="broadcast-blue"><p style="margin: 2px 0 5px 0"><strong style="font-size:11pt">${this.getAnnouncementMarkup()}</strong></p></div>`;
		return output;
	}

	/**
	 * @param {User} user
	 * @param {Connection?} [connection]
	 */
	displayTo(user, connection = null) {
		const recipient = connection || user;
		recipient.sendTo(this.room, `|uhtml|announcement${this.announcementNumber}|${this.generateAnnouncement()}`);
	}

	display() {
		let announcement = this.generateAnnouncement();
		for (let i in this.room.users) {
			let thisUser = this.room.users[i];
			thisUser.sendTo(this.room, `|uhtml|announcement${this.announcementNumber}|${announcement}`);
		}
	}

	/**
	 * @param {User} user
	 * @param {Connection?} [connection]
	 */
	onConnect(user, connection = null) {
		this.displayTo(user, connection);
	}

	end() {
		this.room.send(`|uhtmlchange|announcement${this.announcementNumber}|<div class="infobox">(The announcement has ended.)</div>`);
	}
}

exports.Announcement = Announcement;

/** @type {ChatCommands} */
const commands = {
	announcement: {
		htmlcreate: 'new',
		create: 'new',
		new(target, room, user, connection, cmd, message) {
			if (!target) return this.parse('/help announcement new');
			target = target.trim();
			if (room.battle) return this.errorReply("Battles do not support announcements.");

			let text = Chat.filter(this, target, user, room, connection);
			if (target !== text) return this.errorReply("You are not allowed to use filtered words in announcements.");

			const supportHTML = cmd === 'htmlcreate';

			if (!this.can('minigame', null, room)) return false;
			if (supportHTML && !this.can('declare', null, room)) return false;
			if (!this.canTalk()) return;
			if (room.poll) return this.errorReply("There is a poll in progress in this room.");
			if (room.announcement) return this.errorReply("There is already an announcement in progress in this room.");

			// @ts-ignore In the case that any of these are null, the function is terminated, and the result never used.
			if (supportHTML) target = this.canHTML(target);

			room.announcement = new Announcement(room, {source: target, supportHTML: supportHTML});
			room.announcement.display();

			this.roomlog(`${user.name} used ${message}`);
			this.modlog('ANNOUNCEMENT');
			return this.privateModAction(`(An announcement was started by ${user.name}.)`);
		},
		newhelp: [`/announcement create [announcement] - Creates an announcement. Requires: % @ # & ~`],

		timer(target, room, user) {
			if (!room.announcement) return this.errorReply("There is no announcement running in this room.");

			if (target) {
				if (!this.can('minigame', null, room)) return false;
				if (target === 'clear') {
					if (!room.announcement.timeout) return this.errorReply("There is no timer to clear.");
					clearTimeout(room.announcement.timeout);
					room.announcement.timeout = null;
					room.announcement.timeoutMins = 0;
					return this.add("The announcement timer was turned off.");
				}
				let timeout = parseFloat(target);
				if (isNaN(timeout) || timeout <= 0 || timeout > 0x7FFFFFFF) return this.errorReply("Invalid time given.");
				if (room.announcement.timeout) clearTimeout(room.announcement.timeout);
				room.announcement.timeoutMins = timeout;
				room.announcement.timeout = setTimeout(() => {
					room.announcement.end();
					delete room.announcement;
				}, (timeout * 60000));
				room.add(`The announcement timer was turned on: the announcement will end in ${timeout} minute(s).`);
				this.modlog('announcement TIMER', null, `${timeout} minutes`);
				return this.privateModAction(`(The announcement timer was set to ${timeout} minute(s) by ${user.name}.)`);
			} else {
				if (!this.runBroadcast()) return;
				if (room.announcement.timeout) {
					return this.sendReply(`The announcement timer is on and will end in ${room.announcement.timeoutMins} minute(s).`);
				} else {
					return this.sendReply("The announcement timer is off.");
				}
			}
		},
		timerhelp: [
			`/announcement timer [minutes] - Sets the announcement to automatically end after [minutes] minutes. Requires: % @ # & ~`,
			`/announcement timer clear - Clears the announcement's timer. Requires: % @ # & ~`,
		],

		close: 'end',
		stop: 'end',
		end(target, room, user) {
			if (!this.can('minigame', null, room)) return false;
			if (!this.canTalk()) return;
			if (!room.announcement) return this.errorReply("There is no announcement running in this room.");
			if (room.announcement.timeout) clearTimeout(room.announcement.timeout);

			room.announcement.end();
			delete room.announcement;
			this.modlog('ANNOUNCEMENT END');
			return this.privateModAction(`(The announcement was ended by ${user.name}.)`);
		},
		endhelp: [`/announcement end - Ends a announcement and displays the results. Requires: % @ # & ~`],

		show: 'display',
		display(target, room, user, connection) {
			if (!room.announcement) return this.errorReply("There is no announcement running in this room.");
			if (!this.runBroadcast()) return;
			room.update();

			if (this.broadcasting) {
				room.announcement.display();
			} else {
				room.announcement.displayTo(user, connection);
			}
		},
		displayhelp: [`/announcement display - Displays the announcement`],

		''(target, room, user) {
			this.parse('/help announcement');
		},
	},
	announcementhelp: [
		`/announcement allows rooms to run their own announcements. These announcements are limited to one announcement at a time per room.`,
		`Accepts the following commands:`,
		`/announcement create [announcement] - Creates a announcement. Requires: % @ # & ~`,
		`/announcement htmlcreate [announcement] - Creates a announcement, with HTML allowed. Requires: # & ~`,
		`/announcement timer [minutes] - Sets the announcement to automatically end after [minutes]. Requires: % @ # & ~`,
		`/announcement display - Displays the announcement`,
		`/announcement end - Ends a announcement. Requires: % @ # & ~`,
	],
};

exports.commands = commands;

process.nextTick(() => {
	Chat.multiLinePattern.register('/announcement (new|create|htmlcreate) ');
});
