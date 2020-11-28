'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Flower Shield', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should boost the Defense of all Grass type Pokemon in play', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'sunflora', moves: ['flowershield']},
			{species: 'aegislash', moves: ['kingsshield']},
		], [
			{species: 'ferrothorn', moves: ['protect']},
			{species: 'kartana', moves: ['swordsdance']},
		]]);
		battle.makeChoices('move flowershield, move kingsshield', 'move protect dynamax, move swordsdance');

		assert.statStage(battle.p1.active[0], 'def', 1);
		assert.statStage(battle.p1.active[1], 'def', 0);
		assert.statStage(battle.p2.active[0], 'def', 0, 'A Pokemon that has used Max Guard cannot be targeted by Flower Shield');
		assert.statStage(battle.p2.active[1], 'def', 1);
	});
});
