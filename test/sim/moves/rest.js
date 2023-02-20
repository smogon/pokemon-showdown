'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Rest', function () {
	this.afterEach(function () {
		battle.destroy();
	});

	it('fail when called by sleep talk in Gen. 3', function () {
		battle = common.gen(3).createBattle([[
			{species: 'snorlax', ability: 'noguard', moves: ['sleeptalk', 'rest']},
		], [
			{species: 'magikarp', moves: ['flail', 'splash']},
		]]);
		const snorlax = battle.p1.active[0];
		const rest = snorlax.getMoveData(Dex.moves.get('rest'));
		battle.makeChoices('move sleeptalk', 'move flail');
		assert.notEqual(snorlax.hp, snorlax.maxhp);

		battle.makeChoices('move rest', 'move splash');
		assert.fullHP(snorlax);
		assert.equal(snorlax.status, 'slp');
		snorlax.statusState.time = 6;
		const preSleeptalkPP = rest.pp;
		assert.equal(preSleeptalkPP, rest.maxpp - 1);

		battle.makeChoices('move sleeptalk', 'move flail');
		assert(battle.log[battle.lastMoveLine + 2].startsWith('|-fail'), 'should log that Rest fails when called by Sleep Talk');
		assert.equal(rest.pp, preSleeptalkPP, 'Rest\'s pp should not reduce after failure');
	});
});
