'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Recycle', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should restore the user's last item`, () => {
		battle = common.createBattle([[
			{ species: "Snorlax", item: 'lumberry', moves: ['recycle'] },
		], [
			{ species: "Gengar", moves: ['toxic'] },
		]]);
		battle.makeChoices();
		battle.makeChoices();
		const snorlax = battle.p1.active[0];
		assert.fullHP(snorlax);
		assert.equal(snorlax.item, 'lumberry');
		assert.equal(snorlax.status, '');
	});

	describe('[Gen 4]', () => {
		it(`should restore the slot's last item`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "Wynaut", item: 'lumberry', moves: ['sleeptalk'] },
				{ species: "Snorlax", moves: ['recycle'] },
			], [
				{ species: "Gengar", moves: ['toxic', 'sleeptalk'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('switch 2', 'move sleeptalk');
			const snorlax = battle.p1.active[0];
			battle.makeChoices('move recycle', 'move sleeptalk');
			assert.equal(snorlax.item, 'lumberry');
			battle.makeChoices();
			battle.makeChoices();
			assert.fullHP(snorlax);
			assert.equal(snorlax.item, 'lumberry');
			assert.equal(snorlax.status, '');
		});
	});
});
