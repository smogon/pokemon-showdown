'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Stance change', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should change formes when Sleep Talk calls a move`, () => {
		battle = common.createBattle([[
			{ species: "Aegislash", ability: 'stancechange', moves: ['sleeptalk', 'shadowclaw'] },
		], [
			{ species: "Kyurem", moves: ['spore'] },
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.startsWith('|-formechange')));
	});
});
