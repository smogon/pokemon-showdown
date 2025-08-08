'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Leppa Berry', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should restore PP to the first move with any PP missing when eaten forcibly', () => {
		battle = common.createBattle([
			[{ species: 'Gyarados', ability: 'moxie', item: '', moves: ['sleeptalk', 'splash'] }],
			[{ species: 'Geodude', ability: 'sturdy', item: 'leppaberry', moves: ['sleeptalk', 'fling'] }],
		]);

		const pokemon = battle.p1.active[0];

		battle.makeChoices('move sleeptalk', 'move sleeptalk');
		battle.makeChoices('move splash', 'move fling');

		assert.equal(pokemon.getMoveData('sleeptalk').pp, 16);
		assert.false.equal(pokemon.getMoveData('splash').pp, 64);
	});

	describe('[Gen 4]', () => {
		it('should restore PP to the first move with any PP missing when eaten forcibly', () => {
			battle = common.gen(4).createBattle({ forceRandomChance: true }, [[
				{ species: 'Deoxys', item: 'leppaberry', moves: ['tackle'] },
			], [
				{ species: 'Nidoqueen', moves: ['sleeptalk'] },
			]]);
			const deoxys = battle.p1.active[0];
			deoxys.moveSlots[0].pp = 1;
			battle.makeChoices();
			assert.equal(deoxys.moveSlots[0].pp, 10);
		});

		it('should not activate before an insta switch', () => {
			battle = common.gen(4).createBattle({ forceRandomChance: true }, [[
				{ species: 'Deoxys', item: 'leppaberry', moves: ['u-turn'] },
				{ species: 'Togekiss', moves: ['sleeptalk'] },
			], [
				{ species: 'Nidoqueen', moves: ['sleeptalk'] },
			]]);
			const deoxys = battle.p1.active[0];
			deoxys.moveSlots[0].pp = 1;
			battle.makeChoices();
			battle.makeChoices();
			assert.equal(deoxys.moveSlots[0].pp, 0);
			battle.makeChoices('switch 2', 'move sleeptalk');
			assert.equal(deoxys.moveSlots[0].pp, 10);
		});
	});
});
