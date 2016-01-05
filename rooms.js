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
const PERIODIC_MATCH_INTERVAL = 60 * 1000;

const fs = require('fs');

let Rooms = module.exports = getRoom;

let rooms = Rooms.rooms = Object.create(null);

let aliases = Object.create(null);

let Room = (function () {
	function Room(roomid, title) {
		this.id = roomid;
		this.title = (title || roomid);
		this.reportJoins = Config.reportjoins;

		this.users = Object.create(null);

		this.log = [];

		this.bannedUsers = Object.create(null);
		this.bannedIps = Object.create(null);
		this.muteQueue = [];
		this.muteTimer = null;
	}
	Room.prototype.title = "";
	Room.prototype.type = 'chat';

	Room.prototype.lastUpdate = 0;
	Room.prototype.log = null;
	Room.prototype.users = null;
	Room.prototype.userCount = 0;

	Room.prototype.send = function (message, errorArgument) {
		if (errorArgument) throw new Error("Use Room#sendUser");
		if (this.id !== 'lobby') message = '>' + this.id + '\n' + message;
		Sockets.channelBroadcast(this.id, message);
	};
	Room.prototype.sendAuth = function (message) {
		for (let i in this.users) {
			let user = this.users[i];
			if (user.connected && user.can('receiveauthmessages', null, this)) {
				user.sendTo(this, message);
			}
		}
	};
	Room.prototype.sendUser = function (user, message) {
		user.sendTo(this, message);
	};
	Room.prototype.add = function (message) {
		if (typeof message !== 'string') throw new Error("Deprecated message type");
		if (message.startsWith('|uhtmlchange|')) return this.uhtmlchange(message);
		this.logEntry(message);
		if (this.logTimes && message.substr(0, 3) === '|c|') {
			message = '|c:|' + (~~(Date.now() / 1000)) + '|' + message.substr(3);
		}
		this.log.push(message);
		return this;
	};
	Room.prototype.uhtmlchange = function (message) {
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
	};
	Room.prototype.logEntry = function () {};
	Room.prototype.addRaw = function (message) {
		return this.add('|raw|' + message);
	};
	Room.prototype.getLogSlice = function (amount) {
		let log = this.log.slice(amount);
		log.unshift('|:|' + (~~(Date.now() / 1000)));
		return log;
	};
	Room.prototype.chat = function (user, message, connection) {
		// Battle actions are actually just text commands that are handled in
		// parseCommand(), which in turn often calls Simulator.prototype.sendFor().
		// Sometimes the call to sendFor is done indirectly, by calling
		// room.decision(), where room.constructor === BattleRoom.

		message = CommandParser.parse(message, this, user, connection);

		if (message && message !== true) {
			this.add('|c|' + user.getIdentity(this.id) + '|' + message);
		}
		this.update();
	};

	Room.prototype.toString = function () {
		return this.id;
	};

	// roomban handling
	Room.prototype.isRoomBanned = function (user) {
		if (!user) return;
		if (this.bannedUsers) {
			if (user.userid in this.bannedUsers) {
				return this.bannedUsers[user.userid];
			}
			if (user.autoconfirmed in this.bannedUsers) {
				return this.bannedUsers[user.autoconfirmed];
			}
		}
		if (this.bannedIps) {
			for (let ip in user.ips) {
				if (ip in this.bannedIps) return this.bannedIps[ip];
			}
		}
	};
	Room.prototype.roomBan = function (user, noRecurse, userid) {
		if (!userid) userid = user.userid;
		let alts;
		if (!noRecurse) {
			alts = [];
			Users.users.forEach(function (otherUser) {
				if (otherUser === user) return;
				for (let myIp in user.ips) {
					if (myIp in otherUser.ips) {
						alts.push(otherUser.name);
						this.roomBan(otherUser, true, userid);
						return;
					}
				}
			}, this);
		}
		this.bannedUsers[userid] = userid;
		if (user.autoconfirmed) this.bannedUsers[user.autoconfirmed] = userid;
		if (this.game && this.game.removeBannedUser) {
			this.game.removeBannedUser(user);
		}
		for (let ip in user.ips) {
			this.bannedIps[ip] = userid;
		}
		if (!user.can('bypassall')) user.leaveRoom(this.id);
		return alts;
	};
	Room.prototype.unRoomBan = function (userid, noRecurse) {
		userid = toId(userid);
		let successUserid = false;
		for (let i in this.bannedUsers) {
			let entry = this.bannedUsers[i];
			if (i === userid || entry === userid) {
				delete this.bannedUsers[i];
				successUserid = entry;
				if (!noRecurse && entry !== userid) {
					this.unRoomBan(entry, true);
				}
			}
		}
		for (let i in this.bannedIps) {
			if (this.bannedIps[i] === userid) {
				delete this.bannedIps[i];
				successUserid = userid;
			}
		}
		return successUserid;
	};
	Room.prototype.checkBanned = function (user) {
		let userid = this.isRoomBanned(user);
		if (userid) {
			this.roomBan(user, true, userid);
			return false;
		}
		return true;
	};
	//mute handling
	Room.prototype.runMuteTimer = function (forceReschedule) {
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
		let self = this;
		this.muteTimer = setTimeout(function () {
			self.muteTimer = null;
			self.runMuteTimer(true);
		}, timeUntilExpire);
	};
	Room.prototype.isMuted = function (user) {
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
	};
	Room.prototype.getMuteTime = function (user) {
		let userid = this.isMuted(user);
		if (!userid) return;
		for (let i = 0; i < this.muteQueue.length; i++) {
			if (userid === this.muteQueue[i].userid) {
				return this.muteQueue[i].time - Date.now();
			}
		}
	};
	Room.prototype.mute = function (user, setTime) {
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
		return userid;
	};
	Room.prototype.unmute = function (userid, notifyText) {
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
	};

	return Room;
})();

let GlobalRoom = (function () {
	function GlobalRoom(roomid) {
		this.id = roomid;

		// init battle rooms
		this.battleCount = 0;
		this.searches = Object.create(null);

		// Never do any other file IO synchronously
		// but this is okay to prevent race conditions as we start up PS
		this.lastBattle = 0;
		try {
			this.lastBattle = parseInt(fs.readFileSync('logs/lastbattle.txt', 'utf8'), 10) || 0;
		} catch (e) {} // file doesn't exist [yet]

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
					aliases[room.aliases[a]] = id;
				}
			}
			this.chatRooms.push(room);
			if (room.autojoin) this.autojoin.push(id);
			if (room.staffAutojoin) this.staffAutojoin.push(id);
		}

		// this function is complex in order to avoid several race conditions
		let self = this;
		this.writeNumRooms = (function () {
			let writing = false;
			let lastBattle;	// last lastBattle to be written to file
			let finishWriting = function () {
				writing = false;
				if (lastBattle < self.lastBattle) {
					self.writeNumRooms();
				}
			};
			return function () {
				if (writing) return;

				// batch writing lastbattle.txt for every 10 battles
				if (lastBattle >= self.lastBattle) return;
				lastBattle = self.lastBattle + 10;

				writing = true;
				fs.writeFile('logs/lastbattle.txt.0', '' + lastBattle, function () {
					// rename is atomic on POSIX, but will throw an error on Windows
					fs.rename('logs/lastbattle.txt.0', 'logs/lastbattle.txt', function (err) {
						if (err) {
							// This should only happen on Windows.
							fs.writeFile('logs/lastbattle.txt', '' + lastBattle, finishWriting);
							return;
						}
						finishWriting();
					});
				});
			};
		})();

		this.writeChatRoomData = (function () {
			let writing = false;
			let writePending = false; // whether or not a new write is pending
			let finishWriting = function () {
				writing = false;
				if (writePending) {
					writePending = false;
					self.writeChatRoomData();
				}
			};
			return function () {
				if (writing) {
					writePending = true;
					return;
				}
				writing = true;
				let data = JSON.stringify(self.chatRoomData).replace(/\{"title"\:/g, '\n{"title":').replace(/\]$/, '\n]');
				fs.writeFile('config/chatrooms.json.0', data, function () {
					// rename is atomic on POSIX, but will throw an error on Windows
					fs.rename('config/chatrooms.json.0', 'config/chatrooms.json', function (err) {
						if (err) {
							// This should only happen on Windows.
							fs.writeFile('config/chatrooms.json', data, finishWriting);
							return;
						}
						finishWriting();
					});
				});
			};
		})();

		// init users
		this.users = {};
		this.userCount = 0; // cache of `Object.size(this.users)`
		this.maxUsers = 0;
		this.maxUsersDate = 0;

		this.reportUserStatsInterval = setInterval(
			this.reportUserStats.bind(this),
			REPORT_USER_STATS_INTERVAL
		);

		this.periodicMatchInterval = setInterval(
			this.periodicMatch.bind(this),
			PERIODIC_MATCH_INTERVAL
		);
	}
	GlobalRoom.prototype.type = 'global';

	GlobalRoom.prototype.formatListText = '|formats';

	GlobalRoom.prototype.reportUserStats = function () {
		if (this.maxUsersDate) {
			LoginServer.request('updateuserstats', {
				date: this.maxUsersDate,
				users: this.maxUsers,
			}, function () {});
			this.maxUsersDate = 0;
		}
		LoginServer.request('updateuserstats', {
			date: Date.now(),
			users: this.userCount,
		}, function () {});
	};

	GlobalRoom.prototype.getFormatListText = function () {
		let formatListText = '|formats' + (Ladders.formatsListPrefix || '');
		let curSection = '';
		for (let i in Tools.data.Formats) {
			let format = Tools.data.Formats[i];
			if (!format.challengeShow && !format.searchShow && !format.tournamentShow) continue;

			let section = format.section;
			if (section === undefined) section = format.mod;
			if (!section) section = '';
			if (section !== curSection) {
				curSection = section;
				formatListText += '|,' + (format.column || 1) + '|' + section;
			}
			formatListText += '|' + format.name;
			let displayCode = 0;
			if (format.team) displayCode |= 1;
			if (format.searchShow) displayCode |= 2;
			if (format.challengeShow) displayCode |= 4;
			if (format.tournamentShow) displayCode |= 8;
			formatListText += ',' + displayCode.toString(16);
		}
		return formatListText;
	};

	GlobalRoom.prototype.getRoomList = function (filter) {
		let roomList = {};
		let total = 0;
		let skipCount = 0;
		if (this.battleCount > 150) {
			skipCount = this.battleCount - 150;
		}
		for (let i in Rooms.rooms) {
			let room = Rooms.rooms[i];
			if (!room || !room.active || room.isPrivate) continue;
			if (filter && filter !== room.format && filter !== true) continue;
			if (skipCount && skipCount--) continue;
			let roomData = {};
			if (room.active && room.battle) {
				if (room.battle.p1) roomData.p1 = room.battle.p1.name;
				if (room.battle.p2) roomData.p2 = room.battle.p2.name;
			}
			if (!roomData.p1 || !roomData.p2) continue;
			roomList[room.id] = roomData;

			total++;
			if (total >= 100) break;
		}
		return roomList;
	};
	GlobalRoom.prototype.getRooms = function (user) {
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
	};
	GlobalRoom.prototype.cancelSearch = function (user, format) {
		if (format && !user.searching[format]) return false;

		let searchedFormats = Object.keys(user.searching);
		if (!searchedFormats.length) return false;

		for (let i = 0; i < searchedFormats.length; i++) {
			if (format && searchedFormats[i] !== format) continue;
			let formatSearches = this.searches[searchedFormats[i]];
			for (let j = 0, len = formatSearches.length; j < len; j++) {
				let search = formatSearches[j];
				if (search.userid !== user.userid) continue;
				formatSearches.splice(j, 1);
				delete user.searching[searchedFormats[i]];
				break;
			}
		}

		user.send('|updatesearch|' + JSON.stringify({searching: Object.keys(user.searching)}));
		return true;
	};
	GlobalRoom.prototype.searchBattle = function (user, formatid) {
		if (!user.connected) return;

		formatid = Tools.getFormat(formatid).id;

		user.prepBattle(formatid, 'search', null, this.finishSearchBattle.bind(this, user, formatid));
	};
	GlobalRoom.prototype.finishSearchBattle = function (user, formatid, result) {
		if (!result) return;

		// tell the user they've started searching
		user.send('|updatesearch|' + JSON.stringify({searching: Object.keys(user.searching).concat(formatid)}));

		let newSearch = {
			userid: '',
			team: user.team,
			rating: 1000,
			time: new Date().getTime(),
		};
		let self = this;

		// Get the user's rating before actually starting to search.
		Ladders(formatid).getRating(user.userid).then(function (rating) {
			newSearch.rating = rating;
			newSearch.userid = user.userid;
			self.addSearch(newSearch, user, formatid);
		}, function (error) {
			// Rejects iff we retrieved the rating but the user had changed their name;
			// the search simply doesn't happen in this case.
		});
	};
	GlobalRoom.prototype.matchmakingOK = function (search1, search2, user1, user2, formatid) {
		// This should never happen.
		if (!user1 || !user2) return void require('./crashlogger.js')(new Error("Matched user " + (user1 ? search2.userid : search1.userid) + " not found"), "The main process");

		// users must be different
		if (user1 === user2) return false;

		// users must have different IPs
		if (user1.latestIp === user2.latestIp) return false;

		// users must not have been matched immediately previously
		if (user1.lastMatch === user2.userid || user2.lastMatch === user1.userid) return false;

		// search must be within range
		let searchRange = 100, elapsed = Date.now() - Math.min(search1.time, search2.time);
		if (formatid === 'ou' || formatid === 'oucurrent' || formatid === 'randombattle') searchRange = 50;
		searchRange += elapsed / 300; // +1 every .3 seconds
		if (searchRange > 300) searchRange = 300;
		if (Math.abs(search1.rating - search2.rating) > searchRange) return false;

		user1.lastMatch = user2.userid;
		user2.lastMatch = user1.userid;
		return true;
	};
	GlobalRoom.prototype.addSearch = function (newSearch, user, formatid) {
		// Filter racing conditions
		if (!user.connected || user !== Users.getExact(user.userid)) return;
		if (user.searching[formatid]) return;

		if (!this.searches[formatid]) this.searches[formatid] = [];
		let formatSearches = this.searches[formatid];

		// Prioritize players who have been searching for a match the longest.
		for (let i = 0; i < formatSearches.length; i++) {
			let search = formatSearches[i];
			let searchUser = Users.getExact(search.userid);
			if (this.matchmakingOK(search, newSearch, searchUser, user, formatid)) {
				let usersToUpdate = [user, searchUser];
				for (let j = 0; j < 2; j++) {
					delete usersToUpdate[j].searching[formatid];
					let searchedFormats = Object.keys(usersToUpdate[j].searching);
					usersToUpdate[j].send('|updatesearch|' + JSON.stringify({searching: searchedFormats}));
				}
				formatSearches.splice(i, 1);
				this.startBattle(searchUser, user, formatid, search.team, newSearch.team, {rated: true});
				return;
			}
		}
		user.searching[formatid] = 1;
		formatSearches.push(newSearch);
	};
	GlobalRoom.prototype.periodicMatch = function () {
		for (let formatid in this.searches) {
			let formatSearches = this.searches[formatid];
			if (formatSearches.length < 2) continue;

			let longestSearch = formatSearches[0];
			let longestSearcher = Users.getExact(longestSearch.userid);

			// Prioritize players who have been searching for a match the longest.
			for (let i = 1; i < formatSearches.length; i++) {
				let search = formatSearches[i];
				let searchUser = Users.getExact(search.userid);
				if (this.matchmakingOK(search, longestSearch, searchUser, longestSearcher, formatid)) {
					let usersToUpdate = [longestSearcher, searchUser];
					for (let j = 0; j < 2; j++) {
						delete usersToUpdate[j].searching[formatid];
						let searchedFormats = Object.keys(usersToUpdate[j].searching);
						usersToUpdate[j].send('|updatesearch|' + JSON.stringify({searching: searchedFormats}));
					}
					formatSearches.splice(i, 1);
					formatSearches.splice(0, 1);
					this.startBattle(searchUser, longestSearcher, formatid, search.team, longestSearch.team, {rated: true});
					return;
				}
			}
		}
	};
	GlobalRoom.prototype.send = function (message, user) {
		if (user) {
			user.sendTo(this, message);
		} else {
			Sockets.channelBroadcast(this.id, message);
		}
	};
	GlobalRoom.prototype.sendAuth = function (message) {
		for (let i in this.users) {
			let user = this.users[i];
			if (user.connected && user.can('receiveauthmessages', null, this)) {
				user.sendTo(this, message);
			}
		}
	};
	GlobalRoom.prototype.add = function (message) {
		if (rooms.lobby) return rooms.lobby.add(message);
		return this;
	};
	GlobalRoom.prototype.addRaw = function (message) {
		if (rooms.lobby) return rooms.lobby.addRaw(message);
		return this;
	};
	GlobalRoom.prototype.addChatRoom = function (title) {
		let id = toId(title);
		if (rooms[id]) return false;

		let chatRoomData = {
			title: title,
		};
		let room = Rooms.createChatRoom(id, title, chatRoomData);
		this.chatRoomData.push(chatRoomData);
		this.chatRooms.push(room);
		this.writeChatRoomData();
		return true;
	};
	GlobalRoom.prototype.deregisterChatRoom = function (id) {
		id = toId(id);
		let room = rooms[id];
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
	};
	GlobalRoom.prototype.delistChatRoom = function (id) {
		id = toId(id);
		if (!rooms[id]) return false; // room doesn't exist
		for (let i = this.chatRooms.length - 1; i >= 0; i--) {
			if (id === this.chatRooms[i].id) {
				this.chatRooms.splice(i, 1);
				break;
			}
		}
	};
	GlobalRoom.prototype.removeChatRoom = function (id) {
		id = toId(id);
		let room = rooms[id];
		if (!room) return false; // room doesn't exist
		room.destroy();
		return true;
	};
	GlobalRoom.prototype.autojoinRooms = function (user, connection) {
		// we only autojoin regular rooms if the client requests it with /autojoin
		// note that this restriction doesn't apply to staffAutojoin
		for (let i = 0; i < this.autojoin.length; i++) {
			user.joinRoom(this.autojoin[i], connection);
		}
	};
	GlobalRoom.prototype.checkAutojoin = function (user, connection) {
		if (!user.named) return;
		for (let i = 0; i < this.staffAutojoin.length; i++) {
			let room = Rooms(this.staffAutojoin[i]);
			if (!room) {
				this.staffAutojoin.splice(i, 1);
				i--;
				continue;
			}
			if (room.staffAutojoin === true && user.isStaff ||
					typeof room.staffAutojoin === 'string' && room.staffAutojoin.indexOf(user.group) >= 0) {
				// if staffAutojoin is true: autojoin if isStaff
				// if staffAutojoin is String: autojoin if user.group in staffAutojoin
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
	};
	GlobalRoom.prototype.onConnect = function (user, connection) {
		let initdata = '|updateuser|' + user.name + '|' + (user.named ? '1' : '0') + '|' + user.avatar + '\n';
		connection.send(initdata + this.formatListText);
		if (this.chatRooms.length > 2) connection.send('|queryresponse|rooms|null'); // should display room list
	};
	GlobalRoom.prototype.onJoin = function (user, connection) {
		if (!user) return false; // ???
		if (this.users[user.userid]) return user;

		this.users[user.userid] = user;
		if (++this.userCount > this.maxUsers) {
			this.maxUsers = this.userCount;
			this.maxUsersDate = Date.now();
		}

		return user;
	};
	GlobalRoom.prototype.onRename = function (user, oldid, joining) {
		delete this.users[oldid];
		this.users[user.userid] = user;
		return user;
	};
	GlobalRoom.prototype.onUpdateIdentity = function () {};
	GlobalRoom.prototype.onLeave = function (user) {
		if (!user) return; // ...
		delete this.users[user.userid];
		--this.userCount;
		user.cancelChallengeTo();
		this.cancelSearch(user);
	};
	GlobalRoom.prototype.startBattle = function (p1, p2, format, p1team, p2team, options) {
		let newRoom;
		p1 = Users.get(p1);
		p2 = Users.get(p2);

		if (!p1 || !p2) {
			// most likely, a user was banned during the battle start procedure
			this.cancelSearch(p1);
			this.cancelSearch(p2);
			return;
		}
		if (p1 === p2) {
			this.cancelSearch(p1);
			this.cancelSearch(p2);
			p1.popup("You can't battle your own account. Please use something like Private Browsing to battle yourself.");
			return;
		}

		if (this.lockdown === true) {
			this.cancelSearch(p1);
			this.cancelSearch(p2);
			p1.popup("The server is restarting. Battles will be available again in a few minutes.");
			p2.popup("The server is restarting. Battles will be available again in a few minutes.");
			return;
		}

		//console.log('BATTLE START BETWEEN: ' + p1.userid + ' ' + p2.userid);
		let i = this.lastBattle + 1;
		let formaturlid = format.toLowerCase().replace(/[^a-z0-9]+/g, '');
		while (rooms['battle-' + formaturlid + '-' + i]) {
			i++;
		}
		this.lastBattle = i;
		rooms.global.writeNumRooms();
		newRoom = this.addRoom('battle-' + formaturlid + '-' + i, format, p1, p2, options);
		p1.joinRoom(newRoom);
		p2.joinRoom(newRoom);
		newRoom.joinBattle(p1, p1team);
		newRoom.joinBattle(p2, p2team);
		this.cancelSearch(p1);
		this.cancelSearch(p2);
		if (Config.reportbattles && rooms.lobby) {
			rooms.lobby.add('|b|' + newRoom.id + '|' + p1.getIdentity() + '|' + p2.getIdentity());
		}
		if (Config.logladderip && options.rated) {
			if (!this.ladderIpLog) {
				this.ladderIpLog = fs.createWriteStream('logs/ladderip/ladderip.txt', {flags: 'a'});
			}
			this.ladderIpLog.write(p1.userid + ': ' + p1.latestIp + '\n');
			this.ladderIpLog.write(p2.userid + ': ' + p2.latestIp + '\n');
		}
		return newRoom;
	};
	GlobalRoom.prototype.addRoom = function (room, format, p1, p2, options) {
		room = Rooms.createBattle(room, format, p1, p2, options);
		return room;
	};
	GlobalRoom.prototype.chat = function (user, message, connection) {
		if (rooms.lobby) return rooms.lobby.chat(user, message, connection);
		message = CommandParser.parse(message, this, user, connection);
		if (message && message !== true) {
			connection.popup("You can't send messages directly to the server.");
		}
	};
	return GlobalRoom;
})();

let BattleRoom = (function () {
	function BattleRoom(roomid, format, p1, p2, options) {
		Room.call(this, roomid, "" + p1.name + " vs. " + p2.name);
		this.modchat = (Config.battlemodchat || false);
		this.reportJoins = Config.reportbattlejoins;

		format = '' + (format || '');

		this.format = format;
		this.auth = {};
		//console.log("NEW BATTLE");

		let formatid = toId(format);

		// Sometimes we might allow BattleRooms to have no options
		if (!options) {
			options = {};
		}

		let rated;
		if (options.rated && Tools.getFormat(formatid).rated !== false) {
			rated = {
				p1: p1.userid,
				p2: p2.userid,
				format: format,
			};
		} else {
			rated = false;
		}

		if (options.tour) {
			this.tour = {
				p1: p1.userid,
				p2: p2.userid,
				format: format,
				tour: options.tour,
			};
		} else {
			this.tour = false;
		}

		this.p1 = p1 || null;
		this.p2 = p2 || null;

		this.rated = rated;
		this.battle = Simulator.create(this.id, format, rated, this);
		this.game = this.battle;

		this.sideTicksLeft = [21, 21];
		if (!rated && !this.tour) this.sideTicksLeft = [28, 28];
		this.sideTurnTicks = [0, 0];
		this.disconnectTickDiff = [0, 0];

		if (Config.forcetimer) this.requestKickInactive(false);
	}
	BattleRoom.prototype = Object.create(Room.prototype);
	BattleRoom.prototype.type = 'battle';

	BattleRoom.prototype.resetTimer = null;
	BattleRoom.prototype.resetUser = '';
	BattleRoom.prototype.modchatUser = '';
	BattleRoom.prototype.expireTimer = null;
	BattleRoom.prototype.active = false;

	BattleRoom.prototype.push = function (message) {
		if (typeof message === 'string') {
			this.log.push(message);
		} else {
			this.log = this.log.concat(message);
		}
	};
	BattleRoom.prototype.win = function (winner) {
		// Declare variables here in case we need them for non-rated battles logging.
		let p1score = 0.5;
		let winnerid = toId(winner);

		// Check if the battle was rated to update the ladder, return its response, and log the battle.
		if (this.rated) {
			let rated = this.rated;
			this.rated = false;

			if (winnerid === rated.p1) {
				p1score = 1;
			} else if (winnerid === rated.p2) {
				p1score = 0;
			}

			let p1 = Users.getExact(rated.p1);
			let p1name = p1 ? p1.name : rated.p1;
			let p2 = Users.getExact(rated.p2);
			let p2name = p2 ? p2.name : rated.p2;

			//update.updates.push('[DEBUG] uri: ' + Config.loginserver + 'action.php?act=ladderupdate&serverid=' + Config.serverid + '&p1=' + encodeURIComponent(p1) + '&p2=' + encodeURIComponent(p2) + '&score=' + p1score + '&format=' + toId(rated.format) + '&servertoken=[token]');

			if (!rated.p1 || !rated.p2) {
				this.push('|raw|ERROR: Ladder not updated: a player does not exist');
			} else {
				winner = Users.get(winnerid);
				if (winner && !winner.registered) {
					this.sendUser(winner, '|askreg|' + winner.userid);
				}
				// update rankings
				Ladders(rated.format).updateRating(p1name, p2name, p1score, this);
			}
		} else if (Config.logchallenges) {
			// Log challenges if the challenge logging config is enabled.
			if (winnerid === this.p1.userid) {
				p1score = 1;
			} else if (winnerid === this.p2.userid) {
				p1score = 0;
			}
			this.update();
			this.logBattle(p1score);
		}
		if (Config.autosavereplays) {
			let uploader = Users.get(winnerid);
			if (uploader && uploader.connections[0]) {
				CommandParser.parse('/savereplay', this, uploader, uploader.connections[0]);
			}
		}
		if (this.tour) {
			winner = Users.get(winner);
			let tour = this.tour.tour;
			tour.onBattleWin(this, winner);
		}
		rooms.global.battleCount += 0 - (this.active ? 1 : 0);
		this.active = false;
		this.update();
	};
	// logNum = 0    : spectator log
	// logNum = 1, 2 : player log
	// logNum = 3    : replay log
	BattleRoom.prototype.getLog = function (logNum) {
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
	};
	BattleRoom.prototype.getLogForUser = function (user) {
		if (this.game.ended) return this.getLog(3);
		if (!(user in this.game.players)) return this.getLog(0);
		return this.getLog(this.game.players[user].slotNum + 1);
	};
	BattleRoom.prototype.update = function (excludeUser) {
		if (this.log.length <= this.lastUpdate) return;

		Sockets.subchannelBroadcast(this.id, '>' + this.id + '\n\n' + this.log.slice(this.lastUpdate).join('\n'));

		this.lastUpdate = this.log.length;

		// empty rooms time out after ten minutes
		let hasUsers = false;
		for (let i in this.users) { // eslint-disable-line no-unused-vars
			hasUsers = true;
			break;
		}
		if (!hasUsers) {
			if (this.expireTimer) clearTimeout(this.expireTimer);
			this.expireTimer = setTimeout(this.tryExpire.bind(this), TIMEOUT_EMPTY_DEALLOCATE);
		} else {
			if (this.expireTimer) clearTimeout(this.expireTimer);
			this.expireTimer = setTimeout(this.tryExpire.bind(this), TIMEOUT_INACTIVE_DEALLOCATE);
		}
	};
	BattleRoom.prototype.logBattle = function (p1score, p1rating, p2rating) {
		let logData = this.battle.logData;
		logData.p1rating = p1rating;
		logData.p2rating = p2rating;
		logData.endType = this.battle.endType;
		if (!p1rating) logData.ladderError = true;
		logData.log = BattleRoom.prototype.getLog.call(logData, 3); // replay log (exact damage)
		let date = new Date();
		let logfolder = date.format('{yyyy}-{MM}');
		let logsubfolder = date.format('{yyyy}-{MM}-{dd}');
		let curpath = 'logs/' + logfolder;
		let self = this;
		fs.mkdir(curpath, '0755', function () {
			let tier = self.format.toLowerCase().replace(/[^a-z0-9]+/g, '');
			curpath += '/' + tier;
			fs.mkdir(curpath, '0755', function () {
				curpath += '/' + logsubfolder;
				fs.mkdir(curpath, '0755', function () {
					fs.writeFile(curpath + '/' + self.id + '.log.json', JSON.stringify(logData));
				});
			});
		}); // asychronicity
		//console.log(JSON.stringify(logData));
	};
	BattleRoom.prototype.tryExpire = function () {
		this.expire();
	};
	BattleRoom.prototype.getInactiveSide = function () {
		let p1active = this.battle.p1 && this.battle.p1.active;
		let p2active = this.battle.p2 && this.battle.p2.active;
		if (p1active && !p2active) return 1;
		if (p2active && !p1active) return 0;
		return this.battle.inactiveSide;
	};
	BattleRoom.prototype.forfeit = function (user, message, side) {
		if (!this.battle || this.battle.ended || !this.battle.started) return false;

		if (!message) message = ' forfeited.';

		if (side === undefined) {
			if (user in this.game.players) side = this.game.players[user].slotNum;
		}
		if (side === undefined) return false;

		let ids = ['p1', 'p2'];
		let otherids = ['p2', 'p1'];

		let name = 'Player ' + (side + 1);
		if (user) {
			name = user.name;
		} else if (this.rated) {
			name = this.rated[ids[side]];
		}

		this.add('|-message|' + name + message);
		this.battle.endType = 'forfeit';
		this.battle.send('win', otherids[side]);
		rooms.global.battleCount += (this.battle.active ? 1 : 0) - (this.active ? 1 : 0);
		this.active = this.battle.active;
		this.update();
		return true;
	};
	BattleRoom.prototype.sendPlayer = function (num, message) {
		let player = this.getPlayer(num);
		if (!player) return false;
		player.sendRoom(message);
	};
	BattleRoom.prototype.getPlayer = function (num) {
		return this.battle['p' + (num + 1)];
	};
	BattleRoom.prototype.kickInactive = function () {
		clearTimeout(this.resetTimer);
		this.resetTimer = null;

		if (!this.battle || this.battle.ended || !this.battle.started) return false;

		let inactiveSide = this.getInactiveSide();

		let ticksLeft = [0, 0];
		if (inactiveSide !== 1) {
			// side 0 is inactive
			this.sideTurnTicks[0]--;
			this.sideTicksLeft[0]--;
		}
		if (inactiveSide !== 0) {
			// side 1 is inactive
			this.sideTurnTicks[1]--;
			this.sideTicksLeft[1]--;
		}
		ticksLeft[0] = Math.min(this.sideTurnTicks[0], this.sideTicksLeft[0]);
		ticksLeft[1] = Math.min(this.sideTurnTicks[1], this.sideTicksLeft[1]);

		if (ticksLeft[0] && ticksLeft[1]) {
			if (inactiveSide === 0 || inactiveSide === 1) {
				// one side is inactive
				let inactiveTicksLeft = ticksLeft[inactiveSide];
				let inactiveUser = this.getPlayer(inactiveSide);
				if (inactiveTicksLeft % 3 === 0 || inactiveTicksLeft <= 4) {
					this.send('|inactive|' + (inactiveUser ? inactiveUser.name : 'Player ' + (inactiveSide + 1)) + ' has ' + (inactiveTicksLeft * 10) + ' seconds left.');
				}
			} else {
				// both sides are inactive
				let inactiveUser0 = this.getPlayer(0);
				if (inactiveUser0 && (ticksLeft[0] % 3 === 0 || ticksLeft[0] <= 4)) {
					inactiveUser0.sendRoom('|inactive|' + inactiveUser0.name + ' has ' + (ticksLeft[0] * 10) + ' seconds left.');
				}

				let inactiveUser1 = this.getPlayer(1);
				if (inactiveUser1 && (ticksLeft[1] % 3 === 0 || ticksLeft[1] <= 4)) {
					inactiveUser1.sendRoom('|inactive|' + inactiveUser1.name + ' has ' + (ticksLeft[1] * 10) + ' seconds left.');
				}
			}
			this.resetTimer = setTimeout(this.kickInactive.bind(this), 10 * 1000);
			return;
		}

		if (inactiveSide < 0) {
			if (ticksLeft[0]) {
				inactiveSide = 1;
			} else if (ticksLeft[1]) {
				inactiveSide = 0;
			}
		}

		this.forfeit(this.getPlayer(inactiveSide), ' lost due to inactivity.', inactiveSide);
		this.resetUser = '';
	};
	BattleRoom.prototype.requestKickInactive = function (user, force) {
		if (this.resetTimer) {
			if (user) this.sendUser(user, '|inactive|The inactivity timer is already counting down.');
			return false;
		}
		if (user) {
			if (!force && !(user in this.game.players)) return false;
			this.resetUser = user.userid;
			this.send('|inactive|Battle timer is now ON: inactive players will automatically lose when time\'s up. (requested by ' + user.name + ')');
		} else if (user === false) {
			this.resetUser = '~';
			this.add('|inactive|Battle timer is ON: inactive players will automatically lose when time\'s up.');
		}

		// a tick is 10 seconds

		let maxTicksLeft = 15; // 2 minutes 30 seconds
		if (!this.battle.p1 || !this.battle.p2 || !this.battle.p1.active || !this.battle.p2.active) {
			// if a player has left, don't wait longer than 6 ticks (1 minute)
			maxTicksLeft = 6;
		}
		if (!this.rated && !this.tour) maxTicksLeft = 30;

		this.sideTurnTicks = [maxTicksLeft, maxTicksLeft];

		let inactiveSide = this.getInactiveSide();
		if (inactiveSide < 0) {
			// add 10 seconds to bank if they're below 160 seconds
			if (this.sideTicksLeft[0] < 16) this.sideTicksLeft[0]++;
			if (this.sideTicksLeft[1] < 16) this.sideTicksLeft[1]++;
		}
		this.sideTicksLeft[0]++;
		this.sideTicksLeft[1]++;
		if (inactiveSide !== 1) {
			// side 0 is inactive
			let ticksLeft0 = Math.min(this.sideTicksLeft[0] + 1, maxTicksLeft);
			this.sendPlayer(0, '|inactive|You have ' + (ticksLeft0 * 10) + ' seconds to make your decision.');
		}
		if (inactiveSide !== 0) {
			// side 1 is inactive
			let ticksLeft1 = Math.min(this.sideTicksLeft[1] + 1, maxTicksLeft);
			this.sendPlayer(1, '|inactive|You have ' + (ticksLeft1 * 10) + ' seconds to make your decision.');
		}

		this.resetTimer = setTimeout(this.kickInactive.bind(this), 10 * 1000);
		return true;
	};
	BattleRoom.prototype.nextInactive = function () {
		if (this.resetTimer) {
			this.update();
			clearTimeout(this.resetTimer);
			this.resetTimer = null;
			this.requestKickInactive();
		}
	};
	BattleRoom.prototype.stopKickInactive = function (user, force) {
		if (!force && user && user.userid !== this.resetUser) return false;
		if (this.resetTimer) {
			clearTimeout(this.resetTimer);
			this.resetTimer = null;
			this.send('|inactiveoff|Battle timer is now OFF.');
			return true;
		}
		return false;
	};
	BattleRoom.prototype.kickInactiveUpdate = function () {
		if (this.battle.allowRenames) return false;

		let p1inactive = !this.battle.p1 || !this.battle.p1.active;
		let p2inactive = !this.battle.p2 || !this.battle.p2.active;

		if (this.resetTimer) {
			let inactiveSide = this.getInactiveSide();
			let changed = false;

			if ((p1inactive || p2inactive) && !this.disconnectTickDiff[0] && !this.disconnectTickDiff[1]) {
				if ((p1inactive && inactiveSide === 0) || (p2inactive && inactiveSide === 1)) {
					let inactiveUser = this.getPlayer(inactiveSide);

					if (p1inactive && inactiveSide === 0 && this.sideTurnTicks[0] > 7) {
						this.disconnectTickDiff[0] = this.sideTurnTicks[0] - 7;
						this.sideTurnTicks[0] = 7;
						changed = true;
					} else if (p2inactive && inactiveSide === 1 && this.sideTurnTicks[1] > 7) {
						this.disconnectTickDiff[1] = this.sideTurnTicks[1] - 7;
						this.sideTurnTicks[1] = 7;
						changed = true;
					}

					if (changed) {
						this.send('|inactive|' + (inactiveUser ? inactiveUser.name : 'Player ' + (inactiveSide + 1)) + ' disconnected and has a minute to reconnect!');
						return true;
					}
				}
			} else if (!p1inactive && !p2inactive) {
				// Only one of the following conditions should happen, but do
				// them both since you never know...
				if (this.disconnectTickDiff[0]) {
					this.sideTurnTicks[0] = this.sideTurnTicks[0] + this.disconnectTickDiff[0];
					this.disconnectTickDiff[0] = 0;
					changed = 0;
				}

				if (this.disconnectTickDiff[1]) {
					this.sideTurnTicks[1] = this.sideTurnTicks[1] + this.disconnectTickDiff[1];
					this.disconnectTickDiff[1] = 0;
					changed = 1;
				}

				if (changed !== false) {
					let user = this.getPlayer(changed);
					this.send('|inactive|' + (user ? user.name : 'Player ' + (changed + 1)) + ' reconnected and has ' + (this.sideTurnTicks[changed] * 10) + ' seconds left!');
					return true;
				}
			}
		}

		return false;
	};
	BattleRoom.prototype.requestModchat = function (user) {
		if (user === null) {
			this.modchatUser = '';
			return;
		} else if (user.can('modchat') || !this.modchatUser || this.modchatUser === user.userid) {
			this.modchatUser = user.userid;
			return;
		} else {
			return "Only the user who set modchat and global staff can change modchat levels in battle rooms";
		}
	};
	BattleRoom.prototype.decision = function (user, choice, data) {
		this.battle.sendFor(user, choice, data);
		if (this.active !== this.battle.active) {
			rooms.global.battleCount += (this.battle.active ? 1 : 0) - (this.active ? 1 : 0);
			this.active = this.battle.active;
		}
		this.update();
	};
	BattleRoom.prototype.onConnect = function (user, connection) {
		this.sendUser(connection, '|init|battle\n|title|' + this.title + '\n' + this.getLogForUser(user).join('\n'));
		if (this.game && this.game.onConnect) this.game.onConnect(user, connection);
	};
	BattleRoom.prototype.onJoin = function (user, connection) {
		if (!user) return false;
		if (this.users[user.userid]) return user;

		if (user.named) {
			this.add((this.reportJoins ? '|j|' : '|J|') + user.name).update();
		}

		this.users[user.userid] = user;
		this.userCount++;

		if (this.game && this.game.onJoin) {
			this.game.onJoin(user, connection);
			rooms.global.battleCount += (this.battle.active ? 1 : 0) - (this.active ? 1 : 0);
			this.active = this.battle.active;
		}
		return user;
	};
	BattleRoom.prototype.onRename = function (user, oldid, joining) {
		if (joining) {
			this.add((this.reportJoins ? '|j|' : '|J|') + user.name);
		}
		delete this.users[oldid];
		this.users[user.userid] = user;
		if (this.game && this.game.onRename) this.game.onRename(user, oldid, joining);
		this.update();
		return user;
	};
	BattleRoom.prototype.onUpdateIdentity = function () {};
	BattleRoom.prototype.onLeave = function (user) {
		if (!user) return; // ...
		if (!user.named) {
			delete this.users[user.userid];
			return;
		}
		delete this.users[user.userid];
		this.userCount--;
		this.add((this.reportJoins ? '|l|' : '|L|') + user.name);

		if (this.game && this.game.onLeave) {
			this.game.onLeave(user);
			rooms.global.battleCount += (this.battle.active ? 1 : 0) - (this.active ? 1 : 0);
			this.active = this.battle.active;
		}
		this.update();
		this.kickInactiveUpdate();
	};
	BattleRoom.prototype.joinBattle = function (user, team) {
		if (this.battle.playerCount >= 2) {
			user.popup("This battle already has two players.");
			return false;
		}

		if (!this.battle.addPlayer(user, team)) {
			user.popup("Failed to join battle.");
			return false;
		}
		this.auth[user.userid] = '\u2605';
		rooms.global.battleCount += (this.battle.active ? 1 : 0) - (this.active ? 1 : 0);
		this.active = this.battle.active;
		if (this.active) {
			this.title = "" + this.battle.p1.name + " vs. " + this.battle.p2.name;
			this.send('|title|' + this.title);
		}
		this.update();
		this.kickInactiveUpdate();
	};
	BattleRoom.prototype.leaveBattle = function (user) {
		if (!user) return false; // ...
		if (this.rated || this.tour) {
			user.popup("Players can't be swapped out in a " + (this.tour ? "tournament" : "rated") + " battle.");
			return false;
		}
		if (!this.battle.removePlayer(user)) {
			user.popup("Failed to leave battle.");
			return false;
		}
		this.auth[user.userid] = '+';
		rooms.global.battleCount += (this.battle.active ? 1 : 0) - (this.active ? 1 : 0);
		this.active = this.battle.active;
		this.update();
		this.kickInactiveUpdate();
		return true;
	};
	BattleRoom.prototype.expire = function () {
		this.send('|expire|');
		this.destroy();
	};
	BattleRoom.prototype.destroy = function () {
		// deallocate ourself

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

		rooms.global.battleCount += 0 - (this.active ? 1 : 0);
		this.active = false;

		if (this.resetTimer) {
			clearTimeout(this.resetTimer);
		}
		this.resetTimer = null;
		if (this.expireTimer) {
			clearTimeout(this.expireTimer);
		}
		this.expireTimer = null;

		if (this.muteTimer) {
			clearTimeout(this.muteTimer);
		}
		this.muteTimer = null;

		// get rid of some possibly-circular references
		delete rooms[this.id];
	};
	return BattleRoom;
})();

let ChatRoom = (function () {
	function ChatRoom(roomid, title, options) {
		Room.call(this, roomid, title);
		if (options) {
			Object.merge(this, options);
			if (!this.isPersonal) this.chatRoomData = options;
		}

		this.logTimes = true;
		this.logFile = null;
		this.logFilename = '';
		this.destroyingLog = false;
		if (!this.modchat) this.modchat = (Config.chatmodchat || false);

		if (Config.logchat) {
			this.rollLogFile(true);
			this.logEntry = function (entry, date) {
				let timestamp = (new Date()).format('{HH}:{mm}:{ss} ');
				entry = entry.replace(/<img[^>]* src="data:image\/png;base64,[^">]+"[^>]*>/g, '');
				this.logFile.write(timestamp + entry + '\n');
			};
			this.logEntry('NEW CHATROOM: ' + this.id);
			if (Config.loguserstats) {
				this.logUserStatsInterval = setInterval(this.logUserStats.bind(this), Config.loguserstats);
			}
		}

		if (Config.reportjoinsperiod) {
			this.userList = this.getUserList();
			this.reportJoinsQueue = [];
		}
	}
	ChatRoom.prototype = Object.create(Room.prototype);
	ChatRoom.prototype.type = 'chat';

	ChatRoom.prototype.reportRecentJoins = function () {
		delete this.reportJoinsInterval;
		if (!this.reportJoinsQueue || this.reportJoinsQueue.length === 0) {
			// nothing to report
			return;
		}
		this.userList = this.getUserList();
		this.send(this.reportJoinsQueue.join('\n'));
		this.reportJoinsQueue.length = 0;
	};

	ChatRoom.prototype.rollLogFile = function (sync) {
		let mkdir = sync ? function (path, mode, callback) {
			try {
				fs.mkdirSync(path, mode);
			} catch (e) {}	// directory already exists
			callback();
		} : fs.mkdir;
		let date = new Date();
		let basepath = 'logs/chat/' + this.id + '/';
		let self = this;
		mkdir(basepath, '0755', function () {
			let path = date.format('{yyyy}-{MM}');
			mkdir(basepath + path, '0755', function () {
				if (self.destroyingLog) return;
				path += '/' + date.format('{yyyy}-{MM}-{dd}') + '.txt';
				if (path !== self.logFilename) {
					self.logFilename = path;
					if (self.logFile) self.logFile.destroySoon();
					self.logFile = fs.createWriteStream(basepath + path, {flags: 'a'});
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
				let timestamp = +date;
				date.advance('1 hour').reset('minutes').advance('1 second');
				setTimeout(self.rollLogFile.bind(self), +date - timestamp);
			});
		});
	};
	ChatRoom.prototype.destroyLog = function (initialCallback, finalCallback) {
		this.destroyingLog = true;
		initialCallback();
		if (this.logFile) {
			this.logEntry = function () { };
			this.logFile.on('close', finalCallback);
			this.logFile.destroySoon();
		} else {
			finalCallback();
		}
	};
	ChatRoom.prototype.logUserStats = function () {
		let total = 0;
		let guests = 0;
		let groups = {};
		Config.groupsranking.forEach(function (group) {
			groups[group] = 0;
		});
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
	};

	ChatRoom.prototype.getUserList = function () {
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
	};
	ChatRoom.prototype.reportJoin = function (type, entry) {
		if (this.reportJoins) {
			this.add('|' + type + '|' + entry).update();
			return;
		}
		entry = '|' + type.toUpperCase() + '|' + entry;
		if (this.reportJoinsQueue) {
			if (!this.reportJoinsInterval) {
				this.reportJoinsInterval = setTimeout(
					this.reportRecentJoins.bind(this), Config.reportjoinsperiod
				);
			}

			this.reportJoinsQueue.push(entry);
		} else {
			this.send(entry);
		}
		this.logEntry(entry);
	};
	ChatRoom.prototype.update = function () {
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
			this.expireTimer = setTimeout(this.tryExpire.bind(this), TIMEOUT_INACTIVE_DEALLOCATE);
		}

		this.send(update);
	};
	ChatRoom.prototype.tryExpire = function () {
		this.destroy();
	};
	ChatRoom.prototype.getIntroMessage = function (user) {
		let message = '';
		if (this.introMessage) message += '\n|raw|<div class="infobox"><div' + (!this.isOfficial ? ' class="infobox-limited"' : '') + '>' + this.introMessage + '</div>';
		if (this.staffMessage && user.can('mute', null, this)) message += (message ? '<br />' : '\n|raw|<div class="infobox">') + '(Staff intro:)<br /><div>' + this.staffMessage + '</div>';
		if (this.modchat) {
			message += (message ? '<br />' : '\n|raw|<div class="infobox">') + '<div class="broadcast-red">' +
				'Must be rank ' + this.modchat + ' or higher to talk right now.' +
				'</div>';
		}
		if (message) message += '</div>';
		return message;
	};
	ChatRoom.prototype.onConnect = function (user, connection) {
		let userList = this.userList ? this.userList : this.getUserList();
		this.sendUser(connection, '|init|chat\n|title|' + this.title + '\n' + userList + '\n' + this.getLogSlice(-100).join('\n') + this.getIntroMessage(user));
		if (this.poll) this.poll.onConnect(user, connection);
		if (this.game && this.game.onConnect) this.game.onConnect(user, connection);
	};
	ChatRoom.prototype.onJoin = function (user, connection) {
		if (!user) return false; // ???
		if (this.users[user.userid]) return user;

		if (user.named) {
			this.reportJoin('j', user.getIdentity(this.id));
		}

		this.users[user.userid] = user;
		this.userCount++;

		if (this.game && this.game.onJoin) this.game.onJoin(user, connection);
		return user;
	};
	ChatRoom.prototype.onRename = function (user, oldid, joining) {
		delete this.users[oldid];
		this.users[user.userid] = user;
		if (joining) {
			this.reportJoin('j', user.getIdentity(this.id));
			if (this.staffMessage && user.can('mute', null, this)) this.sendUser(user, '|raw|<div class="infobox">(Staff intro:)<br /><div>' + this.staffMessage + '</div></div>');
		} else if (!user.named) {
			this.reportJoin('l', oldid);
		} else {
			this.reportJoin('n', user.getIdentity(this.id) + '|' + oldid);
		}
		if (!this.checkBanned(user, oldid)) {
			return;
		}
		if (this.game && this.game.onRename) this.game.onRename(user, oldid, joining);
		return user;
	};
	/**
	 * onRename, but without a userid change
	 */
	ChatRoom.prototype.onUpdateIdentity = function (user) {
		if (user && user.connected && user.named) {
			if (!this.users[user.userid]) return false;
			this.reportJoin('n', user.getIdentity(this.id) + '|' + user.userid);
		}
	};
	ChatRoom.prototype.onLeave = function (user) {
		if (!user) return; // ...

		delete this.users[user.userid];
		this.userCount--;

		if (user.named) {
			this.reportJoin('l', user.getIdentity(this.id));
		}
		if (this.game && this.game.onLeave) this.game.onLeave(user);
	};
	ChatRoom.prototype.destroy = function () {
		// deallocate ourself

		// remove references to ourself
		for (let i in this.users) {
			this.users[i].leaveRoom(this, null, true);
			delete this.users[i];
		}
		this.users = null;

		rooms.global.deregisterChatRoom(this.id);
		rooms.global.delistChatRoom(this.id);

		if (this.aliases) {
			for (let i = 0; i < this.aliases.length; i++) {
				delete aliases[this.aliases[i]];
			}
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

		// get rid of some possibly-circular references
		delete rooms[this.id];
	};
	return ChatRoom;
})();

// to make sure you don't get null returned, pass the second argument
function getRoom(roomid, fallback) {
	if (roomid && roomid.id) return roomid;
	if (!roomid) roomid = 'default';
	if (!rooms[roomid] && fallback) {
		return rooms.global;
	}
	return rooms[roomid];
}
Rooms.get = getRoom;
Rooms.search = function (name, fallback) {
	return getRoom(name) || getRoom(toId(name)) || getRoom(Rooms.aliases[toId(name)]) || (fallback ? rooms.global : undefined);
};

Rooms.createBattle = function (roomid, format, p1, p2, options) {
	if (roomid && roomid.id) return roomid;
	if (!p1 || !p2) return false;
	if (!roomid) roomid = 'default';
	if (!rooms[roomid]) {
		// console.log("NEW BATTLE ROOM: " + roomid);
		Monitor.countBattle(p1.latestIp, p1.name);
		Monitor.countBattle(p2.latestIp, p2.name);
		rooms[roomid] = new BattleRoom(roomid, format, p1, p2, options);
	}
	return rooms[roomid];
};
Rooms.createChatRoom = function (roomid, title, data) {
	let room;
	if ((room = rooms[roomid])) return room;

	room = rooms[roomid] = new ChatRoom(roomid, title, data);
	return room;
};

if (!Config.quietconsole) console.log("NEW GLOBAL: global");
rooms.global = new GlobalRoom('global');

Rooms.Room = Room;
Rooms.GlobalRoom = GlobalRoom;
Rooms.BattleRoom = BattleRoom;
Rooms.ChatRoom = ChatRoom;

Rooms.global = rooms.global;
Rooms.lobby = rooms.lobby;
Rooms.aliases = aliases;

Rooms.RoomGame = require('./room-game.js').RoomGame;
Rooms.RoomGamePlayer = require('./room-game.js').RoomGamePlayer;
