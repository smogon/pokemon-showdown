/**
 * Room Events Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is a room-management system to keep track of upcoming room events.
 *
 * @license MIT license
 */

'use strict';

const ALLOWED_HTML = ['a', 'font', 'i', 'u', 'b', 'strong', 'em', 'small', 'sub', 'sup', 'ins', 'del', 'code', 'br', 'button'];

exports.commands = {
	events: 'roomevents',
	roomevent: 'roomevents',
	roomevents: {
		'': function (target, room, user) {
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!room.events || !Object.keys(room.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room.");
			}
			if (!this.runBroadcast()) return;

			let buf = '<table border="1" cellspacing="0" cellpadding="3">';
			buf += '<th>Event Name:</th><th>Event Description:</th><th>Event Date:</th>';
			for (let i in room.events) {
				buf += `<tr><td>${Chat.escapeHTML(i)}</td><td>${room.events[i].desc}</td><td>${Chat.escapeHTML(room.events[i].date)}</td></tr>`;
			}
			buf += '</table>';
			return this.sendReply(`|raw|<div class="infobox-limited">${buf}</div>`);
		},
		add: function (target, room, user) {
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('declare', null, room)) return false;
			if (!room.events) room.events = {};

			let [eventName, desc, date] = target.split('|').map(param => param.trim());
			if (!(eventName && desc && date)) return this.errorReply("You're missing a command parameter - see /help roomevents for this command's syntax.");

			if (eventName.length > 50) return this.errorReply("Event names should not exceed 50 characters.");
			if (date.length > 150) return this.errorReply("Event dates should not exceed 150 characters.");
			if (desc.length > 750) return this.errorReply("Event descriptions should not exceed 750 characters.");

			desc = this.canHTML(desc, ALLOWED_HTML);
			if (!desc) return false; // HTML issue - line above will be more specific
			if (room.events[eventName]) return this.errorReply("An event with this name is already added to the events list.");

			room.events[eventName] = {
				desc: desc,
				date: date,
			};
			this.privateModCommand(`(${user.name} added a roomevent titled "${eventName}".)`);

			room.chatRoomData.events = room.events;
			Rooms.global.writeChatRoomData();
		},
		remove: function (target, room, user) {
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('declare', null, room)) return false;
			if (!room.events || !Object.keys(room.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room to remove.");
			}
			if (!target) return this.errorReply("Usage: /roomevents remove [event name]");

			target = target.trim();
			if (!room.events[target]) return this.errorReply(`There is no event named '${target}'. Check spelling?`);
			delete room.events[target];
			this.privateModCommand(`(${user.name} removed a roomevent titled "${target}".)`);

			room.chatRoomData.events = room.events;
			Rooms.global.writeChatRoomData();
		},
		help: function (target, room, user) {
			return this.parse('/help roomevents');
		},
	},
	roomeventshelp: [
		"/roomevents - Displays a list of upcoming room-specific events.",
		"/roomevents add [event name] | [event description] | [event date/time] - Adds a room event. Requires: # & ~",
		"/roomevents remove [event name] - Deletes an event. Requires: # & ~",
	],
};
