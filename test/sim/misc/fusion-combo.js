'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Fusion Bolt + Fusion Flare', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should boost the second move if the first was used immediately before it`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Wynaut', moves: ['fusionbolt']},
			{species: 'Wobbuffet', moves: ['fusionflare']},
		], [
			{species: 'Dragonite', item: 'laggingtail', moves: ['roost']},
			{species: 'Lugia', moves: ['fusionbolt']},
		]]);

		const bpModifiers = new Map();
		battle.onEvent('BasePower', battle.format, -100, function (bp, attacker, defender, move) {
			bpModifiers.set(move.id, this.event.modifier);
		});
		battle.makeChoices('move fusionbolt 1, move fusionflare 1', 'auto');
		assert.equal(bpModifiers.get('fusionbolt'), 2);
		assert.equal(bpModifiers.get('fusionflare'), 2);
	});

	it(`should boost the second move if the first was used by the same Pokemon`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Magikarp', item: 'laggingtail', moves: ['fusionbolt', 'fusionflare']},
			{species: 'Oranguru', moves: ['sleeptalk', 'instruct']},
		], [
			{species: 'Dragonite', moves: ['roost']},
			{species: 'Lugia', moves: ['roost']},
		]]);

		battle.makeChoices();

		const bpModifiers = new Map();
		battle.onEvent('BasePower', battle.format, -100, function (bp, attacker, defender, move) {
			bpModifiers.set(move.id, this.event.modifier);
		});
		battle.makeChoices('move fusionflare 2, move instruct -1', 'default');

		assert.equal(bpModifiers.get('fusionbolt'), 1);
		assert.equal(bpModifiers.get('fusionflare'), 2);
	});

	it(`should not boost the second move if another move was used between them`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Zekrom', moves: ['fusionbolt']},
			{species: 'Reshiram', item: 'laggingtail', moves: ['fusionflare']},
		], [
			{species: 'Dragonite', ability: 'shellarmor', moves: ['roost']},
			{species: 'Lugia', moves: ['roost']},
		]]);

		battle.makeChoices();

		const bpModifiers = new Map();
		battle.onEvent('BasePower', battle.format, -100, function (bp, attacker, defender, move) {
			bpModifiers.set(move.id, this.event.modifier);
		});
		battle.makeChoices('move fusionbolt 1, move fusionflare 1', 'auto');

		assert.equal(bpModifiers.get('fusionflare'), 1);
	});

	it(`should not boost the second move if the first move failed`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Regieleki', moves: ['fusionbolt']},
			{species: 'Reshiram', moves: ['fusionflare']},
		], [
			{species: 'Stunfisk', moves: ['roost']},
			{species: 'Stunfisk', moves: ['roost']},
		]]);

		const bpModifiers = new Map();
		battle.onEvent('BasePower', battle.format, -100, function (bp, attacker, defender, move) {
			bpModifiers.set(move.id, this.event.modifier);
		});
		battle.makeChoices('move fusionbolt 1, move fusionflare 1', 'default');

		assert.equal(bpModifiers.get('fusionflare'), 1);
	});
});
