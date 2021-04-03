'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Stealth Rock', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should succeed against Substitute', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Smeargle", moves: ['stealthrock']}]});
		battle.setPlayer('p2', {team: [{species: "Ninjask", moves: ['substitute']}]});
		battle.makeChoices('move stealthrock', 'move substitute');
		assert(battle.p2.sideConditions['stealthrock']);
	});

	it('should deal damage to Pokemon switching in based on their type effectiveness against Rock-type', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Smeargle", moves: ['splash', 'stealthrock']}]});
		battle.setPlayer('p2', {team: [
			{species: "Ninjask", moves: ['protect']},
			{species: "Volcarona", moves: ['roost']},
			{species: "Staraptor", moves: ['roost']},
			{species: "Chansey", moves: ['wish']},
			{species: "Hitmonchan", moves: ['rest']},
			{species: "Steelix", moves: ['rest']},
		]});
		battle.makeChoices('move stealthrock', 'move protect');
		let pokemon;
		for (let i = 2; i <= 6; i++) {
			battle.makeChoices('move splash', 'switch ' + i);
			pokemon = battle.p2.active[0];
			const expectedPercent = Math.pow(0.5, i - 1);
			const expectedDamage = Math.floor(pokemon.maxhp * expectedPercent);
			assert.equal(pokemon.maxhp - pokemon.hp, expectedDamage, `${pokemon.name} should take ${expectedPercent * 100}%`);
		}
	});

	it('should deal 2x damage to Eiscue', function () {
		battle = common.createBattle([[
			{species: "Ninjask", moves: ['stealthrock']},
		], [
			{species: "Mew", moves: ['uturn']},
			{species: "Eiscue", ability: 'iceface', moves: ['splash']},
		]]);
		battle.makeChoices();
		battle.makeChoices('', 'switch eiscue');

		const pokemon = battle.p2.active[0];
		const expectedPercent = Math.pow(0.5, 2);
		const expectedDamage = Math.floor(pokemon.maxhp * expectedPercent);
		assert.equal(pokemon.maxhp - pokemon.hp, expectedDamage, `${pokemon.name} should take ${expectedPercent * 100}%`);
	});
});
