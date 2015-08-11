exports.commands = {
	gdeclarered: 'gdeclare',
	gdeclaregreen: 'gdeclare',
	gdeclare: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help gdeclare');
		if (!this.can('declare')) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		var roomName = (room.isPrivate) ? 'a private room' : room.id;
		var colour = cmd.substr(8) || 'blue';
		for (var id in Rooms.rooms) {
			var tarRoom = Rooms.rooms[id];
			if (tarRoom.id !== 'global') {
				tarRoom.addRaw('<div class="broadcast-' + colour + '"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
				tarRoom.update();
			}
		}
		this.logModCommand(user.name + ' globally declared ' + target);
	},

	declaregreen: 'declarered',
	declarered: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		room.addRaw('<div class="broadcast-' + cmd.substr(7) + '"><b>' + target + '</b></div>');
		room.update();
		this.logModCommand(user.name + ' declared ' + target);
	},

	pdeclare: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		room.addRaw('<div class="broadcast-purple"><b>' + target + '</b></div>');
		room.update();
		this.logModCommand(user.name + ' declared ' + target);
	},

	sd: 'declaremod',
	staffdeclare: 'declaremod',
	modmsg: 'declaremod',
	moddeclare: 'declaremod',
	declaremod: function (target, room, user) {
		if (!target) return this.sendReply('/declaremod [message] - Also /moddeclare and /modmsg');
		if (!this.can('declare', null, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		this.privateModCommand('|raw|<div class="broadcast-red"><b><font size=1><i>Private Auth (Driver +) declare from ' + user.name + '<br /></i></font size>' + target + '</b></div>');
		room.update();
		this.logModCommand(user.name + ' mod declared ' + target);
	},

	rk: 'kick',
	roomkick: 'kick',
	kick: function (target, room, user) {
		if (!target) return this.sendReply('/help kick');
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.sendReply('User "' + this.targetUsername + '" not found.');
		if (!this.can('mute', targetUser, room)) return false;

		this.addModCommand(targetUser.name + ' was kicked from the room by ' + user.name + '.');
		targetUser.popup('You were kicked from ' + room.id + ' by ' + user.name + '.');
		targetUser.leaveRoom(room.id);
	},

	dm: 'daymute',
	daymute: function (target, room, user) {
		if (!target) return this.parse('/help daymute');
		if (!this.can('mute', targetUser, room)) return false;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User "' + this.targetUsername + '" not found.');

		if (((targetUser.mutedRooms[room.id] && (targetUser.muteDuration[room.id] || 0) >= 50 * 60 * 1000) || targetUser.locked) && !target) {
			var problem = ' but was already ' + (!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			return this.privateModCommand('(' + targetUser.name + ' would be muted by ' + user.name + problem + '.)');
		}

		targetUser.popup(user.name + ' has muted you for 24 hours. ' + target);
		this.addModCommand('' + targetUser.name + ' was muted by ' + user.name + ' for 24 hours.' + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand("" + targetUser.name + "'s alts were also muted: " + alts.join(", "));

		targetUser.mute(room.id, 24 * 60 * 60 * 1000, true);
	},

        memes: 'meme',
	meme: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = target.toLowerCase();
		var matched = false;
		if (target === ''){
			matched = true;
			this.sendReplyBox('<center><b><font color="purple"><a href="http://pastebin.com/9ADzqbzA">List of memes!</a><br>Is there a meme missing that you want added? Message a & or ~ and we will consider adding it!</font></b></center>');
                }
		if (target === 'aliens'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/7puX3D3.jpg" />');
		}
		if (target === 'salt'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/Y5bbFq1.jpg" />');
		}
		if (target === 'fragequit'){
			matched = true;
			this.sendReplyBox('<img src="http://i0.kym-cdn.com/photos/images/original/000/000/578/1234931504682.jpg" height="189" width="317" />');
		}
		if (target === 'fuck yeah'){
			matched = true;
			this.sendReplyBox('<img src="http://cdn.ebaumsworld.com/mediaFiles/picture/602006/80615085.jpg" height="200" width="200" />');
		}
		if (target === 'so hard'){
			matched = true;
			this.sendReplyBox('<img src="http://oi57.tinypic.com/io24g4.jpg" />');
		}
		if (target === 'umad'){
			matched = true;
			this.sendReplyBox('<img src="http://dailysnark.com/wp-content/uploads/2013/11/umad.gif" />');
		}
		if (target === 'burnheal'){
			matched = true;
			this.sendReplyBox('<img src="http://yoshi348.thedailypos.org/imagefest/yellow/yoshi3/poke157.png" />');
		}
		if (target === 'ou train'){
			matched = true;
			this.sendReplyBox('<img src="https://i.chzbgr.com/maxW500/7970259968/h1BCECD4B/" height="300" width="400" />');
		}
		if (target === 'gary train'){
			matched = true;
			this.sendReplyBox('<img src="http://25.media.tumblr.com/79f09b46546f72a8be7643b73760aae7/tumblr_mkziy58ed71s79jjoo1_250.gif" />');
		}
		if (target === 'if you know what i mean'){
			matched = true;
			this.sendReplyBox('<img src="http://fcdn.mtbr.com/attachments/california-norcal/805709d1370480032-should-strava-abandon-kom-dh-2790387-if-you-know-what-i-mean.png" />');
		}
		if (target === 'doge'){
			matched = true;
			this.sendReplyBox('<img src="http://0.media.dorkly.cvcdn.com/79/63/33f2d1f368e229c7e09baa64804307b4-a-wild-doge-appeared.jpg" height="242" width="300" />');
		}
		if (target === 'troll'){
			matched = true;
			this.sendReplyBox('<img src="http://static3.wikia.nocookie.net/__cb20131014231760/legomessageboards/images/c/c2/Troll-face.png" height="200" width="200" />');
		}
		if (target === 'fail'){
			matched = true;
			this.sendReplyBox('<img src="http://diginomica.com/wp-content/uploads/2013/11/+big-fail2.jpg" height="180" width="320" />');
		}
		if (target === 'wtf'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/rcwmZSE.png" />');
		}
		if (target === 'professor oak'){
			matched = true;
			this.sendReplyBox('<img src="http://fc05.deviantart.net/fs71/f/2012/092/a/b/not_sure_if___meme_8_by_therealfry1-d4urwmg.jpg" />');
		}
		if (target === 'hawkward'){
			matched = true;
			this.sendReplyBox('<img src="https://i.imgflip.com/e6cip.jpg" height="350" width="330" />');
		}
		if (target === 'i dont always'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/H0BPFem.jpg" height="314" width="320" />');
		}
		if (target === 'all of the homo'){
			matched = true;
			this.sendReplyBox('<img src="http://31.media.tumblr.com/tumblr_lurr17gQZ61r190lwo1_500.gif" height="143" width="250" />');
		}
		if (target === 'cool story bro'){
			matched = true;
			this.sendReplyBox('<img src="http://www.troll.me/images/creepy-willy-wonka/cool-story-bro-lets-hear-it-one-more-time.jpg" height="275" width="275" />');
		}
		if (target === 'udense'){
			matched = true;
			this.sendReplyBox('<img src="http://i2.kym-cdn.com/photos/images/newsfeed/000/461/903/3a9.png" height="250" width="340" />');
		}
		if (target === 'dodge'){
			matched = true;
			this.sendReplyBox('<img src="http://weknowmemes.com/generator/uploads/generated/g1336276473177814171.jpg" height="250" width="256" />');
		}
		if (target === 'you dont say'){
			matched = true;
			this.sendReplyBox('<img src="http://www.wired.com/images_blogs/gamelife/2014/01/youdontsay.jpg" height="209" width="250" />');
		}
		if (target === 'cockblocked'){
			matched = true;
			this.sendReplyBox('<img src="http://www.quickmeme.com/img/27/27cf7456b43b14cc55bc557d678445f0048beca248d48779c902fbc1715d2753.jpg" height="300" width="300" />');
		}
		if (target === 'save the titanic'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/hl6VKnp.png" />');
		}
		if (target === 'ninjask\'d'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/ST7DNnh.png" />');
		}
		if (target === 'fuck this'){
			matched = true;
			this.sendReplyBox('<img src="http://i3.kym-cdn.com/photos/images/original/000/571/700/c3a.gif" height="150" width="300" />');
		}
		if (target === 'slowbro'){
			matched = true;
			this.sendReplyBox('<img src="http://static.fjcdn.com/pictures/U_698d9e_2568950.jpg" height="216" width="199" />');
		}
		if (target === 'he has a point'){
			matched = true;
			this.sendReplyBox('<img src="http://m.memegen.com/56jc1t.jpg" height="192" width="256" />');
		}
		if (target === 'rekt'){
			matched = true;
			this.sendReplyBox('<img src="http://media.giphy.com/media/10GQalkPJf5Mm4/giphy.gif" height="250" width="300" />');
		}
		if (target === 'death stare'){
			matched = true;
			this.sendReplyBox('<img src="http://i.kinja-img.com/gawker-media/image/upload/s--IL80Wq6b--/spnlcrxx0fwzwtszk2fm.gif" height="169" width="318" />');
		}
		if (target === 'what is love'){
			matched = true;
			this.sendReplyBox('<img src="http://i3.kym-cdn.com/photos/images/newsfeed/000/460/314/28d.gif" height="192" width="250" />');
		}
		if (target === 'badass'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/Ai78NEt.png" />');
		}
		if (target === 'onixpected'){
			matched = true;
			this.sendReplyBox('<img src="https://s3.amazonaws.com/colorslive/png/1016349-V7YrNOJxjNbeeSYR.png" height="200" width="300" />');
		}
		if (target === 'wood hammer'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/kVOXqph.png" />');
		}
		if (target === 'excuses'){
			matched = true;
			this.sendReplyBox('<img src="http://cdn.memegenerator.net/instances/400x/37768972.jpg" height="200" width="200" />');
		}
		if (target === 'hax'){
			matched = true;
			this.sendReplyBox('<img src="http://cdn.memegenerator.net/instances/500x/52485639.jpg" height="188" width="250" />');
		}
		if (target === 'hazogonal'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/3oYGPku.png" />');
		}

		if (target === 'spheal with it'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/fqijYH7.jpg" width="229" height="219" />');
		}
		if (target === 'hazeel'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/z4lB7eO.gif" />');
		}
		if (target === 'trick master is love'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/6YvQuXX.png" width="411" height="204" />');
		}
		if (target === '7.8'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/Gi0jjuf.jpg" />');
		}
		if (target === 'parukia'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/OjAOrK1.jpg" width="300" height="226" />');
		}
		if (target === 'fabulous'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/HsY0KpR.gif" />');
		}
		if (target === 'wrong neighborhood'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/aiv8eyj.gif" />');
		}
		if (target === 'i regret nothing'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/1brNf9v.gif" />');
		}
		if (target === 'twss'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/cRoo7mt.jpg" />');
		}
		if (target === 'hm01'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/zl7CBuw.jpg" />');
		}
		if (target === 'bitch please'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/8hwtxWt.gif" />');
		}
		if (target === 'control your orgasms'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/QNO3TcF.gif" />');
		}
		if (target === 'haters gonna hate'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/FigQw0C.gif" />');
		}
		if (target === 'your mom'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/gBsEdHr.jpg" />');
		}
		if (target === 'shrekt'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/vXffwmY.jpg" />');
		}
		if (target === 'snickers'){
			matched = true;
			this.sendReplyBox('<img src="http://static.fjcdn.com/pictures/Grab+a+snickers+not+mine_b3375c_4726614.png" />');
		}
		if (target === 'baka'){
			matched = true;
			this.sendReplyBox('<img src="http://cdn.sakuramagazine.com/wp-content/uploads/2013/12/Baka-manga-34558590-640-512.jpg" width="320" height="256" />');
		}
		if (target === 'tits or gtfo'){
			matched = true;
			this.sendReplyBox('<img src="http://static.fjcdn.com/pictures/Tits_858516_1361125.jpg" width="250" height="329" />');
		}
		if (target === 'swiggity'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/9yZA32s.gif" />');
		}
		if (target === 'dat ass'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/owuyFAB.png" />');
		}
		if (target === 'once you go'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/R0Unfd9.jpg" />');
		}
		if (target === 'i\'m really feeling it'){
			matched = true;
			this.sendReplyBox('<img src="http://i1.kym-cdn.com/photos/images/newsfeed/000/824/456/8a4.jpg" height="210" width="320" />');
		}
		if (target === 'it\'s a trap'){
			matched = true;
			this.sendReplyBox('<img src="http://i0.kym-cdn.com/photos/images/newsfeed/000/692/118/2db.jpg" height="169" width="250" />');
		}
		if (target === 'in a row'){
			matched = true;
			this.sendReplyBox('<img src="http://i.imgur.com/W5K7Ey1.png" />');
		}
		if (target === 'russian spy'){
			matched = true;
			this.sendReplyBox('<img src="http://imgdonkey.com/big/VGpQeW5ZTw/bill-nye-the-gangsta-guy.gif" height"341" width="512" />');
		}
		if (target === 'batgirl'){
                        matched = true;
                        this.sendReplyBox('<img src="http://i.imgur.com/P6jTU8x.png" />');
                }
 
		if (target === 'eels'){
                        matched = true;
                        this.sendReplyBox('<img src="http://i.imgur.com/bztGksG.png" />');
                }
		if (target === 'oppai'){
                        matched = true;
                        this.sendReplyBox('<img src="http://i.imgur.com/saW5YpF.gif" />');
                }
                if (target === 'ara ara'){
                        matched = true;
                        this.sendReplyBox('<img src="http://i.imgur.com/K5Q01kW.png" />');
                }
                if (target === 'reggie'){
                        matched = true;
                        this.sendReplyBox('<img src="http://i.imgur.com/GAmQpRW.png" />');
                }
                if (target === 'turnips'){
                        matched = true;
                        this.sendReplyBox('<img src="http://i.imgur.com/90ul0xS.png" />');
                }
                if (target === 'yandere'){
                        matched = true;
                        this.sendReplyBox('<img src="http://i.imgur.com/jVLJATk.jpg" width="375" height="300" />');
                }
                if (target === 'i made this for you'){
                        matched = true;
                        this.sendReplyBox('<img src="http://i.imgur.com/EoITea4.gifg" />');
                }
                if (target === 'waluigi time'){
                        matched = true;
                        this.sendReplyBox('<img src="http://i.imgur.com/Ijzs6bw.png" width="300" height="300" />');
                }
                if (target === ''){
			}
		else if (!matched) {

			this.sendReply(''+target+' is not available or non existent.');
		}
	},

        clearall: function (target, room, user) {
        if (!this.can('makeroom')) return this.sendReply('/clearall - Access denied.');
        var len = room.log.length,
            users = [];
        while (len--) {
            room.log[len] = '';
        }
        for (var user in room.users) {
            users.push(user);
            Users.get(user).leaveRoom(room, Users.get(user).connections[0]);
        }
        len = users.length;
        setTimeout(function() {
            while (len--) {
                Users.get(users[len]).joinRoom(room, Users.get(users[len]).connections[0]);
            }
        }, 1000);
    },


};

        model: 'sprite',
sprite: function(target, room, user) {
        if (!this.canBroadcast()) return;
		var targets = target.split(',');
			target = targets[0];
				target1 = targets[1];
if (target.toLowerCase().indexOf(' ') !== -1) {
target.toLowerCase().replace(/ /g,'-');
}
        if (target.toLowerCase().length < 4) {
        return this.sendReply('Model not found.');
        }
		var numbers = ['1','2','3','4','5','6','7','8','9','0'];
		for (var i = 0; i < numbers.length; i++) {
		if (target.toLowerCase().indexOf(numbers) == -1 && target.toLowerCase() !== 'porygon2' && !target1) {
        
        
		
		if (target && !target1) {
        return this.sendReply('|html|<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
        }
	if (toId(target1) == 'back' || toId(target1) == 'shiny' || toId(target1) == 'front') {
		if (target && toId(target1) == 'back') {
        return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani-back/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
		}
		if (target && toId(target1) == 'shiny') {
        return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
		}
		if (target && toId(target1) == 'front') {
        return this.sendReply('|html|<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/'+target.toLowerCase().trim().replace(/ /g,'-')+'.gif">');
	}
	}
	} else {
	return this.sendReply('Model not found.');
	}
	}
	}, 

        

        masspm: 'pmall',
    pmall: function (target, room, user) {
        if (!this.can('pmall')) return;
        if (!target) return this.parse('/help pmall');

        var pmName = '~Lightning Storm Server PM';

        for (var i in Users.users) {
            var message = '|pm|' + pmName + '|' + Users.users[i].getIdentity() + '|' + target;
            Users.users[i].send(message);
        }
    },

	flogout: 'forcelogout',
	forcelogout: function (target, room, user) {
		if (!target) return this.sendReply('/forcelogout [username], [reason] OR /flogout [username], [reason] - Reason is optional.');
		if (!user.can('hotpatch')) return;
		if ((user.locked || user.mutedRooms[room.id]) && !user.can('bypassall')) return this.sendReply('You cannot do this while unable to talk.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
		if (targetUser.can('hotpatch')) return this.sendReply('You cannot force logout another Admin.');

		this.addModCommand('' + targetUser.name + ' was forcibly logged out by ' + user.name + '.' + (target ? " (" + target + ")" : ""));
		this.logModCommand(user.name + ' forcibly logged out ' + targetUser.name);
		targetUser.resetName();
	}
};
