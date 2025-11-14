/*
* Pokemon Showdown
* Symbol Colors Commands
* @author PrinceSky-Git
*/

import { FS } from '../../../lib';
import { ImpulseDB } from '../../impulse-db';
import { nameColor } from '../../colors';

const STAFF_ROOM_ID = 'staff';
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

const updateSymbolColors = async (): Promise<void> => {
	try {
		const symbolColorDocs = await SymbolColorsDB.find({});
		let css = '/* SYMBOLCOLORS START */\n';

		symbolColorDocs.forEach(doc => {
			const selector = `[id$="-userlist-user-${doc._id}"] button > em.group`;
			const chatSelector = `[class$="chatmessage-${doc._id}"] strong small, .groupsymbol`;
			css += `${selector} { color: ${doc.color}; }\n`;
			css += `${chatSelector} { color: ${doc.color}; }\n`;
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

const notifyUser = (userId: string, staffName: string, color: string, action: string): void => {
	const user = Users.get(userId);
	if (user?.connected) {
		const userNameColor = nameColor(staffName, true, true);
		const colorSpan = `<span style="color: ${color}; font-weight: bold;">${color}</span>`;
		const msg = `${userNameColor} ${action} your symbol color to ${colorSpan}` +
			`<br /><center>Refresh if you don't see it.</center>`;
		user.popup(`|html|${msg}`);
	}
};

const notifyStaff = (staffName: string, targetName: string, color: string, action: string): void => {
	const room = Rooms.get(STAFF_ROOM_ID);
	if (room) {
		const staffNameColor = nameColor(staffName, true, true);
		const targetNameColor = nameColor(targetName, true, false);
		const colorSpan = `<span style="color: ${color}">■ ${color}</span>`;
		const msg = `${staffNameColor} ${action} symbol color for ${targetNameColor}: ${colorSpan}`;
		room.add(`|html|<div class="infobox">${msg}</div>`).update();
	}
};

export const commands: Chat.ChatCommands = {
	symbolcolor: {
		async set(this: CommandContext, target: string, room: Room, user: User): Promise<void> {
			this.checkCan('roomowner');
			const [name, color] = target.split(',').map(s => s.trim());
			if (!name || !color) return this.parse('/help symbolcolor');

			const userId = toID(name);
			if (userId.length > 19) return this.errorReply('Usernames are not this long...');

			if (!isValidColor(color)) {
				return this.errorReply('Invalid color. Use hex format: #FF5733 or #F73');
			}

			if (await SymbolColorsDB.exists({ _id: userId })) {
				return this.errorReply(
					'User already has symbol color. Remove with /symbolcolor delete.'
				);
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

			const targetNameColor = nameColor(name, true, false);
			const colorSpan = `<span style="color: ${color}">■</span>`;
			this.sendReply(`|raw|You have given ${targetNameColor} a symbol color: ${colorSpan}`);
			notifyUser(userId, user.name, color, 'has set');
			notifyStaff(user.name, name, color, 'set');
		},

		async update(this: CommandContext, target: string, room: Room, user: User): Promise<void> {
			this.checkCan('roomowner');
			const [name, color] = target.split(',').map(s => s.trim());
			if (!name || !color) return this.parse('/help symbolcolor');

			const userId = toID(name);

			if (!isValidColor(color)) {
				return this.errorReply('Invalid color. Use hex format: #FF5733 or #F73');
			}

			const oldColor = await SymbolColorsDB.findOne(
				{ _id: userId },
				{ projection: { color: 1 } }
			);
			if (!oldColor) {
				return this.errorReply('User does not have symbol color. Use /symbolcolor set.');
			}

			await SymbolColorsDB.updateOne(
				{ _id: userId },
				{ $set: { color, updatedAt: new Date() } }
			);
			await updateSymbolColors();

			const targetNameColor = nameColor(name, true, false);
			const colorSpan = `<span style="color: ${color}">■</span>`;
			this.sendReply(`|raw|You have updated ${targetNameColor}'s symbol color to: ${colorSpan}`);
			notifyUser(userId, user.name, color, 'has updated');
			notifyStaff(user.name, name, color, 'updated');
		},

		async delete(this: CommandContext, target: string, room: Room, user: User): Promise<void> {
			this.checkCan('roomowner');
			const userId = toID(target);

			const symbolColor = await SymbolColorsDB.findOne(
				{ _id: userId },
				{ projection: { color: 1 } }
			);
			if (!symbolColor) {
				return this.errorReply(`${target} does not have a symbol color.`);
			}

			await SymbolColorsDB.deleteOne({ _id: userId });
			await updateSymbolColors();

			this.sendReply(`You removed ${target}'s symbol color.`);

			const targetUser = Users.get(userId);
			if (targetUser?.connected) {
				const userNameColor = nameColor(user.name, true, true);
				targetUser.popup(`|html|${userNameColor} has removed your symbol color.`);
			}

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				const staffNameColor = nameColor(user.name, true, true);
				const targetNameColor = nameColor(target, true, false);
				const msg = `${staffNameColor} removed symbol color for ${targetNameColor}.`;
				staffRoom.add(`|html|<div class="infobox">${msg}</div>`).update();
			}
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{
					cmd: "/symbolcolor set [user], [hex]",
					desc: "Set symbol color. Requires: &.",
				},
				{
					cmd: "/symbolcolor update [user], [hex]",
					desc: "Update color. Requires: &.",
				},
				{
					cmd: "/symbolcolor delete [user]",
					desc: "Remove color. Requires: &.",
				},
			];
			const html = `<center><strong>Custom Symbol Color Commands:</strong><br>Alias: /sc</center>` +
				`<hr><ul style="list-style-type:none;padding-left:0;">` +
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
