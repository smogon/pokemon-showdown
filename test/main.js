'use strict';

const path = require('path');
const fs = require('fs');

const noop = () => {};

before('initialization', function () {
	this.timeout(0); // Remove timeout limitation
	process.on('unhandledRejection', err => {
		// I'd throw the err, but we have a heisenbug on our hands and I'd
		// rather not have it screw with Travis in the interim
		console.log(err);
	});

	// Load and override configuration before starting the server
	let config;
	try {
		require.resolve('../config/config');
	} catch (err) {
		if (err.code !== 'MODULE_NOT_FOUND' && err.code !== 'ENOENT') throw err; // Should never happen

		console.log("config.js doesn't exist - creating one with default settings...");
		fs.writeFileSync(path.resolve(__dirname, '../config/config.js'),
			fs.readFileSync(path.resolve(__dirname, '../config/config-example.js'))
		);
	} finally {
		config = require('../config/config');
	}
	require('./../.lib-dist/process-manager').disabled = true;

	Object.assign(config, require('../config/config-example'));
	// Actually crash if we crash
	config.crashguard = false;
	// Don't allow config to be overridden while test is running
	config.watchconfig = false;
	// Don't try to write to file system
	config.nofswriting = true;
	// Test a normal ladder
	config.fakeladder = false;

	// Don't create a REPL
	require('../.lib-dist/repl').Repl.start = noop;

	// Start the server.
	require('../server');

	LoginServer.disabled = true;

	Ladders.disabled = true;
});
