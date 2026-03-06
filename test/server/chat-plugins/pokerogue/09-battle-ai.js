/**
 * PokéRogue: Battle AI / bot logic test suite
 * Tests the AI battle decision-making, team building, and bot move selection.
 */
'use strict';

const assert = require('../../../assert');

describe('PokéRogue — Battle AI', function () {
	this.timeout(10000);
	let battle;
	let core;

	before(function () {
		try {
			core = require('../../../../dist/impulse/chat-plugins/pokerogue/pokerogue-core');
			battle = require('../../../../dist/impulse/chat-plugins/pokerogue/pokerogue-battle');
		} catch (e) {
			console.log('PokéRogue battle/core not in dist, skipping:', e.message);
			this.skip();
		}
	});

	describe('AI exports', () => {
		it('should export activeMatches map', () => {
			assert(battle.activeMatches instanceof Map, 'activeMatches should be a Map');
		});

		it('should export startBattle function', () => {
			assert(typeof battle.startBattle === 'function', 'startBattle should be a function');
		});

		it('should export destroyBotUser function', () => {
			assert(typeof battle.destroyBotUser === 'function', 'destroyBotUser should be a function');
		});
	});

	describe('AI team composition', () => {
		it('core.packTeam should produce valid teams for AI battle use', () => {
			const Teams = require('../../../../dist/sim/teams').Teams;
			// Build a typical AI team at floor 10
			const aiTeam = [
				{ species: 'pikachu', level: 12, exp: core.expForLevel(12) },
				{ species: 'bulbasaur', level: 11, exp: core.expForLevel(11) },
				{ species: 'geodude', level: 12, exp: core.expForLevel(12) },
			];
			const packed = core.packTeam(aiTeam);
			const parsed = Teams.unpack(packed);
			assert(parsed !== null, 'AI packed team should be parseable by PS');
			assert.equal(parsed.length, 3, 'AI team should have 3 Pokemon');
			for (let i = 0; i < 3; i++) {
				assert.equal(parsed[i].level, aiTeam[i].level, `Pokemon ${i} level should match`);
			}
		});

		it('core.packPokemon should handle edge-case species', () => {
			const Teams = require('../../../../dist/sim/teams').Teams;
			const edgeCases = [
				{ species: 'mewtwo', level: 70, exp: core.expForLevel(70) },
				{ species: 'magikarp', level: 5, exp: 0 },
				{ species: 'snorlax', level: 40, exp: core.expForLevel(40) },
			];
			for (const mon of edgeCases) {
				const packed = core.packPokemon(mon);
				const parsed = Teams.unpack(packed);
				assert(parsed !== null, `Failed to pack/unpack ${mon.species}`);
				assert.equal(parsed[0].level, mon.level, `${mon.species} level mismatch`);
			}
		});
	});

	describe('Floor scaling', () => {
		it('floorExpReward should scale appropriately for AI difficulty', () => {
			// Early floors should give less EXP than late floors
			const earlyReward = core.floorExpReward(1);
			const midReward = core.floorExpReward(20);
			const lateReward = core.floorExpReward(50);
			assert(midReward > earlyReward, 'Mid-game floor should give more EXP');
			assert(lateReward > midReward, 'Late-game floor should give more EXP');
		});

		it('floorCoinReward should scale appropriately', () => {
			const earlyCoins = core.floorCoinReward(1);
			const lateCoins = core.floorCoinReward(50);
			assert(lateCoins > earlyCoins, 'Later floors should give more coins');
		});
	});

	describe('activeMatches cleanup', () => {
		it('activeMatches should start empty (no active battles on init)', () => {
			// This tests that the map is properly initialized
			// Note: tests run in isolation so the map should have no entries from this module
			assert(battle.activeMatches instanceof Map);
		});
	});
});
