'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Inverse Battle', function () {
	beforeEach(() => (battle = common.createBattle({inverseMod: true})));
	afterEach(() => battle.destroy());

	it('should change natural resistances into weaknesses', function () {
		battle.setPlayer('p1', {team: [{species: "Hariyama", ability: 'guts', moves: ['vitalthrow']}]});
		battle.setPlayer('p2', {team: [{species: "Scyther", ability: 'swarm', moves: ['roost']}]});
		battle.makeChoices('move vitalthrow', 'move roost');
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it('should change natural weaknesses into resistances', function () {
		battle.setPlayer('p1', {team: [{species: "Hariyama", ability: 'guts', moves: ['vitalthrow']}]});
		battle.setPlayer('p2', {team: [{species: "Absol", ability: 'pressure', moves: ['leer']}]});
		battle.makeChoices('move vitalthrow', 'move leer');
		battle.makeChoices('move vitalthrow', 'move leer');
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-resisted|'));
	});

	it('should negate natural immunities and make them weaknesses', function () {
		battle.setPlayer('p1', {team: [{species: "Hariyama", ability: 'guts', moves: ['vitalthrow']}]});
		battle.setPlayer('p2', {team: [{species: "Dusknoir", ability: 'frisk', moves: ['rest']}]});
		battle.makeChoices('move vitalthrow', 'move rest');
		battle.makeChoices('move vitalthrow', 'move rest');
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should affect Stealth Rock damage', function () {
		battle.setPlayer('p1', {team: [{species: "Smeargle", moves: ['splash', 'stealthrock']}]});
		battle.setPlayer('p2', {team: [
			{species: "Ninjask", moves: ['protect']},
			{species: "Steelix", moves: ['rest']},
			{species: "Hitmonchan", moves: ['rest']},
			{species: "Chansey", moves: ['wish']},
			{species: "Staraptor", moves: ['roost']},
			{species: "Volcarona", moves: ['roost']},
		]});
		battle.makeChoices('move stealthrock', 'move protect');
		let pokemon;
		for (let i = 2; i <= 6; i++) {
			battle.makeChoices('move splash', 'switch ' + i);
			pokemon = battle.p2.active[0];
			const expectedPercent = Math.pow(0.5, i - 1);
			const expectedDamage = Math.floor(pokemon.maxhp * expectedPercent);
			assert.equal(pokemon.maxhp - pokemon.hp, expectedDamage, `${pokemon.name} should take ${expectedPercent * 100}%`);
		}
	});

	it('should affect the resistance of Delta Stream', function () {
		battle.setPlayer('p1', {team: [{species: "Rayquaza-Mega", ability: 'deltastream', moves: ['hiddenpowerbug']}]});
		battle.setPlayer('p2', {team: [{species: "Rayquaza-Mega", ability: 'deltastream', moves: ['hiddenpowerbug']}]});
		battle.makeChoices('move hiddenpower', 'move hiddenpower');
		battle.makeChoices('move hiddenpower', 'move hiddenpower');
		assert(!battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it('should make Ghost/Grass types take neutral damage from Flying Press', function () {
		battle.setPlayer('p1', {team: [{species: "Hawlucha", ability: 'unburden', moves: ['flyingpress']}]});
		battle.setPlayer('p2', {team: [{species: "Gourgeist", ability: 'insomnia', moves: ['shadowsneak']}]});
		battle.makeChoices('move flyingpress', 'move shadowsneak');
		battle.makeChoices('move flyingpress', 'move shadowsneak');
		assert(!battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it('should not affect ability-based immunities', function () {
		battle.setPlayer('p1', {team: [{species: "Hariyama", ability: 'guts', moves: ['earthquake']}]});
		battle.setPlayer('p2', {team: [{species: "Mismagius", ability: 'levitate', moves: ['shadowsneak']}]});
		battle.makeChoices('move earthquake', 'move shadowsneak');
		battle.makeChoices('move earthquake', 'move shadowsneak');
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-immune|'));
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not affect the type effectiveness of Freeze Dry on Water-type Pokemon', function () {
		battle.setPlayer('p1', {team: [{species: "Lapras", ability: 'waterabsorb', moves: ['freezedry']}]});
		battle.setPlayer('p2', {team: [{species: "Floatzel", ability: 'waterveil', moves: ['aquajet']}]});
		battle.makeChoices('move freezedry', 'move aquajet');
		battle.makeChoices('move freezedry', 'move aquajet');
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|-supereffective|'));
	});

	it('should not affect the "ungrounded" state of Flying-type Pokemon', function () {
		battle.setPlayer('p1', {team: [{species: "Parasect", ability: 'dryskin', moves: ['spore']}]});
		battle.setPlayer('p2', {team: [{species: "Talonflame", ability: 'galewings', moves: ['mistyterrain']}]});
		battle.makeChoices('move spore', 'move mistyterrain');
		battle.makeChoices('move spore', 'move mistyterrain');
		assert.equal(battle.p2.active[0].status, 'slp');
	});
});
