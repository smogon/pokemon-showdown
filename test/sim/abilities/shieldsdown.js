'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shields Down', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should be immune to status until below 50%', function () {
		battle = common.createBattle([[
			{species: 'Minior', ability: 'shieldsdown', moves: ['splash']},
		], [
			{species: 'Mew', ability: 'pickup', moves: ['glare', 'superfang']},
		]]);
		battle.makeChoices();
		assert.false(battle.p1.active[0].status);
		battle.makeChoices('auto', 'move superfang');
		battle.makeChoices();
		assert.false(battle.p1.active[0].status);
		battle.makeChoices('auto', 'move superfang');
		battle.makeChoices();
		assert.equal(battle.p1.active[0].status, 'par');
	});

	it('should be immune to status until below 50% in all formes', function () {
		battle = common.createBattle([[
			{species: 'Minior-Blue', ability: 'shieldsdown', moves: ['splash']},
		], [
			{species: 'Mew', ability: 'pickup', moves: ['glare', 'superfang']},
		]]);
		battle.makeChoices();
		assert.false(battle.p1.active[0].status);
		battle.makeChoices('auto', 'move superfang');
		battle.makeChoices();
		assert.false(battle.p1.active[0].status);
		battle.makeChoices('auto', 'move superfang');
		battle.makeChoices();
		assert.equal(battle.p1.active[0].status, 'par');
	});
});
