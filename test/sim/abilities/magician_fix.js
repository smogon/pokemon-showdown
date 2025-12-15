'use strict';

const assert = require('assert').strict;
const common = require('./../../common');

let battle;

describe('Magician Fix', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should emit an enditem event when stealing an item', function () {
		battle = common.createBattle([[
			{species: 'Delphox', ability: 'magician', moves: ['mysticalfire']},
		], [
			{species: 'Alcremie', item: 'leftovers', moves: ['recover']},
		]]);

		battle.makeChoices();

        const log = battle.getDebugLog();

        assert(log.indexOf('|-enditem|p2a: Alcremie|Leftovers|[silent]|[from] ability: Magician') > -1,
            "The log should contain the event -enditem (with silent) for Magician.");
	});
});
