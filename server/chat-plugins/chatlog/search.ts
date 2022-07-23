/**
 * Pokemon Showdown log searcher.
 * By Mia.
 * @author mia-pi-git
 */
import e from 'express';
import {FS, ripgrep, hasRipgrep, Utils} from '../../../lib';
import {LogViewer, LogReader} from './view';

const MAX_SEARCH_COUNT = 3000;
// saving this value just in case. but it's no longer needed.
// const MAX_MEMORY = 67108864;

interface ChatlogSearch {
	room: RoomID;
	date: string;
	searches: {term: string, exclude?: boolean}[];
	user?: ID;
	limit?: number;
}

export async function searchMonth(
	search: {
		room: RoomID,
		search: string,
		date: string,
		handler: (line: string, count: number) => void | false | Promise<void | false>,
	} & Partial<{sep: string | [string, string], args: string[]}>,
) {
	if (!hasRipgrep()) throw new Chat.ErrorMessage(`This feature is presently disabled.`);
	let i = 0;
	if (!search.args) search.args = [];
	const path = FS(`logs/chat/${search.room}/${search.date}`);

	const stream = ripgrep({
		pattern: search.search.replace(/\\/g, '\\\\'),
		path: path.path,
		separator: search.sep || '\n',
		engine: 'auto',
		args: search.args,
		handleError(e: any) {
			const messages: string[] = ['stdout maxBuffer', 'No such file or directory'];
			if (e.code !== 1 && !messages.some(m => e.message.includes(m))) {
				throw e;
			}
		},
	})!;

	for await (let chunk of stream) {
		if (!Array.isArray(chunk)) chunk = [chunk];
		for (const line of chunk) {
			i++;
			const result = await search.handler(line, i);
			if (result === false) {
				stream.end();
				break;
			}
		}
	}
}

export function constructRegex(search: ChatlogSearch) {
	let regex = '';
	if (search.user) {
		regex = `\\|c\\|.${[...search.user].join('[^a-zA-Z0-9]*')}[^a-zA-Z0-9]*\\|`; // search for user chat prefix first
	}
	const includes: string[] = [];
	const excludes: string[] = [];
	for (const {exclude, term} of search.searches) {
		(exclude ? excludes : includes).push(Utils.escapeRegex(term));
	}
	if (excludes.length) regex += `(?!.*(${excludes.join('|')}))`;
	if (includes.length) {
		if (!regex) {
			regex = `(${includes.map(f => `.*${f}.*`).join('|')})`;
		} else {
			regex += `(?=.*(${includes.join('|')}))`;
		}
	}``
	return regex;
}

export const commands: Chat.ChatCommands = {
	sl: 'searchlogs',
	logsearch: 'searchlogs',
	searchlog: 'searchlogs',
	searchlogs(target, room, user) {
		if (!toID(target)) {
			return this.parse(`/help searchlogs`);
		}
		const parts = target.split(',');
		let roomid: RoomID = '';
		let date = '';
		const parsed: string[] = [];
		for (const part of parts) {
			if (part.startsWith('room=')) {
				const name = part.slice('room='.length).trim();
				if (!name) {
					return this.errorReply(`Invalid room name: '${name}'`);
				}
				roomid = name as RoomID;
				continue;
			}
			if (part.startsWith('user=')) {
				const id = toID(part.slice('user='.length));
				if (!id) {
					return this.errorReply(`Invalid username: '${part.slice('user='.length)}'.`);
				}
				parsed.push(`user-${id}`);
				continue;
			}
			if (part.startsWith('date=')) {
				date = part.slice('date='.length);
				continue;
			}
			if (part.startsWith('!')) {
				parsed.push(`exclude-${part.slice(1)}`);
				continue;
			}
			if (part.startsWith('exclude=')) {
				parsed.push(`exclude-${part.slice('exclude='.length)}`);
				continue;
			}
			parsed.push(part);
		}
		if (!parsed.length) {
			this.errorReply(`You must specify parameters to search.`);
			return this.parse('/help searchlogs');
		}
		if (!date) {
			date = LogReader.getMonth();
		}
		if (!parsed.some(f => f.startsWith('limit='))) {
			parsed.push('limit-500');
		}
		if (!toID(roomid)) {
			if (!room) return this.errorReply(`Either use this command in a room, or specify a room to search.`);
			roomid = room.roomid;
		}
		return this.parse(`/join view-searchlog-${roomid}--${date}--${parsed.join('--')}`);
	},
	searchlogshelp() {
		return this.sendReplyBox(
			`<details class="readmore"><summary><code>/searchlogs [arguments]</code>: ` +
			`searches logs in the current room using the <code>[arguments]</code>.</summary>` +
			`A room can be specified using the argument <code>room=[roomid]</code>. Defaults to the room it is used in.<br />` +
			`A limit can be specified using the argument <code>limit=[number less than or equal to 3000]</code>. Defaults to 500.<br />` +
			`A date can be specified in ISO (YYYY-MM-DD) format using the argument <code>date=[month]</code> (for example, <code>date: 2020-05</code>). Defaults to searching all logs.<br />` +
			`If you provide a user argument in the form <code>user=username</code>, it will search for messages (that match the other arguments) only from that user.<br />` +
			`You can use the syntax <code>!term</code> or <code>exclude=term</code> to specify terms you do not want to see in results.<br />` +
			`For example, using <code>/sl !test</code> will ignore all lines that include the word <code>test</code><br />` +
			`All other arguments will be considered part of the search ` +
			`(if more than one argument is specified, it searches for lines containing all terms).<br />` +
			"Requires: % @ # &"
		);
	},
};

export const pages: Chat.PageTable = {
	async searchlog(args, user) {
		if (!user.trusted) {
			return this.errorReply(`Access denied.`);
		}
		const query = args.join('-').split('--');
		const search: Partial<ChatlogSearch> = {searches: []};
		const roomid = (query.shift() || "").toLowerCase().replace(/ /g, '') as RoomID;
		if (!roomid) {
			return this.errorReply(`Provide a room to search.`);
		}

		LogViewer.checkPermissions(roomid, this);

		if (!(await FS(`logs/chat/${roomid}`).exists())) {
			return this.errorReply(Utils.html`No logs for the room ${roomid} found.`);
		}
		search.room = roomid;
		let date = query.shift() || '';
		if (!date) {
			date = Chat.toTimestamp(new Date()).split(' ')[0].slice(0, -3);
		} else {
			if (!/^[0-9]{4}-[0-9]{2}$/.test(date)) {
				return this.errorReply(`Invalid date: '${date}'`);
			}
		}
		search.date = date;

		if (!(await FS(`logs/chat/${roomid}/${date}`).exists())) {
			return this.errorReply(`There are no logs for ${date} on ${roomid}.`);
		}
		let limit = MAX_SEARCH_COUNT;

		for (const arg of query) {
			const term: {term: string, exclude?: boolean} = {term: arg};
			if (arg.startsWith('limit-')) {
				const rawLimit = arg.slice('limit-'.length);
				const num = Number(rawLimit);
				if (isNaN(num)) {
					return this.errorReply(`Invalid limit provided: ${rawLimit}`);
				}
				if (num > MAX_SEARCH_COUNT) {
					return this.errorReply(`Limit must be below or equal to ${MAX_SEARCH_COUNT}.`);
				}
				limit = num;
				continue;
			}
			if (arg.startsWith('user-')) {
				const id = toID(arg.slice('user-'.length));
				if (!id) return this.errorReply(`Invalid userid given.`);
				search.user = id;
				continue;
			}
			if (arg.startsWith('exclude-')) {
				const exclude = arg.slice('exclude-'.length).trim();
				if (!exclude) return this.errorReply(`Invalid exclude parameter: ${arg}`);
				term.term = exclude;
				term.exclude = true;
			}
			if (!toID(term.term)) {
				continue;
			}
			search.searches!.push(term);
		}
		if (!search.user && !search.searches?.length) {
			return this.errorReply(
				`You must either search a username, provide terms to search for, or both.`
			);
		}

		let buf = `<div class="pad">`;
		buf += `<h2>Log search results on ${roomid}:</h2>`;
		buf += `Logs ${search.user ? `from the user '${search.user}'` : ""} `;

		let searchString = ``;
		const includes: string[] = [];
		const excludes: string[] = [];
		for (const term of search.searches!) {
			(term.exclude ? excludes : includes).push(Utils.escapeHTML(term.term));
		}
		if (includes.length) {
			searchString += `matching the term${includes.length > 1 ? 's' : ''} '${includes.join("', '")}'`;
		}
		if (excludes.length) {
			if (includes.length) searchString += ` and `;
			searchString += `not matching the term${excludes.length > 1 ? 's' : ''} '${excludes.join("', '")}'`;
		}
		searchString += `:`;

		this.title = `[Log Search] [${search.room}] ${includes} | ${excludes}`;

		buf += searchString;
		buf += `<br />`;
		buf += `Date: ${search.date}<br />`;
		buf += `Results: 0<br />`;
		buf += `<hr />`;
		const regexString = constructRegex(search as ChatlogSearch);
		const regex = new RegExp(regexString, 'i');

		let curDate: string | null = null;
		let count = 0;

		await searchMonth({
			room: search.room,
			date: search.date,
			search: regexString,
			args: ['-C', '2'],
			sep: `\n`,
			handler: (rawLine) => {
				const [name, text] = rawLine.split(rawLine.includes('.txt-') ? '.txt-' : '.txt:');
				let date = name.split('/').pop()!;
				let line = LogViewer.renderLine(text, 'all');
				if (!line || name.includes('today')) return;
				if (regex.test(text)) {
					// don't wanna increase until it's confirmed,
					// since we use it for a counter displayed to the user
					if ((count + 1) > limit) return false;
					count++;
					line = `<div class="chat chatmessage highlighted">${line}</div>`;
				}
				if (curDate !== date) {
					curDate = date;
					date = `</details><hr /><details open><summary>[<a href="view-chatlog-${roomid}--${date}">${date}</a>]</summary>`;
				} else {
					date = '';
				}
				buf += `${date} ${line}`;

				// dynamic updating!
				buf = buf.replace(/Results: ([0-9]+)<br \/>/, `Results: ${count}<br />`);
				this.setHTML(buf);
			},
		});
		return buf;
	},
};
