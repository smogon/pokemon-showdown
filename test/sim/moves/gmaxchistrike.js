'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('G-Max Chi Strike', function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip('should boost the user and its ally\'s critical hit rate by 1 stage', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Machamp-Gmax', moves: ['rocksmash']},
			{species: 'Wynaut', item: 'Scope Lens', moves: ['tackle']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});

		// Needs an RNG seed that does not produce a crit at current crit stage of +2 from Scope Lens & +1 Chi Strike
		battle.makeChoices('move rocksmash 1 dynamax, move tackle 2', 'auto');
		assert(battle.log.every(line => !line.startsWith('|-crit')));

		// Boosts Wynaut to +3, so this crit is now guaranteed
		battle.makeChoices('move rocksmash 1 dynamax, move tackle 2', 'auto');
		assert(battle.log.some(line => line.startsWith('|-crit')));
	});

	it.skip('should provide a crit boost independent of Focus Energy', function () {
		// hardcoded RNG seed that doesn't roll a crit at +2 crit rate
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4]});
		battle.setPlayer('p1', {team: [
			{species: 'Machamp-Gmax', moves: ['sleeptalk', 'rocksmash']},
			{species: 'Wynaut', moves: ['focusenergy', 'tackle']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});

		battle.resetRNG();
		battle.makeChoices();
		battle.makeChoices('move rocksmash 1 dynamax, move tackle 2', 'auto');

		// This should be a guaranteed crit at +3
		assert(battle.log.some(line => line.startsWith('|-crit')));
	});
});
