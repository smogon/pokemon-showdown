'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Damp', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent self-destruction moves from activating', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Politoed', ability: 'damp', moves: ['calmmind']}]});
		battle.setPlayer('p2', {team: [{species: 'Electrode', ability: 'static', moves: ['explosion']}]});
		const [dampMon, selfKOMon] = [battle.p1.active[0], battle.p2.active[0]];
		battle.makeChoices('move calmmind', 'move explosion');
		assert.fullHP(dampMon);
		assert.fullHP(selfKOMon);
	});

	it('should prevent Aftermath from activating', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Poliwrath', ability: 'damp', moves: ['closecombat']}]});
		battle.setPlayer('p2', {team: [{species: 'Aron', ability: 'aftermath', moves: ['leer']}]});
		const [dampMon, afterMathMon] = [battle.p1.active[0], battle.p2.active[0]];
		battle.makeChoices('move closecombat', 'move leer');
		assert.fullHP(dampMon);
		assert.fainted(afterMathMon);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Politoed', ability: 'damp', moves: ['calmmind']}]});
		battle.setPlayer('p2', {team: [{species: 'Electrode', ability: 'moldbreaker', moves: ['explosion']}]});
		const [dampMon, mbSelfKOMon] = [battle.p1.active[0], battle.p2.active[0]];
		assert.hurts(dampMon, () => battle.makeChoices('move calmmind', 'move explosion'));
		assert.fainted(mbSelfKOMon);
	});
});
