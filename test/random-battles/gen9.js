/**
 * Tests for Gen 9 randomized formats
 */
'use strict';

const { testTeam, testAlwaysHasMove } = require('./tools');
const assert = require('../assert');

describe('[Gen 9] Random Battle (slow)', () => {
	const options = { format: 'gen9randombattle' };
	it("should always give Iron Bundle Freeze-Dry", () => {
		testAlwaysHasMove('ironbundle', options, 'freezedry');
	});
});

describe('[Gen 9] 9 for 9 Random Battle (slow)', () => {
	const options = { format: 'gen99for9randombattle' };

	it('should have no more than three Pokemon of any type', () => {
		testTeam({ ...options, rounds: 200 }, team => {
			assert.equal(team.length, 9);
			const typeCount = new Map();
			for (const set of team) {
				for (const type of Dex.species.get(set.species).types) {
					typeCount.set(type, (typeCount.get(type) || 0) + 1);
				}
			}
			for (const [type, count] of typeCount) {
				assert(count <= 3, `${count} ${type}-type Pokemon in ${team.map(set => set.species).join(', ')}`);
			}
		});
	});
});

describe('[Gen 9] Monotype Random Battle (slow)', () => {
	const options = { format: 'gen9monotyperandombattle' };

	it('all Pokemon should share a common type', () => {
		testTeam({ ...options, rounds: 100 }, team => {
			assert.legalTeam(team, 'gen9customgame@@@sametypeclause');
		});
	});
});
