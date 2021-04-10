
/**
 * Tests for Gen 6 randomized formats
 */
'use strict';

const {testNotBothMoves} = require('./tools');

describe('[Gen 6] Random Battle', () => {
	const options = {format: 'gen6randombattle'};

	it('should not select Air Slash and Hurricane together', () => {
		testNotBothMoves('swanna', options, 'hurricane', 'airslash');
	});
});
