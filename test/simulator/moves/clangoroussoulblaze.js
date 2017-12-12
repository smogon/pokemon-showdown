'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Z-Moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should deal reduced damage to only protected targets`, function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Kommo-o', ability: 'overcoat', item: 'kommoniumz', moves: ['clangingscales']},
			{species: 'Pachirisu', ability: 'voltabsorb', moves: ['protect']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Tapu Lele', ability: 'psychicsurge', moves: ['protect']},
			{species: 'Zapdos', ability: 'pressure', moves: ['tailwind']},
		]);
		battle.makeChoices("move clangingscales zmove, move protect", "move protect, move tailwind");
		assert.false.fainted(battle.p2.active[1]);
		assert.false.fullHP(battle.p2.active[1]);
	});
});
