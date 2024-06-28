/**
 * Tests for Gen 6 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testSet} = require('./tools');

describe('[Gen 6] Random Battle (slow)', () => {
	const options = {format: 'gen6randombattle'};

	it('should not give mega evolution abilities to base formes', () => {
		testSet('manectricmega', {rounds: 1, ...options}, set => {
			assert(set.ability !== 'Intimidate', 'Mega Manectric should not have Intimidate before it mega evolves');
		});
	});

	it('should not give Ursaring Eviolite', () => {
		testSet('ursaring', options, set => assert.notEqual(set.item, 'Eviolite'));
	});

	it('should not give Raikou Volt Absorb', () => {
		testSet('raikou', options, set => assert.notEqual(set.ability, 'Volt Absorb'));
	});

	it('should not give Suicune Water Absorb', () => {
		testSet('suicune', options, set => assert.notEqual(set.ability, 'Water Absorb'));
	});

	it('should not give Entei Flash Fire', () => {
		testSet('entei', options, set => assert.notEqual(set.ability, 'Flash Fire'));
	});
});
