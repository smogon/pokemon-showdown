'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Overflow Stat Mod', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should cap stats at 654 after a positive nature', () => {
		battle = common.createBattle({ overflowStatMod: true }, [[
			{ species: 'Eternatus-Eternamax', ability: 'Neutralizing Gas', moves: ['tackle'], nature: 'bold', evs: { def: 252 } },
		], [
			{ species: 'Magikarp', ability: 'Damp', moves: ['tackle'], nature: 'bold', evs: { def: 1 } },
		]]);
		const eternamax = battle.p1.active[0];
		const def = eternamax.getStat('def');

		assert.equal(def, 654);
	});
});
