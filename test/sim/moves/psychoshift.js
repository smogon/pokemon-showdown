'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Psycho Shift', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should cure the user after transferring status`, () => {
		battle = common.createBattle([[
			{ species: 'gardevoir', ability: 'synchronize', moves: ['toxic'] },
		], [
			{ species: 'noctowl', moves: ['psycho shift'] },
		]]);
		battle.makeChoices();
		assert.false(battle.p2.active[0].status);
	});

	describe('[Gen 4]', () => {
		it(`should cure the user before transferring status`, () => {
			battle = common.gen(4).createBattle([[
				{ species: 'gardevoir', ability: 'synchronize', moves: ['toxic'] },
			], [
				{ species: 'noctowl', moves: ['psycho shift'] },
			]]);
			battle.makeChoices();
			assert.equal(battle.p2.active[0].status, 'psn');
		});
	});
});
