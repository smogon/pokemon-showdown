'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Delta Stream', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate the Delta Stream weather upon switch-in', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['roost']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Abra", ability: 'magicguard', moves: ['teleport']}]);
		assert.ok(battle.isWeather('deltastream'));
	});

	it('should negate the type weaknesses of the Flying-type', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Tornadus", ability: 'deltastream', item: 'weaknesspolicy', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['thundershock', 'powdersnow', 'powergem']}]);
		const pokemon = battle.p1.active[0];
		for (let i = 1; i <= 3; i++) {
			battle.makeChoices('move recover', 'move ' + i);
			assert.statStage(pokemon, 'atk', 0);
			assert.statStage(pokemon, 'spa', 0);
			assert.holdsItem(pokemon);
		}
	});

	it('should not negate the type weaknesses of any other type, even if the Pokemon is Flying-type', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', item: 'weaknesspolicy', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['dragonpulse']}]);
		battle.makeChoices('move recover', 'move dragonpulse');
		const pokemon = battle.p1.active[0];
		assert.statStage(pokemon, 'atk', 2);
		assert.statStage(pokemon, 'spa', 2);
		assert.false.holdsItem(pokemon);
	});

	it('should prevent moves and abilities from setting the weather to Sunny Day, Rain Dance, Sandstorm, or Hail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Abra", ability: 'magicguard', moves: ['teleport']},
			{species: "Kyogre", ability: 'drizzle', moves: ['raindance']},
			{species: "Groudon", ability: 'drought', moves: ['sunnyday']},
			{species: "Tyranitar", ability: 'sandstream', moves: ['sandstorm']},
			{species: "Abomasnow", ability: 'snowwarning', moves: ['hail']},
		]);
		for (let i = 2; i <= 5; i++) {
			battle.makeChoices('move helpinghand', 'switch ' + i);
			assert.ok(battle.isWeather('deltastream'));
			battle.makeChoices('move helpinghand', 'move 1');
			assert.ok(battle.isWeather('deltastream'));
		}
	});

	it('should cause the Delta Stream weather to fade if it switches out and no other Delta Stream Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['roost']}]);
		assert.sets(() => battle.isWeather('deltastream'), false, () => battle.makeChoices('switch 2', 'move roost'));
	});

	it('should not cause the Delta Stream weather to fade if it switches out and another Delta Stream Pokemon is active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['bulkup']}]);
		assert.constant(() => battle.isWeather('deltastream'), () => battle.makeChoices('switch 2', 'move bulkup'));
	});

	it('should cause the Delta Stream weather to fade if its ability is suppressed and no other Delta Stream Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['gastroacid']}]);
		assert.sets(() => battle.isWeather('deltastream'), false, () => battle.makeChoices('move helpinghand', 'move gastroacid'));
	});

	it('should not cause the Delta Stream weather to fade if its ability is suppressed and another Delta Stream Pokemon is active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['gastroacid']}]);
		assert.constant(() => battle.isWeather('deltastream'), () => battle.makeChoices('move helpinghand', 'move gastroacid'));
	});

	it('should cause the Delta Stream weather to fade if its ability is changed and no other Delta Stream Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['entrainment']}]);
		assert.sets(() => battle.isWeather('deltastream'), false, () => battle.makeChoices('move helpinghand', 'move entrainment'));
	});
});
