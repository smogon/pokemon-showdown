'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Seeds', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate even in a double-switch-in', function () {
		battle = common.createBattle([
			[{species: 'Tapu Koko', ability: 'electricsurge', item: 'grassyseed', moves: ['protect']}],
			[{species: 'Tapu Bulu', ability: 'grassysurge', item: 'electricseed', moves: ['protect']}],
		]);
		assert.false(battle.p1.active[0].item);
		assert.false(battle.p2.active[0].item);
	});

	it('should not activate when Magic Room ends', function () {
		battle = common.createBattle([
			[
				{species: 'Tapu Koko', ability: 'electricsurge', item: 'terrainextender', moves: ['protect']},
				{species: 'Hawlucha', ability: 'unburden', item: 'electricseed', moves: ['protect']},
			],
			[{species: 'Alakazam', ability: 'magicguard', moves: ['magicroom']}],
		]);
		battle.makeChoices('move protect', 'move magicroom');
		battle.makeChoices('switch 2', 'move magicroom');
		assert.equal(battle.p1.active[0].item, 'electricseed');
	});
});
