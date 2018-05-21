'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Truant', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent the user from acting the turn after using a move', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Slaking", ability: 'truant', moves: ['scratch']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Steelix", ability: 'sturdy', moves: ['endure']}]);
		let pokemon = battle.p2.active[0];

		assert.hurts(pokemon, () => battle.commitDecisions());
		assert.false.hurts(pokemon, () => battle.commitDecisions());
	});

	it('should allow the user to act after a recharge turn', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Slaking", ability: 'truant', moves: ['hyperbeam']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Steelix", ability: 'sturdy', moves: ['endure']}]);
		let pokemon = battle.p2.active[0];

		assert.hurts(pokemon, () => battle.commitDecisions());
		assert.false.hurts(pokemon, () => battle.commitDecisions());
		assert.hurts(pokemon, () => battle.commitDecisions());
	});

	it('should not allow the user to act the turn it wakes up, if it moved the turn it fell asleep', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Slaking", ability: 'truant', moves: ['scratch', 'rest']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Steelix", ability: 'sturdy', moves: ['endure', 'quickattack']}]);
		let pokemon = battle.p2.active[0];

		battle.makeChoices('move rest', 'move quickattack');
		assert.false.hurts(pokemon, () => battle.makeChoices('move scratch', 'move endure'), 'Attacked on turn 1 of sleep');
		assert.false.hurts(pokemon, () => battle.makeChoices('move scratch', 'move endure'), 'Attacked on turn 2 of sleep');
		assert.false.hurts(pokemon, () => battle.makeChoices('move scratch', 'move endure'), 'Attacked after waking up');
	});

	it('should allow the user to act the turn it wakes up, if it was loafing the turn it fell asleep', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Slaking", ability: 'truant', moves: ['scratch', 'irondefense']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Steelix", ability: 'sturdy', moves: ['endure', 'spore']}]);
		let user = battle.p1.active[0];
		let pokemon = battle.p2.active[0];

		battle.makeChoices('move irondefense', 'move endure');
		battle.makeChoices('move irondefense', 'move spore');
		while (user.status === 'slp') {
			assert.fullHP(pokemon);
			battle.makeChoices('move scratch', 'move endure');
		}
		assert.false.fullHP(pokemon);
	});

	it('should cause two-turn moves to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Slaking", ability: 'truant', moves: ['razorwind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Steelix", ability: 'sturdy', moves: ['endure']}]);
		let pokemon = battle.p2.active[0];

		assert.false.hurts(pokemon, () => battle.commitDecisions());
		assert.false.hurts(pokemon, () => battle.commitDecisions());
	});

	it('should prevent a newly-Mega Evolved Pokemon from acting if given the ability', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Slaking", ability: 'truant', item: 'choicescarf', moves: ['entrainment']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Steelix", ability: 'sturdy', item: 'steelixite', moves: ['heavyslam']}]);

		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices('move entrainment', 'move heavyslam mega'));
	});
});
