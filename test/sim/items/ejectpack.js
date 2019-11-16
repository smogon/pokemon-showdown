'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Eject Pack", function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should switch out the holder when its stats are lowered", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Machop', ability: 'noguard', moves: ['leer']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Magikarp', ability: 'swiftswim', item: 'ejectpack', moves: ['splash']},
		]});
		battle.makeChoices();
		assert.strictEquals(battle.p2.requestState, 'switch');
	});
});
