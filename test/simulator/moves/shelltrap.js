'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shell Trap', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deduct PP regardless if it was successful', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Turtonator', ability: 'shellarmor', moves: ['shelltrap']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Turtonator', ability: 'shellarmor', moves: ['tackle', 'irondefense']}]);

		const move = battle.p1.active[0].getMoveData(Dex.getMove('shelltrap'));
		battle.makeChoices('move shelltrap', 'move irondefense');
		assert.strictEqual(move.pp, move.maxpp - 1);
		battle.makeChoices('move shelltrap', 'move tackle');
		assert.strictEqual(move.pp, move.maxpp - 2);
	});
});
