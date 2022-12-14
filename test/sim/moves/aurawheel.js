'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Aura Wheel', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change types based on Morpeko forme', function () {
		battle = common.createBattle([
			[{species: 'Morpeko', ability: 'hungerswitch', moves: ['aurawheel']}],
			[{species: 'Rhyperior', ability: 'solidrock', moves: ['stealthrock']}],
		]);
		battle.makeChoices('move aurawheel', 'move stealthrock');
		assert.fullHP(battle.p2.active[0]);
		battle.makeChoices('move aurawheel', 'move stealthrock');
		assert.false.fullHP(battle.p2.active[0]);
	});
});
