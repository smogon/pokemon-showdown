'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mummy', function () {
	afterEach(function () {
		battle.destroy();
	});

	it("set the attacker's ability to Mummy when the user is hit by a contact move", function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Cofagrigus', ability: 'mummy', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Mew', ability: 'synchronize', moves: ['aerialace']}]);
		battle.makeChoices('move calmmind', 'move aerialace');
		assert.strictEqual(battle.p2.active[0].ability, 'mummy');
	});

	it("not change certain abilities", function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Cofagrigus', ability: 'mummy', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Greninja', ability: 'battlebond', moves: ['aerialace']}]);
		battle.makeChoices('move calmmind', 'move aerialace');
		assert.strictEqual(battle.p2.active[0].ability, 'battlebond');
	});
});
