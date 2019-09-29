'use strict';

const assert = require('assert');
const TeamValidator = require('../../.sim-dist/team-validator').TeamValidator;

describe('Team Validator', function () {
	it('should have valid formats to work with', function () {
		Dex.includeFormats();
		for (const format in Dex.formatsCache) {
			try {
				Dex.getRuleTable(Dex.getFormat(format));
			} catch (e) {
				e.message = `${format}: ${e.message}`;
				throw e;
			}
		}
	});
	it('should reject non-existent Pokemon', function () {
		let team = [
			{species: 'nonexistentPokemon', moves: ['thunderbolt'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should reject non-existent items', function () {
		let team = [
			{species: 'pikachu', moves: ['thunderbolt'], ability: 'static', item: 'nonexistentItem', evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should reject non-existent abilities', function () {
		let team = [
			{species: 'pikachu', moves: ['thunderbolt'], ability: 'nonexistentAbility', evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should reject non-existent moves', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['nonexistentMove'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should validate Gen 2 IVs', function () {
		let team = Dex.fastUnpackTeam('|raikou|||hiddenpowerwater||||14,28,26,,,|||');
		let illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.strictEqual(illegal, null);

		team = Dex.fastUnpackTeam('|raikou|||hiddenpowerfire||||14,28,26,,,|||');
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert(illegal);

		team = Dex.fastUnpackTeam('|raikou|||hiddenpowerwater||||16,28,26,,,|||');
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert(illegal);
	});

	it('should reject non-existent natures', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['thunderbolt'], nature: 'nonexistentNature', evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should reject invalid happiness values', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['thunderbolt'], happiness: 'invalidHappinessValue', evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should accept legal movesets', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.strictEqual(illegal, null);

		team = [
			{species: 'meowstic', ability: 'prankster', moves: ['trick', 'magiccoat'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.strictEqual(illegal, null);
	});

	it('should reject illegal movesets', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['blastburn', 'frenzyplant', 'hydrocannon', 'dragonascent'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should reject banned Pokemon', function () {
		let team = [
			{species: 'arceus', ability: 'multitype', item: 'dragoniumz', moves: ['judgment'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen71v1').validateTeam(team);
		assert(illegal);
	});

	it('should handle weird things', function () {
		// Necrozma-DW should use Necrozma's events, plus Moongeist Beam
		let team = [
			{species: 'necrozmadawnwings', ability: 'prismarmor', shiny: true, moves: ['moongeistbeam', 'metalclaw'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.strictEqual(illegal, null);

		// Shedinja should be able to take one level-up move from ninjask in gen 3-4

		team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'swordsdance'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen4ou').validateTeam(team);
		assert.strictEqual(illegal, null);

		team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'batonpass'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert.strictEqual(illegal, null);

		team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'swordsdance', 'batonpass'], evs: {hp: 1}},
			{species: 'charmander', ability: 'blaze', moves: ['flareblitz', 'dragondance'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen4ou').validateTeam(team);
		assert(illegal);

		// Chansey can't have Chansey-only egg moves as well as Happiny-only level-up moves

		team = [
			{species: 'chansey', ability: 'naturalcure', moves: ['charm', 'seismictoss'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ou').validateTeam(team);
		assert(illegal);
	});

	it('should reject illegal egg move combinations', function () {
		let team = [
			{species: 'azumarill', ability: 'hugepower', moves: ['bellydrum', 'aquajet'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'cloyster', moves: ['rapidspin', 'explosion']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'blissey', moves: ['present', 'healbell']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.strictEqual(illegal, null);

		team = [
			{species: 'marowak', moves: ['swordsdance', 'rockslide', 'bodyslam']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.strictEqual(illegal, null);

		team = [
			{species: 'skarmory', ability: 'keeneye', moves: ['curse', 'drillpeck'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'skarmory', ability: 'keeneye', moves: ['whirlwind', 'drillpeck'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'armaldo', ability: 'battlearmor', moves: ['knockoff', 'rapidspin'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'hitmontop', ability: 'intimidate', moves: ["highjumpkick", 'machpunch'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert.strictEqual(illegal, null);

		team = [
			{species: 'snorlax', ability: 'immunity', moves: ['curse', 'pursuit'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen4ou').validateTeam(team);
		assert.strictEqual(illegal, null);
	});

	it('should accept VC moves only with Hidden ability and correct IVs', function () {
		let team = [
			{species: 'machamp', ability: 'steadfast', moves: ['fissure'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.strictEqual(illegal, null);
		team = [
			{species: 'tauros', ability: 'sheerforce', moves: ['bodyslam'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.strictEqual(illegal, null);
		team = [
			{species: 'tauros', ability: 'intimidate', ivs: {hp: 31, atk: 31, def: 30, spa: 30, spd: 30, spe: 30}, moves: ['bodyslam'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.strictEqual(illegal, null);

		team = [
			{species: 'machamp', ability: 'noguard', moves: ['fissure'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
		team = [
			{species: 'tauros', ability: 'sheerforce', ivs: {hp: 31, atk: 31, def: 30, spa: 30, spd: 30, spe: 30}, moves: ['bodyslam'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should correctly validate USUM Rockruff', function () {
		let team = [
			{species: 'rockruff', ability: 'owntempo', moves: ['happyhour'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.strictEqual(illegal, null);
		team = [
			{species: 'rockruff', level: 9, ability: 'owntempo', moves: ['happyhour'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
		team = [
			{species: 'rockruff', level: 9, ability: 'owntempo', moves: ['tackle'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.strictEqual(illegal, null);
		team = [
			{species: 'rockruff', level: 9, ability: 'steadfast', moves: ['happyhour'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'lycanrocdusk', ability: 'toughclaws', moves: ['happyhour'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.strictEqual(illegal, null);
		team = [
			{species: 'lycanroc', ability: 'steadfast', moves: ['happyhour'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should accept both ability types for Mega Evolutions', function () {
		// base forme ability
		let team = [
			{species: 'gyaradosmega', item: 'gyaradosite', ability: 'intimidate', moves: ['dragondance', 'crunch', 'waterfall', 'icefang'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.strictEqual(illegal, null);

		// mega forme ability
		team = [
			{species: 'gyaradosmega', item: 'gyaradosite', ability: 'moldbreaker', moves: ['dragondance', 'crunch', 'waterfall', 'icefang'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.strictEqual(illegal, null);
	});

	it('should reject newer Pokemon in older gens', function () {
		let team = [
			{species: 'pichu', ability: 'static', moves: ['thunderbolt']},
		];
		let illegal = TeamValidator.get('gen1ou').validateTeam(team);
		assert(illegal);
	});

	/*********************************************************
 	* Custom rules
 	*********************************************************/
	it('should support legality tags', function () {
		let team = [
			{species: 'kitsunoh', ability: 'frisk', moves: ['shadowstrike'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
		illegal = TeamValidator.get('gen7anythinggoes@@@+cap').validateTeam(team);
		assert.strictEqual(illegal, null);
	});

	it('should allow Pokemon to be banned', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes@@@-Pikachu').validateTeam(team);
		assert(illegal);
	});

	it('should allow Pokemon to be unbanned', function () {
		let team = [
			{species: 'blaziken', ability: 'blaze', moves: ['skyuppercut'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7ou@@@+Blaziken').validateTeam(team);
		assert(!illegal);
	});

	it('should allow moves to be banned', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes@@@-Agility').validateTeam(team);
		assert(illegal);
	});

	it('should allow moves to be unbanned', function () {
		let team = [
			{species: 'absol', ability: 'pressure', moves: ['batonpass'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7ou@@@+Baton Pass').validateTeam(team);
		assert(!illegal);
	});

	it('should allow items to be banned', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], item: 'lightball', evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes@@@-Light Ball').validateTeam(team);
		assert(illegal);
	});

	it('should allow items to be unbanned', function () {
		let team = [
			{species: 'eevee', ability: 'runaway', moves: ['tackle'], item: 'eeviumz', evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7lc@@@+Eevium Z').validateTeam(team);
		assert(!illegal);
	});

	it('should allow abilities to be banned', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes@@@-Static').validateTeam(team);
		assert(illegal);
	});

	it('should allow abilities to be unbanned', function () {
		let team = [
			{species: 'wobbuffet', ability: 'shadowtag', moves: ['counter'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7ou@@@+Shadow Tag').validateTeam(team);
		assert(!illegal);
	});

	it('should allow complex bans to be added', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes@@@-Pikachu + Agility').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: {hp: 1}},
			{species: 'pikachu', ability: 'static', moves: ['thunderbolt'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7doublesou@@@-Gravity ++ Thunderbolt').validateTeam(team);
		assert(illegal);
	});

	it('should allow complex bans to be altered', function () {
		let team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: {hp: 1}},
			{species: 'abomasnow', ability: 'snowwarning', moves: ['grasswhistle'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7doublesou@@@-Gravity ++ Grass Whistle > 2').validateTeam(team);
		assert(!illegal);

		team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: {hp: 1}},
			{species: 'abomasnow', ability: 'snowwarning', moves: ['grasswhistle'], evs: {hp: 1}},
			{species: 'cacturne', ability: 'sandveil', moves: ['grasswhistle'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7doublesou@@@-Gravity ++ Grass Whistle > 2').validateTeam(team);
		assert(illegal);
	});

	it('should allow complex bans to be removed', function () {
		let team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: {hp: 1}},
			{species: 'abomasnow', ability: 'snowwarning', moves: ['grasswhistle'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7doublesou@@@+Gravity ++ Grass Whistle').validateTeam(team);
		assert(!illegal);
	});
});
