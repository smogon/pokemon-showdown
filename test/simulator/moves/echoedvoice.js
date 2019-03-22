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
		battle.setPlayer('p1', {team: [{species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'echoedvoice']}]});
		battle.setPlayer('p2', {team: [{species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest']}]});
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move echoedvoice', 'move rest');
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
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move echoedvoice', 'move rest');
		assert.strictEqual(battle.p2.active[0].item, 'focussash');
	});
});
