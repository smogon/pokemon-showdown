'use strict';

const assert = require('assert');

describe('Team Validator features', function () {
	describe('TeamValidator', function () {
		it('should reject non-existent Pokemon', function () {
			const team = [{species:'nonexistentPokemon', moves:['thunderbolt']}];
			const illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent items', function () {
			const team = [{species:'pikachu', moves:['thunderbolt'], ability:'static', item:'nonexistentItem'}];
			const illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent abilities', function () {
			const team = [{species:'pikachu', moves:['thunderbolt'], ability:'nonexistentAbility'}];
			const illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent moves', function () {
			const team = [{species:'pikachu', ability:'static', moves:['nonexistentMove']}];
			const illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject non-existent natures', function () {
			const team = [{species:'pikachu', ability:'static', moves:['thunderbolt'], nature:'nonexistentNature'}];
			const illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should reject invalid happiness values', function () {
			const team = [{species:'pikachu', ability:'static', moves:['thunderbolt'], happiness:'invalidHappinessValue'}];
			const illegal = TeamValidator('gen7customgame').validateTeam(team);
			assert(illegal);
		});

		it('should accept legal movesets', function () {
			const team = [{species:'pikachu', ability:'static', moves:['agility', 'protect', 'thunder', 'thunderbolt']}];
			const illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert(!illegal);
		});

		it('should reject illegal movesets', function () {
			const team = [{species:'pikachu', ability:'static', moves:['blastburn', 'frenzyplant', 'hydrocannon', 'dragonascent']}];
			const illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert(illegal);
		});

		it('should accept both ability types for Mega Evolutions', function () {
			// base forme ability
			let team = [{species:'gyaradosmega', item:'gyaradosite', ability:'intimidate', moves:['dragondance', 'crunch', 'waterfall', 'icefang']}];
			let illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert(!illegal);

			// mega forme ability
			team = [{species:'gyaradosmega', item:'gyaradosite', ability:'moldbreaker', moves:['dragondance', 'crunch', 'waterfall', 'icefang']}];
			illegal = TeamValidator('gen7anythinggoes').validateTeam(team);
			assert(!illegal);
		});

		it('should reject newer Pokemon in older gens', function () {
			const team = [{species:'pichu', ability:'static', moves:['thunderbolt']}];
			const illegal = TeamValidator('gen1ou').validateTeam(team);
			assert(illegal);
		});
	});
	describe('custom formats', function () {
		it('should allow Pokemon to be banned', function () {
			const team = [{species:'pikachu', ability:'static', moves:['agility', 'protect', 'thunder', 'thunderbolt']}];
			const illegal = TeamValidator('gen7anythinggoes@@@' + Dex.parseRules(['Pikachu']).join(',')).validateTeam(team);
			assert(illegal);
		});
		it('should allow Pokemon to be unbanned', function () {
			const team = [{species:'blaziken', ability:'blaze', moves:['skyuppercut']}];
			const illegal = TeamValidator('gen7ou@@@' + Dex.parseRules(['!Blaziken']).join(',')).validateTeam(team);
			assert(!illegal);
		});
		it('should allow moves to be banned', function () {
			const team = [{species:'pikachu', ability:'static', moves:['agility', 'protect', 'thunder', 'thunderbolt']}];
			const illegal = TeamValidator('gen7anythinggoes@@@' + Dex.parseRules(['agility']).join(',')).validateTeam(team);
			assert(illegal);
		});
		it('should allow moves to be unbanned', function () {
			const team = [{species:'absol', ability:'pressure', moves:['batonpass']}];
			const illegal = TeamValidator('gen7ou@@@' + Dex.parseRules(['!Baton Pass']).join(',')).validateTeam(team);
			assert(!illegal);
		});
		it('should allow items to be banned', function () {
			const team = [{species:'pikachu', ability:'static', moves:['agility', 'protect', 'thunder', 'thunderbolt'], item: 'lightball'}];
			const illegal = TeamValidator('gen7anythinggoes@@@' + Dex.parseRules(['Light Ball']).join(',')).validateTeam(team);
			assert(illegal);
		});
		it('should allow items to be unbanned', function () {
			const team = [{species:'pikachu', ability:'static', moves:['agility', 'protect', 'thunder', 'thunderbolt'], item: 'souldew'}];
			const illegal = TeamValidator('gen7ou@@@' + Dex.parseRules(['!Soul Dew']).join(',')).validateTeam(team);
			assert(!illegal);
		});
		it('should allow abilities to be banned', function () {
			const team = [{species:'pikachu', ability:'static', moves:['agility', 'protect', 'thunder', 'thunderbolt']}];
			const illegal = TeamValidator('gen7anythinggoes@@@' + Dex.parseRules(['Static']).join(',')).validateTeam(team);
			assert(illegal);
		});
		it('should allow abilities to be unbanned', function () {
			const team = [{species:'wobbuffet', ability:'shadowtag', moves:['counter']}];
			const illegal = TeamValidator('gen7ou@@@' + Dex.parseRules(['!Shadow Tag']).join(',')).validateTeam(team);
			assert(!illegal);
		});
		it('should allow complex bans to be added', function () {
			let team = [{species:'pikachu', ability:'static', moves:['agility', 'protect', 'thunder', 'thunderbolt']}];
			let illegal = TeamValidator('gen7anythinggoes@@@' + Dex.parseRules(['Pikachu + Agility']).join(',')).validateTeam(team);
			assert(illegal);

			team = [{species:'smeargle', ability:'owntempo', moves:['gravity']}, {species:'pikachu', ability:'static', moves:['thunderbolt']}];
			illegal = TeamValidator('gen7doublesou@@@' + Dex.parseRules(['Gravity ++ Thunderbolt']).join(',')).validateTeam(team);
			assert(illegal);
		});
		it('should allow complex bans to be altered', function () {
			let team = [{species:'smeargle', ability:'owntempo', moves:['gravity']}, {species:'abomasnow', ability:'snowwarning', moves:['grasswhistle']}];
			let customRules = Dex.parseRules(['Gravity ++ Grasswhistle > 2']).join(',');
			let illegal = TeamValidator('gen7doublesou@@@' + customRules).validateTeam(team);
			assert(!illegal);

			team = [{species:'smeargle', ability:'owntempo', moves:['gravity']}, {species:'abomasnow', ability:'snowwarning', moves:['grasswhistle']},
				{species:'cacturne', ability:'sandveil', moves:['grasswhistle']}];
			illegal = TeamValidator('gen7doublesou@@@' + customRules).validateTeam(team);
			assert(illegal);
		});
		it('should allow complex bans to be removed', function () {
			const team = [{species:'smeargle', ability:'owntempo', moves:['gravity']}, {species:'abomasnow', ability:'snowwarning', moves:['grasswhistle']}];
			const illegal = TeamValidator('gen7doublesou@@@' + Dex.parseRules(['!Gravity ++ Grasswhistle']).join(',')).validateTeam(team);
			assert(!illegal);
		});
	});
});
