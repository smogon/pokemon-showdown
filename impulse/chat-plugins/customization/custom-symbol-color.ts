/*
* Pokemon Showdown
* Symbol Colors Commands
* @author PrinceSky-Git
* Refactored By @ClarkJ338
*/
import { FS } from '../../../lib';
import { toID } from '../../../sim/dex';

const DATA_FILE = 'impulse/db/custom-symbol-colors.json';
const CONFIG_PATH = 'config/custom.css';
const STAFF_ROOM_ID = 'staff';
const START_TAG = '/* SYMBOLCOLORS START */';
const END_TAG = '/* SYMBOLCOLORS END */';
const HEX_REGEX = /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$/;

interface SymbolColorEntry {
	color: string;
	setBy: string;
	createdAt: number;
	updatedAt: number;
}

interface SymbolColorData {
	[userid: string]: SymbolColorEntry;
}

let data: SymbolColorData = {};

const saveData = (): void => {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(data));
};

const loadData = async (): Promise<void> => {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) {
			data = JSON.parse(raw);
		}
	} catch (e) {
		console.error('Failed to load symbol colors:', e);
		data = {};
	}
};

void loadData();

const isValidColor = (color: string): boolean => HEX_REGEX.test(color);

const parseArgs = (target: string) => {
	const [name, color] = target.split(',').map(s => s.trim());
	return { name, userId: toID(name), color };
};

const formatColorSpan = (color: string, content: string = '■') => 
	`<span style="color: ${color}">${content}</span>`;

const updateSymbolColors = (): void => {
	try {
		const cssRules = Object.entries(data).map(([userId, entry]) => {
			const selector = `[id$="-userlist-user-${userId}"] button > em.group`;
			const chatSelector = `[class$="chatmessage-${userId}"] strong small, .groupsymbol`;
			return `${selector} { color: ${entry.color} !important; }\n${chatSelector} { color: ${entry.color} !important; }`;
		}).join('\n');

		const cssBlock = `${START_TAG}\n${cssRules}\n${END_TAG}`;

		FS(CONFIG_PATH).writeUpdate(() => {
			const fileContent = FS(CONFIG_PATH).readIfExistsSync();
			
			if (!fileContent.trim()) return cssBlock + '\n';

			const startIndex = fileContent.indexOf(START_TAG);
			const endIndex = fileContent.indexOf(END_TAG);

			if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
				const pre = fileContent.substring(0, startIndex);
				const post = fileContent.substring(endIndex + END_TAG.length);
				return pre + cssBlock + post;
			} else {
				return fileContent + '\n' + cssBlock + '\n';
			}
		});

		if (typeof Impulse !== 'undefined' && Impulse.reloadCSS) {
			Impulse.reloadCSS();
		}
	} catch (err) {
		console.error("Error updating symbol color CSS:", err);
	}
};

const sendSymbolColorNotifications = (
	staffUser: User,
	targetName: string,
	color: string,
	action: 'set' | 'updated' | 'removed'
): void => {
	const userId = toID(targetName);
	const staffHtml = Impulse.nameColor(staffUser.name, true, true);
	const targetHtml = Impulse.nameColor(targetName, true, false);

	const user = Users.get(userId);
	const room = Rooms.get(STAFF_ROOM_ID);

	if (action === 'removed') {
		if (user?.connected) {
			user.popup(`|html|${staffHtml} has removed your symbol color.`);
		}
		if (room) {
			room.add(`|html|<div class="infobox">${staffHtml} removed symbol color for ${targetHtml}.</div>`).update();
		}
		return;
	}

	if (user?.connected) {
		const colorSpan = `<span style="color: ${color}; font-weight: bold;">${color}</span>`;
		const msg = `${staffHtml} has ${action} your symbol color to ${colorSpan}<br /><center>Refresh if you don't see it.</center>`;
		user.popup(`|html|${msg}`);
	}

	if (room) {
		const colorSpan = formatColorSpan(color, `■ ${color}`);
		const msg = `${staffHtml} ${action} symbol color for ${targetHtml}: ${colorSpan}`;
		room.add(`|html|<div class="infobox">${msg}</div>`).update();
	}
};

export const commands: Chat.ChatCommands = {
	symbolcolor: {
		set(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('roomowner');
			const { name, userId, color } = parseArgs(target);

			if (!name || !color) return this.parse('/sc help');
			if (userId.length > 19) throw new Chat.ErrorMessage('Usernames are not this long...');
			if (!isValidColor(color)) throw new Chat.ErrorMessage('Invalid color. Use hex format: #FF5733 or #F73');

			if (data[userId]) {
				throw new Chat.ErrorMessage('User already has symbol color. Remove with /symbolcolor delete.');
			}

			const now = Date.now();
			data[userId] = {
				color,
				setBy: user.id,
				createdAt: now,
				updatedAt: now,
			};
			saveData();
			updateSymbolColors();

			const targetHtml = Impulse.nameColor(name, true, false);
			this.sendReply(`|raw|You have given ${targetHtml} a symbol color: ${formatColorSpan(color)}`);
			sendSymbolColorNotifications(user, name, color, 'set');
		},

		update(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('roomowner');
			const { name, userId, color } = parseArgs(target);

			if (!name || !color) return this.parse('/sc help');
			if (!isValidColor(color)) throw new Chat.ErrorMessage('Invalid color. Use hex format: #FF5733 or #F73');

			if (!data[userId]) {
				throw new Chat.ErrorMessage('User does not have symbol color. Use /symbolcolor set.');
			}

			data[userId].color = color;
			data[userId].updatedAt = Date.now();
			saveData();
			updateSymbolColors();

			const targetHtml = Impulse.nameColor(name, true, false);
			this.sendReply(`|raw|You have updated ${targetHtml}'s symbol color to: ${formatColorSpan(color)}`);
			sendSymbolColorNotifications(user, name, color, 'updated');
		},

		delete(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('roomowner');
			const userId = toID(target);

			if (!data[userId]) {
				throw new Chat.ErrorMessage(`${target} does not have a symbol color.`);
			}

			delete data[userId];
			saveData();
			updateSymbolColors();

			this.sendReply(`You removed ${target}'s symbol color.`);
			sendSymbolColorNotifications(user, target, '', 'removed');
		},

		help(this: CommandContext) {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/symbolcolor set [user], [hex]", desc: "Set symbol color. Requires: &." },
				{ cmd: "/symbolcolor update [user], [hex]", desc: "Update color. Requires: &." },
				{ cmd: "/symbolcolor delete [user]", desc: "Remove color. Requires: &." },
			];
			
			const listHtml = helpList.map(({ cmd, desc }) => 
				`<li><b>${cmd}</b> - ${desc}</li>`
			).join('<hr>');

			const html = [
				`<center><strong>Custom Symbol Color Commands:</strong><br>Alias: /sc</center>`,
				`<hr><ul style="list-style-type:none;padding-left:0;">`,
				listHtml,
				`</ul><small>Format: #FF5733 or #F73</small>`
			].join('');
			
			this.sendReplyBox(html);
		},

		''(target: string, room: Room, user: User) {
			this.parse('/symbolcolor help');
		},
	},
	sc: 'symbolcolor',
	symbolcolorhelp: 'symbolcolor.help',
	schelp: 'symbolcolor.help',
};
