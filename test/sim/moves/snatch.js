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
		assert(battle.log[battle.lastMoveLine + 2].startsWith('|cant'), 'should log that Heal Bell failed');

		battle.makeChoices('move sleeptalk, move sleeptalk', 'move healblock, move throatchop 2');
		const weavileHp = battle.p1.active[1].hp;
		battle.makeChoices('move sleeptalk, move snatch', 'move sleeptalk, move recover');
		assert.atMost(battle.p1.active[1].hp, weavileHp, 'should not allow Snatch to bypass Heal Block');
		assert(battle.log[battle.lastMoveLine + 2].startsWith('|cant'), 'should log that Recover failed');
	});

	it('should not snatch Swallow if the Swallow user has no Stockpiles', () => {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'mandibuzz', moves: ['snatch']},
			{species: 'accelgor', moves: ['swallow']},
		], [
			{species: 'surskit', moves: ['quickattack']},
			{species: 'wingull', moves: ['quickattack']},
		]]);

		battle.makeChoices('auto', 'move quickattack 1, move quickattack 2');
		for (const line of battle.log) {
			assert(!line.includes('-activate'), `Snatch should not have activated, but found -activate message ${line}`);
		}
	});

	it('Snatched Swallow should heal the snatcher by 25% if the snatcher has no Stockpiles', () => {
		battle = common.createBattle([[
			{species: 'clefable', moves: ['sleeptalk', 'bellydrum', 'snatch']},
		], [
			{species: 'dewgong', moves: ['stockpile', 'swallow']},
		]]);
		battle.makeChoices('move bellydrum', 'auto');
		battle.makeChoices();
		battle.makeChoices();
		const targetHP = battle.modify(battle.p1.active[0].maxhp, 0.25);
		assert.hurtsBy(battle.p1.active[0], -targetHP, () => battle.makeChoices('move snatch', 'move swallow'));
	});
});

describe('Snatch [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should Snatch moves that were called by another user of Snatch', function () {
		battle = common.gen(4).createBattle({gameType: 'doubles'}, [[
			{species: 'weavile', moves: ['snatch']},
			{species: 'wynaut', moves: ['howl']},
		], [
			{species: 'alakazam', moves: ['snatch']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.statStage(battle.p2.active[0], 'atk', 1);
	});

	it.skip(`should only deduct additional PP from Snatch if the Snatch was successful`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'Palkia', ability: 'pressure', moves: ['watergun', 'calmmind']},
		], [
			{species: 'Dialga', moves: ['snatch']},
		]]);
		battle.makeChoices();
		const move = battle.p2.active[0].getMoveData(Dex.moves.get('snatch'));
		assert.equal(move.pp, move.maxpp - 1, `Snatch should only lose 1 PP because it was not successful.`);

		battle.makeChoices('move calmmind', 'move snatch');
		assert.equal(move.pp, move.maxpp - 3, `Snatch should be at 13 PP after losing 1 PP earlier and 2 PP this turn`);
	});
});
