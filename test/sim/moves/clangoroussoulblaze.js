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
		battle.setPlayer('p1', {team: [
			{species: 'Kommo-o', ability: 'overcoat', item: 'kommoniumz', moves: ['clangingscales']},
			{species: 'Pachirisu', ability: 'voltabsorb', moves: ['protect']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Turtonator', ability: 'shellarmor', moves: ['protect']},
			{species: 'Turtonator', ability: 'shellarmor', moves: ['sleeptalk']},
		]});
		battle.makeChoices("move clangingscales zmove, move protect", "move protect, move sleeptalk");
		assert.false.fullHP(battle.p2.active[0]);
		assert.false.fainted(battle.p2.active[0]);
		assert.fainted(battle.p2.active[1]);
	});
});
