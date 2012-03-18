/* to reload chat commands:

>> for (var i in require.cache) delete require.cache[i];parseCommand = require('./chat-commands.js').parseCommand;''

*/

function toId(text)
{
	text = text || '';
	return text.replace(/ /g, '');
}
function toUserid(name)
{
	return name.toLowerCase().replace(/[^a-z0-9]+/g, '');
}
function sanitize(str, strEscape)
{
	if (!str) str = '';
	str = str.replace(/&/g,'&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	if (strEscape) str = str.replace(/'/g, '\\\'');
	return str;
}

function parseCommandLocal(user, cmd, target, room, socket, message)
{
	cmd = cmd.toLowerCase();
	switch (cmd)
	{
	case 'command':
		if (target.command === 'userdetails')
		{
			var targetUser = getUser(target.userid);
			if (!targetUser || !room) return true;
			var roomList = {};
			for (var i in targetUser.roomCount)
			{
				if (i==='lobby') continue;
				var targetRoom = getRoom(i);
				if (!targetRoom) continue;
				var roomData = {};
				if (targetRoom.battle && targetRoom.battle.sides[0] && targetRoom.battle.sides[1])
				{
					if (targetRoom.battle.sides[0].user && targetRoom.battle.sides[1].user)
					{
						roomData.p1 = targetRoom.battle.sides[0].user.getIdentity();
						roomData.p2 = targetRoom.battle.sides[1].user.getIdentity();
					}
					else if (targetRoom.battle.sides[0].user)
					{
						roomData.p1 = targetRoom.battle.sides[0].user.getIdentity();
					}
					else if (targetRoom.battle.sides[1].user)
					{
						roomData.p1 = targetRoom.battle.sides[1].user.getIdentity();
					}
				}
				roomList[i] = roomData;
			}
			var userdetails = {
				command: 'userdetails',
				userid: targetUser.userid,
				avatar: targetUser.avatar,
				rooms: roomList,
				room: room.id
			};
			if (user.canMod(targetUser.group))
			{
				userdetails.ip = targetUser.ip;
			}
			socket.emit('command', userdetails);
		}
		if (target.command === 'roomlist')
		{
			if (!room || !room.getRoomList) return true;
			socket.emit('command', {
				command: 'roomlist',
				rooms: room.getRoomList(true),
				room: room.id
			});
		}
		return true;
		break;

	case 'me':
		if (!target)
		{
			return true;
		}
		if (canTalk(user, room, socket))
		{
			room.add({
				name: user.getIdentity(),
				act: 1,
				message: target
			});
		}
		return true;
		break;

	case 'forfeit':
	case 'concede':
	case 'surrender':
		if (!room.battle) return;
		if (!room.forfeit(user))
		{
			socket.emit('console', "You can't forfeit this battle.");
		}
		return true;
		break;

	case 'register':
		socket.emit('console', 'You must have a beta key to register.');
		return true;
		break;

	case 'avatar':
		if (!target) return parseCommand(user, 'avatars', '', room, socket);
		var avatar = parseInt(target);
		if (!avatar || avatar > 263 || avatar < 1)
		{
			socket.emit('console', 'Invalid avatar.');
			return true;
		}

		user.avatar = avatar;
		socket.emit('console', 'Avatar changed to:');
		socket.emit('console', {rawMessage: '<img src="/sprites/trainers/'+avatar+'.png" alt="" />'});

		return true;
		break;

	case 'rooms':
		var targetUser = user;
		if (target)
		{
			targetUser = getUser(target);
		}
		if (!targetUser)
		{
			socket.emit('console', 'User '+target+' not found.');
		}
		else
		{
			var output = "";
			var first = true;
			for (var i in targetUser.roomCount)
			{
				if (!first) output += ' | ';
				first = false;

				output += '<a href="/'+i+'" onclick="return selectTab(\''+i+'\');">'+i+'</a>';
			}
			if (!output)
			{
				socket.emit('console', ""+targetUser.name+" is offline.");
			}
			else
			{
				socket.emit('console', {rawMessage: ""+targetUser.name+" is in: "+output});
			}
		}
		return true;
		break;

	case 'altcheck':
	case 'alt':
	case 'alts':
	case 'getalts':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group))
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			var alts = targetUser.getAlts();
			var altGroup = targetUser.getAltGroup();

			socket.emit('console', 'User: '+targetUser.name);

			if (!user.canMod(altGroup))
			{
				return true;
			}

			var output = '';
			for (var i in targetUser.prevNames)
			{
				if (output) output += ", ";
				output += targetUser.prevNames[i];
			}
			if (output) socket.emit('console', 'Previous names: '+output);

			for (var j=0; j<alts.length; j++)
			{
				var targetAlt = getUser(alts[j]);
				if (!targetAlt || !user.canMod(targetAlt.group)) continue;
				if (!targetAlt.named && !targetAlt.connected) continue;

				socket.emit('console', 'Alt: '+targetAlt.name);
				output = '';
				for (var i in targetAlt.prevNames)
				{
					if (output) output += ", ";
					output += targetAlt.prevNames[i];
				}
				if (output) socket.emit('console', 'Previous names: '+output);
			}
			return true;
		}
		socket.emit('console', '/alts - Access denied.');
		return true;
		break;

	case 'whois':
		var targetUser = user;
		if (target)
		{
			targetUser = getUser(target);
		}
		if (!targetUser)
		{
			socket.emit('console', 'User '+target+' not found.');
		}
		else
		{
			socket.emit('console', 'User: '+targetUser.name);
			switch (targetUser.group)
			{
			case '&':
				socket.emit('console', 'Group: System Operator (&)');
				break;
			case '@':
				socket.emit('console', 'Group: Administrator (@)');
				break;
			case '%':
				socket.emit('console', 'Group: Moderator (%)');
				break;
			case '+':
				socket.emit('console', 'Group: Voiced (+)');
				break;
			}
			if (!targetUser.authenticated)
			{
				socket.emit('console', '(Unregistered)');
			}
			if (user.canMod(targetUser.group))
			{
				socket.emit('console', 'IP: '+targetUser.ip);
			}
			var output = 'In rooms: ';
			var first = true;
			for (var i in targetUser.roomCount)
			{
				if (!first) output += ' | ';
				first = false;

				output += '<a href="/'+i+'" onclick="return selectTab(\''+i+'\');">'+i+'</a>';
			}
			socket.emit('console', {rawMessage: output});
		}
		return true;
		break;

	case 'ban':
	case 'b':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group))
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			room.add(""+targetUser.name+" was banned by "+user.name+".");
			var alts = targetUser.getAlts();
			if (alts.length) room.add(""+targetUser.name+"'s alts were also banned: "+alts.join(", "));

			targetUser.ban();
			return true;
		}
		socket.emit('console', '/ban - Access denied.');
		return true;
		break;

	case 'banredirect':
	case 'br':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targets = splitTarget(target);
			var targetUser = targets[0];
			if (!targetUser)
			{
				socket.emit('console', 'User '+targets[2]+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group))
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			if (targets[1].substr(0,2) == '~~')
			{
				targets[1] = '/'+targets[1];
			}
			else if (targets[1].substr(0,7) !== 'http://' && targets[1].substr(0,8) !== 'https://' && targets[1].substr(0,1) !== '/')
			{
				targets[1] = 'http://'+targets[1];
			}

			room.add(''+targetUser.name+' was banned by '+user.name+' and redirected to: '+targets[1]);

			targetUser.emit('console', {evalRawMessage: 'window.location.href="'+targets[1]+'"'});
			targetUser.ban();
			return true;
		}
		socket.emit('console', '/banredirect - Access denied.');
		return true;
		break;

	case 'redirect':
	case 'redir':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targets = splitTarget(target);
			var targetUser = targets[0];
			if (!targetUser)
			{
				socket.emit('console', 'User '+targets[2]+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group) && user !== targetUser)
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			if (targets[1].substr(0,2) == '~~')
			{
				targets[1] = '/'+targets[1];
			}
			else if (targets[1].substr(0,7) !== 'http://' && targets[1].substr(0,8) !== 'https://' && targets[1].substr(0,1) !== '/')
			{
				targets[1] = 'http://'+targets[1];
			}

			room.add(''+targetUser.name+' was redirected by '+user.name+' to: '+targets[1]);
			targetUser.emit('console', {evalRawMessage: 'window.location.href="'+targets[1]+'"'});
			return true;
		}
		socket.emit('console', '/redirect - Access denied.');
		return true;
		break;

	case 'unban':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targetid = toUserid(target);
			var success = false;

			for (var ip in bannedIps)
			{
				if (bannedIps[ip] === targetid)
				{
					delete bannedIps[ip];
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
			return true;
		}
		socket.emit('console', '/unban - Access denied.');
		return true;
		break;

	case 'unbanall':
		if (user.isMod())
		{
			room.add('All bans have been lifted by '+user.name+'.');
			bannedIps = {};
			mutedIps = {};
			return true;
		}
		socket.emit('console', '/unbanall - Access denied.');
		return true;
		break;

	case 'reply':
	case 'r':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (!user.lastPM)
		{
			socket.emit('console', 'No one has PMed you yet.');
			return true;
		}
		return parseCommand(user, 'msg', ''+(user.lastPM||'')+', '+target, room, socket);
		break;

	case 'msg':
	case 'pm':
	case 'whisper':
	case 'w':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targets[1])
		{
			socket.emit('console', 'You forgot the comma.');
			return parseCommand(user, '?', cmd, room, socket);
		}
		if (!targets[0])
		{
			if (target.indexOf(' '))
			{
				socket.emit('console', 'User '+targets[2]+' not found. Did you forget a comma?');
			}
			else
			{
				socket.emit('console', 'User '+targets[2]+' not found. Did you misspell their name?');
			}
			return parseCommand(user, '?', cmd, room, socket);
		}

		var message = {
			name: user.getIdentity(),
			pm: targetUser.getIdentity(),
			message: targets[1]
		};
		user.emit('console', message);
		targets[0].emit('console', message);
		targets[0].lastPM = user.userid;
		user.lastPM = targets[0].userid;
		return true;
		break;

	case 'ip':
	case 'getip':
		if (!target)
		{
			socket.emit('console', 'Your IP is: '+user.ip);
			return true;
		}
		if (user.group === '&' || user.group === '@' || user.group === '%')
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
			return true;
		}
		socket.emit('console', '/ip - Access denied.');
		return true;
		break;

	case 'mute':
	case 'm':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group))
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			room.add(''+targetUser.name+' was muted by '+user.name+'.');
			var alts = targetUser.getAlts();
			if (alts.length) room.add(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));

			targetUser.muted = true;
			for (var i=0; i<alts.length; i++)
			{
				var targetAlt = getUser(alts[i]);
				if (targetAlt) targetAlt.muted = true;
			}

			rooms.lobby.usersChanged = true;
			return true;
		}
		socket.emit('console', '/mute - Access denied.');
		return true;
		break;

	case 'ipmute':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group))
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			room.add(''+targetUser.name+"'s IP was muted by "+user.name+'.');
			var alts = targetUser.getAlts();
			if (alts.length) room.add(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));

			targetUser.muted = true;
			mutedIps[targetUser.ip] = targetUser.userid;
			for (var i=0; i<alts.length; i++)
			{
				var targetAlt = getUser(alts[i]);
				if (targetAlt) targetAlt.muted = true;
			}

			rooms.lobby.usersChanged = true;
			return true;
		}
		socket.emit('console', '/mute - Access denied.');
		return true;
		break;

	case 'unmute':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targetid = toUserid(target);
			var targetUser = getUser(target);

			var success = false;

			for (var ip in mutedIps)
			{
				if (mutedIps[ip] === targetid)
				{
					delete mutedIps[ip];
					if (!success)
					{
						room.add(''+(targetUser?targetUser.name:target)+"'s IP was unmuted by "+user.name+'.');
						success = true;
					}
				}
			}

			if (!targetUser && !success)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			else if (targetUser)
			{
				if (!user.canMod(targetUser.group))
				{
					socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
					return true;
				}

				room.add(''+targetUser.name+' was unmuted by '+user.name+'.');
			}

			targetUser.muted = false;
			rooms.lobby.usersChanged = true;
			return true;
		}
		socket.emit('console', '/unmute - Access denied.');
		return true;
		break;

	case 'voice':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group) || user.group === '+')
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			room.add(''+targetUser.name+' was voiced by '+user.name+'.');

			targetUser.group = '+';
			rooms.lobby.usersChanged = true;
			return true;
		}
		socket.emit('console', '/voice - Access denied.');
		return true;
		break;

	case 'devoice':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod())
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group) || user.group === '+')
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			room.add(''+targetUser.name+' was devoiced by '+user.name+'.');

			targetUser.group = ' ';
			rooms.lobby.usersChanged = true;
			return true;
		}
		socket.emit('console', '/devoice - Access denied.');
		return true;
		break;

	case 'mod':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod() && (user.group === '&' || user.group === '@'))
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group))
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			if (targetUser.group === '@' || targetUser.group === '&')
			{
				room.add(''+targetUser.name+' was demoted to moderator by '+user.name+'.');
			}
			else
			{
				room.add(''+targetUser.name+' was promoted to moderator by '+user.name+'.');
			}
			targetUser.group = '%';
			rooms.lobby.usersChanged = true;
			return true;
		}
		socket.emit('console', '/mod - Access denied.');
		return true;
		break;

	case 'demod':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod() && (user.group === '&' || user.group === '@'))
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group))
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			room.add(''+targetUser.name+' was demoted to voice by '+user.name+'.');

			targetUser.group = '+';
			rooms.lobby.usersChanged = true;
			return true;
		}
		socket.emit('console', '/demod - Access denied.');
		return true;
		break;

	case 'admin':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod() && (user.group === '&' || user.group === '@'))
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group))
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			if (targetUser.group === '&')
			{
				room.add(''+targetUser.name+' was demoted to admin by '+user.name+'.');
			}
			else
			{
				room.add(''+targetUser.name+' was promoted to admin by '+user.name+'.');
			}
			targetUser.group = '@';
			rooms.lobby.usersChanged = true;
			return true;
		}
		socket.emit('console', '/admin - Access denied.');
		return true;
		break;

	case 'deadmin':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.isMod() && (user.group === '&' || user.group === '@'))
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}
			if (!user.canMod(targetUser.group))
			{
				socket.emit('console', 'User '+targetUser.name+' is out of your jurisdiction.');
				return true;
			}

			room.add(''+targetUser.name+' was demoted to moderator by '+user.name+'.');

			if (targetUser.group === '@')
			{
				targetUser.group = '%';
				rooms.lobby.usersChanged = true;
			}
			return true;
		}
		socket.emit('console', 'Access denied.');
		return true;
		break;

	case 'sysop':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.group === '&')
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}

			room.add(''+targetUser.name+' was promoted to sysop by '+user.name+'.');
			targetUser.group = '&';
			rooms.lobby.usersChanged = true;
			return true;
		}
		socket.emit('console', 'Access denied.');
		return true;
		break;

	case 'desysop':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.group === '&')
		{
			var targetUser = getUser(target);
			if (!targetUser)
			{
				socket.emit('console', 'User '+target+' not found.');
				return true;
			}

			if (targetUser.group === '&')
			{
				room.add(''+targetUser.name+' was demoted to admin by '+user.name+'.');
				targetUser.group = '@';
				rooms.lobby.usersChanged = true;
			}
			else
			{
				socket.emit('console', ''+targetUser.name+' is not a sysop.');
			}
			return true;
		}
		socket.emit('console', 'Access denied.');
		return true;
		break;

	case 'modchat':
		if (!target)
		{
			socket.emit('console', 'Moderated chat is currently set to: '+config.modchat);
			return true;
		}
		if (user.group === '&' || user.group === '@')
		{
			target = target.toLowerCase();
			switch (target)
			{
			case 'on':
			case 'true':
			case 'yes':
				config.modchat = true;
				break;
			case 'off':
			case 'false':
			case 'no':
				config.modchat = false;
				break;
			case '+':
			case '%':
			case '@':
			case '&':
				config.modchat = target;
				break;
			default:
				socket.emit('console', 'That moderated chat setting is unrecognized.');
				return true;
				break;
			}
			if (config.modchat === true)
			{
				room.addRaw('<div style="background-color:#BB6655;color:white;padding:2px 4px"><b>Moderated chat was enabled!</b><br />Only registered users and users of rank + and higher can talk.</div>');
			}
			else if (!config.modchat)
			{
				room.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><b>Moderated chat was disabled!</b><br />Anyone may talk now.</div>');
			}
			else
			{
				var modchat = config.modchat;
				if (modchat === '&') modchat = '&amp;';
				room.addRaw('<div style="background-color:#AA6655;color:white;padding:2px 4px"><b>Moderated chat was set to '+modchat+'!</b><br />Only users of rank '+modchat+' and higher can talk.</div>');
			}
			return true;
		}
		socket.emit('console', '/modchat - Access denied.');
		return true;
		break;

	case 'announce':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.group === '&' || user.group === '@')
		{
			target = target.replace(/\[\[([A-Za-z0-9-]+)\]\]/, '<button onclick="selectTab(\'$1\');return false">Go to $1</button>');
			room.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><b>'+target+'</b></div>');
			return true;
		}
		socket.emit('console', '/announce - Access denied.');
		return true;
		break;

	case 'hotpatch':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.group === '&')
		{
			if (target === 'all')
			{
				for (var i in require.cache) delete require.cache[i];
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
				BattleTools = require('./tools.js').BattleTools;
				Tools = new BattleTools();

				parseCommand = require('./chat-commands.js').parseCommand;

				sim = require('./simulator.js');
				BattlePokemon = sim.BattlePokemon;
				BattleSide = sim.BattleSide;
				Battle = sim.Battle;

				tournamentBuilder = require('./tournament-builder.js');
                TournamentBuilder = tournamentBuilder.TournamentBuilder;
                TournamentBuilderBattle = tournamentBuilder.TournamentBuilderBattle;
                TournamentBuilderTree = tournamentBuilder.TournamentBuilderTree;
                TournamentBuilderTreeNode = tournamentBuilder.TournamentBuilderTreeNode;
                TournamentBuilderTreeNodeType = tournamentBuilder.TournamentBuilderTreeNodeType;
                TournamentBuilderTreeNodeBattleData = tournamentBuilder.TournamentBuilderTreeNodeBattleData;
                TournamentBuilderTreeNodeBattleDataBattleStatus = tournamentBuilder.TournamentBuilderTreeNodeBattleDataBattleStatus;
                Tournament = require('./tournament.js').Tournament;

				socket.emit('console', 'The game engine has been hot-patched.');
				return true;
			}
			else if (target === 'data')
			{
				for (var i in require.cache) delete require.cache[i];
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
				BattleTools = require('./tools.js').BattleTools;
				Tools = new BattleTools();
				socket.emit('console', 'Game resources have been hot-patched.');
				return true;
			}
			else if (target === 'chat')
			{
				for (var i in require.cache) delete require.cache[i];
				parseCommand = require('./chat-commands.js').parseCommand;
				socket.emit('console', 'Chat commands have been hot-patched.');
				return true;
			}
			socket.emit('console', 'Your hot-patch command was unrecognized.');
			return true;
		}
		socket.emit('console', '/hotpatch - Access denied.');
		return true;
		break;

	case 'rating':
	case 'ranking':
	case 'rank':
	case 'ladder':
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
		break;

	case 'nick':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		user.rename(target);
		return true;
		break;

	case 'forcerename':
	case 'fr':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		var targets = splitTarget(target);
		var targetUser = targets[0];
		if (!targetUser)
		{
			socket.emit('console', 'User '+targets[2]+' not found.');
			return true;
		}
		if (targetUser && user.canMod(targetUser.group))
		{
			if (targets[1])
			{
				room.add(''+targetUser.name+' was forcibly renamed to '+targets[1]+' by '+user.name+'.');
				targetUser.forceRename(targets[1]);
			}
			else if (targetUser.userid === toUserid(targets[2]))
			{
				room.add(''+targetUser.name+' was forced to choose a new name by '+user.name+'.');
				targetUser.resetName();
				targetUser.emit('nameTaken', {reason: "Please choose a different name."});
			}
			else
			{
				socket.emit('console', "User "+targetUser.name+" is no longer using that name.");
			}
		}
		return true;
		break;

	// TOURNAMENT COMMANDS

	case 'tour':
	case 'tournament':
	case 'starttour':
	case 'starttournament':
		if (user.group === '+' || user.isMod())
		{
		    if (!target) return parseCommand(user, '?', cmd, room, socket);
    		var args = splitArgs(target);
    		if (args.length < 3)
    		    return parseCommand(user, '?', cmd, room, socket);
		    if (args[0].length < 2)
	        {
		        socket.emit('console', "/" + cmd + " - Tournament name too short.");
		        return true;
	        }
            if (currentTournaments[args[0]] !== undefined)
            {
                socket.emit('console', "/" + cmd + " - That tournament name already is in use.");
                return true;
            }
	        switch (args[1])
	        {
	            case "BalancedHackmons" :
	            case "OU" :
	            case "UU" :
	            case "RU" :
	            case "NU" :
	                break;

                default :
                {
                    socket.emit('console', "/" + cmd + " - Invalid metagame.");
                    return true;
                }
	        }

	        try
	        {
	            var tournament = new Object();
	            tournament.tournament = new Tournament(args[0], args[1], rooms, rooms.lobby, parseInt(args[2]));
	            tournament.host = user;
	            currentTournaments[args[0]] = tournament;
            } catch (e)
            {
                switch (e)
                {
                    case "MaxParticipantsTooLowException" :
                        socket.emit('console', "/" + cmd + " - The maximum number of participants must be at least 2.");
                        break;

                    default :
                        throw e;
                }
            }
		}
		else
		    socket.emit('console', "/" + cmd + " - Access denied.");
	    return true;

    case 'deletetour':
    case 'deletetournament':
    case 'endtour':
    case 'endtournament':
        // Fallthrough

    case 'toursetmaxparticipants':
    case 'tournamentsetmaxparticipants':
        // Fallthrough

    case 'tourstartautopilot':
    case 'tournamentstartautopilot':
        // Fallthrough

    case 'tourstopautopilot':
    case 'tournamentstopautopilot':
        // Fallthrough

    case 'tourstartnextbattle':
    case 'tournamentstartnextbattle':
        // Fallthrough

    case 'toursetactionondraw':
    case 'tournamentsetactionondraw':
        // Fallthrough

    case 'tourrebuildtree':
    case 'tournamentrebuildtree':
		if (user.group !== '+' && !user.isMod())
		{
		    socket.emit('console', "/" + cmd + " - Access denied.");
		    return true;
	    }
        var isPriviledged = true;
	    // Fallthrough

    case 'join':
    case 'jointournament':
        // Fallthrough

    case 'leave':
    case 'leavetournament':
        // Fallthrough

    case 'tourgettree':
    case 'tournamentgettree':
        // Fallthrough

    case 'tourgetwinner':
    case 'tournamentgetwinner':
        if (!target) return parseCommand(user, '?', cmd, room, socket);
        var args = splitArgs(target);
        if (args.length < 1)
		    return parseCommand(user, '?', cmd, room, socket);
	    if (args[0].length < 2)
        {
	        socket.emit('console', "/" + cmd + " - Tournament name too short.");
	        return true;
        }
        if (currentTournaments[args[0]] === undefined)
        {
	        socket.emit('console', "/" + cmd + " - No such tournament.");
	        return true;
        }
        if (isPriviledged && user !== currentTournaments[args[0]].host && !user.canMod(currentTournaments[args[0]].host))
        {
            socket.emit('console', "/" + cmd + " - You cannot moderate this tournament.");
            return true;
        }
        switch (cmd)
        {
            case "deletetour" :
            case "deletetournament" :
            case "endtour" :
            case "endtournament" :
	            delete currentTournaments[args[0]];
	            for (var r in rooms)
	                rooms[r].addRaw("<div class=\"tournament-message\">The tournament named \"" + args[0] + "\" has ended.</div>");
	            break;

            case "toursetmaxparticipants" :
            case "tournamentsetmaxparticipants" :
                if (args.length < 2)
		            return parseCommand(user, '?', cmd, room, socket);
                currentTournaments[args[0]].tournament.setMaxParticipants(args[1], socket);
                break;

            case "tourstartautopilot" :
            case "tournamentstartautopilot" :
                currentTournaments[args[0]].tournament.startAutopilot(socket);
                break;

            case "tourstopautopilot" :
            case "tournamentstopautopilot" :
                currentTournaments[args[0]].tournament.stopAutopilot(socket);
                break;

            case "tourstartnextbattle" :
            case "tournamentstartnextbattle" :
                currentTournaments[args[0]].tournament.startNextBattle(socket);
                break;

            case "toursetactionondraw" :
            case "tournamentsetactionondraw" :
                if (args.length < 2)
		            return parseCommand(user, '?', cmd, room, socket);
	            currentTournaments[args[0]].tournament.setActionOnDraw(args[1], socket);
	            break;

            case "tourrebuildtree" :
            case "tournamentrebuildtree" :
                currentTournaments[args[0]].tournament.rebuildTree(socket);
                break;

            case "join" :
            case "jointournament" :
                currentTournaments[args[0]].tournament.addParticipant(user, socket);
                break;

            case "leave" :
            case "leavetournament" :
                currentTournaments[args[0]].tournament.removeParticipant(user, socket);
                break;

            case "tourgettree" :
            case "tournamentgettree" :
                currentTournaments[args[0]].tournament.getTree(socket, socket);
                break;

            case "tourgetwinner" :
            case "tournamentgetwinner" :
                currentTournaments[args[0]].tournament.getWinner(socket, socket);
                break;
        }
        return true;

	// INFORMATIONAL COMMANDS

    case 'gettours':
    case '!gettours':
    case 'gettournaments':
    case '!gettournaments':
	    showOrBroadcastStart(user, cmd, room, socket, message);
        if (Object.keys(currentTournaments).length === 0)
            showOrBroadcast(user, cmd, room, socket, "There are currently no tournaments running.");
        else
        {
            for (var t in currentTournaments)
            {
                var output = currentTournaments[t].tournament.getMetagame() + ": ";
                output += t;
                output += " (" + currentTournaments[t].tournament.getParticipants().length + "/" + currentTournaments[t].tournament.getMaxParticipants() + ")";
                if (currentTournaments[t].tournament.getParticipants().length >= currentTournaments[t].tournament.getMaxParticipants())
                    output += " [FULL]";
                if (currentTournaments[t].tournament.getParticipants().length > currentTournaments[t].tournament.getMaxParticipants())
                    output += " [GLITCHED. PLEASE REPORT TO A MODERATOR]";
                if (currentTournaments[t].tournament.getIsJoiningLocked())
                    output += " [IN PROGRESS/LOCKED]";
                if (output[output.length - 1] !== ']')
                    output += " [OPEN]";
                output += " (Host: " + currentTournaments[t].host.getIdentity() + ")";
		        showOrBroadcast(user, cmd, room, socket, output);
            }
        }
        return true;

    case 'tourgetparticipants':
    case '!tourgetparticipants':
    case 'tournamentgetparticipants':
    case '!tournamentgetparticipants':
	    showOrBroadcastStart(user, cmd, room, socket, message);
        if (!target) return parseCommand(user, '?', "tourgetparticipants", room, socket);
        var args = splitArgs(target);
        if (args.length < 1)
		    return parseCommand(user, '?', "tourgetparticipants", room, socket);
	    if (args[0].length < 2)
        {
	        showOrBroadcast(user, cmd, room, socket, "Tournament name too short.");
	        return true;
        }
        if (currentTournaments[args[0]] === undefined)
        {
	        showOrBroadcast(user, cmd, room, socket, "No such tournament.");
	        return true;
        }
        var participants = currentTournaments[args[0]].tournament.getParticipants();
        for (var p in participants)
        {
            var output = participants[p].getIdentity();
            if (!participants[p].connected)
                output += " [NOT ONLINE]";
            showOrBroadcast(user, cmd, room, socket, output);
        }
	    return true;

	case 'data':
	case '!data':
	case 'stats':
	case '!stats':
		if (room.type !== 'lobby' && cmd.substr(0,1) === '!')
		{
			socket.emit('console', {rawMessage: '<code>!data</code> can only be used in the lobby.'});
			return true;
		}

		showOrBroadcastStart(user, cmd, room, socket, message);
		var dataMessages = getDataMessage(target);
		for (var i=0; i<dataMessages.length; i++)
		{
			if (cmd.substr(0,1) !== '!')
			{
				socket.emit('console', dataMessages[i]);
			}
			else if (user.group !== ' ' && canTalk(user, room))
			{
				room.add(dataMessages[i]);
			}
		}
		return true;
		break;

	case 'groups':
	case '!groups':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div style="border:1px solid #6688AA;padding:2px 4px">' +
			'+ <b>Voice</b> - They can use ! commands like !groups, and talk during moderated chat<br />' +
			'% <b>Moderator</b> - The above, and they can also ban/mute users<br />' +
			'@ <b>Administrator</b> - The above, and they can promote moderators and enable moderated chat<br />' +
			'&amp; <b>System operator</b> - They can do anything, like change what this message says'+
			'</div>');
		return true;
		break;

	case 'opensource':
	case '!opensource':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div style="border:1px solid #6688AA;padding:2px 4px">Showdown is open source:<br />- Language: JavaScript<br />- <a href="https://github.com/Zarel/Pokemon-Showdown/commits/master" target="_blank">What\'s new?</a><br />- <a href="https://github.com/Zarel/Pokemon-Showdown" target="_blank">Source code</a></div>');
		return true;
		break;

	case 'avatars':
	case '!avatars':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div style="border:1px solid #6688AA;padding:2px 4px">Want a custom avatar?<br />- <a href="/sprites/trainers/" target="_blank">How to change your avatar</a></div>');
		return true;
		break;

	case 'intro':
	case 'introduction':
	case '!intro':
	case '!introduction':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div style="border:1px solid #6688AA;padding:2px 4px">New to competitive pokemon?<br />' +
			'- <a href="http://www.smogon.com/dp/articles/intro_comp_pokemon" target="_blank">An introduction to competitive pokemon</a><br />' +
			'- <a href="http://www.smogon.com/bw/articles/bw_tiers" target="_blank">What do "OU", "UU", etc mean?</a><br />' +
			'- <a href="http://www.smogon.com/bw/banlist/" target="_blank">What are the rules for each format? What is "Sleep Clause"?</a>' +
			'</div>');
		return true;
		break;

	case 'rules':
	case 'rule':
	case '!rules':
	case '!rule':
		showOrBroadcastStart(user, cmd, room, socket, message);
		showOrBroadcast(user, cmd, room, socket,
			'<div style="border:1px solid #6688AA;padding:2px 4px">We follow Smogon\'s simulator rules:<br />' +
			'- <a href="http://www.smogon.com/sim/rules" target="_blank">Smogon\'s simulator rules</a><br />' +
			'</div>');
		return true;
		break;

	// Battle commands

	case 'reset':
	case 'restart':
		// These commands used to be:
		//   selfR.requestReset(user);
		//   selfR.battleEndRestart(user);
		// but are currently unused
		socket.emit('console', 'This functionality is no longer available.');
		return true;

	case 'kickinactive':
		if (room.requestKickInactive)
		{
			room.requestKickInactive(user);
		}
		else
		{
			socket.emit('console', 'You can only kick inactive players from inside a room.');
		}
		return true;

	case 'forcereset':
		if (user.group !== '@' && user.group !== '&')
		{
			socket.emit('console', '/forcereset - Access denied.');
		}
		else if (room.reset)
		{
			room.reset();
		}
		else
		{
			socket.emit('console', 'You can only force-reset from inside a room.');
		}
		return true;

	case 'a':
		if (user.group === '&')
		{
			// secret sysop command
			room.battle.add(target);
			return true;
		}

	// Admin commands

	case 'forcewin':
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
		break;

	case 'potd':
		if (user.group !== '&' && user.group !== '@') return true;

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
		break;

	case 'lockdown':
		if (user.group === '&')
		{
			lockdown = true;
			for (var id in rooms)
			{
				rooms[id].addRaw('<div style="background-color:#AA5544;color:white;padding:2px 4px"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>');
			}
		}
		return true;
		break;

	case 'endlockdown':
		if (user.group === '&')
		{
			lockdown = false;
			for (var id in rooms)
			{
				rooms[id].addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><b>The server shutdown was canceled.</b></div>');
			}
		}
		return true;
		break;

	case 'loadbanlist':
		if (user.group === '&')
		{
			socket.emit('console', 'loading');
			fs.readFile('config/ipbans.txt', function (err, data) {
				if (err) return;
				data = (''+data).split("\n");
				for (var i=0; i<data.length; i++)
				{
					if (data[i]) bannedIps[data[i]] = '#ipban';
				}
				socket.emit('console', 'banned '+i+' ips');
			});
		}
		return true;
		break;

	case 'crashfixed':
		if (user.group === '&')
		{
			lockdown = false;
			config.modchat = false;
			rooms.lobby.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><b>We fixed the crash without restarting the server!</b><br />You may resume talking in the lobby and starting new battles.</div>');
		}
		return true;
		break;

	case 'help':
	case 'commands':
	case 'h':
	case '?':
		target = target.toLowerCase();
		var matched = false;
		if (target === 'all' || target === 'msg' || target === 'pm' || cmd === 'whisper' || cmd === 'w')
		{
			matched = true;
			socket.emit('console', '/msg OR /whisper OR /w [username], [message] - Send a private message.');
		}
		if (target === 'all' || target === 'r' || target === 'reply')
		{
			matched = true;
			socket.emit('console', '/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.');
		}
		if (target === 'all' || target === 'getip' || target === 'ip')
		{
			matched = true;
			socket.emit('console', '/ip - Get your own IP address.');
			socket.emit('console', '/ip [username] - Get a user\'s IP address. Requires: % @ &');
		}
		if (target === 'all' || target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder')
		{
			matched = true;
			socket.emit('console', '/rating - Get your own rating.');
			socket.emit('console', '/rating [username] - Get user\'s rating.');
		}
		if (target === 'all' || target === 'nick')
		{
			matched = true;
			socket.emit('console', '/nick [new username] - Change your username.');
		}
		if (target === 'all' || target === 'avatar')
		{
			matched = true;
			socket.emit('console', '/avatar [new avatar number] - Change your trainer sprite.');
		}
		if (target === 'all' || target === 'rooms')
		{
			matched = true;
			socket.emit('console', '/rooms [username] - Show what rooms a user is in.');
		}
		if (target === 'all' || target === 'whois')
		{
			matched = true;
			socket.emit('console', '/whois [username] - Get details on a username: group, and rooms.');
		}
		if (target === 'all' || target === 'data')
		{
			matched = true;
			socket.emit('console', '/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability.');
			socket.emit('console', '!data [pokemon/item/move/ability] - Show everyone these details. Requires: + % @ &');
		}
		if (target === 'all' || target === 'groups')
		{
			matched = true;
			socket.emit('console', '/groups - Explains what the + % @ & next to people\'s names mean.');
			socket.emit('console', '!groups - Show everyone that information. Requires: + % @ &');
		}
		if (target === 'all' || target === 'opensource')
		{
			matched = true;
			socket.emit('console', '/opensource - Links to PS\'s source code repository.');
			socket.emit('console', '!opensource - Show everyone that information. Requires: + % @ &');
		}
		if (target === 'all' || target === 'avatars')
		{
			matched = true;
			socket.emit('console', '/avatars - Explains how to change avatars.');
			socket.emit('console', '!avatars - Show everyone that information. Requires: + % @ &');
		}
		if (target === 'all' || target === 'intro')
		{
			matched = true;
			socket.emit('console', '/intro - Provides an introduction to competitive pokemon.');
			socket.emit('console', '!intro - Show everyone that information. Requires: + % @ &');
		}
		if (target === 'all' || target === 'gettours' || target === 'gettournaments')
		{
		    matched = true;
		    socket.emit('console', '/getTours OR /getTournaments - Gets the currently running tournaments.');
		    socket.emit('console', '!getTours OR !getTournaments - Show everyone that information. Requires: + % @ &');
		}
		if (target === 'all' || target === 'tourgetparticipants' || target === 'tournamentgetparticipants')
		{
		    matched = true;
		    socket.emit('console', '/tourGetParticipants OR /tournamentGetParticipants [name] - Get the participants of the tournament named [name].');
		    socket.emit('console', '!tourGetParticipants OR !tournamentGetParticipants [name] - Show everyone that information. Requires: + % @ &');
		}
		if (target === 'all' || target === 'tournaments' || target === 'tour' || target === 'tournament' || target === 'starttour' || target === 'starttournament')
		{
		    matched = true;
		    socket.emit('console', '/tour OR /tournament OR /startTour OR /startTournament [name], [metagame], [maximum participants] - Starts a new tournament. Requires: + % @ &');
		}
		if (target === 'all' || target === 'tournaments' || target === 'join' || target === 'jointournament')
		{
		    matched = true;
		    socket.emit('console', '/join OR /joinTournament [name] - Join the tournament named [name].');
		}
		if (target === 'all' || target === 'tournaments' || target === 'leave' || target === 'leavetournament')
		{
		    matched = true;
		    socket.emit('console', '/leave OR /leaveTournament [name] - Leave the tournament named [name].');
		}
		if (target === 'all' || target === 'tournaments' || target === 'tourgettree' || target === 'tournamentgettree')
		{
		    matched = true;
		    socket.emit('console', '/tourGetTree OR /tournamentGetTree [name] - Gets the current tree for the tournament named [name]');
		}
		if (target === 'all' || target === 'tournaments' || target === 'toursetmaxparticipants' || target === 'tournamentsetmaxparticipants')
		{
		    matched = true;
		    socket.emit('console', '/tourSetMaxParticipants OR /tournamentSetMaxParticipants [name], [maximum participants] - Sets the maximum number of participants for tournament [name]. Requires: + % @ &');
		}
		if (target === 'all' || target === 'tournaments' || target === 'tourstartautopilot' || target === 'tournamentstartautopilot')
		{
		    matched = true;
		    socket.emit('console', '/tourStartAutopilot OR /tournamentStartAutopilot [name] - Starts the autopilot for tournament [name] and locks joining and leaving it. Requires: + % @ &');
		}
		if (target === 'all' || target === 'tournaments' || target === 'tourstopautopilot' || target === 'tournamentstopautopilot')
		{
		    matched = true;
		    socket.emit('console', '/tourStopAutopilot OR /tournamentStopAutopilot [name] - Stops the autopilot for tournament [name] but does not unlock it. Requires: + % @ &');
		}
		if (target === 'all' || target === 'tournaments' || target === 'tourstartnextbattle' || target === 'tournamentstartnextbattle')
		{
		    matched = true;
		    socket.emit('console', '/tourStartNextBattle OR /tournamentStartNextBattle [name] - Starts the next battle of tournament [name] and locks joining and leaving it. Requires: + % @ &');
		}
		if (target === 'all' || target === 'tournaments' || target === 'toursetactionondraw' || target === 'tournamentsetactionondraw')
		{
		    matched = true;
		    socket.emit('console', '/tourSetActionOnDraw OR /tournamentSetActionOnDraw [name], [action] - Sets the action (rematch OR bye) on a battle that draws in tournament [name] (Default: rematch). Requires: + % @ &');
		}
		if (target === 'all' || target === 'tournaments' || target === 'tourgetwinner' || target === 'tournamentgetwinner')
		{
		    matched = true;
		    socket.emit('console', '/tourGetWinner OR /tournamentGetWinner [name] - Gets the winner of the tournament named [name].');
		}
		if (target === 'all' || target === 'tournaments' || target === 'tourrebuildtree' || target === 'tournamentrebuildtree')
		{
		    matched = true;
		    socket.emit('console', '/tourRebuildTree OR /tournamentRebuildTree [name] - Rebuilds the tournament tree for tournament [name], allowing reuse of the tournament without adding or removing users. Requires: + % @ &');
		}
		if (target === 'all' || target === 'tournaments' || target === 'deletetour' || target === 'deletetournament' || target === 'endtour' || target === 'endtournament')
		{
		    matched = true;
		    socket.emit('console', '/deleteTour OR /deleteTournament OR /endTour OR /endTournament [name] - Deletes the tournament named [name]. Requires: + % @ &');
		}
		if (target === '%' || target === 'altcheck' || target === 'alt' || target === 'alts' || target === 'getalts')
		{
			matched = true;
			socket.emit('console', '/alts [username] - Get a user\'s alts. Requires: % @ &');
		}
		if (target === '%' || target === 'forcerename' || target === 'fr')
		{
			matched = true;
			socket.emit('console', '/forcerename OR /fr [username] - Force a user to choose a new name. Requires: % @ &');
			socket.emit('console', '/forcerename OR /fr [username], [new name] - Forcibly change a user\'s name to [new name]. Requires: % @ &');
		}
		if (target === '%' || target === 'ban' || target === 'b')
		{
			matched = true;
			socket.emit('console', '/ban OR /b [username] - Kick user from all rooms and ban user\'s IP address. Requires: % @ &');
		}
		if (target === '%' || target === 'unban')
		{
			matched = true;
			socket.emit('console', '/unban [username] - Unban a user. Requires: % @ &');
		}
		if (target === '%' || target === 'unbanall')
		{
			matched = true;
			socket.emit('console', '/unbanall - Unban all IP addresses. Requires: % @ &');
		}
		if (target === '%' || target === 'mute' || target === 'm')
		{
			matched = true;
			socket.emit('console', '/mute OR /m [username] - Mute user. Requires: % @ &');
		}
		if (target === '%' || target === 'unmute')
		{
			matched = true;
			socket.emit('console', '/unmute [username] - Remove mute from user. Requires: % @ &');
		}
		if (target === '%' || target === 'voice')
		{
			matched = true;
			socket.emit('console', '/voice [username] - Change user\'s group to +. Requires: % @ &');
		}
		if (target === '%' || target === 'devoice')
		{
			matched = true;
			socket.emit('console', '/devoice [username] - Remove user\'s group. Requires: % @ &');
		}
		if (target === '@' || target === 'mod')
		{
			matched = true;
			socket.emit('console', '/mod [username] - Change user\'s group to %. Requires: @ &');
		}
		if (target === '@' || target === 'demod')
		{
			matched = true;
			socket.emit('console', '/demod [username] - Change user\'s group from % to +. Requires: @ &');
		}
		if (target === '@' || target === 'admin')
		{
			matched = true;
			socket.emit('console', '/admin [username] - Change user\'s group to @. Requires: @ &');
		}
		if (target === '@' || target === 'deadmin')
		{
			matched = true;
			socket.emit('console', '/deadmin [username] - Change user\'s group from @ to %. Requires: @ &');
		}
		if (target === '&' || target === 'sysop')
		{
			matched = true;
			socket.emit('console', '/sysop [username] - Change user\'s group to &. Requires: &');
		}
		if (target === '&' || target === 'desysop')
		{
			matched = true;
			socket.emit('console', '/desysop [username] - Change user\'s group from & to @. Requires: &');
		}
		if (target === '@' || target === 'announce')
		{
			matched = true;
			socket.emit('console', '/announce [message] - Make an announcement. Requires: @ &');
		}
		if (target === '@' || target === 'modchat')
		{
			matched = true;
			socket.emit('console', '/modchat [on/off/+/%/@/&] - Set the level of moderated chat. Requires: @ &');
		}
		if (target === '&' || target === 'hotpatch')
		{
			socket.emit('console', 'Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: &');
			socket.emit('console', 'Hot-patching has greater memory requirements than restarting.');
			socket.emit('console', '/hotpatch all - reload the game engine, data, and chat commands');
			socket.emit('console', '/hotpatch data - reload the game data (abilities, moves...)');
			socket.emit('console', '/hotpatch chat - reload chat-commands.js');
		}
		if (target === 'all' || target === 'help' || target === 'h' || target === '?' || target === 'commands')
		{
			matched = true;
			socket.emit('console', '/help OR /h OR /? - Gives you help.');
		}
		if (!target)
		{
			socket.emit('console', 'COMMANDS: /msg, /reply, /ip, /rating, /nick, /avatar, /rooms, /whois, /help');
			socket.emit('console', 'TOURNAMENT COMMANDS: /tournament, /joinTournament, /leaveTournament, /tournamentGetTree, /tournamentSetMaxParticipants, /tournamentStartAutopilot, /tournamentStopAutopilot, /tournamentStartNextBattle, /tournamentSetActionOnDraw, /tournamentGetWinner, /tournamentRebuildTree, /deleteTournament');
			socket.emit('console', 'INFORMATIONAL COMMANDS: /getTournaments, /tournamentGetParticipants, /data, /groups, /opensource, /avatars, /intro (replace / with ! to broadcast)');
			if (user.isMod()) socket.emit('console', 'MODERATOR COMMANDS: /alts, /forcerename, /ban, /unban, /unbanall, /mute, /unmute, /voice, /devoice');
			if (user.isMod()) socket.emit('console', 'ADMIN COMMANDS: /ip, /mod, /demod, /admin, /deadmin, /sysop, /desysop');
			socket.emit('console', 'All command parameters are case-sensitive, while the command itself is not.');
			socket.emit('console', 'For details on all commands, use /help all');
			socket.emit('console', 'For details on all tournament commands, use /help tournaments');
			if (user.isMod()) socket.emit('console', 'For details on all moderator commands, use /help %');
			socket.emit('console', 'For details of a specific command, use something like: /help ban');
		}
		else if (!matched)
		{
			socket.emit('console', 'The command "/'+target+'" was not found. Try /help for general help');
		}
		return true;
		break;
	}

	// chat moderation
	if (!canTalk(user, room, socket))
	{
		return true;
	}

	return false;
}

/**
 * Can this user talk?
 * Pass the corresponding socket to give the user an error, if not
 */
function canTalk(user, room, socket)
{
	if (user.muted)
	{
		if (socket) socket.emit('console', 'You are muted.');
		return false;
	}
	if (config.modchat && room.id === 'lobby')
	{
		switch (config.modchat)
		{
		case '&':
		case '&&':
			if (user.group !== '&')
			{
				if (config.modchat === '&&')
				{
					if (socket) socket.emit('console', 'Because the server has crashed, you cannot speak in lobby chat.');
					return false;
				}
				if (socket) socket.emit('console', 'Due to an influx of spam, you must be a sysop to speak in lobby chat.');
				return false;
			}
			break;
		case '@':
			if (user.group !== '&' && user.group !== '@')
			{
				if (socket) socket.emit('console', 'Due to an influx of spam, you must be an admin or sysop to speak in lobby chat.');
				return false;
			}
			break;
		case '%':
			if (user.group !== '&' && user.group !== '@' && user.group !== '%')
			{
				if (socket) socket.emit('console', 'Due to an influx of spam, you must be an moderator to speak in lobby chat.');
				return false;
			}
			break;
		case '+':
			if (user.group === ' ')
			{
				if (socket) socket.emit('console', 'Due to an influx of spam, you must be voiced to speak in lobby chat.');
				return false;
			}
			break;
		default:
			if (!user.authenticated && user.group === ' ')
			{
				if (socket) socket.emit('console', 'Due to an influx of spam, you must be registered or voiced to speak in lobby chat.');
				return false;
			}
			break;
		}
	}
	return true;
}

function showOrBroadcastStart(user, cmd, room, socket, message)
{
	if (cmd.substr(0,1) === '!')
	{
		if (user.group === ' ' || user.muted)
		{
			socket.emit('console', "You need to be voiced to broadcast this command's information.");
			socket.emit('console', "To see it for yourself, use: /"+message.substr(1));
		}
		else if (canTalk(user, room, socket))
		{
			room.add({
				name: user.getIdentity(),
				message: message
			});
		}
	}
}

function showOrBroadcast(user, cmd, room, socket, rawMessage)
{
	if (cmd.substr(0,1) !== '!')
	{
		socket.emit('console', {rawMessage: rawMessage});
	}
	else if (user.group !== ' ' && canTalk(user, room))
	{
		room.addRaw(rawMessage);
	}
}

function getDataMessage(target)
{
	var pokemon = Tools.getTemplate(target);
	var item = Tools.getItem(target);
	var move = Tools.getMove(target);
	var ability = Tools.getAbility(target);
	var atLeastOne = false;
	var response = [];
	if (pokemon.name)
	{
		response.push({
			evalRawMessage: "'<ul class=\"utilichart\">'+Chart.pokemonRow(exports.BattlePokedex['"+pokemon.name.replace(/ /g,'')+"'],'',{})+'<li style=\"clear:both\"></li></ul>'"
		});
		atLeastOne = true;
	}
	if (ability.name)
	{
		response.push({
			evalRawMessage: "'<ul class=\"utilichart\">'+Chart.abilityRow(exports.BattleAbilities['"+ability.id+"'],'',{})+'<li style=\"clear:both\"></li></ul>'"
		});
		atLeastOne = true;
	}
	if (item.name)
	{
		response.push({
			evalRawMessage: "'<ul class=\"utilichart\">'+Chart.itemRow(exports.BattleItems['"+item.id+"'],'',{})+'<li style=\"clear:both\"></li></ul>'"
		});
		atLeastOne = true;
	}
	if (move.name)
	{
		response.push({
			evalRawMessage: "'<ul class=\"utilichart\">'+Chart.moveRow(exports.BattleMovedex['"+move.id.replace("'","\\'")+"'],'',{})+'<li style=\"clear:both\"></li></ul>'"
		});
		atLeastOne = true;
	}
	if (!atLeastOne)
	{
		response.push({message: "No pokemon, item, move, or ability named '"+target+"' was found. (Check your capitalization?)"});
	}
	return response;
}

function splitTarget(target)
{
	var commaIndex = target.indexOf(',');
	if (commaIndex < 0)
	{
		return [getUser(target), '', target];
	}
	var targetUser = getUser(target.substr(0, commaIndex));
	if (!targetUser || !targetUser.connected)
	{
		targetUser = null;
	}
	return [targetUser, target.substr(commaIndex+1).trim(), target.substr(0, commaIndex)];
}

function splitArgs(args)
{
    args = args.replace(/\s+/gm, " "); // Normalise spaces
    var result = args.split(',');
    for (var r in result)
        result[r] = result[r].trim();
    return result;
}

exports.parseCommand = parseCommandLocal;
