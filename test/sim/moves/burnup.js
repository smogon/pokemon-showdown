'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Burn Up', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not thaw the user if it is not a Fire type', () => {
		battle = common.createBattle({
			seed: [0, 0, 0, 0],
			customRules: 'guaranteedsecondarymod',
		}, [
			[{ species: 'Moltres', moves: ['burnup'] }],
			[{ species: 'Piplup', moves: ['icebeam', 'sleeptalk'] }],
		]);
		const moltres = battle.p1.active[0];
		battle.makeChoices('move burnup', 'move icebeam');
		assert.equal(moltres.status, 'frz');
		battle.makeChoices('move burnup', 'move sleeptalk');
		assert.equal(moltres.status, 'frz');
	});
});
