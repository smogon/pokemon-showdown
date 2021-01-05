'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Speed`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should cap chained Speed modifiers at 410 as a lower bound`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'regigigas', ability: 'slowstart', item: 'ironball', moves: ['waterpledge']},
			{species: 'ivysaur', moves: ['grasspledge']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move waterpledge -2, move grasspledge -1', 'auto');
		const regigigas = battle.p1.active[0];
		// Regigigas has 236 starting Speed; the end result should be pokeRound(236 * 410 / 4096), not pokeRound(236 * 256 / 4096)
		assert.equal(regigigas.getStat('spe'), 24);
	});
});
