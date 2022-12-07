'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Cloud Nine', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should treat the weather as none for the purposes of formes, moves and abilities', function () {
		battle = common.createBattle([[
			{species: 'Golduck', ability: 'cloudnine', moves: ['sunnyday']},
		], [
			{species: 'Cherrim', ability: 'flowergift', item: 'laggingtail', moves: ['solarbeam']},
		]]);
		const [weatherSuppressor, weatherUser] = [battle.p1.active[0], battle.p2.active[0]];
		assert.false.hurts(weatherSuppressor, () => battle.makeChoices('move sunnyday', 'move solarbeam')); // Solar Beam must charge
		assert(battle.field.isWeather(''));
		assert.species(weatherUser, 'Cherrim');
	});

	it('should negate the effects of Sun on Fire-type and Water-type attacks', function () {
		battle = common.createBattle([[
			{species: 'Groudon', ability: 'drought', moves: ['rest']},
		], [
			{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']},
		]]);
		let move, basePower;
		battle.makeChoices('move rest', 'move calmmind');
		move = Dex.moves.get('firepledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.equal(basePower, move.basePower);
		move = Dex.moves.get('waterpledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it('should negate the effects of Rain on Fire-type and Water-type attacks', function () {
		battle = common.createBattle([[
			{species: 'Kyogre', ability: 'drizzle', moves: ['rest']},
		], [
			{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']},
		]]);
		let move, basePower;
		battle.makeChoices('move rest', 'move calmmind');
		move = Dex.moves.get('firepledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.equal(basePower, move.basePower);
		move = Dex.moves.get('waterpledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it('should negate the damage-dealing effects of Sandstorm', function () {
		battle = common.createBattle([[
			{species: 'Tyranitar', ability: 'sandstream', moves: ['dragondance']},
		], [
			{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']},
		]]);
		assert.false.hurts(battle.p2.active[0], () => battle.makeChoices('move dragondance', 'move calmmind'));
	});

	it('should negate the damage-dealing effects of Hail', function () {
		battle = common.createBattle([[
			{species: 'Abomasnow', ability: 'snowwarning', moves: ['rest']},
		], [
			{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']},
		]]);
		assert.false.hurts(battle.p2.active[0], () => battle.makeChoices('move rest', 'move calmmind'));
	});

	it('should not negate Desolate Land\'s ability to prevent other weathers from activating', function () {
		battle = common.createBattle([[
			{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']},
		], [
			{species: 'Groudon', ability: 'desolateland', moves: ['sunnyday']},
		]]);
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	it('should not negate Primordial Sea\'s ability to prevent other weathers from activating', function () {
		battle = common.createBattle([[
			{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']},
		], [
			{species: 'Kyogre', ability: 'primordialsea', moves: ['sunnyday']},
		]]);
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	it('should not negate Delta Stream\'s ability to prevent other weathers from activating', function () {
		battle = common.createBattle([[
			{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']},
		], [
			{species: 'Rayquaza', ability: 'deltastream', moves: ['sunnyday']},
		]]);
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	it('should still display status of the weather', function () {
		battle = common.createBattle([[
			{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']},
		], [
			{species: 'Sunkern', ability: 'solarpower', moves: ['sunnyday']},
		]]);
		battle.makeChoices('move calmmind', 'move sunnyday');
		assert.equal(battle.log[battle.lastMoveLine + 1], '|-weather|SunnyDay');
		for (let i = 0; i < 4; i++) {
			assert.equal(battle.log[battle.lastMoveLine + 3], '|-weather|SunnyDay|[upkeep]');
			battle.makeChoices('move calmmind', 'move sunnyday');
		}
		assert.equal(battle.log[battle.lastMoveLine + 3], '|-weather|none');
	});

	it(`should allow Hydration to trigger if the user fainted before Hydration could trigger`, function () {
		battle = common.createBattle([[
			{species: 'Toxapex', ability: 'cloudnine', moves: ['toxic', 'raindance', 'finalgambit']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Manaphy', ability: 'hydration', moves: ['sleeptalk']},
		]]);

		const manaphy = battle.p2.active[0];
		battle.makeChoices();
		battle.makeChoices('move raindance', 'auto');
		assert.equal(manaphy.status, 'tox');

		battle.makeChoices('move finalgambit', 'auto');
		assert.equal(manaphy.status, '');
	});
});
