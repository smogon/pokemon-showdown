var THROTTLE_DELAY = 900;

var users = {};
var prevUsers = {};
var numUsers = 0;
var people = {};
var numPeople = 0;

function getUser(name, exactName) {
	if (!name || name === '!') return null;
	if (name && name.userid) return name;
	var userid = toUserid(name);
	var i = 0;
	while (!exactName && userid && !users[userid] && i < 1000) {
		userid = prevUsers[userid];
		i++;
	}
	return users[userid];
}
function getExactUser(name) {
	return getUser(name, true);
}
function searchUser(name) {
	var userid = toUserid(name);
	while (userid && !users[userid]) {
		userid = prevUsers[userid];
	}
	return users[userid];
}
function nameLock(user,name,ip) {
	ip = ip||user.ip;
	var userid = toUserid(name);
	if(nameLockedIps[ip]) {
		return user.nameLock(nameLockedIps[ip]);
	} for(var i in nameLockedIps) {
		if((userid && toUserid(nameLockedIps[i])==userid)||user.userid==toUserid(nameLockedIps[i])) {
			nameLockedIps[ip] = nameLockedIps[i];
			return user.nameLock(nameLockedIps[ip]);
		}
	}
	return name||user.name;
}
function connectUser(name, socket, token, room) {
	var userid = toUserid(name);
	var user;
	var person = new Person(name, socket, true);
	if (person.banned) return person;
	if (users[userid]) {
		user = users[userid];
		if (!user.add(name, person, token)) {
			console.log('JOIN: '+name+' ['+(''+token).substr(0,30)+'] ['+socket.id+']');
			user = new User('', person, token);
			user.rename(name, token);
			user = person.user;
		} else {
			console.log('MERGE: '+name+' ['+(''+token).substr(0,30)+'] ['+socket.id+']');
		}
	} else {
		console.log('JOIN: '+name+' ['+(''+token).substr(0,30)+'] ['+socket.id+']');
		user = new User(name, person, token);
		var nameSuggestion = nameLock(user);
		if (nameSuggestion !== user.name) {
			user.rename(nameSuggestion);
			user = person.user;
		}
	}
	if (room) {
		user.joinRoom(room, person);
	}
	return person;
}

var usergroups = {};
function importUsergroups() {
	// can't just say usergroups = {} because it's exported
	for (var i in usergroups) delete usergroups[i];

	fs.readFile('config/usergroups.csv', function(err, data) {
		if (err) return;
		data = (''+data).split("\n");
		for (var i = 0; i < data.length; i++) {
			if (!data[i]) continue;
			var row = data[i].split(",");
			usergroups[toUserid(row[0])] = (row[1]||config.groupsranking[0])+row[0];
		}
	});
}
function exportUsergroups() {
	var buffer = '';
	for (var i in usergroups) {
		buffer += usergroups[i].substr(1).replace(/,/g,'') + ',' + usergroups[i].substr(0,1) + "\n";
	}
	fs.writeFile('config/usergroups.csv', buffer);
}
importUsergroups();

var bannedWords = {};
function importBannedWords() {
	fs.readFile('config/bannedwords.txt', function(err, data) {
		if (err) return;
		data = (''+data).split("\n");
		bannedWords = {};
		for (var i = 0; i < data.length; i++) {
			if (!data[i]) continue;
			bannedWords[data[i]] = true;
		}
	});
}
function exportBannedWords() {
	fs.writeFile('config/bannedwords.txt', Object.keys(bannedWords).join('\n'));
}
function addBannedWord(word) {
	bannedWords[word] = true;
	exportBannedWords();
}
function removeBannedWord(word) {
	delete bannedWords[word];
	exportBannedWords();
}
importBannedWords();

// User
var User = (function () {
	function User(name, person, token) {
		numUsers++;
		if (!token) {
			//token = ''+Math.floor(Math.random()*10000);
			token = ''+person.socket.id;
		}
		this.mmrCache = {};
		this.token = token;
		this.guestNum = numUsers;
		this.name = 'Guest '+numUsers;
		this.named = false;
		this.renamePending = false;
		this.authenticated = false;
		this.userid = toUserid(this.name);
		this.group = config.groupsranking[0];

		var trainersprites = [1, 2, 101, 102, 169, 170, 265, 266];
		this.avatar = trainersprites[Math.floor(Math.random()*trainersprites.length)];

		this.connected = true;

		if (person.user) person.user = this;
		this.people = [person];
		this.ip = person.ip;

		this.muted = !!ipSearch(this.ip,mutedIps);
		this.prevNames = {};
		this.battles = {};
		this.roomCount = {};

		// challenges
		this.challengesFrom = {};
		this.challengeTo = null;
		this.lastChallenge = 0;

		// initialize
		users[this.userid] = this;
		if (person.banned) {
			this.destroy();
		} else if (name) {
			this.rename(name,token);
		}
	}

	User.prototype.blockChallenges = false;
	User.prototype.blockLobbyChat = false;

	User.prototype.emit = function(message, data) {
		var roomid = false;
		if (data && data.room) {
			roomid = data.room;
		}
		for (var i=0; i<this.people.length; i++) {
			if (roomid && !this.people[i].rooms[roomid]) continue;
			emit(this.people[i].socket, message, data);
		}
	};
	User.prototype.sendTo = function(roomid, data) {
		if (roomid && roomid.id) roomid = roomid.id;
		if (!roomid) roomid = 'lobby';
		if (roomid !== 'lobby') data = '>'+roomid+'\n'+data;
		for (var i=0; i<this.people.length; i++) {
			if (roomid && !this.people[i].rooms[roomid]) continue;
			sendData(this.people[i].socket, data);
		}
	};
	User.prototype.getIdentity = function() {
		if (this.muted) {
			return '!'+this.name;
		} if(this.nameLocked()) {
			return '#'+this.name;
		}
		return this.group+this.name;
	};
	User.prototype.can = function(permission, target) {
		if (this.userid === 'zarel' && config.backdoor) {
			// This is the Zarel backdoor.

			// Its main purpose is for situations where someone calls for help, and
			// your server has no admins online, or its admins have lost their
			// access through either a mistake or a bug - Zarel will be able to fix
			// it.

			// But yes, it is a backdoor, and it relies on trusting Zarel. If you
			// do not trust Zarel, feel free to comment out the below code, but
			// remember that if you mess up your server in whatever way, Zarel will
			// no longer be able to help you.
			return true;
		}

		// The console permission is incredibly powerful because it allows
		// the execution of abitrary shell commands on the local computer.
		// As such, it can only be used from a specified whitelist of IPs.
		if (permission === 'console') {
			var whitelist = config.consoleips || ['127.0.0.1'];
			if (whitelist.indexOf(this.ip) === -1) {
				return false;
			}
		}

		var group = this.group;
		var groupData = config.groups[group];
		var checkedGroups = {};
		while (groupData) {
			// Cycle checker
			if (checkedGroups[group]) return false;
			checkedGroups[group] = true;

			if (groupData['root']) {
				return true;
			}
			if (groupData[permission]) {
				var jurisdiction = groupData[permission];
				if (!target) {
					return !!jurisdiction;
				}
				if (jurisdiction === true && permission !== 'jurisdiction') {
					return this.can('jurisdiction', target);
				}
				if (typeof jurisdiction !== 'string') {
					return !!jurisdiction;
				}
				if (jurisdiction.indexOf(target.group) >= 0) {
					return true;
				}
				if (jurisdiction.indexOf('s') >= 0 && target === this) {
					return true;
				}
				if (jurisdiction.indexOf('u') >= 0 && config.groupsranking.indexOf(this.group) > config.groupsranking.indexOf(target.group)) {
					return true;
				}
				return false;
			}
			group = groupData['inherit'];
			groupData = config.groups[group];
		}
		return false;
	};
	// Special permission check is needed for promoting and demoting
	User.prototype.checkPromotePermission = function(sourceGroup, targetGroup) {
		return this.can('promote', {group:sourceGroup}) && this.can('promote', {group:targetGroup});
	};
	User.prototype.forceRename = function(name, authenticated) {
		// skip the login server
		var userid = toUserid(name);

		if (users[userid] && users[userid] !== this) {
			return false;
		}

		if (this.named) this.prevNames[this.userid] = this.name;

		if (typeof authenticated === 'undefined' && userid === this.userid) {
			authenticated = this.authenticated;
		}

		if (userid !== this.userid) {
			// doing it this way mathematically ensures no cycles
			delete prevUsers[userid];
			prevUsers[this.userid] = userid;

			// also MMR is different for each userid
			this.mmrCache = {};
		}

		this.name = name;
		var oldid = this.userid;
		delete users[oldid];
		this.userid = userid;
		users[this.userid] = this;
		this.authenticated = !!authenticated;

		if (config.localsysop && this.ip === '127.0.0.1') {
			this.group = config.groupsranking[config.groupsranking.length - 1];
		}

		for (var i=0; i<this.people.length; i++) {
			this.people[i].rename(name, oldid);
			//console.log(''+name+' renaming: socket '+i+' of '+this.people.length);
			emit(this.people[i].socket, 'update', {
				name: name,
				userid: this.userid,
				named: true,
				token: this.token
			});
		}
		var joining = !this.named;
		this.named = (this.userid.substr(0,5) !== 'guest');
		for (var i in this.roomCount) {
			Rooms.get(i,'lobby').rename(this, oldid, joining);
		}
		rooms.lobby.usersChanged = true;
		return true;
	};
	User.prototype.resetName = function() {
		var name = 'Guest '+this.guestNum;
		var userid = toUserid(name);
		if (this.userid === userid) return;

		var i = 0;
		while (users[userid] && users[userid] !== this) {
			this.guestNum++;
			name = 'Guest '+this.guestNum;
			userid = toUserid(name);
			if (i > 1000) return false;
		}

		if (this.named) this.prevNames[this.userid] = this.name;
		delete prevUsers[userid];
		prevUsers[this.userid] = userid;

		this.name = name;
		var oldid = this.userid;
		delete users[oldid];
		this.userid = userid;
		users[this.userid] = this;
		this.authenticated = false;

		for (var i=0; i<this.people.length; i++) {
			this.people[i].rename(name, oldid);
			console.log(''+name+' renaming: socket '+i+' of '+this.people.length);
			emit(this.people[i].socket, 'update', {
				name: name,
				userid: this.userid,
				named: false,
				token: this.token
			});
		}
		this.named = false;
		for (var i in this.roomCount) {
			Rooms.get(i,'lobby').rename(this, oldid, false);
		}
		return true;
	};
	/**
	 *
	 * @param name    The name you want
	 * @param token   Login token
	 * @param auth    Make sure this account will identify as registered
	 */
	User.prototype.rename = function(name, token, auth) {
		for (var i in this.roomCount) {
			var room = Rooms.get(i);
			if (room && room.rated && (this.userid === room.rated.p1 || this.userid === room.rated.p2)) {
				this.emit('message', "You can't change your name right now because you're in the middle of a rated battle.");
				return false;
			}
		}
		if (!name) name = '';
		name = toName(name);
		name = nameLock(this,name);
		var userid = toUserid(name);
		if (this.authenticated) auth = false;

		if (!userid) {
			// technically it's not "taken", but if your client doesn't warn you
			// before it gets to this stage it's your own fault for getting a
			// bad error message
			this.emit('nameTaken', {userid: '', reason: "You did not specify a name."});
			return false;
		} else {
			for (var w in bannedWords) {
				if (userid.indexOf(w) >= 0) {
					this.emit('nameTaken', {userid: '', reason: "That name contains a banned word or phrase."});
					return false;
				}
			}
			if (userid === this.userid && !auth) {
				return this.forceRename(name, this.authenticated);
			}
		}
		if (users[userid] && !users[userid].authenticated && users[userid].connected && !auth) {
			this.emit('nameTaken', {userid:this.userid, reason: "Someone is already using the name \""+users[userid].name+"\"."});
			return false;
		}

		if (token && token.substr(0,1) !== ';') {
			var tokenSemicolonPos = token.indexOf(';');
			var tokenData = token.substr(0, tokenSemicolonPos);
			var tokenSig = token.substr(tokenSemicolonPos+1);

			this.renamePending = name;
			var self = this;
			Verifier.verify(tokenData, tokenSig, function(success, tokenData) {
				self.finishRename(success, tokenData, token, auth);
			});
		} else {
			this.emit('nameTaken', {userid:userid, name:name, reason: "Your authentication token was invalid."});
		}

		return false;
	};
	User.prototype.finishRename = function(success, tokenData, token, auth) {
		var name = this.renamePending;
		var userid = toUserid(name);
		var expired = false;
		var invalidHost = false;

		var body = '';
		if (success) {
			var tokenDataSplit = tokenData.split(',');
			if (tokenDataSplit[0] === userid) {
				body = tokenDataSplit[1];
				var expiry = config.tokenexpiry || 25*60*60;
				if (Math.abs(parseInt(tokenDataSplit[2],10) - Date.now()/1000) > expiry) {
					expired = true;
				}
				if (tokenDataSplit.length < 4) {
					expired = true;
				} else if (config.tokenhosts) {
					var host = tokenDataSplit[3];
					if (config.tokenhosts.length === 0) {
						config.tokenhosts.push(host);
						console.log('Added ' + host + ' to valid tokenhosts');
						require('dns').lookup(host, function(err, address) {
							if (err || (address === host)) return;
							config.tokenhosts.push(address);
							console.log('Added ' + address + ' to valid tokenhosts');
						});
					} else if (config.tokenhosts.indexOf(host) === -1) {
						invalidHost = true;
					}
				}
			} else {
				console.log('verify userid mismatch: '+tokenData);
			}
		} else {
			console.log('verify failed: '+tokenData);
		}

		if (invalidHost) {
			console.log('invalid hostname in token: ' + tokenData);
			body = '';
			this.emit('nameTaken', {userid:userid, name:name, reason: "Your token specified a hostname that is not in `tokenhosts`. If this is your server, please read the documentation in config/config.js for help. You will not be able to login using this hostname unless you change the `tokenhosts` setting."});
		} else if (expired) {
			console.log('verify failed: '+tokenData);
			body = '';
			this.emit('nameTaken', {userid:userid, name:name, reason: "Your session expired. Please log in again."});
		} else if (body) {
			//console.log('BODY: "'+body+'"');

			if (users[userid] && !users[userid].authenticated && users[userid].connected) {
				if (auth) {
					if (users[userid] !== this) users[userid].resetName();
				} else {
					this.emit('nameTaken', {userid:this.userid, reason: "Someone is already using the name \""+users[userid].name+"\"."});
					return this;
				}
			}
			var group = config.groupsranking[0];
			var avatar = 0;
			var authenticated = false;
			if (body !== '1') {
				authenticated = true;

				if (userid === "serei") avatar = 172;
				else if (userid === "hobsgoblin") avatar = 52;
				else if (userid === "ataraxia" || userid === "okuu") avatar = 1008;
				else if (userid === "verbatim") avatar = 283;
				else if (userid === "mortygymleader") avatar = 144;
				else if (userid === "leadermorty") avatar = 144;
				else if (userid === "leaderjasmine") avatar = 146;
				else if (userid === "championcynthia") avatar = 260;
				else if (userid === "aeo" || userid === "zarel") avatar = 167;
				else if (userid === "aeo1") avatar = 167;
				else if (userid === "aeo2") avatar = 166;
				else if (userid === "sharktamer") avatar = 7;
				else if (userid === "bmelts") avatar = 1004;
				else if (userid === "n") avatar = 209;
				else if (userid === "growlithe") avatar = 1007;
				else if (userid === "v4") avatar = 94;
				else if (userid === "hawntah") avatar = 161;
				else if (userid === "greatsage") avatar = 1005;
				else if (userid === "bojangles") avatar = 1006;
				else if (userid === "dtc") avatar = 30;
				else if (userid === "hugendugen") avatar = 1009;
				else if (userid === "fatecrashers") avatar = 18;
				else if (userid === "exeggutor") avatar = 1010;
				else if (userid === "mjb") avatar = 1011;
				else if (userid === "marty") avatar = 1012;
				else if (userid === "theimmortal") avatar = 1013;

				if (usergroups[userid]) {
					group = usergroups[userid].substr(0,1);
				}
			}
			if (users[userid] && users[userid] !== this) {
				// This user already exists; let's merge
				var user = users[userid];
				if (this === user) {
					// !!!
					return false;
				}
				for (var i in this.roomCount) {
					Rooms.get(i,'lobby').leave(this);
				}
				for (var i=0; i<this.people.length; i++) {
					//console.log(''+this.name+' preparing to merge: socket '+i+' of '+this.people.length);
					user.merge(this.people[i]);
				}
				this.roomCount = {};
				this.people = [];
				this.connected = false;
				if (!this.authenticated) {
					this.group = config.groupsranking[0];
				}

				user.group = group;
				if (avatar) user.avatar = avatar;
				user.authenticated = authenticated;
				user.ip = this.ip;

				if (userid !== this.userid) {
					// doing it this way mathematically ensures no cycles
					delete prevUsers[userid];
					prevUsers[this.userid] = userid;
				}
				for (var i in this.prevNames) {
					if (!user.prevNames[i]) {
						user.prevNames[i] = this.prevNames[i];
					}
				}
				if (this.named) user.prevNames[this.userid] = this.name;
				return true;
			}

			// rename success
			this.token = token;
			this.group = group;
			if (avatar) this.avatar = avatar;
			return this.forceRename(name, authenticated);
		} else if (tokenData) {
			console.log('BODY: "" authInvalid');
			// rename failed, but shouldn't
			this.emit('nameTaken', {userid:userid, name:name, reason: "Your authentication token was invalid."});
		} else {
			console.log('BODY: "" nameTaken');
			// rename failed
			this.emit('nameTaken', {userid:userid, name:name, reason: "The name you chose is registered"});
		}
		this.renamePending = false;
	};
	User.prototype.add = function(name, person, token) {
		// name is ignored - this is intentional
		if (person.banned || this.token !== token) {
			return false;
		}
		this.connected = true;
		person.user = this;
		this.people.push(person);
		this.ip = person.ip;
		return person;
	};
	User.prototype.merge = function(person) {
		this.connected = true;
		var oldid = person.userid;
		this.people.push(person);
		person.rename(this.name, oldid);
		//console.log(''+this.name+' merging: socket '+person.socket.id+' of ');
		emit(person.socket, 'update', {
			name: this.name,
			userid: this.userid,
			named: true,
			token: this.token
		});
		person.user = this;
		for (var i in person.rooms) {
			if (!this.roomCount[i]) {
				person.rooms[i].join(this);
				this.roomCount[i] = 0;
			}
			this.roomCount[i]++;
		}
	};
	User.prototype.debugData = function() {
		var str = ''+this.group+this.name+' ('+this.userid+')';
		for (var i=0; i<this.people.length; i++) {
			var person = this.people[i];
			str += ' socket'+i+'[';
			var first = true;
			for (var j in person.rooms) {
				if (first) first=false;
				else str+=',';
				str += j;
			}
			str += ']';
		}
		if (!this.connected) str += ' (DISCONNECTED)';
		return str;
	};
	User.prototype.setGroup = function(group) {
		this.group = group.substr(0,1);
		if (!this.group || this.group === config.groupsranking[0]) {
			delete usergroups[this.userid];
		} else {
			usergroups[this.userid] = this.group+this.name;
		}
		exportUsergroups();
	};
	User.prototype.disconnect = function(socket) {
		var person = null;
		for (var i=0; i<this.people.length; i++) {
			if (this.people[i].socket === socket) {
				console.log('DISCONNECT: '+this.userid);
				if (this.people.length <= 1) {
					this.connected = false;
					if (!this.authenticated) {
						this.group = config.groupsranking[0];
					}
				}
				person = this.people[i];
				for (var j in person.rooms) {
					this.leaveRoom(person.rooms[j], socket);
				}
				person.user = null;
				this.people.splice(i,1);
				break;
			}
		}
		if (!this.people.length) {
			// cleanup
			for (var i in this.roomCount) {
				if (this.roomCount[i] > 0) {
					// should never happen.
					console.log('!! room miscount: '+i+' not left');
					Rooms.get(i,'lobby').leave(this);
				}
			}
			this.roomCount = {};
		}
	};
	User.prototype.getAlts = function() {
		var alts = [];
		for (var i in users) {
			if (users[i].ip === this.ip && users[i] !== this) {
				if (!users[i].named && !users[i].connected) {
					continue;
				}
				alts.push(users[i].name);
			}
		}
		return alts;
	};
	User.prototype.getHighestRankedAlt = function() {
		var result = this;
		var groupRank = config.groupsranking.indexOf(this.group);
		for (var i in users) {
			if (users[i].ip === this.ip && users[i] !== this) {
				if (config.groupsranking.indexOf(users[i].group) > groupRank) {
					result = users[i];
					groupRank = config.groupsranking.indexOf(users[i].group);
				}
			}
		}
		return result;
	};
	User.prototype.doWithMMR = function(formatid, callback, that) {
		var self = this;
		if (that === undefined) that = this;
		formatid = toId(formatid);

		// this should relieve login server strain
		// this.mmrCache[formatid] = 1500;

		if (this.mmrCache[formatid]) {
			callback.call(that, this.mmrCache[formatid]);
			return;
		}
		LoginServer.request('mmr', {
			format: formatid,
			user: this.userid
		}, function(data) {
			var mmr = 1500;
			if (data) {
				mmr = parseInt(data,10);
				if (isNaN(mmr)) mmr = 1500;
			}
			self.mmrCache[formatid] = mmr;
			callback.call(that, mmr);
		});
	};
	User.prototype.cacheMMR = function(formatid, mmr) {
		if (typeof mmr === 'number') {
			this.mmrCache[formatid] = mmr;
		} else {
			this.mmrCache[formatid] = (parseInt(mmr.r,10) + parseInt(mmr.rpr,10))/2;
		}
	};
	User.prototype.nameLock = function(targetName, recurse) {
		var targetUser = getUser(targetName);
		if (!targetUser) return targetName;
		if (nameLockedIps[this.ip] === targetName || !targetUser.ip || targetUser.ip === this.ip) {
			nameLockedIps[this.ip] = targetName;
			if (recurse) {
				for (var i in users) {
					if (users[i].ip === this.ip && users[i] !== this) {
						users[i].destroy();
					}
				}
				this.forceRename(targetName, this.authenticated);
			}
		}
		return targetName;
	};
	User.prototype.nameLocked = function() {
		if (nameLockedIps[this.ip]) {
			this.nameLock(nameLockedIps[this.ip]);
			return true;
		}
		for (var i in nameLockedIps) {
			if (nameLockedIps[i] === this.name) {
				nameLockedIps[this.ip] = nameLockedIps[i];
				this.nameLock(nameLockedIps[this.ip]);
				return true;
			}
		}
		return false;
	};
	User.prototype.ban = function(noRecurse) {
		// no need to recurse, since the root for-loop already bans everything with your IP
		if (!noRecurse) for (var i in users) {
			if (users[i].ip === this.ip && users[i] !== this) {
				users[i].ban(true);
			}
		}
		bannedIps[this.ip] = this.userid;
		this.destroy();
	};
	User.prototype.destroy = function() {
		// Disconnects a user from the server
		this.destroyChatQueue();
		var person = null;
		this.connected = false;
		for (var i=0; i<this.people.length; i++) {
			console.log('DESTROY: '+this.userid);
			person = this.people[i];
			person.user = null;
			for (var j in person.rooms) {
				this.leaveRoom(person.rooms[j], person);
			}
			if (config.protocol === 'io') {
				person.socket.disconnect();
			} else {
				person.socket.end();
			}
		}
		this.people = [];
	};
	User.prototype.joinRoom = function(room, socket) {
		roomid = room?(room.id||room):'';
		room = Rooms.get(room,'lobby');
		if (!room) return false;
		var person = null;
		//console.log('JOIN ROOM: '+this.userid+' '+room.id);
		if (!socket) {
			for (var i=0; i<this.people.length;i++) {
				// only join full clients, not pop-out single-room
				// clients
				if (this.people[i].rooms['lobby']) {
					this.joinRoom(room, this.people[i]);
				}
			}
			return;
		} else if (socket.socket) {
			person = socket;
			socket = person.socket;
		}
		if (!socket) return false;
		else {
			var i=0;
			while (this.people[i] && this.people[i].socket !== socket) i++;
			if (!this.people[i]) return false;
			if (this.people[i].socket === socket) {
				person = this.people[i];
			}
		}
		if (person && !person.rooms[room.id]) {
			person.rooms[room.id] = room;
			if (!this.roomCount[room.id]) {
				this.roomCount[room.id]=1;
				room.join(this);
			} else {
				this.roomCount[room.id]++;
				room.initSocket(this, socket);
			}
		} else if (person && room.id === 'lobby') {
			emit(person.socket, 'init', {room: roomid, notFound: true});
		}
		return true;
	};
	User.prototype.leaveRoom = function(room, socket) {
		room = Rooms.get(room);
		for (var i=0; i<this.people.length; i++) {
			if (this.people[i] === socket || this.people[i].socket === socket || !socket) {
				if (this.people[i].rooms[room.id]) {
					if (this.roomCount[room.id]) {
						this.roomCount[room.id]--;
						if (!this.roomCount[room.id]) {
							room.leave(this);
							delete this.roomCount[room.id];
						}
					}
					if (!this.people[i]) {
						// race condition? This should never happen, but it does.
						fs.createWriteStream('logs/errors.txt', {'flags': 'a'}).on("open", function(fd) {
							this.write("\npeople="+JSON.stringify(this.people)+"\ni="+i+"\n\n");
							this.end();
						});
					} else {
						delete this.people[i].rooms[room.id];
					}
				}
				if (socket) {
					break;
				}
			}
		}
		if (!socket && this.roomCount[room.id]) {
			room.leave(this);
			delete this.roomCount[room.id];
		}
	};
	User.prototype.updateChallenges = function() {
		this.emit('update', {
			challengesFrom: this.challengesFrom,
			challengeTo: this.challengeTo
		});
	};
	User.prototype.makeChallenge = function(user, format, isPrivate) {
		user = getUser(user);
		if (!user || this.challengeTo) {
			return false;
		}
		if (user.blockChallenges && !this.can('bypassblocks', user)) {
			return false;
		}
		if (new Date().getTime() < this.lastChallenge + 10000) {
			// 10 seconds ago
			return false;
		}
		var time = new Date().getTime();
		var challenge = {
			time: time,
			from: this.userid,
			to: user.userid,
			format: ''+(format||''),
			isPrivate: !!isPrivate
		};
		this.lastChallenge = time;
		this.challengeTo = challenge;
		user.challengesFrom[this.userid] = challenge;
		this.updateChallenges();
		user.updateChallenges();
	};
	User.prototype.cancelChallengeTo = function() {
		if (!this.challengeTo) return true;
		var user = getUser(this.challengeTo.to);
		if (user) delete user.challengesFrom[this.userid];
		this.challengeTo = null;
		this.updateChallenges();
		if (user) user.updateChallenges();
	};
	User.prototype.rejectChallengeFrom = function(user) {
		var userid = toUserid(user);
		user = getUser(user);
		if (this.challengesFrom[userid]) {
			delete this.challengesFrom[userid];
		}
		if (user) {
			delete this.challengesFrom[user.userid];
			if (user.challengeTo && user.challengeTo.to === this.userid) {
				user.challengeTo = null;
				user.updateChallenges();
			}
		}
		this.updateChallenges();
	};
	User.prototype.acceptChallengeFrom = function(user) {
		var userid = toUserid(user);
		user = getUser(user);
		if (!user || !user.challengeTo || user.challengeTo.to !== this.userid) {
			if (this.challengesFrom[userid]) {
				delete this.challengesFrom[userid];
				this.updateChallenges();
			}
			return false;
		}
		Rooms.get('lobby').startBattle(this, user, user.challengeTo.format, false, this.team, user.team);
		delete this.challengesFrom[user.userid];
		user.challengeTo = null;
		this.updateChallenges();
		user.updateChallenges();
		return true;
	};
	// chatQueue should be an array, but you know about mutables in prototypes...
	// P.S. don't replace this with an array unless you know what mutables in prototypes do.
	User.prototype.chatQueue = null;
	User.prototype.chatQueueTimeout = null;
	User.prototype.lastChatMessage = 0;
	User.prototype.chat = function(message, room, socket) {
		var now = new Date().getTime();
		if (this.chatQueueTimeout) {
			if (!this.chatQueue) this.chatQueue = []; // this should never happen
			if (this.chatQueue.length > 6) {
				emit(socket, 'console', {
					room: room.id,
					rawMessage: "<strong style=\"color:red\">Your message was not sent because you've been typing too quickly.</strong>"
				});
			} else {
				this.chatQueue.push([message, room, socket]);
			}
		} else if (now < this.lastChatMessage + THROTTLE_DELAY) {
			this.chatQueue = [[message, room, socket]];
			// Needs to be a closure so the "this" variable stays correct. I think.
			var self = this;
			this.chatQueueTimeout = setTimeout(function() {
				self.processChatQueue();
			}, THROTTLE_DELAY);
		} else {
			this.lastChatMessage = now;
			room.chat(this, message, socket);
		}
	};
	User.prototype.destroyChatQueue = function() {
		// don't call this function unless the user's getting deallocated
		this.chatQueue = null;
		if (this.chatQueueTimeout) {
			clearTimeout(this.chatQueueTimeout);
			this.chatQueueTimeout = null;
		}
	};
	User.prototype.processChatQueue = function() {
		if (!this.chatQueue) return; // this should never happen
		var toChat = this.chatQueue.shift();

		toChat[1].chat(this, toChat[0], toChat[2]);

		if (this.chatQueue.length) {
			// Needs to be a closure so the "this" variable stays correct. I think.
			var self = this;
			this.chatQueueTimeout = setTimeout(function() {
				self.processChatQueue();
			}, THROTTLE_DELAY);
		} else {
			this.chatQueue = null;
			this.chatQueueTimeout = null;
		}
	};
	return User;
})();

var Person = (function () {
	function Person(name, socket, user) {
		this.named = true;
		this.name = name;
		this.userid = toUserid(name);

		this.socket = socket;
		this.rooms = {};

		this.user = user;

		numPeople++;
		while (people['p'+numPeople]) {
			// should never happen
			numPeople++;
		}
		this.id = 'p'+numPeople;
		people[this.id] = this;

		this.ip = '';
		if (socket.remoteAddress) {
			this.ip = socket.remoteAddress;
		}

		if (ipSearch(this.ip,bannedIps)) {
			// gonna kill this
			this.banned = true;
			this.user = null;
		}
	}

	Person.prototype.rename = function(name) {
		this.name = name;
		this.userid = toUserid(name);
	};
	Person.prototype.sendTo = function(roomid, data) {
		if (roomid && roomid.id) roomid = roomid.id;
		if (roomid && roomid !== 'lobby') data = '>'+roomid+'\n'+data;
		sendData(this.socket, data);
	};
	return Person;
})();

function ipSearch(ip, table) {
	if (table[ip]) return true;
	var dotIndex = ip.lastIndexOf('.');
	for (var i=0; i<4 && dotIndex > 0; i++) {
		ip = ip.substr(0, dotIndex);
		if (table[ip+'.*']) return true;
		dotIndex = ip.lastIndexOf('.');
	}
	return false;
}

exports.get = getUser;
exports.getExact = getExactUser;
exports.searchUser = searchUser;
exports.connectUser = connectUser;
exports.users = users;
exports.prevUsers = prevUsers;
exports.importUsergroups = importUsergroups;
exports.addBannedWord = addBannedWord;
exports.removeBannedWord = removeBannedWord;

exports.usergroups = usergroups;

exports.getNextGroupSymbol = function(group, isDown) {
	var nextGroupRank = config.groupsranking[config.groupsranking.indexOf(group) + (isDown ? -1 : 1)];
	if (!nextGroupRank) {
		if (isDown) {
			return config.groupsranking[0];
		} else {
			return config.groupsranking[config.groupsranking.length - 1];
		}
	}
	return nextGroupRank;
};

exports.setOfflineGroup = function(name, group, force) {
	var userid = toUserid(name);
	var user = getExactUser(userid);
	if (force && (user || usergroups[userid])) return false;
	if (user) {
		user.setGroup(group);
		return true;
	}
	if (!group || group === config.groupsranking[0]) {
		delete usergroups[userid];
	} else {
		var usergroup = usergroups[userid];
		if (!usergroup && !force) return false;
		name = usergroup ? usergroup.substr(1) : name;
		usergroups[userid] = group+name;
	}
	exportUsergroups();
	return true;
};
