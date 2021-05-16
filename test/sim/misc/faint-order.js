'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Fainting', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should end the turn in Gen 1', function () {
		// Gen 1 has no end-of-turn effects
		battle = common.gen(1).createBattle([
			[
				{species: 'Electrode', moves: ['explosion']},
				{species: 'Pikachu', moves: ['growl']},
			],
			[
				{species: 'Haunter', moves: ['substitute']},
			],
		]);
		battle.makeChoices('move Explosion', 'move Substitute');
		battle.makeChoices('switch Pikachu', '');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should end the turn in Gen 3', function () {
		battle = common.gen(3).createBattle([
			[
				{species: 'Electrode', ability: 'soundproof', moves: ['explosion']},
				{species: 'Pikachu', ability: 'lightningrod', moves: ['growl']},
			],
			[
				{species: 'Haunter', ability: 'levitate', moves: ['substitute']},
			],
		]);
		battle.makeChoices('move Explosion', 'move Substitute');
		battle.makeChoices('switch Pikachu', '');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not end the turn in Gen 4', function () {
		battle = common.gen(4).createBattle([
			[
				{species: 'Electrode', ability: 'soundproof', moves: ['explosion']},
				{species: 'Pikachu', ability: 'lightningrod', moves: ['growl']},
			],
			[
				{species: 'Haunter', ability: 'levitate', moves: ['substitute']},
			],
		]);
		battle.makeChoices('move Explosion', 'move Substitute');
		battle.makeChoices('switch Pikachu', '');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should check for a winner after an attack', function () {
		battle = common.gen(4).createBattle([
			[
				{species: 'Shedinja', moves: ['shadowsneak']},
			],
			[
				{species: 'Shedinja', moves: ['sleeptalk']},
			],
		]);
		battle.makeChoices();
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
		battle.destroy();

		battle = common.gen(5).createBattle([
			[
				{species: 'Shedinja', moves: ['sleeptalk', 'shadowsneak']},
			],
			[
				{species: 'Shedinja', ability: 'prankster', moves: ['spore']},
			],
		]);
		battle.makeChoices();
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
	});

	it('should check for a winner after recoil', function () {
		battle = common.gen(4).createBattle([
			[
				{species: 'Shedinja', moves: ['flareblitz']},
			],
			[
				{species: 'Shedinja', moves: ['flareblitz']},
			],
		]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, '');
		battle.destroy();

		battle = common.gen(5).createBattle([
			[
				{species: 'Shedinja', moves: ['flareblitz']},
			],
			[
				{species: 'Shedinja', moves: ['sleeptalk']},
			],
		]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
	});

	it('should check for a winner after Rough Skin', function () {
		battle = common.gen(4).createBattle([
			[
				{species: 'Shedinja', moves: ['shadowsneak']},
			],
			[
				{species: 'Shedinja', ability: 'roughskin', moves: ['sleeptalk']},
			],
		]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, '');
		battle.destroy();

		battle = common.gen(6).createBattle([
			[
				{species: 'Shedinja', moves: ['shadowsneak']},
			],
			[
				{species: 'Shedinja', ability: 'roughskin', moves: ['sleeptalk']},
			],
		]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 2');
		battle.destroy();

		battle = common.gen(7).createBattle([
			[
				{species: 'Shedinja', moves: ['shadowsneak']},
			],
			[
				{species: 'Shedinja', ability: 'roughskin', moves: ['sleeptalk']},
			],
		]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
	});

	it('should check for a winner after future moves', function () {
		battle = common.gen(7).createBattle([
			[
				{species: 'Shedinja', moves: ['futuresight']},
			],
			[
				{species: 'Shedinja', moves: ['sleeptalk']},
			],
		]);
		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices();
		assert.fainted(battle.p2.active[0]);
		assert.equal(battle.winner, 'Player 1');
	});
});
