'use strict';

/**
 * Save/Load Validation Tests
 * Tests data validation for save/load functionality and battle restrictions
 */

const assert = require('assert').strict;

describe('RPG Save/Load Validation', function () {
	this.timeout(10000);

	let player;

	before(function () {
		try {
			player = require('../../dist/impulse/chat-plugins/rpg-wip/lib/player');
		} catch (e) {
			console.log('Player lib module not found, skipping tests:', e.message);
			this.skip();
		}
	});

	describe('Data Validation - Basic Fields', () => {
		it('should reject invalid data format', () => {
			assert.throws(() => {
				player.deserializePlayerData(null);
			}, /Invalid save data format/);

			assert.throws(() => {
				player.deserializePlayerData("string");
			}, /Invalid save data format/);
		});

		it('should reject missing user ID', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					name: 'Test',
					level: 1,
					badges: 0,
					party: [],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /missing or invalid user ID/);
		});

		it('should reject invalid level', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 0, // Invalid: too low
					badges: 0,
					party: [],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /level must be between 1 and 100/);

			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 101, // Invalid: too high
					badges: 0,
					party: [],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /level must be between 1 and 100/);
		});

		it('should reject invalid badges count', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: -1, // Invalid: negative
					party: [],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /badges must be between 0 and 8/);

			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 9, // Invalid: too many
					party: [],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /badges must be between 0 and 8/);
		});

		it('should reject invalid money amount', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [],
					money: -1000, // Invalid: negative
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /money must be between 0 and 999999999/);

			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [],
					money: 10000000000, // Invalid: too much
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /money must be between 0 and 999999999/);
		});

		it('should reject inconsistent badge data', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 3,
					party: [],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: ['Badge1', 'Badge2'], // Only 2 badges but badges count is 3
				});
			}, /obtainedBadges length must match badges count/);
		});
	});

	describe('Data Validation - Pokemon', () => {
		it('should reject party with more than 6 Pokemon', () => {
			const party = [];
			for (let i = 0; i < 7; i++) {
				party.push({
					species: 'Pikachu',
					level: 10,
					hp: 30,
					maxHp: 30,
					moves: [],
				});
			}

			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party,
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /party cannot have more than 6 Pokemon/);
		});

		it('should reject Pokemon with invalid species', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [{
						species: 'FakemonDoesNotExist123',
						level: 10,
						hp: 30,
						maxHp: 30,
						moves: [],
					}],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /species.*does not exist/);
		});

		it('should reject Pokemon with invalid level', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [{
						species: 'Pikachu',
						level: 0, // Invalid
						hp: 30,
						maxHp: 30,
						moves: [],
					}],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /Pokemon level must be between 1 and 100/);

			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [{
						species: 'Pikachu',
						level: 101, // Invalid
						hp: 30,
						maxHp: 30,
						moves: [],
					}],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /Pokemon level must be between 1 and 100/);
		});

		it('should reject Pokemon with HP exceeding maxHp', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [{
						species: 'Pikachu',
						level: 10,
						hp: 100, // HP exceeds maxHp
						maxHp: 50,
						moves: [],
					}],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /Pokemon HP cannot exceed maxHp/);
		});

		it('should reject Pokemon with invalid maxHp', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [{
						species: 'Pikachu',
						level: 10,
						hp: 0,
						maxHp: 10000, // Too high
						moves: [],
					}],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /Pokemon maxHp must be between 1 and 9999/);
		});

		it('should reject Pokemon with more than 4 moves', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [{
						species: 'Pikachu',
						level: 10,
						hp: 30,
						maxHp: 30,
						moves: [
							{ id: 'tackle', pp: 35 },
							{ id: 'thundershock', pp: 30 },
							{ id: 'quickattack', pp: 30 },
							{ id: 'thunderbolt', pp: 15 },
							{ id: 'irontail', pp: 15 }, // 5th move - invalid
						],
					}],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /Pokemon cannot have more than 4 moves/);
		});

		it('should reject Pokemon with invalid move', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [{
						species: 'Pikachu',
						level: 10,
						hp: 30,
						maxHp: 30,
						moves: [
							{ id: 'fakemove123notreal', pp: 10 }, // Non-existent move
						],
					}],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /Move.*does not exist/);
		});

		it('should reject Pokemon with invalid IVs', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [{
						species: 'Pikachu',
						level: 10,
						hp: 30,
						maxHp: 30,
						moves: [],
						ivs: { hp: 32 }, // IV too high (max is 31)
					}],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /IV must be between 0 and 31/);
		});

		it('should reject Pokemon with invalid EVs', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [{
						species: 'Pikachu',
						level: 10,
						hp: 30,
						maxHp: 30,
						moves: [],
						evs: { hp: 253 }, // EV too high (max is 252)
					}],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /EV must be between 0 and 252/);
		});

		it('should reject Pokemon with total EVs exceeding 510', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [{
						species: 'Pikachu',
						level: 10,
						hp: 30,
						maxHp: 30,
						moves: [],
						evs: {
							hp: 252,
							atk: 252,
							def: 7, // Total: 511 (exceeds 510)
						},
					}],
					money: 1000,
					inventory: [],
					pc: [],
					obtainedBadges: [],
				});
			}, /total EVs cannot exceed 510/);
		});
	});

	describe('Data Validation - Inventory', () => {
		it('should reject invalid item quantity', () => {
			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [],
					money: 1000,
					inventory: [
						['pokeball', { name: 'Poke Ball', quantity: -1, category: 'pokeball' }], // Negative quantity
					],
					pc: [],
					obtainedBadges: [],
				});
			}, /item quantity must be between 0 and 999/);

			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [],
					money: 1000,
					inventory: [
						['pokeball', { name: 'Poke Ball', quantity: 1000, category: 'pokeball' }], // Too many
					],
					pc: [],
					obtainedBadges: [],
				});
			}, /item quantity must be between 0 and 999/);
		});
	});

	describe('Data Validation - PC Storage', () => {
		it('should reject PC with more than 100 Pokemon', () => {
			const pc = [];
			for (let i = 0; i < 101; i++) {
				pc.push([`pokemon${i}`, {
					species: 'Pikachu',
					level: 10,
					hp: 30,
					maxHp: 30,
					moves: [],
				}]);
			}

			assert.throws(() => {
				player.deserializePlayerData({
					id: 'testuser',
					name: 'Test',
					level: 1,
					badges: 0,
					party: [],
					money: 1000,
					inventory: [],
					pc,
					obtainedBadges: [],
				});
			}, /PC cannot have more than 100 Pokemon/);
		});
	});

	describe('Valid Data', () => {
		it('should accept valid player data', () => {
			const validData = {
				id: 'testuser',
				name: 'Test Player',
				level: 5,
				experience: 1000,
				badges: 2,
				party: [{
					species: 'Pikachu',
					level: 10,
					hp: 30,
					maxHp: 35,
					moves: [
						{ id: 'thundershock', pp: 30 },
						{ id: 'quickattack', pp: 30 },
					],
					ivs: { hp: 31, atk: 25, def: 20, spa: 30, spd: 28, spe: 31 },
					evs: { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 },
				}],
				location: 'Pallet Town',
				money: 5000,
				inventory: [
					['pokeball', { name: 'Poke Ball', quantity: 10, category: 'pokeball' }],
					['potion', { name: 'Potion', quantity: 5, category: 'medicine' }],
				],
				pc: [],
				storyFlags: ['started'],
				defeatedTrainers: ['youngster_joey'],
				obtainedBadges: ['Boulder Badge', 'Cascade Badge'],
				visitedLocations: ['Pallet Town', 'Viridian City'],
			};

			const player = player.deserializePlayerData(validData);
			assert.equal(player.id, 'testuser');
			assert.equal(player.level, 5);
			assert.equal(player.badges, 2);
			assert.equal(player.money, 5000);
			assert.equal(player.party.length, 1);
		});
	});
});
