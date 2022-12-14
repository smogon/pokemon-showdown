'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Mycelium Might", function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should cause attacks called by empowered status moves to ignore abilities", function () {
		battle = common.createBattle({seed: [0, 1, 2, 3]}, [
			[{species: "Toedscool", ability: 'myceliummight', moves: ['rest', 'sleeptalk', 'mudshot']}],
			[{species: "Orthworm", ability: 'eartheater', moves: ['tackle']}],
		]);
		battle.makeChoices();
		battle.makeChoices('move sleeptalk', 'auto');
		assert.false.fullHP(battle.p2.active[0]);
	});
});
