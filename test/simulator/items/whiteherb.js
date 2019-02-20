'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('White Herb', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('it should use white herb after both intimidate', function () {
		battle = common.createBattle({gameType: 'doubles'});

		battle.join('p1', 'Guest 1', 1, [{species: "Arcanine", ability: 'intimidate', moves: ['bodyslam']},
			{species: "Incineroar", ability: 'intimidate', moves: ['agility']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "aegislash", ability: 'stancechange', item: 'whiteherb', moves: ['gyroball']},
			{species: "pelipper", ability: 'sandveil', item: 'lifeorb', moves: ['airslash']}]);

		const holder = battle.p2.active[0];

		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', 0);
	});
});
