'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Defiant`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should raise the user's attack when lowered by an opponent`, function () {
		battle = common.createBattle([[
			{species: 'pawniard', ability: 'defiant', moves: ['sleeptalk', 'tackle']},
		], [
			{species: 'wynaut', moves: ['faketears', 'firelash', 'silktrap']},
		]]);
		battle.makeChoices('auto', 'move faketears');
		battle.makeChoices('auto', 'move firelash');
		battle.makeChoices('move tackle', 'move silktrap');

		assert.statStage(battle.p1.active[0], 'atk', 6);
	});

	it(`should not raise the user's attack when lowered by itself or an ally`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'pawniard', ability: 'defiant', moves: ['closecombat', 'sleeptalk']},
			{species: 'wynaut', moves: ['faketears', 'firelash', 'silktrap']},
		], [
			{species: 'screamtail', moves: ['sleeptalk']},
			{species: 'jigglypuff', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move sleeptalk, move firelash -1', 'auto');
		battle.makeChoices('move closecombat 1, move faketears -1', 'auto');
		battle.makeChoices('move closecombat -2, move silktrap', 'auto');

		assert.statStage(battle.p1.active[0], 'atk', 0);
	});
});
