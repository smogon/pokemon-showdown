/*
* Pokemon Showdown
* Auto Tournaments Commands
* @author PrinceSky-Git
*/
import { ImpulseCollection } from '../../impulse-db';
import { generateThemedTable } from '../../utils';
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
	name: string;
	enabled: boolean;
	modifier?: string;
	lastTourTime?: number;
	_id?: unknown;
}

const ALL_TOUR_TYPES = [
	'elimination',
	'roundrobin',
];

const defaultRoomConfig: Omit<PerRoomAutotourConfig, 'roomid'> = {
	formats: [
		'gen9randombattle', 'gen9randomdoublesbattle',
		'gen9blankcanvasrandombattle', 'gen9monotyperandombattle',
		'gen9randombattlemayhem', 'gen9babyrandombattle',
		'gen8randombattle', 'gen8randomdoublesbattle',
		'gen7randombattle', 'gen6randombattle',
		'gen5randombattle', 'gen4randombattle',
		'gen3randombattle', 'gen2randombattle',
		'gen1randombattle', 'gen5pokebilitiesrandombattle',
	],
	types: [...ALL_TOUR_TYPES],
	interval: 60,
	autostart: 5,
	autodq: 2,
	playerCap: '',
	name: '',
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

function pickTourTypeAndModifier(types: string[]): { type: string, modifier?: string } {
	const hasElim = types.includes('elimination');
	const hasRR = types.includes('roundrobin');
	if (hasElim && hasRR) {
		const roll = Math.random();
		if (roll < 0.6) {
			if (Math.random() < 0.5) {
				return { type: 'elimination', modifier: '2' };
			}
			return { type: 'elimination' };
		} else {
			return { type: 'roundrobin' };
		}
	}
	const type = pickRandom(types);
	if (type === 'elimination') {
		if (Math.random() < 0.5) {
			return { type, modifier: '2' };
		}
	}
	return { type };
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
			const cfg = autotourConfig[roomid];
			const rm = Rooms.get(roomid);
			if (rm?.game && rm.game.gameid === 'tournament') {
				// A tour is already running — skip this tick without updating lastTourTime,
				// but reschedule from now so we don't stack up on the next tick.
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
	if (!config?.enabled) return;
	if (!config.formats.length || !config.types.length) return;
	const room = Rooms.get(roomid);
	if (!room || room.type !== 'chat') return;
	if (room.game && room.game.gameid === 'tournament') return;

	const format = pickRandom(config.formats);
	const { type, modifier } = pickTourTypeAndModifier(config.types);

	// Re-fetch room immediately before creating to guard against it closing
	const liveRoom = Rooms.get(roomid);
	if (!liveRoom || liveRoom.type !== 'chat') return;

	const mockContext: Chat.CommandContext = {
		sendReply: (msg: string) => liveRoom.add(msg).update(),
		errorReply: (msg: string) => liveRoom.add(`|error|${msg}`).update(),
		modlog: () => {},
		privateModAction: () => {},
		addModAction: () => {},
		parse: () => {},
		checkCan: () => {},
		checkChat: () => {},
		checkGame: () => {},
		checkRoom: () => {},
		can: () => false,
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
			config.name || undefined,
			mockContext
		);
		if (tour) {
			if (config.autostart > 0) {
				tour.setAutoStartTimeout(config.autostart * 60 * 1000, mockContext);
			}
			if (config.autodq > 0) {
				tour.setAutoDisqualifyTimeout(config.autodq * 60 * 1000, mockContext);
			}
			const now = Date.now();
			autotourConfig[roomid].lastTourTime = now;
			void saveConfig(roomid);
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
	if (context.user.can('declare', null, room)) return true;
	if (room.auth.get(context.user.id) === Users.HOST_SYMBOL) return true;
	context.errorReply('Only the Room Owner or a global Admin can use this command in this room.');
	return false;
}

function ensureRoomConfig(roomid: RoomID): PerRoomAutotourConfig {
	if (!autotourConfig[roomid]) {
		autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
	}
	return autotourConfig[roomid];
}

async function modifyFormats(
	context: Chat.CommandContext,
	room: Room | null,
	target: string,
	action: 'set' | 'add' | 'remove' | 'clear'
): Promise<void> {
	context.checkChat();
	if (!checkRoomOwner(context, room)) return;
	const roomid = room!.roomid;
	const config = ensureRoomConfig(roomid);

	if (action === 'clear') {
		config.formats = ['gen9randombattle'];
		await saveConfig(roomid);
		context.sendReply(`All formats removed except gen9randombattle for ${roomid}.`);
		if (config.enabled) startRoomAutotourScheduler(roomid);
		return;
	}

	const formats = target.split(',').map(s => toID(s.trim())).filter(Boolean);
	if (!formats.length) {
		return context.errorReply(`Usage: /autotour ${action}format <format1>, <format2>, ...`);
	}

	if (action === 'set') {
		config.formats = formats;
		await saveConfig(roomid);
		context.sendReply(`Formats for ${roomid} set to: ${config.formats.join(', ')}`);
	} else if (action === 'add') {
		for (const format of formats) {
			if (!config.formats.includes(format)) config.formats.push(format);
		}
		await saveConfig(roomid);
		context.sendReply(`Added formats to ${roomid}: ${formats.join(', ')}`);
	} else if (action === 'remove') {
		for (const format of formats) {
			const i = config.formats.indexOf(format);
			if (i >= 0) config.formats.splice(i, 1);
		}
		await saveConfig(roomid);
		context.sendReply(`Removed formats from ${roomid}: ${formats.join(', ')}`);
	}

	if (config.enabled) startRoomAutotourScheduler(roomid);
}

async function modifyTypes(
	context: Chat.CommandContext,
	room: Room | null,
	target: string,
	action: 'set' | 'add' | 'remove' | 'clear'
): Promise<void> {
	context.checkChat();
	if (!checkRoomOwner(context, room)) return;
	const roomid = room!.roomid;
	const config = ensureRoomConfig(roomid);

	if (action === 'clear') {
		config.types = ['elimination'];
		await saveConfig(roomid);
		context.sendReply(`All types removed except elimination for ${roomid}.`);
		if (config.enabled) startRoomAutotourScheduler(roomid);
		return;
	}

	const types = target.split(',').map(s => toID(s.trim())).filter(type => ALL_TOUR_TYPES.includes(type));
	if (!types.length) {
		return context.errorReply(`Usage: /autotour ${action}type <elimination|roundrobin>, ...`);
	}

	if (action === 'set') {
		config.types = types;
		await saveConfig(roomid);
		context.sendReply(`Types for ${roomid} set to: ${config.types.join(', ')}`);
	} else if (action === 'add') {
		for (const type of types) {
			if (!config.types.includes(type)) config.types.push(type);
		}
		await saveConfig(roomid);
		context.sendReply(`Added types to ${roomid}: ${types.join(', ')}`);
	} else if (action === 'remove') {
		for (const type of types) {
			const i = config.types.indexOf(type);
			if (i >= 0) config.types.splice(i, 1);
		}
		await saveConfig(roomid);
		context.sendReply(`Removed types from ${roomid}: ${types.join(', ')}`);
	}

	if (config.enabled) startRoomAutotourScheduler(roomid);
}

async function setConfigValue(
	context: Chat.CommandContext,
	room: Room | null,
	target: string,
	field: 'interval' | 'autostart' | 'autodq' | 'playerCap' | 'name'
): Promise<void> {
	context.checkChat();
	if (!checkRoomOwner(context, room)) return;
	const roomid = room!.roomid;
	const config = ensureRoomConfig(roomid);

	if (field === 'playerCap' || field === 'name') {
		config[field] = target.trim();
		await saveConfig(roomid);
		context.sendReply(`${field === 'playerCap' ? 'Player cap' : 'Name'} for ${roomid} set to "${config[field]}".`);
		if (config.enabled) startRoomAutotourScheduler(roomid);
		return;
	}

	const value = Number(target);
	if (field === 'interval' && (!value || value < 1)) {
		return context.errorReply('Invalid interval. Must be at least 1 minute.');
	}
	if ((field === 'autostart' || field === 'autodq') && (isNaN(value) || value < 0)) {
		return context.errorReply(`Invalid ${field}. Must be 0 or greater.`);
	}

	config[field] = value;
	await saveConfig(roomid);
	context.sendReply(`${field.charAt(0).toUpperCase() + field.slice(1)} for ${roomid} set to ${value} minutes.`);
	if (config.enabled) startRoomAutotourScheduler(roomid);
}

async function toggleAutotour(
	context: Chat.CommandContext,
	room: Room | null,
	user: User,
	enable: boolean
): Promise<void> {
	context.checkChat();
	if (!checkRoomOwner(context, room)) return;
	const roomid = room!.roomid;
	const config = ensureRoomConfig(roomid);
	config.enabled = enable;
	await saveConfig(roomid);

	if (enable) {
		startRoomAutotourScheduler(roomid);
	} else {
		stopRoomAutotourScheduler(roomid);
	}

	context.sendReply(`Autotour ${enable ? 'enabled' : 'disabled'} for room ${roomid}.`);
	room!.add(
		`|html|<div class="infobox"><center>${user.name} ${enable ? 'enabled' : 'disabled'} auto tournaments in this room.</center></div>`
	).update();
}

export const commands: Chat.ChatCommands = {
	autotour: {
		async enable(target, room, user) {
			await toggleAutotour(this, room, user, true);
		},
		async disable(target, room, user) {
			await toggleAutotour(this, room, user, false);
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
		async removeallformats(target, room, user) {
			await modifyFormats(this, room, '', 'clear');
		},
		async types(target, room, user) {
			await modifyTypes(this, room, target, 'set');
		},
		async addtype(target, room, user) {
			await modifyTypes(this, room, target, 'add');
		},
		async removetype(target, room, user) {
			await modifyTypes(this, room, target, 'remove');
		},
		async removealltypes(target, room, user) {
			await modifyTypes(this, room, '', 'clear');
		},
		async interval(target, room, user) {
			await setConfigValue(this, room, target, 'interval');
		},
		async autostart(target, room, user) {
			await setConfigValue(this, room, target, 'autostart');
		},
		async autodq(target, room, user) {
			await setConfigValue(this, room, target, 'autodq');
		},
		async playercap(target, room, user) {
			await setConfigValue(this, room, target, 'playerCap');
		},
		async name(target, room, user) {
			await setConfigValue(this, room, target, 'name');
		},
		show(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			const config = autotourConfig[roomid] || { roomid, ...defaultRoomConfig };
			const colorName = nameColor(user.name, true, true);
			const formatsHtml = `<div style="max-width:300px;overflow-x:auto;white-space:nowrap;">${config.formats.join(', ') || '(none)'}</div>`;
			const rows = [
				[`<b>Room:</b>`, `<b>${roomid}</b>`],
				[`<b>Owner:</b>`, colorName],
				[`<b>Enabled:</b>`, config.enabled ? '<span style="color:limegreen">Yes</span>' : '<span style="color:red">No</span>'],
				[`<b>Formats:</b>`, formatsHtml],
				[`<b>Types:</b>`, config.types.join(', ') || '(none)'],
				[`<b>Interval:</b>`, `${config.interval} min`],
				[`<b>Autostart:</b>`, `${config.autostart} min`],
				[`<b>Autodq:</b>`, `${config.autodq} min`],
				[`<b>Player Cap:</b>`, config.playerCap || '(none)'],
				[`<b>Name:</b>`, config.name || '(none)'],
			];
			const tableHTML = generateThemedTable(`Autotour settings for ${roomid}`, [], rows);
			this.sendReply(`|html|${tableHTML}`);
		},
		nextrun(target, room, user) {
			if (!this.runBroadcast()) return;
			const roomid = target ? toID(target) as RoomID : room?.roomid;
			if (!roomid) return this.errorReply('Specify a room.');
			const config = autotourConfig[roomid];
			if (!config?.enabled) return this.errorReply(`Autotour is not enabled in ${roomid}.`);

			const now = Date.now();
			const intervalMs = config.interval * 60 * 1000;
			const lastRun = config.lastTourTime || 0;
			const nextRun = lastRun > 0 ? lastRun + intervalMs : now;
			const timeRemaining = Math.max(0, nextRun - now);

			const minutes = Math.floor(timeRemaining / 60000);
			const seconds = Math.floor((timeRemaining % 60000) / 1000);
			const tableHTML = generateThemedTable(`Next Autotour in ${roomid}`, [], [
				[`<b>Room:</b>`, `<b>${roomid}</b>`],
				[`<b>Time Remaining:</b>`, `<b>${minutes}m ${seconds}s</b>`],
				[`<b>Interval:</b>`, `${config.interval} min`],
				[`<b>Last Run:</b>`, config.lastTourTime ? new Date(config.lastTourTime).toLocaleString() : '(never)'],
			]);
			this.sendReply(`|html|${tableHTML}`);
		},
		help() {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/autotour enable", desc: "Enable autotour in this room. Requires: #/~." },
				{ cmd: "/autotour disable", desc: "Disable autotour in this room. Requires: #/~." },
				{ cmd: "/autotour formats [format1], [format2], ...", desc: "Set tournament formats. Requires: #/~." },
				{ cmd: "/autotour addformat [format]", desc: "Add a format to the list. Requires: #/~." },
				{ cmd: "/autotour removeformat [format]", desc: "Remove a format from the list. Requires: #/~." },
				{ cmd: "/autotour removeallformats", desc: "Remove all formats except gen9randombattle. Requires: #/~." },
				{ cmd: "/autotour types [elimination|roundrobin], ...", desc: "Set tournament types. Requires: #/~." },
				{ cmd: "/autotour addtype [type]", desc: "Add a tournament type. Requires: #/~." },
				{ cmd: "/autotour removetype [type]", desc: "Remove a tournament type. Requires: #/~." },
				{ cmd: "/autotour removealltypes", desc: "Remove all types except elimination. Requires: #/~." },
				{ cmd: "/autotour interval [minutes]", desc: "Set time between tournaments. Requires: #/~." },
				{ cmd: "/autotour autostart [minutes]", desc: "Set autostart timer. Requires: #/~." },
				{ cmd: "/autotour autodq [minutes]", desc: "Set autodq timer. Requires: #/~." },
				{ cmd: "/autotour playercap [number]", desc: "Set player cap. Requires: #/~." },
				{ cmd: "/autotour name [name]", desc: "Set custom tournament name. Requires: #/~." },
				{ cmd: "/autotour show", desc: "Show current autotour settings for this room." },
				{ cmd: "/autotour nextrun [room]", desc: "Show time remaining until next tournament starts." },
			];
			const html = `<center><strong>Autotour Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(`<div style="max-height: 360px; overflow-y: auto;">${html}</div>`);
		},
	},
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
