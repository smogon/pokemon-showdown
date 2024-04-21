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
			{species: 'Wynaut', ability: 'noguard', moves: ['toxic']},
		]]);
      const tauros = battle.p1.active[0];
		battle.makeChoices();
      battle.makeChoices();
      battle.makeChoices();
      battle.makeChoices();
      assert.false.holdsItem(tauros);
      battle.makeChoices();
		assert.equal(tauros.hp, 165);
	});

	// need confirmation
	it(`should not eat berry a second time if Neutralizing Gas is active`, function () {
		battle = common.createBattle([
			[{species: 'Tauros-Paldea-Combat', ability: 'cudchew', item: 'sitrusberry', evs: {hp: 4}, moves: ['bellydrum']}],
			[{species: 'Weezing-Galar', ability: 'neutralizinggas', moves: ['sleeptalk']}, {species: 'Wynaut', moves: ['sleeptalk']}],
		]);
      const tauros = battle.p1.active[0];
		battle.makeChoices();
      assert.false.holdsItem(tauros);
      const taurosVolatiles = battle.p1.active[0].volatiles;
      assert.false('cudchew' in taurosVolatiles);
      battle.makeChoices('move bellydrum', 'switch 2');
      assert.equal(tauros.hp, 219, `Cud Chew should not cause Sitrus Berry to restore HP twice if Neutralizing Gas is active when eaten the first time.`);
	});

	it(`should not eat berry a second time if Neutralizing Gas becomes active`, function () {
		battle = common.createBattle([
			[{species: 'Tauros-Paldea-Combat', ability: 'cudchew', item: 'sitrusberry', evs: {hp: 4}, moves: ['bellydrum']}],
			[{species: 'Wynaut', ability: 'noguard', moves: ['sleeptalk']},  {species: 'Weezing-Galar', ability: 'neutralizinggas', moves: ['sleeptalk']}],
		]);
      const tauros = battle.p1.active[0];
		battle.makeChoices();
      assert.false.holdsItem(tauros);
      battle.makeChoices('move bellydrum', 'switch 2');
      assert.equal(tauros.hp, 292, `Cud Chew should not cause Sitrus Berry to restore HP twice if Neutralizing Gas becomes active on the second turn.`);
	});

	it.skip(`should not eat berry a second time if Unnerve becomes active`, function () {
		battle = common.createBattle([
			[{species: 'Tauros-Paldea-Combat', ability: 'cudchew', item: 'sitrusberry', evs: {hp: 4}, moves: ['bellydrum']}],
			[{species: 'Wynaut', abiltiy: 'noguard', moves: ['toxic']},  {species: 'Tyranitar', ability: 'unnerve', moves: ['sleeptalk']}],
		]);
      const tauros = battle.p1.active[0];
		battle.makeChoices();
      assert.false.holdsItem(tauros);
      battle.makeChoices('move bellydrum', 'switch 2')
      assert.equal(tauros.hp, 93, `Cud Chew should not cause Sitrus Berry to restore HP twice if Unnerve becomes active on the second turn.`);
	});

	it(`should not eat berry a second time if Cud Chew ability is lost or suppressed`, function () {
		battle = common.createBattle([
			[{species: 'Tauros-Paldea-Combat', ability: 'cudchew', item: 'sitrusberry', evs: {hp: 4}, moves: ['bellydrum']}],
			[{species: 'Wynaut', ability: 'noguard', moves: ['toxic', 'worryseed']}],
		]);
      const tauros = battle.p1.active[0];
		battle.makeChoices();
      assert.false.holdsItem(tauros);
      battle.makeChoices('move bellydrum', 'move worryseed');
      assert.equal(tauros.hp, 238, `Cud Chew should not cause Sitrus Berry to restore HP twice if Cud Chew is lost or suppressed.`);
	});

});
