/**
 * Commands
 * Pokemon Showdown - https://pokemonshowdown.com/
 *
 * These are commands. For instance, you can define the command 'whois'
 * here, then use it by typing /whois into Pokemon Showdown.
 *
 * A command can be in the form:
 *   ip: 'whois',
 * This is called an alias: it makes it so /ip does the same thing as
 * /whois.
 *
 * But to actually define a command, it's a function:
 *
 *   allowchallenges: function (target, room, user) {
 *     user.blockChallenges = false;
 *     this.sendReply("You are available for challenges from now on.");
 *   }
 *
 * Commands are actually passed five parameters:
 *   function (target, room, user, connection, cmd, message)
 * Most of the time, you only need the first three, though.
 *
 * target = the part of the message after the command
 * room = the room object the message was sent to
 *   The room name is room.id
 * user = the user object that sent the message
 *   The user's name is user.name
 * connection = the connection that the message was sent from
 * cmd = the name of the command
 * message = the entire message sent by the user
 *
 * If a user types in "/msg zarel, hello"
 *   target = "zarel, hello"
 *   cmd = "msg"
 *   message = "/msg zarel, hello"
 *
 * Commands return the message the user should say. If they don't
 * return anything or return something falsy, the user won't say
 * anything.
 *
 * Commands have access to the following functions:
 *
 * this.sendReply(message)
 *   Sends a message back to the room the user typed the command into.
 *
 * this.sendReplyBox(html)
 *   Same as sendReply, but shows it in a box, and you can put HTML in
 *   it.
 *
 * this.popupReply(message)
 *   Shows a popup in the window the user typed the command into.
 *
 * this.add(message)
 *   Adds a message to the room so that everyone can see it.
 *   This is like this.sendReply, except everyone in the room gets it,
 *   instead of just the user that typed the command.
 *
 * this.send(message)
 *   Sends a message to the room so that everyone can see it.
 *   This is like this.add, except it's not logged, and users who join
 *   the room later won't see it in the log, and if it's a battle, it
 *   won't show up in saved replays.
 *   You USUALLY want to use this.add instead.
 *
 * this.logEntry(message)
 *   Log a message to the room's log without sending it to anyone. This
 *   is like this.add, except no one will see it.
 *
 * this.addModCommand(message)
 *   Like this.add, but also logs the message to the moderator log
 *   which can be seen with /modlog.
 *
 * this.logModCommand(message)
 *   Like this.addModCommand, except users in the room won't see it.
 *
 * this.can(permission)
 * this.can(permission, targetUser)
 *   Checks if the user has the permission to do something, or if a
 *   targetUser is passed, check if the user has permission to do
 *   it to that user. Will automatically give the user an "Access
 *   denied" message if the user doesn't have permission: use
 *   user.can() if you don't want that message.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.can('potd')) return false;
 *
 * this.canBroadcast()
 *   Signifies that a message can be broadcast, as long as the user
 *   has permission to. This will check to see if the user used
 *   "!command" instead of "/command". If so, it will check to see
 *   if the user has permission to broadcast (by default, voice+ can),
 *   and return false if not. Otherwise, it will add the message to
 *   the room, and turn on the flag this.broadcasting, so that
 *   this.sendReply and this.sendReplyBox will broadcast to the room
 *   instead of just the user that used the command.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canBroadcast()) return false;
 *
 * this.canBroadcast(suppressMessage)
 *   Functionally the same as this.canBroadcast(). However, it
 *   will look as if the user had written the text suppressMessage.
 *
 * this.canTalk()
 *   Checks to see if the user can speak in the room. Returns false
 *   if the user can't speak (is muted, the room has modchat on, etc),
 *   or true otherwise.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canTalk()) return false;
 *
 * this.canTalk(message, room)
 *   Checks to see if the user can say the message in the room.
 *   If a room is not specified, it will default to the current one.
 *   If it has a falsy value, the check won't be attached to any room.
 *   In addition to running the checks from this.canTalk(), it also
 *   checks to see if the message has any banned words, is too long,
 *   or was just sent by the user. Returns the filtered message, or a
 *   falsy value if the user can't speak.
 *
 *   Should usually be near the top of the command, like:
 *     target = this.canTalk(target);
 *     if (!target) return false;
 *
 * this.parse(message)
 *   Runs the message as if the user had typed it in.
 *
 *   Mostly useful for giving help messages, like for commands that
 *   require a target:
 *     if (!target) return this.parse('/help msg');
 *
 *   After 10 levels of recursion (calling this.parse from a command
 *   called by this.parse from a command called by this.parse etc)
 *   we will assume it's a bug in your command and error out.
 *
 * this.targetUserOrSelf(target, exactName)
 *   If target is blank, returns the user that sent the message.
 *   Otherwise, returns the user with the username in target, or
 *   a falsy value if no user with that username exists.
 *   By default, this will track users across name changes. However,
 *   if exactName is true, it will enforce exact matches.
 *
 * this.getLastIdOf(user)
 *   Returns the last userid of an specified user.
 *
 * this.splitTarget(target, exactName)
 *   Splits a target in the form "user, message" into its
 *   constituent parts. Returns message, and sets this.targetUser to
 *   the user, and this.targetUsername to the username.
 *   By default, this will track users across name changes. However,
 *   if exactName is true, it will enforce exact matches.
 *
 *   Remember to check if this.targetUser exists before going further.
 *
 * Unless otherwise specified, these functions will return undefined,
 * so you can return this.sendReply or something to send a reply and
 * stop the command there.
 *
 * @license MIT license
 */

var commands = exports.commands = {

	ip: 'whois',
	rooms: 'whois',
	alt: 'whois',
	alts: 'whois',
	whois: function (target, room, user) {
		var targetUser = this.targetUserOrSelf(target, user.group === ' ');
		if (!targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}

		this.sendReply("|raw|User: " + targetUser.name + (!targetUser.connected ? ' <font color="gray"><em>(offline)</em></font>' : ''));
		if (user.can('alts', targetUser)) {
			var alts = targetUser.getAlts(true);
			var output = Object.keys(targetUser.prevNames).join(", ");
			if (output) this.sendReply("Previous names: " + output);

			for (var j = 0; j < alts.length; ++j) {
				var targetAlt = Users.get(alts[j]);
				if (!targetAlt.named && !targetAlt.connected) continue;
				if (targetAlt.group === '~' && user.group !== '~') continue;

				this.sendReply("|raw|Alt: " + targetAlt.name + (!targetAlt.connected ? ' <font color="gray"><em>(offline)</em></font>' : ''));
				output = Object.keys(targetAlt.prevNames).join(", ");
				if (output) this.sendReply("Previous names: " + output);
			}
			if (targetUser.locked) {
				this.sendReply("Locked under the username: " + targetUser.locked);
			}
		}
		if (Config.groups[targetUser.group] && Config.groups[targetUser.group].name) {
			this.sendReply("Group: " + Config.groups[targetUser.group].name + " (" + targetUser.group + ")");
		}
		if (targetUser.isSysop) {
			this.sendReply("(Pok\xE9mon Showdown System Operator)");
		}
		if (!targetUser.authenticated) {
			this.sendReply("(Unregistered)");
		}
		var a = targetUser.name;
                    if (a == "Da Bic Boi" || a == "Da Bic Boi - Ⓐⓦⓐⓨ" || a == "Infinite Bot" || a == "Infinite Bot - Ⓐⓦⓐⓨ" || a == "Infinite DDP Bot" || a== "Infinite DDP Bot - Ⓐⓦⓐⓨ" || a == "Not Da Bic Boi" || a == "Connor the Poodra" || a== "Not Da Bic Boi - Ⓐⓦⓐⓨ" ) {
                            return this.sendReply('ACCESS DENIED.');
                            }
		if (user.can('ip', targetUser) || user === targetUser) {
			var ips = Object.keys(targetUser.ips);
			this.sendReply("IP" + ((ips.length > 1) ? "s" : "") + ": " + ips.join(", ") +
					(user.group !== ' ' && targetUser.latestHost ? "\nHost: " + targetUser.latestHost : ""));
		}
		var output = "In rooms: ";
		var first = true;
		for (var i in targetUser.roomCount) {
			var targetRoom = Rooms.get(i);
			if (i === 'global' || targetRoom.isPrivate) continue;
			if (!first) output += " | ";
			first = false;

			output += (targetRoom.auth && targetRoom.auth[targetUser.userid] ? targetRoom.auth[targetUser.userid] : '') + '<a href="/' + i + '" room="' + i + '">' + i + '</a>';
		}
		this.sendReply('|raw|' + output);
	},

	ipsearch: function (target, room, user) {
		if (!this.can('rangeban')) return;
		var atLeastOne = false;
		this.sendReply("Users with IP " + target + ":");
		for (var userid in Users.users) {
			var curUser = Users.users[userid];
			if (curUser.latestIp === target) {
				this.sendReply((curUser.connected ? " + " : "-") + " " + curUser.name);
				atLeastOne = true;
			}
		}
		if (!atLeastOne) this.sendReply("No results found.");
	},
	
	/*********************************************************
	* CUSTOM CODE HERE!
	*********************************************************/
	tpoll: 'tiervote',
	tierpoll: 'tiervote',
	tiervote: function(target, room, user){
		return this.parse('/poll Next Tournament Tier?, 1v1, randbats, rand mono, challenge cup, cc1v1, 1v1, ou, monotype, uu, ru, nu, pu, lc, cap, ubers, doubles, triples, perserverance, balanced hackmons, inverse, sky battles, stabmons, middle cup, metronome');
	},
	hv: 'helpvotes',
        helpvotes: function(room, user, cmd){
                return this.parse('/wall Remember to **vote** even if you don\'t want to battle; that way you\'re still voting for what tier battles you want to watch!');
        },
	
	eating: 'away',
	gaming: 'away',
	game: 'away',
	sleep: 'away',
	crie: 'away',
	cri: 'away',
	cry: 'away',
	work: 'away',
	working: 'away',
	sleeping: 'away',
	busy: 'away',
	draw: 'away',
	drawing: 'away',
	afk: 'away',
	fap: 'away',
	away: function (target, room, user, connection, cmd) {
		if (!this.can('away')) return false;
		// unicode away message idea by Siiilver
		var t = 'Ⓐⓦⓐⓨ';
		var t2 = 'Away';
		switch (cmd) {
			case 'busy':
			t = 'Ⓑⓤⓢⓨ';
			t2 = 'Busy';
			break;
			case 'sleeping':
			t = 'Ⓢⓛⓔⓔⓟⓘⓝⓖ';
			t2 = 'Sleeping';
			break;
			case 'sleep':
			t = 'Ⓢⓛⓔⓔⓟⓘⓝⓖ';
			t2 = 'Sleeping';
			break;
			case 'gaming':
			t = 'Ⓖⓐⓜⓘⓝⓖ';
			t2 = 'Gaming';
			break;
			case 'game':
			t = 'Ⓖⓐⓜⓘⓝⓖ';
			t2 = 'Gaming';
			break;
			case 'working':
			t = 'Ⓦⓞⓡⓚⓘⓝⓖ';
			t2 = 'Working';
			break;
			case 'work':
			t = 'Ⓦⓞⓡⓚⓘⓝⓖ';
			t2 = 'Working';
			break;
			case 'cri':
			t = 'Ⓒⓡⓨⓘⓝⓖ';
			t2 = 'Crying';
			break;
			case 'fap': //Connor begged me to add this.
			t = 'Ⓕⓐⓟⓟⓘⓝⓖ';
			t2 = 'Fapping';
			break;
			case 'cry':
			t = 'Ⓒⓡⓨⓘⓝⓖ';
			t2 = 'Crying';
			break;
			case 'crie':
			t = 'Ⓒⓡⓨⓘⓝⓖ';
			t2 = 'Crying';
			break;
			case 'eating':
			t = 'Ⓔⓐⓣⓘⓝⓖ';
			t2 = 'Eating';
			break;
			case 'draw':
			t = 'Ⓓⓡⓐⓦⓘⓝⓖ';
			t2 = 'Drawing';
			break;
			case 'drawing':
			t = 'Ⓓⓡⓐⓦⓘⓝⓖ';
			t2 = 'Drawing';
			break;
			default:
			t = 'Ⓐⓦⓐⓨ';
			t2 = 'Away';
			break;
		}

		if (user.name.length > 18) return this.sendReply('Your username exceeds the length limit.');

		if (!user.isAway) {
			user.originalName = user.name;
			var awayName = user.name + ' - '+t;
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			Users.get(awayName).destroy();
			user.forceRename(awayName, undefined, true);

			if (user.isStaff) this.add('|raw|-- <b><font color="#088cc7">' + user.originalName +'</font color></b> is now '+t2.toLowerCase()+'. '+ (target ? " (" + Tools.escapeHTML(target) + ")" : ""));

			user.isAway = true;
		}
		else {
			return this.sendReply('You are already set as a form of away, type /back if you are now back.');
		}

		user.updateIdentity();
	},
	
	
	ack: 'back',
	bac: 'back',
	back: function (target, room, user, connection) {
		if (!this.can('away')) return false;

		if (user.isAway) {
			if (user.name === user.originalName) {
				user.isAway = false;
				return this.sendReply('Your name has been left unaltered and no longer marked as away.');
			}

			var newName = user.originalName;

			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			Users.get(newName).destroy();

			user.forceRename(newName, undefined, true);

			//user will be authenticated
			user.authenticated = true;

			if (user.isStaff) this.add('|raw|-- <b><font color="#088cc7">' + newName + '</font color></b> is no longer away.');

			user.originalName = '';
			user.isAway = false;
		}
		else {
			return this.sendReply('You are not set as away.');
		}

		user.updateIdentity();
	},
		
	/*********************************************************
	* CUSTOM CODE STOPS HERE!
	*********************************************************/
	
	/*********************************************************
	* TC'S HERE!
	*********************************************************/
	
	abuse: 'aboose',
        aboose: function(room, user, cmd){
                return this.parse('/pm Chakra, http://167.114.97.182:80/TCs/spam.jpg');
        },
	dong: 'dongshare',
        dongshare: (function () {
        var randomdong = [
            "( ͡° ͜ʖ ͡°).",
            "ヽ༼ຈل͜ຈ༽ﾉʀᴀɪsᴇ ʏᴏᴜʀ ᴅᴏɴɢᴇʀsヽ༼ຈل͜ຈ༽ﾉ ",
            "ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ",
            "┌༼ຈل͜ຈ༽┐ lower your dongers ┌༼ຈل͜ຈ༽┐",
            " (▀̿ ̿Ĺ̯̿̿▀̿ ̿)̄ ɴᴀᴍᴇ's ᴅᴏɴɢ. ᴊᴀᴍᴇs ᴅᴏɴɢ (̿▀̿ ̿Ĺ̯̿̿▀̿ ̿)",
            "¯\\_(ツ)_/¯.",
            "༼ﾉຈل͜ຈ༽ﾉ Y u no raise donger?"
        ];

        return function (target, room, user) {

            var selecteddong = target || randomdong[Math.floor(Math.random() * randomdong.length)];
            if (!this.canTalk(selecteddong)) return false;
			return this.parse(selecteddong);

            };
    })(),
	dong2: 'dongshare2',
        dongshare2: (function () {
        var randomdong2 = [
            ";_( ͡° ͜ʖ ͡°).",
            ";_ヽ༼ຈل͜ຈ༽ﾉʀᴀɪsᴇ ʏᴏᴜʀ ᴅᴏɴɢᴇʀsヽ༼ຈل͜ຈ༽ﾉ. ",
            ";_ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ.",
            ";__┌༼ຈل͜ຈ༽┐ lower your dongers ┌༼ຈل͜ຈ༽┐.",
            " ;_(▀̿ ̿Ĺ̯̿̿▀̿ ̿)̄ ɴᴀᴍᴇ's ᴅᴏɴɢ. ᴊᴀᴍᴇs ᴅᴏɴɢ (̿▀̿ ̿Ĺ̯̿̿▀̿ ̿).",
            "¯\\_(ツ)_/¯.;;_",
            " ;- ﾉຈل͜ຈ༽ﾉ Y u no raise donger?."
        ];

        return function (target, room, user) {

            var selecteddong2 = target || randomdong2[Math.floor(Math.random() * randomdong2.length)];
            if (!this.canTalk(selecteddong2)) return false;
			return this.parse(selecteddong2);

            };
    })(),
	dong3: 'dongshare3',
        dongshare3: (function () {
        var randomdong3 = [
            "( ͡° ͜ʖ ͡°)._",
            "ヽ༼ຈل͜ຈ༽ﾉʀᴀɪsᴇ ʏᴏᴜʀ ᴅᴏɴɢᴇʀsヽ༼ຈل͜ຈ༽ﾉ._ ",
            "ᕙ༼ຈل͜ຈ༽ᕗ flex your dongers ᕙ༼ຈل͜ຈ༽ᕗ._",
            "┌༼ຈل͜ຈ༽┐ lower your dongers ┌༼ຈل͜ຈ༽┐._",
            " (▀̿ ̿Ĺ̯̿̿▀̿ ̿)̄ ɴᴀᴍᴇ's ᴅᴏɴɢ. ᴊᴀᴍᴇs ᴅᴏɴɢ (̿▀̿ ̿Ĺ̯̿̿▀̿ ̿)._",
            "¯\\_(ツ)_/¯._",
            "༼ﾉຈل͜ຈ༽ﾉ Y u no raise donger?._"
        ];

        return function (target, room, user) {

            var selecteddong3 = target || randomdong3[Math.floor(Math.random() * randomdong3.length)];
            if (!this.canTalk(selecteddong3)) return false;
			return this.parse(selecteddong3);

            };
    })(),
	raisedong: 'dongers',
	raisedongers: 'dongers',
        dongers: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/Dong.gif"><br />' +
                                      '<font size=3><i><font color=red><b><blink>ヽ༼ຈل͜ຈ༽ﾉ raise your dongers ヽ༼ຈل͜ຈ༽ﾉ</blink></b></font></i></font><br />')
            },
	crie: 'caboose',
        caboose: function(room, user, cmd){
                return this.parse('/pm MadAsTheHatter, /me spanks MadAsTheHatter!');
        },
	crie2: 'caboose2',
        caboose2: function(room, user, cmd){
                return this.parse('/pm MadAsTheHatter, /me spanks MadAsTheHatter!!');
        },
	chakyowner: 'ownchak',
        ownchak: function(room, user, cmd){
                return this.parse('/pm Chakra, Users that own Chakra: Koikazma, Assault Vest Tangela, Chakra\'s hoe, Chakra\'s Mother, Chakra\'s Nan, Chakra\'s Son, Chakra\'s Cat, Mr. Wafflez, Chakra\'s Lover, Chakra\'s Paramour, I am Tory.');
        },

	spank: function(target, room, user){
		if(!target) return this.sendReply('/spank needs a target.');
		return this.parse('/me spanks ' + target + '!');
	},

    Evil:'evil',
	evil: function(target, room, user) {
                        if(!this.canBroadcast()) return;
                        this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/Evil.gif"> <br> <font size="4"><b><i><font color="#9C0D0D">Evil-kun</i><br></font><b> <blink> Ace: Dis is an ivol zing </blink></b><br><b>Elmo sabe donde vives...</b></center>')
                },

	ac:'armcannons',
	armcannons: function(target, room, user) {
                        if(!this.canBroadcast()) return;
                        this.sendReplyBox('<center><img src = "http://167.114.97.182:80/TCs/AC2.gif"> <center><br> <font size="3"><b><i><font color="blue">Josh</i><br></font><b> <blink> Ace: Darmanitan </blink></b> <br><b>Stealing yo girl shofu style</b></center>')
                },
	plug: function(target, room, user) {
                        if(!this.canBroadcast()) return;
                        this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/plug.jpg" height="300" width="540"/> </a><br><font size="3"><b><i><font color="Black">Plug Crew</i><br></font><b><blink><a href="http://plug.dj/infinite-jam-session/">Plug Room</a></font></blink></b><br></center>')
                },
	mandy: function(target, room, user)
        {if (!this.canBroadcast()) return false;
        return this.sendReplyBox(' <center> <img src="http://167.114.97.182:80/TCs/mandy.gif"> <br> <font size="3"><b><i><font color="99FFFF">Mandy</i><br></font><b> <blink> Ace: I\'m kawaii bitch ^.~ </blink></b> <br><b>Cant handle my Cutness</b></center>');
        },
	ac2:'armcannons2',
	armcannons2: function(target, room, user) {
                        if(!this.canBroadcast()) return;
                        this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/ac3.jpg"><br />' +
                                          '<font size=4><i><font color=blue><b>Josh</b></font></i></font><br />' +
                                          '<blink><b><font color=gray>Ace: Shocking good looks</font></b></blink><br />' +
                                          '<b>First I eat my nutella then I eel yo girl</b>')
                },


	gg: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/OBAMA.jpg"><br />' +
                                      '<font size=3><i><font color=red><b>Da Bic Boi</b></font></i></font><br />' +
                                      '<b><blink>Ace: Bullet Punch</blink></b><br />' +
                                      '<b>#hardbody</b>')
            },
	donate:'gg2',
	gg2: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/Donateobama.jpg"><br />' +
                                      'Like this server and want to help out?<br />' +
                                      '<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=MSLQFMFMNUMX4&lc=US&item_name=Infinite%20Server%20%28http%3a%2f%2finfinite%2epsim%2eus%2f%29&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted"><img src="https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif" /></a><br />' +
                                      '<b><blink>Ace: Gratitude</blink></b><br />'  +
									  '<b>#Message Da Bic Boi afterwards to make sure the donation went through!</b>' )
            },
	scrub: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/scrub.jpg" height="247" width="173"><br />' +
                                      '<font size=3><i><font color=cyan><b>Scream Scrub</b></font></i></font><br />' +
                                      '<b><blink>Ace: Diabeetus</blink></b><br />' +
                                      '<b>#tryhard</b>')
            },

	max: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/max.jpg"><br />' +
                                      '<font size=3><i><font color=green><b>Absolute Maximum</b></font></i></font><br />' +
                                      '<b><blink>Ace: First Derivative</blink></b><br />' +
                                      '<b>#scrublord9000+</b>')
            },
	alaskaa:'weed',
	weed: function(target, room, user)
        {if (!this.canBroadcast()) return false;
        return this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/alaska.gif"> <br> <font size="3"><b><i><font color="00FF00">Alaskaa</i><br></font><b> <blink> Weed </blink></b> <br><b>SMOKEsmOKEWEED EVERYDAY AYY</b></center>');
        },

	lasers: 'pewpewpew',
	pewpewpew: function(target, room, user)
        {if (!this.canBroadcast()) return false;
        return this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/lasers.gif"> <br> <font size="3"><b><i><font color="8000FF">Lasurs</i><br></font><b> <blink> PEWPEWPEW WITH ME SENPAI ARHFRJGHJHJKDF </blink></b> <br><b>Ace: Godly Instrument</b></center>');
        },

	cleer: function(target, room, user) {
	if (!user.can('ban')) return false;
	this.add('|html|<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>')
	},

	enzo: function(target, room, user)
        {if (!this.canBroadcast()) return false;
        return this.sendReplyBox('<center> <img src = " http://167.114.97.182:80/TCs/enzo.gif"> <br> <font color=blue>  <font size="3"> <b><i>FranchescoEnzo</i><br></font> <font color=black> Quote: M8 I swer on me mam i\'ll rek u <br> <blink> <b> Ace: Reflexes </b>');
        },

	fatherj: 'davidj',
	davidj: function(target, room, user)
        	{if (!this.canBroadcast()) return false;
        	return this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/davidj.gif"> <br> <font size="3"><b><i><font color="00FF00">DavidJ</i><br></font><b> <blink>Ace: OP Spanish Boy</blink></b><br><b>420 Blaze It (Hur Hur)</b></center>');
        },

	silver: 'sexiness',
	sexiness: function(target, room, user)
        	{if (!this.canBroadcast()) return false;
        	return this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/silver.gif"> <br> <font size="3"><b><i><font color="00FF00">SilverKill</i><br></font><b>Show them all you\'re not the ordinary type.</b> <br><b><font color=FFBF00>Deal with it. (⌐■_■)</b></center>');
        },

	kevkev:'kevn',
	kevn: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('<center><b><a href="http://167.114.97.182:80/TCs/kev.gif"><img src="http://167.114.97.182:80/TCs/kev.gif"></a><br> <font size= 3> <i><font color = "red"> nonstopkevn</i></font><br><blink> <b> Unstoppable</blink> </b> <br>“It does not matter how slow you go so long as you do not stop.”<br>-Wisdom of Confucius.</center></b>')
		},
	pu: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('PU is a tier created by <a href="https://www.youtube.com/user/dundealshowdown">Dun Deal</a>.<br>It is a tier below NU, using only Pokemon from LC, NFE, and Pokemon who are barely ever used in NU.<br>A list of the tier\'s Pokemon can be found on the PU website <a href="http://www.partiallyused.weebly.com">here</a>. Please read it!<br>You can interact with the PU community in Dun Deal\'s Place. Happy battling!')
		},
	PUban: 'pufix',
	PUFix: 'pufix',
	pufix: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('The PU tier was coded in a way that basically every Pokemon that was not part of the PU tier had to manually be banned out.</a><br>By coding the tier this way, some Pokemon that are not PU are able to be used in PU battles.<br>You can submit the names of the Pokemon that we missed <a href="https://docs.google.com/forms/d/1IUFrec8w3bfcvymDGIe7XBBqN6giso_1wdruyymaYOo/viewform?usp=send_form">Here!')
		},
	abcabilities: 'abcab',
	abcab: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('ABC Abilities is a tier created by <a href="https://www.youtube.com/user/dundealshowdown">Dun Deal</a>.<br>It is a tier in which every Pokemon can have any move or ability that starts with the same letter its name starts with.<br>A list of the tier\'s Pokemon can be found <a href="http://www.abcabilities.weebly.com">here</a>. Please read it!<br>You can interact with the ABC Abilities community in Dun Deal\'s Place. Happy Battling!')
		},
	infinitebot: 'death',
	bot: 'death',
	death: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<center> <img src="http://167.114.97.182:80/TCs/bot.gif"><br><b><blink><FONT COLOR="red">Infinite Bot</FONT COLOR></blink><br>"For all you would-be spammers out there, I will find you, and I kill ban you."</b></center>')
	},
	frost: function(target, room, user) {
                    if(!this.canBroadcast()) return;
		    this.sendReplyBox('<center><a href="http://a.tumblr.com/tumblr_l6dyfyOTqx1qab7jvo1.mp3"> <img src="http://167.114.97.182:80/TCs/frost.gif"/> </a><br><font size="3"><b><i><font color="blue">Frost</i><br></font><b><blink>Willpower</font></blink></b><br><font color="585858"><i>I\'ll never fall by the likes of people such as you.</i></center>')
            },

	twerk: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/gandhi.jpg" height="300" width="330"><br />' +
                                      '<b><blink>Sample Text</blink></b><br />' +
                                      '<b>#twerkteam</b>')
            },
	thirsty: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/thirsty.jpg"><br />' +
                                      '<b>#TheThirstIsReal</b>')
            },
	yallthirsty: 'quantavious',
            quantavious: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/yall.png" height="180" width="180"><br />' +
                                      '<img src="http://167.114.97.182:80/TCs/yall2.png" height="250" width="180"> <font size=3><b><i><font color=gold>YallThirsty</font></i></b></font> <img src="http://167.114.97.182:80/TCs/yall3.png" height="180" width="195"><br />' +
                                      '<b><blink>Ace: Charizard</blink></b><br />' +
                                      '<b>You All Are Thirsty!</b>')
            },
	macrarazy: 'mac',
            e4mac: 'mac',
            e6mac: 'mac',
            mac: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/mac.png" height="180" width="150"><br />' +
                                      '<img src="http://167.114.97.182:80/TCs/mac2.png" height="130" width="150"> <img src="http://167.114.97.182:80/TCs/mac3.gif"> <img src="http://167.114.97.182:80/TCs/mac4.png" height="130" width="160"><br />' +
                                      '<b><blink>Ace: Mega Aggron</blink><br />' +
                                      '<font color=gray>Sometimes... Steel is too much for you!</font></b>')
            },
	kammi: 'poto2',
	Kammi: 'poto2',
	elsa: 'poto2',
	poto2: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/kammi.gif"> <br> <font size="4"><b><i><font color="#0033CC">Kammi, Frost Queen.</br>')
            },
	Queen: 'isawa',
	queen: 'isawa',
	isawa: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/isawa.gif"> <br> <font size="3"><b><i><font color="#0033CC">Bish please, I\'m the real frost queen.</br>')
            },
	poto: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/poto.jpg" height="188" width="300"><br />' +
                                      '<font color=blue><b>#kammi</b></font>')
									  },
	rekt: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/rekt.gif"><br />')
            },
	infusion: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/infnusion.gif"><br />')
            },
	litalie: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/litalie.jpg"><br />')
            },
	mind: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/mind.gif"><br />')
            },
	monop: 'monopoly',
	monopoly: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/monoop.jpg"><br />')
            },
	liz: 'lizbith',
	lizbith: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/lizbith.jpg"><br /><br />' +
									  '<img src="http://167.114.97.182:80/TCs/lizbith2.jpg"><br /><br />' +
									  '<img src="http://167.114.97.182:80/TCs/lizbith3.jpg"><br /><br />'+ 
									  '<img src="http://167.114.97.182:80/TCs/lizbith4.jpg"><br /><br />' +
									  '<img src="http://167.114.97.182:80/TCs/lizbith5.jpg"><br /><br />')
            },
	tacosaur: 'ellen',
	ellen: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/ellen.jpg"><br /><br />' +
									  '<img src="http://167.114.97.182:80/TCs/ellen2.jpg"><br /><br />' +
									  ' People who have purchsed her: nonstopkevn, MadAsTheHatter, Tacosaur, sai, jd, kafkablack, chakra, hashtag armcannons, black rabbit, and xVeNoMiiZz, koikazma, Pikabeats o3o ')
            },
	

	korps: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><b><img src="http://167.114.97.182:80/TCs/korps.gif"></a><br> <font size= 3> <i><font color = "blue"> Korps</i></font><br><blink> <b> I will find you.</blink> </b><br>“No matter where you go, I\'ll follow you. Because I love you."')
            },
	jj: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/jj.gif"><br />' +
					'<font size=3><i><font color=red><b>Not Da Bic Boi</b></font></i></font><br />' +
                                      '<b><blink>Ace: Credit Card</blink></b><br />')
            },
	tdfw: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><a href="http://audio.radiorecord.ru/superchart/DJ%20SNAKE%20&%20LIL%20JOHN%20-%20Turn%20Down%20For%20What.mp3"> <img src="http://167.114.97.182:80/TCs/tdf2.png" /> </a><br><font size="3"><b><i><font color="FF0000">#TD4W</i><br></font><b><blink>Turn Up MothaFuckas</font></blink></b><br><font color="585858"><i>Swag</i></center>')
            },


    hue: 'BR',
	br: 'BR',
	BR: function(target, room, user)
        {if (!this.canBroadcast()) return false;
        return this.sendReplyBox(' <center><a href="https://a.tumblr.com/tumblr_mujxyk4g1U1shttnco1.mp3"target="_blank"><img src=http://167.114.97.182:80/TCs/br.gif> </a><br> <font size="3"><b><i><font color="642EFE">BlackRabbit</i><br></font><b> <blink> Ace: Swimpuku </blink></b> <br><b>I am sorry, is my swag distracting you?<b><center>');
        },

	mad: 'math',
	math: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/math.gif"> <br> <font size="4"><b><i><font color="#0033CC">MadAsTheHatter</i><br></font><b> <blink> Ace: Ralphonso </blink></b><br><b>Stay Frosty</b></center>')
            },
	shed: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><a href="http://a.tumblr.com/tumblr_maghncXqXg1qdm6eno1.mp3"> <img src="http://167.114.97.182:80/TCs/shed.gif" /> </a><br><font size="3"><b><i><font color="FF0000">#733t gg</i><br></font><b><blink> **Gimmicks Ahoy!**</font></blink></b><br><font color="585858"><i>1v1 Me Scrub (Fuggin Click Da Photo)</i></center>')
            },
	pantsu: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/pantsu.gif"><br />' +
                                      '<font color=blue><b>#AbsolutePervyium \(Credit:shinigami, Pantsu Man\)</b></font>')
            },
	rotom: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/rotom.gif" height="250" width="250"><br />'
                                      )
            },
	taco: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/taco.jpg" height="225" width="300"><br />' +
                                      '<font size=3><i><font color=purple><b>#TeamTacoBell</b></font></i></font><br />' +
                                      '<b><blink>Ace: Doritos Locos Tacos</blink></b><br />' +
                                      '<b>Happy Hour is best Hour!</b>')
            },
	jen: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/jen.png" height="188" width="300"><br />' +
                                      '<font color=blue><b>#2kawaii4u</b></font>')
            },
	air: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/air.gif"><br />' +
                                      '<font color=black><b>"I get my own trainer card!?"</b></font>')
            },


	troll: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/troll.jpg"><br />' +
                                      '<b>I will shit fury all over you and you will drown in it.</b><br />' +
									  '<b>#swagmaster69</b>')
            },

	kfc: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/kfc.jpg" height="201" width="300"><br />' +
                                      '<font size=3><i><font color=purple><b>Omega Supreme</b></font></i></font><br />'
                                      )
            },
	newt68: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/newt.jpg"><br />'

                                      )
            },
	bd: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/bd.jpg"><br />' +
                                      '<font size=3><i><font color=purple><b>Backdoor Access: Félicette (Credit: JD x Félicette)</b></font></i></font><br />' +
									' People who have purchased her: buttofTheTitanTank, Chakra, sbet777, MadAsTheHatter, AssaultVestTangela, koikazma, Black Rabbit, hashtag armcannons, nonstopkevn, DavidJ, Félicette, jd, retrofeather, Absolute Maximum, Feeboss, Giantsdms, xVeNoMiiZz, KafkaBlack, Quilavaa, Chakra, Connor the Goodra, and of course: Da Bic Boi. </center>'
                                      )
            },
	jd: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/jd.jpg"><br />' +
                                      '<font size=3><i><font color=blue><b>JD</b></font></i></font><br />'+
										'<b><blink>Ace: Sexual Tension</blink></b><br />'
                                      )
            },
	toxic: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/toxic.gif"> <br> ' +
					'<font size="3"><b><i><font color="Purple">Toxic</i><br></font></b>' +
					'<blink> Ace:Outernet</blink></b> <br>' +
					'<b>Stay indoors ;3</b></center>'
                                      )
            },
	waffle: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/chakrawaffle.jpg"><br />' +
                                      '<font size=1><i><font color=gray><b>#LikeAWaffle (Credit: Chakra)</b></font></i></font><br />'+
										'<b><blink>Ace: Elite Hand-To-Waffle Combat</blink></b><br />'
                                      )
            },
paperangel: 'paper',
			angel: 'paper',
paper: function(target, room, user)
        {if (!this.canBroadcast()) return false;
        return this.sendReplyBox('<center><img src ="http://167.114.97.182:80/TCs/paperangle.gif"/><br><font size="3"><b><i><font color="B40404">Paper Angel</i><br></font><b> <blink>Ace: What?</blink></b><br><b><i>Yall mothafuckas weird af tbh</i></b></center>');
        },
peppa: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/peppa.gif/" height="251" width="375"><br />' +
                                      '<font size=3><i><font color=pink><b>Peppa </b></font></i></font><i><font color=pink><b>Mint </b></font></i></font><br />' +
										'<font size=3><i><font color=pink><b>List of things Peppamint has said IRL: </b></font></i><br />' +
										'</font><i><font color=purple><b>"I spread my asscheeks for Shrek" 8/16/2014 </b></font></i></font><br />' +
										'</font><i><font color=purple><b>"Where\'s Picopie? What!? He\'s jacking off!?" 8/16/2014 </b></font></i></font><br />'	+
										'</font><i><font color=purple><b>"Why is it so long!?" 9/10/2014 </b></font></i></font><br />' + 
										'<img src="http://167.114.97.182:80/TCs/peppa2.jpg/"> </font><i><font color=purple><b>11/3/2014</b></font></i></font><br />' + 
										'<img src="http://167.114.97.182:80/TCs/peppa3.jpg/"> </font><i><font color=purple><b>11/3/2014</b></font></i></font><br />' +
										'<img src="http://167.114.97.182:80/TCs/peppa4.jpg/"> </font><i><font color=purple><b>11/3/2014</b></font></i></font><br />' +
										'<img src="http://167.114.97.182:80/TCs/peppa5.png/"> </font><i><font color=purple><b>11/3/2014</b></font></i></font><br />'
                                      )
            },
	  giant: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/giant.gif"><br />' +
                                      '<font size=4><i><font color=33FF33><b>Giantsdms</b></font></i></font><br />' +
                                      '<b><blink>Ace: Iron Giant</blink></b><br />' +
                                      '<b>I sweep girls off their feet like i do with your team m8; easily</b>')
            },

	kafka: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/kafka.gif"><br />' +
                                      '<font size=3><i><font color=33FF33><b>Kafka</b></font></i></font><br />' +
                                      '<b><blink>Ace: Shimmy</blink></b><br />' +
                                      '<b>Now stop, OH, then wiggle with it, YEAH!</b>')
            },
    fel:'felicette',
	felicette: function(target, room, user)
            {if (!this.canBroadcast()) return false;
            return this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/fel.jpg"> <br> <font size="3"><b><i><font color="94CAE9">Félicette</i><br></font><b> <font color=pink> <blink> Ace: Cherry Blossoms </blink></b> <br><i>Eternal happiness will only bloom after the suffering of the past has been endured.</i></center>');
            },
	chakra: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/chakra.gif"><br />' +
                                      '<font size=3><i><font color=B40404><b>Chakra</b></font></i></font><br />' +
                                      '<b><blink>Ace: Kawaii</blink></b><br />' +
                                      '<br><marquee behavior=scroll direction="left" scrollamount="50">f(x)=e^o3o</marquee>')
            },
	sacrisis: function(target, room, user) {
                    if(!this.canBroadcast()) return;
                    this.sendReplyBox('<center><img src="http://167.114.97.182:80/TCs/sacrisis.gif"><br />' +
                                      '<font size=3><i><font color=7A770C><b>Sacrisis</b></font></i></font><br />' +
                                      '<b><blink>Ace: When you get those hax</blink></b>' +
                                      '<br><b>Make dat booty werk</b>')
            },
	quil:'quilaava',
	quilaava: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('<center><img src= "http://167.114.97.182:80/TCs/quil.jpg"> <br> <font size="3"><b><i><font color="FF0000">Quil</i><br></font><b><font color="blue"> Quote: In the heat of the moment never quit, press on!</b><br><b><blink><font color="orange"> Ace: Mystery</blink></b></center>')
		},

reigns: 'darkness',
darkness: function(target, room, user)
        {if (!this.canBroadcast(/*Never Forget Infinite.*/)) return false;
        return this.sendReplyBox('<center><img src ="http://167.114.97.182:80/TCs/darkness.gif"/><br><font size="3"><b><i><font color="8A0808">DarknessReigns</i><br></font><b> <blink><font color="0B0B61">Ace: Sasuke</font></blink></b><br><b><i>It gets darkest right before dawn.</i></b></center>');
        },

prof: function(target, room, user)
        {if (!this.canBroadcast()) return false;
        return this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/prof.png"> <br> <font size="3"><b><i><font color="FA58F4">Profpoodle</i><br></font><b> <blink><font color=00FFFF> Ace: Furfrou obv </blink></font></b> <br><b><font color=40FF00> EY BABY U WANT MEH EH? </font></b></center>');
        },

ralph: function(target, room, user)
        {if (!this.canBroadcast()) return false;
        return this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/ralph.gif"> <br> <font size="3"><b><i><font color="B2C248">Ralphonso</i><br></font><b> <blink> Ace: I GOT DAT <i> Canadian </i> HARD BODY </blink></b> <br> #getripped </center>');
        },

connor: 'goodra',
goodra: function(target, room, user)
        {if (!this.canBroadcast()) return false;
        return this.sendReplyBox('<center> <img src = "http://167.114.97.182:80/TCs/connor.gif"> <br> <font size="3"><b><i><font color="0404B4">Connor the Goodra</i><br></font><b> <font color="8A0886">  Ace: The comfort of the bonfire </b> <br><b> <font color="190707"> <blink> Lol you\'re a scrub </b></center>');
        },


    ninkay: 'inky',
    inky: function(target, room, user)
            {if (!this.canBroadcast()) return false;
            return this.sendReplyBox('<center><img src ="http://167.114.97.182:80/TCs/inky.gif"/><br><font size="3"><b><i><font color="FF0000">Inkyfeather</i><br></font><b><blink>st0icm4st3r280000</font></blink></b><br><font color="585858"><i>Ninkay out! .3.</i></center>');
            },
	
	/*********************************************************
	* TC'S STOP HERE!
	*********************************************************/
	
	/*********************************************************
	 * Shortcuts
	 *********************************************************/

	invite: function (target, room, user) {
		target = this.splitTarget(target);
		if (!this.targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		var targetRoom = (target ? Rooms.search(target) : room);
		if (!targetRoom) {
			return this.sendReply("Room " + target + " not found.");
		}
		return this.parse('/msg ' + this.targetUsername + ', /invite ' + targetRoom.id);
	},

	/*********************************************************
	 * Informational commands
	 *********************************************************/

	pstats: 'data',
	stats: 'data',
	dex: 'data',
	pokedex: 'data',
	details: 'data',
	dt: 'data',
	data: function (target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;

		var buffer = '';
		var targetId = toId(target);
		if (targetId === '' + parseInt(targetId)) {
			for (var p in Tools.data.Pokedex) {
				var pokemon = Tools.getTemplate(p);
				if (pokemon.num === parseInt(target)) {
					target = pokemon.species;
					targetId = pokemon.id;
					break;
				}
			}
		}
		var newTargets = Tools.dataSearch(target);
		var showDetails = (cmd === 'dt' || cmd === 'details');
		if (newTargets && newTargets.length) {
			for (var i = 0; i < newTargets.length; ++i) {
				if (newTargets[i].id !== targetId && !Tools.data.Aliases[targetId] && !i) {
					buffer = "No Pokemon, item, move, ability or nature named '" + target + "' was found. Showing the data of '" + newTargets[0].name + "' instead.\n";
				}
				if (newTargets[i].searchType === 'nature') {
					buffer += "" + newTargets[i].name + " nature: ";
					if (newTargets[i].plus) {
						var statNames = {'atk': "Attack", 'def': "Defense", 'spa': "Special Attack", 'spd': "Special Defense", 'spe': "Speed"};
						buffer += "+10% " + statNames[newTargets[i].plus] + ", -10% " + statNames[newTargets[i].minus] + ".";
					} else {
						buffer += "No effect.";
					}
					return this.sendReply(buffer);
				} else {
					buffer += '|c|~|/data-' + newTargets[i].searchType + ' ' + newTargets[i].name + '\n';
				}
			}
		} else {
			return this.sendReply("No Pokemon, item, move, ability or nature named '" + target + "' was found. (Check your spelling?)");
		}

		if (showDetails) {
			var details;
			if (newTargets[0].searchType === 'pokemon') {
				var pokemon = Tools.getTemplate(newTargets[0].name);
				var weighthit = 20;
				if (pokemon.weightkg >= 200) {
					weighthit = 120;
				} else if (pokemon.weightkg >= 100) {
					weighthit = 100;
				} else if (pokemon.weightkg >= 50) {
					weighthit = 80;
				} else if (pokemon.weightkg >= 25) {
					weighthit = 60;
				} else if (pokemon.weightkg >= 10) {
					weighthit = 40;
				}
				details = {
					"Dex#": pokemon.num,
					"Height": pokemon.heightm + " m",
					"Weight": pokemon.weightkg + " kg <em>(" + weighthit + " BP)</em>",
					"Dex Colour": pokemon.color,
					"Egg Group(s)": pokemon.eggGroups.join(", ")
				};
				if (!pokemon.evos.length) {
					details["<font color=#585858>Does Not Evolve</font>"] = "";
				} else {
					details["Evolution"] = pokemon.evos.map(function (evo) {
						evo = Tools.getTemplate(evo);
						return evo.name + " (" + evo.evoLevel + ")";
					}).join(", ");
				}
			} else if (newTargets[0].searchType === 'move') {
				var move = Tools.getMove(newTargets[0].name);
				details = {
					"Priority": move.priority
				};

				if (move.secondary || move.secondaries) details["<font color=black>&#10003; Secondary Effect</font>"] = "";
				if (move.isContact) details["<font color=black>&#10003; Contact</font>"] = "";
				if (move.isSoundBased) details["<font color=black>&#10003; Sound</font>"] = "";
				if (move.isBullet) details["<font color=black>&#10003; Bullet</font>"] = "";
				if (move.isPulseMove) details["<font color=black>&#10003; Pulse</font>"] = "";

				details["Target"] = {
					'normal': "Adjacent Pokemon",
					'self': "Self",
					'adjacentAlly': "Single Ally",
					'allAdjacentFoes': "Adjacent Foes",
					'foeSide': "All Foes",
					'allySide': "All Allies",
					'allAdjacent': "All Adjacent Pokemon",
					'any': "Any Pokemon",
					'all': "All Pokemon"
				}[move.target] || "Unknown";
			} else if (newTargets[0].searchType === 'item') {
				var item = Tools.getItem(newTargets[0].name);
				details = {};
				if (item.fling) {
					details["Fling Base Power"] = item.fling.basePower;
					if (item.fling.status) details["Fling Effect"] = item.fling.status;
					if (item.fling.volatileStatus) details["Fling Effect"] = item.fling.volatileStatus;
					if (item.isBerry) details["Fling Effect"] = "Activates effect of berry on target.";
					if (item.id === 'whiteherb') details["Fling Effect"] = "Removes all negative stat levels on the target.";
					if (item.id === 'mentalherb') details["Fling Effect"] = "Removes the effects of infatuation, Taunt, Encore, Torment, Disable, and Cursed Body on the target.";
				}
				if (!item.fling) details["Fling"] = "This item cannot be used with Fling";
				if (item.naturalGift) {
					details["Natural Gift Type"] = item.naturalGift.type;
					details["Natural Gift BP"] = item.naturalGift.basePower;
				}
			} else {
				details = {};
			}

			buffer += '|raw|<font size="1">' + Object.keys(details).map(function (detail) {
				return '<font color=#585858>' + detail + (details[detail] !== '' ? ':</font> ' + details[detail] : '</font>');
			}).join("&nbsp;|&ThickSpace;") + '</font>';
		}
		this.sendReply(buffer);
	},

	ds: 'dexsearch',
	dsearch: 'dexsearch',
	dexsearch: function (target, room, user) {
		if (!this.canBroadcast()) return;

		if (!target) return this.parse('/help dexsearch');
		var targets = target.split(',');
		var searches = {};
		var allTiers = {'uber':1, 'ou':1, 'uu':1, 'lc':1, 'cap':1, 'bl':1, 'bl2':1, 'ru':1, 'bl3':1, 'nu':1, 'pu':1, 'nfe':1};
		var allColours = {'green':1, 'red':1, 'blue':1, 'white':1, 'brown':1, 'yellow':1, 'purple':1, 'pink':1, 'gray':1, 'black':1};
		var showAll = false;
		var megaSearch = null;
		var recoverySearch = null;
		var output = 10;

		for (var i in targets) {
			var isNotSearch = false;
			target = targets[i].trim().toLowerCase();
			if (target.slice(0, 1) === '!') {
				isNotSearch = true;
				target = target.slice(1);
			}

			var targetAbility = Tools.getAbility(targets[i]);
			if (targetAbility.exists) {
				if (!searches['ability']) searches['ability'] = {};
				if (Object.count(searches['ability'], true) === 1 && !isNotSearch) return this.sendReplyBox("Specify only one ability.");
				if ((searches['ability'][targetAbility.name] && isNotSearch) || (searches['ability'][targetAbility.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include an ability.");
				searches['ability'][targetAbility.name] = !isNotSearch;
				continue;
			}

			if (target in allTiers) {
				if (!searches['tier']) searches['tier'] = {};
				if ((searches['tier'][target] && isNotSearch) || (searches['tier'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a tier.');
				searches['tier'][target] = !isNotSearch;
				continue;
			}

			if (target in allColours) {
				if (!searches['color']) searches['color'] = {};
				if ((searches['color'][target] && isNotSearch) || (searches['color'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a color.');
				searches['color'][target] = !isNotSearch;
				continue;
			}

			var targetInt = parseInt(target);
			if (0 < targetInt && targetInt < 7) {
				if (!searches['gen']) searches['gen'] = {};
				if ((searches['gen'][target] && isNotSearch) || (searches['gen'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a generation.');
				searches['gen'][target] = !isNotSearch;
				continue;
			}

			if (target === 'all') {
				if (this.broadcasting) {
					return this.sendReplyBox("A search with the parameter 'all' cannot be broadcast.");
				}
				showAll = true;
				continue;
			}

			if (target === 'megas' || target === 'mega') {
				if ((megaSearch && isNotSearch) || (megaSearch === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include Mega Evolutions.');
				megaSearch = !isNotSearch;
				continue;
			}

			if (target === 'recovery') {
				if ((recoverySearch && isNotSearch) || (recoverySearch === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and recovery moves.');
				if (!searches['recovery']) searches['recovery'] = {};
				recoverySearch = !isNotSearch;
				continue;
			}

			var targetMove = Tools.getMove(target);
			if (targetMove.exists) {
				if (!searches['moves']) searches['moves'] = {};
				if (Object.count(searches['moves'], true) === 4 && !isNotSearch) return this.sendReplyBox("Specify a maximum of 4 moves.");
				if ((searches['moves'][targetMove.name] && isNotSearch) || (searches['moves'][targetMove.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a move.");
				searches['moves'][targetMove.name] = !isNotSearch;
				continue;
			}

			if (target.indexOf(' type') > -1) {
				target = target.charAt(0).toUpperCase() + target.slice(1, target.indexOf(' type'));
				if (target in Tools.data.TypeChart) {
					if (!searches['types']) searches['types'] = {};
					if (Object.count(searches['types'], true) === 2 && !isNotSearch) return this.sendReplyBox("Specify a maximum of two types.");
					if ((searches['types'][target] && isNotSearch) || (searches['types'][target] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a type.");
					searches['types'][target] = !isNotSearch;
					continue;
				}
			}
			return this.sendReplyBox("'" + Tools.escapeHTML(target) + "' could not be found in any of the search categories.");
		}

		if (showAll && Object.size(searches) === 0 && megaSearch === null) return this.sendReplyBox("No search parameters other than 'all' were found. Try '/help dexsearch' for more information on this command.");

		var dex = {};
		for (var pokemon in Tools.data.Pokedex) {
			var template = Tools.getTemplate(pokemon);
			var megaSearchResult = (megaSearch === null || (megaSearch === true && template.isMega) || (megaSearch === false && !template.isMega));
			if (template.tier !== 'Unreleased' && template.tier !== 'Illegal' && (template.tier !== 'CAP' || (searches['tier'] && searches['tier']['cap'])) &&
				megaSearchResult) {
				dex[pokemon] = template;
			}
		}

		for (var search in {'moves':1, 'recovery':1, 'types':1, 'ability':1, 'tier':1, 'gen':1, 'color':1}) {
			if (!searches[search]) continue;
			switch (search) {
				case 'types':
					for (var mon in dex) {
						if (Object.count(searches[search], true) === 2) {
							if (!(searches[search][dex[mon].types[0]]) || !(searches[search][dex[mon].types[1]])) delete dex[mon];
						} else {
							if (searches[search][dex[mon].types[0]] === false || searches[search][dex[mon].types[1]] === false || (Object.count(searches[search], true) > 0 &&
								(!(searches[search][dex[mon].types[0]]) && !(searches[search][dex[mon].types[1]])))) delete dex[mon];
						}
					}
					break;

				case 'tier':
					for (var mon in dex) {
						if ('lc' in searches[search]) {
							// some LC legal Pokemon are stored in other tiers (Ferroseed/Murkrow etc)
							// this checks for LC legality using the going criteria, instead of dex[mon].tier
							var isLC = (dex[mon].evos && dex[mon].evos.length > 0) && !dex[mon].prevo && Tools.data.Formats['lc'].banlist.indexOf(dex[mon].species) === -1;
							if ((searches[search]['lc'] && !isLC) || (!searches[search]['lc'] && isLC)) {
								delete dex[mon];
								continue;
							}
						}
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];
					}
					break;

				case 'gen':
				case 'color':
					for (var mon in dex) {
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];
					}
					break;

				case 'ability':
					for (var mon in dex) {
						for (var ability in searches[search]) {
							var needsAbility = searches[search][ability];
							var hasAbility = Object.count(dex[mon].abilities, ability) > 0;
							if (hasAbility !== needsAbility) {
								delete dex[mon];
								break;
							}
						}
					}
					break;

				case 'moves':
					for (var mon in dex) {
						var template = Tools.getTemplate(dex[mon].id);
						if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
						if (!template.learnset) continue;
						for (var i in searches[search]) {
							var move = Tools.getMove(i);
							if (!move.exists) return this.sendReplyBox("'" + move + "' is not a known move.");
							var prevoTemp = Tools.getTemplate(template.id);
							while (prevoTemp.prevo && prevoTemp.learnset && !(prevoTemp.learnset[move.id])) {
								prevoTemp = Tools.getTemplate(prevoTemp.prevo);
							}
							var canLearn = (prevoTemp.learnset.sketch && !(move.id in {'chatter':1, 'struggle':1, 'magikarpsrevenge':1})) || prevoTemp.learnset[move.id];
							if ((!canLearn && searches[search][i]) || (searches[search][i] === false && canLearn)) delete dex[mon];
						}
					}
					break;

				case 'recovery':
					for (var mon in dex) {
						var template = Tools.getTemplate(dex[mon].id);
						if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
						if (!template.learnset) continue;
						var recoveryMoves = ["recover", "roost", "moonlight", "morningsun", "synthesis", "milkdrink", "slackoff", "softboiled", "wish", "healorder"];
						var canLearn = false;
						for (var i = 0; i < recoveryMoves.length; i++) {
							var prevoTemp = Tools.getTemplate(template.id);
							while (prevoTemp.prevo && prevoTemp.learnset && !(prevoTemp.learnset[recoveryMoves[i]])) {
								prevoTemp = Tools.getTemplate(prevoTemp.prevo);
							}
							canLearn = (prevoTemp.learnset.sketch) || prevoTemp.learnset[recoveryMoves[i]];
							if (canLearn) break;
						}
						if ((!canLearn && searches[search]) || (searches[search] === false && canLearn)) delete dex[mon];
					}
					break;

				default:
					return this.sendReplyBox("Something broke! PM TalkTakesTime here or on the Smogon forums with the command you tried.");
			}
		}

		var results = Object.keys(dex).map(function (speciesid) {return dex[speciesid].species;});
		results = results.filter(function (species) {
			var template = Tools.getTemplate(species);
			return !(species !== template.baseSpecies && results.indexOf(template.baseSpecies) > -1);
		});
		var resultsStr = "";
		if (results.length > 0) {
			if (showAll || results.length <= output) {
				results.sort();
				resultsStr = results.join(", ");
			} else {
				results.randomize();
				resultsStr = results.slice(0, 10).join(", ") + ", and " + string(results.length - output) + " more. Redo the search with 'all' as a search parameter to show all results.";
			}
		} else {
			resultsStr = "No Pokémon found.";
		}
		return this.sendReplyBox(resultsStr);
	},

	learnset: 'learn',
	learnall: 'learn',
	learn5: 'learn',
	g6learn: 'learn',
	learn: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help learn');

		if (!this.canBroadcast()) return;

		var lsetData = {set:{}};
		var targets = target.split(',');
		var template = Tools.getTemplate(targets[0]);
		var move = {};
		var problem;
		var all = (cmd === 'learnall');
		if (cmd === 'learn5') lsetData.set.level = 5;
		if (cmd === 'g6learn') lsetData.format = {noPokebank: true};

		if (!template.exists) {
			return this.sendReply("Pokemon '" + template.id + "' not found.");
		}

		if (targets.length < 2) {
			return this.sendReply("You must specify at least one move.");
		}

		for (var i = 1, len = targets.length; i < len; ++i) {
			move = Tools.getMove(targets[i]);
			if (!move.exists) {
				return this.sendReply("Move '" + move.id + "' not found.");
			}
			problem = TeamValidator.checkLearnsetSync(null, move, template, lsetData);
			if (problem) break;
		}
		var buffer = template.name + (problem ? " <span class=\"message-learn-cannotlearn\">can't</span> learn " : " <span class=\"message-learn-canlearn\">can</span> learn ") + (targets.length > 2 ? "these moves" : move.name);
		if (!problem) {
			var sourceNames = {E:"egg", S:"event", D:"dream world"};
			if (lsetData.sources || lsetData.sourcesBefore) buffer += " only when obtained from:<ul class=\"message-learn-list\">";
			if (lsetData.sources) {
				var sources = lsetData.sources.sort();
				var prevSource;
				var prevSourceType;
				var prevSourceCount = 0;
				for (var i = 0, len = sources.length; i < len; ++i) {
					var source = sources[i];
					if (source.substr(0, 2) === prevSourceType) {
						if (prevSourceCount < 0) {
							buffer += ": " + source.substr(2);
						} else if (all || prevSourceCount < 3) {
							buffer += ", " + source.substr(2);
						} else if (prevSourceCount === 3) {
							buffer += ", ...";
						}
						++prevSourceCount;
						continue;
					}
					prevSourceType = source.substr(0, 2);
					prevSourceCount = source.substr(2) ? 0 : -1;
					buffer += "<li>gen " + source.substr(0, 1) + " " + sourceNames[source.substr(1, 1)];
					if (prevSourceType === '5E' && template.maleOnlyHidden) buffer += " (cannot have hidden ability)";
					if (source.substr(2)) buffer += ": " + source.substr(2);
				}
			}
			if (lsetData.sourcesBefore) buffer += "<li>any generation before " + (lsetData.sourcesBefore + 1);
			buffer += "</ul>";
		}
		this.sendReplyBox(buffer);
	},

	weak: 'weakness',
	resist: 'weakness',
	weakness: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var targets = target.split(/[ ,\/]/);

		var pokemon = Tools.getTemplate(target);
		var type1 = Tools.getType(targets[0]);
		var type2 = Tools.getType(targets[1]);

		if (pokemon.exists) {
			target = pokemon.species;
		} else if (type1.exists && type2.exists) {
			pokemon = {types: [type1.id, type2.id]};
			target = type1.id + "/" + type2.id;
		} else if (type1.exists) {
			pokemon = {types: [type1.id]};
			target = type1.id;
		} else {
			return this.sendReplyBox("" + Tools.escapeHTML(target) + " isn't a recognized type or pokemon.");
		}

		var weaknesses = [];
		var resistances = [];
		var immunities = [];
		Object.keys(Tools.data.TypeChart).forEach(function (type) {
			var notImmune = Tools.getImmunity(type, pokemon);
			if (notImmune) {
				var typeMod = Tools.getEffectiveness(type, pokemon);
				switch (typeMod) {
				case 1:
					weaknesses.push(type);
					break;
				case 2:
					weaknesses.push("<b>" + type + "</b>");
					break;
				case -1:
					resistances.push(type);
					break;
				case -2:
					resistances.push("<b>" + type + "</b>");
					break;
				}
			} else {
				immunities.push(type);
			}
		});

		var buffer = [];
		buffer.push(pokemon.exists ? "" + target + ' (ignoring abilities):' : '' + target + ':');
		buffer.push('<span class=\"message-effect-weak\">Weaknesses</span>: ' + (weaknesses.join(', ') || 'None'));
		buffer.push('<span class=\"message-effect-resist\">Resistances</span>: ' + (resistances.join(', ') || 'None'));
		buffer.push('<span class=\"message-effect-immune\">Immunities</span>: ' + (immunities.join(', ') || 'None'));
		this.sendReplyBox(buffer.join('<br>'));
	},

	eff: 'effectiveness',
	type: 'effectiveness',
	matchup: 'effectiveness',
	effectiveness: function (target, room, user) {
		var targets = target.split(/[,/]/).slice(0, 2);
		if (targets.length !== 2) return this.sendReply("Attacker and defender must be separated with a comma.");

		var searchMethods = {'getType':1, 'getMove':1, 'getTemplate':1};
		var sourceMethods = {'getType':1, 'getMove':1};
		var targetMethods = {'getType':1, 'getTemplate':1};
		var source;
		var defender;
		var foundData;
		var atkName;
		var defName;
		for (var i = 0; i < 2; ++i) {
			var method;
			for (method in searchMethods) {
				foundData = Tools[method](targets[i]);
				if (foundData.exists) break;
			}
			if (!foundData.exists) return this.parse('/help effectiveness');
			if (!source && method in sourceMethods) {
				if (foundData.type) {
					source = foundData;
					atkName = foundData.name;
				} else {
					source = foundData.id;
					atkName = foundData.id;
				}
				searchMethods = targetMethods;
			} else if (!defender && method in targetMethods) {
				if (foundData.types) {
					defender = foundData;
					defName = foundData.species + " (not counting abilities)";
				} else {
					defender = {types: [foundData.id]};
					defName = foundData.id;
				}
				searchMethods = sourceMethods;
			}
		}

		if (!this.canBroadcast()) return;

		var factor = 0;
		if (Tools.getImmunity(source.type || source, defender)) {
			var totalTypeMod = 0;
			if (source.effectType !== 'Move' || source.basePower || source.basePowerCallback) {
				for (var i = 0; i < defender.types.length; i++) {
					var baseMod = Tools.getEffectiveness(source, defender.types[i]);
					var moveMod = source.onEffectiveness && source.onEffectiveness.call(Tools, baseMod, defender.types[i], source);
					totalTypeMod += typeof moveMod === 'number' ? moveMod : baseMod;
				}
			}
			factor = Math.pow(2, totalTypeMod);
		}

		this.sendReplyBox("" + atkName + " is " + factor + "x effective against " + defName + ".");
	},

	uptime: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var uptime = process.uptime();
		var uptimeText;
		if (uptime > 24 * 60 * 60) {
			var uptimeDays = Math.floor(uptime / (24 * 60 * 60));
			uptimeText = uptimeDays + " " + (uptimeDays === 1 ? "day" : "days");
			var uptimeHours = Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
			if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours === 1 ? "hour" : "hours");
		} else {
			uptimeText = uptime.seconds().duration();
		}
		this.sendReplyBox("Uptime: <b>" + uptimeText + "</b>");
	},

	groups: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"+ <b>Voice</b> - They can use ! commands like !groups, and talk during moderated chat<br />" +
			"% <b>Driver</b> - The above, and they can mute. Global % can also lock users and check for alts<br />" +
			"@ <b>Moderator</b> - The above, and they can ban users<br />" +
			"&amp; <b>Leader</b> - The above, and they can promote to moderator and force ties<br />" +
			"# <b>Room Owner</b> - They are leaders of the room and can almost totally control it<br />" +
			"~ <b>Administrator</b> - They can do anything, like change what this message says"
		);
	},

	git: 'opensource',
	opensource: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Pokemon Showdown is open source:<br />" +
			"- Language: JavaScript (Node.js)<br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown/commits/master\">What's new?</a><br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown\">Server source code</a><br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown-Client\">Client source code</a>"
		);
	},

	staff: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("<a href=\"https://www.smogon.com/sim/staff_list\">Pokemon Showdown Staff List</a>");
	},

	avatars: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('You can <button name="avatars">change your avatar</button> by clicking on it in the <button name="openOptions"><i class="icon-cog"></i> Options</button> menu in the upper right. Custom avatars are only obtainable by staff.');
	},

	showtan: function (target, room, user) {
		if (room.id !== 'showderp') return this.sendReply("The command '/showtan' was unrecognized. To send a message starting with '/showtan', type '//showtan'.");
		if (!this.can('modchat', null, room)) return;
		target = this.splitTarget(target);
		if (!this.targetUser) return this.sendReply("User not found");
		if (!room.users[this.targetUser.userid]) return this.sendReply("Not a showderper");
		this.targetUser.avatar = '#showtan';
		room.add("" + user.name + " applied showtan to affected area of " + this.targetUser.name);
	},

	introduction: 'intro',
	intro: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"New to competitive pokemon?<br />" +
			"- <a href=\"https://www.smogon.com/sim/ps_guide\">Beginner's Guide to Pokémon Showdown</a><br />" +
			"- <a href=\"https://www.smogon.com/dp/articles/intro_comp_pokemon\">An introduction to competitive Pokémon</a><br />" +
			"- <a href=\"https://www.smogon.com/bw/articles/bw_tiers\">What do 'OU', 'UU', etc mean?</a><br />" +
			"- <a href=\"https://www.smogon.com/xyhub/tiers\">What are the rules for each format? What is 'Sleep Clause'?</a>"
		);
	},

	mentoring: 'smogintro',
	smogonintro: 'smogintro',
	smogintro: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Welcome to Smogon's official simulator! Here are some useful links to <a href=\"https://www.smogon.com/mentorship/\">Smogon\'s Mentorship Program</a> to help you get integrated into the community:<br />" +
			"- <a href=\"https://www.smogon.com/mentorship/primer\">Smogon Primer: A brief introduction to Smogon's subcommunities</a><br />" +
			"- <a href=\"https://www.smogon.com/mentorship/introductions\">Introduce yourself to Smogon!</a><br />" +
			"- <a href=\"https://www.smogon.com/mentorship/profiles\">Profiles of current Smogon Mentors</a><br />" +
			"- <a href=\"http://mibbit.com/#mentor@irc.synirc.net\">#mentor: the Smogon Mentorship IRC channel</a>"
		);
	},

	calculator: 'calc',
	calc: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Pokemon Showdown! damage calculator. (Courtesy of Honko)<br />" +
			"- <a href=\"https://pokemonshowdown.com/damagecalc/\">Damage Calculator</a>"
		);
	},

	cap: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"An introduction to the Create-A-Pokemon project:<br />" +
			"- <a href=\"https://www.smogon.com/cap/\">CAP project website and description</a><br />" +
			"- <a href=\"https://www.smogon.com/forums/showthread.php?t=48782\">What Pokemon have been made?</a><br />" +
			"- <a href=\"https://www.smogon.com/forums/forums/311\">Talk about the metagame here</a><br />" +
			"- <a href=\"https://www.smogon.com/forums/threads/3512318/#post-5594694\">Sample XY CAP teams</a>"
		);
	},

	gennext: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"NEXT (also called Gen-NEXT) is a mod that makes changes to the game:<br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown/blob/master/mods/gennext/README.md\">README: overview of NEXT</a><br />" +
			"Example replays:<br />" +
			"- <a href=\"https://replay.pokemonshowdown.com/gennextou-120689854\">Zergo vs Mr Weegle Snarf</a><br />" +
			"- <a href=\"https://replay.pokemonshowdown.com/gennextou-130756055\">NickMP vs Khalogie</a>"
		);
	},

	om: 'othermetas',
	othermetas: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = "";
		var matched = false;
		if (!target) {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/forums/206/\">Other Metagames Forum</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3505031/\">Other Metagames Index</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3507466/\">Sample teams for entering Other Metagames</a><br />";
		}
		if (target === 'smogondoublesuu' || target === 'doublesuu') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516968/\">Doubles UU</a><br />";
		}
		if (target === 'smogontriples' || target === 'triples') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3511522/\">Smogon Triples</a><br />";
		}
		if (target === 'omofthemonth' || target === 'omotm' || target === 'month') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3481155/\">OM of the Month</a><br />";
		}
		if (target === 'balancedhackmons' || target === 'bh') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3515725/\">Balanced Hackmons Suspect Discussion</a><br />";
		}
		if (target === '1v1') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496773/\">1v1</a><br />";
		}
		if (target === 'monotype') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493087/\">Monotype</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3517737/\">Monotype Viability Rankings</a><br />";
		}
		if (target === 'tiershift' || target === 'ts') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508369/\">Tier Shift</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3514386/\">Tier Shift Viability Rankings</a><br />";
		}
		if (target === 'pu') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3513882/\">PU</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3517353/\">PU Viability Rankings</a><br />";
		}
		if (target === 'inversebattle' || target === 'inverse') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3518146/\">Inverse Battle</a><br />";
		}
		if (target === 'almostanyability' || target === 'aaa') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3517022/\">Almost Any Ability</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508794/\">Almost Any Ability Viability Rankings</a><br />";
		}
		if (target === 'stabmons') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493081/\">STABmons</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3512215/\">STABmons Viability Rankings</a><br />";
		}
		if (target === 'lcuu') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516967/\">LC UU</a><br />";
		}
		if (target === '350cup') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3512945/\">350 Cup</a><br />";
		}
		if (target === 'averagemons') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3495527/\">Averagemons</a><br />";
		}
		if (target === 'hackmons' || target === 'purehackmons' || target === 'classichackmons') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3500418/\">Hackmons</a><br />";
		}
		if (target === 'hiddentype') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516349/\">Hidden Type</a><br />";
		}
		if (target === 'middlecup' || target === 'mc') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3494887/\">Middle Cup</a><br />";
		}
		if (target === 'skybattle') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493601/\">Sky Battle</a><br />";
		}
		if (!matched) {
			return this.sendReply("The Other Metas entry '" + target + "' was not found. Try /othermetas or /om for general help.");
		}
		this.sendReplyBox(buffer);
	},

	/*formats: 'formathelp',
	formatshelp: 'formathelp',
	formathelp: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (this.broadcasting && (room.id === 'lobby' || room.battle)) return this.sendReply("This command is too spammy to broadcast in lobby/battles");
		var buf = [];
		var showAll = (target === 'all');
		for (var id in Tools.data.Formats) {
			var format = Tools.data.Formats[id];
			if (!format) continue;
			if (format.effectType !== 'Format') continue;
			if (!format.challengeShow) continue;
			if (!showAll && !format.searchShow) continue;
			buf.push({
				name: format.name,
				gameType: format.gameType || 'singles',
				mod: format.mod,
				searchShow: format.searchShow,
				desc: format.desc || 'No description.'
			});
		}
		this.sendReplyBox(
			"Available Formats: (<strong>Bold</strong> formats are on ladder.)<br />" +
			buf.map(function (data) {
				var str = "";
				// Bold = Ladderable.
				str += (data.searchShow ? "<strong>" + data.name + "</strong>" : data.name) + ": ";
				str += "(" + (!data.mod || data.mod === 'base' ? "" : data.mod + " ") + data.gameType + " format) ";
				str += data.desc;
				return str;
			}).join("<br />")
		);
	},*/

	roomhelp: function (target, room, user) {
		if (room.id === 'lobby' || room.battle) return this.sendReply("This command is too spammy for lobby/battles.");
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Room drivers (%) can use:<br />" +
			"- /warn OR /k <em>username</em>: warn a user and show the Pokemon Showdown rules<br />" +
			"- /mute OR /m <em>username</em>: 7 minute mute<br />" +
			"- /hourmute OR /hm <em>username</em>: 60 minute mute<br />" +
			"- /unmute <em>username</em>: unmute<br />" +
			"- /announce OR /wall <em>message</em>: make an announcement<br />" +
			"- /modlog <em>username</em>: search the moderator log of the room<br />" +
			"- /modnote <em>note</em>: adds a moderator note that can be read through modlog<br />" +
			"<br />" +
			"Room moderators (@) can also use:<br />" +
			"- /roomban OR /rb <em>username</em>: bans user from the room<br />" +
			"- /roomunban <em>username</em>: unbans user from the room<br />" +
			"- /roomvoice <em>username</em>: appoint a room voice<br />" +
			"- /roomdevoice <em>username</em>: remove a room voice<br />" +
			"- /modchat <em>[off/autoconfirmed/+]</em>: set modchat level<br />" +
			"<br />" +
			"Room owners (#) can also use:<br />" +
			"- /roomintro <em>intro</em>: sets the room introduction that will be displayed for all users joining the room<br />" +
			"- /rules <em>rules link</em>: set the room rules link seen when using /rules<br />" +
			"- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver<br />" +
			"- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver<br />" +
			"- /modchat <em>[%/@/#]</em>: set modchat level<br />" +
			"- /declare <em>message</em>: make a large blue declaration to the room<br />" +
			"- !htmlbox <em>HTML code</em>: broadcasts a box of HTML code to the room<br />" +
			"- !showimage <em>[url], [width], [height]</em>: shows an image to the room<br />" +
			"</div>"
		);
	},

	restarthelp: function (target, room, user) {
		if (room.id === 'lobby' && !this.can('lockdown')) return false;
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"The server is restarting. Things to know:<br />" +
			"- We wait a few minutes before restarting so people can finish up their battles<br />" +
			"- The restart itself will take around 0.6 seconds<br />" +
			"- Your ladder ranking and teams will not change<br />" +
			"- We are restarting to update Pokémon Showdown to a newer version"
		);
	},

	rule: 'rules',
	rules: function (target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox("Please follow the rules:<br />" +
				(room.rulesLink ? "- <a href=\"" + Tools.escapeHTML(room.rulesLink) + "\">" + Tools.escapeHTML(room.title) + " room rules</a><br />" : "") +
				"- <a href=\"https://pokemonshowdown.com/rules\">" + (room.rulesLink ? "Global rules" : "Rules") + "</a>");
			return;
		}
		if (!this.can('roommod', null, room)) return;
		if (target.length > 80) {
			return this.sendReply("Error: Room rules link is too long (must be under 80 characters). You can use a URL shortener to shorten the link.");
		}

		room.rulesLink = target.trim();
		this.sendReply("(The room rules link is now: " + target + ")");

		if (room.chatRoomData) {
			room.chatRoomData.rulesLink = room.rulesLink;
			Rooms.global.writeChatRoomData();
		}
	},

	faq: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = target.toLowerCase();
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq\">Frequently Asked Questions</a><br />";
		}
		if (target === 'deviation') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#deviation\">Why did this user gain or lose so many points?</a><br />";
		}
		if (target === 'doubles' || target === 'triples' || target === 'rotation') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#doubles\">Can I play doubles/triples/rotation battles here?</a><br />";
		}
		if (target === 'randomcap') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#randomcap\">What is this fakemon and what is it doing in my random battle?</a><br />";
		}
		if (target === 'restarts') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#restarts\">Why is the server restarting?</a><br />";
		}
		if (target === 'all' || target === 'star' || target === 'player') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#star">Why is there this star (&starf;) in front of my username?</a><br />';
		}
		if (target === 'staff') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/staff_faq\">Staff FAQ</a><br />";
		}
		if (target === 'autoconfirmed' || target === 'ac') {
			matched = true;
			buffer += "A user is autoconfirmed when they have won at least one rated battle and have been registered for a week or longer.<br />";
		}
		if (target === 'customavatar' || target === 'ca') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#customavatar\">How can I get a custom avatar?</a><br />";
		}
		if (!matched) {
			return this.sendReply("The FAQ entry '" + target + "' was not found. Try /faq for general help.");
		}
		this.sendReplyBox(buffer);
	},

	banlists: 'tiers',
	tier: 'tiers',
	tiers: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/tiers/\">Smogon Tiers</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/tiering-faq.3498332/\">Tiering FAQ</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/xyhub/tiers\">The banlists for each tier</a><br />";
		}
		if (target === 'overused' || target === 'ou') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3514144/\">np: OU Stage 6</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/dex/xy/tags/ou/\">OU Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3515714/\">OU Viability Rankings</a><br />";
		}
		if (target === 'ubers' || target === 'uber') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3519501/\">np: XY Ubers Shadow Tag Suspect Test</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496305/\">Ubers Viability Rankings</a><br />";
		}
		if (target === 'underused' || target === 'uu') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516640/\">np: UU Stage 3</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/dex/xy/tags/uu/\">UU Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516418/\">UU Viability Rankings</a><br />";
		}
		if (target === 'rarelyused' || target === 'ru') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3515615/\">np: RU Stage 4</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/dex/xy/tags/ru/\">RU Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516783/\">RU Viability Rankings</a><br />";
		}
		if (target === 'neverused' || target === 'nu') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3516675/\">np: NU Stage 2</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/dex/xy/tags/nu/\">NU Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3509494/\">NU Viability Rankings</a><br />";
		}
		if (target === 'littlecup' || target === 'lc') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3505710/\">Metagame Discussion Thread</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3490462/\">LC Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496013/\">LC Viability Rankings</a><br />";
		}
		if (target === 'smogondoubles' || target === 'doubles') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3509279/\">np: Doubles Stage 3.5</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3498688/\">Doubles Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496306/\">Doubles Viability Rankings</a><br />";
		}
		if (!matched) {
			return this.sendReply("The Tiers entry '" + target + "' was not found. Try /tiers for general help.");
		}
		this.sendReplyBox(buffer);
	},

	analysis: 'smogdex',
	strategy: 'smogdex',
	smogdex: function (target, room, user) {
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		if (toId(targets[0]) === 'previews') return this.sendReplyBox("<a href=\"https://www.smogon.com/forums/threads/sixth-generation-pokemon-analyses-index.3494918/\">Generation 6 Analyses Index</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		var pokemon = Tools.getTemplate(targets[0]);
		var item = Tools.getItem(targets[0]);
		var move = Tools.getMove(targets[0]);
		var ability = Tools.getAbility(targets[0]);
		var atLeastOne = false;
		var generation = (targets[1] || 'xy').trim().toLowerCase();
		var genNumber = 6;
		// var doublesFormats = {'vgc2012':1, 'vgc2013':1, 'vgc2014':1, 'doubles':1};
		var doublesFormats = {};
		var doublesFormat = (!targets[2] && generation in doublesFormats)? generation : (targets[2] || '').trim().toLowerCase();
		var doublesText = '';
		if (generation === 'xy' || generation === 'xy' || generation === '6' || generation === 'six') {
			generation = 'xy';
		} else if (generation === 'bw' || generation === 'bw2' || generation === '5' || generation === 'five') {
			generation = 'bw';
			genNumber = 5;
		} else if (generation === 'dp' || generation === 'dpp' || generation === '4' || generation === 'four') {
			generation = 'dp';
			genNumber = 4;
		} else if (generation === 'adv' || generation === 'rse' || generation === 'rs' || generation === '3' || generation === 'three') {
			generation = 'rs';
			genNumber = 3;
		} else if (generation === 'gsc' || generation === 'gs' || generation === '2' || generation === 'two') {
			generation = 'gs';
			genNumber = 2;
		} else if (generation === 'rby' || generation === 'rb' || generation === '1' || generation === 'one') {
			generation = 'rb';
			genNumber = 1;
		} else {
			generation = 'xy';
		}
		if (doublesFormat !== '') {
			// Smogon only has doubles formats analysis from gen 5 onwards.
			if (!(generation in {'bw':1, 'xy':1}) || !(doublesFormat in doublesFormats)) {
				doublesFormat = '';
			} else {
				doublesText = {'vgc2012':"VGC 2012", 'vgc2013':"VGC 2013", 'vgc2014':"VGC 2014", 'doubles':"Doubles"}[doublesFormat];
				doublesFormat = '/' + doublesFormat;
			}
		}

		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (genNumber < pokemon.gen) {
				return this.sendReplyBox("" + pokemon.name + " did not exist in " + generation.toUpperCase() + "!");
			}
			// if (pokemon.tier === 'CAP') generation = 'cap';
			if (pokemon.tier === 'CAP') return this.sendReply("CAP is not currently supported by Smogon Strategic Pokedex.");

			var illegalStartNums = {'351':1, '421':1, '487':1, '493':1, '555':1, '647':1, '648':1, '649':1, '681':1};
			if (pokemon.isMega || pokemon.num in illegalStartNums) pokemon = Tools.getTemplate(pokemon.baseSpecies);
			var poke = pokemon.name.toLowerCase().replace(/\ /g, '_').replace(/[^a-z0-9\-\_]+/g, '');

			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/pokemon/" + poke + doublesFormat + "\">" + generation.toUpperCase() + " " + doublesText + " " + pokemon.name + " analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		// Item
		if (item.exists && genNumber > 1 && item.gen <= genNumber) {
			atLeastOne = true;
			var itemName = item.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/items/" + itemName + "\">" + generation.toUpperCase() + " " + item.name + " item analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		// Ability
		if (ability.exists && genNumber > 2 && ability.gen <= genNumber) {
			atLeastOne = true;
			var abilityName = ability.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/abilities/" + abilityName + "\">" + generation.toUpperCase() + " " + ability.name + " ability analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		// Move
		if (move.exists && move.gen <= genNumber) {
			atLeastOne = true;
			var moveName = move.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/moves/" + moveName + "\">" + generation.toUpperCase() + " " + move.name + " move analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		if (!atLeastOne) {
			return this.sendReplyBox("Pokemon, item, move, or ability not found for generation " + generation.toUpperCase() + ".");
		}
	},

	/*********************************************************
	 * Miscellaneous commands
	 *********************************************************/

	potd: function (target, room, user) {
		if (!this.can('potd')) return false;

		Config.potd = target;
		Simulator.SimulatorProcess.eval('Config.potd = \'' + toId(target) + '\'');
		if (target) {
			if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day is now " + target + "!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>");
			this.logModCommand("The Pokemon of the Day was changed to " + target + " by " + user.name + ".");
		} else {
			if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>");
			this.logModCommand("The Pokemon of the Day was removed by " + user.name + ".");
		}
	},

	roll: 'dice',
	dice: function (target, room, user) {
		if (!target) return this.parse('/help dice');
		if (!this.canBroadcast()) return;
		var d = target.indexOf("d");
		if (d >= 0) {
			var num = parseInt(target.substring(0, d));
			var faces;
			if (target.length > d) faces = parseInt(target.substring(d + 1));
			if (isNaN(num)) num = 1;
			if (isNaN(faces)) return this.sendReply("The number of faces must be a valid integer.");
			if (faces < 1 || faces > 1000) return this.sendReply("The number of faces must be between 1 and 1000");
			if (num < 1 || num > 20) return this.sendReply("The number of dice must be between 1 and 20");
			var rolls = [];
			var total = 0;
			for (var i = 0; i < num; ++i) {
				rolls[i] = (Math.floor(faces * Math.random()) + 1);
				total += rolls[i];
			}
			return this.sendReplyBox("Random number " + num + "x(1 - " + faces + "): " + rolls.join(", ") + "<br />Total: " + total);
		}
		if (target && isNaN(target) || target.length > 21) return this.sendReply("The max roll must be a number under 21 digits.");
		var maxRoll = (target)? target : 6;
		var rand = Math.floor(maxRoll * Math.random()) + 1;
		return this.sendReplyBox("Random number (1 - " + maxRoll + "): " + rand);
	},

	pr: 'pickrandom',
	pick: 'pickrandom',
	pickrandom: function (target, room, user) {
		var options = target.split(',');
		if (options.length < 2) return this.parse('/help pick');
		if (!this.canBroadcast()) return false;
		return this.sendReplyBox('<em>We randomly picked:</em> ' + Tools.escapeHTML(options.sample().trim()));
	},

	register: function () {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('You will be prompted to register upon winning a rated battle. Alternatively, there is a register button in the <button name="openOptions"><i class="icon-cog"></i> Options</button> menu in the upper right.');
	},

	lobbychat: function (target, room, user, connection) {
		if (!Rooms.lobby) return this.popupReply("This server doesn't have a lobby.");
		target = toId(target);
		if (target === 'off') {
			user.leaveRoom(Rooms.lobby, connection.socket);
			connection.send('|users|');
			this.sendReply("You are now blocking lobby chat.");
		} else {
			user.joinRoom(Rooms.lobby, connection);
			this.sendReply("You are now receiving lobby chat.");
		}
	},

	showimage: function (target, room, user) {
		if (!target) return this.parse('/help showimage');
		if (!this.can('declare', null, room)) return false;
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		if (targets.length !== 3) {
			return this.parse('/help showimage');
		}

		this.sendReply('|raw|<img src="' + Tools.escapeHTML(targets[0]) + '" alt="" width="' + toId(targets[1]) + '" height="' + toId(targets[2]) + '" />');
	},

	htmlbox: function (target, room, user) {
		if (!target) return this.parse('/help htmlbox');
		if (!this.can('declare', null, room)) return;
		if (!this.canHTML(target)) return;
		if (!this.canBroadcast('!htmlbox')) return;

		this.sendReplyBox(target);
	},

	a: function (target, room, user) {
		if (!this.can('rawpacket')) return false;
		// secret sysop command
		room.add(target);
	},

	/*********************************************************
	 * Help commands
	 *********************************************************/

	commands: 'help',
	h: 'help',
	'?': 'help',
	help: function (target, room, user) {
		target = target.toLowerCase();
		var matched = false;
		if (target === 'msg' || target === 'pm' || target === 'whisper' || target === 'w') {
			matched = true;
			this.sendReply("/msg OR /whisper OR /w [username], [message] - Send a private message.");
		}
		if (target === 'r' || target === 'reply') {
			matched = true;
			this.sendReply("/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.");
		}
		if (target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
			matched = true;
			this.sendReply("/rating - Get your own rating.");
			this.sendReply("/rating [username] - Get user's rating.");
		}
		if (target === 'nick') {
			matched = true;
			this.sendReply("/nick [new username] - Change your username.");
		}
		if (target === 'avatar') {
			matched = true;
			this.sendReply("/avatar [new avatar number] - Change your trainer sprite.");
		}
		if (target === 'whois' || target === 'alts' || target === 'ip' || target === 'rooms') {
			matched = true;
			this.sendReply("/whois - Get details on yourself: alts, group, IP address, and rooms.");
			this.sendReply("/whois [username] - Get details on a username: alts (Requires: % @ & ~), group, IP address (Requires: @ & ~), and rooms.");
		}
		if (target === 'data') {
			matched = true;
			this.sendReply("/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability/nature.");
			this.sendReply("!data [pokemon/item/move/ability] - Show everyone these details. Requires: + % @ & ~");
		}
		if (target === 'details' || target === 'dt') {
			matched = true;
			this.sendReply("/details [pokemon] - Get additional details on this pokemon/item/move/ability/nature.");
			this.sendReply("!details [pokemon] - Show everyone these details. Requires: + % @ & ~");
		}
		if (target === 'analysis') {
			matched = true;
			this.sendReply("/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.");
			this.sendReply("!analysis [pokemon], [generation] - Shows everyone this link. Requires: + % @ & ~");
		}
		if (target === 'groups') {
			matched = true;
			this.sendReply("/groups - Explains what the + % @ & next to people's names mean.");
			this.sendReply("!groups - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'opensource') {
			matched = true;
			this.sendReply("/opensource - Links to PS's source code repository.");
			this.sendReply("!opensource - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'avatars') {
			matched = true;
			this.sendReply("/avatars - Explains how to change avatars.");
			this.sendReply("!avatars - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'intro') {
			matched = true;
			this.sendReply("/intro - Provides an introduction to competitive pokemon.");
			this.sendReply("!intro - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'cap') {
			matched = true;
			this.sendReply("/cap - Provides an introduction to the Create-A-Pokemon project.");
			this.sendReply("!cap - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'om') {
			matched = true;
			this.sendReply("/om - Provides links to information on the Other Metagames.");
			this.sendReply("!om - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'learn' || target === 'learnset' || target === 'learnall') {
			matched = true;
			this.sendReply("/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.");
			this.sendReply("!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'calc' || target === 'calculator') {
			matched = true;
			this.sendReply("/calc - Provides a link to a damage calculator");
			this.sendReply("!calc - Shows everyone a link to a damage calculator. Requires: + % @ & ~");
		}
		if (target === 'blockchallenges' || target === 'away' || target === 'idle') {
			matched = true;
			this.sendReply("/blockchallenges - Blocks challenges so no one can challenge you. Deactivate it with /back.");
		}
		if (target === 'allowchallenges' || target === 'back') {
			matched = true;
			this.sendReply("/back - Unlocks challenges so you can be challenged again. Deactivate it with /away.");
		}
		if (target === 'faq') {
			matched = true;
			this.sendReply("/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.");
			this.sendReply("!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: + % @ & ~");
		}
		if (target === 'highlight') {
			matched = true;
			this.sendReply("Set up highlights:");
			this.sendReply("/highlight add, word - add a new word to the highlight list.");
			this.sendReply("/highlight list - list all words that currently highlight you.");
			this.sendReply("/highlight delete, word - delete a word from the highlight list.");
			this.sendReply("/highlight delete - clear the highlight list");
		}
		if (target === 'timestamps') {
			matched = true;
			this.sendReply("Set your timestamps preference:");
			this.sendReply("/timestamps [all|lobby|pms], [minutes|seconds|off]");
			this.sendReply("all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences");
			this.sendReply("off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]");
		}
		if (target === 'effectiveness' || target === 'matchup' || target === 'eff' || target === 'type') {
			matched = true;
			this.sendReply("/effectiveness OR /matchup OR /eff OR /type [attack], [defender] - Provides the effectiveness of a move or type on another type or a Pokémon.");
			this.sendReply("!effectiveness OR !matchup OR !eff OR !type [attack], [defender] - Shows everyone the effectiveness of a move or type on another type or a Pokémon.");
		}
		if (target === 'dexsearch' || target === 'dsearch' || target === 'ds') {
			matched = true;
			this.sendReply("/dexsearch [type], [move], [move], ... - Searches for Pokemon that fulfill the selected criteria.");
			this.sendReply("Search categories are: type, tier, color, moves, ability, gen.");
			this.sendReply("Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.");
			this.sendReply("Valid tiers are: Uber/OU/BL/UU/BL2/RU/BL3/NU/PU/LC/CAP.");
			this.sendReply("Types must be followed by ' type', e.g., 'dragon type'.");
			this.sendReply("Parameters can be excluded through the use of '!', e.g., '!water type' excludes all water types.");
			this.sendReply("The parameter 'mega' can be added to search for Mega Evolutions only, and the parameters 'FE' or 'NFE' can be added to search fully or not-fully evolved Pokemon only.");
			this.sendReply("The order of the parameters does not matter.");
		}
		if (target === 'dice' || target === 'roll') {
			matched = true;
			this.sendReply("/dice [optional max number] - Randomly picks a number between 1 and 6, or between 1 and the number you choose.");
			this.sendReply("/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.");
		}
		if (target === 'pick' || target === 'pickrandom') {
			matched = true;
			this.sendReply("/pick [option], [option], ... - Randomly selects an item from a list containing 2 or more elements.");
		}
		if (target === 'join') {
			matched = true;
			this.sendReply("/join [roomname] - Attempts to join the room [roomname].");
		}
		if (target === 'ignore') {
			matched = true;
			this.sendReply("/ignore [user] - Ignores all messages from the user [user].");
			this.sendReply("Note that staff messages cannot be ignored.");
		}
		if (target === 'invite') {
			matched = true;
			this.sendReply("/invite [username], [roomname] - Invites the player [username] to join the room [roomname].");
		}
		if (target === 'all' || target === 'profile') {
			matched = true;
			this.sendReply("/profile [username] - Shows infomation about the user.");
		}
		if (target === 'all' || target === 'about' || target === 'setabout') {
			matched = true;
			this.sendReply("/about [information] - Set a description about you for your profile.");
		}
		if (target === 'all' || target === 'transfermoney' || target === 'transferbuck' || target === 'transferbucks') {
			matched = true;
			this.sendReply("/transfermoney [username], [amount] - Transfer a certain amount of money to another user.");
		}
		if (target === 'all' || target === 'buy') {
			matched = true;
			this.sendReply("/buy [command] - Buys something from the shop.");
		}
		if (target === 'all' || target === 'poll') {
			matched = true;
			this.sendReply("/poll [question], [option], [option], etc. - Creates a poll.");
		}
		if (target === 'all' || target === 'vote') {
			matched = true;
			this.sendReply("/vote [option] - votes for the specified option in the poll.");
		}
		if (target === 'all' || target === 'regdate') {
			matched = true;
			this.sendReply("/regdate [username] - Shows registeration date of a user.");
		}
		if (target === 'all' || target === 'pmall' || target === 'masspm') {
			matched = true;
			this.sendReply("/pmall [message] - Sends a message to all users in the server.");
		}
		if (target === 'all' || target === 'rmall') {
			matched = true;
			this.sendReply("/rmall [message] - Sends a message to all users in a room.");
		}
		if (target === 'all' || target === 'tell') {
			matched = true;
			this.sendReply("/tell [username], [message] - Tells a message to a user.");
		}
		if (target === 'all' || target === 'customsymbol') {
			matched = true;
			this.sendReply("/customsymbol [symbol] - Changes your symbol (usergroup) to the specified symbol. The symbol can only be one character.");
		}
		if (target === 'all' || target === 'urbandefine' || target === 'ud') {
			matched = true;
			this.sendReply("/urbandefine [phrase] - Looks up this phrase on urbandictionary.com.");
		}
		if (target === 'all' || target === 'define' || target === 'def') {
			matched = true;
			this.sendReply("/define [word] - Looks up this word on the internet.");
		}
		if (target === 'all' || target === 'emoticon' || target === 'emoticons') {
			matched = true;
			this.sendReply("/emoticons - Displays all emoticons available.");
		}
		// driver commands
		if (target === 'lock' || target === 'l') {
			matched = true;
			this.sendReply("/lock OR /l [username], [reason] - Locks the user from talking in all chats. Requires: % @ & ~");
		}
		if (target === 'unlock') {
			matched = true;
			this.sendReply("/unlock [username] - Unlocks the user. Requires: % @ & ~");
		}
		if (target === 'redirect' || target === 'redir') {
			matched = true;
			this.sendReply("/redirect OR /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: % @ & ~");
		}
		if (target === 'modnote') {
			matched = true;
			this.sendReply("/modnote [note] - Adds a moderator note that can be read through modlog. Requires: % @ & ~");
		}
		if (target === 'forcerename' || target === 'fr') {
			matched = true;
			this.sendReply("/forcerename OR /fr [username], [reason] - Forcibly change a user's name and shows them the [reason]. Requires: % @ & ~");
		}
		if (target === 'kickbattle ') {
			matched = true;
			this.sendReply("/kickbattle [username], [reason] - Kicks a user from a battle with reason. Requires: % @ & ~");
		}
		if (target === 'warn' || target === 'k') {
			matched = true;
			this.sendReply("/warn OR /k [username], [reason] - Warns a user showing them the Pokemon Showdown Rules and [reason] in an overlay. Requires: % @ & ~");
		}
		if (target === 'modlog') {
			matched = true;
			this.sendReply("/modlog [roomid|all], [n] - Roomid defaults to current room. If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15. If n is not a number, search the moderator log for 'n' on room's log [roomid]. If you set [all] as [roomid], searches for 'n' on all rooms's logs. Requires: % @ & ~");
		}
		if (target === 'mute' || target === 'm') {
			matched = true;
			this.sendReply("/mute OR /m [username], [reason] - Mutes a user with reason for 7 minutes. Requires: % @ & ~");
		}
		if (target === 'hourmute' || target === 'hm') {
			matched = true;
			this.sendReply("/hourmute OR /hm [username], [reason] - Mutes a user with reason for an hour. Requires: % @ & ~");
		}
		if (target === 'unmute' || target === 'um') {
			matched = true;
			this.sendReply("/unmute [username] - Removes mute from user. Requires: % @ & ~");
		}

		// mod commands
		if (target === 'roomban' || target === 'rb') {
			matched = true;
			this.sendReply("/roomban [username] - Bans the user from the room you are in. Requires: @ & ~");
		}
		if (target === 'roomunban') {
			matched = true;
			this.sendReply("/roomunban [username] - Unbans the user from the room you are in. Requires: @ & ~");
		}
		if (target === 'ban' || target === 'b') {
			matched = true;
			this.sendReply("/ban OR /b [username], [reason] - Kick user from all rooms and ban user's IP address with reason. Requires: @ & ~");
		}
		if (target === 'unban') {
			matched = true;
			this.sendReply("/unban [username] - Unban a user. Requires: @ & ~");
		}

		// RO commands
		if (target === 'showimage') {
			matched = true;
			this.sendReply("/showimage [url], [width], [height] - Show an image. Requires: # & ~");
		}
		if (target === 'roompromote') {
			matched = true;
			this.sendReply("/roompromote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: @ # & ~");
		}
		if (target === 'roomdemote') {
			matched = true;
			this.sendReply("/roomdemote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: @ # & ~");
		}

		// leader commands
		if (target === 'banip') {
			matched = true;
			this.sendReply("/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~");
		}
		if (target === 'unbanip') {
			matched = true;
			this.sendReply("/unbanip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~");
		}
		if (target === 'unbanall') {
			matched = true;
			this.sendReply("/unbanall - Unban all IP addresses. Requires: & ~");
		}
		if (target === 'promote') {
			matched = true;
			this.sendReply("/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: & ~");
		}
		if (target === 'demote') {
			matched = true;
			this.sendReply("/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: & ~");
		}
		if (target === 'forcetie') {
			matched = true;
			this.sendReply("/forcetie - Forces the current match to tie. Requires: & ~");
		}
		if (target === 'declare') {
			matched = true;
			this.sendReply("/declare [message] - Anonymously announces a message. Requires: & ~");
		}

		// admin commands
		if (target === 'chatdeclare' || target === 'cdeclare') {
			matched = true;
			this.sendReply("/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: ~");
		}
		if (target === 'globaldeclare' || target === 'gdeclare') {
			matched = true;
			this.sendReply("/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: ~");
		}
		if (target === 'htmlbox') {
			matched = true;
			this.sendReply("/htmlbox [message] - Displays a message, parsing HTML code contained. Requires: ~ # with global authority");
		}
		if (target === 'announce' || target === 'wall') {
			matched = true;
			this.sendReply("/announce OR /wall [message] - Makes an announcement. Requires: % @ & ~");
		}
		if (target === 'modchat') {
			matched = true;
			this.sendReply("/modchat [off/autoconfirmed/+/%/@/&/~] - Set the level of moderated chat. Requires: @ for off/autoconfirmed/+ options, & ~ for all the options");
		}
		if (target === 'hotpatch') {
			matched = true;
			this.sendReply("Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: ~");
			this.sendReply("Hot-patching has greater memory requirements than restarting.");
			this.sendReply("/hotpatch chat - reload chat-commands.js");
			this.sendReply("/hotpatch battles - spawn new simulator processes");
			this.sendReply("/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and also spawn new simulator processes");
		}
		if (target === 'lockdown') {
			matched = true;
			this.sendReply("/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~");
		}
		if (target === 'kill') {
			matched = true;
			this.sendReply("/kill - kills the server. Can't be done unless the server is in lockdown state. Requires: ~");
		}
		if (target === 'loadbanlist') {
			matched = true;
			this.sendReply("/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: ~");
		}
		if (target === 'makechatroom') {
			matched = true;
			this.sendReply("/makechatroom [roomname] - Creates a new room named [roomname]. Requires: ~");
		}
		if (target === 'deregisterchatroom') {
			matched = true;
			this.sendReply("/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: ~");
		}
		if (target === 'roomowner') {
			matched = true;
			this.sendReply("/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: ~");
		}
		if (target === 'roomdeowner') {
			matched = true;
			this.sendReply("/roomdeowner [username] - Removes [username]'s status as a room owner. Requires: ~");
		}
		if (target === 'privateroom') {
			matched = true;
			this.sendReply("/privateroom [on/off] - Makes or unmakes a room private. Requires: ~");
		}

		// overall
		if (target === 'help' || target === 'h' || target === '?' || target === 'commands') {
			matched = true;
			this.sendReply("/help OR /h OR /? - Gives you help.");
		}
		if (target === '~' || target === 'givemoney' || target === 'givebuck' || target === 'givebucks') {
			matched = true;
			this.sendReply("/givemoney [username], [amount] - Gives money to a user. Requires: ~");
		}
		if (target === '~' || target === 'takemoney' || target === 'takebuck' || target === 'takebucks') {
			matched = true;
			this.sendReply("/takemoney [username], [amount] - Takes money from a user. Requires: ~");
		}
		if (target === '~' || target === 'sudo') {
			matched = true;
			this.sendReply("/sudo [username], [message/command] - Makes another player perform a command (or speak) as if they typed it in the chat box themselves. Requires: ~");
		}
		if (target === '~' || target === 'kick') {
			matched = true;
			this.sendReply("/kick [username] - Kicks a username from the room. Requires: ~");
		}
		if (target === '~' || target === 'control') {
			matched = true;
			this.sendReply("/control [username], [say/pm], [message/user that you want to pm to], [pm message] - Controls what the user says and pm. Requires: ~");
		}
		if (target === '~' || target === 'controlpanel' || target === 'cp') {
			matched = true;
			this.sendReply("/controlpanel - Displays settings to be editted by adminstration. Requires: ~");
		}
		if (target === '~' || target === 'clearall') {
			matched = true;
			this.sendReply("/clearall - Clears all messages in the room. Requires: ~");
		}
		if (target === '~' || target === 'roomlist') {
			matched = true;
			this.sendReply("/roomlist - Display all rooms. Requires: ~");
		}
		if (!target) {
			this.sendReply("COMMANDS: /nick, /avatar, /rating, /whois, /msg, /reply, /ignore, /away, /back, /timestamps, /highlight");
			this.sendReply("INFORMATIONAL COMMANDS: /data, /dexsearch, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. Broadcasting requires: + % @ & ~)");
			if (user.group !== Config.groupsranking[0]) {
				this.sendReply("DRIVER COMMANDS: /warn, /mute, /unmute, /alts, /forcerename, /modlog, /lock, /unlock, /announce, /redirect");
				this.sendReply("MODERATOR COMMANDS: /ban, /unban, /ip");
				this.sendReply("LEADER COMMANDS: /declare, /forcetie, /forcewin, /promote, /demote, /banip, /unbanall");
			}
			this.sendReply("For an overview of room commands, use /roomhelp");
			this.sendReply("For details of a specific command, use something like: /help data");
		} else if (!matched) {
			this.sendReply("Help for the command '" + target + "' was not found. Try /help for general help");
		}
	}

};
