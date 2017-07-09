'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Battle Armor', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent moves from dealing critical hits', function () {
		battle = common.createBattle([
			[{species: 'Slowbro', ability: 'battlearmor', moves: ['quickattack']}],
			[{species: 'Cryogonal', ability: 'noguard', moves: ['frostbreath']}],
		]);
		let successfulEvent = false;
		battle.onEvent('ModifyDamage', battle.getFormat(), function (damage, attacker, defender, move) {
			if (move.id === 'frostbreath') {
				successfulEvent = true;
				assert.ok(!move.crit);
			}
		});
		battle.commitDecisions();
		assert.ok(successfulEvent);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle([
			[{species: 'Slowbro', ability: 'battlearmor', moves: ['quickattack']}],
			[{species: 'Cryogonal', ability: 'moldbreaker', item: 'zoomlens', moves: ['frostbreath']}],
		]);
		battle.commitDecisions(); // Team Preview
		let successfulEvent = false;
		battle.onEvent('ModifyDamage', battle.getFormat(), function (damage, attacker, defender, move) {
			if (move.id === 'frostbreath') {
				successfulEvent = true;
				assert.ok(move.crit);
			}
		});
		battle.commitDecisions();
		assert.ok(successfulEvent);
	});
});
