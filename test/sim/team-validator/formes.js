'use strict';

const assert = require('assert').strict;
const TeamValidator = require('../../../sim/team-validator').TeamValidator;

let team;
let illegal;

describe('Team Validator', function () {
	it("should validate Necrozma formes correctly", function () {
		team = [
			{species: 'necrozmadawnwings', ability: 'prismarmor', shiny: true, moves: ['moongeistbeam', 'metalclaw'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should reject Ultra Necrozma where ambiguous', function () {
		team = [
			{species: 'necrozmaultra', ability: 'neuroforce', moves: ['confusion'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ubers').validateTeam(team);
		assert(illegal);
	});

	it('should handle Deoxys formes in Gen 3', function () {
		team = [
			{species: 'deoxys', ability: 'pressure', moves: ['wrap'], evs: {hp: 1}},
			{species: 'deoxys', ability: 'pressure', moves: ['wrap'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ubers').validateTeam(team);
		assert(illegal);
		illegal = TeamValidator.get('gen3ubers@@@!speciesclause').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'deoxysattack', ability: 'pressure', moves: ['wrap'], evs: {hp: 1}},
			{species: 'deoxysdefense', ability: 'pressure', moves: ['wrap'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ubers@@@!speciesclause').validateTeam(team);
		assert(illegal);
		illegal = TeamValidator.get('gen3ubers@@@!speciesclause,+nonexistent').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should correctly validate USUM Rockruff', function () {
		team = [
			{species: 'rockruff', ability: 'owntempo', moves: ['happyhour'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);
		team = [
			{species: 'rockruff', level: 9, ability: 'owntempo', moves: ['happyhour'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
		team = [
			{species: 'rockruff', level: 9, ability: 'owntempo', moves: ['tackle'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);
		team = [
			{species: 'rockruff', level: 9, ability: 'steadfast', moves: ['happyhour'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'lycanrocdusk', ability: 'toughclaws', moves: ['happyhour'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);
		team = [
			{species: 'lycanroc', ability: 'steadfast', moves: ['happyhour'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should reject Pokemon that cannot obtain moves in a particular forme', function () {
		team = [
			{species: 'toxicrity', ability: 'punkrock', moves: ['venomdrench, magneticflux'], evs: {hp: 1}},
			{species: 'toxicrity-low-key', ability: 'punkrock', moves: ['venoshock, shiftgear'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'rotom-wash', ability: 'levitate', moves: ['overheat'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'kyurem-black', ability: 'teravolt', moves: ['glaciate'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);

		// Scary Face is a TM in Gen 8, so use Gen 7 to test
		team = [
			{species: 'kyurem-white', ability: 'turboblaze', moves: ['scaryface'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should tier Zacian and Zamazenta formes seperately', () => {
		team = [
			{species: 'zamazenta-crowned', ability: 'dauntlessshield', item: 'rustedshield', moves: ['howl'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8almostanyability').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'zamazenta', ability: 'dauntlessshield', item: 'lifeorb', moves: ['howl'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8almostanyability').validateTeam(team);
		assert(illegal);
	});
});
