'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Adaptability', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost STAB moves to 2x instead of 1.5x`, () => {
		battle = common.createBattle([[{
			species: 'Porygon-Z', ability: 'adaptability', moves: ['triattack']
		}], [{
			species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk']
		}]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move triattack', 'move sleeptalk');
		const adaptDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		battle.destroy();

		battle = common.createBattle([[
			{species: 'Porygon-Z', ability: 'pressure', moves: ['triattack']},
		], [
			{species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk']},
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move triattack', 'move sleeptalk');
		const normalDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		// 2x / 1.5x ≈ 1.33x more damage
		assert.bounded(adaptDamage / normalDamage, [1.28, 1.38]);
	});

	it(`should not affect non-STAB moves`, () => {
		battle = common.createBattle([[{
			species: 'Porygon-Z', ability: 'adaptability', moves: ['icebeam']
		}], [{
			species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk']
		}]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move icebeam', 'move sleeptalk');
		const adaptDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		battle.destroy();

		battle = common.createBattle([[
			{species: 'Porygon-Z', ability: 'pressure', moves: ['icebeam']},
		], [
			{species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk']},
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move icebeam', 'move sleeptalk');
		const normalDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		assert.equal(adaptDamage, normalDamage);
	});

	it(`should apply to both types of a dual-type Pokemon`, () => {
		battle = common.createBattle([[{
			species: 'Empoleon', ability: 'adaptability', moves: ['surf']
		}], [{
			species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk']
		}]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move surf', 'move sleeptalk');
		const adaptDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		battle.destroy();

		battle = common.createBattle([[
			{species: 'Empoleon', ability: 'pressure', moves: ['surf']},
		], [
			{species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk']},
		]]);
		battle.randomizer = dmg => dmg;
		battle.forceRandomChance = false;
		battle.onEvent('Accuracy', battle.format, () => true);
		battle.makeChoices('move surf', 'move sleeptalk');
		const normalDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		assert.bounded(adaptDamage / normalDamage, [1.28, 1.38]);
	});
});
