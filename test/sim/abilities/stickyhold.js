'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

const STEAL_MOVES = ['thief', 'knockoff', 'switcheroo', 'bugbite'];

describe('Sticky Hold', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should prevent held items from being stolen by most moves or abilities', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Shuckle', ability: 'stickyhold', item: 'razzberry', moves: ['recover'] }] });
		battle.setPlayer('p2', { team: [
			{ species: 'Fennekin', ability: 'magician', moves: ['grassknot'] },
			{ species: 'Smeargle', ability: 'synchronize', moves: STEAL_MOVES },
		] });
		const itemHolder = battle.p1.active[0];
		battle.makeChoices('move recover', 'move grassknot');
		assert.equal(itemHolder.item, 'razzberry', "Shuckle should hold a Razz Berry");
		battle.makeChoices('move recover', 'switch 2');

		for (const moveid of STEAL_MOVES) {
			battle.makeChoices('move recover', 'move ' + moveid);
			assert.holdsItem(itemHolder, "Shuckle should still hold its Razz Berry");
		}
	});

	it('should be suppressed by Mold Breaker', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Pangoro', ability: 'moldbreaker', moves: ['knockoff'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Shuckle', ability: 'stickyhold', item: 'ironball', moves: ['rest'] }] });
		battle.makeChoices('move knockoff', 'move rest');
		assert.false.holdsItem(battle.p2.active[0]);
	});

	it('should not prevent item theft if the holder faints', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Smeargle', moves: ['thief'] }] });
		battle.setPlayer('p2', { team: [
			{ species: 'Fennekin', level: 1, ability: 'stickyhold', item: 'leftovers', moves: ['sleeptalk'] },
			{ species: 'Squirtle', moves: ['sleeptalk'] },
		] });
		battle.makeChoices('move thief', 'move sleeptalk');
		assert.fainted(battle.p2.active[0]);
		assert.holdsItem(battle.p1.active[0]);
	});

	describe('[Gen 4]', () => {
		it('should prevent item theft if the holder faints', () => {
			battle = common.gen(4).createBattle();
			battle.setPlayer('p1', { team: [{ species: 'Smeargle', moves: ['thief'] }] });
			battle.setPlayer('p2', { team: [
				{ species: 'Fennekin', level: 1, ability: 'stickyhold', item: 'leftovers', moves: ['sleeptalk'] },
				{ species: 'Squirtle', moves: ['sleeptalk'] },
			] });
			battle.makeChoices('move thief', 'move sleeptalk');
			assert.fainted(battle.p2.active[0]);
			assert.false.holdsItem(battle.p1.active[0]);
		});
	});
});
