'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Cud Chew', function () {
	afterEach(() => battle.destroy());

	it(`should eat berry a second time when taking residual damage`, function () {
		battle = common.createBattle([
			[{species: 'Tauros-Paldea-Combat', ability: 'cudchew', item: 'sitrusberry', moves: ['sleeptalk']}],
			[{species: 'Ekans', moves: ['toxic']},  {species: 'Weezing-Galar', ability: 'neutralizinggas', moves: ['sleeptalk']}],
		]);
		battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
      battle.makeChoices('move sleeptalk', 'move toxic');
		const tauros = battle.p1.active[0];
		assert.notEqual(tauros.hp, 93, `Cud Chew should cause Sitrus Berry to restore HP twice if the activation was due to residual damage.`);
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

});
