'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Ring Target', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate natural immunities and deal normal type effectiveness with the other type(s)', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'owntempo', moves: ['earthquake', 'vitalthrow', 'shadowball', 'psychic']}]});
		battle.setPlayer('p2', {team: [
			{species: "Thundurus", ability: 'prankster', item: 'ringtarget', moves: ['rest']},
			{species: "Drifblim", ability: 'unburden', item: 'ringtarget', moves: ['rest']},
			{species: "Girafarig", ability: 'innerfocus', item: 'ringtarget', moves: ['rest']},
			{species: "Absol", ability: 'superluck', item: 'ringtarget', moves: ['rest']},
		]});
		battle.makeChoices('move earthquake', 'move rest');
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.false.fullHP(battle.p2.active[0]);

		battle.makeChoices('move vitalthrow', 'switch 2'); // Drifblim
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-resisted|'));
		assert.false.fullHP(battle.p2.active[0]);

		battle.makeChoices('move shadowball', 'switch 3'); // Girafarig
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.false.fullHP(battle.p2.active[0]);

		battle.makeChoices('move psychic', 'switch 4'); // Absol
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should not affect ability-based immunities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Hariyama", ability: 'guts', moves: ['earthquake']}]});
		battle.setPlayer('p2', {team: [
			{species: "Mismagius", ability: 'levitate', item: 'ringtarget', moves: ['shadowsneak']},
			{species: "Rotom-Fan", ability: 'levitate', item: 'ringtarget', moves: ['snore']},
		]});
		battle.makeChoices('move earthquake', 'move shadowsneak');
		assert.fullHP(battle.p2.active[0]);

		// even if Rotom-Fan
		battle.makeChoices('move earthquake', 'switch 2');
		assert.fullHP(battle.p2.active[0]);
	});
});
