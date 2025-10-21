/*
* Pokemon Showdown
* Auto Tournaments Commands
* @author PrinceSky-Git
*/
import {ImpulseCollection} from '../../impulse-db';
import { generateThemedTable } from '../../utils';
import { nameColor } from '../../colors';

const AUTOTOUR_COLLECTION = 'autotour_configs';

interface PerRoomAutotourConfig {
	roomid: string;
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
	_id?: any;
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
    'gen1randombattle', 'gen5pokebilitiesrandombattle'
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
let autotourConfig: Record<string, PerRoomAutotourConfig> = {};
let autotourIntervals: Record<string, NodeJS.Timeout> = {};

async function saveConfig(roomid: string) {
	const config = autotourConfig[roomid];
	await autotourCollection.updateOne(
		{roomid},
		{$set: {...config, roomid}},
		{upsert: true}
	);
}

async function loadConfig() {
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

function pickTourTypeAndModifier(types: string[]): {type: string, modifier?: string} {
	const hasElim = types.includes('elimination');
	const hasRR = types.includes('roundrobin');
	if (hasElim && hasRR) {
		const roll = Math.random();
		if (roll < 0.6) {
			if (Math.random() < 0.5) {
				return {type: 'elimination', modifier: '2'};
			}
			return {type: 'elimination'};
		} else {
			return {type: 'roundrobin'};
		}
	}
	const type = pickRandom(types);
	if (type === 'elimination') {
		if (Math.random() < 0.5) {
			return {type, modifier: '2'};
		}
	}
	return {type};
}

function startRoomAutotourScheduler(roomid: string) {
	stopRoomAutotourScheduler(roomid);
	const config = autotourConfig[roomid];
	if (!config?.enabled) return;
	const min = Math.max(1, config.interval);
	autotourIntervals[roomid] = setInterval(() => runAutotour(roomid), min * 60 * 1000);
}

function stopRoomAutotourScheduler(roomid: string) {
	if (autotourIntervals[roomid]) clearInterval(autotourIntervals[roomid]);
	delete autotourIntervals[roomid];
}

async function updateLastTourTime(roomid: string, time: number) {
	if (!autotourConfig[roomid]) return;
	autotourConfig[roomid].lastTourTime = time;
	await saveConfig(roomid);
}

function runAutotour(roomid: string) {
	const config = autotourConfig[roomid];
	if (!config?.enabled) return;
	const room = Rooms.get(roomid);
	if (!room) {
		return;
	}
	if (room.game && room.game.gameid === 'tournament') {
		return;
	}
	const format = pickRandom(config.formats);
	const {type, modifier} = pickTourTypeAndModifier(config.types);

	try {
		const tour = global.Tournaments.createTournament(
			room,
			format,
			type,
			config.playerCap,
			false,
			modifier,
			config.name,
			{
				sendReply: (msg: string) => room.add(msg),
				modlog: () => {},
				privateModAction: () => {},
				errorReply: (msg: string) => room.add(msg),
				parse: () => {},
				checkCan: () => {},
				runBroadcast: () => true,
				requireRoom: () => room,
			}
		);
		if (tour) {
			let modinfo = '';
			if (type === 'elimination' && modifier === '2') {
				modinfo = ' (Double Elimination)';
			}
			tour.setAutoStartTimeout(config.autostart * 60 * 1000, {
				sendReply: (msg: string) => room.add(msg),
				modlog: () => {},
				privateModAction: () => {},
				errorReply: (msg: string) => room.add(msg),
				parse: () => {},
				checkCan: () => {},
				runBroadcast: () => true,
				requireRoom: () => room,
			});
			tour.setAutoDisqualifyTimeout(config.autodq * 60 * 1000, {
				sendReply: (msg: string) => room.add(msg),
				modlog: () => {},
				privateModAction: () => {},
				errorReply: (msg: string) => room.add(msg),
				parse: () => {},
				checkCan: () => {},
				runBroadcast: () => true,
				requireRoom: () => room,
			});
			const now = Date.now();
			autotourConfig[roomid].lastTourTime = now;
			void saveConfig(roomid);
		}
	} catch (err: any) {
	}
}

function checkRoomOwner(context: any, room: ChatRoom | null): boolean {
	if (!room) {
		context.errorReply('Use this command in a room.');
		return false;
	}
	if (context.user.can('declare', null, room)) return true;
	if (room.auth && room.founder && context.user.id === toID(room.founder)) return true;
	context.errorReply('Only the Room Owner or a global Admin can use this command in this room.');
	return false;
}

export const commands: Chat.ChatCommands = {
	autotour: {
		async enable(target, room, user) {
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = {roomid, ...defaultRoomConfig};
			autotourConfig[roomid].enabled = true;
			await saveConfig(roomid);
			startRoomAutotourScheduler(roomid);
			this.sendReply(`Autotour enabled for room ${roomid}.`);
		},
		async disable(target, room, user) {
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = {roomid, ...defaultRoomConfig};
			autotourConfig[roomid].enabled = false;
			await saveConfig(roomid);
			stopRoomAutotourScheduler(roomid);
			this.sendReply(`Autotour disabled for room ${roomid}.`);
		},
		async set(target, room, user) {
			if (!checkRoomOwner(this, room)) return;
			const args = target.split(',').map(s => s.trim());
			const [key, ...rest] = args;
			const roomid = room!.roomid;
			if (!autotourConfig[roomid]) autotourConfig[roomid] = {roomid, ...defaultRoomConfig};
			const config = autotourConfig[roomid];
			switch (key) {
				case 'formats':
					config.formats = rest.map(toID).filter(Boolean);
					this.sendReply(`Formats for ${roomid} set to: ${config.formats.join(', ')}`);
					break;
				case 'addformat':
					for (const format of rest.map(toID).filter(Boolean)) {
						if (!config.formats.includes(format)) config.formats.push(format);
					}
					this.sendReply(`Added formats to ${roomid}: ${rest.join(', ')}`);
					break;
				case 'removeformat':
					for (const format of rest.map(toID).filter(Boolean)) {
						const i = config.formats.indexOf(format);
						if (i >= 0) config.formats.splice(i, 1);
					}
					this.sendReply(`Removed formats from ${roomid}: ${rest.join(', ')}`);
					break;
				case 'removeallformats':
					config.formats = ['gen9randombattle'];
					this.sendReply(`All formats removed except gen9randombattle for ${roomid}.`);
					break;
				case 'types':
					config.types = rest.map(toID).filter(type => ALL_TOUR_TYPES.includes(type));
					this.sendReply(`Types for ${roomid} set to: ${config.types.join(', ')}`);
					break;
				case 'addtype':
					for (const type of rest.map(toID).filter(type => ALL_TOUR_TYPES.includes(type))) {
						if (!config.types.includes(type)) config.types.push(type);
					}
					this.sendReply(`Added types to ${roomid}: ${rest.join(', ')}`);
					break;
				case 'removetype':
					for (const type of rest.map(toID).filter(type => ALL_TOUR_TYPES.includes(type))) {
						const i = config.types.indexOf(type);
						if (i >= 0) config.types.splice(i, 1);
					}
					this.sendReply(`Removed types from ${roomid}: ${rest.join(', ')}`);
					break;
				case 'removealltypes':
					config.types = ['elimination'];
					this.sendReply(`All types removed except elimination for ${roomid}.`);
					break;
				case 'interval':
					{
						const min = Number(rest[0]);
						if (!min || min < 1) return this.errorReply('Invalid interval.');
						config.interval = min;
						this.sendReply(`Interval for ${roomid} set to ${min} minutes.`);
					}
					break;
				case 'autostart':
					{
						const min = Number(rest[0]);
						if (!min || min < 0) return this.errorReply('Invalid autostart.');
						config.autostart = min;
						this.sendReply(`Autostart for ${roomid} set to ${min} minutes.`);
					}
					break;
				case 'autodq':
					{
						const min = Number(rest[0]);
						if (!min || min < 0) return this.errorReply('Invalid autodq.');
						config.autodq = min;
						this.sendReply(`Autodq for ${roomid} set to ${min} minutes.`);
					}
					break;
				case 'playercap':
					config.playerCap = rest[0] || '';
					this.sendReply(`Player cap for ${roomid} set to "${config.playerCap}".`);
					break;
				case 'name':
					config.name = rest.join(',') || '';
					this.sendReply(`Name for ${roomid} set to "${config.name}".`);
					break;
				default:
					return this.errorReply('Unknown option. Use formats, addformat, removeformat, removeallformats, types, addtype, removetype, removealltypes, interval, autostart, autodq, playercap, name.');
			}
			await saveConfig(roomid);
			if (config.enabled) startRoomAutotourScheduler(roomid);
		},
		show(target, room, user) {
			if (!this.runBroadcast()) return;
			if (!checkRoomOwner(this, room)) return;
			const roomid = room!.roomid;
			const config = autotourConfig[roomid] || {roomid, ...defaultRoomConfig};
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
			const roomid = target ? toID(target) : room?.roomid;
			if (!roomid) return this.errorReply('Specify a room.');
			const config = autotourConfig[roomid];
			if (!config?.enabled) return this.errorReply(`Autotour is not enabled in ${roomid}.`);
			let lastRun = config.lastTourTime;
			if (!lastRun) {
				lastRun = Date.now() - (config.interval * 60 * 1000);
			}
			const nextRun = lastRun + (config.interval * 60 * 1000);
			const timeRemaining = Math.max(0, nextRun - Date.now());
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
				{cmd: "/autotour enable", desc: "Enable autotour in this room. Requires: #/~."},
				{cmd: "/autotour disable", desc: "Disable autotour in this room. Requires: #/~."},
				{cmd: "/autotour set [option],...", desc: "Set per-room option (run in room):<br>formats, addformat, removeformat, removeallformats, types, addtype, removetype, removealltypes, interval, autostart, autodq, playercap, name. Requires: #/~."},
				{cmd: "/autotour show", desc: "Show current autotour settings for this room."},
				{cmd: "/autotour nextrun [room]", desc: "Show time remaining until next tournament starts."},
			];
			const html = `<center><strong>Autotour Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({cmd, desc}, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
								).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},
	},
};

void (async () => {
	await loadConfig();
	for (const roomid in autotourConfig) {
		if (autotourConfig[roomid]?.enabled) startRoomAutotourScheduler(roomid);
	}
})();
