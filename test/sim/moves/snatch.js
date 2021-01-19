'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Snatch', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause the victim of Snatch to change typing with Protean rather than the Snatch user', function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'protean', moves: ['snatch']},
		], [
			{species: 'dratini', ability: 'protean', moves: ['howl']},
		]]);

		const wynaut = battle.p1.active[0];
		const dratini = battle.p2.active[0];
		battle.makeChoices();
		assert.statStage(wynaut, 'atk', 1);
		assert(wynaut.hasType('Dark'));
		assert(dratini.hasType('Normal'));
	});

	it('should not Choice lock the user from the snatched move', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['snatch', 'howl']},
			{species: 'accelgor', item: 'choicescarf', moves: ['trick']},
		], [
			{species: 'dratini', moves: ['howl']},
			{species: 'luvdisc', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move snatch, move trick -1', 'auto');

		// This would fail if Choice locked into Howl
		battle.makeChoices('move snatch, move trick 1', 'auto');
	});

	it('should not be able to steal Rest when the Rest user is at full HP', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['snatch']},
			{species: 'accelgor', moves: ['rest']},
		], [
			{species: 'dratini', moves: ['howl']},
			{species: 'luvdisc', moves: ['quickattack']},
		]]);

		const wynaut = battle.p1.active[0];
		battle.makeChoices('auto', 'move howl, move quickattack 1');
		assert.equal(wynaut.status, '');
		assert.statStage(wynaut, 'atk', 1);
	});

	it('should Snatch moves and run Throat Chop and Heal Block checks', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'porygon2', moves: ['sleeptalk', 'howl']},
			{species: 'weavile', moves: ['toxicthread', 'sleeptalk', 'snatch']},
		], [
			{species: 'mew', item: 'powerherb', moves: ['throatchop', 'toxicthread', 'sleeptalk', 'healblock']},
			{species: 'skitty', ability: 'intrepidsword', moves: ['throatchop', 'healbell', 'recover']},
		]]);

		battle.makeChoices('move sleeptalk, move toxicthread 2', 'move throatchop 1, move throatchop 2');
		battle.makeChoices('move sleeptalk, move snatch', 'move toxicthread 1, move healbell');
		assert.equal(battle.p1.active[0].status, 'psn', 'should not allow Heal Bell called from Snatch');
		assert.equal(battle.p2.active[1].status, 'psn', 'should not allow the Snatchee to move');
		assert.match(battle.log[battle.lastMoveLine + 2], /^\|cant.*move: Throat Chop$/, 'should log that Heal Bell failed');

		battle.makeChoices('move sleeptalk, move sleeptalk', 'move healblock, move throatchop 2');
		const weavileHp = battle.p1.active[1].hp;
		battle.makeChoices('move sleeptalk, move snatch', 'move sleeptalk, move recover');
		assert.atMost(battle.p1.active[1].hp, weavileHp, 'should not allow Snatch to bypass Heal Block');
		assert.match(battle.log[battle.lastMoveLine + 2], /^\|cant.*move: Heal Block\|Recover$/, 'should log that Recover failed');
	});
});
