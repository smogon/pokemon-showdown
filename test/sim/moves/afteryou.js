'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('After You', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should only cause the target to move next, not run a submove`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Wynaut", ability: 'prankster', moves: ['afteryou']},
			{species: "Necrozma", level: 50, ability: 'prankster', moves: ['photongeyser']},
		], [
			{species: "Dugtrio", moves: ['sleeptalk']},
			{species: "Roggenrola", level: 1, ability: 'sturdy', moves: ['sleeptalk']},
		]]);

		// Photon Geyser has a mechanic where it ignores abilities with Mold Breaker,
		// but doesn't when called via a submove like Sleep Talk. If it fails to KO through Sturdy,
		// it's most likely because it's using submove behavior
		battle.makeChoices('move afteryou -2, move photongeyser 2', 'auto');
		const roggenrola = battle.p2.active[1];
		assert.fainted(roggenrola);
	});
});
