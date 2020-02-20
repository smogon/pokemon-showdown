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
		battle.setPlayer('p1', {team: [{species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'boomburst']}]});
		battle.setPlayer('p2', {team: [{species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest']}]});
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move boomburst', 'move rest');
		assert.equal(battle.p2.active[0].item, '');
	});
});
