/**
 * Tests for Gen 7 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testSet} = require('./tools');

describe('[Gen 7] Random Battle (slow)', () => {
	const options = {format: 'gen7randombattle'};

	it('should not give mega evolution abilities to base formes', () => {
		testSet('manectricmega', {rounds: 1, ...options}, set => {
			assert(set.ability !== 'Intimidate', 'Mega Manectric should not have Intimidate before it mega evolves');
		});
	});

	it('should not give Ursaring Eviolite', () => {
		testSet('ursaring', options, set => assert.notEqual(set.item, 'Eviolite'));
	});
});
