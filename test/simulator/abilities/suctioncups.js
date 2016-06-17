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
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: 'Shuckle', ability: 'suctioncups', moves: ['rapidspin']},
			{species: 'Forretress', ability: 'sturdy', moves: ['rapidspin']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: 'Smeargle', ability: 'noguard', item: 'redcard', moves: ['healpulse', 'dragontail', 'circlethrow', 'roar']}]);
		battle.commitDecisions();
		assert.false.holdsItem(p2.active[0], "Red Card should activate");
		assert.species(p1.active[0], 'Shuckle');
		for (let i = 2; i <= 4; i++) {
			p2.chooseMove(i).foe.chooseDefault();
			assert.species(p1.active[0], 'Shuckle');
		}
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pangoro', ability: 'moldbreaker', moves: ['circlethrow']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Shuckle', ability: 'suctioncups', item: 'ironball', moves: ['rest']},
			{species: 'Forretress', ability: 'sturdy', moves: ['rapidspin']},
		]);
		battle.commitDecisions();
		assert.species(battle.p2.active[0], 'Forretress');
	});
});
