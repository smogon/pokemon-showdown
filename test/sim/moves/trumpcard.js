'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Trump Card', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should power-up the less PP the move has', () => {
		battle = common.createBattle([
			[{ species: 'Eevee', ability: 'runaway', moves: ['trumpcard'] }],
			[{ species: 'Lugia', ability: 'multiscale', moves: ['recover'] }],
		]);

		const basePowers = [];
		battle.onEvent('BasePower', battle.format, (bp, attacker, defender, move) => {
			if (move.id === 'trumpcard') {
				basePowers.push(bp);
			}
		});

		for (let i = 0; i < 5; i++) {
			battle.makeChoices();
		}

		assert.deepEqual(basePowers, [40, 50, 60, 80, 200]);
	});

	it('should get its base power calculated from a move calling it', () => {
		battle = common.createBattle([
			[{ species: 'Komala', ability: 'comatose', moves: ['sleeptalk', 'trumpcard'] }],
			[{ species: 'Lugia', ability: 'multiscale', moves: ['recover'] }],
		]);

		const basePowers = [];
		battle.onEvent('BasePower', battle.format, (bp, attacker, defender, move) => {
			if (move.id === 'trumpcard') {
				basePowers.push(bp);
			}
		});

		battle.p1.active[0].moveSlots[0].pp = 2;

		for (let i = 0; i < 2; i++) {
			battle.makeChoices();
		}

		assert.deepEqual(basePowers, [80, 200]);
	});

	it('should work if called via Custap Berry in Gen 4', () => {
		battle = common.gen(4).createBattle([
			[{ species: 'Eevee', level: 1, ability: 'runaway', item: 'custapberry', moves: ['trumpcard'] }],
			[{ species: 'Scizor', ability: 'technician', moves: ['falseswipe'] }],
		]);

		const basePowers = [];
		battle.onEvent('BasePower', battle.format, (bp, attacker, defender, move) => {
			if (move.id === 'trumpcard') {
				basePowers.push(bp);
			}
		});

		battle.makeChoices();
		battle.makeChoices();

		assert.deepEqual(basePowers, [40, 50]);
	});
});
