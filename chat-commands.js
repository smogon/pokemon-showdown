// to reload chat commands:

// >> for (var i in require.cache) delete require.cache[i];parseCommand = require('./chat-commands.js').parseCommand;''

function toId(text)
{
	text = text || '';
	return text.replace(/ /g, '');
}
function toUserid(name)
{
	return name.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function parseCommand(user, cmd, target, room, socket, message)
{
	switch (cmd)
	{
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
			if (!user.canMod(targetUser.group)) return true;
			
			room.add(''+targetUser.name+' was banned by '+user.name+'.');
			
			bannedIps[targetUser.ip] = targetUser.userid;
			targetUser.destroy();
			return true;
		}
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
				socket.emit('console', 'User not found.');
				return true;
			}
			if (!user.canMod(targetUser.group)) return true;
			
			if (targets[1].substr(0,2) == '~~')
			{
				targets[1] = '/'+targets[1];
			}
			else if (targets[1].substr(0,7) !== 'http://' && targets[1].substr(0,8) !== 'https://' && targets[1].substr(0,1) !== '/')
			{
				targets[1] = 'http://'+targets[1];
			}
			
			room.add(''+targetUser.name+' was banned by '+user.name+' and redirected to: '+targets[1]);
			
			bannedIps[targetUser.ip] = targetUser.userid;
			targetUser.emit('console', {evalRawMessage: 'window.location.href="'+targets[1]+'"'});
			targetUser.destroy();
			return true;
		}
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
				socket.emit('console', 'User not found.');
				return true;
			}
			if (!user.canMod(targetUser.group) && user !== targetUser) return true;
			
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
		break;
		
	case 'register':
		socket.emit('console', 'You must have a beta key to register.');
		return true;
		break;
		
	case 'avatar':
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
			if (user.group === '&' || user.group === '@')
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
		
	case 'unban':
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
		break;
		
	case 'unbanall':
		if (user.isMod())
		{
			room.add('All bans have been lifted by '+user.name+'.');
			bannedIps = {};
			mutedIps = {};
			return true;
		}
		break;
		
	case 'reply':
	case 'r':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
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
				socket.emit('console', 'User '+target+' not found. Did you forget a comma?');
			}
			else
			{
				socket.emit('console', 'User '+target+' not found. Did you misspell their name?');
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
		break;
		
	case 'mute':
	case 'm':
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
		break;
		
	case 'unmute':
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
		break;
	
	case 'voice':
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
		break;
		
	case 'devoice':
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
		break;
		
	case 'mod':
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
		break;
	
	case 'demod':
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
		break;
	
	case 'admin':
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
		break;
	
	case 'deadmin':
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
		break;
	
	case 'sysop':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.group === '&')
		{
			target = getUser(target);
			if (!target) return true;
			
			room.add(''+target.name+' was promoted to sysop by '+user.name+'.');
			target.group = '&';
			rooms.lobby.usersChanged = true;
			return true;
		}
		break;
	
	case 'desysop':
		if (!target) return parseCommand(user, '?', cmd, room, socket);
		if (user.group === '&')
		{
			target = getUser(target);
			if (!target) return true;
			
			if (target.group === '&')
			{
				room.add(''+target.name+' was demoted to admin by '+user.name+'.');
				target.group = '@';
				rooms.lobby.usersChanged = true;
			}
			else
			{
				socket.emit('console', ''+target.name+' is not a sysop.');
			}
			return true;
		}
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
				room.addRaw('<div style="background-color:#AA5544;color:white;padding:2px 4px"><b>Moderated chat was enabled!</b><br />Only registered users and users of rank + and higher can talk.</div>');
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
		break;
	
	case 'announce':
		if (user.group === '&' || user.group === '@')
		{
			target = target.replace(/\[\[([A-Za-z0-9-]+)\]\]/, '<button onclick="selectTab(\'$1\');return false">Go to $1</button>');
			room.addRaw('<div style="background-color:#6688AA;color:white;padding:2px 4px"><b>'+target+'</b></div>');
			return true;
		}
		break;
	
	case 'hotpatch':
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
		
	case 'data':
	case '!data':
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
			else if (user.group !== ' ')
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
			'<div style="border:1px solid #6688AA;padding:2px 4px">Showdown is open source:<br />- <a href="https://github.com/Zarel/Pokemon-Showdown/commits/master" target="_blank">What\'s new?</a><br />- <a href="https://github.com/Zarel/Pokemon-Showdown" target="_blank">Source code</a></div>');
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
				rooms[id].addRaw('<strong style="color:red">The server is restarting soon. Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</strong>');
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
				rooms[id].addRaw('<strong style="color:blue">The server shutdown was canceled.</strong>');
			}
		}
		return true;
		break;
		
	case 'help':
	case 'commands':
	case 'h':
	case '?':
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
			socket.emit('console', '/nick [new username] - Change your username.');
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
		if (target === '@' || target === 'sysop')
		{
			matched = true;
			socket.emit('console', '/sysop [username] - Change user\'s group to @. Requires: &');
		}
		if (target === '@' || target === 'desysop')
		{
			matched = true;
			socket.emit('console', '/sysop [username] - Change user\'s group from @ to %. Requires: &');
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
		if (target === 'all' || target === 'help' || target === 'h' || target === '?' || target === 'commands')
		{
			matched = true;
			socket.emit('console', '/help OR /h OR /? - Tells you things.');
		}
		if (!matched)
		{
			socket.emit('console', 'Commands: /msg, /reply, /ip, /ranking, /nick, /whois, /help');
			socket.emit('console', 'Informational commands: /data, /groups, /opensource, /avatars, /intro (replace / with ! to broadcast)');
			socket.emit('console', 'Moderator commands: /ban, /unban, /unbanall, /mute, /unmute, /voice, /devoice');
			socket.emit('console', 'Admin commands: /ip, /mod, /demod, /admin, /deadmin, /sysop, /desysop');
			socket.emit('console', 'For details on all commands, use /help all. For details of a specific command, use something like: /help ban');
		}
		return true;
		break;
	}

	// !commands
	
	if (user.muted) return false;
	
	// chat moderation
	if (config.modchat)
	{
		var cantalk = true;
		switch (config.modchat)
		{
		case '&':
			if (user.group !== '&')
			{
				socket.emit('console', 'Due to an influx of spam, you must be a sysop to speak in lobby chat.');
				return true;
			}
			break;
		case '@':
			if (user.group !== '&' && user.group !== '@')
			{
				socket.emit('console', 'Due to an influx of spam, you must be an admin or sysop to speak in lobby chat.');
				return true;
			}
			break;
		case '%':
			if (user.group !== '&' && user.group !== '@' && user.group !== '%')
			{
				socket.emit('console', 'Due to an influx of spam, you must be an moderator to speak in lobby chat.');
				return true;
			}
			break;
		case '+':
			if (user.group === ' ')
			{
				socket.emit('console', 'Due to an influx of spam, you must be voiced to speak in lobby chat.');
				return true;
			}
			break;
		default:
			if (!user.authenticated && user.group === ' ')
			{
				socket.emit('console', 'Due to an influx of spam, you must be registered or voiced to speak in lobby chat.');
				return true;
			}
			break;
		}
	}

	
	return false;
}

function showOrBroadcastStart(user, cmd, room, socket, message)
{
	if (cmd.substr(0,1) === '!')
	{
		if (user.group === ' ')
		{
			socket.emit('console', "You need to be voiced to broadcast this command's information.");
			socket.emit('console', "To see it for yourself, use: /"+message.substr(1));
		}
		else
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
	else if (user.group !== ' ')
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
		return [getUser(target), ''];
	}
	var targetUser = getUser(target.substr(0, commaIndex));
	if (!targetUser || !targetUser.connected)
	{
		targetUser = null;
	}
	return [targetUser, target.substr(commaIndex+1).trim()];
}

exports.parseCommand = parseCommand;