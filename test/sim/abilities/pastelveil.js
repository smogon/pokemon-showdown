'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pastel Veil', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent itself and its allies from becoming poisoned', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'ponyta', ability: 'pastelveil', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'croagunk', moves: ['toxic']},
			{species: 'wynaut', ability: 'compoundeyes', moves: ['poisongas']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.pokemon[0].status, '');
		assert.equal(battle.p1.pokemon[1].status, '');
	});

	it('should remove poison on itself and allies when switched in', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'ponyta', ability: 'pastelveil', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'croagunk', moves: ['sleeptalk', 'skillswap']},
			{species: 'wynaut', ability: 'compoundeyes', moves: ['poisongas']},
		]]);
		battle.makeChoices('auto', 'move skillswap 1, move poisongas');
		battle.makeChoices('switch 3, move sleeptalk', 'auto');
		battle.makeChoices('switch 3, move sleeptalk', 'auto');
		assert.equal(battle.p1.pokemon[0].status, '');
		assert.equal(battle.p1.pokemon[1].status, '');
	});

	it('should remove poison on itself and allies when the ability is acquired via Skill Swap', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'ponyta', ability: 'pastelveil', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'croagunk', moves: ['skillswap', 'sleeptalk']},
			{species: 'wynaut', ability: 'compoundeyes', moves: ['poisongas']},
		]]);
		battle.makeChoices('auto', 'move skillswap 1, move poisongas');
		battle.makeChoices('auto', 'move skillswap 2, move poisongas');
		assert.equal(battle.p1.pokemon[0].status, '');
		assert.equal(battle.p1.pokemon[1].status, '');
	});

	it('should prevent a poison originating from an ally', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'ponyta', ability: 'pastelveil', moves: ['toxic']},
			{species: 'wynaut', moves: ['toxic']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move toxic -2, move toxic -1', 'auto');
		assert.equal(battle.p1.pokemon[0].status, '');
		assert.equal(battle.p1.pokemon[1].status, '');
	});

	it('should be bypassed by Mold Breaker and cured afterwards, but not for the ally', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'ponyta', ability: 'pastelveil', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'croagunk', ability: 'moldbreaker', moves: ['toxic']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('auto', 'move toxic 1, move sleeptalk');
		battle.makeChoices('auto', 'move toxic 2, move sleeptalk');
		assert.equal(battle.p1.pokemon[0].status, '');
		assert.equal(battle.p1.pokemon[1].status, 'tox');
	});

	it('should only check for Pastel Veil cures after Lum/Pecha Berry', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'ponyta', ability: 'pastelveil', item: 'lumberry', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'croagunk', ability: 'moldbreaker', moves: ['toxic']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('auto', 'move toxic 1, move sleeptalk');
		assert.equal(battle.p1.pokemon[0].status, '');
		assert.equal(battle.p1.pokemon[0].item, '');
	});
});
