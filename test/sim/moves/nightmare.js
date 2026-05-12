'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Nightmare [Gen 2]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not deal damage to the affected if the opponent is KOed', () => {
		battle = common.gen(2).createBattle([[
			{ species: "Slugma", moves: ['sleeptalk'] },
			{ species: "Magcargo", moves: ['sleeptalk', 'flamethrower'] },
		], [
			{ species: "Forretress", moves: ['spore', 'nightmare'] },
		]]);
		battle.makeChoices('switch 2', 'move spore');
		battle.makeChoices('move sleeptalk', 'move nightmare');
		assert(battle.p1.active[0].volatiles['nightmare']);
		assert.fullHP(battle.p1.active[0]);
	});

	it('should continue dealing damage to the affected if it falls asleep while asleep', () => {
		battle = common.gen(2).createBattle([[
			{ species: "Magcargo", moves: ['sleeptalk', 'rest'] },
		], [
			{ species: "Forretress", moves: ['nightmare', 'pound'] },
		]]);
		battle.makeChoices('move rest', 'move pound');
		battle.makeChoices('move rest', 'move nightmare');
		battle.makeChoices('move sleeptalk', 'move pound');
		assert(battle.p1.active[0].volatiles['nightmare']);
		assert.false.fullHP(battle.p1.active[0]);
	});
});
