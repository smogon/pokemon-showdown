/**
 * PokéRogue: State management test suite
 * Tests getState(), setState(), deleteState() and PokeRogueState field handling.
 */
'use strict';

const assert = require('../../../assert');

describe('PokéRogue — State Management', function () {
	this.timeout(10000);
	let core;

	// Unique prefix to avoid collisions with real users during test runs
	const TEST_PREFIX = 'testpokerogue_state_';

	before(function () {
		try {
			core = require('../../../../dist/impulse/chat-plugins/pokerogue/pokerogue-core');
		} catch (e) {
			console.log('PokéRogue core not in dist, skipping:', e.message);
			this.skip();
		}
	});

	afterEach(() => {
		// Clean up any test users created during the test
		for (const key of Object.keys(core.savedData)) {
			if (key.startsWith(TEST_PREFIX)) {
				core.deleteState(key);
			}
		}
	});

	describe('getState()', () => {
		it('should return null for a non-existent user', () => {
			assert.equal(core.getState(`${TEST_PREFIX}nonexistent`), null);
		});

		it('should return the stored state by reference', () => {
			const userId = `${TEST_PREFIX}reftest`;
			const state = { floor: 3, team: [], coins: 100, streaksWon: 2 };
			core.setState(userId, state);
			const retrieved = core.getState(userId);
			assert(retrieved === core.savedData[userId], 'Should return the object by reference');
		});
	});

	describe('setState()', () => {
		it('should store and retrieve a basic state', () => {
			const userId = `${TEST_PREFIX}basic`;
			const state = { floor: 3, team: [], coins: 150, streaksWon: 2 };
			core.setState(userId, state);
			const retrieved = core.getState(userId);
			assert(retrieved !== null);
			assert.equal(retrieved.floor, 3);
			assert.equal(retrieved.coins, 150);
			assert.equal(retrieved.streaksWon, 2);
		});

		it('should store a complete state with all optional fields', () => {
			const userId = `${TEST_PREFIX}full`;
			const state = {
				floor: 10,
				team: [{ species: 'pikachu', level: 15, exp: 500 }],
				coins: 250,
				streaksWon: 8,
				items: { rarecandy: 2, leftovers: 1 },
				shopInventory: ['rarecandy', 'leftovers', 'focussash'],
				hasRevive: true,
				doubleExpFloors: 3,
				highestFloor: 12,
				displayName: 'TestPlayer',
				notification: 'You won!',
			};
			core.setState(userId, state);
			const retrieved = core.getState(userId);
			assert.equal(retrieved.floor, 10);
			assert.equal(retrieved.team[0].species, 'pikachu');
			assert.equal(retrieved.items.rarecandy, 2);
			assert.equal(retrieved.hasRevive, true);
			assert.equal(retrieved.doubleExpFloors, 3);
			assert.equal(retrieved.highestFloor, 12);
		});

		it('should store pendingGachaOffer field', () => {
			const userId = `${TEST_PREFIX}gacha`;
			const state = {
				floor: 5, team: [], coins: 0, streaksWon: 0,
				pendingGachaOffer: { species: 'mewtwo', sourceItemId: 'mastercapsule', isFeatured: true },
			};
			core.setState(userId, state);
			const retrieved = core.getState(userId);
			assert(retrieved.pendingGachaOffer !== undefined);
			assert.equal(retrieved.pendingGachaOffer.species, 'mewtwo');
			assert.equal(retrieved.pendingGachaOffer.sourceItemId, 'mastercapsule');
			assert.equal(retrieved.pendingGachaOffer.isFeatured, true);
		});

		it('should overwrite existing state', () => {
			const userId = `${TEST_PREFIX}overwrite`;
			core.setState(userId, { floor: 1, team: [], coins: 50, streaksWon: 0 });
			core.setState(userId, { floor: 5, team: [], coins: 200, streaksWon: 4 });
			const retrieved = core.getState(userId);
			assert.equal(retrieved.floor, 5);
			assert.equal(retrieved.coins, 200);
		});

		it('should store team with held items', () => {
			const userId = `${TEST_PREFIX}helditem`;
			const state = {
				floor: 3,
				team: [{ species: 'pikachu', level: 10, exp: 0, heldItem: 'leftovers' }],
				coins: 0, streaksWon: 0,
			};
			core.setState(userId, state);
			const retrieved = core.getState(userId);
			assert.equal(retrieved.team[0].heldItem, 'leftovers');
		});
	});

	describe('deleteState()', () => {
		it('should remove state for a user', () => {
			const userId = `${TEST_PREFIX}delete`;
			core.setState(userId, { floor: 1, team: [], coins: 0, streaksWon: 0 });
			assert(core.getState(userId) !== null);
			core.deleteState(userId);
			assert.equal(core.getState(userId), null);
		});

		it('should not throw when deleting non-existent user', () => {
			assert.doesNotThrow(() => {
				core.deleteState(`${TEST_PREFIX}never_existed`);
			});
		});

		it('should not affect other users when deleting', () => {
			const user1 = `${TEST_PREFIX}user1`;
			const user2 = `${TEST_PREFIX}user2`;
			core.setState(user1, { floor: 1, team: [], coins: 10, streaksWon: 0 });
			core.setState(user2, { floor: 2, team: [], coins: 20, streaksWon: 0 });
			core.deleteState(user1);
			assert.equal(core.getState(user1), null);
			assert(core.getState(user2) !== null, 'user2 should still exist');
			assert.equal(core.getState(user2).floor, 2);
		});
	});

	describe('savedData reference consistency', () => {
		it('should reflect mutations made directly to state object', () => {
			const userId = `${TEST_PREFIX}mutation`;
			const state = { floor: 1, team: [], coins: 0, streaksWon: 0 };
			core.setState(userId, state);
			// getState returns by reference — mutation should be visible without re-set
			const ref = core.getState(userId);
			ref.coins = 999;
			// The savedData object should reflect the mutation (in-memory)
			assert.equal(core.savedData[userId].coins, 999);
		});
	});

	describe('gameOver state', () => {
		it('should store and retrieve gameOver=true', () => {
			const userId = `${TEST_PREFIX}gameover`;
			const state = {
				floor: 15, team: [], coins: 0, streaksWon: 10,
				gameOver: true, lastRunFloor: 15, lastRunStreaks: 10,
			};
			core.setState(userId, state);
			const retrieved = core.getState(userId);
			assert.equal(retrieved.gameOver, true);
			assert.equal(retrieved.lastRunFloor, 15);
			assert.equal(retrieved.lastRunStreaks, 10);
		});
	});
});
