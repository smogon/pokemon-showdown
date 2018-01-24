'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Snarl', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should pierce through substitutes', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'snarl']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest']}]);

		battle.makeChoices('move Snarl', 'move Rest');
		battle.makeChoices('move Rest', 'move Snarl');

		assert.strictEqual(battle.p2.active[0].item, '');
	});
});

describe('Snarl [Gen 5]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not pierce through substitutes', function () {
		battle = common.gen(5).createBattle([
			[{species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'snarl']}],
			[{species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest']}],
		]);

		battle.makeChoices('move Splash', 'move Substitute');
		battle.makeChoices('move Snarl', 'move Rest');

		assert.strictEqual(battle.p2.active[0].item, 'focussash');
	});
});
