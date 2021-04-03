'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Free-for-all', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should support forfeiting`, function () {
		battle = common.createBattle({gameType: 'freeforall'}, [[
			{species: 'wynaut', moves: ['vitalthrow']},
		], [
			{species: 'scyther', moves: ['sleeptalk']},
		], [
			{species: 'scyther', moves: ['sleeptalk', 'uturn']},
			{species: 'wynaut', moves: ['vitalthrow']},
		], [
			{species: 'scyther', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.lose('p2');
		assert(battle.p2.activeRequest.wait);
		battle.makeChoices('auto', '', 'move uturn', 'auto');
		battle.lose('p3');
		battle.makeChoices();
		assert.equal(battle.turn, 4);
	});

	it(`moves should not redirect to another random target if the intended one is fainted`, function () {
		battle = common.createBattle({gameType: 'freeforall'}, [[
			{species: 'Calyrex', moves: ['sleeptalk']},
		], [
			{species: 'Victini', ability: 'Victory Star', moves: ['vcreate']},
		], [
			{species: 'Chansey', moves: ['sleeptalk']},
		], [
			{species: 'Tyrunt', moves: ['crunch']},
		]]);
		battle.makeChoices('auto', 'move vcreate 1', 'auto', 'move crunch 1');
		assert.fainted(battle.sides[0].active[0]);
		assert.fullHP(battle.sides[1].active[0]);
		assert.fullHP(battle.sides[2].active[0]);
	});
});
