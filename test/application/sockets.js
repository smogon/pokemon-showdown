'use strict';

const assert = require('assert');
const cluster = require('cluster');

function mute() {
	const streams = [process.stdout, process.stderr];
	const writers = streams.map(s => s.write);
	streams.forEach(s => {
		s.write = function (msg, cb) {
			if (cb) return cb();
		};
	});
	return () => {
		streams.forEach((s, i) => {
			s.write = writers[i];
		});
	};
}

describe('Sockets', function () {
	const numWorkers = () => Object.keys(Sockets.workers).length;
	const spawnWorker = () => (
		new Promise(resolve => {
			Sockets.spawnWorker();
			cluster.once('online', worker => {
				resolve(worker);
			});
		})
	);

	before(function () {
		// Let's gag the file so it doesn't vomit log messages all over the
		// terminal.
		this.muteCb = mute();
		cluster.settings.stdio = ['ignore', 'ignore', 'ignore', 'ipc'];
		cluster.removeAllListeners('disconnect');
	});

	after(function () {
		this.muteCb();
	});

	afterEach(function () {
		for (let i in Sockets.workers) {
			let worker = Sockets.workers[i];
			worker.kill();
			delete Sockets.workers[i];
		}
	});

	describe('master', function () {
		it('should be able to spawn workers', function () {
			assert.doesNotThrow(spawnWorker);
			assert.strictEqual(numWorkers(), 1);
		});

		it('should be able to spawn workers on listen', function () {
			Sockets.listen(0, '127.0.0.1', 4);
			assert.strictEqual(numWorkers(), 4);
		});

		// FIXME: a race condition where Sockets.killWorker deletes the worker
		// from the workers map only after having killed it breaks the
		// following two tests.
		it.skip('should be able to kill workers', function () {
			return spawnWorker().then(worker => {
				Sockets.killWorker(worker);
				worker.once('exit', () => {
					assert.strictEqual(numWorkers(), 0);
				});
			});
		});

		it.skip('should be able to kill workers by PID', function () {
			return spawnWorker().then(worker => {
				Sockets.killPid(worker.process.pid);
				worker.once('exit', () => {
					assert.strictEqual(numWorkers(), 0);
				});
			});
		});
	});

	describe('workers', function () {
		function mockWorker() {
			return spawnWorker().then(worker => {
				worker.removeAllListeners('message');
				worker.send(
					`$
					const {Session} = require('sockjs/lib/transport');
					const socket = new Session('aaaaaaaa', server);
					socket.remoteAddress = '127.0.0.1';
					socket.headers['x-forwarded-for'] = '';
					socket.protocol = 'websocket';
					socket.write = msg => process.send(msg);
					server.emit('connection', socket);`
				);
				return worker;
			});
		}

		it('should allow sockets to connect', function () {
			return mockWorker().then(worker => {
				worker.once('message', data => {
					let cmd = data.charAt(0);
					let [sid, ip, protocol] = data.substr(1).split('\n');
					assert.strictEqual(cmd, '*');
					assert.strictEqual(sid, '1');
					assert.strictEqual(ip, '127.0.0.1');
					assert.strictEqual(protocol, 'websocket');
				});
			});
		});

		it('should allow sockets to disconnect', function () {
			return mockWorker().then(worker => {
				worker.once('message', data => {
					let sid = data.substr(1, data.indexOf('\n'));
					Sockets.socketDisconnect(this.worker, sid);
					this.worker.once('message', res => {
						let cmd = res.charAt(0);
						let _sid = res.substr(1);
						assert.strictEqual(cmd, '!');
						assert.strictEqual(_sid, sid);
					});
				});
			});
		});

		it('should allow sockets to send messages', function () {
			return mockWorker().then(worker => {
				worker.once('message', data => {
					let sid = data.substr(1, data.indexOf('\n'));
					let msg = 'ayy lmao';
					Sockets.socketSend(this.worker, sid, msg);
					worker.once('message', res => {
						assert.strictEqual(res, msg);
					});
				});
			});
		});

		it('should allow sockets to receive messages', function () {
			return mockWorker().then(worker => {
				worker.once('message', data => {
					let sid = data.substr(1, data.indexOf('\n'));
					let msg = '|/cmd rooms';
					worker.once('message', res => {
						let cmd = res.charAt(0);
						let params = res.substr(1).split('\n');
						assert.strictEqual(cmd, '<');
						assert.strictEqual(sid, params[0]);
						assert.strictEqual(msg, params[1]);
					});
					worker.send(
						`$
						let socket = sockets[${sid}];
						socket.emit('data', ${msg});`
					);
				});
			});
		});

		it('should create a channel for the first socket to get added to it', function () {
			return mockWorker().then(worker => {
				worker.once('message', data => {
					let sid = data.substr(1, data.indexOf('\n'));
					let cid = 'global';
					Sockets.channelAdd(worker, cid, sid);
					worker.once('message', res => {
						assert.ok(res);
					});
					worker.send(
						`$
						let channel = channels[${cid}];
						if (channel) {
							let socket = channel[${sid}];
							if (socket) return process.send(true);
						}
						process.send(false);`
					);
				});
			});
		});

		it('should remove a channel if the last socket gets removed from it', function () {
			return mockWorker().then(worker => {
				worker.once('message', data => {
					let sid = data.substr(1, data.indexOf('\n'));
					let cid = 'global';
					Sockets.channelAdd(worker, cid, sid);
					Sockets.channelRemove(worker, cid, sid);
					worker.once('message', res => {
						assert.ok(res);
					});
					worker.send(
						`$
						let socket = sockets[${sid}];
						let channel = channels[${cid}];
						process.send(!socket && !channel);`
					);
				});
			});
		});

		it('should send to all sockets in a channel', function () {
			return mockWorker().then(worker => {
				worker.once('message', data => {
					let sid = data.substr(1, data.indexOf('\n'));
					let cid = 'global';
					let msg = 'ayy lmao';
					worker.once('message', () => {
						Sockets.channelSend(worker, cid, msg);
						worker.on('message', res => {
							assert.strictEqual(res, msg);
						});
					});
					worker.send(
						`$
						let socket = sockets[${sid}];
						for (let i = 2; i < 6; i++) {
							sockets[i] = Object.assign({}, socket, {id: i});
						}
						process.send()`
					);
				});
			});
		});

		it('should create a subchannel when moving a socket to it', function () {
			return mockWorker().then(worker => {
				worker.once('message', data => {
					let sid = data.substr(1, data.indexOf('\n'));
					let cid = 'battle-ou-1';
					let scid = '0';
					Sockets.channelAdd(worker, cid, sid);
					Sockets.subchannelMove(worker, cid, scid, sid);
					worker.once('message', res => {
						assert.ok(res);
					});
					worker.send(
						`$
						let socket = sockets[${sid}];
						let subchannel = subchannels[${cid}];
						if (subchannel) subchannel = subchannel[${scid}];
						process.send(!!subchannel && !!subchannel[${sid}])`
					);
				});
			});
		});
	});
});
