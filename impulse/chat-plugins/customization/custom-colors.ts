/*
* Pokemon Showdown
* Custom Colors Commands
*/

import https from 'https';
import { FS, Utils } from '../../../lib';
import { 
	validateHexColor, 
	nameColor, 
	getCustomColors, 
	addCustomColor, 
	removeCustomColor,
	reloadCustomColors
} from '../../colors';

const STAFF_ROOM_ID = 'staff';
const CONFIG_PATH = 'config/custom.css';
const COLORS_START_TAG = '/* COLORS START */';
const COLORS_END_TAG = '/* COLORS END */';

const reloadCSS = () => {
	if (global.Config?.serverid) {
		const url = `https://play.pokemonshowdown.com/customcss.php?server=${Config.serverid}&invalidate`;
		const req = https.get(url, () => {});
		req.on('error', () => {});
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
			
			if (!fileContent.trim()) return cssBlock + '\n';

			const startIndex = fileContent.indexOf(COLORS_START_TAG);
			const endIndex = fileContent.indexOf(COLORS_END_TAG);

			if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
				const pre = fileContent.substring(0, startIndex);
				const post = fileContent.substring(endIndex + COLORS_END_TAG.length);
				return pre + cssBlock + post;
			} else {
				return fileContent + '\n' + cssBlock + '\n';
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

const sendColorNotifications = (
	user: User,
	targetName: string,
	color: string | null
) => {
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
