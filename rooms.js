/**
 * Rooms
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Every chat room and battle is a room, and what they do is done in
 * rooms.js. There's also a global room which every user is in, and
 * handles miscellaneous things like welcoming the user.
 *
 * @license MIT license
 */

'use strict';

const TIMEOUT_EMPTY_DEALLOCATE = 10 * 60 * 1000;
const TIMEOUT_INACTIVE_DEALLOCATE = 40 * 60 * 1000;
const REPORT_USER_STATS_INTERVAL = 10 * 60 * 1000;

const CRASH_REPORT_THROTTLE = 60 * 60 * 1000;

const RETRY_AFTER_LOGIN = null;

const FS = require('./lib/fs');
const Roomlogs = require('./roomlogs');

/*********************************************************
 * the Room object.
 *********************************************************/

/**
 * @typedef {{userid: string, time: number, guestNum: number, autoconfirmed: string}} MuteEntry
 */

/**
 * @abstract
 */
class BasicRoom {
	/**
	 * @param {string} roomid
	 * @param {string} [title]
	 */
	constructor(roomid, title) {
		this.id = roomid;
		this.title = (title || roomid);
		/** @type {?Room} */
		this.parent = null;
		/** @type {(string[])?} */
		this.aliases = null;

		/** @type {{[userid: string]: User}} */
		this.users = Object.create(null);
		this.userCount = 0;

		/** @type {'chat' | 'battle' | 'global'} */
		this.type = 'chat';
		/** @type {?{[userid: string]: string}} */
		this.auth = null;

		/**
		 * Scrollback log. This is the log that's sent to users when
		 * joining the room. Should roughly match what's on everyone's
		 * screen.
		 * @type {Roomlog?}
		 */
		this.log = null;

		/** @type {?RoomGame} */
		this.game = null;
		/** @type {?RoomBattle} */
		this.battle = null;
		this.active = false;

		/** @type {MuteEntry[]} */
		this.muteQueue = [];
		/** @type {NodeJS.Timer?} */
		this.muteTimer = null;

		this.lastUpdate = 0;
		this.lastBroadcast = '';
		this.lastBroadcastTime = 0;

		// room settings

		/** @type {AnyObject?} */
		this.chatRoomData = null;
		/** @type {boolean | 'hidden' | 'voice'} */
		this.isPrivate = false;
		this.isPersonal = false;
		/** @type {string | boolean} */
		this.isHelp = false;
		this.isOfficial = false;
		this.reportJoins = true;
		/** @type {number} */
		this.batchJoins = 0;
		/** @type {NodeJS.Timer?} */
		this.reportJoinsInterval = null;

		this.logTimes = false;
		/** @type {string? | true} */
		this.modjoin = null;
		/** @type {string?} */
		this.modchat = null;
		this.staffRoom = false;
		/** @type {false | number} */
		this.slowchat = false;
		this.filterStretching = false;
		this.filterEmojis = false;
		this.filterCaps = false;
		this.mafiaEnabled = false;
		/** @type {Set<string>?} */
		this.privacySetter = null;
		/** @type {Map<string, ChatRoom>?} */
		this.subRooms = null;
	}

	/**
	 * Send a room message to all users in the room, without recording it
	 * in the scrollback log.
	 * @param {string} message
	 */
	send(message) {
		if (this.id !== 'lobby') message = '>' + this.id + '\n' + message;
		if (this.userCount) Sockets.channelBroadcast(this.id, message);
	}
	sendAuth() { throw new Error(`Obsolete command; use room.sendMods`); }
	sendModCommand() { throw new Error(`Obsolete command; use room.sendMods`); }
	push() { throw new Error(`Obsolete command; use room.add`); }
	/**
	 * @param {string} data
	 */
	sendMods(data) {
		if (this.staffRoom) {
			if (!this.log) throw new Error(`Staff room ${this.id} has no log`);
			this.log.add(data);
			return;
		}
		for (let i in this.users) {
			let user = this.users[i];
			// hardcoded for performance reasons (this is an inner loop)
			if (user.isStaff || (this.auth && (this.auth[user.userid] || '+') !== '+')) {
				user.sendTo(this, data);
			}
		}
	}
	/**
	 * Send a room message to a single user.
	 * @param {User | Connection} user
	 * @param {string} message
	 */
	sendUser(user, message) {
		user.sendTo(this, message);
	}
	/**
	 * Add a room message to the room log, so it shows up in the room
	 * for everyone, and appears in the scrollback for new users who
	 * join.
	 * @param {string} message
	 * @return {this}
	 */
	add(message) { throw new Error(`should be implemented by subclass`); }
	roomlog(/** @type {string} */ message) { throw new Error(`should be implemented by subclass`); }
	modlog(/** @type {string} */ message) { throw new Error(`should be implemented by subclass`); }
	logEntry() { throw new Error(`room.logEntry has been renamed room.roomlog`); }
	addLogMessage() { throw new Error(`room.addLogMessage has been renamed room.addByUser`); }
	/**
	 * Inserts (sanitized) HTML into the room log.
	 * @param {string} message
	 */
	addRaw(message) {
		return this.add('|raw|' + message);
	}
	/**
	 * Inserts some text into the room log, attributed to user. The
	 * attribution will not appear, and is used solely as a hint not to
	 * highlight the user.
	 * @param {User} user
	 * @param {string} text
	 */
	addByUser(user, text) {
		return this.add('|c|' + user.getIdentity(this.id) + '|/log ' + text).update();
	}
	/**
	 * Like addByUser, but sends to mods only.
	 * @param {User} user
	 * @param {string} text
	 */
	sendModsByUser(user, text) {
		return this.sendMods('|c|' + user.getIdentity(this.id) + '|/log ' + text);
	}
	update() {}

	toString() {
		return this.id;
	}

	getUserList() {
		let buffer = '';
		let counter = 0;
		for (let i in this.users) {
			if (!this.users[i].named) {
				continue;
			}
			counter++;
			buffer += ',' + this.users[i].getIdentity(this.id);
		}
		let msg = '|users|' + counter + buffer;
		return msg;
	}

	// mute handling

	runMuteTimer(forceReschedule = false) {
		if (forceReschedule && this.muteTimer) {
			clearTimeout(this.muteTimer);
			this.muteTimer = null;
		}
		if (this.muteTimer || this.muteQueue.length === 0) return;

		let timeUntilExpire = this.muteQueue[0].time - Date.now();
		if (timeUntilExpire <= 1000) { // one second of leeway
			this.unmute(this.muteQueue[0].userid, "Your mute in '" + this.title + "' has expired.");
			//runMuteTimer() is called again in unmute() so this function instance should be closed
			return;
		}
		this.muteTimer = setTimeout(() => {
			this.muteTimer = null;
			this.runMuteTimer(true);
		}, timeUntilExpire);
	}
	isMuted(/** @type {User} */ user) {
		if (!user) return;
		if (this.muteQueue) {
			for (const entry of this.muteQueue) {
				if (user.userid === entry.userid ||
					user.guestNum === entry.guestNum ||
					(user.autoconfirmed && user.autoconfirmed === entry.autoconfirmed)) {
					if (entry.time - Date.now() < 0) {
						this.unmute(user.userid);
						return null;
					} else {
						return entry.userid;
					}
				}
			}
		}
	}
	getMuteTime(/** @type {User} */ user) {
		let userid = this.isMuted(user);
		if (!userid) return;
		for (const entry of this.muteQueue) {
			if (userid === entry.userid) {
				return entry.time - Date.now();
			}
		}
	}
	/**
	 * Gets the group symbol of a user in the room.
	 * @param {User} user
	 * @return {string}
	 */
	getAuth(user) {
		if (this.auth && user.userid in this.auth) {
			return this.auth[user.userid];
		}
		if (this.parent) {
			return this.parent.getAuth(user);
		}
		if (this.auth && this.isPrivate === true) {
			return ' ';
		}
		return user.group;
	}
	/**
	 * @param {User} user
	 */
	checkModjoin(user) {
		if (this.staffRoom && !user.isStaff && (!this.auth || (this.auth[user.userid] || ' ') === ' ')) return false;
		if (user.userid in this.users) return true;
		if (!this.modjoin) return true;
		// users with a room rank can always join
		if (this.auth && user.userid in this.auth) return true;
		const userGroup = user.can('makeroom') ? user.group : this.getAuth(user);

		const modjoinSetting = this.modjoin !== true ? this.modjoin : this.modchat;
		if (!modjoinSetting) return true;
		let modjoinGroup = modjoinSetting;

		if (modjoinGroup === 'trusted') {
			if (user.trusted) return true;
			modjoinGroup = Config.groupsranking[1];
		}
		if (modjoinGroup === 'autoconfirmed') {
			if (user.autoconfirmed) return true;
			modjoinGroup = Config.groupsranking[1];
		}
		if (!(userGroup in Config.groups)) return false;
		if (!(modjoinGroup in Config.groups)) throw new Error(`Invalid modjoin setting in ${this.id}: ${modjoinGroup}`);
		return Config.groups[userGroup].rank >= Config.groups[modjoinGroup].rank;
	}
	/**
	 * @param {User} user
	 * @param {number} [setTime]
	 */
	mute(user, setTime) {
		let userid = user.userid;

		if (!setTime) setTime = 7 * 60000; // default time: 7 minutes
		if (setTime > 90 * 60000) setTime = 90 * 60000; // limit 90 minutes

		// If the user is already muted, the existing queue position for them should be removed
		if (this.isMuted(user)) this.unmute(userid);

		// Place the user in a queue for the unmute timer
		for (let i = 0; i <= this.muteQueue.length; i++) {
			let time = Date.now() + setTime;
			if (i === this.muteQueue.length || time < this.muteQueue[i].time) {
				let entry = {
					userid: userid,
					time: time,
					guestNum: user.guestNum,
					autoconfirmed: user.autoconfirmed,
				};
				this.muteQueue.splice(i, 0, entry);
				// The timer needs to be switched to the new entry if it is to be unmuted
				// before the entry the timer is currently running for
				if (i === 0 && this.muteTimer) {
					clearTimeout(this.muteTimer);
					this.muteTimer = null;
				}
				break;
			}
		}
		this.runMuteTimer();

		user.updateIdentity(this.id);

		if (!(this.isPrivate === true || this.isPersonal || this.battle)) Punishments.monitorRoomPunishments(user);

		return userid;
	}
	/**
	 * @param {string} userid
	 * @param {string} [notifyText]
	 */
	unmute(userid, notifyText) {
		let successUserid = '';
		let user = Users.get(userid);
		let autoconfirmed = '';
		if (user) {
			userid = user.userid;
			autoconfirmed = user.autoconfirmed;
		}

		for (const [i, entry] of this.muteQueue.entries()) {
			if (entry.userid === userid ||
				(user && entry.guestNum === user.guestNum) ||
				(autoconfirmed && entry.autoconfirmed === autoconfirmed)) {
				if (i === 0) {
					this.muteQueue.splice(0, 1);
					this.runMuteTimer(true);
				} else {
					this.muteQueue.splice(i, 1);
				}
				successUserid = entry.userid;
				break;
			}
		}

		if (user && successUserid && userid in this.users) {
			user.updateIdentity(this.id);
			if (notifyText) user.popup(notifyText);
		}
		return successUserid;
	}

	/**
	 * @param {User} user
	 */
	onUpdateIdentity(user) {}
	destroy() {}
}

class GlobalRoom extends BasicRoom {
	/**
	 * @param {string} roomid
	 */
	constructor(roomid) {
		if (roomid !== 'global') throw new Error(`The global room's room ID must be 'global'`);
		super(roomid);

		/** @type {'global'} */
		this.type = 'global';
		/** @type {false} */
		this.active = false;
		/** @type {null} */
		this.chatRoomData = null;
		/**@type {boolean | 'pre' | 'ddos'} */
		this.lockdown = false;

		this.battleCount = 0;
		this.lastReportedCrash = 0;

		/** @type {AnyObject[]} */
		this.chatRoomDataList = [];
		try {
			// @ts-ignore
			this.chatRoomDataList = require('./config/chatrooms.json');
			if (!Array.isArray(this.chatRoomDataList)) this.chatRoomDataList = [];
		} catch (e) {} // file doesn't exist [yet]

		if (!this.chatRoomDataList.length) {
			this.chatRoomDataList = [{
				title: 'Lobby',
				isOfficial: true,
				autojoin: true,
			}, {
				title: 'Staff',
				isPrivate: true,
				staffRoom: true,
				staffAutojoin: true,
			}];
		}

		this.chatRooms = /** @type {ChatRoom[]} */ ([]);

		/**
		 * Rooms that users autojoin upon connecting
		 * @type {string[]}
		 */
		this.autojoinList = [];
		/**
		 * Rooms that staff autojoin upon connecting
		 * @type {string[]}
		 */
		this.staffAutojoinList = [];
		for (const [i, chatRoomData] of this.chatRoomDataList.entries()) {
			if (!chatRoomData || !chatRoomData.title) {
				Monitor.warn(`ERROR: Room number ${i} has no data and could not be loaded.`);
				continue;
			}
			let id = toId(chatRoomData.title);
			Monitor.notice("NEW CHATROOM: " + id);
			let room = Rooms.createChatRoom(id, chatRoomData.title, chatRoomData);
			if (room.aliases) {
				for (const alias of room.aliases) {
					Rooms.aliases.set(alias, id);
				}
			}
			this.chatRooms.push(room);
			if (room.autojoin) this.autojoinList.push(id);
			if (room.staffAutojoin) this.staffAutojoinList.push(id);
		}
		Rooms.lobby = /** @type {ChatRoom} */ (Rooms.rooms.get('lobby'));

		// init battle room logging
		if (Config.logladderip) {
			this.ladderIpLog = FS('logs/ladderip/ladderip.txt').createAppendStream();
		} else {
			// Prevent there from being two possible hidden classes an instance
			// of GlobalRoom can have.
			this.ladderIpLog = new (require('./lib/streams')).WriteStream({write() {}});
		}

		let lastBattle;
		try {
			lastBattle = FS('logs/lastbattle.txt').readSync('utf8');
		} catch (e) {}
		/** @type {number} */
		this.lastBattle = Number(lastBattle) || 0;

		// init users
		this.users = Object.create(null);
		this.userCount = 0; // cache of `size(this.users)`
		this.maxUsers = 0;
		this.maxUsersDate = 0;

		this.reportUserStatsInterval = setInterval(
			() => this.reportUserStats(),
			REPORT_USER_STATS_INTERVAL
		);

		// Create writestream for modlog
		this.modlogStream = FS('logs/modlog/modlog_global.txt').createAppendStream();
	}

	/**
	 * @param {string} message
	 */
	modlog(message) {
		this.modlogStream.write('[' + (new Date().toJSON()) + '] ' + message + '\n');
	}

	writeChatRoomData() {
		FS('config/chatrooms.json').writeUpdate(() => (
			JSON.stringify(this.chatRoomDataList)
				.replace(/\{"title":/g, '\n{"title":')
				.replace(/\]$/, '\n]')
		));
	}

	writeNumRooms() {
		FS('logs/lastbattle.txt').writeUpdate(() => (
			`${this.lastBattle}`
		), {throttle: 10 * 1000});
	}

	reportUserStats() {
		if (this.maxUsersDate) {
			LoginServer.request('updateuserstats', {
				date: this.maxUsersDate,
				users: this.maxUsers,
			});
			this.maxUsersDate = 0;
		}
		LoginServer.request('updateuserstats', {
			date: Date.now(),
			users: this.userCount,
		});
	}

	get formatListText() {
		if (this.formatList) {
			return this.formatList;
		}
		this.formatList = '|formats' + (Ladders.formatsListPrefix || '');
		let section = '', prevSection = '';
		let curColumn = 1;
		for (let i in Dex.formats) {
			let format = Dex.formats[i];
			if (format.section) section = format.section;
			if (format.column) curColumn = format.column;
			if (!format.name) continue;
			if (!format.challengeShow && !format.searchShow && !format.tournamentShow) continue;

			if (section !== prevSection) {
				prevSection = section;
				this.formatList += '|,' + curColumn + '|' + section;
			}
			this.formatList += '|' + format.name;
			let displayCode = 0;
			if (format.team) displayCode |= 1;
			if (format.searchShow) displayCode |= 2;
			if (format.challengeShow) displayCode |= 4;
			if (format.tournamentShow) displayCode |= 8;
			const level = format.maxLevel || format.maxForcedLevel || format.forcedLevel;
			if (level === 50) displayCode |= 16;
			this.formatList += ',' + displayCode.toString(16);
		}
		return this.formatList;
	}
	get configRankList() {
		if (Config.nocustomgrouplist) return '';

		// putting the resultant object in Config would enable this to be run again should config.js be reloaded.
		if (Config.rankList) {
			return Config.rankList;
		}
		let rankList = [];

		for (let rank in Config.groups) {
			if (!Config.groups[rank] || !rank) continue;

			let tarGroup = Config.groups[rank];
			let groupType = tarGroup.addhtml || (!tarGroup.mute && !tarGroup.root) ? 'normal' : (tarGroup.root || tarGroup.declare) ? 'leadership' : 'staff';

			rankList.push({symbol: rank, name: (Config.groups[rank].name || null), type: groupType}); // send the first character in the rank, incase they put a string several characters long
		}

		const typeOrder = ['punishment', 'normal', 'staff', 'leadership'];

		rankList = rankList.sort((a, b) => typeOrder.indexOf(b.type) - typeOrder.indexOf(a.type));

		// add the punishment types at the very end.
		for (let rank in Config.punishgroups) {
			rankList.push({symbol: Config.punishgroups[rank].symbol, name: Config.punishgroups[rank].name, type: 'punishment'});
		}

		Config.rankList = '|customgroups|' + JSON.stringify(rankList) + '\n';
		return Config.rankList;
	}

	/**
	 * @param {string} filter "formatfilter, elofilter"
	 */
	getBattles(filter) {
		let rooms = /** @type {GameRoom[]} */ ([]);
		let skipCount = 0;
		const [formatFilter, eloFilterString] = filter.split(',');
		const eloFilter = +eloFilterString;
		if (this.battleCount > 150 && !formatFilter && !eloFilter) {
			skipCount = this.battleCount - 150;
		}
		for (const room of Rooms.rooms.values()) {
			if (!room || !room.active || room.isPrivate) continue;
			if (room.type !== 'battle') continue;
			if (formatFilter && formatFilter !== room.format) continue;
			if (eloFilter && (!room.rated || room.rated < eloFilter)) continue;
			if (skipCount && skipCount--) continue;

			rooms.push(room);
		}

		let roomTable = /** @type {{[roomid: string]: AnyObject}} */ ({});
		for (let i = rooms.length - 1; i >= rooms.length - 100 && i >= 0; i--) {
			let room = rooms[i];
			let roomData = {};
			if (room.active && room.battle) {
				if (room.battle.p1) roomData.p1 = room.battle.p1.name;
				if (room.battle.p2) roomData.p2 = room.battle.p2.name;
				if (room.tour) roomData.minElo = 'tour';
				if (room.rated) roomData.minElo = Math.floor(room.rated);
			}
			if (!roomData.p1 || !roomData.p2) continue;
			roomTable[room.id] = roomData;
		}
		return roomTable;
	}
	/**
	 * @param {User} user
	 */
	getRooms(user) {
		/** @type {any} */
		let roomsData = {official: [], pspl: [], chat: [], userCount: this.userCount, battleCount: this.battleCount};
		for (const room of this.chatRooms) {
			if (!room) continue;
			if (room.parent) continue;
			if (room.isPrivate && !(room.isPrivate === 'voice' && user.group !== ' ')) continue;
			let roomData = {
				title: room.title,
				desc: room.desc,
				userCount: room.userCount,
			};
			if (room.subRooms) roomData.subRooms = room.getSubRooms().map(room => room.title);

			if (room.isOfficial) {
				roomsData.official.push(roomData);
			// @ts-ignore
			} else if (room.pspl) {
				roomsData.pspl.push(roomData);
			} else {
				roomsData.chat.push(roomData);
			}
		}
		return roomsData;
	}
	checkModjoin(/** @type {User} */ user) {
		return true;
	}
	isMuted(/** @type {User} */ user) {
		return null;
	}
	/**
	 * @param {string} message
	 */
	send(message) {
		Sockets.channelBroadcast(this.id, message);
	}
	/**
	 * @param {string} message
	 */
	add(message) {
		// TODO: make sure this never happens
		return this;
	}
	/**
	 * @param {string} title
	 */
	addChatRoom(title) {
		let id = toId(title);
		if (id === 'battles' || id === 'rooms' || id === 'ladder' || id === 'teambuilder' || id === 'home' || id === 'all' || id === 'public') return false;
		if (Rooms.rooms.has(id)) return false;

		let chatRoomData = {
			title: title,
		};
		let room = Rooms.createChatRoom(id, title, chatRoomData);
		this.chatRoomDataList.push(chatRoomData);
		this.chatRooms.push(room);
		this.writeChatRoomData();
		return true;
	}

	/**
	 * @param {string} format
	 */
	prepBattleRoom(format) {
		//console.log('BATTLE START BETWEEN: ' + p1.userid + ' ' + p2.userid);
		let roomPrefix = `battle-${toId(Dex.getFormat(format).name)}-`;
		let battleNum = this.lastBattle;
		let roomid;
		do {
			roomid = `${roomPrefix}${++battleNum}`;
		} while (Rooms.rooms.has(roomid));

		this.lastBattle = battleNum;
		this.writeNumRooms();
		return roomid;
	}

	/**
	 * @param {User} p1
	 * @param {User} p2
	 * @param {GameRoom} room
	 * @param {AnyObject} options
	 */
	onCreateBattleRoom(p1, p2, room, options) {
		if (Config.reportbattles) {
			let reportRoom = Rooms(Config.reportbattles === true ? 'lobby' : Config.reportbattles);
			if (reportRoom) {
				reportRoom
					.add(`|b|${room.id}|${p1.getIdentity()}|${p2.getIdentity()}`)
					.update();
			}
		}
		if (Config.logladderip && options.rated) {
			this.ladderIpLog.write(
				`${p1.userid}: ${p1.latestIp}\n` +
				`${p2.userid}: ${p2.latestIp}\n`
			);
		}
	}

	/**
	 * @param {string} id
	 */
	deregisterChatRoom(id) {
		id = toId(id);
		let room = Rooms(id);
		if (!room) return false; // room doesn't exist
		if (!room.chatRoomData) return false; // room isn't registered
		// deregister from global chatRoomData
		// looping from the end is a pretty trivial optimization, but the
		// assumption is that more recently added rooms are more likely to
		// be deleted
		for (let i = this.chatRoomDataList.length - 1; i >= 0; i--) {
			if (id === toId(this.chatRoomDataList[i].title)) {
				this.chatRoomDataList.splice(i, 1);
				this.writeChatRoomData();
				break;
			}
		}
		delete room.chatRoomData;
		return true;
	}
	/**
	 * @param {string} id
	 */
	delistChatRoom(id) {
		id = toId(id);
		if (!Rooms.rooms.has(id)) return false; // room doesn't exist
		for (let i = this.chatRooms.length - 1; i >= 0; i--) {
			if (id === this.chatRooms[i].id) {
				this.chatRooms.splice(i, 1);
				break;
			}
		}
	}
	/**
	 * @param {string} id
	 */
	removeChatRoom(id) {
		id = toId(id);
		let room = Rooms(id);
		if (!room) return false; // room doesn't exist
		room.destroy();
		return true;
	}
	/**
	 * @param {User} user
	 * @param {Connection} connection
	 */
	autojoinRooms(user, connection) {
		// we only autojoin regular rooms if the client requests it with /autojoin
		// note that this restriction doesn't apply to staffAutojoin
		let includesLobby = false;
		for (const roomName of this.autojoinList) {
			user.joinRoom(roomName, connection);
			if (roomName === 'lobby') includesLobby = true;
		}
		if (!includesLobby && Config.serverid !== 'showdown') user.send(`>lobby\n|deinit`);
	}
	/**
	 * @param {User} user
	 * @param {Connection} [connection]
	 */
	checkAutojoin(user, connection) {
		if (!user.named) return;
		for (let [i, staffAutojoin] of this.staffAutojoinList.entries()) {
			let room = /** @type {ChatRoom} */ (Rooms(staffAutojoin));
			if (!room) {
				this.staffAutojoinList.splice(i, 1);
				i--;
				continue;
			}
			if (room.staffAutojoin === true && user.isStaff ||
					typeof room.staffAutojoin === 'string' && room.staffAutojoin.includes(user.group) ||
					room.auth && user.userid in room.auth) {
				// if staffAutojoin is true: autojoin if isStaff
				// if staffAutojoin is String: autojoin if user.group in staffAutojoin
				// if staffAutojoin is anything truthy: autojoin if user has any roomauth
				user.joinRoom(room.id, connection);
			}
		}
		for (const connection of user.connections) {
			if (connection.autojoins) {
				let autojoins = connection.autojoins.split(',');
				for (const roomName of autojoins) {
					user.tryJoinRoom(roomName, connection);
				}
				connection.autojoins = '';
			}
		}
	}
	/**
	 * @param {User} user
	 * @param {Connection} connection
	 */
	onConnect(user, connection) {
		let initdata = '|updateuser|' + user.name + '|' + (user.named ? '1' : '0') + '|' + user.avatar + '\n';
		connection.send(initdata + this.configRankList + this.formatListText);
		if (this.chatRooms.length > 2) connection.send('|queryresponse|rooms|null'); // should display room list
	}
	/**
	 * @param {User} user
	 * @param {Connection} connection
	 */
	onJoin(user, connection) {
		if (!user) return false; // ???
		if (this.users[user.userid]) return user;

		this.users[user.userid] = user;
		if (++this.userCount > this.maxUsers) {
			this.maxUsers = this.userCount;
			this.maxUsersDate = Date.now();
		}

		return user;
	}
	/**
	 * @param {User} user
	 * @param {string} oldid
	 * @param {boolean} joining
	 */
	onRename(user, oldid, joining) {
		delete this.users[oldid];
		this.users[user.userid] = user;
		return user;
	}
	/**
	 * @param {User} user
	 */
	onLeave(user) {
		if (!user) return; // ...
		if (!(user.userid in this.users)) {
			Monitor.crashlog(new Error(`user ${user.userid} already left`));
			return;
		}
		delete this.users[user.userid];
		this.userCount--;
	}
	/**
	 * @param {Error} err
	 * @param {boolean} slow
	 */
	startLockdown(err, slow = false) {
		if (this.lockdown && err) return;
		let devRoom = Rooms('development');
		// @ts-ignore
		const stack = (err ? Chat.escapeHTML(err.stack).split(`\n`).slice(0, 2).join(`<br />`) : ``);
		for (const [id, curRoom] of Rooms.rooms) {
			if (id === 'global') continue;
			if (err) {
				if (id === 'staff' || id === 'development' || (!devRoom && id === 'lobby')) {
					curRoom.addRaw(`<div class="broadcast-red"><b>The server needs to restart because of a crash:</b> ${stack}<br />Please restart the server.</div>`);
					curRoom.addRaw(`<div class="broadcast-red">You will not be able to start new battles until the server restarts.</div>`);
					curRoom.update();
				} else {
					curRoom.addRaw(`<div class="broadcast-red"><b>The server needs to restart because of a crash.</b><br />No new battles can be started until the server is done restarting.</div>`).update();
				}
			} else {
				curRoom.addRaw(`<div class="broadcast-red"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>`).update();
			}
			const game = curRoom.game;
			// @ts-ignore TODO: revisit when game.timer is standardized
			if (!slow && game && game.timer && typeof game.timer.start === 'function' && !game.ended) {
				// @ts-ignore
				game.timer.start();
				if (curRoom.modchat !== '+') {
					curRoom.modchat = '+';
					curRoom.addRaw(`<div class="broadcast-red"><b>Moderated chat was set to +!</b><br />Only users of rank + and higher can talk.</div>`).update();
				}
			}
		}
		for (const user of Users.users.values()) {
			user.send(`|pm|~|${user.group}${user.name}|/raw <div class="broadcast-red"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>`);
		}

		this.lockdown = true;
		this.lastReportedCrash = Date.now();
	}
	automaticKillRequest() {
		const notifyPlaces = ['development', 'staff', 'upperstaff'];
		if (Config.autolockdown === undefined) Config.autolockdown = true; // on by default

		if (Config.autolockdown && Rooms.global.lockdown === true && Rooms.global.battleCount === 0) {
			// The server is in lockdown, the final battle has finished, and the option is set
			// so we will now automatically kill the server here if it is not updating.
			if (Chat.updateServerLock) {
				this.notifyRooms(notifyPlaces, `|html|<div class="broadcast-red"><b>Automatic server lockdown kill canceled.</b><br /><br />The server tried to automatically kill itself upon the final battle finishing, but the server was updating while trying to kill itself.</div>`);
				return;
			}

			for (const worker of Sockets.workers.values()) worker.kill();

			// final warning
			this.notifyRooms(notifyPlaces, `|html|<div class="broadcast-red"><b>The server is about to automatically kill itself in 10 seconds.</b></div>`);

			// kill server in 10 seconds if it's still set to
			setTimeout(() => {
				if (Config.autolockdown && Rooms.global.lockdown === true) {
					// finally kill the server
					process.exit();
				} else {
					this.notifyRooms(notifyPlaces, `|html|<div class="broadcsat-red"><b>Automatic server lockdown kill canceled.</b><br /><br />In the last final seconds, the automatic lockdown was manually disabled.</div>`);
				}
			}, 10 * 1000);
		}
	}
	/**
	 * @param {string[]} rooms
	 * @param {string} message
	 */
	notifyRooms(rooms, message) {
		if (!rooms || !message) return;
		for (const roomid of rooms) {
			let curRoom = Rooms(roomid);
			if (curRoom) curRoom.add(message).update();
		}
	}
	/**
	 * @param {Error} err
	 */
	reportCrash(err) {
		if (this.lockdown) return;
		const time = Date.now();
		if (time - this.lastReportedCrash < CRASH_REPORT_THROTTLE) {
			return;
		}
		this.lastReportedCrash = time;
		// @ts-ignore
		const stack = (err ? Chat.escapeHTML(err.stack).split(`\n`).slice(0, 2).join(`<br />`) : ``);
		const crashMessage = `|html|<div class="broadcast-red"><b>The server has crashed:</b> ${stack}</div>`;
		const devRoom = Rooms('development');
		if (devRoom) {
			devRoom.add(crashMessage).update();
		} else {
			if (Rooms.lobby) Rooms.lobby.add(crashMessage).update();
			const staffRoom = Rooms('staff');
			if (staffRoom) staffRoom.add(crashMessage).update();
		}
	}
}

class BasicChatRoom extends BasicRoom {
	/**
	 * @param {string} roomid
	 * @param {string} [title]
	 * @param {AnyObject} [options]
	 */
	constructor(roomid, title, options = {}) {
		super(roomid, title);

		if (options.logTimes === undefined) options.logTimes = true;
		if (options.autoTruncate === undefined) options.autoTruncate = !options.isHelp;
		if (options.reportJoins === undefined) {
			options.reportJoins = !!Config.reportjoins || options.isPersonal;
		}
		if (options.batchJoins === undefined) {
			options.batchJoins = options.isPersonal ? 0 : Config.reportjoinsperiod || 0;
		}
		this.log = Roomlogs.create(this, options);

		/** @type {any} */
		// TODO: strongly type polls
		this.poll = null;

		// room settings
		this.desc = '';
		this.modchat = (Config.chatmodchat || false);
		this.filterStretching = false;
		this.filterEmojis = false;
		this.filterCaps = false;
		/** @type {false | number} */
		this.slowchat = false;
		this.introMessage = '';
		this.staffMessage = '';
		this.autojoin = false;
		this.staffAutojoin = /** @type {string | boolean} */ (false);

		/** @type {?true | RegExp} */
		this.banwordRegex = null;
		/** @type {string[]} */
		this.banwords = [];

		this.chatRoomData = (options.isPersonal ? null : options);
		Object.assign(this, options);
		if (this.auth) Object.setPrototypeOf(this.auth, null);
		/** @type {Room?} */
		this.parent = null;
		if (options.parentid) {
			const parent = Rooms(options.parentid);

			if (parent) {
				if (!parent.subRooms) parent.subRooms = new Map();
				parent.subRooms.set(this.id, /** @type {ChatRoom} */ (this));
				this.parent = parent;
			}
		}

		/** @type {Map<string, ChatRoom>?} */
		this.subRooms = null;

		/** @type {'chat' | 'battle'} */
		this.type = 'chat';
		/** @type {boolean} */
		this.active = false;
		// TypeScript bug: subclass null
		this.muteTimer = /** @type {NodeJS.Timer?} */ (null);

		if (Config.logchat) {
			this.roomlog('NEW CHATROOM: ' + this.id);
			if (Config.loguserstats) {
				this.logUserStatsInterval = setInterval(() => this.logUserStats(), Config.loguserstats);
			}
		}

		if (this.batchJoins) {
			this.userList = this.getUserList();
		}
		// TypeScript bug: subclass member
		this.reportJoinsInterval = /** @type {NodeJS.Timer?} */ (null);
		this.game = /** @type {RoomGame?} */ (null);
		this.battle = /** @type {RoomBattle?} */ (null);
	}

	/**
	 * Add a room message to the room log, so it shows up in the room
	 * for everyone, and appears in the scrollback for new users who
	 * join.
	 * @param {string} message
	 */
	add(message) {
		this.log.add(message);
		return this;
	}
	/**
	 * @param {string} message
	 */
	roomlog(message) {
		this.log.roomlog(message);
		return this;
	}
	/**
	 * @param {string} message
	 */
	modlog(message) {
		this.log.modlog(message);
		return this;
	}
	logUserStats() {
		let total = 0;
		let guests = 0;
		let groups = {};
		for (const group of Config.groupsranking) {
			groups[group] = 0;
		}
		for (let i in this.users) {
			let user = this.users[i];
			++total;
			if (!user.named) {
				++guests;
			}
			if (this.auth && this.auth[user.userid] && this.auth[user.userid] in groups) {
				++groups[this.auth[user.userid]];
			} else {
				++groups[user.group];
			}
		}
		let entry = '|userstats|total:' + total + '|guests:' + guests;
		for (let i in groups) {
			entry += '|' + i + ':' + groups[i];
		}
		this.roomlog(entry);
	}

	update() {
		if (!this.log.broadcastBuffer) return;
		if (this.reportJoinsInterval) {
			clearInterval(this.reportJoinsInterval);
			this.reportJoinsInterval = null;
			this.userList = this.getUserList();
		}
		this.send(this.log.broadcastBuffer);
		this.log.broadcastBuffer = '';
		this.log.truncate();

		this.pokeExpireTimer();
	}
	pokeExpireTimer() {
		if (this.expireTimer) clearTimeout(this.expireTimer);
		if ((this.isPersonal && !this.isHelp) || (this.isHelp && this.isHelp !== 'open')) {
			this.expireTimer = setTimeout(() => this.expire(), TIMEOUT_INACTIVE_DEALLOCATE);
		} else {
			this.expireTimer = null;
		}
	}
	expire() {
		this.send('|expire|');
		this.destroy();
	}
	/**
	 * @param {'j' | 'l' | 'n'} type
	 * @param {string} entry
	 */
	reportJoin(type, entry) {
		if (this.reportJoins) {
			this.add(`|${type}|${entry}`).update();
			return;
		}
		let ucType = '';
		switch (type) {
		case 'j': ucType = 'J'; break;
		case 'l': ucType = 'L'; break;
		case 'n': ucType = 'N'; break;
		}
		entry = `|${ucType}|${entry}`;
		if (this.batchJoins) {
			this.log.broadcastBuffer += entry;

			if (!this.reportJoinsInterval) {
				this.reportJoinsInterval = setTimeout(
					() => this.update(), this.batchJoins
				);
			}
		} else {
			this.send(entry);
		}
		this.roomlog(entry);
	}
	/**
	 * @param {User} user
	 */
	getIntroMessage(user) {
		let message = '';
		if (this.introMessage) message += '\n|raw|<div class="infobox infobox-roomintro"><div' + (!this.isOfficial ? ' class="infobox-limited"' : '') + '>' + this.introMessage.replace(/\n/g, '') + '</div>';
		if (this.staffMessage && user.can('mute', null, this)) message += (message ? '<br />' : '\n|raw|<div class="infobox">') + '(Staff intro:)<br /><div>' + this.staffMessage.replace(/\n/g, '') + '</div>';
		if (this.modchat) {
			message += (message ? '<br />' : '\n|raw|<div class="infobox">') + '<div class="broadcast-red">' +
				'Must be rank ' + this.modchat + ' or higher to talk right now.' +
				'</div>';
		}
		if (this.slowchat && user.can('mute', null, this)) {
			message += (message ? '<br />' : '\n|raw|<div class="infobox">') + '<div class="broadcast-red">' +
				'Messages must have at least ' + this.slowchat + ' seconds between them.' +
				'</div>';
		}
		if (message) message += '</div>';
		return message;
	}
	/**
	 * @param {boolean} includeSecret
	 * @return {ChatRoom[]}
	 */
	getSubRooms(includeSecret = false) {
		if (!this.subRooms) return [];
		return [...this.subRooms.values()].filter(room =>
			!room.isPrivate || includeSecret
		);
	}
	/**
	 * @param {User} user
	 * @param {Connection} connection
	 */
	onConnect(user, connection) {
		let userList = this.userList ? this.userList : this.getUserList();
		this.sendUser(connection, '|init|chat\n|title|' + this.title + '\n' + userList + '\n' + this.log.getScrollback() + this.getIntroMessage(user));
		if (this.poll) this.poll.onConnect(user, connection);
		if (this.game && this.game.onConnect) this.game.onConnect(user, connection);
	}
	/**
	 * @param {User} user
	 * @param {Connection} connection
	 */
	onJoin(user, connection) {
		if (!user) return false; // ???
		if (this.users[user.userid]) return false;

		if (user.named) {
			this.reportJoin('j', user.getIdentity(this.id));
		}

		this.users[user.userid] = user;
		this.userCount++;

		if (this.poll) this.poll.onConnect(user, connection);
		if (this.game && this.game.onJoin) this.game.onJoin(user, connection);
		return true;
	}
	/**
	 * @param {User} user
	 * @param {string} oldid
	 * @param {boolean} joining
	 */
	onRename(user, oldid, joining) {
		if (user.userid === oldid) {
			return this.onUpdateIdentity(user);
		}
		if (!this.users[oldid]) {
			Monitor.crashlog(new Error(`user ${oldid} not in room ${this.id}`));
		}
		if (this.users[user.userid]) {
			Monitor.crashlog(new Error(`user ${user.userid} already in room ${this.id}`));
		}
		delete this.users[oldid];
		this.users[user.userid] = user;
		if (joining) {
			this.reportJoin('j', user.getIdentity(this.id));
			if (this.staffMessage && user.can('mute', null, this)) this.sendUser(user, '|raw|<div class="infobox">(Staff intro:)<br /><div>' + this.staffMessage.replace(/\n/g, '') + '</div></div>');
		} else if (!user.named) {
			this.reportJoin('l', oldid);
		} else {
			this.reportJoin('n', user.getIdentity(this.id) + '|' + oldid);
		}
		if (this.poll && user.userid in this.poll.voters) this.poll.updateFor(user);
		return true;
	}
	/**
	 * onRename, but without a userid change
	 * @param {User} user
	 */
	onUpdateIdentity(user) {
		if (user && user.connected && user.named) {
			if (!this.users[user.userid]) return false;
			this.reportJoin('n', user.getIdentity(this.id) + '|' + user.userid);
		}
		return true;
	}
	/**
	 * @param {User} user
	 */
	onLeave(user) {
		if (!user) return false; // ...

		if (!(user.userid in this.users)) {
			Monitor.crashlog(new Error(`user ${user.userid} already left`));
			return false;
		}
		delete this.users[user.userid];
		this.userCount--;

		if (user.named) {
			this.reportJoin('l', user.getIdentity(this.id));
		}
		if (this.game && this.game.onLeave) this.game.onLeave(user);
		return true;
	}
	destroy() {
		// deallocate ourself

		if (this.battle && this.tour) {
			// resolve state of the tournament;
			// @ts-ignore
			if (!this.battle.ended) this.tour.onBattleWin(this, '');
			this.tour = null;
		}

		// remove references to ourself
		for (let i in this.users) {
			// @ts-ignore
			this.users[i].leaveRoom(this, null, true);
			delete this.users[i];
		}

		if (this.parent && this.parent.subRooms) {
			this.parent.subRooms.delete(this.id);
			if (!this.parent.subRooms.size) this.parent.subRooms = null;
		}

		Rooms.global.deregisterChatRoom(this.id);
		Rooms.global.delistChatRoom(this.id);

		if (this.aliases) {
			for (const alias of this.aliases) {
				Rooms.aliases.delete(alias);
			}
		}

		if (this.game) {
			this.game.destroy();
			this.game = null;
			this.battle = null;
		}
		this.active = false;

		// Clear any active timers for the room
		if (this.muteTimer) {
			clearTimeout(this.muteTimer);
			this.muteTimer = null;
		}
		if (this.expireTimer) {
			clearTimeout(this.expireTimer);
			this.expireTimer = null;
		}
		if (this.reportJoinsInterval) {
			clearInterval(this.reportJoinsInterval);
		}
		this.reportJoinsInterval = null;
		if (this.logUserStatsInterval) {
			clearInterval(this.logUserStatsInterval);
		}
		this.logUserStatsInterval = null;

		this.log.destroy();

		// get rid of some possibly-circular references
		Rooms.rooms.delete(this.id);
	}
}

class ChatRoom extends BasicChatRoom {
	// This is not actually used, this is just a fake class to keep
	// TypeScript happy
	constructor() {
		super('');
		this.battle = null;
		this.active = false;
		/** @type {'chat'} */
		this.type = 'chat';
	}
}

class GameRoom extends BasicChatRoom {
	/**
	 * @param {string} roomid
	 * @param {string} [title]
	 * @param {AnyObject} [options]
	 */
	constructor(roomid, title, options = {}) {
		options.logTimes = false;
		options.autoTruncate = false;
		options.isMultichannel = true;
		options.reportJoins = !!Config.reportbattlejoins;
		options.batchJoins = 0;
		super(roomid, title, options);
		this.modchat = (Config.battlemodchat || false);

		/** @type {'battle'} */
		this.type = 'battle';

		this.modchatUser = '';
		this.active = false;

		this.format = options.format || '';
		this.auth = Object.create(null);
		//console.log("NEW BATTLE");

		this.tour = options.tour || null;
		this.parent = options.parent || (this.tour && this.tour.room) || null;

		this.p1 = options.p1 || null;
		this.p2 = options.p2 || null;

		/**
		 * The lower player's rating, for searching purposes.
		 * 0 for unrated battles. 1 for unknown ratings.
		 * @type {number}
		 */
		this.rated = options.rated || 0;
		/** @type {RoomBattle?} */
		this.battle = null;
		/** @type {RoomGame} */
		// @ts-ignore
		this.game = null;
	}
	/**
	 * - logNum = 0    : spectator log (no exact HP)
	 * - logNum = 1, 2 : player log (exact HP for that player)
	 * - logNum = 3    : debug log (exact HP for all players)
	 * @param {0 | 1 | 2 | 3} channel
	 */
	getLog(channel = 0) {
		return this.log.getScrollback(channel);
	}
	/**
	 * @param {User} user
	 */
	getLogForUser(user) {
		if (!(user.userid in this.game.players)) return this.getLog();
		return this.getLog(this.game.players[user.userid].slotNum + 1);
	}
	/**
	 * @param {User?} excludeUser
	 */
	update(excludeUser = null) {
		if (!this.log.broadcastBuffer) return;

		if (this.userCount) {
			Sockets.subchannelBroadcast(this.id, '>' + this.id + '\n\n' + this.log.broadcastBuffer);
		}
		this.log.broadcastBuffer = '';

		this.pokeExpireTimer();
	}
	pokeExpireTimer() {
		// empty rooms time out after ten minutes
		if (!this.userCount) {
			if (this.expireTimer) clearTimeout(this.expireTimer);
			this.expireTimer = setTimeout(() => this.expire(), TIMEOUT_EMPTY_DEALLOCATE);
		} else {
			if (this.expireTimer) clearTimeout(this.expireTimer);
			this.expireTimer = setTimeout(() => this.expire(), TIMEOUT_INACTIVE_DEALLOCATE);
		}
	}
	/**
	 * @param {0 | 1} num
	 * @param {string} message
	 */
	sendPlayer(num, message) {
		let player = this.getPlayer(num);
		if (!player) return false;
		player.sendRoom(message);
	}
	/**
	 * @param {0 | 1} num
	 */
	getPlayer(num) {
		// @ts-ignore
		return this.game['p' + (num + 1)];
	}
	/**
	 * @param {User} user
	 */
	requestModchat(user) {
		if (user === null) {
			this.modchatUser = '';
			return;
		} else if (user.can('modchat') || !this.modchatUser || this.modchatUser === user.userid) {
			this.modchatUser = user.userid;
			return;
		} else {
			return "Invite-only can only be turned off by the user who turned it on, or staff";
		}
	}
	/**
	 * @param {User} user
	 * @param {Connection} connection
	 */
	onConnect(user, connection) {
		this.sendUser(connection, '|init|battle\n|title|' + this.title + '\n' + this.getLogForUser(user));
		if (this.game && this.game.onConnect) this.game.onConnect(user, connection);
	}
}

/**
 * @param {string | Room} [roomid]
 * @return {Room}
 */
function getRoom(roomid) {
	// @ts-ignore
	if (roomid && roomid.id) return roomid;
	// @ts-ignore
	return Rooms.rooms.get(roomid);
}

/** @typedef {GlobalRoom | GameRoom | ChatRoom} Room */

let Rooms = Object.assign(getRoom, {
	/**
	 * The main roomid:Room table. Please do not hold a reference to a
	 * room long-term; just store the roomid and grab it from here (with
	 * the Rooms(roomid) accessor) when necessary.
	 * @type {Map<string, Room>}
	 */
	rooms: new Map(),
	/** @type {Map<string, string>} */
	aliases: new Map(),

	get: getRoom,
	/**
	 * @param {string} name
	 * @return {Room | undefined}
	 */
	search(name) {
		return getRoom(name) || getRoom(toId(name)) || getRoom(Rooms.aliases.get(toId(name)));
	},

	/**
	 * @param {string} roomid
	 * @param {string} title
	 * @param {AnyObject} options
	 */
	createGameRoom(roomid, title, options) {
		if (Rooms.rooms.has(roomid)) throw new Error(`Room ${roomid} already exists`);
		Monitor.debug("NEW BATTLE ROOM: " + roomid);
		const room = new GameRoom(roomid, title, options);
		Rooms.rooms.set(roomid, room);
		return room;
	},
	/**
	 * @param {string} roomid
	 * @param {string} title
	 * @param {AnyObject} options
	 */
	createChatRoom(roomid, title, options) {
		if (Rooms.rooms.has(roomid)) throw new Error(`Room ${roomid} already exists`);
		const room = /** @type {ChatRoom} */ (new BasicChatRoom(roomid, title, options));
		Rooms.rooms.set(roomid, room);
		return room;
	},
	/**
	 * @param {string} formatid
	 * @param {AnyObject} options
	 */
	createBattle(formatid, options) {
		const p1 = /** @type {User?} */ (options.p1);
		const p2 = /** @type {User?} */ (options.p2);
		if (p1 && p1 === p2) throw new Error(`Players can't battle themselves`);
		if (p1) Ladders.cancelSearches(p1);
		if (p2) Ladders.cancelSearches(p2);

		if (Rooms.global.lockdown === true) {
			if (p1) p1.popup("The server is restarting. Battles will be available again in a few minutes.");
			if (p2) p2.popup("The server is restarting. Battles will be available again in a few minutes.");
			return;
		}

		const roomid = Rooms.global.prepBattleRoom(formatid);
		options.format = formatid;
		// options.rated is a number representing the lower player rating, for searching purposes
		// options.rated < 0 or falsy means "unrated", and will be converted to 0 here
		// options.rated === true is converted to 1 (used in tests sometimes)
		options.rated = Math.max(+options.rated || 0, 0);
		const p1name = p1 ? p1.name : "Player 1";
		const p2name = p2 ? p2.name : "Player 2";
		const room = Rooms.createGameRoom(roomid, "" + p1name + " vs. " + p2name, options);
		// @ts-ignore TODO: make RoomBattle a subclass of RoomGame
		room.game = new Rooms.RoomBattle(room, formatid, options);

		let inviteOnly = (options.inviteOnly || []);
		if (p1 && p1.inviteOnlyNextBattle) {
			inviteOnly.push(p1.userid);
			p1.inviteOnlyNextBattle = false;
		}
		if (p2 && p2.inviteOnlyNextBattle) {
			inviteOnly.push(p2.userid);
			p2.inviteOnlyNextBattle = false;
		}
		if (options.tour && !room.tour.modjoin) inviteOnly = [];
		if (inviteOnly.length) {
			room.modjoin = '+';
			room.isPrivate = 'hidden';
			room.privacySetter = new Set(inviteOnly);
			room.add(`|raw|<div class="broadcast-red"><strong>This battle is invite-only!</strong><br />Users must be rank + or invited with <code>/invite</code> to join</div>`);
		}

		if (p1) p1.joinRoom(room);
		if (p2) p2.joinRoom(room);
		if (p1) Monitor.countBattle(p1.latestIp, p1.name);
		if (p2) Monitor.countBattle(p2.latestIp, p2.name);
		return room;
	},

	battleModlogStream: FS('logs/modlog/modlog_battle.txt').createAppendStream(),
	groupchatModlogStream: FS('logs/modlog/modlog_groupchat.txt').createAppendStream(),

	// @ts-ignore
	global: (/** @type {GlobalRoom} */ (null)),
	/** @type {?ChatRoom} */
	lobby: null,

	BasicRoom: BasicRoom,
	GlobalRoom: GlobalRoom,
	GameRoom: GameRoom,
	ChatRoom: BasicChatRoom,
	ChatRoomTypeForTS: ChatRoom,

	RoomGame: require('./room-game').RoomGame,
	RoomGamePlayer: require('./room-game').RoomGamePlayer,

	RETRY_AFTER_LOGIN,

	Roomlogs: Roomlogs,

	RoomBattle: require('./room-battle').RoomBattle,
	RoomBattlePlayer: require('./room-battle').RoomBattlePlayer,
	PM: require('./room-battle').PM,
});

// initialize

Monitor.notice("NEW GLOBAL: global");
Rooms.global = new GlobalRoom('global');

Rooms.rooms.set('global', Rooms.global);

module.exports = Rooms;
