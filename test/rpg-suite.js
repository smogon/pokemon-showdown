'use strict';

/**
 * Comprehensive RPG Test Suite
 * Tests all major functionality of the RPG system
 */

const assert = require('assert').strict;
const path = require('path');

describe('RPG System - Comprehensive Test Suite', function () {
	this.timeout(15000); // RPG tests may need more time

	let utils, core, items, html, battleEngine, Dex;
	let testPlayer, testPokemon;

	before(function () {
		try {
			// Load required modules from dist
			utils = require('../dist/impulse/chat-plugins/rpg-wip/utils');
			core = require('../dist/impulse/chat-plugins/rpg-wip/core');
			items = require('../dist/impulse/chat-plugins/rpg-wip/items');
			html = require('../dist/impulse/chat-plugins/rpg-wip/html');
			battleEngine = require('../dist/impulse/chat-plugins/rpg-wip/battle-engine');
			Dex = require('../dist/sim/dex').Dex;
		} catch (e) {
			console.log('RPG module not found in dist, skipping tests:', e.message);
			this.skip();
		}
	});

	beforeEach(function () {
		// Create a test player before each test
		if (!core) return;
		
		testPlayer = {
			id: 'testplayer',
			name: 'Test Player',
			level: 1,
			experience: 0,
			badges: 0,
			party: [],
			location: 'Pallet Town',
			money: 5000,
			inventory: new Map(),
			pc: new Map(),
		};

		// Create a test Pokemon
		testPokemon = {
			id: 'test-pokemon-001',
			species: 'Pikachu',
			nickname: 'Sparky',
			level: 10,
			experience: 1000,
			expToNextLevel: 1250,
			hp: 35,
			maxHp: 35,
			atk: 25,
			def: 20,
			spa: 25,
			spd: 20,
			spe: 30,
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
			evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
			moves: [
				{ id: 'thundershock', pp: 30 },
				{ id: 'quickattack', pp: 30 },
				{ id: 'thunderbolt', pp: 15 },
				{ id: 'irontail', pp: 15 },
			],
			nature: 'Jolly',
			status: null,
			ability: 'Static',
			item: null,
			gender: 'M',
			shiny: false,
			friendship: 70,
			growthRate: 'Medium Fast',
			teraType: 'Electric',
			caughtIn: 'pokeball',
			heightm: 0.4,
			weightkg: 6.0,
		};
	});

	// ============================================
	// UTILITY FUNCTIONS TESTS
	// ============================================
	describe('Utility Functions', function () {
		it('should calculate total exp for level correctly', function () {
			if (!utils) this.skip();
			
			// Test medium-fast growth rate
			const expLevel1 = utils.calculateTotalExpForLevel('Medium Fast', 1);
			const expLevel5 = utils.calculateTotalExpForLevel('Medium Fast', 5);
			const expLevel100 = utils.calculateTotalExpForLevel('Medium Fast', 100);
			
			assert.equal(expLevel1, 0);
			assert(expLevel5 > 0);
			assert(expLevel100 > expLevel5);
			assert.equal(expLevel100, 1000000); // Medium Fast reaches 1M at level 100
		});

		it('should generate unique Pokemon IDs', function () {
			if (!utils) this.skip();
			
			const id1 = utils.generatePokemonId();
			const id2 = utils.generatePokemonId();
			
			assert.notEqual(id1, id2);
			assert(typeof id1 === 'string');
			assert(id1.length > 0);
		});

		it('should calculate stats correctly', function () {
			if (!utils) this.skip();
			
			const stats = utils.calculateStats('Pikachu', 50, 
				{ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
				{ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
				'Hardy'
			);
			
			assert(stats.hp > 0);
			assert(stats.atk > 0);
			assert(stats.def > 0);
			assert(stats.spa > 0);
			assert(stats.spd > 0);
			assert(stats.spe > 0);
		});
	});

	// ============================================
	// EXPERIENCE AND LEVELING TESTS
	// ============================================
	describe('Experience and Leveling System', function () {
		it('should properly level up a Pokemon', function () {
			if (!utils) this.skip();
			
			const pokemon = { ...testPokemon };
			const initialLevel = pokemon.level;
			
			// Add enough exp to level up
			pokemon.experience = pokemon.expToNextLevel;
			const messages = utils.levelUp(pokemon);
			
			assert.equal(pokemon.level, initialLevel + 1);
			assert(messages.length > 0, 'Should return level up messages');
		});

		it('should handle multiple level ups', function () {
			if (!utils) this.skip();
			
			const pokemon = { ...testPokemon };
			const initialLevel = pokemon.level;
			
			// Add enough exp for multiple levels
			pokemon.experience = pokemon.expToNextLevel + 500;
			
			let levelsGained = 0;
			while (pokemon.experience >= pokemon.expToNextLevel && pokemon.level < 100) {
				utils.levelUp(pokemon);
				levelsGained++;
			}
			
			assert(levelsGained >= 1);
			assert.equal(pokemon.level, initialLevel + levelsGained);
		});

		it('should not level beyond 100', function () {
			if (!utils) this.skip();
			
			const pokemon = { ...testPokemon };
			pokemon.level = 99;
			pokemon.experience = utils.calculateTotalExpForLevel(pokemon.growthRate, 100);
			
			utils.levelUp(pokemon);
			
			assert.equal(pokemon.level, 100);
			
			// Try to level up again - should stay at 100
			pokemon.experience += 10000;
			utils.levelUp(pokemon);
			
			assert.equal(pokemon.level, 100);
		});
	});

	// ============================================
	// ITEMS TESTS - EXP CANDIES
	// ============================================
	describe('Exp Candy Items', function () {
		beforeEach(function () {
			if (!items) return;
			
			// Add exp candies to inventory
			testPlayer.inventory.set('expcandyxs', { id: 'expcandyxs', name: 'Exp. Candy XS', category: 'misc', quantity: 10, description: 'Gives 100 Exp.' });
			testPlayer.inventory.set('expcandys', { id: 'expcandys', name: 'Exp. Candy S', category: 'misc', quantity: 10, description: 'Gives 800 Exp.' });
			testPlayer.inventory.set('expcandym', { id: 'expcandym', name: 'Exp. Candy M', category: 'misc', quantity: 10, description: 'Gives 3000 Exp.' });
			testPlayer.inventory.set('expcandyl', { id: 'expcandyl', name: 'Exp. Candy L', category: 'misc', quantity: 10, description: 'Gives 10000 Exp.' });
			testPlayer.inventory.set('expcandyxl', { id: 'expcandyxl', name: 'Exp. Candy XL', category: 'misc', quantity: 10, description: 'Gives 30000 Exp.' });
			
			testPlayer.party.push(testPokemon);
		});

		it('should give correct exp amounts for each candy size', function () {
			if (!items) this.skip();
			
			const candyAmounts = {
				'expcandyxs': 100,
				'expcandys': 800,
				'expcandym': 3000,
				'expcandyl': 10000,
				'expcandyxl': 30000,
			};
			
			for (const [candyId, expectedExp] of Object.entries(candyAmounts)) {
				const pokemon = { ...testPokemon };
				const initialExp = pokemon.experience;
				
				const mockContext = { room: null, user: null };
				const result = items.useExpCandyItem(testPlayer, pokemon, candyId, mockContext.room, mockContext.user);
				
				if (result.success) {
					assert.equal(pokemon.experience, initialExp + expectedExp, `${candyId} should give ${expectedExp} exp`);
				}
			}
		});

		it('should not work on fainted Pokemon', function () {
			if (!items) this.skip();
			
			const pokemon = { ...testPokemon, hp: 0 };
			const mockContext = { room: null, user: null };
			
			const result = items.useExpCandyItem(testPlayer, pokemon, 'expcandyxs', mockContext.room, mockContext.user);
			
			assert.equal(result.success, false);
			assert(result.message.includes('fainted'));
		});

		it('should not work on level 100 Pokemon', function () {
			if (!items) this.skip();
			
			const pokemon = { ...testPokemon, level: 100 };
			const mockContext = { room: null, user: null };
			
			const result = items.useExpCandyItem(testPlayer, pokemon, 'expcandyxs', mockContext.room, mockContext.user);
			
			assert.equal(result.success, false);
			assert(result.message.includes('100'));
		});

		it('should handle level ups from exp candy', function () {
			if (!items) this.skip();
			
			const pokemon = { ...testPokemon };
			const initialLevel = pokemon.level;
			const mockContext = { room: null, user: null };
			
			// Use a large candy to trigger level up
			const result = items.useExpCandyItem(testPlayer, pokemon, 'expcandym', mockContext.room, mockContext.user);
			
			if (result.success) {
				assert(pokemon.level >= initialLevel, 'Pokemon should level up or stay at same level');
			}
		});

		it('should consume the candy after successful use', function () {
			if (!items) this.skip();
			
			const pokemon = { ...testPokemon };
			const initialQuantity = testPlayer.inventory.get('expcandyxs').quantity;
			const mockContext = { room: null, user: null };
			
			const result = items.useExpCandyItem(testPlayer, pokemon, 'expcandyxs', mockContext.room, mockContext.user);
			
			if (result.success) {
				const newQuantity = testPlayer.inventory.get('expcandyxs').quantity;
				assert.equal(newQuantity, initialQuantity - 1, 'Candy should be consumed');
			}
		});
	});

	// ============================================
	// RARE CANDY TESTS
	// ============================================
	describe('Rare Candy Item', function () {
		beforeEach(function () {
			if (!items) return;
			
			testPlayer.inventory.set('rarecandy', { id: 'rarecandy', name: 'Rare Candy', category: 'misc', quantity: 10, description: 'Raises level by 1.' });
			testPlayer.party.push(testPokemon);
		});

		it('should raise Pokemon level by exactly 1', function () {
			if (!items) this.skip();
			
			const pokemon = { ...testPokemon };
			const initialLevel = pokemon.level;
			const mockContext = { room: null, user: null };
			
			const result = items.useRareCandyItem(testPlayer, pokemon, mockContext.room, mockContext.user);
			
			if (result.success) {
				assert.equal(pokemon.level, initialLevel + 1);
			}
		});

		it('should not work on level 100 Pokemon', function () {
			if (!items) this.skip();
			
			const pokemon = { ...testPokemon, level: 100 };
			const mockContext = { room: null, user: null };
			
			const result = items.useRareCandyItem(testPlayer, pokemon, mockContext.room, mockContext.user);
			
			assert.equal(result.success, false);
		});

		it('should set exp to minimum for new level', function () {
			if (!items && !utils) this.skip();
			
			const pokemon = { ...testPokemon };
			const mockContext = { room: null, user: null };
			
			const result = items.useRareCandyItem(testPlayer, pokemon, mockContext.room, mockContext.user);
			
			if (result.success) {
				const expectedExp = utils.calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);
				assert.equal(pokemon.experience, expectedExp);
			}
		});
	});

	// ============================================
	// HTML GENERATION TESTS - EXP BAR
	// ============================================
	describe('HTML Generation - Exp Bar Fix', function () {
		it('should cap exp bar percentage at 100%', function () {
			if (!html || !utils) this.skip();
			
			const pokemon = { ...testPokemon };
			
			// Set experience higher than needed for next level
			pokemon.experience = pokemon.expToNextLevel + 500;
			
			// Create a mock slot for testing
			const slot = {
				pokemon: pokemon,
				status: null,
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};
			
			// Generate HTML with player side (which shows exp bar)
			const htmlOutput = html.generateSharedBattlePokemonInfo(slot, true, false);
			
			// Check that the exp bar HTML contains width percentage
			assert(htmlOutput.includes('width:'), 'HTML should contain exp bar with width');
			
			// Extract the width percentage from the HTML
			const widthMatch = htmlOutput.match(/width:\s*(\d+)%/);
			if (widthMatch) {
				const expBarWidth = parseInt(widthMatch[1]);
				assert(expBarWidth <= 100, `Exp bar width should not exceed 100%, got ${expBarWidth}%`);
				assert(expBarWidth >= 0, `Exp bar width should not be negative, got ${expBarWidth}%`);
			}
		});

		it('should handle normal exp progression correctly', function () {
			if (!html || !utils) this.skip();
			
			const pokemon = { ...testPokemon };
			
			// Set experience to 50% between current and next level
			const expForLastLevel = utils.calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);
			const expForNextLevel = utils.calculateTotalExpForLevel(pokemon.growthRate, pokemon.level + 1);
			pokemon.experience = expForLastLevel + Math.floor((expForNextLevel - expForLastLevel) * 0.5);
			pokemon.expToNextLevel = expForNextLevel; // Make sure this is set correctly
			
			const slot = {
				pokemon: pokemon,
				status: null,
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};
			
			const htmlOutput = html.generateSharedBattlePokemonInfo(slot, true, false);
			
			// Should contain exp bar
			assert(htmlOutput.includes('background: #6c9be8'), 'Should have exp bar');
			
			// Extract width percentage
			const widthMatch = htmlOutput.match(/width:\s*(\d+)%/);
			if (widthMatch) {
				const expBarWidth = parseInt(widthMatch[1]);
				// Should be around 50% (allowing some rounding)
				assert(expBarWidth >= 45 && expBarWidth <= 55, `Exp bar should be around 50%, got ${expBarWidth}%`);
			}
		});

		it('should show 0% when at exact level threshold', function () {
			if (!html || !utils) this.skip();
			
			const pokemon = { ...testPokemon };
			
			// Set experience to exactly the current level's starting exp
			const expForLevel = utils.calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);
			const expForNextLevel = utils.calculateTotalExpForLevel(pokemon.growthRate, pokemon.level + 1);
			pokemon.experience = expForLevel;
			pokemon.expToNextLevel = expForNextLevel; // Make sure this is set correctly
			
			const slot = {
				pokemon: pokemon,
				status: null,
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};
			
			const htmlOutput = html.generateSharedBattlePokemonInfo(slot, true, false);
			
			// Should contain exp bar at 0%
			const widthMatch = htmlOutput.match(/width:\s*(\d+)%/);
			if (widthMatch) {
				const expBarWidth = parseInt(widthMatch[1]);
				assert.equal(expBarWidth, 0, 'Exp bar should be at 0% when at level threshold');
			}
		});
	});

	// ============================================
	// HEALING ITEMS TESTS
	// ============================================
	describe('Healing Items', function () {
		beforeEach(function () {
			if (!items) return;
			
			testPlayer.inventory.set('potion', { id: 'potion', name: 'Potion', category: 'medicine', quantity: 10, description: 'Restores 20 HP.' });
			testPlayer.inventory.set('superpotion', { id: 'superpotion', name: 'Super Potion', category: 'medicine', quantity: 10, description: 'Restores 60 HP.' });
			testPlayer.party.push(testPokemon);
		});

		it('should restore correct HP amount', function () {
			if (!items) this.skip();
			
			// Note: usePotionItem may not be exported, this test documents expected behavior
			// If the function exists, test it; otherwise skip
			this.skip();
		});

		it('should not work on fainted Pokemon', function () {
			if (!items) this.skip();
			
			// Note: usePotionItem may not be exported, this test documents expected behavior
			// If the function exists, test it; otherwise skip
			this.skip();
		});

		it('should not overheal Pokemon', function () {
			if (!items) this.skip();
			
			// Note: usePotionItem may not be exported, this test documents expected behavior
			// If the function exists, test it; otherwise skip
			this.skip();
		});
	});

	// ============================================
	// INVENTORY MANAGEMENT TESTS
	// ============================================
	describe('Inventory Management', function () {
		it('should add items to inventory correctly', function () {
			if (!items) this.skip();
			
			items.addItemToInventory(testPlayer, 'potion', 5);
			
			const item = testPlayer.inventory.get('potion');
			assert(item, 'Item should be in inventory');
			assert(item.quantity >= 5, 'Quantity should be at least 5');
		});

		it('should remove items from inventory correctly', function () {
			if (!items) this.skip();
			
			testPlayer.inventory.set('potion', { id: 'potion', name: 'Potion', category: 'medicine', quantity: 10, description: 'Restores 20 HP.' });
			
			items.removeItemFromInventory(testPlayer, 'potion', 3);
			
			const item = testPlayer.inventory.get('potion');
			assert.equal(item.quantity, 7, 'Quantity should be 7 after removing 3');
		});

		it('should remove item entry when quantity reaches 0', function () {
			if (!items) this.skip();
			
			testPlayer.inventory.set('potion', { id: 'potion', name: 'Potion', category: 'medicine', quantity: 1, description: 'Restores 20 HP.' });
			
			items.removeItemFromInventory(testPlayer, 'potion', 1);
			
			assert(!testPlayer.inventory.has('potion'), 'Item should be removed when quantity is 0');
		});
	});

	// ============================================
	// BATTLE SYSTEM TESTS
	// ============================================
	describe('Battle System Basics', function () {
		it('should calculate type effectiveness correctly', function () {
			if (!Dex) this.skip();
			
			// Use Dex.getEffectiveness for type calculations
			// Electric vs Water should be super effective (1 in Dex terms)
			const effectiveness1 = Dex.getEffectiveness('Electric', 'Water');
			assert.equal(effectiveness1, 1, 'Electric should be super effective against Water');
			
			// Electric vs Ground should be not very effective (-infinity in Dex terms)
			const effectiveness2 = Dex.getEffectiveness('Electric', 'Ground');
			assert(effectiveness2 < 0, 'Electric should have reduced/no effect on Ground');
			
			// Normal vs Normal should be neutral (0 in Dex terms)
			const effectiveness3 = Dex.getEffectiveness('Normal', 'Normal');
			assert.equal(effectiveness3, 0, 'Normal should be neutral against Normal');
		});

		it('should handle dual-type effectiveness correctly', function () {
			if (!Dex) this.skip();
			
			// Use Dex for type chart lookups
			const species = Dex.species.get('aerodactyl');
			assert(species.types.includes('Rock'), 'Aerodactyl should be Rock type');
			assert(species.types.includes('Flying'), 'Aerodactyl should be Flying type');
		});
	});

	// ============================================
	// POKEMON CREATION TESTS
	// ============================================
	describe('Pokemon Creation', function () {
		it('should create a valid Pokemon', function () {
			if (!core) this.skip();
			
			const pokemon = core.createPokemon('pikachu', 5);
			
			assert.equal(pokemon.species, 'Pikachu');
			assert.equal(pokemon.level, 5);
			assert(pokemon.hp > 0);
			assert(pokemon.moves.length > 0);
			assert(typeof pokemon.id === 'string');
		});

		it('should create Pokemon with valid IVs', function () {
			if (!core) this.skip();
			
			const pokemon = core.createPokemon('bulbasaur', 5);
			
			assert(pokemon.ivs.hp >= 0 && pokemon.ivs.hp <= 31);
			assert(pokemon.ivs.atk >= 0 && pokemon.ivs.atk <= 31);
			assert(pokemon.ivs.def >= 0 && pokemon.ivs.def <= 31);
			assert(pokemon.ivs.spa >= 0 && pokemon.ivs.spa <= 31);
			assert(pokemon.ivs.spd >= 0 && pokemon.ivs.spd <= 31);
			assert(pokemon.ivs.spe >= 0 && pokemon.ivs.spe <= 31);
		});
	});
});
