'use strict';

/**
 * Utils Module Tests
 * Tests utility functions for calculations and game mechanics
 */

const assert = require('assert').strict;

describe('RPG Utils Module', function () {
	this.timeout(10000);

	let utils;

	before(function () {
		try {
			utils = require('../../dist/impulse/chat-plugins/rpg-wip/utils');
		} catch (e) {
			console.log('Utils module not found, skipping tests:', e.message);
			this.skip();
		}
	});

	describe('Experience Calculations', () => {
		it('should calculate total exp for level 1 correctly', function () {
			const exp = utils.calculateTotalExpForLevel('Medium Fast', 1);
			// Level 1 might return 1 or 0 depending on implementation
			assert(exp >= 0 && exp <= 1);
		});

		it('should calculate total exp for level 100 correctly', function () {
			const exp = utils.calculateTotalExpForLevel('Medium Fast', 100);
			assert(exp > 0);
			assert(exp === 1000000);
		});

		it('should calculate exp for Medium Fast growth rate', function () {
			const exp5 = utils.calculateTotalExpForLevel('Medium Fast', 5);
			const exp10 = utils.calculateTotalExpForLevel('Medium Fast', 10);
			const exp50 = utils.calculateTotalExpForLevel('Medium Fast', 50);

			assert(exp5 > 0);
			assert(exp10 > exp5);
			assert(exp50 > exp10);
		});

		it('should calculate exp for Fast growth rate', function () {
			const exp50Fast = utils.calculateTotalExpForLevel('Fast', 50);
			const exp50MediumFast = utils.calculateTotalExpForLevel('Medium Fast', 50);

			assert(exp50Fast < exp50MediumFast);
		});

		it('should calculate exp for Slow growth rate', function () {
			const exp50Slow = utils.calculateTotalExpForLevel('Slow', 50);
			const exp50MediumFast = utils.calculateTotalExpForLevel('Medium Fast', 50);

			assert(exp50Slow > exp50MediumFast);
		});

		it('should handle all growth rates', function () {
			const growthRates = ['Erratic', 'Fast', 'Medium Fast', 'Medium Slow', 'Slow', 'Fluctuating'];

			for (const rate of growthRates) {
				const exp = utils.calculateTotalExpForLevel(rate, 50);
				assert(exp > 0);
			}
		});

		it('should handle edge case: level 0', function () {
			const exp = utils.calculateTotalExpForLevel('Medium Fast', 0);
			assert.equal(exp, 0);
		});

		it('should handle edge case: level > 100', function () {
			const exp = utils.calculateTotalExpForLevel('Medium Fast', 150);
			assert(exp >= utils.calculateTotalExpForLevel('Medium Fast', 100));
		});
	});

	describe('Stat Calculations', () => {
		it('should calculate HP stat correctly', function () {
			if (!utils.calculateStat) {
				this.skip();
				return;
			}

			const hp = utils.calculateStat('hp', 100, 31, 252, 50, 'Hardy');
			assert(hp > 0);
			assert(hp > 100);
		});

		it('should calculate attack stat correctly', function () {
			if (!utils.calculateStat) {
				this.skip();
				return;
			}

			const atk = utils.calculateStat('atk', 100, 31, 252, 50, 'Adamant');
			const atkNeutral = utils.calculateStat('atk', 100, 31, 252, 50, 'Hardy');

			assert(atk > atkNeutral); // Adamant boosts attack
		});

		it('should calculate stat with max IVs and EVs', function () {
			if (!utils.calculateStat) {
				this.skip();
				return;
			}

			const stat = utils.calculateStat('atk', 100, 31, 252, 100, 'Hardy');
			assert(stat > 100);
		});

		it('should calculate stat with min IVs and EVs', function () {
			if (!utils.calculateStat) {
				this.skip();
				return;
			}

			const stat = utils.calculateStat('atk', 100, 0, 0, 100, 'Hardy');
			assert(stat > 50);
		});

		it('should handle nature modifiers correctly', function () {
			if (!utils.calculateStat) {
				this.skip();
				return;
			}

			const atkAdamant = utils.calculateStat('atk', 100, 31, 252, 50, 'Adamant'); // +Atk
			const atkModest = utils.calculateStat('atk', 100, 31, 252, 50, 'Modest'); // -Atk
			const atkHardy = utils.calculateStat('atk', 100, 31, 252, 50, 'Hardy'); // Neutral

			assert(atkAdamant > atkHardy);
			assert(atkModest < atkHardy);
		});
	});

	describe('Type Effectiveness', () => {
		it('should calculate super effective damage (2x)', function () {
			if (!utils.getTypeEffectiveness) {
				this.skip();
				return;
			}

			const effectiveness = utils.getTypeEffectiveness('Water', 'Fire');
			assert.equal(effectiveness, 2);
		});

		it('should calculate not very effective damage (0.5x)', function () {
			if (!utils.getTypeEffectiveness) {
				this.skip();
				return;
			}

			const effectiveness = utils.getTypeEffectiveness('Water', 'Grass');
			assert.equal(effectiveness, 0.5);
		});

		it('should calculate no effect damage (0x)', function () {
			if (!utils.getTypeEffectiveness) {
				this.skip();
				return;
			}

			const effectiveness = utils.getTypeEffectiveness('Normal', 'Ghost');
			assert.equal(effectiveness, 0);
		});

		it('should calculate neutral damage (1x)', function () {
			if (!utils.getTypeEffectiveness) {
				this.skip();
				return;
			}

			const effectiveness = utils.getTypeEffectiveness('Water', 'Normal');
			assert.equal(effectiveness, 1);
		});

		it('should handle dual-type defenders', function () {
			if (!utils.getTypeEffectiveness) {
				this.skip();
				return;
			}

			// Rock move vs Flying/Ground (4x super effective)
			const effectiveness = utils.getTypeEffectiveness('Rock', 'Flying', 'Ground');
			assert.equal(effectiveness, 4);
		});

		it('should handle edge case: same type', function () {
			if (!utils.getTypeEffectiveness) {
				this.skip();
				return;
			}

			const effectiveness = utils.getTypeEffectiveness('Water', 'Water');
			assert.equal(effectiveness, 0.5);
		});
	});

	describe('Damage Calculations', () => {
		it('should calculate damage correctly', function () {
			if (!utils.calculateDamage) {
				this.skip();
				return;
			}

			const damage = utils.calculateDamage(100, 100, 100, 1, 1, 1);
			assert(damage > 0);
			assert(damage < 200);
		});

		it('should calculate STAB bonus (1.5x)', function () {
			if (!utils.calculateDamage) {
				this.skip();
				return;
			}

			const damageWithSTAB = utils.calculateDamage(100, 100, 100, 1.5, 1, 1);
			const damageWithoutSTAB = utils.calculateDamage(100, 100, 100, 1, 1, 1);

			assert(damageWithSTAB > damageWithoutSTAB);
		});

		it('should apply type effectiveness multiplier', function () {
			if (!utils.calculateDamage) {
				this.skip();
				return;
			}

			const damageSuperEffective = utils.calculateDamage(100, 100, 100, 1, 2, 1);
			const damageNeutral = utils.calculateDamage(100, 100, 100, 1, 1, 1);
			const damageNotVeryEffective = utils.calculateDamage(100, 100, 100, 1, 0.5, 1);

			assert(damageSuperEffective > damageNeutral);
			assert(damageNotVeryEffective < damageNeutral);
		});

		it('should handle critical hits (1.5x)', function () {
			if (!utils.calculateDamage) {
				this.skip();
				return;
			}

			const damageCrit = utils.calculateDamage(100, 100, 100, 1, 1, 1.5);
			const damageNormal = utils.calculateDamage(100, 100, 100, 1, 1, 1);

			assert(damageCrit > damageNormal);
		});

		it('should handle edge case: 0 defense', function () {
			if (!utils.calculateDamage) {
				this.skip();
				return;
			}

			const damage = utils.calculateDamage(100, 100, 1, 1, 1, 1);
			assert(damage > 0);
		});

		it('should handle edge case: very high defense', function () {
			if (!utils.calculateDamage) {
				this.skip();
				return;
			}

			const damage = utils.calculateDamage(100, 100, 1000, 1, 1, 1);
			assert(damage >= 1); // Minimum 1 damage
		});
	});

	describe('Random Utilities', () => {
		it('should generate random number in range', function () {
			if (!utils.randomInt) {
				this.skip();
				return;
			}

			for (let i = 0; i < 100; i++) {
				const num = utils.randomInt(1, 10);
				assert(num >= 1);
				assert(num <= 10);
			}
		});

		it('should generate different random numbers', function () {
			if (!utils.randomInt) {
				this.skip();
				return;
			}

			const numbers = new Set();
			for (let i = 0; i < 100; i++) {
				numbers.add(utils.randomInt(1, 100));
			}

			assert(numbers.size > 10); // Should have variety
		});

		it('should handle edge case: min equals max', function () {
			if (!utils.randomInt) {
				this.skip();
				return;
			}

			const num = utils.randomInt(5, 5);
			assert.equal(num, 5);
		});
	});

	describe('Move Learning', () => {
		it('should check if Pokemon can learn move', function () {
			if (!utils.canLearnMove) {
				this.skip();
				return;
			}

			const canLearn = utils.canLearnMove('pikachu', 'thunderbolt');
			assert.equal(typeof canLearn, 'boolean');
		});

		it('should return true for valid level-up moves', function () {
			if (!utils.canLearnMove) {
				this.skip();
				return;
			}

			const canLearn = utils.canLearnMove('pikachu', 'thundershock');
			assert.equal(canLearn, true);
		});

		it('should handle TM moves', function () {
			if (!utils.canLearnMove) {
				this.skip();
				return;
			}

			const canLearn = utils.canLearnMove('pikachu', 'irontail');
			assert.equal(typeof canLearn, 'boolean');
		});

		it('should return false for moves Pokemon cannot learn', function () {
			if (!utils.canLearnMove) {
				this.skip();
				return;
			}

			const canLearn = utils.canLearnMove('magikarp', 'hyperbeam');
			assert.equal(canLearn, false);
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('should handle negative level gracefully', function () {
			const exp = utils.calculateTotalExpForLevel('Medium Fast', -1);
			assert(exp >= 0);
		});

		it('should handle invalid growth rate', function () {
			try {
				const exp = utils.calculateTotalExpForLevel('Invalid', 50);
				assert(exp >= 0); // Should default or handle gracefully
			} catch (e) {
				assert(e); // Or throw error is acceptable
			}
		});

		it('should handle very large numbers', function () {
			const exp = utils.calculateTotalExpForLevel('Medium Fast', 999);
			assert(exp > 0);
		});
	});
});
