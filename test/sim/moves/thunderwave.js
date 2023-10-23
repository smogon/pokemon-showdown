'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Thunder Wave', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not ignore natural type immunities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Jolteon", ability: 'quickfeet', moves: ['thunderwave']}]});
		battle.setPlayer('p2', {team: [{species: "Hippowdon", ability: 'sandforce', moves: ['slackoff']}]});
		battle.makeChoices('move thunderwave', 'move slackoff');
		assert.equal(battle.p2.active[0].status, '');
	});
});
