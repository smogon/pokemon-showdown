'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('After You', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should cause the targeted Pokemon to immediately move next`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Wynaut', ability: 'prankster', moves: ['afteryou']},
			{species: 'Magnemite', level: 1, moves: ['magnetrise']},
		], [
			{species: 'Great Tusk', moves: ['headlongrush']},
			{species: "Magikarp", moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move afteryou -2, move magnetrise', 'move headlongrush 2, auto');
		const magnemite = battle.p1.active[1];
		assert.false.fainted(magnemite);
	});

	it(`should only cause the target to move next, not run a submove`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Wynaut', ability: 'prankster', moves: ['afteryou']},
			{species: 'Necrozma', level: 50, ability: 'prankster', moves: ['photongeyser']},
		], [
			{species: 'Dugtrio', moves: ['sleeptalk']},
			{species: 'Roggenrola', level: 1, ability: 'sturdy', moves: ['sleeptalk']},
		]]);

		// Photon Geyser has a mechanic where it ignores abilities with Mold Breaker,
		// but doesn't when called via a submove like Sleep Talk. If it fails to KO through Sturdy,
		// it's most likely because it's using submove behavior
		battle.makeChoices('move afteryou -2, move photongeyser 2', 'auto');
		const roggenrola = battle.p2.active[1];
		assert.fainted(roggenrola);
	});

	it(`should work in a free-for-all`, function () {
		battle = common.createBattle({gameType: 'freeforall'}, [[
			{species: 'Wynaut', ability: 'prankster', moves: ['afteryou']},
		], [
			{species: 'Magnemite', level: 1, moves: ['magnetrise']},
		], [
			{species: 'Great Tusk', moves: ['headlongrush']},
		], [
			{species: 'Magikarp', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move afteryou 1', 'move magnetrise', 'move headlongrush 1', 'auto');
		const magnemite = battle.p2.active[0];
		assert.false.fainted(magnemite);
	});

	it(`should fail in singles whether the user is faster or slower than its target`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['afteryou', 'ember']},
		], [
			{species: 'Tyrogue', moves: ['afteryou', 'seismictoss']},
		]]);

		battle.makeChoices('move afteryou', 'move seismictoss');
		battle.makeChoices('move ember', 'move afteryou');
		assert(battle.log.includes('|-fail|p1a: Wynaut'));
		assert(battle.log.includes('|-fail|p2a: Tyrogue'));
	});
});
