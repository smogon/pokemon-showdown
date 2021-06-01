'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Present', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should heal the Pokemon through Substitute`, function () {
		// Seed guarantees the Present that hits Wynaut heals
		// (remember to manually update the seed if engine changes mean it doesn't)
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4]}, [[
			{species: "Delibird", level: 1, ability: 'compoundeyes', moves: ['present']},
			{species: "Delibird", level: 1, ability: 'compoundeyes', moves: ['splash']},
		], [
			{species: "Wynaut", moves: ['splash', 'substitute']},
			{species: "Hatterene", moves: ['splash']},
		]]);

		battle.makeChoices('move present 1, move splash', 'move substitute, move splash');
		const wynaut = battle.p2.active[0];
		assert.equal(wynaut.hp, wynaut.maxhp);
	});
});
