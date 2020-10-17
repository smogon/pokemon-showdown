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
		battle.setPlayer('p1', {team: [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]});
		battle.setPlayer('p2', {team: [{species: "Tropius", ability: 'harvest', moves: ['synthesis']}]});
		battle.makeChoices('move thousandarrows', 'move synthesis');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('move earthquake', 'move synthesis');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should ignore type effectiveness on the first hit against Flying-type Pokemon', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows']}]});
		battle.setPlayer('p2', {team: [{species: "Ho-Oh", ability: 'shellarmor', item: 'weaknesspolicy', moves: ['recover']}]});
		battle.makeChoices('move thousandarrows', 'move recover');
		assert.equal(battle.p2.active[0].boosts.atk, 0);
		assert.equal(battle.p2.active[0].boosts.spa, 0);
		battle.makeChoices('move thousandarrows', 'move recover');
		assert.equal(battle.p2.active[0].boosts.atk, 2);
		assert.equal(battle.p2.active[0].boosts.spa, 2);
	});

	it('should not ignore type effectiveness on the first hit against Flying-type Pokemon with Ring Target', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Zygarde", level: 10, ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows']}]});
		battle.setPlayer('p2', {team: [{species: "Ho-Oh", ability: 'wonderguard', item: 'ringtarget', moves: ['recover']}]});
		battle.makeChoices('move thousandarrows', 'move recover');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not ground or deal neutral damage to Flying-type Pokemon holding an Iron Ball', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Zygarde", level: 10, ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'mudslap']}]});
		battle.setPlayer('p2', {team: [{species: "Ho-Oh", ability: 'shellarmor', item: 'ironball', moves: ['recover', 'trick']}]});
		battle.makeChoices('move thousandarrows', 'move recover');
		assert(!battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		const hp = battle.p2.active[0].hp;
		assert.notEqual(hp, battle.p2.active[0].maxhp);
		battle.makeChoices('move mudslap', 'move trick');
		assert.equal(hp, battle.p2.active[0].hp);
	});

	it('should not ground or deal neutral damage to Flying-type Pokemon affected by Gravity', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Zygarde", level: 10, ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: "Ho-Oh", ability: 'shellarmor', moves: ['recover', 'gravity']}]});
		battle.makeChoices('move sleeptalk', 'move gravity');
		// During Gravity, Thousand Arrows can be super effective but once it ends has to be neutral for one hit
		while (battle.field.getPseudoWeather('gravity')) {
			battle.makeChoices('move thousandarrows', 'move recover');
			assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		}
		battle.makeChoices('move thousandarrows', 'move recover');
		assert(!battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		battle.makeChoices('move thousandarrows', 'move recover');
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it('should hit Pokemon with Levitate and remove their Ground immunity', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]});
		battle.setPlayer('p2', {team: [{species: "Cresselia", ability: 'levitate', moves: ['recover']}]});
		battle.makeChoices('move thousandarrows', 'move recover');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('move earthquake', 'move recover');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should hit non-Flying-type Pokemon with Levitate with standard type effectiveness', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Zygarde", ability: 'aurabreak', moves: ['thousandarrows', 'earthquake']}]});
		battle.setPlayer('p2', {team: [{species: "Eelektross", ability: 'levitate', item: 'weaknesspolicy', moves: ['thunderwave']}]});
		battle.makeChoices('move thousandarrows', 'move thunderwave');
		assert.equal(battle.p2.active[0].boosts.atk, 2);
		assert.equal(battle.p2.active[0].boosts.spa, 2);
	});

	it('should hit Pokemon with Air Balloon', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]});
		battle.setPlayer('p2', {team: [{species: "Donphan", ability: 'sturdy', item: 'airballoon', moves: ['stealthrock']}]});
		battle.makeChoices('move thousandarrows', 'move stealthrock');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('move earthquake', 'move stealthrock');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not hit Ground-type Pokemon when affected by Electrify', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]});
		battle.setPlayer('p2', {team: [{species: "Stunfisk", ability: 'limber', moves: ['electrify']}]});
		battle.makeChoices('move thousandarrows', 'move electrify');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not hit Ghost-type Pokemon when affected by Normalize', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Zygarde", ability: 'normalize', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]});
		battle.setPlayer('p2', {team: [{species: "Dusknoir", ability: 'pressure', moves: ['haze']}]});
		battle.makeChoices('move thousandarrows', 'move haze');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});
});
