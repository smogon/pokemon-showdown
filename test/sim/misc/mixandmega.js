'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mix and Mega', function () {
	beforeEach(function () {
		battle = common.mod('gen7mixandmega').createBattle();
	});
	afterEach(() => battle.destroy());

	it('should overwrite forme-change abilities on Mega Evolution or Primal Reversion', function () {
		battle.setPlayer('p1', {team: [{species: "Mimikyu", ability: 'disguise', item: 'metagrossite', moves: ['shadowclaw']}]});
		battle.setPlayer('p2', {team: [{species: "Wishiwashi", ability: 'schooling', item: 'blueorb', moves: ['uturn']}]});
		battle.makeChoices('default', 'default'); // Switch in
		const [grossHolder, ogreHolder] = [battle.p1.active[0], battle.p2.active[0]];
		battle.makeChoices('move shadowclaw mega', 'move uturn');
		assert.equal(grossHolder.ability, 'toughclaws');
		assert.equal(ogreHolder.ability, 'primordialsea');
	});
});
