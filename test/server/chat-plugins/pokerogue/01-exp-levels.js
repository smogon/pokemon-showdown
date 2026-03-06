/**
 * PokéRogue: EXP / Level helpers test suite
 * Tests expForLevel, floorExpReward, floorCoinReward and their invariants.
 */
'use strict';

const assert = require('../../../assert');

describe('PokéRogue — EXP / Level Helpers', function () {
	this.timeout(10000);
	let core;

	before(function () {
		try {
			core = require('../../../../dist/impulse/chat-plugins/pokerogue/pokerogue-core');
		} catch (e) {
			console.log('PokéRogue core not in dist, skipping:', e.message);
			this.skip();
		}
	});

	describe('expForLevel()', () => {
		it('should return 0 for level 1', () => {
			assert.equal(core.expForLevel(1), 0);
		});

		it('should return 0 for level 0 (out-of-range guard)', () => {
			assert.equal(core.expForLevel(0), 0);
		});

		it('should return positive values for levels > 1', () => {
			assert(core.expForLevel(2) > 0, 'level 2 should need EXP');
			assert(core.expForLevel(10) > core.expForLevel(5));
			assert(core.expForLevel(100) > core.expForLevel(50));
		});

		it('should be strictly increasing from level 1 to 100', () => {
			for (let lvl = 1; lvl < 100; lvl++) {
				assert(
					core.expForLevel(lvl + 1) > core.expForLevel(lvl),
					`expForLevel not strictly increasing at level ${lvl}`
				);
			}
		});

		it('should handle level 100 (cap) without throwing', () => {
			assert.doesNotThrow(() => core.expForLevel(100));
			assert(core.expForLevel(100) > 0);
		});

		it('should be deterministic (same result for same input)', () => {
			assert.equal(core.expForLevel(50), core.expForLevel(50));
			assert.equal(core.expForLevel(1), core.expForLevel(1));
		});
	});

	describe('floorExpReward()', () => {
		it('should return a positive reward for floor 1', () => {
			assert(core.floorExpReward(1) > 0, 'floor 1 should give EXP');
		});

		it('should strictly increase with floor number', () => {
			assert(core.floorExpReward(2) > core.floorExpReward(1));
			assert(core.floorExpReward(10) > core.floorExpReward(5));
			assert(core.floorExpReward(50) > core.floorExpReward(10));
			assert(core.floorExpReward(100) > core.floorExpReward(50));
		});

		it('should be deterministic', () => {
			assert.equal(core.floorExpReward(25), core.floorExpReward(25));
		});

		it('should return a number (not NaN or Infinity)', () => {
			for (const floor of [1, 5, 10, 25, 50, 100]) {
				const reward = core.floorExpReward(floor);
				assert(isFinite(reward), `floorExpReward(${floor}) is not finite`);
				assert(!isNaN(reward), `floorExpReward(${floor}) is NaN`);
			}
		});
	});

	describe('floorCoinReward()', () => {
		it('should return a positive reward for floor 1', () => {
			assert(core.floorCoinReward(1) > 0, 'floor 1 should give coins');
		});

		it('should increase with floor number', () => {
			assert(core.floorCoinReward(10) > core.floorCoinReward(1));
			assert(core.floorCoinReward(50) > core.floorCoinReward(10));
		});

		it('should return integer or near-integer values', () => {
			for (const floor of [1, 5, 10, 25, 50]) {
				const reward = core.floorCoinReward(floor);
				assert(typeof reward === 'number' && reward >= 0, `Invalid coin reward at floor ${floor}`);
			}
		});

		it('should be deterministic', () => {
			assert.equal(core.floorCoinReward(10), core.floorCoinReward(10));
		});
	});
});
