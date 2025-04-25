'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sheer Force', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not eliminate Life Orb recoil in a move with no secondary effects', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Tauros', ability: 'sheerforce', item: 'lifeorb', moves: ['earthquake'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Lapras', ability: 'shellarmor', item: 'laggingtail', moves: ['rest'] }] });
		battle.makeChoices('move earthquake', 'move rest');
		assert.equal(battle.p1.active[0].hp, 262);
	});

	it('should eliminate secondary effects from moves', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Tauros', ability: 'sheerforce', moves: ['zapcannon'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Machamp', ability: 'noguard', moves: ['bulkup'] }] });
		battle.makeChoices('move zapcannon', 'move bulkup');
		assert.equal(battle.p2.active[0].status, '');
	});

	it('should not eliminate Life Orb recoil if the ability is disabled/removed mid-attack', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Tauros', ability: 'sheerforce', item: 'lifeorb', moves: ['lockon', 'dynamicpunch'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Scyther', ability: 'mummy', moves: ['irondefense'] }] });
		battle.makeChoices('move lockon', 'move irondefense');
		battle.makeChoices('move dynamicpunch', 'move irondefense');
		assert.false(battle.p2.active[0].volatiles['confusion']);
		assert.equal(battle.p1.active[0].hp, 262);
	});

	it('should eliminate Life Orb recoil in a move with secondary effects', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Tauros', ability: 'sheerforce', item: 'lifeorb', moves: ['bodyslam'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Lapras', ability: 'shellarmor', item: 'laggingtail', moves: ['rest'] }] });
		battle.makeChoices('move bodyslam', 'move rest');
		assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it(`should not be possible to thaw a frozen target with a Sheer Force-boosted thawsTarget move`, () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'sheerforce', moves: ['sleeptalk', 'scald'] },
		], [
			{ species: 'shuckle', moves: ['meteorassault'] },
		]]);
		battle.makeChoices(); // Use Meteor Assault to force recharge next turn and skip potential thaw
		const frozenMon = battle.p2.active[0];
		frozenMon.setStatus('frz');
		battle.makeChoices('move scald', 'auto');
		assert.equal(frozenMon.status, 'frz');
	});

	it(`should be possible to thaw a frozen target with a Sheer Force-boosted Fire-type move`, () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'sheerforce', moves: ['sleeptalk', 'flamethrower'] },
		], [
			{ species: 'shuckle', moves: ['meteorassault'] },
		]]);
		battle.makeChoices(); // Use Meteor Assault to force recharge next turn and skip potential thaw
		const frozenMon = battle.p2.active[0];
		frozenMon.setStatus('frz');
		battle.makeChoices('move flamethrower', 'auto');
		assert.equal(frozenMon.status, '');
	});
});
