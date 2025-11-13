/*
* Pokemon Showdown
* Custom Colors Commands
*/

import https from 'https';
import { FS } from '../../../lib';
import { validateHexColor, clearColorCache, nameColor } from '../../colors';

const STAFF_ROOM_ID = 'staff';
const CUSTOM_COLORS_FILE_PATH = 'config/custom-colors.json';

const logToStaffRoom = (message: string) => {
	const staffRoom = Rooms.get(STAFF_ROOM_ID);
	if (staffRoom) {
		staffRoom.add(`|html|${message}`).update();
	}
};

const getColorsFromFile = async (): Promise<{[key: string]: string}> => {
	try {
		const fileContent = await FS(CUSTOM_COLORS_FILE_PATH).readIfExists();
		if (!fileContent) return {};
		return JSON.parse(fileContent);
	} catch (e) {
		// File might be corrupted, treat as empty
		return {};
	}
};

const saveColorsToFile = async (colors: {[key: string]: string}) => {
	await FS(CUSTOM_COLORS_FILE_PATH).writeUpdate(JSON.stringify(colors, null, 2));
};

const loadCustomColorsFromFile = async () => {
	const colors = await getColorsFromFile();
	for (const userid in colors) {
		Chat.customColors.set(userid, colors[userid]);
	}
};

Impulse.reloadCSS = () => {
	const url = `https://play.pokemonshowdown.com/customcss.php?server=${Config.serverid}&invalidate`;
	const req = https.get(url, res => {});
	req.on('error', err => {});
	req.end();
};

const generateCSS = (name: string, color: string): string => {
	const id = toID(name);
	return (
		`\n[class$="chatmessage-${id}"] strong, ` +
		`[class$="chatmessage-${id} mine"] strong, ` +
		`[class$="chatmessage-${id} highlighted"] strong, ` +
		`[id$="-userlist-user-${id}"] strong em, ` +
		`[id$="-userlist-user-${id}"] strong, ` +
		`[id$="-userlist-user-${id}"] span { color: ${color} !important; }\n`
	);
};

const updateColor = async () => {
	try {
		const colorDocs = await getColorsFromFile();
		let css = '/* COLORS START */\n';

		for (const userid in colorDocs) {
			css += generateCSS(userid, colorDocs[userid]);
		}

		css += '/* COLORS END */\n';

		const fileContent = await FS('config/custom.css').readIfExists();
		const file = fileContent ? fileContent.split('\n') : [];

		const start = file.indexOf('/* COLORS START */');
		const end = file.indexOf('/* COLORS END */');
		if (start !== -1 && end !== -1) file.splice(start, (end - start) + 1);

		await FS('config/custom.css').writeUpdate(() => file.join('\n') + css);

		clearColorCache();
		await loadCustomColorsFromFile();
		Impulse.reloadCSS();
	} catch (e) {}
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

			const colors = await getColorsFromFile();
			colors[targetId] = color;
			await saveColorsToFile(colors);

			await updateColor();

			this.sendReply(
				`|raw|You have given <b><font color="${color}">${Chat.escapeHTML(name)}</font></b> a custom color.`
			);

			logToStaffRoom(
				`<div class="infobox">${nameColor(user.name, true, true)} set custom color for ` +
				`${nameColor(name, true, false)} to ${color}.</div>`
			);
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');
			if (!target) return this.parse('/customcolorhelp');

			const targetId = toID(target);
			const colors = await getColorsFromFile();

			if (!colors[targetId]) {
				return this.errorReply(`${target} does not have a custom color.`);
			}

			delete colors[targetId];
			await saveColorsToFile(colors);

			await updateColor();

			this.sendReply(`You removed ${target}'s custom color.`);

			const targetUser = Users.get(target);
			if (targetUser?.connected) {
				targetUser.popup(`${user.name} removed your custom color.`);
			}

			logToStaffRoom(
				`<div class="infobox">${nameColor(user.name, true, true)} removed custom color for ` +
				`${nameColor(target, true, false)}.</div>`
			);
		},

		preview(target, room, user) {
			if (!this.runBroadcast()) return;
			const [name, color] = target.split(',').map(t => t.trim());
			if (!name || !color) return this.parse('/customcolorhelp');

			if (!validateHexColor(color)) {
				return this.errorReply('Invalid hex format. Use #RGB or #RRGGBB.');
			}

			return this.sendReplyBox(
				`<b><font size="3" color="${color}">${Chat.escapeHTML(name)}</font></b>`
			);
		},

		async reload(target: string, room: ChatRoom, user: User) {
			this.checkCan('roomowner');
			await updateColor();
			this.privateModAction(`(${user.name} has reloaded custom colours.)`);
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/customcolor set [user], [hex]", desc: "Set color for a user. Requires: &." },
				{ cmd: "/customcolor delete [user]", desc: "Delete color for a user. Requires: &." },
				{ cmd: "/customcolor reload", desc: "Reload all custom colors. Requires: &." },
				{ cmd: "/customcolor preview [user], [hex]", desc: "Preview color for a user." },
			];

			const helpListHtml = helpList.map(({ cmd, desc }, i) =>
				`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('');

			const html = `<center><strong>Custom Color Commands:</strong><br>Alias: /cc</center><hr>` +
				`<ul style="list-style-type:none;padding-left:0;">${helpListHtml}</ul>` +
				`<small>Format: #RGB or #RRGGBB</small>`;

			this.sendReplyBox(html);
		},
	},
	cc: 'customcolor',
	customcolorhelp: 'customcolor.help',
	cchelp: 'customcolor.help',
};
