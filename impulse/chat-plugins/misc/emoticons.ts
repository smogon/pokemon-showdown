/*
* Pokemon Showdown
* Emoticons Commands
* @author PrinceSky-Git
*/
import Autolinker from 'autolinker';
import { FS } from '../../fs';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const EMOTICONS_FILE = FS('impulse/db/emoticons.json');
const CONFIG_FILE = FS('impulse/db/emoticon-config.json');
const IGNORE_FILE = FS('impulse/db/emoticon-ignore.json');

interface EmoticonData {
	url: string;
	addedBy: string;
	addedAt: Date | string;
}
type EmoticonFileData = Record<string, EmoticonData>;

interface EmoticonConfigData {
	emoteSize: number;
}

interface IgnoreEmotesData {
	[userId: string]: boolean;
}

let emoticonData: EmoticonFileData = {};
let emoticons: { [key: string]: string } = {};
let emoteRegex = /^$/g;
let emoteSize = 32;
Impulse.ignoreEmotes = {} as IgnoreEmotesData;

const getEmoteSize = (): string => emoteSize.toString();

const escapeRegExp = (str: string): string => str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");

const buildEmoteRegex = (): void => {
	const emoteArray = Object.keys(emoticons).map(e => escapeRegExp(e));
	emoteRegex = emoteArray.length > 0 ? new RegExp(`(${emoteArray.join('|')})`, 'g') : /^$/g;
};

const renderEmoticonGrid = (emotes: { _id: string, url: string }[]): string[] =>
	emotes.map(e =>
		`<div style="text-align: center; padding: 10px;"><img src="${e.url}" height="40" width="40" style="display: block; margin: 0 auto;"><br><small>${Chat.escapeHTML(e._id)}</small></div>`
	);

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

const parseEmoticons = (message: string, room?: Room): string | false => {
	if (emoteRegex.test(message)) {
		const size = getEmoteSize();
		message = Impulse.parseMessage(message).replace(emoteRegex, (match: string) =>
			`<img src="${emoticons[match]}" title="${match}" height="${size}" width="${size}">`
		);
		return message;
	}
	return false;
};
Impulse.parseEmoticons = parseEmoticons;

const loadEmoticons = async (): Promise<void> => {
	try {
		await FS('impulse/db').mkdirp();

		const emoteJSON = await EMOTICONS_FILE.readIfExists();
		emoticonData = emoteJSON ? JSON.parse(emoteJSON) : {};
		emoticons = {};
		for (const name in emoticonData) {
			emoticons[name] = emoticonData[name].url;
			emoticonData[name].addedAt = new Date(emoticonData[name].addedAt);
		}

		const configJSON = await CONFIG_FILE.readIfExists();
		const config: EmoticonConfigData = configJSON ? JSON.parse(configJSON) : { emoteSize: 32 };
		emoteSize = config.emoteSize || 32;

		const ignoreJSON = await IGNORE_FILE.readIfExists();
		Impulse.ignoreEmotes = ignoreJSON ? JSON.parse(ignoreJSON) : {};

		buildEmoteRegex();
	} catch (err) {
		Monitor.error(`Failed to load emoticons: ${err}`);
	}
};

const saveEmoteSize = async (size: number): Promise<void> => {
	try {
		emoteSize = size;
		const config: EmoticonConfigData = { emoteSize };
		await CONFIG_FILE.safeWrite(JSON.stringify(config));
	} catch (err) {
		Monitor.error(`Failed to save emoticon size: ${err}`);
	}
};

const addEmoticon = async (name: string, url: string, user: User): Promise<void> => {
	emoticonData[name] = {
		url,
		addedBy: user.name,
		addedAt: new Date(),
	};
	await EMOTICONS_FILE.safeWrite(JSON.stringify(emoticonData, null, 2));

	emoticons[name] = url;
	buildEmoteRegex();
};

const deleteEmoticon = async (name: string): Promise<void> => {
	delete emoticonData[name];
	await EMOTICONS_FILE.safeWrite(JSON.stringify(emoticonData, null, 2));

	delete emoticons[name];
	buildEmoteRegex();
};

void loadEmoticons();

export const chatfilter = function (message, user, room, connection, pmTarget, originalMessage): string {
	if (room?.disableEmoticons) return message;
	if (Impulse.ignoreEmotes[user.id]) return message;
	const parsed = Impulse.parseEmoticons(message, room);
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
			if (emoticonData[name]) return this.errorReply(`${name} is already an emoticon.`);

			await addEmoticon(name, url, user);

			this.sendReply(`|raw|Emoticon ${Chat.escapeHTML(name)} added: <img src="${url}" width="40" height="40">`);
		},

		async delete(target, room, user): Promise<void> {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!target) return this.parse("/emoticon help");

			const emote = emoticonData[target];
			if (!emote) return this.errorReply("That emoticon does not exist.");

			await deleteEmoticon(target);

			this.sendReply("Emoticon removed.");
		},

		clearcache(target, room, user): void {
			room = this.requireRoom();
			this.checkCan('roomowner');
			emoticonData = {};
			emoticons = {};
			buildEmoteRegex();
			emoteSize = 32;
			Impulse.ignoreEmotes = {};
			this.sendReply('Emoticon cache cleared.');
			this.privateModAction(`(${user.name} cleared the emoticon cache.)`);
		},

		async loadcache(target, room, user): Promise<void> {
			room = this.requireRoom();
			this.checkCan('roomowner');
			await loadEmoticons();
			this.sendReply('Emoticon cache reloaded.');
			this.privateModAction(`(${user.name} reloaded the emoticon cache.)`);
		},

		cachestats(target, room, user): void {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!this.runBroadcast()) return;
			const emoteCount = Object.keys(emoticons).length;
			const ignoreCount = Object.keys(Impulse.ignoreEmotes).length;
			let html = `<b>Emoticon Cache Stats:</b><br />`;
			html += `<ul style="list-style-type:none;padding-left:10px;">`;
			html += `<li><b>Total Emoticons:</b> ${emoteCount}</li>`;
			html += `<li><b>Ignored Users:</b> ${ignoreCount}</li>`;
			html += `<li><b>Emote Size:</b> ${emoteSize}px</li>`;
			html += `</ul>`;
			this.sendReplyBox(html);
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
			if (Impulse.ignoreEmotes[user.id]) return this.errorReply('Already ignoring emoticons.');
			Impulse.ignoreEmotes[user.id] = true;
			await IGNORE_FILE.safeWrite(JSON.stringify(Impulse.ignoreEmotes, null, 2));
			this.sendReply('Ignoring emoticons. Note: Chat history may still show emoticons when rejoining.');
		},

		async unignore(target, room, user): Promise<void> {
			if (!Impulse.ignoreEmotes[user.id]) return this.errorReply('Not ignoring emoticons.');
			delete Impulse.ignoreEmotes[user.id];
			await IGNORE_FILE.safeWrite(JSON.stringify(Impulse.ignoreEmotes, null, 2));
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

			const emote = emoticonData[target];
			if (!emote) return this.errorReply(`Emoticon "${target}" not found.`);

			const rows = [
				[`<img src="${emote.url}" height="40" width="40">`],
				[`<b>URL:</b> ${Chat.escapeHTML(emote.url)}`],
				[`<b>Added by:</b> ${nameColor(emote.addedBy, true, true)}`],
				[`<b>Added:</b> ${(emote.addedAt as Date).toUTCString()}`],
			];

			const tableHTML = generateThemedTable(`Emoticon: ${Chat.escapeHTML(target)}`, [], rows);
			this.sendReply(`|html|${tableHTML}`);
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/emoticon", desc: "Shows all emoticons" },
				{ cmd: "/emoticon add [name], [url]", desc: "Add emoticon. Requires: &." },
				{ cmd: "/emoticon delete [name]", desc: "Remove emoticon. Requires: &." },
				{ cmd: "/emoticon clearcache", desc: "Clears the in-memory emoticon cache. Requires: &." },
				{ cmd: "/emoticon loadcache", desc: "Reloads emoticons from disk into cache. Requires: &." },
				{ cmd: "/emoticon cachestats", desc: "Displays cache stats. Requires: &." },
				{ cmd: "/emoticon toggle", desc: "Enable/disable emoticons in room. Requires: #." },
				{ cmd: "/emoticon ignore", desc: "Ignore emoticons" },
				{ cmd: "/emoticon unignore", desc: "Show emoticons" },
				{ cmd: "/emoticon size [px]", desc: "Set size of emoticons. Requires: &." },
				{ cmd: "/emoticon info [name]", desc: "Info about emoticon" },
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
