'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Unnerve`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should allow Berry activation between switches of Unnerve`, function () {
		battle = common.createBattle([[
			{species: 'toxapex', ability: 'unnerve', moves: ['toxic']},
			{species: 'corviknight', ability: 'unnerve', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', item: 'lumberry', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2', 'auto');
		assert.equal(battle.p2.active[0].status, '');
	});

	// See writeup by SadisticMystic: https://glitchcity.wiki/Unnerve_desync_glitch
	// Tests done with Oran Berry here, but also possible with other healing Berries or Cheek Pouch
	describe.skip(`Unnerve Desync Glitch`, function () {
		beforeEach(function () {
			battle = common.createBattle([[
				// 18 HP on Wynaut
				{species: 'Wynaut', level: 3, ivs: {hp: 0}, ability: 'dazzling', item: 'oranberry', moves: ['bellydrum', 'flamethrower']},
				{species: 'Aggron', moves: ['sleeptalk']},
			], [
				{species: 'Mewtwo', ability: 'unnerve', item: 'laggingtail', moves: ['explosion']},
				{species: 'Celesteela', moves: ['tackle', 'poweruppunch', 'quickattack', 'roar']},
			]]);
			battle.makeChoices();
			assert.false.fainted(battle.p1.active[0], `Wynaut should not have fainted.`);
			battle.choose('p2', 'switch celesteela');
		});

		it(`should allow the undead Pokemon to switch back in after "fainting"`, function () {
			battle.makeChoices(); // "KO" Wynaut
			battle.choose('p1', 'switch aggron');
			assert.false.cantMove(() => battle.choose('p1', 'switch wynaut'));
		});

		it(`should make attacks used against the undead Pokemon fail due to lack of target`, function () {
			battle.makeChoices(); // "KO" Wynaut
			battle.choose('p1', 'switch aggron');
			battle.makeChoices('switch wynaut', 'move poweruppunch');
			const celesteela = battle.p2.active[0];
			const move = celesteela.getMoveData(Dex.moves.get('poweruppunch'));
			assert.statStage(celesteela, 'atk', 0);
			assert.equal(move.pp, move.maxpp - 1);
		});

		it(`should allow some passive abilities on the undead Pokemon to work normally`, function () {
			battle.makeChoices(); // "KO" Wynaut
			battle.choose('p1', 'switch aggron');
			battle.makeChoices('switch wynaut', 'move quickattack');
			const dazzlingIndex = battle.getDebugLog().indexOf('ability: Dazzling');
			assert(dazzlingIndex > 0, `Undead Dazzling should have still blocked Quick Attack`);
		});

		it(`should allow the undead Pokemon to choose to switch, but the turn will be skipped`, function () {
			battle.makeChoices(); // "KO" Wynaut
			battle.choose('p1', 'switch aggron');
			battle.makeChoices('switch wynaut', 'auto');
			battle.makeChoices('switch aggron', 'auto'); // The choice should work, but not actually switch Wynaut out
			assert.species(battle.p1.active[0], 'Wynaut');
		});

		it(`should allow the undead Pokemon to choose moves, but the turn will be skipped`, function () {
			battle.makeChoices(); // "KO" Wynaut
			battle.choose('p1', 'switch aggron');
			battle.makeChoices('switch wynaut', 'auto');
			battle.makeChoices('move flamethrower', 'auto'); // The choice should work, but not actually use an attack
			const move = battle.p1.active[0].getMoveData(Dex.moves.get('flamethrower'));
			assert.equal(move.pp, move.maxpp);
		});

		it(`should allow the undead Pokemon to choose to Dynamax, but the turn will be skipped`, function () {
			battle.makeChoices(); // "KO" Wynaut
			battle.choose('p1', 'switch aggron');
			battle.makeChoices('switch wynaut', 'auto');
			battle.makeChoices('move bellydrum dynamax', 'auto'); // The choice should work, but not actually Dynamax Wynaut
			assert.false(battle.p1.active[0].volatiles['dynamax']);
		});
	});
});
