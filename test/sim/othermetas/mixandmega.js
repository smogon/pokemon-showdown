'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mix and Mega', () => {
	afterEach(() => battle.destroy());

	it('should overwrite forme-change abilities on Mega Evolution', () => {
		battle = common.createBattle({ formatid: 'gen9mixandmega' }, [[
			{ species: "Mimikyu", ability: 'disguise', item: 'metagrossite', moves: ['shadowclaw'] },
		], [
			{ species: "Palafin", ability: 'zerotohero', item: 'leftovers', moves: ['jetpunch'] },
		]]);
		battle.makeChoices('default', 'default'); // Switch in
		battle.makeChoices('move shadowclaw mega', 'move jetpunch');
		assert.equal(battle.p1.active[0].ability, 'toughclaws');
	});
});
