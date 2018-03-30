'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const Sim = require('./../../../sim');

let battle;

describe('Roost', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should fail if the user is at max HP', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Clefable", item: 'leftovers', ability: 'unaware', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dragonite", item: 'laggingtail', ability: 'multiscale', moves: ['roost']}]);
		battle.makeChoices('move calmmind', 'move roost');
		assert.strictEqual(battle.log[battle.lastMoveLine + 1], '|-fail|' + battle.p2.active[0]);
	});

	it('should heal the user', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Clefable", ability: 'unaware', moves: ['calmmind', 'hiddenpowergrass']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dragonite", ability: 'multiscale', moves: ['roost', 'dragondance']}]);
		battle.makeChoices('move hiddenpowergrass', 'move dragondance');
		battle.makeChoices('move calmmind', 'move roost');
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should suppress user\'s current Flying type if succesful', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Aggron", item: 'leftovers', ability: 'sturdy', moves: ['mudslap', 'hiddenpowergrass']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Aerodactyl", item: 'focussash', ability: 'wonderguard', moves: ['roost', 'doubleedge']}]);

		battle.makeChoices('move mudslap', 'move roost');
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp); // Immune to Mud Slap

		// Ensure that Aerodactyl has some damage
		battle.makeChoices('move mudslap', 'move doubleedge');

		battle.makeChoices('move mudslap', 'move roost');
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp); // Hit super-effectively by Mud Slap

		// Ensure that Aerodactyl has some damage
		battle.makeChoices('move mudslap', 'move doubleedge');

		battle.makeChoices('move hiddenpowergrasss', 'move roost');
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp); // Hit super-effectively by HP Grass
	});

	it('should suppress Flying type yet to be acquired this turn', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.join('p1', 'Guest 1', 1, [
			{species: "Pidgeot", item: 'laggingtail', ability: 'victorystar', moves: ['aircutter']},
			{species: "Gligar", item: 'laggingtail', ability: 'immunity', moves: ['earthquake']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Kecleon", ability: 'colorchange', moves: ['roost']},
			{species: "Venusaur", ability: 'chlorophyll', moves: ['earthquake']},
		]);

		let hitCount = 0;
		battle.p2.active[0].damage = function (...args) {
			hitCount++;
			return Sim.Pokemon.prototype.damage.apply(this, args);
		};

		battle.makeChoices('move aircutter, move earthquake', 'move roost, move earthquake');
		assert.strictEqual(hitCount, 3);
	});

	it('should treat a pure Flying pokémon as Normal type', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Tornadus", item: 'focussash', ability: 'prankster', moves: ['roost']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gastly", item: 'laggingtail', ability: 'levitate', moves: ['astonish']}]);
		battle.makeChoices('move roost', 'move astonish');
		battle.makeChoices('move roost', 'move astonish');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp); // Immune to Astonish
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
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp); // Affected by Astonish

		battle.makeChoices('move roost', 'move earthpower');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp); // Affected by Earth Power
	});
});
