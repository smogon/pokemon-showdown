'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Belch', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should be disabled if the user has not consumed a berry', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Swalot', ability: 'gluttony', item: 'lumberry', moves: ['belch', 'stockpile']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Registeel', ability: 'clearbody', item: 'laggingtail', moves: ['thunderwave']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].lastMove, 'stockpile');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].lastMove, 'belch');
	});

	it('should count berries as consumed with Bug Bite or Pluck', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Swalot', ability: 'gluttony', item: 'salacberry', moves: ['belch', 'bugbite']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Swalot', ability: 'gluttony', item: 'salacberry', moves: ['belch', 'pluck']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].lastMove, 'belch');
		assert.strictEqual(battle.p2.active[0].lastMove, 'belch');
	});

	it('should count berries as consumed when they are Flung', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Swalot', ability: 'gluttony', moves: ['belch', 'stockpile']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Machamp', ability: 'noguard', item: 'salacberry', moves: ['fling']}]);
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].lastMove, 'belch');
	});

	it('should still count berries as consumed after switch out', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Swalot', ability: 'gluttony', item: 'lumberry', moves: ['belch', 'uturn']},
			{species: 'Swalot', ability: 'gluttony', moves: ['toxic']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Registeel', ability: 'prankster', moves: ['rest', 'thunderwave']}]);
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		battle.choose('p1', 'switch 2'); // For U-Turn
		battle.choose('p1', 'switch 2');
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].lastMove, 'belch');
	});
});
