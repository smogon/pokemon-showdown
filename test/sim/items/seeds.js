'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Seeds', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should activate even on a double-switch-in`, function () {
		battle = common.createBattle([[
			{species: 'Tapu Koko', ability: 'electricsurge', item: 'grassyseed', moves: ['protect']},
		], [
			{species: 'Tapu Bulu', ability: 'grassysurge', item: 'electricseed', moves: ['protect']},
		]]);
		assert.false.holdsItem(battle.p1.active[0]);
		assert.false.holdsItem(battle.p2.active[0]);
	});

	it(`should not activate when Magic Room ends`, function () {
		battle = common.createBattle([[
			{species: 'Tapu Koko', ability: 'electricsurge', moves: ['protect']},
			{species: 'Hawlucha', item: 'electricseed', moves: ['protect']},
		], [
			{species: 'Alakazam', moves: ['magicroom']},
		]]);
		battle.makeChoices('move protect', 'move magicroom');
		battle.makeChoices('switch 2', 'move magicroom');
		assert.holdsItem(battle.p1.active[0]);
	});

	it.skip(`should activate on switching in after other entrance Abilities, at the same time as Primal reversion`, function () {
		battle = common.createBattle([[
			{species: 'Tapu Koko', ability: 'electricsurge', moves: ['finalgambit']},
			{species: 'Groudon', ability: 'drought', item: 'redorb', moves: ['sleeptalk']},
		], [
			{species: 'Bounsweet', moves: ['sleeptalk']},
			{species: 'Shuckle', item: 'electricseed', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		const redOrbIndex = log.indexOf('Groudon-Primal');
		const electricSeedIndex = log.indexOf('Electric Seed');
		assert(redOrbIndex < electricSeedIndex, 'Groudon should undergo Primal Reversion first, then Electric Seed should activate, because Groudon is faster.');
	});
});
