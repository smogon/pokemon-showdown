'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Stance change', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should change formes when Sleep Talk calls a move`, function () {
		battle = common.createBattle([[
			{species: "Aegislash", ability: 'stancechange', moves: ['sleeptalk', 'shadowclaw']},
		], [
			{species: "Kyurem", moves: ['spore']},
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.startsWith('|-formechange')));
	});
});
