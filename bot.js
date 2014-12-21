/**
 * Bot
 *
 * Credits
 * CreaturePhil - Lead Development (https://github.com/CreaturePhil)
 * TalkTakesTime - Parser (https://github.com/TalkTakesTime)
 * Stevoduhhero - Battling AI (https://github.com/stevoduhhero)
 *
 * @license MIT license
 */

var config = {
    name: 'Aqua Bot',
    userid: function () {
        return toId(this.name);
    },
    group: '@',
    join: true,
    rooms: ['lobby'],
    punishvals: {
        1: 'warn',
        2: 'mute',
        3: 'hourmute',
        4: 'roomban',
        5: 'ban'
    },
    privaterooms: ['staff'],
    hosting: {},
    laddering: true,
    ladderPercentage: 70,
    debug: false
};

/**
 * On server start, this sets up fake user connection for bot and uses a fake ip.
 * It gets a the fake user from the users list and modifies it properties. In addition,
 * it sets up rooms that bot will join and adding the bot user to Users list and
 * removing the fake user created which already filled its purpose
 * of easily filling  in the gaps of all the user's property.
 */

function joinServer() {
    if (process.uptime() > 5) return; // to avoid running this function again when reloading
    var worker = new(require('./fake-process.js').FakeProcess)();
    Users.socketConnect(worker.server, undefined, '1', '76.19.156.198');

    for (var i in Users.users) {
        if (Users.users[i].connections[0].ip === '76.19.156.198') {

            var bot = Users.users[i];

            bot.name = config.name;
            bot.named = true;
            bot.renamePending = config.name;
            bot.authenticated = true;
            bot.userid = config.userid();
            bot.group = config.group;

            if (config.join === true) {
                for (var all in Rooms.rooms) {
                    if (all != 'global') {
                        bot.roomCount[all] = 1;
                    }
                }
                Users.users[bot.userid] = bot;
                for (var allRoom in Rooms.rooms) {
                    if (allRoom != 'global') {
                        Rooms.rooms[allRoom].users[Users.users[bot.userid]] = Users.users[bot.userid];
                    }
                }
            } else {
                for (var index in config.rooms) {
                    if (index != 'global') {
                        bot.roomCount[joinRooms[index]] = 1;
                    }
                }
                Users.users[bot.userid] = bot;
                for (var jIndex in config.rooms) {
                    if (jIndex != 'global') {
                        Rooms.rooms[jIndex].users[Users.users[bot.userid]] = Users.users[bot.userid];
                    }
                }
            }
            delete Users.users[i];
        }
    }
}

const ACTION_COOLDOWN = 3 * 1000;
const FLOOD_MESSAGE_NUM = 5;
const FLOOD_PER_MSG_MIN = 500; // this is the minimum time between messages for legitimate spam. It's used to determine what "flooding" is caused by lag
const FLOOD_MESSAGE_TIME = 6 * 1000;
const MIN_CAPS_LENGTH = 18;
const MIN_CAPS_PROPORTION = 0.8;

var parse = {

    chatData: {},

    processChatData: function (user, room, connection, message) {
        if (user.userid === config.userid() || (!room.users[config.userid()] && message.substr(0,5).toLowerCase() !== '.join')) return true;
        var cmds = this.processBotCommands(user, room, connection, message);
        if (cmds) return false;

        message = message.trim().replace(/ +/g, " "); // removes extra spaces so it doesn't trigger stretching
        this.updateSeen(user.userid, 'c', room.title);
        var time = Date.now();
        if (!this.chatData[user]) this.chatData[user] = {
            zeroTol: 0,
            lastSeen: '',
            seenAt: time
        };
        if (!this.chatData[user][room]) this.chatData[user][room] = {
            times: [],
            points: 0,
            lastAction: 0
        };

        this.chatData[user][room].times.push(time);

        var pointVal = 0;
        var muteMessage = '';

        // moderation for flooding (more than x lines in y seconds)
        var isFlooding = (this.chatData[user][room].times.length >= FLOOD_MESSAGE_NUM && (time - this.chatData[user][room].times[this.chatData[user][room].times.length - FLOOD_MESSAGE_NUM]) < FLOOD_MESSAGE_TIME && (time - this.chatData[user][room].times[this.chatData[user][room].times.length - FLOOD_MESSAGE_NUM]) > (FLOOD_PER_MSG_MIN * FLOOD_MESSAGE_NUM));
        if (isFlooding) {
            if (pointVal < 2) {
                pointVal = 2;
                muteMessage = ', flooding';
            }
        }
        // moderation for caps (over x% of the letters in a line of y characters are capital)
        var capsMatch = message.replace(/[^A-Za-z]/g, '').match(/[A-Z]/g);
        if (capsMatch && toId(message).length > MIN_CAPS_LENGTH && (capsMatch.length >= Math.floor(toId(message).length * MIN_CAPS_PROPORTION))) {
            if (pointVal < 1) {
                pointVal = 1;
                muteMessage = ', caps';
            }
        }
        // moderation for stretching (over x consecutive characters in the message are the same)
        var stretchMatch = message.toLowerCase().match(/(.)\1{7,}/g) || message.toLowerCase().match(/(..+)\1{4,}/g); // matches the same character (or group of characters) 8 (or 5) or more times in a row
        if (stretchMatch) {
            if (pointVal < 1) {
                pointVal = 1;
                muteMessage = ', stretching';
            }
        }
        if (pointVal > 0 && !(time - this.chatData[user][room].lastAction < ACTION_COOLDOWN)) {
            var cmd = 'mute';
            // defaults to the next punishment in config.punishVals instead of repeating the same action (so a second warn-worthy
            // offence would result in a mute instead of a warn, and the third an hourmute, etc)
            if (this.chatData[user][room].points >= pointVal && pointVal < 4) {
                this.chatData[user][room].points++;
                cmd = config.punishvals[this.chatData[user][room].points] || cmd;
            } else { // if the action hasn't been done before (is worth more points) it will be the one picked
                cmd = config.punishvals[pointVal] || cmd;
                this.chatData[user][room].points = pointVal; // next action will be one level higher than this one (in most cases)
            }
            if (config.privaterooms.indexOf(room) >= 0 && cmd === 'warn') cmd = 'mute'; // can't warn in private rooms
            // if the bot has % and not @, it will default to hourmuting as its highest level of punishment instead of roombanning
            if (this.chatData[user][room].points >= 4 && config.group === '%') cmd = 'hourmute';
            if (this.chatData[user].zeroTol > 4) { // if zero tolerance users break a rule they get an instant roomban or hourmute
                muteMessage = ', zero tolerance user';
                cmd = config.group !== '%' ? 'roomban' : 'hourmute';
            }
            if (this.chatData[user][room].points >= 2) this.chatData[user].zeroTol++; // getting muted or higher increases your zero tolerance level (warns do not)
            this.chatData[user][room].lastAction = time;
            room.add('|c|' + user.group + user.name + '|' + message);
            CommandParser.parse(('/' + cmd + ' ' + user.userid + muteMessage), room, Users.get(config.name), Users.get(config.name).connections[0]);
            return false;
        }

        return true;
    },

    updateSeen: function (user, type, detail) {
        user = toId(user);
        type = toId(type);
        if (type in {j: 1, l: 1, c: 1} && (config.rooms.indexOf(toId(detail)) === -1 || config.privaterooms.indexOf(toId(detail)) > -1)) return;
        var time = Date.now();
        if (!this.chatData[user]) this.chatData[user] = {
            zeroTol: 0,
            lastSeen: '',
            seenAt: time
        };
        if (!detail) return;
        var msg = '';
        if (type in {j: 1, l: 1, c: 1}) {
            msg += (type === 'j' ? 'joining' : (type === 'l' ? 'leaving' : 'chatting in')) + ' ' + detail.trim() + '.';
        } else if (type === 'n') {
            msg += 'changing nick to ' + ('+%@&#~'.indexOf(detail.trim().charAt(0)) === -1 ? detail.trim() : detail.trim().substr(1)) + '.';
        }
        if (msg) {
            this.chatData[user].lastSeen = msg;
            this.chatData[user].seenAt = time;
        }
    },

    processBotCommands: function (user, room, connection, message) {
        if (room.type !== 'chat' || message.charAt(0) !== '.') return;

        var cmd = '',
            target = '',
            spaceIndex = message.indexOf(' '),
            botDelay = (Math.floor(Math.random() * 6) * 1000),
            now = Date.now();

        if (spaceIndex > 0) {
            cmd = message.substr(1, spaceIndex - 1);
            target = message.substr(spaceIndex + 1);
        } else {
            cmd = message.substr(1);
            target = '';
        }
        cmd = cmd.toLowerCase();

     if (message.toLowerCase() === 'hi' > -1 || message.toLowerCase() === 'hey' > -1 || message.toLowerCase() === 'sup' > -1) {
      room.add('|c|' + config.group + config.name + '|' + 'Hey Wassup');
        }
        
        if ((message.charAt(0) === '.' && Object.keys(Bot.commands).join(' ').toString().indexOf(cmd) >= 0 && message.substr(1) !== '') && !Bot.config.debug) {

            if ((now - user.lastBotCmd) * 0.001 < 30) {
                connection.sendTo(room, 'Please wait ' + Math.floor((30 - (now - user.lastBotCmd) * 0.001)) + ' seconds until the next command.');
                return true;
            }

            user.lastBotCmd = now;
        }

        if (commands[cmd]) {
            var context = {
                sendReply: function (data) {
                    setTimeout(function () {
                        room.add('|c|' + config.group + config.name + '|' + data);
                    }, botDelay);
                },
                sendPm: function (data) {
                    var message = '|pm|' + config.group + config.name + '|' + user.group + user.name + '|' + data;
                    user.send(message);
                },
                can: function (permission) {
                    if (!user.can(permission)) {
                        setTimeout(function () {
                            connection.sendTo(room, '.' + cmd + ' - Access denied.');
                        }, botDelay);
                        return false;
                    }
                    return true;
                },
                parse: function (target) {
                    CommandParser.parse(target, room, Users.get(Bot.config.name), Users.get(Bot.config.name).connections[0]);
                },
            };

            if (typeof commands[cmd] === 'function') {
                commands[cmd].call(context, target, room, user, connection, cmd, message);
            }
        }
    },

    getTimeAgo: function (time) {
        time = Date.now() - time;
        time = Math.round(time / 1000); // rounds to nearest second
        var seconds = time % 60;
        var times = [];
        if (seconds) times.push(String(seconds) + (seconds === 1 ? ' second' : ' seconds'));
        var minutes, hours, days;
        if (time >= 60) {
            time = (time - seconds) / 60; // converts to minutes
            minutes = time % 60;
            if (minutes) times = [String(minutes) + (minutes === 1 ? ' minute' : ' minutes')].concat(times);
            if (time >= 60) {
                time = (time - minutes) / 60; // converts to hours
                hours = time % 24;
                if (hours) times = [String(hours) + (hours === 1 ? ' hour' : ' hours')].concat(times);
                if (time >= 24) {
                    days = (time - hours) / 24; // you can probably guess this one
                    if (days) times = [String(days) + (days === 1 ? ' day' : ' days')].concat(times);
                }
            }
        }
        if (!times.length) times.push('0 seconds');
        return times.join(', ');
    }

};

var commands = {

    guide: function (target, room, user) {
        var commands = Object.keys(Bot.commands);
        commands = commands.join(', ').toString();

        this.sendReply('List of bot commands: ' + commands);
    },

    say: function (target, room, user) {
        if (!this.can('say')) return;
        this.sendReply(target);
    },

    tell: function (target, room, user) {
        if (!this.can('tell')) return;
        var parts = target.split(',');
        if (parts.length < 2) return;
        this.parse('/tell ' + toId(parts[0]) + ', ' + Tools.escapeHTML(parts[1]));
        this.sendReply('Message sent to ' + parts[0] + '.');
    },

    penislength: function (target, room, user) {
        this.sendReply('8.5 inches from the base. Perv.');
    },

    seen: function (target, room, user, connection) {
        if (!target) return;
        if (!toId(target) || toId(target).length > 18) return connection.sendTo(room, 'Invalid username.');
        if (!parse.chatData[toId(target)] || !parse.chatData[toId(target)].lastSeen) {
            return this.sendPm('The user ' + target.trim() + ' has never been seen chatting in rooms.');
        }
        return this.sendPm(target.trim() + ' was last seen ' + parse.getTimeAgo(parse.chatData[toId(target)].seenAt) + ' ago, ' + parse.chatData[toId(target)].lastSeen);
    },

    salt: function (target, room, user) {
        if (!global.salt) global.salt = 0;
        salt++;
        this.sendReply(salt + '% salty.');
    },

    whois: (function () {
        var reply = [
            "Just another Pokemon Showdown user",
            "A very good competetive pokemon player",
            "A worthy opponent",
            "Generally, a bad user",
            "Generally, a good user",
            "Someone who is better than you",
            "An amazing person",
            "A beautiful person",
            "A person who is probably still a virgin",
            "A leader",
            "A lord helix follower",
            "An annoying person",
            "A person with a salty personality",
            "A Coffee Addict",
            "A Mediocre Player",
        ];

        return function (target, room, user) {
            if (!target) return;
            var message = reply[Math.floor(Math.random() * reply.length)];

            target = toId(target);

            if (target === 'creaturephil') message = 'An experienced **coder** for pokemon showdown. He has coded for over 5 servers such as kill the noise, moxie, aerdeith, nova, etc. Please follow him on github: https://github.com/CreaturePhil';
            if (target === config.userid()) message = 'That\'s me.';
            if (target === 'zarel') message = 'Pokemon Showdown Creator';
            if (target === 'stevoduhhero') message = 'STEVO DUH GOD DAMN HERO! Respect him!';
            if (target === 'rickycocaine') message = 'RICKY COCAAAAAAAINE﻿';
            if (target === 'blakjack') message = 'I\'m better than you and you know it! BITCH!';

            this.sendReply(message);
        };
    })(),

    helix: (function () {
        var reply = [
            "Signs point to yes.",
            "Yes.",
            "Reply hazy, try again.",
            "Without a doubt.",
            "My sources say no.",
            "As I see it, yes.",
            "You may rely on it.",
            "Concentrate and ask again.",
            "Outlook not so good.",
            "It is decidedly so.",
            "Better not tell you now.",
            "Very doubtful.",
            "Yes - definitely.",
            "It is certain.",
            "Cannot predict now.",
            "Most likely.",
            "Ask again later.",
            "My reply is no.",
            "Outlook good.",
            "Don't count on it."
        ];

        return function (target, room, user) {
            if (!target) return;
            var message = reply[Math.floor(Math.random() * reply.length)];

            if(!this.can('broadcast')) this.sendPm(message);
            else room.add(message);
        };
    })(),
      joke: (function () {
        var reply = [
        ];

        return function (target, room, user) {
            if (!target) return;
            var message = reply[Math.floor(Math.random() * reply.length)];
         
            if(!this.can('broadcast')) this.sendPm(message);
            else room.add(message);
        };
    })(),
    maketournament: function (target, room, user) {
        if (!this.can('maketournament')) return;
        if (Tournaments.tournaments[room.id]) return this.sendReply('A tournament is already running in the room.');

        var parts = target.split(','),
            self = this,
            counter = 1;

        if (parts.length < 2 || Tools.getFormat(parts[0]).effectType !== 'Format' || !/[0-9]/.test(parts[1])) return this.sendPm('Correct Syntax: !maketournament [tier], [time/amount of players]');

        if (parts[1].indexOf('minute') >= 0) {
            var time = Number(parts[1].split('minute')[0]);

            this.parse('/tour create ' + parts[0] + ', elimination');
            this.sendReply('**You have ' + time + ' minute' + parts[1].split('minute')[1] + ' to join the tournament.**');

            var loop = function () {
                setTimeout(function () {
                    if (!Tournaments.tournaments[room.id]) return;
                    if (counter === time) {
                        if (Tournaments.tournaments[room.id].generator.users.size < 2) {
                            self.parse('/tour end');
                            return self.sendReply('**The tournament was canceled because of lack of players.**');
                        }
                        return self.parse('/tour start');
                    }
                    if ((time - counter) === 1) {
                        self.sendReply('**You have ' + (time - counter) + ' minute to sign up for the tournament.**');
                    } else {
                        self.sendReply('**You have ' + (time - counter) + ' minutes to sign up for the tournament.**');
                    }
                    counter++;
                    if (!Tournaments.tournaments[room.id].isTournamentStarted) loop();
                }, 1000 * 60);
            };
            loop();
            return;
        }
        if (Number(parts[1]) < 2) return;
        parts[1] = parts[1].replace(/[^0-9 ]+/g, '');
        this.parse('/tour create ' + parts[0] + ', elimination');
        this.sendReply('**The tournament will begin when ' + parts[1] + ' players join.**');
        var playerLoop = function () {
            setTimeout(function () {
                if (!Tournaments.tournaments[room.id]) return;
                if (Tournaments.tournaments[room.id].generator.users.size === Number(parts[1])) {
                    self.parse('/tour start');
                }
                playerLoop();
            }, 1000 * 15);
        };
        playerLoop();
    },

    hosttournament: function (target, room, user) {
        if (!this.can('hosttournament')) return;
        if (target.toLowerCase() === 'end') {
            if (!Bot.config.hosting[room.id]) return this.sendPm('I\'m not hosting tournaments.');
            Bot.config.hosting[room.id] = false;
            return this.sendReply('I will now stop hosting tournaments.');
        }
        if (Bot.config.hosting[room.id]) return this.sendReply('I\'m already hosting tournaments.');

        Bot.config.hosting[room.id] = true
        this.sendReply('**I will now be hosting tournaments.**');

        var self = this,
            _room = room,
            _user = user;

        var poll = function () {
            if (!Bot.config.hosting[_room.id]) return;
            setTimeout(function () {
                if (Poll[_room.id].question) self.parse('/endpoll');

                self.parse('/poll Tournament tier?, ' + Object.keys(Tools.data.Formats).filter(function (f) { return Tools.data.Formats[f].effectType === 'Format'; }).join(", "));
                setTimeout(function () {
                    self.parse('/endpoll');
                    Bot.commands.maketournament.call(self, (Poll[_room.id].topOption + ', 2 minute'), _room, _user);
                }, 1000 * 60 * 2);
            }, 1000 * 5);
        };

        var loop = function () {
            setTimeout(function () {
                if (!Tournaments.tournaments[_room.id] && !Poll[_room.id].question) poll();
                if (Bot.config.hosting[_room.id]) loop();
            }, 1000 * 60);
        };

        poll();
        loop();
    },

    join: function (target, room, user, connection) {
        if (!user.can('kick')) return;
        if (!target || !Rooms.get(target.toLowerCase())) return;
        if (Rooms.get(target.toLowerCase()).users[Bot.config.name]) return this.sendPm('I\'m already in this room.');
        Users.get(Bot.config.name).joinRoom(Rooms.get(target.toLowerCase()));
        var botDelay = (Math.floor(Math.random() * 6) * 1000)
        setTimeout(function() {
            connection.sendTo(room, Bot.config.name + ' has join ' +  target + ' room.');
        }, botDelay);
    },

    leave: function (target, room, user, connection) {
        if (!user.can('kick')) return;
        if (!target || !Rooms.get(target.toLowerCase())) return;
        Users.get(Bot.config.name).leaveRoom(Rooms.get(target.toLowerCase()));
        var botDelay = (Math.floor(Math.random() * 6) * 1000)
        setTimeout(function() {
            connection.sendTo(room, Bot.config.name + ' has left ' +  target + ' room.');
        }, botDelay);
    },

    rps: function (target, room, user) {
        if (!target) return;
        var options = ['rock', 'paper', 'scissors'],
            rng = options[Math.floor(Math.random() * options.length)],
            target = toId(target);

        if (rng === target) return this.sendReply('I chose ' + rng + '. The result is a tie!');
        if (rng === options[0]) {
            if (target === options[1]) return this.sendReply('I chose ' + rng + '. ' + user.name + ' wins!');
            if (target === options[2]) return this.sendReply('I chose ' + rng + '. I win and ' + user.name + ' loses!');
        }
        if (rng === options[1]) {
            if (target === options[2]) return this.sendReply('I chose ' + rng + '. ' + user.name + ' wins!');
            if (target === options[0]) return this.sendReply('I chose ' + rng + '. I win and ' + user.name + ' loses!');
        }
        if (rng === options[2]) {
            if (target === options[0]) return this.sendReply('I chose ' + rng + '. ' + user.name + ' wins!');
            if (target === options[1]) return this.sendReply('I chose ' + rng + '. I win and ' + user.name + ' loses!');
        }
    },

};

exports.joinServer = joinServer;
exports.config = config;
exports.parse = parse;
exports.commands = commands;

// Battling AI
exports.teams=new Object;var fs=require("fs");fs.readFile("./config/bot-teams.json",function(e,t){if(e)return;t=""+t;exports.teams=JSON.parse(t)});exports.addTeam=function(e,t){if(t&&t.length&&typeof t=="string"){if(!Bot.teams[e])Bot.teams[e]=new Array;Bot.teams[e].push(t);fs.writeFile("./config/bot-teams.json",JSON.stringify(Bot.teams))}};exports.randomTeam=function(e){if(e.split("random").length-1>0)return"";var t;if(Bot.teams[e])t=Bot.teams[e][Math.floor(Math.random()*Bot.teams[e].length)];if(!t)t="";return t};exports.booty={addBattle:function(e,t){Bot.booty.battles["battle-"+e.toLowerCase().replace(/[^a-z0-9]+/g,"")+"-"+(Rooms.global.lastBattle+1)]={booty:{user:Users.get(Bot.config.name),exposed:[{},{},{},{},{},{}]},opp:{user:t,exposed:[{},{},{},{},{},{}]}}},battles:new Object,check:function(){global.bootytimeout=setTimeout(function(){if(!Bot.booty.battles){Bot.booty.check();return}for(var e in Bot.booty.battles){if(Bot.booty.battles[e]){var t=Rooms.rooms[e];if(t){var n=t.battle;if(n){n=n.field;if(n[toId(Bot.config.name)])if(n[toId(Bot.config.name)].side)if(n[toId(Bot.config.name)].side.pokemon)if(n[toId(Bot.config.name)].side.pokemon[0].condition.charAt(0)=="0")Bot.booty.forceSwitch(e);if(n[toId(Bot.config.name)])if(n[toId(Bot.config.name)].forceSwitch)Bot.booty.forceSwitch(e)}}}}Bot.booty.check()},2e3)},forceSwitch:function(e){var t;if(Rooms.rooms[e])t=Rooms.rooms[e];if(!t)return;var n=Bot.booty.battles[t.id];var r=t.battle.field,i=r[toId(Bot.config.name)].side.pokemon;var s=i.length;if(!o){var o=new Array;for(var u=0;u<s;u++)o.push(u)}var a=Math.floor(Math.random()*s);while(a==1&&o.indexOf(a)==-1&&i[a].condition.charAt(0)=="0")a=Math.floor(Math.random()*s);t.decision(Users.get(toId(Bot.config.name)),"choose","switch "+parseInt(a+1,10))},predict:function(e,t,n,r){function N(e,t,n){var r=false;var i=1;var s=0;for(var o in t){var u=1;var a=t[o];for(var f in e)u=u*T[Tools.data.TypeChart[e[f]].damageTaken[a]];if(u>=2)r=true;i=i*u;if(s<u)s=u}if(n){if(n.total)return i;else if(n.best)return s}return r}function C(e,t){var n=e.baseStats;var r=0;for(var i in n)r+=n[i];var s=e.abilities;var o=e.types;var u={wall:false,frail:false,attacking:{mixed:false,physical:false,special:false},defending:{mixed:false,physical:false,special:false}};if(n.hp<100)u.frail=true;if((n.hp+n.def+n.spd)/r>.474)u.wall=true;var a=n.atk+n.spa;var f=n.atk/a;var l=n.spa/a;if(12.75>Math.abs(f-l)*100){u.attacking.mixed=true;u.attacking.physical=true;u.attacking.special=true}else{if(f>l)u.attacking.physical=true;if(l>f)u.attacking.special=true}var c=n.def+n.spd;var h=n.def/c;var p=n.spd/c;if(12.75>Math.abs(h-p)*100){if(n.def>=75)u.defending.physical=true;if(n.spd>=75)u.defending.special=true;if(n.def>=75&&n.spd>=75)u.defending.mixed=true}else{if(h>p)if(n.def>=75)u.defending.physical=true;if(p>h)if(n.spd>=75)u.defending.special=true}if(u.wall||u.tank)u.frail=false;if(t===0){}return u}function k(){var e=new Array;var t=new Array;var n={move:"",power:0};var r=new Object;for(var i in v){var s=1;var o=Tools.data.Movedex[toId(v[i])];var u=o.type;for(var i in E.types)s=s*T[Tools.data.TypeChart[E.types[i]].damageTaken[u]];var c=a[0].baseAbility;var h=a[0].item;if(c=="thickfat"&&(u=="Fire"||u=="Ice"))s=s*.5;if((h=="airballoon"||c=="levitate")&&u=="Ground")s=0;var p=1;if(w.types.indexOf(u)!=-1)p=1.5;var d=s*o.basePower*p;e.push(s);t.push(d);if(d>n.power)n={move:o.name,power:d,info:v[i]};if(o.category=="Status"){r[o.id]=v[i]}}var m,g;var y="";if(f[0].item.split("ite").length-1>0&&f[0].details.split("-mega").length-1==0)y=" mega";if(m&&!g){}else{}return"move "+n.move+y+"|"+l}function L(){return A()}function A(){function n(e,t){var n=0;if(e.bestmovepower>t)n++;if(e.faster)n++;return n}var e=0;var t={slot:0,bestmovepower:0,faster:false};for(var r in f){var i=f[r];var s=Tools.data.Pokedex[toId(i.details.split(",")[0])];if(i.condition.charAt(0)!="0"){e++;var o=new Array;for(var u in i.moves)o[u]=i.moves[u].replace(new RegExp("[0-9]","g"),"");var a=new Array;for(var u in o)a.push(Tools.data.Movedex[toId(o[u])].type);var l=false;if(s.baseStats.spe>E.baseStats.spe)l=true;var c=0;for(var h in o){var p=1;var d=Tools.data.Movedex[toId(o[h])];var v=d.type;for(var m in E.types)p=p*T[Tools.data.TypeChart[E.types[m]].damageTaken[v]];var g=1;if(s.types.indexOf(v)!=-1)g=1.5;var y=p*d.basePower*g;if(y>c)c=y}var b={slot:r,bestmovepower:c,faster:l};if(n(t,b.bestmovepower)<n(b,t.bestmovepower))t=b}}t.slot++;if(e==1||t.slot==1)k();return"switch "+t.slot}function O(){var e=false;var t=false;var n=E.baseStats.spe;var r=w.baseStats.spe;if(n>r)t=true;var i=N(w.types,E.types);var s=N(E.types,w.types);var o=new Array;for(var u in v)o.push(Tools.data.Movedex[toId(v[u].move)].type);var a=N(E.types,o);if(!(!t&&i&&a&&x.frail)){if(t&&S.frail)e=true;if(t&&i)e=true;if(i)e=true}if(x.wall&&S.wall)e=1;if(e===true){var f=L();if(f.replace(/^\D+/g,"")!=1)return f}else if(e==1)A();return k()}var i;var s={change:false};var o=Users.get(Bot.config.name);if(!t.battle.field||!o)return false;if(!t.battle.field[o.userid])return false;var u=t.battle.field,a=u[n.userid].side.pokemon,f=u[o.userid].side.pokemon;if(a[0].condition.charAt(0)=="0"&&f[0].condition.charAt(0)!="0")return false;if(f[0].condition.charAt(0)=="0")s.change=true;var l=u[n.userid].rqid;var c=Bot.booty.battles[t.id];c.turn=l;if(r=="team"){var h=f.length;var p=Math.floor(Math.random()*h);t.decision(o,"choose","team "+p+"|"+l);return false}if(!u[o.userid]){return false}if(!u[o.userid].active){return false}var d=u[o.userid].active[0].moves;var v=new Array;for(var m in d){var g=d[m];if(!g.disabled&&g.pp)v.push(g)}var y=a[0].details.split(",")[0];var b=f[0].details.split(",")[0];var w=Tools.data.Pokedex[toId(b)];var E=Tools.data.Pokedex[toId(y)];var S=C(w,0);var x=C(E);var T=[1,2,.5,0];switch(r){case"switch":case"move":case"choose":if(!s.change){var M=u[toId(Bot.config.name)].active;if(!M)M=false;else M=M[0].trapped;if(M){i=k()}else{i=O()}}else{i=A()}t.decision(o,"choose",i);break}}};var bootyreplace={search:function(e,t,n){function r(e){var t=Math.floor(Math.random()*100)+1;if(t>e)return false;return true}if(!Bot.config.laddering)return;if(r(Bot.config.ladderPercentage))return;if(!toId(e))return false;var i=toId(e);var s=true;var o=Tools.fastUnpackTeam(n.team);var u=TeamValidator.validateTeamSync(i,o);if(u&&u.length)s=false;if((e=="ou"||e.split("random").length-1>0)&&r(100)&&s){Bot.booty.addBattle(e,n);Rooms.global.startBattle(Users.get(Bot.config.name),n,e,true,Bot.randomTeam(e),n.team);Rooms.global.cancelSearch(n);return false}if(e){if(Config.pmmodchat){var a=n.group;if(Config.groupsranking.indexOf(a)<Config.groupsranking.indexOf(Config.pmmodchat)){var f=Config.groups[Config.pmmodchat].name||Config.pmmodchat;this.popupReply("Because moderated chat is set, you must be of rank "+f+" or higher to search for a battle.");return false}}Rooms.global.searchBattle(n,e);if(e=="ou"||e.split("random").length-1>0){Users.get(Bot.config.name).team=Bot.randomTeam(e);Bot.booty.addBattle(e,n);Users.get(Bot.config.name).prepBattle(e,"search",null,Rooms.global.finishSearchBattle.bind(Rooms.global,Users.get(Bot.config.name),e))}}else{Rooms.global.cancelSearch(n)}},challenge:function(e,t,n,r){e=this.splitTarget(e);var i=this.targetUser;if(!i||!i.connected){return this.popupReply("The user '"+this.targetUsername+"' was not found.")}if(i.blockChallenges&&!n.can("bypassblocks",i)){return this.popupReply("The user '"+this.targetUsername+"' is not accepting challenges right now.")}if(Config.pmmodchat){var s=n.group;if(Config.groupsranking.indexOf(s)<Config.groupsranking.indexOf(Config.pmmodchat)){var o=Config.groups[Config.pmmodchat].name||Config.pmmodchat;this.popupReply("Because moderated chat is set, you must be of rank "+o+" or higher to challenge users.");return false}}n.prepBattle(e,"challenge",r,function(t){if(t)n.makeChallenge(i,e)});if(this.targetUsername==Bot.config.name){if(!global.bootytimeout)Bot.booty.check();var u=Users.get(Bot.config.name);u.prepBattle(e,"challenge",u.connections[0],function(e){if(e)u.acceptChallengeFrom(n.userid)});Bot.booty.addBattle(e,n);if(e.split("random").length-1>0){}else{if(n.team!=undefined&&n.team!="")Bot.addTeam(e,n.team);var a=Bot.randomTeam(e);if(a==""||!a){a=n.team;if(a==undefined||a=="")a=""}u.team=a}}},move:function(e,t,n){if(!t.decision)return this.sendReply("You can only do this in battle rooms.");t.decision(n,"choose","move "+e);if(Bot.booty.battles[t.id])Bot.booty.predict(e,t,n,"move")},sw:"switch","switch":function(e,t,n){if(!t.decision)return this.sendReply("You can only do this in battle rooms.");t.decision(n,"choose","switch "+parseInt(e,10));if(Bot.booty.battles[t.id])Bot.booty.predict(e,t,n,"switch")},choose:function(e,t,n){if(!t.decision)return this.sendReply("You can only do this in battle rooms.");t.decision(n,"choose",e);if(Bot.booty.battles[t.id])Bot.booty.predict(e,t,n,"choose")},team:function(e,t,n){if(!t.decision)return this.sendReply("You can only do this in battle rooms.");t.decision(n,"choose","team "+e);if(Bot.booty.battles[t.id])Bot.booty.predict(e,t,n,"team")},part:function(e,t,n,r){if(t.id==="global")return false;var i=Rooms.get(e);if(e&&!i){return this.sendReply("The room '"+e+"' does not exist.")}n.leaveRoom(i||t,r)}};for(var i in bootyreplace)CommandParser.commands[i]=bootyreplace[i];

joinServer();
