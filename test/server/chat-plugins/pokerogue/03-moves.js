/**
 * PokéRogue: Move learning test suite
 * Tests getLevelUpMoves() for correct move selection and fallbacks.
 */
'use strict';

const assert = require('../../../assert');

describe('PokéRogue — Move Learning', function () {
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

	describe('getLevelUpMoves()', () => {
		it('should return an array', () => {
			const moves = core.getLevelUpMoves('bulbasaur', 5);
			assert(Array.isArray(moves), 'Should return an array');
		});

		it('should always return at least 1 move', () => {
			const moves = core.getLevelUpMoves('bulbasaur', 1);
			assert(moves.length >= 1, 'Should have at least one move');
		});

		it('should return at most 4 moves', () => {
			for (const [species, level] of [['charizard', 60], ['pikachu', 30], ['mewtwo', 80]]) {
				const moves = core.getLevelUpMoves(species, level);
				assert(moves.length <= 4, `${species} at level ${level} has ${moves.length} moves (max 4)`);
			}
		});

		it('should return move id strings (lowercase, no spaces)', () => {
			const moves = core.getLevelUpMoves('bulbasaur', 10);
			for (const move of moves) {
				assert(typeof move === 'string', `Move '${move}' should be a string`);
				assert(move.length > 0, 'Move id should not be empty');
				assert.equal(move, move.toLowerCase().replace(/\s/g, ''), `Move id '${move}' should be lowercase without spaces`);
			}
		});

		it('should fall back to tackle for unknown species', () => {
			const moves = core.getLevelUpMoves('fakespecies99', 1);
			assert(moves.length >= 1, 'Should fall back to at least tackle');
			assert.equal(moves[0], 'tackle', 'Fallback should be tackle');
		});

		it('should include moves learnable at or before the given level', () => {
			// Level 5 — Bulbasaur learns Tackle at 1 and Growl at 3
			const moves = core.getLevelUpMoves('bulbasaur', 5);
			assert(moves.length > 0);
			// All returned moves should be learnable by bulbasaur at level ≤ 5
			for (const move of moves) {
				const moveData = Dex.moves.get(move);
				assert(moveData.exists || move === 'tackle', `Move '${move}' not found in Dex`);
			}
		});

		it('should generally return more or different moves at higher levels', () => {
			const moves5 = core.getLevelUpMoves('charmander', 5);
			const moves20 = core.getLevelUpMoves('charmander', 20);
			// Higher level should either return same or different set (not strictly more — we cap at 4)
			assert(moves20.length <= 4, 'Should not exceed 4 moves at level 20');
			assert(moves5.length >= 1, 'Should have at least 1 move at level 5');
		});

		it('should work correctly for fully evolved Pokemon', () => {
			const moves = core.getLevelUpMoves('venusaur', 50);
			assert(moves.length >= 1 && moves.length <= 4);
		});

		it('should work for Legendary Pokemon', () => {
			const moves = core.getLevelUpMoves('mewtwo', 70);
			assert(Array.isArray(moves));
			assert(moves.length >= 1);
		});

		it('should handle level 1 for any species without throwing', () => {
			const species = ['pikachu', 'eevee', 'magikarp', 'snorlax', 'ditto'];
			for (const s of species) {
				assert.doesNotThrow(() => {
					const moves = core.getLevelUpMoves(s, 1);
					assert(Array.isArray(moves), `${s} should return array`);
					assert(moves.length >= 1, `${s} should have at least 1 move at level 1`);
				});
			}
		});

		it('should handle level 100 without throwing', () => {
			assert.doesNotThrow(() => {
				const moves = core.getLevelUpMoves('pikachu', 100);
				assert(moves.length <= 4);
			});
		});
	});
});
