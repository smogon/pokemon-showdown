/**
 * PS Help room auto-response plugin.
 * Uses Regex to match room frequently asked question (RFAQ) entries,
 * and replies if a match is found.
 * Supports configuration, and works in all rooms, though intended mainly for Help.
 * Written by Mia.
 * @author mia-pi-git
 */

import {FS} from '../../lib/fs';
import {Utils} from '../../lib/utils';
import {LogViewer} from './chatlog';
import {roomFaqs} from './room-faqs';

const PATH = 'config/chat-plugins/responder.json';
// 4: filters out conveniently short aliases
const MINIMUM_LENGTH = 4;

export let answererData: {[roomid: string]: PluginData} = {};

try {
	answererData = JSON.parse(FS(PATH).readSync());
} catch (e) {}

/**
 * A message caught by the filter.
 */
interface LoggedMessage {
	/** Message that's matched by the filter. */
	message: string;
	/** The FAQ that it's matched to. */
	faqName: string;
	/** The regex that it's matched to. */
	regex: string;
}
/** Object of stats for that day. */
interface DayStats {
	matches?: LoggedMessage[];
	total?: number;
}

interface PluginData {
	/** Stats - filter match and faq that was matched - done day by day. */
	stats?: {[k: string]: DayStats};
	/** Word pairs that have been marked as a match for a specific FAQ. */
	pairs: {[k: string]: string[]};
	/** Common terms to be ignored in question parsing. */
	ignore?: string[];
}

export class AutoResponder {
	data: PluginData;
	room: Room;
	constructor(room: Room, data?: PluginData) {
		this.data = data || {pairs: {}, stats: {}};
		this.room = room;
	}
	find(question: string, user?: User) {
		// sanity slice, APPARENTLY people are dumb.
		question = question.slice(0, 300);
		const room = this.room;
		const helpFaqs = roomFaqs[room.roomid];
		if (!helpFaqs) return null;
		const normalized = Chat.normalize(question);
		if (this.data.ignore) {
			if (this.data.ignore.some(t => new RegExp(t, "i").test(normalized))) {
				return null;
			}
		}
		const faqs = Object.keys(helpFaqs)
			.filter(item => item.length >= MINIMUM_LENGTH && !helpFaqs[item].startsWith('>'));
		for (const faq of faqs) {
			const match = this.test(normalized, faq);
			if (match) {
				if (user) {
					const timestamp = Chat.toTimestamp(new Date()).split(' ')[1];
					const log = `${timestamp} |c| ${user.name}|${question}`;
					this.log(log, faq, match.regex);
				}
				return helpFaqs[match.faq];
			}
		}
		return null;
	}
	visualize(question: string, hideButton?: boolean, user?: User) {
		const response = this.find(question, user);
		if (response) {
			let buf = '';
			buf += Utils.html`<strong>You said:</strong> ${question}<br />`;
			buf += `<strong>Our automated reply:</strong> ${Chat.formatText(response)}`;
			if (!hideButton) {
				buf += Utils.html`<hr /><button class="button" name="send" value="A: ${question}">`;
				buf += `Send to ${this.room.title} if you weren't answered correctly. </button>`;
			}
			return buf;
		}
		return null;
	}
	getFaqID(faq?: string) {
		if (!faq) throw new Chat.ErrorMessage(`Your input must be in the format [input] => [faq].`);
		faq = faq.trim();
		if (!faq) throw new Chat.ErrorMessage(`Your FAQ ID can't be empty.`);
		const room = this.room;
		const entry: string = roomFaqs[room.roomid][faq];
		if (!entry) throw new Chat.ErrorMessage(`FAQ ID "${faq}" not found.`);

		if (!entry.startsWith('>')) return faq; // not an alias
		return entry.slice(1);
	}
	/**
	 * Checks if the FAQ exists. If not, deletes all references to it.
	 */
	updateFaqData(faq: string) {
		// testing purposes
		if (Config.nofswriting) return true;
		const room = this.room;
		if (!room) return;
		if (roomFaqs[room.roomid][faq]) return true;
		if (this.data.pairs[faq]) delete this.data.pairs[faq];
		return false;
	}
	stringRegex(str: string, raw?: boolean) {
		[str] = Utils.splitFirst(str, '=>');
		const args = str.split(',').map(item => item.trim());
		if (!raw && args.length > 10) {
			throw new Chat.ErrorMessage(`Too many arguments.`);
		}
		if (str.length > 300 && !raw) throw new Chat.ErrorMessage("Your given string is too long.");
		return args.map(item => {
			const split = item.split('&').map(string => {
				// allow raw regex for admins and users with @ in Dev
				if (raw) return string;
				// escape
				return string.replace(/[\\^$.*+?()[\]{}]/g, '\\$&').trim();
			});
			return split.map(term => {
				if (term.length > 100 && !raw) {
					throw new Chat.ErrorMessage(`One or more of your arguments is too long. Use less than 100 characters.`);
				}
				if (item.startsWith('|') || item.endsWith('|')) {
					throw new Chat.ErrorMessage(`Invalid use of |. Make sure you have an option on either side.`);
				}
				if (term.startsWith('!')) {
					return `^(?!.*${term.slice(1)})`;
				}
				if (!term.trim()) return null;
				return `(?=.*?(${term.trim()}))`;
			}).filter(Boolean).join('');
		}).filter(Boolean).join('');
	}
	test(question: string, faq: string) {
		if (!this.data.pairs[faq]) this.data.pairs[faq] = [];
		const regexes = this.data.pairs[faq].map(item => new RegExp(item, "i"));
		if (!regexes) return;
		for (const regex of regexes) {
			if (regex.test(question)) return {faq, regex: regex.toString()};
		}
		return;
	}
	log(entry: string, faq: string, expression: string) {
		if (!this.data.stats) this.data.stats = {};
		const [day] = Utils.splitFirst(Chat.toTimestamp(new Date), ' ');
		if (!this.data.stats[day]) this.data.stats[day] = {};
		const today = this.data.stats[day];
		const log: LoggedMessage = {
			message: entry,
			faqName: faq,
			regex: expression,
		};
		const stats = {
			matches: today.matches || [],
			total: today.matches ? today.matches.length : 0,
		};
		const dayLog = Object.assign(this.data.stats[day], stats);
		dayLog.matches.push(log);
		dayLog.total++;
		return this.writeState();
	}
	writeState() {
		for (const faq in this.data.pairs) {
			// while writing, clear old data. In the meantime, the rest of the data is inaccessible
			// so this is the best place to clear the data
			this.updateFaqData(faq);
		}
		answererData[this.room.roomid] = this.data;
		return FS(PATH).writeUpdate(() => JSON.stringify(answererData));
	}
	tryAddRegex(inputString: string, raw?: boolean) {
		let [args, faq] = inputString.split('=>').map(item => item.trim()) as [string, string | undefined];
		faq = this.getFaqID(toID(faq));
		if (!this.data.pairs) this.data.pairs = {};
		if (!this.data.pairs[faq]) this.data.pairs[faq] = [];
		const regex = raw ? args.trim() : this.stringRegex(args, raw);
		if (this.data.pairs[faq].includes(regex)) {
			throw new Chat.ErrorMessage(`That regex is already stored.`);
		}
		Chat.validateRegex(regex);
		this.data.pairs[faq].push(regex);
		return this.writeState();
	}
	tryRemoveRegex(faq: string, index: number) {
		faq = this.getFaqID(faq);
		if (!this.data.pairs) this.data.pairs = {};
		if (!this.data.pairs[faq]) throw new Chat.ErrorMessage(`There are no regexes for ${faq}.`);
		if (!this.data.pairs[faq][index]) throw new Chat.ErrorMessage("Your provided index is invalid.");
		this.data.pairs[faq].splice(index, 1);
		this.writeState();
		return true;
	}
	static canOverride(user: User, room: Room) {
		const devAuth = Rooms.get('development')?.auth;
		return (
			devAuth?.atLeast(user, '%') && devAuth?.has(user.id) &&
			room.auth.has(user.id) && room.auth.atLeast(user, '@') ||
			user.can('rangeban')
		);
	}
	destroy() {
		this.writeState();
		this.room.responder = null;
		// @ts-ignore deallocating
		this.room = null;
	}
	ignore(terms: string[], context: CommandContext) {
		const filtered = terms.map(t => context.filter(t)).filter(Boolean);
		if (filtered.length !== terms.length) {
			throw new Chat.ErrorMessage(`Invalid terms.`);
		}
		if (terms.some(t => t.length > 300)) {
			throw new Chat.ErrorMessage(`One of your terms is too long.`);
		}
		if (!this.data.ignore) this.data.ignore = [];
		this.data.ignore.push(...terms);
		this.writeState();
		return terms;
	}
	unignore(terms: string[]) {
		if (!this.data.ignore) {
			throw new Chat.ErrorMessage(`The autoresponse filter in this room has no ignored terms.`);
		}
		this.data.ignore = this.data.ignore.filter(item => !terms.includes(item));
		this.writeState();
		return true;
	}
}

// update all responders
for (const room of Rooms.rooms.values()) {
	room.responder?.destroy();
	if (answererData[room.roomid]) {
		room.responder = new AutoResponder(room, answererData[room.roomid]);
	}
}

const BYPASS_TERMS = ['a:', 'A:', '!', '/'];

export const chatfilter: ChatFilter = function (message, user, room) {
	if (BYPASS_TERMS.some(t => message.startsWith(t))) {
		// do not return `message` or it will bypass all filters
		// including super important filters like against `/html`
		return;
	}
	if (room?.responder && room.auth.get(user.id) === ' ') {
		const responder = room.responder;
		const reply = responder.visualize(message, false, user);
		if (!reply) {
			return message;
		} else {
			user.sendTo(room.roomid, `|uhtml|askhelp-${user}-${toID(message)}|<div class="infobox">${reply}</div>`);
			const trimmedMessage = `<div class="infobox">${responder.visualize(message, true)}</div>`;
			setTimeout(() => {
				user.sendTo(
					room.roomid,
					`|c| ${user.name}|/uhtmlchange askhelp-${user}-${toID(message)}, ${trimmedMessage}`
				);
			}, 10 * 1000);
			return false;
		}
	}
};

export const commands: ChatCommands = {
	question(target, room, user) {
		room = this.requireRoom();
		const responder = room.responder;
		if (!responder) return this.errorReply(`This room does not have an autoresponder configured.`);
		if (!target) return this.parse("/help question");
		const reply = responder.visualize(target, true);
		if (!reply) return this.sendReplyBox(`No answer found.`);
		this.runBroadcast();
		this.sendReplyBox(reply);
	},
	questionhelp: ["/question [question] - Asks the current room's auto-response filter a question."],

	ar: 'autoresponder',
	autoresponder: {
		''(target, room) {
			room = this.requireRoom();
			const responder = room.responder;
			if (!responder) {
				return this.errorReply(`This room has not configured an autoresponder.`);
			}
			if (!target) {
				return this.parse('/help autoresponder');
			}
			return this.parse(`/j view-autoresponder-${room.roomid}-${target}`);
		},
		view(target, room, user) {
			room = this.requireRoom();
			return this.parse(`/join view-autoresponder-${room.roomid}-${target}`);
		},
		toggle(target, room, user) {
			room = this.requireRoom();
			if (!target) {
				return this.sendReply(
					`The Help auto-response filter is currently set to: ${room.responder ? 'ON' : "OFF"}`
				);
			}
			this.checkCan('ban', null, room);
			if (room.settings.isPrivate === true) {
				return this.errorReply(`Secret rooms cannot enable an autoresponder.`);
			}
			if (this.meansYes(target)) {
				if (room.responder) return this.errorReply(`The Autoresponder for this room is already enabled.`);
				room.responder = new AutoResponder(room, answererData[room.roomid]);
				room.responder.writeState();
			}
			if (this.meansNo(target)) {
				if (!room.responder) return this.errorReply(`The Autoresponder for this room is already disabled.`);
				room.responder.destroy();
			}
			this.privateModAction(`${user.name} ${!room.responder ? 'disabled' : 'enabled'} the auto-response filter.`);
			this.modlog(`AUTOFILTER`, null, !room.responder ? 'OFF' : 'ON');
		},
		forceadd: 'add',
		add(target, room, user, connection, cmd) {
			room = this.requireRoom();
			if (!room.responder) {
				return this.errorReply(`This room has not configured an auto-response filter.`);
			}
			const force = cmd === 'forceadd';
			if (force && !AutoResponder.canOverride(user, room)) {
				return this.errorReply(`You cannot use raw regex - use /autoresponder add instead.`);
			}
			this.checkCan('ban', null, room);
			room.responder.tryAddRegex(target, force);
			this.privateModAction(`${user.name} added regex for "${target.split('=>')[0]}" to the autoresponder.`);
			this.modlog(`AUTOFILTER ADD`, null, target);
		},
		remove(target, room, user) {
			const [faq, index, id] = target.split(',');
			if (id) {
				const targetRoom = Rooms.search(id);
				if (!targetRoom) {
					return this.errorReply(`Room not found.`);
				}
				room = targetRoom;
			} else {
				room = this.requireRoom();
			}
			if (!room.responder) {
				return this.errorReply(`${room.title} has not configured an auto-response filter.`);
			}
			this.checkCan('ban', null, room);
			// intended for use mainly within the page, so supports being used in all rooms
			this.room = room;
			const num = parseInt(index);
			if (isNaN(num)) return this.errorReply("Invalid index.");
			room.responder.tryRemoveRegex(faq, num - 1);
			this.privateModAction(`${user.name} removed regex ${num} from the usable regexes for ${faq}.`);
			this.modlog('AUTOFILTER REMOVE', null, index);
			const pages = [`keys`, `pairs`];
			if (pages.some(p => this.connection.openPages?.has(`autoresponder-${room?.roomid}-${p}`))) {
				return this.parse(`/ar view keys`);
			}
		},
		ignore(target, room, user) {
			room = this.requireRoom();
			if (!room.responder) {
				return this.errorReply(`This room has not configured an auto-response filter.`);
			}
			this.checkCan('ban', null, room);
			if (!toID(target)) {
				return this.parse(`/help autoresponder`);
			}
			const targets = target.split(',');
			room.responder.ignore(targets, this);
			this.privateModAction(
				`${user.name} added ${Chat.count(targets.length, "terms")} to the autoresponder ignore list.`
			);
			this.modlog(`AUTOFILTER IGNORE`, null, target);
		},
		unignore(target, room, user) {
			let targetId;
			[target, targetId] = Utils.splitFirst(target, '|');
			if (targetId) {
				const targetRoom = Rooms.search(targetId);
				if (!targetRoom) return this.errorReply(`Invalid room.`);
				room = targetRoom;
				this.room = room;
			}
			room = this.requireRoom();
			if (!room.responder) {
				return this.errorReply(`${room.title} has not configured an auto-response filter.`);
			}
			this.checkCan('ban', null, room);
			if (!toID(target)) {
				return this.parse(`/help autoresponder`);
			}
			const targets = target.split(',');
			room.responder.unignore(targets);
			this.privateModAction(`${user.name} removed ${Chat.count(targets.length, "terms")} from the autoresponder ignore list.`);
			this.modlog(`AUTOFILTER UNIGNORE`, null, target);
			if (this.connection.openPages?.has(`autoresponder-${room.roomid}-ignore`)) {
				return this.parse(`/join view-autoresponder-${room.roomid}-ignore`);
			}
		},
	},
	autoresponderhelp() {
		const help = [
			`<code>/autoresponder view [page]</code> - Views the Autoresponder page [page]. (options: keys, stats)`,
			`<code>/autoresponder toggle [on | off]</code> - Enables or disables the Autoresponder for the current room. Requires: @ # &`,
			`<code>/autoresponder add [input] => [faq]</code> - Adds regex made from the input string to the current room's Autoresponder, to respond with [faq] to matches.`,
			`<code>/autoresponder remove [faq], [regex index]</code> - removes the regex matching the [index] from the current room's responses for [faq].`,
			`Indexes can be found in /autoresponder keys.`,
			`Requires: @ # &`,
		];
		return this.sendReplyBox(help.join('<br/ >'));
	},
};

export const pages: PageTable = {
	autoresponder(args, user) {
		const room = this.requireRoom();
		if (!room.responder) {
			return this.errorReply(`${room.title} does not have a configured autoresponder.`);
		}
		args.shift();
		const roomData = answererData[room.roomid];
		const canChange = user.can('ban', null, room);
		let buf = '';
		const refresh = (type: string, extra?: string[]) => {
			if (extra) extra = extra.filter(Boolean);
			let button = `<button class="button" name="send" value="/join view-autoresponder-${room.roomid}-${type}`;
			button += `${extra?.length ? `-${extra.join('-')}` : ''}" style="float: right">`;
			button += `<i class="fa fa-refresh"></i> Refresh</button><br />`;
			return button;
		};
		const back = `<br /><a roomid="view-autoresponder-${room.roomid}">Back to all</a>`;
		switch (args[0]) {
		case 'stats':
			args.shift();
			this.checkCan('mute', null, room);
			const date = args.join('-') || '';
			if (!!date && isNaN(new Date(date).getTime())) {
				return `<h2>Invalid date.</h2>`;
			}
			buf = `<div class="pad"><strong>Stats for the ${room.title} auto-response filter${date ? ` on ${date}` : ''}.</strong>`;
			buf += `${back}${refresh('stats', [date])}<hr />`;
			const stats = roomData.stats;
			if (!stats) return `<h2>No stats.</h2>`;
			this.title = `[Autoresponder Stats] ${date ? date : ''}`;
			if (date) {
				if (!stats[date]) return `<h2>No stats for ${date}.</h2>`;
				buf += `<strong>Total messages answered: ${stats[date].total}</strong><hr />`;
				buf += `<details><summary>All messages and the corresponding answers (FAQs):</summary>`;
				if (!stats[date].matches) return `<h2>No logs.</h2>`;
				for (const entry of stats[date].matches!) {
					buf += `<small>Message:</small>${LogViewer.renderLine(entry.message)}`;
					buf += `<small>FAQ: ${entry.faqName}</small><br />`;
					buf += `<small>Regex: <code>${entry.regex}</code></small> <hr />`;
				}
				return LogViewer.linkify(buf);
			}
			buf += `<strong> No date specified.<br />`;
			let total = 0;
			const days: string[] = [];
			for (const key of Object.keys(stats).reverse()) {
				total += stats[key].total || 0;
				days.push(`- <a roomid="view-autoresponder-${room.roomid}-stats-${key}">${key}</a> (${stats[key].total})`);
			}
			buf += `Dates with stats:</strong> <br /><small>(total matches: ${total})</small><br />`;
			buf += days.join('<br />');
			break;
		case 'pairs':
		case 'keys':
			this.title = '[Autoresponder Regexes]';
			this.checkCan('show', null, room);
			buf = `<div class="pad"><h2>${room.title} responder regexes and responses:</h2>${back}${refresh('keys')}<hr />`;
			buf += Object.keys(roomData.pairs).map(item => {
				const regexes = roomData.pairs[item];
				if (regexes.length < 1) return null;
				let buffer = `<details><summary>${item}</summary>`;
				buffer += `<div class="ladder pad"><table><tr><th>Index</th><th>Regex</th>`;
				if (canChange) buffer += `<th>Options</th>`;
				buffer += `</tr>`;
				for (const regex of regexes) {
					const index = regexes.indexOf(regex) + 1;
					const button = `<button class="button" name="send"value="/ar remove ${item}, ${index}, ${room.roomid}">Remove</button>`;
					buffer += `<tr><td>${index}</td><td><code>${regex}</code></td>`;
					if (canChange) buffer += `<td>${button}</td></tr>`;
				}
				buffer += `</details>`;
				return buffer;
			}).filter(Boolean).join('<hr />');
			break;
		case 'ignore':
			this.title = `[${room.title} Autoresponder ignore list]`;
			buf = `<div class="pad"><h2>${room.title} responder terms to ignore:</h2>${back}${refresh('ignore')}<hr />`;
			if (!roomData.ignore) {
				return this.errorReply(`No terms on ignore list.`);
			}
			for (const term of roomData.ignore) {
				buf += `- ${term} <button class="button" name="send"value="/ar unignore ${term}|${room.roomid}">Remove</button><br />`;
			}
			buf += `</div>`;
			break;
		default:
			this.title = `[${room.title} Autoresponder]`;
			buf = `<div class="pad"><h2>Specify a filter page to view.</h2>`;
			buf += `<hr /><strong>Options:</strong><hr />`;
			buf += `<a roomid="view-autoresponder-${room.roomid}-stats">Stats</a><hr />`;
			buf += `<a roomid="view-autoresponder-${room.roomid}-keys">Regex keys</a><hr/>`;
			buf += `<a roomid="view-autoresponder-${room.roomid}-ignore">Ignore list</a><hr/>`;
			buf += `</div>`;
		}
		return LogViewer.linkify(buf);
	},
};
