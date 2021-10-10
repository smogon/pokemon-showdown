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
		assert.equal(battle.requestState, 'switch');
	});

	it(`should switch out the holder after Moody's stat drop`, function () {
		battle = common.createBattle([[
			{species: 'Glalie', ability: 'moody', item: 'ejectpack', moves: ['protect']},
			{species: 'Mew', moves: ['protect']},
		], [
			{species: 'Mew', moves: ['protect']},
		]]);
		battle.makeChoices();
		assert.equal(battle.requestState, 'switch');
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

	it.skip(`should only trigger the fastest Eject Pack when multiple targets with Eject Pack have stats lowered`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Hydreigon', moves: ['leer']},
			{species: 'Wynaut', moves: ['sleeptalk']},
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

	it.skip(`should not trigger until after all entrance abilities have resolved during simultaneous switches`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Hydreigon', ability: 'intimidate', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Morelull', ability: 'drought', item: 'ejectpack', moves: ['sleeptalk']},
			{species: 'Mew', level: 1, ability: 'electricsurge', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
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
