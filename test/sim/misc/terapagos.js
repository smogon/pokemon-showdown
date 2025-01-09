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

	it(`shouldn't revert to Terapagos-Normal if it faints while Terastallized`, function () {
		battle = common.createBattle([[
			{species: 'terapagos', ability: 'terashift', moves: ['memento']},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const terapagos = battle.p1.active[0];
		battle.makeChoices();
		assert.species(terapagos, 'Terapagos-Terastal');
		assert.equal(terapagos.ability, 'terashell', `Expected ${terapagos}'ability to be Tera Shell, not ${terapagos.ability}`);
	});

	it(`should revert to Terapagos-Normal if it faints while Terastallized`, function () {
		battle = common.createBattle([[
			{species: 'terapagos', ability: 'terashift', moves: ['memento']},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const terapagos = battle.p1.active[0];
		battle.makeChoices('move memento terastallize', 'auto');
		assert.species(terapagos, 'Terapagos');
		assert.equal(terapagos.ability, 'terashift', `Expected ${terapagos}'ability to be Tera Shift, not ${terapagos.ability}`);
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
