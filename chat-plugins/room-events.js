/**
 * Room Events Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is a room-management system to keep track of upcoming room events.
 *
 * @license MIT license
 */

'use strict';

exports.commands = {
	events: 'roomevents',
	roomevent: 'roomevents',
	roomevents: {
		'': function (target, room, user) {
			if (room.battle) return this.errorReply("This command is not meant for battle rooms.");
			if (!room.events || Object.keys(room.events).length === 0) {
				return this.errorReply("There are currently no planned upcoming events for this room.");
			}
			if (!this.runBroadcast()) return;
			let buff = '<table border="1" cellspacing="0" cellpadding="3">';
			buff += '<th>Event Name:</th><th>Event Description:</th><th>Event Date:</th>';
			let events = Object.keys(room.events);
			for (let i = 0; i < events.length; i++) {
				buff += `<tr><td>${Chat.escapeHTML(events[i])}</td><td>${room.events[events[i]].desc}</td><td>${Chat.escapeHTML(room.events[events[i]].date)}</td></tr>`;
			}
			buff += '</table>';
			return this.sendReply(`|raw|<div class="infobox-limited">${buff}</div>`);
		},
		add: function (target, room, user) {
			if (room.battle) return this.errorReply("This command is not meant for battle rooms.");
			if (!this.can('declare', null, room)) return false;
			if (!room.events) room.events = {};
			let [eventName, desc, ...date] = target.split('|');
			date = date.join("|");
			if (!eventName || !desc || !date) return this.errorReply("You're missing a command parameter - see /help roomevents for this command's syntax.");
			desc = this.canHTML(desc);
			if (desc === false) return false; // HTML issue - line above will be more specific
			eventName = eventName.trim();
			if (room.events[eventName]) return this.errorReply("An event with this name is already added to the events list.");
			room.events[eventName] = {
				desc: desc,
				date: date,
			};
			this.privateModCommand(`(${user.name} added a roomevent titled "${eventName}".)`);
			if (room.chatRoomData) {
				room.chatRoomData.events = room.events;
				Rooms.global.writeChatRoomData();
			}
		},
		remove: function (target, room, user) {
			if (room.battle) return this.errorReply("This command is not meant for battle rooms.");
			if (!this.can('declare', null, room)) return false;
			if (!room.events || Object.keys(room.events).length === 0) {
				return this.errorReply("There are currently no planned upcoming events for this room to remove.");
			}
			if (!target) return this.errorReply("Usage: /roomevents remove [event name]");
			target = target.trim();
			if (!room.events[target]) return this.errorReply(`There is no such event named '${target}'.  Check spelling?`);
			delete room.events[target];
			this.privateModCommand(`(${user.name} removed a roomevent titled "${target}".)`);
			if (room.chatRoomData) {
				room.chatRoomData.events = room.events;
				Rooms.global.writeChatRoomData();
			}
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
