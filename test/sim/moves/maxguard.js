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

	it.skip('should block certain moves that bypass Protect', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'minun', ability: 'plus', moves: ['sleeptalk']},
			{species: 'plusle', moves: ['magneticflux']},
		], [
			{species: 'wynaut', item: 'powerherb', moves: ['phantomforce']},
			{species: 'wynaut', ability: 'intrepidsword', moves: ['psychup']},
		]]);
		battle.makeChoices('move sleeptalk dynamax, move magneticflux', 'move phantomforce 1, move psychup 1');

		const minun = battle.p1.active[0];
		assert.statStage(minun, 'def', 0);
		assert.statStage(minun, 'spd', 0);
		assert.fullHP(minun);
		assert.statStage(battle.p2.active[1], 'atk', 1);
	});
});
