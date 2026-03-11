'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Skill Swap', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not be able to Skill Swap certain abilities', () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'moxie', moves: ['skillswap', 'sleeptalk'] },
			{ species: 'wynaut', ability: 'schooling', moves: ['skillswap'] },
			{ species: 'wynaut', ability: 'wonderguard', moves: ['skillswap'] },
		], [
			{ species: 'ferroseed', ability: 'overcoat', moves: ['skillswap', 'sleeptalk'] },
			{ species: 'ferroseed', ability: 'schooling', moves: ['skillswap'] },
			{ species: 'ferroseed', ability: 'wonderguard', moves: ['skillswap'] },
		]]);

		let wynaut = battle.p1.active[0];
		let ferroseed = battle.p2.active[0];

		// user: Moxie; target: Overcoat; expected: success
		battle.makeChoices('move skillswap', 'move sleeptalk');
		assert.equal(wynaut.ability, 'overcoat');
		assert.equal(ferroseed.ability, 'moxie');

		// Skill Swap the abilities back
		battle.makeChoices('move skillswap', 'move sleeptalk');

		// user: Moxie; target: Schooling; expected: failure
		battle.makeChoices('move skillswap', 'switch 2');
		wynaut = battle.p1.active[0];
		ferroseed = battle.p2.active[0];
		assert.equal(wynaut.ability, 'moxie');
		assert.equal(ferroseed.ability, 'schooling');

		// user: Moxie; target: Wonder Guard; expected: failure
		battle.makeChoices('move skillswap', 'switch 3');
		wynaut = battle.p1.active[0];
		ferroseed = battle.p2.active[0];
		assert.equal(wynaut.ability, 'moxie');
		assert.equal(ferroseed.ability, 'wonderguard');

		// user: Wonder Guard; target: Moxie; expected: failure
		battle.makeChoices('move sleeptalk', 'move skillswap');
		wynaut = battle.p1.active[0];
		ferroseed = battle.p2.active[0];
		assert.equal(wynaut.ability, 'moxie');
		assert.equal(ferroseed.ability, 'wonderguard');

		// user: Schooling; target: Moxie; expected: failure
		battle.makeChoices('move sleeptalk', 'switch 3');
		battle.makeChoices('move sleeptalk', 'move skillswap');
		wynaut = battle.p1.active[0];
		ferroseed = battle.p2.active[0];
		assert.equal(wynaut.ability, 'moxie');
		assert.equal(ferroseed.ability, 'schooling');
	});

	it('should track ally through Ally Switch when ally uses Ally Switch', () => {
		battle = common.gen(8).createBattle({ gameType: 'doubles', forceRandomChance: false }, [[
			{ species: 'Wynaut', ability: 'moxie', moves: ['skillswap'] },
			{ species: 'Wobbuffet', ability: 'telepathy', moves: ['allyswitch'] },
		], [
			{ species: 'Pichu', moves: ['sleeptalk'] },
			{ species: 'Pichu', moves: ['sleeptalk'] },
		]]);

		// P1 slot 0 (Wynaut) uses Skill Swap on ally slot 1 (Wobbuffet), P1 slot 1 uses Ally Switch
		battle.makeChoices('move skillswap -2, move allyswitch', 'auto');

		// After Ally Switch: Wynaut moves to slot 1, Wobbuffet to slot 0.
		// Skill Swap tracked the ally (Wobbuffet), so Wynaut (Moxie) swaps with Wobbuffet (Telepathy).
		// Result: Wynaut gets Telepathy, Wobbuffet gets Moxie
		const wynaut = battle.p1.active.find(p => p.species.name === 'Wynaut');
		const wobbuffet = battle.p1.active.find(p => p.species.name === 'Wobbuffet');
		assert.equal(wynaut.ability, 'telepathy', 'Wynaut should have Telepathy (swapped from ally)');
		assert.equal(wobbuffet.ability, 'moxie', 'Wobbuffet should have Moxie (swapped from ally)');
	});

	it('should not track foe when opponent uses Ally Switch', () => {
		battle = common.gen(8).createBattle({ gameType: 'doubles', forceRandomChance: false }, [[
			{ species: 'Wynaut', ability: 'moxie', moves: ['skillswap'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Pichu', ability: 'static', moves: ['allyswitch'] },
			{ species: 'Pichu', ability: 'lightningrod', moves: ['sleeptalk'] },
		]]);

		// P1 slot 0 uses Skill Swap on foe slot 0 (Static), P2 uses Ally Switch (Static and Lightning Rod swap)
		battle.makeChoices('move skillswap 1, move sleeptalk', 'move allyswitch, move sleeptalk');

		// Slot-based: we targeted foe slot 0. After Ally Switch, slot 0 has Lightning Rod. So we hit Lightning Rod.
		const p1slot0 = battle.p1.active[0];
		const p2slot0 = battle.p2.active[0];
		assert.equal(p1slot0.ability, 'lightningrod', 'Should have swapped with Pokemon now in slot 0 (Lightning Rod), not original target (Static)');
		assert.equal(p2slot0.ability, 'moxie');
	});
});
