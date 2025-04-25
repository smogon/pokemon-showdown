'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pain Split', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should reduce the HP of the target to the average of the user and target', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Shedinja', ability: 'wonderguard', moves: ['painsplit'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Arceus', ability: 'multitype', moves: ['judgment'] }] });
		battle.makeChoices('move painsplit', 'move judgment');
		assert.equal(battle.p2.active[0].hp, (battle.p2.active[0].maxhp + 1) / 2);
	});

	it('should calculate HP changes against a dynamaxed target properly', () => {
		battle = common.gen(8).createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Drifblim', ability: 'unburden', moves: ['painsplit'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Blissey', ability: 'serenegrace', moves: ['doubleedge'] }] });

		battle.makeChoices('move painsplit', 'move doubleedge dynamax');

		// HP values taken from https://www.smogon.com/forums/threads/3655528/post-8289396
		battle.p1.active[0].sethp(160); // non-dynamaxed
		battle.p2.active[0].sethp(174); // dynamaxed
		battle.makeChoices('move painsplit', 'move doubleedge');
		assert.equal(battle.p1.active[0].hp, 123, 'non-dynamaxed');
		assert.equal(battle.p2.active[0].hp, 210, 'dynamaxed');
	});
});
