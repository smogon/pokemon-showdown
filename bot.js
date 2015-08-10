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
name: 'Galaxy Bot',
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
* of easily filling in the gaps of all the user's property.
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
this.sendPm(message);
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
connection.sendTo(room, Bot.config.name + ' has join ' + target + ' room.');
}, botDelay);
},
leave: function (target, room, user, connection) {
if (!user.can('kick')) return;
if (!target || !Rooms.get(target.toLowerCase())) return;
Users.get(Bot.config.name).leaveRoom(Rooms.get(target.toLowerCase()));
var botDelay = (Math.floor(Math.random() * 6) * 1000)
setTimeout(function() {
connection.sendTo(room, Bot.config.name + ' has left ' + target + ' room.');
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


joinServer();
