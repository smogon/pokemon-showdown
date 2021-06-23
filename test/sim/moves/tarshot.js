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

	it('should make the target weaker to fire', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Coalossal', ability: 'steamengine', moves: ['tarshot', 'flamecharge']}]});
		battle.setPlayer('p2', {team: [{species: 'Snorlax', ability: 'thickfat', item: 'occaberry', moves: ['rest']}]});
		battle.makeChoices('move tarshot', 'move rest');
		battle.makeChoices('move flamecharge', 'move rest');
		assert.equal(battle.p2.active[0].item, '');
	});

	it('should not make the target over 2x weaker to fire', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Coalossal', ability: 'steamengine', item: 'occaberry', moves: ['tarshot', 'flamecharge']}]});
		battle.setPlayer('p2', {team: [{species: 'Ferrothorn', ability: 'ironbarbs', moves: ['rest', 'trick']}]});
		battle.makeChoices('move flamecharge', 'move trick');
		assert.notEqual(battle.p1.active[0].hp, 0);
		// Ferrothorn now has the Occa Berry, cancelling out Tar Shot
		battle.makeChoices('move tarshot', 'move rest');
		battle.makeChoices('move flamecharge', 'move rest');
		assert.notEqual(battle.p1.active[0].hp, 0);
	});
});
