'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Kee Berry', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should activate after a multi-hit physical move`, function () {
		battle = common.createBattle([[
			{species: "Wynaut", moves: ['doubleironbash']},
		], [
			{species: "Alakazam", item: 'keeberry', ability: 'shellarmor', moves: ['sleeptalk']},
		]]);

		const alakazam = battle.p2.active[0];
		battle.makeChoices();
		const damage = alakazam.maxhp - alakazam.hp;
		assert.bounded(damage, [28 * 2, 34 * 2]); // Otherwise range would be 47-57
	});
});
