/**
 * Main file
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is the main Pokemon Showdown app, and the file that the
 * `pokemon-showdown` script runs if you start Pokemon Showdown normally.
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
 *   It exports the global tables `Users.users` and `Users.connections`.
 *
 * Rooms - from rooms.ts
 *
 *   Every chat room and battle is a room, and what they do is done in
 *   rooms.ts. There's also a global room which every user is in, and
 *   handles miscellaneous things like welcoming the user.
 *
 *   It exports the global table `Rooms.rooms`.
 *
 * Dex - from sim/dex.ts
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
require('source-map-support').install();
// NOTE: This file intentionally doesn't use too many modern JavaScript
// features, so that it doesn't crash old versions of Node.js, so we
// can successfully print the "We require Node.js 16+" message.

// Check for version
const nodeVersion = parseInt(process.versions.node);
if (isNaN(nodeVersion) || nodeVersion < 16) {
	throw new Error("We require Node.js version 16 or later; you're using " + process.version);
}

import {FS, Repl} from '../lib';

/*********************************************************
 * Set up most of our globals
 * This is in a function because swc runs `import` before any code,
 * and many of our imports require the `Config` global to be set up.
 *********************************************************/
function setupGlobals() {
	const ConfigLoader = require('./config-loader');
	global.Config = ConfigLoader.Config;

	const {Monitor} = require('./monitor');
	global.Monitor = Monitor;
	global.__version = {head: ''};
	void Monitor.version().then((hash: any) => {
		global.__version.tree = hash;
	});
	Repl.cleanup();

	if (Config.watchconfig) {
		FS('config/config.js').onModify(() => {
			try {
				global.Config = ConfigLoader.load(true);
				// ensure that battle prefixes configured via the chat plugin are not overwritten
				// by battle prefixes manually specified in config.js
				Chat.plugins['username-prefixes']?.prefixManager.refreshConfig(true);
				Monitor.notice('Reloaded ../config/config.js');
			} catch (e: any) {
				Monitor.adminlog("Error reloading ../config/config.js: " + e.stack);
			}
		});
	}

	const {Dex} = require('../sim/dex');
	global.Dex = Dex;
	global.toID = Dex.toID;

	const {Teams} = require('../sim/teams');
	global.Teams = Teams;

	const {LoginServer} = require('./loginserver');
	global.LoginServer = LoginServer;

	const {Ladders} = require('./ladders');
	global.Ladders = Ladders;

	const {Chat} = require('./chat');
	global.Chat = Chat;

	const {Users} = require('./users');
	global.Users = Users;

	const {Punishments} = require('./punishments');
	global.Punishments = Punishments;

	const {Rooms} = require('./rooms');
	global.Rooms = Rooms;
	// We initialize the global room here because roomlogs.ts needs the Rooms global
	Rooms.global = new Rooms.GlobalRoomState();

	const Verifier = require('./verifier');
	global.Verifier = Verifier;
	Verifier.PM.spawn();

	const {Tournaments} = require('./tournaments');
	global.Tournaments = Tournaments;

	const {IPTools} = require('./ip-tools');
	global.IPTools = IPTools;
	void IPTools.loadHostsAndRanges();
}
setupGlobals();

if (Config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	process.on('uncaughtException', (err: Error) => {
		Monitor.crashlog(err, 'The main process');
	});

	process.on('unhandledRejection', err => {
		Monitor.crashlog(err as any, 'A main process Promise');
	});
}

/*********************************************************
 * Start networking processes to be connected to
 *********************************************************/

import {Sockets} from './sockets';
global.Sockets = Sockets;

export function listen(port: number, bindAddress: string, workerCount: number) {
	Sockets.listen(port, bindAddress, workerCount);
}

if (require.main === module) {
	// Launch the server directly when app.js is the main module. Otherwise,
	// in the case of app.js being imported as a module (e.g. unit tests),
	// postpone launching until app.listen() is called.
	let port;
	for (const arg of process.argv) {
		if (/^[0-9]+$/.test(arg)) {
			port = parseInt(arg);
			break;
		}
	}
	Sockets.listen(port);
}

/*********************************************************
 * Set up our last global
 *********************************************************/

import * as TeamValidatorAsync from './team-validator-async';
global.TeamValidatorAsync = TeamValidatorAsync;
TeamValidatorAsync.PM.spawn();

/*********************************************************
 * Start up the REPL server
 *********************************************************/

// eslint-disable-next-line no-eval
Repl.start('app', cmd => eval(cmd));

/*********************************************************
 * Fully initialized, run startup hook
 *********************************************************/

if (Config.startuphook) {
	process.nextTick(Config.startuphook);
}

if (Config.ofemain) {
	try {
		require.resolve('node-oom-heapdump');
	} catch (e: any) {
		if (e.code !== 'MODULE_NOT_FOUND') throw e; // should never happen
		throw new Error(
			'node-oom-heapdump is not installed, but it is a required dependency if Config.ofe is set to true! ' +
			'Run npm install node-oom-heapdump and restart the server.'
		);
	}

	// Create a heapdump if the process runs out of memory.
	global.nodeOomHeapdump = (require as any)('node-oom-heapdump')({
		addTimestamp: true,
	});
}
