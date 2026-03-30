/*
 * Pokemon Showdown - Impulse Server
 * Emoticons chat-plugin.
 * @author PrinceSky-Git
 * Refactored By PrinceSky-Git
 */

import { FS, Utils } from '../../../lib';
import { Table } from '../../utils';

const DATA_FILE = 'impulse/db/emoticons.json';

interface EmoticonEntry {
	readonly url: string;
	readonly addedBy: string;
	readonly addedAt: number;
}

interface EmoticonData {
	emoticons: Record<string, EmoticonEntry>;
	emoteSize: number;
	ignores: Record<string, boolean>;
}

const MIN_EMOTE_SIZE = 16;
const MAX_EMOTE_SIZE = 256;
const DEFAULT_EMOTE_SIZE = 32;
const MAX_EMOTE_NAME_LENGTH = 10;

const VALID_URL_RE = /^https:\/\/[^\s"'<>]+\.(?:png|gif|jpg|jpeg|webp)(?:\?[^\s"'<>]*)?$/i;

const isValidEmoticonUrl = (url: string): boolean => VALID_URL_RE.test(url);

const VALID_NAME_RE = /^[\w:)(|\-]{1,10}$/;

const isValidEmoticonName = (name: string): boolean => VALID_NAME_RE.test(name);

let data: EmoticonData = {
	emoticons: {},
	emoteSize: DEFAULT_EMOTE_SIZE,
	ignores: {},
};

let emoticons: Record<string, string> = {};

let emoteRegex: RegExp = /^$/g;

const saveData = (): void => {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(data));
};

const loadEmoticons = async (): Promise<void> => {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) {
			const json: Partial<EmoticonData> = JSON.parse(raw);
			data = {
				emoticons: json.emoticons ?? {},
				emoteSize: json.emoteSize ?? DEFAULT_EMOTE_SIZE,
				ignores: json.ignores ?? {},
			};
		} else {
			saveData();
		}

		emoticons = Object.fromEntries(
			Object.entries(data.emoticons).map(([name, entry]) => [name, entry.url])
		);

		Impulse.ignoreEmotes = { ...data.ignores };

		buildEmoteRegex();
	} catch (err) {
		console.error('Failed to load emoticons:', err);
		data = { emoticons: {}, emoteSize: DEFAULT_EMOTE_SIZE, ignores: {} };
		emoticons = {};
		buildEmoteRegex();
	}
};

const escapeRegExp = (str: string): string =>
	str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildEmoteRegex = (): void => {
	const keys = Object.keys(emoticons);
	emoteRegex =
		keys.length > 0
			? new RegExp(`(${keys.map(escapeRegExp).join('|')})`, 'g')
			: /^$/g;
};

const getEmoteSize = (): string => String(data.emoteSize || DEFAULT_EMOTE_SIZE);

const addEmoticon = (name: string, url: string, user: User): void => {
	data.emoticons[name] = {
		url,
		addedBy: user.name,
		addedAt: Date.now(),
	};
	emoticons[name] = url;
	saveData();
	buildEmoteRegex();
};

const deleteEmoticon = (name: string): void => {
	// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
	delete data.emoticons[name];
	// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
	delete emoticons[name];
	saveData();
	buildEmoteRegex();
};

const saveEmoteSize = (size: number): void => {
	data.emoteSize = size;
	saveData();
};

function parseMessage(message: string): string {
	if (message.startsWith('/html')) {
		return message.slice(5).replace(/&#x2f;/g, '/');
	}
	return Chat.formatText(message).replace(/&#x2f;/g, '/');
}
Impulse.parseMessage = parseMessage;

const parseEmoticons = (message: string, _room?: Room): string | false => {
	// reset lastIndex before testing to avoid stateful regex bugs.
	emoteRegex.lastIndex = 0;
	if (!emoteRegex.test(message)) return false;

	const size = getEmoteSize();
	emoteRegex.lastIndex = 0;

	const parsed = Impulse.parseMessage(message).replace(
		emoteRegex,
		(match: string) => {
			const url = emoticons[match];
			// url was loaded from disk and validated on write, but double-check
			// before injecting into HTML to prevent stored-XSS.
			if (!url || !isValidEmoticonUrl(url)) return Utils.escapeHTML(match);
			return `<img src="${Utils.escapeHTML(url)}" title="${Utils.escapeHTML(match)}" height="${size}" width="${size}" loading="lazy">`;
		}
	);

	return parsed;
};
Impulse.parseEmoticons = parseEmoticons;

const renderEmoticonCell = (id: string, url: string): string =>
	`<div style="text-align:center;padding:10px;">` +
	`<img src="${Utils.escapeHTML(url)}" height="40" width="40" style="display:block;margin:0 auto;" loading="lazy">` +
	`<br><small>${Utils.escapeHTML(id)}</small>` +
	`</div>`;

Impulse.ignoreEmotes = {} as Record<string, boolean>;
void loadEmoticons();

export const chatfilter: Chat.ChatFilter = function(
	message,
	user,
	room,
	_connection,
	_pmTarget,
	_originalMessage
): string {
	if (room?.disableEmoticons) return message;
	if (Impulse.ignoreEmotes[user.id]) return message;
	const parsed = Impulse.parseEmoticons(message, room);
	if (parsed) return `/html ${parsed}`;
	return message;
};

export const commands: Chat.ChatCommands = {
	emoticon: {
		add(target, room, user): void {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!target) return this.parse('/emoticon help');

			const commaIndex = target.indexOf(',');
			if (commaIndex === -1) return this.parse('/emoticon help');

			const name = target.slice(0, commaIndex).trim();
			const url = target.slice(commaIndex + 1).trim();

			if (!name || !url) return this.parse('/emoticon help');

			if (!isValidEmoticonName(name)) {
				throw new Chat.ErrorMessage(
					`Emoticon names must be 1–${MAX_EMOTE_NAME_LENGTH} characters and may only contain letters, digits, :_-|()`
				);
			}

			if (!isValidEmoticonUrl(url)) {
				throw new Chat.ErrorMessage(
					'Emoticon URL must start with https:// and point to a png, gif, jpg, jpeg, or webp image.'
				);
			}

			if (data.emoticons[name]) {
				throw new Chat.ErrorMessage(`"${name}" is already an emoticon.`);
			}

			addEmoticon(name, url, user);
			this.sendReply(
				`|raw|Emoticon ${Utils.escapeHTML(name)} added: ` +
				`<img src="${Utils.escapeHTML(url)}" width="40" height="40" loading="lazy">`
			);
		},

		delete(target, room, user): void {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!target) return this.parse('/emoticon help');

			if (!data.emoticons[target]) {
				throw new Chat.ErrorMessage('That emoticon does not exist.');
			}

			deleteEmoticon(target);
			this.sendReply('Emoticon removed.');
		},

		toggle(target, room, user): void {
			room = this.requireRoom();
			this.checkCan('roommod');
			room.disableEmoticons = !room.disableEmoticons;
			Rooms.global.writeChatRoomData();
			const action = room.disableEmoticons ? 'disabled' : 'enabled';
			this.privateModAction(`(${user.name} ${action} emoticons.)`);
		},

		''(target, room, user): void {
			if (!this.runBroadcast()) return;

			const emoteKeys = Object.keys(emoticons);
			if (emoteKeys.length === 0) return this.sendReplyBox('No emoticons available.');

			const rows: string[][] = [];
			for (let i = 0; i < emoteKeys.length; i += 5) {
				const row: string[] = [];
				for (let j = i; j < i + 5 && j < emoteKeys.length; j++) {
					row.push(renderEmoticonCell(emoteKeys[j], emoticons[emoteKeys[j]]));
				}
				rows.push(row);
			}

			this.sendReply(`|html|${Table('Available Emoticons', [], rows)}`);
		},

		ignore(target, room, user): void {
			if (Impulse.ignoreEmotes[user.id]) {
				throw new Chat.ErrorMessage('Already ignoring emoticons.');
			}

			data.ignores[user.id] = true;
			Impulse.ignoreEmotes[user.id] = true;
			saveData();
			this.sendReply('Ignoring emoticons. Note: Chat history may still show emoticons when rejoining.');
		},

		unignore(target, room, user): void {
			if (!Impulse.ignoreEmotes[user.id]) {
				throw new Chat.ErrorMessage('Not ignoring emoticons.');
			}

			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete data.ignores[user.id];
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete Impulse.ignoreEmotes[user.id];
			saveData();
			this.sendReply('No longer ignoring emoticons.');
		},

		size(target, room, user): void {
			this.checkCan('roomowner');
			if (!target) throw new Chat.ErrorMessage(`Specify a size (${MIN_EMOTE_SIZE}–${MAX_EMOTE_SIZE}).`);

			const size = Number(target);
			if (!Number.isInteger(size) || size < MIN_EMOTE_SIZE || size > MAX_EMOTE_SIZE) {
				throw new Chat.ErrorMessage(`Size must be an integer between ${MIN_EMOTE_SIZE} and ${MAX_EMOTE_SIZE}.`);
			}

			saveEmoteSize(size);
			this.sendReply(`Emoticon size set to ${size}px.`);
		},

		info(target, room, user): void {
			if (!this.runBroadcast()) return;
			if (!target) throw new Chat.ErrorMessage('Usage: /emoticon info <name>');

			const emote = data.emoticons[target] ?? null;
			if (!emote) throw new Chat.ErrorMessage(`Emoticon "${Utils.escapeHTML(target)}" not found.`);

			const rows: string[][] = [
				[`<img src="${Utils.escapeHTML(emote.url)}" height="40" width="40" loading="lazy">`],
				[`<b>URL:</b> ${Utils.escapeHTML(emote.url)}`],
				[`<b>Added by:</b> ${Impulse.nameColor(emote.addedBy || 'Unknown', true, true)}`],
				[`<b>Added:</b> ${emote.addedAt ? new Date(emote.addedAt).toUTCString() : 'Unknown'}`],
			];

			this.sendReply(`|html|${Table(`Emoticon: ${Utils.escapeHTML(target)}`, [], rows)}`);
		},

		help(): void {
			if (!this.runBroadcast()) return;

			const helpList: { cmd: string; desc: string }[] = [
				{ cmd: '/emoticon', desc: 'Shows all emoticons' },
				{ cmd: '/emoticon add [name], [url]', desc: 'Add emoticon. Requires: &.' },
				{ cmd: '/emoticon delete [name]', desc: 'Remove emoticon. Requires: &.' },
				{ cmd: '/emoticon toggle', desc: 'Enable/disable emoticons in room. Requires: #.' },
				{ cmd: '/emoticon ignore', desc: 'Ignore emoticons' },
				{ cmd: '/emoticon unignore', desc: 'Show emoticons' },
				{ cmd: '/emoticon size [px]', desc: 'Set size of emoticons. Requires: &.' },
				{ cmd: '/emoticon info [name]', desc: 'Info about emoticon' },
				{ cmd: '<small>Note: History may show emoticons even if ignored</small>', desc: '' },
			];

			const items = helpList
				.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b>${desc ? ` - ${desc}` : ''}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				)
				.join('');

			this.sendReplyBox(
				`<center><strong>Emoticon Commands:<br>Alias: /emote, /emotes, /emoticons</strong></center>` +
				`<hr><ul style="list-style-type:none;padding-left:0;">${items}</ul>`
			);
		},
	},

	emote: 'emoticon',
	emotes: 'emoticon',
	emoticons: 'emoticon',
};
