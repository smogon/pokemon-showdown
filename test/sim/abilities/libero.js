'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Libero', function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should activate on both turns of a charge move`, function () {
		battle = common.createBattle([[
			{species: "Wynaut", ability: 'libero', moves: ['bounce']},
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
});
