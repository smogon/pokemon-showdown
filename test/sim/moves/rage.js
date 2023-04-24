'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Rage [Gen 1]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it("Rage accuracy bug", function () {
		battle = common.gen(1).createBattle({seed: [1, 1, 1, 0]});
		battle.setPlayer('p1', {team: [{species: "Nidoking", moves: ['rage']}]});
		battle.setPlayer('p2', {team: [{species: "Aerodactyl", moves: ['doubleteam']}]});
		const nidoking = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(nidoking.volatiles['rage'].accuracy, 255);
		battle.makeChoices();
		assert.equal(nidoking.volatiles['rage'].accuracy, 127);
		assert(battle.log.some(line => line.includes('-miss|p1a: Nidoking')));
	});
});
