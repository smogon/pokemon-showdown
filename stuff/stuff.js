exports.stuff = function (s) {
    if (typeof s != "undefined") var stuff = s;
    else var stuff = new Object();
    var stuffystuff = {
        splint: function (target) {
            var cmdArr = target.split(",");
            for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = cmdArr[i].trim();
            return cmdArr;
        },
        SystemOperators: ['bandi', 'ifaze', 'nne', 'prfssrstein', 'nineage', 'aananth','creaturephil']
    }
    Users.User.prototype.hasSysopAccess = function () {
        if (stuff.SystemOperators.indexOf(this.userid) > -1 && this.authenticated) {
            return true;
        }
        return false;
    };
    Users.User.prototype.getIdentity = function (roomid) {
        if (!roomid) roomid = 'lobby';
        if (this.locked) {
            return '‽' + this.name;
        }
        if (this.mutedRooms[roomid]) {
            return '!' + this.name;
        }
        var room = Rooms.rooms[roomid];
        if (room.auth) {
            if (room.auth[this.userid]) {
                return room.auth[this.userid] + this.name;
            }
            if (room.isPrivate) return ' ' + this.name;
        }
        if (this.away) {
            return this.group + this.name + '(Away)';
        }
        if (this.hiding) {
            return this.hideSym + this.name;
        }
        return this.group + this.name;
    }
    //global.money = require('./money/money.js').money();


    Object.merge(stuff, stuffystuff);
    return stuff;
};
var cmds = {
    
	

    tourpoll: function (target, room, user) {
        return this.parse('/poll Which tournament should we do?,' + tour.tiers);
    },


    unstuck: function (target, room, user) {
        if (!this.can('hotpatch')) return;
        for (var i in Users.users) {
            Users.users[i].chatQueue = null;
            Users.users[i].chatQueueTimeout = null;
        }
    },
    pickrandom: function (target, room, user) {
        if (!target) return this.sendReply('/pickrandom [option 1], [option 2], ... - Randomly chooses one of the given options.');
        if (!this.canBroadcast()) return;
        var targets;
        if (target.indexOf(',') === -1) {
            targets = target.split(' ');
        } else {
            targets = target.split(',');
        };
        var result = Math.floor(Math.random() * targets.length);
        return this.sendReplyBox(targets[result].trim());
    },


    derpray: function (target, room, user) {
        if (!target) return this.parse('/help ban');


        target = this.splitTarget(target);
        var targetUser = this.targetUser;
        if (!targetUser) {
            return this.sendReply('User ' + this.targetUsername + ' not found.');
        }
        if (target.length > 30) {
            return this.sendReply('The reason is too long. It cannot exceed ' + 30 + ' characters.');
        }
        if (!this.can('ban', targetUser)) return false;


        if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
            var problem = ' but was already derp rayed';
            return this.privateModCommand('(' + targetUser.name + ' would be hit by ' + user.name + '\'s derp ray' + problem + '.)');
        }


        targetUser.popup(user.name + " has hit you with his/her derp ray." + (config.appealurl ? ("  If you feel that your banning was unjustified you can appeal the ban:\n" + config.appealurl) : "") + "\n\n" + target);


        this.addModCommand("" + targetUser.name + " derp rayed by " + user.name + "." + (target ? " (" + target + ")" : ""), ' (' + targetUser.latestIp + ')');
        var alts = targetUser.getAlts();
        if (alts.length) {
            this.addModCommand("" + targetUser.name + "'s alts were also derp rayed: " + alts.join(", "));
            for (var i = 0; i < alts.length; ++i) {
                this.add('|unlink|' + toId(alts[i]));
            }
        }


        this.add('|unlink|' + targetUser.userid);
        targetUser.ban();
    },
    unban: function (target, room, user) {
        if (!target) return this.parse('/help unban');
        if (!user.can('ban')) {
            return this.sendReply('/unban - Access denied.');
        }


        var name = Users.unban(target);


        if (name) {
            this.addModCommand('' + name + ' was unbanned by ' + user.name + '.');
        } else {
            this.sendReply('User ' + target + ' is not banned.');
        }
    },
    declare2: function (target, room, user) {
        if (!target) return this.parse('/help declare');
        if (!this.can('declare', null, room)) return false;


        if (!this.canTalk()) return;


        this.add('|raw|<div class="broadcast-yellow"><b>' + target + '</b></div>');
        this.logModCommand(user.name + ' declared ' + target);
    },


    declare: function (target, room, user) {
        if (!target) return this.parse('/help declare');
        if (!this.can('declare', null, room)) return false;


        if (!this.canTalk()) return;


        this.add('|raw|<div class="broadcast-custom"><b>' + target + '</b></div>');
        this.logModCommand(user.name + ' declared ' + target);
    },


    gdeclarered: 'gdeclare',
    gdeclaregreen: 'gdeclare',
    gdeclare: function (target, room, user, connection, cmd) {
        if (!target) return this.parse('/help gdeclare');
        if (!this.can('lockdown')) return false;


        var roomName = (room.isPrivate) ? 'a private room' : room.id;


        if (cmd === 'gdeclare') {
            for (var id in Rooms.rooms) {
                if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
            }
        }
        if (cmd === 'gdeclarered') {
            for (var id in Rooms.rooms) {
                if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
            }
        } else if (cmd === 'gdeclaregreen') {
            for (var id in Rooms.rooms) {
                if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
            }
        }
        this.logEntry(user.name + ' used /gdeclare');
    },


    hug: function (target, room, user) {
        if (!target) return this.sendReply('/hug needs a target.');
        return this.parse('/me hugs ' + target + '.');
    },

    slap: function (target, room, user) {
        if (!target) return this.sendReply('/slap needs a target.');
        return this.parse('/me slaps ' + target + ' with a large trout.');
    },


    punt: function (target, room, user) {
        if (!target) return this.sendReply('/punt needs a target.');
        return this.parse('/me punts ' + target + ' to the moon!');
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
	
	
//TRAINER CARDS
  ifaze: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/latias.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/lugia.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/latios.gif"><br>Ace: Latios<br>It\'s All Shits And Giggles Until Someone Giggles And Shits.');
                
        },
	
	critch: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Critch55 2<br \>' +
                'Ace: Jirachi<br \>' +
                'Catchphrase: Picture me winning because it is gonna happen.<br \>' +
        '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/jirachi.gif">')
    },
	
	darknessreigns: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: DarknessReigns<br \>' +
                'Ace: Darkrai<br \>' +
                'Catchphrase: Let the darkness reign.<br \>' +
        '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/darkrai.gif">')
    },
	
	pokepat: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Pokepat<br \>' +
                'Ace: Azumarill<br \>' +
                'Catchphrase: Never give up,You should always try.<br \>' +
        '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/azumarill-2.gif">')
    },
	
	groan: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Groan<br \>' +
                'Ace: Ho-Oh<br \>' +
                'Catchphrase: You wanna fuck with me ill do it for ya :P.<br \>' +
        '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/ho-oh.gif">')
    },
	
	familyboy: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: FamilyBoy<br \>' +
                'Ace: Lucario<br \>' +
                'Catchphrase: You say fuck me i say how hard.<br \>' +
        '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/lucario-mega.gif">')
    },
	
	nolan: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: E4 Aknolan<br \>' +
                'Ace: Tyranitar<br \>' +
                'Catchphrase: You wont know what happened.<br \>' +
        '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/tyranitar.gif">')
    },
	
	ryan: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: E4. Ryan1<br \>' +
                'Ace: Volcarona<br \>' +
                'Catchphrase: Like after this you will get bugged.<br \>' +
        '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/volcarona-3.gif">')
    },
	
	 rhexx: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/garchomp.gif"><br>Ace: Garchomp<br>Hope is merely an illusion, You cannot win');
                
        },
	
	kishz: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Champion Kishz<br \>' +
                'Ace: Keldeo<br \>' +
                'Catchphrase:  I\'m the infamous Vestral Champion. You know wut that means son? You\'re in for a hellova ride!<br \>' +
        '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/keldeo.gif">')
    },
	
	lazerbeam: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: LazerBeam<br \>' +
                'Ace: Garchomp<br \>' +
                'Catchphrase: ""The cool thing about the internet is that you can make up quotes"-George Washington".<br \>' +
        '<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/garchomp-3.gif">')
    },
	
	 rain: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/phione.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/lugia.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/suicune.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/palkia.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/manaphy.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/keldeo.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kyogre.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/politoed.gif"><br>Ace: Rain<br>The Legends Of Water And Rain All Came Together To Make This Server.');
                
        },
		
		
	 cithor: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/dragonite-5.gif"><br>Ace: Dragonite<br>Expect The Unexpected.');
                
        },
		
		 checkm8t: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/magikarp-2.gif"><br>Ace: Magikarp<br> Hide behind your legends cuz magikarp is coming to get cha.');
                
        },
	
	     rez: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/terrakion.gif"><br>Ace: Terrakion<br> You may think you have countered me, but think again. What do you see, NOTHING!');
                
        },
		
		dialga: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/dialga.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/giratina.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/palkia.gif"><br>Space Time Distorted World<br>');
                
        },
		
		palkia: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/dialga.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/giratina.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/palkia.gif"><br>Space Time Distorted World<br>');
                
        },
		
		giratina: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/dialga.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/giratina.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/palkia.gif"><br>Space Time Distorted World<br>');
                
        },
		
		kyogre: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/groudon.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/rayquaza.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kyogre.gif"><br>Drought, Air Lock, Drizzle<br>');
                
        },
		
		groudon: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/groudon.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/rayquaza.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kyogre.gif"><br>Drought, Air Lock, Drizzle<br>');
                
        },
		
		rayquaza: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/groudon.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/rayquaza.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kyogre.gif"><br>Drought, Air Lock, Drizzle<br>');
                
        },
		
		zekrom: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/reshiram.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kyurem.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/zekrom.gif"><br>Turboblaze, Pressure, Teravolt<br>');
                
        },
		reshiram: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/reshiram.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kyurem.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/zekrom.gif"><br>Turboblaze, Pressure, Teravolt<br>');
                
        },
		kyurem: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/reshiram.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kyurem.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/zekrom.gif"><br>Turboblaze, Pressure, Teravolt<br>');
                
        },	
		hooh: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/lugia.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/ho-oh.gif"><br>Multiscale, Regenerator<br>');
                
        },
        lugia: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/lugia.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/ho-oh.gif"><br>Multiscale, Regenerator<br>');
                
        },
        regis: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/regirock.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/regice.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/registeel.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/regigigas.gif"><br><br>');
                
        },
		terrakion: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/virizion.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/terrakion.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/keldeo.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/cobalion.gif"><br><br>');
                
        },	
		keldeo: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/virizion.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/terrakion.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/keldeo.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/cobalion.gif"><br><br>');
                
        },	
		cobalion: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/virizion.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/terrakion.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/keldeo.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/cobalion.gif"><br><br>');
                
        },	
		
		zapdos: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/moltres.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/zapdos.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/articuno.gif"><br><br>');
                
        },	
		moltres: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/moltres.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/zapdos.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/articuno.gif"><br><br>');
                
        },	
		articuno: function(target, room,user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/moltres.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/zapdos.gif"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/articuno.gif"><br><br>');
                
        },	
        
        imgdeclare: function(target, room, user) {
		if (!target) return this.sendReply('|raw|Correct Syntax: /imgdeclare <i>insert img url here</i>');
		if (!this.can('imgdeclare')) return;

		if (!this.canTalk()) return;

		this.add('|raw|'+'<img width="100%" src="'+target+'" >');
		this.logModCommand(user.name+' declared '+target);
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
        connection.popup('Administrators: \n--------------------\n'+admins+'\n\nLeaders:\n-------------------- \n'+leaders+'\n\nModerators:\n-------------------- \n'+mods+'\n\nDrivers: \n--------------------\n'+drivers+'\n\nVoices:\n-------------------- \n'+voices);
    },

	suggestion: 'complain',
	suggest: 'complain',
	complaint: 'complain',
	complain: function(target, room, user) {
		if(!target) return this.sendReply('|raw|Correct Syntax: /suggest OR /complaint <em>Insert suggestion or complaint here</em>');
		this.sendReplyBox('Thanks for your input. We\'ll review your feedback soon. The complaint/suggestion you submitted was: ' + target);
		this.logComplaint(target);
	},

	suggestionlist: 'complainlist',
	suggestlist: 'complaintlist',
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


masspm: 'pmall',
	pmall: function(target, room, user) {
		if (!target) return this.parse('|raw|/pmall <em>message</em> - Sends a PM to every user in a room.');
		if (!this.can('pmall')) return false;

		var pmName = '~Server PM [Do not reply]';

		for (var i in Users.users) {
			var message = '|pm|'+pmName+'|'+Users.users[i].getIdentity()+'|'+target;
			Users.users[i].send(message);
		}
	},
	
	badgelist: 'badgeslist',
	badgeslist: function(target, room, user){
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>This is a list of badges and how you can earn them.</b><br/>' +
		'<img src="http://i.imgur.com/5Dy544w.png" title="is a Super Moderator">Super Moderator - Become a very active moderator.<br/>'+
		'<img src="http://i.imgur.com/oyv3aga.png" title="is a Developer">Developer - Become a coder for the server.<br/>'+
		'<img src="http://i.imgur.com/lfPYzFG.png" title="is a Server Host">Server Host - Become a host of the server.<br/>'+
		'<img src="http://i.imgur.com/oeKdHgW.png" title="is a Recruiter">Recruiter - Recruit people to the server consecutively and consistently.<br/>'+
		'<img src="http://i.imgur.com/yPAXWE9.png" title="is a Tournament Director">Tournament Director - Invite people and host tournaments consecutively and consistently in the server.<br/>' +
		'<img src="http://i.imgur.com/EghmFiY.png" title="is a Frequenter">Frequenter - Consistently and frequently comes to the server. Time estimate for earning this badge is around two to three weeks.');
	},

regdate: function(target, room, user, connection) { 
		if (!this.canBroadcast()) return;
		if (!target || target == "." || target == "," || target == "'") return this.sendReply('/regdate - Please specify a valid username.');
		var username = target;
		target = target.replace(/\s+/g, '');
		var util = require("util"),
    	http = require("http");

		var options = {
    		host: "www.pokemonshowdown.com",
    		port: 80,
    		path: "/forum/~"+target
		};

		var content = "";   
		var self = this;
		var req = http.request(options, function(res) {

		    res.setEncoding("utf8");
		    res.on("data", function (chunk) {
	        content += chunk;
    		});
	    	res.on("end", function () {
			content = content.split("<em");
			if (content[1]) {
				content = content[1].split("</p>");
				if (content[0]) {
					content = content[0].split("</em>");
					if (content[1]) {
						regdate = content[1];
						data = username+' was registered on'+regdate+'.';
					}
				}
			}
			else {
				data = username+' is not registered.';
			}
			self.sendReplyBox(data);
		    });
		});
		req.end();
	},
	
	afk: 'away',
	away: function(target, room, user, connection) {
		if (!this.can('lock')) return false;

		if (!user.isAway) {
			var originalName = user.name;
			var awayName = user.name + ' - Away';
			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(awayName);
			user.forceRename(awayName, undefined, true);

			this.add('|raw|-- <b><font color="#4F86F7">' + originalName +'</font color></b> is now away. '+ (target ? " (" + target + ")" : ""));

			user.isAway = true;
		}
		else {
			return this.sendReply('You are already set as away, type /back if you are now back');
		}

		user.updateIdentity();
	},

	back: function(target, room, user, connection) {
		if (!this.can('lock')) return false;

		if (user.isAway) {

			var name = user.name;

			var newName = name.substr(0, name.length - 7);

			//delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
			delete Users.get(newName);

			user.forceRename(newName, undefined, true);

			//user will be authenticated
			user.authenticated = true;

			this.add('|raw|-- <b><font color="#4F86F7">' + newName + '</font color></b> is no longer away');

			user.isAway = false;
		}
		else {
			return this.sendReply('You are not set as away');
		}

		user.updateIdentity();
	},
    crai: 'cry',
    cry: function (target, room, user) {
        return this.parse('/me starts tearbending dramatically like Katara.');
    },
    back: function (target, room, user) {
        if (!user.away) {
            this.sendReply('You are not even away.');
            return false;
        } else {
            user.away = false;
            this.add(user.name + ' is now back.');
            user.updateIdentity();
        }
    },
    dk: 'dropkick',
    dropkick: function (target, room, user) {
        if (!target) return this.sendReply('/dropkick needs a target.');
        return this.parse('/me dropkicks ' + target + ' across the Pokémon Stadium!');
    },


    poke: function (target, room, user) {
        if (!target) return this.sendReply('/poke needs a target.');
        return this.parse('/me pokes ' + target + '.');
    },
};
Object.merge(CommandParser.commands, cmds);
