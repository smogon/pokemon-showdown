'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Smelling Salts', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cure a paralyzed target', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Meloetta", ability: 'serenegrace', moves: ['smellingsalts', 'thunderwave']}]});
		battle.setPlayer('p2', {team: [{species: "Dragonite", ability: 'multiscale', moves: ['roost']}]});
		battle.makeChoices('move thunderwave', 'move roost');
		battle.makeChoices('move smellingsalts', 'move roost');
		assert.notEqual(battle.p2.active[0].status, 'par');
	});
});
