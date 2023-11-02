'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Belch', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should be disabled if the user has not consumed a berry`, function () {
		battle = common.createBattle([[
			{species: 'Swalot', item: 'lumberry', moves: ['belch', 'stockpile']},
		], [
			{species: 'Registeel', item: 'laggingtail', moves: ['glare']},
		]]);

		const swalot = battle.p1.active[0];
		battle.makeChoices('move stockpile', 'move glare');
		assert.equal(swalot.lastMove.id, 'stockpile');
		battle.makeChoices('move belch', 'move glare');
		assert.equal(swalot.lastMove.id, 'belch');
	});

	it('should count berries as consumed with Bug Bite or Pluck', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Swalot', ability: 'gluttony', item: 'salacberry', moves: ['belch', 'bugbite']}]});
		battle.setPlayer('p2', {team: [{species: 'Swalot', ability: 'gluttony', item: 'salacberry', moves: ['belch', 'pluck']}]});
		battle.makeChoices('move Bugbite', 'move Pluck');
		battle.makeChoices('move Belch', 'move Belch');
		assert.equal(battle.p1.active[0].lastMove.id, 'belch');
		assert.equal(battle.p2.active[0].lastMove.id, 'belch');
	});

	it('should count berries as consumed when they are Flung', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Swalot', ability: 'gluttony', moves: ['belch', 'stockpile']}]});
		battle.setPlayer('p2', {team: [{species: 'Machamp', ability: 'noguard', item: 'salacberry', moves: ['fling']}]});
		battle.makeChoices('move Stockpile', 'move Fling');
		battle.makeChoices('move Belch', 'move Fling');
		assert.equal(battle.p1.active[0].lastMove.id, 'belch');
	});

	it('should still count berries as consumed after switch out', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Swalot', item: 'lumberry', moves: ['belch', 'uturn']},
			{species: 'Swalot', moves: ['toxic']},
		]});
		battle.setPlayer('p2', {team: [{
			species: 'Rotom', moves: ['rest', 'willowisp'],
		}]});
		battle.makeChoices('move Uturn', 'move Will-o-Wisp');
		battle.makeChoices('switch 2', ''); // For U-Turn
		battle.makeChoices('switch 2', 'move Will-o-Wisp');
		battle.makeChoices('move Belch', 'move Will-o-Wisp');
		assert.equal(battle.p1.active[0].lastMove.id, 'belch');
	});
});
