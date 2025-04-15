/******************************************
* Pokemon Showdown Custom Symbol Colors   *
* Author: @musaddiktemkar                 *
*******************************************/

import { FS } from '../lib/fs';

const STAFF_ROOM_ID = 'staff';

interface SymbolColors {
	[userid: string]: string;
}

let symbolcolors: SymbolColors = {};

try {
	const data = FS('impulse-db/symbolcolors.json').readIfExistsSync();
	if (data) {
		symbolcolors = JSON.parse(data);
	}
} catch (err) {
	console.error(`Failed to parse symbolcolors.json:`, err);
}

async function updateSymbolColors(): Promise<void> {
	try {
		await FS('impulse-db/symbolcolors.json').writeUpdate(() => JSON.stringify(symbolcolors));
		let newCss = '/* SYMBOLCOLORS START */\n';
		for (const name in symbolcolors) {
			newCss += `[id$="-userlist-user-${toID(name)}"] button > em.group {\n color: ${symbolcolors[name]}; \n}\n` +
				`\n[class$="chatmessage-${toID(name)}"] strong small, .groupsymbol {\n color: ${symbolcolors[name]}; \n}\n`;
		}
		newCss += '/* SYMBOLCOLORS END */\n';

		const file = FS('config/custom.css').readIfExistsSync().split('\n');
		const start = file.indexOf('/* SYMBOLCOLORS START */');
		const end = file.indexOf('/* SYMBOLCOLORS END */');
		if (start !== -1 && end !== -1) {
			file.splice(start, (end - start) + 1);
		}
		await FS('config/custom.css').writeUpdate(() => file.join('\n') + newCss);
		Impulse.reloadCSS();
	} catch (err) {
		console.error('Error updating symbol colors:', err);
	}
}

export const commands: Chat.ChatCommands = {
	symbolcolor: {
		async set(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('globalban');
			const [name, imageUrl] = target.split(',').map(s => s.trim());
			if (!name || !imageUrl) return this.parse('/help symbolcolor');
			const userId = toID(name);
			if (userId.length > 19) return this.errorReply('Usernames are not this long...');
			if (symbolcolors[userId]) return this.errorReply('This user already has a symbol color. Remove it first with /symbolcolor delete [user].');
			symbolcolors[userId] = imageUrl;
			await updateSymbolColors();
			this.sendReply(`|raw|You have given ${Impulse.nameColor(name, true, false)} a symbol color.`);

			const targetUser = Users.get(userId);
			if (targetUser?.connected) {
				targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has set your userlist symbol color<br /><center>Refresh, If you don't see it.</center>`);
			}

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox"> ${Impulse.nameColor(user.name, true, true)} set symbol color for ${Impulse.nameColor(name, true, false)}</div>`).update();
			}
		},

		async delete(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('globalban');
			const userId = toID(target);
			if (!symbolcolors[userId]) return this.errorReply(`${target} does not have a symbol color.`);
			delete symbolcolors[userId];
			await updateSymbolColors();
			this.sendReply(`You removed ${target}'s symbol color.`);

			const targetUser = Users.get(userId);
			if (targetUser?.connected) {
				targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has removed your userlist symbol color.`);
			}

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} removed symbol color for ${Impulse.nameColor(target, true, false)}.</div>`).update();
			}
		},

		''(target, room, user) {
			this.parse('/symbolcolorhelp');
		},
	},

	symbolcolorhelp(target: string, room: ChatRoom | null, user: User) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`<b>Custom Symbol Color Commands:</b><br>` +
			`• <code>/symbolcolor set [username], [hex]</code> - Gives [user] a symbol color (Requires: @ and higher)<br>` +
			`• <code>/symbolcolor delete [username]</code> - Removes a user's symbol color (Requires: @ and higher)`
		);
	},
};
