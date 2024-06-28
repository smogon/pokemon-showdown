/**
 * Tests for Gen 9 randomized formats
 */
'use strict';

const {testTeam, testAlwaysHasMove} = require('./tools');
const assert = require('../assert');

describe('[Gen 9] Random Battle (slow)', () => {
	const options = {format: 'gen9randombattle'};
	it("should always give Iron Bundle Freeze-Dry", () => {
		testAlwaysHasMove('ironbundle', options, 'freezedry');
	});
});

describe('[Gen 9] Monotype Random Battle (slow)', () => {
	const options = {format: 'gen9monotyperandombattle'};

	it('all Pokemon should share a common type', function () {
		testTeam({...options, rounds: 100}, team => {
			assert.legalTeam(team, 'gen9customgame@@@sametypeclause');
		});
	});
});
