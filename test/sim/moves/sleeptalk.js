'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sleep Talk', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should run conditions for submove', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'snorlax', moves: ['sleeptalk', 'highjumpkick']}]});
		battle.setPlayer('p2', {team: [{species: 'breloom', moves: ['spore', 'gravity']}]});
		battle.makeChoices('move sleeptalk', 'move gravity');
		battle.makeChoices('move sleeptalk', 'move spore');
		assert.fullHP(battle.p2.active[0]);
		assert.match(battle.log[battle.lastMoveLine + 1], /^\|cant.*move: Gravity|High Jump Kick$/, 'should log that High Jump Kick failed');
	});
});
