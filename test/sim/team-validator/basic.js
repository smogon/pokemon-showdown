'use strict';

const assert = require('assert').strict;
const TeamValidator = require('../../../sim/team-validator').TeamValidator;
const Teams = require('../../../sim/teams').Teams;

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

	it('should validate Sketch', function () {
		// Spore is a Gen 5 event move
		// Sketch itself should still be valid
		const team = [
			{species: 'smeargle', ability: 'owntempo', moves: ['bellydrum', 'spore', 'sketch'], evs: {hp: 1}},
		];
		const illegal = TeamValidator.get('gen4ou').validateTeam(team);
		assert.equal(illegal, null);
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

	it(`should not allow duplicate moves on the same set, except in hackmons`, function () {
		const team = [
			{species: 'corsola', ability: 'hustle', moves: ['snore', 'snore'], evs: {hp: 1}},
		];
		let illegal = TeamValidator.get('gen8anythinggoes').validateTeam(team);
		assert(illegal);

		illegal = TeamValidator.get('gen8purehackmons').validateTeam(team);
		assert.equal(illegal, null);
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
});
