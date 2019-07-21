'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pledge Moves', function () {
	beforeEach(function () {
		battle = common.createBattle({gameType: 'doubles'});
	});

	afterEach(() => battle.destroy());

	it('should not combine if one of the users is forced to use a non-pledge move on its turn', function () {
		battle.setPlayer('p1', {team: [
			{species: 'Venusaur', level: 90, moves: ['sludge', 'grasspledge']},
			{species: 'Charizard', level: 99, moves: ['sleeptalk', 'firepledge']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Whimsicott', ability: 'prankster', moves: ['encore']},
			{species: 'Blastoise', moves: ['sleeptalk']},
		]});

		battle.makeChoices('move sludge 2, move sleeptalk', 'move encore 1, move sleeptalk');
		battle.makeChoices('move grasspledge 2, move firepledge 2', 'move encore 1, move sleeptalk');
		assert(!battle.p2.active[0].side.sideConditions['firepledge'], "Fire Pledge should not be active on the opponent's side of the field.");
		assert(!battle.p1.active[1].moveThisTurn, "Charizard should not have moved this turn.");
	});
});
