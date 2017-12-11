'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Z-Moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should use the base move's type if it is a damaging move", function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Kecleon', ability: 'colorchange', item: 'normaliumz', moves: ['hiddenpower']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Gengar', ability: 'levitate', moves: ['calmmind']}]);
		battle.makeChoices("move hiddenpower zmove", "move calmmind");
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not use the base move's priority if it is a damaging move`, function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Kecleon', ability: 'colorchange', item: 'ghostiumz', moves: ['shadowsneak']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Starmie', ability: 'naturalcure', moves: ['reflecttype']}]);
		battle.makeChoices("move shadowsneak zmove", "move reflecttype");
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should deal reduced damage to protected targets`, function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mimikyu', ability: 'disguise', item: 'ghostiumz', moves: ['shadowsneak']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Espeon', ability: 'magicbounce', moves: ['protect']}]);
		battle.makeChoices("move shadowsneak zmove", "move protect");
		assert.false.fainted(battle.p2.active[0]);
		assert.false.fullHP(battle.p2.active[0]);
	});
});
