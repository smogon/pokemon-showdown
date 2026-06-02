'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Fainted forme regression`, () => {
	afterEach(() => {
		battle.destroy();
	});

	it('[Hackmons] should be able to revert between different mega evolutions', () => {
		battle = common.createBattle([[
			{ species: 'charizardmegay', ability: 'drought', item: 'charizarditex', moves: ['memento'] },
			{ species: 'darkrai', moves: ['darkpulse'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move memento mega', 'auto');
		assert.species(pokemon, 'Charizard-Mega-Y');
		assert.hasAbility(pokemon, 'Drought');
	});

	it(`should revert Mega Evolutions`, () => {
		battle = common.createBattle([[
			{ species: 'alakazam', ability: 'synchronize', item: 'alakazite', moves: ['memento'] },
			{ species: 'darkrai', moves: ['darkpulse'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move memento mega', 'auto');
		assert.species(pokemon, 'Alakazam');
		assert.hasAbility(pokemon, 'Synchronize');
	});

	it(`should revert Rayquaza-Mega`, () => {
		battle = common.gen(7).createBattle([[
			{ species: 'rayquaza', ability: 'airlock', moves: ['memento', 'dragonascent'] },
			{ species: 'darkrai', moves: ['darkpulse'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move memento mega', 'auto');
		assert.species(pokemon, 'Rayquaza');
		assert.hasAbility(pokemon, 'Air Lock');
	});

	it(`should revert Primal forms`, () => {
		battle = common.createBattle([[
			{ species: 'kyogre', ability: 'drizzle', moves: ['memento'] },
			{ species: 'darkrai', moves: ['darkpulse'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices();
		assert.species(pokemon, 'Kyogre');
		assert.hasAbility(pokemon, 'Drizzle');
	});

	it(`should revert Greninja-Ash and not allow it to transform again`, () => {
		battle = common.gen(7).createBattle([[
			{ species: 'greninjabond', ability: 'battlebond', moves: ['surf', 'memento'] },
			{ species: 'pawmot', moves: ['revivalblessing'] },
		], [
			{ species: 'mareep', level: 5, ability: 'static', moves: ['sleeptalk'] },
			{ species: 'mareep', level: 5, ability: 'static', moves: ['sleeptalk'] },
			{ species: 'mareep', level: 5, ability: 'static', moves: ['sleeptalk'] },
		]]);
		const pokemon = battle.p1.active[0];
		assert.species(pokemon, 'Greninja-Bond');
		battle.makeChoices();
		assert.species(pokemon, 'Greninja-Ash');

		battle.makeChoices(); // switch
		battle.makeChoices('move memento', 'auto');
		assert.species(pokemon, 'Greninja-Bond');

		battle.makeChoices(); // switch
		battle.makeChoices();
		battle.makeChoices(); // revival
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices();
		assert.species(pokemon, 'Greninja-Bond');
	});

	it(`should not revert Arceus-forms to base Arceus`, () => {
		battle = common.createBattle([[
			{ species: 'arceusfire', ability: 'multitype', item: 'flameplate', moves: ['memento'] },
			{ species: 'darkrai', moves: ['darkpulse'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices();
		assert.species(pokemon, 'Arceus-Fire');
		assert.hasAbility(pokemon, 'Multitype');
	});

	it(`should not revert Mimikyu-Busted to base Mimikyu`, () => {
		battle = common.createBattle([[
			{ species: 'mimikyu', ability: 'disguise', moves: ['memento'] },
			{ species: 'pawmot', moves: ['revivalblessing'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk', 'aquajet'] },
		]]);
		battle.makeChoices('auto', 'move aquajet');
		battle.makeChoices(); // switch
		battle.makeChoices();
		battle.makeChoices(); // revival
		battle.makeChoices('switch 2', 'auto'); // switch

		const pokemon = battle.p1.active[0];
		assert.species(pokemon, 'Mimikyu-Busted');
		assert.equal(pokemon.hp, Math.floor(pokemon.maxhp / 2));
	});

	it(`Mimikyu should keep its disguise if it was not busted`, () => {
		battle = common.createBattle([[
			{ species: 'mimikyu', ability: 'disguise', moves: ['memento'] },
			{ species: 'pawmot', moves: ['revivalblessing'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		battle.makeChoices(); // switch
		battle.makeChoices();
		battle.makeChoices(); // revival
		battle.makeChoices('switch 2', 'auto'); // switch

		const pokemon = battle.p1.active[0];
		assert.species(pokemon, 'Mimikyu');
		assert.equal(pokemon.hp, Math.floor(pokemon.maxhp / 2));
	});

	it(`[Gen 8] should revert Mimikyu-Busted to base Mimikyu`, () => {
		battle = common.gen(8).createBattle([[
			{ species: 'mimikyu', ability: 'disguise', moves: ['memento'] },
			{ species: 'pawmot', moves: ['revivalblessing'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk', 'aquajet'] },
		]]);
		battle.makeChoices('auto', 'move aquajet');
		battle.makeChoices(); // switch
		battle.makeChoices();
		battle.makeChoices(); // revival
		battle.makeChoices('switch 2', 'auto'); // switch

		const pokemon = battle.p1.active[0];
		assert.species(pokemon, 'Mimikyu');
		assert.equal(pokemon.hp, Math.floor(pokemon.maxhp / 2));
	});

	it("should not revert Eiscue-Noice to base Eiscue", () => {
		battle = common.createBattle([[
			{ species: 'eiscuenoice', ability: 'iceface', moves: ['memento'] },
			{ species: 'darkrai', moves: ['darkpulse'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['quickattack'] },
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices();
		assert.species(pokemon, 'Eiscue-Noice');
		assert.hasAbility(pokemon, 'Ice Face');
	});

	it("should revert Terastallized Morpeko-Hangry to base Morpeko", () => {
		battle = common.createBattle([[
			{ species: 'Morpeko', ability: 'hungerswitch', moves: ['memento', 'sleeptalk'] },
			{ species: 'darkrai', moves: ['darkpulse'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'auto');
		assert.species(pokemon, 'Morpeko-Hangry');
		battle.makeChoices('move memento terastallize', 'auto');
		assert.species(pokemon, 'Morpeko');
		assert.hasAbility(pokemon, 'Hunger Switch');
	});

	it(`should not revert Palafin-Hero to base Palafin`, () => {
		battle = common.createBattle([[
			{ species: 'palafin', ability: 'zerotohero', moves: ['memento'] },
			{ species: 'darkrai', moves: ['darkpulse'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'auto');
		assert.species(pokemon, 'Palafin-Hero');
		battle.makeChoices('move memento', 'auto');
		assert.species(pokemon, 'Palafin-Hero');
		assert.hasAbility(pokemon, 'Zero to Hero');
	});

	it(`should revert Ogerpon-Tera to base Ogerpon`, () => {
		battle = common.gen(9).createBattle([[
			{
				species: 'ogerponwellspring', ability: 'waterabsorb', item: 'wellspring mask',
				moves: ['memento'], teraType: 'Water',
			},
			{ species: 'darkrai', moves: ['darkpulse'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move memento terastallize', 'auto');
		assert.species(pokemon, 'Ogerpon-Wellspring');
		assert.hasAbility(pokemon, 'Water Absorb');
	});

	it(`should not revert Terapagos-Terastal to base Terapagos`, () => {
		battle = common.createBattle([[
			{ species: 'terapagos', ability: 'terashift', moves: ['memento'] },
			{ species: 'darkrai', moves: ['darkpulse'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices();
		assert.species(pokemon, 'Terapagos-Terastal');
		assert.hasAbility(pokemon, 'Tera Shell');
	});

	it(`should revert Terapagos-Stellar to base Terapagos`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'terapagos', ability: 'terashift', moves: ['memento'], teraType: 'Stellar' },
			{ species: 'darkrai', moves: ['darkpulse'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
		]]);
		const pokemon = battle.p1.active[0];
		battle.makeChoices('move memento terastallize', 'auto');
		assert.species(pokemon, 'Terapagos');
		assert.hasAbility(pokemon, 'Tera Shift');
	});
});
