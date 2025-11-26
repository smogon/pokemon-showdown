/*
* Pokemon Showdown
* Symbol Colors Commands
* @author PrinceSky-Git
*/

import { FS } from '../../../lib';
import { ImpulseDB } from '../../impulse-db';
import { nameColor } from '../../colors';

const CONFIG_PATH = 'config/custom.css';
const STAFF_ROOM_ID = 'staff';
const START_TAG = '/* SYMBOLCOLORS START */';
const END_TAG = '/* SYMBOLCOLORS END */';
const HEX_REGEX = /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$/;

interface SymbolColorDocument {
	_id: string;
	color: string;
	setBy: string;
	createdAt: Date;
	updatedAt: Date;
}

const SymbolColorsDB = ImpulseDB<SymbolColorDocument>('symbolcolors');

const isValidColor = (color: string): boolean => HEX_REGEX.test(color);

const parseArgs = (target: string) => {
	const [name, color] = target.split(',').map(s => s.trim());
	return { name, userId: toID(name), color };
};

const formatColorSpan = (color: string, content: string = '■') => 
	`<span style="color: ${color}">${content}</span>`;

const updateSymbolColors = async (): Promise<void> => {
	try {
		const docs = await SymbolColorsDB.find({});
		
		const cssRules = docs.map(doc => {
			const selector = `[id$="-userlist-user-${doc._id}"] button > em.group`;
			const chatSelector = `[class$="chatmessage-${doc._id}"] strong small, .groupsymbol`;
			return `${selector} { color: ${doc.color}; }\n${chatSelector} { color: ${doc.color}; }`;
		}).join('\n');

		const cssBlock = `${START_TAG}\n${cssRules}\n${END_TAG}\n`;

		const fileContent = FS(CONFIG_PATH).readIfExistsSync().split('\n');
		const startIndex = fileContent.indexOf(START_TAG);
		const endIndex = fileContent.indexOf(END_TAG);

		if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
			fileContent.splice(startIndex, (endIndex - startIndex + 1), ...cssBlock.split('\n'));
			FS(CONFIG_PATH).writeUpdate(() => fileContent.join('\n'));
		} else {
			FS(CONFIG_PATH).writeUpdate(() => fileContent.join('\n') + '\n' + cssBlock);
		}
		
		Impulse.reloadCSS();
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
	const staffHtml = nameColor(staffUser.name, true, true);
	const targetHtml = nameColor(targetName, true, false);

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
		async set(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('roomowner');
			const { name, userId, color } = parseArgs(target);

			if (!name || !color) return this.parse('/sc help');
			if (userId.length > 19) return this.errorReply('Usernames are not this long...');
			if (!isValidColor(color)) return this.errorReply('Invalid color. Use hex format: #FF5733 or #F73');

			if (await SymbolColorsDB.exists({ _id: userId })) {
				return this.errorReply('User already has symbol color. Remove with /symbolcolor delete.');
			}

			const now = new Date();
			await SymbolColorsDB.insertOne({
				_id: userId,
				color,
				setBy: user.id,
				createdAt: now,
				updatedAt: now,
			});

			await updateSymbolColors();

			const targetHtml = nameColor(name, true, false);
			this.sendReply(`|raw|You have given ${targetHtml} a symbol color: ${formatColorSpan(color)}`);
			sendSymbolColorNotifications(user, name, color, 'set');
		},

		async update(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('roomowner');
			const { name, userId, color } = parseArgs(target);

			if (!name || !color) return this.parse('/sc help');
			if (!isValidColor(color)) return this.errorReply('Invalid color. Use hex format: #FF5733 or #F73');

			const existingDoc = await SymbolColorsDB.findOne({ _id: userId }, { projection: { color: 1 } });
			if (!existingDoc) {
				return this.errorReply('User does not have symbol color. Use /symbolcolor set.');
			}

			await SymbolColorsDB.updateOne(
				{ _id: userId },
				{ $set: { color, updatedAt: new Date() } }
			);
			await updateSymbolColors();

			const targetHtml = nameColor(name, true, false);
			this.sendReply(`|raw|You have updated ${targetHtml}'s symbol color to: ${formatColorSpan(color)}`);
			sendSymbolColorNotifications(user, name, color, 'updated');
		},

		async delete(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('roomowner');
			const userId = toID(target);

			if (!await SymbolColorsDB.exists({ _id: userId })) {
				return this.errorReply(`${target} does not have a symbol color.`);
			}

			await SymbolColorsDB.deleteOne({ _id: userId });
			await updateSymbolColors();

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
