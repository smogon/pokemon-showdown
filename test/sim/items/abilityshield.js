'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Ability Shield', function () {
	afterEach(function () {
		battle.destroy();
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9411146
	it(`should bypass Neutralizing Gas`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', item: 'abilityshield', moves: ['splash'], level: 5},
		], [
			{species: 'weezinggalar', ability: 'neutralizinggas', moves: ['shadowball']},
		]]);

		assert(battle.log.some(line => line.includes('Neutralizing Gas')), `Neutralizing Gas should trigger`);
		assert(battle.log.some(line => line.includes('Ability Shield')), `Ability Shield should trigger a block message`);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].hp, 1, `Holder should survive from sturdy`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9412194
	it(`should bypass Mold Breaker`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', item: 'abilityshield', moves: ['splash'], level: 5},
		], [
			{species: 'weezinggalar', ability: 'moldbreaker', moves: ['shadowball']},
		]]);

		// no logs in-game
		assert(battle.log.every(line => !line.includes('Ability Shield')), `Ability Shield should trigger a block message`);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].hp, 1, `Holder should survive from sturdy`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9403448
	it(`should block Gastro Acid`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', item: 'abilityshield', moves: ['splash'], level: 5},
		], [
			{species: 'weezinggalar', ability: 'levitate', moves: ['gastroacid', 'shadowball']},
		]]);

		battle.makeChoices('move splash', 'move gastroacid');

		// TODO does it actually announce in game?
		assert(battle.log.some(line => line.includes('Ability Shield')), `Ability Shield should trigger a block message`);

		battle.makeChoices('move splash', 'move shadowball');

		assert.equal(battle.p1.active[0].hp, 1, `Holder should survive from sturdy`);
	});

	it(`should block ability-changing moves`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'shadowtag', item: 'abilityshield', moves: ['splash'], level: 5},
		], [
			{species: 'weezinggalar', ability: 'levitate', moves: ['worryseed']},
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.includes('Ability Shield')), `Ability Shield should trigger a block message`);
		assert.equal(battle.p1.active[0].ability, 'shadowtag', `Holder should retain ability`);
	});

	it(`should block ability-changing abilities`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'shadowtag', item: 'abilityshield', moves: ['tackle']},
		], [
			{species: 'weezinggalar', ability: 'mummy', moves: ['splash']},
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.includes('Ability Shield')), `Ability Shield should trigger a block message`);
		assert.equal(battle.p1.active[0].ability, 'shadowtag', `Holder should retain ability`);
	});
	
	// TODO skill swap interaction?
});
