'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Fell Stringer', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should get a boost when KOing a Pokemon after redirection', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'joltik', moves: ['fellstinger']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'pichu', level: 1, moves: ['followme']},
		]]);
		battle.makeChoices("move fellstinger 1, move sleeptalk", "move sleeptalk, move followme");
		assert.statStage(battle.p1.active[0], 'atk', 3);
	});
});
