/*
* Pokemon Showdown
* Symbol Colors Commands
*/

import { FS } from '../../../lib/fs';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const STAFF_ROOM_ID = 'staff';
const SYMBOL_COLORS_FILE = 'impulse/db/symbol-colors.json';
const HEX_REGEX = /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$/;

interface SymbolColorDocument {
	_id: string;
	color: string;
	setBy: string;
	createdAt: string;
	updatedAt: string;
}

interface SymbolColorsData {
	[userId: string]: SymbolColorDocument;
}

let symbolColors: SymbolColorsData = {};

const loadSymbolColors = async (): Promise<void> => {
	const data = await FS(SYMBOL_COLORS_FILE).readIfExists();
	symbolColors = data ? JSON.parse(data) : {};
};

const saveSymbolColors = async (): Promise<void> => {
	await FS(SYMBOL_COLORS_FILE).safeWrite(JSON.stringify(symbolColors, null, 2));
};

const isValidColor = (color: string): boolean => HEX_REGEX.test(color);

const updateSymbolColors = async (): Promise<void> => {
	try {
		let css = '/* SYMBOLCOLORS START */\n';

		Object.values(symbolColors).forEach(doc => {
			const selector = `[id$="-userlist-user-${doc._id}"] button > em.group`;
			const chatSelector = `[class$="chatmessage-${doc._id}"] strong small, .groupsymbol`;
			css += `${selector} { color: ${doc.color}; }\n${chatSelector} { color: ${doc.color}; }\n`;
		});

		css += '/* SYMBOLCOLORS END */\n';

		const file = FS('config/custom.css').readIfExistsSync().split('\n');
		const start = file.indexOf('/* SYMBOLCOLORS START */');
		const end = file.indexOf('/* SYMBOLCOLORS END */');

		if (start !== -1 && end !== -1 && start < end) {
			file.splice(start, (end - start + 1), ...css.split('\n'));
			FS('config/custom.css').writeUpdate(() => file.join('\n'));
		} else {
			FS('config/custom.css').writeUpdate(() => file.join('\n') + '\n' + css);
		}
		Impulse.reloadCSS();
	} catch {
		// Ignore errors during initialization
	}
};

const colorPreview = (color: string): string => `<span style="color: ${color}; font-size: 24px;">■</span>`;

const notifyUser = (userId: string, staffName: string, color: string, action: string): void => {
	const user = Users.get(userId);
	if (user?.connected) {
		user.popup(`|html|${nameColor(staffName, true, true)} ${action} your symbol color to <span style="color: ${color}; font-weight: bold;">${color}</span><br /><center>Refresh if you don't see it.</center>`);
	}
};

const notifyStaff = (staffName: string, targetName: string, color: string, action: string): void => {
	const room = Rooms.get(STAFF_ROOM_ID);
	if (room) {
		room.add(`|html|<div class="infobox">${nameColor(staffName, true, true)} ${action} symbol color for ${nameColor(targetName, true, false)}: <span style="color: ${color}">■ ${color}</span></div>`).update();
	}
};

export const commands: Chat.ChatCommands = {
	symbolcolor: {
		async set(target: string, room: Room, user: User): Promise<void> {
			this.checkCan('roomowner');
			const [name, color] = target.split(',').map(s => s.trim());
			if (!name || !color) return this.parse('/help symbolcolor');

			const userId = toID(name);
			if (userId.length > 19) return this.errorReply('Usernames are not this long...');

			if (!isValidColor(color)) {
				return this.errorReply('Invalid color. Use hex format: #FF5733 or #F73');
			}

			if (symbolColors[userId]) {
				return this.errorReply('User already has symbol color. Remove with /symbolcolor delete.');
			}

			const now = new Date().toISOString();
			symbolColors[userId] = { _id: userId, color, setBy: user.id, createdAt: now, updatedAt: now };
			await saveSymbolColors();

			await updateSymbolColors();

			this.sendReply(`|raw|You have given ${nameColor(name, true, false)} a symbol color: <span style="color: ${color}">■</span>`);
			notifyUser(userId, user.name, color, 'has set');
			notifyStaff(user.name, name, color, 'set');
		},

		async update(target: string, room: Room, user: User): Promise<void> {
			this.checkCan('roomowner');
			const [name, color] = target.split(',').map(s => s.trim());
			if (!name || !color) return this.parse('/help symbolcolor');

			const userId = toID(name);

			if (!isValidColor(color)) {
				return this.errorReply('Invalid color. Use hex format: #FF5733 or #F73');
			}

			if (!symbolColors[userId]) {
				return this.errorReply('User does not have symbol color. Use /symbolcolor set.');
			}

			symbolColors[userId].color = color;
			symbolColors[userId].updatedAt = new Date().toISOString();
			await saveSymbolColors();

			await updateSymbolColors();

			this.sendReply(`|raw|You have updated ${nameColor(name, true, false)}'s symbol color to: <span style="color: ${color}">■</span>`);
			notifyUser(userId, user.name, color, 'has updated');
			notifyStaff(user.name, name, color, 'updated');
		},

		async delete(target: string, room: Room, user: User): Promise<void> {
			this.checkCan('roomowner');
			const userId = toID(target);

			if (!symbolColors[userId]) {
				return this.errorReply(`${target} does not have a symbol color.`);
			}

			delete symbolColors[userId];
			await saveSymbolColors();

			await updateSymbolColors();

			this.sendReply(`You removed ${target}'s symbol color.`);

			const targetUser = Users.get(userId);
			if (targetUser?.connected) {
				targetUser.popup(`|html|${nameColor(user.name, true, true)} has removed your symbol color.`);
			}

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox">${nameColor(user.name, true, true)} removed symbol color for ${nameColor(target, true, false)}.</div>`).update();
			}
		},

		async list(target: string, room: Room, user: User): Promise<void> {
			this.checkCan('roomowner');

			const allColors = Object.values(symbolColors).sort((a, b) => a._id.localeCompare(b._id));
			const total = allColors.length;

			if (total === 0) return this.sendReply('No custom symbol colors have been set.');

			const page = parseInt(target) || 1;
			const limit = 20;
			const totalPages = Math.ceil(total / limit);
			const startIdx = (page - 1) * limit;
			const endIdx = startIdx + limit;
			const pageColors = allColors.slice(startIdx, endIdx);

			const rows: string[][] = pageColors.map(sc => [
				sc._id,
				sc.color,
				colorPreview(sc.color),
				Chat.escapeHTML(sc.setBy || 'Unknown'),
			]);

			let output = generateThemedTable(
				`Custom Symbol Colors (Page ${page}/${totalPages})`,
				['User', 'Color', 'Preview', 'Set By'],
				rows,
			);

			if (totalPages > 1) {
				output += `<div class="pad"><center>`;
				if (page > 1) {
					output += `<button class="button" name="send" value="/symbolcolor list ${page - 1}">Previous</button> `;
				}
				if (page < totalPages) {
					output += `<button class="button" name="send" value="/symbolcolor list ${page + 1}">Next</button>`;
				}
				output += `</center></div>`;
			}

			this.sendReply(`|raw|${output}`);
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/symbolcolor set [user], [hex]", desc: "Set symbol color. Requires: &." },
				{ cmd: "/symbolcolor update [user], [hex]", desc: "Update color. Requires: &." },
				{ cmd: "/symbolcolor delete [user]", desc: "Remove color. Requires: &." },
				{ cmd: "/symbolcolor list [page]", desc: "List colors. Requires: &." },
			];
			const html = `<center><strong>Custom Symbol Color Commands:</strong><br>Alias: /sc</center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul><small>Format: #FF5733 or #F73</small>`;
			this.sendReplyBox(html);
		},

		''(target, room, user): void {
			this.parse('/symbolcolor help');
		},
	},
	sc: 'symbolcolor',
	symbolcolorhelp: 'symbolcolor.help',
	schelp: 'symbolcolor.help',
};

void loadSymbolColors();
