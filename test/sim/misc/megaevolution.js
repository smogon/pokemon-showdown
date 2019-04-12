'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mega Evolution', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should overwrite normally immutable abilities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Metagross", ability: 'comatose', item: 'metagrossite', moves: ['metalclaw']}]});
		battle.setPlayer('p2', {team: [{species: "Wishiwashi", ability: 'schooling', moves: ['uturn']}]});
		const megaMon = battle.p1.active[0];
		battle.makeChoices('move metalclaw mega', 'move uturn');
		assert.equal(megaMon.ability, 'toughclaws');
	});
});
