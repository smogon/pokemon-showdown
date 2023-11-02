'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

// tests are derived from the following post and related quotes:
// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9417627
describe('Ceaseless Edge', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should set up Spikes on the side of the opponent`, function () {
		battle = common.createBattle([[
			{species: 'samurotthisui', ability: 'noguard', moves: ['ceaselessedge']},
		], [
			{species: 'registeel', moves: ['splash']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p2.sideConditions.spikes?.layers, 1);
	});

	it(`should set up Spikes on the side of the opponent, not necessarily the target, in a double battle`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'samurotthisui', ability: 'noguard', moves: ['ceaselessedge']},
			{species: 'pikachu', moves: ['splash']},
		], [
			{species: 'squirtle', moves: ['splash']},
			{species: 'bulbasaur', moves: ['splash']},
		]]);

		battle.makeChoices('move ceaselessedge -2, move splash', 'move splash, move splash');

		assert.equal(!!(battle.p1.sideConditions.spikes), false);
		assert.equal(battle.p2.sideConditions.spikes?.layers, 1);
	});

	it(`should still set up Spikes on the side of the opponent that is behind a Substitute`, function () {
		battle = common.createBattle([[
			{species: 'samurotthisui', ability: 'noguard', moves: ['ceaselessedge']},
		], [
			{species: 'regieleki', moves: ['substitute']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p2.sideConditions.spikes?.layers, 1);
	});

	it(`should not set up Spikes if the move does not hit opponent or its Substitute`, function () {
		battle = common.createBattle([[
			{species: 'samurotthisui', ability: 'noguard', moves: ['ceaselessedge']},
		], [
			{species: 'regieleki', moves: ['protect']},
		]]);

		battle.makeChoices();
		assert.equal(!!(battle.p2.sideConditions.spikes), false);
	});

	it(`should not be bounced back by Magic Bounce`, function () {
		battle = common.createBattle([[
			{species: 'samurotthisui', ability: 'noguard', moves: ['ceaselessedge']},
		], [
			{species: 'registeel', ability: 'magicbounce', moves: ['splash']},
		]]);

		battle.makeChoices();
		assert.equal(!!(battle.p1.sideConditions.spikes), false);
		assert.equal(battle.p2.sideConditions.spikes?.layers, 1);
	});

	it(`should have its Spikes prevented by Sheer Force`, function () {
		battle = common.createBattle([[
			{species: 'samurotthisui', ability: 'sheerforce', moves: ['ceaselessedge']},
		], [
			{species: 'registeel', ability: 'noguard', moves: ['splash']},
		]]);

		battle.makeChoices();
		assert.equal(!!(battle.p2.sideConditions.spikes), false);
	});

	it(`should not set Spikes when the user faints from Rocky Helmet`, function () {
		battle = common.createBattle([[
			{species: 'samurotthisui', ability: 'noguard', item: 'focussash', moves: ['ceaselessedge']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'regieleki', item: 'rockyhelmet', moves: ['sheercold']},
		]]);

		battle.makeChoices(); // Samurott will faint to the Rocky Helmet
		assert.equal(!!(battle.p2.sideConditions.spikes), false);
	});
});
