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
 *   Handles getting data about Pokemon, items, etc.
 *
 * Ladders - from ladders.js and ladders-remote.js
 *
 *   Handles Elo rating tracking for players.
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

'use strict';

/*********************************************************
 * Make sure we have everything set up correctly
 *********************************************************/

// Make sure our dependencies are available, and install them if they
// aren't

function runNpm(command) {
	if (require.main !== module) throw new Error("Dependencies unmet");

	command = 'npm ' + command + ' && ' + process.execPath + ' app.js';
	console.log('Running `' + command + '`...');
	require('child_process').spawn('sh', ['-c', command], {stdio: 'inherit', detached: true});
	process.exit(0);
}

const fs = require('fs');
const path = require('path');
try {
	require('sugar');
} catch (e) {
	runNpm('install --production');
}

/*********************************************************
 * Load configuration
 *********************************************************/

try {
	require.resolve('./config/config.js');
} catch (err) {
	if (err.code !== 'MODULE_NOT_FOUND') throw err; // should never happen

	// Copy it over synchronously from config-example.js since it's needed before we can start the server
	console.log("config.js doesn't exist - creating one with default settings...");
	fs.writeFileSync(path.resolve(__dirname, 'config/config.js'),
		fs.readFileSync(path.resolve(__dirname, 'config/config-example.js'))
	);
} finally {
	global.Config = require('./config/config.js');
}

if (Config.watchconfig) {
	fs.watchFile(path.resolve(__dirname, 'config/config.js'), function (curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		try {
			delete require.cache[require.resolve('./config/config.js')];
			global.Config = require('./config/config.js');
			if (global.Users) Users.cacheGroupData();
			console.log('Reloaded config/config.js');
		} catch (e) {}
	});
}

// Autoconfigure the app when running in cloud hosting environments:
try {
	let cloudenv = require('cloud-env');
	Config.bindaddress = cloudenv.get('IP', Config.bindaddress || '');
	Config.port = cloudenv.get('PORT', Config.port);
} catch (e) {}

if (require.main === module && process.argv[2]) {
	let port = parseInt(process.argv[2]); // eslint-disable-line radix
	if (port) {
		Config.port = port;
		Config.ssl = null;
	}
}

/*********************************************************
 * Set up most of our globals
 *********************************************************/

global.Monitor = require('./monitor.js');

global.Tools = require('./tools.js').includeFormats();
global.toId = Tools.getId;

global.LoginServer = require('./loginserver.js');

global.Ladders = require(Config.remoteladder ? './ladders-remote.js' : './ladders.js');

global.Users = require('./users.js');

global.Rooms = require('./rooms.js');

// Generate and cache the format list.
Rooms.global.formatListText = Rooms.global.getFormatListText();


delete process.send; // in case we're a child process
global.Verifier = require('./verifier.js');

global.CommandParser = require('./command-parser.js');

global.Simulator = require('./simulator.js');

global.Tournaments = require('./tournaments');

try {
	global.Dnsbl = require('./dnsbl.js');
} catch (e) {
	global.Dnsbl = {query: function () {}, reverse: require('dns').reverse};
}

global.Cidr = require('./cidr.js');

if (Config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	let lastCrash = 0;
	process.on('uncaughtException', function (err) {
		let dateNow = Date.now();
		let quietCrash = require('./crashlogger.js')(err, 'The main process', true);
		quietCrash = quietCrash || ((dateNow - lastCrash) <= 1000 * 60 * 5);
		lastCrash = Date.now();
		if (quietCrash) return;
		let stack = ("" + err.stack).escapeHTML().split("\n").slice(0, 2).join("<br />");
		if (Rooms.lobby) {
			Rooms.lobby.addRaw('<div class="broadcast-red"><b>THE SERVER HAS CRASHED:</b> ' + stack + '<br />Please restart the server.</div>');
			Rooms.lobby.addRaw('<div class="broadcast-red">You will not be able to talk in the lobby or start new battles until the server restarts.</div>');
		}
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

global.TeamValidator = require('./team-validator.js');

// load ipbans at our leisure
fs.readFile(path.resolve(__dirname, 'config/ipbans.txt'), function (err, data) {
	if (err) return;
	data = ('' + data).split("\n");
	let rangebans = [];
	for (let i = 0; i < data.length; i++) {
		data[i] = data[i].split('#')[0].trim();
		if (!data[i]) continue;
		if (data[i].includes('/')) {
			rangebans.push(data[i]);
		} else if (!Users.bannedIps[data[i]]) {
			Users.bannedIps[data[i]] = '#ipban';
		}
	}
	Users.checkRangeBanned = Cidr.checker(rangebans);
});

/*********************************************************
 * Start up the REPL server
 *********************************************************/

require('./repl.js').start('app', function (cmd) { return eval(cmd); });
