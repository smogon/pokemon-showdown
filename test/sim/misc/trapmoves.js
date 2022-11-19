'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;
const trappers = ['Block', 'Mean Look', 'Spider Web', 'Thousand Waves', 'Anchor Shot', 'Spirit Shackle'];
const partialtrappers = ['Bind', 'Clamp', 'Fire Spin', 'Infestation', 'Magma Storm', 'Sand Tomb', 'Whirlpool', 'Wrap'];

describe('Trapping Moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	for (const move of trappers) {
		it('should prevent Pokemon from switching out normally', function () {
			battle = common.createBattle();
			battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'prankster', moves: [toID(move)]}]});
			battle.setPlayer('p2', {team: [
				{species: "Tangrowth", ability: 'leafguard', moves: ['swordsdance']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]});
			battle.makeChoices('move ' + toID(move), 'move swordsdance');
			assert.trapped(() => battle.makeChoices('move ' + toID(move), 'switch 2'));
			assert.equal(battle.p2.active[0].species.id, 'tangrowth');
		});

		it('should not prevent Pokemon from switching out using moves', function () {
			battle = common.createBattle();
			battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'prankster', moves: [toID(move)]}]});
			battle.setPlayer('p2', {team: [
				{species: "Tangrowth", ability: 'leafguard', moves: ['batonpass']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]});
			battle.makeChoices('move ' + toID(move), 'move batonpass');
			battle.makeChoices('', 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should not prevent Pokemon immune to trapping from switching out', function () {
			battle = common.createBattle();
			battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'prankster', moves: [toID(move)]}]});
			battle.setPlayer('p2', {team: [
				{species: "Gourgeist", ability: 'insomnia', moves: ['synthesis']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]});
			battle.makeChoices('move ' + toID(move), 'move synthesis');
			battle.makeChoices('move ' + toID(move), 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should stop trapping the Pokemon if the user is no longer active', function () {
			battle = common.createBattle();
			battle.setPlayer('p1', {team: [
				{species: "Smeargle", ability: 'prankster', moves: [toID(move)]},
				{species: "Kyurem", ability: 'pressure', moves: ['rest']},
			]});
			battle.setPlayer('p2', {team: [
				{species: "Tangrowth", ability: 'leafguard', moves: ['roar']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]});
			battle.makeChoices('move ' + toID(move), 'move roar');
			battle.makeChoices('move rest', 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should free all trapped Pokemon if the user is no longer active', function () {
			battle = common.createBattle({gameType: 'doubles'});
			battle.setPlayer('p1', {team: [
				{species: "Smeargle", ability: 'prankster', moves: [toID(move)]},
				{species: "Cobalion", ability: 'justified', item: 'laggingtail', moves: ['swordsdance', 'closecombat']},
			]});
			battle.setPlayer('p2', {team: [
				{species: "Tangrowth", ability: 'leafguard', moves: ['synthesis']},
				{species: "Starmie", ability: 'illuminate', moves: ['recover']},
				{species: "Cradily", ability: 'suctioncups', moves: ['recover']},
				{species: "Hippowdon", ability: 'sandstream', moves: ['slackoff']},
			]});
			if (move !== 'Thousand Waves') {
				battle.makeChoices('move ' + toID(move) + ' 1, move swordsdance', 'move synthesis, move recover');
				battle.makeChoices('move ' + toID(move) + ' 2, move closecombat -1', 'move synthesis, move recover');
			} else {
				battle.makeChoices('move ' + toID(move) + ', move closecombat -1', 'move synthesis, move recover');
			}
			battle.makeChoices('move swordsdance', 'switch 3, switch 4');
			assert.equal(battle.p2.active[0].species.id, 'cradily');
			assert.equal(battle.p2.active[1].species.id, 'hippowdon');
		});

		if (trappers.indexOf(move) < 3) {
			// Only test on moves that existed in gen 4
			it('should be passed when the user uses Baton Pass in Gen 4', function () {
				battle = common.gen(4).createBattle();
				battle.setPlayer('p1', {team: [
					{species: "Smeargle", ability: 'prankster', moves: [toID(move), 'batonpass']},
					{species: "Shedinja", ability: 'wonderguard', moves: ['rest']},
				]});
				battle.setPlayer('p2', {team: [
					{species: "Tangrowth", ability: 'leafguard', moves: ['synthesis', 'roar']},
					{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
				]});
				battle.makeChoices('move ' + toID(move), 'move synthesis');
				battle.makeChoices('move batonpass', 'move synthesis');
				battle.makeChoices('switch 2', '');
				assert.equal(battle.p2.active[0].species.id, 'tangrowth');
				battle.makeChoices('move rest', 'move roar');
				battle.makeChoices('move batonpass', 'switch 2');
				assert.equal(battle.p2.active[0].species.id, 'starmie');
			});
		}
	}
});

describe('Partial Trapping Moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	for (const move of partialtrappers) {
		it('should deal 1/8 HP per turn', function () {
			battle = common.createBattle();
			battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'noguard', moves: [toID(move), 'rest']}]});
			battle.setPlayer('p2', {team: [{species: "Blissey", ability: 'naturalcure', moves: ['healbell']}]});
			battle.makeChoices('move ' + toID(move), 'move healbell');
			const pokemon = battle.p2.active[0];
			pokemon.heal(pokemon.maxhp);
			battle.makeChoices('move rest', 'move healbell');
			assert.equal(pokemon.maxhp - pokemon.hp, battle.modify(pokemon.maxhp, 1 / 8));
		});

		it('should prevent Pokemon from switching out normally', function () {
			battle = common.createBattle();
			battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'noguard', moves: [toID(move)]}]});
			battle.setPlayer('p2', {team: [
				{species: "Blissey", ability: 'naturalcure', moves: ['healbell']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]});
			battle.makeChoices('move ' + toID(move), 'move healbell');
			assert.trapped(() => battle.makeChoices('move ' + toID(move), 'switch 2'));
			assert.equal(battle.p2.active[0].species.id, 'blissey');
		});

		it('should not prevent Pokemon from switching out using moves', function () {
			battle = common.createBattle();
			battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'noguard', moves: [toID(move)]}]});
			battle.setPlayer('p2', {team: [
				{species: "Blissey", ability: 'naturalcure', moves: ['batonpass']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]});
			battle.makeChoices('move ' + toID(move), 'move batonpass');
			battle.makeChoices('', 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should not prevent Pokemon immune to trapping from switching out', function () {
			battle = common.createBattle();
			battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'noguard', moves: [toID(move)]}]});
			battle.setPlayer('p2', {team: [
				{species: "Dusknoir", ability: 'frisk', moves: ['sleeptalk']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]});
			battle.makeChoices('move ' + toID(move), 'move sleeptalk');
			battle.makeChoices('move ' + toID(move), 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should stop trapping the Pokemon if the user is no longer active', function () {
			battle = common.createBattle();
			battle.setPlayer('p1', {team: [
				{species: "Smeargle", ability: 'noguard', moves: [toID(move)]},
				{species: "Kyurem", ability: 'pressure', moves: ['rest']},
			]});
			battle.setPlayer('p2', {team: [
				{species: "Blissey", ability: 'naturalcure', moves: ['roar']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]});
			battle.makeChoices('move ' + toID(move), 'move roar');
			battle.makeChoices('move rest', 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should stop trapping the Pokemon if the target uses Rapid Spin', function () {
			battle = common.createBattle();
			battle.setPlayer('p1', {team: [
				{species: "Smeargle", ability: 'noguard', moves: [toID(move)]},
				{species: "Kyurem", ability: 'pressure', moves: ['rest']},
			]});
			battle.setPlayer('p2', {team: [
				{species: "Blissey", ability: 'naturalcure', moves: ['rapidspin']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]});
			battle.makeChoices('move ' + toID(move), 'move rapidspin');
			battle.makeChoices('move ' + toID(move), 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});
	}
});

describe('Partial Trapping Moves [Gen 1]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('Wrap ends when wrapped Pokemon dies of residual damage', function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Arbok", moves: ['wrap', 'toxic']}]});
		battle.setPlayer('p2', {team: [{species: "Rhydon", moves: ['splash']}, {species: "Exeggutor", moves: ['splash']}]});
		battle.makeChoices('move toxic', 'move splash');
		for (let i = 0; i < 6; i++) {
			battle.makeChoices();
		}
		assert(!battle.p1.active[0].volatiles['partialtrappinglock']);
	});

	it('Wrap ends when wrapped Pokemon switches to a Pokemon that dies of residual damage', function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Dragonite", moves: ['wrap', 'seismictoss', 'toxic'], evs: {hp: 255}}]});
		battle.setPlayer('p2', {team: [{species: "Mewtwo", moves: ['splash'], evs: {hp: 255}}, {species: "Exeggutor", moves: ['splash']}]});
		for (let i = 0; i < 4; i++) {
			battle.makeChoices('move seismictoss', 'auto');
		}
		battle.makeChoices('move toxic', 'auto');
		battle.makeChoices('move wrap', 'switch 2');
		battle.makeChoices('move wrap', 'switch 2');
		battle.makeChoices();
		assert(!battle.p1.active[0].volatiles['partialtrappinglock']);
	});

	it('Wrap ends when wrapper dies to residual damage', function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Dragonite", moves: ['wrap', 'splash']}, {species: "Exeggutor", moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: "Rhydon", moves: ['toxic']}]});
		battle.makeChoices('move splash', 'move toxic');
		for (let i = 0; i < 7; i++) {
			battle.makeChoices();
		}
		assert(!battle.p2.active[0].volatiles['partiallytrapped']);
	});

	it('Wrap ends when wrapper switches to a Pokemon that dies of residual damage', function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Rhydon", moves: ['splash'], evs: {hp: 255}}, {species: "Dragonite", moves: ['wrap']}]});
		battle.setPlayer('p2', {team: [{species: "Slowbro", moves: ['seismictoss', 'toxic']}]});
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
		}
		battle.makeChoices('move splash', 'move toxic');
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices();
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices();
		assert(!battle.p2.active[0].volatiles['partiallytrapped']);
	});
});
