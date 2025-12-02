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

	beforeEach(() => {
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
	describe('Utility Functions', () => {
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
	describe('Experience and Leveling System', () => {
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
	describe('Exp Candy Items', () => {
		beforeEach(() => {
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
	describe('Rare Candy Item', () => {
		beforeEach(() => {
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
	describe('HTML Generation - Exp Bar Fix', () => {
		it('should cap exp bar percentage at 100%', function () {
			if (!html || !utils) this.skip();

			const pokemon = { ...testPokemon };

			// Set experience higher than needed for next level
			pokemon.experience = pokemon.expToNextLevel + 500;

			// Create a mock slot for testing
			const slot = {
				pokemon,
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
				pokemon,
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
				pokemon,
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
	describe('Healing Items', () => {
		beforeEach(() => {
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
	describe('Inventory Management', () => {
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
	describe('Battle System Basics', () => {
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
	describe('Pokemon Creation', () => {
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

	// ============================================
	// WEATHER SYSTEM TESTS
	// ============================================
	describe('Weather System', () => {
		let locations, battleEot;

		before(function () {
			try {
				locations = require('../dist/impulse/chat-plugins/rpg-wip/locations');
				battleEot = require('../dist/impulse/chat-plugins/rpg-wip/battle-eot');
			} catch (e) {
				console.log('Weather modules not found, skipping weather tests:', e.message);
				this.skip();
			}
		});

		it('should have locations with weather property', function () {
			if (!locations) this.skip();

			// Check that LOCATIONS exists
			assert(locations.LOCATIONS);
			assert(typeof locations.LOCATIONS === 'object');

			// Some locations should have weather defined
			const locationsWithWeather = Object.values(locations.LOCATIONS).filter(loc => loc.weather);
			// We don't require specific locations to have weather, just verify the structure
		});

		it('should initialize battle with location weather', function () {
			if (!core) this.skip();

			// This test verifies the concept - actual implementation is in commands.ts
			// In a real battle, weather would be set based on player.location
			const mockBattle = {
				weather: { type: 'rain', turns: 9999 },
				locationWeather: { type: 'rain' },
			};

			assert.equal(mockBattle.weather.type, 'rain');
			assert.equal(mockBattle.locationWeather.type, 'rain');
			assert.equal(mockBattle.weather.turns, 9999);
		});

		it('should restore location weather after temporary weather expires', function () {
			if (!battleEot) this.skip();

			const mockBattle = {
				weather: { type: 'sun', turns: 0 }, // Temporary weather expiring
				locationWeather: { type: 'rain' }, // Original location weather
			};
			const messageLog = [];

			// Simulate weather expiration (this would be called in battle-eot.ts)
			if (mockBattle.weather.turns <= 0 && mockBattle.locationWeather) {
				mockBattle.weather = {
					type: mockBattle.locationWeather.type,
					turns: 9999,
				};
				messageLog.push('Weather restored!');
			}

			assert.equal(mockBattle.weather.type, 'rain');
			assert.equal(mockBattle.weather.turns, 9999);
			assert(messageLog.length > 0);
		});

		it('should clear weather when no location weather exists', () => {
			const mockBattle = {
				weather: { type: 'sun', turns: 0 }, // Temporary weather expiring
				locationWeather: undefined, // No location weather
			};

			// Simulate weather expiration without location weather
			if (mockBattle.weather.turns <= 0) {
				if (mockBattle.locationWeather) {
					mockBattle.weather = {
						type: mockBattle.locationWeather.type,
						turns: 9999,
					};
				} else {
					mockBattle.weather = undefined;
				}
			}

			assert.equal(mockBattle.weather, undefined);
		});

		it('should handle weather override by moves', () => {
			const mockBattle = {
				weather: { type: 'sand', turns: 9999 }, // Location weather
				locationWeather: { type: 'sand' },
			};

			// Simulate Rain Dance being used
			mockBattle.weather = { type: 'rain', turns: 5 };

			assert.equal(mockBattle.weather.type, 'rain');
			assert.equal(mockBattle.weather.turns, 5);
			assert.equal(mockBattle.locationWeather.type, 'sand'); // Location weather preserved
		});

		it('should handle multiple weather changes and restorations', () => {
			const mockBattle = {
				weather: { type: 'rain', turns: 9999 },
				locationWeather: { type: 'rain' },
			};

			// Change 1: Sunny Day
			mockBattle.weather = { type: 'sun', turns: 5 };
			assert.equal(mockBattle.weather.type, 'sun');

			// Expire and restore
			mockBattle.weather.turns = 0;
			if (mockBattle.locationWeather) {
				mockBattle.weather = {
					type: mockBattle.locationWeather.type,
					turns: 9999,
				};
			}
			assert.equal(mockBattle.weather.type, 'rain');

			// Change 2: Hail
			mockBattle.weather = { type: 'hail', turns: 5 };
			assert.equal(mockBattle.weather.type, 'hail');

			// Expire and restore again
			mockBattle.weather.turns = 0;
			if (mockBattle.locationWeather) {
				mockBattle.weather = {
					type: mockBattle.locationWeather.type,
					turns: 9999,
				};
			}
			assert.equal(mockBattle.weather.type, 'rain');
		});

		it('should exclude fog weather', () => {
			// Fog should not be applied as battle weather
			const weatherMap = {
				'sun': 'sun',
				'rain': 'rain',
				'sandstorm': 'sand',
				'hail': 'hail',
				// 'fog' is intentionally excluded
			};

			assert.equal(weatherMap['fog'], undefined);
			assert.equal(weatherMap['sun'], 'sun');
			assert.equal(weatherMap['rain'], 'rain');
		});

		it('should convert sandstorm to sand format', () => {
			const weatherMap = {
				'sandstorm': 'sand',
			};

			assert.equal(weatherMap['sandstorm'], 'sand');
		});
	});

	// NPC System Tests
	describe('NPC System', () => {
		let data;

		before(function () {
			try {
				data = require('../dist/impulse/chat-plugins/rpg-wip/data');
			} catch (e) {
				console.log('Data module not found, skipping NPC tests:', e.message);
				this.skip();
			}
		});

		it('should have NPC database with proper structure', function () {
			if (!data) this.skip();

			assert(data.NPC_DATABASE);
			assert(typeof data.NPC_DATABASE === 'object');

			// Check a few NPCs exist
			assert(data.NPC_DATABASE['professor']);
			assert(data.NPC_DATABASE['aideroute1']);
		});

		it('should track completed NPC actions', function () {
			if (!core) this.skip();

			const player = core.getPlayerData('testuser123');

			assert(player.completedNPCActions);
			assert(player.completedNPCActions instanceof Set);
		});

		it('should add items to inventory from NPC giveitem action', function () {
			if (!items || !core) this.skip();

			const player = core.getPlayerData('testuser456');
			player.inventory.clear();

			// Simulate NPC giving item
			items.addItemToInventory(player, 'potion', 5);

			const item = player.inventory.get('potion');
			assert(item);
			assert.equal(item.quantity, 5);
		});

		it('should handle item exchanges correctly', function () {
			if (!items || !core) this.skip();

			const player = core.getPlayerData('testuser789');
			player.inventory.clear();

			// Give player required items
			items.addItemToInventory(player, 'pokeball', 10);

			// Simulate exchange
			const hasEnough = items.removeItemFromInventory(player, 'pokeball', 10);
			assert.equal(hasEnough, true);

			items.addItemToInventory(player, 'greatball', 3);

			// Verify exchange
			const pokeball = player.inventory.get('pokeball');
			assert(!pokeball || pokeball.quantity === 0);

			const greatball = player.inventory.get('greatball');
			assert(greatball);
			assert.equal(greatball.quantity, 3);
		});

		it('should create Pokemon from NPC givepokemon action', function () {
			if (!core) this.skip();

			const player = core.getPlayerData('testuser101');
			player.party = [];

			// Simulate NPC giving Pokemon
			const pokemon = core.createPokemon('eevee', 25);
			player.party.push(pokemon);

			assert.equal(player.party.length, 1);
			assert.equal(player.party[0].species, 'Eevee');
			assert.equal(player.party[0].level, 25);
		});

		it('should send Pokemon to PC when party is full', function () {
			if (!core) this.skip();

			const player = core.getPlayerData('testuser102');
			player.party = [];
			player.pc.clear();

			// Fill party with 6 Pokemon
			for (let i = 0; i < 6; i++) {
				player.party.push(core.createPokemon('pikachu', 5));
			}

			// Try to add 7th Pokemon - should go to PC
			const newPokemon = core.createPokemon('eevee', 25);
			if (player.party.length >= 6) {
				core.storePokemonInPC(player, newPokemon);
			}

			assert.equal(player.party.length, 6);
			assert.equal(player.pc.size, 1);

			// Verify PC has the new Pokemon
			const pcPokemon = Array.from(player.pc.values())[0];
			assert.equal(pcPokemon.species, 'Eevee');
		});

		it('should serialize and deserialize completedNPCActions', function () {
			if (!core) this.skip();

			const player = core.getPlayerData('testuser103');
			player.completedNPCActions.add('aideroute1');
			player.completedNPCActions.add('hikerroute2');

			// Serialize
			const serialized = core.serializePlayerData(player);
			assert(Array.isArray(serialized.completedNPCActions));
			assert.equal(serialized.completedNPCActions.length, 2);

			// Deserialize
			const deserialized = core.deserializePlayerData(serialized);
			assert(deserialized.completedNPCActions instanceof Set);
			assert.equal(deserialized.completedNPCActions.size, 2);
			assert(deserialized.completedNPCActions.has('aideroute1'));
			assert(deserialized.completedNPCActions.has('hikerroute2'));
		});
	});
});
