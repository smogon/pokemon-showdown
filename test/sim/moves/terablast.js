'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

describe('Tera Blast', function () {
	it(`should be a special attack when base stats are tied`, function () {
		const battle = common.gen(9).createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{species: 'regidrago', ability: 'dragonsmaw', moves: ['terablast']},
		], [
			{species: 'regirock', ability: 'clearbody', moves: ['protect']},
		]]);
		battle.makeChoices('move terablast terastallize', 'move protect');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Special');
	});

	it(`should be a physical attack when terastallized with higher attack stat`, function () {
		const battle = common.gen(9).createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{species: 'regidrago', ability: 'dragonsmaw', moves: ['terablast', 'dragondance']},
		], [
			{species: 'regirock', ability: 'clearbody', moves: ['protect']},
		]]);
		// Dragon Dance boosts Regidrago's attack stat.
		battle.makeChoices('move dragondance', 'move protect');
		battle.makeChoices('move terablast terastallize', 'move protect');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Physical');
	});

	it(`should be a special attack when not terastallized, even if attack stat is higher`, function () {
		const battle = common.createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{species: 'regidrago', ability: 'dragonsmaw', moves: ['terablast', 'dragondance']},
		], [
			{species: 'regirock', ability: 'clearbody', moves: ['protect']},
		]]);
		// Dragon Dance boosts Regidrago's attack stat.
		battle.makeChoices('move dragondance', 'move protect');
		// However, Regidrago is not terastallized when using Tera Blast.
		battle.makeChoices('move terablast', 'move protect');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Special');
	});

	// Skipped until https://github.com/smogon/pokemon-showdown/issues/9381 is fixed.
	it.skip(`should be a special attack when terastallized even if target ignores stat changes`, function () {
		const battle = common.gen(9).createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{species: 'regidrago', ability: 'dragonsmaw', moves: ['terablast', 'dragondance']},
		], [
			// Dondozo's Unaware should not affect Tera Blast's category.
			{species: 'dondozo', ability: 'unaware', moves: ['splash']},
		]]);
		// Dragon Dance boosts Regidrago's attack stat.
		battle.makeChoices('move dragondance', 'move splash');
		battle.makeChoices('move terablast terastallize', 'move splash');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Physical');
	});
});
