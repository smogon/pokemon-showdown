'use strict';

interface MafiaLogTable {
	[date: string]: {[userid: string]: number};
}
type MafiaLogSection = 'leaderboard' | 'mvps' | 'hosts' | 'plays' | 'leavers';
type MafiaLog = {[section in MafiaLogSection]: MafiaLogTable};

interface MafiaHostBans {
	[userid: string]: number;
}

interface MafiaRole {
	name: string;
	safeName: string;
	id: string;
	memo: string[];
	alignment: string;
	image: string;
}

interface MafiaLynch {
	// number of people on this lynch
	count: number;
	// number of votes, accounting for doublevoter etc
	trueCount: number;
	lastLynch: number;
	dir: 'up' | 'down';
	lynchers: ID[];
}

interface MafiaIDEAData {
	name: string;
	// do we trust the roles to be all proper
	untrusted: true | null;
	roles: string[];
	// eg, GestI has 3 choices
	choices: number;
	// eg, GestI has 2 things to pick, role and alignment
	picks: string[];
}
interface MafiaIDEAModule {
	data: MafiaIDEAData | null;
	timer: NodeJS.Timer | null;
	discardsHidden: boolean;
	discardsHTML: string;
	// users that haven't picked a role yet
	waitingPick: string[];
}
interface MafiaIDEAPlayerData {
	choices: string[];
	originalChoices: string[];
	picks: {[choice: string]: string | null};
}

type MafiaTheme = import('./mafia-data').MafiaTheme;

import {FS} from '../../lib/fs';

const LOGS_FILE = 'config/chat-plugins/mafia-logs.json';
const BANS_FILE = 'config/chat-plugins/mafia-bans.json';

import MafiaData = require('../../server/chat-plugins/mafia-data.js');

let logs: MafiaLog = {leaderboard: {}, mvps: {}, hosts: {}, plays: {}, leavers: {}};

let hostBans: MafiaHostBans = Object.create(null);

const hostQueue: ID[] = [];

const IDEA_TIMER = 90 * 1000;

function readFile(path: string) {
	try {
		const json = FS(path).readIfExistsSync();
		if (!json) {
			writeFile(path, {});
			return false;
		}
		return Object.assign(Object.create(null), JSON.parse(json));
	} catch (e) {
		if (e.code !== 'ENOENT') throw e;
	}
}
function writeFile(path: string, data: AnyObject) {
	FS(path).writeUpdate(() => (
		JSON.stringify(data)
	));
}

// Load logs
logs = readFile(LOGS_FILE);
if (!logs) logs = {leaderboard: {}, mvps: {}, hosts: {}, plays: {}, leavers: {}};

const tables: MafiaLogSection[] = ['leaderboard', 'mvps', 'hosts', 'plays', 'leavers'];
for (const section of tables) {
	// Check to see if we need to eliminate an old month's data.
	const month = new Date().toLocaleString("en-us", {month: "numeric", year: "numeric"});
	if (!logs[section]) logs[section] = {};
	if (!logs[section][month]) logs[section][month] = {};
	if (Object.keys(logs[section]).length >= 3) {
		// eliminate the oldest month(s)
		const keys = Object.keys(logs[section]).sort((aKey, bKey) => {
			const a = aKey.split('/');
			const b = bKey.split('/');
			if (a[1] !== b[1]) {
				// year
				if (parseInt(a[1]) < parseInt(b[1])) return -1;
				return 1;
			}
			// month
			if (parseInt(a[0]) < parseInt(b[0])) return -1;
			return 1;
		});
		while (keys.length > 2) {
			const curKey = keys.shift();
			if (!curKey) break; // should never happen
			delete logs[section][curKey];
		}
	}
}
writeFile(LOGS_FILE, logs);

// Load bans
hostBans = readFile(BANS_FILE);
if (!hostBans) hostBans = Object.create(null);

for (const userid in hostBans) {
	if (hostBans[userid] < Date.now()) {
		delete hostBans[userid];
	}
}
writeFile(BANS_FILE, hostBans);

function isHostBanned(userid: ID) {
	if (!(userid in hostBans)) return false;
	if (hostBans[userid] < Date.now()) {
		delete hostBans[userid];
		writeFile(BANS_FILE, hostBans);
		return false;
	}
	return true;
}

class MafiaPlayer extends Rooms.RoomGamePlayer {
	safeName: string;
	role: MafiaRole | null;
	lynching: ID;
	lastLynch: number;
	treestump: boolean;
	restless: boolean;
	silenced: boolean;
	IDEA: MafiaIDEAPlayerData | null;
	constructor(user: User, game: MafiaTracker) {
		super(user, game);
		this.safeName = Chat.escapeHTML(this.name);
		this.role = null;
		this.lynching = '';
		this.lastLynch = 0;
		this.treestump = false;
		this.restless = false;
		this.silenced = false;
		this.IDEA = null;
	}

	getRole(button = false) {
		if (!this.role) return;
		let color = MafiaData.alignments[this.role.alignment].color;
		if (button && MafiaData.alignments[this.role.alignment].buttonColor) {
			color = MafiaData.alignments[this.role.alignment].buttonColor;
		}
		return `<span style="font-weight:bold;color:${color}">${this.role.safeName}</span>`;
	}

	updateHtmlRoom() {
		const user = Users.get(this.id);
		if (!user || !user.connected) return;
		if (this.game.ended) return user.send(`>view-mafia-${this.game.room.roomid}\n|deinit`);
		for (const conn of user.connections) {
			void Chat.resolvePage(`view-mafia-${this.game.room.roomid}`, user, conn);
		}
	}
	updateHtmlLynches() {
		const user = Users.get(this.id);
		if (!user || !user.connected) return;
		const lynches = (this.game as MafiaTracker).lynchBoxFor(this.id);
		user.send(`>view-mafia-${this.game.room.roomid}\n|selectorhtml|#mafia-lynches|` + lynches);
	}
}

class MafiaTracker extends Rooms.RoomGame {
	started: boolean;
	theme: MafiaTheme | null;
	hostid: ID;
	host: string;
	cohosts: ID[];
	playerTable: {[userid: string]: MafiaPlayer};
	dead: {[userid: string]: MafiaPlayer};

	subs: ID[];
	autoSub: boolean;
	requestedSub: ID[];
	hostRequestedSub: ID[];
	played: ID[];

	hammerCount: number;
	lynches: {[userid: string]: MafiaLynch};
	lynchModifiers: {[userid: string]: number};
	hammerModifiers: {[userid: string]: number};
	hasPlurality: ID | null;

	enableNL: boolean;
	forceLynch: boolean;
	closedSetup: boolean;
	noReveal: boolean;
	selfEnabled: boolean | 'hammer';

	originalRoles: MafiaRole[];
	originalRoleString: string;
	roles: MafiaRole[];
	roleString: string;

	phase: 'signups' | 'locked' | 'IDEApicking' | 'IDEAlocked' | 'day' | 'night';
	dayNum: number;

	timer: NodeJS.Timer | null;
	dlAt: number;

	IDEA: MafiaIDEAModule;
	constructor(room: ChatRoom, host: User) {
		super(room);

		this.gameid = 'mafia' as ID;
		this.title = 'Mafia';
		this.playerCap = 20;
		this.allowRenames = false;
		this.started = false;
		this.ended = false;

		this.theme = null;

		this.hostid = host.id;
		this.host = Chat.escapeHTML(host.name);
		this.cohosts = [];

		this.playerTable = Object.create(null);
		this.dead = Object.create(null);
		this.subs = [];
		this.autoSub = true;
		this.requestedSub = [];
		this.hostRequestedSub = [];
		this.played = [];

		this.hammerCount = 0;
		this.lynches = Object.create(null);
		this.lynchModifiers = Object.create(null);
		this.hammerModifiers = Object.create(null);
		this.hasPlurality = null;

		this.enableNL = true;
		this.forceLynch = false;
		this.closedSetup = false;
		this.noReveal = false;
		this.selfEnabled = false;

		this.originalRoles = [];
		this.originalRoleString = '';
		this.roles = [];
		this.roleString = '';

		this.phase = "signups";
		this.dayNum = 0;
		this.timer = null;
		this.dlAt = 0;

		this.IDEA = {
			data: null,
			timer: null,
			discardsHidden: false,
			discardsHTML: '',
			waitingPick: [],
		};

		this.sendHTML(this.roomWindow());
	}

	join(user: User) {
		if (this.phase !== 'signups') return user.sendTo(this.room, `|error|The game of ${this.title} has already started.`);
		const canJoin = this.canJoin(user, true);
		if (canJoin) return user.sendTo(this.room, `|error|${canJoin}`);
		if (this.playerCount >= this.playerCap) return user.sendTo(this.room, `|error|The game of ${this.title} is full.`);
		if (!this.addPlayer(user)) return user.sendTo(this.room, `|error|You have already joined the game of ${this.title}.`);
		if (this.subs.includes(user.id)) this.subs.splice(this.subs.indexOf(user.id), 1);
		this.playerTable[user.id].updateHtmlRoom();
		this.sendRoom(`${this.playerTable[user.id].name} has joined the game.`);
	}

	leave(user: User) {
		if (!(user.id in this.playerTable)) return user.sendTo(this.room, `|error|You have not joined the game of ${this.title}.`);
		if (this.phase !== 'signups') return user.sendTo(this.room, `|error|The game of ${this.title} has already started.`);
		this.playerTable[user.id].destroy();
		delete this.playerTable[user.id];
		this.playerCount--;
		let subIndex = this.requestedSub.indexOf(user.id);
		if (subIndex !== -1) this.requestedSub.splice(subIndex, 1);
		subIndex = this.hostRequestedSub.indexOf(user.id);
		if (subIndex !== -1) this.hostRequestedSub.splice(subIndex, 1);
		this.sendRoom(`${user.name} has left the game.`);
		for (const conn of user.connections) {
			void Chat.resolvePage(`view-mafia-${this.room.roomid}`, user, conn);
		}
	}

	makePlayer(user: User) {
		return new MafiaPlayer(user, this);
	}

	setRoles(user: User, roleString: string, force = false, reset = false) {
		let roles = roleString.split(',').map(x => x.trim());
		if (roles.length === 1) {
			// Attempt to set roles from a theme
			const themeName = toID(roles[0]);
			if (themeName in MafiaData.themes) {
				// setting a proper theme
				let theme = MafiaData.themes[themeName];
				if (typeof theme === 'string') theme = MafiaData.themes[theme];
				if (typeof theme === 'object') {
					if (!theme[this.playerCount]) return user.sendTo(this.room, `|error|The theme "${theme.name}" does not have a role list for ${this.playerCount} players.`);
					const themeRoles: string = theme[this.playerCount].slice();
					roles = themeRoles.split(',').map(x => x.trim());
					this.theme = theme;
				} else {
					return this.sendRoom(`Invalid alias in mafia-data themes: ${roles[0]}`);
				}
			} else if (themeName in MafiaData.IDEAs) {
				// setting an IDEA's rolelist as a theme, a la Great Idea
				let IDEA = MafiaData.IDEAs[themeName];
				if (typeof IDEA === 'string') IDEA = MafiaData.IDEAs[IDEA];
				if (typeof IDEA === 'object') {
					roles = IDEA.roles.slice();
				} else {
					return this.sendRoom(`Invalid alias in mafia-data IDEAs: ${roles[0]}`);
				}
				this.theme = null;
			} else {
				return user.sendTo(this.room, `|error|${roles[0]} is not a valid theme or IDEA.`);
			}
		} else {
			this.theme = null;
		}
		if (roles.length < this.playerCount) {
			return user.sendTo(this.room, `|error|You have not provided enough roles for the players.`);
		} else if (roles.length > this.playerCount) {
			user.sendTo(this.room, `|error|You have provided too many roles, ${roles.length - this.playerCount} ${Chat.plural(roles.length - this.playerCount, 'roles', 'role')} will not be assigned.`);
		}

		if (force) {
			this.originalRoles = roles.map(r => {
				return {
					name: r,
					safeName: Chat.escapeHTML(r),
					id: toID(r),
					alignment: 'solo',
					image: '',
					memo: [`To learn more about your role, PM the host (${this.host}).`],
				};
			});
			this.originalRoles.sort((a, b) => a.alignment.localeCompare(b.alignment) || a.name.localeCompare(b.name));
			this.roles = this.originalRoles.slice();
			this.originalRoleString = this.originalRoles.slice().map(r => `<span style="font-weight:bold;color:${MafiaData.alignments[r.alignment].color || '#FFF'}">${r.safeName}</span>`).join(', ');
			this.roleString = this.originalRoleString;
			return this.sendRoom(`The roles have been set.`);
		}

		const newRoles: MafiaRole[] = [];
		let problems: string[] = [];
		const alignments: string[] = [];
		const cache: {[k: string]: MafiaRole} = Object.create(null);
		for (const roleName of roles) {
			const roleId = roleName.toLowerCase().replace(/[^\w\d\s]/g, '');
			if (roleId in cache) {
				newRoles.push(Object.assign(Object.create(null), cache[roleId]));
			} else {
				const role = MafiaTracker.parseRole(roleName);
				if (role.problems.length) problems = problems.concat(role.problems);
				if (alignments.indexOf(role.role.alignment) === -1) alignments.push(role.role.alignment);
				cache[roleId] = role.role;
				newRoles.push(role.role);
			}
		}
		if (alignments.length < 2 && alignments[0] !== 'solo') problems.push(`There must be at least 2 different alignments in a game!`);
		if (problems.length) {
			for (const problem of problems) {
				user.sendTo(this.room, `|error|${problem}`);
			}
			return user.sendTo(this.room, `|error|To forcibly set the roles, use /mafia force${reset ? "re" : ""}setroles`);
		}

		this.IDEA.data = null;

		this.originalRoles = newRoles;
		this.originalRoles.sort((a, b) => a.alignment.localeCompare(b.alignment) || a.name.localeCompare(b.name));
		this.roles = this.originalRoles.slice();
		this.originalRoleString = this.originalRoles.slice().map(r => `<span style="font-weight:bold;color:${MafiaData.alignments[r.alignment].color || '#FFF'}">${r.safeName}</span>`).join(', ');
		this.roleString = this.originalRoleString;
		if (!reset) this.phase = 'locked';
		this.updatePlayers();
		this.sendRoom(`The roles have been ${reset ? 're' : ''}set.`);
		if (reset) this.distributeRoles();
	}

	/**
	 * Parses a single role into an object
	 */
	static parseRole(roleString: string) {
		const name = roleString.split(' ').map(p => toID(p) === 'solo' ? '' : p).join(' ');
		const role = {
			name,
			safeName: Chat.escapeHTML(name),
			id: toID(name),
			image: '',
			memo: ['During the Day, you may vote for whomever you want lynched.'],
			alignment: '',
		};
		roleString = roleString.replace(/\s*\(.*?\)\s*/g, ' ');
		const target = roleString.toLowerCase().replace(/[^\w\d\s]/g, '').split(' ');
		const problems = [];
		for (let key in MafiaData.roles) {
			if (key.includes('_')) {
				const roleKey = target.slice().map(toID).join('_');
				if (roleKey.includes(key)) {
					const originalKey = key;
					if (typeof MafiaData.roles[key] === 'string') key = MafiaData.roles[key];
					if (!role.image && MafiaData.roles[key].image) role.image = MafiaData.roles[key].image;
					if (MafiaData.roles[key].alignment) {
						if (role.alignment && role.alignment !== MafiaData.roles[key].alignment) {
							// A role cant have multiple alignments
							problems.push(`The role "${role.name}" has multiple possible alignments (${MafiaData.roles[key].alignment} or ${role.alignment})`);
							break;
						}
						role.alignment = MafiaData.roles[key].alignment;
					}
					if (MafiaData.roles[key].memo) role.memo = role.memo.concat(MafiaData.roles[key].memo);
					const index = roleKey.split('_').indexOf(originalKey.split('_')[0]);
					target.splice(index, originalKey.split('_').length);
				}
			} else if (target.includes(key)) {
				const index = target.indexOf(key);
				if (typeof MafiaData.roles[key] === 'string') key = MafiaData.roles[key];
				if (!role.image && MafiaData.roles[key].image) role.image = MafiaData.roles[key].image;
				if (MafiaData.roles[key].memo) role.memo = role.memo.concat(MafiaData.roles[key].memo);
				target.splice(index, 1);
			}
		}
		// Add modifiers
		for (let key in MafiaData.modifiers) {
			if (key.includes('_')) {
				const roleKey = target.slice().map(toID).join('_');
				if (roleKey.includes(key)) {
					if (typeof MafiaData.modifiers[key] === 'string') key = MafiaData.modifiers[key];
					if (!role.image && MafiaData.modifiers[key].image) role.image = MafiaData.modifiers[key].image;
					if (MafiaData.modifiers[key].memo) role.memo = role.memo.concat(MafiaData.modifiers[key].memo);
					const index = roleKey.split('_').indexOf(key.split('_')[0]);
					target.splice(index, key.split('_').length);
				}
			} else if (key === 'xshot') {
				// Special case for X-Shot modifier
				for (let [i, xModifier] of target.entries()) {
					if (toID(xModifier).endsWith('shot')) {
						const num = parseInt(toID(xModifier).substring(0, toID(xModifier).length - 4));
						if (isNaN(num)) continue;
						let memo: string[] = MafiaData.modifiers.xshot.memo.slice();
						memo = memo.map(m => m.replace(/X/g, num.toString()));
						role.memo = role.memo.concat(memo);
						target.splice(i, 1);
						i--;
					}
				}
			} else if (target.includes(key)) {
				const index = target.indexOf(key);
				if (typeof MafiaData.modifiers[key] === 'string') key = MafiaData.modifiers[key];
				if (!role.image && MafiaData.modifiers[key].image) role.image = MafiaData.modifiers[key].image;
				if (MafiaData.modifiers[key].memo) role.memo = role.memo.concat(MafiaData.modifiers[key].memo);
				target.splice(index, 1);
			}
		}
		// Determine the role's alignment
		for (let [j, targetId] of target.entries()) {
			let id = toID(targetId);
			if (MafiaData.alignments[id]) {
				if (typeof MafiaData.alignments[id] === 'string') id = MafiaData.alignments[id];
				if (role.alignment && role.alignment !== MafiaData.alignments[id].id) {
					// A role cant have multiple alignments
					problems.push(`The role "${role.name}" has multiple possible alignments (${MafiaData.alignments[id].id} or ${role.alignment})`);
					break;
				}
				role.alignment = MafiaData.alignments[id].id;
				role.memo = role.memo.concat(MafiaData.alignments[id].memo);
				if (!role.image && MafiaData.alignments[id].image) role.image = MafiaData.alignments[id].image;
				target.splice(j, 1);
				j--;
			}
		}
		if (!role.alignment) {
			// Default to town
			role.alignment = 'town';
			role.memo = role.memo.concat(MafiaData.alignments.town.memo);
		}
		// Handle anything that is unknown
		if (target.length) {
			role.memo.push(`To learn more about your role, PM the host.`);
		}
		return {role, problems};
	}

	start(user: User, night = false) {
		if (!user) return;
		if (this.phase !== 'locked' && this.phase !== 'IDEAlocked') {
			if (this.phase === 'signups') return user.sendTo(this.room, `You need to close the signups first.`);
			if (this.phase === 'IDEApicking') return user.sendTo(this.room, `You must wait for IDEA picks to finish before starting.`);
			return user.sendTo(this.room, `The game is already started!`);
		}
		if (this.playerCount < 2) return user.sendTo(this.room, `You need at least 2 players to start.`);
		if (this.phase === 'IDEAlocked') {
			for (const p in this.playerTable) {
				if (!this.playerTable[p].role) return user.sendTo(this.room, `|error|Not all players have a role.`);
			}
		} else {
			if (!Object.keys(this.roles).length) return user.sendTo(this.room, `You need to set the roles before starting.`);
			if (Object.keys(this.roles).length < this.playerCount) return user.sendTo(this.room, `You have not provided enough roles for the players.`);
		}
		this.started = true;
		this.sendDeclare(`The game of ${this.title} is starting!`);
		// MafiaTracker#played gets set in distributeRoles
		this.distributeRoles();
		if (night) {
			this.night(false, true);
		} else {
			this.day(null, true);
		}
		if (this.IDEA.data && !this.IDEA.discardsHidden) this.room.add(`|html|<div class="infobox"><details><summary>IDEA discards:</summary>${this.IDEA.discardsHTML}</details></div>`).update();
	}

	distributeRoles() {
		const roles = Dex.shuffle(this.roles.slice());
		if (roles.length) {
			for (const p in this.playerTable) {
				const role = roles.shift()!;
				this.playerTable[p].role = role;
				const u = Users.get(p);
				if (u && u.connected) u.send(`>${this.room.roomid}\n|notify|Your role is ${role.safeName}. For more details of your role, check your Role PM.`);
			}
		}
		this.dead = {};
		this.played = [this.hostid, ...this.cohosts, ...(Object.keys(this.playerTable) as ID[])];
		this.sendDeclare(`The roles have been distributed.`);
		this.updatePlayers();
	}

	getPartners(alignment: string, player: MafiaPlayer) {
		if (!player || !player.role || ['town', 'solo', 'traitor'].includes(player.role.alignment)) return "";
		const partners = [];
		for (const p in this.playerTable) {
			if (p === player.id) continue;
			const role = this.playerTable[p].role;
			if (role && role.alignment === player.role.alignment) partners.push(this.playerTable[p].name);
		}
		return partners.join(", ");
	}

	day(extension: number | null = null, initial = false) {
		if (this.phase !== 'night' && !initial) return;
		if (this.timer) this.setDeadline(0);
		if (extension === null) {
			if (!isNaN(this.hammerCount)) this.hammerCount = Math.floor(Object.keys(this.playerTable).length / 2) + 1;
			this.clearLynches();
		}
		this.phase = 'day';
		if (extension !== null && !initial) {
			// Day stays same
			this.setDeadline(extension);
		} else {
			this.dayNum++;
		}
		if (isNaN(this.hammerCount)) {
			this.sendDeclare(`Day ${this.dayNum}. Hammering is disabled.`);
		} else {
			this.sendDeclare(`Day ${this.dayNum}. The hammer count is set at ${this.hammerCount}`);
		}
		this.sendPlayerList();
		this.updatePlayers();
	}

	night(early = false, initial = false) {
		if (this.phase !== 'day' && !initial) return;
		if (this.timer) this.setDeadline(0, true);
		this.phase = 'night';
		for (const hostid of [...this.cohosts, this.hostid]) {
			const host = Users.get(hostid);
			if (host && host.connected) host.send(`>${this.room.roomid}\n|notify|It's night in your game of Mafia!`);
		}
		this.sendDeclare(`Night ${this.dayNum}. PM the host your action, or idle.`);
		const hasPlurality = this.getPlurality();
		if (!early && hasPlurality) this.sendRoom(`Plurality is on ${this.playerTable[hasPlurality] ? this.playerTable[hasPlurality].name : 'No Lynch'}`);
		if (!early && !initial) this.sendRoom(`|raw|<div class="infobox">${this.lynchBox()}</div>`);
		if (initial && !isNaN(this.hammerCount)) this.hammerCount = Math.floor(Object.keys(this.playerTable).length / 2) + 1;
		this.updatePlayers();
	}

	lynch(userid: ID, target: ID) {
		if (this.phase !== 'day') return this.sendUser(userid, `|error|You can only lynch during the day.`);
		let player = this.playerTable[userid];
		if (!player && this.dead[userid] && this.dead[userid].restless) player = this.dead[userid];
		if (!player) return;
		if (!(target in this.playerTable) && target !== 'nolynch') return this.sendUser(userid, `|error|${target} is not a valid player.`);
		if (!this.enableNL && target === 'nolynch') return this.sendUser(userid, `|error|No Lynch is not allowed.`);
		if (target === player.id && !this.selfEnabled) return this.sendUser(userid, `|error|Self lynching is not allowed.`);
		if (target === player.id &&
			(this.hammerCount - 1 > (this.lynches[target] ? this.lynches[target].count : 0)) &&
			this.selfEnabled === 'hammer') {
			return this.sendUser(userid, `|error|You may only lynch yourself when you placing the hammer vote.`);
		}
		if (player.lastLynch + 2000 >= Date.now()) return this.sendUser(userid, `|error|You must wait another ${Chat.toDurationString((player.lastLynch + 2000) - Date.now()) || '1 second'} before you can change your lynch.`);
		const previousLynch = player.lynching;
		if (previousLynch) this.unlynch(userid, true);
		let lynch = this.lynches[target];
		if (!lynch) {
			this.lynches[target]
				= {count: 1, trueCount: this.getLynchValue(userid), lastLynch: Date.now(), dir: 'up', lynchers: [userid]};
			lynch = this.lynches[target];
		} else {
			lynch.count++;
			lynch.trueCount += this.getLynchValue(userid);
			lynch.lastLynch = Date.now();
			lynch.dir = 'up';
			lynch.lynchers.push(userid);
		}
		player.lynching = target;
		const name = player.lynching === 'nolynch' ? 'No Lynch' : this.playerTable[player.lynching].name;
		const targetUser = Users.get(userid);
		if (previousLynch) {
			this.sendTimestamp(`${(targetUser ? targetUser.name : userid)} has shifted their lynch from ${previousLynch === 'nolynch' ? 'No Lynch' : this.playerTable[previousLynch].name} to ${name}`);
		} else {
			this.sendTimestamp(name === 'No Lynch' ? `${(targetUser ? targetUser.name : userid)} has abstained from lynching.` : `${(targetUser ? targetUser.name : userid)} has lynched ${name}.`);
		}
		player.lastLynch = Date.now();
		if (this.getHammerValue(target) <= lynch.trueCount) {
			// HAMMER
			this.sendDeclare(`Hammer! ${target === 'nolynch' ? 'Nobody' : Chat.escapeHTML(name)} was lynched!`);
			this.sendRoom(`|raw|<div class="infobox">${this.lynchBox()}</div>`);
			if (target !== 'nolynch') this.eliminate(this.playerTable[target], 'kill');
			this.night(true);
			return;
		}
		this.hasPlurality = null;
		this.updatePlayersLynches();
	}

	unlynch(userid: ID, force = false) {
		if (this.phase !== 'day' && !force) return this.sendUser(userid, `|error|You can only lynch during the day.`);
		let player = this.playerTable[userid];

		// autoselflynch blocking doesn't apply to restless spirits
		if (player && this.forceLynch && !force) return this.sendUser(userid, `|error|You can only shift your lynch, not unlynch.`);

		if (!player && this.dead[userid] && this.dead[userid].restless) player = this.dead[userid];
		if (!player || !player.lynching) return this.sendUser(userid, `|error|You are not lynching anyone.`);
		if (player.lastLynch + 2000 >= Date.now() && !force) return this.sendUser(userid, `|error|You must wait another ${Chat.toDurationString((player.lastLynch + 2000) - Date.now()) || '1 second'} before you can change your lynch.`);
		const lynch = this.lynches[player.lynching];
		lynch.count--;
		lynch.trueCount -= this.getLynchValue(userid);
		if (lynch.count <= 0) {
			delete this.lynches[player.lynching];
		} else {
			lynch.lastLynch = Date.now();
			lynch.dir = 'down';
			lynch.lynchers.splice(lynch.lynchers.indexOf(userid), 1);
		}
		const targetUser = Users.get(userid);
		if (!force) this.sendTimestamp(player.lynching === 'nolynch' ? `${(targetUser ? targetUser.name : userid)} is no longer abstaining from lynching.` : `${(targetUser ? targetUser.name : userid)} has unlynched ${this.playerTable[player.lynching].name}.`);
		player.lynching = '';
		player.lastLynch = Date.now();
		this.hasPlurality = null;
		this.updatePlayersLynches();
	}

	/**
	 * Returns HTML code that contains information on the current lynch vote.
	 */
	lynchBox() {
		if (!this.started) return `<strong>The game has not started yet.</strong>`;
		let buf = `<strong>Lynches (Hammer: ${this.hammerCount || "Disabled"})</strong><br />`;
		const plur = this.getPlurality();
		const list = Object.keys(this.lynches).sort((a, b) => {
			if (a === plur) return -1;
			if (b === plur) return 1;
			return this.lynches[b].count - this.lynches[a].count;
		});
		for (const key of list) {
			buf += `${this.lynches[key].count}${plur === key ? '*' : ''} ${this.playerTable[key] ? this.playerTable[key].safeName : 'No Lynch'} (${this.lynches[key].lynchers.map(a => this.playerTable[a] ? this.playerTable[a].safeName : a).join(', ')})<br />`;
		}
		return buf;
	}
	lynchBoxFor(userid: ID) {
		let buf = '';
		buf += `<h3>Lynches (Hammer: ${this.hammerCount || 'Disabled'}) <button class="button" name="send" value="/mafia refreshlynches ${this.roomid}"><i class="fa fa-refresh"></i> Refresh</button></h3>`;
		const plur = this.getPlurality();
		for (const key of Object.keys(this.playerTable).concat((this.enableNL ? ['nolynch'] : [])) as ID[]) {
			if (this.lynches[key]) {
				buf += `<p style="font-weight:bold">${this.lynches[key].count}${plur === key ? '*' : ''} ${this.playerTable[key] ? this.playerTable[key].safeName : 'No Lynch'} (${this.lynches[key].lynchers.map(a => this.playerTable[a] ? this.playerTable[a].safeName : a).join(', ')}) `;
			} else {
				buf += `<p style="font-weight:bold">0 ${this.playerTable[key] ? this.playerTable[key].safeName : 'No Lynch'} `;
			}
			const isPlayer = (this.playerTable[userid]);
			const isSpirit = (this.dead[userid] && this.dead[userid].restless);
			if (isPlayer || isSpirit) {
				if (isPlayer && this.playerTable[userid].lynching === key || isSpirit && this.dead[userid].lynching === key) {
					buf += `<button class="button" name="send" value="/mafia unlynch ${this.roomid}">Unlynch ${this.playerTable[key] ? this.playerTable[key].safeName : 'No Lynch'}</button>`;
				} else if ((this.selfEnabled && !isSpirit) || userid !== key) {
					buf += `<button class="button" name="send" value="/mafia lynch ${this.roomid}, ${key}">Lynch ${this.playerTable[key] ? this.playerTable[key].safeName : 'No Lynch'}</button>`;
				}
			} else if (userid === this.hostid || this.cohosts.includes(userid)) {
				const lynch = this.lynches[key];
				if (lynch && lynch.count !== lynch.trueCount) buf += `(${lynch.trueCount})`;
				if (this.hammerModifiers[key]) buf += `(${this.getHammerValue(key)} to hammer)`;
			}
			buf += `</p>`;
		}
		return buf;
	}
	applyLynchModifier(user: User, target: ID, mod: number) {
		const targetPlayer = this.playerTable[target] || this.dead[target];
		if (!targetPlayer) return this.sendUser(user, `|error|${target} is not in the game of mafia.`);
		if (target in this.dead && !targetPlayer.restless) return this.sendUser(user, `|error|${target} is not alive or a restless spirit, and therefore cannot lynch.`);
		const oldMod = this.lynchModifiers[target];
		if (mod === oldMod || ((isNaN(mod) || mod === 1) && oldMod === undefined)) {
			if (isNaN(mod) || mod === 1) return this.sendUser(user, `|error|${target} already has no lynch modifier.`);
			return this.sendUser(user, `|error|${target} already has a lynch modifier of ${mod}`);
		}
		const newMod = isNaN(mod) ? 1 : mod;
		if (targetPlayer.lynching) {
			this.lynches[targetPlayer.lynching].trueCount += oldMod - newMod;
			if (this.getHammerValue(targetPlayer.lynching) <= this.lynches[targetPlayer.lynching].trueCount) {
				this.sendRoom(`${targetPlayer.lynching} has been lynched due to a modifier change! They have not been eliminated.`);
				this.night(true);
			}
		}
		if (newMod === 1) {
			delete this.lynchModifiers[target];
			return this.sendUser(user, `${targetPlayer.name} has had their lynch modifier removed.`);
		} else {
			this.lynchModifiers[target] = newMod;
			return this.sendUser(user, `${targetPlayer.name} has been given a lynch modifier of ${newMod}`);
		}
	}
	applyHammerModifier(user: User, target: ID, mod: number) {
		if (!(target in this.playerTable || target === 'nolynch')) return this.sendUser(user, `|error|${target} is not in the game of mafia.`);
		const oldMod = this.hammerModifiers[target];
		if (mod === oldMod || ((isNaN(mod) || mod === 0) && oldMod === undefined)) {
			if (isNaN(mod) || mod === 0) return this.sendUser(user, `|error|${target} already has no hammer modifier.`);
			return this.sendUser(user, `|error|${target} already has a hammer modifier of ${mod}`);
		}
		const newMod = isNaN(mod) ? 0 : mod;
		if (this.lynches[target]) {
			// do this manually since we havent actually changed the value yet
			if (this.hammerCount + newMod <= this.lynches[target].trueCount) {
				// make sure these strings are the same
				this.sendRoom(`${target} has been lynched due to a modifier change! They have not been eliminated.`);
				this.night(true);
			}
		}
		if (newMod === 0) {
			delete this.hammerModifiers[target];
			return this.sendUser(user, `${target} has had their hammer modifier removed.`);
		} else {
			this.hammerModifiers[target] = newMod;
			return this.sendUser(user, `${target} has been given a hammer modifier of ${newMod}`);
		}
	}
	clearLynchModifiers(user: User) {
		for (const player of [...Object.keys(this.playerTable), ...Object.keys(this.dead)] as ID[]) {
			if (this.lynchModifiers[player]) this.applyLynchModifier(user, player, 1);
		}
	}
	clearHammerModifiers(user: User) {
		for (const player of ['nolynch', ...Object.keys(this.playerTable)] as ID[]) {
			if (this.hammerModifiers[player]) this.applyHammerModifier(user, player, 0);
		}
	}

	getLynchValue(userid: ID) {
		const mod = this.lynchModifiers[userid];
		return (mod === undefined ? 1 : mod);
	}
	getHammerValue(userid: ID) {
		const mod = this.hammerModifiers[userid];
		return (mod === undefined ? this.hammerCount : this.hammerCount + mod);
	}
	resetHammer() {
		this.setHammer(Math.floor(Object.keys(this.playerTable).length / 2) + 1);
	}

	setHammer(count: number) {
		this.hammerCount = count;
		if (isNaN(count)) {
			this.sendDeclare(`Hammering has been disabled, and lynches have been reset.`);
		} else {
			this.sendDeclare(`The hammer count has been set at ${this.hammerCount}, and lynches have been reset.`);
		}
		this.clearLynches();
	}

	shiftHammer(count: number) {
		this.hammerCount = count;
		if (isNaN(count)) {
			this.sendDeclare(`Hammering has been disabled. Lynches have not been reset.`);
		} else {
			this.sendDeclare(`The hammer count has been shifted to ${this.hammerCount}. Lynches have not been reset.`);
		}
		const hammered = [];
		for (const lynch in this.lynches) {
			if (this.lynches[lynch].trueCount >= this.getHammerValue(lynch as ID)) {
				hammered.push(lynch === 'nolynch' ? 'Nobody' : lynch);
			}
		}
		if (hammered.length) {
			this.sendDeclare(`${Chat.count(hammered, "players have")} been hammered: ${hammered.join(', ')}. They have not been removed from the game.`);
			this.night(true);
		}
	}

	getPlurality() {
		if (this.hasPlurality) return this.hasPlurality;
		if (!Object.keys(this.lynches).length) return null;
		let max = 0;
		let topLynches: ID[] = [];
		for (const key in this.lynches) {
			if (this.lynches[key].count > max) {
				max = this.lynches[key].count;
				topLynches = [key as ID];
			} else if (this.lynches[key].count === max) {
				topLynches.push(key as ID);
			}
		}
		if (topLynches.length <= 1) {
			this.hasPlurality = topLynches[0];
			return this.hasPlurality;
		}
		topLynches = topLynches.sort((key1, key2) => {
			const l1 = this.lynches[key1];
			const l2 = this.lynches[key2];
			if (l1.dir !== l2.dir) {
				return (l1.dir === 'down' ? -1 : 1);
			} else {
				if (l1.dir === 'up') return (l1.lastLynch < l2.lastLynch ? -1 : 1);
				return (l1.lastLynch > l2.lastLynch ? -1 : 1);
			}
		});
		this.hasPlurality = topLynches[0];
		return this.hasPlurality;
	}

	eliminate(player: MafiaPlayer, ability = 'kill') {
		if (!(player.id in this.playerTable)) return;
		if (!this.started) {
			// Game has not started, simply kick the player
			this.sendDeclare(`${player.safeName} was kicked from the game!`);
			if (this.hostRequestedSub.includes(player.id)) {
				this.hostRequestedSub.splice(this.hostRequestedSub.indexOf(player.id), 1);
			}
			if (this.requestedSub.includes(player.id)) {
				this.requestedSub.splice(this.requestedSub.indexOf(player.id), 1);
			}
			delete this.playerTable[player.id];
			this.playerCount--;
			player.updateHtmlRoom();
			player.destroy();
			return;
		}
		this.dead[player.id] = player;
		let msg = `${player.safeName}`;
		switch (ability) {
		case 'treestump':
			this.dead[player.id].treestump = true;
			msg += ` has been treestumped`;
			break;
		case 'spirit':
			this.dead[player.id].restless = true;
			msg += ` became a restless spirit`;
			break;
		case 'spiritstump':
			this.dead[player.id].treestump = true;
			this.dead[player.id].restless = true;
			msg += ` became a restless treestump`;
			break;
		case 'kick':
			msg += ` was kicked from the game`;
			break;
		default:
			msg += ` was eliminated`;
		}
		if (player.lynching) this.unlynch(player.id, true);
		this.sendDeclare(`${msg}! ${!this.noReveal && toID(ability) === 'kill' ? `${player.safeName}'s role was ${player.getRole()}.` : ''}`);
		const targetRole = player.role;
		if (targetRole) {
			for (const [roleIndex, role] of this.roles.entries()) {
				if (role.id === targetRole.id) {
					this.roles.splice(roleIndex, 1);
					break;
				}
			}
		}
		this.clearLynches(player.id);
		delete this.playerTable[player.id];
		let subIndex = this.requestedSub.indexOf(player.id);
		if (subIndex !== -1) this.requestedSub.splice(subIndex, 1);
		subIndex = this.hostRequestedSub.indexOf(player.id);
		if (subIndex !== -1) this.hostRequestedSub.splice(subIndex, 1);

		this.playerCount--;
		this.updateRoleString();
		this.updatePlayers();
		player.updateHtmlRoom();
	}

	revive(user: User, toRevive: string, force = false) {
		if (this.phase === 'IDEApicking') return user.sendTo(this.room, `|error|You cannot add or remove players while IDEA roles are being picked.`);
		if (toRevive in this.playerTable) {
			user.sendTo(this.room, `|error|The user ${toRevive} is already a living player.`);
			return;
		}
		if (toRevive in this.dead) {
			const deadPlayer = this.dead[toRevive];
			if (deadPlayer.treestump) deadPlayer.treestump = false;
			if (deadPlayer.restless) deadPlayer.restless = false;
			this.sendDeclare(`${deadPlayer.safeName} was revived!`);
			this.playerTable[deadPlayer.id] = deadPlayer;
			const targetRole = deadPlayer.role;
			if (targetRole) {
				this.roles.push(targetRole);
			} else {
				// Should never happen
				deadPlayer.role = {
					name: `Unknown`,
					safeName: `Unknown`,
					id: `unknown`,
					alignment: 'solo',
					image: '',
					memo: [`You were revived, but had no role. Please let a Mafia Room Owner know this happened. To learn about your role, PM the host (${this.host}).`],
				};
				this.roles.push(deadPlayer.role);
			}
			this.roles.sort((a, b) => a.alignment.localeCompare(b.alignment) || a.name.localeCompare(b.name));
			delete this.dead[deadPlayer.id];
		} else {
			const targetUser = Users.get(toRevive);
			if (!targetUser) return;
			const canJoin = this.canJoin(targetUser, false, force);
			if (canJoin) {
				user.sendTo(this.room, `|error|${canJoin}`);
				return;
			}
			const player = this.makePlayer(targetUser);
			if (this.started) {
				player.role = {
					name: `Unknown`,
					safeName: `Unknown`,
					id: `unknown`,
					alignment: 'solo',
					image: '',
					memo: [`You were added to the game after it had started. To learn about your role, PM the host (${this.host}).`],
				};
				this.roles.push(player.role);
			} else {
				this.originalRoles = [];
				this.originalRoleString = '';
				this.roles = [];
				this.roleString = '';
			}
			if (this.subs.includes(targetUser.id)) this.subs.splice(this.subs.indexOf(targetUser.id), 1);
			this.played.push(targetUser.id);
			this.playerTable[targetUser.id] = player;
			this.sendDeclare(Chat.html`${targetUser.name} has been added to the game by ${user.name}!`);
		}
		this.playerCount++;
		this.updateRoleString();
		this.updatePlayers();
	}

	setDeadline(minutes: number, silent = false) {
		if (isNaN(minutes)) return;
		if (!minutes) {
			if (!this.timer) return;
			clearTimeout(this.timer);
			this.timer = null;
			this.dlAt = 0;
			if (!silent) this.sendTimestamp(`**The deadline has been cleared.**`);
			return;
		}
		if (minutes < 1 || minutes > 20) return;
		if (this.timer) clearTimeout(this.timer);
		this.dlAt = Date.now() + (minutes * 60000);
		if (minutes > 3) {
			this.timer = setTimeout(() => {
				this.sendTimestamp(`**3 minutes left!**`);
				this.timer = setTimeout(() => {
					this.sendTimestamp(`**1 minute left!**`);
					this.timer = setTimeout(() => {
						this.sendTimestamp(`**Time is up!**`);
						this.night();
					}, 60000);
				}, 2 * 60000);
			}, (minutes - 3) * 60000);
		} else if (minutes > 1) {
			this.timer = setTimeout(() => {
				this.sendTimestamp(`**1 minute left!**`);
				this.timer = setTimeout(() => {
					this.sendTimestamp(`**Time is up!**`);
					if (this.phase === 'day') this.night();
				}, 60000);
			}, (minutes - 1) * 60000);
		} else {
			this.timer = setTimeout(() => {
				this.sendTimestamp(`**Time is up!**`);
				if (this.phase === 'day') this.night();
			}, minutes * 60000);
		}
		this.sendTimestamp(`**The deadline has been set for ${minutes} minute${minutes === 1 ? '' : 's'}.**`);
	}

	sub(player: string, replacement: string) {
		const oldPlayer = this.playerTable[player];
		if (!oldPlayer) return; // should never happen

		const newUser = Users.get(replacement);
		if (!newUser) return; // should never happen
		const newPlayer = this.makePlayer(newUser);
		newPlayer.role = oldPlayer.role;
		newPlayer.IDEA = oldPlayer.IDEA;
		if (oldPlayer.lynching) {
			// Dont change plurality
			const lynch = this.lynches[oldPlayer.lynching];
			lynch.lynchers.splice(lynch.lynchers.indexOf(oldPlayer.id), 1);
			lynch.lynchers.push(newPlayer.id);
			newPlayer.lynching = oldPlayer.lynching;
			oldPlayer.lynching = '';
		}
		this.playerTable[newPlayer.id] = newPlayer;
		// Transfer lynches on the old player to the new one
		if (this.lynches[oldPlayer.id]) {
			this.lynches[newPlayer.id] = this.lynches[oldPlayer.id];
			delete this.lynches[oldPlayer.id];
			for (const p in this.playerTable) {
				if (this.playerTable[p].lynching === oldPlayer.id) this.playerTable[p].lynching = newPlayer.id;
			}
			for (const p in this.dead) {
				if (this.dead[p].restless && this.dead[p].lynching === oldPlayer.id) this.dead[p].lynching = newPlayer.id;
			}
		}
		if (newUser && newUser.connected) {
			for (const conn of newUser.connections) {
				void Chat.resolvePage(`view-mafia-${this.room.roomid}`, newUser, conn);
			}
			newUser.send(`>${this.room.roomid}\n|notify|You have been substituted in the mafia game for ${oldPlayer.safeName}.`);
		}
		if (this.started) this.played.push(newPlayer.id);
		this.sendDeclare(`${oldPlayer.safeName} has been subbed out. ${newPlayer.safeName} has joined the game.`);
		this.updatePlayers();

		delete this.playerTable[oldPlayer.id];
		oldPlayer.destroy();

		if (this.room.roomid === 'mafia' && this.started) {
			const month = new Date().toLocaleString("en-us", {month: "numeric", year: "numeric"});
			if (!logs.leavers[month]) logs.leavers[month] = {};
			if (!logs.leavers[month][player]) logs.leavers[month][player] = 0;
			logs.leavers[month][player]++;
			writeFile(LOGS_FILE, logs);
		}
	}

	nextSub(userid: ID | null = null) {
		if (!this.subs.length ||
			(!this.hostRequestedSub.length && ((!this.requestedSub.length || !this.autoSub)) && !userid)) {
			return;
		}
		const nextSub = this.subs.shift();
		if (!nextSub) return;
		const sub = Users.get(nextSub, true);
		if (!sub || !sub.connected || !sub.named || !this.room.users[sub.id]) return; // should never happen, just to be safe
		const toSubOut = userid || this.hostRequestedSub.shift() || this.requestedSub.shift();
		if (!toSubOut) {
			// Should never happen
			this.subs.unshift(nextSub);
			return;
		}
		if (this.hostRequestedSub.includes(toSubOut)) {
			this.hostRequestedSub.splice(this.hostRequestedSub.indexOf(toSubOut), 1);
		}
		if (this.requestedSub.includes(toSubOut)) {
			this.requestedSub.splice(this.requestedSub.indexOf(toSubOut), 1);
		}
		this.sub(toSubOut, sub.id);
	}

	customIdeaInit(user: User, choices: number, picks: string[], rolesString: string) {
		this.originalRoles = [];
		this.originalRoleString = '';
		this.roles = [];
		this.roleString = '';

		const roles = Chat.stripHTML(rolesString);
		let roleList = roles.split('\n');
		if (roleList.length === 1) {
			roleList = roles.split(',').map(r => r.trim());
		}

		this.IDEA.data = {
			name: `${this.host}'s custom IDEA`, // already escaped
			untrusted: true,
			roles: roleList,
			picks,
			choices,
		};
		return this.ideaDistributeRoles(user);
	}
	ideaInit(user: User, moduleName: string) {
		this.originalRoles = [];
		this.originalRoleString = '';
		this.roles = [];
		this.roleString = '';

		this.IDEA.data = MafiaData.IDEAs[moduleName];
		if (typeof this.IDEA.data === 'string') this.IDEA.data = MafiaData.IDEAs[this.IDEA.data];
		if (!this.IDEA.data) return user.sendTo(this.room, `|error|${moduleName} is not a valid IDEA.`);
		if (typeof this.IDEA.data !== 'object') return this.sendRoom(`Invalid alias for IDEA ${moduleName}. Please report this to a mod.`);
		return this.ideaDistributeRoles(user);
	}

	ideaDistributeRoles(user: User) {
		if (!this.IDEA.data) return user.sendTo(this.room, `|error|No IDEA module loaded`);
		if (this.phase !== 'locked' && this.phase !== 'IDEAlocked') return user.sendTo(this.room, `|error|The game must be in a locked state to distribute IDEA roles.`);

		const neededRoles = this.IDEA.data.choices * this.playerCount;
		if (neededRoles > this.IDEA.data.roles.length) return user.sendTo(this.room, `|error|Not enough roles in the IDEA module.`);

		const roles = [];
		const selectedIndexes = [];
		for (let i = 0; i < neededRoles; i++) {
			let randomIndex;
			do {
				randomIndex = Math.floor(Math.random() * this.IDEA.data.roles.length);
			} while (selectedIndexes.indexOf(randomIndex) !== -1);
			roles.push(this.IDEA.data.roles[randomIndex]);
			selectedIndexes.push(randomIndex);
		}
		Dex.shuffle(roles);
		this.IDEA.waitingPick = [];
		for (const p in this.playerTable) {
			const player = this.playerTable[p];
			player.role = null;
			player.IDEA = {
				choices: roles.splice(0, this.IDEA.data.choices),
				originalChoices: [], // MAKE SURE TO SET THIS
				picks: {},
			};
			player.IDEA.originalChoices = player.IDEA.choices.slice();
			for (const pick of this.IDEA.data.picks) {
				player.IDEA.picks[pick] = null;
				this.IDEA.waitingPick.push(p);
			}
			const u = Users.get(p);
			if (u && u.connected) u.send(`>${this.room.roomid}\n|notify|Pick your role in the IDEA module.`);
		}

		this.phase = 'IDEApicking';
		this.updatePlayers();

		this.sendDeclare(`${this.IDEA.data.name} roles have been distributed. You will have ${IDEA_TIMER / 1000} seconds to make your picks.`);
		this.IDEA.timer = setTimeout(() => { this.ideaFinalizePicks(); }, IDEA_TIMER);

		return ``;
	}

	ideaPick(user: User, selection: string[]) {
		let buf = '';
		if (this.phase !== 'IDEApicking') return 'The game is not in the IDEA picking phase.';
		if (!this.IDEA || !this.IDEA.data) return this.sendRoom(`Trying to pick an IDEA role with no module running, target: ${JSON.stringify(selection)}. Please report this to a mod.`);
		const player = this.playerTable[user.id];
		if (!player.IDEA) return this.sendRoom(`Trying to pick an IDEA role with no player IDEA object, user: ${user.id}. Please report this to a mod.`);
		selection = selection.map(toID) as ID[];
		if (selection.length === 1 && this.IDEA.data.picks.length === 1) selection = [this.IDEA.data.picks[0], selection[0]];
		if (selection.length !== 2) return user.sendTo(this.room, `|error|Invalid selection.`);

		// input is formatted as ['selection', 'role']
		// eg: ['role', 'bloodhound']
		// ['alignment', 'alien']
		// ['selection', ''] deselects
		if (selection[1]) {
			const roleIndex = player.IDEA.choices.map(toID).indexOf(selection[1] as ID);
			if (roleIndex === -1) return user.sendTo(this.room, `|error|${selection[1]} is not an available role, perhaps it is already selected?`);
			selection[1] = player.IDEA.choices.splice(roleIndex, 1)[0];
		} else {
			selection[1] = '';
		}
		const selected = player.IDEA.picks[selection[0]];
		if (selected) {
			buf += `You have deselected ${selected}. `;
			player.IDEA.choices.push(selected);
		}

		if (player.IDEA.picks[selection[0]] && !selection[1]) {
			this.IDEA.waitingPick.push(player.id);
		} else if (!player.IDEA.picks[selection[0]] && selection[1]) {
			this.IDEA.waitingPick.splice(this.IDEA.waitingPick.indexOf(player.id), 1);
		}

		player.IDEA.picks[selection[0]] = selection[1];
		if (selection[1]) buf += `You have selected ${selection[0]}: ${selection[1]}.`;
		player.updateHtmlRoom();
		if (!this.IDEA.waitingPick.length) {
			if (this.IDEA.timer) clearTimeout(this.IDEA.timer);
			this.ideaFinalizePicks();
			return;
		}
		return user.sendTo(this.room, buf);
	}

	ideaFinalizePicks() {
		if (!this.IDEA || !this.IDEA.data) return this.sendRoom(`Tried to finalize IDEA picks with no IDEA module running, please report this to a mod.`);
		const randed = [];
		for (const p in this.playerTable) {
			const player = this.playerTable[p];
			if (!player.IDEA) return this.sendRoom(`Trying to pick an IDEA role with no player IDEA object, user: ${player.id}. Please report this to a mod.`);
			let randPicked = false;
			const role = [];
			for (const choice of this.IDEA.data.picks) {
				if (!player.IDEA.picks[choice]) {
					randPicked = true;
					const randomChoice = player.IDEA.choices.shift();
					if (randomChoice) {
						player.IDEA.picks[choice] = randomChoice;
					} else {
						throw new Error(`No roles left to randomly assign from IDEA module choices.`);
					}
					this.sendUser(player.id, `You were randomly assigned ${choice}: ${randomChoice}`);
				}
				role.push(`${choice}: ${player.IDEA.picks[choice]}`);
			}
			if (randPicked) randed.push(p);
			// if there's only one option, it's their role, parse it properly
			let roleName = '';
			if (this.IDEA.data.picks.length === 1) {
				const pick = player.IDEA.picks[this.IDEA.data.picks[0]];
				if (!pick) throw new Error('Pick not found when parsing role selected in IDEA module.');
				const parsedRole = MafiaTracker.parseRole(pick);
				player.role = parsedRole.role;
				if (parsedRole.problems.length && !this.IDEA.data.untrusted) this.sendRoom(`Problems found when parsing IDEA role ${player.IDEA.picks[this.IDEA.data.picks[0]]}. Please report this to a mod.`);
			} else {
				roleName = role.join('; ');
				player.role = {
					name: roleName,
					safeName: Chat.escapeHTML(roleName),
					id: toID(roleName),
					alignment: 'solo',
					memo: [`(Your role was set from an IDEA.)`],
					image: '',
				};
				// hardcoding this because it makes GestI so much nicer
				if (!this.IDEA.data.untrusted) {
					for (const pick of role) {
						if (pick.substr(0, 10) === 'alignment:') {
							const parsedRole = MafiaTracker.parseRole(pick.substr(9));
							if (parsedRole.problems.length) this.sendRoom(`Problems found when parsing IDEA role ${pick}. Please report this to a mod.`);
							player.role.alignment = parsedRole.role.alignment;
						}
					}
				}
			}
		}
		this.IDEA.discardsHTML = `<b>Discards:</b><br />`;
		for (const p of Object.keys(this.playerTable).sort()) {
			const IDEA = this.playerTable[p].IDEA;
			if (!IDEA) return this.sendRoom(`No IDEA data for player ${p} when finalising IDEAs. Please report this to a mod.`);
			this.IDEA.discardsHTML += `<b>${this.playerTable[p].safeName}:</b> ${IDEA.choices.join(', ')}<br />`;
		}

		this.phase = 'IDEAlocked';
		if (randed.length) {
			this.sendDeclare(`${randed.join(', ')} did not pick a role in time and were randomly assigned one.`);
		}
		this.sendDeclare(`IDEA picks are locked!`);
		this.sendRoom(`To start, use /mafia start, or to reroll use /mafia ideareroll`);
		this.updatePlayers();
	}

	sendPlayerList() {
		this.room.add(`|c:|${(Math.floor(Date.now() / 1000))}|~|**Players (${this.playerCount})**: ${Object.keys(this.playerTable).map(p => this.playerTable[p].name).join(', ')}`).update();
	}

	updatePlayers() {
		for (const p in this.playerTable) {
			this.playerTable[p].updateHtmlRoom();
		}
		for (const p in this.dead) {
			if (this.dead[p].restless || this.dead[p].treestump) this.dead[p].updateHtmlRoom();
		}
		// Now do the host
		this.updateHost();
	}

	updatePlayersLynches() {
		for (const p in this.playerTable) {
			this.playerTable[p].updateHtmlLynches();
		}
		for (const p in this.dead) {
			if (this.dead[p].restless || this.dead[p].treestump) this.dead[p].updateHtmlLynches();
		}
	}

	updateHost() {
		for (const hostid of [...this.cohosts, this.hostid]) {
			const host = Users.get(hostid);
			if (!host || !host.connected) return;
			for (const conn of host.connections) {
				void Chat.resolvePage(`view-mafia-${this.room.roomid}`, host, conn);
			}
		}
	}

	updateRoleString() {
		this.roleString = this.roles.slice().map(r => `<span style="font-weight:bold;color:${MafiaData.alignments[r.alignment].color || '#FFF'}">${r.safeName}</span>`).join(', ');
	}

	sendRoom(message: string) {
		this.room.add(message).update();
	}
	sendHTML(message: string) {
		this.room.add(`|uhtml|mafia|${message}`).update();
	}
	sendDeclare(message: string) {
		this.room.add(`|raw|<div class="broadcast-blue">${message}</div>`).update();
	}
	sendStrong(message: string) {
		this.room.add(`|raw|<strong>${message}</strong>`).update();
	}
	sendTimestamp(message: string) {
		this.room.add(`|c:|${(Math.floor(Date.now() / 1000))}|~|${message}`).update();
	}

	roomWindow() {
		if (this.ended) return `<div class="infobox">The game of ${this.title} has ended.</div>`;
		let output = `<div class="broadcast-blue">`;
		if (this.phase === 'signups') {
			output += `<h2 style="text-align: center">A game of ${this.title} was created</h2><p style="text-align: center"><button class="button" name="send" value="/mafia join">Join the game</button> <button class="button" name="send" value="/join view-mafia-${this.room.roomid}">Spectate the game</button> <button class="button" name="send" value="/help mafia">Mafia Commands</button></p>`;
		} else {
			output += `<p style="font-weight: bold">A game of ${this.title} is in progress.</p><p><button class="button" name="send" value="/mafia sub ${this.room.roomid}, in">Become a substitute</button> <button class="button" name="send" value="/join view-mafia-${this.room.roomid}">Spectate the game</button> <button class="button" name="send" value="/help mafia">Mafia Commands</button></p>`;
		}
		output += `</div>`;
		return output;
	}

	canJoin(user: User, self = false, force = false) {
		if (!user || !user.connected) return `User not found.`;
		const targetString = self ? `You are` : `${user.id} is`;
		if (!this.room.users[user.id]) return `${targetString} not in the room.`;
		if (this.playerTable[user.id]) return `${targetString} already in the game.`;
		if (this.hostid === user.id) return `${targetString} the host.`;
		if (this.cohosts.includes(user.id)) return `${targetString} a cohost.`;
		if (!force) {
			for (const alt of user.getAltUsers(true)) {
				if (this.playerTable[alt.id] || this.played.includes(alt.id)) return `${self ? `You already have` : `${user.id} already has`} an alt in the game.`;
				if (this.hostid === alt.id || this.cohosts.includes(alt.id)) return `${self ? `You have` : `${user.id} has`} an alt as a game host.`;
			}
		}
		return false;
	}

	sendUser(user: User | string | null, message: string) {
		const userObject = (typeof user === 'string' ? Users.get(user) : user);
		if (!userObject || !userObject.connected) return;
		userObject.sendTo(this.room, message);
	}

	setSelfLynch(user: User, setting: boolean | 'hammer') {
		const from = this.selfEnabled;
		if (from === setting) return user.sendTo(this.room, `|error|Selflynching is already ${setting ? `set to Self${setting === 'hammer' ? 'hammering' : 'lynching'}` : 'disabled'}.`);
		if (from) {
			this.sendDeclare(`Self${from === 'hammer' ? 'hammering' : 'lynching'} has been ${setting ? `changed to Self${setting === 'hammer' ? 'hammering' : 'lynching'}` : 'disabled'}.`);
		} else {
			this.sendDeclare(`Self${setting === 'hammer' ? 'hammering' : 'lynching'} has been ${setting ? 'enabled' : 'disabled'}.`);
		}
		this.selfEnabled = setting;
		if (!setting) {
			for (const player of Object.values(this.playerTable)) {
				if (player.lynching === player.id) this.unlynch(player.id, true);
			}
		}
		this.updatePlayers();
	}
	setNoLynch(user: User, setting: boolean) {
		if (this.enableNL === setting) return user.sendTo(this.room, `|error|No Lynch is already ${setting ? 'enabled' : 'disabled'}.`);
		this.enableNL = setting;
		this.sendDeclare(`No Lynch has been ${setting ? 'enabled' : 'disabled'}.`);
		if (!setting) this.clearLynches('nolynch');
		this.updatePlayers();
	}
	clearLynches(target = '') {
		if (target) delete this.lynches[target];

		if (!target) this.lynches = Object.create(null);

		for (const player of Object.values(this.playerTable)) {
			if (this.forceLynch) {
				if (!target || (player.lynching === target)) {
					player.lynching = player.id;
					this.lynches[player.id]
						= {count: 1, trueCount: this.getLynchValue(player.id), lastLynch: Date.now(), dir: 'up', lynchers: [player.id]};
				}
			} else {
				if (!target || (player.lynching === target)) player.lynching = '';
			}
		}
		for (const player of Object.values(this.dead)) {
			if (player.restless && (!target || player.lynching === target)) player.lynching = '';
		}
		this.hasPlurality = null;
	}

	onChatMessage(message: string, user: User) {
		const subIndex = this.hostRequestedSub.indexOf(user.id);
		if (subIndex !== -1) {
			this.hostRequestedSub.splice(subIndex, 1);
			for (const hostid of [...this.cohosts, this.hostid]) {
				this.sendUser(hostid, `${user.id} has spoken and been removed from the host sublist.`);
			}
		}

		// Silenced check bypasses staff
		const player = this.playerTable[user.id] || this.dead[user.id];
		if (player && player.silenced) {
			return `You are silenced and cannot speak.${user.can('mute', null, this.room) ? " You can remove this with /mafia unsilence." : ''}`;
		}

		if (user.isStaff ||
			(this.room.auth && this.room.auth[user.id] && this.room.auth[user.id] !== '+') ||
			this.hostid === user.id || this.cohosts.includes(user.id) ||
			!this.started) {
			return false;
		}
		if (!this.playerTable[user.id] && (!this.dead[user.id] || !this.dead[user.id].treestump)) return `You cannot talk while a game of ${this.title} is going on.`;
		if (this.phase === 'night') return `You cannot talk at night.`;
		return false;
	}

	onConnect(user: User) {
		user.sendTo(this.room, `|uhtml|mafia|${this.roomWindow()}`);
	}

	onJoin(user: User) {
		if (user.id in this.playerTable) {
			return this.playerTable[user.id].updateHtmlRoom();
		}
		if (user.id === this.hostid) return this.updateHost();
	}

	onLeave(user: User, oldUserid: ID) {
		const userid = oldUserid || user.getLastId();
		if (this.subs.includes(userid)) this.subs.splice(this.subs.indexOf(userid), 1);
	}

	removeBannedUser(user: User) {
		// Player was banned, attempt to sub now
		// If we can't sub now, make subbing them out the top priority
		if (!(user.id in this.playerTable)) return;
		this.requestedSub.unshift(user.id);
		this.nextSub();
	}

	forfeit(user: User) {
		// Add the player to the sub list.
		if (!(user.id in this.playerTable)) return;
		this.requestedSub.push(user.id);
		this.nextSub();
	}

	end() {
		this.ended = true;
		this.sendHTML(this.roomWindow());
		this.updatePlayers();
		if (this.room.roomid === 'mafia' && this.started) {
			// Intead of using this.played, which shows players who have subbed out as well
			// We check who played through to the end when recording playlogs
			const played = Object.keys(this.playerTable).concat(Object.keys(this.dead));
			const month = new Date().toLocaleString("en-us", {month: "numeric", year: "numeric"});
			if (!logs.plays[month]) logs.plays[month] = {};
			for (const player of played) {
				if (!logs.plays[month][player]) logs.plays[month][player] = 0;
				logs.plays[month][player]++;
			}
			if (!logs.hosts[month]) logs.hosts[month] = {};
			for (const hostid of [...this.cohosts, this.hostid]) {
				if (!logs.hosts[month][hostid]) logs.hosts[month][hostid] = 0;
				logs.hosts[month][hostid]++;
			}
			writeFile(LOGS_FILE, logs);
		}
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		this.destroy();
	}

	destroy() {
		// Slightly modified to handle dead players
		if (this.timer) clearTimeout(this.timer);
		if (this.IDEA.timer) clearTimeout(this.IDEA.timer);
		this.room.game = null;
		// @ts-ignore readonly
		this.room = null;
		for (const i in this.playerTable) {
			this.playerTable[i].destroy();
		}
		for (const i in this.dead) {
			this.dead[i].destroy();
		}
	}
}

export const pages: PageTable = {
	mafia(query, user) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		if (!query.length) return this.close();
		let roomid = query.shift();
		if (roomid === 'groupchat') roomid += `-${query.shift()}-${query.shift()}`;
		const room = Rooms.get(roomid);
		if (!room || !room.users[user.id] || !room.game || room.game.gameid !== 'mafia' || room.game.ended) {
			return this.close();
		}
		const game = room.game as MafiaTracker;
		const isPlayer = user.id in game.playerTable;
		const isHost = user.id === game.hostid || game.cohosts.includes(user.id);
		this.title = game.title;
		let buf = `<div class="pad broadcast-blue">`;
		buf += `<button class="button" name="send" value="/join view-mafia-${room.roomid}" style="float:left"><i class="fa fa-refresh"></i> Refresh</button>`;
		buf += `<br/><br/><h1 style="text-align:center;">${game.title}</h1><h3>Host: ${game.host}</h3>`;
		buf += `<p style="font-weight:bold;">Players (${game.playerCount}): ${Object.keys(game.playerTable).sort().map(p => game.playerTable[p].safeName).join(', ')}</p>`;
		if (!isHost && game.started && Object.keys(game.dead).length > 0) {
			buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">Dead Players</summary>`;
			for (const d in game.dead) {
				const dead = game.dead[d];
				buf += `<p style="font-weight:bold;">${dead.safeName} ${dead.role && !game.noReveal ? '(' + dead.getRole() + ')' : ''}`;
				if (dead.treestump) buf += ` (is a Treestump)`;
				if (dead.restless) buf += ` (is a Restless Spirit)`;
				buf += `</p>`;
			}
			buf += `</details></p>`;
		}
		buf += `<hr/>`;
		if (isPlayer && game.phase === 'IDEApicking') {
			buf += `<p><b>IDEA information:</b><br />`;
			const IDEA = game.playerTable[user.id].IDEA;
			if (!IDEA) return game.sendRoom(`IDEA picking phase but no IDEA object for user: ${user.id}. Please report this to a mod.`);
			for (const key in IDEA.picks) {
				const pick = IDEA.picks[key];
				buf += `<b>${key}:</b> `;
				if (!pick) {
					buf += `<button class="button disabled" style="font-weight:bold; color:#575757; font-weight:bold; background-color:#d3d3d3;">clear</button>`;
				} else {
					buf += `<button class="button" name="send" value="/mafia ideakey ${roomid}, ${key},">clear</button>`;
				}
				const selectedIndex = pick ? IDEA.originalChoices.indexOf(pick) : -1;
				for (let i = 0; i < IDEA.originalChoices.length; i++) {
					const choice = IDEA.originalChoices[i];
					if (i === selectedIndex) {
						buf += `<button class="button disabled" style="font-weight:bold; color:#575757; font-weight:bold; background-color:#d3d3d3;">${choice}</button>`;
					} else {
						buf += `<button class="button" name="send" value="/mafia ideapick ${roomid}, ${key}, ${toID(choice)}">${choice}</button>`;
					}
				}
				buf += `<br />`;
			}
			buf += `</p>`;
			buf += `<p><details><summary class="button" style="display:inline-block"><b>Role details:</b></summary><p>`;
			for (const role of IDEA.originalChoices) {
				const roleObject = MafiaTracker.parseRole(role).role;
				buf += `<details><summary>${role}</summary>`;
				buf += `<table><tr><td style="text-align:center;"><td style="text-align:left;width:100%"><ul>${roleObject.memo.map(m => `<li>${m}</li>`).join('')}</ul></td></tr></table>`;
				buf += `</details>`;
			}
			buf += `</p></details></p>`;
		}
		if (game.IDEA.data) {
			buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">${game.IDEA.data.name} information</summary>`;
			if (game.IDEA.discardsHTML && (!game.IDEA.discardsHidden || isHost)) buf += `<details><summary class="button" style="text-align:left; display:inline-block">Discards:</summary><p>${game.IDEA.discardsHTML}</p></details>`;
			buf += `<details><summary class="button" style="text-align:left; display:inline-block">Role list</summary><p>${game.IDEA.data.roles.join('<br />')}</p></details>`;
			buf += `</details></p>`;
		} else {
			if (!game.closedSetup) {
				if (game.theme) {
					buf += `<p><span style="font-weight:bold;">Theme</span>: ${game.theme.name}</p>`;
					buf += `<p>${game.theme.desc}</p>`;
				}
				if (game.noReveal) {
					buf += `<p><span style="font-weight:bold;">Original Rolelist</span>: ${game.originalRoleString}</p>`;
				} else {
					buf += `<p><span style="font-weight:bold;">Rolelist</span>: ${game.roleString}</p>`;
				}
			}
		}
		if (isPlayer) {
			const role = game.playerTable[user.id].role;
			if (role) {
				buf += `<h3>${game.playerTable[user.id].safeName}, you are a ${game.playerTable[user.id].getRole()}</h3>`;
				if (!['town', 'solo'].includes(role.alignment)) buf += `<p><span style="font-weight:bold">Partners</span>: ${game.getPartners(role.alignment, game.playerTable[user.id])}</p>`;
				buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">Role Details</summary>`;
				buf += `<table><tr><td style="text-align:center;">${role.image || `<img width="75" height="75" src="//${Config.routes.client}/fx/mafia-villager.png"/>`}</td><td style="text-align:left;width:100%"><ul>${role.memo.map(m => `<li>${m}</li>`).join('')}</ul></td></tr></table>`;
				buf += `</details></p>`;
			}
		}
		if (game.phase === "day") {
			buf += `<span id="mafia-lynches">`;
			buf += game.lynchBoxFor(user.id);
			buf += `</span>`;
		} else if (game.phase === "night" && isPlayer) {
			buf += `<p style="font-weight:bold;">PM the host (${game.host}) the action you want to use tonight, and who you want to use it on. Or PM the host "idle".</p>`;
		}
		if (isHost) {
			buf += `<h3>Host options</h3>`;
			buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">General Options</summary>`;
			buf += `<h3>General Options</h3>`;
			if (!game.started) {
				buf += `<button class="button" name="send" value="/mafia closedsetup ${room.roomid}, ${game.closedSetup ? 'off' : 'on'}">${game.closedSetup ? 'Disable' : 'Enable'} Closed Setup</button>`;
				if (game.phase === 'locked' || game.phase === 'IDEAlocked') {
					buf += ` <button class="button" name="send" value="/mafia start ${room.roomid}">Start Game</button>`;
				} else {
					buf += ` <button class="button" name="send" value="/mafia close ${room.roomid}">Close Signups</button>`;
				}
			} else if (game.phase === 'day') {
				buf += `<button class="button" name="send" value="/mafia night ${room.roomid}">Go to Night ${game.dayNum}</button>`;
			} else if (game.phase === 'night') {
				buf += `<button class="button" name="send" value="/mafia day ${room.roomid}">Go to Day ${game.dayNum + 1}</button> <button class="button" name="send" value="/mafia extend ${room.roomid}">Return to Day ${game.dayNum}</button>`;
			}
			buf += ` <button class="button" name="send" value="/mafia selflynch ${room.roomid}, ${game.selfEnabled === true ? 'off' : 'on'}">${game.selfEnabled === true ? 'Disable' : 'Enable'} self lynching</button> `;
			buf += `<button class="button" name="send" value="/mafia ${game.enableNL ? 'disable' : 'enable'}nl ${room.roomid}">${game.enableNL ? 'Disable' : 'Enable'} No Lynch</button> `;
			buf += `<button class="button" name="send" value="/mafia reveal ${room.roomid}, ${game.noReveal ? 'on' : 'off'}">${game.noReveal ? 'Enable' : 'Disable'} revealing of roles</button> `;
			buf += `<button class="button" name="send" value="/mafia autosub ${room.roomid}, ${game.autoSub ? 'off' : 'on'}">${game.autoSub ? "Disable" : "Enable"} automatic subbing of players</button> `;
			buf += `<button class="button" name="send" value="/mafia end ${room.roomid}">End Game</button>`;
			buf += `<p>To set a deadline, use <strong>/mafia deadline [minutes]</strong>.<br />To clear the deadline use <strong>/mafia deadline off</strong>.</p><hr/></details></p>`;
			buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">Player Options</summary>`;
			buf += `<h3>Player Options</h3>`;
			for (const p in game.playerTable) {
				const player = game.playerTable[p];
				buf += `<p><details><summary class="button" style="text-align:left; display:inline-block"><span style="font-weight:bold;">`;
				buf += `${player.safeName} (${player.role ? player.getRole(true) : ''})`;
				buf += game.lynchModifiers[p] !== undefined ? `(lynches worth ${game.getLynchValue(p as ID)})` : '';
				buf += player.silenced ? '(silenced)' : '';
				buf += `</summary>`;
				buf += `<button class="button" name="send" value="/mafia kill ${room.roomid}, ${player.id}">Kill</button> `;
				buf += `<button class="button" name="send" value="/mafia treestump ${room.roomid}, ${player.id}">Make a Treestump (Kill)</button> `;
				buf += `<button class="button" name="send" value="/mafia spirit ${room.roomid}, ${player.id}">Make a Restless Spirit (Kill)</button> `;
				buf += `<button class="button" name="send" value="/mafia spiritstump ${room.roomid}, ${player.id}">Make a Restless Treestump (Kill)</button> `;
				buf += `<button class="button" name="send" value="/mafia sub ${room.roomid}, next, ${player.id}">Force sub</button></span></details></p>`;
			}
			for (const d in game.dead) {
				const dead = game.dead[d];
				buf += `<p style="font-weight:bold;">${dead.safeName} (${dead.role ? dead.getRole() : ''})`;
				if (dead.treestump) buf += ` (is a Treestump)`;
				if (dead.restless) buf += ` (is a Restless Spirit)`;
				if (game.lynchModifiers[d] !== undefined) buf += ` (lynches worth ${game.getLynchValue(d as ID)})`;
				buf += `: <button class="button" name="send" value="/mafia revive ${room.roomid}, ${dead.id}">Revive</button></p>`;
			}
			buf += `<hr/></details></p>`;
			buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">How to setup roles</summary>`;
			buf += `<h3>Setting the roles</h3>`;
			buf += `<p>To set the roles, use /mafia setroles [comma seperated list of roles] OR /mafia setroles [theme] in ${room.title}.</p>`;
			buf += `<p>If you set the roles from a theme, the role parser will get all the correct roles for you. (Not all themes are supported).</p>`;
			buf += `<p>The following key words determine a role's alignment (If none are found, the default alignment is town):</p>`;
			buf += `<p style="font-weight:bold">${Object.keys(MafiaData.alignments).map(a => `<span style="color:${MafiaData.alignments[a].color || '#FFF'}">${MafiaData.alignments[a].name}</span>`).join(', ')}</p>`;
			buf += `<p>Please note that anything inside (parentheses) is ignored by the role parser.</p>`;
			buf += `<p>If you have roles that have conflicting alignments or base roles, you can use /mafia forcesetroles [comma seperated list of roles] to forcibly set the roles.</p>`;
			buf += `<p>Please note that you will have to PM all the players their alignment, partners (if any), and other information about their role because the server will not provide it.</p>`;
			buf += `<hr/></details></p>`;
			buf += `<p style="font-weight:bold;">Players who will be subbed unless they talk: ${game.hostRequestedSub.join(', ')}</p>`;
			buf += `<p style="font-weight:bold;">Players who are requesting a sub: ${game.requestedSub.join(', ')}</p>`;
		}
		buf += `<p style="font-weight:bold;">Sub List: ${game.subs.join(', ')}</p>`;
		if (!isHost) {
			if (game.phase === 'signups') {
				if (isPlayer) {
					buf += `<p><button class="button" name="send" value="/mafia leave ${room.roomid}">Leave game</button></p>`;
				} else {
					buf += `<p><button class="button" name="send" value="/mafia join ${room.roomid}">Join game</button></p>`;
				}
			} else if ((!isPlayer && game.subs.includes(user.id)) || (isPlayer && !game.requestedSub.includes(user.id))) {
				buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">${isPlayer ? 'Request to be subbed out' : 'Cancel sub request'}</summary>`;
				buf += `<button class="button" name="send" value="/mafia sub ${room.roomid}, out">${isPlayer ? 'Confirm request to be subbed out' : 'Confirm cancelation of sub request'}</button></details></p>`;
			} else {
				buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">${isPlayer ? 'Cancel sub request' : 'Join the game as a sub'}</summary>`;
				buf += `<button class="button" name="send" value="/mafia sub ${room.roomid}, in">${isPlayer ? 'Confirm cancelation of sub request' : 'Confirm that you want to join the game'}</button></details></p>`;
			}
		}
		buf += `</div>`;
		return buf;
	},
	mafialadder(query, user) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		if (!query.length || !Rooms.get('mafia')) return this.close();
		const headers: {[k: string]: {title: string, type: string, section: MafiaLogSection}} = {
			leaderboard: {title: 'Leaderboard', type: 'Points', section: 'leaderboard'},
			mvpladder: {title: 'MVP Ladder', type: 'MVPs', section: 'mvps'},
			hostlogs: {title: 'Host Logs', type: 'Hosts', section: 'hosts'},
			playlogs: {title: 'Play Logs', type: 'Plays', section: 'plays'},
			leaverlogs: {title: 'Leaver Logs', type: 'Leavers', section: 'leavers'},
		};
		const date = new Date();
		if (query[1] === 'prev') date.setMonth(date.getMonth() - 1);
		const month = date.toLocaleString("en-us", {month: "numeric", year: "numeric"});
		const ladder = headers[query[0]];
		if (!ladder) return this.close();
		const mafiaRoom = Rooms.get('mafia') as ChatRoom | undefined;
		if (['hosts', 'plays', 'leavers'].includes(ladder.section) && !this.can('mute', null, mafiaRoom)) return;
		this.title = `Mafia ${ladder.title} (${date.toLocaleString("en-us", {month: 'long'})} ${date.getFullYear()})`;
		let buf = `<div class="pad ladder">`;
		buf += `${query[1] === 'prev' ? '' : `<button class="button" name="send" value="/join view-mafialadder-${query[0]}" style="float:left"><i class="fa fa-refresh"></i> Refresh</button> <button class="button" name="send" value="/join view-mafialadder-${query[0]}-prev" style="float:left">View last month's ${ladder.title}</button>`}`;
		buf += `<br /><br />`;
		const section = ladder.section;
		if (!logs[section][month] || !Object.keys(logs[section][month]).length) {
			buf += `${ladder.title} for ${date.toLocaleString("en-us", {month: 'long'})} ${date.getFullYear()} not found.</div>`;
			return buf;
		}
		const keys = Object.keys(logs[section][month]).sort((keyA, keyB) => {
			const a = logs[section][month][keyA];
			const b = logs[section][month][keyB];
			return b - a;
		});
		buf += `<table style="margin-left: auto; margin-right: auto"><tbody><tr><th colspan="2"><h2 style="margin: 5px auto">Mafia ${ladder.title} for ${date.toLocaleString("en-us", {month: 'long'})} ${date.getFullYear()}</h1></th></tr>`;
		buf += `<tr><th>User</th><th>${ladder.type}</th></tr>`;
		for (const key of keys) {
			buf += `<tr><td>${key}</td><td>${logs[section][month][key]}</td></tr>`;
		}
		return buf + `</table></div>`;
	},
};

export const commands: ChatCommands = {
	mafia: {
		''(target, room, user) {
			const game = room.game as MafiaTracker;
			if (game && game.gameid === 'mafia') {
				if (!this.runBroadcast()) return;
				return this.sendReply(`|html|${game.roomWindow()}`);
			}
			return this.parse('/help mafia');
		},

		forcehost: 'host',
		nexthost: 'host',
		host(target, room, user, connection, cmd) {
			if (room.mafiaDisabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (!this.canTalk()) return;
			if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
			if (room.game) return this.errorReply(`There is already a game of ${room.game.title} in progress in this room.`);
			if (!user.can('broadcast', null, room)) return this.errorReply(`/mafia ${cmd} - Access denied.`);

			let nextHost = false;
			if (room.roomid === 'mafia') {
				if (cmd === 'nexthost') {
					nextHost = true;
					if (!hostQueue.length) return this.errorReply(`Nobody is on the host queue.`);
					const skipped = [];
					do {
						// @ts-ignore guaranteed
						this.splitTarget(hostQueue.shift(), true);
						if (!this.targetUser || !this.targetUser.connected ||
							!room.users[this.targetUser.id] || isHostBanned(this.targetUser.id)) {
							skipped.push(this.targetUsername);
							this.targetUser = null;
						}
					} while (!this.targetUser && hostQueue.length);
					if (skipped.length) this.sendReply(`${skipped.join(', ')} ${Chat.plural(skipped.length, 'were', 'was')} not online, not in the room, or are host banned and were removed from the host queue.`);
					if (!this.targetUser) return this.errorReply(`Nobody on the host queue could be hosted.`);
				} else {
					if (cmd !== 'forcehost' && hostQueue.length && toID(target) !== hostQueue[0]) return this.errorReply(`${target} is not next on the host queue. To host them now anyways, use /mafia forcehost ${target}`);
					this.splitTarget(target, true);
				}
			} else {
				this.splitTarget(target, true);
			}

			if (!this.targetUser || !this.targetUser.connected) return this.errorReply(`The user "${this.targetUsername}" was not found.`);
			if (!nextHost && this.targetUser.id !== user.id && !this.can('mute', null, room)) return false;
			if (!room.users[this.targetUser.id]) return this.errorReply(`${this.targetUser.name} is not in this room, and cannot be hosted.`);
			if (room.roomid === 'mafia' && isHostBanned(this.targetUser.id)) return this.errorReply(`${this.targetUser.name} is banned from hosting games.`);

			const targetUser = this.targetUser;

			room.game = new MafiaTracker(room, targetUser);

			for (const conn of targetUser.connections) {
				void Chat.resolvePage(`view-mafia-${room.roomid}`, targetUser, conn);
			}
			room.addByUser(user, `${targetUser.name} was appointed the mafia host by ${user.name}.`);
			if (room.roomid === 'mafia') {
				const queueIndex = hostQueue.indexOf(targetUser.id);
				if (queueIndex > -1) hostQueue.splice(queueIndex, 1);
				room.add(`|c:|${(Math.floor(Date.now() / 1000))}|~|**Mafiasignup!**`).update();
			}
			this.modlog('MAFIAHOST', targetUser, null, {noalts: true, noip: true});
		},
		hosthelp: [
			`/mafia host [user] - Create a game of Mafia with [user] as the host. Requires + % @ # & ~, voices can only host themselves`,
		],

		q: 'queue',
		queue(target, room, user) {
			if (room.mafiaDisabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (room.roomid !== 'mafia') return this.errorReply(`This command can only be used in the Mafia room.`);
			const args = target.split(',').map(toID);
			if (['forceadd', 'add', 'remove', 'del', 'delete'].includes(args[0])) {
				const permission = (user.id === args[1]) ? 'broadcast' : 'mute';
				if (['forceadd', 'add'].includes(args[0]) && !this.can(permission, null, room)) return;
				if (['remove', 'del', 'delete'].includes(args[0]) && user.id !== args[1] && !this.can('mute', null, room)) return;
			} else {
				if (!this.runBroadcast()) return false;
			}
			switch (args[0]) {
			case 'forceadd':
			case 'add':
				if (!this.canTalk()) return;
				const targetUser = Users.get(args[1]);
				if ((!targetUser || !targetUser.connected) && args[0] !== 'forceadd') return this.errorReply(`User ${args[1]} not found. To forcefully add the user to the queue, use /mafia queue forceadd, ${args[1]}`);
				if (hostQueue.includes(args[1])) return this.errorReply(`User ${args[1]} is already on the host queue.`);
				if (isHostBanned(args[1])) return this.errorReply(`User ${args[1]} is banned from hosting games.`);
				hostQueue.push(args[1]);
				room.add(`User ${args[1]} has been added to the host queue by ${user.name}.`).update();
				break;
			case 'del':
			case 'delete':
			case 'remove':
				const index = hostQueue.indexOf(args[1]);
				if (index === -1) return this.errorReply(`User ${args[1]} is not on the host queue.`);
				hostQueue.splice(index, 1);
				room.add(`User ${args[1]} has been removed from the host queue by ${user.name}.`).update();
				break;
			case '':
			case 'show':
			case 'view':
				this.sendReplyBox(`<strong>Host Queue:</strong> ${hostQueue.join(', ')}`);
				break;
			default:
				this.parse('/help mafia queue');
			}
		},
		queuehelp: [
			`/mafia queue - Shows the upcoming users who are going to host.`,
			`/mafia queue add, (user) - Adds the user to the hosting queue. Requires: + % @ # & ~`,
			`/mafia queue remove, (user) - Removes the user from the hosting queue. Requires: + % @ # & ~`,
		],

		qadd: 'queueadd',
		qforceadd: 'queueadd',
		queueforceadd: 'queueadd',
		queueadd(target, room, user, connection, cmd) {
			this.parse(`/mafia queue ${cmd.includes('force') ? `forceadd` : `add`}, ${target}`);
		},

		qdel: 'queueremove',
		qdelete: 'queueremove',
		qremove: 'queueremove',
		queueremove(target, room, user) {
			this.parse(`/mafia queue remove, ${target}`);
		},

		'!join': true,
		join(target, room, user) {
			let targetRoom = Rooms.get(target);
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;

			if (!this.canTalk(null, targetRoom)) return;
			game.join(user);
		},
		joinhelp: [`/mafia join - Join the game.`],

		'!leave': true,
		leave(target, room, user) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			game.leave(user);
		},
		leavehelp: [`/mafia leave - Leave the game. Can only be done while signups are open.`],

		playercap(target, room, user) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (game.phase !== 'signups') return this.errorReply(`Signups are already closed.`);
			if (toID(target) === 'none') target = '20';
			const num = parseInt(target);
			if (isNaN(num) || num > 20 || num < 2) return this.parse('/help mafia playercap');
			if (num < game.playerCount) return this.errorReply(`Player cap has to be equal or more than the amount of players in game.`);
			if (num === game.playerCap) return this.errorReply(`Player cap is already set at ${game.playerCap}.`);
			game.playerCap = num;
			game.sendDeclare(`Player cap has been set to ${game.playerCap}`);
		},
		playercaphelp: [`/mafia playercap [cap|none]- Limit the number of players being able to join the game. Player cap cannot be more than 20 or less than 2. Requires: host % @ # & ~`],

		'!close': true,
		close(target, room, user) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (game.phase !== 'signups') return user.sendTo(targetRoom, `|error|Signups are already closed.`);
			if (game.playerCount < 2) return user.sendTo(targetRoom, `|error|You need at least 2 players to start.`);
			game.phase = 'locked';
			game.sendDeclare(game.roomWindow());
			game.updatePlayers();
		},
		closehelp: [`/mafia close - Closes signups for the current game. Requires: host % @ # & ~`],

		'!closedsetup': true,
		cs: 'closedsetup',
		closedsetup(target, room, user) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			const action = toID(args.join(''));
			if (!['on', 'off'].includes(action)) return this.parse('/help mafia closedsetup');
			if (game.started) return user.sendTo(targetRoom, `|error|You can't ${action === 'on' ? 'enable' : 'disable'} closed setup because the game has already started.`);
			if ((action === 'on' && game.closedSetup) || (action === 'off' && !game.closedSetup)) return user.sendTo(targetRoom, `|error|Closed setup is already ${game.closedSetup ? 'enabled' : 'disabled'}.`);
			game.closedSetup = action === 'on';
			game.updateHost();
		},
		closedsetuphelp: [`/mafia closedsetup [on|off] - Sets if the game is a closed setup. Closed setups don't show the role list to players. Requires host % @ # & ~`],

		'!reveal': true,
		reveal(target, room, user) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			const action = toID(args.join(''));
			if (!['on', 'off'].includes(action)) return this.parse('/help mafia reveal');
			if ((action === 'off' && game.noReveal) || (action === 'on' && !game.noReveal)) return user.sendTo(targetRoom, `|error|Revealing of roles is already ${game.noReveal ? 'disabled' : 'enabled'}.`);
			game.noReveal = action === 'off';
			game.sendDeclare(`Revealing of roles has been ${action === 'off' ? 'disabled' : 'enabled'}.`);
			game.updatePlayers();
		},
		revealhelp: [`/mafia reveal [on|off] - Sets if roles reveal on death or not. Requires host % @ # & ~`],

		resetroles: 'setroles',
		forceresetroles: 'setroles',
		forcesetroles: 'setroles',
		setroles(target, room, user, connection, cmd) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			const reset = cmd.includes('reset');
			if (reset) {
				if (game.phase !== 'day' && game.phase !== 'night') return this.errorReply(`The game has not started yet.`);
			} else {
				if (game.phase !== 'locked' && game.phase !== 'IDEAlocked') return this.errorReply(game.phase === 'signups' ? `You need to close signups first.` : `The game has already started.`);
			}
			if (!target) return this.parse('/help mafia setroles');

			game.setRoles(user, target, cmd.includes('force'), reset);
		},
		setroleshelp: [
			`/mafia setroles [comma separated roles] - Set the roles for a game of mafia. You need to provide one role per player.`,
			`/mafia forcesetroles [comma separated roles] - Forcibly set the roles for a game of mafia. No role PM information or alignment will be set.`,
			`/mafia resetroles [comma separated roles] - Reset the roles in an ongoing game.`,
		],

		idea(target, room, user) {
			if (!room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (!this.can('broadcast', null, room)) return;
			if (!user.can('mute', null, room) && game.hostid !== user.id && !game.cohosts.includes(user.id)) {
				return this.errorReply(`/mafia idea - Access denied.`);
			}
			if (game.started) return this.errorReply(`You cannot start an IDEA after the game has started.`);
			if (game.phase !== 'locked' && game.phase !== 'IDEAlocked') return this.errorReply(`You need to close the signups first.`);
			game.ideaInit(user, toID(target));
		},
		ideahelp: [
			`/mafia idea [idea] - starts the IDEA module [idea]. Requires + % @ # & ~, voices can only start for themselves`,
			`/mafia ideareroll - rerolls the IDEA module. Requires host % @ # & ~`,
			`/mafia ideapick [selection], [role] - selects a role`,
			`/mafia ideadiscards - shows the discarded roles`,
		],

		customidea(target, room, user) {
			if (!this.can('mute', null, room)) return;
			if (!room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (game.started) return this.errorReply(`You cannot start an IDEA after the game has started.`);
			if (game.phase !== 'locked' && game.phase !== 'IDEAlocked') return this.errorReply(`You need to close the signups first.`);
			const [options, roles] = Chat.splitFirst(target, '\n');
			if (!options || !roles) return this.parse('/help mafia idea');
			const [choicesStr, ...picks] = options.split(',').map(x => x.trim());
			const choices = parseInt(choicesStr);
			if (!choices || choices <= picks.length) return this.errorReply(`You need to have more choices than picks.`);
			if (picks.some((value, index, arr) => arr.indexOf(value, index + 1) > 0)) return this.errorReply(`Your picks must be unique.`);
			game.customIdeaInit(user, choices, picks, roles);
		},
		customideahelp: [
			`/mafia customidea choices, picks (new line here, shift+enter)`,
			`(comma or newline separated rolelist) - Starts an IDEA module with custom roles. Requires % @ # & ~`,
		],
		'!ideapick': true,
		ideapick(target, room, user) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') {
				return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			}
			const game = targetRoom.game as MafiaTracker;
			if (!(user.id in game.playerTable)) {
				return user.sendTo(targetRoom, '|error|You are not a player in the game.');
			}
			if (game.phase !== 'IDEApicking') {
				return user.sendTo(targetRoom, `|error|The game is not in the IDEA picking phase.`);
			}
			game.ideaPick(user, args);
		},

		'!ideareroll': true,
		ideareroll(target, room, user) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			game.ideaDistributeRoles(user);
		},
		idearerollhelp: [`/mafia ideareroll - rerolls the roles for the current IDEA module. Requires host % @ # & ~`],

		discards: 'ideadiscards',
		ideadiscards(target, room, user) {
			if (!room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (!game.IDEA.data) return this.errorReply(`There is no IDEA module in the mafia game.`);
			if (target) {
				if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
				if (this.meansNo(target)) {
					if (game.IDEA.discardsHidden) return this.errorReply(`IDEA discards are already hidden.`);
					game.IDEA.discardsHidden = true;
				} else if (this.meansYes(target)) {
					if (!game.IDEA.discardsHidden) return this.errorReply(`IDEA discards are already visible.`);
					game.IDEA.discardsHidden = false;
				} else {
					return this.parse('/help mafia ideadiscards');
				}
				return this.sendReply(`IDEA discards are now ${game.IDEA.discardsHidden ? 'hidden' : 'visible'}.`);
			}
			if (game.IDEA.discardsHidden) return this.errorReply(`Discards are not visible.`);
			if (!game.IDEA.discardsHTML) return this.errorReply(`The IDEA module does not have finalised discards yet.`);
			if (!this.runBroadcast()) return;
			this.sendReplyBox(`<details><summary>IDEA discards:</summary>${game.IDEA.discardsHTML}</details>`);
		},
		ideadiscardshelp: [
			`/mafia ideadiscards - shows the discarded roles`,
			`/mafia ideadiscards off - hides discards from the players. Requires host % @ # & ~`,
			`/mafia ideadiscards on - shows discards to the players. Requires host % @ # & ~`,
		],

		'!start': true,
		nightstart: 'start',
		start(target, room, user, connection, cmd) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				target = '';
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (target) {
				this.parse(`/mafia close`);
				this.parse(`/mafia setroles ${target}`);
				this.parse(`/mafia ${cmd}`);
				return;
			}
			game.start(user, cmd === 'nightstart');
		},
		starthelp: [`/mafia start - Start the game of mafia. Signups must be closed. Requires host % @ # & ~`],

		'!day': true,
		extend: 'day',
		night: 'day',
		day(target, room, user, connection, cmd) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (cmd === 'night') {
				game.night();
			} else {
				let extension = parseInt(toID(args.join('')));
				if (isNaN(extension)) {
					extension = 0;
				} else {
					if (extension < 1) extension = 1;
					if (extension > 10) extension = 10;
				}
				game.day((cmd === 'extend' ? extension : null));
			}
		},
		dayhelp: [
			`/mafia day - Move to the next game day. Requires host % @ # & ~`,
			`/mafia night - Move to the next game night. Requires host % @ # & ~`,
			`/mafia extend (minutes) - Return to the previous game day. If (minutes) is provided, set the deadline for (minutes) minutes. Requires host % @ # & ~`,
		],

		'!lynch': true,
		l: 'lynch',
		lynch(target, room, user) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (!this.canTalk(null, targetRoom)) return;
			if (!(user.id in game.playerTable) &&
				(!(user.id in game.dead) || !game.dead[user.id].restless)) {
				return user.sendTo(targetRoom, `|error|You are not in the game of ${game.title}.`);
			}
			game.lynch(user.id, toID(args.join('')));
		},
		lynchhelp: [`/mafia lynch [player|nolynch] - Vote to lynch the specified player or to not lynch anyone.`],

		'!unlynch': true,
		ul: 'unlynch',
		unl: 'unlynch',
		unnolynch: 'unlynch',
		unlynch(target, room, user) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (!this.canTalk(null, targetRoom)) return;
			if (!(user.id in game.playerTable) &&
				(!(user.id in game.dead) || !game.dead[user.id].restless)) {
				return user.sendTo(targetRoom, `|error|You are not in the game of ${targetRoom.game.title}.`);
			}
			game.unlynch(user.id);
		},
		unlynchhelp: [`/mafia unlynch - Withdraw your lynch vote. Fails if you're not voting to lynch anyone`],

		nl: 'nolynch',
		nolynch() {
			this.parse('/mafia lynch nolynch');
		},

		'!selflynch': true,
		enableself: 'selflynch',
		selflynch(target, room, user, connection, cmd) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			const action = toID(args.shift());
			if (!action) return this.parse(`/help mafia selflynch`);
			if (this.meansYes(action)) {
				game.setSelfLynch(user, true);
			} else if (this.meansNo(action)) {
				game.setSelfLynch(user, false);
			} else if (action === 'hammer') {
				game.setSelfLynch(user, 'hammer');
			} else {
				return this.parse(`/help mafia selflynch`);
			}
		},
		selflynchhelp: [`/mafia selflynch [on|hammer|off] - Allows players to self lynch themselves either at hammer or anytime. Requires host % @ # & ~`],

		'!kill': true,
		treestump: 'kill',
		spirit: 'kill',
		spiritstump: 'kill',
		kick: 'kill',
		kill(target, room, user, connection, cmd) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			const player = game.playerTable[toID(args.join(''))];
			if (!player) return user.sendTo(targetRoom, `|error|"${args.join(',')}" is not a living player.`);
			if (game.phase === 'IDEApicking') return this.errorReply(`You cannot add or remove players while IDEA roles are being picked.`); // needs to be here since eliminate doesn't pass the user
			game.eliminate(player, cmd);
		},
		killhelp: [
			`/mafia kill [player] - Kill a player, eliminating them from the game. Requires host % @ # & ~`,
			`/mafia treestump [player] - Kills a player, but allows them to talk during the day still.`,
			`/mafia spirit [player] - Kills a player, but allows them to vote on the lynch still.`,
			`/mafia spiritstump [player] Kills a player, but allows them to talk during the day, and vote on the lynch.`,
		],

		'!revive': true,
		forceadd: 'revive',
		add: 'revive',
		revive(target, room, user, connection, cmd) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (!toID(args.join(''))) return this.parse('/help mafia revive');
			for (const targetUser of args) {
				game.revive(user, toID(targetUser), cmd === 'forceadd');
			}
		},
		revivehelp: [`/mafia revive [player] - Revive a player who died or add a new player to the game. Requires host % @ # & ~`],

		dl: 'deadline',
		deadline(target, room, user) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			target = toID(target);
			if (target && game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (target === 'off') {
				return game.setDeadline(0);
			} else {
				const num = parseInt(target);
				if (isNaN(num)) {
					// hack to let hosts broadcast
					if (game.hostid === user.id || game.cohosts.includes(user.id)) {
						this.broadcastMessage = this.message.toLowerCase().replace(/[^a-z0-9\s!,]/g, '');
					}
					if (!this.runBroadcast()) return false;

					if ((game.dlAt - Date.now()) > 0) {
						return this.sendReply(`|raw|<strong>The deadline is in ${Chat.toDurationString(game.dlAt - Date.now()) || '0 seconds'}.</strong>`);
					} else {
						return this.parse(`/help mafia deadline`);
					}
				}
				if (num < 1 || num > 20) return this.errorReply(`The deadline must be between 1 and 20 minutes.`);
				return game.setDeadline(num);
			}
		},
		deadlinehelp: [`/mafia deadline [minutes|off] - Sets or removes the deadline for the game. Cannot be more than 20 minutes.`],

		applylynchmodifier: 'applyhammermodifier',
		applyhammermodifier(target, room, user, connection, cmd) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (!game.started) return this.errorReply(`The game has not started yet.`);
			const [player, mod] = target.split(',');
			if (cmd === 'applyhammermodifier') {
				game.applyHammerModifier(user, toID(player), parseInt(mod));
			} else {
				game.applyLynchModifier(user, toID(player), parseInt(mod));
			}
		},
		clearlynchmodifiers: 'clearhammermodifiers',
		clearhammermodifiers(target, room, user, connection, cmd) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (!game.started) return this.errorReply(`The game has not started yet.`);
			if (cmd === 'clearhammermodifiers') {
				game.clearHammerModifiers(user);
			} else {
				game.clearLynchModifiers(user);
			}
		},

		hate: 'love',
		unhate: 'love',
		unlove: 'love',
		removehammermodifier: 'love',
		love(target, room, user, connection, cmd) {
			let mod;
			switch (cmd) {
			case 'hate':
				mod = -1;
				break;
			case 'love':
				mod = 1;
				break;
			case 'unhate': case 'unlove': case 'removehammermodifier':
				mod = 0;
				break;
			}
			this.parse(`/mafia applyhammermodifier ${target}, ${mod}`);
		},
		doublevoter: 'mayor',
		voteless: 'mayor',
		unvoteless: 'mayor',
		unmayor: 'mayor',
		removelynchmodifier: 'mayor',
		mayor(target, room, user, connection, cmd) {
			let mod;
			switch (cmd) {
			case 'doublevoter': case 'mayor':
				mod = 2;
				break;
			case 'voteless':
				mod = 0;
				break;
			case 'unvoteless': case 'unmayor': case 'removelynchmodifier':
				mod = 1;
				break;
			}
			this.parse(`/mafia applylynchmodifier ${target}, ${mod}`);
		},

		unsilence: 'silence',
		silence(target, room, user, connection, cmd) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (!game.started) return this.errorReply(`The game has not started yet.`);

			target = toID(target);
			const targetPlayer = game.playerTable[target] || game.dead[target];
			const silence = cmd === 'silence';
			if (!targetPlayer) return this.errorReply(`${target} is not in the game of mafia.`);
			if (silence === targetPlayer.silenced) return this.errorReply(`${targetPlayer.name} is already ${!silence ? 'not' : ''} silenced`);
			targetPlayer.silenced = silence;
			this.sendReply(`${targetPlayer.name} has been ${!silence ? 'un' : ''}silenced.`);
		},
		silencehelp: [
			`/mafia silence [player] - Silences [player], preventing them from talking at all. Requires host % @ # & ~`,
			`/mafia unsilence [player] - Removes a silence on [player], allowing them to talk again. Requires host % @ # & ~`,
		],

		shifthammer: 'hammer',
		resethammer: 'hammer',
		hammer(target, room, user, connection, cmd) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (!game.started) return this.errorReply(`The game has not started yet.`);
			const hammer = parseInt(target);
			if (toID(cmd) !== `resethammer` && ((isNaN(hammer) && !this.meansNo(target)) || hammer < 1)) return this.errorReply(`${target} is not a valid hammer count.`);
			switch (cmd.toLowerCase()) {
			case 'shifthammer':
				game.shiftHammer(hammer);
				break;
			case 'hammer':
				game.setHammer(hammer);
				break;
			default:
				game.resetHammer();
				break;
			}
		},
		hammerhelp: [
			`/mafia hammer [hammer] - sets the hammer count to [hammer] and resets lynches`,
			`/mafia hammer off - disables hammering`,
			`/mafia shifthammer [hammer] - sets the hammer count to [hammer] without resetting lynches`,
			`/mafia resethammer - sets the hammer to the default, resetting lynches`,
		],

		'!enablenl': true,
		disablenl: 'enablenl',
		enablenl(target, room, user, connection, cmd) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (cmd === 'enablenl') {
				game.setNoLynch(user, true);
			} else {
				game.setNoLynch(user, false);
			}
		},
		enablenlhelp: [`/mafia [enablenl|disablenl] - Allows or disallows players abstain from lynching. Requires host % @ # & ~`],

		forcelynch(target, room, user) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			target = toID(target);
			if (this.meansYes(target)) {
				if (game.forceLynch) return this.errorReply(`Forcelynching is already enabled.`);
				game.forceLynch = true;
				if (game.started) game.resetHammer();
				game.sendDeclare(`Forcelynching has been enabled. Your lynch will start on yourself, and you cannot unlynch!`);
			} else if (this.meansNo(target)) {
				if (!game.forceLynch) return this.errorReply(`Forcelynching is already disabled.`);
				game.forceLynch = false;
				game.sendDeclare(`Forcelynching has been disabled. You can lynch normally now!`);
			} else {
				this.parse('/help mafia forcelynch');
			}
		},
		forcelynchhelp: [`/mafia forcelynch [yes/no] - Forces player's lynches onto themselves, and prevents unlynching. Requires host % @ # & ~`],

		lynches(target, room, user) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (!game.started) return this.errorReply(`The game of mafia has not started yet.`);

			// hack to let hosts broadcast
			if (game.hostid === user.id || game.cohosts.includes(user.id)) {
				this.broadcastMessage = this.message.toLowerCase().replace(/[^a-z0-9\s!,]/g, '');
			}
			if (!this.runBroadcast()) return false;

			this.sendReplyBox(game.lynchBox());
		},

		pl: 'players',
		players(target, room, user) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;

			// hack to let hosts broadcast
			if (game.hostid === user.id || game.cohosts.includes(user.id)) {
				this.broadcastMessage = this.message.toLowerCase().replace(/[^a-z0-9\s!,]/g, '');
			}
			if (!this.runBroadcast()) return false;

			if (this.broadcasting) {
				game.sendPlayerList();
			} else {
				this.sendReplyBox(`Players (${game.playerCount}): ${Object.keys(game.playerTable).map(p => game.playerTable[p].safeName).join(', ')}`);
			}
		},

		originalrolelist: 'rolelist',
		orl: 'rolelist',
		rl: 'rolelist',
		rolelist(target, room, user, connection, cmd) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (game.closedSetup) return this.errorReply(`You cannot show roles in a closed setup.`);
			if (!this.runBroadcast()) return false;
			if (game.IDEA.data) {
				const buf = `<details><summary>IDEA roles:</summary>${game.IDEA.data.roles.join(`<br />`)}</details>`;
				return this.sendReplyBox(buf);
			}
			const showOrl = (['orl', 'originalrolelist'].includes(cmd) || game.noReveal);
			const roleString = (showOrl ? game.originalRoles : game.roles).sort((a, b) => {
				if (a.alignment < b.alignment) return -1;
				if (b.alignment < a.alignment) return 1;
				return 0;
			}).map(role => role.safeName).join(', ');

			this.sendReplyBox(`${showOrl ? `Original Rolelist: ` : `Rolelist: `}${roleString}`);
		},

		playerroles(target, room, user) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id)) return this.errorReply(`Only the host can view roles.`);
			if (!game.started) return this.errorReply(`The game has not started.`);
			const players = [...Object.values(game.playerTable), ...Object.values(game.dead)];
			this.sendReplyBox(players.map(p => `${p.safeName}: ${p.role ? (p.role.alignment === 'solo' ? 'Solo ' : '') + p.role.safeName : 'No role'}`).join('<br/>'));
		},

		spectate: 'view',
		view(target, room, user, connection) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			if (!this.runBroadcast()) return;
			if (this.broadcasting) return this.sendReplyBox(`<button name="joinRoom" value="view-mafia-${room.roomid}" class="button"><strong>Spectate the game</strong></button>`);
			return this.parse(`/join view-mafia-${room.roomid}`);
		},

		'!refreshlynches': true,
		refreshlynches(target, room, user, connection) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			const lynches = game.lynchBoxFor(user.id);
			user.send(`>view-mafia-${game.room.roomid}\n|selectorhtml|#mafia-lynches|` + lynches);
		},
		'!sub': true,
		forcesub: 'sub',
		sub(target, room, user, connection, cmd) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			const action = toID(args.shift());
			switch (action) {
			case 'in':
				if (user.id in game.playerTable) {
					// Check if they have requested to be subbed out.
					if (!game.requestedSub.includes(user.id)) return user.sendTo(targetRoom, `|error|You have not requested to be subbed out.`);
					game.requestedSub.splice(game.requestedSub.indexOf(user.id), 1);
					user.sendTo(room, `|error|You have cancelled your request to sub out.`);
					game.playerTable[user.id].updateHtmlRoom();
				} else {
					if (!this.canTalk(null, targetRoom)) return;
					if (game.subs.includes(user.id)) return user.sendTo(targetRoom, `|error|You are already on the sub list.`);
					if (game.played.includes(user.id)) return user.sendTo(targetRoom, `|error|You cannot sub back into the game.`);
					const canJoin = game.canJoin(user, true);
					if (canJoin) return user.sendTo(targetRoom, `|error|${canJoin}`);
					game.subs.push(user.id);
					game.nextSub();
					// Update spectator's view
					this.parse(`/join view-mafia-${targetRoom.roomid}`);
				}
				break;
			case 'out':
				if (user.id in game.playerTable) {
					if (game.requestedSub.includes(user.id)) return user.sendTo(targetRoom, `|error|You have already requested to be subbed out.`);
					game.requestedSub.push(user.id);
					game.playerTable[user.id].updateHtmlRoom();
					game.nextSub();
				} else {
					if (game.hostid === user.id || game.cohosts.includes(user.id)) return user.sendTo(targetRoom, `|error|The host cannot sub out of the game.`);
					if (!game.subs.includes(user.id)) return user.sendTo(targetRoom, `|error|You are not on the sub list.`);
					game.subs.splice(game.subs.indexOf(user.id), 1);
					// Update spectator's view
					this.parse(`/join view-mafia-${targetRoom.roomid}`);
				}
				break;
			case 'next':
				if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
				const toSub = args.shift();
				if (!(toID(toSub) in game.playerTable)) return user.sendTo(targetRoom, `|error|${toSub} is not in the game.`);
				if (!game.subs.length) {
					if (game.hostRequestedSub.indexOf(toID(toSub)) !== -1) return user.sendTo(targetRoom, `|error|${toSub} is already on the list to be subbed out.`);
					user.sendTo(targetRoom, `|error|There are no subs to replace ${toSub}, they will be subbed if a sub is available before they speak next.`);
					game.hostRequestedSub.unshift(toID(toSub));
				} else {
					game.nextSub(toID(toSub));
				}
				break;
			case 'remove':
				if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
				const toRemove = toID(args.shift());
				const toRemoveIndex = game.subs.indexOf(toRemove);
				if (toRemoveIndex === -1) return user.sendTo(room, `|error|${toRemove} is not on the sub list.`);
				game.subs.splice(toRemoveIndex, 1);
				user.sendTo(room, `${toRemove} has been removed from the sublist`);
				break;
			case 'unrequest':
				if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
				const toUnrequest = toID(args.shift());
				const userIndex = game.requestedSub.indexOf(toUnrequest);
				const hostIndex = game.hostRequestedSub.indexOf(toUnrequest);
				if (userIndex < 0 && hostIndex < 0) return user.sendTo(room, `|error|${toUnrequest} is not requesting a sub.`);
				if (userIndex > -1) {
					game.requestedSub.splice(userIndex, 1);
					user.sendTo(room, `${toUnrequest}'s sub request has been removed.`);
				}
				if (hostIndex > -1) {
					game.hostRequestedSub.splice(userIndex, 1);
					user.sendTo(room, `${toUnrequest} has been removed from the host sublist.`);
				}
				break;
			default:
				if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
				const toSubOut = action;
				const toSubIn = toID(args.shift());
				if (!(toSubOut in game.playerTable)) return user.sendTo(targetRoom, `|error|${toSubOut} is not in the game.`);

				const targetUser = Users.get(toSubIn);
				if (!targetUser) return user.sendTo(targetRoom, `|error|The user "${toSubIn}" was not found.`);
				const canJoin = game.canJoin(targetUser, false, cmd === 'forcesub');
				if (canJoin) return user.sendTo(targetRoom, `|error|${canJoin}`);
				if (game.subs.includes(targetUser.id)) {
					game.subs.splice(game.subs.indexOf(targetUser.id), 1);
				}
				if (game.hostRequestedSub.includes(toSubOut)) {
					game.hostRequestedSub.splice(game.hostRequestedSub.indexOf(toSubOut), 1);
				}
				if (game.requestedSub.includes(toSubOut)) {
					game.requestedSub.splice(game.requestedSub.indexOf(toSubOut), 1);
				}
				game.sub(toSubOut, toSubIn);
			}
		},
		subhelp: [
			`/mafia sub in - Request to sub into the game, or cancel a request to sub out.`,
			`/mafia sub out - Request to sub out of the game, or cancel a request to sub in.`,
			`/mafia sub next, [player] - Forcibly sub [player] out of the game. Requires host % @ # & ~`,
			`/mafia sub remove, [user] - Remove [user] from the sublist. Requres host % @ # & ~`,
			`/mafia sub unrequest, [player] - Remove's a player's request to sub out of the game. Requires host % @ # & ~`,
			`/mafia sub [player], [user] - Forcibly sub [player] for [user]. Requires host % @ # & ~`,
		],

		"!autosub": true,
		autosub(target, room, user) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('mute', null, room)) return;
			if (this.meansYes(toID(args.join('')))) {
				if (game.autoSub) return user.sendTo(targetRoom, `|error|Automatic subbing of players is already enabled.`);
				game.autoSub = true;
				user.sendTo(targetRoom, `Automatic subbing of players has been enabled.`);
				game.nextSub();
			} else if (this.meansNo(toID(args.join('')))) {
				if (!game.autoSub) return user.sendTo(targetRoom, `|error|Automatic subbing of players is already disabled.`);
				game.autoSub = false;
				user.sendTo(targetRoom, `Automatic subbing of players has been disabled.`);
			} else {
				return this.parse(`/help mafia autosub`);
			}
		},
		autosubhelp: [`/mafia autosub [yes|no] - Sets if players will automatically sub out if a user is on the sublist. Requires host % @ # & ~`],

		cohost: 'subhost',
		forcecohost: 'subhost',
		forcesubhost: 'subhost',
		subhost(target, room, user, connection, cmd) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (!this.canTalk()) return;
			if (!target) return this.parse(`/help mafia ${cmd}`);
			if (!this.can('mute', null, room)) return false;
			this.splitTarget(target, false);
			const targetUser = this.targetUser;
			if (!targetUser || !targetUser.connected) return this.errorReply(`The user "${this.targetUsername}" was not found.`);
			if (!room.users[targetUser.id]) return this.errorReply(`${targetUser.name} is not in this room, and cannot be hosted.`);
			if (game.hostid === targetUser.id) return this.errorReply(`${targetUser.name} is already the host.`);
			if (game.cohosts.includes(targetUser.id)) return this.errorReply(`${targetUser.name} is already a cohost.`);
			if (targetUser.id in game.playerTable) return this.errorReply(`The host cannot be ingame.`);
			if (targetUser.id in game.dead) {
				if (!cmd.includes('force')) return this.errorReply(`${targetUser.name} could potentially be revived. To continue anyway, use /mafia force${cmd} ${target}.`);
				if (game.dead[targetUser.id].lynching) game.unlynch(targetUser.id);
				game.dead[targetUser.id].destroy();
				delete game.dead[targetUser.id];
			}
			if (cmd.includes('cohost')) {
				game.cohosts.push(targetUser.id);
				game.sendDeclare(Chat.html`${targetUser.name} has been added as a cohost by ${user.name}`);
				for (const conn of targetUser.connections) {
					void Chat.resolvePage(`view-mafia-${room.roomid}`, targetUser, conn);
				}
				this.modlog('MAFIACOHOST', targetUser, null, {noalts: true, noip: true});
			} else {
				const oldHostid = game.hostid;
				const oldHost = Users.get(game.hostid);
				if (oldHost) oldHost.send(`>view-mafia-${room.roomid}\n|deinit`);
				if (game.subs.includes(targetUser.id)) game.subs.splice(game.subs.indexOf(targetUser.id), 1);
				const queueIndex = hostQueue.indexOf(targetUser.id);
				if (queueIndex > -1) hostQueue.splice(queueIndex, 1);
				game.host = Chat.escapeHTML(targetUser.name);
				game.hostid = targetUser.id;
				game.played.push(targetUser.id);
				for (const conn of targetUser.connections) {
					void Chat.resolvePage(`view-mafia-${room.roomid}`, targetUser, conn);
				}
				// tslint:disable-next-line: max-line-length
				game.sendDeclare(Chat.html`${targetUser.name} has been substituted as the new host, replacing ${oldHostid}.`);
				this.modlog('MAFIASUBHOST', targetUser, `replacing ${oldHostid}`, {noalts: true, noip: true});
			}
		},
		subhosthelp: [`/mafia subhost [user] - Substitues the user as the new game host.`],
		cohosthelp: [`/mafia cohost [user] - Adds the user as a cohost. Cohosts can talk during the game, as well as perform host actions.`],

		uncohost: 'removecohost',
		removecohost(target, room, user) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = room.game as MafiaTracker;
			if (!this.canTalk()) return;
			if (!target) return this.parse('/help mafia subhost');
			if (!this.can('mute', null, room)) return false;
			const targetID = toID(target);

			const cohostIndex = game.cohosts.indexOf(targetID);
			if (cohostIndex < 0) {
				if (game.hostid === targetID) return this.errorReply(`${target} is the host, not a cohost. Use /mafia subhost to replace them.`);
				return this.errorReply(`${target} is not a cohost.`);
			}
			game.cohosts.splice(cohostIndex, 1);
			game.sendDeclare(Chat.html`${target} was removed as a cohost by ${user.name}`);
			this.modlog('MAFIAUNCOHOST', target, null, {noalts: true, noip: true});
		},

		'!end': true,
		end(target, room, user) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms.get(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.id]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = targetRoom.game as MafiaTracker;
			if (game.hostid !== user.id && !game.cohosts.includes(user.id) && !this.can('broadcast', null, room)) return;
			game.end();
			this.room = targetRoom;
			this.modlog('MAFIAEND', null);
		},
		endhelp: [`/mafia end - End the current game of mafia. Requires host + % @ # & ~`],

		'!data': true,
		role: 'data',
		modifier: 'data',
		alignment: 'data',
		theme: 'data',
		term: 'data',
		dt: 'data',
		data(target, room, user, connection, cmd) {
			if (room && room.mafiaDisabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (cmd === 'role' && !target && room) {
				// Support /mafia role showing your current role if you're in a game
				const game = room.game as MafiaTracker;
				if (!game || game.roomid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room. If you meant to display information about a role, use /mafia role [role name]`);
				if (!(user.id in game.playerTable)) return this.errorReply(`You are not in the game of ${game.title}.`);
				const role = game.playerTable[user.id].role;
				if (!role) return this.errorReply(`You do not have a role yet.`);
				return this.sendReplyBox(`Your role is: ${role.safeName}`);
			}

			// hack to let hosts broadcast
			const game = room && room.game && room.game.gameid === 'mafia' ? room.game as MafiaTracker : null;
			if (game && (game.hostid === user.id || game.cohosts.includes(user.id))) {
				this.broadcastMessage = this.message.toLowerCase().replace(/[^a-z0-9\s!,]/g, '');
			}
			if (!this.runBroadcast()) return false;

			if (!target) return this.parse(`/help mafia data`);

			const types: {[k: string]: string}
				= {alignment: 'alignments', role: 'roles', modifier: 'modifiers', theme: 'themes', term: 'terms'};
			const id = target.split(' ').map(toID).join('_');
			let result = null;
			let dataType = cmd;
			if (cmd in types) {
				const type: 'alignments' | 'roles' | 'modifiers' | 'themes' | 'IDEAs' | 'terms' = types[cmd] as any;
				const data = MafiaData[type];
				if (!data) return this.errorReply(`"${type}" is not a valid search area.`); // Should never happen
				if (!data[id]) return this.errorReply(`"${target} is not a valid ${cmd}."`);
				result = data[id];
				if (typeof result === 'string') result = data[result];
			} else {
				// Search all
				for (const i in types) {
					const type: 'alignments' | 'roles' | 'modifiers' | 'themes' | 'IDEAs' | 'terms' = types[i] as any;
					const data = MafiaData[type];
					if (!data) continue; // Should never happen
					if (!data[id]) continue;
					result = data[id];
					if (typeof result === 'string') result = data[result];
					dataType = i;
					break;
				}
				if (!result) return this.errorReply(`"${target}" is not a valid mafia alignment, role, modifier, or theme.`);
			}
			let buf = `<h3${result.color ? ' style="color: ' + result.color + '"' : ``}>${result.name}</h3><b>Type</b>: ${dataType}<br/>`;
			if (dataType === 'theme') {
				buf += `<b>Description</b>: ${result.desc}<br/><details><summary class="button" style="font-weight: bold; display: inline-block">Setups:</summary>`;
				for (const i in result) {
					if (isNaN(parseInt(i))) continue;
					buf += `${i}: `;
					const count: {[k: string]: number} = {};
					const roles = [];
					for (const role of result[i].split(',').map((x: string) => x.trim())) {
						count[role] = count[role] ? count[role] + 1 : 1;
					}
					for (const role in count) {
						roles.push(count[role] > 1 ? `${count[role]}x ${role}` : role);
					}
					buf += `${roles.join(', ')}<br/>`;
				}
			} else {
				buf += `${result.memo.join('<br/>')}`;
			}
			return this.sendReplyBox(buf);
		},
		datahelp: [`/mafia data [alignment|role|modifier|theme|term] - Get information on a mafia alignment, role, modifier, theme, or term.`],

		winfaction: 'win',
		win(target, room, user, connection, cmd) {
			if (!room || room.mafiaDisabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (room.roomid !== 'mafia') return this.errorReply(`This command can only be used in the Mafia room.`);
			if (cmd === 'winfaction' && (!room.game || room.game.gameid !== 'mafia')) return this.errorReply(`There is no game of mafia running in the room`);
			if (!this.can('mute', null, room)) return;
			const args = target.split(',');
			let points = parseInt(args[0]);
			if (isNaN(points)) {
				points = 10;
			} else {
				if (points > 100 || points < -100) {
					return this.errorReply(`You cannot give or take more than 100 points at a time.`);
				}
				// shift out the point count
				args.shift();
			}
			if (!args.length) return this.parse('/help mafia win');
			const month = new Date().toLocaleString("en-us", {month: "numeric", year: "numeric"});
			if (!logs.leaderboard[month]) logs.leaderboard[month] = {};

			let toGiveTo = [];
			let buf = `${points} were awarded to: `;
			if (cmd === 'winfaction') {
				const game = room.game as MafiaTracker;
				for (let faction of args) {
					faction = toID(faction);
					const inFaction = [];
					for (const player of [...Object.values(game.playerTable), ...Object.values(game.dead)]) {
						if (player.role && toID(player.role.alignment) === faction) {
							toGiveTo.push(player.id);
							inFaction.push(player.id);
						}
					}
					if (inFaction.length) buf += ` the ${faction} faction: ${inFaction.join(', ')};`;
				}
			} else {
				toGiveTo = args;
				buf += toGiveTo.join(', ');
			}
			if (!toGiveTo.length) return this.parse('/help mafia win');
			let gavePoints = false;
			for (let u of toGiveTo) {
				u = toID(u);
				if (!u) continue;
				if (!gavePoints) gavePoints = true;
				if (!logs.leaderboard[month][u]) logs.leaderboard[month][u] = 0;
				logs.leaderboard[month][u] += points;
				if (logs.leaderboard[month][u] === 0) delete logs.leaderboard[month][u];
			}
			if (!gavePoints) return this.parse('/help mafia win');
			writeFile(LOGS_FILE, logs);
			this.modlog(`MAFIAPOINTS`, null, `${points} points were awarded to ${Chat.toListString(toGiveTo)}`);
			room.add(buf).update();
		},
		winhelp: [
			`/mafia win (points), [user1], [user2], [user3], ... - Award the specified users points to the mafia leaderboard for this month. The amount of points can be negative to take points. Defaults to 10 points.`,
			`/mafia winfaction (points), [faction] - Award the specified points to all the players in the given faction.`,
		],

		unmvp: 'mvp',
		mvp(target, room, user, connection, cmd) {
			if (!room || room.mafiaDisabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (room.roomid !== 'mafia') return this.errorReply(`This command can only be used in the Mafia room.`);
			if (!this.can('mute', null, room)) return;
			const args = target.split(',');
			if (!args.length) return this.parse('/help mafia mvp');
			const month = new Date().toLocaleString("en-us", {month: "numeric", year: "numeric"});
			if (!logs.mvps[month]) logs.mvps[month] = {};
			if (!logs.leaderboard[month]) logs.leaderboard[month] = {};
			let gavePoints = false;
			for (let u of args) {
				u = toID(u);
				if (!u) continue;
				if (!gavePoints) gavePoints = true;
				if (!logs.leaderboard[month][u]) logs.leaderboard[month][u] = 0;
				if (!logs.mvps[month][u]) logs.mvps[month][u] = 0;
				if (cmd === 'unmvp') {
					logs.mvps[month][u]--;
					logs.leaderboard[month][u] -= 10;
					if (logs.mvps[month][u] === 0) delete logs.mvps[month][u];
					if (logs.leaderboard[month][u] === 0) delete logs.leaderboard[month][u];
				} else {
					logs.mvps[month][u]++;
					logs.leaderboard[month][u] += 10;
				}
			}
			if (!gavePoints) return this.parse('/help mafia mvp');
			writeFile(LOGS_FILE, logs);
			this.modlog(`MAFIA${cmd.toUpperCase()}`, null, `MVP and 10 points were ${cmd === 'unmvp' ? 'taken from' : 'awarded to'} ${Chat.toListString(args)}`);
			room.add(`MVP and 10 points were ${cmd === 'unmvp' ? 'taken from' : 'awarded to'}: ${Chat.toListString(args)}`).update();
		},
		mvphelp: [
			`/mafia mvp [user1], [user2], ... - Gives a MVP point and 10 leaderboard points to the users specified.`,
			`/mafia unmvp [user1], [user2], ... - Takes away a MVP point and 10 leaderboard points from the users specified.`,
		],

		hostlogs: 'leaderboard',
		playlogs: 'leaderboard',
		leaverlogs: 'leaderboard',
		mvpladder: 'leaderboard',
		lb: 'leaderboard',
		leaderboard(target, room, user, connection, cmd) {
			if (!room || room.mafiaDisabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (room.roomid !== 'mafia') return this.errorReply(`This command can only be used in the Mafia room.`);
			if (['hostlogs', 'playlogs', 'leaverlogs'].includes(cmd)) {
				if (!this.can('mute', null, room)) return;
			} else {
				// Deny broadcasting host/playlogs
				if (!this.runBroadcast()) return;
			}
			if (cmd === 'lb') cmd = 'leaderboard';
			if (this.broadcasting) return this.sendReplyBox(`<button name="joinRoom" value="view-mafialadder-${cmd}" class="button"><strong>${cmd}</strong></button>`);
			return this.parse(`/join view-mafialadder-${cmd}`);
		},
		leaderboardhelp: [
			`/mafia [leaderboard|mvpladder] - View the leaderboard or MVP ladder for the current or last month.`,
			`/mafia [hostlogs|playlogs|leaverlogs] - View the host, play, or leaver logs for the current or last month. Requires % @ # & ~`,
		],

		unhostban: 'hostban',
		hostban(target, room, user, connection, cmd) {
			if (!room || room.mafiaDisabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (room.roomid !== 'mafia') return this.errorReply(`This command can only be used in the Mafia room.`);

			const [targetUser, durationString] = this.splitOne(target);
			const targetUserID = toID(targetUser);
			const duration = parseInt(durationString);

			if (!targetUserID) return this.errorReply(`User not found.`);
			if (!this.can('mute', null, room)) return false;

			const isUnban = (cmd.startsWith('un'));
			if (isHostBanned(targetUserID) === !isUnban) return this.errorReply(`${targetUser} is ${isUnban ? 'not' : 'already'} banned from hosting games.`);

			if (isUnban) {
				delete hostBans[targetUserID];
				this.modlog(`MAFIAUNHOSTBAN`, null, `${targetUserID}`);
			} else {
				if (isNaN(duration) || duration < 1) return this.parse('/help mafia hostban');
				if (duration > 7) return this.errorReply(`Bans cannot be longer than 7 days.`);

				hostBans[targetUserID] = Date.now() + 1000 * 60 * 60 * 24 * duration;
				this.modlog(`MAFIAHOSTBAN`, null, `${targetUserID}, for ${duration} days.`);
				const queueIndex = hostQueue.indexOf(targetUserID);
				if (queueIndex > -1) hostQueue.splice(queueIndex, 1);
			}
			writeFile(BANS_FILE, hostBans);
			room.add(`${targetUser} was ${isUnban ? 'un' : ''}banned from hosting games${!isUnban ? ` for ${duration} days` : ''} by ${user.name}.`).update();
		},
		hostbanhelp: [
			`/mafia hostban [user], [duration] - Ban a user from hosting games for [duration] days. Requires % @ # & ~`,
			`/mafia unhostban [user] - Unbans a user from hosting games. Requires % @ # & ~`,
			`/mafia hostbans - Checks current hostbans. Requires % @ # & ~`,
		],

		hostbans(target, room) {
			if (!room || room.roomid !== 'mafia') return this.errorReply(`This command can only be used in the Mafia room.`);
			if (!this.can('mute', null, room)) return;
			let buf = 'Hostbanned users:';
			for (const [id, date] of Object.entries(hostBans)) {
				buf += `<br/>${id}: for ${Chat.toDurationString(date - Date.now())}`;
			}
			return this.sendReplyBox(buf);
		},

		disable(target, room, user) {
			if (!room || !this.can('gamemanagement', null, room)) return;
			if (room.mafiaDisabled) {
				return this.errorReply("Mafia is already disabled.");
			}
			room.mafiaDisabled = true;
			if (room.chatRoomData) {
				room.chatRoomData.mafiaDisabled = true;
				Rooms.global.writeChatRoomData();
			}
			this.modlog('MAFIADISABLE', null);
			return this.sendReply("Mafia has been disabled for this room.");
		},
		disablehelp: [`/mafia disable - Disables mafia in this room. Requires # & ~`],

		enable(target, room, user) {
			if (!room || !this.can('gamemanagement', null, room)) return;
			if (!room.mafiaDisabled) {
				return this.errorReply("Mafia is already enabled.");
			}
			room.mafiaDisabled = false;
			if (room.chatRoomData) {
				room.chatRoomData.mafiaDisabled = false;
				Rooms.global.writeChatRoomData();
			}
			this.modlog('MAFIAENABLE', null);
			return this.sendReply("Mafia has been enabled for this room.");
		},
		enablehelp: [`/mafia enable - Enables mafia in this room. Requires # & ~`],
	},
	mafiahelp(target, room, user) {
		if (!this.runBroadcast()) return;
		let buf = `<strong>Commands for the Mafia Plugin</strong><br/>Most commands are used through buttons in the game screen.<br/><br/>`;
		buf += `<details><summary class="button">General Commands</summary>`;
		buf += [
			`<br/><strong>General Commands for the Mafia Plugin</strong>:<br/>`,
			`/mafia host [user] - Create a game of Mafia with [user] as the host. Roomvoices can only host themselves. Requires + % @ # & ~`,
			`/mafia nexthost - Host the next user in the host queue. Only works in the Mafia Room. Requires + % @ # & ~`,
			`/mafia forcehost [user] - Bypass the host queue and host [user]. Only works in the Mafia Room. Requires % @ # & ~`,
			`/mafia sub in - Request to sub into the game, or cancel a request to sub out.`,
			`/mafia sub out - Request to sub out of the game, or cancel a request to sub in.`,
			`/mafia spectate - Spectate the game of mafia.`,
			`/mafia lynches - Display the current lynch count, and whos lynching who.`,
			`/mafia players - Display the current list of players, will highlight players.`,
			`/mafia [rl|orl] - Display the role list or the original role list for the current game.`,
			`/mafia data [alignment|role|modifier|theme|term] - Get information on a mafia alignment, role, modifier, theme, or term.`,
			`/mafia subhost [user] - Substitues the user as the new game host. Requires % @ # & ~`,
			`/mafia cohost [user] - Adds the user as a cohost. Cohosts can talk during the game, as well as perform host actions. Requires % @ # & ~`,
			`/mafia uncohost [user] - Remove [user]'s cohost status. Requires % @ # & ~`,
			`/mafia disable - Disables mafia in this room. Requires # & ~`,
			`/mafia enable - Enables mafia in this room. Requires # & ~`,
		].join('<br/>');
		buf += `</details><details><summary class="button">Player Commands</summary>`;
		buf += [
			`<br/><strong>Commands that players can use</strong>:<br/>`,
			`/mafia join - Join the game.`,
			`/mafia leave - Leave the game. Can only be done while signups are open.`,
			`/mafia lynch [player|nolynch] - Vote to lynch the specified player or to not lynch anyone.`,
			`/mafia unlynch - Withdraw your lynch vote. Fails if you're not voting to lynch anyone`,
			`/mafia deadline - View the deadline for the current game.`,
			`/mafia sub in - Request to sub into the game, or cancel a request to sub out.`,
			`/mafia sub out - Request to sub out of the game, or cancel a request to sub in.`,
		].join('<br/>');
		buf += `</details><details><summary class="button">Host Commands</summary>`;
		buf += [
			`<br/><strong>Commands for game hosts and Cohosts to use</strong>:<br/>`,
			`/mafia playercap [cap|none]- Limit the number of players able to join the game. Player cap cannot be more than 20 or less than 2. Requires: host % @ # & ~`,
			`/mafia close - Closes signups for the current game. Requires: host % @ # & ~`,
			`/mafia closedsetup [on|off] - Sets if the game is a closed setup. Closed setups don't show the role list to players. Requires host % @ # & ~`,
			`/mafia reveal [on|off] - Sets if roles reveal on death or not. Requires host % @ # & ~`,
			`/mafia selflynch [on|hammer|off] - Allows players to self lynch themselves either at hammer or anytime. Requires host % @ # & ~`,
			`/mafia [enablenl|disablenl] - Allows or disallows players abstain from lynching. Requires host % @ # & ~`,
			`/mafia forcelynch [yes/no] - Forces player's lynches onto themselves, and prevents unlynching. Requires host % @ # & ~`,
			`/mafia setroles [comma seperated roles] - Set the roles for a game of mafia. You need to provide one role per player. Requires host % @ # & ~`,
			`/mafia forcesetroles [comma seperated roles] - Forcibly set the roles for a game of mafia. No role PM information or alignment will be set. Requires host % @ # & ~`,
			`/mafia start - Start the game of mafia. Signups must be closed. Requires host % @ # & ~`,
			`/mafia day - Move to the next game day. Requires host % @ # & ~`,
			`/mafia night - Move to the next game night. Requires host % @ # & ~`,
			`/mafia extend (minutes) - Return to the previous game day. If (minutes) is provided, set the deadline for (minutes) minutes. Requires host % @ # & ~`,
			`/mafia kill [player] - Kill a player, eliminating them from the game. Requires host % @ # & ~`,
			`/mafia treestump [player] - Kills a player, but allows them to talk during the day still. Requires host % @ # & ~`,
			`/mafia spirit [player] - Kills a player, but allows them to vote on the lynch still. Requires host % @ # & ~`,
			`/mafia spiritstump [player] - Kills a player, but allows them to talk during the day, and vote on the lynch. Requires host % @ # & ~`,
			`/mafia kick [player] - Kicks a player from the game without revealing their role. Requires host % @ # & ~`,
			`/mafia silence [player] - Silences [player], preventing them from talking at all. Requires host % @ # & ~`,
			`/mafia unsilence [player] - Removes a silence on [player], allowing them to talk again. Requires host % @ # & ~`,
			`/mafia revive [player] - Revive a player who died or add a new player to the game. Requires host % @ # & ~`,
			`/mafia deadline [minutes|off] - Sets or removes the deadline for the game. Cannot be more than 20 minutes.`,
			`/mafia sub next, [player] - Forcibly sub [player] out of the game. Requires host % @ # & ~`,
			`/mafia sub remove, [user] - Forcibly remove [user] from the sublist. Requres host % @ # & ~`,
			`/mafia sub unrequest, [player] - Remove's a player's request to sub out of the game. Requires host % @ # & ~`,
			`/mafia sub [player], [user] - Forcibly sub [player] for [user]. Requires host % @ # & ~`,
			`/mafia autosub [yes|no] - Sets if players will automatically sub out if a user is on the sublist. Defaults to yes. Requires host % @ # & ~`,
			`/mafia [love|hate] [player] - Makes it take 1 more (love) or less (hate) lynch to hammer [player]. Requires host % @ # & ~`,
			`/mafia [unlove|unhate] [player] - Removes loved or hated status from [player]. Requires host % @ # & ~`,
			`/mafia [mayor|voteless] [player] - Makes [player]'s' lynch worth 2 votes (mayor) or makes [player]'s lynch worth 0 votes (voteless). Requires host % @ # & ~`,
			`/mafia [unmayor|unvoteless] [player] - Removes mayor or voteless status from [player]. Requires host % @ # & ~`,
			`/mafia hammer [hammer] - sets the hammer count to [hammer] and resets lynches`,
			`/mafia hammer off - disables hammering`,
			`/mafia shifthammer [hammer] - sets the hammer count to [hammer] without resetting lynches`,
			`/mafia resethammer - sets the hammer to the default, resetting lynches`,
			`/mafia playerroles - View all the player's roles in chat. Requires host`,
			`/mafia end - End the current game of mafia. Requires host % @ # & ~`,
		].join('<br/>');
		buf += `</details><details><summary class="button">IDEA Module Commands</summary>`;
		buf += [
			`<br/><strong>Commands for using IDEA modules</strong><br/>`,
			`/mafia idea [idea] - starts the IDEA module [idea]. Requires + % @ # & ~, voices can only start for themselves`,
			`/mafia ideareroll - rerolls the IDEA module. Requires host % @ # & ~`,
			`/mafia ideapick [selection], [role] - selects a role`,
			`/mafia ideadiscards - shows the discarded roles`,
			`/mafia ideadiscards off - hides discards from the players. Requires host % @ # & ~`,
			`/mafia ideadiscards on - shows discards to the players. Requires host % @ # & ~`,
			`/mafia customidea choices, picks (new line here, shift+enter)`,
			`(comma or newline separated rolelist) - Starts an IDEA module with custom roles. Requires % @ # & ~`,
		].join('<br/>');
		buf += `</details>`;
		buf += `</details><details><summary class="button">Mafia Room Specific Commands</summary>`;
		buf += [
			`<br/><strong>Commands that are only useable in the Mafia Room</strong>:<br/>`,
			`/mafia queue add, [user] - Adds the user to the host queue. Requires % @ # & ~.`,
			`/mafia queue remove, [user] - Removes the user from the queue. You can remove yourself regardless of rank. Requires % @ # & ~.`,
			`/mafia queue - Shows the list of users who are in queue to host.`,
			`/mafia win (points) [user1], [user2], [user3], ... - Award the specified users points to the mafia leaderboard for this month. The amount of points can be negative to take points. Defaults to 10 points.`,
			`/mafia winfaction (points), [faction] - Award the specified points to all the players in the given faction. Requires % @ # & ~`,
			`/mafia mvp [user1], [user2], ... - Gives a MVP point and 10 leaderboard points to the users specified.`,
			`/mafia unmvp [user1], [user2], ... - Takes away a MVP point and 10 leaderboard points from the users specified.`,
			`/mafia [leaderboard|mvpladder] - View the leaderboard or MVP ladder for the current or last month.`,
			`/mafia [hostlogs|playlogs] - View the host logs or play logs for the current or last month. Requires % @ # & ~`,
			`/mafia hostban [user], [duration] - Ban a user from hosting games for [duration] days. Requires % @ # & ~`,
			`/mafia unhostban [user] - Unbans a user from hosting games. Requires % @ # & ~`,
			`/mafia hostbans - Checks current hostbans. Requires % @ # & ~`,
		].join('<br/>');
		buf += `</details>`;

		return this.sendReplyBox(buf);
	},
};

export const roomSettings: SettingsHandler = room => ({
	label: "Mafia",
	permission: 'editroom',
	options: [
		[`disabled`, room.mafiaDisabled || 'mafia disable'],
		[`enabled`, !room.mafiaDisabled || 'mafia enable'],
	],
});

process.nextTick(() => {
	Chat.multiLinePattern.register('/mafia customidea');
});
