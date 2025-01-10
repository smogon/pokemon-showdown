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

	it(`[Hackmons] can Terastallize into other types, but Teraform Zero fails`, function () {
		battle = common.createBattle([[
			{species: 'terapagos', ability: 'terashift', moves: ['sleeptalk'], teraType: 'Fire'},
		], [
			{species: 'kyogre', ability: 'drizzle', moves: ['sleeptalk']},
		]]);
		const terapagos = battle.p1.active[0];
		battle.makeChoices('move sleeptalk terastallize', 'auto');
		assert.species(terapagos, 'Terapagos-Stellar');
		assert.equal(terapagos.terastallized, 'Fire');
		assert(battle.log.includes('|-ability|p1a: Terapagos|Teraform Zero'), 'Teraform Zero should activate');
		assert.equal(battle.field.weather, 'raindance', 'Teraform Zero should fail');
	});
});
