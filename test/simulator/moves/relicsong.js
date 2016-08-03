'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Relic Song', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should transform Meloetta into its Pirouette forme', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Meloetta", ability: 'serenegrace', moves: ['relicsong']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Registeel", ability: 'clearbody', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].template.speciesid, 'meloettapirouette');
	});

	it('should transform Meloetta-Pirouette into its Aria forme', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Meloetta-Pirouette", ability: 'serenegrace', moves: ['relicsong']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Registeel", ability: 'clearbody', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].template.speciesid, 'meloetta');
	});

	it('should pierce through substitutes', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'relicsong']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p2.active[0].item, '');
	});
});

describe('Relic Song [Gen 5]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not pierce through substitutes', function () {
		battle = common.gen(5).createBattle([
			[{species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'relicsong']}],
			[{species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest']}],
		]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p2.active[0].item, 'focussash');
	});

	it('should transform Meloetta into its Pirouette forme even if it hits a substitute', function () {
		battle = common.createBattle([
			[{species: "Meloetta", ability: 'serenegrace', moves: ['relicsong']}],
			[{species: "Registeel", ability: 'prankster', moves: ['substitute']}],
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].template.speciesid, 'meloettapirouette');
	});
});
