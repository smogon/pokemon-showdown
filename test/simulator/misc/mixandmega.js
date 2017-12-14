'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mix and Mega', function () {
	beforeEach(function () {
		battle = common.mod('gen7mixandmega').createBattle();
	});
	afterEach(() => battle.destroy());

	it('should overwrite forme-change abilities on Mega Evolution or Primal Reversion', function () {
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Mimikyu", ability: 'disguise', item: 'metagrossite', moves: ['shadowclaw']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: "Wishiwashi", ability: 'schooling', item: 'blueorb', moves: ['uturn']}]);
		battle.makeChoices('switch 1', 'switch 1'); // Switch in
		battle.makeChoices('move shadowclaw mega', 'move uturn');
		assert.equal(p1.active[0].ability, 'toughclaws');
		assert.equal(p2.active[0].ability, 'primordialsea');
	});
});
