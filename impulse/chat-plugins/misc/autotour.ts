/*
* Pokemon Showdown - Impulse Server
* Automated Tournaments Commands
* @author PrinceSky-Git
*/
import { ImpulseCollection } from '../../impulse-db';
import { Table } from '../../utils';
import { nameColor } from '../customization/custom-colors';

const AUTOTOUR_COLLECTION = 'autotour_configs';

interface PerRoomAutotourConfig {
	roomid: RoomID;
	formats: string[];
	types: string[];
	interval: number;
	autostart: number;
	autodq: number;
	playerCap: string;
	enabled: boolean;
	lastTourTime?: number;
	_id?: unknown;
}

const ALL_TOUR_TYPES = ['elimination', 'roundrobin'];

const defaultRoomConfig: Omit<PerRoomAutotourConfig, 'roomid'> = {
	formats: ['gen9randombattle'],
	types: [...ALL_TOUR_TYPES],
	interval: 60,
	autostart: 5,
	autodq: 2,
	playerCap: '',
	enabled: false,
	lastTourTime: 0,
};

const autotourCollection = new ImpulseCollection<PerRoomAutotourConfig>(AUTOTOUR_COLLECTION);
let autotourConfig: { [roomid: string]: PerRoomAutotourConfig } = {};
const autotourIntervals: { [roomid: string]: NodeJS.Timeout } = {};
const autotourIsInterval: { [roomid: string]: boolean } = {};

async function saveConfig(roomid: RoomID): Promise<void> {
	const config = autotourConfig[roomid];
	await autotourCollection.updateOne(
		{ roomid },
		{ $set: { ...config, roomid } },
		{ upsert: true }
	);
}

async function loadConfig(): Promise<void> {
	const configs = await autotourCollection.find({});
	autotourConfig = {};
	for (const config of configs) {
		autotourConfig[config.roomid] = config;
	}
}

function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function startRoomAutotourScheduler(roomid: RoomID): void {
	stopRoomAutotourScheduler(roomid);
	const config = autotourConfig[roomid];
	if (!config?.enabled) return;
	const min = Math.max(1, config.interval);
	const intervalMs = min * 60 * 1000;

	const now = Date.now();
	const lastRun = config.lastTourTime || 0;
	const delay = lastRun === 0 ? 0 : Math.max(0, (lastRun + intervalMs) - now);

	autotourIntervals[roomid] = setTimeout(() => {
		runAutotour(roomid);
		autotourIsInterval[roomid] = true;
		autotourIntervals[roomid] = setInterval(() => {
			const rm = Rooms.get(roomid);
			if (rm?.game && rm.game.gameid === 'tournament') {
				clearInterval(autotourIntervals[roomid]);
				autotourIsInterval[roomid] = false;
				autotourIntervals[roomid] = setTimeout(() => {
					runAutotour(roomid);
					autotourIsInterval[roomid] = true;
					autotourIntervals[roomid] = setInterval(() => runAutotour(roomid), intervalMs);
				}, intervalMs);
				return;
			}
			runAutotour(roomid);
		}, intervalMs);
	}, delay);
	autotourIsInterval[roomid] = false;
}

function stopRoomAutotourScheduler(roomid: RoomID): void {
	if (autotourIntervals[roomid]) {
		if (autotourIsInterval[roomid]) {
			clearInterval(autotourIntervals[roomid]);
		} else {
			clearTimeout(autotourIntervals[roomid]);
		}
	}
	delete autotourIntervals[roomid];
	delete autotourIsInterval[roomid];
}

function runAutotour(roomid: RoomID): void {
	const config = autotourConfig[roomid];
	if (!config?.enabled || !config.formats.length || !config.types.length) return;
	const room = Rooms.get(roomid);
	if (!room || room.type !== 'chat' || (room.game && room.game.gameid === 'tournament')) return;

	const format = pickRandom(config.formats);
	const type = pickRandom(config.types);
	
	const modifier = (type === 'elimination' && Math.random() < 0.2) ? '2' : undefined;

	const liveRoom = Rooms.get(roomid);
	if (!liveRoom || liveRoom.type !== 'chat') return;

	const mockContext: Chat.CommandContext = {
		sendReply: (msg: string) => liveRoom.add(msg).update(),
		errorReply: (msg: string) => liveRoom.add(`|error|${msg}`).update(),
		modlog: () => { },
		privateModAction: () => { },
		addModAction: () => { },
		parse: () => { },
		checkCan: () => { },
		checkChat: (msg: string) => msg,
		checkGame: () => { },
		checkRoom: () => { },
		can: () => true,
		runBroadcast: () => true,
		requireRoom: () => liveRoom,
		targetUser: null,
		user: { id: 'autotour', name: 'Autotour' } as unknown as User,
		room: liveRoom,
		connection: null as unknown as Connection,
	} as unknown as Chat.CommandContext;

	try {
		const tour = Tournaments.createTournament(
			liveRoom,
			format,
			type,
			config.playerCap || undefined,
			false,
			modifier,
			undefined,
			mockContext
		);
		if (tour) {
			if (config.autostart > 0) tour.setAutoStartTimeout(config.autostart * 60 * 1000, mockContext);
			if (config.autodq > 0) tour.setAutoDisqualifyTimeout(config.autodq * 60 * 1000, mockContext);
			autotourConfig[roomid].lastTourTime = Date.now();
			void saveConfig(roomid);
			liveRoom.update();
		}
	} catch (err) {
		const msg = `[autotour] Failed to start tournament in ${roomid}: ${(err as Error)?.message ?? err}`;
		if (liveRoom) liveRoom.add(`|error|${msg}`).update();
		console.error(msg);
	}
}

function checkRoomOwner(context: Chat.CommandContext, room: Room | null): boolean {
	if (!room) {
		context.errorReply('Use this command in a room.');
		return false;
	}
	if (context.user.can('declare', null, room) || room.auth.get(context.user.id) === Users.HOST_SYMBOL) return true;
	context.errorReply('Only the Room Owner or a global Admin can use this command.');
	return false;
}

function ensureRoomConfig(roomid: RoomID): PerRoomAutotourConfig {
	if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
	return autotourConfig[roomid];
}

async function modifyFormats(
	context: Chat.CommandContext,
	room: Room | null,
	target: string,
	action: 'set' | 'add' | 'remove'
): Promise<void> {
	if (!checkRoomOwner(context, room)) return;
	const roomid = room!.roomid;
	const config = ensureRoomConfig(roomid);

	const formats = target.split(',').map(s => toID(s.trim())).filter(Boolean);
	if (!formats.length) return context.errorReply(`Usage: /autotour ${action}format <format>`);
	
	if (action === 'set') config.formats = formats;
	if (action === 'add') {
		for (const f of formats) if (!config.formats.includes(f)) config.formats.push(f);
	}
	if (action === 'remove') {
		config.formats = config.formats.filter(f => !formats.includes(f as any));
	}

	await saveConfig(roomid);
	context.sendReply(`Formats updated for ${roomid}.`);
	if (config.enabled) startRoomAutotourScheduler(roomid);
}

export const commands: Chat.ChatCommands = {
	autotour: {
		async enable(target, room, user) {
			if (!checkRoomOwner(this, room)) return;
			const config = ensureRoomConfig(room!.roomid);
			config.enabled = true;
			await saveConfig(room!.roomid);
			startRoomAutotourScheduler(room!.roomid);
			this.sendReply(`Autotour enabled for ${room!.roomid}.`);
		},
		async disable(target, room, user) {
			if (!checkRoomOwner(this, room)) return;
			const config = ensureRoomConfig(room!.roomid);
			config.enabled = false;
			await saveConfig(room!.roomid);
			stopRoomAutotourScheduler(room!.roomid);
			this.sendReply(`Autotour disabled for ${room!.roomid}.`);
		},
		async types(target, room, user) {
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			const config = ensureRoomConfig(roomid);
			const types = target.split(',').map(s => toID(s.trim())).filter(type => ALL_TOUR_TYPES.includes(type));
			if (!types.length) return this.errorReply('Usage: /autotour types elimination, roundrobin');
			config.types = types;
			await saveConfig(roomid);
			this.sendReply(`Types for ${roomid} set to: ${config.types.join(', ')}`);
		},
		async formats(target, room, user) {
			await modifyFormats(this, room, target, 'set');
		},
		async addformat(target, room, user) {
			await modifyFormats(this, room, target, 'add');
		},
		async removeformat(target, room, user) {
			await modifyFormats(this, room, target, 'remove');
		},
		async interval(target, room, user) {
			if (!checkRoomOwner(this, room)) return;
			const value = parseInt(target);
			if (isNaN(value) || value < 1) return this.errorReply("Interval must be at least 1 minute.");
			const config = ensureRoomConfig(room!.roomid);
			config.interval = value;
			await saveConfig(room!.roomid);
			this.sendReply(`Interval set to ${value} minutes.`);
			if (config.enabled) startRoomAutotourScheduler(room!.roomid);
		},
		async autostart(target, room, user) {
			if (!checkRoomOwner(this, room)) return;
			const value = parseInt(target);
			if (isNaN(value) || value < 0) return this.errorReply("Invalid value.");
			const config = ensureRoomConfig(room!.roomid);
			config.autostart = value;
			await saveConfig(room!.roomid);
			this.sendReply(`Autostart set to ${value} minutes.`);
		},
		async autodq(target, room, user) {
			if (!checkRoomOwner(this, room)) return;
			const value = parseInt(target);
			if (isNaN(value) || value < 0) return this.errorReply("Invalid value.");
			const config = ensureRoomConfig(room!.roomid);
			config.autodq = value;
			await saveConfig(room!.roomid);
			this.sendReply(`Autodq set to ${value} minutes.`);
		},
		async playercap(target, room, user) {
			if (!checkRoomOwner(this, room)) return;
			const config = ensureRoomConfig(room!.roomid);
			config.playerCap = target.trim();
			await saveConfig(room!.roomid);
			this.sendReply(`Player cap set to ${target}.`);
		},
		show(target, room, user) {
			if (!this.runBroadcast() || !checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			const config = autotourConfig[roomid] || { roomid, ...defaultRoomConfig };
			const rows = [
				[`<b>Room:</b>`, `<b>${roomid}</b>`],
				[`<b>Enabled:</b>`, config.enabled ? 'Yes' : 'No'],
				[`<b>Formats:</b>`, config.formats.join(', ')],
				[`<b>Types:</b>`, config.types.join(', ')],
				[`<b>Interval:</b>`, `${config.interval} min`],
				[`<b>Autostart:</b>`, `${config.autostart} min`],
				[`<b>Autodq:</b>`, `${config.autodq} min`],
				[`<b>Player Cap:</b>`, config.playerCap || '(none)'],
			];
			this.sendReply(`|html|${Table(`Autotour settings for ${roomid}`, [], rows)}`);
		},
		nextrun(target, room, user) {
			if (!this.runBroadcast()) return;
			const roomid = target ? toID(target) as RoomID : room?.roomid;
			if (!roomid) return this.errorReply('Specify a room.');
			const config = autotourConfig[roomid];
			if (!config?.enabled) return this.errorReply(`Autotour is not enabled in ${roomid}.`);

			const now = Date.now();
			const nextRun = (config.lastTourTime || 0) + (config.interval * 60 * 1000);
			const remaining = Math.max(0, nextRun - now);

			const minutes = Math.floor(remaining / 60000);
			const seconds = Math.floor((remaining % 60000) / 1000);
			this.sendReply(`Next tournament in ${roomid} starts in: ${minutes}m ${seconds}s.`);
		},
		help() {
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				`<div style="max-height: 350px; overflow-y: auto;"><center><strong><h4>Autotour Commands</strong></h4><hr>Commands Alias: /at</center><hr>` +
				`<b>/autotour enable</b> - Enable autotours in this room. Requires: #<hr>` +
				`<b>/autotour disable</b> - Disable autotours in this room. Requires: #<hr>` +
				`<b>/autotour formats [format1], [format2]</b> - Set specific formats.<hr>` +
				`<b>/autotour addformat [format]</b> - Add a format to the rotation.<hr>` +
				`<b>/autotour removeformat [format]</b> - Remove a format from the rotation.<hr>` +
				`<b>/autotour types [elimination, roundrobin]</b> - Set tournament types.<hr>` +
				`<b>/autotour interval [minutes]</b> - Set delay between tournaments.<hr>` +
				`<b>/autotour autostart [minutes]</b> - Set the autostart timer.<hr>` +
				`<b>/autotour autodq [minutes]</b> - Set the autodq timer.<hr>` +
				`<b>/autotour playercap [number]</b> - Set a player cap.<hr>` +
				`<b>/autotour show</b> - Show current settings for this room.<hr>` +
				`<b>/autotour nextrun</b> - See time remaining until next tournament.<hr>` +
				`<center><small>Random Battle formats used by default.</small></center></div>`
			);
		},
	},

	at: 'autotour',
};

export const destroy = (): void => {
	for (const roomid of Object.keys(autotourIntervals)) {
		stopRoomAutotourScheduler(roomid as RoomID);
	}
};

void (async (): Promise<void> => {
	await loadConfig();
	for (const roomid in autotourConfig) {
		if (autotourConfig[roomid]?.enabled) startRoomAutotourScheduler(roomid as RoomID);
	}
})();
