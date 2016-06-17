'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Anger Point', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should maximize Attack when hit by a critical hit', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Cryogonal", ability: 'noguard', moves: ['frostbreath']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: "Primeape", ability: 'angerpoint', moves: ['endure']}]);

		battle.commitDecisions();
		assert.statStage(p2.active[0], 'atk', 6);
	});

	it('should maximize Attack when hit by a critical hit even if the foe has Mold Breaker', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Haxorus", ability: 'moldbreaker', item: 'scopelens', moves: ['focusenergy', 'falseswipe']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: "Primeape", ability: 'angerpoint', moves: ['defensecurl']}]);

		battle.commitDecisions();
		p1.chooseMove(2).foe.chooseMove(1);
		assert.statStage(p2.active[0], 'atk', 6);
	});

	it('should not maximize Attack when dealing a critical hit', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Cryogonal", ability: 'noguard', moves: ['endure']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: "Primeape", ability: 'angerpoint', moves: ['stormthrow']}]);

		battle.commitDecisions();
		assert.statStage(p1.active[0], 'atk', 0);
		assert.statStage(p2.active[0], 'atk', 0);
	});

	it('should not maximize Attack when behind a substitute', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Cryogonal", ability: 'noguard', item: 'laggingtail', moves: ['frostbreath']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: "Primeape", ability: 'angerpoint', moves: ['substitute']}]);

		battle.commitDecisions();
		assert.statStage(p2.active[0], 'atk', 0);
	});
});
