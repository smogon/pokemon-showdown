'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Disable', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent the use of the target\'s last move', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Abra', ability: 'synchronize', item: 'laggingtail', moves: ['disable']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', moves: ['teleport']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].lastMove, 'struggle');
	});
});
