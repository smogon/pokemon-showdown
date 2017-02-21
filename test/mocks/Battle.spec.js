'use strict';
const assert = require('../assert');
const Battle = require('./Battle');

describe('Battle', function () {
	it('should reset the PRNG to original when resetRNG is called', function () {
		const battle = Battle.construct();
		const initialPrng = battle.prng.clone();
		battle.random();
		assert.notDeepEqual(initialPrng, battle.prng, 'the prng should have changed');
		battle.resetRNG();
		assert.deepEqual(initialPrng, battle.prng, 'the prng was not reset');
	});
});
