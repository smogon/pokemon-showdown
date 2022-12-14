'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pledge moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should work`, function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Ninjask', ability: 'noability', moves: ['waterpledge']},
			{species: 'Incineroar', ability: 'noability', moves: ['grasspledge']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Garchomp', ability: 'noability', moves: ['waterpledge']},
			{species: 'Mew', ability: 'noability', moves: ['firepledge']},
		]});
		battle.makeChoices('move 1 1, move 1 1', 'move 1 1, move 1 2');

		// Incineroar should start Grass Pledge first, then faint to Water Pledge
		assert(battle.p2.sideConditions['waterpledge']);
		assert(battle.p2.sideConditions['grasspledge']);
		assert.fainted(battle.p1.active[1]);
	});
});
