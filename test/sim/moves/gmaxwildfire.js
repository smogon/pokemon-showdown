'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('G-Max Wildfire', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not damage Fire-types', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Charizard', moves: ['ember'], gigantamax: true},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Flareon', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move ember 1 dynamax, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert.fullHP(battle.p2.active[1]);
	});

	it('should deal damage for four turns, including the fourth turn', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Charizard', moves: ['ember', 'sleeptalk'], gigantamax: true},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Flareon', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move ember 2 dynamax, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp - (Math.floor(battle.p2.active[0].maxhp / 6) * 4));
	});
});
