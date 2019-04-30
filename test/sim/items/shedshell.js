'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shed Shell', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should allow Pokemon to escape trapping abilities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Gothitelle", ability: 'shadowtag', moves: ['calmmind']}]});
		battle.setPlayer('p2', {team: [
			{species: "Starmie", ability: 'naturalcure', item: 'shedshell', moves: ['recover']},
			{species: "Heatran", ability: 'flashfire', moves: ['rest']},
		]});
		battle.makeChoices('move calmmind', 'switch 2');
		assert.species(battle.p2.active[0], 'Heatran');
	});

	it('should allow Pokemon to escape from most moves that would trap them', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Gengar", ability: 'levitate', moves: ['meanlook']}]});
		battle.setPlayer('p2', {team: [
			{species: "Venusaur", ability: 'overgrow', item: 'shedshell', moves: ['ingrain']},
			{species: "Heatran", ability: 'flashfire', moves: ['rest']},
		]});
		battle.makeChoices('move meanlook', 'move ingrain');
		battle.makeChoices('move meanlook', 'switch 2');
		assert.species(battle.p2.active[0], 'Heatran');
	});

	it('should not allow Pokemon to escape from Sky Drop', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Dragonite", ability: 'multiscale', moves: ['skydrop']}]});
		battle.setPlayer('p2', {team: [
			{species: "Magnezone", ability: 'sturdy', item: 'shedshell', moves: ['sleeptalk']},
			{species: "Heatran", ability: 'flashfire', moves: ['rest']},
		]});
		battle.makeChoices('move skydrop', 'move sleeptalk');
		assert.trapped(() => battle.makeChoices('move skydrop', 'switch 2'));
		assert.species(battle.p2.active[0], 'Magnezone');
	});
});
