'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Heavy Metal', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should double the weight of a Pokemon', () => {
		battle = common.createBattle([
			[{ species: "Simisear", ability: 'heavymetal', moves: ['nastyplot'] }],
			[{ species: "Simisage", ability: 'gluttony', moves: ['grassknot'] }],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, (bp, attacker, defender, move) => {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move nastyplot', 'move grassknot');
		assert.equal(basePower, 80);
	});

	it('should be negated by Mold Breaker', () => {
		battle = common.createBattle([
			[{ species: "Simisear", ability: 'heavymetal', moves: ['nastyplot'] }],
			[{ species: "Simisage", ability: 'moldbreaker', moves: ['grassknot'] }],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, (bp, attacker, defender, move) => {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move nastyplot', 'move grassknot');
		assert.equal(basePower, 60);
	});
});

describe('Light Metal', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should halve the weight of a Pokemon', () => {
		battle = common.createBattle([
			[{ species: "Registeel", ability: 'lightmetal', moves: ['curse'] }],
			[{ species: "Simisage", ability: 'gluttony', moves: ['grassknot'] }],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, (bp, attacker, defender, move) => {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move curse', 'move grassknot');
		assert.equal(basePower, 100);
	});

	it('should be negated by Mold Breaker', () => {
		battle = common.createBattle([
			[{ species: "Registeel", ability: 'lightmetal', moves: ['splash'] }],
			[{ species: "Simisage", ability: 'moldbreaker', moves: ['grassknot'] }],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, (bp, attacker, defender, move) => {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move splash', 'move grassknot');
		assert.equal(basePower, 120);
	});
});

describe('Float Stone', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should halve the weight of a Pokemon', () => {
		battle = common.createBattle([
			[{ species: "Registeel", ability: 'clearbody', item: 'floatstone', moves: ['curse'] }],
			[{ species: "Simisage", ability: 'gluttony', moves: ['grassknot'] }],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, (bp, attacker, defender, move) => {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move curse', 'move grassknot');
		assert.equal(basePower, 100);
	});
});

describe('Autotomize', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should reduce the weight of a Pokemon by 100 kg with each use', () => {
		battle = common.createBattle([
			[{ species: "Registeel", ability: 'clearbody', moves: ['autotomize'] }],
			[{ species: "Simisage", ability: 'gluttony', item: 'laggingtail', moves: ['grassknot'] }],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, (bp, attacker, defender, move) => {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move autotomize', 'move grassknot');
		assert.equal(basePower, 100);
		battle.makeChoices('move autotomize', 'move grassknot');
		assert.equal(basePower, 20);
	});

	it('should factor into weight before Heavy Metal does', () => {
		battle = common.createBattle([
			[{ species: "Lairon", ability: 'heavymetal', moves: ['autotomize'] }],
			[{ species: "Simisage", ability: 'gluttony', item: 'laggingtail', moves: ['grassknot'] }],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, (bp, attacker, defender, move) => {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move autotomize', 'move grassknot');
		assert.equal(basePower, 60);
	});

	it('should reset after a forme change', () => {
		battle = common.createBattle([
			[{ species: "Aegislash", ability: 'stancechange', moves: ['autotomize', 'shadowsneak'] }],
			[{ species: "Simisage", ability: 'gluttony', item: 'laggingtail', moves: ['grassknot'] }],
		]);
		let basePower = 0;
		battle.onEvent('BasePower', battle.format, (bp, attacker, defender, move) => {
			if (move.id === 'grassknot') {
				basePower = bp;
			}
		});
		battle.makeChoices('move autotomize', 'move grassknot');
		battle.makeChoices('move shadowsneak', 'move grassknot');
		assert.equal(basePower, 80);
	});
});
