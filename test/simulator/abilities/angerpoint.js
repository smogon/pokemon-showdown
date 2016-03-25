'use strict';

const assert = require('assert');
let battle;

describe('Anger Point', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should maximize Attack when hit by a critical hit', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Cryogonal", ability: 'noguard', moves: ['frostbreath']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Primeape", ability: 'angerpoint', moves: ['endure']}]);

		battle.commitDecisions();
		assert.strictEqual(battle.p2.pokemon[0].boosts['atk'], 6);
	});

	it('should maximize Attack when hit by a critical hit even if the foe has Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Haxorus", ability: 'moldbreaker', item: 'scopelens', moves: ['focusenergy', 'falseswipe']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Primeape", ability: 'angerpoint', moves: ['defensecurl']}]);

		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.pokemon[0].boosts['atk'], 6);
	});

	it('should not maximize Attack when dealing a critical hit', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Cryogonal", ability: 'noguard', moves: ['endure']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Primeape", ability: 'angerpoint', moves: ['stormthrow']}]);

		battle.commitDecisions();
		assert.strictEqual(battle.p1.pokemon[0].boosts['atk'], 0);
		assert.strictEqual(battle.p2.pokemon[0].boosts['atk'], 0);
	});

	it('should not maximize Attack when behind a substitute', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Cryogonal", ability: 'noguard', item: 'laggingtail', moves: ['frostbreath']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Primeape", ability: 'angerpoint', moves: ['substitute']}]);

		battle.commitDecisions();
		assert.strictEqual(battle.p2.pokemon[0].boosts['atk'], 0);
	});
});