function parseCommand(user, cmd, target, room, socket, message)
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
	else if (cmd === 'register')
	{
		socket.emit('console', 'You must have a beta key to register.');
		return true;
	}
	else if (cmd === 'avatar')
	{
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
	}
	else if (cmd === 'whois')
	{
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
	else if (cmd === 'msg' || cmd === 'pm' || cmd === 'whisper' || cmd === 'w')
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
		var message = getDataMessage(target);
		for (var i=0; i<message.length; i++)
		{
			user.emit('console', message[i]);
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
		if (target === 'all' || target === 'msg' || target === 'pm' || cmd === 'whisper' || cmd === 'w')
		{
			matched = true;
			socket.emit('console', '/msg OR /whisper OR /w [username], [message] - Send a private message. Can be used by: anyone');
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

	// !commands
	
	if (user.muted) return false;

	if (cmd === '!data' && room.type === 'lobby')
	{
		if (user.group === ' ')
		{
			socket.emit('console', {rawMessage: 'You do not have permission to use <code>!data</code>. Please use <code>/data</code> instead.'});
		}
		var dataMessages = getDataMessage(target);
		if (dataMessages[0].message)
		{
			// didn't find matching data
			socket.emit('console', dataMessages[0]);
		}
		else
		{
			room.add({
				name: user.getIdentity(),
				message: message
			});
			for (var i=0; i<dataMessages.length; i++)
			{
				room.add(dataMessages[i]);
			}
		}
		return true;
	}

	return false;
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

exports.parseCommand = parseCommand;