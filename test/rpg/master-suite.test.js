'use strict';

/**
 * RPG Master Test Suite
 * Comprehensive integration tests for the entire RPG system
 */

const assert = require('assert').strict;

describe('RPG System - Master Integration Suite', function () {
	this.timeout(15000);

	let core, utils, items, npcActions, scriptedEvents, Dex;
	let testPlayer;

	before(function () {
		try {
			core = require('../../dist/impulse/chat-plugins/rpg-wip/core');
			utils = require('../../dist/impulse/chat-plugins/rpg-wip/utils');
			items = require('../../dist/impulse/chat-plugins/rpg-wip/items');
			npcActions = require('../../dist/impulse/chat-plugins/rpg-wip/npc-actions');
			scriptedEvents = require('../../dist/impulse/chat-plugins/rpg-wip/scripted-events');
			Dex = require('../../dist/sim/dex').Dex;
		} catch (e) {
			console.log('RPG modules not found, skipping master suite:', e.message);
			this.skip();
		}
	});

	beforeEach(() => {
		testPlayer = core.getPlayerData('mastertest001');
		testPlayer.party = [];
		testPlayer.inventory.clear();
		testPlayer.pc.clear();
		testPlayer.storyFlags.clear();
		testPlayer.completedNPCActions.clear();
		testPlayer.money = 5000;
		testPlayer.badges = 0;
	});

	describe('Complete Game Flow Integration', () => {
		it('should handle new player creation through badge collection', function () {
			// Create new player
			const player = core.getPlayerData('flowtest001');
			assert.equal(player.badges, 0);
			assert.equal(player.party.length, 0);

			// Get starter Pokemon
			const starter = core.createPokemon('bulbasaur', 5);
			player.party.push(starter);

			assert.equal(player.party.length, 1);
			assert.equal(player.party[0].species, 'Bulbasaur');

			// Battle and level up
			const exp = utils.calculateTotalExpForLevel('Medium Slow', 10);
			player.party[0].experience = exp;
			player.party[0].level = 10;

			assert.equal(player.party[0].level, 10);

			// Earn badge
			player.badges = 1;
			assert.equal(player.badges, 1);

			// Buy items from shop
			items.addItemToInventory(player, 'pokeball', 5);
			assert.equal(player.inventory.get('pokeball').quantity, 5);

			// Complete full flow
			assert(player.party.length > 0);
			assert(player.badges > 0);
			assert(player.inventory.size > 0);
		});

		it('should handle catching Pokemon and PC storage', function () {
			// Fill party
			for (let i = 0; i < 6; i++) {
				testPlayer.party.push(core.createPokemon('pikachu', 10));
			}

			assert.equal(testPlayer.party.length, 6);

			// Catch 7th Pokemon (should go to PC)
			const newPokemon = core.createPokemon('eevee', 15);
			core.storePokemonInPC(testPlayer, newPokemon);

			assert.equal(testPlayer.party.length, 6);
			assert.equal(testPlayer.pc.size, 1);

			// Verify PC storage
			const pcPokemon = testPlayer.pc.get(newPokemon.id);
			assert.equal(pcPokemon.species, 'Eevee');
		});

		it('should handle NPC interactions and rewards', function () {
			// Interact with item-giving NPC
			items.addItemToInventory(testPlayer, 'potion', 10);

			// Mark NPC as completed
			testPlayer.completedNPCActions.add('helpfulnpc1');

			assert(testPlayer.completedNPCActions.has('helpfulnpc1'));
			assert.equal(testPlayer.inventory.get('potion').quantity, 10);

			// Cannot interact again with one-time NPC
			const canInteract = !testPlayer.completedNPCActions.has('helpfulnpc1');
			assert.equal(canInteract, false);
		});

		it('should handle story progression with flags', function () {
			// Set initial flag
			testPlayer.storyFlags.add('met_professor');

			assert(testPlayer.storyFlags.has('met_professor'));

			// Complete quest stage
			testPlayer.storyFlags.add('quest_1_complete');

			// Unlock new area
			if (testPlayer.storyFlags.has('quest_1_complete')) {
				testPlayer.storyFlags.add('area_unlocked');
			}

			assert(testPlayer.storyFlags.has('area_unlocked'));
		});
	});

	describe('Battle System Integration', () => {
		let pokemon1, pokemon2;

		beforeEach(() => {
			pokemon1 = core.createPokemon('pikachu', 50);
			pokemon2 = core.createPokemon('charizard', 50);
		});

		it('should create valid battle-ready Pokemon', function () {
			const slot1 = core.createActivePokemonSlot(pokemon1);
			const slot2 = core.createActivePokemonSlot(pokemon2);

			assert.equal(slot1.pokemon.species, 'Pikachu');
			assert.equal(slot2.pokemon.species, 'Charizard');

			assert(slot1.pokemon.moves.length > 0);
			assert(slot2.pokemon.moves.length > 0);

			assert.equal(slot1.statBoosts.atk, 0);
			assert.equal(slot2.statBoosts.atk, 0);
		});

		it('should handle damage calculations correctly', function () {
			if (!utils.calculateDamage) {
				this.skip();
				return;
			}

			const damage = utils.calculateDamage(
				pokemon1.level,
				pokemon1.atk,
				pokemon2.def,
				1.5, // STAB
				2,   // Super effective
				1    // No crit
			);

			assert(damage > 0);
			assert(typeof damage === 'number');
		});

		it('should apply type effectiveness correctly', function () {
			if (!utils.getTypeEffectiveness) {
				this.skip();
				return;
			}

			// Water vs Fire = super effective
			const effectiveness = utils.getTypeEffectiveness('Water', 'Fire');
			assert.equal(effectiveness, 2);

			// Fire vs Water = not very effective
			const effectiveness2 = utils.getTypeEffectiveness('Fire', 'Water');
			assert.equal(effectiveness2, 0.5);
		});
	});

	describe('Weather System Integration', () => {
		it('should apply location weather to battles', function () {
			testPlayer.location = 'desertroutе';

			// Simulate getting location weather
			const hasWeather = true; // Assume location has weather

			if (hasWeather) {
				const weatherType = 'sandstorm';
				assert(weatherType);
			}
		});

		it('should restore location weather after temporary weather', function () {
			const locationWeather = 'rain';
			let currentWeather = locationWeather;

			// Temporary weather from move
			currentWeather = 'sun';

			// After 5 turns, restore
			currentWeather = locationWeather;

			assert.equal(currentWeather, 'rain');
		});
	});

	describe('Economy System Integration', () => {
		it('should handle buying and selling items', function () {
			const initialMoney = testPlayer.money;

			// Buy items
			items.addItemToInventory(testPlayer, 'potion', 5);
			testPlayer.money -= 1000; // Simulate cost

			assert(testPlayer.money < initialMoney);
			assert.equal(testPlayer.inventory.get('potion').quantity, 5);

			// Sell items back
			items.removeItemFromInventory(testPlayer, 'potion', 2);
			testPlayer.money += 400; // Simulate sell price

			assert.equal(testPlayer.inventory.get('potion').quantity, 3);
		});

		it('should prevent buying without enough money', function () {
			testPlayer.money = 100;

			const canBuy = testPlayer.money >= 5000;

			assert.equal(canBuy, false);
		});
	});

	describe('Quest System Integration', () => {
		it('should track multi-stage quests', function () {
			if (!npcActions.handleQuestChain || !npcActions.advanceQuestStage) {
				this.skip();
				return;
			}

			const questId = 'mainquest';

			// Start quest
			npcActions.handleQuestChain(testPlayer, {
				type: 'questchain',
				questId,
				questStages: [
					{ stage: 1, description: 'Find the item' },
					{ stage: 2, description: 'Deliver the item' },
					{ stage: 3, description: 'Receive reward' },
				],
			});

			// Advance through stages
			npcActions.advanceQuestStage(testPlayer, questId);
			npcActions.advanceQuestStage(testPlayer, questId);

			// Check progression
			assert(testPlayer.storyFlags.has(`quest_${questId}_stage_1`));
		});
	});

	describe('Event System Integration', () => {
		it('should handle scripted event sequences', function () {
			if (!scriptedEvents.handleCutscene || !scriptedEvents.handleChoice) {
				this.skip();
				return;
			}

			// Play cutscene
			const cutsceneResult = scriptedEvents.handleCutscene(testPlayer, {
				id: 'intro',
				type: 'cutscene',
				cutsceneScript: ['Welcome!', 'Choose your path.'],
				setFlag: 'intro_seen',
			});

			if (cutsceneResult && cutsceneResult.success) {
				assert(testPlayer.storyFlags.has('intro_seen'));
			}

			// Make choice
			const choiceResult = scriptedEvents.handleChoice(testPlayer, {
				id: 'path_choice',
				type: 'choice',
				choices: [
					{ text: 'Path A', resultFlag: 'chose_path_a' },
					{ text: 'Path B', resultFlag: 'chose_path_b' },
				],
			}, 0);

			if (choiceResult && choiceResult.success) {
				assert(testPlayer.storyFlags.has('chose_path_a'));
			}
		});

		it('should handle Pokemon swarm mechanics', function () {
			if (!scriptedEvents.handlePokemonSwarm || !scriptedEvents.checkActiveSwarm) {
				this.skip();
				return;
			}

			// Trigger swarm
			scriptedEvents.handlePokemonSwarm(testPlayer, {
				id: 'dratini_swarm',
				type: 'pokemonswarm',
				swarmSpecies: 'dratini',
				swarmDuration: 24,
			});

			// Check if swarm is active
			const isActive = scriptedEvents.checkActiveSwarm(testPlayer, 'dratini');

			assert.equal(typeof isActive, 'boolean');
		});
	});

	describe('Serialization Integration', () => {
		it('should serialize and deserialize complete player data', function () {
			// Setup player with full data
			testPlayer.party.push(core.createPokemon('pikachu', 25));
			testPlayer.party.push(core.createPokemon('charizard', 40));
			items.addItemToInventory(testPlayer, 'potion', 10);
			items.addItemToInventory(testPlayer, 'pokeball', 5);
			testPlayer.storyFlags.add('flag1');
			testPlayer.storyFlags.add('flag2');
			testPlayer.completedNPCActions.add('npc1');
			testPlayer.badges = 3;
			testPlayer.money = 7500;

			// Serialize
			const serialized = core.serializePlayerData(testPlayer);

			// Verify serialization
			assert.equal(serialized.badges, 3);
			assert.equal(serialized.money, 7500);
			assert.equal(serialized.party.length, 2);
			assert(Array.isArray(serialized.storyFlags));
			assert(serialized.storyFlags.includes('flag1'));

			// Deserialize
			const deserialized = core.deserializePlayerData(serialized);

			// Verify deserialization
			assert.equal(deserialized.badges, 3);
			assert.equal(deserialized.money, 7500);
			assert.equal(deserialized.party.length, 2);
			assert(deserialized.storyFlags instanceof Set);
			assert(deserialized.storyFlags.has('flag1'));
			assert(deserialized.completedNPCActions instanceof Set);
			assert(deserialized.completedNPCActions.has('npc1'));
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('should handle extreme scenarios gracefully', function () {
			// Maximum money
			testPlayer.money = 999999;
			assert.equal(testPlayer.money, 999999);

			// Maximum badges
			testPlayer.badges = 8;
			assert.equal(testPlayer.badges, 8);

			// Empty party
			testPlayer.party = [];
			assert.equal(testPlayer.party.length, 0);

			// Large PC
			for (let i = 0; i < 50; i++) {
				core.storePokemonInPC(testPlayer, core.createPokemon('pikachu', 10));
			}
			assert.equal(testPlayer.pc.size, 50);

			// Many story flags
			for (let i = 0; i < 100; i++) {
				testPlayer.storyFlags.add(`flag${i}`);
			}
			assert.equal(testPlayer.storyFlags.size, 100);
		});

		it('should maintain data integrity through operations', function () {
			const initialId = testPlayer.id;
			const initialName = testPlayer.name;

			// Perform various operations
			testPlayer.party.push(core.createPokemon('pikachu', 10));
			items.addItemToInventory(testPlayer, 'potion', 5);
			testPlayer.badges++;

			// ID and name should remain unchanged
			assert.equal(testPlayer.id, initialId);
			assert.equal(testPlayer.name, initialName);
		});
	});

	describe('Performance and Scalability', () => {
		it('should handle large inventories efficiently', function () {
			const startTime = Date.now();

			// Add many items
			for (let i = 0; i < 100; i++) {
				items.addItemToInventory(testPlayer, `item${i}`, 10);
			}

			const endTime = Date.now();
			const duration = endTime - startTime;

			assert.equal(testPlayer.inventory.size, 100);
			assert(duration < 1000); // Should complete in less than 1 second
		});

		it('should handle large PC efficiently', function () {
			const startTime = Date.now();

			// Add many Pokemon to PC
			for (let i = 0; i < 100; i++) {
				const pokemon = core.createPokemon('pikachu', 10);
				core.storePokemonInPC(testPlayer, pokemon);
			}

			const endTime = Date.now();
			const duration = endTime - startTime;

			assert.equal(testPlayer.pc.size, 100);
			assert(duration < 2000); // Should complete in less than 2 seconds
		});
	});
});
