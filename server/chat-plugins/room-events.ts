/**
 * Room Events Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is a room-management system to keep track of upcoming room events.
 *
 * @license MIT license
 */
import {Utils} from '../../lib/utils';

type RoomEvent = NonNullable<import('../rooms').RoomSettings['events']>[''];

function formatEvent(event: RoomEvent, showAliases?: boolean) {
	const timeRemaining = new Date(event.date).getTime() - new Date().getTime();
	let explanation = timeRemaining.toString();
	if (!timeRemaining) explanation = "The time remaining for this event is not available";
	if (timeRemaining < 0) explanation = "This event will start soon";
	if (event.started) explanation = "This event has started";
	if (!isNaN(timeRemaining)) {
		explanation = `This event will start in: ${Chat.toDurationString(timeRemaining, {precision: 2})}`;
	}
	let ret = `<tr title="${explanation}">`;
	ret += Utils.html`<td>${event.eventName}</td>`;
	ret += showAliases ? Utils.html`<td>${event.aliases?.join(", ")}</td>` : ``;
	ret += `<td>${Chat.formatText(event.desc, true)}</td>`;
	ret += Utils.html`<td><time>${event.date}</time></td></tr>`;
	return ret;
}

function getAllAliases(room: Room) {
	if (!room.settings.events) return [];
	const aliases: string[] = [];
	for (const event of Object.values(room.settings.events)) {
		if (event.aliases) aliases.push(...event.aliases);
	}
	return aliases;
}
function getEventID(nameOrAlias: string, room: Room): ID {
	let id = toID(nameOrAlias);
	if (room.settings.events && !room.settings.events[id]) {
		for (const possibleEvent in room.settings.events) {
			if (room.settings.events[possibleEvent].aliases?.includes(id)) {
				id = toID(possibleEvent);
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
			if (!room.persist) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!room.settings.events || !Object.keys(room.settings.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room.");
			}
			if (!this.runBroadcast()) return;
			const hasAliases = getAllAliases(room).length > 0;

			let buff = '<table border="1" cellspacing="0" cellpadding="3">';
			buff += `<th>Event Name:</th>${hasAliases ? `<th>Event Aliases:</th>` : ``}<th>Event Description:</th><th>Event Date:</th>`;
			for (const i in room.settings.events) {
				buff += formatEvent(room.settings.events[i], hasAliases);
			}
			buff += '</table>';
			return this.sendReply(`|raw|<div class="infobox-limited">${buff}</div>`);
		},

		new: 'add',
		create: 'add',
		edit: 'add',
		add(target, room, user) {
			if (!room.persist) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			if (!room.settings.events) room.settings.events = Object.create(null);
			const events = room.settings.events!;
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

			const oldEvent = events[eventId];
			const eventNameActual = (oldEvent ? oldEvent.eventName : eventName.trim());
			this.privateModAction(`(${user.name} ${oldEvent ? "edited the" : "added a"} roomevent titled "${eventNameActual}".)`);
			this.modlog('ROOMEVENT', null, `${oldEvent ? "edited" : "added"} "${eventNameActual}"`);
			events[eventId] = {
				eventName: eventNameActual,
				date: dateActual,
				desc: descString,
				started: false,
				aliases: oldEvent?.aliases,
			};
			room.saveSettings();
		},

		rename(target, room, user) {
			if (!room.persist) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			let [oldName, newName] = target.split(target.includes('|') ? '|' : ',');
			if (!(oldName && newName)) return this.errorReply("Usage: /roomevents rename [old name], [new name]");

			newName = newName.trim();
			const newID = toID(newName);
			const oldID = (getAllAliases(room).includes(toID(oldName)) ? getEventID(oldName, room) : toID(oldName));
			if (newID === oldID) return this.errorReply("The new name must be different from the old one.");
			if (!newID) return this.errorReply("Event names must contain at least one alphanumeric character.");
			if (newName.length > 50) return this.errorReply("Event names should not exceed 50 characters.");

			const events = room.settings.events!;
			const eventData = events?.[oldID];
			if (!eventData) return this.errorReply(`There is no event titled "${oldName}".`);
			if (events[newID] || getAllAliases(room).includes(newID)) {
				return this.errorReply(`"${newName}" is already an event or alias.`);
			}
			const originalName = eventData.eventName;
			eventData.eventName = newName;
			events[newID] = eventData;
			delete events[oldID];

			this.privateModAction(`(${user.name} renamed the roomevent titled "${originalName}" to "${newName}".)`);
			this.modlog('ROOMEVENT', null, `renamed "${originalName}" to "${newName}"`);
			room.saveSettings();
		},

		begin: 'start',
		start(target, room, user) {
			if (!room.persist) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			if (!room.settings.events || !Object.keys(room.settings.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room to start.");
			}
			if (!target) return this.errorReply("Usage: /roomevents start [event name]");
			target = toID(target);
			const event = room.settings.events[getEventID(target, room)];
			if (!event) return this.errorReply(`There is no event titled '${target}'. Check spelling?`);
			if (event.started) {
				return this.errorReply(`The event ${event.eventName} has already started.`);
			}
			for (const u in room.users) {
				const activeUser = Users.get(u);
				if (activeUser?.connected) {
					activeUser.sendTo(
						room,
						Utils.html`|notify|A new roomevent in ${room.title} has started!|` +
						`The "${event.eventName}" roomevent has started!`
					);
				}
			}
			this.add(
				Utils.html`|raw|<div class="broadcast-blue"><b>The "${event.eventName}" roomevent has started!</b></div>`
			);
			this.modlog('ROOMEVENT', null, `started "${toID(event.eventName)}"`);
			event.started = true;
			room.saveSettings();
		},

		delete: 'remove',
		remove(target, room, user) {
			if (!room.persist) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			if (!room.settings.events || Object.keys(room.settings.events).length === 0) {
				return this.errorReply("There are currently no planned upcoming events for this room to remove.");
			}
			if (!target) return this.errorReply("Usage: /roomevents remove [event name]");
			target = toID(target);
			if (getAllAliases(room).includes(target)) return this.errorReply("To delete aliases, use /roomevents removealias.");
			if (!room.settings.events[target]) return this.errorReply(`There is no event titled '${target}'. Check spelling?`);
			delete room.settings.events[target];
			this.privateModAction(`(${user.name} removed a roomevent titled "${target}".)`);
			this.modlog('ROOMEVENT', null, `removed "${target}"`);
			room.saveSettings();
		},
		view(target, room, user) {
			if (!room.persist) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!room.settings.events || !Object.keys(room.settings.events).length) {
				return this.errorReply("There are currently no planned upcoming events for this room.");
			}

			if (!target) return this.errorReply("Usage: /roomevents view [event name]");
			target = toID(target);
			const event = room.settings.events[getEventID(target, room)];
			if (!event) return this.errorReply(`There is no event titled '${target}'. Check spelling?`);
			if (!this.runBroadcast()) return;
			const hasAliases = event.aliases && event.aliases.length > 0;
			const buff = `<table border="1" cellspacing="0" cellpadding="3">${formatEvent(event, hasAliases)}</table>`;
			this.sendReply(`|raw|<div class="infobox-limited">${buff}</div>`);
			if (!this.broadcasting && user.can('ban', null, room)) {
				this.sendReplyBox(
					Utils.html`<code>/roomevents add ${event.eventName} |` +
					Utils.html`${event.date} | ${event.desc}</code>`
				);
			}
		},
		alias: 'addalias',
		addalias(target, room, user) {
			if (!room.persist) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			const [alias, eventId] = target.split(target.includes('|') ? '|' : ',').map(argument => toID(argument));
			if (!(alias && eventId)) {
				return this.errorReply("Usage: /roomevents addalias [alias], [event name]. Aliases must contain at least one alphanumeric character.");
			}
			if (!room.settings.events || Object.keys(room.settings.events).length === 0) {
				return this.errorReply(`There are currently no scheduled events.`);
			}
			const event = room.settings.events[eventId];
			if (!event) return this.errorReply(`There is no event titled "${eventId}".`);

			if (getAllAliases(room).includes(alias) || room.settings.events[alias]) {
				return this.errorReply(`"${alias}" is already an event or an alias of an event.`);
			}
			if (!event.aliases) event.aliases = [];
			event.aliases.push(alias);
			this.privateModAction(`(${user.name} added an alias "${alias}" for the roomevent "${eventId}".)`);
			this.modlog('ROOMEVENT', null, `alias for "${eventId}": "${alias}"`);
			room.saveSettings();
		},
		deletealias: 'removealias',
		removealias(target, room, user) {
			if (!room.persist) return this.errorReply("This command is unavailable in temporary rooms.");
			if (!this.can('ban', null, room)) return false;
			target = toID(target);
			if (!target) return this.errorReply("Usage: /roomevents removealias <alias>");
			if (!getAllAliases(room).includes(target)) return this.errorReply(`${target} isn't an alias.`);

			const event = room.settings.events![getEventID(target, room)];
			if (event.aliases) {
				event.aliases = event.aliases.filter(alias => alias !== target);
				if (!event.aliases.length) event.aliases = undefined;
			}

			this.privateModAction(`(${user.name} removed the alias "${target}")`);
			this.modlog('ROOMEVENT', null, `removed the alias "${target}"`);
			room.saveSettings();
		},
		help(target, room, user) {
			return this.parse('/help roomevents');
		},
		sortby(target, room, user) {
			// preconditions
			if (!room.persist) return this.errorReply("This command is unavailable in temporary rooms.");
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

			// rebuild the room.events object
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
		`/roomevents add [event name] | [event date/time] | [event description] - Adds a room event. A timestamp in event date/time field like YYYY-MM-DD HH:MM±hh:mm will be displayed in user's timezone. Requires: @ # &`,
		`/roomevents start [event name] - Declares to the room that the event has started. Requires: @ # &`,
		`/roomevents remove [event name] - Deletes an event. Requires: @ # &`,
		`/roomevents rename [old event name] | [new name] - Renames an event. Requires: @ # &`,
		`/roomevents addalias [alias] | [event name] - Adds an alias for the event. Requires: @ # &`,
		`/roomevents removealias [alias] - Removes an event alias. Requires: @ # &`,
		`/roomevents sortby [column name] | [asc/desc (optional)] - Sorts events table by column name and an optional argument to ascending or descending order. Ascending order is default. Requires: @ # &`,
		`/roomevents view [event name] - Displays information about a specific event.`,
	],
};
