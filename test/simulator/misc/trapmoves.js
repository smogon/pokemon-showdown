'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;
let trappers = ['Block', 'Mean Look', 'Spider Web', 'Thousand Waves'];
let partialtrappers = ['Bind', 'Clamp', 'Fire Spin', 'Infestation', 'Magma Storm', 'Sand Tomb', 'Whirlpool', 'Wrap'];

describe('Trapping Moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	for (let i = 0; i < trappers.length; i++) {
		it('should prevent Pokemon from switching out normally', function () {
			battle = common.createBattle();
			battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'prankster', moves: [toId(trappers[i])]}]);
			battle.join('p2', 'Guest 2', 1, [
				{species: "Tangrowth", ability: 'leafguard', moves: ['swordsdance']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]);
			battle.commitDecisions();
			battle.choose('p2', 'switch 2');
			battle.commitDecisions();
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'tangrowth');
		});

		it('should not prevent Pokemon from switching out using moves', function () {
			battle = common.createBattle();
			battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'prankster', moves: [toId(trappers[i])]}]);
			battle.join('p2', 'Guest 2', 1, [
				{species: "Tangrowth", ability: 'leafguard', moves: ['batonpass']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]);
			battle.commitDecisions();
			battle.choose('p2', 'switch 2');
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
		});

		it('should not prevent Pokemon immune to trapping from switching out', function () {
			battle = common.createBattle();
			battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'prankster', moves: [toId(trappers[i])]}]);
			battle.join('p2', 'Guest 2', 1, [
				{species: "Gourgeist", ability: 'insomnia', moves: ['synthesis']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]);
			battle.commitDecisions();
			battle.choose('p2', 'switch 2');
			battle.commitDecisions();
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
		});

		it('should stop trapping the Pokemon if the user is no longer active', function () {
			battle = common.createBattle();
			battle.join('p1', 'Guest 1', 1, [
				{species: "Smeargle", ability: 'prankster', moves: [toId(trappers[i])]},
				{species: "Kyurem", ability: 'pressure', moves: ['rest']},
			]);
			battle.join('p2', 'Guest 2', 1, [
				{species: "Tangrowth", ability: 'leafguard', moves: ['roar']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]);
			battle.commitDecisions();
			battle.choose('p2', 'switch 2');
			battle.commitDecisions();
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
		});
	}
});

describe('Partial Trapping Moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	for (let i = 0; i < partialtrappers.length; i++) {
		it('should deal 1/8 HP per turn', function () {
			battle = common.createBattle();
			battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'noguard', moves: [toId(partialtrappers[i]), 'rest']}]);
			battle.join('p2', 'Guest 2', 1, [{species: "Blissey", ability: 'naturalcure', moves: ['healbell']}]);
			battle.commitDecisions();
			let pokemon = battle.p2.active[0];
			pokemon.heal(pokemon.maxhp);
			battle.choose('p1', 'move 2');
			battle.commitDecisions();
			assert.strictEqual(pokemon.maxhp - pokemon.hp, battle.modify(pokemon.maxhp, 1 / 8));
		});

		it('should prevent Pokemon from switching out normally', function () {
			battle = common.createBattle();
			battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'noguard', moves: [toId(partialtrappers[i])]}]);
			battle.join('p2', 'Guest 2', 1, [
				{species: "Blissey", ability: 'naturalcure', moves: ['healbell']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]);
			battle.commitDecisions();
			battle.choose('p2', 'switch 2');
			battle.commitDecisions();
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'blissey');
		});

		it('should not prevent Pokemon from switching out using moves', function () {
			battle = common.createBattle();
			battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'noguard', moves: [toId(partialtrappers[i])]}]);
			battle.join('p2', 'Guest 2', 1, [
				{species: "Blissey", ability: 'naturalcure', moves: ['batonpass']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]);
			battle.commitDecisions();
			battle.choose('p2', 'switch 2');
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
		});

		it('should not prevent Pokemon immune to trapping from switching out', function () {
			battle = common.createBattle();
			battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'noguard', moves: [toId(partialtrappers[i])]}]);
			battle.join('p2', 'Guest 2', 1, [
				{species: "Dusknoir", ability: 'frisk', moves: ['sleeptalk']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]);
			battle.commitDecisions();
			battle.choose('p2', 'switch 2');
			battle.commitDecisions();
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
		});

		it('should stop trapping the Pokemon if the user is no longer active', function () {
			battle = common.createBattle();
			battle.join('p1', 'Guest 1', 1, [
				{species: "Smeargle", ability: 'noguard', moves: [toId(partialtrappers[i])]},
				{species: "Kyurem", ability: 'pressure', moves: ['rest']},
			]);
			battle.join('p2', 'Guest 2', 1, [
				{species: "Blissey", ability: 'naturalcure', moves: ['roar']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]);
			battle.commitDecisions();
			battle.choose('p2', 'switch 2');
			battle.commitDecisions();
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
		});

		it('should stop trapping the Pokemon if the target uses Rapid Spin', function () {
			battle = common.createBattle();
			battle.join('p1', 'Guest 1', 1, [
				{species: "Smeargle", ability: 'noguard', moves: [toId(partialtrappers[i])]},
				{species: "Kyurem", ability: 'pressure', moves: ['rest']},
			]);
			battle.join('p2', 'Guest 2', 1, [
				{species: "Blissey", ability: 'naturalcure', moves: ['rapidspin']},
				{species: "Starmie", ability: 'illuminate', moves: ['reflecttype']},
			]);
			battle.commitDecisions();
			battle.choose('p2', 'switch 2');
			battle.commitDecisions();
			assert.strictEqual(battle.p2.active[0].template.speciesid, 'starmie');
		});
	}
});
