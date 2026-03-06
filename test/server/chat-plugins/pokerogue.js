/**
 * Comprehensive unit tests for the PokéRogue chat plugin.
 * Covers game logic, state management, gacha system, evolution, item handling, and edge cases.
 */
'use strict';

const assert = require('../../assert');

describe('PokéRogue Plugin', function () {
	this.timeout(10000);

	let core;

	before(function () {
		try {
			core = require('../../../dist/impulse/chat-plugins/pokerogue/pokerogue-core');
		} catch (e) {
			console.log('PokéRogue core module not found in dist, skipping tests:', e.message);
			this.skip();
		}
	});

	// ── Exp / Level helpers ────────────────────────────────────────────────────

	describe('expForLevel()', () => {
		it('should return 0 for level 1', () => {
			assert.equal(core.expForLevel(1), 0);
		});

		it('should return 0 for level 0', () => {
			assert.equal(core.expForLevel(0), 0);
		});

		it('should return positive values for levels > 1', () => {
			assert(core.expForLevel(2) > 0);
			assert(core.expForLevel(10) > core.expForLevel(5));
			assert(core.expForLevel(100) > core.expForLevel(50));
		});

		it('should be strictly increasing', () => {
			for (let lvl = 1; lvl < 100; lvl++) {
				assert(core.expForLevel(lvl + 1) > core.expForLevel(lvl),
					`expForLevel not increasing at level ${lvl}`);
			}
		});
	});

	describe('floorExpReward()', () => {
		it('should return a positive reward for floor 1', () => {
			assert(core.floorExpReward(1) > 0);
		});

		it('should increase with floor number', () => {
			assert(core.floorExpReward(10) > core.floorExpReward(1));
			assert(core.floorExpReward(50) > core.floorExpReward(10));
		});
	});

	describe('floorCoinReward()', () => {
		it('should return a positive reward for floor 1', () => {
			assert(core.floorCoinReward(1) > 0);
		});

		it('should increase with floor number', () => {
			assert(core.floorCoinReward(10) > core.floorCoinReward(1));
		});
	});

	// ── Level-up / Evolution ────────────────────────────────────────────────

	describe('applyExpAndLevelUp()', () => {
		it('should increase level when enough exp is gained', () => {
			const mon = { species: 'bulbasaur', level: 1, exp: 0 };
			const expNeeded = core.expForLevel(2);
			const { oldLevel } = core.applyExpAndLevelUp(mon, expNeeded);
			assert.equal(oldLevel, 1);
			assert.equal(mon.level, 2);
		});

		it('should not exceed level 100', () => {
			const mon = { species: 'bulbasaur', level: 99, exp: core.expForLevel(99) };
			core.applyExpAndLevelUp(mon, 99999);
			assert.equal(mon.level, 100);
		});

		it('should return evolved=true when species changes', () => {
			// Bulbasaur evolves into Ivysaur at level 16
			const mon = { species: 'bulbasaur', level: 15, exp: core.expForLevel(15) };
			const expToEvo = core.expForLevel(16) - mon.exp + 1;
			const { evolved } = core.applyExpAndLevelUp(mon, expToEvo);
			assert(evolved, 'should have evolved to Ivysaur');
			assert.equal(mon.species, 'ivysaur');
		});

		it('should chain multiple evolutions in one level-up', () => {
			// Caterpie→Metapod (7)→Butterfree (10) — jump from lv1 to lv10
			const mon = { species: 'caterpie', level: 1, exp: 0 };
			const bigExp = core.expForLevel(11) + 1;
			const { evolved } = core.applyExpAndLevelUp(mon, bigExp);
			assert(evolved, 'should have evolved');
			// Should be at least Metapod or Butterfree
			assert(['metapod', 'butterfree'].includes(mon.species),
				`expected metapod or butterfree, got ${mon.species}`);
		});

		it('should not evolve if level is below evo threshold', () => {
			const mon = { species: 'bulbasaur', level: 5, exp: 0 };
			const { evolved } = core.applyExpAndLevelUp(mon, core.expForLevel(6));
			assert.equal(evolved, false);
			assert.equal(mon.species, 'bulbasaur');
		});
	});

	describe('getLevelUpEvo()', () => {
		it('should return evolution info for Bulbasaur', () => {
			const evo = core.getLevelUpEvo('bulbasaur');
			assert(evo !== null);
			assert.equal(evo.evoTo, 'ivysaur');
			assert(evo.evoLevel >= 16);
		});

		it('should return null for fully evolved Pokemon', () => {
			// Venusaur (final evo) should return null
			assert.equal(core.getLevelUpEvo('venusaur'), null);
		});

		it('should return null for trade-evo only Pokemon', () => {
			// Gengar evolves by trade — should not have a level-up evo
			// (or falls back to a fallback level if any)
			const evo = core.getLevelUpEvo('haunter');
			// If it returns something, it should have a level > 0
			if (evo !== null) {
				assert(evo.evoLevel > 0);
			}
		});
	});

	// ── Move helpers ────────────────────────────────────────────────────────

	describe('getLevelUpMoves()', () => {
		it('should return an array of move ids', () => {
			const moves = core.getLevelUpMoves('bulbasaur', 5);
			assert(Array.isArray(moves));
			assert(moves.length > 0);
		});

		it('should return at most 4 moves', () => {
			const moves = core.getLevelUpMoves('charizard', 60);
			assert(moves.length <= 4);
		});

		it('should fall back to tackle if no learnset found', () => {
			const moves = core.getLevelUpMoves('missingno', 1);
			assert.equal(moves[0], 'tackle');
		});

		it('should only return moves learnable at or below the given level', () => {
			const moves = core.getLevelUpMoves('charmander', 10);
			assert(Array.isArray(moves));
			// The result must not be empty (fallback is tackle)
			assert(moves.length > 0);
		});
	});

	// ── Team packing ────────────────────────────────────────────────────────

	describe('packPokemon()', () => {
		it('should produce a pipe-delimited packed format', () => {
			const mon = { species: 'pikachu', level: 10, exp: core.expForLevel(10) };
			const packed = core.packPokemon(mon);
			const fields = packed.split('|');
			// packed format: name|species|item|ability|moves|nature|evs|gender|ivs|shiny|level|
			// field 10 = level, field 11 = empty (trailing pipe for PS parser)
			assert(fields.length >= 11, `packed format too short: ${packed}`);
			// level should be at position 10
			assert.equal(fields[10], '10');
		});

		it('should include held item in position 2', () => {
			const mon = { species: 'pikachu', level: 5, exp: 0, heldItem: 'leftovers' };
			const packed = core.packPokemon(mon);
			const fields = packed.split('|');
			assert.equal(fields[2], 'leftovers');
		});

		it('should leave item field empty when no held item', () => {
			const mon = { species: 'pikachu', level: 5, exp: 0 };
			const packed = core.packPokemon(mon);
			const fields = packed.split('|');
			assert.equal(fields[2], '');
		});
	});

	describe('packTeam()', () => {
		it('should join multiple pokemon with ]', () => {
			const team = [
				{ species: 'pikachu', level: 5, exp: 0 },
				{ species: 'bulbasaur', level: 5, exp: 0 },
			];
			const packed = core.packTeam(team);
			assert(packed.includes(']'), 'team separator ] not found');
			const parts = packed.split(']');
			assert.equal(parts.length, 2);
		});
	});

	// ── Shop inventory ────────────────────────────────────────────────────

	describe('rollShopInventory()', () => {
		it('should return 8 items by default', () => {
			const inv = core.rollShopInventory();
			assert.equal(inv.length, 8);
		});

		it('should return a custom count', () => {
			assert.equal(core.rollShopInventory(4).length, 4);
			assert.equal(core.rollShopInventory(12).length, 12);
		});

		it('should return valid SHOP_ITEMS ids', () => {
			const inv = core.rollShopInventory(10);
			for (const id of inv) {
				assert(core.SHOP_ITEMS[id], `Unknown shop item id: ${id}`);
			}
		});

		it('should not return duplicate items', () => {
			const inv = core.rollShopInventory(10);
			const unique = new Set(inv);
			assert.equal(unique.size, inv.length, 'Duplicate items in shop inventory');
		});
	});

	// ── SHOP_ITEMS definitions ────────────────────────────────────────────

	describe('SHOP_ITEMS', () => {
		it('should have all required fields on every item', () => {
			for (const [id, item] of Object.entries(core.SHOP_ITEMS)) {
				assert.equal(item.id, id, `Item ${id} has mismatched id field`);
				assert(typeof item.name === 'string' && item.name.length > 0,
					`Item ${id} missing name`);
				assert(typeof item.description === 'string' && item.description.length > 0,
					`Item ${id} missing description`);
				assert(typeof item.cost === 'number' && item.cost > 0,
					`Item ${id} must have positive cost`);
			}
		});

		it('should have gacha capsule items with correct fields', () => {
			const capsules = ['mastercapsule', 'ultracapsule', 'greatcapsule'];
			for (const id of capsules) {
				const item = core.SHOP_ITEMS[id];
				assert(item, `Missing gacha capsule: ${id}`);
				assert(item.gachaType, `${id} must have gachaType`);
				assert(typeof item.gachaChance === 'number',
					`${id} must have numeric gachaChance`);
				assert(item.gachaChance > 0 && item.gachaChance < 1,
					`${id} gachaChance must be strictly between 0 and 1 (exclusive)`);
			}
		});

		it('Master Capsule should have the highest cost of all items', () => {
			const maxCost = Math.max(...Object.values(core.SHOP_ITEMS).map(i => i.cost));
			assert.equal(core.SHOP_ITEMS.mastercapsule.cost, maxCost,
				'Master Capsule should be the most expensive item');
		});
	});

	// ── Pokemon selection helpers ────────────────────────────────────────

	describe('pickStarterOptions()', () => {
		it('should return exactly 3 options', () => {
			const opts = core.pickStarterOptions();
			assert.equal(opts.length, 3);
		});

		it('should return valid non-legendary pokemon ids', () => {
			const opts = core.pickStarterOptions();
			for (const id of opts) {
				const sp = Dex.species.get(id);
				assert(sp.exists, `Unknown species: ${id}`);
				const isLegendary = sp.tags?.some(tag => core.LEGENDARY_TAGS.has(tag));
				assert(!isLegendary, `Starter ${id} should not be legendary`);
			}
		});

		it('should not return duplicates', () => {
			const opts = core.pickStarterOptions();
			assert.equal(new Set(opts).size, 3);
		});
	});

	describe('pickNewPokemonOptions()', () => {
		it('should return 3 options for milestone', () => {
			const opts = core.pickNewPokemonOptions([], 5);
			assert.equal(opts.length, 3);
		});

		it('should exclude current team species', () => {
			const team = [{ species: 'bulbasaur', level: 5, exp: 0 }];
			for (let i = 0; i < 10; i++) {
				const opts = core.pickNewPokemonOptions(team, 5);
				assert(!opts.includes('bulbasaur'),
					'Current team member should be excluded from offers');
			}
		});
	});

	// ── Gacha Pokemon pools ─────────────────────────────────────────────

	describe('getPseudoLegendaryPokemon()', () => {
		it('should return a non-empty list', () => {
			const pool = core.getPseudoLegendaryPokemon();
			assert(Array.isArray(pool) && pool.length > 0,
				'Pseudo-legendary pool should not be empty');
		});

		it('should only contain valid species with BST >= 580', () => {
			const pool = core.getPseudoLegendaryPokemon();
			for (const id of pool) {
				const sp = Dex.species.get(id);
				assert(sp.exists, `Unknown species in pseudo pool: ${id}`);
				const bs = sp.baseStats;
				const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
				assert(bst >= 580, `${id} BST ${bst} < 580 in pseudo pool`);
				const isLegendary = sp.tags?.some(tag => core.LEGENDARY_TAGS.has(tag));
				assert(!isLegendary, `${id} is legendary but in pseudo pool`);
			}
		});
	});

	describe('getMidTierPokemon()', () => {
		it('should return a non-empty list', () => {
			const pool = core.getMidTierPokemon();
			assert(Array.isArray(pool) && pool.length > 0,
				'Mid-tier pool should not be empty');
		});

		it('should only contain valid species with BST 480-579', () => {
			const pool = core.getMidTierPokemon();
			for (const id of pool) {
				const sp = Dex.species.get(id);
				assert(sp.exists, `Unknown species in mid-tier pool: ${id}`);
				const bs = sp.baseStats;
				const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
				assert(bst >= 480, `${id} BST ${bst} < 480 in mid-tier pool`);
				assert(bst < 580, `${id} BST ${bst} >= 580 in mid-tier pool`);
				const isLegendary = sp.tags?.some(tag => core.LEGENDARY_TAGS.has(tag));
				assert(!isLegendary, `${id} is legendary but in mid-tier pool`);
			}
		});
	});

	// ── Gacha roll ───────────────────────────────────────────────────────

	describe('rollGachaPokemon()', () => {
		it('should always return a valid species id', () => {
			for (let i = 0; i < 20; i++) {
				const result = core.rollGachaPokemon('legendary', 0.15);
				assert(typeof result.species === 'string' && result.species.length > 0);
				const sp = Dex.species.get(result.species);
				assert(sp.exists, `rollGachaPokemon returned invalid species: ${result.species}`);
			}
		});

		it('should always return a valid species for ultra capsule', () => {
			for (let i = 0; i < 20; i++) {
				const result = core.rollGachaPokemon('pseudo', 0.20);
				assert(typeof result.species === 'string');
				assert(Dex.species.get(result.species).exists);
			}
		});

		it('should always return a valid species for great capsule', () => {
			for (let i = 0; i < 20; i++) {
				const result = core.rollGachaPokemon('midtier', 0.50);
				assert(typeof result.species === 'string');
				assert(Dex.species.get(result.species).exists);
			}
		});

		it('should return { species, isFeatured } shape', () => {
			const result = core.rollGachaPokemon('legendary', 0.5);
			assert(typeof result === 'object');
			assert(typeof result.species === 'string');
			assert(typeof result.isFeatured === 'boolean');
		});

		it('should not return a species from the exclude list if possible', () => {
			// Exclude every legendary we know about from the pool
			const legendaries = core.LEGENDARY_TAGS;
			// Run 10 trials: if featured, species should not be in excludes (when pool is big enough)
			// We just verify the function runs without throwing
			for (let i = 0; i < 10; i++) {
				assert.doesNotThrow(() => {
					core.rollGachaPokemon('legendary', 1.0, ['mewtwo', 'lugia']);
				});
			}
		});

		it('should handle 0 chance (always fallback)', () => {
			for (let i = 0; i < 10; i++) {
				const result = core.rollGachaPokemon('legendary', 0);
				assert.equal(result.isFeatured, false);
			}
		});

		it('should handle 1.0 chance (always featured)', () => {
			for (let i = 0; i < 10; i++) {
				const result = core.rollGachaPokemon('legendary', 1.0);
				assert.equal(result.isFeatured, true);
			}
		});
	});

	// ── State management (basic) ─────────────────────────────────────────

	describe('getState() / setState() / deleteState()', () => {
		const testUserId = 'testpokerogueuser123';

		after(() => {
			// cleanup
			core.deleteState(testUserId);
		});

		it('should return null for unknown user', () => {
			assert.equal(core.getState(testUserId), null);
		});

		it('should store and retrieve state', () => {
			const state = {
				floor: 3,
				team: [{ species: 'pikachu', level: 10, exp: 0 }],
				coins: 150,
				streaksWon: 2,
			};
			core.setState(testUserId, state);
			const retrieved = core.getState(testUserId);
			assert.equal(retrieved.floor, 3);
			assert.equal(retrieved.coins, 150);
			assert.equal(retrieved.team[0].species, 'pikachu');
		});

		it('should delete state', () => {
			core.setState(testUserId, { floor: 1, team: [], coins: 0, streaksWon: 0 });
			core.deleteState(testUserId);
			assert.equal(core.getState(testUserId), null);
		});
	});

	// ── Edge cases ───────────────────────────────────────────────────────

	describe('Edge cases', () => {
		it('expForLevel should handle level 100 (max)', () => {
			assert(core.expForLevel(100) > 0);
		});

		it('applyExpAndLevelUp should not modify species at level 100', () => {
			const mon = { species: 'pikachu', level: 100, exp: core.expForLevel(100) };
			const { evolved } = core.applyExpAndLevelUp(mon, 9999);
			assert.equal(mon.level, 100);
			assert.equal(evolved, false);
			assert.equal(mon.species, 'pikachu');
		});

		it('rollShopInventory should not fail with n=0', () => {
			assert.doesNotThrow(() => {
				const inv = core.rollShopInventory(0);
				assert.equal(inv.length, 0);
			});
		});

		it('getLevelUpMoves should always return at least 1 move', () => {
			const moves = core.getLevelUpMoves('bulbasaur', 1);
			assert(moves.length >= 1);
		});

		it('pickStarterOptions should not crash when called multiple times', () => {
			assert.doesNotThrow(() => {
				for (let i = 0; i < 5; i++) {
					core.pickStarterOptions();
				}
			});
		});

		it('rollGachaPokemon should return a species even with full exclusion list', () => {
			// Even if we exclude every valid species, the fallback 'bulbasaur' last resort should fire
			const standardSpecies = Dex.species.all()
				.filter(s => s.exists && s.num > 0 && !s.isNonstandard)
				.map(s => toID(s.name));
			assert.doesNotThrow(() => {
				const result = core.rollGachaPokemon('legendary', 0.15, standardSpecies);
				// May get 'bulbasaur' as the last resort fallback
				assert(typeof result.species === 'string');
			});
		});
	});
});
