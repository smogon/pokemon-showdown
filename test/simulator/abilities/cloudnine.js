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
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['sunnyday']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: 'Cherrim', ability: 'flowergift', item: 'laggingtail', moves: ['solarbeam']}]);
		assert.false.hurts(p1.active[0], () => battle.makeChoices('move sunnyday', 'move solarbeam')); // Solar Beam must charge
		assert.ok(battle.isWeather('', p2.active[0]));
		assert.species(p2.active[0], 'Cherrim');
	});

	it('should negate the effects of Sun on Fire-type and Water-type attacks', function () {
		battle = common.createBattle();
		let move, basePower;
		battle.join('p1', 'Guest 1', 1, [{species: 'Groudon', ability: 'drought', moves: ['rest']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]);
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
		battle.join('p1', 'Guest 1', 1, [{species: 'Kyogre', ability: 'drizzle', moves: ['rest']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]);
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
		battle.join('p1', 'Guest 1', 1, [{species: 'Tyranitar', ability: 'sandstream', moves: ['dragondance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]);
		assert.false.hurts(battle.p2.active[0], () => battle.makeChoices('move dragondance', 'move calmmind'));
	});

	it('should negate the damage-dealing effects of Hail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Abomasnow', ability: 'snowwarning', moves: ['rest']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]);
		assert.false.hurts(battle.p2.active[0], () => battle.makeChoices('move rest', 'move calmmind'));
	});

	it('should not negate Desolate Land\'s ability to prevent other weathers from activating', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Groudon', ability: 'desolateland', moves: ['sunnyday']}]);
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	it('should not negate Primordial Sea\'s ability to prevent other weathers from activating', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Kyogre', ability: 'primordialsea', moves: ['sunnyday']}]);
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	it('should not negate Delta Stream\'s ability to prevent other weathers from activating', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Rayquaza', ability: 'deltastream', moves: ['sunnyday']}]);
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	it('should still display status of the weather', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Sunkern', ability: 'solarpower', moves: ['sunnyday']}]);
		battle.makeChoices('move calmmind', 'move sunnyday');
		assert.strictEqual(battle.log[battle.lastMoveLine + 1], '|-weather|SunnyDay');
		for (let i = 0; i < 4; i++) {
			assert.strictEqual(battle.log[battle.lastMoveLine + 3], '|-weather|SunnyDay|[upkeep]');
			battle.makeChoices('move calmmind', 'move sunnyday');
		}
		assert.strictEqual(battle.log[battle.lastMoveLine + 3], '|-weather|none');
	});
});
