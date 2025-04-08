/* Symbol Colors Commands
* Credits: Prince Sky
*/

import { FS } from '../lib/fs';

interface SymbolColors {
	[userid: string]: string;
}

const SC_FILE = 'impulse-db/sc.json';
const CSS_FILE = 'config/custom.css';

let scData = FS(SC_FILE).readIfExistsSync();
let sc: SymbolColors = {};

if (scData) {
	try {
		sc = JSON.parse(scData);
	} catch (e: any) {
		console.error(`Failed to parse symbol color data: ${e.message}`);
		sc = {};
	}
}

function updateSC() {
	FS(SC_FILE).writeUpdate(() => (
		JSON.stringify(sc)
	));

	let newCss = "\n/* Symbol Colors START */\n";

	for (const name in sc) {
		newCss += generateCSS(name, sc[name]);
	}
	newCss += "/* Symbol Colors END */\n";

	let file = FS(CSS_FILE).readIfExistsSync().split("\n");
	const start = file.indexOf("/* Symbol Colors START */");
	const end = file.indexOf("/* Symbol Colors END */");
	if (start !== -1 && end !== -1 && start < end) {
		file.splice(start, (end - start) + 1);
	}
	FS(CSS_FILE).writeUpdate(() => (
		file.join("\n") + newCss
	));
	global.Server?.reloadCSS?.();
}

function generateCSS(name: string, color: string) {
	const id = toID(name);
	return `[id*="-userlist-user-${id}"] button > em.group {\nbackground: url("${color}") no-repeat right !important;\n}\n`;
}

export const commands: Chat.Commands = {
	symbolcolor: 'sc',
	sc: {
		set(target, room, user) {
			this.checkCan('globalban');
			const parts = target.split(',').map(p => p.trim());
			if (parts.length !== 2) return this.parse('/help sc');
			const userid = toID(parts[0]);
			const color = parts[1];
			if (userid.length > 19) return this.errorReply("Usernames are not this long...");
			if (sc[userid]) return this.errorReply("This user already has a custom symbol color. Do /sc delete [user] and then set their new symbol color.");
			this.sendReply(`|raw|You have given ${Impulse.nameColor(parts[0], true, true)} ${parts[0]} a symbol color.`);
			Monitor.log(`${parts[0]} has received a symbol color from ${user.name}.`);
			this.privateModAction(`(${parts[0]} has received symbol color: "${color}" from ${user.name}.)`);
			this.modlog('SC', userid, `Set symbol color to ${color}`);
			const targetUser = Users.get(userid);
			if (targetUser?.connected) {
				targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has set your symbol color to: ${color}<br /><center>Refresh, if you don't see it.</center>`);
			}
			sc[userid] = color;
			updateSC();
		},

		remove: 'delete',
		delete(target, room, user) {
			this.checkCan('globalban');
			const userid = toID(target);
			if (!sc[userid]) return this.errorReply(`/sc - ${target} does not have a symbol color.`);
			delete sc[userid];
			updateSC();
			this.sendReply(`You removed ${target}'s symbol color.`);
			Monitor.log(`${user.name} removed ${target}'s symbol color.`);
			this.privateModAction(`(${target}'s symbol color was removed by ${user.name}.)`);
			this.modlog('SC', userid, `Removed symbol color.`);
			const targetUser = Users.get(userid);
			if (targetUser?.connected) {
				targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has removed your symbol color.`);
			}
		},

		'': 'help',
		help() {
			this.parse('/schelp');
		},
	},

	schelp: [
		"Commands Include:",
		"/sc set [user], [color] - Gives [user] a symbol color of [color] ( Requires: @ and higher ).",
		"/sc delete [user] - Deletes a user's symbol color ( Requires: @ and higher ).",
	],
};
