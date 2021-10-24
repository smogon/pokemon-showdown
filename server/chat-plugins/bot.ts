/**
 * Miscellaneous utilities for bots, most prevalently the ability to register /commands.
 * @author mia-pi-git
 */
import {FS, Utils} from '../../lib';
import type {CommandParser} from '../chat';

export const commandData: {
	[command: string]: {
		owner: string,
		/** Bot's command prefix. */
		prefix: string,
		/** The actual bot command (ie for the bot command ~foo, it would be foo) */
		command: string,
	},
} = {};

export function save() {
	FS('config/chat-plugins/bot.json').writeUpdate(() => JSON.stringify(commandData));
}

try {
	const data = JSON.parse(FS(`config/chat-plugins/bot.json`).readSync());
	Object.assign(commandData, data);
} catch {}

export const commands: Chat.ChatCommands = {
	runbotcommand(target, room, user) {
		this.checkChat();
		room = this.requireRoom();
		let [possibleCmd, cmdTarget] = Utils.splitFirst(target, ',', 3);
		possibleCmd = toID(possibleCmd);
		cmdTarget = cmdTarget.trim();
		if (!possibleCmd || !toID(cmdTarget)) {
			return this.parse('/help runbotcommand');
		}
		const data = commandData[possibleCmd];
		if (!data) {
			return this.errorReply(`That bot command is not yet registered.`);
		}
		const bot = Users.get(data.owner);
		if (!bot?.connected) {
			return this.errorReply(`The bot '${data.owner}' is not connected, and so their commands cannot be used.`);
		}
		if (!bot.inRooms.has(room.roomid)) {
			return this.errorReply(
				`You must share a room with the bot ${bot.name} in order to use its commands ` +
				`(these are not native to PS, and are handled by an external bot).`
			);
		}
		bot.sendTo(
			room.roomid, `|c|${user.getIdentity()}|${data.prefix}${data.command} ${cmdTarget}`
		);
	},
	runbotcommandhelp: [
		`/runbotcommand [command], [target] - Runs the given registered bot command with [target] as its parameters.`,
	],
	registerbotcommand(target, room, user) {
		this.checkCan('globalban');
		let [cmd, prefix, botCmd, ownerName] = Utils.splitFirst(target, ',', 3);
		cmd = toID(cmd);
		botCmd = toID(botCmd);
		prefix = prefix.trim();
		const ownerId = toID(ownerName);
		if (!cmd || !prefix || !botCmd || !ownerId) {
			return this.parse(`/help registerbotcommand`);
		}
		if (commandData[cmd]) {
			return this.errorReply(`The command '${cmd}' is already registered for ${commandData[cmd].owner}.'`);
		}
		if (prefix.length > 1 || toID(prefix)) {
			return this.errorReply(`Bot command prefixes should only be one non-alphanumeric character.`);
		}
		if (Users.globalAuth.get(ownerId) !== '*') {
			return this.errorReply(`You can only register commands for global bots.`);
		}
		commandData[cmd] = {
			prefix,
			owner: ownerId,
			command: botCmd,
		};
		save();
		this.privateGlobalModAction(
			`${user.name} registered the command /${cmd} for '${ownerId}' (${prefix}${botCmd})`
		);
		this.globalModlog(`REGISTERBOTCOMMAND`, ownerId, `${cmd} (${prefix}${botCmd})`);
		Chat.refreshPageFor('botcommands');
	},
	removebotcommand(target, room, user) {
		this.checkCan('globalban');
		target = toID(target);
		const data = commandData[target];
		if (!data) {
			return this.errorReply(`No registered commands matching '${target}' were found.`);
		}
		delete commandData[target];
		save();
		this.privateGlobalModAction(`${user.name} deleted the bot command /${target} (owned by ${data.owner})`);
		this.globalModlog(
			`DEREGISTERBOTCOMMAND`,
			null,
			`/${target} - ${data.prefix}${data.command} (owned by ${data.owner})`
		);
		Chat.refreshPageFor('botcommands');
	},
	botcommands() {
		return this.parse(`/j view-botcommands`);
	},
};

export const pages: Chat.PageTable = {
	botcommands(query, user) {
		const manage = user.can('globalban');
		this.title = `[Bot Commands]`;
		let buf = `<div class="pad">`;
		buf += `<h2>Bot commands</h2><hr />`;
		if (!Object.keys(commandData).length) {
			buf += `<p class="message-error">There are currently no registered bot commands.</p>`;
			return buf;
		}
		buf += `<div class="ladder pad"><table>`;
		buf += `<tr><th>Command</th><th>Bot</th><th>Prefix</th><th>Bot command</th>`;
		if (manage) buf += `<th>Manage</th>`;
		buf += `<tr />`;
		for (const data of Object.values(commandData)) {
			buf += `<tr>`;
			buf += `<td><code>/${k}</code></td>`;
			buf += Utils.html`<td>${Users.get(data.owner)?.name || data.owner}</td>`;
			buf += Utils.html`<td><code>${data.prefix}</code></td>`;
			buf += Utils.html`<td><code>${data.command}</code> (<code>${data.prefix}${data.command}</code>)</td>`;
			if (manage) {
				buf += `<td><button name="send" value="/msgroom staff,/removebotcommand ${k}">Remove</button></td>`;
			}
			buf += `</tr>`;
		}
		return buf;
	},
};

export const parseCommand: Chat.CommandParser = (message, user, room, conn) => {
	if (!room) return null;
	let [possibleCmd, target] = Utils.splitFirst(message, ' ');
	possibleCmd = toID(possibleCmd);
	if (!possibleCmd) return null;
	const cmdData = commandData[possibleCmd];
	if (!cmdData) return null;
	const bot = Users.get(cmdData.owner);
	if (!bot || !bot.connected) {
		conn.sendTo(room.roomid, `|error|That bot was not found. Try again later.`);
		return null;
	}
	if (!bot.inRooms.has(room.roomid)) {
		conn.sendTo(
			room.roomid,
			`|error|You can only use that command in a room shared with the bot that owns it (${bot.name}).`
		);
		return null;
	}
	return {
		handler: commands.runbotcommand as Chat.AnnotatedChatHandler,
		target: `${possibleCmd},${target}`,
		fullCmd: 'runbotcmd',
		cmdToken: '/',
		cmd: 'runbotcmd',
	};
};
