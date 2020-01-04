'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Dynamax Cannon', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should hit all enemy targets in doubles', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Eternatus', ability: 'pressure', moves: ['dynamaxcannon']},
			{species: 'Clefairy', ability: 'pressure', moves: ['softboiled']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Perrserker', ability: 'battlearmor', moves: ['honeclaws']},
			{species: 'Perrserker', ability: 'battlearmor', moves: ['honeclaws']},
		]});
		battle.makeChoices('move dynamaxcannon, move softboiled', 'move honeclaws, move honeclaws');
		assert.false.fullHP(battle.p2.active[0]);
		assert.false.fullHP(battle.p2.active[1]);
	});
});
