'use strict';

const assert = require('assert');
const cluster = require('cluster');

describe.skip('Sockets', function () {
	const spawnWorker = () => (
		new Promise(resolve => {
			let worker = Sockets.spawnWorker();
			worker.removeAllListeners('message');
			resolve(worker);
		})
	);

	before(function () {
		cluster.settings.silent = true;
		cluster.removeAllListeners('disconnect');
	});

	afterEach(function () {
		Sockets.workers.forEach((worker, workerid) => {
			worker.kill();
			Sockets.workers.delete(workerid);
		});
	});

	describe('master', function () {
		it('should be able to spawn workers', function () {
			Sockets.spawnWorker();
			assert.strictEqual(Sockets.workers.size, 1);
		});

		it('should be able to spawn workers on listen', function () {
			Sockets.listen(0, '127.0.0.1', 1);
			assert.strictEqual(Sockets.workers.size, 1);
		});

		it('should be able to kill workers', function () {
			return spawnWorker().then(worker => {
				Sockets.killWorker(worker);
				assert.strictEqual(Sockets.workers.size, 0);
			});
		});

		it('should be able to kill workers by PID', function () {
			return spawnWorker().then(worker => {
				Sockets.killPid(worker.process.pid);
				assert.strictEqual(Sockets.workers.size, 0);
			});
		});
	});

	describe('workers', function () {
		// This composes a sequence of HOFs that send a message to a worker,
		// wait for its response, then return the worker for the next function
		// to use.
		const chain = (eventHandler, msg) => worker => {
			worker.once('message', eventHandler(worker));
			msg = msg || `$
				const {Session} = require('sockjs/lib/transport');
				const socket = new Session('aaaaaaaa', server);
				socket.remoteAddress = '127.0.0.1';
				if (!('headers' in socket)) socket.headers = {};
				socket.headers['x-forwarded-for'] = '';
				socket.protocol = 'websocket';
				socket.write = msg => process.send(msg);
				server.emit('connection', socket);`;
			worker.send(msg);
			return worker;
		};

		const spawnSocket = eventHandler => spawnWorker().then(chain(eventHandler));

		it('should allow sockets to connect', function () {
			return spawnSocket(worker => data => {
				let cmd = data.charAt(0);
				let [sid, ip, protocol] = data.substr(1).split('\n');
				assert.strictEqual(cmd, '*');
				assert.strictEqual(sid, '1');
				assert.strictEqual(ip, '127.0.0.1');
				assert.strictEqual(protocol, 'websocket');
			});
		});

		it('should allow sockets to disconnect', function () {
			let querySocket;
			return spawnSocket(worker => data => {
				let sid = data.substr(1, data.indexOf('\n'));
				querySocket = `$
					let socket = sockets.get(${sid});
					process.send(!socket);`;
				Sockets.socketDisconnect(worker, sid);
			}).then(chain(worker => data => {
				assert.ok(data);
			}, querySocket));
		});

		it('should allow sockets to send messages', function () {
			let msg = 'ayy lmao';
			let socketSend;
			return spawnSocket(worker => data => {
				let sid = data.substr(1, data.indexOf('\n'));
				socketSend = `>${sid}\n${msg}`;
			}).then(chain(worker => data => {
				assert.strictEqual(data, msg);
			}, socketSend));
		});

		it('should allow sockets to receive messages', function () {
			let sid;
			let msg;
			let mockReceive;
			return spawnSocket(worker => data => {
				sid = data.substr(1, data.indexOf('\n'));
				msg = '|/cmd rooms';
				mockReceive = `$
					let socket = sockets.get(${sid});
					socket.emit('data', ${msg});`;
			}).then(chain(worker => data => {
				let cmd = data.charAt(0);
				let params = data.substr(1).split('\n');
				assert.strictEqual(cmd, '<');
				assert.strictEqual(sid, params[0]);
				assert.strictEqual(msg, params[1]);
			}, mockReceive));
		});

		it('should create a channel for the first socket to get added to it', function () {
			let queryChannel;
			return spawnSocket(worker => data => {
				let sid = data.substr(1, data.indexOf('\n'));
				let cid = 'global';
				queryChannel = `$
					let channel = channels.get(${cid});
					process.send(channel && channel.has(${sid}));`;
				Sockets.channelAdd(worker, cid, sid);
			}).then(chain(worker => data => {
				assert.ok(data);
			}, queryChannel));
		});

		it('should remove a channel if the last socket gets removed from it', function () {
			let queryChannel;
			return spawnSocket(worker => data => {
				let sid = data.substr(1, data.indexOf('\n'));
				let cid = 'global';
				queryChannel = `$
					process.send(!sockets.has(${sid}) && !channels.has(${cid}));`;
				Sockets.channelAdd(worker, cid, sid);
				Sockets.channelRemove(worker, cid, sid);
			}).then(chain(worker => data => {
				assert.ok(data);
			}, queryChannel));
		});

		it('should send to all sockets in a channel', function () {
			let msg = 'ayy lmao';
			let cid = 'global';
			let channelSend = `#${cid}\n${msg}`;
			return spawnSocket(worker => data => {
				let sid = data.substr(1, data.indexOf('\n'));
				Sockets.channelAdd(worker, cid, sid);
			}).then(chain(worker => data => {
				assert.strictEqual(data, msg);
			}, channelSend));
		});

		it('should create a subchannel when moving a socket to it', function () {
			let querySubchannel;
			return spawnSocket(worker => data => {
				let sid = data.substr(1, data.indexOf('\n'));
				let cid = 'battle-ou-1';
				let scid = '1';
				querySubchannel = `$
					let subchannel = subchannels[${cid}];
					process.send(!!subchannel && (subchannel.get(${sid}) === ${scid}));`;
				Sockets.subchannelMove(worker, cid, scid, sid);
			}).then(chain(worker => data => {
				assert.ok(data);
			}, querySubchannel));
		});

		it('should remove a subchannel when removing its last socket', function () {
			let querySubchannel;
			return spawnSocket(worker => data => {
				let sid = data.substr(1, data.indexOf('\n'));
				let cid = 'battle-ou-1';
				let scid = '1';
				querySubchannel = `$
					let subchannel = subchannels.get(${cid});
					process.send(!!subchannel && (subchannel.get(${sid}) === ${scid}));`;
				Sockets.subchannelMove(worker, cid, scid, sid);
				Sockets.channelRemove(worker, cid, sid);
			}).then(chain(worker => data => {
				assert.ok(data);
			}, querySubchannel));
		});

		it('should send to sockets in a subchannel', function () {
			let cid = 'battle-ou-1';
			let msg = 'ayy lmao';
			let subchannelSend = `.${cid}\n\n|split\n\n${msg}\n\n`;
			return spawnSocket(worker => data => {
				let sid = data.substr(1, data.indexOf('\n'));
				let scid = '1';
				Sockets.subchannelMove(worker, cid, scid, sid);
			}).then(chain(worker => data => {
				assert.strictEqual(data, msg);
			}, subchannelSend));
		});
	});
});
