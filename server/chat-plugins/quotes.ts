import {FS, Utils} from '../../lib';

const STORAGE_PATH = 'config/chat-plugins/quotes.json';
const MAX_QUOTES = 300;

interface Quote {
	userid: string;
	quote: string;
	date: number;
}

const quotes: {[room: string]: Quote[]} = JSON.parse(FS(STORAGE_PATH).readIfExistsSync() || "{}");

// migrate quotes out of roomsettings
function convertOldQuotes() {
	for (const room of Rooms.rooms.values()) {
		// @ts-ignore
		if (room.settings.quotes) {
			// @ts-ignore
			quotes[room.roomid] = room.settings.quotes;
			// @ts-ignore
			delete room.settings.quotes;
			room.saveSettings();
			saveQuotes();
		}
	}
}

function saveQuotes() {
	FS(STORAGE_PATH).writeUpdate(() => JSON.stringify(quotes));
}

convertOldQuotes();

export const commands: Chat.ChatCommands = {
	randquote(target, room, user) {
		room = this.requireRoom();
		const roomQuotes = quotes[room.roomid];
		if (!roomQuotes?.length) return this.errorReply(`This room has no quotes.`);
		this.runBroadcast(true);
		const {quote, date, userid} = roomQuotes[Math.floor(Math.random() * roomQuotes.length)];
		const time = Chat.toTimestamp(new Date(date), {human: true});
		const attribution = toID(target) === 'showauthor' ? `<hr /><small>Added by ${userid} on ${time}</small>` : '';
		return this.sendReplyBox(`${Chat.getReadmoreBlock(quote)}${attribution}`);
	},
	randquotehelp: [`/randquote [showauthor] - Show a random quote from the room. Add 'showauthor' to see who added it and when.`],

	addquote: 'quote',
	quote(target, room, user) {
		room = this.requireRoom();
		if (!room.persist) {
			return this.errorReply("This command is unavailable in temporary rooms.");
		}
		target = target.trim();
		this.checkCan('mute', null, room);
		if (!target) {
			return this.parse(`/help quote`);
		}
		if (!quotes[room.roomid]) quotes[room.roomid] = [];

		const roomQuotes = quotes[room.roomid];
		if (this.filter(target) !== target) {
			return this.errorReply(`Invalid quote.`);
		}
		if (roomQuotes.filter(item => item.quote === target).length) {
			return this.errorReply(`"${target}" is already quoted in this room.`);
		}
		if (target.length > 8192) {
			return this.errorReply(`Your quote cannot exceed 8192 characters.`);
		}
		if (room.settings.isPrivate && roomQuotes.length >= MAX_QUOTES) {
			return this.errorReply(`This room already has ${MAX_QUOTES} quotes, which is the maximum for private rooms.`);
		}
		roomQuotes.push({userid: user.id, quote: target, date: Date.now()});
		saveQuotes();
		this.refreshPage(`quotes-${room.roomid}`);
		const collapsedQuote = target.replace(/\n/g, ' ');
		this.privateModAction(`${user.name} added a new quote: "${collapsedQuote}".`);
		return this.modlog(`ADDQUOTE`, null, collapsedQuote);
	},
	quotehelp: [`/quote [quote] - Adds [quote] to the room's quotes. Requires: % @ # &`],

	removequote(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);
		if (!quotes[room.roomid]?.length) return this.errorReply(`This room has no quotes.`);
		const index = parseInt(target.trim());
		if (isNaN(index)) {
			return this.errorReply(`Invalid index.`);
		}
		const roomQuotes = quotes[room.roomid];
		if (!roomQuotes[index - 1]) {
			return this.errorReply(`Quote not found.`);
		}
		const [removed] = roomQuotes.splice(index - 1, 1);
		const collapsedQuote = removed.quote.replace(/\n/g, ' ');
		this.privateModAction(`${user.name} removed quote indexed at ${index}: "${collapsedQuote}" (originally added by ${removed.userid}).`);
		this.modlog(`REMOVEQUOTE`, null, collapsedQuote);
		saveQuotes();
		this.refreshPage(`quotes-${room.roomid}`);
	},
	removequotehelp: [`/removequote [index] - Removes the quote from the room's quotes. Requires: % @ # &`],

	viewquote(target, room, user) {
		room = this.requireRoom();
		const roomQuotes = quotes[room.roomid];
		if (!roomQuotes?.length) return this.errorReply(`This room has no quotes.`);
		const [num, showAuthor] = Utils.splitFirst(target, ',');
		const index = parseInt(num) - 1;
		if (isNaN(index)) {
			return this.errorReply(`Invalid index.`);
		}
		if (!roomQuotes[index]) {
			return this.errorReply(`Quote not found.`);
		}
		this.runBroadcast(true);
		const {quote, date, userid} = roomQuotes[index];
		const time = Chat.toTimestamp(new Date(date), {human: true});
		const attribution = toID(showAuthor) === 'showauthor' ? `<hr /><small>Added by ${userid} on ${time}</small>` : '';
		return this.sendReplyBox(`${Chat.formatText(quote, false, true)}${attribution}`);
	},
	viewquotehelp: [
		`/viewquote [index][, params] - View the quote from the room's quotes.`,
		`If 'showauthor' is used for the [params] argument, it shows who added the quote and when.`,
		`Requires: % @ # &`,
	],

	viewquotes: 'quotes',
	quotes(target, room) {
		const targetRoom = target ? Rooms.search(target) : room;
		if (!targetRoom) return this.errorReply(`Invalid room.`);
		this.parse(`/join view-quotes-${targetRoom.roomid}`);
	},
	quoteshelp: [`/quotes [room] - Shows all quotes for [room]. Defaults the room the command is used in.`],
};

export const pages: Chat.PageTable = {
	quotes(args, user) {
		const room = this.requireRoom();
		this.title = `[Quotes]`;
		// allow it for users if they can access the room
		if (!room.checkModjoin(user)) {
			return this.errorReply(`Access denied.`);
		}
		let buffer = `<div class="pad">`;
		buffer += `<button style="float:right;" class="button" name="send" value="/join view-quotes-${room.roomid}"><i class="fa fa-refresh"></i> Refresh</button>`;

		const roomQuotes = quotes[room.roomid];
		if (!roomQuotes?.length) {
			return `${buffer}<h2>This room has no quotes.</h2></div>`;
		}

		buffer += Utils.html`<h2>Quotes for ${room.title} (${roomQuotes.length}):</h2>`;
		for (const [i, quoteObj] of roomQuotes.entries()) {
			const index = i + 1;
			const {quote, userid, date} = quoteObj;
			buffer += `<div class="infobox">#${index}: ${Chat.formatText(quote, false, true)}`;
			buffer += `<br /><hr /><small>Added by ${userid} on ${Chat.toTimestamp(new Date(date), {human: true})}</small>`;
			if (user.can('mute', null, room)) {
				buffer += ` <button class="button" name="send" value="/msgroom ${room.roomid},/removequote ${index}">Remove</button>`;
			}
			buffer += `</div>`;
		}
		buffer += `</div>`;
		return buffer;
	},
};

export const handlers: Chat.Handlers = {
	onRenameRoom(oldID, newID) {
		if (quotes[oldID]) {
			if (!quotes[newID]) quotes[newID] = [];
			quotes[newID].push(...quotes[oldID]);
			delete quotes[oldID];
			saveQuotes();
		}
	},
};
