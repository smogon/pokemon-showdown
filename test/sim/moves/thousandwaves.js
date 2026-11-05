'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Thousand Waves', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should apply the trapped volatile to Ghost-types, but they can still switch out', () => {
		battle = common.createBattle([[
			{ species: "Smeargle", moves: ['thousandwaves'] },
		], [
			{ species: "Dusknoir", moves: ['sleeptalk'] },
			{ species: "Starmie", moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move thousandwaves', 'move sleeptalk');
		assert(battle.p2.active[0].volatiles['trapped']);
		battle.makeChoices('move thousandwaves', 'switch 2');
		assert.species(battle.p2.active[0], 'Starmie');
	});

	describe('[Gen 7]', () => {
		it('should trap a non-Ghost-type replacement when the Ghost-type target uses Baton Pass', () => {
			battle = common.gen(7).createBattle([[
				{ species: "Smeargle", moves: ['thousandwaves', 'sleeptalk'] },
			], [
				{ species: "Dusknoir", moves: ['batonpass'] },
				{ species: "Starmie", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move thousandwaves', 'move batonpass');
			battle.makeChoices('', 'switch 2');
			assert.species(battle.p2.active[0], 'Starmie');
			assert(battle.p2.active[0].volatiles['trapped']);
			assert.trapped(() => battle.makeChoices('move sleeptalk', 'switch 2'));
			assert.species(battle.p2.active[0], 'Starmie');
		});
	});
});
