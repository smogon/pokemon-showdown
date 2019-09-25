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
 * Users - from users.ts
 *
 *   Most of the communication with users happens in users.ts, we just
 *   forward messages between the sockets.js and users.ts.
 *
 * Rooms - from rooms.ts
 *
 *   Every chat room and battle is a room, and what they do is done in
 *   rooms.ts. There's also a global room which every user is in, and
 *   handles miscellaneous things like welcoming the user.
 *
 * Dex - from .sim-dist/dex.ts
 *
 *   Handles getting data about Pokemon, items, etc.
 *
 * Ladders - from ladders.ts and ladders-remote.ts
 *
 *   Handles Elo rating tracking for players.
 *
 * Chat - from chat.ts
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
	RegExp("\\p{Emoji}", "u");
} catch (e) {
	throw new Error("We require Node.js version 10 or later; you're using " + process.version);
}
try {
	require.resolve('../.sim-dist/index');
} catch (e) {
	throw new Error("Dependencies are unmet; run `node build` before launching Pokemon Showdown again.");
}

const FS = require('../.lib-dist/fs').FS;

/*********************************************************
 * Load configuration
 *********************************************************/

const ConfigLoader = require('../.server-dist/config-loader');
global.Config = ConfigLoader.Config;

global.Monitor = require('../.server-dist/monitor').Monitor;
global.__version = {head: ''};
Monitor.version().then(function (hash) {
	global.__version.tree = hash;
});

if (Config.watchconfig) {
	FS(require.resolve('../config/config')).onModify(() => {
		try {
			global.Config = ConfigLoader.load(true);
			if (global.Users) Users.cacheGroupData();
			Monitor.notice('Reloaded ../config/config.js');
		} catch (e) {
			Monitor.adminlog("Error reloading ../config/config.js: " + e.stack);
		}
	});
}

/*********************************************************
 * Set up most of our globals
 *********************************************************/

global.Dex = require('../.sim-dist/dex').Dex;
global.toID = Dex.getId;

global.LoginServer = require('../.server-dist/loginserver').LoginServer;

global.Ladders = require('../.server-dist/ladders').Ladders;

global.Chat = require('../.server-dist/chat').Chat;

global.Users = require('../.server-dist/users').Users;

global.Punishments = require('../.server-dist/punishments').Punishments;

global.Rooms = require('../.server-dist/rooms').Rooms;

global.Verifier = require('../.server-dist/verifier');
Verifier.PM.spawn();

global.Tournaments = require('../.server-dist/tournaments').Tournaments;

global.IPTools = require('../.server-dist/ip-tools').IPTools;
IPTools.loadDatacenters();

if (Config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	process.on('uncaughtException', err => {
		Monitor.crashlog(err, 'The main process');
	});
	process.on('unhandledRejection', err => {
		Monitor.crashlog(err, 'A main process Promise');
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

require('../.lib-dist/repl').Repl.start('app', cmd => eval(cmd));
