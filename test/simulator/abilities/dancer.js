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

	it('should not copy a move that did nothing', function () {
		battle = common.createBattle({gameType: 'doubles'});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: 'Oricorio', level: 98, ability: 'dancer', moves: ['dragondance', 'protect', 'teeterdance', 'celebrate']},
			{species: 'Oricorio', level: 99, ability: 'dancer', moves: ['featherdance']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: 'Oricorio', ability: 'dancer', moves: ['fierydance', 'protect', 'teeterdance']},
			{species: 'Shedinja', ability: 'wonderguard', moves: ['finalgambit']},
		]);
		p1.active[0].boostBy({atk: 5, spe: 6});
		p2.active[0].boostBy({atk: -6});
		p2.active[1].boostBy({spe: 6});
		p1.chooseMove(1).chooseMove(1, 1);
		p2.chooseMove(1, -2).chooseMove(1, 1);
		assert.fullHP(p2.active[0]);
		assert.statStage(p1.active[0], 'atk', 6);
		assert.statStage(p1.active[0], 'spe', 6);
		assert.statStage(p1.active[1], 'atk', 1);
		assert.statStage(p2.active[0], 'atk', -5);
		assert.statStage(p2.active[0], 'spe', 1);
		// Next turn
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.statStage(p2.active[0], 'atk', -5);
		// Next turn: Teeter Dance should be copied as long as it hits one thing
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 3');
		battle.commitDecisions();
		assert.fullHP(p1.active[1]);
		// Next turn: Teeter Dance should NOT be copied if everything it hits is already confused
		battle.choose('p1', 'move 3');
		assert.constant(() => p2.active[0].volatiles['confusion'], () => battle.commitDecisions());
	});
});
