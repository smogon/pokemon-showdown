'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Inverse Battle', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should change natural resistances into weaknesses`, function () {
		battle = common.createBattle({inverseMod: true}, [[
			{species: 'wynaut', moves: ['vitalthrow']},
		], [
			{species: 'scyther', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it(`should change natural weaknesses into resistances`, function () {
		battle = common.createBattle({inverseMod: true}, [[
			{species: 'wynaut', moves: ['vitalthrow']},
		], [
			{species: 'absol', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-resisted|'));
	});

	it(`should negate natural immunities and make them weaknesses`, function () {
		battle = common.createBattle({inverseMod: true}, [[
			{species: 'wynaut', moves: ['vitalthrow']},
		], [
			{species: 'dusknoir', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should affect Stealth Rock damage`, function () {
		battle = common.createBattle({inverseMod: true}, [[
			{species: 'wynaut', moves: ['stealthrock', 'snore']},
		], [
			{species: 'ninjask', moves: ['sleeptalk']},
			{species: 'steelix', moves: ['sleeptalk']},
			{species: 'hitmonchan', moves: ['sleeptalk']},
			{species: 'chansey', moves: ['sleeptalk']},
			{species: 'staraptor', moves: ['sleeptalk']},
			{species: 'volcarona', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		let pokemon;
		let expectedDamage;
		for (let i = 2; i <= 6; i++) {
			battle.makeChoices('move snore', 'switch ' + i);
			pokemon = battle.p2.active[0];
			expectedDamage = Math.floor(pokemon.maxhp * Math.pow(0.5, i - 1));
			assert.equal(pokemon.maxhp - pokemon.hp, expectedDamage, `${pokemon.name} should take ${expectedDamage} damage`);
		}
	});

	it(`should affect the resistance of Delta Stream`, function () {
		battle = common.createBattle({inverseMod: true}, [[
			{species: 'wynaut', moves: ['hiddenpowerbug']},
		], [
			{species: 'rayquazamega', ability: 'deltastream', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert(!battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it(`should make Ghost/Grass types take neutral damage from Flying Press`, function () {
		battle = common.createBattle({inverseMod: true}, [[
			{species: 'hawlucha', moves: ['flyingpress']},
		], [
			{species: 'gourgeist', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert(!battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it(`should not affect ability-based immunities`, function () {
		battle = common.createBattle({inverseMod: true}, [[
			{species: 'wynaut', moves: ['earthquake']},
		], [
			{species: 'mismagius', ability: 'levitate', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-immune|'));
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not affect move-based immunities`, function () {
		battle = common.createBattle({inverseMod: true}, [[
			{species: 'wynaut', moves: ['earthquake']},
		], [
			{species: 'klefki', moves: ['magnetrise']},
		]]);
		battle.makeChoices();
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-immune|'));
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not affect the type effectiveness of Freeze Dry on Water-type Pokemon`, function () {
		battle = common.createBattle({inverseMod: true}, [[
			{species: 'wynaut', moves: ['freezedry']},
		], [
			{species: 'floatzel', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it(`should not affect the "ungrounded" state of Flying-type Pokemon`, function () {
		battle = common.createBattle({inverseMod: true}, [[
			{species: 'wynaut', moves: ['spore']},
		], [
			{species: 'talonflame', moves: ['mistyterrain']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p2.active[0].status, 'slp');
	});

	it(`should let Tera Shell take not very effective damage`, function () {
		battle = common.createBattle({inverseMod: true}, [[
			{species: 'wynaut', moves: ['wickedblow']},
		], [
			{species: 'Terapagos-Terastal', ability: 'terashell', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const terapagos = battle.p2.active[0];
		const damage = terapagos.maxhp - terapagos.hp;
		assert.bounded(damage, [14, 16], `Tera Shell should yield not very effective damage roll, actual damage taken is ${damage}`);

		battle.makeChoices();
		assert.bounded(terapagos.maxhp - terapagos.hp - damage, [28, 33], `Tera Shell should not reduce damage, because Terapagos-Terastal was not at full HP`);
	});
});
