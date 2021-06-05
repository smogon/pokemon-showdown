/**
 * Tests for Gen 2 randomized formats
 */
'use strict';

const {testHiddenPower} = require('./tools');

describe('[Gen 2] Random Battle', () => {
	const options = {format: 'gen2randombattle'};

	it('should prevent double Hidden Power', () => testHiddenPower('scyther', options));
});
