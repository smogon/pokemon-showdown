'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

// tests are derived from the following post and related quotes:
// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9417627
describe('Stone Axe', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should set up Stealth Rock on the side of the opponent`, function () {
		battle = common.createBattle([[
			{species: 'kleavor', ability: 'noguard', moves: ['stoneaxe']},
		], [
			{species: 'registeel', moves: ['splash']},
		]]);

		battle.makeChoices();
		assert(battle.p2.sideConditions.stealthrock);
	});

	it(`should set up Stealth Rock on the side of the opponent, not necessarily the target, in a double battle`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'kleavor', ability: 'noguard', moves: ['stoneaxe']},
			{species: 'pikachu', moves: ['splash']},
		], [
			{species: 'squirtle', moves: ['splash']},
			{species: 'bulbasaur', moves: ['splash']},
		]]);

		battle.makeChoices('move stoneaxe -2, move splash', 'move splash, move splash');

		assert.equal(!!(battle.p1.sideConditions.stealthrock), false);
		assert(battle.p2.sideConditions.stealthrock);
	});

	it(`should still set up Stealth Rock on the side of the opponent that is behind a Substitute`, function () {
		battle = common.createBattle([[
			{species: 'kleavor', ability: 'noguard', moves: ['stoneaxe']},
		], [
			{species: 'regieleki', moves: ['substitute']},
		]]);

		battle.makeChoices();
		assert(battle.p2.sideConditions.stealthrock);
	});

	it(`should not set up Stealth Rock if the move does not hit opponent or its Substitute`, function () {
		battle = common.createBattle([[
			{species: 'kleavor', moves: ['stoneaxe']},
		], [
			{species: 'regieleki', moves: ['protect']},
		]]);

		battle.makeChoices();
		assert.equal(!!(battle.p2.sideConditions.stealthrock), false);
	});

	it('should not be bounced back by Magic Bounce', function () {
		battle = common.createBattle([[
			{species: 'kleavor', ability: 'noguard', moves: ['stoneaxe']},
		], [
			{species: 'registeel', ability: 'magicbounce', moves: ['splash']},
		]]);

		battle.makeChoices();
		assert.equal(!!(battle.p1.sideConditions.stealthrock), false);
		assert(battle.p2.sideConditions.stealthrock);
	});

	it('should have its Stealth Rock prevented by Sheer Force', function () {
		battle = common.createBattle([[
			{species: 'kleavor', ability: 'sheerforce', moves: ['stoneaxe']},
		], [
			{species: 'registeel', ability: 'noguard', moves: ['splash']},
		]]);

		battle.makeChoices();
		assert.equal(!!(battle.p2.sideConditions.stealthrock), false);
	});

	it(`should not set Stealth Rock when the user faints from Rocky Helmet`, function () {
		battle = common.createBattle([[
			{species: 'kleavor', ability: 'noguard', item: 'focussash', moves: ['stoneaxe']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'regieleki', item: 'rockyhelmet', moves: ['sheercold']},
		]]);

		battle.makeChoices(); // Kleavor will faint to the Rocky Helmet
		assert.equal(!!(battle.p2.sideConditions.stealthrock), false);
	});
});
