'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

describe('Tera Blast', () => {
	it(`should be a special attack when base stats are tied`, () => {
		const battle = common.gen(9).createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{ species: 'regidrago', ability: 'dragonsmaw', moves: ['terablast'] },
		], [
			{ species: 'regirock', ability: 'clearbody', moves: ['protect'] },
		]]);
		battle.makeChoices('move terablast terastallize', 'move protect');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Special');
	});

	it(`should be a physical attack when terastallized with higher attack stat`, () => {
		const battle = common.gen(9).createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{ species: 'regidrago', ability: 'dragonsmaw', moves: ['terablast', 'dragondance'] },
		], [
			{ species: 'regirock', ability: 'clearbody', moves: ['protect'] },
		]]);
		// Dragon Dance boosts Regidrago's attack stat.
		battle.makeChoices('move dragondance', 'move protect');
		battle.makeChoices('move terablast terastallize', 'move protect');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Physical');
	});

	it(`should be a special attack when not terastallized, even if attack stat is higher`, () => {
		const battle = common.createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{ species: 'regidrago', ability: 'dragonsmaw', moves: ['terablast', 'dragondance'] },
		], [
			{ species: 'regirock', ability: 'clearbody', moves: ['protect'] },
		]]);
		// Dragon Dance boosts Regidrago's attack stat.
		battle.makeChoices('move dragondance', 'move protect');
		// However, Regidrago is not terastallized when using Tera Blast.
		battle.makeChoices('move terablast', 'move protect');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Special');
	});

	it(`should be a special attack when terastallized even if target ignores stat changes`, () => {
		const battle = common.gen(9).createBattle([[
			// Regidrago has equal base attack and special attack stats.
			{ species: 'regidrago', ability: 'dragonsmaw', moves: ['terablast', 'dragondance'] },
		], [
			// Dondozo's Unaware should not affect Tera Blast's category.
			{ species: 'dondozo', ability: 'unaware', moves: ['splash'] },
		]]);
		// Dragon Dance boosts Regidrago's attack stat.
		battle.makeChoices('move dragondance', 'move splash');
		battle.makeChoices('move terablast terastallize', 'move splash');

		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Physical');
	});
});
