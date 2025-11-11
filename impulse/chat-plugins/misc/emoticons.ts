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

interface EmoticonConfig {
	emoteSize: number;
	lastUpdated: string;
}

interface EmoticonsData {
	emoticons: { [key: string]: EmoticonEntry };
	config: EmoticonConfig;
	ignoreEmotes: { [userId: string]: boolean };
}

const EMOTICONS_FILE = 'impulse/db/emoticons.json';

let emoticonsData: EmoticonsData = {
	emoticons: {},
	config: { emoteSize: 32, lastUpdated: new Date().toISOString() },
	ignoreEmotes: {},
};

let emoticons: { [key: string]: string } = {};
let emoteRegex = /^$/g;
let emoteSize = 32;
Impulse.ignoreEmotes = {} as { [userId: string]: boolean };

const loadEmoticons = async (): Promise<void> => {
	try {
		const data = await FS(EMOTICONS_FILE).readIfExists();
		if (data) {
			emoticonsData = JSON.parse(data);
		}

		// Build emoticons lookup
		emoticons = {};
		for (const [key, entry] of Object.entries(emoticonsData.emoticons)) {
			emoticons[key] = entry.url;
		}

		// Load config
		emoteSize = emoticonsData.config.emoteSize || 32;

		// Load ignore list
		Impulse.ignoreEmotes = emoticonsData.ignoreEmotes || {};

		buildEmoteRegex();
	} catch {
		// Silently fail
	}
};

const saveEmoticons = async (): Promise<void> => {
	await FS(EMOTICONS_FILE).safeWrite(JSON.stringify(emoticonsData, null, 2));
};

const getEmoteSize = (): string => emoteSize.toString();

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

const escapeRegExp = (str: string): string => str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");

const buildEmoteRegex = (): void => {
	const emoteArray = Object.keys(emoticons).map(e => escapeRegExp(e));
	emoteRegex = emoteArray.length > 0 ? new RegExp(`(${emoteArray.join('|')})`, 'g') : /^$/g;
};

const saveEmoteSize = async (size: number): Promise<void> => {
	emoticonsData.config.emoteSize = size;
	emoticonsData.config.lastUpdated = new Date().toISOString();
	emoteSize = size;
	await saveEmoticons();
};

const addEmoticon = async (name: string, url: string, user: User): Promise<void> => {
	emoticonsData.emoticons[name] = {
		_id: name,
		url,
		addedBy: user.name,
		addedAt: new Date().toISOString(),
	};
	emoticons[name] = url;
	await saveEmoticons();
	buildEmoteRegex();
};

const deleteEmoticon = async (name: string): Promise<void> => {
	delete emoticonsData.emoticons[name];
	delete emoticons[name];
	await saveEmoticons();
	buildEmoteRegex();
};

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

void loadEmoticons();

const renderEmoticonGrid = (emotes: { _id: string, url: string }[]): string[] =>
	emotes.map(e =>
		`<div style="text-align: center; padding: 10px;"><img src="${e.url}" height="40" width="40" style="display: block; margin: 0 auto;"><br><small>${Chat.escapeHTML(e._id)}</small></div>`
	);

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
			if (emoticonsData.emoticons[name]) return this.errorReply(`${name} is already an emoticon.`);

			await addEmoticon(name, url, user);

			this.sendReply(`|raw|Emoticon ${Chat.escapeHTML(name)} added: <img src="${url}" width="40" height="40">`);
		},

		async delete(target, room, user): Promise<void> {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!target) return this.parse("/emoticon help");

			if (!emoticonsData.emoticons[target]) {
				return this.errorReply("That emoticon does not exist.");
			}

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
			if (Impulse.ignoreEmotes[user.id]) return this.errorReply('Already ignoring emoticons.');
			
			emoticonsData.ignoreEmotes[user.id] = true;
			Impulse.ignoreEmotes[user.id] = true;
			await saveEmoticons();

			this.sendReply('Ignoring emoticons. Note: Chat history may still show emoticons when rejoining.');
		},

		async unignore(target, room, user): Promise<void> {
			if (!Impulse.ignoreEmotes[user.id]) return this.errorReply('Not ignoring emoticons.');
			
			delete emoticonsData.ignoreEmotes[user.id];
			delete Impulse.ignoreEmotes[user.id];
			await saveEmoticons();

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

			const emote = emoticonsData.emoticons[target];
			if (!emote) return this.errorReply(`Emoticon "${target}" not found.`);

			const rows = [
				[`<img src="${emote.url}" height="40" width="40">`],
				[`<b>URL:</b> ${Chat.escapeHTML(emote.url)}`],
				[`<b>Added by:</b> ${nameColor(emote.addedBy, true, true)}`],
				[`<b>Added:</b> ${new Date(emote.addedAt).toUTCString()}`],
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
