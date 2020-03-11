'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('G-Max Volcalith', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not damage Rock-types', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Coalossal-Gmax', moves: ['rockthrow']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Boldore', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move rockthrow 1 dynamax, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert.fullHP(battle.p2.active[1]);
	});

	it('should deal damage for four turns, including the fourth turn', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Coalossal-Gmax', moves: ['rockthrow', 'sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Boldore', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move rockthrow 2 dynamax, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp - (Math.floor(battle.p2.active[0].maxhp / 6) * 4));
	});
});
