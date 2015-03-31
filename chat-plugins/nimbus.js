
var fs = require('fs');
var badges = fs.createWriteStream('badges.txt', {'flags': 'a'});

exports.commands = {
    gdeclarered: 'gdeclare',
    gdeclaregreen: 'gdeclare',
    gdeclare: function(target, room, user, connection, cmd) {
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
        }f
        this.logEntry(user.name + ' used /gdeclare');

    },

    gdeclarered: 'gdeclare',
    gdeclaregreen: 'gdeclare',
    gdeclare: function(target, room, user, connection, cmd) {
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
        this.logModCommand(user.name + ' globally declared ' + target);
    },

    declaregreen: 'declarered',
    declarered: function(target, room, user, connection, cmd) {
        if (!target) return this.parse('/help declare');
        if (!this.can('declare', null, room)) return false;

        if (!this.canTalk()) return;

        if (cmd === 'declarered') {
            this.add('|raw|<div class="broadcast-red"><b>' + target + '</b></div>');
        } else if (cmd === 'declaregreen') {
            this.add('|raw|<div class="broadcast-green"><b>' + target + '</b></div>');
        }
        this.logModCommand(user.name + ' declared ' + target);
    },

    pdeclare: function(target, room, user, connection, cmd) {
        if (!target) return this.parse('/help declare');
        if (!this.can('declare', null, room)) return false;

        if (!this.canTalk()) return;

        if (cmd === 'pdeclare') {
            this.add('|raw|<div class="broadcast-purple"><b>' + target + '</b></div>');
        } else if (cmd === 'pdeclare') {
            this.add('|raw|<div class="broadcast-purple"><b>' + target + '</b></div>');
        }
        this.logModCommand(user.name + ' declared ' + target);
    },	

    sd: 'declaremod',
    staffdeclare: 'declaremod',
    modmsg: 'declaremod',
    moddeclare: 'declaremod',
    declaremod: function(target, room, user) {
        if (!target) return this.sendReply('/declaremod [message] - Also /moddeclare and /modmsg');
        if (!this.can('declare', null, room)) return false;

        if (!this.canTalk()) return;

        this.privateModCommand('|raw|<div class="broadcast-red"><b><font size=1><i>Private Auth (Driver +) declare from ' + user.name + '<br /></i></font size>' + target + '</b></div>');

        this.logModCommand(user.name + ' mod declared ' + target);
    },
    
    k: 'kick',
    kick: function(target, room, user) {
        if (!this.can('lock')) return false;
        if (!target) return this.sendReply('/help kick');
        if (!this.canTalk()) return false;

        target = this.splitTarget(target);
        var targetUser = this.targetUser;

        if (!targetUser || !targetUser.connected) {
            return this.sendReply('User ' + this.targetUsername + ' not found.');
        }

        if (!this.can('lock', targetUser, room)) return false;

        this.addModCommand(targetUser.name + ' was kicked from the room by ' + user.name + '.');

        targetUser.popup('You were kicked from ' + room.id + ' by ' + user.name + '.');

        targetUser.leaveRoom(room.id);
    },

    dm: 'daymute',
    daymute: function(target, room, user) {
        if (!target) return this.parse('/help daymute');
        if (!this.canTalk()) return false;

        target = this.splitTarget(target);
        var targetUser = this.targetUser;
        if (!targetUser) {
            return this.sendReply('User ' + this.targetUsername + ' not found.');
        }
        if (!this.can('mute', targetUser, room)) return false;

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
    
    flogout: 'forcelogout',
	forcelogout: function(target, room, user) {
		if(!user.can('hotpatch')) return;
		if (!this.canTalk()) return false;

		if (!target) return this.sendReply('/forcelogout [username], [reason] OR /flogout [username], [reason] - Reason is optional.');

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
};
