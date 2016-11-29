'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Focus Sash', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should be consumed and allow its user to survive an attack from full HP', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Paras', ability: 'dryskin', item: 'focussash', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Delphox', ability: 'magician', moves: ['incinerate']}]);
		const holder = battle.p1.active[0];
		battle.commitDecisions();
		assert.false.holdsItem(holder);
		assert.false.fainted(holder);
		assert.strictEqual(holder.hp, 1);
	});

	it('should be consumed and allow its user to survive a confusion damage hit from full HP', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Shedinja', ability: 'wonderguard', item: 'focussash', moves: ['absorb']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Klefki', ability: 'prankster', moves: ['confuseray']}]);
		const holder = battle.p1.active[0];
		battle.seed = common.maxRollSeed;
		battle.commitDecisions();
		assert.false.holdsItem(holder);
		assert.false.fainted(holder);
		assert.strictEqual(holder.hp, 1);
	});

	it('should not trigger on recoil damage', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Shedinja', ability: 'wonderguard', item: 'focussash', moves: ['doubleedge']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Klefki', ability: 'prankster', moves: ['reflect']}]);
		const holder = battle.p1.active[0];
		battle.commitDecisions();
		assert.holdsItem(holder);
		assert.fainted(holder);
	});

	it('should not trigger on residual damage', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Shedinja', ability: 'wonderguard', item: 'focussash', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'infiltrator', moves: ['toxic']}]);
		const holder = battle.p1.active[0];
		battle.commitDecisions();
		assert.holdsItem(holder);
		assert.fainted(holder);
	});
});
