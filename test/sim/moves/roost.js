'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const Sim = require('./../../../dist/sim');

let battle;

describe('Roost', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should fail if the user is at max HP', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Clefable", item: 'leftovers', ability: 'unaware', moves: ['calmmind']}]});
		battle.setPlayer('p2', {team: [{species: "Dragonite", item: 'laggingtail', ability: 'multiscale', moves: ['roost']}]});
		battle.makeChoices('move calmmind', 'move roost');
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-fail|'));
	});

	it('should heal the user', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Clefable", ability: 'unaware', moves: ['calmmind', 'hiddenpowergrass']}]});
		battle.setPlayer('p2', {team: [{species: "Dragonite", ability: 'multiscale', moves: ['roost', 'dragondance']}]});
		battle.makeChoices('move hiddenpowergrass', 'move dragondance');
		battle.makeChoices('move calmmind', 'move roost');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should suppress user\'s current Flying type if succesful', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Aggron", item: 'leftovers', ability: 'sturdy', moves: ['mudslap', 'hiddenpowergrass']}]});
		battle.setPlayer('p2', {team: [{species: "Aerodactyl", item: 'focussash', ability: 'wonderguard', moves: ['roost', 'doubleedge']}]});

		battle.makeChoices('move mudslap', 'move roost');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp); // Immune to Mud Slap

		// Ensure that Aerodactyl has some damage
		battle.makeChoices('move mudslap', 'move doubleedge');

		battle.makeChoices('move mudslap', 'move roost');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp); // Hit super-effectively by Mud Slap

		// Ensure that Aerodactyl has some damage
		battle.makeChoices('move mudslap', 'move doubleedge');

		battle.makeChoices('move hiddenpowergrasss', 'move roost');
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp); // Hit super-effectively by HP Grass
	});

	it('should suppress Flying type yet to be acquired this turn', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Pidgeot", item: 'laggingtail', ability: 'victorystar', moves: ['aircutter']},
			{species: "Gligar", item: 'laggingtail', ability: 'immunity', moves: ['earthquake']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Kecleon", ability: 'colorchange', moves: ['roost']},
			{species: "Venusaur", ability: 'chlorophyll', moves: ['earthquake']},
		]});

		let hitCount = 0;
		battle.p2.active[0].damage = function (...args) {
			hitCount++;
			return Sim.Pokemon.prototype.damage.apply(this, args);
		};

		battle.makeChoices('move aircutter, move earthquake', 'move roost, move earthquake');
		assert.equal(hitCount, 3);
	});

	it('should treat a pure Flying pokémon as Normal type', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Tornadus", item: 'focussash', ability: 'prankster', moves: ['roost']}]});
		battle.setPlayer('p2', {team: [{species: "Gastly", item: 'laggingtail', ability: 'levitate', moves: ['astonish']}]});
		battle.makeChoices('move roost', 'move astonish');
		battle.makeChoices('move roost', 'move astonish');
		assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp); // Immune to Astonish
	});

	it('should not remove Flying type during Terastallization', function () {
		battle = common.createBattle([[
			{species: "Dudunsparce", ability: "runaway", moves: ['sleeptalk', 'roost'], teraType: "Flying"},
		], [
			{species: "Chansey", ability: "naturalcure", moves: ['earthquake']},
		]]);
		battle.makeChoices();
		battle.makeChoices('move roost terastallize', 'auto');
		assert.fullHP(battle.p1.active[0]);
	});
});

describe('Roost - DPP', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should treat a pure Flying pokémon as `???` type', function () {
		battle = common.gen(4).createBattle([
			[{species: "Arceus-Flying", item: 'skyplate', ability: 'multitype', moves: ['roost']}],
			[{species: "Gastly", item: 'laggingtail', ability: 'levitate', moves: ['astonish', 'earthpower']}],
		]);

		battle.makeChoices('move roost', 'move astonish');
		battle.makeChoices('move roost', 'move astonish');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp); // Affected by Astonish

		battle.makeChoices('move roost', 'move earthpower');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp); // Affected by Earth Power
	});
});
