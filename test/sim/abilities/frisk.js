'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Frisk', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should reveal opposing Pokemon's items`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Dusclops', ability: 'frisk', moves: ['snore']},
			{species: 'Duskull', ability: 'levitate', moves: ['snore']},
		], [
			{species: 'Spectrier', ability: 'grimneigh', item: 'choicespecs', moves: ['shadowball']},
			{species: 'Glastrier', ability: 'chillingneigh', item: 'choiceband', moves: ['avalanche']},
		]]);
		const log = battle.getDebugLog();
		assert(log.indexOf('Spectrier|Choice Specs') > -1, "Frisk should have revealed Spectrier's Choice Specs");
		assert(log.indexOf('Glastrier|Choice Band') > -1, "Frisk should have revealed Glastrier's Choice Band");
	});

	it(`should not reveal opposing fainted Pokemon's items`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Dusclops', ability: 'frisk', moves: ['snore']},
			{species: 'Duskull', ability: 'levitate', moves: ['snore']},
		], [
			{species: 'Pikachu', ability: 'static', item: 'lightball', moves: ['snore']},
			{species: 'Weezing', ability: 'neutralizinggas', item: 'choiceband', moves: ['explosion']},
			{species: 'Pichu', ability: 'static', moves: ['snore']},
		]]);
		battle.makeChoices();
		assert.false(battle.log.find(line => line.startsWith('|-item|')),
			"Frisk should not have revealed any items before or after Neutralizing Gas's effect");
	});
});
