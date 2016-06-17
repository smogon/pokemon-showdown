'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Flash Fire', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should grant immunity to Fire-type moves and increase Fire-type attacks by 50% once activated', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: 'Heatran', ability: 'flashfire', moves: ['incinerate']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: 'Talonflame', ability: 'galewings', moves: ['flareblitz']}]);
		battle.commitDecisions();
		assert.fullHP(p1.active[0]);
		let damage = p2.active[0].maxhp - p2.active[0].hp;
		assert.bounded(damage, [82, 97]);
	});

	it('should grant Fire-type immunity even if the user is frozen', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Talonflame', ability: 'galewings', moves: ['flareblitz']}]);
		p1.active[0].setStatus('frz');
		assert.false.hurts(p1.active[0], () => battle.commitDecisions());
	});

	it('should have its Fire-type immunity suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Heatran', ability: 'flashfire', moves: ['incinerate']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['firepunch']}]);
		assert.hurts(battle.p1.active[0], () => battle.commitDecisions());
	});

	it('should lose the Flash Fire boost if its ability is changed', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk', 'incinerate']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: 'Talonflame', ability: 'galewings', moves: ['incinerate', 'worryseed']}]);
		battle.commitDecisions();
		battle.seed = battle.startingSeed.slice();
		p2.chooseMove('worryseed').foe.chooseMove('incinerate');
		let damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.bounded(damage, [54, 65]);
	});
});

describe('Flash Fire [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	// TODO: Check if this is actually a behavior in Gen 3-4
	it.skip('should grant Fire-type immunity even if the user is frozen', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Charizard', ability: 'blaze', moves: ['flamethrower']}]);
		p1.active[0].setStatus('frz');
		assert.false.hurts(p1.active[0], () => battle.commitDecisions());
	});
});
