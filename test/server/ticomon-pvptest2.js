'use strict';

const assert = require('assert').strict;

const { makeConnection, makeUser, destroyUser } = require('../users-utils');

const PACKED_TEAM = 'Pikachu||||thunderbolt||||||';
let commands;

function createBattle(first, second) {
	return Rooms.createBattle({
		format: 'gen9customgame',
		players: [
			{ user: first, team: PACKED_TEAM },
			{ user: second, team: PACKED_TEAM },
		],
	});
}

describe('TicoMon pvptest2 visual connections', () => {
	let first;
	let second;
	let third;
	let fourth;
	let battle;
	let otherBattle;
	let visualConnection;
	let replacementConnection;

	before(() => {
		({ commands } = require('../../dist/server/chat-commands/core'));
	});

	afterEach(() => {
		if (visualConnection?.user) visualConnection.destroy();
		if (replacementConnection?.user) replacementConnection.destroy();
		if (battle) battle.destroy();
		if (otherBattle) otherBattle.destroy();
		destroyUser(first);
		destroyUser(second);
		destroyUser(third);
		destroyUser(fourth);
		first = null;
		second = null;
		third = null;
		fourth = null;
		battle = null;
		otherBattle = null;
		visualConnection = null;
		replacementConnection = null;
	});

	it('rejects a missing ticket before any internal request', async () => {
		visualConnection = makeConnection();
		const guest = makeUser('', visualConnection);
		const sent = [];
		visualConnection.send = message => sent.push(message);

		await commands.ticomonauth('', null, guest, visualConnection);

		assert.deepEqual(sent, ['|popup|Unable to connect this battle client.']);
		assert.equal(visualConnection.user, guest);
	});

	it('attaches only the assigned visual connection and joins its battle', () => {
		first = makeUser('ticketplayerone');
		second = makeUser('ticketplayertwo');
		battle = createBattle(first, second);
		visualConnection = makeConnection();
		const guest = makeUser('', visualConnection);

		assert.equal(
			first.attachTicoMonPvptest2Connection(visualConnection, battle.roomid),
			true
		);
		assert.equal(visualConnection.user, first);
		assert.equal(visualConnection.ticomonPvptest2Room, battle.roomid);
		assert(visualConnection.inRooms.has(battle.roomid));
		assert(!guest.connections.includes(visualConnection));
	});

	it('rejects other battle rooms and replaces only the previous visual connection', async () => {
		first = makeUser('ticketplayerone');
		second = makeUser('ticketplayertwo');
		battle = createBattle(first, second);
		third = makeUser('ticketplayerthree');
		fourth = makeUser('ticketplayerfour');
		otherBattle = createBattle(third, fourth);
		visualConnection = makeConnection();
		makeUser('', visualConnection);
		first.attachTicoMonPvptest2Connection(visualConnection, battle.roomid);

		const sent = [];
		visualConnection.sendTo = (_roomid, message) => sent.push(message);
		assert.equal(
			await first.tryJoinRoom(otherBattle.roomid, visualConnection),
			false
		);
		assert(sent.some(message => message.includes('|joinfailed|')));

		replacementConnection = makeConnection();
		makeUser('', replacementConnection);
		first.attachTicoMonPvptest2Connection(replacementConnection, battle.roomid);

		assert.equal(Users.connections.has(visualConnection.id), false);
		assert.equal(replacementConnection.user, first);
		assert(first.connected);
	});
});
