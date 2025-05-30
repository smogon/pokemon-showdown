'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Electrify', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not be overriden by -ate abilities', () => {
		battle = common.createBattle([[
			{ species: 'Landorus', moves: ['electrify'] },
		], [
			{ species: 'Blissey', ability: 'pixilate', moves: ['tackle'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
	});

	describe('Gen 7', () => {
		it('should be overriden by -ate abilities', () => {
			battle = common.gen(7).createBattle([[
				{ species: 'Landorus', moves: ['electrify'] },
			], [
				{ species: 'Blissey', ability: 'pixilate', moves: ['tackle'] },
			]]);
			battle.makeChoices();
			assert.false.fullHP(battle.p1.active[0]);
		});
	});
});
