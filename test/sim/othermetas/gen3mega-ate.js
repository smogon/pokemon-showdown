'use strict';

const assert = require('./../../assert');
const Dex = require('./../../../dist/sim').Dex;

// The custom [Gen 3] Megas formats (mod 'gen3mega') re-legalize the later-gen
// "-ate" type-changing abilities for the ported Mega formes. These must use the
// Gen 7+ 1.2x (4915/4096) power boost, NOT Gen 6's 1.3x (5325/4096) which the mod
// would otherwise inherit through the chain (gen3mega -> gen3 -> ... -> gen6,
// where gen6 overrides onBasePower to 1.3x). See data/mods/gen3mega/abilities.ts.
const GEN7_ATE_MOD = [4915, 4096]; // 1.2x
const GEN6_ATE_MOD = [5325, 4096]; // 1.3x

// -ate abilities actually legal in gen3mega. Pixilate/Galvanize are deliberately
// NOT re-legalized (no Fairy type in Gen 3); Dragonize is a custom, base-only
// ability with no gen6 override, so it already resolves to 1.2x — assert that too.
const ATES = ['aerilate', 'refrigerate', 'dragonize'];

// Invoke the resolved ability's onBasePower with a minimal context that captures
// the chainModify argument, with the move flagged as type-changed by this ability.
function capturedBoost(ability) {
	let captured = null;
	const context = {
		effect: ability,
		chainModify(arg) { captured = arg; return arg; },
	};
	ability.onBasePower.call(context, 100, {}, {}, { typeChangerBoosted: ability });
	return captured;
}

describe('[Gen 3] Megas -ate abilities', () => {
	for (const id of ATES) {
		it(`${id} should apply the Gen 7+ 1.2x boost, not Gen 6's 1.3x`, () => {
			const ability = Dex.mod('gen3mega').abilities.get(id);
			assert(ability.exists, `${id} should exist in gen3mega`);
			assert.equal(ability.isNonstandard, null, `${id} should be legal in gen3mega`);
			assert.equal(typeof ability.onBasePower, 'function', `${id} should have an onBasePower handler`);

			const boost = capturedBoost(ability);
			assert.deepEqual(boost, GEN7_ATE_MOD, `${id} should boost by 1.2x (4915/4096)`);
			assert.notDeepEqual(boost, GEN6_ATE_MOD, `${id} must not use Gen 6's 1.3x (5325/4096)`);
		});
	}

	it('sanity: base (modern) gen still uses 1.2x and gen6 still uses 1.3x', () => {
		assert.deepEqual(capturedBoost(Dex.abilities.get('aerilate')), GEN7_ATE_MOD);
		assert.deepEqual(capturedBoost(Dex.mod('gen6').abilities.get('aerilate')), GEN6_ATE_MOD);
	});
});
