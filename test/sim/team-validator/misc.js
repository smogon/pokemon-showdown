'use strict';

const assert = require('assert').strict;
const TeamValidator = require('../../../sim/team-validator').TeamValidator;

describe('Team Validator', function () {
	it("should allow Shedinja to take exactly one level-up move from Ninjask in gen 3-4", function () {
		let team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'swordsdance'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen4ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'batonpass'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'swordsdance', 'batonpass'], evs: {hp: 1}},
			{species: 'charmander', ability: 'blaze', moves: ['flareblitz', 'dragondance'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen4ou').validateTeam(team);
		assert(illegal);
	});

	it('should correctly enforce levels on Pokémon with unusual encounters in RBY', () => {
		const team = [
			{species: 'dragonair', level: 15, moves: ['dragonrage'], evs: {hp: 1}},
			{species: 'electrode', level: 15, moves: ['thunderbolt'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen1ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should correctly enforce per-game evolution restrictions', function () {
		let team = [
			{species: 'raichualola', ability: 'surgesurfer', moves: ['doublekick'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'raichualola', ability: 'surgesurfer', moves: ['sing'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8anythinggoes@@@minsourcegen=8').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'exeggutoralola', ability: 'frisk', moves: ['psybeam'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should prevent Pokemon that don\'t evolve via level-up and evolve from a Pokemon that does evolve via level-up from being underleveled.', function () {
		const team = [
			{species: 'nidoking', level: 1, ability: 'sheerforce', moves: ['earthpower'], evs: {hp: 1}},
			{species: 'mamoswine', level: 1, ability: 'oblivious', moves: ['earthquake'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should require Pokémon transferred from Gens 1 and 2 to be above Level 2', () => {
		const team = [
			{species: 'pidgey', level: 1, ability: 'bigpecks', moves: ['curse'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7ou').validateTeam(team);
		assert(illegal);

		team[0].level = 2;
		illegal = TeamValidator.get('gen7ou').validateTeam(team);
		assert(illegal);

		team[0].level = 3;
		illegal = TeamValidator.get('gen7ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should enforce Gen 1 minimum levels', () => {
		let team = [
			{species: 'onix', level: 12, moves: ['headbutt']},
		];
		let illegal = TeamValidator.get('gen1ou').validateTeam(team);
		assert(illegal);

		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'slowbro', level: 15, moves: ['earthquake']},
			{species: 'voltorb', level: 14, moves: ['thunderbolt']},
			{species: 'scyther', level: 15, moves: ['quickattack']},
			{species: 'pinsir', level: 15, moves: ['visegrip']},
		];

		illegal = TeamValidator.get('gen1ou').validateTeam(team);
		assert.equal(illegal, null);
	});
});
