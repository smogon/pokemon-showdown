'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Cloud Nine', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should treat the weather as none for the purposes of formes, moves and abilities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Golduck', ability: 'cloudnine', moves: ['sunnyday']}]});
		battle.setPlayer('p2', {team: [{species: 'Cherrim', ability: 'flowergift', item: 'laggingtail', moves: ['solarbeam']}]});
		const [weatherSuppressor, weatherUser] = [battle.p1.active[0], battle.p2.active[0]];
		assert.false.hurts(weatherSuppressor, () => battle.makeChoices('move sunnyday', 'move solarbeam')); // Solar Beam must charge
		assert.ok(battle.field.isWeather(''));
		assert.species(weatherUser, 'Cherrim');
	});

	it('should negate the effects of Sun on Fire-type and Water-type attacks', function () {
		battle = common.createBattle();
		let move, basePower;
		battle.setPlayer('p1', {team: [{species: 'Groudon', ability: 'drought', moves: ['rest']}]});
		battle.setPlayer('p2', {team: [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]});
		battle.makeChoices('move rest', 'move calmmind');
		move = Dex.getMove('firepledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
		move = Dex.getMove('waterpledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should negate the effects of Rain on Fire-type and Water-type attacks', function () {
		battle = common.createBattle();
		let move, basePower;
		battle.setPlayer('p1', {team: [{species: 'Kyogre', ability: 'drizzle', moves: ['rest']}]});
		battle.setPlayer('p2', {team: [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]});
		battle.makeChoices('move rest', 'move calmmind');
		move = Dex.getMove('firepledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
		move = Dex.getMove('waterpledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should negate the damage-dealing effects of Sandstorm', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Tyranitar', ability: 'sandstream', moves: ['dragondance']}]});
		battle.setPlayer('p2', {team: [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]});
		assert.false.hurts(battle.p2.active[0], () => battle.makeChoices('move dragondance', 'move calmmind'));
	});

	it('should negate the damage-dealing effects of Hail', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Abomasnow', ability: 'snowwarning', moves: ['rest']}]});
		battle.setPlayer('p2', {team: [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]});
		assert.false.hurts(battle.p2.active[0], () => battle.makeChoices('move rest', 'move calmmind'));
	});

	it('should not negate Desolate Land\'s ability to prevent other weathers from activating', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']}]});
		battle.setPlayer('p2', {team: [{species: 'Groudon', ability: 'desolateland', moves: ['sunnyday']}]});
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	it('should not negate Primordial Sea\'s ability to prevent other weathers from activating', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']}]});
		battle.setPlayer('p2', {team: [{species: 'Kyogre', ability: 'primordialsea', moves: ['sunnyday']}]});
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	it('should not negate Delta Stream\'s ability to prevent other weathers from activating', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']}]});
		battle.setPlayer('p2', {team: [{species: 'Rayquaza', ability: 'deltastream', moves: ['sunnyday']}]});
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	it('should still display status of the weather', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]});
		battle.setPlayer('p2', {team: [{species: 'Sunkern', ability: 'solarpower', moves: ['sunnyday']}]});
		battle.makeChoices('move calmmind', 'move sunnyday');
		assert.strictEqual(battle.log[battle.lastMoveLine + 1], '|-weather|SunnyDay');
		for (let i = 0; i < 4; i++) {
			assert.strictEqual(battle.log[battle.lastMoveLine + 3], '|-weather|SunnyDay|[upkeep]');
			battle.makeChoices('move calmmind', 'move sunnyday');
		}
		assert.strictEqual(battle.log[battle.lastMoveLine + 3], '|-weather|none');
	});
});
