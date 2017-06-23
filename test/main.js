'use strict';

const path = require('path');
const fs = require('fs');

const noop = () => {};

before('initialization', function () {
	// Load and override configuration before starting the server
	let config;
	try {
		require.resolve('../config/config');
	} catch (err) {
		if (err.code !== 'MODULE_NOT_FOUND') throw err; // Should never happen

		console.log("config.js doesn't exist - creating one with default settings...");
		fs.writeFileSync(path.resolve(__dirname, '../config/config.js'),
			fs.readFileSync(path.resolve(__dirname, '../config/config-example.js'))
		);
	} finally {
		config = require('../config/config');
	}

	// Actually crash if we crash
	config.crashguard = false;
	// Don't allow config to be overridden while test is running
	config.watchconfig = false;
	// Don't try to write to file system
	config.nofswriting = true;

	// Don't create a REPL
	require('../repl').start = noop;

	// Start the server.
	require('../app');

	Rooms.RoomBattle.prototype.send = noop;
	Rooms.RoomBattle.prototype.receive = noop;
	for (let process of Rooms.SimulatorProcess.processes) {
		// Don't crash -we don't care of battle child processes.
		process.process.on('error', noop);
	}

	LoginServer.disabled = true;
});
