'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Thousand Arrows', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should hit Flying-type Pokemon and remove their Ground immunity', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Tropius", ability: 'harvest', moves: ['synthesis']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p1', 'move earthquake');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should ignore type effectiveness on the first hit against Flying-type Pokemon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Ho-Oh", ability: 'shellarmor', item: 'weaknesspolicy', moves: ['recover']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts.atk, 0);
		assert.strictEqual(battle.p2.active[0].boosts.spa, 0);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts.atk, 2);
		assert.strictEqual(battle.p2.active[0].boosts.spa, 2);
	});

	it('should not ignore type effectiveness on the first hit against Flying-type Pokemon with Ring Target', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", level: 10, ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Ho-Oh", ability: 'wonderguard', item: 'ringtarget', moves: ['recover']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not ground or deal neutral damage to Flying-type Pokemon holding an Iron Ball', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", level: 10, ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'mudslap']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Ho-Oh", ability: 'shellarmor', item: 'ironball', moves: ['recover', 'trick']}]);
		battle.commitDecisions();
		assert.ok(!battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		let hp = battle.p2.active[0].hp;
		assert.notStrictEqual(hp, battle.p2.active[0].maxhp);
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(hp, battle.p2.active[0].hp);
	});

	it('should not ground or deal neutral damage to Flying-type Pokemon affected by Gravity', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", level: 10, ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Ho-Oh", ability: 'shellarmor', moves: ['recover', 'gravity']}]);
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		// During Gravity, Thousand Arrows can be super effective but once it ends has to be neutral for one hit
		while (battle.getPseudoWeather('gravity')) {
			battle.commitDecisions();
			assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		}
		battle.commitDecisions();
		assert.ok(!battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		battle.commitDecisions();
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it('should hit Pokemon with Levitate and remove their Ground immunity', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Cresselia", ability: 'levitate', moves: ['recover']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p1', 'move earthquake');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should hit non-Flying-type Pokemon with Levitate with standard type effectiveness', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Eelektross", ability: 'levitate', item: 'weaknesspolicy', moves: ['thunderwave']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts.atk, 2);
		assert.strictEqual(battle.p2.active[0].boosts.spa, 2);
	});

	it('should hit Pokemon with Air Balloon', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Donphan", ability: 'sturdy', item: 'airballoon', moves: ['stealthrock']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p1', 'move earthquake');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not hit Ground-type Pokemon when affected by Electrify', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Stunfisk", ability: 'limber', moves: ['electrify']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not hit Ghost-type Pokemon when affected by Normalize', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'normalize', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dusknoir", ability: 'pressure', moves: ['haze']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});
});
