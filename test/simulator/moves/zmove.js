'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Z-Moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not use the base move's priority if it is a damaging move`, function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Kecleon', ability: 'colorchange', item: 'ghostiumz', moves: ['shadowsneak']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Starmie', ability: 'naturalcure', moves: ['reflecttype']}]);
		battle.p1.chooseMove('shadowsneak', 0, 'zmove').foe.chooseDefault();
		assert.fullHP(battle.p2.active[0]);
	});
});
