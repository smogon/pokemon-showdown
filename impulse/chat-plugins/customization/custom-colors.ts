/*
* Pokemon Showdown
* Custom Colors Commands
* @author MusaddikTemkar
*/

import https from 'https';
import { FS } from '../../../lib';
import { ImpulseDB } from '../../impulse-db';
import { validateHexColor, clearColorCache, loadCustomColorsFromDB, nameColor } from '../../colors';

const STAFF_ROOM_ID = 'staff';

Impulse.reloadCSS = () => {
	const url = `https://play.pokemonshowdown.com/customcss.php?server=${Config.serverid}&invalidate`;
	const req = https.get(url, res => {});
	req.on('error', err => {});
	req.end();
};

const generateCSS = (name: string, color: string): string => {
	const id = toID(name);
	return `[class$="chatmessage-${id}"] strong, [class$="chatmessage-${id} mine"] strong, ` +
		`[class$="chatmessage-${id} highlighted"] strong, [id$="-userlist-user-${id}"] strong em, ` +
		`[id$="-userlist-user-${id}"] strong, [id$="-userlist-user-${id}"] span ` +
		`{ color: ${color} !important; }\n`;
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
		// Set notification
		if (targetUser?.connected) {
			const escapedName = Chat.escapeHTML(user.name);
			targetUser.popup(`|html|${escapedName} set your custom color to <font color="${color}">${color}</font>.`);
		}
		notifyStaffRoom(`${userNameColor} set custom color for ${targetNameColor} to ${color}.`);
	} else {
		// Delete notification
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
			if (targetId.length > 19) return this.errorReply('Usernames are not this long...');

			if (!validateHexColor(color)) {
				return this.errorReply('Invalid hex format. Use #RGB or #RRGGBB.');
			}

			await ImpulseDB('customcolors').upsert(
				{ userid: targetId },
				{ $set: { userid: targetId, color, updatedBy: user.id, updatedAt: new Date() } }
			);

			await updateColor();

			const escapedName = Chat.escapeHTML(name);
			this.sendReply(
				`|raw|You have given <b><font color="${color}">${escapedName}</font></b> a custom color.`
			);

			sendColorNotifications(user, name, color);
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');
			if (!target) return this.parse('/cc help');

			const targetId = toID(target);
			const colorDoc = await ImpulseDB('customcolors').findOne({ userid: targetId });

			if (!colorDoc) return this.errorReply(`${target} does not have a custom color.`);

			await ImpulseDB('customcolors').deleteOne({ userid: targetId });
			await updateColor();

			this.sendReply(`You removed ${target}'s custom color.`);

			sendColorNotifications(user, target, null);
		},

		preview(target, room, user) {
			if (!this.runBroadcast()) return;
			const [name, color] = target.split(',').map(t => t.trim());
			if (!name || !color) return this.parse('/cc help');

			if (!validateHexColor(color)) {
				return this.errorReply('Invalid hex format. Use #RGB or #RRGGBB.');
			}

			const escapedName = Chat.escapeHTML(name);
			return this.sendReplyBox(`<b><font size="3" color="${color}">${escapedName}</font></b>`);
		},

		async reload(target: string, room: ChatRoom, user: User) {
			this.checkCan('roomowner');
			await updateColor();
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
