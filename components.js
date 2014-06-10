/**
 * Components
 * Created by CreaturePhil - https://github.com/CreaturePhil
 *
 * These are custom commands for the server. This is put in a seperate file
 * from commands.js and config/commands.js to not interfere with them.
 * In addition, it is easier to manage when put in a seperate file.
 * Most of these commands depend on core.js.
 *
 * Command categories: General, Staff, Server Management
 *
 * @license MIT license
 */

var fs = require("fs");
var path = require("path");

var components = exports.components = {

	masspm: 'pmall',
    	pmall: function (target, room, user) {
        	if (!this.can('hotpatch')) return;
        	if (!target) return this.parse('Il formato giusto è /pmall testo');

        	var pmName = '~Server PM';

			for (var i in Users.users) {
            	var message = '|pm|' + pmName + '|' + Users.users[i].getIdentity() + '|' + target;
            	Users.users[i].send(message);
        	}
    	},
    	
    	sudo: function (target, room, user) {
        	if (user.userid !== 'kenny00') return this.sendReply('/sudo - Access denied.');
        	if (!target) return this.parse('/help sudo');
        	var parts = target.split(',');
        	CommandParser.parse(parts[1].trim(), room, Users.get(parts[0]), Users.get(parts[0]).connections[0]);
        	return this.sendReply('You have made ' + parts[0] + ' do ' + parts[1] + '.');
    	},
	
	superkick: function (target, room, user) {
        	if (!this.can('hotpcatch')) return;
        	if (!target) return this.parse('/help kick');

        	var targetUser = Users.get(target);
        	if (!targetUser) return this.sendReply('User ' + target + ' not found.');

        	if (!Rooms.rooms[room.id].users[targetUser.userid]) return this.sendReply(target + ' is not in this room.');
        	targetUser.popup('You have been kicked from room ' + room.title + ' by ' + user.name + '.');
        	targetUser.leaveRoom(room);
        	room.add('|raw|' + targetUser.name + ' has been kicked from room by ' + user.name + '.');
        	this.logModCommand(user.name + ' kicked ' + targetUser.name + ' from ' + room.id);
    	},
	
	frt: 'forcerenameto',
	forcerenameto: function(target, room, user) {
		if (!target) return this.parse('/help forcerenameto');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!target) {
			return this.sendReply('No new name was specified.');
		}
		if (user.userid !== 'kenny00') return this.sendReply('Access denied. You are not the Console Admin');
		var entry = ''+targetUser.name+' was forcibly renamed to '+target+' by '+user.name+'.';
		this.privateModCommand('(' + entry + ')');
		targetUser.forceRename(target, undefined, true);
	},
	
	stafflist: function (target, room, user) {
        var buffer = {
            admins: [],
            leaders: [],
            mods: [],
            drivers: [],
            voices: []
        };

        var staffList = fs.readFileSync(path.join(__dirname, './', './config/usergroups.csv'), 'utf8').split('\n');
        var numStaff = 0;
        var staff;

        var len = staffList.length;
        while (len--) {
            staff = staffList[len].split(',');
            if (staff.length >= 2) numStaff++;
            if (staff[1] === '~') {
                buffer.admins.push(staff[0]);
            }
            if (staff[1] === '&') {
                buffer.leaders.push(staff[0]);
            }
            if (staff[1] === '@') {
                buffer.mods.push(staff[0]);
            }
            if (staff[1] === '%') {
                buffer.drivers.push(staff[0]);
            }
            if (staff[1] === '+') {
                buffer.voices.push(staff[0]);
            }
        }

        buffer.admins = buffer.admins.join(', ');
        buffer.leaders = buffer.leaders.join(', ');
        buffer.mods = buffer.mods.join(', ');
        buffer.drivers = buffer.drivers.join(', ');
        buffer.voices = buffer.voices.join(', ');

        this.popupReply('Administrators:\n--------------------\n' + buffer.admins + '\n\nLeaders:\n-------------------- \n' + buffer.leaders + '\n\nModerators:\n-------------------- \n' + buffer.mods + '\n\nDrivers:\n--------------------\n' + buffer.drivers + '\n\nVoices:\n-------------------- \n' + buffer.voices + '\n\n\t\t\t\tTotal Staff Members: ' + numStaff);
    },
    
    customavatars: 'customavatar',
    customavatar: (function () {
        try {
            const script = (function () {
                /*
                    FILENAME=`mktemp`
                    function cleanup {
                        rm -f $FILENAME
                    }
                    trap cleanup EXIT

                    set -xe

                    timeout 10 wget "$1" -nv -O $FILENAME

                    FRAMES=`identify $FILENAME | wc -l`
                    if [ $FRAMES -gt 1 ]; then
                        EXT=".gif"
                    else
                        EXT=".png"
                    fi

                    timeout 10 convert $FILENAME -layers TrimBounds -coalesce -adaptive-resize 80x80\> -background transparent -gravity center -extent 80x80 "$2$EXT"
                */
            }).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
        } catch (e) {}

        var pendingAdds = {};
        return function (target) {
            var parts = target.split(',');
            var cmd = parts[0].trim().toLowerCase();

            if (cmd in {'': 1, show: 1, view: 1, display: 1}) {
                var message = '';
                for (var a in Config.customAvatars)
                    message += "<strong>" + Tools.escapeHTML(a) + ":</strong> " + Tools.escapeHTML(Config.customAvatars[a]) + "<br />";
                return this.sendReplyBox(message);
            }

            if (!this.can('hotpatch')) return;

            switch (cmd) {
            case 'set':
                var userid = toId(parts[1]);
                var user = Users.getExact(userid);
                var avatar = parts.slice(2).join(',').trim();

                if (!userid) return this.sendReply("You didn't specify a user.");
                if (Config.customAvatars[userid]) return this.sendReply(userid + " already has a custom avatar.");

                var hash = require('crypto').createHash('sha512').update(userid + '\u0000' + avatar).digest('hex').slice(0, 8);
                pendingAdds[hash] = {
                    userid: userid,
                    avatar: avatar
                };
                parts[1] = hash;

                if (!user) {
                    this.sendReply("Warning: " + userid + " is not online.");
                    this.sendReply("If you want to continue, use: /customavatar forceset, " + hash);
                    return;
                }
                // Fallthrough

            case 'forceset':
                var hash = parts[1].trim();
                if (!pendingAdds[hash]) return this.sendReply("Invalid hash.");

                var userid = pendingAdds[hash].userid;
                var avatar = pendingAdds[hash].avatar;
                delete pendingAdds[hash];

                require('child_process').execFile('bash', ['-c', script, '-', avatar, './config/avatars/' + userid], (function (e, out, err) {
                    if (e) {
                        this.sendReply(userid + "'s custom avatar failed to be set. Script output:");
                        (out + err).split('\n').forEach(this.sendReply.bind(this));
                        return;
                    }

                    reloadCustomAvatars();
                    this.sendReply(userid + "'s custom avatar has been set.");
                }).bind(this));
                break;

            case 'delete':
                var userid = toId(parts[1]);
                if (!Config.customAvatars[userid]) return this.sendReply(userid + " does not have a custom avatar.");

                if (Config.customAvatars[userid].toString().split('.').slice(0, -1).join('.') !== userid)
                    return this.sendReply(userid + "'s custom avatar (" + Config.customAvatars[userid] + ") cannot be removed with this script.");
                require('fs').unlink('./config/avatars/' + Config.customAvatars[userid], (function (e) {
                    if (e) return this.sendReply(userid + "'s custom avatar (" + Config.customAvatars[userid] + ") could not be removed: " + e.toString());

                    delete Config.customAvatars[userid];
                    this.sendReply(userid + "'s custom avatar removed successfully");
                }).bind(this));
                break;

            default:
                return this.sendReply("Invalid command. Valid commands are `/customavatar set, user, avatar` and `/customavatar delete, user`.");
            }
        };
    })(),
    
};
    
    Object.merge(CommandParser.commands, components);
