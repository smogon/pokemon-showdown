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

fs = require('fs');
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

config = require('./config/config.js');

if (config.watchconfig) {
	fs.watchFile('./config/config.js', function(curr, prev) {
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
if (process.argv[3]) {
	config.setuid = process.argv[3];
}

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
					if (/^\/(teambuilder|ladder|lobby|battle)\/?$/.test(request.url) ||
							/^\/(lobby|battle)-([A-Za-z0-9-]*)$/.test(request.url)) {
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

var server = require('sockjs').createServer({
	sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js",
	log: function(severity, message) {
		if (severity === 'error') console.log('ERROR: '+message);
	},
	prefix: '/showdown'
});

// Make `app`, `appssl`, and `server` available to the console.
App = app;
AppSSL = appssl;
Server = server;

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
toId = function(text) {
	if (text && text.id) text = text.id;
	else if (text && text.userid) text = text.userid;

	return string(text).toLowerCase().replace(/[^a-z0-9]+/g, '');
};
toUserid = toId;

/**
 * Validates a username or Pokemon nickname
 */
var bannedNameStartChars = {'~':1, '&':1, '@':1, '%':1, '+':1, '-':1, '!':1, '?':1, '#':1, ' ':1};
toName = function(name) {
	name = string(name);
	name = name.replace(/[\|\s\[\]\,]+/g, ' ').trim();
	while (bannedNameStartChars[name.charAt(0)]) {
		name = name.substr(1);
	}
	if (name.length > 18) name = name.substr(0,18);
	if (config.namefilter) {
		name = config.namefilter(name);
	}
	return name;
};

/**
 * Escapes a string for HTML
 * If strEscape is true, escapes it for JavaScript, too
 */
sanitize = function(str, strEscape) {
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
string = function(str) {
	if (typeof str === 'string' || typeof str === 'number') return ''+str;
	return '';
}

/**
 * Converts any variable to an integer (numbers get floored, non-numbers
 * become 0). Then clamps it between min and (optionally) max.
 */
clampIntRange = function(num, min, max) {
	if (typeof num !== 'number') num = 0;
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
};

try {
	if (config.setuid) {
		process.setuid(config.setuid);
		console.log("setuid succeeded, we are now running as "+config.setuid);
	}
}
catch (err) {
	console.log("ERROR: setuid failed: [%s] Call: [%s]", err.message, err.syscall);
	process.exit(1);
}

LoginServer = require('./loginserver.js');

Data = {};

Users = require('./users.js');

Rooms = require('./rooms.js');

delete process.send; // in case we're a child process
Verifier = require('./verifier.js');

CommandParser = require('./command-parser.js');

Simulator = require('./simulator.js');

lockdown = false;

sendData = function(socket, data) {
	socket.write(data);
};

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
			Rooms.lobby.addRaw('<div class="broadcast-red"><b>THE SERVER HAS CRASHED:</b> '+stack+'<br />Please restart the server.</div>');
			Rooms.lobby.addRaw('<div class="broadcast-red">You will not be able to talk in the lobby or start new battles until the server restarts.</div>');
			config.modchat = 'crash';
			lockdown = true;
		};
	})());
}

/*********************************************************
 * Set up the server to be connected to
 *********************************************************/

var socketCounter = 0;
server.on('connection', function(socket) {
	if (!socket.remoteAddress) {
		// This condition occurs several times per day. It may be a SockJS bug.
		try {
			socket.end();
		} catch (e) {}
		return;
	}
	socket.id = (++socketCounter);

	if (config.proxyip && (config.proxyip.indexOf(socket.remoteAddress) >= 0)) {
		var ips = (socket.headers['x-forwarded-for'] || '').split(',');
		var ip;
		while (ip = ips.pop()) {
			ip = ip.trim();
			if (config.proxyip.indexOf(ip) < 0) {
				socket.remoteAddress = ip;
				break;
			}
		}
	}

	if (Users.checkBanned(socket.remoteAddress)) {
		console.log('CONNECT BLOCKED - IP BANNED: '+socket.remoteAddress);
		socket.end();
		return;
	}
	console.log('CONNECT: '+socket.remoteAddress+' ['+socket.id+']');
	var interval;
	if (config.herokuhack) {
		// see https://github.com/sockjs/sockjs-node/issues/57#issuecomment-5242187
		interval = setInterval(function() {
			try {
				socket._session.recv.didClose();
			} catch (e) {}
		}, 15000);
	}

	var you;

	socket.on('data', function(message) {
		if (message.substr(0,1) === '{') return; // drop legacy JSON messages

		var youUser = you.user;
		if (!youUser) {
			// User has already disconnected from server.
			// It is not clear how this could happen and it may be impossible.
			console.log('WARNING: youUser is empty in `data` event!');
			return;
		}

		var pipeIndex = message.indexOf('|');
		if (pipeIndex < 0) return; // invalid message format

		var roomid = message.substr(0, pipeIndex);
		var lines = message.substr(pipeIndex + 1);
		var room = Rooms.get(roomid, 'lobby');
		lines.split('\n').forEach(function(text){
			youUser.chat(text, room, you);
		});
	});

	socket.on('close', function() {
		if (interval) {
			clearInterval(interval);
		}
		var youUser = you.user;
		if (!youUser) return;
		youUser.onDisconnect(socket);
	});

	you = Users.connectUser(socket);
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
Tools = require('./tools.js');

// After loading tools, generate and cache the format list.
Rooms.global.formatListText = Rooms.global.getFormatListText();
