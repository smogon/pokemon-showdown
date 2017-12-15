'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('False Swipe', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should leave the user with 1 HP if hit by an attack that would knock it out', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Necrozma", ability: 'pressure', moves: ['photongeyser']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Caterpie", level: 2, moves: ['endure']}]);
		battle.makeChoices('move photongeyser', 'move endure');
		assert.strictEqual(battle.p2.active[0].hp, 1);
	});
});
