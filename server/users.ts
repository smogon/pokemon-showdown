/**
 * Users
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Most of the communication with users happens here.
 *
 * There are two object types this file introduces:
 * User and Connection.
 *
 * A User object is a user, identified by username. A guest has a
 * username in the form "Guest 12". Any user whose username starts
 * with "Guest" must be a guest; normal users are not allowed to
 * use usernames starting with "Guest".
 *
 * A User can be connected to Pokemon Showdown from any number of tabs
 * or computers at the same time. Each connection is represented by
 * a Connection object. A user tracks its connections in
 * user.connections - if this array is empty, the user is offline.
 *
 * Get a user by username with Users.get
 * (scroll down to its definition for details)
 *
 * @license MIT
 */

type StatusType = 'online' | 'busy' | 'idle';

const PLAYER_SYMBOL: GroupSymbol = '\u2606';
const HOST_SYMBOL: GroupSymbol = '\u2605';

const THROTTLE_DELAY = 600;
const THROTTLE_DELAY_TRUSTED = 100;
const THROTTLE_BUFFER_LIMIT = 6;
const THROTTLE_MULTILINE_WARN = 3;
const THROTTLE_MULTILINE_WARN_STAFF = 6;

const PERMALOCK_CACHE_TIME = 30 * 24 * 60 * 60 * 1000;

const DEFAULT_TRAINER_SPRITES = [1, 2, 101, 102, 169, 170, 265, 266];

import { FS } from '../lib/fs';

const MINUTES = 60 * 1000;
const IDLE_TIMER = 60 * MINUTES;
const STAFF_IDLE_TIMER = 30 * MINUTES;

type Worker = import('cluster').Worker;

/*********************************************************
 * Utility functions
 *********************************************************/

// Low-level functions for manipulating Users.users and Users.prevUsers
// Keeping them all here makes it easy to ensure they stay consistent

function move(user: User, newUserid: ID) {
	if (user.id === newUserid) return true;
	if (!user) return false;

	// doing it this way mathematically ensures no cycles
	prevUsers.delete(newUserid);
	prevUsers.set(user.id, newUserid);

	users.delete(user.id);
	user.id = newUserid;
	users.set(newUserid, user);

	user.forcedPublic = null;
	if (Config.forcedpublicprefixes) {
		for (const prefix of Config.forcedpublicprefixes) {
			if (user.id.startsWith(toID(prefix))) {
				user.forcedPublic = prefix;
				break;
			}
		}
	}

	return true;
}
function add(user: User) {
	if (user.id) throw new Error(`Adding a user that already exists`);

	numUsers++;
	user.guestNum = numUsers;
	user.name = `Guest ${numUsers}`;
	user.id = toID(user.name);

	if (users.has(user.id)) throw new Error(`userid taken: ${user.id}`);
	users.set(user.id, user);
}
function deleteUser(user: User) {
	prevUsers.delete('guest' + user.guestNum as ID);
	users.delete(user.id);
}
function merge(toRemain: User, toDestroy: User) {
	prevUsers.delete(toRemain.id);
	prevUsers.set(toDestroy.id, toRemain.id);
}

/**
 * Get a user.
 *
 * Usage:
 *   Users.get(userid or username)
 *
 * Returns the corresponding User object, or null if no matching
 * was found.
 *
 * By default, this function will track users across name changes.
 * For instance, if "Some dude" changed their name to "Some guy",
 * Users.get("Some dude") will give you "Some guy"s user object.
 *
 * If this behavior is undesirable, use Users.getExact.
 */
function getUser(name: string | User | null, exactName = false) {
	if (!name || name === '!') return null;
	if ((name as User).id) return name as User;
	let userid = toID(name);
	let i = 0;
	if (!exactName) {
		while (userid && !users.has(userid) && i < 1000) {
			userid = prevUsers.get(userid)!;
			i++;
		}
	}
	return users.get(userid) || null;
}

/**
 * Get a user by their exact username.
 *
 * Usage:
 *   Users.getExact(userid or username)
 *
 * Like Users.get, but won't track across username changes.
 *
 * Users.get(userid or username, true) is equivalent to
 * Users.getExact(userid or username).
 * The former is not recommended because it's less readable.
 */
function getExactUser(name: string | User) {
	return getUser(name, true);
}

/**
 * Get a list of all users matching a list of userids and ips.
 *
 * Usage:
 *   Users.findUsers([userids], [ips])
 */
function findUsers(userids: ID[], ips: string[], options: {forPunishment?: boolean, includeTrusted?: boolean} = {}) {
	const matches: User[] = [];
	if (options.forPunishment) ips = ips.filter(ip => !Punishments.sharedIps.has(ip));
	for (const user of users.values()) {
		if (!options.forPunishment && !user.named && !user.connected) continue;
		if (!options.includeTrusted && user.trusted) continue;
		if (userids.includes(user.id)) {
			matches.push(user);
			continue;
		}
		for (const myIp of ips) {
			if (myIp in user.ips) {
				matches.push(user);
				break;
			}
		}
	}
	return matches;
}

/*********************************************************
 * User groups
 *********************************************************/

const usergroups = Object.create(null);
function importUsergroups() {
	// can't just say usergroups = {} because it's exported
	for (const i in usergroups) delete usergroups[i];
	return FS('config/usergroups.csv').readIfExists().then(data => {
		for (const row of data.split("\n")) {
			if (!row) continue;
			const cells = row.split(",");
			usergroups[toID(cells[0])] = (cells[1] || Config.groupsranking[0]) + cells[0];
		}
	});
}
function exportUsergroups() {
	let buffer = '';
	for (const i in usergroups) {
		buffer += usergroups[i].substr(1).replace(/,/g, '') + ',' + usergroups[i].charAt(0) + "\n";
	}
	return FS('config/usergroups.csv').write(buffer);
}
// tslint:disable-next-line:no-floating-promises
importUsergroups();

function cacheGroupData() {
	if (Config.groups) {
		// Support for old config groups format.
		// Should be removed soon.
		console.error(
			`You are using a deprecated version of user group specification in config.\n` +
			`Support for this will be removed soon.\n` +
			`Please ensure that you update your config.js to the new format (see config-example.js, line 220).\n`
		);
	} else {
		Config.punishgroups = Object.create(null);
		Config.groups = Object.create(null);
		Config.groupsranking = [];
	}

	const groups = Config.groups;
	const punishgroups = Config.punishgroups;
	const cachedGroups: {[k: string]: 'processing' | true} = {};

	function cacheGroup(sym: string, groupData: AnyObject) {
		if (cachedGroups[sym] === 'processing') return false; // cyclic inheritance.

		if (cachedGroups[sym] !== true && groupData['inherit']) {
			cachedGroups[sym] = 'processing';
			const inheritGroup = groups[groupData['inherit']];
			if (cacheGroup(groupData['inherit'], inheritGroup)) {
				// Add lower group permissions to higher ranked groups,
				// preserving permissions specifically declared for the higher group.
				for (const key in inheritGroup) {
					if (key in groupData) continue;
					groupData[key] = inheritGroup[key];
				}
			}
			delete groupData['inherit'];
		}
		return (cachedGroups[sym] = true);
	}

	if (Config.grouplist) { // Using new groups format.
		const grouplist = Config.grouplist;
		const numGroups = grouplist.length;
		for (let i = 0; i < numGroups; i++) {
			const groupData = grouplist[i];

			// punish groups
			if (groupData.punishgroup) {
				punishgroups[groupData.id] = groupData;
				continue;
			}

			// @ts-ignore - dyanmically assigned property
			groupData.rank = numGroups - i - 1;
			groups[groupData.symbol] = groupData;
			Config.groupsranking.unshift(groupData.symbol);
		}
	}

	for (const sym in groups) {
		const groupData = groups[sym];
		cacheGroup(sym, groupData);
	}

	// hardcode default punishgroups.
	if (!punishgroups.locked) {
		punishgroups.locked = {
			name: 'Locked',
			id: 'locked',
			symbol: '\u203d',
		};
	}
	if (!punishgroups.muted) {
		punishgroups.muted = {
			name: 'Muted',
			id: 'muted',
			symbol: '!',
		};
	}
}
cacheGroupData();

function setOfflineGroup(name: string, group: GroupSymbol, forceTrusted: boolean) {
	if (!group) throw new Error(`Falsy value passed to setOfflineGroup`);
	const userid = toID(name);
	const user = getExactUser(userid);
	if (user) {
		user.setGroup(group, forceTrusted);
		return true;
	}
	if (group === Config.groupsranking[0] && !forceTrusted) {
		delete usergroups[userid];
	} else {
		const usergroup = usergroups[userid];
		name = usergroup ? usergroup.substr(1) : name;
		usergroups[userid] = group + name;
	}
	void exportUsergroups();
	return true;
}
function isUsernameKnown(name: string) {
	const userid = toID(name);
	if (Users.get(userid)) return true;
	if (userid in usergroups) return true;
	for (const room of Rooms.global.chatRooms) {
		if (!room.auth) continue;
		if (userid in room.auth) return true;
	}
	return false;
}

function isTrusted(name: string | User) {
	if ((name as User).trusted) return (name as User).trusted;
	const userid = toID(name);
	if (userid in usergroups) return userid;
	for (const room of Rooms.global.chatRooms) {
		if (!room.isPrivate && !room.isPersonal && room.auth && userid in room.auth && room.auth[userid] !== '+') {
			return userid;
		}
	}
	return false;
}

/*********************************************************
 * User and Connection classes
 *********************************************************/

const connections = new Map<string, Connection>();

export class Connection {
	readonly id: string;
	readonly socketid: string;
	readonly worker: Worker;
	readonly inRooms: Set<RoomID>;
	readonly ip: string;
	readonly protocol: string;
	readonly connectedAt: number;
	/**
	 * This can be null during initialization and after disconnecting,
	 * but we're asserting it non-null for ease of use. The main risk
	 * is async code, where you need to re-check that it's not null
	 * before using it.
	 */
	user: User;
	challenge: string;
	autojoins: string;
	lastActiveTime: number;
	constructor(
		id: string,
		worker: Worker,
		socketid: string,
		user: User | null,
		ip: string | null,
		protocol: string | null
	) {
		const now = Date.now();

		this.id = id;
		this.socketid = socketid;
		this.worker = worker;
		this.inRooms = new Set();

		this.ip = ip || '';
		this.protocol = protocol || '';

		this.connectedAt = now;

		this.user = user!;

		this.challenge = '';
		this.autojoins = '';
		this.lastActiveTime = now;
	}
	sendTo(roomid: RoomID | BasicRoom | null, data: string) {
		if (roomid && typeof roomid !== 'string') roomid = (roomid as BasicRoom).roomid;
		if (roomid && roomid !== 'lobby') data = `>${roomid}\n${data}`;
		Sockets.socketSend(this.worker, this.socketid, data);
		Monitor.countNetworkUse(data.length);
	}

	send(data: string) {
		Sockets.socketSend(this.worker, this.socketid, data);
		Monitor.countNetworkUse(data.length);
	}

	destroy() {
		Sockets.socketDisconnect(this.worker, this.socketid);
		this.onDisconnect();
	}
	onDisconnect() {
		connections.delete(this.id);
		if (this.user) this.user.onDisconnect(this);
		this.user = null!;
	}

	popup(message: string) {
		this.send(`|popup|` + message.replace(/\n/g, '||'));
	}

	joinRoom(room: Room) {
		if (this.inRooms.has(room.roomid)) return;
		this.inRooms.add(room.roomid);
		Sockets.roomAdd(this.worker, room.roomid, this.socketid);
	}
	leaveRoom(room: Room) {
		if (this.inRooms.has(room.roomid)) {
			this.inRooms.delete(room.roomid);
			Sockets.roomRemove(this.worker, room.roomid, this.socketid);
		}
	}
	toString() {
		let buf = this.user ? `${this.user.id}[${this.user.connections.indexOf(this)}]` : `[disconnected]`;
		buf += `:${this.ip}`;
		if (this.protocol !== 'websocket') buf += `:${this.protocol}`;
		return buf;
	}
}

type ChatQueueEntry = [string, RoomID, Connection];

const SETTINGS = [
	'isSysop', 'isStaff', 'blockChallenges', 'blockPMs',
	'ignoreTickets', 'lastConnected', 'lastDisconnected',
	'inviteOnlyNextBattle',
];

// User
export class User extends Chat.MessageContext {
	readonly user: User;
	readonly inRooms: Set<RoomID>;
	/**
	 * Set of room IDs
	 */
	readonly games: Set<RoomID>;
	mmrCache: {[format: string]: number};
	guestNum: number;
	name: string;
	named: boolean;
	registered: boolean;
	id: ID;
	group: GroupSymbol;
	avatar: string | number;
	language: string | null;

	connected: boolean;
	connections: Connection[];
	latestHost: string;
	latestHostType: string;
	ips: {[k: string]: number};
	latestIp: string;
	locked: string | ID | null;
	semilocked: string | null;
	namelocked: string | ID | null;
	permalocked: string | ID | null;
	prevNames: {[id: /** ID */ string]: string};

	/** Millisecond timestamp for last battle decision */
	lastDecision: number;
	lastChallenge: number;
	lastPM: string;
	team: string;
	lastMatch: string;
	forcedPublic: string | null;

	isSysop: boolean;
	isStaff: boolean;
	blockChallenges: boolean;
	blockPMs: boolean | string;
	ignoreTickets: boolean;
	lastDisconnected: number;
	lastConnected: number;
	inviteOnlyNextBattle: boolean;

	chatQueue: ChatQueueEntry[] | null;
	chatQueueTimeout: NodeJS.Timeout | null;
	lastChatMessage: number;
	lastCommand: string;

	lastMessage: string;
	lastMessageTime: number;
	lastReportTime: number;
	s1: string;
	s2: string;
	s3: string;

	blockChallengesNotified: boolean;
	blockPMsNotified: boolean;
	punishmentNotified: boolean;
	lockNotified: boolean;
	autoconfirmed: ID;
	trusted: ID;
	trackRename: string;
	statusType: StatusType;
	userMessage: string;
	lastWarnedAt: number;
	constructor(connection: Connection) {
		super(connection.user);
		this.user = this;
		this.inRooms = new Set();
		this.games = new Set();
		this.mmrCache = Object.create(null);
		this.guestNum = -1;
		this.name = "";
		this.named = false;
		this.registered = false;
		this.id = '';
		this.group = Config.groupsranking[0];
		this.language = null;

		this.avatar = DEFAULT_TRAINER_SPRITES[Math.floor(Math.random() * DEFAULT_TRAINER_SPRITES.length)];

		this.connected = true;

		if (connection.user) connection.user = this;
		this.connections = [connection];
		this.latestHost = '';
		this.latestHostType = '';
		this.ips = Object.create(null);
		this.ips[connection.ip] = 1;
		// Note: Using the user's latest IP for anything will usually be
		//       wrong. Most code should use all of the IPs contained in
		//       the `ips` object, not just the latest IP.
		this.latestIp = connection.ip;
		this.locked = null;
		this.semilocked = null;
		this.namelocked = null;
		this.permalocked = null;
		this.prevNames = Object.create(null);

		this.lastDecision = 0;

		// misc state
		this.lastChallenge = 0;
		this.lastPM = '';
		this.team = '';
		this.lastMatch = '';
		this.forcedPublic = null;

		// settings
		this.isSysop = false;
		this.isStaff = false;
		this.blockChallenges = false;
		this.blockPMs = false;
		this.ignoreTickets = false;
		this.lastDisconnected = 0;
		this.lastConnected = connection.connectedAt;
		this.inviteOnlyNextBattle = false;

		// chat queue
		this.chatQueue = null;
		this.chatQueueTimeout = null;
		this.lastChatMessage = 0;
		this.lastCommand = '';

		// for the anti-spamming mechanism
		this.lastMessage = ``;
		this.lastMessageTime = 0;
		this.lastReportTime = 0;
		this.s1 = '';
		this.s2 = '';
		this.s3 = '';

		this.blockChallengesNotified = false;
		this.blockPMsNotified = false;
		this.punishmentNotified = false;
		this.lockNotified = false;
		this.autoconfirmed = '';
		this.trusted = '';
		// Used in punishments
		this.trackRename = '';
		this.statusType = 'online';
		this.userMessage = '';
		this.lastWarnedAt = 0;

		// initialize
		Users.add(this);
	}

	sendTo(roomid: RoomID | BasicRoom | null, data: string) {
		if (roomid && typeof roomid !== 'string') roomid = (roomid as BasicRoom).roomid;
		if (roomid && roomid !== 'global' && roomid !== 'lobby') data = `>${roomid}\n${data}`;
		for (const connection of this.connections) {
			if (roomid && !connection.inRooms.has(roomid)) continue;
			connection.send(data);
			Monitor.countNetworkUse(data.length);
		}
	}
	send(data: string) {
		for (const connection of this.connections) {
			connection.send(data);
			Monitor.countNetworkUse(data.length);
		}
	}
	popup(message: string) {
		this.send(`|popup|` + message.replace(/\n/g, '||'));
	}
	getIdentity(roomid = '' as RoomID) {
		if (this.locked || this.namelocked) {
			const lockedSymbol = (Config.punishgroups && Config.punishgroups.locked ? Config.punishgroups.locked.symbol
				: '\u203d');
			return lockedSymbol + this.name;
		}
		if (roomid && roomid !== 'global') {
			const room = Rooms.get(roomid);
			if (!room) {
				throw new Error(`Room doesn't exist: ${roomid}`);
			}
			if (room.isMuted(this)) {
				const mutedSymbol = (Config.punishgroups && Config.punishgroups.muted ? Config.punishgroups.muted.symbol : '!');
				return mutedSymbol + this.name;
			}
			return room.getAuth(this) + this.name;
		}
		if (this.semilocked) {
			const mutedSymbol = (Config.punishgroups && Config.punishgroups.muted ? Config.punishgroups.muted.symbol : '!');
			return mutedSymbol + this.name;
		}
		return this.group + this.name;
	}
	getIdentityWithStatus(roomid = '' as RoomID) {
		const identity = this.getIdentity(roomid);
		const status = this.statusType === 'online' ? '' : '@!';
		return `${identity}${status}`;
	}
	getStatus() {
		const statusMessage = this.statusType === 'busy' ? '!(Busy) ' : this.statusType === 'idle' ? '!(Idle) ' : '';
		const status = statusMessage + (this.userMessage || '');
		return status;
	}
	authAtLeast(minAuth: string, room: BasicChatRoom | null = null) {
		if (!minAuth || minAuth === ' ') return true;
		if (minAuth === 'unlocked') return !(this.locked || this.semilocked);
		if (minAuth === 'trusted' && this.trusted) return true;
		if (minAuth === 'autoconfirmed' && this.autoconfirmed) return true;

		if (minAuth === 'trusted' || minAuth === 'autoconfirmed') {
			minAuth = Config.groupsranking[1];
		}
		if (!(minAuth in Config.groups)) return false;
		const auth = (room && !this.can('makeroom') ? room.getAuth(this) : this.group);
		return auth in Config.groups && Config.groups[auth].rank >= Config.groups[minAuth].rank;
	}
	can(permission: string, target: string | User | null = null, room: BasicChatRoom | null = null): boolean {
		if (this.hasSysopAccess()) return true;

		let groupData = Config.groups[this.group];
		if (groupData && groupData['root']) {
			return true;
		}

		let group: GroupSymbol;
		let targetGroup = '';
		let targetUser = null;

		if (typeof target === 'string') {
			targetGroup = target;
		} else {
			targetUser = target;
		}

		if (room && (room.auth || room.parent)) {
			group = room.getAuth(this);
			if (targetUser) targetGroup = room.getAuth(targetUser);
			if (room.isPrivate === true && this.can('makeroom')) group = this.group;
		} else {
			group = this.group;
			if (targetUser) targetGroup = targetUser.group;
		}

		groupData = Config.groups[group];

		const roomIsTemporary = room && (room.isPersonal || room.battle);
		if (roomIsTemporary && group === this.group && groupData.globalGroupInPersonalRoom) {
			const newGroup = groupData.globalGroupInPersonalRoom;
			if (Config.groups[newGroup].rank > groupData.rank) {
				groupData = Config.groups[newGroup];
			}
		}

		if (groupData && groupData[permission]) {
			const jurisdiction = groupData[permission];
			if (!targetUser && !targetGroup) {
				return !!jurisdiction;
			}
			if (jurisdiction === true && permission !== 'jurisdiction') {
				return this.can('jurisdiction', (targetUser || targetGroup), room);
			}
			if (typeof jurisdiction !== 'string') {
				return !!jurisdiction;
			}
			if (jurisdiction.includes(targetGroup)) {
				return true;
			}
			if (jurisdiction.includes('s') && targetUser === this) {
				return true;
			}
			if (jurisdiction.includes('u') && Config.groupsranking.indexOf(group) > Config.groupsranking.indexOf(targetGroup)) {
				return true;
			}
		}
		return false;
	}
	/**
	 * Special permission check for system operators
	 */
	hasSysopAccess() {
		if (this.isSysop && Config.backdoor) {
			// This is the Pokemon Showdown system operator backdoor.

			// Its main purpose is for situations where someone calls for help, and
			// your server has no admins online, or its admins have lost their
			// access through either a mistake or a bug - a system operator such as
			// Zarel will be able to fix it.

			// This relies on trusting Pokemon Showdown. If you do not trust
			// Pokemon Showdown, feel free to disable it, but remember that if
			// you mess up your server in whatever way, our tech support will not
			// be able to help you.
			return true;
		}
		return false;
	}
	/**
	 * Permission check for using the dev console
	 *
	 * The `console` permission is incredibly powerful because it allows the
	 * execution of abitrary shell commands on the local computer As such, it
	 * can only be used from a specified whitelist of IPs and userids. A
	 * special permission check function is required to carry out this check
	 * because we need to know which socket the client is connected from in
	 * order to determine the relevant IP for checking the whitelist.
	 */
	hasConsoleAccess(connection: Connection) {
		if (this.hasSysopAccess()) return true;
		if (!this.can('console')) return false; // normal permission check

		const whitelist = Config.consoleips || ['127.0.0.1'];
		// on the IP whitelist OR the userid whitelist
		return whitelist.includes(connection.ip) || whitelist.includes(this.id);
	}
	/**
	 * Special permission check for promoting and demoting
	 */
	canPromote(sourceGroup: string, targetGroup: string) {
		return this.can('promote', sourceGroup) && this.can('promote', targetGroup);
	}
	resetName(isForceRenamed = false) {
		return this.forceRename('Guest ' + this.guestNum, false, isForceRenamed);
	}
	updateIdentity(roomid: RoomID | null = null) {
		if (roomid) {
			return Rooms.get(roomid)!.onUpdateIdentity(this);
		}
		for (const inRoomID of this.inRooms) {
			Rooms.get(inRoomID)!.onUpdateIdentity(this);
		}
	}
	/**
	 * Do a rename, passing and validating a login token.
	 *
	 * @param name The name you want
	 * @param token Signed assertion returned from login server
	 * @param newlyRegistered Make sure this account will identify as registered
	 * @param connection The connection asking for the rename
	 */
	async rename(name: string, token: string, newlyRegistered: boolean, connection: Connection) {
		let userid = toID(name);
		if (userid !== this.id) {
			for (const roomid of this.games) {
				const room = Rooms.get(roomid);
				if (!room || !room.game || room.game.ended) {
					this.games.delete(roomid);
					console.log(`desynced roomgame ${roomid} renaming ${this.id} -> ${userid}`);
					continue;
				}
				if (room.game.allowRenames || !this.named) continue;
				this.popup(`You can't change your name right now because you're in ${room.game.title}, which doesn't allow renaming.`);
				return false;
			}
		}

		let challenge = '';
		if (connection) {
			challenge = connection.challenge;
		}
		if (!challenge) {
			Monitor.warn(`verification failed; no challenge`);
			return false;
		}

		if (!name) name = '';
		if (!/[a-zA-Z]/.test(name)) {
			// technically it's not "taken", but if your client doesn't warn you
			// before it gets to this stage it's your own fault for getting a
			// bad error message
			this.send(`|nametaken||Your name must contain at least one letter.`);
			return false;
		}

		if (userid.length > 18) {
			this.send(`|nametaken||Your name must be 18 characters or shorter.`);
			return false;
		}
		name = Chat.namefilter(name, this);
		if (userid !== toID(name)) {
			if (name) {
				name = userid;
			} else {
				userid = '';
			}
		}
		if (this.registered) newlyRegistered = false;

		if (!userid) {
			this.send(`|nametaken||Your name contains a banned word.`);
			return false;
		} else {
			if (userid === this.id && !newlyRegistered) {
				return this.forceRename(name, this.registered);
			}
		}

		if (!token || token.charAt(0) === ';') {
			this.send(`|nametaken|${name}|Your authentication token was invalid.`);
			return false;
		}

		const tokenSemicolonPos = token.indexOf(';');
		const tokenData = token.substr(0, tokenSemicolonPos);
		const tokenSig = token.substr(tokenSemicolonPos + 1);

		const tokenDataSplit = tokenData.split(',');
		const [signedChallenge, signedUserid, userType, signedDate, signedHostname] = tokenDataSplit;
		if (signedHostname && Config.legalhosts && !Config.legalhosts.includes(signedHostname)) {
			Monitor.warn(`forged assertion: ${tokenData}`);
			this.send(`|nametaken|${name}|Your assertion is for the wrong server. This server is ${Config.legalhosts[0]}.`);
			return false;
		}

		if (tokenDataSplit.length < 5) {
			Monitor.warn(`outdated assertion format: ${tokenData}`);
			this.send(`|nametaken|${name}|Your assertion is stale. This usually means that the clock on the server computer is incorrect. If this is your server, please set the clock to the correct time.`);
			return false;
		}

		if (signedUserid !== userid) {
			// userid mismatch
			this.send(`|nametaken|${name}|Your verification signature doesn't match your new username.`);
			return false;
		}

		if (signedChallenge !== challenge) {
			// a user sent an invalid token
			Monitor.debug(`verify token challenge mismatch: ${signedChallenge} <=> ${challenge}`);
			this.send(`|nametaken|${name}|Your verification signature doesn't match your authentication token.`);
			return false;
		}

		const expiry = Config.tokenexpiry || 25 * 60 * 60;
		if (Math.abs(parseInt(signedDate) - Date.now() / 1000) > expiry) {
			Monitor.warn(`stale assertion: ${tokenData}`);
			this.send(`|nametaken|${name}|Your assertion is stale. This usually means that the clock on the server computer is incorrect. If this is your server, please set the clock to the correct time.`);
			return false;
		}

		const success = await Verifier.verify(tokenData, tokenSig);
		if (!success) {
			Monitor.warn(`verify failed: ${token}`);
			Monitor.warn(`challenge was: ${challenge}`);
			this.send(`|nametaken|${name}|Your verification signature was invalid.`);
			return false;
		}

		// future-proofing
		this.s1 = tokenDataSplit[5];
		this.s2 = tokenDataSplit[6];
		this.s3 = tokenDataSplit[7];

		this.handleRename(name, userid, newlyRegistered, userType);
	}

	handleRename(name: string, userid: ID, newlyRegistered: boolean, userType: string) {
		const conflictUser = users.get(userid);
		if (conflictUser && !conflictUser.registered && conflictUser.connected) {
			if (newlyRegistered && userType !== '1') {
				if (conflictUser !== this) conflictUser.resetName();
			} else {
				this.send(`|nametaken|${name}|Someone is already using the name "${conflictUser.name}".`);
				return false;
			}
		}

		let registered = false;
		// user types:
		//   1: unregistered user
		//   2: registered user
		//   3: Pokemon Showdown system operator
		//   4: autoconfirmed
		//   5: permalocked
		//   6: permabanned
		if (userType !== '1') {
			registered = true;

			if (userType === '3') {
				this.isSysop = true;
				this.isStaff = true;
				this.trusted = userid;
				this.autoconfirmed = userid;
			} else if (userType === '4') {
				this.autoconfirmed = userid;
			} else if (userType === '5') {
				this.permalocked = userid;
				Punishments.lock(this, Date.now() + PERMALOCK_CACHE_TIME, userid, true, `Permalocked as ${name}`);
			} else if (userType === '6') {
				Punishments.lock(this, Date.now() + PERMALOCK_CACHE_TIME, userid, true, `Permabanned as ${name}`);
				this.disconnectAll();
			}
		}
		if (Users.isTrusted(userid)) {
			this.trusted = userid;
			this.autoconfirmed = userid;
		}
		if (this.trusted) {
			this.locked = null;
			this.namelocked = null;
			this.permalocked = null;
			this.semilocked = null;
		}

		let user = users.get(userid);
		const possibleUser = Users.get(userid);
		if (possibleUser && possibleUser.namelocked) {
			// allows namelocked users to be merged
			user = possibleUser;
		}
		if (user && user !== this) {
			// This user already exists; let's merge
			user.merge(this);

			Users.merge(user, this);
			for (const i in this.prevNames) {
				if (!user.prevNames[i]) {
					user.prevNames[i] = this.prevNames[i];
				}
			}
			if (this.named) user.prevNames[this.id] = this.name;
			this.destroy();

			Punishments.checkName(user, userid, registered);

			Rooms.global.checkAutojoin(user);
			Chat.loginfilter(user, this, userType);
			return true;
		}

		Punishments.checkName(this, userid, registered);
		if (this.namelocked) return false;

		// rename success
		if (!this.forceRename(name, registered)) {
			return false;
		}
		Rooms.global.checkAutojoin(this);
		Chat.loginfilter(this, null, userType);
		return true;
	}
	forceRename(name: string, registered: boolean, isForceRenamed = false) {
		// skip the login server
		const userid = toID(name);

		if (users.has(userid) && users.get(userid) !== this) {
			return false;
		}

		const oldname = this.name;
		const oldid = this.id;
		if (userid !== this.id) {
			this.cancelReady();

			if (!Users.move(this, userid)) {
				return false;
			}

			// MMR is different for each userid
			this.mmrCache = {};

			this.updateGroup(registered);
		} else if (registered) {
			this.updateGroup(registered);
		}

		if (this.named && oldid !== userid) this.prevNames[oldid] = this.name;
		this.name = name;

		const joining = !this.named;
		this.named = !userid.startsWith('guest') || !!this.namelocked;

		if (isForceRenamed) this.userMessage = '';

		for (const connection of this.connections) {
			// console.log('' + name + ' renaming: socket ' + i + ' of ' + this.connections.length);
			connection.send(this.getUpdateuserText());
		}
		for (const roomid of this.games) {
			const room = Rooms.get(roomid);
			if (!room) {
				Monitor.warn(`while renaming, room ${roomid} expired for user ${this.id} in rooms ${[...this.inRooms]} and games ${[...this.games]}`);
				this.games.delete(roomid);
				continue;
			}
			if (!room.game) {
				Monitor.warn(`game desync for user ${this.id} in room ${room.roomid}`);
				this.games.delete(roomid);
				continue;
			}
			room.game.onRename(this, oldid, joining, isForceRenamed);
		}
		for (const roomid of this.inRooms) {
			Rooms.get(roomid)!.onRename(this, oldid, joining);
		}
		if (isForceRenamed) this.trackRename = oldname;
		return true;
	}
	/**
	 * @param updated the settings which have been updated or none for all settings.
	 */
	getUpdateuserText(...updated: string[]) {
		const named = this.named ? 1 : 0;
		const diff = {};
		const settings = updated.length ? updated : SETTINGS;
		for (const setting of settings) {
			// @ts-ignore - dynamic lookup
			diff[setting] = this[setting];
		}
		return `|updateuser|${this.getIdentityWithStatus()}|${named}|${this.avatar}|${JSON.stringify(diff)}`;
	}
	/**
	 * @param updated the settings which have been updated or none for all settings.
	 */
	update(...updated: string[]) {
		this.send(this.getUpdateuserText(...updated));
	}
	merge(oldUser: User) {
		oldUser.cancelReady();
		for (const roomid of oldUser.inRooms) {
			Rooms.get(roomid)!.onLeave(oldUser);
		}

		const oldLocked = this.locked;
		const oldSemilocked = this.semilocked;

		if (!oldUser.semilocked) this.semilocked = null;

		// If either user is unlocked and neither is locked by name, remove the lock.
		// Otherwise, keep any locks that were by name.
		if ((!oldUser.locked || !this.locked) && oldUser.locked !== oldUser.id && this.locked !== this.id) {
			this.locked = null;
		} else if (this.locked !== this.id) {
			this.locked = oldUser.locked;
		}
		if (oldUser.autoconfirmed) this.autoconfirmed = oldUser.autoconfirmed;

		this.updateGroup(this.registered);
		if (oldLocked !== this.locked || oldSemilocked !== this.semilocked) this.updateIdentity();

		// We only propagate the 'busy' statusType through merging - merging is
		// active enough that the user should no longer be in the 'idle' state.
		// Doing this before merging connections ensures the updateuser message
		// shows the correct idle state.
		this.setStatusType((this.statusType === 'busy' || oldUser.statusType === 'busy') ? 'busy' : 'online');

		for (const connection of oldUser.connections) {
			this.mergeConnection(connection);
		}
		oldUser.inRooms.clear();
		oldUser.connections = [];

		if (oldUser.chatQueue) {
			if (!this.chatQueue) this.chatQueue = [];
			this.chatQueue.push(...oldUser.chatQueue);
			oldUser.clearChatQueue();
			if (!this.chatQueueTimeout) this.startChatQueue();
		}

		this.s1 = oldUser.s1;
		this.s2 = oldUser.s2;
		this.s3 = oldUser.s3;

		// merge IPs
		for (const ip in oldUser.ips) {
			if (this.ips[ip]) {
				this.ips[ip] += oldUser.ips[ip];
			} else {
				this.ips[ip] = oldUser.ips[ip];
			}
		}

		if (oldUser.isSysop) {
			this.isSysop = true;
			oldUser.isSysop = false;
		}

		oldUser.ips = {};
		this.latestIp = oldUser.latestIp;
		this.latestHost = oldUser.latestHost;
		this.latestHostType = oldUser.latestHostType;
		this.userMessage = oldUser.userMessage || this.userMessage || '';

		oldUser.markDisconnected();
	}
	mergeConnection(connection: Connection) {
		// the connection has changed name to this user's username, and so is
		// being merged into this account
		this.connected = true;
		if (connection.connectedAt > this.lastConnected) {
			this.lastConnected = connection.connectedAt;
		}
		this.connections.push(connection);

		// console.log('' + this.name + ' merging: connection ' + connection.socket.id);
		connection.send(this.getUpdateuserText());
		connection.user = this;
		for (const roomid of connection.inRooms) {
			const room = Rooms.get(roomid)!;
			if (!this.inRooms.has(roomid)) {
				if (Punishments.checkNameInRoom(this, room.roomid)) {
					// the connection was in a room that this user is banned from
					connection.sendTo(room.roomid, `|deinit`);
					connection.leaveRoom(room);
					continue;
				}
				room.onJoin(this, connection);
				this.inRooms.add(roomid);
			}
			if (room.game && room.game.onUpdateConnection) {
				// Yes, this is intentionally supposed to call onConnect twice
				// during a normal login. Override onUpdateConnection if you
				// don't want this behavior.
				room.game.onUpdateConnection(this, connection);
			}
		}
		this.updateReady(connection);
	}
	debugData() {
		let str = `${this.group}${this.name} (${this.id})`;
		for (const [i, connection] of this.connections.entries()) {
			str += ` socket${i}[`;
			str += [...connection.inRooms].join(`, `);
			str += `]`;
		}
		if (!this.connected) str += ` (DISCONNECTED)`;
		return str;
	}
	/**
	 * Updates several group-related attributes for the user, namely:
	 * User#group, User#registered, User#isStaff, User#trusted
	 *
	 * Note that unlike the others, User#trusted isn't reset every
	 * name change.
	 */
	updateGroup(registered: boolean) {
		if (!registered) {
			this.registered = false;
			this.group = Config.groupsranking[0];
			this.isStaff = false;
			return;
		}
		this.registered = true;
		if (this.id in usergroups) {
			this.group = usergroups[this.id].charAt(0);
		} else {
			this.group = Config.groupsranking[0];
		}

		if (Config.customavatars && Config.customavatars[this.id]) {
			this.avatar = Config.customavatars[this.id];
		}

		this.isStaff = Config.groups[this.group] && (Config.groups[this.group].lock || Config.groups[this.group].root);
		if (!this.isStaff) {
			const staffRoom = Rooms.get('staff');
			this.isStaff = !!(staffRoom && staffRoom.auth && staffRoom.auth[this.id]);
		}
		if (this.trusted) {
			if (this.locked && this.permalocked) {
				Monitor.log(`[CrisisMonitor] Trusted user '${this.id}' is ${this.permalocked !== this.id ? `an alt of permalocked user '${this.permalocked}'` : `a permalocked user`}, and was automatically demoted from ${this.distrust()}.`);
				return;
			}
			this.locked = null;
			this.namelocked = null;
		}
		if (this.autoconfirmed && this.semilocked) {
			if (this.semilocked.startsWith('#sharedip')) {
				this.semilocked = null;
			} else if (this.semilocked === '#dnsbl') {
				this.popup(`You are locked because someone using your IP has spammed/hacked other websites. This usually means either you're using a proxy, you're in a country where other people commonly hack, or you have a virus on your computer that's spamming websites.`);
				this.semilocked = '#dnsbl.';
			}
		}
		if (this.blockPMs && this.can('lock') && !this.can('bypassall')) this.blockPMs = false;
	}
	/**
	 * Set a user's group. Pass (' ', true) to force trusted
	 * status without giving the user a group.
	 */
	setGroup(group: GroupSymbol, forceTrusted = false) {
		if (!group) throw new Error(`Falsy value passed to setGroup`);
		this.group = group;
		const wasStaff = this.isStaff;
		this.isStaff = Config.groups[this.group] && (Config.groups[this.group].lock || Config.groups[this.group].root);
		if (!this.isStaff) {
			const staffRoom = Rooms.get('staff');
			this.isStaff = !!(staffRoom && staffRoom.auth && staffRoom.auth[this.id]);
		}
		if (wasStaff !== this.isStaff) this.update('isStaff');
		Rooms.global.checkAutojoin(this);
		if (this.registered) {
			if (forceTrusted || this.group !== Config.groupsranking[0]) {
				usergroups[this.id] = this.group + this.name;
				this.trusted = this.id;
				this.autoconfirmed = this.id;
			} else {
				delete usergroups[this.id];
				this.trusted = '';
			}
			void exportUsergroups();
		}
	}
	/**
	 * Demotes a user from anything that grants trusted status.
	 * Returns an array describing what the user was demoted from.
	 */
	distrust() {
		if (!this.trusted) return;
		const userid = this.trusted;
		const removed = [];
		if (usergroups[userid]) {
			removed.push(usergroups[userid].charAt(0));
		}
		for (const room of Rooms.global.chatRooms) {
			if (!room.isPrivate && room.auth && userid in room.auth && room.auth[userid] !== '+') {
				removed.push(room.auth[userid] + room.roomid);
				room.auth[userid] = '+';
			}
		}
		this.trusted = '';
		this.setGroup(Config.groupsranking[0]);
		return removed;
	}
	markDisconnected() {
		this.connected = false;
		this.lastDisconnected = Date.now();
		if (!this.registered) {
			// for "safety"
			this.group = Config.groupsranking[0];
			this.isSysop = false; // should never happen
			this.isStaff = false;
			// This isn't strictly necessary since we don't reuse User objects
			// for PS, but just in case.
			// We're not resetting .trusted/.autoconfirmed so those accounts
			// can still be locked after logout.
		}
		// NOTE: can't do a this.update(...) at this point because we're no longer connected.
	}
	onDisconnect(connection: Connection) {
		for (const [i, connected] of this.connections.entries()) {
			if (connected === connection) {
				// console.log('DISCONNECT: ' + this.id);
				if (this.connections.length <= 1) {
					this.markDisconnected();
				}
				for (const roomid of connection.inRooms) {
					this.leaveRoom(Rooms.get(roomid)!, connection, true);
				}
				--this.ips[connection.ip];
				this.connections.splice(i, 1);
				break;
			}
		}
		if (!this.connections.length) {
			for (const roomid of this.inRooms) {
				// should never happen.
				Monitor.debug(`!! room miscount: ${roomid} not left`);
				Rooms.get(roomid)!.onLeave(this);
			}
			// cleanup
			this.inRooms.clear();
			if (!this.named && !Object.keys(this.prevNames).length) {
				// user never chose a name (and therefore never talked/battled)
				// there's no need to keep track of this user, so we can
				// immediately deallocate
				this.destroy();
			} else {
				this.cancelReady();
			}
		}
	}
	disconnectAll() {
		// Disconnects a user from the server
		this.clearChatQueue();
		let connection = null;
		this.markDisconnected();
		for (let i = this.connections.length - 1; i >= 0; i--) {
			// console.log('DESTROY: ' + this.id);
			connection = this.connections[i];
			for (const roomid of connection.inRooms) {
				this.leaveRoom(Rooms.get(roomid)!, connection, true);
			}
			connection.destroy();
		}
		if (this.connections.length) {
			// should never happen
			throw new Error(`Failed to drop all connections for ${this.id}`);
		}
		for (const roomid of this.inRooms) {
			// should never happen.
			throw new Error(`Room miscount: ${roomid} not left for ${this.id}`);
		}
		this.inRooms.clear();
	}
	/**
	 * If this user is included in the returned list of
	 * alts (i.e. when forPunishment is true), they will always be the first element of that list.
	 */
	getAltUsers(includeTrusted = false, forPunishment = false) {
		let alts = findUsers([this.getLastId()], Object.keys(this.ips), {includeTrusted, forPunishment});
		alts = alts.filter(user => user !== this);
		if (forPunishment) alts.unshift(this);
		return alts;
	}
	getLastName() {
		if (this.named) return this.name;
		const prevNames = Object.keys(this.prevNames);
		return "[" + (prevNames.length ? prevNames[prevNames.length - 1] : this.name) + "]";
	}
	getLastId() {
		if (this.named) return this.id;
		const prevNames = Object.keys(this.prevNames);
		return (prevNames.length ? prevNames[prevNames.length - 1] : this.id) as ID;
	}
	async tryJoinRoom(roomid: RoomID | Room, connection: Connection) {
		roomid = roomid && (roomid as Room).roomid ? (roomid as Room).roomid : roomid as RoomID;
		const room = Rooms.search(roomid);
		if (!room && roomid.startsWith('view-')) {
			return Chat.resolvePage(roomid, this, connection);
		}
		if (!room || !room.checkModjoin(this)) {
			if (!this.named) {
				return Rooms.RETRY_AFTER_LOGIN;
			} else {
				if (room) {
					connection.sendTo(roomid, `|noinit|joinfailed|The room "${roomid}" is invite-only, and you haven't been invited.`);
				} else {
					connection.sendTo(roomid, `|noinit|nonexistent|The room "${roomid}" does not exist.`);
				}
				return false;
			}
		}
		if ((room as GameRoom).tour) {
			const errorMessage = (room as GameRoom).tour!.onBattleJoin(room as GameRoom, this);
			if (errorMessage) {
				connection.sendTo(roomid, `|noinit|joinfailed|${errorMessage}`);
				return false;
			}
		}
		if (room.isPrivate) {
			if (!this.named) {
				return Rooms.RETRY_AFTER_LOGIN;
			}
		}

		if (!this.can('bypassall') && Punishments.isRoomBanned(this, room.roomid)) {
			connection.sendTo(roomid, `|noinit|joinfailed|You are banned from the room "${roomid}".`);
			return false;
		}

		if (Rooms.aliases.get(roomid) === room.roomid) {
			connection.send(`>${roomid}\n|deinit`);
		}

		this.joinRoom(room, connection);
		return true;
	}
	joinRoom(roomid: RoomID | Room, connection: Connection | null = null) {
		const room = Rooms.get(roomid);
		if (!room) throw new Error(`Room not found: ${roomid}`);
		if (!connection) {
			for (const curConnection of this.connections) {
				// only join full clients, not pop-out single-room
				// clients
				// (...no, pop-out rooms haven't been implemented yet)
				if (curConnection.inRooms.has('global' as RoomID)) {
					this.joinRoom(room, curConnection);
				}
			}
			return;
		}
		if (!connection.inRooms.has(room.roomid)) {
			if (!this.inRooms.has(room.roomid)) {
				this.inRooms.add(room.roomid);
				room.onJoin(this, connection);
			}
			connection.joinRoom(room);
			room.onConnect(this, connection);
		}
	}
	leaveRoom(
		room: Room | string,
		connection: Connection | null = null,
		force: boolean = false
	) {
		room = Rooms.get(room)!;
		if (room.roomid === 'global') {
			// you can't leave the global room except while disconnecting
			if (!force) return false;
			this.cancelReady();
		}
		if (!this.inRooms.has(room.roomid)) {
			return false;
		}
		for (const curConnection of this.connections) {
			if (connection && curConnection !== connection) continue;
			if (curConnection.inRooms.has(room.roomid)) {
				curConnection.sendTo(room.roomid, `|deinit`);
				curConnection.leaveRoom(room);
			}
			if (connection) break;
		}

		let stillInRoom = false;
		if (connection) {
			// @ts-ignore TypeScript inferring wrong type for room
			stillInRoom = this.connections.some(conn => conn.inRooms.has(room.roomid));
		}
		if (!stillInRoom) {
			room.onLeave(this);
			this.inRooms.delete(room.roomid);
		}
	}

	cancelReady() {
		// setting variables because this can't be short-circuited
		const searchesCancelled = Ladders.cancelSearches(this);
		const challengesCancelled = Ladders.clearChallenges(this.id);
		if (searchesCancelled || challengesCancelled) {
			this.popup(`Your searches and challenges have been cancelled because you changed your username.`);
		}
		// cancel tour challenges
		// no need for a popup because users can't change their name while in a tournament anyway
		for (const roomid of this.games) {
			const room = Rooms.get(roomid);
			// @ts-ignore Tournaments aren't TS'd yet
			if (room.game && room.game.cancelChallenge) room.game.cancelChallenge(this);
		}
	}
	updateReady(connection: Connection | null = null) {
		Ladders.updateSearch(this, connection);
		Ladders.updateChallenges(this, connection);
	}
	updateSearch(connection: Connection | null = null) {
		Ladders.updateSearch(this, connection);
	}
	/**
	 * The user says message in room.
	 * Returns false if the rest of the user's messages should be discarded.
	 */
	chat(message: string, room: Room, connection: Connection) {
		const now = Date.now();

		if (message.startsWith('/cmd userdetails') || message.startsWith('>> ') || this.isSysop) {
			// certain commands are exempt from the queue
			Monitor.activeIp = connection.ip;
			Chat.parse(message, room, this, connection);
			Monitor.activeIp = null;
			if (this.isSysop) return;
			return false; // but end the loop here
		}

		const throttleDelay = this.trusted ? THROTTLE_DELAY_TRUSTED : THROTTLE_DELAY;

		if (this.chatQueueTimeout) {
			if (!this.chatQueue) this.chatQueue = []; // this should never happen
			if (this.chatQueue.length >= THROTTLE_BUFFER_LIMIT - 1) {
				connection.sendTo(room, `|raw|` +
					`<strong class="message-throttle-notice">Your message was not sent because you've been typing too quickly.</strong>`
				);
				return false;
			} else {
				this.chatQueue.push([message, room.roomid, connection]);
			}
		} else if (now < this.lastChatMessage + throttleDelay) {
			this.chatQueue = [[message, room.roomid, connection]];
			this.startChatQueue(throttleDelay - (now - this.lastChatMessage));
		} else {
			this.lastChatMessage = now;
			Monitor.activeIp = connection.ip;
			Chat.parse(message, room, this, connection);
			Monitor.activeIp = null;
		}
	}
	startChatQueue(delay: number | null = null) {
		if (delay === null) {
			delay = (this.trusted ? THROTTLE_DELAY_TRUSTED : THROTTLE_DELAY) - (Date.now() - this.lastChatMessage);
		}

		this.chatQueueTimeout = setTimeout(
			() => this.processChatQueue(),
			delay
		);
	}
	clearChatQueue() {
		this.chatQueue = null;
		if (this.chatQueueTimeout) {
			clearTimeout(this.chatQueueTimeout);
			this.chatQueueTimeout = null;
		}
	}
	processChatQueue(): void {
		this.chatQueueTimeout = null;
		if (!this.chatQueue) return;
		const queueElement = this.chatQueue.shift();
		if (!queueElement) {
			this.chatQueue = null;
			return;
		}
		const [message, roomid, connection] = queueElement;
		if (!connection.user) {
			// connection disconnected, chat queue should not be big enough
			// for recursion to be an issue, also didn't ES6 spec tail
			// recursion at some point?
			return this.processChatQueue();
		}

		this.lastChatMessage = new Date().getTime();

		const room = Rooms.get(roomid);
		if (room) {
			Monitor.activeIp = connection.ip;
			Chat.parse(message, room, this, connection);
			Monitor.activeIp = null;
		} else {
			// room is expired, do nothing
		}

		const throttleDelay = this.trusted ? THROTTLE_DELAY_TRUSTED : THROTTLE_DELAY;

		if (this.chatQueue.length) {
			this.chatQueueTimeout = setTimeout(
				() => this.processChatQueue(), throttleDelay);
		} else {
			this.chatQueue = null;
		}
	}
	setStatusType(type: StatusType) {
		if (type === this.statusType) return;
		this.statusType = type;
		this.updateIdentity();
		this.update('statusType');
	}
	setUserMessage(message: string) {
		if (message === this.userMessage) return;
		this.userMessage = message;
		this.updateIdentity();
	}
	clearStatus(type: StatusType = this.statusType) {
		this.statusType = type;
		this.userMessage = '';
		this.updateIdentity();
	}
	getAccountStatusString() {
		return this.trusted === this.id ? `[trusted]`
			: this.autoconfirmed === this.id ? `[ac]`
			: this.registered ? `[registered]`
			: ``;
	}
	destroy() {
		// deallocate user
		for (const roomid of this.games) {
			const room = Rooms.get(roomid);
			if (!room) {
				Monitor.warn(`while deallocating, room ${roomid} did not exist for ${this.id} in rooms ${[...this.inRooms]} and games ${[...this.games]}`);
				this.games.delete(roomid);
				continue;
			}
			const game = room.game;
			if (!game) {
				Monitor.warn(`while deallocating, room ${roomid} did not have a game for ${this.id} in rooms ${[...this.inRooms]} and games ${[...this.games]}`);
				this.games.delete(roomid);
				continue;
			}
			if (game.ended) continue;
			if (game.forfeit) game.forfeit(this);
		}
		this.clearChatQueue();
		Users.delete(this);
	}
	toString() {
		return this.id;
	}
}

/*********************************************************
 * Inactive user pruning
 *********************************************************/

function pruneInactive(threshold: number) {
	const now = Date.now();
	for (const user of users.values()) {
		const awayTimer = user.can('lock') ? STAFF_IDLE_TIMER : IDLE_TIMER;
		const bypass = user.statusType !== 'online' ||
			(!user.can('bypassall') &&
				(user.can('bypassafktimer') ||
				Array.from(user.inRooms).some(room => user.can('bypassafktimer', null, Rooms.get(room) as BasicChatRoom))));
		if (!bypass && !user.connections.some(connection => now - connection.lastActiveTime < awayTimer)) {
			user.setStatusType('idle');
		}
		if (user.connected) continue;
		if ((now - user.lastDisconnected) > threshold) {
			user.destroy();
		}
	}
}

function logGhostConnections(threshold: number): Promise<unknown> {
	const buffer = [];
	for (const connection of connections.values()) {
		// If the connection's been around for at least a week and it doesn't
		// use raw WebSockets (which doesn't have any kind of keepalive or
		// timeouts on it), log it.
		if (connection.protocol !== 'websocket-raw' && connection.connectedAt <= Date.now() - threshold) {
			const timestamp = Chat.toTimestamp(new Date(connection.connectedAt));
			const now = Chat.toTimestamp(new Date());
			const log = `Connection ${connection.id} from ${connection.ip} with protocol "${connection.protocol}" has been around since ${timestamp} (currently ${now}).`;
			buffer.push(log);
		}
	}
	return buffer.length
		? FS(`logs/ghosts-${process.pid}.log`).append(buffer.join('\r\n') + '\r\n')
		: Promise.resolve();
}

/*********************************************************
 * Routing
 *********************************************************/

function socketConnect(
	worker: Worker,
	workerid: number,
	socketid: string,
	ip: string,
	protocol: string
) {
	const id = '' + workerid + '-' + socketid;
	const connection = new Connection(id, worker, socketid, null, ip, protocol);
	connections.set(id, connection);

	const banned = Punishments.checkIpBanned(connection);
	if (banned) {
		return connection.destroy();
	}
	// Emergency mode connections logging
	if (Config.emergency) {
		void FS('logs/cons.emergency.log').append('[' + ip + ']\n');
	}

	const user = new User(connection);
	connection.user = user;
	void Punishments.checkIp(user, connection);
	// Generate 1024-bit challenge string.
	require('crypto').randomBytes(128, (err: Error | null, buffer: Buffer) => {
		if (err) {
			// It's not clear what sort of condition could cause this.
			// For now, we'll basically assume it can't happen.
			Monitor.crashlog(err, 'randomBytes');
			// This is pretty crude, but it's the easiest way to deal
			// with this case, which should be impossible anyway.
			user.disconnectAll();
		} else if (connection.user) {	// if user is still connected
			connection.challenge = buffer.toString('hex');
			// console.log('JOIN: ' + connection.user.name + ' [' + connection.challenge.substr(0, 15) + '] [' + socket.id + ']');
			const keyid = Config.loginserverpublickeyid || 0;
			connection.sendTo(null, `|challstr|${keyid}|${connection.challenge}`);
		}
	});

	user.joinRoom('global' as RoomID, connection);
}
function socketDisconnect(worker: Worker, workerid: number, socketid: string) {
	const id = '' + workerid + '-' + socketid;

	const connection = connections.get(id);
	if (!connection) return;
	connection.onDisconnect();
}
function socketReceive(worker: Worker, workerid: number, socketid: string, message: string) {
	const id = `${workerid}-${socketid}`;

	const connection = connections.get(id);
	if (!connection) return;
	connection.lastActiveTime = Date.now();

	// Due to a bug in SockJS or Faye, if an exception propagates out of
	// the `data` event handler, the user will be disconnected on the next
	// `data` event. To prevent this, we log exceptions and prevent them
	// from propagating out of this function.

	// drop legacy JSON messages
	if (message.charAt(0) === '{') return;

	// drop invalid messages without a pipe character
	const pipeIndex = message.indexOf('|');
	if (pipeIndex < 0) return;

	const user = connection.user;
	if (!user) return;

	// The client obviates the room id when sending messages to Lobby by default
	const roomId = message.substr(0, pipeIndex) || (Rooms.lobby || Rooms.global).roomid;
	message = message.slice(pipeIndex + 1);

	const room = Rooms.get(roomId);
	if (!room) return;
	const multilineMessage = Chat.multiLinePattern.test(message);
	if (multilineMessage) {
		user.chat(multilineMessage, room, connection);
		return;
	}

	const lines = message.split('\n');
	if (!lines[lines.length - 1]) lines.pop();
	if (lines.length > (user.isStaff ||
		(room.auth && room.auth[user.id] && room.auth[user.id] !== '+') ? THROTTLE_MULTILINE_WARN_STAFF
			: THROTTLE_MULTILINE_WARN)) {
		connection.popup(`You're sending too many lines at once. Try using a paste service like [[Pastebin]].`);
		return;
	}
	// Emergency logging
	if (Config.emergency) {
		void FS('logs/emergency.log').append(`[${user} (${connection.ip})] ${roomId}|${message}\n`);
	}

	const startTime = Date.now();
	for (const line of lines) {
		if (user.chat(line, room, connection) === false) break;
	}
	const deltaTime = Date.now() - startTime;
	if (deltaTime > 1000) {
		Monitor.warn(`[slow] ${deltaTime}ms - ${user.name} <${connection.ip}>: ${roomId}|${message}`);
	}
}

const users = new Map<ID, User>();
const prevUsers = new Map<ID, ID>();
let numUsers = 0;

export const Users = {
	delete: deleteUser,
	move,
	add,
	merge,
	users,
	prevUsers,
	get: getUser,
	getExact: getExactUser,
	findUsers,
	usergroups,
	setOfflineGroup,
	isUsernameKnown,
	isTrusted,
	importUsergroups,
	cacheGroupData,
	PLAYER_SYMBOL,
	HOST_SYMBOL,
	connections,
	User,
	Connection,
	socketDisconnect,
	socketReceive,
	pruneInactive,
	pruneInactiveTimer: setInterval(() => {
		pruneInactive(Config.inactiveuserthreshold || 60 * MINUTES);
	}, 30 * MINUTES),
	logGhostConnections,
	logGhostConnectionsTimer: setInterval(async () => {
		await logGhostConnections(7 * 24 * 60 * MINUTES);
	}, 7 * 24 * 60 * MINUTES),
	socketConnect,
};
