'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shadow Tag', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent most Pokemon from switching out normally', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]});
		battle.setPlayer('p2', {team: [
			{species: "Tornadus", ability: 'defiant', moves: ['tailwind']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]});
		assert.trapped(() => battle.makeChoices('move counter', 'switch 2'), true);
	});

	it('should not prevent Pokemon from switching out using moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]});
		battle.setPlayer('p2', {team: [
			{species: "Tornadus", ability: 'defiant', moves: ['uturn']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]});
		battle.makeChoices('move counter', 'move uturn');
		assert.doesNotThrow(() => battle.makeChoices('', 'switch 2'));
	});

	it('should not prevent other Pokemon with Shadow Tag from switching out', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]});
		battle.setPlayer('p2', {team: [
			{species: "Gothitelle", ability: 'shadowtag', moves: ['psychic']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]});
		assert.doesNotThrow(() => battle.makeChoices('move counter', 'switch 2'));
	});

	it('should not prevent Pokemon immune to trapping from switching out', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]});
		battle.setPlayer('p2', {team: [
			{species: "Gengar", ability: 'levitate', moves: ['curse']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]});
		assert.doesNotThrow(() => battle.makeChoices('move counter', 'switch 2'));
	});
});
