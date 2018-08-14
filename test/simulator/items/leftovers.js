'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Leftovers [Gen 2]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should heal after switch', function () {
		battle = common.gen(2).createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: 'Blissey', item: 'leftovers', moves: ['healbell']},
			{species: 'Magikarp', level: 1, moves: ['splash']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Miltank", moves: ['seismictoss']},
		]);
		battle.makeChoices('move healbell', 'move seismictoss');
		assert.strictEqual(p1.active[0].hp, 590);

		battle.makeChoices('switch 2', 'move seismictoss');
		battle.makeChoices('switch 2', 'move seismictoss');
		assert.strictEqual(p1.active[0].hp, 630);
	});
});
