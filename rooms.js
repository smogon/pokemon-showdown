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

const fs = require('fs');
const path = require('path');

let Rooms = module.exports = getRoom;

Rooms.rooms = new Map();
Rooms.aliases = new Map();

/*********************************************************
 * the Room object.
 *********************************************************/

class Room {
	constructor(roomid, title) {
		this.id = roomid;
		this.title = (title || roomid);
		this.reportJoins = Config.reportjoins;

		this.users = Object.create(null);

		this.log = [];

		this.muteQueue = [];
		this.muteTimer = null;

		this.type = 'chat';
		this.lastUpdate = 0;
		this.userCount = 0;
	}

	send(message, errorArgument) {
		if (errorArgument) throw new Error("Use Room#sendUser");
		if (this.id !== 'lobby') message = '>' + this.id + '\n' + message;
		if (this.userCount) Sockets.channelBroadcast(this.id, message);
	}
	sendAuth(message) {
		for (let i in this.users) {
			let user = this.users[i];
			if (user.connected && user.can('receiveauthmessages', null, this)) {
				user.sendTo(this, message);
			}
		}
	}
	sendUser(user, message) {
		user.sendTo(this, message);
	}
	add(message) {
		if (typeof message !== 'string') throw new Error("Deprecated message type");
		if (message.startsWith('|uhtmlchange|')) return this.uhtmlchange(message);
		this.logEntry(message);
		if (this.logTimes && message.substr(0, 3) === '|c|') {
			message = '|c:|' + (~~(Date.now() / 1000)) + '|' + message.substr(3);
		}
		this.log.push(message);
		return this;
	}
	uhtmlchange(message) {
		let thirdPipe = message.indexOf('|', 13);
		let originalStart = '|uhtml|' + message.slice(13, thirdPipe + 1);
		for (let i = 0; i < this.log.length; i++) {
			if (this.log[i].startsWith(originalStart)) {
				this.log[i] = originalStart + message.slice(thirdPipe + 1);
				break;
			}
		}
		this.send(message);
		return this;
	}
	logEntry() {}
	addRaw(message) {
		return this.add('|raw|' + message);
	}
	addLogMessage(user, text) {
		return this.add('|c|' + user.getIdentity(this) + '|/log ' + text).update();
	}
	getLogSlice(amount) {
		let log = this.log.slice(amount);
		log.unshift('|:|' + (~~(Date.now() / 1000)));
		return log;
	}

	toString() {
		return this.id;
	}

	//mute handling
	runMuteTimer(forceReschedule) {
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
	isMuted(user) {
		if (!user) return;
		if (this.muteQueue) {
			for (let i = 0; i < this.muteQueue.length; i++) {
				let entry = this.muteQueue[i];
				if (user.userid === entry.userid ||
					user.guestNum === entry.guestNum ||
					(user.autoconfirmed && user.autoconfirmed === entry.autoconfirmed)) {
					return entry.userid;
				}
			}
		}
	}
	getMuteTime(user) {
		let userid = this.isMuted(user);
		if (!userid) return;
		for (let i = 0; i < this.muteQueue.length; i++) {
			if (userid === this.muteQueue[i].userid) {
				return this.muteQueue[i].time - Date.now();
			}
		}
	}
	getAuth(user) {
		if (this.auth) {
			if (user.userid in this.auth) {
				return this.auth[user.userid];
			}
			if (this.tour && this.tour.room) {
				return this.tour.room.getAuth(user);
			}
			if (this.isPrivate === true) {
				return ' ';
			}
		}
		return user.group;
	}
	checkModjoin(user) {
		if (this.staffRoom && !user.isStaff && (!this.auth || (this.auth[user.userid] || ' ') === ' ')) return false;
		if (user.userid in this.users) return true;
		if (!this.modjoin) return true;
		const userGroup = user.can('makeroom') ? user.group : this.getAuth(user);

		let modjoinGroup = this.modjoin !== true ? this.modjoin : this.modchat;
		if (!modjoinGroup) return true;

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
	unmute(userid, notifyText) {
		let successUserid = false;
		let user = Users.get(userid);
		if (!user) {
			// If the user is not found, construct a dummy user object for them.
			user = {
				userid: userid,
				autoconfirmed: userid,
			};
		}

		for (let i = 0; i < this.muteQueue.length; i++) {
			let entry = this.muteQueue[i];
			if (entry.userid === user.userid ||
				entry.guestNum === user.guestNum ||
				(user.autoconfirmed && entry.autoconfirmed === user.autoconfirmed)) {
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

		if (successUserid && user.userid in this.users) {
			user.updateIdentity(this.id);
			if (notifyText) user.popup(notifyText);
		}
		return successUserid;
	}
	modlog(text) {
		if (!this.modlogStream) return;
		this.modlogStream.write('[' + (new Date().toJSON()) + '] (' + this.id + ') ' + text + '\n');
	}
	sendModCommand(data) {
		for (let i in this.users) {
			let user = this.users[i];
			// hardcoded for performance reasons (this is an inner loop)
			if (user.isStaff || (this.auth && (this.auth[user.userid] || '+') !== '+')) {
				user.sendTo(this, data);
			}
		}
	}
}

class GlobalRoom {
	constructor(roomid) {
		this.id = roomid;

		this.type = 'global';

		// init battle rooms
		this.battleCount = 0;

		this.chatRoomData = [];
		try {
			this.chatRoomData = require('./config/chatrooms.json');
			if (!Array.isArray(this.chatRoomData)) this.chatRoomData = [];
		} catch (e) {} // file doesn't exist [yet]

		if (!this.chatRoomData.length) {
			this.chatRoomData = [{
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

		this.autojoin = []; // rooms that users autojoin upon connecting
		this.staffAutojoin = []; // rooms that staff autojoin upon connecting
		for (let i = 0; i < this.chatRoomData.length; i++) {
			if (!this.chatRoomData[i] || !this.chatRoomData[i].title) {
				console.log('ERROR: Room number ' + i + ' has no data.');
				continue;
			}
			let id = toId(this.chatRoomData[i].title);
			if (!Config.quietconsole) console.log("NEW CHATROOM: " + id);
			let room = Rooms.createChatRoom(id, this.chatRoomData[i].title, this.chatRoomData[i]);
			if (room.aliases) {
				for (let a = 0; a < room.aliases.length; a++) {
					Rooms.aliases.set(room.aliases[a], id);
				}
			}
			this.chatRooms.push(room);
			if (room.autojoin) this.autojoin.push(id);
			if (room.staffAutojoin) this.staffAutojoin.push(id);
		}
		Rooms.lobby = Rooms.rooms.get('lobby');

		// init battle room logging
		if (Config.logladderip) {
			this.ladderIpLog = fs.createWriteStream('logs/ladderip/ladderip.txt', {encoding: 'utf8', flags: 'a'});
		} else {
			// Prevent there from being two possible hidden classes an instance
			// of GlobalRoom can have.
			this.ladderIpLog = new (require('stream')).Writable();
		}

		let lastBattle;
		try {
			lastBattle = fs.readFileSync('logs/lastbattle.txt', 'utf8');
		} catch (e) {}
		this.lastBattle = (!lastBattle || isNaN(lastBattle)) ? 0 : +lastBattle;


		this.writeChatRoomData = (() => {
			let writing = false;
			let writePending = false;
			return () => {
				if (writing) {
					writePending = true;
					return;
				}
				writing = true;

				let data = JSON.stringify(this.chatRoomData)
					.replace(/\{"title"\:/g, '\n{"title":')
					.replace(/\]$/, '\n]');

				fs.writeFile('config/chatrooms.json.0', data, () => {
					data = null;
					fs.rename('config/chatrooms.json.0', 'config/chatrooms.json', () => {
						writing = false;
						if (writePending) {
							writePending = false;
							setImmediate(() => this.writeChatRoomData());
						}
					});
				});
			};
		})();

		this.writeNumRooms = (() => {
			let writing = false;
			let lastBattle = -1; // last lastBattle to be written to file
			return () => {
				if (writing) return;

				// batch writing lastbattle.txt for every 10 battles
				if (lastBattle >= this.lastBattle) return;
				lastBattle = this.lastBattle + 10;

				let filename = 'logs/lastbattle.txt';
				writing = true;
				fs.writeFile(`${filename}.0`, '' + lastBattle, () => {
					fs.rename(`${filename}.0`, filename, () => {
						writing = false;
						lastBattle = null;
						filename = null;
						if (lastBattle < this.lastBattle) {
							setImmediate(() => this.writeNumRooms());
						}
					});
				});
			};
		})();

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
		this.modlogStream = fs.createWriteStream(path.resolve(__dirname, 'logs/modlog/modlog_global.txt'), {flags:'a+'});
	}

	reportUserStats() {
		if (this.maxUsersDate) {
			LoginServer.request('updateuserstats', {
				date: this.maxUsersDate,
				users: this.maxUsers,
			}, () => {});
			this.maxUsersDate = 0;
		}
		LoginServer.request('updateuserstats', {
			date: Date.now(),
			users: this.userCount,
		}, () => {});
	}

	get formatListText() {
		if (this.formatList) {
			return this.formatList;
		}
		this.formatList = '|formats' + (Ladders.formatsListPrefix || '');
		let section = '', prevSection = '';
		let curColumn = 1;
		for (let i in Tools.data.Formats) {
			let format = Tools.data.Formats[i];
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
			this.formatList += ',' + displayCode.toString(16);
		}
		return this.formatList;
	}

	getRoomList(filter) {
		let rooms = [];
		let skipCount = 0;
		let [formatFilter, eloFilter] = filter.split(',');
		if (this.battleCount > 150 && !formatFilter && !eloFilter) {
			skipCount = this.battleCount - 150;
		}
		Rooms.rooms.forEach(room => {
			if (!room || !room.active || room.isPrivate) return;
			if (formatFilter && formatFilter !== room.format) return;
			if (eloFilter && (!room.rated || room.rated < eloFilter)) return;
			if (skipCount && skipCount--) return;

			rooms.push(room);
		});

		let roomTable = {};
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
	getRooms(user) {
		let roomsData = {official:[], chat:[], userCount: this.userCount, battleCount: this.battleCount};
		for (let i = 0; i < this.chatRooms.length; i++) {
			let room = this.chatRooms[i];
			if (!room) continue;
			if (room.isPrivate && !(room.isPrivate === 'voice' && user.group !== ' ')) continue;
			(room.isOfficial ? roomsData.official : roomsData.chat).push({
				title: room.title,
				desc: room.desc,
				userCount: room.userCount,
			});
		}
		return roomsData;
	}
	checkModjoin() {
		return true;
	}
	update() {}
	isMuted() {
		return false;
	}
	send(message, user) {
		if (user) {
			user.sendTo(this, message);
		} else if (this.userCount) {
			Sockets.channelBroadcast(this.id, message);
		}
	}
	sendAuth(message) {
		for (let i in this.users) {
			let user = this.users[i];
			if (user.connected && user.can('receiveauthmessages', null, this)) {
				user.sendTo(this, message);
			}
		}
	}
	add(message) {
		if (Rooms.lobby) return Rooms.lobby.add(message);
		return this;
	}
	addRaw(message) {
		if (Rooms.lobby) return Rooms.lobby.addRaw(message);
		return this;
	}
	addChatRoom(title) {
		let id = toId(title);
		if (id === 'battles' || id === 'rooms' || id === 'ladder' || id === 'teambuilder' || id === 'home') return false;
		if (Rooms.rooms.has(id)) return false;

		let chatRoomData = {
			title: title,
		};
		let room = Rooms.createChatRoom(id, title, chatRoomData);
		this.chatRoomData.push(chatRoomData);
		this.chatRooms.push(room);
		this.writeChatRoomData();
		return true;
	}

	prepBattleRoom(format) {
		//console.log('BATTLE START BETWEEN: ' + p1.userid + ' ' + p2.userid);
		let roomPrefix = `battle-${toId(format)}-`;
		let battleNum = this.lastBattle;
		let roomid;
		do {
			roomid = `${roomPrefix}${++battleNum}`;
		} while (Rooms.rooms.has(roomid));

		this.lastBattle = battleNum;
		this.writeNumRooms();
		return roomid;
	}

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

	deregisterChatRoom(id) {
		id = toId(id);
		let room = Rooms(id);
		if (!room) return false; // room doesn't exist
		if (!room.chatRoomData) return false; // room isn't registered
		// deregister from global chatRoomData
		// looping from the end is a pretty trivial optimization, but the
		// assumption is that more recently added rooms are more likely to
		// be deleted
		for (let i = this.chatRoomData.length - 1; i >= 0; i--) {
			if (id === toId(this.chatRoomData[i].title)) {
				this.chatRoomData.splice(i, 1);
				this.writeChatRoomData();
				break;
			}
		}
		delete room.chatRoomData;
		return true;
	}
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
	removeChatRoom(id) {
		id = toId(id);
		let room = Rooms(id);
		if (!room) return false; // room doesn't exist
		room.destroy();
		return true;
	}
	autojoinRooms(user, connection) {
		// we only autojoin regular rooms if the client requests it with /autojoin
		// note that this restriction doesn't apply to staffAutojoin
		let includesLobby = false;
		for (let i = 0; i < this.autojoin.length; i++) {
			user.joinRoom(this.autojoin[i], connection);
			if (this.autojoin[i] === 'lobby') includesLobby = true;
		}
		if (!includesLobby && Config.serverid !== 'showdown') user.send(`>lobby\n|deinit`);
	}
	checkAutojoin(user, connection) {
		if (!user.named) return;
		for (let i = 0; i < this.staffAutojoin.length; i++) {
			let room = Rooms(this.staffAutojoin[i]);
			if (!room) {
				this.staffAutojoin.splice(i, 1);
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
		for (let i = 0; i < user.connections.length; i++) {
			connection = user.connections[i];
			if (connection.autojoins) {
				let autojoins = connection.autojoins.split(',');
				for (let j = 0; j < autojoins.length; j++) {
					user.tryJoinRoom(autojoins[j], connection);
				}
				connection.autojoins = '';
			}
		}
	}
	onConnect(user, connection) {
		let initdata = '|updateuser|' + user.name + '|' + (user.named ? '1' : '0') + '|' + user.avatar + '\n';
		connection.send(initdata + this.formatListText);
		if (this.chatRooms.length > 2) connection.send('|queryresponse|rooms|null'); // should display room list
	}
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
	onRename(user, oldid, joining) {
		delete this.users[oldid];
		this.users[user.userid] = user;
		return user;
	}
	onUpdateIdentity() {}
	onLeave(user) {
		if (!user) return; // ...
		delete this.users[user.userid];
		--this.userCount;
	}
	modlog(text) {
		this.modlogStream.write('[' + (new Date().toJSON()) + '] ' + text + '\n');
	}
	startLockdown(err, slow) {
		if (this.lockdown && err) return;
		let devRoom = Rooms('development');
		const stack = (err ? Chat.escapeHTML(err.stack).split(`\n`).slice(0, 2).join(`<br />`) : ``);
		Rooms.rooms.forEach((curRoom, id) => {
			if (id === 'global') return;
			if (err) {
				if (id === 'staff' || id === 'development' || (!devRoom && id === 'lobby')) {
					curRoom.addRaw(`<div class="broadcast-red"><b>The server needs to restart because of a crash:</b> ${stack}<br />Please restart the server.</div>`);
					curRoom.addRaw(`<div class="broadcast-red">You will not be able to start new battles until the server restarts.</div>`);
					curRoom.update();
				} else {
					curRoom.addRaw(`<div class="broadcast-red"><b>The server needs restart because of a crash.</b><br />No new battles can be started until the server is done restarting.</div>`).update();
				}
			} else {
				curRoom.addRaw(`<div class="broadcast-red"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>`).update();
			}
			const game = curRoom.game;
			if (!slow && game && game.timer && !game.ended) {
				game.timer.start();
				if (curRoom.modchat !== '+') {
					curRoom.modchat = '+';
					curRoom.addRaw(`<div class="broadcast-red"><b>Moderated chat was set to +!</b><br />Only users of rank + and higher can talk.</div>`).update();
				}
			}
		});

		this.lockdown = true;
		this.lastReportedCrash = Date.now();
	}
	reportCrash(err) {
		if (this.lockdown) return;
		const time = Date.now();
		if (time - this.lastReportedCrash < CRASH_REPORT_THROTTLE) {
			return;
		}
		this.lastReportedCrash = time;
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

class BattleRoom extends Room {
	constructor(roomid, format, p1, p2, options) {
		super(roomid, "" + p1.name + " vs. " + p2.name);
		this.modchat = (Config.battlemodchat || false);
		this.modjoin = false;
		this.slowchat = false;
		this.filterStretching = false;
		this.filterCaps = false;
		this.reportJoins = Config.reportbattlejoins;

		this.type = 'battle';

		this.resetUser = '';
		this.modchatUser = '';
		this.expireTimer = null;
		this.active = false;

		format = '' + (format || '');

		this.format = format;
		this.auth = Object.create(null);
		//console.log("NEW BATTLE");

		let formatid = toId(format);

		// Sometimes we might allow BattleRooms to have no options
		if (!options) {
			options = {};
		}

		let rated;
		if (options.rated && Tools.getFormat(formatid).rated !== false) {
			rated = options.rated;
		} else {
			rated = false;
		}

		if (options.tour) {
			this.tour = options.tour;
		} else {
			this.tour = false;
		}

		this.p1 = p1 || null;
		this.p2 = p2 || null;

		this.rated = rated;
		this.battle = new Rooms.RoomBattle(this, format, rated);
		this.game = this.battle;

		this.sideTicksLeft = [21, 21];
		if (!rated && !this.tour) this.sideTicksLeft = [28, 28];
		this.sideTurnTicks = [0, 0];
		this.disconnectTickDiff = [0, 0];

		if (Config.forcetimer) this.battle.timer.start();

		this.modlogStream = Rooms.battleModlogStream;
	}
	push(message) {
		if (typeof message === 'string') {
			this.log.push(message);
		} else {
			this.log = this.log.concat(message);
		}
	}
	win(winner) {
		// Declare variables here in case we need them for non-rated battles logging.
		let p1score = 0.5;
		let winnerid = toId(winner);

		// Check if the battle was rated to update the ladder, return its response, and log the battle.
		if (this.rated) {
			this.rated = false;
			let p1 = this.battle.p1;
			let p2 = this.battle.p2;

			if (winnerid === p1.userid) {
				p1score = 1;
			} else if (winnerid === p2.userid) {
				p1score = 0;
			}

			let p1name = p1.name;
			let p2name = p2.name;

			//update.updates.push('[DEBUG] uri: ' + Config.loginserver + 'action.php?act=ladderupdate&serverid=' + Config.serverid + '&p1=' + encodeURIComponent(p1) + '&p2=' + encodeURIComponent(p2) + '&score=' + p1score + '&format=' + toId(rated.format) + '&servertoken=[token]');

			winner = Users.get(winnerid);
			if (winner && !winner.registered) {
				this.sendUser(winner, '|askreg|' + winner.userid);
			}
			// update rankings
			Ladders(this.battle.format).updateRating(p1name, p2name, p1score, this);
		} else if (Config.logchallenges) {
			// Log challenges if the challenge logging config is enabled.
			if (winnerid === this.p1.userid) {
				p1score = 1;
			} else if (winnerid === this.p2.userid) {
				p1score = 0;
			}
			this.update();
			this.logBattle(p1score);
		} else {
			this.battle.logData = null;
		}
		if (Config.autosavereplays) {
			let uploader = Users.get(winnerid);
			if (uploader && uploader.connections[0]) {
				Chat.parse('/savereplay', this, uploader, uploader.connections[0]);
			}
		}
		if (this.tour) {
			this.tour.onBattleWin(this, winnerid);
		}
		this.update();
	}
	// logNum = 0    : spectator log (no exact HP)
	// logNum = 1, 2 : player log (exact HP for that player)
	// logNum = 3    : debug log (exact HP for all players)
	getLog(logNum) {
		let log = [];
		for (let i = 0; i < this.log.length; ++i) {
			let line = this.log[i];
			if (line === '|split') {
				log.push(this.log[i + logNum + 1]);
				i += 4;
			} else {
				log.push(line);
			}
		}
		return log;
	}
	getLogForUser(user) {
		if (!(user in this.game.players)) return this.getLog(0);
		return this.getLog(this.game.players[user].slotNum + 1);
	}
	update(excludeUser) {
		if (this.log.length <= this.lastUpdate) return;

		if (this.userCount) {
			Sockets.subchannelBroadcast(this.id, '>' + this.id + '\n\n' + this.log.slice(this.lastUpdate).join('\n'));
		}

		this.lastUpdate = this.log.length;

		// empty rooms time out after ten minutes
		let hasUsers = false;
		for (let i in this.users) { // eslint-disable-line no-unused-vars
			hasUsers = true;
			break;
		}
		if (!hasUsers) {
			if (this.expireTimer) clearTimeout(this.expireTimer);
			this.expireTimer = setTimeout(() => this.tryExpire(), TIMEOUT_EMPTY_DEALLOCATE);
		} else {
			if (this.expireTimer) clearTimeout(this.expireTimer);
			this.expireTimer = setTimeout(() => this.tryExpire(), TIMEOUT_INACTIVE_DEALLOCATE);
		}
	}
	logBattle(p1score, p1rating, p2rating) {
		let logData = this.battle.logData;
		if (!logData) return;
		this.battle.logData = null; // deallocate to save space
		logData.log = BattleRoom.prototype.getLog.call(logData, 3); // replay log (exact damage)

		// delete some redundant data
		if (p1rating) {
			delete p1rating.formatid;
			delete p1rating.username;
			delete p1rating.rpsigma;
			delete p1rating.sigma;
		}
		if (p2rating) {
			delete p2rating.formatid;
			delete p2rating.username;
			delete p2rating.rpsigma;
			delete p2rating.sigma;
		}

		logData.p1rating = p1rating;
		logData.p2rating = p2rating;
		logData.endType = this.battle.endType;
		if (!p1rating) logData.ladderError = true;
		const date = new Date();
		logData.timestamp = '' + date;
		logData.id = this.id;
		logData.format = this.format;
		const logsubfolder = Chat.toTimestamp(date).split(' ')[0];
		const logfolder = logsubfolder.split('-', 2).join('-');

		let curpath = 'logs/' + logfolder;
		fs.mkdir(curpath, '0755', () => {
			let tier = this.format.toLowerCase().replace(/[^a-z0-9]+/g, '');
			curpath += '/' + tier;
			fs.mkdir(curpath, '0755', () => {
				curpath += '/' + logsubfolder;
				fs.mkdir(curpath, '0755', () => {
					fs.writeFile(curpath + '/' + this.id + '.log.json', JSON.stringify(logData), () => {});
				});
			});
		}); // asychronicity
		//console.log(JSON.stringify(logData));
	}
	tryExpire() {
		this.expire();
	}
	getInactiveSide() {
		let p1active = this.battle.p1 && this.battle.p1.active;
		let p2active = this.battle.p2 && this.battle.p2.active;

		if (p1active && this.battle.requests.p1) {
			if (!this.battle.requests.p1[2]) p1active = false;
		}
		if (p2active && this.battle.requests.p2) {
			if (!this.battle.requests.p2[2]) p2active = false;
		}

		if (p1active && !p2active) return 1;
		if (p2active && !p1active) return 0;
		return -1;
	}
	sendPlayer(num, message) {
		let player = this.getPlayer(num);
		if (!player) return false;
		player.sendRoom(message);
	}
	getPlayer(num) {
		return this.battle['p' + (num + 1)];
	}
	requestModchat(user) {
		if (user === null) {
			this.modchatUser = '';
			return;
		} else if (user.can('modchat') || !this.modchatUser || this.modchatUser === user.userid) {
			this.modchatUser = user.userid;
			return;
		} else {
			return "Only the user who set modchat and global staff can change modchat levels in battle rooms";
		}
	}
	onConnect(user, connection) {
		this.sendUser(connection, '|init|battle\n|title|' + this.title + '\n' + this.getLogForUser(user).join('\n'));
		if (this.game && this.game.onConnect) this.game.onConnect(user, connection);
	}
	onJoin(user, connection) {
		if (!user) return false;
		if (this.users[user.userid]) return user;

		if (user.named) {
			this.add((this.reportJoins && !user.locked ? '|j|' : '|J|') + user.name).update();
		}

		this.users[user.userid] = user;
		this.userCount++;

		if (this.game && this.game.onJoin) {
			this.game.onJoin(user, connection);
		}
		return user;
	}
	onRename(user, oldid, joining) {
		if (joining) {
			this.add((this.reportJoins && !user.locked ? '|j|' : '|J|') + user.name);
		}
		delete this.users[oldid];
		this.users[user.userid] = user;
		this.update();
		return user;
	}
	onUpdateIdentity() {}
	onLeave(user) {
		if (!user) return; // ...
		if (!user.named) {
			delete this.users[user.userid];
			return;
		}
		delete this.users[user.userid];
		this.userCount--;
		this.add((this.reportJoins && !user.locked ? '|l|' : '|L|') + user.name);

		if (this.game && this.game.onLeave) {
			this.game.onLeave(user);
		}
		this.update();
	}
	expire() {
		this.send('|expire|');
		this.destroy();
	}
	destroy() {
		// deallocate ourself

		if (this.tour) {
			// resolve state of the tournament;
			if (!this.battle.ended) this.tour.onBattleWin(this, '');
			this.tour = null;
		}

		// remove references to ourself
		for (let i in this.users) {
			this.users[i].leaveRoom(this, null, true);
			delete this.users[i];
		}
		this.users = null;

		// deallocate children and get rid of references to them
		if (this.game) {
			this.game.destroy();
		}
		this.battle = null;
		this.game = null;

		this.active = false;

		if (this.expireTimer) {
			clearTimeout(this.expireTimer);
		}
		this.expireTimer = null;

		if (this.muteTimer) {
			clearTimeout(this.muteTimer);
		}
		this.muteTimer = null;

		// get rid of some possibly-circular references
		Rooms.rooms.delete(this.id);
	}
}

class ChatRoom extends Room {
	constructor(roomid, title, options) {
		super(roomid, title);
		if (options) {
			Object.assign(this, options);
			if (!this.isPersonal) this.chatRoomData = options;
		}

		this.logTimes = true;
		this.logFile = null;
		this.logFilename = '';
		this.destroyingLog = false;
		if (this.auth) Object.setPrototypeOf(this.auth, null);
		if (!this.modchat) this.modchat = (Config.chatmodchat || false);
		if (!this.modjoin) this.modjoin = false;
		if (!this.filterStretching) this.filterStretching = false;
		if (!this.filterCaps) this.filterCaps = false;

		this.type = 'chat';

		if (Config.logchat) {
			this.rollLogFile(true);
			this.logEntry = function (entry, date) {
				const timestamp = Chat.toTimestamp(new Date()).split(' ')[1] + ' ';
				entry = entry.replace(/<img[^>]* src="data:image\/png;base64,[^">]+"[^>]*>/g, '');
				this.logFile.write(timestamp + entry + '\n');
			};
			this.logEntry('NEW CHATROOM: ' + this.id);
			if (Config.loguserstats) {
				this.logUserStatsInterval = setInterval(() => this.logUserStats(), Config.loguserstats);
			}
		}

		if (Config.reportjoinsperiod) {
			this.userList = this.getUserList();
			this.reportJoinsQueue = [];
		}

		if (this.isPersonal) {
			this.modlogStream = Rooms.groupchatModlogStream;
		} else {
			this.modlogStream = fs.createWriteStream(path.resolve(__dirname, 'logs/modlog/modlog_' + roomid + '.txt'), {flags:'a+'});
		}
	}

	reportRecentJoins() {
		delete this.reportJoinsInterval;
		if (!this.reportJoinsQueue || this.reportJoinsQueue.length === 0) {
			// nothing to report
			return;
		}
		this.userList = this.getUserList();
		this.send(this.reportJoinsQueue.join('\n'));
		this.reportJoinsQueue.length = 0;
	}

	rollLogFile(sync) {
		let mkdir = sync ? (path, mode, callback) => {
			try {
				fs.mkdirSync(path, mode);
			} catch (e) {}	// directory already exists
			callback();
		} : fs.mkdir;
		let date = new Date();
		let basepath = 'logs/chat/' + this.id + '/';
		mkdir(basepath, '0755', () => {
			const dateString = Chat.toTimestamp(date).split(' ')[0];
			let path = dateString.split('-', 2).join('-');
			mkdir(basepath + path, '0755', () => {
				if (this.destroyingLog) return;
				path += '/' + dateString + '.txt';
				if (path !== this.logFilename) {
					this.logFilename = path;
					if (this.logFile) this.logFile.destroySoon();
					this.logFile = fs.createWriteStream(basepath + path, {flags: 'a'});
					// Create a symlink to today's lobby log.
					// These operations need to be synchronous, but it's okay
					// because this code is only executed once every 24 hours.
					let link0 = basepath + 'today.txt.0';
					try {
						fs.unlinkSync(link0);
					} catch (e) {} // file doesn't exist
					try {
						fs.symlinkSync(path, link0); // `basepath` intentionally not included
						try {
							fs.renameSync(link0, basepath + 'today.txt');
						} catch (e) {} // OS doesn't support atomic rename
					} catch (e) {} // OS doesn't support symlinks
				}
				let currentTime = date.getTime();
				let nextHour = new Date(date.setMinutes(60)).setSeconds(1);
				setTimeout(() => this.rollLogFile(), nextHour - currentTime);
			});
		});
	}
	destroyLog(initialCallback, finalCallback) {
		this.destroyingLog = true;
		initialCallback();
		if (this.logFile) {
			this.logEntry = function () { };
			this.logFile.on('close', finalCallback);
			this.logFile.destroySoon();
		} else {
			finalCallback();
		}
	}
	logUserStats() {
		let total = 0;
		let guests = 0;
		let groups = {};
		for (let group of Config.groupsranking) {
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
		this.logEntry(entry);
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
	reportJoin(type, entry) {
		if (this.reportJoins) {
			this.add('|' + type + '|' + entry).update();
			return;
		}
		entry = '|' + type.toUpperCase() + '|' + entry;
		if (this.reportJoinsQueue) {
			if (!this.reportJoinsInterval) {
				this.reportJoinsInterval = setTimeout(
					() => this.reportRecentJoins(), Config.reportjoinsperiod
				);
			}

			this.reportJoinsQueue.push(entry);
		} else {
			this.send(entry);
		}
		this.logEntry(entry);
	}
	update() {
		if (this.log.length <= this.lastUpdate) return;
		let entries = this.log.slice(this.lastUpdate);
		if (this.reportJoinsQueue && this.reportJoinsQueue.length) {
			clearInterval(this.reportJoinsInterval);
			delete this.reportJoinsInterval;
			Array.prototype.unshift.apply(entries, this.reportJoinsQueue);
			this.reportJoinsQueue.length = 0;
			this.userList = this.getUserList();
		}
		let update = entries.join('\n');
		if (this.log.length > 100) {
			this.log.splice(0, this.log.length - 100);
		}
		this.lastUpdate = this.log.length;

		// Set up expire timer to clean up inactive personal rooms.
		if (this.isPersonal) {
			if (this.expireTimer) clearTimeout(this.expireTimer);
			this.expireTimer = setTimeout(() => this.tryExpire(), TIMEOUT_INACTIVE_DEALLOCATE);
		}

		this.send(update);
	}
	tryExpire() {
		this.destroy();
	}
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
	onConnect(user, connection) {
		let userList = this.userList ? this.userList : this.getUserList();
		this.sendUser(connection, '|init|chat\n|title|' + this.title + '\n' + userList + '\n' + this.getLogSlice(-100).join('\n') + this.getIntroMessage(user));
		if (this.poll) this.poll.onConnect(user, connection);
		if (this.game && this.game.onConnect) this.game.onConnect(user, connection);
	}
	onJoin(user, connection) {
		if (!user) return false; // ???
		if (this.users[user.userid]) return user;

		if (user.named) {
			this.reportJoin('j', user.getIdentity(this.id));
		}

		this.users[user.userid] = user;
		this.userCount++;

		if (this.game && this.game.onJoin) this.game.onJoin(user, connection);
		return user;
	}
	onRename(user, oldid, joining) {
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
		return user;
	}
	/**
	 * onRename, but without a userid change
	 */
	onUpdateIdentity(user) {
		if (user && user.connected && user.named) {
			if (!this.users[user.userid]) return false;
			this.reportJoin('n', user.getIdentity(this.id) + '|' + user.userid);
		}
	}
	onLeave(user) {
		if (!user) return; // ...

		delete this.users[user.userid];
		this.userCount--;

		if (user.named) {
			this.reportJoin('l', user.getIdentity(this.id));
		}
		if (this.game && this.game.onLeave) this.game.onLeave(user);
	}
	destroy() {
		// deallocate ourself

		// remove references to ourself
		for (let i in this.users) {
			this.users[i].leaveRoom(this, null, true);
			delete this.users[i];
		}
		this.users = null;

		Rooms.global.deregisterChatRoom(this.id);
		Rooms.global.delistChatRoom(this.id);

		if (this.aliases) {
			for (let i = 0; i < this.aliases.length; i++) {
				Rooms.aliases.delete(this.aliases[i]);
			}
		}

		if (this.game) {
			this.game.destroy();
		}

		// Clear any active timers for the room
		if (this.muteTimer) {
			clearTimeout(this.muteTimer);
		}
		this.muteTimer = null;
		if (this.expireTimer) {
			clearTimeout(this.expireTimer);
		}
		this.expireTimer = null;
		if (this.reportJoinsInterval) {
			clearInterval(this.reportJoinsInterval);
		}
		this.reportJoinsInterval = null;
		if (this.logUserStatsInterval) {
			clearInterval(this.logUserStatsInterval);
		}
		this.logUserStatsInterval = null;

		if (!this.isPersonal) {
			this.modlogStream.destroySoon();
			this.modlogStream.removeAllListeners('finish');
		}
		this.modlogStream = null;

		// get rid of some possibly-circular references
		Rooms.rooms.delete(this.id);
	}
}

function getRoom(roomid, fallback) {
	if (fallback) throw new Error("fallback parameter in getRoom no longer supported");
	if (roomid && roomid.id) return roomid;
	return Rooms.rooms.get(roomid);
}
Rooms.get = getRoom;
Rooms.search = function (name, fallback) {
	if (fallback) throw new Error("fallback parameter in Rooms.search no longer supported");
	return getRoom(name) || getRoom(toId(name)) || getRoom(Rooms.aliases.get(toId(name)));
};

Rooms.createBattle = function (roomid, format, p1, p2, options) {
	if (roomid && roomid.id) return roomid;
	if (!p1 || !p2) return false;
	if (!roomid) roomid = 'default';
	if (!Rooms.rooms.has(roomid)) {
		// console.log("NEW BATTLE ROOM: " + roomid);
		Monitor.countBattle(p1.latestIp, p1.name);
		Monitor.countBattle(p2.latestIp, p2.name);
		Rooms.rooms.set(roomid, new BattleRoom(roomid, format, p1, p2, options));
	}
	return Rooms(roomid);
};
Rooms.createChatRoom = function (roomid, title, data) {
	let room = Rooms.rooms.get(roomid);
	if (room) return room;

	room = new ChatRoom(roomid, title, data);
	Rooms.rooms.set(roomid, room);
	return room;
};

Rooms.battleModlogStream = fs.createWriteStream(path.resolve(__dirname, 'logs/modlog/modlog_battle.txt'), {flags:'a+'});
Rooms.groupchatModlogStream = fs.createWriteStream(path.resolve(__dirname, 'logs/modlog/modlog_groupchat.txt'), {flags:'a+'});

Rooms.global = null;
Rooms.lobby = null;

Rooms.Room = Room;
Rooms.GlobalRoom = GlobalRoom;
Rooms.BattleRoom = BattleRoom;
Rooms.ChatRoom = ChatRoom;

Rooms.RoomGame = require('./room-game').RoomGame;
Rooms.RoomGamePlayer = require('./room-game').RoomGamePlayer;

Rooms.RoomBattle = require('./room-battle').RoomBattle;
Rooms.RoomBattlePlayer = require('./room-battle').RoomBattlePlayer;
Rooms.SimulatorManager = require('./room-battle').SimulatorManager;
Rooms.SimulatorProcess = require('./room-battle').SimulatorProcess;

// initialize

if (!Config.quietconsole) console.log("NEW GLOBAL: global");
Rooms.global = new GlobalRoom('global');

Rooms.rooms.set('global', Rooms.global);
