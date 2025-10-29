/*
* Pokemon Showdown
* Custom Colors Commands
*/

import https from 'https';
import { FS } from '../../../lib';
import { ImpulseDB } from '../../impulse-db';
import { validateHexColor, clearColorCache, loadCustomColorsFromDB, nameColor } from '../../colors';
import { generateThemedTable } from '../../utils';

const STAFF_ROOM_ID = 'staff';

Impulse.reloadCSS = () => {
	const url = `https://play.pokemonshowdown.com/customcss.php?server=${Config.serverid}&invalidate`;
	const req = https.get(url, res => {});
	req.on('error', err => {});
	req.end();
};

const generateCSS = (name: string, color: string): string => {
	const id = toID(name);
	return `[class$="chatmessage-${id}"] strong, [class$="chatmessage-${id} mine"] strong, [class$="chatmessage-${id} highlighted"] strong, [id$="-userlist-user-${id}"] strong em, [id$="-userlist-user-${id}"] strong, [id$="-userlist-user-${id}"] span { color: ${color} !important; }\n`;
};

const updateColor = async () => {
	try {
		const colorDocs = await ImpulseDB('customcolors').find({});
		let css = '/* COLORS START */\n';

		colorDocs.forEach(doc => {
			css += generateCSS(doc.userid, doc.color);
		});

		css += '/* COLORS END */\n';

		const fileContent = await FS('config/custom.css').readIfExists();
		const file = fileContent ? fileContent.split('\n') : [];

		const start = file.indexOf('/* COLORS START */');
		const end = file.indexOf('/* COLORS END */');
		if (start !== -1 && end !== -1) file.splice(start, (end - start) + 1);

		FS('config/custom.css').writeUpdate(() => file.join('\n') + css);

		clearColorCache();
		await loadCustomColorsFromDB();
		Impulse.reloadCSS();
	} catch {
		// Ignore errors during initialization
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

			await ImpulseDB('customcolors').upsert(
				{ userid: targetId },
				{ $set: { userid: targetId, color, updatedBy: user.id, updatedAt: new Date() } }
			);

			await updateColor();

			this.sendReply(`|raw|You have given <b><font color="${color}">${Chat.escapeHTML(name)}</font></b> a custom color.`);

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox">${nameColor(user.name, true, true)} set custom color for ${nameColor(name, true, false)} to ${color}.</div>`).update();
			}
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');
			if (!target) return this.parse('/customcolorhelp');

			const targetId = toID(target);
			const colorDoc = await ImpulseDB('customcolors').findOne({ userid: targetId });

			if (!colorDoc) return this.errorReply(`${target} does not have a custom color.`);

			await ImpulseDB('customcolors').deleteOne({ userid: targetId });
			await updateColor();

			this.sendReply(`You removed ${target}'s custom color.`);

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

			try {
				const colorDocs = await ImpulseDB('customcolors').find({}, { sort: { userid: 1 } });

				if (colorDocs.length === 0) return this.sendReply('No custom colors are currently set.');

				const rows: string[][] = colorDocs.map(doc => [
					Chat.escapeHTML(doc.userid),
					`<code>${Chat.escapeHTML(doc.color)}</code>`,
					`<b><font color="${doc.color}">${Chat.escapeHTML(doc.userid)}</font></b>`,
				]);

				const output = generateThemedTable(
					`Custom Colors (${colorDocs.length} users)`,
					['User', 'Color', 'Preview'],
					rows,
				);

				this.sendReply(`|raw|${output}`);
			} catch {
				return this.errorReply('Failed to list custom colors.');
			}
		},

		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/customcolor set [user], [hex]", desc: "Set color for a user. Requires: &." },
				{ cmd: "/customcolor delete [user]", desc: "Delete color for a user. Requires: &." },
				{ cmd: "/customcolor reload", desc: "Reload all custom colors. Requires: &." },
				{ cmd: "/customcolor preview [user], [hex]", desc: "Preview color for a user." },
				{ cmd: "/customcolor list", desc: "List all custom colors. Requires: &." },
			];
			const html = `<center><strong>Custom Color Commands:</strong><br>Alias: /cc</center><hr><ul style="list-style-type:none;padding-left:0;">` +
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
