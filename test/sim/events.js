'use strict';

const assert = require('./../assert');
const common = require('./../common');

let battle;

describe('Battle#onEvent', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should allow the addition of one or more event handlers to the battle engine', () => {
		battle = common.createBattle([
			[{ species: 'Pidgeot', ability: 'keeneye', moves: ['bulkup'] }],
			[{ species: 'Talonflame', ability: 'galewings', moves: ['peck'] }],
		]);
		let eventCount = 0;
		let eventCount2 = 0;
		battle.onEvent('Hit', battle.format, () => {
			eventCount++;
		});
		battle.onEvent('Hit', battle.format, () => {
			eventCount++;
			eventCount2++;
		});
		battle.onEvent('ModifyDamage', battle.format, () => {
			return 5;
		});
		battle.makeChoices('move bulkup', 'move peck');
		assert.equal(eventCount, 4);
		assert.equal(eventCount2, 2);
		assert.equal(battle.p1.active[0].maxhp - battle.p1.active[0].hp, 5);
	});

	it('should support and resolve priorities correctly', () => {
		battle = common.createBattle([
			[{ species: 'Pidgeot', ability: 'keeneye', moves: ['bulkup'] }],
			[{ species: 'Talonflame', ability: 'galewings', moves: ['peck'] }],
		]);
		let eventCount = 0;
		const modHandler = function (count) {
			return function () {
				assert.equal(eventCount, count);
				eventCount++;
			};
		};
		for (let i = 0; i < 9; i++) {
			battle.onEvent('ModifyDamage', battle.format, -i, modHandler(i));
		}
		battle.makeChoices('move bulkup', 'move peck');
		assert.equal(eventCount, 9);
	});

	it('should throw if a callback is not given for the event handler', () => {
		battle = common.createBattle([
			[{ species: 'Pidgeot', ability: 'keeneye', moves: ['bulkup'] }],
			[{ species: 'Talonflame', ability: 'galewings', moves: ['peck'] }],
		]);
		assert.throws(battle.onEvent, TypeError);
		assert.throws(() => { battle.onEvent('Hit'); }, TypeError);
		assert.throws(() => { battle.onEvent('Hit', battle.format); }, TypeError);
	});
});
