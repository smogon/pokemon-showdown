/*
* Pokemon Showdown
* Custom Colors Commands
* @author MusaddikTemkar
*/

import https from 'https';
import { FS } from '../../../lib';
import { ImpulseDB } from '../../impulse-db';
import { validateHexColor, clearColorCache, loadCustomColorsFromDB, nameColor } from '../../colors';

const CONFIG_PATH = 'config/custom.css';
const STAFF_ROOM_ID = 'staff';
const START_TAG = '/* COLORS START */';
const END_TAG = '/* COLORS END */';

interface CustomColorDocument {
	userid: string;
	color: string;
	updatedBy: string;
	updatedAt: Date;
}

const CustomColorsDB = ImpulseDB<CustomColorDocument>('customcolors');

Impulse.reloadCSS = () => {
	const url = `https://play.pokemonshowdown.com/customcss.php?server=${Config.serverid}&invalidate`;
	const req = https.get(url, () => {});
	req.on('error', () => {});
	req.end();
};

const parseArgs = (target: string) => {
	const [name, color] = target.split(',').map(t => t.trim());
	return { name, targetId: toID(name), color };
};

const generateCSS = (name: string, color: string): string => {
	const id = toID(name);
	const selectors = [
		`[class$="chatmessage-${id}"] strong`,
		`[class$="chatmessage-${id} mine"] strong`,
		`[class$="chatmessage-${id} highlighted"] strong`,
		`[id$="-userlist-user-${id}"] strong em`,
		`[id$="-userlist-user-${id}"] strong`,
		`[id$="-userlist-user-${id}"] span`
	];
	return `${selectors.join(', ')} { color: ${color} !important; }`;
};

const updateColor = async () => {
	try {
		const colorDocs = await CustomColorsDB.find({});
		
		const rules = colorDocs.map(doc => generateCSS(doc.userid, doc.color)).join('\n');
		const cssBlock = `${START_TAG}\n${rules}\n${END_TAG}\n`;

		const fileContent = await FS(CONFIG_PATH).readIfExists();
		const fileLines = fileContent ? fileContent.split('\n') : [];

		const start = fileLines.indexOf(START_TAG);
		const end = fileLines.indexOf(END_TAG);

		// Remove existing block if found
		if (start !== -1 && end !== -1) {
			fileLines.splice(start, (end - start) + 1);
		}

		// Append new block to the end
		FS(CONFIG_PATH).writeUpdate(() => fileLines.join('\n') + cssBlock);

		clearColorCache();
		await loadCustomColorsFromDB();
		Impulse.reloadCSS();
	} catch (err) {
		console.error("Error updating custom colors:", err);
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
	color: string | null, 
	action: 'set' | 'delete'
) => {
	const userHtml = nameColor(user.name, true, true);
	const targetHtml = nameColor(targetName, true, false);

	if (action === 'set' && color) {
		notifyStaffRoom(`${userHtml} set custom color for ${targetHtml} to ${color}.`);
	} else if (action === 'delete') {
		const targetUser = Users.get(targetName);
		if (targetUser?.connected) {
			targetUser.popup(`${user.name} removed your custom color.`);
		}
		notifyStaffRoom(`${userHtml} removed custom color for ${targetHtml}.`);
	}
};

export const commands: Chat.ChatCommands = {
	customcolor: {
		''(target) {
			this.parse('/cc help');
		},

		async set(target, room, user) {
			this.checkCan('roomowner');
			const { name, targetId, color } = parseArgs(target);
			
			if (!name || !color) return this.parse('/cc help');
			if (targetId.length > 19) return this.errorReply('Usernames are not this long...');
			if (!validateHexColor(color)) return this.errorReply('Invalid hex format. Use #RGB or #RRGGBB.');

			await CustomColorsDB.upsert(
				{ userid: targetId },
				{ $set: { userid: targetId, color, updatedBy: user.id, updatedAt: new Date() } }
			);

			await updateColor();

			const escapedName = Chat.escapeHTML(name);
			this.sendReply(`|raw|You have given <b><font color="${color}">${escapedName}</font></b> a custom color.`);
			sendColorNotifications(user, name, color, 'set');
		},

		async delete(target, room, user) {
			this.checkCan('roomowner');
			if (!target) return this.parse('/cc help');

			const targetId = toID(target);
			const colorDoc = await CustomColorsDB.findOne({ userid: targetId });

			if (!colorDoc) return this.errorReply(`${target} does not have a custom color.`);

			await CustomColorsDB.deleteOne({ userid: targetId });
			await updateColor();

			this.sendReply(`You removed ${target}'s custom color.`);
			sendColorNotifications(user, target, null, 'delete');
		},

		preview(target) {
			if (!this.runBroadcast()) return;
			const { name, color } = parseArgs(target);
			
			if (!name || !color) return this.parse('/cc help');
			if (!validateHexColor(color)) return this.errorReply('Invalid hex format. Use #RGB or #RRGGBB.');

			const escapedName = Chat.escapeHTML(name);
			return this.sendReplyBox(`<b><font size="3" color="${color}">${escapedName}</font></b>`);
		},

		async reload(target, room, user) {
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
			
			const listHtml = helpList.map(({ cmd, desc }) => 
				`<li><b>${cmd}</b> - ${desc}</li>`
			).join('<hr>');

			const html = [
				`<center><strong>Custom Color Commands:</strong><br>Alias: /cc</center>`,
				`<hr><ul style="list-style-type:none;padding-left:0;">`,
				listHtml,
				`</ul><small>Format: #RGB or #RRGGBB</small>`
			].join('');
			
			this.sendReplyBox(html);
		},
	},
	cc: 'customcolor',
	customcolorhelp: 'customcolor.help',
	cchelp: 'customcolor.help',
};
