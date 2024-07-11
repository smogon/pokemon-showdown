'use strict';

const assert = require('../../assert');

describe('Team Validator', function () {
	it('should require Hidden Ability status to match event moves', function () {
		const team = [
			{species: 'raichu', ability: 'lightningrod', moves: ['extremespeed'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');
	});

	it('should handle Dream World moves', function () {
		const team = [
			{species: 'garchomp', ability: 'roughskin', moves: ['endure'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen5ou');
	});

	it('should reject mutually incompatible Dream World moves', function () {
		let team = [
			{species: 'spinda', ability: 'contrary', moves: ['superpower', 'fakeout'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen5ou');

		// Both are Dream World moves, but Smack Down is also level-up/TM
		team = [
			{species: 'boldore', ability: 'sandforce', moves: ['heavyslam', 'smackdown'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen5ou');
	});

	it('should consider Dream World Abilities as Hidden based on Gen 5 data', function () {
		let team = [
			{species: 'kecleon', ability: 'colorchange', moves: ['reflecttype'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen6ou');

		team = [
			{species: 'kecleon', ability: 'protean', moves: ['reflecttype'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen6ou');
	});

	it('should properly validate Greninja-Ash', function () {
		let team = [
			{species: 'greninja-ash', ability: 'battlebond', moves: ['happyhour'], shiny: true, evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');

		team = [
			{species: 'greninja-ash', ability: 'battlebond', moves: ['protect'], shiny: true, evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');

		team = [
			{species: 'greninja-ash', ability: 'battlebond', moves: ['protect'], ivs: {atk: 0}, evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');

		team = [
			{species: 'greninja-ash', ability: 'battlebond', moves: ['hiddenpowergrass'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');
	});

	it('should not allow evolutions of Shiny-locked events to be Shiny', function () {
		const team = [
			{species: 'urshifu', ability: 'unseenfist', shiny: true, moves: ['snore'], evs: {hp: 1}},
			{species: 'cosmoem', ability: 'sturdy', shiny: true, moves: ['teleport'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen8anythinggoes');
	});

	it('should not allow events to use moves only obtainable in a previous generation', function () {
		const team = [
			{species: 'zeraora', ability: 'voltabsorb', shiny: true, moves: ['knockoff'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen8anythinggoes');
	});

	it(`should accept event Pokemon with oldgen tutor moves and HAs in formats with Ability Patch`, function () {
		const team = [
			{species: 'heatran', ability: 'flamebody', moves: ['eruption'], evs: {hp: 1}},
			{species: 'regirock', ability: 'sturdy', moves: ['counter'], evs: {hp: 1}},
			{species: 'zapdos', ability: 'static', moves: ['aircutter'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen8anythinggoes');
	});

	it('should validate the Diancie released with zero perfect IVs', function () {
		let team = [
			{species: 'diancie', ability: 'clearbody', shiny: true, moves: ['hiddenpowerfighting'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen6ou');

		team = [
			{species: 'diancie', ability: 'clearbody', moves: ['hiddenpowerfighting'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen6ou');
	});

	it('should not allow Gen 1 JP events', function () {
		const team = [
			{species: 'rapidash', moves: ['payday']},
		];
		assert.false.legalTeam(team, 'gen1ou');
	});

	it('should allow Gen 2 events of Gen 1 Pokemon to learn moves exclusive to Gen 1', () => {
		let team = [
			{species: 'nidoking', moves: ['lovelykiss', 'counter']},
		];
		assert.legalTeam(team, 'gen2ou');

		// Espeon should be allowed to learn moves as an Eevee
		team = [
			{species: 'espeon', moves: ['growth', 'substitute']},
		];
		assert.legalTeam(team, 'gen2ou');
	});

	it('should allow Gen 2 events that evolve into Gen 1 Pokemon to learn moves exclusive to Gen 1', () => {
		const team = [
			{species: 'pikachu', moves: ['sing', 'surf']},
			{species: 'clefairy', moves: ['dizzypunch', 'bodyslam']},
		];
		assert.legalTeam(team, 'gen2ou');
	});

	it('should allow Gen 2 events in Gen 1 Tradebacks OU', () => {
		const team = [
			{species: 'charizard', moves: ['crunch']},
		];
		assert.false.legalTeam(team, 'gen1tradebacksou');
	});

	it('should allow use of a Hidden Ability if the format has the item Ability Patch', function () {
		let team = [
			{species: 'heatran', ability: 'flamebody', moves: ['sleeptalk'], evs: {hp: 1}},
			{species: 'entei', ability: 'innerfocus', moves: ['sleeptalk'], evs: {hp: 1}},
			{species: 'dracovish', ability: 'sandrush', moves: ['sleeptalk'], evs: {hp: 1}},
			{species: 'zapdos', ability: 'static', moves: ['sleeptalk'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen8vgc2021');

		team = [
			{species: 'heatran', ability: 'flamebody', moves: ['sleeptalk'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');
	});

	it.skip('should allow evolved Pokemon obtainable from events at lower levels than they could otherwise be obtained', function () {
		const team = [
			{species: 'dragonite', ability: 'innerfocus', moves: ['dracometeor'], evs: {hp: 1}, level: 50},
			{species: 'magmar', ability: 'flamebody', moves: ['ember'], evs: {hp: 1}, level: 10},
			{species: 'electivire', ability: 'motordrive', moves: ['quickattack'], evs: {hp: 1}, level: 10},
		];
		assert.legalTeam(team, 'gen4ou');
	});
});
