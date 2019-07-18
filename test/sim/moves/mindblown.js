'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mind Blown', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deal damage to the user once per use equal to half its max HP, rounded up', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Blacephalon", ability: 'parentalbond', moves: ['mindblown']}]});
		battle.setPlayer('p2', {team: [{species: "Blissey", ability: 'healer', moves: ['sleeptalk']}]});
		assert.hurtsBy(battle.p1.active[0], Math.ceil(battle.p1.active[0].maxhp / 2), () => battle.makeChoices(`move mindblown`, `move sleeptalk`));
	});
});
