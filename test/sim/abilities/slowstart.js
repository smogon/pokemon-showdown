'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Slow Start`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should delay activation on switch-in, like Speed Boost`, function () {
		battle = common.createBattle([[
			{species: 'diglett', moves: ['sleeptalk']},
			{species: 'regigigas', ability: 'slowstart', item: 'normaliumz', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('switch 2', 'auto');
		for (let i = 0; i < 4; i++) { battle.makeChoices(); }
		let log = battle.getDebugLog();
		let slowStartEnd = log.indexOf('|-end|p1a: Regigigas|Slow Start');
		assert.false(slowStartEnd > -1, 'Slow Start should remain in effect after 4 active turns.');

		battle.makeChoices();
		log = battle.getDebugLog();
		slowStartEnd = log.indexOf('|-end|p1a: Regigigas|Slow Start');
		assert(slowStartEnd > -1, 'Slow Start should not be in effect after 5 active turns.');
	});

	it(`[Gen 7] should halve the user's Special Attack when using a special Z-move`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'regigigas', ability: 'slowstart', item: 'normaliumz', moves: ['hyperbeam']},
		], [
			{species: 'wynaut', ability: 'shellarmor', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move hyperbeam zmove', 'auto');
		const wynaut = battle.p2.active[0];
		const damage = wynaut.maxhp - wynaut.hp;
		assert.bounded(damage, [160, 189]);
	});

	it(`[Gen 7] should not halve the user's Attack when using physical Photon Geyser`, function () {
		// We are using Photon Geyser through Assist, because otherwise Photon Geyser would just ignore Slow Start
		battle = common.gen(7).createBattle([[
			{species: 'regigigas', ability: 'slowstart', moves: ['assist']},
			{species: 'necrozma', moves: ['photongeyser']},
		], [
			{species: 'wynaut', ability: 'shellarmor', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const wynaut = battle.p2.active[0];
		const damage = wynaut.maxhp - wynaut.hp;
		assert.bounded(damage, [96, 114]);
	});
});
