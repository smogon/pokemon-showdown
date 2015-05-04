/**
 * This is the file where commands get parsed
 *
 * Some parts of this code are taken from the Pokémon Showdown server code, so
 * credits also go to Guangcong Luo and other Pokémon Showdown contributors.
 * https://github.com/Zarel/Pokemon-Showdown
 *
 * @license MIT license
 */

var fs = require('fs');
var https = require('https');
var url = require('url');

const ACTION_COOLDOWN = 3 * 1000;
const FLOOD_MESSAGE_NUM = 5;
const FLOOD_PER_MSG_MIN = 500; // this is the minimum time between messages for legitimate spam. It's used to determine what "flooding" is caused by lag
const FLOOD_MESSAGE_TIME = 6 * 1000;
const MIN_CAPS_LENGTH = 12;
const MIN_CAPS_PROPORTION = 0.8;

var settings;
try {
	settings = JSON.parse(fs.readFileSync('settings.json'));
} catch (e) {} // file doesn't exist [yet]
if (!Object.isObject(settings)) settings = {};

exports.parse = {
	actionUrl: url.parse('https://play.pokemonshowdown.com/~~' + Config.serverid + '/action.php'),
	room: 'lobby',
	'settings': settings,
	chatData: {},
	ranks: {},
	blacklistRegexes: {},

	data: function (data) {
		if (data.substr(0, 1) === 'a') {
			data = JSON.parse(data.substr(1));
			if (data instanceof Array) {
				for (var i = 0, len = data.length; i < len; i++) {
					this.splitMessage(data[i]);
				}
			} else {
				this.splitMessage(data);
			}
		}
	},
	splitMessage: function (message) {
		if (!message) return;

		var room = 'lobby';
		if (message.indexOf('\n') < 0) return this.message(message, room);

		var spl = message.split('\n');
		if (spl[0].charAt(0) === '>') {
			if (spl[1].substr(1, 10) === 'tournament') return;
			room = spl.shift().substr(1);
			if (spl[0].substr(1, 4) === 'init') {
				var users = spl[2].substr(7).split(',');
				var nickId = toId(Config.nick);
				for (var i = users.length; i--;) {
					if (toId(users[i]) === nickId) this.ranks[room] = users[i].trim().charAt(0);
					break;
				}
				return ok('joined ' + room);
			}
		}

		for (var i = 0, len = spl.length; i < len; i++) {
			this.message(spl[i], room);
		}
	},
	message: function (message, room) {
		var spl = message.split('|');
		switch (spl[1]) {
			case 'challstr':
				info('received challstr, logging in...');
				var id = spl[2];
				var str = spl[3];

				var requestOptions = {
					hostname: this.actionUrl.hostname,
					port: this.actionUrl.port,
					path: this.actionUrl.pathname,
					agent: false
				};

				if (!Config.pass) {
					requestOptions.method = 'GET';
					requestOptions.path += '?act=getassertion&userid=' + toId(Config.nick) + '&challengekeyid=' + id + '&challenge=' + str;
				} else {
					requestOptions.method = 'POST';
					var data = 'act=login&name=' + Config.nick + '&pass=' + Config.pass + '&challengekeyid=' + id + '&challenge=' + str;
					requestOptions.headers = {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': data.length
					};
				}

				var req = https.request(requestOptions, function (res) {
					res.setEncoding('utf8');
					var data = '';
					res.on('data', function (chunk) {
						data += chunk;
					});
					res.on('end', function () {
						if (data === ';') {
							error('failed to log in; nick is registered - invalid or no password given');
							process.exit(-1);
						}
						if (data.length < 50) {
							error('failed to log in: ' + data);
							process.exit(-1);
						}

						if (data.indexOf('heavy load') !== -1) {
							error('the login server is under heavy load; trying again in one minute');
							setTimeout(function () {
								this.message(message);
							}.bind(this), 60 * 1000);
							return;
						}

						if (data.substr(0, 16) === '<!DOCTYPE html>') {
							error('Connection error 522; trying agian in one minute');
							setTimeout(function () {
								this.message(message);
							}.bind(this), 60 * 1000);
							return;
						}

						try {
							data = JSON.parse(data.substr(1));
							if (data.actionsuccess) {
								data = data.assertion;
							} else {
								error('could not log in; action was not successful: ' + JSON.stringify(data));
								process.exit(-1);
							}
						} catch (e) {}
						send('|/trn ' + Config.nick + ',0,' + data);
					}.bind(this));
				}.bind(this));

				req.on('error', function (err) {
					error('login error: ' + err.stack);
				});

				if (data) req.write(data);
				req.end();
				break;
			case 'updateuser':
				if (spl[2] !== Config.nick) return;

				if (spl[3] !== '1') {
					error('failed to log in, still guest');
					process.exit(-1);
				}

				ok('logged in as ' + spl[2]);
				send('|/blockchallenges');

				// Now join the rooms
				for (var i = 0, len = Config.rooms.length; i < len; i++) {
					var room = toId(Config.rooms[i]);
					if (room === 'lobby' && Config.serverid === 'showdown') continue;
					send('|/join ' + room);
				}
				for (var i = 0, len = Config.privaterooms.length; i < len; i++) {
					var room = toId(Config.privaterooms[i]);
					if (room === 'lobby' && Config.serverid === 'showdown') continue;
					send('|/join ' + room);
				}
				if (this.settings.blacklist) {
					var blacklist = this.settings.blacklist;
					for (var room in blacklist) {
						this.updateBlacklistRegex(room);
					}
				}
				setInterval(this.cleanChatData.bind(this), 30 * 60 * 1000);
				break;
			case 'c':
				var by = spl[2];
				if (this.isBlacklisted(toId(by), room)) return this.say(room, '/roomban ' + by + ', Blacklisted user');

				spl = spl.slice(3).join('|');
				if ('%@#&~'.indexOf(by.charAt(0)) < 0) this.processChatData(toId(by), room, spl);
				this.chatMessage(spl, by, room);
				break;
			case 'c:':
				var by = spl[3];
				if (this.isBlacklisted(toId(by), room)) return this.say(room, '/roomban ' + by + ', Blacklisted user');

				spl = spl.slice(4).join('|');
				if ('%@#&~'.indexOf(by.charAt(0)) < 0) this.processChatData(toId(by), room, spl);
				this.chatMessage(spl, by, room);
				break;
			case 'pm':
				var by = spl[2];
				this.chatMessage(spl.slice(4).join('|'), by, ',' + by);
				break;
			case 'N':
				var by = spl[2];
				if (this.isBlacklisted(toId(by), room)) return this.say(room, '/roomban ' + by + ', Blacklisted user');
				this.updateSeen(spl[3], spl[1], toId(by));
				break;
			case 'J': case 'j':
				var by = spl[2];
				if (this.isBlacklisted(toId(by), room)) return this.say(room, '/roomban ' + by + ', Blacklisted user');
				this.updateSeen(toId(by), spl[1], room);
				break;
			case 'l': case 'L':
				this.updateSeen(toId(spl[2]), spl[1], room);
				break;
		}
	},
	chatMessage: function (message, by, room) {
		var cmdrMessage = '["' + room + '|' + by + '|' + message + '"]';
		message = message.trim();
		// auto accept invitations to rooms
		if (room.charAt(0) === ',' && message.substr(0,8) === '/invite ' && this.hasRank(by, '%@&~') && !(Config.serverid === 'showdown' && toId(message.substr(8)) === 'lobby')) {
			this.say('', '/join ' + message.substr(8));
		}
		if (message.substr(0, Config.commandcharacter.length) !== Config.commandcharacter || toId(by) === toId(Config.nick)) return;

		message = message.substr(Config.commandcharacter.length);
		var index = message.indexOf(' ');
		var arg = '';
		if (index > -1) {
			var cmd = message.substr(0, index);
			arg = message.substr(index + 1).trim();
		} else {
			var cmd = message;
		}

		if (!!Commands[cmd]) {
			var failsafe = 0;
			while (typeof Commands[cmd] !== "function" && failsafe++ < 10) {
				cmd = Commands[cmd];
			}
			if (typeof Commands[cmd] === "function") {
				cmdr(cmdrMessage);
				Commands[cmd].call(this, arg, by, room);
			} else {
				error("invalid command type for " + cmd + ": " + (typeof Commands[cmd]));
			}
		}
	},
	say: function (room, text) {
		if (room.charAt(0) !== ',') {
			var str = (room !== 'lobby' ? room : '') + '|' + text;
		} else {
			room = room.substr(1);
			var str = '|/pm ' + room + ', ' + text;
		}
		send(str);
	},
	hasRank: function (user, ranks) {
		return ranks.indexOf(user.charAt(0)) > -1 || Config.excepts.indexOf(toId(user)) > -1;
	},
	canUse: function (cmd, room, user) {
		var canUse = false;
		var ranks = ' +%@#&~';
		if (!this.settings[cmd] || !this.settings[cmd][room]) {
			canUse = this.hasRank(user, ranks.substr(ranks.indexOf((cmd === 'autoban' || cmd === 'banword') ? '#' : Config.defaultrank)));
		} else if (this.settings[cmd][room] === true) {
			canUse = true;
		} else if (ranks.indexOf(this.settings[cmd][room]) > -1) {
			canUse = this.hasRank(user, ranks.substr(ranks.indexOf(this.settings[cmd][room])));
		}
		return canUse;
	},
	isBlacklisted: function (user, room) {
		var blacklistRegex = this.blacklistRegexes[room];
		return blacklistRegex && blacklistRegex.test(user);
	},
	blacklistUser: function (user, room) {
		var blacklist = this.settings.blacklist || (this.settings.blacklist = {});
		if (blacklist[room]) {
			if (blacklist[room][user]) return false;
		} else {
			blacklist[room] = {};
		}

		blacklist[room][user] = 1;
		this.updateBlacklistRegex(room);
		return true;
	},
	unblacklistUser: function (user, room) {
		var blacklist = this.settings.blacklist;
		if (!blacklist || !blacklist[room] || !blacklist[room][user]) return false;

		delete blacklist[room][user];
		if (Object.isEmpty(blacklist[room])) {
			delete blacklist[room];
			delete this.blacklistRegexes[room];
		} else {
			this.updateBlacklistRegex(room);
		}
		return true;
	},
	updateBlacklistRegex: function (room) {
		var blacklist = this.settings.blacklist[room];
		var buffer = [];
		for (var entry in blacklist) {
			if (entry.charAt(0) === '/' && entry.substr(-2) === '/i') {
				buffer.push(entry.slice(1, -2));
			} else {
				buffer.push('^' + entry + '$');
			}
		}
		this.blacklistRegexes[room] = new RegExp(buffer.join('|'), 'i');
	},
	uploadToHastebin: function (toUpload, callback) {
		var reqOpts = {
			hostname: "hastebin.com",
			method: "POST",
			path: '/documents'
		};

		var req = require('http').request(reqOpts, function (res) {
			res.on('data', function (chunk) {
				if (callback && typeof callback === "function") callback("hastebin.com/raw/" + JSON.parse(chunk.toString())['key']);
			});
		});

		req.write(toUpload);
		req.end();
	},
	processChatData: function (user, room, msg) {
		// NOTE: this is still in early stages
		if (!user || room.charAt(0) === ',') return;

		msg = msg.trim().replace(/[ \u0000\u200B-\u200F]+/g, ' '); // removes extra spaces and null characters so messages that should trigger stretching do so
		this.updateSeen(user, 'c', room);
		var now = Date.now();
		if (!this.chatData[user]) this.chatData[user] = {
			zeroTol: 0,
			lastSeen: '',
			seenAt: now
		};
		var userData = this.chatData[user];

		if (!this.chatData[user][room]) this.chatData[user][room] = {
			times: [],
			points: 0,
			lastAction: 0
		};
		var roomData = userData[room];

		roomData.times.push(now);

		// this deals with punishing rulebreakers, but note that the bot can't think, so it might make mistakes
		if (Config.allowmute && this.hasRank(this.ranks[room] || ' ', '%@#&~') && Config.whitelist.indexOf(user) === -1) {
			var useDefault = !(this.settings.modding && this.settings.modding[room]);
			var pointVal = 0;
			var muteMessage = '';
			var modSettings = useDefault ? null : this.settings.modding[room];

			// moderation for banned words
			if ((useDefault || !this.settings.banword[room]) && pointVal < 2) {
				var bannedPhraseSettings = this.settings.bannedphrases;
				var bannedPhrases = !!bannedPhraseSettings ? (Object.keys(bannedPhraseSettings[room] || {})).concat(Object.keys(bannedPhraseSettings.global || {})) : [];
				for (var i = 0; i < bannedPhrases.length; i++) {
					if (msg.toLowerCase().indexOf(bannedPhrases[i]) > -1) {
						pointVal = 2;
						muteMessage = ', Automated response: your message contained a banned phrase';
						break;
					}
				}
			}
			// moderation for flooding (more than x lines in y seconds)
			var times = roomData.times;
			var timesLen = times.length;
			var isFlooding = (timesLen >= FLOOD_MESSAGE_NUM && (now - times[timesLen - FLOOD_MESSAGE_NUM]) < FLOOD_MESSAGE_TIME &&
				(now - times[timesLen - FLOOD_MESSAGE_NUM]) > (FLOOD_PER_MSG_MIN * FLOOD_MESSAGE_NUM));
			if ((useDefault || !('flooding' in modSettings)) && isFlooding) {
				if (pointVal < 2) {
					pointVal = 2;
					muteMessage = ', Automated response: flooding';
				}
			}
			// moderation for caps (over x% of the letters in a line of y characters are capital)
			var capsMatch = msg.replace(/[^A-Za-z]/g, '').match(/[A-Z]/g);
			if ((useDefault || !('caps' in modSettings)) && capsMatch && toId(msg).length > MIN_CAPS_LENGTH && (capsMatch.length >= ~~(toId(msg).length * MIN_CAPS_PROPORTION))) {
				if (pointVal < 1) {
					pointVal = 1;
					muteMessage = ', Automated response: caps';
				}
			}
			// moderation for stretching (over x consecutive characters in the message are the same)
			var stretchMatch = /(.)\1{7,}/gi.test(msg) || /(..+)\1{4,}/gi.test(msg); // matches the same character (or group of characters) 8 (or 5) or more times in a row
			if ((useDefault || !('stretching' in modSettings)) && stretchMatch) {
				if (pointVal < 1) {
					pointVal = 1;
					muteMessage = ', Automated response: stretching';
				}
			}

			if (pointVal > 0 && now - roomData.lastAction >= ACTION_COOLDOWN) {
				var cmd = 'mute';
				// defaults to the next punishment in Config.punishVals instead of repeating the same action (so a second warn-worthy
				// offence would result in a mute instead of a warn, and the third an hourmute, etc)
				if (roomData.points >= pointVal && pointVal < 4) {
					roomData.points++;
					cmd = Config.punishvals[roomData.points] || cmd;
				} else { // if the action hasn't been done before (is worth more points) it will be the one picked
					cmd = Config.punishvals[pointVal] || cmd;
					roomData.points = pointVal; // next action will be one level higher than this one (in most cases)
				}
				if (Config.privaterooms.indexOf(room) > -1 && cmd === 'warn') cmd = 'mute'; // can't warn in private rooms
				// if the bot has % and not @, it will default to hourmuting as its highest level of punishment instead of roombanning
				if (roomData.points >= 4 && !this.hasRank(this.ranks[room] || ' ', '@#&~')) cmd = 'hourmute';
				if (userData.zeroTol > 4) { // if zero tolerance users break a rule they get an instant roomban or hourmute
					muteMessage = ', Automated response: zero tolerance user';
					cmd = this.hasRank(this.ranks[room] || ' ', '@#&~') ? 'roomban' : 'hourmute';
				}
				if (roomData.points > 1) userData.zeroTol++; // getting muted or higher increases your zero tolerance level (warns do not)
				roomData.lastAction = now;
				this.say(room, '/' + cmd + ' ' + user + muteMessage);
			}
		}
	},
	cleanChatData: function () {
		var chatData = this.chatData;
		for (var user in chatData) {
			for (var room in chatData[user]) {
				var roomData = chatData[user][room];
				if (!Object.isObject(roomData)) continue;

				if (!roomData.times || !roomData.times.length) {
					delete chatData[user][room];
					continue;
				}
				var newTimes = [];
				var now = Date.now();
				var times = roomData.times;
				for (var i = 0, len = times.length; i < len; i++) {
					if (now - times[i] < 5 * 1000) newTimes.push(times[i]);
				}
				newTimes.sort(function (a, b) {
					return a - b;
				});
				roomData.times = newTimes;
				if (roomData.points > 0 && roomData.points < 4) roomData.points--;
			}
		}
	},

	updateSeen: function (user, type, detail) {
		if (type !== 'n' && Config.rooms.indexOf(detail) === -1 || Config.privaterooms.indexOf(toId(detail)) > -1) return;
		var now = Date.now();
		if (!this.chatData[user]) this.chatData[user] = {
			zeroTol: 0,
			lastSeen: '',
			seenAt: now
		};
		if (!detail) return;
		var userData = this.chatData[user];
		var msg = '';
		switch (type) {
		case 'j':
		case 'J':
			msg += 'joining ';
			break;
		case 'l':
		case 'L':
			msg += 'leaving ';
			break;
		case 'c':
		case 'c:':
			msg += 'chatting in ';
			break;
		case 'N':
			msg += 'changing nick to ';
			if (detail.charAt(0) !== ' ') detail = detail.substr(1);
			break;
		}
		msg += detail.trim() + '.';
		userData.lastSeen = msg;
		userData.seenAt = now;
	},
	getTimeAgo: function (time) {
		time = ~~((Date.now() - time) / 1000);

		var seconds = time % 60;
		var times = [];
		if (seconds) times.push(seconds + (seconds === 1 ? ' second': ' seconds'));
		if (time >= 60) {
			time = ~~((time - seconds) / 60);
			var minutes = time % 60;
			if (minutes) times.unshift(minutes + (minutes === 1 ? ' minute' : ' minutes'));
			if (time >= 60) {
				time = ~~((time - minutes) / 60);
				hours = time % 24;
				if (hours) times.unshift(hours + (hours === 1 ? ' hour' : ' hours'));
				if (time >= 24) {
					days = ~~((time - hours) / 24);
					if (days) times.unshift(days + (days === 1 ? ' day' : ' days'));
				}
			}
		}
		if (!times.length) return '0 seconds';
		return times.join(', ');
	},
	writeSettings: (function () {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function () {
			writing = false;
			if (writePending) {
				writePending = false;
				this.writeSettings();
			}
		};
		return function () {
			if (writing) {
				writePending = true;
				return;
			}
			writing = true;
			var data = JSON.stringify(this.settings);
			fs.writeFile('settings.json.0', data, function () {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('settings.json.0', 'settings.json', function (err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('settings.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),
	uncacheTree: function (root) {
		var uncache = [require.resolve(root)];
		do {
			var newuncache = [];
			for (var i = 0; i < uncache.length; ++i) {
				if (require.cache[uncache[i]]) {
					newuncache.push.apply(newuncache,
						require.cache[uncache[i]].children.map(function (module) {
							return module.filename;
						})
					);
					delete require.cache[uncache[i]];
				}
			}
			uncache = newuncache;
		} while (uncache.length > 0);
	},
	getDocMeta: function (id, callback) {
		https.get('https://www.googleapis.com/drive/v2/files/' + id + '?key=' + Config.googleapikey, function (res) {
			var data = '';
			res.on('data', function (part) {
				data += part;
			});
			res.on('end', function (end) {
				var json = JSON.parse(data);
				if (json) {
					callback(null, json);
				} else {
					callback('Invalid response', data);
				}
			});
		});
	},
	getDocCsv: function (meta, callback) {
		https.get('https://docs.google.com/spreadsheet/pub?key=' + meta.id + '&output=csv', function (res) {
			var data = '';
			res.on('data', function (part) {
				data += part;
			});
			res.on('end', function (end) {
				callback(data);
			});
		});
	}
};
