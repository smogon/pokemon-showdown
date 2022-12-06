'use strict';

const assert = require('../../assert');

let team;

describe('Team Validator', function () {
	it("should validate Shedinja's egg moves correctly", function () {
		team = [
			{species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'gust'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen3ou');
	});

	it("should properly exclude egg moves for Baby Pokemon and their evolutions", function () {
		team = [
			{species: 'blissey', ability: 'naturalcure', moves: ['charm', 'seismictoss'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen7ou');

		team = [
			{species: 'marill', ability: 'hugepower', moves: ['splash', 'aquajet'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen7ou');

		team = [
			{species: 'azumarill', ability: 'thickfat', moves: ['futuresight', 'slam'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen7ou');
	});

	it("should disallow 4 egg moves on move evolutions before gen 6", function () {
		team = [
			{species: 'mamoswine', ability: 'oblivious', moves: ['tackle', 'iceshard', 'amnesia', 'furyattack'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen5ou');
		assert.legalTeam(team, 'gen7ou');
	});

	it("should disallow egg moves with male-only Hidden Abilities", function () {
		team = [
			{species: 'combusken', ability: 'speedboost', moves: ['batonpass'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen5ou');
	});

	it("should disallow Pokemon in Little Cup that can't be bred to be level 5", function () {
		team = [
			{species: 'kubfu', ability: 'innerfocus', moves: ['aerialace'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen8lc');
	});

	it('should reject illegal egg move combinations', function () {
		team = [
			{species: 'azumarill', ability: 'hugepower', moves: ['bellydrum', 'aquajet'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen5ou');

		team = [
			{species: 'cloyster', moves: ['rapidspin', 'explosion']},
		];
		assert.false.legalTeam(team, 'gen2ou');

		team = [
			{species: 'skarmory', ability: 'keeneye', moves: ['curse', 'drillpeck'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen3ou');

		team = [
			{species: 'skarmory', ability: 'keeneye', moves: ['whirlwind', 'drillpeck'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen3ou');

		team = [
			{species: 'armaldo', ability: 'battlearmor', moves: ['knockoff', 'rapidspin'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen3ou');
	});

	it('should allow chain breeding', function () {
		// via duskull
		team = [
			{species: 'weezing', ability: 'levitate', moves: ['painsplit', 'willowisp'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen3ou');

		// via snubbull
		team = [
			{species: 'blissey', moves: ['present', 'healbell']},
		];
		assert.legalTeam(team, 'gen2ou');

		// combine different tyrogue evos
		team = [
			{species: 'hitmontop', ability: 'intimidate', moves: ["highjumpkick", 'machpunch'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen3ou');

		// via cranidos
		team = [
			{species: 'snorlax', ability: 'immunity', moves: ['curse', 'pursuit'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen4ou');
	});

	it('should accept this chainbreed on Snorlax', function () {
		// the weirdest chainbreed I've ever seen:
		// breed male Curse Snorlax in Gen 3, transfer to XD, teach Self-destruct
		// by tutor, breed with female Gluttony Snorlax
		team = [
			{species: 'snorlax', ability: 'gluttony', moves: ['curse', 'selfdestruct'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen5ou');
	});

	it('should allow trading back Gen 2 egg moves if compatible with Gen 1', () => {
		// HJK can be bred onto Tyrogue in Gen 2, evolved into Hitmonchan, transferred back to Gen 1, taught Body Slam via TM, and transferred back to Gen 2.
		team = [
			{species: 'hitmonchan', moves: ['highjumpkick', 'bodyslam']},
		];
		assert.legalTeam(team, 'gen2ou');

		team = [
			{species: 'marowak', moves: ['swordsdance', 'rockslide', 'bodyslam']},
		];
		assert.legalTeam(team, 'gen2ou');
		assert.legalTeam(team, 'gen1tradebacksou');
		assert.false.legalTeam(team, 'gen1ou');
	});

	it("should disallow trading back an egg move not in gen 1", () => {
		team = [
			{species: 'marowak', moves: ['swordsdance', 'ancientpower', 'bodyslam']},
		];
		assert.false.legalTeam(team, 'gen2ou');
	});

	it("should properly resolve egg moves for Pokemon with pre-evolutions that don't have Hidden Abilities", function () {
		team = [
			{species: 'tyranitar', ability: 'unnerve', moves: ['dragondance'], evs: {hp: 1}},
			{species: 'staraptor', ability: 'reckless', moves: ['pursuit'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen5ou');
	});

	it("should allow Nidoqueen to have egg moves", function () {
		team = [
			{species: 'nidoqueen', ability: 'poisonpoint', moves: ['charm'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen6ou');
	});

	it("should properly handle HA Dragonite with Extreme Speed", function () {
		team = [
			{species: 'dragonite', ability: 'multiscale', moves: ['extremespeed'], evs: {hp: 1}},
		];
		assert.legalTeam(team, 'gen5ou');

		team = [
			{species: 'dragonite', ability: 'multiscale', moves: ['extremespeed', 'aquajet'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen5ou');
	});

	it.skip('should reject Volbeat with both Lunge and Dizzy Punch in Gen 7', function () {
		team = [
			{species: 'volbeat', ability: 'swarm', moves: ['lunge', 'dizzypunch'], evs: {hp: 1}},
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');
	});

	it.skip('should accept this chainbreed on Toxicroak', function () {
		team = [
			{species: 'toxicroak', ability: 'dryskin', moves: ['bulletpunch', 'crosschop', 'fakeout'], evs: {hp: 4}},
		];
		assert.legalTeam(team, 'gen5ou');
	});
});
