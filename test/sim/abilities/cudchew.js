'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Cud Chew', function () {
	afterEach(() => battle.destroy());

	it(`should eat berry a second time when taking residual damage`, function () {
		battle = common.createBattle([[
			{species: 'Tauros-Paldea-Combat', ability: 'cudchew', item: 'sitrusberry', moves: ['sleeptalk']},
		], [
			{species: 'Ekans', moves: ['toxic']},
		]]);
		battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
		const tauros = battle.p1.active[0];
		assert.notEqual(tauros.hp, 93, `Cud Chew should cause Sitrus Berry to restore HP twice if the activation was due to residual damage.`);
	});

	// need confirmation
	it(`should not eat berry a second time if Neutralizing Gas is active`, function () {
		battle = common.createBattle([
			[{species: 'Tauros-Paldea-Combat', ability: 'cudchew', item: 'sitrusberry', moves: ['sleeptalk']}],
			[{species: 'Weezing-Galar', ability: 'neutralizinggas', moves: ['toxic']}, {species: 'Ekans', moves: ['sleeptalk']}],
		]);
		battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'switch 2');
		const tauros = battle.p1.active[0];
      assert.equal(tauros.hp, 93, `Cud Chew should not cause Sitrus Berry to restore HP twice if Neutralizing Gas is active when eaten the first time.`);
	});

	it(`should not eat berry a second time if Neutralizing Gas becomes active`, function () {
		battle = common.createBattle([
			[{species: 'Tauros-Paldea-Combat', ability: 'cudchew', item: 'sitrusberry', moves: ['sleeptalk']}],
			[{species: 'Ekans', moves: ['toxic']},  {species: 'Weezing-Galar', ability: 'neutralizinggas', moves: ['sleeptalk']}],
		]);
		battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'switch 2');
		const tauros = battle.p1.active[0];
      assert.equal(tauros.hp, 93, `Cud Chew should not cause Sitrus Berry to restore HP twice if Neutralizing Gas becomes active on the second turn.`);
	});

	it.skip(`should not eat berry a second time if Unnerve becomes active`, function () {
		battle = common.createBattle([
			[{species: 'Tauros-Paldea-Combat', ability: 'cudchew', item: 'sitrusberry', moves: ['sleeptalk']}],
			[{species: 'Ekans', moves: ['toxic']},  {species: 'Tyranitar', ability: 'unnerve', moves: ['sleeptalk']}],
		]);
		battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'switch 2');
		const tauros = battle.p1.active[0];
      assert.equal(tauros.hp, 93, `Cud Chew should not cause Sitrus Berry to restore HP twice if Unnerve becomes active on the second turn.`);
	});

	it(`should not eat berry a second time if Cud Chew ability is lost or suppressed`, function () {
		battle = common.createBattle([
			[{species: 'Tauros-Paldea-Combat', ability: 'cudchew', item: 'sitrusberry', moves: ['sleeptalk']}],
			[{species: 'Ekans', moves: ['toxic', 'worryseed']}],
		]);
		battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move worryseed');
		const tauros = battle.p1.active[0];
      assert.equal(tauros.hp, 93, `Cud Chew should not cause Sitrus Berry to restore HP twice if Cud Chew is lost or suppressed.`);
	});

});
