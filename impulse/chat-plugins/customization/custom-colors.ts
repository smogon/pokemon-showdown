/*
* Pokemon Showdown
* Custom Colors
*/

import https from 'https';
import { FS } from '../../../lib';
import {
	validateHexColor,
	clearColorCache,
	loadCustomColorsFromDB,
	nameColor,
	getCustomColors,
	setCustomColors,
} from '../../colors';
import { generateThemedTable } from '../../utils';

const STAFF_ROOM_ID = 'staff';

Impulse.reloadCSS = () => {
	const url = `https://play.pokemonshowdown.com/customcss.php?server=${Config.serverid || 'impulse'}`;
	const req = https.get(url, res => {});
	req.on('error', err => {});
	req.end();
};

const generateCSS = (name: string, color: string): string => {
	const id = toID(name);
	return `[class$="chatmessage-${id}"] strong, [class$="chatmessage-${id} mine"] strong, [class$="chatmessage-${id} highlighted"] strong, [id$="-userlist-user-${id}"] strong em, [id$="-userlist-user-${id}"] strong {\n` +
		`  color: ${color} !important;\n` +
		`}\n`;
};

const updateColor = async () => {
	try {
		await loadCustomColorsFromDB();
		const customColors = getCustomColors();
		let css = '/* COLORS START */\n';

		for (const userid in customColors) {
			css += generateCSS(userid, customColors[userid]);
		}
		css += '/* COLORS END */\n';

		const fileContent = await FS('config/custom.css').readIfExists();
		const file = fileContent ? fileContent.split('\n') : [];

		const start = file.indexOf('/* COLORS START */');
		const end = file.indexOf('/* COLORS END */');
		if (start !== -1 && end !== -1 && start < end) {
			file.splice(start, (end - start + 1), ...css.split('\n'));
			await FS('config/custom.css').writeUpdate(() => file.join('\n'));
		} else {
			await FS('config/custom.css').writeUpdate(() => file.join('\n') + '\n' + css);
		}

		clearColorCache();
		await loadCustomColorsFromDB();
		Impulse.reloadCSS();
	} catch (e) {
		console.error('Error updating custom colors CSS:', e);
	}
};

export const commands: Chat.ChatCommands = {
	customcolor: {
		''(target, room, user) {
			this.parse('/customcolorhelp');
		},

		async set(target: string, room: ChatRoom, user: User) {
			this.checkCan('roomowner');
			const [name, color] = target.split(',').map(t => t.trim());
			if (!name || !color) return this.parse('/customcolorhelp');

			const targetId = toID(name);
			if (targetId.length > 19) return this.errorReply('Usernames are not this long...');

			if (!validateHexColor(color)) {
				return this.errorReply('Invalid hex format. Use #RGB or #RRGGBB.');
			}

			const customColors = getCustomColors();
			customColors[targetId] = color;
			setCustomColors(customColors); // Saves to disk

			await updateColor();

			this.sendReply(`|raw|You have given <b><font color="${color}">${Chat.escapeHTML(name)}</font></b> a custom color.`);
			this.parse(`/cc reload`);

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox">${nameColor(user.name, true, true)} set custom color for ${nameColor(name, true, false)} to ${color}.</div>`).update();
			}
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');
			if (!target) return this.parse('/customcolorhelp');

			const targetId = toID(target);
			const customColors = getCustomColors();

			if (!customColors[targetId]) return this.errorReply(`${target} does not have a custom color.`);

			delete customColors[targetId];
			setCustomColors(customColors); // Saves to disk
			await updateColor();

			this.sendReply(`You removed ${target}'s custom color.`);
			this.parse(`/cc reload`);

			const targetUser = Users.get(target);
			if (targetUser?.connected) {
				targetUser.popup(`${user.name} removed your custom color.`);
			}

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox">${nameColor(user.name, true, true)} removed custom color for ${nameColor(target, true, false)}.</div>`).update();
			}
		},

		preview(target, room, user) {
			if (!this.runBroadcast()) return;
			const [name, color] = target.split(',').map(t => t.trim());
			if (!name || !color) return this.parse('/customcolorhelp');

			if (!validateHexColor(color)) {
				return this.errorReply('Invalid hex format. Use #RGB or #RRGGBB.');
			}

			return this.sendReplyBox(`<b><font size="3" color="${color}">${Chat.escapeHTML(name)}</font></b>`);
		},

		async reload(target: string, room: ChatRoom, user: User) {
			this.checkCan('roomowner');
			await updateColor();
			this.privateModAction(`(${user.name} has reloaded custom colours.)`);
		},

		async list(target, room, user) {
			this.checkCan('roomowner');

			const customColors = getCustomColors();
			const userids = Object.keys(customColors).sort();

			if (userids.length === 0) return this.sendReply('No custom colors are currently set.');

			const rows: string[][] = userids.map(userid => [
				Chat.escapeHTML(userid),
				`<code>${Chat.escapeHTML(customColors[userid])}</code>`,
				`<b><font color="${customColors[userid]}">${Chat.escapeHTML(userid)}</font></b>`,
			]);

			const output = generateThemedTable(
				`Custom Colors (${userids.length} users)`,
				['User', 'Color', 'Preview'],
				rows,
			);

			this.sendReply(`|raw|${output}`);
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{cmd: "/customcolor set [user], [hex]", desc: "Set color for a user. Requires: &."},
				{cmd: "/customcolor delete [user]", desc: "Delete color for a user. Requires: &."},
				{cmd: "/customcolor reload", desc: "Reload all custom colors. Requires: &."},
				{cmd: "/customcolor preview [user], [hex]", desc: "Preview color for a user."},
				{cmd: "/customcolor list", desc: "List all custom colors. Requires: &."},
			];
			const html = `<center><strong>Custom Color Commands:</strong><br>Alias: /cc</center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({cmd, desc}, i) =>
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
