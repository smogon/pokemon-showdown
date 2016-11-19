'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Pursuit`, function () {
	afterEach(() => battle.destroy());

	it(`should execute before the target switches out and after the user mega evolves`, function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Beedrill", ability: 'swarm', item: 'beedrillite', moves: ['pursuit']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Alakazam", ability: 'magicguard', moves: ['psyshock']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}]);
		battle.p1.chooseMove('pursuit', null, true);
		battle.p2.chooseSwitch(2);
		assert.species(battle.p1.active[0], "Beedrill-Mega");
		assert.fainted(battle.p2.active[0]);
	});
});
