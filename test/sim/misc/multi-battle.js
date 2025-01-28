'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Free-for-all', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should support forfeiting`, function () {
		battle = common.createBattle({gameType: 'freeforall'}, [[
			{species: 'wynaut', moves: ['vitalthrow']},
		], [
			{species: 'scyther', moves: ['sleeptalk']},
		], [
			{species: 'scyther', moves: ['sleeptalk', 'uturn']},
			{species: 'wynaut', moves: ['vitalthrow']},
		], [
			{species: 'scyther', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.lose('p2');
		assert(battle.p2.activeRequest.wait);
		battle.makeChoices('auto', '', 'move uturn 1', 'auto');
		battle.lose('p3');
		battle.makeChoices();
		assert.equal(battle.turn, 4);
	});
});
