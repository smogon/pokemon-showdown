'use strict';

/**
 * RPG Terrain Abilities Test Suite
 * Tests terrain-setting abilities (Electric Surge, Grassy Surge, etc.)
 */

const assert = require('assert').strict;

describe('RPG System - Terrain Abilities', function () {
	this.timeout(15000);

	let abilities, battleEngine;

	before(function () {
		try {
			abilities = require('../dist/impulse/chat-plugins/rpg-wip/abilities');
			battleEngine = require('../dist/impulse/chat-plugins/rpg-wip/battle-engine');
		} catch (e) {
			console.log('RPG modules not found in dist, skipping terrain ability tests:', e.message);
			this.skip();
		}
	});

	describe('Terrain Setting Abilities', () => {
		let mockBattle;
		let mockSlot;
		let messageLog;

		beforeEach(() => {
			// Create a mock battle state
			mockBattle = {
				terrain: undefined,
				weather: undefined,
				playerSlots: [null, null],
				opponentSlots: [null, null],
			};

			// Create a mock Pokemon slot
			mockSlot = {
				pokemon: {
					species: 'Tapu Koko',
					ability: 'Electric Surge',
					hp: 100,
					maxHp: 100,
				},
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			messageLog = [];
		});

		it('should set Electric Terrain with Electric Surge ability', function () {
			if (!abilities) this.skip();

			mockSlot.pokemon.ability = 'Electric Surge';
			abilities.applySwitchInAbilities(mockSlot, mockBattle, true, messageLog);

			assert(mockBattle.terrain, 'Terrain should be set');
			assert.equal(mockBattle.terrain.type, 'electric', 'Terrain type should be electric');
			assert.equal(mockBattle.terrain.turns, 5, 'Terrain should last 5 turns');
			assert(messageLog.length > 0, 'Should have a message about terrain');
			assert(messageLog.some(msg => msg.includes('Electric Surge')), 'Message should mention Electric Surge');
		});

		it('should set Grassy Terrain with Grassy Surge ability', function () {
			if (!abilities) this.skip();

			mockSlot.pokemon.ability = 'Grassy Surge';
			mockSlot.pokemon.species = 'Tapu Bulu';
			abilities.applySwitchInAbilities(mockSlot, mockBattle, true, messageLog);

			assert(mockBattle.terrain, 'Terrain should be set');
			assert.equal(mockBattle.terrain.type, 'grassy', 'Terrain type should be grassy');
			assert.equal(mockBattle.terrain.turns, 5, 'Terrain should last 5 turns');
			assert(messageLog.some(msg => msg.includes('Grassy Surge')), 'Message should mention Grassy Surge');
		});

		it('should set Misty Terrain with Misty Surge ability', function () {
			if (!abilities) this.skip();

			mockSlot.pokemon.ability = 'Misty Surge';
			mockSlot.pokemon.species = 'Tapu Fini';
			abilities.applySwitchInAbilities(mockSlot, mockBattle, true, messageLog);

			assert(mockBattle.terrain, 'Terrain should be set');
			assert.equal(mockBattle.terrain.type, 'misty', 'Terrain type should be misty');
			assert.equal(mockBattle.terrain.turns, 5, 'Terrain should last 5 turns');
			assert(messageLog.some(msg => msg.includes('Misty Surge')), 'Message should mention Misty Surge');
		});

		it('should set Psychic Terrain with Psychic Surge ability', function () {
			if (!abilities) this.skip();

			mockSlot.pokemon.ability = 'Psychic Surge';
			mockSlot.pokemon.species = 'Tapu Lele';
			abilities.applySwitchInAbilities(mockSlot, mockBattle, true, messageLog);

			assert(mockBattle.terrain, 'Terrain should be set');
			assert.equal(mockBattle.terrain.type, 'psychic', 'Terrain type should be psychic');
			assert.equal(mockBattle.terrain.turns, 5, 'Terrain should last 5 turns');
			assert(messageLog.some(msg => msg.includes('Psychic Surge')), 'Message should mention Psychic Surge');
		});

		it('should not reset already active terrain of the same type', function () {
			if (!abilities) this.skip();

			// Set terrain manually first
			mockBattle.terrain = { type: 'electric', turns: 3 };
			mockSlot.pokemon.ability = 'Electric Surge';

			abilities.applySwitchInAbilities(mockSlot, mockBattle, true, messageLog);

			// Terrain should still be at 3 turns, not reset to 5
			assert.equal(mockBattle.terrain.turns, 3, 'Terrain turns should not be reset');
			assert.equal(messageLog.length, 0, 'Should not have any messages when terrain is already active');
		});

		it('should override terrain with different type', function () {
			if (!abilities) this.skip();

			// Set terrain to grassy first
			mockBattle.terrain = { type: 'grassy', turns: 3 };
			mockSlot.pokemon.ability = 'Electric Surge';

			abilities.applySwitchInAbilities(mockSlot, mockBattle, true, messageLog);

			// Terrain should be changed to electric
			assert.equal(mockBattle.terrain.type, 'electric', 'Terrain should change to electric');
			assert.equal(mockBattle.terrain.turns, 5, 'New terrain should have 5 turns');
			assert(messageLog.length > 0, 'Should have a message about new terrain');
		});
	});

	describe('Weather Setting Abilities', () => {
		let mockBattle;
		let mockSlot;
		let messageLog;

		beforeEach(() => {
			mockBattle = {
				terrain: undefined,
				weather: undefined,
				playerSlots: [null, null],
				opponentSlots: [null, null],
			};

			mockSlot = {
				pokemon: {
					species: 'Groudon',
					ability: 'Drought',
					hp: 100,
					maxHp: 100,
				},
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			messageLog = [];
		});

		it('should set Sun weather with Drought ability', function () {
			if (!abilities) this.skip();

			mockSlot.pokemon.ability = 'Drought';
			abilities.applySwitchInAbilities(mockSlot, mockBattle, true, messageLog);

			assert(mockBattle.weather, 'Weather should be set');
			assert.equal(mockBattle.weather.type, 'sun', 'Weather type should be sun');
			assert.equal(mockBattle.weather.turns, 5, 'Weather should last 5 turns');
			assert(messageLog.some(msg => msg.includes('Drought')), 'Message should mention Drought');
		});

		it('should set Rain weather with Drizzle ability', function () {
			if (!abilities) this.skip();

			mockSlot.pokemon.ability = 'Drizzle';
			mockSlot.pokemon.species = 'Kyogre';
			abilities.applySwitchInAbilities(mockSlot, mockBattle, true, messageLog);

			assert(mockBattle.weather, 'Weather should be set');
			assert.equal(mockBattle.weather.type, 'rain', 'Weather type should be rain');
			assert.equal(mockBattle.weather.turns, 5, 'Weather should last 5 turns');
			assert(messageLog.some(msg => msg.includes('Drizzle')), 'Message should mention Drizzle');
		});

		it('should set Sandstorm weather with Sand Stream ability', function () {
			if (!abilities) this.skip();

			mockSlot.pokemon.ability = 'Sand Stream';
			mockSlot.pokemon.species = 'Tyranitar';
			abilities.applySwitchInAbilities(mockSlot, mockBattle, true, messageLog);

			assert(mockBattle.weather, 'Weather should be set');
			assert.equal(mockBattle.weather.type, 'sand', 'Weather type should be sand');
			assert.equal(mockBattle.weather.turns, 5, 'Weather should last 5 turns');
			assert(messageLog.some(msg => msg.includes('Sand Stream')), 'Message should mention Sand Stream');
		});

		it('should set Hail weather with Snow Warning ability', function () {
			if (!abilities) this.skip();

			mockSlot.pokemon.ability = 'Snow Warning';
			mockSlot.pokemon.species = 'Abomasnow';
			abilities.applySwitchInAbilities(mockSlot, mockBattle, true, messageLog);

			assert(mockBattle.weather, 'Weather should be set');
			assert.equal(mockBattle.weather.type, 'hail', 'Weather type should be hail');
			assert.equal(mockBattle.weather.turns, 5, 'Weather should last 5 turns');
			assert(messageLog.some(msg => msg.includes('Snow Warning')), 'Message should mention Snow Warning');
		});

		it('should not reset already active weather of the same type', function () {
			if (!abilities) this.skip();

			// Set weather manually first
			mockBattle.weather = { type: 'sun', turns: 3 };
			mockSlot.pokemon.ability = 'Drought';

			abilities.applySwitchInAbilities(mockSlot, mockBattle, true, messageLog);

			// Weather should still be at 3 turns, not reset to 5
			assert.equal(mockBattle.weather.turns, 3, 'Weather turns should not be reset');
			assert.equal(messageLog.length, 0, 'Should not have any messages when weather is already active');
		});
	});

	describe('Surge Surfer Speed Boost', () => {
		it('should double speed in Electric Terrain for Surge Surfer', function () {
			if (!abilities) this.skip();

			const pokemon = {
				id: 'test-raichu-001',
				species: 'Raichu-Alola',
				ability: 'Surge Surfer',
				spe: 100,
				types: ['Electric', 'Psychic'],
			};

			const mockBattle = {
				terrain: { type: 'electric', turns: 5 },
				playerSlots: [null, null],
				opponentSlots: [null, null],
			};

			const baseSpeed = 100;
			const modifiedSpeed = abilities.applySpeedModifier(pokemon, mockBattle, baseSpeed);

			assert.equal(modifiedSpeed, 200, 'Surge Surfer should double speed in Electric Terrain');
		});

		it('should not boost speed without Electric Terrain', function () {
			if (!abilities) this.skip();

			const pokemon = {
				id: 'test-raichu-002',
				species: 'Raichu-Alola',
				ability: 'Surge Surfer',
				spe: 100,
				types: ['Electric', 'Psychic'],
			};

			const mockBattle = {
				terrain: undefined,
				playerSlots: [null, null],
				opponentSlots: [null, null],
			};

			const baseSpeed = 100;
			const modifiedSpeed = abilities.applySpeedModifier(pokemon, mockBattle, baseSpeed);

			assert.equal(modifiedSpeed, 100, 'Surge Surfer should not boost speed without Electric Terrain');
		});
	});

	describe('TERRAIN_ABILITIES Object', () => {
		it('should have all terrain surge abilities defined', function () {
			if (!abilities) this.skip();

			assert(abilities.TERRAIN_ABILITIES, 'TERRAIN_ABILITIES should be exported');
			assert(abilities.TERRAIN_ABILITIES.electricsurge, 'Electric Surge should be defined');
			assert(abilities.TERRAIN_ABILITIES.grassysurge, 'Grassy Surge should be defined');
			assert(abilities.TERRAIN_ABILITIES.mistysurge, 'Misty Surge should be defined');
			assert(abilities.TERRAIN_ABILITIES.psychicsurge, 'Psychic Surge should be defined');
			assert(abilities.TERRAIN_ABILITIES.surgesurfer, 'Surge Surfer should be defined');
		});

		it('should have onSwitchIn handlers for terrain surge abilities', function () {
			if (!abilities) this.skip();

			assert.equal(typeof abilities.TERRAIN_ABILITIES.electricsurge.onSwitchIn, 'function',
				'Electric Surge should have onSwitchIn handler');
			assert.equal(typeof abilities.TERRAIN_ABILITIES.grassysurge.onSwitchIn, 'function',
				'Grassy Surge should have onSwitchIn handler');
			assert.equal(typeof abilities.TERRAIN_ABILITIES.mistysurge.onSwitchIn, 'function',
				'Misty Surge should have onSwitchIn handler');
			assert.equal(typeof abilities.TERRAIN_ABILITIES.psychicsurge.onSwitchIn, 'function',
				'Psychic Surge should have onSwitchIn handler');
		});
	});

	describe('WEATHER_ABILITIES Object', () => {
		it('should have all weather abilities defined', function () {
			if (!abilities) this.skip();

			assert(abilities.WEATHER_ABILITIES, 'WEATHER_ABILITIES should be exported');
			assert(abilities.WEATHER_ABILITIES.drought, 'Drought should be defined');
			assert(abilities.WEATHER_ABILITIES.drizzle, 'Drizzle should be defined');
			assert(abilities.WEATHER_ABILITIES.sandstream, 'Sand Stream should be defined');
			assert(abilities.WEATHER_ABILITIES.snowwarning, 'Snow Warning should be defined');
		});

		it('should have onSwitchIn handlers for weather abilities', function () {
			if (!abilities) this.skip();

			assert.equal(typeof abilities.WEATHER_ABILITIES.drought.onSwitchIn, 'function',
				'Drought should have onSwitchIn handler');
			assert.equal(typeof abilities.WEATHER_ABILITIES.drizzle.onSwitchIn, 'function',
				'Drizzle should have onSwitchIn handler');
			assert.equal(typeof abilities.WEATHER_ABILITIES.sandstream.onSwitchIn, 'function',
				'Sand Stream should have onSwitchIn handler');
			assert.equal(typeof abilities.WEATHER_ABILITIES.snowwarning.onSwitchIn, 'function',
				'Snow Warning should have onSwitchIn handler');
		});
	});
});
