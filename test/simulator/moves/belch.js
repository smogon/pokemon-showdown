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
		battle.makeChoices('move Stockpile', 'move Thunderwave');
		assert.strictEqual(battle.p1.active[0].lastMove.id, 'stockpile');
		battle.makeChoices('move Belch', 'move Thunderwave');
		assert.strictEqual(battle.p1.active[0].lastMove.id, 'belch');
	});

	it('should count berries as consumed with Bug Bite or Pluck', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Swalot', ability: 'gluttony', item: 'salacberry', moves: ['belch', 'bugbite']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Swalot', ability: 'gluttony', item: 'salacberry', moves: ['belch', 'pluck']}]);
		battle.makeChoices('move Bugbite', 'move Pluck');
		battle.makeChoices('move Belch', 'move Belch');
		assert.strictEqual(battle.p1.active[0].lastMove.id, 'belch');
		assert.strictEqual(battle.p2.active[0].lastMove.id, 'belch');
	});

	it('should count berries as consumed when they are Flung', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Swalot', ability: 'gluttony', moves: ['belch', 'stockpile']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Machamp', ability: 'noguard', item: 'salacberry', moves: ['fling']}]);
		battle.makeChoices('move Stockpile', 'move Fling');
		battle.makeChoices('move Belch', 'move Fling');
		assert.strictEqual(battle.p1.active[0].lastMove.id, 'belch');
	});

	it('should still count berries as consumed after switch out', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Swalot', item: 'lumberry', moves: ['belch', 'uturn']},
			{species: 'Swalot', moves: ['toxic']},
		]);
		battle.join('p2', 'Guest 2', 1, [{
			species: 'Rotom', moves: ['rest', 'willowisp'],
		}]);
		battle.makeChoices('move Uturn', 'move Will-o-Wisp');
		battle.makeChoices('switch 2', ''); // For U-Turn
		battle.makeChoices('switch 2', 'move Will-o-Wisp');
		battle.makeChoices('move Belch', 'move Will-o-Wisp');
		assert.strictEqual(battle.p1.active[0].lastMove.id, 'belch');
	});
});
