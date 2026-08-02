'use strict';

const assert = require('assert').strict;

const { makeConnection, makeUser, destroyUser } = require('../users-utils');

const PACKED_TEAM = 'Pikachu||||thunderbolt||||||';
const TEST_TICKET_CONSUME_URL = 'https://ticomon-test.invalid/tickets/consume';
const TEST_INTERNAL_SERVICE_TOKEN = 'test-service-token';
const TICKET_AUTH_ENV_KEYS = [
	'TICOMON_PVPTEST2_TICKET_CONSUME_URL',
	'TICOMON_PVPTEST2_INTERNAL_SERVICE_TOKEN',
];
let commands;
let originalNetPost;
let originalTicketAuthEnv;

function createBattle(first, second) {
	return Rooms.createBattle({
		format: 'gen9customgame',
		players: [
			{ user: first, team: PACKED_TEAM },
			{ user: second, team: PACKED_TEAM },
		],
	});
}

function loadCommands() {
	delete require.cache[require.resolve('../../dist/server/chat-commands/core')];
	({ commands } = require('../../dist/server/chat-commands/core'));
}

function setupTicketAuthEnvironment() {
	if (!originalTicketAuthEnv) {
		originalTicketAuthEnv = Object.fromEntries(
			TICKET_AUTH_ENV_KEYS.map(key => [key, process.env[key]])
		);
	}
	process.env.TICOMON_PVPTEST2_TICKET_CONSUME_URL = TEST_TICKET_CONSUME_URL;
	process.env.TICOMON_PVPTEST2_INTERNAL_SERVICE_TOKEN = TEST_INTERNAL_SERVICE_TOKEN;
}

function restoreTicketAuthEnvironment() {
	if (!originalTicketAuthEnv) return;
	for (const key of TICKET_AUTH_ENV_KEYS) {
		if (originalTicketAuthEnv[key] === undefined) {
			delete process.env[key];
		} else {
			process.env[key] = originalTicketAuthEnv[key];
		}
	}
	originalTicketAuthEnv = null;
}

function setupMockNet(responseData, error) {
	const { NetRequest } = require('../../dist/lib/net');
	setupTicketAuthEnvironment();
	if (!originalNetPost) originalNetPost = NetRequest.prototype.post;
	NetRequest.prototype.post = async function () {
		if (error) throw error;
		return JSON.stringify(responseData);
	};
	loadCommands();
}

function restoreNet() {
	if (originalNetPost) {
		const { NetRequest } = require('../../dist/lib/net');
		NetRequest.prototype.post = originalNetPost;
		originalNetPost = null;
		loadCommands();
	}
	restoreTicketAuthEnvironment();
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
	let guest;

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
		destroyUser(guest);
		first = null;
		second = null;
		third = null;
		fourth = null;
		battle = null;
		otherBattle = null;
		visualConnection = null;
		replacementConnection = null;
		guest = null;
	});

	it('accepts the documented hyphenated ticket command', () => {
		assert.equal(commands['ticomon-auth'], 'ticomonauth');
		assert.equal(typeof commands.ticomonauth, 'function');
		assert.equal(commands[commands['ticomon-auth']], commands.ticomonauth);
	});

	it('rejects a missing ticket before any internal request', async () => {
		visualConnection = makeConnection();
		guest = makeUser('', visualConnection);
		const sent = [];
		visualConnection.send = message => sent.push(message);

		await commands.ticomonauth('', null, guest, visualConnection);

		assert.deepEqual(sent, ['|ticomonauth|error|config']);
		assert.equal(visualConnection.user, guest);
	});

	it('rejects ticket with invalid format', async () => {
		visualConnection = makeConnection();
		guest = makeUser('', visualConnection);
		const sent = [];
		visualConnection.send = message => sent.push(message);

		await commands.ticomonauth('short-ticket', null, guest, visualConnection);

		assert.deepEqual(sent, ['|ticomonauth|error|config']);
	});

	it('attaches only the assigned visual connection and joins its battle', () => {
		first = makeUser('ticketplayerone');
		second = makeUser('ticketplayertwo');
		battle = createBattle(first, second);
		visualConnection = makeConnection();
		guest = makeUser('', visualConnection);

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

describe('TicoMon pvptest2 player auth (role=player)', () => {
	let player1;
	let player2;
	let battle;
	let conn;
	let conn2;
	let guest;
	let guest2;

	beforeEach(() => {
		player1 = makeUser('pvpalpha');
		player2 = makeUser('pvpgamma');
		battle = createBattle(player1, player2);
		conn = makeConnection();
		guest = makeUser('', conn);
	});

	afterEach(() => {
		if (conn?.user) conn.destroy();
		if (conn2?.user) conn2.destroy();
		if (battle) battle.destroy();
		destroyUser(player1);
		destroyUser(player2);
		destroyUser(guest);
		player1 = null;
		player2 = null;
		battle = null;
		conn = null;
		conn2 = null;
		guest = null;
		guest2 = null;
		restoreNet();
	});

	it('authenticates p1 with valid player ticket', async () => {
		setupMockNet({
			valid: true,
			role: 'player',
			showdownUserid: 'pvpalpha',
			roomId: battle.roomid,
			side: 1,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		const authMessages = sent.filter(message => message === '|ticomonauth|ok');
		assert.equal(authMessages.length, 1);
		assert.equal(conn.user, player1);
		assert.equal(player1.connections.filter(connection => connection === conn).length, 1);
		assert(!player2.connections.includes(conn));
		assert(conn.inRooms.has(battle.roomid));
	});

	it('authenticates p2 with valid player ticket', async () => {
		setupMockNet({
			valid: true,
			role: 'player',
			showdownUserid: 'pvpgamma',
			roomId: battle.roomid,
			side: 2,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		const authMessages = sent.filter(message => message === '|ticomonauth|ok');
		assert.equal(authMessages.length, 1);
		assert.equal(conn.user, player2);
		assert.equal(player2.connections.filter(connection => connection === conn).length, 1);
		assert(!player1.connections.includes(conn));
		assert(conn.inRooms.has(battle.roomid));
	});

	it('assigns the validated avatar to the authenticated player', async () => {
		setupMockNet({
			valid: true,
			role: 'player',
			showdownUserid: 'pvpalpha',
			roomId: battle.roomid,
			side: 1,
			trainerAvatar: 'blue',
		});

		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);

		assert.equal(player1.avatar, 'blue');
		assert.equal(battle.battle.p1.avatar, 'blue');
	});

	it('keeps distinct validated avatars for p1 and p2', async () => {
		const response = {
			valid: true,
			role: 'player',
			showdownUserid: 'pvpalpha',
			roomId: battle.roomid,
			side: 1,
			trainerAvatar: 'blue',
		};
		setupMockNet(response);

		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);

		conn2 = makeConnection();
		guest2 = makeUser('', conn2);
		response.showdownUserid = 'pvpgamma';
		response.side = 2;
		response.trainerAvatar = 'dawn-gen4pt';
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest2, conn2);

		assert.equal(player1.avatar, 'blue');
		assert.equal(player2.avatar, 'dawn-gen4pt');
	});

	it('preserves the initial avatar when a later ticket disagrees', async () => {
		const response = {
			valid: true,
			role: 'player',
			showdownUserid: 'pvpalpha',
			roomId: battle.roomid,
			side: 1,
			trainerAvatar: 'blue',
		};
		setupMockNet(response);

		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		conn2 = makeConnection();
		guest2 = makeUser('', conn2);
		response.trainerAvatar = 'red';
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest2, conn2);

		assert.equal(player1.avatar, 'blue');
	});

	it('rejects an avatar outside the TicoMon allowlist', async () => {
		setupMockNet({
			valid: true,
			role: 'player',
			showdownUserid: 'pvpalpha',
			roomId: battle.roomid,
			side: 1,
			trainerAvatar: 'https://example.invalid/avatar.png',
		});
		const sent = [];
		conn.send = msg => sent.push(msg);

		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);

		assert.deepEqual(sent, ['|ticomonauth|error|consume_invalid_payload']);
	});

	it('rejects player ticket missing side', async () => {
		setupMockNet({
			valid: true,
			role: 'player',
			showdownUserid: 'pvpalpha',
			roomId: battle.roomid,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.deepEqual(sent, ['|ticomonauth|error|consume_invalid_payload']);
	});

	it('rejects player ticket missing showdownUserid', async () => {
		setupMockNet({
			valid: true,
			role: 'player',
			roomId: battle.roomid,
			side: 1,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.deepEqual(sent, ['|ticomonauth|error|consume_invalid_payload']);
	});

	it('rejects player ticket when user is offline', async () => {
		setupMockNet({
			valid: true,
			role: 'player',
			showdownUserid: 'nonexistentuser',
			roomId: battle.roomid,
			side: 1,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.deepEqual(sent, ['|ticomonauth|error|user_missing']);
	});

	it('rejects player ticket when room does not exist', async () => {
		setupMockNet({
			valid: true,
			role: 'player',
			showdownUserid: 'pvpalpha',
			roomId: 'battle-gen9customgame-nonexistent',
			side: 1,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.deepEqual(sent, ['|ticomonauth|error|room_missing']);
	});
});

describe('TicoMon pvptest2 spectator auth (role=spectator)', () => {
	let player1;
	let player2;
	let battle;
	let conn;
	let conn2;
	let guest;
	let guest2;

	beforeEach(() => {
		player1 = makeUser('spectestp1');
		player2 = makeUser('spectestp2');
		battle = createBattle(player1, player2);
		conn = makeConnection();
		guest = makeUser('', conn);
	});

	afterEach(() => {
		if (conn?.user) conn.destroy();
		if (conn2?.user) conn2.destroy();
		if (battle) battle.destroy();
		destroyUser(player1);
		destroyUser(player2);
		destroyUser(guest);
		destroyUser(guest2);
		player1 = null;
		player2 = null;
		battle = null;
		conn = null;
		conn2 = null;
		guest = null;
		guest2 = null;
		restoreNet();
	});

	it('authenticates a valid spectator ticket and joins the battle room', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.equal(sent.length, 1);
		assert(sent[0].startsWith('|ticomonauth|ok'));
		assert.equal(conn.user, guest);
		assert(conn.inRooms.has(battle.roomid));
	});

	it('rejects a spectator ticket that tries to assign an avatar', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
			trainerAvatar: 'red',
		});
		const sent = [];
		conn.send = msg => sent.push(msg);

		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);

		assert.deepEqual(sent, ['|ticomonauth|error|consume_invalid_payload']);
	});

	it('does not occupy p1 slot', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.equal(battle.battle.p1.id, 'spectestp1');
	});

	it('does not occupy p2 slot', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.equal(battle.battle.p2.id, 'spectestp2');
	});

	it('does not appear in battle.playerTable', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.equal(battle.battle.playerTable[guest.id], undefined);
	});

	it('does not receive |request|', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		conn.sendTo = (roomid, msg) => {
			sent.push(msg);
		};
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		const roomMessages = sent.filter(m => !m.startsWith('|ticomonauth'));
		const initBattle = roomMessages.some(m => m.includes('|init|battle'));
		const hasRequest = roomMessages.some(m => m.includes('|request|'));
		assert(initBattle, 'spectator should receive battle init');
		assert(!hasRequest, 'spectator should not receive |request|');
	});

	it('receives public battle log and state', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		conn.sendTo = (roomid, msg) => {
			sent.push(msg);
		};
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		const roomMessages = sent.filter(m => !m.startsWith('|ticomonauth'));
		const initBattle = roomMessages.some(m => m.includes('|init|battle'));
		const title = roomMessages.some(m => m.includes('|title|'));
		assert(initBattle, 'spectator should receive |init|battle');
		assert(title, 'spectator should receive |title|');
	});

	it('cannot /choose (move 1)', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		const result = battle.battle.choose(guest, 'move 1');
		assert.equal(result, undefined);
	});

	it('cannot /switch', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		const result = battle.battle.choose(guest, 'switch 1');
		assert.equal(result, undefined);
	});

	it('cannot /team', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		const result = battle.battle.choose(guest, 'team 1');
		assert.equal(result, undefined);
	});

	it('cannot /forfeit', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		const result = battle.battle.forfeit(guest);
		assert.equal(result, false);
	});

	it('cannot take p1/p2 after player disconnect', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		player1.disconnectAll();
		assert.equal(battle.battle.p1.id, 'spectestp1');
		assert.equal(battle.battle.playerTable[guest.id], undefined);
	});

	it('rejects spectator ticket with side present', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
			side: 1,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.deepEqual(sent, ['|ticomonauth|error|consume_invalid_payload']);
	});

	it('rejects spectator ticket with showdownUserid present', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
			showdownUserid: 'someone',
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.deepEqual(sent, ['|ticomonauth|error|consume_invalid_payload']);
	});

	it('rejects unknown role', async () => {
		setupMockNet({
			valid: true,
			role: 'admin',
			roomId: battle.roomid,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.deepEqual(sent, ['|ticomonauth|error|consume_invalid_payload']);
	});

	it('rejects expired ticket (valid=false)', async () => {
		setupMockNet({
			valid: false,
			role: 'spectator',
			roomId: battle.roomid,
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.deepEqual(sent, ['|ticomonauth|error|consume_invalid_payload']);
	});

	it('rejects already-consumed ticket (HTTP 403)', async () => {
		setupMockNet(null, Object.assign(new Error('Forbidden'), { statusCode: 403 }));
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.deepEqual(sent, ['|ticomonauth|error|consume_403']);
	});

	it('rejects ticket for non-existent room', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: 'battle-gen9customgame-noroomhere',
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.deepEqual(sent, ['|ticomonauth|error|room_missing']);
	});

	it('rejects ticket for non-battle room', async () => {
		const chatRoom = Rooms.createChatRoom('testlobby', 'Test Lobby');
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: 'testlobby',
		});
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert.deepEqual(sent, ['|ticomonauth|error|consume_invalid_payload']);
		chatRoom.destroy();
	});

	it('does not print ticket in logs', async () => {
		const logs = [];
		const origLog = console.log;
		console.log = msg => logs.push(msg);
		try {
			setupMockNet({
				valid: true,
				role: 'spectator',
				roomId: battle.roomid,
			});
			const ticket = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			await commands.ticomonauth(ticket, null, guest, conn);
			const allLogs = logs.join(' ');
			assert(!allLogs.includes(ticket), 'ticket must not appear in logs');
		} finally {
		// eslint-disable-next-line require-atomic-updates
			console.log = origLog;
		}
	});

	it('battle ends normally with spectator connected', async () => {
		setupMockNet({
			valid: true,
			role: 'spectator',
			roomId: battle.roomid,
		});
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert(!battle.battle.ended);
		assert.equal(battle.battle.forfeit(player1), true);
		await battle.battle.getInputLog();
		assert(battle.battle.ended);
		assert(battle.log.log.some(message => message.startsWith('|win|')));
	});

	it('error from bridge does not leak details', async () => {
		setupMockNet(null, Object.assign(new Error('Internal server error'), { statusCode: 500 }));
		const sent = [];
		conn.send = msg => sent.push(msg);
		await commands.ticomonauth('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', null, guest, conn);
		assert(sent.length === 1);
		assert(sent[0].startsWith('|ticomonauth|error|'));
		assert(!sent[0].includes('Internal server error'), 'must not leak bridge error details');
	});
});
