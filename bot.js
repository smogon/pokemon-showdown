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
const botBannedWordsDataFile = './config/botbannedwords.json';
const botBannedUsersDataFile = './config/botbannedusers.json';
const progModChatDataFile = './config/progmodchat.json';
var fs = require('fs');
var defaultProgModChat = ['off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off'];

if (!fs.existsSync(botBannedWordsDataFile))
	fs.writeFileSync(botBannedWordsDataFile, '{}');
	
if (!fs.existsSync(botBannedUsersDataFile))
	fs.writeFileSync(botBannedUsersDataFile, '{}');
	
if (!fs.existsSync(progModChatDataFile))
	fs.writeFileSync(progModChatDataFile, JSON.stringify(defaultProgModChat));
	
var botBannedWords = JSON.parse(fs.readFileSync(botBannedWordsDataFile).toString());
var botBannedUsers = JSON.parse(fs.readFileSync(botBannedUsersDataFile).toString());
var progModChat = JSON.parse(fs.readFileSync(progModChatDataFile).toString());
exports.botBannedWords = botBannedWords;
exports.botBannedUsers = botBannedUsers;

var battleInProgress = {};
exports.inBattle = false;
exports.acceptChallegesDenied = function (user, format) {
	if (!(format in {'challengecupmetronome':1, 'randombattle':1, 'randomoumonotype':1, 'randominversebattle':1,'randomskybattle':1, 'randomubers':1, 'randomlc':1, 'randomcap':1, 'randomhaxmons':1})) return 'Debido a mi configuración actual, no acepto retos de formato ' + format;
	if (battleInProgress[toId(user.name)])  return 'Ya estoy en una batalla contigo, espera a que termine para retarme de nuevo.';
	if (user.can('joinbattle')) return 'auth';
	if (exports.inBattle) return 'Estoy ocupado en otra batalla, retame cuando esta termine.';
	return false;
};

exports.isBanned = function (user) {
	if (botBannedUsers[user.userid] && !user.can('staff')) return true;
	return false;
};

function writeBotData() {
	fs.writeFileSync(botBannedWordsDataFile, JSON.stringify(botBannedWords));
	fs.writeFileSync(botBannedUsersDataFile, JSON.stringify(botBannedUsers));
	fs.writeFileSync(progModChatDataFile, JSON.stringify(progModChat));
}

if (!botBannedWords.links) {
	botBannedWords = {
		chars: [],
		links: [],
		inapropiate: []
	};
	writeBotData();
}

var config = {
	name: 'BootyBot',
	userid: function () {
		return toId(this.name);
	},
	group: '#',
	customavatars: 'bot.gif',
	rooms: ['casino'],
	punishvals: {
		1: 'warn',
		2: 'mute',
		3: 'hourmute',
		4: 'hourmute',
		5: 'lock'
	},
	privaterooms: ['staff'],
	hosting: {},
	laddering: true,
	ladderPercentage: 70
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
	Users.socketConnect(worker.server, undefined, '1', '254.254.254.254');

	for (var i in Users.users) {
		if (Users.users[i].connections[0].ip === '254.254.254.254') {

			var bot = Users.users[i];

			bot.name = config.name;
			bot.named = true;
			bot.renamePending = config.name;
			bot.authenticated = true;
			bot.userid = config.userid();
			bot.group = config.group;
			bot.avatar = config.customavatars;

			if (config.join === true) {
				Users.users[bot.userid] = bot;
				for (var room in Rooms.rooms) {
					if (room != 'global'&& Rooms.rooms[room]) {
						bot.roomCount[room] = 1;
						Rooms.rooms[room].users[Users.users[bot.userid]] = Users.users[bot.userid];
					}
				}
			} else {
				Users.users[bot.userid] = bot;
				for (var index in config.rooms) {
					if (Rooms.rooms[config.rooms[index]]) {
						Users.get(config.name).joinRoom(Rooms.get(config.rooms[index]));
						//continue;
						//bot.roomCount[config.rooms[index]] = 1;
						//Rooms.rooms[config.rooms[index]].users[Users.users[bot.userid]] = Users.users[bot.userid];
					}
				}
			}
			delete Users.users[i];
		}
	}
}

function runProgModChat() {
	var timeNow = new Date();
	for (var i = 0; i < config.rooms.length; i++) {
		if (!Rooms.rooms[config.rooms[i]]) continue;
		CommandParser.parse("/modchat " + progModChat[timeNow.getHours()], Rooms.rooms[config.rooms[i]], Users.get(config.name), Users.get(config.name).connections[0]);
		Rooms.rooms[config.rooms[i]].update();
	}
};

function initProgModChat() {
	setTimeout(function () {
		runProgModChat();
	}, 1000 * 5);
	var loop = function () {
		var f = new Date();
		setTimeout(function () {
			runProgModChat();
			loop();
		}, (1000 * 3600) - (f.getMinutes() * 60 * 1000));
	};
	loop();
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
		var isPM = false;
		if (!room || !room.users) {
			isPM = true;
			room = Rooms.rooms['lobby'];
		}
		if (botBannedUsers[toId(user.name)] && !user.can('staff')) {
			CommandParser.parse(('/ban' + ' ' + user.userid + ', Ban Permanente'), room, Users.get(config.name), Users.get(config.name).connections[0]);
			return false;
		}
		if ((user.userid === config.userid() || !room.users[config.userid()]) && !isPM) return true;
		var botUser = Users.get(config.userid());
		if (!botUser || !botUser.connected || botUser.locked) return true;
		//this.sendReply('Leido mensaje de ' + user.name + ': ' + message);
		var cmds = this.processBotCommands(user, room, connection, message, isPM);
		if (isPM) return true;
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

		if (user.can('staff', room)) return true; //do not mod staff users

		var pointVal = 0;
		var muteMessage = '';
		
		//moderation for banned words
		for (var d = 0; d < botBannedWords.links.length; d++) {
			if (message.toLowerCase().indexOf(botBannedWords.links[d]) > -1) {
				if (pointVal < 5) {
					pointVal = 5;
					muteMessage = ', Contendido +18 o spam';
					break;
				}
			}
		}
		
		for (var d = 0; d < botBannedWords.chars.length; d++) {
			if (message.toLowerCase().indexOf(botBannedWords.chars[d]) > -1) {
				if (pointVal < 2) {
					pointVal = 2;
					muteMessage = ', Su mensaje contiene una frase prohibida';
					break;
				}
			}
		}
		
		for (var d = 0; d < botBannedWords.inapropiate.length; d++) {
			if (message.toLowerCase().indexOf(botBannedWords.inapropiate[d]) > -1) {
				if (pointVal < 1) {
					pointVal = 1;
					muteMessage = ', Lenguaje inapropiado';
					break;
				}
			}
		}

		// moderation for flooding (more than x lines in y seconds)
		var isFlooding = (this.chatData[user][room].times.length >= FLOOD_MESSAGE_NUM && (time - this.chatData[user][room].times[this.chatData[user][room].times.length - FLOOD_MESSAGE_NUM]) < FLOOD_MESSAGE_TIME && (time - this.chatData[user][room].times[this.chatData[user][room].times.length - FLOOD_MESSAGE_NUM]) > (FLOOD_PER_MSG_MIN * FLOOD_MESSAGE_NUM));
		if (isFlooding) {
			if (pointVal < 2) {
				pointVal = 2;
				muteMessage = ', Flood';
			}
		}
		// moderation for caps (over x% of the letters in a line of y characters are capital)
		var capsMatch = message.replace(/[^A-Za-z]/g, '').match(/[A-Z]/g);
		if (capsMatch && toId(message).length > MIN_CAPS_LENGTH && (capsMatch.length >= Math.floor(toId(message).length * MIN_CAPS_PROPORTION))) {
			if (pointVal < 1) {
				pointVal = 1;
				muteMessage = ', Uso excesivo de las mayúsculas';
			}
		}
		// moderation for stretching (over x consecutive characters in the message are the same)
		//|| message.toLowerCase().match(/(..+)\1{4,}/g
		var stretchMatch = message.toLowerCase().match(/(.)\1{15,}/g); // matches the same character (or group of characters) 8 (or 5) or more times in a row
		if (stretchMatch) {
			if (pointVal < 1) {
				pointVal = 1;
				muteMessage = ', Alargar demasiado las palabras';
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
				muteMessage = ', tolerancia cero';
				cmd = config.group !== '%' ? 'lock' : 'hourmute';
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
		if (config.privaterooms.indexOf(toId(detail)) > -1) return;
		var time = Date.now();
		if (!this.chatData[user]) this.chatData[user] = {
			zeroTol: 0,
			lastSeen: '',
			seenAt: time
		};
		if (!detail) return;
		var msg = '';
		if (type in {j: 1, l: 1, c: 1}) {
			msg += (type === 'j' ? 'uniendose a la sala' : (type === 'l' ? 'abandonado la sala' : 'Chateando en')) + ' ' + detail.trim() + '.';
		} else if (type === 'n') {
			msg += 'cambiando el nick a ' + ('+%@&#~'.indexOf(detail.trim().charAt(0)) === -1 ? detail.trim() : detail.trim().substr(1)) + '.';
		}
		if (msg) {
			this.chatData[user].lastSeen = msg;
			this.chatData[user].seenAt = time;
		}
	},

	processBotCommands: function (user, room, connection, message, isPM) {
		if (room.type !== 'chat' || message.charAt(0) !== '.') return;

		var cmd = '',
			target = '',
			spaceIndex = message.indexOf(' '),
			botDelay = (Math.floor(Math.random()) * 1000),
			now = Date.now();

		if (spaceIndex > 0) {
			cmd = message.substr(1, spaceIndex - 1);
			target = message.substr(spaceIndex + 1);
		} else {
			cmd = message.substr(1);
			target = '';
		}
		cmd = cmd.toLowerCase();

		if (message.charAt(0) === '.' && Object.keys(Bot.commands).join(' ').toString().indexOf(cmd) >= 0 && message.substr(1) !== '') {

			if ((now - user.lastBotCmd) * 0.001 < 30) {
			   // connection.sendTo(room, 'Please wait ' + Math.floor((30 - (now - user.lastBotCmd) * 0.001)) + ' seconds until the next command.');
			   // return true;
			}

			user.lastBotCmd = now;
		}

		if (commands[cmd]) {
			var context = {
				sendReply: function (data) {
					if (isPM) {
						setTimeout(function () {
					   var message = '|pm|' + config.group + config.name + '|' + user.group + user.name + '|' + data;
						user.send(message);
					}, botDelay);
					} else {
						setTimeout(function () {
						room.add('|c|' + config.group + config.name + '|' + data);
						room.update();
					}, botDelay);
					} 
				},

				sendPm: function (data) {
					//var message = '|pm|' + config.group + config.name + '|' + user.group + user.name + '|' + data;
					//user.send(message);
					setTimeout(function () {
					   var message = '|pm|' + config.group + config.name + '|' + user.group + user.name + '|' + data;
						user.send(message);
					}, botDelay);
				},
				can: function (permission) {
					if (!user.can(permission)) {
						return false;
					}
					return true;
				},
				parse: function (target) {
					CommandParser.parse(target, room, Users.get(Bot.config.name), Users.get(Bot.config.name).connections[0]);
					room.update();
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
		if (seconds) times.push(String(seconds) + (seconds === 1 ? ' segundo' : ' segundos'));
		var minutes, hours, days;
		if (time >= 60) {
			time = (time - seconds) / 60; // converts to minutes
			minutes = time % 60;
			if (minutes) times = [String(minutes) + (minutes === 1 ? ' minuto' : ' minutos')].concat(times);
			if (time >= 60) {
				time = (time - minutes) / 60; // converts to hours
				hours = time % 24;
				if (hours) times = [String(hours) + (hours === 1 ? ' hora' : ' horas')].concat(times);
				if (time >= 24) {
					days = (time - hours) / 24; // you can probably guess this one
					if (days) times = [String(days) + (days === 1 ? ' dia' : ' dias')].concat(times);
				}
			}
		}
		if (!times.length) times.push('0 segundos');
		return times.join(', ');
	},
	
	setAutomatedBattle: function (battleRoom, forced, user) {
		if (!battleRoom) return;
		if (!forced) exports.inBattle = true;
		battleInProgress[toId(user.name)] = 1;
		var botUser = Users.get(config.userid());
		battleRoom.requestKickInactive(botUser, botUser.can('timer'));
		battleRoom.modchat = '+';
		var p1 = battleRoom.p1.userid;
		var p2 = battleRoom.p2.userid;
		var turnData;
		if (battleRoom.p2.userid === config.userid()) player = 'p2';
		var loop = function () {
			setTimeout(function () {
				if (!battleRoom) return;
				if (!battleRoom.users[p1] || !battleRoom.users[p2]) {
					battleRoom.push('Batalla interrumpida por desconexión del retador.');
					battleRoom.forfeit(botUser, false, 0);
					botUser.leaveRoom(battleRoom.id);
					if (!forced) exports.inBattle = false;
					delete battleInProgress[toId(user.name)];
					return;
				}
				if (battleRoom.battle.ended) {
					botUser.leaveRoom(battleRoom.id);
					if (!forced) exports.inBattle = false;
					delete battleInProgress[toId(user.name)];
					return;
				}
				turnData = JSON.parse(battleRoom.battle.requests[config.userid()]);
				if (turnData.forceSwitch) {
					for (var n = 0; n < 7; ++n) {
						battleRoom.decision(botUser, "choose", "switch " + n);
					}
					battleRoom.decision(botUser, "choose", "move " + Math.floor(Math.random() * 5));
				} else if (turnData.active) {
					battleRoom.decision(botUser, "choose", "move " + Math.floor(Math.random() * 5));
				}
				loop();
			}, 1000 * 5);
		};
		loop();
	}

};

var commands = {
	
	about: function (target, room, user) {
		if (!this.can('joinbattle')) return this.sendPm('Hola, soy el Bot de Viridian. Para más información sobre mi fucionamiento escribe .guia');
		this.sendReply('Hola, soy el Bot de Viridian. Para más información sobre mi fucionamiento escribe .guia');
	},
	
	info: function (target, room, user) {
		if (!this.can('joinbattle')) return this.sendPm('Hola, soy el Bot de Viridian. Para más información sobre mi fucionamiento escribe .guia');
		this.sendReply('Hola, soy el Bot de Viridian. Para más información sobre mi fucionamiento escribe .guia');
	},
	
	foro: function (target, room, user) {
		if (!this.can('joinbattle')) return this.sendPm('Foro del servidor Viridian: http://viridianshowdown.hol.es/');
		this.sendReply('Foro del servidor Viridian: http://viridianshowdown.hol.es/');
	},
	
	guia: function (target, room, user) {
		if (!this.can('joinbattle')) return this.sendPm('Guía sobre comandos y funcionamiento del Bot: http://pastebin.com/Fj1YfKd1');
		this.sendReply('Guía sobre comandos y funcionamiento del Bot: http://pastebin.com/Fj1YfKd1');
	},
	
	say: function (target, room, user) {
		if (!this.can('say')) return;
		this.sendReply(target);
	},
	
	hotpatch: function (target, room, user) {
		if (!this.can('hotpatch')) return;
		Bot = require('./bot.js');
		this.sendReply('Código del Bot actualizado.');
	},
	
	reset: function (target, room, user) {
		if (!this.can('hotpatch')) return;
		parse.chatData = {};
		this.sendReply('Datos de chat reiniciados.');
	},

	ab: function (target, room, user) {
		if (!this.can('rangeban')) return;
		if (!target) return;
		var parts = target.split(',');
		var userId;
		var bannedList = '';
		for (var n in parts) {
			userId = toId(parts[n]);
			if (botBannedUsers[userId]) {
			 this.sendPm('En usuario "' + userId + '" ya estaba en la lista negra.');
			 continue;
			}
			bannedList += '"' + userId + '", ';
			botBannedUsers[userId] = 1;
			CommandParser.parse(('/ban' + ' ' + userId + ', Ban Permanente'), room, Users.get(config.name), Users.get(config.name).connections[0]);
		}
		writeBotData();
		if (parts.length > 1) {
			this.sendReply('Los usuarios ' + bannedList + ' se han añadido a la lista negra correctamente.');
		} else {
			this.sendReply('El usuario "' + toId(target) + '" se ha añadido a la lista negra correctamente.');
		}
	},

	unab: function (target, room, user) {
		if (!this.can('rangeban')) return;
		if (!target) return;
		var parts = target.split(',');
		var userId;
		var bannedList = '';
		for (var n in parts) {
			userId = toId(parts[n]);
			if (!botBannedUsers[userId]) {
			 this.sendPm('En usuario "' + userId + '" no estaba en la lista negra.');
			 continue;
			}
			bannedList += '"' + userId + '", ';
			delete botBannedUsers[userId];
		}
		writeBotData();
		if (parts.length > 1) {
			this.sendReply('Los usuarios ' + bannedList + ' han sido eliminados de la lista negra.');
		} else {
			this.sendReply('El usuario "' + toId(target) + '" ha sido eliminado de la lista negra.');
		}
	},

	vab: function (target, room, user) {
		if (!this.can('rangeban')) return;
		var bannedList = '';
		for (var d in botBannedUsers) {
			bannedList += d + ', ';
		}
		if (bannedList === '') return this.sendPm('Lista negra vacía.');
		this.sendPm('Usuarios de la Lista negra: ' + bannedList);
	},

	banword: function (target, room, user) {
		if (!this.can('rangeban')) return;
		if (!target) return;
		var parts = target.split(',');
		var word = parts[0].toLowerCase();
		if (botBannedWords.chars.indexOf(word) > -1 || botBannedWords.links.indexOf(word) > -1 || botBannedWords.inapropiate.indexOf(word) > -1) {
			this.sendPm('La frase "' + word + '" ya estaba prohibida.');
			return;
		}
		switch (parseInt(parts[1])) {
			case 1:
				botBannedWords.inapropiate.push(word);
				break;
			case 2:
				botBannedWords.links.push(word);
				break;
			default:
				botBannedWords.chars.push(word);
		}
		writeBotData();
		this.sendReply('La frase "' + word + '" está prohibida a partir de ahora.');
	},
	
	unbanword: function (target, room, user) {
		if (!this.can('rangeban')) return;
		if (!target) return;
		var wordId = target.toLowerCase();
		if (botBannedWords.chars.indexOf(wordId) === -1 && botBannedWords.links.indexOf(wordId) === -1 && botBannedWords.inapropiate.indexOf(wordId) == -1) {
			this.sendPm('La frase "' + wordId + '" no estaba prohibida.');
			return;
		}
		var aux = [];
		if (botBannedWords.chars.indexOf(wordId) > -1) {
			for (var n = 0; n < botBannedWords.chars.length; n++) {
				if (wordId !== botBannedWords.chars[n]) aux.push(botBannedWords.chars[n]);
			}
			botBannedWords.chars = aux;
		} else if (botBannedWords.inapropiate.indexOf(wordId) > -1) {
			for (var n = 0; n < botBannedWords.inapropiate.length; n++) {
				if (wordId !== botBannedWords.inapropiate[n]) aux.push(botBannedWords.inapropiate[n]);
			}
			botBannedWords.inapropiate = aux;
		} else {
			for (var n = 0; n < botBannedWords.links.length; n++) {
				if (wordId !== botBannedWords.links[n]) aux.push(botBannedWords.links[n]);
			}
			botBannedWords.links = aux;
		}
		writeBotData();
		this.sendReply('La frase "' + wordId + '" ha dejado de estar prohibida.');
	},
	
	vbw: function (target, room, user) {
		if (!this.can('rangeban')) return;
		this.sendPm('Frases Prohibidas en Viridian. Caracteres: ' + botBannedWords.chars + " | Contenido +18: " + botBannedWords.links + "| Lenguaje inapropiado: " + botBannedWords.inapropiate);
	},

	tell: function (target, room, user) {
		if (!this.can('bottell')) return;
		var parts = target.split(',');
		if (parts.length < 2) return;
		this.parse('/tell ' + toId(parts[0]) + ', ' + Tools.escapeHTML(parts[1]));
		this.sendReply('Mensaje enviado a: ' + parts[0] + '.');
	},
	
	writecmd: function (target, room, user) {
		if (!this.can('bottell')) return;
		if (target) this.parse(target);
	},
	
	viewmodchat: function (target, room, user, connection) {
		if (!user.can('hotpatch')) return;
		var text = '';
		for (var i = 0; i < progModChat.length; i++) {
			if (i < 10) text += "0" + i + ":00 -> " + progModChat[i] + " | ";
			else text += i + ":00 -> " + progModChat[i] + " | ";
		}
		this.sendPm('**Programacion del Mod Chat:** ' + text);
	},
	
	setmodchat: function (target, room, user, connection) {
		if (!user.can('hotpatch')) return;
		if (!target) return;
		var parts = target.split(',');
		if (parts.length < 3) return;
		var h_init = parseInt(parts[0]);
		var h_end = parseInt(parts[1]);
		if (!h_init) h_init = 0;
		if (!h_end) h_end = 0;
		if (h_init > h_end || h_init < 0 || h_end < 0 || h_init > 23 || h_end > 23) return this.sendReply('Datos erroneos. Uselo asi: .setmodchat hora inicial, hora final, tipo de modchat');
		for (var i = h_init; i <= h_end; i++) {
			progModChat[i] = parts[2];
		}
		writeBotData();
		runProgModChat();
		this.sendReply('Programacion del ModChat modificada.');
	},
	
	
	whois: function (target, room, user) {
		if (!target) return;
		var shopData = Shop.getBotPhrase(target);
		if (shopData) return this.sendReply('Sobre ' + target + ': ' + shopData);
		var targetUser = Users.get(target);
		if (!targetUser) return this.sendReply('No se nada acerca de ' + toId(target) + '.');
		switch (targetUser.group) {
			case '~':
				shopData = 'Administrador del servidor de Pokespain';
				break;
			case '&':
				shopData = 'Leader del servidor de Pokespain';
				break;
			case '@':
				shopData = 'Moderador del servidor de Pokespain';
				break;
			case '%':
				shopData = 'Driver del servidor de Pokespain';
				break;
			case '+':
				shopData = 'Voiced del servidor de Pokespain';
				break;
			default:
				shopData = 'Usuario del servidor de Pokespain';
		}
		if (shopData) return this.sendReply('Sobre ' + target + ': ' + shopData );
	},

	seen: function (target, room, user, connection) {
		if (!target) return;
		if (!toId(target) || toId(target).length > 18) return connection.sendTo(room, 'Invalid username.');
		if (!parse.chatData[toId(target)] || !parse.chatData[toId(target)].lastSeen) {
			return this.sendPm('El usuario ' + target.trim() + ' no ha sido visto por aquí.');
		}
		return this.sendPm(target.trim() + ' fue visto por última vez hace ' + parse.getTimeAgo(parse.chatData[toId(target)].seenAt) + ' , ' + parse.chatData[toId(target)].lastSeen);
	},

	choose: function (target, room, user, connection) {
		if (!target) return;
		target = target.replace("/", "-");
		var parts = target.split(',');
		if (parts.length < 2) return;
		var choice = parts[Math.floor(Math.random() * parts.length)];
		if (!this.can('joinbattle')) return this.sendPm(choice);
		this.sendReply(' ' + choice);
	},

	helix: (function () {
		var reply = [
			"Las señales apuntan a que sí.",
			"Sí.",
			"Hay mucha niebla. Inténtalo de nuevo.",
			"Sin lugar a duda.",
			"Mis fuentes dicen que no.",
			"Tal y como lo veo, sí.",
			"Cuenta con ello.",
			"Concéntrate y pregunta de nuevo.",
			"No es buena idea.",
			"Definitivamente no.",
			"Mejor no quieras saber la respuesta.",
			"Muy dudoso.",
			"Sí - Definitivamente.",
			"Es cierto.",
			"No puedo predecir en este momento..",
			"Probablemente.",
			"No entiendo la pregunta.",
			"Mi respuesta es no.",
			"Es buena idea.",
			"No cuentes con ello."
		];

		return function (target, room, user) {
			if (!target) return;
			var message = reply[Math.floor(Math.random() * reply.length)];
			if (!this.can('joinbattle')) return this.sendPm(message);
			this.sendReply(message);
		};
	})(),
	
	chiste: (function () {
		var reply = [
			"- Íbamos yo y Nacho. - No hijo, íbamos Nacho y yo. - ¿Cómo? ¿entonces yo no iba?",
			"Le dice una madre a su hijo: - ¡Me ha dicho un pajarito que te drogas! - ¡La que se droga eres tu que hablas con pajaritos!.",
			"Mi mujer me ha dejado una nota en la nevera que decía: - Me voy porque esto ya no funciona. Jo, pues si llevo dos horas revisando este cacharro y enfría de lujo.",
			"¿Cómo se llama el campeón de buceo japonés?. Tokofondo. ¿Y el subcampeón?. Kasitoko.",
			"Dos amigos: - Oye, pues mi hijo en su nuevo trabajo se siente como pez en el agua. - ¿Qué hace? - Nada...",
			"- Hola ¿te llamas google? - No, ¿por qué? - Porque tienes todo lo que busco, nena. - ¿Y tú te llamas yahoorespuestas? - No, ¿por qué? - Porque haces preguntas estúpidas...",
			"- Papá, ¿qué se siente tener un hijo tan guapo?. - No sé hijo, pregúntale a tu abuelo...",
			"Estaba una pizza llorando en el cementerio, llega otra pizza y le dice: - ¿Era familiar? - No, era mediana..",
			"- Paco ¿dónde estuviste? - En una clínica donde te quitan las ganas de fumar. - ¡Pero si estás fumando! - Ya... pero sin ganas.",
			"- ¿Bailamos? - Claro. ¿Pero quién saca a mi amiga? - Ahhh, por eso no te preocupes. ¡SEGURIDAAAAD!",
			"- ¡Señorita!¡Eh, usted, la rubia! - ¿Si, es a mi? - ¡Le comunicamos que su avión viene demorado!. - Hay qué lindo, ese es mi color favorito...",
			"Marcelo estaba trabajando, cuando su jefe va y le pregunta: - ¿Oiga, no piensa ir al velatorio de su suegra?. Y él le contesta: - No jefe, primero el trabajo, y después la diversión.",
			"- Tía Teresa, ¿para qué te pintas? - Para estar más guapa. - ¿Y tarda mucho en hacer efecto?",
			"- Te vendo un caballo. - Y yo, ¿para qué quiero un caballo vendado?.",
			"- Capitán, ¿Puedo desembarcar por la izquierda? – Se dice por babor... – Por babor Capitán, ¿Puedo desembarcar por la izquierda?",
			"- Oye, dile a tu hermana que no está gorda, que sólo es talla \"L\" fante...",
			"- Quiero decirle que estoy enamorado de su hija, y no es por el dinero. - ¿Y de cuál de las cuatro? - Ah pues.., de cualquiera.",
			"Dos amigos charlando: - ¿Y tú a quién votarás en las próximas elecciones? - Yo a Alibaba y los 40 ladrones. - ¿Y eso? - Para asegurarme de que solo sean 40.",
			"- Camarero, camarero ¿tiene ancas de rana?. - Sí. - ¡Entonces pegue un saltito y tráigame un café!.",
			"- Mi amor, estoy embarazada. ¿Qué te gustaría que fuera? - ¿Una broma?.",
			"Un codicioso estaba hablando con Dios y le pregunta:- Dios, ¿Cuánto es para ti mil años? Y Dios le contesta:- Un segundo.- ¿Y un millón de pesos?. Y Dios le contesta: - Un centavo.  Entonces el codicioso le dice: ¿Me das un un centavo?. A lo que Dios le contesta:- Espérate un segundo.",
			"Jaimito le pregunta a la maestra: Maestra, ¿usted me castigaría por algo que yo no hice? Claro que no, Jaimito. Ahh, pues que bueno, porque yo no hice mi tarea"
		];

		return function (target, room, user) {
			var message = reply[Math.floor(Math.random() * reply.length)];
			if (!this.can('joinbattle')) return this.sendPm(message);
			this.sendReply(message);
		};
	})(),
	
	maketour: function (target, room, user) {
		Bot.commands.maketournament.call(this, target, room, user, false);
	},
	
	maketournament: function (target, room, user, noResource) {
		if (!this.can('joinbattle') && noResource !== 'host') return;
		if (Tournaments.tournaments[room.id]) return this.sendPm('Ya hay un torneo en esta Sala.');

		var parts = target.split(','),
			self = this,
			counter = 1;
		if (parts.length < 2 || Tools.getFormat(parts[0]).effectType !== 'Format' || !/[0-9]/.test(parts[1])) return this.sendPm('Correct Syntax: .maketournament [tier], [time/amount of players]');

		if (parts[1].indexOf('minute') >= 0) {
			var time = Number(parts[1].split('minute')[0]);

			this.parse('/tour create ' + parts[0] + ', elimination');
			this.sendReply('**Teneis ' + time + ' minuto' + parts[1].split('minute')[1] + ' para uniros al torneo.**');

			var loop = function () {
				setTimeout(function () {
					if (!Tournaments.tournaments[room.id]) return;
					if (counter === time) {
						if (Tournaments.tournaments[room.id].generator.users.size < 2) {
							self.parse('/tour end');
							return self.sendReply('**El torneo fue cancelado por falta de Jugadores.**');
						}
						if (!Tournaments.tournaments[room.id].isTournamentStarted) {
						self.parse('/tour start');
						self.parse('/tour autodq 2');
						return self.sendReply('**El Torneo ha comenzado!**');
						}
					}
					if ((time - counter) === 1) {
						self.sendReply('**Teneis ' + (time - counter) + ' minuto para uniros al torneo.**');
					} else {
						self.sendReply('**Teneis ' + (time - counter) + ' minutos para uniros al torneo.**');
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
		this.sendReply('**El torneo empezará cuando  ' + parts[1] + ' jugadores se unan.**');
		var playerLoop = function () {
			setTimeout(function () {
				if (!Tournaments.tournaments[room.id]) return;
				if (Tournaments.tournaments[room.id].generator.users.size >= Number(parts[1])) {
					if (!Tournaments.tournaments[room.id].isTournamentStarted) {
						self.parse('/tour start');
						self.parse('/tour autodq 2');
						return self.sendReply('**El Torneo ha comenzado!**');
					}
				}
				playerLoop();
			}, 1000 * 15);
		};
		playerLoop();
	},

	hosttournament: function (target, room, user) {
		if (!this.can('ban')) return;
		if (!room) return;
		if (target.toLowerCase() === 'end' || target.toLowerCase() === 'off') {
			if (!Bot.config.hosting[room.id]) return this.sendPm('Ahora mismo no estoy haciendo torneos.');
			Bot.config.hosting[room.id] = false;
			return this.sendReply('/announce He dejado de hacer torneos automáticos para esta sala.');
		}
		if (Bot.config.hosting[room.id]) return this.sendPm('Ya estaba haciendo torneos automáticos.');

		Bot.config.hosting[room.id] = true
		this.sendReply('/announce Voy a empezar a hacer Torneos automáticos en esta sala.');

		var self = this,
			_room = room,
			_user = user;

		var poll = function () {
			if (!Bot.config.hosting[_room.id]) return;
			setTimeout(function () {
				if (tour[_room.id].question) self.parse('/endpoll');

				self.parse('/tierpoll');
				setTimeout(function () {
					self.parse('/endpoll');
					Bot.commands.maketournament.call(self, (tour[_room.id].topOption + ', 2 minute'), _room, _user, 'host');
				}, 1000 * 60 * 2);
			}, 1000 * 5);
		};

		var loop = function () {
			setTimeout(function () {
				if (!Tournaments.tournaments[_room.id] && !tour[_room.id].question) poll();
				if (Bot.config.hosting[_room.id]) loop();
			}, 1000 * 60);
		};

		poll();
		loop();
	},

	join: function (target, room, user, connection) {
		if (!user.can('hotpatch')) return;
		if (!target || !Rooms.get(target.toLowerCase())) return;
		if (Rooms.get(target.toLowerCase()).users[Bot.config.name]) return this.sendPm('Ya estoy en esa sala');
		Users.get(Bot.config.name).joinRoom(Rooms.get(target.toLowerCase()));
		var botDelay = (Math.floor(Math.random() * 6) * 1000)
		setTimeout(function() {
			connection.sendTo(room, Bot.config.name + ' has joined ' +  target + ' room.');
		}, botDelay);
	},
	
	autojoin: function (target, room, user, connection) {
		if (!user.can('hotpatch')) return;
		var rooms = "";
		for (var id in Rooms.rooms) {
			if (id !== 'global' && (Rooms.rooms[id].isOfficial || id === 'staff' || id === 'test') && !Rooms.get(id).users[Bot.config.name]) {
				Users.get(Bot.config.name).joinRoom(Rooms.get(id));
				rooms += id + ", ";
			}
		}
		var botDelay = (Math.floor(Math.random() * 6) * 1000)
		setTimeout(function() {
			connection.sendTo(room, Bot.config.name + ' has joined these rooms: ' + rooms);
		}, botDelay);
	},

	leave: function (target, room, user, connection) {
		if (!user.can('hotpatch')) return;
		if (!target || !Rooms.get(target.toLowerCase())) return;
		Users.get(Bot.config.name).leaveRoom(Rooms.get(target.toLowerCase()));
		var botDelay = (Math.floor(Math.random() * 6) * 1000)
		setTimeout(function() {
			connection.sendTo(room, Bot.config.name + ' has left ' +  target + ' room.');
		}, botDelay);
	},

	rpt: function (target, room, user) {
		if (!target) return;
		var options = ['roca', 'papel', 'tijeras'],
			rng = options[Math.floor(Math.random() * options.length)],
			target = toId(target);
		if (!this.can('joinbattle')) {
			if (rng === target) return this.sendPm('Empate!');
			if (rng === options[0]) {
				if (target === options[1]) return this.sendPm(user.name + ' gana! Tenía ' + rng + '.');
				if (target === options[2]) return this.sendPm('Yo Gano! Tenía ' + rng + '.');
			}
			if (rng === options[1]) {
				if (target === options[2]) return this.sendPm(user.name + ' gana! Tenía ' + rng + '.');
				if (target === options[0]) return this.sendPm('Yo Gano! Tenía ' + rng + '.');
			}
			if (rng === options[2]) {
				if (target === options[0]) return this.sendPm(user.name + ' gana! Tenía ' + rng + '.');
				if (target === options[1]) return this.sendPm('Yo Gano! Tenía ' + rng + '.');
			}
		} else {
			if (rng === target) return this.sendReply('Empate!');
			if (rng === options[0]) {
				if (target === options[1]) return this.sendReply(user.name + ' gana! Tenía ' + rng + '.');
				if (target === options[2]) return this.sendReply('Yo Gano! Tenía ' + rng + '.');
			}
			if (rng === options[1]) {
				if (target === options[2]) return this.sendReply(user.name + ' gana! Tenía ' + rng + '.');
				if (target === options[0]) return this.sendReply('Yo Gano! Tenía ' + rng + '.');
			}
			if (rng === options[2]) {
				if (target === options[0]) return this.sendReply(user.name + ' gana! Tenía ' + rng + '.');
				if (target === options[1]) return this.sendReply('Yo Gano! Tenía ' + rng + '.');
			}
		}
	},

};

exports.joinServer = joinServer;
exports.config = config;
exports.parse = parse;
exports.commands = commands;

//joinServer();
//initProgModChat();
