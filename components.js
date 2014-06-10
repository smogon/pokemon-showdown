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

/*    away: 'back',
    back: function (target, room, user, connection, cmd) {
        if (!user.away && cmd.toLowerCase() === 'back') return this.sendReply('You are not set as away.');
        user.away = !user.away;
        user.updateIdentity();
        this.sendReply("You are " + (user.away ? "now" : "no longer") + " away.");
    },

    earnbuck: 'earnmoney',
    earnbucks: 'earnmoney',
    earnmoney: function (target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<strong><u>Ways to earn money:</u></strong><br /><br /><ul><li>Follow <a href="https://github.com/CreaturePhil"><u><b>CreaturePhil</b></u></a> on Github for 5 bucks.</li><li>Star this <a href="https://github.com/CreaturePhil/Showdown-Boilerplate">repository</a> for 5 bucks. If you don\'t know how to star a repository, click <a href="http://i.imgur.com/0b9Mbff.png">here</a> to learn how.</li><li>Participate in and win tournaments.</li><br /><br />Once you done so pm an admin. If you don\'t have a Github account you can make on <a href="https://github.com/join"><b><u>here</b></u></a>.</ul>');
    }, 
*/

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
        var util = require("util"),
            http = require("http");

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

/*    atm: 'profile',
    profile: function (target, room, user) {
        if (!this.canBroadcast()) return;
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

        if (!/[0-9]/.test(target) || !target) target = -1;

        var ladder = Core.ladder(Number(target));
        if (ladder === 0) return this.sendReply('No one is ranked yet.');
        return this.sendReply('|raw|' + ladder);

    },

    shop: function (target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox(Core.shop(true));
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
*/
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

/*    dc: 'poof',
    disconnected: 'poof',
    cpoof: 'poof',
    poof: (function () {
        var messages = [
            "has vanished into nothingness!",
            "used Explosion!",
            "fell into the void.",
            "went into a cave without a repel!",
            "has left the building.",
            "was forced to give BlakJack's mom an oil massage!",
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
*/
    /*********************************************************
     * Staff commands
     *********************************************************/


    show: function (target, room, user) {
        if (!this.can('lock')) return;
        delete user.getIdentity
        user.updateIdentity();
        this.sendReply('You have revealed your staff symbol.');
        return false;
    },

    hide: function (target, room, user) {
        if (!this.can('lock')) return;
        user.getIdentity = function () {
            if (this.muted) return '!' + this.name;
            if (this.locked) return '?' + this.name;
            return ' ' + this.name;
        };
        user.updateIdentity();
        this.sendReply('You have hidden your staff symbol.');
    },

    superkick: function (target, room, user) {
        if (!this.can('hotpatch')) return;
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

    welcomemessage: function (target, room, user) {
        if (room.type !== 'chat') return this.sendReply('This command can only be used in chatrooms.');

        var index = 0,
            parts = target.split(',');
        cmd = parts[0].trim().toLowerCase();

        if (cmd in {'': 1, show: 1, view: 1, display: 1}) {
            if (!this.canBroadcast()) return;
            message = '<center><u><strong>Welcome to ' + room.title + '</strong></u><br /><br />';
            if (room.welcome && room.welcome.length > 0) {
                message += room.welcome[0];
                if (room.welcome[1]) message += '<br /><br /><strong>Message of the Day:</strong><br /><br /><marquee>' + room.welcome[1] + '</marquee>';
            } else {
                return this.sendReply('This room has no welcome message.');
            }
            message += '</center>';
            return this.sendReplyBox(message);
        }

        if (!this.can('declare', room)) return;
        if (!room.welcome) room.welcome = room.chatRoomData.welcome = [];

        var message = parts.slice(1).join(',').trim();
        if (cmd === 'new' || cmd === 'edit' || cmd === 'set') {
            if (!message) return this.sendReply('Your welcome message was empty.');
            if (message.length > 250) return this.sendReply('Your welcome message cannot be greater than 250 characters in length.');

            room.welcome[0] = message;
            Rooms.global.writeChatRoomData();
            if (cmd === 'new' || cmd === 'set') return this.sendReply('Your welcome message has been created.');
            if (cmd === 'edit') return this.sendReply('You have successfully edited your welcome mesage.');
        }
        if (cmd === 'motd') {
            if (!room.welcome[0]) return this.sendReply('You must have a welcome message first.');
            if (!message) return this.sendReply('Your motd was empty.');
            if (message.length > 100) return this.sendReply('Your motd cannot be greater than 100 characters in length.');

            room.welcome[1] = message;
            Rooms.global.writeChatRoomData();
            return this.sendReply('You have successfully added or edited your motd.');
        }
        if (cmd === 'delete') {
            if (message === 'motd') index = 1;
            if (!room.welcome[index]) return this.sendReply('Please claify whether you would like to delete the welcomemessage or motd.');

            this.sendReply(room.welcome.splice(index, 1)[0]);
            Rooms.global.writeChatRoomData();
            return this.sendReply('You have sucessfully deleted ' + message + '.');
        }
        this.sendReply("/welcomemessage [set/new/edit], [message] - Sets a new welcome message or edit the current one.");
        this.sendReply("/welcomemessage [motd], [message] - Sets a motd if a welcome message has already been set.");
        this.sendReply("/welcomemessage [delete], [welcomemessage/motd] - Deletes the welcomemessage or motd.");
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

            if (cmd in {'': 1, show: 1, view: 1, display: 1}) {
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

        var path = require("path");

        try {
            this.sendReply('Reloading CommandParser...');
            CommandParser.uncacheTree(path.join(__dirname, './', 'command-parser.js'));
            CommandParser = require(path.join(__dirname, './', 'command-parser.js'));

            this.sendReply('Reloading Bot...');
            CommandParser.uncacheTree(path.join(__dirname, './', 'bot.js'));
            Bot = require(path.join(__dirname, './', 'bot.js'));

            this.sendReply('Reloading Tournaments...');
            var runningTournaments = Tournaments.tournaments;
            CommandParser.uncacheTree(path.join(__dirname, './', './tournaments/frontend.js'));
            Tournaments = require(path.join(__dirname, './', './tournaments/frontend.js'));
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

};

Object.merge(CommandParser.commands, components);
