/**
 * PokéRogue: Gacha system test suite
 * Tests getPseudoLegendaryPokemon(), getMidTierPokemon(), and rollGachaPokemon().
 */
'use strict';

const assert = require('../../../assert');

describe('PokéRogue — Gacha System', function () {
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

	describe('getPseudoLegendaryPokemon()', () => {
		it('should return a non-empty array', () => {
			const pool = core.getPseudoLegendaryPokemon();
			assert(Array.isArray(pool) && pool.length > 0, 'Pseudo-legendary pool must not be empty');
		});

		it('should only contain valid PS species', () => {
			const pool = core.getPseudoLegendaryPokemon();
			for (const id of pool) {
				const sp = Dex.species.get(id);
				assert(sp.exists, `Unknown species in pseudo pool: ${id}`);
			}
		});

		it('should only contain species with BST >= 580', () => {
			const pool = core.getPseudoLegendaryPokemon();
			for (const id of pool) {
				const sp = Dex.species.get(id);
				const bs = sp.baseStats;
				const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
				assert(bst >= 580, `${id} has BST ${bst} which is < 580`);
			}
		});

		it('should not contain any legendary/mythical/UB/paradox Pokemon', () => {
			const pool = core.getPseudoLegendaryPokemon();
			for (const id of pool) {
				const sp = Dex.species.get(id);
				const isLegendary = sp.tags?.some(tag => core.LEGENDARY_TAGS.has(tag));
				assert(!isLegendary, `${id} is legendary but appears in pseudo pool`);
			}
		});

		it('should return deterministic results (memoised/cached)', () => {
			const pool1 = core.getPseudoLegendaryPokemon();
			const pool2 = core.getPseudoLegendaryPokemon();
			assert.deepEqual(pool1, pool2, 'getPseudoLegendaryPokemon should be deterministic');
		});

		it('should include well-known pseudo-legendaries', () => {
			const pool = core.getPseudoLegendaryPokemon();
			// Dragonite, Tyranitar, and Salamence are canonical pseudo-legendaries
			const wellKnown = ['dragonite', 'tyranitar', 'salamence', 'metagross', 'garchomp'];
			const found = wellKnown.filter(id => pool.includes(id));
			assert(found.length >= 2, `Expected to find at least 2 pseudo-legendaries, found: ${found.join(', ')}`);
		});

		it('should only contain final-form Pokemon (no further evolutions)', () => {
			const pool = core.getPseudoLegendaryPokemon();
			for (const id of pool) {
				const sp = Dex.species.get(id);
				assert(
					!sp.evos || sp.evos.length === 0,
					`${id} has evolutions: ${sp.evos?.join(', ')} — should not be in pseudo pool`
				);
			}
		});
	});

	describe('getMidTierPokemon()', () => {
		it('should return a non-empty array', () => {
			const pool = core.getMidTierPokemon();
			assert(Array.isArray(pool) && pool.length > 0, 'Mid-tier pool must not be empty');
		});

		it('should only contain valid PS species', () => {
			const pool = core.getMidTierPokemon();
			for (const id of pool) {
				assert(Dex.species.get(id).exists, `Unknown species in mid-tier pool: ${id}`);
			}
		});

		it('should only contain species with BST between 480 and 579 (inclusive)', () => {
			const pool = core.getMidTierPokemon();
			for (const id of pool) {
				const sp = Dex.species.get(id);
				const bs = sp.baseStats;
				const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
				assert(bst >= 480, `${id} has BST ${bst} which is < 480`);
				assert(bst < 580, `${id} has BST ${bst} which is >= 580`);
			}
		});

		it('should not contain any legendary Pokemon', () => {
			const pool = core.getMidTierPokemon();
			for (const id of pool) {
				const sp = Dex.species.get(id);
				const isLegendary = sp.tags?.some(tag => core.LEGENDARY_TAGS.has(tag));
				assert(!isLegendary, `${id} is legendary but in mid-tier pool`);
			}
		});

		it('should return deterministic results', () => {
			const pool1 = core.getMidTierPokemon();
			const pool2 = core.getMidTierPokemon();
			assert.deepEqual(pool1, pool2, 'getMidTierPokemon should be deterministic');
		});

		it('should not overlap with pseudo-legendary pool', () => {
			const midPool = core.getMidTierPokemon();
			const pseudoPool = core.getPseudoLegendaryPokemon();
			const pseudoSet = new Set(pseudoPool);
			for (const id of midPool) {
				assert(!pseudoSet.has(id), `${id} appears in both mid-tier and pseudo pools`);
			}
		});

		it('should contain a substantial number of Pokemon (at least 20)', () => {
			const pool = core.getMidTierPokemon();
			assert(pool.length >= 20, `Expected at least 20 mid-tier Pokemon, got ${pool.length}`);
		});

		it('should only contain final-form Pokemon', () => {
			const pool = core.getMidTierPokemon();
			for (const id of pool) {
				const sp = Dex.species.get(id);
				assert(
					!sp.evos || sp.evos.length === 0,
					`${id} has evolutions and should not be in mid-tier pool`
				);
			}
		});
	});

	describe('rollGachaPokemon()', () => {
		it('should return an object with { species, isFeatured }', () => {
			const result = core.rollGachaPokemon('legendary', 0.5);
			assert(result && typeof result === 'object', 'Should return an object');
			assert(typeof result.species === 'string' && result.species.length > 0, 'Should have species string');
			assert(typeof result.isFeatured === 'boolean', 'Should have isFeatured boolean');
		});

		it('should always return a valid PS species id', () => {
			for (let i = 0; i < 20; i++) {
				const result = core.rollGachaPokemon('legendary', 0.15);
				assert(Dex.species.get(result.species).exists, `Invalid species: ${result.species}`);
			}
		});

		it('should set isFeatured=true when chance=1.0 (always featured)', () => {
			for (let i = 0; i < 15; i++) {
				const result = core.rollGachaPokemon('legendary', 1.0);
				assert.equal(result.isFeatured, true, 'With 100% chance, should always be featured');
			}
		});

		it('should set isFeatured=false when chance=0.0 (never featured)', () => {
			for (let i = 0; i < 15; i++) {
				const result = core.rollGachaPokemon('legendary', 0.0);
				assert.equal(result.isFeatured, false, 'With 0% chance, should never be featured');
			}
		});

		it('should work for pseudo gachaType', () => {
			for (let i = 0; i < 10; i++) {
				const result = core.rollGachaPokemon('pseudo', 0.20);
				assert(Dex.species.get(result.species).exists, `Invalid species: ${result.species}`);
			}
		});

		it('should work for midtier gachaType', () => {
			for (let i = 0; i < 10; i++) {
				const result = core.rollGachaPokemon('midtier', 0.50);
				assert(Dex.species.get(result.species).exists, `Invalid species: ${result.species}`);
			}
		});

		it('should return a legendary when featured (legendary type)', () => {
			// Run many times to ensure we hit the featured branch
			let gotFeatured = false;
			for (let i = 0; i < 50; i++) {
				const result = core.rollGachaPokemon('legendary', 1.0);
				if (result.isFeatured) {
					const sp = Dex.species.get(result.species);
					const isLegendary = sp.tags?.some(tag => core.LEGENDARY_TAGS.has(tag));
					assert(isLegendary, `Featured legendary roll returned non-legendary: ${result.species}`);
					gotFeatured = true;
					break;
				}
			}
			assert(gotFeatured, 'Should have gotten a featured result with chance=1.0');
		});

		it('should return a pseudo-legendary when featured (pseudo type)', () => {
			const pool = new Set(core.getPseudoLegendaryPokemon());
			for (let i = 0; i < 20; i++) {
				const result = core.rollGachaPokemon('pseudo', 1.0);
				assert(result.isFeatured, 'With chance=1.0, should be featured');
				assert(pool.has(result.species), `Featured pseudo roll returned species not in pool: ${result.species}`);
			}
		});

		it('should not return excluded species when possible alternatives exist', () => {
			// Exclude a few legendaries and verify we get others
			const excluded = ['mewtwo', 'lugia', 'hooh'];
			for (let i = 0; i < 20; i++) {
				const result = core.rollGachaPokemon('legendary', 1.0, excluded);
				assert(!excluded.includes(result.species),
					`Should not return excluded species, got ${result.species}`);
			}
		});

		it('should not crash when given an extensive exclude list', () => {
			const standardSpecies = Dex.species.all()
				.filter(s => s.exists && s.num > 0 && !s.isNonstandard)
				.map(s => toID(s.name));
			assert.doesNotThrow(() => {
				const result = core.rollGachaPokemon('legendary', 0.15, standardSpecies);
				assert(typeof result.species === 'string' && result.species.length > 0,
					'Should always return a species even with massive exclude list');
			});
		});

		it('should produce statistically reasonable results for 50% great-capsule chance', () => {
			let featured = 0;
			const trials = 100;
			for (let i = 0; i < trials; i++) {
				if (core.rollGachaPokemon('midtier', 0.5).isFeatured) featured++;
			}
			// With 50% chance and 100 trials, expect 25-75 featured (99.99% confidence interval)
			assert(featured >= 10, `Too few featured results: ${featured}/100 (expected ~50)`);
			assert(featured <= 90, `Too many featured results: ${featured}/100 (expected ~50)`);
		});
	});
});
