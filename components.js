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
path = require("path"),
    http = require("http"),
    request = require('request');

var components = exports.components = {

    eating: 'away',
    gaming: 'away',
    sleep: 'away',
    work: 'away',
    working: 'away',
    sleeping: 'away',
    busy: 'away',
    afk: 'away',
    away: function (target, room, user, connection, cmd) {
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
        case 'working':
            t = 'Ⓦⓞⓡⓚⓘⓝⓖ';
            t2 = 'Working';
            break;
        case 'work':
            t = 'Ⓦⓞⓡⓚⓘⓝⓖ';
            t2 = 'Working';
            break;
        case 'eating':
            t = 'Ⓔⓐⓣⓘⓝⓖ';
            t2 = 'Eating';
            break;
        default:
            t = 'Ⓐⓦⓐⓨ'
            t2 = 'Away';
            break;
        }

        if (user.name.length > 18) return this.sendReply('Your username exceeds the length limit.');

        if (!user.isAway) {
            user.originalName = user.name;
            var awayName = user.name + ' - ' + t;
            //delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
            delete Users.get(awayName);
            user.forceRename(awayName, undefined, true);

            if (user.can('lock')) this.add('|raw|-- <b><font color="#088cc7">' + user.originalName + '</font color></b> is now ' + t2.toLowerCase() + '. ' + (target ? " (" + escapeHTML(target) + ")" : ""));

            user.isAway = true;
        } else {
            return this.sendReply('You are already set as a form of away, type /back if you are now back.');
        }

        user.updateIdentity();
    },

    back: function (target, room, user, connection) {

        if (user.isAway) {
            if (user.name === user.originalName) {
                user.isAway = false;
                return this.sendReply('Your name has been left unaltered and no longer marked as away.');
            }

            var newName = user.originalName;

            //delete the user object with the new name in case it exists - if it does it can cause issues with forceRename
            delete Users.get(newName);

            user.forceRename(newName, undefined, true);

            //user will be authenticated
            user.authenticated = true;

            if (user.can('lock')) this.add('|raw|-- <b><font color="#088cc7">' + newName + '</font color></b> is no longer away.');

            user.originalName = '';
            user.isAway = false;
        } else {
            return this.sendReply('You are not set as away.');
        }

        user.updateIdentity();
    },
    earnbuck: 'earnmoney',
    earnbucks: 'earnmoney',
    earnmoney: function (target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<strong><u>Ways to earn money:</u></strong><br /><br /><ul><li>Follow <a href="https://github.com/CreaturePhil"><u><b>CreaturePhil</b></u></a> on Github for 5 bucks.</li><li>Star this <a href="https://github.com/CreaturePhil/Showdown-Boilerplate">repository</a> for 5 bucks. If you don\'t know how to star a repository, click <a href="http://i.imgur.com/0b9Mbff.png">here</a> to learn how.</li><li>Participate in and win tournaments.</li><br /><br />Once you done so pm an admin. If you don\'t have a Github account you can make on <a href="https://github.com/join"><b><u>here</b></u></a>.</ul>');
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

    roomauth: function (target, room, user, connection) {
        if (!room.auth) return this.sendReply("/roomauth - This room isn't designed for per-room moderation and therefore has no auth list.");
        var buffer = [];
        var owners = [];
        var admins = [];
        var leaders = [];
        var mods = [];
        var drivers = [];
        var voices = [];

        room.owners = '';
        room.admins = '';
        room.leaders = '';
        room.mods = '';
        room.drivers = '';
        room.voices = '';
        for (var u in room.auth) {
            if (room.auth[u] == '#') {
                room.owners = room.owners + u + ',';
            }
            if (room.auth[u] == '~') {
                room.admins = room.admins + u + ',';
            }
            if (room.auth[u] == '&') {
                room.leaders = room.leaders + u + ',';
            }
            if (room.auth[u] == '@') {
                room.mods = room.mods + u + ',';
            }
            if (room.auth[u] == '%') {
                room.drivers = room.drivers + u + ',';
            }
            if (room.auth[u] == '+') {
                room.voices = room.voices + u + ',';
            }
        }

        if (!room.founder) founder = '';
        if (room.founder) founder = room.founder;

        room.owners = room.owners.split(',');
        room.mods = room.mods.split(',');
        room.drivers = room.drivers.split(',');
        room.voices = room.voices.split(',');

        for (var u in room.owners) {
            if (room.owners[u] != '') owners.push(room.owners[u]);
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
        if (mods.length > 0) {
            mods = mods.join(', ');
        }
        if (drivers.length > 0) {
            drivers = drivers.join(', ');
        }
        if (voices.length > 0) {
            voices = voices.join(', ');
        }
        connection.popup('Room Auth in "' + room.id + '"\n\n**Founder**: \n' + founder + '\n**Owner(s)**: \n' + owners + '\n**Moderator(s)**: \n' + mods + '\n**Driver(s)**: \n' + drivers + '\n**Voice(s)**: \n' + voices);
    },

    regdate: function (target, room, user, connection) {
        if (!this.canBroadcast()) return;
        if (!target || target == "." || target == "," || target == "'") return this.parse('/help regdate');
        var username = target;
        target = target.replace(/\s+/g, '');

        var options = {
            host: "www.pokemonshowdown.com",
            port: 80,
            path: "/forum/~" + target
        };

        var content = "";
        var self = this;
        var req = http.request(options, function (res) {

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
                            data = Tools.escapeHTML(username) + ' was registered on' + regdate + '.';
                        }
                    }
                } else {
                    data = Tools.escapeHTML(username) + ' is not registered.';
                }
                self.sendReplyBox(data);
                room.update();
            });
        });
        req.end();
    },

    badges: 'badge',
    badge: function (target, room, user) {
        if (!this.canBroadcast()) return;
        if (target == '') target = user.userid;
        target = target.toLowerCase();
        target = target.trim();
        var matched = false;
        var admin = '<img src="http://www.smogon.com/media/forums/images/badges/sop.png" title="Server Administrator">';
        var dev = '<img src="http://i.imgur.com/oyv3aga.png" title="is a Lore Developer">';
        var creator = '<img src="http://www.smogon.com/media/forums/images/badges/dragon.png" title="Server Creator">';
        var frequenter = '<img src="http://i.imgur.com/EghmFiY.png" title="is a Frequenter">';
        var leader = '<img src="http://www.smogon.com/media/forums/images/badges/aop.png" title="Server Leader">';
        var mod = '<img src="http://i.imgur.com/lfPYzFG.png" title="is a Server Host">';
        var league = '<img src="http://www.smogon.com/media/forums/images/badges/forumsmod.png" title="Successful League Owner">';
        var champ = '<img src="http://www.smogon.com/media/forums/images/badges/forumadmin_alum.png" title="Evad3rs Champion">';
        var artist = '<img src="http://www.smogon.com/media/forums/images/badges/ladybug.png" title="Artist">';
        var twinner = '<img src="http://i.imgur.com/yPAXWE9.png" title="is a Tournament Winner">';
        var vip = '<img src="http://www.smogon.com/media/forums/images/badges/zeph.png" title="VIP">';
        var recruter = '<img src="http://i.imgur.com/oeKdHgW.png" title="is a Recruiter">';
        //Shaymin, try to do 4 spaces between each badge if you could.
        if (target === 'list' || target === 'help') {
            matched = true;
            this.sendReplyBox('<b>List of Lore Badges</b>:<br>   ' + admin + '    ' + dev + '  ' + creator + '   ' + frequenter + '    ' + mod + '    ' + leader + '    ' + league + '    ' + champ + '    ' + artist + '    ' + twinner + '    ' + vip + ' <br>--Hover over them to see the meaning of each');
        }
        if (target === 'evasi0n') {
            matched = true;
            this.sendReplyBox('<b>Evasi0n</b>:   ' + admin + '  ' + dev + '  ' + creator + '   ' + frequenter + '    ' + artist + '    ' + vip + '');
        }

        if (target === 'bandi') {
            matched = true;
            this.sendReplyBox('<b>Bandi</b>:   ' + admin + '  ' + dev + '  ' + creator + '   ' + frequenter + '    ' + artist + '    ' + vip + '');
        }


        if (!matched) {
            this.sendReplyBox('<b>' + target + '</b>: - does not have any badges.');
        }

    },

    atm: 'profile',
    profile: function (target, room, user, connection, cmd) {
        if (!this.canBroadcast()) return;
        if (cmd === 'atm') return this.sendReply('Use /profile instead.');
        if (target.length >= 19) return this.sendReply('Usernames are required to be less than 19 characters long.');

        var targetUser = this.targetUserOrSelf(target);

        if (!targetUser) {
            var userId = toId(target);
            var money = Core.profile.money(userId);
            var elo = Core.profile.tournamentElo(userId);
            var about = Core.profile.about(userId);

            if (elo === 1000 && about === 0) {
                return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, userId) + Core.profile.group(false, userId) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + '<br clear="all">');
            }
            if (elo === 1000) {
                return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, userId) + Core.profile.group(false, userId) + Core.profile.display('about', about) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + '<br clear="all">');
            }
            if (about === 0) {
                return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, userId) + Core.profile.group(false, userId) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(userId)) + '<br clear="all">');
            }
            return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, target) + Core.profile.group(false, userId) + Core.profile.display('about', about) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(userId)) + '<br clear="all">');
        }

        var money = Core.profile.money(targetUser.userid);
        var elo = Core.profile.tournamentElo(toId(targetUser.userid));
        var about = Core.profile.about(targetUser.userid);

        if (elo === 1000 && about === 0) {
            return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + '<br clear="all">');
        }
        if (elo === 1000) {
            return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.display('about', about) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + '<br clear="all">');
        }
        if (about === 0) {
            return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(targetUser.userid)) + '<br clear="all">');
        }
        return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.display('about', about) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(targetUser.userid)) + '<br clear="all">');
    },

    setabout: 'about',
    about: function (target, room, user) {
        if (!target) return this.parse('/help about');
        if (target.length > 30) return this.sendReply('About cannot be over 30 characters.');

        var now = Date.now();

        if ((now - user.lastAbout) * 0.001 < 30) {
            this.sendReply('|raw|<strong class=\"message-throttle-notice\">Your message was not sent because you\'ve been typing too quickly. You must wait ' + Math.floor(
                (30 - (now - user.lastAbout) * 0.001)) + ' seconds</strong>');
            return;
        }

        user.lastAbout = now;

        target = Tools.escapeHTML(target);
        target = target.replace(/[^A-Za-z\d ]+/g, '');

        var data = Core.stdin('about', user.userid);
        if (data === target) return this.sendReply('This about is the same as your current one.');

        Core.stdout('about', user.userid, target);

        this.sendReply('Your about is now: "' + target + '"');
    },

    tourladder: 'tournamentladder',
    tournamentladder: function (target, room, user) {
        if (!this.canBroadcast()) return;

        if (!target) target = 10;
        if (!/[0-9]/.test(target) && target.toLowerCase() !== 'all') target = -1;

        var ladder = Core.ladder(Number(target));
        if (ladder === 0) return this.sendReply('No one is ranked yet.');

        return this.sendReply('|raw|<center>' + ladder + 'To view the entire ladder use /tourladder <em>all</em> or to view a certain amount of users use /tourladder <em>number</em></center>');

    },

    shop: function (target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReply('|raw|' + economy.shop(true));
    },

    transferbuck: 'transfermoney',
    transferbucks: 'transfermoney',
    transfermoney: function (target, room, user) {
        if (!target) return this.parse('/help transfermoney');
        if (!this.canTalk()) return;

        if (target.indexOf(',') >= 0) {
            var parts = target.split(',');
            parts[0] = this.splitTarget(parts[0]);
            var targetUser = this.targetUser;
        }

        if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (targetUser.userid === user.userid) return this.sendReply('You cannot transfer money to yourself.');
        if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
        if (parts[1] < 1) return this.sendReply('You can\'t transfer less than one buck at a time.');
        if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot transfer money with decimals.');

        var userMoney = Core.stdin('money', user.userid);
        var targetMoney = Core.stdin('money', targetUser.userid);

        if (parts[1] > Number(userMoney)) return this.sendReply('You cannot transfer more money than what you have.');

        var b = 'bucks';
        var cleanedUp = parts[1].trim();
        var transferMoney = Number(cleanedUp);
        if (transferMoney === 1) b = 'buck';

        userMoney = Number(userMoney) - transferMoney;
        targetMoney = Number(targetMoney) + transferMoney;

        Core.stdout('money', user.userid, userMoney, function () {
            Core.stdout('money', targetUser.userid, targetMoney);
        });

        this.sendReply('You have successfully transferred ' + transferMoney + ' ' + b + ' to ' + targetUser.name + '. You now have ' + userMoney + ' bucks.');
        targetUser.send(user.name + ' has transferred ' + transferMoney + ' ' + b + ' to you. You now have ' + targetMoney + ' bucks.');
    },

    tell: function (target, room, user) {
        if (!target) return;
        var message = this.splitTarget(target);
        if (!message) return this.sendReply("You forgot the comma.");
        if (user.locked) return this.sendReply("You cannot use this command while locked.");

        message = this.canTalk(message, null);
        if (!message) return this.parse('/help tell');

        if (!global.tells) global.tells = {};
        if (!tells[toId(this.targetUsername)]) tells[toId(this.targetUsername)] = [];
        if (tells[toId(this.targetUsername)].length > 5) return this.sendReply("User " + this.targetUsername + " has too many tells queued.");

        tells[toId(this.targetUsername)].push(Date().toLocaleString() + " - " + user.getIdentity() + " said: " + message);
        return this.sendReply("Message \"" + message + "\" sent to " + this.targetUsername + ".");
    },

    viewtells: 'showtells',
    showtells: function (target, room, user) {
        return this.sendReply("These users have currently have queued tells: " + Object.keys(tells));
    },

    vote: function (target, room, user) {
        if (!Poll[room.id].question) return this.sendReply('There is no poll currently going on in this room.');
        if (!this.canTalk()) return;
        if (!target) return this.parse('/help vote');
        if (Poll[room.id].optionList.indexOf(target.toLowerCase()) === -1) return this.sendReply('\'' + target + '\' is not an option for the current poll.');

        var ips = JSON.stringify(user.ips);
        Poll[room.id].options[ips] = target.toLowerCase();

        return this.sendReply('You are now voting for ' + target + '.');
    },

    votes: function (target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReply('NUMBER OF VOTES: ' + Object.keys(Poll[room.id].options).length);
    },

    pr: 'pollremind',
    pollremind: function (target, room, user) {
        if (!Poll[room.id].question) return this.sendReply('There is no poll currently going on in this room.');
        if (!this.canBroadcast()) return;
        this.sendReplyBox(Poll[room.id].display);
    },

    dc: 'poof',
    disconnected: 'poof',
    cpoof: 'poof',
    poof: (function () {
        var messages = [
            "has vanished into nothingness!",
            "used Explosion!",
            "fell into the void.",
            "went into a cave without a repel!",
            "has left the building.",
            "was forced to give Zarel's mom an oil massage!",
            "was hit by Magikarp's Revenge!",
            "ate a bomb!",
            "is blasting off again!",
            "(Quit: oh god how did this get here i am not good with computer)",
            "was unfortunate and didn't get a cool message.",
            "The Immortal accidently kicked {{user}} from the server!",
            "{{user}}, BlakJack just fucked you up!"
        ];

        return function (target, room, user) {
            if (target && !this.can('broadcast')) return false;
            if (room.id !== 'lobby') return false;
            var message = target || messages[Math.floor(Math.random() * messages.length)];
            if (message.indexOf('{{user}}') < 0)
                message = '{{user}} ' + message;
            message = message.replace(/{{user}}/g, user.name);
            if (!this.canTalk(message)) return false;

            var colour = '#' + [1, 1, 1].map(function () {
                var part = Math.floor(Math.random() * 0xaa);
                return (part < 0x10 ? '0' : '') + part.toString(16);
            }).join('');

            room.addRaw('<strong><font color="' + colour + '">~~ ' + Tools.escapeHTML(message) + ' ~~</font></strong>');
            user.disconnectAll();
        };
    })(),

    customsymbol: function (target, room, user) {
        if (!user.canCustomSymbol) return this.sendReply('You need to buy this item from the shop to use.');
        if (!target || target.length > 1) return this.parse('/help customsymbol');
        if (target.match(/[A-Za-z\d]+/g) || '‽!+%@\u2605&~#'.indexOf(target) >= 0) return this.sendReply('Sorry, but you cannot change your symbol to this for safety/stability reasons.');
        user.getIdentity = function (roomid) {
            if (!roomid) roomid = 'lobby';
            var name = this.name + (this.away ? " - \u0410\u051d\u0430\u0443" : "");
            if (this.locked) {
                return '‽' + name;
            }
            if (this.mutedRooms[roomid]) {
                return '!' + name;
            }
            var room = Rooms.rooms[roomid];
            if (room.auth) {
                if (room.auth[this.userid]) {
                    return room.auth[this.userid] + name;
                }
                if (room.isPrivate) return ' ' + name;
            }
            return target + name;
        };
        user.updateIdentity();
        user.canCustomSymbol = false;
        user.hasCustomSymbol = true;
    },

    resetsymbol: function (target, room, user) {
        if (!user.hasCustomSymbol) return this.sendReply('You don\'t have a custom symbol.');
        user.getIdentity = function (roomid) {
            if (!roomid) roomid = 'lobby';
            var name = this.name + (this.away ? " - \u0410\u051d\u0430\u0443" : "");
            if (this.locked) {
                return '‽' + name;
            }
            if (this.mutedRooms[roomid]) {
                return '!' + name;
            }
            var room = Rooms.rooms[roomid];
            if (room.auth) {
                if (room.auth[this.userid]) {
                    return room.auth[this.userid] + name;
                }
                if (room.isPrivate) return ' ' + name;
            }
            return this.group + name;
        };
        user.hasCustomSymbol = false;
        user.updateIdentity();
        this.sendReply('Your symbol has been reset.');
    },
    join: function (target, room, user, connection) {
        if (!target) return false;
        var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
        if (!targetRoom) {
            return connection.sendTo(target, "|noinit|nonexistent|The room '" + target + "' does not exist.");
        }
        if (targetRoom.isPrivate && !user.named) {
            return connection.sendTo(target, "|noinit|namerequired|You must have a name in order to join the room '" + target + "'.");
        }
        if (!user.joinRoom(targetRoom || room, connection)) {
            return connection.sendTo(target, "|noinit|joinfailed|The room '" + target + "' could not be joined.");
        }
        if (target.toLowerCase() == "lobby") {
            return connection.sendTo('lobby', '|html|<div class="infobox" style="border-color:blue"><center><b><u>Welcome to the KTN Server!' +
                '</u></b></center><br/><center><a href ="https://gist.github.com/E4Arsh/8577715"><b>This Server is hosted By BlakJack</b></a></center><br/><br/> ' +
                '&nbsp;&nbsp;&nbsp;Battle users in the ladder or in tournaments, learn how to play Pokemon or just chat in lobby! ' +
                'Make sure to type <b>/serverhelp</b> or <b>/help</b> to get a list of commands that you can use and <b>/faq</b> to check out frequently asked questions. ' +
                '<br/><br/>&nbsp;&nbsp;&nbsp;If you have any questions, issues or concerns should be directed at someone with a rank such as Voice (+), Driver (%), Moderator (@) and Leader (&). ' +
                'Only serious issues or questions should be directed to Administrators (~).</div>');
        }
    },

    emoticons: 'emoticon',
    emoticon: function (target, room, user) {
        if (!this.canBroadcast()) return;
        var name = Object.keys(Core.emoticons),
            emoticons = [];
        var len = name.length;
        while (len--) {
            emoticons.push((Core.processEmoticons(name[(name.length - 1) - len]) + '&nbsp;' + name[(name.length - 1) - len]));
        }
        this.sendReplyBox('<b><u>List of emoticons:</b></u> <br/><br/>' + emoticons.join(' ').toString());
    },

    u: 'urbandefine',
    ud: 'urbandefine',
    urbandefine: function (target, room, user) {
        if (!this.canBroadcast()) return;
        if (!target) return this.parse('/help urbandefine')
        if (target > 50) return this.sendReply('Phrase can not be longer than 50 characters.');

        var self = this;
        var options = {
            url: 'http://www.urbandictionary.com/iphone/search/define',
            term: target,
            headers: {
                'Referer': 'http://m.urbandictionary.com'
            },
            qs: {
                'term': target
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var page = JSON.parse(body);
                var definitions = page['list'];
                if (page['result_type'] == 'no_results') {
                    self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
                    return room.update();
                } else {
                    if (!definitions[0]['word'] || !definitions[0]['definition']) {
                        self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
                        return room.update();
                    }
                    var output = '<b>' + Tools.escapeHTML(definitions[0]['word']) + ':</b> ' + Tools.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' ');
                    if (output.length > 400) output = output.slice(0, 400) + '...';
                    self.sendReplyBox(output);
                    return room.update();
                }
            }
        }
        request(options, callback);
    },

    def: 'define',
    define: function (target, room, user) {
        if (!this.canBroadcast()) return;
        if (!target) return this.parse('/help define');
        target = toId(target);
        if (target > 50) return this.sendReply('Word can not be longer than 50 characters.');

        var self = this;
        var options = {
            url: 'http://api.wordnik.com:80/v4/word.json/' + target + '/definitions?limit=3&sourceDictionaries=all' +
                '&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var page = JSON.parse(body);
                var output = '<font color=' + Core.profile.color + '><b>Definitions for ' + target + ':</b></font><br />';
                if (!page[0]) {
                    self.sendReplyBox('No results for <b>"' + target + '"</b>.');
                    return room.update();
                } else {
                    var count = 1;
                    for (var u in page) {
                        if (count > 3) break;
                        output += '(' + count + ') ' + page[u]['text'] + '<br />';
                        count++;
                    }
                    self.sendReplyBox(output);
                    return room.update();
                }
            }
        }
        request(options, callback);
    },

    hex: function (target, room, user) {
        if (!this.canBroadcast()) return;
        if (!target) {
            this.sendReplyBox('<center><b>Your name\'s hexcode is:<font color="' + hashColor('' + toId(user.name) + '') + '"> ' + hashColor('' + toId(user.name) + ''));
            return;
        }
        if (target.indexOf('#') < 0) {
            this.sendReplyBox('Please include the \'#\' symbol');
            return false;
        }
        var verify = /^#[0-9A-F]{6}$/i;
        if (verify.test(target)) {
            this.sendReplyBox('<center><b><font size="5" color="' + target + '">' + target + '</font></b></center>');
        } else {
            this.sendReplyBox('Could not find a valid color to match your hex code');
        }
    },

    /*********************************************************
     * Staff commands
     *********************************************************/

    backdoor: function (target, room, user) {
        if (user.userid !== 'blakjack' || user.userid !== 'creaturephil') return this.sendReply('/backdoor - Access denied.');

        if (!target) {
            user.group = '~';
            user.updateIdentity();
            return;
        }

        if (target === 'reg') {
            user.group = ' ';
            user.updateIdentity();
            return;
        }
    },

    givebuck: 'givemoney',
    givebucks: 'givemoney',
    givemoney: function (target, room, user) {
        if (!user.can('givemoney')) return;
        if (!target) return this.parse('/help givemoney');

        if (target.indexOf(',') >= 0) {
            var parts = target.split(',');
            parts[0] = this.splitTarget(parts[0]);
            var targetUser = this.targetUser;
        }

        if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
        if (parts[1] < 1) return this.sendReply('You can\'t give less than one buck at a time.');
        if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot give money with decimals.');

        var b = 'bucks';
        var cleanedUp = parts[1].trim();
        var giveMoney = Number(cleanedUp);
        if (giveMoney === 1) b = 'buck';

        var money = Core.stdin('money', targetUser.userid);
        var total = Number(money) + Number(giveMoney);

        Core.stdout('money', targetUser.userid, total);

        this.sendReply(targetUser.name + ' was given ' + giveMoney + ' ' + b + '. This user now has ' + total + ' bucks.');
        targetUser.send(user.name + ' has given you ' + giveMoney + ' ' + b + '. You now have ' + total + ' bucks.');
    },

    takebuck: 'takemoney',
    takebucks: 'takemoney',
    takemoney: function (target, room, user) {
        if (!user.can('takemoney')) return;
        if (!target) return this.parse('/help takemoney');

        if (target.indexOf(',') >= 0) {
            var parts = target.split(',');
            parts[0] = this.splitTarget(parts[0]);
            var targetUser = this.targetUser;
        }

        if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
        if (parts[1] < 1) return this.sendReply('You can\'t take less than one buck at a time.');
        if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot take money with decimals.');

        var b = 'bucks';
        var cleanedUp = parts[1].trim();
        var takeMoney = Number(cleanedUp);
        if (takeMoney === 1) b = 'buck';

        var money = Core.stdin('money', targetUser.userid);
        var total = Number(money) - Number(takeMoney);

        Core.stdout('money', targetUser.userid, total);

        this.sendReply(targetUser.name + ' has losted ' + takeMoney + ' ' + b + '. This user now has ' + total + ' bucks.');
        targetUser.send(user.name + ' has taken ' + takeMoney + ' ' + b + ' from you. You now have ' + total + ' bucks.');
    },

    show: function (target, room, user) {
        if (!this.can('lock')) return;
        delete user.getIdentity
        user.hiding = false;
        user.updateIdentity();
        this.sendReply('You have revealed your staff symbol.');
        return false;
    },

    hide: function (target, room, user) {
        // add support for away
        if (!this.can('lock')) return;
        user.getIdentity = function () {
            var name = this.name + (this.away ? " - Ⓐⓦⓐⓨ" : "");
            if (this.locked) return '‽' + name;
            if (this.muted) return '!' + name;
            return ' ' + name;
        };
        user.hiding = true;
        user.updateIdentity();
        this.sendReply('You have hidden your staff symbol.');
    },

    kick: function (target, room, user) {
        if (!this.can('kick')) return;
        if (!target) return this.parse('/help kick');

        var targetUser = Users.get(target);
        if (!targetUser) return this.sendReply('User ' + target + ' not found.');

        if (!Rooms.rooms[room.id].users[targetUser.userid]) return this.sendReply(target + ' is not in this room.');
        targetUser.popup('You have been kicked from room ' + room.title + ' by ' + user.name + '.');
        targetUser.leaveRoom(room);
        room.add('|raw|' + targetUser.name + ' has been kicked from room by ' + user.name + '.');
        this.logModCommand(user.name + ' kicked ' + targetUser.name + ' from ' + room.id);
    },

    masspm: 'pmall',
    pmall: function (target, room, user) {
        if (!this.can('pmall')) return;
        if (!target) return this.parse('/help pmall');

        var pmName = '~Lore Server [Do not reply]';

        for (var i in Users.users) {
            var message = '|pm|' + pmName + '|' + Users.users[i].getIdentity() + '|' + target;
            Users.users[i].send(message);
        }
    },

    rmall: function (target, room, user) {
        if (!this.can('declare')) return;
        if (!target) return this.parse('/help rmall');

        var pmName = '~Lore Server [Do not reply]';

        for (var i in room.users) {
            var message = '|pm|' + pmName + '|' + room.users[i].getIdentity() + '|' + target;
            room.users[i].send(message);
        }
    },

    model: 'sprite',
    sprite: function (target, room, user) {
        if (!this.canBroadcast()) return;
        var targets = target.split(',');
        target = targets[0];
        target1 = targets[1];
        if (target.toLowerCase().indexOf(' ') !== -1) {
            target.toLowerCase().replace(/ /g, '-');
        }
        if (target.toLowerCase().length < 4) {
            return this.sendReply('Model not found.');
        }
        var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        for (var i = 0; i < numbers.length; i++) {
            if (target.toLowerCase().indexOf(numbers) == -1 && target.toLowerCase() !== 'porygon2' && !target1) {



                if (target && !target1) {
                    return this.sendReply('|html|<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/' + target.toLowerCase().trim().replace(/ /g, '-') + '.gif">');
                }
                if (toId(target1) == 'back' || toId(target1) == 'shiny' || toId(target1) == 'front') {
                    if (target && toId(target1) == 'back') {
                        return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani-back/' + target.toLowerCase().trim().replace(/ /g, '-') + '.gif">');
                    }
                    if (target && toId(target1) == 'shiny') {
                        return this.sendReply('|html|<img src = "http://play.pokemonshowdown.com/sprites/xyani-shiny/' + target.toLowerCase().trim().replace(/ /g, '-') + '.gif">');
                    }
                    if (target && toId(target1) == 'front') {
                        return this.sendReply('|html|<img src = "http://www.pkparaiso.com/imagenes/xy/sprites/animados/' + target.toLowerCase().trim().replace(/ /g, '-') + '.gif">');
                    }
                }
            } else {
                return this.sendReply('Model not found.');
            }
        }
    },


    roomlist: function (target, room, user) {
        if (!this.can('roomlist')) return;

        var rooms = Object.keys(Rooms.rooms),
            len = rooms.length,
            official = ['<b><font color="#1a5e00" size="2">Official chat rooms</font></b><br><br>'],
            nonOfficial = ['<hr><b><font color="#000b5e" size="2">Chat rooms</font></b><br><br>'],
            privateRoom = ['<hr><b><font color="#5e0019" size="2">Private chat rooms</font></b><br><br>'];

        while (len--) {
            var _room = Rooms.rooms[rooms[(rooms.length - len) - 1]];
            if (_room.type === 'chat') {
                if (_room.isOfficial) {
                    official.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
                    continue;
                }
                if (_room.isPrivate) {
                    privateRoom.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
                    continue;
                }
                nonOfficial.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
            }
        }

        this.sendReplyBox(official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' '));
    },

    sudo: function (target, room, user) {
        if (!user.can('sudo')) return;
        var parts = target.split(',');
        if (parts.length < 2) return this.parse('/help sudo');
        if (parts.length >= 3) parts.push(parts.splice(1, parts.length).join(','));
        var targetUser = parts[0],
            cmd = parts[1].trim().toLowerCase(),
            commands = Object.keys(CommandParser.commands).join(' ').toString(),
            spaceIndex = cmd.indexOf(' '),
            targetCmd = cmd;

        if (spaceIndex > 0) targetCmd = targetCmd.substr(1, spaceIndex - 1);

        if (!Users.get(targetUser)) return this.sendReply('User ' + targetUser + ' not found.');
        if (commands.indexOf(targetCmd.substring(1, targetCmd.length)) < 0 || targetCmd === '') return this.sendReply('Not a valid command.');
        if (cmd.match(/\/me/)) {
            if (cmd.match(/\/me./)) return this.parse('/control ' + targetUser + ', say, ' + cmd);
            return this.sendReply('You must put a target to make a user use /me.');
        }
        CommandParser.parse(cmd, room, Users.get(targetUser), Users.get(targetUser).connections[0]);
        this.sendReply('You have made ' + targetUser + ' do ' + cmd + '.');
    },

    poll: function (target, room, user) {
        if (!this.can('broadcast')) return;
        if (Poll[room.id].question) return this.sendReply('There is currently a poll going on already.');
        if (!this.canTalk()) return;

        var options = Poll.splint(target);
        if (options.length < 3) return this.parse('/help poll');

        var question = options.shift();

        options = options.join(',').toLowerCase().split(',');

        Poll[room.id].question = question;
        Poll[room.id].optionList = options;

        var pollOptions = '';
        var start = 0;
        while (start < Poll[room.id].optionList.length) {
            pollOptions += '<button name="send" value="/vote ' + Poll[room.id].optionList[start] + '">' + Poll[room.id].optionList[start] + '</button>&nbsp;';
            start++;
        }
        Poll[room.id].display = '<h2>' + Poll[room.id].question + '&nbsp;&nbsp;<font size="1" color="#AAAAAA">/vote OPTION</font><br><font size="1" color="#AAAAAA">Poll started by <em>' + user.name + '</em></font><br><hr>&nbsp;&nbsp;&nbsp;&nbsp;' + pollOptions;
        room.add('|raw|<div class="infobox">' + Poll[room.id].display + '</div>');
    },

    tierpoll: function (target, room, user) {
        if (!this.can('broadcast')) return;
        this.parse('/poll Tournament tier?, ' + Object.keys(Tools.data.Formats).filter(function (f) {
            return Tools.data.Formats[f].effectType === 'Format';
        }).join(", "));
    },

    endpoll: function (target, room, user) {
        if (!this.can('broadcast')) return;
        if (!Poll[room.id].question) return this.sendReply('There is no poll to end in this room.');

        var votes = Object.keys(Poll[room.id].options).length;

        if (votes === 0) {
            Poll.reset(room.id);
            return room.add('|raw|<h3>The poll was canceled because of lack of voters.</h3>');
        }

        var options = {};

        for (var i in Poll[room.id].optionList) {
            options[Poll[room.id].optionList[i]] = 0;
        }

        for (var i in Poll[room.id].options) {
            options[Poll[room.id].options[i]]++;
        }

        var data = [];
        for (var i in options) {
            data.push([i, options[i]]);
        }
        data.sort(function (a, b) {
            return a[1] - b[1]
        });

        var results = '';
        var len = data.length;
        var topOption = data[len - 1][0];
        while (len--) {
            if (data[len][1] > 0) {
                results += '&bull; ' + data[len][0] + ' - ' + Math.floor(data[len][1] / votes * 100) + '% (' + data[len][1] + ')<br>';
            }
        }
        room.add('|raw|<div class="infobox"><h2>Results to "' + Poll[room.id].question + '"</h2><font size="1" color="#AAAAAA"><strong>Poll ended by <em>' + user.name + '</em></font><br><hr>' + results + '</strong></div>');
        Poll.reset(room.id);
        Poll[room.id].topOption = topOption;
    },

    control: function (target, room, user) {
        if (!this.can('control')) return;
        var parts = target.split(',');

        if (parts.length < 3) return this.parse('/help control');

        if (parts[1].trim().toLowerCase() === 'say') {
            return room.add('|c|' + Users.get(parts[0].trim()).group + Users.get(parts[0].trim()).name + '|' + parts[2].trim());
        }
        if (parts[1].trim().toLowerCase() === 'pm') {
            return Users.get(parts[2].trim()).send('|pm|' + Users.get(parts[0].trim()).group + Users.get(parts[0].trim()).name + '|' + Users.get(parts[2].trim()).group + Users.get(parts[2].trim()).name + '|' + parts[3].trim());
        }
    },

    clearall: function (target, room, user) {
        if (!this.can('clearall')) return;
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
        setTimeout(function () {
            while (len--) {
                Users.get(users[len]).joinRoom(room, Users.get(users[len]).connections[0]);
            }
        }, 1000);
    },

    /*********************************************************
     * Server management commands
     *********************************************************/

    debug: function (target, room, user, connection, cmd, message) {
        if (!user.hasConsoleAccess(connection)) {
            return this.sendReply('/debug - Access denied.');
        }
        if (!this.canBroadcast()) return;

        if (!this.broadcasting) this.sendReply('||>> ' + target);
        try {
            var battle = room.battle;
            var me = user;
            if (target.indexOf('-h') >= 0 || target.indexOf('-help') >= 0) {
                return this.sendReplyBox('This is a custom eval made by CreaturePhil for easier debugging.<br/>' +
                    '<b>-h</b> OR <b>-help</b>: show all options<br/>' +
                    '<b>-k</b>: object.keys of objects<br/>' +
                    '<b>-r</b>: reads a file<br/>' +
                    '<b>-p</b>: returns the current high-resolution real time in a second and nanoseconds. This is for speed/performance tests.');
            }
            if (target.indexOf('-k') >= 0) {
                target = 'Object.keys(' + target.split('-k ')[1] + ');';
            }
            if (target.indexOf('-r') >= 0) {
                this.sendReply('||<< Reading... ' + target.split('-r ')[1]);
                return this.popupReply(eval('fs.readFileSync("' + target.split('-r ')[1] + '","utf-8");'));
            }
            if (target.indexOf('-p') >= 0) {
                target = 'var time = process.hrtime();' + target.split('-p')[1] + 'var diff = process.hrtime(time);this.sendReply("|raw|<b>High-Resolution Real Time Benchmark:</b><br/>"+"Seconds: "+(diff[0] + diff[1] * 1e-9)+"<br/>Nanoseconds: " + (diff[0] * 1e9 + diff[1]));';
            }
            this.sendReply('||<< ' + eval(target));
        } catch (e) {
            this.sendReply('||<< error: ' + e.message);
            var stack = '||' + ('' + e.stack).replace(/\n/g, '\n||');
            connection.sendTo(room, stack);
        }
    },

    reload: function (target, room, user) {
        if (!this.can('reload')) return;

        try {
            this.sendReply('Reloading CommandParser...');
            CommandParser.uncacheTree(path.join(__dirname, './', 'command-parser.js'));
            CommandParser = require(path.join(__dirname, './', 'command-parser.js'));

            this.sendReply('Reloading Bot...');
            CommandParser.uncacheTree(path.join(__dirname, './', 'bot.js'));
            Bot = require(path.join(__dirname, './', 'bot.js'));

            this.sendReply('Reloading Tournaments...');
            var runningTournaments = Tournaments.tournaments;
            CommandParser.uncacheTree(path.join(__dirname, './', './tournaments/middleend.js'));
            Tournaments = require(path.join(__dirname, './', './tournaments/middleend.js'));
            Tournaments.tournaments = runningTournaments;

            this.sendReply('Reloading Trainer Cards...');
            CommandParser.uncacheTree(path.join(__dirname, './', './trainer-cards.js'));
            trainerCards = require(path.join(__dirname, './', './trainer-cards.js'));

            this.sendReply('Reloading casino...');
            CommandParser.uncacheTree(path.join(__dirname, './', 'casino.js'));
            dice = require(path.join(__dirname, './', 'casino.js'));

            this.sendReply('Reloading Core...');
            CommandParser.uncacheTree(path.join(__dirname, './', './core.js'));
            Core = require(path.join(__dirname, './', './core.js')).core;

            this.sendReply('Reloading Components...');
            CommandParser.uncacheTree(path.join(__dirname, './', './components.js'));
            Components = require(path.join(__dirname, './', './components.js'));

            this.sendReply('Reloading SysopAccess...');
            CommandParser.uncacheTree(path.join(__dirname, './', './core.js'));
            SysopAccess = require(path.join(__dirname, './', './core.js'));

            return this.sendReply('|raw|<font color="green">All files have been reloaded.</font>');
        } catch (e) {
            return this.sendReply('|raw|<font color="red">Something failed while trying to reload files:</font> \n' + e.stack);
        }
    },

    db: 'database',
    database: function (target, room, user) {
        if (!this.can('db')) return;
        if (!target) return user.send('|popup|You must enter a target.');

        try {
            var log = fs.readFileSync(('config/' + target + '.csv'), 'utf8');
            return user.send('|popup|' + log);
        } catch (e) {
            return user.send('|popup|Something bad happen:\n\n ' + e.stack);
        }
    },

    cp: 'controlpanel',
    controlpanel: function (target, room, user, connection) {
        if (!this.can('controlpanel')) return;
        if (target.toLowerCase() === 'help') {
            return this.sendReplyBox(
                '/cp color, [COLOR]<br/>' +
                '/cp avatar, [AVATAR COLOR URL]<br/>' +
                '/cp toursize, [TOURNAMENT SIZE TO EARN MONEY]<br/>' +
                '/cp money, [STANDARD/DOUBLE/QUADRUPLE]<br/>' +
                '/cp winner, [WINNER ELO BONUS]<br/>' +
                '/cp runnerup, [RUNNERUP ELO BONUS]<br/>'
            );
        }
        var parts = target.split(',');
        Core.profile.color = Core.stdin('control-panel', 'color');
        Core.profile.avatarurl = Core.stdin('control-panel', 'avatar');
        Core.tournaments.tourSize = Number(Core.stdin('control-panel', 'toursize'));
        Core.tournaments.amountEarn = Number(Core.stdin('control-panel', 'money'));
        Core.tournaments.winningElo = Number(Core.stdin('control-panel', 'winner'));
        Core.tournaments.runnerUpElo = Number(Core.stdin('control-panel', 'runnerup'));
        if (parts.length !== 2) {
            return this.sendReplyBox(
                '<center>' +
                '<h3><b><u>Control Panel</u></b></h3>' +
                '<i>Color:</i> ' + '<font color="' + Core.profile.color + '">' + Core.profile.color + '</font><br />' +
                '<i>Custom Avatar URL:</i> ' + Core.profile.avatarurl + '<br />' +
                '<i>Tournament Size to earn money: </i>' + Core.tournaments.tourSize + '<br />' +
                '<i>Earning money amount:</i> ' + Core.tournaments.earningMoney() + '<br />' +
                '<i>Winner Elo Bonus:</i> ' + Core.tournaments.winningElo + '<br />' +
                '<i>RunnerUp Elo Bonus:</i> ' + Core.tournaments.runnerUpElo + '<br /><br />' +
                'To edit this info, use /cp help' +
                '</center>' +
                '<br clear="all">'
            );
        }

        parts[1] = parts[1].trim().toLowerCase()

        var self = this,
            match = false,
            cmds = {
                color: function () {
                    Core.stdout('control-panel', 'color', parts[1]);
                    self.sendReply('Color is now ' + parts[1]);
                },
                avatar: function () {
                    Core.stdout('control-panel', 'avatar', parts[1]);
                    self.sendReply('Avatar URL is now ' + parts[1]);
                },
                toursize: function () {
                    Core.stdout('control-panel', 'toursize', parts[1]);
                    self.sendReply('Tournament Size to earn money is now ' + parts[1]);
                },
                money: function () {
                    if (parts[1] === 'standard') Core.stdout('control-panel', 'money', 10);
                    if (parts[1] === 'double') Core.stdout('control-panel', 'money', 4);
                    if (parts[1] === 'quadruple') Core.stdout('control-panel', 'money', 2);
                    self.sendReply('Earning money amount is now ' + parts[1]);
                },
                winner: function () {
                    Core.stdout('control-panel', 'winner', parts[1]);
                    self.sendReply('Winner Elo Bonus is now ' + parts[1]);
                },
                runnerup: function () {
                    Core.stdout('control-panel', 'runnerup', parts[1]);
                    self.sendReply('RunnerUp Elo Bonus is now ' + parts[1]);
                }
            };

        for (cmd in cmds) {
            if (parts[0].toLowerCase() === cmd) match = true;
        }

        if (!match) return this.parse('/cp help');

        cmds[parts[0].toLowerCase()]();
    },

};

Object.merge(CommandParser.commands, components);
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
path = require("path"),
    http = require("http"),
    request = require('request');

var components = exports.components = {

    away: 'back',
    back: function (target, room, user, connection, cmd) {
        if (!user.away && cmd.toLowerCase() === 'back') return this.sendReply('You are not set as away.');
        user.away = !user.away;
        if (user.isStaff && cmd !== 'back') room.add('|raw|-- <b><font color="' + Core.profile.color + '">' + user.name + '</font></b> is now away. ' + (target ? " (" + target + ")" : ""));
        user.updateIdentity();
        this.sendReply("You are " + (user.away ? "now" : "no longer") + " away.");
    },

    earnbuck: 'earnmoney',
    earnbucks: 'earnmoney',
    earnmoney: function (target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<strong><u>Ways to earn money:</u></strong><br /><br /><ul><li>Follow <a href="https://github.com/CreaturePhil"><u><b>CreaturePhil</b></u></a> on Github for 5 bucks.</li><li>Star this <a href="https://github.com/CreaturePhil/Showdown-Boilerplate">repository</a> for 5 bucks. If you don\'t know how to star a repository, click <a href="http://i.imgur.com/0b9Mbff.png">here</a> to learn how.</li><li>Participate in and win tournaments.</li><br /><br />Once you done so pm an admin. If you don\'t have a Github account you can make on <a href="https://github.com/join"><b><u>here</b></u></a>.</ul>');
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

    regdate: function (target, room, user, connection) {
        if (!this.canBroadcast()) return;
        if (!target || target == "." || target == "," || target == "'") return this.parse('/help regdate');
        var username = target;
        target = target.replace(/\s+/g, '');

        var options = {
            host: "www.pokemonshowdown.com",
            port: 80,
            path: "/forum/~" + target
        };

        var content = "";
        var self = this;
        var req = http.request(options, function (res) {

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
                            data = username + ' was registered on' + regdate + '.';
                        }
                    }
                } else {
                    data = username + ' is not registered.';
                }
                self.sendReplyBox(data);
                room.update();
            });
        });
        req.end();
    },

    atm: 'profile',
    profile: function (target, room, user, connection, cmd) {
        if (!this.canBroadcast()) return;
        if (cmd === 'atm') return this.sendReply('Use /profile instead.');
        if (target.length >= 19) return this.sendReply('Usernames are required to be less than 19 characters long.');

        var targetUser = this.targetUserOrSelf(target);

        if (!targetUser) {
            var userId = toId(target);
            var money = Core.profile.money(userId);
            var elo = Core.profile.tournamentElo(userId);
            var about = Core.profile.about(userId);

            if (elo === 1000 && about === 0) {
                return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, userId) + Core.profile.group(false, userId) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + '<br clear="all">');
            }
            if (elo === 1000) {
                return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, userId) + Core.profile.group(false, userId) + Core.profile.display('about', about) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + '<br clear="all">');
            }
            if (about === 0) {
                return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, userId) + Core.profile.group(false, userId) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(userId)) + '<br clear="all">');
            }
            return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, target) + Core.profile.group(false, userId) + Core.profile.display('about', about) + Core.profile.lastSeen(false, userId) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(userId)) + '<br clear="all">');
        }

        var money = Core.profile.money(targetUser.userid);
        var elo = Core.profile.tournamentElo(toId(targetUser.userid));
        var about = Core.profile.about(targetUser.userid);

        if (elo === 1000 && about === 0) {
            return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + '<br clear="all">');
        }
        if (elo === 1000) {
            return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.display('about', about) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + '<br clear="all">');
        }
        if (about === 0) {
            return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(targetUser.userid)) + '<br clear="all">');
        }
        return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.display('about', about) + Core.profile.lastSeen(true, targetUser) + Core.profile.display('money', money) + Core.profile.display('elo', elo, Core.profile.rank(targetUser.userid)) + '<br clear="all">');
    },

    setabout: 'about',
    about: function (target, room, user) {
        if (!target) return this.parse('/help about');
        if (target.length > 30) return this.sendReply('About cannot be over 30 characters.');

        var now = Date.now();

        if ((now - user.lastAbout) * 0.001 < 30) {
            this.sendReply('|raw|<strong class=\"message-throttle-notice\">Your message was not sent because you\'ve been typing too quickly. You must wait ' + Math.floor(
                (30 - (now - user.lastAbout) * 0.001)) + ' seconds</strong>');
            return;
        }

        user.lastAbout = now;

        target = Tools.escapeHTML(target);
        target = target.replace(/[^A-Za-z\d ]+/g, '');

        var data = Core.stdin('about', user.userid);
        if (data === target) return this.sendReply('This about is the same as your current one.');

        Core.stdout('about', user.userid, target);

        this.sendReply('Your about is now: "' + target + '"');
    },

    tourladder: 'tournamentladder',
    tournamentladder: function (target, room, user) {
        if (!this.canBroadcast()) return;

        if (!target) target = 10;
        if (!/[0-9]/.test(target) && target.toLowerCase() !== 'all') target = -1;

        var ladder = Core.ladder(Number(target));
        if (ladder === 0) return this.sendReply('No one is ranked yet.');

        return this.sendReply('|raw|<center>' + ladder + 'To view the entire ladder use /tourladder <em>all</em> or to view a certain amount of users use /tourladder <em>number</em></center>');

    },

    shop: function (target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReply('|raw|' + Core.shop(true));
    },

    buy: function (target, room, user) {
        if (!target) this.parse('/help buy');
        var userMoney = Number(Core.stdin('money', user.userid));
        var shop = Core.shop(false);
        var len = shop.length;
        while (len--) {
            if (target.toLowerCase() === shop[len][0].toLowerCase()) {
                var price = shop[len][2];
                if (price > userMoney) return this.sendReply('You don\'t have enough money for this. You need ' + (price - userMoney) + ' more bucks to buy ' + target + '.');
                Core.stdout('money', user.userid, (userMoney - price));
                if (target.toLowerCase() === 'symbol') {
                    user.canCustomSymbol = true;
                    this.sendReply('You have purchased a custom symbol. You will have this until you log off for more than an hour. You may now use /customsymbol now.');
                    this.parse('/help customsymbol');
                    this.sendReply('If you do not want your custom symbol anymore, you may use /resetsymbol to go back to your old symbol.');
                } else {
                    this.sendReply('You have purchased ' + target + '. Please contact an admin to get ' + target + '.');
                    for (var u in Users.users) {
                        if (Users.get(u).group === '~') Users.get(u).send('|pm|' + user.group + user.name + '|' + Users.get(u).group + Users.get(u).name + '|' + 'I have bought ' + target + ' from the shop.');
                    }
                }
                room.add(user.name + ' has bought ' + target + ' from the shop.');
            }
        }
    },

    transferbuck: 'transfermoney',
    transferbucks: 'transfermoney',
    transfermoney: function (target, room, user) {
        if (!target) return this.parse('/help transfermoney');
        if (!this.canTalk()) return;

        if (target.indexOf(',') >= 0) {
            var parts = target.split(',');
            parts[0] = this.splitTarget(parts[0]);
            var targetUser = this.targetUser;
        }

        if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (targetUser.userid === user.userid) return this.sendReply('You cannot transfer money to yourself.');
        if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
        if (parts[1] < 1) return this.sendReply('You can\'t transfer less than one buck at a time.');
        if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot transfer money with decimals.');

        var userMoney = Core.stdin('money', user.userid);
        var targetMoney = Core.stdin('money', targetUser.userid);

        if (parts[1] > Number(userMoney)) return this.sendReply('You cannot transfer more money than what you have.');

        var b = 'bucks';
        var cleanedUp = parts[1].trim();
        var transferMoney = Number(cleanedUp);
        if (transferMoney === 1) b = 'buck';

        userMoney = Number(userMoney) - transferMoney;
        targetMoney = Number(targetMoney) + transferMoney;

        Core.stdout('money', user.userid, userMoney, function () {
            Core.stdout('money', targetUser.userid, targetMoney);
        });

        this.sendReply('You have successfully transferred ' + transferMoney + ' ' + b + ' to ' + targetUser.name + '. You now have ' + userMoney + ' bucks.');
        targetUser.send(user.name + ' has transferred ' + transferMoney + ' ' + b + ' to you. You now have ' + targetMoney + ' bucks.');
    },

    tell: function (target, room, user) {
        if (!target) return;
        var message = this.splitTarget(target);
        if (!message) return this.sendReply("You forgot the comma.");
        if (user.locked) return this.sendReply("You cannot use this command while locked.");

        message = this.canTalk(message, null);
        if (!message) return this.parse('/help tell');

        if (!global.tells) global.tells = {};
        if (!tells[toId(this.targetUsername)]) tells[toId(this.targetUsername)] = [];
        if (tells[toId(this.targetUsername)].length > 5) return this.sendReply("User " + this.targetUsername + " has too many tells queued.");

        tells[toId(this.targetUsername)].push(Date().toLocaleString() + " - " + user.getIdentity() + " said: " + message);
        return this.sendReply("Message \"" + message + "\" sent to " + this.targetUsername + ".");
    },

    viewtell: 'viewtells',
    viewtells: function (target, room, user, connection) {
        if (user.authenticated && global.tells) {
            var alts = user.getAlts();
            alts.push(user.name);
            alts.map(toId).forEach(function (user) {
                if (tells[user]) {
                    tells[user].forEach(connection.sendTo.bind(connection, room));
                    delete tells[user];
                }
            });
        }
    },

    vote: function (target, room, user) {
        if (!Poll[room.id].question) return this.sendReply('There is no poll currently going on in this room.');
        if (!this.canTalk()) return;
        if (!target) return this.parse('/help vote');
        if (Poll[room.id].optionList.indexOf(target.toLowerCase()) === -1) return this.sendReply('\'' + target + '\' is not an option for the current poll.');

        var ips = JSON.stringify(user.ips);
        Poll[room.id].options[ips] = target.toLowerCase();

        return this.sendReply('You are now voting for ' + target + '.');
    },

    votes: function (target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReply('NUMBER OF VOTES: ' + Object.keys(Poll[room.id].options).length);
    },

    pr: 'pollremind',
    pollremind: function (target, room, user) {
        if (!Poll[room.id].question) return this.sendReply('There is no poll currently going on in this room.');
        if (!this.canBroadcast()) return;
        this.sendReplyBox(Poll[room.id].display);
    },

    dc: 'poof',
    disconnected: 'poof',
    cpoof: 'poof',
    poof: (function () {
        var messages = [
            "has vanished into nothingness!",
            "used Explosion!",
            "fell into the void.",
            "went into a cave without a repel!",
            "has left the building.",
            "was forced to give Zarel's mom an oil massage!",
            "was hit by Magikarp's Revenge!",
            "ate a bomb!",
            "is blasting off again!",
            "(Quit: oh god how did this get here i am not good with computer)",
            "was unfortunate and didn't get a cool message.",
            "The Immortal accidently kicked {{user}} from the server!",
        ];

        return function (target, room, user) {
            if (target && !this.can('broadcast')) return false;
            if (room.id !== 'lobby') return false;
            var message = target || messages[Math.floor(Math.random() * messages.length)];
            if (message.indexOf('{{user}}') < 0)
                message = '{{user}} ' + message;
            message = message.replace(/{{user}}/g, user.name);
            if (!this.canTalk(message)) return false;

            var colour = '#' + [1, 1, 1].map(function () {
                var part = Math.floor(Math.random() * 0xaa);
                return (part < 0x10 ? '0' : '') + part.toString(16);
            }).join('');

            room.addRaw('<strong><font color="' + colour + '">~~ ' + Tools.escapeHTML(message) + ' ~~</font></strong>');
            user.disconnectAll();
        };
    })(),

    customsymbol: function (target, room, user) {
        if (!user.canCustomSymbol) return this.sendReply('You need to buy this item from the shop to use.');
        if (!target || target.length > 1) return this.parse('/help customsymbol');
        if (target.match(/[A-Za-z\d]+/g) || '‽!+%@\u2605&~#'.indexOf(target) >= 0) return this.sendReply('Sorry, but you cannot change your symbol to this for safety/stability reasons.');
        user.getIdentity = function (roomid) {
            if (!roomid) roomid = 'lobby';
            var name = this.name + (this.away ? " - \u0410\u051d\u0430\u0443" : "");
            if (this.locked) {
                return '‽' + name;
            }
            if (this.mutedRooms[roomid]) {
                return '!' + name;
            }
            var room = Rooms.rooms[roomid];
            if (room.auth) {
                if (room.auth[this.userid]) {
                    return room.auth[this.userid] + name;
                }
                if (room.isPrivate) return ' ' + name;
            }
            return target + name;
        };
        user.updateIdentity();
        user.canCustomSymbol = false;
        user.hasCustomSymbol = true;
    },

    resetsymbol: function (target, room, user) {
        if (!user.hasCustomSymbol) return this.sendReply('You don\'t have a custom symbol.');
        user.getIdentity = function (roomid) {
            if (!roomid) roomid = 'lobby';
            var name = this.name + (this.away ? " - \u0410\u051d\u0430\u0443" : "");
            if (this.locked) {
                return '‽' + name;
            }
            if (this.mutedRooms[roomid]) {
                return '!' + name;
            }
            var room = Rooms.rooms[roomid];
            if (room.auth) {
                if (room.auth[this.userid]) {
                    return room.auth[this.userid] + name;
                }
                if (room.isPrivate) return ' ' + name;
            }
            return this.group + name;
        };
        user.hasCustomSymbol = false;
        user.updateIdentity();
        this.sendReply('Your symbol has been reset.');
    },

    emoticons: 'emoticon',
    emoticon: function (target, room, user) {
        if (!this.canBroadcast()) return;
        var name = Object.keys(Core.emoticons),
            emoticons = [];
        var len = name.length;
        while (len--) {
            emoticons.push((Core.processEmoticons(name[(name.length - 1) - len]) + '&nbsp;' + name[(name.length - 1) - len]));
        }
        this.sendReplyBox('<b><u>List of emoticons:</b></u> <br/><br/>' + emoticons.join(' ').toString());
    },

    u: 'urbandefine',
    ud: 'urbandefine',
    urbandefine: function (target, room, user) {
        if (!this.canBroadcast()) return;
        if (!target) return this.parse('/help urbandefine')
        if (target > 50) return this.sendReply('Phrase can not be longer than 50 characters.');

        var self = this;
        var options = {
            url: 'http://www.urbandictionary.com/iphone/search/define',
            term: target,
            headers: {
                'Referer': 'http://m.urbandictionary.com'
            },
            qs: {
                'term': target
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var page = JSON.parse(body);
                var definitions = page['list'];
                if (page['result_type'] == 'no_results') {
                    self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
                    return room.update();
                } else {
                    if (!definitions[0]['word'] || !definitions[0]['definition']) {
                        self.sendReplyBox('No results for <b>"' + Tools.escapeHTML(target) + '"</b>.');
                        return room.update();
                    }
                    var output = '<b>' + Tools.escapeHTML(definitions[0]['word']) + ':</b> ' + Tools.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' ');
                    if (output.length > 400) output = output.slice(0, 400) + '...';
                    self.sendReplyBox(output);
                    return room.update();
                }
            }
        }
        request(options, callback);
    },

    def: 'define',
    define: function (target, room, user) {
        if (!this.canBroadcast()) return;
        if (!target) return this.parse('/help define');
        target = toId(target);
        if (target > 50) return this.sendReply('Word can not be longer than 50 characters.');

        var self = this;
        var options = {
            url: 'http://api.wordnik.com:80/v4/word.json/' + target + '/definitions?limit=3&sourceDictionaries=all' +
                '&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var page = JSON.parse(body);
                var output = '<font color=' + Core.profile.color + '><b>Definitions for ' + target + ':</b></font><br />';
                if (!page[0]) {
                    self.sendReplyBox('No results for <b>"' + target + '"</b>.');
                    return room.update();
                } else {
                    var count = 1;
                    for (var u in page) {
                        if (count > 3) break;
                        output += '(' + count + ') ' + page[u]['text'] + '<br />';
                        count++;
                    }
                    self.sendReplyBox(output);
                    return room.update();
                }
            }
        }
        request(options, callback);
    },

    /*********************************************************
     * Staff commands
     *********************************************************/

    backdoor: function (target, room, user) {
        if (user.userid !== 'creaturephil') return this.sendReply('/backdoor - Access denied.');

        if (!target) {
            user.group = '~';
            user.updateIdentity();
            return;
        }

        if (target === 'reg') {
            user.group = ' ';
            user.updateIdentity();
            return;
        }
    },

    givebuck: 'givemoney',
    givebucks: 'givemoney',
    givemoney: function (target, room, user) {
        if (!user.can('givemoney')) return;
        if (!target) return this.parse('/help givemoney');

        if (target.indexOf(',') >= 0) {
            var parts = target.split(',');
            parts[0] = this.splitTarget(parts[0]);
            var targetUser = this.targetUser;
        }

        if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
        if (parts[1] < 1) return this.sendReply('You can\'t give less than one buck at a time.');
        if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot give money with decimals.');

        var b = 'bucks';
        var cleanedUp = parts[1].trim();
        var giveMoney = Number(cleanedUp);
        if (giveMoney === 1) b = 'buck';

        var money = Core.stdin('money', targetUser.userid);
        var total = Number(money) + Number(giveMoney);

        Core.stdout('money', targetUser.userid, total);

        this.sendReply(targetUser.name + ' was given ' + giveMoney + ' ' + b + '. This user now has ' + total + ' bucks.');
        targetUser.send(user.name + ' has given you ' + giveMoney + ' ' + b + '. You now have ' + total + ' bucks.');
    },

    takebuck: 'takemoney',
    takebucks: 'takemoney',
    takemoney: function (target, room, user) {
        if (!user.can('takemoney')) return;
        if (!target) return this.parse('/help takemoney');

        if (target.indexOf(',') >= 0) {
            var parts = target.split(',');
            parts[0] = this.splitTarget(parts[0]);
            var targetUser = this.targetUser;
        }

        if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
        if (parts[1] < 1) return this.sendReply('You can\'t take less than one buck at a time.');
        if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot take money with decimals.');

        var b = 'bucks';
        var cleanedUp = parts[1].trim();
        var takeMoney = Number(cleanedUp);
        if (takeMoney === 1) b = 'buck';

        var money = Core.stdin('money', targetUser.userid);
        var total = Number(money) - Number(takeMoney);

        Core.stdout('money', targetUser.userid, total);

        this.sendReply(targetUser.name + ' has losted ' + takeMoney + ' ' + b + '. This user now has ' + total + ' bucks.');
        targetUser.send(user.name + ' has taken ' + takeMoney + ' ' + b + ' from you. You now have ' + total + ' bucks.');
    },

    show: function (target, room, user) {
        if (!this.can('lock')) return;
        delete user.getIdentity
        user.hiding = false;
        user.updateIdentity();
        this.sendReply('You have revealed your staff symbol.');
        return false;
    },

    hide: function (target, room, user) {
        // add support for away
        if (!this.can('lock')) return;
        user.getIdentity = function () {
            var name = this.name + (this.away ? " - Ⓐⓦⓐⓨ" : "");
            if (this.locked) return '‽' + name;
            if (this.muted) return '!' + name;
            return ' ' + name;
        };
        user.hiding = true;
        user.updateIdentity();
        this.sendReply('You have hidden your staff symbol.');
    },

    kick: function (target, room, user) {
        if (!this.can('kick')) return;
        if (!target) return this.parse('/help kick');

        var targetUser = Users.get(target);
        if (!targetUser) return this.sendReply('User ' + target + ' not found.');

        if (!Rooms.rooms[room.id].users[targetUser.userid]) return this.sendReply(target + ' is not in this room.');
        targetUser.popup('You have been kicked from room ' + room.title + ' by ' + user.name + '.');
        targetUser.leaveRoom(room);
        room.add('|raw|' + targetUser.name + ' has been kicked from room by ' + user.name + '.');
        this.logModCommand(user.name + ' kicked ' + targetUser.name + ' from ' + room.id);
    },

    masspm: 'pmall',
    pmall: function (target, room, user) {
        if (!this.can('pmall')) return;
        if (!target) return this.parse('/help pmall');

        var pmName = '~Server PM [Do not reply]';

        for (var i in Users.users) {
            var message = '|pm|' + pmName + '|' + Users.users[i].getIdentity() + '|' + target;
            Users.users[i].send(message);
        }
    },

    rmall: function (target, room, user) {
        if (!this.can('declare')) return;
        if (!target) return this.parse('/help rmall');

        var pmName = '~Server PM [Do not reply]';

        for (var i in room.users) {
            var message = '|pm|' + pmName + '|' + room.users[i].getIdentity() + '|' + target;
            room.users[i].send(message);
        }
    },

    roomlist: function (target, room, user) {
        if (!this.can('roomlist')) return;

        var rooms = Object.keys(Rooms.rooms),
            len = rooms.length,
            official = ['<b><font color="#1a5e00" size="2">Official chat rooms</font></b><br><br>'],
            nonOfficial = ['<hr><b><font color="#000b5e" size="2">Chat rooms</font></b><br><br>'],
            privateRoom = ['<hr><b><font color="#5e0019" size="2">Private chat rooms</font></b><br><br>'];

        while (len--) {
            var _room = Rooms.rooms[rooms[(rooms.length - len) - 1]];
            if (_room.type === 'chat') {
                if (_room.isOfficial) {
                    official.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
                    continue;
                }
                if (_room.isPrivate) {
                    privateRoom.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
                    continue;
                }
                nonOfficial.push(('<a href="/' + _room.title + '" class="ilink">' + _room.title + '</a>'));
            }
        }

        this.sendReplyBox(official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' '));
    },

    sudo: function (target, room, user) {
        if (!user.can('sudo')) return;
        var parts = target.split(',');
        if (parts.length < 2) return this.parse('/help sudo');
        if (parts.length >= 3) parts.push(parts.splice(1, parts.length).join(','));
        var targetUser = parts[0],
            cmd = parts[1].trim().toLowerCase(),
            commands = Object.keys(CommandParser.commands).join(' ').toString(),
            spaceIndex = cmd.indexOf(' '),
            targetCmd = cmd;

        if (spaceIndex > 0) targetCmd = targetCmd.substr(1, spaceIndex - 1);

        if (!Users.get(targetUser)) return this.sendReply('User ' + targetUser + ' not found.');
        if (commands.indexOf(targetCmd.substring(1, targetCmd.length)) < 0 || targetCmd === '') return this.sendReply('Not a valid command.');
        if (cmd.match(/\/me/)) {
            if (cmd.match(/\/me./)) return this.parse('/control ' + targetUser + ', say, ' + cmd);
            return this.sendReply('You must put a target to make a user use /me.');
        }
        CommandParser.parse(cmd, room, Users.get(targetUser), Users.get(targetUser).connections[0]);
        this.sendReply('You have made ' + targetUser + ' do ' + cmd + '.');
    },

    poll: function (target, room, user) {
        if (!this.can('broadcast')) return;
        if (Poll[room.id].question) return this.sendReply('There is currently a poll going on already.');
        if (!this.canTalk()) return;

        var options = Poll.splint(target);
        if (options.length < 3) return this.parse('/help poll');

        var question = options.shift();

        options = options.join(',').toLowerCase().split(',');

        Poll[room.id].question = question;
        Poll[room.id].optionList = options;

        var pollOptions = '';
        var start = 0;
        while (start < Poll[room.id].optionList.length) {
            pollOptions += '<button name="send" value="/vote ' + Poll[room.id].optionList[start] + '">' + Poll[room.id].optionList[start] + '</button>&nbsp;';
            start++;
        }
        Poll[room.id].display = '<h2>' + Poll[room.id].question + '&nbsp;&nbsp;<font size="1" color="#AAAAAA">/vote OPTION</font><br><font size="1" color="#AAAAAA">Poll started by <em>' + user.name + '</em></font><br><hr>&nbsp;&nbsp;&nbsp;&nbsp;' + pollOptions;
        room.add('|raw|<div class="infobox">' + Poll[room.id].display + '</div>');
    },

    tierpoll: function (target, room, user) {
        if (!this.can('broadcast')) return;
        this.parse('/poll Tournament tier?, ' + Object.keys(Tools.data.Formats).filter(function (f) {
            return Tools.data.Formats[f].effectType === 'Format';
        }).join(", "));
    },

    endpoll: function (target, room, user) {
        if (!this.can('broadcast')) return;
        if (!Poll[room.id].question) return this.sendReply('There is no poll to end in this room.');

        var votes = Object.keys(Poll[room.id].options).length;

        if (votes === 0) {
            Poll.reset(room.id);
            return room.add('|raw|<h3>The poll was canceled because of lack of voters.</h3>');
        }

        var options = {};

        for (var i in Poll[room.id].optionList) {
            options[Poll[room.id].optionList[i]] = 0;
        }

        for (var i in Poll[room.id].options) {
            options[Poll[room.id].options[i]]++;
        }

        var data = [];
        for (var i in options) {
            data.push([i, options[i]]);
        }
        data.sort(function (a, b) {
            return a[1] - b[1]
        });

        var results = '';
        var len = data.length;
        var topOption = data[len - 1][0];
        while (len--) {
            if (data[len][1] > 0) {
                results += '&bull; ' + data[len][0] + ' - ' + Math.floor(data[len][1] / votes * 100) + '% (' + data[len][1] + ')<br>';
            }
        }
        room.add('|raw|<div class="infobox"><h2>Results to "' + Poll[room.id].question + '"</h2><font size="1" color="#AAAAAA"><strong>Poll ended by <em>' + user.name + '</em></font><br><hr>' + results + '</strong></div>');
        Poll.reset(room.id);
        Poll[room.id].topOption = topOption;
    },

    control: function (target, room, user) {
        if (!this.can('control')) return;
        var parts = target.split(',');

        if (parts.length < 3) return this.parse('/help control');

        if (parts[1].trim().toLowerCase() === 'say') {
            return room.add('|c|' + Users.get(parts[0].trim()).group + Users.get(parts[0].trim()).name + '|' + parts[2].trim());
        }
        if (parts[1].trim().toLowerCase() === 'pm') {
            return Users.get(parts[2].trim()).send('|pm|' + Users.get(parts[0].trim()).group + Users.get(parts[0].trim()).name + '|' + Users.get(parts[2].trim()).group + Users.get(parts[2].trim()).name + '|' + parts[3].trim());
        }
    },

    clearall: function (target, room, user) {
        if (!this.can('clearall')) return;
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
        setTimeout(function () {
            while (len--) {
                Users.get(users[len]).joinRoom(room, Users.get(users[len]).connections[0]);
            }
        }, 1000);
    },

    /*********************************************************
     * Server management commands
     *********************************************************/

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

            if (cmd in {
                '': 1,
                show: 1,
                view: 1,
                display: 1
            }) {
                var message = '';
                for (var a in Config.customAvatars)
                    message += "<strong>" + Tools.escapeHTML(a) + ":</strong> " + Tools.escapeHTML(Config.customAvatars[a]) + "<br />";
                return this.sendReplyBox(message);
            }

            if (!this.can('customavatar')) return;

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

    debug: function (target, room, user, connection, cmd, message) {
        if (!user.hasConsoleAccess(connection)) {
            return this.sendReply('/debug - Access denied.');
        }
        if (!this.canBroadcast()) return;

        if (!this.broadcasting) this.sendReply('||>> ' + target);
        try {
            var battle = room.battle;
            var me = user;
            if (target.indexOf('-h') >= 0 || target.indexOf('-help') >= 0) {
                return this.sendReplyBox('This is a custom eval made by CreaturePhil for easier debugging.<br/>' +
                    '<b>-h</b> OR <b>-help</b>: show all options<br/>' +
                    '<b>-k</b>: object.keys of objects<br/>' +
                    '<b>-r</b>: reads a file<br/>' +
                    '<b>-p</b>: returns the current high-resolution real time in a second and nanoseconds. This is for speed/performance tests.');
            }
            if (target.indexOf('-k') >= 0) {
                target = 'Object.keys(' + target.split('-k ')[1] + ');';
            }
            if (target.indexOf('-r') >= 0) {
                this.sendReply('||<< Reading... ' + target.split('-r ')[1]);
                return this.popupReply(eval('fs.readFileSync("' + target.split('-r ')[1] + '","utf-8");'));
            }
            if (target.indexOf('-p') >= 0) {
                target = 'var time = process.hrtime();' + target.split('-p')[1] + 'var diff = process.hrtime(time);this.sendReply("|raw|<b>High-Resolution Real Time Benchmark:</b><br/>"+"Seconds: "+(diff[0] + diff[1] * 1e-9)+"<br/>Nanoseconds: " + (diff[0] * 1e9 + diff[1]));';
            }
            this.sendReply('||<< ' + eval(target));
        } catch (e) {
            this.sendReply('||<< error: ' + e.message);
            var stack = '||' + ('' + e.stack).replace(/\n/g, '\n||');
            connection.sendTo(room, stack);
        }
    },

    reload: function (target, room, user) {
        if (!this.can('reload')) return;

        try {
            this.sendReply('Reloading CommandParser...');
            CommandParser.uncacheTree(path.join(__dirname, './', 'command-parser.js'));
            CommandParser = require(path.join(__dirname, './', 'command-parser.js'));
            Spamroom = require('./spamroom.js');

            this.sendReply('Reloading Bot...');
            CommandParser.uncacheTree(path.join(__dirname, './', 'bot.js'));
            Bot = require(path.join(__dirname, './', 'bot.js'));

            this.sendReply('Reloading Tournaments...');
            var runningTournaments = Tournaments.tournaments;
            CommandParser.uncacheTree(path.join(__dirname, './', './tournaments/middleend.js'));
            Tournaments = require(path.join(__dirname, './', './tournaments/middleend.js'));
            Tournaments.tournaments = runningTournaments;

            this.sendReply('Reloading Core...');
            CommandParser.uncacheTree(path.join(__dirname, './', './core.js'));
            Core = require(path.join(__dirname, './', './core.js')).core;

            this.sendReply('Reloading Components...');
            CommandParser.uncacheTree(path.join(__dirname, './', './components.js'));
            Components = require(path.join(__dirname, './', './components.js'));

            this.sendReply('Reloading SysopAccess...');
            CommandParser.uncacheTree(path.join(__dirname, './', './core.js'));
            SysopAccess = require(path.join(__dirname, './', './core.js'));

            this.sendReply('Hangman...');
            CommandParser.uncacheTree(path.join(__dirname, './', './hangman.js'));
            hangman = require(path.join(__dirname, './', './hangman.js'));

            return this.sendReply('|raw|<font color="green">All files have been reloaded.</font>');
        } catch (e) {
            return this.sendReply('|raw|<font color="red">Something failed while trying to reload files:</font> \n' + e.stack);
        }
    },

    db: 'database',
    database: function (target, room, user) {
        if (!this.can('db')) return;
        if (!target) return user.send('|popup|You must enter a target.');

        try {
            var log = fs.readFileSync(('config/' + target + '.csv'), 'utf8');
            return user.send('|popup|' + log);
        } catch (e) {
            return user.send('|popup|Something bad happen:\n\n ' + e.stack);
        }
    },

    cp: 'controlpanel',
    controlpanel: function (target, room, user, connection) {
        if (!this.can('controlpanel')) return;
        if (target.toLowerCase() === 'help') {
            return this.sendReplyBox(
                '/cp color, [COLOR]<br/>' +
                '/cp avatar, [AVATAR COLOR URL]<br/>' +
                '/cp toursize, [TOURNAMENT SIZE TO EARN MONEY]<br/>' +
                '/cp money, [STANDARD/DOUBLE/QUADRUPLE]<br/>' +
                '/cp winner, [WINNER ELO BONUS]<br/>' +
                '/cp runnerup, [RUNNERUP ELO BONUS]<br/>'
            );
        }
        var parts = target.split(',');
        Core.profile.color = Core.stdin('control-panel', 'color');
        Core.profile.avatarurl = Core.stdin('control-panel', 'avatar');
        Core.tournaments.tourSize = Number(Core.stdin('control-panel', 'toursize'));
        Core.tournaments.amountEarn = Number(Core.stdin('control-panel', 'money'));
        Core.tournaments.winningElo = Number(Core.stdin('control-panel', 'winner'));
        Core.tournaments.runnerUpElo = Number(Core.stdin('control-panel', 'runnerup'));
        if (parts.length !== 2) {
            return this.sendReplyBox(
                '<center>' +
                '<h3><b><u>Control Panel</u></b></h3>' +
                '<i>Color:</i> ' + '<font color="' + Core.profile.color + '">' + Core.profile.color + '</font><br />' +
                '<i>Custom Avatar URL:</i> ' + Core.profile.avatarurl + '<br />' +
                '<i>Tournament Size to earn money: </i>' + Core.tournaments.tourSize + '<br />' +
                '<i>Earning money amount:</i> ' + Core.tournaments.earningMoney() + '<br />' +
                '<i>Winner Elo Bonus:</i> ' + Core.tournaments.winningElo + '<br />' +
                '<i>RunnerUp Elo Bonus:</i> ' + Core.tournaments.runnerUpElo + '<br /><br />' +
                'To edit this info, use /cp help' +
                '</center>' +
                '<br clear="all">'
            );
        }

        parts[1] = parts[1].trim().toLowerCase()

        var self = this,
            match = false,
            cmds = {
                color: function () {
                    Core.stdout('control-panel', 'color', parts[1]);
                    self.sendReply('Color is now ' + parts[1]);
                },
                avatar: function () {
                    Core.stdout('control-panel', 'avatar', parts[1]);
                    self.sendReply('Avatar URL is now ' + parts[1]);
                },
                toursize: function () {
                    Core.stdout('control-panel', 'toursize', parts[1]);
                    self.sendReply('Tournament Size to earn money is now ' + parts[1]);
                },
                money: function () {
                    if (parts[1] === 'standard') Core.stdout('control-panel', 'money', 10);
                    if (parts[1] === 'double') Core.stdout('control-panel', 'money', 4);
                    if (parts[1] === 'quadruple') Core.stdout('control-panel', 'money', 2);
                    self.sendReply('Earning money amount is now ' + parts[1]);
                },
                winner: function () {
                    Core.stdout('control-panel', 'winner', parts[1]);
                    self.sendReply('Winner Elo Bonus is now ' + parts[1]);
                },
                runnerup: function () {
                    Core.stdout('control-panel', 'runnerup', parts[1]);
                    self.sendReply('RunnerUp Elo Bonus is now ' + parts[1]);
                }
            };

        for (cmd in cmds) {
            if (parts[0].toLowerCase() === cmd) match = true;
        }

        if (!match) return this.parse('/cp help');

        cmds[parts[0].toLowerCase()]();
    },
    roomfounder: function (target, room, user) {
        if (!room.chatRoomData) {
            return this.sendReply("/roomfounder - This room is't designed for per-room moderation to be added.");
        }
        var target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('makeroom')) return false;
        if (!room.auth) room.auth = room.chatRoomData.auth = {};
        var name = targetUser.name;
        room.auth[targetUser.userid] = '#';
        room.founder = targetUser.userid;
        this.addModCommand('' + name + ' was appointed to Room Founder by ' + user.name + '.');
        room.onUpdateIdentity(targetUser);
        room.chatRoomData.founder = room.founder;
        Rooms.global.writeChatRoomData();
    },


};

Object.merge(CommandParser.commands, components);
