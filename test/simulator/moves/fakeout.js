'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Fake Out', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should flinch on the first turn out', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Chansey', ability: 'naturalcure', moves: ['fakeout']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Venusaur', ability: 'overgrow', moves: ['swift']}]);
		battle.makeChoices('move fakeout', 'move swift');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not flinch on the second turn out', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Chansey', ability: 'naturalcure', moves: ['fakeout']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Venusaur', ability: 'overgrow', moves: ['swift']}]);
		battle.makeChoices('move fakeout', 'move swift');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		battle.makeChoices('move fakeout', 'move swift');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
