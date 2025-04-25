'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Rough Skin', () => {
	afterEach(() => {
		battle.destroy();
	});

	// Yes, we really need a test for this
	it("should not activate twice on moves with secondary effects", () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Shedinja', ability: 'roughskin', moves: ['sleeptalk'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Pachirisu', ability: 'voltabsorb', moves: ['nuzzle'] }] });
		battle.makeChoices('auto', 'move nuzzle');
		const pachi = battle.p2.active[0];
		assert.equal(pachi.hp, Math.ceil(pachi.maxhp - pachi.maxhp / 8));
	});
});
