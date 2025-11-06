/*
* Pokemon Showdown
* Emoticons Commands
* @author PrinceSky-Git
*/

import Autolinker from 'autolinker';
import { FS } from '../../../lib/fs';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

interface EmoticonEntry {
	_id: string;
	url: string;
	addedBy: string;
	addedAt: string;
}

interface IgnoreEmotesData {
	[userId: string]: boolean;
}

interface EmoticonCacheStats {
	emoticonsLoaded: boolean;
	emoticonCount: number;
	lastEmoticonsLoad: number;
	emoteSizeLoaded: boolean;
	emoteSize: number;
	lastEmoteSizeLoad: number;
	ignoreLoaded: boolean;
	ignoreCount: number;
	lastIgnoreLoad: number;
}

const EMOTICON_PATH = 'config/emoticons.json';
const EMOTICON_SIZE_PATH = 'config/emoticonsize.json';
const IGNORE_EMOTES_PATH = 'config/ignoreemotes.json';
const EMOTICON_CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

let emoticons: { [key: string]: string } = {};
let emoteRegex = /^$/g;
let emoteSize = 32;
let lastEmoticonsLoad = 0;
Impulse.ignoreEmotes = {} as IgnoreEmotesData;
let lastEmoteSizeLoad = 0;
let lastIgnoreLoad = 0;

const escapeRegExp = (str: string): string => str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");

const buildEmoteRegex = (): void => {
	const emoteArray = Object.keys(emoticons).map(e => escapeRegExp(e));
	emoteRegex = emoteArray.length > 0 ? new RegExp(`(${emoteArray.join('|')})`, 'g') : /^$/g;
};

function now(): number {
	return Date.now();
}

async function getEmoticons(): Promise<{ [key: string]: string }> {
	const current = now();
	if (emoticons && lastEmoticonsLoad && current - lastEmoticonsLoad < EMOTICON_CACHE_TTL_MS) return emoticons;
	const data = await FS(EMOTICON_PATH).readIfExists();
	if (!data) return emoticons;
	try {
		const parsed: EmoticonEntry[] = JSON.parse(data);
		emoticons = {};
		for (const doc of parsed) {
			emoticons[doc._id] = doc.url;
		}
		buildEmoteRegex();
		lastEmoticonsLoad = current;
		return emoticons;
	} catch {
		return emoticons;
	}
}

async function saveEmoticons(): Promise<void> {
	const emoteArray: EmoticonEntry[] = Object.keys(emoticons).map(k => ({
		_id: k,
		url: emoticons[k],
		addedBy: '', // add user info if desired
		addedAt: new Date().toISOString(),
	}));
	await FS(EMOTICON_PATH).writeUpdate(() => JSON.stringify(emoteArray, null, 2));
	lastEmoticonsLoad = now();
}

async function addEmoticon(name: string, url: string, user: User): Promise<void> {
	await getEmoticons();
	emoticons[name] = url;
	await saveEmoticons();
	buildEmoteRegex();
}

async function deleteEmoticon(name: string): Promise<void> {
	await getEmoticons();
	delete emoticons[name];
	await saveEmoticons();
	buildEmoteRegex();
}

async function getEmoticonSize(): Promise<number> {
	const current = now();
	if (typeof emoteSize === 'number' && lastEmoteSizeLoad && current - lastEmoteSizeLoad < EMOTICON_CACHE_TTL_MS) return emoteSize;
	const data = await FS(EMOTICON_SIZE_PATH).readIfExists();
	if (!data) return emoteSize;
	try {
		const parsed = JSON.parse(data);
		if (typeof parsed.emoteSize === 'number') {
			emoteSize = parsed.emoteSize;
			lastEmoteSizeLoad = current;
			return emoteSize;
		}
		return emoteSize;
	} catch {
		return emoteSize;
	}
}

async function saveEmoteSize(size: number): Promise<void> {
	await FS(EMOTICON_SIZE_PATH).writeUpdate(() => JSON.stringify({ emoteSize: size, lastUpdated: now() }, null, 2));
	emoteSize = size;
	lastEmoteSizeLoad = now();
}

async function getIgnoreEmotes(): Promise<IgnoreEmotesData> {
	const current = now();
	if (Impulse.ignoreEmotes && lastIgnoreLoad && current - lastIgnoreLoad < EMOTICON_CACHE_TTL_MS) return Impulse.ignoreEmotes;
	const data = await FS(IGNORE_EMOTES_PATH).readIfExists();
	if (!data) return Impulse.ignoreEmotes;
	try {
		const parsed = JSON.parse(data);
		Impulse.ignoreEmotes = parsed;
		lastIgnoreLoad = current;
		return Impulse.ignoreEmotes;
	} catch {
		return Impulse.ignoreEmotes;
	}
}

async function saveIgnoreEmotes(): Promise<void> {
	await FS(IGNORE_EMOTES_PATH).writeUpdate(() => JSON.stringify(Impulse.ignoreEmotes, null, 2));
	lastIgnoreLoad = now();
}

async function ignoreEmote(userId: string): Promise<void> {
	await getIgnoreEmotes();
	Impulse.ignoreEmotes[userId] = true;
	await saveIgnoreEmotes();
}

async function unignoreEmote(userId: string): Promise<void> {
	await getIgnoreEmotes();
	delete Impulse.ignoreEmotes[userId];
	await saveIgnoreEmotes();
}

function clearEmoticonCache(): void {
	emoticons = {};
	lastEmoticonsLoad = 0;
	emoteSize = 32;
	lastEmoteSizeLoad = 0;
	Impulse.ignoreEmotes = {};
	lastIgnoreLoad = 0;
	buildEmoteRegex();
}

async function loadEmoticonCache(): Promise<void> {
	await getEmoticons();
	await getEmoticonSize();
	await getIgnoreEmotes();
}

function getEmoticonCacheStats(): EmoticonCacheStats {
	return {
		emoticonsLoaded: Object.keys(emoticons).length > 0,
		emoticonCount: Object.keys(emoticons).length,
		lastEmoticonsLoad,
		emoteSizeLoaded: typeof emoteSize === "number",
		emoteSize,
		lastEmoteSizeLoad,
		ignoreLoaded: Object.keys(Impulse.ignoreEmotes).length > 0,
		ignoreCount: Object.keys(Impulse.ignoreEmotes).length,
		lastIgnoreLoad,
	};
}

function parseMessage(message: string): string {
	if (message.substr(0, 5) === "/html") {
		message = message.substr(5);
		message = message.replace(/__([^< ](?:[^<]*?[^< ])?)__(?![^<]*?<\/a)/g, '<i>$1</i>');
		message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>');
		message = message.replace(/~~([^< ](?:[^<]*?[^< ])?)~~/g, '<strike>$1</strike>');
		message = message.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;');
		message = Autolinker.link(message.replace(/&#x2f;/g, '/'), { stripPrefix: false, phone: false, twitter: false });
		return message;
	}
	message = Chat.escapeHTML(message).replace(/&#x2f;/g, '/');
	message = message.replace(/__([^< ](?:[^<]*?[^< ])?)__(?![^<]*?<\/a)/g, '<i>$1</i>');
	message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>');
	message = message.replace(/~~([^< ](?:[^<]*?[^< ])?)~~/g, '<strike>$1</strike>');
	message = message.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;');
	message = Autolinker.link(message, { stripPrefix: false, phone: false, twitter: false });
	return message;
}
Impulse.parseMessage = parseMessage;

const parseEmoticons = async (message: string, room?: Room): Promise<string | false> => {
	await getEmoticons();
	const size = await getEmoticonSize();
	if (emoteRegex.test(message)) {
		message = Impulse.parseMessage(message).replace(emoteRegex, (match: string) =>
			`<img src="${emoticons[match]}" title="${match}" height="${size}" width="${size}">`
		);
		return message;
	}
	return false;
};
Impulse.parseEmoticons = parseEmoticons;

const renderEmoticonGrid = (emotes: { _id: string, url: string }[]): string[] =>
	emotes.map(e =>
		`<div style="text-align: center; padding: 10px;"><img src="${e.url}" height="40" width="40" style="display: block; margin: 0 auto;"><br><small>${Chat.escapeHTML(e._id)}</small></div>`
	);

export const chatfilter = async function (message, user, room, connection, pmTarget, originalMessage): Promise<string> {
	if (room?.disableEmoticons) return message;
	if ((await getIgnoreEmotes())[user.id]) return message;
	const parsed = await Impulse.parseEmoticons(message, room);
	if (parsed) return `/html ${parsed}`;
	return message;
};

export const commands: Chat.ChatCommands = {
	emoticon: {
		async add(target, room, user): Promise<void> {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!target) return this.parse("/emoticon help");

			const [name, url] = target.split(",").map(s => s.trim());
			if (!url) return this.parse("/emoticon help");
			if (name.length > 10) return this.errorReply("Emoticons may not be longer than 10 characters.");
			await getEmoticons();
			if (Object.prototype.hasOwnProperty.call(emoticons, name)) return this.errorReply(`${name} is already an emoticon.`);

			await addEmoticon(name, url, user);

			this.sendReply(`|raw|Emoticon ${Chat.escapeHTML(name)} added: <img src="${url}" width="40" height="40">`);
		},

		async delete(target, room, user): Promise<void> {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!target) return this.parse("/emoticon help");

			await getEmoticons();
			if (!Object.prototype.hasOwnProperty.call(emoticons, target)) return this.errorReply("That emoticon does not exist.");

			await deleteEmoticon(target);

			this.sendReply("Emoticon removed.");
		},

		toggle(target, room, user): void {
			room = this.requireRoom();
			this.checkCan('roommod');
			room.disableEmoticons = !room.disableEmoticons;
			Rooms.global.writeChatRoomData();
			const action = room.disableEmoticons ? 'Disabled' : 'Enabled';
			this.privateModAction(`(${user.name} ${action.toLowerCase()} emoticons.)`);
		},

		''(target, room, user): void {
			if (!this.runBroadcast()) return;
			const emoteKeys = Object.keys(emoticons);
			if (emoteKeys.length === 0) return this.sendReplyBox('No emoticons available.');

			const rows: string[][] = [];
			for (let i = 0; i < emoteKeys.length; i += 5) {
				const row = [];
				for (let j = i; j < i + 5 && j < emoteKeys.length; j++) {
					row.push(renderEmoticonGrid([{ _id: emoteKeys[j], url: emoticons[emoteKeys[j]] }])[0]);
				}
				rows.push(row);
			}

			const tableHTML = generateThemedTable('Available Emoticons', [], rows);
			this.sendReply(`|html|${tableHTML}`);
		},

		async ignore(target, room, user): Promise<void> {
			if ((await getIgnoreEmotes())[user.id]) return this.errorReply('Already ignoring emoticons.');
			await ignoreEmote(user.id);
			this.sendReply('Ignoring emoticons. Note: Chat history may still show emoticons when rejoining.');
		},

		async unignore(target, room, user): Promise<void> {
			if (!(await getIgnoreEmotes())[user.id]) return this.errorReply('Not ignoring emoticons.');
			await unignoreEmote(user.id);
			this.sendReply('No longer ignoring emoticons.');
		},

		async size(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.errorReply('Specify a size (16-256).');

			const size = parseInt(target);
			if (isNaN(size) || size < 16 || size > 256) return this.errorReply('Size must be 16-256.');

			await saveEmoteSize(size);

			this.sendReply(`Emoticon size set to ${size}px.`);
		},

		async info(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			if (!target) return this.errorReply('Usage: /emoticon info <name>');

			await getEmoticons();
			if (!Object.prototype.hasOwnProperty.call(emoticons, target)) return this.errorReply(`Emoticon "${target}" not found.`);

			const emote = { _id: target, url: emoticons[target] };
			const rows = [
				[`<img src="${emote.url}" height="40" width="40">`],
				[`<b>URL:</b> ${Chat.escapeHTML(emote.url)}`],
			];

			const tableHTML = generateThemedTable(`Emoticon: ${Chat.escapeHTML(target)}`, [], rows);
			this.sendReply(`|html|${tableHTML}`);
		},

		clearcache(target, room, user): void {
			this.checkCan('roomowner');
			clearEmoticonCache();
			this.sendReplyBox("Emoticon cache cleared.");
		},

		async loadcache(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			await loadEmoticonCache();
			this.sendReplyBox("Emoticon cache loaded from disk.");
		},

		cachestats(target, room, user): void {
			this.checkCan('roomowner');
			const stats = getEmoticonCacheStats();
			const html =
				`<strong>Emoticon Cache Stats:</strong><br>` +
				`Loaded: <b>${stats.emoticonsLoaded}</b><br>` +
				`Records: <b>${stats.emoticonCount}</b><br>` +
				`Last update: <b>${stats.lastEmoticonsLoad ? new Date(stats.lastEmoticonsLoad).toLocaleString() : 'Never'}</b><br>` +
				`Emote Size Loaded: <b>${stats.emoteSizeLoaded}</b><br>` +
				`Emote Size: <b>${stats.emoteSize}</b><br>` +
				`Emote Size Last update: <b>${stats.lastEmoteSizeLoad ? new Date(stats.lastEmoteSizeLoad).toLocaleString() : 'Never'}</b><br>` +
				`IgnoreEmotes Loaded: <b>${stats.ignoreLoaded}</b><br>` +
				`IgnoreEmotes Records: <b>${stats.ignoreCount}</b><br>` +
				`IgnoreEmotes Last update: <b>${stats.lastIgnoreLoad ? new Date(stats.lastIgnoreLoad).toLocaleString() : 'Never'}</b>`;
			this.sendReplyBox(html);
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/emoticon", desc: "Shows all emoticons" },
				{ cmd: "/emoticon add [name], [url]", desc: "Add emoticon. Requires: &." },
				{ cmd: "/emoticon delete [name]", desc: "Remove emoticon. Requires: &." },
				{ cmd: "/emoticon toggle", desc: "Enable/disable emoticons in room. Requires: #." },
				{ cmd: "/emoticon ignore", desc: "Ignore emoticons" },
				{ cmd: "/emoticon unignore", desc: "Show emoticons" },
				{ cmd: "/emoticon size [px]", desc: "Set size of emoticons. Requires: &." },
				{ cmd: "/emoticon info [name]", desc: "Info about emoticon" },
				{ cmd: "/emoticon clearcache", desc: "Clear emoticon cache. Requires: &." },
				{ cmd: "/emoticon loadcache", desc: "Reload emoticon cache from disk. Requires: &." },
				{ cmd: "/emoticon cachestats", desc: "Show emoticon cache stats. Requires: &." },
				{ cmd: "<small>Note: History may show emoticons even if ignored</small>", desc: "" },
			];
			const html = `<center><strong>Emoticon Commands:<br>Alias: /emote, /emotes, /emoticons</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b>${desc ? " - " + desc : ""}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},
	},
	emote: 'emoticon',
	emotes: 'emoticon',
	emoticons: 'emoticon',
};
