/**
 * Tests for the Data Search chat plugin
 */

'use strict';

const assert = require('../../assert').strict;

const datasearch = require('../../../.server-dist/chat-plugins/datasearch');

describe("Datasearch Plugin", () => {
	it('should return pokemon with pivot moves', async () => {
		const cmd = 'ds';
		const target = 'pivot|batonpass';
		const dexSearch = datasearch.testables.runDexsearch(target, cmd, true, `/${cmd} ${target}`, true);
		assert(dexSearch.results.includes('Absol'));
	});

	it('should return pokemon with pivot moves, but not baton pass', async () => {
		const cmd = 'ds';
		const target = 'pivot';
		const dexSearch = datasearch.testables.runDexsearch(target, cmd, true, `/${cmd} ${target}`, true);
		assert.false(dexSearch.results.includes('Absol'));
		assert(dexSearch.results.includes('Abra'));
	});

	it('should return pivot moves', async () => {
		const cmd = 'ms';
		const target = 'pivot';
		const moveSearch = datasearch.testables.runMovesearch(target, cmd, true, `/${cmd} ${target}`, true);
		assert(moveSearch.results.includes('U-turn'));
	});
});
