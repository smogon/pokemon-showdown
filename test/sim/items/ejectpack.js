'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Eject Pack`, () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should switch out the holder when its stats are lowered`, () => {
		battle = common.createBattle([[
			{ species: 'Magikarp', item: 'ejectpack', moves: ['splash'] },
			{ species: 'Mew', moves: ['splash'] },
		], [
			{ species: 'Machop', moves: ['leer'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.requestState, 'switch');
	});

	it(`should switch out the holder after Moody's stat drop`, () => {
		battle = common.createBattle([[
			{ species: 'Glalie', ability: 'moody', item: 'ejectpack', moves: ['protect'] },
			{ species: 'Mew', moves: ['protect'] },
		], [
			{ species: 'Mew', moves: ['protect'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.requestState, 'switch');
	});

	it(`should not switch the holder out if the move was Parting Shot and the opponent could switch`, () => {
		battle = common.createBattle([[
			{ species: 'Wynaut', item: 'ejectpack', moves: ['sleeptalk'] },
			{ species: 'Mew', moves: ['sleeptalk'] },
		], [
			{ species: 'Mew', moves: ['partingshot'] },
			{ species: 'Muk', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.false.equal(battle.p1.requestState, 'switch');
		assert.equal(battle.p2.requestState, 'switch');
	});

	it(`should switch out the holder if its stats are lowered during the semi-invulnerable state`, () => {
		battle = common.createBattle([[
			{ species: 'Charmeleon', item: 'ejectpack', moves: ['phantomforce'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Wynaut', ability: 'noguard', moves: ['growl'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.requestState, 'switch');
	});

	it(`should switch out the holder if its stats are lowered after using Swallow`, () => {
		battle = common.createBattle([[
			{ species: 'Charmeleon', item: 'ejectpack', moves: ['stockpile', 'swallow'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Wynaut', moves: ['tackle'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('move swallow', 'auto');
		assert.equal(battle.p1.requestState, 'switch');
	});

	it(`should not switch out the user if the user acquired the Eject Pack after the stat drop occurred`, () => {
		battle = common.createBattle([[
			{ species: 'Klefki', ability: 'magician', moves: ['lowsweep'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Grimmsnarl', ability: 'pickpocket', item: 'cheriberry', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.false.equal(battle.requestState, 'switch');
	});

	it(`should wait until after all other end-turn effects have resolved before switching out the holder`, () => {
		battle = common.createBattle([[
			{ species: 'Glalie', item: 'ejectpack', ability: 'moody', moves: ['icebeam'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Zygarde', item: 'focussash', ability: 'powerconstruct', moves: ['octolock'] },
		]]);
		battle.makeChoices();
		assert.species(battle.p2.active[0], 'Zygarde-Complete', 'Eject Pack should not activate before Power Construct');
		const hasBoost = Object.values(battle.p1.active[0].boosts).some(stage => stage > 0);
		assert(hasBoost, 'Boost from Moody should be applied before switch');
	});

	it(`should not activate when another switching effect was triggered as part of the move`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Hydreigon', moves: ['breakingswipe'] },
			{ species: 'Horsea', moves: ['sleeptalk'] },
		], [
			{ species: 'Zeraora', item: 'ejectpack', moves: ['sleeptalk'] },
			{ species: 'Mew', item: 'ejectbutton', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.statStage(battle.p2.active[1], 'atk', -1, "Attack should be dropped before switching.");
		battle.makeChoices();
		assert.species(battle.p2.active[0], 'Zeraora', `Zeraora should not have switched out with its Eject Pack.`);
		assert.species(battle.p2.active[1], 'Wynaut', `Mew should have switched out with its Eject Button.`);
	});

	it(`should only trigger the fastest Eject Pack when multiple targets with Eject Pack have stats lowered`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Hydreigon', moves: ['leer'] },
			{ species: 'Horsea', moves: ['sleeptalk'] },
		], [
			{ species: 'Morelull', item: 'ejectpack', moves: ['sleeptalk'] },
			{ species: 'Mew', item: 'ejectpack', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		battle.makeChoices();
		assert.species(battle.p2.active[0], 'Morelull');
		assert.species(battle.p2.active[1], 'Wynaut');
	});

	it(`should not prevent entrance Abilities from resolving during simultaneous switches`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Hydreigon', ability: 'intimidate', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Morelull', ability: 'drought', item: 'ejectpack', moves: ['sleeptalk'] },
			{ species: 'Mew', level: 1, ability: 'electricsurge', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		assert(battle.field.isWeather('sunnyday'));
		assert(battle.field.isTerrain('electricterrain'));
		assert.equal(battle.p2.requestState, 'switch');
	});

	it.skip(`should not prohibit switchins if a switch has already resolved to a slot replaced by Eject Pack`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Pheromosa', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
			{ species: 'Incineroar', ability: 'intimidate', moves: ['sleeptalk'] },
		], [
			{ species: 'Morelull', item: 'ejectpack', moves: ['sleeptalk'] },
			{ species: 'Mew', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('switch 3, move sleeptalk', 'move sleeptalk, switch 3');
		assert.species(battle.p2.active[1], 'Mew');
		battle.makeChoices();
		assert.species(battle.p2.active[0], 'Wynaut');
		assert.species(battle.p2.active[1], 'Morelull');
	});

	it(`Should be able to switch back in if ejected`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Typhlosion', moves: ['eruption'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Smeargle', ability: 'moody', moves: ['protect'], item: 'ejectpack' },
			{ species: 'Shedinja', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		// Eruption
		battle.makeChoices();
		// Switch Smeargle -> Wynaut
		battle.makeChoices();
		// Switch Shedinja -> Smeargle
		battle.makeChoices();
		assert.species(battle.p2.active[0], 'Wynaut', 'Should be switched in by eject pack');
		assert.species(battle.p2.active[1], 'Smeargle', 'Should be switched in by Shedinja fainting');
	});
});
