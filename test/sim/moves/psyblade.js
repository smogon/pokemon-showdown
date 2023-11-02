'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Psyblade', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should have its base power multiplied by 1.5 in Electric Terrain`, function () {
		battle = common.createBattle([[
			{species: 'Gallade', ability: 'steadfast', moves: ['psyblade']},
		], [
			{species: 'Miraidon', ability: 'hadronengine', moves: ['luckychant']},
		]]);
		const miraidon = battle.p2.active[0];
		battle.makeChoices();
		assert.bounded(miraidon.maxhp - miraidon.hp, [157, 186]);
	});

	it(`should have its base power multiplied by 1.5 in Electric Terrain even if the user or the target isn't grounded`, function () {
		battle = common.createBattle([[
			{species: 'Gallade', ability: 'steadfast', item: 'airballoon', moves: ['psyblade']},
		], [
			{species: 'Miraidon', ability: 'hadronengine', item: 'airballoon', moves: ['luckychant']},
		]]);
		const miraidon = battle.p2.active[0];
		battle.makeChoices();
		assert.bounded(miraidon.maxhp - miraidon.hp, [157, 186]);
	});
});
