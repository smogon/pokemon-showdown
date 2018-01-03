'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const PRNG = require('./../../../sim/prng');

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
		battle.choose('p2', 'move 2');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move trickroom, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move fierydance 1, move sleeptalk');
		assert.fainted(battle.p2.active[0]);
		assert.fainted(battle.p2.active[1]);
	});

	it('should not copy a move that failed or was blocked by Protect', function () {
		battle = common.createBattle({gameType: 'doubles'}, null, new PRNG([1, 2, 3, 4]));
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: "Oricorio-Pa'u", level: 98, ability: 'dancer', item: 'laggingtail', moves: ['dragondance', 'protect', 'teeterdance']},
			{species: 'Oricorio-Pom-Pom', level: 99, ability: 'dancer', moves: ['featherdance']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: 'Oricorio-Sensu', ability: 'dancer', moves: ['fierydance', 'protect', 'teeterdance']},
			{species: 'Shedinja', ability: 'wonderguard', moves: ['finalgambit']},
		]);
		p1.active[0].boostBy({atk: 6, spe: 6}); // Dragon Dance will fail
		p2.active[0].boostBy({atk: -6}); // Feather dance will fail
		p2.active[1].boostBy({spe: 6}); // Shedinja will move first
		battle.makeChoices('move dragondance, move featherdance 1', 'move fierydance -2, move finalgambit');
		assert.fullHP(p2.active[0], "Player 1's Oricorio should not copy a failed Fiery Dance");
		assert.statStage(p1.active[0], 'atk', 6, "Oricorio-Sensu should not copy a failed Feather Dance");
		assert.statStage(p1.active[1], 'atk', 0, "Oricorio-Sensu should not copy a failed Feather Dance, and Oricorio-Pom-Pom should not copy a failed Dragon Dance");
		assert.statStage(p2.active[0], 'atk', -6, "Oricorio-Sensu should not copy a failed Dragon Dance");

		battle.makeChoices('move dragondance, move featherdance', 'move protect');
		assert.statStage(p1.active[0], 'atk', 6, "Oricorio-Sensu should not copy a Feather Dance that was blocked by Protect");
		assert.statStage(p1.active[1], 'atk', 0, "Oricorio-Sensu should not copy a Feather Dance that was blocked by Protect");

		battle.makeChoices('move protect, move featherdance', 'move teeterdance');
		assert.ok(p2.active[0].volatiles['confusion'], "Oricorio-Pa'u should copy Teeter Dance as long as it was successful against at least one target");

		assert.constant(() => p1.active[0].volatiles['confusion'], () => battle.makeChoices('move teeterdance, move featherdance', 'move fierydance'), "Teeter Dance should not be copied if it fails against every target");
	});

	it('should not copy a move that missed', function () {
		battle = common.createBattle({gameType: 'singles'}, null, new PRNG([1, 2, 3, 4]));
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
