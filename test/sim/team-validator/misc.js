'use strict';

const assert = require('../../assert');

describe('Team Validator', function () {
	it("should allow Shedinja to take exactly one level-up move from Ninjask in gen 3-4", function () {
		let team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'swordsdance'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen4ou');

		team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'batonpass'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen3ou');

		team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'swordsdance', 'batonpass'], evs: {hp: 1}},
			{species: 'charmander', ability: 'blaze', moves: ['flareblitz', 'dragondance'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen4ou');
	});

	it('should correctly enforce levels on Pokémon with unusual encounters in RBY', () => {
		const team = [
			{species: 'dragonair', level: 15, moves: ['dragonrage'], evs: {hp: 1}},
			{species: 'electrode', level: 15, moves: ['thunderbolt'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen1ou');
	});

	it('should correctly enforce per-game evolution restrictions', function () {
		let team = [
			{species: 'raichualola', ability: 'surgesurfer', moves: ['doublekick'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen8anythinggoes');

		team = [
			{species: 'raichualola', ability: 'surgesurfer', moves: ['sing'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen8anythinggoes@@@minsourcegen=8');

		team = [
			{species: 'exeggutoralola', ability: 'frisk', moves: ['psybeam'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen8anythinggoes');
	});

	it('should prevent Pokemon that don\'t evolve via level-up and evolve from a Pokemon that does evolve via level-up from being underleveled.', function () {
		const team = [
			{species: 'nidoking', level: 1, ability: 'sheerforce', moves: ['earthpower'], evs: {hp: 1}},
			{species: 'mamoswine', level: 1, ability: 'oblivious', moves: ['earthquake'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen8anythinggoes');
	});

	it('should require Pokémon transferred from Gens 1 and 2 to be above Level 2', () => {
		const team = [
			{species: 'pidgey', level: 1, ability: 'bigpecks', moves: ['curse'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen7ou');

		team[0].level = 2;
		assert.false.legalTeam(team, 'gen7ou');

		team[0].level = 3;
		assert.legalTeam(team, 'gen7ou');
	});

	it('should enforce Gen 1 minimum levels', () => {
		let team = [
			{species: 'onix', level: 12, moves: ['headbutt']},
		];
		assert.false.legalTeam(team, 'gen1ou');

		assert.legalTeam(team, 'gen2ou');

		team = [
			{species: 'slowbro', level: 15, moves: ['earthquake']},
			{species: 'voltorb', level: 14, moves: ['thunderbolt']},
			{species: 'scyther', level: 15, moves: ['quickattack']},
			{species: 'pinsir', level: 15, moves: ['visegrip']},
		];

		assert.legalTeam(team, 'gen1ou');
	});

	it('should correctly enforce Shell Smash as a sketched move for Necturna prior to Gen 9', function () {
		const team = [
			{species: 'necturna', ability: 'forewarn', moves: ['shellsmash', 'vcreate'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen8cap');
	});
});
