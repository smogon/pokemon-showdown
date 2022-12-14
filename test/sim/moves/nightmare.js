'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Nightmare [Gen 2]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not deal damage to the affected if the opponent is KOed', function () {
		battle = common.gen(2).createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Slugma", moves: ['sleeptalk']},
			{species: "Magcargo", moves: ['sleeptalk', 'flamethrower']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Forretress", moves: ['spore', 'nightmare']},
		]});
		battle.makeChoices('switch 2', 'move spore');
		battle.makeChoices('move sleeptalk', 'move nightmare');
		assert(battle.p1.active[0].volatiles['nightmare']);
		assert.fullHP(battle.p1.active[0]);
	});

	it('should continue dealing damage to the affected if it falls asleep while asleep', function () {
		battle = common.gen(2).createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Magcargo", moves: ['sleeptalk', 'rest']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Forretress", moves: ['nightmare', 'pound']},
		]});
		battle.makeChoices('move rest', 'move pound');
		battle.makeChoices('move rest', 'move nightmare');
		battle.makeChoices('move sleeptalk', 'move pound');
		assert(battle.p1.active[0].volatiles['nightmare']);
		assert.false.fullHP(battle.p1.active[0]);
	});
});
