const MAX_MESSAGE_LENGTH = 300;
const TIMEOUT_DEALLOCATE = 15*60*1000;
// Increment this by 1 for each change that breaks compatibility between
// the previous version of the client and the current version of the server.
const BATTLE_ROOM_PROTOCOL_VERSION = 2;

function BattleRoom(roomid, format, p1, p2, parentid, rated) {
	var selfR = this;

	format = ''+(format||'');

	this.type = 'room';
	this.id = roomid;
	this.i = {};
	this.users = {};
	this.format = format;
	//console.log("NEW BATTLE");

	var formatid = toId(format);

	if (rated && Tools.getFormat(formatid).rated) {
		rated = {
			p1: p1.userid,
			p2: p2.userid,
			format: format
		};
	} else {
		rated = false;
	}

	this.rated = rated;
	this.battle = Simulator.create(selfR.id, format, rated, this);
	this.resetTimer = null;
	this.resetUser = '';
	this.destroyTimer = null;

	this.parentid = parentid||'';
	this.p1 = p1 || '';
	this.p2 = p2 || '';

	this.sideTicksLeft = [21, 21];
	if (!rated) this.sideTicksLeft = [28,28];
	this.sideFreeTicks = [0, 0];
	this.maxTicksLeft = 0;

	this.active = false;

	this.log = [];
	this.lastUpdate = 0;
	this.push = function(message) {
		if (typeof message === 'string') {
			this.log.push(message);
		} else {
			this.log = this.log.concat(message);
		}
	};
	this.win = function(winner) {
		if (selfR.rated) {
			var winnerid = toId(winner);
			var rated = selfR.rated;
			selfR.rated = false;
			var p1score = 0.5;

			if (winnerid === rated.p1) {
				p1score = 1;
			} else if (winnerid === rated.p2) {
				p1score = 0;
			}

			var p1 = rated.p1;
			if (Users.getExact(rated.p1)) p1 = Users.getExact(rated.p1).name;
			var p2 = rated.p2;
			if (Users.getExact(rated.p2)) p2 = Users.getExact(rated.p2).name;

			//update.updates.push('[DEBUG] uri: '+config.loginserver+'action.php?act=ladderupdate&serverid='+config.serverid+'&p1='+encodeURIComponent(p1)+'&p2='+encodeURIComponent(p2)+'&score='+p1score+'&format='+toId(rated.format)+'&servertoken=[token]');

			if (!rated.p1 || !rated.p2) {
				selfR.push('|raw|ERROR: Ladder not updated: a player does not exist');
			} else {
				var winner = Users.get(winnerid);
				if (winner && !winner.authenticated) {
					selfR.send('|askreg|' + winner.userid, winner);
				}
				var p1rating, p2rating;
				// update rankings
				selfR.push('|raw|Ladder updating...');
				LoginServer.request('ladderupdate', {
					p1: p1,
					p2: p2,
					score: p1score,
					format: toId(rated.format)
				}, function(data, statusCode, error) {
					if (!selfR) {
						console.log('room expired before ladder update was received');
						return;
					}
					if (!data) {
						selfR.addRaw('Ladder (probably) updated, but score could not be retrieved ('+error+').');
						selfR.update();
						// log the battle anyway
						if (!Tools.getFormat(selfR.format).noLog) {
							selfR.logBattle(p1score);
						}
						return;
					} else {
						try {
							p1rating = data.p1rating;
							p2rating = data.p2rating;

							//selfR.add("Ladder updated.");

							var oldacre = Math.round(data.p1rating.oldacre);
							var acre = Math.round(data.p1rating.acre);
							var reasons = ''+(acre-oldacre)+' for '+(p1score>.99?'winning':(p1score<.01?'losing':'tying'));
							if (reasons.substr(0,1) !== '-') reasons = '+'+reasons;
							selfR.addRaw(sanitize(p1)+'\'s rating: '+oldacre+' &rarr; <strong>'+acre+'</strong><br />('+reasons+')');

							var oldacre = Math.round(data.p2rating.oldacre);
							var acre = Math.round(data.p2rating.acre);
							var reasons = ''+(acre-oldacre)+' for '+(p1score>.99?'losing':(p1score<.01?'winning':'tying'));
							if (reasons.substr(0,1) !== '-') reasons = '+'+reasons;
							selfR.addRaw(sanitize(p2)+'\'s rating: '+oldacre+' &rarr; <strong>'+acre+'</strong><br />('+reasons+')');

							Users.get(p1).cacheMMR(rated.format, data.p1rating);
							Users.get(p2).cacheMMR(rated.format, data.p2rating);
							selfR.update();
						} catch(e) {
							selfR.addRaw('There was an error calculating rating changes.');
							selfR.update();
						}

						if (!Tools.getFormat(selfR.format).noLog) {
							selfR.logBattle(p1score, p1rating, p2rating);
						}
					}
				});
			}
		}
		selfR.active = false;
		selfR.update();
	};
	this.update = function(excludeUser) {
		if (selfR.log.length < selfR.lastUpdate) return;
		var updates = selfR.log.slice(selfR.lastUpdate);
		var update = {
			since: selfR.lastUpdate,
			updates: updates,
			active: selfR.active
		}
		selfR.lastUpdate = selfR.log.length;

		update.room = selfR.id;
		var hasUsers = false;
		for (var i in selfR.users) {
			var user = selfR.users[i];
			hasUsers = true;
			if (user === excludeUser) continue;
			user.emit('update', update);
		}

		// empty rooms time out after ten minutes
		if (!hasUsers) {
			if (!selfR.destroyTimer) {
				selfR.destroyTimer = setTimeout(selfR.tryDestroy, TIMEOUT_DEALLOCATE);
			}
		} else if (selfR.destroyTimer) {
			clearTimeout(selfR.destroyTimer);
			selfR.destroyTimer = null;
		}
	};
	this.logBattle = function(p1score, p1rating, p2rating) {
		var logData = selfR.battle.logData;
		logData.p1rating = p1rating;
		logData.p2rating = p2rating;
		logData.endType = selfR.battle.endType;
		if (!p1rating) logData.ladderError = true;
		var date = new Date();
		var logfolder = date.format('{yyyy}-{MM}');
		var logsubfolder = date.format('{yyyy}-{MM}-{dd}');
		var curpath = 'logs/'+logfolder;
		fs.mkdir(curpath, '0755', function() {
			var tier = selfR.format.toLowerCase().replace(/[^a-z0-9]+/g,'');
			curpath += '/'+tier;
			fs.mkdir(curpath, '0755', function() {
				curpath += '/'+logsubfolder;
				fs.mkdir(curpath, '0755', function() {
					fs.writeFile(curpath+'/'+selfR.id+'.log.json', JSON.stringify(logData));
				});
			});
		}); // asychronicity
		//console.log(JSON.stringify(logData));
		rooms.lobby.writeNumRooms();
	};
	this.emit = function(type, message, user) {
		if (type === 'console' || type === 'update') {
			if (typeof message === 'string') {
				message = {message: message};
			}
			message.room = selfR.id;
		}
		if (user && user.emit) {
			user.emit(type, message);
		} else {
			for (var i in selfR.users) {
				selfR.users[i].emit(type, message);
			}
		}
	};
	this.send = function(message, user) {
		if (user) {
			user.sendTo(selfR, message);
		} else {
			for (var i in selfR.users) {
				selfR.users[i].sendTo(selfR, message);
			}
		}
	};
	this.tryDestroy = function() {
		for (var i in selfR.users) {
			// don't destroy ourselves if there are users in this room
			// theoretically, Room.update should've stopped tryDestroy's timer
			// well before we get here
			return;
		}
		selfR.destroy();
	};
	this.broadcastError = function(message) {
		for (var i in selfR.users) {
			selfR.users.emit('connectionError', message);
		}
	};
	this.reset = function(reload) {
		clearTimeout(selfR.resetTimer);
		selfR.resetTimer = null;
		selfR.resetUser = '';

		if (lockdown) {
			selfR.add('The battle was not restarted because the server is preparing to shut down.');
			return;
		}

		selfR.add('RESET');
		selfR.update();

		selfR.active = false;
		if (selfR.parentid) {
			getRoom(selfR.parentid).updateRooms();
		}
	};
	this.getInactiveSide = function() {
		if (selfR.battle.players[0] && !selfR.battle.players[1]) return 1;
		if (selfR.battle.players[1] && !selfR.battle.players[0]) return 0;
		return selfR.battle.inactiveSide;
	};
	this.forfeit = function(user, message, side) {
		if (!selfR.battle || selfR.battle.ended || !selfR.battle.started) return false;

		if (!message) message = ' forfeited.';

		if (side === undefined) {
			if (user && user.userid === selfR.battle.playerids[0]) side = 0;
			if (user && user.userid === selfR.battle.playerids[1]) side = 1;
		}
		if (side === undefined) return false;

		var ids = ['p1', 'p2'];
		var otherids = ['p2', 'p1'];

		var name = 'Player '+(side+1);
		if (user) {
			name = user.name;
		} else if (selfR.rated) {
			name = selfR.rated[ids[side]];
		}

		selfR.addCmd('-message', name+message);
		selfR.battle.endType = 'forfeit';
		selfR.battle.send('win', otherids[side]);
		selfR.active = selfR.battle.active;
		selfR.update();
		return true;
	};
	this.kickInactive = function() {
		clearTimeout(selfR.resetTimer);
		selfR.resetTimer = null;

		if (!selfR.battle || selfR.battle.ended || !selfR.battle.started) return false;

		var inactiveSide = selfR.getInactiveSide();

		// now to see how much time we have left
		if (selfR.maxTicksLeft) {
			selfR.maxTicksLeft--;
		}

		if (inactiveSide != 1) {
			// side 0 is inactive
			if (selfR.sideFreeTicks[0]) {
				selfR.sideFreeTicks[0]--;
			} else {
				selfR.sideTicksLeft[0]--;
			}
		}
		if (inactiveSide != 0) {
			// side 1 is inactive
			if (selfR.sideFreeTicks[1]) {
				selfR.sideFreeTicks[1]--;
			} else {
				selfR.sideTicksLeft[1]--;
			}
		}

		if (selfR.maxTicksLeft && selfR.sideTicksLeft[0] && selfR.sideTicksLeft[1]) {
			if (inactiveSide == 0 || inactiveSide == 1) {
				// one side is inactive
				var ticksLeft = Math.min(selfR.sideTicksLeft[inactiveSide], selfR.maxTicksLeft);
				var inactiveUser = selfR.battle.getPlayer(inactiveSide);
				if (ticksLeft % 3 == 0 || ticksLeft <= 4) {
					selfR.send('|inactive|'+(inactiveUser?inactiveUser.name:'Player '+(inactiveSide+1))+' has '+(ticksLeft*10)+' seconds left.');
				}
			} else {
				// both sides are inactive
				var ticksLeft0 = Math.min(selfR.sideTicksLeft[0], selfR.maxTicksLeft);
				var inactiveUser0 = selfR.battle.getPlayer(0);
				if (ticksLeft0 % 3 == 0 || ticksLeft0 <= 4) {
					selfR.send('|inactive|'+(inactiveUser0?inactiveUser0.name:'Player 1')+' has '+(ticksLeft0*10)+' seconds left.', inactiveUser0);
				}

				var ticksLeft1 = Math.min(selfR.sideTicksLeft[1], selfR.maxTicksLeft);
				var inactiveUser1 = selfR.battle.getPlayer(1);
				if (ticksLeft1 % 3 == 0 || ticksLeft0 <= 4) {
					selfR.send('|inactive|'+(inactiveUser1?inactiveUser1.name:'Player 2')+' has '+(ticksLeft1*10)+' seconds left.', inactiveUser1);
				}
			}
			selfR.resetTimer = setTimeout(selfR.kickInactive, 10*1000);
			return;
		}

		if (inactiveSide < 0) {
			if (selfR.sideTicksLeft[0]) inactiveSide = 1;
			else if (selfR.sideTicksLeft[1]) inactiveSide = 0;
		}

		selfR.forfeit(selfR.battle.getPlayer(inactiveSide),' lost because of their inactivity.', inactiveSide);
		selfR.resetUser = '';

		if (selfR.parentid) {
			getRoom(selfR.parentid).updateRooms();
		}
	};
	this.requestKickInactive = function(user, force) {
		if (selfR.resetTimer) {
			selfR.send('|inactive|The inactivity timer is already counting down.', user);
			return false;
		}
		if (user) {
			if (!force && selfR.battle.getSlot(user) < 0) return false;
			selfR.resetUser = user.userid;
			selfR.send('|inactive|Battle timer is now ON: inactive players will automatically lose when time\'s up. (requested by '+user.name+')');
		}

		// a tick is 10 seconds

		var maxTicksLeft = 15; // 2 minutes 30 seconds
		if (!selfR.battle.p1 || !selfR.battle.p2) {
			// if a player has left, don't wait longer than 6 ticks (1 minute)
			maxTicksLeft = 6;
		}
		if (!selfR.rated) maxTicksLeft = 30;
		selfR.sideFreeTicks = [1,1];

		selfR.maxTicksLeft = maxTicksLeft;

		var inactiveSide = selfR.getInactiveSide();
		if (inactiveSide < 0) {
			// add 10 seconds to bank if they're below 160 seconds
			if (selfR.sideTicksLeft[0] < 16) selfR.sideTicksLeft[0]++;
			if (selfR.sideTicksLeft[1] < 16) selfR.sideTicksLeft[1]++;
		}
		if (inactiveSide != 1) {
			// side 0 is inactive
			var ticksLeft0 = Math.min(selfR.sideTicksLeft[0] + 1, selfR.maxTicksLeft);
			selfR.send('|inactive|You have '+(ticksLeft0*10)+' seconds to make your decision.', selfR.battle.getPlayer(0));
		}
		if (inactiveSide != 0) {
			// side 1 is inactive
			var ticksLeft1 = Math.min(selfR.sideTicksLeft[1] + 1, selfR.maxTicksLeft);
			selfR.send('|inactive|You have '+(ticksLeft1*10)+' seconds to make your decision.', selfR.battle.getPlayer(1));
		}

		selfR.resetTimer = setTimeout(selfR.kickInactive, 10*1000);
		return true;
	};
	this.nextInactive = function() {
		if (selfR.resetTimer) {
			selfR.update();
			clearTimeout(selfR.resetTimer);
			selfR.resetTimer = null;
			selfR.requestKickInactive();
		}
	};
	this.stopKickInactive = function(user, force) {
		if (!force && user && user.userid !== selfR.resetUser) return false;
		if (selfR.resetTimer) {
			clearTimeout(selfR.resetTimer);
			selfR.resetTimer = null;
			selfR.send('|inactiveoff|Battle timer is now OFF.');
			return true;
		}
		return false;
	};
	this.decision = function(user, choice, data) {
		selfR.battle.sendFor(user, choice, data);
		if (selfR.active !== selfR.battle.active) {
			selfR.active = selfR.battle.active;
			if (selfR.parentid) {
				getRoom(selfR.parentid).updateRooms();
			}
		}
		selfR.update();
	};
	// This function is only called when the room is not empty.
	// Joining an empty room calls this.join() below instead.
	this.initSocket = function(user, socket) {
		var initdata = {
			name: user.name,
			userid: user.userid,
			named: user.named,
			renamePending: user.renamePending,
			token: user.token,
			room: selfR.id,
			roomType: 'battle',
			version: BATTLE_ROOM_PROTOCOL_VERSION,
			battlelog: selfR.log
		};
		emit(socket, 'init', initdata);
		if (selfR.battle.requests[user.userid]) {
			selfR.battle.resendRequest(user);
		}
	};
	this.join = function(user) {
		if (!user) return false;
		if (selfR.users[user.userid]) return user;

		selfR.users[user.userid] = user;

		if (user.named) {
			selfR.addCmd('join', user.name);
			selfR.update(user);
		}

		var initdata = {
			name: user.name,
			userid: user.userid,
			named: user.named,
			renamePending: user.renamePending,
			token: user.token,
			room: selfR.id,
			roomType: 'battle',
			version: BATTLE_ROOM_PROTOCOL_VERSION,
			battlelog: selfR.log
		};
		user.emit('init', initdata);

		return user;
	};
	this.rename = function(user, oldid, joining) {
		if (joining) {
			selfR.addCmd('join', user.name);
		}
		if (selfR.battle.playerTable[user.userid]) {
			selfR.battle.rename();
		}
		delete selfR.users[oldid];
		selfR.users[user.userid] = user;
		selfR.update();
		return user;
	};
	this.joinBattle = function(user, team) {
		var slot = undefined;
		if (selfR.rated) {
			if (selfR.rated.p1 === user.userid) {
				slot = 0;
			} else if (selfR.rated.p2 === user.userid) {
				slot = 1;
			} else {
				return;
			}
		}

		selfR.battle.join(user, slot, team);
		selfR.active = selfR.battle.active;
		selfR.update();

		if (selfR.parentid) {
			getRoom(selfR.parentid).updateRooms();
		}
	};
	this.leaveBattle = function(user) {
		if (!user) return; // ...
		if (user.battles[selfR.id]) {
			selfR.battle.leave(user);
		}
		selfR.active = selfR.battle.active;
		selfR.update();

		if (selfR.parentid) {
			getRoom(selfR.parentid).updateRooms();
		}
	};
	this.leave = function(user) {
		if (!user) return; // ...
		if (user.battles[selfR.id]) {
			selfR.battle.leave(user);
			selfR.active = selfR.battle.active;
			if (selfR.parentid) {
				getRoom(selfR.parentid).updateRooms();
			}
		} else if (!user.named) {
			delete selfR.users[user.userid];
			return;
		}
		delete selfR.users[user.userid];
		selfR.addCmd('leave', user.name);

		if (Object.isEmpty(selfR.users)) {
			selfR.active = false;
		}

		selfR.update();
	};
	this.isEmpty = function() {
		if (selfR.battle.p1) return false;
		if (selfR.battle.p2) return false;
		return true;
	};
	this.isFull = function() {
		if (selfR.battle.p1 && selfR.battle.p2) return true;
		return false;
	};
	this.addCmd = function() {
		selfR.log.push('|'+Array.prototype.slice.call(arguments).join('|'));
	};
	this.add = function(message) {
		if (message.rawMessage) {
			selfR.addCmd('raw', message.rawMessage);
		} else if (message.name) {
			selfR.addCmd('chat', message.name.substr(1), message.message);
		} else {
			selfR.log.push(message);
		}
	};
	this.addRaw = function(message) {
		selfR.addCmd('raw', message);
	};
	this.chat = function(user, message, socket) {
		var cmd = '', target = '';
		if (message.length > MAX_MESSAGE_LENGTH && !user.can('ignorelimits')) {
			emit(socket, 'message', "Your message is too long:\n\n"+message);
			return;
		}
		if (message.substr(0,2) !== '//' && message.substr(0,1) === '/') {
			var spaceIndex = message.indexOf(' ');
			if (spaceIndex > 0) {
				cmd = message.substr(1, spaceIndex-1);
				target = message.substr(spaceIndex+1);
			} else {
				cmd = message.substr(1);
				target = '';
			}
		} else if (message.substr(0,1) === '!') {
			var spaceIndex = message.indexOf(' ');
			if (spaceIndex > 0) {
				cmd = message.substr(0, spaceIndex);
				target = message.substr(spaceIndex+1);
			} else {
				cmd = message;
				target = '';
			}
		}

		// Battle actions are actually just text commands that are handled in
		// parseCommand(), which in turn often calls Simulator.prototype.sendFor().
		// Sometimes the call to sendFor is done indirectly, by calling
		// room.decision(), where room.constructor === BattleRoom.
		var parsedMessage = parseCommand(user, cmd, target, selfR, socket, message);
		if (typeof parsedMessage === 'string') {
			message = parsedMessage;
		}
		if (parsedMessage === false) {
			// do nothing
		} else if (message.substr(0,3) === '>> ') {
			var cmd = message.substr(3);

			var room = selfR;
			var battle = selfR.battle;
			var me = user;
			selfR.addCmd('chat', user.name, '>> '+cmd);
			if (user.can('console')) {
				try {
					selfR.addCmd('chat', user.name, '<< '+eval(cmd));
				} catch (e) {
					selfR.addCmd('chat', user.name, '<< error: '+e.message);
					var stack = (""+e.stack).split("\n");
					for (var i=0; i<stack.length; i++) {
						user.emit('console', '<< '+stack[i]);
					}
				}
			} else {
				selfR.addCmd('chat', user.name, '<< Access denied.');
			}
		} else if (message.substr(0,4) === '>>> ') {
			var cmd = message.substr(4);

			selfR.addCmd('chat', user.name, '>>> '+cmd);
			if (user.can('console')) {
				selfR.battle.send('eval', cmd);
			} else {
				selfR.addCmd('chat', user.name, '<<< Access denied.');
			}
		} else {
			selfR.battle.chat(user, message);
		}
		selfR.update();
	};

	this.destroy = function() {
		// deallocate ourself

		// remove references to ourself
		for (var i in selfR.users) {
			selfR.users[i].leaveRoom(selfR);
			delete selfR.users[i];
		}
		selfR.users = null;

		rooms.lobby.removeRoom(selfR.id);

		// deallocate children and get rid of references to them
		if (selfR.battle) {
			selfR.battle.destroy();
		}
		selfR.battle = null;

		if (selfR.resetTimer) {
			clearTimeout(selfR.resetTimer);
		}
		selfR.resetTimer = null;

		// get rid of some possibly-circular references
		delete rooms[selfR.id];

		selfR = null;
	};
}

function LobbyRoom(roomid) {
	var selfR = this; // a lobby is like a room, selfR makes things simpler
	this.type = 'lobby';
	this.id = roomid;
	this.i = {};
	this.log = [];
	this.lastUpdate = 0;
	this.users = {};
	this.rooms = [];
	this.numRooms = 0;
	this.searchers = [];
	this.logFile = null;
	this.logFilename = '';
	this.destroyingLog = false;

	// Never do any other file IO synchronously
	// but this is okay to prevent race conditions as we start up PS
	this.numRooms = 0;
	try {
		this.numRooms = parseInt(fs.readFileSync('logs/lastbattle.txt')) || 0;
	} catch (e) {} // file doesn't exist [yet]

	// this function is complex in order to avoid several race conditions
	this.writeNumRooms = (function() {
		var writing = false;
		var numRooms;	// last numRooms to be written to file
		var finishWriting = function() {
			writing = false;
			if (numRooms !== selfR.numRooms) {
				selfR.writeNumRooms();
			}
		};
		return function() {
			if (writing) return;
			numRooms = selfR.numRooms;
			writing = true;
			fs.writeFile('logs/lastbattle.txt.0', '' + numRooms, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('logs/lastbattle.txt.0', 'logs/lastbattle.txt', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('logs/lastbattle.txt', '' + numRooms, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})();

	// generate and cache the format list
	this.formatListText = (function() {
		var formatListText = '|formats';
		var curSection = '';
		for (var i in Tools.data.Formats) {
			var format = Tools.data.Formats[i];
			if (!format.challengeShow && !format.searchShow) continue;

			var section = format.section;
			if (section === undefined) section = format.mod;
			if (!section) section = '';
			if (section !== curSection) {
				curSection = section;
				formatListText += '||'+section;
			}
			formatListText += '|'+format.name;
			if (!format.challengeShow) formatListText += ',,';
			else if (!format.searchShow) formatListText += ',';
			if (format.team) formatListText += ',#';
		}
		return formatListText;
	})();

	this.rollLogFile = function(sync) {
		var mkdir = sync ? (function(path, mode, callback) {
			try {
				fs.mkdirSync(path, mode);
			} catch (e) {}	// directory already exists
			callback();
		}) : fs.mkdir;
		var date = new Date();
		var basepath = 'logs/lobby/';
		mkdir(basepath, '0755', function() {
			var path = date.format('{yyyy}-{MM}');
			mkdir(basepath + path, '0755', function() {
				if (selfR.destroyingLog) return;
				path += '/' + date.format('{yyyy}-{MM}-{dd}') + '.txt';
				if (path !== selfR.logFilename) {
					selfR.logFilename = path;
					if (selfR.logFile) selfR.logFile.destroySoon();
					selfR.logFile = fs.createWriteStream(basepath + path, {flags: 'a'});
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
				setTimeout(selfR.rollLogFile, +date - timestamp);
			});
		});
	};
	this.destroyLog = function(initialCallback, finalCallback) {
		selfR.destroyingLog = true;
		initialCallback();
		if (selfR.logFile) {
			selfR.logEntry = function() { };
			selfR.logFile.on('close', finalCallback);
			selfR.logFile.destroySoon();
		} else {
			finalCallback();
		}
	};
	this.logUserStats = function() {
		var total = 0;
		var guests = 0;
		var groups = {};
		config.groupsranking.forEach(function(group) {
			groups[group] = 0;
		});
		for (var i in selfR.users) {
			var user = selfR.users[i];
			++total;
			if (!user.named) {
				++guests;
			}
			++groups[user.group];
		}
		var entry = '|userstats|total:' + total + '|guests:' + guests;
		for (var i in groups) {
			entry += '|' + i + ':' + groups[i];
		}
		selfR.logEntry(entry);
	};
	if (config.loglobby) {
		this.rollLogFile(true);
		this.logEntry = function(entry, date) {
			var timestamp = (new Date()).format('{HH}:{mm}:{ss} ');
			selfR.logFile.write(timestamp + entry + '\n');
		};
		this.logEntry('Lobby created');
		if (config.loguserstats) {
			setInterval(this.logUserStats, config.loguserstats);
		}
	} else {
		this.logEntry = function() { };
	}

	(function() {
		const REPORT_USER_STATS_INTERVAL = 1000 * 60 * 10;
		setInterval(function() {
			LoginServer.request('updateuserstats', {
				date: +date,
				users: total
			}, function() {});
		}, REPORT_USER_STATS_INTERVAL);
	})();

	this.getUpdate = function(since, omitUsers, omitRoomList) {
		var update = {room: roomid};
		var i = since;
		if (!i) i = selfR.log.length - 100;
		if (i<0) i = 0;
		update.logStart = i;
		update.logUpdate = [];
		for (;i<selfR.log.length;i++) {
			update.logUpdate.push(selfR.log[i]);
		}
		if (!omitRoomList) update.rooms = selfR.getRoomList();
		if (!omitUsers) update.u = selfR.getUserList();
		return update;
	};
	this.getUserList = function() {
		var buffer = '';
		var counter = 0;
		for (var i in selfR.users) {
			counter++;
			if (!selfR.users[i].named) {
				continue;
			}
			buffer += ','+selfR.users[i].getIdentity();
		}
		return ''+counter+buffer;
	};
	this.getRoomList = function(filter) {
		var roomList = {};
		var total = 0;
		for (i=selfR.rooms.length-1; i>=0; i--) {
			var room = selfR.rooms[i];
			if (!room || !room.active) continue;
			if (filter && filter !== room.format && filter !== true) continue;
			var roomData = {};
			if (room.active && room.battle) {
				if (room.battle.players[0]) roomData.p1 = room.battle.players[0].getIdentity();
				if (room.battle.players[1]) roomData.p2 = room.battle.players[1].getIdentity();
			}
			if (!roomData.p1 || !roomData.p2) continue;
			roomList[selfR.rooms[i].id] = roomData;

			total++;
			if (total >= 6 && !filter) break;
		}
		return roomList;
	};
	this.cancelSearch = function(user) {
		var success = false;
		user.cancelChallengeTo();
		for (var i=0; i<selfR.searchers.length; i++) {
			var search = selfR.searchers[i];
			var searchUser = Users.get(search.userid);
			if (!searchUser.connected) {
				selfR.searchers.splice(i,1);
				i--;
				continue;
			}
			if (searchUser === user) {
				selfR.searchers.splice(i,1);
				i--;
				if (!success) {
					searchUser.emit('update', {searching: false, room: selfR.id});
					success = true;
				}
				continue;
			}
		}
		return success;
	};
	this.searchBattle = function(user, formatid) {
		if (!user.connected) return;
		if (lockdown) {
			user.emit('message', 'The server is shutting down. Battles cannot be started at this time.');
			return;
		}

		formatid = toId(formatid);

		var format = Tools.getFormat(formatid);
		if (!format.searchShow) {
			user.emit('message', 'That format is not available for searching.');
			return;
		}

		var team = user.team;
		var problems = Tools.validateTeam(team, formatid);
		if (problems) {
			user.emit('message', "Your team was rejected for the following reasons:\n\n- "+problems.join("\n- "));
			return;
		}

		// tell the user they've started searching
		var newSearchData = {
			userid: user.userid,
			format: formatid,
			room: selfR.id
		};
		user.emit('update', {searching: newSearchData, room: selfR.id});

		// get the user's rating before actually starting to search
		var newSearch = {
			userid: user.userid,
			formatid: formatid,
			team: team,
			rating: 1500,
			time: new Date().getTime()
		};
		user.doWithMMR(formatid, function(mmr) {
			newSearch.rating = mmr;
			selfR.addSearch(newSearch, user);
		});
	};
	this.matchmakingOK = function(search1, search2, user1, user2) {
		// users must be different
		if (user1 === user2) return false;

		// users must not have been matched immediately previously
		if (user1.lastMatch === user2.userid || user2.lastMatch === user1.userid) return false;

		// search must be within range
		var searchRange = 400, formatid = search1.formatid, elapsed = Math.abs(search1.time-search2.time);
		if (formatid === 'ou' || formatid === 'randombattle') searchRange = 200;
		searchRange += elapsed/300; // +1 every .3 seconds
		if (searchRange > 1200) searchRange = 1200;
		if (Math.abs(search1.rating - search2.rating) > searchRange) return false;

		user1.lastMatch = user2.userid;
		user2.lastMatch = user1.userid;
		return true;
	};
	this.addSearch = function(newSearch, user) {
		if (!user.connected) return;
		for (var i=0; i<selfR.searchers.length; i++) {
			var search = selfR.searchers[i];
			var searchUser = Users.get(search.userid);
			if (!searchUser || !searchUser.connected) {
				selfR.searchers.splice(i,1);
				i--;
				continue;
			}
			if (newSearch.formatid === search.formatid && searchUser === user) return; // only one search per format
			if (newSearch.formatid === search.formatid && this.matchmakingOK(search, newSearch, searchUser, user)) {
				selfR.cancelSearch(user, true);
				selfR.cancelSearch(searchUser, true);
				user.emit('update', {searching: false, room: selfR.id});
				searchUser.team = search.team;
				user.team = newSearch.team;
				selfR.startBattle(searchUser, user, search.formatid, true, search.team, newSearch.team);
				return;
			}
		}
		selfR.searchers.push(newSearch);
	};
	this.update = function() {
		if (selfR.log.length <= selfR.lastUpdate) return;
		var entries = selfR.log.slice(selfR.lastUpdate);
		var update = entries.join('\n');
		if (selfR.log.length > 100) selfR.log = selfR.log.slice(-100);
		selfR.lastUpdate = selfR.log.length;

		selfR.send(update);
	};
	this.emit = function(type, message, user) {
		if (type === 'console' || type === 'update') {
			if (typeof message === 'string') {
				message = {message: message};
			}
			message.room = selfR.id;
		}
		if (user && user.emit) {
			user.emit(type, message);
		} else {
			for (var i in selfR.users) {
				selfR.users[i].emit(type, message);
			}
		}
	};
	this.send = function(message, user) {
		if (user) {
			user.sendTo(selfR, message);
		} else {
			var isPureLobbyChat = (message.indexOf('\n') < 0 && message.match(/^\|c\|[^\|]*\|/) && message.substr(0,5) !== '|c|~|');
			for (var i in selfR.users) {
				user = selfR.users[i];
				if (isPureLobbyChat && user.blockLobbyChat) continue;
				user.sendTo(selfR, message);
			}
		}
	};
	this.sendIdentity = function(user) {
		if (user && user.connected) {
			selfR.send('|N|' + user.getIdentity() + '|' + user.userid);
		}
	};
	this.sendAuth = function(message) {
		for (var i in selfR.users) {
			var user = selfR.users[i];
			if (user.connected && user.can('receiveauthmessages')) {
				user.sendTo(selfR, message);
			}
		}
	};
	this.updateRooms = function(excludeUser) {
		// do nothing
	};
	this.add = function(message, noUpdate) {
		selfR.log.push(message);
		this.logEntry(message);
		if (!noUpdate) {
			selfR.update();
		}
	};
	this.addRaw = function(message) {
		selfR.add('|raw|'+message);
	};
	this.initSocket = function(user, socket) {
		var initdata = {
			name: user.name,
			userid: user.userid,
			named: user.named,
			renamePending: user.renamePending,
			token: user.token,
			room: selfR.id,
			rooms: selfR.getRoomList(),
			u: selfR.getUserList(),
			roomType: 'lobby',
			log: selfR.log.slice(-25)
		};
		emit(socket, 'init', initdata);
	};
	this.join = function(user) {
		if (!user) return false; // ???
		if (selfR.users[user.userid]) return user;

		selfR.users[user.userid] = user;
		if (user.named && config.reportjoins) {
			selfR.add('|j|'+user.getIdentity(), true);
			selfR.update(user);
		} else if (user.named) {
			var entry = '|J|'+user.getIdentity();
			selfR.send(entry);
			selfR.logEntry(entry);
		}

		var initdata = {
			name: user.name,
			userid: user.userid,
			named: user.named,
			renamePending: user.renamePending,
			token: user.token,
			room: selfR.id,
			rooms: selfR.getRoomList(),
			u: selfR.getUserList(),
			roomType: 'lobby',
			log: selfR.log.slice(-100).include(this.formatListText)
		};
		user.emit('init', initdata);

		return user;
	};
	this.rename = function(user, oldid, joining) {
		delete selfR.users[oldid];
		selfR.users[user.userid] = user;
		if (joining && config.reportjoins) {
			selfR.add('|j|'+user.getIdentity());
		} else {
			var entry;
			if (joining) {
				entry = '|J|' + user.getIdentity();
			} else if (!user.named) {
				entry = '|L| ' + oldid;
			} else {
				entry = '|N|' + user.getIdentity() + '|' + oldid;
			}
			selfR.send(entry);
			selfR.logEntry(entry);
		}
		return user;
	};
	this.leave = function(user) {
		if (!user) return; // ...
		delete selfR.users[user.userid];
		selfR.cancelSearch(user, true);
		if (config.reportjoins) {
			selfR.add('|l|'+user.getIdentity());
		} else if (user.named) {
			var entry = '|L|' + user.getIdentity();
			selfR.send(entry);
			selfR.logEntry(entry);
		}
	};
	this.startBattle = function(p1, p2, format, rated, p1team, p2team) {
		var newRoom;
		p1 = Users.get(p1);
		p2 = Users.get(p2);

		if (!p1 || !p2) {
			// most likely, a user was banned during the battle start procedure
			selfR.cancelSearch(p1, true);
			selfR.cancelSearch(p2, true);
			return;
		}
		if (p1 === p2) {
			selfR.cancelSearch(p1, true);
			selfR.cancelSearch(p2, true);
			p1.emit('message', 'You can\'t battle your own account. Please use something like Private Browsing to battle yourself.');
			return;
		}

		if (lockdown) {
			selfR.cancelSearch(p1, true);
			selfR.cancelSearch(p2, true);
			p1.emit('message', 'The server is shutting down. Battles cannot be started at this time.');
			p2.emit('message', 'The server is shutting down. Battles cannot be started at this time.');
			selfR.update();
			return;
		}

		//console.log('BATTLE START BETWEEN: '+p1.userid+' '+p2.userid);
		var i = selfR.numRooms+1;
		var formaturlid = format.toLowerCase().replace(/[^a-z0-9]+/g,'');
		while(rooms['battle-'+formaturlid+i]) {
			i++;
		}
		selfR.numRooms = i;
		newRoom = selfR.addRoom('battle-'+formaturlid+i, format, p1, p2, selfR.id, rated);
		p1.joinRoom(newRoom);
		p2.joinRoom(newRoom);
		newRoom.joinBattle(p1, p1team);
		newRoom.joinBattle(p2, p2team);
		selfR.cancelSearch(p1, true);
		selfR.cancelSearch(p2, true);
		if (config.reportbattles) {
			selfR.add('|b|'+newRoom.id+'|'+p1.getIdentity()+'|'+p2.getIdentity());
		} else {
			selfR.send('|B|'+newRoom.id+'|'+p1.getIdentity()+'|'+p2.getIdentity());
		}
	};
	this.addRoom = function(room, format, p1, p2, parent, rated) {
		room = newRoom(room, format, p1, p2, parent, rated);
		if (typeof room.i[selfR.id] !== 'undefined') return;
		room.i[selfR.id] = selfR.rooms.length;
		selfR.rooms.push(room);
		return room;
	};
	this.removeRoom = function(room) {
		room = getRoom(room);
		if (!room) return;
		if (typeof room.i[selfR.id] !== 'undefined') {
			selfR.rooms.splice(room.i[selfR.id],1);
			delete room.i[selfR.id];
			for (var i=0; i<selfR.rooms.length; i++) {
				selfR.rooms[i].i[selfR.id] = i;
			}
		}
	};
	this.isEmpty = function() { return false; };
	this.isFull = function() { return false; };
	this.chat = function(user, message, socket) {
		if (!message || !message.trim || !message.trim().length) return;
		if (message.substr(0,5) !== '/utm ' && message.substr(0,5) !== '/trn ' && message.length > MAX_MESSAGE_LENGTH && !user.can('ignorelimits')) {
			emit(socket, 'message', "Your message is too long:\n\n"+message);
			return;
		}
		var cmd = '', target = '';
		if (message.substr(0,2) !== '//' && message.substr(0,1) === '/') {
			var spaceIndex = message.indexOf(' ');
			if (spaceIndex > 0) {
				cmd = message.substr(1, spaceIndex-1);
				target = message.substr(spaceIndex+1);
			} else {
				cmd = message.substr(1);
				target = '';
			}
		} else if (message.substr(0,1) === '!') {
			var spaceIndex = message.indexOf(' ');
			if (spaceIndex > 0) {
				cmd = message.substr(0, spaceIndex);
				target = message.substr(spaceIndex+1);
			} else {
				cmd = message;
				target = '';
			}
		}

		var parsedMessage = parseCommand(user, cmd, target, selfR, socket, message);
		if (typeof parsedMessage === 'string') message = parsedMessage;
		if (parsedMessage === false) {
			// do nothing
		} else if (message.substr(0,3) === '>> ') {
			var cmd = message.substr(3);

			var room = selfR;
			var me = user;
			selfR.add('|c|'+user.getIdentity()+'|>> '+cmd, true);
			if (user.can('console')) {
				try {
					selfR.add('|c|'+user.getIdentity()+'|<< '+eval(cmd), true);
				} catch (e) {
					selfR.add('|c|'+user.getIdentity()+'|<< error: '+e.message, true);
					var stack = (""+e.stack).split("\n");
					for (var i=0; i<stack.length; i++) {
						user.sendTo(selfR.id, '<< '+stack[i]);
					}
				}
			} else {
				selfR.add('|c|'+user.getIdentity()+'|<< Access denied.', true);
			}
		} else if (!user.muted) {
			selfR.add('|c|'+user.getIdentity()+'|'+message, true);
		}
		selfR.update();
	};
}

// to make sure you don't get null returned, pass the second argument
getRoom = function(roomid, fallback) {
	if (roomid && roomid.id) return roomid;
	if (!roomid) roomid = 'default';
	if (!rooms[roomid] && fallback) {
		return rooms.lobby;
	}
	return rooms[roomid];
};
newRoom = function(roomid, format, p1, p2, parent, rated) {
	if (roomid && roomid.id) return roomid;
	if (!p1 || !p2) return false;
	if (!roomid) roomid = 'default';
	if (!rooms[roomid]) {
		console.log("NEW ROOM: "+roomid);
		rooms[roomid] = new BattleRoom(roomid, format, p1, p2, parent, rated);
	}
	return rooms[roomid];
};

rooms = {};
console.log("NEW LOBBY: lobby");
rooms.lobby = new LobbyRoom('lobby');

exports.BattleRoom = BattleRoom;
exports.LobbyRoom = LobbyRoom;

exports.get = getRoom;
exports.create = newRoom;
exports.rooms = rooms;
exports.lobby = rooms.lobby;
