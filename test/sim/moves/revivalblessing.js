'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Revival Blessing', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should revive allies`, function () {
		battle = common.createBattle([[
			{species: 'corviknight', ability: 'runaway', moves: ['memento']},
			{species: 'zoroark', ability: 'runaway', moves: ['revivalblessing']},
			{species: 'wynaut', ability: 'runaway', moves: ['splash']},
		], [
			{species: 'goodra', ability: 'gooey', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move memento', 'auto');
		battle.makeChoices('switch zoroark', '');
		battle.makeChoices('move revivalblessing', 'auto');
		battle.makeChoices('switch corviknight', '');
		assert.equal(battle.p1.pokemonLeft, 3);
	});

	it(`should not actually switch the active Pokemon`, function () {
		battle = common.createBattle([[
			{species: 'corviknight', ability: 'runaway', moves: ['memento']},
			{species: 'zoroark', ability: 'runaway', moves: ['revivalblessing']},
			{species: 'wynaut', ability: 'runaway', moves: ['splash']},
		], [
			{species: 'goodra', ability: 'gooey', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move memento', 'auto');
		battle.makeChoices('switch zoroark', '');
		battle.makeChoices('move revivalblessing', 'auto');
		assert.equal(battle.requestState, 'switch');
		battle.makeChoices('switch corviknight', '');
		assert.species(battle.p1.active[0], 'Zoroark');
	});

	it(`should let you revive even with one Pokemon remaining`, function () {
		battle = common.createBattle([[
			{species: 'corviknight', ability: 'runaway', moves: ['memento']},
			{species: 'zoroark', ability: 'runaway', moves: ['revivalblessing']},
		], [
			{species: 'goodra', ability: 'gooey', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move memento', 'auto');
		battle.makeChoices('switch zoroark', '');
		battle.makeChoices('move revivalblessing', 'auto');
		assert.equal(battle.requestState, 'switch');
		battle.makeChoices('switch corviknight', '');
		assert.equal(battle.p1.pokemonLeft, 2);
	});

	it(`shouldn't allow a fainted Pokemon to make its move the same turn after being revived`, () => {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'pawmot', ability: 'naturalcure', moves: ['revivalblessing']},
			{species: 'lycanrocmidnight', ability: 'noguard', item: 'laggingtail', moves: ['doubleteam']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
			{species: 'chienpao', ability: 'swordofruin', moves: ['sheercold']},
		]]);
		battle.makeChoices('move revivalblessing, move doubleteam', 'move sleeptalk, move sheercold 2');
		battle.makeChoices('switch 2', '');
		assert.equal(battle.p1.active[1].boosts.evasion, 0, "Lycanroc should not have used Double Team");
	});
});
