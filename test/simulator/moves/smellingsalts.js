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
		battle.join('p1', 'Guest 1', 1, [{species: "Meloetta", ability: 'serenegrace', moves: ['smellingsalts', 'thunderwave']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dragonite", ability: 'multiscale', moves: ['roost']}]);
		battle.makeChoices('move thunderwave', 'move roost');
		battle.makeChoices('move smellingsalts', 'move roost');
		assert.notStrictEqual(battle.p2.active[0].status, 'par');
	});
});
