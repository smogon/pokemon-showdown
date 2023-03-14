'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Desolate Land', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate the Desolate Land weather upon switch-in', function () {
		battle = common.createBattle([[
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
		], [
			{species: "Abra", ability: 'magicguard', moves: ['teleport']},
		]]);
		assert(battle.field.isWeather('desolateland'));
	});

	it('should increase the damage (not the basePower) of Fire-type attacks', function () {
		battle = common.createBattle([[
			{species: 'Ninetales', ability: 'desolateland', moves: ['incinerate']},
		], [
			{species: 'Cryogonal', ability: 'levitate', moves: ['splash']},
		]]);
		battle.randomizer = dmg => dmg; // max damage
		const attacker = battle.p1.active[0];
		const defender = battle.p2.active[0];
		assert.hurtsBy(defender, 152, () => battle.makeChoices('move incinerate', 'move splash'));
		const move = Dex.moves.get('incinerate');
		const basePower = battle.runEvent('BasePower', attacker, defender, move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it('should cause Water-type attacks to fail', function () {
		battle = common.createBattle([[
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
		], [
			{species: "Blastoise", ability: 'torrent', moves: ['surf']},
		]]);
		battle.makeChoices('move helpinghand', 'move surf');
		assert.fullHP(battle.p1.active[0]);
	});

	it('should not cause Water-type Status moves to fail', function () {
		battle = common.createBattle([[
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
		], [
			{species: "Blastoise", ability: 'torrent', moves: ['soak']},
		]]);
		const soakTarget = battle.p1.active[0];
		assert.sets(() => soakTarget.getTypes().join('/'), 'Water', () => battle.makeChoices('move helpinghand', 'move soak'));
	});

	it('should prevent moves and abilities from setting the weather to Sunny Day, Rain Dance, Sandstorm, or Hail', function () {
		battle = common.createBattle([[
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
		], [
			{species: "Abra", ability: 'magicguard', moves: ['teleport']},
			{species: "Kyogre", ability: 'drizzle', moves: ['raindance']},
			{species: "Groudon", ability: 'drought', moves: ['sunnyday']},
			{species: "Tyranitar", ability: 'sandstream', moves: ['sandstorm']},
			{species: "Abomasnow", ability: 'snowwarning', moves: ['hail']},
		]]);
		for (let i = 2; i <= 5; i++) {
			battle.makeChoices('move helpinghand', 'switch ' + i);
			assert(battle.field.isWeather('desolateland'));
			battle.makeChoices('move helpinghand', 'move 1');
			assert(battle.field.isWeather('desolateland'));
		}
	});

	it('should be treated as Sunny Day for any forme, move or ability that requires it', function () {
		battle = common.createBattle([[
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand', 'solarbeam']},
		], [
			{species: "Castform", ability: 'forecast', moves: ['weatherball']},
			{species: "Cherrim", ability: 'flowergift', moves: ['growth']},
			{species: "Charizard", ability: 'solarpower', moves: ['roost']},
			{species: "Venusaur", ability: 'chlorophyll', moves: ['growth']},
			{species: "Toxicroak", ability: 'dryskin', moves: ['bulkup']},
		]]);
		battle.onEvent('Hit', battle.format, (target, pokemon, move) => {
			if (move.id === 'weatherball') {
				assert.equal(move.type, 'Fire');
			}
		});
		const myActive = battle.p2.active;
		battle.makeChoices('move helpinghand', 'move weatherball');
		assert.species(myActive[0], 'Castform-Sunny');
		battle.makeChoices('move helpinghand', 'switch 2');
		assert.species(myActive[0], 'Cherrim-Sunshine');
		battle.makeChoices('move helpinghand', 'switch 3');
		assert.false.fullHP(myActive[0], "Charizard should be hurt by Solar Power");
		battle.makeChoices('move solarbeam', 'switch 4');
		assert.equal(myActive[0].getStat('spe'), 2 * myActive[0].storedStats['spe'], "Venusaur's speed should be doubled by Chlorophyll");
		assert.false.fullHP(myActive[0], "Solar Beam should skip its charge turn");
		battle.makeChoices('move helpinghand', 'switch 5');
		assert.false.fullHP(myActive[0], "Toxicroak should be hurt by Dry Skin");
	});

	it('should cause the Desolate Land weather to fade if it switches out and no other Desolate Land Pokemon are active', function () {
		battle = common.createBattle([[
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		], [
			{species: "Lugia", ability: 'pressure', moves: ['roost']},
		]]);
		assert.sets(() => battle.field.isWeather('desolateland'), false, () => battle.makeChoices('switch 2', 'move roost'));
	});

	it('should not cause the Desolate Land weather to fade if it switches out and another Desolate Land Pokemon is active', function () {
		battle = common.createBattle([[
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		], [
			{species: "Groudon", ability: 'desolateland', moves: ['bulkup']},
		]]);
		assert.constant(() => battle.field.isWeather('desolateland'), () => battle.makeChoices('switch 2', 'move bulkup'));
	});

	it('should cause the Desolate Land weather to fade if its ability is suppressed and no other Desolate Land Pokemon are active', function () {
		battle = common.createBattle([[
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
		], [
			{species: "Lugia", ability: 'pressure', moves: ['gastroacid']},
		]]);
		assert.sets(() => battle.field.isWeather('desolateland'), false, () => battle.makeChoices('move helpinghand', 'move gastroacid'));
	});

	it('should not cause the Desolate Land weather to fade if its ability is suppressed and another Desolate Land Pokemon is active', function () {
		battle = common.createBattle([[
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
		], [
			{species: "Groudon", ability: 'desolateland', moves: ['gastroacid']},
		]]);
		assert.constant(() => battle.field.isWeather('desolateland'), () => battle.makeChoices('move helpinghand', 'move gastroacid'));
	});

	it('should cause the Desolate Land weather to fade if its ability is changed and no other Desolate Land Pokemon are active', function () {
		battle = common.createBattle([[
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
		], [
			{species: "Lugia", ability: 'pressure', moves: ['entrainment']},
		]]);
		assert.sets(() => battle.field.isWeather('desolateland'), false, () => battle.makeChoices('move helpinghand', 'move entrainment'));
	});

	it('should fade after being forced out via Roar', function () {
		battle = common.createBattle([[
			{species: 'Groudon', item: "Red Orb", moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', moves: ['roar']},
		]]);
		battle.makeChoices();
		assert.false(battle.field.isWeather('desolateland'));
	});

	it(`should cause Water-type Natural Gift to fail`, function () {
		battle = common.createBattle([[
			{species: 'Groudon', item: 'Red Orb', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', moves: ['naturalgift']},
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
	});
});
