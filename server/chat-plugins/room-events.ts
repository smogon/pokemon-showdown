/**
 * Room Events Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is a room-management system to keep track of upcoming room events.
 *
 * @license MIT license
 */

function formatEvent(event: {eventName: string, date: string, desc: string, started: boolean, aliases: string[]}) {
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
	ret += Chat.html`<td>${event.aliases ? event.aliases.join(", ") : ""}</td>`;
	ret += `<td>${Chat.formatText(event.desc, true)}</td>`;
	ret += Chat.html`<td><time>${event.date}</time></td></tr>`;
	return ret;
}

function getAllAliases(room: Room) {
	return Object.keys(room.events).map(event => room.events[event].aliases).join();
}

function getEventID(nameOrAlias: string, room: Room): ID {
	let id = toID(nameOrAlias);
	if (!room.events[id]) {
		for (const possibleEvent in room.events) {
			if (room.events[possibleEvent].aliases) {
				if (room.events[possibleEvent].aliases.includes(id)) {
					id = toID(possibleEvent);
				}
			}
		}
	}
	return id;
}

export const commands: ChatCommands = {
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
			buff += '<th>Event Name:</th><th>Event Aliases:</th><th>Event Description:</th><th>Event Date:</th>';
			for (const i in room.events) {
				buff += formatEvent(room.events[i]);
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
			const [eventName, date, ...desc] = target.split(target.includes('|') ? '|' : ',');

			if (!(eventName && date && desc)) {
				return this.errorReply("You're missing a command parameter - see /help roomevents for this command's syntax.");
			}

			const dateActual = date.trim();
			const descString = desc.join(target.includes('|') ? '|' : ',').trim();

			if (eventName.trim().length > 50) return this.errorReply("Event names should not exceed 50 characters.");
			if (dateActual.length > 150) return this.errorReply("Event dates should not exceed 150 characters.");
			if (descString.length > 1000) return this.errorReply("Event descriptions should not exceed 1000 characters.");

			const eventId = getEventID(eventName, room);
			if (!eventId) return this.errorReply("Event names must contain at least one alphanumerical character.");

			const eventNameActual = (room.events[eventId] ? room.events[eventId].eventName : eventName.trim());
			this.privateModAction(`(${user.name} ${room.events[eventId] ? "edited the" : "added a"} roomevent titled "${eventNameActual}".)`);
			this.modlog('ROOMEVENT', null, `${room.events[eventId] ? "edited" : "added"} "${eventNameActual}"`);
			room.events[eventId] = {
				eventName: eventNameActual,
				date: dateActual,
				desc: descString,
				started: false,
				aliases: (room.events[eventId] ? room.events[eventId].aliases : []),
			};

			room.chatRoomData.events = room.events;
			Rooms.global.writeChatRoomData();
		},

		rename(target, room, user) {
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			let [oldName, newName] = target.split(target.includes('|') ? '|' : ',');
			if (!(oldName && newName)) return this.errorReply("Usage: /roomevents rename [old name], [new name]");

			newName = newName.trim();
			const newID = toID(newName);
			const oldID = (getAllAliases(room).includes(toID(oldName)) ? getEventID(oldName, room) : toID(oldName));
			if (newID === oldID) return this.errorReply("The new name must be different from the old one.");
			if (!newID) return this.errorReply("Event names must contain at least one alphanumeric character.");
			if (newName.length > 50) return this.errorReply("Event names should not exceed 50 characters.");

			const eventData = room.events[oldID];
			if (!eventData) return this.errorReply(`There is no event titled "${oldName}".`);
			if (room.events[newID] || getAllAliases(room).includes(newID)) {
				return this.errorReply(`"${newName}" is already an event or alias.`);
			}
			const originalName = eventData.eventName;
			eventData.eventName = newName;
			room.events[newID] = eventData;
			delete room.events[oldID];

			this.privateModAction(`(${user.name} renamed the roomevent titled "${originalName}" to "${newName}".)`);
			this.modlog('ROOMEVENT', null, `renamed "${originalName}" to "${newName}"`);
			room.chatRoomData.events = room.events;
			Rooms.global.writeChatRoomData();
		},

		begin: 'start',
		start(target, room, user) {
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			if (!room.events || !Object.keys(room.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room to start.");
			}
			if (!target) return this.errorReply("Usage: /roomevents start [event name]");
			target = toID(target);
			const event = room.events[getEventID(target, room)];
			if (!event) return this.errorReply(`There is no event titled '${target}'. Check spelling?`);
			if (event.started) {
				return this.errorReply(`The event ${event.eventName} has already started.`);
			}
			for (const u in room.users) {
				const activeUser = Users.get(u);
				if (activeUser?.connected) {
					activeUser.sendTo(
						room,
						Chat.html`|notify|A new roomevent in ${room.title} has started!|` +
						`The "${event.eventName}" roomevent has started!`
					);
				}
			}
			this.add(
				Chat.html`|raw|<div class="broadcast-blue"><b>The "${event.eventName}" roomevent has started!</b></div>`
			);
			this.modlog('ROOMEVENT', null, `started "${toID(event.eventName)}"`);
			event.started = true;
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
			target = toID(target);
			if (getAllAliases(room).includes(target)) return this.errorReply("To delete aliases, use /roomevents removealias.");
			if (!room.events[target]) return this.errorReply(`There is no event titled '${target}'. Check spelling?`);
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
			target = toID(target);

			const event = room.events[getEventID(target, room)];
			if (!event) return this.errorReply(`There is no event titled '${target}'. Check spelling?`);
			if (!this.runBroadcast()) return;
			const buff = `<table border="1" cellspacing="0" cellpadding="3">${formatEvent(event)}</table>`;
			this.sendReply(`|raw|<div class="infobox-limited">${buff}</div>`);
			if (!this.broadcasting && user.can('ban', null, room)) {
				this.sendReplyBox(
					Chat.html`<code>/roomevents add ${event.eventName} |` +
					Chat.html`${event.date} | ${event.desc}</code>`
				);
			}
		},
		alias: 'addalias',
		addalias(target, room, user) {
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			const [alias, eventId] = target.split(target.includes('|') ? '|' : ',').map(argument => toID(argument));
			if (!(alias && eventId)) {
				return this.errorReply("Usage: /roomevents addalias [alias], [event name]. Aliases must contain at least one alphanumeric character.");
			}
			if (!room.events || Object.keys(room.events).length === 0) {
				return this.errorReply(`There are currently no scheduled events.`);
			}
			if (!room.events[eventId]) return this.errorReply(`There is no event titled "${eventId}".`);
			if (!room.events[eventId].aliases) room.events[eventId].aliases = []; // backwards compatibility with old event data

			if (getAllAliases(room).includes(alias) || room.events[alias]) {
				return this.errorReply(`"${alias}" is already an event or an alias of an event.`);
			}
			room.events[eventId].aliases.push(alias);
			this.privateModAction(`(${user.name} added an alias "${alias}" for the roomevent "${eventId}".)`);
			this.modlog('ROOMEVENT', null, `alias for "${eventId}": "${alias}"`);

			room.chatRoomData.events = room.events;
			Rooms.global.writeChatRoomData();
		},
		deletealias: 'removealias',
		removealias(target, room, user) {
			if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			target = toID(target);
			if (!target) return this.errorReply("Usage: /roomevents removealias <alias>");
			if (!getAllAliases(room).includes(target)) return this.errorReply(`${target} isn't an alias.`);

			const event = room.events[getEventID(target, room)];
			room.events[getEventID(target, room)].aliases = event.aliases.filter(alias => alias !== target);

			this.privateModAction(`(${user.name} removed the alias "${target}")`);
			this.modlog('ROOMEVENT', null, `removed the alias "${target}"`);

			room.chatRoomData.events = room.events;
			Rooms.global.writeChatRoomData();
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
			const delimited = target.split(target.includes('|') ? '|' : ',');
			const sortable = Object.values(room.events);

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

			// rebuild the room.events object
			room.events = {};
			for (const sortedObj of sortable) {
				const eventId = toID(sortedObj.eventName);
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
		`/roomevents start [event name] - Declares to the room that the event has started. Requires: @ # & ~`,
		`/roomevents remove [event name] - Deletes an event. Requires: @ # & ~`,
		`/roomevents rename [old event name] | [new name] - Renames an event. Requires: @ # & ~`,
		`/roomevents addalias [alias] | [event name] - Adds an alias for the event. Requires: @ # & ~`,
		`/roomevents removealias [alias] - Removes an event alias. Requires: @ # & ~`,
		`/roomevents sortby [column name] | [asc/desc (optional)] - Sorts events table by column name and an optional argument to ascending or descending order. Ascending order is default. Requires: @ # & ~`,
		`/roomevents view [event name] - Displays information about a specific event.`,
	],
};
