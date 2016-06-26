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
		assert.hurtsBy(defender, 104, () => battle.commitDecisions());
		const move = Tools.getMove('waterpledge');
		const basePower = battle.runEvent('BasePower', attacker, defender, move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should cause Fire-type attacks to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charizard", ability: 'blaze', moves: ['flamethrower']}]);
		battle.commitDecisions();
		assert.fullHP(battle.p1.active[0]);
	});

	it('should not cause Fire-type Status moves to fail', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charizard", ability: 'noguard', moves: ['willowisp']}]);
		assert.sets(() => battle.p1.active[0].status, 'brn', () => battle.commitDecisions());
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
			battle.p2.chooseSwitch(i).foe.chooseDefault();
			assert.ok(battle.isWeather('primordialsea'));
			battle.commitDecisions();
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
		battle.on('Hit', battle.getFormat(), (target, pokemon, move) => {
			if (move.id === 'weatherball') {
				assert.strictEqual(move.type, 'Water');
			}
		});
		battle.commitDecisions();
		assert.species(p2.active[0], 'Castform-Rainy');
		p2.chooseSwitch(2).foe.chooseDefault();
		assert.strictEqual(battle.p2.active[0].getStat('spe'), 2 * battle.p2.active[0].stats['spe'], "Kingdra's Speed should be doubled by Swift Swim");
		p2.chooseSwitch(3).foe.chooseMove(1);
		assert.notStrictEqual(battle.p2.active[0].maxhp - battle.p2.active[0].hp, 20);
		p2.chooseSwitch(4).foe.chooseMove(1);
		assert.notStrictEqual(battle.p2.active[0].maxhp - battle.p2.active[0].hp, 20);
		p2.chooseSwitch(5).foe.chooseDefault();
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, '');
	});

	it('should cause the Primordial Sea weather to fade if it switches out and no other Primordial Sea Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['roost']}]);
		battle.p1.chooseSwitch(2);
		assert.sets(() => battle.isWeather('primordialsea'), false, () => battle.commitDecisions());
	});

	it('should not cause the Primordial Sea weather to fade if it switches out and another Primordial Sea Pokemon is active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['bulkup']}]);
		battle.p1.chooseSwitch(2);
		assert.constant(() => battle.isWeather('primordialsea'), () => battle.commitDecisions());
	});

	it('should cause the Primordial Sea weather to fade if its ability is suppressed and no other Primordial Sea Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['gastroacid']}]);
		assert.sets(() => battle.isWeather('primordialsea'), false, () => battle.commitDecisions());
	});

	it('should not cause the Primordial Sea weather to fade if its ability is suppressed and another Primordial Sea Pokemon is active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['gastroacid']}]);
		assert.constant(() => battle.isWeather('primordialsea'), () => battle.commitDecisions());
	});

	it('should cause the Primordial Sea weather to fade if its ability is changed and no other Primordial Sea Pokemon are active', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['entrainment']}]);
		assert.sets(() => battle.isWeather('primordialsea'), false, () => battle.commitDecisions());
	});
});
