/*
* Pokemon Showdown
* Emoticons Commands
* @author PrinceSky-Git
*/

import Autolinker from 'autolinker';
import { ImpulseDB } from '../../impulse-db';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

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

const EmoticonDB = ImpulseDB<EmoticonEntry>('emoticons');
const EmoticonConfigDB = ImpulseDB<EmoticonConfigDocument>('emoticonconfig');
const IgnoreEmotesDB = ImpulseDB<IgnoreEmotesDocument>('ignoreemotes');

let emoticons: { [key: string]: string } = {};
let emoteRegex: RegExp = new RegExp("^$", "g");
let emoteSize: number = 32;
Impulse.ignoreEmotes = {} as IgnoreEmotesData;

const getEmoteSize = (): string => emoteSize.toString();

function parseMessage(message: string): string {
	if (message.substr(0, 5) === "/html") {
		message = message.substr(5);
		message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>');
		message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>');
		message = message.replace(/\~\~([^< ](?:[^<]*?[^< ])?)\~\~/g, '<strike>$1</strike>');
		message = message.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;');
		message = Autolinker.link(message.replace(/&#x2f;/g, '/'), { stripPrefix: false, phone: false, twitter: false });
		return message;
	}
	message = Chat.escapeHTML(message).replace(/&#x2f;/g, '/');
	message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>');
	message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>');
	message = message.replace(/\~\~([^< ](?:[^<]*?[^< ])?)\~\~/g, '<strike>$1</strike>');
	message = message.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;');
	message = Autolinker.link(message, { stripPrefix: false, phone: false, twitter: false });
	return message;
}
Impulse.parseMessage = parseMessage;

const escapeRegExp = (str: string): string => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

const buildEmoteRegex = (): void => {
	const emoteArray = Object.keys(emoticons).map(e => escapeRegExp(e));
	emoteRegex = emoteArray.length > 0 ? new RegExp(`(${emoteArray.join('|')})`, 'g') : new RegExp("^$", "g");
};

const loadEmoticons = async (): Promise<void> => {
	try {
		const emoticonDocs = await EmoticonDB.find({}, { projection: { _id: 1, url: 1 } });
		if (emoticonDocs.length > 0) {
			emoticons = {};
			emoticonDocs.forEach(doc => emoticons[doc._id] = doc.url);
		}

		const config = await EmoticonConfigDB.findOne({ _id: 'config' });
		if (config) emoteSize = config.emoteSize;

		const ignoreEmotesDocs = await IgnoreEmotesDB.find({ ignored: true }, { projection: { _id: 1 } });
		Impulse.ignoreEmotes = {};
		ignoreEmotesDocs.forEach(doc => Impulse.ignoreEmotes[doc._id] = true);

		buildEmoteRegex();
	} catch (e) {}
};

const saveEmoteSize = async (size: number): Promise<void> => {
	try {
		await EmoticonConfigDB.upsert({ _id: 'config' }, { $set: { emoteSize: size, lastUpdated: new Date() } });
		emoteSize = size;
	} catch (e) {}
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

loadEmoticons();

const renderEmoticonGrid = (emotes: Array<{ _id: string; url: string }>): string[] =>
	emotes.map(e =>
		`<div style="text-align: center; padding: 10px;"><img src="${e.url}" height="40" width="40" style="display: block; margin: 0 auto;"><br><small>${Chat.escapeHTML(e._id)}</small></div>`
	);

export const chatfilter = function(message, user, room, connection, pmTarget, originalMessage): string {
	if (room?.disableEmoticons) return message;
	if (Impulse.ignoreEmotes[user.id]) return message;
	const parsed = Impulse.parseEmoticons(message, room);
	if (parsed) return `/html ${parsed}`;
	return message;
};

export const commands: Chat.ChatCommands = {
	emoticon: {
		async panel(target, room, user): Promise<void> {
	this.checkCan('roomowner');
	if (!this.runBroadcast()) return;

	const emoteKeys = Object.keys(emoticons);
	const currentSize = getEmoteSize();

	let deleteButtonsHTML = '';
	if (emoteKeys.length > 0) {
		deleteButtonsHTML = emoteKeys.map(name => 
			`<button name="send" value="/emoticon delete ${name}" style="padding: 8px 12px; margin: 5px; background: #d32f2f; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">❌ ${Chat.escapeHTML(name)}</button>`
		).join('');
	} else {
		deleteButtonsHTML = '<p style="color: #999;">No emoticons to delete.</p>';
	}

	let html = `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">`;
	html += `<div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 12px;">`;
	html += `<h2 style="margin: 0 0 20px 0; color: #333; text-align: center; font-size: 24px;">🎭 Emoticon Control Panel</h2>`;
	
	html += `<div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">`;
	html += `<h3 style="margin: 0 0 10px 0; color: #667eea; font-size: 18px;">➕ Add New Emoticon</h3>`;
	html += `<p style="margin: 5px 0; color: #666; font-size: 13px;">Use the command below to add a new emoticon:</p>`;
	html += `<div style="background: #2d2d2d; padding: 12px; border-radius: 6px; margin: 10px 0; font-family: monospace; color: #fff; font-size: 14px;">`;
	html += `/emoticon add &lt;name&gt;, &lt;url&gt;`;
	html += `</div>`;
	html += `<p style="margin: 5px 0; color: #888; font-size: 12px;"><strong>Example:</strong> /emoticon add :smile:, https://example.com/smile.png</p>`;
	html += `<button name="send" value="/emoticon add " style="padding: 10px 20px; margin-top: 10px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;">📝 Start Adding</button>`;
	html += `</div>`;

	html += `<div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ff9800;">`;
	html += `<h3 style="margin: 0 0 10px 0; color: #ff9800; font-size: 18px;">🗑️ Delete Emoticons</h3>`;
	html += `<p style="margin: 5px 0 15px 0; color: #666; font-size: 13px;">Click any button below to delete that emoticon:</p>`;
	html += `<div style="max-height: 300px; overflow-y: auto; padding: 10px; background: white; border-radius: 6px;">`;
	html += deleteButtonsHTML;
	html += `</div>`;
	html += `</div>`;

	html += `<div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4caf50;">`;
	html += `<h3 style="margin: 0 0 10px 0; color: #4caf50; font-size: 18px;">⚙️ Settings</h3>`;
	html += `<p style="margin: 5px 0; color: #666; font-size: 13px;">Current emoticon size: <strong>${currentSize}px</strong></p>`;
	html += `<div style="margin-top: 10px;">`;
	html += `<button name="send" value="/emoticon size 24" style="padding: 8px 12px; margin: 5px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">24px</button>`;
	html += `<button name="send" value="/emoticon size 32" style="padding: 8px 12px; margin: 5px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">32px (default)</button>`;
	html += `<button name="send" value="/emoticon size 48" style="padding: 8px 12px; margin: 5px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">48px</button>`;
	html += `<button name="send" value="/emoticon size 64" style="padding: 8px 12px; margin: 5px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">64px</button>`;
	html += `</div>`;
	html += `<div style="margin-top: 10px;">`;
	html += `<button name="send" value="/emoticon toggle" style="padding: 10px 20px; background: #2196f3; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">🔄 Toggle Room Emoticons</button>`;
	html += `</div>`;
	html += `</div>`;

	html += `<div style="background: #fce4ec; padding: 15px; border-radius: 8px; border-left: 4px solid #e91e63;">`;
	html += `<h3 style="margin: 0 0 10px 0; color: #e91e63; font-size: 18px;">📋 Quick Commands</h3>`;
	html += `<div style="font-size: 12px; color: #666; line-height: 1.8;">`;
	html += `<button name="send" value="/emoticon " style="padding: 6px 12px; margin: 3px; background: #e91e63; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">View All Emoticons</button>`;
	html += `<button name="send" value="/emoticon info " style="padding: 6px 12px; margin: 3px; background: #e91e63; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Info About Emoticon</button>`;
	html += `<button name="send" value="/emoticon ignore" style="padding: 6px 12px; margin: 3px; background: #9c27b0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Ignore Emoticons</button>`;
	html += `<button name="send" value="/emoticon unignore" style="padding: 6px 12px; margin: 3px; background: #9c27b0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Unignore Emoticons</button>`;
	html += `</div>`;
	html += `</div>`;

	html += `<div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">`;
	html += `<p style="margin: 0; color: #999; font-size: 11px;">Total Emoticons: ${emoteKeys.length} | Requires: Room Owner (&) for management</p>`;
	html += `</div>`;
	html += `</div>`;
	html += `</div>`;

	this.sendReply(`|html|${html}`);
},
		
		async add(target, room, user): Promise<void> {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!target) return this.parse("/emoticon help");

			const [name, url] = target.split(",").map(s => s.trim());
			if (!url) return this.parse("/emoticon help");
			if (name.length > 10) return this.errorReply("Emoticons may not be longer than 10 characters.");
			if (await EmoticonDB.exists({ _id: name })) return this.errorReply(`${name} is already an emoticon.`);

			await addEmoticon(name, url, user);

			this.sendReply(`|raw|Emoticon ${Chat.escapeHTML(name)} added: <img src="${url}" width="40" height="40">`);
		},

		async delete(target, room, user): Promise<void> {
			room = this.requireRoom();
			this.checkCan('roomowner');
			if (!target) return this.parse("/emoticon help");

			const emote = await EmoticonDB.findOne({ _id: target });
			if (!emote) return this.errorReply("That emoticon does not exist.");

			await deleteEmoticon(target);

			this.sendReply("Emoticon removed.");
		},

		async toggle(target, room, user): Promise<void> {
			room = this.requireRoom();
			this.checkCan('roommod');
			room.disableEmoticons = !room.disableEmoticons;
			Rooms.global.writeChatRoomData();
			const action = room.disableEmoticons ? 'Disabled' : 'Enabled';
			this.privateModAction(`(${user.name} ${action.toLowerCase()} emoticons.)`);
		},

		async ''(target, room, user): Promise<void> {
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
			if (!target) return this.errorReply('Specify a size (16-256).');

			const size = parseInt(target);
			if (isNaN(size) || size < 16 || size > 256) return this.errorReply('Size must be 16-256.');

			const oldSize = emoteSize;
			await saveEmoteSize(size);

			this.sendReply(`Emoticon size set to ${size}px.`);
		},

		async info(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			if (!target) return this.errorReply('Usage: /emoticon info <name>');

			const emote = await EmoticonDB.findOne({ _id: target });
			if (!emote) return this.errorReply(`Emoticon "${target}" not found.`);

			const rows = [
				[`<img src="${emote.url}" height="40" width="40">`],
				[`<b>URL:</b> ${Chat.escapeHTML(emote.url)}`],
				[`<b>Added by:</b> ${nameColor(emote.addedBy, true, true)}`],
				[`<b>Added:</b> ${emote.addedAt.toUTCString()}`]
			];

			const tableHTML = generateThemedTable(`Emoticon: ${Chat.escapeHTML(target)}`, [], rows);
			this.sendReply(`|html|${tableHTML}`);
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{cmd: "/emoticon", desc: "Shows all emoticons"},
				{cmd: "/emoticon add [name], [url]", desc: "Add emoticon. Requires: &."},
				{cmd: "/emoticon delete [name]", desc: "Remove emoticon. Requires: &."},
				{cmd: "/emoticon toggle", desc: "Enable/disable emoticons in room. Requires: #."},
				{cmd: "/emoticon ignore", desc: "Ignore emoticons"},
				{cmd: "/emoticon unignore", desc: "Show emoticons"},
				{cmd: "/emoticon size [px]", desc: "Set size of emoticons. Requires: &."},
				{cmd: "/emoticon info [name]", desc: "Info about emoticon"},
				{cmd: "<small>Note: History may show emoticons even if ignored</small>", desc: ""},
			];
			const html = `<center><strong>Emoticon Commands:<br>Alias: /emote, /emotes, /emoticons</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({cmd, desc}, i) =>
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
