'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Lansat Berry', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should apply a Focus Energy effect when consumed', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Aggron', ability: 'sturdy', item: 'lansatberry', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Lucario', ability: 'adaptability', moves: ['aurasphere']}]);
		const holder = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'move aurasphere');
		assert.false.holdsItem(holder);
		assert.ok('focusenergy' in holder.volatiles);
	});

	it('should start to apply the effect even in middle of an attack', function () {
		battle = common.createBattle([
			[{species: 'Makuhita', ability: 'guts', item: 'lansatberry', moves: ['triplekick']}],
			[{species: 'Muk', ability: 'noguard', item: 'rockyhelmet', moves: ['acidarmor']}],
		]);
		const holder = battle.p1.active[0];

		let i = 0;
		let expectedRatio = [1, 1, 1, 1, 1, 3];
		battle.onEvent('ModifyCritRatio', battle.getFormat(), -99, function (critRatio, pokemon) {
			assert.strictEqual(critRatio, expectedRatio[i++]);
		});

		battle.makeChoices('move triplekick', 'move acidarmor');
		battle.makeChoices('move triplekick', 'move acidarmor');

		assert.false.holdsItem(holder);
		assert.strictEqual(holder.hp, 3);
		assert.strictEqual(i, 6);
	});
});
