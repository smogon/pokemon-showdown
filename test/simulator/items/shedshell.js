'use strict';

const assert = require('assert');
let battle;

describe('Shed Shell', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should allow Pokemon to escape trapping abilities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Gothitelle", ability: 'shadowtag', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Starmie", ability: 'naturalcure', item: 'shedshell', moves: ['recover']},
			{species: "Heatran", ability: 'flashfire', moves: ['rest']},
		]);
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].speciesid, 'heatran');
	});

	it('should allow Pokemon to escape from most moves that would trap them', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Gengar", ability: 'levitate', moves: ['meanlook']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Venusaur", ability: 'overgrow', item: 'shedshell', moves: ['ingrain']},
			{species: "Heatran", ability: 'flashfire', moves: ['rest']},
		]);
		battle.commitDecisions();
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].speciesid, 'heatran');
	});

	it('should not allow Pokemon to escape from Sky Drop', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Dragonite", ability: 'multiscale', moves: ['skydrop']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Magnezone", ability: 'sturdy', item: 'shedshell', moves: ['sleeptalk']},
			{species: "Heatran", ability: 'flashfire', moves: ['rest']},
		]);
		battle.commitDecisions();
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].speciesid, 'magnezone');
	});
});
