/**
 * PS Help room auto-response plugin.
 * Uses Regex to match room frequently asked question (RFAQ) entries,
 * and replies if a match is found.
 * Supports configuration.
 * Written by mia-pi.
 */

import {FS} from '../../lib/fs';
import {Utils} from '../../lib/utils';
import {LogViewer} from './chatlog';
import {ROOMFAQ_FILE} from './room-faqs';
const PATH = 'config/chat-plugins/help.json';
const MINIMUM_LENGTH = 7;
const helpRoom = Rooms.get('help');
const REGEX_WHITELIST = ['miapi', 'annika', 'kris'];

export let helpData: PluginData;

try {
	helpData = JSON.parse(FS(PATH).readIfExistsSync() || "{}");
} catch (e) {
	helpData = {
		stats: {},
		pairs: {},
		disabled: false,
		queue: [],
	};
}
/**
 * Terms commonly used in helping that should be ignored
 * within question parsing (the Help#find function).
 * */
const COMMON_TERMS = [
	'<<(.+)>>', '(do|use|type)( |)(``|)(/|!|//)(.+)(``|)', 'go to', '/rfaq (.+)', 'you can', Chat.linkRegex, 'click',
	'need to',
].map(item => new RegExp(item, "i"));

/**
 * A message filtered by the Help filter.
 */
interface LoggedMessage {
	/** Message that's matched by the Help filter. */
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
	/** Whether or not the filter is disabled. */
	disabled?: boolean;
	/** Queue of suggested regex. */
	queue?: string[];
}

export class HelpAnswerer {
	roomFaqs: AnyObject;
	disabled?: boolean;
	queue: string[];
	data: PluginData;
	constructor(data: PluginData) {
		this.data = data;
		this.roomFaqs = this.loadFaqs();
		this.queue = data.queue ? data.queue : [];

		FS(ROOMFAQ_FILE).onModify(() => {
			// refresh on modifications to keep it up to date
			this.roomFaqs = this.loadFaqs();
		});
	}
	find(question: string, user?: User) {
		const faqs: string[] = Object.keys((this.roomFaqs || '{}'))
			.filter(item => item.length >= 6 && !this.roomFaqs[item].startsWith('>'));
		for (const term of COMMON_TERMS) {
			if (term.test(question)) return null;
		}
		for (const faq of faqs) {
			const match = this.match(question, faq);
			if (match) {
				if (user) {
					const timestamp = Chat.toTimestamp(new Date()).split(' ')[1];
					const log = `${timestamp} |c| ${user.name}|${question}`;
					this.log(log, faq, match.regex);
				}
				return this.roomFaqs[match.faq];
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
				buf += `Send to the Help room if you weren't answered correctly or wanted to help </button>`;
			}
			return buf;
		}
		return null;
	}
	getFaqID(faq: string) {
		faq = faq.trim();
		if (!faq) return;
		const alias: string = this.roomFaqs[faq];
		if (!alias) return;
		// ignore short aliases, they cause too many false positives
		if (faq.length < MINIMUM_LENGTH || alias.length < MINIMUM_LENGTH) return;
		if (alias.charAt(0) !== '>') return faq; // not an alias
		return alias.replace('>', '');
	}
	stringRegex(str: string, raw?: boolean) {
		str = str.split('=>')[0];
		const args = str.split(',').map(item => item.trim());
		return args.map(item => {
			const split = item.split('&').map(string => {
				// allow raw regex for admins and whitelisted users
				if (raw) return string.trim();
				// escape otherwise
				return string.replace(/[\\^$.*+?()[\]{}]/g, '\\$&').trim();
			});
			return split.map(term => {
				if (term.startsWith('!')) {
					return `^(?!.*${term.slice(1)})`;
				}
				if (!term.trim()) return null;
				return `(?=.*?(${term.trim()}))`;
			}).filter(Boolean).join('');
		}).filter(Boolean).join('');
	}
	validateRegex(regex: string) {
		try {
			new RegExp(regex).test('');
		} catch (e) {
			if (e.message.includes("regular expression")) throw new Chat.ErrorMessage(e.message);
			throw e;
		}
		return true;
	}
	match(question: string, faq: string) {
		const regexes = this.data.pairs[faq];
		if (!regexes) return;
		for (const regex of regexes) {
			const regexString = new RegExp(regex, "i");
			if (regexString.test(Chat.normalize(question))) return {faq, regex};
		}
		return;
	}
	log(entry: string, faq: string, expression: string) {
		if (!this.data.stats) this.data.stats = {};
		const day = Chat.toTimestamp(new Date).split(' ')[0];
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
		return FS(PATH).writeUpdate(() => JSON.stringify(this.data));
	}
	loadFaqs() {
		this.roomFaqs = JSON.parse(FS(ROOMFAQ_FILE).readIfExistsSync() || `{"help":{}}`).help;
		for (const key in this.data.pairs) {
			if (!this.roomFaqs[key]) delete this.data.pairs[key];
		}
		this.writeState();
		return this.roomFaqs;
	}
	tryAddRegex(inputString: string, raw?: boolean) {
		let [args, faq] = inputString.split('=>');
		faq = this.getFaqID(toID(faq)) as string;
		if (!faq) throw new Chat.ErrorMessage("Invalid FAQ.");
		if (!this.data.pairs) this.data.pairs = {};
		if (!this.data.pairs[faq]) this.data.pairs[faq] = [];
		const regex = raw ? args.trim() : this.stringRegex(args, raw);
		if (this.data.pairs[faq].includes(regex)) {
			throw new Chat.ErrorMessage(`That regex is already stored.`);
		}
		this.validateRegex(regex);
		this.data.pairs[faq].push(regex);
		return this.writeState();
	}
	tryRemoveRegex(faq: string, index: number) {
		faq = this.getFaqID(faq) as string;
		if (!faq) throw new Chat.ErrorMessage("Invalid FAQ.");
		if (!this.data.pairs) this.data.pairs = {};
		if (!this.data.pairs[faq]) throw new Chat.ErrorMessage(`There are no regexes for ${faq}.`);
		if (!this.data.pairs[faq][index]) throw new Chat.ErrorMessage("Your provided index is invalid.");
		this.data.pairs[faq].splice(index, 1);
		this.writeState();
		return true;
	}
}

export const Answerer = new HelpAnswerer(helpData);

export const chatfilter: ChatFilter = (message, user, room) => {
	if (!helpRoom) return message;
	if (room?.roomid === helpRoom.roomid && helpRoom.auth.get(user.id) === ' ' && !Answerer.disabled) {
		const reply = Answerer.visualize(message, false, user);
		if (message.startsWith('/') || message.startsWith('!')) return message;
		if (!reply) {
			return message;
		} else {
			if (message.startsWith('a:') || message.startsWith('A:')) return message.replace(/(a|A):/, '');
			user.sendTo(room.roomid, `|uhtml|askhelp-${user}-${toID(message)}|<div class="infobox">${reply}</div>`);
			const trimmedMessage = `<div class="infobox">${Answerer.visualize(message, true)}</div>`;
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
		if (!helpRoom) return this.errorReply(`There is no room configured for use of the Help filter.`);
		if (!target) return this.parse("/help question");
		const reply = Answerer.visualize(target, true);
		if (!reply) return this.sendReplyBox(`No answer found.`);
		this.runBroadcast();
		this.sendReplyBox(reply);
	},
	questionhelp: ["/question [question] - Asks the Help room auto-response plugin a question."],

	hf: 'helpfilter',
	helpfilter: {
		''(target) {
			if (!helpRoom) return this.errorReply(`There is no room configured for use of the Help filter.`);
			if (!target) {
				this.parse('/help helpfilter');
				return this.sendReply(`The Help auto-response filter is currently set to: ${Answerer.disabled ? 'OFF' : "ON"}`);
			}
			return this.parse(`/j view-helpfilter-${target}`);
		},
		view(target, room, user) {
			return this.parse(`/join view-helpfilter-${target}`);
		},
		toggle(target, room, user) {
			if (!room) return this.requiresRoom();
			if (!helpRoom) return this.errorReply(`There is no room configured for use of this filter.`);
			if (room.roomid !== helpRoom.roomid) return this.errorReply(`This command is only available in the Help room.`);
			if (!target) {
				return this.sendReply(`The Help auto-response filter is currently set to: ${Answerer.disabled ? 'OFF' : "ON"}`);
			}
			if (!this.can('ban', null, room)) return false;
			if (this.meansYes(target)) {
				if (!Answerer.disabled) return this.errorReply(`The Help auto-response filter is already enabled.`);
				Answerer.disabled = false;
			}
			if (this.meansNo(target)) {
				if (Answerer.disabled) return this.errorReply(`The Help auto-response filter is already disabled.`);
				Answerer.disabled = true;
			}
			Answerer.writeState();
			this.privateModAction(`(${user.name} ${Answerer.disabled ? 'disabled' : 'enabled'} the Help auto-response filter.)`);
			this.modlog(`HELPFILTER`, null, Answerer.disabled ? 'OFF' : 'ON');
		},
		forceadd: 'add',
		add(target, room, user, connection, cmd) {
			if (!room) return this.requiresRoom();
			if (!helpRoom) return this.errorReply(`There is no room configured for use of this filter.`);
			if (room.roomid !== helpRoom.roomid) return this.errorReply(`This command is only available in the Help room.`);
			const force = cmd === 'forceadd';
			if (force && (!REGEX_WHITELIST.includes(user.id) && !user.can('rangeban'))) {
				return this.errorReply(`You cannot use raw regex - use /helpfilter add instead.`);
			}
			if (!this.can('ban', null, helpRoom)) return false;
			Answerer.tryAddRegex(target, force);
			this.privateModAction(`${user.name} added regex for "${target.split('=>')[0]}" to the filter.`);
			this.modlog(`HELPFILTER ADD`, null, target);
		},
		remove(target, room, user) {
			if (!helpRoom) return this.errorReply(`There is no room configured for use of this filter.`);
			if (!this.can('ban', null, helpRoom)) return false;
			const [faq, index] = target.split(',');
			// intended for use mainly within the page, so supports being used in all rooms
			this.room = helpRoom;
			const num = parseInt(index);
			if (isNaN(num)) return this.errorReply("Invalid index.");
			Answerer.tryRemoveRegex(faq, num - 1);
			this.privateModAction(`${user.name} removed regex ${num} from the usable regexes for ${faq}.`);
			this.modlog('HELPFILTER REMOVE', null, index);
		},
		queue(target, room, user) {
			if (!room) return this.requiresRoom();
			if (!helpRoom) return this.errorReply(`There is no room configured for use of this filter.`);
			if (room.roomid !== helpRoom.roomid) return this.errorReply(`This command is only available in the Help room.`);
			if (!this.can('show', null, helpRoom)) return false;
			if (!room.auth.has(user.id)) return this.errorReply(`Only roomauth can submit regexes to the filter.`);
			if (!target) return this.errorReply(`Specify regex.`);
			const faq = Answerer.getFaqID(target.split('=>')[1]);
			if (!faq) return this.errorReply(`Invalid FAQ.`);
			const regex = Answerer.stringRegex(target);
			if (Answerer.queue.includes(target)) {
				return this.errorReply(`That regex string is already in queue.`);
			}
			Answerer.validateRegex(regex);
			Answerer.queue.push(target);
			Answerer.writeState();
			return this.sendReply(`Added "${target}" to the regex suggestion queue.`);
		},
		approve(target, room, user) {
			if (!helpRoom) return this.errorReply(`There is no room configured for use of this filter.`);
			if (!this.can('ban', null, helpRoom)) return false;
			// intended for use mainly within the page, so supports being used in all rooms
			this.room = helpRoom;
			const index = parseInt(target) - 1;
			if (isNaN(index)) return this.errorReply(`Invalid queue index.`);
			const str = Answerer.queue[index];
			if (!str) return this.errorReply(`Item does not exist in queue.`);
			const regex = Answerer.stringRegex(str);
			// validated on submission
			const faq = Answerer.getFaqID(str.split('=>')[1].trim());
			if (!faq) return this.errorReply(`Invalid FAQ.`);
			if (!Answerer.data.pairs[faq]) helpData.pairs[faq] = [];
			Answerer.data.pairs[faq].push(regex);
			Answerer.queue.splice(index, 1);
			Answerer.writeState();

			this.privateModAction(`${user.name} approved regex for use with queue number ${target}`);
			this.modlog(`HELPFILTER APPROVE`, null, `${target}: ${str}`);
		},
		deny(target, room, user) {
			if (!helpRoom) return this.errorReply(`There is no room configured for use of this filter.`);
			if (!this.can('ban', null, helpRoom)) return false;
			// intended for use mainly within the page, so supports being used in all rooms
			this.room = helpRoom;
			target = target.trim();
			const index = parseInt(target) - 1;
			if (isNaN(index)) return this.errorReply(`Invalid queue index.`);
			if (!Answerer.queue[index]) throw new Chat.ErrorMessage(`Item does not exist in queue.`);
			Answerer.queue.splice(index, 1);
			Answerer.writeState();
			this.privateModAction(`${user.name} denied regex with queue number ${target}`);
			this.modlog(`HELPFILTER DENY`, null, `${target}`);
		},
	},
	helpfilterhelp() {
		const help = [
			`<code>/helpfilter stats</code> - Shows stats for the Help filter (matched lines and the FAQs that match them.)`,
			`<code>/helpfilter keys</code> - View regex keys for the Help filter.`,
			`<code>/helpfilter toggle [on | off]</code> - Enables or disables the Help filter. Requires: @ # &`,
			`<code>/helpfilter add [input] => [faq]</code> - Adds regex made from the input string to the Help filter, to respond with [faq] to matches.`,
			`<code>/helpfilter remove [faq], [regex index]</code> - removes the regex matching the [index] from the Help filter's responses for [faq].`,
			`<code>/helpfilter queue [regex] => [faq]</code> - Adds [regex] for [faq] to the queue for Help staff to review.`,
			`<code>/helpfilter approve [index]</code> - Approves the regex at position [index] in the queue for use in the Help filter.`,
			`<code>/helpfilter deny [index]</code> - Denies the regex at position [index] in the Help filter queue.`,
			`Indexes can be found in /helpfilter keys.`,
			`Requires: @ # &`,
		];
		return this.sendReplyBox(help.join('<br/ >'));
	},
};

export const pages: PageTable = {
	helpfilter(args, user) {
		if (!helpRoom) return `<h2>There is no room configured to use the help filter.</h2>`;
		const canChange = helpRoom.auth.atLeast(user, '@');
		let buf = '';
		const refresh = (type: string, extra?: string[]) => {
			let button = `<button class="button" name="send" value="/join view-helpfilter-${type}`;
			button += `${extra ? `-${extra.join('-')}` : ''}" style="float: right">`;
			button += `<i class="fa fa-refresh"></i> Refresh</button><br />`;
			return button;
		};
		const back = `<br /><a roomid="view-helpfilter-">Back to all</a>`;
		switch (args[0]) {
		case 'stats':
			args.shift();
			if (!this.can('mute', null, helpRoom)) return;
			const date = args.join('-') || '';
			if (!!date && isNaN(new Date(date).getTime())) {
				return `<h2>Invalid date.</h2>`;
			}
			buf = `<div class="pad"><strong>Stats for the Help auto-response filter${date ? ` on ${date}` : ''}.</strong>`;
			buf += `${back}${refresh('stats', [date])}<hr />`;
			const stats = helpData.stats;
			if (!stats) return `<h2>No stats.</h2>`;
			this.title = `[Help Stats] ${date ? date : ''}`;
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
			buf += `Dates with stats:</strong><br />`;
			for (const key in stats) {
				buf += `- <a roomid="view-helpfilter-stats-${key}">${key}</a> (${stats[key].total})<br />`;
			}
			break;
		case 'keys':
			this.title = '[Help Regexes]';
			if (!this.can('show', null, helpRoom)) return;
			buf = `<div class="pad"><h2>Help filter regexes and responses:</h2>${back}${refresh('keys')}<hr />`;
			buf += Object.keys(helpData.pairs).map(item => {
				const regexes = helpData.pairs[item];
				if (regexes.length < 1) return null;
				let buffer = `<details><summary>${item}</summary>`;
				for (const regex of regexes) {
					const index = regexes.indexOf(regex) + 1;
					const button = `<button class="button" name="send"value="/hf remove ${item}, ${index}">Remove</button>`;
					if (canChange) buffer += `- <small><code>${regex}</code> ${button} (index ${index})</small><br />`;
				}
				buffer += `</details>`;
				return buffer;
			}).filter(Boolean).join('<hr />');
			break;
		case 'queue':
			this.title = `[Help Queue]`;
			if (!this.can('show', null, helpRoom)) return;
			buf = `<div class="pad"><h2>`;
			buf += `${Answerer.queue.length > 0 ? 'R' : 'No r'}egexes queued for review.</h2>${back}${refresh('queue')}`;
			if (!helpData.queue) helpData.queue = [];
			for (const request of helpData.queue) {
				const faq = request.split('=>')[1];
				buf += `<hr /><strong>FAQ: ${faq}</strong><hr />`;
				buf += `Input: ${request}<br />`;
				buf += `Full regex: <code>${Answerer.stringRegex(request)}</code>`;
				const index = helpData.queue.indexOf(request) + 1;
				if (canChange) {
					buf += `<br /><button class="button" name="send"value="/hf approve ${index}">Approve</button>`;
					buf += `<button class="button" name="send"value="/hf deny ${index}">Deny</button>`;
				}
				buf += `<hr /><br />`;
			}
			buf += '</div>';
			break;
		default:
			this.title = '[Help Filter]';
			buf = `<div class="pad"><h2>Specify a filter page to view.</h2>`;
			buf += `<hr /><strong>Options:</strong><hr />`;
			buf += `<a roomid="view-helpfilter-stats">Stats</a><hr />`;
			buf += `<a roomid="view-helpfilter-keys">Regex keys</a><hr/>`;
			buf += `<a roomid="view-helpfilter-queue">Queue</a><hr/>`;
			buf += `</div>`;
		}
		return LogViewer.linkify(buf);
	},
};
