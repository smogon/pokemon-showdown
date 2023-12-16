'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Burning Bulwark', function () {
	afterEach(() => battle.destroy());

	it(`should burn the user of a contact move`, function () {
		battle = common.createBattle([
			[{species: "Gallade", ability: 'justified', moves: ['tackle']}],
			[{species: "Entei", ability: 'innerfocus', moves: ['burningbulwark']}],
		]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].status, 'brn', 'Gallade should be burned when using contact move');
	});

	it(`should not burn the user of a contact move if user has protective pads`, function () {
		battle = common.createBattle([
			[{species: "Gallade", item: 'protectivepads', ability: 'justified', moves: ['tackle']}],
			[{species: "Entei", ability: 'innerfocus', moves: ['burningbulwark']}],
		]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].status, '', 'Gallade should not be burned when using contact move due to protective pads');
	});

	it(`should not burn the user of a non-contact move`, function () {
		battle = common.createBattle([
			[{species: "Ogerpon-Wellspring", ability: 'Water Absorb', moves: ['ivycudgel']}],
			[{species: "Entei", ability: 'innerfocus', moves: ['burningbulwark']}],
		]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].status, '', 'Ogerpon-Wellspring should not be burned when using non-contact move');
	});
});
