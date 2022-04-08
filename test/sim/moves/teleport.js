'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Teleport`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should fail to switch the user out if no Pokemon can be switched in`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['teleport']},
		], [
			{species: 'pichu', moves: ['swordsdance']},
		]]);
		battle.makeChoices();
		assert(battle.log.some(line => line.startsWith('|-fail')));

		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['teleport']},
			{species: 'pichu', moves: ['swordsdance']},
		], [
			{species: 'pichu', moves: ['swordsdance']},
			{species: 'pichu', moves: ['swordsdance']},
		]]);
		battle.makeChoices();
		assert(battle.log.some(line => line.startsWith('|-fail')));
	});
});
