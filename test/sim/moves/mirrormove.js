'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mirror Move [Gen 1]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`[Gen 1] Mirror Move'd Hyper Beam should force a recharge turn after not KOing a Pokemon`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'golem', moves: ['mirrormove', 'tackle']},
		], [
			{species: 'aerodactyl', moves: ['hyperbeam']},
		]]);
		battle.makeChoices();
		assert.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`[Gen 1] Mirror Move'd Hyper Beam should not force a recharge turn after KOing a Pokemon`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'fearow', moves: ['mirrormove', 'tackle']},
		], [
			{species: 'kadabra', moves: ['hyperbeam']},
			{species: 'exeggutor', moves: ['splash']},
		]]);
		battle.makeChoices();
		battle.choose('p2', 'switch exeggutor');
		assert.false.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`[Gen 1] Mirror Move should fail when used by a Pokemon that has not seen the opponent use an attack`, function () {
		battle = common.gen(1).createBattle({seed: [0, 0, 0, 1]}, [[
			{species: 'slowbro', moves: ['thunderwave']},
			{species: 'fearow', moves: ['mirrormove']},
		], [
			{species: 'chansey', moves: ['seismictoss']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2', 'auto');
		// Chansey is fully paralysed
		assert.fullHP(battle.p1.active[0]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});
});

describe('Mirror Move [Gen 2]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`[Gen 2] Mirror Move should fail when used by a Pokemon that has not seen the opponent use an attack`, function () {
		battle = common.gen(2).createBattle({seed: [1, 0, 0, 0]}, [[
			{species: 'slowbro', moves: ['thunderwave']},
			{species: 'fearow', moves: ['mirrormove']},
		], [
			{species: 'chansey', moves: ['seismictoss']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2', 'auto');
		// Chansey is fully paralysed
		assert.fullHP(battle.p1.active[0]);
		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});
});
