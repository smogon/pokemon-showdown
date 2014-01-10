/**
 * Main file
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is the main Pokemon Showdown app, and the file you should be
 * running to start Pokemon Showdown if you're using it normally.
 *
 * This file sets up our SockJS server, which handles communication
 * between users and your server, and also sets up globals. You can
 * see details in their corresponding files, but here's an overview:
 *
 * Users - from users.js
 *
 *   Most of the communication with users happens in users.js, we just
 *   forward messages between the sockets.js and users.js.
 *
 * Rooms - from rooms.js
 *
 *   Every chat room and battle is a room, and what they do is done in
 *   rooms.js. There's also a global room which every user is in, and
 *   handles miscellaneous things like welcoming the user.
 *
 * Tools - from tools.js
 *
 *   Handles getting data about Pokemon, items, etc. *
 *
 * Simulator - from simulator.js
 *
 *   Used to access the simulator itself.
 *
 * CommandParser - from command-parser.js
 *
 *   Parses text commands like /me
 *
 * Sockets - from sockets.js
 *
 *   Used to abstract out network connections. sockets.js handles
 *   the actual server and connection set-up.
 *
 * @license MIT license
 */

/*********************************************************
 * Make sure we have everything set up correctly
 *********************************************************/

// Make sure our dependencies are available, and install them if they
// aren't

function runNpm(command) {
	console.log('Running `npm ' + command + '`...');
	var child_process = require('child_process');
	var npm = child_process.spawn('npm', [command]);
	npm.stdout.on('data', function(data) {
		process.stdout.write(data);
	});
	npm.stderr.on('data', function(data) {
		process.stderr.write(data);
	});
	npm.on('close', function(code) {
		if (!code) {
			child_process.fork('app.js').disconnect();
		}
	});
}

try {
	require('sugar');
} catch (e) {
	return runNpm('install');
}
if (!Object.select) {
	return runNpm('update');
}

// Make sure config.js exists, and copy it over from config-example.js
// if it doesn't

global.fs = require('fs');
if (!('existsSync' in fs)) {
	fs.existsSync = require('path').existsSync;
}

// Synchronously, since it's needed before we can start the server
if (!fs.existsSync('./config/config.js')) {
	console.log("config.js doesn't exist - creating one with default settings...");
	fs.writeFileSync('./config/config.js',
		fs.readFileSync('./config/config-example.js')
	);
}

/*********************************************************
 * Load configuration
 *********************************************************/

global.config = require('./config/config.js');

var watchFile = function() {
	try {
		return fs.watchFile.apply(fs, arguments);
	} catch (e) {
		console.log('Your version of node does not support `fs.watchFile`');
	}
};

if (config.watchconfig) {
	watchFile('./config/config.js', function(curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		try {
			delete require.cache[require.resolve('./config/config.js')];
			config = require('./config/config.js');
			console.log('Reloaded config/config.js');
		} catch (e) {}
	});
}

if (process.argv[2] && parseInt(process.argv[2])) {
	config.port = parseInt(process.argv[2]);
}

global.ResourceMonitor = {
	connections: {},
	connectionTimes: {},
	battles: {},
	battleTimes: {},
	battlePreps: {},
	battlePrepTimes: {},
	networkUse: {},
	networkCount: {},
	cmds: {},
	cmdsTimes: {},
	cmdsTotal: {lastCleanup: Date.now(), count: 0},
	/**
	 * Counts a connection. Returns true if the connection should be terminated for abuse.
	 */
	log: function(text) {
		console.log(text);
		if (Rooms.rooms.staff) Rooms.rooms.staff.add('||'+text);
	},
	countConnection: function(ip, name) {
		var now = Date.now();
		var duration = now - this.connectionTimes[ip];
		name = (name ? ': '+name : '');
		if (ip in this.connections && duration < 30*60*1000) {
			this.connections[ip]++;
			if (duration < 5*60*1000 && this.connections[ip] % 20 === 0) {
				this.log('[ResourceMonitor] IP '+ip+' has connected '+this.connections[ip]+' times in the last '+duration.duration()+name);
			} else if (this.connections[ip] % 60 == 0) {
				this.log('[ResourceMonitor] IP '+ip+' has connected '+this.connections[ip]+' times in the last '+duration.duration()+name);
			}
		} else {
			this.connections[ip] = 1;
			this.connectionTimes[ip] = now;
		}
	},
	/**
	 * Counts a battle. Returns true if the connection should be terminated for abuse.
	 */
	countBattle: function(ip, name) {
		var now = Date.now();
		var duration = now - this.battleTimes[ip];
		name = (name ? ': '+name : '');
		if (ip in this.battles && duration < 30*60*1000) {
			this.battles[ip]++;
			if (duration < 5*60*1000 && this.battles[ip] % 15 == 0) {
				this.log('[ResourceMonitor] IP '+ip+' has battled '+this.battles[ip]+' times in the last '+duration.duration()+name);
			} else if (this.battles[ip] % 75 == 0) {
				this.log('[ResourceMonitor] IP '+ip+' has battled '+this.battles[ip]+' times in the last '+duration.duration()+name);
			}
		} else {
			this.battles[ip] = 1;
			this.battleTimes[ip] = now;
		}
	},
	/**
	 * Counts battle prep. Returns true if too much
	 */
	countPrepBattle: function(ip) {
		var now = Date.now();
		var duration = now - this.battlePrepTimes[ip];
		if (ip in this.battlePreps && duration < 3*60*1000) {
			this.battlePreps[ip]++;
			if (this.battlePreps[ip] > 6) {
				return true;
			}
		} else {
			this.battlePreps[ip] = 1;
			this.battlePrepTimes[ip] = now;
		}
	},
	/**
	 * data
	 */
	countNetworkUse: function(size) {
		if (this.activeIp in this.networkUse) {
			this.networkUse[this.activeIp] += size;
			this.networkCount[this.activeIp]++;
		} else {
			this.networkUse[this.activeIp] = size;
			this.networkCount[this.activeIp] = 1;
		}
	},
	writeNetworkUse: function() {
		var buf = '';
		for (var i in this.networkUse) {
			buf += ''+this.networkUse[i]+'\t'+this.networkCount[i]+'\t'+i+'\n';
		}
		fs.writeFile('logs/networkuse.tsv', buf);
	},
	clearNetworkUse: function() {
		this.networkUse = {};
		this.networkCount = {};
	},
	/**
	 * Counts roughly the size of an object to have an idea of the server load.
	 */
	sizeOfObject: function(object) {
		var objectList = [];
		var stack = [object];
		var bytes = 0;

		while (stack.length) {
			var value = stack.pop();
			if (typeof value === 'boolean') bytes += 4;
			else if (typeof value === 'string') bytes += value.length * 2;
			else if (typeof value === 'number') bytes += 8;
			else if (typeof value === 'object' && objectList.indexOf( value ) === -1) {
				objectList.push( value );
				for (i in value) stack.push( value[ i ] );
			}
		}

		return bytes;
	},
	/**
	 * Controls the amount of times a cmd command is used
	 */
	countCmd: function(ip, name) {
	 	var now = Date.now();
		var duration = now - this.cmdsTimes[ip];
		name = (name ? ': '+name : '');
		if (!this.cmdsTotal) this.cmdsTotal = {lastCleanup: 0, count: 0};
		if (now - this.cmdsTotal.lastCleanup > 60*1000) {
			this.cmdsTotal.count = 0;
			this.cmdsTotal.lastCleanup = now;
		}
		this.cmdsTotal.count++;
		if (ip in this.cmds && duration < 60*1000) {
			this.cmds[ip]++;
			if (duration < 60*1000 && this.cmds[ip] % 5 === 0) {
				if (this.cmds[ip] >= 3) {
					if (this.cmds[ip] % 30 === 0) this.log('CMD command from '+ip+' blocked for '+this.cmds[ip]+'th use in the last '+duration.duration()+name);
					return true;
				}
				this.log('[ResourceMonitor] IP '+ip+' has used CMD command '+this.cmds[ip]+' times in the last '+duration.duration()+name);
			} else if (this.cmds[ip] % 15 === 0) {
				this.log('CMD command from '+ip+' blocked for '+this.cmds[ip]+'th use in the last '+duration.duration()+name);
				return true;
			}
		} else if (this.cmdsTotal.count > 8000) {
			// One CMD check per user per minute on average (to-do: make this better)
			this.log('CMD command for '+ip+' blocked because CMD has been used '+this.cmdsTotal.count+' times in the last minute.');
			return true;
		} else {
			this.cmds[ip] = 1;
			this.cmdsTimes[ip] = now;
		}
	}
};

/*********************************************************
 * Set up most of our globals
 *********************************************************/

/**
 * Converts anything to an ID. An ID must have only lowercase alphanumeric
 * characters.
 * If a string is passed, it will be converted to lowercase and
 * non-alphanumeric characters will be stripped.
 * If an object with an ID is passed, its ID will be returned.
 * Otherwise, an empty string will be returned.
 */
global.toId = function(text) {
	if (text && text.id) text = text.id;
	else if (text && text.userid) text = text.userid;

	return string(text).toLowerCase().replace(/[^a-z0-9]+/g, '');
};
global.toUserid = toId;

/**
 * Sanitizes a username or Pokemon nickname
 *
 * Returns the passed name, sanitized for safe use as a name in the PS
 * protocol.
 *
 * Such a string must uphold these guarantees:
 * - must not contain any ASCII whitespace character other than a space
 * - must not start or end with a space character
 * - must not contain any of: | , [ ]
 * - must not be the empty string
 *
 * If no such string can be found, returns the empty string. Calling
 * functions are expected to check for that condition and deal with it
 * accordingly.
 *
 * toName also enforces that there are not multiple space characters
 * in the name, although this is not strictly necessary for safety.
 */
global.toName = function(name) {
	name = string(name);
	name = name.replace(/[\|\s\[\]\,]+/g, ' ').trim();
	if (name.length > 18) name = name.substr(0,18).trim();
	return name;
};

/**
 * Escapes a string for HTML
 * If strEscape is true, escapes it for JavaScript, too
 */
global.sanitize = function(str, strEscape) {
	str = (''+(str||''));
	str = str.escapeHTML();
	if (strEscape) str = str.replace(/'/g, '\\\'');
	return str;
};

/**
 * Safely ensures the passed variable is a string
 * Simply doing ''+str can crash if str.toString crashes or isn't a function
 * If we're expecting a string and being given anything that isn't a string
 * or a number, it's safe to assume it's an error, and return ''
 */
global.string = function(str) {
	if (typeof str === 'string' || typeof str === 'number') return ''+str;
	return '';
}

/**
 * Converts any variable to an integer (numbers get floored, non-numbers
 * become 0). Then clamps it between min and (optionally) max.
 */
global.clampIntRange = function(num, min, max) {
	if (typeof num !== 'number') num = 0;
	num = Math.floor(num);
	if (num < min) num = min;
	if (max !== undefined && num > max) num = max;
	return num;
};

global.LoginServer = require('./loginserver.js');

watchFile('./config/custom.css', function(curr, prev) {
	LoginServer.request('invalidatecss', {}, function() {});
});
LoginServer.request('invalidatecss', {}, function() {});

global.Users = require('./users.js');

global.Rooms = require('./rooms.js');

delete process.send; // in case we're a child process
global.Verifier = require('./verifier.js');

global.CommandParser = require('./command-parser.js');

global.Simulator = require('./simulator.js');

try {
	global.Dnsbl = require('./dnsbl.js');
} catch (e) {
	global.Dnsbl = {query:function(){}};
}

global.Cidr = require('./cidr.js');

if (config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	var lastCrash = 0;
	process.on('uncaughtException', function(err) {
		var dateNow = Date.now();
		var quietCrash = require('./crashlogger.js')(err, 'The main process');
		quietCrash = quietCrash || ((dateNow - lastCrash) <= 1000 * 60 * 5)
		lastCrash = Date.now();
		if (quietCrash) return;
		var stack = (""+err.stack).split("\n").slice(0,2).join("<br />");
		if (Rooms.lobby) {
			Rooms.lobby.addRaw('<div class="broadcast-red"><b>THE SERVER HAS CRASHED:</b> '+stack+'<br />Please restart the server.</div>');
			Rooms.lobby.addRaw('<div class="broadcast-red">You will not be able to talk in the lobby or start new battles until the server restarts.</div>');
		}
		config.modchat = 'crash';
		Rooms.global.lockdown = true;
	});
}

/*********************************************************
 * Start networking processes to be connected to
 *********************************************************/

global.Sockets = require('./sockets.js');

/*********************************************************
 * Set up our last global
 *********************************************************/

// This slow operation is done *after* we start listening for connections
// to the server. Anybody who connects while this require() is running will
// have to wait a couple seconds before they are able to join the server, but
// at least they probably won't receive a connection error message.
global.Tools = require('./tools.js');

// After loading tools, generate and cache the format list.
Rooms.global.formatListText = Rooms.global.getFormatListText();

global.TeamValidator = require('./team-validator.js');

// load ipbans at our leisure
fs.readFile('./config/ipbans.txt', function (err, data) {
	if (err) return;
	data = (''+data).split("\n");
	var rangebans = [];
	for (var i=0; i<data.length; i++) {
		data[i] = data[i].split('#')[0].trim();
		if (!data[i]) continue;
		if (data[i].indexOf('/') >= 0) {
			rangebans.push(data[i]);
		} else if (!Users.bannedIps[data[i]]) {
			Users.bannedIps[data[i]] = '#ipban';
		}
	}
	Users.checkRangeBanned = Cidr.checker(rangebans);
});
