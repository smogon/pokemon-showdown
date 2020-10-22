'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Imposter', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should Transform into the opposing Pokemon facing it', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Ditto", ability: 'imposter', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: "Hoopa-Unbound", ability: 'magician', moves: ['rest']}]});
		assert.equal(battle.p1.active[0].species, battle.p2.active[0].species);
	});

	it('should be blocked by substitutes', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Escavalier", ability: 'shellarmor', moves: ['substitute']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Shuckle", ability: 'sturdy', moves: ['uturn']},
			{species: "Ditto", ability: 'imposter', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move substitute', 'move uturn');
		battle.makeChoices('', 'switch ditto');
		assert.notEqual(battle.p2.active[0].species, battle.p1.active[0].species);
	});

	it('should not activate if Skill Swapped', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Shuckle", ability: 'imposter', moves: ['sleeptalk', 'skillswap']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Ditto", ability: 'imposter', moves: ['sleeptalk']},
			{species: "Greninja", ability: 'torrent', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move skillswap', 'switch greninja');
		assert.notEqual(battle.p1.active[0].species, battle.p2.active[0].species);
	});
});
