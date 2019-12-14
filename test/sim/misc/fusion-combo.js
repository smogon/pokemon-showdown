'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Fusion Bolt + Fusion Flare', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should boost the second move if the first was used immediately before it', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Zekrom', ability: 'teravolt', moves: ['fusionbolt']},
			{species: 'Reshiram', ability: 'teravolt', moves: ['fusionflare'], evs: {spe: 4}},
		], [
			{species: 'Dragonite', ability: 'Multiscale', moves: ['roost']},
			{species: 'Lugia', ability: 'Multiscale', moves: ['fusionbolt']},
		]]);

		battle.makeChoices();

		let bpModifiers = new Map();
		battle.onEvent('BasePower', battle.format, -100, function (bp, attacker, defender, move) {
			bpModifiers.set(move.id, this.event.modifier);
		});
		battle.makeChoices('move fusionbolt 1, move fusionflare 1', 'default');

		assert.strictEqual(bpModifiers.get('fusionbolt'), 2);
		assert.strictEqual(bpModifiers.get('fusionflare'), 2);
	});

	it('should boost the second move if the first was used by the same pokemon', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: 'Victini', item: 'laggingtail', ability: 'victorystar', moves: ['fusionbolt', 'fusionflare']}, {species: 'Oranguru', ability: 'telepathy', moves: ['calmmind', 'instruct']}],
			[{species: 'Dragonite', ability: 'Multiscale', moves: ['roost']}, {species: 'Lugia', ability: 'Multiscale', moves: ['roost']}],
		]);

		battle.makeChoices();

		let bpModifiers = new Map();
		battle.onEvent('BasePower', battle.format, -100, function (bp, attacker, defender, move) {
			bpModifiers.set(move.id, this.event.modifier);
		});
		battle.makeChoices('move fusionflare 2, move instruct -1', 'default');

		assert.strictEqual(bpModifiers.get('fusionbolt'), 1);
		assert.strictEqual(bpModifiers.get('fusionflare'), 2);
	});

	it('should not boost the second move if another move was used between them', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: 'Zekrom', ability: 'teravolt', moves: ['fusionbolt']}, {species: 'Reshiram', item: 'laggingtail', ability: 'teravolt', moves: ['fusionflare']}],
			[{species: 'Dragonite', ability: 'Multiscale', moves: ['roost']}, {species: 'Lugia', ability: 'Multiscale', moves: ['roost']}],
		]);

		battle.makeChoices();

		let bpModifiers = new Map();
		battle.onEvent('BasePower', battle.format, -100, function (bp, attacker, defender, move) {
			bpModifiers.set(move.id, this.event.modifier);
		});
		battle.makeChoices('move fusionbolt 1, move fusionflare 1', 'default');

		assert.strictEqual(bpModifiers.get('fusionflare'), 1);
	});
});
