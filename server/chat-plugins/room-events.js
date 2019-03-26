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
		''(target, room, user) {
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!room.events || !Object.keys(room.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room.");
			}
			if (!this.runBroadcast()) return;
			let buff = '<table border="1" cellspacing="0" cellpadding="3">';
			buff += '<th>Event Name:</th><th>Event Description:</th><th>Event Date:</th>';
			for (let i in room.events) {
				buff += `<tr><td>${Chat.escapeHTML(room.events[i].eventName)}</td><td>${Chat.formatText(room.events[i].desc, true)}</td><td><time>${Chat.escapeHTML(room.events[i].date)}</time></td></tr>`;
			}
			buff += '</table>';
			return this.sendReply(`|raw|<div class="infobox-limited">${buff}</div>`);
		},
		new: 'add',
		create: 'add',
		edit: 'add',
		add(target, room, user) {
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			if (!room.events) room.events = Object.create(null);
			let [eventName, date, ...desc] = target.split(target.includes('|') ? '|' : ',');

			if (!(eventName && date && desc)) return this.errorReply("You're missing a command parameter - see /help roomevents for this command's syntax.");

			eventName = eventName.trim();
			date = date.trim();
			desc = desc.join(target.includes('|') ? '|' : ',').trim();

			if (eventName.length > 50) return this.errorReply("Event names should not exceed 50 characters.");
			if (date.length > 150) return this.errorReply("Event dates should not exceed 150 characters.");
			if (desc.length > 1000) return this.errorReply("Event descriptions should not exceed 1000 characters.");

			const eventId = toId(eventName);
			if (!eventId) return this.errorReply("Event names must contain at least one alphanumerical character.");

			this.privateModAction(`(${user.name} ${room.events[eventId] ? "edited the" : "added a"} roomevent titled "${eventName}".)`);
			this.modlog('ROOMEVENT', null, `${room.events[eventId] ? "edited" : "added"} "${eventName}"`);
			room.events[eventId] = {
				eventName: eventName,
				date: date,
				desc: desc,
			};

			room.chatRoomData.events = room.events;
			Rooms.global.writeChatRoomData();
		},
		delete: 'remove',
		remove(target, room, user) {
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			if (!room.events || Object.keys(room.events).length === 0) {
				return this.errorReply("There are currently no planned upcoming events for this room to remove.");
			}
			if (!target) return this.errorReply("Usage: /roomevents remove [event name]");
			target = toId(target);
			if (!room.events[target]) return this.errorReply(`There is no such event named '${target}'. Check spelling?`);
			delete room.events[target];
			this.privateModAction(`(${user.name} removed a roomevent titled "${target}".)`);
			this.modlog('ROOMEVENT', null, `removed "${target}"`);

			room.chatRoomData.events = room.events;
			Rooms.global.writeChatRoomData();
		},
		view(target, room, user) {
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!room.events || !Object.keys(room.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room.");
			}

			if (!target) return this.errorReply("Usage: /roomevents view [event name]");
			target = toId(target);
			if (!room.events[target]) return this.errorReply(`There is no such event named '${target}'. Check spelling?`);

			if (!this.runBroadcast()) return;
			this.sendReplyBox(`<table border="1" cellspacing="0" cellpadding="3"><tr><td>${Chat.escapeHTML(room.events[target].eventName)}</td><td>${Chat.formatText(room.events[target].desc, true)}</td><td><time>${Chat.escapeHTML(room.events[target].date)}</time></td></tr></table>`);
			if (!this.broadcasting && user.can('ban', null, room)) this.sendReplyBox(Chat.html`<code>/roomevents add ${room.events[target].eventName} | ${room.events[target].date} | ${room.events[target].desc}</code>`);
		},
		help(target, room, user) {
			return this.parse('/help roomevents');
		},
		sortby(target, room, user) {
			// preconditions
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!room.events || !Object.keys(room.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room.");
			}
			if (!this.can('ban', null, room)) return false;

			// declare variables
			let multiplier = 1;
			let columnName = "";
			let delimited = target.split(target.includes('|') ? '|' : ',');
			let sortable = Object.values(room.events);

			// id tokens
			if (delimited.length === 1) {
				columnName = target;
			} else {
				let order = "";
				[columnName, order] = delimited;
				order = toId(order);
				multiplier = (order === 'desc') ? -1 : 1;
			}

			// sort the array by the appropriate column name
			columnName = toId(columnName);
			switch (columnName) {
			case "date":
			case "eventdate":
				sortable.sort((a, b) => { return (toId(a.date) < toId(b.date)) ? -1 * multiplier : (toId(b.date) < toId(a.date)) ? 1 * multiplier : 0; });
				break;
			case "desc":
			case "description":
			case "eventdescription":
				sortable.sort((a, b) => { return (toId(a.desc) < toId(b.desc)) ? -1 * multiplier : (toId(b.desc) < toId(a.desc)) ? 1 * multiplier : 0; });
				break;
			case "eventname":
			case "name":
				sortable.sort((a, b) => { return (toId(a.eventName) < toId(b.eventName)) ? -1 * multiplier : (toId(b.eventName) < toId(a.eventName)) ? 1 * multiplier : 0; });
				break;
			default:
				return this.errorReply("No or invalid column name specified. Please use one of: date, eventdate, desc, description, eventdescription, eventname, name.");
			}

			// rebuild the room.events object
			room.events = {};
			for (const sortedObj of sortable) {
				const eventId = toId(sortedObj.eventName);
				room.events[eventId] = sortedObj;
			}
			room.chatRoomData.events = room.events;

			// build communication string
			const resultString = `sorted by column:` + columnName +
								 ` in ${multiplier === 1 ? "ascending" : "descending"} order` +
								 `${delimited.length === 1 ? " (by default)" : ""}`;
			this.modlog('ROOMEVENT', null, resultString);
			return this.sendReply(resultString);
		},
	},
	roomeventshelp: [
		`/roomevents - Displays a list of upcoming room-specific events.`,
		`/roomevents add [event name] | [event date/time] | [event description] - Adds a room event. A timestamp in event date/time field like YYYY-MM-DD HH:MM±hh:mm will be displayed in user's timezone. Requires: @ # & ~`,
		`/roomevents remove [event name] - Deletes an event. Requires: @ # & ~`,
		`/roomevents view [event name] - Displays information about a specific event.`,
		`/roomevents sortby [column name] | [asc/desc (optional)] - Sorts events table by column name and an optional argument to ascending or descending order. Ascending order is default`,
	],
};
