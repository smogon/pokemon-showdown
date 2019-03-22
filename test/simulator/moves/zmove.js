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
		battle.setPlayer('p1', {team: [{species: 'Kecleon', ability: 'colorchange', item: 'normaliumz', moves: ['hiddenpower']}]});
		battle.setPlayer('p2', {team: [{species: 'Gengar', ability: 'levitate', moves: ['calmmind']}]});
		battle.makeChoices('move hiddenpower zmove', 'move calmmind');
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not use the base move's priority if it is a damaging move`, function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Kecleon', ability: 'colorchange', item: 'ghostiumz', moves: ['shadowsneak']}]});
		battle.setPlayer('p2', {team: [{species: 'Starmie', ability: 'naturalcure', moves: ['reflecttype']}]});
		battle.makeChoices('move shadowsneak zmove', 'move reflecttype');
		assert.fullHP(battle.p2.active[0]);
	});
});
