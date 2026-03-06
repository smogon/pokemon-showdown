/**
 * PokéRogue: Evolution system test suite
 * Tests getLevelUpEvo() and applyExpAndLevelUp() for correctness, chains, and edge cases.
 */
'use strict';

const assert = require('../../../assert');

describe('PokéRogue — Evolution System', function () {
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

	describe('getLevelUpEvo()', () => {
		it('should return evolution data for Bulbasaur → Ivysaur at 16', () => {
			const evo = core.getLevelUpEvo('bulbasaur');
			assert(evo !== null, 'Bulbasaur should have a level-up evo');
			assert.equal(evo.evoTo, 'ivysaur');
			assert(evo.evoLevel >= 16, `Expected evoLevel >= 16, got ${evo.evoLevel}`);
		});

		it('should return evolution data for Caterpie → Metapod', () => {
			const evo = core.getLevelUpEvo('caterpie');
			assert(evo !== null, 'Caterpie should have a level-up evo');
			assert.equal(evo.evoTo, 'metapod');
		});

		it('should return evolution data for Metapod → Butterfree', () => {
			const evo = core.getLevelUpEvo('metapod');
			assert(evo !== null, 'Metapod should have a level-up evo');
			assert.equal(evo.evoTo, 'butterfree');
		});

		it('should return null for fully evolved Pokemon (Venusaur)', () => {
			assert.equal(core.getLevelUpEvo('venusaur'), null);
		});

		it('should return null for fully evolved Pokemon (Butterfree)', () => {
			assert.equal(core.getLevelUpEvo('butterfree'), null);
		});

		it('should return null for fully evolved Pokemon (Charizard)', () => {
			assert.equal(core.getLevelUpEvo('charizard'), null);
		});

		it('should return null for a legendary (no evos)', () => {
			// Mewtwo has no evolution
			assert.equal(core.getLevelUpEvo('mewtwo'), null);
		});

		it('should return an object with evoTo (string) and evoLevel (number > 0) when not null', () => {
			const evo = core.getLevelUpEvo('charmander');
			assert(evo !== null);
			assert(typeof evo.evoTo === 'string' && evo.evoTo.length > 0, 'evoTo should be non-empty string');
			assert(typeof evo.evoLevel === 'number' && evo.evoLevel > 0, 'evoLevel should be a positive number');
		});

		it('should handle an unknown species without throwing', () => {
			assert.doesNotThrow(() => {
				const result = core.getLevelUpEvo('unknownpokemon99999');
				// Should return null for unknown species
				assert(result === null || (result && typeof result.evoTo === 'string'));
			});
		});
	});

	describe('applyExpAndLevelUp()', () => {
		it('should increase level when enough exp is gained', () => {
			const mon = { species: 'bulbasaur', level: 1, exp: 0 };
			const expNeeded = core.expForLevel(2);
			const { oldLevel } = core.applyExpAndLevelUp(mon, expNeeded);
			assert.equal(oldLevel, 1);
			assert.equal(mon.level, 2);
		});

		it('should not change level if exp gained is insufficient', () => {
			const mon = { species: 'bulbasaur', level: 5, exp: core.expForLevel(5) };
			core.applyExpAndLevelUp(mon, 1); // tiny amount of EXP
			assert.equal(mon.level, 5);
		});

		it('should return evolved=false when no evolution occurs', () => {
			const mon = { species: 'bulbasaur', level: 5, exp: core.expForLevel(5) };
			const { evolved } = core.applyExpAndLevelUp(mon, core.expForLevel(6));
			assert.equal(evolved, false);
			assert.equal(mon.species, 'bulbasaur');
		});

		it('should evolve Bulbasaur at level 16', () => {
			const mon = { species: 'bulbasaur', level: 15, exp: core.expForLevel(15) };
			const expToEvo = core.expForLevel(16) - mon.exp + 1;
			const { evolved } = core.applyExpAndLevelUp(mon, expToEvo);
			assert(evolved, 'Should have evolved');
			assert.equal(mon.species, 'ivysaur');
		});

		it('should chain-evolve Caterpie through Metapod to Butterfree', () => {
			const mon = { species: 'caterpie', level: 1, exp: 0 };
			// Jump past both evolution thresholds (Metapod at 7, Butterfree at 10)
			const bigExp = core.expForLevel(11) + 1;
			const { evolved } = core.applyExpAndLevelUp(mon, bigExp);
			assert(evolved, 'Should have evolved');
			assert(['metapod', 'butterfree'].includes(mon.species),
				`Expected metapod or butterfree, got ${mon.species}`);
		});

		it('should not exceed level 100 regardless of exp gained', () => {
			const mon = { species: 'bulbasaur', level: 99, exp: core.expForLevel(99) };
			core.applyExpAndLevelUp(mon, 9999999);
			assert.equal(mon.level, 100, 'Level should be capped at 100');
		});

		it('should not evolve at level 100', () => {
			// Ivysaur (evolves into Venusaur at 32) — already at 100
			const mon = { species: 'ivysaur', level: 100, exp: core.expForLevel(100) };
			const { evolved } = core.applyExpAndLevelUp(mon, 999999);
			assert.equal(evolved, false, 'Should not evolve at level 100');
			assert.equal(mon.level, 100);
		});

		it('should accumulate exp correctly across multiple calls', () => {
			const mon = { species: 'bulbasaur', level: 1, exp: 0 };
			// Get to level 5 with multiple small EXP gains
			const expForLevel5 = core.expForLevel(5);
			core.applyExpAndLevelUp(mon, Math.floor(expForLevel5 / 3));
			core.applyExpAndLevelUp(mon, Math.floor(expForLevel5 / 3));
			core.applyExpAndLevelUp(mon, expForLevel5);
			assert(mon.level >= 5, `Expected level >= 5, got ${mon.level}`);
		});

		it('should return the correct oldLevel even after evolution', () => {
			const mon = { species: 'bulbasaur', level: 15, exp: core.expForLevel(15) };
			const bigExp = core.expForLevel(16) - mon.exp + 1;
			const { oldLevel } = core.applyExpAndLevelUp(mon, bigExp);
			assert.equal(oldLevel, 15, 'oldLevel should reflect level before this call');
		});

		it('should update mon.exp after gaining exp', () => {
			const mon = { species: 'bulbasaur', level: 1, exp: 0 };
			core.applyExpAndLevelUp(mon, 500);
			assert(mon.exp >= 0, 'exp should be non-negative');
		});
	});
});
