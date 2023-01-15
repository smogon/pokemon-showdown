'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;
let damages;

describe('Parental Bond', function () {
	beforeEach(function () {
		battle = common.createBattle([[
			{species: 'Kangaskhan', ability: 'parentalbond', item: 'electriumz', moves: ['thunderpunch', 'doublekick']},
		], [
			{species: 'Aggron', ability: 'battlearmor', moves: ['rest']},
		]]);

		damages = [];
		battle.onEvent('ModifyDamage', battle.format, -9, function (damage, attacker, defender, move) {
			damages.push(damage);
		});
	});

	afterEach(function () {
		battle.destroy();
	});

	it(`should cause single-hit attacks to strike twice, with the second hit dealing 0.25x damage`, function () {
		battle.makeChoices('move thunderpunch', 'move rest');
		assert.bounded(damages[0], [31, 37]);
		assert.bounded(damages[1], [7, 9]);
	});

	it(`should not have any effect on moves with multiple hits`, function () {
		battle.makeChoices('move doublekick', 'move rest');
		assert.bounded(damages[0], [52, 64]);
		assert.bounded(damages[1], [52, 64]);
	});

	it(`should not have any effect Z-Moves`, function () {
		battle.makeChoices('move thunderpunch zmove', 'move rest');
		assert.equal(damages.length, 1);
		assert.bounded(damages[0], [58, 69]);
	});
});

describe('Parental Bond [Gen 6]', function () {
	beforeEach(function () {
		battle = common.gen(6).createBattle([[
			{species: 'Kangaskhan', ability: 'parentalbond', item: 'electriumz', moves: ['thunderpunch', 'doublekick']},
		], [
			{species: 'Aggron', ability: 'battlearmor', moves: ['rest']},
		]]);

		damages = [];
		battle.onEvent('ModifyDamage', battle.format, -9, function (damage, attacker, defender, move) {
			damages.push(damage);
		});
	});

	afterEach(function () {
		battle.destroy();
	});

	it(`should cause single-hit attacks to strike twice, with the second hit dealing 0.5x damage`, function () {
		battle.makeChoices('move thunderpunch', 'move rest');
		assert.bounded(damages[0], [31, 37]);
		assert.bounded(damages[1], [15, 18]);
	});

	it(`should not have any effect on moves with multiple hits`, function () {
		battle.makeChoices('move doublekick', 'move rest');
		assert.bounded(damages[0], [52, 64]);
		assert.bounded(damages[1], [52, 64]);
	});
});
