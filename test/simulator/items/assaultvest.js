'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Assault Vest', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should disable the use of Status moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Abra', ability: 'synchronize', moves: ['teleport']}]});
		battle.setPlayer('p2', {team: [{species: 'Abra', ability: 'synchronize', item: 'assaultvest', moves: ['teleport']}]});
		assert.cantMove(() => battle.makeChoices('move teleport', 'move teleport'), 'Abra', 'Teleport');
	});

	it('should not prevent the use of Status moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Lopunny', ability: 'klutz', item: 'assaultvest', moves: ['trick']}]});
		battle.setPlayer('p2', {team: [{species: 'Abra', ability: 'synchronize', item: 'ironball', moves: ['calmmind']}]});
		battle.makeChoices('move trick', 'move calmmind');
		assert.statStage(battle.p2.active[0], 'spa', 1);
		assert.statStage(battle.p2.active[0], 'spd', 1);
	});
});
