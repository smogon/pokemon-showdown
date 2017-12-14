'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mega Evolution', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should overwrite normally immutable abilities', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Metagross", ability: 'comatose', item: 'metagrossite', moves: ['metalclaw']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Wishiwashi", ability: 'schooling', moves: ['uturn']}]);
		battle.makeChoices('move metalclaw mega', 'move uturn');
		assert.equal(p1.active[0].ability, 'toughclaws');
	});
});
