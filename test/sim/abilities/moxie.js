'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Moxie', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should boost Attack when its user KOs a Pokemon', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Krookodile", ability: 'moxie', moves: ['crunch']}]});
		battle.setPlayer('p2', {team: [{species: "Shedinja", moves: ['sleeptalk']}, {species: 'Magikarp', moves: ['splash']}]});
		battle.makeChoices('move crunch', 'move sleeptalk');
		assert.statStage(battle.p1.active[0], 'atk', 1);
	});

	it('should only activate once if multiple Pokemon are KOed', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Krookodile", ability: 'moxie', moves: ['earthquake']},
			{species: "Swanna", moves: ['tailwind']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Heatran", moves: ['sleeptalk']},
			{species: 'Magnezone', moves: ['sleeptalk']},
			{species: "Magikarp", moves: ['splash']},
		]});
		battle.makeChoices('move earthquake, move tailwind', 'move sleep talk, move sleep talk');
		assert.statStage(battle.p1.active[0], 'atk', 1);
	});
});
