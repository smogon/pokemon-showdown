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
		battle.makeChoices('move swordsdance', 'move howl');
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
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move fierydance 1, move sleeptalk');
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
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move trickroom, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move fierydance 1, move sleeptalk');
		assert.fainted(battle.p2.active[0]);
		assert.fainted(battle.p2.active[1]);
	});

	it('should not copy a move that failed or was blocked by Protect', function () {
		// hardcoded to RNG seed
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4]});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: 'Oricorio', level: 98, ability: 'dancer', item: 'laggingtail', moves: ['dragondance', 'protect', 'teeterdance']},
			{species: 'Oricorio', level: 99, ability: 'dancer', moves: ['featherdance']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: 'Oricorio', ability: 'dancer', moves: ['fierydance', 'protect', 'teeterdance']},
			{species: 'Shedinja', ability: 'wonderguard', moves: ['finalgambit']},
		]);
		battle.resetRNG();
		p1.active[0].boostBy({atk: 6, spe: 6});
		p2.active[0].boostBy({atk: -6});
		p2.active[1].boostBy({spe: 6});
		battle.makeChoices('move dragondance, move featherdance 1', 'move fierydance -2, move finalgambit 1');
		assert.fullHP(p2.active[0]);
		assert.statStage(p1.active[0], 'atk', 6);
		assert.statStage(p1.active[1], 'atk', 0);
		assert.statStage(p2.active[0], 'atk', -6);
		assert.statStage(p2.active[0], 'spe', 0);
		// Next turn
		battle.makeChoices('move dragondance, move featherdance', 'move protect');
		assert.statStage(p1.active[0], 'atk', 6);
		assert.statStage(p1.active[1], 'atk', 0);
		// Next turn: Teeter Dance should be copied as long as it hits one thing
		battle.makeChoices('move protect, move featherdance', 'move teeterdance');
		// Next turn: Teeter Dance should NOT be copied if everything it hits is already confused
		assert.constant(() => p1.active[0].volatiles['confusion'], () => battle.makeChoices('move teeterdance, move featherdance', 'move fierydance'));
	});

	it('should not copy a move that missed', function () {
		battle = common.createBattle({gameType: 'singles', seed: [1, 2, 3, 4]});
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: 'Oricorio', ability: 'dancer', item: 'choicescarf', moves: ['revelationdance']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: 'Oricorio', ability: 'dancer', item: 'brightpowder', moves: ['dig']}]);
		p1.active[0].boostBy({accuracy: -6});
		p2.active[0].boostBy({evasion: 6});
		battle.makeChoices('move revelationdance', 'move dig');
		assert.fullHP(p1.active[0]);
		battle.makeChoices('move revelationdance', 'move dig');
		assert.fullHP(p1.active[0]);
	});

	it('should copy a move that hit, but did 0 damage', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: 'Oricorio', ability: 'dancer', moves: ['fierydance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Shedinja', ability: 'dancer', item: 'focussash', moves: ['meanlook']}]);
		assert.hurts(p1.active[0], () => battle.makeChoices('move fierydance', 'move meanlook'));
	});
});
