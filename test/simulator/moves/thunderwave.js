'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Thunder Wave', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should inflict paralysis on its target', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Jolteon", ability: 'quickfeet', moves: ['thunderwave']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Vaporeon", ability: 'hydration', moves: ['aquaring']}]);
		battle.makeChoices('move thunderwave', 'move aquaring');
		assert.strictEqual(battle.p2.active[0].status, 'par');
	});

	it('should not ignore natural type immunities', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Jolteon", ability: 'quickfeet', moves: ['thunderwave']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Hippowdon", ability: 'sandforce', moves: ['slackoff']}]);
		battle.makeChoices('move thunderwave', 'move slackoff');
		assert.strictEqual(battle.p2.active[0].status, '');
	});
});
