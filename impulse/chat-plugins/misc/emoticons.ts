/*
* Pokemon Showdown
* Emotions Commands
* @author PrinceSky-Git
*/
import Autolinker from 'autolinker';
import { ImpulseDB } from '../../impulse-db';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const EMOTICON_DB_NAME = 'emoticons';
const CONFIG_DB_NAME = 'emoticonconfig';
const IGNORE_DB_NAME = 'ignoreemotes';
const DEFAULT_EMOTE_SIZE = 32;
const MAX_EMOTE_NAME_LENGTH = 10;
const MIN_EMOTE_SIZE = 16;
const MAX_EMOTE_SIZE = 256;
const DISPLAY_GRID_SIZE = 40;
const LIST_COLUMNS = 5;
const CONFIG_ID = 'config';

interface EmoticonEntry {
	_id: string;
	url: string;
	addedBy: string;
	addedAt: Date;
}

interface EmoticonConfigDocument {
	_id: string;
	emoteSize: number;
	lastUpdated: Date;
}

interface IgnoreEmotesDocument {
	_id: string;
	ignored: boolean;
	lastUpdated: Date;
}

interface IgnoreEmotesData {
	[userId: string]: boolean;
}

const EmoticonDB = ImpulseDB<EmoticonEntry>(EMOTICON_DB_NAME);
const EmoticonConfigDB = ImpulseDB<EmoticonConfigDocument>(CONFIG_DB_NAME);
const IgnoreEmotesDB = ImpulseDB<IgnoreEmotesDocument>(IGNORE_DB_NAME);

let emoticons: { [key: string]: string } = {};
let emoteRegex = /^$/g;
let emoteSize = DEFAULT_EMOTE_SIZE;
Impulse.ignoreEmotes = {} as IgnoreEmotesData;

const getEmoteSize = (): string => emoteSize.toString();

function parseMessage(message: string): string {
	if (message.substr(0, 5) === "/html") message = message.substr(5);
	else message = Chat.escapeHTML(message).replace(/&#x2f;/g, '/');

	message = message.replace(/__([^< ](?:[^<]*?[^< ])?)__(?![^<]*?<\/a)/g, '<i>$1</i>');
	message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>');
	message = message.replace(/~~([^< ](?:[^<]*?[^< ])?)~~/g, '<strike>$1</strike>');
	message = message.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;');
	return Autolinker.link(message.replace(/&#x2f;/g, '/'), { stripPrefix: false, phone: false, twitter: false });
}
Impulse.parseMessage = parseMessage;

const escapeRegExp = (str: string): string => str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");

const buildEmoteRegex = (): void => {
	const emoteArray = Object.keys(emoticons).map(e => escapeRegExp(e));
	emoteRegex = emoteArray.length > 0 ? new RegExp(`(${emoteArray.join('|')})`, 'g') : /^$/g;
};

const loadEmoticons = async (): Promise<void> => {
	try {
		const emoticonDocs = await EmoticonDB.find({}, { projection: { _id: 1, url: 1 } });
		emoticons = {};
		if (emoticonDocs.length > 0) {
			emoticonDocs.forEach(doc => { emoticons[doc._id] = doc.url; });
		}

		const config = await EmoticonConfigDB.findOne({ _id: CONFIG_ID });
		if (config) emoteSize = config.emoteSize;

		const ignoreEmotesDocs = await IgnoreEmotesDB.find({ ignored: true }, { projection: { _id: 1 } });
		Impulse.ignoreEmotes = {};
		ignoreEmotesDocs.forEach(doc => { Impulse.ignoreEmotes[doc._id] = true; });

		buildEmoteRegex();
	} catch {}
};

const saveEmoteSize = async (size: number): Promise<void> => {
	try {
		await EmoticonConfigDB.upsert({ _id: CONFIG_ID }, { $set: { emoteSize: size, lastUpdated: new Date() } });
		emoteSize = size;
	} catch {}
};

const addEmoticon = async (name: string, url: string, user: User): Promise<void> => {
	await EmoticonDB.insertOne({ _id: name, url, addedBy: user.name, addedAt: new Date() });
	emoticons[name] = url;
	buildEmoteRegex();
};

const deleteEmoticon = async (name: string): Promise<void> => {
	await EmoticonDB.deleteOne({ _id: name });
	delete emoticons[name];
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
		`<div style="text-align: center; padding: 10px;"><img src="${e.url}" height="${DISPLAY_GRID_SIZE}" width="${DISPLAY_GRID_SIZE}" style="display: block; margin: 0 auto;"><br><small>${Chat.escapeHTML(e._id)}</small></div>`
	);

export const chatfilter = function (message, user, room, connection, pmTarget, originalMessage): string {
	if (room?.disableEmoticons || Impulse.ignoreEmotes[user.id]) return message;
	const parsed = Impulse.parseEmoticons(message, room);
	return parsed ? `/html ${parsed}` : message;
};

export const commands: Chat.ChatCommands = {
	emoticon: {
		'': 'list',
		list(target, room, user): void {
			if (!this.runBroadcast()) return;
			const emoteKeys = Object.keys(emoticons);
			if (!emoteKeys.length) return this.sendReplyBox('No emoticons available.');

			const rows: string[][] = [];
			for (let i = 0; i < emoteKeys.length; i += LIST_COLUMNS) {
				const row = [];
				for (let j = i; j < i + LIST_COLUMNS && j < emoteKeys.length; j++) {
					row.push(renderEmoticonGrid([{ _id: emoteKeys[j], url: emoticons[emoteKeys[j]] }])[0]);
				}
				rows.push(row);
			}

			this.sendReply(`|html|${generateThemedTable('Available Emoticons', [], rows)}`);
		},

		async add(target, room, user): Promise<void> {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!target) return this.parse("/emoticon help");

			const [name, url] = target.split(",").map(s => s.trim());
			if (!url) return this.parse("/emoticon help");
			if (name.length > MAX_EMOTE_NAME_LENGTH) return this.errorReply(`Emoticons may not be longer than ${MAX_EMOTE_NAME_LENGTH} characters.`);
			if (await EmoticonDB.exists({ _id: name })) return this.errorReply(`${name} is already an emoticon.`);

			await addEmoticon(name, url, user);
			this.sendReply(`|raw|Emoticon ${Chat.escapeHTML(name)} added: <img src="${url}" width="${DISPLAY_GRID_SIZE}" height="${DISPLAY_GRID_SIZE}">`);
			this.modlog('ADDEMOTICON', null, name);
		},

		async delete(target, room, user): Promise<void> {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!target) return this.parse("/emoticon help");

			const emote = await EmoticonDB.findOne({ _id: target });
			if (!emote) return this.errorReply("That emoticon does not exist.");

			await deleteEmoticon(target);
			this.sendReply("Emoticon removed.");
			this.modlog('DELETEEMOTICON', null, target);
		},

		toggle(target, room, user): void {
			room = this.requireRoom();
			this.checkCan('roommod');
			room.disableEmoticons = !room.disableEmoticons;
			Rooms.global.writeChatRoomData();
			const action = room.disableEmoticons ? 'Disabled' : 'Enabled';
			this.privateModAction(`(${user.name} ${action.toLowerCase()} emoticons.)`);
			this.modlog('TOGGLEEMOTICONS', null, action.toLowerCase());
		},

		async ignore(target, room, user): Promise<void> {
			if (Impulse.ignoreEmotes[user.id]) return this.errorReply('Already ignoring emoticons.');
			await IgnoreEmotesDB.upsert({ _id: user.id }, { $set: { ignored: true, lastUpdated: new Date() } });
			Impulse.ignoreEmotes[user.id] = true;
			this.sendReply('Ignoring emoticons. Note: Chat history may still show emoticons when rejoining.');
		},

		async unignore(target, room, user): Promise<void> {
			if (!Impulse.ignoreEmotes[user.id]) return this.errorReply('Not ignoring emoticons.');
			await IgnoreEmotesDB.deleteOne({ _id: user.id });
			delete Impulse.ignoreEmotes[user.id];
			this.sendReply('No longer ignoring emoticons.');
		},

		async size(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.errorReply(`Specify a size (${MIN_EMOTE_SIZE}-${MAX_EMOTE_SIZE}).`);

			const size = parseInt(target);
			if (isNaN(size) || size < MIN_EMOTE_SIZE || size > MAX_EMOTE_SIZE) return this.errorReply(`Size must be ${MIN_EMOTE_SIZE}-${MAX_EMOTE_SIZE}.`);

			await saveEmoteSize(size);
			this.sendReply(`Emoticon size set to ${size}px.`);
			this.modlog('EMOTICONSIZE', null, `${size}px`);
		},

		async info(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			if (!target) return this.errorReply('Usage: /emoticon info <name>');

			const emote = await EmoticonDB.findOne({ _id: target });
			if (!emote) return this.errorReply(`Emoticon "${target}" not found.`);

			const rows = [
				[`<img src="${emote.url}" height="${DISPLAY_GRID_SIZE}" width="${DISPLAY_GRID_SIZE}">`],
				[`<b>URL:</b> ${Chat.escapeHTML(emote.url)}`],
				[`<b>Added by:</b> ${nameColor(emote.addedBy, true, true)}`],
				[`<b>Added:</b> ${emote.addedAt.toUTCString()}`],
			];

			this.sendReply(`|html|${generateThemedTable(`Emoticon: ${Chat.escapeHTML(target)}`, [], rows)}`);
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const cmds = [
				["/emoticon", "Shows all emoticons"],
				[`/emoticon add [name], [url]", "Add emoticon (max ${MAX_EMOTE_NAME_LENGTH} chars). Requires: &`],
				["/emoticon delete [name]", "Remove emoticon. Requires: &."],
				["/emoticon toggle", "Enable/disable emoticons in room. Requires: #."],
				["/emoticon ignore", "Ignore emoticons"],
				["/emoticon unignore", "Show emoticons"],
				[`/emoticon size [px]", "Set size of emoticons (${MIN_EMOTE_SIZE}-${MAX_EMOTE_SIZE}px). Requires: &`],
				["/emoticon info [name]", "Info about emoticon"],
				["<small>Note: History may show emoticons even if ignored</small>", ""],
			];
			this.sendReplyBox(
				`<center><strong>Emoticon Commands:<br>Alias: /emote, /emotes, /emoticons</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				cmds.map(([c, d], i) => `<li><b>${c}</b>${d ? " - " + d : ""}</li>${i < cmds.length - 1 ? '<hr>' : ''}`).join('') +
				`</ul>`
			);
		},
	},
	emote: 'emoticon',
	emotes: 'emoticon',
	emoticons: 'emoticon',
};
