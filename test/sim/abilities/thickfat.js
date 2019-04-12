'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Thick Fat', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should halve damage from Fire- or Ice-type attacks', function () {
		// calls to resetRNG are to avoid crits
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Hariyama", ability: 'thickfat', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: "Nidoking", ability: 'sheerforce', moves: ['incinerate', 'icebeam']}]});
		const target = battle.p1.active[0];
		// should not crit
		battle.makeChoices('move splash', 'move incinerate');
		assert.bounded(target.maxhp - target.hp, [29, 35]);
		battle.heal(target.maxhp, target, target, battle.getFormat());
		battle.resetRNG();
		// should not crit
		battle.makeChoices('move splash', 'move icebeam');
		assert.bounded(target.maxhp - target.hp, [56, 66]);
	});

	it('should be suppressed by Mold Breaker', function () {
		// calls to resetRNG are to avoid crits
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Hariyama", ability: 'thickfat', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: "Nidoking", ability: 'moldbreaker', moves: ['incinerate', 'icebeam']}]});
		const target = battle.p1.active[0];
		// should not crit
		battle.makeChoices('move splash', 'move incinerate');
		assert.bounded(target.maxhp - target.hp, [57, 68]);
		battle.heal(target.maxhp, target, target, battle.getFormat());
		battle.resetRNG();
		// should not crit
		battle.makeChoices('move splash', 'move icebeam');
		assert.bounded(target.maxhp - target.hp, [85, 101]);
	});
});
