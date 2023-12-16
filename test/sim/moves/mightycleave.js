'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Mighty Cleave', function () {
	afterEach(() => battle.destroy());

	it(`should go through Protect`, function () {
		battle = common.createBattle([
			[{species: "Terrakion", ability: 'justified', moves: ['mightycleave']}],
			[{species: "Entei", ability: 'innerfocus', moves: ['protect']}],
		]);
		battle.makeChoices();
		const damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.notEqual(damage, 0, `Entei should have taken damage`);
	});
});
