'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sitrus Berry', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should heal 25% hp when consumed', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Aggron', ability: 'sturdy', item: 'sitrusberry', moves: ['sleeptalk'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Lucario', ability: 'adaptability', moves: ['aurasphere'] }] });
		const holder = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'move aurasphere');
		assert.false.holdsItem(holder);
		assert.equal(holder.hp, Math.floor(holder.maxhp / 4) + 1);
	});

	it('should be eaten immediately if (re)gained on low hp', () => {
		battle = common.createBattle([
			[{ species: 'Magnemite', ability: 'sturdy', item: 'sitrusberry', moves: ['recycle'] }],
			[{ species: 'Garchomp', ability: 'roughskin', moves: ['earthquake'] }],
		]);
		const holder = battle.p1.active[0];
		const hpgain = Math.floor(holder.maxhp / 4);
		battle.makeChoices('move recycle', 'move earthquake');
		assert.false.holdsItem(holder);
		assert.equal(holder.hp, hpgain + hpgain + 1);
	});

	it('should not heal if Knocked Off', () => {
		battle = common.createBattle([
			[{ species: 'Deoxys-Attack', ability: 'sturdy', item: 'sitrusberry', moves: ['sleeptalk'] }],
			[{ species: 'Krookodile', ability: 'intimidate', moves: ['knockoff'] }],
		]);
		battle.makeChoices('move sleeptalk', 'move knockoff');
		assert.equal(battle.p1.active[0].hp, 1);
	});

	it.skip(`should not heal 25% HP if a confusion self-hit would bring the user into Berry trigger range`, () => {
		battle = common.createBattle([[
			{ species: 'Deoxys-Attack', item: 'sitrusberry', moves: ['sleeptalk'] },
		], [
			{ species: 'Sableye', ability: 'prankster', moves: ['confuseray'] },
		]]);
		const holder = battle.p1.active[0];
		battle.makeChoices('move sleeptalk', 'move confuseray');
		assert.holdsItem(holder);
		assert.false.fullHP(holder);
	});

	it.skip(`should heal 25% HP immediately after any end-of-turn effect`, () => {
		battle = common.createBattle([[
			{ species: 'mimikyu', moves: ['curse'] },
		], [
			{ species: 'darmanitan', ability: 'zenmode', item: 'sitrusberry', moves: ['sleeptalk'], evs: { hp: 4 } },
		]]);
		const darm = battle.p2.active[0];
		battle.makeChoices();
		battle.makeChoices();
		assert.species(darm, 'Darmanitan', `Sitrus Berry should heal Darmanitan outside of Zen Mode range.`);
	});

	describe('[Gen 3]', () => {
		it('should not activate in the same turn that was put below 50% HP by a status condition', () => {
			battle = common.gen(3).createBattle([[
				{ species: 'swampert', item: 'sitrusberry', moves: ['sleeptalk'] },
			], [
				{ species: 'charizard', moves: ['toxic'] },
			]]);
			for (let i = 0; i < 4; i++) {
				battle.makeChoices();
			}
			assert.holdsItem(battle.p1.active[0]);
			assert(battle.p1.active[0].hp < battle.p1.active[0].maxhp / 2);
			battle.makeChoices();
			assert.false.holdsItem(battle.p1.active[0]);
		});
	});
});
