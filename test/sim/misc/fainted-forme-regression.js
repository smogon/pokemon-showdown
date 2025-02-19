'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Fainted forme regression`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it('[Hackmons] should be able to revert between different mega evolutions', function () {
		battle = common.createBattle([[
			{species: 'charizardmegay', ability: 'drought', item: 'charizarditex', moves: ['memento']},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move memento mega', 'auto');
		assert.species(pokemon, 'Charizard-Mega-Y');
		assert.hasAbility(pokemon, 'Drought');
	});

	it(`should revert Mega Evolutions`, function () {
		battle = common.createBattle([[
			{species: 'alakazam', ability: 'synchronize', item: 'alakazite', moves: ['memento']},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move memento mega', 'auto');
		assert.species(pokemon, 'Alakazam');
		assert.hasAbility(pokemon, 'Synchronize');
	});

	it(`should revert Rayquaza-Mega`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'rayquaza', ability: 'airlock', moves: ['memento', 'dragonascent']},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move memento mega', 'auto');
		assert.species(pokemon, 'Rayquaza');
		assert.hasAbility(pokemon, 'Air Lock');
	});

	it(`should revert Primal forms`, function () {
		battle = common.createBattle([[
			{species: 'kyogre', ability: 'drizzle', moves: ['memento']},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices();
		assert.species(pokemon, 'Kyogre');
		assert.hasAbility(pokemon, 'Drizzle');
	});

	it(`shouldn't revert Arceus-forms to base Arceus`, function () {
		battle = common.createBattle([[
			{species: 'arceusfire', ability: 'multitype', item: 'flameplate', moves: ['memento']},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices();
		assert.species(pokemon, 'Arceus-Fire');
		assert.hasAbility(pokemon, 'Multitype');
	});

	it("should revert Terastallized Morpeko-Hangry to base Morpeko", function () {
		battle = common.gen(9).createBattle([[
			{species: 'Morpeko', ability: 'hungerswitch', moves: ['memento', 'sleeptalk']},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'auto');
		assert.species(pokemon, 'Morpeko-Hangry');
		battle.makeChoices('move memento terastallize', 'auto');
		assert.species(pokemon, 'Morpeko');
		assert.hasAbility(pokemon, 'Hunger Switch');
	});

	it(`shouldn't revert Palafin-Hero to base Palafin`, function () {
		battle = common.createBattle([[
			{species: 'palafin', ability: 'zerotohero', moves: ['memento']},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'auto');
		assert.species(pokemon, 'Palafin-Hero');
		battle.makeChoices('move memento', 'auto');
		assert.species(pokemon, 'Palafin-Hero');
		assert.hasAbility(pokemon, 'Zero to Hero');
	});

	it(`should revert Ogerpon-Tera to base Ogerpon`, function () {
		battle = common.gen(9).createBattle([[
			{
				species: 'ogerponwellspring', ability: 'waterabsorb', item: 'wellspring mask',
				moves: ['memento'], teraType: 'Water',
			},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move memento terastallize', 'auto');
		assert.species(pokemon, 'Ogerpon-Wellspring');
		assert.hasAbility(pokemon, 'Water Absorb');
	});

	it(`shouldn't revert Terapagos-Terastal to base Terapagos`, function () {
		battle = common.createBattle([[
			{species: 'terapagos', ability: 'terashift', moves: ['memento']},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices();
		assert.species(pokemon, 'Terapagos-Terastal');
		assert.hasAbility(pokemon, 'Tera Shell');
	});

	it(`should revert Terapagos-Stellar to base Terapagos`, function () {
		battle = common.gen(9).createBattle([[
			{species: 'terapagos', ability: 'terashift', moves: ['memento'], teraType: 'Stellar'},
			{species: 'darkrai', moves: ['darkpulse']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move memento terastallize', 'auto');
		assert.species(pokemon, 'Terapagos');
		assert.hasAbility(pokemon, 'Tera Shift');
	});
});
