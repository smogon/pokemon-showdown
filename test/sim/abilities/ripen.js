'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Ripen", function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should double healing from berries", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Appletun', ability: 'ripen', item: 'sitrusberry', moves: ['growth'], ivs: {hp: 0}},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Skwovet', ability: 'gluttony', moves: ['superfang']},
		]});
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]); // Damaged by 50% + healed 50% = 100%
	});
});
