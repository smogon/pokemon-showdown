'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Truant', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should prevent the user from acting the turn after using a move', () => {
		battle = common.createBattle([[
			{ species: "Slaking", ability: 'truant', moves: ['scratch'] },
		], [
			{ species: "Steelix", ability: 'sturdy', moves: ['endure'] },
		]]);
		const pokemon = battle.p2.active[0];

		assert.hurts(pokemon, () => battle.makeChoices());
		assert.false.hurts(pokemon, () => battle.makeChoices());
	});

	it(`should allow the user to act after a recharge turn`, () => {
		battle = common.createBattle([[
			{ species: 'Slaking', ability: 'truant', moves: ['hyperbeam'] },
		], [
			{ species: 'Registeel', ability: 'noguard', moves: ['endure'] },
		]]);
		const pokemon = battle.p2.active[0];

		assert.hurts(pokemon, () => battle.makeChoices());
		assert.false.hurts(pokemon, () => battle.makeChoices());
		assert.hurts(pokemon, () => battle.makeChoices());
	});

	it('should not allow the user to act the turn it wakes up, if it moved the turn it fell asleep', () => {
		battle = common.createBattle([[
			{ species: "Slaking", ability: 'truant', moves: ['scratch', 'rest'] },
		], [
			{ species: "Steelix", ability: 'sturdy', moves: ['endure', 'quickattack'] },
		]]);
		const pokemon = battle.p2.active[0];

		battle.makeChoices('move rest', 'move quickattack');
		assert.false.hurts(pokemon, () => battle.makeChoices('move scratch', 'move endure'), 'Attacked on turn 1 of sleep');
		assert.false.hurts(pokemon, () => battle.makeChoices('move scratch', 'move endure'), 'Attacked on turn 2 of sleep');
		assert.false.hurts(pokemon, () => battle.makeChoices('move scratch', 'move endure'), 'Attacked after waking up');
	});

	it('should allow the user to act the turn it wakes up, if it was loafing the turn it fell asleep', () => {
		battle = common.createBattle([[
			{ species: "Slaking", ability: 'truant', moves: ['scratch', 'irondefense'] },
		], [
			{ species: "Steelix", ability: 'sturdy', moves: ['endure', 'spore'] },
		]]);
		const user = battle.p1.active[0];
		const pokemon = battle.p2.active[0];

		battle.makeChoices('move irondefense', 'move endure');
		battle.makeChoices('move irondefense', 'move spore');
		for (let i = 0; i < 5; i++) {
			if (user.status !== 'slp') break;
			assert.fullHP(pokemon);
			battle.makeChoices('move scratch', 'move endure');
		}
		assert.false.fullHP(pokemon);
	});

	it('should cause two-turn moves to fail', () => {
		battle = common.createBattle([[
			{ species: "Slaking", ability: 'truant', moves: ['razorwind'] },
		], [
			{ species: "Steelix", ability: 'sturdy', moves: ['endure'] },
		]]);
		const pokemon = battle.p2.active[0];

		assert.false.hurts(pokemon, () => battle.makeChoices());
		assert.false.hurts(pokemon, () => battle.makeChoices());
	});

	it('should prevent a newly-Mega Evolved Pokemon from acting if given the ability', () => {
		battle = common.createBattle([[
			{ species: "Slaking", ability: 'truant', item: 'choicescarf', moves: ['entrainment'] },
		], [
			{ species: "Steelix", ability: 'sturdy', item: 'steelixite', moves: ['heavyslam'] },
		]]);

		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices('move entrainment', 'move heavyslam mega'));
	});
});
