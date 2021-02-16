'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Slow Start`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should halve the user's Sp. Atk when using a special Z-move`, function () {
		battle = common.createBattle([[
			{species: 'regigigas', ability: 'slowstart', item: 'normaliumz', moves: ['hyperbeam']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move hyperbeam zmove', 'auto');
		const wynaut = battle.p2.active[0];
		const damage = wynaut.maxhp - wynaut.hp;
		assert.bounded(damage, [160, 189]);
	});

	it(`should not delay activation on switch-in, unlike Speed Boost`, function () {
		battle = common.createBattle([[
			{species: 'diglett', moves: ['sleeptalk']},
			{species: 'regigigas', ability: 'slowstart', item: 'normaliumz', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('switch 2', 'auto');
		for (let i = 0; i < 4; i++) { battle.makeChoices(); }
		const log = battle.getDebugLog();
		const slowStartEnd = log.indexOf('|-end|p1a: Regigigas|Slow Start');
		assert(slowStartEnd > -1, 'Slow Start should end in 5 turns, including the turn it switched in.');
	});
});
