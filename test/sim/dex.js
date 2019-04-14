'use strict';

const assert = require('./../assert');

describe('Mod loader', function () {
	it.skip('should work fine in any order', function () {
		{
			Chat.uncacheTree('./.sim-dist/dex');
			let Dex = require('./../../../.sim-dist/dex');
			assert.strictEqual(Dex.mod('gen2').getTemplate('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.strictEqual(Dex.mod('gen2').getMove('crunch').secondaries[0].boosts.def, undefined);
		}
		{
			Chat.uncacheTree('./.sim-dist/dex');
			let Dex = require('./../../../.sim-dist/dex');
			Dex.mod('gen2').getTemplate('nidoking');
			Dex.mod('gen4').getMove('crunch');
			assert.strictEqual(Dex.mod('gen2').getTemplate('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.strictEqual(Dex.mod('gen2').getMove('crunch').secondaries[0].boosts.def, undefined);
		}
	});
});

describe('Dex#getEffect', function () {
	it('returns the same object for the same id', function () {
		assert.strictEqual(Dex.getEffect('Stealth Rock'), Dex.getEffect('stealthrock'));
		assert.notStrictEqual(Dex.getEffect('move: Stealth Rock'), Dex.getEffect('stealthrock'));
	});

	it('does not return elements from the Object prototype', function () {
		assert.false(Dex.getEffect('constructor').exists);
	});
});
