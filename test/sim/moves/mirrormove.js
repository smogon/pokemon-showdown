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

	it(`[Gen 1] Mirror Move should not copy the charging turn of a two-turn attack`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'fearow', moves: ['mirrormove']},
		], [
			{species: 'dugtrio', moves: ['dig']},
		]]);
		const fearow = battle.p1.active[0];
		battle.makeChoices();
		assert.false(fearow.volatiles['twoturnmove']);
		battle.makeChoices();
		assert(fearow.volatiles['twoturnmove']);
	});

	it(`[Gen 1] Mirror Move should not copy Metronome if Metronome calls a regular move`, function () {
		battle = common.gen(1).createBattle({seed: [0, 0, 0, 1]}, [[
			{species: 'fearow', moves: ['mirrormove']},
		], [
			{species: 'alakazam', moves: ['metronome']},
		]]);
		battle.makeChoices();
		assert.false(battle.log.some(line => line.includes('|move|p1a: Fearow|Metronome|p1a: Fearow|[from]Mirror Move')));
	});

	it(`[Gen 1] Mirror Move should copy Metronome if Metronome calls a two-turn move`, function () {
		battle = common.gen(1).createBattle({seed: [0, 1, 0, 1]}, [[
			{species: 'fearow', moves: ['mirrormove']},
		], [
			{species: 'alakazam', moves: ['metronome']},
		]]);
		battle.makeChoices();
		assert(battle.p2.active[0].volatiles['twoturnmove']);
		assert(battle.log.some(line => line.includes('|move|p1a: Fearow|Metronome|p1a: Fearow|[from]Mirror Move')));
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
