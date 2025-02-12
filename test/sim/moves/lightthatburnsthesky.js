'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

describe('Light That Burns The Sky', function () {
	it(`should be a special attack when base stats are tied`, function () {
		const battle = common.createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{species: 'regidrago', ability: 'dragonsmaw', moves: ['lightthatburnsthesky']},
		], [
			{species: 'regirock', ability: 'clearbody', moves: ['protect']},
		]]);
		battle.makeChoices('move lightthatburnsthesky', 'move protect');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Special');
	});

	it(`should be a physical attack with higher attack stat`, function () {
		const battle = common.createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{species: 'regidrago', ability: 'dragonsmaw', moves: ['lightthatburnsthesky', 'dragondance']},
		], [
			{species: 'regirock', ability: 'clearbody', moves: ['protect']},
		]]);
		// Dragon Dance boosts Regidrago's attack stat.
		battle.makeChoices('move dragondance', 'move protect');
		battle.makeChoices('move lightthatburnsthesky', 'move protect');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Physical');
	});

	it(`should be a physical attack with higher attack stat even if target ignores stat changes`, function () {
		const battle = common.createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{species: 'regidrago', ability: 'dragonsmaw', moves: ['lightthatburnsthesky', 'dragondance']},
		], [
			// Dondozo's Unaware should not affect the move's category.
			{species: 'dondozo', ability: 'unaware', moves: ['splash']},
		]]);
		// Dragon Dance boosts Regidrago's attack stat.
		battle.makeChoices('move dragondance', 'move splash');
		battle.makeChoices('move lightthatburnsthesky', 'move splash');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Physical');
	});
});
