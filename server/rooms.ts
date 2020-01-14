/**
 * Rooms
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Every chat room and battle is a room, and what they do is done in
 * rooms.ts. There's also a global room which every user is in, and
 * handles miscellaneous things like welcoming the user.
 *
 * @license MIT
 */

'use strict';

const TIMEOUT_EMPTY_DEALLOCATE = 10 * 60 * 1000;
const TIMEOUT_INACTIVE_DEALLOCATE = 40 * 60 * 1000;
const REPORT_USER_STATS_INTERVAL = 10 * 60 * 1000;

const CRASH_REPORT_THROTTLE = 60 * 60 * 1000;

const LAST_BATTLE_WRITE_THROTTLE = 10;

const RETRY_AFTER_LOGIN = null;

import {FS} from '../lib/fs';
import {WriteStream} from '../lib/streams';
import {PM as RoomBattlePM, RoomBattle, RoomBattlePlayer, RoomBattleTimer} from "./room-battle";
import {RoomGame, RoomGamePlayer} from './room-game';
import {Roomlogs} from './roomlogs';

/*********************************************************
 * the Room object.
 *********************************************************/

interface MuteEntry {
	userid: ID;
	time: number;
	guestNum: number;
	autoconfirmed: string;
}

interface ChatRoomTable {
	title: string;
	desc: string;
	userCount: number;
	subRooms?: string[];
}

interface BattleRoomTable {
	p1?: string;
	p2?: string;
	minElo?: 'tour' | number;
}

export type Room = GlobalRoom | GameRoom | ChatRoom;
type Poll = import('./chat-plugins/poll').Poll;
type Announcement = import('./chat-plugins/announcements').Announcement;
type Tournament = import('./tournaments/index').Tournament;

export abstract class BasicRoom {
	readonly type: 'chat' | 'battle' | 'global';
	readonly users: {[userid: string]: User};
	/**
	 * Scrollback log. This is the log that's sent to users when
	 * joining the room. Should roughly match what's on everyone's
	 * screen.
	 */
	readonly log: Roomlog | null;
	readonly battle: RoomBattle | null;
	readonly muteQueue: MuteEntry[];
	roomid: RoomID;
	title: string;
	parent: Room | null;
	aliases: string[] | null;
	userCount: number;
	auth: {[userid: string]: GroupSymbol} | null;
	game: RoomGame | null;
	active: boolean;
	muteTimer: NodeJS.Timer | null;
	lastUpdate: number;
	lastBroadcast: string;
	lastBroadcastTime: number;
	chatRoomData: AnyObject | null;
	isPrivate: boolean | 'hidden' | 'voice';
	hideReplay: boolean;
	isPersonal: boolean;
	isHelp: boolean;
	isOfficial: boolean;
	reportJoins: boolean;
	batchJoins: number;
	reportJoinsInterval: NodeJS.Timer | null;
	logTimes: boolean;
	modjoin: string | true | null;
	modchat: string | null;
	staffRoom: boolean;
	language: string | false;
	slowchat: number | false;
	filterStretching: boolean;
	filterEmojis: boolean;
	filterCaps: boolean;
	mafiaDisabled: boolean;
	unoDisabled: boolean;
	blackjackDisabled: boolean;
	hangmanDisabled: boolean;
	toursEnabled: '%' | boolean;
	tourAnnouncements: boolean;
	privacySetter: Set<ID> | null;
	subRooms: Map<string, ChatRoom> | null;
	gameNumber: number;
	highTraffic: boolean;
	constructor(roomid: RoomID, title?: string) {
		this.users = Object.create(null);
		this.type = 'chat';
		this.log = null;
		this.battle = null;
		this.muteQueue = [];

		this.roomid = roomid;
		this.title = (title || roomid);
		this.parent = null;
		this.aliases = null;

		this.userCount = 0;

		this.auth = null;

		this.game = null;
		this.active = false;

		this.muteTimer = null;

		this.lastUpdate = 0;
		this.lastBroadcast = '';
		this.lastBroadcastTime = 0;

		// room settings

		this.chatRoomData = null;
		this.isPrivate = false;
		this.hideReplay = false;
		this.isPersonal = false;
		this.isHelp = false;
		this.isOfficial = false;
		this.reportJoins = true;
		this.batchJoins = 0;
		this.reportJoinsInterval = null;

		this.logTimes = false;
		this.modjoin = null;
		this.modchat = null;
		this.staffRoom = false;
		this.language = false;
		this.slowchat = false;
		this.filterStretching = false;
		this.filterEmojis = false;
		this.filterCaps = false;
		this.mafiaDisabled = false;
		this.unoDisabled = false;
		this.blackjackDisabled = false;
		this.hangmanDisabled = false;
		this.toursEnabled = false;
		this.tourAnnouncements = false;
		this.privacySetter = null;
		this.subRooms = null;
		this.gameNumber = 0;
		this.highTraffic = false;
	}

	/**
	 * Send a room message to all users in the room, without recording it
	 * in the scrollback log.
	 */
	send(message: string) {
		if (this.roomid !== 'lobby') message = '>' + this.roomid + '\n' + message;
		if (this.userCount) Sockets.roomBroadcast(this.roomid, message);
	}
	sendAuth() { throw new Error(`Obsolete command; use room.sendMods`); }
	sendModCommand() { throw new Error(`Obsolete command; use room.sendMods`); }
	push() { throw new Error(`Obsolete command; use room.add`); }
	sendMods(data: string) {
		this.sendRankedUsers(data, '%');
	}
	sendRankedUsers(data: string, minRank: GroupSymbol = '+') {
		if (this.staffRoom) {
			if (!this.log) throw new Error(`Staff room ${this.roomid} has no log`);
			this.log.add(data);
			return;
		}

		for (const i in this.users) {
			const user = this.users[i];
			// hardcoded for performance reasons (this is an inner loop)
			if (user.isStaff || (this.auth && this.auth[user.id] && this.auth[user.id] in Config.groups
				 && Config.groups[this.auth[user.id]].rank >= Config.groups[minRank].rank)) {
				user.sendTo(this, data);
			}
		}
	}
	/**
	 * Send a room message to a single user.
	 */
	sendUser(user: User | Connection, message: string) {
		user.sendTo(this, message);
	}
	/**
	 * Add a room message to the room log, so it shows up in the room
	 * for everyone, and appears in the scrollback for new users who
	 * join.
	 */
	add(message: string): this { throw new Error(`should be implemented by subclass`); }
	roomlog(message: string) { throw new Error(`should be implemented by subclass`); }
	modlog(message: string) { throw new Error(`should be implemented by subclass`); }
	logEntry() { throw new Error(`room.logEntry has been renamed room.roomlog`); }
	addLogMessage() { throw new Error(`room.addLogMessage has been renamed room.addByUser`); }
	/**
	 * Inserts (sanitized) HTML into the room log.
	 */
	addRaw(message: string) {
		return this.add('|raw|' + message);
	}
	/**
	 * Inserts some text into the room log, attributed to user. The
	 * attribution will not appear, and is used solely as a hint not to
	 * highlight the user.
	 */
	addByUser(user: User, text: string) {
		return this.add('|c|' + user.getIdentity(this.roomid) + '|/log ' + text).update();
	}
	/**
	 * Like addByUser, but without logging
	 */
	sendByUser(user: User, text: string) {
		return this.send('|c|' + user.getIdentity(this.roomid) + '|/log ' + text);
	}
	/**
	 * Like addByUser, but sends to mods only.
	 */
	sendModsByUser(user: User, text: string) {
		return this.sendMods('|c|' + user.getIdentity(this.roomid) + '|/log ' + text);
	}
	update() {}

	toString() {
		return this.roomid;
	}

	getUserList() {
		let buffer = '';
		let counter = 0;
		for (const i in this.users) {
			if (!this.users[i].named) {
				continue;
			}
			counter++;
			buffer += ',' + this.users[i].getIdentityWithStatus(this.roomid);
		}
		const msg = `|users|${counter}${buffer}`;
		return msg;
	}

	// mute handling

	runMuteTimer(forceReschedule = false) {
		if (forceReschedule && this.muteTimer) {
			clearTimeout(this.muteTimer);
			this.muteTimer = null;
		}
		if (this.muteTimer || this.muteQueue.length === 0) return;

		const timeUntilExpire = this.muteQueue[0].time - Date.now();
		if (timeUntilExpire <= 1000) { // one second of leeway
			this.unmute(this.muteQueue[0].userid, "Your mute in '" + this.title + "' has expired.");
			// runMuteTimer() is called again in unmute() so this function instance should be closed
			return;
		}
		this.muteTimer = setTimeout(() => {
			this.muteTimer = null;
			this.runMuteTimer(true);
		}, timeUntilExpire);
	}
	isMuted(user: User): ID | undefined {
		if (!user) return;
		if (this.muteQueue) {
			for (const entry of this.muteQueue) {
				if (user.id === entry.userid ||
					user.guestNum === entry.guestNum ||
					(user.autoconfirmed && user.autoconfirmed === entry.autoconfirmed)) {
					if (entry.time - Date.now() < 0) {
						this.unmute(user.id);
						return;
					} else {
						return entry.userid;
					}
				}
			}
		}
		if (this.parent) return this.parent.isMuted(user);
	}
	getMuteTime(user: User): number | undefined {
		const userid = this.isMuted(user);
		if (!userid) return;
		for (const entry of this.muteQueue) {
			if (userid === entry.userid) {
				return entry.time - Date.now();
			}
		}
		if (this.parent) return this.parent.getMuteTime(user);
	}
	/**
	 * Gets the group symbol of a user in the room.
	 */
	getAuth(user: User): GroupSymbol {
		if (this.auth && user.id in this.auth) {
			return this.auth[user.id];
		}
		if (this.parent) {
			return this.parent.getAuth(user);
		}
		if (this.auth && this.isPrivate === true) {
			return ' ';
		}
		return user.group;
	}
	checkModjoin(user: User) {
		if (this.staffRoom && !user.isStaff && (!this.auth || (this.auth[user.id] || ' ') === ' ')) return false;
		if (user.id in this.users) return true;
		if (!this.modjoin) return true;
		// users with a room rank can always join
		if (this.auth && user.id in this.auth) return true;
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
		if (!(modjoinGroup in Config.groups)) throw new Error(`Invalid modjoin setting in ${this.roomid}: ${modjoinGroup}`);
		return Config.groups[userGroup].rank >= Config.groups[modjoinGroup].rank;
	}
	mute(user: User, setTime?: number) {
		const userid = user.id;

		if (!setTime) setTime = 7 * 60000; // default time: 7 minutes
		if (setTime > 90 * 60000) setTime = 90 * 60000; // limit 90 minutes

		// If the user is already muted, the existing queue position for them should be removed
		if (this.isMuted(user)) this.unmute(userid);

		// Place the user in a queue for the unmute timer
		for (let i = 0; i <= this.muteQueue.length; i++) {
			const time = Date.now() + setTime;
			if (i === this.muteQueue.length || time < this.muteQueue[i].time) {
				const entry = {
					userid,
					time,
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

		user.updateIdentity();

		if (!(this.isPrivate === true || this.isPersonal || this.battle)) Punishments.monitorRoomPunishments(user);

		return userid;
	}
	unmute(userid: string, notifyText?: string) {
		let successUserid = '';
		const user = Users.get(userid);
		let autoconfirmed = '';
		if (user) {
			userid = user.id;
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
			user.updateIdentity();
			if (notifyText) user.popup(notifyText);
		}
		return successUserid;
	}

	onUpdateIdentity(user: User) {}
	destroy() {}
}

export class GlobalRoom extends BasicRoom {
	readonly type: 'global';
	readonly active: false;
	readonly chatRoomData: null;
	readonly chatRoomDataList: AnyObject[];
	readonly chatRooms: ChatRoom[];
	/**
	 * Rooms that users autojoin upon connecting
	 */
	readonly autojoinList: RoomID[];
	/**
	 * Rooms that staff autojoin upon connecting
	 */
	readonly staffAutojoinList: RoomID[];
	readonly ladderIpLog: WriteStream;
	readonly users: {[userid: string]: User};
	readonly reportUserStatsInterval: NodeJS.Timeout;
	readonly modlogStream: WriteStream;
	lockdown: boolean | 'pre' | 'ddos';
	battleCount: number;
	lastReportedCrash: number;
	lastBattle: number;
	lastWrittenBattle: number;
	userCount: number;
	maxUsers: number;
	maxUsersDate: number;
	formatList: string;
	constructor(roomid: RoomID) {
		if (roomid !== 'global') throw new Error(`The global room's room ID must be 'global'`);
		super(roomid);

		this.type = 'global';
		this.active = false;
		this.chatRoomData = null;
		this.chatRoomDataList = [];
		try {
			this.chatRoomDataList = require('../config/chatrooms.json');
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

		this.chatRooms = [];

		this.autojoinList = [];
		this.staffAutojoinList = [];
		for (const [i, chatRoomData] of this.chatRoomDataList.entries()) {
			if (!chatRoomData || !chatRoomData.title) {
				Monitor.warn(`ERROR: Room number ${i} has no data and could not be loaded.`);
				continue;
			}
			// We're okay with assinging type `ID` to `RoomID` here
			// because the hyphens in chatrooms don't have any special
			// meaning, unlike in helptickets, groupchats, battles etc
			// where they are used for shared modlogs and the like
			const id = toID(chatRoomData.title) as RoomID;
			Monitor.notice("NEW CHATROOM: " + id);
			const room = Rooms.createChatRoom(id, chatRoomData.title, chatRoomData);
			if (room.aliases) {
				for (const alias of room.aliases) {
					Rooms.aliases.set(alias, id);
				}
			}
			this.chatRooms.push(room);
			if (room.autojoin) this.autojoinList.push(id);
			if (room.staffAutojoin) this.staffAutojoinList.push(id);
		}
		Rooms.lobby = Rooms.rooms.get('lobby' as RoomID) as ChatRoom;

		// init battle room logging
		if (Config.logladderip) {
			this.ladderIpLog = FS('logs/ladderip/ladderip.txt').createAppendStream();
		} else {
			// Prevent there from being two possible hidden classes an instance
			// of GlobalRoom can have.
			this.ladderIpLog = new WriteStream({write() { return undefined; }});
		}
		// Create writestream for modlog
		this.modlogStream = FS('logs/modlog/modlog_global.txt').createAppendStream();

		this.reportUserStatsInterval = setInterval(
			() => this.reportUserStats(),
			REPORT_USER_STATS_INTERVAL
		);

		// init users
		this.users = Object.create(null);
		this.userCount = 0; // cache of `size(this.users)`
		this.maxUsers = 0;
		this.maxUsersDate = 0;
		this.lockdown = false;

		this.battleCount = 0;
		this.lastReportedCrash = 0;

		this.formatList = '';

		let lastBattle;
		try {
			lastBattle = FS('logs/lastbattle.txt').readSync('utf8');
		} catch (e) {}
		this.lastBattle = Number(lastBattle) || 0;
		this.lastWrittenBattle = this.lastBattle;
	}

	modlog(message: string) {
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
		if (this.lockdown) {
			if (this.lastBattle === this.lastWrittenBattle) return;
			this.lastWrittenBattle = this.lastBattle;
		} else {
			// batch writes so we don't have to write them every new battle
			// very probably premature optimization, considering by default we
			// write significantly larger log files every new battle
			if (this.lastBattle < this.lastWrittenBattle) return;
			this.lastWrittenBattle = this.lastBattle + LAST_BATTLE_WRITE_THROTTLE;
		}
		FS('logs/lastbattle.txt').writeUpdate(() =>
			`${this.lastWrittenBattle}`
		);
	}

	reportUserStats() {
		if (this.maxUsersDate) {
			void LoginServer.request('updateuserstats', {
				date: this.maxUsersDate,
				users: this.maxUsers,
			});
			this.maxUsersDate = 0;
		}
		void LoginServer.request('updateuserstats', {
			date: Date.now(),
			users: this.userCount,
		});
	}

	get formatListText() {
		if (this.formatList) {
			return this.formatList;
		}
		this.formatList = '|formats' + (Ladders.formatsListPrefix || '');
		let section = '';
		let prevSection = '';
		let curColumn = 1;
		for (const i in Dex.formats) {
			const format = Dex.formats[i];
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

		for (const rank in Config.groups) {
			if (!Config.groups[rank] || !rank) continue;

			const tarGroup = Config.groups[rank];
			const groupType = tarGroup.addhtml || (!tarGroup.mute && !tarGroup.root)
				? 'normal' : (tarGroup.root || tarGroup.declare) ? 'leadership' : 'staff';

			rankList.push({
				symbol: rank,
				name: (Config.groups[rank].name || null),
				type: groupType}); // send the first character in the rank, incase they put a string several characters long
		}

		const typeOrder = ['punishment', 'normal', 'staff', 'leadership'];

		rankList = rankList.sort((a, b) => typeOrder.indexOf(b.type) - typeOrder.indexOf(a.type));

		// add the punishment types at the very end.
		for (const rank in Config.punishgroups) {
			rankList.push({symbol: Config.punishgroups[rank].symbol, name: Config.punishgroups[rank].name, type: 'punishment'});
		}

		Config.rankList = '|customgroups|' + JSON.stringify(rankList) + '\n';
		return Config.rankList;
	}

	getBattles(/** "formatfilter, elofilter, usernamefilter */ filter: string) {
		const rooms: GameRoom[] = [];
		let skipCount = 0;
		const [formatFilter, eloFilterString, usernameFilter] = filter.split(',');
		const eloFilter = +eloFilterString;
		if (this.battleCount > 150 && !formatFilter && !eloFilter && !usernameFilter) {
			skipCount = this.battleCount - 150;
		}
		for (const room of Rooms.rooms.values()) {
			if (!room || !room.active || room.isPrivate) continue;
			if (room.type !== 'battle') continue;
			if (formatFilter && formatFilter !== room.format) continue;
			if (eloFilter && (!room.rated || room.rated < eloFilter)) continue;
			if (usernameFilter && room.battle) {
				const p1userid = room.battle.p1.id;
				const p2userid = room.battle.p2.id;
				if (!p1userid || !p2userid) continue;
				if (!p1userid.startsWith(usernameFilter) && !p2userid.startsWith(usernameFilter)) continue;
			}
			if (skipCount && skipCount--) continue;

			rooms.push(room);
		}

		const roomTable: {[roomid: string]: BattleRoomTable} = {};
		for (let i = rooms.length - 1; i >= rooms.length - 100 && i >= 0; i--) {
			const room = rooms[i];
			const roomData: BattleRoomTable = {};
			if (room.active && room.battle) {
				if (room.battle.p1) roomData.p1 = room.battle.p1.name;
				if (room.battle.p2) roomData.p2 = room.battle.p2.name;
				if (room.tour) roomData.minElo = 'tour';
				if (room.rated) roomData.minElo = Math.floor(room.rated);
			}
			if (!roomData.p1 || !roomData.p2) continue;
			roomTable[room.roomid] = roomData;
		}
		return roomTable;
	}
	getRooms(user: User) {
		const roomsData: {
			official: ChatRoomTable[], pspl: ChatRoomTable[], chat: ChatRoomTable[], userCount: number, battleCount: number;
		} = {
			official: [],
			pspl: [],
			chat: [],
			userCount: this.userCount,
			battleCount: this.battleCount,
		};
		for (const room of this.chatRooms) {
			if (!room) continue;
			if (room.parent) continue;
			if (room.isPrivate && !(room.isPrivate === 'voice' && user.group !== ' ')) continue;
			const roomData: ChatRoomTable = {
				title: room.title,
				desc: room.desc,
				userCount: room.userCount,
			};
			const subrooms = room.getSubRooms().map(r => r.title);
			if (subrooms.length) roomData.subRooms = subrooms;

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
	checkModjoin(user: User) {
		return true;
	}
	isMuted(user: User) {
		return undefined;
	}
	send(message: string) {
		Sockets.roomBroadcast(this.roomid, message);
	}
	add(message: string) {
		// TODO: make sure this never happens
		return this;
	}
	addChatRoom(title: string) {
		const id = toID(title) as RoomID;
		if (['battles', 'rooms', 'ladder', 'teambuilder', 'home', 'all', 'public'].includes(id)) {
			return false;
		}
		if (Rooms.rooms.has(id)) return false;

		const chatRoomData = {
			title,
		};
		const room = Rooms.createChatRoom(id, title, chatRoomData);
		this.chatRoomDataList.push(chatRoomData);
		this.chatRooms.push(room);
		this.writeChatRoomData();
		return true;
	}

	prepBattleRoom(format: string) {
		// console.log('BATTLE START BETWEEN: ' + p1.id + ' ' + p2.id);
		const roomPrefix = `battle-${toID(Dex.getFormat(format).name)}-`;
		let battleNum = this.lastBattle;
		let roomid;
		do {
			roomid = `${roomPrefix}${++battleNum}` as RoomID;
		} while (Rooms.rooms.has(roomid));

		this.lastBattle = battleNum;
		this.writeNumRooms();
		return roomid;
	}

	onCreateBattleRoom(players: User[], room: GameRoom, options: AnyObject) {
		players.forEach(player => {
			if (player.statusType === 'idle') {
				player.setStatusType('online');
			}
		});
		if (Config.reportbattles) {
			const reportRoom = Rooms.get(Config.reportbattles === true ? 'lobby' : Config.reportbattles);
			if (reportRoom) {
				const reportPlayers = players.map(p => p.getIdentity()).join('|');
				reportRoom
					.add(`|b|${room.roomid}|${reportPlayers}`)
					.update();
			}
		}
		if (Config.logladderip && options.rated) {
			const ladderIpLogString = players.map(p => `${p.id}: ${p.latestIp}\n`).join('');
			this.ladderIpLog.write(ladderIpLogString);
		}
	}

	deregisterChatRoom(id: string) {
		id = toID(id);
		const room = Rooms.get(id);
		if (!room) return false; // room doesn't exist
		if (!room.chatRoomData) return false; // room isn't registered
		// deregister from global chatRoomData
		// looping from the end is a pretty trivial optimization, but the
		// assumption is that more recently added rooms are more likely to
		// be deleted
		for (let i = this.chatRoomDataList.length - 1; i >= 0; i--) {
			if (id === toID(this.chatRoomDataList[i].title)) {
				this.chatRoomDataList.splice(i, 1);
				this.writeChatRoomData();
				break;
			}
		}
		room.chatRoomData = null;
		return true;
	}
	delistChatRoom(id: RoomID) {
		id = toID(id) as RoomID;
		if (!Rooms.rooms.has(id)) return false; // room doesn't exist
		for (let i = this.chatRooms.length - 1; i >= 0; i--) {
			if (id === this.chatRooms[i].roomid) {
				this.chatRooms.splice(i, 1);
				break;
			}
		}
	}
	removeChatRoom(id: string) {
		id = toID(id);
		const room = Rooms.get(id);
		if (!room) return false; // room doesn't exist
		room.destroy();
		return true;
	}
	autojoinRooms(user: User, connection: Connection) {
		// we only autojoin regular rooms if the client requests it with /autojoin
		// note that this restriction doesn't apply to staffAutojoin
		let includesLobby = false;
		for (const roomName of this.autojoinList) {
			user.joinRoom(roomName, connection);
			if (roomName === 'lobby') includesLobby = true;
		}
		if (!includesLobby && Config.serverid !== 'showdown') user.send(`>lobby\n|deinit`);
	}
	checkAutojoin(user: User, connection?: Connection) {
		if (!user.named) return;
		for (let [i, staffAutojoin] of this.staffAutojoinList.entries()) {
			const room = Rooms.get(staffAutojoin) as ChatRoom | GameRoom;
			if (!room) {
				this.staffAutojoinList.splice(i, 1);
				i--;
				continue;
			}
			if (room.staffAutojoin === true && user.isStaff ||
					typeof room.staffAutojoin === 'string' && room.staffAutojoin.includes(user.group) ||
					room.auth && user.id in room.auth) {
				// if staffAutojoin is true: autojoin if isStaff
				// if staffAutojoin is String: autojoin if user.group in staffAutojoin
				// if staffAutojoin is anything truthy: autojoin if user has any roomauth
				user.joinRoom(room.roomid, connection);
			}
		}
		for (const conn of user.connections) {
			if (conn.autojoins) {
				const autojoins = conn.autojoins.split(',') as RoomID[];
				for (const roomName of autojoins) {
					void user.tryJoinRoom(roomName, conn);
				}
				conn.autojoins = '';
			}
		}
	}
	onConnect(user: User, connection: Connection) {
		connection.send(user.getUpdateuserText() + '\n' + this.configRankList + this.formatListText);
	}
	onJoin(user: User, connection: Connection) {
		if (!user) return false; // ???
		if (this.users[user.id]) return user;

		this.users[user.id] = user;
		if (++this.userCount > this.maxUsers) {
			this.maxUsers = this.userCount;
			this.maxUsersDate = Date.now();
		}

		return user;
	}
	onRename(user: User, oldid: ID, joining: boolean) {
		delete this.users[oldid];
		this.users[user.id] = user;
		return user;
	}
	onLeave(user: User) {
		if (!user) return; // ...
		if (!(user.id in this.users)) {
			Monitor.crashlog(new Error(`user ${user.id} already left`));
			return;
		}
		delete this.users[user.id];
		this.userCount--;
	}
	startLockdown(err: Error | null = null, slow = false) {
		if (this.lockdown && err) return;
		const devRoom = Rooms.get('development');
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
		this.writeNumRooms();
		this.lastReportedCrash = Date.now();
	}
	automaticKillRequest() {
		const notifyPlaces = ['development', 'staff', 'upperstaff'] as RoomID[];
		if (Config.autolockdown === undefined) Config.autolockdown = true; // on by default

		if (Config.autolockdown && Rooms.global.lockdown === true && Rooms.global.battleCount === 0) {
			// The server is in lockdown, the final battle has finished, and the option is set
			// so we will now automatically kill the server here if it is not updating.
			if (Monitor.updateServerLock) {
				this.notifyRooms(
					notifyPlaces,
					`|html|<div class="broadcast-red"><b>Automatic server lockdown kill canceled.</b><br /><br />The server tried to automatically kill itself upon the final battle finishing, but the server was updating while trying to kill itself.</div>`
				);
				return;
			}

			for (const worker of Sockets.workers.values()) worker.kill();

			// final warning
			this.notifyRooms(
				notifyPlaces,
				`|html|<div class="broadcast-red"><b>The server is about to automatically kill itself in 10 seconds.</b></div>`
			);

			// kill server in 10 seconds if it's still set to
			setTimeout(() => {
				if (Config.autolockdown && Rooms.global.lockdown === true) {
					// finally kill the server
					process.exit();
				} else {
					this.notifyRooms(
						notifyPlaces,
						`|html|<div class="broadcsat-red"><b>Automatic server lockdown kill canceled.</b><br /><br />In the last final seconds, the automatic lockdown was manually disabled.</div>`
					);
				}
			}, 10 * 1000);
		}
	}
	notifyRooms(rooms: RoomID[], message: string) {
		if (!rooms || !message) return;
		for (const roomid of rooms) {
			const curRoom = Rooms.get(roomid);
			if (curRoom) curRoom.add(message).update();
		}
	}
	reportCrash(err: Error, crasher = "The server") {
		const time = Date.now();
		if (time - this.lastReportedCrash < CRASH_REPORT_THROTTLE) {
			return;
		}
		this.lastReportedCrash = time;
		// @ts-ignore
		let stackLines = (err ? Chat.escapeHTML(err.stack).split(`\n`) : []);
		if (stackLines.length > 2) {
			for (let i = 1; i < stackLines.length; i++) {
				if (stackLines[i].includes('&#x2f;') || stackLines[i].includes('\\')) {
					if (!stackLines[i].includes('node_modules')) {
						stackLines = [stackLines[0], stackLines[i]];
						break;
					}
				}
			}
		}
		if (stackLines.length > 2) {
			for (let i = 1; i < stackLines.length; i++) {
				if (stackLines[i].includes('&#x2f;') || stackLines[i].includes('\\')) {
					stackLines = [stackLines[0], stackLines[i]];
					break;
				}
			}
		}
		const stack = stackLines.slice(0, 2).join(`<br />`);
		let crashMessage;
		if (/private/.test(stack)) {
			crashMessage = `|html|<div class="broadcast-red"><b>${crasher} has crashed in private code</b></div>`;
		} else {
			crashMessage = `|html|<div class="broadcast-red"><b>${crasher} has crashed:</b> ${stack}</div>`;
		}
		const devRoom = Rooms.get('development');
		if (devRoom) {
			devRoom.add(crashMessage).update();
		} else {
			if (Rooms.lobby) Rooms.lobby.add(crashMessage).update();
			const staffRoom = Rooms.get('staff');
			if (staffRoom) staffRoom.add(crashMessage).update();
		}
	}
	/**
	 * Destroys personal rooms of a (punished) user
	 * Returns a list of the user's remaining public auth
	 */
	destroyPersonalRooms(userid: ID) {
		const roomauth = [];
		for (const [id, curRoom] of Rooms.rooms) {
			if (id === 'global' || !curRoom.auth) continue;
			if (curRoom.isPersonal && curRoom.auth[userid] === Users.HOST_SYMBOL) {
				curRoom.destroy();
			} else {
				if (curRoom.isPrivate || curRoom.battle || !curRoom.auth) continue;

				const group = curRoom.auth[userid];
				if (group) roomauth.push(`${group}${id}`);
			}
		}
		return roomauth;
	}
}

export class BasicChatRoom extends BasicRoom {
	readonly log: Roomlog;
	readonly autojoin: boolean;
	readonly staffAutojoin: string | boolean;
	banwords: string[];
	/** Only available in groupchats */
	readonly creationTime: number | null;
	readonly type: 'chat' | 'battle';
	minorActivity: Poll | Announcement | null;
	desc: string;
	modchat: string | null;
	filterStretching: boolean;
	filterEmojis: boolean;
	filterCaps: boolean;
	slowchat: false | number;
	introMessage: string;
	staffMessage: string;
	banwordRegex: RegExp | true | null;
	chatRoomData: AnyObject | null;
	parent: Room | null;
	subRooms: Map<string, ChatRoom> | null;
	active: boolean;
	muteTimer: NodeJS.Timer | null;
	logUserStatsInterval: NodeJS.Timer | null;
	expireTimer: NodeJS.Timer | null;
	userList: string;
	reportJoinsInterval: NodeJS.Timer | null;
	game: RoomGame | null;
	battle: RoomBattle | null;
	tour: Tournament | null;
	constructor(roomid: RoomID, title?: string, options: AnyObject = {}) {
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

		// room settings
		this.desc = '';
		this.autojoin = false;
		this.staffAutojoin = false;
		this.creationTime = null;
		this.banwords = [];
		this.type = 'chat';
		this.modchat = (Config.chatmodchat || null);
		this.filterStretching = false;
		this.filterEmojis = false;
		this.filterCaps = false;
		this.slowchat = false;
		this.introMessage = '';
		this.staffMessage = '';
		this.banwordRegex = null;

		this.chatRoomData = (options.isPersonal ? null : options);
		this.minorActivity = null;
		Object.assign(this, options);
		if (this.auth) Object.setPrototypeOf(this.auth, null);
		this.parent = null;
		if (options.parentid) {
			const parent = Rooms.get(options.parentid);

			if (parent) {
				if (!parent.subRooms) parent.subRooms = new Map();
				parent.subRooms.set(this.roomid, this as ChatRoom);
				this.parent = parent;
			}
		}

		this.subRooms = null;

		this.active = false;
		this.muteTimer = null;

		this.logUserStatsInterval = null;
		this.expireTimer = null;
		if (Config.logchat) {
			this.roomlog('NEW CHATROOM: ' + this.roomid);
			if (Config.loguserstats) {
				this.logUserStatsInterval = setInterval(() => this.logUserStats(), Config.loguserstats);
			}
		}

		this.userList = '';
		if (this.batchJoins) {
			this.userList = this.getUserList();
		}
		this.reportJoinsInterval = null;
		this.tour = null;
		this.game = null;
		this.battle = null;
	}

	/**
	 * Add a room message to the room log, so it shows up in the room
	 * for everyone, and appears in the scrollback for new users who
	 * join.
	 */
	add(message: string) {
		this.log.add(message);
		return this;
	}
	roomlog(message: string) {
		this.log.roomlog(message);
		return this;
	}
	modlog(message: string) {
		this.log.modlog(message);
		return this;
	}
	hideText(userids: ID[]) {
		const cleared = this.log.clearText(userids);
		for (const userid of cleared) {
			this.send(`|unlink|hide|${userid}`);
		}
		this.update();
	}
	logUserStats() {
		let total = 0;
		let guests = 0;
		const groups: {[k: string]: number} = {};
		for (const group of Config.groupsranking) {
			groups[group] = 0;
		}
		for (const i in this.users) {
			const user = this.users[i];
			++total;
			if (!user.named) {
				++guests;
			}
			if (this.auth && this.auth[user.id] && this.auth[user.id] in groups) {
				++groups[this.auth[user.id]];
			} else {
				++groups[user.group];
			}
		}
		let entry = '|userstats|total:' + total + '|guests:' + guests;
		for (const i in groups) {
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
		if (this.isPersonal || this.isHelp) {
			this.expireTimer = setTimeout(() => this.expire(), TIMEOUT_INACTIVE_DEALLOCATE);
		} else {
			this.expireTimer = null;
		}
	}
	expire() {
		this.send('|expire|');
		this.destroy();
	}
	reportJoin(type: 'j' | 'l' | 'n', entry: string, user: User) {
		let reportJoins = this.reportJoins;
		if (reportJoins && this.modchat && !user.authAtLeast(this.modchat, this)) {
			reportJoins = false;
		}
		if (reportJoins) {
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
	getIntroMessage(user: User) {
		let message = Chat.html`\n|raw|<div class="infobox"> You joined ${this.title}`;
		if (this.modchat) {
			message += ` [${this.modchat} or higher to talk]`;
		}
		if (this.modjoin) {
			const modjoin = this.modjoin === true ? this.modchat : this.modjoin;
			message += ` [${modjoin} or higher to join]`;
		}
		if (this.slowchat) {
			message += ` [Slowchat ${this.slowchat}s]`;
		}
		message += `</div>`;
		if (this.introMessage) {
			message += `\n|raw|<div class="infobox infobox-roomintro"><div ${(!this.isOfficial ? 'class="infobox-limited"' : '')}>` +
				this.introMessage.replace(/\n/g, '') +
				`</div></div>`;
		}
		if (this.staffMessage && user.can('mute', null, this)) {
			message += `\n|raw|<div class="infobox">(Staff intro:)<br /><div>` +
				this.staffMessage.replace(/\n/g, '') +
				`</div>`;
		}
		return message;
	}
	getSubRooms(includeSecret = false) {
		if (!this.subRooms) return [];
		return [...this.subRooms.values()].filter(room =>
			!room.isPrivate || includeSecret
		);
	}
	onConnect(user: User, connection: Connection) {
		const userList = this.userList ? this.userList : this.getUserList();
		this.sendUser(
			connection,
			'|init|chat\n|title|' + this.title + '\n' + userList + '\n' + this.log.getScrollback() + this.getIntroMessage(user)
		);
		if (this.minorActivity) this.minorActivity.onConnect(user, connection);
		if (this.game && this.game.onConnect) this.game.onConnect(user, connection);
	}
	onJoin(user: User, connection: Connection) {
		if (!user) return false; // ???
		if (this.users[user.id]) return false;

		if (user.named) {
			this.reportJoin('j', user.getIdentityWithStatus(this.roomid), user);
		}

		this.users[user.id] = user;
		this.userCount++;

		if (this.minorActivity) this.minorActivity.onConnect(user, connection);
		if (this.game && this.game.onJoin) this.game.onJoin(user, connection);
		return true;
	}
	onRename(user: User, oldid: ID, joining: boolean) {
		if (user.id === oldid) {
			return this.onUpdateIdentity(user);
		}
		if (!this.users[oldid]) {
			Monitor.crashlog(new Error(`user ${oldid} not in room ${this.roomid}`));
		}
		if (this.users[user.id]) {
			Monitor.crashlog(new Error(`user ${user.id} already in room ${this.roomid}`));
		}
		delete this.users[oldid];
		this.users[user.id] = user;
		if (joining) {
			this.reportJoin('j', user.getIdentityWithStatus(this.roomid), user);
			if (this.staffMessage && user.can('mute', null, this)) {
				this.sendUser(
					user, '|raw|<div class="infobox">(Staff intro:)<br /><div>' + this.staffMessage.replace(/\n/g, '') + '</div></div>'
				);
			}
		} else if (!user.named) {
			this.reportJoin('l', oldid, user);
		} else {
			this.reportJoin('n', user.getIdentityWithStatus(this.roomid) + '|' + oldid, user);
		}
		if (this.minorActivity && 'voters' in this.minorActivity) {
			if (user.id in this.minorActivity.voters) this.minorActivity.updateFor(user);
		}
		return true;
	}
	/**
	 * onRename, but without a userid change
	 */
	onUpdateIdentity(user: User) {
		if (user && user.connected) {
			if (!this.users[user.id]) return false;
			if (user.named) {
				this.reportJoin('n', user.getIdentityWithStatus(this.roomid) + '|' + user.id, user);
			} else {
				this.reportJoin('l', user.id, user);
			}
		}
		return true;
	}
	onLeave(user: User) {
		if (!user) return false; // ...

		if (!(user.id in this.users)) {
			Monitor.crashlog(new Error(`user ${user.id} already left`));
			return false;
		}
		delete this.users[user.id];
		this.userCount--;

		if (user.named) {
			this.reportJoin('l', user.getIdentity(this.roomid), user);
		}
		if (this.game && this.game.onLeave) this.game.onLeave(user);
		return true;
	}
	destroy() {
		// deallocate ourself

		if (this.battle && this.tour) {
			// resolve state of the tournament;
			if (!this.battle.ended) this.tour.onBattleWin(this as any as GameRoom, '');
			this.tour = null;
		}

		// remove references to ourself
		for (const i in this.users) {
			// @ts-ignore
			this.users[i].leaveRoom(this, null, true);
			delete this.users[i];
		}

		if (this.parent && this.parent.subRooms) {
			this.parent.subRooms.delete(this.roomid);
			if (!this.parent.subRooms.size) this.parent.subRooms = null;
		}

		Rooms.global.deregisterChatRoom(this.roomid);
		Rooms.global.delistChatRoom(this.roomid);

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

		// Ensure there aren't any pending messages that could restart the expire timer
		this.update();

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

		void this.log.destroy();

		// get rid of some possibly-circular references
		Rooms.rooms.delete(this.roomid);
	}
}

export class ChatRoom extends BasicChatRoom {
	// This is not actually used, this is just a fake class to keep
	// TypeScript happy
	battle: null;
	active: false;
	type: 'chat';
	constructor() {
		super('' as RoomID);
		this.battle = null;
		this.active = false;
		this.type = 'chat';
	}
}

export class GameRoom extends BasicChatRoom {
	readonly type: 'battle';
	readonly format: string;
	p1: AnyObject | null;
	p2: AnyObject | null;
	p3: AnyObject | null;
	p4: AnyObject | null;
	/**
	 * The lower player's rating, for searching purposes.
	 * 0 for unrated battles. 1 for unknown ratings.
	 */
	rated: number;
	battle: RoomBattle | null;
	game: RoomGame;
	modchatUser: string;
	active: boolean;
	auth: {[userid: string]: GroupSymbol};
	constructor(roomid: RoomID, title?: string, options: AnyObject = {}) {
		options.logTimes = false;
		options.autoTruncate = false;
		options.isMultichannel = true;
		options.reportJoins = !!Config.reportbattlejoins;
		options.batchJoins = 0;
		super(roomid, title, options);
		this.modchat = (Config.battlemodchat || null);

		this.type = 'battle';

		this.format = options.format || '';
		// console.log("NEW BATTLE");

		this.tour = options.tour || null;
		this.parent = options.parent || (this.tour && this.tour.room) || null;

		this.p1 = options.p1 || null;
		this.p2 = options.p2 || null;
		this.p3 = options.p3 || null;
		this.p4 = options.p4 || null;

		this.rated = options.rated || 0;

		this.battle = null;
		this.game = null!;

		this.modchatUser = '';

		this.active = false;
		this.auth = Object.create(null);
	}
	/**
	 * - logNum = 0          : spectator log (no exact HP)
	 * - logNum = 1, 2, 3, 4 : player log (exact HP for that player)
	 * - logNum = -1         : debug log (exact HP for all players)
	 */
	getLog(channel: -1 | 0 | 1 | 2 | 3 | 4 = 0) {
		return this.log.getScrollback(channel);
	}
	getLogForUser(user: User) {
		if (!(user.id in this.game.playerTable)) return this.getLog();
		// @ts-ignore
		return this.getLog(this.game.playerTable[user.id].num);
	}
	update(excludeUser: User | null = null) {
		if (!this.log.broadcastBuffer) return;

		if (this.userCount) {
			Sockets.channelBroadcast(this.roomid, '>' + this.roomid + '\n\n' + this.log.broadcastBuffer);
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
	sendPlayer(num: 0 | 1, message: string) {
		const player = this.getPlayer(num);
		if (!player) return false;
		player.sendRoom(message);
	}
	getPlayer(num: 0 | 1) {
		// @ts-ignore
		return this.game['p' + (num + 1)];
	}
	requestModchat(user: User | null) {
		if (!user) {
			this.modchatUser = '';
			return;
		} else if (!this.modchatUser || this.modchatUser === user.id || this.getAuth(user) !== Users.PLAYER_SYMBOL) {
			this.modchatUser = user.id;
			return;
		} else {
			return "Modchat can only be changed by the user who turned it on, or by staff";
		}
	}
	onConnect(user: User, connection: Connection) {
		this.sendUser(connection, '|init|battle\n|title|' + this.title + '\n' + this.getLogForUser(user));
		if (this.game && this.game.onConnect) this.game.onConnect(user, connection);
	}
}

function getRoom(roomid?: string | Room) {
	if (roomid && (roomid as Room).roomid) return roomid as Room;
	return Rooms.rooms.get(roomid as RoomID);
}

export const Rooms = {
	/**
	 * The main roomid:Room table. Please do not hold a reference to a
	 * room long-term; just store the roomid and grab it from here (with
	 * the Rooms.get(roomid) accessor) when necessary.
	 */
	rooms: new Map<RoomID, Room>(),
	aliases: new Map<string, RoomID>(),

	get: getRoom,
	search(name: string): Room | undefined {
		return getRoom(name) || getRoom(toID(name)) || getRoom(Rooms.aliases.get(toID(name)));
	},

	createGameRoom(roomid: RoomID, title: string, options: AnyObject) {
		if (Rooms.rooms.has(roomid)) throw new Error(`Room ${roomid} already exists`);
		Monitor.debug("NEW BATTLE ROOM: " + roomid);
		const room = new GameRoom(roomid, title, options);
		Rooms.rooms.set(roomid, room);
		return room;
	},
	createChatRoom(roomid: RoomID, title: string, options: AnyObject) {
		if (Rooms.rooms.has(roomid)) throw new Error(`Room ${roomid} already exists`);
		const room = new BasicChatRoom(roomid, title, options) as ChatRoom;
		Rooms.rooms.set(roomid, room);
		return room;
	},
	createBattle(formatid: string, options: AnyObject) {
		const players: (User & {specialNextBattle?: string })[] =
			[options.p1, options.p2, options.p3, options.p4].filter(user => user);
		const gameType = Dex.getFormat(formatid).gameType;
		if (gameType !== 'multi' && gameType !== 'free-for-all') {
			if (players.length > 2) {
				throw new Error(`Four players were provided, but the format is a two-player format.`);
			}
		}
		if (new Set(players).size < players.length) {
			throw new Error(`Players can't battle themselves`);
		}

		for (const user of players) {
			Ladders.cancelSearches(user);
		}

		if (Rooms.global.lockdown === true) {
			for (const user of players) {
				user.popup("The server is restarting. Battles will be available again in a few minutes.");
			}
			return;
		}

		const p1Special = players.length ? players[0].specialNextBattle : undefined;
		let mismatch = `"${p1Special}"`;
		for (const user of players) {
			if (user.specialNextBattle !== p1Special) {
				mismatch += ` vs. "${user.specialNextBattle}"`;
			}
			user.specialNextBattle = undefined;
		}

		if (mismatch !== `"${p1Special}"`) {
			for (const user of players) {
				user.popup(`Your special battle settings don't match: ${mismatch}`);
			}
			return;
		} else if (p1Special) {
			options.ratedMessage = p1Special;
		}

		const roomid = Rooms.global.prepBattleRoom(formatid);
		options.format = formatid;
		// options.rated is a number representing the lowest player rating, for searching purposes
		// options.rated < 0 or falsy means "unrated", and will be converted to 0 here
		// options.rated === true is converted to 1 (used in tests sometimes)
		options.rated = Math.max(+options.rated || 0, 0);
		const p1 = players[0];
		const p2 = players[1];
		const p1name = p1 ? p1.name : "Player 1";
		const p2name = p2 ? p2.name : "Player 2";
		let roomTitle;
		if (gameType === 'multi') {
			roomTitle = `Team ${p1name} vs. Team ${p2name}`;
		} else if (gameType === 'free-for-all') {
			// p1 vs. p2 vs. p3 vs. p4 is too long of a title
			roomTitle = `${p1name} and friends`;
		} else {
			roomTitle = `${p1name} vs. ${p2name}`;
		}
		const room = Rooms.createGameRoom(roomid, roomTitle, options);
		const battle = new Rooms.RoomBattle(room, formatid, options);
		room.game = battle;
		// Special battles have modchat set to Player from the beginning
		if (p1Special) room.modchat = '\u2606';

		const inviteOnly = (options.inviteOnly || []);
		for (const user of players) {
			if (user.inviteOnlyNextBattle) {
				inviteOnly.push(user.id);
				user.inviteOnlyNextBattle = false;
			}
		}
		if (inviteOnly.length) {
			const prefix = battle.forcedPublic();
			if (prefix) {
				room.isPrivate = false;
				room.modjoin = null;
				room.add(`|raw|<div class="broadcast-blue"><strong>This battle is required to be public due to a player having a name prefixed by '${prefix}'.</div>`);
			} else if (!options.tour || (room.tour && room.tour.modjoin)) {
				room.modjoin = '%';
				room.isPrivate = 'hidden';
				room.privacySetter = new Set(inviteOnly);
				room.add(`|raw|<div class="broadcast-red"><strong>This battle is invite-only!</strong><br />Users must be invited with <code>/invite</code> (or be staff) to join</div>`);
			}
		}

		for (const p of players) {
			if (p) {
				p.joinRoom(room);
				Monitor.countBattle(p.latestIp, p.name);
			}
		}

		return room;
	},

	battleModlogStream: FS('logs/modlog/modlog_battle.txt').createAppendStream(),
	groupchatModlogStream: FS('logs/modlog/modlog_groupchat.txt').createAppendStream(),

	global: null! as GlobalRoom,
	lobby: null as ChatRoom | null,

	BasicRoom,
	GlobalRoom,
	GameRoom,
	ChatRoom: BasicChatRoom,

	RoomGame,
	RoomGamePlayer,

	RETRY_AFTER_LOGIN,

	Roomlogs,

	RoomBattle,
	RoomBattlePlayer,
	RoomBattleTimer,
	PM: RoomBattlePM,
};

// initialize

Monitor.notice("NEW GLOBAL: global");

Rooms.global = new GlobalRoom('global' as RoomID);

Rooms.rooms.set('global' as RoomID, Rooms.global);
