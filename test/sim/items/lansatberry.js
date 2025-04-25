'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Lansat Berry', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should apply a Focus Energy effect when consumed', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Aggron', ability: 'sturdy', item: 'lansatberry', moves: ['sleeptalk'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Lucario', ability: 'adaptability', moves: ['aurasphere'] }] });
		const holder = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'move aurasphere');
		assert.false.holdsItem(holder);
		assert('focusenergy' in holder.volatiles);
	});

	it('should start to apply the effect even in middle of an attack', () => {
		battle = common.createBattle([
			[{ species: 'Makuhita', ability: 'guts', item: 'lansatberry', moves: ['triplekick'] }],
			[{ species: 'Muk', ability: 'noguard', item: 'rockyhelmet', moves: ['acidarmor'] }],
		]);
		const holder = battle.p1.active[0];

		let i = 0;
		const expectedRatio = [1, 1, 1, 1, 1, 3];
		battle.onEvent('ModifyCritRatio', battle.format, -99, (critRatio, pokemon) => {
			assert.equal(critRatio, expectedRatio[i++]);
		});

		battle.makeChoices('move triplekick', 'move acidarmor');
		battle.makeChoices('move triplekick', 'move acidarmor');

		assert.false.holdsItem(holder);
		assert.equal(holder.hp, 3);
		assert.equal(i, 6);
	});
});
