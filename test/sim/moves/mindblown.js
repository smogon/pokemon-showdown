'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mind Blown', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deal damage to the user once per use equal to half its max HP, rounded up', function () {
		battle = common.createBattle([[
			{species: "Blacephalon", ability: 'parentalbond', moves: ['mindblown']},
		], [
			{species: "Blissey", ability: 'healer', moves: ['sleeptalk']},
		]]);
		assert.hurtsBy(battle.p1.active[0], Math.ceil(battle.p1.active[0].maxhp / 2), () => battle.makeChoices());
	});

	it('should deal damage to the user even if it misses', function () {
		battle = common.createBattle([[
			{species: "Blacephalon", moves: ['mindblown']},
		], [
			{species: "Talonflame", moves: ['fly']},
		]]);
		assert.hurtsBy(battle.p1.active[0], Math.ceil(battle.p1.active[0].maxhp / 2), () => battle.makeChoices());
	});
});
