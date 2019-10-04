'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shield Dust', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should block secondary effects against the user', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: 'Latios', ability: 'noguard', moves: ['snarl']}, {species: 'Latias', ability: 'levitate', moves: ['roost']}],
			[{species: 'Xerneas', ability: 'shielddust', moves: ['roost']}, {species: 'Yveltal', ability: 'pressure', moves: ['roost']}],
		]);
		battle.makeChoices('move snarl, move roost', 'move roost, move roost');
		assert.statStage(battle.p2.active[0], 'spa', 0);
		assert.statStage(battle.p2.active[1], 'spa', -1);
	});

	it('should not block secondary effects that affect the user of the move', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Ledian', ability: 'ironfist', moves: ['poweruppunch']}]});
		battle.setPlayer('p2', {team: [{species: 'Dustox', ability: 'shielddust', moves: ['roost']}]});
		battle.makeChoices('move poweruppunch', 'move roost');
		assert.statStage(battle.p1.active[0], 'atk', 1);
	});

	it('should block added effects from items', function () {
		battle = common.createBattle({preview: true}, [
			[{species: 'Talonflame', ability: 'flamebody', item: 'kingsrock', moves: ['flamecharge']}],
			[{species: 'Clefable', ability: 'shielddust', moves: ['cottonguard']}],
		]);
		battle.onEvent('ModifyMove', battle.format, function (move) {
			if (move.secondaries) {
				for (const secondary of move.secondaries) {
					secondary.chance = 100;
				}
			}
		});
		battle.makeChoices('default', 'default'); // Team Preview
		battle.makeChoices('move flamecharge', 'move cottonguard');
		assert.statStage(battle.p1.active[0], 'spe', 1);
		assert.statStage(battle.p2.active[0], 'def', 3); // Clefable did not flinch
	});

	it('should block added effects from Fling', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Ledian', ability: 'ironfist', item: 'petayaberry', moves: ['fling']}]});
		battle.setPlayer('p2', {team: [{species: 'Dustox', ability: 'shielddust', moves: ['roost']}]});
		battle.makeChoices('move fling', 'move roost');
		assert.statStage(battle.p2.active[0], 'spa', 1);
	});

	it('should not block secondary effects on attacks used by the Pokemon with the ability', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Ledian', ability: 'shielddust', moves: ['poweruppunch', 'strugglebug']}]});
		battle.setPlayer('p2', {team: [{species: 'Clefable', ability: 'unaware', moves: ['softboiled']}]});
		battle.makeChoices('move poweruppunch', 'move softboiled');
		assert.statStage(battle.p1.active[0], 'atk', 1);
		battle.makeChoices('move strugglebug', 'move softboiled');
		assert.statStage(battle.p2.active[0], 'spa', -1);
	});

	it('should be negated by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Pinsir', ability: 'moldbreaker', moves: ['strugglebug']}]});
		battle.setPlayer('p2', {team: [{species: 'Dustox', ability: 'shielddust', moves: ['roost']}]});
		battle.makeChoices('move strugglebug', 'move roost');
		assert.statStage(battle.p2.active[0], 'spa', -1);
	});
});
