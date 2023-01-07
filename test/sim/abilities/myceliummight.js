'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Mycelium Might", function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should cause attacks called by empowered status moves to ignore abilities", function () {
		battle = common.createBattle([[
			{species: "Pyukumuku", ability: 'myceliummight', moves: ['sleeptalk', 'earthquake']},
		], [
			{species: "Orthworm", ability: 'eartheater', moves: ['spore']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});
});
