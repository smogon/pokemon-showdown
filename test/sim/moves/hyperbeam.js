'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Hyper Beam`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should always force a recharge turn`, function () {
		battle = common.createBattle([[
			{species: 'snorlax', ability: 'noguard', moves: ['hyperbeam', 'tackle']},
		], [
			{species: 'alakazam', moves: ['substitute']},
		]]);
		battle.makeChoices();
		assert.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`[Gen 1] should not force a recharge turn after KOing a Pokemon`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'snorlax', moves: ['hyperbeam', 'tackle']},
		], [
			{species: 'abra', moves: ['swordsdance']},
			{species: 'exeggutor', moves: ['swordsdance']},
		]]);
		battle.makeChoices();
		battle.choose('p2', 'switch exeggutor');
		assert.false.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`[Gen 1] should not force a recharge turn after breaking a Substitute`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'snorlax', moves: ['hyperbeam', 'tackle']},
		], [
			{species: 'alakazam', moves: ['substitute']},
		]]);
		battle.makeChoices();
		assert.false.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`[Gen 1] should force a recharge turn after damaging, but not breaking a Substitute`, function () {
		battle = common.gen(1).createBattle({forceRandomChance: true}, [[
			{species: 'slowpoke', moves: ['hyperbeam', 'tackle']},
		], [
			{species: 'rhydon', moves: ['substitute']},
		]]);
		battle.makeChoices();
		assert.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`[Gen 1] Partial trapping moves negate recharge turns (recharging Pokemon is slower))`, function () {
		battle = common.gen(1).createBattle({forceRandomChance: true}, [[
			{species: 'cloyster', moves: ['surf', 'clamp']},
		], [
			{species: 'snorlax', moves: ['hyperbeam']},
		]]);
		// All moves hit
		battle.makeChoices();
		assert(battle.p2.active[0].volatiles['mustrecharge']);
		battle.makeChoices('move clamp', 'auto');
		assert.false(battle.p2.active[0].volatiles['mustrecharge']);
		assert(battle.p2.active[0].volatiles['partiallytrapped']);
	});

	it(`[Gen 1] Partial trapping moves negate recharge turns (recharging Pokemon is faster)`, function () {
		battle = common.gen(1).createBattle({forceRandomChance: true}, [[
			{species: 'cloyster', moves: ['clamp']},
		], [
			{species: 'aerodactyl', moves: ['hyperbeam']},
		]]);
		// All moves hit
		battle.makeChoices();
		assert.false.fullHP(battle.p1.active[0]);
		assert.false(battle.p2.active[0].volatiles['mustrecharge']);
		assert(battle.p2.active[0].volatiles['partiallytrapped']);
	});

	it(`[Gen 1] Hyper Beam automatic selection glitch`, function () {
		battle = common.gen(1).createBattle({seed: [0, 0, 1, 0]}, [[
			{species: 'cloyster', moves: ['surf', 'clamp']},
		], [
			{species: 'snorlax', moves: ['hyperbeam']},
		]]);
		// All moves hit in the first turn
		battle.makeChoices();
		assert(battle.p2.active[0].volatiles['mustrecharge']);
		// Clamp misses, the forced Hyper Beam hits
		battle.makeChoices('move clamp', 'auto');
		assert.false(battle.p2.active[0].volatiles['partiallytrapped']);
		assert(battle.p2.active[0].volatiles['mustrecharge']);
	});
});
