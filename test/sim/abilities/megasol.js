'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mega Sol', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should apply Sunny Day damage boosts', () => {
		battle = common.createBattle([[
			{ species: "Meganium", item: 'meganiumite', moves: ['weatherball'] },
		], [
			{ species: "Pelipper", ability: 'drizzle', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move weatherball mega', 'move sleeptalk');
		const pelipper = battle.p2.active[0];
		assert.bounded(pelipper.maxhp - pelipper.hp, [98, 116]);
	});

	it('should bypass weather defensive boosts', () => {
		battle = common.createBattle([[
			{ species: "Meganium", item: 'meganiumite', moves: ['weatherball'] },
		], [
			{ species: "Tyranitar", item: 'tyranitarite', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move weatherball mega', 'move sleeptalk mega');
		const tyranitar = battle.p2.active[0];
		assert.bounded(tyranitar.maxhp - tyranitar.hp, [63, 75]);
	});
});
