'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Eject Pack`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should switch out the holder when its stats are lowered`, function () {
		battle = common.createBattle([[
			{species: 'Magikarp', item: 'ejectpack', moves: ['splash']},
			{species: 'Mew', moves: ['splash']},
		], [
			{species: 'Machop', moves: ['leer']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.requestState, 'switch');
	});

	it(`should switch out the holder after Moody's stat drop`, function () {
		battle = common.createBattle([[
			{species: 'Glalie', ability: 'moody', item: 'ejectpack', moves: ['protect']},
			{species: 'Mew', moves: ['protect']},
		], [
			{species: 'Mew', moves: ['protect']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.requestState, 'switch');
	});

	it(`should not switch the holder out if the move was Parting Shot and the opponent could switch`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', item: 'ejectpack', moves: ['sleeptalk']},
			{species: 'Mew', moves: ['sleeptalk']},
		], [
			{species: 'Mew', moves: ['partingshot']},
			{species: 'Muk', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.false.equal(battle.p1.requestState, 'switch');
		assert.equal(battle.p2.requestState, 'switch');
	});

	it(`should switch out the holder if its stats are lowered during the semi-invulnerable state`, function () {
		battle = common.createBattle([[
			{species: 'Charmeleon', item: 'ejectpack', moves: ['phantomforce']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', ability: 'noguard', moves: ['growl']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.requestState, 'switch');
	});

	it(`should switch out the holder if its stats are lowered after using Swallow`, function () {
		battle = common.createBattle([[
			{species: 'Charmeleon', item: 'ejectpack', moves: ['stockpile', 'swallow']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', moves: ['tackle']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move swallow', 'auto');
		assert.equal(battle.p1.requestState, 'switch');
	});

	it(`should not switch out the user if the user acquired the Eject Pack after the stat drop occurred`, function () {
		battle = common.createBattle([[
			{species: 'Klefki', ability: 'magician', moves: ['lowsweep']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Grimmsnarl', ability: 'pickpocket', item: 'cheriberry', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.false.equal(battle.requestState, 'switch');
	});

	it.skip(`should wait until after all other end-turn effects have resolved before switching out the holder`, function () {
		battle = common.createBattle([[
			{species: 'Glalie', item: 'ejectpack', ability: 'moody', moves: ['icebeam']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Zygarde', item: 'focussash', ability: 'powerconstruct', moves: ['octolock']},
		]]);
		battle.makeChoices();
		const log = battle.getDebugLog();
		const moodyIndex = log.lastIndexOf('|-ability|p1a: Glalie|Moody|boost');
		const powerConstructIndex = log.lastIndexOf('|-activate|p2a: Zygarde|ability: Power Construct');
		const ejectPackIndex = log.lastIndexOf('|-enditem|p1a: Glalie|Eject Pack');
		assert(moodyIndex < ejectPackIndex, 'Eject Pack should not activate before Moody');
		assert(powerConstructIndex < ejectPackIndex, 'Eject Pack should not activate before Power Construct');
	});

	it.skip(`should not activate when another switching effect was triggered as part of the move`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Hydreigon', moves: ['breakingswipe']},
			{species: 'Horsea', moves: ['sleeptalk']},
		], [
			{species: 'Zeraora', item: 'ejectpack', moves: ['sleeptalk']},
			{species: 'Mew', item: 'ejectbutton', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		assert.species(battle.p2.active[0], 'Zeraora', `Zeraora should not have switched out with its Eject Pack.`);
		assert.species(battle.p2.active[1], 'Wynaut', `Mew should have switched out with its Eject Button.`);
	});

	it.skip(`should only trigger the fastest Eject Pack when multiple targets with Eject Pack have stats lowered`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Hydreigon', moves: ['leer']},
			{species: 'Horsea', moves: ['sleeptalk']},
		], [
			{species: 'Morelull', item: 'ejectpack', moves: ['sleeptalk']},
			{species: 'Mew', item: 'ejectpack', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		assert.species(battle.p2.active[0], 'Morelull');
		assert.species(battle.p2.active[1], 'Wynaut');
	});

	it(`should not prevent entrance Abilities from resolving during simultaneous switches`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Hydreigon', ability: 'intimidate', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Morelull', ability: 'drought', item: 'ejectpack', moves: ['sleeptalk']},
			{species: 'Mew', level: 1, ability: 'electricsurge', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);
		assert(battle.field.isWeather('sunnyday'));
		assert(battle.field.isTerrain('electricterrain'));
		assert.equal(battle.p2.requestState, 'switch');
	});

	it.skip(`should not prohibit switchins if a switch has already resolved to a slot replaced by Eject Pack`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Pheromosa', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Incineroar', ability: 'intimidate', moves: ['sleeptalk']},
		], [
			{species: 'Morelull', item: 'ejectpack', moves: ['sleeptalk']},
			{species: 'Mew', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('switch 3, move sleeptalk', 'move sleeptalk, switch 3');
		battle.makeChoices();
		assert.species(battle.p2.active[0], 'Wynaut');
		assert.species(battle.p2.active[0], 'Morelull');
	});
});
