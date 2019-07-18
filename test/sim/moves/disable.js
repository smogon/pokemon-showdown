'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Disable', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent the use of the target\'s last move', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Abra', ability: 'synchronize', item: 'laggingtail', moves: ['disable']}]});
		battle.setPlayer('p2', {team: [{species: 'Abra', ability: 'synchronize', moves: ['teleport']}]});
		battle.makeChoices('move disable', 'move teleport');
		assert.cantMove(() => battle.makeChoices('move disable', 'move teleport'), 'Abra', 'Teleport');
	});
});
