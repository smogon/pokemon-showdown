/**
 * System commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are system commands - commands required for Pokemon Showdown
 * to run. A lot of these are sent by the client.
 *
 * If you'd like to modify commands, please go to config/commands.js,
 * which also teaches you how to use commands.
 *
 * @license MIT license
 */

var crypto = require('crypto');

var poofeh = true;

var logeval = fs.createWriteStream('logs/eval.txt', {'flags': 'a'});
var code = fs.createWriteStream('config/friendcodes.txt', {'flags': 'a'});

var isMotd = false;

//var avatar = fs.createWriteStream('config/avatars.csv', {'flags': 'a'}); // for /customavatar
//spamroom
if (typeof spamroom == "undefined") {
        spamroom = new Object();
}
if (!Rooms.rooms.spamroom) {
        Rooms.rooms.spamroom = new Rooms.ChatRoom("spamroom", "spamroom");
        Rooms.rooms.spamroom.isPrivate = true;
}
if (typeof tells === 'undefined') {
	tells = {};
}

const MAX_REASON_LENGTH = 300;

var commands = exports.commands = {

	clientusers: function(target, room, user) {
		if(!user.can('hotpatch')) return this.sendReply('You do not have enough authority to do this.');
		var client = [];
		var total = [];
		for (var u in Users.users) {
			if (Users.get(u).connected && Users.get(u).customClient) {
				client.push(Users.get(u).userid);
			}
			if (Users.get(u).connected) {
				total.push(Users.get(u).userid);
			}
		}
		this.sendReply('Number of users using the custom client: ' + client.length);
		this.sendReply('Percentage of users using the custom client: ' + ((client.length / total.length)*100) + '%');
	},

	/*********************************************************
	 * Friends                                    
	 *********************************************************/

	friends: function(target, room, user, connection) {
		if (!user.customClient) {
			return this.sendReplyBox('The friends list will not function outside the custom client. Click <a href = "http://frost-server.no-ip.org/">here</a> to use it.');
		}
		var data = fs.readFileSync('config/friends.csv','utf8')
			var match = false;
			var friends = '';
			var row = (''+data).split("\n");
			for (var i = 0; i < row.length; i++) {
				if (!row[i]) continue;
				var parts = row[i].split(",");
				var userid = toUserid(parts[0]);
				if (user.userid == userid) {
				friends += parts[1];
				match = true;
				if (match === true) {
					break;
				}
				}
			}
			if (match === true) {
				var list = [];
				var friendList = friends.split(' ');
				for (var i = 0; i < friendList.length; i++) {
					if(Users.get(friendList[i])) {
						if(Users.get(friendList[i]).connected) {
							list.push(friendList[i]);
						}
					}
				}
				if (list[0] === undefined) {
					return this.sendReply('You have no online friends.');
				}
				var buttons = '';
				for (var i = 0; i < list.length; i++) {
					buttons = buttons + '<button name = "openUser" value = "' + Users.get(list[i]).userid + '">' + Users.get(list[i]).name + '</button>';
				}
				this.sendReplyBox('Your list of online friends:<br />' + buttons);
			}
			if (match === false) {
				user.send('You have no friends to show.');
			}
		},
	 
	addfriend: function(target, room, user, connection) {
		if (!user.customClient) {
			return this.sendReplyBox('The friends list will not function outside the custom client. Click <a href = "http://frost-server.no-ip.org/">here</a> to use it.');
		}
		if(!target) return this.parse('/help addfriend');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (targetUser.userid === user.userid) {
			return this.sendReply('Are you really trying to friend yourself?');
		}
		var data = fs.readFileSync('config/friends.csv','utf8')
		var match = false;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (user.userid == userid) {
				match = true;
			}
			if (match === true) {
				line = line + row[i];
				var individuals = parts[1].split(" ");
				for (var i = 0; i < individuals.length; i++) {
					if (individuals[i] === targetUser.userid) {
						return connection.send('This user is already in your friends list.');
					}
				}
				break;
			}
		}
		if (match === true) {
			var re = new RegExp(line,"g");
			fs.readFile('config/friends.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, line +' '+targetUser.userid);
			fs.writeFile('config/friends.csv', result, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			var log = fs.createWriteStream('config/friends.csv', {'flags': 'a'});
			log.write("\n"+user.userid+','+targetUser.userid);
		}
		this.sendReply(targetUser.name + ' was added to your friends list.');
		targetUser.send(user.name + ' has added you to their friends list.');
	},
	
	removefriend: function(target, room, user, connection) {
		if (!user.customClient) {
			return this.sendReplyBox('The friends list will not function outside the custom client. Click <a href = "http://frost-server.no-ip.org/">here</a> to use it.');
		}
		if(!target) return this.parse('/help removefriend');
		var noCaps = target.toLowerCase();
		var idFormat = toUserid(target);
		var data = fs.readFileSync('config/friends.csv','utf8')
		var match = false;
		var line = '';
		var row = (''+data).split("\n");
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var parts = row[i].split(",");
			var userid = toUserid(parts[0]);
			if (user.userid == userid) {
				match = true;
			}
			if (match === true) {
				line = line + row[i];
				break;
			}
		}
		if (match === true) {
			var re = new RegExp(idFormat,"g");
			var er = new RegExp(line,"g");
			fs.readFile('config/friends.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = line.replace(re, '');
			var replace = data.replace(er, result);
			fs.writeFile('config/friends.csv', replace, 'utf8', function (err) {
				if (err) return console.log(err);
			});
			});
		} else {
			return this.sendReply('This user doesn\'t appear to be in your friends. Make sure you spelled their username right.');
		}
		this.sendReply(idFormat + ' was removed from your friends list.');
		if(Users.get(target).connected) {
			Users.get(target).send(user.name + ' has removed you from their friends list.');
		}
	},

	/*********************************************************
	 * Other Stuff                                    
	 *********************************************************/

	version: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Server version: <b>'+CommandParser.package.version+'</b> <small>(<a href="http://pokemonshowdown.com/versions#' + CommandParser.serverVersion + '">' + CommandParser.serverVersion.substr(0,10) + '</a>)</small>');
	},

	me: function(target, room, user, connection) {
		target = this.canTalk(target);
		if (!target) return;

		var message = '/me ' + target;
		// if user is not in spamroom
		if (spamroom[user.userid] === undefined) {
			// check to see if an alt exists in list
			for (var u in spamroom) {
				if (Users.get(user.userid) === Users.get(u)) {
					// if alt exists, add new user id to spamroom, break out of loop.
					spamroom[user.userid] = true;
					break;
				}
			}
		}

		if (user.userid in spamroom) {
			this.sendReply('|c|' + user.getIdentity() + '|' + message);
			return Rooms.rooms['spamroom'].add('|c|' + user.getIdentity() + '|' + message);
		} else {
			return message;
		}
	},

	poof: 'd',
	d: function(target, room, user){
		if(room.id !== 'lobby') return false;
		muted = Object.keys(user.mutedRooms);
		for (var u in muted) if (muted[u] == 'lobby') return this.sendReply('You can\'t poof while muted');
		var btags = '<strong><font color='+hashColor(Math.random().toString())+'" >';
		var etags = '</font></strong>'
		var targetid = toUserid(user);
		if(target){
			var tar = toUserid(target);
			var targetUser = Users.get(tar);
			if(user.can('poof', targetUser)){
				if(!targetUser){
					user.emit('console', 'Cannot find user ' + target + '.', socket);	
				}else{
					var escapedName = escapeHTML(targetUser.name);
					var escapedUser = escapeHTML(user.name);
					if(poofeh)
						Rooms.rooms.lobby.addRaw(btags + '~~ '+escapedName+' was vanished into nothingness by ' + escapedUser +'! ~~' + etags);
						targetUser.disconnectAll();
						return	this.logModCommand(targetUser.name+ ' was poofed by ' + user.name);
					}
				} else {
					return this.sendReply('/poof target - Access denied.');
				}
			}
		if(poofeh && !user.locked){
			Rooms.rooms.lobby.addRaw(btags + getRandMessage(user)+ etags);
			user.disconnectAll();	
		}else{
			return this.sendReply('poof is currently disabled.');
		}
	},

	poofoff: 'nopoof',
	nopoof: function(target, room, user){
		if(!user.can('warn')) return this.sendReply('/nopoof - Access denied.');
		if(!poofeh) return this.sendReply('poof is currently disabled.');
		poofeh = false;
		this.logModCommand(user.name + ' disabled poof.');
		return this.sendReply('poof is now disabled.');
	},

	poofon: function(target, room, user){
		if(!user.can('warn')) return this.sendReply('/poofon - Access denied.');
		if(poofeh) return this.sendReply('poof is currently enabled.');
		poofeh = true;
		this.logModCommand(user.name + ' enabled poof');
		return this.sendReply('poof is now enabled.');
	},

	cpoof: function(target, room, user){
		if(!user.can('broadcast')) return this.sendReply('/cpoof - Access Denied');
		if (!target) return this.sendReply('/cpoof - Please specify a custom poof message to use.');
		if(poofeh) {
			var btags = '<strong><font color="'+hashColor(Math.random().toString())+'" >';
			var etags = '</font></strong>'
			escapedTarget = escapeHTML(target);
			Rooms.rooms.lobby.addRaw(btags + '~~ '+user.name+' '+escapedTarget+'! ~~' + etags);
			this.logModCommand(user.name + ' used a custom poof message: \n "'+target+'"');
			user.disconnectAll();	
		}else{
			return this.sendReply('Poof is currently disabled.');
		}
	},
	mee: function(target, room, user, connection) {
		target = this.canTalk(target);
		if (!target) return;

		var message = '/mee ' + target;
		// if user is not in spamroom
		if (spamroom[user.userid] === undefined) {
			// check to see if an alt exists in list
			for (var u in spamroom) {
				if (Users.get(user.userid) === Users.get(u)) {
					// if alt exists, add new user id to spamroom, break out of loop.
					spamroom[user.userid] = true;
					break;
				}
			}
		}

		if (user.userid in spamroom) {
			this.sendReply('|c|' + user.getIdentity() + '|' + message);
			return Rooms.rooms['spamroom'].add('|c|' + user.getIdentity() + '|' + message);
		} else {
			return message;
		}
	},

	avatar: function(target, room, user) {
		if (!target) return this.parse('/avatars');
		var parts = target.split(',');
		var avatar = parseInt(parts[0]);
		if (!avatar || avatar > 294 || avatar < 1) {
			if (!parts[1]) {
				this.sendReply("Invalid avatar.");
			}
			return false;
		}

		user.avatar = avatar;
		if (!parts[1]) {
			this.sendReply("Avatar changed to:\n" +
					'|raw|<img src="//play.pokemonshowdown.com/sprites/trainers/'+avatar+'.png" alt="" width="80" height="80" />');
		}
	},

	logout: function(target, room, user) {
		user.resetName();
	},

	r: 'reply',
	reply: function(target, room, user) {
		if (!target) return this.parse('/help reply');
		if (!user.lastPM) {
			return this.sendReply('No one has PMed you yet.');
		}
		return this.parse('/msg '+(user.lastPM||'')+', '+target);
	},

	pm: 'msg',
	whisper: 'msg',
	w: 'msg',
	msg: function(target, room, user) {
		if (!target) return this.parse('/help msg');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!target) {
			this.sendReply('You forgot the comma.');
			return this.parse('/help msg');
		}
		if (!targetUser || !targetUser.connected) {
			if (targetUser && !targetUser.connected) {
				this.popupReply('User '+this.targetUsername+' is offline.');
			} else if (!target) {
				this.popupReply('User '+this.targetUsername+' not found. Did you forget a comma?');
			} else {
				this.popupReply('User '+this.targetUsername+' not found. Did you misspell their name?');
			}
			return this.parse('/help msg');
		}

		if (config.pmmodchat) {
			var userGroup = user.group;
			if (config.groupsranking.indexOf(userGroup) < config.groupsranking.indexOf(config.pmmodchat)) {
				var groupName = config.groups[config.pmmodchat].name;
				if (!groupName) groupName = config.pmmodchat;
				this.popupReply('Because moderated chat is set, you must be of rank ' + groupName +' or higher to PM users.');
				return false;
			}
		}

		if (user.locked && !targetUser.can('lock', user)) {
			return this.popupReply('You can only private message members of the moderation team (users marked by %, @, &, or ~) when locked.');
		}
		if (targetUser.locked && !user.can('lock', targetUser)) {
			return this.popupReply('This user is locked and cannot PM.');
		}
		if (targetUser.ignorePMs && !user.can('lock')) {
			if (!targetUser.can('lock')) {
				return this.popupReply('This user is blocking Private Messages right now.');
			} else if (targetUser.can('hotpatch')) {
				return this.popupReply('This admin is too busy to answer Private Messages right now. Please contact a different staff member.');
			}
		}

		target = this.canTalk(target, null);
		if (!target) return false;

		var message = '|pm|'+user.getIdentity()+'|'+targetUser.getIdentity()+'|'+target;
		user.send(message);
		// if user is not in spamroom
		if(spamroom[user.userid] === undefined){
			// check to see if an alt exists in list
			for(var u in spamroom){
				if(Users.get(user.userid) === Users.get(u)){
					// if alt exists, add new user id to spamroom, break out of loop.
					spamroom[user.userid] = true;
					break;
				}
			}
		}

		if (user.userid in spamroom) {
			Rooms.rooms.spamroom.add('|c|' + user.getIdentity() + '|(__Private to ' + targetUser.getIdentity()+ "__) " + target );
		} else {
			if (targetUser !== user) targetUser.send(message);
			targetUser.lastPM = user.userid;
		}
		user.lastPM = targetUser.userid;
	},
	
	tell: function(target, room, user) {
		if (user.locked) return this.sendReply('You cannot use this command while locked.');
		if (user.forceRenamed) return this.sendReply('You cannot use this command while under a name that you have been forcerenamed to.');
		if (!target) return this.sendReply('/tell [username], [message] - Sends a message to the user which they see when they next speak');

		var targets = target.split(',');
		if (!targets[1]) return this.parse('/help tell');
		var targetUser = toId(targets[0]);

		if (targetUser.length > 18) {
			return this.sendReply('The name of user "' + this.targetUsername + '" is too long.');
		}

		if (!tells[targetUser]) tells[targetUser] = [];
		if (tells[targetUser].length === 5) return this.sendReply('User ' + targetUser + ' has too many tells queued.');

		var date = Date();
		var message = '|raw|' + date.substring(0, date.indexOf('GMT') - 1) + ' - <b>' + user.getIdentity() + '</b> said: ' + targets[1].trim();
		if (message.length > 500) return this.sendReply('Your tell exceeded the maximum length.');
		tells[targetUser].add(message);

		return this.sendReply('Message "' + targets[1].trim() + '" sent to ' + targetUser + '.');
	},

	blockpm: 'ignorepms',
	blockpms: 'ignorepms',
	ignorepm: 'ignorepms',
	ignorepms: function(target, room, user) {
		if (user.ignorePMs) return this.sendReply('You are already blocking Private Messages!');
		if (user.can('lock') && !user.can('hotpatch')) return this.sendReply('You are not allowed to block Private Messages.');
		user.ignorePMs = true;
		return this.sendReply('You are now blocking Private Messages.');
	},

	unblockpm: 'unignorepms',
	unblockpms: 'unignorepms',
	unignorepm: 'unignorepms',
	unignorepms: function(target, room, user) {
		if (!user.ignorePMs) return this.sendReply('You are not blocking Private Messages!');
		user.ignorePMs = false;
		return this.sendReply('You are no longer blocking Private Messages.');
	},

	makechatroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		if (!target) return this.parse('/help makechatroom');
		var id = toId(target);
		if (!id) return this.parse('/help makechatroom');
		if (Rooms.rooms[id]) {
			return this.sendReply("The room '"+target+"' already exists.");
		}
		if (Rooms.global.addChatRoom(target)) {
			return this.sendReply("The room '"+target+"' was created.");
			if (Rooms.rooms.logroom) Rooms.rooms.logroom.addRaw('ROOM LOG ' + user.name + ' has made the room ' + target + '.');
			this.logModCommand('Room '+target+' has been created by '+user.name+'.');
		}
		return this.sendReply("An error occurred while trying to create the room '"+target+"'.");
	},
	
	deletechatroom: 'deregisterchatroom',
	deregisterchatroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help deregisterchatroom');
		var targetRoom = Rooms.get(id);
		if (!targetRoom) return this.sendReply("The room '"+id+"' doesn't exist.");
		target = targetRoom.title || targetRoom.id;
		if (Rooms.global.deregisterChatRoom(id)) {
			this.sendReply("The room '"+target+"' was deregistered.");
			this.sendReply("It will be deleted as of the next server restart.");
			this.logModCommand('Room '+id+' has been deleted by '+user.name+'.');
			return;
		}
		return this.sendReply("The room '"+target+"' isn't registered.");
	},
        
    	makeprivate: 'privateroom',
    	toggleprivate: 'privateroom',      
	privateroom: function(target, room, user) {
		if (!this.can('privateroom')) return;
		if (target === 'off') {
			delete room.isPrivate;
			this.addModCommand(user.name+' made this room public.');
			if (room.chatRoomData) {
				delete room.chatRoomData.isPrivate;
				Rooms.global.writeChatRoomData();
			}
		} else {
			room.isPrivate = true;
			this.addModCommand(user.name+' made this room private.');
			if (room.chatRoomData) {
				room.chatRoomData.isPrivate = true;
				Rooms.global.writeChatRoomData();
			}
		}
	},

	leagueroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.sendReply('/leagueroom - This room can\'t be marked as a league');
		}
		if (target === 'off') {
			delete room.isLeague;
			this.addModCommand(user.name+' has made this chat room a normal room.');
			delete room.chatRoomData.isLeague;
			Rooms.global.writeChatRoomData();
		} else {
			room.isLeague = true;
			this.addModCommand(user.name+' made this room a league room.');
			room.chatRoomData.isLeague = true;
			Rooms.global.writeChatRoomData();
		}
	},

	officialchatroom: 'officialroom',
	officialroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.sendReply("/officialroom - This room can't be made official");
		}
		if (target === 'off') {
			delete room.isOfficial;
			this.addModCommand(user.name+' made this chat room unofficial.');
			delete room.chatRoomData.isOfficial;
			Rooms.global.writeChatRoomData();
		} else {
			room.isOfficial = true;
			this.addModCommand(user.name+' made this chat room official.');
			room.chatRoomData.isOfficial = true;
			Rooms.global.writeChatRoomData();
		}
	},

	roomfounder: function(target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomfounder - This room is't designed for per-room moderation to be added.");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '"+this.targetUsername+"' is not online.");
		if (!this.can('makeroom')) return false;
		if (!room.auth) room.auth = room.chatRoomData.auth = {};
		var name = targetUser.name;
		room.auth[targetUser.userid] = '#';
		room.founder = targetUser.userid;
		this.addModCommand(''+name+' was appointed to Room Founder by '+user.name+'.');
		room.onUpdateIdentity(targetUser);
		room.chatRoomData.founder = room.founder;
		Rooms.global.writeChatRoomData();
	},

	roomowner: function(target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '"+this.targetUsername+"' is not online.");

		if (!room.founder) return this.sendReply('The room needs a room founder before it can have a room owner.');
		if (room.founder != user.userid && !this.can('makeroom')) return this.sendReply('/roomowner - Access denied.');

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		var name = targetUser.name;

		room.auth[targetUser.userid] = '#';
		this.addModCommand(''+name+' was appointed Room Owner by '+user.name+'.');
		room.onUpdateIdentity(targetUser);
		Rooms.global.writeChatRoomData();
	},

	roomdeowner: 'deroomowner',
	deroomowner: function(target, room, user) {
		if (!room.auth) {
			return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '"+name+"' does not exist.");

		if (room.auth[userid] !== '#') return this.sendReply("User '"+name+"' is not a room owner.");
		if (!room.founder || user.userid != room.founder && !this.can('makeroom')) return false;

		delete room.auth[userid];
		this.sendReply('('+name+' is no longer Room Owner.)');
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	roomdesc: function(target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			var re = /(https?:\/\/(([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?))/g;
			if (!room.desc) return this.sendReply("This room does not have a description set.");
			this.sendReplyBox('The room description is: '+room.desc.replace(re, "<a href=\"$1\">$1</a>"));
			return;
		}
		if (!this.can('roommod', null, room)) return false;
		if (target.length > 80) {
			return this.sendReply('Error: Room description is too long (must be at most 80 characters).');
		}

		room.desc = target;
		this.sendReply('(The room description is now: '+target+')');

		if (room.chatRoomData) {
			room.chatRoomData.desc = room.desc;
			Rooms.global.writeChatRoomData();
		}
	},

	roomdemote: 'roompromote',
        roompromote: function(target, room, user, connection, cmd) {
                if (!room.auth) {
                        this.sendReply("/roompromote - This room isn't designed for per-room moderation");
                        return this.sendReply("Before setting room mods, you need to set it up with /roomowner");
                }
                if (!target) return this.parse('/help roompromote');

                var target = this.splitTarget(target, true);
                var targetUser = this.targetUser;
                var userid = toUserid(this.targetUsername);
                var name = targetUser ? targetUser.name : this.targetUsername;

                var currentGroup = (room.auth[userid] || ' ');
                if (!targetUser && !room.auth[userid]) {
                        return this.sendReply("User '"+this.targetUsername+"' is offline and unauthed, and so can't be promoted.");
                }

                var nextGroup = target || Users.getNextGroupSymbol(currentGroup, cmd === 'roomdemote', true);
                if (target === 'deauth') nextGroup = config.groupsranking[0];
                if (!config.groups[nextGroup]) {
                        return this.sendReply('Group \'' + nextGroup + '\' does not exist.');
                }
                if (currentGroup !== ' ' && !user.can('room'+config.groups[currentGroup].id, null, room)) {
                        return this.sendReply('/' + cmd + ' - Access denied for promoting from '+config.groups[currentGroup].name+'.');
                }
                if (nextGroup !== ' ' && !user.can('room'+config.groups[nextGroup].id, null, room)) {
                        return this.sendReply('/' + cmd + ' - Access denied for promoting to '+config.groups[nextGroup].name+'.');
                }
                if (currentGroup === nextGroup) {
                        return this.sendReply("User '"+this.targetUsername+"' is already a "+(config.groups[nextGroup].name || 'regular user')+" in this room.");
                }
                if (config.groups[nextGroup].globalonly) {
                        return this.sendReply("The rank of "+config.groups[nextGroup].name+" is global-only and can't be room-promoted to.");
                }

                var isDemotion = (config.groups[nextGroup].rank < config.groups[currentGroup].rank);
                var groupName = (config.groups[nextGroup].name || nextGroup || '').trim() || 'a regular user';

                if (nextGroup === ' ') {
                        delete room.auth[userid];
                } else {
                        room.auth[userid] = nextGroup;
                }

                if (isDemotion) {
                        this.addRoomCommand(''+name+' was appointed to Room ' + groupName + ' by '+user.name+'.',room.id);
                        if (targetUser) {
                                targetUser.popup('You were appointed to Room ' + groupName + ' by ' + user.name + '.');
                        }
                } else {
                        if (groupName == "Owner") this.addModCommand(''+name+' was appointed to Room ' + groupName + ' by '+user.name+'.');
                        if (!groupName != "Owner") this.addRoomCommand(''+name+' was appointed to Room ' + groupName + ' by '+user.name+'.',room.id);
                }
                if (targetUser) {
                        targetUser.updateIdentity();
                }
                if (room.chatRoomData) {
                        Rooms.global.writeChatRoomData();
                }
        },

	lockroom: function(target, room, user) {
		if (!room.auth) {
			return this.sendReply("Only unofficial chatrooms can be locked.");
		}
		if (room.auth[user.userid] != '#' && user.group != '~') {
			return this.sendReply('/lockroom - Access denied.');
		}
		room.lockedRoom = true;
		this.addRoomCommand(user.name + ' has locked the room.',room.id);
	},
	
	unlockroom: function(target, room, user) {
		if (!room.auth) {
			return this.sendReply("Only unofficial chatrooms can be unlocked.");
		}
		if (room.auth[user.userid] != '#' && user.group != '~') {
			return this.sendReply('/unlockroom - Access denied.');
		}
		room.lockedRoom = false;
		this.addRoomCommand(user.name + ' has unlocked the room.',room.id);
	},

	autojoin: function(target, room, user, connection) {
		Rooms.global.autojoinRooms(user, connection);
	},

	join: function(target, room, user, connection) {
		if (!target) return false;
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (targetRoom === 'logroom' && user.group !== '~') return false;
		if (targetRoom === 'adminroom' && user.group !== '~') return false;
		if (!targetRoom) {
			if (target === 'lobby') return connection.sendTo(target, "|noinit|nonexistent|");
			return connection.sendTo(target, "|noinit|nonexistent|The room '"+target+"' does not exist.");
		}
		if (targetRoom.isPrivate && !user.named) {
			return connection.sendTo(target, "|noinit|namerequired|You must have a name in order to join the room '"+target+"'.");
		}
		if (target.toLowerCase() != "lobby" && !user.named) {
			return connection.sendTo(target, "|noinit|namerequired|You must have a name in order to join the room " + target + ".");
		}
		if (!user.joinRoom(targetRoom || room, connection)) {
			return connection.sendTo(target, "|noinit|joinfailed|The room '"+target+"' could not be joined.");
		}
		if (targetRoom.lockedRoom === true) {
			if ((!targetRoom.auth[user.userid]) && (!user.isStaff)) {
				return connection.sendTo(target, "|noinit|joinfailed|The room '"+target+"' is currently locked.");
			}
		}
		if (target.toLowerCase() == "lobby") {
			return connection.sendTo('lobby','|html|<div class="infobox" style="border-color:blue"><center><img src="http://i.imgur.com/RKZTxPs.png"><br />' +
			'<b><u>Welcome to the Frost Server!</u></b><br />' + 
			'Home of many leagues for you to join or challenge, battle users in the ladder or in tournaments, learn how to play Pokemon or just chat in lobby!<br /><br />' +
			'Make sure to type <b>/help</b> to get a list of commands that you can use and <b>/faq</b> to check out frequently asked questions.<br /><br />' +
			'To get a chatroom for your league, please talk to an admin (~) to receive one<br /><br />' +
			'Feel free to jam out with Frost <a href="http://plug.dj/frost-ps/">here</a>!<br /><br />' +
			'<b>Frost</b>-<blockquote><em>Promoting your league, one challenger at a time</em></blockquote></div></font></center>');
		}
		if (target.toLowerCase() === 'frostcasino' || target.toLowerCase() === 'frost casino') {
			if (economy.closeCasino === true) {
				return connection.sendTo('frostcasino', '|html|<div class="infobox" style="border-color:blue"><center><font size="18">Frost Casino is</font> <font size="18" color="red">closed!</font><br />' +
					'<br />The casino is currently closed, if you would like it to be opened ask a member of staff.</center></div>');
			}
			else if (economy.closeCasino === false) {

			}
		}
		/*
		if (target.toLowerCase() == "lobby") {
			return connection.sendTo('lobby','|html|<center><br><h1><font><b><img src="http://www.serebii.net/xy/pokemon/711-h.png"><font color="Orange">WELCOME </font><font color="black">TO </font><font color="Orange">FROST!</font><img src="http://www.serebii.net/xy/pokemon/711-h.png"></center></b><br />' +
				'<center>Frost staff wish you all a happy halloween!<br /><br />' +
				'Home of many leagues for you to join or challenge, battle users in the ladder or in tournaments, learn how to play Pokemon or just chat in lobby!<br /><br />' +
				'Make sure to type <b>/help</b> to get a list of commands that you can use and <b>/faq</b> to check out frequently asked questions.</center>');
		}*/
		if (targetRoom.id === "spamroom" && !user.isStaff) {
			return connection.sendTo(target, "|noinit|nonexistent|The room'"+target+"' does not exist.");
		}
	},

	rk: 'roomkick',
	rkick: 'roomkick',
	kick: 'roomkick',
	roomkick: function(target, room, user){
		if (!room.auth && room.id !== "staff") return this.sendReply('/rkick is designed for rooms with their own auth.');
		if (!this.can('roommod', null, room)) return false;
		if (!target) return this.sendReply('/rkick [username] - kicks the user from the room. Requires: @ & ~');
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('User '+target+' not found.');
		if (!Rooms.rooms[room.id].users[targetUser.userid]) return this.sendReply(target+' is not in this room.');
		if (targetUser.frostDev) return this.sendReply('Frost Developers can\'t be room kicked');
		targetUser.popup('You have been kicked from room '+ room.title +' by '+user.name+'.');
		targetUser.leaveRoom(room);
		room.add('|raw|'+ targetUser.name + ' has been kicked from room by '+ user.name + '.');
		this.logRoomCommand(targetUser.name + ' has been kicked from room by '+ user.name + '.', room.id);
	},

	roomban: function(target, room, user, connection) {
		if (!target) return this.parse('/help roomban');
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || !targetUser) return this.sendReply('User '+name+' not found.');
		if (targetUser.group === '~') {
			return this.sendReply('Administrators can\'t be room banned.');
		}
		if (targetUser.frostDev) {
			return this.sendReply('Frost Developers can\'t be room banned.');
		}
		if (!this.can('ban', targetUser, room)) return false;
		if (!Rooms.rooms[room.id].users[userid] && room.isPrivate) {
			return this.sendReply('User ' + this.targetUsername + ' is not in the room ' + room.id + '.');
		}
		if (!room.bannedUsers || !room.bannedIps) {
			return this.sendReply('Room bans are not meant to be used in room ' + room.id + '.');
		}
		room.bannedUsers[userid] = true;
		for (var ip in targetUser.ips) {
			room.bannedIps[ip] = true;
		}
		targetUser.popup(user.name+" has banned you from the room " + room.id + "." + (target ? " (" + target + ")" : ""));
		this.addRoomCommand(""+targetUser.name+" was banned from room " + room.id + " by "+user.name+"." + (target ? " (" + target + ")" : ""), room.id);
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addRoomCommand(""+targetUser.name+"'s alts were also banned from room " + room.id + ": "+alts.join(", "), room.id);
			for (var i = 0; i < alts.length; ++i) {
				var altId = toId(alts[i]);
				this.add('|unlink|' + altId);
				room.bannedUsers[altId] = true;
			}
		}
		this.add('|unlink|' + targetUser.userid);
		targetUser.leaveRoom(room.id);
	},

	roomunban: function(target, room, user, connection) {
		if (!target) return this.parse('/help roomunban');
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || !targetUser) return this.sendReply('User '+name+' not found.');
		if (!this.can('ban', targetUser, room)) return false;
		if (!room.bannedUsers || !room.bannedIps) {
			return this.sendReply('Room bans are not meant to be used in room ' + room.id + '.');
		}
		if (room.bannedUsers[userid]) delete room.bannedUsers[userid];
		for (var ip in targetUser.ips) {
			if (room.bannedIps[ip]) delete room.bannedIps[ip];
		}
		targetUser.popup(user.name+" has unbanned you from the room " + room.id + ".");
		this.addRoomCommand(""+targetUser.name+" was unbanned from room " + room.id + " by "+user.name+".", room.id);
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addRoomCommand(""+targetUser.name+"'s alts were also unbanned from room " + room.id + ": "+alts.join(", "), room.id);
			for (var i = 0; i < alts.length; ++i) {
				var altId = toId(alts[i]);
				if (room.bannedUsers[altId]) delete room.bannedUsers[altId];
			}
		}
	},

	roomauth: function(target, room, user, connection) {
		if (!room.auth) return this.sendReply("/roomauth - This room isn't designed for per-room moderation and therefore has no auth list.");
		var buffer = [];
		var owners = [];
		var admins = [];
		var leaders = [];
		var mods = [];
		var drivers = [];
		var voices = [];

		room.owners = ''; room.admins = ''; room.leaders = ''; room.mods = ''; room.drivers = ''; room.voices = ''; 
		for (var u in room.auth) { 
			if (room.auth[u] == '#') { 
				room.owners = room.owners +u+',';
			} 
			if (room.auth[u] == '~') { 
				room.admins = room.admins +u+',';
			} 
			if (room.auth[u] == '&') { 
				room.leaders = room.leaders +u+',';
			}
			if (room.auth[u] == '@') { 
				room.mods = room.mods +u+',';
			} 
			if (room.auth[u] == '%') { 
				room.drivers = room.drivers +u+',';
			} 
			if (room.auth[u] == '+') { 
				room.voices = room.voices +u+',';
			} 
		}

		if (!room.founder) founder = '';
		if (room.founder) founder = room.founder;

		room.owners = room.owners.split(',');
		room.admins = room.admins.split(',');
		room.leaders = room.leaders.split(',');
		room.mods = room.mods.split(',');
		room.drivers = room.drivers.split(',');
		room.voices = room.voices.split(',');

		for (var u in room.owners) {
			if (room.owners[u] != '') owners.push(room.owners[u]);
		}
		for (var u in room.admins) {
			if (room.admins[u] != '') admins.push(room.admins[u]);
		}
		for (var u in room.leaders) {
			if (room.leaders[u] != '') leaders.push(room.leaders[u]);
		}
		for (var u in room.mods) {
			if (room.mods[u] != '') mods.push(room.mods[u]);
		}
		for (var u in room.drivers) {
			if (room.drivers[u] != '') drivers.push(room.drivers[u]);
		}
		for (var u in room.voices) {
			if (room.voices[u] != '') voices.push(room.voices[u]);
		}
		if (owners.length > 0) {
			owners = owners.join(', ');
		} 
		if (admins.length > 0) {
			admins = admins.join(', ');
		}
		if (leaders.length > 0) {
			leaders = leaders.join(', ');
		}
		if (mods.length > 0) {
			mods = mods.join(', ');
		}
		if (drivers.length > 0) {
			drivers = drivers.join(', ');
		}
		if (voices.length > 0) {
			voices = voices.join(', ');
		}
		connection.popup('Founder: '+founder+'\nOwners: \n'+owners+'\nAdministrators: \n'+admins+'\nLeaders: \n'+leaders+'\nModerators: \n'+mods+'\nDrivers: \n'+drivers+'\nVoices: \n'+voices);
	},

    stafflist: function(target, room, user, connection) {
        var buffer = [];
        var admins = [];
        var leaders = [];
        var mods = [];
        var drivers = [];
        var voices = [];
        
        admins2 = ''; leaders2 = ''; mods2 = ''; drivers2 = ''; voices2 = ''; 
        stafflist = fs.readFileSync('config/usergroups.csv','utf8');
        stafflist = stafflist.split('\n');
        for (var u in stafflist) {
            line = stafflist[u].split(',');
			if (line[1] == '~') { 
                admins2 = admins2 +line[0]+',';
            } 
            if (line[1] == '&') { 
                leaders2 = leaders2 +line[0]+',';
            }
            if (line[1] == '@') { 
                mods2 = mods2 +line[0]+',';
            } 
            if (line[1] == '%') { 
                drivers2 = drivers2 +line[0]+',';
            } 
            if (line[1] == '+') { 
                voices2 = voices2 +line[0]+',';
             } 
        }
        admins2 = admins2.split(',');
        leaders2 = leaders2.split(',');
        mods2 = mods2.split(',');
        drivers2 = drivers2.split(',');
        voices2 = voices2.split(',');
        for (var u in admins2) {
            if (admins2[u] != '') admins.push(admins2[u]);
        }
        for (var u in leaders2) {
            if (leaders2[u] != '') leaders.push(leaders2[u]);
        }
        for (var u in mods2) {
            if (mods2[u] != '') mods.push(mods2[u]);
        }
        for (var u in drivers2) {
            if (drivers2[u] != '') drivers.push(drivers2[u]);
        }
        for (var u in voices2) {
            if (voices2[u] != '') voices.push(voices2[u]);
        }
        if (admins.length > 0) {
            admins = admins.join(', ');
        }
        if (leaders.length > 0) {
            leaders = leaders.join(', ');
        }
        if (mods.length > 0) {
            mods = mods.join(', ');
        }
        if (drivers.length > 0) {
            drivers = drivers.join(', ');
        }
        if (voices.length > 0) {
            voices = voices.join(', ');
        }
        connection.popup('Administrators: \n'+admins+'\nLeaders: \n'+leaders+'\nModerators: \n'+mods+'\nDrivers: \n'+drivers+'\nVoices: \n'+voices);
    },


	leave: 'part',
	part: function(target, room, user, connection) {
		if (room.id === 'global') return false;
		var targetRoom = Rooms.get(target);
		if (target && !targetRoom) {
			return this.sendReply("The room '"+target+"' does not exist.");
		}
		user.leaveRoom(targetRoom || room, connection);
	},

	/*********************************************************
	 * Moderating: Punishments
	 *********************************************************/

	spam: 'spamroom',
	spammer: 'spamroom',
	spamroom: function(target, room, user, connection) {
		if (!target) return this.sendReply('Please specify a user.');
		var target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('The user \'' + this.targetUsername + '\' does not exist.');
		}
		if (!this.can('mute', targetUser)) {
			return false;
		}
		if (spamroom[targetUser]) {
			return this.sendReply('That user\'s messages are already being redirected to the spamroom.');
		}
		spamroom[targetUser] = true;
		Rooms.rooms['spamroom'].add('|raw|<b>' + this.targetUsername + ' was added to the spamroom list.</b>');
		this.privateModCommand('('+targetUser + ' was added to spamroom by ' + user.name+')');
		this.sendReply(this.targetUsername + ' was successfully added to the spamroom list.');
		try {
			frostcommands.addSpamroomCount(user.userid);
		} catch (e) {
			return;
		}
	},

	unspam: 'unspamroom',
	unspammer: 'unspamroom',
	unspamroom: function(target, room, user, connection) {
		var target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('The user \'' + this.targetUsername + '\' does not exist.');
		}
		if (!this.can('mute', targetUser)) {
			return false;
		}
		if (!spamroom[targetUser]) {
			return this.sendReply('That user is not in the spamroom list.');
		}
		for(var u in spamroom)
			if(targetUser == Users.get(u))
				delete spamroom[u];
		Rooms.rooms['spamroom'].add('|raw|<b>' + this.targetUsername + ' was removed from the spamroom list.</b>');
		this.logModCommand(targetUser + ' was removed from spamroom by ' + user.name);
		return this.sendReply(this.targetUsername + ' and their alts were successfully removed from the spamroom list.');
	},
	
	warn: function(target, room, user) {
		if (!target) return this.parse('/help warn');

		var warnMax = 4;
		function isOdd(num) { return num % 2;}

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!room.isOfficial) {
			return this.sendReply('You can\'t warn here: This is a privately-owned room not subject to global rules.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('warn', targetUser, room)) return false;
		
		targetUser.warnTimes += 1;

		if (targetUser.warnTimes >= warnMax && !room.auth) {
			if (targetUser.warnTimes === 4) {
				targetUser.popup('You have been automatically muted for 7 minutes due to being warned '+warnMax+' times.');
				targetUser.mute(room.id, 7*60*1000);
				this.addModCommand(''+targetUser.name+' was automatically muted for 7 minutes.');
				var alts = targetUser.getAlts();
				if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "), room.id);
				return;
			}
			else if (targetUser.warnTimes >= 6 && isOdd(targetUser.warnTimes) === 0) {
				targetUser.popup('You have been automatically muted for 60 minutes due to being warned '+warnMax+' or more times.');
				targetUser.mute(room.id, 60*60*1000);
				this.addModCommand(''+targetUser.name+' was automatically muted for 60 minutes.');
				var alts = targetUser.getAlts();
				if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "), room.id);
				return;
			}
		}

		this.addModCommand(''+targetUser.name+' was warned by '+user.name+'.' + (target ? " (" + target + ")" : ""));
		targetUser.send('|c|~|/warn '+target);
		try {
			frostcommands.addWarnCount(user.userid);
		} catch (e) {
			return;
		}
	},

	kickto: 'redir',
	redirect: 'redir',
	redir: function (target, room, user, connection) {
		if (!target) return this.parse('/help redirect');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (!targetRoom) {
			return this.sendReply("/help redir - You need to add a room to redirect the user to");
		}
		if (!this.can('warn', targetUser, room) || !this.can('warn', targetUser, targetRoom)) return false;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (Rooms.rooms[targetRoom.id].users[targetUser.userid]) {
			return this.sendReply("User " + targetUser.name + " is already in the room " + target + "!");
		}
		if (!Rooms.rooms[room.id].users[targetUser.userid]) {
			return this.sendReply('User '+this.targetUsername+' is not in the room ' + room.id + '.');
		}
		if (targetUser.joinRoom(target) === false) return this.sendReply('User "' + targetUser.name + '" could not be joined to room ' + target + '. They could be banned from the room.');
		var roomName = (targetRoom.isPrivate)? 'a private room' : 'room ' + target;
		if (!room.auth) {
			this.addModCommand(targetUser.name + ' was redirected to ' + roomName + ' by ' + user.name + '.');
			targetUser.leaveRoom(room);
		}
		if (room.auth) {
			this.addRoomCommand(targetUser.name + ' was redirected to ' + roomName + ' by ' + user.name + '.', room.id);
			targetUser.leaveRoom(room);
		}
	},

	m: 'mute',
	mute: function(target, room, user) {
		if (!target) return this.parse('/help mute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (targetUser.mutedRooms[room.id] || targetUser.locked || !targetUser.connected) {
			var problem = ' but was already '+(!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			if (!target && !room.auth) {
				return this.privateModCommand('('+targetUser.name+' would be muted by '+user.name+problem+'.)');
			}
			if (room.auth) {
				return this.addRoomCommand(''+targetUser.name+' would be muted by '+user.name+problem+'.' + (target ? " (" + target + ")" : ""), room.id);
			}
			if (!room.auth) {
				return this.addModCommand(''+targetUser.name+' would be muted by '+user.name+problem+'.' + (target ? " (" + target + ")" : ""));
			}
		}
		if (!room.auth) {
			targetUser.popup(user.name+' has muted you for 7 minutes. '+target);
			this.addModCommand(''+targetUser.name+' was muted by '+user.name+' for 7 minutes.' + (target ? " (" + target + ")" : ""));
			var alts = targetUser.getAlts();
			if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));
			targetUser.mute(room.id, 7*60*1000);
			this.add('|unlink|' + targetUser.userid);
			try {
				frostcommands.addMuteCount(user.userid);
			} catch (e) {
				return;
			}
		}
		if (room.auth) {
			targetUser.popup(user.name+' has muted you for 7 minutes in ' + room.id + '. '+target);
			this.addRoomCommand(''+targetUser.name+' was muted by '+user.name+' for 7 minutes.' + (target ? " (" + target + ")" : ""), room.id);
			var alts = targetUser.getAlts();
			if (alts.length) this.addRoomCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "), room.id);
			targetUser.mute(room.id, 7*60*1000);
			this.add('|unlink|' + targetUser.userid);
		}
	},

	hourmute: function(target, room, user) {
		if (!target) return this.parse('/help hourmute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (targetUser.mutedRooms[room.id] || targetUser.locked || !targetUser.connected) {
			var problem = ' but was already '+(!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			if (!target && !room.auth) {
				return this.privateModCommand('('+targetUser.name+' would be muted by '+user.name+problem+'.)');
			}
			if (room.auth) {
				return this.addRoomCommand(''+targetUser.name+' would be muted by '+user.name+problem+'.' + (target ? " (" + target + ")" : ""), room.id);
			}
			if (!room.auth) {
				return this.addModCommand(''+targetUser.name+' would be muted by '+user.name+problem+'.' + (target ? " (" + target + ")" : ""));
			}
		}
		if (!room.auth) {
			targetUser.popup(user.name+' has muted you for 60 minutes. '+target);
			this.addModCommand(''+targetUser.name+' was muted by '+user.name+' for 60 minutes.' + (target ? " (" + target + ")" : ""));
			var alts = targetUser.getAlts();
			if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));
			targetUser.mute(room.id, 60*60*1000);
			this.add('|unlink|' + targetUser.userid);
			try {
				frostcommands.addMuteCount(user.userid);
			} catch (e) {
				return;
			}
		}
		if (room.auth) {
			targetUser.popup(user.name+' has muted you for 60 minutes in ' + room.id + '. '+target);
			this.addRoomCommand(''+targetUser.name+' was muted by '+user.name+' for 60 minutes.' + (target ? " (" + target + ")" : ""), room.id);
			var alts = targetUser.getAlts();
			if (alts.length) this.addRoomCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "), room.id);
			targetUser.mute(room.id, 60*60*1000);
			this.add('|unlink|' + targetUser.userid);
		}
	},

	dmute : 'daymute',
	daymute: function(target, room, user) {
		if (!target) return this.parse('/help hourmute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (targetUser.mutedRooms[room.id] || targetUser.locked || !targetUser.connected) {
			var problem = ' but was already '+(!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			if (!target && !room.auth) {
				return this.privateModCommand('('+targetUser.name+' would be muted by '+user.name+problem+'.)');
			}
			if (room.auth) {
				return this.addRoomCommand(''+targetUser.name+' would be muted by '+user.name+problem+'.' + (target ? " (" + target + ")" : ""), room.id);
			}
			if (!room.auth) {
				return this.addModCommand(''+targetUser.name+' would be muted by '+user.name+problem+'.' + (target ? " (" + target + ")" : ""));
			}
		}
		if (!room.auth) {
			targetUser.popup(user.name+' has muted you for 24 hours. '+target);
			this.addModCommand(''+targetUser.name+' was muted by '+user.name+' for 24 hours.' + (target ? " (" + target + ")" : ""));
			var alts = targetUser.getAlts();
			if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));
			targetUser.mute(room.id, 7*60*1000);
			this.add('|unlink|' + targetUser.userid);
			try {
				frostcommands.addMuteCount(user.userid);
			} catch (e) {
				return;
			}
		}
		if (room.auth) {
			targetUser.popup(user.name+' has muted you for 24 hours in ' + room.id + '. '+target);
			this.addRoomCommand(''+targetUser.name+' was muted by '+user.name+' for 24 hours.' + (target ? " (" + target + ")" : ""), room.id);
			var alts = targetUser.getAlts();
			if (alts.length) this.addRoomCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "), room.id);
			targetUser.mute(room.id, 24*60*60*1000);
			this.add('|unlink|' + targetUser.userid);
		}
	},

	um: 'unmute',
	unmute: function(target, room, user) {
		if (!target) return this.parse('/help unmute');
		var targetUser = Users.get(target);
		if (!targetUser) {
			return this.sendReply('User '+target+' not found.');
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (!targetUser.mutedRooms[room.id]) {
			return this.sendReply(''+targetUser.name+' isn\'t muted.');
		}
		if (!room.auth) {
			this.addModCommand(''+targetUser.name+' was unmuted by '+user.name+'.');
			targetUser.unmute(room.id);
		}
		if (room.auth) {
			this.addRoomCommand(''+targetUser.name+' was unmuted by '+user.name+'.', room.id);
			targetUser.unmute(room.id);
		}
	},

	l: 'lock',
	ipmute: 'lock',
	lock: function(target, room, user) {
		if (!target) return this.parse('/help lock');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUser+' not found.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!user.can('lock', targetUser)) {
			return this.sendReply('/lock - Access denied.');
		}
		if ((targetUser.locked || Users.checkBanned(targetUser.latestIp)) && !target) {
			var problem = ' but was already '+(targetUser.locked ? 'locked' : 'banned');
			return this.privateModCommand('('+targetUser.name+' would be locked by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+' has locked you from talking in chats, battles, and PMing regular users.\n\n'+target+'\n\nIf you feel that your lock was unjustified, you can still PM staff members (%, @, &, and ~) to discuss it.');
		if (Rooms.rooms.logroom) Rooms.rooms.logroom.addRaw('LOCK LOG: ' + user.name + ' has locked ' + targetUser.name + ' from ' + room.id + '.');
		this.addModCommand(""+targetUser.name+" was locked from talking by "+user.name+"." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also locked: "+alts.join(", "));
		this.add('|unlink|' + targetUser.userid);

		targetUser.lock();
		try {
			frostcommands.addLockCount(user.userid);
		} catch (e) {
			return;
		}
	},

	unlock: function(target, room, user) {
		if (!target) return this.parse('/help unlock');
		if (!this.can('lock')) return false;
		if (!this.canTalk() && user.group !== '~') return false;

		var unlocked = Users.unlock(target);

		if (unlocked) {
			var names = Object.keys(unlocked);
			this.addModCommand('' + names.join(', ') + ' ' +
					((names.length > 1) ? 'were' : 'was') +
					' unlocked by ' + user.name + '.');
		} else {
			this.sendReply('User '+target+' is not locked.');
		}
	},

	banana: 'ban',
	bh: 'ban',
	b: 'ban',
	ban: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help ban');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The reason is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('ban', targetUser)) return false;
		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = ' but was already banned';
			return this.privateModCommand('('+targetUser.name+' would be banned by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+" has banned you." + (config.appealurl ? ("  If you feel that your banning was unjustified you can appeal the ban:\n" + config.appealurl) : "") + "\n\n"+target);
		if (Rooms.rooms.logroom) Rooms.rooms.logroom.addRaw('BAN LOG: ' + user.name + ' has banned ' + targetUser.name + ' from ' + room.id + '.');
		
		if (cmd === 'banana') {
			this.addModCommand(""+targetUser.name+" was hit by "+user.name+"'s banana." + (target ? " (" + target + ")" : ""), ' ('+targetUser.latestIp+')');
		} else if (cmd === 'bh') {
			this.addModCommand(""+targetUser.name+" was hit by "+user.name+"'s banhammer." + (target ? " (" + target + ")" : ""), ' ('+targetUser.latestIp+')');
		} else {
			this.addModCommand(""+targetUser.name+" was banned by "+user.name+"." + (target ? " (" + target + ")" : ""), ' ('+targetUser.latestIp+')');
		}

		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(""+targetUser.name+"'s alts were also banned: "+alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				this.add('|unlink|' + toId(alts[i]));
			}
		}

		this.add('|unlink|' + targetUser.userid);
		targetUser.ban();
		try {
			frostcommands.addBanCount(user.userid);
		} catch (e) {
			return;
		}
	},

	unban: function(target, room, user) {
		if (!target) return this.parse('/help unban');
		if (!user.can('ban')) {
			return this.sendReply('/unban - Access denied.');
		}

		var name = Users.unban(target);

		if (name) {
			this.addModCommand(''+name+' was unbanned by '+user.name+'.');
		} else {
			this.sendReply('User '+target+' is not banned.');
		}
	},

	unbanall: function(target, room, user) {
		if (!user.can('ban')) {
			return this.sendReply('/unwhipall - Access denied.');
		}
		// we have to do this the hard way since it's no longer a global
		for (var i in Users.bannedIps) {
			delete Users.bannedIps[i];
		}
		for (var i in Users.lockedIps) {
			delete Users.lockedIps[i];
		}
		this.addModCommand('All whips and locks have been lifted by '+user.name+'.');
	},

	banip: function(target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help banip');
		}
		if (!this.can('rangeban')) return false;
			
		Users.bannedIps[target] = '#ipban';
		this.addModCommand(user.name+' temporarily banned the '+(target.charAt(target.length-1)==='*'?'IP range':'IP')+': '+target);
	},

	unbanip: function(target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help unbanip');
		}
		if (!this.can('rangeban')) return false;
		if (!Users.bannedIps[target]) {
			return this.sendReply(''+target+' is not a banned IP or IP range.');
		}
		delete Users.bannedIps[target];
		this.addModCommand(user.name+' unbanned the '+(target.charAt(target.length-1)==='*'?'IP range':'IP')+': '+target);
	},
	
	flogout: 'forcelogout',
	forcelogout: function(target, room, user) {
		if(!user.can('hotpatch')) return;
		if (!this.canTalk()) return false;
	
		if (!target) return this.sendReply('/forcelogout [username], [reason] OR /flogout [username], [reason] - You do not have to add a reason');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}

		if (targetUser.can('hotpatch')) return this.sendReply('You cannot force logout another Admin.');

		this.addModCommand(''+targetUser.name+' was forcibly logged out by '+user.name+'.' + (target ? " (" + target + ")" : ""));
		
		this.logModCommand(user.name+' forcibly logged out '+targetUser.name);
		
		targetUser.resetName();
	},

	inactiverooms: function(target, room, user, connection) {
		if (!user.can('makeroom')) return false;
		for (var u in Rooms.rooms) {
			if (!Rooms.rooms[u].active) {
				connection.sendTo(room.id, '|raw|INACTIVE: <font color=red><b>'+u+'</b></font>');
			}
		}
	},
	
	roomlist: function(target, room, user, connection) {
		if (!user.can('makeroom')) return false;
			for (var u in Rooms.rooms) {
				if (Rooms.rooms[u].type === "chat") {
					if (!Rooms.rooms[u].active && !Rooms.rooms[u].isPrivate) {
						connection.sendTo(room.id, '|raw|INACTIVE: <font color=red><b>'+u+'</b></font>');
					}
					if (Rooms.rooms[u].isPrivate && Rooms.rooms[u].active) {
						connection.sendTo(room.id, '|raw|PRIVATE: <b>'+u+'</b>');
					}
					if (!Rooms.rooms[u].active && Rooms.rooms[u].isPrivate) {
						connection.sendTo(room.id, '|raw|INACTIVE and PRIVATE: <font color=red><b>'+u+'</font></b>');
					}
					if (Rooms.rooms[u].active && !Rooms.rooms[u].isPrivate) {
						connection.sendTo(room.id, '|raw|<font color=green>'+u+'</font>');
					}
				}
			}
		},

	unlink: function(target, room, user) {
		if (!target) return this.parse('/help unlink');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User '+this.targetUser+' not found.');
		if (!this.can('unlink', targetUser)) return this.sendReply('/unlink - Access denied.');
		this.privateModCommand('('+targetUser.name+' had their links unlinked by '+user.name+'. Any links they have posted will now be unclickable.)');
		for (var u in targetUser.prevNames) {
			this.add('|unlink|'+targetUser.prevNames[u]);
		}
	},

	/*********************************************************
	 * Moderating: Other
	 *********************************************************/

	modnote: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help note');
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply('The note is too long. It cannot exceed ' + MAX_REASON_LENGTH + ' characters.');
		}
		if (!this.can('mute')) return false;
		return this.privateModCommand('(' + user.name + ' notes: ' + target + ')');
	},

	demote: 'promote',
	promote: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help promote');
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var userid = toUserid(this.targetUsername);
		var name = targetUser ? targetUser.name : this.targetUsername;

		if (!userid) {
			if (target && config.groups[target]) {
				var groupid = config.groups[target].id;
				return this.sendReply("/"+groupid+" [username] - Promote a user to "+groupid+" globally");
			}
			return this.parse("/help promote");
		}

		var currentGroup = ' ';
		if (targetUser) {
			currentGroup = targetUser.group;
		} else if (Users.usergroups[userid]) {
			currentGroup = Users.usergroups[userid].substr(0,1);
		}

		var nextGroup = target ? target : Users.getNextGroupSymbol(currentGroup, cmd === 'demote', true);
		if (target === 'deauth') nextGroup = config.groupsranking[0];
		if (!config.groups[nextGroup]) {
			return this.sendReply('Group \'' + nextGroup + '\' does not exist.');
		}
		if (config.groups[nextGroup].roomonly) {
			return this.sendReply('Group \'' + config.groups[nextGroup].id + '\' does not exist as a global rank.');
		}
		if (!user.canPromote(currentGroup, nextGroup)) {
			return this.sendReply('/' + cmd + ' - Access denied.');
		}

		var isDemotion = (config.groups[nextGroup].rank < config.groups[currentGroup].rank);
		if (!Users.setOfflineGroup(name, nextGroup)) {
			return this.sendReply('/promote - WARNING: This user is offline and could be unregistered. Use /forcepromote if you\'re sure you want to risk it.');
		}
		var groupName = (config.groups[nextGroup].name || nextGroup || '').trim() || 'a regular user';
		if (isDemotion) {
			this.privateModCommand('('+name+' was demoted to ' + groupName + ' by '+user.name+'.)');
			if (targetUser) {
				targetUser.popup('You were demoted to ' + groupName + ' by ' + user.name + '.');
			}
			if (Rooms.rooms.logroom) Rooms.rooms.logroom.addRaw('DEMOTE LOG: ' + user.name + ' has demoted ' + name + ' to ' + groupName + '.');
		} else {
			this.addModCommand(''+name+' was promoted to ' + groupName + ' by '+user.name+'.');
			if (Rooms.rooms.logroom) Rooms.rooms.logroom.addRaw('PROMOTE LOG: ' + user.name + ' has promoted ' + name + ' to ' + groupName + '.');
		}
		if (targetUser) {
			targetUser.updateIdentity();
		}
	},

	forcepromote: function(target, room, user) {
		// warning: never document this command in /help
		if (!this.can('forcepromote')) return false;
		var target = this.splitTarget(target, true);
		var name = this.targetUsername;
		var nextGroup = target ? target : Users.getNextGroupSymbol(' ', false);

		if (!Users.setOfflineGroup(name, nextGroup, true)) {
			return this.sendReply('/forcepromote - Don\'t forcepromote unless you have to.');
		}
		var groupName = config.groups[nextGroup].name || nextGroup || '';
		this.addModCommand(''+name+' was promoted to ' + (groupName.trim()) + ' by '+user.name+'.');
	},
	
	regular: 'deuath',
	deauth: function(target, room, user) {
		return this.parse('/demote '+target+', deauth');
	},

	modchat: function(target, room, user) {
		if (!target) {
			return this.sendReply('Moderated chat is currently set to: '+room.modchat);
		}
		if (!this.can('modchat', null, room)) return false;
		if (room.modchat && room.modchat.length <= 1 && config.groupsranking.indexOf(room.modchat) > 1 && !user.can('modchatall', null, room)) {
			return this.sendReply('/modchat - Access denied for removing a setting higher than ' + config.groupsranking[1] + '.');
		}

		target = target.toLowerCase();
		switch (target) {
		case 'on':
		case 'true':
		case 'yes':
		case 'registered':
			this.sendReply("Modchat registered is no longer available.");
			return false;
			break;
		case 'off':
		case 'false':
		case 'no':
			room.modchat = false;
			break;
		case 'ac':
		case 'autoconfirmed':
			room.modchat = 'autoconfirmed';
			break;
		case '*':
		case 'player':
			target = '\u2605';
			// fallthrough
		default:
			if (!config.groups[target]) {
				return this.parse('/help modchat');
			}
			if (config.groupsranking.indexOf(target) > 1 && !user.can('modchatall', null, room)) {
				return this.sendReply('/modchat - Access denied for setting higher than ' + config.groupsranking[1] + '.');
			}
			room.modchat = target;
			break;
		}
		if (room.modchat === true) {
			this.add('|raw|<div class="broadcast-red"><b>Moderated chat was enabled!</b><br />Only registered users can talk.</div>');
		} else if (!room.modchat) {
			this.add('|raw|<div class="broadcast-blue"><b>Moderated chat was disabled!</b><br />Anyone may talk now.</div>');
		} else {
			var modchat = sanitize(room.modchat);
			this.add('|raw|<div class="broadcast-red"><b>Moderated chat was set to '+modchat+'!</b><br />Only users of rank '+modchat+' and higher can talk.</div>');
		}
		this.logModCommand(user.name+' set modchat to '+room.modchat);
	},

	spop: 'sendpopup',
	sendpopup: function(target, room, user) {
		if (!this.can('popup')) return false;
		
		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply('/sendpopup [user], [message] - You missed the user');
		if (!target) return this.sendReply('/sendpopup [user], [message] - You missed the message');

		targetUser.popup(target);
		this.sendReply(targetUser.name + ' got the message as popup: ' + target);
		
		targetUser.send(user.name+' sent a popup message to you.');
		
		this.logModCommand(user.name+' send a popup message to '+targetUser.name);
	},

	declaregreen: 'declare',
	declarered: 'declare',
	declare: function(target, room, user, connection, cmd) {
		/*if (user.userid === 'shadowninjask') return false;**/
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		if (cmd === 'declare') {
			this.add('|raw|<div class="broadcast-blue"><b>'+target+'</b></div>');
		}
		else if (cmd === 'declarered') {
			this.add('|raw|<div class="broadcast-red"><b>'+target+'</b></div>');
		}
		else if (cmd === 'declaregreen') {
			this.add('|raw|<div class="broadcast-green"><b>'+target+'</b></div>');
		}
		if (!room.auth) {
			this.logModCommand(user.name+' declared '+target);
		}
		if (room.auth) {
			this.logRoomCommand(user.name+' declared '+target, room.id);
		}
	},

	gdeclarered: 'gdeclare',
	gdeclaregreen: 'gdeclare',
	gdeclare: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help '+cmd);
		if (!this.can('gdeclare')) return false;
		var staff = '';
		staff = 'a ' + config.groups[user.group].name;
		if (user.group == '~') staff = 'an Administrator';
		if (user.frostDev) staff = 'a Developer';

		//var roomName = (room.isPrivate)? 'a private room' : room.id;

		if (cmd === 'gdeclare'){
			for (var id in Rooms.rooms) {
				if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b><font size=1><i>Global declare from '+staff+'<br /></i></font size>'+target+'</b></div>');
			}
		}
		if (cmd === 'gdeclarered'){
			for (var id in Rooms.rooms) {
				if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red"><b><font size=1><i>Global declare from '+staff+'<br /></i></font size>'+target+'</b></div>');
			}
		}
		else if (cmd === 'gdeclaregreen'){
			for (var id in Rooms.rooms) {
				if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b><font size=1><i>Global declare from '+staff+'<br /></i></font size>'+target+'</b></div>');
			}
		}
		this.logModCommand(user.name+' globally declared '+target);
	},
	
	pgdeclare: function(target, room, user) {
		if (!target) return this.parse('/help pgdeclare');
		if (!this.can('pgdeclare')) return;

		if (!this.canTalk()) return;

		for (var r in Rooms.rooms) {
			if (Rooms.rooms[r].type === 'chat') Rooms.rooms[r].add('|raw|<b>'+target+'</b></div>');
		}

		this.logModCommand(user.name+' declared '+target+' to all rooms.');
	},

	modmsg: 'declaremod',
	moddeclare: 'declaremod',
	declaremod: function(target, room, user) {
		if (!target) return this.sendReply('/declaremod [message] - Also /moddeclare and /modmsg');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		this.privateModCommand('|raw|<div class="broadcast-red"><b><font size=1><i>Private Auth (Driver +) declare from '+user.name+'<br /></i></font size>'+target+'</b></div>');

		this.logModCommand(user.name+' mod declared '+target);
	},

	cdeclare: 'chatdeclare',
	chatdeclare: function(target, room, user) {
		if (!target) return this.parse('/help chatdeclare');
		if (!this.can('gdeclare')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') if (Rooms.rooms[id].type !== 'battle') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>'+target+'</b></div>');
		}
		this.logModCommand(user.name+' globally declared (chat level) '+target);
	},
	
	setmotd: 'motd',
	motd: function (target, room, user) {
		if (!this.can('declare')) return false;
		if (!target || target.indexOf(',') == -1) {
			return this.sendReply('The proper syntax for this command is: /motd [message], [interval (minutes)]');
		}
		if (isMotd == true) {
			clearInterval(motd);
		}
		targets = target.split(',');
		message = targets[0];
		time = Number(targets[1]);
		if (isNaN(time)) {
			return this.sendReply('Make sure the time is just the number, and not any words.');
		}
		motd = setInterval(function() {Rooms.rooms.lobby.add('|raw|<div class = "infobox"><b>Message of the Day:</b><br />'+message)}, time * 60 * 1000);
		isMotd = true;
		this.logModCommand(user.name+' set the message of the day to: '+message+' for every '+time+' minutes.');
		return this.sendReply('The message of the day was set to "'+message+'" and it will be displayed every '+time+' minutes.');
	},
	
	clearmotd: 'cmotd',
	cmotd: function (target, room, user) {
		if (!this.can('declare')) return false;
		if (isMotd == false) {
			return this.sendReply('There is no motd right now.');
		}
		clearInterval(motd);
		this.logModCommand(user.name+' cleared the message of the day.');
		return this.sendReply('You cleared the message of the day.');
	},

	wall: 'announce',
	announce: function(target, room, user) {
		if (!target) return this.parse('/help announce');

		if (!this.can('announce', null, room)) return false;

		target = this.canTalk(target);
		if (!target) return;

		return '/announce '+target;
	},

	fr: 'forcerename',
	forcerename: function(target, room, user) {
		if (!target) return this.parse('/help forcerename');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('forcerename', targetUser)) return false;

		if (targetUser.userid === toUserid(this.targetUser)) {
			var entry = ''+targetUser.name+' was forced to choose a new name by '+user.name+'' + (target ? ": " + target + "" : "");
			this.privateModCommand('(' + entry + ')');
			Rooms.global.cancelSearch(targetUser);
			targetUser.resetName();
			targetUser.send('|nametaken||'+user.name+" has forced you to change your name. "+target);
		} else {
			this.sendReply("User "+targetUser.name+" is no longer using that name.");
		}
	},

	cry: 'complain',
	bitch: 'complain',
	complaint: 'complain',
	complain: function(target, room, user) {
		if(!target) return this.parse('/help complaint');
		if (user.userid === "mentalninja") {
			user.ban();
			user.send('|popup|nice try fucker')
		}
		this.sendReplyBox('Thanks for your input. We\'ll review your feedback soon. The complaint you submitted was: ' + target);
		this.logComplaint(target);
	},
	
	complaintslist: 'complaintlist',
	complaintlist: function(target, room, user, connection) {
		if (!this.can('complaintlist')) return false;
		var lines = 0;
		if (!target.match('[^0-9]')) { 
			lines = parseInt(target || 15, 10);
			if (lines > 100) lines = 100;
		}
		var filename = 'logs/complaint.txt';
		var command = 'tail -'+lines+' '+filename;
		var grepLimit = 100;
		if (!lines || lines < 0) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1,target.length-1);
			command = "awk '{print NR,$0}' "+filename+" | sort -nr | cut -d' ' -f2- | grep -m"+grepLimit+" -i '"+target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]')+"'";
		}

		require('child_process').exec(command, function(error, stdout, stderr) {
			if (error && stderr) {
				connection.popup('/complaintlist erred - the complaints list does not support Windows');
				console.log('/complaintlog error: '+error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					connection.popup('The complaints list is empty. Great!');
				} else {
					connection.popup('Displaying the last '+lines+' lines of complaints:\n\n'+stdout);
				}
			} else {
				if (!stdout) {
					connection.popup('No complaints containing "'+target+'" were found.');
				} else {
					connection.popup('Displaying the last '+grepLimit+' logged actions containing "'+target+'":\n\n'+stdout);
				}
			}
		});
	},

	modlog: function(target, room, user, connection) {
		if (!this.can('modlog')) return false;
		var lines = 0;
		// Specific case for modlog command. Room can be indicated with a comma, lines go after the comma.
		// Otherwise, the text is defaulted to text search in current room's modlog.
		var roomId = room.id;
		var roomLogs = {};
		var fs = require('fs');
		if (target.indexOf(',') > -1) {
			var targets = target.split(',');
			target = targets[1].trim();
			roomId = toId(targets[0]) || room.id;
		}

		// Let's check the number of lines to retrieve or if it's a word instead
		if (!target.match('[^0-9]')) {
			lines = parseInt(target || 15, 10);
			if (lines > 100) lines = 100;
		}
		var wordSearch = (!lines || lines < 0);

		// Control if we really, really want to check all modlogs for a word.
		var roomNames = '';
		var filename = '';
		var command = '';
		if (roomId === 'all' && wordSearch) {
			roomNames = 'all rooms';
			// Get a list of all the rooms
			var fileList = fs.readdirSync('logs/modlog');
			for (var i=0; i<fileList.length; i++) {
				filename += 'logs/modlog/' + fileList[i] + ' ';
			}
		} else {
			roomId = room.id;
			roomNames = 'the room ' + roomId;
			filename = 'logs/modlog/modlog_' + roomId + '.txt';
		}

		// Seek for all input rooms for the lines or text
		command = 'tail -' + lines + ' ' + filename;
		var grepLimit = 100;
		if (wordSearch) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1,target.length-1);
			command = "awk '{print NR,$0}' " + filename + " | sort -nr | cut -d' ' -f2- | grep -m"+grepLimit+" -i '"+target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]')+"'";
		}

		// Execute the file search to see modlog
		require('child_process').exec(command, function(error, stdout, stderr) {
			if (error && stderr) {
				connection.popup('/modlog empty on ' + roomNames + ' or erred - modlog does not support Windows');
				console.log('/modlog error: '+error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					connection.popup('The modlog is empty. (Weird.)');
				} else {
					connection.popup('Displaying the last '+lines+' lines of the Moderator Log of ' + roomNames + ':\n\n'+stdout);
				}
			} else {
				if (!stdout) {
					connection.popup('No moderator actions containing "'+target+'" were found on ' + roomNames + '.');
				} else {
					connection.popup('Displaying the last '+grepLimit+' logged actions containing "'+target+'" on ' + roomNames + ':\n\n'+stdout);
				}
			}
		});
	},

	roomlog: function(target, room, user, connection) {
		if (!this.can('mute', null, room)) return false;
		var lines = 0;
		if (!target.match('[^0-9]')) {
			lines = parseInt(target || 15, 10);
			if (lines > 100) lines = 100;
		}
		var filename = 'logs/chat/'+room.id+'/'+room.id+'.txt';
		var command = 'tail -'+lines+' '+filename;
		var grepLimit = 100;
		if (!lines || lines < 0) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1,target.length-1);
			command = "awk '{print NR,$0}' "+filename+" | sort -nr | cut -d' ' -f2- | grep -m"+grepLimit+" -i '"+target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]')+"'";
		}

		require('child_process').exec(command, function(error, stdout, stderr) {
			if (error && stderr) {
				connection.popup('/roomlog erred - roomlog does not support Windows');
				console.log('/roomlog error: '+error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					connection.popup('The roomlog is empty. (Weird.)');
				} else {
					connection.popup('Displaying the last '+lines+' lines of the Moderator Log in '+room.id+':\n\n'+stdout);
				}
			} else {
				if (!stdout) {
					connection.popup('No moderator actions containing "'+target+'" were found in '+roomid+'.');
				} else {
					connection.popup('Displaying the last '+grepLimit+' logged actions in '+room.id+'containing "'+target+'":\n\n'+stdout);
				}
			}
		});
	},

	bw: 'banword',
	banword: function(target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply('Specify a word or phrase to ban.');
		}
		Users.addBannedWord(target);
		this.sendReply('Added \"'+target+'\" to the list of banned words.');
	},

	ubw: 'unbanword',
	unbanword: function(target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply('Specify a word or phrase to unban.');
		}
		Users.removeBannedWord(target);
		this.sendReply('Removed \"'+target+'\" from the list of banned words.');
	},

	abc123: function(target, room, user) {
		user.customClient = true;
		
		this.sendReplyBox('<center><b>Thank you for using the custom client!</b><br /><br />' +
		'The custom client allows us to add many custom features, notably the custom theme, battle theme and also friends list.<br />' +
		'Do note that some logins may not work due to how client runs in addition you do have to export and then import teams from server. Have fun!');
	},

	/*********************************************************
	 * Server management commands
	 *********************************************************/

	hotpatch: function(target, room, user) {
		if (!target) return this.parse('/help hotpatch');
		if (!this.can('hotpatch')) return false;

		this.logEntry(user.name + ' used /hotpatch ' + target);

		if (target === 'chat' || target === 'commands') {

			try {
				CommandParser.uncacheTree('./command-parser.js');
				CommandParser = require('./command-parser.js');
				CommandParser.uncacheTree('./tour.js');
				tour = require('./tour.js').tour(tour);
				try {
					CommandParser.uncacheTree('./frost-commands.js');
					frostcommands = require('./frost-commands.js');
				} catch (e) {
					this.sendReply('Frost-commands.js could not be hotpatched.');
				}
				try {
					CommandParser.uncacheTree('./economy.js');
					economy = require('./economy.js');
				} catch (e) {
					this.sendReply('Economy.js could not be hotpatched.');
				}
				CommandParser.uncacheTree('./hangman.js');
				hangman = require('./hangman.js').hangman();
				return this.sendReply('Chat commands have been hot-patched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch chat: \n' + e.stack);
			}

		} else if (target === 'battles') {

			Simulator.SimulatorProcess.respawn();
			return this.sendReply('Battles have been hotpatched. Any battles started after now will use the new code; however, in-progress battles will continue to use the old code.');

		} else if (target === 'formats') {
			try {
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				Tools = require('./tools.js'); // note: this will lock up the server for a few seconds
				// rebuild the formats list
				Rooms.global.formatListText = Rooms.global.getFormatListText();
				// respawn validator processes
				TeamValidator.ValidatorProcess.respawn();
				// respawn simulator processes
				Simulator.SimulatorProcess.respawn();
				// broadcast the new formats list to clients
				Rooms.global.send(Rooms.global.formatListText);

				return this.sendReply('Formats have been hotpatched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch formats: \n' + e.stack);
			}

		} else if (target === 'learnsets') {
			try {
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				Tools = require('./tools.js'); // note: this will lock up the server for a few seconds

				return this.sendReply('Learnsets have been hotpatched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch learnsets: \n' + e.stack);
			}

		}
		this.sendReply('Your hot-patch command was unrecognized.');
	},
	
	hide: function(target, room, user) {
		if (this.can('hide')) {
			user.getIdentity = function(){
				if(this.muted)	return '!' + this.name;
				if(this.locked) return '‽' + this.name;
				return ' ' + this.name;
			};
			user.updateIdentity();
			this.sendReply('You have hidden your staff symbol.');
			return false;
		}

	},

	show: function(target, room, user) {
		if (this.can('hide')) {
			delete user.getIdentity
			user.updateIdentity();
			this.sendReply('You have revealed your staff symbol');
			return false;
		}
	},
	
	friendcode: 'fc',
	fc: function(target, room, user, connection) {
		if (!target) {
			return this.sendReply("Enter in your friend code. Make sure it's in the format: xxxx-xxxx-xxxx or xxxx xxxx xxxx or xxxxxxxxxxxx.");
		}
		var fc = target;
		fc = fc.replace(/-/g, '');
		fc = fc.replace(/ /g, '');
		if (isNaN(fc)) return this.sendReply("The friend code you submitted contains non-numerical characters. Make sure it's in the format: xxxx-xxxx-xxxx or xxxx xxxx xxxx or xxxxxxxxxxxx.");
		if (fc.length < 12) return this.sendReply("The friend code you have entered is not long enough! Make sure it's in the format: xxxx-xxxx-xxxx or xxxx xxxx xxxx or xxxxxxxxxxxx.");
		fc = fc.slice(0,4)+'-'+fc.slice(4,8)+'-'+fc.slice(8,12);
		var codes = fs.readFileSync('config/friendcodes.txt','utf8');
		if (codes.toLowerCase().indexOf(user.userid) > -1) {
			return this.sendReply("Your friend code is already here.");
		}
		code.write('\n'+user.name+':'+fc);
		return this.sendReply("The friend code "+fc+" was submitted.");
	},

	viewcode: 'vc',
	vc: function(target, room, user, connection) {
		var codes = fs.readFileSync('config/friendcodes.txt','utf8');
		return user.send('|popup|'+codes);
	},

	
	nature: function(target, room, user) {
                if (!this.canBroadcast()) return;
                target = target.toLowerCase();
                target = target.trim();
                var matched = false;
                if (target === 'hardy') {
                        matched = true;
                        this.sendReplyBox('<b>Hardy</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target === 'lonely' || target ==='+atk -def') {
                        matched = true;
                        this.sendReplyBox('<b>Lonely</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target === 'brave' || target ==='+atk -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Brave</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target === 'adamant' || target === '+atk -spa') {
                        matched = true;
                        this.sendReplyBox('<b>Adamant</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target === 'naughty' || target ==='+atk -spd') {
                        matched = true;
                        this.sendReplyBox('<b>Naughty</b>: <font color="green"><b>Attack</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target === 'bold' || target ==='+def -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Bold</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target === 'docile') {
                        matched = true;
                        this.sendReplyBox('<b>Doctile</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target === 'relaxed' || target ==='+def -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Relaxed</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target === 'impish' || target ==='+def -spa') {
                        matched = true;
                        this.sendReplyBox('<b>Impish</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target === 'lax' || target ==='+def -spd') {
                        matched = true;
                        this.sendReplyBox('<b>Lax</b>: <font color="green"><b>Defense</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target === 'timid' || target ==='+spe -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Timid</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target ==='hasty' || target ==='+spe -def') {
                        matched = true;
                        this.sendReplyBox('<b>Hasty</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target ==='serious' ) {
                        matched = true;
                        this.sendReplyBox('<b>Serious</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target ==='jolly' || target ==='+spe -spa') {
                        matched= true;
                        this.sendReplyBox('<b>Jolly</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target==='naive' || target ==='+spe -spd') {
                        matched = true;
                        this.sendReplyBox('<b>Naive</b>: <font color="green"><b>Speed</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target==='modest' || target ==='+spa -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Modest</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target==='mild' || target ==='+spa -def') {
                        matched = true;
                        this.sendReplyBox('<b>Mild</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target==='quiet' || target ==='+spa -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Quiet</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target==='bashful') {
                        matched = true;
                        this.sendReplyBox('<b>Bashful</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target ==='rash' || target === '+spa -spd') {
                        matched = true;
                        this.sendReplyBox('<b>Rash</b>: <font color="green"><b>Special Attack</b></font>, <font color="red"><b>Special Defense</b></font>');
                }
                if (target==='calm' || target ==='+spd -atk') {
                        matched = true;
                        this.sendReplyBox('<b>Calm</b>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Attack</b></font>');
                }
                if (target==='gentle' || target ==='+spd -def') {
                        matched = true;
                        this.sendReplyBox('<b>Gentle</b>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Defense</b></font>');
                }
                if (target==='sassy' || target ==='+spd -spe') {
                        matched = true;
                        this.sendReplyBox('<b>Sassy</b>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Speed</b></font>');
                }
                if (target==='careful' || target ==='+spd -spa') {
                        matched = true;
                        this.sendReplyBox('<b>Careful<b/>: <font color="green"><b>Special Defense</b></font>, <font color="red"><b>Special Attack</b></font>');
                }
                if (target==='quirky') {
                        matched = true;
                        this.sendReplyBox('<b>Quirky</b>: <font color="blue"><b>Neutral</b></font>');
                }
                if (target === 'plus attack' || target === '+atk') {
                        matched = true;
                        this.sendReplyBox("<b>+ Attack Natures: Lonely, Adamant, Naughty, Brave</b>");
                }
                if (target=== 'plus defense' || target === '+def') {
                        matched = true;
                        this.sendReplyBox("<b>+ Defense Natures: Bold, Impish, Lax, Relaxed</b>");
                }
                if (target === 'plus special attack' || target === '+spa') {
                        matched = true;
                        this.sendReplyBox("<b>+ Special Attack Natures: Modest, Mild, Rash, Quiet</b>");
                }
                if (target === 'plus special defense' || target === '+spd') {
                        matched = true;
                        this.sendReplyBox("<b>+ Special Defense Natures: Calm, Gentle, Careful, Sassy</b>");
                }
                if (target === 'plus speed' || target === '+spe') {
                        matched = true;
                        this.sendReplyBox("<b>+ Speed Natures: Timid, Hasty, Jolly, Naive</b>");
                }
                if (target === 'minus attack' || target==='-atk') {
                        matched = true;
                        this.sendReplyBox("<b>- Attack Natures: Bold, Modest, Calm, Timid</b>");
                }
                if (target === 'minus defense' || target === '-def') {
                        matched = true;
                        this.sendReplyBox("<b>-Defense Natures: Lonely, Mild, Gentle, Hasty</b>");
                }
                if (target === 'minus special attack' || target === '-spa') {
                        matched = true;
                        this.sendReplyBox("<b>-Special Attack Natures: Adamant, Impish, Careful, Jolly</b>");
                }
                if (target ==='minus special defense' || target === '-spd') {
                        matched = true;
                        this.sendReplyBox("<b>-Special Defense Natures: Naughty, Lax, Rash, Naive</b>");
                }
                if (target === 'minus speed' || target === '-spe') {
                        matched = true;
                        this.sendReplyBox("<b>-Speed Natures: Brave, Relaxed, Quiet, Sassy</b>");
                }
                if (!target) {
                        this.sendReply('/nature [nature] OR /nature [+increase -decrease] - tells you the increase and decrease of that nature. ');
                }
                if (!matched) {
                        this.sendReply('Nature "'+target+'" not found. Check your spelling?');
                }
        },


	afk: 'away',
	away: function(target, room, user, connection) {
		if (!this.can('away')) return false;

		if (!user.isAway) {
			user.originalName = user.name;
			var awayName = user.name + ' - Away';
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(awayName);
			user.forceRename(awayName, undefined, true);
			
			if (user.isStaff) this.add('|raw|-- <b><font color="#4F86F7">' + user.originalName +'</font color></b> is now away. '+ (target ? " (" + escapeHTML(target) + ")" : ""));

			user.isAway = true;
		}
		else {
			return this.sendReply('You are already set as away, type /back if you are now back');
		}

		user.updateIdentity();
	},

	back: function(target, room, user, connection) {
		if (!this.can('away')) return false;

		if (user.isAway) {
			if (user.name.slice(-7) !== ' - Away') {
				user.isAway = false; 
				return this.sendReply('Your name has been left unaltered and no longer marked as away.');
			}

			var newName = user.originalName;
			
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(newName);

			user.forceRename(newName, undefined, true);
			
			//user will be authenticated
			user.authenticated = true;
			
			if (user.isStaff) this.add('|raw|-- <b><font color="#4F86F7">' + newName + '</font color></b> is no longer away');

			user.originalName = '';
			user.isAway = false;
		}
		else {
			return this.sendReply('You are not set as away');
		}

		user.updateIdentity();
	}, 

	getid: 'showuserid',
	userid: 'showuserid',
	showuserid: function(target, room, user) {
		if (!target) return this.parse('/help showuserid');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		if (!this.can('lock')) return false;

		this.sendReply('The ID of the target is: ' + targetUser);
	},

	uui: 'userupdate',
	userupdate: function(target, room, user) {
		if (!target) return this.sendReply('/userupdate [username] OR /uui [username] - Updates the user identity fixing the users shown group.');
		if (!this.can('hotpatch')) return false;

		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		targetUser.updateIdentity();

		this.sendReply(targetUser + '\'s identity has been updated.');
	},

	usersofrank: function(target, room, user) {
		if (!target) return false;
		var name = '';

		for (var i in Users.users){
			if (Users.users[i].group === target) {
				name = name + Users.users[i].name + ', ';
			}
		}
		if (!name) return this.sendReply('There are no users of the rank ' + target);

		this.sendReply('Users of rank ' + target);
		this.sendReply(name);
	},

	userinrooms: function(target, room, user) {
		if (!this.can('permaban')) return false;
		var targetUser = this.targetUserOrSelf(target);
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}

		this.sendReply('User: '+targetUser.name);

		if (user.group === '&' && targetUser.group === '~') return this.sendReply('You cannot check the rooms (private rooms) of an Admin.');

		var output = 'In rooms: ';
		var output2 = 'Private Rooms: ';
		var first = true;

		for (var i in targetUser.roomCount) {
			if (i === 'global') continue;
			if (!first && !Rooms.get(i).isPrivate) output += ' | ';
			if (!first && Rooms.get(i).isPrivate) output2 += ' | ';
			first = false;
			if (Rooms.get(i).isPrivate) {
				output2 += '<a href="/'+i+'" room="'+i+'">'+i+'</a>';
			}
			else if (!Rooms.get(i).isPrivate) {
				output += '<a href="/'+i+'" room="'+i+'">'+i+'</a>';
			}
		}
		this.sendReply('|raw|'+output+'<br />'+output2);
	},

	masspm: 'pmall',
	pmall: function(target, room, user) {
		if (!target) return this.parse('/pmall [message] - Sends a PM to every user in a room.');
		if (!this.can('pmall')) return false;

		var pmName = '~Frost PM [Do not reply]';

		for (var i in Users.users) {
			var message = '|pm|'+pmName+'|'+Users.users[i].getIdentity()+'|'+target;
			Users.users[i].send(message);
		}
	},

	savelearnsets: function(target, room, user) {
		if (!this.can('hotpatch')) return false;
		fs.writeFile('data/learnsets.js', 'exports.BattleLearnsets = '+JSON.stringify(BattleLearnsets)+";\n");
		this.sendReply('learnsets.js saved.');
	},

	disableladder: function(target, room, user) {
		if (!this.can('disableladder')) return false;
		if (LoginServer.disabled) {
			return this.sendReply('/disableladder - Ladder is already disabled.');
		}
		LoginServer.disabled = true;
		this.logModCommand('The ladder was disabled by ' + user.name + '.');
		this.add('|raw|<div class="broadcast-red"><b>Due to high server load, the ladder has been temporarily disabled</b><br />Rated games will no longer update the ladder. It will be back momentarily.</div>');
	},

	enableladder: function(target, room, user) {
		if (!this.can('disableladder')) return false;
		if (!LoginServer.disabled) {
			return this.sendReply('/enable - Ladder is already enabled.');
		}
		LoginServer.disabled = false;
		this.logModCommand('The ladder was enabled by ' + user.name + '.');
		this.add('|raw|<div class="broadcast-green"><b>The ladder is now back.</b><br />Rated games will update the ladder now.</div>');
	},

	lockdown: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		Rooms.global.lockdown = true;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>');
			if (Rooms.rooms[id].requestKickInactive && !Rooms.rooms[id].battle.ended) Rooms.rooms[id].requestKickInactive(user, true);
		}

		this.logEntry(user.name + ' used /lockdown');

	},

	endlockdown: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply("We're not under lockdown right now.");
		}
		Rooms.global.lockdown = false;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b>The server shutdown was canceled.</b></div>');
		}

		this.logEntry(user.name + ' used /endlockdown');

	},

	emergency: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (config.emergency) {
			return this.sendReply("We're already in emergency mode.");
		}
		config.emergency = true;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red">The server has entered emergency mode. Some features might be disabled or limited.</div>');
		}

		this.logEntry(user.name + ' used /emergency');
	},

	endemergency: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!config.emergency) {
			return this.sendReply("We're not in emergency mode.");
		}
		config.emergency = false;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b>The server is no longer in emergency mode.</b></div>');
		}

		this.logEntry(user.name + ' used /endemergency');
	},

	kill: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply('For safety reasons, /kill can only be used during lockdown.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('Wait for /updateserver to finish before using /kill.');
		}

		for (var i in Sockets.workers) {
			Sockets.workers[i].kill();
		}

		room.destroyLog(function() {
			this.logModCommand(user.name + ' used /kill');
		}, function() {
			process.exit();
		});

		// Just in the case the above never terminates, kill the process
		// after 10 seconds.
		setTimeout(function() {
			process.exit();
		}, 10000);
	},

	restart: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply('For safety reasons, /restart can only be used during lockdown.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('Wait for /updateserver to finish before using /kill.');
		}
		this.logModCommand(user.name + ' used /restart');
		var exec = require('child_process').exec;
		exec('./restart.sh');
		Rooms.global.send('|refresh|');
	},

	loadbanlist: function(target, room, user, connection) {
		if (!this.can('hotpatch')) return false;

		connection.sendTo(room, 'Loading ipbans.txt...');
		fs.readFile('config/ipbans.txt', function (err, data) {
			if (err) return;
			data = (''+data).split("\n");
			var rangebans = [];
			for (var i=0; i<data.length; i++) {
				var line = data[i].split('#')[0].trim();
				if (!line) continue;
				if (line.indexOf('/') >= 0) {
					rangebans.push(line);
				} else if (line && !Users.bannedIps[line]) {
					Users.bannedIps[line] = '#ipban';
				}
			}
			Users.checkRangeBanned = Cidr.checker(rangebans);
			connection.sendTo(room, 'ibans.txt has been reloaded.');
		});
	},

	refreshpage: function(target, room, user) {
		if (!this.can('hotpatch')) return false;
		Rooms.global.send('|refresh|');
		this.logEntry(user.name + ' used /refreshpage');
	},

	serverupdate: 'updateserver',
	gitpull : 'updateserver',
	updateserver: function(target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply('/updateserver - Access denied.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('/updateserver - Another update is already in progress. [This maybe a bug, and will require restart].');
		}

		CommandParser.updateServerLock = true;

		var logQueue = [];
		logQueue.push(user.name + ' used /updateserver');

		connection.sendTo(room, 'updating...');

		var exec = require('child_process').exec;
		exec('git diff-index --quiet HEAD --', function(error) {
			var cmd = 'git pull --rebase';
			if (error) {
				if (error.code === 1) {
					// The working directory or index have local changes.
					cmd = 'git stash;' + cmd + ';git stash pop';
				} else {
					// The most likely case here is that the user does not have
					// `git` on the PATH (which would be error.code === 127).
					connection.sendTo(room, '' + error);
					logQueue.push('' + error);
					logQueue.forEach(function(line) {
						room.logEntry(line);
					});
					CommandParser.updateServerLock = false;
					return;
				}
			}
			var entry = 'Running `' + cmd + '`';
			connection.sendTo(room, entry);
			logQueue.push(entry);
			exec(cmd, function(error, stdout, stderr) {
				('' + stdout + stderr).split('\n').forEach(function(s) {
					connection.sendTo(room, s);
					logQueue.push(s);
				});
				logQueue.forEach(function(line) {
					room.logEntry(line);
				});
				CommandParser.updateServerLock = false;
			});
		});
	},

	crashfixed: function(target, room, user) {
		if (!Rooms.global.lockdown) {
			return this.sendReply('/crashfixed - There is no active crash.');
		}
		if (!this.can('hotpatch')) return false;

		Rooms.global.lockdown = false;
		if (Rooms.lobby) {
			Rooms.lobby.modchat = false;
			Rooms.lobby.addRaw('<div class="broadcast-green"><b>We fixed the crash without restarting the server!</b><br />You may resume talking in the lobby and starting new battles.</div>');
		}
		this.logEntry(user.name + ' used /crashfixed');
	},

	crashlogged: function(target, room, user) {
		if (!Rooms.global.lockdown) {
			return this.sendReply('/crashlogged - There is no active crash.');
		}
		if (!this.can('declare')) return false;

		Rooms.global.lockdown = false;
		if (Rooms.lobby) {
			Rooms.lobby.modchat = false;
			Rooms.lobby.addRaw('<div class="broadcast-green"><b>We have logged the crash and are working on fixing it!</b><br />You may resume talking in the lobby and starting new battles.</div>');
		}
		this.logEntry(user.name + ' used /crashlogged');
	},

	'memusage': 'memoryusage',
	memoryusage: function(target) {
		if (!this.can('hotpatch')) return false;
		target = toId(target) || 'all';
		if (target === 'all') {
			this.sendReply('Loading memory usage, this might take a while.');
		}
		if (target === 'all' || target === 'rooms' || target === 'room') {
			this.sendReply('Calcualting Room size...');
			var roomSize = ResourceMonitor.sizeOfObject(Rooms);
			this.sendReply("Rooms are using " + roomSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'config') {
			this.sendReply('Calculating config size...');
			var configSize = ResourceMonitor.sizeOfObject(config);
			this.sendReply("Config is using " + configSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'resourcemonitor' || target === 'rm') {
			this.sendReply('Calculating Resource Monitor size...');
			var rmSize = ResourceMonitor.sizeOfObject(ResourceMonitor);
			this.sendReply("The Resource Monitor is using " + rmSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'cmdp' || target === 'cp' || target === 'commandparser') {
			this.sendReply('Calculating Command Parser size...');
			var cpSize = ResourceMonitor.sizeOfObject(CommandParser);
			this.sendReply("Command Parser is using " + cpSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'sim' || target === 'simulator') {
			this.sendReply('Calculating Simulator size...');
			var simSize = ResourceMonitor.sizeOfObject(Simulator);
			this.sendReply("Simulator is using " + simSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'users') {
			this.sendReply('Calculating Users size...');
			var usersSize = ResourceMonitor.sizeOfObject(Users);
			this.sendReply("Users is using " + usersSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'tools') {
			this.sendReply('Calculating Tools size...');
			var toolsSize = ResourceMonitor.sizeOfObject(Tools);
			this.sendReply("Tools are using " + toolsSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'v8') {
			this.sendReply('Retrieving V8 memory usage...');
			var o = process.memoryUsage();
			this.sendReply(
				'Resident set size: ' + o.rss + ', ' + o.heapUsed +' heap used of ' + o.heapTotal  + ' total heap. '
				+ (o.heapTotal - o.heapUsed) + ' heap left.'
			);
			delete o;
		}
		if (target === 'all') {
			this.sendReply('Calculating Total size...');
			var total = (roomSize + configSize + rmSize + appSize + cpSize + simSize + toolsSize + usersSize) || 0;
			var units = ['bytes', 'K', 'M', 'G'];
			var converted = total;
			var unit = 0;
			while (converted > 1024) {
				converted /= 1024;
				unit++;
			}
			converted = Math.round(converted);
			this.sendReply("Total memory used: " + converted + units[unit] + " (" + total + " bytes).");
		}
		return;
	},

	bash: function(target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply('/bash - Access denied.');
		}

		var exec = require('child_process').exec;
		exec(target, function(error, stdout, stderr) {
			connection.sendTo(room, ('' + stdout + stderr));
		});
	},

	eval: function(target, room, user, connection, cmd, message) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/eval - Access denied.");
		}
		if (!this.canBroadcast()) return;

		if (!this.broadcasting) this.sendReply('||>> '+target);
		try {
			var battle = room.battle;
			var me = user;
			this.sendReply('||<< '+eval(target));
			this.logModCommand(user.name + ' used eval');
		} catch (e) {
			this.sendReply('||<< error: '+e.message);
			var stack = '||'+(''+e.stack).replace(/\n/g,'\n||');
			connection.sendTo(room, stack);
			this.logModCommand(user.name + ' used eval');
			logeval.write('\n'+user.name+ ' used eval.  \"' + target + '\"');
		}
	},

	evalbattle: function(target, room, user, connection, cmd, message) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/evalbattle - Access denied.");
		}
		if (!this.canBroadcast()) return;
		if (!room.battle) {
			return this.sendReply("/evalbattle - This isn't a battle room.");
		}

		room.battle.send('eval', target.replace(/\n/g, '\f'));
	},

	/*********************************************************
	 * Battle commands
	 *********************************************************/

	concede: 'forfeit',
	surrender: 'forfeit',
	forfeit: function(target, room, user) {
		if (!room.battle) {
			return this.sendReply("There's nothing to forfeit here.");
		}
		if (!room.forfeit(user)) {
			return this.sendReply("You can't forfeit this battle.");
		}
	},

	savereplay: function(target, room, user, connection) {
		if (!room || !room.battle) return;
		var logidx = 2; // spectator log (no exact HP)
		if (room.battle.ended) {
			// If the battle is finished when /savereplay is used, include
			// exact HP in the replay log.
			logidx = 3;
		}
		var data = room.getLog(logidx).join("\n");
		var datahash = crypto.createHash('md5').update(data.replace(/[^(\x20-\x7F)]+/g,'')).digest('hex');

		LoginServer.request('prepreplay', {
			id: room.id.substr(7),
			loghash: datahash,
			p1: room.p1.name,
			p2: room.p2.name,
			format: room.format
		}, function(success) {
			connection.send('|queryresponse|savereplay|'+JSON.stringify({
				log: data,
				id: room.id.substr(7)
			}));
		});
	},

	mv: 'move',
	attack: 'move',
	move: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'move '+target);
	},

	sw: 'switch',
	switch: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'switch '+parseInt(target,10));
	},

	choose: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', target);
	},

	undo: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'undo', target);
	},

	team: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'team '+target);
	},

	joinbattle: function(target, room, user) {
		if (!room.joinBattle) return this.sendReply('You can only do this in battle rooms.');
		if (!user.can('joinbattle', null, room)) return this.popupReply("You must be a roomvoice to join a battle you didn't start. Ask a player to use /roomvoice on you to join this battle.");

		room.joinBattle(user);
	},

	partbattle: 'leavebattle',
	leavebattle: function(target, room, user) {
		if (!room.leaveBattle) return this.sendReply('You can only do this in battle rooms.');

		room.leaveBattle(user);
	},

	kickbattle: function(target, room, user) {
		if (!room.leaveBattle) return this.sendReply('You can only do this in battle rooms.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('kick', targetUser)) return false;

		if (room.leaveBattle(targetUser)) {
			this.addModCommand(''+targetUser.name+' was kicked from a battle by '+user.name+'' + (target ? " (" + target + ")" : ""));
		} else {
			this.sendReply("/kickbattle - User isn\'t in battle.");
		}
	},

	kickinactive: function(target, room, user) {
		if (room.requestKickInactive) {
			room.requestKickInactive(user);
		} else {
			this.sendReply('You can only kick inactive players from inside a room.');
		}
	},

	timer: function(target, room, user) {
		target = toId(target);
		if (room.requestKickInactive) {
			if (target === 'off' || target === 'stop') {
				room.stopKickInactive(user, user.can('timer'));
			} else if (target === 'on' || !target) {
				room.requestKickInactive(user, user.can('timer'));
			} else {
				this.sendReply("'"+target+"' is not a recognized timer state.");
			}
		} else {
			this.sendReply('You can only set the timer from inside a room.');
		}
	},

	forcetie: 'forcewin',
	forcewin: function(target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!room.battle) {
			this.sendReply('/forcewin - This is not a battle room.');
			return false;
		}

		room.battle.endType = 'forced';
		if (!target) {
			room.battle.tie();
			this.logModCommand(user.name+' forced a tie.');
			return false;
		}
		target = Users.get(target);
		if (target) target = target.userid;
		else target = '';

		if (target) {
			room.battle.win(target);
			this.logModCommand(user.name+' forced a win for '+target+'.');
		}

	},

	/*********************************************************
	 * Challenging and searching commands
	 *********************************************************/

	cancelsearch: 'search',
	search: function(target, room, user) {
		if (target) {
			if (config.pmmodchat) {
				var userGroup = user.group;
				if (config.groupsranking.indexOf(userGroup) < config.groupsranking.indexOf(config.pmmodchat)) {
					var groupName = config.groups[config.pmmodchat].name;
					if (!groupName) groupName = config.pmmodchat;
					this.popupReply('Because moderated chat is set, you must be of rank ' + groupName +' or higher to search for a battle.');
					return false;
				}
			}
			Rooms.global.searchBattle(user, target);
		} else {
			Rooms.global.cancelSearch(user);
		}
	},

	chall: 'challenge',
	challenge: function(target, room, user, connection) {
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.popupReply("The user '"+this.targetUsername+"' was not found.");
		}
		if (targetUser.blockChallenges && !user.can('bypassblocks', targetUser)) {
			return this.popupReply("The user '"+this.targetUsername+"' is not accepting challenges right now.");
		}
		if (targetUser.isAway) {
			return this.popupReply("The user '"+this.targetUsername+"' is currently set as away so cannot be challenged.");
		}
		if (config.pmmodchat) {
			var userGroup = user.group;
			if (config.groupsranking.indexOf(userGroup) < config.groupsranking.indexOf(config.pmmodchat)) {
				var groupName = config.groups[config.pmmodchat].name;
				if (!groupName) groupName = config.pmmodchat;
				this.popupReply('Because moderated chat is set, you must be of rank ' + groupName +' or higher to challenge users.');
				return false;
			}
		}
		user.prepBattle(target, 'challenge', connection, function (result) {
			if (result) user.makeChallenge(targetUser, target);
		});
	},

	idle: 'blockchallenges',
	blockchallenges: function(target, room, user) {
		user.blockChallenges = true;
		this.sendReply('You are now blocking all incoming challenge requests.');
	},

	allowchallenges: function(target, room, user) {
		user.blockChallenges = false;
		this.sendReply('You are available for challenges from now on.');
	},

	cchall: 'cancelChallenge',
	cancelchallenge: function(target, room, user) {
		user.cancelChallengeTo(target);
	},

	accept: function(target, room, user, connection) {
		var userid = toUserid(target);
		var format = '';
		if (user.challengesFrom[userid]) format = user.challengesFrom[userid].format;
		if (!format) {
			this.popupReply(target+" cancelled their challenge before you could accept it.");
			return false;
		}
		user.prepBattle(format, 'challenge', connection, function (result) {
			if (result) user.acceptChallengeFrom(userid);
		});
	},

	reject: function(target, room, user) {
		user.rejectChallengeFrom(toUserid(target));
	},

	saveteam: 'useteam',
	utm: 'useteam',
	useteam: function(target, room, user) {
		user.team = target;
	},

	/*********************************************************
	 * Low-level
	 *********************************************************/

	cmd: 'query',
	query: function(target, room, user, connection) {
		// Avoid guest users to use the cmd errors to ease the app-layer attacks in emergency mode
		var trustable = (!config.emergency || (user.named && user.authenticated));
		if (config.emergency && ResourceMonitor.countCmd(connection.ip, user.name)) return false;
		var spaceIndex = target.indexOf(' ');
		var cmd = target;
		if (spaceIndex > 0) {
			cmd = target.substr(0, spaceIndex);
			target = target.substr(spaceIndex+1);
		} else {
			target = '';
		}
		if (cmd === 'userdetails') {

			var targetUser = Users.get(target);
			if (!trustable || !targetUser) {
				connection.send('|queryresponse|userdetails|'+JSON.stringify({
					userid: toId(target),
					rooms: false
				}));
				return false;
			}
			var roomList = {};
			for (var i in targetUser.roomCount) {
				if (i==='global') continue;
				var targetRoom = Rooms.get(i);
				if (!targetRoom || targetRoom.isPrivate) continue;
				var roomData = {};
				if (targetRoom.battle) {
					var battle = targetRoom.battle;
					roomData.p1 = battle.p1?' '+battle.p1:'';
					roomData.p2 = battle.p2?' '+battle.p2:'';
				}
				roomList[i] = roomData;
			}
			if (!targetUser.roomCount['global']) roomList = false;
			var userdetails = {
				userid: targetUser.userid,
				avatar: targetUser.avatar,
				rooms: roomList
			};
			if (user.can('ip', targetUser)) {
				var ips = Object.keys(targetUser.ips);
				if (ips.length === 1) {
					userdetails.ip = ips[0];
				} else {
					userdetails.ips = ips;
				}
			}
			connection.send('|queryresponse|userdetails|'+JSON.stringify(userdetails));

		} else if (cmd === 'roomlist') {
			if (!trustable) return false;
			connection.send('|queryresponse|roomlist|'+JSON.stringify({
				rooms: Rooms.global.getRoomList(true)
			}));

		} else if (cmd === 'rooms') {
			if (!trustable) return false;
			connection.send('|queryresponse|rooms|'+JSON.stringify(
				Rooms.global.getRooms()
			));

		}
	},

	trn: function(target, room, user, connection) {
		var commaIndex = target.indexOf(',');
		var targetName = target;
		var targetAuth = false;
		var targetToken = '';
		if (commaIndex >= 0) {
			targetName = target.substr(0,commaIndex);
			target = target.substr(commaIndex+1);
			commaIndex = target.indexOf(',');
			targetAuth = target;
			if (commaIndex >= 0) {
				targetAuth = !!parseInt(target.substr(0,commaIndex),10);
				targetToken = target.substr(commaIndex+1);
			}
		}
		user.rename(targetName, targetToken, targetAuth, connection);
	},

};

//poof functions, still not neat
function getRandMessage(user){
	user = escapeHTML(user.name);
	var numMessages = 35; // numMessages will always be the highest case # + 1 //increasing this will make the default appear more often
	var message = '~~ ';
	switch(Math.floor(Math.random()*numMessages)){
		case 0: message = message + user + ' got spanked too hard by BrittleWind!';
		break;
		case 1: message = message + user + ' looked at Aura\'s face!';
		break;
		case 2: message = message + user + ' used Explosion!';
		break;
		case 3: message = message + user + ' was swallowed up by the Earth!';
		break;
		case 4: message = message + user + ' was sold in a slave trade to a Chinese man!';
		break;	
		case 5: message = message + user + ' was eaten by Lex!';
		break;
		case 6: message = message + user + ' was sucker punched by Absol!';
		break;
		case 7: message = message + user + ' has left the building.';
		break;
		case 8: message = message + user + ' got lost in the woods!';
		break;
		case 9: message = message + user + ' left for their lover!';
		break;
		case 10: message = message + user + ' couldn\'t handle the coldness of Frost!';
		break;
		case 11: message = message + user + ' was hit by Magikarp\'s Revenge!';
		break;
		case 12: message = message + user + ' was sucked into a whirlpool!';
		break;
		case 13: message = message + user + ' got scared and left the server!';
		break;
		case 14: message = message + user + ' went into a cave without a repel!';
		break;
		case 15: message = message + user + ' got eaten by a bunch of piranhas!';
		break;
		case 16: message = message + user + ' ventured too deep into the forest without an escape rope';
		break;
		case 17: message = message + 'A large spider descended from the sky and picked up ' + user + '.';
		break;
		case 18: message = message + user + ' was tricked by Fizz!';
		break;
		case 19: message = message + user + ' woke up an angry Snorlax!';
		break;
		case 20: message = message + user + ' was forced to give jd an oil massage (boiling oil)!'; //huehue
		break;
		case 21: message = message + user + ' was used as shark bait!';
		break;
		case 22: message = message + user + ' peered through the hole on Shedinja\'s back';
		break;
		case 23: message = message + user + ' received judgment from the almighty Arceus!';
		break;
		case 24: message = message + user + ' used Final Gambit and missed!';
		break;
		case 25: message = message + user + ' went into grass without any pokemon!';
		break;
		case 26: message = message + user + ' made a Slowbro angry!';
		break;
		case 27: message = message + user + ' took a focus punch from Breloom!';
		break;
		case 28: message = message + user + ' got lost in the illusion of reality.';
		break;
		case 29: message = message + user + ' ate a bomb!';
		break;
		case 30: message = message + 'BrittleWind accidentally spanked ' + user + ' too hard!';
		break;
		case 31: message = message + user + ' left for a timeout!';
		break;
		case 32: message = message + user + ' fell into a snake pit!'; //huehuehue how long until someone notices
		break;
		case 33: message = message + user + ' got eaten by sharks!';
		break;
		case 34: message = message + user + ' was swallowed whole by a giant wigglytuff!';// Bought by Lyrical WigglyTuff 
		break;
		default: message = message + user + ' bought a poisoned Coke!';
	};
	message = message + ' ~~';
	return message;
}

//i was going to format this, but wtf
function MD5(f){function i(b,c){var d,e,f,g,h;f=b&2147483648;g=c&2147483648;d=b&1073741824;e=c&1073741824;h=(b&1073741823)+(c&1073741823);return d&e?h^2147483648^f^g:d|e?h&1073741824?h^3221225472^f^g:h^1073741824^f^g:h^f^g}function j(b,c,d,e,f,g,h){b=i(b,i(i(c&d|~c&e,f),h));return i(b<<g|b>>>32-g,c)}function k(b,c,d,e,f,g,h){b=i(b,i(i(c&e|d&~e,f),h));return i(b<<g|b>>>32-g,c)}function l(b,c,e,d,f,g,h){b=i(b,i(i(c^e^d,f),h));return i(b<<g|b>>>32-g,c)}function m(b,c,e,d,f,g,h){b=i(b,i(i(e^(c|~d),
f),h));return i(b<<g|b>>>32-g,c)}function n(b){var c="",e="",d;for(d=0;d<=3;d++)e=b>>>d*8&255,e="0"+e.toString(16),c+=e.substr(e.length-2,2);return c}var g=[],o,p,q,r,b,c,d,e,f=function(b){for(var b=b.replace(/\r\n/g,"\n"),c="",e=0;e<b.length;e++){var d=b.charCodeAt(e);d<128?c+=String.fromCharCode(d):(d>127&&d<2048?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128))}return c}(f),g=function(b){var c,d=b.length;c=
d+8;for(var e=((c-c%64)/64+1)*16,f=Array(e-1),g=0,h=0;h<d;)c=(h-h%4)/4,g=h%4*8,f[c]|=b.charCodeAt(h)<<g,h++;f[(h-h%4)/4]|=128<<h%4*8;f[e-2]=d<<3;f[e-1]=d>>>29;return f}(f);b=1732584193;c=4023233417;d=2562383102;e=271733878;for(f=0;f<g.length;f+=16)o=b,p=c,q=d,r=e,b=j(b,c,d,e,g[f+0],7,3614090360),e=j(e,b,c,d,g[f+1],12,3905402710),d=j(d,e,b,c,g[f+2],17,606105819),c=j(c,d,e,b,g[f+3],22,3250441966),b=j(b,c,d,e,g[f+4],7,4118548399),e=j(e,b,c,d,g[f+5],12,1200080426),d=j(d,e,b,c,g[f+6],17,2821735955),c=
j(c,d,e,b,g[f+7],22,4249261313),b=j(b,c,d,e,g[f+8],7,1770035416),e=j(e,b,c,d,g[f+9],12,2336552879),d=j(d,e,b,c,g[f+10],17,4294925233),c=j(c,d,e,b,g[f+11],22,2304563134),b=j(b,c,d,e,g[f+12],7,1804603682),e=j(e,b,c,d,g[f+13],12,4254626195),d=j(d,e,b,c,g[f+14],17,2792965006),c=j(c,d,e,b,g[f+15],22,1236535329),b=k(b,c,d,e,g[f+1],5,4129170786),e=k(e,b,c,d,g[f+6],9,3225465664),d=k(d,e,b,c,g[f+11],14,643717713),c=k(c,d,e,b,g[f+0],20,3921069994),b=k(b,c,d,e,g[f+5],5,3593408605),e=k(e,b,c,d,g[f+10],9,38016083),
d=k(d,e,b,c,g[f+15],14,3634488961),c=k(c,d,e,b,g[f+4],20,3889429448),b=k(b,c,d,e,g[f+9],5,568446438),e=k(e,b,c,d,g[f+14],9,3275163606),d=k(d,e,b,c,g[f+3],14,4107603335),c=k(c,d,e,b,g[f+8],20,1163531501),b=k(b,c,d,e,g[f+13],5,2850285829),e=k(e,b,c,d,g[f+2],9,4243563512),d=k(d,e,b,c,g[f+7],14,1735328473),c=k(c,d,e,b,g[f+12],20,2368359562),b=l(b,c,d,e,g[f+5],4,4294588738),e=l(e,b,c,d,g[f+8],11,2272392833),d=l(d,e,b,c,g[f+11],16,1839030562),c=l(c,d,e,b,g[f+14],23,4259657740),b=l(b,c,d,e,g[f+1],4,2763975236),
e=l(e,b,c,d,g[f+4],11,1272893353),d=l(d,e,b,c,g[f+7],16,4139469664),c=l(c,d,e,b,g[f+10],23,3200236656),b=l(b,c,d,e,g[f+13],4,681279174),e=l(e,b,c,d,g[f+0],11,3936430074),d=l(d,e,b,c,g[f+3],16,3572445317),c=l(c,d,e,b,g[f+6],23,76029189),b=l(b,c,d,e,g[f+9],4,3654602809),e=l(e,b,c,d,g[f+12],11,3873151461),d=l(d,e,b,c,g[f+15],16,530742520),c=l(c,d,e,b,g[f+2],23,3299628645),b=m(b,c,d,e,g[f+0],6,4096336452),e=m(e,b,c,d,g[f+7],10,1126891415),d=m(d,e,b,c,g[f+14],15,2878612391),c=m(c,d,e,b,g[f+5],21,4237533241),
b=m(b,c,d,e,g[f+12],6,1700485571),e=m(e,b,c,d,g[f+3],10,2399980690),d=m(d,e,b,c,g[f+10],15,4293915773),c=m(c,d,e,b,g[f+1],21,2240044497),b=m(b,c,d,e,g[f+8],6,1873313359),e=m(e,b,c,d,g[f+15],10,4264355552),d=m(d,e,b,c,g[f+6],15,2734768916),c=m(c,d,e,b,g[f+13],21,1309151649),b=m(b,c,d,e,g[f+4],6,4149444226),e=m(e,b,c,d,g[f+11],10,3174756917),d=m(d,e,b,c,g[f+2],15,718787259),c=m(c,d,e,b,g[f+9],21,3951481745),b=i(b,o),c=i(c,p),d=i(d,q),e=i(e,r);return(n(b)+n(c)+n(d)+n(e)).toLowerCase()};



var colorCache = {};

function hashColor(name) {
	if (colorCache[name]) return colorCache[name];

	var hash = MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360;
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
	var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;

	var m1, m2, hue;
	var r, g, b
	S /=100;
	L /= 100;
	if (S == 0)
	r = g = b = (L * 255).toString(16);
	else {
	if (L <= 0.5)
	m2 = L * (S + 1);
	else
	m2 = L + S - L * S;
	m1 = L * 2 - m2;
	hue = H / 360;
	r = HueToRgb(m1, m2, hue + 1/3);
	g = HueToRgb(m1, m2, hue);
	b = HueToRgb(m1, m2, hue - 1/3);
}


colorCache[name] = '#' + r + g + b;
return colorCache[name];
}

function HueToRgb(m1, m2, hue) {
	var v;
	if (hue < 0)
		hue += 1;
	else if (hue > 1)
		hue -= 1;

	if (6 * hue < 1)
		v = m1 + (m2 - m1) * hue * 6;
	else if (2 * hue < 1)
		v = m2;
	else if (3 * hue < 2)
		v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	else
		v = m1;

	return (255 * v).toString(16);
}

function escapeHTML(target) {
	if (!target) return false;
	target = target.replace(/&(?!\w+;)/g, '&amp;')
  	target = target.replace(/</g, '&lt;')
    target = target.replace(/>/g, '&gt;')
   	target = target.replace(/"/g, '&quot;');
   	return target;
}

function splint(target) {
	//splittyDiddles
	var cmdArr =  target.split(",");
	for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = cmdArr[i].trim();
	return cmdArr;
}
