'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Uproar', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should pierce through substitutes', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'uproar']}]});
		battle.setPlayer('p2', {team: [{species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest']}]});
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move uproar', 'move rest');
		assert.equal(battle.p2.active[0].item, '');
	});

	it('should end if the user is under the effect of Throat Chop', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Zoroark", moves: ['uproar']}]});
		battle.setPlayer('p2', {team: [{species: "Corsola", moves: ['throatchop']}]});
		battle.makeChoices('move uproar', 'move throatchop');
		assert.equal(battle.p1.active[0].volatiles['uproar'], undefined);
	});
});

describe('Uproar [Gen 5]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not pierce through substitutes', function () {
		battle = common.gen(5).createBattle([
			[{species: "Deoxys-Attack", ability: 'victorystar', item: 'laggingtail', moves: ['splash', 'uproar']}],
			[{species: "Caterpie", level: 2, ability: 'naturalcure', item: 'focussash', moves: ['substitute', 'rest']}],
		]);
		battle.makeChoices('move splash', 'move substitute');
		battle.makeChoices('move uproar', 'move rest');
		assert.equal(battle.p2.active[0].item, 'focussash');
	});
});
