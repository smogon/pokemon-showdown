'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mimic', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should replace Mimic's slot by the last move used by the target`, () => {
		battle = common.createBattle([[
			{ species: 'Smeargle', moves: ['mimic'] },
		], [
			{ species: 'Mew', moves: ['tackle'] },
		]]);
		battle.makeChoices();
		const moveSlots = battle.p1.active[0].moveSlots;
		assert.equal(moveSlots.length, 1);
		assert.equal(moveSlots[0].id, 'tackle');
	});

	describe('[Gen 3]', () => {
		it(`should replace the Mimic slot that was actually used`, () => {
			battle = common.gen(3).createBattle([[
				{ species: 'Smeargle', moves: ['mimic', 'mimic'] },
			], [
				{ species: 'Mew', moves: ['tackle'] },
			]]);
			battle.makeChoices('move 2', 'move tackle');
			const moveSlots = battle.p1.active[0].moveSlots;
			assert.equal(moveSlots[0].id, 'mimic');
			assert.equal(moveSlots[1].id, 'tackle');
		});
	});
});
