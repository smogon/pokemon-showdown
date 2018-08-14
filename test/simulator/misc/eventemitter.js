'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Battle#on', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should allow the addition of one or more event handlers to the battle engine', function () {
		battle = common.createBattle([
			[{species: 'Pidgeot', ability: 'keeneye', moves: ['bulkup']}],
			[{species: 'Talonflame', ability: 'galewings', moves: ['peck']}],
		]);
		let eventCount = 0;
		let eventCount2 = 0;
		battle.onEvent('Hit', battle.getFormat(), function () {
			eventCount++;
		});
		battle.onEvent('Hit', battle.getFormat(), function () {
			eventCount++;
			eventCount2++;
		});
		battle.onEvent('ModifyDamage', battle.getFormat(), function () {
			return 5;
		});
		battle.makeChoices('move bulkup', 'move peck');
		assert.strictEqual(eventCount, 4);
		assert.strictEqual(eventCount2, 2);
		assert.strictEqual(battle.p1.active[0].maxhp - battle.p1.active[0].hp, 5);
	});

	it('should support and resolve priorities correctly', function () {
		battle = common.createBattle([
			[{species: 'Pidgeot', ability: 'keeneye', moves: ['bulkup']}],
			[{species: 'Talonflame', ability: 'galewings', moves: ['peck']}],
		]);
		let eventCount = 0;
		let modHandler = function (count) {
			return function () {
				assert.strictEqual(eventCount, count);
				eventCount++;
			};
		};
		for (let i = 0; i < 9; i++) {
			battle.onEvent('ModifyDamage', battle.getFormat(), -i, modHandler(i));
		}
		battle.makeChoices('move bulkup', 'move peck');
		assert.strictEqual(eventCount, 9);
	});

	it('should throw if a callback is not given for the event handler', function () {
		battle = common.createBattle([
			[{species: 'Pidgeot', ability: 'keeneye', moves: ['bulkup']}],
			[{species: 'Talonflame', ability: 'galewings', moves: ['peck']}],
		]);
		assert.throws(battle.onEvent, TypeError);
		assert.throws(() => { battle.onEvent('Hit'); }, TypeError);
		assert.throws(() => { battle.onEvent('Hit', battle.getFormat()); }, TypeError);
	});
});
