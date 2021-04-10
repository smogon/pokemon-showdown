'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Metal Burst', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should run conditions for submove', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'snorlax', moves: ['sleeptalk', 'metalburst']},
			{species: 'golem', moves: ['sleeptalk', 'tackle']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'breloom', moves: ['sleeptalk', 'sonicboom']},
			{species: 'venusaur', moves: ['sleeptalk', 'spore']},
		]});
		battle.makeChoices('move metalburst, move tackle -1', 'move sonicboom 1, move sleeptalk');
		const breloomHpTurn1 = battle.p2.active[0].hp;
		assert.equal(breloomHpTurn1, battle.p2.active[0].maxhp - battle.dex.moves.get('sonicboom').damage * 1.5);
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sonicboom 1, move spore 1');
		assert.equal(battle.p2.active[0].hp, breloomHpTurn1 - battle.dex.moves.get('sonicboom').damage * 1.5);
	});

	it('should target the opposing Pokemon that hit the user with an attack most recently that turn', function () {
		// The seed should select venusaur if the test would otherwise fail
		battle = common.createBattle({gameType: 'doubles', seed: [3, 4, 5, 6]});
		battle.setPlayer('p1', {team: [
			{species: 'snorlax', moves: ['metalburst']},
			{species: 'tauros', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'breloom', moves: ['uturn']},
			{species: 'venusaur', moves: ['swift']},
			{species: 'gallade', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move metalburst, move sleeptalk', 'move uturn 1, move swift');
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
		assert.fullHP(battle.p2.active[1]);
	});

	it('should deal 1 damage if hit, but didn\'t take damage', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'snorlax', ability: 'sturdy', moves: ['sleeptalk', 'metalburst']}]});
		battle.setPlayer('p2', {team: [{species: 'breloom', moves: ['closecombat', 'falseswipe']}]});

		battle.makeChoices('move sleeptalk', 'move closecombat');
		battle.makeChoices('move metalburst', 'move falseswipe');
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp - 1);
	});

	it('should be subject to redirection', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'shuckle', moves: ['metalburst']},
			{species: 'chansey', ability: 'moldbreaker', moves: ['electrify', 'sleeptalk']},
		], [
			{species: 'blissey', moves: ['dragonrage']},
			{species: 'manectric', ability: 'lightningrod', moves: ['sleeptalk', 'followme']},
		]]);
		battle.makeChoices('move metalburst, move electrify -1', 'move dragonrage 1, move sleeptalk');
		assert.fullHP(battle.p2.active[0]);
		assert.equal(battle.p2.active[1].boosts.spa, 1);
		battle.makeChoices('move metalburst, move sleeptalk', 'move dragonrage 1, move followme');
		assert.fullHP(battle.p2.active[0]);
		assert.equal(battle.p2.active[1].hp, battle.p2.active[1].maxhp - 60);
	});
});
