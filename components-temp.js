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
            var bp = Core.profile.bp(userId);
            var tourWins = Core.profile.tourWins(userId);
            var title = Core.profile.title(userId);

            if (title === 0) {
                return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, userId) + Core.profile.group(false, userId) + Core.profile.display('bp', bp) + Core.profile.display('tourWins', tourWins) + '<br clear="all">');
            }
            return this.sendReplyBox(Core.profile.avatar(false, userId) + Core.profile.name(false, target) + Core.profile.group(false, userId) + Core.profile.display('title', title) + Core.profile.display('bp', bp) + Core.profile.display('tourWins', tourWins) + '<br clear="all">');
        }

        var bp = Core.profile.bp(targetUser.userid);
        var tourWins = Core.profile.tourWins(toId(targetUser.userid));
        var title = Core.profile.title(targetUser.userid);

        if (title === 0) {
            return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.display('bp', bp) + Core.profile.display('tourWins', tourWins) + '<br clear="all">');
        }
        return this.sendReplyBox(Core.profile.avatar(true, targetUser, targetUser.avatar) + Core.profile.name(true, targetUser) + Core.profile.group(true, targetUser) + Core.profile.display('title', title) + Core.profile.display('bp', bp) + Core.profile.display('tourWins', tourWins) + '<br clear="all">');
    },

    settitle: 'title',
    title: function (target, room, user) {
        if (!target) return this.parse('/help title');
        if (!user.canTitle) return this.sendReply('You need to buy this item from the shop to use.');
        if (target.length > 60) return this.sendReply('Title cannot be over 60 characters.');

        var now = Date.now();

        if ((now - user.lastTitle) * 0.001 < 30) {
            this.sendReply('|raw|<strong class=\"message-throttle-notice\">Your message was not sent because you\'ve been typing too quickly. You must wait ' + Math.floor(
                (30 - (now - user.lastTitle) * 0.001)) + ' seconds</strong>');
            return;
        }

        user.lastTitle = now;

        target = Tools.escapeHTML(target);
        target = target.replace(/[^A-Za-z\d ]+/g, '');

        var data = Core.stdin('title', user.userid);
        if (data === target) return this.sendReply('This title is the same as your current one.');

        Core.stdout('title', user.userid, target);

        this.sendReply('Your title is now: "' + target + '"');

        user.canTitle = false;
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
        var userBP = Number(Core.stdin('bp', user.userid));
        var shop = Core.shop(false);
        var len = shop.length;
        while (len--) {
            if (target.toLowerCase() === shop[len][0].toLowerCase()) {
                var price = shop[len][2];
                if (price > userBP) return this.sendReply('You don\'t have enough Battle Points for this. You need ' + (price - userBP) + ' more Battle Points to buy ' + target + '.');
                Core.stdout('bp', user.userid, (userBP - price));
                if (target.toLowerCase() === 'title') {
                    user.canTitle = true;
                    this.sendReply('You have purchased a user title. You may now use /title now.');
                    this.parse('/help title');
                } else if (target.toLowerCase() === 'star') {
                    user.canStar = true;
                    this.sendReply('You have purchased a \u2606. You will have this until you log off for more than an hour. You may now use /star now.');
                    this.parse('/help star');
                    this.sendReply('If you do not want your \u2606 anymore, you may use /removestar to go back to your old symbol.');
                } else {
                    this.sendReply('You have purchased ' + target + '. Please contact the admin "wolf" to get ' + target + '. Use the /tell command if wolf is offline (submit "/help tell" in the chat).');
                    for (var u in Users.users) {
                        if (Users.get(u).group === '~') Users.get(u).send('|pm|' + user.group + user.name + '|' + Users.get(u).group + Users.get(u).name + '|' + 'I have bought ' + target + ' from the shop.');
                    }
                }
                room.add(user.name + ' has bought ' + target + ' from the shop.');
            }
        }
    },

    transferbattlepoints: 'transferbp',
    transferbattlepoint: 'transferbp',
    transfermoney: 'transferbp',
    transferbuck: 'transferbp',
    transferbucks: 'transferbp',
    transferbp: function (target, room, user) {
        if (!target) return this.parse('/help transferbp');
        if (!this.canTalk()) return;

        if (target.indexOf(',') >= 0) {
            var parts = target.split(',');
            parts[0] = this.splitTarget(parts[0]);
            var targetUser = this.targetUser;
        }

        if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (targetUser.userid === user.userid) return this.sendReply('You cannot transfer Battle Points to yourself.');
        if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
        if (parts[1] < 1) return this.sendReply('You can\'t transfer less than 1 Battle Point at a time.');
        if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot transfer Battle Points with decimals.');

        var userBP = Core.stdin('bp', user.userid);
        var targetBP = Core.stdin('bp', targetUser.userid);

        if (parts[1] > Number(userBP)) return this.sendReply('You cannot transfer more Battle Points than what you have.');

        var b = 'battlepoints';
        var cleanedUp = parts[1].trim();
        var transferBP = Number(cleanedUp);
        if (transferBP === 1) b = 'battlepoint';

        userBP = Number(userBP) - transferBP;
        targetBP = Number(targetBP) + transferBP;

        Core.stdout('bp', user.userid, userBP, function () {
            Core.stdout('bp', targetUser.userid, targetBP);
        });

        this.sendReply('You have successfully transferred ' + transferBP + ' ' + b + ' to ' + targetUser.name + '. You now have ' + userBP + ' Battle Points.');
        targetUser.send(user.name + ' has transferred ' + transferBP + ' ' + b + ' to you. You now have ' + targetBP + ' Battle Points.');
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

    star: function (target, room, user) {
        if (!user.canStar) return this.sendReply('You need to buy this item from the shop to use.');
        var star = '\u2606';
        user.getIdentity = function (roomid) {
            if (!roomid) roomid = 'lobby';
            var name = this.name + (this.isAway ? " - \u0410\u051d\u0430\u0443" : "");
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
            return star + name;
        };
        user.updateIdentity();
        user.canStar = false;
        user.hasStar = true;
    },

    removestar: function (target, room, user) {
        if (!user.hasStar) return this.sendReply('You don\'t have a \u2606.');
        user.getIdentity = function (roomid) {
            if (!roomid) roomid = 'lobby';
            var name = this.name + (this.isAway ? " - \u0410\u051d\u0430\u0443" : "");
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
        user.hasStar = false;
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
            emoticons.push((Core.processEmoticons(name[(name.length-1)-len]) + '&nbsp;' + name[(name.length-1)-len]));
        }
        this.sendReplyBox('<b><u>List of emoticons:</b></u> <br/><br/>' + emoticons.join(' ').toString());
    },

    u: 'urbandefine',
    ud: 'urbandefine',
    urbandefine: function (target, room, user) {
        if (!this.can('declare', null, room)) return false;
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

    givebattlepoints: 'givebp',
    givebattlepoint: 'givebp',
    givemoney: 'givebp',
    givebuck: 'givebp',
    givebucks: 'givebp',
    givebp: function (target, room, user) {
        if (!user.can('givebp')) return;
        if (!target) return this.parse('/help givebp');

        if (target.indexOf(',') >= 0) {
            var parts = target.split(',');
            parts[0] = this.splitTarget(parts[0]);
            var targetUser = this.targetUser;
        }

        if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
        if (parts[1] < 1) return this.sendReply('You can\'t give less than 1 Battle Point at a time.');
        if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot give Battle Points with decimals.');

        var b = 'battlepoints';
        var cleanedUp = parts[1].trim();
        var giveBP = Number(cleanedUp);
        if (giveBP === 1) b = 'battlepoint';

        var bp = Core.stdin('bp', targetUser.userid);
        var total = Number(bp) + Number(giveBP);

        Core.stdout('bp', targetUser.userid, total);

        this.sendReply(targetUser.name + ' was given ' + giveBP + ' ' + b + '. This user now has ' + total + ' Battle Points.');
        targetUser.send(user.name + ' has given you ' + giveBP + ' ' + b + '. You now have ' + total + ' Battle Points.');
    },

    takebattlepoints: 'takebp',
    takebattlepoint: 'takebp',
    takemoney: 'takebp',
    takebuck: 'takebp',
    takebucks: 'takebp',
    takebp: function (target, room, user) {
        if (!user.can('takebp')) return;
        if (!target) return this.parse('/help takebp');

        if (target.indexOf(',') >= 0) {
            var parts = target.split(',');
            parts[0] = this.splitTarget(parts[0]);
            var targetUser = this.targetUser;
        }

        if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (isNaN(parts[1])) return this.sendReply('Very funny, now use a real number.');
        if (parts[1] < 1) return this.sendReply('You can\'t take less than 1 Battle Point at a time.');
        if (String(parts[1]).indexOf('.') >= 0) return this.sendReply('You cannot take Battle Points with decimals.');

        var b = 'battlepoints';
        var cleanedUp = parts[1].trim();
        var takeBP = Number(cleanedUp);
        if (takeBP === 1) b = 'battlepoint';

        var bp = Core.stdin('bp', targetUser.userid);
        var total = Number(bp) - Number(takeBP);

        Core.stdout('bp', targetUser.userid, total);

        this.sendReply(targetUser.name + ' has losted ' + takeBP + ' ' + b + '. This user now has ' + total + ' Battle Points.');
        targetUser.send(user.name + ' has taken ' + takeBP + ' ' + b + ' from you. You now have ' + total + ' Battle Points.');
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
        if(!this.can('declare')) return;
        if (!target) return this.parse('/help rmall');

        var pmName = '~Server PM [Do not reply]';

        for (var i in room.users) {
            var message = '|pm|' + pmName + '|' + room.users[i].getIdentity() + '|' + target;
            room.users[i].send(message);
        }
    },

    roomlist: function (target, room, user) {
        if(!this.can('warn')) return;

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
        this.parse('/poll Tournament tier?, ' + Object.keys(Tools.data.Formats).filter(function (f) { return Tools.data.Formats[f].effectType === 'Format'; }).join(", "));
    },

    tournamentpoll: 'tourpoll',
    tourneypoll: 'tourpoll',
    tourpoll: function (target, room, user) {
        if (!this.can('poll', null, room)) return false;
        this.parse('/poll Tournament tier?, ou, ubers, uu, ru, nu, lc, monotype, random, 1v1 random, uber random, high tier random, low tier random, lc random, monotype random, hoenn random, hoenn weather random, super smash bros. random, winter wonderland, community random, furry random, metronome 3v3 random, metronome 6v6 random, doubles random, triples random, [gen 1] random');
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
        if (!this.can('clearall', null, room)) return false;
        if (room.battle) return this.sendReply('You cannot do it on battle rooms.');
        
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

    /*********************************************************
     * Server management commands
     *********************************************************/

    customavatars: 'customavatar',
    customavatar: (function () {
        try {
            const script = (function () {/*
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
            */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
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
                pendingAdds[hash] = {userid: userid, avatar: avatar};
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

            this.sendReply('Reloading Bot...');
            CommandParser.uncacheTree(path.join(__dirname, './', 'bot.js'));
            Bot = require(path.join(__dirname, './', 'bot.js'));

            this.sendReply('Reloading Tournaments...');
            var runningTournaments = Tournaments.tournaments;
            CommandParser.uncacheTree(path.join(__dirname, './', './tournaments/index.js'));
            Tournaments = require(path.join(__dirname, './', './tournaments/index.js'));
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

    cp: 'controlpanel',
    controlpanel: function (target, room, user, connection) {
        if (!this.can('controlpanel')) return;
        if (target.toLowerCase() === 'help') {
            return this.sendReplyBox(
                '/cp color, [COLOR]<br/>' +
                '/cp avatar, [AVATAR COLOR URL]<br/>' +
                '/cp toursize, [TOURNAMENT SIZE TO EARN BP]<br/>' +
                '/cp bp, [STANDARD/DOUBLE/QUADRUPLE]<br/>'
                );
        }
        var parts = target.split(',');
        Core.profile.color = Core.stdin('control-panel', 'color');
        Core.profile.avatarurl = Core.stdin('control-panel', 'avatar');
        Core.tournaments.tourSize = Number(Core.stdin('control-panel', 'toursize'));
        Core.tournaments.amountEarn = Number(Core.stdin('control-panel', 'bp'));
        if (parts.length !== 2) {
            return this.sendReplyBox(
                '<center>' +
                '<h3><b><u>Control Panel</u></b></h3>' +
                '<i>Color:</i> ' + '<font color="' + Core.profile.color + '">' + Core.profile.color + '</font><br />' +
                '<i>Custom Avatar URL:</i> ' + Core.profile.avatarurl + '<br />' +
                '<i>Tournament Size to earn Battle Points: </i>' + Core.tournaments.tourSize + '<br />' +
                '<i>Earning Battle Point amount:</i> ' + Core.tournaments.earningBP() + '<br />' +
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
                    Core.stdout('control-panel', 'color', parts[1], function () {
                        Core.profile.color = Core.stdin('control-panel', 'color');
                    });
                    self.sendReply('Color is now ' + parts[1]);
                },
                avatar: function () {
                    Core.stdout('control-panel', 'avatar', parts[1], function () {
                        Core.profile.avatarurl = Core.stdin('control-panel', 'avatar');
                    });
                    self.sendReply('Avatar URL is now ' + parts[1]);
                },
                toursize: function () {
                    Core.stdout('control-panel', 'toursize', parts[1], function () {
                        Core.tournaments.tourSize = Number(Core.stdin('control-panel', 'toursize'));
                    });
                    self.sendReply('Tournament Size to earn Battle Points is now ' + parts[1]);
                },
                bp: function () {
                    if (parts[1] === 'standard') Core.stdout('control-panel', 'bp', 10, function () {Core.tournaments.amountEarn = Number(Core.stdin('control-panel', 'bp'));});
                    if (parts[1] === 'double') Core.stdout('control-panel', 'bp', 4, function () {Core.tournaments.amountEarn = Number(Core.stdin('control-panel', 'bp'));});
                    if (parts[1] === 'quadruple') Core.stdout('control-panel', 'bp', 2, function () {Core.tournaments.amountEarn = Number(Core.stdin('control-panel', 'bp'));});
                    self.sendReply('Earning Battle Point amount is now ' + parts[1]);
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
