'use strict';

const assert = require('assert');
const TeamValidator = require('../../sim/team-validator');

describe('Team Validator features', function () {
	describe('TeamValidator', function () {
		it('should reject non-existent Pokemon', function () {
			let team = [{species:'nonexistentPokemon', moves:['thunderbolt']}];
			let illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent items', function () {
			let team = [{species:'pikachu', moves:['thunderbolt'], ability:'static', item:'nonexistentItem'}];
			let illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent abilities', function () {
			let team = [{species:'pikachu', moves:['thunderbolt'], ability:'nonexistentAbility'}];
			let illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent moves', function () {
			let team = [{species:'pikachu', ability:'static', moves:['nonexistentMove']}];
			let illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should validate Gen 2 IVs', function () {
			let team = Dex.fastUnpackTeam('|raikou|||hiddenpowerwater||||14,28,26,,,|||');
			let illegal = TeamValidator('gen2ou').validateTeam(team);
			assert.strictEqual(illegal, false);

			team = Dex.fastUnpackTeam('|raikou|||hiddenpowerfire||||14,28,26,,,|||');
			illegal = TeamValidator('gen2ou').validateTeam(team);
			assert(illegal);

			team = Dex.fastUnpackTeam('|raikou|||hiddenpowerwater||||16,28,26,,,|||');
			illegal = TeamValidator('gen2ou').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent natures', function () {
			let team = [{species:'pikachu', ability:'static', moves:['thunderbolt'], nature:'nonexistentNature'}];
			let illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject invalid happiness values', function () {
			let team = [{species:'pikachu', ability:'static', moves:['thunderbolt'], happiness:'invalidHappinessValue'}];
			let illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should accept legal movesets', function () {
			let team = [{species:'pikachu', ability:'static', moves:['agility', 'protect', 'thunder', 'thunderbolt']}];
			let illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert.strictEqual(illegal, false);

			team = [{species:'meowstic', ability:'prankster', moves:['trick', 'magiccoat']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert.strictEqual(illegal, false);
		});

		it('should reject illegal movesets', function () {
			let team = [{species:'pikachu', ability:'static', moves:['blastburn', 'frenzyplant', 'hydrocannon', 'dragonascent']}];
			let illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert(illegal);
		});

		it('should reject illegal egg move combinations', function () {
			let team = [{species:'azumarill', ability:'hugepower', moves:['bellydrum', 'aquajet']}];
			let illegal = TeamValidator('gen5ou').validateTeam(team);
			assert(illegal);

			team = [{species:'cloyster', moves:['rapidspin', 'explosion']}];
			illegal = TeamValidator('gen2ou').validateTeam(team);
			assert(illegal);
		});

		it('should accept VC moves only with Hidden ability and correct IVs', function () {
			let team = [{species:'machamp', ability:'steadfast', moves:['fissure']}];
			let illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert.strictEqual(illegal, false);
			team = [{species:'tauros', ability:'sheerforce', moves:['bodyslam']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert.strictEqual(illegal, false);
			team = [{species:'tauros', ability:'intimidate', ivs:{hp:31, atk:31, def:30, spa:30, spd:30, spe:30}, moves:['bodyslam']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert.strictEqual(illegal, false);

			team = [{species:'machamp', ability:'noguard', moves:['fissure']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert(illegal);
			team = [{species:'tauros', ability:'sheerforce', ivs:{hp:31, atk:31, def:30, spa:30, spd:30, spe:30}, moves:['bodyslam']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert(illegal);
		});

		it('should correctly validate USUM Rockruff', function () {
			let team = [{species:'rockruff', ability:'owntempo', moves:['happyhour']}];
			let illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert.strictEqual(illegal, false);
			team = [{species:'rockruff', level: 9, ability:'owntempo', moves:['happyhour']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert(illegal);
			team = [{species:'rockruff', level: 9, ability:'owntempo', moves:['tackle']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert.strictEqual(illegal, false);
			team = [{species:'rockruff', level: 9, ability:'steadfast', moves:['happyhour']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert(illegal);

			team = [{species:'lycanrocdusk', ability:'toughclaws', moves:['happyhour']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert.strictEqual(illegal, false);
			team = [{species:'lycanroc', ability:'steadfast', moves:['happyhour']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert(illegal);
		});

		it('should accept both ability types for Mega Evolutions', function () {
			// base forme ability
			let team = [{species:'gyaradosmega', item:'gyaradosite', ability:'intimidate', moves:['dragondance', 'crunch', 'waterfall', 'icefang']}];
			let illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert.strictEqual(illegal, false);

			// mega forme ability
			team = [{species:'gyaradosmega', item:'gyaradosite', ability:'moldbreaker', moves:['dragondance', 'crunch', 'waterfall', 'icefang']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert.strictEqual(illegal, false);
		});

		it('should reject newer Pokemon in older gens', function () {
			let team = [{species:'pichu', ability:'static', moves:['thunderbolt']}];
			let illegal = TeamValidator('gen1ou').validateTeam(team);
			assert(illegal);
		});
	});
});
