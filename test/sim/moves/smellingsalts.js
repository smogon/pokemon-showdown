'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Smelling Salts', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should cure a paralyzed target', () => {
		battle = common.createBattle([[
			{ species: "Meloetta", ability: 'serenegrace', moves: ['smellingsalts', 'thunderwave'] },
		], [
			{ species: "Dragonite", ability: 'multiscale', moves: ['roost'] },
		]]);
		battle.makeChoices('move thunderwave', 'move roost');
		battle.makeChoices('move smellingsalts', 'move roost');
		assert.notEqual(battle.p2.active[0].status, 'par');
	});
});
