/**
 * Tests for Gen 5 randomized formats
 */
'use strict';

const {testHiddenPower} = require('./tools');

describe('[Gen 5] Random Battle', () => {
	const options = {format: 'gen5randombattle'};

	it('should prevent double Hidden Power', () => testHiddenPower('ampharos', options));
});
