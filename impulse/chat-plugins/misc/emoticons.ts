/*
* Pokemon Showdown - Impulse Server
* Emoticons chat-plugin.
* @author PrinceSky-Git
* Refactored By @ClarkJ338
*/
import { FS, Utils } from '../../../lib';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const DATA_FILE = 'impulse/db/emoticons.json';

interface EmoticonEntry {
	url: string;
	addedBy: string;
	addedAt: number;
}

interface EmoticonData {
	emoticons: { [name: string]: EmoticonEntry };
	emoteSize: number;
	ignores: { [userId: string]: boolean };
}

let data: EmoticonData = {
	emoticons: {},
	emoteSize: 32,
	ignores: {},
};

let emoticons: { [key: string]: string } = {};
let emoteRegex = /^$/g;

Impulse.ignoreEmotes = {} as { [userId: string]: boolean };

const getEmoteSize = (): string => (data.emoteSize || 32).toString();

function parseMessage(message: string): string {
	if (message.substr(0, 5) === "/html") {
		message = message.substr(5);
		message = message.replace(/&#x2f;/g, '/');
		return message;
	}
	return Chat.formatText(message).replace(/&#x2f;/g, '/');
}
Impulse.parseMessage = parseMessage;

const escapeRegExp = (str: string): string => str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");

const buildEmoteRegex = (): void => {
	const emoteArray = Object.keys(emoticons).map(e => escapeRegExp(e));
	emoteRegex = emoteArray.length > 0 ? new RegExp(`(${emoteArray.join('|')})`, 'g') : /^$/g;
};

const saveData = (): void => {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(data));
};

const loadEmoticons = async (): Promise<void> => {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) {
			const json = JSON.parse(raw);
			data = {
				emoticons: json.emoticons || {},
				emoteSize: json.emoteSize || 32,
				ignores: json.ignores || {},
			};
		} else {
			saveData();
		}

		emoticons = {};
		for (const [name, entry] of Object.entries(data.emoticons)) {
			emoticons[name] = entry.url;
		}

		Impulse.ignoreEmotes = data.ignores || {};
		
		buildEmoteRegex();
	} catch (e) {
		console.error('Failed to load emoticons:', e);
		data = { emoticons: {}, emoteSize: 32, ignores: {} };
		emoticons = {};
	}
};

const saveEmoteSize = async (size: number): Promise<void> => {
	data.emoteSize = size;
	saveData();
};

const addEmoticon = async (name: string, url: string, user: User): Promise<void> => {
	if (!data.emoticons) data.emoticons = {};
	
	data.emoticons[name] = {
		url,
		addedBy: user.name,
		addedAt: Date.now(),
	};
	emoticons[name] = url;
	saveData();
	buildEmoteRegex();
};

const deleteEmoticon = async (name: string): Promise<void> => {
	if (!data.emoticons) return;
	delete data.emoticons[name];
	delete emoticons[name];
	saveData();
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
		`<div style="text-align: center; padding: 10px;"><img src="${e.url}" height="40" width="40" style="display: block; margin: 0 auto;"><br><small>${Utils.escapeHTML(e._id)}</small></div>`
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
			
			if (name.length > 10) {
				throw new Chat.ErrorMessage("Emoticons may not be longer than 10 characters.");
			}
			
			if (data.emoticons && data.emoticons[name]) {
				throw new Chat.ErrorMessage(`${name} is already an emoticon.`);
			}

			await addEmoticon(name, url, user);

			this.sendReply(`|raw|Emoticon ${Utils.escapeHTML(name)} added: <img src="${url}" width="40" height="40">`);
		},

		async delete(target, room, user): Promise<void> {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!target) return this.parse("/emoticon help");

			if (!data.emoticons || !data.emoticons[target]) {
				throw new Chat.ErrorMessage("That emoticon does not exist.");
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
			if (Impulse.ignoreEmotes[user.id]) {
				throw new Chat.ErrorMessage('Already ignoring emoticons.');
			}
			
			if (!data.ignores) data.ignores = {};
			data.ignores[user.id] = true;
			Impulse.ignoreEmotes[user.id] = true;
			saveData();

			this.sendReply('Ignoring emoticons. Note: Chat history may still show emoticons when rejoining.');
		},

		async unignore(target, room, user): Promise<void> {
			if (!Impulse.ignoreEmotes[user.id]) {
				throw new Chat.ErrorMessage('Not ignoring emoticons.');
			}
			
			if (data.ignores) delete data.ignores[user.id];
			delete Impulse.ignoreEmotes[user.id];
			saveData();

			this.sendReply('No longer ignoring emoticons.');
		},

		async size(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) throw new Chat.ErrorMessage('Specify a size (16-256).');

			const size = parseInt(target);
			if (isNaN(size) || size < 16 || size > 256) {
				throw new Chat.ErrorMessage('Size must be 16-256.');
			}

			await saveEmoteSize(size);

			this.sendReply(`Emoticon size set to ${size}px.`);
		},

		async info(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			if (!target) throw new Chat.ErrorMessage('Usage: /emoticon info <name>');

			const emote = data.emoticons ? data.emoticons[target] : null;
			if (!emote) throw new Chat.ErrorMessage(`Emoticon "${target}" not found.`);

			const rows = [
				[`<img src="${emote.url}" height="40" width="40">`],
				[`<b>URL:</b> ${Utils.escapeHTML(emote.url || '')}`],
				[`<b>Added by:</b> ${nameColor(emote.addedBy || 'Unknown', true, true)}`],
				[`<b>Added:</b> ${emote.addedAt ? new Date(emote.addedAt).toUTCString() : 'Unknown'}`],
			];

			const tableHTML = generateThemedTable(`Emoticon: ${Utils.escapeHTML(target)}`, [], rows);
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
