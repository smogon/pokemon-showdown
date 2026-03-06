/**
 * PokéRogue: Pokémon selection helpers test suite
 * Tests pickStarterOptions(), pickNewPokemonOptions(), and pickRandomPokemon().
 */
'use strict';

const assert = require('../../../assert');

describe('PokéRogue — Pokémon Selection', function () {
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

	describe('pickStarterOptions()', () => {
		it('should return exactly 3 species', () => {
			const opts = core.pickStarterOptions();
			assert.equal(opts.length, 3, 'Should return exactly 3 starters');
		});

		it('should return valid PS species ids', () => {
			const opts = core.pickStarterOptions();
			for (const id of opts) {
				const sp = Dex.species.get(id);
				assert(sp.exists, `Unknown species: ${id}`);
			}
		});

		it('should never include legendary Pokemon as starters', () => {
			// Run multiple times to ensure consistency
			for (let i = 0; i < 10; i++) {
				const opts = core.pickStarterOptions();
				for (const id of opts) {
					const sp = Dex.species.get(id);
					const isLegendary = sp.tags?.some(tag => core.LEGENDARY_TAGS.has(tag));
					assert(!isLegendary, `Legendary ${id} should not be a starter option`);
				}
			}
		});

		it('should not return duplicate species', () => {
			for (let i = 0; i < 10; i++) {
				const opts = core.pickStarterOptions();
				assert.equal(new Set(opts).size, 3, `Starters contain duplicates: ${opts.join(', ')}`);
			}
		});

		it('should return different results across calls (random)', () => {
			const results = new Set();
			for (let i = 0; i < 20; i++) {
				results.add(core.pickStarterOptions().sort().join(','));
			}
			assert(results.size > 1, 'Should produce varied starter sets');
		});

		it('should only return base-form Pokemon (no evolutions)', () => {
			for (let i = 0; i < 5; i++) {
				const opts = core.pickStarterOptions();
				for (const id of opts) {
					const sp = Dex.species.get(id);
					assert(!sp.prevo, `${id} has a prevo — should only be base-form starters`);
				}
			}
		});
	});

	describe('pickNewPokemonOptions()', () => {
		it('should return exactly 3 options', () => {
			const opts = core.pickNewPokemonOptions([], 5);
			assert.equal(opts.length, 3, 'Milestone offer should have 3 choices');
		});

		it('should return valid PS species ids', () => {
			const opts = core.pickNewPokemonOptions([], 5);
			for (const id of opts) {
				assert(Dex.species.get(id).exists, `Unknown species: ${id}`);
			}
		});

		it('should not include any current team species', () => {
			const team = [
				{ species: 'bulbasaur', level: 10, exp: 0 },
				{ species: 'charmander', level: 10, exp: 0 },
			];
			for (let i = 0; i < 10; i++) {
				const opts = core.pickNewPokemonOptions(team, 5);
				assert(!opts.includes('bulbasaur'), 'Should not offer existing team member (bulbasaur)');
				assert(!opts.includes('charmander'), 'Should not offer existing team member (charmander)');
			}
		});

		it('should not return duplicates in the offered options', () => {
			for (let i = 0; i < 10; i++) {
				const opts = core.pickNewPokemonOptions([], 5);
				assert.equal(new Set(opts).size, 3, 'Options should have no duplicates');
			}
		});

		it('should have a chance to include legendaries at floor >= 20', () => {
			// Run many trials at floor 20+ to verify legendary can appear
			let legendaryFound = false;
			for (let i = 0; i < 100; i++) {
				const opts = core.pickNewPokemonOptions([], 50);
				for (const id of opts) {
					const sp = Dex.species.get(id);
					if (sp.tags?.some(tag => core.LEGENDARY_TAGS.has(tag))) {
						legendaryFound = true;
						break;
					}
				}
				if (legendaryFound) break;
			}
			assert(legendaryFound, 'Should be able to find a legendary at high floors');
		});

		it('should never include legendaries at floor < 20 (pre-milestone)', () => {
			// At low floors, legendary chance is 0
			for (let i = 0; i < 30; i++) {
				const opts = core.pickNewPokemonOptions([], 5);
				for (const id of opts) {
					const sp = Dex.species.get(id);
					const isLegendary = sp.tags?.some(tag => core.LEGENDARY_TAGS.has(tag));
					assert(!isLegendary, `No legendaries should appear at floor 5, got ${id}`);
				}
			}
		});

		it('should handle a full team of 5 by excluding all existing members', () => {
			const team = [
				{ species: 'pikachu', level: 20, exp: 0 },
				{ species: 'bulbasaur', level: 20, exp: 0 },
				{ species: 'charmander', level: 20, exp: 0 },
				{ species: 'squirtle', level: 20, exp: 0 },
				{ species: 'eevee', level: 20, exp: 0 },
			];
			const existingIds = team.map(m => m.species);
			const opts = core.pickNewPokemonOptions(team, 5);
			for (const id of opts) {
				assert(!existingIds.includes(id), `${id} is already in the team`);
			}
		});
	});

	describe('pickRandomPokemon()', () => {
		it('should return n random species', () => {
			for (const n of [1, 3, 5]) {
				const opts = core.pickRandomPokemon(n);
				assert.equal(opts.length, n, `Should return ${n} Pokemon`);
			}
		});

		it('should return non-legendary base-form species', () => {
			const opts = core.pickRandomPokemon(10);
			for (const id of opts) {
				const sp = Dex.species.get(id);
				assert(sp.exists, `Unknown species: ${id}`);
				const isLegendary = sp.tags?.some(tag => core.LEGENDARY_TAGS.has(tag));
				assert(!isLegendary, `${id} is legendary but was returned by pickRandomPokemon`);
			}
		});

		it('should exclude specified species', () => {
			const exclude = ['bulbasaur', 'charmander', 'squirtle'];
			for (let i = 0; i < 10; i++) {
				const opts = core.pickRandomPokemon(5, exclude);
				for (const id of opts) {
					assert(!exclude.includes(id), `${id} is in exclude list but was returned`);
				}
			}
		});

		it('should not return duplicates', () => {
			const opts = core.pickRandomPokemon(10);
			assert.equal(new Set(opts).size, opts.length, 'Should not contain duplicate species');
		});
	});
});
