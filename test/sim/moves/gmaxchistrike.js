'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('G-Max Chi Strike', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should boost the user and its ally\'s critical hit rate by 1 stage', function () {
		// hardcoded RNG seed that doesn't roll a crit at +2 crit rate
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4]}, [[
			{species: 'Machamp', moves: ['sleeptalk', 'rocksmash'], gigantamax: true},
			{species: 'Wynaut', ability: "Super Luck", item: "Scope Lens", moves: ['tackle']},
		], [
			{species: 'Wynaut', ability: "Shell Armor", moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);

		// Boosts Wynaut to +3, so this crit is now guaranteed
		battle.makeChoices('move rocksmash 1 dynamax, move tackle 2', 'auto');
		assert(battle.log.some(line => line.startsWith('|-crit')));
	});

	it('should provide a crit boost independent of Focus Energy', function () {
		// hardcoded RNG seed that doesn't roll a crit at +2 crit rate
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4]}, [[
			{species: 'Machamp', moves: ['sleeptalk', 'rocksmash'], gigantamax: true},
			{species: 'Wynaut', moves: ['focusenergy', 'tackle']},
		], [
			{species: 'Wynaut', ability: "Shell Armor", moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices('move rocksmash 1 dynamax, move tackle 2', 'auto');

		// This should be a guaranteed crit at +3
		assert(battle.log.some(line => line.startsWith('|-crit')));
	});

	it('should be copied by Psych Up', function () {
		// hardcoded RNG seed ensures Magikarp will not crit at +0
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4]}, [[
			{species: 'Machamp', moves: ['rocksmash', 'sleeptalk'], gigantamax: true},
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Magikarp', moves: ['psychup', 'tackle']},
		], [
			{species: 'Wynaut', ability: "Shell Armor", moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move rocksmash 1 dynamax, move sleeptalk', 'auto');
		battle.makeChoices('move rocksmash 1, move sleeptalk', 'auto');
		battle.makeChoices('move rocksmash 1, move sleeptalk', 'auto');
		battle.makeChoices('move sleeptalk, switch 3', 'auto');
		battle.makeChoices('move sleeptalk, move psychup -1', 'auto');
		battle.makeChoices('move sleeptalk, move tackle 2', 'auto');

		// Magikarp is +3 after Psych Up, so this crit is now guaranteed
		assert(battle.log.some(line => line.startsWith('|-crit')));
	});

	it('should not be passed by Baton Pass', function () {
		// hardcoded RNG seed ensures Magikarp will not crit at +0
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4]}, [[
			{species: 'Machamp', moves: ['rocksmash', 'batonpass'], gigantamax: true},
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Magikarp', moves: ['tackle']},
		], [
			{species: 'Wynaut', ability: "Shell Armor", moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move rocksmash 1 dynamax, move sleeptalk', 'auto');
		battle.makeChoices('move rocksmash 1, move sleeptalk', 'auto');
		battle.makeChoices('move rocksmash 1, move sleeptalk', 'auto');
		battle.makeChoices('move batonpass, move sleeptalk', 'auto');
		battle.makeChoices('switch 3');
		battle.makeChoices('move tackle 2, move sleeptalk', 'auto');

		// Magikarp is only +0 for crit rate, so it will not crit
		assert(battle.log.every(line => !line.startsWith('|-crit')));
	});
});
