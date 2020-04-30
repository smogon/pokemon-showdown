'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('G-Max Chi Strike', function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip('should provide a crit boost independent of Focus Energy', function () {
		// hardcoded RNG seed that doesn't roll a crit at +2 crit rate
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4]});
		battle.setPlayer('p1', {team: [
			{species: 'Machamp-Gmax', moves: ['sleeptalk', 'rocksmash']},
			{species: 'Wynaut', moves: ['focusenergy', 'tackle']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', ability: "Shell Armor", moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});

		battle.resetRNG();
		battle.makeChoices();
		battle.makeChoices('move rocksmash 1 dynamax, move tackle 2', 'auto');

		// This should be a guaranteed crit at +3
		assert(battle.log.some(line => line.startsWith('|-crit')));
	});

	it('should boost the user and its ally\'s critical hit rate by 1 stage', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Machamp-Gmax', moves: ['rocksmash']},
			{species: 'Wynaut', item: 'Scope Lens', ability: "Super Luck", moves: ['tackle']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', ability: "Shell Armor", moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});

		// Boosts Wynaut to +3, so this crit is now guaranteed
		battle.makeChoices('move rocksmash 1 dynamax, move tackle 2', 'auto');
		assert(battle.log.some(line => line.startsWith('|-crit')));
	});

	it.skip('should be copied by Psych Up', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Machamp-Gmax', moves: ['rocksmash', 'sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Magikarp', moves: ['psychup', 'tackle']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', ability: "Shell Armor", moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});

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
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Machamp-Gmax', moves: ['rocksmash', 'batonpass']},
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Magikarp', moves: ['tackle']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', ability: "Shell Armor", moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});

		battle.makeChoices('move rocksmash 1 dynamax, move sleeptalk', 'auto');
		battle.makeChoices('move rocksmash 1, move sleeptalk', 'auto');
		battle.makeChoices('move rocksmash 1, move sleeptalk', 'auto');
		battle.makeChoices('move batonpass, move sleeptalk', 'auto');
		battle.makeChoices('switch 3');
		battle.makeChoices('move tackle 2, move sleeptalk', 'auto');
		console.log(battle.getDebugLog());

		// Magikarp is only +0 so it probably will not crit
		assert(battle.log.every(line => !line.startsWith('|-crit')));
	});
});
