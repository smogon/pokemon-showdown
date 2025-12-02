'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

// WHY BATTLE IS INITIALIZED TO NULL:
// The battle variable stores the current battle instance for each test.
// It's initialized to null so the afterEach hook can safely check if a battle
// exists before attempting to destroy it. This is necessary because tests that
// verify battle validation errors will not create a battle instance (they throw
// before creation completes), so battle remains null in those cases.
let battle = null;

describe('Custom HP Percentage and Status Conditions', () => {
	// WHY THIS AFTEREACH HOOK IS NEEDED:
	// Each test creates a battle instance that allocates resources. This hook ensures
	// proper cleanup after each test by:
	// 1. Checking if battle exists (it won't for tests expecting errors)
	// 2. Calling destroy() to release resources and prevent memory leaks
	// 3. Resetting battle to null for the next test
	//
	// HOW IT WORKS:
	// - The 'if (battle)' check prevents errors when tests don't create battles
	// - This pattern allows both successful battle tests and error-throwing tests
	//   to coexist in the same test suite
	afterEach(() => {
		if (battle) {
			battle.destroy();
			battle = null;
		}
	});

	it('should start Pokemon with custom HP percentage', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], hpPercentage: 50 }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		// HP should be 50% of maxhp
		assert.equal(pikachu.hp, Math.floor(pikachu.maxhp * 0.5));
	});

	it('should start Pokemon with custom status condition - burn', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], status: 'brn' }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		assert.equal(pikachu.status, 'brn');
	});

	it('should start Pokemon with custom status condition - poison', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], status: 'psn' }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		assert.equal(pikachu.status, 'psn');
	});

	it('should start Pokemon with custom status condition - paralysis', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], status: 'par' }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		assert.equal(pikachu.status, 'par');
	});

	it('should start Pokemon with custom status condition - toxic', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], status: 'tox' }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		assert.equal(pikachu.status, 'tox');
	});

	it('should start Pokemon with custom status condition - sleep', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], status: 'slp' }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		assert.equal(pikachu.status, 'slp');
	});

	it('should start Pokemon with custom status condition - freeze', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], status: 'frz' }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		assert.equal(pikachu.status, 'frz');
	});

	it('should start Pokemon with both custom HP percentage and status', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], hpPercentage: 25, status: 'psn' }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		assert.equal(pikachu.hp, Math.floor(pikachu.maxhp * 0.25));
		assert.equal(pikachu.status, 'psn');
	});

	it('should start Pokemon at full HP when hpPercentage is 100', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], hpPercentage: 100 }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		assert.equal(pikachu.hp, pikachu.maxhp);
	});

	it('should start Pokemon with 1 HP when hpPercentage is 1', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], hpPercentage: 1 }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		const expectedHp = Math.floor(pikachu.maxhp * 0.01);
		assert.equal(pikachu.hp, expectedHp);
	});

	it('should clamp hpPercentage to 0-100 range (testing 150)', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], hpPercentage: 150 }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		// Should be clamped to 100%
		assert.equal(pikachu.hp, pikachu.maxhp);
	});

	// TEST: Verify battles cannot start with fainted pokemon (0% HP)
	//
	// WHY THIS TEST IS NEEDED:
	// The custom HP percentage feature allows setting initial HP, but battles should
	// never start with fainted pokemon (0% HP). This test ensures the validation in
	// battle.start() correctly prevents such invalid battle states.
	//
	// HOW IT WORKS:
	// - Uses assert.throws to verify an error is thrown
	// - Creates a team with one pokemon at 0% HP using hpPercentage: 0
	// - Regex pattern checks the error message contains "Battle not started", "fainted", and "Pokémon"
	// - If no error is thrown or the message doesn't match, the test fails
	//
	// WHY THIS LOCATION:
	// Placed after tests for valid HP percentages (1-100%) to show the boundary condition
	// where 0% HP is not allowed, establishing clear validation rules.
	it('should prevent battle from starting when a Pokemon has 0% HP', () => {
		assert.throws(() => {
			battle = common.createBattle([
				[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], hpPercentage: 0 }],
				[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
			]);
		}, /Battle not started.*fainted.*Pokémon/i);
	});

	// TEST: Verify battles cannot start with multiple fainted pokemon
	//
	// WHY THIS TEST IS NEEDED:
	// Extends the previous test to ensure the validation works correctly when multiple
	// pokemon are fainted, not just one. This verifies the error message correctly
	// pluralizes and counts all fainted pokemon.
	//
	// HOW IT WORKS:
	// - Creates a team with TWO pokemon at 0% HP
	// - Regex pattern checks for "2 fainted" in the error message
	// - Ensures the validation catches all fainted pokemon, not just the first one
	//
	// WHY THIS LOCATION:
	// Immediately follows the single fainted pokemon test to demonstrate the validation
	// scales correctly to handle multiple fainted pokemon.
	it('should prevent battle from starting when multiple Pokemon have 0% HP', () => {
		assert.throws(() => {
			battle = common.createBattle([
				[
					{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], hpPercentage: 0 },
					{ species: 'Raichu', ability: 'static', moves: ['thunderbolt'], hpPercentage: 0 },
				],
				[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
			]);
		}, /Battle not started.*2 fainted.*Pokémon/i);
	});

	it('should handle status name with proper casing (BRN -> brn)', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], status: 'BRN' }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		assert.equal(pikachu.status, 'brn');
	});

	it('should ignore invalid status conditions', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], status: 'invalidstatus' }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		assert.equal(pikachu.status, '');
	});

	it('should allow Pokemon without custom HP or status to start normally', () => {
		battle = common.createBattle([
			[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'] }],
			[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
		]);
		const pikachu = battle.p1.active[0];
		assert.equal(pikachu.hp, pikachu.maxhp);
		assert.equal(pikachu.status, '');
	});
});
