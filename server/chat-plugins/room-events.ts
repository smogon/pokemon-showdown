/**
 * Room Events Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is a room-management system to keep track of upcoming room.settings!.events.
 *
 * @license MIT license
 */

function formatEvent(event: {eventName: string, date: string, desc: string, started: boolean}) {
	const timeRemaining = new Date(event.date).getTime() - new Date().getTime();
	let explanation = timeRemaining.toString();
	if (!timeRemaining) explanation = "The time remaining for this event is not available";
	if (timeRemaining < 0) explanation = "This event will start soon";
	if (event.started) explanation = "This event has started";
	if (!isNaN(timeRemaining)) {
		explanation = `This event will start in: ${Chat.toDurationString(timeRemaining, {precision: 2})}`;
	}
	let ret = `<tr title="${explanation}">`;
	ret += Chat.html`<td>${event.eventName}</td>`;
	ret += `<td>${Chat.formatText(event.desc, true)}</td>`;
	ret += Chat.html`<td><time>${event.date}</time></td></tr>`;
	return ret;
}

export const commands: ChatCommands = {
	events: 'roomevents',
	roomevent: 'roomevents',
	roomevents: {
		''(target, room, user) {
			if (!room.settings) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!room.settings?.events || !Object.keys(room.settings.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room.");
			}
			if (!this.runBroadcast()) return;
			let buff = '<table border="1" cellspacing="0" cellpadding="3">';
			buff += '<th>Event Name:</th><th>Event Description:</th><th>Event Date:</th>';
			for (const i in room.settings.events) {
				buff += formatEvent(room.settings.events[i]);
			}
			buff += '</table>';
			return this.sendReply(`|raw|<div class="infobox-limited">${buff}</div>`);
		},

		new: 'add',
		create: 'add',
		edit: 'add',
		add(target, room, user) {
			if (!room.settings) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			if (!room.settings.events) room.settings.events = Object.create(null);
			const [eventName, date, ...desc] = target.split(target.includes('|') ? '|' : ',');

			if (!(eventName && date && desc)) {
				return this.errorReply("You're missing a command parameter - see /help roomevents for this command's syntax.");
			}

			const eventNameActual = eventName.trim();
			const dateActual = date.trim();
			const descString = desc.join(target.includes('|') ? '|' : ',').trim();

			if (eventNameActual.length > 50) return this.errorReply("Event names should not exceed 50 characters.");
			if (dateActual.length > 150) return this.errorReply("Event dates should not exceed 150 characters.");
			if (descString.length > 1000) return this.errorReply("Event descriptions should not exceed 1000 characters.");

			const eventId = toID(eventName);
			if (!eventId) return this.errorReply("Event names must contain at least one alphanumerical character.");

			this.privateModAction(`(${user.name} ${room.settings.events[eventId] ? "edited the" : "added a"} roomevent titled "${eventNameActual}".)`);
			this.modlog('ROOMEVENT', null, `${room.settings.events[eventId] ? "edited" : "added"} "${eventNameActual}"`);
			room.settings.events[eventId] = {
				eventName: eventNameActual,
				date: dateActual,
				desc: descString,
				started: false,
			};
			Rooms.global.writeChatRoomData();
		},

		begin: 'start',
		start(target, room, user) {
			if (!room.settings) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			if (!room.settings.events || !Object.keys(room.settings.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room to start.");
			}
			if (!target) return this.errorReply("Usage: /roomevents start [event name]");
			target = toID(target);
			if (!room.settings.events[target]) return this.errorReply(`There is no such event named '${target}'. Check spelling?`);
			if (room.settings.events[target].started) {
				return this.errorReply(`The event ${room.settings.events[target].eventName} has already started.`);
			}
			for (const u in room.users) {
				const activeUser = Users.get(u);
				if (activeUser?.connected) {
					activeUser.sendTo(
						room,
						Chat.html`|notify|A new roomevent in ${room.title} has started!|` +
						`The "${room.settings.events[target].eventName}" roomevent has started!`
					);
				}
			}
			this.add(
				Chat.html`|raw|<div class="broadcast-blue"><b>The "${room.settings.events[target].eventName}" roomevent has started!</b></div>`
			);
			this.modlog('ROOMEVENT', null, `started "${target}"`);
			room.settings.events[target].started = true;
			Rooms.global.writeChatRoomData();
		},

		delete: 'remove',
		remove(target, room, user) {
			if (!room.settings) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			if (!room.settings.events || Object.keys(room.settings.events).length === 0) {
				return this.errorReply("There are currently no planned upcoming events for this room to remove.");
			}
			if (!target) return this.errorReply("Usage: /roomevents remove [event name]");
			target = toID(target);
			if (!room.settings.events[target]) return this.errorReply(`There is no such event named '${target}'. Check spelling?`);
			delete room.settings.events[target];
			this.privateModAction(`(${user.name} removed a roomevent titled "${target}".)`);
			this.modlog('ROOMEVENT', null, `removed "${target}"`);

			Rooms.global.writeChatRoomData();
		},
		view(target, room, user) {
			if (!room.settings) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!room.settings.events || !Object.keys(room.settings.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room.");
			}

			if (!target) return this.errorReply("Usage: /roomevents view [event name]");
			target = toID(target);
			if (!room.settings.events[target]) return this.errorReply(`There is no such event named '${target}'. Check spelling?`);

			if (!this.runBroadcast()) return;
			const buff = `<table border="1" cellspacing="0" cellpadding="3">${formatEvent(room.settings.events[target])}</table>`;
			this.sendReply(`|raw|<div class="infobox-limited">${buff}</div>`);
			if (!this.broadcasting && user.can('ban', null, room)) {
				this.sendReplyBox(
					Chat.html`<code>/roomevents add ${room.settings.events[target].eventName} |` +
					Chat.html`${room.settings.events[target].date} | ${room.settings.events[target].desc}</code>`
				);
			}
		},
		help(target, room, user) {
			return this.parse('/help roomevents');
		},
		sortby(target, room, user) {
			// preconditions
			if (!room.settings) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!room.settings.events || !Object.keys(room.settings.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room.");
			}
			if (!this.can('ban', null, room)) return false;

			// declare variables
			let multiplier = 1;
			let columnName = "";
			const delimited = target.split(target.includes('|') ? '|' : ',');
			const sortable = Object.values(room.settings.events);

			// id tokens
			if (delimited.length === 1) {
				columnName = target;
			} else {
				let order = "";
				[columnName, order] = delimited;
				order = toID(order);
				multiplier = (order === 'desc') ? -1 : 1;
			}

			// sort the array by the appropriate column name
			columnName = toID(columnName);
			switch (columnName) {
			case "date":
			case "eventdate":
				sortable.sort(
					(a, b) =>
						(toID(a.date) < toID(b.date)) ? -1 * multiplier :
						(toID(b.date) < toID(a.date)) ? 1 * multiplier : 0
				);
				break;
			case "desc":
			case "description":
			case "eventdescription":
				sortable.sort(
					(a, b) =>
						(toID(a.desc) < toID(b.desc)) ? -1 * multiplier :
						(toID(b.desc) < toID(a.desc)) ? 1 * multiplier : 0
				);
				break;
			case "eventname":
			case "name":
				sortable.sort(
					(a, b) =>
						(toID(a.eventName) < toID(b.eventName)) ? -1 * multiplier :
						(toID(b.eventName) < toID(a.eventName)) ? 1 * multiplier : 0
				);
				break;
			default:
				return this.errorReply("No or invalid column name specified. Please use one of: date, eventdate, desc, description, eventdescription, eventname, name.");
			}

			// rebuild the room.settings!.events object
			room.settings.events = {};
			for (const sortedObj of sortable) {
				const eventId = toID(sortedObj.eventName);
				room.settings.events[eventId] = sortedObj;
			}

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
		`/roomevents start [event name] - Declares to the room that the event has started. Requires: @ # & ~`,
		`/roomevents remove [event name] - Deletes an event. Requires: @ # & ~`,
		`/roomevents sortby [column name] | [asc/desc (optional)] - Sorts events table by column name and an optional argument to ascending or descending order. Ascending order is default. Requires: @ # & ~`,
		`/roomevents view [event name] - Displays information about a specific event.`,
	],
};
