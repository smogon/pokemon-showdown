'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Thick Fat', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should halve damage from Fire- or Ice-type attacks`, function () {
		battle = common.createBattle([[
			{species: 'Miltank', ability: 'thickfat', item: 'lumberry', moves: ['luckychant', 'recover']},
		], [
			{species: 'Wynaut', moves: ['icebeam', 'flamethrower']},
		]]);
		const miltank = battle.p1.active[0];
		const damageRange = [16, 19];
		battle.makeChoices('move luckychant', 'move icebeam');
		assert.bounded(miltank.maxhp - miltank.hp, damageRange);
		battle.makeChoices('move recover', 'move flamethrower');
		assert.bounded(miltank.maxhp - miltank.hp, damageRange);
	});

	it(`should halve damage from Fire- or Ice-type attacks in past generations, even when holding a type-boosting item`, function () {
		battle = common.gen(3).createBattle([[
			{species: 'Miltank', ability: 'thickfat', moves: ['recover']},
		], [
			{species: 'Wynaut', item: 'nevermeltice', moves: ['icebeam']},
		]]);
		const miltank = battle.p1.active[0];
		battle.makeChoices();
		assert.bounded(miltank.maxhp - miltank.hp, [18, 22]);
	});

	it(`should be suppressed by Mold Breaker`, function () {
		battle = common.createBattle([[
			{species: 'Miltank', ability: 'thickfat', item: 'lumberry', moves: ['luckychant', 'recover']},
		], [
			{species: 'Wynaut', ability: 'moldbreaker', moves: ['icebeam', 'flamethrower']},
		]]);
		const miltank = battle.p1.active[0];
		const damageRange = [31, 37];
		battle.makeChoices('move luckychant', 'move icebeam');
		assert.bounded(miltank.maxhp - miltank.hp, damageRange);
		battle.makeChoices('move recover', 'move flamethrower');
		assert.bounded(miltank.maxhp - miltank.hp, damageRange);
	});
});
