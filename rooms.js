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

const TIMEOUT_EMPTY_DEALLOCATE = 10 * 60 * 1000;
const TIMEOUT_INACTIVE_DEALLOCATE = 40 * 60 * 1000;
const REPORT_USER_STATS_INTERVAL = 10 * 60 * 1000;
const PERIODIC_MATCH_INTERVAL = 60 * 1000;

var fs = require('fs');

/* global Rooms: true */
var Rooms = module.exports = getRoom;

var rooms = Rooms.rooms = Object.create(null);

var aliases = Object.create(null);

var Room = (function () {
	function Room(roomid, title) {
		this.id = roomid;
		this.title = (title || roomid);

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
		for (var i in this.users) {
			var user = this.users[i];
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
		this.logEntry(message);
		if (this.logTimes && message.substr(0, 3) === '|c|') {
			message = '|c:|' + (~~(Date.now() / 1000)) + '|' + message.substr(3);
		}
		this.log.push(message);
		return this;
	};
	Room.prototype.logEntry = function () {};
	Room.prototype.addRaw = function (message) {
		return this.add('|raw|' + message);
	};
	Room.prototype.getLogSlice = function (amount) {
		var log = this.log.slice(amount);
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
			if (Users.ShadowBan.checkBanned(user)) {
				Users.ShadowBan.addMessage(user, "To " + this.id, message);
				connection.sendTo(this, '|c|' + user.getIdentity(this.id) + '|' + message);
			} else {
				this.add('|c|' + user.getIdentity(this.id) + '|' + message);
				this.messageCount++;
			}
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
			for (var ip in user.ips) {
				if (ip in this.bannedIps) return this.bannedIps[ip];
			}
		}
	};
	Room.prototype.roomBan = function (user, noRecurse, userid) {
		if (!userid) userid = user.userid;
		var alts;
		if (!noRecurse) {
			alts = [];
			for (var i in Users.users) {
				var otherUser = Users.users[i];
				if (otherUser === user) continue;
				for (var myIp in user.ips) {
					if (myIp in otherUser.ips) {
						alts.push(otherUser.name);
						this.roomBan(otherUser, true, userid);
						break;
					}
				}
			}
		}
		this.bannedUsers[userid] = userid;
		if (user.autoconfirmed) this.bannedUsers[user.autoconfirmed] = userid;
		for (var ip in user.ips) {
			this.bannedIps[ip] = userid;
		}
		if (!user.can('bypassall')) user.leaveRoom(this.id);
		return alts;
	};
	Room.prototype.unRoomBan = function (userid, noRecurse) {
		userid = toId(userid);
		var successUserid = false;
		for (var i in this.bannedUsers) {
			var entry = this.bannedUsers[i];
			if (i === userid || entry === userid) {
				delete this.bannedUsers[i];
				successUserid = entry;
				if (!noRecurse && entry !== userid) {
					this.unRoomBan(entry, true);
				}
			}
		}
		for (var i in this.bannedIps) {
			if (this.bannedIps[i] === userid) {
				delete this.bannedIps[i];
				successUserid = userid;
			}
		}
		return successUserid;
	};
	Room.prototype.checkBanned = function (user) {
		var userid = this.isRoomBanned(user);
		if (userid) {
			this.roomBan(user, true, userid);
			return false;
		}
		return true;
	};
	//mute handling
	Room.prototype.runMuteTimer = function () {
		if (this.muteTimer || this.muteQueue.length === 0) return;

		var timeUntilExpire = this.muteQueue[0].time - Date.now();
		if (timeUntilExpire <= 0) {
			this.unmute(this.muteQueue[0].userid, "Your mute in '" + this.title + "' has expired.");
			//runMuteTimer() is called again in unmute() so this function instance should be closed
			return;
		}
		var self = this;
		this.muteTimer = setTimeout(function () {
			self.muteTimer = null;
			self.runMuteTimer();
		}, timeUntilExpire);
	};
	Room.prototype.isMuted = function (user) {
		if (!user) return;
		if (this.muteQueue) {
			for (var i = 0; i < this.muteQueue.length; i++) {
				var entry = this.muteQueue[i];
				if (user.userid === entry.userid ||
					user.guestNum === entry.guestNum ||
					(user.autoconfirmed && user.autoconfirmed === entry.autoconfirmed)) {
					return entry.userid;
				}
			}
		}
	};
	Room.prototype.getMuteTime = function (user) {
		var userid = this.isMuted(user);
		if (!userid) return;
		for (var i = 0; i < this.muteQueue.length; i++) {
			if (userid === this.muteQueue[i].userid) {
				return this.muteQueue[i].time - Date.now();
			}
		}
	};
	Room.prototype.mute = function (user, setTime) {
		var userid = user.userid;

		if (!setTime) setTime = 7 * 60000; // default time: 7 minutes
		if (setTime > 90 * 60000) setTime = 90 * 60000; // limit 90 minutes

		// If the user is already muted, the existing queue position for them should be removed
		if (this.isMuted(user)) this.unmute(userid);

		// Place the user in a queue for the unmute timer
		for (var i = 0; i <= this.muteQueue.length; i++) {
			var time = Date.now() + setTime;
			if (i === this.muteQueue.length || time < this.muteQueue[i].time) {
				var entry = {
					userid: userid,
					time: time,
					guestNum: user.guestNum,
					autoconfirmed: user.autoconfirmed
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
		var successUserid = false;
		var user = Users(userid);
		if (!user) {
			// If the user is not found, construct a dummy user object for them.
			user = {
				userid: userid,
				autoconfirmed: userid
			};
		}

		for (var i = 0; i < this.muteQueue.length; i++) {
			var entry = this.muteQueue[i];
			if (entry.userid === user.userid ||
				entry.guestNum === user.guestNum ||
				(user.autoconfirmed && entry.autoconfirmed === user.autoconfirmed)) {
				if (i === 0) {
					clearTimeout(this.muteTimer);
					this.muteTimer = null;
					this.muteQueue.splice(0, 1);
					this.runMuteTimer();
				} else {
					this.muteQueue.splice(i, 1);
				}
				successUserid = entry.userid;
				break;
			}
		}

		if (successUserid && user in this.users) {
			user.updateIdentity(this.id);
			if (notifyText) user.popup(notifyText);
		}
		return successUserid;
	};

	return Room;
})();

var GlobalRoom = (function () {
	function GlobalRoom(roomid) {
		this.id = roomid;

		// init battle rooms
		this.battleCount = 0;
		this.searches = Object.create(null);

		// Never do any other file IO synchronously
		// but this is okay to prevent race conditions as we start up PS
		this.lastBattle = 0;
		try {
			this.lastBattle = parseInt(fs.readFileSync('logs/lastbattle.txt')) || 0;
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
				autojoin: true
			}, {
				title: 'Staff',
				isPrivate: true,
				staffRoom: true,
				staffAutojoin: true
			}];
		}

		this.chatRooms = [];

		this.autojoin = []; // rooms that users autojoin upon connecting
		this.staffAutojoin = []; // rooms that staff autojoin upon connecting
		for (var i = 0; i < this.chatRoomData.length; i++) {
			if (!this.chatRoomData[i] || !this.chatRoomData[i].title) {
				console.log('ERROR: Room number ' + i + ' has no data.');
				continue;
			}
			var id = toId(this.chatRoomData[i].title);
			if (!Config.quietconsole) console.log("NEW CHATROOM: " + id);
			var room = Rooms.createChatRoom(id, this.chatRoomData[i].title, this.chatRoomData[i]);
			if (room.aliases) {
				for (var a = 0; a < room.aliases.length; a++) {
					aliases[room.aliases[a]] = id;
				}
			}
			this.chatRooms.push(room);
			if (room.autojoin) this.autojoin.push(id);
			if (room.staffAutojoin) this.staffAutojoin.push(id);
		}

		// this function is complex in order to avoid several race conditions
		var self = this;
		this.writeNumRooms = (function () {
			var writing = false;
			var lastBattle;	// last lastBattle to be written to file
			var finishWriting = function () {
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
			var writing = false;
			var writePending = false; // whether or not a new write is pending
			var finishWriting = function () {
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
				var data = JSON.stringify(self.chatRoomData).replace(/\{"title"\:/g, '\n{"title":').replace(/\]$/, '\n]');
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
				users: this.maxUsers
			}, function () {});
			this.maxUsersDate = 0;
		}
		LoginServer.request('updateuserstats', {
			date: Date.now(),
			users: this.userCount
		}, function () {});
	};

	GlobalRoom.prototype.getFormatListText = function () {
		var formatListText = '|formats' + (Ladders.formatsListPrefix || '');
		var curSection = '';
		for (var i in Tools.data.Formats) {
			var format = Tools.data.Formats[i];
			if (!format.challengeShow && !format.searchShow && !format.tournamentShow) continue;

			var section = format.section;
			if (section === undefined) section = format.mod;
			if (!section) section = '';
			if (section !== curSection) {
				curSection = section;
				formatListText += '|,' + (format.column || 1) + '|' + section;
			}
			formatListText += '|' + format.name;
			var displayCode = 0;
			if (format.team) displayCode |= 1;
			if (format.searchShow) displayCode |= 2;
			if (format.challengeShow) displayCode |= 4;
			if (format.tournamentShow) displayCode |= 8;
			formatListText += ',' + displayCode.toString(16);
		}
		return formatListText;
	};

	GlobalRoom.prototype.getRoomList = function (filter) {
		var roomList = {};
		var total = 0;
		var skipCount = 0;
		if (this.battleCount > 150) {
			skipCount = this.battleCount - 150;
		}
		for (var i in Rooms.rooms) {
			var room = Rooms.rooms[i];
			if (!room || !room.active || room.isPrivate) continue;
			if (filter && filter !== room.format && filter !== true) continue;
			if (skipCount && skipCount--) continue;
			var roomData = {};
			if (room.active && room.battle) {
				if (room.battle.players[0]) roomData.p1 = room.battle.players[0].getIdentity();
				if (room.battle.players[1]) roomData.p2 = room.battle.players[1].getIdentity();
			}
			if (!roomData.p1 || !roomData.p2) continue;
			roomList[room.id] = roomData;

			total++;
			if (total >= 100) break;
		}
		return roomList;
	};
	GlobalRoom.prototype.getRooms = function (user) {
		var roomsData = {official:[], chat:[], userCount: this.userCount, battleCount: this.battleCount};
		for (var i = 0; i < this.chatRooms.length; i++) {
			var room = this.chatRooms[i];
			if (!room) continue;
			if (room.isPrivate && !(room.isPrivate === 'voice' && user.group !== ' ')) continue;
			(room.isOfficial ? roomsData.official : roomsData.chat).push({
				title: room.title,
				desc: room.desc,
				userCount: room.userCount
			});
		}
		return roomsData;
	};
	GlobalRoom.prototype.cancelSearch = function (user, format) {
		if (format && !user.searching[format]) return false;

		var searchedFormats = Object.keys(user.searching);
		if (!searchedFormats.length) return false;

		for (var i = 0; i < searchedFormats.length; i++) {
			if (format && searchedFormats[i] !== format) continue;
			var formatSearches = this.searches[searchedFormats[i]];
			for (var j = 0, len = formatSearches.length; j < len; j++) {
				var search = formatSearches[j];
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

		var newSearch = {
			userid: '',
			team: user.team,
			rating: 1000,
			time: new Date().getTime()
		};
		var self = this;

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
		var searchRange = 100, elapsed = Date.now() - Math.min(search1.time, search2.time);
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
		var formatSearches = this.searches[formatid];

		// Prioritize players who have been searching for a match the longest.
		for (var i = 0; i < formatSearches.length; i++) {
			var search = formatSearches[i];
			var searchUser = Users.getExact(search.userid);
			if (this.matchmakingOK(search, newSearch, searchUser, user, formatid)) {
				var usersToUpdate = [user, searchUser];
				for (var j = 0; j < 2; j++) {
					delete usersToUpdate[j].searching[formatid];
					var searchedFormats = Object.keys(usersToUpdate[j].searching);
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
		for (var formatid in this.searches) {
			var formatSearches = this.searches[formatid];
			if (formatSearches.length < 2) continue;

			var longestSearch = formatSearches[0];
			var longestSearcher = Users.getExact(longestSearch.userid);

			// Prioritize players who have been searching for a match the longest.
			for (var i = 1; i < formatSearches.length; i++) {
				var search = formatSearches[i];
				var searchUser = Users.getExact(search.userid);
				if (this.matchmakingOK(search, longestSearch, searchUser, longestSearcher, formatid)) {
					var usersToUpdate = [longestSearcher, searchUser];
					for (var j = 0; j < 2; j++) {
						delete usersToUpdate[j].searching[formatid];
						var searchedFormats = Object.keys(usersToUpdate[j].searching);
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
		for (var i in this.users) {
			var user = this.users[i];
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
		var id = toId(title);
		if (rooms[id]) return false;

		var chatRoomData = {
			title: title
		};
		var room = Rooms.createChatRoom(id, title, chatRoomData);
		this.chatRoomData.push(chatRoomData);
		this.chatRooms.push(room);
		this.writeChatRoomData();
		return true;
	};
	GlobalRoom.prototype.deregisterChatRoom = function (id) {
		id = toId(id);
		var room = rooms[id];
		if (!room) return false; // room doesn't exist
		if (!room.chatRoomData) return false; // room isn't registered
		// deregister from global chatRoomData
		// looping from the end is a pretty trivial optimization, but the
		// assumption is that more recently added rooms are more likely to
		// be deleted
		for (var i = this.chatRoomData.length - 1; i >= 0; i--) {
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
		for (var i = this.chatRooms.length - 1; i >= 0; i--) {
			if (id === this.chatRooms[i].id) {
				this.chatRooms.splice(i, 1);
				break;
			}
		}
	};
	GlobalRoom.prototype.removeChatRoom = function (id) {
		id = toId(id);
		var room = rooms[id];
		if (!room) return false; // room doesn't exist
		room.destroy();
		return true;
	};
	GlobalRoom.prototype.autojoinRooms = function (user, connection) {
		// we only autojoin regular rooms if the client requests it with /autojoin
		// note that this restriction doesn't apply to staffAutojoin
		for (var i = 0; i < this.autojoin.length; i++) {
			user.joinRoom(this.autojoin[i], connection);
		}
	};
	GlobalRoom.prototype.checkAutojoin = function (user, connection) {
		if (!user.named) return;
		for (var i = 0; i < this.staffAutojoin.length; i++) {
			var room = Rooms.get(this.staffAutojoin[i]);
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
		for (var i = 0; i < user.connections.length; i++) {
			connection = user.connections[i];
			if (connection.autojoins) {
				var autojoins = connection.autojoins.split(',');
				for (var j = 0; j < autojoins.length; j++) {
					user.tryJoinRoom(autojoins[j], connection);
				}
				connection.autojoins = '';
			}
		}
	};
	GlobalRoom.prototype.onJoinConnection = function (user, connection) {
		var initdata = '|updateuser|' + user.name + '|' + (user.named ? '1' : '0') + '|' + user.avatar + '\n';
		connection.send(initdata + this.formatListText);
		if (this.chatRooms.length > 2) connection.send('|queryresponse|rooms|null'); // should display room list
	};
	GlobalRoom.prototype.onJoin = function (user, connection, merging) {
		if (!user) return false; // ???
		if (this.users[user.userid]) return user;

		this.users[user.userid] = user;
		if (++this.userCount > this.maxUsers) {
			this.maxUsers = this.userCount;
			this.maxUsersDate = Date.now();
		}

		if (!merging) {
			var initdata = '|updateuser|' + user.name + '|' + (user.named ? '1' : '0') + '|' + user.avatar + '\n';
			connection.send(initdata + this.formatListText);
			if (this.chatRooms.length > 2) connection.send('|queryresponse|rooms|null'); // should display room list
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
		var newRoom;
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
		var i = this.lastBattle + 1;
		var formaturlid = format.toLowerCase().replace(/[^a-z0-9]+/g, '');
		while (rooms['battle-' + formaturlid + i]) {
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

var BattleRoom = (function () {
	function BattleRoom(roomid, format, p1, p2, options) {
		Room.call(this, roomid, "" + p1.name + " vs. " + p2.name);
		this.modchat = (Config.battlemodchat || false);

		format = '' + (format || '');

		this.format = format;
		this.auth = {};
		//console.log("NEW BATTLE");

		var formatid = toId(format);

		// Sometimes we might allow BattleRooms to have no options
		if (!options) {
			options = {};
		}

		var rated;
		if (options.rated && Tools.getFormat(formatid).rated !== false) {
			rated = {
				p1: p1.userid,
				p2: p2.userid,
				format: format
			};
		} else {
			rated = false;
		}

		if (options.tour) {
			this.tour = {
				p1: p1.userid,
				p2: p2.userid,
				format: format,
				tour: options.tour
			};
		} else {
			this.tour = false;
		}

		this.p1 = p1 || null;
		this.p2 = p2 || null;

		this.rated = rated;
		this.battle = Simulator.create(this.id, format, rated, this);

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
		var p1score = 0.5;
		var winnerid = toId(winner);

		// Check if the battle was rated to update the ladder, return its response, and log the battle.
		if (this.rated) {
			var rated = this.rated;
			this.rated = false;

			if (winnerid === rated.p1) {
				p1score = 1;
			} else if (winnerid === rated.p2) {
				p1score = 0;
			}

			var p1 = Users.getExact(rated.p1);
			var p1name = p1 ? p1.name : rated.p1;
			var p2 = Users.getExact(rated.p2);
			var p2name = p2 ? p2.name : rated.p2;

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
			var uploader = Users.get(winnerid);
			if (uploader && uploader.connections[0]) {
				CommandParser.parse('/savereplay', this, uploader, uploader.connections[0]);
			}
		}
		if (this.tour) {
			var winnerid = toId(winner);
			winner = Users.get(winner);
			var tour = this.tour.tour;
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
		var log = [];
		for (var i = 0; i < this.log.length; ++i) {
			var line = this.log[i];
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
		var logNum = this.battle.getSlot(user) + 1;
		if (logNum < 0) logNum = 0;
		return this.getLog(logNum);
	};
	BattleRoom.prototype.update = function (excludeUser) {
		if (this.log.length <= this.lastUpdate) return;

		Sockets.subchannelBroadcast(this.id, '>' + this.id + '\n\n' + this.log.slice(this.lastUpdate).join('\n'));

		this.lastUpdate = this.log.length;

		// empty rooms time out after ten minutes
		var hasUsers = false;
		for (var i in this.users) {
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
		var logData = this.battle.logData;
		logData.p1rating = p1rating;
		logData.p2rating = p2rating;
		logData.endType = this.battle.endType;
		if (!p1rating) logData.ladderError = true;
		logData.log = BattleRoom.prototype.getLog.call(logData, 3); // replay log (exact damage)
		var date = new Date();
		var logfolder = date.format('{yyyy}-{MM}');
		var logsubfolder = date.format('{yyyy}-{MM}-{dd}');
		var curpath = 'logs/' + logfolder;
		var self = this;
		fs.mkdir(curpath, '0755', function () {
			var tier = self.format.toLowerCase().replace(/[^a-z0-9]+/g, '');
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
		if (this.battle.players[0] && !this.battle.players[1]) return 1;
		if (this.battle.players[1] && !this.battle.players[0]) return 0;
		return this.battle.inactiveSide;
	};
	BattleRoom.prototype.forfeit = function (user, message, side) {
		if (!this.battle || this.battle.ended || !this.battle.started) return false;

		if (!message) message = ' forfeited.';

		if (side === undefined) {
			if (user && user.userid === this.battle.playerids[0]) side = 0;
			if (user && user.userid === this.battle.playerids[1]) side = 1;
		}
		if (side === undefined) return false;

		var ids = ['p1', 'p2'];
		var otherids = ['p2', 'p1'];

		var name = 'Player ' + (side + 1);
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
		var player = this.battle.getPlayer(num);
		if (!player) return false;
		this.sendUser(player, message);
	};
	BattleRoom.prototype.kickInactive = function () {
		clearTimeout(this.resetTimer);
		this.resetTimer = null;

		if (!this.battle || this.battle.ended || !this.battle.started) return false;

		var inactiveSide = this.getInactiveSide();

		var ticksLeft = [0, 0];
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
				var inactiveTicksLeft = ticksLeft[inactiveSide];
				var inactiveUser = this.battle.getPlayer(inactiveSide);
				if (inactiveTicksLeft % 3 === 0 || inactiveTicksLeft <= 4) {
					this.send('|inactive|' + (inactiveUser ? inactiveUser.name : 'Player ' + (inactiveSide + 1)) + ' has ' + (inactiveTicksLeft * 10) + ' seconds left.');
				}
			} else {
				// both sides are inactive
				var inactiveUser0 = this.battle.getPlayer(0);
				if (inactiveUser0 && (ticksLeft[0] % 3 === 0 || ticksLeft[0] <= 4)) {
					this.sendUser(inactiveUser0, '|inactive|' + inactiveUser0.name + ' has ' + (ticksLeft[0] * 10) + ' seconds left.');
				}

				var inactiveUser1 = this.battle.getPlayer(1);
				if (inactiveUser1 && (ticksLeft[1] % 3 === 0 || ticksLeft[1] <= 4)) {
					this.sendUser(inactiveUser1, '|inactive|' + inactiveUser1.name + ' has ' + (ticksLeft[1] * 10) + ' seconds left.');
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

		this.forfeit(this.battle.getPlayer(inactiveSide), ' lost due to inactivity.', inactiveSide);
		this.resetUser = '';
	};
	BattleRoom.prototype.requestKickInactive = function (user, force) {
		if (this.resetTimer) {
			if (user) this.sendUser(user, '|inactive|The inactivity timer is already counting down.');
			return false;
		}
		if (user) {
			if (!force && this.battle.getSlot(user) < 0) return false;
			this.resetUser = user.userid;
			this.send('|inactive|Battle timer is now ON: inactive players will automatically lose when time\'s up. (requested by ' + user.name + ')');
		} else if (user === false) {
			this.resetUser = '~';
			this.add('|inactive|Battle timer is ON: inactive players will automatically lose when time\'s up.');
		}

		// a tick is 10 seconds

		var maxTicksLeft = 15; // 2 minutes 30 seconds
		if (!this.battle.p1 || !this.battle.p2) {
			// if a player has left, don't wait longer than 6 ticks (1 minute)
			maxTicksLeft = 6;
		}
		if (!this.rated && !this.tour) maxTicksLeft = 30;

		this.sideTurnTicks = [maxTicksLeft, maxTicksLeft];

		var inactiveSide = this.getInactiveSide();
		if (inactiveSide < 0) {
			// add 10 seconds to bank if they're below 160 seconds
			if (this.sideTicksLeft[0] < 16) this.sideTicksLeft[0]++;
			if (this.sideTicksLeft[1] < 16) this.sideTicksLeft[1]++;
		}
		this.sideTicksLeft[0]++;
		this.sideTicksLeft[1]++;
		if (inactiveSide !== 1) {
			// side 0 is inactive
			var ticksLeft0 = Math.min(this.sideTicksLeft[0] + 1, maxTicksLeft);
			this.sendPlayer(0, '|inactive|You have ' + (ticksLeft0 * 10) + ' seconds to make your decision.');
		}
		if (inactiveSide !== 0) {
			// side 1 is inactive
			var ticksLeft1 = Math.min(this.sideTicksLeft[1] + 1, maxTicksLeft);
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
		if (!this.rated && !this.tour) return false;
		if (this.resetTimer) {
			var inactiveSide = this.getInactiveSide();
			var changed = false;

			if ((!this.battle.p1 || !this.battle.p2) && !this.disconnectTickDiff[0] && !this.disconnectTickDiff[1]) {
				if ((!this.battle.p1 && inactiveSide === 0) || (!this.battle.p2 && inactiveSide === 1)) {
					var inactiveUser = this.battle.getPlayer(inactiveSide);

					if (!this.battle.p1 && inactiveSide === 0 && this.sideTurnTicks[0] > 7) {
						this.disconnectTickDiff[0] = this.sideTurnTicks[0] - 7;
						this.sideTurnTicks[0] = 7;
						changed = true;
					} else if (!this.battle.p2 && inactiveSide === 1 && this.sideTurnTicks[1] > 7) {
						this.disconnectTickDiff[1] = this.sideTurnTicks[1] - 7;
						this.sideTurnTicks[1] = 7;
						changed = true;
					}

					if (changed) {
						this.send('|inactive|' + (inactiveUser ? inactiveUser.name : 'Player ' + (inactiveSide + 1)) + ' disconnected and has a minute to reconnect!');
						return true;
					}
				}
			} else if (this.battle.p1 && this.battle.p2) {
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
					var user = this.battle.getPlayer(changed);
					this.send('|inactive|' + (user ? user.name : 'Player ' + (changed + 1)) + ' reconnected and has ' + (this.sideTurnTicks[changed] * 10) + ' seconds left!');
					return true;
				}
			}
		}

		return false;
	};
	BattleRoom.prototype.decision = function (user, choice, data) {
		this.battle.sendFor(user, choice, data);
		if (this.active !== this.battle.active) {
			rooms.global.battleCount += (this.battle.active ? 1 : 0) - (this.active ? 1 : 0);
			this.active = this.battle.active;
		}
		this.update();
	};
	// This function is only called when the user is already in the room (with another connection).
	// First-time join calls this.onJoin() below instead.
	BattleRoom.prototype.onJoinConnection = function (user, connection) {
		this.sendUser(connection, '|init|battle\n|title|' + this.title + '\n' + this.getLogForUser(user).join('\n'));
		// this handles joining a battle in which a user is a participant,
		// where the user has already identified before attempting to join
		// the battle
		this.battle.resendRequest(connection);
	};
	BattleRoom.prototype.onJoin = function (user, connection) {
		if (!user) return false;
		if (this.users[user.userid]) return user;

		this.users[user.userid] = user;
		this.userCount++;

		this.sendUser(connection, '|init|battle\n|title|' + this.title + '\n' + this.getLogForUser(user).join('\n'));
		if (user.named) {
			if (Config.reportbattlejoins) {
				this.add('|join|' + user.name);
			} else {
				this.add('|J|' + user.name);
			}
			this.update();
		}

		return user;
	};
	BattleRoom.prototype.onRename = function (user, oldid, joining) {
		if (joining) {
			if (Config.reportbattlejoins) {
				this.add('|join|' + user.name);
			} else {
				this.add('|J|' + user.name);
			}
		}
		var resend = joining || !this.battle.playerTable[oldid];
		if (this.battle.playerTable[oldid]) {
			this.battle.rename();
			if (this.rated) {
				this.forfeit(user, " forfeited by changing their name.");
				resend = false;
			}
		}
		delete this.users[oldid];
		this.users[user.userid] = user;
		this.update();
		if (resend) {
			// this handles a named user renaming themselves into a user in the
			// battle (i.e. by using /nick)
			this.battle.resendRequest(user);
		}
		return user;
	};
	BattleRoom.prototype.onUpdateIdentity = function () {};
	BattleRoom.prototype.onLeave = function (user) {
		if (!user) return; // ...
		if (user.battles[this.id]) {
			this.battle.leave(user);
			rooms.global.battleCount += (this.battle.active ? 1 : 0) - (this.active ? 1 : 0);
			this.active = this.battle.active;
		} else if (!user.named) {
			delete this.users[user.userid];
			return;
		}
		delete this.users[user.userid];
		this.userCount--;
		if (Config.reportbattlejoins) {
			this.add('|leave|' + user.name);
		} else {
			this.add('|L|' + user.name);
		}

		if (Object.isEmpty(this.users)) {
			rooms.global.battleCount += 0 - (this.active ? 1 : 0);
			this.active = false;
		}

		this.update();
		this.kickInactiveUpdate();
	};
	BattleRoom.prototype.joinBattle = function (user, team) {
		var slot;
		if (this.rated || this.tour) {
			slot = this.battle.lastPlayers.indexOf(user.userid);
			if (slot < 0) {
				user.popup("This is a " + (this.tour ? "tournament" : "rated") + " battle; you must be either " + this.battle.lastPlayers.join(" or ") + " to join.");
				return false;
			}
		}

		if (this.battle.active) {
			user.popup("This battle already has two players.");
			return false;
		}

		this.auth[user.userid] = '\u2605';
		this.battle.join(user, slot, team);
		rooms.global.battleCount += (this.battle.active ? 1 : 0) - (this.active ? 1 : 0);
		this.active = this.battle.active;
		if (this.active) {
			this.title = "" + this.battle.p1 + " vs. " + this.battle.p2;
			this.send('|title|' + this.title);
		}
		this.update();
		this.kickInactiveUpdate();
	};
	BattleRoom.prototype.leaveBattle = function (user) {
		if (!user) return false; // ...
		if (user.battles[this.id]) {
			this.battle.leave(user);
		} else {
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
		for (var i in this.users) {
			this.users[i].leaveRoom(this);
			delete this.users[i];
		}
		this.users = null;

		// deallocate children and get rid of references to them
		if (this.battle) {
			this.battle.destroy();
		}
		this.battle = null;

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

var ChatRoom = (function () {
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
				var timestamp = (new Date()).format('{HH}:{mm}:{ss} ');
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
		if (this.reportJoinsQueue.length === 0) {
			// nothing to report
			return;
		}
		if (Config.reportjoinsperiod) {
			this.userList = this.getUserList();
		}
		this.send(this.reportJoinsQueue.join('\n'));
		this.reportJoinsQueue.length = 0;
	};

	ChatRoom.prototype.rollLogFile = function (sync) {
		var mkdir = sync ? function (path, mode, callback) {
			try {
				fs.mkdirSync(path, mode);
			} catch (e) {}	// directory already exists
			callback();
		} : fs.mkdir;
		var date = new Date();
		var basepath = 'logs/chat/' + this.id + '/';
		var self = this;
		mkdir(basepath, '0755', function () {
			var path = date.format('{yyyy}-{MM}');
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
					var link0 = basepath + 'today.txt.0';
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
				var timestamp = +date;
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
		var total = 0;
		var guests = 0;
		var groups = {};
		Config.groupsranking.forEach(function (group) {
			groups[group] = 0;
		});
		for (var i in this.users) {
			var user = this.users[i];
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
		var entry = '|userstats|total:' + total + '|guests:' + guests;
		for (var i in groups) {
			entry += '|' + i + ':' + groups[i];
		}
		this.logEntry(entry);
	};

	ChatRoom.prototype.getUserList = function () {
		var buffer = '';
		var counter = 0;
		for (var i in this.users) {
			if (!this.users[i].named) {
				continue;
			}
			counter++;
			buffer += ',' + this.users[i].getIdentity(this.id);
		}
		var msg = '|users|' + counter + buffer;
		return msg;
	};
	ChatRoom.prototype.reportJoin = function (entry) {
		if (Config.reportjoinsperiod) {
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
		var entries = this.log.slice(this.lastUpdate);
		if (this.reportJoinsQueue && this.reportJoinsQueue.length) {
			clearTimeout(this.reportJoinsInterval);
			delete this.reportJoinsInterval;
			Array.prototype.unshift.apply(entries, this.reportJoinsQueue);
			this.reportJoinsQueue.length = 0;
			this.userList = this.getUserList();
		}
		var update = entries.join('\n');
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
		var message = '';
		if (this.introMessage) message += '\n|raw|<div class="infobox">' + this.introMessage + '</div>';
		if (this.staffMessage && user.can('mute', null, this)) message += (message ? '<br />' : '\n|raw|<div class="infobox">') + '(Staff intro:)<br /><div>' + this.staffMessage + '</div>';
		if (this.modchat) {
			message += (message ? '<br />' : '\n|raw|<div class="infobox">') + '<div class="broadcast-red">' +
				'Must be rank ' + this.modchat + ' or higher to talk right now.' +
				'</div>';
		}
		if (message) message += '</div>';
		return message;
	};
	ChatRoom.prototype.onJoinConnection = function (user, connection) {
		var userList = this.userList ? this.userList : this.getUserList();
		this.sendUser(connection, '|init|chat\n|title|' + this.title + '\n' + userList + '\n' + this.getLogSlice(-25).join('\n') + this.getIntroMessage(user));
		if (this.poll) this.poll.display(user, false);
		if (global.Tournaments && Tournaments.get(this.id)) {
			Tournaments.get(this.id).updateFor(user, connection);
		}
	};
	ChatRoom.prototype.onJoin = function (user, connection, merging) {
		if (!user) return false; // ???
		if (this.users[user.userid]) return user;

		this.users[user.userid] = user;
		this.userCount++;

		if (!merging) {
			var userList = this.userList ? this.userList : this.getUserList();
			this.sendUser(connection, '|init|chat\n|title|' + this.title + '\n' + userList + '\n' + this.getLogSlice(-100).join('\n') + this.getIntroMessage(user));
			if (this.poll) this.poll.display(user, false);
			if (global.Tournaments && Tournaments.get(this.id)) {
				Tournaments.get(this.id).updateFor(user, connection);
			}
		}
		if (user.named && Config.reportjoins) {
			this.add('|j|' + user.getIdentity(this.id));
			this.update();
		} else if (user.named) {
			var entry = '|J|' + user.getIdentity(this.id);
			this.reportJoin(entry);
		}

		return user;
	};
	ChatRoom.prototype.onRename = function (user, oldid, joining) {
		delete this.users[oldid];
		this.users[user.userid] = user;
		var entry;
		if (joining) {
			if (Config.reportjoins) {
				entry = '|j|' + user.getIdentity(this.id);
			} else {
				entry = '|J|' + user.getIdentity(this.id);
			}
			if (this.staffMessage && user.can('mute', null, this)) this.sendUser(user, '|raw|<div class="infobox">(Staff intro:)<br /><div>' + this.staffMessage + '</div></div>');
		} else if (!user.named) {
			entry = '|L| ' + oldid;
		} else {
			entry = '|N|' + user.getIdentity(this.id) + '|' + oldid;
		}
		if (Config.reportjoins) {
			this.add(entry);
		} else {
			this.reportJoin(entry);
		}
		if (!this.checkBanned(user, oldid)) {
			return;
		}
		if (global.Tournaments && Tournaments.get(this.id)) {
			Tournaments.get(this.id).updateFor(user);
		}
		return user;
	};
	/**
	 * onRename, but without a userid change
	 */
	ChatRoom.prototype.onUpdateIdentity = function (user) {
		if (user && user.connected && user.named) {
			if (!this.users[user.userid]) return false;
			var entry = '|N|' + user.getIdentity(this.id) + '|' + user.userid;
			this.reportJoin(entry);
		}
	};
	ChatRoom.prototype.onLeave = function (user) {
		if (!user) return; // ...

		delete this.users[user.userid];
		this.userCount--;

		if (user.named && Config.reportjoins) {
			this.add('|l|' + user.getIdentity(this.id));
		} else if (user.named) {
			var entry = '|L|' + user.getIdentity(this.id);
			this.reportJoin(entry);
		}
	};
	ChatRoom.prototype.destroy = function () {
		// deallocate ourself

		// remove references to ourself
		for (var i in this.users) {
			this.users[i].leaveRoom(this);
			delete this.users[i];
		}
		this.users = null;

		rooms.global.deregisterChatRoom(this.id);
		rooms.global.delistChatRoom(this.id);

		if (this.aliases) {
			for (var i = 0; i < this.aliases.length; i++) {
				delete aliases[this.aliases[i]];
			}
		}

		// Clear any active timers for the room
		if (this.muteTimer) {
			clearTimeout(this.muteTimer);
		}
		this.muteTimer = null;
		if (this.reportJoinsInterval) {
			clearTimeout(this.reportJoinsInterval);
		}
		this.reportJoinsInterval = null;
		if (this.logUserStatsInterval) {
			clearTimeout(this.logUserStatsInterval);
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
	var room;
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
