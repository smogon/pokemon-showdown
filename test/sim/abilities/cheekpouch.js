'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Cheek Pouch`, () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should restore 1/3 HP to the user after eating a Berry`, () => {
		battle = common.createBattle([[
			{ species: 'wynaut', item: 'lumberry', ability: 'cheekpouch', moves: ['sleeptalk'] },
		], [
			{ species: 'pichu', moves: ['nuzzle'] },
		]]);
		const wynaut = battle.p1.active[0];
		battle.makeChoices();
		assert.fullHP(wynaut);
	});

	it(`should not activate if the user was at full HP`, () => {
		battle = common.createBattle([[
			{ species: 'wynaut', item: 'lumberry', ability: 'cheekpouch', moves: ['sleeptalk'] },
		], [
			{ species: 'pichu', moves: ['glare'] },
		]]);
		battle.makeChoices();
		assert(battle.log.every(line => !line.startsWith('|-heal')));
	});

	it(`should activate after a damage-reducing Berry is eaten, even if the user was originally at full HP`, () => {
		battle = common.createBattle([[
			{ species: 'dedenne', item: 'shucaberry', ability: 'cheekpouch', moves: ['sleeptalk'] },
		], [
			{ species: 'pichu', moves: ['earthquake'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
	});

	it(`can activate multiple times if the user eats multiple Berries in a row`, () => {
		battle = common.createBattle([[
			{ species: 'darkrai', ability: 'cheekpouch', item: 'sitrusberry', moves: ['fling'] },
		], [
			{ species: 'deoxys', ability: 'cheekpouch', level: 27, item: 'colburberry', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.equal(
			battle.getDebugLog().split('\n').filter(line => line.startsWith('|-heal|p2a: Deoxys') && line.endsWith('[from] ability: Cheek Pouch')).length,
			2
		);
	});
});
