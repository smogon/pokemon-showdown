var assert = require('assert');

before('initialization', function () {
	this.timeout(0); // Remove timeout limitation

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

describe('Custom globals', function () {
	var globalList = [
		'Config', 'ResourceMonitor', 'toId', 'toName', 'string', 'LoginServer',
		'Users', 'Rooms', 'Verifier', 'CommandParser', 'Simulator', 'Tournaments',
		'Dnsbl', 'Cidr', 'Sockets', 'Tools', 'TeamValidator'
	];
	globalList.forEach(function (elem) {
		describe('`' + elem + '`', function () {
			it('should be a global', function () {
				assert.ok(global.hasOwnProperty(elem));
			});
		});
	});
});

describe('Battle simulation', function () {
	require('./simulator');
});
