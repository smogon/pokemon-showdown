'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Receiver`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should gain a boost immediately if taking over a KO boost Ability`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'whimsicott', ability: 'soulheart', moves: ['memento']},
			{species: 'passimian', ability: 'receiver', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const passimian = battle.p1.active[1];
		assert.statStage(passimian, 'spa', 1);
	});
});
