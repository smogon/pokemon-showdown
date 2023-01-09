'use strict';

const assert = require('../assert');
const {_ServerStream: ServerStream} = require('../../dist/server/sockets');

describe('ServerStream', function () {
	const omniscientPlayer = -1;
	const spectatorPlayer = 0;

	const createSplit = (player, secret, shared) => ([
		`|split|p${player}`,
		secret,
		shared,
	]);

	describe('extractChannel', function () {
		it('should return the same log if no privileged messages are within it', function () {
			const log = [
				'|-start|p1a: Hellfrog|ability: Flash Fire',
				'|-start|p2a: Hellfrog|ability: Flash Fire',
				'|-start|p3a: Hellfrog|ability: Flash Fire',
				'|-start|p4a: Hellfrog|ability: Flash Fire',
			].join('\n');
			const actualLog = ServerStream.extractChannel(log, omniscientPlayer);

			assert.equal(actualLog, log);
		});

		it('should return all privileged messages for an omniscient player', function () {
			const log = [
				...createSplit(1, '|-start|p1a: Aerodactyl|ability: Pressure', ''),
				...createSplit(2, '|-start|p2a: Aerodactyl|ability: Pressure', ''),
				...createSplit(3, '|-start|p3a: Aerodactyl|ability: Pressure', ''),
				...createSplit(4, '|-start|p4a: Aerodactyl|ability: Pressure', ''),
			].join('\n');
			const actualLog = ServerStream.extractChannel(log, omniscientPlayer);

			const expectedLog = [
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-start|p2a: Aerodactyl|ability: Pressure',
				'|-start|p3a: Aerodactyl|ability: Pressure',
				'|-start|p4a: Aerodactyl|ability: Pressure',
			].join('\n');

			assert.equal(actualLog, expectedLog);
		});

		it('should return player-privileged messages for each player', function () {
			const log = [
				...createSplit(1, '|-start|p1a: Aerodactyl|ability: Pressure', ''),
				...createSplit(2, '|-start|p2a: Aerodactyl|ability: Pressure', ''),
				...createSplit(3, '|-start|p3a: Aerodactyl|ability: Pressure', ''),
				...createSplit(4, '|-start|p4a: Aerodactyl|ability: Pressure', ''),
			].join('\n');

			for (const player of [1, 2, 3, 4]) {
				const actualPlayerLog = ServerStream.extractChannel(log, player);
				const expectedPlayerLog = [
					`|-start|p${player}a: Aerodactyl|ability: Pressure`,
				].join('\n');
				assert.equal(actualPlayerLog, expectedPlayerLog);
			}

			const actualSpectatorLog = ServerStream.extractChannel(log, spectatorPlayer);

			assert.equal(actualSpectatorLog, '');
		});

		it('should return privileged messages with non-privileged messages', function () {
			const log = [
				'|-start|p2b: Hellfrog|ability: Flash Fire',
				...createSplit(1, '|-start|p1a: Aerodactyl|ability: Pressure', ''),
				...createSplit(2, '|-start|p2a: Aerodactyl|ability: Pressure', ''),
				'|-start|p2b: Hellfrog|ability: Flash Fire',
			].join('\n');

			const actualOmniscientPlayerLog = ServerStream.extractChannel(log, omniscientPlayer);
			const actualPlayer1Log = ServerStream.extractChannel(log, 1);
			const actualPlayer2Log = ServerStream.extractChannel(log, 2);
			const actualSpectatorLog = ServerStream.extractChannel(log, spectatorPlayer);

			const expectedOmniscientPlayerLog = [
				'|-start|p2b: Hellfrog|ability: Flash Fire',
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-start|p2a: Aerodactyl|ability: Pressure',
				'|-start|p2b: Hellfrog|ability: Flash Fire',
			].join('\n');
			const expectedPlayer1Log = [
				'|-start|p2b: Hellfrog|ability: Flash Fire',
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-start|p2b: Hellfrog|ability: Flash Fire',
			].join('\n');
			const expectedPlayer2Log = [
				'|-start|p2b: Hellfrog|ability: Flash Fire',
				'|-start|p2a: Aerodactyl|ability: Pressure',
				'|-start|p2b: Hellfrog|ability: Flash Fire',
			].join('\n');
			const expectedSpectatorLog = [
				'|-start|p2b: Hellfrog|ability: Flash Fire',
				'|-start|p2b: Hellfrog|ability: Flash Fire',
			].join('\n');

			assert.equal(actualOmniscientPlayerLog, expectedOmniscientPlayerLog);
			assert.equal(actualPlayer1Log, expectedPlayer1Log);
			assert.equal(actualPlayer2Log, expectedPlayer2Log);
			assert.equal(actualSpectatorLog, expectedSpectatorLog);
		});

		it('should return consecutive player-privileged messages for a player', function () {
			const log = [
				...createSplit(1, '|-start|p1a: Aerodactyl|ability: Pressure', ''),
				...createSplit(1, '|-start|p1b: Aerodactyl|ability: Pressure', ''),
				...createSplit(1, '|-start|p1c: Aerodactyl|ability: Pressure', ''),
			].join('\n');

			const actualOmniscientPlayerLog = ServerStream.extractChannel(log, omniscientPlayer);
			const actualPlayerLog = ServerStream.extractChannel(log, 1);
			const actualSpectatorLog = ServerStream.extractChannel(log, spectatorPlayer);

			const expectedPlayerLog = [
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-start|p1b: Aerodactyl|ability: Pressure',
				'|-start|p1c: Aerodactyl|ability: Pressure',
			].join('\n');

			assert.equal(actualOmniscientPlayerLog, expectedPlayerLog);
			assert.equal(actualPlayerLog, expectedPlayerLog);
			assert.equal(actualSpectatorLog, '');
		});

		it('should return shared messages for non-privileged players', function () {
			const log = [
				...createSplit(1, '|-heal|p1a: Rhyperior|420/420', '|-heal|p1a: Rhyperior|100/100'),
				...createSplit(2, '|-heal|p2a: Rhyperior|420/420', '|-heal|p2a: Rhyperior|100/100'),
				...createSplit(3, '|-heal|p3a: Rhyperior|420/420', '|-heal|p3a: Rhyperior|100/100'),
				...createSplit(4, '|-heal|p4a: Rhyperior|420/420', '|-heal|p4a: Rhyperior|100/100'),
			].join('\n');

			for (const player of [1, 2, 3, 4]) {
				const actualPlayerLog = ServerStream.extractChannel(log, player);
				const expectedPlayerLog = [
					'|-heal|p1a: Rhyperior|100/100',
					'|-heal|p2a: Rhyperior|100/100',
					'|-heal|p3a: Rhyperior|100/100',
					'|-heal|p4a: Rhyperior|100/100',
				];
				expectedPlayerLog[player - 1] = `|-heal|p${player}a: Rhyperior|420/420`;
				assert.equal(actualPlayerLog, expectedPlayerLog.join('\n'));
			}

			const actualOmniscientPlayerLog = ServerStream.extractChannel(log, omniscientPlayer);
			const actualSpectatorLog = ServerStream.extractChannel(log, spectatorPlayer);

			const expectedOmniscientPlayerLog = [
				'|-heal|p1a: Rhyperior|420/420',
				'|-heal|p2a: Rhyperior|420/420',
				'|-heal|p3a: Rhyperior|420/420',
				'|-heal|p4a: Rhyperior|420/420',
			].join('\n');

			const expectedSpectatorLog = [
				'|-heal|p1a: Rhyperior|100/100',
				'|-heal|p2a: Rhyperior|100/100',
				'|-heal|p3a: Rhyperior|100/100',
				'|-heal|p4a: Rhyperior|100/100',
			].join('\n');

			assert.equal(actualOmniscientPlayerLog, expectedOmniscientPlayerLog);
			assert.equal(actualSpectatorLog, expectedSpectatorLog);
		});

		it('should return messages made up of secret and shared messages', function () {
			const log = [
				...createSplit(1, '|-heal|p1a: Rhyperior|420/420', '|-heal|p1a: Rhyperior|100/100'),
				...createSplit(1, '|-start|p1a: Aerodactyl|ability: Pressure', ''),
				...createSplit(2, '|-heal|p2a: Rhyperior|420/420', '|-heal|p2a: Rhyperior|100/100'),
				...createSplit(2, '|-start|p2a: Aerodactyl|ability: Pressure', ''),
			].join('\n');

			const actualOmniscientPlayerLog = ServerStream.extractChannel(log, omniscientPlayer);
			const actualPlayer1Log = ServerStream.extractChannel(log, 1);
			const actualPlayer2Log = ServerStream.extractChannel(log, 2);
			const actualSpectatorLog = ServerStream.extractChannel(log, spectatorPlayer);

			const expectedOmniscientPlayerLog = [
				'|-heal|p1a: Rhyperior|420/420',
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-heal|p2a: Rhyperior|420/420',
				'|-start|p2a: Aerodactyl|ability: Pressure',
			].join('\n');
			const expectedPlayer1Log = [
				'|-heal|p1a: Rhyperior|420/420',
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-heal|p2a: Rhyperior|100/100',
			].join('\n');
			const expectedPlayer2Log = [
				'|-heal|p1a: Rhyperior|100/100',
				'|-heal|p2a: Rhyperior|420/420',
				'|-start|p2a: Aerodactyl|ability: Pressure',
			].join('\n');
			const expectedSpectatorLog = [
				'|-heal|p1a: Rhyperior|100/100',
				'|-heal|p2a: Rhyperior|100/100',
			].join('\n');

			assert.equal(actualOmniscientPlayerLog, expectedOmniscientPlayerLog);
			assert.equal(actualPlayer1Log, expectedPlayer1Log);
			assert.equal(actualPlayer2Log, expectedPlayer2Log);
			assert.equal(actualSpectatorLog, expectedSpectatorLog);
		});
	});
});

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
