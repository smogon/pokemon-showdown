'use strict';

const assert = require('../../assert');
const Teams = require('../../../dist/sim/teams').Teams;

describe('Team Validator', () => {
	it('should have valid formats to work with', () => {
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
	it('should reject non-existent Pokemon', () => {
		const team = [
			{ species: 'nonexistentPokemon', moves: ['thunderbolt'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7customgame');
	});

	it('should reject non-existent items', () => {
		const team = [
			{ species: 'pikachu', moves: ['thunderbolt'], ability: 'static', item: 'nonexistentItem', evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7customgame');
	});

	it('should reject non-existent abilities', () => {
		const team = [
			{ species: 'pikachu', moves: ['thunderbolt'], ability: 'nonexistentAbility', evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7customgame');
	});

	it('should reject non-existent moves', () => {
		const team = [
			{ species: 'pikachu', ability: 'static', moves: ['nonexistentMove'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7customgame');
	});

	it('should validate Gen 2 IVs', () => {
		let team = Teams.unpack('|raikou|||hiddenpowerwater||||14,28,26,,,|||');
		assert.legalTeam(team, 'gen2ou');

		team = Teams.unpack('|raikou|||hiddenpowerfire||||14,28,26,,,|||');
		assert.false.legalTeam(team, 'gen2ou');

		team = Teams.unpack('|raikou|||hiddenpowerwater||||16,28,26,,,|||');
		assert.false.legalTeam(team, 'gen2ou');

		team = Teams.unpack('|raikou|||thunderbolt||||,,,28,30,|||');
		assert.false.legalTeam(team, 'gen2ou');
	});

	it('should validate Gen 2 EVs', () => {
		let team = Teams.unpack('|gengar|||thunderbolt||,,,200,200,|||||');
		assert.legalTeam(team, 'gen2ou');

		team = Teams.unpack('|gengar|||thunderbolt||,,,248,252,|||||');
		assert.false.legalTeam(team, 'gen2ou');
	});

	it('should validate Gen 7 IVs', () => {
		let team = [
			{ species: 'yveltal', ability: 'darkaura', moves: ['hiddenpowerfighting'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7ubers');

		team = [
			{ species: 'latiasmega', ability: 'levitate', item: 'latiasite', moves: ['hiddenpowerfighting'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7ubers');
	});

	it(`should enforce the 3 perfect IV minimum on legendaries with Gen 6+ origin`, () => {
		const team = [
			{ species: 'xerneas', ability: 'fairyaura', moves: ['snore'], ivs: { hp: 0, atk: 0, def: 0, spa: 0 }, evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen9anythinggoes');

		assert.legalTeam(team, 'gen9purehackmons');
	});

	it('should reject non-existent natures', () => {
		const team = [
			{ species: 'pikachu', ability: 'static', moves: ['thunderbolt'], nature: 'nonexistentNature', evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7customgame');
	});

	it('should reject invalid happiness values', () => {
		const team = [
			{ species: 'pikachu', ability: 'static', moves: ['thunderbolt'], happiness: 'invalidHappinessValue', evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7customgame');
	});

	it('should validate EVs', () => {
		const team = [
			{ species: 'pikachu', ability: 'static', moves: ['thunderbolt'], evs: { hp: 252, atk: 252, def: 252 } },
		];
		assert.false.legalTeam(team, 'gen8ou');
	});

	it('should accept legal movesets', () => {
		let team = [
			{ species: 'pikachu', ability: 'static', moves: ['agility', 'protect', 'thunder', 'thunderbolt'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7anythinggoes');

		team = [
			{ species: 'meowstic', ability: 'prankster', moves: ['trick', 'magiccoat'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7anythinggoes');
	});

	it('should reject illegal movesets', () => {
		const team = [
			{ species: 'pikachu', ability: 'static', moves: ['blastburn', 'frenzyplant', 'hydrocannon', 'dragonascent'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');
	});

	it('should reject banned Pokemon', () => {
		let team = [
			{ species: 'arceus', ability: 'multitype', item: 'dragoniumz', moves: ['judgment'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen71v1');

		team = [
			{ species: 'rayquazamega', ability: 'deltastream', moves: ['dragonascent'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7ou');

		team = [
			{ species: 'mimikyutotem', ability: 'disguise', moves: ['shadowsneak'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7ou@@@-mimikyu');

		// bans should override past unbans
		team = [
			{ species: 'torkoal', ability: 'drought', moves: ['bodyslam'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7ou@@@-drought,+drought');
		assert.false.legalTeam(team, 'gen7ou@@@-drought,+drought,-drought');
	});

	it('should validate Sketch', () => {
		// Spore is a Gen 5 event move
		// Sketch itself should still be valid
		const team = [
			{ species: 'smeargle', ability: 'owntempo', moves: ['bellydrum', 'spore', 'sketch'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen4ou');
	});

	it('should accept both ability types for Mega Evolutions', () => {
		// base forme ability
		let team = [
			{ species: 'gyaradosmega', item: 'gyaradosite', ability: 'intimidate', moves: ['dragondance', 'crunch', 'waterfall', 'icefang'], evs: { hp: 1 } },
			{ species: 'kyogreprimal', item: 'blueorb', ability: 'drizzle', moves: ['originpulse'], evs: { hp: 1 } },
			{ species: 'rayquazamega', item: 'leftovers', ability: 'airlock', moves: ['dragonascent'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7anythinggoes');

		// mega forme ability
		team = [
			{ species: 'gyaradosmega', item: 'gyaradosite', ability: 'moldbreaker', moves: ['dragondance', 'crunch', 'waterfall', 'icefang'], evs: { hp: 1 } },
			{ species: 'kyogreprimal', item: 'blueorb', ability: 'primordialsea', moves: ['originpulse'], evs: { hp: 1 } },
			{ species: 'rayquazamega', item: 'leftovers', ability: 'deltastream', moves: ['dragonascent'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7anythinggoes');
	});

	it('should reject newer Pokemon in older gens', () => {
		const team = [
			{ species: 'pichu', ability: 'static', moves: ['thunderbolt'] },
		];
		assert.false.legalTeam(team, 'gen1ou');
	});

	it('should reject exclusive G-Max moves added directly to a Pokemon\'s moveset', () => {
		const team = [
			{ species: 'charizard', ability: 'blaze', moves: ['gmaxwildfire'], evs: { hp: 1 }, gigantamax: true },
		];
		assert.false.legalTeam(team, 'gen8anythinggoes');
		assert.false.legalTeam(team, 'gen8customgame@@@-nonexistent');
	});

	it('should reject Gmax Pokemon from formats with Dynamax Clause', () => {
		const team = [
			{ species: 'gengar-gmax', ability: 'cursedbody', moves: ['shadowball'], evs: { hp: 1 } },
			{ species: 'gengar', ability: 'cursedbody', moves: ['shadowball'], evs: { hp: 1 }, gigantamax: true },
		];
		assert.false.legalTeam(team, 'gen8customgame@@@dynamaxclause');
	});

	it(`should not allow duplicate moves on the same set, except in hackmons`, () => {
		const team = [
			{ species: 'corsola', ability: 'hustle', moves: ['snore', 'snore'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen9anythinggoes');

		assert.legalTeam(team, 'gen9purehackmons');
	});

	it('should accept VC moves only with Hidden ability and correct IVs', () => {
		let team = [
			{ species: 'machamp', ability: 'steadfast', moves: ['fissure'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7anythinggoes');
		team = [
			{ species: 'tauros', ability: 'sheerforce', moves: ['bodyslam'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7anythinggoes');
		team = [
			{ species: 'tauros', ability: 'intimidate', ivs: { hp: 31, atk: 31, def: 30, spa: 30, spd: 30, spe: 30 }, moves: ['bodyslam'], evs: { hp: 1 } },
			{ species: 'suicune', ability: 'innerfocus', moves: ['scald'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen7anythinggoes');

		team = [
			{ species: 'machamp', ability: 'noguard', moves: ['fissure'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');
		team = [
			{ species: 'tauros', ability: 'sheerforce', ivs: { hp: 31, atk: 31, def: 30, spa: 30, spd: 30, spe: 30 }, moves: ['bodyslam'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');

		team = [
			{ species: 'koffing', ability: 'levitate', moves: ['zapcannon'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen8ou');

		team = [
			{ species: 'weezing-galar', ability: 'levitate', moves: ['zapcannon'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen8ou');
	});

	it(`should disallow past gen only moves in Gen 9`, () => {
		const team = [
			{ species: 'oricorio', ability: 'dancer', moves: ['roleplay'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen9ou');
	});
});
