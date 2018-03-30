'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Reflect Type', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should fail when used against a Pokemon whose type is "???"', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Arcanine', ability: 'intimidate', moves: ['burnup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Latias', ability: 'levitate', item: 'laggingtail', moves: ['reflecttype']}]);
		assert.constant(() => battle.p2.active[0].getTypes(), () => battle.makeChoices('move burnup', 'move reflecttype'));
	});

	it('should ignore the "???" type when used against a Pokemon whose type contains "???" and a non-added type', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Latias', ability: 'levitate', item: 'laggingtail', moves: ['reflecttype', 'trickortreat']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Moltres', ability: 'pressure', moves: ['burnup']}]);
		battle.makeChoices('move reflecttype', 'move burnup');
		assert.strictEqual(battle.p1.active[0].getTypes().join('/'), 'Flying');
		battle.makeChoices('move trickortreat', 'move burnup');
		battle.makeChoices('move reflecttype', 'move burnup');
		assert.strictEqual(battle.p1.active[0].getTypes().join('/'), 'Flying/Ghost');
	});

	it('should turn the "???" type into "Normal" when used against a Pokemon whose type is only "???" and an added type', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Latias', ability: 'levitate', item: 'laggingtail', moves: ['reflecttype', 'trickortreat']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Arcanine', ability: 'intimidate', moves: ['burnup']}]);
		battle.makeChoices('move trickortreat', 'move burnup');
		battle.makeChoices('move reflecttype', 'move burnup');
		assert.strictEqual(battle.p1.active[0].getTypes().join('/'), 'Normal/Ghost');
	});
});
