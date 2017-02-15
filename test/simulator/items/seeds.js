'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Seeds', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate even in a double-switch-in', function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: 'tapukoko', ability: 'electricsurge', item: 'grassyseed', moves: ['protect']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: 'tapubulu', ability: 'grassysurge', item: 'electricseed', moves: ['protect']},
		]);
		assert.false(p1.active[0].item);
		assert.false(p2.active[0].item);
	});
});
