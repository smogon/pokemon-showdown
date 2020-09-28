'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Burning Jealousy', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should burn a target whose stats were raised this turn`, function () {
		battle = common.createBattle([[
			{species: "Mew", moves: ['dragondance']},
		], [
			{species: "Torkoal", moves: ['burningjealousy']},
		]]);
		battle.makeChoices('move dragondance', 'move burningjealousy');
		assert.equal(battle.p1.active[0].status, 'brn');
	});

	it(`should not burn a target whose stats were raised after the attack`, function () {
		battle = common.createBattle([[
			{species: "Ninetales", moves: ['burningjealousy']},
		], [
			{species: "Magearna", item: 'weaknesspolicy', moves: ['imprison']},
		]]);
		battle.makeChoices('move burningjealousy', 'move imprison');
		assert.equal(battle.p2.active[0].status, '');
	});

	it(`should be affected by Sheer Force`, function () {
		battle = common.createBattle([[
			{species: "Cobalion", moves: ['swordsdance']},
		], [
			{species: "Darmanitan", ability: 'sheerforce', item: 'kingsrock', moves: ['burningjealousy']},
		]]);
		battle.makeChoices('move swordsdance', 'move burningjealousy');
		assert.equal(battle.p1.active[0].status, '');
	});
});
