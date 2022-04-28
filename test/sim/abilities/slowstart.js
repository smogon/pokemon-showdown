'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe.only(`Slow Start`, function () {
	afterEach(function () {
		battle.destroy();
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

	it(`[Gen 7] should halve the user's Special Attack when using a special Z-move`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'regigigas', ability: 'slowstart', item: 'normaliumz', moves: ['hyperbeam']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move hyperbeam zmove', 'auto');
		const wynaut = battle.p2.active[0];
		const damage = wynaut.maxhp - wynaut.hp;
		assert.bounded(damage, [160, 189]);
	});

	it(`[Gen 7] should not halve the user's Attack when using physical Photon Geyser`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'regigigas', ability: 'slowstart', moves: ['photongeyser']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move photongeyser', 'auto');
		const wynaut = battle.p2.active[0];
		const damage = wynaut.maxhp - wynaut.hp;
		assert.bounded(damage, [96, 114]);
	});
});
