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
		battle.join('p1', 'Guest 1', 1, [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Tornadus", ability: 'defiant', moves: ['tailwind']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]);
		assert.false(battle.makeChoices('move counter', 'switch 2'));
		assert.species(p2.active[0], 'Tornadus');
	});

	it('should not prevent Pokemon from switching out using moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Tornadus", ability: 'defiant', moves: ['uturn']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]);
		battle.makeChoices('move counter', 'move uturn');
		battle.makeChoices('move counter', 'switch 2');
		assert.species(p2.active[0], 'Heatran');
	});

	it('should not prevent other Pokemon with Shadow Tag from switching out', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Gothitelle", ability: 'shadowtag', moves: ['psychic']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]);
		battle.makeChoices('move counter', 'switch 2');
		assert.species(p2.active[0], 'Heatran');
	});

	it('should not prevent Pokemon immune to trapping from switching out', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Wobbuffet", ability: 'shadowtag', moves: ['counter']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Gengar", ability: 'levitate', moves: ['curse']},
			{species: "Heatran", ability: 'flashfire', moves: ['roar']},
		]);
		battle.makeChoices('move counter', 'switch 2');
		assert.species(p2.active[0], 'Heatran');
	});
});
