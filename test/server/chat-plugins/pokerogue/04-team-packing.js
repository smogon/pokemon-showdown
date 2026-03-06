/**
 * PokéRogue: Team packing test suite
 * Tests packPokemon() and packTeam() for correct PS packed-team format.
 */
'use strict';

const assert = require('../../../assert');

describe('PokéRogue — Team Packing', function () {
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

	describe('packPokemon()', () => {
		it('should produce a pipe-delimited PS packed format string', () => {
			const mon = { species: 'pikachu', level: 10, exp: core.expForLevel(10) };
			const packed = core.packPokemon(mon);
			assert(typeof packed === 'string', 'Should return a string');
			assert(packed.includes('|'), 'Should contain pipe separators');
		});

		it('should include the correct level at field index 10', () => {
			for (const level of [1, 5, 10, 50, 100]) {
				const mon = { species: 'pikachu', level, exp: core.expForLevel(level) };
				const fields = core.packPokemon(mon).split('|');
				assert.equal(fields[10], String(level), `Level ${level} should be at field[10]`);
			}
		});

		it('should place the held item at field index 2', () => {
			const mon = { species: 'pikachu', level: 5, exp: 0, heldItem: 'leftovers' };
			const fields = core.packPokemon(mon).split('|');
			assert.equal(fields[2], 'leftovers', 'Held item should be at field[2]');
		});

		it('should leave item field empty when no held item', () => {
			const mon = { species: 'pikachu', level: 5, exp: 0 };
			const fields = core.packPokemon(mon).split('|');
			assert.equal(fields[2], '', 'Item field should be empty without held item');
		});

		it('should correctly use different held items', () => {
			const items = ['focussash', 'choicescarf', 'eviolite', 'rockyhelmet'];
			for (const item of items) {
				const mon = { species: 'pikachu', level: 10, exp: 0, heldItem: item };
				const fields = core.packPokemon(mon).split('|');
				assert.equal(fields[2], item, `Item '${item}' should appear at field[2]`);
			}
		});

		it('should have a trailing | (required for PS Teams.unpack)', () => {
			const mon = { species: 'pikachu', level: 10, exp: 0 };
			const packed = core.packPokemon(mon);
			assert(packed.endsWith('|'), 'Packed string should end with | for PS parser compatibility');
		});

		it('should produce output that PS Teams.unpack can parse', () => {
			const mon = { species: 'pikachu', level: 20, exp: core.expForLevel(20), heldItem: 'focussash' };
			const packed = core.packPokemon(mon);
			const Teams = require('../../../../dist/sim/teams').Teams;
			const team = Teams.unpack(packed);
			assert(team !== null, 'PS Teams.unpack should not return null');
			assert.equal(team[0].level, 20, 'Parsed level should match');
			assert(team[0].item.toLowerCase().includes('focus'), 'Parsed item should include focus sash');
		});

		it('should include moves (non-empty) in the moves field', () => {
			const mon = { species: 'bulbasaur', level: 10, exp: 0 };
			const packed = core.packPokemon(mon);
			const fields = packed.split('|');
			// Moves are at field index 4
			assert(fields[4] && fields[4].length > 0, 'Moves field should be non-empty');
		});

		it('should work for Legendary Pokemon', () => {
			const mon = { species: 'mewtwo', level: 70, exp: core.expForLevel(70) };
			assert.doesNotThrow(() => {
				const packed = core.packPokemon(mon);
				assert(typeof packed === 'string');
				const fields = packed.split('|');
				assert.equal(fields[10], '70');
			});
		});
	});

	describe('packTeam()', () => {
		it('should pack a single Pokemon without ] separator', () => {
			const team = [{ species: 'pikachu', level: 5, exp: 0 }];
			const packed = core.packTeam(team);
			assert(typeof packed === 'string');
			assert(!packed.includes(']'), 'Single Pokemon should not have ] separator');
		});

		it('should separate multiple Pokemon with ]', () => {
			const team = [
				{ species: 'pikachu', level: 5, exp: 0 },
				{ species: 'bulbasaur', level: 5, exp: 0 },
			];
			const packed = core.packTeam(team);
			assert(packed.includes(']'), 'Multi-Pokemon team should use ] separator');
			assert.equal(packed.split(']').length, 2, 'Should have exactly one ] for 2 Pokemon');
		});

		it('should handle teams of 1 to 6 Pokemon', () => {
			const species = ['pikachu', 'bulbasaur', 'charmander', 'squirtle', 'eevee', 'magikarp'];
			for (let size = 1; size <= 6; size++) {
				const team = species.slice(0, size).map(s => ({ species: s, level: 10, exp: 0 }));
				const packed = core.packTeam(team);
				assert(typeof packed === 'string');
				if (size > 1) assert(packed.includes(']'), `Team of ${size} should have separators`);
			}
		});

		it('should produce valid PS Teams.unpack output for multi-pokemon team', () => {
			const team = [
				{ species: 'pikachu', level: 10, exp: 0, heldItem: 'leftovers' },
				{ species: 'bulbasaur', level: 8, exp: 0 },
			];
			const packed = core.packTeam(team);
			const Teams = require('../../../../dist/sim/teams').Teams;
			const parsed = Teams.unpack(packed);
			assert(parsed !== null, 'Should parse successfully');
			assert.equal(parsed.length, 2, 'Should have 2 Pokemon');
			assert.equal(parsed[0].level, 10, 'First Pokemon level should be 10');
			assert.equal(parsed[1].level, 8, 'Second Pokemon level should be 8');
		});

		it('should preserve correct held items across all team slots', () => {
			const team = [
				{ species: 'pikachu', level: 10, exp: 0, heldItem: 'focussash' },
				{ species: 'bulbasaur', level: 10, exp: 0, heldItem: 'heavydutyboots' },
				{ species: 'charmander', level: 10, exp: 0 },
			];
			const packed = core.packTeam(team);
			const Teams = require('../../../../dist/sim/teams').Teams;
			const parsed = Teams.unpack(packed);
			assert(parsed !== null);
			assert.equal(parsed.length, 3);
			assert(parsed[0].item.toLowerCase().includes('focus'), 'Slot 1 should have Focus Sash');
			assert(parsed[2].item === '', 'Slot 3 should have no item');
		});
	});
});
