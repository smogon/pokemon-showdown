'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Dancer', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should only copy dance moves used by other Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Oricorio', ability: 'dancer', moves: ['swordsdance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Oricorio', ability: 'dancer', moves: ['howl']}]);
		battle.commitDecisions();
		assert.statStage(battle.p1.active[0], 'atk', 2);
		assert.statStage(battle.p2.active[0], 'atk', 3);
	});

	it('should activate in order of lowest to highest raw speed', function () {
		battle = common.createBattle({gameType: 'doubles'});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: 'Shedinja', level: 98, ability: 'dancer', item: 'focussash', moves: ['sleeptalk']},
			{species: 'Shedinja', level: 99, ability: 'dancer', moves: ['sleeptalk']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Shedinja', ability: 'wonderguard', moves: ['fierydance']},
			{species: 'Shedinja', ability: 'dancer', moves: ['sleeptalk']},
		]);
		p1.active[1].boostBy({spe: 6});
		p1.chooseMove(1).chooseMove(1).foe.chooseMove(1, 1).chooseMove(1);
		assert.fainted(battle.p2.active[0]);
		assert.fainted(battle.p2.active[1]);
	});

	it('should activate in order of lowest to highest raw speed inside Trick Room', function () {
		battle = common.createBattle({gameType: 'doubles'});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: 'Shedinja', level: 98, ability: 'dancer', item: 'focussash', moves: ['sleeptalk']},
			{species: 'Shedinja', level: 99, ability: 'dancer', moves: ['sleeptalk']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Shedinja', ability: 'wonderguard', moves: ['fierydance', 'trickroom']},
			{species: 'Shedinja', ability: 'dancer', moves: ['sleeptalk']},
		]);
		p1.active[1].boostBy({spe: 6});
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		p1.chooseMove(1).chooseMove(1).foe.chooseMove(1, 1).chooseMove(1);
		assert.fainted(battle.p2.active[0]);
		assert.fainted(battle.p2.active[1]);
	});
});
