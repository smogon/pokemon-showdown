'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Present', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should heal the Pokemon through Substitute`, function () {
		// Seed guarantees 2 healing Presents turn 1
		battle = common.createBattle({gameType: 'doubles', seed: [1, 1, 1, 1]}, [[
			{species: "Delibird", level: 1, ability: 'compoundeyes', moves: ['present']},
			{species: "Delibird", level: 1, ability: 'compoundeyes', moves: ['present']},
		], [
			{species: "Wynaut", moves: ['laser focus', 'substitute']},
			{species: "Hatterene", moves: ['laser focus', 'bellydrum']},
		]]);

		battle.makeChoices('move present 1, move present 2', 'move substitute, move laserfocus');
		const wynaut = battle.p2.active[0];
		assert.equal(wynaut.hp, wynaut.maxhp);
	});
});
