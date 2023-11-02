'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Charge', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should double the base power of the next Electric attack', function () {
		battle = common.createBattle([[
			{species: 'Kilowattrel', moves: ['charge', 'thunderbolt']},
		], [
			{species: 'Dondozo', ability: 'shellarmor', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices('move thunderbolt', 'auto');
		assert.fainted(battle.p2.active[0]);
	});

	it('should remain active until an Electric-type attack is used', function () {
		battle = common.createBattle([[
			{species: 'Kilowattrel', moves: ['charge', 'agility', 'airslash', 'thunderbolt', 'naturepower']},
		], [
			{species: 'Baxcalibur', moves: ['sleeptalk', 'electricterrain']},
		]]);

		battle.makeChoices();
		battle.makeChoices('move agility', 'auto');
		assert(battle.p1.active[0].volatiles['charge']);
		battle.makeChoices('move airslash', 'auto');
		assert(battle.p1.active[0].volatiles['charge']);
		battle.makeChoices('move thunderbolt', 'auto');
		assert.false(battle.p1.active[0].volatiles['charge']);
		battle.makeChoices('auto', 'move electricterrain');
		battle.makeChoices('move naturepower', 'auto');
		assert.false(battle.p1.active[0].volatiles['charge']);
	});

	it('should wear off after an Electric-type status move that is not Charge is used', function () {
		battle = common.createBattle([[
			{species: 'Kilowattrel', moves: ['charge', 'thunderwave']},
		], [
			{species: 'Baxcalibur', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices();
		assert(battle.p1.active[0].volatiles['charge']);
		battle.makeChoices('move thunderwave', 'auto');
		assert.false(battle.p1.active[0].volatiles['charge']);
	});
});

describe('Charge [Gen 8]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should wear off after a move of any type is used', function () {
		battle = common.gen(8).createBattle([[
			{species: 'Pikachu', moves: ['charge', 'tackle', 'thundershock']},
		], [
			{species: 'Dragapult', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices('move tackle', 'auto');
		assert.false(battle.p1.active[0].volatiles['charge']);
		battle.makeChoices();
		battle.makeChoices('move thundershock', 'auto');
		assert.false(battle.p1.active[0].volatiles['charge']);
	});
});
