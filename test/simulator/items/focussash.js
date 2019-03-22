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
		battle.setPlayer('p1', {team: [{species: 'Paras', ability: 'dryskin', item: 'focussash', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: 'Delphox', ability: 'magician', moves: ['incinerate']}]});
		const holder = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'move incinerate');
		assert.false.holdsItem(holder);
		assert.false.fainted(holder);
		assert.strictEqual(holder.hp, 1);
	});

	it('should be consumed and allow its user to survive a confusion damage hit from full HP', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Shedinja', ability: 'wonderguard', item: 'focussash', moves: ['absorb']}]});
		battle.setPlayer('p2', {team: [{species: 'Klefki', ability: 'prankster', moves: ['confuseray']}]});
		const holder = battle.p1.active[0];
		battle.makeChoices('move absorb', 'move confuseray');
		assert.false.holdsItem(holder);
		assert.false.fainted(holder);
		assert.strictEqual(holder.hp, 1);
	});

	it('should not trigger on recoil damage', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Shedinja', ability: 'wonderguard', item: 'focussash', moves: ['doubleedge']}]});
		battle.setPlayer('p2', {team: [{species: 'Klefki', ability: 'prankster', moves: ['reflect']}]});
		const holder = battle.p1.active[0];
		battle.makeChoices('move doubleedge', 'move reflect');
		assert.holdsItem(holder);
		assert.fainted(holder);
	});

	it('should not trigger on residual damage', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Shedinja', ability: 'wonderguard', item: 'focussash', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: 'Crobat', ability: 'infiltrator', moves: ['toxic']}]});
		const holder = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'move toxic');
		assert.holdsItem(holder);
		assert.fainted(holder);
	});
});
