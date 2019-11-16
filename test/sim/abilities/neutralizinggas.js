'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Neutralizing Gas", function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should disable abilities", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Weezing-Galar', ability: 'neutralizinggas', moves: ['payback']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Ferrothorn', ability: 'ironbarbs', moves: ['rockpolish']},
		]});
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
	});
});
