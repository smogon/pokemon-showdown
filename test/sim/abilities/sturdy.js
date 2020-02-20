'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sturdy', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should give the user an immunity to OHKO moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Aron', level: 1, ability: 'sturdy', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: 'Kyogre', ability: 'noguard', moves: ['sheercold']}]});
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices('move sleeptalk', 'move sheercold'));
	});

	it('should allow its user to survive an attack from full HP', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Paras', ability: 'sturdy', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: 'Charizard', ability: 'drought', moves: ['fusionflare']}]});
		battle.makeChoices('move sleeptalk', 'move fusionflare');
		assert.equal(battle.p1.active[0].hp, 1);
	});

	it('should allow its user to survive a confusion damage hit from full HP', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Shedinja', ability: 'sturdy', moves: ['absorb']}]});
		battle.setPlayer('p2', {team: [{species: 'Klefki', ability: 'prankster', moves: ['confuseray']}]});
		battle.makeChoices('move absorb', 'move confuseray');
		assert.equal(battle.p1.active[0].hp, 1);
	});

	it('should not trigger on recoil damage', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Shedinja', ability: 'sturdy', moves: ['doubleedge']}]});
		battle.setPlayer('p2', {team: [{species: 'Klefki', ability: 'prankster', moves: ['reflect']}]});
		battle.makeChoices('move doubleedge', 'move reflect');
		assert.fainted(battle.p1.active[0]);
	});

	it('should not trigger on residual damage', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Shedinja', ability: 'sturdy', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: 'Crobat', ability: 'infiltrator', moves: ['toxic']}]});
		battle.makeChoices('move sleeptalk', 'move toxic');
		assert.fainted(battle.p1.active[0]);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Paras', ability: 'sturdy', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: 'Reshiram', ability: 'turboblaze', moves: ['fusionflare']}]});
		battle.makeChoices('move sleeptalk', 'move fusionflare');
		assert.fainted(battle.p1.active[0]);
	});
});
