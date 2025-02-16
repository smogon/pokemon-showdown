'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

/**
 * Test setup:
 * - Let the Dragon Cheer receiver be the slowest Pokemon on the field.
 * - Inspect the critical hit ratio added. Ratio will be 1 + bonusCritRatio.
 *
 * All tests based on confirmations given here: https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9894139
 */
describe('Dragon Cheer', function () {
	afterEach(() => battle.destroy());

	it('should raise critical hit ratio by 2 stages for dragon types', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'dragapult', moves: ['dragoncheer']},
			{species: 'kingdra', moves: ['bubble']},
		], [
			{species: 'dragapult', moves: ['splash']},
			{species: 'dragapult', moves: ['splash']},
		]]);

		battle.onEvent(
			'ModifyCritRatio', battle.format, -99,
			(critRatio) => assert.equal(critRatio, 3)
		);

		battle.makeChoices('auto', 'auto');
		assert(battle.log.some(line => line.startsWith('|-start')));
	});

	it('should raise critical hit ratio by 1 stage for non-dragon types', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'dragapult', moves: ['dragoncheer']},
			{species: 'horsea', moves: ['bubble']},
		], [
			{species: 'dragapult', moves: ['splash']},
			{species: 'dragapult', moves: ['splash']},
		]]);

		battle.onEvent(
			'ModifyCritRatio', battle.format, -99,
			(critRatio) => assert.equal(critRatio, 2)
		);

		battle.makeChoices('auto', 'auto');
		assert(battle.log.some(line => line.startsWith('|-start')));
	});

	it('should fail if used twice on the same ally', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'dragapult', moves: ['dragoncheer']},
			{species: 'kingdra', moves: ['bubble']},
		], [
			{species: 'dragapult', moves: ['splash']},
			{species: 'dragapult', moves: ['splash']},
		]]);

		battle.makeChoices('auto', 'auto');
		battle.makeChoices('auto', 'auto');
		assert(battle.log.some(line => line.startsWith('|-start'))); // first trigger
		assert(battle.log.some(line => line.startsWith('|-fail'))); // second trigger
	});

	it('should not increase ratio if affected Pokemon turns into a Dragon Type after Dragon Cheer', function () {
		battle = common.gen(9).createBattle({gameType: 'doubles'}, [[
			{species: 'dragapult', moves: ['dragoncheer', 'splash']},
			{species: 'horsea', moves: ['bubble'], teraType: 'Dragon'},
		], [
			{species: 'dragapult', moves: ['splash']},
			{species: 'dragapult', moves: ['splash']},
		]]);

		battle.onEvent(
			'ModifyCritRatio', battle.format, -99,
			(critRatio) => assert.equal(critRatio, 2)
		);

		battle.makeChoices('move dragoncheer -2, move bubble', 'auto');
		battle.makeChoices('move splash, move bubble terastallize', 'auto');
	});

	it('should fail in singles or if no ally exists', function () {
		battle = common.createBattle([
			[{species: 'gyarados', moves: ['dragoncheer']}],
			[{species: 'dragapult', moves: ['splash']}],
		]);

		battle.makeChoices();
		assert(battle.log.some(line => !line.startsWith('|-fail')));
	});

	it(`should be copied by Psych Up, using the target's Dragon Cheer level`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'milotic', moves: ['dragoncheer', 'psychup', 'bubble']},
			{species: 'kingdra', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'wobbuffet', moves: ['sleeptalk']},
		]]);

		battle.onEvent(
			'ModifyCritRatio', battle.format, -99,
			(critRatio) => assert.equal(critRatio, 3)
		);

		battle.makeChoices('move dragoncheer -2, move sleeptalk', 'auto');
		battle.makeChoices('move psychup -2, move sleeptalk', 'auto');
		battle.makeChoices('move bubble, move sleeptalk', 'auto');
	});

	it(`should be copied by Psych Up, using the target's Dragon Cheer level and replacing the user's current critical hit stage`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'milotic', moves: ['dragoncheer', 'psychup', 'bubble', 'focusenergy']},
			{species: 'comfey', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'wobbuffet', moves: ['sleeptalk']},
		]]);

		battle.onEvent(
			'ModifyCritRatio', battle.format, -99,
			(critRatio) => assert.equal(critRatio, 2)
		);

		battle.makeChoices('move focusenergy, move sleeptalk', 'auto');
		battle.makeChoices('move dragoncheer -2, move sleeptalk', 'auto');
		battle.makeChoices('move psychup -2, move sleeptalk', 'auto');
		battle.makeChoices('move bubble, move sleeptalk', 'auto');
	});

	it(`should be copied by Transform, using the target's Dragon Cheer level`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'milotic', moves: ['dragoncheer', 'transform']},
			{species: 'kingdra', moves: ['sleeptalk', 'bubble']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'wobbuffet', moves: ['sleeptalk']},
		]]);

		battle.onEvent(
			'ModifyCritRatio', battle.format, -99,
			(critRatio) => assert.equal(critRatio, 3)
		);

		battle.makeChoices('move dragoncheer -2, move sleeptalk', 'auto');
		battle.makeChoices('move transform -2, move sleeptalk', 'auto');
		battle.makeChoices('move bubble, move sleeptalk', 'auto');
	});
});
