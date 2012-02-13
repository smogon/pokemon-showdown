config = require('./config/config.js');
serverid = config.serverid;
servertoken = config.servertoken;

//require("./node_modules/long-stack-traces");

request = require('request');
fs = require('fs');

/*
var app = require('http').createServer()
  , io = require('socket.io').listen(app)
  , fs = require('fs');

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

app.listen(8000); */

if (process.argv[2] && parseInt(process.argv[2]))
{
	config.port = parseInt(process.argv[2]);
}

var io = require('socket.io').listen(config.port).set('log level', 1);

function getTime()
{
	return new Date().getTime();
}

function toId(text)
{
	text = text || '';
	return text.replace(/ /g, '');
}
function toUserid(name)
{
	return name.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

BattlePokedex = require('./pokedex.js').BattlePokedex;
BattleTiers = require('./tiers.js').BattleTiers;
BattleMovedex = require('./movedex.js').BattleMovedex;
BattleStatuses = require('./statuses.js').BattleStatuses;
BattleTypeChart = require('./typechart.js').BattleTypeChart;
BattleScripts = require('./scripts.js').BattleScripts;
BattleItems = require('./items.js').BattleItems;
BattleAbilities = require('./abilities.js').BattleAbilities;
BattleFormats = require('./formats.js').BattleFormats;
BattleLearnsets = require('./learnsets.js').BattleLearnsets;

var sim = require('./simulator.js');

BattlePokemon = sim.BattlePokemon;
BattleSide = sim.BattleSide;
Battle = sim.Battle;

BattleTools = require('./tools.js').BattleTools;

Tools = new BattleTools();

getUser = require('./users.js').getUser;
parseCommand = require('./chat-commands.js').parseCommand;

lockdown = false;

function reloadEngine()
{
	for (var i in require.cache)
	{
		delete require.cache[i];
	}
	BattlePokedex = require('./pokedex.js').BattlePokedex;
	BattleTiers = require('./tiers.js').BattleTiers;
	BattleMovedex = require('./movedex.js').BattleMovedex;
	BattleStatuses = require('./statuses.js').BattleStatuses;
	BattleTypeChart = require('./typechart.js').BattleTypeChart;
	BattleScripts = require('./scripts.js').BattleScripts;
	BattleItems = require('./items.js').BattleItems;
	BattleAbilities = require('./abilities.js').BattleAbilities;
	BattleFormats = require('./formats.js').BattleFormats;
	BattleLearnsets = require('./learnsets.js').BattleLearnsets;

	sim = require('./simulator.js');

	BattlePokemon = sim.BattlePokemon;
	BattleSide = sim.BattleSide;
	Battle = sim.Battle;

	BattleTools = require('./tools.js').BattleTools;

	Tools = new BattleTools();
}

function Room(roomid, format, p1, p2, parentid, ranked)
{
	var selfR = this;
	
	format = ''+(format||'');
	
	this.type = 'room';
	this.id = roomid;
	this.i = {};
	this.users = {};
	this.format = format;
	console.log("NEW BATTLE");
	
	var formatid = toId(format);
	
	if (ranked && BattleFormats[formatid] && BattleFormats[formatid].ranked)
	{
		ranked = {
			p1: p1.userid,
			p2: p2.userid,
			format: format
		};
	}
	else
	{
		ranked = false;
	}
	
	this.ranked = ranked;
	this.battle = new Battle(selfR.id, format, ranked);
	this.resetTimer = null;
	this.destroyTimer = null;
	this.graceTime = 0;
	
	this.parentid = parentid||'';
	this.p1 = p1 || '';
	this.p2 = p2 || '';
	
	this.sideTicksLeft = [9, 9];
	this.sideFreeTicks = [0, 0];
	this.inactiveTicksLeft = 0;
	
	this.active = false;
	
	this.update = function(excludeUser) {
		update = selfR.battle.getUpdates();
		if (!update) return;
		
		if (selfR.battle.ended && selfR.ranked)
		{
			var p1score = 0.5;
			
			if (selfR.battle.winner === selfR.ranked.p1)
			{
				p1score = 1;
			}
			else if (selfR.battle.winner === selfR.ranked.p2)
			{
				p1score = 0;
			}
			
			var p1 = selfR.ranked.p1;
			if (getUser(selfR.ranked.p1)) p1 = getUser(selfR.ranked.p1).name;
			var p2 = selfR.ranked.p2;
			if (getUser(selfR.ranked.p2)) p2 = getUser(selfR.ranked.p2).name;
			
			update.updates.push('[DEBUG] uri: '+config.loginserver+'action.php?act=ladderupdate&serverid='+serverid+'&p1='+encodeURIComponent(p1)+'&p2='+encodeURIComponent(p2)+'&score='+p1score+'&format='+toId(selfR.ranked.format)+'&servertoken=[token]');
			
			if (!selfR.ranked.p1 || !selfR.ranked.p2)
			{
				update.updates.push('message ERROR: Ladder not updated: a player does not exist');
			}
			else
			{
				// update rankings
				request({
					uri: config.loginserver+'action.php?act=ladderupdate&serverid='+serverid+'&p1='+encodeURIComponent(p1)+'&p2='+encodeURIComponent(p2)+'&score='+p1score+'&format='+toId(selfR.ranked.format)+'&servertoken='+servertoken+'&nocache='+getTime(),
				}, function(error, response, body) {
					if (body)
					{
						try
						{
							var data = JSON.parse(body);
							// we don't actually do much with this data
							selfR.battle.add("[DEBUG] ladder reply: "+body);
							selfR.battle.add("message Ladder updated.");
							selfR.update();
						}
						catch(e)
						{
						}
					}
					else
					{
					}
				});
				fs.writeFile('logs/lastbattle.txt', ''+lobby.numRooms);
				var logData = {
					p1score: p1score,
					turns: selfR.battle.turn,
					p1: selfR.battle.allySide.name,
					p2: selfR.battle.foeSide.name,
					p1team: selfR.battle.allySide.team,
					p2team: selfR.battle.foeSide.team
				};
				fs.writeFile('logs/'+selfR.format.toLowerCase().replace(/[^a-z0-9]+/g,'')+'/'+selfR.id+'.log.json',
					JSON.stringify(logData)
				);
			}
			
			selfR.ranked = false;
		}
		
		update.room = roomid;
		var hasUsers = false;
		for (var i in selfR.users)
		{
			hasUsers = true;
			if (selfR.users[i] === excludeUser) continue;
			selfR.users[i].emit('update', update);
		}
		
		// empty rooms time out after ten minutes
		if (!hasUsers)
		{
			if (!selfR.destroyTimer)
			{
				selfR.destroyTimer = setTimeout(selfR.tryDestroy, 600000);
			}
		}
		else if (selfR.destroyTimer)
		{
			clearTimeout(selfR.destroyTimer);
			selfR.destroyTimer = null;
		}
	};
	this.tryDestroy = function() {
		for (var i in selfR.users)
		{
			// don't destroy ourselves if there are users in this room
			// theoretically, Room.update should've stopped tryDestroy's timer
			// well before we get here
			return;
		}
		selfR.destroy();
	};
	this.broadcastError = function(message) {
		for (var i in selfR.users)
		{
			selfR.users.emit('connectionError', message);
		}
	};
	this.reset = function(reload)
	{
		clearTimeout(selfR.resetTimer);
		selfR.resetTimer = null;
		
		if (lockdown)
		{
			selfR.add('The battle was not restarted because the server is preparing to shut down.');
			return;
		}
		
		selfR.battle.add('RESET');
		selfR.update();
		
		if (selfR.battle.allySide && selfR.battle.allySide.user) delete selfR.battle.allySide.user.sides[selfR.id];
		if (selfR.battle.foeSide && selfR.battle.foeSide.user) delete selfR.battle.foeSide.user.sides[selfR.id];
		
		console.log("NEW BATTLE (reset)");
		selfR.battle = new Battle(selfR.id, selfR.format, false);
		selfR.active = selfR.battle.active;
		if (selfR.parentid)
		{
			getRoom(selfR.parentid).updateRooms();
		}
	};
	this.getInactiveSide = function()
	{
		var inactiveSide = -1;
		if (!selfR.battle.allySide.user && selfR.battle.foeSide.user)
		{
			inactiveSide = 0;
			noUser = true;
		}
		else if (selfR.battle.allySide.user && !selfR.battle.foeSide.user)
		{
			inactiveSide = 1;
			noUser = true;
		}
		else if (!selfR.battle.allySide.decision && selfR.battle.foeSide.decision)
		{
			inactiveSide = 0;
		}
		else if (selfR.battle.allySide.decision && !selfR.battle.foeSide.decision)
		{
			inactiveSide = 1;
		}
		return inactiveSide;
	};
	// side can be a side or user
	this.forfeit = function(side, message)
	{
		var forfeitSide = -1;
		if (!selfR.battle || selfR.battle.ended || !selfR.battle.started) return false;
		
		if (side === selfR.battle.sides[0]) forfeitSide = 0;
		else if (side === selfR.battle.sides[1]) forfeitSide = 1;
		else if (side === 0) forfeitSide = 0;
		else if (side === 1) forfeitSide = 1;
		else if (side === selfR.battle.sides[0].user) forfeitSide = 0;
		else if (side === selfR.battle.sides[1].user) forfeitSide = 1;
		else return false;
		
		if (!message) message = ' forfeited.';
		
		selfR.battle.add('message '+selfR.battle.sides[forfeitSide].name+message);
		selfR.battle.win(selfR.battle.sides[forfeitSide].foe);
		selfR.active = selfR.battle.active;
		selfR.update();
		return true;
	}
	this.kickInactive = function()
	{
		clearTimeout(selfR.resetTimer);
		selfR.resetTimer = null;
		
		var action = 'be kicked';
		if (selfR.ranked)
		{
			action = 'forfeit';
		}
		
		var inactiveSide = selfR.getInactiveSide();
		
		if (!selfR.battle || selfR.battle.ended || !selfR.battle.started) return false;
		
		if (inactiveSide == -1)
		{
			selfR.battle.add('message Both players are inactive, so neither player was kicked.');
			selfR.update();
			return;
		}
		if (!selfR.battle.curCallback)
		{
			selfR.battle.add('message We are experiencing a bug. Please notify a system operator (people with & next to their name).');
			selfR.update();
			return;
		}
		
		// now to see how much time we have left
		if (selfR.inactiveTicksLeft)
		{
			selfR.inactiveTicksLeft--;
			if (selfR.sideFreeTicks[inactiveSide])
			{
				selfR.sideFreeTicks[inactiveSide]--;
			}
			else
			{
				selfR.sideTicksLeft[inactiveSide]--;
			}
		}
		if (selfR.inactiveTicksLeft)
		{
			selfR.battle.add('message Inactive players will '+action+' in '+(selfR.inactiveTicksLeft*30)+' seconds.');
			selfR.update();
			selfR.resetTimer = setTimeout(selfR.kickInactive, 30*1000);
			return;
		}
		
		if (selfR.battle.ranked)
		{
			selfR.forfeit(inactiveSide,' lost because of their inactivity.');
		}
		else
		{
			if (!noUser)
			{
				selfR.battle.add('message Kicking inactive players.');
				selfR.battle.leave(selfR.battle.sides[inactiveSide].user);
				selfR.active = selfR.battle.active;
				selfR.update();
			}
		}
		
		if (selfR.parentid)
		{
			getRoom(selfR.parentid).updateRooms();
		}
	}
	this.requestReset = function(user) {
		if (selfR.resetTimer) return;
		if (!selfR.battle.started) return; // no point
		if (user) attrib = ' (requested by '+user.name+')';
		if (selfR.ranked)
		{
			selfR.battle.add('message The battle cannot be restarted because it is a rated battle'+attrib+'.');
			return;
		}
		var elapsedTime = getTime() - selfR.graceTime;
		
		// tickTime is in chunks of 30
		var tickTime = 1;
		
		if (elapsedTime < 60000)
		{
			tickTime = 6;
		}
		else if (elapsedTime < 120000)
		{
			tickTime = 4;
		}
		else if (elapsedTime < 150000)
		{
			tickTime = 2;
		}
		else
		{
			tickTime = 1;
		}
		selfR.battle.add('message The battle will restart if there is no activity for '+(tickTime*30)+' seconds'+attrib+'.');
		selfR.update();
		selfR.resetTimer = setTimeout(selfR.reset, tickTime*30*1000);
	};
	this.requestKickInactive = function(user) {
		if (selfR.resetTimer) return;
		if ((!selfR.battle.allySide.user || !selfR.battle.foeSide.user) && !selfR.ranked)
		{
			selfR.battle.add('message This isn\'t a rated battle; victory doesn\'t mean anything.');
			selfR.battle.add('message Do you just want to see the text "you win"? Okay. You win.');
			selfR.update();
			return;
		}
		
		if (user) attrib = ' (requested by '+user.name+')';
		var action = 'be kicked';
		if (selfR.ranked)
		{
			action = 'forfeit';
		}
				
		// tickTime is in chunks of 30
		var elapsedTime = getTime() - selfR.graceTime;
		if (elapsedTime < 60000)
		{
			tickTime = 6;
		}
		else if (elapsedTime < 120000)
		{
			tickTime = 4;
		}
		else if (elapsedTime < 150000)
		{
			tickTime = 2;
		}
		else
		{
			tickTime = 1;
		}
		if (tickTime > 2 && (!selfR.battle.allySide.user || !selfR.battle.foeSide.user))
		{
			// if a player has left, don't wait longer than 2 ticks
			tickTime = 2;
		}
		
		var inactiveSide = selfR.getInactiveSide();
		if (tickTime > 2 && selfR.sideTicksLeft[inactiveSide] < tickTime)
		{
			tickTime = selfR.sideTicksLeft[inactiveSide];
			if (tickTime < 2) tickTime = 2;
			
			selfR.sideFreeTicks[inactiveSide] = 0;
			if (elapsedTime > 150000) selfR.sideTicksLeft[inactiveSide]--;
			else if (elapsedTime < 30000) selfR.sideFreeTicks[inactiveSide] = 1;
		}
		
		selfR.inactiveTicksLeft = tickTime;
		selfR.battle.add('message Inactive players will '+action+' in '+(tickTime*30)+' seconds'+attrib+'.');
		selfR.update();
		selfR.resetTimer = setTimeout(selfR.kickInactive, 30*1000);
	};
	this.cancelReset = function() {
		if (selfR.resetTimer)
		{
			selfR.battle.add('message The restart or kick was interrupted by activity.');
			selfR.update();
			clearTimeout(selfR.resetTimer);
			selfR.resetTimer = null;
		}
		selfR.graceTime = getTime();
	};
	this.decision = function(user, choice, data) {
		selfR.cancelReset();
		selfR.battle.decision(user, choice, data);
		if (selfR.battle.ended)
		{
			selfR.battle.add('callback restart');
		}
		if (selfR.active !== selfR.battle.active)
		{
			selfR.active = selfR.battle.active;
			if (selfR.parentid)
			{
				getRoom(selfR.parentid).updateRooms();
			}
		}
		selfR.update();
	};
	this.battleEndRestart = function() {
		if (selfR.resetTimer) return;
		if (selfR.battle.ended)
		{
			selfR.battle.add('message A new game will start in 5 seconds.');
			// reset in 5 seconds
			selfR.resetTimer = setTimeout(selfR.reset, 5000);
		}
	};
	this.initSocket = function(user, socket) {
		var initdata = {
			name: user.name,
			userid: user.userid,
			named: user.named,
			renamePending: user.renamePending,
			token: user.token,
			room: selfR.id,
			roomType: 'battle',
			battlelog: selfR.battle.log
		};
		socket.emit('init', initdata);
	};
	this.join = function(user) {
		if (!user) return false;
		if (selfR.users[user.userid]) return user;
		
		selfR.users[user.userid] = user;
		
		if (user.named)
		{
			selfR.battle.add('join '+user.name);
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
			battlelog: selfR.battle.log
		};
		user.emit('init', initdata);
		
		return user;
	};
	this.rename = function(user, oldid, joining) {
		if (joining)
		{
			selfR.battle.add('join '+user.name);
		}
		if (user.sides[selfR.id])
		{
			selfR.battle.rename(user);
		}
		delete selfR.users[oldid];
		selfR.users[user.userid] = user;
		selfR.update();
		return user;
	};
	this.joinBattle = function(user) {
		var slot = 0;
		if (selfR.ranked)
		{
			if (selfR.ranked.p1 === user.userid)
			{
				slot = 1;
			}
			else if (selfR.ranked.p2 === user.userid)
			{
				slot = 2;
			}
			else
			{
				return;
			}
		}
		
		selfR.cancelReset();
		selfR.battle.join(user, slot);
		selfR.active = selfR.battle.active;
		selfR.update();
		
		if (selfR.parentid)
		{
			getRoom(selfR.parentid).updateRooms();
		}
	};
	this.leaveBattle = function(user) {
		if (!user) return; // ...
		if (user.sides[selfR.id])
		{
			selfR.battle.leave(user);
		}
		selfR.active = selfR.battle.active;
		selfR.update();
		
		if (selfR.parentid)
		{
			getRoom(selfR.parentid).updateRooms();
		}
	};
	this.leave = function(user) {
		if (!user) return; // ...
		if (user.sides[selfR.id])
		{
			selfR.battle.leave(user);
			selfR.active = selfR.battle.active;
			if (selfR.parentid)
			{
				getRoom(selfR.parentid).updateRooms();
			}
		}
		else if (!user.named)
		{
			delete selfR.users[user.userid];
			return;
		}
		delete selfR.users[user.userid];
		selfR.battle.add('leave '+user.name);
		selfR.update();
	};
	this.isEmpty = function() {
		if (selfR.battle.allySide && selfR.battle.allySide.user) return false;
		if (selfR.battle.foeSide && selfR.battle.foeSide.user) return false;
		return true;
	};
	this.isFull = function() {
		if (selfR.battle.allySide && selfR.battle.allySide.user && selfR.battle.foeSide && selfR.battle.foeSide.user) return true;
		return false;
	};
	this.add = function(message) {
		if (message.rawMessage)
		{
			selfR.battle.add('chatmsg-raw '+message.rawMessage);
		}
		else
		{
			selfR.battle.add('chatmsg '+message);
		}
	};
	this.addRaw = function(message) {
		selfR.battle.add('chatmsg-raw '+message);
	};
	this.chat = function(user, message, socket) {
		var cmd = '', target = '';
		if (message.length > 255)
		{
			socket.emit('message', "Your message is too long.");
			return;
		}
		if (message.substr(0,2) === '//')
		{
			message = message.substr(1);
		}
		else if (message.substr(0,1) === '/')
		{
			var spaceIndex = message.indexOf(' ');
			if (spaceIndex > 0)
			{
				cmd = message.substr(1, spaceIndex-1);
				target = message.substr(spaceIndex+1);
			}
			else
			{
				cmd = message.substr(1);
				target = '';
			}
		}
		
		if (parseCommand(user, cmd, target, selfR, socket, message))
		{
			// do nothing
		}
		else if (cmd === 'a')
		{
			if (user.isMod())
			{
				selfR.battle.add(target);
			}
		}
		else if (cmd === 'shutdown')
		{
			selfR.broadcastError('The server is restarting. Please refresh this page.');
		}
		else if (message.substr(0,3) === '>> ')
		{
			var cmd = message.substr(3);

			var room = selfR;
			var battle = selfR.battle;
			var foeSide;
			var allySide;
			var foePokemon;
			var allyPokemon;
			var me = user;
			if (battle)
			{
				foeSide = battle.foeSide;
				allySide = battle.allySide;
				if (foeSide)
				{
					foePokemon = foeSide.active[0];
				}
				if (allySide)
				{
					allyPokemon = allySide.active[0];
				}
			}
			selfR.battle.add('chat '+toId(user.name)+' >> '+cmd);
			if (user.group === '&')
			{
				try
				{
					selfR.battle.add('chat '+toId(user.name)+' << '+eval(cmd));
				}
				catch (e)
				{
					selfR.battle.add('chat '+toId(user.name)+' << error: '+e.message);
					user.emit('console', '<< error details: '+JSON.stringify(e.stack));
				}
			}
			else
			{
				selfR.battle.add('chat '+toId(user.name)+' << Access denied. To use the developer console, you must be: &');
			}
		}
		else if (cmd === 'forcereset')
		{
			if (user.isMod())
			{
				selfR.reset();
			}
			else
			{
			}
		}
		else if (cmd === 'reset')
		{
			selfR.requestReset(user);
		}
		else if (cmd === 'restart')
		{
			selfR.battleEndRestart(user);
		}
		else if (cmd === 'kickinactive')
		{
			selfR.requestKickInactive(user);
		}
		else if (!user.muted)
		{
			selfR.battle.add('chat '+toId(user.name)+' '+message);
		}
		selfR.update();
	};
	
	this.destroy = function() {
		// deallocate ourself
		
		// remove references to ourself
		for (var i in selfR.users)
		{
			selfR.users[i].leaveRoom(selfR);
			delete selfR.users[i];
		}
		selfR.users = null;
		
		// deallocate children and get rid of references to them
		if (selfR.battle)
		{
			selfR.battle.destroy();
		}
		selfR.battle = null;
		
		if (selfR.resetTimer)
		{
			clearTimeout(selfR.resetTimer);
		}
		selfR.resetTimer = null;
		
		// get rid of some possibly-circular references
		delete rooms[selfR.id];
		
		selfR = null;
	}
}

function Lobby(roomid)
{
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
	
	this.usersChanged = true;
	this.roomsChanged = true;
	
	// Never do any other file IO synchronously
	// but this is okay to prevent race conditions as we start up PS
	this.numRooms = 0;
	try
	{
		parseInt(fs.readFileSync('logs/lastbattle.txt')) || 0;
	}
	catch (e) {} // file doesn't exist [yet]
	
	this.getUpdate = function(since, omitUsers, omitRoomList) {
		var update = {room: roomid};
		var i = since;
		if (!i) i = selfR.log.length - 100;
		if (i<0) i = 0;
		update.logStart = i;
		update.logUpdate = [];
		for (;i<selfR.log.length;i++)
		{
			update.logUpdate.push(selfR.log[i]);
		}
		if (!omitRoomList) update.rooms = selfR.getRoomList();
		if (!omitUsers) update.users = selfR.getUserList();
		update.searcher = selfR.searchers.length;
		return update;
	};
	this.getUserList = function()
	{
		var userList = {list: {}, users: 0, unregistered: 0, guests: 0};
		for (var i in selfR.users)
		{
			if (!selfR.users[i].named)
			{
				userList.guests++;
				continue;
			}
			if (config.lagmode && !selfR.users[i].authenticated && selfR.users[i].group === ' ')
			{
				userList.unregistered++;
				continue;
			}
			userList.users++;
			userList.list[selfR.users[i].userid] = selfR.users[i].getIdentity();
		}
		return userList;
	};
	this.getRoomList = function()
	{
		var roomList = {};
		var roomCount = 0;
		for (i=0; i<selfR.rooms.length; i++)
		{
			var room = selfR.rooms[i];
			if (!room.active) continue;
			var roomData = {};
			if (room.battle && room.battle.sides[0] && room.battle.sides[1])
			{
				if (room.battle.sides[0].user && room.battle.sides[1].user)
				{
					roomData.p1 = room.battle.sides[0].user.getIdentity();
					roomData.p2 = room.battle.sides[1].user.getIdentity();
				}
				else if (room.battle.sides[0].user)
				{
					roomData.p1 = room.battle.sides[0].user.getIdentity();
				}
				else if (room.battle.sides[1].user)
				{
					roomData.p1 = room.battle.sides[1].user.getIdentity();
				}
			}
			roomList[selfR.rooms[i].id] = roomData;
			
			roomCount++;
			if (roomCount > 24)
			{
				break;
			}
		}
		return roomList;
	};
	this.cancelSearch = function(user, noUpdate) {
		user.cancelChallengeTo();
		for (var i=0; i<selfR.searchers.length; i++)
		{
			var search = selfR.searchers[i];
			if (!search.user.connected)
			{
				selfR.searchers.splice(i,1);
				i--;
				continue;
			}
			if (search.user === user)
			{
				selfR.searchers.splice(i,1);
				search.user.emit('update', {searching: false, room: selfR.id});
				if (!noUpdate)
				{
					selfR.update();
				}
				return true;
			}
		}
		return false;
	};
	this.searchBattle = function(user, format) {
		if (!user.connected) return;
		if (lockdown)
		{
			user.emit('message', 'The server is shutting down. Battles cannot be started at this time.');
			return;
		}
		
		var problems = Tools.validateTeam(user.team, format);
		if (problems)
		{
			user.emit('message', "Your team was rejected for the following reasons:\n\n- "+problems.join("\n- "));
			return;
		}
		
		for (var i=0; i<selfR.searchers.length; i++)
		{
			var search = selfR.searchers[i];
			if (!search.user.connected)
			{
				selfR.searchers.splice(i,1);
				i--;
				continue;
			}
			if (format === search.format)
			{
				if (search.user === user)
				{
					return;
				}
				selfR.searchers.splice(i,1);
				search.user.emit('update', {searching: false, room: selfR.id});
				search.user.team = search.team;
				selfR.startBattle(search.user, user, format, true);
				return;
			}
		}
		var newSearch = {
		 	user: user,
		 	format: format,
		 	room: selfR.id,
		 	team: user.team
		};
		var newSearchData = {
		 	userid: user.userid,
		 	format: format,
		 	room: selfR.id
		};
		selfR.searchers.push(newSearch);
		user.emit('update', {searching: newSearchData, room: selfR.id});
		selfR.update();
	};
	this.update = function(excludeUser) {
		var update = selfR.getUpdate(selfR.lastUpdate, !selfR.usersChanged, !selfR.roomsChanged);
		update.room = selfR.id;
		selfR.lastUpdate = selfR.log.length;
		for (var i in selfR.users)
		{
			if (selfR.users[i] === excludeUser) continue;
			selfR.users[i].emit('update', update);
		}
		selfR.usersChanged = false;
		selfR.roomsChanged = false;
	};
	this.updateRooms = function(excludeUser) {
		var update = {
			rooms: selfR.getRoomList()
		};
		update.room = selfR.id;
		for (var i in selfR.users)
		{
			if (selfR.users[i] === excludeUser) continue;
			selfR.users[i].emit('update', update);
		}
		selfR.roomsChanged = false;
	};
	this.add = function(message) {
		if (typeof message === 'string')
		{
			selfR.log.push({
				message: message
			});
		}
		else
		{
			selfR.log.push(message);
		}
		selfR.update();
	};
	this.addRaw = function(message) {
		selfR.log.push({
			rawMessage: message
		});
		selfR.update();
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
			users: selfR.getUserList(),
			roomType: 'lobby',
			log: selfR.log.slice(-100),
			searcher: selfR.searchers.length,
		}
		socket.emit('init', initdata);
	};
	this.join = function(user) {
		if (!user) return false; // ???
		if (selfR.users[user.userid]) return user;
		
		selfR.users[user.userid] = user;
		if (user.named)
		{
			selfR.usersChanged = true;
			if (config.reportjoins)
			{
				selfR.log.push({name: user.name, action: 'join'});
				selfR.update(user);
			}
		}
		
		var initdata = {
			name: user.name,
			userid: user.userid,
			named: user.named,
			renamePending: user.renamePending,
			token: user.token,
			room: selfR.id,
			rooms: selfR.getRoomList(),
			users: selfR.getUserList(),
			roomType: 'lobby',
			log: selfR.log.slice(-100),
			searcher: selfR.searchers.length,
		}
		user.emit('init', initdata);
		
		return user;
	};
	this.rename = function(user, oldid, joining) {
		if (joining && config.reportjoins)
		{
			selfR.log.push({name: user.name, action: 'join'});
		}
		delete selfR.users[oldid];
		selfR.users[user.userid] = user;
		selfR.usersChanged = true;
		if (config.reportjoins)
		{
			selfR.update();
		}
		return user;
	};
	this.leave = function(user) {
		if (!user) return; // ...
		delete selfR.users[user.userid];
		selfR.cancelSearch(user, true);
		selfR.usersChanged = true;
		if (config.reportjoins)
		{
			if (user.named)
			{
				selfR.log.push({name: user.name, action: 'leave'});
			}
			selfR.update();
		}
	};
	this.startBattle = function(p1, p2, format, ranked) {
		var newRoom;
		p1 = getUser(p1);
		p2 = getUser(p2);
		
		if (p1 === p2)
		{
			selfR.cancelSearch(p1, true);
			selfR.cancelSearch(p2, true);
			p1.emit('message', 'You can\'t battle your own account. Please use Private Browsing to battle yourself.');
			return;
		}
		
		if (lockdown)
		{
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
		while(rooms['battle-'+formaturlid+i])
		{
			i++;
		}
		selfR.numRooms = i;
		newRoom = selfR.addRoom('battle-'+formaturlid+i, format, p1, p2, selfR.id, ranked);
		p1.joinRoom(newRoom);
		p2.joinRoom(newRoom);
		newRoom.joinBattle(p1);
		newRoom.joinBattle(p2);
		selfR.cancelSearch(p1, true);
		selfR.cancelSearch(p2, true);
		selfR.roomsChanged = true;
		if (config.reportbattles)
		{
			selfR.log.push({
				name: p1.name,
				name2: p2.name,
				room: newRoom.id,
				format: format,
				action: 'battle'
			});
			selfR.update();
		}
	};
	this.addRoom = function(room, format, p1, p2, parent, ranked) {
		room = newRoom(room, format, p1, p2, parent, ranked);
		if (typeof room.i[selfR.id] !== 'undefined') return;
		room.i[selfR.id] = selfR.rooms.length;
		selfR.rooms.push(room);
		return room;
	};
	this.removeRoom = function(room) {
		room = getRoom(room);
		if (typeof room.i[selfR.id] !== 'undefined')
		{
			selfR.rooms = selfR.rooms.splice(room.i[selfR.id],1);
			delete room.i[selfR.id];
			for (var i=0; i<selfR.rooms.length; i++)
			{
				selfR.rooms[i].i[selfR.id] = i;
			}
		}
	};
	this.isEmpty = function() { return false; };
	this.isFull = function() { return false; };
	this.chat = function(user, message, socket) {
		if (!user.named || !message || !message.trim || !message.trim().length) return;
		if (message.length > 255)
		{
			socket.emit('message', "Your message is too long.");
			return;
		}
		var cmd = '', target = '';
		if (message.substr(0,2) === '//')
		{
			message = message.substr(1);
		}
		else if (message.substr(0,1) === '/')
		{
			var spaceIndex = message.indexOf(' ');
			if (spaceIndex > 0)
			{
				cmd = message.substr(1, spaceIndex-1);
				target = message.substr(spaceIndex+1);
			}
			else
			{
				cmd = message.substr(1);
				target = '';
			}
		}
		else if (message.substr(0,1) === '!')
		{
			var spaceIndex = message.indexOf(' ');
			if (spaceIndex > 0)
			{
				cmd = message.substr(0, spaceIndex);
				target = message.substr(spaceIndex+1);
			}
			else
			{
				cmd = message;
				target = '';
			}
		}
		
		if (parseCommand(user, cmd, target, selfR, socket, message))
		{
			// do nothing
		}
		else if (message.substr(0,3) === '>> ')
		{
			var cmd = message.substr(3);

			var room = selfR;
			var me = user;
			selfR.log.push({
				name: user.getIdentity(),
				message: '>> '+cmd
			});
			if (user.group === '&')
			{
				try
				{
					selfR.log.push({
						name: user.getIdentity(),
						message: '<< '+eval(cmd)
					});
				}
				catch (e)
				{
					selfR.log.push({
						name: user.getIdentity(),
						message: '<< error: '+e.message
					});
					user.emit('console', '<< error details: '+JSON.stringify(e.stack));
				}
			}
			else
			{
				selfR.log.push({
					name: user.getIdentity(),
					message: '<< Access denied. To use the developer console, you must be: &'
				});
			}
		}
		else if (!user.muted)
		{
			selfR.log.push({
				name: user.getIdentity(),
				message: message
			});
		}
		selfR.update();
	};
}


rooms = {};
console.log("NEW LOBBY: lobby");
var lobby = new Lobby('lobby');
rooms.lobby = lobby;

getRoom = function(roomid)
{
	if (roomid && roomid.id) return roomid;
	if (!roomid) roomid = 'default';
	if (!rooms[roomid])
	{
		return rooms.lobby;
	}
	return rooms[roomid];
}
newRoom = function(roomid, format, p1, p2, parent, ranked)
{
	if (roomid && roomid.id) return roomid;
	if (!roomid) roomid = 'default';
	if (!rooms[roomid])
	{
		console.log("NEW ROOM: "+roomid);
		rooms[roomid] = new Room(roomid, format, p1, p2, parent, ranked);
	}
	return rooms[roomid];
}

mutedIps = {
};
bannedIps = {
};

function resolveUser(you, socket)
{
	if (!you)
	{
		socket.emit('connectionError', 'There has been a connection error. Please refresh the page.');
		return false;
	}
	return you.user;
}

io.sockets.on('connection', function (socket) {
	var you = null;
	console.log('INIT SOCKET: '+socket.id);
	
	if (socket.handshake && socket.handshake.address && socket.handshake.address.address)
	{
		if (bannedIps[socket.handshake.address.address])
		{
			console.log('IP BANNED: '+socket.handshake.address.address);
			return;
		}
	}
	
	socket.on('join', function(data) {
		if (!you)
		{
			you = getUser(data.name, socket, data.token, data.room);
			console.log('JOIN: '+data.name+' => '+you.name+' ['+data.token+']');
		}
		else
		{
			var youUser = resolveUser(you, socket);
			if (!youUser) return;
			youUser.joinRoom(data.room, socket);
		}
	});
	socket.on('rename', function(data) {
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		youUser.rename(data.name, data.token);
	});
	socket.on('chat', function(message) {
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		if (!message) return;
		getRoom(message.room).chat(youUser, message.message, socket);
	});
	socket.on('leave', function(data) {
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		if (!data) return;
		youUser.leaveRoom(getRoom(data.room), socket);
	});
	socket.on('leaveBattle', function(data) {
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		if (!data) return;
		getRoom(data.room).leaveBattle(youUser);
	});
	socket.on('joinBattle', function(data) {
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		getRoom(data.room).joinBattle(youUser);
	});
	
	socket.on('disconnect', function() {
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		youUser.disconnect(socket);
	});
	socket.on('challenge', function(data) {
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		console.log('CHALLENGE: '+youUser.name+' => '+data.userid+' ('+data.act+')');
		switch (data.act)
		{
		case 'make':
			var problems = Tools.validateTeam(youUser.team, data.format);
			if (problems)
			{
				socket.emit('message', "Your team was rejected for the following reasons:\n\n- "+problems.join("\n- "));
				return;
			}
			if (!getUser(data.userid) || !getUser(data.userid).connected)
			{
				socket.emit('message', "The user '"+data.userid+"' was not found.");
			}
			youUser.makeChallenge(data.userid, data.format);
			break;
		case 'cancel':
			youUser.cancelChallengeTo(data.userid);
			break;
		case 'accept':
			var format = 'DebugMode';
			if (youUser.challengesFrom[data.userid]) format = youUser.challengesFrom[data.userid].format;
			var problems = Tools.validateTeam(youUser.team, format);
			if (problems)
			{
				socket.emit('message', "Your team was rejected for the following reasons:\n\n- "+problems.join("\n- "));
				return;
			}
			youUser.acceptChallengeFrom(data.userid);
			break;
		case 'reject':
			youUser.rejectChallengeFrom(data.userid);
			break;
		}
	});
	socket.on('decision', function(data) {
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		var room = getRoom(data.room);
		switch (data.choice)
		{
		case 'move':
		case 'switch':
		case 'undo':
		case 'team':
			if (room.decision) room.decision(youUser,data.choice,data.move);
			break;
		case 'search':
			if (data.search)
			{
				/* if (data.name)
				{
					youUser.rename(data.name, data.token);
				} */
				if (room.searchBattle) room.searchBattle(youUser, data.format);
			}
			else
			{
				if (room.cancelSearch) room.cancelSearch(youUser);
			}
			break;
		}
	});
	socket.on('saveTeam', function(data) {
		var youUser = resolveUser(you, socket);
		if (!youUser) return;
		youUser.team = data.team;
		youUser.emit('update', {team: 'saved', room: 'teambuilder'});
	});
});
