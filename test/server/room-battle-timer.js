'use strict';

const assert = require('assert').strict;

const { RoomBattle, RoomBattleTimer } = require('../../dist/server/room-battle');

function makePlayer(slot, request = {}) {
	return {
		slot,
		name: slot,
		request: {
			rqid: 1,
			request: JSON.stringify(request),
			isWait: false,
			choice: '',
		},
		secondsLeft: 1,
		turnSecondsLeft: 1,
		dcSecondsLeft: 1,
		active: true,
		knownActive: true,
		eliminated: false,
		sendRoom() {},
		updateChannel() {},
	};
}

function makeBattle(p1Request = {}, p2Request = {}) {
	const messages = [];
	const calls = [];
	const p1 = makePlayer('p1', p1Request);
	const p2 = makePlayer('p2', p2Request);
	const battle = {
		format: 'gen9customgame',
		challengeType: 'challenge',
		gameType: 'singles',
		players: [p1, p2],
		ended: false,
		turn: 1,
		requestCount: 0,
		roomid: 'battle-timer-test',
		room: {
			add(message) {
				messages.push(message);
				return this;
			},
			update() {},
		},
		forfeitPlayer(player) {
			calls.push(['forfeit', player.slot]);
		},
		tie() {
			calls.push(['tie']);
		},
	};
	battle.timer = new RoomBattleTimer(battle);
	return { battle, p1, p2, calls, messages };
}

function stopTimer(timer) {
	timer.end();
}

describe('TicoMon battle timer policy', () => {
	it('does not change the timer for non-TicoMon battles', () => {
		const { battle } = makeBattle();
		const timer = battle.timer;
		timer.start();

		assert.equal(timer.isTicoMon, false);
		assert.equal(timer.settings.starting, 300);
		assert.equal(timer.settings.maxPerTurn, 300);
		stopTimer(timer);
	});

	it('does not start a countdown until a playable request exists', () => {
		const { battle, p1, p2 } = makeBattle();
		const timer = battle.timer;
		p1.request.isWait = 'cantUndo';
		p2.request.isWait = 'cantUndo';

		timer.markTicoMon();

		assert.equal(timer.timer, null);
		assert.equal(timer.timerRequesters.has('staff'), true);
	});

	it('identifies an authenticated TicoMon player connection and starts automatically', () => {
		const { battle, p1 } = makeBattle();
		const timer = battle.timer;
		const connection = {
			ticomonPvptest2Room: battle.roomid,
			sendTo() {},
		};
		const user = { id: 'p1', connections: [connection] };
		const roomBattle = Object.create(RoomBattle.prototype);
		Object.assign(roomBattle, battle, { playerTable: { p1 }, started: true });

		roomBattle.onConnect(user, connection);

		assert.equal(timer.isTicoMon, true);
		assert.equal(timer.timerRequesters.has('staff'), true);
		assert.equal(p1.turnSecondsLeft, 60);
		stopTimer(timer);
	});

	it('uses 60 seconds for normal decisions and 30 seconds for forced switches', () => {
		const { battle, p1 } = makeBattle({}, { forceSwitch: [true] });
		const timer = battle.timer;
		timer.markTicoMon();

		assert.equal(timer.settings.starting, 60);
		assert.equal(timer.settings.grace, 0);
		assert.equal(timer.settings.addPerTurn, 0);
		assert.equal(timer.settings.timeoutAutoChoose, false);
		assert.equal(p1.turnSecondsLeft, 60);
		assert.equal(battle.players[1].turnSecondsLeft, 30);

		p1.request = {
			rqid: 2,
			request: JSON.stringify({ forceSwitch: [true] }),
			isWait: false,
			choice: '',
		};
		timer.nextRequest(p1);
		assert.equal(p1.turnSecondsLeft, 30);

		p1.request = {
			rqid: 3,
			request: JSON.stringify({ active: [{ moves: [] }] }),
			isWait: false,
			choice: '',
		};
		timer.nextRequest(p1);
		assert.equal(p1.turnSecondsLeft, 60);
		stopTimer(timer);
	});

	it('does not accumulate unused time or restart on timer commands', () => {
		const { battle, p1 } = makeBattle();
		const timer = battle.timer;
		timer.markTicoMon();
		p1.turnSecondsLeft = 45;
		p1.secondsLeft = 45;

		assert.equal(timer.start({ id: 'p1' }), false);
		assert.equal(timer.stop({ id: 'p1' }), false);
		assert.equal(timer.stop(), false);
		assert.equal(p1.turnSecondsLeft, 45);
		assert.equal(timer.timerRequesters.has('staff'), true);
		stopTimer(timer);
	});

	it('stops counting a player after a valid decision and keeps invalid decisions on the same window', () => {
		const { battle, p1, p2 } = makeBattle();
		const timer = battle.timer;
		timer.markTicoMon();
		p1.request.isWait = true;
		const chosenTime = p1.turnSecondsLeft;
		timer.nextTick();
		assert.equal(p1.turnSecondsLeft, chosenTime);

		p2.turnSecondsLeft = 60;
		p2.secondsLeft = 60;
		timer.nextTick();
		assert.equal(p2.turnSecondsLeft, 55);
		stopTimer(timer);
	});

	it('forfeits one inactive player and ties when both expire in the same tick', () => {
		const oneExpired = makeBattle();
		const oneTimer = oneExpired.battle.timer;
		oneTimer.markTicoMon();
		oneExpired.p1.turnSecondsLeft = 0;
		oneExpired.p2.turnSecondsLeft = 20;
		assert.equal(oneTimer.checkTimeout(), true);
		assert.deepEqual(oneExpired.calls, [['forfeit', 'p1']]);
		stopTimer(oneTimer);

		const bothExpired = makeBattle();
		const bothTimer = bothExpired.battle.timer;
		bothTimer.markTicoMon();
		bothExpired.p1.turnSecondsLeft = 0;
		bothExpired.p2.turnSecondsLeft = 0;
		assert.equal(bothTimer.checkTimeout(), true);
		assert.deepEqual(bothExpired.calls, [['tie']]);
		assert.equal(bothExpired.messages.includes('|-message|All players are inactive.'), true);
		stopTimer(bothTimer);
	});

	it('continues counting during disconnect and does not reset on reconnect', () => {
		const { battle, p1 } = makeBattle({ forceSwitch: [true] });
		const timer = battle.timer;
		timer.markTicoMon();
		p1.active = false;
		timer.checkActivity();
		assert.equal(p1.dcSecondsLeft, 30);
		timer.nextTick();
		assert.equal(p1.turnSecondsLeft, 25);
		p1.active = true;
		timer.checkActivity();
		assert.equal(p1.turnSecondsLeft, 25);
		stopTimer(timer);
	});

	it('does not duplicate timers for repeated authenticated connections', () => {
		const { battle, p1 } = makeBattle();
		const timer = battle.timer;
		const connection = { ticomonPvptest2Room: battle.roomid, sendTo() {} };
		const user = { id: 'p1', connections: [connection] };
		const roomBattle = Object.create(RoomBattle.prototype);
		Object.assign(roomBattle, battle, { playerTable: { p1 }, started: true });

		roomBattle.onConnect(user, connection);
		const activeTimer = timer.timer;
		roomBattle.onConnect(user, connection);

		assert.equal(timer.timerRequesters.size, 1);
		assert.equal(timer.timer, activeTimer);
		stopTimer(timer);
	});
});
