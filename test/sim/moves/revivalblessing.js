'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Revival Blessing', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should revive allies`, () => {
		battle = common.createBattle([[
			{ species: 'corviknight', ability: 'runaway', moves: ['memento'] },
			{ species: 'zoroark', ability: 'runaway', moves: ['revivalblessing'] },
			{ species: 'wynaut', ability: 'runaway', moves: ['splash'] },
		], [
			{ species: 'goodra', ability: 'gooey', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move memento', 'auto');
		battle.makeChoices('switch zoroark', '');
		battle.makeChoices('move revivalblessing', 'auto');
		battle.makeChoices('switch corviknight', '');
		assert.equal(battle.p1.pokemonLeft, 3);
		assert.equal(battle.p1.pokemon[1].hp, Math.floor(battle.p1.pokemon[1].maxhp / 2));
	});

	it(`should not actually switch the active Pokemon`, () => {
		battle = common.createBattle([[
			{ species: 'corviknight', ability: 'runaway', moves: ['memento'] },
			{ species: 'zoroark', ability: 'runaway', moves: ['revivalblessing'] },
			{ species: 'wynaut', ability: 'runaway', moves: ['splash'] },
		], [
			{ species: 'goodra', ability: 'gooey', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move memento', 'auto');
		battle.makeChoices('switch zoroark', '');
		battle.makeChoices('move revivalblessing', 'auto');
		assert.equal(battle.requestState, 'switch');
		battle.makeChoices('switch corviknight', '');
		assert.species(battle.p1.active[0], 'Zoroark');
	});

	it(`should let you revive even with one Pokemon remaining`, () => {
		battle = common.createBattle([[
			{ species: 'corviknight', ability: 'runaway', moves: ['memento'] },
			{ species: 'zoroark', ability: 'runaway', moves: ['revivalblessing'] },
		], [
			{ species: 'goodra', ability: 'gooey', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move memento', 'auto');
		battle.makeChoices('switch zoroark', '');
		battle.makeChoices('move revivalblessing', 'auto');
		assert.equal(battle.requestState, 'switch');
		battle.makeChoices('switch corviknight', '');
		assert.equal(battle.p1.pokemonLeft, 2);
	});

	it(`should send the Pokemon back in immediately if in an active slot in Doubles`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'pawmot', ability: 'naturalcure', moves: ['revivalblessing'] },
			{ species: 'shinx', ability: 'intimidate', moves: ['sleeptalk'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
			{ species: 'chienpao', ability: 'noguard', moves: ['sheercold'] },
		]]);
		battle.makeChoices('auto', 'move sleeptalk, move sheercold 2');
		battle.makeChoices('switch 2', '');
		assert.equal(battle.p2.active[0].boosts.atk, -2, "Intimidate should have activated again");
	});

	it(`shouldn't allow a fainted Pokemon to make its move the same turn after being revived`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'pawmot', ability: 'naturalcure', moves: ['revivalblessing'] },
			{ species: 'lycanrocmidnight', ability: 'noguard', item: 'laggingtail', moves: ['doubleteam'] },
		], [
			{ species: 'mareep', ability: 'static', moves: ['sleeptalk'] },
			{ species: 'chienpao', ability: 'swordofruin', moves: ['sheercold'] },
		]]);
		battle.makeChoices('auto', 'move sleeptalk, move sheercold 2');
		battle.makeChoices('switch 2', '');
		assert.equal(battle.p1.active[1].boosts.evasion, 0, "Lycanroc should not have used Double Team");
	});

	it(`should not allow passing the revive when the bench is empty`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', moves: ['memento'] },
			{ species: 'snorlax', moves: ['splash'] },
			{ species: 'pawmot', moves: ['revivalblessing'] },
		], [
			{ species: 'chansey', moves: ['splash'] },
			{ species: 'blissey', moves: ['splash'] },
		]]);
		battle.makeChoices('move memento 1, move splash', 'auto');
		battle.makeChoices('switch 3, pass', '');
		// The bench is now empty, but Wynaut has fainted and can be revived
		battle.makeChoices('move revivalblessing, move splash', 'auto');
		assert.throws(() => battle.makeChoices('pass', ''), /\[Invalid choice\] Can't pass: You need to choose a fainted Pokémon to revive/);
		battle.makeChoices('switch wynaut', '');
		const wynaut = battle.p1.pokemon.find(pokemon => pokemon.species.id === 'wynaut');
		assert.false(wynaut.fainted);
		assert.equal(wynaut.hp, Math.floor(wynaut.maxhp / 2));
	});

	it(`should revive a fainted Pokemon when the choice is made automatically`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', moves: ['memento'] },
			{ species: 'snorlax', moves: ['splash'] },
			{ species: 'pawmot', moves: ['revivalblessing'] },
		], [
			{ species: 'chansey', moves: ['splash'] },
			{ species: 'blissey', moves: ['splash'] },
		]]);
		battle.makeChoices('move memento 1, move splash', 'auto');
		battle.makeChoices('switch 3, pass', '');
		// The bench is now empty, but Wynaut has fainted and can be revived
		battle.makeChoices('move revivalblessing, move splash', 'auto');
		battle.makeChoices('default', '');
		const wynaut = battle.p1.pokemon.find(pokemon => pokemon.species.id === 'wynaut');
		assert.false(wynaut.fainted);
	});
});
