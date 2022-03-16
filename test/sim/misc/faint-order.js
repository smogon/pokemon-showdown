'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Fainting', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should end the turn in Gen 1`, function () {
		// Gen 1 has no end-of-turn effects
		battle = common.gen(1).createBattle([[
			{species: 'Electrode', moves: ['explosion']},
			{species: 'Pikachu', moves: ['growl']},
		], [
			{species: 'Haunter', moves: ['substitute']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch Pikachu', '');
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should end the turn in Gen 3`, function () {
		battle = common.gen(3).createBattle([[
			{species: 'Electrode', moves: ['explosion']},
			{species: 'Pikachu', moves: ['growl']},
		], [
			{species: 'Haunter', moves: ['substitute']},
		]]);
		battle.makeChoices('move Explosion', 'move Substitute');
		battle.makeChoices('switch Pikachu', '');
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not end the turn in Gen 4`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'Electrode', moves: ['explosion']},
			{species: 'Pikachu', moves: ['growl']},
		], [
			{species: 'Haunter', moves: ['substitute']},
		]]);
		battle.makeChoices('move Explosion', 'move Substitute');
		battle.makeChoices('switch Pikachu', '');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should check for a winner after an attack`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'Shedinja', moves: ['shadowsneak']},
		], [
			{species: 'Shedinja', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
		battle.destroy();

		battle = common.gen(5).createBattle([[
			{species: 'Shedinja', moves: ['sleeptalk', 'shadowsneak']},
		], [
			{species: 'Shedinja', ability: 'prankster', moves: ['spore']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
	});

	it(`should check for a winner after recoil`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'Shedinja', moves: ['flareblitz']},
		], [
			{species: 'Shedinja', moves: ['flareblitz']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, '');
		battle.destroy();

		battle = common.gen(5).createBattle([[
			{species: 'Shedinja', moves: ['flareblitz']},
		], [
			{species: 'Shedinja', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
	});

	it(`should check for a winner after Rough Skin`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'Shedinja', moves: ['shadowsneak']},
		], [
			{species: 'Shedinja', ability: 'roughskin', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, '');
		battle.destroy();

		battle = common.gen(6).createBattle([[
			{species: 'Shedinja', moves: ['shadowsneak']},
		], [
			{species: 'Shedinja', ability: 'roughskin', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 2');
		battle.destroy();

		battle = common.gen(7).createBattle([[
			{species: 'Shedinja', moves: ['shadowsneak']},
		], [
			{species: 'Shedinja', ability: 'roughskin', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
	});

	it(`should check for a winner after future moves`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'Shedinja', moves: ['futuresight']},
		], [
			{species: 'Shedinja', moves: ['sleeptalk']},
		]]);
		for (let i = 0; i < 3; i++) battle.makeChoices();
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
	});

	it(`should check for a winner after Rocky Helmet`, function () {
		battle = common.gen(5).createBattle([[
			{species: 'Shedinja', moves: ['shadowsneak']},
		], [
			{species: 'Shedinja', item: 'rockyhelmet', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 2');
		battle.destroy();

		battle = common.gen(7).createBattle([[
			{species: 'Shedinja', moves: ['shadowsneak']},
		], [
			{species: 'Shedinja', item: 'rockyhelmet', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
	});

	it(`should check for a winner after Destiny Bond`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'Shedinja', moves: ['destinybond']},
		], [
			{species: 'Shedinja', ability: 'scrappy', moves: ['vitalthrow']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, '');
		battle.destroy();

		battle = common.gen(5).createBattle([[
			{species: 'Shedinja', moves: ['destinybond']},
		], [
			{species: 'Shedinja', ability: 'scrappy', moves: ['vitalthrow']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 2');
	});

	it(`should check for a winner after Final Gambit`, function () {
		battle = common.gen(5).createBattle([[
			{species: 'Shedinja', moves: ['sleeptalk']},
		], [
			{species: 'Shedinja', ability: 'scrappy', moves: ['finalgambit']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
	});
});
