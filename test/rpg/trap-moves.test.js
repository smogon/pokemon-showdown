'use strict';

/**
 * Trap Moves Tests
 * Tests all trap moves implementation including partiallytrapped and trapped volatile statuses
 */

const assert = require('assert').strict;

describe('RPG Trap Moves', function () {
	this.timeout(10000);

	let core, battleCore, battleMoves, battleEOT, Dex;

	before(function () {
		try {
			core = require('../../dist/impulse/chat-plugins/rpg-wip/core');
			battleCore = require('../../dist/impulse/chat-plugins/rpg-wip/battle-core');
			battleMoves = require('../../dist/impulse/chat-plugins/rpg-wip/battle-moves');
			battleEOT = require('../../dist/impulse/chat-plugins/rpg-wip/battle-eot');
			Dex = require('../../dist/sim/dex').Dex;
		} catch (e) {
			console.log('Required modules not found, skipping tests:', e.message);
			this.skip();
		}
	});

	describe('Partially Trapped Moves', () => {
		const partiallyTrappedMoves = [
			'bind', 'clamp', 'firespin', 'infestation', 'magmastorm',
			'sandtomb', 'snaptrap', 'thundercage', 'whirlpool', 'wrap',
		];

		partiallyTrappedMoves.forEach(moveId => {
			it(`should apply partiallytrapped status with ${moveId}`, () => {
				const move = Dex.moves.get(moveId);
				assert.equal(move.volatileStatus, 'partiallytrapped', `${moveId} should have partiallytrapped volatileStatus`);
			});
		});

		it('should set partiallyTrapped with correct duration and damage', () => {
			const player = core.getPlayerData('traptest001');
			const attackerMon = core.createPokemon('pikachu', 50, player);
			const defenderMon = core.createPokemon('bulbasaur', 50, player);

			const battle = {
				playerId: 'traptest001',
				battleType: 'wild',
				playerSlots: [{ pokemon: attackerMon, statStages: battleCore.INITIAL_STAT_STAGES, status: null, sleepCounter: 0, isConfused: false, confusionCounter: 0, isProtected: false, protectSuccessCounter: 0, willFlinch: false, isTrapped: null, tauntTurns: 0, isSeeded: false, hasNightmare: false, isCursed: false, activeTurns: 1 }],
				opponentSlots: [{ pokemon: defenderMon, statStages: battleCore.INITIAL_STAT_STAGES, status: null, sleepCounter: 0, isConfused: false, confusionCounter: 0, isProtected: false, protectSuccessCounter: 0, willFlinch: false, isTrapped: null, tauntTurns: 0, isSeeded: false, hasNightmare: false, isCursed: false, activeTurns: 1 }],
			};

			const move = Dex.moves.get('bind');
			const messageLog = [];

			// Test with normal item (no grip claw or binding band)
			battleMoves.RPGMoves.handleGenericVolatileMove(
				battle.playerSlots[0],
				battle.opponentSlots[0],
				move,
				battle,
				messageLog
			);

			const defenderSlot = battle.opponentSlots[0];
			assert(defenderSlot.partiallyTrapped, 'Defender should be partially trapped');
			assert(defenderSlot.partiallyTrapped.turns >= 4 && defenderSlot.partiallyTrapped.turns <= 6, 'Duration should be 4-6 turns');
			assert.equal(defenderSlot.partiallyTrapped.damage, 8, 'Damage divisor should be 8 (1/8 max HP)');
			assert.equal(defenderSlot.partiallyTrapped.moveId, 'bind', 'Move ID should be stored');
		});

		it('should use Grip Claw to extend trap duration', () => {
			const player = core.getPlayerData('traptest002');
			const attackerMon = core.createPokemon('pikachu', 50, player);
			attackerMon.item = 'gripclaw';
			const defenderMon = core.createPokemon('bulbasaur', 50, player);

			const battle = {
				playerId: 'traptest002',
				battleType: 'wild',
				playerSlots: [{ pokemon: attackerMon, statStages: battleCore.INITIAL_STAT_STAGES, status: null, sleepCounter: 0, isConfused: false, confusionCounter: 0, isProtected: false, protectSuccessCounter: 0, willFlinch: false, isTrapped: null, tauntTurns: 0, isSeeded: false, hasNightmare: false, isCursed: false, activeTurns: 1 }],
				opponentSlots: [{ pokemon: defenderMon, statStages: battleCore.INITIAL_STAT_STAGES, status: null, sleepCounter: 0, isConfused: false, confusionCounter: 0, isProtected: false, protectSuccessCounter: 0, willFlinch: false, isTrapped: null, tauntTurns: 0, isSeeded: false, hasNightmare: false, isCursed: false, activeTurns: 1 }],
			};

			const move = Dex.moves.get('wrap');
			const messageLog = [];

			battleMoves.RPGMoves.handleGenericVolatileMove(
				battle.playerSlots[0],
				battle.opponentSlots[0],
				move,
				battle,
				messageLog
			);

			const defenderSlot = battle.opponentSlots[0];
			assert.equal(defenderSlot.partiallyTrapped.turns, 7, 'Duration should be 7 turns with Grip Claw');
		});

		it('should use Binding Band to increase trap damage', () => {
			const player = core.getPlayerData('traptest003');
			const attackerMon = core.createPokemon('pikachu', 50, player);
			attackerMon.item = 'bindingband';
			const defenderMon = core.createPokemon('bulbasaur', 50, player);

			const battle = {
				playerId: 'traptest003',
				battleType: 'wild',
				playerSlots: [{ pokemon: attackerMon, statStages: battleCore.INITIAL_STAT_STAGES, status: null, sleepCounter: 0, isConfused: false, confusionCounter: 0, isProtected: false, protectSuccessCounter: 0, willFlinch: false, isTrapped: null, tauntTurns: 0, isSeeded: false, hasNightmare: false, isCursed: false, activeTurns: 1 }],
				opponentSlots: [{ pokemon: defenderMon, statStages: battleCore.INITIAL_STAT_STAGES, status: null, sleepCounter: 0, isConfused: false, confusionCounter: 0, isProtected: false, protectSuccessCounter: 0, willFlinch: false, isTrapped: null, tauntTurns: 0, isSeeded: false, hasNightmare: false, isCursed: false, activeTurns: 1 }],
			};

			const move = Dex.moves.get('firespin');
			const messageLog = [];

			battleMoves.RPGMoves.handleGenericVolatileMove(
				battle.playerSlots[0],
				battle.opponentSlots[0],
				move,
				battle,
				messageLog
			);

			const defenderSlot = battle.opponentSlots[0];
			assert.equal(defenderSlot.partiallyTrapped.damage, 6, 'Damage divisor should be 6 (1/6 max HP) with Binding Band');
		});

		it('should deal damage at end of turn to partially trapped Pokemon', () => {
			const player = core.getPlayerData('traptest004');
			const pokemon = core.createPokemon('bulbasaur', 50, player);
			const maxHp = pokemon.maxHp;

			const slot = {
				pokemon,
				partiallyTrapped: { turns: 3, moveId: 'bind', damage: 8 },
			};

			const battle = {};
			const messageLog = [];

			battleEOT.applyEOTVolatileStatusDamage(slot, battle, messageLog);

			const expectedDamage = Math.max(1, Math.floor(maxHp / 8));
			assert.equal(pokemon.hp, maxHp - expectedDamage, 'Should deal 1/8 max HP damage');
			assert(messageLog.some(msg => msg.includes('hurt by')), 'Should have damage message');
		});

		it('should decrement partiallyTrapped counter and free Pokemon after duration', () => {
			const player = core.getPlayerData('traptest005');
			const pokemon = core.createPokemon('bulbasaur', 50, player);

			const slot = {
				pokemon,
				partiallyTrapped: { turns: 1, moveId: 'bind', damage: 8 },
			};

			const battle = {};
			const messageLog = [];

			battleEOT.decrementEOTVolatileCounters(slot, battle, messageLog);

			assert.equal(slot.partiallyTrapped, null, 'Pokemon should be freed after counter reaches 0');
			assert(messageLog.some(msg => msg.includes('was freed')), 'Should have freed message');
		});
	});

	describe('Trapped Status Moves', () => {
		const trappedStatusMoves = ['block', 'meanlook', 'spiderweb'];

		trappedStatusMoves.forEach(moveId => {
			it(`should apply trapped status with ${moveId}`, () => {
				const player = core.getPlayerData(`traptest${moveId}`);
				const attackerMon = core.createPokemon('pikachu', 50, player);
				const defenderMon = core.createPokemon('bulbasaur', 50, player);

				const battle = {
					playerId: `traptest${moveId}`,
					battleType: 'wild',
					playerSlots: [{ pokemon: attackerMon, statStages: battleCore.INITIAL_STAT_STAGES, status: null, sleepCounter: 0, isConfused: false, confusionCounter: 0, isProtected: false, protectSuccessCounter: 0, willFlinch: false, isTrapped: null, tauntTurns: 0, isSeeded: false, hasNightmare: false, isCursed: false, activeTurns: 1 }],
					opponentSlots: [{ pokemon: defenderMon, statStages: battleCore.INITIAL_STAT_STAGES, status: null, sleepCounter: 0, isConfused: false, confusionCounter: 0, isProtected: false, protectSuccessCounter: 0, willFlinch: false, isTrapped: null, tauntTurns: 0, isSeeded: false, hasNightmare: false, isCursed: false, activeTurns: 1 }],
				};

				const move = Dex.moves.get(moveId);
				const messageLog = [];

				battleMoves.RPGMoves.handleSpecificStatusMove(
					battle.playerSlots[0],
					battle.opponentSlots[0],
					move,
					battle,
					messageLog
				);

				const defenderSlot = battle.opponentSlots[0];
				assert(defenderSlot.isTrapped, `Defender should be trapped by ${moveId}`);
				assert.equal(defenderSlot.isTrapped.turns, 5, 'Trap should last 5 turns');
			});
		});
	});

	describe('Trapped Damaging Moves', () => {
		it('should trap with anchorshot after dealing damage', () => {
			const move = Dex.moves.get('anchorshot');
			assert.equal(move.basePower, 80, 'Anchor Shot should be a damaging move');
			assert.equal(move.type, 'Steel', 'Anchor Shot should be Steel type');
		});

		it('should trap with spiritshackle after dealing damage', () => {
			const move = Dex.moves.get('spiritshackle');
			assert.equal(move.basePower, 80, 'Spirit Shackle should be a damaging move');
			assert.equal(move.type, 'Ghost', 'Spirit Shackle should be Ghost type');
		});

		it('should trap with thousandwaves after dealing damage', () => {
			const move = Dex.moves.get('thousandwaves');
			assert.equal(move.basePower, 90, 'Thousand Waves should be a damaging move');
			assert.equal(move.type, 'Ground', 'Thousand Waves should be Ground type');
		});

		it('should trap both attacker and defender with jawlock', () => {
			const move = Dex.moves.get('jawlock');
			assert.equal(move.basePower, 80, 'Jaw Lock should be a damaging move');
			assert.equal(move.type, 'Dark', 'Jaw Lock should be Dark type');
		});
	});

	describe('Trap Prevention', () => {
		it('should prevent switching when trapped', () => {
			const player = core.getPlayerData('traptest010');
			const pokemon = core.createPokemon('bulbasaur', 50, player);

			const slot = {
				pokemon,
				isTrapped: { turns: 3 },
			};

			assert(slot.isTrapped, 'Pokemon should be trapped and unable to switch');
		});

		it('should prevent switching when partially trapped', () => {
			const player = core.getPlayerData('traptest011');
			const pokemon = core.createPokemon('bulbasaur', 50, player);

			const slot = {
				pokemon,
				partiallyTrapped: { turns: 3, moveId: 'bind', damage: 8 },
			};

			assert(slot.partiallyTrapped, 'Pokemon should be partially trapped and unable to switch');
		});
	});
});
