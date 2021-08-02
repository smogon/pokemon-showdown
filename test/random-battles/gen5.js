/**
 * Tests for Gen 5 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testHiddenPower, testSet} = require('./tools');

describe('[Gen 5] Random Battle', () => {
	const options = {format: 'gen5randombattle'};

	it('should prevent double Hidden Power', () => {
		testHiddenPower('ampharos', options);
		testHiddenPower('venusaur', options);
	});

	it('should give Venusaur four moves', () => {
		testSet(
			'venusaur',
			{format: 'gen5randombattle', rounds: 1, seed: [2201, 2201, 2201, 2201]},
			set => assert.equal(set.moves.length, 4, `got ${JSON.stringify(set.moves)}`)
		);
	});

	it('should prevent unreleased HAs from being used', () => {
		testSet('chandelure', options, set => assert.notEqual(set.ability, 'Shadow Tag'));
	});
});
