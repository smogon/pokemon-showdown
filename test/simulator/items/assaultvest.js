'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Assault Vest', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should disable the use of Status moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Abra', ability: 'synchronize', moves: ['teleport']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', item: 'assaultvest', moves: ['teleport']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].lastMove, 'struggle');
	});

	it('should not prevent the use of Status moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Lopunny', ability: 'klutz', item: 'assaultvest', moves: ['trick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', item: 'ironball', moves: ['calmmind']}]);
		battle.commitDecisions();
		assert.statStage(battle.p2.active[0], 'spa', 1);
		assert.statStage(battle.p2.active[0], 'spd', 1);
	});
});
