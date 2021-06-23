'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mummy', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should set the attacker's ability to Mummy when the user is hit by a contact move`, function () {
		battle = common.createBattle([[
			{species: 'Cofagrigus', ability: 'mummy', moves: ['sleeptalk']},
		], [
			{species: 'Mew', ability: 'synchronize', moves: ['aerialace']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p2.active[0].ability, 'mummy');
	});

	it(`should not change isPermanent abilities`, function () {
		battle = common.createBattle([[
			{species: 'Cofagrigus', ability: 'mummy', moves: ['sleeptalk']},
		], [
			{species: 'Mimikyu', ability: 'disguise', moves: ['aerialace']},
		]]);

		battle.makeChoices();
		assert.equal(battle.p2.active[0].ability, 'disguise');
	});

	it(`should not activate before all damage calculation is complete`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Sableye', ability: 'toughclaws', moves: ['brutalswing']},
			{species: 'Golisopod', ability: 'emergencyexit', moves: ['sleeptalk']},
		], [
			{species: 'Cofagrigus', ability: 'mummy', moves: ['sleeptalk']},
			{species: 'Hoopa', ability: 'shellarmor', moves: ['sleeptalk']},
		]]);

		const hoopa = battle.p2.active[1];
		battle.makeChoices();
		assert.fainted(hoopa);
	});
});
