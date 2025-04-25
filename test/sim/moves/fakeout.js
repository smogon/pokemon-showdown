'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Fake Out', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should flinch on the first turn out', () => {
		battle = common.createBattle([[
			{ species: 'Chansey', ability: 'naturalcure', moves: ['fakeout'] },
		], [
			{ species: 'Venusaur', ability: 'overgrow', moves: ['swift'] },
		]]);
		battle.makeChoices('move fakeout', 'move swift');
		assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not flinch on the second turn out', () => {
		battle = common.createBattle([[
			{ species: 'Chansey', ability: 'naturalcure', moves: ['fakeout'] },
		], [
			{ species: 'Venusaur', ability: 'overgrow', moves: ['swift'] },
		]]);
		battle.makeChoices('move fakeout', 'move swift');
		assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		battle.makeChoices('move fakeout', 'move swift');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should flinch after switching out and back in to refresh the move', () => {
		battle = common.createBattle([[
			{ species: 'Chansey', ability: 'naturalcure', moves: ['fakeout'] },
			{ species: 'Blissey', ability: 'naturalcure', moves: ['fakeout'] },
		], [
			{ species: 'Venusaur', ability: 'overgrow', moves: ['swift', 'sleeptalk'] },
		]]);
		battle.makeChoices('move fakeout', 'move swift');
		battle.makeChoices('switch 2', 'move sleeptalk');
		battle.makeChoices('switch 2', 'move sleeptalk');
		battle.makeChoices('move fakeout', 'move swift');
		assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not flinch if the user has already used a Dancer move first', () => {
		battle = common.createBattle([[
			{ species: 'Chansey', ability: 'naturalcure', moves: ['fakeout'] },
			{ species: 'Oricorio', ability: 'dancer', moves: ['fakeout'] },
		], [
			{ species: 'Venusaur', ability: 'overgrow', moves: ['swift', 'quiverdance'] },
		]]);
		battle.makeChoices('switch 2', 'move quiverdance');
		battle.makeChoices('move fakeout', 'move swift');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not flinch if the target had prepared to Focus Punch', () => {
		battle = common.createBattle([[
			{ species: 'Hitmontop', ability: 'steadfast', moves: ['fakeout'] },
		], [
			{ species: 'Gallade', ability: 'steadfast', moves: ['focuspunch'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p2.active[0].boosts.spe, 0);
	});
});
