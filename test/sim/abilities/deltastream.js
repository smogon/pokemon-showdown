'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Delta Stream', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate the Delta Stream weather upon switch-in', function () {
		battle = common.createBattle([[
			{species: "Rayquaza", ability: 'deltastream', moves: ['roost']},
		], [
			{species: "Abra", ability: 'magicguard', moves: ['teleport']},
		]]);
		assert(battle.field.isWeather('deltastream'));
	});

	it('should negate the type weaknesses of the Flying-type', function () {
		battle = common.createBattle([[
			{species: "Tornadus", ability: 'deltastream', item: 'weaknesspolicy', moves: ['recover']},
		], [
			{species: "Smeargle", ability: 'owntempo', moves: ['thundershock', 'powdersnow', 'powergem']},
		]]);
		const pokemon = battle.p1.active[0];
		for (let i = 1; i <= 3; i++) {
			battle.makeChoices('move recover', 'move ' + i);
			assert.statStage(pokemon, 'atk', 0);
			assert.statStage(pokemon, 'spa', 0);
			assert.holdsItem(pokemon);
		}
	});

	it('should not negate the type weaknesses of any other type, even if the Pokemon is Flying-type', function () {
		battle = common.createBattle([[
			{species: "Rayquaza", ability: 'deltastream', item: 'weaknesspolicy', moves: ['recover']},
		], [
			{species: "Smeargle", ability: 'owntempo', moves: ['dragonpulse']},
		]]);
		battle.makeChoices('move recover', 'move dragonpulse');
		const pokemon = battle.p1.active[0];
		assert.statStage(pokemon, 'atk', 2);
		assert.statStage(pokemon, 'spa', 2);
		assert.false.holdsItem(pokemon);
	});

	it('should not reduce damage from Stealth Rock', function () {
		battle = common.createBattle([[
			{species: "Rayquaza", ability: 'pressure', moves: ['roost']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		], [
			{species: "Lugia", ability: 'deltastream', moves: ['stealthrock']},
		]]);
		battle.makeChoices('move roost', 'move stealthrock');
		const pokemon = battle.p1.pokemon[1];
		assert.hurtsBy(pokemon, Math.floor(pokemon.maxhp / 2), () => battle.makeChoices('switch 2', 'move stealthrock'));
	});

	it('should prevent moves and abilities from setting the weather to Sunny Day, Rain Dance, Sandstorm, or Hail', function () {
		battle = common.createBattle([[
			{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']},
		], [
			{species: "Abra", ability: 'magicguard', moves: ['teleport']},
			{species: "Kyogre", ability: 'drizzle', moves: ['raindance']},
			{species: "Groudon", ability: 'drought', moves: ['sunnyday']},
			{species: "Tyranitar", ability: 'sandstream', moves: ['sandstorm']},
			{species: "Abomasnow", ability: 'snowwarning', moves: ['hail']},
		]]);
		for (let i = 2; i <= 5; i++) {
			battle.makeChoices('move helpinghand', 'switch ' + i);
			assert(battle.field.isWeather('deltastream'));
			battle.makeChoices('move helpinghand', 'move 1');
			assert(battle.field.isWeather('deltastream'));
		}
	});

	it('should cause the Delta Stream weather to fade if it switches out and no other Delta Stream Pokemon are active', function () {
		battle = common.createBattle([[
			{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		], [
			{species: "Lugia", ability: 'pressure', moves: ['roost']},
		]]);
		assert.sets(() => battle.field.isWeather('deltastream'), false, () => battle.makeChoices('switch 2', 'move roost'));
	});

	it('should not cause the Delta Stream weather to fade if it switches out and another Delta Stream Pokemon is active', function () {
		battle = common.createBattle([[
			{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		], [
			{species: "Rayquaza", ability: 'deltastream', moves: ['bulkup']},
		]]);
		assert.constant(() => battle.field.isWeather('deltastream'), () => battle.makeChoices('switch 2', 'move bulkup'));
	});

	it('should cause the Delta Stream weather to fade if its ability is suppressed and no other Delta Stream Pokemon are active', function () {
		battle = common.createBattle([[
			{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']},
		], [
			{species: "Lugia", ability: 'pressure', moves: ['gastroacid']},
		]]);
		assert.sets(() => battle.field.isWeather('deltastream'), false, () => battle.makeChoices('move helpinghand', 'move gastroacid'));
	});

	it('should not cause the Delta Stream weather to fade if its ability is suppressed and another Delta Stream Pokemon is active', function () {
		battle = common.createBattle([[
			{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']},
		], [
			{species: "Rayquaza", ability: 'deltastream', moves: ['gastroacid']},
		]]);
		assert.constant(() => battle.field.isWeather('deltastream'), () => battle.makeChoices('move helpinghand', 'move gastroacid'));
	});

	it('should cause the Delta Stream weather to fade if its ability is changed and no other Delta Stream Pokemon are active', function () {
		battle = common.createBattle([[
			{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']},
		], [
			{species: "Lugia", ability: 'pressure', moves: ['entrainment']},
		]]);
		assert.sets(() => battle.field.isWeather('deltastream'), false, () => battle.makeChoices('move helpinghand', 'move entrainment'));
	});
});
