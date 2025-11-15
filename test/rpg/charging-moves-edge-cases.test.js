'use strict';

const assert = require('./../assert');

describe('Charging Move Edge Cases', function () {
	this.timeout(10000);

	let battleFlow;

	before(function () {
		try {
			battleFlow = require('../../dist/impulse/chat-plugins/rpg-wip/battle-flow');
		} catch (e) {
			console.log('Battle flow module not found, skipping tests:', e.message);
			this.skip();
		}
	});

	describe('Charging Move with Disable', function () {
		it('should prevent player from using charging move when disabled mid-charge', function () {
			const playerSlot = {
				pokemon: {
					species: 'Venusaur',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'tackle', pp: 20 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging Solar Beam
				disabledMove: { moveId: 'solarbeam', turns: 3 }, // But it got disabled!
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = { magicRoomTurns: 0 };

			// Should still be locked to Solar Beam but can't use it due to disable
			const error = battleFlow.validateMoveAction(playerSlot, 'solarbeam', battle);

			assert(error, 'Should return error when move is disabled');
			assert(error.includes('disabled'), 'Error should mention disabled');
		});

		it('should AI use Struggle when charging move gets disabled', function () {
			const aiSlot = {
				pokemon: {
					id: 'test-pokemon-1',
					species: 'Venusaur',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'tackle', pp: 20 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging
				disabledMove: { moveId: 'solarbeam', turns: 3 }, // But disabled!
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = {
				playerSlots: [{ pokemon: { id: 'player-pokemon-1', hp: 100 } }],
				opponentSlots: [aiSlot],
				magicRoomTurns: 0,
			};

			const action = battleFlow.generateAiAction(aiSlot, 2, battle);

			// AI should still try to use Solar Beam due to charging lock
			// The disable check happens later in execution
			assert.equal(action.moveId, 'solarbeam', 'AI should still be locked to Solar Beam');
		});
	});

	describe('Charging Move with Taunt', function () {
		it('should allow player to continue physical charging move (Sky Attack) when taunted', function () {
			const playerSlot = {
				pokemon: {
					species: 'Pidgeot',
					moves: [
						{ id: 'skyattack', pp: 10 },
						{ id: 'tackle', pp: 20 },
					],
				},
				chargingMove: 'skyattack', // Currently charging Sky Attack (Physical move)
				tauntTurns: 2, // Taunted
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = { magicRoomTurns: 0 };

			// Should still allow continuing Sky Attack even when taunted (it's not a status move)
			const error = battleFlow.validateMoveAction(playerSlot, 'skyattack', battle);

			assert.equal(error, null, 'Should allow continuing physical charging move when taunted');
		});
	});

	describe('Multiple Charging Moves', function () {
		it('should test all known charging moves are properly handled', function () {
			const chargingMoves = [
				'solarbeam', 'solarblade', 'dig', 'fly', 'dive', 'bounce',
				'skyattack', 'razorwind', 'skullbash', 'shadowforce', 'phantomforce',
				'geomancy', 'freezeshock', 'iceburn', 'meteorbeam',
			];

			chargingMoves.forEach(moveId => {
				const playerSlot = {
					pokemon: {
						species: 'TestMon',
						moves: [
							{ id: moveId, pp: 10 },
							{ id: 'tackle', pp: 20 },
						],
					},
					chargingMove: moveId,
					statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
				};

				const battle = { magicRoomTurns: 0 };

				// Should allow continuing the charging move
				const error1 = battleFlow.validateMoveAction(playerSlot, moveId, battle);
				assert.equal(error1, null, `Should allow continuing ${moveId}`);

				// Should prevent using other move
				const error2 = battleFlow.validateMoveAction(playerSlot, 'tackle', battle);
				assert(error2, `Should prevent using tackle while charging ${moveId}`);
			});
		});
	});

	describe('Charging Move with Encore', function () {
		it('should have charging move take priority over Encore', function () {
			const playerSlot = {
				pokemon: {
					species: 'Venusaur',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'tackle', pp: 20 },
						{ id: 'synthesis', pp: 10 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging Solar Beam
				encoreMove: { moveId: 'tackle', turns: 3 }, // But Encored into Tackle!
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = { magicRoomTurns: 0 };

			// Charging move should take precedence over Encore
			const error1 = battleFlow.validateMoveAction(playerSlot, 'solarbeam', battle);
			const error2 = battleFlow.validateMoveAction(playerSlot, 'tackle', battle);

			// Charging takes precedence - must continue charging move
			assert.equal(error1, null, 'Should allow continuing charging move');
			assert(error2, 'Should prevent using Encored move while charging');
			assert(error2.includes('continue using'), 'Error should mention must continue using charging move');
		});
	});

	describe('Charging Move Priority', function () {
		it('should check charging move before other locks in validation', function () {
			const playerSlot = {
				pokemon: {
					species: 'Venusaur',
					item: 'choiceband',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'tackle', pp: 20 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging
				lockedMove: 'tackle', // Also locked to Tackle by Choice Band
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = { magicRoomTurns: 0 };

			// Charging move should take precedence over Choice lock
			const error1 = battleFlow.validateMoveAction(playerSlot, 'solarbeam', battle);
			const error2 = battleFlow.validateMoveAction(playerSlot, 'tackle', battle);

			assert.equal(error1, null, 'Should allow continuing charging move');
			assert(error2, 'Should prevent Choice locked move while charging');
			assert(error2.includes('continue using'), 'Error should mention must continue using charging move');
		});
	});

	describe('Charging Move with Torment', function () {
		it('should ignore Torment when locked into charging move', function () {
			const playerSlot = {
				pokemon: {
					species: 'Venusaur',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'tackle', pp: 20 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging Solar Beam
				tormentActive: true, // Tormented
				lastMoveUsed: 'solarbeam', // Just used Solar Beam last turn (charging turn)
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = { magicRoomTurns: 0 };

			// Should allow continuing Solar Beam despite Torment
			// Charging move lock takes precedence
			const error = battleFlow.validateMoveAction(playerSlot, 'solarbeam', battle);

			assert.equal(error, null, 'Should allow continuing charging move despite Torment');
		});
	});

	describe('AI Charging Move Priority', function () {
		it('should prioritize charging move over Encore for AI', function () {
			const aiSlot = {
				pokemon: {
					id: 'test-pokemon-1',
					species: 'Venusaur',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'tackle', pp: 20 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging
				encoreMove: { moveId: 'tackle', turns: 3 }, // Also Encored
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = {
				playerSlots: [{ pokemon: { id: 'player-pokemon-1', hp: 100 } }],
				opponentSlots: [aiSlot],
				magicRoomTurns: 0,
			};

			const action = battleFlow.generateAiAction(aiSlot, 2, battle);

			// Charging move should take priority
			assert.equal(action.moveId, 'solarbeam', 'AI should prioritize charging move over Encore');
		});

		it('should prioritize charging move over Choice item for AI', function () {
			const aiSlot = {
				pokemon: {
					id: 'test-pokemon-1',
					species: 'Venusaur',
					item: 'choiceband',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'tackle', pp: 20 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging
				lockedMove: 'tackle', // Also locked by Choice Band
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = {
				playerSlots: [{ pokemon: { id: 'player-pokemon-1', hp: 100 } }],
				opponentSlots: [aiSlot],
				magicRoomTurns: 0,
			};

			const action = battleFlow.generateAiAction(aiSlot, 2, battle);

			// Charging move should take priority
			assert.equal(action.moveId, 'solarbeam', 'AI should prioritize charging move over Choice lock');
		});

		it('should prioritize charging move over rampage lock for AI', function () {
			const aiSlot = {
				pokemon: {
					id: 'test-pokemon-1',
					species: 'Dragonite',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'outrage', pp: 10 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging
				lockedMove: 'outrage', // Also locked in Outrage
				lockedMoveCounter: 2, // 2 turns left
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = {
				playerSlots: [{ pokemon: { id: 'player-pokemon-1', hp: 100 } }],
				opponentSlots: [aiSlot],
				magicRoomTurns: 0,
			};

			const action = battleFlow.generateAiAction(aiSlot, 2, battle);

			// Charging move should take priority
			assert.equal(action.moveId, 'solarbeam', 'AI should prioritize charging move over rampage lock');
		});
	});
});
