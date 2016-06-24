'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Desolate Land', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate the Desolate Land weather upon switch-in', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Abra", ability: 'magicguard', moves: ['teleport']}]);
		assert.ok(battle.isWeather('desolateland'));
	});

	it('should increase the damage (not the basePower) of Fire-type attacks', function () {
		battle = common.createBattle();
		battle.randomizer = dmg => dmg; // max damage
		battle.join('p1', 'Guest 1', 1, [{species: 'Ninetales', ability: 'desolateland', moves: ['incinerate']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Cryogonal', ability: 'levitate', moves: ['splash']}]);
		const attacker = battle.p1.active[0];
		const defender = battle.p2.active[0];
		assert.hurtsBy(defender, 152, () => battle.commitDecisions());
		const move = Tools.getMove('incinerate');
		const basePower = battle.runEvent('BasePower', attacker, defender, move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should cause Water-type attacks to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blastoise", ability: 'torrent', moves: ['surf']}]);
		battle.commitDecisions();
		assert.fullHP(battle.p1.active[0]);
	});

	it('should not cause Water-type Status moves to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blastoise", ability: 'torrent', moves: ['soak']}]);
		const soakTarget = battle.p1.active[0];
		assert.sets(() => soakTarget.getTypes().join('/'), 'Water', () => battle.commitDecisions());
	});

	it('should prevent moves and abilities from setting the weather to Sunny Day, Rain Dance, Sandstorm, or Hail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Abra", ability: 'magicguard', moves: ['teleport']},
			{species: "Kyogre", ability: 'drizzle', moves: ['raindance']},
			{species: "Groudon", ability: 'drought', moves: ['sunnyday']},
			{species: "Tyranitar", ability: 'sandstream', moves: ['sandstorm']},
			{species: "Abomasnow", ability: 'snowwarning', moves: ['hail']},
		]);
		for (let i = 2; i <= 5; i++) {
			battle.p2.chooseSwitch(i).foe.chooseDefault();
			assert.ok(battle.isWeather('desolateland'));
			battle.commitDecisions();
			assert.ok(battle.isWeather('desolateland'));
		}
	});

	it('should be treated as Sunny Day for any forme, move or ability that requires it', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand', 'solarbeam']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Castform", ability: 'forecast', moves: ['weatherball']},
			{species: "Cherrim", ability: 'flowergift', moves: ['growth']},
			{species: "Charizard", ability: 'solarpower', moves: ['roost']},
			{species: "Venusaur", ability: 'chlorophyll', moves: ['growth']},
			{species: "Toxicroak", ability: 'dryskin', moves: ['bulkup']},
		]);
		battle.on('Hit', battle.getFormat(), (target, pokemon, move) => {
			if (move.id === 'weatherball') {
				assert.strictEqual(move.type, 'Fire');
			}
		});
		battle.commitDecisions();
		assert.species(p2.active[0], 'Castform-Sunny');
		p2.chooseSwitch(2).foe.chooseDefault();
		assert.species(p2.active[0], 'Cherrim-Sunshine');
		p2.chooseSwitch(3).foe.chooseDefault();
		assert.false.fullHP(p2.active[0], "Charizard should be hurt by Solar Power");
		p1.chooseMove(2).foe.chooseSwitch(4);
		assert.strictEqual(p2.active[0].getStat('spe'), 2 * p2.active[0].stats['spe'], "Venusaur's speed should be doubled by Chlorophyll");
		assert.false.fullHP(p2.active[0], "Solar Beam should skip its charge turn");
		p2.chooseSwitch(5).foe.chooseDefault();
		assert.false.fullHP(p2.active[0], "Toxicroak should be hurt by Dry Skin");
	});

	it('should cause the Desolate Land weather to fade if it switches out and no other Desolate Land Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['roost']}]);
		battle.p1.chooseSwitch(2);
		assert.sets(() => battle.isWeather('desolateland'), false, () => battle.commitDecisions());
	});

	it('should not cause the Desolate Land weather to fade if it switches out and another Desolate Land Pokemon is active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Groudon", ability: 'desolateland', moves: ['bulkup']}]);
		battle.p2.chooseSwitch(2);
		assert.constant(() => battle.isWeather('desolateland'), () => battle.commitDecisions());
	});

	it('should cause the Desolate Land weather to fade if its ability is suppressed and no other Desolate Land Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['gastroacid']}]);
		assert.sets(() => battle.isWeather('desolateland'), false, () => battle.commitDecisions());
	});

	it('should not cause the Desolate Land weather to fade if its ability is suppressed and another Desolate Land Pokemon is active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Groudon", ability: 'desolateland', moves: ['gastroacid']}]);
		assert.constant(() => battle.isWeather('desolateland'), () => battle.commitDecisions());
	});

	it('should cause the Desolate Land weather to fade if its ability is changed and no other Desolate Land Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['entrainment']}]);
		assert.sets(() => battle.isWeather('desolateland'), false, () => battle.commitDecisions());
	});
});
