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

	it('should not interact with Delta Stream', function () {
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

	it(`should add a Fire-type weakness, not make the target 2x weaker to Fire`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['tarshot', 'flamecharge']},
		], [
			{species: 'ferrothorn', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move tarshot', 'auto');
		battle.makeChoices('move flamecharge', 'auto');
		const ferro = battle.p2.active[0];
		const damage = ferro.maxhp - ferro.hp;
		assert.bounded(damage, [88, 104]);
	});

	it(`should not remove the Tar Shot status when a Pokemon Terastallizes`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['tarshot', 'flamecharge']},
		], [
			{species: 'snorlax', item: 'weaknesspolicy', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move tarshot', 'auto');
		battle.makeChoices('move flamecharge', 'move sleeptalk terastallize');
		const lax = battle.p2.active[0];
		assert.statStage(lax, 'atk', 2, `Weakness Policy should have activated`);
	});

	it(`should prevent a Terastallized Pokemon from being afflicted with the Tar Shot status`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['tarshot', 'flamecharge']},
		], [
			{species: 'snorlax', item: 'weaknesspolicy', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move tarshot', 'move sleeptalk terastallize');
		battle.makeChoices('move flamecharge', 'auto');
		const lax = battle.p2.active[0];
		assert.statStage(lax, 'atk', 0, `Weakness Policy should not have activated`);
		assert.statStage(lax, 'spe', -1, `Snorlax's Speed should have been lowered`);
	});
});
