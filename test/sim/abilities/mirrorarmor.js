'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Mirror Armor", function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should bounce boosts back to the source", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Corviknight', ability: 'mirrorarmor', moves: ['endure']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Machop', ability: 'noguard', moves: ['rocktomb', 'leer']},
		]});
		battle.makeChoices('auto', 'move rocktomb');
		const corv = battle.p1.active[0];
		const machop = battle.p2.active[0];
		assert.statStage(corv, 'spe', 0);
		assert.statStage(machop, 'spe', -1);
		battle.makeChoices('auto', 'move leer');
		assert.statStage(corv, 'def', 0);
		assert.statStage(machop, 'def', -1);
	});
});
