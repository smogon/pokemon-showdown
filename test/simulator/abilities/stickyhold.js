'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

const STEAL_MOVES = ['thief', 'knockoff', 'switcheroo', 'bugbite'];

describe('Sticky Hold', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent held items from being stolen by most moves or abilities', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Shuckle', ability: 'stickyhold', item: 'razzberry', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Fennekin', ability: 'magician', moves: ['grassknot']},
			{species: 'Smeargle', ability: 'synchronize', moves: STEAL_MOVES},
		]);
		const itemHolder = battle.p1.active[0];
		battle.commitDecisions();
		assert.strictEqual(itemHolder.item, 'razzberry', "Shuckle should hold a Razz Berry");
		battle.p2.chooseSwitch(2).foe.chooseDefault();

		STEAL_MOVES.forEach(moveid => {
			battle.p2.chooseMove(moveid).foe.chooseDefault();
			assert.holdsItem(itemHolder, "Shuckle should still hold its Razz Berry");
		});
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pangoro', ability: 'moldbreaker', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Shuckle', ability: 'stickyhold', item: 'ironball', moves: ['rest']}]);
		battle.commitDecisions();
		assert.false.holdsItem(battle.p2.active[0]);
	});
});
