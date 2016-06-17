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
		battle.commitDecisions();
		assert.statStage(battle.p2.active[0], 'spa', 0);
		assert.statStage(battle.p2.active[1], 'spa', -1);
	});

	it('should not block secondary effects that affect the user of the move', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ledian', ability: 'ironfist', moves: ['poweruppunch']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Dustox', ability: 'shielddust', moves: ['roost']}]);
		battle.commitDecisions();
		assert.statStage(battle.p1.active[0], 'atk', 1);
	});

	it('should block added effects from items', function () {
		battle = common.createBattle({preview: true}, [
			[{species: 'Talonflame', ability: 'flamebody', item: 'kingsrock', moves: ['flamecharge']}],
			[{species: 'Clefable', ability: 'shielddust', moves: ['cottonguard']}],
		]);
		battle.on('ModifyMove', battle.getFormat(), function (move) {
			if (move.secondaries) {
				for (let i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance = 100;
				}
			}
		});
		battle.commitDecisions(); // Team Preview
		battle.commitDecisions();
		assert.statStage(battle.p1.active[0], 'spe', 1);
		assert.statStage(battle.p2.active[0], 'def', 3); // Clefable did not flinch
	});

	it('should block added effects from Fling', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ledian', ability: 'ironfist', item: 'petayaberry', moves: ['fling']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Dustox', ability: 'shielddust', moves: ['roost']}]);
		battle.commitDecisions();
		assert.statStage(battle.p2.active[0], 'spa', 1);
	});

	it('should not block secondary effects on attacks used by the Pokemon with the ability', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ledian', ability: 'shielddust', moves: ['poweruppunch', 'strugglebug']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Clefable', ability: 'unaware', moves: ['softboiled']}]);
		battle.choose('p1', 'move 1');
		battle.commitDecisions();
		assert.statStage(battle.p1.active[0], 'atk', 1);
		battle.p1.chooseMove(2).foe.chooseDefault();
		assert.statStage(battle.p2.active[0], 'spa', -1);
	});

	it('should be negated by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pinsir', ability: 'moldbreaker', moves: ['strugglebug']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Dustox', ability: 'shielddust', moves: ['roost']}]);
		battle.commitDecisions();
		assert.statStage(battle.p2.active[0], 'spa', -1);
	});
});
