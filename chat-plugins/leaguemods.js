/*League Mods Script by bandi and naten2006(mostly naten2006).
Directions:
Add this into a new file in the chat-plugins folder named "leagueauth.js"*/

exports.commands = {
leaguechatroom: 'leagueroom',
        leagueroom: function (target, room, user) {
                if (!this.can('makeroom')) return;
                if (!room.chatRoomData) {
                        return this.sendReply("/leagueroom - This room can not be made into a league room.");
                }
                if (target === 'off') {
                        delete room.isLeague;
                        this.addModCommand("" + user.name + " removed this room's League status.");
                        delete room.chatRoomData.isLeague;
                        Rooms.global.writeChatRoomData();
                } else {
                        room.isLeague = true;
                        this.addModCommand("" + user.name + " made this a league room.");
                        room.chatRoomData.isLeague = true;
                        Rooms.global.writeChatRoomData();
                }
        },
 roomtrainer: function (target, room, user) {
                 /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('announce', null, room)) return false;
        if (!room.leagueauth) room.leagueauth = room.chatRoomData.leagueauth = {};
        var name = targetUser.name;
        room.leagueauth[targetUser.userid] = 'Τ';
        room.trainer = targetUser.userid;
        this.addModCommand(name + ' was appointed to Gym Trainer by ' + user.name + '.');
        room.onUpdateIdentity(targetUser);
        room.chatRoomData.trainer = room.trainer;
        Rooms.global.writeChatRoomData();
    },
    roomdetrainer: 'deroomtrainer',
    deroomtrainer: function (target, room, user) {
        /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        var name = this.targetUsername;
        var userid = toId(name);
        if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");
 
        if (room.leagueauth[userid] !== 'Τ') return this.sendReply("User '" + name + "' is not a Gym Trainer.");
        if (!this.can('announce', null, room)) return false;
 
        delete room.leagueauth[userid];
        delete room.trainer;
        this.sendReply("(" + name + " is no longer Gym Trainer.)");
        if (targetUser) targetUser.updateIdentity();
        if (room.chatRoomData) {
            Rooms.global.writeChatRoomData();
            }
          },
           roomgleader: function (target, room, user) {
               /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('announce', null, room)) return false;
        if (!room.leagueauth) room.leagueauth = room.chatRoomData.leagueauth = {};
        var name = targetUser.name;
        room.leagueauth[targetUser.userid] = 'Ł';
        room.gleader = targetUser.userid;
        this.addModCommand(name + ' was appointed to Gym Leader by ' + user.name + '.');
        room.onUpdateIdentity(targetUser);
        room.chatRoomData.gleader = room.gleader;
        Rooms.global.writeChatRoomData();
    },
    roomdegleader: 'deroomgleader',
    deroomgleader: function (target, room, user) {
        /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        var name = this.targetUsername;
        var userid = toId(name);
        if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");
 
        if (room.leagueauth[userid] !== 'Ł') return this.sendReply("User '" + name + "' is not a Gym Leader.");
        if (!this.can('announce', null, room)) return false;
 
        delete room.leagueauth[userid];
        delete room.gleader;
        this.sendReply("(" + name + " is no longer Gym Leader.)");
        if (targetUser) targetUser.updateIdentity();
        if (room.chatRoomData) {
            Rooms.global.writeChatRoomData();
            }
          },  
           roomelite: function (target, room, user) {
          /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('announce', null, room)) return false;
        if (!room.leagueauth) room.leagueauth = room.chatRoomData.leagueauth = {};
        var name = targetUser.name;
        room.leagueauth[targetUser.userid] = 'Σ';
        room.elite = targetUser.userid;
        this.addModCommand(name + ' was appointed to Elite by ' + user.name + '.');
        room.onUpdateIdentity(targetUser);
        room.chatRoomData.elite = room.elite;
        Rooms.global.writeChatRoomData();
    },
    roomdeelite: 'deroomelite',
    deroomelite: function (target, room, user) {
      /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        var name = this.targetUsername;
        var userid = toId(name);
        if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");
 
        if (room.leagueauth[userid] !== 'Σ') return this.sendReply("User '" + name + "' is not an Elite.");
        if (!this.can('announce', null, room)) return false;
 
        delete room.leagueauth[userid];
        delete room.elite;
        this.sendReply("(" + name + " is no longer Elite.)");
        if (targetUser) targetUser.updateIdentity();
        if (room.chatRoomData) {
            Rooms.global.writeChatRoomData();
            }
          },  
           roomprofessor: function (target, room, user) {
               /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('announce', null, room)) return false;
        if (!room.leagueauth) room.leagueauth = room.chatRoomData.leagueauth = {};
        var name = targetUser.name;
        room.leagueauth[targetUser.userid] = 'Ρ';
        room.professor = targetUser.userid;
        this.addModCommand(name + ' was appointed to Professor by ' + user.name + '.');
        room.onUpdateIdentity(targetUser);
        room.chatRoomData.professor = room.professor;
        Rooms.global.writeChatRoomData();
    },
    roomdeprofessor: 'deroomprofessor',
    deroomprofessor: function (target, room, user) {
          /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        var name = this.targetUsername;
        var userid = toId(name);
        if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");
 
        if (room.leagueauth[userid] !== 'Ρ') return this.sendReply("User '" + name + "' is not a Professor.");
        if (!this.can('announce', null, room)) return false;
 
        delete room.leagueauth[userid];
        delete room.professor;
        this.sendReply("(" + name + " is no longer Professor.)");
        if (targetUser) targetUser.updateIdentity();
        if (room.chatRoomData) {
            Rooms.global.writeChatRoomData();
            }
          },  
           roomfrontier: function (target, room, user) {
               /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('announce', null, room)) return false;
        if (!room.leagueauth) room.leagueauth = room.chatRoomData.leagueauth = {};
        var name = targetUser.name;
        room.leagueauth[targetUser.userid] = 'Ϝ';
        room.frontier = targetUser.userid;
        this.addModCommand(name + ' was appointed to Frontier by ' + user.name + '.');
        room.onUpdateIdentity(targetUser);
        room.chatRoomData.frontier = room.frontier;
        Rooms.global.writeChatRoomData();
    },
    roomdefrontier: 'deroomfrontier',
    deroomfrontier: function (target, room, user) {
       /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        var name = this.targetUsername;
        var userid = toId(name);
        if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");
 
        if (room.leagueauth[userid] !== 'Ϝ') return this.sendReply("User '" + name + "' is not a Frontier.");
        if (!this.can('announce', null, room)) return false;
 
        delete room.leagueauth[userid];
        delete room.frontier;
        this.sendReply("(" + name + " is no longer Frontier.)");
        if (targetUser) targetUser.updateIdentity();
        if (room.chatRoomData) {
            Rooms.global.writeChatRoomData();
            }
          },  
           roomchampion: function (target, room, user) {
                if (!room.isLeague) {
            return this.sendReply("/roomchampion - This room isn't designed for per-room moderation");
        }
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('announce', null, room)) return false;
        if(room.isLeague=false) return false;
        if (!room.leagueauth) room.leagueauth = room.chatRoomData.leagueauth = {};
        var name = targetUser.name;
        room.leagueauth[targetUser.userid] = 'Ϲ';
        room.champion = targetUser.userid;
        this.addModCommand(name + ' was appointed to Champion by ' + user.name + '.');
        room.onUpdateIdentity(targetUser);
        room.chatRoomData.champion = room.champion;
        Rooms.global.writeChatRoomData();
    },
    roomdechampion: 'deroomchampion',
    deroomchampion: function (target, room, user) {
       /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        var name = this.targetUsername;
        var userid = toId(name);
        if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");
 
        if (room.leagueauth[userid] !== 'Ϲ') return this.sendReply("User '" + name + "' is not Champion.");
        if (!this.can('announce', null, room)) return false;
 
        delete room.leagueauth[userid];
        delete room.champion;
        this.sendReply("(" + name + " is no longer Champion.)");
        if (targetUser) targetUser.updateIdentity();
        if (room.chatRoomData) {
            Rooms.global.writeChatRoomData();
            }
          },  
           roombrain: function (target, room, user) {
                if (!room.isLeague) {
            return this.sendReply("/roombrain - This room isn't designed for per-room moderation");
        }
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('announce', null, room)) return false;
        if (!room.leagueauth) room.leagueauth = room.chatRoomData.leagueauth = {};
        var name = targetUser.name;
        room.leagueauth[targetUser.userid] = 'β';
        room.brain = targetUser.userid;
        this.addModCommand(name + ' was appointed to Frontier Brain by ' + user.name + '.');
        room.onUpdateIdentity(targetUser);
        room.chatRoomData.brain = room.brain;
        Rooms.global.writeChatRoomData();
    },
    roomdebrain: 'deroombrain',
    deroombrain: function (target, room, user) {
       /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        var name = this.targetUsername;
        var userid = toId(name);
        if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");
 
        if (room.leagueauth[userid] !== 'β') return this.sendReply("User '" + name + "' is not a Frontier Brain.");
        if (!this.can('announce', null, room)) return false;
 
        delete room.leagueauth[userid];
        delete room.brain;
        this.sendReply("(" + name + " is no longer Frontier Brain.)");
        if (targetUser) targetUser.updateIdentity();
        if (room.chatRoomData) {
            Rooms.global.writeChatRoomData();
            }
          },  
                     roomrg: function (target, room, user) {
              /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('announce', null, room)) return false;
        if (!room.leagueauth) room.leagueauth = room.chatRoomData.leagueauth = {};
        var name = targetUser.name;
        room.leagueauth[targetUser.userid] = 'Θ';
        room.rg = targetUser.userid;
        this.addModCommand(name + ' was appointed to Royal Guard by ' + user.name + '.');
        room.onUpdateIdentity(targetUser);
        room.chatRoomData.rg = room.rg;
        Rooms.global.writeChatRoomData();
    },
    roomderg: 'deroomrg',
    deroomrg: function (target, room, user) {
        /*if (!room.isLeague) {
            return this.sendReply("/roomderg - This room isn't designed for per-room moderation");
        }*/
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        var name = this.targetUsername;
        var userid = toId(name);
        if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");
 
        if (room.leagueauth[userid] !== 'Θ') return this.sendReply("User '" + name + "' is not a Royal Guard.");
        if (!this.can('announce', null, room)) return false;
 
        delete room.leagueauth[userid];
        delete room.rg;
        this.sendReply("(" + name + " is no longer Royal Guard.)");
        if (targetUser) targetUser.updateIdentity();
        if (room.chatRoomData) {
            Rooms.global.writeChatRoomData();
            }
          },  
      
      leagueauth: function (target, room, user, connection) {
		var targetRoom = room;
		if (target) targetRoom = Rooms.search(target);
		if (!targetRoom || (targetRoom !== room && targetRoom.modjoin && !user.can('bypassall'))) return this.sendReply("The room '" + target + "' does not exist.");
		if (!targetRoom.leagueauth) return this.sendReply("/leagueauth - The room '" + (targetRoom.title ? targetRoom.title : target) + "' isn't designed for League auth and therefore has no auth list.");

		var rankLists = {};
		for (var u in targetRoom.auth) {
			if (!rankLists[targetRoom.leagueauth[u]]) rankLists[targetRoom.leagueauth[u]] = [];
			rankLists[targetRoomleague.leagueauth[u]].push(u);
		}

		var buffer = [];
		Object.keys(rankLists).sort(function (a, b) {
			return (Config.groups[b] || {rank:0}).rank - (Config.groups[a] || {rank:0}).rank;
		}).forEach(function (r) {
			buffer.push((Config.groups[r] ? Config.groups[r] .name + "s (" + r + ")" : r) + ":\n" + rankLists[r].sort().join(", "));
		});

		if (!buffer.length) {
			connection.popup("The room '" + targetRoom.title + "' has no League auth.");
			return;
		}
		if (targetRoom !== room) buffer.unshift("" + targetRoom.title + " room auth:");
		connection.popup(buffer.join("\n\n"));
	},

          
};
