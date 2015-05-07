/**
 * This is the file where the bot commands are located
 *
 * @license MIT license
 */

var http = require('http');

if (Config.serverid === 'showdown') {
	var https = require('https');
	var csv = require('csv-parse');
}

exports.commands = {
	/**
	 * Help commands
	 *
	 * These commands are here to provide information about the bot.
	 */

	credits: 'about',
	about: function (arg, by, room) {
		var text = this.hasRank(by, '#&~') || room.charAt(0) === ',' ? '' : '/pm ' + by + ', ';
		text += '**Pokémon Showdown Bot** by: Quinella, TalkTakesTime, and Morfent';
		this.say(room, text);
	},
	git: function (arg, by, room) {
		var text = Config.excepts.indexOf(toId(by)) < 0 ? '/pm ' + by + ', ' : '';
		text += '**Pokemon Showdown Bot** source code: ' + Config.fork;
		this.say(room, text);
	},
	help: 'guide',
	guide: function (arg, by, room) {
		var text = this.hasRank(by, '#&~') || room.charAt(0) === ',' ? '' : '/pm ' + by + ', ';
		if (Config.botguide) {
			text += 'A guide on how to use this bot can be found here: ' + Config.botguide;
		} else {
			text += 'There is no guide for this bot. PM the owner with any questions.';
		}
		this.say(room, text);
	},

	/**
	 * Dev commands
	 *
	 * These commands are here for highly ranked users (or the creator) to use
	 * to perform arbitrary actions that can't be done through any other commands
	 * or to help with upkeep of the bot.
	 */

	reload: function (arg, by, room) {
		if (Config.excepts.indexOf(toId(by)) < 0) return false;
		try {
			this.uncacheTree('./commands.js');
			Commands = require('./commands.js').commands;
			this.say(room, 'Commands reloaded.');
		} catch (e) {
			error('failed to reload: ' + e.stack);
		}
	},
	custom: function (arg, by, room) {
		if (Config.excepts.indexOf(toId(by)) < 0) return false;
		// Custom commands can be executed in an arbitrary room using the syntax
		// ".custom [room] command", e.g., to do !data pikachu in the room lobby,
		// the command would be ".custom [lobby] !data pikachu". However, using
		// "[" and "]" in the custom command to be executed can mess this up, so
		// be careful with them.
		if (arg.indexOf('[') === 0 && arg.indexOf(']') > -1) {
			room = arg.slice(1, arg.indexOf(']'));
			arg = arg.substr(arg.indexOf(']') + 1).trim();
		}
		this.say(room, arg);
	},
	js: function (arg, by, room) {
		if (Config.excepts.indexOf(toId(by)) === -1) return false;
		try {
			var result = eval(arg.trim());
			this.say(room, JSON.stringify(result));
		} catch (e) {
			this.say(room, e.name + ": " + e.message);
		}
	},
	uptime: function (arg, by, room) {
		var text = Config.excepts.indexOf(toId(by)) < 0 ? '/pm ' + by + ', **Uptime:** ' : '**Uptime:** ';
		var divisors = [52, 7, 24, 60, 60];
		var units = ['week', 'day', 'hour', 'minute', 'second'];
		var buffer = [];
		var uptime = ~~(process.uptime());
		do {
			var divisor = divisors.pop();
			var unit = uptime % divisor;
			buffer.push(unit > 1 ? unit + ' ' + units.pop() + 's' : unit + ' ' + units.pop());
			uptime = ~~(uptime / divisor);
		} while (uptime);

		switch (buffer.length) {
		case 5:
			text += buffer[4] + ', ';
			/* falls through */
		case 4:
			text += buffer[3] + ', ';
			/* falls through */
		case 3:
			text += buffer[2] + ', ' + buffer[1] + ', and ' + buffer[0];
			break;
		case 2:
			text += buffer[1] + ' and ' + buffer[0];
			break;
		case 1:
			text += buffer[0];
			break;
		}

		this.say(room, text);
	}, 


	/**
	 * Room Owner commands
	 *
	 * These commands allow room owners to personalise settings for moderation and command use.
	 */

	settings: 'set',
	set: function (arg, by, room) {
		if (!this.hasRank(by, '#&~') || room.charAt(0) === ',') return false;

		var settable = {
			say: 1,
			joke: 1,
			usagestats: 1,
			helix: 1
		};
		var modOpts = {
			flooding: 1,
			stretching: 1,
			bannedwords: 1
		};

		var opts = arg.split(',');
		var cmd = toId(opts[0]);
		var setting;
		if (cmd === 'm' || cmd === 'mod' || cmd === 'modding') {
			var modOpt = toId(opts[1]);
			if (!modOpts[modOpt]) return this.say(room, 'Incorrect command: correct syntax is ' + Config.commandcharacter + 'set mod, [' +
				Object.keys(modOpts).join('/') + '](, [on/off])');

			setting = toId(opts[2]);
			if (!setting) return this.say(room, 'Moderation for ' + modOpt + ' in this room is currently ' +
				(this.settings.modding[room] && modOpt in this.settings.modding[room] ? 'OFF' : 'ON') + '.');

			if (!this.settings.modding) this.settings.modding = {};
			if (!this.settings.modding[room]) this.settings.modding[room] = {};
			if (setting === 'on') {
				delete this.settings.modding[room][modOpt];
				if (Object.isEmpty(this.settings.modding[room])) delete this.settings.modding[room];
				if (Object.isEmpty(this.settings.modding)) delete this.settings.modding;
			} else if (setting === 'off') {
				this.settings.modding[room][modOpt] = 0;
			} else {
				return this.say(room, 'Incorrect command: correct syntax is ' + Config.commandcharacter + 'set mod, [' +
					Object.keys(modOpts).join('/') + '](, [on/off])');
			}

			this.writeSettings();
			return this.say(room, 'Moderation for ' + modOpt + ' in this room is now ' + setting.toUpperCase() + '.');
		}

		if (!(cmd in Commands)) return this.say(room, Config.commandcharacter + '' + opts[0] + ' is not a valid command.');

		var failsafe = 0;
		while (true) {
			if (typeof Commands[cmd] === 'string') {
				cmd = Commands[cmd];
			} else if (typeof Commands[cmd] === 'function') {
				if (cmd in settable) break;
				return this.say(room, 'The settings for ' + Config.commandcharacter + '' + opts[0] + ' cannot be changed.');
			} else {
				return this.say(room, 'Something went wrong. PM Morfent or TalkTakesTime here or on Smogon with the command you tried.');
			}

			if (++failsafe > 5) return this.say(room, 'The command "' + Config.commandcharacter + '' + opts[0] + '" could not be found.');
		}

		var settingsLevels = {
			off: false,
			disable: false,
			'false': false,
			'+': '+',
			'%': '%',
			'@': '@',
			'#': '#',
			'&': '&',
			'~': '~',
			on: true,
			enable: true,
			'true': true
		};

		setting = opts[1].trim().toLowerCase();
		if (!setting) {
			var msg = '' + Config.commandcharacter + '' + cmd + ' is ';
			if (!this.settings[cmd] || (!(room in this.settings[cmd]))) {
				msg += 'available for users of rank ' + ((cmd === 'autoban' || cmd === 'banword') ? '#' : Config.defaultrank) + ' and above.';
			} else if (this.settings[cmd][room] in settingsLevels) {
				msg += 'available for users of rank ' + this.settings[cmd][room] + ' and above.';
			} else {
				msg += this.settings[cmd][room] ? 'available for all users in this room.' : 'not available for use in this room.';
			}

			return this.say(room, msg);
		}

		if (!(setting in settingsLevels)) return this.say(room, 'Unknown option: "' + setting + '". Valid settings are: off/disable/false, +, %, @, #, &, ~, on/enable/true.');
		if (!this.settings[cmd]) this.settings[cmd] = {};
		this.settings[cmd][room] = settingsLevels[setting];

		this.writeSettings();
		this.say(room, 'The command ' + Config.commandcharacter + '' + cmd + ' is now ' +
			(settingsLevels[setting] === setting ? ' available for users of rank ' + setting + ' and above.' :
			(this.settings[cmd][room] ? 'available for all users in this room.' : 'unavailable for use in this room.')));
	},
	blacklist: 'autoban',
	ban: 'autoban',
	ab: 'autoban',
	autoban: function (arg, by, room) {
		if (room !== 'staff') return this.say(room, 'The blacklist commands must be used in the "Staff" room.');
		if (!this.hasRank(by, '@~')) return false;

		arg = arg.split(',');
		var added = [];
		var illegalNick = [];
		var alreadyAdded = [];
		if (!arg.length || (arg.length === 1 && !arg[0].trim().length)) return this.say(room, 'You must specify at least one user to blacklist.');
		for (var i = 0; i < arg.length; i++) {
			var tarUser = toId(arg[i]);
			if (tarUser.length < 1 || tarUser.length > 18) {
				illegalNick.push(tarUser);
				continue;
			}
			if (!this.blacklistUser(tarUser, 'chat')) {
				alreadyAdded.push(tarUser);
				continue;
			}
			this.say(room, '/ban ' + tarUser + ', Blacklisted user');
			added.push(tarUser);
		}

		var text = '';
		if (added.length) {
			text += 'User' + (added.length > 1 ? 's "' + added.join('", "') + '" were' : ' "' + added[0] + '" was') + ' added to the blacklist';
			this.say(room, '/modnote ' + text + ' by ' + by + '.');
			text += '.';
			this.writeSettings();
		}
		if (alreadyAdded.length) text += ' User' + (alreadyAdded.length ? 's "' + alreadyAdded.join('", "') + '" are' : ' "' + alreadyAdded[0] + '" is') +
			' already present in the blacklist.';
		if (illegalNick.length) text += (text.length ? ' All other' : 'All') + ' users had illegal nicks and were not blacklisted.';
		this.say(room, text);
	},
	unblacklist: 'unautoban',
	unban: 'unautoban',
	unab: 'unautoban',
	unautoban: function (arg, by, room) {
		if (room !== 'staff') return this.say(room, 'The blacklist commands must be used in the "Staff" room.');
		if (!this.hasRank(by, '@~')) return false;

		arg = arg.split(',');
		var removed = [];
		var notRemoved = [];
		if (!arg.length || (arg.length === 1 && !arg[0].trim().length)) return this.say(room, 'You must specify at least one user to unblacklist.');
		for (var i = 0; i < arg.length; i++) {
			var tarUser = toId(arg[i]);
			if (tarUser.length < 1 || tarUser.length > 18) {
				notRemoved.push(tarUser);
				continue;
			}
			if (!this.unblacklistUser(tarUser, 'chat')) {
				notRemoved.push(tarUser);
				continue;
			}
			this.say(room, '/unban ' + tarUser);
			removed.push(tarUser);
		}

		var text = '';
		if (removed.length) {
			text += 'User' + (removed.length > 1 ? 's "' + removed.join('", "') + '" were' : ' "' + removed[0] + '" was') + ' removed from the blacklist';
			this.say(room, '/modnote ' + text + ' by ' + by + '.');
			text += '.';
			this.writeSettings();
		}
		if (notRemoved.length) text += (text.length ? ' No other' : 'No') + ' specified users were present in the blacklist.';
		this.say(room, text);
	},
	rab: 'regexautoban',
	regexautoban: function (arg, by, room) {
		if (Config.regexautobanwhitelist.indexOf(toId(by)) < 0 || !this.canUse('autoban', room, by) || room.charAt(0) === ',') return false;
		if (!this.hasRank(this.ranks[room] || ' ', '@#&~')) return this.say(room, Config.nick + ' requires rank of @ or higher to (un)blacklist.');
		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		try {
			new RegExp(arg, 'i');
		} catch (e) {
			return this.say(room, e.message);
		}

		arg = '/' + arg + '/i';
		if (!this.blacklistUser(arg, room)) return this.say(room, '/' + arg + ' is already present in the blacklist.');

		this.writeSettings();
		this.say(room, '/modnote Regular expression ' + arg + ' was added to the blacklist by ' + by + '.');
		this.say(room, 'Regular expression ' + arg + ' was added to the blacklist.');
	},
	unrab: 'unregexautoban',
	unregexautoban: function (arg, by, room) {
		if (Config.regexautobanwhitelist.indexOf(toId(by)) < 0 || !this.canUse('autoban', room, by) || room.charAt(0) === ',') return false;
		if (!this.hasRank(this.ranks[room] || ' ', '@#&~')) return this.say(room, Config.nick + ' requires rank of @ or higher to (un)blacklist.');
		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		arg = '/' + arg.replace(/\\\\/g, '\\') + '/i';
		if (!this.unblacklistUser(arg, room)) return this.say(room,'/' + arg + ' is not present in the blacklist.');

		this.writeSettings();
		this.say(room, '/modnote Regular expression ' + arg + ' was removed from the blacklist by ' + by + '.');
		this.say(room, 'Regular expression ' + arg + ' was removed from the blacklist.');
	},
	viewbans: 'viewblacklist',
	vab: 'viewblacklist',
	viewautobans: 'viewblacklist',
	viewblacklist: function (arg, by, room) {
		if (room !== 'staff') return this.say(room, 'The blacklist commands must be used in the "Staff" room.');
		if (!this.hasRank(by, '@~')) return false;

		var text = '';
		if (!this.settings.blacklist || !this.settings.blacklist[room]) {
			text = 'No users are blacklisted in this room.';
		} else {
			if (arg.length) {
				var nick = toId(arg);
				if (nick.length < 1 || nick.length > 18) {
					text = 'Invalid nickname: "' + nick + '".';
				} else {
					text = 'User "' + nick + '" is currently ' + (nick in this.settings.blacklist[room] ? '' : 'not ') + 'blacklisted in ' + room + '.';
				}
			} else {
				var nickList = Object.keys(this.settings.blacklist[room]);
				if (!nickList.length) return this.say(room, '/pm ' + by + ', No users are blacklisted in this room.');
				this.uploadToHastebin('The following users are banned in ' + room + ':\n\n' + nickList.join('\n'), function (link) {
					this.say(room, "/pm " + by + ", Blacklist for room " + room + ": " + link);
				}.bind(this));
				return;
			}
		}
		this.say(room, '/pm ' + by + ', ' + text);
	},
	banphrase: 'banword',
	banword: function (arg, by, room) {
		if (!this.hasRank(by, '~')) return false;
		if (!this.settings.bannedphrases) this.settings.bannedphrases = {};
		arg = arg.trim().toLowerCase();
		if (!arg) return false;
		var tarRoom = room;

		if (room.charAt(0) === ',') {
			if (Config.excepts.indexOf(toId(by)) < 0) return false;
			tarRoom = 'global';
		}

		if (!this.settings.bannedphrases[tarRoom]) this.settings.bannedphrases[tarRoom] = {};
		if (arg in this.settings.bannedphrases[tarRoom]) return this.say(room, "Phrase \"" + arg + "\" is already banned.");
		this.settings.bannedphrases[tarRoom][arg] = 1;
		this.writeSettings();
		this.say(room, "Phrase \"" + arg + "\" is now banned.");
	},
	unbanphrase: 'unbanword',
	unbanword: function (arg, by, room) {
		if (!this.hasRank(by, '~')) return false;
		arg = arg.trim().toLowerCase();
		if (!arg) return false;
		var tarRoom = room;

		if (room.charAt(0) === ',') {
			if (Config.excepts.indexOf(toId(by)) < 0) return false;
			tarRoom = 'global';
		}

		if (!this.settings.bannedphrases || !this.settings.bannedphrases[tarRoom] || !(arg in this.settings.bannedphrases[tarRoom])) 
			return this.say(room, "Phrase \"" + arg + "\" is not currently banned.");
		delete this.settings.bannedphrases[tarRoom][arg];
		if (!Object.size(this.settings.bannedphrases[tarRoom])) delete this.settings.bannedphrases[tarRoom];
		if (!Object.size(this.settings.bannedphrases)) delete this.settings.bannedphrases;
		this.writeSettings();
		this.say(room, "Phrase \"" + arg + "\" is no longer banned.");
	},
	viewbannedphrases: 'viewbannedwords',
	vbw: 'viewbannedwords',
	viewbannedwords: function (arg, by, room) {
		if (!this.hasRank(by, '~')) return false;
		arg = arg.trim().toLowerCase();
		var tarRoom = room;

		if (room.charAt(0) === ',') {
			if (Config.excepts.indexOf(toId(by)) < 0) return false;
			tarRoom = 'global';
		}

		var text = "";
		if (!this.settings.bannedphrases || !this.settings.bannedphrases[tarRoom]) {
			text = "No phrases are banned in this room.";
		} else {
			if (arg.length) {
				text = "The phrase \"" + arg + "\" is currently " + (arg in this.settings.bannedphrases[tarRoom] ? "" : "not ") + "banned " +
					(room.charAt(0) === ',' ? "globally" : "in " + room) + ".";
			} else {
				var banList = Object.keys(this.settings.bannedphrases[tarRoom]);
				if (!banList.length) return this.say(room, "No phrases are banned in this room.");
				this.uploadToHastebin("The following phrases are banned " + (room.charAt(0) === ',' ? "globally" : "in " + room) + ":\n\n" + banList.join('\n'), function (link) {
					this.say(room, (room.charAt(0) === ',' ? "" : "/pm " + by + ", ") + "Banned Phrases " + (room.charAt(0) === ',' ? "globally" : "in " + room) + ": " + link);
				}.bind(this));
				return;
			}
		}
		this.say(room, text);
	},

	/**
	 * General commands
	 *
	 * Add custom commands here.
	 */

	tell: 'say',
	say: function (arg, by, room) {
		if (!this.canUse('say', room, by)) return false;
		this.say(room, stripCommands(arg) + ' (' + by + ' said this)');
	},
	joke: function (arg, by, room) {
		if (!this.canUse('joke', room, by) || room.charAt(0) === ',') return false;
		var self = this;

		var reqOpt = {
			hostname: 'api.icndb.com',
			path: '/jokes/random',
			method: 'GET'
		};
		var req = http.request(reqOpt, function (res) {
			res.on('data', function (chunk) {
				try {
					var data = JSON.parse(chunk);
					self.say(room, data.value.joke.replace(/&quot;/g, "\""));
				} catch (e) {
					self.say(room, 'Sorry, couldn\'t fetch a random joke... :(');
				}
			});
		});
		req.end();
	},
	usage: 'usagestats',
	usagestats: function (arg, by, room) {
		var text = this.canUse('usagestats', room, by) || room.charAt(0) === ',' ? '' : '/pm ' + by + ', ';
		text += 'http://www.smogon.com/stats/2015-03/';
		this.say(room, text);
	},
	seen: function (arg, by, room) { // this command is still a bit buggy
		var text = (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ');
		arg = toId(arg);
		if (!arg || arg.length > 18) return this.say(room, text + 'Invalid username.');
		if (arg === toId(by)) {
			text += 'Have you looked in the mirror lately?';
		} else if (arg === toId(Config.nick)) {
			text += 'You might be either blind or illiterate. Might want to get that checked out.';
		} else if (!this.chatData[arg] || !this.chatData[arg].seenAt) {
			text += 'The user ' + arg + ' has never been seen.';
		} else {
			text += arg + ' was last seen ' + this.getTimeAgo(this.chatData[arg].seenAt) + ' ago' + (
				this.chatData[arg].lastSeen ? ', ' + this.chatData[arg].lastSeen : '.');
		}
		this.say(room, text);
	},
	'8ball': function (arg, by, room) {
		var text = this.canUse('8ball', room, by) || room.charAt(0) === ',' ? '' : '/pm ' + by + ', ';
		var rand = ~~(20 * Math.random());

		switch (rand) {
	 		case 0:
				text += "Signs point to yes.";
				break;
	  		case 1:
				text += "Yes.";
				break;
			case 2:
				text += "Reply hazy, try again.";
				break;
			case 3:
				text += "Without a doubt.";
				break;
			case 4:
				text += "My sources say no.";
				break;
			case 5:
				text += "As I see it, yes.";
				break;
			case 6:
				text += "You may rely on it.";
				break;
			case 7:
				text += "Concentrate and ask again.";
				break;
			case 8:
				text += "Outlook not so good.";
				break;
			case 9:
				text += "It is decidedly so.";
				break;
			case 10:
				text += "Better not tell you now.";
				break;
			case 11:
				text += "Very doubtful.";
				break;
			case 12:
				text += "Yes - definitely.";
				break;
			case 13:
				text += "It is certain.";
				break;
			case 14:
				text += "Cannot predict now.";
				break;
			case 15:
				text += "Most likely.";
				break;
			case 16:
				text += "Ask again later.";
				break;
			case 17:
				text += "My reply is no.";
				break;
			case 18:
				text += "Outlook good.";
				break;
			case 19:
				text += "Don't count on it.";
				break;
		}

		this.say(room, text);
	}
};
