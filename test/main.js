var assert = require('assert');
var path = require('path');
var net = require('net');
var fs = require('fs');

var testPort;
function getPort(callback) {
	var port = testPort;
	var server = net.createServer();

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

function init(callback) {
	require('./../app.js');
	process.listeners('uncaughtException').forEach(function (listener) {
		process.removeListener('uncaughtException', listener);
	});

	// Run the battle engine in the main process to keep our sanity
	var BattleEngine = global.BattleEngine = require('./../battle-engine.js');
	process.listeners('message').forEach(function (listener) {
		process.removeListener('message', listener);
	});

	// Turn IPC methods into no-op
	BattleEngine.Battle.prototype.send = function () {};
	BattleEngine.Battle.prototype.receive = function () {};

	var Simulator = global.Simulator;
	Simulator.Battle.prototype.send = function () {};
	Simulator.Battle.prototype.receive = function () {};
	Simulator.SimulatorProcess.processes.forEach(function (process) {
		// Don't crash -we don't care of battle child processes.
		process.process.on('error', function () {});
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
	var config;
	try {
		config = require('./../config/config.js');
	} catch (err) {
		if (err.code !== 'MODULE_NOT_FOUND') throw err;

		console.log("config.js doesn't exist - creating one with default settings...");
		fs.writeFileSync(path.resolve(__dirname, '../config/config.js'),
			fs.readFileSync(path.resolve(__dirname, '../config/config-example.js'))
		);
		config = require('./../config/config.js');
	}

	// Don't listen at SSL port
	config.ssl = null;

	// Make sure that there are no net conflicts with an active server
	if (typeof config.testport !== 'undefined') {
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
	var globalList = ['setTimeout', 'clearTimeout', 'setImmediate', 'clearImmediate'];
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
