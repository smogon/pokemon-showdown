'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Fairy Aura', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should boost Mold Breaker moves', () => {
		battle = common.createBattle([[
			{ species: 'Ampharos-Mega', ability: 'moldbreaker', moves: ['moonblast'] },
		], [
			{ species: 'Xerneas', ability: 'fairyaura', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const xerneas = battle.p2.active[0];
		assert.bounded(xerneas.maxhp - xerneas.hp, [142, 168]);
	});

	describe('[Gen 7]', () => {
		it('should not boost Mold Breaker moves', () => {
			battle = common.gen(7).createBattle([[
				{ species: 'Ampharos-Mega', ability: 'moldbreaker', moves: ['moonblast'] },
			], [
				{ species: 'Xerneas', ability: 'fairyaura', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			const xerneas = battle.p2.active[0];
			assert.bounded(xerneas.maxhp - xerneas.hp, [107, 127]);
		});
	});
});
