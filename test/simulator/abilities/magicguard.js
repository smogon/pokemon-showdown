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
			{species: 'Clefable', ability: 'magicguard', item: 'lifeorb', moves: ['doubleedge', 'mindblown']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'roughskin', moves: ['spikes', 'toxic']}]);
		battle.makeChoices('move splash', 'move spikes');
		battle.makeChoices('switch 2', 'move toxic');
		assert.strictEqual(battle.p1.active[0].status, 'tox');
		assert.fullHP(battle.p1.active[0]);
		battle.makeChoices('move mindblown', 'move toxic');
		battle.makeChoices('move doubleedge', 'move spikes');
		assert.fullHP(battle.p1.active[0]);
	});

	it('should not be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			{species: 'Clefable', ability: 'magicguard', moves: ['doubleedge']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['stealthrock', 'roar']}]);
		battle.makeChoices('move splash', 'move stealthrock');
		battle.makeChoices('move splash', 'move roar');
		assert.fullHP(battle.p1.active[0]);
	});
});
