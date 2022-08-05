'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Terastallization", function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip('should change the user\'s type to its Tera type after terastallizing', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Ampharos', ability: 'static', moves: ['voltswitch', 'dragonpulse'], terastalType: 'Dragon'},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Ampharos', ability: 'static', moves: ['voltswitch'], terastalType: 'Dragon'},
		]});
		battle.makeChoices('move dragonpulse terastallize', 'auto');
		assert.equal(battle.p1.active[0].getTypes().join('/'), 'Dragon');
	});
});
