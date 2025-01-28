'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Costar', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should copy the teammate\'s crit ratio on activation', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Smeargle', level: 1, moves: ['sleeptalk', 'focusenergy']},
			{species: 'Suicune', level: 1, moves: ['sleeptalk']},
			{species: 'Flamigo', level: 1, ability: 'costar', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Suicune', level: 1, moves: ['sleeptalk']},
			{species: 'pikachu', level: 1, moves: ['sleeptalk']},
			{species: 'weezinggalar', level: 1, ability: 'neutralizinggas', moves: ['sleeptalk']},
		]});

		battle.makeChoices('move focusenergy, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move sleeptalk, switch flamigo', 'move sleeptalk, move sleeptalk');

		const flamigo = battle.p1.active[1];
		assert(flamigo.volatiles['focusenergy'], "Costar should copy volatile crit modifiers.");

		battle.makeChoices('switch suicune, move sleeptalk', 'switch weezinggalar, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'switch suicune, move sleeptalk');
		assert(!flamigo.volatiles['focusenergy'], "Costar should copy having no volatile crit modifiers when re-activated.");
	});

	it('should copy both positive and negative stat changes', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Suicune', level: 1, moves: ['sleeptalk']},
			{species: 'Smeargle', level: 1, moves: ['sleeptalk', 'shellsmash']},
			{species: 'Flamigo', level: 1, ability: 'costar', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Suicune', level: 1, moves: ['sleeptalk']},
			{species: 'Suicune', level: 1, moves: ['sleeptalk']},
		]});


		battle.makeChoices('move sleeptalk, move shellsmash', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('switch flamigo, move sleeptalk', 'move sleeptalk, move sleeptalk');

		const flamigo = battle.p1.active[0];
		assert.statStage(flamigo, 'atk', 2, "A pokemon should copy the target's positive stat changes (atk) when switching in with Costar.");
		assert.statStage(flamigo, 'spa', 2, "A pokemon should copy the target's positive stat changes (spa) when switching in with Costar.");
		assert.statStage(flamigo, 'spe', 2, "A pokemon should copy the target's positive stat changes (spe) when switching in with Costar.");
		assert.statStage(flamigo, 'def', -1, "A pokemon should copy the target's negative stat changes (def) when switching in with Costar.");
		assert.statStage(flamigo, 'spd', -1, "A pokemon should copy the target's negative stat changes (spd) when switching in with Costar.");
	});

	it('should always activate later than Intimidate during simultaneous switch-ins', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'flamigo', ability: 'costar', moves: ['sleeptalk']},
			{species: 'registeel', ability: 'clearbody', moves: ['sleeptalk']},
		], [
			{species: 'litten', ability: 'intimidate', moves: ['sleeptalk']},
			{species: 'dipplin', ability: 'supersweetsyrup', moves: ['sleeptalk']},
		]]);
		const flamigo = battle.p1.active[0];
		assert.statStage(flamigo, 'atk', 0);
		assert.statStage(flamigo, 'evasion', 0);
	});
});

