'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Max Guard', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should be disallowed by Taunt', function () {
		battle = common.createBattle([[
			{species: "Feebas", moves: ['splash', 'tackle']},
		], [
			{species: "Wynaut", moves: ['taunt', 'splash']},
		]]);
		battle.makeChoices('move tackle dynamax', 'auto');
		assert.cantMove(() => battle.choose('p1', 'move splash'), 'Feebas', 'Max Guard', false);
	});

	it('should allow Feint to damage the user, but not break the protection effect', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'minun', moves: ['sleeptalk']},
			{species: 'plusle', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', ability: 'noguard', moves: ['fissure']},
			{species: 'wynaut', moves: ['feint']},
		]]);
		battle.makeChoices('move sleeptalk dynamax, move sleeptalk', 'move fissure 1, move feint 1');

		const minun = battle.p1.active[0];
		assert.false.fainted(minun);
	});

	it('should block certain moves that bypass Protect', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'sunflora', item: 'sitrusberry', ability: 'minus', moves: ['sleeptalk']},
			{species: 'plusle', ability: 'plus', moves: ['magneticflux', 'gearup']},
		], [
			{species: 'ferrothorn', item: 'sitrusberry', moves: ['flowershield', 'teatime']},
			{species: 'sunflora', ability: 'intrepidsword', moves: ['psychup', 'sleeptalk']},
		]]);

		battle.makeChoices('move sleeptalk dynamax, move magneticflux', 'move flowershield, move psychup 1');
		const sunflora = battle.p1.active[0];
		assert.statStage(sunflora, 'def', 0, 'should block magneticflux and flowershield');
		assert.statStage(sunflora, 'spd', 0, 'should block magneticflux');
		assert.statStage(battle.p2.active[1], 'atk', 1, 'should not have changed from +1 (intrepidsword) to 0 (psychup)');
		assert.match(battle.log[battle.lastMoveLine + 1], /^|-activate.*move: Max Guard$/, 'should log that maxguard has activated');

		battle.p1.active[0].volatiles.stall.counter = 1;
		battle.makeChoices('move sleeptalk, move gearup', 'move teatime, move sleeptalk');
		assert.statStage(sunflora, 'atk', 0, 'should block gearup');
		assert.statStage(sunflora, 'spa', 0, 'should block gearup');
		assert.equal(sunflora.item, 'sitrusberry', 'should block teatime');
		assert.statStage(battle.p2.active[1], 'atk', 1);
	});
});
