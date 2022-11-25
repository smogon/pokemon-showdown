'use strict';

const assert = require('assert').strict;
const TeamValidator = require('../../sim/team-validator').TeamValidator;
const Teams = require('../../sim/teams').Teams;

describe('Team Validator', function () {
	it('should have valid formats to work with', function () {
		Dex.includeFormats();
		for (const format in Dex.formatsCache) {
			try {
				Dex.formats.getRuleTable(Dex.formats.get(format));
			} catch (e) {
				e.message = `${format}: ${e.message}`;
				throw e;
			}
		}
	});
	it('should reject non-existent Pokemon', function () {
		const team = [
			{species: 'nonexistentPokemon', moves: ['thunderbolt'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should reject non-existent items', function () {
		const team = [
			{species: 'pikachu', moves: ['thunderbolt'], ability: 'static', item: 'nonexistentItem', evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should reject non-existent abilities', function () {
		const team = [
			{species: 'pikachu', moves: ['thunderbolt'], ability: 'nonexistentAbility', evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should reject non-existent moves', function () {
		const team = [
			{species: 'pikachu', ability: 'static', moves: ['nonexistentMove'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should validate Gen 2 IVs', function () {
		let team = Teams.unpack('|raikou|||hiddenpowerwater||||14,28,26,,,|||');
		let illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);

		team = Teams.unpack('|raikou|||hiddenpowerfire||||14,28,26,,,|||');
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert(illegal);

		team = Teams.unpack('|raikou|||hiddenpowerwater||||16,28,26,,,|||');
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert(illegal);

		team = Teams.unpack('|raikou|||thunderbolt||||,,,28,30,|||');
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert(illegal);
	});

	it('should validate Gen 2 EVs', function () {
		let team = Teams.unpack('|gengar|||thunderbolt||,,,200,200,|||||');
		let illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);

		team = Teams.unpack('|gengar|||thunderbolt||,,,248,252,|||||');
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert(illegal);
	});

	it('should validate Gen 7 IVs', function () {
		let team = [
			{species: 'yveltal', ability: 'darkaura', moves: ['hiddenpowerfighting'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7ubers').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'latiasmega', ability: 'levitate', item: 'latiasite', moves: ['hiddenpowerfighting'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ubers').validateTeam(team);
		assert.equal(illegal, null);
	});

	it(`should enforce the 3 perfect IV minimum on legendaries with Gen 6+ origin`, function () {
		const team = [
			{species: 'xerneas', ability: 'fairyaura', moves: ['snore'], ivs: {hp: 0, atk: 0, def: 0, spa: 0}, evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);

		illegal = TeamValidator.get('gen8purehackmons').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should validate the Diancie released with zero perfect IVs', function () {
		let team = [
			{species: 'diancie', ability: 'clearbody', shiny: true, moves: ['hiddenpowerfighting'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen6ou').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'diancie', ability: 'clearbody', moves: ['hiddenpowerfighting'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen6ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should reject non-existent natures', function () {
		const team = [
			{species: 'pikachu', ability: 'static', moves: ['thunderbolt'], nature: 'nonexistentNature', evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should reject invalid happiness values', function () {
		const team = [
			{species: 'pikachu', ability: 'static', moves: ['thunderbolt'], happiness: 'invalidHappinessValue', evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7customgame').validateTeam(team);
		assert(illegal);
	});

	it('should validate EVs', function () {
		const team = [
			{species: 'pikachu', ability: 'static', moves: ['thunderbolt'], evs: {hp: 252, atk: 252, def: 252}},
		];
		const illegal = TeamValidator.get('gen8ou').validateTeam(team);
		assert(illegal);
	});

	it('should accept legal movesets', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'meowstic', ability: 'prankster', moves: ['trick', 'magiccoat'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should reject illegal movesets', function () {
		const team = [
			{species: 'pikachu', ability: 'static', moves: ['blastburn', 'frenzyplant', 'hydrocannon', 'dragonascent'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should reject banned Pokemon', function () {
		let team = [
			{species: 'arceus', ability: 'multitype', item: 'dragoniumz', moves: ['judgment'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen71v1').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'rayquazamega', ability: 'deltastream', moves: ['dragonascent'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ou').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'mimikyutotem', ability: 'disguise', moves: ['shadowsneak'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ou@@@-mimikyu').validateTeam(team);
		assert(illegal);

		// bans should override past unbans
		team = [
			{species: 'torkoal', ability: 'drought', moves: ['bodyslam'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ou@@@-drought,+drought').validateTeam(team);
		assert.equal(illegal, null);
		illegal = TeamValidator.get('gen7ou@@@-drought,+drought,-drought').validateTeam(team);
		assert(illegal);
	});

	it('should handle weird things', function () {
		// Necrozma-DW should use Necrozma's events, plus Moongeist Beam
		let team = [
			{species: 'necrozmadawnwings', ability: 'prismarmor', shiny: true, moves: ['moongeistbeam', 'metalclaw'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);

		// Shedinja should be able to take one level-up move from ninjask in gen 3-4

		team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'swordsdance'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen4ou').validateTeam(team);
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

		// Shedinja has a different Egg Group (Mineral) than Nincada (Bug); needs to use Nincada's Egg Group
		team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'gust'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert.equal(illegal, null);

		// Chansey can't have Chansey-only egg moves as well as Happiny-only level-up moves

		team = [
			{species: 'blissey', ability: 'naturalcure', moves: ['charm', 'seismictoss'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ou').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'marill', ability: 'hugepower', moves: ['splash', 'aquajet'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ou').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'mamoswine', ability: 'oblivious', moves: ['tackle', 'iceshard', 'amnesia', 'furyattack'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert(illegal);
		illegal = TeamValidator.get('gen7ou').validateTeam(team);
		assert.equal(illegal, null);

		// Slam comes from Azurill, Future Sight comes from a variety of Marill-only egg moves

		team = [
			{species: 'azumarill', ability: 'thickfat', moves: ['futuresight', 'slam'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ou').validateTeam(team);
		assert(illegal);

		// male-only hidden abilities are incompatible with egg moves in Gen 5

		team = [
			{species: 'combusken', ability: 'speedboost', moves: ['batonpass'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert(illegal);

		// move not breedable
		team = [
			{species: 'kubfu', ability: 'innerfocus', moves: ['aerialace'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8lc').validateTeam(team);
		assert(illegal);
	});

	it('should handle Deoxys formes in Gen 3', function () {
		let team = [
			{species: 'deoxys', ability: 'pressure', moves: ['wrap'], evs: {hp: 1}},
			{species: 'deoxys', ability: 'pressure', moves: ['wrap'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen3ubers').validateTeam(team);
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

	it('should validate Sketch', function () {
		// Spore is a Gen 5 event move
		// Sketch itself should still be valid
		const team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['bellydrum', 'spore', 'sketch'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen4ou').validateTeam(team);
		assert.equal(illegal, null);
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

		// HJK can be bred onto Tyrogue in Gen 2, evolved into Hitmonchan, transferred back to Gen 1, taught Body Slam via TM, and transferred back to Gen 2.
		team = [
			{species: 'hitmonchan', moves: ['highjumpkick', 'bodyslam']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'weezing', ability: 'levitate', moves: ['painsplit', 'willowisp'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert.equal(illegal, null);

		// chainbreed smeargle to snubbull to chansey
		team = [
			{species: 'blissey', moves: ['present', 'healbell']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);

		// the weirdest chainbreed I've ever seen:
		// breed male Curse Snorlax in Gen 3, transfer to XD, teach Self-destruct
		// by tutor, breed with female Gluttony Snorlax
		team = [
			{species: 'snorlax', ability: 'gluttony', moves: ['curse', 'selfdestruct'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert.equal(illegal, null);

		// tradeback: egg moves Swords Dance, Rock Slide; trade back to gen 1, and learn Body Slam
		team = [
			{species: 'marowak', moves: ['swordsdance', 'rockslide', 'bodyslam']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);
		illegal = TeamValidator.get('gen1tradebacksou').validateTeam(team);
		assert.equal(illegal, null);
		illegal = TeamValidator.get('gen1ou').validateTeam(team);
		assert(illegal);

		// tradeback: don't crash if source is gen 2 event
		team = [
			{species: 'charizard', moves: ['crunch']},
		];
		illegal = TeamValidator.get('gen1tradebacksou').validateTeam(team);
		assert(illegal);

		// tradeback: gen 2 event move from prevo with gen 1 tutor or TM moves
		team = [
			{species: 'pikachu', moves: ['sing', 'surf']},
			{species: 'clefairy', moves: ['dizzypunch', 'bodyslam']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);

		// can't tradeback: gen 2 egg move
		team = [
			{species: 'marowak', moves: ['swordsdance', 'ancientpower', 'bodyslam']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert(illegal);

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

		// Pupitar can evolve into HA Tyranitar despite having no hidden ability
		team = [
			{species: 'tyranitar', ability: 'unnerve', moves: ['dragondance'], evs: {hp: 1}},
			{species: 'staraptor', ability: 'reckless', moves: ['pursuit'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert.equal(illegal, null);

		// Nidoqueen can't breed but can still get egg moves from prevos
		team = [
			{species: 'nidoqueen', ability: 'poisonpoint', moves: ['charm'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen6ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'armaldo', ability: 'battlearmor', moves: ['knockoff', 'rapidspin'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'hitmontop', ability: 'intimidate', moves: ["highjumpkick", 'machpunch'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'snorlax', ability: 'immunity', moves: ['curse', 'pursuit'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen4ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'charizard', ability: 'blaze', moves: ['dragondance'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen4ou').validateTeam(team);
		assert.equal(illegal, null);
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'dragonite', ability: 'multiscale', moves: ['extremespeed'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'dragonite', ability: 'multiscale', moves: ['extremespeed', 'aquajet'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert(illegal);
	});

	it.skip('should reject Volbeat with both Lunge and Dizzy Punch in Gen 7', function () {
		const team = [
			{species: 'volbeat', ability: 'swarm', moves: ['lunge', 'dizzypunch'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it.skip('should accept this chainbreed on Toxicroak', function () {
		const team = [
			{species: 'toxicroak', ability: 'dryskin', moves: ['bulletpunch', 'crosschop', 'fakeout'], evs: {hp: 4}},
		];
		const illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should require Hidden Ability status to match event moves', function () {
		const team = [
			{species: 'raichu', ability: 'lightningrod', moves: ['extremespeed'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should accept VC moves only with Hidden ability and correct IVs', function () {
		let team = [
			{species: 'machamp', ability: 'steadfast', moves: ['fissure'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);
		team = [
			{species: 'tauros', ability: 'sheerforce', moves: ['bodyslam'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);
		team = [
			{species: 'tauros', ability: 'intimidate', ivs: {hp: 31, atk: 31, def: 30, spa: 30, spd: 30, spe: 30}, moves: ['bodyslam'], evs: {hp: 1}},
			{species: 'suicune', ability: 'innerfocus', moves: ['scald'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);

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

		team = [
			{species: 'koffing', ability: 'levitate', moves: ['zapcannon'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'weezing-galar', ability: 'levitate', moves: ['zapcannon'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should correctly validate USUM Rockruff', function () {
		let team = [
			{species: 'rockruff', ability: 'owntempo', moves: ['happyhour'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
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

	it('should accept both ability types for Mega Evolutions', function () {
		// base forme ability
		let team = [
			{species: 'gyaradosmega', item: 'gyaradosite', ability: 'intimidate', moves: ['dragondance', 'crunch', 'waterfall', 'icefang'], evs: {hp: 1}},
			{species: 'kyogreprimal', item: 'blueorb', ability: 'drizzle', moves: ['originpulse'], evs: {hp: 1}},
			{species: 'rayquazamega', item: 'leftovers', ability: 'airlock', moves: ['dragonascent'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);

		// mega forme ability
		team = [
			{species: 'gyaradosmega', item: 'gyaradosite', ability: 'moldbreaker', moves: ['dragondance', 'crunch', 'waterfall', 'icefang'], evs: {hp: 1}},
			{species: 'kyogreprimal', item: 'blueorb', ability: 'primordialsea', moves: ['originpulse'], evs: {hp: 1}},
			{species: 'rayquazamega', item: 'leftovers', ability: 'deltastream', moves: ['dragonascent'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should reject Ultra Necrozma where ambiguous', function () {
		const team = [
			{species: 'necrozmaultra', ability: 'neuroforce', moves: ['confusion'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7ubers').validateTeam(team);
		assert(illegal);
	});

	it('should handle Dream World moves', function () {
		const team = [
			{species: 'garchomp', ability: 'roughskin', moves: ['endure'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should reject mutually incompatible Dream World moves', function () {
		let team = [
			{species: 'spinda', ability: 'contrary', moves: ['superpower', 'fakeout'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert(illegal);

		// Both are Dream World moves, but Smack Down is also level-up/TM
		team = [
			{species: 'boldore', ability: 'sandforce', moves: ['heavyslam', 'smackdown'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should consider Dream World Abilities as Hidden based on Gen 5 data', function () {
		let team = [
			{species: 'kecleon', ability: 'colorchange', moves: ['reflecttype'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen6ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'kecleon', ability: 'protean', moves: ['reflecttype'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen6ou').validateTeam(team);
		assert(illegal);
	});

	it('should reject newer Pokemon in older gens', function () {
		const team = [
			{species: 'pichu', ability: 'static', moves: ['thunderbolt']},
		];
		const illegal = TeamValidator.get('gen1ou').validateTeam(team);
		assert(illegal);
	});

	it('should reject exclusive G-Max moves added directly to a Pokemon\'s moveset', function () {
		const team = [
			{species: 'charizard', ability: 'blaze', moves: ['gmaxwildfire'], evs: {hp: 1}, gigantamax: true},
		];
		let illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);
		illegal = TeamValidator.get('gen8customgame@@@-nonexistent').validateTeam(team);
		assert(illegal);
	});

	it('should reject Gmax Pokemon from formats with Dynamax Clause', function () {
		const team = [
			{species: 'gengar-gmax', ability: 'cursedbody', moves: ['shadowball'], evs: {hp: 1}},
			{species: 'gengar', ability: 'cursedbody', moves: ['shadowball'], evs: {hp: 1}, gigantamax: true},
		];
		const illegal = TeamValidator.get('gen8customgame@@@dynamaxclause').validateTeam(team);
		assert(illegal);
	});

	it('should reject Pokemon that cannot obtain moves in a particular forme', function () {
		let team = [
			{species: 'toxicrity', ability: 'punkrock', moves: ['venomdrench, magneticflux'], evs: {hp: 1}},
			{species: 'toxicrity-low-key', ability: 'punkrock', moves: ['venoshock, shiftgear'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
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

	it('should properly validate Greninja-Ash', function () {
		let team = [
			{species: 'greninja-ash', ability: 'battlebond', moves: ['happyhour'], shiny: true, evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'greninja-ash', ability: 'battlebond', moves: ['protect'], shiny: true, evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'greninja-ash', ability: 'battlebond', moves: ['protect'], ivs: {atk: 0}, evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'greninja-ash', ability: 'battlebond', moves: ['hiddenpowergrass'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should not allow evolutions of Shiny-locked events to be Shiny', function () {
		const team = [
			{species: 'urshifu', ability: 'unseenfist', shiny: true, moves: ['snore'], evs: {hp: 1}},
			{species: 'cosmoem', ability: 'sturdy', shiny: true, moves: ['teleport'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should not allow events to use moves only obtainable in a previous generation', function () {
		const team = [
			{species: 'zeraora', ability: 'voltabsorb', shiny: true, moves: ['knockoff'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it('should allow use of a Hidden Ability if the format has the item Ability Patch', function () {
		let team = [
			{species: 'heatran', ability: 'flamebody', moves: ['sleeptalk'], evs: {hp: 1}},
			{species: 'entei', ability: 'innerfocus', moves: ['sleeptalk'], evs: {hp: 1}},
			{species: 'dracovish', ability: 'sandrush', moves: ['sleeptalk'], evs: {hp: 1}},
			{species: 'zapdos', ability: 'static', moves: ['sleeptalk'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen8vgc2021').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'heatran', ability: 'flamebody', moves: ['sleeptalk'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it(`should accept event Pokemon with oldgen tutor moves and HAs in formats with Ability Patch`, function () {
		const team = [
			{species: 'heatran', ability: 'flamebody', moves: ['eruption'], evs: {hp: 1}},
			{species: 'regirock', ability: 'sturdy', moves: ['counter'], evs: {hp: 1}},
			{species: 'zapdos', ability: 'static', moves: ['aircutter'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should not allow Gen 1 JP events', function () {
		const team = [
			{species: 'rapidash', moves: ['payday']},
		];
		const illegal = TeamValidator.get('gen1ou').validateTeam(team);
		assert(illegal);
	});

	it(`should not allow duplicate moves on the same set, except in hackmons`, function () {
		const team = [
			{species: 'corsola', ability: 'hustle', moves: ['snore', 'snore'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);

		illegal = TeamValidator.get('gen8purehackmons').validateTeam(team);
		assert.equal(illegal, null);
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

	it('should correctly enforce levels on Pokémon with unusual encounters in RBY', () => {
		const team = [
			{species: 'dragonair', level: 15, moves: ['dragonrage'], evs: {hp: 1}},
			{species: 'electrode', level: 15, moves: ['thunderbolt'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen1ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow Gen 2 events of Gen 1 Pokemon to learn moves exclusive to Gen 1', () => {
		let team = [
			{species: 'nidoking', moves: ['lovelykiss', 'counter']},
		];
		let illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);

		// Espeon should be allowed to learn moves as an Eevee
		team = [
			{species: 'espeon', moves: ['growth', 'substitute']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should tier Zacian and Zamazenta formes seperately', () => {
		let team = [
			{species: 'zamazenta-crowned', ability: 'dauntlessshield', item: 'rustedshield', moves: ['howl'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen8almostanyability').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'zamazenta', ability: 'dauntlessshield', item: 'lifeorb', moves: ['howl'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8almostanyability').validateTeam(team);
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
		assert.equal(illegal, null);

		team = [
			{species: 'pikachu', ability: 'airlock', moves: ['thunderbolt'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
		illegal = TeamValidator.get('gen7ou@@@!obtainableabilities').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'pikachu', ability: 'airlock', moves: ['dragondance'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ou@@@!obtainableabilities').validateTeam(team);
		assert(illegal);
	});

	it('should allow Pokemon to be banned', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes@@@-Pikachu').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'greninja', ability: 'battlebond', moves: ['surf'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes@@@-Greninja-Ash').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'greninja', ability: 'battlebond', moves: ['surf'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes@@@!Obtainable Formes,-Greninja-Ash').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow Pokemon to be unbanned', function () {
		const team = [
			{species: 'blaziken', ability: 'blaze', moves: ['skyuppercut'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7ou@@@+Blaziken').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow Pokemon to be whitelisted', function () {
		let team = [
			{species: 'giratina', ability: 'pressure', moves: ['protect'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7ubers@@@-allpokemon,+giratinaaltered').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'giratinaorigin', ability: 'levitate', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ubers@@@-allpokemon,+giratinaaltered').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'tyrantrum', ability: 'strongjaw', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8nationaldex@@@-allpokemon').validateTeam(team);
		assert(illegal);
	});

	it('should support banning/unbanning tag combinations', function () {
		let team = [
			{species: 'Crucibelle-Mega', ability: 'Regenerator', moves: ['protect'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen8customgame@@@-nonexistent,+mega').validateTeam(team);
		assert(illegal, "Nonexistent should override all tags that aren't existence-related");

		team = [
			{species: 'Crucibelle-Mega', ability: 'Regenerator', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8customgame@@@+mega,-nonexistent').validateTeam(team);
		assert(illegal, "Nonexistent should override all tags that aren't existence-related");

		team = [
			{species: 'Crucibelle-Mega', ability: 'Regenerator', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8customgame@@@-nonexistent,+crucibellemega').validateTeam(team);
		assert.equal(illegal, null, "Nonexistent should override all tags that aren't existence-related");

		team = [
			{species: 'Moltres-Galar', ability: 'Berserk', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8customgame@@@-sublegendary').validateTeam(team);
		assert(illegal);
	});

	it('should support restrictions', function () {
		let team = [
			{species: 'Yveltal', ability: 'No Ability', moves: ['protect'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7customgame@@@limitonerestricted,*restrictedlegendary').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'Yveltal', ability: 'No Ability', moves: ['protect'], evs: {hp: 1}},
			{species: 'Xerneas', ability: 'No Ability', moves: ['protect'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7customgame@@@limitonerestricted,*restrictedlegendary').validateTeam(team);
		assert(illegal);
	});

	it('should allow moves to be banned', function () {
		const team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7anythinggoes@@@-Agility').validateTeam(team);
		assert(illegal);
	});

	it('should allow moves to be unbanned', function () {
		const team = [
			{species: 'absol', ability: 'pressure', moves: ['batonpass'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7ou@@@+Baton Pass').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow items to be banned', function () {
		let team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], item: 'lightball', evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen7anythinggoes@@@-Light Ball').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], item: 'lightball', evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes@@@-noitem').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes@@@-noitem').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes@@@-allitems').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow items to be unbanned', function () {
		const team = [
			{species: 'eevee', ability: 'runaway', moves: ['tackle'], item: 'eeviumz', evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7lc@@@+Eevium Z').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow abilities to be banned', function () {
		const team = [
			{species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7anythinggoes@@@-Static').validateTeam(team);
		assert(illegal);
	});

	it('should allow abilities to be unbanned', function () {
		const team = [
			{species: 'wobbuffet', ability: 'shadowtag', moves: ['counter'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7ou@@@+Shadow Tag').validateTeam(team);
		assert.equal(illegal, null);
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
		assert.equal(illegal, null);

		team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: {hp: 1}},
			{species: 'abomasnow', ability: 'snowwarning', moves: ['grasswhistle'], evs: {hp: 1}},
			{species: 'cacturne', ability: 'sandveil', moves: ['grasswhistle'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7doublesou@@@-Gravity ++ Grass Whistle > 2').validateTeam(team);
		assert(illegal);
	});

	it('should allow complex bans to be removed', function () {
		const team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['gravity'], evs: {hp: 1}},
			{species: 'abomasnow', ability: 'snowwarning', moves: ['grasswhistle'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7doublesou@@@+Gravity ++ Grass Whistle').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow rule bundles to be removed', function () {
		const team = [
			{species: 'azumarill', ability: 'hugepower', moves: ['waterfall'], evs: {hp: 1}},
			{species: 'azumarill', ability: 'hugepower', moves: ['waterfall'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7ou@@@!Standard').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow rule bundles to be overridden', function () {
		const team = [
			{species: 'charizard-mega-y', ability: 'drought', item: 'charizarditey', moves: ['wingattack'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen7customgame@@@Standard').validateTeam(team);
		assert.equal(illegal, null);
	});
});
