'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Punching Glove', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should prevent item effects triggered by contact from acting`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'punchingglove', moves: ['bulletpunch']},
		], [
			{species: 'miltank', item: 'rockyhelmet', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0], `Attacker should not be hurt`);
	});

	it(`should not prevent item effects triggered by contact from acting if using non-punching contact move`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'punchingglove', moves: ['tackle']},
		], [
			{species: 'miltank', item: 'rockyhelmet', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p1.active[0], `Attacker should be hurt`);
	});

	it(`should not activate on the opponent's moves`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'punchingglove', moves: ['sleeptalk']},
		], [
			{species: 'happiny', moves: ['lunge']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'atk', -1, `Attack should be lowered`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9406865
	it(`should stop Pickpocket`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'punchingglove', moves: ['bulletpunch']},
		], [
			{species: 'weavile', ability: 'pickpocket', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].item, 'punchingglove', `Attacker should not lose their item`);
		assert.false.holdsItem(battle.p2.active[0], `Target should not steal Punching Glove`);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9406865
	it(`should block against Protecting effects with a contact side effect`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'punchingglove', moves: ['sleeptalk', 'bulletpunch']},
		], [
			{species: 'aggron', moves: ['sleeptalk', 'banefulbunker', 'obstruct', 'spikyshield']},
		]]);
		battle.makeChoices('move bulletpunch', 'move banefulbunker');
		battle.makeChoices();
		battle.makeChoices('move bulletpunch', 'move obstruct');
		battle.makeChoices();
		battle.makeChoices('move bulletpunch', 'move spikyshield');
		battle.makeChoices();
		const wynaut = battle.p1.active[0];
		assert.equal(wynaut.status, '', `Wynaut should not have been poisoned by Baneful Bunker`);
		assert.statStage(wynaut, 'def', 0, `Wynaut's Defense should not have been lowered by Obstruct`);
		assert.fullHP(wynaut, `Wynaut should not have lost HP from Spiky Shield`);
	});
});
