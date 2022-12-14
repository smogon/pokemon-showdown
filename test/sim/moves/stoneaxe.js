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

	it('should set up stealth rock on the side of the opponent', function () {
		battle = common.createBattle([
			[{species: 'kleavor', moves: ['stoneaxe']}],
			[{species: 'regieleki', moves: ['splash']}],
		]);

		battle.makeChoices();
		assert.equal(!!(battle.p1.sideConditions.stealthrock), false);
		assert(battle.p2.sideConditions.stealthrock);
	});

	it(`should set up stealth rock on the side of the opponent, not necessarily the target, in a double battle`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'kleavor', moves: ['stoneaxe']},
			{species: 'pikachu', moves: ['splash']},
		], [
			{species: 'squirtle', moves: ['splash']},
			{species: 'bulbasaur', moves: ['splash']},
		]]);

		battle.makeChoices('move stoneaxe -2, move splash', 'move splash, move splash');

		assert.equal(!!(battle.p1.sideConditions.stealthrock), false);
		assert(battle.p2.sideConditions.stealthrock);
	});

	it('should still set up stealth rock on the side of the opponent that is behind a substitute', function () {
		battle = common.createBattle([
			[{species: 'kleavor', moves: ['splash', 'stoneaxe']}],
			[{species: 'regieleki', moves: ['substitute', 'splash']}],
		]);

		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move stoneaxe', 'move splash');
		assert.equal(!!(battle.p1.sideConditions.stealthrock), false);
		assert(battle.p2.sideConditions.stealthrock);
	});

	it('should not set up stealth rock if the move does not hit opponent or its substitute', function () {
		battle = common.createBattle([
			[{species: 'kleavor', moves: ['stoneaxe']}],
			[{species: 'regieleki', moves: ['protect']}],
		]);

		battle.makeChoices();
		assert.equal(!!(battle.p1.sideConditions.stealthrock), false);
		assert.equal(!!(battle.p2.sideConditions.stealthrock), false);
	});

	it('should not be bounced back by Magic Bounce', function () {
		battle = common.createBattle([
			[{species: 'kleavor', moves: ['stoneaxe']}],
			[{species: 'hatterene', ability: 'magicguard', moves: ['splash']}],
		]);

		battle.makeChoices();
		assert.equal(!!(battle.p1.sideConditions.stealthrock), false);
		assert(battle.p2.sideConditions.stealthrock);
	});

	it('should have its stealth rock prevented by Sheer Force', function () {
		battle = common.createBattle([
			[{species: 'kleavor', ability: 'sheerforce', moves: ['stoneaxe']}],
			[{species: 'regieleki', moves: ['splash']}],
		]);

		battle.makeChoices();
		assert.equal(!!(battle.p1.sideConditions.stealthrock), false);
		assert.equal(!!(battle.p2.sideConditions.stealthrock), false);
	});
});
