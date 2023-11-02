'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Ability Shield', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should protect the holder's ability against ability-changing moves`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'shadowtag', item: 'abilityshield', moves: ['splash']},
		], [
			{species: 'weezinggalar', ability: 'levitate', moves: ['worryseed']},
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.includes('Ability Shield')), `Ability Shield should trigger a block message`);
		assert.equal(battle.p1.active[0].ability, 'shadowtag', `Holder should retain ability`);
	});

	it(`should protect the holder's ability against ability-changing abilities`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'shadowtag', item: 'abilityshield', moves: ['tackle']},
		], [
			{species: 'weezinggalar', ability: 'mummy', moves: ['splash']},
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.includes('Ability Shield')), `Ability Shield should trigger a block message`);
		assert.equal(battle.p1.active[0].ability, 'shadowtag', `Holder should retain ability`);
	});

	it(`should only protect the holder`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'mummy', item: 'abilityshield', moves: ['splash']},
		], [
			{species: 'weezinggalar', ability: 'levitate', moves: ['tackle']},
		]]);

		battle.makeChoices();
		assert(battle.log.every(line => !line.includes('Ability Shield')), `Ability Shield should not trigger a block message`);
		assert.equal(battle.p2.active[0].ability, 'mummy', `Attacker should lose its ability`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9411146
	it(`should protect the holder's ability against Neutralizing Gas`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', item: 'abilityshield', moves: ['splash'], level: 5},
		], [
			{species: 'weezinggalar', ability: 'neutralizinggas', moves: ['shadowball']},
		]]);

		assert(battle.log.some(line => line.includes('Neutralizing Gas')), `Neutralizing Gas should trigger`);
		assert(battle.log.some(line => line.includes('Ability Shield')), `Ability Shield should trigger a block message`);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].hp, 1, `Holder should survive due to Sturdy`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9412194
	it(`should protect the holder's ability against Mold Breaker`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', item: 'abilityshield', moves: ['splash'], level: 5},
			{species: 'gastly', ability: 'levitate', item: 'abilityshield', moves: ['sleeptalk']},
		], [
			{species: 'weezinggalar', ability: 'moldbreaker', moves: ['shadowball', 'earthpower']},
		]]);

		assert(battle.log.every(line => !line.includes('Ability Shield')), `Ability Shield should not trigger a block message`);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].hp, 1, `Holder should survive from sturdy`);
		battle.makeChoices('switch gastly', 'move earthpower');
		assert.fullHP(battle.p1.active[0], `Holder should be ungrounded through levitate`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9403448
	it(`should protect the holder's ability against Gastro Acid`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', item: 'abilityshield', moves: ['splash'], level: 5},
		], [
			{species: 'weezinggalar', ability: 'levitate', moves: ['gastroacid', 'shadowball']},
		]]);

		battle.makeChoices('move splash', 'move gastroacid');
		assert(battle.log.some(line => line.includes('Ability Shield')), `Ability Shield should trigger a block message`);

		battle.makeChoices('move splash', 'move shadowball');
		assert.equal(battle.p1.active[0].hp, 1, `Holder should survive due to Sturdy`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9412999
	it(`should not unsuppress the holder's ability if Ability Shield is acquired after Gastro Acid has been used`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', moves: ['splash'], level: 5},
		], [
			{species: 'weezinggalar', ability: 'levitate', item: 'abilityshield', moves: ['gastroacid', 'trick', 'shadowball']},
		]]);

		battle.makeChoices('move splash', 'move gastroacid');
		battle.makeChoices('move splash', 'move trick');
		battle.makeChoices('move splash', 'move shadowball');
		assert(battle.p1.active[0].fainted, `Holder should not survive attack`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9412999
	it(`should unsuppress the holder's ability if Ability Shield is acquired after Neutralizing Gas has come into effect`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', moves: ['splash'], level: 5},
		], [
			{species: 'weezinggalar', ability: 'neutralizinggas', item: 'abilityshield', moves: ['trick', 'shadowball']},
		]]);

		battle.makeChoices('move splash', 'move trick');
		battle.makeChoices('move splash', 'move shadowball');

		assert.equal(battle.p1.active[0].hp, 1, `Holder should survive due to Sturdy`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9412999
	it(`should not be suppressed by Klutz`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'klutz', item: 'abilityshield', moves: ['tackle']},
		], [
			{species: 'weezinggalar', ability: 'mummy', moves: ['splash']},
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.includes('Ability Shield')), `Ability Shield should trigger a block message`);
		assert.equal(battle.p1.active[0].ability, 'klutz', `Holder should retain ability`);
	});

	it(`should protect the holder's ability against Skill Swap`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'shadowtag', item: 'abilityshield', moves: ['splash']},
		], [
			{species: 'weezinggalar', ability: 'levitate', moves: ['skillswap']},
		]]);

		battle.makeChoices();

		// assert logs?

		assert.equal(battle.p1.active[0].ability, 'shadowtag', `Holder should retain ability`);
		assert.equal(battle.p2.active[0].ability, 'levitate', `Opponent should retain ability`);
	});

	it(`should protect the holder's ability against Skill Swap, even if used by the holder`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'shadowtag', item: 'abilityshield', moves: ['skillswap']},
		], [
			{species: 'weezinggalar', ability: 'levitate', moves: ['splash']},
		]]);

		battle.makeChoices();

		// assert logs?

		assert.equal(battle.p1.active[0].ability, 'shadowtag', `Holder should retain ability`);
		assert.equal(battle.p2.active[0].ability, 'levitate', `Opponent should retain ability`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9413916
	it(`should not trigger holder's Intimidate if Ability Shield is acquired after entrance, while Neutralizing Gas is in effect`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'intimidate', moves: ['splash']},
		], [
			{species: 'weezinggalar', ability: 'neutralizinggas', item: 'abilityshield', moves: ['trick']},
		]]);

		battle.makeChoices();
		assert.statStage(battle.p2.active[0], 'atk', 0);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9414273
	it(`should not trigger holder's Trace`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'trace', item: 'abilityshield', moves: ['splash']},
		], [
			{species: 'weezinggalar', ability: 'levitate', moves: ['splash']},
		]]);

		assert.notEqual(battle.p1.active[0].ability, 'levitate', `Holder should not trace ability`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9414273
	it(`should not trigger holder's Trace even after losing the item`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'trace', item: 'abilityshield', moves: ['splash']},
		], [
			{species: 'weezinggalar', ability: 'levitate', moves: ['trick']},
		]]);

		battle.makeChoices();
		assert.notEqual(battle.p1.active[0].ability, 'levitate', `Holder should not trace ability`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9635572
	it(`should not prevent Imposter from changing the holder's ability`, function () {
		battle = common.createBattle([[
			{species: 'ditto', ability: 'imposter', item: 'abilityshield', moves: ['transform']},
		], [
			{species: 'scorbunny', ability: 'libero', moves: ['agility']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].ability, 'libero', `Ditto should copy Libero`);
	});

	// TODO Add future tests for losing Ability Shield vs Neutralizing Gas/Mold Breaker/Gastro Acid?
	//
	//      No confirmed research yet for these, but presumably Neutralizing Gas & Mold
	//      Breaker would start to apply again, whereas Gastro Acid or other "triggered-once"
	//      moves/abilities triggered before the loss would not automatically trigger unless
	//      used again.
});
