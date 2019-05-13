'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;
let trappers = ['Block', 'Mean Look', 'Spider Web', 'Thousand Waves', 'Anchor Shot', 'Spirit Shackle'];
let partialtrappers = ['Bind', 'Clamp', 'Fire Spin', 'Infestation', 'Magma Storm', 'Sand Tomb', 'Whirlpool', 'Wrap'];

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
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'tangrowth');
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
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
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
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
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
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
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
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'cradily');
			assert.strictEqual(battle.p2.active[1].template.speciesid, 'hippowdon');
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
				assert.strictEqual(battle.p2.active[0].template.speciesid, 'tangrowth');
				battle.makeChoices('move rest', 'move roar');
				battle.makeChoices('move batonpass', 'switch 2');
				assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
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
			let pokemon = battle.p2.active[0];
			pokemon.heal(pokemon.maxhp);
			battle.makeChoices('move rest', 'move healbell');
			assert.strictEqual(pokemon.maxhp - pokemon.hp, battle.modify(pokemon.maxhp, 1 / 8));
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
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'blissey');
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
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
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
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
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
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
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
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
		});
	}
});
