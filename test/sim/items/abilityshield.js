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
	it.skip(`should protect the holder's ability against Neutralizing Gas`, function () {
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
	it.skip(`should protect the holder's ability against Mold Breaker`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', item: 'abilityshield', moves: ['splash'], level: 5},
		], [
			{species: 'weezinggalar', ability: 'moldbreaker', moves: ['shadowball']},
		]]);

		assert(battle.log.every(line => !line.includes('Ability Shield')), `Ability Shield should not trigger a block message`);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].hp, 1, `Holder should survive from sturdy`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9403448
	it.skip(`should protect the holder's ability against Gastro Acid`, function () {
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
	it.skip(`should unsuppress the holder's ability if Ability Shield is acquired after Neutralizing Gas has come into effect`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', moves: ['splash'], level: 5},
		], [
			{species: 'weezinggalar', ability: 'neutralizinggas', item: 'abilityshield', moves: ['trick', 'shadowball']},
		]]);

		battle.makeChoices('move splash', 'move trick');
		battle.makeChoices('move splash', 'move shadowball');

		// TODO assert some sort of block message as well? I don't *think* there should be a message but not confirmed

		assert.equal(battle.p1.active[0].hp, 1, `Holder should survive due to Sturdy`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9412999
	it.skip(`should not be suppressed by Klutz`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'klutz', item: 'abilityshield', moves: ['tackle']},
		], [
			{species: 'weezinggalar', ability: 'mummy', moves: ['splash']},
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.includes('Ability Shield')), `Ability Shield should trigger a block message`);
		assert.equal(battle.p1.active[0].ability, 'klutz', `Holder should retain ability`);
	});

	// TODO Tests for unsuppressing abilities like Intimidate (should they re-trigger)? Or perhaps already covered by current Neutralizing Gas tests?

	// TODO Tests for losing Ability Shield vs Neutralizing Gas/Mold Breaker/Gastro Acid?
	//      No confirmed research yet for these, but presumably Neutralizing Gas & Mold
	//      Breaker would start to apply again, whereas Gastro Acid or other "triggered-once"
	//      moves/abilities triggered before the loss would not automatically trigger unless
	//      used again.

	it.skip(`should protect the holder's ability against Skill Swap, even if used by the holder`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'shadowtag', item: 'abilityshield', moves: ['skillswap']},
		], [
			{species: 'weezinggalar', ability: 'levitate', moves: ['splash']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].ability, 'shadowtag', `Holder should retain ability`);
		assert.equal(battle.p2.active[0].ability, 'levitate', `Opponent should retain ability`);
	});
});
