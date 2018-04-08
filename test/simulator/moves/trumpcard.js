'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Trump Card', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should power-up the less PP the move has', function () {
		battle = common.createBattle([
			[{species: 'Eevee', ability: 'runaway', moves: ['trumpcard']}],
			[{species: 'Lugia', ability: 'multiscale', moves: ['recover']}],
		]);

		let basePowers = [];
		battle.onEvent('BasePower', battle.getFormat(), function (bp, attacker, defender, move) {
			if (move.id === 'trumpcard') {
				basePowers.push(bp);
			}
		});

		for (let i = 0; i < 5; i++) {
			battle.commitDecisions();
		}

		assert.deepStrictEqual(basePowers, [40, 50, 60, 80, 200]);
	});

	it('should get its base power calculated from a move calling it', function () {
		battle = common.createBattle([
			[{species: 'Komala', ability: 'comatose', moves: ['sleeptalk', 'trumpcard']}],
			[{species: 'Lugia', ability: 'multiscale', moves: ['recover']}],
		]);

		let basePowers = [];
		battle.onEvent('BasePower', battle.getFormat(), function (bp, attacker, defender, move) {
			if (move.id === 'trumpcard') {
				basePowers.push(bp);
			}
		});

		battle.p1.active[0].moveSlots[0].pp = 2;

		for (let i = 0; i < 2; i++) {
			battle.commitDecisions();
		}

		assert.deepStrictEqual(basePowers, [80, 200]);
	});
});
