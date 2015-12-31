'use strict';

const assert = require('assert');
let battle;

describe('Magnet Pull', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent Steel-type Pokemon from switching out normally', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Magnezone", ability: 'magnetpull', moves: ['soak', 'charge']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Heatran", ability: 'flashfire', moves: ['curse']},
			{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
		]);
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'heatran');
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
		battle.choose('p1', 'move 2');
		battle.commitDecisions(); // Reflect Type makes Starmie part Steel
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
	});

	it('should not prevent Steel-type Pokemon from switching out using moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Magnezone", ability: 'magnetpull', moves: ['toxic']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Heatran", ability: 'flashfire', moves: ['batonpass']},
			{species: "Tentacruel", ability: 'clearbody', moves: ['rapidspin']},
		]);
		battle.commitDecisions();
		battle.choose('p2', 'switch 2');
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'tentacruel');
	});

	it('should not prevent Pokemon immune to trapping from switching out', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Magnezone", ability: 'magnetpull', moves: ['substitute']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Aegislash", ability: 'stancechange', moves: ['swordsdance']},
			{species: "Arcanine", ability: 'flashfire', moves: ['roar']},
		]);
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'arcanine');
	});
});
