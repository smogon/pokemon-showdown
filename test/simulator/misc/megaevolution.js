'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let strongAbilities = ['battlebond', 'comatose', 'disguise', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange'];

let battle;

describe('Mega Evolution', function () {
	afterEach(function () {
		battle.destroy();
	});

	for (const strongAbility of strongAbilities) {
		it('should overwrite normally immutable abilities', function () {
			battle = common.createBattle();
			const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Metagross", ability: strongAbility, item: 'metagrossite', moves: ['metalclaw']}]);
			battle.join('p2', 'Guest 2', 1, [{species: "Wishiwashi", ability: strongAbility, moves: ['uturn']}]);
			battle.makeChoices('move metalclaw mega', 'move uturn');
			assert.equal(p1.active[0].ability, 'toughclaws');
		});
	}
});
