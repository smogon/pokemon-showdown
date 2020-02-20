'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Leftovers [Gen 2]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should heal after switch', function () {
		battle = common.gen(2).createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Blissey', item: 'leftovers', moves: ['healbell']},
			{species: 'Magikarp', level: 1, moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Miltank", moves: ['seismictoss']},
		]});
		const holder = battle.p1.active[0];
		battle.makeChoices('move healbell', 'move seismictoss');
		assert.equal(holder.hp, 590);

		battle.makeChoices('switch 2', 'move seismictoss');
		battle.makeChoices('switch 2', '');
		assert.equal(holder.hp, 630);
	});
});
