'use strict';

const assert = require('assert').strict;
const common = require('./../../common');

let battle;

describe(`Terapagos`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should accept the Terastallization choice, but not Terastallize while Transformed into Terapagos-Terastal`, function () {
		battle = common.createBattle([[
			{species: 'ditto', ability: 'imposter', moves: ['sleeptalk']},
		], [
			{species: 'terapagos', ability: 'terashift', moves: ['sleeptalk'], teraType: 'Stellar'},
		]]);

		// Currently throws a choice error
		battle.makeChoices('move sleeptalk terastallize', 'auto');

		const ditto = battle.p1.active[0];
		assert.false(!!ditto.terastallized);
	});

	it(`[Hackmons] should not cause Terapagos-Terastal to become Terapagos-Stellar if the user is Transformed`, function () {
		battle = common.createBattle([[
			{species: 'terapagos', ability: 'terashift', moves: ['transform'], teraType: 'Stellar'},
			{species: 'pikachu', moves: ['sleeptalk']},
		], [
			{species: 'silicobra', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices('move sleeptalk terastallize', 'auto');
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'auto');
		const terapagos = battle.p1.active[0];
		assert.species(terapagos, 'Terapagos-Terastal');
	});
});
