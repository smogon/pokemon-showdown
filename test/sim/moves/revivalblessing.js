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

	it(`should allow Pursuit to intercept a revived Pokemon's next withdrawal`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'Tyranitar', ability: 'unnerve', moves: ['pursuit', 'sleeptalk'] },
		], [
			{ species: 'Alakazam', moves: ['sleeptalk'] },
			{ species: 'Pawmot', moves: ['revivalblessing', 'sleeptalk'] },
			{ species: 'Blissey', moves: ['sleeptalk'] },
		]]);
		const [alakazam, , blissey] = battle.p2.pokemon;
		alakazam.hp = 1;
		battle.makeChoices('move pursuit', 'switch blissey');
		assert.fainted(alakazam);
		assert.fullHP(blissey);

		battle.makeChoices('', 'switch pawmot');
		battle.makeChoices('move sleeptalk', 'move revivalblessing');
		battle.makeChoices('', 'switch alakazam');
		assert.false.fainted(alakazam);
		battle.makeChoices('move sleeptalk', 'switch alakazam');
		battle.makeChoices('move pursuit', 'switch blissey');
		assert.fainted(alakazam);
		assert.fullHP(blissey);
		assert.equal(battle.p2.requestState, 'switch');
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
});
