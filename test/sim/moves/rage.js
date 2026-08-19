'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Rage [Gen 1]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it("Rage accuracy bug", () => {
		battle = common.gen(1).createBattle({ seed: [1, 1, 1, 0] }, [[
			{ species: "Nidoking", moves: ['rage'] },
		], [
			{ species: "Aerodactyl", moves: ['doubleteam'] },
		]]);
		const nidoking = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(nidoking.volatiles['rage'].accuracy, 255);
		battle.makeChoices();
		assert.equal(nidoking.volatiles['rage'].accuracy, 127);
		assert(battle.log.some(line => line.includes('-miss|p1a: Nidoking')));
	});
});
