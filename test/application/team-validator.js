'use strict';

const assert = require('assert');

describe('Team Validator features', function () {
	describe('TeamValidator', function () {
		it('should reject non-existent Pokemon', function () {
			let team = [{species:'nonexistentPokemon', moves:['thunderbolt']}];
			let illegal = TeamValidator('customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent items', function () {
			let team = [{species:'pikachu', moves:['thunderbolt'], ability:'static', item:'nonexistentItem'}];
			let illegal = TeamValidator('customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent abilities', function () {
			let team = [{species:'pikachu', moves:['thunderbolt'], ability:'nonexistentAbility'}];
			let illegal = TeamValidator('customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent moves', function () {
			let team = [{species:'pikachu', ability:'static', moves:['nonexistentMove']}];
			let illegal = TeamValidator('customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent natures', function () {
			let team = [{species:'pikachu', ability:'static', moves:['thunderbolt'], nature:'nonexistentNature'}];
			let illegal = TeamValidator('customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject invalid happiness values', function () {
			let team = [{species:'pikachu', ability:'static', moves:['thunderbolt'], happiness:'invalidHappinessValue'}];
			let illegal = TeamValidator('customgame').validateTeam(team);
			assert(illegal);
		});

		it('should accept legal movesets', function () {
			let team = [{species:'pikachu', ability:'static', moves:['agility', 'protect', 'thunder', 'thunderbolt']}];
			let illegal = TeamValidator('anythinggoes').validateTeam(team);
			assert(!illegal);
		});

		it('should reject illegal movesets', function () {
			let team = [{species:'pikachu', ability:'static', moves:['blastburn', 'frenzyplant', 'hydrocannon', 'dragonascent']}];
			let illegal = TeamValidator('anythinggoes').validateTeam(team);
			assert(illegal);
		});

		it('should accept both ability types for Mega Evolutions', function () {
			// base forme ability
			let team = [{species:'gyaradosmega', item:'gyaradosite', ability:'intimidate', moves:['dragondance', 'crunch', 'waterfall', 'icefang']}];
			let illegal = TeamValidator('anythinggoes').validateTeam(team);
			assert(!illegal);

			// mega forme ability
			team = [{species:'gyaradosmega', item:'gyaradosite', ability:'moldbreaker', moves:['dragondance', 'crunch', 'waterfall', 'icefang']}];
			illegal = TeamValidator('anythinggoes').validateTeam(team);
			assert(!illegal);
		});

		it('should reject newer Pokemon in older gens', function () {
			let team = [{species:'pichu', ability:'static', moves:['thunderbolt']}];
			let illegal = TeamValidator('gen1ou').validateTeam(team);
			assert(illegal);
		});
	});
});
