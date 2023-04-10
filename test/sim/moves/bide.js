'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('[Gen 1] Bide', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should be possible to roll two-turn Bide`, function () {
		battle = common.gen(1).createBattle({seed: [0, 1, 1, 1]}, [[
			{species: 'Aerodactyl', moves: ['bide', 'whirlwind']},
		], [
			{species: 'Gyarados', moves: ['dragonrage']},
		]]);
		const aerodactyl = battle.p1.active[0];
		const gyarados = battle.p2.active[0];
		battle.makeChoices();
		assert.equal(aerodactyl.volatiles['bide'].time, 2);
		// Bide is the only move that can be selected
		const choices = aerodactyl.getMoveRequestData().moves;
		assert.equal(choices[0].id, 'bide');
		assert.false(choices[0].disabled);
		assert.equal(choices[1].id, 'whirlwind');
		assert(choices[1].disabled);
		battle.makeChoices();
		battle.makeChoices();
		assert.false(aerodactyl.volatiles['bide']);
		assert.equal(gyarados.maxhp - gyarados.hp, 160);
	});

	it(`should be possible to roll three-turn Bide`, function () {
		battle = common.gen(1).createBattle({seed: [1, 1, 1, 1]}, [[
			{species: 'Aerodactyl', moves: ['bide']},
		], [
			{species: 'Gyarados', moves: ['dragonrage']},
		]]);
		const aerodactyl = battle.p1.active[0];
		const gyarados = battle.p2.active[0];
		battle.makeChoices();
		assert.equal(aerodactyl.volatiles['bide'].time, 3);
		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices();
		assert.false(aerodactyl.volatiles['bide']);
		assert.equal(gyarados.maxhp - gyarados.hp, 240);
	});

	it(`should damage Substitute with Bide damage`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'Aerodactyl', moves: ['bide', 'whirlwind']},
		], [
			{species: 'Gyarados', moves: ['dragonrage', 'substitute']},
		]]);

		const aerodactyl = battle.p1.active[0];
		const gyarados = battle.p2.active[0];
		battle.makeChoices('move whirlwind', 'move substitute');
		battle.makeChoices();
		aerodactyl.volatiles['bide'].time = 2;
		battle.makeChoices();
		battle.makeChoices();
		assert.false(aerodactyl.volatiles['bide']);
		assert.false(gyarados.volatiles['substitute']);
	});

	it(`should accumulate damage as the opponent switches or uses moves that don't reset lastDamage`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'Aerodactyl', moves: ['bide']},
		], [
			{species: 'Gyarados', moves: ['dragonrage', 'splash']},
			{species: 'Exeggutor', moves: ['barrage']},
		]]);

		const aerodactyl = battle.p1.active[0];
		battle.makeChoices();
		aerodactyl.volatiles['bide'].time = 3;
		battle.makeChoices('auto', 'move splash');
		battle.makeChoices('auto', 'switch 2');
		battle.makeChoices();
		const exeggutor = battle.p2.active[0];
		assert.false(aerodactyl.volatiles['bide']);
		assert.equal(exeggutor.maxhp - exeggutor.hp, 240);
	});

	it(`should zero out accumulated damage when an enemy faints (Desync Clause Mod)`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'Aerodactyl', moves: ['bide']},
		], [
			{species: 'Gyarados', moves: ['dragonrage', 'leer']},
			{species: 'Exeggutor', moves: ['barrage']},
		]]);

		const aerodactyl = battle.p1.active[0];
		const exeggutor = battle.p2.pokemon[1];
		// Exeggutor will faint when switched in
		exeggutor.hp = 1;
		exeggutor.setStatus('psn');
		battle.makeChoices();
		aerodactyl.volatiles['bide'].time = 2;
		// Leer resets battle.lastDamage to 0
		battle.makeChoices('auto', 'move leer');
		battle.makeChoices('auto', 'switch 2');
		battle.makeChoices();
		assert.equal(aerodactyl.volatiles['bide'].time, 1);
		battle.makeChoices();
		assert.false(aerodactyl.volatiles['bide']);
		assert.fullHP(battle.p2.active[0]);
		assert(battle.log.some(line => line.includes('Desync Clause Mod activated')));
	});

	it(`should pause Bide's duration when asleep or frozen`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'Aerodactyl', moves: ['bide']},
		], [
			{species: 'Parasect', moves: ['spore']},
		]]);

		const aerodactyl = battle.p1.active[0];
		battle.makeChoices();
		aerodactyl.volatiles['bide'].time = 2;
		for (let i = 0; i < 9; i++) {
			battle.makeChoices();
			assert.equal(aerodactyl.volatiles['bide'].time, 2);
		}
	});

	it(`should pause Bide's duration when disabled`, function () {
		battle = common.gen(1).createBattle({seed: [1, 1, 1, 0]}, [[
			{species: 'Aerodactyl', moves: ['bide', 'whirlwind']},
		], [
			{species: 'Voltorb', moves: ['disable']},
		]]);

		const aerodactyl = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(aerodactyl.volatiles['bide'].time, 3);
		assert.equal(aerodactyl.volatiles['disable'].move, 'bide');
		// Struggle is the choice
		const choices = aerodactyl.getMoveRequestData().moves;
		assert.equal(choices[0].id, 'struggle');
		assert(aerodactyl.volatiles['disable'].time > 1);
		battle.makeChoices();
		assert.equal(aerodactyl.volatiles['bide'].time, 3);
	});
});
