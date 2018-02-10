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
 * Dex - from sim/dex.js
 *
 *   Handles getting data about Pokemon, items, etc.
 *
 * Ladders - from ladders.js and ladders-remote.js
 *
 *   Handles Elo rating tracking for players.
 *
 * Chat - from chat.js
 *
 *   Handles chat and parses chat commands like /me and /ban
 *
 * Sockets - from sockets.js
 *
 *   Used to abstract out network connections. sockets.js handles
 *   the actual server and connection set-up.
 *
 * @license MIT
 */

'use strict';

// NOTE: This file intentionally doesn't use too many modern JavaScript
// features, so that it doesn't crash old versions of Node.js, so we
// can successfully print the "We require Node.js 8+" message.

// Check for version and dependencies
try {
	// I've gotten enough reports by people who don't use the launch
	// script that this is worth repeating here
	eval('{ let a = async () => {}; }');
} catch (e) {
	throw new Error("We require Node.js version 8 or later; you're using " + process.version);
}
try {
	require.resolve('sockjs');
} catch (e) {
	throw new Error("Dependencies are unmet; run node pokemon-showdown before launching Pokemon Showdown again.");
}

const FS = require('./lib/fs');

/*********************************************************
 * Load configuration
 *********************************************************/

try {
	require.resolve('./config/config');
} catch (err) {
	if (err.code !== 'MODULE_NOT_FOUND') throw err; // should never happen
	throw new Error('config.js does not exist; run node pokemon-showdown to set up the default config file before launching Pokemon Showdown again.');
}

global.Config = require('./config/config');

global.Monitor = require('./monitor');

if (Config.watchconfig) {
	let configPath = require.resolve('./config/config');
	FS(configPath).onModify(() => {
		try {
			delete require.cache[configPath];
			global.Config = require('./config/config');
			if (global.Users) Users.cacheGroupData();
			Monitor.notice('Reloaded config/config.js');
		} catch (e) {
			Monitor.adminlog("Error reloading config/config.js: " + e.stack);
		}
	});
}

/*********************************************************
 * Set up most of our globals
 *********************************************************/

global.Dex = require('./sim/dex');
global.toId = Dex.getId;

global.LoginServer = require('./loginserver');

global.Ladders = require('./ladders');

global.Users = require('./users');

global.Punishments = require('./punishments');

global.Chat = require('./chat');

global.Rooms = require('./rooms');

global.Verifier = require('./verifier');
Verifier.PM.spawn();

global.Tournaments = require('./tournaments');

global.Dnsbl = require('./dnsbl');
Dnsbl.loadDatacenters();

if (Config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	process.on('uncaughtException', err => {
		let crashType = require('./lib/crashlogger')(err, 'The main process');
		if (crashType === 'lockdown') {
			Rooms.global.startLockdown(err);
		} else {
			Rooms.global.reportCrash(err);
		}
	});
	process.on('unhandledRejection', err => {
		let crashType = require('./lib/crashlogger')(err, 'A main process Promise');
		if (crashType === 'lockdown') {
			Rooms.global.startLockdown(err);
		} else {
			Rooms.global.reportCrash(err);
		}
	});
}

/*********************************************************
 * Start networking processes to be connected to
 *********************************************************/

global.Sockets = require('./sockets');

exports.listen = function (port, bindAddress, workerCount) {
	Sockets.listen(port, bindAddress, workerCount);
};

if (require.main === module) {
	// Launch the server directly when app.js is the main module. Otherwise,
	// in the case of app.js being imported as a module (e.g. unit tests),
	// postpone launching until app.listen() is called.
	let port;
	if (process.argv[2]) port = parseInt(process.argv[2]);
	Sockets.listen(port);
}

/*********************************************************
 * Set up our last global
 *********************************************************/

global.TeamValidatorAsync = require('./team-validator-async');
TeamValidatorAsync.PM.spawn();

/*********************************************************
 * Start up the REPL server
 *********************************************************/

require('./lib/repl').start('app', cmd => eval(cmd));
