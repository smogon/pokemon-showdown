'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('False Swipe', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should leave the target with 1 HP if the attack would KO it', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Regigigas", ability: 'pressure', moves: ['falseswipe']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Caterpie", level: 2, ability: 'naturalcure', moves: ['snore']}]);
		battle.makeChoices('move falseswipe', 'move rest');
		assert.strictEqual(battle.p2.active[0].hp, 1);
	});
});
