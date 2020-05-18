'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Tar Shot', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause subsequent Fire-type attacks to deal 2x damage as a type chart multiplier', function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['tarshot', 'fusionflare']},
		], [
			{species: 'cleffa', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move fusionflare', 'auto');
		const cleffa = battle.p2.active[0];
		const damage = cleffa.maxhp - cleffa.hp;
		assert.bounded(damage, [82, 98]);
	});

	it('should cause Fire-type attacks to trigger Weakness Policy', function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['tarshot', 'fusionflare']},
		], [
			{species: 'cleffa', item: 'weaknesspolicy', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move fusionflare', 'auto');
		assert.equal(battle.p2.active[0].item, '');
		assert.statStage(battle.p2.active[0], 'atk', 2);
		assert.statStage(battle.p2.active[0], 'spa', 2);
	});

	it.skip('should not interact with Delta Stream', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wobbuffet', moves: ['tarshot']},
			{species: 'wynaut', moves: ['fusionflare']},
		], [
			{species: 'tornadus', moves: ['sleeptalk']},
			{species: 'thundurus', ability: 'deltastream', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move tarshot 1, move fusionflare 1', 'auto');
		const torn = battle.p2.active[0];
		const damage = torn.maxhp - torn.hp;
		assert.bounded(damage, [62, 74]);
	});
});
