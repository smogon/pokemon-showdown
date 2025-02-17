'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

describe('Shell Side Arm', function () {
	it(`should be a special attack if that is forecasted to damage the target more`, function () {
		const battle = common.createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{species: 'regidrago', ability: 'dragonsmaw', moves: ['shellsidearm', 'splash']},
		], [
			// Shuckle has equal base defense and special defense stats.
			{species: 'shuckle', ability: 'sturdy', moves: ['protect', 'growl']},
		]]);
		// Growl lowers Regidrago's attack stat.
		battle.makeChoices('move splash', 'move growl');
		battle.makeChoices('move shellsidearm', 'move protect');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Special');
	});

	it(`should be a physical attack if that is forecasted to damage the target moreshould be a physical attack with higher attack stat`, function () {
		const battle = common.createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{species: 'regidrago', ability: 'dragonsmaw', moves: ['shellsidearm', 'dragondance']},
		], [
			// Shuckle has equal base defense and special defense stats.
			{species: 'shuckle', ability: 'sturdy', moves: ['protect']},
		]]);
		// Dragon Dance boosts Regidrago's attack stat.
		battle.makeChoices('move dragondance', 'move protect');
		battle.makeChoices('move shellsidearm', 'move protect');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Physical');
	});

	it(`should be a physical attack if that is forecasted to damage the target more even if target ignores stat changes`, function () {
		const battle = common.createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{species: 'regidrago', ability: 'dragonsmaw', moves: ['shellsidearm', 'dragondance']},
		], [
			// Shuckle has equal base defense and special defense stats.
			// Shuckle's Unaware should not affect the move's category.
			{species: 'shuckle', ability: 'unaware', moves: ['protect']},
		]]);
		// Dragon Dance boosts Regidrago's attack stat.
		battle.makeChoices('move dragondance', 'move protect');
		battle.makeChoices('move shellsidearm', 'move protect');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Physical');
	});
});
