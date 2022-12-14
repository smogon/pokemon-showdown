'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Magnetic Flux', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should boost the Defense and Special Defense of all active allies with Plus or Minus', function () {
		battle = common.gen(5).createBattle({gameType: 'triples'});
		battle.setPlayer('p1', {team: [
			{species: "Minun", ability: 'minus', moves: ['sleeptalk']},
			{species: "Klinklang", ability: 'plus', moves: ['magneticflux']},
			{species: "Pyukumuku", ability: 'innardsout', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Plusle", ability: 'plus', moves: ['sleeptalk']},
			{species: "Klinklang", ability: 'minus', moves: ['magneticflux']},
			{species: "Pyukumuku", ability: 'innardsout', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move sleeptalk, move magneticflux, move sleeptalk', 'move sleeptalk, move magneticflux, move sleeptalk');
		for (const active of battle.getAllActive()) {
			if (active.name === 'Pyukumuku') continue;
			assert.statStage(active, 'def', 1);
			assert.statStage(active, 'spd', 1);
		}
	});
});
