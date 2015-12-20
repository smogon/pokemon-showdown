'use strict';

const assert = require('assert');
const path = require('path');
const net = require('net');
const fs = require('fs');
const Module = require('module');

const mock = require('mock-fs');

const noop = function () {};

let testPort;
function getPort(callback) {
	let port = testPort;
	let server = net.createServer();

	server.listen(port, function (err) {
		server.once('close', function onclose() {
			callback(port);
		});
		server.close();
	});
	server.on('error', function (err) {
		testPort++;
		getPort(callback);
	});
}

function getDirTypedContentsSync(dir, forceType) {
	// Return value can be fed to mock-fs
	if (forceType !== 'dir' && forceType !== 'file') throw new Error("Not implemented");
	return fs.readdirSync(dir).reduce(function (dict, elem) {
		dict[elem] = forceType === 'dir' ? {} : '';
		return dict;
	}, {});
}

function init(callback) {
	require('./../app.js');
	process.listeners('uncaughtException').forEach(function (listener) {
		process.removeListener('uncaughtException', listener);
	});

	// Run the battle engine in the main process to keep our sanity
	let BattleEngine = global.BattleEngine = require('./../battle-engine.js');
	process.listeners('message').forEach(function (listener) {
		process.removeListener('message', listener);
	});

	// Turn IPC methods into no-op
	BattleEngine.Battle.prototype.send = noop;
	BattleEngine.Battle.prototype.receive = noop;

	let Simulator = global.Simulator;
	Simulator.Battle.prototype.send = noop;
	Simulator.Battle.prototype.receive = noop;
	Simulator.SimulatorProcess.processes.forEach(function (process) {
		// Don't crash -we don't care of battle child processes.
		process.process.on('error', noop);
	});

	LoginServer.disabled = true;

	// Deterministic tests
	BattleEngine.Battle.prototype._init = BattleEngine.Battle.prototype.init;
	BattleEngine.Battle.prototype.init = function (roomid, formatarg, rated) {
		this._init(roomid, formatarg, rated);
		this.seed = this.startingSeed = [0x09d56, 0x08642, 0x13656, 0x03653];
	};

	callback();
}

before('initialization', function (done) {
	this.timeout(0); // Remove timeout limitation

	// Load and override configuration before starting the server
	let config;
	try {
		require.resolve('./../config/config.js');
	} catch (err) {
		if (err.code !== 'MODULE_NOT_FOUND') throw err; // Should never happen

		console.log("config.js doesn't exist - creating one with default settings...");
		fs.writeFileSync(path.resolve(__dirname, '../config/config.js'),
			fs.readFileSync(path.resolve(__dirname, '../config/config-example.js'))
		);
	} finally {
		config = require('./../config/config.js');
	}

	try {
		let chatRoomsPath = require.resolve('./../config/chatrooms.json');
		let chatRoomsData = require.cache[chatRoomsPath] = new Module(chatRoomsPath, module);
		chatRoomsData.filename = chatRoomsData.id;
		chatRoomsData.exports = []; // empty chatrooms list
		chatRoomsData.loaded = true;
	} catch (e) {}

	// Don't listen at SSL port
	config.ssl = null;

	// Actually, don't listen at any port for now
	config.workers = 0;

	// Don't try to write to file system
	config.logladderip = false;
	config.logchallenges = false;
	config.logchat = false;

	// Sandbox file system: it's possible for a production server to be running in the same directory.
	// And using a sandbox is safer anyway.
	const fsSandbox = {
		'config': {},
		'chat-plugins': getDirTypedContentsSync('chat-plugins', 'file'),
		'mods': getDirTypedContentsSync('mods', 'dir'),
		'logs': {
			'chat': {}, 'ladderip': {}, 'modlog': {}, 'repl': {},
			'lastbattle.txt': '0'
		}
	};

	// Node's module loading system should be backed up by the real file system.
	Module.__resolveFilename__ = Module._resolveFilename;
	Module._resolveFilename = function (request, parent) {
		if (request === 'fs') return this.__resolveFilename__(request, parent);
		mock.restore();
		try {
			return this.__resolveFilename__(request, parent);
		} finally {
			mock(fsSandbox);
		}
	};
	for (let ext in Module._extensions) {
		let defaultLoader = Module._extensions[ext];
		Module._extensions[ext] = function (module, filename) {
			mock.restore();
			try {
				return defaultLoader(module, filename);
			} finally {
				mock(fsSandbox);
			}
		};
	}
	Module.prototype.__compile__ = Module.prototype._compile;
	Module.prototype._compile = function (content, filename) {
		// Use the sandbox to evaluate the code in our modules.
		mock(fsSandbox);
		try {
			return this.__compile__(content, filename);
		} finally {
			mock.restore();
		}
	};

	// `watchFile` is unsupported and throws with mock-fs
	Object.defineProperty(fs, 'watchFile', {
		get: function () {return noop;},
		set: noop
	});
	mock(fsSandbox);

	// Make sure that there are no net conflicts with an active server
	if (typeof config.testport !== 'undefined' || config.workers === 0) {
		config.port = config.testport;
		init(done);
	} else {
		testPort = config.port;
		getPort(function (port) {
			config.port = port;
			init(done);
		});
	}
});

describe('Native timer/event loop globals', function () {
	let globalList = ['setTimeout', 'clearTimeout', 'setImmediate', 'clearImmediate'];
	globalList.forEach(function (elem) {
		describe('`' + elem + '`', function () {
			it('should be a global function', function () {
				assert.strictEqual(typeof global[elem], 'function');
			});
		});
	});
});

describe('Battle simulation', function () {
	require('./simulator');
});
