'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Confusion', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not be affected by modifiers like Huge Power or Life Orb`, function () {
		battle = common.createBattle([[
			{species: 'Deoxys-Attack', ability: 'hugepower', item: 'lifeorb', moves: ['sleeptalk']},
		], [
			{species: 'Sableye', ability: 'prankster', moves: ['confuseray']},
		]]);
		battle.makeChoices();
		const deoxys = battle.p1.active[0];
		const damage = deoxys.maxhp - deoxys.hp;
		assert.bounded(damage, [150, 177]);
	});
});
