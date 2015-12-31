'use strict';

const assert = require('assert');
let battle;

describe('Shadow Tag', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent most Pokemon from switching out normally', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Tornadus", ability: 'defiant', moves: ['tailwind']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]);
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'tornadus');
	});

	it('should not prevent Pokemon from switching out using moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Tornadus", ability: 'defiant', moves: ['uturn']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]);
		battle.commitDecisions();
		battle.choose('p2', 'switch 2');
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'heatran');
	});

	it('should not prevent other Pokemon with Shadow Tag from switching out', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Gothitelle", ability: 'shadowtag', moves: ['psychic']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]);
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'heatran');
	});

	it('should not prevent Pokemon immune to trapping from switching out', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Gengar", ability: 'levitate', moves: ['curse']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]);
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'heatran');
	});
});
