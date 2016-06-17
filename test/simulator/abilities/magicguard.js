'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Magic Guard', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent all non-attack damage', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			{species: 'Clefable', ability: 'magicguard', item: 'lifeorb', moves: ['doubleedge']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'roughskin', moves: ['spikes', 'toxic']}]);
		battle.commitDecisions();
		battle.p1.chooseSwitch(2).foe.chooseMove('toxic');
		assert.strictEqual(battle.p1.active[0].status, 'tox');
		assert.fullHP(battle.p1.active[0]);
		battle.commitDecisions();
		assert.fullHP(battle.p1.active[0]);
	});

	it('should not be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			{species: 'Clefable', ability: 'magicguard', moves: ['doubleedge']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['stealthrock', 'roar']}]);
		battle.commitDecisions();
		battle.p2.chooseMove('roar').foe.chooseDefault();
		assert.fullHP(battle.p1.active[0]);
	});
});
