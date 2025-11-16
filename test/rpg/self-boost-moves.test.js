'use strict';

/**
 * Self-Boost Moves Tests
 * Tests moves with secondary self-stats boosting effects (e.g., Power-Up Punch, Flame Charge)
 */

const assert = require('assert').strict;

describe('RPG Self-Boost Moves', function () {
	this.timeout(10000);

	let battleCore;
	let utils;

	before(function () {
		try {
			battleCore = require('../../dist/impulse/chat-plugins/rpg-wip/battle-core');
			utils = require('../../dist/impulse/chat-plugins/rpg-wip/utils');
		} catch (e) {
			console.log('Battle modules not found, skipping tests:', e.message);
			this.skip();
		}
	});

	describe('Power-Up Punch (100% Attack boost)', () => {
		let battle, attackerSlot, defenderSlot;

		beforeEach(() => {
			// Create a simple battle state
			battle = {
				playerSlots: [],
				opponentSlots: [],
				weather: null,
				terrain: null,
				magicRoomTurns: 0,
			};

			// Create attacker with Power-Up Punch
			attackerSlot = {
				pokemon: {
					id: 'attacker-1',
					species: 'Machamp',
					nickname: 'Machamp',
					level: 50,
					hp: 150,
					maxHp: 150,
					atk: 130,
					def: 80,
					spa: 65,
					spd: 85,
					spe: 55,
					ability: null,
					nature: 'Adamant',
					item: null,
					status: null,
					gender: 'M',
					shiny: false,
					moves: ['poweruppunch'],
					exp: 0,
					evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
					ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
				},
				status: null,
				statStages: {
					atk: 0,
					def: 0,
					spa: 0,
					spd: 0,
					spe: 0,
					accuracy: 0,
					evasion: 0,
				},
				isProtected: false,
				isConfused: false,
				confusionCounter: 0,
				substitute: null,
				lastMoveUsed: null,
				chargingMove: null,
				isSeeded: false,
				isCursed: false,
				isIngrained: false,
				hasAquaRing: false,
				focusEnergy: false,
				isTrapped: null,
				magnetRiseTurns: 0,
				telekinesisCounter: 0,
				isSmackedDown: false,
				tauntTurns: 0,
				tormentActive: false,
				disabledMove: null,
				encoreMove: null,
				embargoTurns: 0,
				healBlockTurns: 0,
				yawnCounter: 0,
				willFlinch: false,
				isHelped: false,
			};

			// Create defender
			defenderSlot = {
				pokemon: {
					id: 'defender-1',
					species: 'Snorlax',
					nickname: 'Snorlax',
					level: 50,
					hp: 200,
					maxHp: 200,
					atk: 110,
					def: 65,
					spa: 65,
					spd: 110,
					spe: 30,
					ability: null,
					nature: 'Adamant',
					item: null,
					status: null,
					gender: 'M',
					shiny: false,
					moves: ['tackle'],
					exp: 0,
					evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
					ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
				},
				status: null,
				statStages: {
					atk: 0,
					def: 0,
					spa: 0,
					spd: 0,
					spe: 0,
					accuracy: 0,
					evasion: 0,
				},
				isProtected: false,
				isConfused: false,
				confusionCounter: 0,
				substitute: null,
				lastMoveUsed: null,
				chargingMove: null,
				isSeeded: false,
				isCursed: false,
				isIngrained: false,
				hasAquaRing: false,
				focusEnergy: false,
				isTrapped: null,
				magnetRiseTurns: 0,
				telekinesisCounter: 0,
				isSmackedDown: false,
				tauntTurns: 0,
				tormentActive: false,
				disabledMove: null,
				encoreMove: null,
				embargoTurns: 0,
				healBlockTurns: 0,
				yawnCounter: 0,
				willFlinch: false,
				isHelped: false,
			};
		});

		it('should boost attacker Attack stat by 1 stage', () => {
			const move = utils.getMove('poweruppunch');
			assert(move, 'Power-Up Punch move should exist');
			
			// Verify the move has secondary.self.boosts
			assert(move.secondary, 'Move should have secondary effect');
			assert(move.secondary.self, 'Move should have self effect');
			assert(move.secondary.self.boosts, 'Move should have self boosts');
			assert.equal(move.secondary.self.boosts.atk, 1, 'Should boost Attack by 1');
			assert.equal(move.secondary.chance, 100, 'Should have 100% chance');

			const messageLog = [];
			const abilityContext = {
				attacker: attackerSlot.pokemon,
				defender: defenderSlot.pokemon,
				move,
			};

			// Verify initial stat stage is 0
			assert.equal(attackerSlot.statStages.atk, 0, 'Initial Attack stage should be 0');

			// Apply secondary effects (this will boost Attack)
			battleCore.applySecondaryEffects(attackerSlot, defenderSlot, move, battle, messageLog, abilityContext);

			// Verify Attack was boosted
			assert.equal(attackerSlot.statStages.atk, 1, 'Attack stage should be 1 after Power-Up Punch');
			
			// Verify message was logged
			const hasBoostMessage = messageLog.some(msg => msg.includes('ATK') && msg.includes('rose'));
			assert(hasBoostMessage, 'Should log Attack boost message');
		});

		it('should not exceed +6 Attack stages', () => {
			const move = utils.getMove('poweruppunch');
			const messageLog = [];
			const abilityContext = {
				attacker: attackerSlot.pokemon,
				defender: defenderSlot.pokemon,
				move,
			};

			// Set Attack stage to +5
			attackerSlot.statStages.atk = 5;

			// Apply secondary effects twice
			battleCore.applySecondaryEffects(attackerSlot, defenderSlot, move, battle, messageLog, abilityContext);
			assert.equal(attackerSlot.statStages.atk, 6, 'Attack stage should cap at 6');

			battleCore.applySecondaryEffects(attackerSlot, defenderSlot, move, battle, messageLog, abilityContext);
			assert.equal(attackerSlot.statStages.atk, 6, 'Attack stage should remain at 6');
		});
	});

	describe('Flame Charge (100% Speed boost)', () => {
		let battle, attackerSlot, defenderSlot;

		beforeEach(() => {
			battle = {
				playerSlots: [],
				opponentSlots: [],
				weather: null,
				terrain: null,
				magicRoomTurns: 0,
			};

			attackerSlot = {
				pokemon: {
					id: 'attacker-2',
					species: 'Infernape',
					nickname: 'Infernape',
					level: 50,
					hp: 150,
					maxHp: 150,
					atk: 104,
					def: 71,
					spa: 104,
					spd: 71,
					spe: 108,
					ability: null,
					item: null,
					status: null,
				},
				statStages: {
					atk: 0,
					def: 0,
					spa: 0,
					spd: 0,
					spe: 0,
					accuracy: 0,
					evasion: 0,
				},
				substitute: null,
			};

			defenderSlot = {
				pokemon: {
					id: 'defender-2',
					species: 'Snorlax',
					hp: 200,
					maxHp: 200,
					ability: null,
					item: null,
					status: null,
				},
				statStages: {
					atk: 0,
					def: 0,
					spa: 0,
					spd: 0,
					spe: 0,
					accuracy: 0,
					evasion: 0,
				},
				substitute: null,
			};
		});

		it('should boost attacker Speed stat by 1 stage', () => {
			const move = utils.getMove('flamecharge');
			assert(move, 'Flame Charge move should exist');
			
			const messageLog = [];
			const abilityContext = {
				attacker: attackerSlot.pokemon,
				defender: defenderSlot.pokemon,
				move,
			};

			assert.equal(attackerSlot.statStages.spe, 0, 'Initial Speed stage should be 0');

			battleCore.applySecondaryEffects(attackerSlot, defenderSlot, move, battle, messageLog, abilityContext);

			assert.equal(attackerSlot.statStages.spe, 1, 'Speed stage should be 1 after Flame Charge');
			
			const hasBoostMessage = messageLog.some(msg => msg.includes('SPE') && msg.includes('rose'));
			assert(hasBoostMessage, 'Should log Speed boost message');
		});
	});

	describe('Metal Claw (10% Attack boost)', () => {
		let battle, attackerSlot, defenderSlot;

		beforeEach(() => {
			battle = {
				playerSlots: [],
				opponentSlots: [],
				weather: null,
				terrain: null,
				magicRoomTurns: 0,
			};

			attackerSlot = {
				pokemon: {
					id: 'attacker-3',
					species: 'Scizor',
					nickname: 'Scizor',
					level: 50,
					hp: 150,
					maxHp: 150,
					atk: 130,
					def: 100,
					spa: 55,
					spd: 80,
					spe: 65,
					ability: null,
					item: null,
					status: null,
				},
				statStages: {
					atk: 0,
					def: 0,
					spa: 0,
					spd: 0,
					spe: 0,
					accuracy: 0,
					evasion: 0,
				},
				substitute: null,
			};

			defenderSlot = {
				pokemon: {
					id: 'defender-3',
					species: 'Snorlax',
					hp: 200,
					maxHp: 200,
					ability: null,
					item: null,
					status: null,
				},
				statStages: {
					atk: 0,
					def: 0,
					spa: 0,
					spd: 0,
					spe: 0,
					accuracy: 0,
					evasion: 0,
				},
				substitute: null,
			};
		});

		it('should have 10% chance to boost Attack', () => {
			const move = utils.getMove('metalclaw');
			assert(move, 'Metal Claw move should exist');
			assert.equal(move.secondary.chance, 10, 'Should have 10% chance');
			
			// We can't reliably test randomness in a single test,
			// but we can verify the structure is correct
			assert(move.secondary.self, 'Move should have self effect');
			assert(move.secondary.self.boosts, 'Move should have self boosts');
			assert.equal(move.secondary.self.boosts.atk, 1, 'Should boost Attack by 1');
		});
	});

	describe('Contrary ability interaction', () => {
		let battle, attackerSlot, defenderSlot;

		beforeEach(() => {
			battle = {
				playerSlots: [],
				opponentSlots: [],
				weather: null,
				terrain: null,
				magicRoomTurns: 0,
			};

			attackerSlot = {
				pokemon: {
					id: 'attacker-4',
					species: 'Malamar',
					nickname: 'Malamar',
					level: 50,
					hp: 150,
					maxHp: 150,
					atk: 92,
					def: 88,
					spa: 68,
					spd: 75,
					spe: 73,
					ability: 'Contrary',
					item: null,
					status: null,
				},
				statStages: {
					atk: 0,
					def: 0,
					spa: 0,
					spd: 0,
					spe: 0,
					accuracy: 0,
					evasion: 0,
				},
				substitute: null,
			};

			defenderSlot = {
				pokemon: {
					id: 'defender-4',
					species: 'Snorlax',
					hp: 200,
					maxHp: 200,
					ability: null,
					item: null,
					status: null,
				},
				statStages: {
					atk: 0,
					def: 0,
					spa: 0,
					spd: 0,
					spe: 0,
					accuracy: 0,
					evasion: 0,
				},
				substitute: null,
			};
		});

		it('should reverse self-boost with Contrary ability', () => {
			const move = utils.getMove('poweruppunch');
			const messageLog = [];
			const abilityContext = {
				attacker: attackerSlot.pokemon,
				defender: defenderSlot.pokemon,
				move,
			};

			assert.equal(attackerSlot.statStages.atk, 0, 'Initial Attack stage should be 0');

			battleCore.applySecondaryEffects(attackerSlot, defenderSlot, move, battle, messageLog, abilityContext);

			// With Contrary, +1 Attack boost becomes -1
			assert.equal(attackerSlot.statStages.atk, -1, 'Attack stage should be -1 with Contrary');
			
			const hasDropMessage = messageLog.some(msg => msg.includes('ATK') && msg.includes('fell'));
			assert(hasDropMessage, 'Should log Attack drop message with Contrary');
		});
	});
});
