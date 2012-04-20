var users = {};
var prevUsers = {};
var numUsers = 0;
var people = {};
var numPeople = 0;

function getTime() {
	return new Date().getTime();
}
function sanitizeName(name) {
	name = name.trim();
	if (name.length > 18) name = name.substr(0,18);
	var noStartChars = {'&':1,'@':1,'%':1,'+':1,'!':1};
	while (noStartChars[name.substr(0,1)]) {
		name = name.substr(1);
	}
	name = name.replace(/[\|\[\]\,]/g, '');
	return name;
}

function getUser(name) {
	if (!name || name === '!') return null;
	if (name && name.userid) return name;
	var userid = toUserid(name);
	var i = 0;
	while (userid && !users[userid] && i < 1000) {
		userid = prevUsers[userid];
		i++;
	}
	return users[userid];
}
function searchUser(name) {
	var userid = toUserid(name);
	while (userid && !users[userid]) {
		userid = prevUsers[userid];
	}
	return users[userid];
}
function connectUser(name, socket, token, room) {
	var userid = toUserid(name);
	var user;
	console.log("NEW PERSON: "+socket.id);
	var person = new Person(name, socket, true);
	if (person.banned) return person;
	if (users[userid]) {
		user = users[userid];
		if (!user.add(name, person, token)) {
			console.log("NEW USER: [guest] (userid: "+userid+" taken) "+name);
			user = new User('', person, token);
			user.rename(name, token);
		}
	} else {
		console.log("NEW USER: [guest] "+name);
		user = new User(name, person, token);
	}
	if (room) {
		user.joinRoom(room, person);
	}
	return person;
}

var usergroups = {};
function importUsergroups() {
	fs.readFile('config/usergroups.csv', function(err, data) {
		if (err) return;
		data = (''+data).split("\n");
		usergroups = {};
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

function User(name, person, token) {
	var selfP = this;

	numUsers++;

	if (!token) {
		//token = ''+Math.floor(Math.random()*10000);
		token = ''+person.socket.id;
	}
	this.token = token;
	this.guestNum = numUsers;
	this.name = 'Guest '+numUsers;
	this.named = false;
	this.renamePending = false;
	this.authenticated = false;
	this.userid = toUserid(this.name);
	this.group = config.groupsranking[0];

	var trainersprites = [1, 2, 101, 102, 169, 170];
	this.avatar = trainersprites[parseInt(Math.random()*trainersprites.length)];

	this.connected = true;

	if (person.user) person.user = this;
	this.people = [person];
	this.ip = person.ip;

	this.muted = !!ipSearch(this.ip,mutedIps);
	this.prevNames = {};
	this.sides = {};
	this.roomCount = {};

	this.emit = function(message, data) {
		var roomid = false;
		if (data && data.room) {
			roomid = data.room;
		}
		for (var i=0; i<selfP.people.length; i++) {
			if (roomid && !selfP.people[i].rooms[roomid]) continue;
			selfP.people[i].socket.emit(message, data);
		}
	};
	this.getIdentity = function() {
		if (selfP.muted) {
			return '!'+selfP.name;
		}
		return selfP.group+selfP.name;
	};
	this.can = function(permission, targetUser) {
		var group = config.groups[selfP.group];
		if (!group) return false;

		function permissionLookup(permission, curGroup) {
			// Finds the permission taking in account for inheritance
			if (!curGroup) curGroup = group;
			if (curGroup[permission]) {
				var jurisdiction;
				if (typeof curGroup[permission] === 'string') {
					jurisdiction = curGroup[permission];
				} else {
					jurisdiction = permissionLookup('jurisdiction', group);
					if (!jurisdiction) jurisdiction = true;
				}
				if (jurisdiction === true) return true;
				if (typeof jurisdiction === 'string') jurisdiction = jurisdiction.split('');

				// Expand the special group 'u'
				if (jurisdiction.indexOf('u') !== -1) {
					var groupRank = config.groupsranking.indexOf(selfP.group);
					var groupsToAdd = [];
					if (groupRank !== -1) {
						groupsToAdd = config.groupsranking.slice(0, groupRank);
					}
					groupsToAdd.unshift(jurisdiction.indexOf('u'), 1);
					Array.prototype.splice.apply(jurisdiction, groupsToAdd);
				}
				return jurisdiction;
			} else if (curGroup[permission] === false) {
				return false;
			}
			if (!curGroup['inherit']) return false;
			var nextGroup = config.groups[curGroup['inherit']];
			if (!nextGroup) return false;
			return permissionLookup(permission, nextGroup);
		}

		if (permissionLookup('root')) return true;
		var jurisdiction = permissionLookup(permission);
		if (!jurisdiction) return false;
		if (!targetUser) return true;
		if (targetUser && typeof jurisdiction === 'boolean') return false;
		if (targetUser === selfP && jurisdiction.indexOf('s') !== -1) return true;
		if (jurisdiction.indexOf(targetUser.group) !== -1) return true;
		return false;
	};
	// Special permission check is needed for promoting and demoting
	this.checkPromotePermission = function(targetUser, targetGroupSymbol) {
		if (!selfP.can('promote', targetUser)) return false;
		var fakeUser = {group:targetGroupSymbol};
		if (!selfP.can('promote', fakeUser)) return false;
		return true;
	};
	this.getNextGroupSymbol = function(isDown) {
		var nextGroupRank = config.groupsranking[config.groupsranking.indexOf(selfP.group) + (isDown ? -1 : 1)];
		if (!nextGroupRank) {
			if (isDown) {
				return config.groupsranking[0];
			} else {
				return config.groupsranking[config.groupsranking.length - 1];
			}
		}
		return nextGroupRank;
	};
	this.forceRename = function(name, authenticated) {
		// skip the login server
		var userid = toUserid(name);

		if (users[userid] && users[userid] !== selfP) {
			return false;
		}

		if (selfP.named) selfP.prevNames[selfP.userid] = selfP.name;

		if (typeof authenticated === 'undefined' && userid === selfP.userid) {
			authenticated = selfP.authenticated;
		}

		if (userid !== selfP.userid) {
			// doing it this way mathematically ensures no cycles
			delete prevUsers[userid];
			prevUsers[selfP.userid] = userid;
		}

		selfP.name = name;
		var oldid = selfP.userid;
		delete users[oldid];
		selfP.userid = userid;
		users[selfP.userid] = selfP;
		selfP.authenticated = !!authenticated;

		if (config.localsysop && selfP.ip === '127.0.0.1') {
			selfP.group = '&';
		}

		for (var i=0; i<selfP.people.length; i++) {
			selfP.people[i].rename(name, oldid);
			console.log(''+name+' renaming: socket '+i+' of '+selfP.people.length);
			selfP.people[i].socket.emit('update', {
				name: name,
				userid: selfP.userid,
				named: true,
				token: token
			});
		}
		var joining = !selfP.named;
		selfP.named = true;
		for (var i in selfP.roomCount) {
			getRoom(i).rename(selfP, oldid, joining);
		}
		return true;
	};
	this.resetName = function() {
		var name = 'Guest '+selfP.guestNum;
		var userid = toUserid(name);
		if (selfP.userid === userid) return;

		var i = 0;
		while (users[userid] && users[userid] !== selfP) {
			selfP.guestNum++;
			name = 'Guest '+selfP.guestNum;
			userid = toUserid(name);
			if (i > 1000) return false;
		}

		if (selfP.named) selfP.prevNames[selfP.userid] = selfP.name;
		delete prevUsers[userid];
		prevUsers[selfP.userid] = userid;

		selfP.name = name;
		var oldid = selfP.userid;
		delete users[oldid];
		selfP.userid = userid;
		users[selfP.userid] = selfP;
		selfP.authenticated = false;

		for (var i=0; i<selfP.people.length; i++) {
			selfP.people[i].rename(name, oldid);
			console.log(''+name+' renaming: socket '+i+' of '+selfP.people.length);
			selfP.people[i].socket.emit('update', {
				name: name,
				userid: selfP.userid,
				named: false,
				token: token
			});
		}
		selfP.named = false;
		for (var i in selfP.roomCount) {
			getRoom(i).rename(selfP, oldid, false);
		}
		return true;
	};
	/**
	 *
	 * @param name    The name you want
	 * @param token   Login token
	 * @param auth    Make sure this account will identify as registered
	 */
	this.rename = function(name, token, auth) {
		for (var i in selfP.roomCount) {
			var room = getRoom(i);
			if (room.rated && (selfP.userid === room.rated.p1 || selfP.userid === room.rated.p2)) {
				selfP.emit('message', "You can't change your name right now because you're in the middle of a rated battle.");
				return false;
			}
		}
		if (!name) name = '';
		name = name.trim();
		if (name.length > 18) name = name.substr(0,18);
		var noStartChars = {'&':1,'@':1,'%':1,'+':1,'!':1};
		while (noStartChars[name.substr(0,1)]) {
			name = name.substr(1);
		}
		name = name.replace(/[\|\[\]\,]/g, '');
		var userid = toUserid(name);
		if (selfP.authenticated) auth = false;

		if (!userid) {
			// technically it's not "taken", but if your client doesn't warn you
			// before it gets to this stage it's your own fault
			selfP.emit('nameTaken', {userid: '', reason: "You did not specify a name."});
			return false;
		} else if (userid === selfP.userid && !auth) {
			return selfP.forceRename(name, selfP.authenticated);
		}
		if (users[userid] && !users[userid].authenticated && users[userid].connected && !auth) {
			selfP.emit('nameTaken', {userid:selfP.userid, token:token, reason: "Someone is already using the name \""+users[userid].name+"\"."});
			return false;
		}
		selfP.renamePending = true;
		// todo: sanitize

		// This is ridiculous spaghetti code because I made a mistake in the authentication protocol earlier
		// this should hopefully fix it while remaining backwards-compatible
		var loginservertoken = 'novawave.ca';
		var tokens = [''];
		if (token) tokens = token.split('::');
		if (tokens[1]) loginservertoken = tokens[1];
		token = tokens[0];

		console.log('POSTING TO SERVER: loginserver/action.php?act=verifysessiontoken&servertoken='+loginservertoken+'&userid='+userid+'&token='+token);
		request({
			uri: config.loginserver+'action.php?act=verifysessiontoken&servertoken='+loginservertoken+'&userid='+userid+'&token='+token,
		}, function(error, response, body) {
			selfP.renamePending = false;
			if (body) {
				console.log('BODY: "'+body+'"');

				if (users[userid] && !users[userid].authenticated && users[userid].connected) {
					if (auth) {
						if (users[userid] !== selfP) users[userid].resetName();
					} else {
						selfP.emit('nameTaken', {userid:selfP.userid, token:token, reason: "Someone is already using the name \""+users[userid].name+"\"."});
						return false;
					}
				}
				var group = config.groupsranking[0];
				var avatar = 0;
				var authenticated = false;
				if (body !== '1') {
					authenticated = true;

					if (userid === "serei") avatar = 172;
					else if (userid === "hobsgoblin") avatar = 52;
					else if (userid === "etherealsol") avatar = 1001;
					else if (userid === "ataraxia") avatar = 1002;
					else if (userid === "verbatim") avatar = 1003;
					else if (userid === "mortygymleader") avatar = 144;
					else if (userid === "leadermorty") avatar = 144;
					else if (userid === "leaderjasmine") avatar = 146;
					else if (userid === "championcynthia") avatar = 260;
					else if (userid === "aeo") avatar = 167;
					else if (userid === "aeo1") avatar = 167;
					else if (userid === "aeo2") avatar = 166;
					else if (userid === "sharktamer") avatar = 7;
					else if (userid === "bmelts") avatar = 1004;

					try {
						var data = JSON.parse(body);
						switch (data.group) {
						case '2':
							group = '&';
							break;
						case '3':
							group = '+';
							break;
						case '4':
							group = '%';
							break;
						case '5':
							group = '@';
							break;
						}
						/* var userdata = JSON.parse(body.userdata);
						avatar = parseInt(userdata.trainersprite);
						if (!avatar || avatar > 263 || avatar < 1) {
							avatar = 0;
						} */
					} catch(e) {
					}
					if (usergroups[userid]) {
						group = usergroups[userid].substr(0,1);
					}
				}
				if (users[userid] && users[userid] !== selfP) {
					// This user already exists; let's merge
					var user = users[userid];
					if (selfP === user) {
						// !!!
						return true;
					}
					for (var i in selfP.roomCount) {
						getRoom(i).leave(selfP);
					}
					for (var i=0; i<selfP.people.length; i++) {
						console.log(''+selfP.name+' preparing to merge: socket '+i+' of '+selfP.people.length);
						user.merge(selfP.people[i]);
					}
					selfP.roomCount = {};
					selfP.people = [];
					selfP.connected = false;
					if (!selfP.authenticated) {
						selfP.group = config.groupsranking[0];
					}

					user.group = group;
					if (avatar) user.avatar = avatar;
					user.authenticated = authenticated;
					user.ip = selfP.ip;

					if (userid !== selfP.userid) {
						// doing it this way mathematically ensures no cycles
						delete prevUsers[userid];
						prevUsers[selfP.userid] = userid;
					}
					for (var i in selfP.prevNames) {
						if (!user.prevNames[i]) {
							user.prevNames[i] = selfP.prevNames[i];
						}
					}
					if (selfP.named) user.prevNames[selfP.userid] = selfP.name;
					return true;
				}

				// rename success
				selfP.token = token;
				selfP.group = group;
				if (avatar) selfP.avatar = avatar;
				return selfP.forceRename(name, authenticated);
			} else if (tokens[1]) {
				console.log('BODY: ""');
				// rename failed, but shouldn't
				selfP.emit('nameTaken', {userid:userid, name:name, token:token, reason: "Your authentication token was invalid."});
			} else {
				console.log('BODY: ""');
				// rename failed
				selfP.emit('nameTaken', {userid:userid, name:name, token:token, reason: "The name you chose is registered"});
			}
			return false;
		});
	};
	this.add = function(name, person, token) {
		// name is ignored - this is intentional
		if (person.banned || selfP.token !== token) {
			return false;
		}
		selfP.connected = true;
		person.user = selfP;
		selfP.people.push(person);
		selfP.ip = person.ip;
		return person;
	};
	this.merge = function(person) {
		selfP.connected = true;
		var oldid = person.userid;
		selfP.people.push(person);
		person.rename(selfP.name, oldid);
		console.log(''+selfP.name+' merging: socket '+person.socket.id+' of ');
		person.socket.emit('update', {
			name: selfP.name,
			userid: selfP.userid,
			named: true,
			token: selfP.token
		});
		person.user = selfP;
		for (var i in person.rooms) {
			if (!selfP.roomCount[i]) {
				person.rooms[i].join(selfP);
				selfP.roomCount[i] = 0;
			}
			selfP.roomCount[i]++;
		}
	};
	this.debugData = function() {
		var str = ''+selfP.group+selfP.name+' ('+selfP.userid+')';
		for (var i=0; i<selfP.people.length; i++) {
			var person = selfP.people[i];
			str += ' socket'+i+'[';
			var first = true;
			for (var j in person.rooms) {
				if (first) first=false;
				else str+=',';
				str += j;
			}
			str += ']';
		}
		if (!selfP.connected) str += ' (DISCONNECTED)';
		return str;
	};
	this.setGroup = function(group) {
		selfP.group = group.substr(0,1);
		if (!selfP.group || selfP.group === config.groupsranking[0]) {
			delete usergroups[selfP.userid];
		} else {
			usergroups[selfP.userid] = selfP.group+selfP.name;
		}
		exportUsergroups();
	};
	this.disconnect = function(socket) {
		var person = null;
		for (var i=0; i<selfP.people.length; i++) {
			if (selfP.people[i].socket === socket) {
				console.log('DISCONNECT: '+selfP.userid);
				if (selfP.people.length <= 1) {
					selfP.connected = false;
					if (!selfP.authenticated) {
						selfP.group = config.groupsranking[0];
					}
				}
				person = selfP.people[i];
				for (var j in person.rooms) {
					selfP.leaveRoom(person.rooms[j], socket);
				}
				person.user = null;
				selfP.people.splice(i,1);
				break;
			}
		}
		if (!selfP.people.length) {
			// cleanup
			for (var i in selfP.roomCount) {
				if (selfP.roomCount[i] > 0) {
					// should never happen.
					console.log('!! room miscount: '+i+' not left');
					getRoom(i).leave(selfP);
				}
			}
			selfP.roomCount = {};
		}
	};
	this.getAlts = function() {
		var alts = [];
		for (var i in users) {
			if (users[i].ip === selfP.ip && users[i] !== selfP) {
				if (!users[i].named && !users[i].connected) {
					continue;
				}
				alts.push(users[i].name);
			}
		}
		return alts;
	};
	this.getHighestRankedAlt = function() {
		var result = selfP;
		var groupRank = config.groupsranking.indexOf(selfP.group);
		for (var i in users) {
			if (users[i].ip === selfP.ip && users[i] !== selfP) {
				if (config.groupsranking.indexOf(users[i].group) > groupRank) {
					result = users[i];
					groupRank = config.groupsranking.indexOf(users[i].group);
				}
			}
		}
		return result;
	};
	this.ban = function(noRecurse) {
		// no need to recurse, since the root for-loop already bans everything with your IP
		if (!noRecurse) for (var i in users) {
			if (users[i].ip === selfP.ip && users[i] !== selfP) {
				users[i].ban(true);
			}
		}
		bannedIps[selfP.ip] = selfP.userid;
		selfP.destroy();
	};
	this.destroy = function() {
		// Disconnects a user from the server
		var person = null;
		selfP.connected = false;
		for (var i=0; i<selfP.people.length; i++) {
			console.log('DESTROY: '+selfP.userid);
			person = selfP.people[i];
			person.user = null;
			for (var j in person.rooms) {
				selfP.leaveRoom(person.rooms[j], person);
			}
		}
		selfP.people = [];
	};
	this.joinRoom = function(room, socket) {
		roomid = room?(room.id||room):'';
		room = getRoom(room);
		var person = null;
		//console.log('JOIN ROOM: '+selfP.userid+' '+room.id);
		if (!socket) {
			for (var i=0; i<selfP.people.length;i++) {
				// only join full clients, not pop-out single-room
				// clients
				if (selfP.people[i].rooms['lobby']) {
					selfP.joinRoom(room, selfP.people[i]);
				}
			}
			return;
		} else if (socket.socket) {
			person = socket;
			socket = person.socket;
		}
		if (!socket) return;
		else {
			var i=0;
			while (selfP.people[i].socket !== socket) i++;
			if (selfP.people[i].socket === socket) {
				person = selfP.people[i];
			}
		}
		if (person && !person.rooms[room.id]) {
			person.rooms[room.id] = room;
			if (!selfP.roomCount[room.id]) {
				selfP.roomCount[room.id]=1;
				room.join(selfP);
			} else {
				selfP.roomCount[room.id]++;
				room.initSocket(selfP, socket);
			}
		} else if (person && room.id === 'lobby') {
			person.socket.emit('init', {room: roomid, notFound: true});
		}
	};
	this.leaveRoom = function(room, socket) {
		room = getRoom(room);
		for (var i=0; i<selfP.people.length; i++) {
			if (selfP.people[i] === socket || selfP.people[i].socket === socket || !socket) {
				if (selfP.people[i].rooms[room.id]) {
					if (selfP.roomCount[room.id]) {
						selfP.roomCount[room.id]--;
						if (!selfP.roomCount[room.id]) {
							room.leave(selfP);
							delete selfP.roomCount[room.id];
						}
					}
					if (!selfP.people[i]) {
						// race condition? This should never happen, but it does.
						fs.createWriteStream('logs/errors.txt', {'flags': 'a'}).on("open", function(fd) {
							this.write("\npeople="+JSON.stringify(selfP.people)+"\ni="+i+"\n\n")
							this.end();
						});
					} else {
						delete selfP.people[i].rooms[room.id];
					}
				}
				if (socket) {
					break;
				}
			}
		}
		if (!socket && selfP.roomCount[room.id]) {
			room.leave(selfP);
			delete selfP.roomCount[room.id];
		}
	};

	// challenges
	this.challengesFrom = {};
	this.challengeTo = null;
	this.lastChallenge = 0;

	this.updateChallenges = function() {
		selfP.emit('update', {
			challengesFrom: selfP.challengesFrom,
			challengeTo: selfP.challengeTo,
		});
	};
	this.makeChallenge = function(user, format, isPrivate) {
		user = getUser(user);
		if (!user || selfP.challengeTo) {
			return false;
		}
		if (getTime() < selfP.lastChallenge + 10000) {
			// 10 seconds ago
			return false;
		}
		var time = getTime();
		var challenge = {
			time: time,
			from: selfP.userid,
			to: user.userid,
			format: ''+(format||''),
			isPrivate: !!isPrivate
		};
		selfP.lastChallenge = time;
		selfP.challengeTo = challenge;
		user.challengesFrom[selfP.userid] = challenge;
		selfP.updateChallenges();
		user.updateChallenges();
	};
	this.cancelChallengeTo = function() {
		if (!selfP.challengeTo) return true;
		var user = getUser(selfP.challengeTo.to);
		if (user) delete user.challengesFrom[selfP.userid];
		selfP.challengeTo = null;
		selfP.updateChallenges();
		if (user) user.updateChallenges();
	};
	this.rejectChallengeFrom = function(user) {
		var userid = toUserid(user);
		user = getUser(user);
		if (selfP.challengesFrom[userid]) {
			delete selfP.challengesFrom[userid];
		}
		if (user) {
			delete selfP.challengesFrom[user.userid];
			if (user.challengeTo && user.challengeTo.to === selfP.userid) {
				user.challengeTo = null;
				user.updateChallenges();
			}
		}
		selfP.updateChallenges();
	};
	this.acceptChallengeFrom = function(user) {
		var userid = toUserid(user);
		user = getUser(user);
		if (!user || !user.challengeTo || user.challengeTo.to !== selfP.userid) {
			if (selfP.challengesFrom[userid]) {
				delete selfP.challengesFrom[userid];
				selfP.updateChallenges();
			}
			return false;
		}
		getRoom('lobby').startBattle(selfP, user, user.challengeTo.format);
		delete selfP.challengesFrom[user.userid];
		user.challengeTo = null;
		selfP.updateChallenges();
		user.updateChallenges();
		return true;
	};

	// initialize
	users[selfP.userid] = selfP;
	if (person.banned) {
		selfP.destroy();
	} else if (name) {
		selfP.rename(name,token);
	}
}

function Person(name, socket, user) {
	var selfP = this;

	this.named = true;
	this.name = name;
	this.userid = toUserid(name);

	this.socket = socket;
	this.rooms = {};

	this.user = user; {
		numPeople++;
		while (people['p'+numPeople]) {
			// should never happen
			numPeople++;
		}
		this.id = 'p'+numPeople;
		people[this.id] = selfP;
	}

	this.rename = function(name) {
		selfP.name = name;
		selfP.userid = toUserid(selfP.name);
	};

	this.ip = '';
	if (socket.handshake && socket.handshake.address && socket.handshake.address.address) {
		this.ip = socket.handshake.address.address;
	}

	if (ipSearch(this.ip,bannedIps)) {
		// gonna kill this
		this.banned = true;
		this.user = null;
	}
}

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

exports.getUser = getUser;
exports.searchUser = searchUser;
exports.connectUser = connectUser;
exports.users = users;
exports.prevUsers = prevUsers;
