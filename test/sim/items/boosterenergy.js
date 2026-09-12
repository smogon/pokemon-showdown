'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Booster Energy', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not activate before Sticky Web when switching in`, () => {
		battle = common.createBattle([[
			{ species: 'Abra', ability: 'synchronize', moves: ['teleport'] },
			{ species: 'Iron Bundle', ability: 'quarkdrive', item: 'boosterenergy', moves: ['sleeptalk'] },
		], [
			{ species: 'Ribombee', ability: 'shielddust', moves: ['stickyweb'] },
		]]);

		battle.makeChoices();
		battle.makeChoices('switch 2');
		const bundle = battle.p1.active[0];
		assert.equal(bundle.volatiles['quarkdrive'].bestStat, 'spa',
			`Iron Bundle's Speed should have been lowered before Booster Energy activated, boosting its SpA instead.`);
	});

	it(`should activate right after weather changes`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Ninetales-Alola', ability: 'snowwarning', moves: ['sleeptalk'] },
			{ species: 'Roaring Moon', item: 'boosterenergy', ability: 'protosynthesis', moves: ['sleeptalk'] },
		], [
			{ species: 'Incineroar', ability: 'intimidate', moves: ['sleeptalk'] },
			{ species: 'Torkoal', ability: 'drought', moves: ['sleeptalk'] },
		]]);

		const roaringMoon = battle.p1.active[1];
		assert(roaringMoon.volatiles['protosynthesis'].fromBooster);
		assert.equal(roaringMoon.volatiles['protosynthesis'].bestStat, 'atk');
		assert.equal(battle.field.weather, 'sunnyday');
	});
});
