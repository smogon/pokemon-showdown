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
			{species: 'Mew', moves: ['dragondance']},
		], [
			{species: 'Torkoal', moves: ['burningjealousy']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].status, 'brn');
	});

	it(`should not burn a target whose stats were raised after the attack`, function () {
		battle = common.createBattle([[
			{species: 'Ninetales', moves: ['burningjealousy']},
		], [
			{species: 'Magearna', item: 'weaknesspolicy', moves: ['imprison']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p2.active[0].status, '');
	});

	it(`should burn a target whose stats were boosted at the start of the match`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['burningjealousy']},
		], [
			{species: 'Porygon', ability: 'download', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p2.active[0].status, 'brn');
	});

	it(`should not burn a target whose stats were boosted at a switch after a KO`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['burningjealousy']},
		], [
			{species: 'Porygon', ability: 'download', moves: ['memento']},
			{species: 'Porygon2', ability: 'download', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices();
		assert.equal(battle.p2.active[0].status, '');
	});

	it(`should be affected by Sheer Force`, function () {
		battle = common.createBattle([[
			{species: 'Cobalion', moves: ['swordsdance']},
		], [
			{species: 'Darmanitan', ability: 'sheerforce', item: 'kingsrock', moves: ['burningjealousy']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].status, '');
	});
});
