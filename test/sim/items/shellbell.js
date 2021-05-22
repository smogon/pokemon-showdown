'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shell Bell', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should heal from the damage against all targets of the move`, function () {
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

	// Also applies to Parental Bond
	it(`should heal from the damage from all hits of multi-hit moves`, function () {
		battle = common.createBattle([[
			{species: 'shelmet', moves: ['finalgambit']},
			{species: 'landorus', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'cloyster', ability: 'skilllink', item: 'shellbell', evs: {hp: 4}, moves: ['sleeptalk', 'iciclespear']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2');
		battle.makeChoices('auto', 'move iciclespear');
		const landorus = battle.p1.active[0];
		const cloyster = battle.p2.active[0];
		assert.equal(cloyster.hp, 1 + Math.floor(landorus.maxhp / 8));
	});
});
