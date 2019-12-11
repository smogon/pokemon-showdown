'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Gear Up', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should boost the Attack and Special Attack of all active allies with Plus or Minus', function () {
		battle = common.gen(5).createBattle({gameType: 'triples'});
		battle.setPlayer('p1', {team: [
			{species: "Minun", ability: 'minus', moves: ['sleeptalk']},
			{species: "Klinklang", ability: 'plus', moves: ['gearup']},
			{species: "Pyukumuku", ability: 'innardsout', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Plusle", ability: 'plus', moves: ['sleeptalk']},
			{species: "Klinklang", ability: 'minus', moves: ['gearup']},
			{species: "Pyukumuku", ability: 'innardsout', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move sleeptalk, move gearup, move sleeptalk', 'move sleeptalk, move gearup, move sleeptalk');
		for (const active of battle.getAllActive()) {
			if (active.name === 'Pyukumuku') continue;
			assert.statStage(active, 'atk', 1);
			assert.statStage(active, 'spa', 1);
		}
	});
});
