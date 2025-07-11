'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Bleakwind Storm', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not miss in Rain', () => {
		battle = common.createBattle([[
			{ species: 'Tornadus', moves: ['bleakwindstorm'] },
		], [
			{ species: 'Kyogre', ability: 'drizzle', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should be able to miss in Rain if the target is holding Utility Umbrella', () => {
		battle = common.createBattle({ gameType: 'doubles', forceRandomChance: false }, [[
			{ species: 'Tornadus', moves: ['bleakwindstorm'] },
			{ species: 'Kyogre', ability: 'drizzle', moves: ['sleeptalk'] },
		], [
			{ species: 'Thundurus', item: 'utilityumbrella', moves: ['sleeptalk'] },
			{ species: 'Landorus', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
		assert.false.fullHP(battle.p2.active[1]);
	});
});
