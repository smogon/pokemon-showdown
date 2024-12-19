/**
 * Tests for Gen 5 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testSet} = require('./tools');

describe('[Gen 5] Random Battle (slow)', () => {
	const options = {format: 'gen5randombattle'};

	it('should prevent unreleased HAs from being used', () => {
		testSet('chandelure', options, set => assert.notEqual(set.ability, 'Shadow Tag'));
	});

	it('should not give Ursaring Eviolite', () => {
		testSet('ursaring', options, set => assert.notEqual(set.item, 'Eviolite'));
	});
});
