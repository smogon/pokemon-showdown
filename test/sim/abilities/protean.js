'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Protean', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change the user\'s type when using a move', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Cinderace", ability: 'protean', moves: ['highjumpkick']}]});
		battle.setPlayer('p2', {team: [{species: "Gengar", moves: ['sleeptalk']}]});
		battle.makeChoices('move highjumpkick', 'move sleeptalk');
		assert(battle.p1.active[0].hasType('Fighting'));
	});

	it.skip(`should activate on both turns of a charge move`, function () {
		battle = common.createBattle([[
			{species: "Wynaut", ability: 'protean', moves: ['bounce']},
		], [
			{species: "Helioptile", ability: 'noguard', moves: ['soak']},
		]]);
		const wynaut = battle.p1.active[0];

		//Turn 1 of Bounce
		battle.makeChoices();
		assert.equal(wynaut.getTypes().join('/'), 'Flying');

		//Turn 2 of Bounce
		battle.makeChoices();
		assert.equal(wynaut.getTypes().join('/'), 'Flying');
	});

	it('should not change the user\'s type when using Fling with no item', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Kecleon", ability: 'protean', moves: ['fling']}]});
		battle.setPlayer('p2', {team: [{species: "Wobbuffet", moves: ['counter']}]});
		battle.makeChoices('move fling', 'move counter');
		assert(battle.p1.active[0].hasType('Normal'));
	});
});
