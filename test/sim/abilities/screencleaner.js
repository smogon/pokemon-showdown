'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Screen Cleaner", function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should remove screens from both sides when sent out", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Mew', ability: 'synchronize', moves: ['reflect']},
			{species: 'Mr. Mime-Galar', ability: 'screencleaner', moves: ['psychic']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Mew', ability: 'synchronize', moves: ['lightscreen', 'reflecttype']},
		]});
		battle.makeChoices('move reflect', 'move lightscreen');
		battle.makeChoices('switch 2', 'move reflecttype');
		assert(!battle.p1.sideConditions.reflect);
		assert(!battle.p2.sideConditions.lightscreen);
	});
});
