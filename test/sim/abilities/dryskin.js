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
		battle.setPlayer('p1', {team: [{species: 'Toxicroak', ability: 'dryskin', moves: ['bulkup']}]});
		battle.setPlayer('p2', {team: [{species: 'Ninetales', ability: 'flashfire', moves: ['sunnyday']}]});
		const dryMon = battle.p1.active[0];
		assert.hurtsBy(dryMon, Math.floor(dryMon.maxhp / 8), () => battle.makeChoices('move bulkup', 'move sunnyday'));
	});

	it('should heal 1/8 max HP every turn that Rain Dance is active', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Toxicroak', ability: 'dryskin', moves: ['substitute']}]});
		battle.setPlayer('p2', {team: [{species: 'Politoed', ability: 'damp', moves: ['encore', 'raindance']}]});
		const dryMon = battle.p1.active[0];
		battle.makeChoices('move substitute', 'move encore');
		assert.hurtsBy(dryMon, -Math.floor(dryMon.maxhp / 8), () => battle.makeChoices('move substitute', 'move raindance'));
	});

	it('should grant immunity to Water-type moves and heal 1/4 max HP', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Toxicroak', ability: 'dryskin', moves: ['substitute']}]});
		battle.setPlayer('p2', {team: [{species: 'Politoed', ability: 'damp', moves: ['watergun']}]});
		battle.makeChoices('move substitute', 'move watergun');
		assert.fullHP(battle.p1.active[0]);
	});

	it('should cause the user to take 1.25x damage from Fire-type attacks', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Toxicroak', ability: 'dryskin', moves: ['bulkup']}]});
		battle.setPlayer('p2', {team: [{species: 'Haxorus', ability: 'unnerve', moves: ['incinerate']}]});
		battle.makeChoices('move bulkup', 'move incinerate');
		let damage = battle.p1.active[0].maxhp - battle.p1.active[0].hp;
		assert.bounded(damage, [51, 61]);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Toxicroak', ability: 'dryskin', moves: ['bulkup']}]});
		battle.setPlayer('p2', {team: [{species: 'Haxorus', ability: 'moldbreaker', moves: ['incinerate', 'surf']}]});
		battle.makeChoices('move bulkup', 'move incinerate');
		const target = battle.p1.active[0];
		const damage = target.maxhp - target.hp;
		assert.bounded(damage, [41, 49]);
		assert.hurts(target, () => battle.makeChoices('move bulkup', 'move surf'));
	});
});
