'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Primordial Sea', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate the Primordial Sea weather upon switch-in', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Abra", ability: 'magicguard', moves: ['teleport']}]);
		assert.ok(battle.isWeather('primordialsea'));
	});

	it('should increase the damage (not the basePower) of Water-type attacks', function () {
		battle = common.createBattle();
		battle.randomizer = dmg => dmg; // max damage
		battle.join('p1', 'Guest 1', 1, [{species: 'Kyogre', ability: 'primordialsea', moves: ['waterpledge']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Blastoise', ability: 'torrent', moves: ['splash']}]);
		const attacker = battle.p1.active[0];
		const defender = battle.p2.active[0];
		assert.hurtsBy(defender, 104, () => battle.makeChoices('move waterpledge', 'move splash'));
		const move = Dex.getMove('waterpledge');
		const basePower = battle.runEvent('BasePower', attacker, defender, move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should cause Fire-type attacks to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charizard", ability: 'blaze', moves: ['flamethrower']}]);
		battle.makeChoices('move helpinghand', 'move flamethrower');
		assert.fullHP(battle.p1.active[0]);
	});

	it('should not cause Fire-type Status moves to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charizard", ability: 'noguard', moves: ['willowisp']}]);
		assert.sets(() => battle.p1.active[0].status, 'brn', () => battle.makeChoices('move helpinghand', 'move willowisp'));
	});

	it('should prevent moves and abilities from setting the weather to Sunny Day, Rain Dance, Sandstorm, or Hail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Abra", ability: 'magicguard', moves: ['teleport']},
			{species: "Kyogre", ability: 'drizzle', moves: ['raindance']},
			{species: "Groudon", ability: 'drought', moves: ['sunnyday']},
			{species: "Tyranitar", ability: 'sandstream', moves: ['sandstorm']},
			{species: "Abomasnow", ability: 'snowwarning', moves: ['hail']},
		]);
		for (let i = 2; i <= 5; i++) {
			battle.makeChoices('move helpinghand', 'move ' + i);
			assert.ok(battle.isWeather('primordialsea'));
			battle.makeChoices('move helpinghand', 'move 1');
			assert.ok(battle.isWeather('primordialsea'));
		}
	});

	it('should be treated as Rain Dance for any forme, move or ability that requires it', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['sonicboom']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Castform", ability: 'forecast', moves: ['weatherball']},
			{species: "Kingdra", ability: 'swiftswim', moves: ['focusenergy']},
			{species: "Ludicolo", ability: 'raindish', moves: ['watersport']},
			{species: "Toxicroak", ability: 'dryskin', moves: ['bulkup']},
			{species: "Manaphy", ability: 'hydration', item: 'laggingtail', moves: ['rest']},
		]);
		battle.onEvent('Hit', battle.getFormat(), (target, pokemon, move) => {
			if (move.id === 'weatherball') {
				assert.strictEqual(move.type, 'Water');
			}
		});
		battle.makeChoices('move sonicboom', 'move weatherball');
		assert.species(p2.active[0], 'Castform-Rainy');
		battle.makeChoices('move sonicboom', 'switch 2');
		assert.strictEqual(battle.p2.active[0].getStat('spe'), 2 * battle.p2.active[0].stats['spe'], "Kingdra's Speed should be doubled by Swift Swim");
		battle.makeChoices('move sonicboom', 'switch 3');
		assert.notStrictEqual(battle.p2.active[0].maxhp - battle.p2.active[0].hp, 20);
		battle.makeChoices('move sonicboom', 'switch 4');
		assert.notStrictEqual(battle.p2.active[0].maxhp - battle.p2.active[0].hp, 20);
		battle.makeChoices('move sonicboom', 'switch 5');
		battle.makeChoices('move sonicboom', 'move rest');
		assert.strictEqual(battle.p2.active[0].status, '');
	});

	it('should cause the Primordial Sea weather to fade if it switches out and no other Primordial Sea Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['roost']}]);
		assert.sets(() => battle.isWeather('primordialsea'), false, () => battle.makeChoices('switch 2', 'move roost'));
	});

	it('should not cause the Primordial Sea weather to fade if it switches out and another Primordial Sea Pokemon is active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['bulkup']}]);
		assert.constant(() => battle.isWeather('primordialsea'), () => battle.makeChoices('switch 2', 'move bulkup'));
	});

	it('should cause the Primordial Sea weather to fade if its ability is suppressed and no other Primordial Sea Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['gastroacid']}]);
		assert.sets(() => battle.isWeather('primordialsea'), false, () => battle.makeChoices('move helpinghand', 'move gastroacid'));
	});

	it('should not cause the Primordial Sea weather to fade if its ability is suppressed and another Primordial Sea Pokemon is active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['gastroacid']}]);
		assert.constant(() => battle.isWeather('primordialsea'), () => battle.makeChoices('move helpinghand', 'move gastroacid'));
	});

	it('should cause the Primordial Sea weather to fade if its ability is changed and no other Primordial Sea Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['entrainment']}]);
		assert.sets(() => battle.isWeather('primordialsea'), false, () => battle.makeChoices('move helpinghand', 'move entrainment'));
	});
});
