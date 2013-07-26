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
 *   forward messages between the client and users.js.
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
			if (duration < 5*60*1000 && this.connections[ip] % 10 == 0) {
				if (this.connections[ip] >= 30) {
					if (this.connections[ip] % 30 == 0) this.log('IP '+ip+' rejected for '+this.connections[ip]+'th connection in the last '+duration.duration()+name);
					return true;
				}
				this.log('[ResourceMonitor] IP '+ip+' has connected '+this.connections[ip]+' times in the last '+duration.duration()+name);
			} else if (this.connections[ip] % 50 == 0) {
				if (this.connections[ip] >= 250) {
					if (this.connections[ip] % 50 == 0) this.log('IP '+ip+' rejected for '+this.connections[ip]+'th connection in the last '+duration.duration()+name);
					return true;
				}
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
	}
};

/*********************************************************
 * Start our servers
 *********************************************************/

// Static HTTP server

// This handles the custom CSS and custom avatar features, and also
// redirects yourserver:8001 to yourserver-8001.psim.us

// It's optional if you don't need these features.

var app = require('http').createServer();
var appssl;
if (config.ssl) {
	appssl = require('https').createServer(config.ssl.options);
}
try {
	(function() {
		var nodestatic = require('node-static');
		var cssserver = new nodestatic.Server('./config');
		var avatarserver = new nodestatic.Server('./config/avatars');
		var staticserver = new nodestatic.Server('./static');
		var staticRequestHandler = function(request, response) {
			request.resume();
			request.addListener('end', function() {
				if (config.customhttpresponse &&
						config.customhttpresponse(request, response)) {
					return;
				}
				var server;
				if (request.url === '/custom.css') {
					server = cssserver;
				} else if (request.url.substr(0, 9) === '/avatars/') {
					request.url = request.url.substr(8);
					server = avatarserver;
				} else {
					if (/^\/([A-Za-z0-9][A-Za-z0-9-]*)\/?$/.test(request.url)) {
						request.url = '/';
					}
					server = staticserver;
				}
				server.serve(request, response, function(e, res) {
					if (e && (e.status === 404)) {
						staticserver.serveFile('404.html', 404, {}, request, response);
					}
				});
			});
		};
		app.on('request', staticRequestHandler);
		if (appssl) {
			appssl.on('request', staticRequestHandler);
		}
	})();
} catch (e) {
	console.log('Could not start node-static - try `npm install` if you want to use it');
}

// SockJS server

// This is the main server that handles users connecting to our server
// and doing things on our server.

var sockjs = require('sockjs');

// Warning: Terrible hack here. The version of faye-websocket that we use has
//          a bug where sometimes the _cursor of a StreamReader ends up being
//          NaN, which leads to an infinite loop. The newest version of
//          faye-websocket has *other* bugs, so this really is the least
//          terrible option to deal with this critical issue.
(function() {
	var StreamReader = require('./node_modules/sockjs/node_modules/' +
			'faye-websocket/lib/faye/websocket/hybi_parser/stream_reader.js');
	var _read = StreamReader.prototype.read;
	StreamReader.prototype.read = function() {
		if (isNaN(this._cursor)) {
			// This will break out of the otherwise-infinite loop.
			return null;
		}
		return _read.apply(this, arguments);
	};
})();

var server = sockjs.createServer({
	sockjs_url: "//play.pokemonshowdown.com/js/lib/sockjs-0.3.min.js",
	log: function(severity, message) {
		if (severity === 'error') console.log('ERROR: '+message);
	},
	prefix: '/showdown',
	websocket: !config.disablewebsocket
});

// Make `app`, `appssl`, and `server` available to the console.
global.App = app;
global.AppSSL = appssl;
global.Server = server;

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

if (config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	process.on('uncaughtException', (function() {
		var lastCrash = 0;
		return function(err) {
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
		};
	})());
}

/*********************************************************
 * Set up the server to be connected to
 *********************************************************/

// this is global so it can be hotpatched if necessary
global.isTrustedProxyIp = (function() {
	if (!config.proxyip) {
		return function() {
			return false;
		};
	}
	var iplib = require('ip');
	var patterns = [];
	for (var i = 0; i < config.proxyip.length; ++i) {
		var range = config.proxyip[i];
		var parts = range.split('/');
		var subnet = iplib.toLong(parts[0]);
		var bits = (parts.length < 2) ? 32 : parseInt(parts[1], 10);
		var mask = -1 << (32 - bits);
		patterns.push([subnet & mask, mask]);
	}
	return function(ip) {
		var longip = iplib.toLong(ip);
		for (var i = 0; i < patterns.length; ++i) {
			var p = patterns[i];
			if ((longip & p[1]) === p[0]) {
				return true;
			}
		}
		return false;
	};
})();

var socketCounter = 0;
server.on('connection', function(socket) {
	if (!socket) {
		// For reasons that are not entirely clear, SockJS sometimes triggers
		// this event with a null `socket` argument.
		return;
	} else if (!socket.remoteAddress) {
		// This condition occurs several times per day. It may be a SockJS bug.
		try {
			socket.end();
		} catch (e) {}
		return;
	}
	socket.id = (++socketCounter);

	if (isTrustedProxyIp(socket.remoteAddress)) {
		var ips = (socket.headers['x-forwarded-for'] || '').split(',');
		var ip;
		while (ip = ips.pop()) {
			ip = ip.trim();
			if (!isTrustedProxyIp(ip)) {
				socket.remoteAddress = ip;
				break;
			}
		}
	}

	if (ResourceMonitor.countConnection(socket.remoteAddress)) {
		socket.end();
		return;
	}
	var checkResult = Users.checkBanned(socket.remoteAddress);
	if (checkResult) {
		console.log('CONNECT BLOCKED - IP BANNED: '+socket.remoteAddress+' ('+checkResult+')');
		socket.end();
		return;
	}
	// console.log('CONNECT: '+socket.remoteAddress+' ['+socket.id+']');
	var interval;
	if (config.herokuhack) {
		// see https://github.com/sockjs/sockjs-node/issues/57#issuecomment-5242187
		interval = setInterval(function() {
			try {
				socket._session.recv.didClose();
			} catch (e) {}
		}, 15000);
	}

	var connection;

	socket.on('data', function(message) {
		// Due to a bug in SockJS or Faye, if an exception propagates out of
		// the `data` event handler, the user will be disconnected on the next
		// `data` event. To prevent this, we log exceptions and prevent them
		// from propagating out of this function.
		try {
			// drop legacy JSON messages
			if (message.substr(0,1) === '{') return;

			// drop invalid messages without a pipe character
			var pipeIndex = message.indexOf('|');
			if (pipeIndex < 0) return;

			var roomid = message.substr(0, pipeIndex);
			var lines = message.substr(pipeIndex + 1);
			var room = Rooms.get(roomid);
			if (!room) room = Rooms.lobby || Rooms.global;
			var user = connection.user;
			if (lines.substr(0,3) === '>> ' || lines.substr(0,4) === '>>> ') {
				user.chat(lines, room, connection);
				return;
			}
			lines = lines.split('\n');
			for (var i=0; i<lines.length; i++) {
				if (user.chat(lines[i], room, connection) === false) break;
			}
		} catch (e) {
			var stack = e.stack + '\n\n';
			stack += 'Additional information:\n';
			stack += 'user = ' + user + '\n';
			stack += 'ip = ' + socket.remoteAddress + '\n';
			stack += 'roomid = ' + roomid + '\n';
			stack += 'message = ' + message;
			var err = {stack: stack};
			if (config.crashguard) {
				try {
					connection.sendTo(roomid||'lobby', '|html|<div class="broadcast-red"><b>Something crashed!</b><br />Don\'t worry, we\'re working on fixing it.</div>');
				} catch (e) {} // don't crash again...
				process.emit('uncaughtException', err);
			} else {
				throw err;
			}
		}
	});

	socket.on('close', function() {
		if (interval) {
			clearInterval(interval);
		}
		var user = connection.user;
		if (!user) return;
		user.onDisconnect(socket);
	});

	connection = Users.connectUser(socket);
});
server.installHandlers(app, {});
app.listen(config.port);
if (appssl) {
	server.installHandlers(appssl, {});
	appssl.listen(config.ssl.port);
}

console.log('Server started on port ' + config.port);
if (appssl) {
	console.log('SSL server started on port ' + config.ssl.port);
}

console.log('Test your server at http://localhost:' + config.port);

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

// load ipbans at our leisure
fs.readFile('./config/ipbans.txt', function (err, data) {
	if (err) return;
	data = (''+data).split("\n");
	for (var i=0; i<data.length; i++) {
		data[i] = data[i].split('#')[0].trim();
		if (data[i] && !Users.bannedIps[data[i]]) {
			Users.bannedIps[data[i]] = '#ipban';
		}
	}
});
