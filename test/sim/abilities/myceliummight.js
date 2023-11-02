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
	it("should never trigger your own quick claw if using a status move", function () {
		battle = common.createBattle({forceRandomChance: true}, [[
			{species: "Bonsly", ability: 'myceliummight', item: 'quickclaw', moves: ['spore']},
		], [
			{species: "Regieleki", moves: ['falseswipe']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p1.active[0]);
	});
	it("should be able to trigger your own quick claw if using a non-status move", function () {
		battle = common.createBattle({forceRandomChance: true}, [[
			{species: "Bonsly", ability: 'myceliummight', item: 'quickclaw', moves: ['tackle']},
		], [
			{species: "Regieleki", moves: ['spore']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});
});
