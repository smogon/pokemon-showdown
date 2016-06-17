'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Echoed Voice', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should pierce through substitutes', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'echoedvoice']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p2.active[0].item, '');
	});
});

describe('Echoed Voice [Gen 5]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not pierce through substitutes', function () {
		battle = common.gen(5).createBattle([
			[{species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'echoedvoice']}],
			[{species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest']}],
		]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p2.active[0].item, 'focussash');
	});
});
