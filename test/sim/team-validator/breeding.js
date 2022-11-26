'use strict';

const assert = require('assert').strict;
const TeamValidator = require('../../../sim/team-validator').TeamValidator;

let team;
let illegal;

describe('Team Validator', function () {
	it("should validate Shedinja's egg moves correctly", function () {
		team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'gust'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it("should properly exclude egg moves for Baby Pokemon and their evolutions", function () {
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
			{species: 'azumarill', ability: 'thickfat', moves: ['futuresight', 'slam'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7ou').validateTeam(team);
		assert(illegal);
	});

	it("should disallow 4 egg moves on move evolutions before gen 6", function () {
		team = [
			{species: 'mamoswine', ability: 'oblivious', moves: ['tackle', 'iceshard', 'amnesia', 'furyattack'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert(illegal);
		illegal = TeamValidator.get('gen7ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it("should disallow egg moves with male-only Hidden Abilities", function () {
		team = [
			{species: 'combusken', ability: 'speedboost', moves: ['batonpass'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert(illegal);
	});

	it("should disallow Pokemon in Little Cup that can't be bred to be level 5", function () {
		team = [
			{species: 'kubfu', ability: 'innerfocus', moves: ['aerialace'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen8lc').validateTeam(team);
		assert(illegal);
	});

	it('should reject illegal egg move combinations', function () {
		team = [
			{species: 'azumarill', ability: 'hugepower', moves: ['bellydrum', 'aquajet'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert(illegal);

		team = [
			{species: 'cloyster', moves: ['rapidspin', 'explosion']},
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

		team = [
			{species: 'armaldo', ability: 'battlearmor', moves: ['knockoff', 'rapidspin'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert(illegal);
	});

	it('should allow chain breeding', function () {
		// via duskull
		team = [
			{species: 'weezing', ability: 'levitate', moves: ['painsplit', 'willowisp'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert.equal(illegal, null);

		// via snubbull
		team = [
			{species: 'blissey', moves: ['present', 'healbell']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);

		// combine different tyrogue evos
		team = [
			{species: 'hitmontop', ability: 'intimidate', moves: ["highjumpkick", 'machpunch'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen3ou').validateTeam(team);
		assert.equal(illegal, null);

		// via cranidos
		team = [
			{species: 'snorlax', ability: 'immunity', moves: ['curse', 'pursuit'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen4ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should accept this chainbreed on Snorlax', function () {
		// the weirdest chainbreed I've ever seen:
		// breed male Curse Snorlax in Gen 3, transfer to XD, teach Self-destruct
		// by tutor, breed with female Gluttony Snorlax
		team = [
			{species: 'snorlax', ability: 'gluttony', moves: ['curse', 'selfdestruct'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it('should allow trading back Gen 2 egg moves if compatible with Gen 1', () => {
		// HJK can be bred onto Tyrogue in Gen 2, evolved into Hitmonchan, transferred back to Gen 1, taught Body Slam via TM, and transferred back to Gen 2.
		team = [
			{species: 'hitmonchan', moves: ['highjumpkick', 'bodyslam']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);

		team = [
			{species: 'marowak', moves: ['swordsdance', 'rockslide', 'bodyslam']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert.equal(illegal, null);
		illegal = TeamValidator.get('gen1tradebacksou').validateTeam(team);
		assert.equal(illegal, null);
		illegal = TeamValidator.get('gen1ou').validateTeam(team);
		assert(illegal);
	});

	it("should disallow trading back an egg move not in gen 1", () => {
		team = [
			{species: 'marowak', moves: ['swordsdance', 'ancientpower', 'bodyslam']},
		];
		illegal = TeamValidator.get('gen2ou').validateTeam(team);
		assert(illegal);
	});

	it("should properly resolve egg moves for Pokemon with pre-evolutions that don't have Hidden Abilities", function () {
		team = [
			{species: 'tyranitar', ability: 'unnerve', moves: ['dragondance'], evs: {hp: 1}},
			{species: 'staraptor', ability: 'reckless', moves: ['pursuit'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it("should allow Nidoqueen to have egg moves", function () {
		team = [
			{species: 'nidoqueen', ability: 'poisonpoint', moves: ['charm'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen6ou').validateTeam(team);
		assert.equal(illegal, null);
	});

	it("should properly handle HA Dragonite with Extreme Speed", function () {
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
		team = [
			{species: 'volbeat', ability: 'swarm', moves: ['lunge', 'dizzypunch'], evs: {hp: 1}},
		];
		illegal = TeamValidator.get('gen7anythinggoes').validateTeam(team);
		assert(illegal);
	});

	it.skip('should accept this chainbreed on Toxicroak', function () {
		team = [
			{species: 'toxicroak', ability: 'dryskin', moves: ['bulletpunch', 'crosschop', 'fakeout'], evs: {hp: 4}},
		];
		illegal = TeamValidator.get('gen5ou').validateTeam(team);
		assert.equal(illegal, null);
	});
});
