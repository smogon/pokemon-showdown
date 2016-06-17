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
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: 'Politoed', ability: 'damp', moves: ['calmmind']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: 'Electrode', ability: 'static', moves: ['explosion']}]);
		battle.commitDecisions();
		assert.fullHP(p1.active[0]);
		assert.fullHP(p2.active[0]);
	});

	it('should prevent Aftermath from activating', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: 'Poliwrath', ability: 'damp', moves: ['closecombat']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: 'Aron', ability: 'aftermath', moves: ['leer']}]);
		battle.commitDecisions();
		assert.fullHP(p1.active[0]);
		assert.fainted(p2.active[0]);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: 'Politoed', ability: 'damp', moves: ['calmmind']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: 'Electrode', ability: 'moldbreaker', moves: ['explosion']}]);
		assert.hurts(p1.active[0], () => battle.commitDecisions());
		assert.fainted(p2.active[0]);
	});
});
