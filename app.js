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
/*				fs.writeFile('logs/lastbattle.txt', ''+lobby.numRooms);
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
				);*/
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
	this.kickInactive = function()
	{
		clearTimeout(selfR.resetTimer);
		selfR.resetTimer = null;
		if (selfR.ranked)
		{
			if (!selfR.battle.allySide.user && selfR.battle.foeSide.user)
			{
				selfR.battle.add('message '+selfR.battle.allySide.name+' lost because of their inactivity.');
				selfR.battle.win(selfR.battle.foeSide);
			}
			else if (selfR.battle.allySide.user && !selfR.battle.foeSide.user)
			{
				selfR.battle.add('message '+selfR.battle.foeSide.name+' lost because of their inactivity.');
				selfR.battle.win(selfR.battle.allySide);
			}
			else if (!selfR.battle.allySide.decision && selfR.battle.foeSide.decision)
			{
				selfR.battle.add('message '+selfR.battle.allySide.name+' lost because of their inactivity.');
				selfR.battle.win(selfR.battle.foeSide);
			}
			else if (selfR.battle.allySide.decision && !selfR.battle.foeSide.decision)
			{
				selfR.battle.add('message '+selfR.battle.foeSide.name+' lost because of their inactivity.');
				selfR.battle.win(selfR.battle.allySide);
			}
			else
			{
				selfR.battle.add('message Both players are inactive, so neither player was kicked.');
			}
		}
		else
		{
			selfR.battle.add('message Kicking inactive players.');
			if (!selfR.battle.allySide.decision)
			{
				selfR.battle.leave(selfR.battle.allySide.user);
			}
			if (!selfR.battle.foeSide.decision)
			{
				selfR.battle.leave(selfR.battle.foeSide.user);
			}
		}
		selfR.active = selfR.battle.active;
		selfR.update();
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
			selfR.battle.add('message The battle cannot be restarted because it is a ranked battle'+attrib+'.');
			return;
		}
		var elapsedTime = getTime() - selfR.graceTime;
		if (elapsedTime < 60000)
		{
			waitTime = 180;
		}
		else if (elapsedTime < 120000)
		{
			waitTime = 120;
		}
		else if (elapsedTime < 150000)
		{
			waitTime = 60;
		}
		else
		{
			waitTime = 30;
		}
		selfR.battle.add('message The battle will restart if there is no activity for '+waitTime+' seconds'+attrib+'.');
		selfR.update();
		selfR.resetTimer = setTimeout(selfR.reset, waitTime*1000);
	};
	this.requestKickInactive = function(user) {
		if (selfR.resetTimer) return;
		if (!selfR.battle.active && !selfR.ranked) return; // no point
		if (user) attrib = ' (requested by '+user.name+')';
		var action = 'be kicked';
		if (selfR.ranked)
		{
			action = 'forfeit';
		}
		var elapsedTime = getTime() - selfR.graceTime;
		if (elapsedTime < 60000)
		{
			waitTime = 180;
		}
		else if (elapsedTime < 120000)
		{
			waitTime = 120;
		}
		else if (elapsedTime < 150000)
		{
			waitTime = 60;
		}
		else
		{
			waitTime = 30;
		}
		if (waitTime > 60 && (!selfR.battle.allySide.user || !selfR.battle.foeSide.user))
		{
			// if a player has left, don't wait longer than 60 seconds
			waitTime = 60;
		}
		selfR.battle.add('message Inactive players will '+action+' in '+waitTime+' seconds'+attrib+'.');
		selfR.update();
		selfR.resetTimer = setTimeout(selfR.kickInactive, waitTime*1000);
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
		selfR.battle.add('chatmsg '+message);
	};
	this.addRaw = function(message) {
		selfR.battle.add('chatmsg-raw '+message);
	};
	this.chat = function(user, message, socket) {
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
		
		if (parseCommand(user, cmd, target, selfR, socket))
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

function parseCommand(user, cmd, target, room, socket)
{
	if (cmd === 'ban' || cmd === 'b')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group)) return true;
			
			room.add(''+targetUser.name+' was banned by '+user.name+'.');
			
			bannedIps[targetUser.ip] = targetUser.userid;
			targetUser.destroy();
			return true;
		}
	}
	else if (cmd === 'unban')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targetid = toUserid(target);
			var success = false;
			
			for (var id in bannedIps)
			{
				if (bannedIps[id] === targetid)
				{
					delete bannedIps[id];
					if (!success)
					{
						room.add(''+target+' was unbanned by '+user.name+'.');
						success = true;
					}
				}
			}
			if (!success)
			{
				socket.emit('console', 'User '+target+' is not banned.');
			}
		}
		else
		{
			socket.emit('console', 'Access denied.');
		}
		return true;
	}
	else if (cmd === 'reply' || cmd === 'r')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		return parseCommand(user, 'msg', ''+(user.lastPM||'')+', '+target, room, socket);
	}
	else if (cmd === 'msg' || cmd === 'pm')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var commaIndex = target.indexOf(',');
		if (commaIndex < 0)
		{
			socket.emit('console', 'You forgot the comma.');
			return parseCommand(user, '?', cmd, room, socket);
		}
		var targetUser = getUser(target.substr(0, commaIndex));
		if (!targetUser || !targetUser.connected)
		{
			target = target.substr(0, commaIndex);
			if (targetUser)
			{
				socket.emit('console', 'User '+target+' is currently offline.');
			}
			else if (target.indexOf(' '))
			{
				socket.emit('console', 'User '+target+' not found. Did you forget a comma?');
			}
			else
			{
				socket.emit('console', 'User '+target+' not found. Did you misspell their name?');
			}
			return parseCommand(user, '?', cmd, room, socket);
		}
		
		target = target.substr(commaIndex+1).trim();
		
		var message = {
			name: user.getIdentity(),
			pm: targetUser.getIdentity(),
			message: target
		};
		user.emit('console', message);
		targetUser.emit('console', message);
		targetUser.lastPM = user.userid;
		user.lastPM = targetUser.userid;
		return true;
	}
	else if (cmd === 'data')
	{
		var pokemon = Tools.getTemplate(target);
		var item = Tools.getItem(target);
		var move = Tools.getMove(target);
		var ability = Tools.getAbility(target);
		var atLeastOne = false;
		if (pokemon.name)
		{
			user.emit('console', {
				evalRawMessage: "'<ul class=\"utilichart\">'+Chart.pokemonRow(exports.BattlePokedex['"+pokemon.name.replace(/ /g,'')+"'],'',{})+'<li style=\"clear:both\"></li></ul>'"
			});
			atLeastOne = true;
		}
		if (ability.name)
		{
			user.emit('console', {
				evalRawMessage: "'<ul class=\"utilichart\">'+Chart.abilityRow(exports.BattleAbilities['"+ability.id+"'],'',{})+'<li style=\"clear:both\"></li></ul>'"
			});
			atLeastOne = true;
		}
		if (item.name)
		{
			user.emit('console', {
				evalRawMessage: "'<ul class=\"utilichart\">'+Chart.itemRow(exports.BattleItems['"+item.id+"'],'',{})+'<li style=\"clear:both\"></li></ul>'"
			});
			atLeastOne = true;
		}
		if (move.name)
		{
			user.emit('console', {
				evalRawMessage: "'<ul class=\"utilichart\">'+Chart.moveRow(exports.BattleMovedex['"+move.id+"'],'',{})+'<li style=\"clear:both\"></li></ul>'"
			});
			atLeastOne = true;
		}
		if (!atLeastOne)
		{
			user.emit('console', "No pokemon, item, move, or ability named '"+target+"' was found. (Check your capitalization?)");
		}
		return true;
	}
	else if (cmd === 'getip' || cmd === 'ip')
	{
		if (!target)
		{
			socket.emit('console', 'Your IP is: '+user.ip);
			return true;
		}
		if (user.group === '&' || user.group === '@')
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
			}
			else
			{
				socket.emit('console', 'User '+targetUser.name+' has IP: '+targetUser.ip);
			}
		}
		else
		{
			socket.emit('console', 'Access denied.');
		}
		return true;
	}
	else if (cmd === 'mute' || cmd === 'm')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			target = getUser(target);
			if (!target) return true;
			if (!user.canMod(target.group)) return true;
			
			room.add(''+target.name+' was muted by '+user.name+'.');
			
			target.muted = true;
			rooms.lobby.usersChanged = true;
			return true;
		} 
	}
	else if (cmd === 'unmute')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			target = getUser(target);
			if (!target) return true;
			if (!user.canMod(target.group)) return true;
			
			room.add(''+target.name+' was unmuted by '+user.name+'.');
			
			target.muted = false;
			rooms.lobby.usersChanged = true;
			return true;
		}
	}
	else if (cmd === 'voice')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			target = getUser(target);
			if (!target) return true;
			if (!user.canMod(target.group) || user.group === '+') return true;
			
			room.add(''+target.name+' was voiced by '+user.name+'.');
			
			target.group = '+';
			rooms.lobby.usersChanged = true;
			return true;
		}
	}
	else if (cmd === 'devoice')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			target = getUser(target);
			if (!target) return true;
			if (!user.canMod(target.group) || user.group === '+') return true;
			
			room.add(''+target.name+' was devoiced by '+user.name+'.');
			
			target.group = ' ';
			rooms.lobby.usersChanged = true;
			return true;
		}
	}
	else if (cmd === 'potd')
	{
		if (user.group !== '&' && user.group !== '@' && user.group !== '%') return true;
		
		BattleFormats.PotD.onPotD = target;
		if (target)
		{
			room.add('The Pokemon of the Day was changed to '+target+' by '+user.name+'.');
		}
		else
		{
			room.add('The Pokemon of the Day was removed by '+user.name+'.');
		}
		
		return true;
	}
	else if (cmd === 'mod')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			target = getUser(target);
			if (!target) return true;
			if (user.group !== '&' && user.group !== '@') return true;
			if (!user.canMod(target.group)) return true;
			
			if (target.group === '@' || target.group === '&')
			{
				room.add(''+target.name+' was demoted to moderator by '+user.name+'.');
			}
			else
			{
				room.add(''+target.name+' was promoted to moderator by '+user.name+'.');
			}
			target.group = '%';
			rooms.lobby.usersChanged = true;
			return true;
		}
	}
	else if (cmd === 'demod')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			target = getUser(target);
			if (!target) return true;
			if (user.group !== '&' && user.group !== '@') return true;
			if (!user.canMod(target.group)) return true;
			
			room.add(''+target.name+' was demoted to voice by '+user.name+'.');
			
			if (target.group === '%')
			{
				target.group = '+';
				rooms.lobby.usersChanged = true;
			}
			return true;
		}
	}
	else if (cmd === 'admin')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			target = getUser(target);
			if (!target) return true;
			if (user.group !== '&' && user.group !== '@') return true;
			if (!user.canMod(target.group)) return true;
			
			if (target.group === '&')
			{
				room.add(''+target.name+' was demoted to admin by '+user.name+'.');
			}
			else
			{
				room.add(''+target.name+' was promoted to admin by '+user.name+'.');
			}
			target.group = '@';
			rooms.lobby.usersChanged = true;
			return true;
		}
	}
	else if (cmd === 'deadmin')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			target = getUser(target);
			if (!target) return true;
			if (user.group !== '&' && user.group !== '@') return true;
			if (!user.canMod(target.group)) return true;
			
			room.add(''+target.name+' was demoted to moderator by '+user.name+'.');
			
			if (target.group === '@')
			{
				target.group = '%';
				rooms.lobby.usersChanged = true;
			}
			return true;
		}
	}
	else if (cmd === 'hotpatch')
	{
		if (user.group === '&')
		{
			if (target === 'confirm')
			{
				reloadEngine();
				room.add('The game engine has been updated.');
				return true;
			}
			socket.emit('console', 'Hot-patching the game engine allows you to update most of Showdown without interrupting currently-running battles.');
			socket.emit('console', 'WARNING: This uses significantly more memory than restarting Showdown, since currently-running battles will use the old engine, but new battles will use the new engine.');
			socket.emit('console', 'To reload the engine, use /hotpatch confirm.');
			return true;
		}
	}
	else if (cmd === 'rating' || cmd === 'ranking' || cmd === 'rank' || cmd === 'ladder')
	{
		target = toUserid(target) || user.userid;
		request({
			uri: config.loginserver+'action.php?act=ladderget&serverid='+serverid+'&user='+target,
		}, function(error, response, body) {
			if (body)
			{
				try
				{
					var data = JSON.parse(body);
					
					socket.emit('console', 'User: '+target);
					
					if (!data.length)
					{
						socket.emit('console', 'has not played a ladder game yet');
					}
					else for (var i=0; i<data.length; i++)
					{
						var row = data[i];
						socket.emit('console', row.formatid+': '+Math.round(row.acre)+' (GXE:'+Math.round(row.pgxe,1)+') (W:'+row.w+'/L:'+row.l+'/T:'+row.t+')');
					}
				}
				catch(e)
				{
				}
			}
			else
			{
				socket.emit('console', 'Error');
			}
		});
		return true;
	}
	else if (cmd === 'nick')
	{
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		user.rename(target);
		return true;
	}
	else if (cmd === 'forcewin')
	{
		if (user.group === '&' && room.battle)
		{
			if (!target)
			{
				room.battle.win('');
				return true;
			}
			target = getUser(target);
			if (target) target = target.userid;
			else target = '';
			
			if (target) room.battle.win(target);
			
			return true;
		}
	}
	else if (cmd === 'lockdown')
	{
		if (user.group === '&')
		{
			lockdown = true;
			for (var id in rooms)
			{
				rooms[id].addRaw('<strong style="color:red">The server is restarting soon. Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</strong>');
			}
		}
		return true;
	}
	else if (cmd === 'endlockdown')
	{
		if (user.group === '&')
		{
			lockdown = false;
			for (var id in rooms)
			{
				rooms[id].addRaw('<strong style="color:blue">The server shutdown was canceled.</strong>');
			}
		}
		return true;
	}
	else if (cmd === 'help' || cmd === 'commands' || cmd === 'h' || cmd === '?')
	{
		var matched = false;
		if (target === 'all' || target === 'msg' || target === 'pm')
		{
			matched = true;
			socket.emit('console', '/msg [username], [message] - Send a private message. Can be used by: anyone');
		}
		if (target === 'all' || target === 'r' || target === 'reply')
		{
			matched = true;
			socket.emit('console', '/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to. Can be used by: anyone');
		}
		if (target === 'all' || target === 'getip' || target === 'ip')
		{
			matched = true;
			socket.emit('console', '/ip - Get your own IP address. Can be used by: anyone');
			socket.emit('console', '/ip [username] - Get a user\'s IP address. Can be used by: @ &');
		}
		if (target === 'all' || target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder')
		{
			matched = true;
			socket.emit('console', '/ranking - Get your own ranking.');
			socket.emit('console', '/ranking [username] - Get user\'s ranking.');
		}
		if (target === 'all' || target === 'nick')
		{
			matched = true;
			socket.emit('console', '/nick [username] - Change your username.');
		}
		if (target === 'all' || target === 'ban' || target === 'b')
		{
			matched = true;
			socket.emit('console', '/ban OR /b [username] - Kick user from all rooms and ban user\'s IP address. Can be used by: + % @ &');
		}
		if (target === 'all' || target === 'unban')
		{
			matched = true;
			socket.emit('console', '/unban [username] - Unban a user. Can be used by: + % @ &');
		}
		if (target === 'all' || target === 'unbanall')
		{
			matched = true;
			socket.emit('console', '/unbanall - Unban all IP addresses. Can be used by: + % @ &');
		}
		if (target === 'all' || target === 'mute')
		{
			matched = true;
			socket.emit('console', '/mute OR /m [username] - Mute user. Can be used by: + % @ &');
		}
		if (target === 'all' || target === 'unmute')
		{
			matched = true;
			socket.emit('console', '/unmute [username] - Remove mute from user. Can be used by: + % @ &');
		}
		if (target === 'all' || target === 'voice')
		{
			matched = true;
			socket.emit('console', '/voice [username] - Change user\'s group to +. Can be used by: % @ &');
		}
		if (target === 'all' || target === 'devoice')
		{
			matched = true;
			socket.emit('console', '/devoice [username] - Remove user\'s group. Can be used by: % @ &');
		}
		if (target === 'all' || target === 'mod')
		{
			matched = true;
			socket.emit('console', '/mod [username] - Change user\'s group to %. Can be used by: @ &');
		}
		if (target === 'all' || target === 'demod')
		{
			matched = true;
			socket.emit('console', '/demod [username] - Change user\'s group from % to +. Can be used by: @ &');
		}
		if (target === 'all' || target === 'admin')
		{
			matched = true;
			socket.emit('console', '/admin [username] - Change user\'s group to @. Can be used by: @ &');
		}
		if (target === 'all' || target === 'deadmin')
		{
			matched = true;
			socket.emit('console', '/deadmin [username] - Change user\'s group from @ to %. Can be used by: @ &');
		}
		if (target === 'all' || target === 'help' || target === 'h' || target === '?' || target === 'commands')
		{
			matched = true;
			socket.emit('console', '/help OR /h OR /? - Tells you things.');
		}
		if (!matched)
		{
			socket.emit('console', 'Commands: /msg, /reply, /ip, /ranking, /nick, /help');
			socket.emit('console', 'Moderator commands: /ip, /ban, /unban, /unbanall, /mute, /unmute, /voice, /devoice, /mod, /demod, /admin, /deadmin');
			socket.emit('console', 'For details on all commands, use /help all. For details of a specific command, use something like: /help ban');
		}
		return true;
	}
	else if (cmd === 'unbanall')
	{
		if (user.isMod())
		{
			room.add('All bans have been lifted by '+user.name+'.');
			bannedIps = {};
			mutedIps = {};
			return true;
		}
	}
	return false;
}

function Lobby(roomid)
{
	var selfR = this; // a lobby is like a room, selfR makes things simpler
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
	this.numRooms = parseInt(fs.readFileSync('logs/lastbattle.txt')) || 0;
	
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
		var userList = {list: {}, users: 0, guests: 0};
		for (var i in selfR.users)
		{
			if (!selfR.users[i].named)
			{
				userList.guests++;
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
			user.emit('connectionError', 'The server is shutting down. Battles cannot be started at this time.');
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
		selfR.log.push({
			message: message
		});
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
			selfR.log.push({name: user.name, action: 'join'});
			selfR.usersChanged = true;
			selfR.update(user);
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
		if (joining)
		{
			selfR.log.push({name: user.name, action: 'join'});
		}
		delete selfR.users[oldid];
		selfR.users[user.userid] = user;
		selfR.usersChanged = true;
		selfR.update();
		return user;
	};
	this.leave = function(user) {
		if (!user) return; // ...
		delete selfR.users[user.userid];
		selfR.cancelSearch(user, true);
		if (user.named)
		{
			selfR.log.push({name: user.name, action: 'leave'});
		}
		selfR.usersChanged = true;
		selfR.update();
	};
	this.startBattle = function(p1, p2, format, ranked) {
		var newRoom;
		p1 = getUser(p1);
		p2 = getUser(p2);
		
		if (p1 === p2)
		{
			selfR.cancelSearch(p1, true);
			selfR.cancelSearch(p2, true);
			selfR.add('A battle between '+p1.name+' and '+p2.name+' was not started because you can\'t battle your own account. Please use Private Browsing to battle yourself.');
			return;
		}
		
		if (lockdown)
		{
			selfR.cancelSearch(p1, true);
			selfR.cancelSearch(p2, true);
			selfR.add('A battle was not started because the server is shutting down.');
			selfR.update();
			return;
		}
		
		//console.log('BATTLE START BETWEEN: '+p1.userid+' '+p2.userid);
		var i = selfR.numRooms+1;
		while(rooms[selfR.id+'-battle'+i])
		{
			i++;
		}
		selfR.numRooms = i;
		newRoom = selfR.addRoom(selfR.id+'-battle'+i, format, p1, p2, selfR.id, ranked);
		p1.joinRoom(newRoom);
		p2.joinRoom(newRoom);
		newRoom.joinBattle(p1);
		newRoom.joinBattle(p2);
		selfR.log.push({
			name: p1.name,
			name2: p2.name,
			room: newRoom.id,
			format: format,
			action: 'battle'
		});
		selfR.cancelSearch(p1, true);
		selfR.cancelSearch(p2, true);
		selfR.roomsChanged = true;
		selfR.update();
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
		if (!user.named || !message.trim().length) return;
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
		
		if (parseCommand(user, cmd, target, selfR, socket))
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
			youUser.makeChallenge(data.userid, data.format);
			break;
		case 'cancel':
			youUser.cancelChallengeTo(data.userid);
			break;
		case 'accept':
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

