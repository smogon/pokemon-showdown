'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Disable', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should prevent the use of the target's last move`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['disable']},
		], [
			{species: 'Spearow', moves: ['growl']},
		]]);

		battle.makeChoices();
		assert.cantMove(() => battle.makeChoices('auto', 'move growl'), 'Spearow', 'growl');
	});

	it(`should interupt consecutively executed moves like Outrage`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['disable']},
		], [
			{species: 'Spearow', moves: ['outrage', 'sleeptalk']},
		]]);

		battle.makeChoices();
		assert.cantMove(() => battle.makeChoices('auto', 'move sleeptalk'), 'Spearow', 'sleeptalk');
		battle.makeChoices();
		assert.cantMove(() => battle.makeChoices('auto', 'move outrage'));
	});

	it(`should not work successfully against Struggle`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['disable']},
		], [
			{species: 'Spearow', item: 'assaultvest', moves: ['growl']},
		]]);

		battle.makeChoices();
		assert(battle.log.indexOf('|-fail|p1a: Wynaut') > 0, `Disable should have failed vs Struggle`);
	});

	it(`should work on the first turn in generation 1 
		if opponent has move with pp`, function () {
		battle = common.gen(1).createBattle([
			[{species: 'Mew', moves: ['disable']}],
			[{species: 'Muk', moves: ['splash', 'roar']}],
		]);
		battle.makeChoices();
		assert('disable' in battle.p2.active[0].volatiles);
	});

	it(`should fail if opponent has no moves with pp in generation 1`, function () {
		battle = common.gen(1).createBattle([
			[{species: 'Mew', moves: ['disable']}],
			[{species: 'Muk', moves: ['hyperbeam']}],
		]);
		battle.p2.active[0].deductPP('hyperbeam', 8);
		assert.equal(battle.p2.active[0].moveSlots[0].pp, 0);
		battle.makeChoices();
		assert(battle.log.includes('|-fail|p2a: Muk'), 'Muk has no moves with positive PP');
	});

	it(`should not select moves with 0 pp in generation 1`, function () {
		battle = common.gen(1).createBattle([
			[{species: 'Mew', moves: ['disable']}],
			[{species: 'Muk', moves: ['hyperbeam', 'fireblast', 'blizzard', 'splash']}],
		]);
		const p2pkmn = battle.p2.active[0];
		p2pkmn.deductPP('hyperbeam', 8);
		p2pkmn.deductPP('fireblast', 8);
		p2pkmn.deductPP('blizzard', 8);
		battle.makeChoices('auto', 'move splash');
		assert.equal(p2pkmn.volatiles.disable.move, 'splash');
	});
});
