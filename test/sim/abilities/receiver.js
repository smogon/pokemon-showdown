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

	it.skip(`should do weird stuff with multiple Soul-Heart and multiple Receiver`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Passimian', ability: 'receiver', moves: ['earthquake']},
			{species: 'Magearna', ability: 'soulheart', level: 1, moves: ['sleeptalk']},
		], [
			{species: 'Lugia', ability: 'receiver', moves: ['sleeptalk']},
			{species: 'Wynaut', ability: 'soulheart', level: 1, moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const passimian = battle.p1.active[0];
		const lugia = battle.p2.active[0];
		assert.statStage(passimian, 'spa', 2);
		assert.statStage(lugia, 'spa', 1);
	});
});
