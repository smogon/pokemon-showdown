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

	it('should target the opposing Pokemon that hit the user with an attack most recently that turn', function () {
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4].map(i => i + 1111111)});
		battle.setPlayer('p1', {team: [
			{species: 'snorlax', moves: ['metalburst']},
			{species: 'tauros', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'breloom', moves: ['swift']},
			{species: 'venusaur', moves: ['swift']},
		]});
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
		assert.fullHP(battle.p2.active[1]);
	});
});
