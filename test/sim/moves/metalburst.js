'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Metal Burst', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should run conditions for submove', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'snorlax', moves: ['sleeptalk', 'metalburst']}]});
		battle.setPlayer('p2', {team: [{species: 'breloom', moves: ['spore', 'sonicboom']}]});
		battle.makeChoices('move metalburst', 'move sonicboom');
		const breloomHpTurn1 = battle.p2.active[0].hp;
		assert.equal(breloomHpTurn1, battle.p2.active[0].maxhp - battle.dex.getMove('sonicboom').damage * 1.5);
		battle.makeChoices('move sleeptalk', 'move spore');
		battle.makeChoices('move sleeptalk', 'move sonicboom');
		assert.equal(battle.p2.active[0].hp, breloomHpTurn1 - battle.dex.getMove('sonicboom').damage * 1.5);
	});
});
