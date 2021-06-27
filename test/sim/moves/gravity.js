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
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should ground Pokemon with Levitate and remove their Ground immunity', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Rotom', ability: 'levitate', moves: ['gravity']}]});
		battle.setPlayer('p2', {team: [{species: 'Aron', ability: 'sturdy', moves: ['earthpower']}]});
		battle.makeChoices('move gravity', 'move earthpower');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should interrupt and disable the use of airborne moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Spiritomb', ability: 'pressure', moves: ['gravity']}]});
		battle.setPlayer('p2', {team: [{species: 'Aerodactyl', ability: 'pressure', moves: ['fly']}]});
		battle.makeChoices('move gravity', 'move fly');
		assert(!battle.p2.active[0].volatiles['twoturnmove']);
		assert.cantMove(() => battle.makeChoices('move gravity', 'move fly'), 'Aerodactyl', 'Fly');
	});

	it('should allow the use of Z-moves of Gravity-blocked moves, but only apply their Z-effects', function () {
		battle = common.gen(7).createBattle([[
			{species: "Magikarp", ability: 'protean', item: 'normaliumz', moves: ['splash', 'sleeptalk']},
		], [
			{species: "Accelgor", moves: ['gravity']},
		]]);

		battle.makeChoices('move splash zmove', 'move gravity');
		assert.statStage(battle.p1.active[0], 'atk', 3);
		assert(battle.log.some(line => line.includes('|cant')));
		assert(battle.p1.active[0].hasType('Water'), "Z-Splash with Protean changed the user's type when it should not have.");
	});
});
