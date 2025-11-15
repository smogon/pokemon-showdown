'use strict';

const assert = require('./../assert');

describe('Charging Move Locking', function () {
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
	describe('AI Charging Move Selection', () => {
		it('should force AI to continue using Solar Beam on second turn', () => {
			const aiSlot = {
				pokemon: {
					id: 'test-pokemon-1',
					species: 'Venusaur',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'tackle', pp: 20 },
						{ id: 'synthesis', pp: 10 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging Solar Beam
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = {
				playerSlots: [{ pokemon: { id: 'player-pokemon-1', hp: 100 } }],
				opponentSlots: [aiSlot],
				magicRoomTurns: 0,
			};

			const action = battleFlow.generateAiAction(aiSlot, 2, battle);

			assert.equal(action.moveId, 'solarbeam', 'AI should be forced to use Solar Beam on second turn');
		});

		it('should force AI to continue using Dig on second turn', () => {
			const aiSlot = {
				pokemon: {
					id: 'test-pokemon-2',
					species: 'Dugtrio',
					moves: [
						{ id: 'dig', pp: 10 },
						{ id: 'earthquake', pp: 10 },
						{ id: 'slash', pp: 20 },
					],
				},
				chargingMove: 'dig', // Currently charging Dig
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = {
				playerSlots: [{ pokemon: { id: 'player-pokemon-1', hp: 100 } }],
				opponentSlots: [aiSlot],
				magicRoomTurns: 0,
			};

			const action = battleFlow.generateAiAction(aiSlot, 2, battle);

			assert.equal(action.moveId, 'dig', 'AI should be forced to use Dig on second turn');
		});

		it('should force AI to continue using Fly on second turn', () => {
			const aiSlot = {
				pokemon: {
					id: 'test-pokemon-3',
					species: 'Pidgeot',
					moves: [
						{ id: 'fly', pp: 10 },
						{ id: 'tackle', pp: 20 },
						{ id: 'wingattack', pp: 20 },
					],
				},
				chargingMove: 'fly', // Currently charging Fly
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = {
				playerSlots: [{ pokemon: { id: 'player-pokemon-1', hp: 100 } }],
				opponentSlots: [aiSlot],
				magicRoomTurns: 0,
			};

			const action = battleFlow.generateAiAction(aiSlot, 2, battle);

			assert.equal(action.moveId, 'fly', 'AI should be forced to use Fly on second turn');
		});

		it('should use Struggle if charging move has no PP', () => {
			const aiSlot = {
				pokemon: {
					id: 'test-pokemon-4',
					species: 'Venusaur',
					moves: [
						{ id: 'solarbeam', pp: 0 }, // No PP left
						{ id: 'tackle', pp: 20 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging Solar Beam but no PP
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = {
				playerSlots: [{ pokemon: { id: 'player-pokemon-1', hp: 100 } }],
				opponentSlots: [aiSlot],
				magicRoomTurns: 0,
			};

			const action = battleFlow.generateAiAction(aiSlot, 2, battle);

			assert.equal(action.moveId, 'struggle', 'AI should use Struggle when charging move has no PP');
		});

		it('should not interfere with normal move selection when not charging', () => {
			const aiSlot = {
				pokemon: {
					id: 'test-pokemon-5',
					species: 'Venusaur',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'tackle', pp: 20 },
					],
				},
				// No chargingMove set
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = {
				playerSlots: [{ pokemon: { id: 'player-pokemon-1', hp: 100 } }],
				opponentSlots: [aiSlot],
				magicRoomTurns: 0,
			};

			const action = battleFlow.generateAiAction(aiSlot, 2, battle);

			// Should be able to choose any move (not just Solar Beam)
			assert(['solarbeam', 'tackle'].includes(action.moveId), 'AI should be able to choose any move when not charging');
		});
	});

	describe('Player Charging Move Validation', () => {
		it('should prevent player from using different move while charging Solar Beam', () => {
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
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = { magicRoomTurns: 0 };

			const error = battleFlow.validateMoveAction(playerSlot, 'tackle', battle);

			assert(error, 'Should return error when trying to use different move');
			assert(error.includes('must continue using'), 'Error should mention must continue using');
			assert(error.includes('Solar Beam'), 'Error should mention Solar Beam');
		});

		it('should allow player to continue using Solar Beam on second turn', () => {
			const playerSlot = {
				pokemon: {
					species: 'Venusaur',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'tackle', pp: 20 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging Solar Beam
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = { magicRoomTurns: 0 };

			const error = battleFlow.validateMoveAction(playerSlot, 'solarbeam', battle);

			assert.equal(error, null, 'Should allow continuing the charging move');
		});

		it('should prevent player from using different move while charging Dig', () => {
			const playerSlot = {
				pokemon: {
					species: 'Dugtrio',
					moves: [
						{ id: 'dig', pp: 10 },
						{ id: 'earthquake', pp: 10 },
					],
				},
				chargingMove: 'dig', // Currently charging Dig
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = { magicRoomTurns: 0 };

			const error = battleFlow.validateMoveAction(playerSlot, 'earthquake', battle);

			assert(error, 'Should return error when trying to use different move');
			assert(error.includes('must continue using'), 'Error should mention must continue using');
			assert(error.includes('Dig'), 'Error should mention Dig');
		});

		it('should allow Struggle when charging move has no PP', () => {
			const playerSlot = {
				pokemon: {
					species: 'Venusaur',
					moves: [
						{ id: 'solarbeam', pp: 0 }, // No PP left
						{ id: 'tackle', pp: 20 },
					],
				},
				chargingMove: 'solarbeam', // Currently charging Solar Beam but no PP
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = { magicRoomTurns: 0 };

			const error = battleFlow.validateMoveAction(playerSlot, 'struggle', battle);

			assert.equal(error, null, 'Should allow Struggle when charging move has no PP');
		});

		it('should allow any move when not charging', () => {
			const playerSlot = {
				pokemon: {
					species: 'Venusaur',
					moves: [
						{ id: 'solarbeam', pp: 10 },
						{ id: 'tackle', pp: 20 },
					],
				},
				// No chargingMove set
				statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
			};

			const battle = { magicRoomTurns: 0 };

			const error1 = battleFlow.validateMoveAction(playerSlot, 'tackle', battle);
			const error2 = battleFlow.validateMoveAction(playerSlot, 'solarbeam', battle);

			assert.equal(error1, null, 'Should allow any move when not charging');
			assert.equal(error2, null, 'Should allow any move when not charging');
		});
	});
});
