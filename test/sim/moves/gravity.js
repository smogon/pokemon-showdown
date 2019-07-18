'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Gravity', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should ground Flying-type Pokemon and remove their Ground immunity', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Aerodactyl', ability: 'pressure', moves: ['gravity']}]});
		battle.setPlayer('p2', {team: [{species: 'Aron', ability: 'sturdy', moves: ['earthpower']}]});
		battle.makeChoices('move gravity', 'move earthpower');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should ground Pokemon with Levitate and remove their Ground immunity', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Rotom', ability: 'levitate', moves: ['gravity']}]});
		battle.setPlayer('p2', {team: [{species: 'Aron', ability: 'sturdy', moves: ['earthpower']}]});
		battle.makeChoices('move gravity', 'move earthpower');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should interrupt and disable the use of airborne moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Spiritomb', ability: 'pressure', moves: ['gravity']}]});
		battle.setPlayer('p2', {team: [{species: 'Aerodactyl', ability: 'pressure', moves: ['fly']}]});
		battle.makeChoices('move gravity', 'move fly');
		assert.ok(!battle.p2.active[0].volatiles['twoturnmove']);
		assert.cantMove(() => battle.makeChoices('move gravity', 'move fly'), 'Aerodactyl', 'Fly');
	});
});
