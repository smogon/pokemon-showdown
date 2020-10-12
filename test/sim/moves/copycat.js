'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Copycat', function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should not successfully Copycat Future Sight on the damaging part of Future Sight`, function () {
		battle = common.createBattle([[
			{species: "Wynaut", moves: ['sleeptalk', 'futuresight']},
		], [
			{species: "Liepard", moves: ['sleeptalk', 'copycat']},
		]]);

		battle.makeChoices('move futuresight', 'move sleeptalk');
		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices('move sleeptalk', 'move copycat');
		assert(battle.log.every(line => !line.startsWith('|move|p2a: Liepard|Future Sight|')));
	});
});
