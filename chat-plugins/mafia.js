'use strict';

/** @typedef {{[date: string]: {[userid: string]: number}}} MafiaLogTable */
/** @typedef {'leaderboard' | 'mvps' | 'hosts' | 'plays' | 'leavers'} MafiaLogSection */
/** @typedef {{leaderboard: MafiaLogTable, mvps: MafiaLogTable, hosts: MafiaLogTable, plays: MafiaLogTable, leavers: MafiaLogTable}} MafiaLog */
/** @typedef {{[k: string]: number}} MafiaHostBans */
/**
 * @typedef {Object} MafiaRole
 * @property {string} name
 * @property {string} safeName
 * @property {string} id
 * @property {string[]} memo
 * @property {string} alignment
 * @property {string} image
 */
/**
 * @typedef {Object} MafiaParsedRole
 * @property {MafiaRole} role
 * @property {string[]} problems
 */
/**
 * @typedef {Object} MafiaLynch
 * @property {number} count
 * @property {number} lastLynch
 * @property {string} dir
 * @property {string[]} lynchers
 */
/**
 * @typedef {Object} MafiaIDEAdata
 * @property {string} name
 * @property {string[]} roles
 * @property {number} choices
 * @property {string[]} picks
 */
/**
 * @typedef {Object} MafiaIDEAModule
 * @property {MafiaIDEAdata?} data
 * @property {NodeJS.Timer?} timer
 * @property {string} discardsHtml
 * @property {string[]} waitingPick
 */
/**
 * @typedef {Object} MafiaIDEAplayerData
 * @property {string[]} choices
 * @property {string[]} originalChoices
 * @property {Object} picks
 */

const FS = require('./../lib/fs');
const LOGS_FILE = 'config/chat-plugins/mafia-logs.json';
const BANS_FILE = 'config/chat-plugins/mafia-bans.json';
const MafiaData = require('./mafia-data.js');
/** @type {MafiaLog} */
let logs = {leaderboard: {}, mvps: {}, hosts: {}, plays: {}, leavers: {}};
/** @type {MafiaHostBans} */
let hostBans = Object.create(null);
/** @type {string[]} */
let hostQueue = [];

const IDEA_TIMER = 120 * 1000;

/**
 * @param {string} name
 */
function readFile(name) {
	try {
		const json = FS(name).readIfExistsSync();
		if (!json) {
			writeFile(name, "{}");
			return false;
		}
		return Object.assign(Object.create(null), JSON.parse(json));
	} catch (e) {
		if (e.code !== 'ENOENT') throw e;
	}
}
/**
 * @param {string} name
 * @param {object} data
 */
function writeFile(name, data) {
	FS(name).writeUpdate(() => (
		JSON.stringify(data)
	));
}

// Load logs
logs = readFile(LOGS_FILE);
if (!logs) logs = {leaderboard: {}, mvps: {}, hosts: {}, plays: {}, leavers: {}};
/** @type {MafiaLogSection[]} */
const tables = ['leaderboard', 'mvps', 'hosts', 'plays', 'leavers'];
for (const section of tables) {
	// Check to see if we need to eliminate an old month's data.
	const month = new Date().toLocaleString("en-us", {month: "numeric", year: "numeric"});
	if (!logs[section]) logs[section] = {};
	if (!logs[section][month]) logs[section][month] = {};
	if (Object.keys(logs[section]).length >= 3) {
		// eliminate the oldest month(s)
		let keys = Object.keys(logs[section]).sort((aKey, bKey) => {
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

/**
 * @param {string} userid
 */
function isHostBanned(userid) {
	if (!(userid in hostBans)) return false;
	if (hostBans[userid] < Date.now()) {
		delete hostBans[userid];
		writeFile(BANS_FILE, hostBans);
		return false;
	}
	return true;
}

class MafiaPlayer extends Rooms.RoomGamePlayer {
	/**
	 * @param {User} user
	 * @param {RoomGame} game
	 */
	constructor(user, game) {
		super(user, game);
		this.safeName = Chat.escapeHTML(this.name);
		/** @type {MafiaRole?} */
		this.role = null;
		this.lynching = '';
		this.lastLynch = 0;
		this.treestump = false;
		this.restless = false;
		/** @type {MafiaIDEAplayerData?} */
		this.IDEA = null;
	}

	getRole() {
		if (!this.role) return;
		return `<span style="font-weight:bold;color:${MafiaData.alignments[this.role.alignment].color}">${this.role.safeName}</span>`;
	}

	updateHtmlRoom() {
		const user = Users(this.userid);
		if (!user || !user.connected) return;
		if (this.game.ended) return user.send(`>view-mafia-${this.game.room.id}\n|deinit`);
		// @ts-ignore "Chat.pages" is possibly undefined
		const buf = Chat.pages.mafia([this.game.room.id], user);
		this.send(`>view-mafia-${this.game.room.id}\n|init|html\n${buf}`);
	}
}

// Parses a single role into an object
/**
 *
 * @param {string} roleString
 * @return {MafiaParsedRole}
 */
function parseRole(roleString) {
	/** @type {MafiaRole} */
	let role = {
		name: roleString.split(' ').map(p => toId(p) === 'solo' ? '' : p).join(' '),
		safeName: '', // MAKE SURE THESE ARE SET BELOW
		id: '',
		image: '',
		memo: ['During the Day, you may vote for whomever you want lynched.'],
		alignment: '',
	};
	roleString = roleString.replace(/\s*\(.*?\)\s*/g, ' ');
	let target = roleString.toLowerCase().replace(/[^\w\d\s]/g, '').split(' ');
	let problems = [];
	role.safeName = Chat.escapeHTML(role.name);
	role.id = toId(role.name);
	for (let key in MafiaData.roles) {
		if (key.includes('_')) {
			let roleKey = target.slice().map(toId).join('_');
			if (roleKey.includes(key)) {
				let originalKey = key;
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
				let index = roleKey.split('_').indexOf(originalKey.split('_')[0]);
				target.splice(index, originalKey.split('_').length);
			}
		} else if (target.includes(key)) {
			let index = target.indexOf(key);
			if (typeof MafiaData.roles[key] === 'string') key = MafiaData.roles[key];
			if (!role.image && MafiaData.roles[key].image) role.image = MafiaData.roles[key].image;
			if (MafiaData.roles[key].memo) role.memo = role.memo.concat(MafiaData.roles[key].memo);
			target.splice(index, 1);
		}
	}
	// Add modifiers
	for (let key in MafiaData.modifiers) {
		if (key.includes('_')) {
			let roleKey = target.slice().map(toId).join('_');
			if (roleKey.includes(key)) {
				if (typeof MafiaData.modifiers[key] === 'string') key = MafiaData.modifiers[key];
				if (!role.image && MafiaData.modifiers[key].image) role.image = MafiaData.modifiers[key].image;
				if (MafiaData.modifiers[key].memo) role.memo = role.memo.concat(MafiaData.modifiers[key].memo);
				let index = roleKey.split('_').indexOf(key.split('_')[0]);
				target.splice(index, key.split('_').length);
			}
		} else if (key === 'xshot') {
			// Special case for X-Shot modifier
			for (let [i, xModifier] of target.entries()) {
				if (toId(xModifier).endsWith('shot')) {
					let num = parseInt(toId(xModifier).substring(0, toId(xModifier).length - 4));
					if (isNaN(num)) continue;
					let memo = MafiaData.modifiers.xshot.memo.slice();
					memo = memo.map((/** @type {string} */m) => m.replace(/X/g, num.toString()));
					role.memo = role.memo.concat(memo);
					target.splice(i, 1);
					i--;
				}
			}
		} else if (target.includes(key)) {
			let index = target.indexOf(key);
			if (typeof MafiaData.modifiers[key] === 'string') key = MafiaData.modifiers[key];
			if (!role.image && MafiaData.modifiers[key].image) role.image = MafiaData.modifiers[key].image;
			if (MafiaData.modifiers[key].memo) role.memo = role.memo.concat(MafiaData.modifiers[key].memo);
			target.splice(index, 1);
		}
	}
	// Determine the role's alignment
	for (let [j, targetId] of target.entries()) {
		let id = toId(targetId);
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

class MafiaTracker extends Rooms.RoomGame {
	/**
	 * @param {ChatRoom} room
	 * @param {User} host
	 */
	constructor(room, host) {
		super(room);

		this.gameid = 'mafia';
		this.title = 'Mafia';
		this.playerCap = 20;
		this.allowRenames = false;
		this.started = false;
		this.ended = false;
		/** @type {Object?} */
		this.theme = null;

		this.hostid = host.userid;
		this.host = Chat.escapeHTML(host.name);

		/** @type {{[userid: string]: MafiaPlayer}} */
		this.players = Object.create(null);
		/** @type {{[userid: string]: MafiaPlayer}} */
		this.dead = Object.create(null);
		/** @type {string[]} */
		this.subs = [];
		this.autoSub = true;
		/** @type {string[]} */
		this.requestedSub = [];
		/** @type {string[]} */
		this.hostRequestedSub = [];
		/** @type {string[]} */
		this.played = [];

		this.hammerCount = 0;
		/** @type {{[userid: string]: MafiaLynch}} */
		this.lynches = Object.create(null);
		/** @type {string?} */
		this.hasPlurality = null;
		/** @type {boolean} */
		this.enableNL = true;

		/** @type {MafiaRole[]} */
		this.originalRoles = [];
		this.originalRoleString = '';
		/** @type {MafiaRole[]} */
		this.roles = [];
		this.roleString = '';

		/** @type {"signups" | "locked" | "IDEApicking" | "IDEAlocked" | "day" | "night"} */
		this.phase = "signups";
		this.dayNum = 0;
		this.closedSetup = false;
		this.noReveal = false;
		/** @type {(boolean | "hammer")} */
		this.selfEnabled = false;
		/** @type {NodeJS.Timer?} */
		this.timer = null;
		/** @type {number} */
		this.dlAt = 0;

		/** @type {MafiaIDEAModule} */
		this.IDEA = {
			data: null,
			timer: null,
			discardsHtml: '',
			waitingPick: [],
		};

		this.sendRoom(this.roomWindow(), {uhtml: true});
	}

	/**
	 * @param {User} user
	 * @return {void}
	 */
	join(user) {
		if (this.phase !== 'signups') return user.sendTo(this.room, `|error|The game of ${this.title} has already started.`);
		const canJoin = this.canJoin(user, true);
		if (canJoin) return user.sendTo(this.room, `|error|${canJoin}`);
		if (!this.addPlayer(user)) return user.sendTo(this.room, `|error|You have already joined the game of ${this.title}.`);
		if (this.subs.includes(user.userid)) this.subs.splice(this.subs.indexOf(user.userid), 1);
		this.players[user.userid].updateHtmlRoom();
		this.sendRoom(`${this.players[user.userid].name} has joined the game.`);
	}

	/**
	 * @param {User} user
	 * @return {void}
	 */
	leave(user) {
		if (!(user.userid in this.players)) return user.sendTo(this.room, `|error|You have not joined the game of ${this.title}.`);
		if (this.phase !== 'signups') return user.sendTo(this.room, `|error|The game of ${this.title} has already started.`);
		this.players[user.userid].destroy();
		delete this.players[user.userid];
		this.playerCount--;
		let subIndex = this.requestedSub.indexOf(user.userid);
		if (subIndex !== -1) this.requestedSub.splice(subIndex, 1);
		subIndex = this.hostRequestedSub.indexOf(user.userid);
		if (subIndex !== -1) this.hostRequestedSub.splice(subIndex, 1);
		this.sendRoom(`${user.name} has left the game.`);
		// @ts-ignore "Chat.pages" is possibly undefined
		user.send(`>view-mafia-${this.room.id}\n|init|html\n${Chat.pages.mafia([this.room.id], user)}`);
	}

	/**
	 * @param {User} user
	 * @return {MafiaPlayer}
	 */
	makePlayer(user) {
		return new MafiaPlayer(user, this);
	}

	/**
	 * @param {User} user
	 * @param {string} roleString
	 * @param {boolean} force
	 * @return {void}
	 */
	setRoles(user, roleString, force = false) {
		let roles = (/** @type {string[]} */roleString.split(',').map(x => x.trim()));
		if (roles.length === 1) {
			// Attempt to set roles from a theme
			let theme = MafiaData.themes[toId(roles[0])];
			if (typeof theme === 'string') theme = MafiaData.themes[theme];
			if (typeof theme !== 'object') return user.sendTo(this.room, `|error|The theme "${roles[0]}" was not found.`);
			if (!theme[this.playerCount]) return user.sendTo(this.room, `|error|The theme "${theme.name}" does not have a role list for ${this.playerCount} players.`);
			/** @type {string} */
			let themeRoles = theme[this.playerCount].slice();
			roles = themeRoles.split(',').map(x => x.trim());
			this.theme = theme;
		} else {
			this.theme = null;
		}
		if (roles.length < this.playerCount) {
			return user.sendTo(this.room, `|error|You have not provided enough roles for the players.`);
		} else if (roles.length > this.playerCount) {
			user.sendTo(this.room, `|error|You have provided too many roles, ${roles.length - this.playerCount} ${Chat.plural(roles.length - this.playerCount, 'roles', 'role')} will not be assigned.`);
		}
		if (this.originalRoles.length) {
			// Reset roles
			this.originalRoles = [];
			this.originalRoleString = '';
			this.roles = [];
			this.roleString = '';
		}
		if (this.IDEA.data) this.IDEA.data = null;
		if (force) {
			this.originalRoles = roles.map(r => {
				return {
					name: r,
					safeName: Chat.escapeHTML(r),
					id: toId(r),
					alignment: 'solo',
					image: '',
					memo: [`To learn more about your role, PM the host (${this.host}).`],
				};
			});
			this.roles = this.originalRoles.slice();
			this.originalRoleString = this.originalRoles.slice().map(r => `<span style="font-weight:bold;color:${MafiaData.alignments[r.alignment].color || '#FFF'}">${r.safeName}</span>`).join(', ');
			this.roleString = this.originalRoleString;
			return this.sendRoom(`The roles have been set.`);
		}
		/** @type {string[]} */
		let problems = [];
		/** @type {string[]} */
		let alignments = [];
		/** @type {{[k: string]: MafiaRole}} */
		let cache = Object.create(null);
		for (const string of roles) {
			const roleId = string.toLowerCase().replace(/[^\w\d\s]/g, '');
			if (roleId in cache) {
				this.originalRoles.push(Object.assign(Object.create(null), cache[roleId]));
			} else {
				const role = parseRole(string);
				if (role.problems.length) problems = problems.concat(role.problems);
				if (alignments.indexOf(role.role.alignment) === -1) alignments.push(role.role.alignment);
				cache[roleId] = role.role;
				this.originalRoles.push(role.role);
			}
		}
		if (alignments.length < 2 && alignments[0] !== 'solo') problems.push(`There must be at least 2 different alignments in a game!`);
		if (problems.length) {
			this.originalRoles = [];
			for (const problem of problems) {
				user.sendTo(this.room, `|error|${problem}`);
			}
			return user.sendTo(this.room, `|error|To forcibly set the roles, use /mafia forcesetroles`);
		}
		this.roles = this.originalRoles.slice();
		this.originalRoleString = this.originalRoles.slice().map(r => `<span style="font-weight:bold;color:${MafiaData.alignments[r.alignment].color || '#FFF'}">${r.safeName}</span>`).join(', ');
		this.roleString = this.originalRoleString;
		this.phase = 'locked';
		this.updatePlayers();
		this.sendRoom(`The roles have been set.`);
	}

	/**
	 * @param {User} user
	 * @return {void}
	 */
	start(user) {
		if (!user) return;
		if (this.phase !== 'locked' && this.phase !== 'IDEAlocked') {
			if (this.phase === 'signups') return user.sendTo(this.room, `You need to close the signups first.`);
			if (this.phase === 'IDEApicking') return user.sendTo(this.room, `You must wait for IDEA picks to finish before starting.`);
			return user.sendTo(this.room, `The game is already started!`);
		}
		if (this.playerCount < 2) return user.sendTo(this.room, `You need at least 2 players to start.`);
		if (this.phase === 'IDEAlocked') {
			for (const p in this.players) {
				if (!this.players[p].role) return user.sendTo(this.room, `|error|Not all players have a role.`);
			}
		} else {
			if (!Object.keys(this.roles).length) return user.sendTo(this.room, `You need to set the roles before starting.`);
			if (Object.keys(this.roles).length < this.playerCount) return user.sendTo(this.room, `You have not provided enough roles for the players.`);
		}
		this.started = true;
		this.played = Object.keys(this.players);
		this.sendRoom(`The game of ${this.title} is starting!`, {declare: true});
		this.played.push(this.hostid);
		this.distributeRoles();
		this.day(null, true);
		if (this.IDEA.data) this.room.add(`|html|<div class="infobox"><details><summary>IDEA discards:</summary>${this.IDEA.discardsHtml}</details></div>`).update();
	}

	/**
	 * @return {void}
	 */
	distributeRoles() {
		if (this.phase !== 'locked' || !Object.keys(this.roles).length) return;
		this.sendRoom(`The roles are being distributed...`);
		let roles = Dex.shuffle(this.roles.slice());
		for (let p in this.players) {
			let role = roles.shift();
			this.players[p].role = role;
			let u = Users(p);
			if (u && u.connected) u.send(`>${this.room.id}\n|notify|Your role is ${role.safeName}. For more details of your role, check your Role PM.`);
		}
		this.sendRoom(`The roles have been distributed.`, {declare: true});
		this.updatePlayers();
	}

	/**
	 * @param {string} alignment
	 * @param {MafiaPlayer} player
	 * @return {string}
	 */
	getPartners(alignment, player) {
		if (!player || !player.role || ['town', 'solo'].includes(player.role.alignment)) return "";
		let partners = [];
		for (let p in this.players) {
			if (p === player.userid) continue;
			const role = this.players[p].role;
			if (role && role.alignment === player.role.alignment) partners.push(this.players[p].name);
		}
		return partners.join(", ");
	}

	/**
	 * @param {number?} extension
	 * @param {boolean} initial
	 * @return {void}
	 */
	day(extension = null, initial = false) {
		if (this.phase !== 'night' && !initial) return;
		if (this.timer) this.setDeadline(0);
		if (extension === null) {
			this.hammerCount = Math.floor(Object.keys(this.players).length / 2) + 1;
			this.lynches = Object.create(null);
			this.hasPlurality = null;
			this.clearLynches();
		}
		this.phase = 'day';
		if (extension !== null && !initial) {
			// Day stays same
			this.setDeadline(extension);
		} else {
			this.dayNum++;
		}
		this.sendRoom(`Day ${this.dayNum}. The hammer count is set at ${this.hammerCount}`, {declare: true});
		this.sendPlayerList();
		this.updatePlayers();
	}

	/**
	 * @param {boolean} early
	 * @return {void}
	 */
	night(early = false) {
		if (this.phase !== 'day') return;
		if (this.timer) this.setDeadline(0, true);
		this.phase = 'night';
		let host = Users(this.hostid);
		if (host && host.connected) host.send(`>${this.room.id}\n|notify|It's night in your game of Mafia!`);
		this.sendRoom(`Night ${this.dayNum}. PM the host your action, or idle.`, {declare: true});
		const hasPlurality = this.getPlurality();
		if (!early && hasPlurality) this.sendRoom(`Plurality is on ${this.players[hasPlurality] ? this.players[hasPlurality].name : 'No Lynch'}`);
		this.updatePlayers();
	}

	/**
	 * @param {string} userid
	 * @param {string} target
	 * @return {void}
	 */
	lynch(userid, target) {
		if (this.phase !== 'day') return this.sendUser(userid, `|error|You can only lynch during the day.`);
		let player = this.players[userid];
		if (!player && this.dead[userid] && this.dead[userid].restless) player = this.dead[userid];
		if (!player) return;
		if (!(target in this.players) && target !== 'nolynch') return this.sendUser(userid, `|error|${target} is not a valid player.`);
		if (!this.enableNL && target === 'nolynch') return this.sendUser(userid, `|error|No Lynch is not allowed.`);
		if (target === player.userid && !this.selfEnabled) return this.sendUser(userid, `|error|Self lynching is not allowed.`);
		if (target === player.userid && (this.hammerCount - 1 > (this.lynches[target] ? this.lynches[target].count : 0)) && this.selfEnabled === 'hammer') return this.sendUser(userid, `|error|You may only lynch yourself when you placing the hammer vote.`);
		if (player.lastLynch + 2000 >= Date.now()) return this.sendUser(userid, `|error|You must wait another ${Chat.toDurationString((player.lastLynch + 2000) - Date.now()) || '1 second'} before you can change your lynch.`);
		const previousLynch = player.lynching;
		if (previousLynch) this.unlynch(userid, true);
		let lynch = this.lynches[target];
		if (!lynch) {
			this.lynches[target] = {count: 1, lastLynch: Date.now(), dir: 'up', lynchers: [userid]};
			lynch = this.lynches[target];
		} else {
			lynch.count++;
			lynch.lastLynch = Date.now();
			lynch.dir = 'up';
			lynch.lynchers.push(userid);
		}
		player.lynching = target;
		let name = player.lynching === 'nolynch' ? 'No Lynch' : this.players[player.lynching].name;
		const targetUser = Users(userid);
		if (previousLynch) {
			this.sendRoom(`${(targetUser ? targetUser.name : userid)} has shifted their lynch from ${previousLynch === 'nolynch' ? 'No Lynch' : this.players[previousLynch].name} to ${name}`, {timestamp: true});
		} else {
			this.sendRoom(name === 'No Lynch' ? `${(targetUser ? targetUser.name : userid)} has abstained from lynching.` : `${(targetUser ? targetUser.name : userid)} has lynched ${name}.`, {timestamp: true});
		}
		player.lastLynch = Date.now();
		if (this.hammerCount <= lynch.count) {
			// HAMMER
			this.sendRoom(`Hammer! ${target === 'nolynch' ? 'Nobody' : Chat.escapeHTML(name)} was lynched!`, {declare: true});
			if (target !== 'nolynch') this.eliminate(this.players[target], 'kill');
			this.night(true);
			return;
		}
		this.hasPlurality = null;
		player.updateHtmlRoom();
	}

	/**
	 * @param {string} userid
	 * @param {boolean} force
	 * @return {void}
	 */
	unlynch(userid, force = false) {
		if (this.phase !== 'day' && !force) return this.sendUser(userid, `|error|You can only lynch during the day.`);
		let player = this.players[userid];
		if (!player && this.dead[userid] && this.dead[userid].restless) player = this.dead[userid];
		if (!player || !player.lynching) return this.sendUser(userid, `|error|You are not lynching anyone.`);
		if (player.lastLynch + 2000 >= Date.now() && !force) this.sendUser(userid, `|error|You must wait another ${Chat.toDurationString((player.lastLynch + 2000) - Date.now()) || '1 second'} before you can change your lynch.`);
		let lynch = this.lynches[player.lynching];
		lynch.count--;
		if (lynch.count <= 0) {
			delete this.lynches[player.lynching];
		} else {
			lynch.lastLynch = Date.now();
			lynch.dir = 'down';
			lynch.lynchers.splice(lynch.lynchers.indexOf(userid), 1);
		}
		const targetUser = Users(userid);
		if (!force) this.sendRoom(player.lynching === 'nolynch' ? `${(targetUser ? targetUser.name : userid)} is no longer abstaining from lynching.` : `${(targetUser ? targetUser.name : userid)} has unlynched ${this.players[player.lynching].name}.`, {timestamp: true});
		player.lynching = '';
		player.lastLynch = Date.now();
		this.hasPlurality = null;
		player.updateHtmlRoom();
	}

	/**
	 * @return {void}
	 */
	resetHammer() {
		this.setHammer(Math.floor(Object.keys(this.players).length / 2) + 1);
	}

	/**
	 * @param {number} count
	 * @return {void}
	 */
	setHammer(count) {
		this.hammerCount = count;
		this.sendRoom(`The hammer count has been set at ${this.hammerCount}, and lynches have been reset.`, {declare: true});
		this.lynches = Object.create(null);
		this.hasPlurality = null;
		this.clearLynches();
	}

	/**
	 * @param {number} count
	 * @return {void}
	 */
	shiftHammer(count) {
		this.hammerCount = count;
		this.sendRoom(`The hammer count has been shifted to ${this.hammerCount}. Lynches have not been reset.`, {declare: true});
		let hammered = [];
		for (const lynch in this.lynches) {
			if (this.lynches[lynch].count >= this.hammerCount) hammered.push(lynch === 'nolynch' ? 'Nobody' : lynch);
		}
		if (hammered.length) {
			this.sendRoom(`${Chat.count(hammered, "players have")} been hammered: ${hammered.join(', ')}. They have not been removed from the game.`, {declare: true});
			this.night(true);
		}
	}

	/**
	 * @return {string?}
	 */
	getPlurality() {
		if (this.hasPlurality) return this.hasPlurality;
		if (!Object.keys(this.lynches).length) return null;
		let max = 0;
		let topLynches = /** @type {string[]} */ ([]);
		for (let key in this.lynches) {
			if (this.lynches[key].count > max) {
				max = this.lynches[key].count;
				topLynches = [key];
			} else if (this.lynches[key].count === max) {
				topLynches.push(key);
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

	/**
	 * @param {MafiaPlayer} player
	 * @param {string} ability
	 * @return {void}
	 */
	eliminate(player, ability = 'kill') {
		if (!(player.userid in this.players)) return;
		if (!this.started) {
			// Game has not started, simply kick the player
			this.sendRoom(`${player.safeName} was kicked from the game!`, {declare: true});
			if (this.hostRequestedSub.includes(player.userid)) this.hostRequestedSub.splice(this.hostRequestedSub.indexOf(player.userid), 1);
			if (this.requestedSub.includes(player.userid)) this.requestedSub.splice(this.requestedSub.indexOf(player.userid), 1);
			player.destroy();
			delete this.players[player.userid];
			this.playerCount--;
			player.updateHtmlRoom();
			return;
		}
		this.dead[player.userid] = player;
		let msg = `${player.safeName}`;
		switch (ability) {
		case 'treestump':
			this.dead[player.userid].treestump = true;
			msg += ` has been treestumped`;
			break;
		case 'spirit':
			this.dead[player.userid].restless = true;
			msg += ` became a restless spirit`;
			break;
		case 'spiritstump':
			this.dead[player.userid].treestump = true;
			this.dead[player.userid].restless = true;
			msg += ` became a restless treestump`;
			break;
		case 'kick':
			msg += ` was kicked from the game`;
			break;
		default:
			msg += ` was eliminated`;
		}
		if (player.lynching) this.unlynch(player.userid, true);
		this.sendRoom(`${msg}! ${!this.noReveal && toId(ability) === 'kill' ? `${player.safeName}'s role was ${player.getRole()}.` : ''}`, {declare: true});
		const targetRole = player.role;
		if (targetRole) {
			for (const [roleIndex, role] of this.roles.entries()) {
				if (role.id === targetRole.id) {
					this.roles.splice(roleIndex, 1);
					break;
				}
			}
		}
		this.clearLynches(player.userid);
		delete this.players[player.userid];
		let subIndex = this.requestedSub.indexOf(player.userid);
		if (subIndex !== -1) this.requestedSub.splice(subIndex, 1);
		subIndex = this.hostRequestedSub.indexOf(player.userid);
		if (subIndex !== -1) this.hostRequestedSub.splice(subIndex, 1);

		this.playerCount--;
		this.updateRoleString();
		this.updatePlayers();
		player.updateHtmlRoom();
	}

	/**
	 * @param {User} user
	 * @param {string} toRevive
	 * @param {boolean} force
	 * @return {void}
	 */
	revive(user, toRevive, force = false) {
		if (this.phase === 'IDEApicking') return user.sendTo(this.room, `|error|You cannot add or remove players while IDEA roles are being picked.`);
		if (toRevive in this.players) {
			user.sendTo(this.room, `|error|The user ${toRevive} is already a living player.`);
			return;
		}
		if (toRevive in this.dead) {
			const deadPlayer = this.dead[toRevive];
			if (deadPlayer.treestump) deadPlayer.treestump = false;
			if (deadPlayer.restless) deadPlayer.restless = false;
			this.sendRoom(`${deadPlayer.safeName} was revived!`, {declare: true});
			this.players[deadPlayer.userid] = deadPlayer;
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
			delete this.dead[deadPlayer.userid];
		} else {
			const targetUser = Users(toRevive);
			if (!targetUser) return;
			const canJoin = this.canJoin(targetUser, false, force);
			if (canJoin) {
				user.sendTo(this.room, `|error|${canJoin}`);
				return;
			}
			let player = this.makePlayer(targetUser);
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
			if (this.subs.includes(targetUser.userid)) this.subs.splice(this.subs.indexOf(targetUser.userid), 1);
			this.players[targetUser.userid] = player;
			this.sendRoom(`${Chat.escapeHTML(targetUser.name)} has been added to the game by ${Chat.escapeHTML(user.name)}!`, {declare: true});
		}
		this.playerCount++;
		this.updateRoleString();
		this.updatePlayers();
	}

	/**
	 * @param {number} minutes
	 * @param {boolean} silent
	 */
	setDeadline(minutes, silent = false) {
		if (isNaN(minutes)) return;
		if (!minutes) {
			if (!this.timer) return;
			clearTimeout(this.timer);
			this.timer = null;
			this.dlAt = 0;
			if (!silent) this.sendRoom(`The deadline has been cleared.`);
			return;
		}
		if (minutes < 1 || minutes > 20) return;
		if (this.timer) clearTimeout(this.timer);
		this.dlAt = Date.now() + (minutes * 60000);
		if (minutes > 3) {
			this.timer = setTimeout(() => {
				this.sendRoom(`3 minutes left!`);
				this.timer = setTimeout(() => {
					this.sendRoom(`1 minute left!`);
					this.timer = setTimeout(() => {
						this.sendRoom(`Time is up!`);
						this.night();
					}, 60000);
				}, 2 * 60000);
			}, (minutes - 3) * 60000);
		} else if (minutes > 1) {
			this.timer = setTimeout(() => {
				this.sendRoom(`1 minute left!`);
				this.timer = setTimeout(() => {
					this.sendRoom(`Time is up!`);
					if (this.phase === 'day') this.night();
				}, 60000);
			}, (minutes - 1) * 60000);
		} else {
			this.timer = setTimeout(() => {
				this.sendRoom(`Time is up!`);
				if (this.phase === 'day') this.night();
			}, minutes * 60000);
		}
		this.sendRoom(`The deadline has been set for ${minutes} minute${minutes === 1 ? '' : 's'}.`);
	}

	/**
	 * @param {string} player
	 * @param {string} replacement
	 * @return {void}
	 */
	sub(player, replacement) {
		let oldPlayer = this.players[player];
		if (!oldPlayer) return; // should never happen
		if (oldPlayer.lynching) this.unlynch(oldPlayer.userid, true);

		const newUser = Users(replacement);
		if (!newUser) return; // should never happen
		let newPlayer = this.makePlayer(newUser);
		newPlayer.role = oldPlayer.role;
		newPlayer.IDEA = oldPlayer.IDEA;
		this.players[newPlayer.userid] = newPlayer;
		this.players[oldPlayer.userid].destroy();
		delete this.players[oldPlayer.userid];
		// Transfer lynches on the old player to the new one
		if (this.lynches[oldPlayer.userid]) {
			this.lynches[newPlayer.userid] = this.lynches[oldPlayer.userid];
			delete this.lynches[oldPlayer.userid];
			for (let p in this.players) {
				if (this.players[p].lynching === oldPlayer.userid) this.players[p].lynching = newPlayer.userid;
			}
			for (let p in this.dead) {
				if (this.dead[p].restless && this.dead[p].lynching === oldPlayer.userid) this.dead[p].lynching = newPlayer.userid;
			}
		}
		if (newUser && newUser.connected) {
			// @ts-ignore "Chat.pages" is possibly undefined
			newUser.send(`>view-mafia-${this.room.id}\n|init|html\n${Chat.pages.mafia([this.room.id], newUser)}`);
			newUser.send(`>${this.room.id}\n|notify|You have been substituted in the mafia game for ${oldPlayer.safeName}.`);
		}
		if (this.started) this.played.push(newPlayer.userid);
		this.sendRoom(`${oldPlayer.safeName} has been subbed out. ${newPlayer.safeName} has joined the game.`, {declare: true});
		this.updatePlayers();

		if (this.room.id === 'mafia' && this.started) {
			const month = new Date().toLocaleString("en-us", {month: "numeric", year: "numeric"});
			if (!logs.leavers[month]) logs.leavers[month] = {};
			if (!logs.leavers[month][player]) logs.leavers[month][player] = 0;
			logs.leavers[month][player]++;
			writeFile(LOGS_FILE, logs);
		}
	}

	/**
	 * @param {string?} userid
	 * @return {void}
	 */
	nextSub(userid = null) {
		if (!this.subs.length || (!this.hostRequestedSub.length && ((!this.requestedSub.length || !this.autoSub)) && !userid)) return;
		const nextSub = this.subs.shift();
		if (!nextSub) return;
		const sub = Users(nextSub, true);
		if (!sub || !sub.connected || !sub.named || !this.room.users[sub.userid]) return; // should never happen, just to be safe
		const toSubOut = userid || this.hostRequestedSub.shift() || this.requestedSub.shift();
		if (!toSubOut) {
			// Should never happen
			this.subs.unshift(nextSub);
			return;
		}
		if (this.hostRequestedSub.includes(toSubOut)) this.hostRequestedSub.splice(this.hostRequestedSub.indexOf(toSubOut), 1);
		if (this.requestedSub.includes(toSubOut)) this.requestedSub.splice(this.requestedSub.indexOf(toSubOut), 1);
		this.sub(toSubOut, sub.userid);
	}

	/**
	 *
	 * @param {User} user
	 * @param {string} moduleName
	 */
	ideaInit(user, moduleName) {
		this.originalRoles = [];
		this.originalRoleString = '';
		this.roles = [];
		this.roleString = '';

		this.IDEA.data = MafiaData.IDEAs[moduleName];
		if (typeof this.IDEA.data === 'string') this.IDEA.data = MafiaData.IDEAs[this.IDEA.data];
		if (!this.IDEA.data) return user.sendTo(this.room, `|error|${moduleName} is not a valid IDEA.`);
		if (typeof this.IDEA.data !== 'object') return this.sendRoom(`Invalid alias for IDEA ${moduleName}. Please report this to .`);
		return this.ideaDistributeRoles(user);
	}

	/**
	 *
	 * @param {User} user
	 */
	ideaDistributeRoles(user) {
		if (!this.IDEA.data) return user.sendTo(this.room, `|error|No IDEA module loaded`);
		if (this.phase !== 'locked' && this.phase !== 'IDEAlocked') return user.sendTo(this.room, `|error|The game must be in a locked state to distribute IDEA roles.`);

		const neededRoles = this.IDEA.data.choices * this.playerCount;
		if (neededRoles > this.IDEA.data.roles.length) return user.sendTo(this.room, `|error|Not enough roles in the IDEA module.`);

		let roles = [];
		let selectedIndexes = [];
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
		for (const p in this.players) {
			const player = this.players[p];
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
			const u = Users(p);
			// @ts-ignore guaranteed at this point
			if (u && u.connected) u.send(`>${this.room.id}\n|notify|Pick your role in the IDEA module.`);
		}

		this.phase = 'IDEApicking';
		this.updatePlayers();

		this.sendRoom(`${this.IDEA.data.name} roles have been distributed. You will have ${IDEA_TIMER / 1000} seconds to make your picks.`, {declare: true});
		this.IDEA.timer = setTimeout(() => { this.ideaFinalizePicks(); }, IDEA_TIMER);

		return ``;
	}

	/**
	 *
	 * @param {User} user
	 * @param {string[]} selection
	 */
	ideaPick(user, selection) {
		let buf = '';
		if (this.phase !== 'IDEApicking') return 'The game is not in the IDEA picking phase.';
		if (!this.IDEA || !this.IDEA.data) return this.sendRoom(`Trying to pick an IDEA role with no module running, target: ${JSON.stringify(selection)}. Please report this to a mod.`);
		const player = this.players[user.userid];
		if (!player.IDEA) return this.sendRoom(`Trying to pick an IDEA role with no player IDEA object, user: ${user.userid}. Please report this to a mod.`);
		selection = selection.map(toId);
		if (selection.length === 1 && this.IDEA.data.picks.length === 1) selection = [this.IDEA.data.picks[0], selection[0]];
		if (selection.length !== 2) return user.sendTo(this.room, `|error|Invalid selection.`);

		// input is formatted as ['selection', 'role']
		// eg: ['role', 'bloodhound']
		// ['alignment', 'alien']
		// ['selection', ''] deselects
		if (selection[1]) {
			const roleIndex = player.IDEA.choices.map(toId).indexOf(selection[1]);
			if (roleIndex === -1) return user.sendTo(this.room, `|error|${selection[1]} is not an available role, perhaps it is already selected?`);
			selection[1] = player.IDEA.choices.splice(roleIndex, 1)[0];
		} else {
			selection[1] = '';
		}

		if (player.IDEA.picks[selection[0]]) {
			buf += `You have deselected ${player.IDEA.picks[selection[0]]}. `;
			player.IDEA.choices.push(player.IDEA.picks[selection[0]]);
		}

		if (player.IDEA.picks[selection[0]] && !selection[1]) {
			this.IDEA.waitingPick.push(player.userid);
		} else if (!player.IDEA.picks[selection[0]] && selection[1]) {
			this.IDEA.waitingPick.splice(this.IDEA.waitingPick.indexOf(player.userid), 1);
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
		let randed = [];
		for (const p in this.players) {
			const player = this.players[p];
			if (!player.IDEA) return this.sendRoom(`Trying to pick an IDEA role with no player IDEA object, user: ${player.userid}. Please report this to a mod.`);
			let randPicked = false;
			let role = [];
			for (const choice of this.IDEA.data.picks) {
				if (!player.IDEA.picks[choice]) {
					randPicked = true;
					player.IDEA.picks[choice] = player.IDEA.choices.shift();
					this.sendUser(player.userid, `You were randomly assigned ${choice}: ${player.IDEA.picks[choice]}`);
				}
				role.push(`${choice}: ${player.IDEA.picks[choice]}`);
			}
			if (randPicked) randed.push(p);
			// if there's only one option, it's their role, parse it properly
			let roleName = '';
			if (this.IDEA.data.picks.length === 1) {
				const role = parseRole(player.IDEA.picks[this.IDEA.data.picks[0]]);
				player.role = role.role;
				if (role.problems.length) this.sendRoom(`Problems found when parsing IDEA role ${player.IDEA.picks[this.IDEA.data.picks[0]]}. Please report this to a mod.`);
			} else {
				roleName = role.join('; ');
				player.role = {
					name: roleName,
					safeName: Chat.escapeHTML(roleName),
					id: toId(roleName),
					alignment: 'solo',
					memo: [`(Your role was set from an IDEA.)`],
					image: '',
				};
			}
		}
		this.IDEA.discardsHtml = `<b>Discards:</b><br />`;
		for (const p of Object.keys(this.players).sort()) {
			const IDEA = this.players[p].IDEA;
			if (!IDEA) return this.sendRoom(`No IDEA data for player ${p} when finalising IDEAs. Please report this to a mod.`);
			this.IDEA.discardsHtml += `<b>${this.players[p].safeName}:</b> ${IDEA.choices.join(', ')}<br />`;
		}

		this.phase = 'IDEAlocked';
		if (randed.length) this.sendRoom(`${randed.join(', ')} did not pick a role in time and were randomly assigned one.`, {declare: true});
		this.sendRoom(`IDEA picks are locked!`, {declare: true});
		this.sendRoom(`To start, use /mafia start, or to reroll use /mafia ideareroll`);
		this.updatePlayers();
	}

	/**
	 * @return {void}
	 */
	sendPlayerList() {
		this.room.add(`|c:|${(Math.floor(Date.now() / 1000))}|~|**Players (${this.playerCount})**: ${Object.keys(this.players).map(p => this.players[p].name).join(', ')}`).update();
	}

	/**
	 * @return {void}
	 */
	updatePlayers() {
		for (const p in this.players) {
			this.players[p].updateHtmlRoom();
		}
		for (const p in this.dead) {
			if (this.dead[p].restless || this.dead[p].treestump) this.dead[p].updateHtmlRoom();
		}
		// Now do the host
		this.updateHost();
	}

	/**
	 * @return {void}
	 */
	updateHost() {
		const host = Users(this.hostid);
		if (!host || !host.connected) return;
		if (this.ended) return host.send(`>view-mafia-${this.room.id}\n|deinit`);
		// @ts-ignore "Chat.pages" is possibly undefined
		const buf = Chat.pages.mafia([this.room.id], host);
		host.send(`>view-mafia-${this.room.id}\n|init|html\n${buf}`);
	}

	/**
	 * @return {void}
	 */
	updateRoleString() {
		this.roleString = this.roles.slice().map(r => `<span style="font-weight:bold;color:${MafiaData.alignments[r.alignment].color || '#FFF'}">${r.safeName}</span>`).join(', ');
	}

	/**
	 * @param {string} message
	 * @param {{uhtml?: boolean, declare?: boolean, timestamp?: boolean}} options
	 * @return {void}
	 */
	sendRoom(message, options = {}) {
		if (options.uhtml) return this.room.add(`|uhtml|mafia|${message}`).update();
		if (options.declare) return this.room.add(`|raw|<div class="broadcast-blue">${message}</div>`).update();
		if (options.timestamp) return this.room.add(`|c:|${(Math.floor(Date.now() / 1000))}|~|${message}`).update();
		return this.room.add(message).update();
	}

	/**
	 * @return {string}
	 */
	roomWindow() {
		if (this.ended) return `<div class="infobox">The game of ${this.title} has ended.</div>`;
		let output = `<div class="broadcast-blue">`;
		if (this.phase === 'signups') {
			output += `<h2 style="text-align: center">A game of ${this.title} was created</h2><p style="text-align: center"><button class="button" name="send" value="/mafia join">Join the game</button> <button class="button" name="send" value="/join view-mafia-${this.room.id}">Spectate the game</button> <button class="button" name="send" value="/help mafia">Mafia Commands</button></p>`;
		} else {
			output += `<p style="font-weight: bold">A game of ${this.title} is in progress.</p><p><button class="button" name="send" value="/mafia sub ${this.room.id}, in">Become a substitute</button> <button class="button" name="send" value="/join view-mafia-${this.room.id}">Spectate the game</button> <button class="button" name="send" value="/help mafia">Mafia Commands</button></p>`;
		}
		output += `</div>`;
		return output;
	}

	/**
	 * @param {User} user
	 * @param {boolean} self
	 * @param {boolean} force
	 */
	canJoin(user, self = false, force = false) {
		if (!user || !user.connected) return `User not found.`;
		const targetString = self ? `You are` : `${user.userid} is`;
		if (!this.room.users[user.userid]) return `${targetString} not in the room.`;
		if (this.players[user.userid]) return `${targetString} already in the game.`;
		if (this.hostid === user.userid) return `${targetString} the host.`;
		if (!force) {
			for (const alt of user.getAltUsers(true)) {
				if (this.players[alt.userid]) return `${self ? `You already have` : `${user.userid} already has`} an alt in the game.`;
				if (this.hostid === alt.userid) return `${self ? `You have` : `${user.userid} has`} an alt as the game host.`;
			}
		}
		return false;
	}

	/**
	 * @param {User | string | null} user
	 * @param {string} message
	 */
	sendUser(user, message) {
		const userObject = (typeof user === 'string' ? Users(user) : user);
		if (!userObject || !userObject.connected) return;
		userObject.sendTo(this.room, message);
	}

	/**
	 * @param {User} user
	 * @param {boolean | 'hammer'} setting
	 */
	setSelfLynch(user, setting) {
		const from = this.selfEnabled;
		if (from === setting) return user.sendTo(this.room, `|error|Selflynching is already ${setting ? `set to Self${setting === 'hammer' ? 'hammering' : 'lynching'}` : 'disabled'}.`);
		if (from) {
			this.sendRoom(`Self${from === 'hammer' ? 'hammering' : 'lynching'} has been ${setting ? `changed to Self${setting === 'hammer' ? 'hammering' : 'lynching'}` : 'disabled'}.`, {declare: true});
		} else {
			this.sendRoom(`Self${setting === 'hammer' ? 'hammering' : 'lynching'} has been ${setting ? 'enabled' : 'disabled'}.`, {declare: true});
		}
		this.selfEnabled = setting;
		if (!setting) {
			for (const player of Object.values(this.players)) {
				if (player.lynching === player.userid) this.unlynch(player.userid, true);
			}
		}
		this.updatePlayers();
	}
	/**
	 * @param {User} user
	 * @param {boolean} setting
	 */
	setNoLynch(user, setting) {
		if (this.enableNL === setting) return user.sendTo(this.room, `|error|No Lynch is already ${setting ? 'enabled' : 'disabled'}.`);
		this.enableNL = setting;
		this.sendRoom(`No Lynch has been ${setting ? 'enabled' : 'disabled'}.`, {declare: true});
		if (!setting) this.clearLynches('nolynch');
		this.updatePlayers();
	}
	/**
	 * @param {string} target
	 */
	clearLynches(target = '') {
		if (target) delete this.lynches[target];
		for (const player of Object.values(this.players)) {
			if (!target || (player.lynching === target)) player.lynching = '';
		}
		for (const player of Object.values(this.dead)) {
			if (player.restless && (!target || player.lynching === target)) player.lynching = '';
		}
		this.hasPlurality = null;
	}

	/**
	 * @param {string} message
	 * @param {User} user
	 * @return {(string | false)}
	 */
	onChatMessage(message, user) {
		const subIndex = this.hostRequestedSub.indexOf(user.userid);
		if (subIndex !== -1) {
			this.hostRequestedSub.splice(subIndex, 1);
			this.sendUser(this.hostid, `${user.userid} has spoken and been removed from the host sublist.`);
		}

		if (user.isStaff || (this.room.auth && this.room.auth[user.userid] && this.room.auth[user.userid] !== '+') || this.hostid === user.userid || !this.started) return false;
		if (!this.players[user.userid] && (!this.dead[user.userid] || !this.dead[user.userid].treestump)) return `You cannot talk while a game of ${this.title} is going on.`;
		if (this.phase === 'night') return `You cannot talk at night.`;
		return false;
	}

	/**
	 * @param {User} user
	 * @return {void}
	 */
	onConnect(user) {
		user.sendTo(this.room, `|uhtml|mafia|${this.roomWindow()}`);
	}

	/**
	 * @param {User} user
	 * @return {void}
	 */
	onJoin(user) {
		if (user.userid in this.players) {
			return this.players[user.userid].updateHtmlRoom();
		}
		if (user.userid === this.hostid) return this.updateHost();
	}

	/**
	 * @param {User} user
	 * @return {void}
	 */
	onLeave(user) {
		if (this.subs.includes(user.userid)) this.subs.splice(this.subs.indexOf(user.userid), 1);
	}

	/**
	 * @param {User} user
	 * @return {void}
	 */
	removeBannedUser(user) {
		// Player was banned, attempt to sub now
		// If we can't sub now, make subbing them out the top priority
		if (!(user.userid in this.players)) return;
		this.requestedSub.unshift(user.userid);
		this.nextSub();
	}

	/**
	 * @param {User} user
	 * @return {void}
	 */
	forfeit(user) {
		// Add the player to the sub list.
		if (!(user.userid in this.players)) return;
		this.requestedSub.push(user.userid);
		this.nextSub();
	}

	/**
	 * @return {void}
	 */
	end() {
		this.ended = true;
		this.sendRoom(this.roomWindow(), {uhtml: true});
		this.updatePlayers();
		if (this.room.id === 'mafia' && this.started) {
			// Intead of using this.played, which shows players who have subbed out as well
			// We check who played through to the end when recording playlogs
			const played = Object.keys(this.players).concat(Object.keys(this.dead));
			const month = new Date().toLocaleString("en-us", {month: "numeric", year: "numeric"});
			if (!logs.plays[month]) logs.plays[month] = {};
			for (const player of played) {
				if (!logs.plays[month][player]) logs.plays[month][player] = 0;
				logs.plays[month][player]++;
			}
			if (!logs.hosts[month]) logs.hosts[month] = {};
			if (!logs.hosts[month][this.hostid]) logs.hosts[month][this.hostid] = 0;
			logs.hosts[month][this.hostid]++;
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
		this.room = /** @type {any} */ (null);
		for (let i in this.players) {
			this.players[i].destroy();
		}
		for (let i in this.dead) {
			this.dead[i].destroy();
		}
	}
}
/** @typedef {(query: string[], user: User, connection: Connection) => (string | null | void)} PageHandler */
/** @typedef {{[k: string]: PageHandler | PageTable}} PageTable */

/** @type {PageTable} */
const pages = {
	mafia: function (query, user) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		if (!query.length) return `|deinit`;
		let roomid = query.shift();
		if (roomid === 'groupchat') roomid += `-${query.shift()}-${query.shift()}`;
		const room = /** @type {ChatRoom} */ (Rooms(roomid));
		if (!room || !room.users[user.userid] || !room.game || room.game.gameid !== 'mafia' || room.game.ended) return `|deinit`;
		const game = /** @type {MafiaTracker} */ (room.game);
		const isPlayer = user.userid in game.players;
		const isHost = user.userid === game.hostid;
		let buf = `|title|${game.title}\n|pagehtml|<div class="pad broadcast-blue">`;
		buf += `<button class="button" name="send" value="/join view-mafia-${room.id}" style="float:left"><i class="fa fa-refresh"></i> Refresh</button>`;
		buf += `<br/><br/><h1 style="text-align:center;">${game.title}</h1><h3>Host: ${game.host}</h3>`;
		buf += `<p style="font-weight:bold;">Players (${game.playerCount}): ${Object.keys(game.players).sort().map(p => game.players[p].safeName).join(', ')}</p><hr/>`;
		if (isPlayer && game.phase === 'IDEApicking') {
			buf += `<p><b>IDEA information:</b><br />`;
			const IDEA = game.players[user.userid].IDEA;
			if (!IDEA) return game.sendRoom(`IDEA picking phase but no IDEA object for user: ${user.userid}. Please report this to a mod.`);
			for (const pick of Object.keys(IDEA.picks)) {
				buf += `<b>${pick}:</b> `;
				if (!IDEA.picks[pick]) {
					buf += `<button class="button disabled" style="font-weight:bold; color:#575757; font-weight:bold; background-color:#d3d3d3;">clear</button>`;
				} else {
					buf += `<button class="button" name="send" value="/mafia ideapick ${roomid}, ${pick},">clear</button>`;
				}
				const selectedIndex = IDEA.picks[pick] ? IDEA.originalChoices.indexOf(IDEA.picks[pick]) : -1;
				for (let i = 0; i < IDEA.originalChoices.length; i++) {
					const choice = IDEA.originalChoices[i];
					if (i === selectedIndex) {
						buf += `<button class="button disabled" style="font-weight:bold; color:#575757; font-weight:bold; background-color:#d3d3d3;">${choice}</button>`;
					} else {
						buf += `<button class="button" name="send" value="/mafia ideapick ${roomid}, ${pick}, ${choice}">${choice}</button>`;
					}
				}
				buf += `<br />`;
			}
			buf += `</p>`;
			buf += `<p><details><summary class="button" style="display:inline-block"><b>Role details:</b></summary><p>`;
			for (const role of IDEA.originalChoices) {
				const roleObject = parseRole(role).role;
				buf += `<details><summary>${role}</summary>`;
				buf += `<table><tr><td style="text-align:center;"><td style="text-align:left;width:100%"><ul>${roleObject.memo.map(m => `<li>${m}</li>`).join('')}</ul></td></tr></table>`;
				buf += `</details>`;
			}
			buf += `</p></details></p>`;
		}
		if (game.IDEA.data) {
			buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">${game.IDEA.data.name} information</summary>`;
			if (game.IDEA.discardsHtml) buf += `<details><summary class="button" style="text-align:left; display:inline-block">Discards:</summary><p>${game.IDEA.discardsHtml}</p></details>`;
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
			const role = game.players[user.userid].role;
			if (role) {
				buf += `<h3>${game.players[user.userid].safeName}, you are a ${game.players[user.userid].getRole()}</h3>`;
				buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">Role Details</summary>`;
				buf += `<table><tr><td style="text-align:center;">${role.image || `<img width="75" height="75" src="//play.pokemonshowdown.com/fx/mafia-villager.png"/>`}</td><td style="text-align:left;width:100%"><ul>${role.memo.map(m => `<li>${m}</li>`).join('')}</ul></td></tr></table>`;
				if (!['town', 'solo'].includes(role.alignment)) buf += `<p><span style="font-weight:bold">Partners</span>: ${game.getPartners(role.alignment, game.players[user.userid])}</p>`;
				buf += `</details></p>`;
			}
		}
		if (game.phase === "day") {
			buf += `<h3>Lynches (Hammer: ${game.hammerCount}) <button class="button" name="send" value="/join view-mafia-${room.id}"><i class="fa fa-refresh"></i> Refresh</button></h3>`;
			let plur = game.getPlurality();
			for (const key of Object.keys(game.players).concat((game.enableNL ? ['nolynch'] : []))) {
				if (game.lynches[key]) {
					buf += `<p style="font-weight:bold">${game.lynches[key].count}${plur === key ? '*' : ''} ${game.players[key] ? game.players[key].safeName : 'No Lynch'} (${game.lynches[key].lynchers.map(a => game.players[a] ? game.players[a].safeName : a).join(', ')}) `;
				} else {
					buf += `<p style="font-weight:bold">0 ${game.players[key] ? game.players[key].safeName : 'No Lynch'} `;
				}
				const isSpirit = (game.dead[user.userid] && game.dead[user.userid].restless);
				if (isPlayer || isSpirit) {
					if (isPlayer && game.players[user.userid].lynching === key || isSpirit && game.dead[user.userid].lynching === key) {
						buf += `<button class="button" name="send" value="/mafia unlynch ${room.id}">Unlynch ${game.players[key] ? game.players[key].safeName : 'No Lynch'}</button>`;
					} else if ((game.selfEnabled && !isSpirit) || user.userid !== key) {
						buf += `<button class="button" name="send" value="/mafia lynch ${room.id}, ${key}">Lynch ${game.players[key] ? game.players[key].safeName : 'No Lynch'}</button>`;
					}
				}
				buf += `</p>`;
			}
		} else if (game.phase === "night" && isPlayer) {
			buf += `<p style="font-weight:bold;">PM the host (${game.host}) the action you want to use tonight, and who you want to use it on. Or PM the host "idle".</p>`;
		}
		if (isHost) {
			buf += `<h3>Host options</h3>`;
			buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">General Options</summary>`;
			buf += `<h3>General Options</h3>`;
			if (!game.started) {
				buf += `<button class="button" name="send" value="/mafia closedsetup ${room.id}, ${game.closedSetup ? 'off' : 'on'}">${game.closedSetup ? 'Disable' : 'Enable'} Closed Setup</button>`;
				if (game.phase === 'locked' || game.phase === 'IDEAlocked') {
					buf += ` <button class="button" name="send" value="/mafia start ${room.id}">Start Game</button>`;
				} else {
					buf += ` <button class="button" name="send" value="/mafia close ${room.id}">Close Signups</button>`;
				}
			} else if (game.phase === 'day') {
				buf += `<button class="button" name="send" value="/mafia night ${room.id}">Go to Night ${game.dayNum}</button>`;
			} else if (game.phase === 'night') {
				buf += `<button class="button" name="send" value="/mafia day ${room.id}">Go to Day ${game.dayNum + 1}</button> <button class="button" name="send" value="/mafia extend ${room.id}">Return to Day ${game.dayNum}</button>`;
			}
			buf += ` <button class="button" name="send" value="/mafia selflynch ${room.id}, ${game.selfEnabled === true ? 'off' : 'on'}">${game.selfEnabled === true ? 'Disable' : 'Enable'} self lynching</button> <button class="button" name="send" value="/mafia ${game.enableNL ? 'disable' : 'enable'}nl ${room.id}">${game.enableNL ? 'Disable' : 'Enable'} No Lynch</button> <button class="button" name="send" value="/mafia reveal ${room.id}, ${game.noReveal ? 'on' : 'off'}">${game.noReveal ? 'Enable' : 'Disable'} revealing of roles</button> <button class="button" name="send" value="/mafia autosub ${room.id}, ${game.autoSub ? 'off' : 'on'}">${game.autoSub ? "Disable" : "Enable"} automatic subbing of players</button> <button class="button" name="send" value="/mafia end ${room.id}">End Game</button>`;
			buf += `<p>To set a deadline, use <strong>/mafia deadline [minutes]</strong>.<br />To clear the deadline use <strong>/mafia deadline off</strong>.</p><hr/></details></p>`;
			buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">Player Options</summary>`;
			buf += `<h3>Player Options</h3>`;
			for (let p in game.players) {
				let player = game.players[p];
				buf += `<p style="font-weight:bold;">${player.safeName} (${player.role ? player.getRole() : ''}): <button class="button" name="send" value="/mafia kill ${room.id}, ${player.userid}">Kill</button> <button class="button" name="send" value="/mafia treestump ${room.id}, ${player.userid}">Make a Treestump (Kill)</button> <button class="button" name="send" value="/mafia spirit ${room.id}, ${player.userid}">Make a Restless Spirit (Kill)</button> <button class="button" name="send" value="/mafia spiritstump ${room.id}, ${player.userid}">Make a Restless Treestump (Kill)</button> <button class="button" name="send" value="/mafia sub ${room.id}, next, ${player.userid}">Force sub</button></p>`;
			}
			for (let d in game.dead) {
				let dead = game.dead[d];
				buf += `<p style="font-weight:bold;">${dead.safeName} (${dead.role ? dead.getRole() : ''})`;
				if (dead.treestump) buf += ` (is a Treestump)`;
				if (dead.restless) buf += ` (is a Restless Spirit)`;
				buf += `: <button class="button" name="send" value="/mafia revive ${room.id}, ${dead.userid}">Revive</button></p>`;
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
					buf += `<p><button class="button" name="send" value="/mafia leave ${room.id}">Leave game</button></p>`;
				} else {
					buf += `<p><button class="button" name="send" value="/mafia join ${room.id}">Join game</button></p>`;
				}
			} else if ((!isPlayer && game.subs.includes(user.userid)) || (isPlayer && !game.requestedSub.includes(user.userid))) {
				buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">${isPlayer ? 'Request to be subbed out' : 'Cancel sub request'}</summary><button class="button" name="send" value="/mafia sub ${room.id}, out">${isPlayer ? 'Confirm request to be subbed out' : 'Confirm cancelation of sub request'}</button></details></p>`;
			} else {
				buf += `<p><details><summary class="button" style="text-align:left; display:inline-block">${isPlayer ? 'Cancel sub request' : 'Join the game as a sub'}</summary><button class="button" name="send" value="/mafia sub ${room.id}, in">${isPlayer ? 'Confirm cancelation of sub request' : 'Confirm that you want to join the game'}</button></details></p>`;
			}
		}
		buf += `</div>`;
		return buf;
	},
	mafialadder: function (query, user) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		if (!query.length || !Rooms('mafia')) return `|deinit`;
		const headers = {
			leaderboard: {title: 'Leaderboard', type: 'Points', section: 'leaderboard'},
			mvpladder: {title: 'MVP Ladder', type: 'MVPs', section: 'mvps'},
			hostlogs: {title: 'Host Logs', type: 'Hosts', section: 'hosts'},
			playlogs: {title: 'Play Logs', type: 'Plays', section: 'plays'},
			leaverlogs: {title: 'Leaver Logs', type: 'Leavers', section: 'leavers'},
		};
		let date = new Date();
		if (query[1] === 'prev') date.setMonth(date.getMonth() - 1);
		const month = date.toLocaleString("en-us", {month: "numeric", year: "numeric"});
		const ladder = headers[query[0]];
		if (!ladder) return `|deinit`;
		const mafiaRoom = /** @type {ChatRoom?} */ (Rooms('mafia'));
		if (['hosts', 'plays', 'leavers'].includes(ladder.section) && !user.can('mute', null, mafiaRoom)) return `|deinit`;
		let buf = `|title|Mafia ${ladder.title} (${date.toLocaleString("en-us", {month: 'long'})} ${date.getFullYear()})\n|pagehtml|<div class="pad ladder">${query[1] === 'prev' ? '' : `<button class="button" name="send" value="/join view-mafialadder-${query[0]}" style="float:left"><i class="fa fa-refresh"></i> Refresh</button> <button class="button" name="send" value="/join view-mafialadder-${query[0]}-prev" style="float:left">View last month's ${ladder.title}</button>`}<br /><br />`;
		/** @type {MafiaLogSection} */
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
/** @typedef {(this: CommandContext, target: string, room: ChatRoom | GameRoom, user: User, connection: Connection, cmd: string, message: string) => (void)} ChatHandler */
/** @typedef {{[k: string]: ChatHandler | string | true | string[] | ChatCommands}} ChatCommands */

/** @type {ChatCommands} */
const commands = {
	mafia: {
		'': function (target, room, user) {
			const game = /** @type {MafiaTracker?} */ (room.game);
			if (game && game.gameid === 'mafia') {
				if (!this.runBroadcast()) return;
				return this.sendReply(`|html|${game.roomWindow()}`);
			}
			return this.parse('/help mafia');
		},

		forcehost: 'host',
		nexthost: 'host',
		host: function (target, room, user, connection, cmd) {
			if (!room.mafiaEnabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (!this.canTalk()) return;
			if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
			if (room.game) return this.errorReply(`There is already a game of ${room.game.title} in progress in this room.`);
			if (!user.can('broadcast', null, room)) return this.errorReply(`/mafia ${cmd} - Access denied.`);
			if ((cmd === 'nexthost' || cmd === 'forcehost') && room.id !== 'mafia') return this.errorReply(`/mafia ${cmd} - This command is only meant to be used in the Mafia room.`);
			let toHost = cmd === 'nexthost' ? hostQueue.shift() : target;
			if (!toHost) {
				if (cmd === 'nexthost') return this.errorReply(`The host queue is empty.`);
				return this.parse('/help mafia host');
			}
			if (cmd === 'nexthost') {
				this.splitTarget(toHost, false);
				let skipped = [];
				while (!this.targetUser || !this.targetUser.connected || !room.users[this.targetUser.userid] || isHostBanned(this.targetUser.userid)) {
					skipped.push(toId(toHost));
					toHost = hostQueue.shift();
					if (!toHost) {
						if (skipped.length) this.sendReply(`${skipped.join(', ')} were not online, not in the room, or are host banned and were removed from the host queue.`);
						return this.errorReply(`Nobody on the host queue could be hosted.`);
					}
					this.splitTarget(toHost, false);
				}
				if (skipped.length) this.sendReply(`${skipped.join(', ')} were not online, not in the room, or are host banned and were removed from the host queue.`);
			} else {
				this.splitTarget(toHost, false);
				if (!this.targetUser || !this.targetUser.connected) return this.errorReply(`The user "${this.targetUsername}" was not found.`);
				if (!room.users[this.targetUser.userid]) return this.errorReply(`${this.targetUser.name} is not in this room, and cannot be hosted.`);
				if (isHostBanned(this.targetUser.userid)) return this.errorReply(`${this.targetUser.name} is banned from hosting games.`);
				if (hostQueue[0] && this.targetUser.userid !== hostQueue[0] && cmd !== 'forcehost') return this.errorReply(`${this.targetUser.name} is not next on the host queue. To host them now anyways, use /mafia forcehost ${this.targetUser.userid}`);
			}
			let targetUser = this.targetUser;

			room.game = new MafiaTracker(room, targetUser);

			const queueIndex = hostQueue.indexOf(targetUser.userid);
			if (queueIndex > -1) hostQueue.splice(queueIndex, 1);
			// @ts-ignore "Chat.pages" is possibly undefined
			targetUser.send(`>view-mafia-${room.id}\n|init|html\n${Chat.pages.mafia([room.id], targetUser)}`);
			this.privateModAction(`(${targetUser.name} was appointed the mafia host by ${user.name}.)`);
			room.addByUser(user, `${targetUser.name} was appointed the mafia host by ${user.name}.`);
			room.add(`|c:|${(Math.floor(Date.now() / 1000))}|~|**Mafiasignup!**`).update();
			this.modlog('MAFIAHOST', targetUser, null, {noalts: true, noip: true});
		},
		hosthelp: [
			`/mafia host [user] - Create a game of Mafia with [user] as the host. Requires + % @ * # & ~`,
			`/mafia nexthost - Host the next user in the host queue. Requires + % @ * # & ~`,
		],

		q: 'queue',
		queue: function (target, room, user) {
			if (!room.mafiaEnabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (room.id !== 'mafia') return this.errorReply(`This command can only be used in the Mafia room.`);
			const args = target.split(',').map(toId);
			if (['forceadd', 'add', 'remove', 'del', 'delete'].includes(args[0])) {
				if (!user.can('broadcast', null, room)) {
					if (args[0] !== 'add' || args[1] !== user.userid) return this.errorReply(`/mafia queue ${args[0]} - Access denied.`);
				}
			} else {
				if (!this.runBroadcast()) return false;
			}
			switch (args[0]) {
			case 'forceadd':
			case 'add':
				if (!this.canTalk()) return;
				let targetUser = Users(args[1]);
				if ((!targetUser || !targetUser.connected) && args[0] !== 'forceadd') return this.errorReply(`User ${args[1]} not found. To forcefully add the user to the queue, use /mafia queue forceadd, ${args[1]}`);
				if (hostQueue.includes(args[1])) return this.errorReply(`User ${args[1]} is already on the host queue.`);
				if (isHostBanned(args[1])) return this.errorReply(`User ${args[1]} is banned from hosting games.`);
				hostQueue.push(args[1]);
				room.add(`User ${args[1]} has been added to the host queue by ${user.name}.`).update();
				break;
			case 'del':
			case 'delete':
			case 'remove':
				let index = hostQueue.indexOf(args[1]);
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
		queueadd: function (target, room, user, connection, cmd) {
			this.parse(`/mafia queue ${cmd.includes('force') ? `forceadd` : `add`}, ${target}`);
		},

		qdel: 'queueremove',
		qdelete: 'queueremove',
		qremove: 'queueremove',
		queueremove: function (target, room, user) {
			this.parse(`/mafia queue remove, ${target}`);
		},

		'!mafjoin': true,
		// Typescript doesn't like "join" as the command name for some reason, so this is a hack to get around that.
		join: 'mafjoin',
		mafjoin: function (target, room, user) {
			let targetRoom = /** @type {ChatRoom} */ (Rooms(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);

			if (!this.canTalk(null, targetRoom)) return;
			game.join(user);
		},
		joinhelp: [`/mafia join - Join the game.`],

		'!leave': true,
		leave: function (target, room, user) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			game.leave(user);
		},
		leavehelp: [`/mafia leave - Leave the game. Can only be done while signups are open.`],

		playercap: function (target, room, user) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (room.game);
			if (!user.can('mute', null, room) && game.hostid !== user.userid) return this.errorReply(`/mafia playercap - Access denied.`);
			if (game.phase !== 'signups') return this.errorReply(`Signups are already closed.`);
			if (toId(target) === 'none') target = '20';
			const num = parseInt(target);
			if (isNaN(num) || num > 20 || num < 2) return this.parse('/help mafia playercap');
			if (num < game.playerCount) return this.errorReply(`Player cap has to be equal or more than the amount of players in game.`);
			if (num === game.playerCap) return this.errorReply(`Player cap is already set at ${game.playerCap}.`);
			game.playerCap = num;
			game.sendRoom(`Player cap has been set to ${game.playerCap}`, {declare: true});
		},
		playercaphelp: [`/mafia playercap [cap|none]- Limit the number of players being able to join the game. Player cap cannot be more than 20 or less than 2. Requires: host % @ # & ~`],

		'!close': true,
		close: function (target, room, user) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!user.can('mute', null, targetRoom) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia close - Access denied.`);
			if (game.phase !== 'signups') return user.sendTo(targetRoom, `|error|Signups are already closed.`);
			if (game.playerCount < 2) return user.sendTo(targetRoom, `|error|You need at least 2 players to start.`);
			game.phase = 'locked';
			game.sendRoom(game.roomWindow(), {uhtml: true});
			game.updatePlayers();
		},
		closehelp: [`/mafia close - Closes signups for the current game. Requires: host % @ * # & ~`],

		'!closedsetup': true,
		cs: 'closedsetup',
		closedsetup: function (target, room, user) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!user.can('mute', null, targetRoom) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia closedsetup - Access denied.`);
			const action = toId(args.join(''));
			if (!['on', 'off'].includes(action)) return this.parse('/help mafia closedsetup');
			if (game.started) return user.sendTo(targetRoom, `|error|You can't ${action === 'on' ? 'enable' : 'disable'} closed setup because the game has already started.`);
			if ((action === 'on' && game.closedSetup) || (action === 'off' && !game.closedSetup)) return user.sendTo(targetRoom, `|error|Closed setup is already ${game.closedSetup ? 'enabled' : 'disabled'}.`);
			game.closedSetup = action === 'on';
			game.updateHost();
		},
		closedsetuphelp: [`/mafia closedsetup [on|off] - Sets if the game is a closed setup. Closed setups don't show the role list to players. Requires host % @ * # & ~`],

		'!reveal': true,
		reveal: function (target, room, user) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!user.can('mute', null, targetRoom) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia reveal - Access denied.`);
			const action = toId(args.join(''));
			if (!['on', 'off'].includes(action)) return this.parse('/help mafia reveal');
			if ((action === 'off' && game.noReveal) || (action === 'on' && !game.noReveal)) return user.sendTo(targetRoom, `|error|Revealing of roles is already ${game.noReveal ? 'disabled' : 'enabled'}.`);
			game.noReveal = action === 'off';
			game.sendRoom(`Revealing of roles has been ${action === 'off' ? 'disabled' : 'enabled'}.`, {declare: true});
			game.updatePlayers();
		},
		revealhelp: [`/mafia reveal [on|off] - Sets if roles reveal on death or not. Requires host % @ * # & ~`],

		forcesetroles: 'setroles',
		setroles: function (target, room, user, connection, cmd) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (room.game);
			if (!user.can('mute', null, room) && game.hostid !== user.userid) return this.errorReply(`/mafia ${cmd} - Access denied.`);
			if (game.phase !== 'locked' && game.phase !== 'IDEAlocked') return this.errorReply(game.phase === 'signups' ? `You need to close signups first.` : `The game has already started.`);
			if (!target) return this.parse('/help mafia setroles');

			game.setRoles(user, target, cmd === 'forcesetroles');
		},
		setroleshelp: [
			`/mafia setroles [comma seperated roles] - Set the roles for a game of mafia. You need to provide one role per player.`,
			`/mafia forcesetroles [comma seperated roles] - Forcibly set the roles for a game of mafia. No role PM information or alignment will be set.`,
		],

		idea: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (room.game);
			if (!user.can('broadcast', null, room) || (!user.can('mute', null, room) && game.hostid !== user.userid)) return this.errorReply(`/mafia idea - Access denied.`);
			if (game.started) return this.errorReply(`You cannot start an IDEA after the game has started.`);
			if (game.phase !== 'locked' && game.phase !== 'IDEAlocked') return this.errorReply(`You need to close the signups first.`);
			game.ideaInit(user, toId(target));
		},
		ideahelp: [
			`/mafia idea [idea] - starts the IDEA module [idea]. Requires + % @ * # & ~, voices can only start for themselves`,
			`/mafia ideareroll - rerolls the IDEA module. Requires host % @ * # & ~`,
			`/mafia ideapick [selection], [role] - selects a role`,
			`/mafia ideadiscards - shows the discarded roles`,
		],

		'!ideapick': true,
		ideapick: function (target, room, user) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!(user.userid in game.players)) return user.sendTo(targetRoom, '|error|You are not a player in the game.');
			if (game.phase !== 'IDEApicking') return user.sendTo(targetRoom, `|error|The game is not in the IDEA picking phase.`);
			game.ideaPick(user, args);
		},

		'!ideareroll': true,
		ideareroll: function (target, room, user) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!user.can('mute', null, targetRoom) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia idereroll - Access denied.`);
			game.ideaDistributeRoles(user);
		},
		idearerollhelp: [`/mafia ideareroll - rerolls the roles for the current IDEA module. Requires host % @ * # & ~`],

		ideadiscards: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (room.game);
			if (!game.IDEA.data) return this.errorReply(`There is no IDEA module in the mafia game.`);
			if (!game.IDEA.discardsHtml) return this.errorReply(`The IDEA module does not have finalised discards yet.`);
			if (!this.runBroadcast()) return;
			this.sendReplyBox(`<details><summary>IDEA discards:</summary>${game.IDEA.discardsHtml}</details>`);
		},

		'!start': true,
		start: function (target, room, user) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!user.can('mute', null, room) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia start - Access denied.`);
			game.start(user);
		},
		starthelp: [`/mafia start - Start the game of mafia. Signups must be closed. Requires host % @ * # & ~`],

		'!day': true,
		extend: 'day',
		night: 'day',
		day: function (target, room, user, connection, cmd) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!user.can('mute', null, room) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia ${cmd} - Access denied.`);
			if (cmd === 'night') {
				game.night();
			} else {
				let extension = parseInt(toId(args.join('')));
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
			`/mafia day - Move to the next game day. Requires host % @ * # & ~`,
			`/mafia night - Move to the next game night. Requires host % @ * # & ~`,
			`/mafia extend (minutes) - Return to the previous game day. If (minutes) is provided, set the deadline for (minutes) minutes. Requires host % @ * # & ~`,
		],

		'!lynch': true,
		l: 'lynch',
		lynch: function (target, room, user) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!this.canTalk(null, targetRoom)) return;
			if (!(user.userid in game.players) && (!(user.userid in game.dead) || !game.dead[user.userid].restless)) return user.sendTo(targetRoom, `|error|You are not in the game of ${game.title}.`);
			game.lynch(user.userid, toId(args.join('')));
		},
		lynchhelp: [`/mafia lynch [player|nolynch] - Vote to lynch the specified player or to not lynch anyone.`],

		'!unlynch': true,
		ul: 'unlynch',
		unl: 'unlynch',
		unnolynch: 'unlynch',
		unlynch: function (target, room, user) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!this.canTalk(null, targetRoom)) return;
			if (!(user.userid in game.players) && (!(user.userid in game.dead) || !game.dead[user.userid].restless)) return user.sendTo(targetRoom, `|error|You are not in the game of ${targetRoom.game.title}.`);
			game.unlynch(user.userid);
		},
		unlynchhelp: [`/mafia unlynch - Withdraw your lynch vote. Fails if your not voting to lynch anyone`],

		nl: 'nolynch',
		nolynch: function () {
			this.parse('/mafia lynch nolynch');
		},

		'!selflynch': true,
		enableself: 'selflynch',
		selflynch: function (target, room, user, connection, cmd) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!user.can('mute', null, room) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia ${cmd} - Access denied.`);
			let action = toId(args.shift());
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
		selflynchhelp: [`/mafia selflynch [on|hammer|off] - Allows players to self lynch themselves either at hammer or anytime. Requires host % @ * # & ~`],

		'!kill': true,
		treestump: 'kill',
		spirit: 'kill',
		spiritstump: 'kill',
		kick: 'kill',
		kill: function (target, room, user, connection, cmd) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!user.can('mute', null, room) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia kill - Access denied.`);
			const player = game.players[toId(args.join(''))];
			if (!player) return user.sendTo(targetRoom, `|error|"${args.join(',')}" is not a living player.`);
			if (game.phase === 'IDEApicking') return this.errorReply(`You cannot add or remove players while IDEA roles are being picked.`); // needs to be here since eliminate doesn't pass the user
			game.eliminate(player, cmd);
		},
		killhelp: [
			`/mafia kill [player] - Kill a player, eliminating them from the game. Requires host % @ * # & ~`,
			`/mafia treestump [player] - Kills a player, but allows them to talk during the day still.`,
			`/mafia spirit [player] - Kills a player, but allows them to vote on the lynch still.`,
			`/mafia spiritstump [player] Kills a player, but allows them to talk during the day, and vote on the lynch.`,
		],

		'!revive': true,
		forceadd: 'revive',
		add: 'revive',
		revive: function (target, room, user, connection, cmd) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!user.can('mute', null, room) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia revive - Access denied.`);
			if (!toId(args.join(''))) return this.parse('/help mafia revive');
			for (const targetUser of args) {
				game.revive(user, toId(targetUser), cmd === 'forceadd');
			}
		},
		revivehelp: [`/mafia revive [player] - Revive a player who died or add a new player to the game. Requires host % @ * # & ~`],

		dl: 'deadline',
		deadline: function (target, room, user) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (room.game);
			target = toId(target);
			if (!user.can('mute', null, room) && game.hostid !== user.userid && target) return this.errorReply(`/mafia deadline - Access denied.`);
			if (target === 'off') {
				return game.setDeadline(0);
			} else {
				const num = parseInt(target);
				if (isNaN(num)) {
					if (game.hostid === user.userid && this.cmdToken === "!") {
						const broadcastMessage = this.message.toLowerCase().replace(/[^a-z0-9\s!,]/g, '');
						if (room && room.lastBroadcast === broadcastMessage &&
							room.lastBroadcastTime >= Date.now() - 20 * 1000) {
							return this.errorReply("You can't broadcast this because it was just broadcasted.");
						}
						this.broadcasting = true;
						this.broadcastMessage = broadcastMessage;
						this.sendReply('|c|' + this.user.getIdentity(this.room.id) + '|' + this.message);
						room.lastBroadcastTime = Date.now();
						room.lastBroadcast = broadcastMessage;
					}
					if (!this.runBroadcast()) return false;
					if ((game.dlAt - Date.now()) > 0) {
						return this.sendReply(`The deadline is in ${Chat.toDurationString(game.dlAt - Date.now()) || '0 seconds'}.`);
					} else {
						return this.parse(`/help mafia deadline`);
					}
				}
				if (num < 1 || num > 20) return this.errorReply(`The deadline must be between 1 and 20 minutes.`);
				return game.setDeadline(num);
			}
		},
		deadlinehelp: [`/mafia deadline [minutes|off] - Sets or removes the deadline for the game. Cannot be more than 20 minutes.`],

		shifthammer: 'hammer',
		resethammer: 'hammer',
		hammer: function (target, room, user, connection, cmd) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (room.game);
			if (!user.can('mute', null, room) && game.hostid !== user.userid) return this.errorReply(`/mafia ${cmd} - Access denied.`);
			if (!game.started) return this.errorReply(`The game has not started yet.`);
			const hammer = parseInt(target);
			if ((isNaN(hammer) || hammer < 1) && cmd.toLowerCase() !== `resethammer`) return this.errorReply(`${target} is not a valid hammer count.`);
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
			`/mafia hammer (hammer) - sets the hammer count to (hammer) and resets lynches`,
			`/mafia shifthammer (hammer) - sets the hammer count to (hammer) without resetting lynches`,
			`/mafia resethammer - sets the hammer to the default, resetting lynches`,
		],

		'!enablenl': true,
		disablenl: 'enablenl',
		enablenl: function (target, room, user, connection, cmd) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!user.can('mute', null, room) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia ${cmd} - Access denied.`);
			if (cmd === 'enablenl') {
				game.setNoLynch(user, true);
			} else {
				game.setNoLynch(user, false);
			}
		},
		enablenlhelp: [`/mafia enablenl OR /mafia disablenl - Allows or disallows players abstain from lynching. Requires host % @ # & ~`],

		lynches: function (target, room, user) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (room.game);
			if (!game.started) return this.errorReply(`The game of mafia has not started yet.`);
			if (game.hostid === user.userid && this.cmdToken === "!") {
				const broadcastMessage = this.message.toLowerCase().replace(/[^a-z0-9\s!,]/g, '');
				if (room && room.lastBroadcast === broadcastMessage &&
					room.lastBroadcastTime >= Date.now() - 20 * 1000) {
					return this.errorReply("You can't broadcast this because it was just broadcasted.");
				}
				this.broadcasting = true;
				this.broadcastMessage = broadcastMessage;
				this.sendReply('|c|' + this.user.getIdentity(this.room.id) + '|' + this.message);
				room.lastBroadcastTime = Date.now();
				room.lastBroadcast = broadcastMessage;
			}
			if (!this.runBroadcast()) return false;

			let buf = `<strong>Lynches (Hammer: ${game.hammerCount})</strong><br />`;
			const plur = game.getPlurality();
			const list = Object.keys(game.lynches).sort((a, b) => {
				if (a === plur) return -1;
				if (b === plur) return 1;
				return game.lynches[b].count - game.lynches[a].count;
			});
			for (const key of list) {
				buf += `${game.lynches[key].count}${plur === key ? '*' : ''} ${game.players[key] ? game.players[key].safeName : 'No Lynch'} (${game.lynches[key].lynchers.map(a => game.players[a] ? game.players[a].safeName : a).join(', ')})<br />`;
			}
			this.sendReplyBox(buf);
		},

		pl: 'players',
		players: function (target, room, user) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (room.game);
			if (game.hostid === user.userid && this.cmdToken === "!") {
				const broadcastMessage = this.message.toLowerCase().replace(/[^a-z0-9\s!,]/g, '');
				if (room && room.lastBroadcast === broadcastMessage &&
					room.lastBroadcastTime >= Date.now() - 20 * 1000) {
					return this.errorReply("You can't broadcast this because it was just broadcasted.");
				}
				this.broadcasting = true;
				this.broadcastMessage = broadcastMessage;
				this.sendReply('|c|' + this.user.getIdentity(this.room.id) + '|' + this.message);
				room.lastBroadcastTime = Date.now();
				room.lastBroadcast = broadcastMessage;
			}
			if (!this.runBroadcast()) return false;

			if (this.broadcasting) {
				game.sendPlayerList();
			} else {
				this.sendReplyBox(`Players (${game.playerCount}): ${Object.keys(game.players).map(p => game.players[p].safeName).join(', ')}`);
			}
		},

		originalrolelist: 'rolelist',
		orl: 'rolelist',
		rl: 'rolelist',
		rolelist: function (target, room, user, connection, cmd) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (room.game);
			if (game.closedSetup) return this.errorReply(`You cannot show roles in a closed setup.`);
			if (!this.runBroadcast()) return false;
			if (game.IDEA.data) {
				let buf = `<details><summary>IDEA roles:</summary>${game.IDEA.data.roles.join(`<br />`)}</details>`;
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

		spectate: 'view',
		view: function (target, room, user, connection) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			if (!this.runBroadcast()) return;
			if (this.broadcasting) return this.sendReplyBox(`<button name="joinRoom" value="view-mafia-${room.id}" class="button"><strong>Spectate the game</strong></button>`);
			return this.parse(`/join view-mafia-${room.id}`);
		},

		'!mafsub': true,
		forcesub: 'mafsub',
		sub: 'mafsub', // Typescript doesn't like "sub" as the command name for some reason, so this is a hack to get around that.
		mafsub: function (target, room, user, connection, cmd) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			let action = toId(args.shift());
			switch (action) {
			case 'in':
				if (user.userid in game.players) {
					// Check if they have requested to be subbed out.
					if (!game.requestedSub.includes(user.userid)) return user.sendTo(targetRoom, `|error|You have not requested to be subbed out.`);
					game.requestedSub.splice(game.requestedSub.indexOf(user.userid), 1);
					user.sendTo(room, `|error|You have cancelled your request to sub out.`);
					game.players[user.userid].updateHtmlRoom();
				} else {
					if (!this.canTalk(null, targetRoom)) return;
					if (game.subs.includes(user.userid)) return user.sendTo(targetRoom, `|error|You are already on the sub list.`);
					if (game.played.includes(user.userid)) return user.sendTo(targetRoom, `|error|You cannot sub back into the game.`);
					const canJoin = game.canJoin(user, true);
					if (canJoin) return user.sendTo(targetRoom, `|error|${canJoin}`);
					game.subs.push(user.userid);
					game.nextSub();
					// Update spectator's view
					this.parse(`/join view-mafia-${targetRoom.id}`);
				}
				break;
			case 'out':
				if (user.userid in game.players) {
					if (game.requestedSub.includes(user.userid)) return user.sendTo(targetRoom, `|error|You have already requested to be subbed out.`);
					game.requestedSub.push(user.userid);
					game.players[user.userid].updateHtmlRoom();
					game.nextSub();
				} else {
					if (game.hostid === user.userid) return user.sendTo(targetRoom, `|error|The host cannot sub out of the game.`);
					if (!game.subs.includes(user.userid)) return user.sendTo(targetRoom, `|error|You are not on the sub list.`);
					game.subs.splice(game.subs.indexOf(user.userid), 1);
					// Update spectator's view
					this.parse(`/join view-mafia-${targetRoom.id}`);
				}
				break;
			case 'next':
				if (!user.can('mute', null, room) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia sub - Access denied for force substituting a player.`);
				let toSub = args.shift();
				if (!(toId(toSub) in game.players)) return user.sendTo(targetRoom, `|error|${toSub} is not in the game.`);
				if (!game.subs.length) {
					if (game.hostRequestedSub.indexOf(toId(toSub)) !== -1) return user.sendTo(targetRoom, `|error|${toSub} is already on the list to be subbed out.`);
					user.sendTo(targetRoom, `|error|There are no subs to replace ${toSub}, they will be subbed if a sub is available before they speak next.`);
					game.hostRequestedSub.unshift(toId(toSub));
				} else {
					game.nextSub(toId(toSub));
				}
				break;
			case 'remove':
				if (!user.can('mute', null, room) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia sub - Access denied for force substituting a player.`);
				const toRemove = toId(args.shift());
				const toRemoveIndex = game.subs.indexOf(toRemove);
				if (toRemoveIndex === -1) return user.sendTo(room, `|error|${toRemove} is not on the sub list.`);
				game.subs.splice(toRemoveIndex, 1);
				user.sendTo(room, `${toRemove} has been removed from the sublist`);
				break;
			default:
				if (!user.can('mute', null, room) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia sub - Access denied for force substituting a player.`);
				const toSubOut = action;
				const toSubIn = toId(args.shift());
				if (!(toSubOut in game.players)) return user.sendTo(targetRoom, `|error|${toSubOut} is not in the game.`);

				const targetUser = Users(toSubIn);
				if (!targetUser) return user.sendTo(targetRoom, `|error|The user "${toSubIn}" was not found.`);
				const canJoin = game.canJoin(targetUser, false, cmd === 'forcesub');
				if (canJoin) return user.sendTo(targetRoom, `|error|${canJoin}`);
				if (game.subs.includes(targetUser.userid)) game.subs.splice(game.subs.indexOf(targetUser.userid), 1);
				if (game.hostRequestedSub.includes(toSubOut)) game.hostRequestedSub.splice(game.hostRequestedSub.indexOf(toSubOut), 1);
				if (game.requestedSub.includes(toSubOut)) game.requestedSub.splice(game.requestedSub.indexOf(toSubOut), 1);
				game.sub(toSubOut, toSubIn);
			}
		},
		subhelp: [
			`/mafia sub in - Request to sub into the game, or cancel a request to sub out.`,
			`/mafia sub out - Request to sub out of the game, or cancel a request to sub in.`,
			`/mafia sub next, [player] - Forcibly sub [player] out of the game. Requires host % @ * # & ~`,
			`/mafia sub remove, [user] - Remove [user] from the sublist. Requres  host % @ * # & ~`,
			`/mafia sub [player], [user] - Forcibly sub [player] for [user]. Requires host % @ * # & ~`,
		],

		"!autosub": true,
		autosub: function (target, room, user) {
			const args = target.split(',');
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(args[0]));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			} else {
				args.shift();
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (this.meansYes(toId(args.join('')))) {
				if (game.autoSub) return user.sendTo(targetRoom, `|error|Automatic subbing of players is already enabled.`);
				game.autoSub = true;
				user.sendTo(targetRoom, `Automatic subbing of players has been enabled.`);
				game.nextSub();
			} else if (this.meansNo(toId(args.join('')))) {
				if (!game.autoSub) return user.sendTo(targetRoom, `|error|Automatic subbing of players is already disabled.`);
				game.autoSub = false;
				user.sendTo(targetRoom, `Automatic subbing of players has been disabled.`);
			} else {
				return this.parse(`/help mafia autosub`);
			}
		},
		autosubhelp: [`/mafia autosub [yes|no] - Sets if players will automatically sub out if a user is on the sublist. Requires host % @ * # & ~`],

		forcesubhost: 'subhost',
		subhost: function (target, room, user, connection, cmd) {
			if (!room || !room.game || room.game.gameid !== 'mafia') return this.errorReply(`There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (room.game);
			if (!this.canTalk()) return;
			if (!target) return this.parse('/help mafia subhost');
			if (!this.can('mute', null, room)) return false;
			this.splitTarget(target, false);
			let targetUser = this.targetUser;
			if (!targetUser || !targetUser.connected) return this.errorReply(`The user "${this.targetUsername}" was not found.`);
			if (!room.users[targetUser.userid]) return this.errorReply(`${targetUser.name} is not in this room, and cannot be hosted.`);
			if (game.hostid === targetUser.userid) return this.errorReply(`${targetUser.name} is already the host.`);
			if (targetUser.userid in game.players) return this.errorReply(`You cannot subhost to a user in the game.`);
			if (targetUser.userid in game.dead) {
				if (cmd !== 'forcesubhost') return this.errorReply(`${targetUser.name} could potentially be revived. To subhost anyway, use /mafia forcesubhost ${target}.`);
				game.dead[targetUser.userid].destroy();
				delete game.dead[targetUser.userid];
			}
			const oldHostid = game.hostid;
			const oldHost = Users(game.hostid);
			if (oldHost) oldHost.send(`>view-mafia-${room.id}\n|deinit`);
			if (game.subs.includes(targetUser.userid)) game.subs.splice(game.subs.indexOf(targetUser.userid), 1);
			const queueIndex = hostQueue.indexOf(targetUser.userid);
			if (queueIndex > -1) hostQueue.splice(queueIndex, 1);
			game.host = Chat.escapeHTML(targetUser.name);
			game.hostid = targetUser.userid;
			game.played.push(targetUser.userid);
			// @ts-ignore "Chat.pages" is possibly undefined
			targetUser.send(`>view-mafia-${room.id}\n|init|html\n${Chat.pages.mafia([room.id], targetUser)}`);
			game.sendRoom(`${Chat.escapeHTML(targetUser.name)} has been substituted as the new host, replacing ${oldHostid}.`, {declare: true});
			this.modlog('MAFIASUBHOST', targetUser, `replacing ${oldHostid}`, {noalts: true, noip: true});
		},
		subhosthelp: [`/mafia subhost [user] - Substitues the user as the new game host.`],

		'!end': true,
		end: function (target, room, user) {
			let targetRoom /** @type {ChatRoom?} */ = (Rooms(target));
			if (!targetRoom || targetRoom.type !== 'chat' || !targetRoom.users[user.userid]) {
				if (!room || room.type !== 'chat') return this.errorReply(`This command is only meant to be used in chat rooms.`);
				targetRoom = room;
			}
			if (!targetRoom.game || targetRoom.game.gameid !== 'mafia') return user.sendTo(targetRoom, `|error|There is no game of mafia running in this room.`);
			const game = /** @type {MafiaTracker} */ (targetRoom.game);
			if (!user.can('broadcast', null, targetRoom) && game.hostid !== user.userid) return user.sendTo(targetRoom, `|error|/mafia end - Access denied.`);
			game.end();
			this.room = targetRoom;
			this.modlog('MAFIAEND', null);
		},
		endhelp: [`/mafia end - End the current game of mafia. Requires host + % @ * # & ~`],

		role: 'data',
		modifier: 'data',
		alignment: 'data',
		theme: 'data',
		dt: 'data',
		data: function (target, room, user, connection, cmd) {
			if (!room || !room.mafiaEnabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (cmd === 'role' && !target) {
				// Support /mafia role showing your current role if your in a game
				const game = /** @type {MafiaTracker} */ (room.game);
				if (!game || game.id !== 'mafia') return this.errorReply(`There is no game of mafia running in this room. If you meant to display information about a role, use /mafia role [role name]`);
				if (!(user.userid in game.players)) return this.errorReply(`You are not in the game of ${game.title}.`);
				const role = game.players[user.userid].role;
				if (!role) return this.errorReply(`You do not have a role yet.`);
				return this.sendReplyBox(`Your role is: ${role.safeName}`);
			}
			if (!this.runBroadcast()) return;
			if (!target) return this.parse(`/help mafia data`);

			const types = {alignment: 'alignments', role: 'roles', modifier: 'modifiers', theme: 'themes'};
			let id = target.split(' ').map(toId).join('_');
			let result = null;
			let dataType = cmd;
			if (cmd in types) {
				let type = /** @type {'alignments' | 'roles' | 'modifiers' | 'themes'} */ (types[cmd]);
				let data = MafiaData[type];
				if (!data) return this.errorReply(`"${type}" is not a valid search area.`); // Should never happen
				if (!data[id]) return this.errorReply(`"${target} is not a valid ${cmd}."`);
				result = data[id];
				if (typeof result === 'string') result = data[result];
			} else {
				// Search all
				for (let i in types) {
					let type = /** @type {'alignments' | 'roles' | 'modifiers' | 'themes'} */ (types[i]);
					let data = MafiaData[type];
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
				for (let i in result) {
					if (isNaN(parseInt(i))) continue;
					buf += `${i}: `;
					let count = {};
					let roles = [];
					for (const role of result[i].split(',').map((/** @type {string} */x) => x.trim())) {
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
		datahelp: [`/mafia data [alignment|role|modifier|theme] - Get information on a mafia alignment, role, modifier, or theme.`],

		win: function (target, room, user) {
			if (!room || !room.mafiaEnabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (room.id !== 'mafia') return this.errorReply(`This command can only be used in the Mafia room.`);
			if (!this.can('mute', null, room)) return;
			const args = target.split(',');
			let points = parseInt(args[0]);
			if (isNaN(points)) {
				points = 10;
			} else {
				if (points > 100 || points < -100) return this.errorReply(`You cannot give or take more than 100 points at a time.`);
				// shift out the point count
				args.shift();
			}
			if (!args.length) return this.parse('/help mafia win');
			const month = new Date().toLocaleString("en-us", {month: "numeric", year: "numeric"});
			if (!logs.leaderboard[month]) logs.leaderboard[month] = {};
			let gavePoints = false;
			for (let u of args) {
				u = toId(u);
				if (!u) continue;
				if (!gavePoints) gavePoints = true;
				if (!logs.leaderboard[month][u]) logs.leaderboard[month][u] = 0;
				logs.leaderboard[month][u] += points;
				if (logs.leaderboard[month][u] === 0) delete logs.leaderboard[month][u];
			}
			if (!gavePoints) return this.parse('/help mafia win');
			writeFile(LOGS_FILE, logs);
			this.modlog(`MAFIAPOINTS`, null, `${points} points were awarded to ${Chat.toListString(args)}`);
			this.privateModAction(`(${points} points were awarded to: ${Chat.toListString(args)})`);
		},
		winhelp: [`/mafia win (points) [user1], [user2], [user3], ... - Award the specified users points to the mafia leaderboard for this month. The amount of points can be negative to take points. Defaults to 10 points.`],

		unmvp: 'mvp',
		mvp: function (target, room, user, connection, cmd) {
			if (!room || !room.mafiaEnabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (room.id !== 'mafia') return this.errorReply(`This command can only be used in the Mafia room.`);
			if (!this.can('mute', null, room)) return;
			const args = target.split(',');
			if (!args.length) return this.parse('/help mafia mvp');
			const month = new Date().toLocaleString("en-us", {month: "numeric", year: "numeric"});
			if (!logs.mvps[month]) logs.mvps[month] = {};
			if (!logs.leaderboard[month]) logs.leaderboard[month] = {};
			let gavePoints = false;
			for (let u of args) {
				u = toId(u);
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
			this.modlog(`MAFIA${cmd.toUpperCase()}`, null, `MVP and 5 points were ${cmd === 'unmvp' ? 'taken from' : 'awarded to'} ${Chat.toListString(args)}`);
			this.privateModAction(`(MVP and 5 points were ${cmd === 'unmvp' ? 'taken from' : 'awarded to'}: ${Chat.toListString(args)})`);
		},
		mvphelp: [
			`/mafia mvp [user1], [user2], ... - Gives a MVP point and 5 leaderboard points to the users specified.`,
			`/mafia unmvp [user1], [user2], ... - Takes away a MVP point and 5 leaderboard points from the users specified.`,
		],

		hostlogs: 'leaderboard',
		playlogs: 'leaderboard',
		leaverlogs: 'leaderboard',
		mvpladder: 'leaderboard',
		lb: 'leaderboard',
		leaderboard: function (target, room, user, connection, cmd) {
			if (!room || !room.mafiaEnabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (room.id !== 'mafia') return this.errorReply(`This command can only be used in the Mafia room.`);
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
			`/mafia [hostlost|playlogs|leaverlogs] - View the host, play, or leaver logs for the current or last month. Requires % @ * # & ~`,
		],

		unhostban: 'hostban',
		hostban: function (target, room, user, connection, cmd) {
			if (!room || !room.mafiaEnabled) return this.errorReply(`Mafia is disabled for this room.`);
			if (room.id !== 'mafia') return this.errorReply(`This command can only be used in the Mafia room.`);

			const duration = parseInt(this.splitTarget(target, false));
			if (!this.targetUser) return this.errorReply(`User ${target} not found.`);
			if (!this.can('mute', this.targetUser, room)) return false;

			const isUnban = (cmd.startsWith('un'));
			if (isHostBanned(toId(this.targetUsername)) === !isUnban) return this.errorReply(`${this.targetUsername} is ${isUnban ? 'not' : 'already'} banned from hosting games.`);

			if (isUnban) {
				delete hostBans[toId(this.targetUsername)];
				this.modlog(`MAFIAUNHOSTBAN`, this.targetUser);
			} else {
				if (isNaN(duration) || duration < 1) return this.parse('/help mafia hostban');
				if (duration > 7) return this.errorReply(`Bans cannot be longer than 7 days.`);

				hostBans[toId(this.targetUsername)] = Date.now() + 1000 * 60 * 60 * 24 * duration;
				this.modlog(`MAFIAHOSTBAN`, this.targetUser, `for ${duration} days.`);
				const queueIndex = hostQueue.indexOf(toId(this.targetUsername));
				if (queueIndex > -1) hostQueue.splice(queueIndex, 1);
			}
			writeFile(BANS_FILE, hostBans);
			room.add(`${this.targetUsername} was ${isUnban ? 'un' : ''}banned from hosting games${!isUnban ? ` for ${duration} days` : ''} by ${user.name}.`).update();
		},
		hostbanhelp: [
			`/mafia hostban [user], [duration] - Ban a user from hosting games for [duration] days. Requires % @ * # & ~`,
			`/mafia (un)hostban [user] - Unbans a user from hosting games. Requires % @ * # & ~`,
		],

		disable: function (target, room, user) {
			if (!room || !this.can('gamemanagement', null, room)) return;
			if (!room.mafiaEnabled) {
				return this.errorReply("Mafia is already disabled.");
			}
			delete room.mafiaEnabled;
			if (room.chatRoomData) {
				delete room.chatRoomData.mafiaEnabled;
				Rooms.global.writeChatRoomData();
			}
			this.modlog('MAFIADISABLE', null);
			return this.sendReply("Mafia has been disabled for this room.");
		},
		disablehelp: [`/mafia disable - Disables mafia in this room. Requires # & ~`],

		enable: function (target, room, user) {
			if (!room || !this.can('gamemanagement', null, room)) return;
			if (room.mafiaEnabled) {
				return this.errorReply("Mafia is already enabled.");
			}
			room.mafiaEnabled = true;
			if (room.chatRoomData) {
				room.chatRoomData.mafiaEnabled = true;
				Rooms.global.writeChatRoomData();
			}
			this.modlog('MAFIAENABLE', null);
			return this.sendReply("Mafia has been enabled for this room.");
		},
		enablehelp: [`/mafia enable - Enables mafia in this room. Requires # & ~`],
	},
	mafiahelp: [
		`Commands for the Mafia plugin:`,
		`/mafia host [user] - Create a game of Mafia with [user] as the host. Requires + % @ * # & ~`,
		`/mafia nexthost - Host the next user in the host queue. Requires + % @ * # & ~`,
		`/mafia queue [add|remove|view], [user] - Add: Adds the user to the queue. Requires + % @ * # & ~. Remove: Removes the user from the queue. Requires + % @ * # & ~. View: Shows the upcoming users who are going to host.`,
		`/mafia join - Join the game.`,
		`/mafia leave - Leave the game. Can only be done while signups are open.`,
		`/mafia close - Closes signups for the current game. Requires: host % @ * # & ~`,
		`/mafia closedsetup [on|off] - Sets if the game is a closed setup. Closed setups don't show the role list to players. Requires host % @ * # & ~`,
		`/mafia reveal [on|off] - Sets if roles reveal on death or not. Requires host % @ * # & ~`,
		`/mafia selflynch [on|hammer|off] - Allows players to self lynch themselves either at hammer or anytime. Requires host % @ * # & ~`,
		`/mafia enablenl OR /mafia disablenl - Allows or disallows players abstain from lynching. Requires host % @ # & ~`,
		`/mafia setroles [comma seperated roles] - Set the roles for a game of mafia. You need to provide one role per player.`,
		`/mafia forcesetroles [comma seperated roles] - Forcibly set the roles for a game of mafia. No role PM information or alignment will be set.`,
		`/mafia start - Start the game of mafia. Signups must be closed. Requires host % @ * # & ~`,
		`/mafia day - Move to the next game day. Requires host % @ * # & ~`,
		`/mafia night - Move to the next game night. Requires host % @ * # & ~`,
		`/mafia extend (minutes) - Return to the previous game day. If (minutes) is provided, set the deadline for (minutes) minutes. Requires host % @ * # & ~`,
		`/mafia lynch [player|nolynch] - Vote to lynch the specified player or to not lynch anyone.`,
		`/mafia unlynch - Withdraw your lynch vote. Fails if your not voting to lynch anyone`,
		`/mafia kill [player] - Kill a player, eliminating them from the game. Requires host % @ * # & ~`,
		`/mafia treestump [player] - Kills a player, but allows them to talk during the day still.`,
		`/mafia spirit [player] - Kills a player, but allows them to vote on the lynch still.`,
		`/mafia spiritstump [player] - Kills a player, but allows them to talk during the day, and vote on the lynch.`,
		`/mafia kick [player] - Kicks a player from the game without revealing their role.`,
		`/mafia revive [player] - Revive a player who died or add a new player to the game. Requires host % @ * # & ~`,
		`/mafia deadline [minutes|off] - Sets or removes the deadline for the game. Cannot be more than 20 minutes.`,
		`/mafia sub in - Request to sub into the game, or cancel a request to sub out.`,
		`/mafia sub out - Request to sub out of the game, or cancel a request to sub in.`,
		`/mafia sub next [player] - Forcibly sub [player] out of the game. Requires host % @ * # & ~`,
		`/mafia subhost [user] - Substitues the user as the new game host.`,
		`/mafia end - End the current game of mafia. Requires host % @ * # & ~`,
		`/mafia data [alignment|role|modifier|theme] - Get information on a mafia alignment, role, modifier, or theme.`,
		`/mafia win (points) [user1], [user2], [user3], ... - Award the specified users points to the mafia leaderboard for this month. The amount of points can be negative to take points. Defaults to 10 points.`,
		`/mafia mvp [user1], [user2], ... - Gives a MVP point and 5 leaderboard points to the users specified.`,
		`/mafia unmvp [user1], [user2], ... - Takes away a MVP point and 5 leaderboard points from the users specified.`,
		`/mafia [leaderboard|mvpladder] - View the leaderboard or MVP ladder for the current or last month.`,
		`/mafia [hostlost|playlogs] - View the host logs or play logs for the current or last month. Requires % @ * # & ~`,
		`/mafia disable - Disables mafia in this room. Requires # & ~`,
		`/mafia enable - Enables mafia in this room. Requires # & ~`,
	],
};

module.exports = {
	commands,
	pages,
};
