'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Room Service', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should activate when Trick Room is set`, function () {
		battle = common.createBattle([[
			{species: 'slowpoke', item: 'roomservice', moves: ['sleeptalk']},
		], [
			{species: 'whimsicott', item: 'roomservice', moves: ['trickroom']},
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'spe', -1);
		assert.statStage(battle.p2.active[0], 'spe', -1);
	});

	it(`should activate after entrance Abilities`, function () {
		battle = common.createBattle([[
			{species: 'slowpoke', moves: ['teleport']},
			{species: 'ditto', ability: 'imposter', item: 'roomservice', moves: ['transform']},
		], [
			{species: 'whimsicott', ability: 'prankster', moves: ['trickroom']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'spe', -1, `Ditto-Whimsicott should be at -1 Speed after transforming`);
	});
});
