'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Rattled', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should boost the user's Speed when Intimidated`, function () {
		battle = common.createBattle([[
			{species: 'Dunsparce', ability: 'rattled', moves: ['sleeptalk']},
		], [
			{species: 'Incineroar', ability: 'intimidate', moves: ['sleeptalk']},
		]]);

		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p1.active[0], 'spe', 1);
	});

	it(`should not boost the user's Speed if Intimidate failed to lower attack`, function () {
		battle = common.createBattle([[
			{species: 'Dunsparce', item: 'clearamulet', ability: 'rattled', moves: ['sleeptalk']},
		], [
			{species: 'Incineroar', ability: 'intimidate', moves: ['sleeptalk']},
		]]);

		assert.statStage(battle.p1.active[0], 'atk', 0);
		assert.statStage(battle.p1.active[0], 'spe', 0);
	});
});
