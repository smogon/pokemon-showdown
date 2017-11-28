'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sitrus Berry', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should heal 25% hp when consumed', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Aggron', ability: 'sturdy', item: 'sitrusberry', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Lucario', ability: 'adaptability', moves: ['aurasphere']}]);
		const holder = battle.p1.active[0];
		battle.commitDecisions();
		assert.false.holdsItem(holder);
		assert.strictEqual(holder.hp, Math.floor(holder.maxhp / 4) + 1);
	});

	it('should be eaten immediately if (re)gained on low hp', function () {
		battle = common.createBattle([
			[{species: 'Magnemite', ability: 'sturdy', item: 'sitrusberry', moves: ['recycle']}],
			[{species: 'Garchomp', ability: 'roughskin', moves: ['earthquake']}],
		]);
		const holder = battle.p1.active[0];
		const hpgain = Math.floor(holder.maxhp / 4);
		battle.commitDecisions();
		assert.false.holdsItem(holder);
		assert.strictEqual(holder.hp, hpgain + hpgain + 1);
	});

	it('should not heal if Knocked Off', function () {
		battle = common.createBattle([
			[{species: 'Deoxys-Attack', ability: 'sturdy', item: 'sitrusberry', moves: ['sleeptalk']}],
			[{species: 'Krookodile', ability: 'intimidate', moves: ['knockoff']}],
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, 1);
	});

	it.skip('should not heal 25% hp if a confusion self-hit triggers the healing', function () {
		battle = common.createBattle([
			[{species: 'Deoxys-Attack', ability: 'pressure', item: 'sitrusberry', moves: ['sleeptalk']}],
			[{species: 'Sableye', ability: 'prankster', moves: ['confuseray']}],
		]);
		const holder = battle.p1.active[0];
		battle.commitDecisions();
		assert.holdsItem(holder);
		assert.false.strictEqual(holder.hp, holder.maxhp);
	});
});
