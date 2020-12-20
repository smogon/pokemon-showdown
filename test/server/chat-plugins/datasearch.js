/**
 * Tests for the Data Search chat plugin
 */

'use strict';

const assert = require('assert').strict;

const datasearch = require('../../../.server-dist/chat-plugins/datasearch');

describe("Datasearch Plugin", () => {
	it('should return pivot moves', async () => {
		const results = datasearch.testables.runMovesearch('recovery', 'ms', true, '/ms recovery', true);
	});
});
