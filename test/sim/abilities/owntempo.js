'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Own Tempo', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should block Intimidate', () => {
		battle = common.createBattle([[
			{ species: 'Gyarados', ability: 'intimidate', moves: ['splash'] },
		], [
			{ species: 'Smeargle', ability: 'own tempo', item: 'adrenaline orb', moves: ['sleeptalk'] },
		]]);
		assert.statStage(battle.p2.active[0], 'atk', 0);
		assert.statStage(battle.p2.active[0], 'spe', 1);
	});
});
