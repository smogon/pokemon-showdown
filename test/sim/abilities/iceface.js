'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Ice Face', function () {
	afterEach(() => battle.destroy());

	it('should block damage from one physical move per Hail', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Eiscue', ability: 'iceface', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: 'Mewtwo', ability: 'pressure', moves: ['tackle', 'watergun', 'hail']}]});
		assert.hurts(battle.p1.active[0], () => battle.makeChoices('auto', 'move watergun'));
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices());
		assert.hurts(battle.p1.active[0], () => battle.makeChoices());
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices('auto', 'move hail'));
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices());
		assert.hurts(battle.p1.active[0], () => battle.makeChoices());
	});
});
