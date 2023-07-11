'use strict';

const assert = require('../assert');
const {extractChannelMessages} = require('../../dist/sim/battle');

describe('ServerStream', function () {
	const omniscientPlayer = -1;
	const spectatorPlayer = 0;

	const createSplit = (player, secret, shared) => ([
		`|split|p${player}`,
		secret,
		shared,
	]);

	describe('extractChannel', function () {
		it('should return the same messages if no privileged messages are within it', function () {
			const messages = [
				'|-start|p1a: Hellfrog|ability: Flash Fire',
				'|-start|p2a: Hellfrog|ability: Flash Fire',
				'|-start|p3a: Hellfrog|ability: Flash Fire',
				'|-start|p4a: Hellfrog|ability: Flash Fire',
			].join('\n');
			const actualChannelMessages = extractChannelMessages(messages, [omniscientPlayer]);

			assert.equal(actualChannelMessages[omniscientPlayer].join('\n'), messages);
		});

		it('should return all privileged messages for an omniscient player', function () {
			const messages = [
				...createSplit(1, '|-start|p1a: Aerodactyl|ability: Pressure', ''),
				...createSplit(2, '|-start|p2a: Aerodactyl|ability: Pressure', ''),
				...createSplit(3, '|-start|p3a: Aerodactyl|ability: Pressure', ''),
				...createSplit(4, '|-start|p4a: Aerodactyl|ability: Pressure', ''),
			].join('\n');
			const actualChannelMessages = extractChannelMessages(messages, [omniscientPlayer]);

			const expectedMessages = [
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-start|p2a: Aerodactyl|ability: Pressure',
				'|-start|p3a: Aerodactyl|ability: Pressure',
				'|-start|p4a: Aerodactyl|ability: Pressure',
			].join('\n');

			assert.equal(actualChannelMessages[omniscientPlayer].join('\n'), expectedMessages);
		});

		it('should return player-privileged messages for each player', function () {
			const expectedMessages = [
				...createSplit(1, '|-start|p1a: Aerodactyl|ability: Pressure', ''),
				...createSplit(2, '|-start|p2a: Aerodactyl|ability: Pressure', ''),
				...createSplit(3, '|-start|p3a: Aerodactyl|ability: Pressure', ''),
				...createSplit(4, '|-start|p4a: Aerodactyl|ability: Pressure', ''),
			].join('\n');
			const actualChannelMessages = extractChannelMessages(expectedMessages, [spectatorPlayer, 1, 2, 3, 4]);

			for (const player of [1, 2, 3, 4]) {
				const actualPlayerMessages = actualChannelMessages[player].join('\n');
				const expectedPlayerMessages = [
					`|-start|p${player}a: Aerodactyl|ability: Pressure`,
				].join('\n');
				assert.equal(actualPlayerMessages, expectedPlayerMessages);
			}

			assert.equal(actualChannelMessages[spectatorPlayer].join('\n'), '');
		});

		it('should return privileged messages with non-privileged messages', function () {
			const messages = [
				'|-start|p2b: Hellfrog|ability: Flash Fire',
				...createSplit(1, '|-start|p1a: Aerodactyl|ability: Pressure', ''),
				...createSplit(2, '|-start|p2a: Aerodactyl|ability: Pressure', ''),
				'|-start|p2b: Hellfrog|ability: Flash Fire',
			].join('\n');
			const actualChannelMessages = extractChannelMessages(messages, [omniscientPlayer, spectatorPlayer, 1, 2]);

			const expectedOmniscientPlayerMessages = [
				'|-start|p2b: Hellfrog|ability: Flash Fire',
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-start|p2a: Aerodactyl|ability: Pressure',
				'|-start|p2b: Hellfrog|ability: Flash Fire',
			].join('\n');
			const expectedPlayer1Messages = [
				'|-start|p2b: Hellfrog|ability: Flash Fire',
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-start|p2b: Hellfrog|ability: Flash Fire',
			].join('\n');
			const expectedPlayer2Messages = [
				'|-start|p2b: Hellfrog|ability: Flash Fire',
				'|-start|p2a: Aerodactyl|ability: Pressure',
				'|-start|p2b: Hellfrog|ability: Flash Fire',
			].join('\n');
			const expectedSpectatorMessages = [
				'|-start|p2b: Hellfrog|ability: Flash Fire',
				'|-start|p2b: Hellfrog|ability: Flash Fire',
			].join('\n');

			assert.equal(actualChannelMessages[omniscientPlayer].join('\n'), expectedOmniscientPlayerMessages);
			assert.equal(actualChannelMessages[1].join('\n'), expectedPlayer1Messages);
			assert.equal(actualChannelMessages[2].join('\n'), expectedPlayer2Messages);
			assert.equal(actualChannelMessages[spectatorPlayer].join('\n'), expectedSpectatorMessages);
		});

		it('should return consecutive player-privileged messages for a player', function () {
			const messages = [
				...createSplit(1, '|-start|p1a: Aerodactyl|ability: Pressure', ''),
				...createSplit(1, '|-start|p1b: Aerodactyl|ability: Pressure', ''),
				...createSplit(1, '|-start|p1c: Aerodactyl|ability: Pressure', ''),
			].join('\n');
			const actualChannelMessages = extractChannelMessages(messages, [omniscientPlayer, spectatorPlayer, 1]);

			const expectedPlayerMessages = [
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-start|p1b: Aerodactyl|ability: Pressure',
				'|-start|p1c: Aerodactyl|ability: Pressure',
			].join('\n');

			assert.equal(actualChannelMessages[omniscientPlayer].join('\n'), expectedPlayerMessages);
			assert.equal(actualChannelMessages[1].join('\n'), expectedPlayerMessages);
			assert.equal(actualChannelMessages[spectatorPlayer].join('\n'), '');
		});

		it('should return shared messages for non-privileged players', function () {
			const messages = [
				...createSplit(1, '|-heal|p1a: Rhyperior|420/420', '|-heal|p1a: Rhyperior|100/100'),
				...createSplit(2, '|-heal|p2a: Rhyperior|420/420', '|-heal|p2a: Rhyperior|100/100'),
				...createSplit(3, '|-heal|p3a: Rhyperior|420/420', '|-heal|p3a: Rhyperior|100/100'),
				...createSplit(4, '|-heal|p4a: Rhyperior|420/420', '|-heal|p4a: Rhyperior|100/100'),
			].join('\n');
			const actualChannelMessages = extractChannelMessages(messages, [omniscientPlayer, spectatorPlayer, 1, 2, 3, 4]);

			for (const player of [1, 2, 3, 4]) {
				const expectedPlayerMessages = [
					'|-heal|p1a: Rhyperior|100/100',
					'|-heal|p2a: Rhyperior|100/100',
					'|-heal|p3a: Rhyperior|100/100',
					'|-heal|p4a: Rhyperior|100/100',
				];
				expectedPlayerMessages[player - 1] = `|-heal|p${player}a: Rhyperior|420/420`;
				assert.equal(actualChannelMessages[player].join('\n'), expectedPlayerMessages.join('\n'));
			}

			const expectedOmniscientPlayerMessages = [
				'|-heal|p1a: Rhyperior|420/420',
				'|-heal|p2a: Rhyperior|420/420',
				'|-heal|p3a: Rhyperior|420/420',
				'|-heal|p4a: Rhyperior|420/420',
			].join('\n');

			const expectedSpectatorMessages = [
				'|-heal|p1a: Rhyperior|100/100',
				'|-heal|p2a: Rhyperior|100/100',
				'|-heal|p3a: Rhyperior|100/100',
				'|-heal|p4a: Rhyperior|100/100',
			].join('\n');

			assert.equal(actualChannelMessages[omniscientPlayer].join('\n'), expectedOmniscientPlayerMessages);
			assert.equal(actualChannelMessages[spectatorPlayer].join('\n'), expectedSpectatorMessages);
		});

		it('should return messages made up of secret and shared messages', function () {
			const messages = [
				...createSplit(1, '|-heal|p1a: Rhyperior|420/420', '|-heal|p1a: Rhyperior|100/100'),
				...createSplit(1, '|-start|p1a: Aerodactyl|ability: Pressure', ''),
				...createSplit(2, '|-heal|p2a: Rhyperior|420/420', '|-heal|p2a: Rhyperior|100/100'),
				...createSplit(2, '|-start|p2a: Aerodactyl|ability: Pressure', ''),
			].join('\n');
			const actualChannelMessages = extractChannelMessages(messages, [omniscientPlayer, spectatorPlayer, 1, 2]);

			const expectedOmniscientPlayerMessages = [
				'|-heal|p1a: Rhyperior|420/420',
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-heal|p2a: Rhyperior|420/420',
				'|-start|p2a: Aerodactyl|ability: Pressure',
			].join('\n');
			const expectedPlayer1Messages = [
				'|-heal|p1a: Rhyperior|420/420',
				'|-start|p1a: Aerodactyl|ability: Pressure',
				'|-heal|p2a: Rhyperior|100/100',
			].join('\n');
			const expectedPlayer2Messages = [
				'|-heal|p1a: Rhyperior|100/100',
				'|-heal|p2a: Rhyperior|420/420',
				'|-start|p2a: Aerodactyl|ability: Pressure',
			].join('\n');
			const expectedSpectatorMessages = [
				'|-heal|p1a: Rhyperior|100/100',
				'|-heal|p2a: Rhyperior|100/100',
			].join('\n');

			assert.equal(actualChannelMessages[omniscientPlayer].join('\n'), expectedOmniscientPlayerMessages);
			assert.equal(actualChannelMessages[1].join('\n'), expectedPlayer1Messages);
			assert.equal(actualChannelMessages[2].join('\n'), expectedPlayer2Messages);
			assert.equal(actualChannelMessages[spectatorPlayer].join('\n'), expectedSpectatorMessages);
		});

		it('should not extract channel messages for unspecified channels', function () {
			const messages = [
				...createSplit(1, '|-heal|p1a: Rhyperior|420/420', '|-heal|p1a: Rhyperior|100/100'),
				...createSplit(2, '|-heal|p2a: Rhyperior|420/420', '|-heal|p2a: Rhyperior|100/100'),
				...createSplit(3, '|-heal|p3a: Rhyperior|420/420', '|-heal|p3a: Rhyperior|100/100'),
				...createSplit(4, '|-heal|p4a: Rhyperior|420/420', '|-heal|p4a: Rhyperior|100/100'),
			].join('\n');

			const expectedOmniscientPlayerMessages = [
				'|-heal|p1a: Rhyperior|420/420',
				'|-heal|p2a: Rhyperior|420/420',
				'|-heal|p3a: Rhyperior|420/420',
				'|-heal|p4a: Rhyperior|420/420',
			].join('\n');

			const actualChannelMessages = extractChannelMessages(messages, [omniscientPlayer]);
			assert.equal(actualChannelMessages[omniscientPlayer].join('\n'), expectedOmniscientPlayerMessages);
			assert.equal(actualChannelMessages[1].join('\n'), '');
			assert.equal(actualChannelMessages[2].join('\n'), '');
			assert.equal(actualChannelMessages[3].join('\n'), '');
			assert.equal(actualChannelMessages[4].join('\n'), '');
			assert.equal(actualChannelMessages[spectatorPlayer].join('\n'), '');
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
