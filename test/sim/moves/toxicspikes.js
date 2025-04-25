'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Toxic Spikes', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should be absorbed by grounded Poison types', () => {
		battle = common.createBattle([[
			{ species: 'Muk', moves: ['toxicspikes', 'sleeptalk'] },
		], [
			{ species: 'Glalie', moves: ['sleeptalk'] },
			{ species: 'Koffing', ability: 'levitate', moves: ['sleeptalk'] },
			{ species: 'Qwilfish', item: 'heavydutyboots', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		assert(battle.p2.sideConditions.toxicspikes);
		battle.makeChoices('move sleeptalk', 'switch 2');
		assert(battle.p2.sideConditions.toxicspikes, 'Levitate Koffing should not have absorbed Toxic Spikes');
		battle.makeChoices('move sleeptalk', 'switch 3');
		assert.false(battle.p2.sideConditions.toxicspikes, 'Heavy Duty Boots Qwilfish should have absorbed Toxic Spikes');
	});

	it('should be disabled immediately when absorbed', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Muk', moves: ['toxicspikes', 'sleeptalk'] },
			{ species: 'Cufant', moves: ['sleeptalk'] },
		], [
			{ species: 'Glalie', moves: ['memento'] },
			{ species: 'Koffing', moves: ['memento'] },
			{ species: 'Qwilfish', moves: ['sleeptalk'] },
			{ species: 'Bergmite', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();
		assert.false(battle.p2.sideConditions.toxicspikes);
		assert.false(battle.p2.active[1].status, 'Bergmite should not have been poisoned');
	});
});
