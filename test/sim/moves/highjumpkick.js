'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('High Jump Kick', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should damage the user if it does not hit the target', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: 'Gastly', ability: 'levitate', moves: ['sleeptalk'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Hitmonlee', ability: 'limber', moves: ['highjumpkick'] },
		] });

		assert.hurts(battle.p2.active[0], () => battle.makeChoices());
	});

	it('should not damage the user if there was no target', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: 'Dugtrio', ability: 'sandveil', moves: ['memento'] },
			{ species: 'Dugtrio', ability: 'sandveil', moves: ['memento'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Hitmonlee', ability: 'limber', moves: ['highjumpkick'] },
		] });

		assert.false.hurts(battle.p2.active[0], () => battle.makeChoices());
	});
});
