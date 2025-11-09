'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle = null;

describe('Custom HP Percentage and Status Conditions', () => {
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

	it('should prevent battle from starting when a Pokemon has 0% HP', () => {
		assert.throws(() => {
			battle = common.createBattle([
				[{ species: 'Pikachu', ability: 'static', moves: ['thunderbolt'], hpPercentage: 0 }],
				[{ species: 'Charmander', ability: 'blaze', moves: ['ember'] }],
			]);
		}, /Battle not started.*fainted.*Pokémon/i);
	});

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
