import { FS, Utils } from '../../lib';

const STORAGE_PATH = 'config/chat-plugins/room-custom-bot.json';
const MAX_TRIGGER_LENGTH = 100;
const MAX_RESPONSE_LENGTH = 500;

interface BotResponse {
	response: string;
	createdBy: string;
	timestamp: number;
}

interface RoomBotData {
	enabled: boolean;
	responses: { [trigger: string]: BotResponse };
}

const roomBotData: { [roomid: string]: RoomBotData } = JSON.parse(
	FS(STORAGE_PATH).readIfExistsSync() || "{}"
);

function saveData() {
	FS(STORAGE_PATH).writeUpdate(() => JSON.stringify(roomBotData));
}

function getRoom(roomid: RoomID): RoomBotData {
	if (!roomBotData[roomid]) {
		roomBotData[roomid] = { enabled: true, responses: {} };
	}
	return roomBotData[roomid];
}

export const chatfilter: Chat.ChatFilter = function (message, user, room) {
	if (!room || !message) return;
	if (message.startsWith('/') || message.startsWith('!')) return;

	const data = roomBotData[room.roomid];
	if (!data?.enabled) return;

	const lowerMessage = message.toLowerCase();
	for (const trigger in data.responses) {
		if (lowerMessage.includes(trigger)) {
			const response = data.responses[trigger].response;
			// delay to send after user message
			setTimeout(() => {
				room.add(`|c|*Room Bot|${response}`);
				room.update();
			}, 100);
			break;
		}
	}
};

export const commands: Chat.ChatCommands = {
	roombot: {
		''(target, room, user) {
			room = this.requireRoom();
			const data = roomBotData[room.roomid];
			const enabled = data?.enabled ?? true;
			const count = data ? Object.keys(data.responses).length : 0;
			this.sendReply(`Room Bot is ${enabled ? 'enabled' : 'disabled'} with ${count} response(s).`);
		},

		custom(target, room, user) {
			room = this.requireRoom();
			this.checkCan('declare', null, room);
			if (!room.persist) {
				throw new Chat.ErrorMessage("This command is unavailable in temporary rooms.");
			}

			const [trigger, ...responseParts] = target.split(',');
			if (!trigger || !responseParts.length) {
				return this.parse('/help roombot');
			}

			const trimmedTrigger = trigger.trim();
			const response = responseParts.join(',').trim();

			if (!trimmedTrigger || !response) {
				return this.parse('/help roombot');
			}
			if (trimmedTrigger.length > MAX_TRIGGER_LENGTH) {
				throw new Chat.ErrorMessage(`Trigger must be ${MAX_TRIGGER_LENGTH} characters or less.`);
			}
			if (response.length > MAX_RESPONSE_LENGTH) {
				throw new Chat.ErrorMessage(`Response must be ${MAX_RESPONSE_LENGTH} characters or less.`);
			}

			const data = getRoom(room.roomid);
			const exists = trimmedTrigger.toLowerCase() in data.responses;
			data.responses[trimmedTrigger.toLowerCase()] = {
				response,
				createdBy: user.id,
				timestamp: Date.now(),
			};
			saveData();

			this.privateModAction(`${user.name} ${exists ? 'updated' : 'added'} a room bot response for "${trimmedTrigger}".`);
			this.modlog('ROOMBOT ADD', null, `${exists ? 'updated' : 'added'} "${trimmedTrigger}" => "${response}"`);
		},

		remove(target, room, user) {
			room = this.requireRoom();
			this.checkCan('declare', null, room);

			const trigger = target.trim().toLowerCase();
			if (!trigger) return this.parse('/help roombot');

			const data = roomBotData[room.roomid];
			if (!data?.responses[trigger]) {
				throw new Chat.ErrorMessage(`No response found for trigger "${target}".`);
			}

			delete data.responses[trigger];
			if (!Object.keys(data.responses).length) {
				delete roomBotData[room.roomid];
			}
			saveData();

			this.privateModAction(`${user.name} removed the room bot response for "${target}".`);
			this.modlog('ROOMBOT REMOVE', null, `"${target}"`);
		},

		list(target, room, user) {
			room = this.requireRoom();
			this.checkCan('show', null, room);

			const data = roomBotData[room.roomid];
			if (!data || !Object.keys(data.responses).length) {
				throw new Chat.ErrorMessage("This room has no bot responses.");
			}

			let buf = `<div class="ladder pad"><h2>Room Bot Responses</h2>`;
			buf += `<table><tr><th>Trigger</th><th>Response</th><th>Added By</th><th>Date</th></tr>`;
			for (const trigger in data.responses) {
				const entry = data.responses[trigger];
				const date = new Date(entry.timestamp).toLocaleDateString();
				buf += `<tr><td>${Utils.escapeHTML(trigger)}</td><td>${Utils.escapeHTML(entry.response)}</td><td><username class="username">${Utils.escapeHTML(entry.createdBy)}</username></td><td>${date}</td></tr>`;
			}
			buf += `</table></div>`;
			this.sendReplyBox(buf);
		},

		toggle(target, room, user) {
			room = this.requireRoom();
			this.checkCan('declare', null, room);

			const data = getRoom(room.roomid);
			if (!target) {
				this.sendReply(`Room Bot is currently ${data.enabled ? 'enabled' : 'disabled'}.`);
				return;
			}

			if (this.meansYes(target)) {
				if (data.enabled) throw new Chat.ErrorMessage("Room Bot is already enabled.");
				data.enabled = true;
			} else if (this.meansNo(target)) {
				if (!data.enabled) throw new Chat.ErrorMessage("Room Bot is already disabled.");
				data.enabled = false;
			} else {
				return this.parse('/help roombot');
			}
			saveData();

			this.privateModAction(`${user.name} ${data.enabled ? 'enabled' : 'disabled'} the room bot.`);
			this.modlog('ROOMBOT TOGGLE', null, data.enabled ? 'on' : 'off');
		},

		clear(target, room, user) {
			room = this.requireRoom();
			this.checkCan('declare', null, room);

			const data = roomBotData[room.roomid];
			if (!data || !Object.keys(data.responses).length) {
				throw new Chat.ErrorMessage("This room has no bot responses to clear.");
			}

			const count = Object.keys(data.responses).length;
			data.responses = {};
			saveData();

			this.privateModAction(`${user.name} cleared all ${count} room bot response(s).`);
			this.modlog('ROOMBOT CLEAR', null, `${count} responses`);
		},
	},

	roombothelp: 'custombothelp',
	custombothelp(target, room, user) {
		this.sendReplyBox(
			`<strong>Room Bot Commands</strong><br />` +
			`<code>/roombot</code> - Shows status and response count.<br />` +
			`<code>/roombot custom [trigger], [response]</code> - Adds or updates a trigger-response pair. Requires: # ~<br />` +
			`<code>/roombot remove [trigger]</code> - Removes a trigger-response pair. Requires: # ~<br />` +
			`<code>/roombot list</code> - Shows all triggers and responses. Requires: + % @ # ~<br />` +
			`<code>/roombot toggle [on/off]</code> - Enables or disables the bot. Requires: # ~<br />` +
			`<code>/roombot clear</code> - Removes all responses. Requires: # ~`
		);
	},
};

export const handlers: Chat.Handlers = {
	onRenameRoom(oldID, newID) {
		if (roomBotData[oldID]) {
			roomBotData[newID] = roomBotData[oldID];
			delete roomBotData[oldID];
			saveData();
		}
	},
};
