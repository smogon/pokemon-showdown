'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Disable', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should prevent the use of the target's last move`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", moves: ['disable'] },
		], [
			{ species: "Spearow", moves: ['growl'] },
		]]);

		battle.makeChoices();
		assert.cantMove(() => battle.makeChoices('auto', 'move growl'), "Spearow", 'growl');
	});

	it(`should interrupt consecutively executed moves like Outrage`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", moves: ['disable'] },
		], [
			{ species: "Spearow", moves: ['outrage', 'sleeptalk'] },
		]]);

		battle.makeChoices();
		assert.cantMove(() => battle.makeChoices('auto', 'move sleeptalk'), "Spearow", 'sleeptalk');
		battle.makeChoices();
		assert.cantMove(() => battle.makeChoices('auto', 'move outrage'));
	});

	it(`should not work successfully against Struggle`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", moves: ['disable'] },
		], [
			{ species: "Spearow", item: 'assaultvest', moves: ['growl'] },
		]]);

		battle.makeChoices();
		assert(battle.log.indexOf('|-fail|p1a: Wynaut') > 0, `Disable should have failed vs Struggle`);
	});

	describe(`[Gen 1] Disable`, () => {
		it(`should fail if the opponent already has a move disabled`, () => {
			battle = common.createBattle({ forceRandomChance: true }, [[
				{ species: 'Mew', moves: ['disable'] },
			], [
				{ species: 'Muk', moves: ['splash', 'tackle'] },
			]]);
			battle.makeChoices('auto', 'move tackle');
			battle.makeChoices('auto', 'move splash');
			battle.makeChoices('auto', 'move splash');
			assert(battle.log.includes('|-fail|p1a: Mew'), `Disable should fail if a move is already disabled`);
		});

		it(`should work on the first turn so long as the opponent has move with PP`, () => {
			battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
				{ species: 'Mew', moves: ['disable'] },
			], [
				{ species: 'Muk', moves: ['roar'] },
			]]);
			battle.makeChoices();
			assert('disable' in battle.p2.active[0].volatiles);
		});

		it(`should fail if opponent has no moves with PP`, () => {
			battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
				{ species: 'Mew', moves: ['disable'] },
			], [
				{ species: 'Muk', moves: ['hyperbeam'] },
			]]);
			battle.p2.active[0].deductPP('hyperbeam', 8);
			battle.makeChoices();
			assert(battle.log.includes('|-fail|p2a: Muk'), 'Muk has no moves with positive PP');
		});

		it(`should not select moves with 0 PP`, () => {
			battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
				{ species: 'Mew', moves: ['disable'] },
			], [
				{ species: 'Muk', moves: ['hyperbeam', 'fireblast', 'blizzard', 'tackle'] },
			]]);
			const muk = battle.p2.active[0];
			muk.moveSlots[0].pp = 0;
			muk.moveSlots[1].pp = 0;
			muk.moveSlots[2].pp = 0;
			battle.makeChoices('auto', 'move tackle');
			assert(!!muk.volatiles['disable']);
			assert.equal(muk.volatiles.disable.slotIndex, 3);
		});

		it(`should keep the slot disabled even if the move is replaced by Mimic`, () => {
			battle = common.gen(1).createBattle({ seed: [2, 0, 0, 0] }, [[
				{ species: 'Drowzee', moves: ['mimic', 'tackle'] },
			], [
				{ species: 'Abra', moves: ['tackle', 'disable'] },
			]]);
			const disabled = battle.p1.active[0];
			battle.makeChoices('move mimic', 'move disable');
			assert.equal(disabled.moveSlots[0].id, 'tackle');
			assert.equal(disabled.volatiles['disable'].slotIndex, 1);
			assert.equal(disabled.volatiles['disable'].move, 'tackle');
			assert.cantMove(() => battle.p1.choose('move 2'));
			// can select the Tackle in the first slot, but the move will still fail
			battle.makeChoices('move 1', 'move tackle');
			assert.fullHP(battle.p2.active[0]);
		});

		it(`should keep the slot disabled even if the move is replaced by Transform`, () => {
			battle = common.gen(1).createBattle({ seed: [2, 0, 0, 0] }, [[
				{ species: 'Drowzee', moves: ['transform', 'tackle'] },
			], [
				{ species: 'Abra', moves: ['tackle', 'disable'] },
			]]);
			battle.makeChoices('move tackle', 'move disable');
			assert.cantMove(() => battle.p1.choose('move tackle'));
			battle.makeChoices('move transform', 'move tackle');
			assert.cantMove(() => battle.p1.choose('move disable'));
			battle.makeChoices('move tackle', 'move tackle');
		});

		it(`Disable should build Rage, even if it misses/fails`, () => {
			// Disable hits
			battle = common.gen(1).createBattle([[
				{ species: 'Drowzee', moves: ['disable'] },
			], [
				{ species: 'Abra', moves: ['rage'] },
			]]);
			// Modding accuracy so Disable always hits
			battle.onEvent('Accuracy', battle.format, true);
			battle.makeChoices();
			assert(battle.log.some(line => line.startsWith('|-boost|')));

			battle = common.gen(1).createBattle([[
				{ species: 'Drowzee', moves: ['disable'] },
			], [
				{ species: 'Abra', moves: ['rage'] },
			]]);
			// Modding accuracy so Disable always misses
			battle.onEvent('Accuracy', battle.format, (accuracy, target, pokemon, move) => {
				return move.id === 'rage';
			});
			battle.makeChoices();
			assert(battle.log.some(line => line.startsWith('|-boost|')));
		});
	});
});
