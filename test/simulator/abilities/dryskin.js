'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Dry Skin', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should take 1/8 max HP every turn that Sunny Day is active', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: 'Toxicroak', ability: 'dryskin', moves: ['bulkup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Ninetales', ability: 'flashfire', moves: ['sunnyday']}]);
		assert.hurtsBy(p1.active[0], Math.floor(p1.active[0].maxhp / 8), () => battle.commitDecisions());
	});

	it('should heal 1/8 max HP every turn that Rain Dance is active', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: 'Toxicroak', ability: 'dryskin', moves: ['substitute']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: 'Politoed', ability: 'damp', moves: ['encore', 'raindance']}]);
		battle.commitDecisions();
		p2.chooseMove('raindance');
		assert.hurtsBy(p1.active[0], -Math.floor(p1.active[0].maxhp / 8), () => battle.commitDecisions());
	});

	it('should grant immunity to Water-type moves and heal 1/4 max HP', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Toxicroak', ability: 'dryskin', moves: ['substitute']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Politoed', ability: 'damp', moves: ['watergun']}]);
		battle.commitDecisions();
		assert.fullHP(battle.p1.active[0]);
	});

	it('should cause the user to take 1.25x damage from Fire-type attacks', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Toxicroak', ability: 'dryskin', moves: ['bulkup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'unnerve', moves: ['incinerate']}]);
		battle.commitDecisions();
		let damage = battle.p1.active[0].maxhp - battle.p1.active[0].hp;
		assert.bounded(damage, [51, 61]);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Toxicroak', ability: 'dryskin', moves: ['bulkup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['incinerate', 'surf']}]);
		battle.commitDecisions();
		const target = battle.p1.active[0];
		const damage = target.maxhp - target.hp;
		assert.bounded(damage, [41, 49]);
		battle.p2.chooseMove('surf');
		assert.hurts(target, () => battle.commitDecisions());
	});
});
