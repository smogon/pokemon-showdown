'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Heavy Duty Boots", function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should prevent entry hazards from affecting the holder", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			{species: 'Magikarp', ability: 'swiftswim', item: 'heavydutyboots', moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Cloyster', ability: 'shellarmor', moves: ['spikes', 'toxicspikes']},
		]});
		battle.makeChoices('auto', 'move spikes');
		battle.makeChoices('auto', 'move toxicspikes');
		battle.makeChoices('switch 2', 'auto');
		assert.fullHP(battle.p1.active[0]);
		assert.notEqual(battle.p1.active[0].status, 'psn');
	});
});
