'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const Module = require('module');
const mock = require('mock-fs-require-fix');

const noop = () => {};

function getDirTypedContentsSync(dir, forceType) {
	// Return value can be fed to mock-fs
	if (forceType !== 'dir' && forceType !== 'file') throw new Error("Not implemented");
	return fs.readdirSync(dir).reduce(function (dict, elem) {
		dict[elem] = forceType === 'dir' ? {} : '';
		return dict;
	}, {});
}

function init(callback) {
	require('./../app');

	Rooms.RoomBattle.prototype.send = noop;
	Rooms.RoomBattle.prototype.receive = noop;
	for (let process of Rooms.SimulatorProcess.processes) {
		// Don't crash -we don't care of battle child processes.
		process.process.on('error', noop);
	}

	LoginServer.disabled = true;

	// Disable writing to modlog
	Rooms.Room.prototype.modlog = noop;

	callback();
}

before('initialization', function (done) {
	this.timeout(0); // Remove timeout limitation

	// Load and override configuration before starting the server
	let config;
	try {
		require.resolve('./../config/config');
	} catch (err) {
		if (err.code !== 'MODULE_NOT_FOUND') throw err; // Should never happen

		console.log("config.js doesn't exist - creating one with default settings...");
		fs.writeFileSync(path.resolve(__dirname, '../config/config.js'),
			fs.readFileSync(path.resolve(__dirname, '../config/config-example.js'))
		);
	} finally {
		config = require('./../config/config');
	}

	try {
		let chatRoomsPath = require.resolve('./../config/chatrooms.json');
		let chatRoomsData = require.cache[chatRoomsPath] = new Module(chatRoomsPath, module);
		chatRoomsData.filename = chatRoomsData.id;
		chatRoomsData.exports = []; // empty chatrooms list
		chatRoomsData.loaded = true;
	} catch (e) {}

	// Actually crash if we crash
	config.crashguard = false;

	// Don't try to write to file system
	config.logladderip = false;
	config.logchallenges = false;
	config.logchat = false;

	// Don't create a REPL
	require('./../repl').start = noop;

	// Sandbox file system: it's possible for a production server to be running in the same directory.
	// And using a sandbox is safer anyway.
	const fsSandbox = {
		'config': {},
		'chat-plugins': getDirTypedContentsSync('chat-plugins', 'file'),
		'mods': getDirTypedContentsSync('mods', 'dir'),
		'logs': {
			'chat': {}, 'ladderip': {}, 'modlog': {}, 'repl': {},
			'lastbattle.txt': '0',
		},
	};

	// `watchFile` is unsupported and throws with mock-fs
	Object.defineProperty(fs, 'watchFile', {
		get: function () {return noop;},
		set: noop,
	});
	mock(fsSandbox);

	init(done);
});

describe('Native timer/event loop globals', function () {
	let globalList = ['setTimeout', 'clearTimeout', 'setImmediate', 'clearImmediate'];
	for (let elem of globalList) {
		describe('`' + elem + '`', function () {
			it('should be a global function', function () {
				assert.strictEqual(typeof global[elem], 'function');
			});
		});
	}
});

describe('Battle simulation', function () {
	require('./simulator');
});

describe('mocks', function () {
	require('./mocks/Battle.spec');
});
