/**
 * Tests for Gen 3 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testSet, testAlwaysHasMove, testHiddenPower} = require('./tools');

describe('[Gen 3] Random Battle', () => {
	const options = {format: 'gen3randombattle'};

	it('should enforce STAB', () => {
		testSet('beautifly', options, set => assert(
			set.moves.some(m => m.startsWith('hiddenpower')),
			`bad Beautifly set: ${JSON.stringify(set.moves)} has no STAB`
		));

		testSet('lickitung', options, set => assert(
			set.moves.includes('return') || set.moves.includes('seismictoss'),
			`bad Lickitung set: ${JSON.stringify(set.moves)} has no STAB`
		));

		testAlwaysHasMove('delcatty', options, 'doubleedge');
	});

	it('should prevent double Hidden Power', () => {
		testHiddenPower('kingler', options);
		testHiddenPower('moltres', options);
	});
});
