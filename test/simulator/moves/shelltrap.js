'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shell Trap', function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip('should deduct PP regardless if it was successful', function () {
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

		const cant = '|cant|p1a: Turtonator|Shell Trap|Shell Trap';
		assert.strictEqual(battle.log.filter(m => m === cant).length, 1);

		battle.makeChoices('move shelltrap, move splash', 'move tackle, move splash');
		assert.strictEqual(move.pp, move.maxpp - 2);
	});
});
