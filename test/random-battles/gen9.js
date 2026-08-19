/**
 * Tests for Gen 9 randomized formats
 */
'use strict';

const { testTeam, testAlwaysHasMove } = require('./tools');
const assert = require('../assert');
const { validateLearnset } = require('./tools');
const { default: Dex } = require('../../dist/sim/dex');

describe('[Gen 9] Random Battle (slow)', () => {
	const options = { format: 'gen9randombattle' };
	it("should always give Iron Bundle Freeze-Dry", () => {
		testAlwaysHasMove('ironbundle', options, 'freezedry');
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

describe('[Gen 9 Champions] Random Doubles Battle (slow)', () => {
	const setsJSON = require(`../../dist/data/random-battles/champions/doubles-sets.json`);
	const dex = Dex.forFormat('gen9championsrandomdoublesbattle');
	const mod = dex.currentMod;
	for (const [id, sets] of Object.entries(setsJSON)) {
		const species = dex.species.get(id);
		// Pokemon that learn Detect should run it instead of Protect, unless it is alongside Imprison.
		if (validateLearnset(dex.moves.get('Detect'), { species }, 'ou', mod)) {
			for (const set of sets.sets) {
				assert.false(set.movepool.includes('Protect') && !set.movepool.includes('Imprison'), `${species.name} runs Protect despite learning Detect`);
			}
		}
	}
});
