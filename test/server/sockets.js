'use strict';

// These tests have not been updated to reflect the latest version of Sockets
// Anyone should feel free to try to rewrite them to work

/*

const assert = require('assert').strict;
const cluster = require('cluster');

describe('Sockets', function () {
	const spawnWorker = () => (
		new Promise(resolve => {
			const worker = Sockets.spawnWorker();
			worker.removeAllListeners('message');
			resolve(worker);
		})
	);

	before(function () {
		cluster.settings.silent = true;
		cluster.removeAllListeners('disconnect');
	});

	afterEach(function () {
		for (const [workerid, worker] of Sockets.workers) {
			worker.kill();
			Sockets.workers.delete(workerid);
		}
	});

	describe('master', function () {
		it('should be able to spawn workers', function () {
			Sockets.spawnWorker();
			assert.equal(Sockets.workers.size, 1);
		});

		it('should be able to spawn workers on listen', function () {
			Sockets.listen(0, '127.0.0.1', 1);
			assert.equal(Sockets.workers.size, 1);
		});

		it('should be able to kill workers', function () {
			return spawnWorker().then(worker => {
				Sockets.killWorker(worker);
				assert.equal(Sockets.workers.size, 0);
			});
		});

		it('should be able to kill workers by PID', function () {
			return spawnWorker().then(worker => {
				Sockets.killPid(worker.process.pid);
				assert.equal(Sockets.workers.size, 0);
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
				const cmd = data.charAt(0);
				const [sid, ip, protocol] = data.substr(1).split('\n');
				assert.equal(cmd, '*');
				assert.equal(sid, '1');
				assert.equal(ip, '127.0.0.1');
				assert.equal(protocol, 'websocket');
			});
		});

		it('should allow sockets to disconnect', function () {
			let querySocket;
			return spawnSocket(worker => data => {
				const sid = data.substr(1, data.indexOf('\n'));
				querySocket = `$
					let socket = sockets.get(${sid});
					process.send(!socket);`;
				Sockets.socketDisconnect(worker, sid);
			}).then(chain(worker => data => {
				assert(data);
			}, querySocket));
		});

		it('should allow sockets to send messages', function () {
			const msg = 'ayy lmao';
			let socketSend;
			return spawnSocket(worker => data => {
				const sid = data.substr(1, data.indexOf('\n'));
				socketSend = `>${sid}\n${msg}`;
			}).then(chain(worker => data => {
				assert.equal(data, msg);
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
				const cmd = data.charAt(0);
				const params = data.substr(1).split('\n');
				assert.equal(cmd, '<');
				assert.equal(sid, params[0]);
				assert.equal(msg, params[1]);
			}, mockReceive));
		});

		it('should create a room for the first socket to get added to it', function () {
			let queryChannel;
			return spawnSocket(worker => data => {
				const sid = data.substr(1, data.indexOf('\n'));
				const cid = 'global';
				queryChannel = `$
					let room = rooms.get(${cid});
					process.send(room && room.has(${sid}));`;
				Sockets.roomAdd(worker, cid, sid);
			}).then(chain(worker => data => {
				assert(data);
			}, queryChannel));
		});

		it('should remove a room if the last socket gets removed from it', function () {
			let queryChannel;
			return spawnSocket(worker => data => {
				const sid = data.substr(1, data.indexOf('\n'));
				const cid = 'global';
				queryChannel = `$
					process.send(!sockets.has(${sid}) && !rooms.has(${cid}));`;
				Sockets.roomAdd(worker, cid, sid);
				Sockets.roomRemove(worker, cid, sid);
			}).then(chain(worker => data => {
				assert(data);
			}, queryChannel));
		});

		it('should send to all sockets in a room', function () {
			const msg = 'ayy lmao';
			const cid = 'global';
			const roomSend = `#${cid}\n${msg}`;
			return spawnSocket(worker => data => {
				const sid = data.substr(1, data.indexOf('\n'));
				Sockets.roomAdd(worker, cid, sid);
			}).then(chain(worker => data => {
				assert.equal(data, msg);
			}, roomSend));
		});

		it('should create a channel when moving a socket to it', function () {
			let queryChannel;
			return spawnSocket(worker => data => {
				const sid = data.substr(1, data.indexOf('\n'));
				const cid = 'battle-ou-1';
				const scid = '1';
				queryChannel = `$
					let channel = roomChannels[${cid}];
					process.send(!!channel && (channel.get(${sid}) === ${scid}));`;
				Sockets.channelMove(worker, cid, scid, sid);
			}).then(chain(worker => data => {
				assert(data);
			}, queryChannel));
		});

		it('should remove a channel when removing its last socket', function () {
			let queryChannel;
			return spawnSocket(worker => data => {
				const sid = data.substr(1, data.indexOf('\n'));
				const cid = 'battle-ou-1';
				const scid = '1';
				queryChannel = `$
					let channel = roomChannels.get(${cid});
					process.send(!!channel && (channel.get(${sid}) === ${scid}));`;
				Sockets.channelMove(worker, cid, scid, sid);
				Sockets.roomRemove(worker, cid, sid);
			}).then(chain(worker => data => {
				assert(data);
			}, queryChannel));
		});

		it('should send to sockets in a channel', function () {
			const cid = 'battle-ou-1';
			const msg = 'ayy lmao';
			const buf = `.${cid}\n\n|split\n\n${msg}\n\n`;
			return spawnSocket(worker => data => {
				const sid = data.substr(1, data.indexOf('\n'));
				const scid = '1';
				Sockets.channelMove(worker, cid, scid, sid);
			}).then(chain(worker => data => {
				assert.equal(data, msg);
			}, buf));
		});
	});
});

*/
