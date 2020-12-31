'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shell Bell', function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should heal from the damage against all targets of the move`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'tornadus', ability: 'compoundeyes', moves: ['superfang']},
			{species: 'landorus', item: 'shellbell', moves: ['earthquake']},
		], [
			{species: 'roggenrola', ability: 'sturdy', level: 1, moves: ['sleeptalk']},
			{species: 'aron', ability: 'sturdy', level: 1, moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move superfang -2, move earthquake', 'auto');
		const landorus = battle.p1.active[1];
		assert.equal(landorus.hp, landorus.maxhp - Math.floor(landorus.maxhp / 2) + (Math.floor(11 * 2 / 8)));
	});
});
