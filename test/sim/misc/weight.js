'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Heavy Metal', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should double the weight of a Pokemon', function () {
		battle = common.createBattle([
			[{species: "Simisear", ability: 'heavymetal', moves: ['nastyplot']}],
			[{species: "Simisage", ability: 'gluttony', moves: ['grassknot']}],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, function (bp, attacker, defender, move) {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move nastyplot', 'move grassknot');
		assert.strictEqual(basePower, 80);
	});

	it('should be negated by Mold Breaker', function () {
		battle = common.createBattle([
			[{species: "Simisear", ability: 'heavymetal', moves: ['nastyplot']}],
			[{species: "Simisage", ability: 'moldbreaker', moves: ['grassknot']}],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, function (bp, attacker, defender, move) {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move nastyplot', 'move grassknot');
		assert.strictEqual(basePower, 60);
	});
});

describe('Light Metal', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should halve the weight of a Pokemon', function () {
		battle = common.createBattle([
			[{species: "Registeel", ability: 'lightmetal', moves: ['curse']}],
			[{species: "Simisage", ability: 'gluttony', moves: ['grassknot']}],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, function (bp, attacker, defender, move) {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move curse', 'move grassknot');
		assert.strictEqual(basePower, 100);
	});

	it('should be negated by Mold Breaker', function () {
		battle = common.createBattle([
			[{species: "Registeel", ability: 'lightmetal', moves: ['splash']}],
			[{species: "Simisage", ability: 'moldbreaker', moves: ['grassknot']}],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, function (bp, attacker, defender, move) {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move splash', 'move grassknot');
		assert.strictEqual(basePower, 120);
	});
});

describe('Float Stone', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should halve the weight of a Pokemon', function () {
		battle = common.createBattle([
			[{species: "Registeel", ability: 'clearbody', item: 'floatstone', moves: ['curse']}],
			[{species: "Simisage", ability: 'gluttony', moves: ['grassknot']}],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, function (bp, attacker, defender, move) {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move curse', 'move grassknot');
		assert.strictEqual(basePower, 100);
	});
});

describe('Autotomize', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should reduce the weight of a Pokemon by 100 kg with each use', function () {
		battle = common.createBattle([
			[{species: "Registeel", ability: 'clearbody', moves: ['autotomize']}],
			[{species: "Simisage", ability: 'gluttony', item: 'laggingtail', moves: ['grassknot']}],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, function (bp, attacker, defender, move) {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move autotomize', 'move grassknot');
		assert.strictEqual(basePower, 100);
		battle.makeChoices('move autotomize', 'move grassknot');
		assert.strictEqual(basePower, 20);
	});

	it('should factor into weight before Heavy Metal does', function () {
		battle = common.createBattle([
			[{species: "Lairon", ability: 'heavymetal', moves: ['autotomize']}],
			[{species: "Simisage", ability: 'gluttony', item: 'laggingtail', moves: ['grassknot']}],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, function (bp, attacker, defender, move) {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move autotomize', 'move grassknot');
		assert.strictEqual(basePower, 60);
	});

	it('should reset after a forme change', function () {
		battle = common.createBattle([
			[{species: "Aegislash", ability: 'stancechange', moves: ['autotomize', 'shadowsneak']}],
			[{species: "Simisage", ability: 'gluttony', item: 'laggingtail', moves: ['grassknot']}],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, function (bp, attacker, defender, move) {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move autotomize', 'move grassknot');
		battle.makeChoices('move shadowsneak', 'move grassknot');
		assert.strictEqual(basePower, 80);
	});
});
