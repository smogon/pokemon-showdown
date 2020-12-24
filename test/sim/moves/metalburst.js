'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Metal Burst', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should run conditions for submove', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'snorlax', moves: ['sleeptalk', 'metalburst']},
			{species: 'tauros', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'breloom', moves: ['sleeptalk', 'sonicboom']},
			{species: 'venusaur', moves: ['sleeptalk', 'spore']},
		]});
		battle.makeChoices('move metalburst, move sleeptalk', 'move sonicboom 1, move sleeptalk');
		const breloomHpTurn1 = battle.p2.active[0].hp;
		assert.equal(breloomHpTurn1, battle.p2.active[0].maxhp - battle.dex.getMove('sonicboom').damage * 1.5);
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sonicboom 1, move spore 1');
		assert.equal(battle.p2.active[0].hp, breloomHpTurn1 - battle.dex.getMove('sonicboom').damage * 1.5);
	});

	it('should target the opposing Pokemon that hit the user with an attack most recently that turn', function () {
		// The seed should select venusaur if the test would otherwise fail
		battle = common.createBattle({gameType: 'doubles', seed: [3, 4, 5, 6]});
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
