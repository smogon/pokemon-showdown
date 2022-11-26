'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Ability Shield', function () {
	afterEach(function () {
		battle.destroy();
	});

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

	it(`should bypass Mold Breaker`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'sturdy', item: 'abilityshield', moves: ['splash'], level: 5},
		], [
			{species: 'weezinggalar', ability: 'moldbreaker', moves: ['shadowball']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p1.active[0].hp, 1, `Holder should survive from sturdy`);
	});

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

	// it(`should not activate on the opponent's moves`, function () {
	// 	battle = common.createBattle([[
	// 		{species: 'wynaut', item: 'punchingglove', moves: ['sleeptalk']},
	// 	], [
	// 		{species: 'happiny', moves: ['lunge']},
	// 	]]);
	// 	battle.makeChoices();
	// 	assert.statStage(battle.p1.active[0], 'atk', -1, `Attack should be lowered`);
	// });

	// // https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9406865
	// it(`should stop Pickpocket`, function () {
	// 	battle = common.createBattle([[
	// 		{species: 'wynaut', item: 'punchingglove', moves: ['bulletpunch']},
	// 	], [
	// 		{species: 'weavile', ability: 'pickpocket', moves: ['sleeptalk']},
	// 	]]);
	// 	battle.makeChoices();
	// 	assert.equal(battle.p1.active[0].item, 'punchingglove', `Attacker should not lose their item`);
	// 	assert.false.holdsItem(battle.p2.active[0], `Target should not steal Punching Glove`);
	// });

	// // https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9406865
	// it(`should block against Protecting effects with a contact side effect`, function () {
	// 	battle = common.createBattle([[
	// 		{species: 'wynaut', item: 'punchingglove', moves: ['sleeptalk', 'bulletpunch']},
	// 	], [
	// 		{species: 'aggron', moves: ['sleeptalk', 'banefulbunker', 'obstruct', 'spikyshield']},
	// 	]]);
	// 	battle.makeChoices('move bulletpunch', 'move banefulbunker');
	// 	battle.makeChoices();
	// 	battle.makeChoices('move bulletpunch', 'move obstruct');
	// 	battle.makeChoices();
	// 	battle.makeChoices('move bulletpunch', 'move spikyshield');
	// 	battle.makeChoices();
	// 	const wynaut = battle.p1.active[0];
	// 	assert.equal(wynaut.status, '', `Wynaut should not have been poisoned by Baneful Bunker`);
	// 	assert.statStage(wynaut, 'def', 0, `Wynaut's Defense should not have been lowered by Obstruct`);
	// 	assert.fullHP(wynaut, `Wynaut should not have lost HP from Spiky Shield`);
	// });
});
