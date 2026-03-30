/*
* Pokemon Showdown - Impulse Server
* Custom Colors Plugin.
* Refactored By @PrinceSky-Git
*/
import * as crypto from 'crypto';
import https from 'https';
import { FS, Utils } from '../../../lib';
import { toID } from '../../../sim/dex';

interface RGB { R: number; G: number; B: number }
interface CustomColors { [userid: string]: string }

const DATA_FILE = 'impulse/db/custom-colors.json';
const STAFF_ROOM_ID = 'staff';
const CONFIG_PATH = 'config/custom.css';
const COLORS_START_TAG = '/* COLORS START */';
const COLORS_END_TAG = '/* COLORS END */';

let customColors: CustomColors = {};
const colorCache: Record<string, string> = {};

const loadData = async (): Promise<void> => {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) {
			customColors = JSON.parse(raw);
		}
	} catch (e) {
		console.error('Error loading colors:', e);
		customColors = {};
	}
};

void loadData();

const saveData = (): void => {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(customColors));
};

export const clearColorCache = (): void => {
	for (const key in colorCache) delete colorCache[key];
};

export const reloadCustomColors = async (): Promise<void> => {
	await loadData();
	clearColorCache();
};

export const getCustomColors = (): CustomColors => customColors;

export const addCustomColor = (userid: string, color: string): void => {
	customColors[userid] = color;
	colorCache[userid] = color;
	saveData();
};

export const removeCustomColor = (userid: string): void => {
	delete customColors[userid];
	delete colorCache[userid];
	saveData();
};

export const validateHexColor = (color: string): boolean =>
	/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);

const HSLToRGB = (H: number, S: number, L: number): RGB => {
	const C = (100 - Math.abs(2 * L - 100)) * S / 100 / 100;
	const X = C * (1 - Math.abs((H / 60) % 2 - 1));
	const m = L / 100 - C / 2;
	let R1 = 0, G1 = 0, B1 = 0;

	const hCase = Math.floor(H / 60);
	if (hCase === 0) { R1 = C; G1 = X; } else if (hCase === 1) { R1 = X; G1 = C; } else if (hCase === 2) { G1 = C; B1 = X; } else if (hCase === 3) { G1 = X; B1 = C; } else if (hCase === 4) { R1 = X; B1 = C; } else if (hCase === 5) { R1 = C; B1 = X; }

	return { R: R1 + m, G: G1 + m, B: B1 + m };
};

const hashColor = (name: string): string => {
	const id = toID(name);
	if (customColors[id]) return customColors[id];
	if (colorCache[id]) return colorCache[id];

	const hash = crypto.createHash('md5').update(id).digest('hex');
	const H = parseInt(hash.slice(4, 8), 16) % 360;
	const S = (parseInt(hash.slice(0, 4), 16) % 50) + 40;
	let L = Math.floor(parseInt(hash.slice(8, 12), 16) % 20 + 30);

	const { R, G, B } = HSLToRGB(H, S, L);

	const lum = R * R * R * 0.2126 + G * G * G * 0.7152 + B * B * B * 0.0722;
	let HLmod = (lum - 0.2) * -150;
	if (HLmod > 18) HLmod = (HLmod - 18) * 2.5;
	else if (HLmod < 0) HLmod /= 3;

	const Hdist = Math.min(Math.abs(180 - H), Math.abs(240 - H));
	if (Hdist < 15) HLmod += (15 - Hdist) / 3;

	L += HLmod;

	const { R: r, G: g, B: b } = HSLToRGB(H, S, L);

	const toHex = (x: number): string => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	const color = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	colorCache[id] = color;
	return color;
};

export const nameColor = (name: string, bold = true, userGroup = false): string => {
	const userId = toID(name);
	const symbol = userGroup && Users.globalAuth.get(userId) ?
		`<font color=#948A88>${Users.globalAuth.get(userId)}</font>` :
		'';
	const userName = Utils.escapeHTML(Users.getExact(name)?.name || name);
	return `${symbol}${bold ? '<b>' : ''}<font color=${hashColor(name)}>${userName}</font>${bold ? '</b>' : ''}`;
};

Impulse.nameColor = nameColor;

const reloadCSS = () => {
	if (global.Config?.serverid) {
		const url = `https://play.pokemonshowdown.com/customcss.php?server=${Config.serverid}&invalidate`;
		const req = https.get(url, () => { });
		req.on('error', () => { });
		req.end();
	}
};

Impulse.reloadCSS = reloadCSS;

const generateCSSRule = (name: string, color: string): string => {
	const id = toID(name);
	return `[class$="chatmessage-${id}"] strong, [class$="chatmessage-${id} mine"] strong, ` +
		`[class$="chatmessage-${id} highlighted"] strong, [id$="-userlist-user-${id}"] strong em, ` +
		`[id$="-userlist-user-${id}"] strong, [id$="-userlist-user-${id}"] span ` +
		`{ color: ${color} !important; }`;
};

const updateColorsCSS = async () => {
	try {
		const colors = getCustomColors();
		const cssRules = Object.entries(colors).map(([userid, color]) => {
			return generateCSSRule(userid, color);
		}).join('\n');

		const cssBlock = `${COLORS_START_TAG}\n${cssRules}\n${COLORS_END_TAG}`;

		FS(CONFIG_PATH).writeUpdate(() => {
			const fileContent = FS(CONFIG_PATH).readIfExistsSync();

			if (!fileContent.trim()) return `${cssBlock}\n`;

			const startIndex = fileContent.indexOf(COLORS_START_TAG);
			const endIndex = fileContent.indexOf(COLORS_END_TAG);

			if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
				const pre = fileContent.substring(0, startIndex);
				const post = fileContent.substring(endIndex + COLORS_END_TAG.length);
				return pre + cssBlock + post;
			} else {
				return `${fileContent}\n${cssBlock}\n`;
			}
		});

		if (typeof Impulse !== 'undefined' && Impulse.reloadCSS) {
			Impulse.reloadCSS();
		}
	} catch (err) {
		console.error("Error updating colors CSS:", err);
	}
};

const notifyStaffRoom = (message: string) => {
	const staffRoom = Rooms.get(STAFF_ROOM_ID);
	if (staffRoom) {
		staffRoom.add(`|html|<div class="infobox">${message}</div>`).update();
	}
};

const sendColorNotifications = (user: User, targetName: string, color: string | null) => {
	const targetUser = Users.get(targetName);
	const userNameColor = nameColor(user.name, true, true);
	const targetNameColor = nameColor(targetName, true, false);

	if (color) {
		if (targetUser?.connected) {
			const escapedName = Utils.escapeHTML(user.name);
			targetUser.popup(`|html|${escapedName} set your custom color to <font color="${color}">${color}</font>.`);
		}
		notifyStaffRoom(`${userNameColor} set custom color for ${targetNameColor} to ${color}.`);
	} else {
		if (targetUser?.connected) {
			targetUser.popup(`${user.name} removed your custom color.`);
		}
		notifyStaffRoom(`${userNameColor} removed custom color for ${targetNameColor}.`);
	}
};

export const commands: Chat.ChatCommands = {
	customcolor: {
		''(target, room, user) {
			this.parse('/cc help');
		},

		async set(target: string, room: ChatRoom, user: User) {
			this.checkCan('roomowner');
			const [name, color] = target.split(',').map(t => t.trim());
			if (!name || !color) return this.parse('/cc help');

			const targetId = toID(name);
			if (targetId.length > 19) throw new Chat.ErrorMessage('Usernames are not this long...');

			if (!validateHexColor(color)) {
				throw new Chat.ErrorMessage('Invalid hex format. Use #RGB or #RRGGBB.');
			}

			addCustomColor(targetId, color);

			await updateColorsCSS();

			const escapedName = Utils.escapeHTML(name);
			this.sendReply(
				`|raw|You have given <b><font color="${color}">${escapedName}</font></b> a custom color.`
			);

			sendColorNotifications(user, name, color);
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');
			if (!target) return this.parse('/cc help');

			const targetId = toID(target);
			const colors = getCustomColors();

			if (!colors[targetId]) {
				throw new Chat.ErrorMessage(`${target} does not have a custom color.`);
			}

			removeCustomColor(targetId);

			await updateColorsCSS();

			this.sendReply(`You removed ${target}'s custom color.`);
			sendColorNotifications(user, target, null);
		},

		preview(target, room, user) {
			if (!this.runBroadcast()) return;
			const [name, color] = target.split(',').map(t => t.trim());
			if (!name || !color) return this.parse('/cc help');

			if (!validateHexColor(color)) {
				throw new Chat.ErrorMessage('Invalid hex format. Use #RGB or #RRGGBB.');
			}

			const escapedName = Utils.escapeHTML(name);
			return this.sendReplyBox(`<b><font size="3" color="${color}">${escapedName}</font></b>`);
		},

		async reload(target: string, room: ChatRoom, user: User) {
			this.checkCan('roomowner');
			await reloadCustomColors();
			await updateColorsCSS();
			this.privateModAction(`(${user.name} has reloaded custom colours.)`);
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{
					cmd: "/customcolor set [user], [hex]",
					desc: "Set color for a user. Requires: &.",
				},
				{
					cmd: "/customcolor delete [user]",
					desc: "Delete color for a user. Requires: &.",
				},
				{
					cmd: "/customcolor reload",
					desc: "Reload all custom colors. Requires: &.",
				},
				{
					cmd: "/customcolor preview [user], [hex]",
					desc: "Preview color for a user.",
				},
			];
			const html = `<center><strong>Custom Color Commands:</strong><br>Alias: /cc</center>` +
				`<hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul><small>Format: #RGB or #RRGGBB</small>`;
			this.sendReplyBox(html);
		},
	},
	cc: 'customcolor',
	customcolorhelp: 'customcolor.help',
	cchelp: 'customcolor.help',
};
