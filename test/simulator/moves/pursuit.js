'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Pursuit`, function () {
	afterEach(() => battle.destroy());

	it(`should execute before the target switches out and after the user mega evolves`, function () {
		battle = common.createBattle([[
			{species: "Beedrill", ability: 'swarm', item: 'beedrillite', moves: ['pursuit']},
		], [
			{species: "Alakazam", ability: 'magicguard', moves: ['psyshock']},
			{species: "Clefable", ability: 'unaware', moves: ['calmmind']},
		]]);
		battle.makeChoices('move Pursuit mega', 'switch 2');
		assert.species(battle.p1.active[0], "Beedrill-Mega");
		assert.fainted(battle.p2.active[0]);
	});

	it(`should continue the switch in Gen 3`, function () {
		battle = common.gen(3).createBattle([[
			{species: "Tyranitar", ability: 'sandstream', moves: ['pursuit']},
		], [
			{species: "Alakazam", ability: 'magicguard', moves: ['psyshock']},
			{species: "Clefable", ability: 'unaware', moves: ['calmmind']},
		]]);
		battle.makeChoices('move Pursuit', 'switch 2');
		assert(battle.p2.active[0].hp);
	});

	it(`should continue the switch in Gen 4`, function () {
		battle = common.gen(4).createBattle([[
			{species: "Tyranitar", ability: 'sandstream', moves: ['pursuit']},
		], [
			{species: "Alakazam", ability: 'magicguard', moves: ['psyshock']},
			{species: "Clefable", ability: 'unaware', moves: ['calmmind']},
		]]);
		battle.makeChoices('move Pursuit', 'switch 2');
		assert(battle.p2.active[0].hp);
	});

	it(`should not repeat`, function () {
		battle = common.createBattle([[
			{species: "Beedrill", ability: 'swarm', item: 'beedrillite', moves: ['pursuit']},
			{species: "Clefable", ability: 'unaware', moves: ['calmmind']},
		], [
			{species: "Clefable", ability: 'magicguard', moves: ['calmmind']},
			{species: "Alakazam", ability: 'unaware', moves: ['calmmind']},
		]]);
		battle.makeChoices('move Pursuit mega', 'auto');
		let clefable = battle.p2.pokemon[0];
		let hpBeforeSwitch = clefable.hp;
		battle.makeChoices('switch 2', 'switch 2');
		assert.strictEqual(hpBeforeSwitch, clefable.hp);
	});

	it(`should not double in power or activate before a switch if targeting an ally`, function () {
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4]}, [[
			{species: "Beedrill", ability: 'swarm', item: 'beedrillite', moves: ['pursuit']},
			{species: "Clefable", ability: 'unaware', moves: ['calmmind']},
			{species: "Furret", ability: 'frisk', moves: ['uturn']},
		], [
			{species: "Clefable", ability: 'magicguard', moves: ['calmmind']},
			{species: "Alakazam", ability: 'unaware', moves: ['calmmind']},
		]]);
		assert.hurtsBy(battle.p1.pokemon[2], 61, () => battle.makeChoices('move Pursuit mega -2, switch 3', 'auto'));
	});
});
