/*
* Pokemon Showdown
* Auto Tournaments Commands
*/
import { ImpulseCollection } from '../../impulse-db';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

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
		'gen9randombattle', 'gen8randomdoublesbattle',
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
void loadConfig();

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
	const lastRun = config.lastTourTime || now;
	const nextRun = lastRun + intervalMs;
	const timeUntilNext = Math.max(0, nextRun - now);

	const delay = timeUntilNext === 0 ? intervalMs : timeUntilNext;

	autotourIntervals[roomid] = setTimeout(() => {
		runAutotour(roomid);
		autotourIntervals[roomid] = setInterval(() => runAutotour(roomid), intervalMs);
	}, delay);
}

function stopRoomAutotourScheduler(roomid: RoomID): void {
	if (autotourIntervals[roomid]) clearInterval(autotourIntervals[roomid]);
	delete autotourIntervals[roomid];
}

function runAutotour(roomid: RoomID): void {
	const config = autotourConfig[roomid];
	if (!config?.enabled) return;
	const room = Rooms.get(roomid);
	if (!room || room.type !== 'chat') return;
	if (room.game && room.game.gameid === 'tournament') return;

	const format = pickRandom(config.formats);
	const { type, modifier } = pickTourTypeAndModifier(config.types);

	const mockContext: Chat.CommandContext = {
		sendReply: (msg: string) => room.add(msg),
		errorReply: (msg: string) => room.add(msg),
		modlog: () => {},
		privateModAction: () => {},
		parse: () => {},
		checkCan: () => {},
		runBroadcast: () => true,
		requireRoom: () => room,
	} as unknown as Chat.CommandContext;

	try {
		const tour = Tournaments.createTournament(
			room,
			format,
			type,
			config.playerCap,
			false,
			modifier,
			config.name,
			mockContext
		);
		if (tour) {
			tour.setAutoStartTimeout(config.autostart * 60 * 1000, mockContext);
			tour.setAutoDisqualifyTimeout(config.autodq * 60 * 1000, mockContext);
			const now = Date.now();
			autotourConfig[roomid].lastTourTime = now;
			void saveConfig(roomid);
		}
	} catch (err: unknown) {
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

export const commands: Chat.ChatCommands = {
	autotour: {
		async enable(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			autotourConfig[roomid].enabled = true;
			await saveConfig(roomid);
			startRoomAutotourScheduler(roomid);
			this.sendReply(`Autotour enabled for room ${roomid}.`);
			this.room!.add(`|html|<div class="infobox"><center>${user.name} enabled auto tournaments in this room.</center></div>`).update();
		},
		async disable(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			autotourConfig[roomid].enabled = false;
			await saveConfig(roomid);
			stopRoomAutotourScheduler(roomid);
			this.sendReply(`Autotour disabled for room ${roomid}.`);
			this.room!.add(`|html|<div class="infobox"><center>${user.name} disabled auto tournaments in this room.</center></div>`).update();
		},
		async formats(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			const formats = target.split(',').map(s => toID(s.trim())).filter(Boolean);
			if (!formats.length) return this.errorReply('Usage: /autotour formats <format1>, <format2>, ...');
			config.formats = formats;
			await saveConfig(roomid);
			this.sendReply(`Formats for ${roomid} set to: ${config.formats.join(', ')}`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async addformat(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			const formats = target.split(',').map(s => toID(s.trim())).filter(Boolean);
			if (!formats.length) return this.errorReply('Usage: /autotour addformat <format1>, <format2>, ...');
			for (const format of formats) {
				if (!config.formats.includes(format)) config.formats.push(format);
			}
			await saveConfig(roomid);
			this.sendReply(`Added formats to ${roomid}: ${formats.join(', ')}`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async removeformat(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			const formats = target.split(',').map(s => toID(s.trim())).filter(Boolean);
			if (!formats.length) return this.errorReply('Usage: /autotour removeformat <format1>, <format2>, ...');
			for (const format of formats) {
				const i = config.formats.indexOf(format);
				if (i >= 0) config.formats.splice(i, 1);
			}
			await saveConfig(roomid);
			this.sendReply(`Removed formats from ${roomid}: ${formats.join(', ')}`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async removeallformats(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			config.formats = ['gen9randombattle'];
			await saveConfig(roomid);
			this.sendReply(`All formats removed except gen9randombattle for ${roomid}.`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async types(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			const types = target.split(',').map(s => toID(s.trim())).filter(type => ALL_TOUR_TYPES.includes(type));
			if (!types.length) return this.errorReply('Usage: /autotour types <elimination|roundrobin>, ...');
			config.types = types;
			await saveConfig(roomid);
			this.sendReply(`Types for ${roomid} set to: ${config.types.join(', ')}`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async addtype(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			const types = target.split(',').map(s => toID(s.trim())).filter(type => ALL_TOUR_TYPES.includes(type));
			if (!types.length) return this.errorReply('Usage: /autotour addtype <elimination|roundrobin>, ...');
			for (const type of types) {
				if (!config.types.includes(type)) config.types.push(type);
			}
			await saveConfig(roomid);
			this.sendReply(`Added types to ${roomid}: ${types.join(', ')}`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async removetype(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			const types = target.split(',').map(s => toID(s.trim())).filter(type => ALL_TOUR_TYPES.includes(type));
			if (!types.length) return this.errorReply('Usage: /autotour removetype <elimination|roundrobin>, ...');
			for (const type of types) {
				const i = config.types.indexOf(type);
				if (i >= 0) config.types.splice(i, 1);
			}
			await saveConfig(roomid);
			this.sendReply(`Removed types from ${roomid}: ${types.join(', ')}`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async removealltypes(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			config.types = ['elimination'];
			await saveConfig(roomid);
			this.sendReply(`All types removed except elimination for ${roomid}.`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async interval(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			const min = Number(target);
			if (!min || min < 1) return this.errorReply('Invalid interval. Must be at least 1 minute.');
			config.interval = min;
			await saveConfig(roomid);
			this.sendReply(`Interval for ${roomid} set to ${min} minutes.`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async autostart(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			const min = Number(target);
			if (isNaN(min) || min < 0) return this.errorReply('Invalid autostart. Must be 0 or greater.');
			config.autostart = min;
			await saveConfig(roomid);
			this.sendReply(`Autostart for ${roomid} set to ${min} minutes.`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async autodq(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			const min = Number(target);
			if (isNaN(min) || min < 0) return this.errorReply('Invalid autodq. Must be 0 or greater.');
			config.autodq = min;
			await saveConfig(roomid);
			this.sendReply(`Autodq for ${roomid} set to ${min} minutes.`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async playercap(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			config.playerCap = target.trim();
			await saveConfig(roomid);
			this.sendReply(`Player cap for ${roomid} set to "${config.playerCap}".`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		async name(target, room, user) {
			this.checkChat();
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = { roomid, ...defaultRoomConfig };
			const config = autotourConfig[roomid];
			config.name = target.trim();
			await saveConfig(roomid);
			this.sendReply(`Name for ${roomid} set to "${config.name}".`);
			if (config.enabled) startRoomAutotourScheduler(roomid);
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
			const lastRun = config.lastTourTime || (now - intervalMs);
			const nextRun = lastRun + intervalMs;
			let timeRemaining = Math.max(0, nextRun - now);

			if (timeRemaining === 0) {
				timeRemaining = intervalMs;
			}

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
	for (const roomid in autotourIntervals) {
		stopRoomAutotourScheduler(roomid as RoomID);
	}
};

void (async (): Promise<void> => {
	await loadConfig();
	for (const roomid in autotourConfig) {
		if (autotourConfig[roomid]?.enabled) startRoomAutotourScheduler(roomid as RoomID);
	}
})();
