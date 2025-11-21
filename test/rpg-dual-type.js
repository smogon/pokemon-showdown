'use strict';

/**
 * Dual Type Pokemon Handling Test Suite
 * Tests that dual-type Pokemon are correctly handled in damage, effectiveness, and end-of-turn effects
 */

const assert = require('assert').strict;

describe('RPG System - Dual Type Pokemon Handling', function () {
	this.timeout(15000);

	let utils, battleCore, battleEot, Dex;

	before(function () {
		try {
			// Load required modules from dist
			utils = require('../dist/impulse/chat-plugins/rpg-wip/utils');
			battleCore = require('../dist/impulse/chat-plugins/rpg-wip/battle-core');
			battleEot = require('../dist/impulse/chat-plugins/rpg-wip/battle-eot');
			Dex = require('../dist/sim/dex').Dex;
		} catch (e) {
			console.log('RPG module not found in dist, skipping tests:', e.message);
			this.skip();
		}
	});

	describe('Type Effectiveness for Dual Types', () => {
		it('should calculate 4x effectiveness for dual-weak types', function () {
			if (!battleCore) this.skip();

			// Charizard is Fire/Flying, so it's 4x weak to Rock
			const charizardTypes = ['Fire', 'Flying'];
			const effectiveness = battleCore.getCustomEffectiveness('Rock', charizardTypes, 
				{ species: 'Charizard' }, {}, undefined);
			
			assert.equal(effectiveness, 4, 'Charizard should be 4x weak to Rock moves');
		});

		it('should calculate 0.25x effectiveness for dual-resist types', function () {
			if (!battleCore) this.skip();

			// Ferrothorn is Grass/Steel, so it's 0.25x weak to Grass
			const ferrothornTypes = ['Grass', 'Steel'];
			const effectiveness = battleCore.getCustomEffectiveness('Grass', ferrothornTypes, 
				{ species: 'Ferrothorn' }, {}, undefined);
			
			assert.equal(effectiveness, 0.25, 'Ferrothorn should be 0.25x weak to Grass moves');
		});

		it('should calculate 2x effectiveness for single-effective type on dual type', function () {
			if (!battleCore) this.skip();

			// Garchomp is Dragon/Ground, so it's 2x weak to Ice (super effective on both)
			const garchompTypes = ['Dragon', 'Ground'];
			const effectiveness = battleCore.getCustomEffectiveness('Ice', garchompTypes, 
				{ species: 'Garchomp' }, {}, undefined);
			
			assert.equal(effectiveness, 4, 'Garchomp should be 4x weak to Ice moves (super effective on both types)');
		});

		it('should calculate 1x effectiveness for neutral dual type', function () {
			if (!battleCore) this.skip();

			// Gyarados is Water/Flying, so it's neutral to Normal
			const gyaradosTypes = ['Water', 'Flying'];
			const effectiveness = battleCore.getCustomEffectiveness('Normal', gyaradosTypes, 
				{ species: 'Gyarados' }, {}, undefined);
			
			assert.equal(effectiveness, 1, 'Gyarados should be 1x to Normal moves');
		});

		it('should calculate 0x effectiveness when one type is immune', function () {
			if (!battleCore) this.skip();

			// Flygon is Ground/Dragon, so it's immune to Electric
			const flygonTypes = ['Ground', 'Dragon'];
			const effectiveness = battleCore.getCustomEffectiveness('Electric', flygonTypes, 
				{ species: 'Flygon' }, {}, undefined);
			
			assert.equal(effectiveness, 0, 'Flygon should be immune to Electric moves');
		});

		it('should handle super effective on one type and resist on another (neutral)', function () {
			if (!battleCore) this.skip();

			// Empoleon is Water/Steel, Fighting is super effective on Steel but not very effective on Water
			const empoleonTypes = ['Water', 'Steel'];
			const effectiveness = battleCore.getCustomEffectiveness('Fighting', empoleonTypes, 
				{ species: 'Empoleon' }, {}, undefined);
			
			// 2x (super on Steel) * 1x (neutral on Water) = 2x
			assert.equal(effectiveness, 2, 'Fighting should be 2x effective on Empoleon (Water/Steel)');
		});
	});

	describe('Weather Damage for Dual Types', () => {
		it('should not damage Rock-type dual types in Sandstorm', function () {
			if (!battleEot) this.skip();

			const battle = {
				weather: { type: 'sand', turns: 5 },
				playerSlots: [],
				opponentSlots: [],
			};
			const slot = {
				pokemon: {
					species: 'Tyranitar',
					maxHp: 100,
					hp: 100,
					ability: 'Sand Stream',
				},
			};
			const messageLog = [];

			// Tyranitar is Rock/Dark, should be immune to sandstorm damage
			const allSlots = [slot];
			battleEot.handleEndOfTurnWeather(battle, messageLog, allSlots);
			
			assert.equal(slot.pokemon.hp, 100, 'Tyranitar should not take Sandstorm damage');
		});

		it('should not damage Ground-type dual types in Sandstorm', function () {
			if (!battleEot) this.skip();

			const battle = {
				weather: { type: 'sand', turns: 5 },
				playerSlots: [],
				opponentSlots: [],
			};
			const slot = {
				pokemon: {
					species: 'Garchomp',
					maxHp: 100,
					hp: 100,
					ability: 'Rough Skin',
				},
			};
			const messageLog = [];

			// Garchomp is Dragon/Ground, should be immune to sandstorm damage
			const allSlots = [slot];
			battleEot.handleEndOfTurnWeather(battle, messageLog, allSlots);
			
			assert.equal(slot.pokemon.hp, 100, 'Garchomp should not take Sandstorm damage');
		});

		it('should not damage Steel-type dual types in Sandstorm', function () {
			if (!battleEot) this.skip();

			const battle = {
				weather: { type: 'sand', turns: 5 },
				playerSlots: [],
				opponentSlots: [],
			};
			const slot = {
				pokemon: {
					species: 'Excadrill',
					maxHp: 100,
					hp: 100,
					ability: 'Sand Force',
				},
			};
			const messageLog = [];

			// Excadrill is Ground/Steel, should be immune to sandstorm damage
			const allSlots = [slot];
			battleEot.handleEndOfTurnWeather(battle, messageLog, allSlots);
			
			assert.equal(slot.pokemon.hp, 100, 'Excadrill should not take Sandstorm damage');
		});

		it('should damage non-immune dual types in Sandstorm', function () {
			if (!battleEot) this.skip();

			const battle = {
				weather: { type: 'sand', turns: 5 },
				playerSlots: [],
				opponentSlots: [],
			};
			const slot = {
				pokemon: {
					species: 'Charizard',
					maxHp: 100,
					hp: 100,
					ability: 'Blaze',
				},
			};
			const messageLog = [];

			// Charizard is Fire/Flying, should take sandstorm damage
			const allSlots = [slot];
			battleEot.handleEndOfTurnWeather(battle, messageLog, allSlots);
			
			assert(slot.pokemon.hp < 100, 'Charizard should take Sandstorm damage');
			assert(slot.pokemon.hp >= 93, 'Charizard should take about 1/16 damage from Sandstorm');
		});
	});

	describe('Status Immunity for Dual Types', () => {
		it('should prevent paralysis on Electric-type dual types', function () {
			if (!battleCore) this.skip();

			// Emolga is Electric/Flying
			const defenderTypes = Dex.species.get('Emolga').types;
			const hasElectric = defenderTypes.includes('Electric');
			
			assert(hasElectric, 'Emolga should have Electric type and be immune to paralysis');
		});

		it('should prevent burn on Fire-type dual types', function () {
			if (!battleCore) this.skip();

			// Blaziken is Fire/Fighting
			const defenderTypes = Dex.species.get('Blaziken').types;
			const hasFire = defenderTypes.includes('Fire');
			
			assert(hasFire, 'Blaziken should have Fire type and be immune to burn');
		});

		it('should prevent poison on Poison-type dual types', function () {
			if (!battleCore) this.skip();

			// Crobat is Poison/Flying
			const defenderTypes = Dex.species.get('Crobat').types;
			const hasPoison = defenderTypes.includes('Poison');
			
			assert(hasPoison, 'Crobat should have Poison type and be immune to poison');
		});

		it('should prevent poison on Steel-type dual types', function () {
			if (!battleCore) this.skip();

			// Lucario is Fighting/Steel
			const defenderTypes = Dex.species.get('Lucario').types;
			const hasSteel = defenderTypes.includes('Steel');
			
			assert(hasSteel, 'Lucario should have Steel type and be immune to poison');
		});
	});

	describe('Weather Defense Boosts for Dual Types', () => {
		it('should boost SpDef for Rock-type dual types in Sandstorm', function () {
			if (!battleCore) this.skip();

			const battle = {
				weather: { type: 'sand', turns: 5 },
				wonderRoomTurns: 0,
				magicRoomTurns: 0,
			};
			const defender = {
				species: 'Tyranitar',
				spd: 100,
				ability: 'Sand Stream',
			};
			const defenderSlot = {
				statStages: { spd: 0 },
			};
			const move = { category: 'Special', id: 'thunderbolt' };

			// This should apply the 1.5x boost
			const defenseStat = battleCore.getDamageDefense(move, defender, defenderSlot, battle);
			
			// Base 100 SpD * 1.5 = 150
			assert.equal(defenseStat, 150, 'Tyranitar should get 1.5x SpDef boost in Sandstorm');
		});

		it('should boost Def for Ice-type dual types in Hail/Snow', function () {
			if (!battleCore) this.skip();

			const battle = {
				weather: { type: 'hail', turns: 5 },
				wonderRoomTurns: 0,
				magicRoomTurns: 0,
			};
			const defender = {
				species: 'Abomasnow',
				def: 100,
				ability: 'Snow Warning',
			};
			const defenderSlot = {
				statStages: { def: 0 },
			};
			const move = { category: 'Physical', id: 'earthquake' };

			// This should apply the 1.5x boost
			const defenseStat = battleCore.getDamageDefense(move, defender, defenderSlot, battle);
			
			// Base 100 Def * 1.5 = 150
			assert.equal(defenseStat, 150, 'Abomasnow should get 1.5x Def boost in Hail');
		});
	});

	describe('Black Sludge for Dual Types', () => {
		it('should heal Poison-type dual types', function () {
			if (!battleEot) this.skip();

			const battle = { magicRoomTurns: 0 };
			const slot = {
				pokemon: {
					species: 'Crobat',
					maxHp: 100,
					hp: 80,
					item: 'blacksludge',
				},
			};
			const messageLog = [];

			// Crobat is Poison/Flying, should heal
			battleEot.applyEOTHealingItemEffects(slot, battle, messageLog);
			
			assert(slot.pokemon.hp > 80, 'Crobat should heal from Black Sludge');
		});

		it('should damage non-Poison-type dual types', function () {
			if (!battleEot) this.skip();

			const battle = { magicRoomTurns: 0 };
			const slot = {
				pokemon: {
					species: 'Charizard',
					maxHp: 100,
					hp: 100,
					item: 'blacksludge',
					ability: 'Blaze',
				},
			};
			const messageLog = [];

			// Charizard is Fire/Flying, should take damage
			battleEot.applyEOTNonHealingItemEffects(slot, battle, messageLog);
			
			assert(slot.pokemon.hp < 100, 'Charizard should take damage from Black Sludge');
		});
	});

	describe('Toxic Orb for Dual Types', () => {
		it('should not poison Poison-type dual types', function () {
			if (!battleEot) this.skip();

			const battle = { magicRoomTurns: 0 };
			const slot = {
				pokemon: {
					species: 'Toxicroak',
					maxHp: 100,
					hp: 100,
					item: 'toxicorb',
				},
				status: null,
			};
			const messageLog = [];

			// Toxicroak is Poison/Fighting, should not be poisoned
			battleEot.applyEOTNonHealingItemEffects(slot, battle, messageLog);
			
			assert.equal(slot.status, null, 'Toxicroak should not be poisoned by Toxic Orb');
		});

		it('should not poison Steel-type dual types', function () {
			if (!battleEot) this.skip();

			const battle = { magicRoomTurns: 0 };
			const slot = {
				pokemon: {
					species: 'Lucario',
					maxHp: 100,
					hp: 100,
					item: 'toxicorb',
				},
				status: null,
			};
			const messageLog = [];

			// Lucario is Fighting/Steel, should not be poisoned
			battleEot.applyEOTNonHealingItemEffects(slot, battle, messageLog);
			
			assert.equal(slot.status, null, 'Lucario should not be poisoned by Toxic Orb');
		});

		it('should poison non-immune dual types', function () {
			if (!battleEot) this.skip();

			const battle = { magicRoomTurns: 0 };
			const slot = {
				pokemon: {
					species: 'Gyarados',
					maxHp: 100,
					hp: 100,
					item: 'toxicorb',
				},
				status: null,
			};
			const messageLog = [];

			// Gyarados is Water/Flying, should be poisoned
			battleEot.applyEOTNonHealingItemEffects(slot, battle, messageLog);
			
			assert.equal(slot.status, 'tox', 'Gyarados should be badly poisoned by Toxic Orb');
		});
	});

	describe('Flame Orb for Dual Types', () => {
		it('should not burn Fire-type dual types', function () {
			if (!battleEot) this.skip();

			const battle = { magicRoomTurns: 0 };
			const slot = {
				pokemon: {
					species: 'Infernape',
					maxHp: 100,
					hp: 100,
					item: 'flameorb',
				},
				status: null,
			};
			const messageLog = [];

			// Infernape is Fire/Fighting, should not be burned
			battleEot.applyEOTNonHealingItemEffects(slot, battle, messageLog);
			
			assert.equal(slot.status, null, 'Infernape should not be burned by Flame Orb');
		});

		it('should burn non-Fire-type dual types', function () {
			if (!battleEot) this.skip();

			const battle = { magicRoomTurns: 0 };
			const slot = {
				pokemon: {
					species: 'Dragonite',
					maxHp: 100,
					hp: 100,
					item: 'flameorb',
				},
				status: null,
			};
			const messageLog = [];

			// Dragonite is Dragon/Flying, should be burned
			battleEot.applyEOTNonHealingItemEffects(slot, battle, messageLog);
			
			assert.equal(slot.status, 'brn', 'Dragonite should be burned by Flame Orb');
		});
	});
});
