'use strict';

const assert = require('assert');

let sockets;

describe('Sockets workers', function () {
	before(function () {
		sockets = require('../../sockets-workers');

		this.mux = new sockets.Multiplexer();
		clearInterval(this.mux.cleanupInterval);
		this.mux.cleanupInterval = null;

		this.socket = require('../../dev-tools/sockets').createSocket();
	});

	afterEach(function () {
		this.mux.socketCounter = 0;
		this.mux.sockets.clear();
		this.mux.channels.clear();
	});

	after(function () {
		this.mux.tryDestroySocket(this.socket);
		this.socket = null;
		this.mux = null;
	});

	it('should parse more than two params', function () {
		let params = '1\n1\n0\n';
		let ret = this.mux.parseParams(params, 4);
		assert.deepStrictEqual(ret, ['1', '1', '0', '']);
	});

	it('should parse params with multiple newlines', function () {
		let params = '0\n|1\n|2';
		let ret = this.mux.parseParams(params, 2);
		assert.deepStrictEqual(ret, ['0', '|1\n|2']);
	});

	it('should add sockets on connect', function () {
		let res = this.mux.onSocketConnect(this.socket);
		assert.ok(res);
	});

	it('should remove sockets on disconnect', function () {
		this.mux.onSocketConnect(this.socket);
		let res = this.mux.onSocketDisconnect('0', this.socket);
		assert.ok(res);
	});

	it('should add sockets to channels', function () {
		this.mux.onSocketConnect(this.socket);
		let res = this.mux.onChannelAdd('global', '0');
		assert.ok(res);
		res = this.mux.onChannelAdd('global', '0');
		assert.ok(!res);
		this.mux.channels.set('lobby', new Map());
		res = this.mux.onChannelAdd('lobby', '0');
		assert.ok(res);
	});

	it('should remove sockets from channels', function () {
		this.mux.onSocketConnect(this.socket);
		this.mux.onChannelAdd('global', '0');
		let res = this.mux.onChannelRemove('global', '0');
		assert.ok(res);
		res = this.mux.onChannelRemove('global', '0');
		assert.ok(!res);
	});

	it('should move sockets to subchannels', function () {
		this.mux.onSocketConnect(this.socket);
		this.mux.onChannelAdd('global', '0');
		let res = this.mux.onSubchannelMove('global', '1', '0');
		assert.ok(res);
	});

	it('should broadcast to subchannels', function () {
		let messages = '|split\n0\n1\n2\n|\n|split\n3\n4\n5\n|';
		for (let i = 0; i < 3; i++) {
			let message = messages.replace(sockets.SUBCHANNEL_MESSAGE_REGEX, `$${i + 1}`);
			assert.strictEqual(message, `${i}\n${i + 3}`);
		}

		this.mux.onSocketConnect(this.socket);
		this.mux.onChannelAdd('global', '0');
		this.mux.onSubchannelMove('global', '1', '0');
		let res = this.mux.onSubchannelBroadcast('global', messages);
		assert.ok(res);
		this.mux.onChannelRemove('global', '0');
		res = this.mux.onSubchannelBroadcast('global', messages);
		assert.ok(!res);
	});
});
