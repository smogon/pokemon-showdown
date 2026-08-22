'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Swagger', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should raise the target's Attack and confuse it`, () => {
		battle = common.createBattle([[
			{ species: 'Bulbasaur', moves: ['swagger'] },
		], [
			{ species: 'Pikachu', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const pikachu = battle.p2.active[0];
		assert.statStage(pikachu, 'atk', 2);
		assert(pikachu.volatiles['confusion']);
	});

	describe('[Gen 2]', () => {
		it(`should not confuse the target behind a Substitute`, () => {
			battle = common.gen(2).createBattle([[
				{ species: 'Bulbasaur', moves: ['swagger'] },
			], [
				{ species: 'Pikachu', moves: ['substitute'] },
			]]);
			battle.makeChoices();
			const pikachu = battle.p2.active[0];
			assert.statStage(pikachu, 'atk', 2);
			assert.false(pikachu.volatiles['confusion']);
		});
	});
});
