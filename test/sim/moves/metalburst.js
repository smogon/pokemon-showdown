'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Metal Burst', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should run conditions for submove`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'snorlax', moves: ['sleeptalk', 'metalburst']},
			{species: 'golem', moves: ['sleeptalk', 'tackle']},
		], [
			{species: 'breloom', moves: ['sleeptalk', 'sonicboom']},
			{species: 'venusaur', moves: ['sleeptalk', 'spore']},
		]]);

		battle.makeChoices('move metalburst, move tackle -1', 'move sonicboom 1, move sleeptalk');
		const breloom = battle.p2.active[0];
		assert.equal(breloom.hp, breloom.maxhp - battle.dex.moves.get('sonicboom').damage * 1.5);

		battle.makeChoices('auto', 'move sonicboom 1, move spore 1');
		assert.equal(breloom.hp, breloom.maxhp - battle.dex.moves.get('sonicboom').damage * 1.5 * 2);
	});

	it(`should target the opposing Pokemon that hit the user with an attack most recently that turn`, function () {
		// The seed should select venusaur if the test would otherwise fail
		battle = common.createBattle({gameType: 'doubles', seed: [3, 4, 5, 6]}, [[
			{species: 'snorlax', moves: ['metalburst']},
			{species: 'tauros', moves: ['sleeptalk']},
		], [
			{species: 'breloom', moves: ['uturn']},
			{species: 'venusaur', moves: ['swift']},
			{species: 'gallade', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move metalburst, move sleeptalk', 'move uturn 1, move swift');
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
		assert.fullHP(battle.p2.active[1]);
	});

	it(`should deal 1 damage if the user was hit by a 0-damage attack`, function () {
		battle = common.createBattle([[
			{species: 'munchlax', ability: 'sturdy', moves: ['sleeptalk', 'metalburst']},
		], [
			{species: 'breloom', moves: ['closecombat', 'falseswipe']},
		]]);

		battle.makeChoices('move sleeptalk', 'move closecombat');
		battle.makeChoices('move metalburst', 'move falseswipe');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp - 1);
	});

	it(`should be subject to redirection`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'shuckle', moves: ['metalburst']},
			{species: 'chansey', ability: 'moldbreaker', moves: ['electrify', 'sleeptalk']},
		], [
			{species: 'blissey', moves: ['dragonrage']},
			{species: 'manectric', ability: 'lightningrod', moves: ['sleeptalk', 'followme']},
		]]);
		const blissey = battle.p2.active[0];
		const manectric = battle.p2.active[1];
		battle.makeChoices('move metalburst, move electrify -1', 'move dragonrage 1, move sleeptalk');
		assert.fullHP(blissey);
		assert.statStage(manectric, 'spa', 1);
		battle.makeChoices('move metalburst, move sleeptalk', 'move dragonrage 1, move followme');
		assert.fullHP(blissey);
		assert.equal(manectric.hp, manectric.maxhp - battle.dex.moves.get('dragonrage').damage * 1.5);
	});
});
