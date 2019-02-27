'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shell Trap', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deduct PP regardless if it was successful', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[
				{species: 'Turtonator', ability: 'shellarmor', moves: ['shelltrap']},
				{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			],
			[
				{species: 'Turtonator', ability: 'shellarmor', moves: ['tackle', 'irondefense']},
				{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			],
		]);

		const move = battle.p1.active[0].getMoveData(Dex.getMove('shelltrap'));
		battle.makeChoices('move shelltrap, move splash', 'move irondefense, move splash');
		assert.strictEqual(move.pp, move.maxpp - 1);
		battle.makeChoices('move shelltrap, move splash', 'move tackle, move splash');
		assert.strictEqual(move.pp, move.maxpp - 2);

		assert.bounded(battle.p2.active[0].maxhp - battle.p2.active[0].hp, [31, 37]);
	});
});
