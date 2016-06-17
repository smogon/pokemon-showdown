'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Contrary', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should invert relative stat changes', function () {
		this.timeout(0);
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Spinda", ability: 'contrary', moves: ['superpower']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dragonite", ability: 'multiscale', moves: ['dragondance']}]);
		battle.commitDecisions();
		assert.statStage(p1.active[0], 'atk', 1);
		assert.statStage(p1.active[0], 'def', 1);
	});

	it('should not invert absolute stat changes', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Serperior", ability: 'contrary', moves: ['leechseed']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Growlithe", ability: 'intimidate', moves: ['topsyturvy']}]);
		battle.commitDecisions();
		assert.statStage(p1.active[0], 'atk', -1);
	});

	it('should invert Belly Drum\'s maximizing Attack', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Spinda", ability: 'contrary', moves: ['bellydrum']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dragonite", ability: 'multiscale', moves: ['dragondance']}]);
		battle.commitDecisions();
		assert.statStage(p1.active[0], 'atk', -6);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Spinda", ability: 'contrary', moves: ['tackle']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dragonite", ability: 'moldbreaker', moves: ['growl']}]);
		battle.commitDecisions();
		assert.statStage(p1.active[0], 'atk', -1);
	});
});
