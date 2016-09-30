'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Clear Smog', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should remove all stat boosts from the target', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Amoonguss", ability: 'regenerator', moves: ['clearsmog']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Sableye", ability: 'prankster', moves: ['calmmind']}]);

		battle.commitDecisions();

		assert.strictEqual(battle.p2.pokemon[0].boosts['spa'], 0);
		assert.strictEqual(battle.p2.pokemon[0].boosts['spd'], 0);
	});

	it('should not remove stat boosts from a target behind a substitute', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Amoonguss", ability: 'regenerator', moves: ['clearsmog', 'toxic']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Sableye", ability: 'prankster', moves: ['substitute', 'calmmind']}]);

		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		battle.choose('p2', 'move 2');
		battle.commitDecisions();

		assert.strictEqual(battle.p2.pokemon[0].boosts['spa'], 1);
		assert.strictEqual(battle.p2.pokemon[0].boosts['spd'], 1);
	});

	it('should not remove stat boosts if the target is immune to its attack type', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Amoonguss", ability: 'regenerator', item: 'laggingtail', moves: ['clearsmog']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Steelix", ability: 'prankster', moves: ['irondefense']}]);

		battle.commitDecisions();

		assert.strictEqual(battle.p2.pokemon[0].boosts['def'], 2);
	});

	it('should not remove stat boosts from the user', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Amoonguss", ability: 'regenerator', moves: ['clearsmog']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Arcanine", ability: 'intimidate', moves: ['morningsun']}]);

		battle.commitDecisions();

		assert.strictEqual(battle.p1.pokemon[0].boosts['atk'], -1);
	});

	it('should trigger before Anger Point activates during critical hits', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Amoonguss", ability: 'regenerator', item: 'scopelens', moves: ['focusenergy', 'clearsmog']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Primeape", ability: 'angerpoint', moves: ['bulkup']}]);

		battle.commitDecisions();
		assert.strictEqual(battle.p2.pokemon[0].boosts['atk'], 1);
		assert.strictEqual(battle.p2.pokemon[0].boosts['def'], 1);

		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.pokemon[0].boosts['atk'], 6);
		assert.strictEqual(battle.p2.pokemon[0].boosts['def'], 0);
	});
});
