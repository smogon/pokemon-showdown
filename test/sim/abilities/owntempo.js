'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Own Tempo', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should block Intimidate', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Gyarados', ability: 'intimidate', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: 'Smeargle', ability: 'own tempo', item: 'adrenaline orb', moves: ['sleeptalk']}]});
		assert.statStage(battle.p2.active[0], 'atk', 0);
		assert.statStage(battle.p2.active[0], 'spe', 1);
	});
});
