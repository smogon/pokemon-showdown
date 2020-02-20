'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Suction Cups', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent the user from being forced out', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Shuckle', ability: 'suctioncups', moves: ['rapidspin']},
			{species: 'Forretress', ability: 'sturdy', moves: ['rapidspin']},
		]});
		battle.setPlayer('p2', {team: [{species: 'Smeargle', ability: 'noguard', item: 'redcard', moves: ['healpulse', 'dragontail', 'circlethrow', 'roar']}]});
		const [cupsMon, redCardHolder] = [battle.p1.active[0], battle.p2.active[0]];
		battle.makeChoices('move rapidspin', 'move healpulse');
		assert.false.holdsItem(redCardHolder, "Red Card should activate");
		assert.equal(cupsMon, battle.p1.active[0]);
		for (let i = 2; i <= 4; i++) {
			battle.makeChoices('move rapidspin', 'move ' + i);
			assert.equal(cupsMon, battle.p1.active[0]);
		}
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Pangoro', ability: 'moldbreaker', moves: ['circlethrow']}]});
		battle.setPlayer('p2', {team: [
			{species: 'Shuckle', ability: 'suctioncups', item: 'ironball', moves: ['rest']},
			{species: 'Forretress', ability: 'sturdy', moves: ['rapidspin']},
		]});
		battle.makeChoices('move circlethrow', 'move rest');
		assert.species(battle.p2.active[0], 'Forretress');
	});
});
