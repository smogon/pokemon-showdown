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
});
