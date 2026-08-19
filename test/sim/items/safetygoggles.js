'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Safety Goggles', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should be revealed if Terrain is also active`, () => {
		battle = common.createBattle([[
			{ species: 'tapukoko', ability: 'electricsurge', item: 'safetygoggles', moves: ['sleeptalk'] },
		], [
			{ species: 'amoonguss', moves: ['spore'] },
		]]);
		battle.makeChoices();
		assert(battle.log.some(line => line.includes('|item: Safety Goggles|')));
	});

	it(`should be revealed if the move would have missed`, () => {
		battle = common.createBattle({ forceRandomChance: false }, [[
			{ species: 'yveltal', item: 'safetygoggles', moves: ['sleeptalk'] },
		], [
			{ species: 'venusaur', moves: ['sleeppowder'] },
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.includes('|item: Safety Goggles|')));
	});
});
