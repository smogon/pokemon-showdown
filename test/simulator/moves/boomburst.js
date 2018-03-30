'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Boomburst', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should pierce through substitutes', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'boomburst']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest']}]);
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move boomburst', 'move rest');
		assert.strictEqual(battle.p2.active[0].item, '');
	});
});
